/* LABORU ERP — mesin hitung. Semua rumus ditulis terbuka dan dijelaskan di halaman "Dasar perhitungan".
   Istilah sederhana: Katalog (pesanan pelanggan / CBOM) → Resep bahan (EBOM) → Langkah kerja & waktu (MBOM). */
(function () {
  'use strict';
  var E = {};
  var EFF = { 1: 0.7, 2: 1.0, 3: 1.2 };              // efisiensi menurut level keahlian
  E.EFF = EFF;
  E.z = function (conf) { return conf >= 0.95 ? 1.645 : conf >= 0.9 ? 1.282 : conf >= 0.85 ? 1.036 : 0.842; };
  E.byId = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  E.skill = function (db, k) { for (var i = 0; i < db.skills.length; i++) if (db.skills[i].k === k) return db.skills[i]; return { k: k, n: k }; };

  /* ukuran dari isian, mis. "p*t" — hanya angka, nama isian, dan + - * / ( ) yang diizinkan */
  E.size = function (expr, inp) {
    if (!/^[\w\s+\-*/().]+$/.test(expr)) return 0;
    var names = Object.keys(inp || {}), bad = (expr.match(/[a-z_]\w*/gi) || []).some(function (w) { return names.indexOf(w) < 0; });
    if (bad) return 0;
    try { var v = Function.apply(null, names.concat(['return (' + expr + ');'])).apply(null, names.map(function (k) { return +inp[k] || 0; })); return isFinite(v) && v > 0 ? v : 0; } catch (e) { return 0; }
  };
  function merge(list, add) { var m = {}; list.concat(add || []).forEach(function (r) { m[r[0]] = m[r[0]] || [r[0], 0, 0]; m[r[0]][1] += r[1]; m[r[0]][2] += r[2] || 0; }); return Object.keys(m).map(function (k) { return m[k]; }); }

  /* biaya alat per jam = penyusutan per tahun ÷ jam pakai per tahun */
  E.dep = function (t, today) {
    var age = Math.max(0, (new Date(today) - new Date(t.buy)) / (365.25 * 864e5)), perY = (t.p - t.salv) / t.life;
    var book = Math.max(t.salv, t.p - perY * age);
    return { age: age, perY: perY, book: book, perH: perY / (t.hYear || 1000), left: Math.max(0, t.life - age), pct: Math.min(1, age / t.life) };
  };
  E.rate = function (db, k) { var ws = db.workers.filter(function (w) { return w.sk[k]; }); return ws.length ? ws.reduce(function (s, w) { return s + w.rate; }, 0) / ws.length : 30000; };

  /* rincian satu pesanan: bahan, langkah kerja, konsumabel, dan HPP */
  E.breakdown = function (db, item, inp, opts) {
    var size = E.size(item.size, inp), bom = item.bom.slice(), steps = item.steps.slice(), cons = item.cons.slice();
    (item.opts || []).forEach(function (o) { if ((opts || []).indexOf(o.k) >= 0) { bom = merge(bom, o.bom); steps = merge(steps, o.steps); cons = merge(cons, o.cons); } });
    bom = merge(bom); cons = merge(cons);
    var stepMap = {}; steps.forEach(function (s) { stepMap[s[0]] = stepMap[s[0]] || [s[0], 0, 0]; stepMap[s[0]][1] += s[1]; stepMap[s[0]][2] += s[2] || 0; });
    var order = []; steps.forEach(function (s) { if (order.indexOf(s[0]) < 0) order.push(s[0]); });
    var mats = bom.map(function (b) { var m = E.byId(db.materials, b[0]); if (!m) return null; var need = Math.ceil(b[1] * size * 100) / 100; if (/batang|lembar|pcs|set/.test(m.u)) need = Math.ceil(b[1] * size); return { m: m, need: need, cost: need * m.p, short: Math.max(0, need - m.st) }; }).filter(Boolean);
    var hs = order.map(function (k) { var s = stepMap[k], h = Math.max(0, (s[1] * size + s[2]) / 60); return { k: k, h: Math.round(h * 10) / 10 }; }).filter(function (x) { return x.h > 0; });
    var cs = cons.map(function (c) { var x = E.byId(db.consumables, c[0]); if (!x) return null; var q = Math.ceil(c[1] * size * 10) / 10; return { c: x, q: q, cost: q * x.p }; }).filter(Boolean);
    var mat = mats.reduce(function (s, x) { return s + x.cost; }, 0), con = cs.reduce(function (s, x) { return s + x.cost; }, 0);
    var labor = hs.reduce(function (s, x) { return s + x.h * E.rate(db, x.k); }, 0);
    var tool = hs.reduce(function (s, x) { var t = E.byId(db.tools, E.skill(db, x.k).tool); return s + (t ? x.h * E.dep(t, db.settings.today).perH : 0); }, 0);
    var oh = labor * db.settings.overhead / 100, hpp = mat + con + labor + tool + oh;
    return { item: item, size: size, mats: mats, steps: hs, cons: cs, hours: hs.reduce(function (s, x) { return s + x.h; }, 0), cost: { mat: mat, con: con, labor: labor, tool: tool, oh: oh, hpp: hpp } };
  };
  E.price = function (db, hpp, extra) { return Math.ceil((hpp + (extra || 0)) / (1 - db.settings.margin / 100) / 50000) * 50000; };
  E.judge = function (price, hpp) { var m = price > 0 ? (price - hpp) / price : -1; return { m: m, t: m < 0 ? 'rugi' : m < 0.1 ? 'terlalu murah' : m <= 0.45 ? 'wajar' : 'berisiko terlalu mahal', c: m < 0.1 ? 'bad' : m <= 0.45 ? 'ok' : 'warn' }; };

  /* kapasitas jam standar per hari per keahlian: jam kerja pekerja dibagi rata ke keahliannya × efisiensi level */
  E.capacity = function (db, extraH) {
    var cap = {}, h = db.settings.hoursDay + (extraH || 0);
    db.skills.forEach(function (s) { cap[s.k] = 0; });
    db.workers.forEach(function (w) { var ks = Object.keys(w.sk).filter(function (k) { return w.sk[k] > 0; }); ks.forEach(function (k) { cap[k] = (cap[k] || 0) + h / ks.length * (EFF[w.sk[k]] || 1); }); });
    return cap;
  };
  /* antrean: jam standar tersisa dari proyek berjalan, per keahlian */
  E.backlog = function (db, except) {
    var b = {}; db.skills.forEach(function (s) { b[s.k] = 0; });
    db.projects.forEach(function (p) {
      if (p.id === except || p.closed) return; var it = E.byId(db.catalog, p.item); if (!it) return;
      E.breakdown(db, it, p.inp, p.opt).steps.forEach(function (s) { var r = p.rem && p.rem[s.k] != null ? p.rem[s.k] : 1; b[s.k] += s.h * r; });
    });
    return b;
  };
  E.STRATS = [
    { k: 'normal', n: 'Normal', d: 'Antre setelah proyek berjalan, tahap berurutan, tanpa lembur.' },
    { k: 'paralel', n: 'Jalan paralel', d: 'Tahap berikutnya mulai saat tahap sebelumnya 50% selesai (overlapping). Bahan dipesan bertahap.' },
    { k: 'lembur', n: 'Lembur terukur', d: 'Tambah jam per hari sesuai batas lembur; produktivitas jam lembur dihitung lebih rendah.' },
    { k: 'sisip', n: 'Sisip prioritas', d: 'Dikerjakan lebih dulu dari antrean. Proyek lain mundur — terlihat berapa hari.' },
    { k: 'subkon', n: 'Subkon pengecatan', d: 'Pengecatan diserahkan ke vendor (3 hari kerja), tenaga sendiri fokus fabrikasi.' },
    { k: 'express', n: 'Express (paralel + lembur + prioritas)', d: 'Paling cepat, paling mahal. Cocok jika pelanggan bersedia membayar lebih.' }
  ];
  /* jadwal + toleransi (PERT tiga titik: optimis 0,8×, paling mungkin 1×, pesimis 1,5× per tahap) */
  E.schedule = function (db, bd, k, exceptId) {
    var S = db.settings, lem = k === 'lembur' || k === 'express', par = k === 'paralel' || k === 'express', pri = k === 'sisip' || k === 'express';
    var cap = E.capacity(db), capX = lem ? E.capacity(db, S.otMax) : cap, back = pri ? {} : E.backlog(db, exceptId);
    if (lem) Object.keys(capX).forEach(function (x) { var base = cap[x], add = capX[x] - base; capX[x] = base + add * S.otEff; });
    var matLT = bd.mats.filter(function (m) { return m.short > 0; }).reduce(function (s, m) { return Math.max(s, m.m.lt); }, 0);
    var t = par ? matLT * 0.6 : matLT, prev = null, rows = [], v = Math.pow(matLT * 0.2, 2), extra = 0, avail = {};
    Object.keys(capX).forEach(function (x) { avail[x] = capX[x] > 0 ? (back[x] || 0) / capX[x] : 0; });
    bd.steps.forEach(function (st) {
      var c = capX[st.k] || 0.01, dur = st.h / c, sub = k === 'subkon' && st.k === 'cat';
      if (sub) { dur = 3; extra += st.h * E.rate(db, st.k) * 0.6; }
      var start = Math.max(prev ? (par ? prev.start + prev.dur * 0.5 : prev.end) : t, sub ? 0 : avail[st.k]);
      var end = Math.max(start + dur, prev && par ? prev.end + 0.25 : 0);
      if (!sub) avail[st.k] = end;
      rows.push({ k: st.k, h: st.h, start: start, dur: dur, end: end, sub: sub });
      v += Math.pow(dur * (1.5 - 0.8) / 6, 2); prev = { start: start, dur: dur, end: end };
    });
    var end = rows.length ? rows[rows.length - 1].end : t, te = end * (0.8 + 4 + 1.5) / 6;
    var buffer = E.z(S.conf) * Math.sqrt(v), promise = Math.ceil(te + buffer + 1);   // +1 hari QC akhir & packing
    if (lem) extra += bd.steps.reduce(function (s, st) { return s + st.h * (S.otMax / (S.hoursDay + S.otMax)) * E.rate(db, st.k) * (S.otRate - 1); }, 0);
    var delay = 0; if (pri) bd.steps.forEach(function (st) { delay = Math.max(delay, st.h / (cap[st.k] || 1)); });
    return { k: k, rows: rows, matLT: matLT, work: end, buffer: buffer, promise: promise, extra: Math.round(extra), delay: Math.ceil(delay), sigma: Math.sqrt(v) };
  };
  E.addDays = function (date, days, dw) {
    var d = new Date(date + 'T00:00:00'), n = Math.ceil(days);
    while (n > 0) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w === 0 || (dw <= 5 && w === 6)) continue; n--; }
    return d.toISOString().slice(0, 10);
  };
  /* stok minimum (titik pesan ulang) = pemakaian/hari × lead time + z × simpangan × √lead time */
  E.rop = function (db, m) { return Math.ceil(m.d * m.lt + E.z(db.settings.conf) * m.sd * Math.sqrt(m.lt)); };
  /* konsumabel: umur pakai aktual dari laporan mandor (jam kerja ÷ jumlah dipakai) */
  E.consStat = function (db, c) {
    var logs = db.logs.filter(function (l) { return l.c === c.id; }), used = logs.reduce(function (s, l) { return s + l.q; }, 0), hrs = logs.reduce(function (s, l) { return s + (l.h || 0); }, 0);
    var life = used > 0 && hrs > 0 ? hrs / used : c.life, cap = E.capacity(db)[c.skill] || 1, perDay = cap * 0.75 / life;   // utilisasi 75%
    return { used: used, life: life, perDay: perDay, days: c.st / perDay, rop: Math.ceil(perDay * c.lt + E.z(db.settings.conf) * perDay * 0.4 * Math.sqrt(c.lt)), n: logs.length };
  };
  window.ERP = E;
})();
