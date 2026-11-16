---
title: "Paper: When does a learned swarm beat the rule?"
summary: "My research paper draft on the swarm engine: one multi-agent learner run on grid batteries, wildfire drones, hotel housekeeping and energy, CityLearn and VMAS, each compared with the best simple rule, MAPPO and the best possible result over many seeds."
field: science
track: applications
status: In progress
order: 1
date: 2026-11-03
updated: 2026-11-16
for: ["Researchers", "Grid operators", "Wildfire agencies"]
stats:
  - { value: "10.8%", label: "grid demand swings cut vs 9.1% best rule, 6.8% MPC" }
  - { value: "0.96", label: "CityLearn score vs 1.03 rule (lower wins)" }
  - { value: "p = 0.81", label: "residual swarm ties the rule, never significantly worse" }
parts:
  - { name: "Experiments over many seeds with held-out tests", done: true }
  - { name: "Draft (12 pages)", done: true }
  - { name: "Natural swarm and universal-law sections", done: false, added: 2026-11-16 }
  - { name: "Submitted as a preprint", done: false }
roadmap:
  - "Submit as a preprint once an endorsement is in place."
  - "Add a section on the universal swarm law once the bird data and bootstrap error bars are in."
links:
  - { label: "Read the draft (PDF)", href: "/downloads/science/swarm/when-does-a-learned-swarm-beat-the-rule-draft.pdf" }
  - { label: "Code, configs and per-seed results (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
  - { label: "Swarm Intelligence research write-up", href: "/projects/swarm-research/" }
code: https://github.com/nihalunfc/swarm-intelligence
project: swarm-research
---
<div class="callout">

**Draft, not peer reviewed.** Author: Nihal. [Download the PDF](/downloads/science/swarm/when-does-a-learned-swarm-beat-the-rule-draft.pdf) (12 pages, November 2026). Code and data are MIT licensed.

</div>

## Abstract

Multi-agent reinforcement learning (MARL) is usually compared with other learned methods, which leaves open whether it beats the hand-written rules that operators already use. We run one parameter-shared, value-decomposed swarm engine, without per-domain algorithm changes, on four problems: grid-battery peak shaving on real ERCOT load, drone wildfire suppression, hotel housekeeping and hotel peak-hour energy, plus the CityLearn and VMAS benchmarks. Every method is trained with multiple seeds and compared on held-out test episodes with the strongest simple rule we could write, MAPPO, and, where tractable, a perfect-foresight bound, using paired hierarchical-bootstrap tests.

Learned swarms beat the rules only where the rules are structurally limited. On grid batteries the swarm reduces load spread by 10.8% [10.6, 11.0] against 9.1% for the best rule and 6.8% for a forecast-driven MPC, and on CityLearn it scores 0.96 against 1.03 for the reference rule controller. Where a simple rule is already near the bound, nothing learned beats it. A residual swarm, which starts as an exact copy of the rule and learns when to override it, ties the rule in housekeeping and wildfire (−0.3 points, p = 0.81) and is never significantly worse. A hand-written coordination rule outperforms every learned drone swarm, and learned drone swarms lose ground as the swarm grows beyond its training size, while the rule does not. We release the engine, configurations, per-seed episodes and the scripts that generate every table.

## Key numbers

| Problem | Swarm | Best rule | Other reference |
| :-- | :-- | :-- | :-- |
| Grid batteries, ERCOT 2020 (load spread cut, 10 seeds) | 10.8% [10.6, 11.0] | 9.1% | MPC 6.8% |
| Grid batteries, average peak cut | 704 MW | 0 MW | perfect-foresight bound 949 MW |
| Grid batteries with 30% of batteries failed | 10.0% | | |
| CityLearn 2022 (lower is better) | 0.96 | 1.03 | |
| Wildfire drones (forest saved) | residual swarm 89.8% | nearest-fire 90.1%, hand spread rule 91.2% | |
| Wildfire drones at 1,000 drones | learned 48% | rule 86% | |
| Hotel energy, 5 seeds (yearly saving, sample hotels) | $211k | $252k | |

## Why it matters

The question operators ask is not "which learning method wins" but "does it beat what we do now". The answer here is: only where the rule is structurally limited, as on a grid with a forecastable peak. Where a good rule exists, the safest design is a residual swarm that starts as the rule and only learns when to override it.
