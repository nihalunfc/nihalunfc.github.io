---
title: "The database zoo"
summary: "OLTP and OLAP, row and column stores, and the NoSQL families (key-value, document, wide-column, search, time-series, graph, vector), with the trade-offs behind each."
module: 4
minutes: 25
outcomes:
  - "Tell OLTP from OLAP and row stores from column stores"
  - "Name the NoSQL families with one product and one use case each"
  - "Explain why designing for the query comes first in NoSQL"
quiz:
  - q: "A checkout system writes one order at a time and reads one customer's orders. That workload is…"
    options: ["OLAP", "OLTP", "Batch", "Search"]
    answer: 1
    why: "Many small reads and writes of individual records is transactional (OLTP), served by Postgres, MySQL, Spanner and similar."
  - q: "Which family stores data under a row key with flexible columns and is built for huge write volumes?"
    options: ["Graph", "Wide-column (Bigtable, Cassandra, HBase)", "Relational", "Spreadsheet"]
    answer: 1
    why: "Wide-column stores keep rows sorted by key, spread across many servers, and handle millions of writes per second."
  - q: "In most NoSQL databases you design the table around…"
    options: ["Normalising every entity", "The exact queries the application will run", "The order columns were invented", "Whatever is easiest to load"]
    answer: 1
    why: "NoSQL stores trade flexible querying for speed and scale, so the key design must match the access pattern."
---

## Two kinds of work

| | **OLTP** (transactions) | **OLAP** (analytics) |
|---|---|---|
| Typical question | "Save this order." "Show order 123." | "Revenue by region by week for two years." |
| Rows touched | A few | Millions to billions |
| Storage | **Row** store | **Column** store |
| Examples | PostgreSQL, MySQL, SQL Server, Oracle, Spanner, AlloyDB | BigQuery, Snowflake, Redshift, ClickHouse, Druid, Pinot, DuckDB |

<div class="callout analogy">

**Analogy: a phone book and a census report.** A phone book (row store) is perfect for finding one person and everything about them. A census report (column store) is perfect for "average age by city", because all the ages are printed together. Ask the phone book for the average age and you'd flip every page.

</div>

## The NoSQL families

"NoSQL" just means "not only relational". Each family gives up something (joins, flexible queries, strict consistency) to get something (scale, speed, flexibility).

| Family | Shape | Products | Great for |
|---|---|---|---|
| **Key-value** | `key → value` | Redis, Memcached, DynamoDB | Caches, sessions, counters, feature lookups |
| **Document** | JSON documents | MongoDB, Firestore, Couchbase | App data with varied shapes: product catalogues, user profiles |
| **Wide-column** | Row key → column families → columns, sorted by key | **Bigtable**, HBase, Cassandra, ScyllaDB | Time series, events, IoT, very high write rates, ML feature serving |
| **Search** | Inverted index of terms | **Elasticsearch**, OpenSearch, Solr | Full-text and fuzzy search, logs, filtering with facets |
| **Real-time OLAP** | Columnar segments, pre-aggregated | **Druid**, Pinot, ClickHouse | Sub-second dashboards on fresh event data for many users |
| **Time-series** | Timestamped measurements | InfluxDB, TimescaleDB, Prometheus | Metrics, sensors, monitoring |
| **Graph** | Nodes and edges | Neo4j, Neptune, Spanner Graph | Fraud rings, recommendations, networks |
| **Vector** | Embeddings with similarity search | pgvector, Pinecone, Vertex AI Vector Search, Elasticsearch | Semantic search, RAG for LLMs (Lesson 23) |

## The trade-offs in plain words

- **Scale-out comes from a key.** NoSQL systems spread data across servers by a key (a row key, a partition key). Queries by that key are fast; queries by anything else may be slow or impossible.
- **Design for the query.** In relational design you model the entities and write any query later. In wide-column and key-value stores you list the queries first and shape the key to answer them. Duplicating data across tables for different queries is normal.
- **Consistency choices.** When servers are spread out and the network fails, a system must choose between always answering (possibly stale) or refusing until it's sure (the **CAP theorem**). Bigtable gives strong consistency within a cluster; Cassandra lets you tune it per query.
- **Joins are rare.** Most NoSQL stores don't join; you **denormalise** ahead of time, usually in a Spark or Flink job.

## Why analytical platforms add these stores

A warehouse like BigQuery answers big questions in seconds, but:

- it isn't built for **thousands of concurrent users** wanting answers in **under a second** (an advertiser portal, a store manager app);
- it isn't built for **looking up one key in milliseconds** (a customer's features for a model, live);
- it isn't a **search engine** ("blue rain jacket, size M, under $80").

So platforms copy a slice of data into a **serving store** shaped for that job: Druid for dashboards, Bigtable for key lookups, Elasticsearch for search. The next three lessons take each in turn.

<div class="callout exercise">

**Exercise (10 minutes).** Match each need to a family: (1) "show this shopper's last 50 product views in the app in 10 ms"; (2) "advertisers see impressions and clicks by hour, refreshed every minute"; (3) "search products by name with typos"; (4) "find groups of accounts sharing devices and cards"; (5) "store each user's cart while they shop".

</div>

<details class="answer"><summary>Answers</summary>

(1) Wide-column (Bigtable), keyed by `user#reverse_timestamp`; (2) real-time OLAP (Druid or Pinot); (3) search (Elasticsearch or OpenSearch); (4) graph (Neo4j or Spanner Graph); (5) key-value (Redis or Memorystore).

</details>
