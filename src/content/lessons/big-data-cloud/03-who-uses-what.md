---
title: "Who uses what, and why, by industry"
summary: "How retail, adtech, banking, telecom, logistics, healthcare, media and energy use these tools, and the roles that own each part."
module: 1
minutes: 20
outcomes:
  - "Say which tools each industry relies on and the business reason"
  - "Tell the roles apart: data analyst, analytics engineer, data engineer, platform engineer, ML engineer"
  - "Read a job posting and guess what the team's platform looks like"
quiz:
  - q: "Why do banks and payment companies lean heavily on streaming?"
    options: ["Regulators require Kafka", "Fraud must be stopped before the payment completes, in milliseconds", "Streaming is cheaper than batch", "Banks have no batch jobs"]
    answer: 1
    why: "A fraud check that runs tomorrow morning is useless. Payments need a decision in milliseconds, so events are scored as they stream in."
  - q: "Which role most often owns Spark jobs, Kafka topics and Airflow DAGs?"
    options: ["Data analyst", "Data engineer", "Product manager", "Business analyst"]
    answer: 1
    why: "Data engineers build and run pipelines. Analysts and analytics engineers mostly work in the warehouse with SQL and dbt."
  - q: "A posting says 'Druid, Kafka, measurement, advertisers'. What kind of team is it most likely?"
    options: ["Payroll", "Retail media or adtech analytics", "Hospital records", "Weather forecasting"]
    answer: 1
    why: "Druid was born in adtech, Kafka carries ad events, and 'measurement' and 'advertisers' point to a retail media or ad platform team."
---

## The same tools, different reasons

Every industry has the seven jobs from Lesson 2, but what hurts most differs. That pain decides which tools they buy.

| Industry | What hurts most | Tools they lean on | Why |
|---|---|---|---|
| **Retail and grocery** | Billions of receipts, thousands of SKUs, loyalty data, stock-outs | BigQuery or Snowflake, Spark, Airflow, Kafka for stock and online orders, Bigtable for app personalisation | Demand forecasting, replenishment, pricing, loyalty offers and now **retail media** |
| **Adtech and retail media** | Billions of ad events a day, advertisers want live numbers | Kafka, Druid or Pinot, Spark, BigQuery, clean rooms | Real-time spend pacing and campaign dashboards, attribution and incrementality |
| **Banking and payments** | Fraud in milliseconds, strict audit | Kafka, Flink, Cassandra or Bigtable, Spark, Elasticsearch for logs | Fraud scoring per transaction, regulatory reporting, full audit trails |
| **Telecom** | Network events from millions of devices | Kafka, Spark, time-series stores, Druid | Outage detection, churn models, usage billing |
| **Logistics and delivery** | GPS pings, ETAs, route changes | Kafka, Flink, Bigtable or Cassandra, BigQuery | Live tracking, ETA prediction, route optimisation |
| **Media and streaming** | Viewing events, recommendations | Kafka, Spark, Cassandra, feature stores | "Because you watched" recommendations, ad insertion, content analytics |
| **Healthcare and pharma** | Privacy, varied formats (HL7, FHIR, images) | Spark, BigQuery or Snowflake, strict governance | Population health, trial analytics, de-identified research data |
| **Energy and utilities** | Smart-meter readings every 15 min, sensors | Kafka, time-series databases, Spark, Bigtable | Load forecasting, outage response, grid balancing |
| **Software and SaaS** | Logs and app events | Elasticsearch/OpenSearch, Kafka, ClickHouse | Search, monitoring, product analytics |

<div class="callout analogy">

**Analogy: the same toolbox, different jobs.** Every builder owns a hammer, a saw and a drill. A cabinet maker reaches for the saw all day; a roofer lives on the nail gun. Industries are the same: everyone has storage, processing and SQL, but a bank lives on its streaming tools, a supermarket on its warehouse, an ad platform on its fast analytical store.

</div>

## Why retail is now a big-data industry

Retailers used to be "batch and reports" companies: last night's sales, this week's stock. Three things changed that:

1. **Online and app shopping** brought click-level data and the need for live stock and personalisation.
2. **Loyalty programmes** linked purchases to people, which made customer-level models (offers, churn, lifetime value) possible.
3. **Retail media**: retailers discovered that their shopper data is valuable to the brands they sell, and started selling ads on their sites, apps, screens in store and offsite. Ads need real-time event pipelines and rigorous measurement, which pulled adtech tools (Kafka, Druid, clean rooms) into retail. Module 7 covers this in depth.

## Who does what: the roles

| Role | Main tools | Main output |
|---|---|---|
| **Data analyst / BI developer** | SQL, Power BI, Looker, Tableau, Excel | Dashboards, answers, insights |
| **Analytics engineer** | SQL, dbt, BigQuery or Snowflake, Git | Clean, tested models in the warehouse |
| **Data engineer** | Python, Spark, Airflow, Kafka, cloud services | Pipelines that move and transform data reliably |
| **Data platform engineer** | Kubernetes, Terraform, cloud IAM, Kafka and Spark operations | The platform the data engineers build on |
| **ML engineer / MLOps** | Python, feature stores, Vertex AI or SageMaker, model serving | Models in production, retraining pipelines |
| **Data scientist** | Python, notebooks, statistics, SQL | Models, experiments, measurement studies |
| **Measurement / marketing scientist** | SQL, Python or R, experiment design | Incrementality tests, attribution, MMM |

A job posting that lists Spark, GCP, Druid, Kafka, ML platforms *and* measurement is usually a **data engineer on a retail media or marketing data platform**. If you come from BI, your strongest bridge is the warehouse and measurement side, then Spark and Airflow, then streaming.

## How to read a posting

- **Required** vs **nice to have**: "experience with" usually means "you can do it with some help"; "expert in" means you'd lead it.
- **Clusters of tools reveal the stack.** "Dataproc, BigQuery, GCS, Airflow" means a Google Cloud batch platform; adding "Kafka, Druid" means a real-time layer; "Vertex AI" or "feature store" means they feed ML.
- **Domain words tell you the business problem.** "Advertisers, campaigns, attribution, incrementality, clean room" means retail media measurement.

<div class="callout exercise">

**Exercise (10 minutes).** Find one real data job posting in any industry. Copy every tool name into the seven-job table from Lesson 2. Which jobs have no tool listed? That gap often tells you what's already outsourced or bought (for example, no orchestrator listed may mean dbt Cloud or Composer is already in place).

</div>

## Mini project for Module 1: your platform one-pager

<div class="callout project">

**Mini project (45 minutes).** Write a one-page "platform sketch" for an imaginary national grocery chain with 300 stores, an app and a retail media business.

1. A diagram of the seven jobs with one tool per box (pen and paper or draw.io).
2. One sentence per box on **why** that tool (for example, "BigQuery: analysts already know SQL and we don't want to run servers").
3. Mark the batch and streaming paths in different colours.
4. List three risks (cost, privacy, a single point of failure).

Keep it. You'll compare it against the capstone design in Lesson 28 and see how much your thinking changed.

</div>
