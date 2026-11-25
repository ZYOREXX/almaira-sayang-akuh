/* =========================================================================
   PAPILA SWIM — DATA SITUS
   -------------------------------------------------------------------------
   Semua isi website diambil dari file ini. Cukup edit teks di bawah,
   simpan, lalu muat ulang halaman. Tidak perlu menyentuh HTML/CSS/JS.

   CATATAN
   • Semua data di bawah masih CONTOH (dummy) dan perlu diganti.
   • Foto: simpan gambar di folder assets/img/, lalu isi properti `img`,
     misalnya img: "assets/img/kolam-1.jpg". Jika kosong, tampil ilustrasi.
   • Teks yang diapit bintang, misalnya "Berenang dengan *aman*",
     akan ditampilkan dengan sorotan warna.
   • Bagian yang daftarnya dikosongkan (mis. testimonials: []) otomatis
     disembunyikan dari halaman.
   ========================================================================= */

window.SITE = {
  /* ---------------------------------------------------------------------
     IDENTITAS & KONTAK
     --------------------------------------------------------------------- */
  brand: {
    name: "Papila Swim",
    fullName: "Papila Swimming School",
    tagline: "PAPILA SWIM — SWIMMING SCHOOL",
    slogan: "Belajar renang yang aman, menyenangkan, dan terukur untuk semua usia.",
    phone: "+62 812-0000-0000",
    whatsapp: "6281200000000", // format internasional tanpa +, spasi, atau tanda hubung
    email: "halo@papilaswim.com",
    address: "Jl. Contoh No. 10, Kota A, Indonesia",
    mapsQuery: "Kota A, Indonesia", // teks pencarian untuk tombol "Buka di Google Maps"
    hours: [
      { day: "Senin – Jumat", time: "14.00 – 19.00" },
      { day: "Sabtu – Minggu", time: "07.00 – 15.00" }
    ],
    socials: {
      // kosongkan ("") untuk menyembunyikan ikon
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
      youtube: "https://youtube.com/",
      facebook: "https://facebook.com/"
    },
    copyright: "Papila Swim"
  },

  /* ---------------------------------------------------------------------
     HERO (slider paling atas di beranda)
     --------------------------------------------------------------------- */
  hero: {
    interval: 7, // detik per slide
    slides: [
      {
        kicker: "Pendaftaran siswa baru dibuka",
        title: "Berenang dengan *aman*, tumbuh dengan percaya diri",
        text: "Kelas renang bertahap untuk bayi, anak, remaja, hingga dewasa. Dibimbing pelatih profesional dengan kurikulum yang terukur.",
        img: ""
      },
      {
        kicker: "Pelatih bersertifikat",
        title: "Pelatih yang *sabar* dan berpengalaman",
        text: "Metode mengajar yang komunikatif dan ramah anak, sehingga setiap siswa belajar teknik yang benar tanpa rasa takut.",
        img: ""
      },
      {
        kicker: "Untuk semua usia",
        title: "Dari *bayi* hingga dewasa, ada kelasnya",
        text: "Mulai dari Baby Swim usia 3 bulan sampai kelas dewasa dan persiapan atlet. Pilih program yang paling cocok.",
        img: ""
      },
      {
        kicker: "Banyak pilihan lokasi",
        title: "Pilih *kolam terdekat* dari rumah Anda",
        text: "Belajar di kolam renang mitra yang tersebar di beberapa kota, termasuk pilihan kolam air hangat.",
        img: ""
      }
    ],
    trust: ["Pelatih bersertifikat", "Kelas kecil & bertahap", "Laporan progres berkala"]
  },

  /* ---------------------------------------------------------------------
     TENTANG KAMI
     --------------------------------------------------------------------- */
  about: {
    heading: "Selamat datang di *Papila* Swimming School",
    paragraphs: [
      "Papila Swimming School adalah sekolah renang yang menghadirkan pembelajaran renang secara aman, terstruktur, dan menyenangkan untuk semua usia dan level. Program dirancang untuk bayi, anak, remaja, hingga dewasa dengan kurikulum bertahap sesuai usia.",
      "Kami percaya renang bukan sekadar olahraga, tetapi sarana tumbuh kembang fisik, mental, sosial, dan kognitif. Teks ini masih sementara, silakan ganti dengan profil resmi Papila Swim."
    ],
    points: ["Kurikulum sesuai usia", "Pelatih bersertifikat", "Kelas kecil & personal", "Laporan progres berkala"],
    img: "", // foto utama
    img2: "" // foto kecil
  },

  visionMission: {
    vision: "Menjadi sekolah renang tepercaya yang menumbuhkan generasi sehat, percaya diri, dan aman di air.",
    missions: [
      "Menghadirkan pembelajaran renang yang aman, terstruktur, dan menyenangkan.",
      "Mengembangkan pelatih yang kompeten, sabar, dan berkarakter.",
      "Mendukung tumbuh kembang fisik, mental, sosial, dan kognitif siswa.",
      "Memperluas akses belajar renang lewat kolam mitra yang dekat dengan keluarga."
    ]
  },

  /* Angka statistik. icon: users | award | pin | clock | waves | heart */
  stats: [
    { value: 500, suffix: "+", label: "Anggota aktif", icon: "users" },
    { value: 25, suffix: "", label: "Pelatih & asisten", icon: "award" },
    { value: 12, suffix: "+", label: "Kolam mitra", icon: "pin" },
    { value: 5, suffix: "", label: "Tahun pengalaman", icon: "clock" }
  ],

  /* Lisensi, sertifikasi, dan mitra (tampil berjalan di bawah "Tentang").
     Ganti sesuai lisensi/mitra resmi. icon: shield | award | heart | users | building */
  partners: [
    { name: "Lisensi Pelatih Renang Nasional", icon: "award" },
    { name: "Sertifikasi Instruktur Internasional", icon: "shield" },
    { name: "Pelatihan First Aid & CPR", icon: "heart" },
    { name: "Perlindungan Asuransi Peserta", icon: "shield" },
    { name: "Kemitraan Kolam Renang & Hotel", icon: "building" },
    { name: "Standar Terapi Akuatik", icon: "award" }
  ],

  /* Keunggulan. icon: shield | award | layers | users | thermo | clipboard | heart | clock */
  features: [
    { icon: "shield", title: "Keselamatan nomor satu", text: "Rasio pelatih dan siswa dijaga, area latihan diawasi, dan pelatih dibekali pertolongan pertama." },
    { icon: "award", title: "Pelatih bersertifikat", text: "Tim pelatih profesional dengan metode mengajar yang komunikatif dan ramah anak." },
    { icon: "layers", title: "Kurikulum bertahap", text: "Setiap level punya target yang jelas, dari pengenalan air hingga teknik empat gaya." },
    { icon: "users", title: "Kelas kecil", text: "Jumlah siswa per kelas dibatasi agar setiap peserta mendapat perhatian penuh." },
    { icon: "thermo", title: "Pilihan kolam air hangat", text: "Beberapa kolam mitra menggunakan air hangat, nyaman untuk bayi dan anak kecil." },
    { icon: "clipboard", title: "Laporan progres", text: "Orang tua menerima catatan perkembangan berkala langsung dari pelatih." }
  ],

  /* ---------------------------------------------------------------------
     PROGRAM
     ageGroups dipakai untuk filter usia. Setiap program memilih
     satu/lebih grup lewat `groups`.
     color: deep | aqua | sun | coral | mint | night | sky
     icon : baby | duck | ring | swimmer | waves | stopwatch | heart
     --------------------------------------------------------------------- */
  ageGroups: [
    { id: "bayi", label: "Bayi", range: "3 bln – 2 th", icon: "baby" },
    { id: "balita", label: "Balita", range: "3 – 5 th", icon: "duck" },
    { id: "anak", label: "Anak", range: "6 – 12 th", icon: "ring" },
    { id: "remaja", label: "Remaja", range: "13 – 17 th", icon: "swimmer" },
    { id: "dewasa", label: "Dewasa", range: "17 th ke atas", icon: "waves" },
    { id: "terapi", label: "Terapi", range: "Kebutuhan khusus", icon: "heart" }
  ],

  programs: [
    {
      id: "baby-swim",
      name: "Baby Swim",
      levels: "I & II",
      age: "3 bulan – 2 tahun",
      groups: ["bayi"],
      duration: "30 menit",
      ratio: "1 : 1 + orang tua",
      color: "aqua",
      icon: "baby",
      img: "",
      summary: "Pengenalan air yang lembut bersama orang tua untuk membangun rasa nyaman sejak dini.",
      description: "Bayi memiliki kedekatan alami dengan air. Program ini menjaga kedekatan itu lewat permainan terarah, sentuhan lembut, dan stimulasi sensorik, sambil memperkuat ikatan orang tua dan anak.",
      focus: ["Adaptasi dan rasa nyaman di air", "Stimulasi sensorik & motorik", "Ikatan orang tua dan anak", "Refleks dasar mengapung"]
    },
    {
      id: "toddler",
      name: "Toddler Water Safety",
      levels: "I – III",
      age: "3 – 4 tahun",
      groups: ["balita"],
      duration: "30 menit",
      ratio: "1 : 3",
      color: "sun",
      icon: "duck",
      img: "",
      summary: "Keterampilan keselamatan air dasar yang dikemas lewat permainan terarah.",
      description: "Di usia ini rasa ingin tahu anak sangat tinggi. Fokus utamanya bukan teknik gaya renang, melainkan kemampuan menyelamatkan diri di air yang disusun sederhana dan mudah dipahami anak.",
      focus: ["Masuk & keluar kolam dengan aman", "Mengapung telentang", "Berbalik dan meraih tepi kolam", "Mengikuti instruksi pelatih"]
    },
    {
      id: "preschool",
      name: "Preschool",
      levels: "I & II",
      age: "4 – 5 tahun",
      groups: ["balita"],
      duration: "45 menit",
      ratio: "1 : 4",
      color: "coral",
      icon: "ring",
      img: "",
      summary: "Melatih koordinasi motorik kasar dan kemampuan merespons instruksi di air.",
      description: "Kemampuan komunikasi dan motorik anak mulai berkembang. Latihan menstimulasi otot, jantung, dan paru, sekaligus melatih anak mendengarkan instruksi dan mengenal lingkungannya.",
      focus: ["Koordinasi tangan dan kaki", "Meluncur dengan papan", "Pernapasan dasar", "Kemandirian di air"]
    },
    {
      id: "kids",
      name: "Kids Beginner",
      levels: "I – III",
      age: "6 – 12 tahun",
      groups: ["anak"],
      duration: "45 menit",
      ratio: "1 : 5",
      color: "deep",
      icon: "swimmer",
      img: "",
      summary: "Fondasi teknik renang: pernapasan, meluncur, hingga gaya bebas dan punggung.",
      description: "Program inti untuk anak yang baru belajar berenang. Materi disusun bertahap supaya teknik dasar dikuasai dengan benar dan aman sebelum naik ke level berikutnya.",
      focus: ["Teknik pernapasan", "Meluncur dan menendang", "Gaya bebas dasar", "Gaya punggung dasar"]
    },
    {
      id: "intermediate",
      name: "Intermediate & Advance",
      levels: "I – IV",
      age: "7 – 17 tahun",
      groups: ["anak", "remaja"],
      duration: "60 menit",
      ratio: "1 : 6",
      color: "sky",
      icon: "waves",
      img: "",
      summary: "Menyempurnakan empat gaya renang, start, dan pembalikan dengan teknik yang efisien.",
      description: "Siswa mulai mengenal gaya renang kompetitif dan melakukan penyesuaian teknik yang lebih detail. Fokusnya efisiensi gerak, koordinasi, dan konsistensi.",
      focus: ["Gaya dada dan kupu-kupu", "Start dan pembalikan (turn)", "Efisiensi gerak dan stamina", "Individual medley"]
    },
    {
      id: "team-prep",
      name: "Team Prep",
      levels: "Seleksi",
      age: "9 – 17 tahun",
      groups: ["anak", "remaja"],
      duration: "90 menit",
      ratio: "1 : 8",
      color: "night",
      icon: "stopwatch",
      img: "",
      summary: "Jembatan menuju jalur kompetitif: kecepatan, daya tahan, dan pemahaman aturan lomba.",
      description: "Untuk siswa yang punya minat dan potensi menjadi atlet renang. Latihan lebih intens dengan evaluasi catatan waktu dan persiapan mental bertanding.",
      focus: ["Latihan kecepatan dan daya tahan", "Strategi dan aturan lomba", "Persiapan mental bertanding", "Evaluasi catatan waktu"]
    },
    {
      id: "adult",
      name: "Adult",
      levels: "Pemula – Mahir",
      age: "17 tahun ke atas",
      groups: ["dewasa"],
      duration: "60 menit",
      ratio: "1 : 4",
      color: "deep",
      icon: "waves",
      img: "",
      summary: "Belajar dari nol atau memperbaiki teknik, dengan pendekatan personal dan nyaman.",
      description: "Cocok untuk pemula yang ingin bisa berenang, peserta yang ingin memperbaiki teknik, maupun yang menjadikan renang bagian dari gaya hidup sehat.",
      focus: ["Mengatasi rasa takut air", "Teknik pernapasan dan gaya bebas", "Kebugaran dan stamina", "Jadwal fleksibel"]
    },
    {
      id: "therapy",
      name: "Swim Therapy & Hydrotherapy",
      levels: "Personal",
      age: "Anak & dewasa",
      groups: ["terapi", "dewasa"],
      duration: "45 menit",
      ratio: "1 : 1",
      color: "mint",
      icon: "heart",
      img: "",
      summary: "Terapi berbasis air untuk anak berkebutuhan khusus dan pemulihan cedera.",
      description: "Daya apung air mengurangi beban tubuh dan memberi stimulasi sensorik alami. Program dirancang personal untuk membantu motorik, kepercayaan diri, dan rentang gerak sendi.",
      focus: ["Stimulasi motorik dan sensorik", "Relaksasi dan rentang gerak sendi", "Kepercayaan diri dan kemandirian", "Pendampingan personal"]
    }
  ],

  /* ---------------------------------------------------------------------
     LOKASI KOLAM (per kota)
     tags contoh: "Air hangat", "Indoor", "Outdoor", "Hotel", "Kolam anak"
     maps: (opsional) link Google Maps. Jika kosong dibuat otomatis.
     --------------------------------------------------------------------- */
  pools: [
    {
      city: "Kota A",
      note: "*Bisa memilih kolam terdekat",
      items: [
        { name: "Kolam Renang Mitra Satu", address: "Jl. Contoh Raya No. 1, Kec. Contoh, Kota A", tags: ["Air hangat", "Indoor"], maps: "" },
        { name: "Hotel Mitra Dua", address: "Jl. Contoh No. 2, Kec. Contoh, Kota A", tags: ["Hotel"], maps: "" },
        { name: "Sport Club Mitra Tiga", address: "Jl. Contoh No. 3, Kec. Contoh, Kota A", tags: ["Air hangat"], maps: "" },
        { name: "Kolam Renang Mitra Empat", address: "Jl. Contoh No. 4, Kec. Contoh, Kota A", tags: ["Outdoor", "Kolam anak"], maps: "" },
        { name: "Waterpark Mitra Lima", address: "Jl. Contoh No. 5, Kec. Contoh, Kota A", tags: ["Outdoor"], maps: "" },
        { name: "Gelanggang Renang Mitra Enam", address: "Jl. Contoh No. 6, Kec. Contoh, Kota A", tags: ["Indoor"], maps: "" }
      ]
    },
    {
      city: "Kota B",
      note: "*Bisa memilih kolam terdekat",
      items: [
        { name: "Kolam Renang Mitra Tujuh", address: "Jl. Contoh No. 7, Kota B", tags: ["Outdoor"], maps: "" },
        { name: "Hotel Mitra Delapan", address: "Jl. Contoh No. 8, Kota B", tags: ["Hotel", "Air hangat"], maps: "" },
        { name: "Waterpark Mitra Sembilan", address: "Jl. Contoh No. 9, Kota B", tags: ["Kolam anak"], maps: "" }
      ]
    },
    {
      city: "Kota C",
      note: "*Bisa memilih kolam terdekat",
      items: [
        { name: "Kolam Renang Mitra Sepuluh", address: "Jl. Contoh No. 10, Kota C", tags: ["Indoor"], maps: "" },
        { name: "Sport Center Mitra Sebelas", address: "Jl. Contoh No. 11, Kota C", tags: ["Air hangat"], maps: "" },
        { name: "Hotel Mitra Dua Belas", address: "Jl. Contoh No. 12, Kota C", tags: ["Hotel"], maps: "" }
      ]
    }
  ],

  /* Alur pendaftaran (berurutan) */
  steps: [
    { title: "Hubungi admin", text: "Isi formulir atau chat WhatsApp. Ceritakan usia dan kemampuan renang peserta." },
    { title: "Kelas percobaan", text: "Pelatih menilai kemampuan awal untuk menentukan level yang paling tepat." },
    { title: "Pilih jadwal & kolam", text: "Tentukan kolam terdekat dan jadwal yang cocok dengan rutinitas keluarga." },
    { title: "Mulai belajar", text: "Ikuti kelas rutin dan terima laporan perkembangan dari pelatih." }
  ],

  /* Pilihan format kelas. highlight: true untuk kartu yang ditonjolkan */
  formats: [
    {
      name: "Private",
      ratio: "1 : 1",
      text: "Satu pelatih untuk satu siswa. Cocok untuk progres cepat atau yang butuh perhatian khusus.",
      points: ["Jadwal paling fleksibel", "Materi disesuaikan personal", "Ideal untuk yang takut air"]
    },
    {
      name: "Semi Private",
      ratio: "1 : 3",
      label: "Rekomendasi",
      highlight: true,
      text: "Belajar bersama 2–3 teman dengan perhatian yang tetap personal.",
      points: ["Suasana belajar lebih seru", "Bisa bersama saudara atau teman", "Biaya lebih hemat dari private"]
    },
    {
      name: "Group",
      ratio: "1 : 6",
      text: "Kelas berkelompok untuk melatih kemandirian, disiplin, dan sosialisasi.",
      points: ["Jadwal rutin mingguan", "Melatih kerja sama", "Pilihan paling ekonomis"]
    }
  ],

  /* ---------------------------------------------------------------------
     TIM PELATIH
     --------------------------------------------------------------------- */
  team: [
    { name: "Nama Founder", role: "Founder", img: "", bio: "Profil singkat founder Papila Swim. Ganti dengan latar belakang, pengalaman, dan visi pendiri.", certs: ["Lisensi pelatih renang (contoh)", "Sertifikat terapi akuatik (contoh)"], instagram: "" },
    { name: "Nama Head Coach 1", role: "Head Coach", img: "", bio: "Profil singkat head coach. Ceritakan pengalaman melatih dan spesialisasi program.", certs: ["Lisensi pelatih renang (contoh)"], instagram: "" },
    { name: "Nama Head Coach 2", role: "Head Coach", img: "", bio: "Profil singkat head coach. Ceritakan pengalaman melatih dan spesialisasi program.", certs: ["Lisensi pelatih renang (contoh)"], instagram: "" },
    { name: "Nama Asisten Head Coach", role: "Asisten Head Coach", img: "", bio: "Profil singkat asisten head coach.", certs: ["First Aid & CPR (contoh)"], instagram: "" },
    { name: "Nama Pelatih 1", role: "Coach", img: "", bio: "Profil singkat pelatih.", certs: [], instagram: "" },
    { name: "Nama Pelatih 2", role: "Coach", img: "", bio: "Profil singkat pelatih.", certs: [], instagram: "" },
    { name: "Nama Pelatih 3", role: "Coach", img: "", bio: "Profil singkat pelatih.", certs: [], instagram: "" },
    { name: "Nama Pelatih 4", role: "Coach", img: "", bio: "Profil singkat pelatih.", certs: [], instagram: "" },
    { name: "Nama Pelatih 5", role: "Coach", img: "", bio: "Profil singkat pelatih.", certs: [], instagram: "" },
    { name: "Nama Pelatih 6", role: "Coach", img: "", bio: "Profil singkat pelatih.", certs: [], instagram: "" },
    { name: "Nama Staf Administrasi", role: "Administrasi & Marketing", img: "", bio: "Melayani pendaftaran, jadwal, dan informasi program.", certs: [], instagram: "" },
    { name: "Nama Staf Media", role: "Media", img: "", bio: "Mengelola dokumentasi dan media sosial.", certs: [], instagram: "" }
  ],

  /* ---------------------------------------------------------------------
     GALERI. category dipakai untuk filter.
     --------------------------------------------------------------------- */
  gallery: [
    { title: "Latihan gaya bebas", category: "Latihan", img: "" },
    { title: "Kelas Baby Swim", category: "Latihan", img: "" },
    { title: "Lomba antar klub", category: "Kompetisi", img: "" },
    { title: "Pemanasan sebelum kelas", category: "Latihan", img: "" },
    { title: "Tim pelatih", category: "Tim Pelatih", img: "" },
    { title: "Kolam air hangat", category: "Fasilitas", img: "" },
    { title: "Kelas akhir pekan", category: "Kegiatan", img: "" },
    { title: "Penyerahan sertifikat level", category: "Kegiatan", img: "" },
    { title: "Latihan pernapasan", category: "Latihan", img: "" },
    { title: "Fun games di kolam", category: "Kegiatan", img: "" },
    { title: "Coaching clinic", category: "Tim Pelatih", img: "" },
    { title: "Area tunggu orang tua", category: "Fasilitas", img: "" },
    { title: "Sesi Team Prep", category: "Kompetisi", img: "" },
    { title: "Kelas dewasa", category: "Latihan", img: "" },
    { title: "Dokumentasi kegiatan", category: "Kegiatan", img: "" }
  ],

  /* ---------------------------------------------------------------------
     TESTIMONI — masih CONTOH. Ganti dengan ulasan asli,
     lalu hapus `example: true` agar label "Contoh" hilang.
     --------------------------------------------------------------------- */
  testimonials: [
    { name: "Nama Orang Tua 1", relation: "Orang tua siswa Baby Swim", text: "Tempat untuk menuliskan testimoni asli dari orang tua siswa. Ceritakan pengalaman dan perubahan yang dirasakan setelah ikut kelas.", example: true },
    { name: "Nama Orang Tua 2", relation: "Orang tua siswa Kids Beginner", text: "Tempat untuk testimoni kedua. Misalnya tentang pelatih yang sabar, jadwal yang fleksibel, atau progres anak.", example: true },
    { name: "Nama Siswa Dewasa", relation: "Siswa kelas Adult", text: "Tempat untuk testimoni dari siswa dewasa yang belajar renang dari nol atau memperbaiki teknik.", example: true },
    { name: "Nama Orang Tua 3", relation: "Orang tua siswa Team Prep", text: "Tempat untuk testimoni keempat, misalnya tentang persiapan lomba dan perkembangan catatan waktu.", example: true }
  ],

  /* ---------------------------------------------------------------------
     BERITA & ARTIKEL
     color: brand | coral | mint | sun
     body: daftar paragraf. Awali dengan "## " untuk subjudul,
     atau gunakan { list: ["poin 1", "poin 2"] } untuk daftar.
     --------------------------------------------------------------------- */
  news: [
    {
      slug: "pendaftaran-siswa-baru",
      title: "Pendaftaran Siswa Baru Papila Swim Dibuka",
      date: "2026-11-10",
      tag: "Pengumuman",
      color: "brand",
      author: "Admin Papila Swim",
      img: "",
      excerpt: "Pendaftaran untuk semua program, dari Baby Swim hingga kelas dewasa, kini dibuka. Simak cara daftar dan jadwal kelas percobaan.",
      body: [
        "Papila Swimming School membuka pendaftaran siswa baru untuk semua program. Artikel ini masih contoh, silakan ganti dengan pengumuman resmi.",
        "## Cara mendaftar",
        { list: ["Isi formulir pendaftaran di halaman beranda", "Admin akan menghubungi melalui WhatsApp", "Ikuti kelas percobaan untuk penentuan level", "Pilih jadwal dan kolam terdekat"] },
        "Kuota setiap kelas dibatasi agar setiap siswa mendapat perhatian penuh dari pelatih."
      ]
    },
    {
      slug: "edukasi-keselamatan-air",
      title: "Pentingnya Edukasi Keselamatan Air Sejak Dini",
      date: "2026-10-22",
      tag: "Edukasi",
      color: "sun",
      author: "Admin Papila Swim",
      img: "",
      excerpt: "Kemampuan menyelamatkan diri di air sama pentingnya dengan teknik berenang. Berikut kebiasaan sederhana yang bisa diajarkan di rumah.",
      body: [
        "Anak-anak sering tertarik pada air, tetapi belum memahami bahayanya. Edukasi keselamatan air membantu anak mengenali risiko dan tahu apa yang harus dilakukan.",
        "## Kebiasaan sederhana yang bisa diajarkan",
        { list: ["Selalu minta izin dan didampingi orang dewasa saat dekat air", "Masuk kolam lewat tangga, bukan melompat sembarangan", "Belajar mengapung telentang untuk beristirahat", "Tahu cara meraih tepi kolam dan meminta tolong"] },
        "Di kelas Toddler Water Safety, keterampilan ini dilatih lewat permainan agar mudah diingat anak."
      ]
    },
    {
      slug: "renang-untuk-tumbuh-kembang",
      title: "Renang untuk Tumbuh Kembang Anak",
      date: "2026-10-05",
      tag: "Edukasi",
      color: "sun",
      author: "Admin Papila Swim",
      img: "",
      excerpt: "Renang melatih hampir seluruh otot tubuh sekaligus mendukung perkembangan mental, sosial, dan kognitif anak.",
      body: [
        "Renang adalah aktivitas yang melibatkan koordinasi seluruh tubuh. Bagi anak, manfaatnya tidak hanya pada fisik.",
        "## Manfaat yang bisa dirasakan",
        { list: ["Fisik: kekuatan otot, kapasitas paru, dan koordinasi", "Mental: rasa percaya diri saat berhasil menguasai keterampilan baru", "Sosial: belajar bergiliran dan bekerja sama di kelas", "Kognitif: melatih fokus dan kemampuan mengikuti instruksi"] },
        "Kurikulum bertahap membuat setiap anak bisa merasakan kemajuan sesuai tahap perkembangannya."
      ]
    },
    {
      slug: "kelas-akhir-pekan",
      title: "Serunya Kelas Akhir Pekan",
      date: "2026-09-14",
      tag: "Aktivitas",
      color: "coral",
      author: "Admin Papila Swim",
      img: "",
      excerpt: "Dokumentasi kelas akhir pekan: pemanasan, latihan teknik, dan permainan di kolam bersama para pelatih.",
      body: [
        "Kelas akhir pekan selalu ramai oleh siswa dari berbagai usia. Artikel ini contoh, ganti dengan cerita kegiatan yang sebenarnya.",
        "Setiap sesi dimulai dengan pemanasan di darat, dilanjutkan latihan teknik sesuai level, dan ditutup dengan permainan untuk melatih keberanian di air."
      ]
    },
    {
      slug: "kolam-mitra-baru",
      title: "Kolam Renang Mitra Baru di Kota B",
      date: "2026-08-28",
      tag: "Kerjasama",
      color: "mint",
      author: "Admin Papila Swim",
      img: "",
      excerpt: "Pilihan lokasi latihan bertambah. Siswa kini bisa memilih kolam yang lebih dekat dengan rumah.",
      body: [
        "Untuk memudahkan keluarga, Papila Swim menambah kolam renang mitra. Artikel ini contoh, ganti dengan informasi kerja sama yang sebenarnya.",
        "Daftar lengkap kolam bisa dilihat di bagian Lokasi pada halaman beranda."
      ]
    },
    {
      slug: "perlengkapan-renang-anak",
      title: "Checklist Perlengkapan Renang untuk Anak",
      date: "2026-08-03",
      tag: "Edukasi",
      color: "sun",
      author: "Admin Papila Swim",
      img: "",
      excerpt: "Apa saja yang perlu disiapkan sebelum kelas renang? Gunakan checklist ini supaya tidak ada yang tertinggal.",
      body: [
        "Persiapan yang baik membuat anak lebih nyaman dan fokus selama latihan.",
        "## Yang perlu dibawa",
        { list: ["Baju renang yang pas di badan", "Kacamata renang anti kabut", "Topi renang", "Handuk dan baju ganti", "Botol minum dan camilan sehat"] },
        "Untuk bayi, siapkan juga popok khusus berenang."
      ]
    }
  ],

  /* ---------------------------------------------------------------------
     FAQ
     --------------------------------------------------------------------- */
  faq: [
    { q: "Mulai usia berapa anak bisa ikut kelas renang?", a: "Kelas Baby Swim bisa diikuti sejak usia 3 bulan dengan pendampingan orang tua. Untuk usia lainnya tersedia program bertahap hingga dewasa." },
    { q: "Apakah ada kelas percobaan?", a: "Ada. Kelas percobaan sekaligus menjadi sesi penilaian untuk menentukan level yang tepat. Hubungi admin untuk jadwal dan ketentuannya." },
    { q: "Berapa lama satu sesi latihan?", a: "Antara 30 sampai 90 menit tergantung program. Kelas bayi dan balita lebih singkat, sementara Team Prep paling panjang." },
    { q: "Anak saya takut air. Apakah tetap bisa ikut?", a: "Bisa. Pelatih menggunakan pendekatan bertahap dan permainan agar anak merasa aman terlebih dahulu sebelum mempelajari teknik." },
    { q: "Apa saja yang perlu dibawa saat latihan?", a: "Baju renang, kacamata renang, topi renang, handuk, baju ganti, dan botol minum. Untuk bayi, siapkan popok khusus berenang." },
    { q: "Bagaimana sistem jadwal dan pembayaran?", a: "Informasi jadwal, paket, dan biaya akan disampaikan oleh admin melalui WhatsApp sesuai program dan kolam yang dipilih." }
  ]
};
