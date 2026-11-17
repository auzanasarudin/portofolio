/* Labo — pemandu situs. Selalu ada (tidak bisa disembunyikan, hanya dikecilkan).
   Menjawab pertanyaan bebas dengan mencocokkan kata kunci ke basis pengetahuan di bawah,
   yang isinya diambil dari data.js. Tanpa server, tanpa pelacakan.
   Menambah jawaban = tambah satu objek di KB: { id, k: 'kata kunci dipisah |', a: L(...)/fungsi, o: [aksi] }. */
(function () {
  'use strict';
  var D = window.SITE, API = window.SiteAPI, host = document.getElementById('labo');
  if (!host || !API || !window.LaboSprite) return;
  var L = function (id, en) { return { id: id, en: en }; }, tx = API.tx;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }, del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } } };
  store.del('labo_hidden'); // versi lama punya tombol sembunyikan; pastikan Labo muncul lagi
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el = {}, isOpen = false, started = false, faceT, nudgeT, lastQ = '';
  var id = function () { return API.lang() === 'id'; };
  var deep = function () { return API.mode() === 'deep'; };
  var rp = function (n) { return 'Rp' + Number(n).toLocaleString('id-ID'); };
  var money = function (s) { return id() ? rp(s.idr) : 'US$' + Number(s.usd).toLocaleString('en-US'); };
  var svc = function (k) { return D.services.filter(function (s) { return s.id === k; })[0]; };
  var caseBy = function (k) { return D.cases.filter(function (c) { return c.id === k; })[0]; };
  var lines = function (arr) { return arr.map(function (x) { return '• ' + x; }).join('\n'); };
  var GO_DEEP = ['deep:top', L('Buka versi lengkap', 'Open the full version')];

  /* jawaban harga: di Ringkas tidak menyebut angka, hanya mengarahkan ke Mendalam */
  function priceGate(body) {
    if (!deep()) return id() ? 'Rincian jasa dan harganya ada di versi Mendalam, supaya halaman ini tetap ringkas. Mau saya antar ke sana?' : 'Service details and prices live in the Deep dive, so this page stays short. Shall I take you there?';
    return body();
  }
  function svcText(k) {
    var s = svc(k); return priceGate(function () {
      return tx(s.name) + ' — ' + (s.id === 'review' ? '' : tx(D.t.lbl.from) + ' ') + money(s) + (s.per ? ' ' + tx(s.per) : '') + ' · ' + tx(s.time) + '\n' + tx(s.problem) + '\n' + lines(s.get.map(tx));
    });
  }
  var SVC_HINT = [[/dashboard|oee/, 'dashboard'], [/excel|otomasi|automat|sheets/, 'automation'], [/\bbom|mbom|ebom/, 'bom'], [/robot|mesin|machine/, 'robot'], [/5s|bengkel|umkm|workshop/, 'umkm'], [/iso|audit/, 'iso'], [/bedah|review/, 'review'], [/perubahan|change|drawing/, 'change'], [/estimasi|costing|waktu proses/, 'costing'], [/bulanan|retainer|pendampingan|monthly/, 'retainer'], [/erp|naik kelas/, 'erp']];
  function allPrices() {
    var q = lastQ.toLowerCase(), hit = SVC_HINT.filter(function (h) { return h[0].test(q); })[0];
    if (hit) return svcText(hit[1]);
    return priceGate(function () {
      return (id() ? 'Harga awal jasa:\n' : 'Starting prices:\n') + lines(D.services.map(function (s) { return tx(s.name) + ': ' + money(s) + (s.per ? ' ' + tx(s.per) : ''); })) + '\n' + tx(D.t.lbl.priceNote);
    });
  }
  function productPrices() {
    var p = D.prices, f = function (k) { return rp(p[k][0]); };
    if (!deep()) return id() ? 'Produk digital dijual dengan merek LABORU. Daftar lengkap dan harganya ada di versi Mendalam atau langsung di landing LABORU.' : 'Digital products are sold under the LABORU brand. The full list and prices are in the Deep dive or on the LABORU page.';
    return (id() ? 'Beberapa produk LABORU:\n' : 'Some LABORU products:\n') + lines(['LABORU Level Up Core: ' + f('core'), 'LABORU Level Up Ultimate: ' + f('ultimate'), 'Company Preparation System: ' + f('r07'), 'Company Improvement System: ' + f('r08'), 'Ebook From Zero to Financial Freedom: ' + f('r09'), 'CV ATS Pack: ' + f('r01')]);
  }
  function history() {
    return (id() ? 'Riwayat singkat (terbaru dulu):\n' : 'Short history (latest first):\n') + lines(D.timeline.map(function (t) { var o = D.org[t.o] || {}; return t.y + ' · ' + tx(t.what) + ' · ' + (o.name || tx(t.where)); }));
  }
  function edu() { return lines(D.education.map(function (e) { return tx(e.h) + ', ' + (D.org[e.o] || {}).name + ' (' + tx(e.sub) + ')'; })); }
  function certs() { return (id() ? 'Pelatihan dan sertifikat:\n' : 'Training and certificates:\n') + lines(D.certs.map(function (c) { return tx(c.h); })) + '\n' + tx(D.t.sec.certsNote); }
  function awards() { return lines(D.v2.awards.map(function (a) { return a[0] + ' · ' + tx(a[1]); })); }

  /* ---------------- basis pengetahuan ---------------- */
  var KB = [
    { id: 'hello', k: 'halo|hai|hi|hello|hey|pagi|siang|sore|malam|assalam|permisi|test|tes',
      a: L('Halo! Saya Labo. Tanya apa saja soal Auzan: pengalaman, keahlian, karya, produk, atau cara menghubunginya.', 'Hi! I’m Labo. Ask me anything about Auzan: experience, skills, work, products, or how to reach him.'), o: 'start' },
    { id: 'labo', k: 'labo|kamu siapa|siapa kamu|who are you|bot|robot hijau|maskot|mascot|ai',
      a: L('Saya Labo, maskot LABORU. Saya bukan AI sungguhan: saya mencocokkan pertanyaan Anda dengan isi situs ini. Kalau saya tidak tahu, pertanyaannya bisa langsung dikirim ke Auzan.', 'I’m Labo, the LABORU mascot. I’m not a real AI: I match your question to what’s on this site. If I don’t know, you can send the question straight to Auzan.'), o: [['go:laboru', L('Tentang LABORU', 'About LABORU')]] },
    { id: 'who', k: 'siapa|who|auzan|tentang|about|profil|profile|perkenalan|kenalan|introduce|ceritakan|background|latar',
      a: function () { return tx(D.v2.line) + '\n' + tx(D.v2.s3.text); }, o: [['go:tentang', L('Baca ringkasnya', 'Read the summary')], ['deep:pendidikan', L('Pendidikan', 'Education')], ['deep:riwayat', L('Riwayat kerja', 'Work history')]] },
    { id: 'now', k: 'sekarang|kerja dimana|kerja di mana|where work|current job|perusahaan|employer|hitachi|excavator|alat berat|heavy equipment|production engineer|jabatan|posisi',
      a: function () { var t = D.timeline[0]; return tx(t.what) + ' · ' + D.person.employerName + ' (' + t.y + ')\n' + tx(t.text); }, o: [['deep:riwayat', L('Riwayat lengkap', 'Full history')]] },
    { id: 'exp', k: 'pengalaman|experience|riwayat|history|kerja|karier|career|magang|intern|pkl|ojt|pernah kerja|worked|cv',
      a: history, o: [['deep:riwayat', L('Lihat dengan detail', 'See the detail')], ['url:linkedin', L('LinkedIn', 'LinkedIn')]] },
    { id: 'edu', k: 'pendidikan|education|kuliah|kampus|universitas|university|s1|s2|sarjana|magister|master|unesa|smk|sekolah|school|jurusan|!ipk|!gpa|nilai|lulus|graduate|degree',
      a: function () { return (id() ? 'Pendidikan:\n' : 'Education:\n') + edu(); }, o: [['deep:pendidikan', L('Detail mata kuliah', 'Course detail')]] },
    { id: 'thesis', k: 'tesis|thesis|riset|research|penelitian|lstm|rul|predictive|prediktif|machine learning|ml|dekarbonisasi|decarbon|emisi|emission|energi|energy',
      a: function () { var r = D.research; return tx(r.title) + '.\n' + tx(r.text) + '\n' + lines(r.points.map(function (p) { return tx(p[0]) + ': ' + tx(p[1]); })); }, o: [['deep:riset', L('Buka bagian riset', 'Open the research section')], ['demo:robot-insight', L('Demo Robot Insight', 'Robot Insight demo')]] },
    { id: 'skills', k: 'skill|keahlian|kemampuan|bisa apa|capab|kompetensi|competen|software|tools|aplikasi|keterampilan|expert|ahli',
      a: function () { return (id() ? 'Kemampuan utama:\n' : 'Main capabilities:\n') + lines(D.caps.slice(0, 9).map(function (c) { return tx(c[0]); })); }, o: [['deep:kapabilitas', L('Tabel kemampuan lengkap', 'Full capability table')]] },
    { id: 'cad', k: 'cad|autocad|inventor|siemens|nx|gambar teknik|drawing|desain|design|3d|matlab|mastercam|powermill',
      a: L('CAD dan desain: AutoCAD (sejak SMK), Autodesk Inventor (desain chassis dan body mobil), Siemens NX Basic CAD dan Weld Assistant (pelatihan kerja), simulasi MATLAB, serta Mastercam dan PowerMill untuk program CNC.', 'CAD and design: AutoCAD (since school), Autodesk Inventor (car chassis and body design), Siemens NX Basic CAD and Weld Assistant (workplace training), MATLAB simulation, plus Mastercam and PowerMill for CNC programming.'), o: [['deep:kapabilitas', L('Lihat kemampuan', 'See capabilities')]] },
    { id: 'weld', k: 'las|welding|weld|smaw|fcaw|gmaw|mig|tig|gtaw|oaw|wps|pwht|fabrikasi|fabrication',
      a: L('Pengelasan adalah titik awal Auzan: SMK Teknik Pengelasan Kapal (sertifikat kompetensi nilai 95), praktik GMAW di fabrikasi baja, perbaikan roll di pabrik wire rod, magang welding engineer (WPS, preheat, PWHT), mengajar FCAW 1F–3F, dan sekarang menganalisis data robot las.', 'Welding is where Auzan started: ship welding school (competency score 95), GMAW in steel fabrication, roll repair at a wire-rod mill, a welding engineering internship (WPS, preheat, PWHT), teaching FCAW 1F–3F, and now analysing welding robot data.'), o: [['demo:robot-insight', L('Demo robot las', 'Welding robot demo')], ['deep:riwayat', L('Riwayat', 'History')]] },
    { id: 'cnc', k: '!cnc|machining|bubut|milling|molding|mould|mold|nc program',
      a: L('Auzan pernah jadi programmer CNC: membuat program NC dengan Mastercam dan PowerMill untuk core dan cavity molding body motor listrik, setting tool dan titik nol, lalu menjalankan dan merawat mesinnya.', 'Auzan worked as a CNC programmer: NC programs in Mastercam and PowerMill for electric-motorbike body mould cores and cavities, tool and zero setting, then running and maintaining the machines.'), o: [['deep:riwayat', L('Riwayat', 'History')]] },
    { id: 'quality', k: 'qc|quality|mutu|inspeksi|inspection|checksheet|!iso|9001|45001|audit|sertifikasi iso|mr |management representative|k3|safety|keselamatan',
      a: function () { return (id() ? 'Soal mutu dan K3: Auzan pernah jadi QC sekaligus management representative ISO 9001 dan ISO 45001 — dari audit internal sampai mendampingi audit eksternal perpanjangan. Ia juga membuat checksheet dan go/no-go gauge.' : 'On quality and safety: Auzan worked as QC and ISO 9001 / ISO 45001 management representative, from internal audits through the external renewal audit. He also built checksheets and go/no-go gauges.') + (deep() ? '\n\n' + svcText('iso') : ''); }, o: [['href:demos/iso-ready/index.html', L('Coba demo audit ISO', 'Try the ISO audit demo')], ['svc:iso', L('Jasa persiapan audit', 'Audit preparation service')]] },
    { id: 'lean', k: '!5s|5r|!kaizen|poka|yoke|lean|jepang|japan|japanese|standar|seiri|seiton|gemba|improvement|perbaikan berkelanjutan|efisiensi|efficiency|optimasi|optimi',
      a: function () { return (id() ? 'Auzan terbiasa dengan standar kerja Jepang: 5S, Kaizen, K3, dan Poka-Yoke. Caranya: rapikan dulu, ukur dengan jujur, pasang pencegah salah, baru otomasikan yang berulang.' : 'Auzan is used to Japanese shop-floor standards: 5S, Kaizen, safety and poka-yoke. The approach: tidy first, measure honestly, mistake-proof, then automate what repeats.') + (deep() ? '\n\n' + svcText('umkm') : ''); }, o: [['href:demos/optimasi/index.html#5s', L('Coba demo audit 5S', 'Try the 5S audit demo')], ['svc:umkm', L('Paket rapikan bengkel', 'Workshop tidy-up package')]] },
    { id: 'lead', k: 'memimpin|pimpin|leader|lead|manajemen|management|manage|planning|perencanaan|tim|team|organisasi|organization|garnesa|gm|general manager|kpi|jadwal|schedule|anggaran|budget',
      a: L('Pengalaman memimpin: General Manager Garnesa Racing Team untuk sekitar 50 orang di lima divisi. Ia menyusun roadmap, jadwal, anggaran, KPI anggota, briefing harian, dan evaluasi bulanan satu per satu. Sekarang ia memimpin dua rapat mingguan lintas departemen.', 'Leadership: General Manager of Garnesa Racing Team, about 50 people in five divisions. He set the roadmap, schedule, budget, member KPIs, daily briefings and one-to-one monthly reviews. Today he runs two weekly cross-department meetings.'), o: [['deep:organisasi', L('Organisasi', 'Organisations')], ['go:pengakuan', L('Penghargaan', 'Awards')]] },
    { id: 'awards', k: 'juara|prestasi|award|penghargaan|lomba|kompetisi|competition|kmhe|shell|eco-marathon|menang|win|piala|lkti',
      a: function () { return (id() ? 'Penghargaan:\n' : 'Recognition:\n') + awards(); }, o: [['go:pengakuan', L('Lihat semuanya', 'See them all')]] },
    { id: 'certs', k: 'sertifikat|certificate|certif|pelatihan|training|kursus|course|!toefl|english score|p&id|pid|python course|robot welding panasonic|abc|activity based',
      a: certs, o: [['deep:sertifikat', L('Daftar lengkap', 'Full list')], ['go:kontak', L('Minta salinan', 'Request copies')]] },
    { id: 'lang', k: 'bahasa|language|english|inggris|jepang|japanese|nihongo|speak',
      a: L('Bahasa Indonesia (ibu), Inggris aktif (TOEFL 517, kursus 6 bulan di Pare), dan dasar bahasa Jepang dari SMK.', 'Indonesian (native), working English (TOEFL 517, a 6-month course), and basic Japanese from vocational school.') },
    { id: 'location', k: 'lokasi|location|tinggal|domisili|based|bekasi|cikarang|jakarta|jabodetabek|onsite|on-site|datang|visit|kunjungan|luar kota|relokasi|relocate|remote|wfh|jarak jauh',
      a: function () { return tx(D.person.base) + '.\n' + tx(D.faq[0][1]) + '\n' + tx(D.faq[1][1]); }, o: [['go:kontak', L('Hubungi', 'Get in touch')]] },
    { id: 'hire', k: 'rekrut|recruit|hire|hiring|lowongan|vacancy|job|loker|full time|fulltime|freelance|part time|paruh waktu|tersedia|available|open to|gaji|salary|interview|wawancara|resume',
      a: L('Untuk peluang kerja: Auzan terbuka untuk ngobrol soal peran di production engineering, improvement, atau data dan otomasi manufaktur, juga proyek paruh waktu. Cara tercepat: LinkedIn atau email dengan gambaran perannya.', 'For job opportunities: Auzan is open to talk about roles in production engineering, improvement, or manufacturing data and automation, plus part-time projects. Quickest route: LinkedIn or email with a short role description.'), o: [['url:linkedin', L('LinkedIn', 'LinkedIn')], ['brief:5', L('Kirim lewat formulir', 'Use the form')], ['deep:kapabilitas', L('Kemampuan', 'Capabilities')]] },
    { id: 'erp', k: '!erp|laboru erp|naik kelas|workshop|mandor|kontrol proyek|banyak proyek|kapasitas|prioritas|estimasi waktu|whatsapp bot|chatbot|wa bot|surat jalan|stok bahan|depresiasi|penyusutan',
      a: function () { return (id() ? 'LABORU ERP: Workshop Naik Kelas mengelola bengkel dari order masuk sampai serah terima: katalog → bahan & langkah kerja otomatis, estimasi jadwal yang memperhitungkan proyek berjalan (strategi paralel, lembur terukur, sisip, subkon, express), PO dari stok minimum, foto & checksheet di setiap tahap, dokumen ISO 9001, dan WhatsApp untuk perintah & laporan.' : 'LABORU ERP manages a workshop from incoming order to hand-over: catalogue → automatic materials and work steps, schedules that account for running projects (parallel, measured overtime, priority, subcontract, express), POs from minimum stock, photos and checklists at every stage, ISO 9001 documents, and WhatsApp for instructions and reports.') + (deep() ? '\n\n' + svcText('erp') : ''); }, o: [['href:demos/laboru-erp/index.html#order', L('Coba LABORU ERP', 'Try LABORU ERP')], ['svc:erp', L('Paket implementasi', 'Implementation package')], ['brief:10', L('Ceritakan bengkel saya', 'Describe my workshop')]] },
    { id: 'umkm', k: '!umkm|!ukm|usaha kecil|small business|bengkel|workshop|warung|toko|naik kelas|level up bisnis|sme|home industry|industri rumahan',
      a: function () { return (id() ? 'Untuk UMKM dan bengkel, biasanya mulai dari merapikan dulu: 5S, alur kerja yang tertulis, checksheet sederhana, dan papan status order. Murah dan langsung terasa.' : 'For small businesses and workshops it usually starts with tidying up: 5S, a written work flow, simple checksheets and an order-status board. Cheap and you feel it right away.') + (deep() ? '\n\n' + svcText('umkm') : ''); }, o: [['svc:umkm', L('Lihat paketnya', 'See the package')], ['brief:8', L('Ceritakan kondisi usaha', 'Describe my business')]] },
    { id: 'factory', k: 'pabrik|factory|plant|manufaktur|manufacturing|produksi|production|perusahaan saya|my company|klien|client|jasa|service|bantu|help|konsultan|consult',
      a: L('Ada beberapa masalah yang paling sering Auzan bereskan. Mana yang paling mirip dengan kondisi Anda?', 'There are a few problems Auzan fixes most often. Which sounds like yours?'), o: 'factory' },
    { id: 'change', k: 'perubahan|engineering change|ecn|ecr|revisi|revision|drawing|rapat|meeting|follow up|tindak lanjut|change board',
      a: function () { var c = caseBy('change-board'); return tx(c.name) + ': ' + tx(c.summary); }, o: [['demo:change-board', L('Coba demonya', 'Try the demo')], ['svc:change', L('Jasa dan harga', 'Service and price')], ['brief:2', L('Tulis masalah saya', 'Describe my problem')]] },
    { id: 'bom', k: '!bom|!mbom|!ebom|!cbom|bill of material|struktur produk|product structure|make buy|phantom|erp|sap|bom bridge',
      a: function () { var c = caseBy('bom-bridge'); return tx(c.name) + ': ' + tx(c.summary) + (id() ? '\nMenyusun MBOM proyek adalah pekerjaan harian Auzan.' : '\nBuilding project MBOMs is Auzan’s daily job.'); }, o: [['demo:bom-bridge', L('Coba demonya', 'Try the demo')], ['svc:bom', L('Jasa dan harga', 'Service and price')], ['brief:2', L('Tulis masalah saya', 'Describe my problem')]] },
    { id: 'robot', k: 'robot|!oee|downtime|stop time|berhenti|alarm|mtbf|mttr|maintenance|perawatan|mesin|machine|consumable|robot insight|monitoring',
      a: function () { var c = caseBy('robot-insight'); return tx(c.name) + ': ' + tx(c.summary) + '\n' + tx(c.limits); }, o: [['demo:robot-insight', L('Coba demonya', 'Try the demo')], ['svc:robot', L('Jasa dan harga', 'Service and price')], ['brief:3', L('Tulis masalah saya', 'Describe my problem')]] },
    { id: 'excel', k: 'excel|spreadsheet|sheet|google sheets|laporan|report|otomasi|automation|automate|otomatis|dashboard|visualisasi|visualization|grafik|chart|manual|copy paste|salin',
      a: function () { return (id() ? 'Biasanya dimulai dari Bedah Data Produksi: Anda kirim contoh file, Auzan balas dengan memo temuan dan daftar perbaikan berurut prioritas.' : 'This usually starts with a Production Data Review: you send sample files, Auzan replies with a findings memo and a prioritised fix list.') + (deep() ? '\n\n' + svcText('review') : ''); }, o: [['svc:review', L('Bedah Data', 'Data Review')], ['svc:automation', L('Otomasi Excel', 'Excel automation')], ['svc:dashboard', L('Dashboard OEE', 'OEE dashboard')]] },
    { id: 'costing', k: 'estimasi|estimate|costing|cost|biaya produksi|waktu standar|standard time|waktu proses|process time|consumable|penawaran harga|quotation|hpp|abc',
      a: function () { return (id() ? 'Estimasi waktu proses dan biaya consumable (las, machining, painting, assembly) adalah pekerjaan harian Auzan. Ia juga ikut pelatihan Activity-Based Costing.' : 'Estimating process time and consumable cost (welding, machining, painting, assembly) is Auzan’s daily work. He also trained in Activity-Based Costing.') + (deep() ? '\n\n' + svcText('costing') : ''); }, o: [['svc:costing', L('Jasa dan harga', 'Service and price')], ['brief:4', L('Tulis kebutuhan saya', 'Describe my need')]] },
    { id: 'price', k: 'harga|biaya|tarif|price|pricing|cost|rate|budget|how much|mahal|murah|bayar|fee|paket|package',
      a: allPrices, o: function () { return deep() ? [['go:jasa', L('Semua jasa', 'All services')], ['brief:7', L('Minta penawaran', 'Ask for a quote')]] : [GO_DEEP]; } },
    { id: 'pay', k: 'pembayaran|payment|dp|invoice|transfer|cicil|termin|garansi|warranty|bug|error|revisi gratis',
      a: function () { return tx(D.faq[4][1]) + '\n' + tx(D.faq[5][1]); }, o: [['deep:faq', L('FAQ', 'FAQ')]] },
    { id: 'nda', k: '!nda|rahasia|confidential|privasi|privacy|aman|secure|data kami|our data',
      a: function () { return tx(D.faq[3][1]); }, o: [['deep:faq', L('FAQ', 'FAQ')], ['go:kontak', L('Hubungi', 'Get in touch')]] },
    { id: 'time', k: 'berapa lama|how long|durasi|duration|kapan selesai|deadline|cepat|urgent|mendesak|jam kerja|working hours|kapan',
      a: L('Durasi tergantung paket: Bedah Data 3–5 hari kerja, otomasi satu alur 1–2 minggu, dashboard 2–3 minggu, struktur BOM 3–5 minggu. Auzan mengerjakan di malam hari dan akhir pekan (WIB).', 'It depends on the package: Data Review 3–5 working days, one automation 1–2 weeks, a dashboard 2–3 weeks, BOM structuring 3–5 weeks. Auzan works evenings and weekends (UTC+7).'), o: [['go:jasa', L('Lihat semua paket', 'See all packages')]] },
    { id: 'products', k: 'produk|product|laboru|game|ebook|template|toolkit|beli|buy|lynk|digital|level up|habit|keuangan|finance|financial freedom|cv ats|lamaran',
      a: productPrices, o: [['url:laboru', L('Buka LABORU', 'Open LABORU')], ['deep:produk', L('Katalog lengkap', 'Full catalogue')]] },
    { id: 'demo', k: 'demo|coba|try|data asli|real data|dummy|sintetis|synthetic|contoh data|sample',
      a: L('Enam demo bisa dicoba langsung di browser: LABORU ERP, Robot Insight, dashboard perubahan komponen, Bill of Material Bridge, persiapan audit ISO, dan optimasi perusahaan. Semua datanya sintetis: tidak ada data, gambar kerja, atau nama part dari perusahaan mana pun.', 'Six demos run right in the browser: LABORU ERP, Robot Insight, the change dashboard, Bill of Material Bridge, ISO audit prep and company optimisation. All data is synthetic: no data, drawings or part names from any company.'), o: [['href:demos/iso-ready/index.html', L('Audit ISO', 'ISO audit')], ['href:demos/optimasi/index.html', L('Optimasi perusahaan', 'Company optimisation')], ['demo:robot-insight', 'Robot Insight'], ['demo:change-board', L('Dashboard perubahan komponen', 'Change dashboard')], ['demo:bom-bridge', 'Bill of Material Bridge']] },
    { id: 'site', k: 'website|situs|web ini|this site|dibuat pakai|built with|framework|html|javascript|github|hosting',
      a: L('Situs ini dibuat tanpa framework: HTML, CSS, dan JavaScript biasa, di-hosting di GitHub Pages. Auzan juga membuat landing page LABORU dan Z-ONION.', 'This site uses no framework: plain HTML, CSS and JavaScript on GitHub Pages. Auzan also built the LABORU and Z-ONION landing pages.'), o: [['url:zonion', 'Z-ONION'], ['url:laboru', 'LABORU']] },
    { id: 'export', k: 'ekspor|export|bawang|onion|z-onion|zonion',
      a: L('Z-ONION adalah proyek ekspor bawang. Auzan membuat identitas merek, katalog, profil perusahaan, dan landing page untuk pembeli luar negeri.', 'Z-ONION is an onion export project. Auzan built the brand identity, catalogue, company profile and landing page for overseas buyers.'), o: [['url:zonion', L('Buka Z-ONION', 'Open Z-ONION')]] },
    { id: 'contact', k: 'kontak|contact|email|surel|whatsapp|wa|hubungi|reach|linkedin|telepon|phone|call|nomor|instagram|dm',
      a: function () { return (id() ? 'Email: ' : 'Email: ') + D.person.email + '\nLinkedIn: Auzan Asarudin\nInstagram: @laboru_id\n' + (id() ? 'Auzan membalas sendiri, biasanya malam hari (WIB).' : 'Auzan replies himself, usually in the evening (UTC+7).'); }, o: [['go:kontak', L('Ke bagian kontak', 'Go to contact')], ['url:linkedin', 'LinkedIn']] },
    { id: 'hobby', k: 'hobi|hobby|catur|chess|suka|like|game favorit|fun fact|santai',
      a: L('Fakta kecil: waktu SMP, Auzan juara 1 catur classmeet tiga tahun berturut-turut. Dari situ ia suka hal yang butuh logika, hitungan, dan strategi.', 'A small fact: in junior high Auzan won the school chess tournament three years running. That’s where his taste for logic, numbers and strategy comes from.') },
    { id: 'deep', k: 'mendalam|lengkap|detail|full|semua|selengkapnya|deep dive|more',
      a: L('Versi Mendalam berisi studi kasus, cara kerja, riwayat lengkap, pendidikan, sertifikat, produk, jasa, dan FAQ.', 'The Deep dive has case studies, how Auzan works, full history, education, certificates, products, services and FAQ.'), o: function () { return deep() ? [['go:studi', L('Studi kasus', 'Case studies')], ['go:riwayat', L('Riwayat', 'History')], ['go:jasa', L('Jasa', 'Services')]] : [GO_DEEP]; } }
  ];
  var OPTS = {
    start: function () { return [['n:hire', L('Saya sedang merekrut', 'I’m hiring')], ['n:factory', L('Saya dari pabrik / usaha', 'I run a plant / business')], ['n:who', L('Siapa Auzan?', 'Who is Auzan?')], ['n:products', L('Produk digital', 'Digital products')]].concat(deep() ? [] : [GO_DEEP]); },
    factory: function () { return [['n:change', L('Perubahan engineering macet', 'Engineering changes get stuck')], ['n:bom', L('BOM dikonversi manual', 'BOM converted by hand')], ['n:robot', L('Mesin sering berhenti', 'Machines stop a lot')], ['n:excel', L('Laporan masih manual', 'Reports are manual')], ['n:umkm', L('Bengkel / UMKM berantakan', 'Messy workshop / small business')], ['n:quality', L('Mau audit ISO', 'ISO audit coming')]]; }
  };
  var FALLBACK = L('Hmm, yang itu saya belum tahu jawabannya. Pertanyaan Anda bisa saya teruskan ke Auzan lewat email, atau coba tanya dengan kata lain (misalnya: pengalaman, 5S, harga, sertifikat).', 'Hmm, I don’t know that one yet. I can pass your question to Auzan by email, or try other words (e.g. experience, 5S, price, certificates).');

  /* ---------------- pencocokan ---------------- */
  function norm(s) { return ' ' + String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9&+.\- ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }
  var index = KB.map(function (e) { return { e: e, keys: e.k.split('|').map(function (k) { return k.trim(); }) }; });
  function score(q) {
    return index.map(function (x) {
      var sc = 0;
      x.keys.forEach(function (k) {
        if (!k) return;
        var strong = k.charAt(0) === '!'; if (strong) k = k.slice(1);
        var hit = k.length <= 3 ? q.indexOf(' ' + k + ' ') >= 0 || q.indexOf(' ' + k + '?') >= 0 : q.indexOf(k) >= 0;
        if (hit) sc += strong || k.indexOf(' ') > 0 ? 3 : k.length >= 6 ? 2 : 1;
      });
      return { e: x.e, sc: sc };
    }).filter(function (r) { return r.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; });
  }
  function entry(name) { return KB.filter(function (e) { return e.id === name; })[0]; }

  /* ---------------- tampilan ---------------- */
  function face(f, ms) {
    var a = el.btn && el.btn.querySelector('.labo-face'), b = el.panel && el.panel.querySelector('.labo-face');
    if (a) a.innerHTML = LaboSprite.svg(f, 44); if (b) b.innerHTML = LaboSprite.svg(f, 30);
    clearTimeout(faceT); faceT = null; if (ms) faceT = setTimeout(function () { faceT = null; face('idle'); }, ms);
  }
  function add(text, me) {
    var m = document.createElement('div'); m.className = 'labo-msg' + (me ? ' me' : ''); m.textContent = text; el.log.appendChild(m);
    while (el.log.children.length > 40) el.log.removeChild(el.log.firstChild);
    el.log.scrollTop = el.log.scrollHeight;
  }
  function options(opts) {
    el.opts.textContent = '';
    (opts || []).forEach(function (o) {
      var act = o[0], label = tx(o[1]), kind = act.split(':')[0], arg = act.slice(kind.length + 1), node;
      if (kind === 'url' || kind === 'demo' || kind === 'mail' || kind === 'href') {
        node = document.createElement('a');
        if (kind === 'demo') node.href = caseBy(arg).demo;
        else if (kind === 'href') node.href = arg;
        else if (kind === 'mail') node.href = 'mailto:' + D.person.email + '?subject=' + encodeURIComponent(id() ? 'Pertanyaan dari situs' : 'Question from the site') + '&body=' + encodeURIComponent(lastQ);
        else { node.href = arg === 'linkedin' ? D.person.linkedin : D.links[arg]; node.target = '_blank'; node.rel = 'noopener'; }
      } else { node = document.createElement('button'); node.type = 'button'; node.setAttribute('data-a', act); }
      node.textContent = label; el.opts.appendChild(node);
    });
  }
  function optsOf(e) { var o = e && e.o; if (typeof o === 'string') return OPTS[o](); if (typeof o === 'function') return o(); return o || []; }
  function answer(e, extra) {
    face('happy', 1400);
    setTimeout(function () {
      add(typeof e.a === 'function' ? e.a() : tx(e.a));
      var o = optsOf(e).slice(); if (extra) o.push(extra);
      if (!deep() && o.length < 4 && !o.some(function (x) { return x[0] === GO_DEEP[0]; })) o.push(GO_DEEP);
      options(o);
    }, calm ? 0 : 220);
  }
  function fallback() {
    face('think', 1600);
    setTimeout(function () { add(tx(FALLBACK)); options([['mail:q', L('Kirim pertanyaan ke Auzan', 'Send my question to Auzan')], ['n:hello', L('Lihat topik', 'See topics')]]); }, calm ? 0 : 220);
  }
  function go(name) { if (name === 'start') { face('happy', 1400); add(tx(KB[0].a)); return options(OPTS.start()); } var e = entry(name); return e ? answer(e) : fallback(); }
  function scrollTo(target, needDeep) {
    if (target === 'top') { API.setMode('deep'); return; }
    var t = document.getElementById(target);
    if (needDeep || !t || t.offsetParent === null) API.setMode('deep', target); else t.scrollIntoView({ block: 'start' });
    if (window.innerWidth < 700) toggle(false);
  }
  function act(a, label) {
    var kind = a.split(':')[0], arg = a.slice(kind.length + 1);
    add(label, true);
    if (kind === 'n') return go(arg);
    if (kind === 'go') { scrollTo(arg); return face('happy', 1200); }
    if (kind === 'deep') { scrollTo(arg, true); return face('wow', 1200); }
    if (kind === 'svc') { scrollTo('svc-' + arg, true); return face('happy', 1200); }
    if (kind === 'brief') { if (!deep()) API.setMode('deep', 'kontak'); setTimeout(function () { API.prefill(arg); var k = document.getElementById('kontak'); if (k) k.scrollIntoView({ block: 'start' }); }, 60); if (window.innerWidth < 700) toggle(false); return face('happy', 1200); }
  }
  function route(text) {
    lastQ = text; add(text, true);
    var r = score(norm(text));
    if (!r.length) return fallback();
    if (/harga|biaya|tarif|price|cost|how much|bayar berapa|berapa duit/i.test(text)) { var pi = r.map(function (x) { return x.e.id; }).indexOf('price'); if (pi > 0) r.unshift(r.splice(pi, 1)[0]); }
    var alt = r[1] && r[1].sc >= 2 && r[1].e.id !== r[0].e.id ? ['n:' + r[1].e.id, L('Atau maksudnya: ' + r[1].e.id, 'Or did you mean: ' + r[1].e.id)] : null;
    if (alt) alt[1] = L('Topik lain: ' + label(r[1].e.id, 'id'), 'Related: ' + label(r[1].e.id, 'en'));
    answer(r[0].e, alt);
  }
  var NAMES = { who: ['Siapa Auzan', 'About Auzan'], now: ['Pekerjaan sekarang', 'Current job'], exp: ['Pengalaman', 'Experience'], edu: ['Pendidikan', 'Education'], thesis: ['Riset S2', 'Research'], skills: ['Kemampuan', 'Skills'], cad: ['CAD', 'CAD'], weld: ['Pengelasan', 'Welding'], cnc: ['CNC', 'CNC'], quality: ['Mutu & ISO', 'Quality & ISO'], lean: ['5S & Kaizen', '5S & Kaizen'], lead: ['Kepemimpinan', 'Leadership'], awards: ['Penghargaan', 'Awards'], certs: ['Sertifikat', 'Certificates'], lang: ['Bahasa', 'Languages'], location: ['Lokasi', 'Location'], hire: ['Rekrutmen', 'Hiring'], umkm: ['UMKM & bengkel', 'Small business'], factory: ['Masalah pabrik', 'Plant problems'], change: ['Dashboard perubahan komponen', 'Change dashboard'], bom: ['Bill of Material', 'Bill of Material'], robot: ['Robot & mesin', 'Robots & machines'], excel: ['Excel & dashboard', 'Excel & dashboards'], costing: ['Estimasi biaya', 'Costing'], price: ['Harga', 'Prices'], pay: ['Pembayaran', 'Payment'], nda: ['Kerahasiaan', 'Confidentiality'], time: ['Durasi', 'Duration'], products: ['Produk', 'Products'], demo: ['Demo', 'Demos'], site: ['Situs ini', 'This site'], export: ['Ekspor', 'Export'], contact: ['Kontak', 'Contact'], hobby: ['Fakta kecil', 'Fun fact'], erp: ['LABORU ERP', 'LABORU ERP'], deep: ['Versi lengkap', 'Full version'], labo: ['Labo', 'Labo'], hello: ['Topik', 'Topics'] };
  function label(k, l) { var n = NAMES[k]; return n ? (l === 'id' ? n[0] : n[1]) : k; }
  function toggle(open) {
    isOpen = open; el.panel.hidden = !open; el.btn.setAttribute('aria-expanded', String(open)); el.nudge.hidden = true; clearTimeout(nudgeT);
    if (open) { store.set('labo_nudged', '1'); if (!started) { started = true; go('start'); } if (window.innerWidth >= 700) el.input.focus({ preventScroll: true }); }
  }
  function nudge(text, ms) { if (isOpen || !el.nudge) return; el.nudgeTxt.textContent = text; el.nudge.hidden = false; clearTimeout(nudgeT); nudgeT = setTimeout(function () { el.nudge.hidden = true; }, ms || 12000); }

  function build() {
    var i = id();
    host.textContent = ''; started = false; isOpen = false;
    host.innerHTML =
      '<div class="labo-panel" role="dialog" aria-label="' + (i ? 'Pemandu Labo' : 'Labo guide') + '" hidden>' +
      '<div class="labo-head"><span class="labo-face"></span><div><b>Labo</b><small>' + (i ? 'Tanya apa saja tentang Auzan' : 'Ask anything about Auzan') + '</small></div>' +
      '<div class="x"><button type="button" data-labo="min" aria-label="' + (i ? 'Kecilkan' : 'Minimise') + '">–</button></div></div>' +
      '<div class="labo-log" aria-live="polite"></div><div class="labo-opts"></div>' +
      '<form class="labo-in"><input type="text" id="laboInput" autocomplete="off" maxlength="200" aria-label="' + (i ? 'Tulis pertanyaan' : 'Type a question') + '" placeholder="' + (i ? 'Contoh: pernah pegang audit ISO?' : 'e.g. has he run an ISO audit?') + '"><button type="submit">' + (i ? 'Kirim' : 'Send') + '</button></form></div>' +
      '<button type="button" class="labo-nudge" hidden><span></span><i data-labo="nonudge" aria-label="' + (i ? 'Tutup' : 'Dismiss') + '">×</i></button>' +
      '<button type="button" class="labo-btn" aria-expanded="false" aria-label="' + (i ? 'Buka pemandu Labo' : 'Open the Labo guide') + '"><span class="labo-face"></span></button>';
    el = { panel: host.querySelector('.labo-panel'), log: host.querySelector('.labo-log'), opts: host.querySelector('.labo-opts'), input: host.querySelector('#laboInput'), nudge: host.querySelector('.labo-nudge'), btn: host.querySelector('.labo-btn') };
    el.nudgeTxt = el.nudge.querySelector('span');
    face('idle');
    if (store.get('labo_nudged') !== '1') nudgeT = setTimeout(function () { nudge(i ? 'Halo! Mau tanya sesuatu tentang Auzan? Ketik saja, saya bantu cari.' : 'Hi! Want to ask something about Auzan? Just type, I’ll find it.', 12000); store.set('labo_nudged', '1'); }, 9000);
  }

  /* ajakan ke Mendalam saat pembaca Ringkas sampai di bagian bawah */
  var deepNudged = false, lanjut = document.getElementById('lanjut');
  if (lanjut && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !deepNudged && !deep()) { deepNudged = true; face('wow', 1600); nudge(id() ? 'Itu tadi versi ringkas. Klik saya kalau mau langsung ke bagian tertentu di versi lengkap.' : 'That was the short version. Click me to jump to any part of the full version.', 10000); } }); }, { threshold: 0.5 }).observe(lanjut);

  host.addEventListener('click', function (e) {
    var t = e.target, k = t.getAttribute && t.getAttribute('data-labo');
    if (k === 'nonudge') { e.stopPropagation(); el.nudge.hidden = true; return; }
    if (k === 'min') return toggle(false);
    if (t.closest('.labo-nudge')) return toggle(true);
    if (t.closest('.labo-btn')) return toggle(!isOpen);
    var b = t.closest('[data-a]'); if (b) act(b.getAttribute('data-a'), b.textContent);
  });
  host.addEventListener('submit', function (e) { e.preventDefault(); var v = el.input.value.trim(); if (!v) return; el.input.value = ''; route(v); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { toggle(false); el.btn.focus(); } });
  document.addEventListener('labo:open', function () { toggle(true); });
  document.addEventListener('site:lang', build);
  document.addEventListener('site:mode', function (e) { if (e.detail === 'deep' && el.btn) face('wow', 1300); });
  if (!calm) setInterval(function () { if (el.btn && !faceT) { face('blink'); setTimeout(function () { if (!faceT) face('idle'); }, 170); } }, 4600);
  build();
  window.LaboAsk = function (q) { if (!isOpen) toggle(true); route(q); }; // untuk pengujian
})();
