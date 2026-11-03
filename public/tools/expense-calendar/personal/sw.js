/* Expense calendar offline worker.
   Bump VERSION with every release. A new worker waits until the person presses
   "Update now" in the page, so nobody is moved to a new version without choosing it.
   The worker only serves files it cached from this site; it sends nothing anywhere. */
var VERSION = 3;
var CACHE = 'expense-calendar-v' + VERSION;
var FILES = ['./', './v1/', './v2/', './v3/', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('expense-calendar-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  var path = url.pathname.replace(/index\.html$/, '');
  if (!/\/$/.test(path) && !/\.[a-z0-9]+$/i.test(path)) path += '/';
  e.respondWith(caches.match(path, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(req).catch(function () { return req.mode === 'navigate' ? caches.match('./') : Response.error(); });
  }));
});

self.addEventListener('message', function (e) {
  if (!e.data) return;
  if (e.data.type === 'version' && e.source) e.source.postMessage({ type: 'version', n: VERSION });
  if (e.data.type === 'skip') self.skipWaiting();
});
