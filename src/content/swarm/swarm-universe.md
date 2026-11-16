---
title: "The swarm universe (speculative)"
summary: "A speculative model that treats the universe as a self-regulating swarm of regions, with dark energy as the swarm's set-point control. Fitted to real supernova, BAO and expansion-rate data: it fits as well as the standard model, but the data do not prefer it."
field: science
track: nature
status: In progress
order: 16
date: 2026-11-16
updated: 2026-11-16
for: ["Researchers", "Physics and cosmology readers"]
stats:
  - { value: "χ² −5 to −7", label: "swarm models fit as well as ΛCDM" }
  - { value: "BIC +3 to +15", label: "extra parameters not justified: ΛCDM preferred" }
  - { value: "4.3σ", label: "Hubble tension remains" }
  - { value: "13", label: "cosmological models compared" }
parts:
  - { name: "Postulates and equations", done: true }
  - { name: "Fitted to Pantheon+, DESI DR2 BAO and cosmic chronometers", done: true }
  - { name: "Galaxy rotation curves (SPARC)", done: true }
  - { name: "Comparison with 13 models, evidence and contradiction table", done: true }
  - { name: "Full CMB likelihoods (Planck)", done: false }
  - { name: "Growth data: weak lensing and redshift-space distortions", done: false }
  - { name: "Cautious write-up that states its limits", done: false }
roadmap:
  - "Test against full Planck CMB likelihoods, weak lensing and redshift-space distortions, the strongest tests of a structure-triggered dark energy."
  - "Check the predictions when DESI DR3 and Euclid data are released."
  - "Write it up as a cautious draft that states its limits first."
