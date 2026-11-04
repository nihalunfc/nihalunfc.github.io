---
title: "What machine learning needs from a data platform"
summary: "Training versus serving, features and labels, point-in-time correctness, leakage, and the training-serving skew that quietly breaks models."
module: 6
minutes: 25
outcomes:
  - "Describe the ML lifecycle and what data each stage needs"
  - "Explain features, labels, point-in-time joins and leakage"
  - "Explain training-serving skew and how platforms prevent it"
quiz:
  - q: "You train a churn model with a feature 'number of support calls in the 30 days after the prediction date'. What's wrong?"
    options: ["Nothing", "Leakage: the feature uses information from the future that isn't available when predicting", "It's too few days", "Support calls are not numeric"]
    answer: 1
    why: "Features must only use data available at prediction time. Future data makes the model look great in testing and fail in production."
  - q: "Training-serving skew means…"
    options: ["The model is too big", "Features are computed differently in training than when the live model uses them, so predictions drift", "Training takes longer than serving", "Data is skewed by key"]
    answer: 1
    why: "If the batch pipeline and the live app compute 'purchases in 30 days' differently, the model sees different inputs live. Shared feature definitions prevent this."
  - q: "Online inference for an app usually needs features served in…"
    options: ["Hours", "Milliseconds", "Days", "Weeks"]
    answer: 1
    why: "A recommendation or fraud check sits in the user's request path, so feature lookups must take milliseconds, typically from a key-value or wide-column store."
---

## The lifecycle

1. **Frame the problem:** predict what, for whom, and what action follows? ("Score each loyalty member's chance of buying a brand next week, to target an offer.")
2. **Collect and label data:** history of who bought what, with the **label** (did they buy?).
3. **Build features:** numbers the model learns from (purchases in 30 days, days since last visit, share of spend on the category).
4. **Train and evaluate:** fit models, compare on held-out data, check fairness and stability.
5. **Deploy:** **batch** predictions (score everyone nightly, write to a table) or **online** predictions (score in the request, in milliseconds).
6. **Monitor and retrain:** watch data drift, prediction drift and business results; retrain on a schedule or when performance falls.

A data platform's job is to make steps 2, 3, 5 and 6 reliable and repeatable. That's where most real ML effort goes.

<div class="callout analogy">

**Analogy: a restaurant kitchen's prep station.** The model is the chef; features are the prepped ingredients. If the morning prep cook chops onions one way (training) and the evening cook another way (serving), the dish tastes different even with the same chef and recipe. A **feature platform** is a single prep standard used by every shift.

</div>

## Features, labels and time

A **training set** is rows of (entity, time, features, label):

| member | as_of_date | buys_30d | days_since_visit | brand_share | **label: bought_next_7d** |
|---|---|---|---|---|---|
| m42 | 2026-10-01 | 6 | 2 | 0.12 | 1 |
| m42 | 2026-10-08 | 4 | 5 | 0.10 | 0 |

The critical rule is **point-in-time correctness**: each feature value must be what was known **at `as_of_date`**, never later. A normal SQL join to "current" feature tables leaks the future. Platforms provide **point-in-time joins** ("as of" joins) to do this right.

**Leakage** is the most common reason a model that tested brilliantly fails live. Typical sources: future data, IDs that encode the outcome, and data that's only filled in after the event.

## Two ways to serve predictions

| | **Batch inference** | **Online inference** |
|---|---|---|
| When | Nightly or hourly | Per request |
| Latency | Minutes to hours | 10–100 ms |
| Features from | The warehouse or lake | An **online store** (Bigtable, Redis, DynamoDB) |
| Examples | Weekly offer targeting, demand forecasts | Fraud check, "recommended for you", ad ranking |
| Platform needs | BigQuery, Spark, Airflow | Streaming features, low-latency stores, model endpoints |

## Training-serving skew

If training features are built in BigQuery SQL and the live app recomputes them in Java, they will differ in small ways (time zones, refunds included or not, rounding). The model then sees inputs it never learned on. Fixes:

- **Define features once** and compute them for both paths from the same code (a feature store, or shared transformation code).
- **Log the features actually served** and compare them with training distributions.
- **Monitor drift** in inputs and outputs.

## What this means for data engineers

ML teams need from the platform: **history** (raw events kept, not just aggregates), **time-correct snapshots**, **fresh features** for online models, **lineage** (which data trained which model), **quality checks** before training, and **cheap compute** for experiments. These are the "platforms supporting AI/ML workloads" that job postings mention.

<div class="callout exercise">

**Exercise (15 minutes).** For a model that predicts whether a shopper will redeem a coupon within 7 days of receiving it, list five features, the label, the entity and the "as of" time. Then mark one feature that could leak and say how to fix it.

</div>

<details class="answer"><summary>Example</summary>

Entity: shopper; as of: coupon send time; label: redeemed within 7 days. Features: visits in last 30 days, spend in category in last 90 days, coupons redeemed / received in last 180 days, days since last purchase, preferred store distance. Leak risk: "total spend this month" computed at month end includes days after the send time; compute it only up to the send timestamp.

</details>
