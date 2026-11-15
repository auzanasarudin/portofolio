/* Labo — the site guide. A small decision tree plus keyword routing; no server, no tracking.
   It stays minimised until asked, nudges once per visitor, and can be hidden for good. */
(function () {
  'use strict';
  var D = window.SITE, API = window.SiteAPI, host = document.getElementById('labo');
  if (!host || !API || !window.LaboSprite) return;
  var L = function (id, en) { return { id: id, en: en }; }, tx = API.tx;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }, del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } } };
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el = {}, isOpen = false, started = false, faceT, nudgeT;

  function money(s) { return API.lang() === 'id' ? 'Rp' + Number(s.idr).toLocaleString('id-ID') : 'US$' + Number(s.usd).toLocaleString('en-US'); }
  function priceText() {
    var rows = D.services.filter(function (s) { return s.home; }).map(function (s) { return '• ' + tx(s.name) + ': ' + (s.id === 'review' ? '' : tx(D.t.lbl.from) + ' ') + money(s); }).join('\n');
    return (API.lang() === 'id' ? 'Harga awal:\n' : 'Starting prices:\n') + rows + '\n' + (API.lang() === 'id' ? 'Lingkup pasti disepakati setelah Auzan melihat contoh data Anda.' : 'The exact scope is agreed after Auzan sees a sample of your data.');
  }
  var O = {
    demo: L('Buka demo', 'Open the demo'), svc: L('Jasa dan harga', 'Service and price'), tell: L('Tulis masalah saya', 'Describe my problem'), home: L('Mulai dari awal', 'Start over'),
    work: L('Lihat karya', 'See the work'), form: L('Buka formulir kontak', 'Open the contact form')
  };
  var NODES = {
    start: { say: L('Halo, saya Labo, pemandu di situs ini. Supaya Anda tidak perlu menggulir jauh: Anda datang sebagai siapa?', 'Hi, I’m Labo, the guide on this site. To save you scrolling: what brings you here?'),
      opts: [['n:recruiter', L('Saya sedang merekrut', 'I’m hiring')], ['n:factory', L('Saya dari pabrik atau bengkel', 'I work at a plant or workshop')], ['n:products', L('Lihat produk digital', 'Show me digital products')], ['n:who', L('Siapa Auzan?', 'Who is Auzan?')]] },
    recruiter: { say: L('Ringkasnya:\n• Production engineer di manufaktur alat berat: BOM, costing, pemantauan robot las.\n• Membangun sendiri alat kerjanya. Tiga di antaranya bisa dicoba di sini.\n• Sedang menempuh S2 Teknik Mesin dan pernah memimpin tim 50 orang.', 'In short:\n• Production engineer in heavy-equipment manufacturing: BOM, costing, welding robot monitoring.\n• Builds his own working tools. Three of them can be tried here.\n• Doing a master’s in mechanical engineering and has led a 50-person team.'),
      opts: [['go:karya', O.work], ['deep:kapabilitas', L('Daftar kapabilitas', 'Capability list')], ['deep:riwayat', L('Riwayat kerja', 'Work history')], ['url:linkedin', L('LinkedIn', 'LinkedIn')], ['brief:5', L('Hubungi soal lowongan', 'Get in touch about a role')]] },
    factory: { say: L('Mana yang paling mirip dengan kondisi Anda?', 'Which of these sounds most like your situation?'),
      opts: [['n:p_change', L('Perubahan engineering macet', 'Engineering changes get stuck')], ['n:p_bom', L('BOM dikonversi manual', 'BOM is converted by hand')], ['n:p_robot', L('Robot atau mesin sering berhenti', 'Robots or machines stop a lot')], ['n:p_excel', L('Laporan masih manual', 'Reports are still manual')], ['n:price', L('Berapa biayanya?', 'What does it cost?')]] },
    p_change: { say: L('Untuk itu ada Change Board. Papan ini menunjukkan tiap perubahan sedang dipegang departemen mana dan sudah berapa hari, lalu menulis rekap rapatnya. Demonya memakai data contoh.', 'That is what Change Board is for. It shows which department holds each change and for how many days, then writes the meeting recap. The demo runs on sample data.'),
      opts: [['demo:change-board', O.demo], ['svc:change', O.svc], ['brief:2', O.tell]] },
    p_bom: { say: L('BOM Bridge mengubah EBOM menjadi MBOM dengan aturan make, buy, dan phantom yang bisa Anda ubah sendiri. Setiap baris mencatat aturan yang memutuskannya.', 'BOM Bridge turns an EBOM into an MBOM using make, buy and phantom rules you can edit yourself. Every line records the rule that decided it.'),
      opts: [['demo:bom-bridge', O.demo], ['svc:bom', O.svc], ['brief:2', O.tell]] },
    p_robot: { say: L('Robot Insight mengubah log alarm menjadi OEE, peringkat penyebab berhenti, dan prakiraan umur consumable. Semua angka di demo adalah data sintetis.', 'Robot Insight turns alarm logs into OEE, a ranked list of stop causes and a consumable-life forecast. Every number in the demo is synthetic.'),
      opts: [['demo:robot-insight', O.demo], ['svc:robot', O.svc], ['brief:3', O.tell]] },
    p_excel: { say: L('Biasanya ini dimulai dari Bedah Data Produksi. Anda mengirim contoh file, Auzan mengembalikan memo temuan dan daftar perbaikan berurut prioritas. Biayanya dipotongkan kalau lanjut ke proyek.', 'This usually starts with a Production Data Review. You send sample files, Auzan returns a findings memo and a prioritised fix list. The fee is credited if you go on to a project.'),
      opts: [['svc:review', L('Lihat Bedah Data', 'See the Data Review')], ['svc:automation', L('Otomasi Excel', 'Excel automation')], ['brief:1', O.tell]] },
    price: { say: priceText, opts: [['deep:jasa', L('Semua layanan', 'All services')], ['brief:7', L('Minta penawaran', 'Ask for a quote')]] },
    products: { say: L('Produk digital dijual dengan merek LABORU. Yang paling lengkap adalah LABORU Level Up: sistem kerja, kebiasaan, dan keuangan yang dimainkan seperti game kantor pixel. Saya juga ada di dalamnya.', 'Digital products are sold under the LABORU brand. The most complete is LABORU Level Up: a work, habit and money system played like a pixel office game. I am in it too.'),
      opts: [['url:laboru', L('Buka landing LABORU', 'Open the LABORU page')], ['go:laboru', L('Lihat di halaman ini', 'See them on this page')], ['deep:produk', L('Katalog lengkap', 'Full catalogue')]] },
    who: { say: L('Auzan mulai dari bengkel las di SMK, lalu menjadi operator CNC, petugas quality control, dan sekarang production engineer. Ia membuat alat yang mengikuti cara orang lantai produksi bekerja.', 'Auzan started in a vocational-school welding shop, then worked as a CNC operator and a quality inspector, and is now a production engineer. He builds tools that follow how shop-floor people work.'),
      opts: [['go:tentang', L('Baca selengkapnya', 'Read more')], ['go:karya', O.work], ['n:contact', L('Cara menghubungi', 'How to get in touch')]] },
    contact: { say: function () { return API.lang() === 'id' ? 'Cara tercepat: tulis masalahnya di formulir kontak, atau kirim email ke ' + D.person.email + '. Auzan membalas di luar jam kerja (WIB).' : 'The quickest way: describe the problem in the contact form, or email ' + D.person.email + '. Auzan replies outside working hours (UTC+7).'; },
      opts: [['go:kontak', O.form], ['url:linkedin', L('LinkedIn', 'LinkedIn')]] },
    nda: { say: function () { return tx(D.faq[1][1]); }, opts: [['deep:faq', L('Pertanyaan lain', 'Other questions')], ['go:kontak', O.form]] },
    how: { say: function () { return tx(D.faq[0][1]); }, opts: [['deep:faq', L('Pertanyaan lain', 'Other questions')], ['go:kontak', O.form]] },
    fallback: { say: L('Saya belum punya jawaban untuk itu. Auzan bisa menjawab langsung, atau pilih salah satu di bawah.', 'I don’t have an answer for that yet. Auzan can answer directly, or pick one of these.'), opts: [['go:kontak', L('Tanya Auzan', 'Ask Auzan')], ['n:start', O.home]] }
  };
  var ROUTES = [
    [/harga|biaya|tarif|price|cost|rate|budget|berapa|how much/i, 'price'], [/\b(m|e|c)?bom\b|bill of material/i, 'p_bom'], [/perubahan|engineering change|ecn|drawing|gambar|rapat|meeting/i, 'p_change'],
    [/robot|las\b|weld|oee|downtime|stop|mesin|machine|maintenance|perawatan/i, 'p_robot'], [/excel|sheet|laporan|report|otomasi|automat|dashboard|manual/i, 'p_excel'],
    [/\bcv\b|resume|recruit|rekrut|hire|hiring|lowongan|job|karier|career|interview/i, 'recruiter'], [/produk|product|laboru|game|ebook|template|beli|buy/i, 'products'],
    [/kontak|contact|email|whatsapp|\bwa\b|hubungi|linkedin|telepon|call/i, 'contact'], [/nda|rahasia|confidential|aman|secure|privasi|privacy/i, 'nda'], [/remote|jarak jauh|jam|kapan|when|lokasi|where|bekasi|onsite|on-site/i, 'how'],
    [/siapa|who|tentang|about|profil|profile|pengalaman|experience/i, 'who'], [/pabrik|bengkel|factory|plant|workshop|produksi|production/i, 'factory'], [/^(halo|hai|hi|hello|hey|pagi|siang|sore|malam)\b/i, 'start']
  ];

  function face(f, ms) {
    var a = el.btn && el.btn.querySelector('.labo-face'), b = el.panel && el.panel.querySelector('.labo-face');
    if (a) a.innerHTML = LaboSprite.svg(f, 44); if (b) b.innerHTML = LaboSprite.svg(f, 30);
    clearTimeout(faceT); faceT = null; if (ms) faceT = setTimeout(function () { faceT = null; face('idle'); }, ms);
  }
  function add(text, me) {
    var m = document.createElement('div'); m.className = 'labo-msg' + (me ? ' me' : ''); m.textContent = text; el.log.appendChild(m);
    while (el.log.children.length > 30) el.log.removeChild(el.log.firstChild);
    el.log.scrollTop = el.log.scrollHeight;
  }
  function options(opts) {
    el.opts.textContent = '';
    (opts || []).forEach(function (o) {
      var act = o[0], label = tx(o[1]), kind = act.split(':')[0], arg = act.slice(kind.length + 1), node;
      if (kind === 'url' || kind === 'demo') {
        node = document.createElement('a');
        if (kind === 'demo') node.href = D.cases.filter(function (c) { return c.id === arg; })[0].demo;
        else { node.href = arg === 'linkedin' ? D.person.linkedin : D.links[arg]; node.target = '_blank'; node.rel = 'noopener'; }
      } else { node = document.createElement('button'); node.type = 'button'; node.setAttribute('data-a', act); }
      node.textContent = label; el.opts.appendChild(node);
    });
  }
  function go(name) {
    var n = NODES[name] || NODES.fallback;
    face(name === 'fallback' ? 'think' : 'happy', 1400);
    setTimeout(function () { add(typeof n.say === 'function' ? n.say() : tx(n.say)); options(n.opts); }, calm ? 0 : 220);
  }
  function scrollTo(id, needDeep) {
    var t = document.getElementById(id);
    if (needDeep || !t || t.offsetParent === null) API.setMode('deep', id); else t.scrollIntoView({ block: 'start' });
    if (window.innerWidth < 700) toggle(false);
  }
  function act(a, label) {
    var kind = a.split(':')[0], arg = a.slice(kind.length + 1);
    add(label, true);
    if (kind === 'n') return go(arg);
    if (kind === 'go') { scrollTo(arg); return face('happy', 1200); }
    if (kind === 'deep') { scrollTo(arg, true); return; }
    if (kind === 'svc') { scrollTo('svc-' + arg); return face('happy', 1200); }
    if (kind === 'brief') { API.prefill(arg); scrollTo('kontak'); var f = document.getElementById('f-name'); if (f && window.innerWidth >= 700) f.focus({ preventScroll: true }); return face('happy', 1200); }
  }
  function route(text) {
    add(text, true);
    for (var i = 0; i < ROUTES.length; i++) if (ROUTES[i][0].test(text)) return go(ROUTES[i][1]);
    go('fallback');
  }
  function toggle(open) {
    isOpen = open; el.panel.hidden = !open; el.btn.setAttribute('aria-expanded', String(open)); el.nudge.hidden = true; clearTimeout(nudgeT); store.set('labo_nudged', '1');
    if (open) { if (!started) { started = true; go('start'); } if (window.innerWidth >= 700) el.input.focus({ preventScroll: true }); }
  }
  function footBtn() { var b = document.getElementById('showLabo'); if (b) b.hidden = store.get('labo_hidden') !== '1'; }

  function build() {
    var id = API.lang() === 'id';
    host.textContent = ''; started = false; isOpen = false; footBtn();
    if (store.get('labo_hidden') === '1') return;
    host.innerHTML =
      '<div class="labo-panel" role="dialog" aria-label="' + (id ? 'Pemandu Labo' : 'Labo guide') + '" hidden>' +
      '<div class="labo-head"><span class="labo-face"></span><div><b>Labo</b><small>' + (id ? 'Pemandu situs · bukan AI, hanya jalan pintas' : 'Site guide · not an AI, just shortcuts') + '</small></div>' +
      '<div class="x"><button type="button" data-labo="hide" title="' + (id ? 'Sembunyikan Labo dari situs' : 'Hide Labo from the site') + '">' + (id ? 'Sembunyikan' : 'Hide') + '</button><button type="button" data-labo="min" aria-label="' + (id ? 'Kecilkan' : 'Minimise') + '">–</button></div></div>' +
      '<div class="labo-log" aria-live="polite"></div><div class="labo-opts"></div>' +
      '<form class="labo-in"><input type="text" id="laboInput" autocomplete="off" maxlength="140" aria-label="' + (id ? 'Tulis pertanyaan' : 'Type a question') + '" placeholder="' + (id ? 'Contoh: harga dashboard OEE' : 'e.g. OEE dashboard price') + '"><button type="submit">' + (id ? 'Kirim' : 'Send') + '</button></form></div>' +
      '<button type="button" class="labo-nudge" hidden>' + (id ? 'Butuh pemandu? Saya bisa tunjukkan karya yang paling relevan untuk Anda.' : 'Need a guide? I can point you to the most relevant work.') + '<i data-labo="nonudge" aria-label="' + (id ? 'Tutup' : 'Dismiss') + '">×</i></button>' +
      '<button type="button" class="labo-btn" aria-expanded="false" aria-label="' + (id ? 'Buka pemandu Labo' : 'Open the Labo guide') + '"><span class="labo-face"></span></button>';
    el = { panel: host.querySelector('.labo-panel'), log: host.querySelector('.labo-log'), opts: host.querySelector('.labo-opts'), input: host.querySelector('#laboInput'), nudge: host.querySelector('.labo-nudge'), btn: host.querySelector('.labo-btn') };
    face('idle');
    if (store.get('labo_nudged') !== '1') nudgeT = setTimeout(function () { if (isOpen) return; el.nudge.hidden = false; store.set('labo_nudged', '1'); nudgeT = setTimeout(function () { el.nudge.hidden = true; }, 14000); }, 14000);
  }

  host.addEventListener('click', function (e) {
    var t = e.target, k = t.getAttribute && t.getAttribute('data-labo');
    if (k === 'nonudge') { e.stopPropagation(); el.nudge.hidden = true; return; }
    if (k === 'min') return toggle(false);
    if (k === 'hide') { store.set('labo_hidden', '1'); return build(); }
    if (t.closest('.labo-nudge')) return toggle(true);
    if (t.closest('.labo-btn')) return toggle(!isOpen);
    var b = t.closest('[data-a]'); if (b) act(b.getAttribute('data-a'), b.textContent);
  });
  host.addEventListener('submit', function (e) { e.preventDefault(); var v = el.input.value.trim(); if (!v) return; el.input.value = ''; route(v); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { toggle(false); el.btn.focus(); } });
  document.addEventListener('click', function (e) { if (e.target.id === 'showLabo') { store.del('labo_hidden'); build(); toggle(true); } });
  document.addEventListener('site:lang', build);
  document.addEventListener('site:render', footBtn);
  document.addEventListener('site:mode', function (e) { if (e.detail === 'deep' && el.btn) face('wow', 1300); });
  if (!calm) setInterval(function () { if (el.btn && !faceT) { face('blink'); setTimeout(function () { if (!faceT) face('idle'); }, 170); } }, 4600);
  build();
})();
