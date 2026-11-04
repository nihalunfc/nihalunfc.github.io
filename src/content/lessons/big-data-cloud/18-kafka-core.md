---
title: "Kafka: the log at the centre"
summary: "Topics, partitions, offsets, brokers, replication, producers, consumers and consumer groups, with a local Kafka you can run in one command."
module: 5
minutes: 30
outcomes:
  - "Explain topics, partitions, offsets, brokers and replication"
  - "Explain how keys keep related events in order and how consumer groups share work"
  - "Run Kafka locally and produce and consume messages in Python"
quiz:
  - q: "Kafka guarantees order…"
    options: ["Across the whole topic", "Within a single partition", "Never", "Only for JSON"]
    answer: 1
    why: "Each partition is an ordered log. Events with the same key go to the same partition, so they stay in order relative to each other."
  - q: "A topic has 6 partitions and a consumer group has 8 consumers. What happens?"
    options: ["All 8 share the work equally", "6 consumers get one partition each; 2 sit idle", "Kafka crashes", "Each consumer reads every message"]
    answer: 1
    why: "Within a group, each partition goes to exactly one consumer. Partitions cap the parallelism of a consumer group."
  - q: "Reading a message from Kafka…"
    options: ["Deletes it", "Does not delete it; messages stay until retention expires, and each group tracks its own offset", "Moves it to another topic", "Locks it forever"]
    answer: 1
    why: "Kafka is a log, not a queue that empties. Many groups can read the same data, and you can replay by resetting offsets."
  - q: "What does replication factor 3 mean?"
    options: ["Each message is sent three times to consumers", "Each partition is copied to three brokers, so the data survives broker failures", "Three topics are created", "Messages expire after 3 days"]
    answer: 1
    why: "One broker leads each partition and followers keep copies. If the leader fails, an in-sync follower takes over."
---

## Kafka in one paragraph

**Apache Kafka** is a distributed, durable, append-only **log** that many systems write to and read from. It was built at LinkedIn around 2010 to move activity data between systems and open-sourced in 2011. Today it sits at the centre of most event-driven platforms: tills, apps, ad servers and databases publish to it; stream processors, warehouses, search indexes and ML systems read from it. **Confluent** (founded by Kafka's creators) sells a managed version; Google, AWS (MSK) and Azure (Event Hubs, Kafka-compatible) offer their own.

<div class="callout analogy">

**Analogy: a set of conveyor belts with numbered trays.** Each **topic** is a set of belts. Each belt is a **partition**. Every tray placed on a belt gets the next number (the **offset**) and stays on the belt for, say, seven days (**retention**), whoever has looked at it. Different teams (**consumer groups**) stand along the belts with their own clipboard noting the last tray number they processed. Fraud, stock and marketing can each read the same trays at their own speed, and anyone can rewind to tray 1,000 and read again.

</div>

## The parts

- **Broker:** a Kafka server. A **cluster** has several. Modern Kafka manages its own metadata with **KRaft**; the old ZooKeeper dependency was removed in Kafka 4.0.
- **Topic:** a named stream, such as `pos.sales.v1` or `ads.impressions.v1`.
- **Partition:** a topic is split into partitions spread across brokers. Each partition is an ordered log. More partitions mean more parallelism.
- **Offset:** the position of a message in a partition.
- **Message (record):** a **key**, a **value** (bytes: JSON, Avro or Protobuf), a timestamp and headers.
- **Replication:** each partition has a **leader** and **followers** on other brokers. `replication.factor=3` is standard in production.
- **Retention:** keep messages for a time (7 days), a size, or forever with **log compaction**, which keeps only the latest value per key (useful for "current price per SKU").

## Keys decide partitions, and partitions decide order

The producer hashes the key to choose a partition. All events with key `store-214` land in the same partition, **in order**. Choose keys around what must stay in order: an order ID, a user ID, a store. A key that's too popular (one huge advertiser) creates a hot partition, the same skew problem as in Spark.

## Producers and consumers

- **Producers** send records, batch them for efficiency and wait for acknowledgements. `acks=all` waits until all in-sync replicas have the record: the safe default.
- **Consumers** pull records and **commit offsets** to remember progress.
- A **consumer group** shares a topic's partitions among its members: each partition is read by exactly one member. Add consumers up to the partition count to scale; if one dies, its partitions are **rebalanced** to the others.

## Run it locally

```bash
docker run -d --name kafka -p 9092:9092 apache/kafka:latest
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --create --topic pos.sales.v1 --partitions 3 --replication-factor 1
pip install confluent-kafka
```

```python
# producer.py
import json, random, time
from confluent_kafka import Producer
p = Producer({"bootstrap.servers": "localhost:9092", "acks": "all"})
for i in range(1000):
    store = f"store-{random.randint(1, 20)}"
    evt = {"txn": i, "store": store, "sku": random.randint(1, 500), "price": round(random.uniform(1, 40), 2), "ts": time.time()}
    p.produce("pos.sales.v1", key=store, value=json.dumps(evt))
    p.poll(0)
p.flush()
```

```python
# consumer.py: run two copies and watch the partitions split between them
import json
from confluent_kafka import Consumer
c = Consumer({"bootstrap.servers": "localhost:9092", "group.id": "store-totals",
              "auto.offset.reset": "earliest", "enable.auto.commit": False})
c.subscribe(["pos.sales.v1"])
totals = {}
while True:
    m = c.poll(1.0)
    if m is None or m.error(): continue
    e = json.loads(m.value()); totals[e["store"]] = totals.get(e["store"], 0) + e["price"]
    print(m.partition(), m.offset(), e["store"], round(totals[e["store"]], 2))
    c.commit(m)
```

## Kafka versus Pub/Sub

| | **Kafka** | **Google Pub/Sub** |
|---|---|---|
| Model | Partitioned log; consumers track offsets | Topics and subscriptions; per-message acknowledgement |
| Ordering | Per partition | Optional, per ordering key |
| Replay | Reset offsets within retention | Seek to a time or snapshot within retention |
| Operations | Clusters to size (unless managed) | Fully serverless |
| Ecosystem | Kafka Connect, Streams, Schema Registry, huge community | Native to GCP: Dataflow, BigQuery subscriptions |

Many GCP companies use both: Kafka as the company-wide event backbone, Pub/Sub for GCP-native pipelines.

<div class="callout exercise">

**Exercise (30 minutes).** Run the producer and two consumers. (1) Stop one consumer and watch the other take over its partitions. (2) Start a consumer with a **new** `group.id` and see it read everything from the beginning. (3) Explain in two sentences why `store` is a reasonable key, and what would go wrong if you keyed by `txn`.

</div>
