# Portofolio Auzan Asarudin — catatan untuk agen AI

Situs statis (GitHub Pages), tanpa build step. Ubah konten di `assets/js/data.js` saja.

## Struktur
- `index.html` — halaman utama. Mode `Ringkas` (umum, banyak cuplikan, tanpa jualan) dan `Mendalam` (detail teknis, jasa, harga).
- `assets/css/tokens.css` — font + token warna (dipakai situs dan demo). `assets/css/site.css` — gaya situs (gelap, aksen oranye).
- `assets/js/site.js` — render dari data. `assets/js/labo.js` — asisten Labo (tanpa server, selalu tampil; jawaban = daftar `KB` kata kunci → jawaban dari data.js; di Ringkas tidak menyebut harga).
- `me/` — ruang pribadi (skill tree, update kehidupan, target 2027). Tidak ditautkan; dibuka dengan klik © di footer 3×. Data hanya di localStorage + ekspor JSON. Jangan taruh data pribadi (gaji, utang, keluarga) di repo.
- `assets/img/g/` — cuplikan galeri (`nama.webp` 1440px + `nama-s.webp` 720px).
- `demos/` — tiga demo interaktif dengan data sintetis (Robot Insight, Change Board, BOM Bridge).

## Aturan kerja (diadaptasi dari andrej-karpathy-skills)
1. Pikir dulu: sebutkan asumsi; jika ragu, tanya.
2. Sederhana: kode seminimal mungkin, tanpa framework.
3. Perubahan bedah: ubah hanya yang diminta, ikuti gaya yang ada.
4. Berbasis tujuan: tiap perubahan diverifikasi (screenshot desktop + 390px, tanpa error konsol).

## Larangan
- Jangan pakai data, nama part, gambar, atau angka internal perusahaan mana pun. Demo = data sintetis.
- Jangan tampilkan angka hasil kerja tanpa definisi, periode, dan status (dipakai / riset).
- Mode Ringkas tidak menawarkan jasa atau harga. Ringkas = garis besar (~20% panjang halaman), Mendalam = semua detail (~80%).
