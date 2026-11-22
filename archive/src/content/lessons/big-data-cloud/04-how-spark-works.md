---
title: "How distributed processing works"
summary: "Drivers, executors, partitions, lazy plans and shuffles: what really happens when Spark runs your code on a cluster."
module: 2
minutes: 25
outcomes:
  - "Explain the driver, executors, tasks and partitions"
  - "Tell transformations from actions, and say why Spark is lazy"
  - "Spot narrow and wide operations, and why shuffles are expensive"
quiz:
  - q: "In Spark, which component plans the work and hands out tasks?"
    options: ["An executor", "The driver", "A partition", "The shuffle"]
    answer: 1
    why: "The driver turns your code into a plan and schedules tasks. Executors on worker machines do the actual work on partitions."
  - q: "You write df.filter(...).select(...). Nothing runs. Why?"
    options: ["Spark is broken", "Filter and select are transformations; Spark waits for an action such as count() or write", "You forgot to import Spark", "The cluster is asleep"]
    answer: 1
    why: "Transformations only build a plan. An action (count, show, collect, write) triggers execution, which lets Spark optimise the whole plan first."
  - q: "Which operation causes a shuffle?"
    options: ["filter", "withColumn", "groupBy(...).agg(...)", "select"]
    answer: 2
    why: "Grouping needs all rows with the same key on the same machine, so data moves across the network. Filter, select and withColumn work row by row within a partition."
  - q: "A Spark job has 2,000 tasks and 50 executor cores. Roughly how do the tasks run?"
    options: ["All 2,000 at once", "In waves of about 50 at a time", "One at a time", "Spark refuses to run"]
    answer: 1
    why: "Each core runs one task at a time, so tasks run in waves of about 50 until all 2,000 are done."
---

## Spark in one paragraph

**Apache Spark** is an engine that runs data processing across many machines. You write what you want (in Python with **PySpark**, in SQL, Scala, Java or R) and Spark works out how to split it into small tasks, runs them in parallel, and puts the results together. It started at UC Berkeley in 2009 as a faster replacement for Hadoop MapReduce, mainly because it keeps intermediate data in memory instead of writing it to disk after every step.

<div class="callout analogy">

**Analogy: marking 100,000 exam papers.** The head examiner (the **driver**) doesn't mark anything. They split the papers into bundles (**partitions**), hand bundles to markers (**executors**, each with a few hands, the **cores**), and collect the totals. Counting how many students passed is easy: each marker counts their bundle and reports a number. But "rank every student by school" means papers from the same school must be gathered on one desk: everyone stands up and swaps papers. That swapping is the **shuffle**, and it's always the slow part.

</div>

## The parts of a Spark application

- **Driver:** one process that runs your program, builds the plan and schedules tasks. If the driver dies, the job dies.
- **Executors:** processes on worker machines that run tasks and hold data in memory. Each has some **cores** (parallel slots) and memory.
- **Cluster manager:** hands out machines. On Google Cloud that's **YARN** on Dataproc, or **Kubernetes**; Databricks has its own.
- **Partition:** a chunk of the data. One task processes one partition. A 100 GB dataset in 128 MB pieces is about 800 partitions, so about 800 tasks per step.

So: **job** (one action) → **stages** (split at each shuffle) → **tasks** (one per partition per stage).

## Lazy evaluation: Spark plans before it runs

Spark operations are of two kinds:

- **Transformations** describe a new dataset: `filter`, `select`, `withColumn`, `join`, `groupBy`. They return immediately and run nothing.
- **Actions** need a result: `count()`, `show()`, `collect()`, `write...`. Only now does Spark run.

Waiting lets Spark's optimiser (**Catalyst**) look at the whole recipe and improve it: push filters down so less data is read, read only the needed columns, pick the best join strategy. It's like a chef reading the full order before starting, rather than cooking each dish the moment a word is spoken.

If a partition is lost (an executor crashes), Spark recomputes just that piece from the recipe, called the **lineage**. That's how it survives failures without copying all data everywhere.

## Narrow and wide operations

- **Narrow:** each output partition needs only one input partition. `filter`, `select`, `withColumn`, `map`. Fast: no data moves.
- **Wide:** an output partition needs data from many input partitions. `groupBy`, `join` (usually), `distinct`, `orderBy`, `repartition`. These trigger a **shuffle**: executors write data to disk, send it over the network, and the next stage reads it.

Shuffles are where jobs get slow, run out of memory or cost money. Half of Spark tuning (Lesson 6) is reducing or shaping shuffles.

## What Spark is made of

| Piece | What it's for |
|---|---|
| **Spark SQL and DataFrames** | Tables with columns, SQL and DataFrame code. What you'll use 90% of the time. |
| **Structured Streaming** | The same DataFrame code run on a stream, in micro-batches (Module 5). |
| **MLlib** | Distributed machine learning (regression, trees, ALS recommendations). |
| **GraphFrames / GraphX** | Graph processing. Less common. |
| **RDDs** | The original low-level API. You'll read about it, rarely write it. |

## Who uses Spark and why

- **Retail:** nightly processing of billions of receipts and loyalty events, building features for demand and propensity models.
- **Adtech and retail media:** joining ad impressions to sales across hundreds of millions of rows for attribution.
- **Banks:** risk calculations and regulatory reports over years of transactions.
- **Anyone with a lakehouse:** Spark is the default engine for reading and writing Iceberg and Delta tables.

You'll meet it as open-source Spark on **Dataproc** (Google), **EMR** (AWS), **HDInsight/Synapse/Fabric** (Microsoft), and most of all on **Databricks**, the company founded by Spark's creators.

<div class="callout exercise">

**Exercise (10 minutes, no code).** For each step, write N (narrow) or W (wide): (a) keep only rows from 2026; (b) add a column `price_with_tax = price * 1.13`; (c) total sales per store; (d) join sales to a 300-row store table; (e) sort all rows by date.

</div>

<details class="answer"><summary>Answers</summary>

(a) N, (b) N, (c) W (shuffle by store), (d) usually W, **but** Spark will broadcast a tiny 300-row table to every executor, which makes it effectively narrow (Lesson 6), (e) W (a global sort shuffles everything).

</details>
