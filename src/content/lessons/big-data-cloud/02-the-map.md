---
title: "The map: how the pieces connect"
summary: "The seven jobs in a modern data platform, the tools that do each job, and how one sale travels from the till to a dashboard and a model."
module: 1
minutes: 25
outcomes:
  - "Name the seven jobs in a data platform and a tool for each"
  - "Follow one event from source to dashboard, naming each hop"
  - "Explain batch versus streaming paths, and lake versus warehouse"
quiz:
  - q: "Which tool's main job is to decide what runs when, in what order, and what happens if a step fails?"
    options: ["Kafka", "BigQuery", "Airflow", "Druid"]
    answer: 2
    why: "Airflow is an orchestrator. It doesn't process data itself; it tells other tools when to run and retries on failure."
  - q: "A data lake differs from a warehouse mainly because a lake…"
    options: ["is always faster", "stores raw files of any shape cheaply, while a warehouse stores cleaned tables ready for SQL", "can only hold images", "cannot be queried"]
    answer: 1
    why: "A lake (GCS, S3) is cheap storage for raw files. A warehouse (BigQuery) holds structured tables optimised for SQL. A lakehouse blends both with table formats like Iceberg."
  - q: "A dashboard needs sub-second answers for 2,000 advertisers at once. Which layer is that?"
    options: ["Ingestion", "Serving", "Orchestration", "Storage"]
    answer: 1
    why: "The serving layer (Druid, Bigtable, Elasticsearch, or a cache) is built for many fast, small queries from apps and dashboards."
---

## The seven jobs

Forget product names for a moment. Every data platform, from a startup to a bank, does seven jobs. Products are just ways of doing them.

| # | Job | Question it answers | Tools you'll meet |
|---|---|---|---|
| 1 | **Ingest** | How does data get in? | Kafka, Pub/Sub, Kinesis, Kafka Connect, Fivetran, Airbyte, Datastream |
| 2 | **Store** | Where does it live, cheaply and safely? | GCS, S3, Azure Blob/ADLS; Parquet, Iceberg, Delta Lake |
| 3 | **Process** | How is it cleaned, joined and reshaped? | Spark/PySpark (Dataproc, Databricks, EMR), Dataflow/Beam, Flink, dbt |
| 4 | **Warehouse** | Where do analysts ask questions with SQL? | BigQuery, Snowflake, Redshift, Azure Synapse/Fabric, Databricks SQL |
| 5 | **Serve** | How do apps and dashboards get fast answers? | Druid, Pinot, ClickHouse, Bigtable, Cassandra, Elasticsearch, Redis |
| 6 | **Orchestrate** | What runs when, and what if it fails? | Airflow (Cloud Composer), Dagster, Prefect |
| 7 | **Use** | Who acts on it? | Looker, Power BI, Tableau; ML on Vertex AI or SageMaker; ad measurement |

Two concerns run across all seven: **governance** (who may see what, data catalogues, lineage, privacy) and **observability** (is the data fresh, complete and correct, and how much is it costing?).

<div class="callout analogy">

**Analogy: a city's water system.** Rain and rivers are the **sources**. Pipes and pumps are **ingestion** (Kafka is a main pipe that never stops flowing). The reservoir is the **lake** (GCS): huge, cheap, holds water as it arrived. The treatment plant is **processing** (Spark): it filters and treats. The clean-water tanks are the **warehouse** (BigQuery). Taps in every house are the **serving layer** (Druid, Bigtable): water instantly, for millions of people at once. The control room that opens valves on schedule is the **orchestrator** (Airflow). Water inspectors are **data quality and governance**.

</div>

## Follow one sale through the platform

A shopper buys a box of cereal using a loyalty card at 10:02 am. Watch where that one event goes.

