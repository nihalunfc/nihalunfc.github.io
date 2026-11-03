import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Keep in step with SITE_URL in src/site.ts.
export default defineConfig({
  site: 'https://nihalunfc.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
