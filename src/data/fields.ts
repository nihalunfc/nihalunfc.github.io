// The eight fields nihal works in, and the five kinds of work inside each.
// Every tool and project has exactly one `field` and one `kind`.
// If it isn't clear which field or kind a new item belongs to, ask nihal (rule book, section 3).
export const FIELDS = [
  { id: 'hospitality', name: 'Hospitality', blurb: 'Hotels, resorts, restaurants and venues: pricing, demand, staffing and daily operations.', ideas: ['Restaurant-chain editions of the BI toolkit', 'Menu engineering and food-cost tracker'], also: ['hotel', 'restaurant'] },
  { id: 'retail', name: 'Retail', blurb: 'Stores, chains and online retail: sales, stock, pricing, staffing and the supply chain behind them.', ideas: ['Store and SKU demand forecasting', 'Inventory and replenishment pipeline', 'Markdown and price optimisation', 'Multi-store sales dashboard'], also: ['retail'] },
  { id: 'logistics', name: 'Logistics', blurb: 'Warehouses, fleets and deliveries: demand, routing, loads and throughput.', ideas: ['Delivery load and route planner', 'Warehouse pick-rate dashboard'] },
  { id: 'energy', name: 'Energy', blurb: 'Grids, buildings and batteries: peaks, savings and control.', ideas: ['Building energy pipeline from meter data'] },
  { id: 'crisis', name: 'Crisis management', blurb: 'Wildfires, floods and emergencies: response planning, resources and live dashboards.', ideas: ['Evacuation route planner', 'Incident data pipeline'] },
  { id: 'science', name: 'Science', blurb: 'Research data: clean pipelines, reproducible models and competitions.', ideas: ['Lab data cleaning pipeline', 'Experiment results warehouse'] },
  { id: 'health', name: 'Health', blurb: 'Clinics, hospitals and ambulances: appointments, staffing and response times.', ideas: ['Appointment no-show forecaster', 'Ambulance rerouting', 'Clinic staffing planner'] },
  { id: 'finance', name: 'Finance', blurb: 'Banks, insurance and personal money: reporting, reconciliation and anomaly checks.', ideas: ['Claims anomaly checker', 'Reconciliation pipeline', 'Portfolio KPI dashboard'] },
] as const;

export const KINDS = [
  { id: 'bi', name: 'BI and dashboards' },
  { id: 'optimisation', name: 'Optimisation' },
  { id: 'tools', name: 'Tools' },
  { id: 'pipelines', name: 'Pipelines and ETL' },
  { id: 'ml', name: 'Machine learning' },
] as const;

export const FIELD_IDS = FIELDS.map((f) => f.id) as unknown as [string, ...string[]];
export const KIND_IDS = KINDS.map((k) => k.id) as unknown as [string, ...string[]];
export const fieldName = (id: string) => FIELDS.find((f) => f.id === id)?.name ?? id;
export const kindName = (id: string) => KINDS.find((k) => k.id === id)?.name ?? id;
