/**
 * Informasi admisi merujuk laman Pendaftaran Mahasiswa Baru SPs UPI.
 * Jadwal gelombang dan biaya dapat berubah; tautan resmi selalu menjadi acuan akhir.
 */
export const admissionSteps = [
  {
    title: 'Pelajari persyaratan',
    text: 'Cermati syarat akademik, administratif, dan ketentuan bahasa Inggris sesuai jenjang yang dituju.',
  },
  {
    title: 'Daftar secara daring',
    text: 'Buat akun dan isi formulir pada portal admisi UPI selama gelombang pendaftaran dibuka.',
  },
  {
    title: 'Lengkapi berkas',
    text: 'Unggah ijazah, transkrip, izin atasan, dan pasfoto. Pelamar doktor menyertakan rencana penelitian.',
  },
  {
    title: 'Ikuti seleksi',
    text: 'Tempuh seleksi masuk yang diselenggarakan Sekolah Pascasarjana sesuai jadwal gelombang.',
  },
  {
    title: 'Registrasi',
    text: 'Setelah dinyatakan lulus, selesaikan registrasi dan mulai perkuliahan pada semester berjalan.',
  },
];

export const requirements = {
  academic: [
    'Calon Magister: berijazah Sarjana (S1) atau sederajat dari prodi dan/atau perguruan tinggi terakreditasi dengan IPK sekurang-kurangnya 2,75 (skala 4,00).',
    'Calon Doktor: berijazah Magister (S2) atau sederajat dari prodi dan/atau perguruan tinggi terakreditasi dengan IPK sekurang-kurangnya 3,00 (skala 4,00).',
    'Ijazah perguruan tinggi luar negeri telah disetarakan oleh kementerian yang berwenang.',
    'Latar belakang pendidikan sebidang bagi peminat program doktor jalur penelitian (by research).',
    'Lulus seleksi masuk yang diselenggarakan Sekolah Pascasarjana.',
  ],
  administrative: [
    'Ijazah dan transkrip pendidikan terakhir yang telah dilegalisasi (pelamar S3: ijazah dan transkrip S1 serta S2).',
    'Pernyataan penugasan atau izin dari atasan tempat bekerja.',
    'Rencana penelitian yang akan dilakukan (khusus pelamar S3).',
    'Pasfoto berwarna ukuran 4×6.',
  ],
};

export const englishScores = [
  { level: 'Magister (S2)', upi: '40', toefl: '500', ielts: '5,5' },
  { level: 'Doktor (S3)', upi: '45', toefl: '525', ielts: '6,0' },
];

export const fees = [
  { level: 'Magister (S2)', amount: 'Rp750.000' },
  { level: 'Doktor (S3)', amount: 'Rp850.000' },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: 'Apa status akreditasi Program Studi Pendidikan Olahraga SPs UPI?',
    a: 'Jenjang Magister (S2) dan Doktor (S3) sama-sama berperingkat Unggul dari Lembaga Akreditasi Mandiri Kependidikan (LAMDIK). Keduanya juga telah menempuh akreditasi internasional AQAS; Portal Kurikulum UPI mencatat predikat jenjang doktor sebagai conditional.',
  },
  {
    q: 'Apa perbedaan jalur Reguler (by course) dan by research?',
    a: 'Jalur Reguler menempuh perkuliahan terstruktur, mata kuliah pilihan sesuai konsentrasi, lalu tugas akhir. Jalur by research memangkas kuliah tatap muka dan mengalihkan bobot studi ke kajian pustaka, seminar instrumen dan analisis data, serta publikasi ilmiah. Untuk jenjang doktor, jalur by research mensyaratkan latar pendidikan sebidang.',
  },
  {
    q: 'Berapa beban studi yang harus ditempuh?',
    a: 'Jenjang Magister memuat 57 sks pada jalur Reguler dan 56 sks pada jalur by research, dengan sebaran empat semester. Jenjang Doktor memuat 53 sks pada kedua jalur, dengan sebaran enam semester.',
  },
  {
    q: 'Apakah lulusan dari bidang yang tidak linear dapat mendaftar?',
    a: 'Dapat. Mahasiswa Magister dengan latar belakang tidak linear menempuh Mata Kuliah Aanvullen (Atletik, Renang, Senam, Beladiri, atau Permainan) yang ditetapkan Ketua Program Studi, sehingga total beban studinya menjadi 65 sks (Reguler) atau 64 sks (by research). Pada jenjang Doktor, total beban studi bagi mahasiswa tidak linear adalah 57 sks.',
  },
  {
    q: 'Konsentrasi keahlian apa saja yang tersedia?',
    a: 'Empat konsentrasi: Pendidikan Jasmani dan Olahraga (PJOr), Pendidikan Kepelatihan Olahraga (PKO), Ilmu Keolahragaan (IKOr), dan Manajemen Olahraga (MOr). Pada jalur Reguler jenjang Magister, mahasiswa memilih dua mata kuliah pilihan dari konsentrasinya.',
  },
  {
    q: 'Apa bentuk tugas akhir di tiap jenjang?',
    a: 'Jenjang Magister ditutup dengan Tesis, Prototipe, atau Proyek Magister, didahului ujian komprehensif. Jenjang Doktor ditutup dengan Disertasi, Prototipe, atau Proyek Doktor, dan lulusannya dituntut memublikasikan dua tulisan pada jurnal ilmiah internasional terindeks.',
  },
  {
    q: 'Berapa skor bahasa Inggris yang dipersyaratkan?',
    a: 'Skor minimal Magister adalah 40 pada Tes Seleksi UPI, TOEFL 500, atau IELTS 5,5. Skor minimal Doktor adalah 45 pada Tes Seleksi UPI, TOEFL 525, atau IELTS 6,0, atau ekuivalensinya. Menurut ketentuan SPs UPI, syarat ini dapat dipenuhi sambil mengikuti perkuliahan.',
  },
  {
    q: 'Bagaimana cara mendaftar dan berapa biayanya?',
    a: 'Pendaftaran dilakukan sepenuhnya secara daring melalui portal admisi UPI pada gelombang yang sedang dibuka. Laman PMB SPs UPI mencantumkan biaya pendaftaran dan seleksi sebesar Rp750.000 untuk Magister dan Rp850.000 untuk Doktor. Rincian biaya pendidikan tersedia pada laman biaya pendidikan UPI.',
  },
  {
    q: 'Ke mana lulusan Prodi ini berkarier?',
    a: 'Lulusan Magister berkiprah sebagai dosen, guru pendidikan jasmani, pelatih di persekolahan maupun perkumpulan, widyaiswara, serta aparatur yang membenahi tata kelola olahraga. Lulusan Doktor berperan sebagai akademisi, peneliti, konsultan, dan pengembang kebijakan pada bidang pendidikan olahraga.',
  },
];
