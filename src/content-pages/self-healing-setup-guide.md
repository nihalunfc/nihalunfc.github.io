This guide rebuilds a daily pipeline (exports from shared mail folders, Dagster jobs, a data warehouse, triage, reports and dashboards) so that a decentralised crew of AI agents can find, fix and re-run most failures by itself. Names in angle brackets, such as `<warehouse>`, are placeholders for your own.

Steps 1 to 6 make the pipeline sturdier on their own, even before any agent is switched on. Steps 7 to 10 add the crew.

## What the demo uses, and where you connect your own

The demo pages run on a simulation: there is no live database or pipeline behind them. To run the crew for real, connect these points in this order.

| Part | In the demo | Connect yours here | Setting |
| --- | --- | --- | --- |
| Daily exports | Simulated faults | Shared mailbox rule or folder, SFTP drop or API pull | `LANDING_ROOT=<shared-folder>/exports` |
| Source contracts | Built into the script | One YAML file per source (step 2) | `contracts/<source>.yaml` |
| Orchestrator | Scripted timeline | Dagster, with sensors per source (step 3) | `DAGSTER_GRAPHQL_URL=http://<host>:3000/graphql` |
| Warehouse | None | Azure SQL, SQL Server, PostgreSQL, Snowflake or similar (steps 4-5) | `WAREHOUSE_URL` (loader login) |
| Read-only access for the crew | None | A login that can only `SELECT` | `CREW_RO_URL` (login `svc_crew_ro`) |
| Dev copy for testing fixes | None | A copy of the warehouse, refreshed weekly | `WAREHOUSE_DEV_URL` |
| Shared board and ledger | In the page's memory | Two tables in an `ops` schema (step 7) plus a git repository | `BOARD_URL`, `PIPELINE_REPO=<git-url>` |
| Language models | Fixed token counts | A Claude API key with a monthly spend limit | `ANTHROPIC_API_KEY` |
| Dashboards | Asset list only | Power BI dataset refresh or Tableau extract refresh API (step 6) | `POWERBI_WORKSPACE_ID` and `POWERBI_DATASET_ID`, or `TABLEAU_SITE` and `TABLEAU_EXTRACT_ID` |
| Command centre | Scripted night | A small read-and-write API over the board tables (step 9) | `/api/board` |

Keep every secret in environment variables or a secrets store, never in code or in the board.

## Before you start

| Need | Why | Example |
| --- | --- | --- |
| Python 3.11+ and Dagster (open source) | Runs the pipeline as assets and hosts the sensors the crew listens to | `pip install dagster dagster-webserver` |
| A dev copy of the warehouse | Every fix is tested here before production | `<warehouse>_dev` |
| A read-only warehouse login | The crew reads production but never writes to it | `svc_crew_ro` |
| A git repository for the pipeline code | Fixes arrive as branches; the Ledger commits each step | `<pipeline-repo>` |
| A Claude API key with a spend limit | Three of the nine agents call a model | Limit $20 a month |
| A shared folder or mailbox rule | Where the daily exports land today | `<shared-folder>/exports/` |

Plan about 4 to 6 weeks for one person, built in the order below.

## Step 1: from shared mail folders to a landing zone

The goal is that every file is kept exactly as it arrived, with a record of what arrived and when.

1. **Save attachments automatically.** Keep the existing mailbox rule, or replace it with a small poller (Microsoft Graph or IMAP) that saves each attachment to `landing/<source>/<business_date>/<original_name>`.
2. **Never overwrite.** If a file with the same name arrives twice, keep both and add a suffix. Overwriting is how a resend silently replaces a good file.
3. **Record a manifest row per file:**

```sql
CREATE TABLE ops.landing_manifest (
  file_id        BIGINT IDENTITY PRIMARY KEY,
  source         VARCHAR(64),
  business_date  DATE,
  file_name      VARCHAR(260),
  sha256         CHAR(64),
  size_bytes     BIGINT,
  sender         VARCHAR(256),
  arrived_at     DATETIME2,
  status         VARCHAR(16)  -- landed / loaded / quarantined / duplicate
);
```

4. **Keep a read-only original.** Copy each file to `raw/` and remove write permission. Nothing in the pipeline or the crew may edit `raw/`.
5. **Spot duplicates by hash, not by name.** A file whose `sha256` already exists for that source and date is marked `duplicate` and never loaded twice.

## Step 2: write a contract for each source

