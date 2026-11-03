/* Visit counter. Counts one visit per page per browser session through the free,
   cookie-free Abacus counter API (abacus.jasoncameron.dev). Only a page name and a
   number are stored there: no IP log kept by this site, no cookies, nothing personal.
   Markup hooks:
     [data-views]                 shows this page's visits
     [data-count-path="/tools/x/"] shows visits for another page (used on lists)
     a[data-open-count="x"]       counts clicks on an "Open the tool" link
     [data-opens="x"]             shows those clicks
   If the API is unreachable, the counters stay hidden and nothing breaks. */
(function () {
  var API = 'https://abacus.jasoncameron.dev', NS = 'nihalsulaiman-com';
  function key(s) { return (s || '').replace(/[^A-Za-z0-9_.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56) || 'home'; }
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n); }
  function get(path, k) { return fetch(API + path + NS + '/' + k).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function show(el, n, word) { if (n == null) return; el.textContent = fmt(n) + ' ' + word + (n === 1 ? '' : 's'); el.hidden = false; }
  var vk = 'v-' + key(location.pathname), seen = false;
  try { seen = sessionStorage.getItem('cnt:' + vk) === '1'; } catch (e) {}
  get(seen ? '/get/' : '/hit/', vk).then(function (d) {
    if (!d) return;
    try { sessionStorage.setItem('cnt:' + vk, '1'); } catch (e) {}
    document.querySelectorAll('[data-views]').forEach(function (el) { show(el, d.value, 'visit'); });
  });
  document.querySelectorAll('[data-count-path]').forEach(function (el) {
    get('/get/', 'v-' + key(el.dataset.countPath)).then(function (d) { if (d && d.value) show(el, d.value, 'visit'); });
  });
  document.querySelectorAll('[data-opens]').forEach(function (el) {
    get('/get/', 'o-' + key(el.dataset.opens)).then(function (d) { if (d && d.value) show(el, d.value, 'open'); });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-open-count]');
    if (a) { try { fetch(API + '/hit/' + NS + '/o-' + key(a.dataset.openCount), { keepalive: true }); } catch (err) {} }
  });
})();
