# Papila Swim — Website

Website statis (HTML + CSS + JavaScript murni, tanpa build) untuk **Papila Swimming School**.

## Halaman
| File | Isi |
|---|---|
| `index.html` | Landing: hero slider, tentang, statistik, layanan, tim, galeri, berita, kontak |
| `tentang.html` | Tentang Kami + statistik + tab layanan (lokasi kolam & program) |
| `tim.html` | Tim pelatih & staf |
| `berita.html` | Daftar berita dengan pencarian, tag, dan pagination |
| `galeri.html` | Galeri dengan filter kategori + lightbox |

## Cara revisi konten
Semua teks, angka, kontak, lokasi kolam, program, tim, galeri, dan berita ada di **`js/data.js`**.
Cukup edit file itu, tidak perlu menyentuh HTML.

Foto: taruh gambar di `assets/img/`, lalu isi properti `img` di `data.js`
(contoh: `img: "assets/img/coach-1.jpg"`). Bila `img` kosong, tampil placeholder biru.

## Menjalankan
Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
cd papila-swim
python3 -m http.server 8000
# buka http://localhost:8000
```

Formulir kontak saat ini meneruskan pesan ke WhatsApp (nomor di `data.js`). Login masih tampilan demo.
