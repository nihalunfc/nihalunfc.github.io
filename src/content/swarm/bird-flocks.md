---
title: "Natural swarm study: fish schools and bird flocks"
summary: "Working out the rules real flocks follow, from measured bird tracks only, then writing them as fluid-like equations to ease bottlenecks in transport, logistics and air traffic."
field: science
track: nature
status: In progress
order: 20
date: 2026-11-05
updated: 2026-11-16
for: ["Transport and logistics planners", "Air traffic management", "Drone fleet operators", "Emergency planners"]
parts:
  - { name: "Study plan and research map", done: true }
  - { name: "Real flock data found, licences checked", done: true }
  - { name: "First real data measured: fish schools", done: true, added: 2026-11-16 }
  - { name: "Bird trajectories cleaned and measured", done: false }
  - { name: "Agent models fitted (alignment, neighbours, noise, reaction delay)", done: true }
  - { name: "Fluid-like equation fitted, with flock edges as boundaries", done: false }
  - { name: "Compared with other natural swarms (fish, insects, crowds)", done: true }
  - { name: "One general form tested on held-out flocks", done: false }
  - { name: "Checked against my engineered swarm", done: false }
  - { name: "Paper", done: false }
stats:
  - { value: "11.3 to 12.0 cm/s", label: "median fish speed, matches the paper's 11" }
  - { value: "1.6 to 3.8 BL", label: "push-to-pull switch; bigger schools space out more" }
  - { value: "~6%", label: "fluid equation fit on 39 fish: too few for a continuum" }
roadmap:
  - "Bird data next (jackdaws, pigeons), then chimney swifts (about 1,800 birds) for the fluid stage. The Dryad files need a manual browser download."
  - "Real data only: published trajectories, photos and videos. No synthetic flocks."
  - "A new parameter is kept only if it improves the fit on flocks it was not fitted on."
links:
  - { label: "Fish-school findings on GitHub", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/nature/FINDINGS.md" }
  - { label: "Fish-school result tables", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/nature/fish-tetra-2024.md" }
  - { label: "One law for 25 real swarms", href: "/swarm/universal-swarm-law/" }
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

## First real data: schooling fish

The first real recordings are black neon tetras from Puy et al. (2024, Zenodo, CC BY 4.0): two 60-minute recordings of 39 fish and one 28-minute recording of 8 fish.

1. **The pipeline reproduces the published speed.** Median speed is 11.3 to 12.0 cm/s in the 39-fish schools; the paper set its model speed to 11 cm/s from the same data.
2. **A clear spacing rule.** Every recording shows repulsion at short range and attraction further out. The switch is at 1.6 body lengths in the 8-fish school and 3.1 to 3.8 body lengths in the 39-fish schools. Bigger schools space out more.
3. **Nearest neighbours beat a fixed radius, but only slightly.** Following the 5 to 12 nearest fish predicts turns better than following every fish within a fixed distance, in all three recordings, by about 10%.
4. **Simple averages explain little of each turn.** Neighbours' mean heading and centre explain only 6 to 10% of how a fish turns over the next 0.3 s. Tetras swim in bursts and pay attention selectively, so a better rule needs those terms.
5. **A fluid equation doesn't fit 39 fish.** The best Toner-Tu fit explains only about 6% of the held-out field, because only 2 or 3 fish fall inside each smoothing window. The fluid stage needs large flocks, which is why the chimney swifts (about 1,800 birds) are the real test.

The same measurements were then repeated on 21 real swarms, from crowds and aircraft to epidemics and wildfires: see [One law for 25 real swarms](/swarm/universal-swarm-law/).

## Where it stands

Fish done; the cross-swarm comparison is done. Bird data (jackdaws, pigeons, then swifts) comes next, once the files are downloaded by hand.
