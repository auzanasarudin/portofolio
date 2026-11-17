/* Persiapan Audit ISO 9001 / ISO 45001 — demo publik.
   Perusahaan, dokumen, PIC, dan temuan semuanya fiktif ("PT Contoh Fabrikasi"). Klausul mengikuti struktur
   umum ISO (klausul 4–10); teksnya ringkasan sendiri, bukan kutipan standar. */
(function () {
  'use strict';
  var KEY = 'iso_demo_v1', AUDIT = '2027-01-18', TODAY = '2026-11-17';
  var ST = ['Belum', 'Proses', 'Siap'], STC = ['bad', 'warn', 'ok'];
  var PIC = ['Rina (QA)', 'Dodi (HSE)', 'Sari (HRD)', 'Bayu (Produksi)', 'Wulan (PPIC)', 'Agus (Maintenance)'];
  var CL = [
    ['4', 'Konteks organisasi', 'Isu internal-eksternal, pihak berkepentingan, ruang lingkup sistem'],
    ['5', 'Kepemimpinan', 'Komitmen manajemen, kebijakan, peran dan tanggung jawab'],
    ['6', 'Perencanaan', 'Risiko dan peluang, sasaran, perencanaan perubahan'],
    ['7', 'Dukungan', 'Sumber daya, kompetensi, komunikasi, informasi terdokumentasi'],
    ['8', 'Operasi', 'Pengendalian proses, pembelian, produksi, pengendalian bahaya'],
    ['9', 'Evaluasi kinerja', 'Pemantauan, audit internal, tinjauan manajemen'],
    ['10', 'Peningkatan', 'Ketidaksesuaian, tindakan korektif, peningkatan berkelanjutan']
  ];
  function seed() {
    var r = M.rng(11), items = [];
    ['9001', '45001'].forEach(function (std) {
      CL.forEach(function (c) {
        var n = 3 + Math.floor(r() * 3);
        for (var i = 1; i <= n; i++) {
          var x = r(), st = x < .48 ? 2 : x < .8 ? 1 : 0;
          items.push({ id: std + '-' + c[0] + '.' + i, std: std, cl: c[0], name: c[1] + ' · butir ' + i, ev: (std === '9001' ? 'QP-' : 'HP-') + c[0] + '0' + i, pic: PIC[Math.floor(r() * PIC.length)], st: st });
        }
      });
    });
    var docs = [['Manual Sistem Manajemen Terintegrasi', 'Rina (QA)', 'C', 2], ['Prosedur Pengendalian Dokumen', 'Rina (QA)', 'B', 2], ['Prosedur Audit Internal', 'Rina (QA)', 'A', 1], ['Identifikasi Bahaya & Penilaian Risiko (HIRADC)', 'Dodi (HSE)', 'D', 1], ['Rencana Tanggap Darurat', 'Dodi (HSE)', 'B', 0], ['Matriks Kompetensi Karyawan', 'Sari (HRD)', 'A', 1], ['Instruksi Kerja Pengelasan', 'Bayu (Produksi)', 'E', 2], ['Rencana Perawatan Mesin', 'Agus (Maintenance)', 'B', 1], ['Evaluasi Pemasok', 'Wulan (PPIC)', 'A', 0], ['Notulen Tinjauan Manajemen', 'Rina (QA)', 'A', 0], ['Register Peraturan K3', 'Dodi (HSE)', 'C', 2], ['Sasaran Mutu & K3 2026', 'Rina (QA)', 'A', 1]]
      .map(function (d, i) { return { no: 'DOC-' + (101 + i), t: d[0], pic: d[1], rev: d[2], st: d[3] }; });
    var finds = [['Minor', '9001', '7.5', 'Dua instruksi kerja di lantai masih revisi lama', 2], ['Minor', '45001', '8.1', 'APD area gerinda tidak lengkap di satu stasiun', 1], ['OFI', '9001', '9.1', 'Data keluhan pelanggan belum dianalisis tren', 1], ['Mayor', '45001', '6.1', 'Penilaian risiko pekerjaan di ketinggian belum ada', 0], ['Minor', '9001', '8.4', 'Evaluasi pemasok tahun ini belum dilakukan', 0], ['OFI', '45001', '7.4', 'Papan informasi K3 belum diperbarui', 2]]
      .map(function (f, i) { return { no: 'TA-' + (11 + i), lv: f[0], std: f[1], cl: f[2], t: f[3], st: f[4] }; });
    return { items: items, docs: docs, finds: finds };
  }
  var db = M.get(KEY, null) || seed();
  var save = function () { M.set(KEY, db); };
  var pct = function (list) { if (!list.length) return 0; return list.reduce(function (s, x) { return s + x.st; }, 0) / (list.length * 2) * 100; };
  var daysLeft = Math.round((new Date(AUDIT) - new Date(TODAY)) / 864e5);
  var sel = function (st, attr) { return '<select class="stat-sel s' + st + '" ' + attr + '>' + ST.map(function (s, i) { return '<option value="' + i + '"' + (i === st ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>'; };

  var views = {
    ringkasan: { label: 'Ringkasan', title: 'Kesiapan audit', sub: 'PT Contoh Fabrikasi · audit eksternal ' + AUDIT + ' · data sintetis', render: function (el) {
      var s9 = db.items.filter(function (x) { return x.std === '9001'; }), s45 = db.items.filter(function (x) { return x.std === '45001'; });
      var open = db.finds.filter(function (f) { return f.st < 2; }).length, docOk = db.docs.filter(function (d) { return d.st === 2; }).length;
      el.innerHTML = '<div class="grid g4">' + M.kpi('Hari menuju audit', daysLeft, 'hari', 'Tanggal audit ' + AUDIT) + M.kpi('Kesiapan total', M.num(pct(db.items)), '%', 'Siap = 1, proses = ½, belum = 0') + M.kpi('Dokumen siap', docOk + '/' + db.docs.length, '', 'Revisi terbaru dan sudah disahkan') + M.kpi('Temuan terbuka', open, '', open ? M.pill('perlu ditutup', 'bad') : M.pill('aman', 'ok')) + '</div>' +
        '<div class="grid g-2-1">' + M.card('Kesiapan per klausul', 'Rata-rata status butir di tiap klausul, dua standar digabung. Garis kuning = target 80% sebelum audit.',
          M.bars(CL.map(function (c) { var l = db.items.filter(function (x) { return x.cl === c[0]; }); return { l: c[0] + ' · ' + c[1], v: pct(l), t: M.num(pct(l)) + '%', c: pct(l) >= 80 ? 'var(--ok)' : pct(l) >= 50 ? 'var(--accent)' : 'var(--bad)' }; }), { max: 100, target: 80 })) +
        M.card('Per standar', 'Ubah status di tab Checklist, angka ini ikut berubah.', '<div class="gauges">' + M.gauge(pct(s9), 'ISO 9001 · Mutu') + M.gauge(pct(s45), 'ISO 45001 · K3', 'var(--hl)') + '</div>') + '</div>' +
        M.card('Yang paling mendesak', 'Butir berstatus "Belum", urut dari klausul paling awal.', '<div class="tw"><table class="t"><thead><tr><th>Butir</th><th>Standar</th><th>Bukti</th><th>PIC</th></tr></thead><tbody>' +
          db.items.filter(function (x) { return x.st === 0; }).slice(0, 8).map(function (x) { return '<tr><td><b>' + M.esc(x.id) + '</b><br><small>' + M.esc(x.name) + '</small></td><td>ISO ' + x.std + '</td><td>' + x.ev + '</td><td>' + M.esc(x.pic) + '</td></tr>'; }).join('') + '</tbody></table></div>');
    } },
    checklist: { label: 'Checklist klausul', title: 'Checklist klausul', sub: 'Klik status untuk mengubah. Tersimpan di browser ini.', render: function (el, tools) {
      var f = M.get(KEY + '_f', 'all');
      tools.innerHTML = '<div class="seg" role="group">' + [['all', 'Semua'], ['9001', 'ISO 9001'], ['45001', 'ISO 45001']].map(function (o) { return '<button type="button" data-f="' + o[0] + '" aria-pressed="' + (f === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
      var list = db.items.filter(function (x) { return f === 'all' || x.std === f; });
      el.innerHTML = CL.map(function (c) {
        var l = list.filter(function (x) { return x.cl === c[0]; });
        return M.card('Klausul ' + c[0] + ' · ' + c[1], c[2] + ' · kesiapan ' + M.num(pct(l)) + '%', '<div class="tw"><table class="t"><thead><tr><th>Butir</th><th>Standar</th><th>Bukti</th><th>PIC</th><th>Status</th></tr></thead><tbody>' +
          l.map(function (x) { return '<tr><td><b>' + M.esc(x.id) + '</b><br><small>' + M.esc(x.name) + '</small></td><td>ISO ' + x.std + '</td><td>' + x.ev + '</td><td>' + M.esc(x.pic) + '</td><td>' + sel(x.st, 'data-item="' + x.id + '"') + '</td></tr>'; }).join('') + '</tbody></table></div>');
      }).join('');
    } },
    dokumen: { label: 'Dokumen', title: 'Register dokumen', sub: 'Daftar dokumen wajib dan statusnya', render: function (el) {
      el.innerHTML = M.card('Dokumen', 'Siap = revisi terbaru sudah disahkan dan didistribusikan.', '<div class="tw"><table class="t"><thead><tr><th>No</th><th>Dokumen</th><th>Pemilik</th><th>Rev</th><th>Status</th></tr></thead><tbody>' +
        db.docs.map(function (d, i) { return '<tr><td>' + d.no + '</td><td><b>' + M.esc(d.t) + '</b></td><td>' + M.esc(d.pic) + '</td><td>' + d.rev + '</td><td>' + sel(d.st, 'data-doc="' + i + '"') + '</td></tr>'; }).join('') + '</tbody></table></div>');
    } },
    temuan: { label: 'Temuan & CAPA', title: 'Temuan audit internal', sub: 'Mayor, minor, dan peluang perbaikan (OFI) dengan status tindakan korektif', render: function (el) {
      var lv = { Mayor: 'bad', Minor: 'warn', OFI: 'info' };
      el.innerHTML = '<div class="grid g3">' + ['Mayor', 'Minor', 'OFI'].map(function (k) { var l = db.finds.filter(function (f) { return f.lv === k; }); return M.kpi(k, l.length, 'temuan', l.filter(function (f) { return f.st === 2; }).length + ' sudah ditutup'); }).join('') + '</div>' +
        M.card('Daftar temuan', 'Status: Belum = belum ada tindakan, Proses = CAPA berjalan, Siap = ditutup dan diverifikasi.', '<div class="tw"><table class="t"><thead><tr><th>No</th><th>Tingkat</th><th>Klausul</th><th>Temuan</th><th>CAPA</th></tr></thead><tbody>' +
          db.finds.map(function (f, i) { return '<tr><td>' + f.no + '</td><td>' + M.pill(f.lv, lv[f.lv]) + '</td><td>ISO ' + f.std + ' · ' + f.cl + '</td><td>' + M.esc(f.t) + '</td><td>' + sel(f.st, 'data-find="' + i + '"') + '</td></tr>'; }).join('') + '</tbody></table></div>');
    } },
    jadwal: { label: 'Jadwal', title: 'Jadwal menuju audit', sub: 'Urutan kerja delapan minggu sebelum audit eksternal', render: function (el) {
      var steps = [['Minggu 1', 'Cek celah klausul dan bagi PIC', 2], ['Minggu 2', 'Lengkapi dokumen yang kurang', 2], ['Minggu 3–4', 'Sosialisasi ke tiap bagian', 1], ['Minggu 5', 'Audit internal', 1], ['Minggu 6', 'Tutup temuan (CAPA)', 0], ['Minggu 7', 'Tinjauan manajemen', 0], ['Minggu 8', 'Simulasi audit dan cek akhir', 0]];
      el.innerHTML = '<div class="grid g-2-1">' + M.card('Rencana kerja', 'Status mengikuti kondisi data demo.', M.bars(steps.map(function (s) { return { l: s[0] + ' · ' + s[1], v: s[2] * 50, t: ST[s[2]], c: ['var(--bad)', 'var(--accent)', 'var(--ok)'][s[2]] }; }), { max: 100 })) +
        M.card('Hitung mundur', 'Audit eksternal oleh lembaga sertifikasi', '<div class="days"><b>' + daysLeft + '</b><span>hari lagi</span></div><p class="hint" style="margin-top:12px">Saran: semua temuan mayor ditutup paling lambat dua minggu sebelum audit.</p>') + '</div>';
    } }
  };
  M.shell({ brand: 'ISO Ready', sub: 'Persiapan audit 9001 · 45001', note: 'DEMO · data sintetis · PT Contoh Fabrikasi adalah perusahaan fiktif', views: views, storeKeys: [KEY, KEY + '_f'] });
  document.addEventListener('change', function (e) {
    var t = e.target, v = +t.value;
    if (t.dataset.item) db.items.forEach(function (x) { if (x.id === t.dataset.item) x.st = v; });
    else if (t.dataset.doc) db.docs[+t.dataset.doc].st = v;
    else if (t.dataset.find) db.finds[+t.dataset.find].st = v;
    else return;
    t.className = 'stat-sel s' + v; save();
  });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-f]'); if (b) { M.set(KEY + '_f', b.dataset.f); M.rerender(); } });
})();
