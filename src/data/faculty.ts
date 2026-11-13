/**
 * Staf pengajar sebagaimana tercantum pada laman resmi Prodi (sps.upi.edu/por).
 * `core` = nama tanpa gelar, dipakai untuk monogram dan penelusuran publikasi.
 */
export type Lecturer = {
  name: string;
  core: string;
  rank: 'profesor' | 'doktor';
  role: string;
};

export const faculty: Lecturer[] = [
  { name: 'Prof. Dr. Sucipto, M.Kes., AIFO.', core: 'Sucipto', rank: 'profesor', role: 'Ketua Program Studi' },
  { name: 'Prof. Dr. H. Amung Ma’mun, M.Pd.', core: 'Amung Ma’mun', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Adang Suherman, M.A.', core: 'Adang Suherman', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. H. Herman Subarjah, M.Si.', core: 'Herman Subarjah', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Yudy Hendrayana, M.Kes.', core: 'Yudy Hendrayana', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Berliana, M.Pd.', core: 'Berliana', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Nina Sutresna, M.Pd.', core: 'Nina Sutresna', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Yusuf Hidayat, S.Pd., M.Si.', core: 'Yusuf Hidayat', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Boyke Mulyana, M.Pd.', core: 'Boyke Mulyana', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Komarudin, M.Pd.', core: 'Komarudin', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Prof. Dr. Tite Juliantine, M.Pd.', core: 'Tite Juliantine', rank: 'profesor', role: 'Dosen Pengajar' },
  { name: 'Dr. Agus Mahendra, M.A.', core: 'Agus Mahendra', rank: 'doktor', role: 'Dosen Pengajar' },
  { name: 'Dr. Bambang Abdul Jabar, M.Pd.', core: 'Bambang Abdul Jabar', rank: 'doktor', role: 'Dosen Pengajar' },
  { name: 'Dr. Dikdik Zafar Sidik, M.Pd.', core: 'Dikdik Zafar Sidik', rank: 'doktor', role: 'Dosen Pengajar' },
  { name: 'Dr. Nuryadi, M.Pd.', core: 'Nuryadi', rank: 'doktor', role: 'Dosen Pengajar' },
  {
    name: 'Dr. Sandey Tantra Paramitha, M.Pd.',
    core: 'Sandey Tantra Paramitha',
    rank: 'doktor',
    role: 'Dosen Pengajar',
  },
];

export const chair = faculty[0];

export function monogram(core: string): string {
  const parts = core.replace(/[’']/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function scholarUrl(core: string): string {
  const query = `author:"${core.replace(/’/g, "'")}" "Universitas Pendidikan Indonesia"`;
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}
