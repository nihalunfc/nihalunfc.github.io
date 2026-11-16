---
title: "Energy swarm for Canadian grids"
summary: "Batteries, solar and flexible demand as three kinds of agents on one grid, each with its own job, working as one team to balance Ontario and Alberta demand."
field: energy
track: applications
status: In progress
order: 3
date: 2026-11-05
updated: 2026-11-16
for: ["Provincial grid operators", "Utilities", "Federal and provincial energy departments"]
parts:
  - { name: "Plan written", done: true }
  - { name: "Agent roles in the engine (one shared model per role, one team reward)", done: false }
  - { name: "Batteries, solar curtailment and demand response in one simulation", done: true }
  - { name: "IESO and AESO data loaders", done: true, added: 2026-11-16 }
  - { name: "Open Ontario and Alberta grid data loaded and checked", done: false }
  - { name: "Compared against today's rules and a forecast-based planner on held-out months", done: false }
  - { name: "Live demo page", done: false }
stats:
  - { value: "−14.5%", label: "demand swings with all three roles (ERCOT + NREL stand-in data)" }
  - { value: "−453 MW", label: "peak cut with all three roles" }
roadmap:
  - "Download the Ontario (IESO) and Alberta (AESO) files and rerun on Canadian data."
  - "Confirm which public Ontario (IESO) and Alberta (AESO) data can be used, and under what licence."
  - "Keep a learned decision only if it beats the rule on months the swarm never trained on."
links:
  - { label: "Grid batteries demo (the first energy result)", href: "/swarm/grid-batteries/" }
  - { label: "Engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
  - { label: "Mixed-role swarm code", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/universal/applications/energy_mixed.py" }
  - { label: "Frameworks built on the swarm law", href: "/swarm/swarm-applications/" }
---
## The problem

A grid now has many small, flexible parts: home and commercial batteries, rooftop and farm solar, and buildings that can shift when they use power. Each one is too small to plan centrally, but together they can flatten the daily peak, which is the hour that sets the system's cost.

## What I'm building

The grid batteries demo uses one kind of agent. This step adds roles: batteries decide when to charge and discharge, solar sites decide when to curtail, and flexible loads decide when to shift. Each role shares one model across all its members, and the whole team is scored on one grid-wide goal.

## Why Canada

Ontario and Alberta run very different grids: Ontario is mostly nuclear and hydro, Alberta is an open market with fast-growing wind and solar. A method that works on both is more useful to provincial operators and to federal and provincial energy departments than one tuned to a single grid.

## First result (stand-in data)

The rule-based mixed-role swarm now runs: batteries, solar with curtailment and demand response each act on the net load they see, with no central coordinator. Until the Ontario and Alberta files are downloaded it runs on real ERCOT load and NREL sunshine data (Oct to Dec 2020, 2,208 hours). Demand swings fall from 1,743 MW to 1,490 MW (−14.5%) and the peak by 453 MW with all three roles, against −11.7% with solar and batteries alone. The loaders for IESO and AESO data are written. This is a rule-based swarm, not yet the trained one, and it has not yet been compared with a forecast-based planner.

## How it will be judged

Against the rules operators use today and against a planner that uses a 24-hour forecast, on months the swarm never saw in training, over several training seeds. Results go here as soon as they exist, including if the swarm loses.
