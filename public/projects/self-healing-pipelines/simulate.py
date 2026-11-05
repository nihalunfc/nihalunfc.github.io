"""Monte Carlo comparison: a classic scheduled ETL pipeline vs the same pipeline run by an
agent crew (self-healing triage). All rates are stated assumptions, not measurements from
any company. Change them in ASSUMPTIONS and re-run:  python simulate.py  -> results.json

Author: Nihal Vellaramkallingal Sulaiman (github.com/nihalunfc). Apache-2.0.
"""
import json, math, random, statistics as st
from pathlib import Path

ASSUMPTIONS = {
    "feeds": 15,               # daily source files/exports (shared folders, SFTP, APIs, POS)
    "run_start_h": 5.0,        # nightly run starts 05:00
    "deadline_h": 7.0,         # reports must be fresh by 07:00
    "office": [9.0, 17.0],     # people check the monitor in office hours, Mon-Fri
    "analyst_cost_per_h": 45.0,
    # fault type: daily probability per feed, and how each approach handles it
    "faults": {
        "late_file":     {"p": 0.020, "label": "Late file"},
        "missing_file":  {"p": 0.010, "label": "Missing export (manual step)"},
        "schema_drift":  {"p": 0.004, "label": "Renamed / new column"},
        "duplicate":     {"p": 0.005, "label": "File loaded twice"},
        "partial":       {"p": 0.006, "label": "Partial or empty file"},
        "false_alarm":   {"p": 0.008, "label": "False alarm (check rule)"},
    },
    "code_bug_p_per_day": 0.003,  # our own code/config breaks (whole pipeline)
    # Independent detectors of a bad-but-loadable file (partial / duplicate). Each catches it with
    # chance d_i, independently. Scheduled pipeline: one row-count rule. Crew: four agents look
    # from different angles (file hash, contract, volume vs history, tie-out).
    "detectors": {"classic": [0.75], "crew": [0.6, 0.5, 0.5, 0.5]},
    # Decentralised fail-over: chance a single coordinator/agent instance is down on a night,
    # and how many interchangeable copies of each role can pick up an unclaimed task.
    "instance_down_p": 0.02, "role_copies": 2,
    "crew_fix_success_per_try": 0.6,  # Fixer passes the Verifier on a given try
    "crew_max_tries": 3,
    "approval_wait_min": 20,      # one-click approval in office hours
    "fix_review_min": 20,         # a person reads the crew's patch before merging
    "crew_upkeep_h_per_year": 104, # 2 h a week looking after prompts, rules and the crew itself
    "token_cost": {"triage": 0.001, "fix_try": 0.036, "opus_try": 0.12},
    "years": 300, "seed": 7,
}
A = ASSUMPTIONS
A["silent_share"] = {k: math.prod(1 - d for d in v) for k, v in A["detectors"].items()}
rnd = random.Random(A["seed"])
logn = lambda med, sd=0.5: med * math.exp(rnd.gauss(0, sd))

