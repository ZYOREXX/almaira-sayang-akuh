export type LevelId = 's2' | 's3';

export const levelLabels: Record<LevelId, { short: string; long: string }> = {
  s2: { short: 'Magister (S2)', long: 'Jenjang Magister' },
  s3: { short: 'Doktor (S3)', long: 'Jenjang Doktor' },
};

export const visionMission: Record<LevelId, { vision: string; missions: string[] }> = {
  s2: {
    vision:
      'Pelopor dan unggul dalam penyelenggaraan pendidikan jenjang Magister Pendidikan Olahraga untuk menghasilkan lulusan yang profesional, berwawasan global, dan berdaya saing internasional pada tahun 2030.',
    missions: [
      'Menyelenggarakan pendidikan dan penelitian untuk menyiapkan tenaga ahli yang profesional dan berwawasan komprehensif dalam bidang pendidikan olahraga, sehingga menjadi warga akademik yang berdaya saing internasional.',
      'Menyelenggarakan layanan pengabdian kepada masyarakat secara profesional dalam rangka ikut serta memecahkan masalah keolahragaan nasional.',
      'Menyebarluaskan ilmu dalam bidang pendidikan olahraga melalui pengembangan dan pengokohan jejaring serta kemitraan pada tingkat nasional, regional, dan internasional.',
    ],
  },
  s3: {
    vision:
      'Pelopor dan unggul dalam penyelenggaraan pendidikan jenjang Doktor Pendidikan Olahraga untuk menghasilkan lulusan yang profesional, berwawasan global, dan berdaya saing internasional pada tahun 2030.',
    missions: [
      'Menyelenggarakan pendidikan dan penelitian untuk menyiapkan tenaga ahli profesional yang berwawasan komprehensif dalam bidang pendidikan olahraga sehingga berdaya saing internasional.',
      'Menyelenggarakan layanan pengabdian kepada masyarakat secara profesional dalam rangka ikut serta paling depan dalam memecahkan masalah keolahragaan nasional.',
      'Menyebarluaskan ilmu dalam bidang pendidikan olahraga melalui pengembangan dan pengokohan jejaring serta kemitraan pada tingkat nasional, regional, dan internasional.',
    ],
  },
};

export const pillars = [
  {
    term: 'Pelopor',
    meaning:
      'Menempatkan diri sebagai program studi perintis dan terdepan dalam bidang pendidikan olahraga, sehingga lulusannya profesional dan berwawasan global.',
  },
  {
    term: 'Unggul',
    meaning:
      'Kompetitif, responsif, dan terus meningkatkan kualitas (continuous quality improvement) sehingga berdaya saing internasional.',
  },
];

export type Program = {
  id: LevelId;
  degree: string;
  title: string;
  summary: string;
  facts: { label: string; value: string; note?: string }[];
  graduates: string;
  curriculumUrl: string;
};

export const programs: Program[] = [
  {
    id: 's2',
    degree: 'S2',
    title: 'Magister Pendidikan Olahraga',
    summary:
      'Memperdalam landasan pedagogi, kepelatihan, dan sains olahraga, lalu menajamkannya lewat satu konsentrasi keahlian dan tugas akhir berbasis penelitian.',
    facts: [
      { label: 'Berdiri', value: '1997' },
      { label: 'Akreditasi', value: 'Unggul', note: 'LAMDIK · AQAS (internasional)' },
      { label: 'Beban studi', value: '57 sks', note: 'Reguler · 56 sks by research' },
      { label: 'Sebaran kuliah', value: '4', note: 'semester' },
      { label: 'Tugas akhir', value: 'Tesis', note: 'atau Prototipe / Proyek Magister' },
      { label: 'Keketatan seleksi', value: '1 : 5' },
    ],
    graduates:
      'Tenaga ahli dan calon pendidik (dosen, guru, supervisor, widyaiswara) dalam pendidikan jasmani dan olahraga, kepelatihan olahraga, ilmu keolahragaan, serta manajemen olahraga.',
    curriculumUrl: 'https://kurikulum.upi.edu/struktur/prodi/P136',
  },
  {
    id: 's3',
    degree: 'S3',
    title: 'Doktor Pendidikan Olahraga',
    summary:
      'Menuntut kebaruan ilmiah: dari filsafat pendidikan jasmani dan kebijakan olahraga hingga disertasi dan publikasi pada jurnal internasional bereputasi.',
    facts: [
      { label: 'Berdiri', value: '2005' },
      { label: 'Akreditasi', value: 'Unggul', note: 'LAMDIK · AQAS (conditional)' },
      { label: 'Beban studi', value: '53 sks', note: 'Reguler maupun by research' },
      { label: 'Sebaran kuliah', value: '6', note: 'semester' },
      { label: 'Tugas akhir', value: 'Disertasi', note: 'atau Prototipe / Proyek Doktor' },
      { label: 'Keketatan seleksi', value: '1 : 3' },
    ],
    graduates: 'Akademisi, ahli, peneliti, konsultan, dan pembaharu atau pengembang pada bidang pendidikan olahraga.',
    curriculumUrl: 'https://kurikulum.upi.edu/struktur/prodi/P137',
  },
];

