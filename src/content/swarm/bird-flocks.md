---
title: "Natural swarm study: fish schools and bird flocks"
summary: "Working out the rules real flocks follow, from measured bird tracks only, then writing them as fluid-like equations to ease bottlenecks in transport, logistics and air traffic."
field: science
track: nature
status: In progress
order: 20
date: 2026-11-05
updated: 2026-11-17
for: ["Transport and logistics planners", "Air traffic management", "Drone fleet operators", "Emergency planners"]
parts:
  - { name: "Study plan and research map", done: true }
  - { name: "Real flock data found, licences checked", done: true }
  - { name: "First real data measured: fish schools", done: true, added: 2026-11-16 }
  - { name: "Bird trajectories cleaned and measured: jackdaws, pigeons, chimney swifts", done: true, added: 2026-11-17 }
  - { name: "Agent models fitted (alignment, neighbours, noise, reaction delay)", done: true }
  - { name: "Fluid-like equation fitted on a large flock (swifts, horizontal plane)", done: true, added: 2026-11-17 }
  - { name: "Fluid equation in 3D, with flock edges as boundaries", done: false }
  - { name: "Compared with other natural swarms (fish, insects, crowds)", done: true }
  - { name: "One general form tested on held-out flocks", done: false }
  - { name: "Checked against my engineered swarm", done: false }
  - { name: "Paper", done: false }
stats:
  - { value: "66%", label: "fluid equation fit on chimney swifts (hundreds per frame), held out" }
  - { value: "13%", label: "same fit on a 39-fish school: too few for a continuum" }
  - { value: "10 → 27°/s", label: "pigeon turning when the robotic falcon comes within 30 m" }
  - { value: "k = 7", label: "nearest neighbours pigeons follow, as reported for starlings" }
roadmap:
  - "Next: the swift fit in 3D, then the fitted terms inside the agent swarm on a traffic or logistics bottleneck."
  - "Starling tracks: a request to the research group that holds them is drafted."
  - "Real data only: published trajectories, photos and videos. No synthetic flocks."
  - "A new parameter is kept only if it improves the fit on flocks it was not fitted on."
links:
  - { label: "Findings on GitHub", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/nature/FINDINGS.md" }
  - { label: "Four-species comparison table", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/nature/comparison.md" }
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

## Birds: jackdaws, pigeons and chimney swifts

Three open bird datasets (all CC0) were measured the same way as the fish: 6 wild jackdaw flocks filmed in 3D (Ling et al. 2019), 43 GPS-tracked pigeon flights with and without a robotic falcon (Papadopoulou et al. 2022), and chimney swifts circling into a chimney at dusk, a few hundred birds in every frame (Evangelista et al. 2017).

1. **A big flock behaves like a fluid.** The same fluid-equation fit that explained about 13% of a 39-fish school explains **66%** of the swifts' motion on data it was not fitted on. The flock-as-a-fluid picture holds once there are hundreds of animals.
2. **But not an ordinary fluid.** The fit keeps the usual "the flow carries itself along" term, two terms that only flocks have, and a pull toward crowded areas: cohesion, the opposite of gas pressure.
3. **A new term was tested and dropped.** A pull toward the roost and circling around it did not improve the fit, so by the study's rule it stays out.
4. **A predator is a clear outside factor.** When the robotic falcon comes within 30 m, pigeons turn almost three times as sharply (27 vs 10 degrees per second) and slow from 20.8 to 17.3 m/s, yet stay aligned and turn as one.
5. **Who they follow depends on the species.** Pigeons follow their 7 nearest neighbours, the number reported for starlings. Jackdaws lean on everyone within a fixed distance. Neither rule predicts an individual bird's turn well, so this is a tendency, not a law.

## Where it stands

Four species measured (fish, jackdaws, pigeons, swifts), and the fluid equation works on the large flock. Next: the fit in 3D, then the fitted terms inside the agent swarm on a traffic or logistics bottleneck.
