---
title: "Measurement: did the ads work?"
summary: "Delivery metrics, ROAS, attribution models and their bias, incrementality tests with test and control groups, lift, significance, and marketing mix models."
module: 7
minutes: 30
outcomes:
  - "Calculate CTR, CPM, CPC, conversion rate, ROAS and iROAS"
  - "Explain why attributed sales overstate the effect of ads"
  - "Design an incrementality test and calculate lift with a confidence interval"
quiz:
  - q: "A campaign cost $10,000 and attributed sales were $50,000. ROAS is…"
    options: ["0.2", "5.0", "40,000", "50"]
    answer: 1
    why: "ROAS = attributed revenue ÷ ad spend = 50,000 ÷ 10,000 = 5.0 (often written 500% or $5 per $1)."
  - q: "Why can attributed ROAS look high even if ads did little?"
    options: ["Maths errors", "Many attributed buyers would have bought anyway, especially loyal shoppers targeted because they're likely to buy", "Ads always work", "Impressions are counted twice on purpose"]
    answer: 1
    why: "Attribution credits sales that followed an ad; it doesn't prove the ad caused them. Incrementality tests measure the causal effect."
  - q: "In a holdout test, the exposed group converts at 4.0% and the control at 3.2%. The relative lift is…"
    options: ["0.8%", "25%", "4%", "80%"]
    answer: 1
    why: "Lift = (4.0 − 3.2) ÷ 3.2 = 0.25, or 25%. The absolute difference is 0.8 percentage points."
  - q: "Marketing mix modelling (MMM) estimates channel effects using…"
    options: ["User-level cookies", "Aggregated time series of sales, spend by channel and other factors (price, season, promotions)", "Only clicks", "Survey answers only"]
    answer: 1
    why: "MMM is a regression-style model on aggregated data, so it works without user-level tracking and covers channels like TV."
---

## Level 1: delivery metrics

| Metric | Formula | Tells you |
|---|---|---|
| **Impressions** | count of ads shown | Reach of delivery |
| **Viewability** | viewable impressions ÷ measured impressions | Whether ads could actually be seen |
| **CTR** | clicks ÷ impressions | Ad appeal or relevance |
| **CPM** | cost ÷ impressions × 1,000 | Price of attention |
| **CPC** | cost ÷ clicks | Price per visit |
| **Reach / frequency** | unique users; impressions ÷ unique users | Breadth versus repetition |

These come straight from ad events: Druid dashboards for live views, BigQuery for exact billing.

## Level 2: outcome metrics and attribution

- **Conversion rate:** purchases ÷ clicks (or ÷ exposed users).
- **Attributed sales:** sales credited to ads under an **attribution rule**.
- **ROAS** = attributed revenue ÷ ad spend. **ACoS** (common in sponsored products) = spend ÷ attributed revenue.

Attribution rules decide which ad gets credit:

| Model | Rule | Bias |
|---|---|---|
| **Last touch** | Last ad clicked or seen before purchase | Over-credits ads near the checkout (search) |
| **First touch** | First ad in the journey | Over-credits awareness ads |
| **Linear / time decay / position** | Split credit by rule | Arbitrary weights |
| **Data-driven** | Model estimates each touch's contribution | Better, still correlational |

Plus an **attribution window** (purchase within 14 days of a click, 1 day of a view) and **view-through vs click-through**. Same-SKU, same-brand and halo (other products of the brand) sales are usually reported separately.

<div class="callout analogy">

**Analogy: the rooster and the sunrise.** The rooster crows every morning just before the sun rises. Attribution would give the rooster full credit for the sunrise. To know whether the rooster matters, you need a morning without the rooster. That's an incrementality test.

</div>

## Level 3: incrementality

**Incrementality** asks: how many extra sales happened **because** of the ads? It needs a **counterfactual**, what would have happened without them, and the cleanest way is an experiment.

### Designs

