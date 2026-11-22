"""
Charts for the Canadian ER wait-time bottleneck study.

Reads the tidy CSVs in ../data and writes PNG figures to ../figures.
Run simulate.py first (it writes ../data/simulation_results.csv).

    pip install pandas matplotlib
    python simulate.py
    python analysis.py
"""
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
FIG = os.path.join(HERE, "..", "figures")
os.makedirs(FIG, exist_ok=True)

INK = "#111827"
MUTED = "#6b7280"
GRID = "#e5e7eb"
BASE = "#b6bcc6"      # every other bar
ACCENT = "#2563eb"    # Canada / baseline: the thing the chart is about
ACCENT2 = "#c2410c"   # India (second highlighted entity)
GOOD = "#15803d"

plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 10.5, "text.color": INK,
    "axes.edgecolor": GRID, "axes.labelcolor": MUTED, "xtick.color": MUTED, "ytick.color": MUTED,
    "axes.spines.top": False, "axes.spines.right": False, "axes.grid": True, "grid.color": GRID,
    "grid.linewidth": 0.8, "axes.axisbelow": True, "figure.dpi": 150, "savefig.bbox": "tight",
    "savefig.facecolor": "white",
})


def save(fig, name):
    fig.savefig(os.path.join(FIG, name), dpi=150)
    plt.close(fig)
    print("wrote", name)


def title(ax, t, sub=None):
    ax.set_title(t, loc="left", fontsize=12.5, fontweight="bold", color=INK, pad=22 if sub else 8)
    if sub:
        ax.text(0, 1.02, sub, transform=ax.transAxes, fontsize=9.5, color=MUTED, va="bottom")


def source(fig, text, y=-0.02):
    fig.text(0.01, y, "Source: " + text, fontsize=8, color=MUTED, ha="left", va="top")


# 1. Canada has cut hospital beds per person by more than half since 1990
beds = pd.read_csv(os.path.join(DATA, "canada_beds_per_1000_worldbank.csv"))
fig, ax = plt.subplots(figsize=(8, 4.2))
ax.plot(beds.year, beds.beds_per_1000, color=ACCENT, lw=2.2)
ax.scatter([beds.year.iloc[0], beds.year.iloc[-1]], [beds.beds_per_1000.iloc[0], beds.beds_per_1000.iloc[-1]],
           color=ACCENT, s=36, zorder=3, edgecolor="white", linewidth=1.5)
ax.annotate("6.0 beds per 1,000 (1990)", (1990, 6.0), xytext=(8, 0), textcoords="offset points", va="center", fontsize=9.5)
ax.annotate("2.54 (2022)", (2022, 2.54), xytext=(0, 10), textcoords="offset points", ha="right", fontsize=9.5)
ax.set_ylim(0, 6.6)
ax.set_xlim(1989, 2023.5)
ax.set_ylabel("Hospital beds per 1,000 people")
ax.grid(axis="x", visible=False)
title(ax, "Canada now has 58% fewer hospital beds per person than in 1990",
      "Most of the cut came in the 1990s, as care moved out of hospital. Since 2008 it has stayed near 2.5.")
source(fig, "World Bank SH.MED.BEDS.ZS (OECD data). 1994 not reported.")
save(fig, "fig1-canada-beds-1990-2022.png")

