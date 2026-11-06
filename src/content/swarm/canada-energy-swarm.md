---
title: "Energy swarm for Canadian grids"
summary: "Batteries, solar and flexible demand as three kinds of agents on one grid, each with its own job, working as one team to balance Ontario and Alberta demand."
field: energy
track: applications
status: Planned
order: 3
date: 2026-11-05
for: ["Provincial grid operators", "Utilities", "Federal and provincial energy departments"]
parts:
  - { name: "Plan written", done: true }
  - { name: "Agent roles in the engine (one shared model per role, one team reward)", done: false }
  - { name: "Batteries, solar curtailment and demand response in one simulation", done: false }
  - { name: "Open Ontario and Alberta grid data loaded and checked", done: false }
  - { name: "Compared against today's rules and a forecast-based planner on held-out months", done: false }
  - { name: "Live demo page", done: false }
roadmap:
  - "Confirm which public Ontario (IESO) and Alberta (AESO) data can be used, and under what licence."
  - "Keep a learned decision only if it beats the rule on months the swarm never trained on."
links:
  - { label: "Grid batteries demo (the first energy result)", href: "/swarm/grid-batteries/" }
  - { label: "Engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
---
## The problem

A grid now has many small, flexible parts: home and commercial batteries, rooftop and farm solar, and buildings that can shift when they use power. Each one is too small to plan centrally, but together they can flatten the daily peak, which is the hour that sets the system's cost.

## What I'm building

The grid batteries demo uses one kind of agent. This step adds roles: batteries decide when to charge and discharge, solar sites decide when to curtail, and flexible loads decide when to shift. Each role shares one model across all its members, and the whole team is scored on one grid-wide goal.

## Why Canada

Ontario and Alberta run very different grids: Ontario is mostly nuclear and hydro, Alberta is an open market with fast-growing wind and solar. A method that works on both is more useful to provincial operators and to federal and provincial energy departments than one tuned to a single grid.

## How it will be judged

Against the rules operators use today and against a planner that uses a 24-hour forecast, on months the swarm never saw in training, over several training seeds. Results go here as soon as they exist, including if the swarm loses.
