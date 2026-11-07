/* The expense calendar has moved to fibub.com/money/bill-calendar/.
   This worker replaces the old offline one: it clears the old cache, removes itself and reloads open
   pages, so people see the "moved" page with the button to save their bills. It sends nothing anywhere. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('expense-calendar-') === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.registration.unregister(); }).then(function () { return self.clients.matchAll({ type: 'window' }); }).then(function (cs) {
    cs.forEach(function (c) { if (c.url.indexOf('/v3/') < 0) c.navigate(c.url); });
  }));
});
