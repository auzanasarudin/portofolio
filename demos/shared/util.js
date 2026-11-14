/* Small helpers shared by the demos: seeded random data, dates, CSV, storage, toast, skin toggle. */
(function () {
  'use strict';
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var U = {
    rng: rng, MON: MON,
    pick: function (r, arr) { return arr[Math.floor(r() * arr.length)]; },
    int: function (r, a, b) { return a + Math.floor(r() * (b - a + 1)); },
    gauss: function (r) { var u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    sum: function (a) { return a.reduce(function (x, y) { return x + (y || 0); }, 0); },
    avg: function (a) { return a.length ? U.sum(a) / a.length : 0; },
    d: function (iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], p[1] - 1, +p[2])); },
    iso: function (d) { return d.toISOString().slice(0, 10); },
    add: function (iso, n) { var d = U.d(iso); d.setUTCDate(d.getUTCDate() + n); return U.iso(d); },
    diff: function (a, b) { return Math.round((U.d(b) - U.d(a)) / 864e5); },
    short: function (iso) { var d = U.d(iso); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; },
    long: function (iso) { var d = U.d(iso); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); },
    dow: function (iso) { return U.d(iso).getUTCDay(); },
    h: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    csv: function (rows) { return rows.map(function (r) { return r.map(function (c) { c = String(c == null ? '' : c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n'); },
    download: function (name, text, type) {
      try { var b = new Blob([text], { type: type || 'text/csv;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); U.toast('Downloaded ' + name); return true; }
      catch (e) { U.toast('Download is blocked in this viewer'); return false; }
    },
    copy: function (text) {
      var done = function (ok) { U.toast(ok ? 'Copied to clipboard' : 'Copy failed — select the text manually'); return ok; };
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return done(true); }, function () { return done(false); });
      return Promise.resolve(done(false));
    },
    get: function (k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable: demo still works for this visit */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
    toast: function (msg) {
      var t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
      t.textContent = msg; t.hidden = false; clearTimeout(U._tt); U._tt = setTimeout(function () { t.hidden = true; }, 2200);
    },
    /* paper <-> cutting-mat skin; remembered per demo */
    skin: function (key, def) {
      var root = document.documentElement, cur = U.get(key, def || 'paper');
      var apply = function () { if (cur === 'mat') root.setAttribute('data-skin', 'mat'); else root.removeAttribute('data-skin'); var b = document.querySelector('[data-skin-toggle]'); if (b) b.textContent = cur === 'mat' ? 'Paper skin' : 'Mat skin'; };
      apply();
      document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-skin-toggle]'); if (!b) return; cur = cur === 'mat' ? 'paper' : 'mat'; U.set(key, cur); apply(); document.dispatchEvent(new Event('skinchange')); });
    }
  };
  window.U = U;
})();
