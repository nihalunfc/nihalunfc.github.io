---
title: Enveda CASMI 2026 molecule identification
summary: Rank candidate chemical structures for unknown molecules from their mass spectra. My main contribution is a leak-free 300-structure hold-out that caught leaderboard drops the provided validation missed.
category: Kaggle
status: Ongoing
date: 2026-11-02
order: 5
featured: false
sectors: [Research]
tags: [PyTorch, RDKit, LightGBM, Validation]
stats:
  - { value: "0.415", label: "MRR@25 on the public LB" }
  - { value: "300", label: "structure leak-free hold-out" }
  - { value: "540k", label: "spectra embedded on GPU" }
links:
  - { label: "Competition", href: "https://www.kaggle.com/competitions/enveda-CASMI26-molecule-id-mass-spectra" }
  - { label: "Blog: when the validation set lies", href: "/blog/leak-free-validation-casmi/" }
  - { label: "My Kaggle profile", href: "https://www.kaggle.com/vsnihal" }
---

## The problem

A mass spectrometer breaks an unknown molecule into fragments and records their masses. From those spectra, predict a ranked list of up to 25 candidate structures. The score is the mean reciprocal rank of the true structure.

## What I built

My best leaderboard score (0.415) comes from a public two-engine pipeline that I forked and credited. It searches about 711,000 candidate structures and fuses spectral library search, fingerprint neural networks, fragmentation and forward models with gradient-boosted ranking. My own work went around it:

- **Data.** I embedded about 540,000 training spectra from ten open libraries with DreaMS on a Kaggle GPU, precomputed fingerprints for every candidate, and saved each pipeline stage so I could replay fusion settings in seconds instead of rerunning a nine-hour notebook.
- **Models.** A contrastive spectrum-to-structure scorer trained against hard same-mass isomers, a fingerprint-consensus re-ranker, a coordinate-descent tuner over 18 fusion settings, and a test of generating new structures one edit away from known ones.
- **Validation.** See below.

## The hardest part: a validation set that lied

The public leaderboard scores only about 130 molecules, so differences under about 0.016 are noise. The provided validation panel turned out to be leaked: models inside the pipeline had already seen those molecules. Settings tuned on it scored 0.930 offline and dropped my leaderboard score from 0.415 to 0.371.

I built a leak-free hold-out from 300 structures in open-licence MassBank, GNPS and MultiMS2 spectra that appear nowhere in the training data, checked by InChIKey and tautomer key. On it, the bad settings lost 0.037 (95% bootstrap interval −0.057 to −0.018), matching the real leaderboard drop the panel had missed. Error analysis then showed that 98 of 109 misses were never in any candidate list, which moved my focus from re-ordering to candidate recall.

## Honest results

None of my own experiments has beaten the forked baseline yet. The contrastive scorer reached 29% top-1 against 47 to 49% for the existing models. The re-ranker helped on unseen classes (+0.028) but hurt on known ones (−0.060). Structure generation recovered 9 of 120 molecules and added decoys. I dropped or shelved each one based on the hold-out, not the leaderboard. The competition ends on 14 December 2026.
