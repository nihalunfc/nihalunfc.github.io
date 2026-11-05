# Doomsday 2026, re-examined: code and data

Reproduction and out-of-sample test of von Foerster, Mora & Amiot (1960),
"Doomsday: Friday, 13 November, A.D. 2026", *Science* 132(3436): 1291-1295,
https://doi.org/10.1126/science.132.3436.1291

Article: https://nihalsulaiman.com/blog/doomsday-2026-restudy/
Author: Nihal Vellaramkallingal Sulaiman

## Run it

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python doomsday.py                 # uses the CSV files in data/
python doomsday.py --download      # or fetch fresh copies of both datasets first
```

It takes about 15 seconds. It prints every number quoted in the article and writes:

- `figures/` : Figs 1-6 as PNG, SVG and PDF
- `results/results.json` : every result in one file
- `results/prediction_vs_observed.csv` : the 1960 law against the World Bank series, year by year
- `results/moving_doomsday.csv` : the refitted doomsday date as data are added

The Monte Carlo and bootstrap use a fixed seed (20261113), so your numbers match the article exactly.
If you use `--download` after the World Bank revises its series, the last decimal places can move.

## Data

| File | What | Source | Licence |
|---|---|---|---|
| `data/cohen1996_historical_estimates.csv` | Historical world population estimates (millions) by author: Deevey, McEvedy & Jones, Durand, Clark, Biraben, Blaxter, UN, Kremer | Appendix of J. E. Cohen, *How Many People Can the Earth Support?* (W. W. Norton, 1995; paperback 1996, ISBN 0-393-31495-2), as packaged by datahub.io: https://datahub.io/core/population-global-historical (raw CSV: https://raw.githubusercontent.com/datasets/population-global-historical/main/data/population.csv) | ODC PDDL |
| `data/worldbank_SP.POP.TOTL_WLD.csv` | World population, total, 1960-2025 | World Bank, World Development Indicators, indicator SP.POP.TOTL, country WLD: https://data.worldbank.org/indicator/SP.POP.TOTL?locations=1W (API: https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&per_page=200). Copy taken 2026-11-05; the series was last updated 2026-10-08 and is derived from the UN World Population Prospects. | CC BY 4.0 |

The 1960 paper plots its 24 estimates in its Fig. 1 but does not print them in a table,
so this study uses Cohen's compilation of the same span (AD 1 to 1955) as the pre-1960 evidence,
and tests the paper's **published** equation and parameters directly.

## Licence

Code: MIT. Please cite the article if you reuse it.
