---
field: hospitality
kind: optimisation
title: "Shift schedule builder"
summary: "Turns forecast workload into a week of shifts at the lowest labour cost, checks each one against Ontario employment rules and exports to Excel."
group: People and scheduling
status: Live
order: 7
date: 2026-10-01
sectors:
  - "Hotels"
  - "Restaurants"
  - "Retail"
  - "Care homes"
  - "Any business with shifts"
  - "Logistics"
  - "Healthcare"
editions:
  - { sector: Hotels (housekeeping and front desk), href: "/tools/shift-scheduler/hotels/", status: Live }
  - { sector: Restaurants and retail, status: Planned }
open: "/tools/shift-scheduler/hotels/"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Department and store managers"
  - "Operations and HR coordinators"
  - "Owners doing the schedule themselves"
where:
  - "Any team that works shifts and whose workload changes by day"
howto:
  - "Enter or load the workload forecast per day"
  - "Add staff with their availability, wages and skills"
  - "Set the rules such as minimum rest and maximum hours"
  - "Build the schedule and review any rule warnings"
  - "Export to Excel to share"
limitations:
  - "Rules are set up for Ontario's Employment Standards Act and need changes for other provinces"
  - "Large teams (hundreds of staff) solve slowly in the browser"
roadmap:
  - "Restaurant and retail templates with role mixes"
  - "Staff availability from a shared form"
  - "Other provinces' rules"
selfhost:
  - "A solver on a server handles large teams in seconds"
  - "Read availability and time-clock data from your HR or payroll system"
method:
  - "Mixed-integer programming (PuLP)"
  - "Ontario ESA rule checks"
  - "Excel export"
---

Scheduling by hand either overstaffs quiet days or leaves busy ones short. The builder treats the week as an optimisation problem: cover the forecast workload at the lowest cost without breaking any employment rule, then explain any trade-offs it had to make.
