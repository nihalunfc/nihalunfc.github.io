---
title: "Dataproc: Spark on Google Cloud"
summary: "Clusters, ephemeral clusters, serverless Spark batches and the GCS connector, with the cost and reliability habits teams expect."
module: 3
minutes: 20
outcomes:
  - "Explain Dataproc clusters, master and worker nodes, and spot secondary workers"
  - "Submit a PySpark job to a cluster and as a serverless batch"
  - "Choose between long-running clusters, ephemeral clusters and serverless"
quiz:
  - q: "What is an ephemeral cluster?"
    options: ["A cluster that runs forever", "A cluster created for one job or workflow and deleted when it finishes", "A cluster with no workers", "A BigQuery reservation"]
    answer: 1
    why: "Because data lives in GCS, not on the cluster, you can create a cluster per job and delete it after, paying only while it runs."
  - q: "Why can Dataproc clusters be deleted without losing data?"
    options: ["Data is copied to the driver", "Jobs read and write GCS through the Cloud Storage connector instead of the cluster's own HDFS", "Dataproc never stores data", "BigQuery backs it up"]
    answer: 1
    why: "Separating storage (GCS) from compute (clusters) is what makes ephemeral clusters safe."
  - q: "Spot (preemptible) secondary workers are a good fit for…"
    options: ["The master node", "Fault-tolerant batch work that can tolerate losing a worker", "Storing the only copy of data", "Streaming jobs that must never pause"]
    answer: 1
    why: "Spot VMs are much cheaper but can be reclaimed. Spark retries lost tasks, so batch jobs tolerate them well."
---

## Dataproc in one paragraph

**Dataproc** is Google's managed service for open-source Spark, Hadoop, Hive, Flink and Trino. You ask for a cluster and get one in about 90 seconds, with Spark installed, tuned and connected to GCS and BigQuery. It's the GCP counterpart of **AWS EMR** and **Azure HDInsight**, and the reason it exists is simple: lots of companies have Spark code, and Dataproc runs it without rewriting.

<div class="callout analogy">

**Analogy: renting a kitchen by the hour.** A **long-running cluster** is a restaurant kitchen you lease all year. An **ephemeral cluster** is a commercial kitchen you book for tonight's banquet, then hand back. **Serverless Spark** is a catering service: you send the recipe, they bring the cooks and equipment and you never see the kitchen. The ingredients (data) are kept in your own pantry (GCS) throughout, so returning the kitchen loses nothing.

</div>

## The parts of a cluster

- **Master node(s):** runs the YARN resource manager and usually the Spark driver. One, or three for high availability.
- **Primary workers:** run executors and can hold HDFS data.
- **Secondary workers:** extra compute only, often **Spot VMs** at a large discount. Ideal for batch.
- **Autoscaling policy:** adds and removes workers based on pending work.
- **Initialization actions:** scripts that install extra packages on boot.
- **Component gateway:** secure links to the Spark UI and history server.

## Run a job three ways

```bash
# 1. Create a cluster, run, delete (ephemeral)
gcloud dataproc clusters create sales-nightly --region=northamerica-northeast2 \
  --num-workers=2 --worker-machine-type=n2-standard-4 --max-idle=15m
gcloud dataproc jobs submit pyspark gs://YOURNAME-code/sales_nightly.py \
  --cluster=sales-nightly --region=northamerica-northeast2 \
  -- --input gs://YOURNAME-retail-lake/bronze/sales/ --output gs://YOURNAME-retail-lake/silver/sales/
gcloud dataproc clusters delete sales-nightly --region=northamerica-northeast2

# 2. Serverless batch: no cluster at all
gcloud dataproc batches submit pyspark gs://YOURNAME-code/sales_nightly.py \
  --region=northamerica-northeast2 -- --input … --output …
```

3. **Workflow templates** define "create cluster → run jobs in order → delete" as one reusable object, though most teams use **Airflow** for this (next lesson).

`--max-idle=15m` deletes the cluster automatically if it sits idle: a cheap insurance policy against forgotten clusters.

## Reading and writing BigQuery from Spark

The **spark-bigquery connector** lets Spark read BigQuery tables (using the fast Storage Read API) and write results back:

```python
df = spark.read.format("bigquery").option("table", "retail.sales").load()
(result.write.format("bigquery")
   .option("table", "retail.daily_store_sales")
   .option("writeMethod", "direct").mode("overwrite").save())
```

## Choosing the mode

| Mode | Pros | Cons | Use when |
|---|---|---|---|
| Long-running cluster | Instant start, interactive notebooks | Pay when idle; drifts out of date | Shared exploration with steady load |
| Ephemeral cluster | Pay per job, fresh config each time | ~90 s start-up | Scheduled batch pipelines |
| **Serverless Spark** | Nothing to size or patch | Less control; some settings limited | Most new batch jobs |
| Dataproc on GKE | Shares Kubernetes with other apps | Kubernetes skills needed | Platform teams standardised on Kubernetes |

<div class="callout senior">

**What platform teams care about.** Pin image versions (Spark version changes behaviour), keep job code and dependencies in GCS or Artifact Registry, use a dedicated service account per pipeline, label clusters for cost reports, and set idle-delete. The cluster is cattle, not a pet.

</div>

## Who uses Dataproc

Companies migrating Hadoop from their own data centres to Google Cloud, retailers and banks with large existing Spark code bases, and teams that want open-source engines rather than lock-in. Many newer GCP teams use Serverless Spark for Spark work and BigQuery for everything SQL.

<div class="callout exercise">

**Exercise (paper or free trial).** Your nightly job reads 400 GB and runs 50 minutes on 10 workers. Write down (a) whether you'd use a long-running, ephemeral or serverless setup and why, (b) where Spot workers fit, and (c) two settings that stop surprise bills. If you have Google's free trial credit, run the Module 2 job as a serverless batch on a small sample.

</div>
