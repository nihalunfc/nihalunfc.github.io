/**
 * To-do lists: Google Sheet backend for nihalsulaiman.com/todo/
 *
 * Paste this into Extensions > Apps Script of your own Google Sheet, then:
 *   1. Run setup() once. It makes and formats the Lists, Items and Snaps tabs and prints a secret key in the log.
 *   2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the address.
 *   3. On /todo/ open "Storage and backup", paste the address and the key, press "Connect and sync".
 *
 * The key is kept in this script's Script Properties, not in the code, so this file has no secrets in it.
 * Without the key the web app returns nothing and changes nothing. Run newKey() to replace it.
 *
 * Tabs
 *   Lists  one row per list (plan, trip, date, place ...).
 *   Items  open tasks, sorted by list and order.
 *   Snaps  ticked (done) and crossed-off (dropped) tasks with the time, newest first. Kept for good.
 * You can type in the Sheet too: add an Items row with a list name and a task (id can stay empty).
 * Change a status to "done" and the row moves to Snaps on the next sync. Edits stamp the "updated" column.
 */

var TABS = {
  Lists: ['id', 'name', 'type', 'colour', 'date', 'place', 'order', 'status', 'created', 'archived_at', 'updated'],
  Items: ['id', 'list_id', 'list', 'task', 'notes', 'due', 'status', 'order', 'created', 'done_at', 'updated'],
  Snaps: ['id', 'list_id', 'list', 'task', 'notes', 'due', 'status', 'order', 'created', 'done_at', 'updated']
};
var DAY_COLS = ['date', 'due'];                                         // calendar dates, yyyy-mm-dd
var TIME_COLS = ['created', 'archived_at', 'done_at', 'updated'];       // moments, shown in the Sheet's time zone
var WIDTHS = { id: 110, list_id: 110, name: 220, list: 180, task: 320, notes: 280, type: 90, colour: 80, place: 160, status: 90, order: 60 };

/* ------------------------------------------------------------------ setup */
function setup() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var cols = TABS[name];
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#f4f4f5');
    sh.setFrozenRows(1);
    cols.forEach(function (c, i) {
      sh.setColumnWidth(i + 1, WIDTHS[c] || 140);
      var r = sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1);
      if (DAY_COLS.indexOf(c) >= 0) r.setNumberFormat('yyyy-mm-dd');
      if (TIME_COLS.indexOf(c) >= 0) r.setNumberFormat('yyyy-mm-dd hh:mm');
    });
    var status = sh.getRange(2, cols.indexOf('status') + 1, sh.getMaxRows() - 1, 1);
    var options = name === 'Lists' ? ['active', 'archived'] : ['open', 'done', 'dropped'];
    status.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(options, true).setAllowInvalid(false).build());
    if (name === 'Lists') {
      sh.getRange(2, cols.indexOf('type') + 1, sh.getMaxRows() - 1, 1).setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(['Plan', 'Trip', 'Date', 'Place', 'Shopping', 'Event', 'Other'], true).build());
    }
    // Hide the machine columns so the Sheet reads like a plain list.
    ['id', 'list_id', 'colour', 'order'].forEach(function (c) { var i = cols.indexOf(c); if (i >= 0) sh.hideColumns(i + 1); });
  });
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('KEY')) props.setProperty('KEY', makeKey());
  Logger.log('Your secret key (paste it on /todo/, keep it private): ' + props.getProperty('KEY'));
}

function newKey() {
  var k = makeKey();
  PropertiesService.getScriptProperties().setProperty('KEY', k);
  Logger.log('New secret key: ' + k + '  (the old one stops working now)');
}

function makeKey() { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''); }

/* ------------------------------------------------------------------ web app */
function doGet() { return json({ ok: true, app: 'todo-lists', note: 'POST with your key to sync.' }); }

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'bad request' }); }
  var key = PropertiesService.getScriptProperties().getProperty('KEY');
  if (!key || body.key !== key) return json({ ok: false, error: 'wrong key' });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var db = readAll();
    if (body.action === 'sync') { apply(db, body.lists || [], body.items || []); writeAll(db); }
    return json({ ok: true, lists: db.lists, items: db.items });
  } finally { lock.releaseLock(); }
}

function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* Incoming records replace the Sheet's copy only when they are newer. Deleted ones are removed. */
function apply(db, lists, items) {
  var L = index(db.lists), I = index(db.items);
  lists.forEach(function (r) {
    var cur = L[r.id];
    if (cur && String(cur.updated) >= String(r.updated)) return;
    if (r.status === 'deleted') {
      db.lists = db.lists.filter(function (x) { return x.id !== r.id; });
      db.items = db.items.filter(function (x) { return x.list_id !== r.id; });
      return;
    }
    if (cur) Object.assign(cur, pick(r, TABS.Lists)); else { db.lists.push(pick(r, TABS.Lists)); L[r.id] = r; }
  });
  I = index(db.items);
  items.forEach(function (r) {
    var cur = I[r.id];
    if (cur && String(cur.updated) >= String(r.updated)) return;
    if (r.status === 'deleted') { db.items = db.items.filter(function (x) { return x.id !== r.id; }); return; }
    if (cur) Object.assign(cur, pick(r, TABS.Items)); else db.items.push(pick(r, TABS.Items));
  });
}

