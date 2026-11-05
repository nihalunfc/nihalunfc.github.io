"""
Doomsday 2026, re-examined.

A reproduction and out-of-sample test of
  von Foerster, H., Mora, P. M. & Amiot, L. W. (1960).
  "Doomsday: Friday, 13 November, A.D. 2026." Science 132(3436), 1291-1295.
  https://doi.org/10.1126/science.132.3436.1291

Author: Nihal Vellaramkallingal Sulaiman (nihalsulaiman.com)
Licence: MIT (code). Data keep their own licences (see README.md).

Run:
    pip install -r requirements.txt
    python doomsday.py            # uses the CSV files in ./data
    python doomsday.py --download # re-downloads both datasets first

Outputs go to ./figures (SVG + PDF + PNG) and ./results (JSON + CSV).
Every number quoted in the article is printed by this script.
"""

from __future__ import annotations

import argparse
import json
import urllib.request
from datetime import date, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.optimize import curve_fit

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
FIG = HERE / "figures"
RES = HERE / "results"

COHEN_URL = (
    "https://raw.githubusercontent.com/datasets/population-global-historical/"
    "main/data/population.csv"
)
WB_URL = (
    "https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL"
    "?format=json&per_page=200"
)

# The published 1960 fit (von Foerster et al. 1960, eqs. 10a-10c and 11).
PAPER = {"K": 1.79e11, "K_se": 0.14e11, "k": 0.990, "k_se": 0.009,
         "t0": 2026.87, "t0_se": 5.50}

SEED = 20261113  # fixed, so every run gives the same Monte Carlo numbers

# Colours (validated categorical slots) and ink.
C_DATA = "#52514e"   # observations: neutral ink
C_PAPER = "#2a78d6"  # the 1960 model: blue
C_REFIT = "#eb6834"  # our refits: orange
C_ALT = "#1baf7a"    # alternative model: aqua
INK, MUTED, GRID = "#0b0b0b", "#6f6e69", "#e6e5e0"


# --------------------------------------------------------------------- data

def download() -> None:
    """Fetch fresh copies of both datasets into ./data."""
    DATA.mkdir(exist_ok=True)
    print("Downloading Cohen (1996) compilation ...")
    urllib.request.urlretrieve(COHEN_URL, DATA / "cohen1996_historical_estimates.csv")
    print("Downloading World Bank SP.POP.TOTL (World) ...")
    with urllib.request.urlopen(WB_URL) as r:
        payload = json.load(r)
    rows = [("World", "WLD", int(d["date"]), int(d["value"]))
            for d in payload[1] if d["value"] is not None]
    pd.DataFrame(sorted(rows, key=lambda x: x[2]),
                 columns=["Country Name", "Country Code", "Year", "Value"]
                 ).to_csv(DATA / "worldbank_SP.POP.TOTL_WLD.csv", index=False)


def load_historical() -> pd.DataFrame:
    """Every individual pre-1960 estimate in Cohen (1996), long format.

    We drop Cohen's 'Average' column (it is derived, not an estimate) and keep
    the same window as the 1960 paper: from t = 1 (the time of Christ) up to
    but not including 1958 (note 9 of the paper excludes 1958).
    """
    df = pd.read_csv(DATA / "cohen1996_historical_estimates.csv")
    long = df.drop(columns=["Average"]).melt(
        id_vars="Year", var_name="source", value_name="pop_millions").dropna()
    long = long[(long.Year >= 1) & (long.Year < 1958)].copy()
    long["N"] = long.pop_millions * 1e6
    return long.sort_values(["Year", "source"]).reset_index(drop=True)


def load_worldbank() -> pd.DataFrame:
    df = pd.read_csv(DATA / "worldbank_SP.POP.TOTL_WLD.csv")
    df = df.rename(columns={"Value": "N"})[["Year", "N"]]
    return df.sort_values("Year").reset_index(drop=True)


# -------------------------------------------------------------------- model

def hyperbolic(t, K, k, t0):
    """N(t) = K / (t0 - t)^k, the 1960 'doomsday' law (eq. 11)."""
    return K / np.power(t0 - t, k)


def log_hyperbolic(t, logK, k, t0):
    return logK - k * np.log(t0 - t)


