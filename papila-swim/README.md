# Papila Swim — Website

Website statis (HTML + CSS + JavaScript murni, tanpa build dan tanpa library) untuk **Papila Swimming School**.

## Halaman

| File | Isi |
|---|---|
| `index.html` | Beranda: hero animasi air + pencari kelas berdasarkan usia, statistik, tentang, standar & kemitraan, keunggulan, program (filter usia + detail), lokasi kolam (per kota + pencarian), alur daftar, format kelas, tim, galeri, testimoni, berita, FAQ, formulir pendaftaran |
| `tentang.html` | Profil, visi & misi, statistik, tab layanan (alamat kolam per kota & detail program), keunggulan |
| `tim.html` | Tim pelatih dengan filter peran, pencarian, dan profil (pop-up) |
| `berita.html` | Daftar artikel (pencarian, topik, halaman) + pembaca artikel (`berita.html#slug-artikel`) |
| `galeri.html` | Galeri masonry dengan filter kategori dan lightbox (geser / tombol panah keyboard) |

## Cara merevisi konten

Semua teks, angka, kontak, lokasi, program, tim, galeri, testimoni, berita, dan FAQ ada di **`js/data.js`**.
Cukup edit file itu, simpan, lalu muat ulang halaman.

| Bagian di `data.js` | Untuk |
|---|---|
| `brand` | Nama, slogan, nomor WhatsApp, email, alamat, jam operasional, media sosial |
| `hero` | Slide di bagian paling atas beranda |
| `about`, `visionMission` | Profil dan visi misi |
| `stats` | Angka statistik |
| `partners` | Lisensi/sertifikasi/mitra (pita berjalan) |
| `features` | Keunggulan |
| `ageGroups`, `programs` | Filter usia dan daftar program |
| `pools` | Kolam mitra per kota |
| `steps`, `formats` | Alur pendaftaran dan format kelas |
| `team` | Tim pelatih |
| `gallery` | Foto galeri |
| `testimonials` | Testimoni (hapus `example: true` setelah diganti ulasan asli) |
| `news` | Berita & artikel (termasuk isi artikel) |
| `faq` | Tanya jawab |

Tips:
- Teks di antara bintang, misalnya `"Berenang dengan *aman*"`, tampil dengan sorotan warna.
- Mengosongkan sebuah daftar (misalnya `testimonials: []`) akan menyembunyikan bagiannya.
- Status **Buka sekarang / Tutup** di bagian kontak dihitung otomatis dari `brand.hours`.

## Foto

Simpan gambar di `assets/img/`, lalu isi properti `img` pada data yang sesuai, misalnya:

```js
{ title: "Kelas Baby Swim", category: "Latihan", img: "assets/img/baby-swim.jpg" }
```

Jika `img` kosong, ditampilkan ilustrasi air sebagai pengganti.

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
cd papila-swim
python3 -m http.server 8000
# buka http://localhost:8000
```

## Catatan

- Formulir pendaftaran menyusun pesan lalu mengirimkannya lewat WhatsApp ke nomor di `brand.whatsapp` (belum ada server).
- Login portal siswa masih tampilan demo.
- Peta memakai ilustrasi + tautan "Buka di Google Maps".
- Mendukung keyboard, pembaca layar, mode gerak dikurangi (`prefers-reduced-motion`), dan layar ponsel (menu geser + tombol bawah).
