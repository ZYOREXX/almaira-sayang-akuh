import type { CSSProperties } from 'react';

/**
 * Ilustrasi hero: lintasan atletik 400 m dilihat dari atas, digambar dengan garis tipis.
 * Geometri mengikuti lintasan standar (dua lurusan 84,39 m dan tikungan berjari-jari 36,50 m).
 */

const CX = 600;
const CY = 400;
const HALF = 255; // setengah panjang lurusan pada skala gambar
const R0 = 110; // jari-jari garis terdalam
const LANE = 26; // lebar satu lintasan
const LANES = 8;

function stadium(r: number): string {
  const left = CX - HALF;
  const right = CX + HALF;
  return `M ${left} ${CY - r} H ${right} A ${r} ${r} 0 0 1 ${right} ${CY + r} H ${left} A ${r} ${r} 0 0 1 ${left} ${CY - r} Z`;
}

const lines = Array.from({ length: LANES + 1 }, (_, i) => R0 + i * LANE);
const laneCentre = (lane: number) => R0 + (lane - 0.5) * LANE;

/** Jejak cahaya yang "berlari" di lintasan tertentu. */
const runners = [
  { lane: 2, length: 46, duration: 13, offset: -2, tone: 'gold' },
  { lane: 4, length: 64, duration: 17, offset: -9, tone: 'crimson' },
  { lane: 5, length: 38, duration: 15, offset: -5, tone: 'gold' },
  { lane: 7, length: 54, duration: 21, offset: -14, tone: 'gold' },
] as const;

const FINISH_X = CX + 150;

export function TrackArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="infield" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#9a1b2f" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#9a1b2f" stopOpacity="0" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Lapangan tengah */}
      <path d={stadium(R0 - 10)} fill="url(#infield)" />
      <g
        stroke="#e3cfa5"
        strokeOpacity="0.16"
        strokeWidth="1"
        className="fade-in"
        style={{ '--d': '900ms' } as CSSProperties}
      >
        <rect x={CX - HALF + 30} y={CY - R0 + 26} width={(HALF - 30) * 2} height={(R0 - 26) * 2} />
        <line x1={CX} y1={CY - R0 + 26} x2={CX} y2={CY + R0 - 26} />
        <circle cx={CX} cy={CY} r="34" />
        <rect x={CX - HALF + 30} y={CY - 44} width="52" height="88" />
        <rect x={CX + HALF - 82} y={CY - 44} width="52" height="88" />
      </g>

      {/* Garis lintasan */}
      <g stroke="#e3cfa5" strokeWidth="1" strokeLinecap="round">
        {lines.map((r, i) => (
          <path
            key={r}
            d={stadium(r)}
            pathLength={1}
            className="lane-draw"
            strokeOpacity={i === 0 || i === LANES ? 0.5 : 0.24}
            style={{ '--d': `${200 + i * 90}ms` } as CSSProperties}
          />
        ))}
      </g>

      {/* Garis finis dan nomor lintasan */}
      <g className="fade-in" style={{ '--d': '1400ms' } as CSSProperties}>
        <line
          x1={FINISH_X}
          y1={CY + R0}
          x2={FINISH_X}
          y2={CY + R0 + LANES * LANE}
          stroke="#f6edd9"
          strokeOpacity="0.7"
          strokeWidth="2"
        />
        {Array.from({ length: LANES }, (_, i) => (
          <text
            key={i}
            x={FINISH_X - 16}
            y={CY + laneCentre(i + 1) + 4}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#e3cfa5"
            fillOpacity="0.55"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {i + 1}
          </text>
        ))}

        {/* Anotasi ukuran, seperti pada gambar teknik */}
        <g fill="#e3cfa5" fillOpacity="0.5" fontSize="11" letterSpacing="2" style={{ fontFamily: 'var(--font-sans)' }}>
          <text x={CX} y={CY - R0 - LANES * LANE - 22} textAnchor="middle">
            84,39 M
          </text>
          <text x={CX + HALF + 46} y={CY + 4} textAnchor="middle">
            R 36,50 M
          </text>
        </g>
        <g stroke="#e3cfa5" strokeOpacity="0.35" strokeWidth="1">
          <line x1={CX - HALF} y1={CY - R0 - LANES * LANE - 14} x2={CX - 46} y2={CY - R0 - LANES * LANE - 14} />
          <line x1={CX + 46} y1={CY - R0 - LANES * LANE - 14} x2={CX + HALF} y2={CY - R0 - LANES * LANE - 14} />
          <line x1={CX - HALF} y1={CY - R0 - LANES * LANE - 19} x2={CX - HALF} y2={CY - R0 - LANES * LANE - 9} />
          <line x1={CX + HALF} y1={CY - R0 - LANES * LANE - 19} x2={CX + HALF} y2={CY - R0 - LANES * LANE - 9} />
          <line x1={CX + HALF} y1={CY} x2={CX + HALF + 12} y2={CY} strokeDasharray="2 4" />
        </g>
      </g>

      {/* Jejak pelari */}
      {runners.map((runner) => {
        const d = stadium(laneCentre(runner.lane));
        const stroke = runner.tone === 'crimson' ? '#d0364f' : '#f6edd9';
        const style = {
          '--len': runner.length,
          '--t': `${runner.duration}s`,
          '--o': `${runner.offset}s`,
        } as CSSProperties;
        return (
          <g key={runner.lane}>
            <path
              d={d}
              pathLength={1000}
              className="lane-run"
              stroke={stroke}
              strokeWidth="7"
              strokeLinecap="round"
              strokeOpacity="0.55"
              filter="url(#glow)"
              style={style}
            />
            <path
              d={d}
              pathLength={1000}
              className="lane-run"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              style={style}
            />
          </g>
        );
      })}
    </svg>
  );
}
