// The eight fields nihal works in, and the five kinds of work inside each.
// Every tool and project has exactly one `field` and one `kind`.
// If it isn't clear which field or kind a new item belongs to, ask nihal (rule book, section 3).
// `topics`: what I'm working on in the field now (name, short note, optional link). `for`: who it serves beyond the field's own sector.
type Topic = { name: string; note: string; href?: string };
export const FIELDS: readonly { id: string; name: string; blurb: string; ideas: readonly string[]; also?: readonly string[]; topics: readonly Topic[]; for: readonly string[] }[] = [
  { id: 'hospitality', name: 'Hospitality', blurb: 'Hotels, resorts, restaurants and venues: pricing, demand, staffing and daily operations.', ideas: ['Restaurant-chain editions of the BI toolkit', 'Menu engineering and food-cost tracker'], also: ['hotel', 'restaurant'], topics: [], for: [] },
  { id: 'retail', name: 'Retail', blurb: 'Stores, chains and online retail: sales, stock, pricing, staffing and the supply chain behind them.', ideas: ['Store and SKU demand forecasting', 'Inventory and replenishment pipeline', 'Markdown and price optimisation', 'Multi-store sales dashboard'], also: ['retail'], topics: [], for: [] },
  { id: 'logistics', name: 'Logistics', blurb: 'Warehouses, fleets and deliveries: demand, routing, loads and throughput.', ideas: ['Delivery load and route planner', 'Warehouse pick-rate dashboard', 'Bottleneck control from natural swarm rules'], topics: [
    { name: 'Traffic and fleet bottlenecks', note: 'Flow rules from the natural swarm study, for trucks, deliveries and warehouses', href: '/swarm/bird-flocks/' },
    { name: 'Air traffic flow', note: 'Spacing and merging rules from bird flocks, for busy airspace and drone corridors', href: '/swarm/bird-flocks/' },
  ], for: ['Transport departments', 'Air traffic management'] },
  { id: 'energy', name: 'Energy', blurb: 'Electricity grids, oil and gas, buildings and batteries: peaks, monitoring, savings and control.', ideas: ['Building energy pipeline from meter data', 'Energy swarm on Ontario and Alberta grid data', 'Pipeline and equipment monitoring'], topics: [
    { name: 'Grid balancing', note: 'Battery fleets that cut the daily peak, next on Ontario and Alberta grids', href: '/swarm/canada-energy-swarm/' },
    { name: 'Batteries, solar and demand response', note: 'Three kinds of agents on one grid, working as one team', href: '/swarm/canada-energy-swarm/' },
    { name: 'Oil and gas pipeline monitoring', note: 'Pipeline segments that flag trouble and confirm with their neighbours', href: '/swarm/pipeline-monitoring/' },
    { name: 'Building energy', note: 'Smart-building control (CityLearn, NeurIPS 2026 Smart Buildings)', href: '/projects/smart-buildings/' },
  ], for: ['Provincial grid operators', 'Utilities', 'Energy regulators', 'Federal and provincial energy departments'] },
  { id: 'crisis', name: 'Crisis management', blurb: 'Wildfires, floods and emergencies: response planning, resources and live dashboards.', ideas: ['Evacuation route planner', 'Incident data pipeline', 'Interprovincial wildfire resource sharing'], topics: [
    { name: 'Wildfire resource sharing', note: 'Provinces lending crews and aircraft where fires are about to grow', href: '/swarm/wildfire-resource-sharing/' },
    { name: 'Wildfire drones', note: 'Drones routing retardant to choke points, tested against the nearest-fire rule', href: '/swarm/wildfire-drones/' },
    { name: 'Emergency response coordination', note: 'Many agencies acting as one team without a single control room' },
    { name: 'Panic, misinformation and epidemic spread', note: 'How fear, rumours and disease move through a group, from the natural swarm study', href: '/swarm/bird-flocks/' },
  ], for: ['Provincial wildfire agencies', 'Federal and provincial emergency management'] },
  { id: 'science', name: 'Science', blurb: 'Research data: clean pipelines, reproducible models and competitions.', ideas: ['Lab data cleaning pipeline', 'Experiment results warehouse'], topics: [
    { name: 'Natural swarm study', note: 'Rules of real bird flocks from measured data, written as fluid-like equations', href: '/swarm/bird-flocks/' },
    { name: 'Swarm intelligence research', note: 'One engine, tested against strong rules over many seeds, written up as a paper', href: '/projects/swarm-research/' },
  ], for: [] },
  { id: 'health', name: 'Health', blurb: 'Clinics, hospitals and ambulances: appointments, staffing and response times.', ideas: ['Appointment no-show forecaster', 'Ambulance rerouting', 'Clinic staffing planner'], topics: [
    { name: 'Epidemic spread', note: 'How disease moves through a group, from the natural swarm study', href: '/swarm/bird-flocks/' },
  ], for: ['Public health agencies'] },
  { id: 'finance', name: 'Finance', blurb: 'Banks, insurance and personal money: reporting, reconciliation and anomaly checks.', ideas: ['Claims anomaly checker', 'Reconciliation pipeline', 'Portfolio KPI dashboard'], topics: [], for: [] },
];

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
