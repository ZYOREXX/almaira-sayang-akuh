# Portofolio — Tio Ilham Wahyudi, S.Pd.

Website portofolio akademik bertema **Premium Academic Sport-Science & Interactive Bento Grid** (light mode, Nordic Academic & Sport-Tech).

**Teknologi:** React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · GSAP 3 + ScrollTrigger (`@gsap/react`) · Lucide Icons · logo merek asli dari Simple Icons.

**Font:** Plus Jakarta Sans (judul), Montserrat (label), Inter (teks) — semuanya dari Google Fonts.

**Struktur halaman:** `#home` Hero · `#about` About & software stack · `#experience` Experience & leadership · `#works` Selected works (data asli dari abstrak ICSDP 2026 & artikel Jurnal Porkes 2025) · `#achievements` 12 kartu prestasi & sertifikat · `#contact` Kontak + signature footer.

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
| Foto hero (rasio 4:5) | `hero.portrait.src` |
| Foto di section About | `about.photo.src` |
| Foto kegiatan (ICSDP, Pocari, Papila, SWIPE, forum) | `photos` → `src`, `thumb`, `alt`, `caption` |
| Data penelitian & modal abstrak | `works` |
| 12 kartu prestasi / sertifikat | `achievements` (`visual`: `scan`, `photo`, atau `emblem`) |
| Link LinkedIn, GitHub, Instagram, Threads, Google Scholar, ORCID | `contact.socials[n].url` (masih `'#'`) |

**Langkah mengganti foto**

1. Simpan file di `public/images/` (contoh: `public/images/foto-baru.jpg`).
2. Tulis path **tanpa garis miring di depan**: `src: 'images/foto-baru.jpg'`.
3. `thumb` opsional (versi kecil agar ringan). Jika tidak ada, hapus barisnya.

Kartu tanpa scan (`visual: { kind: 'emblem' }`): *Guest Lecture 2024 (FPOK UPI)* dan *Cum Laude Graduate*. Ganti dengan `kind: 'scan'` bila scan tersedia.

## 4. Struktur folder

```
portfolio/
├─ public/images/        ← semua foto & scan sertifikat (WebP)
├─ src/
│  ├─ data/portfolio.ts  ← PORTFOLIO_DATA (edit di sini)
│  ├─ data/brandIcons.ts ← logo software & media sosial (SVG)
│  ├─ components/        ← SpotlightCard, MagneticButton, Counter, WordFill,
│  │                       LogoDock, MetricCard, Lightbox, Dialog, StatViz, BrandLogo
│  └─ sections/          ← Nav, Hero, About, Experience, Works, WorkDetail,
│                          SwipeSimulator, Achievements, Contact, Footer
└─ index.html
```

## 5. Animasi & interaksi

- **GSAP + ScrollTrigger:** hero masuk bertahap lalu "mundur" saat di-scroll, kalimat About terisi kata demi kata mengikuti scroll, tumpukan kartu Works naik saat masuk layar, counter angka, reveal 3D bertahap, dan tanda tangan nama di footer.
- **Framer Motion:** pill hero melayang, navbar kapsul dengan indikator `layoutId`, tumpukan kartu Works yang berganti urutan, `AnimatePresence` untuk modal, lightbox, dan menu mobile, serta `whileHover`/`whileTap` pada kartu.
- **Interaksi lain:** kartu spotlight + 3D tilt, tombol magnetik, dock logo, dan simulator antarmuka SWIPE di modal proyek.
- Pengunjung yang mengaktifkan *reduce motion* otomatis mendapat versi tanpa animasi berat.

## 6. Catatan logo

Logo resmi diambil dari [Simple Icons](https://simpleicons.org) (lisensi CC0) dan tetap merupakan merek dagang pemiliknya. SPSS, Stata, SmartPLS, VOSviewer, Publish or Perish, CapCut, dan Snapseed tidak punya SVG resmi di Simple Icons, jadi ditampilkan dengan badge pengganti sederhana. Ganti di `src/data/brandIcons.ts` bila Anda punya SVG resminya.
