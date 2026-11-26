import type { Photo, PortfolioData, Work } from './types';

/* ============================================================================
   PORTFOLIO_DATA — SEMUA KONTEN, FOTO & LINK DIATUR DI FILE INI
   ----------------------------------------------------------------------------
   MENGGANTI FOTO / SERTIFIKAT
   1. Simpan file gambar di folder:   portfolio/public/images/
   2. Tulis path TANPA garis miring di depan, contoh:
          src: 'images/foto-baru.jpg'
   3. `thumb` (opsional) = versi kecil untuk kartu & thumbnail agar ringan.
      Jika tidak ada, hapus baris `thumb` → `src` dipakai di semua tempat.
   4. Prestasi tanpa scan memakai `visual: { kind: 'emblem', code: '...' }`.
      Setelah scan tersedia, ganti menjadi:
          visual: { kind: 'scan', images: [{ src: 'images/scan.jpg', alt: '...' }] }

   MENGGANTI LINK MEDIA SOSIAL
   - Lihat `contact.socials` di bagian paling bawah. Ganti '#' dengan URL
     lengkap, contoh: url: 'https://www.linkedin.com/in/username'

   Data penelitian di bagian WORKS diambil dari berkas asli: abstrak ICSDP
   2026 (.docx) dan artikel Jurnal Porkes Vol. 8 No. 1 (2025).
   ============================================================================ */

