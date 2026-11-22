"""
Emergency department + inpatient ward flow simulation.

A stylised discrete-event model of one mid-sized Canadian community hospital,
calibrated to public aggregates (CIHI, Ontario Health, Niagara Health), NOT to
any hospital's patient-level data. It answers one operations question:
which lever cuts the low-urgency wait (the 8-hour wait) the most?

Flow:  arrive -> wait for an ED treatment space -> wait for a physician
       -> work-up -> discharged home (88%)  or  admitted (12%)
       admitted -> board in the ED space until an inpatient bed is free
       inpatient -> acute stay (+ ALC days for some) -> discharged only
       inside the discharge window -> bed cleaned -> bed free

Run:  python simulate.py            (writes ../data/simulation_results.csv)
Only the Python standard library is needed.
"""
import csv
import heapq
import math
import os
import random
import statistics
from dataclasses import dataclass, field, replace

HOUR = 1.0
DAY = 24.0

# Share of daily arrivals in each hour (EDs peak late morning to evening).
ARRIVAL_PROFILE = [2, 1.6, 1.3, 1.1, 1.0, 1.1, 1.6, 2.6, 3.9, 5.0, 5.6, 5.8,
                   5.7, 5.6, 5.5, 5.4, 5.4, 5.4, 5.3, 5.2, 4.9, 4.4, 3.6, 2.7]
_s = sum(ARRIVAL_PROFILE)
ARRIVAL_PROFILE = [x / _s for x in ARRIVAL_PROFILE]


@dataclass
class Params:
    name: str = "Baseline"
    days: int = 365
    warmup_days: int = 42
    ed_visits_per_day: float = 165.0
    # CTAS groups: 0 = CTAS 1-2 (resuscitation/emergent), 1 = CTAS 3 (urgent), 2 = CTAS 4-5 (less/non-urgent)
    ctas_mix: tuple = (0.17, 0.50, 0.33)
    admit_prob: tuple = (0.35, 0.12, 0.02)          # gives about 12% admitted, as CIHI reports
    workup_mean_h: tuple = (4.0, 3.0, 1.2)            # time in the ED space after the doctor first sees you
    md_assess_min: float = 30.0
    patience_mean_h: tuple = (1e9, 30.0, 14.0)       # people who give up and leave without being seen
    ed_spaces: int = 33
    physicians_by_hour: tuple = tuple([3] * 8 + [5] * 8 + [6] * 8)
    inpatient_beds: int = 275
    elective_per_day: float = 12.0                    # scheduled and direct admissions that also need beds
    elective_cancel_if_boarders: int = 22             # electives are postponed when this many ED patients already wait for a bed
    acute_los_median_d: float = 4.5
    acute_los_sigma: float = 0.85                     # lognormal spread (mean about 6.5 days)
    alc_prob: float = 0.055                           # admitted patients who become ALC
    alc_extra_median_d: float = 24.0                  # CIHI: median ALC stay 24 days
    discharge_window: tuple = (11.0, 17.0)            # hours of the day when discharges happen
    weekend_discharge_share: float = 0.5              # share of weekend-ready discharges that still happen
    bed_turnaround_h: float = 1.5
    fast_track: bool = False
    ft_hours: tuple = (10.0, 22.0)
    ft_spaces: int = 6
    ft_clinicians: int = 2
    ft_workup_mean_h: float = 0.8
    diversion_share_ctas45: float = 0.0               # low-urgency visits redirected to primary care
    seed: int = 1


@dataclass(order=True)
class Ev:
    t: float
    seq: int
    kind: str = field(compare=False)
    p: object = field(compare=False, default=None)


@dataclass
class Patient:
    pid: int
    arrive: float
    ctas: int
    admit: bool
    workup: float
    patience: float
    ed: bool = True
    zone: str = "main"
    seen: float = None
    left: bool = False
    has_space: bool = False
    board_start: float = None
    bed_time: float = None
    depart: float = None
    alc_days: float = 0.0


