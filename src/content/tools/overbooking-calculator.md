---
title: "No-show and overbooking calculator"
summary: "How many extra bookings to accept so no-shows and late cancellations don't leave capacity empty, with the cost of getting it wrong."
group: Pricing and revenue
status: Live
order: 3
date: 2026-10-01
sectors:
  - "Hotels"
  - "Restaurants"
  - "Clinics"
  - "Transport"
editions:
  - { sector: Hotels, href: "/hotel-business/tools/overbooking.html", status: Live }
  - { sector: Restaurants and clinics, status: Planned }
open: "/hotel-business/tools/overbooking.html"
code: "https://github.com/nihalunfc/hotel-business"
who:
  - "Revenue managers"
  - "Restaurant and clinic schedulers"
  - "Anyone who takes reservations and sees no-shows"
where:
  - "Hotel rooms"
  - "Restaurant reservations"
  - "Clinic and salon appointments"
  - "Tours and transport seats"
howto:
  - "Enter capacity and bookings for the date"
  - "Enter your usual no-show and late-cancel rate"
  - "Enter the value of a sale and the cost of turning someone away"
  - "Read the suggested number of extra bookings and the expected cost"
limitations:
  - "It treats no-shows as random, so a large group cancelling together isn't covered"
  - "The no-show rate is yours to supply until it can read your history"
roadmap:
  - "Learn no-show rates by day and booking channel from history"
  - "A version for appointments with time slots"
selfhost:
  - "Calculate no-show rates from your own booking records instead of a typed number"
  - "Recalculate the safe overbooking level each day for every date ahead"
method:
  - "Binomial no-show model"
  - "Expected-cost optimisation"
  - "JavaScript in the browser"
---

Every business that takes reservations loses money to people who don't turn up. Accepting a few extra bookings recovers it, but too many means turning people away. The calculator finds the number that balances the two using your no-show rate and your costs.
