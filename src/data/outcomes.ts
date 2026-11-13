import type { LevelId } from './programs';

/** Capaian Pembelajaran Lulusan (CPL) sebagaimana dimuat pada laman resmi Prodi. */
export type OutcomeCategory = {
  id: 'sikap' | 'pengetahuan' | 'umum' | 'khusus';
  label: string;
  items: { code: string; text: string }[];
};

const sikapBersama = [
  'Bertakwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius.',
  'Menjunjung tinggi nilai kemanusiaan dalam menjalankan tugas berdasarkan agama, moral, dan etika.',
  'Berkontribusi dalam peningkatan mutu kehidupan bermasyarakat, berbangsa, bernegara, dan kemajuan peradaban berdasarkan Pancasila.',
  'Berperan sebagai warga negara yang bangga dan cinta tanah air, memiliki nasionalisme serta rasa tanggung jawab pada negara dan bangsa.',
  'Menghargai keanekaragaman budaya, pandangan, agama, dan kepercayaan, serta pendapat atau temuan orisinal orang lain.',
  'Bekerja sama dan memiliki kepekaan sosial serta kepedulian terhadap masyarakat dan lingkungan.',
  'Taat hukum dan disiplin dalam kehidupan bermasyarakat dan bernegara.',
  'Menginternalisasi nilai, norma, dan etika akademik.',
  'Menunjukkan sikap bertanggung jawab atas pekerjaan di bidang keahliannya secara mandiri.',
  'Menginternalisasi semangat kemandirian, kejuangan, dan kewirausahaan.',
];

const withCodes = (prefix: string, texts: string[]) => texts.map((text, i) => ({ code: `${prefix}${i + 1}`, text }));

