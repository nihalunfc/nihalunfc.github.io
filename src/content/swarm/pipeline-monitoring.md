---
title: "Oil and gas pipeline monitoring"
summary: "Sensors and inspection crews along a pipeline network as a swarm: each segment watches its own readings, flags trouble early and asks its neighbours to confirm before raising an alarm."
field: energy
track: applications
status: Planned
order: 4
date: 2026-11-05
for: ["Pipeline operators", "Energy regulators", "Provincial and federal governments"]
parts:
  - { name: "Idea and scope", done: true }
  - { name: "Find open pipeline incident and sensor data", done: false }
  - { name: "Simulation of a pipeline network with planted faults", done: false }
  - { name: "Swarm of segment agents compared with fixed alarm thresholds", done: false }
  - { name: "Live demo page", done: false }
roadmap:
  - "Check which public incident and sensor data exist in Canada before building anything."
  - "Score against fixed alarm thresholds: faults caught, false alarms and time to detect."
links:
  - { label: "Engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
---
## The idea

Long pipelines and compressor stations produce a steady stream of pressure, flow and temperature readings. Fixed alarm thresholds either miss slow leaks or raise too many false alarms. A swarm lets each pipeline segment judge its own readings, compare notes with the segments beside it, and only raise an alarm when the evidence agrees.

## Status

Planned. The first step is finding open Canadian data I'm allowed to use. Nothing here is built or measured yet.
