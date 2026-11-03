// Prints /about/cv/ to public/nihal-sulaiman-cv.pdf, the file the header's "CV (PDF)" link opens.
// Run after any CV change: `npm run build && npm run cv:pdf`, then build again and commit the PDF.
// Needs Playwright with Chromium (preinstalled in Claude Code cloud sessions; elsewhere `npx playwright install chromium`).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIST = path.join(__dirname, '..', 'dist');
const OUT = path.join(__dirname, '..', 'public', 'nihal-sulaiman-cv.pdf');
const SITE = 'https://nihalsulaiman.com';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  let p = path.join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (p.endsWith('/')) p = path.join(p, 'index.html');
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(0, async () => {
  const port = server.address().port;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/about/cv/`, { waitUntil: 'networkidle' });
    // Links in the PDF must point at the live site, not at this local server.
    await page.evaluate((site) => {
      document.querySelectorAll('a[href]').forEach((a) => {
        const h = a.getAttribute('href');
        if (h.startsWith('/')) a.setAttribute('href', site + h);
      });
    }, SITE);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: OUT, format: 'Letter', scale: 0.8, printBackground: false, margin: { top: '0.45in', bottom: '0.45in', left: '0.5in', right: '0.5in' } });
    console.log('Wrote', OUT, fs.statSync(OUT).size, 'bytes');
  } finally {
    await browser.close();
    server.close();
  }
});
