---
title: "What to learn, in what order"
summary: "A prioritised learning path from BI to big data, what to practise on free tiers, certifications worth considering, and what to look for in tools and teams."
module: 8
minutes: 20
outcomes:
  - "Plan the next 8 to 12 weeks of learning from where you are now"
  - "Know which skills transfer across clouds and tools and which don't"
  - "Know what to look for when judging a tool or a team's platform"
quiz:
  - q: "Which skill transfers to almost every tool in this course?"
    options: ["One vendor's UI", "SQL and data modelling", "A specific Kafka version", "Memorising cloud prices"]
    answer: 1
    why: "BigQuery, Spark SQL, Druid SQL, ksqlDB and dbt all rest on SQL and good modelling. They're the foundation."
  - q: "A good first big-data portfolio project is…"
    options: ["A generic CSV chart", "An industry-specific pipeline that answers a real business question, with tests, costs and a README", "A screenshot of a cloud console", "A copy of a tutorial"]
    answer: 1
    why: "Employers look for judgement on real problems: the right data model, reliability, cost and a clear story."
  - q: "When judging a new data tool, which question matters most?"
    options: ["Is it trending on social media?", "What problem does it solve better than what we have, at what cost to run and hire for?", "Does it have a dark mode?", "Is it written in Rust?"]
    answer: 1
    why: "Tools are trade-offs. The question is fit, total cost and the skills market, not novelty."
---

## Start from what you already have

If you come from BI and SQL, you already have the hardest-to-teach skills: **SQL, data modelling, reconciling numbers, explaining results to the business**. Build outward from them in this order. Each step is useful on its own, and each makes the next easier.

| Step | Learn | Practise on | Time |
|---|---|---|---|
| 1 | **BigQuery** in depth: partitioning, clustering, nested data, cost, `MERGE`, scripting | BigQuery sandbox and public datasets | 1–2 weeks |
| 2 | **dbt or Dataform** on BigQuery: tested models, documentation | dbt Core with the BigQuery sandbox | 1 week |
| 3 | **Python for data** and **PySpark** DataFrames; reading plans and the Spark UI | Local Spark, Colab, Databricks free edition | 2–3 weeks |
| 4 | **Airflow**: DAGs, idempotency, backfills, providers | Airflow in Docker | 1 week |
| 5 | **GCS, IAM, Dataproc / Serverless Spark** | Google Cloud free trial credit | 1 week |
| 6 | **Kafka** and one stream processor (Spark Structured Streaming or Flink) | Kafka in Docker | 2 weeks |
| 7 | **One serving store** in depth: Druid or ClickHouse for analytics, or Bigtable for key access | Docker quick starts, Bigtable emulator | 1 week |
| 8 | **ML platform basics**: point-in-time features, feature store, model registry | Feast, MLflow, BigQuery ML | 1 week |
| 9 | **Domain**: retail media, attribution, incrementality, experiment design | Module 7 exercises, public case studies | ongoing |

<div class="callout analogy">

**Analogy: learning a city.** First learn the main roads (SQL, modelling, one warehouse). Then the transit lines (Spark, Airflow, Kafka). Then the neighbourhoods (Druid, Bigtable, Elasticsearch). Tourists memorise landmarks (tool names); locals know how to get anywhere (the concepts). Aim to be a local.

</div>

## Concepts over products

Products change names and versions every year; these ideas don't. Make sure you can explain each without naming a tool:

- Partitioning, clustering and pruning; columnar storage; compression.
- Shuffles, skew and broadcast joins.
- Idempotency, backfills, late data, exactly-once results.
- Event time, windows, watermarks, state.
- OLTP vs OLAP; row keys and access patterns; inverted indexes.
- Point-in-time correctness, leakage, training-serving skew.
- Attribution vs incrementality; confidence intervals; power.
- Cost models: per byte scanned, per slot, per node-hour, egress.

## Free and cheap ways to practise

See [Free sandboxes](/learn/big-data-cloud/pages/setup/) for setup. In short: the **BigQuery sandbox** (no card), local **Spark**, **Kafka**, **Airflow**, **ClickHouse**, **Druid** and **OpenSearch** in Docker, the **Bigtable emulator**, Google Colab and the **Databricks free edition**, and Google Cloud's free trial credit for a few real cloud runs. Always set a **budget alert** before using paid credit.

## Certifications

Certifications don't replace projects, but some recruiters filter by them, and studying gives structure.

- **Google Cloud Professional Data Engineer:** the most relevant to this course; covers BigQuery, Dataflow, Dataproc, Pub/Sub, Bigtable, Composer and ML.
- **Databricks Certified Data Engineer Associate:** Spark and Delta Lake on Databricks.
- **Confluent Certified Developer for Apache Kafka:** Kafka concepts and clients.
- Cloud-specific alternatives if a target employer uses AWS or Azure (AWS Data Engineer Associate, Microsoft Fabric Data Engineer).

## What to look for in a tool

1. **Problem fit:** what does it do better than what's already there?
2. **Total cost:** licences or usage, people to run it, on-call load, training.
3. **Ecosystem and hiring:** connectors, community, how many people know it.
4. **Openness:** open formats (Parquet, Iceberg), open APIs, the exit path.
5. **Operations:** managed option, upgrades, monitoring, security model.

## What to look for in a team's platform (as a candidate)

Ask in interviews: How do you test pipelines? What happens when a job fails at 3 am? How do you track cost? Who owns data quality? How are schema changes handled? Answers tell you how mature the platform is, and asking them signals that you think like an engineer.

<div class="callout exercise">

**Exercise (20 minutes).** Write your own 8-week plan using the table: pick the steps you'll do, the project each produces, and the evening or weekend hours you can honestly give. Put it in the notes box below so it's saved with your progress.

</div>
