---
field: hospitality
kind: bi
title: "Report builder"
summary: "Upload the exports you already have (CSV or Excel) and get a manager's report with charts and notes, without building a dashboard."
group: Reporting
status: Live
order: 12
date: 2026-10-01
sectors:
  - "Any business"
  - "Finance and insurance"
  - "Research"
editions:
  - { sector: Hotels, href: "/tools/report-builder/hotels/", status: Live }
  - { sector: Any business, status: In progress }
open: "/tools/report-builder/hotels/"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Managers who get exports but no dashboards"
  - "Analysts who need a quick first look"
  - "Small businesses without a BI tool"
where:
  - "Any system that exports CSV or Excel: bookings, point of sale, inventory, payroll"
howto:
  - "Upload one or more exports"
  - "Check the columns it detected"
  - "Pick the measures and the period"
  - "Print the report or save it as PDF"
limitations:
  - "Column detection works best with the hotel exports it was built for"
  - "Files stay in your browser, so very large files are slow"
roadmap:
  - "Column mapping for retail and restaurant exports"
  - "Saved report templates"
selfhost:
  - "Replace uploads with a scheduled pull from your systems into a database"
  - "Email the report to managers every morning"
method:
  - "CSV and Excel parsing in the browser"
  - "Automatic column typing"
  - "Charting"
---

Many teams already have the data, just not in a shape anyone reads. The report builder takes the exports you have today and turns them into a short report, which is often the first step before a proper warehouse.
