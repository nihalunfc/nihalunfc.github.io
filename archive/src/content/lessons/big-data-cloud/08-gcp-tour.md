---
title: "A tour of the Google Cloud data stack"
summary: "Projects, regions, IAM and billing, then every Google Cloud data service on one page, with when each is the right choice."
module: 3
minutes: 20
outcomes:
  - "Explain projects, regions, service accounts and IAM roles"
  - "Name the Google Cloud data services and the job each does"
  - "Choose between BigQuery SQL, Dataproc and Dataflow for a pipeline"
quiz:
  - q: "A pipeline running on a schedule should authenticate to BigQuery as…"
    options: ["Your personal Gmail account", "A service account with only the roles it needs", "The project owner", "No account; BigQuery is public"]
    answer: 1
    why: "Automated jobs use service accounts with least-privilege roles, so access can be audited and revoked without touching people."
  - q: "Which service is Google's managed Apache Airflow?"
    options: ["Cloud Composer", "Cloud Run", "Dataflow", "Dataplex"]
    answer: 0
    why: "Cloud Composer runs Airflow for you: scheduler, workers, web UI and upgrades."
  - q: "Your transformations are plain SQL over data already in BigQuery. What's usually simplest?"
    options: ["Copy it out to Dataproc Spark", "Run the SQL in BigQuery (scheduled queries, Dataform or dbt)", "Stream it through Pub/Sub", "Export to CSV and use Excel"]
    answer: 1
    why: "Moving data out of the warehouse to transform it adds cost and complexity. SQL in place is the default; Spark is for what SQL can't do well."
---

## Four ideas to understand first

- **Project:** the box that holds resources, permissions and billing. Companies usually have many: `retail-data-dev`, `retail-data-prod`, one per team. BigQuery tables are addressed as `project.dataset.table`.
- **Region and location:** where data physically lives (`northamerica-northeast1` is Montréal, `northamerica-northeast2` is Toronto; `US` and `EU` are multi-regions). Data and the compute that reads it should be in the same location: cheaper, faster, and often required for privacy law.
- **IAM:** who can do what. People and **service accounts** (identities for programs) get **roles** such as `roles/bigquery.dataViewer` or `roles/storage.objectAdmin`. Rule: least privilege, roles on groups, not individuals.
- **Billing:** every service is metered. Set **budgets and alerts** on day one, and label resources (`team=retail-media`) so costs can be split.

<div class="callout analogy">

**Analogy: an office building.** The organisation is the company; **projects** are floors with their own budget; **services** are rooms (the library is BigQuery, the storeroom is GCS, the workshop is Dataproc); **IAM** is the key card system, and a **service account** is a key card issued to a robot that does night shifts.

</div>

## The services on one page

| Job | Service | One-line description |
|---|---|---|
| Store files | **Cloud Storage (GCS)** | Object storage for any file; the data lake |
| Warehouse | **BigQuery** | Serverless SQL warehouse over petabytes |
| Spark and Hadoop | **Dataproc** | Managed Spark clusters, or serverless Spark batches |
| Beam pipelines | **Dataflow** | Serverless batch and streaming pipelines (Apache Beam) |
| Messaging | **Pub/Sub** | Global, serverless publish-subscribe messaging |
| Kafka | **Managed Service for Apache Kafka** | Google-run Kafka clusters (or self-managed Kafka or Confluent Cloud) |
| Orchestration | **Cloud Composer** | Managed Airflow |
| SQL workflows | **Dataform** | SQL transformation workflows in BigQuery (like dbt) |
| Change data capture | **Datastream** | Streams changes from MySQL, PostgreSQL, Oracle, SQL Server into BigQuery or GCS |
| Wide-column NoSQL | **Bigtable** | Millisecond reads and writes at huge scale |
| Relational | **Cloud SQL, AlloyDB, Spanner** | Postgres/MySQL; high-performance Postgres; globally distributed SQL |
| Governance | **Dataplex** (with Data Catalog) | Discover, catalogue, profile and govern data across lake and warehouse |
| BI | **Looker, Looker Studio** | Semantic model and dashboards; free lightweight dashboards |
| ML and AI | **Vertex AI** | Training, pipelines, feature store, model registry, serving, Gemini models |
| Clean rooms | **BigQuery data clean rooms** | Share data with partners without exposing rows (Module 7) |

## Which processing service?

- **BigQuery SQL** when the data is in BigQuery and the logic is SQL. Most analytics transformations. Orchestrate with Dataform, dbt or Composer.
- **Dataproc** when you have existing Spark code, need the Spark ecosystem (Delta, Iceberg, MLlib), or want portable open-source jobs.
- **Dataflow** for streaming pipelines (Pub/Sub or Kafka in, BigQuery or Bigtable out) and serverless batch in Beam.
- **Cloud Run functions or jobs** for small glue: call an API, move a file, send an alert.

## Who runs on Google Cloud

Google Cloud is especially strong where **BigQuery** and **advertising** matter: retailers, media and marketing companies (the Google Ads and Google Marketing Platform data lands natively in BigQuery), and companies that value serverless analytics. Many retailers in North America run BigQuery as their main warehouse, often alongside Databricks, and many retail media networks build on GCP for its ads integrations and clean rooms.

<div class="callout exercise">

**Exercise (20 minutes).** Open the free **BigQuery sandbox** (no credit card; see [Free sandboxes](/learn/big-data-cloud/pages/setup/)). Create a project, open BigQuery Studio, and run:

```sql
SELECT name, SUM(number) AS babies
FROM `bigquery-public-data.usa_names.usa_1910_current`
WHERE year >= 2000
GROUP BY name ORDER BY babies DESC LIMIT 10;
```

Before running, look at the top right: the editor tells you **how many bytes the query will process**. Write that number down; it's the main driver of BigQuery cost.

</div>
