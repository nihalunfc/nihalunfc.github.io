/* View and download counter for every page of nihalsulaiman.com.
   Uses the free, cookie-free Abacus counter API (abacus.jasoncameron.dev). Only a
   page or file name and a number are stored there: no cookies, nothing personal.

   Page views: one view per page per browser session (refreshing doesn't add more).
   Markup hooks:
     [data-views]                  shows this page's views
     [data-count-path="/blog/x/"]  shows views for another page (used on lists)
     a[data-open-count="x"]        counts clicks on an "Open the tool" link
     [data-opens="x"]              shows those clicks
   Every page gets a views line automatically: in the site footer (header.js adds a
   [data-views] slot), else in the page's own <footer>, else at the end of <body>.

   Downloads: any link to a file on this site (.zip, .csv, .xlsx, .pdf, .py, ...),
   or any link with a download attribute, is counted when clicked, and a small
   "N downloads" note is shown after it (not in the header or footer).
   Typing a file's address straight into the browser isn't counted: a static site
   only knows about clicks on its own pages.

   If the API is unreachable, the counters stay hidden and nothing breaks. */
(function () {
  if (window.__siteCounter) return;
  window.__siteCounter = true;
  var API = 'https://abacus.jasoncameron.dev', NS = 'nihalsulaiman-com';
  var FILE = /\.(zip|csv|tsv|xlsx|xls|xlsm|pdf|py|ipynb|r|sql|json|txt|md|docx|pptx|pbix|pbit|twb|twbx|parquet|gz)$/i;

  function key(s) { return (s || '').replace(/[^A-Za-z0-9_.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56) || 'home'; }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  /* File keys keep the readable end of the path plus a hash of the whole path, so two
     long paths with the same beginning never share a counter. */
  function fileKey(path) { var k = key(path); return 'd-' + (k.length > 48 ? k.slice(-48) : k) + '-' + hash(path); }
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n); }
  function get(path, k) { return fetch(API + path + NS + '/' + k).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function show(el, n, word) { if (n == null) return; el.textContent = fmt(n) + ' ' + word + (n === 1 ? '' : 's'); el.hidden = false; }

  function css() {
    if (document.getElementById('site-counter-css')) return;
    var s = document.createElement('style');
    s.id = 'site-counter-css';
    s.textContent = '.dl-cnt{font-size:.82em;opacity:.7;margin-left:.4em;white-space:nowrap;font-weight:400}' +
      '.pv-line{font-size:13px;opacity:.7;text-align:center;margin:24px auto 16px;padding:0 16px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
      '.pv-sep{margin:0 .4em}';
    document.head.appendChild(s);
  }

  /* A file link: same site, a file extension or a download attribute. */
  function filePath(a) {
    var href = a.getAttribute('href');
    if (!href || /^(blob:|data:|javascript:|mailto:|#)/i.test(href)) return null;
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    if (u.origin !== location.origin) return null;
    if (FILE.test(u.pathname) || a.hasAttribute('download')) return decodeURIComponent(u.pathname);
    return null;
  }
  function inChrome(el) { return !!(el.closest && el.closest('site-header, site-footer, .sh, .sf')); }

  function ensureViewSlot() {
    if (document.querySelector('[data-views]')) return;
    css();
    var span = document.createElement('span');
    span.setAttribute('data-views', '');
    span.hidden = true;
    var foot = document.querySelector('body > footer, footer.foot');
    if (foot) {
      var sep = document.createElement('span');
      sep.className = 'pv-sep pv-dot';
      sep.textContent = '·';
      sep.hidden = true;
      foot.appendChild(sep);
      foot.appendChild(span);
    } else {
      var p = document.createElement('p');
      p.className = 'pv-line';
      p.appendChild(span);
      document.body.appendChild(p);
    }
  }

  function run() {
    ensureViewSlot();

    var vk = 'v-' + key(location.pathname), seen = false;
    try { seen = sessionStorage.getItem('cnt:' + vk) === '1'; } catch (e) {}
    get(seen ? '/get/' : '/hit/', vk).then(function (d) {
      if (!d) return;
      try { sessionStorage.setItem('cnt:' + vk, '1'); } catch (e) {}
      document.querySelectorAll('[data-views]').forEach(function (el) {
        show(el, d.value, 'view');
        /* a separator dot next to the count (class pv-dot) appears with it */
        [el.previousElementSibling, el.nextElementSibling].forEach(function (s) { if (s && s.classList.contains('pv-dot')) s.hidden = false; });
      });
    });
    document.querySelectorAll('[data-count-path]').forEach(function (el) {
      get('/get/', 'v-' + key(el.dataset.countPath)).then(function (d) { if (d && d.value) show(el, d.value, 'view'); });
    });
    document.querySelectorAll('[data-opens]').forEach(function (el) {
      get('/get/', 'o-' + key(el.dataset.opens)).then(function (d) { if (d && d.value) show(el, d.value, 'open'); });
    });

    /* Download notes after each file link in the page body (one request per file). */
    var byFile = {};
    document.querySelectorAll('a[href]').forEach(function (a) {
      var p = filePath(a);
      if (!p || inChrome(a) || a.dataset.noCount !== undefined) return;
      var note = document.createElement('span');
      note.className = 'dl-cnt';
      note.hidden = true;
      a.insertAdjacentElement('afterend', note);
      (byFile[p] = byFile[p] || []).push(note);
    });
    if (Object.keys(byFile).length) css();
    Object.keys(byFile).forEach(function (p) {
      get('/get/', fileKey(p)).then(function (d) {
        if (d && d.value) byFile[p].forEach(function (el) { show(el, d.value, 'download'); });
      });
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (a.dataset.openCount) { try { fetch(API + '/hit/' + NS + '/o-' + key(a.dataset.openCount), { keepalive: true }); } catch (err) {} }
    var p = filePath(a);
    if (p) { try { fetch(API + '/hit/' + NS + '/' + fileKey(p), { keepalive: true }); } catch (err) {} }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
