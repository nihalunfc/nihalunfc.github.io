---
title: "Making Spark fast and cheap"
summary: "File formats, partition sizes, joins, skew, caching and the Spark UI: the handful of ideas behind almost every Spark performance fix."
module: 2
minutes: 25
outcomes:
  - "Choose file formats and table formats for a lake"
  - "Fix the four common slowdowns: small files, skew, bad joins, too many or too few partitions"
  - "Read the Spark UI to find the slow stage"
quiz:
  - q: "One task in a stage takes 40 minutes while the other 199 take 30 seconds. What is the likely cause?"
    options: ["Too much memory", "Data skew: one key has far more rows than the rest", "The driver is idle", "Parquet compression"]
    answer: 1
    why: "One giant partition means one task does most of the work. That's skew, often from a null key or one huge customer or store."
  - q: "You join a 2 TB sales table to a 5 MB product table. What should happen?"
    options: ["A sort-merge join that shuffles both", "A broadcast join: copy the small table to every executor", "Convert both to CSV", "Collect both to the driver"]
    answer: 1
    why: "Broadcasting the small table avoids shuffling the 2 TB table. Spark does it automatically below a size threshold, or you can hint it with F.broadcast()."
  - q: "What does a table format like Iceberg or Delta add on top of Parquet files?"
    options: ["Images", "Transactions, updates and deletes, schema evolution and time travel", "Faster networking", "A dashboard"]
    answer: 1
    why: "Parquet is a file format. Iceberg, Delta and Hudi add a metadata layer that makes a folder of files behave like a database table."
---

## Start with storage: formats decide speed

| Format | Shape | Use it for |
|---|---|---|
| CSV / JSON | Rows, text, no types | Landing raw data only |
| **Parquet** | Columnar, compressed, typed | The default for analytics files |
| ORC | Columnar, like Parquet | Older Hadoop and Hive estates |
| Avro | Rows, compact, schema attached | Kafka messages and row-by-row writes |
| **Iceberg / Delta / Hudi** | Table formats over Parquet | Lakehouse tables with updates, deletes, time travel |

<div class="callout analogy">

**Analogy: a filing cabinet by question.** A CSV is a pile of whole forms: to total one box on every form you read every form. Parquet tears each form into strips by field and files all the "amount" strips together, so totalling amounts means opening one drawer. Iceberg and Delta add an index card at the front listing exactly which strips belong to the current version, so you can add, fix or roll back forms safely.

</div>

## The four common slowdowns

### 1. Too many small files (or too few big ones)

Spark makes about one task per file chunk. 200,000 files of 50 KB means 200,000 tiny tasks and slow metadata listing. Aim for files of **128 MB to 1 GB**. Fix with `coalesce(n)` before writing, compaction jobs, or the table format's optimise command (Delta's `OPTIMIZE`, Iceberg's `rewrite_data_files`).

### 2. Wrong number of shuffle partitions

After a shuffle Spark uses `spark.sql.shuffle.partitions` (default 200). For 2 TB that's 10 GB per task (memory errors); for 2 GB it's 200 tiny tasks. **Adaptive Query Execution (AQE)**, on by default since Spark 3.2, merges small partitions and splits skewed ones at run time. Keep it on; know it exists.

### 3. Joins

- **Broadcast hash join:** small table (default threshold 10 MB, often raised) copied to every executor. No shuffle of the big side. Hint it: `big.join(F.broadcast(small), "sku")`.
- **Sort-merge join:** both sides shuffled by key and sorted. The default for two big tables.
- Filter and select **before** joining, so less data moves.

### 4. Skew

One key holds most rows: the null customer ID, the online "store 999", one giant advertiser. One task runs forever. Fixes: let AQE's skew-join handling split it; filter or handle nulls separately; **salt** the key (add a random 0–9 suffix to spread the hot key, then aggregate twice).

## Caching: only when reused

`df.cache()` keeps a DataFrame in memory after the first action. Worth it only if you use it **several times** in the same job. Caching everything wastes memory and can make jobs slower. Call `unpersist()` when done.

## Read the Spark UI

Every Spark application has a web UI (port 4040 locally; on Dataproc it's linked from the cluster page as the Spark History Server). Look at:

- **Jobs → Stages:** which stage takes longest?
- **Stage detail → task durations:** a max far above the median means **skew**.
- **Shuffle read/write sizes:** big numbers mean a wide operation worth questioning.
- **Spill (memory/disk):** data didn't fit in memory; partitions are too big.
- **SQL tab:** the physical plan, showing which join was chosen.

<div class="callout senior">

**Cost is the real metric.** In the cloud, a job that runs in 40 minutes on 20 machines costs about the same as 20 minutes on 40 machines. Making a job *cheaper* means less work: read fewer columns and partitions, shuffle less, avoid skew, and shut the cluster down after. A good answer to "how did you optimise it?" names the bottleneck you measured and the cost before and after.

</div>

<div class="callout exercise">

**Exercise (20 minutes).** In your Lesson 5 notebook: (1) run the province join with and without `F.broadcast(stores)` and compare `explain()` output; (2) create skew by setting 80% of rows to `store_id = 1`, run the daily group-by, and open `http://localhost:4040` to find the long task; (3) write the data with `repartition(500)` and with `coalesce(4)` and compare the number of files.

</div>
