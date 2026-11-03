---
field: hospitality
kind: tools
title: "Workforce suite"
summary: "Scheduling, time clock, timesheets, time off, approvals and payroll estimates in one app, with manager, employee and HR views."
group: People and scheduling
status: Live
order: 13
date: 2026-10-20
sectors:
  - "Hotels"
  - "Restaurants"
  - "Retail"
  - "Any business with hourly staff"
editions:
  - { sector: Hotels, href: "/tools/workforce-suite/hotels/", status: Live }
open: "/tools/workforce-suite/hotels/"
code: "https://github.com/nihalunfc/nihalunfc.github.io/tree/main/public/tools/workforce-suite/hotels"
who:
  - "Managers who build schedules and approve time"
  - "Employees checking shifts, clocking in and requesting time off"
  - "HR and payroll staff closing a pay period"
where:
  - "Any team paid by the hour, across one site or several"
howto:
  - "Open the app; it starts as a manager on a sample hotel"
  - "Use View as (top right) to switch between manager, employee and HR"
  - "Try the schedule, the time clock and the approvals queue"
  - "Reset the demo from Settings at any time"
limitations:
  - "Every person, hotel and number is fictional"
  - "Changes are saved only in this browser"
  - "Payroll tax amounts are simplified estimates, not payroll advice"
roadmap:
  - "Connect to a real time-clock export"
  - "Restaurant and retail templates"
selfhost:
  - "A shared database so managers and staff see the same schedule on every device"
  - "Sign-in by role, and an export to your payroll provider"
method:
  - "Single-page app in plain JavaScript"
  - "Chart.js"
  - "Browser storage"
---

A demo of the everyday people system a multi-site business needs: who's working, who's late, what needs approval and what this pay period will cost. Each part of the app has its own page, so you can link straight to the schedule or the approvals queue.
