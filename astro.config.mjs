import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static pages in public/ that Astro doesn't build, so the sitemap lists them too.
const STATIC_PAGES = [
  '/swarm/explorer/', '/swarm/grid-batteries/', '/swarm/wildfire-drones/', '/swarm/hotel-operations/',
  '/projects/hospitality-bi/overview/',
  '/tools/expense-calendar/personal/', '/tools/workforce-suite/hotels/', '/tools/operations-suite/hotels/',
  '/tools/pricing-recommender/hotels/', '/tools/demand-forecaster/hotels/', '/tools/overbooking-calculator/hotels/',
  '/tools/large-order-quote/hotels/', '/tools/kpi-dashboard/hotels/', '/tools/revenue-command-centre/hotels/',
  '/tools/shift-scheduler/hotels/', '/tools/task-board/hotels/', '/tools/labour-productivity/hotels/',
  '/tools/daily-close/hotels/', '/tools/energy-savings/ontario/', '/tools/report-builder/hotels/',
  '/disclaimer/', '/learn/etl-course/',
].map((p) => 'https://nihalsulaiman.com' + p);

// Keep in step with SITE_URL in src/site.ts.
export default defineConfig({
  site: 'https://nihalsulaiman.com',
  trailingSlash: 'always',
  // Old addresses on this site that moved to the one URL scheme (see public/site-structure.md).
  // Old /hotel-business/ addresses are redirected from the hotel-business repo.
  redirects: {
    '/kaggle': '/projects/kaggle/',
    '/cv': '/about/cv/',
    '/sectors': '/fields/',
    '/projects/swarm-intelligence': '/swarm/',
    '/swarm/energy': '/swarm/grid-batteries/',
    '/swarm/wildfire': '/swarm/wildfire-drones/',
    '/swarm/hotel': '/swarm/hotel-operations/',
    '/tools/expense-calendar/v1': '/tools/expense-calendar/personal/v1/',
    '/tools/expense-calendar/v2': '/tools/expense-calendar/personal/v2/',
    '/tools/expense-calendar/v3': '/tools/expense-calendar/personal/v3/',
  },
  build: { format: 'directory' },
  integrations: [sitemap({ customPages: STATIC_PAGES, filter: (page) => !page.includes('/contact/thanks/') })],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
