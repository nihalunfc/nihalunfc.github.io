---
field: hospitality
kind: pipelines
title: BI toolkit, hospitality edition
summary: A star-schema warehouse of 640,000 bookings, ten automated data-quality checks, a revenue command centre, a staff schedule builder and eleven free tools, built for hotels first.
category: Business intelligence
status: Live
date: 2026-10-01
order: 1
demo: /tools/revenue-command-centre/hotels/
repo: https://github.com/nihalunfc/hotel-business
featured: true
tags: [Python, SQL, Star schema, PuLP, D3, Excel]
sectors: [Hotels, Resorts, Short-term rentals]
editions:
  - { sector: Hospitality, href: /projects/hospitality-bi/overview/, status: Live }
roadmap:
  - Scheduled ETL into Azure SQL Database so the dashboards refresh like a real group's.
limitations:
  - All hotels, guests, staff and figures are fictional samples.
stats:
  - { value: "640k", label: "bookings over four years" }
  - { value: "10", label: "automated data-quality checks" }
  - { value: "12", label: "tools and dashboards" }
links:
  - { label: "Overview of the sample hotel group", href: "/projects/hospitality-bi/overview/" }
  - { label: "Proposals", href: "/projects/hospitality-bi/proposals/" }
  - { label: "Revenue command centre", href: "/tools/revenue-command-centre/hotels/" }
  - { label: "Staff schedule builder", href: "/tools/shift-scheduler/hotels/" }
  - { label: "All hotel tools", href: "/tools/" }
  - { label: "Code on GitHub", href: "https://github.com/nihalunfc/hotel-business" }
---

*This is the first edition of my [business intelligence toolkit](/projects/bi-toolkit/). The same tools are being fitted to restaurant chains and retail.*

## The problem

A hotel group's managers make the same decisions every day: what rate to charge tonight, how many rooms to oversell, whether a group booking is worth the rooms it takes, and how many housekeepers to schedule. The data to answer each question is already in the booking system and the time clock. It just isn't in a shape anyone can use before the morning meeting.

I spent over a year working in hotel housekeeping in Niagara Falls, so I saw from the floor what happens when the schedule doesn't match the arrivals. This project is the toolkit I wish that hotel had.

## What I built

- **A warehouse.** A synthetic five-hotel group with about 640,000 bookings over four years, modelled as a star schema: fact tables for bookings and stays, dimensions for date, hotel, room type, channel and rate plan.
- **Data quality first.** Ten automated checks (duplicates, impossible dates, negative rates, orphan keys, occupancy above capacity and more) and unit tests run before any number reaches a dashboard.
- **Revenue command centre.** Occupancy, ADR and RevPAR with pace against last year, a back-tested demand forecast, lost demand on sold-out nights, net rates by channel after commission, and cancellations.
- **Staff schedule builder.** It turns the forecast workload into shifts with a mixed-integer program (PuLP), checks every shift against Ontario labour rules and exports to Excel.
- **Free tools.** A rate recommender, occupancy forecaster, overbooking calculator, group displacement quote, housekeeping board, labour productivity, night audit assistant, KPI dashboard, energy savings estimator and a report builder that takes any export.

## What's next

The tools currently read prepared files. I'm turning them into scheduled ETL pipelines that load an Azure SQL Database, so the dashboards refresh like they would in a real hotel group.

*All hotels, guests, staff and figures are fictional samples.*
