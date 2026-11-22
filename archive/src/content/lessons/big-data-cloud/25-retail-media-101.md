---
title: "Retail media 101"
summary: "Why retailers have become ad businesses, the onsite, offsite and in-store channels, closed-loop measurement, and the data behind it all."
module: 7
minutes: 25
outcomes:
  - "Explain what a retail media network is and why it has grown so fast"
  - "Describe onsite, offsite and in-store retail media"
  - "Explain closed-loop measurement and why first-party data matters"
quiz:
  - q: "What makes retail media attractive to brands compared with many other ad channels?"
    options: ["It is always cheaper", "The retailer can connect ad exposure to actual purchases using its own first-party data (closed loop)", "It uses third-party cookies", "It needs no data"]
    answer: 1
    why: "Retailers see both the ad exposure and the sale, so they can measure sales outcomes directly, especially for logged-in loyalty shoppers."
  - q: "Sponsored products in search results on a retailer's site are an example of…"
    options: ["Offsite media", "Onsite media", "In-store media", "Television"]
    answer: 1
    why: "Onsite media appears on the retailer's own website and app: sponsored listings, banners, homepage placements."
  - q: "Offsite retail media means…"
    options: ["Ads on the retailer's own app", "Using the retailer's audiences to buy ads on other sites, social and streaming TV", "Printed flyers only", "Ads inside the warehouse"]
    answer: 1
    why: "Offsite extends reach beyond the retailer's properties while still using its shopper data to target and measure."
---

## What retail media is

A **retail media network (RMN)** is a retailer selling advertising to the brands whose products it stocks. A cereal brand pays the grocer to show its cereal at the top of search results, on the app home page, on screens in store, or to the grocer's shoppers elsewhere on the internet. Big general merchants, grocers, pharmacies, marketplaces, delivery apps and even travel and banking companies now run media networks.

Why the boom:

1. **First-party data.** Retailers know what logged-in shoppers actually buy. With privacy rules tightening and third-party cookies fading, this is gold.
2. **Closed-loop measurement.** The retailer sees both the ad and the sale, so it can show the brand sales results, not just clicks.
3. **Margins.** Advertising earns much higher margins than selling groceries, so it can fund lower prices or new services.
4. **Proximity to purchase.** Ads appear where people are already shopping.

<div class="callout analogy">

**Analogy: the shop window and the shelf ends, sold as ad space.** Supermarkets have always charged brands for the best shelf spots and the ends of aisles. Retail media is the same deal moved online and made measurable: the "shelf end" is the first search result, and the retailer can tell the brand how many shoppers who saw it then bought it.

</div>

## The channels

| Channel | Examples | Data involved |
|---|---|---|
| **Onsite: sponsored products** | Paid listings in search and category pages, usually auction-priced per click | Search queries, product catalogue, bids, impressions, clicks, add-to-cart, orders |
| **Onsite: display** | Banners and homepage takeovers on the site and app | Placements, audiences, impressions, viewability |
| **Offsite** | The retailer's audiences targeted on social, open web, connected TV and streaming audio | Audience segments, identity matching, partner impression logs, clean rooms |
| **In-store** | Digital screens, audio, smart cooler doors, shelf tags, checkout coupons | Screen play logs, footfall, store sales, loyalty transactions |
| **Sampling and offers** | Personalised coupons and loyalty-points offers | Loyalty IDs, offer redemptions |

## The players

- **The retailer's media team:** sells campaigns, runs the ad platform, owns the data and measurement.
- **Brands (advertisers)** and their **agencies:** plan budgets across many networks, want comparable metrics.
- **Ad tech partners:** ad servers, sponsored-product platforms, demand-side platforms (DSPs), clean-room providers, measurement firms. Many retailers license technology rather than build it all.
- **Shoppers:** whose privacy and experience must be protected; too many ads hurt sales.

## The data that makes it work

1. **Product catalogue** with categories, brands, stock and price (ads for out-of-stock items waste money).
2. **Ad events:** requests, impressions, viewable impressions, clicks, with timestamps, placement, campaign, creative and a user or device identifier.
3. **Commerce events:** product views, add-to-cart, orders online; **till transactions** in store linked by loyalty ID.
4. **Identity:** linking app, web, loyalty and email identities for one person (with consent).
5. **Campaign set-up:** budgets, bids, flight dates, targeting, attribution windows.

Moving and joining these at scale is exactly the Spark, Kafka, BigQuery and Druid work from Modules 2 to 5.

## Typical team questions

- "How many impressions did this campaign serve, and is it on pace to spend its budget by the end date?" (streaming, Druid)
- "What return on ad spend (ROAS) did it achieve?" (attribution, BigQuery, Spark)
- "Did it actually **cause** extra sales, or would these shoppers have bought anyway?" (incrementality, Lesson 27)
- "Which audiences should the next campaign target?" (ML, Module 6)

<div class="callout exercise">

**Exercise (15 minutes).** A soft-drink brand runs a two-week campaign with a grocer: sponsored products on the app, a homepage banner, and screens in 100 stores. List every dataset you'd need to report results, and mark which arrive in real time and which in batch.

</div>

<details class="answer"><summary>One list</summary>

Real time: ad requests, impressions and clicks from the app and website ad server; screen play logs (often batched hourly). Near real time: online orders. Batch (daily): store till transactions with loyalty IDs, campaign set-up and budgets, product and store dimensions, the list of stores with screens (exposed) and comparable stores without (control). Also identity mapping and consent flags.

</details>