# 2. Peers: beds, nurses, spending, out-of-pocket share
peer = pd.read_csv(os.path.join(DATA, "peer_capacity_worldbank.csv"))
panels = [
    ("Hospital beds per 1000", "Hospital beds per 1,000", "{:.1f}"),
    ("Nurses and midwives per 1000", "Nurses and midwives per 1,000", "{:.1f}"),
    ("Health spending per capita (PPP intl $)", "Health spending per person (PPP $)", "${:,.0f}"),
    ("Out-of-pocket share of health spending (%)", "Paid out of pocket (% of health spending)", "{:.0f}%"),
]
fig, axes = plt.subplots(2, 2, figsize=(10, 7.2))
for ax, (ind, label, fmt) in zip(axes.flat, panels):
    d = peer[peer.indicator == ind].sort_values("value")
    colors = [ACCENT if c == "CAN" else ACCENT2 if c == "IND" else BASE for c in d.country_code]
    ax.barh(d.country, d.value, color=colors, height=0.66, edgecolor="white", linewidth=2)
    for y, (v, yr) in enumerate(zip(d.value, d.year)):
        ax.text(v, y, "  " + fmt.format(v) + f" ({yr})", va="center", fontsize=8.5, color=INK)
    ax.set_xlim(0, d.value.max() * 1.42)
    ax.grid(axis="y", visible=False)
    ax.set_title(label, loc="left", fontsize=10.5, fontweight="bold", color=INK)
    ax.tick_params(axis="y", labelsize=9)
    if "PPP" in ind:
        ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda x, _: f"${x/1000:.0f}k"))
fig.suptitle("Canada spends like its peers and has nurses like its peers, but has few beds",
             x=0.01, ha="left", fontsize=13, fontweight="bold", color=INK)
fig.text(0.01, 0.935, "Canada in blue, India in orange. India spends about 1/22 as much per person, and patients pay 44% themselves.",
         fontsize=9.5, color=MUTED)
fig.tight_layout(rect=(0, 0, 1, 0.93))
source(fig, "World Bank World Development Indicators (latest year per country shown in brackets).")
save(fig, "fig2-peer-capacity.png")

# 3. Why 91% occupancy is so much worse than 71%: the queueing curve
rho = np.linspace(0.5, 0.97, 300)
mult = rho / (1 - rho)
fig, ax = plt.subplots(figsize=(8, 4.4))
ax.plot(rho * 100, mult, color=MUTED, lw=2)
for occ, lab, col in [(71, "OECD average 71%", BASE), (85, "85% safe-operating rule", GOOD), (91, "Canada 91%", ACCENT)]:
    m = (occ / 100) / (1 - occ / 100)
    ax.scatter([occ], [m], color=col if col != BASE else MUTED, s=60, zorder=3, edgecolor="white", linewidth=1.5)
    ax.annotate(f"{lab}\nwait factor {m:.1f}", (occ, m), xytext=(-10, 14), textcoords="offset points",
                ha="right", fontsize=9, color=INK)
ax.set_xlabel("Bed occupancy (%)")
ax.set_ylabel("Relative queueing delay  (ρ / (1 − ρ))")
ax.set_xlim(50, 97.5)
ax.set_ylim(0, 33)
title(ax, "Running beds at 91% makes queues 4x longer than at 71%",
      "Delay grows slowly, then explodes near 100%. Every point of occupancy above 85% costs more than the last.")
source(fig, "Single-server queueing rule of thumb; occupancy from OECD Health at a Glance 2025 via CIHI.")
save(fig, "fig3-occupancy-queueing-curve.png")

# 4. Niagara: where the admitted patient's time goes
fig, ax = plt.subplots(figsize=(8.6, 3.2))
rows = [("2024-25", 16.5, 64.8), ("Latest (2025-26)", 15.3, 56.4)]
for i, (lab, dec, bed) in enumerate(rows):
    ax.barh(i, dec, color=BASE, height=0.5, edgecolor="white", linewidth=2)
    ax.barh(i, bed, left=dec, color=ACCENT, height=0.5, edgecolor="white", linewidth=2)
    ax.text(dec - 0.6, i, f"{dec} h", ha="right", va="center", fontsize=9, color=INK)
    ax.text(dec + bed / 2, i, f"{bed} h waiting for a bed", ha="center", va="center", fontsize=9, color="white")
ax.axvline(8, color=GOOD, lw=1.5, ls="--")
ax.text(8.6, 1.42, "Ontario target: 8 h in ED in total", color=GOOD, fontsize=8.5)
ax.set_yticks([0, 1], [r[0] for r in rows])
ax.set_xlabel("Hours")
ax.set_ylim(-0.6, 1.7)
ax.grid(axis="y", visible=False)
title(ax, "At Niagara Health, admitted patients wait about 2.5 days for a bed",
      "Grey: assessment until decision to admit (90th percentile). Blue: average wait for an inpatient bed after that.")
