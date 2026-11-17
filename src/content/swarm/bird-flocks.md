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
  - { name: "Fluid equation in 3D (swifts)", done: true, added: 2026-11-17 }
  - { name: "Flock edges as boundaries", done: false }
  - { name: "First real bottleneck test: crowd exit and highway merge", done: true, added: 2026-11-17 }
  - { name: "Compared with other natural swarms (fish, insects, crowds)", done: true }
  - { name: "One general form tested on held-out flocks", done: false }
  - { name: "Checked against my engineered swarm", done: false }
  - { name: "Paper", done: false }
stats:
  - { value: "83%", label: "3D fluid fit on chimney swifts, held out, with one term" }
  - { value: "32 → 36%", label: "drivers at a real lane drop explained once flock rules are added" }
  - { value: "13%", label: "same fit on a 39-fish school: too few for a continuum" }
  - { value: "10 → 27°/s", label: "pigeon turning when the robotic falcon comes within 30 m" }
roadmap:
  - "Next: a control test at the highway merge. Give a share of vehicles the cohesion rule in a model calibrated on the real data and measure throughput."
  - "Starling tracks: a request to the research group that holds them is drafted."
  - "Real data only: published trajectories, photos and videos. No synthetic flocks."
  - "A new parameter is kept only if it improves the fit on flocks it was not fitted on."
links:
  - { label: "Findings on GitHub", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/nature/FINDINGS.md" }
  - { label: "Four-species comparison table", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/nature/comparison.md" }
  - { label: "Bottleneck result tables", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/nature/bottlenecks.md" }
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

## In 3D, the swift flock is almost one term

With vertical motion included, the fluid fit explains **83%** of the swifts' motion on held-out data, and the sparse fit keeps a single term: the flow carrying itself along. Each bird mostly follows the bend of a smooth, steady flow circling the roost. A constant vertical pull was tested and not needed. A high score here says the flow is smooth. It is not yet a force law for how the flock reacts to something new.

## First real bottlenecks: a crowd exit and a highway merge

Two open datasets (CC BY 4.0): 150 people leaving a corridor through exits 0.7 to 1.8 m wide (Juelich 2009), and drone-tracked cars where a highway narrows from four lanes to three (DRaT 2025, about 5,000 vehicles).

1. **Flock rules help describe drivers.** A standard car-following rule explains 32.3% of each driver's next-second speed change in congestion. Adding two bird rules (match the 6 nearest vehicles' speed and stay with them) raises that to 35.5%. In free flow it rises from 7.2% to 10.1%. Drivers react to the group, not only to the car ahead, and most of the gain comes from staying with the group.
2. **A crowd at an exit is not a fluid at this size.** Flow rises with exit width (1.6 to 2.8 people per second), and people keep a steady personal space of about 0.6 m at every width. Neighbour rules explain about 20% of turns, more than in any animal group, but the fluid fit explains only 1 to 10%.
3. **Order does not buy flow.** How aligned the crowd is before the exit does not predict how many people get through just after, so "more aligned means more flow" is not supported.

## Where it stands

Four species and two real bottlenecks measured. The useful ingredient for traffic so far is a group-aware rule (stay with your nearest few), not a fluid equation, which only clearly fits the large circling swift flock. Next: a control test at the merge, giving a share of vehicles that rule and measuring throughput.
