---
title: "Daily task board"
summary: "Splits today's tasks fairly across the people on shift and tracks each one from assigned to done."
group: Operations
status: Live
order: 8
date: 2026-10-01
sectors:
  - "Hotels"
  - "Cleaning services"
  - "Facilities"
  - "Retail"
  - "Logistics"
editions:
  - { sector: Hotels (housekeeping board), href: "/hotel-business/tools/housekeeping-board.html", status: Live }
  - { sector: Cleaning and facilities crews, status: Planned }
open: "/hotel-business/tools/housekeeping-board.html"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Supervisors"
  - "Team leads"
  - "Small operations teams"
where:
  - "Hotel housekeeping"
  - "Commercial cleaning rounds"
  - "Store tasks such as restocking"
  - "Maintenance work orders"
howto:
  - "List today's tasks with a rough time for each"
  - "List who's on shift"
  - "Let it balance the work, then adjust by hand"
  - "Mark tasks done as the day goes"
limitations:
  - "It saves on one device, so a team sharing it needs one screen"
  - "It balances by time, not by location or walking distance"
roadmap:
  - "Shared board across phones"
  - "Grouping by floor or area to cut walking"
selfhost:
  - "A small database lets the whole team update the same board from their phones"
  - "Task history shows real times per task to improve the estimates"
method:
  - "Greedy load balancing"
  - "Browser storage"
---

I built the first version from my own time on a hotel housekeeping floor, where the morning board decided whether the day was fair. The same idea works for any crew that splits a list of tasks every morning.
