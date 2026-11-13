/* To-do lists (/todo/): nihal's personal lists for plans, trips, dates and places.

   Storage: always this browser first (localStorage "nihal.todo.v1"), so it opens instantly and
   works offline. Optionally synced to a Google Sheet through a Google Apps Script web app
   (/todo/sheet-backend.gs). The web app address and secret key live only in this browser
   ("nihal.todo.conn"), never in the site's code.

   Records
     list: { id, name, type, colour, date, place, order, status: active|archived, created, archived_at, updated }
     item: { id, list_id, task, notes, due, status: open|done|dropped|deleted, order, created, done_at, updated }
   Ticked (done) and crossed-off (dropped) items are "snaps": hidden from the list but kept, with the time.

   Sync: every change marks the record dirty. sync() posts the dirty records, the Sheet keeps the newer
   copy of each (by "updated") and answers with everything; local dirty records that are newer win. */
(function () {
  'use strict';
  var KEY = 'nihal.todo.v1', CONN = 'nihal.todo.conn';
  var COLOURS = ['#2563eb', '#0f766e', '#15803d', '#a16207', '#c2410c', '#b42318', '#9d174d', '#6d28d9', '#475569'];
  var $ = function (id) { return document.getElementById(id); };

  /* ------------------------------------------------------------ state */
  var S = load();
  var conn = loadConn();
  var current = S.current || null;
  var syncing = false, syncTimer = null, lastError = '';

  function blank() { return { lists: [], items: [], dirty: {}, current: null }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.lists) { s.dirty = s.dirty || {}; return s; } } catch (e) {}
    return blank();
  }
  function loadConn() { try { return JSON.parse(localStorage.getItem(CONN)) || {}; } catch (e) { return {}; } }
  function saveConn() { try { localStorage.setItem(CONN, JSON.stringify(conn)); } catch (e) {} }
  function persist() {
    S.current = current;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save in this browser (storage full or blocked).'); }
  }
  function now() { return new Date().toISOString(); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function touch(kind, rec) {
    rec.updated = now();
    S.dirty[kind + ':' + rec.id] = 1;
    persist(); render(); scheduleSync();
  }
  var list = function (id) { return S.lists.find(function (l) { return l.id === id; }); };
  var item = function (id) { return S.items.find(function (i) { return i.id === id; }); };
  function activeLists() { return S.lists.filter(function (l) { return l.status !== 'archived' && l.status !== 'deleted'; }).sort(byOrder); }
  function byOrder(a, b) { return (a.order || 0) - (b.order || 0) || String(a.created).localeCompare(String(b.created)); }
  function openItems(lid) { return S.items.filter(function (i) { return i.list_id === lid && i.status === 'open'; }).sort(byOrder); }
  function snaps(lid) {
    return S.items.filter(function (i) { return (i.status === 'done' || i.status === 'dropped') && (!lid || i.list_id === lid); })
      .sort(function (a, b) { return String(b.done_at).localeCompare(String(a.done_at)); });
  }

  /* ------------------------------------------------------------ dates */
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function addDays(ymd, n) { var p = ymd.split('-'); var d = new Date(+p[0], p[1] - 1, +p[2] + n); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function niceDate(ymd) {
    if (!ymd) return '';
    var t = today();
    if (ymd === t) return 'Today';
    if (ymd === addDays(t, 1)) return 'Tomorrow';
    if (ymd === addDays(t, -1)) return 'Yesterday';
    var p = ymd.split('-'), d = new Date(+p[0], p[1] - 1, +p[2]);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: p[0] == new Date().getFullYear() ? undefined : 'numeric' });
  }
  /* "today", "yesterday" or "on Fri, 13 Nov", for use inside a sentence. */
  function relDay(ymd) { var n = niceDate(ymd); return /^(Today|Tomorrow|Yesterday)$/.test(n) ? n.toLowerCase() : 'on ' + n; }
  function localDay(iso) { var d = new Date(iso); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function timeOf(iso) { return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ------------------------------------------------------------ actions */
  function addList(f) {
    var l = { id: uid(), name: f.name, type: f.type, colour: f.colour, date: f.date || '', place: f.place || '',
      order: S.lists.length ? Math.max.apply(null, S.lists.map(function (x) { return x.order || 0; })) + 1 : 1,
      status: 'active', created: now(), archived_at: '' };
    S.lists.push(l); current = l.id; touch('l', l); return l;
  }
  function addItem(lid, task, due) {
    var its = openItems(lid);
    var it = { id: uid(), list_id: lid, task: task, notes: '', due: due || '', status: 'open',
      order: its.length ? (its[0].order || 0) - 1 : 0, created: now(), done_at: '' };
    S.items.push(it); touch('i', it);
  }
  function setStatus(it, status, silent) {
    var prev = { status: it.status, done_at: it.done_at };
    it.status = status;
    it.done_at = status === 'open' ? '' : now();
    if (status === 'open') { var o = openItems(it.list_id); it.order = o.length ? (o[o.length - 1].order || 0) + 1 : 0; }
    touch('i', it);
    if (!silent && status !== 'open') toast(status === 'done' ? 'Done. Moved to snaps.' : 'Crossed off. Moved to snaps.', function () {
      it.status = prev.status; it.done_at = prev.done_at; touch('i', it);
    });
  }
  function removeItem(it) {
    var copy = Object.assign({}, it);
    it.status = 'deleted';
    touch('i', it);
    if (!conn.url) purgeDeleted();
    toast('Task deleted.', function () {
      var back = item(copy.id); if (back) Object.assign(back, copy); else { S.items.push(copy); back = copy; }
      back.status = copy.status; touch('i', back);
    });
  }
  function purgeDeleted() {
    S.items = S.items.filter(function (i) { if (i.status === 'deleted') { delete S.dirty['i:' + i.id]; return false; } return true; });
    S.lists = S.lists.filter(function (l) { if (l.status === 'deleted') { delete S.dirty['l:' + l.id]; return false; } return true; });
    persist();
  }

  /* ------------------------------------------------------------ render */
  var tab = 'lists';
  function render() {
    var lists = activeLists();
    if (current && (!list(current) || list(current).status !== 'active')) current = null;
    if (!current && lists.length) current = lists[0].id;
    var allSnaps = snaps();
    $('snapCount').textContent = allSnaps.length ? allSnaps.length : '';

    $('listBar').innerHTML = lists.map(function (l) {
      var n = openItems(l.id).length;
      return '<button class="td-lbtn" type="button" data-list="' + l.id + '"' + (l.id === current ? ' aria-current="true"' : '') + '>' +
        '<span class="td-swatch" style="background:' + esc(l.colour) + '"></span><span class="nm">' + esc(l.name) + '</span>' +
        '<span class="n">' + (n || '') + '</span></button>';
    }).join('');

    $('emptyAll').hidden = lists.length > 0;
    $('listBody').hidden = !lists.length;
    if (current) renderList(list(current));
    if (tab === 'snaps') renderSnaps();
    renderSync();
  }

  function renderList(l) {
    $('lSwatch').style.background = l.colour;
    $('lName').textContent = l.name;
    var meta = [l.type];
    if (l.date) meta.push(niceDate(l.date));
    if (l.place) meta.push(l.place);
    $('lMeta').textContent = meta.join(' · ');
    var its = openItems(l.id), t = today();
    $('items').innerHTML = its.map(function (i) {
      var due = '';
      if (i.due) due = '<span class="td-due' + (i.due < t ? ' late' : i.due === t ? ' today' : '') + '">' + esc(niceDate(i.due)) + '</span>';
      return '<li class="td-item" data-item="' + i.id + '">' +
        '<button class="td-handle" type="button" aria-label="Drag to reorder" title="Drag to reorder"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg></button>' +
        '<input class="td-check" type="checkbox" aria-label="Mark done: ' + esc(i.task) + '">' +
        '<button class="td-body" type="button"><span class="t">' + esc(i.task) + '</span>' +
        (i.notes ? '<span class="nt">' + esc(i.notes) + '</span>' : '') + due + '</button></li>';
    }).join('');
    var sn = snaps(l.id);
    $('allDone').hidden = !(its.length === 0 && sn.length > 0);
    $('listSnapCount').textContent = sn.length ? '(' + sn.length + ')' : '(none yet)';
    $('listSnapItems').innerHTML = sn.map(function (i) { return snapRow(i, false); }).join('');
  }

  function snapRow(i, showList) {
    var l = list(i.list_id);
    var when = (i.status === 'done' ? 'Done ' : 'Crossed off ') + relDay(localDay(i.done_at)) + ' at ' + timeOf(i.done_at);
    if (showList && l) when = '<span class="td-swatch" style="background:' + esc(l.colour) + '"></span>' + esc(l.name) + ' · ' + when;
    else when = esc(when);
    return '<li class="td-snap ' + i.status + '" data-item="' + i.id + '"><span class="mark" aria-hidden="true">' + (i.status === 'done' ? '✓' : '✕') + '</span>' +
      '<span class="tx"><span class="t">' + esc(i.task) + '</span><span class="when">' + when + '</span></span>' +
      '<button class="td-link" type="button" data-restore="' + i.id + '">Restore</button></li>';
  }

  function renderSnaps() {
    var f = $('snapFilter'), keep = f.value;
    f.innerHTML = '<option value="">All lists</option>' + S.lists.filter(function (l) { return l.status !== 'deleted'; }).sort(byOrder).map(function (l) {
      return '<option value="' + l.id + '">' + esc(l.name) + (l.status === 'archived' ? ' (snapped)' : '') + '</option>';
    }).join('');
    f.value = keep && list(keep) ? keep : '';
    var all = snaps(f.value || null), html = '', day = '';
    all.forEach(function (i) {
      var d = localDay(i.done_at);
      if (d !== day) { if (day) html += '</ul>'; day = d; html += '<h3 class="td-day">' + esc(niceDate(d)) + '</h3><ul class="td-snaplist">'; }
      html += snapRow(i, !f.value);
    });
    if (day) html += '</ul>';
    $('snapDays').innerHTML = html || '<p class="td-note">Nothing here yet. Tick a task and it lands here with the time.</p>';
    var arch = S.lists.filter(function (l) { return l.status === 'archived'; }).sort(function (a, b) { return String(b.archived_at).localeCompare(String(a.archived_at)); });
    $('archived').innerHTML = arch.length ? '<h3 class="td-day">Snapped lists</h3>' + arch.map(function (l) {
      var o = openItems(l.id).length, d = snaps(l.id).length;
      return '<div class="td-arch"><span class="td-swatch" style="background:' + esc(l.colour) + '"></span><span class="tx"><b>' + esc(l.name) + '</b>' +
        '<span class="when">' + esc(l.type) + (l.date ? ' · ' + esc(niceDate(l.date)) : '') + ' · snapped ' + esc(relDay(localDay(l.archived_at))) + ' · ' + d + ' done, ' + o + ' left open</span></span>' +
        '<button class="td-link" type="button" data-unarchive="' + l.id + '">Bring back</button></div>';
    }).join('') : '';
  }

  function renderSync() {
    var chip = $('syncChip'), n = Object.keys(S.dirty).length;
    chip.className = 'td-sync';
    if (!conn.url) { $('syncText').textContent = 'Saved in this browser'; }
    else if (syncing) { chip.classList.add('wait'); $('syncText').textContent = 'Syncing…'; }
    else if (lastError) { chip.classList.add('err'); $('syncText').textContent = navigator.onLine ? 'Sync failed, will retry' : 'Offline, ' + n + ' change' + (n === 1 ? '' : 's') + ' waiting'; }
    else if (n) { chip.classList.add('wait'); $('syncText').textContent = n + ' change' + (n === 1 ? '' : 's') + ' to sync'; }
    else { chip.classList.add('ok'); $('syncText').textContent = 'Synced with Google Sheet' + (conn.last ? ' · ' + timeOf(conn.last) : ''); }
    $('connState').textContent = conn.url ? (lastError ? 'Connected, last sync failed: ' + lastError : 'Connected.' + (conn.last ? ' Last synced ' + relDay(localDay(conn.last)) + ' at ' + timeOf(conn.last) + '.' : '')) : 'Not connected. Lists are saved in this browser only.';
  }

  /* ------------------------------------------------------------ events */
  $('listBar').addEventListener('click', function (e) {
    var b = e.target.closest('[data-list]'); if (!b) return;
    current = b.dataset.list; persist(); render();
  });
  $('addForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('addTask').value.trim(); if (!v || !current) return;
    addItem(current, v, $('addDue').value);
    $('addTask').value = ''; $('addDue').value = ''; $('addTask').focus();
  });
  $('items').addEventListener('change', function (e) {
    if (!e.target.classList.contains('td-check')) return;
    var li = e.target.closest('[data-item]'), it = item(li.dataset.item);
    li.classList.add('leaving');
    setTimeout(function () { setStatus(it, 'done'); }, 380);
  });
  $('items').addEventListener('click', function (e) {
    var b = e.target.closest('.td-body'); if (b) openItem(item(b.closest('[data-item]').dataset.item));
  });
  document.addEventListener('click', function (e) {
    var r = e.target.closest('[data-restore]');
    if (r) { var it = item(r.dataset.restore); var l = list(it.list_id); setStatus(it, 'open', true); if (l && l.status === 'archived') { l.status = 'active'; touch('l', l); } toast('Back on ' + (l ? l.name : 'its list') + '.'); return; }
    var u = e.target.closest('[data-unarchive]');
    if (u) { var L = list(u.dataset.unarchive); L.status = 'active'; L.archived_at = ''; current = L.id; touch('l', L); toast(L.name + ' is back in your lists.'); }
  });

  /* Tabs */
  function showTab(t) {
    tab = t;
    $('tabLists').setAttribute('aria-selected', t === 'lists'); $('tabSnaps').setAttribute('aria-selected', t === 'snaps');
    $('viewLists').hidden = t !== 'lists'; $('viewSnaps').hidden = t !== 'snaps';
    render();
  }
  $('tabLists').onclick = function () { showTab('lists'); };
  $('tabSnaps').onclick = function () { showTab('snaps'); };
  $('snapFilter').onchange = renderSnaps;

  /* Item dialog */
  var editing = null;
  function openItem(it) {
    editing = it;
    $('iTask').value = it.task; $('iNotes').value = it.notes || ''; $('iDue').value = it.due || '';
    $('iList').innerHTML = activeLists().map(function (l) { return '<option value="' + l.id + '">' + esc(l.name) + '</option>'; }).join('');
    $('iList').value = it.list_id;
    $('itemDlg').showModal();
  }
  $('itemDlg').addEventListener('close', function () {
    if ($('itemDlg').returnValue === 'save' && editing) {
      var it = editing, task = $('iTask').value.trim();
      if (task) { it.task = task; it.notes = $('iNotes').value.trim(); it.due = $('iDue').value; it.list_id = $('iList').value; touch('i', it); }
    }
    editing = null;
  });
  $('iDrop').onclick = function () { var it = editing; $('itemDlg').close(); setStatus(it, 'dropped'); };
  $('iDelete').onclick = function () { var it = editing; $('itemDlg').close(); removeItem(it); };

  /* List dialog */
  var editingList = null, pickColour = COLOURS[0];
  function colourButtons() {
    $('lfColours').innerHTML = COLOURS.map(function (c) { return '<button type="button" data-c="' + c + '" style="background:' + c + '" aria-label="Colour ' + c + '" aria-pressed="' + (c === pickColour) + '"></button>'; }).join('');
  }
  $('lfColours').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (b) { pickColour = b.dataset.c; colourButtons(); } });
  function openList(l) {
    editingList = l || null;
    $('listDlgTitle').textContent = l ? 'Edit list' : 'New list';
    $('lfName').value = l ? l.name : ''; $('lfType').value = l ? l.type : 'Plan'; $('lfDate').value = l ? l.date : ''; $('lfPlace').value = l ? l.place : '';
    pickColour = l ? l.colour : COLOURS[S.lists.length % COLOURS.length]; colourButtons();
    $('lfDelete').hidden = $('lfArchive').hidden = !l;
    $('listDlg').showModal(); $('lfName').focus();
  }
  $('newList').onclick = $('emptyNew').onclick = function () { openList(null); };
  $('lEdit').onclick = function () { openList(list(current)); };
  $('listDlg').addEventListener('close', function () {
    if ($('listDlg').returnValue !== 'save') return;
    var f = { name: $('lfName').value.trim(), type: $('lfType').value, date: $('lfDate').value, place: $('lfPlace').value.trim(), colour: pickColour };
    if (!f.name) return;
    if (editingList) { Object.assign(editingList, f); touch('l', editingList); } else addList(f);
  });
  $('lfArchive').onclick = function () {
    var l = editingList; $('listDlg').close();
    l.status = 'archived'; l.archived_at = now(); touch('l', l);
    toast(l.name + ' snapped. Find it under Snaps.', function () { l.status = 'active'; l.archived_at = ''; current = l.id; touch('l', l); });
  };
  $('lfDelete').onclick = function () {
    var l = editingList, n = S.items.filter(function (i) { return i.list_id === l.id && i.status !== 'deleted'; }).length;
    if (n && !confirm('Delete "' + l.name + '" and its ' + n + ' task' + (n === 1 ? '' : 's') + ', snaps included? To keep a record, use "Snap whole list" instead.')) return;
    $('listDlg').close();
    S.items.forEach(function (i) { if (i.list_id === l.id && i.status !== 'deleted') { i.status = 'deleted'; i.updated = now(); S.dirty['i:' + i.id] = 1; } });
    l.status = 'deleted'; touch('l', l);
    if (!conn.url) { purgeDeleted(); render(); }
  };

  /* Sample lists (sample data, clearly named) */
  $('loadSample').onclick = function () {
    var a = addList({ name: 'Sample: weekend trip', type: 'Trip', colour: COLOURS[0], date: addDays(today(), 12), place: 'Sample place' });
    ['Book a place to stay', 'Check the weather', 'Pack chargers and power bank', 'Download offline maps'].reverse().forEach(function (t) { addItem(a.id, t); });
    var b = addList({ name: 'Sample: date night', type: 'Date', colour: COLOURS[6], date: addDays(today(), 3), place: '' });
    ['Pick a restaurant', 'Reserve a table', 'Buy flowers'].reverse().forEach(function (t) { addItem(b.id, t); });
    current = a.id; persist(); render();
  };

  /* Drag to reorder (mouse and touch) */
  var drag = null;
  $('items').addEventListener('pointerdown', function (e) {
    var h = e.target.closest('.td-handle'); if (!h) return;
    e.preventDefault();
    var li = h.closest('.td-item');
    drag = { li: li, y: e.clientY, id: e.pointerId };
    li.classList.add('dragging'); h.setPointerCapture(e.pointerId);
  });
  $('items').addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var li = drag.li, dy = e.clientY - drag.y;
    li.style.transform = 'translateY(' + dy + 'px)';
    var prev = li.previousElementSibling, next = li.nextElementSibling;
    if (prev && dy < -prev.offsetHeight / 2) { li.parentNode.insertBefore(li, prev); drag.y -= prev.offsetHeight; li.style.transform = 'translateY(' + (e.clientY - drag.y) + 'px)'; }
    else if (next && dy > next.offsetHeight / 2) { li.parentNode.insertBefore(next, li); drag.y += next.offsetHeight; li.style.transform = 'translateY(' + (e.clientY - drag.y) + 'px)'; }
  });
  function endDrag() {
    if (!drag) return;
    drag.li.classList.remove('dragging'); drag.li.style.transform = '';
    drag = null;
    var changed = false;
    Array.prototype.forEach.call($('items').children, function (li, n) {
      var it = item(li.dataset.item); if (it.order !== n) { it.order = n; it.updated = now(); S.dirty['i:' + it.id] = 1; changed = true; }
    });
    if (changed) { persist(); render(); scheduleSync(); }
  }
  $('items').addEventListener('pointerup', endDrag);
  $('items').addEventListener('pointercancel', endDrag);

  /* Toast with undo */
  var toastTimer = null, undoFn = null;
  function toast(msg, undo) {
    $('toastText').textContent = msg; undoFn = undo || null;
    $('toastUndo').hidden = !undo; $('toast').hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { $('toast').hidden = true; undoFn = null; }, 5000);
  }
  $('toastUndo').onclick = function () { $('toast').hidden = true; if (undoFn) { var f = undoFn; undoFn = null; f(); } };

  /* ------------------------------------------------------------ settings, backup */
  $('openSettings').onclick = $('syncChip').onclick = function () { $('sUrl').value = conn.url || ''; $('sKey').value = conn.key || ''; renderSync(); $('setDlg').showModal(); };
  $('sConnect').onclick = function () {
    var url = $('sUrl').value.trim(), key = $('sKey').value.trim();
    if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) { $('connState').textContent = 'That does not look like an Apps Script web app address (it starts with https://script.google.com/).'; return; }
    if (!key) { $('connState').textContent = 'Paste the secret key that setup() printed.'; return; }
    conn = { url: url, key: key, last: null }; saveConn();
    // First connect: send everything in this browser so the Sheet gets a full copy.
    S.lists.forEach(function (l) { S.dirty['l:' + l.id] = 1; }); S.items.forEach(function (i) { S.dirty['i:' + i.id] = 1; });
    persist(); sync(true);
  };
  $('sSyncNow').onclick = function () { sync(true); };
  $('sDisconnect').onclick = function () { conn = {}; saveConn(); lastError = ''; renderSync(); $('sUrl').value = $('sKey').value = ''; };
  $('sClear').onclick = function () {
    if (!confirm('Remove every list from this browser? ' + (conn.url ? 'Your Google Sheet keeps its copy and comes back on the next sync.' : 'Save a backup first if you want to keep them.'))) return;
    S = blank(); current = null; persist(); render();
    if (conn.url) sync(true);
  };
  function download(name, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name; a.setAttribute('data-no-count', '');
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $('sExport').onclick = function () {
    download('todo-lists-' + today() + '.json', JSON.stringify({ app: 'nihal-todo', version: 1, saved: now(), lists: S.lists, items: S.items.filter(function (i) { return i.status !== 'deleted'; }) }, null, 2), 'application/json');
  };
  $('sCsv').onclick = function () {
    var q = function (v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [['list', 'list kind', 'task', 'notes', 'due', 'status', 'created', 'done at']];
    S.items.filter(function (i) { return i.status !== 'deleted'; }).forEach(function (i) {
      var l = list(i.list_id) || {};
      rows.push([l.name, l.type, i.task, i.notes, i.due, i.status, i.created, i.done_at]);
    });
    download('todo-lists-' + today() + '.csv', rows.map(function (r) { return r.map(q).join(','); }).join('\r\n'), 'text/csv');
  };
  $('sImport').onchange = function (e) {
    var f = e.target.files[0]; if (!f) return;
    f.text().then(function (t) {
      var d = JSON.parse(t);
      if (!d || !Array.isArray(d.lists) || !Array.isArray(d.items)) throw new Error('bad');
      var n = 0;
      d.lists.forEach(function (l) { if (!list(l.id)) { S.lists.push(l); S.dirty['l:' + l.id] = 1; n++; } });
      d.items.forEach(function (i) { if (!item(i.id)) { S.items.push(i); S.dirty['i:' + i.id] = 1; } });
      persist(); render(); scheduleSync();
      $('connState').textContent = 'Restored ' + n + ' list' + (n === 1 ? '' : 's') + ' from the backup (lists already here were kept).';
    }).catch(function () { $('connState').textContent = 'That file is not a to-do lists backup.'; });
    e.target.value = '';
  };

  /* ------------------------------------------------------------ sync with Google Sheet */
  function scheduleSync() { if (!conn.url) return; clearTimeout(syncTimer); syncTimer = setTimeout(sync, 1500); }
  function sync(manual) {
    if (!conn.url || syncing) return Promise.resolve();
    if (!navigator.onLine) { lastError = 'offline'; renderSync(); return Promise.resolve(); }
    syncing = true; renderSync();
    var sent = {};
    var lists = [], items = [];
    Object.keys(S.dirty).forEach(function (k) {
      var kind = k[0], id = k.slice(2), r = kind === 'l' ? list(id) : item(id);
      if (!r) { delete S.dirty[k]; return; }
      sent[k] = r.updated;
      (kind === 'l' ? lists : items).push(r);
    });
    return fetch(conn.url, { method: 'POST', body: JSON.stringify({ key: conn.key, action: 'sync', lists: lists, items: items }) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d.ok) throw new Error(d.error || 'the Sheet refused the request');
        Object.keys(sent).forEach(function (k) {
          var r = k[0] === 'l' ? list(k.slice(2)) : item(k.slice(2));
          if (!r || r.updated === sent[k]) delete S.dirty[k];
        });
        S.lists = merge(S.lists, d.lists, 'l');
        S.items = merge(S.items, d.items, 'i');
        conn.last = now(); saveConn(); lastError = '';
        persist(); render();
        if (manual) $('connState').textContent = 'Synced: ' + activeLists().length + ' lists, ' + S.items.filter(function (i) { return i.status === 'open'; }).length + ' open tasks, ' + snaps().length + ' snaps.';
      })
      .catch(function (err) { lastError = String(err.message || err); })
      .then(function () { syncing = false; renderSync(); if (Object.keys(S.dirty).length && !lastError) scheduleSync(); });
  }
  /* The Sheet's copy wins unless this browser has a newer unsynced change. Records gone from the
     Sheet (deleted there, or deleted here and now synced) disappear unless they are still unsynced. */
  function merge(local, remote, kind) {
    var byId = {}, out = [];
    local.forEach(function (r) { byId[r.id] = r; });
    var seen = {};
    (remote || []).forEach(function (r) {
      seen[r.id] = 1;
      var mine = byId[r.id];
      if (mine && S.dirty[kind + ':' + r.id] && String(mine.updated) > String(r.updated)) out.push(mine);
      else out.push(r);
    });
    local.forEach(function (r) { if (!seen[r.id] && S.dirty[kind + ':' + r.id] && r.status !== 'deleted') out.push(r); });
    return out;
  }

  window.addEventListener('online', function () { lastError = ''; sync(); });
  window.addEventListener('offline', renderSync);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') sync(); });
  setInterval(function () { if (document.visibilityState === 'visible') sync(); }, 60000);
  window.addEventListener('storage', function (e) { if (e.key === KEY) { S = load(); render(); } });

  /* Offline app shell */
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/todo/sw.js', { scope: '/todo/' }).catch(function () {});

  render();
  sync();
})();