- **User-level holdout (randomised control trial):** randomly split the target audience; the **control** group is eligible but deliberately not shown the ads (or shown a public-service ad, a "ghost ad" design logs who *would* have seen it). Compare purchase rates.
- **Geo or store tests:** turn in-store screens on in some stores and off in matched stores; compare sales with **difference-in-differences** (change in test minus change in control).
- **Matched market / synthetic control:** build a control from a weighted combination of similar stores or regions when randomisation isn't possible.

### The maths

- Exposed (test) group conversion rate **p<sub>t</sub>**, control **p<sub>c</sub>**; group sizes **n<sub>t</sub>** and **n<sub>c</sub>**.
- **Absolute lift** = p<sub>t</sub> − p<sub>c</sub>. **Relative lift** = (p<sub>t</sub> − p<sub>c</sub>) ÷ p<sub>c</sub>.
- **Incremental conversions** = (p<sub>t</sub> − p<sub>c</sub>) × n<sub>t</sub>. **Incremental sales** = incremental conversions × average order value (or compare sales per user directly).
- **iROAS** = incremental revenue ÷ spend. Often far lower than attributed ROAS, and the honest number.
- **Significance:** for a difference in proportions, standard error SE = √( p<sub>t</sub>(1 − p<sub>t</sub>) ÷ n<sub>t</sub> + p<sub>c</sub>(1 − p<sub>c</sub>) ÷ n<sub>c</sub> ); a 95% interval is (p<sub>t</sub> − p<sub>c</sub>) ± 1.96 × SE. If it includes zero, you can't claim a lift.
- **Power:** small lifts need big groups. Decide sample size **before** the test.

### Worked example

Audience 1,000,000 loyalty shoppers; 90% exposed (900,000), 10% holdout (100,000). Exposed buyers 36,000 (4.0%), control 3,200 (3.2%). Absolute lift 0.8 points; relative lift 25%. Incremental buyers ≈ 0.008 × 900,000 = 7,200. At $12 average basket for the brand, incremental revenue ≈ $86,400. Spend $40,000, so **iROAS ≈ 2.2**. Attributed ROAS might have said 10.8 (36,000 × $12 ÷ $40,000), because it counted everyone exposed who bought.

## Level 4: marketing mix modelling

**MMM** fits a model to weekly or daily aggregated sales against spend by channel (search, social, TV, retail media), price, promotions, seasonality and holidays, with **adstock** (effects that decay over time) and **saturation** (diminishing returns). It needs no user-level data and covers offline channels. Open-source options include Google's **Meridian** and Meta's **Robyn**. Many teams **calibrate** MMM with incrementality tests.

## What measurement systems need from data engineers

- Exact, de-duplicated impression and click logs with invalid traffic removed.
- Reliable joins of exposure to purchases (identity, time windows, store transactions).
- **Randomisation and holdout logging** built into the ad server, recorded as data.
- Reproducible test reads: frozen definitions, versioned SQL, documented exclusions.
- Privacy-safe outputs (aggregation thresholds, clean rooms for brand data).

<div class="callout exercise">

**Exercise (20 minutes).** Exposed: 400,000 users, 9,600 buyers. Control: 100,000 users, 2,000 buyers. Spend $25,000, average brand basket $15. Calculate conversion rates, relative lift, the 95% interval of the absolute lift, incremental revenue and iROAS. Is the lift significant?

</div>

<details class="answer"><summary>Answer</summary>

p<sub>t</sub> = 2.4%, p<sub>c</sub> = 2.0%; absolute lift 0.4 points; relative lift 20%. SE = √(0.024×0.976/400,000 + 0.02×0.98/100,000) ≈ √(5.86e-8 + 1.96e-7) ≈ 0.000505, so the 95% interval is 0.004 ± 0.00099 ≈ [0.30, 0.50] points: significant. Incremental buyers ≈ 0.004 × 400,000 = 1,600; incremental revenue ≈ $24,000; iROAS ≈ 0.96, so the campaign roughly paid back its media cost in incremental sales, while attributed ROAS would have claimed 9,600 × $15 ÷ $25,000 = 5.76.

</details>
