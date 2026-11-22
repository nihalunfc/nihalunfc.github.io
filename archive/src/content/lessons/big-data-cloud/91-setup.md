---
title: "Free sandboxes"
summary: "How to practise everything in this course for free: what runs on your laptop, what runs in free cloud tiers, and how to avoid a surprise bill."
page: true
---

## On your laptop (free, offline)

You need **Python 3.10+**, **Java 17** (for Spark) and **Docker Desktop** (or Podman). Then:

| Tool | How |
|---|---|
| **PySpark** | `pip install pyspark` (needs Java 17 or 21). Spark UI at `http://localhost:4040` while a job runs. |
| **DuckDB / Polars** | `pip install duckdb polars`: for comparisons and small marts. |
| **Kafka** | `docker run -d --name kafka -p 9092:9092 apache/kafka:latest`, then `pip install confluent-kafka`. |
| **Airflow** | The official Docker Compose quick start from the Airflow docs, or `pip install apache-airflow` with the constraints file. |
| **ClickHouse** | `docker run -d -p 8123:8123 clickhouse/clickhouse-server`. |
| **Druid** | The official single-machine quick start (`bin/start-druid`) or its Docker Compose file. Needs about 6 GB of free memory. |
| **OpenSearch** | The single-node Docker example from the OpenSearch docs (set an admin password), plus OpenSearch Dashboards. |
| **Redis** | `docker run -d -p 6379:6379 redis`. |
| **Bigtable emulator** | `gcloud beta emulators bigtable start` (part of the Google Cloud CLI), then point the client at `localhost:8086`. |
| **Feast, MLflow** | `pip install feast mlflow`. |

Low on memory? Run one Docker service at a time, and use small samples.

## In the browser (free)

- **BigQuery sandbox:** sign in at console.cloud.google.com, open BigQuery, and you get a no-credit-card sandbox with monthly free query and storage allowances. Tables expire after 60 days, and some features (streaming, DML on some setups) are limited. Public datasets such as `bigquery-public-data.thelook_ecommerce` are ideal.
- **Google Colab:** free notebooks with Python; `!pip install pyspark` works for Spark practice.
- **Databricks free edition:** a free, limited Databricks workspace for Spark and Delta Lake practice.

## Free trial credit (use with care)

Google Cloud offers new accounts a free trial credit for a limited time. Use it for a few real runs: GCS buckets, a Serverless Spark batch, a short-lived Dataproc cluster, a Pub/Sub topic. Cloud Composer environments cost money for as long as they exist, so prefer local Airflow and use Composer only to see it, then delete it.

<div class="callout warn">

**Before you create anything paid:**

1. Set a **budget with alerts** (Billing → Budgets) at a small amount.
2. Use `--max-idle` on Dataproc clusters and delete them after use.
3. Set **maximum bytes billed** on BigQuery queries you schedule.
4. Delete test projects when done (**Shut down** the project), which stops everything in them.

</div>