def next_office(t, dow):
    """Hours from time t (hour since midnight of day `dow`, may run past 24) until a person is at a desk."""
    wait = 0.0
    while True:
        day_h, dd = t % 24, (dow + int(t // 24)) % 7
        if dd < 5 and A["office"][0] <= day_h < A["office"][1]:
            return wait
        step = A["office"][0] - day_h if (dd < 5 and day_h < A["office"][0]) else 24 - day_h + A["office"][0]
        t += step; wait += step

def classic(kind, t0, dow):
    """Returns (hours until data is right, analyst minutes, silent?)"""
    if kind in ("partial", "duplicate") and rnd.random() < A["silent_share"]["classic"]:
        # found when a report reader complains, 1-5 working days later
        found = next_office(t0, dow) + rnd.uniform(24, 120)
        return found + 2, 90 + 60, True
    detect = next_office(t0, dow) + 0.5          # monitor read at start of office hours
    triage = logn(50) / 60                        # finding the cause by hand
    fix = {"late_file": logn(0.4), "missing_file": logn(4), "schema_drift": logn(3),
           "duplicate": logn(1.5), "partial": logn(4), "false_alarm": 0,
           "code_bug": logn(4, .6)}[kind]
    rerun = 0.75 if kind != "false_alarm" else 0  # manual re-run + downstream refresh
    hands = triage * 60 + {"late_file": 15, "missing_file": 30, "schema_drift": 180,
            "duplicate": 90, "partial": 45, "false_alarm": 0, "code_bug": 240}[kind] + rerun * 20
    total = detect + triage + fix + rerun
    if kind == "false_alarm":
        return 0.0, hands, False                 # data was fine, only people's time lost
    return total, hands, False

def crew(kind, t0, dow):
    """Returns (hours until data is right, human minutes, silent?, token $)"""
    tok = A["token_cost"]["triage"]
    if kind in ("partial", "duplicate") and rnd.random() < A["silent_share"]["crew"]:
        found = next_office(t0, dow) + rnd.uniform(24, 120)
        return found + 1, 30, True, tok
    detect = 5 / 60 + 3 / 60                      # sensor + collector + Haiku verdict
    approve = lambda: next_office(t0 + detect, dow) + A["approval_wait_min"] / 60
    if kind == "late_file":                       # tier A: re-run by itself when the file lands
        return detect + logn(0.4) + 0.25, 0, False, tok
    if kind == "duplicate":                       # tier A: idempotent reload on business keys
        return detect + 0.3, 0, False, tok
    if kind == "false_alarm":
        return 0.0, 2, False, tok                 # person skims the verdict
    if kind in ("missing_file", "partial"):       # tier B: drafted note to the owner, one click
        wait = approve() + logn(3)                # owner re-sends; crew re-runs on arrival
        return detect + wait + 0.25, 3, False, tok
    # schema_drift / code_bug: Fixer loop in dev, then one-click merge
    q, tries, t = A["crew_fix_success_per_try"], 0, detect
    for i in range(A["crew_max_tries"]):
        tries += 1
        tok += A["token_cost"]["opus_try" if i == 2 else "fix_try"]
        t += 0.2
        if rnd.random() < q:
            return t + approve() + 0.25, A["fix_review_min"], False, tok
    # crew gives up: person fixes with the full evidence trail (faster than from scratch)
    return t + approve() + logn(2), 120, False, tok

def run():
    days = 365 * A["years"]
    out = {"classic": [], "crew": []}; by_kind = {}
    stale = {"classic": [0.0] * A["years"], "crew": [0.0] * A["years"]}
    hands = {"classic": [0.0] * A["years"], "crew": [0.0] * A["years"]}
    silent = {"classic": [0] * A["years"], "crew": [0] * A["years"]}
    mix = {}; tokens = [0.0] * A["years"]; incidents = [0] * A["years"]; clean_days = 0
    for d in range(days):
        y, dow = d // 365, d % 7
        events = []
        for _ in range(A["feeds"]):
            for k, f in A["faults"].items():
                if rnd.random() < f["p"]:
                    events.append(k)
        if rnd.random() < A["code_bug_p_per_day"]:
            events.append("code_bug")
        if not events:
            clean_days += 1
        for k in events:
            incidents[y] += 1; mix[k] = mix.get(k, 0) + 1
            t0 = A["run_start_h"] + rnd.uniform(0, 1)
            c = classic(k, t0, dow); r = crew(k, t0, dow)
            late_c = max(0.0, t0 + c[0] - A["deadline_h"]) if k != "false_alarm" else 0
            late_r = max(0.0, t0 + r[0] - A["deadline_h"]) if k != "false_alarm" else 0
            stale["classic"][y] += late_c; stale["crew"][y] += late_r
            hands["classic"][y] += c[1] / 60; hands["crew"][y] += r[1] / 60
            silent["classic"][y] += c[2]; silent["crew"][y] += r[2]
            tokens[y] += r[3]
            if k != "false_alarm":
                out["classic"].append(c[0]); out["crew"].append(r[0])
                by_kind.setdefault(k, {"classic": [], "crew": []}); by_kind[k]["classic"].append(c[0]); by_kind[k]["crew"].append(r[0])
    pct = lambda xs, q: sorted(xs)[int(q * (len(xs) - 1))]
    lam = A["feeds"] * sum(f["p"] for f in A["faults"].values()) + A["code_bug_p_per_day"]
    res = {
        "assumptions": A,
        "analytic": {
            "incidents_per_day_lambda": lam,
            "p_clean_day_formula": math.prod([(1 - sum(f["p"] for f in A["faults"].values()))] * A["feeds"]) * (1 - A["code_bug_p_per_day"]),
            "p_clean_by_feeds": [[n, (1 - sum(f["p"] for f in A["faults"].values())) ** n] for n in range(1, 41)],
            "p_silent_by_detectors": [[k, math.prod([1 - 0.5] * k)] for k in range(1, 7)],
            "silent_share": A["silent_share"],
            "p_stall_central": A["instance_down_p"],
            "p_stall_decentral_per_role": A["instance_down_p"] ** A["role_copies"],
            "p_stall_decentral_any_role": 1 - (1 - A["instance_down_p"] ** A["role_copies"]) ** 9,
            "p_fixed_within_k_tries": [[k, 1 - (1 - A["crew_fix_success_per_try"]) ** k] for k in range(1, 6)],
        },
        "simulated": {
            "p_clean_day": clean_days / days,
            "incidents_per_year": st.mean(incidents),
            "stale_report_hours_per_year": {k: st.mean(v) for k, v in stale.items()},
            "people_hours_per_year": {"classic": st.mean(hands["classic"]), "crew": st.mean(hands["crew"]) + A["crew_upkeep_h_per_year"]},
            "people_cost_per_year": {"classic": st.mean(hands["classic"]) * A["analyst_cost_per_h"], "crew": (st.mean(hands["crew"]) + A["crew_upkeep_h_per_year"]) * A["analyst_cost_per_h"]},
            "incident_mix_per_year": {k: v / A["years"] for k, v in mix.items()},
            "token_cost_per_year": st.mean(tokens),
            "silent_errors_per_year": {k: st.mean(v) for k, v in silent.items()},
            "time_to_fix_hours": {k: {"p50": pct(v, .5), "p90": pct(v, .9), "p99": pct(v, .99)} for k, v in out.items()},
            "median_hours_by_fault": {k: {m: pct(v[m], .5) for m in v} for k, v in by_kind.items()},
            "cdf": {k: [[h, sum(1 for x in v if x <= h) / len(v)] for h in [round(0.25 * 1.2 ** i, 3) for i in range(37)]] for k, v in out.items()},
        },
    }
    Path(__file__).with_name("results.json").write_text(json.dumps(res, indent=1))
    s = res["simulated"]
    print(json.dumps({k: s[k] for k in s if k != "cdf"}, indent=1))
    print("analytic P(clean)", res["analytic"]["p_clean_day_formula"], "lambda", lam)

if __name__ == "__main__":
    run()
