---
title: "KPI dashboard"
summary: "The handful of numbers a manager checks every morning, with pace against last year and a plain-language note on what changed."
group: Reporting
status: Live
order: 5
date: 2026-10-01
sectors:
  - "Hotels"
  - "Restaurants"
  - "Retail"
  - "Any business"
  - "Finance and insurance"
editions:
  - { sector: "Hotels (occupancy, ADR, RevPAR)", href: "/hotel-business/tools/kpi.html", status: Live }
  - { sector: "Restaurants (covers, average cheque, labour %)", status: Planned }
  - { sector: "Retail (sales per square foot, conversion, basket)", status: Planned }
open: "/hotel-business/tools/kpi.html"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "General and store managers"
  - "Owners"
  - "Analysts building a first dashboard"
where:
  - "Morning meetings"
  - "Weekly owner reports"
  - "Comparing sites in a chain"
howto:
  - "Load the sample data or a CSV export with dates and the figures you track"
  - "Choose the period and the comparison"
  - "Read the cards and the notes on what moved"
  - "Print or save as PDF"
limitations:
  - "Each edition knows one sector's KPIs"
  - "It reads one export at a time, not a live feed"
roadmap:
  - "Restaurant and retail editions"
  - "Several sites side by side"
  - "A Power BI version on the same model"
selfhost:
  - "Connect to a warehouse so every site's numbers refresh overnight"
  - "Add sign-in so each manager sees only their own sites"
method:
  - "KPI definitions shared across editions"
  - "Year-over-year pace"
  - "JavaScript in the browser"
---

Every sector has its own short list of numbers that tell you whether yesterday went well. The dashboard shows them on one screen with the comparison that matters (last year, budget, or last week) and a note on what moved.
