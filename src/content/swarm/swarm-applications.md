---
title: "Frameworks built on the swarm law"
summary: "The rules measured in real swarms, reused as controllers for grid batteries, mixed energy fleets, wildfire crews, epidemic response, air traffic, drones and logistics. Five run on real data, two in simulation, and the wildfire forecast still loses to a simple baseline."
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
  - { name: "Wildfire forecast tested at 5 to 16 days", done: true, added: 2026-11-16 }
  - { name: "Grid demo compared with the trained battery swarm", done: true }
  - { name: "Mixed-role energy swarm with IESO and AESO loaders", done: true, added: 2026-11-16 }
  - { name: "Wildfire forecast with weather and fuel inputs", done: false, added: 2026-11-16 }
  - { name: "Canadian data: IESO, AESO, CWFIS", done: false }
roadmap:
  - "Wildfire: add weather and fuel inputs, since the growth law alone still loses to persistence."
  - "Energy: rerun the mixed-role swarm on Ontario (IESO) and Alberta (AESO) data."
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
| Energy grid | batteries share discharge by state of charge (alignment) toward a 24-hour set point | real ERCOT load, Oct to Dec 2020 | the rule-based framework cuts demand swings by 7.3% but not the peak. On the same data the [trained battery swarm](/swarm/grid-batteries/) (10 seeds) cuts swings by 10.8% and the peak by 704 MW, ahead of the proportional rule (9.1%), a 24-hour forecast planner (6.8%) and a threshold rule (5.0%); the perfect-foresight bound is 949 MW. **Use the trained swarm** |
| Mixed-role energy | batteries, solar with curtailment and demand response each act on the net load they see, with no coordinator | real ERCOT + NREL data until the Ontario and Alberta files are downloaded | demand swings −14.5% and peak −453 MW with all three roles, against −11.7% with solar and batteries. [More](/swarm/canada-energy-swarm/) |
| Wildfire | each fire forecasts its final size with a growth law and bids for crews | real US and Canadian fires (203 fires, the same fires at every horizon) | median log error after 5, 8, 12 and 16 days: growth law 1.81, 1.52, 0.94, 0.68; persistence 0.83, 0.84, 0.56, 0.40. **More days help the growth law a lot, but simple persistence still wins**; it needs weather and fuel inputs |
| Epidemics | each region forecasts its wave and asks for help by forecast growth | real COVID-19 first wave, forecast 21 days ahead from the first 20% of the wave | Gompertz 0.16, Richards 0.26, exponential 0.86 (median absolute log error): saturating laws are 3 to 5 times better |
| Air traffic | aircraft add swarm separation and alignment only inside an alert radius | real OpenSky traffic for density; simulation for control | 0.51 close pairs (under 5 NM) per real snapshot; in simulation, close-pair steps fall from 28,635 to 3,920 (−86%) |
| Drones | flocking controller with gains measured in real swarms, plus goal seeking | simulation | all 30 drones arrive; 3 obstacle hits vs 18 without alignment |
| Logistics | ant-style task pickup with thresholds that adapt | simulation | mean queue 5.6 vs 69 for round robin, with 70% fewer moves |

## What this does and doesn't show

- The epidemic and air-traffic results are the strongest: real data, a clear baseline and a large gap.
- The drone and logistics results are simulations. They show the rules work as controllers, not that they beat a tuned real-world system.
- The wildfire forecast is an honest loss, and the rule-based grid framework is weaker than the trained battery swarm. They are listed so the next step is clear.
