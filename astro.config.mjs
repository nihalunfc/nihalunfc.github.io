import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeFigures from './src/plugins/rehype-figures.mjs';

// Static pages in public/ that Astro doesn't build, so the sitemap lists them too.
const STATIC_PAGES = [
  '/swarm/explorer/', '/swarm/grid-batteries/', '/swarm/wildfire-drones/', '/swarm/hotel-operations/',
  '/projects/hospitality-bi/overview/', '/projects/self-healing-pipelines/compare/', '/projects/self-healing-pipelines/command-centre/',
  '/tools/workforce-suite/hotels/', '/tools/operations-suite/hotels/',
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
    // The expense calendar moved to fibub (2026-11-07). /tools/expense-calendar/personal/ stays as a
    // "moved" page that helps people save their bills; v3 stays only to unlock passcode-locked data.
    '/tools/expense-calendar': 'https://fibub.com/money/bill-calendar/',
    '/tools/expense-calendar/v1': '/tools/expense-calendar/personal/',
    '/tools/expense-calendar/v2': '/tools/expense-calendar/personal/',
    '/tools/expense-calendar/v3': '/tools/expense-calendar/personal/',
    '/tools/expense-calendar/personal/v1': '/tools/expense-calendar/personal/',
    '/tools/expense-calendar/personal/v2': '/tools/expense-calendar/personal/',
  },
  integrations: [sitemap({ customPages: STATIC_PAGES, filter: (page) => !page.includes('/contact/thanks/') })],
  // Load the next page while the reader hovers or taps a link, so clicks feel instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Inline the small page CSS Astro generates, saving a request per page.
  build: { format: 'directory', inlineStylesheets: 'always' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    rehypePlugins: [rehypeFigures],
  },
});
