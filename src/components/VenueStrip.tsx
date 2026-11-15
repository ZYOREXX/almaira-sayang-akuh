import type { ReactNode } from 'react';

/**
 * Denah arena multi-cabang olahraga, digambar tampak atas dengan proporsi ukuran resmi.
 * Dipakai sebagai "panorama" bergerak di jendela hero.
 */
const W = 360; // lebar satu petak
const H = 200;

type Venue = { name: string; size: string; w: number; h: number; draw: (w: number, h: number) => ReactNode };

const venues: Venue[] = [
  {
    name: 'LINTASAN ATLETIK',
    size: '400 M · 8 LINTASAN',
    w: 300,
    h: 150,
    draw: (w, h) =>
      [0, 7, 14, 21, 28].map((d) => (
        <rect key={d} x={d} y={d} width={w - 2 * d} height={h - 2 * d} rx={(h - 2 * d) / 2} />
      )),
  },
  {
    name: 'SEPAK BOLA',
    size: '105 × 68 M',
    w: 232,
    h: 150,
    draw: (w, h) => (
      <>
        <rect width={w} height={h} />
        <line x1={w / 2} y1={0} x2={w / 2} y2={h} />
        <circle cx={w / 2} cy={h / 2} r={20} />
        <rect x={0} y={h / 2 - 44} width={36} height={88} />
        <rect x={w - 36} y={h / 2 - 44} width={36} height={88} />
        <rect x={0} y={h / 2 - 20} width={12} height={40} />
        <rect x={w - 12} y={h / 2 - 20} width={12} height={40} />
      </>
    ),
  },
  {
    name: 'BOLA BASKET',
    size: '28 × 15 M',
    w: 280,
    h: 150,
    draw: (w, h) => (
      <>
        <rect width={w} height={h} />
        <line x1={w / 2} y1={0} x2={w / 2} y2={h} />
        <circle cx={w / 2} cy={h / 2} r={18} />
        <rect x={0} y={h / 2 - 24} width={58} height={48} />
        <rect x={w - 58} y={h / 2 - 24} width={58} height={48} />
        <path d={`M 0 ${h / 2 - 66} H 28 A 68 68 0 0 1 28 ${h / 2 + 66} H 0`} />
        <path d={`M ${w} ${h / 2 - 66} H ${w - 28} A 68 68 0 0 0 ${w - 28} ${h / 2 + 66} H ${w}`} />
      </>
    ),
  },
  {
    name: 'BULU TANGKIS',
    size: '13,40 × 6,10 M',
    w: 300,
    h: 136,
    draw: (w, h) => (
      <>
        <rect width={w} height={h} />
        <line x1={w / 2} y1={-8} x2={w / 2} y2={h + 8} strokeWidth={2} />
        <line x1={0} y1={10} x2={w} y2={10} />
        <line x1={0} y1={h - 10} x2={w} y2={h - 10} />
        <line x1={17} y1={0} x2={17} y2={h} />
        <line x1={w - 17} y1={0} x2={w - 17} y2={h} />
        <line x1={w / 2 - 44} y1={0} x2={w / 2 - 44} y2={h} />
        <line x1={w / 2 + 44} y1={0} x2={w / 2 + 44} y2={h} />
        <line x1={0} y1={h / 2} x2={w / 2 - 44} y2={h / 2} />
        <line x1={w / 2 + 44} y1={h / 2} x2={w} y2={h / 2} />
      </>
    ),
  },
  {
    name: 'KOLAM RENANG',
    size: '50 × 25 M · 8 LINTASAN',
    w: 300,
    h: 150,
    draw: (w, h) => (
      <>
        <rect width={w} height={h} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={0} y1={((i + 1) * h) / 8} x2={w} y2={((i + 1) * h) / 8} strokeDasharray="10 5" />
        ))}
      </>
    ),
  },
  {
    name: 'BOLA VOLI',
    size: '18 × 9 M',
    w: 300,
    h: 150,
    draw: (w, h) => (
      <>
        <rect width={w} height={h} />
        <line x1={w / 2} y1={-8} x2={w / 2} y2={h + 8} strokeWidth={2} />
        <line x1={w / 2 - 50} y1={0} x2={w / 2 - 50} y2={h} />
        <line x1={w / 2 + 50} y1={0} x2={w / 2 + 50} y2={h} />
      </>
    ),
  },
];

function Row({ offset }: { offset: number }) {
  return (
    <g transform={`translate(${offset} 0)`}>
      {venues.map((venue, i) => (
        <g key={venue.name} transform={`translate(${i * W + (W - venue.w) / 2} ${(H - 30 - venue.h) / 2 + 4})`}>
          <g stroke="#f3e2bd" strokeOpacity="0.85" strokeWidth="1.1" fill="none">
            {venue.draw(venue.w, venue.h)}
          </g>
          <text
            x={venue.w / 2}
            y={venue.h + 24}
            textAnchor="middle"
            fontSize="8"
            letterSpacing="2"
            fill="#f3e2bd"
            fillOpacity="0.6"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {venue.name} · {venue.size}
          </text>
        </g>
      ))}
    </g>
  );
}

export function VenueStrip({ className = '' }: { className?: string }) {
  const total = venues.length * W;
  return (
    <svg
      viewBox={`0 0 ${total * 2} ${H}`}
      className={className}
      style={{ width: `${(total * 2 * 100) / 1100}%` }}
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <Row offset={0} />
      <Row offset={total} />
    </svg>
  );
}
