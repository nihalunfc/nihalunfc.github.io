---
title: "Energy swarm for Canadian grids"
summary: "Batteries, solar and flexible demand as three kinds of agents on one grid, each with its own job, working as one team to balance Ontario and Alberta demand."
field: energy
track: applications
status: In progress
order: 3
date: 2026-11-05
updated: 2026-11-17
for: ["Provincial grid operators", "Utilities", "Federal and provincial energy departments"]
parts:
  - { name: "Plan written", done: true }
  - { name: "Agent roles in the engine (one shared model per role, one team reward)", done: false }
  - { name: "Batteries, solar curtailment and demand response in one simulation", done: true }
  - { name: "IESO and AESO data loaders", done: true, added: 2026-11-16 }
  - { name: "Ontario grid data (IESO 2024-2025) loaded and checked", done: true, added: 2026-11-17 }
  - { name: "Alberta grid data (AESO) loaded", done: false }
  - { name: "Compared against rules on a held-out year at real Ontario fleet size", done: true, added: 2026-11-17 }
  - { name: "Live demo page", done: false }
stats:
  - { value: "−1,233 MW", label: "Ontario 2025 annual peak with the 2028 contracted fleet (rule: −727 MW)" }
  - { value: "−687 MW", label: "Ontario 2025 annual peak with today's fleet (rule: −390 MW)" }
  - { value: "Not yet", label: "beats the best rule overall (loses the 50 highest hours)" }
roadmap:
  - "Close the gap on the 50 highest hours: hold energy for heatwave afternoons (the time-of-day rule still wins there)."
  - "Download the Alberta (AESO) files and rerun on Alberta."
  - "Confirm which public Ontario (IESO) and Alberta (AESO) data can be used, and under what licence."
  - "Keep a learned decision only if it beats the rule on months the swarm never trained on."
links:
  - { label: "Grid batteries demo (the first energy result)", href: "/swarm/grid-batteries/" }
  - { label: "Engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
  - { label: "Mixed-role swarm code", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/universal/applications/energy_mixed.py" }
  - { label: "Ontario fleet results and sources", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/universal/ontario-fleet.md" }
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

## Ontario at real size (update, 17 November 2026)

The swarm now runs on real Ontario grid data: IESO hourly demand and solar output for 2024 and 2025. The fleets are sized from public figures: today's fleet is about 1,217 MW of 4-hour batteries plus 516 MW of demand response (316 MW of Capacity Auction demand response and 200 MW of Peak Perks at the 2025 peak), and the 2028 fleet adds the 1,784 MW of contracted long-term batteries and 915 MW of new solar. Every method was tuned on 2024 and then run once on 2025, a year it never saw, which includes the 24,862 MW peak of 24 June.

| 2025, held out | Annual peak cut | Average daily peak cut | 50 highest hours | Battery cycles a year |
|---|---|---|---|---|
| Today's fleet, time-of-day rule | 390 MW | 713 MW | 881 MW | 397 |
| Today's fleet, swarm | 687 MW | 692 MW | 496 MW | 111 |
| 2028 fleet, time-of-day rule | 727 MW | 555 MW | 2,203 MW | 397 |
| 2028 fleet, swarm | 1,233 MW | 1,066 MW | 1,040 MW | 155 |

The swarm cuts the year's single highest hour by far more than the rule, and with the 2028 fleet it also wins on the average day, while wearing the batteries about a third as much. It loses the 50 highest hours: the simple rule empties every battery between 4 and 9 pm every day, which is exactly when Ontario's summer peaks fall. So by my own rule-first test the swarm does not count yet. With 30% of batteries failing without warning it keeps most of its peak cut (1,085 of 1,233 MW). A perfect-foresight bound shows how much room is left: about 1,370 MW today and 2,360 MW in 2028. Alberta data could not be reached yet.

## How it will be judged

Against the rules operators use today and against a planner that uses a 24-hour forecast, on months the swarm never saw in training, over several training seeds. Results go here as soon as they exist, including if the swarm loses.