A contract says what a normal file looks like, so a broken one is caught before it loads. One small YAML file per source:

```yaml
source: pos_sales
arrives: {after: "04:30", before: "05:40"}   # local time
manual_export: false
owner: "<team or person who sends it>"
key: [location_id, transaction_id, line_no]
columns:
  location_id: int
  transaction_id: str
  business_date: date
  net_amt: decimal(12,2)
  is_refund: bool
rows: {compare: [last_4_weeks_same_weekday, same_day_last_year], tolerance_pct: 35}
tie_out: {column: net_amt, against: file_footer_total}
```

The contract is also what the crew reads when it investigates. A missing export with `manual_export: true` and an `owner` becomes a drafted note to that owner, not a code fix.

## Step 3: Dagster assets, partitions and sensors

Turn each job into assets partitioned by business date, so any single day can be re-run on its own.

```python
from dagster import asset, asset_check, AssetCheckResult, DailyPartitionsDefinition

daily = DailyPartitionsDefinition(start_date="2025-01-01")

@asset(partitions_def=daily)
def raw_pos_sales(context):
    day = context.partition_key
    ...  # read landing/pos_sales/<day>/, check the contract, load to staging

@asset_check(asset=raw_pos_sales)
def pos_sales_rows_normal(context):
    ...  # row count vs the same weekday over the last 4 weeks
    return AssetCheckResult(passed=ok, metadata={"rows": n, "expected": expected})
```

- **A sensor per source** watches the landing manifest and starts the partition when its file lands. Keep the 05:00 schedule only as a fallback.
- **Downstream assets** (facts, marts, report refresh) depend on their inputs, so they run only when the inputs are fresh.
- **Run-failure and check-failure sensors** write an incident to the shared board (step 7). This is the Watcher.

## Step 4: clean and stage

1. Check the contract: header, types, nulls in key columns, duplicate keys, row count.
2. Send failing rows to `quarantine.<source>` with the rule they broke. Never drop them silently.
3. Standardise dates, currency and units, and map codes (location, item, channel) through lookup tables, not code.
4. Tie out: staging totals must equal the file's own totals before the step passes.

## Step 5: load the warehouse idempotently

This is the most important design choice in the guide. A load that can run twice safely is what lets the crew re-run by itself.

```sql
MERGE dw.fact_sales AS t
USING stg.pos_sales AS s
  ON  t.location_id = s.location_id
  AND t.transaction_id = s.transaction_id
  AND t.line_no = s.line_no
WHEN MATCHED THEN UPDATE SET net_amt = s.net_amt, is_refund = s.is_refund, loaded_at = SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT (location_id, transaction_id, line_no, business_date, net_amt, is_refund, loaded_at)
  VALUES (s.location_id, s.transaction_id, s.line_no, s.business_date, s.net_amt, s.is_refund, SYSUTCDATETIME());
```

Or replace the whole day's partition in one transaction. Then add asset checks after each load: unique keys, totals tie out to staging, no missing dates.

## Step 6: reports and dashboards, refreshed on success

1. **Make the refresh the last asset in the graph.** Trigger the Power BI dataset or Tableau extract refresh through its REST API from a Dagster asset that depends on the marts. It then runs only when the data under it is fresh.
2. **Stamp freshness on every page.** Add a small table `ops.freshness(source, business_date, loaded_at, status)` to each model and show "data as of" plus a banner when any source is late.
3. **Refresh again after a fix.** When a source is repaired at 05:33, the same asset graph refreshes the reports before 07:00.
4. **Keep the morning note short.** The Reporter writes what broke overnight, what was fixed, and what still needs a person.

## Step 7: the shared board

The agents never call each other. They coordinate only through two append-only tables, so there is no boss process that can fail or become a bottleneck.

```sql
CREATE TABLE ops.incident (
  incident_id   VARCHAR(32) PRIMARY KEY,
  asset         VARCHAR(128),
  business_date DATE,
  fingerprint   CHAR(40),        -- job + error type + message pattern
  state         VARCHAR(24),     -- opened / evidence / verdict / patch / verified / waiting_person / rerun / closed / stopped
  paused        BIT DEFAULT 0,
  claimed_by    VARCHAR(64),     -- the agent copy holding the lease
  lease_until   DATETIME2
);
CREATE TABLE ops.incident_event (   -- the board; rows are only ever added
  event_id    BIGINT IDENTITY PRIMARY KEY,
  incident_id VARCHAR(32), at DATETIME2, agent VARCHAR(32), model VARCHAR(32),
  kind VARCHAR(24), body NVARCHAR(MAX), tokens_in INT, tokens_out INT,
  cost_usd DECIMAL(9,5), git_commit CHAR(40)
);
```

