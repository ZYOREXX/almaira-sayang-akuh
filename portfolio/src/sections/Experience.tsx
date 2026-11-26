import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { ExperienceItem, Photo } from '../data/types';
import { Section, SectionHeader } from '../components/ui';
import { Reveal } from '../components/Reveal';
import { OrgLogo } from '../components/Logos';
import { Icon } from '../components/Icon';
import { useLightbox } from '../components/Lightbox';
import { cn } from '../lib/utils';

function ExperienceCard({ item }: { item: ExperienceItem }) {
  const openLightbox = useLightbox();
  const photos = (item.photos ?? []).map(getPhoto).filter((p): p is Photo => !!p);
  const items = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }));

  return (
    <article className="exp-card group/exp flex flex-col gap-6 md:flex-row md:items-center">
      {/* Official logos */}
      <div className="flex shrink-0 items-center gap-2 md:w-[188px]">
        {item.logos.length ? (
          item.logos.map((id) => <OrgLogo key={id} id={id} className={cn(item.logos.length > 2 ? 'h-14 w-14' : 'h-20 w-20')} />)
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-2xl border border-line bg-white text-cerulean-600">
            <Icon name={item.icon} className="h-8 w-8" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn('font-display text-[13px] font-bold uppercase tracking-[0.14em]', item.ongoing ? 'text-cerulean-600' : 'text-muted')}>
          {item.ongoing && <span className="live-dot mr-2 align-middle" aria-hidden="true" />}
          {item.period ?? 'Organisation'}
        </p>
        <h3 className="mt-2 font-display text-[1.35rem] font-bold tracking-tight text-ink">{item.role}</h3>
        <p className="mt-0.5 text-[15px] font-semibold text-cerulean-700">{item.org}</p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">{item.body}</p>
      </div>

      {photos.length > 0 && (
        <ul className="flex shrink-0 -space-x-6">
          {photos.map((p, i) => (
            <li key={p.src} style={{ zIndex: photos.length - i }}>
              <button
                type="button"
                onClick={() => openLightbox(items, i)}
                className="media-tile block h-24 w-20 overflow-hidden rounded-2xl border-2 border-white shadow-soft transition-transform duration-500 ease-out hover:-translate-y-1.5 hover:rotate-[-2deg]"
                aria-label={`View photo: ${p.caption}`}
              >
                <img src={p.thumb ?? p.src} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" style={p.position ? { objectPosition: p.position } : undefined} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function Experience() {
  const { experience } = PORTFOLIO_DATA;
  return (
    <Section id="experience" tone="canvas">
      <SectionHeader eyebrow="Experience & leadership" title="Experience & leadership." />
      <ol className="space-y-5">
        {experience.map((item, i) => (
          <Reveal as="li" key={`${item.role}-${item.org}`} delay={i * 0.08}>
            <ExperienceCard item={item as ExperienceItem} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
