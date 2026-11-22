---
title: "Feature stores, pipelines and MLOps"
summary: "Offline and online feature stores, ML pipelines, experiment tracking, model registries and serving, with Vertex AI, Feast, MLflow and Kubeflow."
module: 6
minutes: 25
outcomes:
  - "Explain offline and online feature stores and materialisation"
  - "Describe an ML pipeline from data to deployed model"
  - "Name the MLOps tools on Google Cloud and in open source"
quiz:
  - q: "In a feature store, the offline store is used for…"
    options: ["Millisecond lookups in production", "Building training sets with point-in-time joins over history", "Storing model weights", "Sending emails"]
    answer: 1
    why: "Offline stores (BigQuery, lake tables) hold history for training. Online stores (Bigtable, Redis) hold latest values for serving."
  - q: "A model registry is for…"
    options: ["Registering users", "Versioning trained models with their metrics, data and approval status, so you know what's deployed", "Storing raw data", "Scheduling DAGs"]
    answer: 1
    why: "The registry is the source of truth for which model version is in production and how it was built."
  - q: "Materialisation in a feature store means…"
    options: ["Deleting features", "Copying the latest feature values from the offline store to the online store on a schedule or stream", "Training a model", "Printing a report"]
    answer: 1
    why: "Materialisation keeps the online store in sync with the offline definitions."
---

## The feature store

A **feature store** is a catalogue plus two storage layers that make features reusable and consistent:

- **Feature definitions:** named, owned, documented (`shopper.buys_30d`, computed from `fct_sales`).
- **Offline store:** full history, used to build training sets with point-in-time joins. Usually BigQuery or lake tables.
- **Online store:** the latest value per entity for low-latency serving. Usually Bigtable, Redis or DynamoDB.
- **Materialisation:** jobs (batch or streaming) that compute features and copy them to the online store.

Options: **Vertex AI Feature Store** (built on BigQuery, with online serving), **Feast** (open source), **Databricks Feature Store**, **Tecton**, **SageMaker Feature Store**. Many teams simply use well-modelled BigQuery tables plus a Bigtable or Redis copy, which is a feature store in all but name.

<div class="callout analogy">

**Analogy: a pharmacy.** The **offline store** is the warehouse with every batch ever made, with dates, for audits and research. The **online store** is the counter: only what's current, ready to hand over in seconds. **Materialisation** is the delivery van that restocks the counter from the warehouse. The **registry** of feature definitions is the formulary: what each medicine is and who's responsible for it.

</div>

## ML pipelines

An ML pipeline is a DAG like any other, with ML steps:

1. Extract a training snapshot (point-in-time features + labels) from BigQuery.
2. Validate the data (schema, ranges, drift against last time).
3. Train (scikit-learn, XGBoost, PyTorch, BigQuery ML) and tune.
4. Evaluate against the current production model and fairness checks.
5. Register the model with metrics and lineage.
6. Deploy (batch scoring job or online endpoint) after approval.
7. Monitor, and trigger retraining.

Tools: **Vertex AI Pipelines** (runs Kubeflow Pipelines or TFX), **Kubeflow**, **Airflow** (common for batch retraining), **Metaflow**, **ZenML**, **Databricks Workflows**.

## Tracking, registry and serving

| Need | Google Cloud | Open source / other |
|---|---|---|
| Experiment tracking | Vertex AI Experiments | **MLflow**, Weights & Biases |
| Model registry | Vertex AI Model Registry | MLflow Model Registry |
| Batch prediction | Vertex AI batch prediction, BigQuery ML `ML.PREDICT` | Spark, Airflow jobs |
| Online serving | Vertex AI endpoints | KServe, BentoML, Ray Serve, Seldon |
| Monitoring | Vertex AI Model Monitoring | Evidently, WhyLabs, custom checks |
| Distributed training | Vertex AI training, TPUs and GPUs | Ray, PyTorch distributed, Spark MLlib |

## What "a platform supporting ML" looks like in practice

- **Clean, documented, time-stamped tables** in the warehouse that data scientists can trust.
- **Raw history kept** in the lake (Parquet or Iceberg), so features can be rebuilt with new definitions.
- **Reusable feature pipelines** (Spark, BigQuery SQL or dbt, Flink for streaming) with tests.
- **An online store** fed by those pipelines, with freshness monitoring.
- **Reproducibility:** each model linked to code version, data snapshot and features.
- **Cost controls** on GPU and training jobs, and access controls on personal data.

<div class="callout senior">

**The BI-to-ML bridge.** If you've built tested star schemas and reconciled numbers with finance, you already have the most valuable ML-platform skill: trustworthy, well-modelled data. Add point-in-time correctness, feature freshness and model lineage to your vocabulary and you can talk credibly with ML teams.

</div>

<div class="callout exercise">

**Exercise (30 minutes, optional code).** Install Feast (`pip install feast`), run `feast init` and follow its quick-start: define a feature view, run `materialize`, and fetch online features. Then write three sentences mapping each Feast piece to its Vertex AI equivalent.

</div>
