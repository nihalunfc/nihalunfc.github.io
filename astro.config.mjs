import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static pages in public/ that Astro doesn't build, so the sitemap lists them too.
const STATIC_PAGES = [
  '/swarm/', '/swarm/hotel/', '/swarm/energy/', '/swarm/wildfire/',
  '/tools/expense-calendar/', '/disclaimer/', '/learn/etl-course/',
].map((p) => 'https://nihalsulaiman.com' + p);

// Keep in step with SITE_URL in src/site.ts.
export default defineConfig({
  site: 'https://nihalsulaiman.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ customPages: STATIC_PAGES, filter: (page) => !page.includes('/contact/thanks/') })],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