source(fig, "Niagara Health, 'Setting the record straight on ED wait times', May 2026. The two parts use different statistics.", y=-0.08)
save(fig, "fig4-niagara-admitted-timeline.png")

# 5. Specialist waits by province (Fraser Institute)
fr = pd.read_csv(os.path.join(DATA, "fraser_wait_weeks_by_province.csv"))
prov = fr[fr.province != "Canada"].sort_values("median_weeks_2026")
canada = fr[fr.province == "Canada"].median_weeks_2026.iloc[0]
fig, ax = plt.subplots(figsize=(8, 5))
colors = [ACCENT if p == "Ontario" else BASE for p in prov.province]
ax.barh(prov.province, prov.median_weeks_2026, color=colors, height=0.66, edgecolor="white", linewidth=2)
for y, v in enumerate(prov.median_weeks_2026):
    ax.text(v, y, f"  {v}", va="center", fontsize=9)
ax.axvline(canada, color=INK, lw=1.2, ls=":")
ax.text(canada + 0.6, len(prov) - 0.45, f"Canada {canada} wk (1993: 9.3 wk)", fontsize=9)
ax.set_xlabel("Median weeks from GP referral to treatment, 2026")
ax.grid(axis="y", visible=False)
ax.set_xlim(0, 75)
title(ax, "Specialist care: a record 30.7-week median wait in 2026",
      "Ontario is shortest at 22.1 weeks; New Brunswick waits 64.4 weeks.")
source(fig, "Fraser Institute, Waiting Your Turn 2026 (physician survey, 12 specialties).")
save(fig, "fig5-specialist-waits-by-province.png")

# 6. Simulation: which lever fixes the 8-hour wait?
sim = pd.read_csv(os.path.join(DATA, "simulation_results.csv"))
order = sim.sort_values("low_urgency_wait_md_p90_h", ascending=True)
fig, axes = plt.subplots(1, 2, figsize=(11, 4.8), sharey=True)
for ax, col, lab in [(axes[0], "low_urgency_wait_md_p90_h", "Low-urgency wait to see a doctor\n(90th percentile, hours)"),
                     (axes[1], "admitted_ed_los_p90_h", "Admitted patients' time in the ED\n(90th percentile, hours)")]:
    colors = [ACCENT if s == "Baseline" else BASE for s in order.scenario]
    ax.barh(order.scenario, order[col], color=colors, height=0.66, edgecolor="white", linewidth=2)
    for y, v in enumerate(order[col]):
        ax.text(v, y, f"  {v:.1f}", va="center", fontsize=9)
    ax.set_title(lab, loc="left", fontsize=10.5, fontweight="bold", color=INK)
    ax.grid(axis="y", visible=False)
    ax.set_xlim(0, order[col].max() * 1.25)
axes[0].tick_params(axis="y", labelsize=9.5)
fig.suptitle("Simulation: freeing beds beats adding ER doctors", x=0.01, ha="left",
             fontsize=13, fontweight="bold", color=INK)
fig.text(0.01, 0.905, "One mid-sized hospital, 165 ED visits a day, 1 simulated year x 5 seeds per scenario. Baseline in blue.",
         fontsize=9.5, color=MUTED)
fig.tight_layout(rect=(0, 0, 1, 0.9))
source(fig, "Own discrete-event simulation (simulate.py), calibrated to CIHI and Ontario Health aggregates.")
save(fig, "fig6-simulation-scenarios.png")

# A compact summary the write-up quotes
b = sim.set_index("scenario")
print(b[["low_urgency_wait_md_p90_h", "admitted_ed_los_p90_h", "boarding_p90_h",
         "left_without_being_seen_pct", "bed_occupancy_pct", "alc_share_of_bed_days_pct",
         "electives_postponed_per_week"]].to_string())