class Sim:
    def __init__(self, P: Params):
        self.P = P
        self.rng = random.Random(P.seed)
        self.t = 0.0
        self.ev = []
        self.seq = 0
        self.free_spaces = P.ed_spaces
        self.md_cap = P.physicians_by_hour[0]
        self.md_busy = 0
        self.ft_free_spaces = P.ft_spaces
        self.ft_busy = 0
        self.free_beds = P.inpatient_beds
        self.q_space = []   # (ctas, arrive, pid, patient)
        self.q_md = []
        self.q_ft = []
        self.q_bed = []     # FIFO of patients waiting for a bed
        self.patients = []
        self.bed_hours_acute = 0.0
        self.bed_hours_alc = 0.0
        self.occ_samples = []
        self.pid = 0
        self.cancelled = 0

    # ---- helpers -------------------------------------------------------
    def push(self, t, kind, p=None):
        self.seq += 1
        heapq.heappush(self.ev, Ev(t, self.seq, kind, p))

    def hour(self, t):
        return t % DAY

    def ft_open(self, t):
        h = self.hour(t)
        return self.P.fast_track and self.P.ft_hours[0] <= h < self.P.ft_hours[1]

    def next_discharge_time(self, t):
        a, b = self.P.discharge_window
        d = math.floor(t / DAY)
        while True:
            start, end = d * DAY + a, d * DAY + b
            weekday = d % 7  # day 5, 6 = weekend
            if t < end:
                cand = max(t, start)
                if weekday < 5 or self.rng.random() < self.P.weekend_discharge_share:
                    # spread discharges through the window
                    if cand == start:
                        cand = start + self.rng.random() * (b - a)
                    return cand
            d += 1
            t = d * DAY

    # ---- arrivals ------------------------------------------------------
    def schedule_arrivals(self):
        P = self.P
        total_days = P.days + P.warmup_days
        for d in range(total_days):
            for h in range(24):
                lam = P.ed_visits_per_day * ARRIVAL_PROFILE[h]
                # Poisson arrivals inside the hour
                t = d * DAY + h
                end = t + 1
                while True:
                    t += self.rng.expovariate(lam)
                    if t >= end:
                        break
                    self.push(t, "arrive")
            # elective / direct admissions arrive in the morning
            n = self._poisson(P.elective_per_day)
            for _ in range(n):
                self.push(d * DAY + 7 + self.rng.random() * 4, "elective")
            for h in range(24):
                self.push(d * DAY + h + 1e-6, "shift")
            self.push(d * DAY + 12.0, "sample")

    def _poisson(self, lam):
        L, k, p = math.exp(-lam), 0, 1.0
        while True:
            p *= self.rng.random()
            if p < L:
                return k
            k += 1

    def new_patient(self):
        P = self.P
        r = self.rng.random()
        ctas = 0 if r < P.ctas_mix[0] else (1 if r < P.ctas_mix[0] + P.ctas_mix[1] else 2)
        if ctas == 2 and self.rng.random() < P.diversion_share_ctas45:
            return None
        admit = self.rng.random() < P.admit_prob[ctas]
        workup = self.rng.expovariate(1 / P.workup_mean_h[ctas])
        patience = self.rng.expovariate(1 / P.patience_mean_h[ctas]) if P.patience_mean_h[ctas] < 1e8 else 1e12
        self.pid += 1
        p = Patient(self.pid, self.t, ctas, admit, workup, patience)
        self.patients.append(p)
        return p

    # ---- ED ------------------------------------------------------------
    def on_arrive(self, _):
        p = self.new_patient()
        if p is None:
            return
        if p.ctas == 2 and self.ft_open(self.t):
            p.zone = "ft"
            heapq.heappush(self.q_ft, (p.arrive, p.pid, p))
        else:
            heapq.heappush(self.q_space, (p.ctas, p.arrive, p.pid, p))
        self.push(self.t + p.patience, "abandon", p)
        self.dispatch()

    def dispatch(self):
        # main ED: give spaces, then physicians, by acuity then arrival
        while self.free_spaces > 0 and self.q_space:
            _, _, _, p = heapq.heappop(self.q_space)
            if p.left:
                continue
            self.free_spaces -= 1
            p.has_space = True
            heapq.heappush(self.q_md, (p.ctas, p.arrive, p.pid, p))
        while self.md_busy < self.md_cap and self.q_md:
            _, _, _, p = heapq.heappop(self.q_md)
            if p.left:
                continue
            self.md_busy += 1
            p.seen = self.t
            dur = self.rng.expovariate(1 / (self.P.md_assess_min / 60))
            self.push(self.t + dur, "md_done", p)
        # fast track: an NP and chairs, CTAS 4-5 only
        while self.ft_free_spaces > 0 and self.ft_busy < self.P.ft_clinicians and self.q_ft:
            _, _, p = heapq.heappop(self.q_ft)
            if p.left:
                continue
            self.ft_free_spaces -= 1
            self.ft_busy += 1
            p.has_space = True
            p.seen = self.t
            dur = self.rng.expovariate(1 / (self.P.md_assess_min / 60))
            self.push(self.t + dur, "ft_md_done", p)

    def on_abandon(self, p):
        if p.seen is not None or p.left:
            return
        p.left = True
        p.depart = self.t
        if p.has_space:          # was in a space waiting for the doctor
            if p.zone == "ft":
                self.ft_free_spaces += 1
            else:
                self.free_spaces += 1
        self.dispatch()

    def on_md_done(self, p):
        self.md_busy -= 1
        self.push(self.t + p.workup, "workup_done", p)
        self.dispatch()

    def on_ft_md_done(self, p):
        self.ft_busy -= 1
        if p.admit:   # rare: needs a main-ED pathway; treat as boarding from fast track
            self.push(self.t + p.workup, "workup_done", p)
        else:
            self.push(self.t + self.rng.expovariate(1 / self.P.ft_workup_mean_h), "workup_done", p)
        self.dispatch()

    def release_space(self, p):
        if p.zone == "ft":
            self.ft_free_spaces += 1
        else:
            self.free_spaces += 1

    def on_workup_done(self, p):
        if not p.admit:
            p.depart = self.t
            self.release_space(p)
            self.dispatch()
            return
        p.board_start = self.t
        self.q_bed.append(p)
        self.assign_beds()

    # ---- inpatient -----------------------------------------------------
    def new_inpatient_stay(self, p):
        P = self.P
        los = self.rng.lognormvariate(math.log(P.acute_los_median_d), P.acute_los_sigma) * DAY
        alc = 0.0
        if self.rng.random() < P.alc_prob:
            alc = self.rng.lognormvariate(math.log(P.alc_extra_median_d), 0.7) * DAY
        p.alc_days = alc / DAY
        ready = self.t + los + alc
        out = self.next_discharge_time(ready)
        if self.t >= P.warmup_days * DAY:
            self.bed_hours_acute += (out - self.t) - alc
            self.bed_hours_alc += alc
        self.push(out, "discharge", p)

    def assign_beds(self):
        while self.free_beds > 0 and self.q_bed:
            p = self.q_bed.pop(0)
            self.free_beds -= 1
            if p.ed:
                p.bed_time = self.t
                p.depart = self.t
                self.release_space(p)
            self.new_inpatient_stay(p)
        self.dispatch()

    def on_elective(self, _):
        if sum(1 for q in self.q_bed if q.ed) >= self.P.elective_cancel_if_boarders:
            if self.t >= self.P.warmup_days * DAY:
                self.cancelled += 1
            return
        self.pid += 1
        p = Patient(self.pid, self.t, -1, True, 0, 0, ed=False)
        self.q_bed.append(p)
        self.assign_beds()

    def on_discharge(self, p):
        self.push(self.t + self.P.bed_turnaround_h, "bed_free")

    def on_bed_free(self, _):
        self.free_beds += 1
        self.assign_beds()

    def on_shift(self, _):
        h = int(round(self.hour(self.t))) % 24
        self.md_cap = self.P.physicians_by_hour[h]
        if self.P.fast_track and abs(self.hour(self.t) - self.P.ft_hours[1]) < 1e-3:
            # fast track closes: waiting patients move to the main ED queue
            while self.q_ft:
                _, _, p = heapq.heappop(self.q_ft)
                if not p.left:
                    p.zone = "main"
                    heapq.heappush(self.q_space, (p.ctas, p.arrive, p.pid, p))
        self.dispatch()

    def on_sample(self, _):
        if self.t >= self.P.warmup_days * DAY:
            self.occ_samples.append(1 - self.free_beds / self.P.inpatient_beds)

    # ---- run -----------------------------------------------------------
    def run(self):
        self.schedule_arrivals()
        end = (self.P.days + self.P.warmup_days) * DAY
        handlers = {
            "arrive": self.on_arrive, "abandon": self.on_abandon, "md_done": self.on_md_done,
            "ft_md_done": self.on_ft_md_done, "workup_done": self.on_workup_done,
            "elective": self.on_elective, "discharge": self.on_discharge, "bed_free": self.on_bed_free,
            "shift": self.on_shift, "sample": self.on_sample,
        }
        while self.ev:
            e = heapq.heappop(self.ev)
            if e.t > end:
                break
            self.t = e.t
            handlers[e.kind](e.p)
        return self.summary()

    def summary(self):
        w0 = self.P.warmup_days * DAY
        pts = [p for p in self.patients if p.ed and p.arrive >= w0 and p.depart is not None]

        def pct(xs, q):
            if not xs:
                return float("nan")
            xs = sorted(xs)
            return xs[min(len(xs) - 1, int(q * len(xs)))]

        seen = [p for p in pts if p.seen is not None]
        low = [p.seen - p.arrive for p in seen if p.ctas == 2]
        allw = [p.seen - p.arrive for p in seen]
        adm = [p.depart - p.arrive for p in pts if p.admit and p.bed_time is not None]
        board = [p.bed_time - p.board_start for p in pts if p.admit and p.bed_time is not None]
        dis = [p.depart - p.arrive for p in pts if not p.admit and not p.left]
        n_low = len([p for p in pts if p.ctas == 2])
        lwbs = len([p for p in pts if p.left]) / max(1, len(pts))
        tot_bed = self.bed_hours_acute + self.bed_hours_alc
        return {
            "scenario": self.P.name,
            "seed": self.P.seed,
            "ed_visits": len(pts),
            "wait_md_median_h": round(pct(allw, 0.5), 2),
            "wait_md_p90_h": round(pct(allw, 0.9), 2),
            "low_urgency_wait_md_median_h": round(pct(low, 0.5), 2),
            "low_urgency_wait_md_p90_h": round(pct(low, 0.9), 2),
            "discharged_ed_los_p90_h": round(pct(dis, 0.9), 2),
            "admitted_ed_los_p90_h": round(pct(adm, 0.9), 2),
            "boarding_median_h": round(pct(board, 0.5), 2),
            "boarding_p90_h": round(pct(board, 0.9), 2),
            "left_without_being_seen_pct": round(100 * lwbs, 2),
            "bed_occupancy_pct": round(100 * statistics.mean(self.occ_samples), 1),
            "electives_postponed_per_week": round(7 * self.cancelled / self.P.days, 1),
            "alc_share_of_bed_days_pct": round(100 * self.bed_hours_alc / tot_bed, 1) if tot_bed else 0,
        }


