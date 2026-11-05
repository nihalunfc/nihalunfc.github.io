---
kind: pipelines
title: Self-healing pipelines
summary: A daily ETL pipeline looked after by a decentralised crew of nine AI agents with no boss. They find, fix, test and re-run most failures by themselves, and every step can be undone.
category: Applied AI
status: Ongoing
date: 2026-11-05
updated: 2026-11-05
order: 1
featured: true
demo: /projects/self-healing-pipelines/compare/
tags: [Multi-agent, ETL, Dagster, Data quality, Claude]
sectors: [Retail chains, Hotels and restaurants, Logistics and distribution, Any multi-site business]
parts:
  - { name: "Design and simulation", done: true }
  - { name: "Command centre demo", done: true }
  - { name: "Setup guide", done: true }
  - { name: "Reference pipeline in Dagster", done: false }
  - { name: "Fault injector with answer key", done: false }
  - { name: "Agents running on the reference pipeline", done: false }
  - { name: "Measured results replace simulated ones", done: false }
stats:
  - { value: "9.2 h → 1.1 h", label: "median time to fix, simulated" }
  - { value: "534 → 121", label: "people hours a year on breakages, simulated" }
  - { value: "~$2", label: "model cost a year" }
links:
  - { label: "Side-by-side comparison", href: "/projects/self-healing-pipelines/compare/" }
  - { label: "Command centre demo", href: "/projects/self-healing-pipelines/command-centre/" }
  - { label: "Setup guide", href: "/projects/self-healing-pipelines/setup-guide/" }
  - { label: "Blog: pipelines that fix themselves", href: "/blog/self-healing-pipelines/" }
  - { label: "Simulation code (simulate.py)", href: "/projects/self-healing-pipelines/simulate.py" }
  - { label: "License (MIT)", href: "/projects/self-healing-pipelines/LICENSE.txt" }
limitations:
  - "Every figure comes from a simulation with stated assumptions. No live database or pipeline is connected yet, and no company's data is used."
  - "When a person forgets a manual export, the crew can only draft the reminder faster; the wait for the sender stays."
  - "Merging code into production stays a one-click human decision by design."
  - "Automatic re-runs are safe only when loads are idempotent, so that has to be in place first."
  - "The more-eyes maths holds only while the agents check genuinely different things."
roadmap:
  - "A reference pipeline in Dagster with a fault injector that plants known failures and scores the crew against an answer key."
  - "The nine agents running on that pipeline, with measured time, people minutes and model cost replacing the simulated figures."
  - "A live command centre reading the shared board instead of a scripted night."
---

## The idea

Every chain with more than a few locations runs the same routine overnight: collect the day's exports, clean them, load a data warehouse and refresh the reports managers read in the morning. Small chances of failure multiply. With 15 daily sources and about a 5% chance of a problem per source, fewer than half of all nights run clean.

In most teams nothing happens until a person opens the monitor at 9. This project hands that first response to a crew of nine small AI agents. Each has one job: watch, collect evidence, remember past fixes, give a verdict, write a fix, test it, check the rules, keep the record, and write the morning note.

## Decentralised, like a small team in sync

There is no boss agent. The agents never call each other. They all read and write one shared board, an append-only incident log, and four rules keep them in step:

1. **Act on state, not orders.** An agent acts when an incident reaches the state it handles.
2. **Claim with a lease.** A claim expires after a few minutes, so a spare copy picks up a stalled task.
3. **One writer per field.** Only the Triager writes verdicts; only the Verifier writes test results.
4. **Append, never edit.** Every step is committed by the Ledger and can be reverted.

Two gains come straight from this design. A bad file must get past four independent checks, so about 5% slip through instead of 25% with a single rule. And with two copies of each role, losing one agent no longer stops the crew.

## Cheap by design

Six of the nine agents are plain code. The three that use a language model start with the cheapest one that can do the job: a small fast model sorts each incident, a stronger one writes fixes with two tries, and the strongest gets one try only if those fail. Then the crew stops and hands a person the full trail. The simulated model cost is about $2 a year.

## Try it

- The [side-by-side comparison](/projects/self-healing-pipelines/compare/) puts each step of a scheduled pipeline beside the same step with the crew, with the maths, charts and the assumptions.
- The [command centre](/projects/self-healing-pipelines/command-centre/) plays a simulated night. Pause, stop, approve, revert any step or rework from it.
- The [setup guide](/projects/self-healing-pipelines/setup-guide/) rebuilds a pipeline step by step, from shared mail folders to Dagster, the warehouse, the agents and the dashboards, and lists where to connect your own systems.

## Use it

The design, setup guide, command centre and simulation are open source under the [MIT License](/projects/self-healing-pipelines/LICENSE.txt). Anyone can use, change and run them, including commercially. Just keep the copyright notice: © 2026 Nihal Vellaramkallingal Sulaiman, nihalsulaiman.com.
