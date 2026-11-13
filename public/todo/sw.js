/* Offline shell for /todo/. Pages and site files: network first, cache as fallback, so updates show
   straight away when online and the app still opens offline. Calls to Google are never cached. */
var CACHE = 'nihal-todo-v1';
var SHELL = ['/todo/', '/todo/todo.css?v=1', '/todo/todo.js?v=1', '/todo/manifest.webmanifest', '/todo/icon.svg',
  '/assets/site.css', '/assets/header.js', '/assets/fonts/fonts.css', '/assets/fonts/inter-latin-wght-normal.woff2'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('nihal-todo-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request).then(function (m) { return m || (e.request.mode === 'navigate' ? caches.match('/todo/') : Response.error()); });
  }));
});
