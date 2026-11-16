---
title: "Six frameworks built on the swarm law"
summary: "The rules measured in real swarms, reused as controllers for grid batteries, wildfire crews, epidemic response, air traffic, drones and logistics. Four run on real data, two in simulation, and two still lose to simple baselines."
track: applications
status: In progress
order: 5
date: 2026-11-16
updated: 2026-11-16
for: ["Grid operators", "Wildfire agencies", "Public health agencies", "Air traffic management", "Drone fleet operators", "Logistics planners", "Canadian federal and provincial governments"]
stats:
  - { value: "−86%", label: "close aircraft pairs in simulation" }
  - { value: "3 to 5×", label: "better 21-day COVID forecasts than exponential" }
  - { value: "5.6 vs 69", label: "mean logistics queue vs round robin (simulated)" }
parts:
  - { name: "Shared core: set-point regulator and swarm rules", done: true }
  - { name: "Grid, wildfire, epidemics, air traffic on real data", done: true }
  - { name: "Drones and logistics in simulation", done: true }
  - { name: "Wildfire forecast with weather inputs", done: false }
  - { name: "Grid demo using the trained battery swarm", done: false }
  - { name: "Canadian data: IESO, AESO, CWFIS", done: false }
roadmap:
  - "Wildfire: add weather and more days of data, since the growth law alone loses to persistence early in a fire."
  - "Grid: drive the demo with the trained battery swarm, which already cuts the peak by 704 MW on average."
  - "Rule first: a swarm controller stays on only if it beats the rule on held-out data."
links:
  - { label: "Framework code on GitHub", href: "https://github.com/nihalunfc/swarm-intelligence/tree/main/universal/applications" }
  - { label: "Demo outputs", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/universal/applications.md" }
  - { label: "One law for 25 real swarms", href: "/swarm/universal-swarm-law/" }
  - { label: "Grid batteries demo", href: "/swarm/grid-batteries/" }
code: https://github.com/nihalunfc/swarm-intelligence/tree/main/universal/applications
---
## The idea

The [universal swarm study](/swarm/universal-swarm-law/) found the same three ingredients in real swarms: align with neighbours, switch from push to pull at about one neighbour distance, and pull the group back toward a set point. Each framework below reuses those rules as a controller, and each is compared with the simple rule or forecast people use today.

## Results

| Domain | What the framework does | Data | Result |
| :-- | :-- | :-- | :-- |
| Energy grid | batteries share discharge by state of charge (alignment) toward a 24-hour set point | real ERCOT load, Oct to Dec 2020 | demand swings cut 7.3% vs 6.8% for a threshold rule, but **no peak cut**: the fleet empties before the peak. The [trained battery swarm](/swarm/grid-batteries/) (10.8% swings cut, 704 MW average peak cut) is still the better controller |
| Wildfire | each fire forecasts its final size with a growth law and bids for crews | real US and Canadian fires, first 5 days | **the growth law loses to persistence this early** (log error 1.81 vs 0.82); it needs weather inputs |
| Epidemics | each region forecasts its wave and asks for help by forecast growth | real COVID-19 first wave, forecast 21 days ahead from the first 20% of the wave | Gompertz 0.16, Richards 0.26, exponential 0.86 (median absolute log error): saturating laws are 3 to 5 times better |
| Air traffic | aircraft add swarm separation and alignment only inside an alert radius | real OpenSky traffic for density; simulation for control | 0.51 close pairs (under 5 NM) per real snapshot; in simulation, close-pair steps fall from 28,635 to 3,920 (−86%) |
| Drones | flocking controller with gains measured in real swarms, plus goal seeking | simulation | all 30 drones arrive; 3 obstacle hits vs 18 without alignment |
| Logistics | ant-style task pickup with thresholds that adapt | simulation | mean queue 5.6 vs 69 for round robin, with 70% fewer moves |

## What this does and doesn't show

- The epidemic and air-traffic results are the strongest: real data, a clear baseline and a large gap.
- The drone and logistics results are simulations. They show the rules work as controllers, not that they beat a tuned real-world system.
- The wildfire and grid demos are honest losses or ties. They are listed so the next step is clear.
