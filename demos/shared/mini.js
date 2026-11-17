/* Kit kecil untuk demo baru (Persiapan Audit ISO, Optimasi Perusahaan):
   kerangka aplikasi + navigasi hash, grafik batang/garis/gauge sederhana, penyimpanan lokal. Data selalu sintetis. */
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var M = {
    esc: esc,
    rp: function (n) { return 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID'); },
    num: function (n, d) { return Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 }); },
    get: function (k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* penyimpanan diblokir */ } },
    rng: function (seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; },
    /* kerangka: cfg = { brand, sub, note, views: { key: { label, title, sub, render(el) } }, first } */
    shell: function (cfg) {
      var keys = Object.keys(cfg.views);
      document.body.innerHTML = '<div class="app"><div class="demo-note"><span>' + esc(cfg.note) + '</span><span><a href="../../index.html#karya">← Kembali ke portofolio</a> · <a href="../../index.html#kontak">Mau ini untuk perusahaan Anda?</a></span></div>' +
        '<aside class="side"><div class="brand"><span id="logo"></span><div><b>' + esc(cfg.brand) + '</b><small>' + esc(cfg.sub) + '</small></div></div><nav class="nav" aria-label="Tampilan">' +
        keys.map(function (k, i) { return '<button type="button" data-v="' + k + '"><i>' + String(i + 1).padStart(2, '0') + '</i>' + esc(cfg.views[k].label) + '</button>'; }).join('') +
        '</nav><div class="foot"><span>Perubahan tersimpan di browser ini saja.</span><button type="button" class="btn sm" id="reset">Reset data demo</button></div></aside>' +
        '<main class="main"><header class="top"><div><h1 id="title"></h1><div class="sub" id="sub"></div></div><div class="tools" id="tools"></div></header><div class="view" id="view"></div></main></div>';
      if (window.LaboSprite) document.getElementById('logo').innerHTML = LaboSprite.svg('happy', 34);
      function show(k) {
        if (!cfg.views[k]) k = cfg.first || keys[0];
        document.querySelectorAll('[data-v]').forEach(function (b) { if (b.getAttribute('data-v') === k) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
        var v = cfg.views[k]; document.getElementById('title').textContent = v.title || v.label; document.getElementById('sub').textContent = typeof v.sub === 'function' ? v.sub() : (v.sub || '');
        document.getElementById('tools').innerHTML = ''; v.render(document.getElementById('view'), document.getElementById('tools'));
        try { history.replaceState(null, '', '#' + k); } catch (e) { /* sandbox */ }
        window.scrollTo(0, 0);
      }
      document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-v]'); if (b) return show(b.getAttribute('data-v'));
        if (e.target.id === 'reset' && confirm('Kembalikan data demo ke awal?')) { (cfg.storeKeys || []).forEach(function (k) { try { localStorage.removeItem(k); } catch (er) { /* abaikan */ } }); location.reload(); }
      });
      M.show = show; M.rerender = function () { show((location.hash || '').slice(1)); };
      show((location.hash || '').slice(1));
      window.addEventListener('hashchange', function () { var k = (location.hash || '').slice(1); if (cfg.views[k] && document.querySelector('[data-v="' + k + '"][aria-current]') === null) show(k); });
    },
    kpi: function (l, v, unit, d, cls) { return '<div class="kpi"><div class="l">' + esc(l) + '</div><div class="v">' + v + (unit ? '<small>' + esc(unit) + '</small>' : '') + '</div><div class="d' + (cls ? ' ' + cls : '') + '">' + (d || '') + '</div></div>'; },
    card: function (h, hint, body, cls) { return '<section class="card' + (cls ? ' ' + cls : '') + '"><h3>' + esc(h) + '</h3>' + (hint ? '<p class="hint">' + esc(hint) + '</p>' : '') + body + '</section>'; },
    /* batang horizontal: rows = [{ l, v, max, c, t }] */
    bars: function (rows, opt) {
      opt = opt || {}; var max = opt.max || Math.max.apply(null, rows.map(function (r) { return r.max || r.v; }).concat([1]));
      return '<div class="mb">' + rows.map(function (r) { return '<div class="mb-r"><span class="mb-l">' + esc(r.l) + '</span><span class="mb-t"><i style="width:' + Math.max(0, Math.min(100, r.v / max * 100)) + '%;' + (r.c ? 'background:' + r.c : '') + '"></i>' + (opt.target ? '<b style="left:' + (opt.target / max * 100) + '%"></b>' : '') + '</span><span class="mb-v">' + esc(r.t != null ? r.t : M.num(r.v, opt.dec)) + '</span></div>'; }).join('') + '</div>';
    },
    gauge: function (pct, label, color) {
      var r = 42, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct));
      return '<div class="gauge"><svg viewBox="0 0 110 110" width="132" height="132" role="img" aria-label="' + esc(label) + ' ' + Math.round(p) + '%"><circle cx="55" cy="55" r="' + r + '" fill="none" stroke="var(--surface-2)" stroke-width="11"/><circle cx="55" cy="55" r="' + r + '" fill="none" stroke="' + (color || 'var(--accent)') + '" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + (c * p / 100) + ' ' + c + '" transform="rotate(-90 55 55)"/><text x="55" y="60" text-anchor="middle" font-size="22" font-weight="700" fill="var(--fg)">' + Math.round(p) + '%</text></svg><span>' + esc(label) + '</span></div>';
    },
    /* garis: series = [{ name, values, color }], labels = [] */
    line: function (series, labels, opt) {
      opt = opt || {}; var W = 640, H = 220, pl = 44, pb = 26, pt = 12, pr = 12;
      var all = []; series.forEach(function (s) { all = all.concat(s.values); });
      var max = opt.max || Math.max.apply(null, all.concat([1])) * 1.1, min = opt.min != null ? opt.min : 0, n = labels.length;
      var x = function (i) { return pl + (W - pl - pr) * (n < 2 ? 0 : i / (n - 1)); }, y = function (v) { return pt + (H - pt - pb) * (1 - (v - min) / (max - min || 1)); };
      var g = ''; for (var k = 0; k <= 4; k++) { var v = min + (max - min) * k / 4; g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="var(--grid)"/><text x="' + (pl - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="10" fill="var(--fg-2)">' + M.num(v, opt.dec) + '</text>'; }
      labels.forEach(function (l, i) { if (n <= 12 || i % Math.ceil(n / 8) === 0) g += '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--fg-2)">' + esc(l) + '</text>'; });
      if (opt.target != null) g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(opt.target) + '" y2="' + y(opt.target) + '" stroke="var(--hl)" stroke-width="2" stroke-dasharray="5 4"/>';
      series.forEach(function (s) { g += '<polyline fill="none" stroke="' + s.color + '" stroke-width="2.5" points="' + s.values.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ') + '"/>' + s.values.map(function (v, i) { return '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3" fill="' + s.color + '"><title>' + esc(s.name + ' · ' + labels[i] + ': ' + M.num(v, opt.dec)) + '</title></circle>'; }).join(''); });
      var leg = '<div class="mleg">' + series.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + esc(s.name) + '</span>'; }).join('') + (opt.target != null ? '<span><i style="background:var(--hl)"></i>' + esc(opt.targetLabel || 'Target') + '</span>' : '') + '</div>';
      return '<svg class="mline" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opt.label || 'Grafik') + '">' + g + '</svg>' + leg;
    },
    pill: function (t, cls) { return '<span class="pill ' + (cls || '') + '">' + esc(t) + '</span>'; }
  };
  window.M = M;
})();
