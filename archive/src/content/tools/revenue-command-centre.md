---
field: hospitality
kind: bi
title: "Revenue command centre"
summary: "One page for the whole business: demand pace, forecast, lost demand on sold-out days, net revenue by sales channel and cancellations."
group: Reporting
status: Live
order: 6
date: 2026-10-01
sectors:
  - "Hotels"
  - "Restaurant chains"
  - "Retail chains"
  - "Automotive dealerships"
editions:
  - { sector: Hotels, href: "/tools/revenue-command-centre/hotels/", status: Live }
  - { sector: Restaurant chains, status: Planned }
  - { sector: Retail chains, status: Planned }
open: "/tools/revenue-command-centre/hotels/"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Revenue and commercial leads"
  - "Multi-site operators"
  - "BI analysts"
where:
  - "Monthly and weekly commercial reviews"
  - "Channel and commission decisions"
  - "Spotting demand you're turning away"
howto:
  - "Open the dashboard on the sample five-site group"
  - "Filter by site, period and channel"
  - "Use the pace chart to compare with last year"
  - "Check net revenue by channel after commission"
limitations:
  - "Runs on a synthetic sample group, not real data"
  - "The data is prepared ahead of time rather than refreshed live"
roadmap:
  - "Scheduled ETL into Azure SQL Database so it refreshes like a real group's"
  - "Restaurant and retail editions on the same star schema"
selfhost:
  - "Load bookings or sales from your systems into a star-schema warehouse every night"
  - "Run the ten data-quality checks before anything reaches the dashboard"
method:
  - "Star schema"
  - "Ten automated data-quality checks"
  - "Python"
  - "SQL"
  - "D3"
---

The command centre is the top layer of the BI toolkit: it reads from a star-schema warehouse of about 640,000 sample bookings and answers the questions a commercial meeting asks. The same model and checks carry over to restaurant and retail chains, where bookings become orders and rooms become seats or stock.
