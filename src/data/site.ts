/**
 * Identitas situs, tautan resmi, dan navigasi.
 * Seluruh fakta di berkas data merujuk laman resmi Prodi (sps.upi.edu/por),
 * laman PMB SPs UPI, dan Portal Kurikulum UPI. Tanggal akses: November 2026.
 */

export const site = {
  shortName: 'Pendidikan Olahraga',
  name: 'Program Studi Pendidikan Olahraga',
  school: 'Sekolah Pascasarjana',
  university: 'Universitas Pendidikan Indonesia',
  universityShort: 'UPI',
  tagline: 'Tempat gerak menjadi ilmu.',
  email: 'pendol_sps@upi.edu',
  instagram: {
    handle: '@porspsupi',
    url: 'https://www.instagram.com/porspsupi/',
  },
  address: {
    building: 'Gedung Sekolah Pascasarjana UPI',
    street: 'Jl. Dr. Setiabudhi No. 229',
    city: 'Bandung',
    postalCode: '40154',
    region: 'Jawa Barat',
    country: 'Indonesia',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sekolah+Pascasarjana+Universitas+Pendidikan+Indonesia',
  },
  links: {
    official: 'https://sps.upi.edu/por/',
    sps: 'https://sps.upi.edu/',
    upi: 'https://www.upi.edu/',
    admisi: 'https://admisi.upi.edu/',
    pmbInfo: 'https://sps.upi.edu/pendaftaran-mahasiswa-baru/',
    biaya: 'https://pmb.upi.edu/biaya_pendidikan',
    kurikulumS2: 'https://kurikulum.upi.edu/struktur/prodi/P136',
    kurikulumS3: 'https://kurikulum.upi.edu/struktur/prodi/P137',
    videoProfil: 'https://www.youtube.com/watch?v=CR2yrJHgwcU',
  },
  dataAccessed: 'November 2026',
} as const;

export type NavItem = { id: string; label: string; index: string };

export const sections: NavItem[] = [
  { id: 'profil', label: 'Profil', index: '01' },
  { id: 'program', label: 'Program', index: '02' },
  { id: 'konsentrasi', label: 'Konsentrasi', index: '03' },
  { id: 'kurikulum', label: 'Kurikulum', index: '04' },
  { id: 'landasan', label: 'Landasan Keilmuan', index: '05' },
  { id: 'dosen', label: 'Dosen', index: '06' },
  { id: 'riset', label: 'Riset', index: '07' },
  { id: 'admisi', label: 'Admisi', index: '08' },
];

export type NavGroup = { label: string; href: string; children?: { label: string; href: string; hint: string }[] };

/** Menu utama, disusun seperti navigasi laman Sekolah Pascasarjana UPI. */
export const navGroups: NavGroup[] = [
  { label: 'Beranda', href: '#beranda' },
  {
    label: 'Profil',
    href: '#profil',
    children: [
      { label: 'Tentang Prodi', href: '#profil', hint: 'Sejarah singkat dan akreditasi' },
      { label: 'Visi & Misi', href: '#visi-misi', hint: 'Arah jenjang Magister dan Doktor' },
    ],
  },
  {
    label: 'Akademik',
    href: '#program',
    children: [
      { label: 'Program & Jalur Studi', href: '#program', hint: 'S2, S3, Reguler, dan by research' },
      { label: 'Konsentrasi Keahlian', href: '#konsentrasi', hint: 'PJOr, PKO, IKOr, dan MOr' },
      { label: 'Kurikulum', href: '#kurikulum', hint: 'Penelusur mata kuliah dan sks' },
      { label: 'Capaian Pembelajaran', href: '#cpl', hint: 'Sikap, pengetahuan, keterampilan' },
      { label: 'Landasan Keilmuan', href: '#landasan', hint: 'Teori dan rujukan primer' },
    ],
  },
  { label: 'Dosen', href: '#dosen' },
  { label: 'Riset', href: '#riset' },
  {
    label: 'Admisi',
    href: '#admisi',
    children: [
      { label: 'Alur Pendaftaran', href: '#admisi', hint: 'Lima langkah mendaftar' },
      { label: 'Persyaratan & Biaya', href: '#persyaratan', hint: 'Syarat, skor bahasa, biaya' },
      { label: 'Tanya Jawab', href: '#faq', hint: 'Pertanyaan yang sering muncul' },
    ],
  },
  { label: 'Kontak', href: '#kontak' },
];

/** Kartu jelajah, padanan kisi "Program Studi" pada laman SPs UPI. */
export const hubCards = [
  { id: 'profil', title: 'Profil Prodi', text: 'Sejarah, akreditasi, dan pengelola program studi.' },
  { id: 'visi-misi', title: 'Visi & Misi', text: 'Arah pengembangan jenjang Magister dan Doktor.' },
  { id: 'program', title: 'Program & Jalur', text: 'Fakta kunci S2 dan S3 serta dua jalur studi.' },
  { id: 'konsentrasi', title: 'Konsentrasi Keahlian', text: 'Empat peminatan beserta mata kuliah pilihannya.' },
  { id: 'kurikulum', title: 'Kurikulum', text: 'Telusuri mata kuliah, bobot sks, dan semester.' },
  { id: 'dosen', title: 'Staf Pengajar', text: 'Sebelas guru besar dan lima doktor.' },
  { id: 'riset', title: 'Riset & Jejaring', text: 'Sorotan penelitian dan agenda internasional.' },
  { id: 'admisi', title: 'Admisi', text: 'Alur pendaftaran, persyaratan, dan biaya.' },
] as const;

export const academicLinks = [
  { label: 'SPOT', href: 'https://spot.upi.edu/' },
  { label: 'SPADA', href: 'https://spada.upi.edu/' },
  { label: 'Portal SIAK Mahasiswa', href: 'https://student.upi.edu/' },
  { label: 'Siptama', href: 'https://siptama-sps.upi.edu/' },
  { label: 'Portal Kurikulum', href: 'https://kurikulum.upi.edu/struktur/prodi/P136' },
  { label: 'Mandala', href: 'https://mandala.upi.edu/' },
];

export const universityLinks = [
  { label: 'Website Utama UPI', href: 'https://www.upi.edu/' },
  { label: 'Sekolah Pascasarjana UPI', href: 'https://sps.upi.edu/' },
  { label: 'Laman Prodi di SPs UPI', href: 'https://sps.upi.edu/por/' },
  { label: 'Penerimaan Mahasiswa Baru', href: 'https://pmb.upi.edu/' },
  { label: 'Perpustakaan', href: 'https://perpustakaan.upi.edu/' },
  { label: 'Portal Jurnal', href: 'https://ejournal.upi.edu/' },
  { label: 'Repository', href: 'http://repository.upi.edu/' },
];
