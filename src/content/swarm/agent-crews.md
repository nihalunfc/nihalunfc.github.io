---
title: "Swarm agents and AI agent crews together"
summary: "The swarm's fast, small agents act; a crew of AI language-model agents watches the runs, flags where the swarm falls behind the rule, proposes fixes and explains them in plain words. A person approves every change."
track: crews
status: In progress
order: 10
date: 2026-11-05
for: ["Any organisation running many automated decisions"]
parts:
  - { name: "Plan written", done: true }
  - { name: "Tidy-up: results, website numbers and experiment runner", done: false }
  - { name: "Shared board: post, claim, add evidence, close, with a full log", done: false }
  - { name: "Agent roles in the swarm engine", done: false }
  - { name: "AI agents on the board: watch runs, flag gaps, propose development-only changes, explain", done: false }
  - { name: "Joined-up demo and paper section", done: false }
roadmap:
  - "Rule first: a learned or AI-suggested change stays only if it beats the rule on held-out tests."
  - "Cheap models do the triage and stronger models only the hard fixes, chosen by a plain Python router."
links:
  - { label: "Self-healing pipelines (an AI agent crew that fixes a data pipeline)", href: "/projects/self-healing-pipelines/" }
  - { label: "Engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
---
## Two kinds of agents

Swarm agents are small and fast. Each battery or drone decides many times a second from what it can see. They are good at acting but can't explain themselves or notice when the whole approach is wrong.

AI language-model agents are slow and expensive, but they can read results, compare them with a rule, spot a gap and write a clear proposal. Put together, the swarm acts and the crew supervises.

## How they work together

Everything goes through a shared board. An agent posts an issue, another claims it, adds evidence and closes it. Every step writes a line to a log, and the original files can always be recovered. AI agents may only propose changes to development settings. Nothing reaches the live system until a person merges it.

## Where it stands

The plan is written and the first tidy-up is under way. The [self-healing pipelines](/projects/self-healing-pipelines/) project already uses the same crew idea on a data pipeline.
