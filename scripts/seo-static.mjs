// After `astro build`: the hand-written pages in public/ (tool apps, swarm demos, the disclaimer) don't go
// through the Astro layout, so give each one a canonical address and a little structured data if it has none.
// App sub-views inside a suite (e.g. /tools/operations-suite/hotels/housekeeping/) point their canonical at the
// suite itself, so search engines index the one page people should land on.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://nihalsulaiman.com';
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f === 'index.html') files.push(p); } };
walk('dist');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
let n = 0;
for (const f of files) {
  let h = readFileSync(f, 'utf8');
  if (/http-equiv="refresh"/i.test(h) || /rel="canonical"/.test(h) || !/<\/head>/i.test(h)) continue;
  const path = f.slice('dist'.length).replace(/\\/g, '/').replace(/index\.html$/, '');
  const suite = path.match(/^\/tools\/[^/]+-suite\/[^/]+\//)?.[0];
  const canonical = SITE + (suite && suite !== path ? suite : path);
  const title = unesc(h.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '');
  const desc = unesc(h.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '');
  let add = `<link rel="canonical" href="${esc(canonical)}">`;
  if (!/application\/ld\+json/.test(h) && canonical === SITE + path) {
    const app = path.startsWith('/tools/') || path.startsWith('/swarm/');
    const segs = path.split('/').filter(Boolean);
    const ld = {
      '@context': 'https://schema.org',
      '@graph': [
        app ? { '@type': 'WebApplication', name: title, description: desc || undefined, url: canonical, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (runs in the browser)', isAccessibleForFree: true, author: { '@type': 'Person', name: 'Nihal Sulaiman', url: SITE + '/' } }
          : { '@type': 'WebPage', name: title, description: desc || undefined, url: canonical, inLanguage: 'en-CA' },
        { '@type': 'BreadcrumbList', itemListElement: [{ name: 'Home', url: '/' }, ...segs.map((s, i) => ({ name: i === segs.length - 1 ? title : s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()), url: `/${segs.slice(0, i + 1).join('/')}/` }))]
          .map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.url })) },
      ],
    };
    add += `\n<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  }
  h = h.replace(/<\/head>/i, `${add}\n</head>`);
  writeFileSync(f, h); n++;
}
console.log(`seo-static: ${n} hand-written page(s) given a canonical address`);
