---
title: "Data for LLMs and generative AI"
summary: "Embeddings, vector search, retrieval-augmented generation (RAG) pipelines and the governance that AI workloads need from a data platform."
module: 6
minutes: 25
outcomes:
  - "Explain embeddings and vector similarity in plain words"
  - "Describe a RAG pipeline end to end as a data pipeline"
  - "List the data quality, privacy and cost issues specific to AI workloads"
quiz:
  - q: "An embedding is…"
    options: ["A compressed image", "A list of numbers representing meaning, so similar texts get nearby vectors", "An encrypted password", "A SQL index"]
    answer: 1
    why: "Embedding models map text, images or products into vectors; distance between vectors approximates similarity of meaning."
  - q: "In RAG, the model's answer is grounded by…"
    options: ["Retraining the model every query", "Retrieving relevant documents or rows and giving them to the model in the prompt", "Using a bigger GPU", "Deleting old data"]
    answer: 1
    why: "Retrieval-augmented generation fetches relevant context at question time so answers reflect your data without retraining."
  - q: "Why chunk documents before embedding them?"
    options: ["Chunks look nicer", "Embeddings and prompts have size limits, and smaller focused chunks retrieve more precisely", "It's required by law", "To compress images"]
    answer: 1
    why: "Chunk size trades precision against context. Typical chunks are a few hundred tokens with some overlap."
---

## Why this is now a data platform topic

Large language models (LLMs) are general. To answer questions about **your** products, policies or data, they need your data at the right moment, cleaned, permissioned and fresh. Delivering that is a pipeline problem: ingest, clean, chunk, embed, index, serve, monitor. Job postings that say "data platforms supporting AI/ML" increasingly mean this too.

## Embeddings and vector search

An **embedding model** turns text (or an image, or a product) into a vector, say 768 numbers. Similar meanings land close together: "waterproof jacket" sits near "rain coat", far from "jacket potato".

**Vector search** finds the nearest vectors to a query vector. At scale it uses approximate nearest-neighbour indexes (HNSW, ScaNN, IVF) to search millions of vectors in milliseconds.

<div class="callout analogy">

**Analogy: a library arranged by meaning.** A normal library shelves by title; to find books "like this one" you'd ask a librarian. Imagine instead every book placed in a huge room so that books on similar subjects stand close together. To find books like yours, walk to where it would stand and look around. Embeddings give every item a position in that room; vector search is the walk.

</div>

Where vectors live: **pgvector** (Postgres, AlloyDB, Cloud SQL), **BigQuery vector search** (`VECTOR_SEARCH`), **Vertex AI Vector Search**, **Elasticsearch/OpenSearch**, **Pinecone**, Weaviate, Milvus, Qdrant. Start with the database you already have.

## A RAG pipeline is a data pipeline

<div class="flow">

**Sources** (product catalogue, policies, reviews, support tickets) → **ingest and clean** (dedupe, strip boilerplate, remove personal data) → **chunk** (a few hundred tokens with overlap) → **embed** (batch job) → **index** (vector store with metadata: source, date, permissions) → at question time: **embed question → retrieve top chunks (with filters) → prompt the LLM with them → answer with citations** → **log and evaluate**.

</div>

The data engineering parts are the hard parts:

- **Freshness:** when a price or policy changes, re-embed only what changed (CDC from Lesson 19 again).
- **Permissions:** filter retrieved chunks by what the user is allowed to see.
- **Quality:** duplicated, outdated or contradictory documents produce confident wrong answers.
- **Hybrid search:** combine keyword (BM25) and vector search for product codes and names.
- **Evaluation:** a test set of questions with expected sources; track retrieval accuracy and answer quality over time.
- **Cost:** embedding millions of chunks and calling large models has a real bill; cache and batch.

## In BigQuery, end to end

BigQuery can create embeddings with a remote Vertex AI model, store them in a table, build a vector index and search, all in SQL, which makes RAG prototypes possible without a separate vector database. Spark and Dataflow handle the same steps for very large corpora.

## Structured data and AI

LLM applications also query **tables**: "text to SQL" assistants over a warehouse work far better with a **semantic layer** (well-named, documented metrics and dimensions, like LookML or dbt's metrics), clear column descriptions and row-level security. Good BI modelling is AI readiness.

<div class="callout senior">

**Governance is not optional.** AI workloads raise new questions: may this personal data be sent to a model? Is the model hosted in-region? Are prompts and answers logged and retained correctly? Data platforms add classification tags, masking, approved model endpoints and audit logs. Mention these in interviews and you sound like someone who'd be trusted with production data.

</div>

<div class="callout exercise">

**Exercise (30 minutes, free).** In Python, `pip install sentence-transformers`, embed 50 short product descriptions you write yourself with the small `all-MiniLM-L6-v2` model, and for three queries print the top 3 matches by cosine similarity. Then try one query with a product code (like "SKU 88231") and notice why keyword search is still needed.

</div>
