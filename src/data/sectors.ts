// Who the work is for. A tool or project shows under a sector when one of its
// `sectors` contains one of the sector's `match` words (case-insensitive).
// `ideas` are planned tools: shown as Planned, never as built.
export const SECTORS = [
  { id: 'retail', name: 'Retail and shops', blurb: 'Sales, stock, staffing and footfall for stores and chains.', match: ['retail', 'any business'], ideas: ['Stock reorder planner', 'Basket and promotion analysis'] },
  { id: 'small-business', name: 'Small businesses', blurb: 'Simple reports, schedules and cash planning without a BI team.', match: ['any business', 'small', 'freelancer'], ideas: ['Cash-flow forecaster', 'Invoice and receipt automation'] },
  { id: 'hospitality', name: 'Hotels and hospitality', blurb: 'Pricing, forecasting, scheduling and daily close for hotels and resorts.', match: ['hotel', 'resort', 'short-term'], ideas: [] },
  { id: 'restaurants', name: 'Restaurants and food chains', blurb: 'Covers, labour, reservations and cash-up across sites.', match: ['restaurant'], ideas: ['Menu engineering matrix', 'Food cost and waste tracker'] },
  { id: 'logistics', name: 'Logistics and warehousing', blurb: 'Demand, shifts and throughput for warehouses and delivery teams.', match: ['logistics', 'transport', 'warehous'], ideas: ['Delivery load and route planner', 'Warehouse pick-rate dashboard'] },
  { id: 'finance', name: 'Banks, finance and insurance', blurb: 'Clean data pipelines, KPI reporting and anomaly checks.', match: ['finance', 'bank', 'insurance'], ideas: ['Claims anomaly checker', 'Portfolio KPI dashboard', 'Reconciliation pipeline'] },
  { id: 'automotive', name: 'Automotive', blurb: 'Dealership and service operations, stock and scheduling.', match: ['automotive', 'dealership', 'manufactur'], ideas: ['Vehicle stock ageing report', 'Service bay scheduler'] },
  { id: 'healthcare', name: 'Healthcare and clinics', blurb: 'Appointments, no-shows and staffing for clinics and care homes.', match: ['clinic', 'care home', 'healthcare'], ideas: ['Appointment no-show forecaster', 'Clinic staffing planner'] },
  { id: 'research', name: 'Science, research and academia', blurb: 'Reproducible pipelines, clean datasets and modelling for research work.', match: ['research', 'science', 'academ'], ideas: ['Lab data cleaning pipeline', 'Experiment results warehouse'] },
  { id: 'everyday', name: 'Everyday people', blurb: 'Free tools for budgeting and planning, private to your device.', match: ['personal', 'household'], ideas: ['Bill calendar sync', 'Personal spreadsheet clean-up'] },
] as const;

export type Sector = (typeof SECTORS)[number];
export const inSector = (sectors: readonly string[], s: Sector) => {
  const all = sectors.join(' | ').toLowerCase();
  return s.match.some((m) => all.includes(m));
};
