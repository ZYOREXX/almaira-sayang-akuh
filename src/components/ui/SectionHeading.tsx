import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: 'light' | 'dark';
  id?: string;
  className?: string;
};

/**
 * Kepala bagian: nomor lintasan, label kecil, dan judul serif.
 * `tone="dark"` dipakai di atas latar gelap.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  tone = 'light',
  id,
  className = '',
}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <header className={className}>
      <Reveal className="flex items-center gap-4">
        <span
          className={`numeral text-[1.375rem] italic leading-none ${dark ? 'text-champagne-300' : 'text-crimson-600'}`}
          aria-hidden="true"
        >
          {index}
        </span>
        <span className={`h-px w-10 ${dark ? 'bg-champagne-300/40' : 'bg-ink-900/25'}`} aria-hidden="true" />
        <span className={`eyebrow ${dark ? 'text-champagne-200/80' : 'text-taupe-600'}`}>{eyebrow}</span>
      </Reveal>
      <Reveal delay={80}>
        <h2
          id={id}
          className={`display mt-6 text-[clamp(2.375rem,4.6vw,4rem)] text-balance ${
            dark ? 'text-ivory-50 [&_em]:text-champagne-300' : 'text-ink-900 [&_em]:text-crimson-600'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={160}>
          <p
            className={`mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.75] text-pretty ${
              dark ? 'text-ivory-200/75' : 'text-taupe-600'
            }`}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
