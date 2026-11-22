---
title: "Stream processing: windows, watermarks and state"
summary: "How Flink, Spark Structured Streaming, Dataflow and Kafka Streams turn endless events into answers, how late data is handled, and the Module 5 mini project."
module: 5
minutes: 30
outcomes:
  - "Explain tumbling, sliding and session windows"
  - "Explain watermarks and how late events are handled"
  - "Write a Spark Structured Streaming job that reads Kafka and aggregates by window"
quiz:
  - q: "A watermark of 10 minutes means…"
    options: ["Data is deleted after 10 minutes", "The engine waits for events up to 10 minutes late (by event time) before finalising a window", "Queries run every 10 minutes", "Kafka retention is 10 minutes"]
    answer: 1
    why: "The watermark trades completeness for latency: it bounds how long to wait for stragglers and how much state to keep."
  - q: "Counting sales per 5-minute block, with no overlap, uses…"
    options: ["A session window", "A tumbling window", "A sliding window", "No window"]
    answer: 1
    why: "Tumbling windows are fixed-size and non-overlapping. Sliding windows overlap; session windows close after a gap in activity."
  - q: "Which is a library inside your Java app, rather than a separate cluster?"
    options: ["Flink", "Kafka Streams", "Dataflow", "Dataproc"]
    answer: 1
    why: "Kafka Streams is a client library: you scale it by running more copies of your app. Flink and Dataflow are separate processing services."
---

## The problem: answers from a stream that never ends

"Sales per store per 5 minutes" is easy in batch: the data is complete. In a stream it never is. Stream processors solve this with three ideas: **windows**, **watermarks** and **state**.

<div class="callout analogy">

**Analogy: counting cars on a motorway bridge.** You report cars every 5 minutes (a **window**). Some drivers' dashcams upload their crossing time late, because they were in a tunnel. How long do you keep the 10:00–10:05 tally open for them? Say 10 minutes (the **watermark**). After that you close the book; anything later goes to a "late" pile. The tally sheets you keep open meanwhile are **state**.

</div>

## Windows

| Window | Shape | Example |
|---|---|---|
| **Tumbling** | Fixed size, no overlap | Sales per 5 minutes |
| **Sliding / hopping** | Fixed size, overlapping | Clicks in the last 10 minutes, updated every minute |
| **Session** | Closes after a gap of inactivity | One shopper's browsing session ends after 30 minutes idle |
| **Global with triggers** | Custom | Emit a running total every 100 events |

Always window by **event time** (when it happened), not processing time, or late data lands in the wrong bucket.

## Watermarks and late data

A **watermark** says "I believe all events up to time T have arrived." When it passes the end of a window, the window is final. Events later than the watermark are dropped, sent to a side output, or used to **update** a result already emitted, depending on the engine and your settings. A longer watermark is more complete but slower and needs more memory.

## State and checkpoints

Counts, joins and de-duplication need **state** that survives crashes. Engines keep it in memory or on local disk (RocksDB in Flink) and take **checkpoints** to durable storage, together with the Kafka offsets read so far. After a failure they restore both and carry on, which is how they offer exactly-once results.

## The engines

| Engine | Style | Choose it when |
|---|---|---|
| **Apache Flink** | True event-at-a-time, rich state and event-time features | Low latency, complex stateful logic (fraud, ad pacing); runs on Kubernetes, AWS Managed Flink, Confluent |
| **Spark Structured Streaming** | Micro-batches of DataFrames (a low-latency real-time mode is arriving in newer Spark versions) | You already use Spark; seconds of latency are fine; one code base for batch and streaming |
| **Dataflow (Apache Beam)** | Unified batch and streaming model, serverless on GCP | GCP shops, Pub/Sub sources, autoscaling without clusters |
| **Kafka Streams / ksqlDB** | Library inside your app / SQL on Kafka | Kafka in, Kafka out, microservice teams |

## A Structured Streaming job

```python
from pyspark.sql import SparkSession, functions as F
spark = (SparkSession.builder.appName("live-sales")
  .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.13:4.0.1")
  .getOrCreate())   # match the package version to your Spark and Scala versions

schema = "txn long, store string, sku int, price double, ts double"
events = (spark.readStream.format("kafka")
  .option("kafka.bootstrap.servers", "localhost:9092")
  .option("subscribe", "pos.sales.v1").option("startingOffsets", "earliest").load()
  .select(F.from_json(F.col("value").cast("string"), schema).alias("e")).select("e.*")
  .withColumn("event_time", F.col("ts").cast("timestamp")))

per_5min = (events
  .withWatermark("event_time", "10 minutes")
  .groupBy(F.window("event_time", "5 minutes"), "store")
  .agg(F.sum("price").alias("revenue"), F.count("*").alias("txns")))

(per_5min.writeStream.outputMode("update").format("console")
  .option("checkpointLocation", "chk/live-sales").start().awaitTermination())
```

Swap the console sink for Parquet in GCS, BigQuery, Kafka (to feed Druid) or a `foreachBatch` function that upserts.

## Where streams meet the platform

- **Streaming into the warehouse:** BigQuery's Storage Write API, Pub/Sub BigQuery subscriptions, Kafka Connect sinks.
- **Feeding serving stores:** Druid and Pinot read Kafka topics directly; Flink or Dataflow write to Bigtable.
- **Streaming features for ML:** "purchases in the last 30 minutes" computed in Flink and written to the online feature store (Lesson 22).

## Mini project for Module 5: the live store dashboard

<div class="callout project">

**Mini project (3 to 4 hours, local Docker).**

1. Run Kafka locally. Extend the Lesson 18 producer to send 50 events a second with **5% of events delayed by up to 15 minutes** (set `ts` in the past) and **1% duplicates**.
2. Use an **Avro or JSON schema** and reject malformed events to a `pos.sales.dlq` (dead-letter) topic.
3. Spark Structured Streaming (or Flink, or Kafka Streams): 5-minute tumbling windows per store with a 10-minute watermark, de-duplicated by `txn`.
4. Write results to a Parquet folder or DuckDB, and draw a live chart in Streamlit, Grafana or Superset that refreshes every 30 seconds.
5. Kill the streaming job mid-run, restart it, and show from the checkpoint that no window was double counted.
6. README: the latency you measured, how many late events were dropped at different watermarks, and the trade-off you chose.

</div>
