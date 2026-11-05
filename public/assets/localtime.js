/* Show times in the visitor's own time zone (2026-11-05).

   Pages are built with times in Eastern time (America/Toronto) so they read
   correctly without JavaScript. This script rewrites them in the visitor's
   time zone and locale:
     <time datetime="ISO" data-local="time">   -> "4:15 p.m." in local time
     <time datetime="ISO" data-local="datetime"> -> "Nov 3, 2026, 4:15 p.m."
     <span data-local-tz>Eastern time</span>  -> the visitor's zone name
   Activity log lists (.logd) are regrouped by the visitor's local day, so an
   entry made late in the evening in Ontario sits under the right date in
   India or Australia. Date-only values (blog dates) are left alone: they are
   calendar dates, not moments, and must not shift a day. */
(function () {
  'use strict';
  if (!window.Intl || !Intl.DateTimeFormat) return;
  var zone;
  try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return; }
  var lang = navigator.language || 'en-CA';
  function fmt(opts) { try { return new Intl.DateTimeFormat(lang, opts); } catch (e) { return new Intl.DateTimeFormat('en-CA', opts); } }
  var T = fmt({ hour: 'numeric', minute: '2-digit' });
  var DT = fmt({ year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  var DAY = fmt({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  var KEY = fmt({ year: 'numeric', month: '2-digit', day: '2-digit' });
  var ZN = fmt({ timeZoneName: 'long' });

  function zoneName() {
    try {
      var p = ZN.formatToParts(new Date()).filter(function (x) { return x.type === 'timeZoneName'; })[0];
      return p ? p.value : zone;
    } catch (e) { return zone; }
  }

  function regroup(list) {
    var lis = [].slice.call(list.querySelectorAll('li[data-t]'));
    if (!lis.length) return;
    var days = [], byKey = {};
    lis.forEach(function (li) {
      var d = new Date(li.getAttribute('data-t'));
      if (isNaN(d)) return;
      var k = KEY.format(d);
      if (!byKey[k]) { byKey[k] = { label: DAY.format(d), items: [] }; days.push(byKey[k]); }
      byKey[k].items.push(li);
    });
    var tpl = list.querySelector('section');
    if (!tpl) return;
    var frag = document.createDocumentFragment();
    days.forEach(function (day) {
      var s = document.createElement('section'), h = document.createElement('h3'), ol = document.createElement('ol');
      h.textContent = day.label;
      day.items.forEach(function (li) { ol.appendChild(li); });
      s.appendChild(h); s.appendChild(ol); frag.appendChild(s);
    });
    list.innerHTML = '';
    list.appendChild(frag);
    list.querySelectorAll('section').forEach(function (s) { s.hidden = !s.querySelector('li:not([hidden])'); });
  }

  function run() {
    document.querySelectorAll('time[data-local]').forEach(function (t) {
      var d = new Date(t.getAttribute('datetime'));
      if (isNaN(d)) return;
      t.textContent = (t.getAttribute('data-local') === 'datetime' ? DT : T).format(d);
      t.title = DT.format(d) + ' (' + zone + ')';
    });
    document.querySelectorAll('.logd').forEach(regroup);
    var name = zoneName();
    document.querySelectorAll('[data-local-tz]').forEach(function (el) { el.textContent = 'your time zone (' + name + ')'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
