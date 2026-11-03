---
field: hospitality
kind: ml
title: "Demand forecaster"
summary: "Forecasts the next 30 to 90 days of demand from your history, with a range and a back-test so you can see how far to trust it."
group: Forecasting and planning
status: Live
order: 2
date: 2026-10-01
sectors:
  - "Hotels"
  - "Restaurants"
  - "Retail"
  - "Any business"
  - "Logistics"
  - "Healthcare"
editions:
  - { sector: Hotels (occupancy), href: "/tools/demand-forecaster/hotels/", status: Live }
  - { sector: Restaurants (covers), status: Planned }
  - { sector: Retail (footfall and units), status: Planned }
open: "/tools/demand-forecaster/hotels/"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Operations and revenue managers"
  - "Store and restaurant managers planning stock and staff"
  - "Analysts who need a baseline forecast"
where:
  - "Hotel occupancy"
  - "Restaurant covers"
  - "Store footfall or units sold"
  - "Any daily count with a weekly pattern"
howto:
  - "Load a daily history as CSV with a date column and a count column, or use the sample data"
  - "Choose how far ahead to forecast"
  - "Check the back-test error before using the numbers"
  - "Export the forecast to feed a schedule or a purchase order"
limitations:
  - "It needs at least a year of daily history to learn the yearly pattern"
  - "It doesn't know about one-off events unless you mark them"
  - "Large changes like a renovation or a new competitor break the history"
roadmap:
  - "Event and holiday markers you can edit"
  - "Restaurant and retail editions with sector-specific inputs"
  - "Forecasts refreshed daily from a warehouse table"
selfhost:
  - "A scheduled job reads yesterday's actuals and updates the forecast every morning"
  - "Forecasts are stored next to actuals so accuracy can be tracked over months"
method:
  - "Seasonal baseline with day-of-week effects"
  - "Rolling back-test"
  - "JavaScript in the browser"
---

Most staffing and stock decisions start with one question: how busy will we be? The forecaster learns the weekly and yearly pattern in your own history and projects it forward, showing a range instead of a single number. The back-test replays past weeks so you can see how wrong it would have been.
