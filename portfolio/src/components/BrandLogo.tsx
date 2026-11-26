import { BRAND, type BrandId, type BrandMark } from '../data/brandIcons';

type Props = { id: BrandId; size?: number; className?: string; decorative?: boolean };

/** Renders an official brand SVG path, or a custom badge for tools without one. */
export function BrandLogo({ id, size = 24, className, decorative = false }: Props) {
  const b: BrandMark = BRAND[id];
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': `${b.title} logo` };
  const common = { width: size, height: size, viewBox: '0 0 24 24', className, ...a11y };
  const fill = `#${b.hex}`;

  if (b.kind === 'path') {
    return (
      <svg {...common} xmlns="http://www.w3.org/2000/svg">
        <path d={b.path} fill={fill} />
      </svg>
    );
  }

  if (b.kind === 'badge') {
    const fs = b.text.length >= 4 ? 6.6 : b.text.length === 3 ? 8 : 10;
    return (
      <svg {...common} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5.5" fill={fill} />
        <text
          x="12"
          y="12.4"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight={800}
          fontSize={fs}
          letterSpacing={b.text.length >= 4 ? -0.2 : -0.3}
        >
          {b.text}
        </text>
      </svg>
    );
  }

  // Custom glyphs (simple stand-ins, not the vendors' logos).
  switch (b.glyph) {
    case 'smartpls': // PLS-SEM path model: two latent variables + indicators
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5.5" fill={fill} />
          <circle cx="7.3" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.6" />
          <circle cx="16.7" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.6" />
          <path d="M10.8 12h1.9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          <path d="m12.4 10.6 1.6 1.4-1.6 1.4" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="5.6" y="3.6" width="3.4" height="2.4" rx=".6" fill="#fff" />
          <rect x="15" y="18" width="3.4" height="2.4" rx=".6" fill="#fff" />
        </svg>
      );
    case 'vosviewer': // co-occurrence network with coloured clusters
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <g stroke="#94A3B8" strokeWidth=".9">
            <path d="M6 7.5 12 11l6-4.5M12 11l-5 6.5M12 11l6.5 6M6 7.5l1 10M18 6.5l.5 11" />
          </g>
          <circle cx="12" cy="11" r="3" fill={fill} />
          <circle cx="6" cy="7.5" r="2.2" fill="#E11D48" />
          <circle cx="18" cy="6.5" r="2" fill="#16A34A" />
          <circle cx="7" cy="17.5" r="2.3" fill="#F59E0B" />
          <circle cx="18.5" cy="17.5" r="1.8" fill="#7C3AED" />
        </svg>
      );
    case 'capcut': // crossing cut marks
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5.5" fill={fill} />
          <path d="M7 7.5 17 16.5M17 7.5 7 16.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.5" fill={fill} stroke="#fff" strokeWidth="1.2" />
        </svg>
      );
    case 'snapseed': // leaf
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5.5" fill={fill} />
          <path d="M6.2 17.8C6.2 10.9 10.6 6.5 17.8 6.2c-.3 7.2-4.7 11.6-11.6 11.6Z" fill="#fff" />
          <path d="m6.6 17.4 6.6-6.6" stroke={fill} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function brandTitle(id: BrandId): string {
  return BRAND[id].title;
}
