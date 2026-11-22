---
title: "Projects"
summary: "Seven mini projects and one capstone, one per module, all on synthetic or public data and free tools. Each is sized to put on GitHub with a clear README."
page: true
---

Each module ends with a mini project that uses what you just read. Together they build towards the capstone: a small but complete retail media data platform. All data is **synthetic or public**; never use an employer's data, even masked.

| # | Project | Module | You'll show | Time |
|---|---|---|---|---|
| 1 | [Platform one-pager](/learn/big-data-cloud/lessons/who-uses-what/#mini-project-for-module-1-your-platform-one-pager) | The big picture | You can map tools to jobs and justify them | 45 min |
| 2 | [The nightly sales job](/learn/big-data-cloud/lessons/spark-family/#mini-project-for-module-2-the-nightly-sales-job) | Spark | PySpark cleaning, joins, skew, partitioned Parquet, reading the plan | 2–3 h |
| 3 | [The cloud nightly pipeline](/learn/big-data-cloud/lessons/airflow/#mini-project-for-module-3-the-cloud-nightly-pipeline) | Google Cloud | Airflow DAG, sensors, idempotent backfills, BigQuery marts, cost estimate | 3–4 h |
| 4 | [Three stores, one dataset](/learn/big-data-cloud/lessons/elasticsearch/#mini-project-for-module-4-three-stores-one-dataset) | Databases | Real-time OLAP, key-value design and search, compared honestly | 3 h |
| 5 | [The live store dashboard](/learn/big-data-cloud/lessons/stream-processing/#mini-project-for-module-5-the-live-store-dashboard) | Kafka | Schemas, dead letters, windows, watermarks, restart without double counting | 3–4 h |
| 6 | [An ML-ready feature pipeline](/learn/big-data-cloud/lessons/platform-architecture/#mini-project-for-module-6-an-ml-ready-feature-pipeline) | AI and ML | Point-in-time features, leakage test, online lookup | 3–4 h |
| 7 | [Capstone: retail media platform](/learn/big-data-cloud/lessons/retail-media-platform/) | Retail media | Design doc, streaming and batch slice, attribution vs measured lift | 6–10 h |
| 8 | [Decode a posting](/learn/big-data-cloud/lessons/postings-and-interviews/) | What next | Your evidence mapped to a real job, honest experience statements | 1 h |

## What every project README should have

1. **The business question** in one sentence, and who would ask it.
2. **A diagram** of the flow, with each tool and why it was chosen.
3. **How to run it** in under five commands.
4. **Tests and checks:** row counts, duplicates, freshness, a reconciliation.
5. **Results:** the numbers or screenshots, with what they mean.
6. **Cost:** what it would cost per month at a realistic scale, with your working.
7. **What I'd do next** with a real team and real data.

## Synthetic data tips

- Plant faults on purpose: duplicates, late events, nulls in keys, one hot key, refunds as negatives, a schema change halfway through.
- Plant the answer: for the capstone, set a true lift (say +15%) and check your measurement recovers it within the confidence interval.
- Seed your random generator so others can reproduce your results.
