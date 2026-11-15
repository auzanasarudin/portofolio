/* ==========================================================================
   ISI SITUS — satu-satunya berkas yang perlu diubah untuk memperbarui konten.
   Setiap teks punya dua versi: L('Bahasa Indonesia', 'English').
   Tambah studi kasus, produk, atau jasa = tambah satu objek di daftar terkait.
   ========================================================================== */
(function () {
  'use strict';
  var L = function (id, en) { return { id: id, en: en }; };

  window.SITE = {
    updated: '2026-11-14',
    person: {
      name: 'Auzan Asarudin',
      email: 'auzanasar@gmail.com',
      linkedin: 'https://id.linkedin.com/in/auzan-asarudin-261585411',
      whatsapp: '',            // isi nomor format 62812xxxxxxx untuk menampilkan tombol WhatsApp
      photo: '',               // isi path foto (mis. assets/img/auzan.webp) untuk menampilkannya di blok judul
      employerPublic: false,   // true = tampilkan nama perusahaan saat ini
      employerName: 'PT Hitachi Construction Machinery Indonesia'
    },
    links: {
      laboru: 'https://auzanasarudin.github.io/laboru/',
      laboruPackages: 'https://auzanasarudin.github.io/laboru/paket.html',
      laboruInstagram: 'https://www.instagram.com/laboru_id',
      robotV1: 'https://auzanasarudin.github.io/monitoring-robot-1/',
      zonion: 'https://bit.ly/Z-ONION_LANDING_PAGE'
    },
    /* Harga & link checkout LABORU dibaca dari Google Sheet ini (sama dengan landing page).
       Jika sheet tidak bisa dibaca, angka di bawah dipakai. */
    priceSheetId: '1SSruj8FmwkTDPRzwBfvzb2QyH2LoADte7cwcqZCXKOU',
    prices: {
      entry_work: [79000, 'https://lynk.id/auzanasar/rx7w59xzxrrr/checkout'], entry_habit: [79000, 'https://lynk.id/auzanasar/qd6m0lx9v0o4/checkout'], entry_finance: [79000, 'https://lynk.id/auzanasar/xd5p7qo80v3e/checkout'],
      core: [189000, 'https://lynk.id/auzanasar/2jpqkgkmmjyw/checkout'], ultimate: [289000, 'https://lynk.id/auzanasar/ggpo4l1gpz1l/checkout'], upgrade: [99000, 'https://lynk.id/auzanasar/znky59enpnn7/checkout'],
      r01: [35000, 'https://lynk.id/auzanasar/mly732rx38j4/checkout'], r02: [49000, 'https://lynk.id/auzanasar/8659wj0w9r12/checkout'], r03: [35000, 'https://lynk.id/auzanasar/xomwl2e870rg/checkout'],
      r05: [29000, 'https://lynk.id/auzanasar/8gwxkj19p3d9/checkout'], r06: [39000, 'https://lynk.id/auzanasar/og2vpyk2ojm0/checkout'], r07: [249000, 'https://lynk.id/auzanasar/wp6gd5g080dv/checkout'],
      r08: [149000, 'https://lynk.id/auzanasar/76pvd178vome/checkout'], r09: [49000, 'https://lynk.id/auzanasar/qv7nxdklvl7r/checkout']
    },

    /* ---------------- teks antarmuka ---------------- */
    t: {
      skip: L('Lewati ke isi', 'Skip to content'),
      nav: { karya: L('Karya', 'Work'), produk: L('Produk', 'Products'), jasa: L('Jasa', 'Services'), tentang: L('Tentang', 'About'), kontak: L('Kontak', 'Contact') },
      mode: { overview: L('Ringkas', 'Overview'), deep: L('Mendalam', 'Deep dive'), label: L('Kedalaman isi', 'Level of detail') },
      sheet: { overview: L('Lembar 1 / 2 · Ringkas', 'Sheet 1 / 2 · Overview'), deep: L('Lembar 2 / 2 · Mendalam', 'Sheet 2 / 2 · Deep dive') },
      hero: {
        eyebrow: L('Production engineer · data & otomasi manufaktur', 'Production engineer · manufacturing data and automation'),
        h1a: L('Data pabrik yang berantakan, saya ubah jadi ', 'I turn messy factory data into '),
        h1b: L('keputusan.', 'decisions.'),
        sub: L('Saya Auzan, production engineer di manufaktur alat berat. Saya merapikan BOM, menghitung biaya dan waktu standar, lalu membangun dashboard dan alat kerja yang dipakai tim setiap hari.',
          'I’m Auzan, a production engineer in heavy-equipment manufacturing. I structure BOMs, estimate cost and standard time, and build the dashboards and working tools teams use every day.'),
        cta1: L('Lihat hasil kerja', 'See the work'), cta2: L('Ceritakan masalah Anda', 'Tell me your problem'),
        d1: L('Data mentah', 'Raw data'), d2: L('Struktur', 'Structure'), d3: L('Keputusan', 'Decision'),
        deepH: L('Lembar detail: cara kerja, bukti, dan batasannya.', 'The detail sheet: how I work, the evidence, and its limits.'),
        deepSub: L('Untuk engineering manager, technical recruiter, dan calon klien yang ingin memeriksa isinya. Setiap klaim di sini punya status: dipakai, sedang dibangun, atau masih riset.',
          'For engineering managers, technical recruiters and clients who want to check the substance. Every claim here carries a status: in use, in progress, or still research.')
      },
      tb: {
        name: L('Nama', 'Name'), role: L('Peran', 'Role'), focus: L('Fokus', 'Focus'), base: L('Basis', 'Base'), status: L('Status', 'Status'), rev: L('Rev', 'Rev'), sheet: L('Lembar', 'Sheet'),
        roleV: L('Production Engineer', 'Production Engineer'), focusV: L('BOM · costing · data & otomasi', 'BOM · costing · data and automation'), baseV: L('Bekasi, Indonesia · UTC+7', 'Bekasi, Indonesia · UTC+7'),
        statusV: L('Terbuka untuk proyek paruh waktu', 'Open to part-time projects'), toDeep: L('Buka lembar 2', 'Open sheet 2'), toOverview: L('Kembali ke lembar 1', 'Back to sheet 1'), checked: L('Diperiksa Labo', 'Checked by Labo')
      },
      sec: {
        proof: L('Sekilas', 'At a glance'),
        problems: L('Masalah yang saya bereskan', 'Problems I fix'),
        problemsLead: L('Tiga keluhan yang paling sering saya dengar di production engineering, dan apa yang saya bangun untuk masing-masing.', 'The three complaints I hear most in production engineering, and what I built for each.'),
        work: L('Karya terpilih', 'Selected work'),
        workLead: L('Tiga alat yang lahir dari pekerjaan nyata. Versi di sini dibuat ulang dari nol dengan data contoh, jadi Anda bisa membukanya dan mencoba sendiri.', 'Three tools that came out of real work. The versions here were rebuilt from scratch on sample data, so you can open them and try for yourself.'),
        more: L('Pekerjaan lain', 'Other work'),
        products: L('Produk digital', 'Digital products'),
        productsLead: L('Yang saya bangun di luar jam kerja, dijual dengan merek LABORU. Sekali bayar, dipakai offline.', 'What I build outside working hours, sold under the LABORU brand. One payment, works offline.'),
        pipeline: L('Sedang disiapkan untuk pabrik', 'In preparation for factories'),
        services: L('Jasa untuk pabrik dan bengkel', 'Services for plants and workshops'),
        servicesLead: L('Lingkup tetap, harga awal jelas, hasilnya berupa alat yang tim Anda pakai sendiri. Dikerjakan jarak jauh di luar jam kerja saya.', 'Fixed scope, a clear starting price, and a result your team runs on its own. Done remotely, outside my working hours.'),
        about: L('Tentang saya', 'About me'),
        contact: L('Mulai dari satu masalah', 'Start with one problem'),
        contactLead: L('Tulis masalahnya dalam dua-tiga kalimat. Saya balas dengan gambaran pendekatan, perkiraan waktu, dan kisaran biaya. Tidak ada kewajiban lanjut.', 'Describe the problem in two or three sentences. I reply with an approach, a time estimate and a price range. No obligation to continue.'),
        caps: L('Daftar kapabilitas', 'Bill of capabilities'),
        capsLead: L('Disusun seperti BOM: tiap baris punya bukti dan tingkat pemakaian yang sebenarnya.', 'Laid out like a BOM: each line has its evidence and its real level of use.'),
        path: L('Jalur keahlian', 'Skill path'),
        pathLead: L('Dari lantai produksi ke produk. Tiap tahap berdiri di atas tahap sebelumnya.', 'From the shop floor to products. Each stage stands on the one before it.'),
        method: L('Cara saya bekerja', 'How I work'),
        research: L('Riset S2', 'Master’s research'),
        history: L('Riwayat', 'History'),
        cred: L('Pendidikan, penghargaan, publikasi', 'Education, awards, publications'),
        catalog: L('Katalog produk lengkap', 'Full product catalogue'),
        spec: L('Spesifikasi layanan', 'Service specifications'),
        faq: L('Pertanyaan yang biasa muncul', 'Questions that usually come up')
      },
      btn: {
        demo: L('Buka demo interaktif', 'Open the live demo'), detail: L('Baca detail teknis', 'Read the technical detail'), buy: L('Beli', 'Buy'), see: L('Lihat', 'View'),
        ask: L('Diskusikan', 'Discuss'), quote: L('Minta penawaran', 'Ask for a quote'), allServices: L('Semua layanan dan harga', 'All services and prices'), allProducts: L('Katalog lengkap', 'Full catalogue'),
        notify: L('Kabari saya saat rilis', 'Tell me when it ships'), open: L('Buka situs', 'Open site'), copy: L('Salin', 'Copy'), copied: L('Tersalin', 'Copied'),
        sendMail: L('Kirim lewat email', 'Send by email'), copyBrief: L('Salin ringkasan', 'Copy the brief'), linkedin: L('Kirim pesan di LinkedIn', 'Message me on LinkedIn'), whatsapp: L('Chat WhatsApp', 'Chat on WhatsApp'), cv: L('Minta CV lengkap', 'Request my full CV')
      },
      lbl: {
        from: L('mulai', 'from'), duration: L('Durasi', 'Duration'), forWho: L('Untuk', 'For'), get: L('Yang Anda terima', 'What you get'), limits: L('Batasan', 'Limits'), example: L('Contoh hasil', 'Example'),
        context: L('Konteks', 'Context'), problem: L('Masalah', 'Problem'), approach: L('Pendekatan', 'Approach'), arch: L('Alur data', 'Data flow'), stack: L('Teknologi', 'Stack'), status: L('Status', 'Status'), data: L('Catatan data', 'Data note'),
        built: L('Sudah dibangun', 'Built'), progress: L('Sedang dibangun', 'In progress'), research: L('Riset', 'Research'), planned: L('Direncanakan', 'Planned'),
        prep: L('Sedang disiapkan', 'In preparation'), wip: L('Sedang dibangun', 'In progress'), price: L('Harga', 'Price'), product: L('Produk', 'Product'), service: L('Layanan', 'Service'), no: L('No', 'No'), cap: L('Kapabilitas', 'Capability'), evidence: L('Bukti', 'Evidence'), level: L('Tingkat', 'Level'),
        year: L('Tahun', 'Year'), what: L('Peran', 'Role'), demoNote: L('Demo memakai data sintetis', 'Demo runs on synthetic data'), priceNote: L('Harga awal. Lingkup pasti disepakati setelah saya melihat contoh data Anda.', 'Starting prices. The exact scope is agreed after I see a sample of your data.'),
        idr: L('Harga Rupiah berlaku untuk klien di Indonesia; USD untuk klien luar negeri.', 'Rupiah prices apply to clients in Indonesia; USD to clients abroad.')
      },
      form: {
        name: L('Nama', 'Name'), org: L('Perusahaan', 'Company'), topic: L('Yang ingin dibereskan', 'What needs fixing'), msg: L('Ceritakan singkat', 'Tell me briefly'),
        ph: L('Contoh: laporan OEE harian masih diketik manual dari 12 mesin, makan 2 jam per hari.', 'Example: the daily OEE report is still typed by hand from 12 machines and takes 2 hours a day.'),
        topics: [L('Dashboard produksi / OEE', 'Production / OEE dashboard'), L('Otomasi Excel atau laporan', 'Excel or report automation'), L('Struktur BOM / perubahan engineering', 'BOM structure / engineering changes'), L('Analisis robot las atau mesin', 'Welding robot or machine analysis'), L('Estimasi biaya dan waktu standar', 'Cost and standard-time estimation'), L('Rekrutmen / peluang kerja', 'Hiring / a job opportunity'), L('Produk LABORU', 'LABORU products'), L('Lainnya', 'Something else')],
        emailLbl: L('Atau tulis langsung ke', 'Or write directly to'), need: L('Isi nama dan ceritanya dulu.', 'Add your name and a short description first.'),
        subject: L('Proyek dari situs portofolio', 'Project enquiry from the portfolio site')
      },
      foot: {
        note: L('Semua demo memakai data sintetis. Tidak ada data, gambar, atau nama dari perusahaan mana pun. Pendapat di situs ini milik saya pribadi.', 'All demos run on synthetic data. No data, drawings or names from any company are used. Views on this site are my own.'),
        built: L('Dibuat tanpa framework: HTML, CSS, JavaScript. Font berlisensi SIL OFL.', 'Built without a framework: HTML, CSS, JavaScript. Fonts under the SIL OFL.'),
        showLabo: L('Tampilkan Labo', 'Show Labo'), top: L('Kembali ke atas', 'Back to top')
      }
    },

    /* ---------------- sekilas ---------------- */
    proof: [
      { big: L('≈ US$300 rb', '≈ US$300K'), text: L('per tahun, estimasi penghematan dari menghapus satu proses primer yang tidak perlu. Inisiatif tim; saya salah satu kontributornya.', 'a year, estimated saving from removing one unnecessary primer step. A team initiative I contributed to.') },
      { big: L('3', '3'), text: L('alat kerja yang saya bangun dari masalah nyata. Semuanya bisa Anda coba di halaman ini dengan data contoh.', 'working tools I built from real problems. You can try all of them on this page with sample data.') },
      { big: L('5', '5'), text: L('proses yang saya hitung biaya dan waktu standarnya: las, fabrikasi, machining, painting, assembly.', 'processes I estimate cost and standard time for: welding, fabrication, machining, painting, assembly.') },
      { big: L('Juara 1', '1st place'), text: L('kategori Steering & Braking, Kontes Mobil Hemat Energi 2020. Saya General Manager tim beranggota 50 orang.', 'Steering & Braking category, Indonesia’s national energy-efficient car contest 2020. I was General Manager of the 50-member team.') }
    ],

    /* ---------------- masalah -> bukti ---------------- */
    problems: [
      { q: L('“Drawing sudah direvisi, tapi barangnya belum sampai gudang. Macet di siapa?”', '“The drawing was revised, but the part hasn’t reached the warehouse. Who is it stuck with?”'),
        a: L('Satu papan yang menunjukkan tiap perubahan sedang dipegang departemen mana, sudah berapa hari, dan apa yang harus diputuskan di rapat.', 'One board showing which department holds each change, for how many days, and what the meeting has to decide.'), to: 'change-board' },
      { q: L('“Mengubah BOM engineering jadi BOM produksi makan berjam-jam di Excel.”', '“Turning the engineering BOM into a production BOM takes hours in Excel.”'),
        a: L('Aturan make, buy, dan phantom ditulis sekali. MBOM keluar dalam hitungan detik, dengan alasan di setiap baris.', 'Make, buy and phantom rules are written once. The MBOM comes out in seconds, with a reason on every line.'), to: 'bom-bridge' },
      { q: L('“Robot las sering berhenti, tapi tidak ada yang bisa menyebut penyebab terbesarnya.”', '“Our welding robots stop a lot, and nobody can name the biggest cause.”'),
        a: L('Log alarm diubah jadi OEE, peringkat penyebab, dan prakiraan kapan consumable perlu diganti.', 'Alarm logs become OEE, a ranked list of causes, and a forecast of when consumables need changing.'), to: 'robot-insight' }
    ],

    /* ---------------- studi kasus (tambah objek baru di sini) ---------------- */
    cases: [
      {
        id: 'change-board', demo: 'demos/change-board/index.html', img: 'assets/img/case-change-board', name: 'Change Board',
        title: L('Pelacak rapat perubahan engineering', 'Engineering change meeting tracker'),
        kicker: L('Workflow lintas departemen', 'Cross-department workflow'),
        summary: L('Setiap perubahan engineering menjadi satu kasus yang berpindah dari Design sampai Gudang. Papan ini menunjukkan siapa yang sedang memegangnya, berapa lama, lalu menulis rekap rapatnya.', 'Each engineering change becomes a case that moves from Design to Warehouse. The board shows who holds it, for how long, then writes the meeting recap.'),
        bullets: [L('Lama tunggu diukur terhadap waktu standar tiap departemen', 'Waiting time measured against each department’s standard'), L('Mode rapat: agenda, catatan keputusan, rekap siap kirim', 'Meeting mode: agenda, decision notes, a recap ready to send'), L('Gantt, analitik sumber perubahan, ekspor CSV', 'Gantt, change-source analytics, CSV export')],
        context: L('Rapat mingguan perubahan BOM melibatkan Design, Production Engineering, Procurement, PPIC, dan Gudang. Statusnya biasanya tersebar di Excel dan utas email.', 'A weekly BOM change meeting involves Design, Production Engineering, Procurement, PPIC and Warehouse. Status usually lives across Excel files and email threads.'),
        problem: L('Rapat habis untuk membacakan baris tabel. Tidak ada yang bisa langsung menjawab kasus mana yang terlambat dan sedang ditunggu siapa.', 'The meeting is spent reading out rows. Nobody can say at a glance which cases are late and who they are waiting on.'),
        approach: [L('Memodelkan tiap perubahan sebagai kasus dengan lima tahap serah-terima dan waktu standar per tahap.', 'Model each change as a case with five hand-over stages and a standard time per stage.'), L('Menghitung otomatis pemegang saat ini, lama tunggu, dan keterlambatan.', 'Compute the current holder, waiting time and lateness automatically.'), L('Menyusun layar dari pertanyaan rapat: siapa memegang bola, mana yang kritis, apa keputusannya.', 'Shape the screens around the meeting’s questions: who holds the ball, what is critical, what was decided.'), L('Menyiapkan rekap dan pengingat sebagai draf email. Orang tetap yang menekan kirim.', 'Prepare the recap and reminders as email drafts. A person still presses send.')],
        arch: [L('Sheet rapat (Excel / Google Sheets)', 'Meeting sheet (Excel / Google Sheets)'), L('Model kasus + waktu standar', 'Case model + standard times'), L('Papan, Gantt, analitik', 'Board, Gantt, analytics'), L('Rekap dan draf pengingat', 'Recap and reminder drafts')],
        stack: ['HTML', 'CSS', 'JavaScript', 'ExcelJS', 'localStorage', 'Outlook .eml'],
        status: [[L('Versi kerja untuk rapat mingguan', 'Working version for a weekly meeting'), 'built'], [L('Demo publik dengan data sintetis', 'Public demo on synthetic data'), 'built'], [L('Sinkron otomatis ke sheet bersama', 'Automatic sync with a shared sheet'), 'planned']],
        limits: L('Demo ini dibuat ulang dari nol. Kasus, nama part, nomor drawing, dan nama orang dihasilkan acak. Tidak ada data perusahaan.', 'This demo was rebuilt from scratch. Cases, part names, drawing numbers and people are generated. No company data is used.')
      },
      {
        id: 'bom-bridge', demo: 'demos/bom-bridge/index.html', img: 'assets/img/case-bom-bridge', name: 'BOM Bridge',
        title: L('Generator CBOM → EBOM → MBOM', 'CBOM → EBOM → MBOM generator'),
        kicker: L('Data engineering & struktur produk', 'Engineering data and product structure'),
        summary: L('Konfigurasi pesanan memilih cabang EBOM, lalu seperangkat aturan mengubahnya jadi MBOM: mana yang dibuat, disubkon, dibeli, atau sekadar pengelompokan.', 'An order configuration selects EBOM branches, then a rule set turns them into the MBOM: what is made, subcontracted, bought, or just a grouping.'),
        bullets: [L('Aturan bisa diubah tanpa menyentuh kode', 'Rules can be changed without touching code'), L('Setiap baris MBOM mencatat aturan yang memutuskannya', 'Every MBOM line records the rule that decided it'), L('Baris yang bertentangan ditandai untuk ditinjau', 'Conflicting lines are flagged for review')],
        context: L('Desain menyusun struktur produk menurut fungsi. Produksi membutuhkannya menurut cara membuat. Menerjemahkan yang satu ke yang lain biasanya dikerjakan manual untuk tiap model.', 'Design structures a product by function. Production needs it by how it is built. Translating one into the other is usually manual work for every model.'),
        problem: L('Konversi manual lambat, bergantung pada satu-dua orang yang hafal aturannya, dan sulit diaudit ketika hasilnya dipertanyakan.', 'Manual conversion is slow, depends on the one or two people who know the rules by heart, and is hard to audit when a result is questioned.'),
        approach: [L('Menuliskan aturan klasifikasi yang selama ini ada di kepala menjadi daftar yang bisa dibaca.', 'Write the classification rules that lived in people’s heads as a readable list.'), L('Mengurutkan aturan; yang cocok pertama menang.', 'Order the rules; the first match wins.'), L('Mencatat nomor aturan di tiap baris hasil supaya bisa ditelusuri.', 'Record the rule number on every output line so it can be traced.'), L('Menandai kasus yang bertentangan untuk ditinjau, bukan memutuskannya diam-diam.', 'Flag conflicts for review instead of deciding them silently.')],
        arch: [L('CBOM: kode opsi dari pesanan', 'CBOM: option codes from the order'), L('EBOM: struktur menurut fungsi', 'EBOM: structure by function'), L('Mesin aturan make / subcon / buy / phantom', 'Rule engine: make / subcon / buy / phantom'), L('MBOM + daftar tinjau + ekspor', 'MBOM + review list + export')],
        stack: ['HTML', 'CSS', 'JavaScript', 'ExcelJS', 'CSV'],
        status: [[L('Alat offline di browser yang membaca dan menulis Excel', 'Offline browser tool that reads and writes Excel'), 'built'], [L('Demo publik dengan produk fiktif', 'Public demo on a fictional product'), 'built'], [L('Efektivitas perubahan dan item alternatif', 'Change effectivity and alternates'), 'planned']],
        limits: L('Produk “CDU-300”, kode item, dan aturan di demo ini fiktif. Aturan make/buy yang sebenarnya selalu khas tiap pabrik.', 'The “CDU-300” product, its item codes and the rules in this demo are fictional. Real make/buy rules are always specific to each plant.')
      },
      {
        id: 'robot-insight', demo: 'demos/robot-insight/index.html', img: 'assets/img/case-robot-insight', name: 'Robot Insight',
        title: L('Analitik sel robot las', 'Welding robot cell analytics'),
        kicker: L('Analitik produksi & pemeliharaan prediktif', 'Production analytics and predictive maintenance'),
        summary: L('Log siklus dan alarm robot diubah jadi OEE, peringkat penyebab berhenti, pola jam rawan, dan prakiraan umur consumable.', 'Robot cycle and alarm logs become OEE, a ranked list of stop causes, time-of-day patterns, and a forecast of consumable life.'),
        bullets: [L('Definisi OEE ditulis terbuka di layar, bukan angka ajaib', 'OEE definitions are written on screen, not a magic number'), L('Register countermeasure: sebelum dan sesudah, lengkap dengan periode pembanding', 'Countermeasure register: before and after, with the baseline period'), L('Energi per kg kawat las dan emisi Scope 2', 'Energy per kg of wire and Scope 2 emissions')],
        context: L('Sel robot las menghasilkan riwayat siklus dan alarm setiap hari. Data itu jarang dibaca karena masih mentah dan tersebar per mesin.', 'Welding robot cells produce cycle and alarm history every day. It is rarely read because it is raw and scattered per machine.'),
        problem: L('Waktu berhenti terasa besar. Tanpa peringkat penyebab dan definisi yang disepakati, perbaikan jadi tebak-tebakan dan hasilnya sulit dibuktikan.', 'Stop time feels large. Without a ranked list of causes and agreed definitions, improvement is guesswork and results are hard to prove.'),
        approach: [L('Menyepakati definisi: waktu terencana, operasi, alarm, menunggu.', 'Agree the definitions: planned, operating, alarm and waiting time.'), L('Menyusun waterfall jam dari waktu kalender sampai jam produktif.', 'Build the hours waterfall from calendar time down to productive time.'), L('Memeringkat alarm menurut jam yang hilang, bukan jumlah kejadian.', 'Rank alarms by hours lost, not by event count.'), L('Mencatat tiap countermeasure dengan periode pembandingnya agar efeknya bisa dicek ulang.', 'Log each countermeasure with its baseline period so the effect can be re-checked.'), L('Meneliti prakiraan umur consumable dari sinyal keausan.', 'Research consumable-life forecasting from a wear signal.')],
        arch: [L('Log kontroler robot (CSV / SQL)', 'Robot controller logs (CSV / SQL)'), L('Pembersihan dan agregasi harian', 'Cleaning and daily aggregation'), L('Metrik: OEE, stop time, MTBF/MTTR, SEC', 'Metrics: OEE, stop time, MTBF/MTTR, SEC'), L('Dashboard + register countermeasure', 'Dashboard + countermeasure register')],
        stack: ['HTML', 'CSS', 'JavaScript', 'SVG', 'SQL', 'Python', 'PostgreSQL'],
        status: [[L('Dashboard analitik (frontend)', 'Analytics dashboard (frontend)'), 'built'], [L('Register countermeasure', 'Countermeasure register'), 'built'], [L('Backend PostgreSQL + API', 'PostgreSQL backend + API'), 'progress'], [L('Model prakiraan umur (LSTM), bagian dari tesis S2', 'Remaining-life model (LSTM), part of my master’s thesis'), 'research']],
        limits: L('Semua angka di demo berasal dari pembangkit acak berbenih. Nama robot, kode alarm, dan hasil countermeasure bukan data pabrik mana pun. Angka hasil kerja nyata tidak saya tampilkan sebelum metode ukurnya terdokumentasi.', 'Every number in the demo comes from a seeded random generator. Robot names, alarm codes and countermeasure results are not from any plant. I do not publish real results before the measurement method is documented.')
      }
    ],
    more: [
      { name: L('Estimasi biaya & waktu standar manufaktur', 'Manufacturing cost and standard-time estimation'), tag: 'Costing',
        text: L('Lembar kerja biaya untuk proyek baru serta proses las, machining, painting, dan assembly, dengan asumsi yang bisa ditelusuri. Dari pekerjaan ini lahir usulan menghapus satu proses primer, dengan estimasi penghematan sekitar US$300 ribu per tahun (inisiatif tim).', 'Cost worksheets for new projects and for welding, machining, painting and assembly, with traceable assumptions. This work led to a proposal to remove one primer step, with an estimated saving of about US$300K a year (a team initiative).'), href: '#kontak', cta: 'ask' },
      { name: L('LABORU: ekosistem produk digital', 'LABORU: a digital product ecosystem'), tag: 'Product',
        text: L('Game produktivitas pixel-art, toolkit Excel/Sheets, ebook, dan sistem dokumen perusahaan. Saya merancang produknya, landing page-nya, dan alur penjualannya.', 'A pixel-art productivity game, Excel/Sheets toolkits, ebooks and company document systems. I designed the products, the landing page and the sales flow.'), link: 'laboru', cta: 'open' },
      { name: L('Z-ONION: situs pemasok bawang untuk ekspor B2B', 'Z-ONION: a B2B export site for an onion supplier'), tag: 'Web',
        text: L('Identitas merek, katalog, profil perusahaan, dan landing page untuk pembeli luar negeri.', 'Brand identity, catalogue, company profile and a landing page for overseas buyers.'), link: 'zonion', cta: 'open' },
      { name: L('Monitoring Robot Welding, versi pertama', 'Robot welding monitoring, first version'), tag: 'Dashboard',
        text: L('Dashboard operator yang menjadi cikal bakal Robot Insight.', 'The operator dashboard that Robot Insight grew out of.'), link: 'robotV1', cta: 'open' },
      { name: L('Employee Simulator', 'Employee Simulator'), tag: 'WIP', wip: true,
        text: L('Simulator kantor Production Engineering bergaya game: quest, XP, dan KPI per tim. Masih dalam pengembangan.', 'A game-style Production Engineering office simulator: quests, XP and team KPIs. Still in development.') }
    ],

    /* ---------------- produk ---------------- */
    featured: {
      name: 'LABORU Level Up', img: 'assets/img/laboru-lobby.webp', img2: 'assets/img/laboru-quest.webp',
      text: L('Sistem naik level untuk karyawan. Tugas jadi quest, kebiasaan dilacak, uang dicatat. Dimainkan seperti game kantor pixel, offline di Android, iPhone, dan laptop.', 'A level-up system for employees. Tasks become quests, habits are tracked, money is logged. It plays like a pixel office game, offline on Android, iPhone and laptop.'),
      tiers: [{ k: 'core', name: 'Core', sub: L('Sistem pribadi: kerja, kebiasaan, keuangan', 'Personal system: work, habits, money') }, { k: 'ultimate', name: 'Ultimate', sub: L('Core + versi PRO, ebook, dan sistem perusahaan', 'Core + PRO version, ebooks and company systems') }],
      cta: L('Coba demo dan lihat paket', 'Try the demo and see the packages')
    },
    products: [
      { k: 'r07', name: 'Company Preparation System', img: 'assets/img/laboru-hub.webp', who: L('Pemilik usaha, tim QA', 'Business owners, QA teams'), text: L('Hub dokumen perusahaan: SOP, document control, audit & CAPA, procurement, KPI.', 'A company document hub: SOPs, document control, audit and CAPA, procurement, KPIs.') },
      { k: 'r08', name: 'Company Improvement System', who: L('Pemimpin tim', 'Team leads'), text: L('Kerangka perbaikan perusahaan dengan roadmap 90 hari.', 'A company improvement framework with a 90-day roadmap.') },
      { k: 'r09', name: 'Ebook From Zero to Financial Freedom Vol.1', img: 'assets/img/laboru-ebook.webp', who: L('Karyawan', 'Employees'), text: L('Ensiklopedia pixel-art tentang membangun ulang diri dan keuangan.', 'A pixel-art encyclopedia on rebuilding yourself and your finances.') },
      { k: 'entry_work', name: 'Entry · Work Toolkit', who: L('Karyawan', 'Employees'), text: L('Toolkit Excel & Google Sheets untuk pekerjaan dan karier.', 'An Excel and Google Sheets toolkit for work and career.') },
      { k: 'entry_habit', name: 'Entry · Habit Toolkit', who: L('Siapa saja', 'Anyone'), text: L('Pelacak kebiasaan dan tugas mingguan.', 'A habit and weekly task tracker.') },
      { k: 'entry_finance', name: 'Entry · Finance Toolkit', who: L('Siapa saja', 'Anyone'), text: L('Anggaran, pelunasan utang, dan pencatatan aset.', 'Budgeting, debt payoff and asset tracking.') },
      { k: 'r01', name: 'CV ATS Pack (180 template)', who: L('Pencari kerja', 'Job seekers'), text: L('Template CV ramah ATS.', 'ATS-friendly CV templates.') },
      { k: 'r02', name: 'Creative CV & Portfolio Pack (360 template)', who: L('Pencari kerja', 'Job seekers'), text: L('CV kreatif dan template portofolio.', 'Creative CVs and portfolio templates.') },
      { k: 'r03', name: 'Cover Letter & Email Lamaran Pack (360 template)', who: L('Pencari kerja', 'Job seekers'), text: L('Surat lamaran dan badan email siap pakai.', 'Ready-to-use cover letters and application emails.') },
      { k: 'r05', name: 'LABO Asisten (Companion App)', who: L('Siapa saja', 'Anyone'), text: L('Peliharaan virtual yang menemani rutinitas harian.', 'A virtual pet that keeps your daily routine company.') },
      { k: 'r06', name: 'Ebook Level Up Diri', who: L('Karyawan', 'Employees'), text: L('Panduan pengembangan diri bergaya pixel.', 'A pixel-style self-development guide.') },
      { k: 'upgrade', name: 'Upgrade Core → Ultimate', who: L('Pemilik Core', 'Core owners'), text: L('Naik ke Ultimate tanpa membeli ulang.', 'Move up to Ultimate without buying again.') }
    ],
    homeProducts: ['r07', 'r08', 'r09'],
    pipeline: [
      { name: 'Change Board Starter', text: L('Template papan perubahan engineering untuk pabrik kecil dan menengah.', 'An engineering-change board template for small and mid-size plants.') },
      { name: 'OEE Dashboard Starter', text: L('Template Excel/Sheets untuk OEE, stop time, dan pareto alarm.', 'An Excel/Sheets template for OEE, stop time and alarm Pareto.') },
      { name: 'BOM Bridge Rule Kit', text: L('Generator MBOM dengan aturan yang bisa disesuaikan sendiri.', 'An MBOM generator with rules you can edit yourself.') }
    ],

    /* ---------------- jasa ---------------- */
    services: [
      { id: 'review', tier: 'entry', home: true, name: L('Bedah Data Produksi', 'Production Data Review'), idr: 1500000, usd: 95, time: L('3–5 hari kerja', '3–5 working days'),
        who: L('Pabrik atau bengkel yang laporannya masih manual', 'Plants and workshops still reporting by hand'),
        problem: L('Anda tahu laporannya makan waktu, tapi belum jelas harus mulai dari mana.', 'You know reporting eats time, but not where to start.'),
        get: [L('Memo temuan 2–3 halaman dari file yang Anda kirim', 'A 2–3 page findings memo from the files you send'), L('Daftar perbaikan berurut prioritas, dengan perkiraan waktu dan biaya', 'A prioritised fix list with time and cost estimates'), L('Satu sesi tanya jawab 45 menit', 'One 45-minute Q&A call')],
        limits: L('Tidak termasuk pembuatan alat. Biayanya dipotongkan jika Anda lanjut ke proyek.', 'Does not include building the tool. The fee is credited if you continue to a project.') },
      { id: 'dashboard', tier: 'standard', home: true, name: L('Dashboard Produksi / OEE', 'Production / OEE Dashboard'), idr: 6000000, usd: 450, time: L('2–3 minggu', '2–3 weeks'), ex: 'robot-insight',
        who: L('Tim produksi, maintenance, PE', 'Production, maintenance and PE teams'),
        problem: L('Angka harian ada, tapi tidak pernah menjadi gambar yang dibaca di rapat pagi.', 'The daily numbers exist, but never become a picture the morning meeting reads.'),
        get: [L('Lembar input yang sesuai cara tim mencatat sekarang', 'An input sheet that fits how the team records today'), L('Dashboard OEE, stop time, dan peringkat penyebab', 'A dashboard for OEE, stop time and ranked causes'), L('Definisi metrik tertulis yang disepakati', 'Written, agreed metric definitions'), L('Panduan pakai dan 30 hari perbaikan', 'A user guide and 30 days of fixes')],
        limits: L('Untuk satu lini atau sampai 15 mesin. Pengambilan data otomatis dari mesin dihitung terpisah.', 'For one line or up to 15 machines. Automatic data capture from machines is quoted separately.') },
      { id: 'automation', tier: 'standard', home: true, name: L('Otomasi Excel / Google Sheets', 'Excel / Google Sheets Automation'), idr: 3500000, usd: 250, time: L('1–2 minggu per alur', '1–2 weeks per workflow'),
        who: L('Admin produksi, PPIC, engineering', 'Production admin, PPIC, engineering'),
        problem: L('Pekerjaan salin-tempel yang sama diulang setiap hari atau setiap minggu.', 'The same copy-and-paste job is repeated every day or every week.'),
        get: [L('Satu alur kerja yang berjalan dengan satu klik atau terjadwal', 'One workflow that runs on a click or on a schedule'), L('Pemeriksaan kesalahan input', 'Input error checks'), L('Catatan cara kerja agar bisa dirawat tim Anda', 'Working notes so your team can maintain it')],
        limits: L('Satu alur per paket. Akses ke sistem pihak ketiga mengikuti izin yang Anda miliki.', 'One workflow per package. Access to third-party systems depends on the permissions you hold.') },
      { id: 'change', tier: 'standard', name: L('Papan Perubahan Engineering', 'Engineering Change Board'), idr: 7500000, usd: 600, time: L('2–3 minggu', '2–3 weeks'), ex: 'change-board',
        who: L('Engineering, PPIC, procurement', 'Engineering, PPIC, procurement'),
        problem: L('Perubahan drawing tidak jelas sedang ditunggu siapa.', 'Nobody can tell who a drawing change is waiting on.'),
        get: [L('Papan kasus yang membaca sheet rapat Anda', 'A case board that reads your meeting sheet'), L('Waktu standar per departemen dan tanda terlambat', 'Standard times per department and late flags'), L('Mode rapat dan rekap otomatis', 'Meeting mode and an automatic recap')],
        limits: L('Tanpa integrasi ERP. Pengiriman email tetap dilakukan orang.', 'No ERP integration. Emails are still sent by a person.') },
      { id: 'bom', tier: 'premium', name: L('Struktur BOM & Generator MBOM', 'BOM Structuring & MBOM Generator'), idr: 12000000, usd: 900, time: L('3–5 minggu', '3–5 weeks'), ex: 'bom-bridge',
        who: L('Production engineering, PPIC', 'Production engineering, PPIC'),
        problem: L('Konversi EBOM ke MBOM bergantung pada satu-dua orang.', 'EBOM-to-MBOM conversion depends on one or two people.'),
        get: [L('Aturan make/buy/phantom Anda, ditulis dan diurutkan', 'Your make/buy/phantom rules, written down and ordered'), L('Generator yang membaca dan menulis format Excel Anda', 'A generator that reads and writes your Excel layout'), L('Daftar tinjau untuk baris yang bertentangan', 'A review list for conflicting lines')],
        limits: L('Satu keluarga produk per paket. Aturan disusun bersama orang yang paham proses Anda.', 'One product family per package. Rules are written together with the people who know your process.') },
      { id: 'costing', tier: 'standard', name: L('Model Estimasi Biaya & Waktu Standar', 'Cost & Standard-Time Model'), idr: 6000000, usd: 450, time: L('2–3 minggu', '2–3 weeks'),
        who: L('Bengkel fabrikasi, tim estimasi', 'Fabrication shops, estimating teams'),
        problem: L('Penawaran dihitung dengan perkiraan, dan selisih dengan biaya aktual baru terlihat di akhir.', 'Quotes are built on guesses, and the gap to actual cost only shows at the end.'),
        get: [L('Kalkulator biaya untuk las, fabrikasi, painting, atau assembly', 'A cost calculator for welding, fabrication, painting or assembly'), L('Asumsi yang terdokumentasi dan bisa diubah', 'Documented assumptions you can change'), L('Perbandingan estimasi dengan aktual', 'An estimate-versus-actual comparison')],
        limits: L('Tarif dan data waktu berasal dari Anda. Saya tidak memakai data dari tempat lain.', 'Rates and time data come from you. I do not use data from anywhere else.') },
      { id: 'robot', tier: 'premium', name: L('Analitik Robot Las atau Mesin', 'Welding Robot or Machine Analytics'), idr: 18000000, usd: 1400, time: L('4–8 minggu', '4–8 weeks'), ex: 'robot-insight',
        who: L('Maintenance, production engineering', 'Maintenance, production engineering'),
        problem: L('Waktu berhenti tinggi, tetapi penyebab terbesarnya belum pernah diperingkat.', 'Stop time is high, but the biggest causes have never been ranked.'),
        get: [L('Analisis stop time dan alarm dari log yang ada', 'Stop-time and alarm analysis from your existing logs'), L('Dashboard dan register countermeasure', 'A dashboard and a countermeasure register'), L('Prototipe prakiraan umur consumable, jika datanya cukup', 'A consumable-life forecasting prototype, if the data allows')],
        limits: L('Bergantung pada ketersediaan log. Prakiraan adalah prototipe, bukan jaminan.', 'Depends on log availability. The forecast is a prototype, not a guarantee.') },
      { id: 'retainer', tier: 'premium', name: L('Pendampingan Bulanan', 'Monthly Support'), idr: 4000000, usd: 300, per: L('per bulan', 'a month'), time: L('Minimal 3 bulan', '3-month minimum'),
        who: L('Klien yang sudah menjalankan satu proyek', 'Clients who have completed one project'),
        problem: L('Alat sudah jalan, tapi kebutuhan terus bertambah.', 'The tool is running, but the requests keep coming.'),
        get: [L('Jatah jam perbaikan dan penambahan fitur', 'A monthly block of hours for fixes and additions'), L('Ringkasan tertulis tiap akhir bulan', 'A written summary at each month end')],
        limits: L('Jam yang tidak terpakai tidak dibawa ke bulan berikutnya.', 'Unused hours do not roll over.') }
    ],
    tiers: { entry: L('Awal', 'Entry'), standard: L('Standar', 'Standard'), premium: L('Premium', 'Premium') },

    /* ---------------- tentang ---------------- */
    story: [
      L('Saya mulai dari bengkel las di SMK, lalu menjadi operator CNC, petugas quality control, dan sekarang production engineer di pabrik alat berat. Karena pernah berdiri di tiap posisi itu, alat yang saya buat mengikuti cara orang lantai produksi bekerja, bukan sebaliknya.',
        'I started in a vocational-school welding shop, then worked as a CNC operator, a quality inspector, and now a production engineer at a heavy-equipment plant. Having stood in each of those places, I build tools that follow how shop-floor people work, not the other way round.'),
      L('Sehari-hari saya menyusun BOM produksi, menghitung biaya dan waktu standar, dan memantau robot las. Di luar jam kerja saya menempuh S2 Teknik Mesin, meneliti efisiensi energi dan prediksi perawatan robot las, serta membangun produk digital dengan merek LABORU.',
        'Day to day I build production BOMs, estimate cost and standard time, and monitor welding robots. Outside work I am doing a master’s in mechanical engineering, researching energy efficiency and predictive maintenance for welding robots, and building digital products under the LABORU brand.')
    ],
    beliefs: [
      L('Pabrik jarang kekurangan data. Yang kurang adalah strukturnya.', 'Plants rarely lack data. They lack structure.'),
      L('Dashboard yang tidak dibuka di rapat hanyalah hiasan.', 'A dashboard nobody opens in the meeting is decoration.'),
      L('Otomasi dimulai dari Excel yang sudah dipakai, bukan dari membeli sistem baru.', 'Automation starts with the Excel you already use, not with buying a new system.'),
      L('Angka tanpa definisi dan periode hanyalah opini.', 'A number without a definition and a period is an opinion.')
    ],
    timeline: [
      { y: '2024 –', what: L('Production Engineering, lini excavator', 'Production Engineering, excavator line'), where: L('Produsen alat berat multinasional, Indonesia', 'Multinational heavy-equipment manufacturer, Indonesia'), text: L('BOM produksi, estimasi biaya dan waktu standar, pemantauan robot las, dukungan dokumentasi dan audit ISO, koordinasi lintas departemen.', 'Production BOMs, cost and standard-time estimation, welding robot monitoring, ISO documentation and audit support, cross-department coordination.'), now: true },
      { y: '2023', what: L('Quality Control', 'Quality Control'), where: 'PT Kawamura Indah', text: L('Checksheet inspeksi dan dukungan dokumentasi ISO.', 'Inspection checksheets and ISO documentation support.') },
      { y: '2023', what: L('Operator CNC', 'CNC Operator'), where: 'PT GEN Indonesia', text: L('Pengoperasian mesin CNC di lini produksi.', 'Operating CNC machines on the production line.') },
      { y: '2022', what: L('Pengawas gudang stockpile', 'Stockpile warehouse supervisor'), where: 'PT Duta Reka Bumi', text: L('Pemantauan stok harian dan pelaporan biaya mingguan.', 'Daily stock monitoring and weekly cost reporting.') },
      { y: '2021', what: L('Magang, General Engineering', 'Intern, General Engineering'), where: 'PT PAL Indonesia (Persero)', text: L('Mempelajari proses refurbishment, WPS, dan pengelasan GMAW.', 'Studied a refurbishment process, WPS and GMAW welding.') },
      { y: '2019 – 2021', what: L('General Manager, Garnesa Racing Team', 'General Manager, Garnesa Racing Team'), where: L('Tim mobil hemat energi Universitas Negeri Surabaya', 'Energy-efficient vehicle team, Universitas Negeri Surabaya'), text: L('Memimpin 50 anggota melalui 5 kepala divisi sampai meraih Juara 1 kategori Steering & Braking KMHE 2020.', 'Led 50 members through 5 division heads to 1st place in Steering & Braking at KMHE 2020.') },
      { y: '2018', what: L('Magang, Rolling Mill Operation', 'Intern, Rolling Mill Operation'), where: 'PT Ispat Indo', text: L('Perbaikan roll dan alur produksi wire rod.', 'Roll repair and the wire-rod production flow.') },
      { y: '2016', what: L('Magang, Fabrikasi', 'Intern, Fabrication'), where: 'PT Lintech Duta Pratama', text: L('Fitting dan pengelasan sesuai gambar kerja: OAW, SMAW, FCAW, TIG.', 'Fitting and welding to drawing: OAW, SMAW, FCAW, TIG.') }
    ],
    credentials: [
      { h: L('Pendidikan', 'Education'), items: [L('S2 Teknik Mesin (sedang berjalan)', 'Master’s in Mechanical Engineering (in progress)'), L('S1 Pendidikan Teknik Mesin, Universitas Negeri Surabaya. IPK 3,62, lulus dalam 3,5 tahun', 'Bachelor’s in Mechanical Engineering Education, Universitas Negeri Surabaya. GPA 3.62, completed in 3.5 years'), L('SMK Teknik Pengelasan', 'Vocational high school, welding engineering')] },
      { h: L('Penghargaan', 'Awards'), items: [L('Juara 1 Steering & Braking, Kontes Mobil Hemat Energi 2020', '1st place, Steering & Braking, national energy-efficient car contest (KMHE) 2020'), L('Juara 3 kategori Urban Diesel, Kontes Mobil Hemat Energi 2019', '3rd place, Urban Diesel category, KMHE 2019'), L('Juara 3 Lomba Karya Tulis Ilmiah Teknik Mesin UNESA 2018', '3rd place, scientific writing competition, Mechanical Engineering UNESA 2018')] },
      { h: L('Publikasi', 'Publications'), items: [L('“Proses Refurbishment MP 1000 Cone Crusher Menggunakan Las GMAW”, seminar nasional Fakultas Teknik UNESA, 2021', '“Refurbishment of an MP 1000 cone crusher using GMAW welding”, national seminar, Faculty of Engineering UNESA, 2021'), L('“Pengembangan Video Pembelajaran YouTube Teknik Pengelasan SMAW”, artikel jurnal dari skripsi, 2022', '“Developing YouTube learning videos for SMAW welding”, journal article from my thesis, 2022')] },
      { h: L('Bahasa', 'Languages'), items: [L('Indonesia (ibu)', 'Indonesian (native)'), L('Inggris (aktif)', 'English (working proficiency)'), L('Jepang (sedang belajar)', 'Japanese (learning)')] }
    ],

    /* ---------------- kapabilitas ---------------- */
    levels: { daily: L('Dipakai harian', 'Used daily'), project: L('Dipakai di proyek', 'Used in projects'), growing: L('Sedang dikembangkan', 'Developing'), research: L('Riset', 'Research'), field: L('Dasar lapangan', 'Shop-floor foundation') },
    caps: [
      [L('Struktur BOM / MBOM', 'BOM / MBOM structuring'), L('BOM Bridge', 'BOM Bridge'), 'daily'],
      [L('Koordinasi perubahan engineering', 'Engineering change coordination'), L('Change Board', 'Change Board'), 'daily'],
      [L('Estimasi biaya: las, fabrikasi, machining, painting, assembly', 'Cost estimation: welding, fabrication, machining, painting, assembly'), L('Lembar kerja biaya', 'Cost worksheets'), 'daily'],
      [L('Waktu standar dan estimasi consumable', 'Standard time and consumable estimation'), L('Lembar kerja biaya', 'Cost worksheets'), 'daily'],
      [L('Dashboard dan otomasi Excel / Google Sheets', 'Excel / Google Sheets dashboards and automation'), L('Produk LABORU, alat internal', 'LABORU products, internal tools'), 'daily'],
      [L('Pemantauan dan analisis robot las', 'Welding robot monitoring and analysis'), L('Robot Insight', 'Robot Insight'), 'project'],
      [L('OEE, stop time, analisis alarm', 'OEE, stop time, alarm analysis'), L('Robot Insight', 'Robot Insight'), 'project'],
      [L('Alat web: HTML, CSS, JavaScript', 'Web tools: HTML, CSS, JavaScript'), L('Tiga demo di situs ini', 'The three demos on this site'), 'project'],
      [L('Python dan otomasi browser (Selenium)', 'Python and browser automation (Selenium)'), L('Otomasi pengolahan data BOM', 'BOM data processing automation'), 'project'],
      [L('Dokumentasi dan dukungan audit ISO 9001 / 14001 / 45001', 'ISO 9001 / 14001 / 45001 documentation and audit support'), L('Pengalaman audit eksternal', 'External audit experience'), 'project'],
      [L('SQL dan PostgreSQL', 'SQL and PostgreSQL'), L('Backend monitoring robot (berjalan)', 'Robot monitoring backend (in progress)'), 'growing'],
      [L('Pemeliharaan prediktif: LSTM, Random Forest, RUL', 'Predictive maintenance: LSTM, Random Forest, RUL'), L('Tesis S2', 'Master’s thesis'), 'research'],
      [L('Pengelasan dan fabrikasi: SMAW, GMAW, FCAW, TIG', 'Welding and fabrication: SMAW, GMAW, FCAW, TIG'), L('SMK dan tiga kali magang', 'Vocational school and three internships'), 'field'],
      [L('Memimpin tim sampai 50 orang', 'Leading teams of up to 50'), L('Garnesa Racing Team', 'Garnesa Racing Team'), 'project']
    ],
    path: [
      { h: L('Lantai produksi', 'Shop floor'), items: [L('Las, fitting, CNC, inspeksi', 'Welding, fitting, CNC, inspection')] },
      { h: L('Engineering', 'Engineering'), items: [L('BOM, costing, waktu standar', 'BOM, costing, standard time')] },
      { h: L('Visualisasi', 'Visualisation'), items: [L('Dashboard yang dibaca di rapat', 'Dashboards read in the meeting')] },
      { h: L('Otomasi alur kerja', 'Workflow automation'), items: [L('Excel, Python, draf email', 'Excel, Python, email drafts')] },
      { h: L('Analisis data', 'Data analysis'), items: [L('OEE, alarm, parameter las', 'OEE, alarms, welding parameters')] },
      { h: L('Data engineering & ML', 'Data engineering and ML'), items: [L('PostgreSQL, API, prakiraan umur', 'PostgreSQL, APIs, life forecasting')] },
      { h: L('Produk dan jasa', 'Products and services'), items: [L('LABORU, proyek untuk pabrik', 'LABORU, projects for plants')] }
    ],
    method: [
      { h: L('Lihat alur aslinya', 'See the real flow'), text: L('Di mana data lahir, siapa yang menyentuhnya, dan di rapat mana keputusan diambil.', 'Where the data is born, who touches it, and in which meeting the decision is made.') },
      { h: L('Rapikan strukturnya', 'Structure it'), text: L('Definisi metrik, garis dasar, dan periode ditulis sebelum membuat grafik apa pun.', 'Metric definitions, baseline and period are written down before any chart is drawn.') },
      { h: L('Ukur dengan jujur', 'Measure honestly'), text: L('Grafik pertama dibuat dari data apa adanya, termasuk bagian yang tidak enak dilihat.', 'The first chart is drawn from the data as it is, including the uncomfortable parts.') },
      { h: L('Otomasikan yang berulang', 'Automate the repetition'), text: L('Hanya bagian yang benar-benar diulang. Keputusan dan tombol kirim tetap di tangan orang.', 'Only the part that truly repeats. Decisions and the send button stay with people.') },
      { h: L('Serahkan dan jaga', 'Hand over and look after'), text: L('Panduan pakai, 30 hari perbaikan, dan catatan hasil yang bisa dicek ulang.', 'A user guide, 30 days of fixes, and a results log that can be re-checked.') }
    ],
    research: {
      title: L('Efisiensi energi dan prediksi perawatan pada robot las', 'Energy efficiency and predictive maintenance for welding robots'),
      text: L('Tesis S2 saya menghubungkan tiga hal yang biasanya dilaporkan terpisah: waktu berhenti robot, energi per satuan hasil las, dan kapan consumable perlu diganti.', 'My master’s thesis connects three things usually reported separately: robot stop time, energy per unit of weld output, and when consumables need changing.'),
      points: [
        [L('Metrik energi', 'Energy metric'), L('Specific energy consumption: kWh per satuan kawat las yang terdeposit.', 'Specific energy consumption: kWh per unit of wire deposited.')],
        [L('Emisi', 'Emissions'), L('Scope 2 berbasis lokasi mengikuti GHG Protocol; emisi pembakaran di luar lingkup.', 'Location-based Scope 2 following the GHG Protocol; combustion emissions are out of scope.')],
        [L('Model', 'Models'), L('LSTM dibandingkan dengan regresi linear dan polinomial untuk memperkirakan sisa umur.', 'LSTM compared with linear and polynomial regression for remaining-life estimation.')],
        [L('Ukuran galat', 'Error measure'), L('MAE, karena lebih mudah dibaca orang lapangan daripada RMSE.', 'MAE, because shop-floor people read it more easily than RMSE.')],
        [L('Batasan', 'Limits'), L('Data berupa log mingguan dengan rentang sekitar tiga bulan. Hasil belum saya publikasikan sebelum validasinya selesai.', 'The data is weekly logs spanning about three months. I am not publishing results before validation is complete.')]
      ]
    },
    faq: [
      [L('Bagaimana cara kerjanya?', 'How does the work happen?'), L('Jarak jauh dan tertulis. Saya mengerjakan di malam hari dan akhir pekan (WIB), dengan satu pembaruan tertulis tiap minggu dan panggilan singkat bila perlu.', 'Remote and in writing. I work evenings and weekends (UTC+7), with one written update a week and a short call when needed.')],
      [L('Data kami rahasia.', 'Our data is confidential.'), L('Saya bersedia menandatangani NDA. Anda boleh menyamarkan nama part, pemasok, dan harga; saya hanya butuh strukturnya. File dihapus dari perangkat saya setelah proyek selesai.', 'I am happy to sign an NDA. You can mask part names, suppliers and prices; I only need the structure. Files are deleted from my devices when the project ends.')],
      [L('Bagaimana pembayarannya?', 'How does payment work?'), L('Paket Bedah Data dibayar di awal. Proyek lain 50% di awal dan 50% saat serah terima, dengan invoice.', 'The Data Review is paid upfront. Other projects are 50% upfront and 50% at hand-over, with an invoice.')],
      [L('Kalau ada yang tidak jalan setelah serah terima?', 'What if something breaks after hand-over?'), L('Perbaikan bug gratis selama 30 hari. Perubahan lingkup dibicarakan sebagai pekerjaan baru.', 'Bug fixes are free for 30 days. Scope changes are discussed as new work.')],
      [L('Bisa mulai dari Excel yang sudah kami pakai?', 'Can you start from the Excel we already use?'), L('Ya, dan itu yang saya sarankan. Alat yang mengikuti kebiasaan tim lebih mungkin dipakai.', 'Yes, and that is what I recommend. A tool that follows the team’s habits is more likely to be used.')],
      [L('Proyek apa yang tidak Anda ambil?', 'What work do you not take?'), L('Pekerjaan yang bersinggungan dengan pemberi kerja saya saat ini, pemasoknya, atau pesaing langsungnya, dan pekerjaan yang menuntut hadir di lokasi pada jam kerja.', 'Work that touches my current employer, its suppliers or its direct competitors, and work that requires being on site during working hours.')]
    ]
  };
})();

