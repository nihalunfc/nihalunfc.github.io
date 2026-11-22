---
title: "PySpark DataFrames, hands on"
summary: "Install Spark on your laptop, then read, clean, join, aggregate and write data with PySpark and Spark SQL, comparing each step with pandas and SQL you already know."
module: 2
minutes: 30
outcomes:
  - "Run PySpark locally and create a SparkSession"
  - "Read CSV and Parquet, filter, add columns, join, group and write partitioned Parquet"
  - "Use Spark SQL and window functions on the same data"
quiz:
  - q: "Why is df.collect() on a 500 GB DataFrame dangerous?"
    options: ["It deletes the data", "It pulls every row to the driver, which runs out of memory", "It is very slow but safe", "It only works in Scala"]
    answer: 1
    why: "collect() brings all rows to one machine, the driver. Use show(), limit() or write the result instead."
  - q: "What does partitionBy('sale_date') do when writing Parquet?"
    options: ["Sorts the rows", "Creates one folder per date, so later queries for a date read only that folder", "Splits columns", "Compresses the file"]
    answer: 1
    why: "Folder-per-value partitioning lets Spark, BigQuery and others skip folders that don't match the filter (partition pruning)."
  - q: "Why prefer Parquet over CSV for big data?"
    options: ["Parquet is human-readable", "Parquet is columnar, compressed and stores types, so engines read only the needed columns", "CSV cannot hold numbers", "Parquet files are always smaller than 1 MB"]
    answer: 1
    why: "Columnar storage plus compression and a schema means far less to read and no guessing types."
---

## Set up in five minutes

PySpark runs on one laptop in **local mode**: the driver and executors are threads on your machine. Same code, smaller scale. You need Python 3.9+ and Java 17 (Spark 4 needs Java 17 or 21).

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install pyspark pandas
python -c "import pyspark; print(pyspark.__version__)"
```

No Java? Use a free **Google Colab** notebook and run `!pip install pyspark`, or the free Databricks edition. See [Free sandboxes](/learn/big-data-cloud/pages/setup/).

## Make some data

```python
from pyspark.sql import SparkSession, functions as F, Window
spark = SparkSession.builder.appName("retail").master("local[*]").getOrCreate()

import random, datetime as dt
rows = [(i, random.randint(1, 20), random.randint(1, 500),
         str(dt.date(2026, 10, 1) + dt.timedelta(days=random.randint(0, 30))),
         round(random.uniform(1, 40), 2), random.choice([1, 1, 1, 2, -1]))
        for i in range(200_000)]
sales = spark.createDataFrame(rows, "txn_id long, store_id int, sku int, sale_date string, price double, qty int")
stores = spark.createDataFrame([(s, f"Store {s}", random.choice(["ON", "QC", "BC"])) for s in range(1, 21)],
                               "store_id int, store_name string, province string")
sales.show(5); sales.printSchema()
```

`qty = -1` is a refund: a fault planted on purpose, as in real till data.

## The core moves, next to what you know

| Task | PySpark | SQL you know |
|---|---|---|
| Keep rows | `sales.filter(F.col("qty") > 0)` | `WHERE qty > 0` |
| Pick columns | `.select("store_id", "price")` | `SELECT store_id, price` |
| New column | `.withColumn("revenue", F.col("price") * F.col("qty"))` | `price * qty AS revenue` |
| Fix a type | `.withColumn("sale_date", F.to_date("sale_date"))` | `CAST(sale_date AS DATE)` |
| Join | `.join(stores, "store_id", "left")` | `LEFT JOIN stores USING (store_id)` |
| Group | `.groupBy("province").agg(F.sum("revenue").alias("rev"))` | `GROUP BY province` |
| Sort and peek | `.orderBy(F.desc("rev")).show(10)` | `ORDER BY rev DESC LIMIT 10` |

Put together:

```python
clean = (sales
  .withColumn("sale_date", F.to_date("sale_date"))
  .withColumn("is_refund", F.col("qty") < 0)
  .withColumn("revenue", F.col("price") * F.col("qty")))

by_prov = (clean.join(stores, "store_id", "left")
  .groupBy("province", "sale_date")
  .agg(F.sum("revenue").alias("net_revenue"),
       F.countDistinct("txn_id").alias("txns"),
       F.sum(F.when(F.col("is_refund"), 1).otherwise(0)).alias("refunds")))

by_prov.orderBy("province", "sale_date").show(10)
by_prov.explain()   # read the plan: look for 'Exchange' (= shuffle) and 'BroadcastHashJoin'
```

## Spark SQL: same engine, SQL syntax

Many teams write mostly SQL. Register a view and query it:

```python
clean.createOrReplaceTempView("sales")
spark.sql("""
  SELECT store_id, sale_date, SUM(revenue) AS rev,
         SUM(SUM(revenue)) OVER (PARTITION BY store_id ORDER BY sale_date) AS running_rev
  FROM sales GROUP BY store_id, sale_date
""").show(5)
```

The DataFrame version of the window:

```python
w = Window.partitionBy("store_id").orderBy("sale_date")
daily = clean.groupBy("store_id", "sale_date").agg(F.sum("revenue").alias("rev"))
daily.withColumn("running_rev", F.sum("rev").over(w)).show(5)
```

Both compile to the same plan. Use whichever your team reads more easily.

## Write it like a real pipeline

```python
(clean.write.mode("overwrite")
   .partitionBy("sale_date")
   .parquet("out/sales_clean"))
spark.read.parquet("out/sales_clean").filter("sale_date = '2026-10-15'").count()
```

Look at the `out/sales_clean` folder: one sub-folder per date. A query for one date reads one folder. In the cloud, the path becomes `gs://my-bucket/sales_clean/` and nothing else changes.

<div class="callout warn">

**Habits that save you in production.** Never `collect()` or `toPandas()` big data; use `show()`, `limit()` or write it out. Avoid Python UDFs (`@udf`) when a built-in `F.` function exists; built-ins run in the JVM and are many times faster. If you must, use a pandas UDF (`@pandas_udf`), which works on batches.

</div>

## Who writes PySpark day to day

Data engineers write it for heavy transforms; data scientists use it to build features over data too big for pandas; analytics engineers often meet it as **Spark SQL** inside Databricks notebooks or dbt on Spark.

<div class="callout exercise">

**Exercise (30 minutes).** Using the data above:

1. Count refunds per store and find the store with the highest refund rate (refunds ÷ transactions).
2. Find each store's best day by net revenue using a window and `F.row_number()`.
3. Write the result as Parquet partitioned by `province`, read it back and confirm the row count.

</div>

<details class="answer"><summary>One solution for step 2</summary>

```python
w = Window.partitionBy("store_id").orderBy(F.desc("rev"))
(daily.withColumn("rn", F.row_number().over(w))
      .filter("rn = 1").orderBy("store_id").show())
```

</details>
