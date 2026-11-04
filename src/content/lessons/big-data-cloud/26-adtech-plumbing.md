---
title: "Adtech plumbing: how an ad gets served"
summary: "Ad servers, auctions, real-time bidding, DSPs and SSPs, identity, frequency caps and pacing, clean rooms, and the event data each step creates."
module: 7
minutes: 30
outcomes:
  - "Walk through an ad request from page load to impression"
  - "Explain DSPs, SSPs, exchanges, ad servers and real-time bidding"
  - "Explain identity, consent, frequency capping, pacing and data clean rooms"
quiz:
  - q: "A demand-side platform (DSP) is used by…"
    options: ["Publishers to sell inventory", "Advertisers and agencies to buy ad impressions across many sites", "Shoppers to block ads", "Retailers to count stock"]
    answer: 1
    why: "DSPs buy. Supply-side platforms (SSPs) help publishers sell. Exchanges run the auctions between them."
  - q: "Budget pacing tries to…"
    options: ["Spend the whole budget in the first hour", "Spread spend evenly (or by plan) across the campaign so it neither runs out early nor underspends", "Lower prices", "Delete campaigns"]
    answer: 1
    why: "Pacing needs near real-time spend data, which is one reason adtech relies on streaming."
  - q: "A data clean room lets a retailer and a brand…"
    options: ["Swap raw customer lists", "Run approved, privacy-safe analyses across both datasets without either seeing the other's row-level data", "Clean CSV files", "Remove all ads"]
    answer: 1
    why: "Clean rooms enforce rules such as minimum audience sizes and aggregated outputs, so personal data stays protected."
---

## An ad request in 100 milliseconds

A shopper opens the grocery app's search results for "cola".

1. The app sends an **ad request** to the **ad server** with context: page, placement, search term, user or device ID, consent flags.
2. For **sponsored products**, the retailer's own auction picks eligible ads (cola brands bidding on "cola", in stock, budget left, within frequency caps), scores them by **bid × predicted click rate × relevance**, and returns the winners.
3. For **display or offsite**, the request may go to an **SSP** and **ad exchange**, which run a **real-time bidding (RTB)** auction: many **DSPs** receive a **bid request**, decide in tens of milliseconds whether and how much to bid, and the highest bid wins.
4. The ad is rendered. The device fires an **impression** event; viewability scripts fire a **viewable impression** when enough of it is on screen long enough; a tap fires a **click**.
5. Later, an **order** or store purchase is linked back to that exposure for **attribution**.

Each step writes events: requests, bids, wins, losses, impressions, clicks, conversions. A busy network creates **billions of events a day**.

<div class="callout analogy">

**Analogy: a lightning-fast auction house.** Every time a page loads, one seat at a show comes up for sale (an impression). The auctioneer (exchange) shouts the seat's details; buyers' agents (DSPs) have a tenth of a second to bid on behalf of their clients (advertisers); the seller's agent (SSP) wants the best price; the box office (ad server) prints the ticket. It happens billions of times a day, and every shout and bid is written in the ledger.

</div>

## Who's who

| Piece | Job | Examples (types) |
|---|---|---|
| **Ad server** | Decides and records which ad shows in each placement | Publisher ad servers, retailer sponsored-products engines |
| **DSP** | Lets advertisers buy across many publishers with targeting | Independent and walled-garden DSPs |
| **SSP / exchange** | Lets publishers sell inventory in auctions | SSPs, exchanges |
| **DMP / CDP** | Builds audience segments from first-party data | Customer data platforms |
| **Clean room** | Privacy-safe joins between partners | BigQuery data clean rooms, other cloud and specialist clean rooms |
| **Measurement / verification** | Independent viewability, fraud and outcome measurement | Verification and measurement vendors |

## Identity and consent

To link an ad view to a purchase you need to know it's the same person. Methods:

- **Logged-in first-party IDs** (loyalty ID, account): the most accurate, the core retail media advantage.
- **Hashed emails** matched between partners (inside clean rooms).
- **Device IDs** on mobile, limited by platform privacy controls.
- **Contextual** targeting needs no identity at all (the search term "cola" is enough).

Consent and privacy laws (Canada's PIPEDA and Québec's Law 25, Europe's GDPR, US state laws) decide what you may collect and use. Platforms store consent flags with events and enforce them in pipelines.

## Real-time controls that need streaming

- **Budget pacing:** compare spend so far against plan every minute; throttle or boost bidding.
- **Frequency capping:** "no more than 3 impressions per user per day", needs a fast counter per user and campaign (Bigtable or Redis).
- **Out-of-stock suppression:** stop ads for products not available at the shopper's store (inventory events from Kafka).
- **Fraud and bot filtering:** drop invalid traffic before it's billed.

## Data clean rooms

Brands want to combine their data (their customer list, their other campaigns) with the retailer's shopper data; neither may share raw personal data. A **clean room** lets both put data into a controlled environment where only approved queries run (aggregates above a minimum audience size, no row-level export). On Google Cloud, **BigQuery data clean rooms** do this with analysis rules; other clouds and specialist vendors offer similar products.

## The event data model

A minimal impression table:

| column | example |
|---|---|
| event_id | `imp_7f3c…` |
| event_ts | `2026-11-04 10:02:07.311` |
| campaign_id, line_item_id, creative_id | `C123`, `L9`, `CR55` |
| placement, page_type, search_term | `search_top`, `search`, `cola` |
| user_key (hashed), device_type | `u_9ab…`, `ios` |
| price_paid, auction_type | `0.012`, `second_price` (or `first_price`) |
| is_viewable, consent_ad | `true`, `true` |

Clicks and conversions reference `event_id` or `user_key` and time, which is how attribution joins them (next lesson).

<div class="callout exercise">

**Exercise (20 minutes).** Design the Kafka topics, keys and downstream stores for (a) pacing, (b) frequency capping, (c) advertiser dashboards, (d) monthly billing. For each, give the latency needed and the store you'd use.

</div>

<details class="answer"><summary>One design</summary>

Topics `ads.impressions.v1` and `ads.clicks.v1`, keyed by `campaign_id` for pacing order, plus `ads.spend.v1`. (a) Pacing: Flink sums spend per campaign per minute → Redis/Bigtable counters read by the bidder (seconds). (b) Frequency caps: Flink or the ad server increments `user#campaign#date` in Bigtable/Redis (milliseconds). (c) Dashboards: Druid ingests impressions and clicks from Kafka with minute rollup (seconds to a minute). (d) Billing: Kafka Connect → GCS → Spark de-duplicates and filters invalid traffic → BigQuery billing tables, reconciled monthly (daily batch, exact).

</details>