/* ---------------- tampilan sinematik (mode Ringkas) ---------------- */
(function () {
  'use strict';
  var L = function (id, en) { return { id: id, en: en }; }, S = window.SITE;
  S.v2 = {
    hello: L('Halo, saya', 'Hello, I’m'),
    bigword: 'PORTOFOLIO',
    role: L('Production engineer · data & otomasi manufaktur', 'Production engineer · manufacturing data & automation'),
    line: L('Dari bengkel las ke dashboard. Saya membangun alat yang membuat data pabrik bisa dibaca.', 'From the welding shop to the dashboard. I build tools that make factory data readable.'),
    see: L('Lihat karya', 'See the work'),
    stats: [[L('sejak', 'since'), '2016', L('di dunia manufaktur', 'in manufacturing')], ['3', '', L('alat kerja yang bisa dicoba', 'working tools to try')], ['23', '', L('cuplikan karya', 'work previews')]],
    places: L('Pernah belajar dan bekerja di', 'Learned and worked at'),
    placeList: ['PT PAL Indonesia', 'PT Ispat Indo', 'PT Kawamura Indah', 'PT GEN Indonesia', 'PT Duta Reka Bumi', 'Garnesa Racing Team', 'Universitas Negeri Surabaya', 'LABORU'],
    s1: { n: '01 / KARYA', a: L('Karya yang', 'Work that'), b: L('bicara.', 'speaks.'), lead: L('Klik cuplikan untuk melihat lebih dekat. Semua demo memakai data contoh.', 'Click a preview for a closer look. Every demo runs on sample data.') },
    filters: [['all', L('Semua', 'All')], ['analitik', L('Analitik', 'Analytics')], ['workflow', L('Workflow', 'Workflow')], ['bom', 'BOM'], ['laboru', L('Game & produk', 'Games & products')]],
    s2: { n: '02 / PENGAKUAN', a: L('Kerjanya.', 'The work.'), b: L('Pengakuannya.', 'The recognition.'), big: '#1', bigSub: L('Juara 1 nasional, Steering & Braking 2020', 'National 1st place, Steering & Braking 2020') },
    awards: [
      ['2020', L('Juara 1 Steering & Braking', '1st place, Steering & Braking'), L('Kontes Mobil Hemat Energi · General Manager tim 50 orang', 'National energy-efficient car contest · GM of a 50-person team')],
      ['2019', L('Juara 3 Urban Diesel', '3rd place, Urban Diesel'), L('Kontes Mobil Hemat Energi · tim chassis', 'National energy-efficient car contest · chassis team')],
      ['2018', L('Juara 3 Karya Tulis Ilmiah', '3rd place, scientific writing'), L('Teknik Mesin UNESA', 'Mechanical Engineering, UNESA')],
      ['2021', L('Artikel seminar nasional', 'National seminar paper'), L('Refurbishment cone crusher dengan las GMAW', 'Cone-crusher refurbishment with GMAW welding')],
      [L('Kini', 'Now'), L('≈ US$300 rb / tahun', '≈ US$300K a year'), L('Estimasi penghematan dari menghapus satu proses primer · inisiatif tim', 'Estimated saving from removing one primer step · team initiative')]
    ],
    s3: { n: '03 / DI BALIK LAYAR', a: L('Bukan sekadar data.', 'Not just data.'), b: L('Tapi cara memutuskan.', 'But how decisions get made.'),
      text: L('Saya pernah memegang mesin las, mesin CNC, lembar inspeksi, dan sekarang struktur produk sebuah pabrik alat berat. Karena itu alat yang saya buat mengikuti cara orang lantai produksi bekerja.', 'I have held a welding torch, run a CNC machine, filled in inspection sheets, and now manage product structures at a heavy-equipment plant. So the tools I build follow how shop-floor people work.'),
      quote: L('Dari bengkel las, sampai data yang dibaca di rapat pagi.', 'From the welding shop to the data read in the morning meeting.'),
      flow: [[L('Lihat', 'See'), L('alur aslinya', 'the real flow')], [L('Rapikan', 'Structure'), L('datanya', 'the data')], [L('Ukur', 'Measure'), L('dengan jujur', 'honestly')], [L('Otomasikan', 'Automate'), L('yang berulang', 'the repetition')]] },
    s4: { n: '04 / PERJALANAN', a: L('Terus bergerak.', 'Keep moving.'), b: L('Terus berkarya.', 'Keep building.'), w1: L('Kemenangan kecil.', 'Little wins.'), w2: L('Arti besar.', 'Big meaning.') },
    wins: [L('Lulus S1 dalam 3,5 tahun, IPK 3,62', 'Finished my bachelor’s in 3.5 years, GPA 3.62'), L('Memimpin 50 orang lewat 5 kepala divisi', 'Led 50 people through 5 division heads'), L('Ikut membangun 2 robot pembantu rumah sakit saat pandemi', 'Helped build 2 hospital-assistant robots during the pandemic'), L('Menempuh S2 sambil bekerja penuh waktu', 'Doing a master’s while working full time')],
    s5: { n: '05 / DI LUAR JAM KERJA', a: L('Saya juga', 'I also'), b: L('membuat game.', 'make games.'), text: L('LABORU adalah game kantor pixel untuk mengatur kerja, kebiasaan, dan keuangan. Yang bulat hijau di sini, Labo, juga maskotnya.', 'LABORU is a pixel office game for organising work, habits and money. The round green one here, Labo, is its mascot.'), cta: L('Kenalan dengan LABORU', 'Meet LABORU') },
    s6: { a: L('Mari', 'Let’s'), b: L('ngobrol.', 'talk.'), text: L('Punya ide, pertanyaan, atau sekadar ingin menyapa? Pintu saya terbuka.', 'Have an idea, a question, or just want to say hi? My door is open.'), deep: L('Butuh jasa untuk pabrik Anda? Lihat lembar detail.', 'Need help for your plant? Open the detail sheet.') },
    deepIntro: L('Lembar detail · untuk yang ingin membaca', 'Detail sheet · for readers'),
    close: L('Tutup', 'Close'), prev: L('Sebelumnya', 'Previous'), next: L('Berikutnya', 'Next'), open: L('Buka demo', 'Open demo'), readCase: L('Baca studi kasus', 'Read the case study')
  };
  S.gallery = [
    { f: 'ri-overview', t: 'analitik', c: 'robot-insight', cap: L('Robot Insight · ringkasan armada robot', 'Robot Insight · fleet overview'), big: 1 },
    { f: 'cb-board', t: 'workflow', c: 'change-board', cap: L('Change Board · siapa memegang bola', 'Change Board · who holds the ball'), big: 1 },
    { f: 'bb-mbom', t: 'bom', c: 'bom-bridge', cap: L('BOM Bridge · MBOM dengan alasan per baris', 'BOM Bridge · MBOM with a reason on every line'), big: 1 },
    { f: 'lb-lobby', t: 'laboru', cap: L('LABORU · lobi kantor pixel', 'LABORU · pixel office lobby'), link: 'laboru' },
    { f: 'ri-predict', t: 'analitik', c: 'robot-insight', cap: L('Prakiraan umur liner kawat las', 'Wire-liner life forecast') },
    { f: 'cb-timeline', t: 'workflow', c: 'change-board', cap: L('Gantt perubahan engineering', 'Engineering change Gantt') },
    { f: 'lb-title', t: 'laboru', cap: L('LABORU · layar judul', 'LABORU · title screen'), tall: 1, link: 'laboru' },
    { f: 'ri-oee', t: 'analitik', c: 'robot-insight', cap: L('Ke mana jam produksi pergi', 'Where the production hours go') },
    { f: 'bb-ebom', t: 'bom', c: 'bom-bridge', cap: L('Struktur EBOM', 'EBOM structure') },
    { f: 'ri-stop', t: 'analitik', c: 'robot-insight', cap: L('Pola alarm per jam', 'Alarms by hour') },
    { f: 'cb-meeting', t: 'workflow', c: 'change-board', cap: L('Mode rapat dan rekap otomatis', 'Meeting mode and automatic recap') },
    { f: 'lb-quest', t: 'laboru', cap: L('LABORU · papan quest', 'LABORU · quest board'), link: 'laboru' },
    { f: 'ri-alarms', t: 'analitik', c: 'robot-insight', cap: L('Pareto kode alarm', 'Alarm code Pareto') },
    { f: 'bb-rules', t: 'bom', c: 'bom-bridge', cap: L('Aturan make / buy / phantom', 'Make / buy / phantom rules') },
    { f: 'lb-ratrace', t: 'laboru', cap: L('LABORU · game rat race', 'LABORU · rat-race game'), tall: 1, link: 'laboru' },
    { f: 'cb-analytics', t: 'workflow', c: 'change-board', cap: L('Standar vs aktual per departemen', 'Standard vs actual per department') },
    { f: 'ri-cm', t: 'analitik', c: 'robot-insight', cap: L('Register countermeasure', 'Countermeasure register') },
    { f: 'bb-cbom', t: 'bom', c: 'bom-bridge', cap: L('Konfigurasi pesanan (CBOM)', 'Order configuration (CBOM)') },
    { f: 'lb-hub', t: 'laboru', cap: L('Company System Hub', 'Company System Hub'), link: 'laboru' },
    { f: 'ri-energy', t: 'analitik', c: 'robot-insight', cap: L('Energi per kg kawat dan emisi', 'Energy per kg of wire and emissions') },
    { f: 'cb-drawer', t: 'workflow', c: 'change-board', cap: L('Riwayat satu kasus', 'One case history') },
    { f: 'lb-pet', t: 'laboru', cap: L('LABORU · peliharaan Labo', 'LABORU · Labo the pet'), tall: 1, link: 'laboru' },
    { f: 'lb-ebook', t: 'laboru', cap: L('Ebook pixel-art 500 halaman', '500-page pixel-art ebook'), tall: 1, link: 'laboru' }
  ];
  S.hero = ['ri-overview', 'cb-board', 'bb-mbom', 'lb-lobby'];
})();
