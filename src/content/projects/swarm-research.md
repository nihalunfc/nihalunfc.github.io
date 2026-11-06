---
kind: ml
title: Swarm Intelligence research
summary: My flagship. One open-source multi-agent engine, tested against strong rules and the best possible result over many training seeds, and written up as a research paper. Applied to energy grids, oil and gas, and wildfires.
category: Applied AI
status: Ongoing
date: 2026-10-01
updated: 2026-11-06
order: -1
featured: false
demo: /swarm/
repo: https://github.com/nihalunfc/swarm-intelligence
tags: [Multi-agent RL, PyTorch, Energy, Wildfire, Research]
sectors: [Grid operators, Wildfire agencies, Canadian federal and provincial governments, Research]
parts:
  - { name: "Engine and first three applications", done: true }
  - { name: "Multi-seed results with held-out tests and strong baselines", done: true }
  - { name: "Engine released as open source (MIT)", done: true }
  - { name: "Paper draft", done: true }
  - { name: "Paper submitted", done: false }
  - { name: "Energy swarm on Canadian grid data", done: false, added: 2026-11-05 }
  - { name: "Swarm agents with AI agent crews", done: false, added: 2026-11-05 }
stats:
  - { value: "704 MW", label: "average grid peak cut, 10 seeds (best possible 949 MW)" }
  - { value: "10.8%", label: "demand swings cut, vs 9.1% best rule" }
  - { value: "0.96", label: "CityLearn score vs 1.03 tuned rule (lower wins)" }
links:
  - { label: "Swarm Intelligence: all tracks and demos", href: "/swarm/" }
  - { label: "All demos compared", href: "/swarm/explorer/" }
  - { label: "Engine code on GitHub (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
limitations:
  - "All results so far are from simulations: real grid data from 2020 for the grid batteries, and simulated forests and hotels."
  - "In wildfires, no learned swarm has beaten the nearest-fire rule yet (87.2% against 90.1% of forest saved), and learned drones lose ground as the swarm grows."
roadmap:
  - "Energy swarm with batteries, solar and demand response on Ontario and Alberta data."
  - "AI agent crews that watch the swarm's runs and propose fixes a person approves."
---
Swarm Intelligence has its own section at [/swarm/](/swarm/), which I update as the work moves. This page is the short version for the projects list.

## The problem

Many decisions happen at once: when each battery charges, where each drone flies, which province lends a fire crew. A central planner gets slow and fragile as the number of agents grows.

## What I built

One engine in which every agent decides from what it can see and the group still acts as one team. Each application is compared with the rule people use today and, where possible, the best possible result.

## Results

On a stressed grid, the swarm cut the peak by 704 MW on average over 10 training seeds (the perfect-foresight best is 949 MW) and reduced demand swings by 10.8%, against 9.1% for the best rule. On the public CityLearn 2022 benchmark it scored 0.96 against 1.03 for CityLearn's tuned rule. In wildfires the simple rule still wins, and the site says so.

## What's next

Three tracks, all on [/swarm/](/swarm/): applications in energy, oil and gas and wildfires; swarm agents working with AI agent crews; and a study of how real bird flocks move.
