---
field: science
kind: ml
title: Name That LLM
summary: Identify which of 18 frontier language models wrote a passage, on prompts never seen in training. LoRA-tuned Qwen and Llama ensembles with leak-free, prompt-grouped validation.
category: Kaggle
status: Ongoing
date: 2026-11-02
order: 4
featured: true
sectors: [Research]
tags: [PyTorch, Transformers, LoRA, scikit-learn, NLP]
stats:
  - { value: "Top 10%", label: "436 of 4,346 teams (public LB)" }
  - { value: "0.663", label: "balanced accuracy" }
  - { value: "38,935", label: "extra labelled passages" }
links:
  - { label: "Competition", href: "https://www.kaggle.com/competitions/name-that-llm" }
  - { label: "My Kaggle profile", href: "https://www.kaggle.com/vsnihal" }
---

## The problem

Given one short passage, say which of 18 frontier LLMs wrote it. The test passages answer prompts that never appear in training, so a model can't just memorise topics.

## What I built

- **More data.** A pool of 38,935 extra labelled passages from 15 public datasets, filtered for length, formatting, duplicates and overlap with the training set.
- **Models.** A four-view n-gram LinearSVC (character, word, word-shape and function-word n-grams), and two-stage LoRA fine-tunes of Qwen2.5-7B and GLM-4-9B: first on the pool, then on the official training set.
- **Ensembles.** I adapted and ran public multi-model ensembles (LoRA-tuned Qwen3, Llama-3.1 and Qwen2.5, the n-gram SVM, source-conditioned likelihood and Sinkhorn balancing) on Kaggle T4 GPUs.

## The hardest part: validation that told the truth

My offline scores didn't predict the leaderboard. The public ensemble's models had been trained on all the training data, so testing them offline was leaky. I rebuilt validation so each fold is scored only by the adapter that never saw it. The accuracy pattern confirmed it: about 0.6 on each held-out fold against about 0.9 elsewhere, giving clean out-of-fold scores of 0.615 for Qwen3-8B and 0.596 for Llama-3.1-8B.

## Result

0.663 balanced accuracy on the public leaderboard, up from 0.541 for my first ensemble, which places 436th of 4,346 teams (top 10%). My own tuning of the SVM member (C from 0.5 to 0.25, logit scale 1.2) moved one ensemble from 0.639 to 0.641. The competition ends on 14 January 2027, and the private leaderboard decides the final rank.
