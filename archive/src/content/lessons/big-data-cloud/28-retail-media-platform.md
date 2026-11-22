---
title: "Capstone: design a retail media data platform"
summary: "Every module in one design: the events, pipelines, stores, models and measurement behind a grocer's retail media network, with the capstone brief."
module: 7
minutes: 35
outcomes:
  - "Design an end-to-end retail media platform and justify each tool"
  - "Trace one campaign from set-up to an incrementality report"
  - "Produce a capstone design document and a working slice"
quiz:
  - q: "Where should exact, auditable billing numbers come from?"
    options: ["The Druid live dashboard", "A batch pipeline over de-duplicated raw logs in the lake and warehouse, reconciled to the ad server", "Kafka consumer printouts", "Advertiser spreadsheets"]
    answer: 1
    why: "Live stores use rollups and approximations for speed. Money needs exact, reproducible batch numbers with reconciliation."
  - q: "Frequency caps are best served from…"
    options: ["BigQuery scheduled queries", "A low-latency key store (Bigtable or Redis) updated by the stream", "Monthly reports", "Elasticsearch"]
    answer: 1
    why: "The ad server checks caps inside the 100 ms request, so counters must be read in milliseconds."
  - q: "Which component turns campaign exposure and sales into incremental lift results?"
    options: ["The orchestrator alone", "A measurement pipeline in the warehouse (Spark/BigQuery) using logged test and control groups", "The CDN", "The product search index"]
    answer: 1
    why: "Incrementality needs exposure logs, holdout assignments and purchases joined with fixed definitions, which is warehouse work."
---

## The brief

A national grocer with 400 stores, a website, an app and 10 million loyalty members launches a retail media network. It sells **sponsored products** onsite, **display** on the app, **screens** in 150 stores and **offsite** audiences. Brands want **live dashboards**, **closed-loop sales reporting** and **incrementality** reads. Privacy rules require that no brand ever sees row-level shopper data.

## The design

<div class="flow">

**1. Sources.** App and web clickstream; ad server request, impression and click logs; in-store screen play logs; till transactions with loyalty IDs; online orders; product catalogue and stock (CDC from the merchandising database); campaign set-up from the self-serve ad console.

**2. Ingest.** Everything event-shaped goes to **Kafka** topics (`ads.impressions.v1`, `ads.clicks.v1`, `web.events.v1`, `orders.v1`, `inventory.cdc.v1`) with Avro schemas in a registry. Till transactions arrive as nightly files to **GCS bronze** (stores batch-upload). **Datastream** or **Debezium** streams catalogue and stock changes.

**3. Real-time path.** **Flink** (or Dataflow) jobs: invalid-traffic filtering, spend pacing per campaign per minute, frequency counters per user and campaign, out-of-stock suppression. Counters go to **Bigtable** (or Redis) for the ad server. **Druid** ingests impressions and clicks from Kafka with minute rollup for advertiser dashboards.

**4. Lake and batch path.** Kafka Connect writes raw events to **GCS** (bronze, hourly Parquet). Nightly **Airflow** (Cloud Composer) runs **Spark on Dataproc**: de-duplicate, filter invalid traffic, sessionise, join identities, write **Iceberg** silver tables. **BigQuery** (dbt or Dataform) builds gold marts: `fct_impressions`, `fct_clicks`, `fct_sales`, `dim_campaign`, `dim_product`, `dim_store`, `fct_attributed_sales`, `fct_billing`.

**5. Measurement.** Holdout assignments logged by the ad server. BigQuery jobs compute attribution under the network's published rules, incrementality reads with confidence intervals for user holdouts, and difference-in-differences for store screen tests. Results versioned and reproducible.

**6. Sharing.** **BigQuery data clean rooms** for brands' own data, with aggregation thresholds. Advertiser portal reads Druid (live) and BigQuery aggregates (final). Agencies get scheduled exports of aggregates only.

**7. ML.** **Vertex AI**: click-through prediction for the sponsored-products auction, audience propensity models (likely category buyers) from point-in-time features, budget forecasting. Online features served from **Bigtable**.

**8. Product search.** **Elasticsearch/OpenSearch** for site search, with sponsored products blended into results by the ad server.

**9. Run it.** Dataplex catalogue and quality rules, freshness monitors on every topic and table, lineage from raw logs to invoice lines, Terraform for infrastructure, budgets and cost labels per pipeline, on-call rota for the real-time path.

</div>

## One campaign, end to end

1. A cola brand books a two-week sponsored products and in-store screen campaign: budget $60,000, targeting "cola" and "soft drinks" searches and 75 test stores (75 matched control stores), with a 10% user holdout online.
2. The console writes the campaign to the ad database; CDC puts it on Kafka; the ad server picks it up.
3. Each ad request checks budget pacing and frequency counters in Bigtable; impressions and clicks stream to Kafka.
4. Druid shows the brand live impressions, clicks, CTR and spend within a minute.
5. Nightly, Spark and BigQuery build exact numbers; the billing table reconciles to ad server totals within an agreed tolerance.
6. Two weeks after the end (to catch the attribution window), the measurement job reports attributed ROAS, online holdout lift, store test difference-in-differences, iROAS and confidence intervals.
7. Results feed the MMM and the next campaign's audience model.

## Trade-offs to be ready to defend

- **Build or buy** the ad server and sponsored-products engine? (Many networks license it and own the data layer.)
- **Druid vs Pinot vs ClickHouse vs BigQuery BI Engine** for the portal: concurrency, freshness, team skills.
- **Kafka vs Pub/Sub** on GCP: company standards, ecosystem, operations.
- **Lambda-style** (live approximate + nightly exact) is deliberate here: advertisers see fast numbers, invoices use exact ones, and the portal labels which is which.

<div class="callout project">

**Capstone (6 to 10 hours). Deliver a design document and a working slice.**

**Part A: design document (2 to 3 pages).** For a retailer of your choice (fictional), write: goals and users; the architecture diagram; a table of every tool with **why it was chosen and what it replaced**; data model for impressions, clicks and sales; privacy controls; latency and cost targets; and the three biggest risks.

**Part B: working slice (local and free).**

1. Synthetic generator: 7 days of impressions, clicks and sales for 3 campaigns, 50,000 users, with a 10% holdout that gets no impressions and a true lift you set (for example +15%).
2. Kafka → a stream job → live per-campaign counts (Druid, ClickHouse or DuckDB plus a chart).
3. Batch: Spark (or DuckDB) de-duplicates and builds `fct_impressions`, `fct_sales` and attributed sales with a 7-day click window.
4. Measurement notebook: attributed ROAS, measured lift with a 95% interval, iROAS. Check you recover the lift you planted.
5. Airflow DAG that runs the batch and measurement steps.

**Part C: the story.** A one-page README a hiring manager can read in two minutes: the problem, the design, what you measured, and what you'd do with a real team. Compare it with your Module 1 one-pager.

</div>
