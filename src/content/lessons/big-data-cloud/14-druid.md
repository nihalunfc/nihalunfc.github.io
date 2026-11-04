---
title: "Apache Druid and real-time OLAP"
summary: "How Druid answers group-by questions on billions of fresh events in under a second: segments, rollup, streaming ingestion and its rivals Pinot and ClickHouse."
module: 4
minutes: 25
outcomes:
  - "Explain Druid's segments, time partitioning, rollup and bitmap indexes"
  - "Describe streaming ingestion from Kafka and how data becomes queryable in seconds"
  - "Compare Druid, Pinot, ClickHouse and BigQuery for a live dashboard"
quiz:
  - q: "What is rollup in Druid?"
    options: ["Deleting old data", "Pre-aggregating rows that share the same truncated time and dimensions at ingestion", "Backing up segments", "Sorting by user ID"]
    answer: 1
    why: "Rollup stores one row per (minute, campaign, placement…) with summed metrics, which can shrink data many times and speed up queries, at the cost of losing row-level detail."
  - q: "Druid always partitions data first by…"
    options: ["User ID", "Time", "Country", "File size"]
    answer: 1
    why: "Every Druid datasource has a primary timestamp, and segments are split by time interval. Most queries filter on time."
  - q: "Why might an advertiser portal use Druid rather than querying BigQuery directly?"
    options: ["BigQuery cannot do SQL", "Druid gives predictable sub-second answers to thousands of concurrent small queries on data that's seconds old", "Druid is a message queue", "Druid stores images"]
    answer: 1
    why: "Warehouses are great for big analytical queries; real-time OLAP stores are built for high concurrency, low latency and fresh data."
---

## The problem Druid solves

An ad platform shows each of 5,000 advertisers a dashboard: impressions, clicks and spend by hour, by placement, by device, for the last 30 days, **refreshed every minute**. That's thousands of group-by queries a minute over billions of rows, each expected back in under a second. A warehouse can answer each question; it struggles to answer **all of them, that fast, that fresh, that cheaply**.

**Apache Druid** was created at Metamarkets, an adtech company, in 2011 for exactly this, and is now used for ad analytics, network monitoring, product analytics and retail dashboards.

<div class="callout analogy">

**Analogy: a scoreboard, not a filing cabinet.** A warehouse keeps every ball of every match on file and can answer any question, given a moment. A stadium scoreboard keeps running totals that update the instant something happens and can be read by 50,000 people at once. Druid is a scoreboard you can still slice: totals by team, by quarter, by player, instantly.

</div>

## How it works

- **Datasource:** Druid's word for a table. Every row has a **timestamp**, **dimensions** (things you group and filter by: campaign, placement, device, store) and **metrics** (things you add up: impressions, clicks, spend).
- **Segments:** data is cut into time chunks (say one per hour or day), stored in a columnar format with compressed **bitmap indexes** on dimensions. A filter on `campaign = 'C123' AND device = 'mobile'` becomes fast bitwise maths on bitmaps.
- **Rollup:** at ingestion, rows with the same truncated time (say the minute) and the same dimension values are combined into one row with summed metrics. A billion raw events can become tens of millions of rows. You lose individual events, so keep raw data in GCS or BigQuery.
- **Approximate algorithms:** sketches (HyperLogLog, Theta) give fast distinct counts such as unique reach.
- **Deep storage:** segments are kept durably in GCS or S3; servers cache them on local disk for speed.

### The processes

| Process | Role |
|---|---|
| **Broker** | Receives queries, sends pieces to the servers holding the data, merges results |
| **Historical** | Serves older, immutable segments |
| **Ingestion tasks (Peons / Middle Managers)** | Read from Kafka or files and serve the newest data before it's handed off |
| **Coordinator / Overlord** | Balance segments and manage ingestion |

## Streaming ingestion from Kafka

A Kafka **supervisor** reads an ad-events topic continuously. New events are **queryable within seconds**, while being indexed. Every hour (or whatever segment granularity you set), the data is published as segments to deep storage and served by historicals. This is why Kafka and Druid appear together in so many job postings.

## Querying

Druid speaks **SQL**:

```sql
SELECT TIME_FLOOR(__time, 'PT1H') AS hr, placement,
       SUM(impressions) AS imps, SUM(clicks) AS clicks,
       SUM(clicks) * 1.0 / SUM(impressions) AS ctr,
       APPROX_COUNT_DISTINCT_DS_HLL(user_sketch) AS reach
FROM ad_events
WHERE __time >= CURRENT_TIMESTAMP - INTERVAL '1' DAY AND campaign_id = 'C123'
GROUP BY 1, 2 ORDER BY 1;
```

Superset, Grafana, Looker and custom apps connect to it. **Imply** is the company that sells a managed Druid.

## Druid and its rivals

| | **Druid** | **Apache Pinot** | **ClickHouse** | **BigQuery** |
|---|---|---|---|---|
| Born at | Metamarkets (adtech) | LinkedIn ("who viewed your profile") | Yandex (web analytics) | Google |
| Sweet spot | Time-based slice-and-dice, streaming | User-facing analytics, very high concurrency, upserts | Fast SQL on big tables, simple to run, rich SQL | Large ad hoc analytics, no ops |
| Joins | Limited (improving) | Limited | Good | Excellent |
| Fresh data | Seconds | Seconds | Seconds to minutes | Seconds (streaming) to minutes |
| Concurrency | High | Very high | Medium to high | Moderate (slots) |

ClickHouse has become very popular because it's one binary, quick to learn and fast on most analytics. Druid and Pinot win when you need **predictable low latency for many users on streaming data**.

<div class="callout senior">

**Design questions an interviewer may ask.** What's your rollup granularity, and what detail do you lose? Which dimensions have very high cardinality (user ID) and should not be dimensions? How do you handle late events that arrive after the segment is published (re-ingest the interval from the lake)? Where's the raw copy for audits?

</div>

<div class="callout exercise">

**Exercise (15 minutes).** One day of ad events has 2 billion rows with columns: timestamp (ms), campaign (2,000 values), placement (40), device (4), country (12), user_id (300 million), impressions, clicks, spend. Choose the rollup granularity and dimensions for an advertiser dashboard, estimate the rolled-up row count, and say how you'd still report unique reach.

</div>

<details class="answer"><summary>One answer</summary>

Roll up to the **minute** with dimensions campaign, placement, device and country, and drop `user_id` as a dimension. At most 1,440 × 2,000 × 40 × 4 × 12 combinations, but most never occur; realistically tens of millions of rows, a large reduction from 2 billion. Keep a **HyperLogLog sketch** of `user_id` as a metric for approximate unique reach. Raw events stay in GCS/BigQuery for exact audits.

</details>
