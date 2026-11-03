---
title: WARL wildfire drone swarm
summary: Decentralised drones trained with deep Q-learning to route to a fire's choke points, with a live map dashboard and an explainable-AI chatbot. Built for the GDG on Campus Build with AI 2026 hackathon.
category: Applied AI
status: Complete
date: 2026-09-20
order: 3
featured: false
sectors: [Research, Emergency response]
tags: [PyTorch, DQN, Leaflet, Gemini API, Hackathon]
stats:
  - { value: "DQN", label: "one policy per drone" }
  - { value: "Live", label: "map dashboard" }
links:
  - { label: "Live demo", href: "https://nihalunfc.github.io/GDGCHackathon2026/docs/" }
  - { label: "Code on GitHub", href: "https://github.com/nihalunfc/GDGCHackathon2026" }
---

## The problem

When a wildfire spreads, firefighting aircraft are scarce and every drop matters. Dropping retardant at the head of the fire helps less than cutting it off where the terrain and fuel funnel it.

## What I built

- A swarm of drones, each with its own deep Q-network in PyTorch, that learns to route to choke points without a central controller.
- A live dashboard in HTML, JavaScript and Leaflet that replays the fire and the swarm on a map.
- An "explainable AI" chatbot on the Gemini API that tells an incident commander, in plain language, why the swarm chose each target.

## Result

Built for GDG on Campus Build with AI 2026. The judges' placings haven't been released yet; I'll add the result here when they are.
