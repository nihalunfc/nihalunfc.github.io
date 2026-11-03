---
field: hospitality
kind: bi
title: "Labour productivity"
summary: "Hours and labour cost per unit of work, such as per occupied room, per cover or per transaction, by team and by week."
group: People and scheduling
status: Live
order: 9
date: 2026-10-01
sectors:
  - "Hotels"
  - "Restaurants"
  - "Retail"
  - "Any business"
  - "Logistics"
editions:
  - { sector: Hotels (per occupied room), href: "/tools/labour-productivity/hotels/", status: Live }
  - { sector: Restaurants (per cover) and retail (per transaction), status: Planned }
open: "/tools/labour-productivity/hotels/"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Operations and finance managers"
  - "Owners"
  - "HR analysts"
where:
  - "Weekly labour reviews"
  - "Budget setting"
  - "Comparing teams or sites"
howto:
  - "Enter hours and wages by team"
  - "Enter the units of work for the same period"
  - "Read cost and hours per unit and how they compare with your target"
limitations:
  - "It needs hours and work counts for the same period, typed or pasted"
  - "Doesn't yet split fixed and variable labour"
roadmap:
  - "Read hours from a time-clock export"
  - "Fixed and variable labour split"
  - "Restaurant and retail units"
selfhost:
  - "Join time-clock and sales or occupancy data in a warehouse so the numbers update daily"
method:
  - "Ratio analysis"
  - "Targets by team"
  - "JavaScript in the browser"
---

Labour is usually the largest cost a manager controls. Expressing it per unit of work makes busy and quiet weeks comparable, so you can see whether a team got more or less efficient.