links:
  - { label: "Full theory on GitHub", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/docs/universal-swarm/swarm-universe-theory.md" }
  - { label: "Cosmology fit tables", href: "https://github.com/nihalunfc/swarm-intelligence/blob/main/results/universal/cosmology.md" }
  - { label: "One law for 25 real swarms", href: "/swarm/universal-swarm-law/" }
code: https://github.com/nihalunfc/swarm-intelligence/tree/main/universal/cosmos
---
<div class="callout warn">

**Speculative.** This is a hypothesis with a first data test, not a result. Nothing here is a proof, and the standard model (ΛCDM) explains the same data with fewer parameters. The model is written so it can fail: each claim says which observation would rule it out.

</div>

## The idea

Natural swarms have no leader, yet they keep order, limit their own growth and pull themselves back after a shock. The [universal swarm study](/swarm/universal-swarm-law/) measures three ingredients in 21 real datasets: agents **align** with their neighbours, they **cohere** with a pull that switches on beyond a fixed distance, and the group is **regulated** toward a set point, often overshooting it first.

The swarm-universe hypothesis describes the universe the same way. Many causally connected regions ("cells") each follow local rules. Gravity is the cohesion. Cells in contact align their expansion rates. What we call dark energy is the swarm's **set-point regulation**, and it switches on once enough structure has formed, like quorum sensing in bacteria or bees. The smooth expanding universe is then the average over cells, just as a fluid equation is the average over a flock.

## Postulates

| | Postulate | Swarm analogue | Status |
| :-- | :-- | :-- | :-- |
| P1 | Space is made of cells, each with its own expansion rate, density and vacuum term | agents with velocity, local density and an internal state | modelling choice |
| P2 | Gravity is the cohesion term (Raychaudhuri equation) | cohesion | standard general relativity |
| P3 | Cells in causal contact align their expansion rates | alignment | new, testable |
| P4 | Each cell's vacuum term is driven to a set point by a damped regulator, switched on by the fraction of matter in bound structures | speed set point, quorum sensing | new, speculative |
| P5 | Fluctuations of the vacuum term scale with its level | fluctuation scaling (Taylor's law) | new, speculative |
| P6 | The observed universe is the average over cells (Buchert averaging) | continuum limit of a flock | standard technique |

The regulator for one cell, in e-folds N = ln a:

```
d²λ/dN² + 2ζω dλ/dN + ω² (λ − Λ* Q(F)) = noise,     Q(F) = F^s / (F^s + F_t^s)
```

ζ is the damping, ω the regulation speed, F the collapsed fraction and F_t the quorum threshold. Averaging gives three closed forms for dark energy:

- **SU-A, homeostatic vacuum:** a first-order regulator. It turns out to be exactly the known wCDM model.
- **SU-B, quorum emergence:** dark energy switches on sharply as structure forms.
- **SU-C, regulated overshoot:** the regulator overshoots its set point and settles, so the equation of state crosses w = −1. That crossing is a prediction, not an input.

## First test on real data

Pantheon+ (1,580 supernovae with full covariance), DESI DR2 BAO and 15 cosmic-chronometer points, with the Planck sound-horizon ruler:

| Model | χ² | extra parameters | ΔAIC vs ΛCDM | ΔBIC vs ΛCDM | H0 | w today, w at z = 1 |
| :-- | --: | --: | --: | --: | --: | :-- |
| ΛCDM | 1406.2 | 0 | 0 | 0 | 68.6 ± 0.5 | −1, −1 |
| SU-A (= wCDM) | 1401.5 | 1 | −2.7 | +2.7 | 67.8 ± 0.6 | −0.91, −0.91 |
| w0waCDM (CPL) | 1401.3 | 2 | −0.9 | +9.9 | 67.7 ± 0.6 | −0.89, −0.99 |
| SU-B quorum emergence | 1400.7 | 2 | −1.5 | +9.3 | 68.1 ± 0.5 | −1.00, −1.63 |
| SU-C regulated overshoot | 1399.3 | 3 | −0.9 | +15.2 | 67.8 ± 0.6 | −1.01, −1.27 |

![Dark-energy equation of state w(z) for the fitted models](/downloads/science/swarm/cosmology_w.png)

What this says, plainly:

- **All three swarm models fit the expansion data at least as well as ΛCDM**, mostly thanks to DESI BAO.
- **None is preferred.** AIC differences are under 3, which is no real preference, and BIC, which penalises extra parameters, prefers ΛCDM by 3 to 15. The data do not need a swarm mechanism.
- SU-B puts the switch-on at z ≈ 1.3, around when galaxy clusters start to assemble. That is what a quorum picture predicts, but it is also where supernova and BAO data are strongest, so it may only reflect where the data sit.
- SU-C prefers an underdamped regulator (ζ ≈ 0.2). That is close to fitting noise: a hint to test with future data, not a detection.
- **The Hubble tension is not solved.** Every model gives H0 ≈ 67 to 68 km/s/Mpc, 4.3σ below the local SH0ES value.

**Galaxies.** In 147 SPARC galaxies (2,696 points) the observed acceleration follows the visible matter with one crossover scale, g† = 1.16 × 10⁻¹⁰ m/s², with 0.13 dex scatter. That is 1.09 × cH0/2π. A swarm reading is a local rule tied to a global scale, like the push-to-pull switch distance in animal swarms. But a coincidence is not a mechanism, and MOND fits the same curve.

![Radial acceleration relation in SPARC galaxies](/downloads/science/swarm/rar.png)

## Evidence for and against

"Supports" means consistent with and naturally explained by the swarm picture. Most of these are explained by ΛCDM too.

| Observation | Verdict | Why |
| :-- | :-- | :-- |
| Accelerating expansion (supernovae) | Consistent | all swarm models fit as well as ΛCDM |
| DESI DR2 hint of evolving dark energy | Mildly supports SU-C | an overshooting regulator crosses w = −1 in the same direction DESI prefers |
| Cosmic coincidence (dark energy ≈ matter today) | Supports the idea | dark energy switches on with structure, so it matters once structure has formed |
| Size of Λ (120 orders below the naive estimate) | Not solved | the set point is an input |
| CMB acoustic peaks, nucleosynthesis, BAO ruler | Consistent by inheritance | early physics is unchanged |
| CMB uniformity across regions never in contact | **Contradicts a swarm-only origin** | alignment needs contact, so inflation or a bounce is still needed |
| Hubble tension | **Not solved** | late-time dark-energy changes cannot raise H0 here |
| Growth (S8) tension | Open | not tested yet |
| Cosmic web of filaments and voids | Analogy only | attractive swarms clump the same way; no quantitative test yet |
| Galaxy rotation curves with one scale | Supports a "local rule with one switch" | but MOND fits it equally |
| Bullet Cluster, cluster lensing | **Contradicts any no-dark-matter version** | the model must keep dark matter |
| Gravitational waves travel at light speed (GW170817) | Consistent | gravity is unchanged |
| Early massive galaxies (JWST) | Open | would change the quorum timing; not modelled |

## Compared with 13 models

ΛCDM, inflation, steady state, cyclic and ekpyrotic, conformal cyclic, quintessence, holographic and running-vacuum dark energy, unimodular gravity, backreaction, MOND, emergent gravity, cosmological natural selection, and bounce cosmology. The full table, with what each shares with the swarm model, how it differs and what observation would separate them, is in the [theory document](https://github.com/nihalunfc/swarm-intelligence/blob/main/docs/universal-swarm/swarm-universe-theory.md#7-comparison-with-major-cosmological-models).

## Known faults

1. **Degeneracy.** SU-A is mathematically wCDM, and SU-B and SU-C are dark-energy shapes. A good fit does not show a swarm mechanism exists.
2. **No microphysics.** The quorum signal and the regulator are postulated, not derived. Parts of SU-B and SU-C are phantom (w < −1).
3. **The early universe is borrowed.** Horizon, flatness, the primordial spectrum and nucleosynthesis come from the standard model.
4. **Analogy is not identity.** The animal-swarm constants motivate the equations; they do not set cosmological parameters.
5. **Missing data.** Full CMB likelihoods, weak lensing and redshift-space distortions are not used yet.

## Predictions that could rule it out

1. **Shape of w(z).** w should cross −1 from below to above near when the collapsed fraction reaches its threshold. If DESI, Euclid or Rubin find w = −1 at all redshifts with high precision, SU-B and SU-C are ruled out.
2. **Environment.** Regions with little structure (deep voids) should show a weaker vacuum term. Supernova residuals split by environment test this.
3. **The galaxy scale tracks expansion.** If the galaxy-scale switch is set by the global regulator, it should scale with H(z). High-redshift rotation curves test this.
4. **Growth.** A structure-triggered dark energy predicts a specific link between the growth rate of structure and the switch-on.
