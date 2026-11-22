---
title: "Why big data needs different tools"
summary: "What changes when data stops fitting on one computer, and the three ideas every big-data tool is built on."
module: 1
minutes: 20
outcomes:
  - "Explain in one sentence when data counts as big"
  - "Name the three ideas behind every big-data tool: split, move less, keep a log"
  - "Tell scale-up from scale-out, and say why the cloud changed the economics"
quiz:
  - q: "A 3 GB CSV file loads slowly in Excel. What is the most sensible first step?"
    options: ["Set up a Spark cluster", "Use DuckDB, Polars or pandas on your laptop", "Move it to Bigtable", "Stream it through Kafka"]
    answer: 1
    why: "3 GB fits easily on one modern laptop. Single-machine tools are faster and simpler at this size. Big-data tools earn their keep when one machine is not enough."
  - q: "What does scale-out mean?"
    options: ["Buying a bigger server", "Adding more ordinary machines that share the work", "Compressing the data", "Deleting old data"]
    answer: 1
    why: "Scale-up buys a bigger machine. Scale-out adds more machines. Every tool in this course is built to scale out."
  - q: "Why do big-data systems try to 'move the code to the data'?"
    options: ["Code is secret", "Sending a small program over the network is much cheaper than sending terabytes of data", "Data cannot be copied", "It makes queries more accurate"]
    answer: 1
    why: "Networks are the slowest part of a cluster. Shipping a few kilobytes of code to where the data already sits avoids moving the data at all."
---

## The one-line definition

Data is **big** when one computer can no longer store it, process it fast enough, or keep up with how quickly it arrives. That's it. It's not a number of rows. It's the point where the tools you already know (Excel, a single SQL Server, pandas) stop coping.

People describe it with **the three Vs**:

| V | Means | Retail example |
|---|---|---|
| **Volume** | How much | Ten years of every till receipt in 1,500 stores: billions of rows |
| **Velocity** | How fast it arrives | Every click on the website and app, thousands per second |
| **Variety** | How many shapes | Receipts (tables), product reviews (text), shelf photos (images), app events (JSON) |

<div class="callout analogy">

**Analogy: one chef or a restaurant kitchen.** A home cook makes dinner for four on one stove. Asked to feed 4,000 people by 7 pm, the cook can't just cook faster. You need a kitchen: many cooks, each doing part of the work, a head chef handing out tasks, a pantry everyone can reach, and a system so orders don't get lost. Big-data tools are that kitchen. Spark is the team of cooks, cloud storage is the pantry, Kafka is the order rail, Airflow is the head chef's schedule.

</div>

## Scale up or scale out

When a job gets too big there are two ways to grow:

- **Scale up:** buy a bigger machine (more memory, more cores). Simple, but there's a ceiling, and the biggest machines cost far more per unit of power.
- **Scale out:** use many ordinary machines together, called a **cluster**. No ceiling in practice, and when one machine dies the others carry on. The price is complexity: work must be split up and results stitched back together.

Google published how it scaled out in two famous papers (the Google File System in 2003 and MapReduce in 2004). The open-source world copied the ideas as **Hadoop**, and nearly everything in this course descends from that moment.

## The three ideas behind every tool

Once you see these, every product in this course looks like a variation.

1. **Split the data and the work.** Cut a big table into **partitions** (chunks). Each machine works on its own chunks in parallel. Spark, BigQuery, Kafka, Druid and Bigtable all split data this way; they just split it by different rules.
2. **Move the code, not the data.** Networks are slow compared with reading from a local disk. So send the small program to the machines that already hold the data. When data *must* move between machines (a **shuffle**), that's usually the slowest, most expensive step, and much tuning is about avoiding it.
3. **Keep an append-only log, and expect failure.** With 1,000 machines, one fails every day. Systems write things down in order (a log), keep copies (**replication**), and can re-run lost work. Kafka *is* a log. Spark remembers the recipe for each result so it can recompute a lost piece.

## Why the cloud changed everything

Before about 2015, scale-out meant buying racks of servers and hiring people to run Hadoop. Today you rent it by the minute:

- **Storage and compute are separate.** Data sits in cheap object storage (Google Cloud Storage, Amazon S3, Azure Blob). Compute clusters start, do the work and shut down. You pay for storage all the time, but for compute only while it runs.
- **Serverless services hide the cluster.** In BigQuery you write SQL; Google decides how many machines to use. You never see a server.
- **Pay as you go** means a mistake costs money, not just time. A careless query over a petabyte table can cost real dollars. Cost awareness is now part of the job.

## When you do **not** need big-data tools

This matters in interviews as much as knowing the tools. A modern laptop handles **tens of gigabytes** with DuckDB or Polars, often faster than a small Spark cluster because there's no network and no start-up cost. Rule of thumb:

- Under ~50 GB and batch: single-machine tools, or a warehouse like BigQuery.
- Hundreds of GB to petabytes, or heavy custom processing: Spark (or Dataflow).
- Data arriving continuously and needed within seconds: streaming (Kafka plus a stream processor).
- Thousands of users needing answers in milliseconds: a serving store (Druid, Bigtable, Elasticsearch).

<div class="callout senior">

**What interviewers listen for.** Saying "I'd use Spark" is less impressive than saying "at 20 GB I'd use DuckDB, and I'd move to Spark or BigQuery when the data or the team outgrows one machine". Knowing the threshold shows judgement.

</div>

<div class="callout exercise">

**Exercise (10 minutes).** Pick a business you know (a supermarket, a hotel chain, a bank). Write down one data source for each V: something with huge **volume**, something with high **velocity**, something with **variety**. Then guess its size per day in MB or GB. Keep the note; you'll reuse it in Lesson 3.

</div>

<details class="answer"><summary>Example answer</summary>

A hotel chain: **volume** is ten years of reservations and folios (millions of rows, a few GB); **velocity** is website search and booking events (hundreds per second at peak, maybe 5 GB a day of JSON); **variety** is guest reviews (text), room photos (images) and the PMS nightly extract (CSV).

</details>