BASE = Params()
SCENARIOS = [
    BASE,
    replace(BASE, name="Halve ALC patients", alc_prob=BASE.alc_prob / 2),
    replace(BASE, name="Add 14 inpatient beds (+5%)", inpatient_beds=BASE.inpatient_beds + 14),
    replace(BASE, name="Discharge 7am-9pm, 7 days", discharge_window=(7.0, 21.0), weekend_discharge_share=1.0),
    replace(BASE, name="Fast-track zone for CTAS 4-5", fast_track=True),
    replace(BASE, name="Divert 20% of CTAS 4-5 to primary care", diversion_share_ctas45=0.20),
    replace(BASE, name="Add 2 ED physicians (day+evening)",
            physicians_by_hour=tuple([3] * 8 + [6] * 8 + [7] * 8)),
    replace(BASE, name="Combined: ALC + discharge + fast track", alc_prob=BASE.alc_prob / 2,
            discharge_window=(7.0, 21.0), weekend_discharge_share=1.0, fast_track=True),
]


def main(seeds=(1, 2, 3, 4, 5)):
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
    rows = []
    for sc in SCENARIOS:
        for s in seeds:
            r = Sim(replace(sc, seed=s)).run()
            rows.append(r)
            print(r)
    path = os.path.join(out_dir, "simulation_runs.csv")
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    # mean across seeds per scenario
    keys = [k for k in rows[0] if k not in ("scenario", "seed")]
    summ = []
    for sc in SCENARIOS:
        rs = [r for r in rows if r["scenario"] == sc.name]
        d = {"scenario": sc.name, "seeds": len(rs)}
        for k in keys:
            d[k] = round(statistics.mean(r[k] for r in rs), 2)
        summ.append(d)
    with open(os.path.join(out_dir, "simulation_results.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(summ[0].keys()))
        w.writeheader()
        w.writerows(summ)
    return summ


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--quick":
        print(Sim(Params(days=180)).run())
    else:
        for r in main():
            pass
