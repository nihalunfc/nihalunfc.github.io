---
title: Squares in Squares
summary: Pack N unit squares into the smallest possible square for every N up to 1,000. A validation and submission pipeline that only submits packings proven valid on Kaggle's high-precision checker.
category: Kaggle
status: Ongoing
date: 2026-11-02
order: 7
featured: false
tags: [Python, NumPy, mpmath, Kaggle API]
stats:
  - { value: "Top 13%", label: "190 of 1,473 teams (public LB)" }
  - { value: "22.257", label: "score vs 28.938 baseline" }
links:
  - { label: "Competition", href: "https://www.kaggle.com/competitions/squares-in-squares" }
---

## The problem

For every N from 1 to 1,000, pack N unit squares into the smallest square you can. Any overlap at all invalidates that N.

## What I built

- A baseline generator and a local validator that scores files and checks overlaps with NumPy and mpmath.
- A script that pulls public solution files and keeps the best valid packing for each N.
- Automated submissions through the Kaggle API, and a GPU notebook that keeps optimising from the best known packings.

## The hardest part

My combined file scored 22.26 locally but 25.5 on Kaggle. Kaggle's high-precision checker rejects squares that only just touch, which an ordinary floating-point check accepts. The fix was to reuse packings only from files whose Kaggle score matched the local score exactly.

## Honest result

190th of 1,473 teams (top 12.9%), improving the 28.94 grid baseline to 22.257. That improvement came from combining public packings, mainly from Malyshev Danil's "living atlas" and Akmal Xodarev's notebooks. My own optimisation run improved 13 values of N by a tiny amount, because its GPU stage failed to start. The competition runs until July 2027.