export const outcomes: Record<LevelId, OutcomeCategory[]> = {
  s2: [
    {
      id: 'khusus',
      label: 'Keterampilan Khusus',
      items: withCodes('KK', [
        'Mampu mengembangkan pengetahuan, teknologi, dan/atau seni dalam pendidikan olahraga melalui penelitian dengan hasil yang inovatif, kreatif, dan teruji.',
        'Mampu mengidentifikasi dan memecahkan masalah pendidikan olahraga dalam hal pembelajaran, pembinaan, dan pengembangan dengan pendekatan inter/multidisipliner.',
        'Mampu melaksanakan penelitian pendidikan olahraga untuk mengembangkan ilmu pengetahuan dan teknologi, baik dengan metode kualitatif, kuantitatif, maupun metode lain, dengan hasil yang inovatif dan teruji.',
        'Mampu menerapkan konsep dan teori keilmuan yang mendukung pendidikan olahraga di lingkungan persekolahan dan/atau masyarakat, seiring pergeseran paradigma dari pembangunan olahraga menjadi pembangunan melalui olahraga.',
        'Mampu memublikasikan karya tulis ilmiah pada level nasional maupun internasional dalam bidang pendidikan olahraga.',
      ]),
    },
    {
      id: 'pengetahuan',
      label: 'Pengetahuan',
      items: withCodes('P', [
        'Menguasai filsafat pendidikan, teori, dan implementasinya dalam bidang pendidikan olahraga.',
        'Menguasai metodologi penelitian dalam pendidikan olahraga, baik dalam perspektif kualitatif, kuantitatif, maupun jenis penelitian lainnya.',
        'Menguasai berbagai alternatif pemecahan masalah dalam pendidikan olahraga, menyangkut metode, model, dan gaya mengajar, keterbatasan sarana dan prasarana, maupun kondisi peserta didik, dengan pendekatan inter/multidisipliner.',
        'Menguasai pedagogi dan ilmu olahraga yang berkemajuan untuk mengembangkan ruang lingkup olahraga: olahraga pendidikan, olahraga rekreasi/masyarakat, olahraga prestasi, olahraga disabilitas, dan industri olahraga.',
        'Menguasai konsep dan teori keilmuan yang mendukung pendidikan olahraga dalam menerapkan pengembangan olahraga di lingkungan persekolahan dan/atau masyarakat.',
      ]),
    },
    {
      id: 'umum',
      label: 'Keterampilan Umum',
      items: withCodes('KU', [
        'Mampu mengembangkan pemikiran logis, kritis, sistematis, dan kreatif dalam penerapan teknologi yang memperhatikan nilai humaniora, serta menyusun konsepsi ilmiah berdasarkan kaidah, tata cara, dan etika ilmiah dalam bentuk tesis atau bentuk lain yang setara.',
        'Mampu melakukan validasi akademik atau kajian sesuai bidang keahliannya dalam menyelesaikan masalah di masyarakat atau industri yang relevan.',
        'Mampu menyusun ide, pemikiran, dan argumen teknis secara bertanggung jawab berdasarkan etika akademik, serta mengomunikasikannya kepada masyarakat akademik dan masyarakat luas.',
        'Mampu mengidentifikasi bidang keilmuan yang menjadi objek penelitiannya dan memosisikannya ke dalam skema penyelesaian masalah yang lebih menyeluruh dan bersifat interdisiplin atau multidisiplin.',
        'Mampu mengambil keputusan dalam penyelesaian masalah penerapan teknologi berdasarkan kajian eksperimental terhadap informasi dan data.',
        'Mampu mengelola, mengembangkan, dan meningkatkan mutu kerja sama di lembaganya maupun lembaga lain, dengan mengutamakan kualitas hasil dan ketepatan waktu.',
        'Mampu meningkatkan kapasitas pembelajaran secara mandiri.',
        'Mampu mendokumentasikan, menyimpan, mengamankan, dan menemukan kembali data hasil karya untuk menjamin kesahihan dan mencegah plagiasi.',
      ]),
    },
    {
      id: 'sikap',
      label: 'Sikap',
      items: withCodes('S', [
        ...sikapBersama,
        'Bersikap dan berperilaku ilmiah, edukatif, dan religius.',
        'Silih asih, silih asah, silih asuh dalam lingkungan kerja dan kehidupan bermasyarakat yang memiliki keunggulan kompetitif dan komparatif global.',
      ]),
    },
  ],
  s3: [
    {
      id: 'khusus',
      label: 'Keterampilan Khusus',
      items: withCodes('KK', [
        'Mampu mengkaji konsep-konsep pedagogi olahraga dan ilmu keolahragaan secara luas dan mendalam melalui pendekatan inter/multidisipliner.',
        'Mampu mengembangkan penelitian dengan penguasaan metodologi dalam bidang pendidikan olahraga secara kreatif, inovatif, dan berkebaruan.',
        'Mampu memecahkan isu-isu pendidikan olahraga melalui penelitian untuk memengaruhi kebijakan olahraga nasional dalam pembinaan dan pengembangan olahraga pendidikan, olahraga rekreasi/masyarakat, dan olahraga prestasi.',
        'Mampu menuangkan gagasan dan hasil karya penelitian dalam artikel ilmiah yang diterbitkan pada jurnal terindeks, nasional maupun internasional.',
        'Mampu memanfaatkan bidang olahraga sebagai instrumen pembangunan untuk meningkatkan kualitas hidup masyarakat yang sehat, maju, dan berbudaya.',
        'Mampu menginspirasi kebijakan dalam mengembangkan sistem pembinaan dan pengembangan olahraga pendidikan, olahraga rekreasi, maupun olahraga prestasi.',
        'Mampu merespons isu-isu global dalam memecahkan permasalahan pembinaan dan pengembangan olahraga di lingkungan persekolahan, perguruan tinggi, dan masyarakat.',
      ]),
    },
    {
      id: 'pengetahuan',
      label: 'Pengetahuan',
      items: withCodes('P', [
        'Menguasai kerangka filosofis pedagogi olahraga sebagai dasar implementasi pendidikan olahraga, khususnya dalam pengembangan pendidikan jasmani dan olahraga sekolah serta pendidikan kepelatihan olahraga.',
        'Menguasai filosofi metodologi penelitian dalam pendidikan olahraga yang menjadi landasan pengembangan ilmu keolahragaan.',
        'Menguasai prinsip-prinsip filosofis perencanaan, pengelolaan, serta evaluasi pendidikan olahraga yang juga dapat diterapkan untuk meningkatkan mutu manajemen olahraga.',
        'Menguasai filosofi dan konsep pembangunan olahraga serta mampu menghubungkannya dengan para pengambil keputusan agar menjadi kebijakan peningkatan mutu pembinaan dan pengembangan olahraga.',
        'Menguasai perjalanan historis kebijakan pembangunan olahraga nasional sebagai dasar perencanaan pembangunan olahraga yang berkemajuan.',
        'Menguasai teori dan kaidah pelatihan olahraga tingkat tinggi untuk diimplementasikan dalam meningkatkan performa olahraga.',
        'Menguasai dan peka terhadap isu-isu sensitif secara global dalam mengimplementasikan pembangunan melalui olahraga.',
      ]),
    },
    {
      id: 'umum',
      label: 'Keterampilan Umum',
      items: withCodes('KU', [
        'Mampu menemukan, menciptakan, dan memberikan kontribusi pada pengembangan serta pengamalan ilmu pengetahuan dan/atau teknologi yang memperhatikan nilai humaniora, berdasarkan pemikiran logis, kritis, kreatif, dan arif.',
        'Mampu menyusun konsepsi ilmiah dan hasil kajian dalam bentuk disertasi, serta memublikasikan dua tulisan pada jurnal ilmiah internasional terindeks dengan memperhatikan aspek legal hasil penelitiannya.',
        'Mampu memilih penelitian yang tepat guna, terkini, dan termaju serta memberikan kemaslahatan bagi umat manusia melalui pendekatan interdisiplin, multidisiplin, atau transdisiplin.',
        'Mampu mengembangkan strategi pengembangan teknologi atau seni dengan pendekatan interdisiplin, multidisiplin, atau transdisiplin berdasarkan kajian tentang sasaran pokok penelitian.',
        'Mampu menyusun argumen dan solusi keilmuan berdasarkan pandangan kritis atas fakta, konsep, prinsip, atau teori yang dapat dipertanggungjawabkan secara ilmiah dan etika akademik, serta mengomunikasikannya kepada masyarakat.',
        'Mampu menunjukkan kepemimpinan akademik dalam pengelolaan, pengembangan, dan pembinaan sumber daya serta organisasi yang berada di bawah tanggung jawabnya.',
        'Mampu mengelola, termasuk menyimpan, mengaudit, mengamankan, dan menemukan kembali data dan informasi hasil penelitian yang berada di bawah tanggung jawabnya.',
        'Mampu mengembangkan dan memelihara hubungan kolegial dan kesejawatan di lingkungan sendiri atau melalui jaringan kerja sama dengan komunitas peneliti di luar lembaga.',
      ]),
    },
    {
      id: 'sikap',
      label: 'Sikap',
      items: withCodes('S', sikapBersama),
    },
  ],
};
