/* ==========================================================================
   ISI SITUS — satu-satunya berkas yang perlu diubah untuk memperbarui konten.
   Setiap teks punya dua versi: L('Bahasa Indonesia', 'English').
   Tambah studi kasus, produk, jasa, sertifikat = tambah satu objek di daftar terkait.
   ========================================================================== */
(function () {
  'use strict';
  var L = function (id, en) { return { id: id, en: en }; };

  window.SITE = {
    updated: '2026-11-17',
    person: {
      name: 'Auzan Asarudin',
      email: 'auzanasar@gmail.com',
      linkedin: 'https://id.linkedin.com/in/auzan-asarudin-261585411',
      whatsapp: '',            // isi nomor format 62812xxxxxxx untuk menampilkan tombol WhatsApp
      photo: '',               // isi path foto (mis. assets/img/auzan.webp) untuk menampilkannya
      base: L('Bekasi, Jawa Barat · WIB (UTC+7)', 'Bekasi, West Java · UTC+7'),
      employerPublic: true,    // false = sembunyikan nama perusahaan saat ini
      employerName: 'PT Hitachi Construction Machinery Indonesia'
    },
    links: {
      laboru: 'https://auzanasarudin.github.io/laboru/',
      laboruPackages: 'https://auzanasarudin.github.io/laboru/paket.html',
      laboruInstagram: 'https://www.instagram.com/laboru_id',
      robotV1: 'https://auzanasarudin.github.io/monitoring-robot-1/',
      zonion: 'https://bit.ly/Z-ONION_LANDING_PAGE'
    },
    /* Situs resmi instansi. Dipakai di ticker, riwayat, pendidikan, dan penghargaan. */
    org: {
      smk: { name: 'SMKN 3 Buduran Sidoarjo', url: 'https://smkn3buduran.sch.id/' },
      lintech: { name: 'PT Lintech Duta Pratama', url: 'https://www.lintech.co.id/' },
      ispat: { name: 'PT Ispat Indo' },
      unesa: { name: 'Universitas Negeri Surabaya', url: 'https://unesa.ac.id/' },
      garnesa: { name: 'Garnesa Racing Team', url: 'https://www.instagram.com/garnesaracingteam/' },
      pal: { name: 'PT PAL Indonesia', url: 'https://www.pal.co.id/' },
      drb: { name: 'PT Duta Reka Bumi' },
      gen: { name: 'PT GEN Indonesia' },
      kawamura: { name: 'PT Kawamura Indah' },
      hcmi: { name: 'PT Hitachi Construction Machinery Indonesia', url: 'https://www.hitachi-cmid.com/' },
      shell: { name: 'Shell Eco-marathon', url: 'https://www.shellecomarathon.com/' },
      laboru: { name: 'LABORU', url: 'https://auzanasarudin.github.io/laboru/' }
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
      tb: { toDeep: L('Versi lengkap', 'Full version'), toOverview: L('Kembali ke versi ringkas', 'Back to the overview') },
      sec: {
        problems: L('Masalah yang biasa saya bereskan', 'Problems I usually fix'),
        problemsLead: L('Tiga keluhan yang paling sering saya dengar di pabrik, dan alat yang saya buat untuk masing-masing.', 'The three complaints I hear most on the shop floor, and the tool I built for each.'),
        work: L('Studi kasus', 'Case studies'),
        workLead: L('Tiga alat yang lahir dari pekerjaan sehari-hari. Versi di sini saya bangun ulang dari nol dengan data contoh, jadi bisa langsung dicoba.', 'Three tools that came out of daily work. I rebuilt the versions here from scratch on sample data, so you can try them right away.'),
        more: L('Karya lain', 'Other work'),
        products: L('Produk digital', 'Digital products'),
        productsLead: L('Saya jual dengan merek LABORU. Sekali bayar, bisa dipakai offline.', 'Sold under the LABORU brand. Pay once, use offline.'),
        pipeline: L('Sedang saya siapkan untuk pabrik', 'Coming for factories'),
        services: L('Jasa untuk pabrik, UMKM, dan bengkel', 'Services for plants, small businesses and workshops'),
        servicesLead: L('Lingkupnya jelas, harga awalnya jelas, dan hasilnya alat yang bisa dipakai tim Anda sendiri. Saya kerjakan jarak jauh di luar jam kantor; kunjungan bisa di akhir pekan untuk area Jabodetabek.', 'Clear scope, a clear starting price, and a result your team can run on its own. Done remotely outside office hours; weekend visits are possible around Greater Jakarta.'),
        contactLead: L('Ceritakan masalahnya dalam dua-tiga kalimat. Saya balas dengan gambaran cara mengerjakan, perkiraan waktu, dan kisaran biaya. Belum ada kewajiban apa pun.', 'Describe the problem in two or three sentences. I’ll reply with an approach, a time estimate and a price range. No commitment yet.'),
        caps: L('Kemampuan', 'Capabilities'),
        capsLead: L('Disusun seperti BOM: tiap baris ada buktinya dan seberapa sering saya memakainya.', 'Laid out like a BOM: each line has its evidence and how often I actually use it.'),
        path: L('Jalur keahlian', 'Skill path'),
        method: L('Cara saya bekerja', 'How I work'),
        research: L('Riset S2', 'Master’s research'),
        history: L('Riwayat kerja dan magang', 'Work and internship history'),
        edu: L('Pendidikan', 'Education'),
        certs: L('Pelatihan dan sertifikat', 'Training and certificates'),
        certsNote: L('Salinan sertifikat saya kirim kalau diminta.', 'Copies of certificates are available on request.'),
        orgs: L('Organisasi dan kegiatan', 'Organisations and activities'),
        story: L('Cerita singkat', 'The short story'),
        catalog: L('Katalog produk lengkap', 'Full product catalogue'),
        faq: L('Yang biasa ditanyakan', 'Frequently asked')
      },
      btn: {
        demo: L('Coba demonya', 'Try the demo'), buy: L('Beli', 'Buy'), ask: L('Tanyakan', 'Ask about it'), quote: L('Minta penawaran', 'Ask for a quote'),
        notify: L('Kabari saya saat rilis', 'Tell me when it ships'), open: L('Buka situs', 'Open site'), copy: L('Salin', 'Copy'), copied: L('Tersalin', 'Copied'),
        sendMail: L('Kirim lewat email', 'Send by email'), copyBrief: L('Salin ringkasan', 'Copy the brief'), askLabo: L('Tanya Labo dulu', 'Ask Labo first')
      },
      lbl: {
        from: L('mulai', 'from'), duration: L('Durasi', 'Duration'), forWho: L('Untuk', 'For'), limits: L('Batasan', 'Limits'), example: L('Contoh hasil', 'Example'),
        context: L('Konteks', 'Context'), problem: L('Masalah', 'Problem'), approach: L('Pendekatan', 'Approach'), arch: L('Alur data', 'Data flow'), stack: L('Teknologi', 'Stack'), status: L('Status', 'Status'), data: L('Catatan data', 'Data note'),
        built: L('Sudah dibangun', 'Built'), progress: L('Sedang dibangun', 'In progress'), research: L('Riset', 'Research'), planned: L('Direncanakan', 'Planned'),
        prep: L('Sedang disiapkan', 'In preparation'), wip: L('Sedang dibangun', 'In progress'), price: L('Harga', 'Price'), product: L('Produk', 'Product'), no: L('No', 'No'), cap: L('Kemampuan', 'Capability'), evidence: L('Bukti', 'Evidence'), level: L('Tingkat', 'Level'),
        year: L('Tahun', 'Year'), what: L('Peran', 'Role'), demoNote: L('Demo memakai data sintetis', 'Demo runs on synthetic data'), priceNote: L('Ini harga awal. Lingkup pastinya kita sepakati setelah saya lihat contoh data atau foto kondisi Anda.', 'These are starting prices. We agree the exact scope after I see a sample of your data or photos of the site.'),
        idr: L('Rupiah untuk klien di Indonesia, USD untuk luar negeri.', 'Rupiah for clients in Indonesia, USD for clients abroad.'),
        site: L('Situs resmi', 'Official site')
      },
      form: {
        name: L('Nama', 'Name'), org: L('Perusahaan / usaha', 'Company / business'), topic: L('Yang ingin dibereskan', 'What needs fixing'), msg: L('Ceritakan singkat', 'Tell me briefly'),
        ph: L('Contoh: laporan produksi harian masih diketik ulang dari 12 mesin, makan 2 jam sehari.', 'Example: the daily production report is retyped from 12 machines and takes 2 hours a day.'),
        topics: [L('Dashboard produksi / OEE', 'Production / OEE dashboard'), L('Otomasi Excel atau laporan', 'Excel or report automation'), L('Struktur BOM / perubahan engineering', 'BOM structure / engineering changes'), L('Analisis robot las atau mesin', 'Welding robot or machine analysis'), L('Estimasi biaya dan waktu proses', 'Cost and process-time estimation'), L('Rekrutmen / peluang kerja', 'Hiring / a job opportunity'), L('Produk LABORU', 'LABORU products'), L('Lainnya', 'Something else'), L('Rapikan bengkel / UMKM (5S)', 'Workshop / small business tidy-up (5S)'), L('Persiapan audit ISO', 'ISO audit preparation')],
        emailLbl: L('Atau tulis langsung ke', 'Or write directly to'), need: L('Isi nama dan ceritanya dulu, ya.', 'Add your name and a short description first.'),
        subject: L('Pesan dari situs portofolio', 'Message from the portfolio site')
      },
      foot: {
        note: L('Semua demo memakai data sintetis. Tidak ada data, gambar kerja, atau nama part dari perusahaan mana pun.', 'All demos run on synthetic data. No data, drawings or part names from any company are used.'),
        top: L('Kembali ke atas', 'Back to top')
      }
    },

    /* ---------------- masalah -> bukti ---------------- */
    problems: [
      { q: L('“Drawing sudah revisi, tapi barangnya belum sampai gudang. Nyangkut di siapa?”', '“The drawing was revised, but the part hasn’t reached the warehouse. Who is it stuck with?”'),
        a: L('Satu papan yang menunjukkan tiap perubahan sedang dipegang departemen mana, sudah berapa hari, dan apa yang perlu diputuskan di rapat.', 'One board showing which department holds each change, for how many days, and what the meeting needs to decide.'), to: 'change-board' },
      { q: L('“Ubah BOM engineering jadi BOM produksi makan berjam-jam di Excel.”', '“Turning the engineering BOM into a production BOM takes hours in Excel.”'),
        a: L('Aturan make, buy, dan phantom ditulis sekali. MBOM keluar dalam hitungan detik, lengkap dengan alasan di tiap baris.', 'Make, buy and phantom rules are written once. The MBOM comes out in seconds, with a reason on every line.'), to: 'bom-bridge' },
      { q: L('“Robot las sering berhenti, tapi tidak ada yang bisa sebut penyebab terbesarnya.”', '“Our welding robots stop a lot, and nobody can name the biggest cause.”'),
        a: L('Log alarm diolah jadi OEE, peringkat penyebab berhenti, dan prakiraan kapan consumable perlu diganti.', 'Alarm logs become OEE, a ranked list of stop causes, and a forecast of when consumables need changing.'), to: 'robot-insight' }
    ],

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
      { name: L('Estimasi biaya & waktu proses manufaktur', 'Manufacturing cost and process-time estimation'), tag: 'Costing',
        text: L('Lembar kerja untuk menghitung waktu dan biaya consumable proses las, machining, painting, dan assembly di proyek baru. Asumsinya tertulis, jadi bisa ditelusuri ulang.', 'Worksheets that estimate time and consumable cost for welding, machining, painting and assembly on new projects. The assumptions are written down, so they can be traced.'), href: '#kontak', cta: 'ask' },
      { name: L('Konverter tabel massal untuk dokumen TKDN', 'Bulk table converter for local-content (TKDN) documents'), tag: 'Automation',
        text: L('Mengubah ratusan tabel ke format kerja dalam sekali jalan, menggantikan salin-tempel manual.', 'Turns hundreds of tables into the working format in one run, replacing manual copy and paste.'), href: '#kontak', cta: 'ask' },
      { name: L('LABORU: ekosistem produk digital', 'LABORU: a digital product ecosystem'), tag: 'Product',
        text: L('Game produktivitas pixel-art, toolkit Excel/Sheets, ebook, dan sistem dokumen perusahaan. Produk, landing page, dan alur jualannya saya rancang sendiri.', 'A pixel-art productivity game, Excel/Sheets toolkits, ebooks and company document systems. I designed the products, the landing page and the sales flow myself.'), link: 'laboru', cta: 'open' },
      { name: L('Z-ONION: landing page ekspor bawang', 'Z-ONION: an onion export landing page'), tag: 'Web',
        text: L('Identitas merek, katalog, profil perusahaan, dan landing page untuk pembeli luar negeri.', 'Brand identity, catalogue, company profile and a landing page for overseas buyers.'), link: 'zonion', cta: 'open' },
      { name: L('Monitoring robot las, versi pertama', 'Welding robot monitoring, first version'), tag: 'Dashboard',
        text: L('Dashboard yang jadi cikal bakal Robot Insight. Awalnya Excel interaktif, lalu saya pindahkan ke web.', 'The dashboard Robot Insight grew out of. It started as an interactive Excel file before I moved it to the web.'), link: 'robotV1', cta: 'open' },
      { name: L('PEAS: asisten Production Engineering', 'PEAS: a Production Engineering assistant'), tag: 'AI · WIP', wip: true,
        text: L('Asisten lokal untuk tugas-tugas tim PE: dari menjawab pertanyaan proses sampai menyiapkan laporan. Datanya tetap di komputer sendiri.', 'A local assistant for PE team tasks, from answering process questions to drafting reports. The data stays on the local machine.') }
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
        problem: L('Anda tahu laporannya makan waktu, tapi belum tahu mulai dari mana.', 'You know reporting eats time, but not where to start.'),
        get: [L('Memo temuan 2–3 halaman dari file yang Anda kirim', 'A 2–3 page findings memo from the files you send'), L('Daftar perbaikan berurut prioritas, plus perkiraan waktu dan biaya', 'A prioritised fix list with time and cost estimates'), L('Satu sesi tanya jawab 45 menit', 'One 45-minute Q&A call')],
        limits: L('Belum termasuk membuat alatnya. Biayanya dipotong kalau Anda lanjut ke proyek.', 'Building the tool is not included. The fee is credited if you continue to a project.') },
      { id: 'umkm', tier: 'entry', home: true, name: L('Rapikan Bengkel: 5S & Visual Kerja', 'Workshop Tidy-up: 5S & Visual Work'), idr: 2500000, usd: 160, time: L('1–2 minggu', '1–2 weeks'),
        who: L('UMKM, bengkel las dan fabrikasi, workshop kecil', 'Small businesses, welding and fabrication shops'),
        problem: L('Alat sering dicari, urutan kerja hanya ada di kepala satu orang, dan pelanggan menunggu tanpa kabar.', 'Tools go missing, the work sequence lives in one person’s head, and customers wait without updates.'),
        get: [L('Cek 5S dari foto/video, plus satu kunjungan akhir pekan (Jabodetabek)', 'A 5S check from photos/video, plus one weekend visit (Greater Jakarta)'), L('Usulan tata letak dan label visual siap cetak', 'A layout proposal and print-ready visual labels'), L('Checksheet harian dan SOP satu halaman per pekerjaan', 'Daily checksheets and one-page SOPs per job'), L('Papan status order sederhana di Google Sheets', 'A simple order-status board in Google Sheets')],
        limits: L('Kunjungan di luar Jabodetabek dihitung terpisah. Barang dan rak tidak termasuk.', 'Visits outside Greater Jakarta are quoted separately. Shelving and materials are not included.') },
      { id: 'dashboard', tier: 'standard', home: true, name: L('Dashboard Produksi / OEE', 'Production / OEE Dashboard'), idr: 6000000, usd: 450, time: L('2–3 minggu', '2–3 weeks'), ex: 'robot-insight',
        who: L('Tim produksi, maintenance, PE', 'Production, maintenance and PE teams'),
        problem: L('Angka harian ada, tapi tidak pernah jadi gambar yang dibaca di rapat pagi.', 'The daily numbers exist, but never become a picture the morning meeting reads.'),
        get: [L('Lembar input yang mengikuti cara tim mencatat sekarang', 'An input sheet that follows how the team records today'), L('Dashboard OEE, stop time, dan peringkat penyebab', 'A dashboard for OEE, stop time and ranked causes'), L('Definisi metrik tertulis yang disepakati', 'Written, agreed metric definitions'), L('Panduan pakai dan 30 hari perbaikan', 'A user guide and 30 days of fixes')],
        limits: L('Untuk satu lini atau maksimal 15 mesin. Pengambilan data otomatis dari mesin dihitung terpisah.', 'For one line or up to 15 machines. Automatic data capture from machines is quoted separately.') },
      { id: 'automation', tier: 'standard', home: true, name: L('Otomasi Excel / Google Sheets', 'Excel / Google Sheets Automation'), idr: 3500000, usd: 250, time: L('1–2 minggu per alur', '1–2 weeks per workflow'),
        who: L('Admin produksi, PPIC, engineering', 'Production admin, PPIC, engineering'),
        problem: L('Pekerjaan salin-tempel yang sama diulang tiap hari atau tiap minggu.', 'The same copy-and-paste job is repeated every day or every week.'),
        get: [L('Satu alur kerja yang jalan dengan satu klik atau terjadwal', 'One workflow that runs on a click or on a schedule'), L('Pengecekan kesalahan input', 'Input error checks'), L('Catatan cara kerja supaya tim Anda bisa merawatnya', 'Working notes so your team can maintain it')],
        limits: L('Satu alur per paket. Akses ke sistem lain mengikuti izin yang Anda punya.', 'One workflow per package. Access to other systems depends on the permissions you hold.') },
      { id: 'iso', tier: 'standard', name: L('Persiapan Audit ISO 9001 / 45001', 'ISO 9001 / 45001 Audit Preparation'), idr: 5000000, usd: 380, time: L('3–4 minggu', '3–4 weeks'),
        who: L('Pabrik kecil-menengah yang mau sertifikasi atau perpanjangan', 'Small and mid-size plants certifying or renewing'),
        problem: L('Audit tinggal beberapa minggu, dokumennya masih tersebar di banyak folder.', 'The audit is weeks away and the documents are scattered across folders.'),
        get: [L('Cek celah terhadap klausul standar', 'A gap check against the standard’s clauses'), L('Daftar dokumen yang kurang, plus templatnya', 'A list of missing documents, with templates'), L('Simulasi audit internal dan daftar temuan', 'A mock internal audit and a findings list')],
        limits: L('Saya bukan lembaga sertifikasi. Keputusan lulus tetap di auditor.', 'I am not a certification body. The pass decision stays with the auditor.') },
      { id: 'change', tier: 'standard', name: L('Papan Perubahan Engineering', 'Engineering Change Board'), idr: 7500000, usd: 600, time: L('2–3 minggu', '2–3 weeks'), ex: 'change-board',
        who: L('Engineering, PPIC, procurement', 'Engineering, PPIC, procurement'),
        problem: L('Tidak jelas perubahan drawing sedang ditunggu siapa.', 'Nobody can tell who a drawing change is waiting on.'),
        get: [L('Papan kasus yang membaca sheet rapat Anda', 'A case board that reads your meeting sheet'), L('Waktu standar per departemen dan tanda terlambat', 'Standard times per department and late flags'), L('Mode rapat dan rekap otomatis', 'Meeting mode and an automatic recap')],
        limits: L('Tanpa integrasi ERP. Email tetap dikirim oleh orang.', 'No ERP integration. Emails are still sent by a person.') },
      { id: 'costing', tier: 'standard', name: L('Model Estimasi Biaya & Waktu Proses', 'Cost & Process-Time Model'), idr: 6000000, usd: 450, time: L('2–3 minggu', '2–3 weeks'),
        who: L('Bengkel fabrikasi, tim estimasi', 'Fabrication shops, estimating teams'),
        problem: L('Penawaran dihitung pakai perkiraan, dan selisih dengan biaya aktual baru ketahuan di akhir.', 'Quotes are built on guesses, and the gap to actual cost only shows at the end.'),
        get: [L('Kalkulator biaya las, fabrikasi, painting, atau assembly', 'A cost calculator for welding, fabrication, painting or assembly'), L('Asumsi yang tertulis dan bisa diubah', 'Written assumptions you can change'), L('Perbandingan estimasi dengan aktual', 'An estimate-versus-actual comparison')],
        limits: L('Tarif dan data waktu dari Anda. Saya tidak memakai data dari tempat lain.', 'Rates and time data come from you. I do not use data from anywhere else.') },
      { id: 'bom', tier: 'premium', name: L('Struktur BOM & Generator MBOM', 'BOM Structuring & MBOM Generator'), idr: 12000000, usd: 900, time: L('3–5 minggu', '3–5 weeks'), ex: 'bom-bridge',
        who: L('Production engineering, PPIC', 'Production engineering, PPIC'),
        problem: L('Konversi EBOM ke MBOM bergantung pada satu-dua orang.', 'EBOM-to-MBOM conversion depends on one or two people.'),
        get: [L('Aturan make/buy/phantom Anda, ditulis dan diurutkan', 'Your make/buy/phantom rules, written down and ordered'), L('Generator yang membaca dan menulis format Excel Anda', 'A generator that reads and writes your Excel layout'), L('Daftar tinjau untuk baris yang bertentangan', 'A review list for conflicting lines')],
        limits: L('Satu keluarga produk per paket. Aturan disusun bareng orang yang paham proses Anda.', 'One product family per package. Rules are written with the people who know your process.') },
      { id: 'robot', tier: 'premium', name: L('Analitik Robot Las atau Mesin', 'Welding Robot or Machine Analytics'), idr: 18000000, usd: 1400, time: L('4–8 minggu', '4–8 weeks'), ex: 'robot-insight',
        who: L('Maintenance, production engineering', 'Maintenance, production engineering'),
        problem: L('Waktu berhenti tinggi, tapi penyebab terbesarnya belum pernah diurutkan.', 'Stop time is high, but the biggest causes have never been ranked.'),
        get: [L('Analisis stop time dan alarm dari log yang ada', 'Stop-time and alarm analysis from your existing logs'), L('Dashboard dan register countermeasure', 'A dashboard and a countermeasure register'), L('Prototipe prakiraan umur consumable, kalau datanya cukup', 'A consumable-life forecasting prototype, if the data allows')],
        limits: L('Bergantung pada log yang tersedia. Prakiraan masih prototipe, bukan jaminan.', 'Depends on the logs available. The forecast is a prototype, not a guarantee.') },
      { id: 'retainer', tier: 'premium', name: L('Pendampingan Bulanan', 'Monthly Support'), idr: 4000000, usd: 300, per: L('per bulan', 'a month'), time: L('Minimal 3 bulan', '3-month minimum'),
        who: L('Klien yang sudah menjalankan satu proyek', 'Clients who have completed one project'),
        problem: L('Alatnya sudah jalan, tapi permintaan terus bertambah.', 'The tool is running, but the requests keep coming.'),
        get: [L('Jatah jam untuk perbaikan dan fitur baru', 'A monthly block of hours for fixes and additions'), L('Ringkasan tertulis tiap akhir bulan', 'A written summary at each month end')],
        limits: L('Jam yang tidak terpakai tidak dibawa ke bulan berikutnya.', 'Unused hours do not roll over.') }
    ],
    tiers: { entry: L('Awal', 'Entry'), standard: L('Standar', 'Standard'), premium: L('Premium', 'Premium') },

    /* ---------------- tentang ---------------- */
    story: [
      L('Saya besar di Sidoarjo. Bapak saya welder maintenance di pabrik baja, dan sepulang kerja selalu membuat sesuatu: gerobak dan mesin arum manisnya sendiri, lalu lapak sprei. Saya kecil sering duduk memperhatikan. Mungkin dari situ saya suka melihat bagaimana sebuah barang dibuat.',
        'I grew up in Sidoarjo, East Java. My father was a maintenance welder at a steel mill, and after work he always built something: his own cotton-candy cart and machine, later a bedsheet stall. I used to sit and watch. That is probably where I picked up the habit of asking how things get made.'),
      L('Di SMK saya ambil Teknik Pengelasan Kapal. Selain mengelas, saya dirotasi ke gambar rancang bangun kapal, konstruksi baja, kelistrikan, interior, dan permesinan kapal. Ujian kompetensi las saya lulus dengan nilai 95.',
        'At vocational school I took ship welding. Besides welding, I rotated through ship design drawing, steel construction, marine electrical, outfitting and marine machinery. I passed the welding competency exam with a score of 95.'),
      L('Di UNESA, kelas terbaik saya justru bengkel Garnesa Racing Team. Saya masuk sebagai staf chassis, lalu dipercaya jadi General Manager untuk sekitar 50 orang. Saya baca semua regulasi lomba, minta tiap divisi menghitung desainnya sampai ke simulasi MATLAB, lalu menyusun jadwal, anggaran, KPI anggota, dan evaluasi bulanan satu per satu.',
        'At university my best classroom was the Garnesa Racing Team workshop. I joined as chassis staff and was later trusted as General Manager of about 50 people. I read every rule in the contest book, had each division calculate its design down to a MATLAB simulation, then set the schedule, the budget, member KPIs and one-to-one monthly reviews.'),
      L('Setelah lulus, saya kerja di tempat yang kelihatannya acak: stockpile batubara, general affair, programmer CNC untuk molding, quality control sekaligus MR ISO, lalu production engineering di pabrik excavator. Dari situ saya kenal satu produk dari bahan mentah sampai unit jadi, termasuk dokumen dan rapat di antaranya.',
        'After graduating I worked in places that look random: a coal stockpile, general affairs, CNC programming for moulds, quality control plus ISO management representative, then production engineering at an excavator plant. Together they taught me a product from raw material to finished unit, including the paperwork and meetings in between.'),
      L('Sekarang, di luar jam kerja, saya kuliah S2 Teknik Mesin dengan riset predictive maintenance robot las, dan membangun LABORU. Prinsip saya sederhana: tidak ada yang tidak bisa dipelajari, tinggal mau atau tidak.',
        'Now, outside working hours, I am doing a master’s in mechanical engineering, researching predictive maintenance for welding robots, and building LABORU. My rule is simple: there is nothing you can’t learn; it comes down to whether you want to.')
    ],
    beliefs: [
      L('Pabrik jarang kekurangan data. Yang kurang biasanya strukturnya.', 'Plants rarely lack data. What they usually lack is structure.'),
      L('Rapi dulu, baru cepat. 5S yang jalan kelihatan dari lantai, bukan dari poster.', 'Tidy first, then fast. Working 5S shows on the floor, not on a poster.'),
      L('Kesalahan yang bisa dicegah lebih murah daripada yang harus diperiksa. Itu inti poka-yoke.', 'A mistake you prevent is cheaper than one you inspect. That is the heart of poka-yoke.'),
      L('Dashboard yang tidak dibuka di rapat cuma hiasan.', 'A dashboard nobody opens in the meeting is decoration.'),
      L('Angka tanpa definisi dan periode hanyalah opini.', 'A number without a definition and a period is an opinion.')
    ],
    /* Riwayat: urut terbaru. o = kunci di daftar org (untuk link situs resmi). */
    timeline: [
      { y: '2024 –', o: 'hcmi', now: true, what: L('Production Engineer', 'Production Engineer'), where: L('Pabrik alat berat, Cikarang', 'Heavy-equipment plant, Cikarang'),
        text: L('Menyusun MBOM proyek dari CBOM dan EBOM, mengestimasi waktu proses dan biaya consumable (las, machining, painting, assembly), memimpin dua rapat mingguan lintas departemen, dan sejak Juli 2025 mengolah data robot las jadi dashboard monitoring.', 'Build project MBOMs from CBOM and EBOM, estimate process time and consumable cost (welding, machining, painting, assembly), run two weekly cross-department meetings, and since July 2025 turn welding robot data into a monitoring dashboard.') },
      { y: '2023 – 2024', o: 'kawamura', what: L('Quality Control & MR ISO', 'Quality Control & ISO Management Rep.'), where: L('Fabrikasi conveyor dan jig, Karawang', 'Conveyor and jig fabrication, Karawang'),
        text: L('Membuat checksheet dan go/no-go gauge, inspeksi incoming, proses, dan assembly. Sebagai management representative, saya menjalankan audit internal sampai mendampingi audit eksternal perpanjangan ISO 9001 dan ISO 45001.', 'Built checksheets and go/no-go gauges; inspected incoming, in-process and final assembly. As management representative I ran internal audits through to the external renewal audit for ISO 9001 and ISO 45001.') },
      { y: '2022', o: 'gen', what: L('CNC Programmer', 'CNC Programmer'), where: L('Molding body motor listrik, Sidoarjo', 'Electric-motorbike body moulds, Sidoarjo'),
        text: L('Membuat program NC dengan Mastercam dan PowerMill untuk core dan cavity molding, setting tool dan titik nol, menjalankan sekaligus merawat mesin CNC.', 'Wrote NC programs in Mastercam and PowerMill for mould cores and cavities, set tools and work zero, ran and maintained the CNC machines.') },
      { y: '2021 – 2022', o: 'drb', what: L('Pengawas Stockpile, lalu General Affair', 'Stockpile Supervisor, then General Affairs'), where: L('Semarang dan Surabaya', 'Semarang and Surabaya'),
        text: L('Mengawasi penerimaan batubara dari tongkang, surat jalan, logbook, dan estimasi stok. Di Surabaya mengurus payroll proyek perumahan dan mengawasi vendor part bending motor listrik.', 'Supervised coal receipts from barges, delivery notes, logbooks and stock estimates. In Surabaya, handled payroll for a housing project and oversaw a vendor making bent-plate parts for electric motorbikes.') },
      { y: '2021', o: 'pal', what: L('Magang Welding Engineer', 'Welding Engineering Intern'), where: L('Galangan kapal BUMN, Surabaya', 'State shipyard, Surabaya'),
        text: L('Dua bulan di proyek refurbishment cone crusher mengikuti WPS: preheating, pengelasan, dan PWHT. Hasilnya saya tulis jadi makalah seminar nasional.', 'Two months on a cone-crusher refurbishment following the WPS: preheating, welding and PWHT. I wrote it up as a national seminar paper.') },
      { y: '2019 – 2021', o: 'garnesa', what: L('Staf Chassis → General Manager', 'Chassis Staff → General Manager'), where: L('Tim mobil hemat energi UNESA', 'UNESA energy-efficient car team'),
        text: L('Dari merancang chassis aluminium hollow dengan sambungan rivet, sampai memimpin lima divisi (engine, chassis, body, electric, non-teknis). Body pertama fiberglass hand lay-up, yang kedua karbon vacuum infusion.', 'From designing a riveted hollow-aluminium chassis to leading five divisions (engine, chassis, body, electric, non-technical). The first body was hand-laid fibreglass, the second vacuum-infused carbon.') },
      { y: '2018', o: 'ispat', what: L('Praktik Kerja, Maintenance', 'Work Placement, Maintenance'), where: L('Pabrik wire rod, Sidoarjo', 'Wire-rod mill, Sidoarjo'),
        text: L('Tiga bulan di refurbishment: menambah material las (hardfacing) pada roll produksi.', 'Three months in refurbishment: hardfacing production rolls.') },
      { y: '2016', o: 'lintech', what: L('Praktik Kerja, Welder GMAW', 'Work Placement, GMAW Welder'), where: L('Fabrikasi baja, Surabaya', 'Steel fabrication, Surabaya'),
        text: L('Tiga bulan ikut proyek pagar workshop 3×5 m dan cerobong Ø3 m × 10 m: baca gambar, las, assembly, sandblasting, painting, sampai packing.', 'Three months on a 3×5 m workshop fence and a Ø3 m × 10 m stack: reading drawings, welding, assembly, sandblasting, painting and packing.') }
    ],
    education: [
      { o: 'unesa', y: '2025 –', h: L('S2 Teknik Mesin', 'MEng, Mechanical Engineering'), sub: L('IPK sementara 3,87 dari 28 SKS · sedang semester 3', 'Interim GPA 3.87/4 over 28 credits · in semester 3'),
        items: [L('Artificial Intelligence, Metode Numerik & Simulasi, Matematika Rekayasa', 'Artificial Intelligence, Numerical Methods & Simulation, Engineering Mathematics'), L('Analisis Kegagalan Mekanika, Material & Proses Manufaktur, Nanomaterial', 'Mechanical Failure Analysis, Materials & Manufacturing Processes, Nanomaterials'), L('Technopreneurship, Teknologi Penanganan Pencemaran Lingkungan', 'Technopreneurship, Pollution Control Technology'), L('Sedang: Produk Komposit, Energi Hidrogen, Fuel Cell', 'Current: Composite Products, Hydrogen Energy, Fuel Cells'), L('Tesis: predictive maintenance robot las (LSTM, RUL) untuk efisiensi dan dekarbonisasi', 'Thesis: welding robot predictive maintenance (LSTM, RUL) for efficiency and decarbonisation')] },
      { o: 'unesa', y: '2018 –', h: L('S1 Pendidikan Teknik Mesin', 'BEd, Mechanical Engineering Education'), sub: L('Lulus 7 semester · IPK 3,62', 'Finished in 7 semesters · GPA 3.62/4'),
        items: [L('Elemen mesin, mekanika teknik, termodinamika, mekanika fluida', 'Machine elements, engineering mechanics, thermodynamics, fluid mechanics'), L('CNC, teknologi & praktik pengelasan, teknik pembentukan, CAD', 'CNC, welding technology and practice, forming, CAD'), L('K3, pengendalian mutu, statistik, perawatan mesin, alat ukur', 'Occupational safety, quality control, statistics, maintenance, metrology'), L('PLP: mengajar FCAW 1F–3F selama 3 bulan di SMK Semen Gresik', 'Teaching placement: FCAW 1F–3F for 3 months at a vocational school'), L('Skripsi: video pembelajaran YouTube teknik pengelasan FCAW', 'Thesis: YouTube learning videos for FCAW welding')] },
      { o: 'smk', y: '– 2018', h: L('SMK Teknik Pengelasan Kapal', 'Vocational School, Ship Welding'), sub: L('Sertifikat kompetensi nilai 95', 'Competency certificate, score 95'),
        items: [L('Las OAW, SMAW, FCAW, dan dasar GMAW', 'OAW, SMAW, FCAW and basic GMAW welding'), L('Rotasi: rancang bangun kapal (AutoCAD), konstruksi baja & NDT, kelistrikan, interior, permesinan kapal', 'Rotations: ship design (AutoCAD), steel construction & NDT, electrical, outfitting, marine machinery'), L('Gambar teknik manual dan dasar bahasa Jepang', 'Manual technical drawing and basic Japanese')] }
    ],
    certs: [
      { y: '', h: L('Operasi Robot Welding Panasonic', 'Panasonic Welding Robot Operation'), by: L('Pelatihan di tempat kerja', 'Workplace training') },
      { y: '', h: 'Siemens NX Basic CAD', by: L('Pelatihan di tempat kerja', 'Workplace training') },
      { y: '', h: 'Siemens NX Weld Assistant', by: L('Pelatihan di tempat kerja', 'Workplace training') },
      { y: '', h: L('Activity-Based Costing', 'Activity-Based Costing'), by: L('Pelatihan di tempat kerja', 'Workplace training') },
      { y: '2023', h: L('Basic to Advance P&ID (10 jam)', 'Basic to Advanced P&ID (10 hours)'), by: 'Kelas Engineer · PT Zaada Bana Engineering' },
      { y: '', h: 'TOEFL 517', by: L('Kampung Inggris Pare, 6 bulan', 'Pare English village, 6 months') },
      { y: '', h: L('Pemrograman Python', 'Python Programming'), by: L('Kursus', 'Course') },
      { y: '2018', h: L('Sertifikat Kompetensi Teknik Pengelasan Kapal · nilai 95', 'Ship Welding Competency Certificate · score 95'), by: L('SMKN 3 Buduran × PT Dok dan Perkapalan Surabaya', 'SMKN 3 Buduran × PT Dok dan Perkapalan Surabaya') }
    ],
    orgs: [
      { h: 'Garnesa Racing Team', o: 'garnesa', text: L('General Manager dan Kepala Scrutineering. Panitia scrutineering KMHE 2021: merekrut dan melatih 15 orang untuk inspeksi dimensi, rem, keselamatan, berat, suara, dan grounding.', 'General Manager and Head of Scrutineering. On the KMHE 2021 scrutineering committee I recruited and trained 15 inspectors for dimensions, brakes, safety, weight, noise and grounding.') },
      { h: 'SCEMIC', text: L('Komunitas riset Teknik Mesin: karya tulis ilmiah dan PKM kewirausahaan.', 'Mechanical engineering research community: scientific writing and student enterprise programs.') },
      { h: L('Robot KECE UNESA', 'Robot KECE UNESA'), text: L('Ikut mengembangkan robot pembantu penanganan pasien COVID-19 yang diserahkan ke Pemprov Jawa Timur.', 'Helped develop a COVID-19 patient-care robot handed over to the East Java provincial government.'), url: 'https://unesa.ac.id/unesa-serahkan-bantuan-robot-kece-ke-pemprov-jatim-untuk-tangani-pasien-covid/' },
      { h: L('KKN Penanggulangan Bencana', 'Disaster-response community service'), text: L('Prototipe alat deteksi banjir dan peta rawan banjir di Sidoarjo, plus relawan vaksinasi COVID-19.', 'A flood-detector prototype and a flood-risk map for Sidoarjo, plus COVID-19 vaccination volunteering.') },
      { h: L('FMM UNESA · Kominfo, Remaja Masjid', 'Muslim Student Forum (comms), mosque youth group'), text: L('Mengelola informasi kegiatan dan komunikasi organisasi.', 'Handled activity information and organisation communications.') }
    ],

    /* ---------------- kapabilitas ---------------- */
    levels: { daily: L('Dipakai harian', 'Used daily'), project: L('Dipakai di proyek', 'Used in projects'), growing: L('Sedang dikembangkan', 'Developing'), research: L('Riset', 'Research'), field: L('Dasar lapangan', 'Shop-floor foundation') },
    caps: [
      [L('Struktur BOM / MBOM (CBOM → EBOM → MBOM)', 'BOM / MBOM structuring (CBOM → EBOM → MBOM)'), L('Pekerjaan harian, BOM Bridge', 'Daily work, BOM Bridge'), 'daily'],
      [L('Estimasi waktu proses dan biaya consumable', 'Process-time and consumable cost estimation'), L('Las, machining, painting, assembly', 'Welding, machining, painting, assembly'), 'daily'],
      [L('Memimpin rapat lintas departemen', 'Running cross-department meetings'), L('Dua rapat mingguan, Change Board', 'Two weekly meetings, Change Board'), 'daily'],
      [L('Dashboard dan otomasi Excel / Google Sheets', 'Excel / Google Sheets dashboards and automation'), L('Produk LABORU, konverter TKDN', 'LABORU products, TKDN converter'), 'daily'],
      [L('Analisis robot las: OEE, stop time, alarm', 'Welding robot analysis: OEE, stop time, alarms'), L('Robot Insight, rapat monitoring dua mingguan', 'Robot Insight, fortnightly monitoring meeting'), 'project'],
      [L('Sistem mutu: ISO 9001 dan ISO 45001', 'Quality systems: ISO 9001 and ISO 45001'), L('MR untuk audit perpanjangan', 'MR for a renewal audit'), 'project'],
      [L('5S, Kaizen, K3, Poka-Yoke (go/no-go gauge)', '5S, Kaizen, safety, poka-yoke (go/no-go gauges)'), L('QC fabrikasi, pabrik alat berat', 'Fabrication QC, heavy-equipment plant'), 'project'],
      [L('Planning: roadmap, jadwal, anggaran, KPI tim', 'Planning: roadmap, schedule, budget, team KPIs'), L('Garnesa, 50 anggota', 'Garnesa, 50 members'), 'project'],
      [L('CAD: AutoCAD, Inventor, Siemens NX', 'CAD: AutoCAD, Inventor, Siemens NX'), L('SMK, Garnesa, pelatihan NX', 'School, Garnesa, NX training'), 'project'],
      [L('Alat web: HTML, CSS, JavaScript', 'Web tools: HTML, CSS, JavaScript'), L('Tiga demo di situs ini', 'The three demos on this site'), 'project'],
      [L('Python, SQL, PostgreSQL', 'Python, SQL, PostgreSQL'), L('Backend monitoring robot (berjalan)', 'Robot monitoring backend (in progress)'), 'growing'],
      [L('Predictive maintenance: LSTM, RUL', 'Predictive maintenance: LSTM, RUL'), L('Tesis S2', 'Master’s thesis'), 'research'],
      [L('CNC: Mastercam, PowerMill, setting dan operasi', 'CNC: Mastercam, PowerMill, setup and operation'), L('Programmer CNC molding', 'Mould CNC programmer'), 'field'],
      [L('Pengelasan: SMAW, FCAW, GMAW, OAW, hardfacing', 'Welding: SMAW, FCAW, GMAW, OAW, hardfacing'), L('SMK, tiga kali magang', 'School, three placements'), 'field'],
      [L('Komposit: fiberglass hand lay-up, karbon vacuum infusion', 'Composites: hand-laid fibreglass, vacuum-infused carbon'), L('Body mobil Garnesa', 'Garnesa car bodies'), 'field']
    ],
    path: [
      { h: L('Lantai produksi', 'Shop floor'), items: [L('Las, CNC, inspeksi', 'Welding, CNC, inspection')] },
      { h: L('Engineering', 'Engineering'), items: [L('BOM, costing, waktu proses', 'BOM, costing, process time')] },
      { h: L('Sistem kerja', 'Work systems'), items: [L('5S, Kaizen, ISO, K3', '5S, Kaizen, ISO, safety')] },
      { h: L('Visualisasi', 'Visualisation'), items: [L('Dashboard yang dibaca di rapat', 'Dashboards read in meetings')] },
      { h: L('Otomasi', 'Automation'), items: [L('Excel, Python, draf email', 'Excel, Python, email drafts')] },
      { h: L('Data & ML', 'Data & ML'), items: [L('PostgreSQL, prakiraan umur', 'PostgreSQL, life forecasting')] },
      { h: L('Produk & jasa', 'Products & services'), items: [L('LABORU, proyek pabrik dan UMKM', 'LABORU, plant and small-business projects')] }
    ],
    method: [
      { h: L('Lihat alur aslinya', 'See the real flow'), text: L('Di mana data lahir, siapa yang menyentuhnya, dan di rapat mana keputusannya diambil.', 'Where the data is born, who touches it, and in which meeting the decision gets made.') },
      { h: L('Rapikan dulu', 'Tidy it first'), text: L('Seiri, seiton: buang yang tidak perlu, tulis definisi metrik dan periodenya sebelum menggambar grafik.', 'Sort and set in order: drop what isn’t needed, write the metric definitions and period before any chart.') },
      { h: L('Ukur dengan jujur', 'Measure honestly'), text: L('Grafik pertama dibuat dari data apa adanya, termasuk bagian yang tidak enak dilihat.', 'The first chart uses the data as it is, including the uncomfortable parts.') },
      { h: L('Cegah, lalu otomasikan', 'Prevent, then automate'), text: L('Pasang pencegah salah input (poka-yoke), lalu otomasikan yang benar-benar berulang. Keputusan tetap di tangan orang.', 'Add input mistake-proofing, then automate only what truly repeats. Decisions stay with people.') },
      { h: L('Serahkan dan jaga', 'Hand over and keep it running'), text: L('Panduan pakai, 30 hari perbaikan, dan catatan hasil yang bisa dicek ulang. Kaizen-nya jalan terus.', 'A user guide, 30 days of fixes, and a results log anyone can re-check. The kaizen keeps going.') }
    ],
    research: {
      title: L('Efisiensi energi dan prediksi perawatan robot las', 'Energy efficiency and predictive maintenance for welding robots'),
      text: L('Tesis S2 saya menyambungkan tiga hal yang biasanya dilaporkan terpisah: waktu berhenti robot, energi per hasil las, dan kapan consumable perlu diganti.', 'My master’s thesis connects three things usually reported separately: robot stop time, energy per unit of weld output, and when consumables need changing.'),
      points: [
        [L('Metrik energi', 'Energy metric'), L('Specific energy consumption: kWh per satuan kawat las yang terdeposit.', 'Specific energy consumption: kWh per unit of wire deposited.')],
        [L('Emisi', 'Emissions'), L('Scope 2 berbasis lokasi mengikuti GHG Protocol.', 'Location-based Scope 2 following the GHG Protocol.')],
        [L('Model', 'Models'), L('LSTM dibandingkan dengan regresi linear dan polinomial untuk memperkirakan sisa umur (RUL).', 'LSTM compared with linear and polynomial regression for remaining useful life (RUL).')],
        [L('Ukuran galat', 'Error measure'), L('MAE, karena lebih gampang dibaca orang lapangan daripada RMSE.', 'MAE, because shop-floor people read it more easily than RMSE.')],
        [L('Status', 'Status'), L('Data mulai terambil otomatis dari sebagian robot. Hasil belum saya publikasikan sebelum validasinya selesai.', 'Data is now captured automatically from some robots. I am not publishing results before validation is complete.')]
      ]
    },
    faq: [
      [L('Bagaimana cara kerjanya?', 'How does the work happen?'), L('Jarak jauh dan tertulis. Saya mengerjakan di malam hari dan akhir pekan (WIB), dengan satu update tertulis tiap minggu dan panggilan singkat kalau perlu.', 'Remote and in writing. I work evenings and weekends (UTC+7), with one written update a week and a short call when needed.')],
      [L('Bisa datang ke lokasi?', 'Can you come on site?'), L('Bisa, di akhir pekan untuk area Jabodetabek. Di luar itu ongkos perjalanan dihitung terpisah.', 'Yes, on weekends around Greater Jakarta. Elsewhere, travel is quoted separately.')],
      [L('Usaha saya kecil. Masih cocok?', 'My business is small. Is it still a fit?'), L('Cocok. Paket Rapikan Bengkel dan Bedah Data memang dibuat untuk UMKM dan bengkel yang ingin naik kelas tanpa beli sistem mahal.', 'Yes. The Workshop Tidy-up and Data Review packages are made for small businesses and workshops that want to level up without buying expensive systems.')],
      [L('Data kami rahasia.', 'Our data is confidential.'), L('Saya bersedia tanda tangan NDA. Nama part, pemasok, dan harga boleh Anda samarkan; saya cuma butuh strukturnya. File saya hapus setelah proyek selesai.', 'I am happy to sign an NDA. You can mask part names, suppliers and prices; I only need the structure. Files are deleted when the project ends.')],
      [L('Pembayarannya bagaimana?', 'How does payment work?'), L('Bedah Data dibayar di awal. Proyek lain 50% di awal dan 50% saat serah terima, pakai invoice.', 'The Data Review is paid upfront. Other projects are 50% upfront and 50% at hand-over, with an invoice.')],
      [L('Kalau ada yang error setelah serah terima?', 'What if something breaks after hand-over?'), L('Perbaikan bug gratis 30 hari. Perubahan lingkup dibicarakan sebagai pekerjaan baru.', 'Bug fixes are free for 30 days. Scope changes are discussed as new work.')],
      [L('Bisa mulai dari Excel yang sudah kami pakai?', 'Can you start from the Excel we already use?'), L('Bisa, dan memang itu yang saya sarankan. Alat yang mengikuti kebiasaan tim lebih mungkin dipakai.', 'Yes, and that is what I recommend. A tool that follows the team’s habits is more likely to be used.')],
      [L('Proyek apa yang tidak Anda ambil?', 'What work do you not take?'), L('Pekerjaan yang bersinggungan dengan pemberi kerja saya, pemasoknya, atau pesaing langsungnya, dan pekerjaan yang harus hadir di lokasi pada jam kerja.', 'Work that touches my employer, its suppliers or its direct competitors, and work that needs me on site during working hours.')]
    ]
  };
})();

