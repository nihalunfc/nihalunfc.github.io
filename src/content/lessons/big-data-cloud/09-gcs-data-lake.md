---
title: "Cloud Storage and the data lake"
summary: "Buckets and objects, storage classes, lifecycle rules, folder layouts that make queries cheap, and the bronze, silver and gold layers."
module: 3
minutes: 20
outcomes:
  - "Create buckets and move files with the gcloud CLI"
  - "Pick a storage class and write lifecycle rules"
  - "Design a lake layout with layers and partitioned paths"
quiz:
  - q: "Raw files you must keep for 7 years but almost never read should be in…"
    options: ["Standard", "Nearline", "Archive", "Memory"]
    answer: 2
    why: "Archive is the cheapest to store, with higher retrieval cost and a 365-day minimum, which suits rarely read compliance copies."
  - q: "Why use paths like sales/dt=2026-11-04/part-000.parquet?"
    options: ["They look tidy", "Engines treat dt=… folders as partitions and skip ones that don't match the filter", "GCS requires it", "It encrypts the data"]
    answer: 1
    why: "Hive-style partition folders let Spark, BigQuery external tables and Trino prune whole folders."
  - q: "GCS 'folders' are really…"
    options: ["Directories on a disk", "Part of each object's name; the slash is just a character", "Separate buckets", "Database tables"]
    answer: 1
    why: "Object storage is flat. 'sales/2026/file.csv' is one object name. Tools show slashes as folders for convenience."
---

## Objects, not files

**Cloud Storage (GCS)** stores **objects** (any bytes plus metadata) in **buckets** (globally unique names, one location). There are no real folders: `raw/sales/2026-11-04.csv` is one object name with slashes in it. It's strongly consistent (read your write immediately), extremely durable, and cheap per GB.

It's the same idea as Amazon **S3** and Azure **Blob Storage**. Spark reads `gs://`, `s3://` or `abfss://` paths the same way.

<div class="callout analogy">

**Analogy: a self-storage facility.** A **bucket** is your unit. **Objects** are boxes with labels (the name). You don't get shelves or rooms, only labels, so a good labelling scheme (`dt=2026-11-04`) is how you find things fast. **Storage classes** are units nearer or further from the entrance: the far ones are cheaper to rent but take more effort to fetch from.

</div>

## Storage classes and lifecycle

| Class | Minimum storage | Use for |
|---|---|---|
| **Standard** | none | Data read often: current lake data, staging |
| **Nearline** | 30 days | Read about once a month: last quarter's raw files |
| **Coldline** | 90 days | Read about once a quarter: older backups |
| **Archive** | 365 days | Kept for compliance, rarely read |

**Lifecycle rules** move or delete objects automatically, such as "move `raw/` objects to Nearline after 30 days, Archive after 365, delete after 7 years". **Autoclass** can do this for you based on access.

## Hands on with the CLI

```bash
gcloud storage buckets create gs://YOURNAME-retail-lake --location=northamerica-northeast2 --uniform-bucket-level-access
gcloud storage cp sales_2026-11-04.csv gs://YOURNAME-retail-lake/bronze/sales/dt=2026-11-04/
gcloud storage ls -r gs://YOURNAME-retail-lake/bronze/
gcloud storage rsync -r ./out/sales_clean gs://YOURNAME-retail-lake/silver/sales/
```

(The older `gsutil` tool does the same and appears in many guides.)

## A lake layout that stays tidy

The **medallion** pattern names three layers:

- **Bronze (raw):** exactly what arrived, never edited, with arrival time. `bronze/<source>/<entity>/dt=YYYY-MM-DD/`
- **Silver (clean):** typed, de-duplicated, conformed tables, usually Parquet or Iceberg. `silver/<entity>/dt=…/`
- **Gold (business):** aggregates and marts for BI and ML. Often lives in BigQuery instead.

Rules that save pain later:

1. **Partition by the column people filter on**, usually the event date, in `key=value` style.
2. **Separate buckets by environment** (`-dev`, `-prod`) and by sensitivity (a locked bucket for personal data).
3. **Never overwrite bronze.** It's your proof of what you received.
4. **Avoid millions of tiny objects.** Batch small events into files of 100 MB or more.

## Lake meets warehouse

BigQuery can query GCS files without loading them (**external tables**), and through **BigLake** it can read open **Iceberg** tables with fine-grained security. That's the lakehouse idea from Lesson 2: one copy of data, many engines.

<div class="callout senior">

**Cost traps.** Storage is cheap; **egress** (moving data out of a region or out of Google) and **operations** (millions of list and read calls) are not. Keep compute in the same region as buckets, and compact small files.

</div>

<div class="callout exercise">

**Exercise (15 minutes, paper).** Design the bucket and path layout for a grocery chain with: till sales (daily files per store), app events (JSON, every minute), loyalty members (a nightly full extract with personal data), and supplier invoices (PDFs). Say which storage class and lifecycle rule each gets.

</div>

<details class="answer"><summary>One good layout</summary>

`gs://grocer-lake-prod/bronze/pos/sales/dt=…/store=…/` (Standard → Nearline after 30 days); `gs://grocer-lake-prod/bronze/app/events/dt=…/hr=…/` (batched to ~200 MB files); `gs://grocer-pii-prod/bronze/loyalty/members/dt=…/` (separate bucket, restricted IAM, delete raw after the retention period the privacy team sets); `gs://grocer-docs-prod/invoices/yyyy=…/mm=…/` (Coldline after 90 days, Archive after a year). Silver as Iceberg tables under `gs://grocer-lake-prod/silver/`.

</details>
