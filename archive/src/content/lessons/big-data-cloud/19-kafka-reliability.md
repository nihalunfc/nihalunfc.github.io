---
title: "Reliable streams: guarantees, schemas, Connect and CDC"
summary: "At-most-once, at-least-once and exactly-once; schemas and the Schema Registry; Kafka Connect; and change data capture with Debezium."
module: 5
minutes: 25
outcomes:
  - "Explain the three delivery guarantees and how to get effectively-once results"
  - "Use schemas and compatibility rules so producers can't break consumers"
  - "Describe Kafka Connect and change data capture"
quiz:
  - q: "With at-least-once delivery, what must the consumer handle?"
    options: ["Lost messages", "Duplicate messages", "Encrypted messages", "Nothing"]
    answer: 1
    why: "At-least-once retries until success, so some messages may arrive twice. Make processing idempotent, for example by de-duplicating on an event ID or upserting by key."
  - q: "What does a Schema Registry with backward compatibility prevent?"
    options: ["Slow consumers", "A producer publishing a schema change (like removing a required field) that would break existing consumers", "Network failures", "Duplicate topics"]
    answer: 1
    why: "The registry checks every new schema version against the rules and rejects breaking changes."
  - q: "Change data capture (CDC) reads changes from…"
    options: ["Dashboards", "The database's transaction log (for example the Postgres WAL or MySQL binlog)", "Excel files", "Email"]
    answer: 1
    why: "Log-based CDC streams every insert, update and delete without querying the tables, with little load on the source."
---

## Delivery guarantees

Networks fail and machines restart, so a message can be lost or sent twice. Systems choose:

| Guarantee | Meaning | When |
|---|---|---|
| **At-most-once** | Never duplicated, may be lost | Metrics where a small loss is fine |
| **At-least-once** | Never lost, may be duplicated | The common default |
| **Exactly-once** | Each message affects the result once | Money, budgets, billing |

Kafka offers **idempotent producers** (no duplicates from retries) and **transactions** (read-process-write atomically), which Kafka Streams and Flink use for **exactly-once** processing inside Kafka. Once data leaves Kafka (to BigQuery, an API, an email), you get exactly-once **results** by making the sink idempotent: upsert by key or de-duplicate by event ID.

<div class="callout analogy">

**Analogy: sending a cheque by post.** At-most-once: post it once and hope. At-least-once: keep posting copies until they confirm, so they might get two. Exactly-once: post copies, but number the cheque, and the bank refuses any number it's already cashed. That cheque number is your **event ID**.

</div>

## Schemas: contracts for events

If the app team renames `price` to `unit_price`, every consumer breaks at 2 am. **Schemas** stop this.

- Formats: **Avro** (compact, schema-driven, the Kafka classic), **Protobuf** (popular with app developers), **JSON Schema**.
- A **Schema Registry** (Confluent, Apicurio, or Google's in Managed Kafka and Pub/Sub schemas) stores versions and enforces **compatibility**:
  - **Backward:** new consumers can read old data (you may add optional fields, delete fields).
  - **Forward:** old consumers can read new data.
  - **Full:** both.
- Messages carry a small schema ID, not the whole schema.

```json
{"type":"record","name":"Sale","namespace":"pos.v1","fields":[
  {"name":"txn_id","type":"string"},
  {"name":"store_id","type":"int"},
  {"name":"sku","type":"int"},
  {"name":"price","type":{"type":"bytes","logicalType":"decimal","precision":10,"scale":2}},
  {"name":"loyalty_id","type":["null","string"],"default":null},
  {"name":"ts","type":{"type":"long","logicalType":"timestamp-millis"}}]}
```

Topic naming and versioning (`pos.sales.v1`, `v2` for breaking changes) are part of the same discipline. Teams increasingly write **data contracts**: the schema plus owner, meaning, quality rules and service levels.

## Kafka Connect: plumbing without code

**Kafka Connect** runs **connectors** configured in JSON:

- **Source connectors** bring data in: databases (via Debezium), files, SaaS apps.
- **Sink connectors** send data out: **GCS** or S3 (as Parquet, partitioned by time), **BigQuery**, Elasticsearch, Bigtable, Snowflake.

Single message transforms can rename fields or mask personal data on the way. This is how the "Kafka → GCS Parquet" step in Lesson 2 usually works.

## Change data capture (CDC)

Business systems (orders, inventory, loyalty) live in OLTP databases. Copying whole tables nightly is slow and misses deletes. **Log-based CDC** reads the database's own change log and emits an event per insert, update and delete:

```json
{"op":"u","before":{"sku":88231,"price":4.99},"after":{"sku":88231,"price":4.49},"source":{"table":"products","ts_ms":1793786400000}}
```

- **Debezium** (open source, runs on Kafka Connect) supports Postgres, MySQL, SQL Server, Oracle, MongoDB and more.
- **Google Datastream** does serverless CDC into BigQuery and GCS.
- In the warehouse you **MERGE** changes into tables or keep the history as a slowly changing dimension.

## Who cares about this

Banks (every change audited), retailers (price and stock changes reaching the website and the warehouse in minutes), and every platform team that has been woken by a schema change. "Schema evolution" and "CDC" are frequent interview topics for data engineers.

<div class="callout exercise">

**Exercise (20 minutes).** (1) Add a field `promo_code` to the Sale schema above in a backward-compatible way. (2) Explain why changing `store_id` from `int` to `string` isn't backward compatible and how you'd roll it out instead. (3) Your BigQuery sink sometimes receives duplicates after a restart; write the SQL that de-duplicates by `txn_id`.

</div>

<details class="answer"><summary>Answers</summary>

(1) `{"name":"promo_code","type":["null","string"],"default":null}`: optional with a default. (2) Consumers reading with the new schema would expect a string where old data has an int; publish a new field `store_code` (string) alongside, migrate consumers, then remove the old field in `v2` or later. (3) `SELECT * FROM sales QUALIFY ROW_NUMBER() OVER (PARTITION BY txn_id ORDER BY ingest_ts DESC) = 1`, or a `MERGE` on `txn_id`.

</details>
