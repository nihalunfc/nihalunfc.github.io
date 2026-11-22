---
title: "Bigtable and wide-column stores"
summary: "Row keys, column families, tablets and hotspots: how Bigtable serves millions of reads and writes a second in milliseconds, and how HBase, Cassandra and DynamoDB compare."
module: 4
minutes: 25
outcomes:
  - "Explain Bigtable's data model: row key, column families, qualifiers and cell versions"
  - "Design row keys that avoid hotspots and answer the query with one range scan"
  - "Say when Bigtable is right and when BigQuery or Firestore is better"
quiz:
  - q: "Why is a row key that starts with a timestamp a bad idea?"
    options: ["Timestamps are too long", "All new writes go to the same tablet (a hotspot), overloading one server", "Bigtable rejects numbers", "It breaks SQL"]
    answer: 1
    why: "Rows are sorted by key, so sequential keys send all current writes to one node. Lead with a well-distributed field such as user ID or a hash."
  - q: "Bigtable can efficiently look up data by…"
    options: ["Any column", "The row key, or a range of row keys (prefix scan)", "Only the timestamp", "Full-text search"]
    answer: 1
    why: "Bigtable has one index: the row key. Everything else needs a scan or a second table keyed differently."
  - q: "Which workload suits Bigtable best?"
    options: ["Monthly finance report with complex joins", "Serving per-user ML features to an app in under 10 ms at high volume", "A 2 GB spreadsheet", "Ad hoc analyst SQL"]
    answer: 1
    why: "Bigtable is built for high-throughput, low-latency key access. Joins and ad hoc analysis belong in BigQuery."
---

## Bigtable in one paragraph

**Bigtable** is Google's wide-column NoSQL database, described in a 2006 paper and still behind Search, Maps and YouTube. On Google Cloud it's a managed service that delivers **single-digit millisecond** reads and writes and scales to **millions of operations per second** by adding nodes. **Apache HBase** is its open-source copy (and Bigtable speaks the HBase API), **Cassandra** and **ScyllaDB** are close cousins, and **DynamoDB** fills the same role on AWS.

<div class="callout analogy">

**Analogy: a vast, alphabetised card index.** Every card has a label (the **row key**) and cards are kept in strict alphabetical order across thousands of drawers. Finding one card, or every card between "user123#2026-11-01" and "user123#2026-11-04", is instant. Finding "every card mentioning cereal" means reading every drawer. So you choose the label carefully, because it's the only way in.

</div>

## The data model

- **Table** → rows sorted by **row key** (bytes, up to 4 KB, though keep them short).
- **Column families** (a few, defined up front) group related columns, such as `profile` and `views`.
- **Column qualifiers** can be created freely per row (`views:sku_88231`), so rows can have very different columns. Empty cells take no space.
- **Cells** hold values with **timestamps**; you can keep several versions and set garbage collection rules ("keep 30 days" or "keep last 5").
- Writes to a single row are atomic. There are no multi-row transactions and no joins.

Under the hood the key space is split into **tablets** (ranges of keys) spread over nodes; Bigtable moves tablets around to balance load. Data sits in Google's distributed file system, so adding nodes doesn't copy data.

## Row key design: the whole game

Write down the queries first, then design the key so each is a single lookup or one contiguous scan.

| Query | Good row key | Why |
|---|---|---|
| A user's recent product views | `user_id#reverse_ts` | All of one user's rows together; newest first |
| Latest reading per sensor | `sensor_id#reverse_ts` | One prefix scan, limit 1 |
| Store-SKU stock level | `store_id#sku` | Point lookup |
| All events in the last hour (any user) | Don't use Bigtable alone; send them to BigQuery or Druid | Range by time across users creates hotspots |

**Avoid hotspots:** don't start keys with a timestamp or an incrementing ID; spread writes by leading with a well-distributed field, or add a short hash prefix (`hash(user)%100#user#ts`) and scan all prefixes when needed. **Reverse timestamps** (`MAX - ts`) put the newest rows first.

## Who uses Bigtable and why

- **Personalisation:** recent views and purchases per shopper, read by the app's recommendation service.
- **ML feature serving:** Vertex AI's online feature store can use Bigtable to serve features at low latency.
- **Ad tech:** user profiles, frequency caps ("this user has seen this ad 3 times today"), budget counters.
- **Finance:** market tick data and transaction histories per account.
- **IoT and energy:** smart-meter readings per meter.

## When not to use it

- Analysts need ad hoc SQL and joins → **BigQuery** (which can query Bigtable as an external table for occasional analysis).
- Small app data with flexible queries → **Firestore**, **Cloud SQL** or **Postgres**.
- Under about 1 TB with modest traffic → a managed relational database is usually simpler and cheaper; Bigtable has a minimum cost per node-hour.
- Need multi-row transactions or global SQL consistency → **Spanner**.

<div class="callout exercise">

**Exercise (15 minutes).** A grocery app must show (a) a shopper's last 20 purchases, (b) their loyalty points balance, and (c) the "frequently bought together" list for any product. Design one or two Bigtable tables: row keys, column families, and garbage collection rules. Then say which query you'd refuse to support in Bigtable and where it belongs instead.

</div>

<details class="answer"><summary>One design</summary>

Table `shopper`: key `shopper_id`; family `bal` (points, 1 version); family `buys` with qualifiers `reverse_ts#order_id` (GC: keep 90 days). Reading the row and taking the first 20 `buys` columns gives (a), and `bal` gives (b). Table `product_pairs`: key `sku`, family `fbt` with qualifiers `other_sku` and value = score, rebuilt nightly by a Spark job. "Which shoppers bought cereal last week?" is an analytics question: refuse it here and send it to BigQuery.

</details>