function index(arr) { var o = {}; arr.forEach(function (r) { o[r.id] = r; }); return o; }
function pick(r, cols) { var o = {}; cols.forEach(function (c) { if (c in r) o[c] = r[c] == null ? '' : r[c]; }); return o; }

/* ------------------------------------------------------------------ Sheet <-> records */
function readAll() {
  var ss = SpreadsheetApp.getActive(), tz = ss.getSpreadsheetTimeZone(), stamp = new Date().toISOString();
  var lists = readTab(ss.getSheetByName('Lists'), TABS.Lists, tz);
  var items = readTab(ss.getSheetByName('Items'), TABS.Items, tz).concat(readTab(ss.getSheetByName('Snaps'), TABS.Snaps, tz));
  // Tidy rows typed by hand: give them ids, times and a list.
  lists.forEach(function (l, n) {
    if (!l.id) l.id = newId();
    if (!l.status) l.status = 'active';
    if (!l.type) l.type = 'Plan';
    if (!l.colour) l.colour = '#475569';
    if (l.order === '') l.order = n + 1;
    if (!l.created) l.created = stamp;
    if (!l.updated) l.updated = stamp;
  });
  var byName = {}; lists.forEach(function (l) { byName[String(l.name).toLowerCase()] = l; });
  var byId = index(lists);
  items.forEach(function (i) {
    if (!i.id) i.id = newId();
    if (!i.list_id || !byId[i.list_id]) {
      var name = String(i.list || 'Inbox'), l = byName[name.toLowerCase()];
      if (!l) {
        l = { id: newId(), name: name, type: 'Plan', colour: '#475569', date: '', place: '', order: lists.length + 1, status: 'active', created: stamp, archived_at: '', updated: stamp };
        lists.push(l); byName[name.toLowerCase()] = l; byId[l.id] = l;
      }
      i.list_id = l.id;
    }
    i.status = String(i.status || 'open').toLowerCase();
    if (i.status === 'checked' || i.status === 'true' || i.status === 'x') i.status = 'done';
    if ((i.status === 'done' || i.status === 'dropped') && !i.done_at) i.done_at = i.updated || stamp;
    if (i.status === 'open') i.done_at = '';
    if (i.order === '') i.order = 0;
    if (!i.created) i.created = stamp;
    if (!i.updated) i.updated = stamp;
  });
  return { lists: lists, items: items };
}

function readTab(sh, cols, tz) {
  if (!sh || sh.getLastRow() < 2) return [];
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, head.length).getValues();
  return rows.filter(function (r) { return r.some(function (v) { return v !== '' && v !== null; }); }).map(function (r) {
    var o = {};
    cols.forEach(function (c) {
      var i = head.indexOf(c), v = i >= 0 ? r[i] : '';
      if (v instanceof Date) v = DAY_COLS.indexOf(c) >= 0 ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : v.toISOString();
      if (c === 'order') v = v === '' ? '' : Number(v);
      o[c] = v === null ? '' : (typeof v === 'number' || typeof v === 'string' ? v : String(v));
    });
    return o;
  });
}

function writeAll(db) {
  var ss = SpreadsheetApp.getActive(), tz = ss.getSpreadsheetTimeZone(), names = {};
  db.lists.forEach(function (l) { names[l.id] = l.name; });
  db.items.forEach(function (i) { i.list = names[i.list_id] || i.list || ''; });
  var lists = db.lists.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  var order = {}; lists.forEach(function (l, n) { order[l.id] = n; });
  var open = db.items.filter(function (i) { return i.status === 'open'; })
    .sort(function (a, b) { return (order[a.list_id] - order[b.list_id]) || ((a.order || 0) - (b.order || 0)); });
  var snaps = db.items.filter(function (i) { return i.status !== 'open'; })
    .sort(function (a, b) { return String(b.done_at).localeCompare(String(a.done_at)); });
  writeTab(ss.getSheetByName('Lists'), TABS.Lists, lists, tz);
  writeTab(ss.getSheetByName('Items'), TABS.Items, open, tz);
  writeTab(ss.getSheetByName('Snaps'), TABS.Snaps, snaps, tz);
}

function writeTab(sh, cols, recs, tz) {
  var last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, cols.length).clearContent();
  if (!recs.length) return;
  var rows = recs.map(function (r) {
    return cols.map(function (c) {
      var v = r[c] == null ? '' : r[c];
      if (v && DAY_COLS.indexOf(c) >= 0) return Utilities.parseDate(String(v), tz, 'yyyy-MM-dd');
      if (v && TIME_COLS.indexOf(c) >= 0) return new Date(v);
      return v;
    });
  });
  sh.getRange(2, 1, rows.length, cols.length).setValues(rows);
}

function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* Typing in the Sheet stamps "updated", so the app takes your Sheet edit over its older copy. */
function onEdit(e) {
  var sh = e.range.getSheet(), cols = TABS[sh.getName()];
  if (!cols || e.range.getRow() < 2) return;
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var u = head.indexOf('updated') + 1;
  if (u > 0 && !(e.range.getColumn() <= u && e.range.getLastColumn() >= u)) {
    sh.getRange(e.range.getRow(), u, e.range.getNumRows(), 1).setValue(new Date());
  }
}