def fit_hyperbolic(t, N, p0=(np.log(1.79e11), 1.0, 2027.0)):
    """Least squares on ln N, so every point counts by its relative error."""
    lo = (-np.inf, 0.1, t.max() + 1e-3)
    hi = (np.inf, 5.0, 1e6)
    p, cov = curve_fit(log_hyperbolic, t, np.log(N), p0=p0,
                       bounds=(lo, hi), maxfev=200000)
    resid = np.log(N) - log_hyperbolic(t, *p)
    return {"K": float(np.exp(p[0])), "k": float(p[1]), "t0": float(p[2]),
            "se": [float(s) for s in np.sqrt(np.diag(cov))],
            "rms_rel": float(np.sqrt(np.mean(resid ** 2)))}


def logistic(t, L, r, tm):
    """Verhulst logistic: carrying capacity L, rate r, midpoint year tm."""
    return L / (1.0 + np.exp(-r * (t - tm)))


def year_to_date(y: float) -> date:
    """Turn a decimal year such as 2026.87 into a calendar date."""
    yr = int(np.floor(y))
    start = date(yr, 1, 1)
    days = (date(yr + 1, 1, 1) - start).days
    return start + timedelta(days=(y - yr) * days)


# ------------------------------------------------------------------ figures

def style(ax, title=None):
    ax.set_facecolor("white")
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for s in ("left", "bottom"):
        ax.spines[s].set_color(MUTED)
    ax.tick_params(colors=MUTED, labelsize=9)
    ax.grid(True, color=GRID, linewidth=0.8)
    ax.set_axisbelow(True)
    if title:
        ax.set_title(title, loc="left", fontsize=11, color=INK, pad=10)


def save(fig, name):
    FIG.mkdir(exist_ok=True)
    fig.tight_layout()
    for ext in ("svg", "pdf", "png"):
        fig.savefig(FIG / f"{name}.{ext}", dpi=200, facecolor="white")
    plt.close(fig)


def billions(x, _=None):
    return f"{x/1e9:g} bn"