export const PORTFOLIO_DATA = {
  /* ---------- Navigasi (id = id section) ---------- */
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'works', label: 'Works' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ],

  /* ---------- LOGO RESMI (file di public/logos) ---------- */
  logos: {
    upi: { src: 'logos/upi.webp', alt: 'Universitas Pendidikan Indonesia logo' },
    'upi-sps': { src: 'logos/upi-sps.webp', alt: 'UPI School of Postgraduate Studies logo' },
    icsdp: { src: 'logos/icsdp.webp', alt: 'International Conference of Sport for Development and Peace logo' },
    papila: { src: 'logos/papila.webp', alt: 'Papila Swimming School logo' },
    'upi-half-marathon': { src: 'logos/upi-half-marathon.webp', alt: 'UPI Half Marathon logo' },
    'dpm-pgsd-penjas': { src: 'logos/dpm-pgsd-penjas.webp', alt: 'DPM PGSD Penjas FPOK UPI logo' },
    'hmp-pgsd-penjas': { src: 'logos/hmp-pgsd-penjas.webp', alt: 'HMP PGSD Penjas FPOK UPI logo' },
    'ukm-ibaf': { src: 'logos/ukm-ibaf.webp', alt: 'UKM Ideal Body and Fitness UPI logo' },
  },

  /* ---------- LOGO APLIKASI RESMI (Tech Stack) ---------- */
  tools: {
    spss: { name: 'IBM SPSS', logo: 'logos/spss.webp' },
    stata: { name: 'Stata', logo: 'logos/stata.webp' },
    smartpls: { name: 'SmartPLS', logo: 'logos/smartpls.webp' },
    python: { name: 'Python', logo: 'logos/python.webp' },
    excel: { name: 'Excel', logo: 'logos/excel.webp' },
    vosviewer: { name: 'VOSviewer', logo: 'logos/vosviewer.webp' },
    pop: { name: 'Publish or Perish', logo: 'logos/harzing.webp' },
    mendeley: { name: 'Mendeley', logo: 'logos/mendeley.webp' },
    googlescholar: { name: 'Google Scholar', logo: 'logos/googlescholar.webp' },
    orcid: { name: 'ORCID', logo: 'logos/orcid.webp' },
    canva: { name: 'Canva', logo: 'logos/canva.webp' },
    lightroom: { name: 'Lightroom', logo: 'logos/lightroom.webp' },
    capcut: { name: 'CapCut', logo: 'logos/capcut.webp' },
    picsart: { name: 'Picsart', logo: 'logos/picsart.webp' },
    snapseed: { name: 'Snapseed', logo: 'logos/snapseed.webp' },
    powerpoint: { name: 'PowerPoint', logo: 'logos/powerpoint.webp' },
  },

  /* ---------- SECTION 1 · HERO ---------- */
  hero: {
    // LATAR HERO — ilustrasi kampus UPI (diberi lapisan gelap otomatis)
    background: { src: 'images/upi-campus-anime.webp', alt: 'Illustration of the Universitas Pendidikan Indonesia campus building' },
    institution: 'Universitas Pendidikan Indonesia',
    institutionLogo: 'upi',
    title: 'Welcome to my portfolio',
    name: 'Tio Ilham Wahyudi',
    suffix: 'S.Pd.',
    roles: ['Sport Education Researcher', 'Academic Writing Mentor', 'Sport Project Specialist'],
    // FOTO UTAMA — rasio 4:5
    portrait: { src: 'images/hero-portrait.webp', alt: 'Tio Ilham Wahyudi at the 11th ICSDP 2026, wearing batik and a conference lanyard' },
    pills: [
      { logo: 'upi', label: "Fast-Track Master's", detail: 'Sport Education UPI' },
      { icon: 'award', label: 'Cum Laude', detail: 'GPA 3.83 / 4.00', prestige: true },
      { icon: 'mic', label: 'International Conference', detail: '& Journal Author' },
    ],
  },

  /* ---------- SECTION 2 · ABOUT ---------- */
  about: {
    heading: 'About me',
    body: "Fast-track Master's student in Sport Education at Universitas Pendidikan Indonesia (UPI) and Bachelor of Physical Education (GPA 3.83). I research motor development and sport psychology, and mentor the writing of reputable journal articles (SINTA and international proceedings). In the field, I run operations for national sports events and coach swimming with a sport-science approach.",
    // FOTO ABOUT — foto formal rasio 4:5
    photo: { src: 'images/profile-cutout.webp', alt: 'Formal portrait of Tio Ilham Wahyudi in a black suit and tie' },
    stack: [
      { title: 'Quantitative Analytics', icon: 'sigma', tools: ['spss', 'stata', 'smartpls', 'python', 'excel'] },
      { title: 'Research & Bibliometrics', icon: 'network', tools: ['vosviewer', 'pop', 'mendeley', 'googlescholar', 'orcid'] },
      { title: 'Media & Design', icon: 'palette', tools: ['canva', 'lightroom', 'capcut', 'picsart', 'snapseed', 'powerpoint'] },
    ],
    highlights: [
      { icon: 'pen', title: 'Academic Mentoring', body: 'Guides the writing and statistical analysis of reputable scientific articles.' },
      { icon: 'waves', title: 'Dual Persona', body: 'Equally at home in statistical analysis and at the poolside or race course.' },
    ],
  },

  /* ---------- FOTO KEGIATAN (didaftarkan sekali, dipakai di banyak section) ---------- */
  photos: {
    'icsdp-screen': {
      src: 'images/icsdp-screen.webp',
      thumb: 'images/icsdp-screen-sm.webp',
      alt: 'Opening screen of the 11th International Conference of Sport for Development and Peace listing keynote and invited speakers',
      caption: '11th ICSDP 2026 · Keynote & invited speakers',
    },
    'icsdp-group': {
      src: 'images/icsdp-group.webp',
      thumb: 'images/icsdp-group-sm.webp',
      alt: 'Speakers, committee and participants of the 11th ICSDP 2026 in the auditorium of the School of Postgraduate Studies, UPI',
      caption: '11th ICSDP 2026 · Auditorium, School of Postgraduate Studies, UPI',
    },
    'icsdp-session': {
      src: 'images/icsdp-session.webp',
      thumb: 'images/icsdp-session-sm.webp',
      alt: 'Participants in batik attending a session of ICSDP 2026',
      caption: '11th ICSDP 2026 · Conference session, 24–25 November 2026',
    },
    'porkes-article': {
      src: 'images/porkes-article.webp',
      thumb: 'images/porkes-article-sm.webp',
      alt: 'First page of the Jurnal Porkes article on rhythmic movement learning, balance and agility',
      caption: 'Jurnal Porkes Vol. 8 No. 1 (2025), pp. 01–09 · first page',
      fit: 'contain',
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
    'forum-workshop': {
      src: 'images/forum-workshop.webp',
      thumb: 'images/forum-workshop-sm.webp',
      alt: 'Students working on laptops on the floor during a research writing session at FPOK UPI',
      caption: 'Research & writing session · FPOK UPI',
    },
    'forum-cohort': {
      src: 'images/forum-cohort.webp',
      thumb: 'images/forum-cohort-sm.webp',
      alt: 'Sport education students and lecturer seated together in a UPI lounge',
      caption: 'Sport education cohort · Universitas Pendidikan Indonesia',
    },
    'swim-coaching': {
      src: 'images/swim-coaching.webp',
      thumb: 'images/swim-coaching-sm.webp',
      alt: 'Swimming coach in the pool with young swimmers wearing goggles',
      caption: 'Pool session with young swimmers · Papila Swim Club',
      position: '50% 65%',
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
    'icsdp-tio': {
      src: 'images/icsdp-tio.webp',
      thumb: 'images/icsdp-tio-sm.webp',
      alt: 'Tio Ilham Wahyudi in batik at the 11th ICSDP 2026 venue',
      caption: '11th ICSDP 2026 · Presenting author at the School of Postgraduate Studies, UPI',
      position: '50% 70%',
    },
    'icsdp-team': {
      src: 'images/icsdp-team.webp',
      thumb: 'images/icsdp-team-sm.webp',
      alt: 'Five participants in front of the 11th ICSDP 2026 screen',
      caption: '11th ICSDP 2026 · With fellow participants in front of the conference screen',
      position: '50% 55%',
    },
    'icsdp-room': {
      src: 'images/icsdp-room.webp',
      thumb: 'images/icsdp-room-sm.webp',
      alt: 'Parallel session room at ICSDP 2026 with participants facing a presenter',
      caption: '11th ICSDP 2026 · Parallel session room',
    },
    'icsdp-online': {
      src: 'images/icsdp-online.webp',
      thumb: 'images/icsdp-online-sm.webp',
      alt: 'Online session of the 11th ICSDP 2026 on a video-conference screen',
      caption: '11th ICSDP 2026 · Hybrid online session',
    },
    'coding-laptop': {
      src: 'images/coding-laptop.webp',
      thumb: 'images/coding-laptop-sm.webp',
      alt: 'Writing analysis code on a laptop',
      caption: 'Data analysis session · code and statistics on the laptop',
    },
    'upi-class': {
      src: 'images/upi-class.webp',
      thumb: 'images/upi-class-sm.webp',
      alt: 'Students in a seminar room at Universitas Pendidikan Indonesia',
      caption: 'Postgraduate class session · Universitas Pendidikan Indonesia',
    },
    'pordoska-podium': {
      src: 'images/pordoska-podium.webp',
      thumb: 'images/pordoska-podium-sm.webp',
      alt: 'Badminton winners on the podium at PORDOSKA XIV 2024',
      caption: 'PORDOSKA XIV 2024 · Badminton podium ceremony',
      position: '50% 40%',
    },
    'festival-gerak': {
      src: 'images/festival-gerak.webp',
      thumb: 'images/festival-gerak-sm.webp',
      alt: 'Committee group photo in black at Festival Gerak',
      caption: 'Festival Gerak PGSD Penjas UPI · Committee',
      position: '50% 70%',
    },
    'upi-half-marathon-crew': {
      src: 'images/upi-half-marathon-crew.webp',
      thumb: 'images/upi-half-marathon-crew-sm.webp',
      alt: 'UPI Half Marathon committee in orange shirts on the course',
      caption: 'UPI Half Marathon · Field operations committee',
    },
    'pocari-finish': {
      src: 'images/pocari-finish.webp',
      thumb: 'images/pocari-finish-sm.webp',
      alt: 'Runners crossing the Pocari Sweat Run finish gate at night',
      caption: 'Pocari Sweat Run Indonesia 2025 · Finish area',
    },
    'papila-poolside': {
      src: 'images/papila-poolside.webp',
      thumb: 'images/papila-poolside-sm.webp',
      alt: 'Swimming coach and young swimmer with kickboards at the poolside, Papila Swimming School',
      caption: 'Papila Swimming School · Kickboard session',
      position: '50% 60%',
    },
    'papila-lesson': {
      src: 'images/papila-lesson.webp',
      thumb: 'images/papila-lesson-sm.webp',
      alt: 'Coach guiding a young swimmer with a kickboard and pool noodles',
      caption: 'Papila Swimming School · Guided lesson in the pool',
      position: '50% 55%',
    },
  },

  /* ---------- SECTION 3 · EXPERIENCE & LEADERSHIP ---------- */
  experience: [
    {
      role: 'Swimming Coach',
      org: 'Papila Swim Club',
      period: 'Ongoing',
      ongoing: true,
      body: 'Coaches swimming technique and athletes’ physical conditioning with a sport-science approach.',
      icon: 'waves',
      logos: ['papila'],
      photos: ['papila-poolside', 'papila-lesson', 'swim-coaching'],
    },
    {
      role: 'Field Operations Committee',
      org: 'Pocari Sweat Run Indonesia',
      period: '2025',
      body: 'Technical and on-field operations coordination for a national-scale running event.',
      icon: 'flag',
      logos: [],
      photos: ['pocari-finish', 'pocari-crew', 'pocari-stage'],
    },
    {
      role: 'Badminton Branch Committee',
      org: 'PORDOSKA UPI',
      period: '2024',
      body: 'Organising committee for the badminton branch of the UPI faculty and staff sports week.',
      icon: 'trophy',
      logos: ['upi'],
      photos: ['pordoska-podium'],
    },
    {
      role: 'Field Operations Committee',
      org: 'UPI Half Marathon & Festival Gerak PGSD Penjas',
      period: '2024',
      body: 'Managed participant flow, course logistics and the smooth running of campus sport events.',
      icon: 'route',
      logos: ['upi-half-marathon', 'upi'],
      photos: ['upi-half-marathon-crew', 'festival-gerak'],
    },
    {
      role: 'Organizational Leadership',
      org: 'DPM PGSD Penjas FPOK UPI & UKM IBAF UPI',
      body: 'Student legislation at study-programme level and development of a campus sport activity unit.',
      icon: 'users',
      logos: ['dpm-pgsd-penjas', 'hmp-pgsd-penjas', 'ukm-ibaf'],
    },
  ],

  /* ---------- SECTION 4 · SELECTED WORKS (data dari berkas asli) ---------- */
  works: [
    {
      type: 'conference',
      id: 'icsdp',
      label: 'ICSDP 2026',
      kind: 'International Conference Paper',
      title:
        'Creative Thinking in Movement and Sportspersonship Orientation Among Fifth-Grade Elementary School Students: A Correlational Study in Physical Education',
      venue: '11th International Conference of Sport for Development and Peace (ICSDP) 2026',
      role: 'Sole & Corresponding Author',
      year: '2026',
      byline: 'Tio Ilham Wahyudi',
      affiliation: 'Department of Sports Education, School of Postgraduate Studies, Universitas Pendidikan Indonesia, Bandung',
      summary:
        'A cross-sectional study of 31 fifth-grade students at MI Asy-Syuhada (Bandung Regency) asking whether creative movement and sportspersonship develop together. Bootstrapped and Bayesian correlations point to independent pathways.',
      tags: ['TCAM', 'Indonesian MSOS', 'SPSS 27', 'Bootstrap BCa', 'Bayesian'],
      metrics: [
        { label: 'Sample (n)', value: 31, decimals: 0 },
        { label: 'Pearson r', value: -0.125, decimals: 3 },
        { label: 'p-value', value: 0.504, decimals: 3 },
        { label: 'BF₀₁', value: 5.759, decimals: 3 },
      ],
      images: ['icsdp-tio', 'icsdp-team', 'icsdp-screen', 'icsdp-group', 'icsdp-session', 'icsdp-room', 'icsdp-online'],
      logos: ['icsdp', 'upi-sps'],
      cta: 'View Full Abstract',
      // Abstrak asli (bahasa Inggris) dari berkas ICSDP 2026.
      abstract: [
        'Physical Education, Sports, and Health (PJOK) in elementary schools plays a strategic role in simultaneously fostering cognitive-creative and affective-social domains, yet the empirical relationship between these two domains among children aged 10–11 years remains underexplored. This exploratory study aimed to analyze the relationship between creative thinking in movement and sportsmanship orientation among elementary school students.',
        'The research employed a quantitative approach with a cross-sectional correlational design involving 31 fifth-grade students from MI Asy-Syuhada, Katapang District, Bandung Regency, selected through a total sampling technique. Movement creativity data were collected using the Thinking Creatively in Action and Movement (TCAM), while sportsmanship orientation was assessed using the Indonesian version of the Multidimensional Sportspersonship Orientations Scale (MSOS). Data analysis was conducted using SPSS 27, comprising descriptive statistics, the Shapiro–Wilk normality test, Pearson correlation with 5,000 bootstrap resamples (95% BCa CI), Bayesian correlation, and Spearman correlation with bootstrapping for non-normally distributed TCAM dimensions.',
        'The results showed that sportsmanship orientation was in the high category (M = 75.77; SD = 8.99), whereas movement creativity was in the moderate category (M = 19.61; SD = 4.27). No significant relationship was found between movement creativity and sportsmanship orientation (r = −0.125; p = 0.504; 95% BCa CI [−0.471, 0.279]), nor across the three TCAM dimensions individually. Bayesian analysis yielded BF01 = 5.759 with a posterior mean r = −0.114 (95% credible interval [−0.440, 0.219]), providing moderate evidence for the independence of both variables.',
        'These findings indicate that in late elementary school age, both domains develop through distinct pathways, suggesting that PJOK teachers should design explicit interventions through open-ended movement tasks and structured character education. Future studies are recommended to involve larger samples with direct observation-based assessments of sporting behavior.',
      ],
      keywords: ['Bayes factor', 'correlational study', 'elementary physical education', 'movement creativity', 'sportsmanship orientation'],
      method: [
        ['Design', 'Quantitative, cross-sectional correlational (exploratory)'],
        ['Participants', '31 fifth-grade students, MI Asy-Syuhada, Katapang District, Bandung Regency (ages 10–11)'],
        ['Sampling', 'Total sampling'],
        ['Instruments', 'Thinking Creatively in Action and Movement (TCAM); Indonesian Multidimensional Sportspersonship Orientations Scale (MSOS)'],
        ['Software', 'IBM SPSS Statistics 27'],
        ['Analysis', 'Descriptives; Shapiro–Wilk; Pearson r with 5,000 bootstrap resamples (95% BCa CI); Bayesian correlation; bootstrapped Spearman for non-normal TCAM dimensions'],
      ],
      descriptives: [
        { variable: 'Sportsmanship orientation (MSOS)', mean: 75.77, sd: 8.99, level: 'High' },
        { variable: 'Movement creativity (TCAM)', mean: 19.61, sd: 4.27, level: 'Moderate' },
      ],
      ci: { low: -0.471, high: 0.279, estimate: -0.125, resamples: 5000 },
      bayes: { bf01: 5.759, posteriorMean: -0.114, credible: [-0.44, 0.219] },
      implication:
        'Both domains develop through distinct pathways at late elementary age, so PJOK teachers should plan explicit interventions: open-ended movement tasks for creativity and structured character education for sportsmanship.',
    },
    {
      type: 'journal',
      id: 'porkes',
      label: 'Jurnal Porkes 2025',
      kind: 'Peer-Reviewed Journal Article',
      title: 'Pengaruh Pembelajaran Aktivitas Gerak Berirama terhadap Peningkatan Keseimbangan dan Kelincahan Gerak',
      titleAlt: 'Effect of Rhythmic Movement Learning on Improving Dynamic Balance and Agility',
      venue: 'Jurnal Porkes',
      role: 'First & Corresponding Author',
      year: '2025',
      byline: 'Tio Ilham Wahyudi, Ricky Wibowo & Mukhlisin',
      affiliation: 'PGSD Pendidikan Jasmani, Faculty of Sport and Health Education (FPOK), Universitas Pendidikan Indonesia',
      citation: 'Vol. 8, No. 1, pp. 01–09 · April 2025',
      link: 'https://e-journal.hamzanwadi.ac.id/index.php/porkes',
      summary:
        'A 12-session rhythmic movement programme set to Tabola-Bale music for 32 fourth graders at SDN 205 Neglasari, Bandung, produced significant gains in dynamic balance and agility.',
      tags: ['One-group pretest–posttest', 'Modified Bass Test', 'TKSI Phase B T-Test', "Cohen's d", 'N-Gain'],
      metrics: [
        { label: 'Sample (n)', value: 32, decimals: 0 },
        { label: 'Sessions', value: 12, decimals: 0 },
        { label: 'd · balance', value: 2.495, decimals: 3 },
        { label: 'd · agility', value: 0.68, decimals: 3 },
      ],
      images: ['porkes-article'],
      logos: ['upi'],
      cta: 'View Full Abstract',
      // Abstrak asli (bahasa Inggris) dari artikel Jurnal Porkes.
      abstract: [
        'Balance and agility are fundamental motor components that support movement proficiency and physical performance among elementary school students. This study aimed to examine the effect of rhythmic movement learning on improving students’ dynamic balance and agility.',
        "The research employed a quantitative approach using a pre-experimental method with a One-Group Pretest-Posttest design. The sample consisted of 32 fourth-grade students from SDN 205 Neglasari, Bandung City, selected through a total sampling technique. Data were collected using the Modified Bass Test of Dynamic Balance to assess dynamic balance and the TKSI Phase B T-Test to measure agility. Data analysis was conducted using descriptive statistics, the Shapiro-Wilk normality test, and a paired sample t-test, and Cohen's d effect size analysis.",
        'The results showed a significant improvement in dynamic balance (t(31) = −38.906; p < 0.001; N-Gain = 0.437; d = 2.495) and agility (t(31) = 9.291; p < 0.001; N-Gain = 0.314; d = 0.680). These findings indicate that rhythmic movement learning can be an effective and engaging physical education approach for enhancing motor skill development among elementary school students.',
      ],
      keywords: ['agility', 'dynamic balance', 'elementary school', 'physical education', 'rhythmic movement activities'],
      method: [
        ['Design', 'Quantitative, pre-experimental one-group pretest–posttest'],
        ['Participants', '32 fourth-grade students, SDN 205 Neglasari, Bandung City (ages 9–11, mean 10)'],
        ['Sampling', 'Total sampling'],
        ['Intervention', '12 sessions over 4 weeks · 3 sessions per week · 90 minutes each, accompanied by Tabola-Bale music'],
        ['Instruments', 'Modified Bass Test of Dynamic Balance; T-Test from Tes Kebugaran Siswa Indonesia (TKSI) Phase B'],
        ['Analysis', "Descriptives; Shapiro–Wilk; paired-sample t-test; Cohen's d; N-Gain"],
      ],
      program: [
        { sessions: '1–3', focus: 'Basic movement mastery', content: 'Marching, single step, double step, double step + bicep curls' },
        { sessions: '4–6', focus: 'Combinations with arm coordination', content: 'Chest press, heel & toe touch, V-step, pumping, knee up, leg curl' },
        { sessions: '7–9', focus: 'Combinations with changes of direction', content: 'Combined sequences, mambo step and box step with clapping' },
        { sessions: '10–12', focus: 'Complex sequences & evaluation', content: 'Lunges, grapevine + flex, full routine integration and final assessment' },
      ],
      descriptives: [
        {
          measure: 'Dynamic balance',
          unit: 'Modified Bass Test score',
          domain: [40, 80],
          ticks: [40, 50, 60, 70, 80],
          pre: { mean: 52.56, sd: 7.161, min: 43, max: 69 },
          post: { mean: 72.59, sd: 8.809, min: 60, max: 92 },
        },
        {
          measure: 'Agility',
          unit: 'T-Test time (s)',
          lowerIsBetter: true,
          domain: [14, 19],
          ticks: [14, 15, 16, 17, 18, 19],
          pre: { mean: 17.43, sd: 2.744, min: 12.98, max: 25.48 },
          post: { mean: 15.78, sd: 2.065, min: 12.41, max: 20.11 },
        },
      ],
      effects: [
        { outcome: 'Dynamic balance', t: 't(31) = −38.906', p: 'p < 0.001', d: 2.495, ngain: 0.437, magnitude: 'Very large effect' },
        { outcome: 'Agility', t: 't(31) = 9.291', p: 'p < 0.001', d: 0.68, ngain: 0.314, magnitude: 'Medium effect' },
      ],
      conclusion:
        'Rhythmic movement learning had a positive effect on dynamic balance and agility. PJOK teachers can integrate it gradually, as in this study (12 meetings, three per week, 90 minutes each); future work should add a control group, a wider sample and comparisons with other learning models.',
    },
    {
      type: 'project',
      id: 'swipe',
      label: 'PKM-KC SWIPE',
      kind: 'Sport-Tech Hardware · PKM-KC 2025',
      title: 'SWIPE: Smart Whistle Integrated with Precision Electronics',
      venue: 'Program Kreativitas Mahasiswa – Karsa Cipta (PKM-KC) 2025',
      role: 'Member, Research & PE Development Team',
      year: '2025',
      subtitleId: 'Inovasi Peluit Multifungsi dengan Teknologi WhistleSync untuk Efektivitas Guru dan Pelatih Olahraga',
      summary:
        'A multifunctional whistle with WhistleSync technology that lets PE teachers and coaches signal, time and track laps from one handheld device. Nationally funded and taken to the national PKP2 stage.',
      tags: ['ESP-32', 'OLED Display', 'RTC Module', 'Mini Speaker 3W', 'Li-ion Battery', 'Stopwatch & Lap/Flag', 'Tone Mode'],
      metrics: [
        { label: 'Funding', display: 'National', note: 'Kemendikbudristek' },
        { label: 'Stage reached', display: 'PKP2', note: 'National finalist' },
      ],
      images: ['swipe-prototype', 'swipe-schematic'],
      logos: ['upi'],
      cta: 'View Project Details',
      achievements: [
        { label: 'PKM-KC 2025 National Funding', detail: 'Program Kreativitas Mahasiswa – Karsa Cipta · Kemendikbudristek', prestige: true },
        { label: 'National PKP2 Finalist', detail: 'Represented Universitas Pendidikan Indonesia at the PKM progress review (PKP2)' },
      ],
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
    },
    {
      type: 'service',
      id: 'mentoring',
      label: 'Writing & Data Mentoring',
      kind: 'Academic Service',
      title: 'Academic Writing & Data Analysis Mentoring',
      venue: 'Reputable journals (SINTA) & international proceedings',
      role: 'Mentor',
      year: 'Ongoing',
      summary:
        'Guidance for researchers and students from research question to submission: writing reputable articles, statistical analysis in SPSS, SmartPLS and Bayesian frameworks, and bibliometric mapping with VOSviewer.',
      tags: ['SINTA journals', 'International proceedings', 'SPSS', 'SmartPLS', 'Bayesian', 'VOSviewer'],
      metrics: [],
      images: ['coding-laptop', 'upi-class', 'forum-workshop', 'forum-cohort'],
      logos: ['upi'],
      cta: 'View Project Details',
      services: [
        { icon: 'pen', title: 'Reputable article writing', body: 'Structuring and revising manuscripts for SINTA-indexed journals and international conference proceedings.' },
        { icon: 'sigma', title: 'Statistical analysis', body: 'Analysis plans and reporting in SPSS and SmartPLS, including bootstrapping and Bayesian correlation.' },
        { icon: 'network', title: 'Bibliometric mapping', body: 'Literature searches with Publish or Perish and co-occurrence maps in VOSviewer to position a study.' },
      ],
      tools: ['spss', 'smartpls', 'python', 'vosviewer', 'pop', 'mendeley'],
    },
  ] satisfies Work[],

  /* ---------- SECTION 5 · ACHIEVEMENTS & CERTIFICATIONS (12 kartu) ---------- */
  achievements: [
    {
      id: 'tpon',
      title: 'Tenaga Penggerak Olahraga Nasional (TPON)',
      issuer: 'Ministry of Youth and Sports (KEMENPORA), Republic of Indonesia',
      date: '20 July 2026',
      category: 'National Certification',
      icon: 'medal',
      meta: ['No. BO.00.00/7.20.178/SET/VII/2026', '34 JP · online, 7–15 July 2026'],
      note: 'Sport-culture policy, inclusion, community sport management, physical literacy, sport psychology, nutrition, and first aid for sports injuries.',
      prestige: true,
      badge: 'E-signed · BSrE–BSSN',
      visual: {
        kind: 'scan',
        images: [
          { src: 'images/cert-tpon.webp', thumb: 'images/cert-tpon-sm.webp', alt: 'KEMENPORA certificate for the TPON training awarded to Tio Ilham Wahyudi', caption: 'TPON certificate · KEMENPORA RI · 20 July 2026' },
          { src: 'images/cert-tpon-structure.webp', thumb: 'images/cert-tpon-structure-sm.webp', alt: 'Course structure of the 2026 TPON training listing ten modules', caption: 'TPON 2026 · course structure (10 modules)' },
        ],
      },
    },
    {
      id: 'icsdp',
      title: '11th ICSDP 2026 · Certificate of Participation',
      issuer: 'Sport Education Study Program, School of Postgraduate Studies, UPI',
      date: '24–25 November 2026',
      category: 'International Conference',
      icon: 'presentation',
      meta: ['Bandung · signed by the Rector of UPI'],
      note: 'Sole and corresponding author of the accepted paper on creative movement and sportspersonship orientation.',
      logo: 'icsdp',
      visual: {
        kind: 'scan',
        images: [{ src: 'images/cert-icsdp.webp', thumb: 'images/cert-icsdp-sm.webp', alt: 'Certificate of participation in the 11th International Conference of Sport for Development and Peace 2026', caption: '11th ICSDP 2026 · Certificate of Participation' }],
      },
    },
    {
      id: 'stadium-generale',
      title: 'Stadium Generale: “Sport Leadership and Policy”',
      issuer: 'Adjunct Professor Program · Universiti Malaya & FPOK UPI',
      date: '14 November 2023',
      category: 'Stadium Generale',
      icon: 'landmark',
      meta: ['No. 180/UN40.F6/DL.17/2023'],
      note: 'Organised by the PETE for Elementary School Study Program, Faculty of Sport and Health Education.',
      logo: 'upi',
      visual: {
        kind: 'scan',
        images: [{ src: 'images/cert-stadium-generale.webp', thumb: 'images/cert-stadium-generale-sm.webp', alt: 'Participant certificate for the Stadium Generale Sport Leadership and Policy, UPI and Universiti Malaya', caption: 'Stadium Generale · Sport Leadership and Policy · 14 November 2023' }],
      },
    },
    {
      id: 'pkm-kc',
      title: 'PKM-Karsa Cipta National Funding & PKP2 Finalist',
      issuer: 'Kemendikbudristek & Universitas Pendidikan Indonesia',
      date: '2025',
      category: 'National Research Grant',
      icon: 'trophy',
      note: 'SWIPE smart-whistle innovation for PE teachers and coaches.',
      prestige: true,
      logo: 'upi',
      visual: { kind: 'photo', photo: 'swipe-prototype' },
    },
    {
      id: 'ai-ready',
      title: 'AI Ready ASEAN · 15 Learning Modules Completed',
      issuer: 'ASEAN Foundation & Google.org',
      date: '8 September 2026',
      category: 'International Certification',
      icon: 'bot',
      meta: ['12-hour programme'],
      note: 'Generative AI, AI ethics and academic plagiarism, data security, and building simple AI-based tools.',
      visual: {
        kind: 'scan',
        images: [
          { src: 'images/cert-ai-ready.webp', thumb: 'images/cert-ai-ready-sm.webp', alt: 'AI Ready ASEAN certificate of completion presented to Tio Ilham Wahyudi', caption: 'AI Ready ASEAN · Certificate of Completion' },
          { src: 'images/cert-ai-ready-modules.webp', thumb: 'images/cert-ai-ready-modules-sm.webp', alt: 'List of the 15 completed AI Ready ASEAN learning modules', caption: 'AI Ready ASEAN · 15 completed modules' },
        ],
      },
    },
    {
      id: 'meaningful-pe',
      title: 'Guest Lecture: “Meaningful PE: A Background on Its Rationale and Design”',
      issuer: 'Sports Education Study Program, School of Postgraduate Studies, UPI',
      date: '14 October 2026',
      category: 'Guest Lecture',
      icon: 'school',
      logo: 'upi-sps',
      visual: {
        kind: 'scan',
        images: [{ src: 'images/cert-meaningful-pe.webp', thumb: 'images/cert-meaningful-pe-sm.webp', alt: 'Certificate of appreciation for the guest lecture Meaningful PE', caption: 'Meaningful PE · Certificate of Appreciation' }],
      },
    },
    {
      id: 'teacher-skills',
      title: 'Guest Lecture: “Enhancing Teacher Skills and Innovative Pedagogical Approaches in PE”',
      issuer: 'Faculty of Sport and Health Education (FPOK), UPI',
      date: '24 October 2024',
      category: 'Guest Lecture',
      icon: 'school',
      logo: 'upi',
      visual: {
        kind: 'scan',
        images: [{ src: 'images/cert-teacher-skills.webp', thumb: 'images/cert-teacher-skills-sm.webp', alt: 'FPOK UPI certificate for the guest lecture Enhancing Teacher Skills and Innovative Pedagogical Approaches in Physical Education', caption: 'Guest Lecture · FPOK UPI · 24 October 2024' }],
      },
    },
    {
      id: 'cyber-1',
      title: 'Cybersecurity Training for MSMEs · Module 1: Know What You Have and Update Your Defenses',
      issuer: 'MicroMentor by Mercy Corps & Mastercard Center for Inclusive Growth',
      date: '27 May 2023',
      category: 'Training Certificate',
      icon: 'shield',
      visual: { kind: 'scan', images: [{ src: 'images/cert-cyber-1.webp', thumb: 'images/cert-cyber-1-sm.webp', alt: 'Cybersecurity Training for MSMEs module 1 certificate', caption: 'Module 1 · Know What You Have and Update Your Defenses' }] },
    },
    {
      id: 'cyber-2',
      title: 'Cybersecurity Training for MSMEs · Module 2: Beyond Simple Passwords and Prevent Phishing and Malware',
      issuer: 'MicroMentor by Mercy Corps & Mastercard Center for Inclusive Growth',
      date: '2023',
      category: 'Training Certificate',
      icon: 'shield',
      visual: { kind: 'scan', images: [{ src: 'images/cert-cyber-2.webp', thumb: 'images/cert-cyber-2-sm.webp', alt: 'Cybersecurity Training for MSMEs module 2 certificate', caption: 'Module 2 · Beyond Simple Passwords and Prevent Phishing and Malware' }] },
    },
    {
      id: 'cyber-3',
      title: 'Cybersecurity Training for MSMEs · Module 3: Backup and Recover',
      issuer: 'MicroMentor by Mercy Corps & Mastercard Center for Inclusive Growth',
      date: '2023',
      category: 'Training Certificate',
      icon: 'shield',
      visual: { kind: 'scan', images: [{ src: 'images/cert-cyber-3.webp', thumb: 'images/cert-cyber-3-sm.webp', alt: 'Cybersecurity Training for MSMEs module 3 certificate', caption: 'Module 3 · Backup and Recover' }] },
    },
    {
      id: 'cum-laude',
      title: 'Cum Laude Graduate · GPA 3.83 / 4.00',
      issuer: 'Bachelor of Physical Education, FPOK, Universitas Pendidikan Indonesia',
      date: 'Academic distinction',
      category: 'Academic Excellence',
      icon: 'award',
      note: "Graduated with distinction and continued as a fast-track Master's student in Sport Education.",
      prestige: true,
      logo: 'upi',
      visual: { kind: 'emblem', code: 'Cum Laude · 3.83' }, // ← ganti dengan scan ijazah/transkrip bila ingin
    },
    {
      id: 'papila',
      title: 'Swimming Coaching & Aquatics Practice',
      issuer: 'Papila Swim Club',
      date: 'Ongoing',
      category: 'Coaching Practice',
      icon: 'waves',
      note: 'Technique and conditioning sessions for young swimmers built on sport-science principles.',
      logo: 'papila',
      visual: { kind: 'photo', photo: 'swim-coaching' },
    },
  ],

  /* ---------- SECTION 6 · CONTACT ---------- */
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
