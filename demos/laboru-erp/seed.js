/* LABORU ERP — data standar (demo, mendekati kondisi bengkel di Jabodetabek 2026).
   Semua angka bisa diubah di aplikasi dan tersimpan. Bengkel, pekerja, pelanggan: fiktif. */
(function () {
  'use strict';
  window.ERP_SEED = function () {
    return {
      v: 1,
      settings: { company: 'Bengkel Contoh Jaya', city: 'Bekasi', mode: 'kecil', hoursDay: 8, daysWeek: 6, margin: 25, overhead: 12, otMax: 2, otRate: 1.5, otEff: 0.9, conf: 0.9, waOwner: '', emailOwner: '', today: '2026-11-18' },
      /* keahlian & alat utamanya (untuk biaya pemakaian alat per jam) */
      skills: [
        { k: 'potong', n: 'Potong & bending', tool: 'T3' }, { k: 'las', n: 'Pengelasan', tool: 'T1' }, { k: 'gerinda', n: 'Gerinda & finishing', tool: 'T2' },
        { k: 'rakit', n: 'Perakitan & pasang', tool: 'T5' }, { k: 'cat', n: 'Pengecatan', tool: 'T4' }, { k: 'mesin', n: 'Permesinan (bubut/bor)', tool: 'T5' }
      ],
      /* level 1 = belajar (70%), 2 = mandiri (100%), 3 = ahli (120%) */
      workers: [
        { id: 'W1', name: 'Pak Darto', role: 'Mandor', wa: '', rate: 40000, sk: { las: 3, rakit: 3, potong: 2 } },
        { id: 'W2', name: 'Andi', role: 'Tukang las', wa: '', rate: 32000, sk: { las: 2, gerinda: 2 } },
        { id: 'W3', name: 'Budi', role: 'Tukang', wa: '', rate: 30000, sk: { potong: 3, gerinda: 2, rakit: 2 } },
        { id: 'W4', name: 'Cecep', role: 'Tukang cat', wa: '', rate: 30000, sk: { cat: 3, gerinda: 2 } },
        { id: 'W5', name: 'Deni', role: 'Helper', wa: '', rate: 24000, sk: { gerinda: 1, potong: 1, rakit: 1 } },
        { id: 'W6', name: 'Eko', role: 'Tukang mesin', wa: '', rate: 32000, sk: { mesin: 2, las: 1 } }
      ],
      /* bahan: harga satuan, stok, lead time pemasok (hari), pemakaian rata-rata/hari & simpangannya untuk stok minimum */
      materials: [
        { id: 'M01', n: 'Besi hollow 40×40×1,6 mm (6 m)', u: 'batang', p: 98000, st: 26, lt: 2, d: 3.0, sd: 1.6, sup: 'Toko Besi Sinar' },
        { id: 'M02', n: 'Besi hollow 20×40×1,4 mm (6 m)', u: 'batang', p: 72000, st: 30, lt: 2, d: 3.5, sd: 1.8, sup: 'Toko Besi Sinar' },
        { id: 'M03', n: 'Besi siku 40×40×4 mm (6 m)', u: 'batang', p: 168000, st: 14, lt: 3, d: 1.6, sd: 0.9, sup: 'Toko Besi Sinar' },
        { id: 'M04', n: 'Plat besi 2 mm (4×8 ft)', u: 'lembar', p: 1150000, st: 3, lt: 4, d: 0.3, sd: 0.25, sup: 'CV Plat Mandiri' },
        { id: 'M05', n: 'Plat besi 3 mm (4×8 ft)', u: 'lembar', p: 1700000, st: 2, lt: 4, d: 0.2, sd: 0.2, sup: 'CV Plat Mandiri' },
        { id: 'M06', n: 'Pipa besi 1 inci (6 m)', u: 'batang', p: 152000, st: 10, lt: 3, d: 0.8, sd: 0.6, sup: 'Toko Besi Sinar' },
        { id: 'M07', n: 'Atap spandek 0,3 mm', u: 'm²', p: 76000, st: 20, lt: 3, d: 2.2, sd: 2.0, sup: 'Toko Baja Ringan Prima' },
        { id: 'M08', n: 'Cat dasar (meni) 1 kg', u: 'kg', p: 56000, st: 12, lt: 1, d: 1.2, sd: 0.6, sup: 'Toko Cat Warna' },
        { id: 'M09', n: 'Cat besi akhir 1 kg', u: 'kg', p: 78000, st: 10, lt: 1, d: 1.1, sd: 0.6, sup: 'Toko Cat Warna' },
        { id: 'M10', n: 'Thinner 1 liter', u: 'liter', p: 30000, st: 15, lt: 1, d: 1.4, sd: 0.7, sup: 'Toko Cat Warna' },
        { id: 'M11', n: 'Baut + mur M10 set', u: 'set', p: 2500, st: 300, lt: 1, d: 12, sd: 8, sup: 'Toko Baut Jaya' },
        { id: 'M12', n: 'Roda trolley 5 inci', u: 'pcs', p: 68000, st: 8, lt: 3, d: 0.3, sd: 0.4, sup: 'Toko Teknik Abadi' },
        { id: 'M13', n: 'Engsel & grendel pagar', u: 'set', p: 45000, st: 6, lt: 2, d: 0.2, sd: 0.2, sup: 'Toko Teknik Abadi' },
        { id: 'M14', n: 'Dempul besi 1 kg', u: 'kg', p: 42000, st: 5, lt: 1, d: 0.3, sd: 0.2, sup: 'Toko Cat Warna' }
      ],
      /* konsumabel: umur pakai (jam kerja per satuan) dipakai untuk memperkirakan habisnya stok */
      consumables: [
        { id: 'C1', n: 'Elektroda las RB 2,6 mm', u: 'kg', p: 38000, st: 60, life: 1.6, skill: 'las', lt: 1 },
        { id: 'C2', n: 'Mata gerinda potong 4"', u: 'pcs', p: 8000, st: 110, life: 0.8, skill: 'potong', lt: 1 },
        { id: 'C3', n: 'Mata gerinda poles 4"', u: 'pcs', p: 12000, st: 90, life: 1.5, skill: 'gerinda', lt: 1 },
        { id: 'C4', n: 'Amplas (lembar)', u: 'lembar', p: 5000, st: 30, life: 0.7, skill: 'cat', lt: 1 },
        { id: 'C5', n: 'Mata bor HSS (set kecil)', u: 'pcs', p: 25000, st: 8, life: 6, skill: 'mesin', lt: 2 }
      ],
      /* alat & mesin: depresiasi garis lurus, umur ekonomis mengikuti kelompok harta (4 atau 8 tahun) */
      tools: [
        { id: 'T1', n: 'Mesin las inverter (2 unit)', p: 9000000, buy: '2023-02-10', life: 4, salv: 900000, hYear: 1500 },
        { id: 'T2', n: 'Gerinda tangan (4 unit)', p: 3000000, buy: '2024-06-01', life: 4, salv: 200000, hYear: 1200 },
        { id: 'T3', n: 'Mesin potong cut-off + bending manual', p: 14800000, buy: '2021-08-15', life: 8, salv: 1500000, hYear: 1000 },
        { id: 'T4', n: 'Kompresor + spray gun', p: 6500000, buy: '2022-03-20', life: 4, salv: 650000, hYear: 800 },
        { id: 'T5', n: 'Bor duduk + perkakas rakit', p: 4200000, buy: '2023-09-05', life: 4, salv: 400000, hYear: 900 }
      ],
      /* katalog pesanan pelanggan. "ukuran" dihitung dari isian (mis. panjang × tinggi).
         bahan/langkah/konsumabel = kebutuhan per 1 satuan ukuran; fix = menit persiapan sekali per order. */
      catalog: [
        { id: 'K1', n: 'Pagar besi hollow minimalis', unit: 'm²', inputs: [['p', 'Panjang (m)', 6], ['t', 'Tinggi (m)', 1.5]], size: 'p*t',
          bom: [['M01', 0.55], ['M02', 1.6], ['M13', 0.06], ['M08', 0.12], ['M09', 0.14], ['M10', 0.1], ['M14', 0.03]],
          steps: [['potong', 22, 30], ['las', 38, 20], ['gerinda', 16, 0], ['cat', 20, 30], ['rakit', 12, 60]],
          cons: [['C1', 0.32], ['C2', 0.45], ['C3', 0.18], ['C4', 0.25]],
          opts: [{ k: 'nocat', n: 'Tanpa pengecatan (hanya meni)', bom: [['M09', -0.14]], steps: [['cat', -12, 0]] }, { k: 'motif', n: 'Motif laser / ornamen', bom: [['M04', 0.08]], steps: [['potong', 15, 0], ['las', 10, 0]] }] },
        { id: 'K2', n: 'Kanopi rangka hollow + atap spandek', unit: 'm²', inputs: [['p', 'Panjang (m)', 6], ['l', 'Lebar (m)', 4]], size: 'p*l',
          bom: [['M01', 0.35], ['M02', 0.45], ['M07', 1.1], ['M11', 1.5], ['M08', 0.08], ['M09', 0.08], ['M10', 0.06]],
          steps: [['potong', 10, 30], ['las', 20, 30], ['gerinda', 6, 0], ['cat', 12, 30], ['rakit', 22, 120]],
          cons: [['C1', 0.18], ['C2', 0.25], ['C3', 0.08], ['C4', 0.12]],
          opts: [{ k: 'talang', n: 'Tambah talang & lisplang', bom: [['M04', 0.02]], steps: [['rakit', 4, 30]] }] },
        { id: 'K3', n: 'Rak gudang besi siku 4 tingkat', unit: 'unit', inputs: [['q', 'Jumlah unit', 5]], size: 'q',
          bom: [['M03', 2.2], ['M04', 0.18], ['M11', 32], ['M08', 0.3], ['M09', 0.35], ['M10', 0.2]],
          steps: [['potong', 40, 20], ['mesin', 30, 15], ['las', 25, 0], ['cat', 35, 30], ['rakit', 30, 0]],
          cons: [['C2', 0.8], ['C5', 0.15], ['C1', 0.25], ['C4', 0.3]], opts: [] },
        { id: 'K4', n: 'Trolley barang plat 600 kg', unit: 'unit', inputs: [['q', 'Jumlah unit', 4]], size: 'q',
          bom: [['M03', 1.1], ['M05', 0.12], ['M06', 0.4], ['M12', 4], ['M11', 16], ['M08', 0.25], ['M09', 0.3], ['M10', 0.15]],
          steps: [['potong', 35, 20], ['las', 60, 15], ['gerinda', 25, 0], ['mesin', 15, 10], ['cat', 30, 30], ['rakit', 25, 0]],
          cons: [['C1', 0.55], ['C2', 0.6], ['C3', 0.3], ['C5', 0.1], ['C4', 0.25]], opts: [] },
        { id: 'K5', n: 'Tangki/bak plat 3 mm', unit: 'm²', inputs: [['p', 'Panjang (m)', 2], ['l', 'Lebar (m)', 1], ['t', 'Tinggi (m)', 1]], size: '2*(p*l+p*t+l*t)',
          bom: [['M05', 0.36], ['M03', 0.4], ['M08', 0.15], ['M09', 0.16], ['M10', 0.1]],
          steps: [['potong', 25, 30], ['las', 55, 30], ['gerinda', 25, 0], ['cat', 22, 30], ['rakit', 8, 30]],
          cons: [['C1', 0.6], ['C2', 0.5], ['C3', 0.35], ['C4', 0.2]], opts: [{ k: 'uji', n: 'Uji bocor air 24 jam', steps: [['rakit', 3, 60]] }] }
      ],
      /* alur proyek standar mengikuti ISO 9001:2015. skip = boleh dilewati di mode bengkel kecil (dokumen tetap dibuat) */
      flows: [
        { id: 'F1', n: 'Standar fabrikasi (ISO 9001)', steps: [
          ['Penawaran & PO pelanggan', '8.2', 'Penawaran + PO/DP pelanggan', 'doc', 0, ''],
          ['Rencana produksi & jadwal', '8.1', 'Rencana produksi', 'auto', 0, ''],
          ['Pembelian bahan', '8.4', 'PO pemasok', 'doc', 0, ''],
          ['Terima bahan & QC incoming', '8.4.3 / 8.6', 'Tanda terima + checksheet incoming + foto bahan', 'photo', 0, 'in'],
          ['Potong & persiapan', '8.5.1', 'Foto hasil potong', 'photo', 1, 'potong'],
          ['Fabrikasi / pengelasan', '8.5.1', 'Foto hasil las + laporan konsumabel', 'photo', 0, 'las'],
          ['QC proses', '8.6', 'Checksheet proses', 'photo', 1, 'proc'],
          ['Finishing & pengecatan', '8.5.1', 'Foto hasil cat', 'photo', 0, 'cat'],
          ['QC akhir', '8.6', 'Checksheet akhir + foto', 'photo', 0, 'final'],
          ['Packing & pengiriman', '8.5.4', 'Surat jalan + foto barang', 'photo', 0, 'kirim'],
          ['Serah terima (BAST)', '8.5.5', 'Berita acara serah terima', 'photo', 0, ''],
          ['Umpan balik pelanggan', '9.1.2', 'Survei kepuasan', 'doc', 1, '']
        ] }
      ],
      /* proyek yang sedang berjalan (membentuk antrean kapasitas) */
      projects: [
        { id: 'P-0041', cust: 'Pak Hendra', wa: '', email: '', item: 'K2', inp: { p: 8, l: 3 }, opt: [], strat: 'normal', price: 8900000, start: '2026-11-09', due: '2026-12-01', flow: 'F1', done: [0, 1, 2, 3, 4], ev: {}, rem: { las: 0.4, gerinda: 1, cat: 1, rakit: 1 } },
        { id: 'P-0042', cust: 'CV Maju Logistik', wa: '', email: '', item: 'K3', inp: { q: 10 }, opt: [], strat: 'normal', price: 11000000, start: '2026-11-14', due: '2026-12-05', flow: 'F1', done: [0, 1, 2, 3], ev: {}, rem: { potong: 0.6, mesin: 1, las: 1, cat: 1, rakit: 1 } },
        { id: 'P-0043', cust: 'Ibu Sari', wa: '', email: '', item: 'K1', inp: { p: 15, t: 1.8 }, opt: [], strat: 'normal', price: 8300000, start: '2026-11-17', due: '2026-12-10', flow: 'F1', done: [0, 1], ev: {}, rem: { potong: 1, las: 1, gerinda: 1, cat: 1, rakit: 1 } }
      ],
      pos: [], logs: [], msgs: [], seq: { p: 44, po: 12, sj: 30 }
    };
  };
})();
