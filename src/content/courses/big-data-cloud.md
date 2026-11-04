---
title: "Data at Scale"
summary: "A readable course in big data, cloud and streaming: Spark and PySpark, Google Cloud (GCS, BigQuery, Dataproc, Airflow), Druid, Bigtable and Elasticsearch, Kafka, data platforms for AI and ML, and how retail media and ad measurement use all of it."
status: Live
order: 2
date: 2026-11-04
href: /learn/big-data-cloud/
length: "8 modules · 30 lessons · about 13 hours"
duration: "Self-paced, 2 to 4 weeks at an hour a day"
hours: 13
level: Beginner to intermediate
progressKey: data-at-scale-progress-v1
topics: [Spark, PySpark, BigQuery, GCS, Dataproc, Airflow, Druid, Bigtable, Elasticsearch, Kafka, Feature stores, Retail media, Ad measurement]
who: "Analysts and BI developers who know SQL and some Python and keep seeing these tools in job postings, students, and anyone who wants the big picture before going deep."
links:
  - { label: "Mini projects", href: "/learn/big-data-cloud/pages/projects/" }
  - { label: "Glossary", href: "/learn/big-data-cloud/pages/glossary/" }
  - { label: "Free sandboxes", href: "/learn/big-data-cloud/pages/setup/" }
modules:
  - { name: "The big picture", summary: "Why big data needs different tools, the map of how they connect, and who uses what in each industry." }
  - { name: "Spark and distributed processing", summary: "How a cluster splits work, PySpark DataFrames, what makes Spark slow, and Spark's relatives." }
  - { name: "The Google Cloud data stack", summary: "GCS, BigQuery, Dataproc and Airflow (Cloud Composer), with their AWS and Azure equivalents." }
  - { name: "Analytical and NoSQL databases", summary: "The database zoo, then Druid, Bigtable and Elasticsearch: what each is built for and how to choose." }
  - { name: "Streaming with Kafka", summary: "Events instead of files, Kafka's log, delivery guarantees and schemas, and stream processing." }
  - { name: "Data platforms for AI and ML", summary: "What models need from data, feature stores and MLOps, data for LLMs, and platform architecture." }
  - { name: "Retail media, adtech and measurement", summary: "Why retailers sell ads, how the ad plumbing works, how to measure if ads worked, and a full platform design." }
  - { name: "What to learn next", summary: "A learning path, how to read job postings and how to talk about this honestly in interviews." }
---

## What this course is

Job postings for data roles at large retailers, banks, media companies and tech firms keep asking for the same list: **Spark, a cloud warehouse such as BigQuery, an orchestrator such as Airflow, a streaming tool such as Kafka, a fast analytical or NoSQL store, and experience with platforms that feed machine learning**. Retail and marketing teams add **retail media and ad measurement**. If you come from SQL, Excel and Power BI, that list can feel like a wall.

This course turns the wall into a map. Each lesson is a reading of 15 to 25 minutes in plain language, with an **analogy** for the main idea, a **"who uses it and why"** section, a short **exercise** and a **quiz**. Each module ends with a **mini project**, and the course ends with a **capstone design** that ties every tool together on one retail media platform.

<div class="flow">

**Events** (clicks, sales, ad views) → **Kafka** (the conveyor belt) → **Spark / Dataflow** (the kitchen) → **GCS** (the pantry) and **BigQuery** (the library) → **Druid / Bigtable / Elasticsearch** (the fast counters) → **dashboards, ML models and ad measurement**, all run on time by **Airflow** (the conductor).

</div>

## How to take it

- **Order:** Module 1 first, then in order. Modules 4 and 5 can swap. Module 7 needs Modules 1 to 6.
- **Pace:** one lesson a day takes about a month; two a day takes two weeks.
- **Hands on:** every exercise runs on your laptop or on free tiers (the BigQuery sandbox, a local Spark, Kafka in Docker). See [Free sandboxes](/learn/big-data-cloud/pages/setup/). Nothing needs a credit card.
- **Finish line:** you can draw a modern data platform from memory, say which tool goes where and why, write basic PySpark, BigQuery SQL and an Airflow DAG, and explain how a retailer proves an ad campaign worked.

<div class="callout warn">

**Honest scope.** This course gives you a working mental model, vocabulary and first hands-on reps. It does not replace a year of running Spark jobs in production. Lesson 30 shows how to describe that gap truthfully in an interview.

</div>
