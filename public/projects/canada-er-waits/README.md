# Why Canadian ER waits are so long

Data, code and figures behind https://nihalsulaiman.com/projects/canada-er-waits/

- `data/` tidy CSVs; every row has its source URL. `simulation_results.csv` is written by `code/simulate.py` (`simulation_runs.csv` holds each seed).
- `code/simulate.py` discrete-event simulation of one ED plus inpatient ward (Python standard library only).
- `code/analysis.py` builds the six figures in `figures/` (needs pandas and matplotlib).

```sh
cd code
python simulate.py     # about 1 minute: 8 scenarios x 5 seeds x 1 simulated year
python analysis.py
```

The simulation is a stylised hospital calibrated to published Canadian and Ontario aggregates, not to any hospital's patient records.
