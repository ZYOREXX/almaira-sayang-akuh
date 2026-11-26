import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Icon, type IconName } from './Icon';

/**
 * Section band: alternating #F8FAFC / #FFFFFF background with a dot-matrix grid
 * and soft cerulean + amber ambient glows. `flip` mirrors the glow positions.
 */
export function Section({
  id,
  children,
  className,
  tone = 'canvas',
  flip = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: 'canvas' | 'white';
  flip?: boolean;
}) {
  return (
    <section id={id} className={cn('section band', tone === 'white' ? 'band-white' : 'band-canvas', flip && 'band-flip', className)}>
      <div className="gutter relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div data-reveal className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.03] tracking-[-0.035em] text-ink">{title}</h2>
        {lead && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">{lead}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}

/** Amber "prestige" badge reserved for top achievements. */
export function PrestigeBadge({ icon, label, detail, className }: { icon: IconName; label: string; detail: string; className?: string }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border border-prestige-line bg-prestige-soft px-3.5 py-3', className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/80 text-prestige shadow-[0_1px_2px_rgba(120,53,15,0.12)]">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold leading-snug text-prestige">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-snug text-prestige-deep/85">{detail}</span>
      </span>
    </div>
  );
}

// Literal class names (Tailwind only keeps classes it can find in the source).
const CHIP_TONE = { plain: '', cerulean: 'chip-cerulean', prestige: 'chip-prestige', ink: 'chip-ink' } as const;

export function Chip({ children, tone = 'plain', className }: { children: ReactNode; tone?: keyof typeof CHIP_TONE; className?: string }) {
  return <span className={cn('chip', CHIP_TONE[tone], className)}>{children}</span>;
}
