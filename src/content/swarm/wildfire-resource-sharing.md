---
title: "Wildfire resource sharing across provinces"
summary: "Provinces as agents that lend and borrow crews, aircraft and equipment during a fire season, so help moves to where fires are about to grow."
field: crisis
track: applications
status: Planned
order: 5
date: 2026-11-05
for: ["Provincial wildfire agencies", "Federal emergency management"]
parts:
  - { name: "Idea and scope", done: true }
  - { name: "Open Canadian fire data (CWFIS) checked and loaded", done: false }
  - { name: "Season simulation with each province's own fires and resources", done: false }
  - { name: "Swarm compared with today's request-and-share rule", done: false }
  - { name: "Live demo page", done: false }
roadmap:
  - "Confirm what the Canadian Wildland Fire Information System publishes and its licence."
  - "Score area burned and help that arrived too late, against a simple request-and-share rule."
links:
  - { label: "Wildfire drones demo", href: "/swarm/wildfire-drones/" }
  - { label: "Engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
---
## The idea

During a bad season, provinces already share crews and aircraft. The question is when to lend and when to keep, before you know where the next fire will start. Each province becomes an agent that sees its own fires, weather and resources, and the group learns when lending pays off for the country as a whole.

## What the drone work taught me

In the [wildfire drones](/swarm/wildfire-drones/) study, no learned swarm has beaten the simple "go to the nearest fire" rule yet, and a hand-made spreading rule did better than both. So this work starts from the rule, and a learned change stays only if it wins on seasons it never trained on.
