import { Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { ExperienceItem, Photo } from '../data/types';
import { Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { useLightbox } from '../components/Lightbox';
import { cn } from '../lib/utils';

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
  const openLightbox = useLightbox();
  const photos = (item.photos ?? []).map(getPhoto).filter((p): p is Photo => !!p);
  const items = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }));

  return (
    <SpotlightCard tilt={1.5} innerClassName="grid gap-5 p-5 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-7">
      <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
        <span className="font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.04em] text-line [-webkit-text-stroke:1px_#94a3b8]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={cn(
            'grid h-11 w-11 place-items-center rounded-2xl border bg-white',
            item.ongoing ? 'border-cerulean-300 text-cerulean-600 ring-4 ring-cerulean-100' : 'border-line text-ink',
          )}
        >
          <Icon name={item.icon} className="h-5 w-5" />
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="font-label text-[12px] font-semibold uppercase tracking-[0.1em] text-cerulean-700">{item.org}</p>
          {item.period && (
            <span className={cn('split-chip', item.ongoing && 'split-chip-live')}>
              {item.ongoing && <span className="live-dot" aria-hidden="true" />}
              {item.period}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-[1.2rem] font-bold tracking-tight text-ink">{item.role}</h3>
        <p className="mt-1.5 max-w-[68ch] text-[14.5px] leading-relaxed text-muted">{item.body}</p>
      </div>

      {photos.length > 0 && (
        <ul className="flex gap-2">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => openLightbox(items, i)}
                className="media-tile group/media relative block h-[88px] w-[112px] overflow-hidden rounded-2xl border border-line"
                aria-label={`Enlarge photo: ${p.caption}`}
              >
                <img src={p.thumb ?? p.src} alt={p.alt} loading="lazy" decoding="async" className="media-zoom absolute inset-0 h-full w-full object-cover" style={p.position ? { objectPosition: p.position } : undefined} />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 text-white opacity-0 transition duration-300 group-hover/media:bg-ink/35 group-hover/media:opacity-100">
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SpotlightCard>
  );
}

export function Experience() {
  const { experience } = PORTFOLIO_DATA;
  return (
    <Section id="experience" tone="canvas">
      <SectionHeader
        eyebrow="Experience & leadership"
        title="Coaching, events & leadership."
        lead="Pool sessions, race days and campus organisations keep the research grounded in real practice."
      />
      <ol className="space-y-4">
        {experience.map((item, i) => (
          <li key={`${item.role}-${item.org}`} data-reveal>
            <ExperienceCard item={item as ExperienceItem} index={i} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
