/* Shared chart kit for the demos. Dependency-free SVG/HTML.
   Rules it follows: one axis per chart, thin marks, solid hairline grid, a legend for 2+ series,
   hover + keyboard tooltips, and a table view under every chart so no value is hover-only.
   Colours come from CSS variables (--s1..--s8 categorical, --q1..--q6 sequential, --st-* status). */
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var S = function (i) { return 'var(--s' + ((i % 8) + 1) + ')'; };
  var F = function (v, d) {
    if (v == null || isNaN(v)) return '–';
    var a = Math.abs(v);
    return Number(v).toLocaleString('en-US', { maximumFractionDigits: d == null ? (a < 10 ? 1 : 0) : d });
  };
  function nstep(raw) { var p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }
  function scale(max, n) {
    if (!(max > 0)) max = 1;
    var st = nstep(max / (n || 4)), top = Math.ceil(max / st - 1e-9) * st, t = [];
    for (var v = 0; v <= top + 1e-9; v += st) t.push(+v.toFixed(10));
    return { top: top, t: t };
  }
  var tipAttr = function (title, rows) { return ' data-tip="' + esc(JSON.stringify({ t: title, r: rows })) + '"'; };

  function tv(cols, rows) {
    return '<details class="tv"><summary>Table view</summary><div class="tw"><table class="t"><thead><tr>' +
      cols.map(function (c, i) { return '<th' + (i ? ' class="r"' : '') + '>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? ' class="r"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></details>';
  }
  function legend(items, line) {
    return '<div class="legend">' + items.map(function (i) { return '<span><i' + (line ? ' class="ln"' : '') + ' style="background:' + i.c + '"></i>' + esc(i.n) + '</span>'; }).join('') + '</div>';
  }
  function svg(W, h, label, inner, extra) {
    return '<svg class="ch" viewBox="0 0 ' + W + ' ' + h + '" role="img" aria-label="' + esc(label) + '"' + (extra || '') + '>' + inner + '</svg>';
  }
  function xSkip(n, pw, minPx) { return Math.max(1, Math.ceil(n / Math.max(1, Math.floor(pw / (minPx || 48))))); }
  function grid(sc, m, pw, y, fmtTick) {
    var g = '';
    sc.t.forEach(function (t) {
      g += '<line class="gr" x1="' + m.l + '" x2="' + (m.l + pw) + '" y1="' + y(t) + '" y2="' + y(t) + '"/>' +
        '<text x="' + (m.l - 6) + '" y="' + (y(t) + 3.5) + '" text-anchor="end">' + esc(fmtTick ? fmtTick(t) : F(t)) + '</text>';
    });
    return g;
  }
  function targetLine(target, label, m, pw, y) {
    if (target == null) return '';
    return '<line class="tg" x1="' + m.l + '" x2="' + (m.l + pw) + '" y1="' + y(target) + '" y2="' + y(target) + '"/>' +
      '<text class="lbl" x="' + (m.l + pw + 5) + '" y="' + (y(target) + 3.5) + '">' + esc(label || 'target') + '</text>';
  }

  /* ---------- columns: one series over ordered categories ---------- */
  function columns(o) {
    var W = o.W || 640, h = o.h || 200, color = o.color || S(0), name = o.name || 'Value';
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var m = { l: 42, r: o.target != null ? 70 : 12, t: 12, b: 24 }, pw = W - m.l - m.r, ph = h - m.t - m.b;
    var vals = o.values, n = vals.length;
    var sc = scale(Math.max.apply(null, [o.max || 0, o.target || 0].concat(vals.map(function (v) { return v || 0; }))));
    var y = function (v) { return m.t + ph - (v / sc.top) * ph; };
    var band = pw / n, bw = Math.min(24, Math.max(1.5, band - 2)), skip = xSkip(n, pw);
    var g = grid(sc, m, pw, y, o.fmtTick);
    vals.forEach(function (v, i) {
      var x = m.l + band * i + (band - bw) / 2, bh = Math.max(0, ((v || 0) / sc.top) * ph), r = Math.min(4, bw / 2, bh);
      var c = o.colors ? o.colors[i] : color;
      g += '<rect class="hit" x="' + (m.l + band * i) + '" y="' + m.t + '" width="' + band + '" height="' + ph + '" tabindex="' + (n <= 40 ? 0 : -1) + '"' + tipAttr(o.labels[i], [[name, fmt(v), c]]) + '/>';
      if (bh > 0) g += '<path class="mk" style="fill:' + c + '" d="M' + x + ',' + (m.t + ph) + ' v' + (-(bh - r)) + ' q0,' + (-r) + ' ' + r + ',' + (-r) + ' h' + (bw - 2 * r) + ' q' + r + ',0 ' + r + ',' + r + ' v' + (bh - r) + ' z"/>';
      if (i % skip === 0) g += '<text x="' + (x + bw / 2) + '" y="' + (h - 7) + '" text-anchor="middle">' + esc(o.labels[i]) + '</text>';
    });
    g += '<line class="ax" x1="' + m.l + '" x2="' + (m.l + pw) + '" y1="' + (m.t + ph) + '" y2="' + (m.t + ph) + '"/>' + targetLine(o.target, o.targetLabel, m, pw, y);
    return svg(W, h, o.title || name, g) + tv([o.xName || 'Period', name], o.labels.map(function (l, i) { return [l, fmt(vals[i])]; }));
  }

  /* ---------- lines: change over time, 1..n series, crosshair tooltip ---------- */
  function lines(o) {
    var W = o.W || 640, h = o.h || 210, series = o.series, n = o.labels.length;
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var m = { l: 42, r: (o.target != null || series.length === 1) ? 70 : 14, t: 12, b: 24 }, pw = W - m.l - m.r, ph = h - m.t - m.b;
    var all = []; series.forEach(function (s) { s.values.forEach(function (v) { if (v != null) all.push(v); }); });
    var sc = scale(Math.max.apply(null, [o.yMax || 0, o.target || 0].concat(all)));
    var y = function (v) { return m.t + ph - (v / sc.top) * ph; }, x = function (i) { return m.l + (n === 1 ? pw / 2 : pw * i / (n - 1)); };
    var g = grid(sc, m, pw, y, o.fmtTick), skip = xSkip(n, pw, 56);
    o.labels.forEach(function (l, i) { if (i % skip === 0) g += '<text x="' + x(i) + '" y="' + (h - 7) + '" text-anchor="' + (i === 0 ? 'start' : 'middle') + '">' + esc(l) + '</text>'; });
    g += '<line class="ax" x1="' + m.l + '" x2="' + (m.l + pw) + '" y1="' + (m.t + ph) + '" y2="' + (m.t + ph) + '"/>';
    series.forEach(function (s, si) {
      var c = s.color || S(si), d = '', pen = false, last = -1, first = -1;
      s.values.forEach(function (v, i) { if (v == null) { pen = false; return; } d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1); pen = true; last = i; if (first < 0) first = i; });
      if (o.area && series.length === 1 && last >= 0) g += '<path d="' + d + 'L' + x(last) + ',' + (m.t + ph) + 'L' + x(first) + ',' + (m.t + ph) + 'Z" style="fill:' + c + ';opacity:.1"/>';
      g += '<path d="' + d + '" fill="none" style="stroke:' + c + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"' + (s.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
      if (last >= 0) {
        g += '<circle cx="' + x(last) + '" cy="' + y(s.values[last]) + '" r="4" style="fill:' + c + ';stroke:var(--surface)" stroke-width="2"/>';
        if (series.length === 1 && o.target == null) g += '<text class="lbl" x="' + (x(last) + 9) + '" y="' + (y(s.values[last]) + 3.5) + '">' + esc(fmt(s.values[last])) + '</text>';
      }
    });
    g += targetLine(o.target, o.targetLabel, m, pw, y);
    var data = { l: o.labels, s: series.map(function (s, si) { return { n: s.name, c: s.color || S(si), v: s.values.map(function (v) { return v == null ? '–' : fmt(v); }) }; }), x0: m.l, pw: pw };
    g += '<line class="xh" x1="0" x2="0" y1="' + m.t + '" y2="' + (m.t + ph) + '" visibility="hidden"/>' +
      '<rect class="xr" x="' + m.l + '" y="' + m.t + '" width="' + pw + '" height="' + ph + '" data-line="' + esc(JSON.stringify(data)) + '"/>';
    return svg(W, h, o.title || series.map(function (s) { return s.name; }).join(', '), g, ' tabindex="0"') +
      (series.length > 1 ? legend(series.map(function (s, si) { return { n: s.name, c: s.color || S(si) }; }), true) : '') +
      tv([o.xName || 'Period'].concat(series.map(function (s) { return s.name; })), o.labels.map(function (l, i) { return [l].concat(series.map(function (s) { return s.values[i] == null ? '–' : fmt(s.values[i]); })); }));
  }

  /* ---------- hbars: ranked horizontal bars, one series, value at the tip ---------- */
  function hbars(o) {
    var W = o.W || 640, rowH = o.rowH || 26, lw = o.labelW || 130, color = o.color || S(0), name = o.name || 'Value';
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var rows = o.rows, m = { l: lw, r: 62, t: 4, b: 4 }, pw = W - m.l - m.r, h = m.t + m.b + rows.length * rowH;
    var top = Math.max.apply(null, [o.max || 0, o.target || 0].concat(rows.map(function (r) { return r.value || 0; }))) || 1;
    var g = '';
    rows.forEach(function (r, i) {
      var yy = m.t + i * rowH, bw = Math.max(0, (r.value / top) * pw), bh = Math.min(16, rowH - 8), rr = Math.min(4, bh / 2, bw);
      var c = r.color || color;
      g += '<rect class="hit" x="0" y="' + yy + '" width="' + W + '" height="' + rowH + '" tabindex="0"' + tipAttr(r.label, [[name, fmt(r.value), c]].concat(r.extra || [])) + '/>';
      g += '<text class="lbl" x="' + (m.l - 8) + '" y="' + (yy + rowH / 2 + 3.5) + '" text-anchor="end">' + esc(r.label) + '</text>';
      if (bw > 0) g += '<path class="mk" style="fill:' + c + '" d="M' + m.l + ',' + (yy + (rowH - bh) / 2) + ' h' + (bw - rr) + ' q' + rr + ',0 ' + rr + ',' + rr + ' v' + (bh - 2 * rr) + ' q0,' + rr + ' ' + (-rr) + ',' + rr + ' h' + (-(bw - rr)) + ' z"/>';
      g += '<text class="lbl" x="' + (m.l + bw + 6) + '" y="' + (yy + rowH / 2 + 3.5) + '">' + esc(fmt(r.value)) + '</text>';
    });
    g += '<line class="ax" x1="' + m.l + '" x2="' + m.l + '" y1="' + m.t + '" y2="' + (h - m.b) + '"/>';
    if (o.target != null) { var tx = m.l + (o.target / top) * pw; g += '<line class="tg" x1="' + tx + '" x2="' + tx + '" y1="' + m.t + '" y2="' + (h - m.b) + '"/>'; }
    return svg(W, h, o.title || name, g) + (o.target != null ? '<div class="legend"><span><i class="tgk"></i>' + esc(o.targetLabel || 'target') + '</span></div>' : '') +
      tv([o.xName || 'Item', name], rows.map(function (r) { return [r.label, fmt(r.value)]; }));
  }

  /* ---------- stackedH: several wholes on one shared axis ---------- */
  function stackedH(o) {
    var W = o.W || 640, rowH = o.rowH || 28, lw = o.labelW || 110, series = o.series, rows = o.rows;
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var m = { l: lw, r: 58, t: 4, b: 22 }, pw = W - m.l - m.r, h = m.t + m.b + rows.length * rowH;
    var tot = rows.map(function (r) { return r.parts.reduce(function (a, b) { return a + (b || 0); }, 0); });
    var sc = o.pct ? { top: 100, t: [0, 25, 50, 75, 100] } : scale(Math.max.apply(null, tot.concat([o.max || 0])));
    var g = '';
    sc.t.forEach(function (t) { var xx = m.l + (t / sc.top) * pw; g += '<line class="gr" x1="' + xx + '" x2="' + xx + '" y1="' + m.t + '" y2="' + (h - m.b) + '"/><text x="' + xx + '" y="' + (h - 6) + '" text-anchor="middle">' + F(t) + (o.pct ? '%' : '') + '</text>'; });
    rows.forEach(function (r, i) {
      var yy = m.t + i * rowH, bh = Math.min(16, rowH - 10), x = m.l, T = tot[i] || 1;
      var tipRows = series.map(function (s, si) { return [s.name, o.pct ? F(r.parts[si] / T * 100, 1) + '%' : fmt(r.parts[si]), s.color || S(si)]; });
      g += '<rect class="hit" x="0" y="' + yy + '" width="' + W + '" height="' + rowH + '" tabindex="0"' + tipAttr(r.label, tipRows) + '/>';
      g += '<text class="lbl" x="' + (m.l - 8) + '" y="' + (yy + rowH / 2 + 3.5) + '" text-anchor="end">' + esc(r.label) + '</text>';
      r.parts.forEach(function (v, si) {
        var w = ((o.pct ? v / T * 100 : v) / sc.top) * pw; if (!(w > 0)) return;
        var dw = Math.max(0.5, w - 2);
        g += '<rect class="mk" x="' + x + '" y="' + (yy + (rowH - bh) / 2) + '" width="' + dw + '" height="' + bh + '" rx="2" style="fill:' + (series[si].color || S(si)) + '"/>';
        x += w;
      });
      if (!o.pct) g += '<text class="lbl" x="' + (x + 5) + '" y="' + (yy + rowH / 2 + 3.5) + '">' + esc(fmt(tot[i])) + '</text>';
    });
    return svg(W, h, o.title || 'Composition', g) + legend(series.map(function (s, si) { return { n: s.name, c: s.color || S(si) }; })) +
      tv([o.xName || 'Item'].concat(series.map(function (s) { return s.name; })), rows.map(function (r) { return [r.label].concat(r.parts.map(function (v) { return fmt(v); })); }));
  }

  /* ---------- segbar: one whole split into <= 6 parts (tall segmented bar) ---------- */
  function segbar(o) {
    var parts = o.parts.filter(function (p) { return p.value > 0; }), tot = parts.reduce(function (a, p) { return a + p.value; }, 0) || 1;
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var html = '<div class="segbar" role="img" aria-label="' + esc((o.title || 'Split') + ': ' + parts.map(function (p) { return p.name + ' ' + fmt(p.value); }).join(', ')) + '">';
    parts.forEach(function (p, i) {
      var share = p.value / tot * 100, c = p.color || S(i);
      html += '<div class="sg' + (p.dark ? ' dk' : '') + '" style="flex:' + p.value + ' 1 0;background:' + c + '" tabindex="0"' + tipAttr(p.name, [[o.name || 'Count', fmt(p.value), c], ['Share', F(share, 1) + '%', null]]) + '>' + (share >= 9 ? '<span>' + F(share, 0) + '%</span>' : '') + '</div>';
    });
    html += '</div>' + legend(parts.map(function (p, i) { return { n: p.name, c: p.color || S(i) }; }));
    return html + tv([o.xName || 'Part', o.name || 'Count', 'Share'], parts.map(function (p) { return [p.name, fmt(p.value), F(p.value / tot * 100, 1) + '%']; }));
  }

  /* ---------- heat: magnitude on a grid, one hue ---------- */
  function heat(o) {
    var W = o.W || 640, lw = o.labelW || 70, cols = o.cols, rows = o.rows, vals = o.values;
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var cw = (W - lw - 8) / cols.length, chh = o.cell || 20, h = 18 + rows.length * chh + 4;
    var max = o.max || Math.max.apply(null, vals.map(function (r) { return Math.max.apply(null, r); })) || 1, g = '';
    var skip = xSkip(cols.length, W - lw, 30);
    cols.forEach(function (c, j) { if (j % skip === 0) g += '<text x="' + (lw + cw * j + cw / 2) + '" y="11" text-anchor="middle">' + esc(c) + '</text>'; });
    rows.forEach(function (r, i) {
      g += '<text class="lbl" x="' + (lw - 8) + '" y="' + (18 + i * chh + chh / 2 + 3.5) + '" text-anchor="end">' + esc(r) + '</text>';
      cols.forEach(function (c, j) {
        var v = vals[i][j], q = v <= 0 ? 0 : Math.min(6, 1 + Math.floor((v / max) * 5.999));
        g += '<rect class="hc" x="' + (lw + cw * j + 1) + '" y="' + (18 + i * chh + 1) + '" width="' + (cw - 2) + '" height="' + (chh - 2) + '" rx="2" style="fill:var(--q' + q + ')" tabindex="-1"' + tipAttr(r + ' · ' + c, [[o.name || 'Value', fmt(v), null]]) + '/>';
      });
    });
    var sw = ''; for (var k = 0; k <= 6; k++) sw += '<i style="background:var(--q' + k + ')"></i>';
    return svg(W, h, o.title || 'Heat grid', g) + '<div class="legend scale"><span>' + esc(fmt(0)) + '</span><span class="ramp">' + sw + '</span><span>' + esc(fmt(max)) + '</span></div>' +
      tv([o.yName || 'Row'].concat(cols), rows.map(function (r, i) { return [r].concat(vals[i].map(function (v) { return fmt(v); })); }));
  }

  /* ---------- waterfall: how a total is eaten by losses (horizontal bridge) ---------- */
  function waterfall(o) {
    var W = o.W || 640, rowH = 30, lw = o.labelW || 150, steps = o.steps;
    var fmt = o.fmt || function (v) { return F(v) + (o.unit || ''); };
    var m = { l: lw, r: 70, t: 4, b: 4 }, pw = W - m.l - m.r, h = m.t + m.b + steps.length * rowH;
    var top = Math.max.apply(null, steps.filter(function (s) { return s.kind === 'total'; }).map(function (s) { return s.value; })) || 1, run = 0, g = '';
    steps.forEach(function (s, i) {
      var yy = m.t + i * rowH, bh = 16, x0, w, c;
      if (s.kind === 'total') { x0 = 0; w = s.value; run = s.value; c = s.color || S(0); }
      else { run -= s.value; x0 = run; w = s.value; c = 'var(--de)'; }
      var px = m.l + (x0 / top) * pw, pwid = Math.max(0.5, (w / top) * pw - (s.kind === 'total' ? 0 : 2));
      g += '<rect class="hit" x="0" y="' + yy + '" width="' + W + '" height="' + rowH + '" tabindex="0"' + tipAttr(s.label, [[s.kind === 'total' ? 'Hours' : 'Lost', fmt(s.value), c], ['Share of first row', F(s.value / top * 100, 1) + '%', null]]) + '/>';
      g += '<text class="lbl" x="' + (m.l - 8) + '" y="' + (yy + rowH / 2 + 3.5) + '" text-anchor="end">' + esc(s.label) + '</text>';
      g += '<rect class="mk" x="' + px + '" y="' + (yy + (rowH - bh) / 2) + '" width="' + pwid + '" height="' + bh + '" rx="2" style="fill:' + c + '"/>';
      g += '<text class="lbl" x="' + (m.l + ((x0 + w) / top) * pw + 6) + '" y="' + (yy + rowH / 2 + 3.5) + '">' + (s.kind === 'total' ? '' : '−') + esc(fmt(s.value)) + '</text>';
    });
    g += '<line class="ax" x1="' + m.l + '" x2="' + m.l + '" y1="' + m.t + '" y2="' + (h - m.b) + '"/>';
    return svg(W, h, o.title || 'Waterfall', g) + legend([{ n: o.totalName || 'Remaining hours', c: S(0) }, { n: o.lossName || 'Loss', c: 'var(--de)' }]) +
      tv(['Step', 'Hours'], steps.map(function (s) { return [s.label, (s.kind === 'total' ? '' : '−') + fmt(s.value)]; }));
  }

  /* ---------- dumbbell: before -> after per item ---------- */
  function dumbbell(o) {
    var W = o.W || 640, rowH = 28, lw = o.labelW || 190, rows = o.rows;
    var fmt = o.fmt || function (v) { return F(v, 1) + (o.unit || ''); };
    var m = { l: lw, r: 20, t: 4, b: 22 }, pw = W - m.l - m.r, h = m.t + m.b + rows.length * rowH;
    var sc = scale(Math.max.apply(null, rows.map(function (r) { return Math.max(r.before, r.after); }))), g = '';
    var x = function (v) { return m.l + (v / sc.top) * pw; };
    sc.t.forEach(function (t) { g += '<line class="gr" x1="' + x(t) + '" x2="' + x(t) + '" y1="' + m.t + '" y2="' + (h - m.b) + '"/><text x="' + x(t) + '" y="' + (h - 6) + '" text-anchor="middle">' + esc(fmt(t)) + '</text>'; });
    rows.forEach(function (r, i) {
      var cy = m.t + i * rowH + rowH / 2;
      g += '<rect class="hit" x="0" y="' + (cy - rowH / 2) + '" width="' + W + '" height="' + rowH + '" tabindex="0"' + tipAttr(r.label, [['Before', fmt(r.before), 'var(--s1l)'], ['After', fmt(r.after), 'var(--s1)'], ['Change', (r.after - r.before > 0 ? '+' : '') + fmt(r.after - r.before), null]]) + '/>';
      g += '<text class="lbl" x="' + (m.l - 10) + '" y="' + (cy + 3.5) + '" text-anchor="end">' + esc(r.label) + '</text>';
      g += '<line x1="' + x(r.before) + '" x2="' + x(r.after) + '" y1="' + cy + '" y2="' + cy + '" style="stroke:var(--de)" stroke-width="2"/>';
      g += '<circle cx="' + x(r.before) + '" cy="' + cy + '" r="5" style="fill:var(--s1l);stroke:var(--surface)" stroke-width="2"/><circle cx="' + x(r.after) + '" cy="' + cy + '" r="5" style="fill:var(--s1);stroke:var(--surface)" stroke-width="2"/>';
    });
    return svg(W, h, o.title || 'Before and after', g) + legend([{ n: o.beforeName || 'Before', c: 'var(--s1l)' }, { n: o.afterName || 'After', c: 'var(--s1)' }]) +
      tv(['Item', o.beforeName || 'Before', o.afterName || 'After'], rows.map(function (r) { return [r.label, fmt(r.before), fmt(r.after)]; }));
  }

  /* ---------- figures ---------- */
  function spark(values, W, h) {
    W = W || 96; h = h || 26;
    var max = Math.max.apply(null, values), min = Math.min.apply(null, values), n = values.length, rng = (max - min) || 1;
    var pts = values.map(function (v, i) { return (2 + (W - 8) * i / (n - 1)).toFixed(1) + ',' + (h - 4 - (v - min) / rng * (h - 8)).toFixed(1); });
    var lp = pts[n - 1].split(',');
    return '<svg class="spark" viewBox="0 0 ' + W + ' ' + h + '" width="' + W + '" height="' + h + '" aria-hidden="true"><polyline points="' + pts.join(' ') + '" fill="none" style="stroke:var(--de)" stroke-width="1.5" stroke-linejoin="round"/><circle cx="' + lp[0] + '" cy="' + lp[1] + '" r="3" style="fill:var(--s1)"/></svg>';
  }
  var ICON = { good: '✓', warning: '!', serious: '!', critical: '✕', none: '•' };
  function status(kind, label) { return '<span class="st st-' + kind + '"><b aria-hidden="true">' + ICON[kind] + '</b>' + esc(label) + '</span>'; }
  function tile(o) {
    return '<div class="kpi"><div class="l">' + esc(o.label) + '</div><div class="v">' + esc(o.value) + (o.unit ? '<small>' + esc(o.unit) + '</small>' : '') + '</div>' +
      '<div class="d">' + (o.status ? status(o.status.kind, o.status.label) : '') + (o.note ? '<span>' + esc(o.note) + '</span>' : '') + '</div>' + (o.spark ? spark(o.spark) : '') + '</div>';
  }
  function meter(o) {
    var pct = Math.max(0, Math.min(100, o.value / (o.max || 100) * 100)), kind = o.kind || 'good';
    return '<div class="meter mt-' + kind + '" role="img" aria-label="' + esc((o.label || '') + ' ' + F(o.value, 1) + (o.unit || '')) + '"><i style="width:' + pct + '%"></i>' + (o.target != null ? '<b style="left:' + Math.min(100, o.target / (o.max || 100) * 100) + '%"></b>' : '') + '</div>';
  }

  /* ---------- hover + keyboard layer (one tooltip for every chart) ---------- */
  var tip, activeXh;
  function ensure() { if (!tip) { tip = document.createElement('div'); tip.className = 'viz-tip'; tip.hidden = true; tip.setAttribute('role', 'status'); document.body.appendChild(tip); } return tip; }
  function show(obj, cx, cy) {
    var t = ensure(); t.textContent = '';
    var hd = document.createElement('div'); hd.className = 'tt'; hd.textContent = obj.t; t.appendChild(hd);
    obj.r.forEach(function (r) {
      var row = document.createElement('div'); row.className = 'tr';
      var k = document.createElement('span'); k.className = 'tk';
      if (r[2]) { var key = document.createElement('i'); key.style.background = r[2]; k.appendChild(key); }
      k.appendChild(document.createTextNode(r[0]));
      var v = document.createElement('b'); v.textContent = r[1];
      row.appendChild(v); row.appendChild(k); t.appendChild(row);
    });
    t.hidden = false;
    var w = t.offsetWidth, hh = t.offsetHeight, x = cx + 14, y = cy + 14;
    if (x + w > window.innerWidth - 8) x = cx - w - 14;
    if (y + hh > window.innerHeight - 8) y = cy - hh - 14;
    t.style.left = Math.max(8, x) + 'px'; t.style.top = Math.max(8, y) + 'px';
  }
  function hide() { if (tip) tip.hidden = true; if (activeXh) { activeXh.setAttribute('visibility', 'hidden'); activeXh = null; } }
  var cache = new WeakMap();
  function lineData(xr) { var d = cache.get(xr); if (!d) { d = JSON.parse(xr.getAttribute('data-line')); cache.set(xr, d); } return d; }
  function cross(xr, idx, cx, cy) {
    var d = lineData(xr), n = d.l.length; idx = Math.max(0, Math.min(n - 1, idx));
    var sv = xr.ownerSVGElement, xh = sv.querySelector('.xh'), px = d.x0 + (n === 1 ? d.pw / 2 : d.pw * idx / (n - 1));
    if (activeXh && activeXh !== xh) activeXh.setAttribute('visibility', 'hidden');
    xh.setAttribute('x1', px); xh.setAttribute('x2', px); xh.setAttribute('visibility', 'visible'); activeXh = xh; sv._idx = idx;
    if (cx == null) { var b = sv.getBoundingClientRect(); cx = b.left + px * b.width / sv.viewBox.baseVal.width; cy = b.top + 20; }
    show({ t: d.l[idx], r: d.s.map(function (s) { return [s.n, s.v[idx], s.c]; }) }, cx, cy);
  }
  function onPoint(e) {
    var t = e.target; if (!t || !t.closest) return hide();
    var xr = t.closest('.xr');
    if (xr) { var sv = xr.ownerSVGElement, b = sv.getBoundingClientRect(), d = lineData(xr), px = (e.clientX - b.left) * sv.viewBox.baseVal.width / b.width; return cross(xr, Math.round((px - d.x0) / d.pw * (d.l.length - 1)), e.clientX, e.clientY); }
    var mk = t.closest('[data-tip]');
    if (mk) { if (activeXh) { activeXh.setAttribute('visibility', 'hidden'); activeXh = null; } return show(JSON.parse(mk.getAttribute('data-tip')), e.clientX, e.clientY); }
    hide();
  }
  document.addEventListener('pointermove', onPoint);
  document.addEventListener('pointerdown', onPoint);
  document.addEventListener('scroll', hide, true);
  document.addEventListener('focusin', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var mk = t.closest('[data-tip]');
    if (mk) { var r = mk.getBoundingClientRect(); return show(JSON.parse(mk.getAttribute('data-tip')), r.left + r.width / 2, r.top + r.height / 2); }
    if (t.matches && t.matches('svg.ch') && t.querySelector('.xr')) { var xr = t.querySelector('.xr'); cross(xr, t._idx != null ? t._idx : lineData(xr).l.length - 1); }
  });
  document.addEventListener('focusout', hide);
  document.addEventListener('keydown', function (e) {
    var t = e.target; if (!t || !t.matches || !t.matches('svg.ch')) return;
    var xr = t.querySelector('.xr'); if (!xr) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); cross(xr, (t._idx != null ? t._idx : lineData(xr).l.length - 1) + (e.key === 'ArrowRight' ? 1 : -1)); }
    if (e.key === 'Escape') hide();
  });

  window.Charts = { columns: columns, lines: lines, hbars: hbars, stackedH: stackedH, segbar: segbar, heat: heat, waterfall: waterfall, dumbbell: dumbbell, spark: spark, tile: tile, meter: meter, status: status, legend: legend, table: tv, S: S, F: F, esc: esc };
})();