Four rules, enforced in code:

1. **Act on state, not orders.** An agent acts when an incident reaches the state it handles.
2. **Claim with a lease.** A claim expires after a few minutes, so a spare copy picks up a stalled task.
3. **One writer per field.** Only the Triager writes verdicts; only the Verifier writes test results.
4. **Append, never edit.** The board and the Ledger only grow, so every step can be traced and reverted.

## Step 8: the nine agents

Build them in this order. Each is a small program that loops: find incidents in my state, claim one, do my part, post the result, release the claim.

| Agent | Acts when the incident is | Does | Runs on |
| --- | --- | --- | --- |
| Watcher | (no incident yet) | Dagster run-failure and check-failure sensors open an incident | Code |
| Collector | opened | Builds a small evidence file: last 15 loads, manifest rows, header diff, row counts (under 3,000 tokens) | Code and read-only SQL |
| Memory | evidence | Looks up the fingerprint; a fix approved before is reused | Code |
| Triager | evidence, no stored fix | One of five verdicts: real fault, source gap, manual step missed, false alarm, not yet checked. Low confidence asks a stronger model | Claude Haiku, then Sonnet |
| Fixer | verdict is real fault | Writes a patch on branch `crew/incident-<id>`; up to 2 Sonnet tries, then 1 Opus try | Claude Sonnet, then Opus |
| Verifier | patch | Re-materialises the asset in the dev copy and runs tests and asset checks | Code and Dagster |
| Gate | verified, or a safe action proposed | Checks the action against an allow-list; safe re-runs go ahead, code and notes wait for a person | Code |
| Ledger | every event | One git commit per step; `revert <step>` and `restore` commands | Code and git |
| Reporter | closed | Morning note and pull request text | Claude Haiku |

Run two copies of each agent. If one stalls, its lease expires and the other picks the task up.

## Step 9: the command centre and per-incident threads

The command centre is a page over the two board tables and the Ledger. Each button only writes a board event, so people steer the crew the same way the agents coordinate.

| Button | Writes | Effect |
| --- | --- | --- |
| Pause / Resume | `paused = 1 / 0` | No agent claims the incident while it is paused |
| Stop and hand to me | `state = stopped` | Leases are released; the incident and its trail go to a person |
| Approve | event `approved` by a named person | The Gate lets the waiting merge or note go ahead |
| Revert | `git revert <commit>` and event `reverted` | Undoes one step; the incident pauses at that point |
| Rework from here | event `rework` with your note | Agents pick the incident up again from the first unfinished step |
| Pause crew / Stop crew | a global flag | Every agent stops claiming new work |

**Threads as command centres.** Each incident can also open its own Claude Code session or project thread, named after the incident. A person can talk to that thread ("try mapping the old column name too", "wait for the 07:30 file"), and the thread writes the instruction to the board as a `rework` event. The agents then act on it like any other change of state.

## Step 10: roll it out safely

1. **Weeks 1-2, shadow mode.** The crew writes verdicts and patches but changes nothing. Compare its verdicts with your own triage each morning.
2. **Week 3, safe actions.** Turn on automatic re-runs for late and duplicate files only. Both are safe because loads are idempotent.
3. **Week 4 on, one-click approvals.** Let the crew test patches in dev and draft notes to export owners, with a person approving each one.
4. **Measure from day one.** Time to fix, people minutes, silent errors found later, and model cost per incident, all from the board. Replace the simulated figures with these.

**Hard rules for the crew**

- It reads production only through the read-only login, and writes only to the dev copy, a git branch and the board.
- It never sends a message, deletes data, or changes a check's rule by itself. It drafts them.
- It never shows credentials, and keeps the API key in the environment.
- It stops at a cap per incident (for example 3 tries, 40,000 tokens or $0.50) and hands over the trail.

## License

This guide, the command centre and the simulation are open source under the [MIT License](/projects/self-healing-pipelines/LICENSE.txt). Anyone can use, change and run them, including commercially. Just keep the copyright notice: © 2026 Nihal Vellaramkallingal Sulaiman.
