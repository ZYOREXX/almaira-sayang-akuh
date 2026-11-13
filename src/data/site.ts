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

/** Tautan yang tampil di bilah navigasi desktop (ringkas). */
export const primaryNav = ['profil', 'program', 'kurikulum', 'dosen', 'riset', 'admisi'];

export const heroStats = [
  { value: '1997', label: 'Jenjang Magister berdiri' },
  { value: '2005', label: 'Jenjang Doktor berdiri' },
  { value: 'Unggul', label: 'Peringkat akreditasi LAMDIK' },
  { value: 'AQAS', label: 'Akreditasi internasional' },
  { value: '4', label: 'Konsentrasi keahlian' },
] as const;
