// Turns every Markdown image into a figure with a "Download" button, at build time.
// - Adds width/height (read from the file in public/), so the page doesn't jump while it loads.
// - Adds loading="lazy" and decoding="async", so images below the fold load only when needed.
// - The button is a plain link with a download attribute: no script, no extra request,
//   and the site counter (public/assets/counter.js) counts each click as a download.
import { readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

function size(src) {
  if (!src || !src.startsWith('/')) return null;
  try {
    const b = readFileSync(join(process.cwd(), 'public', decodeURIComponent(src.split(/[?#]/)[0])));
    if (b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    if (b[0] === 0xff && b[1] === 0xd8) { // JPEG: walk to the SOF marker
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1], len = b.readUInt16BE(i + 2);
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
        i += 2 + len;
      }
    }
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP' && b.toString('ascii', 12, 16) === 'VP8X')
      return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  } catch { /* file not in public/ (external image): leave it */ }
  return null;
}

const ext = (src) => (src.split(/[?#]/)[0].split('.').pop() || '').toUpperCase();

export default function rehypeFigures() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        // A paragraph that holds only an image (and whitespace) becomes a figure.
        if (child.type === 'element' && child.tagName === 'p') {
          const kids = child.children.filter((k) => !(k.type === 'text' && !k.value.trim()));
          if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
            const img = kids[0], src = String(img.properties.src || '');
            const d = size(src);
            img.properties.loading = 'lazy';
            img.properties.decoding = 'async';
            if (d) { img.properties.width = d.w; img.properties.height = d.h; }
            const local = src.startsWith('/');
            return {
              type: 'element', tagName: 'figure', properties: { className: ['fig'] },
              children: [img].concat(local ? [{
                type: 'element', tagName: 'span', properties: { className: ['fig-tools'] },
                children: [{
                  type: 'element', tagName: 'a',
                  properties: { className: ['fig-dl'], href: src, download: basename(src.split(/[?#]/)[0]), 'aria-label': 'Download this image (' + ext(src) + ')' },
                  children: [{ type: 'text', value: '↓ Download ' + ext(src) }],
                }],
              }] : []),
            };
          }
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
