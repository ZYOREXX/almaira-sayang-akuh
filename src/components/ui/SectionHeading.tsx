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
          className={`numeral text-[1.375rem] italic leading-none ${dark ? 'text-sun-300' : 'text-royal-600'}`}
          aria-hidden="true"
        >
          {index}
        </span>
        <span className={`h-px w-10 ${dark ? 'bg-sun-300/40' : 'bg-navy-900/25'}`} aria-hidden="true" />
        <span className={`eyebrow ${dark ? 'text-sun-200/80' : 'text-mute-600'}`}>{eyebrow}</span>
      </Reveal>
      <Reveal delay={80}>
        <h2
          id={id}
          className={`display mt-6 text-[clamp(1.875rem,3.4vw,2.875rem)] text-balance ${
            dark ? 'text-paper-50 [&_em]:text-sun-300' : 'text-navy-900 [&_em]:text-royal-600'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={160}>
          <p
            className={`mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.75] text-pretty ${
              dark ? 'text-paper-200/75' : 'text-mute-600'
            }`}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
