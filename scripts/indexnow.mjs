// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver and others, which share what they receive) which
// pages changed in a deploy, so they are crawled in hours. Google does not use IndexNow: it reads the sitemap.
// Sends only this site's own page addresses, nothing about visitors.
//
//   node scripts/indexnow.mjs hashes          after the build: write dist/indexnow.json, a fingerprint of every page in the sitemap
//   node scripts/indexnow.mjs changed <old>   list pages whose fingerprint differs from <old> (the live site's indexnow.json) or is new
//   node scripts/indexnow.mjs send <list>     send the addresses in <list> (one per line) to IndexNow; add --dry to print only
// Run by .github/workflows/deploy.yml.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const SITE = 'https://nihalsulaiman.com';
const KEY = '1349a5779689a7403f4dfe5c87061dfa'; // served at /1349a5779689a7403f4dfe5c87061dfa.txt (public/); never rename it
const [mode, file] = process.argv.slice(2);
const dry = process.argv.includes('--dry');

if (mode === 'hashes') {
  const xml = readdirSync('dist').filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(`dist/${f}`, 'utf8')).join('');
  const out = {};
  for (const [, url] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(url).pathname;
    const f = `dist${path}${path.endsWith('/') ? 'index.html' : ''}`;
    if (!existsSync(f)) continue;
    // ?v=<build id> on CSS and JS links changes every build; leave it out so only real changes count.
    const html = readFileSync(f, 'utf8').replace(/\?v=[a-z0-9]+/g, '');
    out[path] = createHash('sha1').update(html).digest('hex').slice(0, 16);
  }
  writeFileSync('dist/indexnow.json', JSON.stringify(out));
  console.log(`indexnow: fingerprinted ${Object.keys(out).length} page(s)`);
} else if (mode === 'changed') {
  const now = JSON.parse(readFileSync('dist/indexnow.json', 'utf8'));
  let old = {};
  try { old = JSON.parse(readFileSync(file, 'utf8')); } catch { console.error('indexnow: no earlier fingerprints, so every page counts as changed'); }
  console.log(Object.keys(now).filter((p) => old[p] !== now[p]).map((p) => SITE + p).join('\n'));
} else if (mode === 'send') {
  const list = readFileSync(file, 'utf8').split('\n').map((s) => s.trim()).filter((u) => u.startsWith(`${SITE}/`)).slice(0, 10000);
  console.log(`${list.length} changed page(s)${list.length ? `:\n${list.join('\n')}` : ''}`);
  if (!list.length || dry) process.exit(0);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: list }),
  });
  console.log(`IndexNow answered ${res.status} ${res.statusText}`); // 200 or 202 = received; anything else is only reported
} else {
  console.error('usage: node scripts/indexnow.mjs hashes | changed <old.json> | send <list.txt> [--dry]');
  process.exit(1);
}
