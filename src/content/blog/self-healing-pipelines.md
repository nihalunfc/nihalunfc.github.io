---
title: "Pipelines that fix themselves: a crew of AI agents with no boss"
description: "More than half of all nights, a daily data pipeline breaks somewhere. I designed a decentralised crew of nine AI agents that finds, fixes and re-runs most of those failures before anyone reads the morning report."
date: 2026-11-05
tags: [Multi-agent, ETL, Data engineering, Dagster, AI agents]
---

## Most nights, something breaks

Every chain with more than a few locations runs the same routine overnight. A store, a hotel, a restaurant or a depot sends its exports: sales, stock, deliveries, hours worked, online orders. A scheduled job collects them, cleans them, loads a warehouse and refreshes the reports managers read at 7 in the morning.

The trouble is that small chances multiply. If each of 15 daily sources has a 5% chance of a problem on any night (a late file, a missing manual export, a renamed column, a file sent twice), the chance that all 15 arrive clean is 0.95 to the power of 15, about 44%. So more than half of all nights start with something broken, and that is before any bug in our own code.

In most teams nothing happens until a person opens the monitor at 9. Then that person reads logs, works out the cause, fixes it, re-runs the job by hand and refreshes the reports. Meanwhile managers spend the morning reading yesterday's numbers as if they were today's.

## My idea: a crew of agents with no boss

I wanted the pipeline to look after itself the way a good small team does. Each person has one job, nobody waits to be told what to do, and the whole team still moves as one.

So I designed a crew of nine AI agents. Each has one duty: watch, collect evidence, remember past fixes, give a verdict, write a fix, test it, check the rules, keep the record, and write the morning note. There is no boss agent giving orders. They all read and write one shared board, the incident log, and four rules keep them in step:

1. **Act on state, not orders.** An agent acts when an incident reaches the state it handles. "Evidence posted, no verdict yet" is the Triager's cue.
2. **Claim with a lease.** A claim expires after a few minutes, so if one agent stalls, a spare copy picks the task up.
3. **One writer per field.** Only the Triager writes verdicts and only the Verifier writes test results, so no agent overwrites another.
4. **Append, never edit.** The board and the ledger only grow, so every step can be traced and undone.

Most of the crew is plain code that costs nothing to run. Only three agents call a language model, and each starts with the cheapest one that can do its job. A small, fast model sorts the incident. A stronger model writes the fix and gets two tries, and the strongest gets one try only if those fail. After that the crew stops and hands a person the full trail.

Safety comes from the design, not from trust. Loads are idempotent, so running one twice gives the same result as once, and that makes re-running safe. Fixes are tested in a copy of the pipeline first. Code changes and anything outside the copy wait for a person's one-click approval. A [command centre](/projects/self-healing-pipelines/command-centre/) shows every agent's work live, with buttons to pause, stop, approve, revert a step, or rework from it.

## What it fixes, in numbers

I simulated 300 years of nightly runs, with the same faults hitting both a scheduled pipeline and the same pipeline run by the crew. Every rate is a stated assumption you can change, and the [simulation](/projects/self-healing-pipelines/simulate.py) is one Python file.

| Measure (simulated) | Scheduled pipeline | Agent crew |
| --- | --- | --- |
| Median time until the data is right again | 9.2 hours | 1.1 hours |
| People hours spent on breakages a year | 534 | 121 (including 2 hours a week of crew upkeep) |
| Wrong numbers that reach a report unnoticed, a year | 15 | 3 |
| Model cost a year | none | about $2 |

Two of these gains come straight from the crew having no boss:

- **More eyes, fewer misses.** A bad file has to get past four agents that each look at it from a different angle: its hash, its layout, its row count against history, and whether its totals tie out. If each catches half of bad files on its own, only 1 in 16 slips past all four. A single rule that catches 75% lets 1 in 4 through.
- **No single point of failure.** With one coordinator that is down on 2% of nights, everything stops on 2% of nights. With two copies of each role, a role stalls only when both copies are down, which happens on 0.04% of nights.

The [side-by-side comparison](/projects/self-healing-pipelines/compare/) walks through each step, from collecting the dirty exports to the morning dashboards, with the maths and charts. The [setup guide](/projects/self-healing-pipelines/setup-guide/) shows how to build it and where to connect your own systems.

## Limits, as of now

- **The numbers are a model.** They come from assumptions, not a real pipeline's history. The next step is to run the crew against a pipeline with faults planted on purpose and an answer key, and publish the measured figures.
- **Some waits stay.** When a person forgets a manual export, the crew drafts the note in minutes, but the sender still has to send the file.
- **People still approve code.** Merging a fix into production is a one-click human decision by design.
- **It needs a sound pipeline underneath.** Automatic re-runs are safe only when loads are idempotent, so that comes first.
- **Independence has to be real.** The "more eyes" maths only holds if the agents check different things. Four copies of the same check are one check.

I'm building it in the open, one milestone at a time, on the [project page](/projects/self-healing-pipelines/). If you run a daily pipeline for a chain of any kind, I'd like to hear which faults cost you the most mornings.
