---
title: "Pricing recommender"
summary: "A suggested price for each of the next 30 days, from how full you already are, how fast you're filling and what you charged last year."
group: Pricing and revenue
status: Live
order: 1
date: 2026-10-01
sectors:
  - "Hotels"
  - "Short-term rentals"
  - "Venues and events"
  - "Parking"
editions:
  - { sector: Hotels, href: "/hotel-business/tools/rate-recommender.html", status: Live }
  - { sector: Venues and events, status: Planned }
open: "/hotel-business/tools/rate-recommender.html"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Revenue and pricing managers"
  - "Owners of small properties"
  - "Analysts who need a starting price to argue with"
where:
  - "Any business that sells a fixed amount of capacity by date, such as rooms, seats, slots or spaces"
  - "Weekly pricing meetings"
  - "Checking a price before a busy weekend or event"
howto:
  - "Open the tool and enter your capacity"
  - "Add what is already booked for each date, or load the sample data"
  - "Set your floor and ceiling prices"
  - "Read the suggested price per day and the reason given for it"
  - "Export the table to share or keep"
limitations:
  - "It suggests prices from your own pace only and doesn't read competitor prices"
  - "It assumes demand behaves like the sample group until you load your own history"
  - "It's a decision aid, so a person still sets the final price"
roadmap:
  - "Read competitor or market prices from a file"
  - "A venue and events edition priced per seat"
  - "Run nightly from a database instead of a pasted table"
selfhost:
  - "Read bookings straight from your reservation or point-of-sale database each night"
  - "Keep a history of suggested and actual prices so you can see which suggestions paid off"
method:
  - "Booking pace curves"
  - "Last-year comparison"
  - "JavaScript in the browser"
---

Businesses that sell a fixed amount of something by date (rooms, tables, seats, parking spaces) lose money in two ways: selling too cheap on days that would have filled anyway, and holding out too long on days that never fill. This tool compares how full each future date is with how full it normally is that far out, and moves the price up or down within limits you set.
