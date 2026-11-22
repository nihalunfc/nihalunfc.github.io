---
title: "BigQuery: the warehouse with no servers"
summary: "How BigQuery stores and runs queries, partitioning and clustering, how pricing works, nested data, and the habits that keep bills small."
module: 3
minutes: 30
outcomes:
  - "Explain columnar storage, slots and why BigQuery charges by bytes scanned"
  - "Create partitioned and clustered tables and prove they scan less"
  - "Query nested and repeated fields with UNNEST"
quiz:
  - q: "On on-demand pricing, which query costs less?"
    options: ["SELECT * FROM sales LIMIT 10", "SELECT store_id, revenue FROM sales WHERE sale_date = '2026-11-01' on a table partitioned by sale_date", "They cost the same", "SELECT * with ORDER BY"]
    answer: 1
    why: "Cost follows bytes scanned. LIMIT does not reduce bytes scanned; choosing fewer columns and filtering on the partition column does."
  - q: "Clustering a table by store_id helps most when queries…"
    options: ["select every column", "filter or join on store_id", "only count rows", "use LIMIT"]
    answer: 1
    why: "Clustering sorts data within partitions by the clustering columns, so BigQuery can skip blocks that don't match a filter on them."
  - q: "What is a BigQuery 'slot'?"
    options: ["A table partition", "A unit of compute capacity (CPU, memory, network) used to run queries", "A saved query", "A storage class"]
    answer: 1
    why: "Queries run on slots. On-demand you share a large pool; with capacity pricing you reserve slots."
  - q: "Your table has a column items that is ARRAY<STRUCT<sku INT64, qty INT64>>. How do you get one row per item?"
    options: ["SPLIT(items)", "CROSS JOIN UNNEST(items) AS item", "GROUP BY items", "PIVOT items"]
    answer: 1
    why: "UNNEST turns an array into rows. Nested and repeated fields avoid joins and are common for orders and event data."
---

## What makes BigQuery different

**BigQuery** is a fully managed, serverless warehouse. There's no cluster to size: you write SQL, and Google's engine (descended from its internal Dremel system) spreads the query across thousands of machines for a few seconds. Under the hood:

- **Columnar storage** (Capacitor format) on Google's distributed file system: reading one column never touches the others.
- **Storage and compute are separate**, joined by a very fast network, so each scales independently.
- **Slots** are units of compute. A query is broken into stages and each stage runs on many slots in parallel.

<div class="callout analogy">

**Analogy: a giant library with instant helpers.** You hand the desk a question. Hundreds of helpers run to the shelves, each reads only the pages (columns) and sections (partitions) needed, and the answer comes back in seconds. You're charged for **how many pages were read**, not for how long the helpers stood around. So the trick is asking questions that send them to fewer pages.

</div>

## Pricing in plain words

- **Storage:** per GB per month; data not modified for 90 days drops to the cheaper long-term rate automatically.
- **Compute, on-demand:** per TiB **scanned** by each query, with the first TiB each month free. A query that reads 50 GB costs a small fraction of that rate; one that reads a 40 TB table every hour can run to thousands of dollars a month.
- **Compute, capacity (editions):** reserve slots (Standard, Enterprise, Enterprise Plus) and pay for slot-hours instead of bytes. Big companies use this for predictable bills.

Check current prices on Google's pricing page; the shape matters more than the number.

## Partitioning and clustering

```sql
CREATE TABLE retail.sales
PARTITION BY sale_date
CLUSTER BY store_id, sku
OPTIONS (require_partition_filter = TRUE)
AS SELECT * FROM retail.sales_raw;
```

- **Partitioning** splits the table by a date or timestamp column (or ingestion time, or an integer range). Filters on it skip whole partitions. `require_partition_filter` stops anyone accidentally scanning all history.
- **Clustering** sorts data inside each partition by up to four columns. Filters on them skip blocks. Order matters: put the most filtered column first.

Prove it: run the same query with and without the filter and compare **bytes processed** in the editor before running (a free dry run).

## SQL you'll use often

```sql
-- One row per item from a nested order table
SELECT o.order_id, item.sku, item.qty
FROM retail.orders AS o
CROSS JOIN UNNEST(o.items) AS item;

-- Approximate distinct count: much cheaper on billions of rows
SELECT campaign_id, APPROX_COUNT_DISTINCT(user_id) AS reach
FROM ads.impressions WHERE event_date BETWEEN '2026-10-01' AND '2026-10-31'
GROUP BY campaign_id;

-- Keep the latest version of each row
SELECT * FROM retail.customers_cdc
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) = 1;

-- Upsert yesterday's changes into a dimension
MERGE retail.dim_product t USING staging.product_changes s ON t.sku = s.sku
WHEN MATCHED THEN UPDATE SET t.price = s.price, t.updated_at = s.updated_at
WHEN NOT MATCHED THEN INSERT ROW;
```

## The rest of the toolbox

- **Loading:** batch loads from GCS (free), the Storage Write API for streaming, Datastream for database changes, BigQuery Data Transfer Service for Google Ads and other SaaS sources.
- **Materialised views** keep aggregates fresh automatically; **BI Engine** caches for fast dashboards.
- **BigQuery ML:** train models with SQL (`CREATE MODEL … OPTIONS(model_type='linear_reg')`) and call Gemini models from SQL.
- **Security:** dataset and table permissions, **row-level security** and **column-level policy tags** to hide personal data, authorised views for sharing.

<div class="callout warn">

**Cost habits.** Never `SELECT *` on big tables (use the table preview instead, which is free). Filter on the partition column. Set a **maximum bytes billed** on scheduled queries and per-user quotas. Look at `INFORMATION_SCHEMA.JOBS` weekly for the most expensive queries.

</div>

## Who uses BigQuery

Retailers and grocers for their central warehouse; marketing and retail media teams because Google Ads, Campaign Manager 360 and GA4 data export natively into it; media companies for event analytics. Its rivals are **Snowflake**, **Amazon Redshift**, **Databricks SQL** and **Microsoft Fabric**. The SQL skills transfer almost entirely.

<div class="callout exercise">

**Exercise (30 minutes, sandbox).** Using `bigquery-public-data.thelook_ecommerce` (a fictional online clothing store):

1. Total revenue by month and product category from `order_items` joined to `products`. Note bytes processed.
2. Create your own copy of `order_items` partitioned by `DATE(created_at)` and clustered by `product_id`. Run a one-month query on both tables and compare bytes processed.
3. Find each user's first order date with `QUALIFY`.

</div>
