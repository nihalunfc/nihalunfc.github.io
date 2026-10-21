/* Header dropdowns. The nav scrolls sideways on phones, so the menu is
   positioned with `fixed` under its button instead of inside the nav. */
(function () {
  var open = null;
  function place(btn, menu) {
    var r = btn.getBoundingClientRect(), w = menu.offsetWidth;
    var left = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    menu.style.top = (r.bottom + 6) + 'px';
    menu.style.left = left + 'px';
  }
  function close() {
    if (!open) return;
    open.btn.setAttribute('aria-expanded', 'false');
    open.menu.hidden = true;
    open = null;
  }
  document.querySelectorAll('.dd').forEach(function (dd) {
    var btn = dd.querySelector('.dd-btn'), menu = dd.querySelector('.dd-menu');
    if (!btn || !menu) return;
    document.body.appendChild(menu);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open && open.btn === btn) { close(); return; }
      close();
      menu.hidden = false;
      place(btn, menu);
      btn.setAttribute('aria-expanded', 'true');
      open = { btn: btn, menu: menu };
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) btn.click(); var a = menu.querySelector('a'); if (a) a.focus(); }
    });
    menu.addEventListener('keydown', function (e) {
      var links = Array.prototype.slice.call(menu.querySelectorAll('a')), i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
    });
  });
  document.addEventListener('click', function (e) { if (open && !open.menu.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { var b = open.btn; close(); b.focus(); } });
  window.addEventListener('resize', close);
  window.addEventListener('scroll', function () { if (open) place(open.btn, open.menu); }, { passive: true });
  document.querySelectorAll('.top nav').forEach(function (n) { n.addEventListener('scroll', function () { if (open) place(open.btn, open.menu); }, { passive: true }); });
})();
