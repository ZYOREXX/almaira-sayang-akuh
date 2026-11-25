// Semua angka penyeimbang (balancing) game ada di sini.
// Satuan dunia: meter dan detik.

export const POOL = {
  length: 50, // kolam olimpiade 50 m
  lanes: 8,
  laneWidth: 2.5,
  sideWater: 0.6, // air di luar lintasan 1 dan 8
  deckX: 3.4, // lebar dek di ujung kolam (tempat start block)
  deckY: 2.2, // lebar dek di sisi panjang kolam
};
POOL.waterWidth = POOL.lanes * POOL.laneWidth + POOL.sideWater * 2;

export const WORLD = {
  minX: -POOL.deckX,
  maxX: POOL.length + POOL.deckX,
  minY: -POOL.deckY,
  maxY: POOL.waterWidth + POOL.deckY,
};
WORLD.width = WORLD.maxX - WORLD.minX;
WORLD.height = WORLD.maxY - WORLD.minY;

export const laneCenterY = (lane) => POOL.sideWater + (lane - 0.5) * POOL.laneWidth;

export const PLAYER_LANE = 4;
export const DISTANCES = [50, 100, 200];

// Simulasi memakai langkah waktu tetap agar hasil lomba deterministik terhadap FPS.
export const SIM_STEP = 1 / 120;
export const WARP_AFTER_PLAYER_FINISH = 3; // percepat sisa lomba setelah pemain finis

// Ritme kayuhan: interval (detik) antar tekan tombol.
export const RHYTHM = {
  sweetMin: 0.36,
  sweetMax: 0.56,
  perfectHalfWidth: 0.04, // jendela "PERFECT" di tengah sweet spot
  meterMax: 1.0, // panjang skala indikator ritme
  fatigueShift: 0.1, // sweet spot bergeser lebih lambat saat stamina turun
};

export const PHYSICS = {
  drag: 1.2, // perlambatan eksponensial per detik (air)
  strokeImpulse: 1.12, // tambahan kecepatan per kayuhan ideal
  perfectBonus: 1.07,
  fastQualityBase: 0.8, // kayuhan terlalu cepat: kualitas = base * (interval/sweetMin)^2
  slowQuality: 0.94,
  maxSpeed: 3.2,
};

export const STAMINA = {
  max: 100,
  regenPerSec: 0.85,
  costPerfect: 1.0,
  costSweet: 1.1,
  costSlow: 0.35,
  costFast: 3.8, // dikali seberapa jauh di bawah sweet spot (maks 2.5x)
  lowThreshold: 30,
  minFactor: 0.35, // efektivitas kayuhan saat stamina 0
};

export const DIVE = {
  flightTime: 0.5,
  flightMin: 3.0,
  flightMax: 4.6,
  entrySpeedMin: 2.0,
  entrySpeedMax: 3.0,
  autoDiveAt: 2.5, // pemain yang lupa dive akan melompat otomatis (buruk)
  falseStartPenalty: 1.0,
  glideTime: 0.6,
};

export const TURN = {
  zoneStart: 4.2, // tombol Flip Turn aktif mulai jarak ini dari dinding
  idealNear: 1.3,
  idealFar: 2.5,
  baseDuration: 0.45,
  pushMin: 1.6,
  pushMax: 2.75,
  openDuration: 1.3, // jika lupa flip: open turn yang lambat
  openPush: 1.45,
};

export const AI_TIERS = {
  pemula: {
    key: 'pemula',
    label: 'Pemula',
    speed: 1.5,
    spread: 0.07,
    reaction: [0.32, 0.55],
    fade: 0.12,
    diveQuality: [0.25, 0.5],
    turnQuality: [0.2, 0.5],
    turnAt: [2.2, 3.0],
    cadence: 1.55,
    sprint: 0,
  },
  nasional: {
    key: 'nasional',
    label: 'Atlet Nasional',
    speed: 1.86,
    spread: 0.04,
    reaction: [0.2, 0.32],
    fade: 0.07,
    diveQuality: [0.55, 0.8],
    turnQuality: [0.5, 0.8],
    turnAt: [1.6, 2.4],
    cadence: 1.95,
    sprint: 0.02,
  },
  juara: {
    key: 'juara',
    label: 'Juara Olimpiade',
    speed: 2.04,
    spread: 0.025,
    reaction: [0.13, 0.2],
    fade: 0.035,
    diveQuality: [0.85, 1],
    turnQuality: [0.85, 1],
    turnAt: [1.6, 2.2],
    cadence: 2.2,
    sprint: 0.035,
  },
};

// Komposisi 7 lawan per tingkat kompetisi.
export const FIELD_PRESETS = {
  mudah: { label: 'Mudah — Kejuaraan Daerah', tiers: ['nasional', 'nasional', 'pemula', 'pemula', 'pemula', 'pemula', 'pemula'] },
  sedang: { label: 'Sedang — Kejuaraan Nasional', tiers: ['juara', 'nasional', 'nasional', 'nasional', 'pemula', 'pemula', 'pemula'] },
  sulit: { label: 'Sulit — Final Olimpiade', tiers: ['juara', 'juara', 'juara', 'juara', 'nasional', 'nasional', 'nasional'] },
};

// Seeding ala final: lawan tercepat di lintasan tengah.
export const SEED_LANES = [5, 3, 6, 2, 7, 1, 8];

export const RIVALS = [
  { name: 'R. Kurniawan', country: 'INA' },
  { name: 'M. Tanaka', country: 'JPN' },
  { name: 'L. Moreau', country: 'FRA' },
  { name: 'J. Okafor', country: 'NGR' },
  { name: 'S. Lindqvist', country: 'SWE' },
  { name: 'D. Alvarez', country: 'MEX' },
  { name: 'K. Novak', country: 'CZE' },
  { name: 'A. Haddad', country: 'EGY' },
  { name: 'T. Becker', country: 'GER' },
  { name: 'C. Silva', country: 'BRA' },
  { name: 'H. Park', country: 'KOR' },
  { name: 'E. Walsh', country: 'AUS' },
];

export const CAP_COLORS = {
  1: '#f59e0b',
  2: '#22c55e',
  3: '#a855f7',
  4: '#ef4444', // pemain
  5: '#facc15',
  6: '#06b6d4',
  7: '#f97316',
  8: '#ec4899',
};

export const SKIN_TONES = ['#f1c7a5', '#d9a47c', '#b97b56', '#8d5a3b', '#e8b48f', '#6b4429'];
