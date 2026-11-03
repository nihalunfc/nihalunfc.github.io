---
title: Swarm Intelligence
summary: One multi-agent engine in which batteries, drones and hotel equipment each make their own decision and together act as one team. Tested against the rules people use today.
category: Applied AI
status: Ongoing
date: 2026-10-15
order: 2
featured: true
sectors: [Research, Energy, Hotels]
tags: [Multi-agent RL, PyTorch, Optimisation, D3]
stats:
  - { value: "949 MW", label: "grid peak cut by a battery swarm" }
  - { value: "87%", label: "forest saved by a drone swarm" }
  - { value: "$279k", label: "yearly hotel energy saving" }
links:
  - { label: "Swarm overview", href: "/swarm/" }
  - { label: "Hotel operations", href: "/swarm/hotel/" }
  - { label: "Grid batteries", href: "/swarm/energy/" }
  - { label: "Wildfire drones", href: "/swarm/wildfire/" }
---

## The idea

Many real problems are thousands of small decisions made at the same time: when each battery charges, where each drone flies, which room each housekeeper cleans next. A central planner gets slow and fragile as the number of agents grows. A swarm lets each agent decide for itself using what it can see, and still behave like one well-run team.

## What I built

One engine, applied to three problems, each compared against the rule that operators use today:

- **Grid batteries.** Home and commercial batteries on a stressed grid decide when to charge and discharge. The swarm cut the simulated peak by 949 MW.
- **Wildfire drones.** Drones choose where to drop retardant, routing to the fire's choke points. The swarm saved 87% of the forest in the test scenarios.
- **Hotel operations.** HVAC, lighting and staff respond to occupancy and energy prices, worth an estimated $279k a year for the sample hotel group.

The work started with multi-agent reinforcement learning on ERCOT grid time series (load balancing, demand response and extreme-weather flags) and grew from there.

## Where it stands

The demo pages show the results, the method and the comparison for each domain. I'm still running experiments across random seeds, and each page says what has and hasn't been tested yet.
