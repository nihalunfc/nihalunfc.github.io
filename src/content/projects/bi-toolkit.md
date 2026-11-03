---
field: hospitality
kind: bi
title: Business intelligence toolkit
summary: One data model, one set of quality checks and a dozen decision tools for pricing, forecasting, scheduling and reporting, built once and fitted to each sector as an edition.
category: Business intelligence
status: Ongoing
date: 2026-10-01
updated: 2026-11-03
order: 0
featured: true
tags: [Star schema, ETL, Data quality, Python, SQL, Power BI]
sectors: [Hotels, Restaurant chains, Retail, Any multi-site business]
editions:
  - { sector: Hospitality, href: /projects/hospitality-bi/, status: Live }
  - { sector: Restaurant chains, status: Planned }
  - { sector: Retail, status: Planned }
stats:
  - { value: "12", label: "tools in the first edition" }
  - { value: "10", label: "automated data-quality checks" }
  - { value: "3", label: "sector editions planned" }
links:
  - { label: "All tools", href: "/tools/" }
  - { label: "Hospitality edition", href: "/projects/hospitality-bi/" }
  - { label: "Code on GitHub", href: "https://github.com/nihalunfc/hotel-business" }
limitations:
  - Every edition runs on synthetic sample data, so no figure here describes a real business.
  - The tools read prepared files today rather than a live, scheduled feed.
roadmap:
  - Scheduled ETL pipelines that load an Azure SQL Database, so dashboards refresh overnight.
  - A restaurant-chain edition (covers, average cheque, labour per cover, kitchen capacity).
  - A retail edition (footfall, conversion, basket size, stock cover).
  - Power BI reports on the same star schema.
---

## The idea

Most businesses that sell limited capacity or run shifts ask the same questions every week: what to charge, how busy we'll be, how many people to schedule, whether yesterday balanced and how this week compares with last year. The data to answer them is already in their systems. It's rarely in a shape a manager can use before the morning meeting.

This toolkit is my answer, built in layers so it can move between sectors:

- **A warehouse model.** A star schema with facts for sales or bookings, stays or visits, and labour, and shared dimensions for date, site, product and channel.
- **Data quality first.** Ten automated checks (duplicates, impossible dates, negative prices, orphan keys, capacity breaches and more) run before any number reaches a dashboard.
- **Decision tools.** [Pricing](/tools/pricing-recommender/), [demand forecasting](/tools/demand-forecaster/), [no-show planning](/tools/overbooking-calculator/), [shift scheduling](/tools/shift-scheduler/), [daily close](/tools/daily-close/), [KPI dashboards](/tools/kpi-dashboard/) and [more](/tools/).

## Editions

The **hospitality edition** came first, because I worked on a hotel floor in Niagara Falls and saw the problems up close. It runs on a five-hotel sample group with about 640,000 bookings.

The **restaurant-chain** and **retail** editions reuse the same model and checks. Bookings become orders or transactions, rooms become seats or stock, and each tool gets the inputs and KPIs that sector uses.
