---
title: "Spark's relatives, and when not to use Spark"
summary: "Hadoop, Databricks, Flink, Beam and Dataflow, Trino, Dask, Ray, Polars and DuckDB: where each fits, and the Module 2 mini project."
module: 2
minutes: 25
outcomes:
  - "Place Hadoop, Databricks, Flink, Beam, Trino, Dask, Ray, Polars and DuckDB on one map"
  - "Pick the right engine for a job by size, latency and team"
  - "Build a small end-to-end PySpark batch job"
quiz:
  - q: "Which engine is built first for true event-at-a-time streaming with low latency?"
    options: ["Hadoop MapReduce", "Apache Flink", "DuckDB", "Dask"]
    answer: 1
    why: "Flink processes events one at a time with managed state, which suits low-latency streaming. Spark streams in micro-batches."
  - q: "Trino (formerly PrestoSQL) is best described as…"
    options: ["A message queue", "A SQL query engine that queries data where it lives (lake files, databases) without loading it first", "A Python dataframe library", "A dashboard tool"]
    answer: 1
    why: "Trino is a distributed SQL engine for querying lake files and many databases in place."
  - q: "Your team writes Apache Beam pipelines. On Google Cloud, which service runs them fully managed?"
    options: ["Dataproc", "Dataflow", "Bigtable", "Composer"]
    answer: 1
    why: "Dataflow is Google's managed runner for Beam, for both batch and streaming."
---

## The family tree

| Engine | What it is | Best at | You'll see it in |
|---|---|---|---|
| **Hadoop (HDFS, YARN, MapReduce)** | The original open-source big-data stack | Mostly legacy now; HDFS and YARN still run under some Spark clusters | Older banks and telecoms, on-premise estates |
| **Hive** | SQL on Hadoop; its metastore still catalogues tables | Table catalogue (Hive Metastore) | Anywhere Spark reads "Hive tables" |
| **Spark** | General distributed engine | Big batch ETL, ML features, lakehouse tables | Everywhere |
| **Databricks** | Commercial platform built on Spark and Delta Lake | Notebooks, jobs, SQL warehouse, ML in one place | Retail, banks, media on any cloud |
| **Apache Flink** | Stream-first engine with state | Low-latency streaming, fraud, live metrics | Payments, adtech, ride-hailing, AWS Managed Flink |
| **Apache Beam / Dataflow** | One programming model for batch and streaming; Dataflow runs it on GCP | Serverless pipelines on Google Cloud | GCP-heavy companies |
| **Trino / Presto** | Distributed SQL over data in place | Ad hoc SQL on lake files; joining many sources | Lakehouses, AWS Athena (based on Trino) |
| **Dask** | Parallel pandas and NumPy in Python | Scaling Python code you already have | Science, research |
| **Ray** | Distributed Python for ML and AI | Model training, hyperparameter search, LLM batch jobs | ML platforms |
| **Polars / DuckDB** | Very fast single-machine engines | Up to tens or hundreds of GB on one machine | Analysts, small teams, CI tests, dbt-duckdb |

<div class="callout analogy">

**Analogy: vehicles.** DuckDB and Polars are a fast car: perfect for one person, most trips. Spark is a fleet of lorries: overkill for groceries, essential for moving a warehouse. Flink is a courier on a motorbike: carries small things constantly, never stops. Trino is a taxi that picks you up anywhere: it goes to where the data already is. Ray is a team of specialist movers for awkward, heavy items such as model training.

</div>

## Choosing an engine: four questions

1. **How big?** Under ~100 GB: DuckDB or Polars. Bigger, or growing fast: Spark, Dataflow or the warehouse itself.
2. **How fast must results be?** Hours: batch Spark or SQL. Minutes: micro-batch (Spark Structured Streaming). Seconds or less: Flink, Dataflow streaming or Kafka Streams.
3. **Where does the data already live?** All in BigQuery: often just SQL in BigQuery, no Spark at all. Files in a lake: Spark or Trino.
4. **What does the team know?** A Python team that knows pandas will be productive in PySpark fast. A Java team may prefer Flink or Beam.

<div class="callout senior">

**The quiet trend.** Many teams moved transformations from Spark into the warehouse (BigQuery SQL plus dbt), because SQL is easier to hire for and the warehouse scales itself. Spark stays for what SQL does badly: very heavy joins on lake data, complex Python logic, ML feature engineering, unstructured data. Say this in an interview and you sound like someone who's seen real platforms.

</div>

## Mini project for Module 2: the nightly sales job

<div class="callout project">

**Mini project (2 to 3 hours).** Build `sales_nightly.py`, a PySpark batch job you can show on GitHub.

1. **Input:** generate 2 million rows of synthetic till data with the Lesson 5 code (add `customer_id` with 10% nulls and one "online" store with 40% of rows, to create skew).
2. **Clean:** typed dates, refunds flagged, duplicate `txn_id`s removed (keep the latest), nulls in `customer_id` set to `"guest"`.
3. **Model:** a daily store-SKU fact table and a store dimension. Use a broadcast join for stores.
4. **Write:** Parquet partitioned by `sale_date`, files between 64 and 256 MB (use `coalesce`).
5. **Check:** row counts in = out (minus duplicates, which you log), no negative net revenue per store-day without refunds.
6. **Explain:** a README with the plan from `explain()`, a Spark UI screenshot of the slowest stage, and what you changed to make it faster.

Keep it: in Module 3 you'll run it on Dataproc against GCS, orchestrated by Airflow.

</div>
