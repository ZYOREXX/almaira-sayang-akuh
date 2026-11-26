import type { Photo, PortfolioData } from './types';

/* ============================================================================
   PORTFOLIO_DATA — SEMUA KONTEN, FOTO & LINK DIATUR DI FILE INI
   ----------------------------------------------------------------------------
   MENGGANTI FOTO / SERTIFIKAT
   1. Simpan file gambar di folder:   portfolio/public/images/
   2. Tulis path TANPA garis miring di depan, contoh:
          src: 'images/foto-baru.jpg'
   3. `thumb` (opsional) = versi kecil untuk kartu & galeri agar ringan.
      Jika tidak ada, hapus baris `thumb` → `src` dipakai di semua tempat.
   4. Sertifikat dengan `image: null` tampil sebagai kartu ringkasan.
      Setelah scan tersedia, ganti `null` dengan objek gambar, contoh:
          image: { src: 'images/sertifikat-tpon.jpg', alt: 'Sertifikat TPON' },

   MENGGANTI LINK MEDIA SOSIAL
   - Lihat `contact.socials` di bagian paling bawah. Ganti '#' dengan URL
     lengkap, contoh: url: 'https://www.linkedin.com/in/username'
   - Link yang masih '#' tetap tampil, tetapi tidak berpindah halaman.

   Teks memakai bahasa Inggris akademik. Simbol statistik seperti ₀₁ dan −
   (tanda minus asli) sengaja dipakai agar tampil rapi.
   ============================================================================ */

