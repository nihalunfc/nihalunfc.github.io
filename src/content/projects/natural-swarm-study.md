---
field: science
kind: ml
title: Natural swarm study
summary: Working out the rules real swarms follow from measured data only, from fish schools and bird flocks to crowds, epidemics and wildfires, then one general swarm law and fluid-like equations to ease bottlenecks in transport, logistics and air traffic.
category: Applied AI
status: Ongoing
date: 2026-11-05
updated: 2026-11-16
order: 2
featured: false
demo: /swarm/bird-flocks/
tags: [Collective motion, Fluid dynamics, Physics, Research]
sectors: [Transport and logistics, Air traffic management, Drone fleets, Emergency planning]
parts:
  - { name: "Study plan and research map", done: true }
  - { name: "Real data found, licences checked", done: true }
  - { name: "Agent models fitted to fish schools", done: true, added: 2026-11-16 }
  - { name: "Agent models fitted to bird tracks", done: false }
  - { name: "Fluid-like equation fitted", done: false }
  - { name: "Compared across natural swarms (25 datasets)", done: true }
  - { name: "Paper", done: false }
stats:
  - { value: "25", label: "real datasets measured the same way" }
  - { value: "0.96", label: "median push-to-pull switch, in neighbour distances" }
links:
  - { label: "Plan and progress", href: "/swarm/bird-flocks/" }
  - { label: "One law for 25 real swarms", href: "/swarm/universal-swarm-law/" }
  - { label: "The swarm universe (speculative)", href: "/swarm/swarm-universe/" }
  - { label: "Code on GitHub", href: "https://github.com/nihalunfc/swarm-intelligence/tree/main/universal" }
  - { label: "Swarm Intelligence", href: "/swarm/" }
roadmap:
  - "Bird tracks (jackdaws, pigeons), then chimney swifts (about 1,800 birds) for the fluid-like equation."
---
The full plan and progress are on [the study's page](/swarm/bird-flocks/), part of [Swarm Intelligence](/swarm/).

## The question

A starling flock has no leader, yet thousands of birds turn together without collisions. I want the local rules they follow, and the fluid-like equations those rules add up to, measured from real data rather than assumed.

## Why it matters

The same rules could move drones, trucks, planes and people through tight spaces without jams. The main use I'm aiming at is bottlenecks in logistics, transport and air traffic. Other uses: wildfire drones, and how panic, misinformation and disease spread through a group.

## Results so far

- **Fish schools** (real tetra recordings): the pipeline reproduces the published speed, every school switches from keeping apart to drawing together (1.6 to 3.8 body lengths), and 39 fish are too few for a fluid equation. [Details](/swarm/bird-flocks/).
- **25 real swarms**: all 8 moving swarms align, the push-to-pull switch sits at about one neighbour distance, and two thirds of collective series regulate themselves. [Details](/swarm/universal-swarm-law/).