# --------------------------------------------------------------------- main

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--download", action="store_true",
                    help="re-download both datasets before running")
    args = ap.parse_args()
    if args.download:
        download()

    RES.mkdir(exist_ok=True)
    plt.rcParams.update({"font.family": "DejaVu Sans", "svg.fonttype": "none"})
    rng = np.random.default_rng(SEED)
    out: dict = {}

    hist = load_historical()
    wb = load_worldbank()
    t_h, N_h = hist.Year.to_numpy(float), hist.N.to_numpy(float)
    t_w, N_w = wb.Year.to_numpy(float), wb.N.to_numpy(float)
    last_year = int(t_w.max())

    print(f"Historical estimates: {len(hist)} points from "
          f"{hist.source.nunique()} sources, years {int(t_h.min())}-{int(t_h.max())}")
    print(f"World Bank series: {len(wb)} years, {int(t_w.min())}-{last_year}")
    out["data"] = {"historical_points": int(len(hist)),
                   "historical_sources": sorted(hist.source.unique().tolist()),
                   "wb_first": int(t_w.min()), "wb_last": last_year}

    # ---- Step 1. The date itself.
    d = year_to_date(PAPER["t0"])
    lo, hi = PAPER["t0"] - PAPER["t0_se"], PAPER["t0"] + PAPER["t0_se"]
    print(f"\n[1] t0 = {PAPER['t0']} -> {d:%A %d %B %Y}"
          f" (±1 s.e.: {lo:.2f} to {hi:.2f})")
    out["step1_date"] = {"t0": PAPER["t0"], "date": d.isoformat(),
                         "weekday": f"{d:%A}", "se_range": [lo, hi]}

    # ---- Step 2. Does the 1960 law describe the pre-1960 data?
    paper_h = hyperbolic(t_h, PAPER["K"], PAPER["k"], PAPER["t0"])
    rel = np.log(N_h / paper_h)
    rms_paper_hist = float(np.sqrt(np.mean(rel ** 2)))
    print(f"[2] 1960 law vs {len(hist)} pre-1958 estimates: "
          f"RMS log error {rms_paper_hist:.3f} (~{100*rms_paper_hist:.0f}%)")
    post1500 = t_h >= 1500
    rms_paper_1500 = float(np.sqrt(np.mean(rel[post1500] ** 2)))
    print(f"    same, 1500-1955 only: {rms_paper_1500:.3f}")
    out["step2_paper_in_sample"] = {"rms_log_all": rms_paper_hist,
                                    "rms_log_1500_1955": rms_paper_1500}

    # ---- Step 3. Refit the same law to the pre-1958 estimates.
    refit = fit_hyperbolic(t_h, N_h)
    print(f"[3] Our refit on pre-1958 data: K={refit['K']:.3e}, "
          f"k={refit['k']:.3f}, t0={refit['t0']:.2f} "
          f"(s.e. {refit['se'][2]:.2f}), RMS log {refit['rms_rel']:.3f}")
    print(f"    -> refit doomsday {year_to_date(refit['t0']):%d %B %Y}")
    # Bootstrap: resample the estimates with replacement.
    boots = []
    for _ in range(2000):
        idx = rng.integers(0, len(t_h), len(t_h))
        try:
            boots.append(fit_hyperbolic(t_h[idx], N_h[idx])["t0"])
        except RuntimeError:
            pass
    boots = np.array(boots)
    ci = np.percentile(boots, [2.5, 50, 97.5])
    print(f"    bootstrap t0 (2000 resamples): median {ci[1]:.1f}, "
          f"95% interval {ci[0]:.1f} to {ci[2]:.1f}")
    out["step3_refit_pre1958"] = {**refit, "bootstrap_t0_ci95": ci.tolist()}

    # Same refit restricted to 1500-1955, where estimates are less uncertain.
    m = t_h >= 1500
    refit1500 = fit_hyperbolic(t_h[m], N_h[m])
    print(f"    refit on 1500-1955 only: k={refit1500['k']:.3f}, "
          f"t0={refit1500['t0']:.2f}")
    out["step3_refit_1500_1955"] = refit1500

    # ---- Step 4. Out-of-sample: the 1960 law vs 1960-latest observations.
    pred_w = hyperbolic(t_w, PAPER["K"], PAPER["k"], PAPER["t0"])
    ratio = pred_w / N_w
    tab = pd.DataFrame({"Year": t_w.astype(int), "observed": N_w,
                        "predicted_1960_law": pred_w, "ratio": ratio})
    tab.to_csv(RES / "prediction_vs_observed.csv", index=False)
    first_7 = int(tab.Year[ratio > 1.07].min())          # overshoot beyond the paper's 7%
    cross = int(tab.Year[ratio >= 1].min())              # law catches up with reality
    first_2x = int(tab.Year[ratio > 2].min())
    first_10x = int(tab.Year[ratio > 10].min()) if (ratio > 10).any() else None
    print(f"[4] Out of sample (1960 law vs World Bank):")
    for y in (1960, 1970, 1980, 1990, 2000, 2010, 2020, last_year):
        r = tab[tab.Year == y].iloc[0]
        print(f"    {y}: observed {r.observed/1e9:6.2f} bn, "
              f"1960 law {r.predicted_1960_law/1e9:8.2f} bn, ratio {r.ratio:6.2f}")
    print(f"    law first matches reality in {cross}; overshoots by more than the paper's own 7% from {first_7}; "
          f"prediction is double reality from {first_2x}"
          + (f"; ten times reality from {first_10x}" if first_10x else ""))
    out["step4_out_of_sample"] = {
        "first_year_law_ge_observed": cross, "first_year_overshoot_gt_7pct": first_7, "first_year_ratio_gt_2": first_2x,
        "first_year_ratio_gt_10": first_10x,
        "table": {int(y): [float(o), float(p)] for y, o, p in
                  zip(tab.Year, tab.observed, tab.predicted_1960_law)
                  if y in (1960, 1970, 1980, 1990, 2000, 2010, 2020, last_year)}}

    # ---- Step 5. Monte Carlo over the paper's own parameter uncertainty.
    n_mc = 20000
    Ks = rng.normal(PAPER["K"], PAPER["K_se"], n_mc)
    ks = rng.normal(PAPER["k"], PAPER["k_se"], n_mc)
    t0s = rng.normal(PAPER["t0"], PAPER["t0_se"], n_mc)
    target = float(last_year)
    alive = t0s > target  # draws whose singularity is still in the future
    pred_last = np.where(alive, Ks / np.power(np.clip(t0s - target, 1e-9, None), ks), np.inf)
    obs_last = float(N_w[-1])
    share_below = float(np.mean(pred_last <= obs_last * 1.07))
    share_past = float(np.mean(~alive))
    pct = np.percentile(pred_last[alive], [5, 50, 95])
    print(f"[5] Monte Carlo, {n_mc} draws from the paper's ± values:")
    print(f"    {100*share_past:.1f}% of draws put doomsday before {last_year} "
          f"(already 'happened')")
    print(f"    of the rest, {last_year} population 5-50-95%: "
          f"{pct[0]/1e9:.1f} / {pct[1]/1e9:.1f} / {pct[2]/1e9:.0f} bn "
          f"vs observed {obs_last/1e9:.2f} bn")
    print(f"    draws within 7% of reality or below it: {100*share_below:.2f}%")
    out["step5_monte_carlo"] = {"draws": n_mc, "seed": SEED,
                                "share_doomsday_already_past": share_past,
                                "pred_last_pct_5_50_95": pct.tolist(),
                                "share_draws_at_or_below_obs_plus7pct": share_below}

    # Fan for figure: percentile bands per year.
    years_fan = np.arange(1960, last_year + 1)
    fan = []
    for y in years_fan:
        tau = t0s - y
        # draws whose doomsday has passed are 'infinite'; cap them for plotting
        v = np.where(tau > 0, Ks / np.power(np.clip(tau, 1e-9, None), ks), 1e15)
        fan.append(np.percentile(v, [5, 25, 50, 75, 95]))
    fan = np.array(fan)

    # ---- Step 6. Growth rate: the test that does not depend on any fit.
    # The 1960 law implies r(t) = d ln N / dt = k / (t0 - t), ever rising.
    r_obs = np.diff(np.log(N_w))
    t_mid = t_w[1:]
    r_model = PAPER["k"] / (PAPER["t0"] - t_mid)
    peak_i = int(np.argmax(r_obs))
    print(f"[6] Observed growth peaked at {100*r_obs[peak_i]:.2f}%/yr in "
          f"{int(t_mid[peak_i])}; {last_year}: {100*r_obs[-1]:.2f}%/yr. "
          f"The 1960 law requires {100*r_model[-1]:.1f}%/yr in {last_year}.")
    out["step6_growth"] = {"peak_rate": float(r_obs[peak_i]),
                           "peak_year": int(t_mid[peak_i]),
                           "last_rate": float(r_obs[-1]),
                           "model_rate_last": float(r_model[-1])}

    # ---- Step 7. Moving doomsday: refit with data up to year Y.
    rows = []
    for Y in range(1960, last_year + 1, 5):
        mask = t_w <= Y
        tt = np.concatenate([t_h, t_w[mask]])
        NN = np.concatenate([N_h, N_w[mask]])
        f = fit_hyperbolic(tt, NN)
        rows.append({"data_until": Y, "t0": f["t0"], "k": f["k"],
                     "rms_log": f["rms_rel"]})
    moving = pd.DataFrame(rows)
    moving.to_csv(RES / "moving_doomsday.csv", index=False)
    print("[7] Refit with data up to year Y (pre-1958 estimates + World Bank):")
    for _, r in moving.iterrows():
        print(f"    up to {int(r.data_until)}: t0 = {r.t0:9.1f}, k = {r.k:.3f},"
              f" RMS log {r.rms_log:.3f}")
    out["step7_moving_doomsday"] = moving.to_dict(orient="records")

    # ---- Step 8. A model that does describe 1960-latest: the logistic.
    p_log, cov_log = curve_fit(logistic, t_w, N_w,
                               p0=(1.1e10, 0.03, 1990), maxfev=200000)
    se_log = np.sqrt(np.diag(cov_log))
    rms_logistic = float(np.sqrt(np.mean(np.log(N_w / logistic(t_w, *p_log)) ** 2)))
    print(f"[8] Logistic fit to World Bank 1960-{last_year}: "
          f"L = {p_log[0]/1e9:.2f} ± {se_log[0]/1e9:.2f} bn, r = {p_log[1]:.4f}, "
          f"midpoint {p_log[2]:.1f}, RMS log {rms_logistic:.4f}")
    out["step8_logistic"] = {"L": float(p_log[0]), "L_se": float(se_log[0]),
                             "r": float(p_log[1]), "tm": float(p_log[2]),
                             "rms_log": rms_logistic}

    (RES / "results.json").write_text(json.dumps(out, indent=2, default=str))

    # ================================================================ figures
    # Fig 1: the paper's world - estimates and the 1960 law, linear time.
    fig, ax = plt.subplots(figsize=(8, 4.6))
    style(ax, "Fig. 1  The evidence in 1960 and the law fitted to it")
    ax.scatter(t_h, N_h, s=22, color=C_DATA, alpha=0.75, zorder=3,
               label=f"Historical estimates, AD 1-1955 (n = {len(hist)})",
               edgecolor="white", linewidth=0.6)
    tt = np.linspace(1, 1958, 800)
    ax.plot(tt, hyperbolic(tt, PAPER["K"], PAPER["k"], PAPER["t0"]),
            color=C_PAPER, lw=2, label="von Foerster et al. (1960): N = 1.79×10¹¹ / (2026.87 − t)^0.99")
    ax.set_yscale("log")
    ax.set_xlabel("Year (AD)", color=MUTED)
    ax.set_ylabel("World population", color=MUTED)
    ax.yaxis.set_major_formatter(billions)
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    save(fig, "fig1_paper_fit")

    # Fig 2: log-log against dooms-time, the paper's own view.
    fig, ax = plt.subplots(figsize=(8, 4.6))
    style(ax, "Fig. 2  Why it looked convincing: a straight line in dooms-time")
    tau_h = PAPER["t0"] - t_h
    ax.scatter(tau_h, N_h, s=22, color=C_DATA, alpha=0.75, zorder=3,
               edgecolor="white", linewidth=0.6, label="Historical estimates (before 1958)")
    tau_w = PAPER["t0"] - t_w
    ax.scatter(tau_w, N_w, s=16, color=C_REFIT, zorder=4, edgecolor="white",
               linewidth=0.5, label=f"World Bank, 1960-{last_year}")
    taus = np.logspace(np.log10(1.5), np.log10(2100), 300)
    ax.plot(taus, PAPER["K"] / taus ** PAPER["k"], color=C_PAPER, lw=2,
            label="1960 law (slope −0.99)")
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.invert_xaxis()
    ax.set_xlabel("Dooms-time τ = 2026.87 − t  (years left, log scale)", color=MUTED)
    ax.set_ylabel("World population", color=MUTED)
    ax.yaxis.set_major_formatter(billions)
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    save(fig, "fig2_doomstime_loglog")

    # Fig 3: out-of-sample, with Monte Carlo fan.
    fig, ax = plt.subplots(figsize=(8, 4.6))
    style(ax, f"Fig. 3  The prediction against what happened, 1960-{last_year}")
    ax.fill_between(years_fan, fan[:, 0], fan[:, 4], color=C_PAPER, alpha=0.12,
                    lw=0, label="1960 law, 5-95% band from its own ± values")
    ax.fill_between(years_fan, fan[:, 1], fan[:, 3], color=C_PAPER, alpha=0.22,
                    lw=0, label="25-75% band")
    ax.plot(t_w, pred_w, color=C_PAPER, lw=2, label="1960 law, central values")
    ax.plot(t_w, N_w, color=C_DATA, lw=2.4, label="Observed (World Bank SP.POP.TOTL)")
    ax.set_yscale("log")
    ax.set_ylim(2.5e9, 2e11)
    ax.yaxis.set_major_formatter(billions)
    ax.set_xlabel("Year", color=MUTED); ax.set_ylabel("World population", color=MUTED)
    r_last = tab.iloc[-1]
    ax.annotate(f"{last_year}: law says {r_last.predicted_1960_law/1e9:.0f} bn,\n"
                f"Earth has {r_last.observed/1e9:.2f} bn",
                xy=(last_year, r_last.predicted_1960_law), xytext=(1972, 2.0e10),
                fontsize=9, color=INK,
                arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.8))
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    save(fig, "fig3_out_of_sample")

    # Fig 4: growth rate vs population.
    fig, ax = plt.subplots(figsize=(8, 4.6))
    style(ax, "Fig. 4  The decisive test: growth rate against population")
    NN = np.linspace(2.5e9, 1.2e10, 300)
    tau_N = (PAPER["K"] / NN) ** (1 / PAPER["k"])
    ax.plot(NN, 100 * PAPER["k"] / tau_N, color=C_PAPER, lw=2,
            label="1960 law: growth must rise as population rises")
    ax.plot(N_w[1:], 100 * r_obs, color=C_DATA, lw=2.2,
            label="Observed annual growth, 1961-" + str(last_year))
    ax.scatter([N_w[1:][peak_i]], [100 * r_obs[peak_i]], color=C_DATA, s=36, zorder=4)
    ax.annotate(f"Peak {100*r_obs[peak_i]:.1f}% in {int(t_mid[peak_i])}",
                xy=(N_w[1:][peak_i], 100 * r_obs[peak_i]),
                xytext=(N_w[1:][peak_i] + 4e8, 100 * r_obs[peak_i] + 0.9),
                fontsize=9, color=INK,
                arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.8))
    ax.annotate(f"{last_year}: {100*r_obs[-1]:.2f}%",
                xy=(N_w[-1], 100 * r_obs[-1]), xytext=(N_w[-1] + 1.0e9, 100 * r_obs[-1] + 0.9),
                fontsize=9, color=INK,
                arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.8))
    ax.set_ylim(0, 6)
    ax.xaxis.set_major_formatter(billions)
    ax.set_xlabel("World population", color=MUTED)
    ax.set_ylabel("Growth rate (% per year)", color=MUTED)
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    save(fig, "fig4_growth_rate")

    # Fig 5: the moving doomsday.
    fig, ax = plt.subplots(figsize=(8, 4.6))
    style(ax, "Fig. 5  Refit the same law each year and doomsday runs away")
    ax.plot(moving.data_until, moving.t0, color=C_REFIT, lw=2, marker="o", ms=5,
            label="Fitted doomsday t₀ using data up to that year")
    ax.plot(moving.data_until, moving.data_until, color=MUTED, lw=1, ls="--",
            label="The year of the fit")
    ax.axhline(PAPER["t0"], color=C_PAPER, lw=1.4, label="1960 answer: 2026.87")
    ax.set_xlabel("Data used up to year", color=MUTED)
    ax.set_ylabel("Fitted doomsday year t₀", color=MUTED)
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    save(fig, "fig5_moving_doomsday")

    # Fig 6: a model that works for 1960-latest.
    fig, ax = plt.subplots(figsize=(8, 4.6))
    style(ax, "Fig. 6  After 1960, population bends: a logistic fits, a hyperbola cannot")
    tt = np.arange(1960, 2101)
    ax.plot(t_w, N_w, color=C_DATA, lw=2.6, label="Observed (World Bank)")
    ax.plot(tt, logistic(tt, *p_log), color=C_ALT, lw=2,
            label=f"Logistic fit to 1960-{last_year} (ceiling {p_log[0]/1e9:.1f} bn)")
    tt2 = np.arange(1960, 2026)
    ax.plot(tt2, hyperbolic(tt2, PAPER["K"], PAPER["k"], PAPER["t0"]),
            color=C_PAPER, lw=2, label="1960 law")
    ax.set_ylim(0, 2.0e10)
    ax.yaxis.set_major_formatter(billions)
    ax.set_xlabel("Year", color=MUTED); ax.set_ylabel("World population", color=MUTED)
    ax.legend(frameon=False, fontsize=8.5, loc="upper left")
    save(fig, "fig6_logistic")

    print(f"\nFigures written to {FIG.relative_to(HERE)}/, results to {RES.relative_to(HERE)}/")


if __name__ == "__main__":
    main()