export const PORTFOLIO_DATA = {
  /* ---------- Navigasi (id = id section pada halaman) ---------- */
  nav: [
    { id: 'research', label: 'Research' },
    { id: 'project', label: 'SWIPE' },
    { id: 'experience', label: 'Experience' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'toolkit', label: 'Toolkit' },
  ],

  /* ---------- A. HERO ---------- */
  profile: {
    name: 'Tio Ilham Wahyudi',
    suffix: 'S.Pd.',
    roles: ['Sport Education Researcher', 'Academic Writing Mentor', 'Sport Project Specialist'],
    tagline:
      'Bridging evidence-based sport science, reputable academic publishing, and dynamic sports event management.',
    affiliation: 'Sport Education · Universitas Pendidikan Indonesia',
    focus: ['Motor development', 'Sportspersonship & character', 'PE pedagogy', 'Sport project management'],
    // FOTO PROFIL — rasio 4:5. PNG/WebP berlatar transparan paling serasi dengan bingkai kaca.
    portrait: {
      src: 'images/profile-cutout.webp',
      alt: 'Formal portrait of Tio Ilham Wahyudi in a black suit and tie',
    },
    status: { label: "Fast-Track Master's Student", detail: 'Sport Education · UPI' },
  },

  prestigeBadges: [
    { icon: 'graduation', label: "Fast-Track Master's Student in Sport Education", detail: 'Universitas Pendidikan Indonesia (UPI)' },
    { icon: 'award', label: 'Bachelor of Physical Education', detail: 'Cum Laude · GPA 3.83 / 4.00' },
    { icon: 'mic', label: 'Sole Author at 11th ICSDP 2026', detail: '& Reputable Journal Author' },
  ],

  heroStats: [
    {
      label: 'Cumulative GPA',
      value: 3.83,
      decimals: 2,
      suffix: ' / 4.00',
      note: 'Cum Laude · Bachelor of Physical Education',
      prestige: true,
    },
    {
      label: 'Intervention sample',
      value: 32,
      decimals: 0,
      prefix: 'n = ',
      note: 'Grade IV students, 12 sessions · Jurnal Porkes 2025',
    },
    {
      label: 'Statistical significance',
      value: 0.001,
      from: 1,
      decimals: 3,
      prefix: 'p = ',
      display: 'p < 0.001',
      note: 'Gains in dynamic balance and agility',
    },
    {
      label: "Effect size (Cohen's d)",
      value: 2.495,
      decimals: 3,
      prefix: 'd = ',
      note: 'Very large effect on dynamic balance',
    },
  ],

  /* ---------- B. CORE PILLARS ---------- */
  summary:
    'A young academic and physical-education practitioner focused on motor development, sport psychology and character, modern PE pedagogy, and sport project management. I connect advanced quantitative analysis with what happens in classrooms, pools and race courses.',

  pillars: [
    {
      icon: 'journal',
      title: 'Reputable Journal & Conference Mentoring',
      body: 'Guidance on writing scientific articles, analysing quantitative data, mapping the literature bibliometrically, and publishing in reputable outlets.',
      tags: ['SINTA', 'Scopus', 'International Proceedings', 'Quantitative Analysis', 'Bibliometric Mapping'],
    },
    {
      icon: 'research',
      title: 'Sport Science & Motor Development Research',
      body: 'Experimental designs, correlational studies, bootstrapping and Bayesian analysis, and evaluation of PJOK (physical education) learning.',
      tags: ['Experimental Design', 'Correlational Studies', 'Bootstrapping', 'Bayesian Inference', 'PJOK Evaluation'],
    },
    {
      icon: 'event',
      title: 'Sports Event & Coaching Operations',
      body: 'Operational management of national-scale sporting events, and swimming coaching built on sport-science principles.',
      tags: ['National Running Events', 'Field Operations', 'Swimming Coaching'],
      photos: ['swim-coaching', 'pocari-stage'],
    },
  ],

  /* ---------- FOTO KEGIATAN (didaftarkan sekali, dipakai di banyak section) ---------- */
  photos: {
    'icsdp-group': {
      src: 'images/icsdp-group.webp',
      thumb: 'images/icsdp-group-sm.webp',
      alt: 'Speakers, committee and participants of the 11th ICSDP 2026 in the auditorium of the School of Postgraduate Studies, UPI',
      caption: '11th ICSDP 2026 · Auditorium, School of Postgraduate Studies, UPI',
    },
    'icsdp-screen': {
      src: 'images/icsdp-screen.webp',
      thumb: 'images/icsdp-screen-sm.webp',
      alt: 'Opening screen of the 11th International Conference of Sport for Development and Peace listing keynote and invited speakers',
      caption: 'Keynote & invited speakers · Sport and Physical Education for Equity and Social Cohesion',
    },
    'icsdp-session': {
      src: 'images/icsdp-session.webp',
      thumb: 'images/icsdp-session-sm.webp',
      alt: 'Participants in batik attending a session of ICSDP 2026',
      caption: 'Conference session · 24–25 November 2026',
    },
    'pocari-crew': {
      src: 'images/pocari-crew.webp',
      thumb: 'images/pocari-crew-sm.webp',
      alt: 'Field operations crew in blue Pocari Sweat vests on the race course',
      caption: 'Field operations crew · Pocari Sweat Run Indonesia 2025',
      position: '50% 35%',
    },
    'pocari-stage': {
      src: 'images/pocari-stage.webp',
      thumb: 'images/pocari-stage-sm.webp',
      alt: 'Illuminated half-marathon start stage of Pocari Sweat Run Indonesia at night',
      caption: 'Half-marathon start stage · Pocari Sweat Run Indonesia 2025',
      position: '50% 55%',
    },
    'swim-coaching': {
      src: 'images/swim-coaching.webp',
      thumb: 'images/swim-coaching-sm.webp',
      alt: 'Swimming coach in the pool with young swimmers wearing goggles',
      caption: 'Pool session with young swimmers · Papila Swim Club',
      position: '50% 65%',
    },
    'swipe-prototype': {
      src: 'images/swipe-prototype.webp',
      thumb: 'images/swipe-prototype-sm.webp',
      alt: 'SWIPE prototype concept: whistle, tone mode, flag, start/stop and mode buttons around an OLED display',
      caption: 'SWIPE prototype concept · PKM-KC 2025',
      fit: 'contain',
    },
    'swipe-schematic': {
      src: 'images/swipe-schematic.webp',
      thumb: 'images/swipe-schematic-sm.webp',
      alt: 'SWIPE breadboard schematic with ESP-32, OLED, RTC, 3 W speaker, five buttons and a lithium-ion battery',
      caption: 'SWIPE electronics schematic · ESP-32, OLED, RTC, 3 W speaker, Li-ion battery',
      fit: 'contain',
    },
    'forum-cohort': {
      src: 'images/forum-cohort.webp',
      thumb: 'images/forum-cohort-sm.webp',
      alt: 'Sport education students and lecturer seated together in a UPI lounge',
      caption: 'Sport education cohort · Universitas Pendidikan Indonesia',
    },
    'forum-workshop': {
      src: 'images/forum-workshop.webp',
      thumb: 'images/forum-workshop-sm.webp',
      alt: 'Students working on laptops on the floor during a research writing session at FPOK UPI',
      caption: 'Research & writing session · FPOK UPI',
    },
  },

  /* ---------- C. PUBLICATIONS ----------
     Abstrak di bawah adalah ringkasan dari data penelitian.
     Ganti dengan abstrak resmi dari naskah Anda bila diperlukan. */
  publications: [
    {
      id: 'icsdp',
      kind: 'International Conference Paper',
      venue: '11th ICSDP 2026',
      venueFull: '11th International Conference of Sport for Development and Peace (ICSDP) 2026',
      authorship: 'Sole & Corresponding Author',
      year: '2026',
      title:
        'Creative Thinking in Movement and Sportspersonship Orientation Among Fifth-Grade Elementary School Students: A Correlational Study in Physical Education',
      byline: 'Tio Ilham Wahyudi',
      affiliation:
        'Department of Sports Education, School of Postgraduate Studies, Universitas Pendidikan Indonesia (UPI)',
      design: 'Cross-sectional correlational design',
      instruments: ['TCAM', 'Indonesian MSOS'],
      metrics: [
        { label: 'Sample (n)', value: 31, decimals: 0 },
        { label: 'Pearson r', value: -0.125, decimals: 3 },
        { label: 'p-value', value: 0.504, decimals: 3 },
        { label: 'Bayes BF₀₁', value: 5.759, decimals: 3 },
      ],
      ci: { low: -0.471, high: 0.279, estimate: -0.125, resamples: 5000 },
      bayes: { bf01: 5.759, posteriorMean: -0.114 },
      finding:
        'Moderate evidence that creative movement and sportspersonship orientation develop along independent pathways.',
      abstract: [
        'Creativity in movement and sportspersonship are both treated as targets of elementary physical education, yet whether they develop together has rarely been tested. This study examined the relationship between creative thinking in movement and sportspersonship orientation among fifth-grade elementary school students.',
        'A cross-sectional correlational design was used with 31 fifth-grade students. Creative movement was measured with the Thinking Creatively in Action and Movement (TCAM) test, and sportspersonship with the Indonesian version of the Multidimensional Sportspersonship Orientations Scale (MSOS).',
        'The association was weak, negative and non-significant (r = −0.125, p = 0.504), and the bootstrapped 95% BCa confidence interval [−0.471, 0.279] spans zero. A Bayesian correlation favoured the null hypothesis (BF₀₁ = 5.759; posterior mean r = −0.114), indicating moderate evidence that creative movement and sportspersonship develop along independent pathways. Physical education programmes may therefore need to target each outcome deliberately rather than expect one to carry the other.',
      ],
      notes: [
        ['Design', 'Cross-sectional correlational study'],
        ['Participants', '31 fifth-grade elementary school students'],
        ['Instruments', 'Thinking Creatively in Action and Movement (TCAM); Indonesian Multidimensional Sportspersonship Orientations Scale (MSOS)'],
        ['Frequentist', 'Pearson r = −0.125; p = 0.504'],
        ['Bootstrap', '5,000 resamples; 95% BCa CI [−0.471, 0.279]'],
        ['Bayesian', 'BF₀₁ = 5.759; posterior mean r = −0.114'],
        ['Inference', 'Moderate evidence for independent developmental pathways'],
      ],
      photos: ['icsdp-screen', 'icsdp-group', 'icsdp-session'],
    },
    {
      id: 'porkes',
      kind: 'Peer-Reviewed Journal Article',
      venue: 'Jurnal Porkes',
      venueFull: 'Jurnal Porkes',
      citation: 'Vol. 8, No. 1, pp. 01–09 · April 2025',
      authorship: 'First & Corresponding Author',
      year: '2025',
      title: 'Effect of Rhythmic Movement Learning on Improving Dynamic Balance and Agility',
      titleAlt: 'Pengaruh Pembelajaran Aktivitas Gerak Berirama terhadap Peningkatan Keseimbangan dan Kelincahan Gerak',
      byline: 'Tio Ilham Wahyudi, Ricky Wibowo & Mukhlisin',
      affiliation: 'FPOK, Universitas Pendidikan Indonesia (UPI)',
      design: 'Pre-experimental one-group pretest–posttest',
      instruments: ['Modified Bass Test of Dynamic Balance', 'T-Test (TKSI Phase B)'],
      metrics: [
        { label: 'Sample (n)', value: 32, decimals: 0 },
        { label: 'Sessions', value: 12, decimals: 0 },
        { label: 'p-value', value: 0.001, from: 1, decimals: 3, display: '< 0.001' },
        { label: "Cohen's d", value: 2.495, decimals: 3 },
      ],
      effects: [
        { outcome: 'Dynamic balance', t: 't(31) = −38.906', p: 'p < 0.001', d: 2.495, ngain: 0.437, magnitude: 'Very large effect' },
        { outcome: 'Agility', t: 't(31) = 9.291', p: 'p < 0.001', d: 0.68, ngain: 0.314, magnitude: 'Medium effect' },
      ],
      finding: 'Rhythmic movement learning produced significant gains in both dynamic balance and agility.',
      abstract: [
        'Rhythmic movement activities are part of the elementary physical education curriculum, but their measurable effect on fundamental motor qualities needs empirical support. This study tested the effect of rhythmic movement learning on dynamic balance and agility in fourth-grade elementary school students.',
        'A pre-experimental one-group pretest–posttest design was applied to 32 fourth-grade students who completed 12 intervention sessions. Dynamic balance was measured with the Modified Bass Test of Dynamic Balance, and agility with the T-Test from the TKSI Phase B battery.',
        "Both outcomes improved significantly. Dynamic balance: t(31) = −38.906, p < 0.001, N-Gain = 0.437, Cohen's d = 2.495 (very large effect). Agility: t(31) = 9.291, p < 0.001, N-Gain = 0.314, Cohen's d = 0.680 (medium effect). Rhythmic movement learning offers a practical way to build balance and agility within regular PE lessons.",
      ],
      notes: [
        ['Design', 'Pre-experimental, one-group pretest–posttest'],
        ['Participants', '32 fourth-grade elementary school students'],
        ['Intervention', '12 sessions of rhythmic movement learning'],
        ['Instruments', 'Modified Bass Test of Dynamic Balance; T-Test (TKSI Phase B)'],
        ['Dynamic balance', "t(31) = −38.906; p < 0.001; N-Gain = 0.437; Cohen's d = 2.495 (very large)"],
        ['Agility', "t(31) = 9.291; p < 0.001; N-Gain = 0.314; Cohen's d = 0.680 (medium)"],
      ],
    },
  ],

  /* ---------- D. FEATURED PROJECT — PKM-KC 2025 SWIPE ---------- */
  swipe: {
    program: 'PKM-KC 2025',
    acronym: 'SWIPE',
    title: 'Smart Whistle Integrated with Precision Electronics',
    summary:
      'A multifunctional whistle with WhistleSync technology that helps physical education teachers and sport coaches work more effectively: one handheld device that signals, times and tracks laps.',
    subtitleId: 'Inovasi Peluit Multifungsi dengan Teknologi WhistleSync untuk Efektivitas Guru dan Pelatih Olahraga',
    achievements: [
      {
        label: 'PKM-KC 2025 National Funding',
        detail: 'Program Kreativitas Mahasiswa – Karsa Cipta · Kemendikbudristek',
        prestige: true,
      },
      {
        label: 'National PKP2 Stage',
        detail: 'Represented Universitas Pendidikan Indonesia at the PKM progress review (PKP2)',
      },
    ],
    role: 'Member of the Research & Physical Education Development Team (PGSD Penjas, FPOK UPI)',
    specs: [
      { icon: 'cpu', label: 'ESP-32', detail: 'Microcontroller' },
      { icon: 'monitor', label: 'OLED Display', detail: 'Split, lap & running time' },
      { icon: 'clock', label: 'RTC Module', detail: 'Real-time clock' },
      { icon: 'speaker', label: 'Mini Speaker 3W', detail: 'Audible whistle tones' },
      { icon: 'battery', label: 'Lithium-ion Battery', detail: 'Rechargeable power' },
      { icon: 'timer', label: 'Stopwatch & Lap/Flag Timer', detail: 'Timing on the field' },
      { icon: 'sliders', label: 'Tone Mode Selector', detail: 'Selectable signals' },
    ],
    team: [
      { name: 'Siti Zakiatul Balqis', role: 'Team Leader', unit: 'Physical Education (Penjas)' },
      { name: 'Tio Ilham Wahyudi', role: 'Research & PE Development', unit: 'PGSD Penjas', self: true },
      { name: 'Alifa Prayudio Dava Nugroho', unit: 'Industrial Automation & Robotics Education' },
      { name: 'Raihan Tristan Pakpahan', unit: 'Physical, Health & Recreation Education (PJKR)' },
      { name: 'Amelia Putri Sylfia', unit: 'Visual Communication Design (DKV)' },
    ],
    photos: ['swipe-prototype', 'swipe-schematic'],
  },

  /* ---------- E. EXPERIENCE ---------- */
  experience: [
    {
      role: 'Swimming Coach',
      org: 'Papila Swim Club',
      period: 'Ongoing',
      ongoing: true,
      body: 'Coaches swimming technique and physical conditioning for young athletes with a sport-science approach.',
      icon: 'waves',
      photo: 'swim-coaching',
    },
    {
      role: 'Field Operations Committee',
      org: 'Pocari Sweat Run Indonesia',
      period: '2025',
      body: 'Coordinated on-field operations at a national-scale running event.',
      icon: 'flag',
      photo: 'pocari-crew',
    },
    {
      role: 'Badminton Branch Committee',
      org: 'PORDOSKA UPI',
      period: '2024',
      body: 'Ran the badminton branch of Pekan Olahraga Dosen dan Karyawan, the UPI faculty and staff sports week.',
      icon: 'trophy',
    },
    {
      role: 'Field Operations Committee',
      org: 'UPI Half Marathon',
      body: 'Technical course coordination and running-event operations.',
      icon: 'route',
    },
    {
      role: 'Field Operations Committee',
      org: 'Festival Gerak PGSD Penjas UPI',
      period: '2024',
      body: 'Field operations for the PGSD Physical Education movement festival.',
      icon: 'sparkles',
    },
  ],
  leadership: [
    { org: 'Dewan Perwakilan Mahasiswa (DPM)', unit: 'PGSD Penjas, FPOK UPI', note: 'Student Representative Council' },
    { org: 'UKM IBAF UPI', unit: 'Universitas Pendidikan Indonesia', note: 'Student Activity Unit' },
  ],

  /* ---------- GALLERY (urutan & ukuran kotak di tampilan "All") ---------- */
  gallery: {
    filters: [
      { id: 'all', label: 'All' },
      { id: 'icsdp', label: '11th ICSDP 2026' },
      { id: 'pocari', label: 'Pocari Sweat Run 2025' },
      { id: 'papila', label: 'Papila Swim Club' },
      { id: 'swipe', label: 'PKM-KC SWIPE' },
      { id: 'forum', label: 'Academic Forums' },
    ],
    items: [
      { photo: 'icsdp-group', category: 'icsdp', span: 'big' },
      { photo: 'icsdp-screen', category: 'icsdp', span: 'wide' },
      { photo: 'icsdp-session', category: 'icsdp', span: 'normal' },
      { photo: 'pocari-crew', category: 'pocari', span: 'tall' },
      { photo: 'pocari-stage', category: 'pocari', span: 'tall' },
      { photo: 'swim-coaching', category: 'papila', span: 'tall' },
      { photo: 'swipe-prototype', category: 'swipe', span: 'normal' },
      { photo: 'swipe-schematic', category: 'swipe', span: 'wide' },
      { photo: 'forum-cohort', category: 'forum', span: 'wide' },
      { photo: 'forum-workshop', category: 'forum', span: 'wide' },
    ],
  },

  /* ---------- F. CERTIFICATE SHOWCASE ---------- */
  certificates: {
    featured: [
      {
        id: 'tpon',
        title: 'Tenaga Penggerak Olahraga Nasional (TPON)',
        subtitle: 'National Sport Mobiliser Certification',
        issuer: 'Ministry of Youth and Sports (KEMENPORA), Republic of Indonesia',
        date: 'July 2026',
        meta: '34 JP',
        category: 'National Certification',
        icon: 'medal',
        code: 'TPON · 34 JP',
        prestige: true,
        prestigeLabel: 'KEMENPORA RI',
        focus: 'Sport-culture policy, physical literacy, community sport management, and first aid for sports injuries.',
        image: null, // ← ganti dengan scan sertifikat TPON
      },
      {
        id: 'icsdp-presenter',
        title: 'Certificate of Presenter',
        subtitle: '11th International Conference of Sport for Development and Peace (ICSDP 2026)',
        issuer: 'School of Postgraduate Studies, Universitas Pendidikan Indonesia',
        date: '24–25 November 2026',
        category: 'International Conference',
        icon: 'presentation',
        code: 'ICSDP 2026',
        focus: 'Presented a sole-authored correlational study on creative movement and sportspersonship.',
        image: null, // ← ganti dengan scan sertifikat presenter ICSDP
      },
      {
        id: 'ai-ready',
        title: 'Certificate of Completion: AI Ready ASEAN',
        issuer: 'ASEAN Foundation & Google.org',
        date: 'September 2026',
        meta: '15 modules · 12 hours',
        category: 'International Certification',
        icon: 'bot',
        code: 'AI Ready ASEAN',
        focus: 'Generative AI, AI ethics and academic plagiarism, data security, and building simple AI-based tools.',
        image: {
          src: 'images/cert-ai-ready.webp',
          thumb: 'images/cert-ai-ready-sm.webp',
          alt: 'AI Ready ASEAN certificate of completion presented to Tio Ilham Wahyudi, 8 September 2026',
          caption: 'AI Ready ASEAN · Certificate of Completion',
        },
        more: [
          {
            src: 'images/cert-ai-ready-modules.webp',
            alt: 'List of the 15 completed AI Ready ASEAN learning modules',
            caption: 'AI Ready ASEAN · 15 completed modules',
          },
        ],
      },
      {
        id: 'stadium-generale',
        title: 'Stadium Generale: “Sport Leadership and Policy”',
        issuer: 'Adjunct Professor Program · Universiti Malaya & FPOK UPI',
        date: 'November 2023',
        category: 'Stadium Generale',
        icon: 'landmark',
        code: 'Universiti Malaya × UPI',
        image: null, // ← ganti dengan scan sertifikat stadium generale
      },
      {
        id: 'meaningful-pe',
        title: 'Guest Lecture: “Meaningful PE: A Background on Its Rationale and Design”',
        issuer: 'Sports Education Study Program, School of Postgraduate Studies, UPI',
        date: '14 October 2026',
        category: 'Guest Lecture',
        icon: 'school',
        code: 'Meaningful PE',
        image: {
          src: 'images/cert-meaningful-pe.webp',
          thumb: 'images/cert-meaningful-pe-sm.webp',
          alt: 'Certificate of appreciation for the guest lecture Meaningful PE, School of Postgraduate Studies UPI',
          caption: 'Meaningful PE · Certificate of Appreciation',
        },
      },
    ],
    additional: [
      {
        title: 'Cybersecurity Training for MSMEs (Modules 1–3)',
        issuer: 'MicroMentor by Mercy Corps & Mastercard Center for Inclusive Growth',
        date: 'May 2023',
        images: [
          { src: 'images/cert-cyber-1.webp', alt: 'Cybersecurity Training for MSMEs module 1 certificate', caption: 'Module 1 · Know What You Have and Update Your Defenses' },
          { src: 'images/cert-cyber-2.webp', alt: 'Cybersecurity Training for MSMEs module 2 certificate', caption: 'Module 2 · Beyond Simple Passwords and Prevent Phishing and Malware' },
          { src: 'images/cert-cyber-3.webp', alt: 'Cybersecurity Training for MSMEs module 3 certificate', caption: 'Module 3 · Backup and Recover' },
        ],
      },
      {
        title: 'Guest Lecture: “Enhancing Teacher Skills and Innovative Pedagogical Approaches in Physical Education”',
        issuer: 'FPOK UPI',
        date: 'October 2024',
        images: [],
      },
    ],
  },

  /* ---------- G. SKILLS & TECH STACK (id logo: lihat src/data/brandIcons.ts) ---------- */
  skills: [
    { title: 'Data & Quantitative Analytics', icon: 'sigma', tools: ['spss', 'stata', 'smartpls', 'python', 'excel'] },
    { title: 'Bibliometrics & Academic Publishing', icon: 'network', tools: ['vosviewer', 'pop', 'mendeley', 'googlescholar', 'orcid'] },
    { title: 'Creative Media & Visual Design', icon: 'palette', tools: ['canva', 'lightroom', 'capcut', 'picsart', 'snapseed', 'powerpoint'] },
  ],

  /* ---------- H. CONTACT & SOCIAL ---------- */
  contact: {
    email: 'tioilhamw123@upi.edu',
    heading: 'Let’s build your next paper, study or sports event.',
    intro:
      'Open to journal and conference mentoring, sport science research collaboration, and event management or coaching work.',
    areas: [
      { icon: 'pen', title: 'Journal & conference mentoring', body: 'Writing guidance, quantitative analysis and bibliometric mapping for reputable outlets.' },
      { icon: 'microscope', title: 'Sport research collaboration', body: 'Experimental, correlational and Bayesian studies in PE and sport science.' },
      { icon: 'calendar', title: 'Event management & coaching', body: 'Race-day field operations, school sport events and swimming coaching.' },
    ],
    // GANTI '#' DENGAN URL PROFIL ANDA
    socials: [
      { key: 'linkedin', label: 'LinkedIn', url: '#' }, // https://www.linkedin.com/in/...
      { key: 'github', label: 'GitHub', url: '#' }, // https://github.com/...
      { key: 'instagram', label: 'Instagram', url: '#' }, // https://www.instagram.com/...
      { key: 'threads', label: 'Threads', url: '#' }, // https://www.threads.net/@...
      { key: 'googlescholar', label: 'Google Scholar', url: '#' }, // https://scholar.google.com/citations?user=...
      { key: 'orcid', label: 'ORCID', url: '#' }, // https://orcid.org/0000-0000-0000-0000
    ],
  },
} satisfies PortfolioData;

/** Look up a photo by id; returns undefined for unknown ids (they are skipped). */
export function getPhoto(id: string): Photo | undefined {
  return (PORTFOLIO_DATA.photos as Record<string, Photo>)[id];
}
