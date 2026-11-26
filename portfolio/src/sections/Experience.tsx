import { useRef } from 'react';
import { Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Photo } from '../data/types';
import { Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { ParallaxImage } from '../components/ParallaxImage';
import { useLightbox } from '../components/Lightbox';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';

export function Experience() {
  const { experience, leadership } = PORTFOLIO_DATA;
  const openLightbox = useLightbox();
  const listRef = useRef<HTMLDivElement>(null);

  const photoIds = experience.map((e) => ('photo' in e ? e.photo : undefined)).filter((id): id is string => !!id);
  const photos = photoIds.map(getPhoto).filter((p): p is Photo => !!p);
  const photoItems = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }));

  // Timeline progress line fills as the list scrolls past (scrubbed).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-progress]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: listRef.current, start: 'top 70%', end: 'bottom 55%', scrub: 0.4 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: listRef },
  );

  return (
    <Section id="experience">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="Coaching, events & leadership"
              title="On the pool deck and the race course."
              lead="Coaching and event operations keep the research grounded in real sessions and real race days."
            />
            <div data-reveal className="grid grid-cols-2 gap-3">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => openLightbox(photoItems, i)}
                  className={cn('media-tile group/media relative block aspect-[4/5] w-full overflow-hidden rounded-[22px] text-left', i === 1 && 'mt-10')}
                  aria-label={`Enlarge photo: ${p.caption}`}
                >
                  <ParallaxImage src={p.thumb ?? p.src} alt={p.alt} position={p.position} imgClassName="media-zoom" intensity={8} />
                  <span className="media-caption">
                    <span className="line-clamp-2">{p.caption}</span>
                    <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={listRef} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-4 left-[22px] top-4 w-px bg-line" />
          <span aria-hidden="true" data-progress className="absolute bottom-4 left-[22px] top-4 w-px origin-top bg-cerulean-600" />

          <ol className="space-y-4">
            {experience.map((e) => (
              <li key={`${e.role}-${e.org}`} data-reveal className="relative pl-[64px]">
                <span
                  className={cn(
                    'absolute left-0 top-5 grid h-11 w-11 place-items-center rounded-2xl border bg-white shadow-soft',
                    'ongoing' in e && e.ongoing ? 'border-cerulean-300 text-cerulean-600 ring-4 ring-cerulean-100' : 'border-line text-ink',
                  )}
                  aria-hidden="true"
                >
                  <Icon name={e.icon} className="h-5 w-5" />
                </span>
                <SpotlightCard innerClassName="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-cerulean-700">{e.org}</p>
                    {'period' in e && e.period && (
                      <span className={cn('split-chip', 'ongoing' in e && e.ongoing && 'split-chip-live')}>
                        {'ongoing' in e && e.ongoing && <span className="live-dot" aria-hidden="true" />}
                        {e.period}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-[1.15rem] font-bold tracking-tight text-ink">{e.role}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{e.body}</p>
                </SpotlightCard>
              </li>
            ))}

            <li data-reveal className="relative pl-[64px]">
              <span className="absolute left-0 top-5 grid h-11 w-11 place-items-center rounded-2xl border border-line bg-ink text-white shadow-soft" aria-hidden="true">
                <Icon name="users" className="h-5 w-5" />
              </span>
              <SpotlightCard innerClassName="p-5 sm:p-6">
                <p className="text-[13px] font-semibold text-cerulean-700">Organizational leadership</p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {leadership.map((l) => (
                    <li key={l.org} className="rounded-2xl border border-line bg-canvas/70 p-4">
                      <p className="text-[14.5px] font-bold leading-snug text-ink">{l.org}</p>
                      <p className="mt-1 text-[13px] text-muted">{l.unit}</p>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{l.note}</p>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  );
}
