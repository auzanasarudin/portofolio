/* LABORU ERP — Workshop Naik Kelas. Aplikasi web (berjalan online, data di perangkat + ekspor/impor).
   WhatsApp dipakai sebagai jalur masuk-keluar: pesan disiapkan otomatis dan dikirim lewat wa.me;
   simulator bot meniru perintah bot WhatsApp asli (versi server = tahap berikutnya). */
(function () {
  'use strict';
  var KEY = 'laboru_erp_v1', E = window.ERP, esc = M.esc, rp = M.rp, num = M.num;
  var db = M.get(KEY, null); if (!db || db.v !== 1) db = window.ERP_SEED();
  var save = function () { M.set(KEY, db); };
  var S = function () { return db.settings; };
  var draft = M.get(KEY + '_draft', null) || { item: 'K1', inp: null, opt: [], strat: 'normal', cust: '', wa: '', email: '', offer: 0, custom: null };
  var cur = { project: null, catItem: 'K1', chat: [], pending: null };
  var saveDraft = function () { M.set(KEY + '_draft', draft); };
  var digits = function (s) { s = String(s || '').replace(/\D/g, ''); if (s.charAt(0) === '0') s = '62' + s.slice(1); return s; };
  var waLink = function (no, text) { return 'https://wa.me/' + digits(no) + '?text=' + encodeURIComponent(text); };
  var mailLink = function (to, subj, body) { return 'mailto:' + (to || '') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body); };
  var dt = function (d) { return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); };
  var item = function (id) { return id === 'CUSTOM' ? customItem() : E.byId(db.catalog, id); };
  var skillN = function (k) { return E.skill(db, k).n; };
  var tbl = function (head, rows) { return '<div class="tw"><table class="t"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>'; };
  function customItem() {
    var c = draft.custom || (draft.custom = { n: 'Pesanan custom', bom: [['M01', 1]], steps: [['potong', 30, 15], ['las', 45, 0], ['cat', 20, 15]], cons: [['C1', 0.3], ['C2', 0.4]] });
    return { id: 'CUSTOM', n: c.n, unit: 'unit', inputs: [['q', 'Jumlah unit', 1]], size: 'q', bom: c.bom, steps: c.steps, cons: c.cons, opts: [] };
  }
  function msg(to, role, text, ref) { db.msgs.unshift({ id: Date.now() + Math.random(), at: new Date().toISOString().slice(0, 16).replace('T', ' '), to: to, role: role, text: text, ref: ref || '', sent: false }); if (db.msgs.length > 120) db.msgs.length = 120; }

  /* ---------------- dokumen cetak (ISO 9001) ---------------- */
  function printDoc(title, no, meta, body, sign) {
    var w = window.open('', '_blank'); if (!w) return alert('Izinkan pop-up untuk mencetak dokumen.');
    w.document.write('<!doctype html><html lang="id"><head><meta charset="utf-8"><title>' + esc(title + ' ' + no) + '</title><style>body{font:13px/1.5 system-ui,Arial;margin:28px;color:#111}h1{font-size:20px;margin:0}table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eee}.hd{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:12px}.sg{display:flex;gap:20px;margin-top:40px}.sg div{flex:1;border-top:1px solid #111;padding-top:4px;text-align:center}small{color:#555}@media print{button{display:none}}</style></head><body>' +
      '<div class="hd"><div><h1>' + esc(title) + '</h1><small>' + esc(S().company) + ' · ' + esc(S().city) + '</small></div><div style="text-align:right"><b>' + esc(no) + '</b><br><small>' + dt(S().today) + '</small></div></div>' +
      (meta || '') + body + '<div class="sg">' + (sign || ['Dibuat', 'Diperiksa', 'Disetujui']).map(function (s) { return '<div>' + esc(s) + '</div>'; }).join('') + '</div>' +
      '<p><small>Dokumen dibuat otomatis oleh LABORU ERP · format mengikuti ISO 9001:2015 (informasi terdokumentasi, klausul 7.5).</small></p><button onclick="print()">Cetak / simpan PDF</button></body></html>');
    w.document.close();
  }
  var CHECKS = {
    in: [['Jumlah sesuai surat jalan dan PO', 'Hitung per item. Selisih dicatat di tanda terima.'], ['Ukuran dan ketebalan sesuai', 'Ukur dengan jangka sorong. Plat ≤3 mm toleransi ±0,1 mm.'], ['Tidak berkarat berlubang atau penyok', 'Karat ringan boleh, karat berlubang ditolak dan difoto.'], ['Merek/label sesuai pesanan', 'Mencegah bahan lebih tipis dari spesifikasi.']],
    potong: [['Ukuran potong sesuai gambar ±2 mm', 'Ukur dengan meteran baja, bukan meteran kain.'], ['Sudut potongan siku 90°', 'Cek dengan penyiku sebelum dilas.'], ['Ujung bebas gram tajam', 'Gerinda tipis agar aman dan las menempel rapi.']],
    proc: [['Las penuh tanpa retak', 'Lihat kampuh dari dekat; retak = las ulang.'], ['Tanpa lubang (porositas)', 'Lubang kecil tanda elektroda lembap atau angin.'], ['Percikan las dibersihkan', 'Spatter membuat cat tidak rata.'], ['Rangka lurus, diagonal sama', 'Selisih diagonal ≤3 mm.']],
    las: [['Las penuh tanpa retak', 'Lihat kampuh dari dekat; retak = las ulang.'], ['Rangka lurus, diagonal sama', 'Selisih diagonal ≤3 mm.']],
    cat: [['Permukaan bersih sebelum dicat', 'Bebas minyak, debu, dan karat.'], ['Cat dasar dan cat akhir rata', 'Tidak belang, tidak meleleh.'], ['Cat kering sentuh', 'Tidak lengket saat disentuh ringan.']],
    final: [['Dimensi akhir sesuai pesanan ±3 mm', 'Ukur panjang, lebar, tinggi; catat angka.'], ['Fungsi bekerja', 'Engsel, roda, kunci, atau uji bocor sesuai jenis barang.'], ['Hasil las dan cat rapi', 'Bandingkan dengan foto contoh standar.'], ['Bersih dan siap kirim', 'Tidak ada sisa gram, kotoran, atau label bekas.']],
    kirim: [['Barang terbungkus/terlindung', 'Sudut tajam diberi pelindung agar cat tidak tergores.'], ['Jumlah sesuai surat jalan', 'Dicek bersama sopir.'], ['Foto sebelum berangkat', 'Bukti kondisi barang saat keluar bengkel.']]
  };

  /* ---------------- perhitungan bantu ---------------- */
  function projBD(p) { var it = item(p.item); return it ? E.breakdown(db, it, p.inp, p.opt) : null; }
  function flowOf(p) { return E.byId(db.flows, p.flow) || db.flows[0]; }
  function stepDone(p, i) { var f = flowOf(p).steps[i]; return p.done.indexOf(i) >= 0 || (S().mode === 'kecil' && f[4] === 1); }
  function progress(p) { var f = flowOf(p).steps, n = 0; f.forEach(function (x, i) { if (stepDone(p, i)) n++; }); return n / f.length; }
  function nextStep(p) { var f = flowOf(p).steps; for (var i = 0; i < f.length; i++) if (!stepDone(p, i)) return i; return -1; }
  function bestWorker(k) { var ws = db.workers.filter(function (w) { return w.sk[k]; }).sort(function (a, b) { return b.sk[k] - a.sk[k]; }); return ws[0]; }
  function custReport(p) {
    var f = flowOf(p).steps, n = nextStep(p), it = item(p.item), last = null;
    f.forEach(function (x, i) { if (p.done.indexOf(i) >= 0) last = x[0]; });
    return 'Yth. ' + p.cust + ',\n\nUpdate pesanan ' + p.id + ' (' + (it ? it.n : '') + '):\n• Progres: ' + Math.round(progress(p) * 100) + '%\n• Tahap terakhir selesai: ' + (last || '-') + '\n• Tahap berikutnya: ' + (n >= 0 ? f[n][0] : 'Selesai') + '\n• Perkiraan selesai: ' + dt(p.due) + '\n\nFoto dan checksheet mutu tersedia jika diperlukan.\nTerima kasih,\n' + S().company;
  }
  function jobText(p, k, w) {
    var bd = projBD(p), st = bd.steps.filter(function (x) { return x.k === k; })[0], mats = bd.mats.slice(0, 5).map(function (m) { return '- ' + m.m.n + ': ' + m.need + ' ' + m.m.u; }).join('\n');
    return 'JOB ' + p.id + ' · ' + skillN(k) + '\nUntuk: ' + (w ? w.name : '-') + '\nTarget: ' + (st ? num(st.h, 1) : '-') + ' jam standar\n\nAmbil bahan di rak bahan:\n' + mats + '\n\nInstruksi kerja:\n' + (CHECKS[k === 'las' ? 'proc' : k] || CHECKS.final).map(function (c, i) { return (i + 1) + '. ' + c[0] + ' — ' + c[1]; }).join('\n') + '\n\nSetelah selesai: kirim foto hasil lalu ketik "selesai ' + p.id + '".\nPemakaian konsumabel: "pakai C2 3 6" (kode, jumlah, jam kerja).';
  }

  /* ================= TAMPILAN ================= */
  var V = {};
  V.dashboard = { label: 'Dashboard', title: 'Dashboard bengkel', sub: function () { return S().company + ' · ' + dt(S().today) + ' · data demo'; }, render: function (el) {
    var cap = E.capacity(db), back = E.backlog(db), act = db.projects.filter(function (p) { return !p.closed; });
    var load = db.skills.map(function (s) { return { k: s.k, n: s.n, days: cap[s.k] ? back[s.k] / cap[s.k] : 0 }; });
    var lowStock = db.materials.filter(function (m) { return m.st < E.rop(db, m); }), lowCons = db.consumables.filter(function (c) { return E.consStat(db, c).days < 7; });
    var value = act.reduce(function (s, p) { return s + (p.price || 0); }, 0), maxL = load.reduce(function (a, b) { return b.days > a.days ? b : a; }, { days: 0, n: '-' });
    var late = act.filter(function (p) { var bd = projBD(p); if (!bd) return false; var sc = E.schedule(db, bd, 'normal', p.id); return E.addDays(S().today, sc.work * (1 - progress(p)), S().daysWeek) > p.due; });
    var tips = [];
    load.forEach(function (l) { if (l.days > 10) tips.push(['warn', 'Antrean ' + l.n + ' ' + num(l.days, 1) + ' hari kerja. Order baru: tawarkan jadwal lebih panjang, strategi paralel, atau subkon — jangan langsung lembur panjang.']); });
    late.forEach(function (p) { tips.push(['bad', p.id + ' (' + p.cust + ') berisiko melewati janji ' + dt(p.due) + '. Kabari pelanggan lebih awal dan pertimbangkan lembur terukur maksimal ' + S().otMax + ' jam/hari.']); });
    if (lowStock.length) tips.push(['warn', lowStock.length + ' bahan di bawah stok minimum. Buka Pembelian & stok → "Buat PO otomatis".']);
    if (lowCons.length) tips.push(['warn', 'Konsumabel hampir habis (<7 hari): ' + lowCons.map(function (c) { return c.n; }).join(', ') + '.']);
    act.forEach(function (p) { var bd = projBD(p); if (bd && p.price) { var j = E.judge(p.price, bd.cost.hpp); if (j.c !== 'ok') tips.push([j.c, p.id + ': margin ' + Math.round(j.m * 100) + '% (' + j.t + '). Tinjau harga order sejenis berikutnya.']); } });
    if (act.filter(function (p) { return p.strat === 'lembur' || p.strat === 'express'; }).length >= 2) tips.push(['warn', 'Dua proyek atau lebih memakai lembur. Lembur panjang berminggu-minggu menurunkan produktivitas dan membuat pekerja tidak betah. Gilir lembur antarpekerja.']);
    if (!tips.length) tips.push(['ok', 'Beban dan stok aman. Order baru bisa diterima dengan strategi normal.']);
    el.innerHTML = '<div class="grid g4">' + M.kpi('Proyek aktif', act.length, '', rp(value) + ' nilai order') + M.kpi('Antrean terberat', num(maxL.days, 1), 'hari', esc(maxL.n)) + M.kpi('Bahan < stok minimum', lowStock.length, 'item', lowStock.length ? M.pill('perlu PO', 'warn') : M.pill('aman', 'ok')) + M.kpi('Berisiko terlambat', late.length, 'proyek', late.length ? M.pill('kabari pelanggan', 'bad') : M.pill('sesuai janji', 'ok')) + '</div>' +
      '<div class="grid g-2-1">' + M.card('Antrean kerja per keahlian', 'Jam standar tersisa ÷ kapasitas per hari. Garis kuning = 10 hari kerja.', M.bars(load.map(function (l) { return { l: l.n, v: l.days, t: num(l.days, 1) + ' hari', c: l.days > 10 ? 'var(--bad)' : l.days > 6 ? 'var(--warn)' : 'var(--accent)' }; }), { target: 10, max: Math.max(14, maxL.days) })) +
      M.card('Saran keputusan', 'Dibuat otomatis dari data hari ini.', '<ul class="tips">' + tips.map(function (t) { return '<li class="' + t[0] + '">' + esc(t[1]) + '</li>'; }).join('') + '</ul>') + '</div>' +
      M.card('Proyek berjalan', 'Klik untuk membuka alur kerja dan dokumennya.', tbl(['Proyek', 'Pelanggan', 'Progres', 'Tahap berikutnya', 'Janji selesai', 'Status'], act.map(function (p) { var it = item(p.item), n = nextStep(p), lt = late.indexOf(p) >= 0; return '<tr class="click" data-open="' + p.id + '"><td><b>' + p.id + '</b><br><small>' + esc(it ? it.n : '') + '</small></td><td>' + esc(p.cust) + '</td><td><span class="mb-t" style="display:block;width:110px"><i style="width:' + Math.round(progress(p) * 100) + '%"></i></span><small>' + Math.round(progress(p) * 100) + '%</small></td><td>' + (n >= 0 ? esc(flowOf(p).steps[n][0]) : 'Selesai') + '</td><td>' + dt(p.due) + '</td><td>' + M.pill(lt ? 'risiko telat' : 'aman', lt ? 'bad' : 'ok') + '</td></tr>'; })));
  } };

  V.order = { label: 'Order baru', title: 'Order baru', sub: 'Pilih dari katalog → rincian otomatis → estimasi & strategi → deal', render: function (el) {
    var it = item(draft.item); if (!it) { draft.item = 'K1'; it = item('K1'); }
    if (!draft.inp || draft.inpFor !== it.id) { draft.inp = {}; it.inputs.forEach(function (x) { draft.inp[x[0]] = x[2]; }); draft.inpFor = it.id; draft.opt = []; }
    var bd = E.breakdown(db, it, draft.inp, draft.opt), sch = E.STRATS.map(function (s) { return E.schedule(db, bd, s.k); }), base = sch[0];
    var priceOf = function (sc) { var pr = E.price(db, bd.cost.hpp, sc.extra); if (sc.promise < base.promise * 0.75) pr = Math.ceil(pr * 1.1 / 50000) * 50000; return pr; };
    var sel = sch.filter(function (s) { return s.k === draft.strat; })[0] || base, selPrice = priceOf(sel), offer = draft.offer || selPrice, j = E.judge(offer, bd.cost.hpp + sel.extra);
    var start = S().today, promiseDate = E.addDays(start, sel.promise, S().daysWeek);
    el.innerHTML =
      M.card('1 · Pilih dari katalog', 'Katalog = daftar barang yang biasa dipesan pelanggan. Pilih "Custom" untuk menyusun sendiri dari bahan dan langkah kerja.', '<div class="cat-pick">' + db.catalog.concat([{ id: 'CUSTOM', n: 'Custom (susun sendiri)', unit: 'unit' }]).map(function (c) { return '<button type="button" class="btn' + (c.id === draft.item ? ' pri' : '') + '" data-item="' + c.id + '">' + esc(c.n) + '</button>'; }).join('') + '</div>') +
      M.card('2 · Ukuran & pilihan', 'Ukuran dihitung: ' + esc(it.size) + ' = ' + num(bd.size, 2) + ' ' + esc(it.unit), '<div class="calc">' + it.inputs.map(function (x) { return '<label>' + esc(x[1]) + '<input type="number" min="0" step="0.1" data-inp="' + x[0] + '" value="' + draft.inp[x[0]] + '"></label>'; }).join('') + '</div>' +
        ((it.opts || []).length ? '<div class="opts" style="margin-top:12px">' + it.opts.map(function (o) { return '<label class="opt"><input type="checkbox" data-opt="' + o.k + '"' + (draft.opt.indexOf(o.k) >= 0 ? ' checked' : '') + '><b>' + esc(o.n) + '</b></label>'; }).join('') + '</div>' : '') +
        (draft.item === 'CUSTOM' ? customEditor() : '')) +
      '<div class="grid g2">' + M.card('3a · Bahan yang dibutuhkan', 'Otomatis dari resep bahan. Merah = stok kurang, ikut masuk PO.', tbl(['Bahan', 'Butuh', 'Stok', 'Biaya'], bd.mats.map(function (m) { return '<tr><td>' + esc(m.m.n) + '</td><td>' + num(m.need, 2) + ' ' + esc(m.m.u) + '</td><td>' + (m.short ? M.pill('kurang ' + num(m.short, 1), 'bad') : num(m.m.st)) + '</td><td>' + rp(m.cost) + '</td></tr>'; }))) +
        M.card('3b · Langkah kerja, waktu & konsumabel', 'Jam standar = menit per ' + esc(it.unit) + ' × ukuran + persiapan.', tbl(['Langkah', 'Jam', 'Tenaga'], bd.steps.map(function (s) { return '<tr><td>' + esc(skillN(s.k)) + '</td><td>' + num(s.h, 1) + '</td><td>' + rp(s.h * E.rate(db, s.k)) + '</td></tr>'; })) + '<p class="hint" style="margin-top:8px">Konsumabel: ' + bd.cons.map(function (c) { return esc(c.c.n) + ' ' + num(c.q, 1) + ' ' + c.c.u; }).join(' · ') + '</p>') + '</div>' +
      M.card('3c · Harga pokok (HPP)', 'Bahan + konsumabel + tenaga + pemakaian alat (penyusutan per jam) + overhead ' + S().overhead + '% dari tenaga.', '<div class="grid g5">' + [['Bahan', bd.cost.mat], ['Konsumabel', bd.cost.con], ['Tenaga', bd.cost.labor], ['Alat', bd.cost.tool], ['Overhead', bd.cost.oh]].map(function (x) { return M.kpi(x[0], rp(x[1])); }).join('') + '</div><p style="margin-top:12px">HPP <b>' + rp(bd.cost.hpp) + '</b> · harga saran (margin ' + S().margin + '%) <b>' + rp(E.price(db, bd.cost.hpp)) + '</b> · total ' + num(bd.hours, 1) + ' jam standar</p>') +
      M.card('4 · Estimasi & strategi (bahan negosiasi)', 'Sudah memperhitungkan antrean proyek berjalan, stok bahan, dan toleransi (PERT, keyakinan ' + Math.round(S().conf * 100) + '%). Pilih satu.',
        tbl(['', 'Strategi', 'Kerja', 'Toleransi', 'Janji selesai', 'Biaya tambahan', 'Harga saran', 'Dampak'], sch.map(function (s, i) { var d = E.STRATS[i]; return '<tr><td><input type="radio" name="strat" data-strat="' + s.k + '"' + (s.k === draft.strat ? ' checked' : '') + '></td><td><b>' + esc(d.n) + '</b><br><small>' + esc(d.d) + '</small></td><td>' + num(s.work, 1) + ' hari</td><td>+' + num(s.buffer, 1) + ' hari</td><td><b>' + dt(E.addDays(start, s.promise, S().daysWeek)) + '</b><br><small>' + s.promise + ' hari kerja</small></td><td>' + (s.extra ? rp(s.extra) : '-') + '</td><td><b>' + rp(priceOf(s)) + '</b></td><td>' + (s.delay ? M.pill('proyek lain mundur ±' + s.delay + ' hr', 'warn') : s.matLT ? '<small>tunggu bahan ' + s.matLT + ' hari</small>' : '-') + '</td></tr>'; })) +
        '<div class="gantt">' + sel.rows.map(function (r) { var tot = Math.max(sel.work, 1); return '<div class="gr"><span>' + esc(skillN(r.k)) + (r.sub ? ' (subkon)' : '') + '</span><span class="gt"><i style="left:' + (r.start / tot * 100) + '%;width:' + Math.max(1.5, r.dur / tot * 100) + '%"></i></span><small>' + num(r.start, 1) + '–' + num(r.end, 1) + '</small></div>'; }).join('') + '</div>') +
      M.card('5 · Harga penawaran & deal', 'Isi harga yang mau ditawarkan untuk dicek terhadap HPP strategi terpilih.', '<div class="calc"><label>Harga ditawarkan (Rp)<input type="number" step="50000" min="0" id="offer" value="' + offer + '"></label><label>Nama pelanggan<input id="cust" value="' + esc(draft.cust) + '" placeholder="mis. Pak Rudi"></label><label>WhatsApp pelanggan<input id="cwa" value="' + esc(draft.wa) + '" placeholder="0812…"></label><label>Email pelanggan<input id="cem" value="' + esc(draft.email) + '" placeholder="nama@email.com"></label></div>' +
        '<p style="margin:12px 0">Penilaian harga: ' + M.pill(j.t + ' · margin ' + Math.round(j.m * 100) + '%', j.c) + ' · janji selesai <b>' + dt(promiseDate) + '</b></p>' +
        '<div class="acts"><button class="btn" type="button" id="qPrint">Cetak penawaran</button><a class="btn" target="_blank" rel="noopener" id="qWa" href="' + waLink(draft.wa, quoteText(it, bd, sel, offer, promiseDate)) + '">Kirim penawaran via WhatsApp</a><a class="btn" id="qMail" href="' + mailLink(draft.email, 'Penawaran ' + it.n, quoteText(it, bd, sel, offer, promiseDate)) + '">Kirim via email</a><button class="btn pri" type="button" id="deal">Deal → buat proyek</button></div>');
    V.order._ctx = { it: it, bd: bd, sel: sel, offer: offer, promiseDate: promiseDate };
  } };
  function customEditor() {
    var c = draft.custom, mo = db.materials.map(function (m) { return '<option value="' + m.id + '">' + esc(m.n) + '</option>'; }).join(''), so = db.skills.map(function (s) { return '<option value="' + s.k + '">' + esc(s.n) + '</option>'; }).join(''), co = db.consumables.map(function (x) { return '<option value="' + x.id + '">' + esc(x.n) + '</option>'; }).join('');
    var row = function (kind, r, i, opts, f2) { return '<tr><td><select data-cu="' + kind + '" data-i="' + i + '" data-f="0">' + opts.replace('value="' + r[0] + '"', 'value="' + r[0] + '" selected') + '</select></td><td><input type="number" step="0.05" data-cu="' + kind + '" data-i="' + i + '" data-f="1" value="' + r[1] + '"></td>' + (f2 ? '<td><input type="number" step="5" data-cu="' + kind + '" data-i="' + i + '" data-f="2" value="' + (r[2] || 0) + '"></td>' : '') + '<td><button type="button" class="btn sm" data-cudel="' + kind + '" data-i="' + i + '">×</button></td></tr>'; };
    return '<div class="grid g3" style="margin-top:14px"><div><b>Bahan per unit</b>' + tbl(['Bahan', 'Qty', ''], c.bom.map(function (r, i) { return row('bom', r, i, mo); })) + '<button type="button" class="btn sm" data-cuadd="bom">+ bahan</button></div>' +
      '<div><b>Langkah kerja</b>' + tbl(['Keahlian', 'Menit/unit', 'Persiapan', ''], c.steps.map(function (r, i) { return row('steps', r, i, so, true); })) + '<button type="button" class="btn sm" data-cuadd="steps">+ langkah</button></div>' +
      '<div><b>Konsumabel per unit</b>' + tbl(['Konsumabel', 'Qty', ''], c.cons.map(function (r, i) { return row('cons', r, i, co); })) + '<button type="button" class="btn sm" data-cuadd="cons">+ konsumabel</button><p class="hint" style="margin-top:8px"><button type="button" class="btn sm" id="cuSave">Simpan sebagai item katalog</button></p></div></div>';
  }
  function quoteText(it, bd, sel, price, date) {
    return 'Penawaran ' + S().company + '\n\nBarang: ' + it.n + '\nUkuran: ' + it.inputs.map(function (x) { return x[1] + ' ' + draft.inp[x[0]]; }).join(', ') + ' (' + num(bd.size, 2) + ' ' + it.unit + ')\nHarga: ' + rp(price) + '\nPerkiraan selesai: ' + dt(date) + ' (sudah termasuk toleransi)\nPembayaran: DP 50%, pelunasan saat serah terima.\nMutu: setiap tahap difoto dan diperiksa dengan checksheet; laporan progres dikirim lewat WhatsApp/email.\n\nTerima kasih.';
  }

  V.proyek = { label: 'Proyek', title: 'Proyek & alur kerja', sub: function () { return 'Alur standar ISO 9001 · mode ' + (S().mode === 'kecil' ? 'bengkel kecil (beberapa tahap dilewati, dokumen tetap dibuat)' : 'bengkel menengah (semua tahap)'); }, render: function (el) {
    var act = db.projects.slice().reverse(); if (!cur.project || !E.byId(db.projects, cur.project)) cur.project = act[0] && act[0].id;
    var p = E.byId(db.projects, cur.project);
    el.innerHTML = '<div class="cat-pick">' + act.map(function (x) { return '<button type="button" class="btn' + (x.id === cur.project ? ' pri' : '') + '" data-open="' + x.id + '">' + x.id + ' · ' + esc(x.cust) + (x.closed ? ' ✓' : '') + '</button>'; }).join('') + '</div>' + (p ? projDetail(p) : '<p>Belum ada proyek.</p>');
  } };
  function projDetail(p) {
    var it = item(p.item), bd = projBD(p), f = flowOf(p).steps, n = nextStep(p), rep = custReport(p);
    return '<div class="grid g4">' + M.kpi('Progres', Math.round(progress(p) * 100), '%', (n >= 0 ? 'Berikutnya: ' + esc(f[n][0]) : 'Selesai')) + M.kpi('Nilai order', rp(p.price), '', 'Strategi: ' + esc(p.strat)) + M.kpi('HPP', rp(bd ? bd.cost.hpp : 0), '', bd ? 'margin ' + Math.round(E.judge(p.price, bd.cost.hpp).m * 100) + '%' : '') + M.kpi('Janji selesai', dt(p.due), '', 'Mulai ' + dt(p.start)) + '</div>' +
      M.card('Alur kerja · ' + p.id + ' · ' + (it ? it.n : ''), 'Setiap tahap butuh bukti (foto/catatan/checksheet) sebelum bisa ditandai selesai. Klausul ISO 9001:2015 tertera di tiap tahap.',
        '<ol class="flow-l">' + f.map(function (s, i) {
          var done = p.done.indexOf(i) >= 0, skip = !done && S().mode === 'kecil' && s[4] === 1, ev = p.ev[i] || {}, ck = CHECKS[s[5]], isNext = i === n;
          var need = s[3] === 'auto' ? false : s[3] === 'doc' ? !(ev.note || ev.photo) : !ev.photo;
          var checksOk = !ck || ck.every(function (c, ci) { return ev.checks && ev.checks[ci]; });
          return '<li class="' + (done ? 'done' : skip ? 'skip' : isNext ? 'now' : '') + '"><div class="fl-h"><b>' + (i + 1) + '. ' + esc(s[0]) + '</b><span class="tag">ISO ' + s[1] + '</span>' + (done ? M.pill('selesai', 'ok') : skip ? M.pill('dilewati · dokumen otomatis', 'info') : isNext ? M.pill('dikerjakan', 'warn') : '') + '</div><small>Bukti: ' + esc(s[2]) + '</small>' +
            (isNext ? '<div class="fl-b">' + (ck ? '<div class="cks">' + ck.map(function (c, ci) { return '<label><input type="checkbox" data-ck="' + i + '" data-ci="' + ci + '"' + (ev.checks && ev.checks[ci] ? ' checked' : '') + '> <b>' + esc(c[0]) + '</b><small>' + esc(c[1]) + '</small></label>'; }).join('') + '</div>' : '') +
              '<div class="acts"><label class="btn sm">📷 Foto bukti<input type="file" accept="image/*" capture="environment" data-photo="' + i + '" hidden></label><input class="note" data-note="' + i + '" placeholder="Catatan (opsional)" value="' + esc(ev.note || '') + '">' + (ev.photo ? '<img class="thumb" src="' + ev.photo + '" alt="bukti">' : '') +
              (s[5] && s[5] !== 'in' && s[5] !== 'final' && s[5] !== 'proc' && s[5] !== 'kirim' ? (function () { var w = bestWorker(s[5]); return '<a class="btn sm" target="_blank" rel="noopener" href="' + waLink(w && w.wa, jobText(p, s[5], w)) + '">Kirim job ke ' + esc(w ? w.name : 'pekerja') + ' (WA)</a>'; })() : '') +
              '<button class="btn sm pri" type="button" data-done="' + i + '"' + (need || !checksOk ? ' disabled title="Lengkapi bukti dan checksheet dulu"' : '') + '>Tandai selesai</button>' + docBtn(p, i) + '</div></div>' : (done || skip) ? '<div class="acts">' + (ev.photo ? '<img class="thumb" src="' + ev.photo + '" alt="bukti">' : '') + docBtn(p, i) + '</div>' : '') + '</li>';
        }).join('') + '</ol>') +
      M.card('Laporan untuk pelanggan & pimpinan', 'Ringkasan matang dari data tahap; kirim lewat WhatsApp atau email.', '<pre class="mail">' + esc(rep) + '</pre><div class="acts"><a class="btn pri" target="_blank" rel="noopener" href="' + waLink(p.wa, rep) + '">WhatsApp pelanggan</a><a class="btn" href="' + mailLink(p.email, 'Progres pesanan ' + p.id, rep) + '">Email pelanggan</a><a class="btn" target="_blank" rel="noopener" href="' + waLink(S().waOwner, '[Pimpinan] ' + rep) + '">WhatsApp pimpinan</a></div>');
  }
  function docBtn(p, i) { var s = flowOf(p).steps[i]; return '<button class="btn sm" type="button" data-doc="' + i + '">Cetak: ' + esc(s[2].split('+')[0].trim()) + '</button>'; }
  function printStepDoc(p, i) {
    var s = flowOf(p).steps[i], ev = p.ev[i] || {}, it = item(p.item), bd = projBD(p), ck = CHECKS[s[5]];
    var meta = '<table><tr><th>Proyek</th><td>' + p.id + '</td><th>Pelanggan</th><td>' + esc(p.cust) + '</td></tr><tr><th>Barang</th><td>' + esc(it ? it.n : '') + '</td><th>Klausul</th><td>ISO 9001:2015 ' + s[1] + '</td></tr></table>';
    var body = '';
    if (s[5] === 'kirim' || /Serah/.test(s[0])) body = '<h3>' + (/Serah/.test(s[0]) ? 'Berita acara serah terima' : 'Surat jalan') + '</h3>' + tbl(['Barang', 'Ukuran', 'Jumlah'], ['<tr><td>' + esc(it.n) + '</td><td>' + it.inputs.map(function (x) { return x[1] + ' ' + p.inp[x[0]]; }).join(', ') + '</td><td>' + num(bd.size, 2) + ' ' + it.unit + '</td></tr>']);
    else if (/Rencana/.test(s[0])) body = '<h3>Rencana produksi</h3>' + tbl(['Langkah', 'Jam standar', 'PIC'], bd.steps.map(function (x) { var w = bestWorker(x.k); return '<tr><td>' + esc(skillN(x.k)) + '</td><td>' + num(x.h, 1) + '</td><td>' + esc(w ? w.name : '-') + '</td></tr>'; }));
    else if (/Penawaran/.test(s[0])) body = '<h3>Penawaran harga</h3>' + tbl(['Uraian', 'Harga'], ['<tr><td>' + esc(it.n) + ' (' + num(bd.size, 2) + ' ' + it.unit + ')</td><td>' + rp(p.price) + '</td></tr>']) + '<p>Janji selesai: ' + dt(p.due) + '</p>';
    else if (/Pembelian/.test(s[0])) body = '<h3>Daftar pembelian</h3>' + tbl(['Bahan', 'Butuh', 'Pemasok'], bd.mats.map(function (m) { return '<tr><td>' + esc(m.m.n) + '</td><td>' + num(m.need, 2) + ' ' + m.m.u + '</td><td>' + esc(m.m.sup) + '</td></tr>'; }));
    else if (/Umpan/.test(s[0])) body = '<h3>Survei kepuasan</h3>' + tbl(['Aspek', 'Nilai 1–5'], ['Ketepatan waktu', 'Mutu hasil', 'Komunikasi progres', 'Harga'].map(function (a) { return '<tr><td>' + a + '</td><td></td></tr>'; }));
    if (ck) body += '<h3>Checksheet</h3>' + tbl(['Item periksa', 'Cara / alasan', 'OK'], ck.map(function (c, ci) { return '<tr><td>' + esc(c[0]) + '</td><td>' + esc(c[1]) + '</td><td>' + (ev.checks && ev.checks[ci] ? '✔' : '') + '</td></tr>'; }));
    if (S().mode === 'kecil' && s[4] === 1 && p.done.indexOf(i) < 0) body += '<p><i>Tahap dilewati pada mode bengkel kecil; dokumen ini dibuat otomatis sebagai catatan.</i></p>';
    if (ev.note) body += '<p><b>Catatan:</b> ' + esc(ev.note) + '</p>';
    if (ev.photo) body += '<p><b>Foto bukti:</b><br><img src="' + ev.photo + '" style="max-width:320px;border:1px solid #999"></p>';
    printDoc(s[2].split('+')[0].trim(), p.id + '-' + (i + 1), meta, body, /Serah|Surat|Packing/.test(s[0]) ? ['Pengirim', 'Sopir', 'Penerima'] : null);
  }

  V.beli = { label: 'Pembelian & stok', title: 'Pembelian & stok', sub: 'Stok minimum dihitung otomatis dari pemakaian, lead time, dan tingkat keyakinan', render: function (el) {
    el.innerHTML = '<div class="acts" style="margin-bottom:4px"><button class="btn pri" type="button" id="autoPO">Buat PO otomatis (bahan di bawah minimum)</button></div>' +
      M.card('Stok bahan', 'Stok minimum = pemakaian/hari × lead time + z × simpangan × √lead time. Ubah angka langsung di tabel.', tbl(['Bahan', 'Stok', 'Pakai/hari', 'Lead time (hari)', 'Stok minimum', 'Status', 'Pemasok'], db.materials.map(function (m, i) { var r = E.rop(db, m); return '<tr><td>' + esc(m.n) + '<br><small>' + rp(m.p) + ' / ' + m.u + '</small></td><td><input class="ni" type="number" data-mat="' + i + '" data-f="st" value="' + m.st + '"></td><td><input class="ni" type="number" step="0.1" data-mat="' + i + '" data-f="d" value="' + m.d + '"></td><td><input class="ni" type="number" data-mat="' + i + '" data-f="lt" value="' + m.lt + '"></td><td>' + r + '</td><td>' + (m.st < r ? M.pill('pesan', 'bad') : M.pill('aman', 'ok')) + '</td><td>' + esc(m.sup) + '</td></tr>'; }))) +
      M.card('Purchase order', 'Saat barang datang: foto pengirim/barang → stok bertambah, tanda terima & checksheet incoming dibuat otomatis.', db.pos.length ? tbl(['PO', 'Pemasok', 'Isi', 'Status', ''], db.pos.map(function (o, i) { return '<tr><td><b>' + o.id + '</b><br><small>' + o.date + '</small></td><td>' + esc(o.sup) + '</td><td>' + o.items.map(function (x) { var m = E.byId(db.materials, x[0]); return esc(m ? m.n : x[0]) + ' × ' + x[1]; }).join('<br>') + '</td><td>' + M.pill(o.recv ? 'diterima' : 'dipesan', o.recv ? 'ok' : 'warn') + (o.photo ? '<br><img class="thumb" src="' + o.photo + '" alt="">' : '') + '</td><td class="acts"><a class="btn sm" target="_blank" rel="noopener" href="' + waLink('', poText(o)) + '">WA pemasok</a><button class="btn sm" type="button" data-po-print="' + i + '">Cetak PO</button>' + (o.recv ? '<button class="btn sm" type="button" data-sj="' + i + '">Tanda terima</button>' : '<label class="btn sm pri">📷 Terima barang<input type="file" accept="image/*" capture="environment" data-recv="' + i + '" hidden></label>') + '</td></tr>'; })) : '<p class="hint">Belum ada PO.</p>');
  } };
  function poText(o) { return 'PO ' + o.id + ' dari ' + S().company + '\nMohon dikirim:\n' + o.items.map(function (x) { var m = E.byId(db.materials, x[0]); return '- ' + (m ? m.n : x[0]) + ': ' + x[1] + ' ' + (m ? m.u : ''); }).join('\n') + '\nKirim ke bengkel kami. Mohon sertakan surat jalan. Terima kasih.'; }
  function makePOs(extraNeed) {
    var bySup = {};
    db.materials.forEach(function (m) { var need = (extraNeed && extraNeed[m.id]) || 0, r = E.rop(db, m), after = m.st - need; if (after < r) { var q = Math.ceil(r - after + m.d * m.lt); (bySup[m.sup] = bySup[m.sup] || []).push([m.id, q]); } });
    var made = [];
    Object.keys(bySup).forEach(function (sup) { db.seq.po++; var o = { id: 'PO-' + String(db.seq.po).padStart(4, '0'), sup: sup, items: bySup[sup], date: S().today, recv: false }; db.pos.unshift(o); made.push(o); msg(sup, 'Pemasok', poText(o), o.id); });
    return made;
  }

  V.wa = { label: 'WhatsApp', title: 'Pusat WhatsApp', sub: 'Pesan keluar disiapkan otomatis · simulator bot untuk mandor dan pekerja', render: function (el) {
    el.innerHTML = '<div class="grid g2">' + M.card('Pesan siap kirim', 'Klik "Kirim" untuk membuka WhatsApp dengan teks terisi. Pelanggan juga bisa dikirimi email.', db.msgs.length ? '<div class="outbox">' + db.msgs.slice(0, 30).map(function (m, i) { return '<div class="ob' + (m.sent ? ' sent' : '') + '"><small>' + esc(m.at) + ' · ' + esc(m.role) + ' · ' + esc(m.to) + '</small><pre>' + esc(m.text) + '</pre><div class="acts"><a class="btn sm pri" target="_blank" rel="noopener" data-sent="' + i + '" href="' + waLink(m.no || '', m.text) + '">Kirim WA</a>' + (m.role === 'Pelanggan' ? '<a class="btn sm" href="' + mailLink(m.email || '', 'Info pesanan', m.text) + '">Email</a>' : '') + '</div></div>'; }).join('') + '</div>' : '<p class="hint">Belum ada pesan. Pesan muncul saat order deal, PO dibuat, atau tahap selesai.</p>') +
      M.card('Simulator bot WhatsApp (sebagai mandor)', 'Ketik "menu". Pada versi server, perintah yang sama dikirim dari WhatsApp asli.', '<div class="chat" id="chat">' + cur.chat.map(function (c) { return '<div class="cm ' + c[0] + '">' + (c[2] ? '<img class="thumb" src="' + c[2] + '" alt="">' : '') + esc(c[1]) + '</div>'; }).join('') + '</div><form class="chat-in" id="chatF"><label class="btn sm">📷<input type="file" accept="image/*" id="chatPh" hidden></label><input id="chatT" placeholder="mis. job, status P-0043, pakai C2 3 6" autocomplete="off"><button class="btn pri sm" type="submit">Kirim</button></form>') + '</div>';
    var c = document.getElementById('chat'); if (c) c.scrollTop = c.scrollHeight;
  } };
  function bot(t) {
    var a = t.trim().toLowerCase().split(/\s+/), cmd = a[0], P = function (id) { return E.byId(db.projects, (id || '').toUpperCase()); };
    if (!cmd || cmd === 'menu' || cmd === 'bantuan') return 'Perintah:\n• job — daftar pekerjaan hari ini\n• status P-0043 — progres proyek\n• (kirim foto) lalu "selesai P-0043" — tutup tahap berjalan\n• pakai C2 3 6 — pakai 3 mata gerinda selama 6 jam kerja\n• terima PO-0013 — barang datang (kirim foto dulu)\n• stok — bahan di bawah minimum';
    if (cmd === 'job') return db.projects.filter(function (p) { return !p.closed; }).map(function (p) { var n = nextStep(p); return p.id + ' ' + p.cust + ': ' + (n >= 0 ? flowOf(p).steps[n][0] : 'selesai'); }).join('\n') || 'Tidak ada pekerjaan.';
    if (cmd === 'status') { var p = P(a[1]); return p ? custReport(p) : 'Kode proyek tidak ditemukan.'; }
    if (cmd === 'selesai') {
      var q = P(a[1]); if (!q) return 'Kode proyek tidak ditemukan.'; var n = nextStep(q); if (n < 0) return 'Proyek sudah selesai.';
      if (!cur.pending) return 'Kirim foto bukti dulu untuk tahap "' + flowOf(q).steps[n][0] + '".';
      q.ev[n] = q.ev[n] || {}; q.ev[n].photo = cur.pending; q.ev[n].checks = {}; (CHECKS[flowOf(q).steps[n][5]] || []).forEach(function (c, i) { q.ev[n].checks[i] = true; }); cur.pending = null;
      complete(q, n); return 'Tahap "' + flowOf(q).steps[n][0] + '" ' + q.id + ' selesai. Laporan progres untuk pelanggan sudah disiapkan di Pesan siap kirim.';
    }
    if (cmd === 'pakai') { var c = E.byId(db.consumables, (a[1] || '').toUpperCase()), qty = +a[2] || 0, h = +a[3] || 0; if (!c || !qty) return 'Format: pakai C2 3 6'; c.st = Math.max(0, c.st - qty); db.logs.push({ c: c.id, q: qty, h: h, at: S().today, photo: cur.pending }); cur.pending = null; var s = E.consStat(db, c); return 'Tercatat ' + qty + ' ' + c.u + ' ' + c.n + '. Sisa ' + c.st + ' ' + c.u + ' (±' + num(s.days, 0) + ' hari). Umur pakai rata-rata ' + num(s.life, 2) + ' jam per ' + c.u + '.' + (c.st < s.rop ? ' Perlu pesan ulang.' : ''); }
    if (cmd === 'terima') { var o = E.byId(db.pos, (a[1] || '').toUpperCase()); if (!o) return 'Nomor PO tidak ditemukan.'; if (!cur.pending) return 'Kirim foto barang/surat jalan dulu.'; receive(o, cur.pending); cur.pending = null; return o.id + ' diterima. Stok bertambah, tanda terima dan checksheet incoming dibuat.'; }
    if (cmd === 'stok') { var low = db.materials.filter(function (m) { return m.st < E.rop(db, m); }); return low.length ? low.map(function (m) { return '- ' + m.n + ': ' + m.st + ' (min ' + E.rop(db, m) + ')'; }).join('\n') : 'Semua stok aman.'; }
    return 'Perintah tidak dikenal. Ketik "menu".';
  }
  function receive(o, photo) { o.recv = true; o.photo = photo; o.items.forEach(function (x) { var m = E.byId(db.materials, x[0]); if (m) m.st += x[1]; }); db.seq.sj++; o.sj = 'TT-' + String(db.seq.sj).padStart(4, '0'); save(); }
  function complete(p, i) {
    if (p.done.indexOf(i) < 0) p.done.push(i);
    var k = flowOf(p).steps[i][5]; if (k && p.rem && p.rem[k] != null) p.rem[k] = 0;
    if (/QC akhir/.test(flowOf(p).steps[i][0])) Object.keys(p.rem || {}).forEach(function (x) { p.rem[x] = 0; });
    if (nextStep(p) < 0) p.closed = true;
    msg(p.cust, 'Pelanggan', custReport(p), p.id); db.msgs[0].no = p.wa; db.msgs[0].email = p.email;
    save();
  }

  V.tim = { label: 'Tim & keahlian', title: 'Tim & keahlian', sub: 'Level: 1 belajar (70%), 2 mandiri (100%), 3 ahli (120%). Kapasitas dan strategi ikut berubah.', render: function (el) {
    var cap = E.capacity(db);
    el.innerHTML = M.card('Kapasitas per keahlian', 'Jam standar per hari. Jam pekerja dibagi rata ke keahlian yang ia punya.', M.bars(db.skills.map(function (s) { return { l: s.n, v: cap[s.k], t: num(cap[s.k], 1) + ' j/hr' }; }))) +
      M.card('Pekerja', 'Ubah langsung; tersimpan otomatis.', tbl(['Nama', 'Peran', 'WhatsApp', 'Upah/jam'].concat(db.skills.map(function (s) { return esc(s.n.split(' ')[0]); })).concat(['']), db.workers.map(function (w, i) { return '<tr><td><input data-w="' + i + '" data-f="name" value="' + esc(w.name) + '"></td><td><input data-w="' + i + '" data-f="role" value="' + esc(w.role) + '"></td><td><input data-w="' + i + '" data-f="wa" value="' + esc(w.wa) + '" placeholder="08…"></td><td><input class="ni" type="number" step="1000" data-w="' + i + '" data-f="rate" value="' + w.rate + '"></td>' + db.skills.map(function (s) { return '<td><select data-w="' + i + '" data-sk="' + s.k + '">' + [0, 1, 2, 3].map(function (l) { return '<option' + ((w.sk[s.k] || 0) === l ? ' selected' : '') + '>' + l + '</option>'; }).join('') + '</select></td>'; }).join('') + '<td><button class="btn sm" type="button" data-wdel="' + i + '">×</button></td></tr>'; })) + '<button class="btn sm" type="button" id="wAdd" style="margin-top:10px">+ pekerja</button>') +
      M.card('Lembur yang sehat', '', '<p>Batas lembur ' + S().otMax + ' jam/hari dengan efektivitas ' + Math.round(S().otEff * 100) + '%. Gilir lembur antarpekerja dan hindari lembur berturut-turut lebih dari dua minggu: produktivitas menurun, kesalahan naik, dan pekerja tidak betah. Ubah di Pengaturan.</p>');
  } };

  V.alat = { label: 'Alat & konsumabel', title: 'Alat, mesin & konsumabel', sub: function () { return 'Penyusutan garis lurus per ' + dt(S().today) + ' · umur konsumabel dari laporan mandor'; }, render: function (el) {
    el.innerHTML = M.card('Alat & mesin', 'Nilai buku = harga − (harga − nilai sisa) × umur/umur ekonomis. Biaya per jam masuk ke HPP.', tbl(['Alat', 'Beli', 'Umur terpakai', 'Nilai buku', 'Biaya/jam', 'Sisa umur'], db.tools.map(function (t) { var d = E.dep(t, S().today); return '<tr><td><b>' + esc(t.n) + '</b><br><small>' + rp(t.p) + ' · umur ' + t.life + ' th</small></td><td>' + dt(t.buy) + '</td><td><span class="mb-t" style="display:block;width:120px"><i style="width:' + Math.round(d.pct * 100) + '%;background:' + (d.pct > 0.85 ? 'var(--bad)' : 'var(--accent)') + '"></i></span><small>' + Math.round(d.pct * 100) + '%</small></td><td>' + rp(d.book) + '</td><td>' + rp(d.perH) + '</td><td>' + (d.left < 0.5 ? M.pill('siapkan pengganti', 'bad') : num(d.left, 1) + ' th') + '</td></tr>'; }))) +
      M.card('Konsumabel', 'Umur pakai aktual = jam kerja ÷ jumlah dipakai (dari laporan "pakai" di WhatsApp atau form di bawah).', tbl(['Konsumabel', 'Stok', 'Umur standar', 'Umur aktual', 'Habis dalam', 'Pesan ulang di', 'Laporan'], db.consumables.map(function (c) { var s = E.consStat(db, c); return '<tr><td><b>' + esc(c.n) + '</b><br><small>' + c.id + ' · ' + rp(c.p) + '</small></td><td>' + c.st + ' ' + c.u + '</td><td>' + num(c.life, 2) + ' jam</td><td>' + num(s.life, 2) + ' jam</td><td>' + (s.days < 7 ? M.pill(num(s.days, 0) + ' hari', 'bad') : num(s.days, 0) + ' hari') + '</td><td>' + s.rop + ' ' + c.u + '</td><td>' + s.n + '</td></tr>'; }))) +
      M.card('Laporan pemakaian (mandor)', 'Sama seperti mengetik "pakai C2 3 6" di WhatsApp.', '<form id="useF" class="calc"><label>Konsumabel<select id="uC">' + db.consumables.map(function (c) { return '<option value="' + c.id + '">' + esc(c.n) + '</option>'; }).join('') + '</select></label><label>Jumlah dipakai<input id="uQ" type="number" min="0" step="0.5" value="1"></label><label>Jam kerja<input id="uH" type="number" min="0" step="0.5" value="2"></label><label>&nbsp;<button class="btn pri" type="submit">Catat</button></label></form>');
  } };

  V.katalog = { label: 'Katalog & standar', title: 'Katalog & standar', sub: 'Resep bahan (per satuan), langkah kerja (menit), konsumabel. Semua bisa diubah dan disimpan.', render: function (el) {
    var it = E.byId(db.catalog, cur.catItem) || db.catalog[0]; cur.catItem = it.id;
    var mo = function (sel) { return db.materials.map(function (m) { return '<option value="' + m.id + '"' + (m.id === sel ? ' selected' : '') + '>' + esc(m.n) + '</option>'; }).join(''); };
    var so = function (sel) { return db.skills.map(function (s) { return '<option value="' + s.k + '"' + (s.k === sel ? ' selected' : '') + '>' + esc(s.n) + '</option>'; }).join(''); };
    var co = function (sel) { return db.consumables.map(function (c) { return '<option value="' + c.id + '"' + (c.id === sel ? ' selected' : '') + '>' + esc(c.n) + '</option>'; }).join(''); };
    var r = function (kind, x, i, opts, three) { return '<tr><td><select data-ce="' + kind + '" data-i="' + i + '" data-f="0">' + opts + '</select></td><td><input class="ni" type="number" step="0.01" data-ce="' + kind + '" data-i="' + i + '" data-f="1" value="' + x[1] + '"></td>' + (three ? '<td><input class="ni" type="number" step="5" data-ce="' + kind + '" data-i="' + i + '" data-f="2" value="' + (x[2] || 0) + '"></td>' : '') + '<td><button class="btn sm" type="button" data-cedel="' + kind + '" data-i="' + i + '">×</button></td></tr>'; };
    el.innerHTML = '<div class="cat-pick">' + db.catalog.map(function (c) { return '<button type="button" class="btn' + (c.id === it.id ? ' pri' : '') + '" data-cat="' + c.id + '">' + esc(c.n) + '</button>'; }).join('') + '</div>' +
      M.card(it.n, 'Satuan ' + it.unit + ' · ukuran = ' + it.size, '<div class="calc"><label>Nama<input data-cf="n" value="' + esc(it.n) + '"></label><label>Satuan<input data-cf="unit" value="' + esc(it.unit) + '"></label><label>Rumus ukuran<input data-cf="size" value="' + esc(it.size) + '"></label></div>' +
        '<div class="grid g3" style="margin-top:14px"><div><b>Resep bahan per ' + esc(it.unit) + '</b>' + tbl(['Bahan', 'Qty', ''], it.bom.map(function (x, i) { return r('bom', x, i, mo(x[0])); })) + '<button class="btn sm" type="button" data-ceadd="bom">+ bahan</button></div>' +
        '<div><b>Langkah kerja (menit per ' + esc(it.unit) + ' + persiapan)</b>' + tbl(['Keahlian', 'Menit', 'Persiapan', ''], it.steps.map(function (x, i) { return r('steps', x, i, so(x[0]), true); })) + '<button class="btn sm" type="button" data-ceadd="steps">+ langkah</button></div>' +
        '<div><b>Konsumabel per ' + esc(it.unit) + '</b>' + tbl(['Konsumabel', 'Qty', ''], it.cons.map(function (x, i) { return r('cons', x, i, co(x[0])); })) + '<button class="btn sm" type="button" data-ceadd="cons">+ konsumabel</button></div></div>') +
      M.card('Alur proyek', 'Template ISO 9001. Duplikat untuk membuat alur custom; centang "boleh dilewati" untuk mode bengkel kecil.', db.flows.map(function (f, fi) { return '<p style="margin:10px 0 6px"><b>' + esc(f.n) + '</b> ' + (fi ? '' : '<button class="btn sm" type="button" data-fdup="' + fi + '">Duplikat jadi alur custom</button>') + '</p>' + tbl(['Tahap', 'Klausul', 'Bukti wajib', 'Boleh dilewati'], f.steps.map(function (s, si) { return '<tr><td>' + (fi ? '<input data-fl="' + fi + '" data-si="' + si + '" data-f="0" value="' + esc(s[0]) + '">' : esc(s[0])) + '</td><td>' + s[1] + '</td><td>' + (fi ? '<input data-fl="' + fi + '" data-si="' + si + '" data-f="2" value="' + esc(s[2]) + '">' : esc(s[2])) + '</td><td>' + (fi ? '<input type="checkbox" data-fl="' + fi + '" data-si="' + si + '" data-f="4"' + (s[4] ? ' checked' : '') + '>' : s[4] ? 'ya' : '-') + '</td></tr>'; })); }).join(''));
  } };

  V.dokumen = { label: 'Dokumen ISO', title: 'Dokumen ISO 9001', sub: 'Semua dokumen per proyek, siap cetak atau simpan PDF', render: function (el) {
    el.innerHTML = db.projects.map(function (p) { var f = flowOf(p).steps; return M.card(p.id + ' · ' + p.cust, '', tbl(['Dokumen', 'Klausul', 'Status', ''], f.map(function (s, i) { var ok = p.done.indexOf(i) >= 0, sk = !ok && S().mode === 'kecil' && s[4] === 1; return '<tr><td>' + esc(s[2]) + '</td><td>' + s[1] + '</td><td>' + M.pill(ok ? 'lengkap' : sk ? 'otomatis (dilewati)' : 'belum', ok ? 'ok' : sk ? 'info' : 'warn') + '</td><td><button class="btn sm" type="button" data-pdoc="' + p.id + '" data-i="' + i + '">Cetak</button></td></tr>'; }))); }).join('') +
      M.card('Peta klausul ISO 9001:2015 yang tercakup', '', tbl(['Klausul', 'Di aplikasi'], [['7.1.5 Sumber daya pemantauan', 'Checksheet ukur & alat ukur di setiap QC'], ['7.2 Kompetensi', 'Tim & keahlian (level 1–3)'], ['7.5 Informasi terdokumentasi', 'Semua dokumen tercetak & tersimpan'], ['8.1 Perencanaan operasi', 'Rencana produksi & jadwal'], ['8.2 Persyaratan pelanggan', 'Penawaran, PO, janji selesai'], ['8.4 Pengendalian penyedia eksternal', 'PO pemasok, tanda terima, QC incoming'], ['8.5 Produksi', 'Job via WA, foto tiap tahap, packing & kirim'], ['8.6 Pelepasan produk', 'QC proses & QC akhir'], ['8.7 Ketidaksesuaian', 'Catatan di checksheet; tahap tidak bisa ditutup tanpa bukti'], ['9.1.2 Kepuasan pelanggan', 'Survei umpan balik']].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; })));
  } };

  var TPL = {
    bahan: ['id,nama,satuan,harga,stok,lead_time_hari,pakai_per_hari,simpangan,pemasok', 'M20,Besi UNP 100 (6 m),batang,520000,4,3,0.3,0.2,Toko Besi Sinar'],
    pekerja: ['id,nama,peran,whatsapp,upah_per_jam,potong,las,gerinda,rakit,cat,mesin', 'W7,Fajar,Tukang las,0812xxxx,30000,1,2,1,0,0,0'],
    alat: ['id,nama,harga,tanggal_beli,umur_tahun,nilai_sisa,jam_per_tahun', 'T6,Mesin las MIG,12500000,2026-01-15,4,1000000,1200'],
    konsumabel: ['id,nama,satuan,harga,stok,umur_jam,keahlian,lead_time_hari', 'C6,Kawat MIG 0.8 mm,kg,45000,10,2,las,2']
  };
  V.impor = { label: 'Impor data', title: 'Impor data massal', sub: 'Unduh template CSV, isi di Excel/Sheets, lalu unggah. Data dengan id sama akan diperbarui.', render: function (el) {
    el.innerHTML = '<div class="grid g2">' + Object.keys(TPL).map(function (k) { return M.card('Data ' + k, 'Kolom: ' + TPL[k][0].replace(/,/g, ', '), '<div class="acts"><button class="btn" type="button" data-tpl="' + k + '">Unduh template</button><label class="btn pri">Unggah CSV<input type="file" accept=".csv,text/csv" data-imp="' + k + '" hidden></label></div>'); }).join('') + '</div>' +
      M.card('Cadangan seluruh data', 'Simpan ke Google Drive secara rutin; impor di perangkat lain.', '<div class="acts"><button class="btn pri" type="button" id="expAll">Ekspor JSON</button><label class="btn">Impor JSON<input type="file" accept="application/json" id="impAll" hidden></label></div>');
  } };
  function csvRows(text) { return text.split(/\r?\n/).filter(Boolean).map(function (l) { var out = [], cur2 = '', q = false; for (var i = 0; i < l.length; i++) { var ch = l[i]; if (ch === '"') q = !q; else if ((ch === ',' || ch === ';') && !q) { out.push(cur2.trim()); cur2 = ''; } else cur2 += ch; } out.push(cur2.trim()); return out; }); }
  function importCSV(k, text) {
    var rows = csvRows(text).slice(1), n = 0, up = function (list, obj) { var ex = E.byId(list, obj.id); if (ex) Object.keys(obj).forEach(function (x) { ex[x] = obj[x]; }); else list.push(obj); n++; };
    rows.forEach(function (r) {
      if (!r[0]) return;
      if (k === 'bahan') up(db.materials, { id: r[0], n: r[1], u: r[2], p: +r[3] || 0, st: +r[4] || 0, lt: +r[5] || 1, d: +r[6] || 0, sd: +r[7] || 0, sup: r[8] || '-' });
      if (k === 'pekerja') { var sk = {}; db.skills.forEach(function (s, i) { var v = +r[5 + i] || 0; if (v) sk[s.k] = Math.min(3, v); }); up(db.workers, { id: r[0], name: r[1], role: r[2], wa: r[3], rate: +r[4] || 0, sk: sk }); }
      if (k === 'alat') up(db.tools, { id: r[0], n: r[1], p: +r[2] || 0, buy: r[3], life: +r[4] || 4, salv: +r[5] || 0, hYear: +r[6] || 1000 });
      if (k === 'konsumabel') up(db.consumables, { id: r[0], n: r[1], u: r[2], p: +r[3] || 0, st: +r[4] || 0, life: +r[5] || 1, skill: r[6] || 'las', lt: +r[7] || 1 });
    });
    save(); return n;
  }

  V.atur = { label: 'Pengaturan', title: 'Pengaturan & dasar perhitungan', sub: 'Semua angka standar bisa disesuaikan', render: function (el) {
    var s = S(), f = function (k, l, t, step) { return '<label>' + l + '<input ' + (t === 'text' ? '' : 'type="' + (t || 'number') + '" step="' + (step || 1) + '"') + ' data-set="' + k + '" value="' + esc(s[k]) + '"></label>'; };
    el.innerHTML = M.card('Bengkel', '', '<div class="calc">' + f('company', 'Nama usaha', 'text') + f('city', 'Kota', 'text') + '<label>Mode<select data-set="mode"><option value="kecil"' + (s.mode === 'kecil' ? ' selected' : '') + '>Bengkel kecil (lebih ringkas)</option><option value="menengah"' + (s.mode === 'menengah' ? ' selected' : '') + '>Bengkel menengah (semua tahap)</option></select></label>' + f('waOwner', 'WhatsApp pimpinan', 'text') + f('emailOwner', 'Email pimpinan', 'text') + f('today', 'Tanggal hari ini', 'date') + '</div>') +
      M.card('Standar perhitungan', '', '<div class="calc">' + f('hoursDay', 'Jam kerja/hari') + f('daysWeek', 'Hari kerja/minggu') + f('margin', 'Target margin (%)') + f('overhead', 'Overhead (% dari tenaga)') + f('otMax', 'Batas lembur (jam/hari)') + f('otRate', 'Upah lembur (× upah normal)', null, 0.1) + f('otEff', 'Efektivitas jam lembur (0–1)', null, 0.05) + f('conf', 'Tingkat keyakinan janji (0,8–0,95)', null, 0.05) + '</div>') +
      M.card('Dasar perhitungan (riset & prinsip teknik industri)', '', '<ol class="refs">' +
        '<li><b>Rincian pesanan:</b> Katalog (CBOM) → resep bahan (EBOM) → langkah kerja & waktu (MBOM), disederhanakan menjadi kebutuhan per satuan ukuran + waktu persiapan.</li>' +
        '<li><b>HPP:</b> bahan + konsumabel + tenaga (jam standar × upah rata-rata keahlian) + pemakaian alat (penyusutan per jam) + overhead. Harga = HPP ÷ (1 − margin).</li>' +
        '<li><b>Kapasitas:</b> jam kerja dibagi ke keahlian tiap pekerja × efisiensi level (kurva belajar sederhana 70/100/120%).</li>' +
        '<li><b>Toleransi jadwal:</b> PERT tiga titik (Malcolm dkk., 1959): te = (o + 4m + p)/6, σ = (p − o)/6 dengan o = 0,8m dan p = 1,5m; janji = te + z·√Σσ² (z dari tingkat keyakinan). Prinsip buffer proyek mengikuti Critical Chain (Goldratt, 1997).</li>' +
        '<li><b>Strategi percepatan:</b> overlapping/fast-tracking (tahap mulai saat tahap sebelumnya 50%), crashing dengan lembur, dan subkontrak — biaya tambahan dihitung dan menjadi dasar negosiasi harga percepatan.</li>' +
        '<li><b>Lembur:</b> jam lembur dihitung dengan efektivitas lebih rendah (default 90%) karena studi produktivitas konstruksi/manufaktur menunjukkan lembur berkepanjangan menurunkan output per jam.</li>' +
        '<li><b>Stok minimum:</b> titik pesan ulang = d × LT + z × σd × √LT (model stok pengaman standar).</li>' +
        '<li><b>Alat & mesin:</b> penyusutan garis lurus; umur ekonomis mengikuti pengelompokan harta berwujud (4 atau 8 tahun).</li>' +
        '<li><b>Konsumabel:</b> umur pakai aktual = jam kerja ÷ jumlah dipakai dari laporan lapangan; menggantikan angka standar seiring data bertambah.</li>' +
        '<li><b>Dokumen:</b> struktur mengikuti ISO 9001:2015 klausul 7.5 dan 8.1–8.7 serta 9.1.2.</li></ol><p class="hint">Angka standar adalah perkiraan awal untuk bengkel fabrikasi skala kecil–menengah dan wajib disesuaikan dengan data bengkel Anda.</p>') +
      M.card('Data', '', '<div class="acts"><button class="btn" type="button" id="resetAll">Kembalikan data demo awal</button></div>');
  } };

  /* ---------------- start + event ---------------- */
  M.shell({ brand: 'LABORU ERP', sub: 'Workshop Naik Kelas', note: 'DEMO · data contoh mendekati kondisi bengkel · semua bisa diubah dan disimpan di perangkat ini', views: V, storeKeys: [KEY, KEY + '_draft'] });
  var titleFix = function () { var t = (location.hash || '#dashboard').slice(1), v = V[t]; if (v && typeof v.sub === 'function') document.getElementById('sub').textContent = v.sub(); };
  titleFix(); window.addEventListener('hashchange', titleFix);
  var rer = function () { var y = window.scrollY; M.rerender(); titleFix(); window.scrollTo(0, y); };
  function photo(file, cb) { var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var c = document.createElement('canvas'), w = Math.min(360, im.width); c.width = w; c.height = Math.round(im.height * w / im.width); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.6)); }; im.src = r.result; }; r.readAsDataURL(file); }
  function download(name, text, type) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/csv' })); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button,a,tr') : null; if (!t) return; var d = t.dataset;
    if (d.open) { cur.project = d.open; return M.show('proyek'); }
    if (d.item) { draft.item = d.item; draft.inp = null; draft.offer = 0; saveDraft(); return rer(); }
    if (t.id === 'deal') return deal();
    if (t.id === 'qPrint') { var c = V.order._ctx; return printDoc('Penawaran harga', 'Q-' + db.seq.p, '<p>Kepada: ' + esc(draft.cust || '-') + '</p>', '<pre style="font:inherit">' + esc(quoteText(c.it, c.bd, c.sel, c.offer, c.promiseDate)) + '</pre>'); }
    if (d.done) { var p = E.byId(db.projects, cur.project); complete(p, +d.done); return rer(); }
    if (d.doc) return printStepDoc(E.byId(db.projects, cur.project), +d.doc);
    if (d.pdoc) return printStepDoc(E.byId(db.projects, d.pdoc), +d.i);
    if (t.id === 'autoPO') { var made = makePOs(); save(); alert(made.length ? made.length + ' PO dibuat dan pesan WA ke pemasok disiapkan.' : 'Semua stok di atas minimum.'); return rer(); }
    if (d.poPrint) { var o = db.pos[+d.poPrint]; return printDoc('Purchase order', o.id, '<p>Kepada: ' + esc(o.sup) + '</p>', tbl(['Bahan', 'Jumlah', 'Harga satuan', 'Subtotal'], o.items.map(function (x) { var m = E.byId(db.materials, x[0]); return '<tr><td>' + esc(m.n) + '</td><td>' + x[1] + ' ' + m.u + '</td><td>' + rp(m.p) + '</td><td>' + rp(m.p * x[1]) + '</td></tr>'; }))); }
    if (d.sj) { var o2 = db.pos[+d.sj]; return printDoc('Tanda terima barang', o2.sj || '-', '<p>Dari: ' + esc(o2.sup) + ' · PO ' + o2.id + '</p>', tbl(['Bahan', 'Jumlah', 'Kondisi'], o2.items.map(function (x) { var m = E.byId(db.materials, x[0]); return '<tr><td>' + esc(m.n) + '</td><td>' + x[1] + ' ' + m.u + '</td><td>Baik (QC incoming)</td></tr>'; })) + '<h3>Checksheet incoming</h3>' + tbl(['Item', 'Cara', 'OK'], CHECKS.in.map(function (c) { return '<tr><td>' + c[0] + '</td><td>' + c[1] + '</td><td>✔</td></tr>'; })) + (o2.photo ? '<img src="' + o2.photo + '" style="max-width:320px">' : ''), ['Pengirim', 'Penerima', 'QC']); }
    if (d.sent) { db.msgs[+d.sent].sent = true; save(); }
    if (d.tpl) return download('template_' + d.tpl + '.csv', TPL[d.tpl].join('\n'));
    if (t.id === 'expAll') return download('laboru-erp-' + S().today + '.json', JSON.stringify(db, null, 1), 'application/json');
    if (t.id === 'resetAll' && confirm('Kembalikan semua data ke contoh awal?')) { db = window.ERP_SEED(); save(); return rer(); }
    if (t.id === 'wAdd') { db.workers.push({ id: 'W' + (db.workers.length + 1), name: 'Pekerja baru', role: 'Tukang', wa: '', rate: 28000, sk: { gerinda: 1 } }); save(); return rer(); }
    if (d.wdel && confirm('Hapus pekerja ini?')) { db.workers.splice(+d.wdel, 1); save(); return rer(); }
    if (d.cat) { cur.catItem = d.cat; return rer(); }
    if (d.ceadd) { var it = E.byId(db.catalog, cur.catItem); it[d.ceadd].push(d.ceadd === 'bom' ? ['M01', 0.1] : d.ceadd === 'steps' ? ['rakit', 10, 0] : ['C2', 0.1]); save(); return rer(); }
    if (d.cedel) { E.byId(db.catalog, cur.catItem)[d.cedel].splice(+d.i, 1); save(); return rer(); }
    if (d.cuadd) { draft.custom[d.cuadd].push(d.cuadd === 'bom' ? ['M01', 1] : d.cuadd === 'steps' ? ['rakit', 15, 0] : ['C2', 0.2]); saveDraft(); return rer(); }
    if (d.cudel) { draft.custom[d.cudel].splice(+d.i, 1); saveDraft(); return rer(); }
    if (t.id === 'cuSave') { var nm = prompt('Nama item katalog:', 'Item custom'); if (!nm) return; var id = 'K' + (db.catalog.length + 1) + Date.now() % 100; db.catalog.push({ id: id, n: nm, unit: 'unit', inputs: [['q', 'Jumlah unit', 1]], size: 'q', bom: JSON.parse(JSON.stringify(draft.custom.bom)), steps: JSON.parse(JSON.stringify(draft.custom.steps)), cons: JSON.parse(JSON.stringify(draft.custom.cons)), opts: [] }); save(); draft.item = id; draft.inp = null; saveDraft(); return rer(); }
    if (d.fdup) { var f0 = db.flows[+d.fdup]; db.flows.push({ id: 'F' + (db.flows.length + 1), n: 'Alur custom ' + db.flows.length, steps: JSON.parse(JSON.stringify(f0.steps)) }); save(); return rer(); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target, d = t.dataset, v = t.type === 'checkbox' ? t.checked : t.value;
    if (d.inp) { draft.inp[d.inp] = +v || 0; draft.offer = 0; saveDraft(); return rer(); }
    if (d.opt) { var i = draft.opt.indexOf(d.opt); if (t.checked && i < 0) draft.opt.push(d.opt); if (!t.checked && i >= 0) draft.opt.splice(i, 1); draft.offer = 0; saveDraft(); return rer(); }
    if (d.strat) { draft.strat = d.strat; draft.offer = 0; saveDraft(); return rer(); }
    if (t.id === 'offer') { draft.offer = +v || 0; saveDraft(); return rer(); }
    if (t.id === 'cust' || t.id === 'cwa' || t.id === 'cem') { draft[{ cust: 'cust', cwa: 'wa', cem: 'email' }[t.id]] = v; saveDraft(); return rer(); }
    if (d.cu) { var row = draft.custom[d.cu][+d.i]; row[+d.f] = d.f === '0' ? v : +v || 0; saveDraft(); return rer(); }
    if (d.ck) { var p = E.byId(db.projects, cur.project), ev = p.ev[d.ck] = p.ev[d.ck] || {}; ev.checks = ev.checks || {}; ev.checks[d.ci] = t.checked; save(); return rer(); }
    if (d.note) { var p2 = E.byId(db.projects, cur.project); (p2.ev[d.note] = p2.ev[d.note] || {}).note = v; save(); return rer(); }
    if (d.photo && t.files[0]) return photo(t.files[0], function (u) { var p3 = E.byId(db.projects, cur.project); (p3.ev[d.photo] = p3.ev[d.photo] || {}).photo = u; save(); rer(); });
    if (d.recv && t.files[0]) return photo(t.files[0], function (u) { receive(db.pos[+d.recv], u); rer(); });
    if (d.mat) { db.materials[+d.mat][d.f] = +v || 0; save(); return rer(); }
    if (d.w != null && d.sk) { var w = db.workers[+d.w]; if (+v) w.sk[d.sk] = +v; else delete w.sk[d.sk]; save(); return rer(); }
    if (d.w != null && d.f) { db.workers[+d.w][d.f] = d.f === 'rate' ? +v || 0 : v; save(); return; }
    if (d.ce) { var it = E.byId(db.catalog, cur.catItem); it[d.ce][+d.i][+d.f] = d.f === '0' ? v : +v || 0; save(); return rer(); }
    if (d.cf) { var it2 = E.byId(db.catalog, cur.catItem); it2[d.cf] = v; save(); return rer(); }
    if (d.fl) { var st = db.flows[+d.fl].steps[+d.si]; st[+d.f] = d.f === '4' ? (t.checked ? 1 : 0) : v; save(); return; }
    if (d.set) { S()[d.set] = t.type === 'number' ? +v : v; save(); return rer(); }
    if (d.imp && t.files[0]) { var r = new FileReader(); r.onload = function () { alert(importCSV(d.imp, r.result) + ' baris diimpor.'); rer(); }; return r.readAsText(t.files[0]); }
    if (t.id === 'impAll' && t.files[0]) { var r2 = new FileReader(); r2.onload = function () { try { var x = JSON.parse(r2.result); if (x.v !== 1 || !x.catalog) throw 0; db = x; save(); rer(); } catch (er) { alert('File tidak dikenali.'); } }; return r2.readAsText(t.files[0]); }
    if (t.id === 'chatPh' && t.files[0]) return photo(t.files[0], function (u) { cur.pending = u; cur.chat.push(['me', 'Foto terkirim', u], ['bot', 'Foto diterima. Ketik "selesai P-xxxx" untuk menutup tahap, "terima PO-xxxx" untuk barang datang, atau "pakai ..." untuk konsumabel.']); rer(); });
  });
  document.addEventListener('submit', function (e) {
    if (e.target.id === 'chatF') { e.preventDefault(); var i = document.getElementById('chatT'), q = i.value.trim(); if (!q) return; cur.chat.push(['me', q], ['bot', bot(q)]); save(); return rer(); }
    if (e.target.id === 'useF') { e.preventDefault(); var c = E.byId(db.consumables, document.getElementById('uC').value), q2 = +document.getElementById('uQ').value || 0, h = +document.getElementById('uH').value || 0; c.st = Math.max(0, c.st - q2); db.logs.push({ c: c.id, q: q2, h: h, at: S().today }); save(); return rer(); }
  });
  function deal() {
    var c = V.order._ctx; if (!draft.cust) { alert('Isi nama pelanggan dulu.'); return; }
    db.seq.p++; var id = 'P-' + String(db.seq.p).padStart(4, '0'), it = c.it;
    if (it.id === 'CUSTOM') { var cid = 'KC' + db.seq.p; db.catalog.push({ id: cid, n: draft.custom.n + ' (' + id + ')', unit: 'unit', inputs: it.inputs, size: 'q', bom: draft.custom.bom, steps: draft.custom.steps, cons: draft.custom.cons, opts: [] }); it = E.byId(db.catalog, cid); }
    var rem = {}; c.bd.steps.forEach(function (s) { rem[s.k] = 1; });
    var p = { id: id, cust: draft.cust, wa: draft.wa, email: draft.email, item: it.id, inp: JSON.parse(JSON.stringify(draft.inp)), opt: draft.opt.slice(), strat: draft.strat, price: c.offer, start: S().today, due: c.promiseDate, flow: db.flows[db.flows.length - 1].id, done: [0, 1], ev: { 0: { note: 'Deal tercatat ' + S().today + ' · harga ' + rp(c.offer) }, 1: { note: 'Rencana dibuat otomatis' } }, rem: rem };
    db.projects.push(p);
    var need = {}; c.bd.mats.forEach(function (m) { need[m.m.id] = m.need; }); var pos = makePOs(need);
    c.bd.mats.forEach(function (m) { m.m.st = Math.max(0, m.m.st - Math.min(m.m.st, m.need)); });
    msg(p.cust, 'Pelanggan', 'Terima kasih ' + p.cust + ', pesanan ' + p.id + ' (' + it.n + ') sudah kami jadwalkan.\nPerkiraan selesai: ' + dt(p.due) + '.\nKami kirim foto dan laporan di setiap tahap.\n— ' + S().company, p.id); db.msgs[0].no = p.wa; db.msgs[0].email = p.email;
    var m0 = E.byId(db.workers, 'W1') || db.workers[0];
    msg(m0 ? m0.name : 'Mandor', 'Mandor', 'Proyek baru ' + p.id + ' · ' + it.n + '\nStrategi: ' + draft.strat + '\nJanji selesai: ' + dt(p.due) + '\nRencana jam: ' + c.bd.steps.map(function (s) { return skillN(s.k) + ' ' + num(s.h, 1) + ' j'; }).join(', ') + '\nPO bahan: ' + (pos.map(function (o) { return o.id; }).join(', ') || 'stok cukup'), p.id); db.msgs[0].no = m0 && m0.wa;
    save(); cur.project = id; draft = { item: draft.item, inp: null, opt: [], strat: 'normal', cust: '', wa: '', email: '', offer: 0, custom: null }; saveDraft();
    M.show('proyek');
  }
})();
