---
title: "Glossary"
summary: "Every term in the course in one or two plain sentences, A to Z."
page: true
---

| Term | Meaning |
|---|---|
| **ACoS** | Advertising cost of sales: ad spend ÷ attributed revenue. The inverse of ROAS. |
| **Action (Spark)** | An operation that returns or writes a result (`count`, `show`, `write`) and triggers execution. |
| **Adstock** | In marketing mix models, the idea that an ad's effect carries over and decays over time. |
| **Airflow** | Open-source orchestrator: Python DAGs of tasks with schedules, retries and monitoring. Managed on GCP as Cloud Composer. |
| **Attribution** | Rules that credit sales to ads that came before them (last touch, first touch, data-driven). Correlation, not proof. |
| **Avro** | A compact, schema-based row format, common for Kafka messages. |
| **Backfill** | Running a pipeline for past dates. Needs idempotent tasks. |
| **Batch** | Processing data in scheduled chunks (hourly, nightly). |
| **BigQuery** | Google's serverless, columnar data warehouse, priced by bytes scanned or reserved slots. |
| **Bigtable** | Google's wide-column NoSQL database for millisecond reads and writes by row key at huge scale. |
| **Broadcast join** | Copying a small table to every executor so a big table needn't be shuffled. |
| **Broker** | A Kafka server. A cluster has several. |
| **CDC** | Change data capture: streaming inserts, updates and deletes from a database's log (Debezium, Datastream). |
| **Clean room** | A controlled environment where partners analyse combined data without seeing each other's rows. |
| **Closed loop** | Linking ad exposure to actual purchases with the retailer's own data. |
| **Clustering (BigQuery)** | Sorting data inside partitions by up to four columns, so filters on them scan less. |
| **Column store** | Storage that keeps each column together; fast for analytics. |
| **Consumer group** | Kafka consumers sharing a topic's partitions; each partition goes to one member. |
| **CPM / CPC / CTR** | Cost per thousand impressions; cost per click; clicks ÷ impressions. |
| **DAG** | Directed acyclic graph: a workflow of tasks with dependencies and no loops. |
| **Data lake** | Cheap object storage holding raw and processed files (GCS, S3). |
| **Data mesh** | Domain teams owning data as products on a shared self-serve platform. |
| **Dataflow** | Google's serverless runner for Apache Beam batch and streaming pipelines. |
| **Dataproc** | Google's managed Spark and Hadoop service, with clusters or serverless batches. |
| **Driver / executor** | Spark's planner process and its worker processes. |
| **DSP / SSP** | Demand-side platform (advertisers buy) and supply-side platform (publishers sell). |
| **Druid** | Real-time analytics database for sub-second group-by queries on fresh event data. |
| **Elasticsearch** | Search and analytics engine built on Lucene; inverted indexes, relevance, logs. OpenSearch is its open fork. |
| **Embedding** | A vector of numbers representing meaning; similar items have nearby vectors. |
| **Event time** | When something happened, as opposed to when it was processed. |
| **Exactly-once** | Each event affects the result once, even with retries. |
| **Feature store** | Definitions plus offline (history) and online (latest) stores for ML features. |
| **Flink** | Stream-first processing engine with rich state and event-time handling. |
| **Frequency cap** | A limit on how often one user sees an ad. |
| **GCS** | Google Cloud Storage: object storage in buckets. |
| **iROAS** | Incremental revenue ÷ ad spend: the causal return. |
| **Iceberg / Delta / Hudi** | Open table formats that add transactions, updates and time travel to files in a lake. |
| **Idempotent** | Running it twice gives the same result as running it once. |
| **Incrementality** | The extra outcome caused by ads, measured against a control group. |
| **Inverted index** | A map from each term to the documents containing it. |
| **Kafka** | Distributed, durable, partitioned log for event streams. |
| **Lakehouse** | Warehouse-like tables on open formats in a data lake, read by many engines. |
| **Lambda / kappa** | Architectures with separate batch and speed layers / a single streaming layer with replay. |
| **Lazy evaluation** | Spark builds a plan from transformations and runs it only when an action is called. |
| **Leakage** | Training a model with information that wouldn't be available at prediction time. |
| **Lift** | (test − control) ÷ control: the relative effect of a treatment. |
| **MMM** | Marketing mix modelling: estimating channel effects from aggregated sales and spend over time. |
| **Medallion** | Bronze (raw), silver (clean), gold (business) data layers. |
| **Offset** | A message's position in a Kafka partition. |
| **OLTP / OLAP** | Transactional workloads (many small reads and writes) / analytical workloads (big scans and aggregates). |
| **Pacing** | Spreading campaign spend across its flight so the budget isn't exhausted early or left unspent. |
| **Parquet** | Columnar, compressed, typed file format; the default for analytics files. |
| **Partition** | A chunk of data. In Spark, the unit of parallel work; in BigQuery, a date or range slice; in Kafka, an ordered log. |
| **Point-in-time join** | Joining features as they were at a given time, to avoid leakage. |
| **Pub/Sub** | Google's serverless publish-subscribe messaging. |
| **RAG** | Retrieval-augmented generation: fetching relevant data to put in an LLM prompt. |
| **Replication factor** | How many copies of each Kafka partition (or data block) are kept. |
| **Retail media network** | A retailer's advertising business, selling onsite, offsite and in-store ads to brands. |
| **ROAS** | Return on ad spend: attributed revenue ÷ spend. |
| **Rollup** | Pre-aggregating rows at ingestion (Druid), trading detail for speed and size. |
| **Row key** | The single index in Bigtable and similar stores; design it around the queries. |
| **RTB** | Real-time bidding: an auction per impression, decided in milliseconds. |
| **Schema Registry** | A service storing message schemas and enforcing compatibility rules. |
| **Serving layer** | Stores built for fast answers to apps and dashboards (Druid, Bigtable, Elasticsearch, Redis). |
| **Shuffle** | Moving data between machines so rows with the same key meet; the slow part of wide operations. |
| **Skew** | Uneven data across keys or partitions, leaving one task doing most of the work. |
| **Slot** | A unit of BigQuery compute. |
| **Training-serving skew** | Features computed differently in training and in production. |
| **Transformation (Spark)** | An operation that defines a new dataset without running it (`filter`, `join`). |
| **Watermark** | How long a stream processor waits for late events before finalising a window. |
| **Window** | A time bucket for stream aggregation: tumbling, sliding or session. |