1. **10:02:00.** The till sends a JSON event `{store: 214, sku: 88231, card: "…", price: 4.99}` to a **Kafka** topic called `sales`. Kafka stores it in order, durably, in seconds.
2. **10:02:01.** A **stream processor** (Flink, Spark Structured Streaming or Dataflow) reads the topic, adds the product category and updates a running "sales this hour per store" count in **Druid**. The store manager's live dashboard ticks up.
3. **10:05.** A **Kafka Connect** sink writes the raw events in batches to **GCS** as Parquet files, partitioned by date and hour. This is the permanent, cheap copy.
4. **02:00 next day.** **Airflow** starts the nightly job. It launches a **Spark** job on **Dataproc**, which reads yesterday's files, removes duplicates, joins products and stores, and writes clean tables. It then runs SQL in **BigQuery** to build `fct_sales` and `dim_product`.
5. **06:00.** Analysts open **Looker** or **Power BI** on BigQuery. Finance sees yesterday's sales.
6. **Weekly.** A **Vertex AI** pipeline reads the BigQuery features ("this customer bought cereal 3 times in 30 days") to retrain a recommendation model. Its output (scores per customer) goes to **Bigtable** so the app can fetch "recommended for you" in 10 milliseconds.
7. **Campaign end.** The **retail media** team joins ad views (from the ad server, also via Kafka) to these sales to measure whether the cereal brand's ad caused extra purchases.

That's the whole course in one story. Each later module zooms into one hop.

## Two paths: batch and streaming

- **Batch path:** collect data, process it on a schedule (hourly, nightly). Simple, cheap, easy to rerun. Most reporting lives here.
- **Streaming path:** process each event as it arrives, within seconds. Needed for fraud checks, live dashboards, ad budget pacing, stock alerts. Harder to build and run.

Most companies run both, sharing the same sources. Older designs kept two separate code bases (the **lambda architecture**); newer ones try to use one engine for both (the **kappa architecture**, or Spark/Beam code that runs in either mode). Module 6 returns to this.

## Lake, warehouse and lakehouse

- **Data lake:** files in object storage (GCS, S3). Any shape, very cheap, but on its own no transactions, no easy updates, and it can become a "data swamp".
- **Data warehouse:** managed tables with SQL, fast and governed (BigQuery, Snowflake). Costs more per TB, very easy for analysts.
- **Lakehouse:** open **table formats** (Apache Iceberg, Delta Lake, Apache Hudi) add transactions, updates and time travel on top of files in the lake, so Spark, BigQuery, Trino and others can all read the same tables. BigQuery can read Iceberg tables directly (BigLake). This is the direction most large platforms are moving.

## The three big clouds side by side

You'll see job postings for one cloud; the ideas transfer. Learn one well and keep this table handy.

| Job | Google Cloud | AWS | Azure |
|---|---|---|---|
| Object storage | Cloud Storage (GCS) | S3 | Blob Storage / ADLS Gen2 |
| Warehouse | BigQuery | Redshift | Synapse / Microsoft Fabric |
| Managed Spark | Dataproc | EMR | HDInsight, Synapse Spark, Databricks |
| Stream/batch pipelines | Dataflow (Apache Beam) | Kinesis Data Analytics (Flink), Glue | Stream Analytics, Data Factory |
| Messaging | Pub/Sub (or Kafka) | Kinesis, MSK (Kafka) | Event Hubs (Kafka-compatible) |
| Orchestration | Cloud Composer (Airflow) | MWAA (Airflow), Step Functions | Data Factory, Fabric pipelines |
| Wide-column NoSQL | Bigtable | DynamoDB, Keyspaces | Cosmos DB |
| ML platform | Vertex AI | SageMaker | Azure Machine Learning |

Databricks and Snowflake run on all three clouds, which is part of why they're popular.

<div class="callout exercise">

**Exercise (15 minutes).** Draw the seven jobs as seven boxes on paper. For the business you picked in Lesson 1, write one tool in each box and one arrow label (what flows). Then mark which arrows are **batch** and which are **streaming**.

</div>

<details class="answer"><summary>What a good answer looks like</summary>

A supermarket: till events → **Kafka** (streaming) → **Flink** → **Druid** live store dashboard (streaming); Kafka → **GCS** Parquet (micro-batch); **Airflow** nightly → **Spark on Dataproc** → **BigQuery** marts (batch) → **Power BI** (batch); BigQuery → **Vertex AI** weekly retrain (batch) → scores in **Bigtable** for the app (served live). Governance: a data catalogue (Dataplex) and access rules on loyalty-card data.

</details>
