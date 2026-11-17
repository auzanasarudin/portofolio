/* Optimasi Perusahaan — demo publik untuk UMKM, bengkel, dan pabrik.
   Semua area, angka, dan tarif sintetis ("Bengkel Contoh Jaya"). Definisi tiap angka ditulis di layar. */
(function () {
  'use strict';
  var KEY = 'opt_demo_v1';
  var AREAS = ['Gudang bahan', 'Area potong', 'Area pengelasan', 'Area finishing', 'Kantor & admin'];
  var S5 = [['Seiri', 'Ringkas: barang tidak perlu dikeluarkan'], ['Seiton', 'Rapi: semua punya tempat dan label'], ['Seiso', 'Resik: area dan mesin bersih'], ['Seiketsu', 'Rawat: standar tertulis dan visual'], ['Shitsuke', 'Rajin: kebiasaan dicek rutin']];
  var MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'];
  var TYPES = { proses: ['Process reduction', 'var(--accent)'], biaya: ['Cost reduction', 'var(--ok)'], energi: ['Hemat energi', 'var(--hl)'] };
  function seed() {
    var r = M.rng(5), five = {};
    AREAS.forEach(function (a) { five[a] = S5.map(function () { return 1 + Math.floor(r() * 4); }); });
    return {
      five: five,
      kaizen: [
        { t: 'Rak bayangan untuk alat potong', a: 'Area potong', k: 'proses', b: 'Mencari alat ±6 menit/order', s: '±1 menit/order', st: 2 },
        { t: 'Template ukur (poka-yoke) untuk bracket', a: 'Area pengelasan', k: 'biaya', b: '4 dari 50 bracket salah ukur', s: '0 dari 50 pada uji coba', st: 2 },
        { t: 'Laporan harian dari Google Form', a: 'Kantor & admin', k: 'proses', b: 'Ketik ulang 45 menit/hari', s: 'Otomatis, cek 5 menit/hari', st: 1 },
        { t: 'Matikan kompresor saat istirahat', a: 'Area finishing', k: 'energi', b: 'Kompresor menyala 10 jam/hari', s: 'Target 8,5 jam/hari', st: 1 },
        { t: 'Potong pelat pakai nesting', a: 'Area potong', k: 'biaya', b: 'Sisa pelat ±18%', s: 'Target sisa ±11%', st: 0 },
        { t: 'Lampu LED + sensor di gudang', a: 'Gudang bahan', k: 'energi', b: '12 lampu 40 W menyala seharian', s: 'LED 18 W, menyala saat ada orang', st: 0 }
      ],
      cost: { menit: 42, tarif: 35000, kawat: 0.6, hkawat: 38000, gas: 90, hgas: 45, listrik: 2.1, hlistrik: 1450, overhead: 15, unit: 120 },
      energy: { ef: 0.87, lines: [['Mesin las 1–4', 3180, 2.4], ['Kompresor', 2460, 1.9], ['Gerinda & potong', 1240, 0.9], ['Lampu & kantor', 760, 0.6]] }
    };
  }
  var db = M.get(KEY, null) || seed();
  var save = function () { M.set(KEY, db); };
  var areaScore = function (a) { return db.five[a].reduce(function (s, v) { return s + v; }, 0) / 25 * 100; };
  var avg5 = function () { return AREAS.reduce(function (s, a) { return s + areaScore(a); }, 0) / AREAS.length; };
  function costCalc() {
    var c = db.cost, tenaga = c.menit / 60 * c.tarif, kawat = c.kawat * c.hkawat, gas = c.gas * c.hgas, listrik = c.listrik * c.hlistrik;
    var sub = tenaga + kawat + gas + listrik, oh = sub * c.overhead / 100;
    return { tenaga: tenaga, kawat: kawat, gas: gas, listrik: listrik, oh: oh, total: sub + oh };
  }
  var trend = { biaya: [100, 98.6, 95.9, 93.3, 92.3, 90.7], kwh: [8.9, 8.8, 8.4, 8.1, 7.9, 7.6] };

  var views = {
    ringkasan: { label: 'Ringkasan', title: 'Ringkasan optimasi', sub: 'Bengkel Contoh Jaya · Jun–Nov 2026 · data sintetis', render: function (el) {
      var done = db.kaizen.filter(function (k) { return k.st === 2; }).length, c = costCalc(), kwh = db.energy.lines.reduce(function (s, l) { return s + l[1]; }, 0);
      el.innerHTML = '<div class="grid g4">' + M.kpi('Skor 5S rata-rata', M.num(avg5()), '%', 'Rata-rata 5 area, skala 1–5 per S') + M.kpi('Kaizen selesai', done + '/' + db.kaizen.length, '', 'Status selesai = sudah diverifikasi') + M.kpi('Biaya per unit', M.rp(c.total).replace('Rp', 'Rp '), '', 'Dari tab Estimasi biaya') + M.kpi('Emisi listrik / bulan', M.num(kwh * db.energy.ef / 1000, 2), 't CO₂e', 'kWh × faktor emisi ' + db.energy.ef) + '</div>' +
        '<div class="grid g2">' + M.card('Indeks biaya per unit (Jun = 100)', 'Cost reduction: turun setelah template ukur dan nesting. Periode Jun–Nov 2026, data sintetis.', M.line([{ name: 'Indeks biaya per unit', values: trend.biaya, color: 'var(--accent)' }], MONTHS, { dec: 0, min: 80, max: 104, label: 'Tren indeks biaya per unit' })) +
        M.card('Energi per unit (kWh)', 'Hemat energi: kWh dibagi jumlah unit jadi per bulan.', M.line([{ name: 'kWh per unit', values: trend.kwh, color: '#d9a400' }], MONTHS, { dec: 1, min: 6, max: 9.5, target: 7.5, targetLabel: 'Target 7,5', label: 'Tren energi per unit' })) + '</div>' +
        M.card('Skor 5S per area', 'Klik tab Audit 5S untuk menilai ulang.', M.bars(AREAS.map(function (a) { var s = areaScore(a); return { l: a, v: s, t: M.num(s) + '%', c: s >= 70 ? 'var(--ok)' : s >= 50 ? 'var(--accent)' : 'var(--bad)' }; }), { max: 100, target: 70 }));
    } },
    '5s': { label: 'Audit 5S', title: 'Audit 5S', sub: 'Nilai 1 (buruk) sampai 5 (sangat baik) per area. Tersimpan di browser ini.', render: function (el) {
      el.innerHTML = '<div class="grid g5">' + S5.map(function (s, i) { var v = AREAS.reduce(function (t, a) { return t + db.five[a][i]; }, 0) / AREAS.length; return M.kpi(s[0], M.num(v, 1), '/5', M.esc(s[1])); }).join('') + '</div>' +
        AREAS.map(function (a) {
          return M.card(a + ' · ' + M.num(areaScore(a)) + '%', 'Klik angka untuk menilai.', '<div class="tw"><table class="t"><tbody>' + S5.map(function (s, i) {
            return '<tr><td><b>' + s[0] + '</b><br><small>' + s[1] + '</small></td><td style="text-align:right"><span class="score">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-a="' + M.esc(a) + '" data-s="' + i + '" data-n="' + n + '" aria-pressed="' + (db.five[a][i] === n) + '">' + n + '</button>'; }).join('') + '</span></td></tr>';
          }).join('') + '</tbody></table></div>');
        }).join('');
    } },
    kaizen: { label: 'Kaizen', title: 'Register kaizen', sub: 'Setiap perbaikan dicatat dengan kondisi sebelum dan sesudah', render: function (el) {
      var stl = ['Ide', 'Uji coba', 'Selesai'], stc = ['', 'warn', 'ok'];
      el.innerHTML = '<div class="grid g3">' + Object.keys(TYPES).map(function (k) { return M.kpi(TYPES[k][0], db.kaizen.filter(function (z) { return z.k === k; }).length, 'perbaikan', db.kaizen.filter(function (z) { return z.k === k && z.st === 2; }).length + ' selesai'); }).join('') + '</div>' +
        M.card('Daftar perbaikan', 'Klik status untuk menggeser tahapnya.', '<div class="tw"><table class="t"><thead><tr><th>Perbaikan</th><th>Jenis</th><th>Sebelum</th><th>Sesudah / target</th><th>Status</th></tr></thead><tbody>' +
          db.kaizen.map(function (z, i) { return '<tr><td><b>' + M.esc(z.t) + '</b><br><small>' + M.esc(z.a) + '</small></td><td>' + M.pill(TYPES[z.k][0], z.k === 'biaya' ? 'ok' : z.k === 'energi' ? 'warn' : 'info') + '</td><td>' + M.esc(z.b) + '</td><td>' + M.esc(z.s) + '</td><td><button type="button" class="btn sm" data-kz="' + i + '">' + M.pill(stl[z.st], stc[z.st]) + '</button></td></tr>'; }).join('') + '</tbody></table></div>') +
        M.card('Tambah perbaikan', 'Contoh: “Label warna untuk rak baut”.', '<form id="kzf" class="calc"><label>Judul<input id="kzt" required maxlength="80"></label><label>Area<select id="kza">' + AREAS.map(function (a) { return '<option>' + a + '</option>'; }).join('') + '</select></label><label>Jenis<select id="kzk">' + Object.keys(TYPES).map(function (k) { return '<option value="' + k + '">' + TYPES[k][0] + '</option>'; }).join('') + '</select></label><label>Sebelum<input id="kzb" maxlength="80"></label><label>Sesudah / target<input id="kzs" maxlength="80"></label><label>&nbsp;<button class="btn pri" type="submit">Simpan</button></label></form>');
    } },
    biaya: { label: 'Estimasi biaya', title: 'Estimasi biaya per unit', sub: 'Ubah angka di kiri, hasil langsung dihitung. Asumsi tertulis.', render: function (el) {
      var c = db.cost, f = function (k, l, step) { return '<label>' + l + '<input type="number" min="0" step="' + (step || 1) + '" data-c="' + k + '" value="' + c[k] + '"></label>'; };
      var r = costCalc();
      el.innerHTML = '<div class="grid g-2-1">' + M.card('Asumsi', 'Contoh: satu bracket hasil las MIG.', '<div class="calc">' + f('menit', 'Waktu proses (menit/unit)') + f('tarif', 'Tarif tenaga kerja (Rp/jam)', 500) + f('kawat', 'Kawat las (kg/unit)', .05) + f('hkawat', 'Harga kawat (Rp/kg)', 500) + f('gas', 'Gas pelindung (liter/unit)', 5) + f('hgas', 'Harga gas (Rp/liter)', 1) + f('listrik', 'Listrik (kWh/unit)', .1) + f('hlistrik', 'Tarif listrik (Rp/kWh)', 10) + f('overhead', 'Overhead (%)') + f('unit', 'Order (unit)') + '</div>') +
        M.card('Hasil', 'Biaya per unit dan total order.', '<p class="hint">Biaya per unit</p><div class="big">' + M.rp(r.total) + '</div><p class="hint" style="margin-top:10px">Total order ' + c.unit + ' unit</p><div class="big" style="font-size:26px">' + M.rp(r.total * c.unit) + '</div>') + '</div>' +
        M.card('Komposisi biaya per unit', 'Bagian terbesar biasanya jadi sasaran cost reduction pertama.', M.bars([['Tenaga kerja', r.tenaga], ['Kawat las', r.kawat], ['Gas pelindung', r.gas], ['Listrik', r.listrik], ['Overhead', r.oh]].map(function (x) { return { l: x[0], v: x[1], t: M.rp(x[1]) }; })));
    } },
    energi: { label: 'Energi & CO₂', title: 'Energi dan dekarbonisasi', sub: 'Konsumsi listrik per kelompok mesin dan emisi Scope 2', render: function (el) {
      var e = db.energy, tot = e.lines.reduce(function (s, l) { return s + l[1]; }, 0);
      el.innerHTML = '<div class="grid g3">' + M.kpi('Listrik / bulan', M.num(tot), 'kWh', 'Jumlah semua kelompok mesin') + M.kpi('Emisi Scope 2', M.num(tot * e.ef / 1000, 2), 't CO₂e', 'kWh × faktor emisi') + M.kpi('Potensi hemat', M.num(e.lines.reduce(function (s, l) { return s + l[1] * l[2] / 10; }, 0)), 'kWh', 'Jika ide hemat energi di Kaizen berjalan (perkiraan)') + '</div>' +
        '<div class="grid g-2-1">' + M.card('kWh per kelompok mesin', 'Data bulan Nov 2026, sintetis.', M.bars(e.lines.map(function (l) { return { l: l[0], v: l[1], t: M.num(l[1]) }; }))) +
        M.card('Faktor emisi', 'Isi sesuai faktor jaringan listrik yang Anda pakai (kg CO₂e per kWh).', '<div class="calc"><label>Faktor emisi<input type="number" step="0.01" min="0" id="ef" value="' + e.ef + '"></label></div><p class="hint" style="margin-top:10px">Metode: berbasis lokasi (GHG Protocol Scope 2). Emisi pembakaran di luar cakupan demo.</p>') + '</div>';
    } }
  };
  M.shell({ brand: 'Optimasi', sub: 'Perusahaan · UMKM · bengkel', note: 'DEMO · data sintetis · Bengkel Contoh Jaya adalah usaha fiktif', views: views, storeKeys: [KEY] });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-n]');
    if (b) { db.five[b.dataset.a][+b.dataset.s] = +b.dataset.n; save(); return M.rerender(); }
    b = e.target.closest && e.target.closest('[data-kz]');
    if (b) { var z = db.kaizen[+b.dataset.kz]; z.st = (z.st + 1) % 3; save(); return M.rerender(); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.c) { db.cost[t.dataset.c] = Math.max(0, +t.value || 0); save(); var y = window.scrollY; M.rerender(); window.scrollTo(0, y); }
    if (t.id === 'ef') { db.energy.ef = Math.max(0, +t.value || 0); save(); M.rerender(); }
  });
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'kzf') return; e.preventDefault();
    db.kaizen.push({ t: document.getElementById('kzt').value.trim(), a: document.getElementById('kza').value, k: document.getElementById('kzk').value, b: document.getElementById('kzb').value.trim() || '-', s: document.getElementById('kzs').value.trim() || '-', st: 0 });
    save(); M.rerender();
  });
})();
