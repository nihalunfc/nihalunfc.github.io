---
title: "Platform architecture: putting it together"
summary: "Lambda, kappa, lakehouse and medallion architectures, the governance and observability layers, data mesh, and the Module 6 mini project."
module: 6
minutes: 25
outcomes:
  - "Compare lambda, kappa and lakehouse architectures"
  - "Describe the governance, quality and observability layers of a platform"
  - "Explain data mesh and data products in plain words"
quiz:
  - q: "The lambda architecture keeps…"
    options: ["One streaming path only", "A batch path and a streaming path side by side, merged at serving", "No storage", "Only Excel files"]
    answer: 1
    why: "Lambda pairs an accurate batch layer with a fast speed layer. Kappa uses one streaming path and replays the log to reprocess."
  - q: "In a data mesh, who owns a domain's data products?"
    options: ["A central IT team only", "The domain team that knows the data (for example retail media), on a shared self-serve platform", "Nobody", "The cloud provider"]
    answer: 1
    why: "Data mesh moves ownership to domain teams while a platform team provides shared tooling and standards."
  - q: "Data observability tools mainly watch…"
    options: ["Employee hours", "Freshness, volume, schema changes, distribution and lineage of data", "Office temperature", "Network cables"]
    answer: 1
    why: "Those signals catch broken or late data before a dashboard or model uses it."
---

## Three architecture patterns

| Pattern | Idea | Strength | Weakness |
|---|---|---|---|
| **Lambda** | Batch layer (complete, accurate) + speed layer (fast, approximate), merged at query time | Accurate history and fresh numbers | Two code bases that must agree |
| **Kappa** | Everything is a stream; to reprocess, replay the log | One code base | Replaying long histories can be slow and costly |
| **Lakehouse** | Open table formats (Iceberg, Delta) on object storage, read by many engines, batch and streaming writes | One copy, many engines, ACID on the lake | More moving parts than a pure warehouse |

Most real platforms are pragmatic mixes: a lakehouse or warehouse as the system of analytics, Kafka for events, a few serving stores, and streaming only where it pays.

<div class="callout analogy">

**Analogy: a city's transport.** Lambda is a city with both a slow, reliable train (batch) and fast scooters (streaming), and a timetable that combines them. Kappa is a city with only a metro that runs constantly; to "redo" a day, you replay the whole day's trains. A lakehouse is a central station where every line, train or bus, uses the same platforms.

</div>

## The layers around the core

- **Catalogue and lineage:** what data exists, who owns it, where it came from and what depends on it. On GCP: **Dataplex** and its catalogue; elsewhere: Unity Catalog, DataHub, OpenMetadata, Collibra.
- **Quality:** tests at each layer (dbt tests, Great Expectations, Soda, Dataplex data quality): not null, unique, accepted values, freshness, reconciliation to source totals.
- **Observability:** monitors on freshness, volume, schema drift and distributions, with alerts (Monte Carlo, Elementary, custom SQL checks).
- **Security and privacy:** IAM, column masking and row-level policies, tokenising personal identifiers, retention rules, region controls.
- **FinOps:** cost per pipeline and per team, budgets, slot reservations, cluster idle-delete.
- **Infrastructure as code:** Terraform for buckets, datasets, topics and service accounts; CI/CD for pipelines.

## Data mesh and data products

**Data mesh** is an organisational idea: instead of one central team owning all data, **domain teams** (merchandising, supply chain, retail media) own their data as **products**, with documentation, quality promises (SLAs) and clear interfaces, built on a shared **self-serve platform** with common governance. In practice many companies adopt the "data product" thinking without the full reorganisation.

## Reference platform on Google Cloud

<div class="flow">

**Sources:** till and e-commerce events, app clickstream, ad server logs, OLTP databases, partner files
→ **Ingest:** Kafka / Pub/Sub, Datastream (CDC), Storage Transfer for files
→ **Lake:** GCS bronze → Iceberg silver (BigLake)
→ **Process:** Dataproc / Serverless Spark (heavy), Dataflow (streaming), BigQuery SQL + dbt/Dataform (models)
→ **Warehouse:** BigQuery gold marts and feature tables
→ **Serve:** Druid (live dashboards), Bigtable (profiles, online features), Elasticsearch (search), Looker (BI)
→ **ML:** Vertex AI pipelines, feature store, endpoints
→ **Run:** Cloud Composer (Airflow), Dataplex (catalogue, quality), Cloud Monitoring, Terraform

</div>

## Mini project for Module 6: an ML-ready feature pipeline

<div class="callout project">

**Mini project (3 to 4 hours, local or BigQuery sandbox).**

1. From your Module 2 sales data (add `customer_id`), build a **point-in-time training set**: for each customer and each weekly `as_of_date`, features from the 90 days **before** the date and the label "bought category X in the next 7 days".
2. Prove there's no leakage: a test that fails if any feature uses a transaction on or after `as_of_date`.
3. Train a simple model (logistic regression or BigQuery ML) and record its metrics and the data snapshot date.
4. Write the latest feature values per customer to an "online" table (Redis, SQLite or a BigQuery table keyed by customer) and show a lookup function.
5. README: a diagram mapping your pieces to a feature store's offline store, online store and materialisation, and one paragraph on how you'd stop training-serving skew.

</div>
