---
title: NeurIPS 2026 Smart Buildings
summary: An HVAC control policy that keeps people comfortable while cutting energy and carbon in buildings and climates it has never seen. Physics-informed control, validated on 30 simulated unseen scenarios.
category: Kaggle
status: Ongoing
date: 2026-10-31
order: 6
featured: false
tags: [Python, NumPy, Numba, Optuna, Control]
stats:
  - { value: "0.01244", label: "best public score (lower is better)" }
  - { value: "0.01853", label: "best public notebook" }
  - { value: "30", label: "unseen validation scenarios" }
links:
  - { label: "Competition", href: "https://www.kaggle.com/competitions/neurips-2026-smart-buildings" }
---

## The problem

Write one control policy for a building's heating and cooling that keeps occupants comfortable and cuts energy use and carbon, and make it work in buildings and climates it has never seen.

## What I built

- **Held-out test sets.** I ran the hosts' building simulator to generate 6 new buildings in 5 climates for 30 days each: 30 scenarios the policy never trained on.
- **A physics-informed controller.** Zone PI loops, night and weekend setback, occupancy-aware pre-start and a holiday detector, improved over eight versions with Optuna.
- **Selection on validation.** I chose final submissions on the unseen-building scores, not the public leaderboard.

## The hardest part

Not overfitting to the handful of buildings in the public data. I read the simulator's source to understand the physics, then tested every change on newly generated buildings and weather. Along the way I found a billing bug in the simulator. I reported it to the hosts instead of exploiting it, and they fixed it.

## Result

A best public score of 0.01244 against 0.01853 for the best public notebook, and well ahead of the organisers' baseline. Round 1 ends on 13 November 2026 and the final on 15 January 2027.
