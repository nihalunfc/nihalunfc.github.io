## The idea

Many real problems are thousands of small decisions made at the same time: when each battery charges, where each drone flies, which crew a province lends. A central planner gets slow and fragile as the number of agents grows. A swarm lets each agent decide for itself using what it can see, and still behave like one well-run team.

## Three tracks

- **Applications.** One engine applied to real problems, each tested against the rule people use today. The focus now is energy grids, oil and gas, and wildfires, with tools for Canadian federal and provincial governments in mind.
- **Swarm agents and AI agent crews.** Fast swarm agents act, and a crew of AI language-model agents watches the results, flags where the swarm falls behind the rule and proposes fixes that a person approves.
- **Natural swarm study.** Working out the rules real swarms follow from measured data only: fish schools first, then one general law measured across 25 real datasets, from bird flocks and crowds to epidemics, wildfires and the grid. A speculative extension asks whether the universe itself regulates its expansion like a swarm.

## Results so far

- **Grid batteries.** Home and commercial batteries on a stressed grid decide when to charge and discharge. Over 10 training seeds the swarm cut the simulated peak by 704 MW on average (the perfect-foresight best is 949 MW) and reduced demand swings by 10.8%, against 9.1% for the best rule and 6.8% for a planner with a 24-hour forecast.
- **Smart buildings (CityLearn).** On the public CityLearn 2022 benchmark the swarm scored 0.96 against 1.03 for CityLearn's tuned rule-based controller and 1.13 for its basic one (lower is better).
- **Wildfire drones.** Drones choose where to drop retardant, routing to the fire's choke points. The best swarm saved 87% of the forest; the nearest-fire rule saves 90%, and no learned swarm has beaten it yet.
- **Hotel operations (paused).** HVAC, lighting and staff respond to occupancy and energy prices: $211k a year over 5 seeds for the sample hotel group, below the $252k a simple peak-alert rule gets.

- **One law for 25 real swarms.** All 8 moving swarms align with their neighbours, the switch from keeping apart to drawing together sits at about one neighbour distance (median 0.96), and 67% of collective series pull themselves back toward a set point. [Read the study](/swarm/universal-swarm-law/).
- **Six application frameworks.** The same rules as controllers: close aircraft pairs cut by 86% in simulation, COVID waves forecast 3 to 5 times better than exponential growth, and honest losses where a simple baseline still wins. [See all six](/swarm/swarm-applications/).
- **The swarm universe (speculative).** Dark energy as the universe's own set-point control. It fits supernova and BAO data as well as the standard model, but the data do not prefer it, and it does not solve the Hubble tension. [Read the model and its faults](/swarm/swarm-universe/).

The full write-up of the engine results is the [paper draft](/swarm/paper/). The work started with multi-agent reinforcement learning on ERCOT grid time series and grew from there. The engine is open source under the MIT licence.

## How I report results

Every number is an average over several training seeds, tested on data kept apart from training, next to the simple rule and, where possible, the best possible result. Where the rule wins, the page says so.