export const pathways = [
  {
    id: 'course',
    name: 'Reguler',
    alias: 'by course',
    description:
      'Perkuliahan terstruktur pada kelompok pengembangan akademik dan keahlian bidang studi, dilanjutkan mata kuliah pilihan sesuai konsentrasi, lalu ditutup dengan tugas akhir.',
    points: [
      'Seluruh mata kuliah inti keahlian bidang studi wajib ditempuh',
      'Dua mata kuliah pilihan sesuai konsentrasi keahlian',
      'Ujian komprehensif dan ujian tugas akhir',
    ],
  },
  {
    id: 'research',
    name: 'By research',
    alias: 'jalur penelitian',
    description:
      'Beban kuliah tatap muka lebih ramping. Bobot studi dialihkan ke kajian pustaka, seminar instrumen dan analisis data, serta publikasi ilmiah sejak semester awal.',
    points: [
      'Kajian pustaka dan seminar penelitian bernilai sks',
      'Publikasi ilmiah menjadi bagian dari beban studi',
      'Jenjang doktor mensyaratkan latar pendidikan sebidang',
    ],
  },
] as const;

export type Concentration = {
  id: string;
  abbr: string;
  name: string;
  focus: string;
  description: string;
  courses: string[];
  note?: string;
};

export const concentrations: Concentration[] = [
  {
    id: 'pjor',
    abbr: 'PJOr',
    name: 'Pendidikan Jasmani dan Olahraga',
    focus: 'Kurikulum, pembelajaran, dan evaluasi di persekolahan',
    description:
      'Untuk guru, dosen, dan pengembang kurikulum yang ingin menguji praktik mengajarnya dengan teori dan data. Kajiannya merentang dari model kurikulum dan evaluasi autentik hingga pendidikan jasmani adaptif dan nilai-nilai Olimpisme.',
    courses: [
      'Model-model Kurikulum dalam Pendidikan Jasmani, Olahraga, dan Kesehatan',
      'Evaluasi Autentik dalam Pendidikan Jasmani dan Olahraga',
      'Pengembangan Keterampilan Mengajar PJOK',
      'Pertumbuhan, Perkembangan, dan Aktivitas Fisik',
      'Pendidikan Jasmani Adaptif',
      'Olympism, Olympic Movement, dan Nilai-nilai Universal Olahraga',
      'Outdoor Education',
      'Manajemen Pembinaan dan Pengembangan Olahraga Pendidikan',
    ],
  },
  {
    id: 'pko',
    abbr: 'PKO',
    name: 'Pendidikan Kepelatihan Olahraga',
    focus: 'Program latihan, performa, dan pembinaan atlet',
    description:
      'Untuk pelatih dan pembina yang merancang latihan berbasis bukti. Mahasiswa menelaah program latihan atlet elit, pengembangan kondisi fisik, analisis performa, gizi, serta identifikasi dan pengembangan bakat.',
    courses: [
      'Pengembangan Program Latihan Atlet Elit',
      'Analisis Performa Olahraga',
      'Pengembangan Latihan Kondisi Fisik (Strength and Conditioning)',
      'Ilmu Gizi dan Performa Olahraga',
      'Identifikasi dan Pengembangan Keberbakatan Olahraga',
      'Jender dan Olahraga',
      'Tata Kelola Olahraga (Sport Governance)',
      'Olympism, Olympic Movement, dan Nilai-nilai Universal Olahraga',
    ],
  },
  {
    id: 'ikor',
    abbr: 'IKOr',
    name: 'Ilmu Keolahragaan',
    focus: 'Sains performa, kesehatan, dan aktivitas jasmani',
    description:
      'Untuk peneliti dan praktisi yang mendekati olahraga sebagai sains terapan. Perkuliahan mencakup analisis digital performa, pengukuran biomotorik, kesehatan olahraga, hingga aktivitas jasmani bagi masyarakat dan lanjut usia.',
    courses: [
      'Analisis Digital Performa Olahraga',
      'Pengukuran Biomotorik Atlet',
      'Ilmu Gizi dan Performa Olahraga',
      'Ilmu Kesehatan Olahraga',
      'Aktivitas Jasmani dan Kesehatan',
      'Pengembangan dan Manajemen Olahraga Masyarakat',
      'Outdoor Education',
      'Olahraga Lanjut Usia',
    ],
  },
  {
    id: 'mor',
    abbr: 'MOr',
    name: 'Manajemen Olahraga',
    focus: 'Tata kelola, pembiayaan, dan kebijakan',
    description:
      'Untuk pengelola organisasi dan aparatur yang menata sistem keolahragaan. Kajiannya meliputi manajemen dan pembiayaan olahraga, kepemimpinan dan politik, dimensi sosio-kultural, serta olahraga di tengah globalisasi.',
    courses: [
      'Manajemen Pembiayaan dalam Pengembangan Olahraga',
      'Manajemen Olahraga (Sport Management)',
      'Globalisasi dan Olahraga',
      'Dimensi Sosio-kultural dalam Olahraga',
      'Olahraga, Kepemimpinan, dan Politik',
      'Pengembangan Olahraga di Masyarakat',
      'Tata Kelola Olahraga (Sport Governance)',
      'Outdoor Education',
    ],
    note: 'Dokumen visi Prodi mencatat bahwa konsentrasi ini akan beralih ke Program Studi Kebijakan Olahraga, Manajemen, dan Pengembangan Internasional setelah program tersebut resmi diselenggarakan di SPs UPI.',
  },
];
