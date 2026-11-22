---
title: "Airflow and Cloud Composer"
summary: "DAGs, tasks, operators, sensors, schedules and backfills; a real DAG that runs Spark on Dataproc and SQL in BigQuery; and the Module 3 mini project."
module: 3
minutes: 30
outcomes:
  - "Explain DAGs, tasks, operators, sensors, the scheduler and XCom"
  - "Write a DAG that waits for a file, runs Spark on Dataproc and builds BigQuery tables"
  - "Make tasks idempotent so reruns and backfills are safe"
quiz:
  - q: "In Airflow, what is a DAG?"
    options: ["A database", "A directed acyclic graph of tasks with dependencies and a schedule", "A type of Spark job", "A dashboard"]
    answer: 1
    why: "A DAG is the workflow: tasks, which run after which, and when the whole thing runs."
  - q: "Which property makes a task safe to rerun for the same date?"
    options: ["It appends rows every run", "It is idempotent: it overwrites the partition for that date, so running twice gives the same result", "It uses random numbers", "It runs on the master node"]
    answer: 1
    why: "Idempotent tasks (overwrite or MERGE by partition) make retries and backfills safe. Appending duplicates rows."
  - q: "Should Airflow workers do the heavy data processing themselves?"
    options: ["Yes, always", "No: Airflow should trigger and watch work done by Spark, BigQuery or Dataflow", "Only on weekends", "Only for CSV files"]
    answer: 1
    why: "Airflow is the conductor, not the orchestra. Heavy lifting belongs in engines built for it."
---

## What Airflow does

**Apache Airflow** (from Airbnb, 2014; Airflow 3 arrived in 2025) schedules and monitors workflows written in Python. It doesn't process data itself. It tells other systems what to do and in which order, retries failures, and shows you what happened.

<div class="callout analogy">

**Analogy: an orchestra conductor.** The conductor plays no instrument. They decide when each section comes in, keep time, and notice when someone misses a cue. Spark, BigQuery and Dataflow are the musicians. The **DAG** is the score. If the violins (a task) fail, the conductor has them play their part again (a retry) without restarting the whole symphony.

</div>

## The vocabulary

| Term | Meaning |
|---|---|
| **DAG** | A workflow: tasks plus dependencies, with a schedule (cron or asset-based) |
| **Task** | One step in the DAG |
| **Operator** | A template for a task: `BigQueryInsertJobOperator`, `DataprocSubmitJobOperator`, `PythonOperator` |
| **Sensor** | A task that waits for something: a file in GCS, another DAG, a partition |
| **Scheduler** | Decides which task instances are ready and queues them |
| **Executor / workers** | Run the tasks (Celery, Kubernetes) |
| **Data interval / logical date** | The period a run covers. The run for 3 November usually starts just after it ends. |
| **XCom** | Small messages between tasks (an ID, a row count). Not for data. |
| **Connections and variables** | Stored credentials and settings, never hard-coded |
| **Backfill** | Running the DAG for past dates |

**Cloud Composer** is Google's managed Airflow (AWS has MWAA, Astronomer is the main independent host). Alternatives: **Dagster** (asset-centred), **Prefect** (Pythonic), **Dataform** (SQL-only in BigQuery), **Argo Workflows** (Kubernetes).

## A real DAG

```python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.google.cloud.sensors.gcs import GCSObjectsWithPrefixExistenceSensor
from airflow.providers.google.cloud.operators.dataproc import DataprocCreateBatchOperator
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator

REGION, LAKE = "northamerica-northeast2", "gs://YOURNAME-retail-lake"

with DAG(
    dag_id="sales_nightly",
    schedule="0 2 * * *",                       # 02:00 every day
    start_date=datetime(2026, 11, 1),
    catchup=False,
    default_args={"retries": 2, "retry_delay": timedelta(minutes=10)},
    tags=["retail", "sales"],
) as dag:

    wait_for_files = GCSObjectsWithPrefixExistenceSensor(
        task_id="wait_for_files", bucket="YOURNAME-retail-lake",
        prefix="bronze/sales/dt={{ ds }}/", mode="reschedule", timeout=4 * 3600)

    clean_with_spark = DataprocCreateBatchOperator(
        task_id="clean_with_spark", region=REGION,
        batch_id="sales-{{ ds_nodash }}-{{ ti.try_number }}",
        batch={"pyspark_batch": {
            "main_python_file_uri": "gs://YOURNAME-code/sales_nightly.py",
            "args": ["--date", "{{ ds }}", "--lake", LAKE]}})

    build_mart = BigQueryInsertJobOperator(
        task_id="build_mart",
        configuration={"query": {"useLegacySql": False, "query": """
            DELETE FROM retail.fct_sales_daily WHERE sale_date = '{{ ds }}';
            INSERT INTO retail.fct_sales_daily
            SELECT sale_date, store_id, sku, SUM(net_revenue) AS net_revenue
            FROM retail.sales_clean_ext WHERE sale_date = '{{ ds }}'
            GROUP BY 1, 2, 3;"""}})

    wait_for_files >> clean_with_spark >> build_mart
```

Read it top to bottom: wait for today's files, run serverless Spark on them, then rebuild that day's slice of the mart. `{{ ds }}` is the run's date, filled in by Airflow, which makes backfills work: running for 1 October processes 1 October's files.

## Rules good DAGs follow

1. **Idempotent tasks:** each run overwrites or merges exactly its own date. Rerun twice, same result.
2. **Thin DAG files:** no heavy work or database calls at the top level of the file; the scheduler parses it constantly.
3. **Sensors in reschedule mode** (or deferrable operators) so waiting doesn't hold a worker slot.
4. **Alerts and SLAs:** notify on failure and when data is late, not just when code breaks.
5. **Everything in Git,** with tests that load every DAG and check there are no import errors.

## Who uses Airflow

It's the most common orchestrator in job postings across retail, banking, media and tech, largely because it's open source, runs on every cloud and has providers for almost every system. Smaller and newer teams often choose Dagster or Prefect; SQL-only teams on BigQuery may use Dataform or dbt Cloud scheduling.

## Mini project for Module 3: the cloud nightly pipeline

<div class="callout project">

**Mini project (3 to 4 hours; free tier or local).**

1. **Local option (free):** run Airflow with Docker (`docker compose` from the official quick start), use a local folder as the "bucket" and DuckDB or local PySpark as the engine. **Cloud option:** use the free trial credit with GCS, Serverless Spark and the BigQuery sandbox.
2. Land a day of synthetic sales in `bronze/sales/dt=YYYY-MM-DD/`.
3. Write the `sales_nightly` DAG: sensor → Spark clean (your Module 2 job) → BigQuery or DuckDB mart → a data quality task that fails if row counts drop more than 30% from the previous day.
4. **Backfill** seven past days and show that rerunning one day doesn't duplicate rows.
5. README: a DAG graph screenshot, how you made it idempotent, and what it would cost per month at 50 GB a day (use the pricing pages; show your working).

</div>
