---
title: "Natural swarm study: bird flocks"
summary: "Working out the rules real flocks follow, from measured bird tracks only, then writing them as fluid-like equations to ease bottlenecks in transport, logistics and air traffic."
field: science
track: nature
status: In progress
order: 20
date: 2026-11-05
for: ["Transport and logistics planners", "Air traffic management", "Drone fleet operators", "Emergency planners"]
parts:
  - { name: "Study plan and research map", done: true }
  - { name: "Real flock data found, licences checked", done: false }
  - { name: "Bird trajectories cleaned and measured", done: false }
  - { name: "Agent models fitted (alignment, neighbours, noise, reaction delay)", done: false }
  - { name: "Fluid-like equation fitted, with flock edges as boundaries", done: false }
  - { name: "Compared with other natural swarms (fish, insects, crowds)", done: false }
  - { name: "One general form tested on held-out flocks", done: false }
  - { name: "Checked against my engineered swarm", done: false }
  - { name: "Paper", done: false }
roadmap:
  - "Real data only: published trajectories, photos and videos. No synthetic flocks."
  - "A new parameter is kept only if it improves the fit on flocks it was not fitted on."
links:
  - { label: "Swarm engine code (MIT)", href: "https://github.com/nihalunfc/swarm-intelligence" }
---
## The question

A starling flock has no leader and no map, yet thousands of birds turn together in a fraction of a second without collisions. Can we write down the local rules they follow, and the fluid-like equations those rules add up to, from real measurements? If so, the same rules could move drones, trucks, planes and people through tight spaces without jams.

## The approach

1. **Data.** Published 3D bird trajectories and footage from research groups, used under their licences.
2. **Agent rules.** Fit the known models (keep apart, match heading, stay close; a fixed number of neighbours; reaction delay) to the tracks.
3. **Fluid form.** Treat the flock as a moving fluid with density and velocity, and fit an active-fluid equation (the Toner-Tu family), with the flock's sharp edge as a boundary.
4. **New terms.** Anything the known terms can't explain gets a label, such as an edge "surface tension" or a heading "memory", and is kept only if it improves the fit on held-out flocks.
5. **Other swarms.** Repeat for fish schools, insect swarms and human crowds, and look for one general form.
6. **Cross-check.** Compare the result with the engineered swarm on this site.

## Where it could be used

- **Main use:** bottlenecks in logistics, transport, air traffic and company operations.
- Drone fleets that rely on rules from nature rather than only on trained AI.
- Wildfire response, and how panic, misinformation and disease spread through a group.

## Where it stands

The study plan and research map are written. Next is choosing the first real datasets.
