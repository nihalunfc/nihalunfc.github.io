---
title: "Elasticsearch, and choosing a store"
summary: "Inverted indexes, relevance, analysers, shards and the ELK stack; then a decision table for picking the right store, and the Module 4 mini project."
module: 4
minutes: 30
outcomes:
  - "Explain how an inverted index makes text search fast"
  - "Describe indexes, documents, mappings, shards and replicas"
  - "Pick between BigQuery, Druid, Bigtable, Elasticsearch, Redis and Postgres for a requirement"
quiz:
  - q: "An inverted index maps…"
    options: ["Rows to columns", "Each word to the list of documents that contain it", "Users to passwords", "Dates to partitions"]
    answer: 1
    why: "Like the index at the back of a book: look up a term, get the pages. That's why text search is fast."
  - q: "OpenSearch is…"
    options: ["A Google product", "An open-source fork of Elasticsearch and Kibana started in 2021, led by AWS", "A type of Kafka topic", "A BI tool"]
    answer: 1
    why: "After Elastic changed its licence in 2021, AWS forked the last open-source version as OpenSearch. Elastic later added an AGPL option."
  - q: "Product search must handle typos and rank results by relevance. Which store fits?"
    options: ["Bigtable", "Elasticsearch or OpenSearch", "Druid", "A CSV in GCS"]
    answer: 1
    why: "Search engines provide analysers, fuzzy matching and relevance scoring. The others are not built for it."
---

## What Elasticsearch is

**Elasticsearch** is a distributed search and analytics engine built on the **Apache Lucene** library. You send it JSON documents; it indexes every field so you can search text, filter, sort and aggregate in milliseconds. It powers site search, log analytics and security monitoring. **OpenSearch** is the open-source fork, and **Apache Solr** is an older Lucene-based sibling.

<div class="callout analogy">

**Analogy: the index at the back of a book.** To find "Kafka" in a 900-page book you don't read every page; you look in the index, which lists the pages. An **inverted index** is that, for every word in every document. Elasticsearch also "cooks" the words first (lower-casing, removing "the", reducing "running" to "run") so "Running Shoes" finds "run shoe".

</div>

## Core ideas

- **Index:** a collection of documents (like a table). **Document:** a JSON object. **Mapping:** field types (`text` for full-text search, `keyword` for exact filters and aggregations, numbers, dates, `dense_vector` for embeddings).
- **Analysers:** tokenise and normalise text; language analysers, synonyms ("tee" = "t-shirt"), n-grams for search-as-you-type.
- **Relevance:** results are scored (BM25 by default); you can boost fields (title over description) and business signals (popularity, stock).
- **Shards and replicas:** an index is split into **primary shards** across nodes, each with **replica** copies for safety and read throughput.
- **Near real-time:** new documents become searchable within about a second (the refresh interval).

```json
GET products/_search
{
  "query": { "bool": {
    "must":   { "match": { "name": { "query": "rain jaket", "fuzziness": "AUTO" } } },
    "filter": [ { "term": { "size": "M" } }, { "range": { "price": { "lte": 80 } } } ] } },
  "aggs": { "by_brand": { "terms": { "field": "brand" } } }
}
```

That finds "rain jacket" despite the typo, filters by size and price, and returns brand counts for the side panel (facets).

## The ELK stack and logs

**Elasticsearch, Logstash and Kibana** (plus **Beats** shippers) became the standard for centralised logs: every server sends logs, Elasticsearch indexes them, Kibana searches and charts them. Data platforms use it to search pipeline logs and errors; security teams use it as a SIEM. Rivals: Splunk, Datadog, Grafana Loki, Google Cloud Logging.

## Who uses it

Retail and marketplaces for **product search** and filters; media for content search; banks and SaaS for **logs and security**; any app needing "search as you type". It now also does **vector and hybrid search** for AI (Lesson 23).

**Not** a system of record: keep the source of truth elsewhere and re-index from it. Not for heavy joins or big batch analytics.

## Choosing a store: the decision table

| Requirement | First choice | Why |
|---|---|---|
| Analysts' ad hoc SQL over years of data | **BigQuery** (or Snowflake) | Scales, any query, pay per use |
| Live dashboards for thousands of external users, seconds-fresh | **Druid** or **Pinot** (ClickHouse if simpler ops matter) | Low latency at high concurrency, streaming ingestion |
| One key's data in milliseconds, huge volume | **Bigtable** (Cassandra, DynamoDB) | Fast key access, massive throughput |
| Text search, typos, facets, relevance | **Elasticsearch / OpenSearch** | Inverted index and relevance scoring |
| Tiny, hot data: sessions, rate limits, caches | **Redis / Memorystore** | In-memory, microseconds |
| App transactions and modest analytics | **PostgreSQL / Cloud SQL / AlloyDB** | ACID, SQL, joins, cheap at small scale |
| Global transactions at scale | **Spanner** | Strongly consistent, distributed SQL |

Most large platforms use **several**, all fed from the same lake or Kafka topics.

## Mini project for Module 4: three stores, one dataset

<div class="callout project">

**Mini project (3 hours, all local with Docker).**

1. Generate one day of synthetic ad events (campaign, placement, device, user, impressions, clicks, spend) and a product catalogue of 5,000 items.
2. **Analytical:** load the events into **ClickHouse** or **Druid** (both have single-container quick starts) and build an hourly campaign query that runs in under a second. Try it with and without rollup or a pre-aggregated table.
3. **Key-value:** load per-user "last 10 ads seen" into **Redis** (or the Bigtable emulator via `gcloud beta emulators bigtable start`) with a well-designed key.
4. **Search:** index the catalogue in **OpenSearch** or Elasticsearch and get a fuzzy query plus brand facets working.
5. README: one table comparing load time, query time and what each store **can't** do.

</div>