/* ---------------- tampilan utama (Ringkas = garis besar, Mendalam = semua) ---------------- */
(function () {
  'use strict';
  var L = function (id, en) { return { id: id, en: en }; }, S = window.SITE;
  S.v2 = {
    hello: L('Halo, saya', 'Hello, I’m'),
    bigword: 'PORTOFOLIO',
    role: L('Production engineer · manufaktur alat berat', 'Production engineer · heavy-equipment manufacturing'),
    line: L('Dari ngelas di bengkel SMK sampai menyusun BOM pabrik excavator. Saya membuat proses pabrik lebih rapi, lebih cepat, dan terukur.', 'From welding in a school workshop to building BOMs at an excavator plant. I make factory processes tidier, faster and measurable.'),
    see: L('Lihat karya', 'See the work'),
    stats: [[L('sejak', 'since'), '2016', L('di dunia manufaktur', 'in manufacturing')], ['7', '', L('pabrik & bengkel tempat saya belajar dan bekerja', 'plants and shops I’ve learned and worked in')], ['3', '', L('alat yang bisa langsung dicoba', 'tools you can try right now')]],
    places: L('Pernah belajar dan bekerja di', 'Learned and worked at'),
    placeList: ['smk', 'lintech', 'ispat', 'unesa', 'garnesa', 'pal', 'drb', 'gen', 'kawamura', 'hcmi', 'laboru'],
    s1: { n: '01 / KARYA', a: L('Lihat dulu,', 'Look first,'), b: L('baru baca.', 'read later.'), lead: L('Cuplikan alat yang saya bangun. Klik untuk memperbesar. Semua demo pakai data contoh.', 'Previews of tools I’ve built. Click to enlarge. Every demo runs on sample data.') },
    filters: [['all', L('Semua', 'All')], ['analitik', L('Analitik', 'Analytics')], ['workflow', L('Workflow', 'Workflow')], ['bom', 'BOM'], ['laboru', L('Game & produk', 'Games & products')]],
    s3: { n: '02 / SINGKATNYA', a: L('Paham prosesnya.', 'I know the process.'), b: L('Rapi hasilnya.', 'I tidy the result.'),
      text: L('Sejak 2016 saya berpindah posisi di manufaktur: welder, programmer CNC, QC, sampai production engineer. Jadi kalau diajak membereskan proses, saya mulai dari lantai produksi, bukan dari slide.', 'Since 2016 I’ve moved through manufacturing roles: welder, CNC programmer, QC, production engineer. So when I’m asked to fix a process, I start on the shop floor, not in a slide deck.'),
      pillars: [
        [L('Engineering', 'Engineering'), L('Las, CNC, inspeksi, BOM, estimasi biaya dan waktu proses.', 'Welding, CNC, inspection, BOMs, cost and process-time estimates.')],
        [L('Manajemen & planning', 'Management & planning'), L('Pernah memimpin tim 50 orang, menjalankan rapat lintas departemen tiap minggu, dan menyiapkan audit ISO.', 'Led a 50-person team, run weekly cross-department meetings, and prepared ISO audits.')],
        [L('Data & otomasi', 'Data & automation'), L('Excel jadi dashboard, salin-tempel jadi satu klik, log mesin jadi keputusan.', 'Excel into dashboards, copy-paste into one click, machine logs into decisions.')]
      ],
      stdLbl: L('Terbiasa kerja dengan standar Jepang', 'Used to Japanese shop-floor standards'),
      std: ['5S', 'Kaizen', 'K3 · Safety', 'Poka-Yoke', 'ISO 9001', 'ISO 45001'],
      who: L('Yang saya suka: membereskan proses yang berantakan, baik di pabrik besar, organisasi, maupun bengkel kecil yang ingin naik kelas.', 'What I enjoy: untangling messy processes, whether in a large plant, an organisation, or a small workshop that wants to level up.'),
      quote: L('Tidak ada yang tidak bisa. Tinggal mau atau tidak.', 'Nothing is impossible to learn. It comes down to whether you want to.') },
    s2: { n: '03 / PENGAKUAN', a: L('Kerjanya.', 'The work.'), b: L('Pengakuannya.', 'The recognition.'), bigSub: L('Juara 1 nasional, Sistem Kemudi & Pengereman, KMHE 2020', 'National 1st place, Steering & Braking, KMHE 2020') },
    /* [tahun, judul, keterangan, link opsional] */
    awards: [
      ['2020', L('Juara 1 Sistem Kemudi & Pengereman', '1st place, Steering & Braking'), L('Kontes Mobil Hemat Energi nasional, kategori Urban · saya General Manager tim', 'National energy-efficient car contest, Urban class · I was team General Manager')],
      ['2020', L('Lolos Shell Eco-marathon Asia', 'Qualified for Shell Eco-marathon Asia'), L('Lolos fase 3, lalu ikut Pitch the Future di Virtual League 2021', 'Passed phase 3, then joined Pitch the Future in the 2021 Virtual League'), 'https://www.shellecomarathon.com/'],
      ['2019', L('Juara 3 Urban Diesel · 87 km/liter', '3rd place, Urban Diesel · 87 km/litre'), L('KMHE 2019 di Universitas Negeri Malang · tim inti chassis dan time keeper', 'KMHE 2019 in Malang · core chassis team and time keeper'), 'https://unesa.ac.id/persiapan-terbatas-garnesa-racing-team-sabet-juara-3-kategori-urban-diesel-kmhe-2019/'],
      ['2021', L('Pemakalah seminar nasional', 'National seminar speaker'), L('SATRIA 2021, FT UNESA · refurbishment cone crusher dengan las', 'SATRIA 2021, UNESA · cone-crusher refurbishment by welding')],
      ['2018', L('Juara 3 Karya Tulis Ilmiah', '3rd place, scientific writing'), L('SCEMIC Weekend of Technology, Teknik Mesin UNESA', 'SCEMIC Weekend of Technology, UNESA Mechanical Engineering')]
    ],
    s4: { n: '04 / PERJALANAN', a: L('Dari bengkel', 'From the workshop'), b: L('ke data.', 'to the data.'), w1: L('Kemenangan kecil.', 'Little wins.'), w2: L('Arti besar.', 'Big meaning.') },
    /* garis besar untuk Ringkas */
    outline: [
      ['2016', L('Mulai ngelas', 'Started welding'), L('SMK Teknik Pengelasan Kapal', 'Ship welding school')],
      ['2018', L('Kuliah dan tim balap hemat energi', 'University and an eco-car team'), L('UNESA · Garnesa Racing Team', 'UNESA · Garnesa Racing Team')],
      ['2021', L('Masuk dunia kerja', 'Started working'), L('Stockpile, CNC, quality control', 'Stockpile, CNC, quality control')],
      ['2024', L('Production engineer', 'Production engineer'), L('Pabrik alat berat, Cikarang', 'Heavy-equipment plant, Cikarang'), 1],
      ['2025', L('S2 dan LABORU', 'Master’s and LABORU'), L('Riset robot las · produk digital', 'Welding robot research · digital products')]
    ],
    wins: [L('Lulus S1 dalam 7 semester', 'Finished my bachelor’s in 7 semesters'), L('Memimpin sekitar 50 orang lewat 5 kepala divisi', 'Led about 50 people through 5 division heads'), L('Ikut membangun robot pembantu pasien COVID-19', 'Helped build a COVID-19 patient-care robot'), L('IPK S2 sementara 3,87 sambil kerja penuh waktu', 'Master’s GPA 3.87 so far while working full time')],
    nudge: { a: L('Ini versi singkatnya.', 'That’s the short version.'), text: L('Versi lengkapnya ada di Mendalam: studi kasus, cara kerja, riwayat lengkap, pendidikan, sertifikat, dan produk.', 'The full version lives in Deep dive: case studies, how I work, full history, education, certificates and products.'), cta: L('Buka versi lengkap', 'Open the full version'), bubble: L('Yang detail ada di sebelah. Ayo saya antar.', 'The details are next door. Let me take you.') },
    s5: { n: '05 / DI LUAR JAM KERJA', a: L('Saya juga', 'I also'), b: L('bikin game.', 'make games.'), text: L('LABORU itu game kantor pixel untuk mengatur kerja, kebiasaan, dan uang. Labo, si bulat hijau di pojok kanan bawah, adalah maskotnya.', 'LABORU is a pixel office game for organising work, habits and money. Labo, the round green one in the bottom corner, is its mascot.'), cta: L('Kenalan dengan LABORU', 'Meet LABORU') },
    s6: { a: L('Mari', 'Let’s'), b: L('ngobrol.', 'talk.'), text: L('Mau tanya, ajak kerja sama, atau sekadar kenalan? Kirim pesan saja. Saya balas sendiri, biasanya malam hari.', 'Want to ask something, work together, or just say hi? Send a message. I reply myself, usually in the evening.'),
      side: L('Belum yakin mau tanya apa? Labo bisa bantu cari jawabannya dulu.', 'Not sure what to ask yet? Labo can help you find the answer first.'),
      deep: L('Butuh detail lengkap? Buka versi Mendalam.', 'Need the full detail? Open the Deep dive.') },
    deepIntro: L('Versi lengkap · untuk yang ingin membaca detail', 'Full version · for readers who want the detail'),
    close: L('Tutup', 'Close'), prev: L('Sebelumnya', 'Previous'), next: L('Berikutnya', 'Next'), open: L('Buka demo', 'Open demo'), readCase: L('Baca studi kasus', 'Read the case study')
  };
  /* w×h = ukuran asli gambar, supaya tampil proporsional tanpa terpotong */
  var W = [720, 450], P = [360, 613], H = [720, 405];
  S.gallery = [
    { f: 'ri-overview', t: 'analitik', c: 'robot-insight', cap: L('Robot Insight · ringkasan armada robot', 'Robot Insight · fleet overview'), s: W },
    { f: 'lb-title', t: 'laboru', cap: L('LABORU · layar judul', 'LABORU · title screen'), s: P, link: 'laboru' },
    { f: 'cb-board', t: 'workflow', c: 'change-board', cap: L('Change Board · siapa memegang bola', 'Change Board · who holds the ball'), s: W },
    { f: 'bb-mbom', t: 'bom', c: 'bom-bridge', cap: L('BOM Bridge · MBOM dengan alasan per baris', 'BOM Bridge · MBOM with a reason on every line'), s: W },
    { f: 'lb-lobby', t: 'laboru', cap: L('LABORU · lobi kantor pixel', 'LABORU · pixel office lobby'), s: H, link: 'laboru' },
    { f: 'ri-predict', t: 'analitik', c: 'robot-insight', cap: L('Prakiraan umur liner kawat las', 'Wire-liner life forecast'), s: W },
    { f: 'cb-timeline', t: 'workflow', c: 'change-board', cap: L('Gantt perubahan engineering', 'Engineering change Gantt'), s: W },
    { f: 'ri-oee', t: 'analitik', c: 'robot-insight', cap: L('Ke mana jam produksi pergi', 'Where the production hours go'), s: W },
    { f: 'lb-ratrace', t: 'laboru', cap: L('LABORU · game rat race', 'LABORU · rat-race game'), s: P, link: 'laboru' },
    { f: 'bb-ebom', t: 'bom', c: 'bom-bridge', cap: L('Struktur EBOM', 'EBOM structure'), s: W },
    { f: 'ri-stop', t: 'analitik', c: 'robot-insight', cap: L('Pola alarm per jam', 'Alarms by hour'), s: W },
    { f: 'cb-meeting', t: 'workflow', c: 'change-board', cap: L('Mode rapat dan rekap otomatis', 'Meeting mode and automatic recap'), s: W },
    { f: 'lb-quest', t: 'laboru', cap: L('LABORU · papan quest', 'LABORU · quest board'), s: H, link: 'laboru' },
    { f: 'ri-alarms', t: 'analitik', c: 'robot-insight', cap: L('Pareto kode alarm', 'Alarm code Pareto'), s: W },
    { f: 'bb-rules', t: 'bom', c: 'bom-bridge', cap: L('Aturan make / buy / phantom', 'Make / buy / phantom rules'), s: W },
    { f: 'lb-pet', t: 'laboru', cap: L('LABORU · peliharaan Labo', 'LABORU · Labo the pet'), s: P, link: 'laboru' },
    { f: 'cb-analytics', t: 'workflow', c: 'change-board', cap: L('Standar vs aktual per departemen', 'Standard vs actual per department'), s: W },
    { f: 'ri-cm', t: 'analitik', c: 'robot-insight', cap: L('Register countermeasure', 'Countermeasure register'), s: W },
    { f: 'bb-cbom', t: 'bom', c: 'bom-bridge', cap: L('Konfigurasi pesanan (CBOM)', 'Order configuration (CBOM)'), s: W },
    { f: 'lb-hub', t: 'laboru', cap: L('Company System Hub', 'Company System Hub'), s: W, link: 'laboru' },
    { f: 'ri-energy', t: 'analitik', c: 'robot-insight', cap: L('Energi per kg kawat dan emisi', 'Energy per kg of wire and emissions'), s: W },
    { f: 'cb-drawer', t: 'workflow', c: 'change-board', cap: L('Riwayat satu kasus', 'One case history'), s: W },
    { f: 'lb-ebook', t: 'laboru', cap: L('Ebook pixel-art 500 halaman', '500-page pixel-art ebook'), s: [720, 1018], link: 'laboru' }
  ];
  S.hero = ['ri-overview', 'cb-board', 'bb-mbom', 'lb-hub'];
})();
