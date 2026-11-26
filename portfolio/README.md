# Portofolio — Tio Ilham Wahyudi, S.Pd.

Website portofolio akademik bertema **Premium Academic Sport-Science & Interactive Bento Grid** (light mode, Nordic Academic & Sport-Tech).

**Teknologi:** React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · GSAP 3 + ScrollTrigger (`@gsap/react`) · Lucide Icons · logo merek asli dari Simple Icons.

---

## 1. Menjalankan di komputer

Butuh [Node.js](https://nodejs.org) versi 18 atau lebih baru.

```bash
cd portfolio
npm install
npm run dev          # buka http://localhost:5173
```

## 2. Membuat versi siap-online

```bash
npm run build        # hasil di folder dist/
```

Isi folder `dist/` bisa:

- dibuka langsung dengan klik dua kali `dist/index.html` (tanpa server), atau
- di-upload apa adanya ke Netlify, Vercel, GitHub Pages, cPanel, dsb. Semua path relatif, jadi aman di sub-folder.

## 3. Mengganti konten, foto & link — cukup satu file

Semua teks, foto, sertifikat, dan link sosial ada di **`src/data/portfolio.ts`** → konstanta **`PORTFOLIO_DATA`**.

| Yang ingin diganti | Lokasi di `PORTFOLIO_DATA` |
| --- | --- |
| Foto profil (rasio 4:5) | `profile.portrait.src` |
| Foto kegiatan (ICSDP, Pocari, Papila, SWIPE, forum) | `photos` → setiap foto punya `src`, `thumb`, `alt`, `caption` |
| Urutan & ukuran kotak galeri | `gallery.items` (`span`: `big`, `wide`, `tall`, `normal`) |
| Scan sertifikat | `certificates.featured[n].image` (masih `null` = tampil kartu ringkasan) |
| Link LinkedIn, GitHub, Instagram, Threads, Google Scholar, ORCID | `contact.socials[n].url` (masih `'#'`) |
| Publikasi, abstrak, statistik | `publications` |

**Langkah mengganti foto**

1. Simpan file di `public/images/` (contoh: `public/images/sertifikat-tpon.jpg`).
2. Tulis path **tanpa garis miring di depan**: `src: 'images/sertifikat-tpon.jpg'`.
3. `thumb` opsional (versi kecil agar ringan). Jika tidak ada, hapus barisnya.

Sertifikat yang masih menunggu scan: **TPON (KEMENPORA)**, **Certificate of Presenter ICSDP 2026**, dan **Stadium Generale Universiti Malaya × UPI**.

## 4. Struktur folder

```
portfolio/
├─ public/images/        ← semua foto & scan sertifikat (WebP)
├─ src/
│  ├─ data/portfolio.ts  ← PORTFOLIO_DATA (edit di sini)
│  ├─ data/brandIcons.ts ← logo software & media sosial (SVG)
│  ├─ components/        ← SpotlightCard, MagneticButton, Counter, ParallaxImage,
│  │                       Lightbox, Dialog, TabFilter, StatViz, BrandLogo
│  └─ sections/          ← Nav, Hero, Pillars, Publications, SwipeProject,
│                          SwipeSimulator, Experience, Gallery, Certificates,
│                          Toolkit, Contact, Footer
└─ index.html
```

## 5. Animasi & interaksi

- **GSAP + ScrollTrigger:** entrance hero bertahap, counter angka (IPK 3.83, n = 32, p < 0.001, d = 2.495), parallax foto, reveal 3D saat scroll, garis progres timeline, dan slide horizontal kartu sertifikat.
- **Framer Motion:** `whileHover`/`whileTap` pada kartu Bento, `layoutId` untuk tab filter & menu aktif, `AnimatePresence` untuk dialog, lightbox, menu mobile, dan toast.
- **Komponen interaktif:** spotlight + 3D tilt card, tombol magnetik dengan shimmer, marquee & dock logo, simulator antarmuka SWIPE (stopwatch, lap/flag, nada peluit).
- Pengunjung yang mengaktifkan *reduce motion* di sistemnya otomatis mendapat versi tanpa animasi berat.

## 6. Catatan logo

Logo resmi diambil dari [Simple Icons](https://simpleicons.org) (lisensi CC0) dan tetap merupakan merek dagang pemiliknya. SPSS, Stata, SmartPLS, VOSviewer, Publish or Perish, CapCut, dan Snapseed tidak punya SVG resmi di Simple Icons, jadi ditampilkan dengan badge pengganti sederhana. Ganti di `src/data/brandIcons.ts` bila Anda punya SVG resminya.
