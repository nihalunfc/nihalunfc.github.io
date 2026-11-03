---
title: "I used a month of GitHub Actions minutes in one evening"
description: "2,391 of 2,000 free minutes, gone in about five hours. The billing detail I missed, and the guardrails I now put on every workflow."
date: 2026-11-03
tags: [GitHub Actions, CI/CD, MLOps, Cost]
---

On 3 November I opened my inbox to this:

> **You have used 100% of the Actions minutes included for your account.**
> 2,391 min used / 2,000 min included.

The billing cycle had started on 1 November. Two days in, a month of free CI/CD time was gone.

My first guess was a runaway cron job. It wasn't. The real cause taught me more about how GitHub Actions billing works than any doc I had read.

## What happened

I've been building a research project on multi-agent reinforcement learning: swarm agents that fight wildfires, manage building energy and plan hotel housekeeping. To get results across several random seeds, I had an AI coding assistant set up a GitHub Actions workflow that trains the models on GitHub's hosted runners.

The design looked sensible:

- A **matrix strategy** started one job per experiment and seed, about 50 jobs per batch.
- Each job installed CPU PyTorch, trained a model and uploaded the results.
- A final job collected every seed into results tables and committed them back.

It worked very well. Too well.

## Why it happened

When I added up every job in the run history, the totals matched the email almost exactly:

| Source | Minutes | Share |
|---|---|---|
| Experiments workflow (ML training matrix) | ~2,240 | ~94% |
| CI workflow (lint and tests on 2 Python versions) | ~150 | ~6% |
| **Total** | **~2,390** | |

Four things combined.

**1. GitHub bills per job, not per run.** A run that took two hours on the clock had over 30 jobs in parallel. Each job's minutes count separately, rounded up to the next minute, so that one "two-hour run" was more than 1,000 billable minutes. A 50-job matrix is a 50x multiplier.

**2. Minutes only count on private repositories.** Standard hosted runners are free and unlimited for public repos. My research repo was private.

**3. The trigger was too easy to fire.** The workflow ran on every push that changed the experiment queue file, on any branch. Every new experiment started a whole new matrix. Cancelled jobs still bill for the time they ran.

**4. The timeouts were set for the worst case.** Each training job had `timeout-minutes: 350`, close to GitHub's six-hour maximum. One stuck job could cost almost six hours.

## The guardrails I use now

**Set a $0 budget first.** In GitHub's billing settings, create a $0 budget for Actions and choose to stop usage at the limit. You get blocked instead of billed.

**Make portfolio repos public.** If a repo holds no secrets, client data or unpublished work, make it public. Actions minutes are free and recruiters can see the work. This site builds on a public repo for exactly that reason.

**Don't train models on CI runners.** CI is for linting, tests and builds. Train on Kaggle, Colab or your own machine, and commit only the results. Their free GPUs beat a two-core CPU runner anyway.

**Make expensive workflows manual.** Use `workflow_dispatch` so a person has to click "Run workflow".

**Cap the matrix, and use realistic timeouts.** Add `max-parallel`, start with one seed before five, and give CI jobs 10 to 15 minutes.

**Cancel stale runs.**

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

**Watch the OS multiplier.** Linux runners count 1x, Windows 2x and macOS 10x.

**Review AI-written workflows for cost.** AI coding assistants write working pipelines. They don't feel the bill. Before merging a workflow, ask: how many jobs does it start, how long can each run, and what triggers it?

## The takeaway

In data engineering we watch query costs and warehouse credits closely. CI/CD minutes are the same kind of resource, and a matrix is a multiplier that's easy to forget. Budget your pipelines, watch them, and put a person in the loop before anything expensive runs.
