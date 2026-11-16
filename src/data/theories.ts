/**
 * Pemetaan mata kuliah inti ke teori mapan yang lazim menjadi rujukan di bidangnya.
 * Bersifat orientasi akademik, bukan pengganti RPS resmi mata kuliah.
 */
export type Theory = {
  code: string;
  course: string;
  theory: string;
  summary: string;
  references: string[];
};

export const theories: Theory[] = [
  {
    code: 'OR700',
    course: 'Isu Pedagogi Pendidikan Jasmani dan Olahraga',
    theory: 'Teaching Games for Understanding dan Tactical Games Model',
    summary:
      'Bunker dan Thorpe membalik urutan pembelajaran permainan: pemahaman taktis dan pengambilan keputusan didahulukan, teknik menyusul ketika siswa merasakan kebutuhannya. Gagasan itu berkembang menjadi Tactical Games Model, yang juga menjadi salah satu tema penelitian dosen Prodi.',
    references: [
      'Bunker, D., & Thorpe, R. (1982). A model for the teaching of games in secondary schools. Bulletin of Physical Education, 18(1), 5–8.',
      'Mitchell, S. A., Oslin, J. L., & Griffin, L. L. (2013). Teaching sport concepts and skills: A tactical games approach for ages 7 to 18 (3rd ed.). Human Kinetics.',
    ],
  },
  {
    code: 'OR701',
    course: 'Teori dan Metodologi Pelatihan Olahraga',
    theory: 'Periodisasi latihan',
    summary:
      'Periodisasi membagi tahun latihan ke dalam siklus dengan beban, intensitas, dan pemulihan yang direncanakan, agar puncak performa jatuh pada kompetisi sasaran. Perdebatan antara model tradisional dan periodisasi blok memberi ruang riset yang luas bagi pelatih-peneliti.',
    references: [
      'Bompa, T. O., & Buzzichelli, C. A. (2019). Periodization: Theory and methodology of training (6th ed.). Human Kinetics.',
      'Issurin, V. B. (2010). New horizons for the methodology and physiology of training periodization. Sports Medicine, 40(3), 189–206.',
    ],
  },
  {
    code: 'OR702',
    course: 'Pembelajaran Motorik dan Performa',
    theory: 'Teori skema dan model kendala',
    summary:
      'Teori skema menjelaskan bahwa keterampilan disimpan sebagai aturan umum yang diperkaya oleh variasi latihan, bukan sebagai rekaman gerak tunggal. Model kendala Newell melengkapinya: pola gerak muncul dari interaksi individu, tugas, dan lingkungan.',
    references: [
      'Schmidt, R. A. (1975). A schema theory of discrete motor skill learning. Psychological Review, 82(4), 225–260.',
      'Newell, K. M. (1986). Constraints on the development of coordination. In M. G. Wade & H. T. A. Whiting (Eds.), Motor development in children: Aspects of coordination and control (pp. 341–360). Martinus Nijhoff.',
    ],
  },
  {
    code: 'OR703',
    course: 'Dimensi Fisiologi Olahraga dan Kesehatan',
    theory: 'Hubungan dosis–respons aktivitas fisik',
    summary:
      'Manfaat kesehatan bertambah seiring volume dan intensitas aktivitas fisik. Pedoman WHO 2020 menerjemahkannya menjadi anjuran 150–300 menit aktivitas aerobik intensitas sedang per minggu bagi orang dewasa, dengan pesan kunci bahwa setiap gerak tetap lebih baik daripada tidak sama sekali.',
    references: [
      'Bull, F. C., Al-Ansari, S. S., Biddle, S., et al. (2020). World Health Organization 2020 guidelines on physical activity and sedentary behaviour. British Journal of Sports Medicine, 54(24), 1451–1462.',
    ],
  },
  {
    code: 'OR704',
    course: 'Pengembangan Dimensi Psiko-sosial dalam Olahraga',
    theory: 'Self-Determination Theory dan efikasi diri',
    summary:
      'Motivasi bermutu tumbuh ketika tiga kebutuhan psikologis dasar terpenuhi: otonomi, kompetensi, dan keterhubungan. Bersama konsep efikasi diri dari Bandura, kerangka ini mendasari kajian tentang iklim motivasional, ketangguhan mental, dan latihan keterampilan psikologis.',
    references: [
      'Deci, E. L., & Ryan, R. M. (2000). The “what” and “why” of goal pursuits: Human needs and the self-determination of behavior. Psychological Inquiry, 11(4), 227–268.',
      'Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. Psychological Review, 84(2), 191–215.',
    ],
  },
  {
    code: 'OR705',
    course: 'Olahraga, Pembangunan, dan Kebijakan Olahraga Nasional',
    theory: 'Pembangunan olahraga dan pembangunan melalui olahraga',
    summary:
      'Kebijakan olahraga dapat bertujuan memajukan olahraga itu sendiri atau memakainya sebagai sarana bagi kesehatan, pendidikan, dan kohesi sosial. Pergeseran paradigma inilah yang tertulis eksplisit dalam capaian pembelajaran Prodi, dan menuntut evaluasi dampak yang jujur.',
    references: [
      'Houlihan, B., & White, A. (2002). The politics of sports development: Development of sport or development through sport? Routledge.',
      'Coalter, F. (2007). A wider social role for sport: Who’s keeping the score? Routledge.',
    ],
  },
];
