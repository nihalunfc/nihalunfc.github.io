---
title: "Job postings, interviews and honest stories"
summary: "Decode a big-data job posting, answer the common design and concept questions, describe partial experience truthfully, and finish the course."
module: 8
minutes: 25
outcomes:
  - "Turn a posting's requirements into a study and portfolio plan"
  - "Answer common concept and design questions with a clear structure"
  - "Describe hands-on learning truthfully without overstating it"
quiz:
  - q: "You've built Spark projects at home but never used Spark at work. What's the honest way to say it?"
    options: ["'I have years of production Spark experience'", "'I've built and tuned PySpark pipelines in personal projects, for example…, and I'm ready to apply that on production data'", "'I don't know Spark'", "Avoid the topic"]
    answer: 1
    why: "Be specific about what you did and where. Concrete details from your own projects are convincing; overstating gets found out in technical rounds."
  - q: "A good structure for a system design answer is…"
    options: ["Name as many tools as possible", "Clarify requirements and scale, sketch the flow, choose stores and engines with reasons, then cover failure, cost and monitoring", "Start coding immediately", "Ask the interviewer to design it"]
    answer: 1
    why: "Interviewers assess judgement: requirements first, then a design with trade-offs, then how it behaves when things go wrong."
  - q: "'Familiarity with Druid, Bigtable or Elasticsearch' in a posting usually means…"
    options: ["You must be a certified administrator of all three", "You understand what they're for and have used at least one, enough to work with the team that runs it", "You need none of it", "You must have built them"]
    answer: 1
    why: "'Familiarity' is a lighter requirement than 'experience'. Knowing the use cases and trade-offs, plus one hands-on project, covers it."
---

## Decode the posting

Take a typical requirement list:

> Experience with Apache Spark/PySpark and distributed processing frameworks. Experience with GCP technologies such as Dataproc, BigQuery, GCS and Airflow. Familiarity with analytical or non-relational databases such as Druid, Bigtable or Elasticsearch. Experience with streaming technologies such as Kafka. Experience building data platforms supporting AI/ML workloads. Experience with retail media, advertising technology or measurement systems.

| Requirement | What they really want | Your evidence after this course |
|---|---|---|
| Spark/PySpark | Can write, debug and tune batch jobs | Module 2 mini project with plan and UI screenshots |
| GCP: Dataproc, BigQuery, GCS, Airflow | Can build a scheduled cloud pipeline | Module 3 mini project, cost estimate |
| Druid, Bigtable, Elasticsearch | Knows when to use which, has touched one | Module 4 mini project, decision table |
| Kafka | Understands topics, partitions, consumer groups, guarantees | Module 5 mini project with late data and restarts |
| Platforms for AI/ML | Builds time-correct features and reliable data for models | Module 6 mini project |
| Retail media, adtech, measurement | Speaks the domain: attribution, incrementality, pacing | Lessons 25–28 and the capstone |

Read **"experience with"** as "has done it", **"familiarity"** as "understands it and has tried it", **"nice to have"** as optional. Apply when you match most of the core and can show learning on the rest.

## Questions you'll likely get, and how to answer

**Concepts (answer in three parts: what, why, example).**

- *What's a shuffle and why is it expensive?* Data moves across the network between stages for wide operations; it costs disk, network and memory; example: a group-by on store, fixed by pre-aggregating or broadcasting a small table.
- *How does Kafka guarantee ordering?* Within a partition only; key by what must stay in order; example: keying by order ID.
- *Partitioning vs clustering in BigQuery?* Partition prunes by date or range; clustering sorts within partitions for selective filters; example with bytes scanned before and after.
- *Batch vs streaming: when would you not stream?* When nobody acts faster than daily; cost and on-call burden.
- *What's the difference between attribution and incrementality?* Credit vs causation; holdout design; iROAS vs ROAS.
- *What is point-in-time correctness?* Features only from data known at prediction time; leakage example.

**Design (use the same structure every time).**

1. **Clarify:** users, latency, volume, accuracy needs, privacy.
2. **Sketch:** sources → ingest → store → process → serve → use.
3. **Choose:** each store and engine **with a reason** and an alternative you rejected.
4. **Break it:** late data, duplicates, a failed job, a schema change, a hot key; how you'd detect and recover.
5. **Cost and operations:** what drives the bill; monitoring; who's on call.

Practice prompts: "design live campaign dashboards for 5,000 advertisers", "design a nightly pipeline for 2 billion till lines", "design frequency capping", "how would you measure whether in-store screens increase sales?"

<div class="callout analogy">

**Analogy: a pilot's checklist.** Good pilots don't improvise the take-off; they run the same checklist every time, which frees their attention for the unusual. A fixed design-answer structure does the same for you in an interview.

</div>

## Telling the truth about experience

Interviewers forgive gaps; they don't forgive inflated claims that collapse in a technical round. Use **specific, scoped** language:

- "In a personal project I built a PySpark job over 2 million synthetic till lines, found skew from one online store in the Spark UI and fixed it with salting, which cut the stage from 6 minutes to 50 seconds locally."
- "I haven't run Kafka in production. I've built a local pipeline with three partitions, a consumer group, a dead-letter topic and a Structured Streaming job that survives restarts without double counting."
- "My production experience is in SQL warehouses and BI; the measurement maths in retail media is the same discipline I used for reconciling reports with finance."

Pair each gap with a **bridge** (transferable work you did do) and a **proof** (a repo or write-up they can open).

## Portfolio checklist

- One **pipeline repo** per mini project, each with a README: problem, diagram, how to run, tests, results, cost, what you'd do next.
- The **capstone** design document and slice, pinned on GitHub.
- A short **blog post or LinkedIn article** per project explaining one hard thing you learned (skew, watermarks, iROAS).
- All data **synthetic or public**, never an employer's.

## You've finished the course

You can now draw a modern data platform from memory; explain Spark, BigQuery, Dataproc, GCS, Airflow, Druid, Bigtable, Elasticsearch and Kafka in plain words; say who uses each and why; build small working versions of each; and explain how a retail media network proves its ads work. That's a solid foundation. The next step is depth: pick the two tools your target roles mention most and build one more serious project on each.

<div class="callout project">

**Final task (1 hour).** Take one real posting you'd like to apply for. Fill in the "decode" table above with **your** evidence, linking to your repos. Write three honest experience statements in the bridge-and-proof style. Then go back to the [Projects page](/learn/big-data-cloud/pages/projects/) and tick off what you've built.

</div>
