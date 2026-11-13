# Pascasarjana Pendidikan Olahraga UPI

Website akademik Program Studi Pendidikan Olahraga jenjang Magister (S2) dan Doktor (S3),
Sekolah Pascasarjana Universitas Pendidikan Indonesia. Satu halaman panjang yang memuat
profil, visi dan misi, program, konsentrasi keahlian, penelusur kurikulum, capaian
pembelajaran, landasan keilmuan, staf pengajar, riset, dan informasi admisi.

## Sekilas

- **Konsep visual "lintasan":** garis lintasan atletik 400 m menjadi motif utama, dari
  ilustrasi hero hingga penomoran bagian 01 sampai 08.
- **Tipografi:** Cormorant Garamond untuk judul dan Plus Jakarta Sans untuk teks, keduanya
  dihos sendiri (tanpa permintaan ke pihak ketiga).
- **Interaktif:** tab jenjang, penelusur kurikulum dengan pencarian, saringan dosen,
  akordeon tanya jawab, menu seluler layar penuh, dan garis kemajuan baca.
- **SEO:** HTML diprerender saat build, lengkap dengan meta Open Graph, data terstruktur
  schema.org (organisasi, program, FAQ), `robots.txt`, dan `sitemap.xml`.
- **Aksesibilitas:** struktur judul berurutan, navigasi papan ketik, tautan lompat ke
  konten, dan dukungan `prefers-reduced-motion`.

## Teknologi

React 19, TypeScript, Vite 6, dan Tailwind CSS 4. Tidak ada backend; hasil build berupa
berkas statis di folder `dist/`.

## Menjalankan di komputer sendiri

Prasyarat: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # server pengembangan di http://localhost:3000
```

## Build dan pemasangan

```bash
SITE_URL="https://alamat-situs-anda" npm run build
npm run preview    # meninjau hasil build di http://localhost:4173
```

`SITE_URL` bersifat opsional. Bila diisi, build menulis canonical URL, `og:url`, alamat
absolut gambar pratinjau, serta `sitemap.xml`. Unggah isi folder `dist/` ke layanan hosting
statis mana pun (Vercel, Netlify, GitHub Pages, atau server kampus). Seluruh aset dirujuk
secara relatif, sehingga situs juga berjalan di dalam sub-folder.

| Perintah          | Fungsi                                                     |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Server pengembangan dengan pemuatan ulang otomatis         |
| `npm run build`   | Build klien, build SSR, lalu prerender ke `dist/`          |
| `npm run preview` | Menyajikan folder `dist/` untuk pemeriksaan akhir          |
| `npm run lint`    | Pemeriksaan tipe TypeScript                                |

## Memperbarui konten

Seluruh isi halaman disimpan terpisah dari tampilan, di folder `src/data/`:

| Berkas          | Isi                                                          |
| --------------- | ------------------------------------------------------------ |
| `site.ts`       | Identitas, kontak, tautan resmi, navigasi, angka pada hero   |
| `programs.ts`   | Visi dan misi, fakta jenjang, jalur studi, konsentrasi       |
| `curriculum.ts` | Struktur kurikulum S2 dan S3 beserta bobot sks               |
| `outcomes.ts`   | Capaian Pembelajaran Lulusan                                 |
| `theories.ts`   | Pemetaan mata kuliah inti ke teori dan rujukannya            |
| `faculty.ts`    | Staf pengajar                                                |
| `research.ts`   | Sorotan penelitian, ranah kajian, agenda internasional       |
| `admission.ts`  | Alur pendaftaran, persyaratan, skor bahasa, biaya, FAQ       |

Mengubah berkas-berkas tersebut sudah cukup untuk memperbarui halaman, data terstruktur,
dan hasil pencarian kurikulum.

## Sumber data

Fakta pada situs dihimpun pada November 2026 dari laman resmi berikut:

- Laman Prodi di SPs UPI: <https://sps.upi.edu/por/>
- Informasi PMB SPs UPI: <https://sps.upi.edu/pendaftaran-mahasiswa-baru/>
- Portal Kurikulum UPI: <https://kurikulum.upi.edu/struktur/prodi/P136> (S2) dan
  <https://kurikulum.upi.edu/struktur/prodi/P137> (S3)

## Catatan sebelum dipublikasikan

- **Verifikasi data.** Biaya, jadwal gelombang, dan struktur kurikulum dapat berubah.
  Mohon dicocokkan kembali dengan pengelola Prodi sebelum situs dirilis.
- **Logo.** Lambang pada situs adalah ilustrasi lintasan atletik, bukan logo resmi UPI.
  Ganti komponen `src/components/ui/Emblem.tsx` bila logo resmi boleh digunakan.
- **Gelar dosen.** Nama dan gelar mengikuti laman resmi Prodi; koreksi dapat dilakukan
  di `src/data/faculty.ts`.
- **Landasan keilmuan.** Pemetaan teori pada bagian 05 bersifat orientasi akademik dan
  bukan pengganti RPS mata kuliah.
