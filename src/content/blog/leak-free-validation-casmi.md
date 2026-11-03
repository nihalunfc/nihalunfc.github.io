---
title: "When the validation set lies: a leak-free hold-out for CASMI 2026"
description: "My offline score said 0.930. The leaderboard dropped from 0.415 to 0.371. How I built a 300-molecule hold-out that finally agreed with the leaderboard."
date: 2026-11-02
tags: [Kaggle, Validation, Machine learning, Data leakage]
---

In Kaggle's [Enveda CASMI 2026](/projects/casmi-2026/) competition, you're given the mass spectra of an unknown molecule and asked to rank up to 25 candidate structures. The score is mean reciprocal rank: 1.0 if the true structure is first, 0.5 if it's second, and so on.

This post is about one lesson from that competition. Validation is only useful if it's measuring the same thing as the test.

## The setup

The public leaderboard is scored on only about 130 molecules. At that size, differences under about 0.016 are noise. You can't tune on the leaderboard without fooling yourself, so you need your own offline validation.

The competition provided a natural-product panel for exactly that. I tuned the pipeline's fusion settings (how much weight each scoring engine gets) on it and got a beautiful number: **0.930**.

I submitted. The leaderboard went from **0.415 to 0.371**.

## Why it lied

The panel was leaked. Several models inside the public pipeline I'd forked had been trained on spectra of those same molecules. Tuning on the panel rewarded whichever engine had memorised them best, which is exactly the wrong thing to reward for unseen test molecules.

It's the most common failure in applied machine learning: validation data that the model, or some part of it, has already seen.

## Building a hold-out that couldn't be leaked

I built a new validation set from scratch:

1. Collected spectra from open-licence libraries (MassBank, GNPS and MultiMS2).
2. Kept only structures that appear **nowhere** in the training data, checked by InChIKey and by tautomer key, so a molecule couldn't sneak in under a different drawing.
3. Sampled **300 structures** and ran them through the full nine-hour pipeline on a Kaggle GPU.
4. Reported every comparison with **bootstrap confidence intervals**, and tuned with two folds so I never scored settings on the data that picked them.

## Did it agree with the leaderboard?

Yes. On the hold-out, the baseline scored 0.447 and the bad settings scored 0.411: a drop of **−0.037** (95% interval −0.057 to −0.018). The real leaderboard drop was −0.049. The old panel had predicted a gain.

## What it changed

Error analysis on the hold-out showed that **98 of the 109** molecules I got wrong were never in any candidate list at all. No amount of re-ranking could fix those. That moved my effort from tuning the order of candidates to finding the right candidates in the first place.

It also has limits. A later probe scored 0.398 on the leaderboard and showed that the hold-out's chemistry favours one of the engines, so it catches big mistakes reliably but isn't fine enough to tune small weights. I use it as a sanity check, not an oracle.

## The lesson for BI work too

This isn't only a Kaggle problem. Any time a dashboard metric, a forecast or a model is checked against data it was built from, it will look better than it is. Before trusting a number, ask what it was tested on, and whether anything upstream has seen that data before.
