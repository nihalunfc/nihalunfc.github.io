---
title: "Thinking in events and streams"
summary: "Why companies move from nightly files to events, what an event is, and when streaming is worth its extra cost."
module: 5
minutes: 20
outcomes:
  - "Define an event and an event stream"
  - "Explain latency, throughput and the cost of streaming"
  - "Decide whether a use case needs batch, micro-batch or real-time"
quiz:
  - q: "Which is an event?"
    options: ["The current stock level table", "'Order 991 was placed by shopper 42 at 10:02:07 for $38.10'", "A dashboard", "A SQL view"]
    answer: 1
    why: "An event is an immutable fact that something happened at a time. A table of current state is built from events."
  - q: "Which use case really needs streaming?"
    options: ["Monthly sales report", "Blocking a fraudulent card payment before it completes", "Quarterly board deck", "Yearly tax filing"]
    answer: 1
    why: "Only decisions whose value disappears within seconds or minutes justify the cost of streaming."
  - q: "Publish-subscribe means…"
    options: ["Producers send data to one named consumer", "Producers write to a topic, and any number of consumers can read it independently", "Only one app may read data", "Data is emailed"]
    answer: 1
    why: "Decoupling producers from consumers is the core benefit: new consumers can be added without changing the producer."
---

## From files to events

The ETL world you may know runs on **files and schedules**: last night's extract lands at 4 am, a job runs at 6, reports are ready at 8. That's **batch**. It's simple, cheap and still the right answer for most reporting.

**Streaming** treats data as a continuous flow of **events**: small, immutable facts with a timestamp.

```json
{"event":"add_to_cart","user":"u42","sku":88231,"qty":1,"price":4.99,"ts":"2026-11-04T10:02:07.311Z","app":"ios"}
```

A **stream** is an ordered, never-ending sequence of these. Current state ("what's in the cart?") can always be rebuilt by replaying events.

<div class="callout analogy">

**Analogy: a newspaper and a live radio feed.** Batch is the morning paper: everything that happened yesterday, edited, complete, a few hours late. Streaming is live radio: you hear it as it happens, but it's harder to produce, mistakes go out live, and someone must be on air all night.

</div>

## The words people use

- **Latency:** how long from an event happening to it being usable. Batch: hours. Micro-batch: seconds to minutes. Real-time: milliseconds to a second.
- **Throughput:** how many events per second the system handles.
- **Producer / consumer:** who writes and who reads.
- **Publish-subscribe (pub/sub):** producers write to a named **topic**; many consumers read it independently. The till system doesn't know or care that fraud, stock and marketing all read its events.
- **Event time vs processing time:** when it happened vs when you saw it. A phone offline in a tunnel sends events 20 minutes late. This difference causes most streaming bugs (Lesson 20).

## Where streaming pays off

| Industry | Use case | Why minutes matter |
|---|---|---|
| Payments and banking | Fraud scoring | Stop the payment before it clears |
| Retail and grocery | Live stock, click-and-collect, price changes | Don't sell what's not on the shelf |
| Retail media and adtech | Budget pacing, frequency caps, live campaign dashboards | Overspending a budget can't be undone |
| Logistics | Parcel and vehicle tracking, ETAs | Customers watch the map |
| Energy | Grid balancing from meters and sensors | Supply must match demand every second |
| Software | Monitoring and alerting | Outages cost money per minute |
| Data platforms | **Change data capture** (CDC) from databases | Keep the warehouse minutes, not a day, behind |

## When not to stream

- Nobody acts on the data faster than daily.
- The source only gives files once a day anyway.
- The team has no one to be on call for a 24/7 pipeline.

A good middle ground is **micro-batch**: run every 5 or 15 minutes. Many "real-time" dashboards are really this, and that's fine.

## The streaming toolbox

| Job | Tools |
|---|---|
| Event log / message bus | **Apache Kafka**, Confluent Cloud, Redpanda, Google **Pub/Sub**, Amazon Kinesis, Azure Event Hubs, Apache Pulsar |
| Stream processing | **Apache Flink**, **Spark Structured Streaming**, **Dataflow (Beam)**, Kafka Streams, ksqlDB |
| Change data capture | **Debezium**, Google Datastream, Fivetran |
| Real-time stores | Druid, Pinot, ClickHouse, Bigtable, BigQuery streaming |

<div class="callout exercise">

**Exercise (10 minutes).** For a supermarket, list five data flows (for example till sales, online orders, shelf sensors, price changes, loyalty sign-ups). For each, write the latency the business really needs and whether it should be batch, micro-batch or streaming. Justify the most expensive one in one sentence.

</div>
