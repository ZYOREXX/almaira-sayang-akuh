import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Images } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Photo, Work } from '../data/types';
import type { BrandId } from '../data/brandIcons';
import { Chip, Section, SectionHeader } from '../components/ui';
import { MetricCard } from '../components/MetricCard';
import { CiAxis, PrePost } from '../components/StatViz';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { LogoDock } from '../components/LogoDock';
import { useLightbox } from '../components/Lightbox';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';
import { WorkDetail } from './WorkDetail';

const pad = (n: number) => String(n).padStart(2, '0');

/** Left column: description + statistical visual for the selected work. */
function WorkSummary({ work, index, onOpen }: { work: Work; index: number; onOpen: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-label text-[12px] font-bold tracking-[0.12em] text-cerulean-700">{pad(index + 1)}</span>
        <Chip tone="cerulean">{work.kind}</Chip>
        <Chip tone="ink">{work.role}</Chip>
      </div>
      <h3 className="mt-5 font-display text-[clamp(1.4rem,2.6vw,1.95rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink">{work.title}</h3>
      {work.titleAlt && <p className="mt-2 text-[15px] font-medium italic text-muted">{work.titleAlt}</p>}
      <p className="mt-3 text-[13.5px] font-medium text-muted">
        {work.venue} · {work.year}
      </p>
      <p className="mt-4 text-[15.5px] leading-relaxed text-ink/85">{work.summary}</p>

      {work.metrics.length > 0 && (
        <div className={cn('mt-6 grid gap-2.5', work.metrics.length > 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2')}>
          {work.metrics.map((m) => (
            <MetricCard key={m.label} m={m} compact />
          ))}
        </div>
      )}

      <div className="mt-5">
        {work.type === 'conference' && (
          <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
            <CiAxis {...work.ci} />
          </div>
        )}
        {work.type === 'journal' && (
          <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
            <PrePost row={work.descriptives[0]} />
          </div>
        )}
        {work.type === 'project' && (
          <ul className="flex flex-wrap gap-2">
            {work.specs.map((s) => (
              <li key={s.label} className="chip">
                <Icon name={s.icon} className="h-3.5 w-3.5 text-cerulean-600" />
                {s.label}
              </li>
            ))}
          </ul>
        )}
        {work.type === 'service' && (
          <div className="rounded-2xl border border-line bg-canvas/70 p-4">
            <ul className="space-y-2.5">
              {work.services.map((s) => (
                <li key={s.title} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-cerulean-600 ring-1 ring-line">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-[13.5px] leading-snug">
                    <span className="block font-semibold text-ink">{s.title}</span>
                    <span className="text-muted">{s.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <LogoDock tools={work.tools as BrandId[]} size="sm" className="mt-4" />
          </div>
        )}
      </div>

      {work.type !== 'project' && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {work.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7">
        <motion.button type="button" onClick={onOpen} className="link-cta group/cta" whileTap={{ scale: 0.97 }}>
          {work.cta}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
}

/** Right column: stacked card deck (video reference). Front card = selected work. */
function Deck({ works, active, onSelect, onView }: { works: Work[]; active: number; onSelect: (i: number) => void; onView: (w: Work) => void }) {
  const n = works.length;
  return (
    <div className="relative mx-auto w-full max-w-[720px] pt-[60px]">
      <div className="relative aspect-[4/3]">
        {works.map((w, i) => {
          const depth = (i - active + n) % n;
          const cover = getPhoto(w.images[0]);
          const front = depth === 0;
          return (
            <motion.button
              key={w.id}
              type="button"
              className="deck-card group/deck text-left"
              style={{ zIndex: 20 - depth, originY: 0 }}
              initial={false}
              animate={{ y: -depth * 20, scale: 1 - depth * 0.06 }}
              whileHover={{ y: -depth * 20 - (front ? 6 : 10) }}
              transition={{ type: 'spring', stiffness: 230, damping: 26 }}
              onClick={() => (front ? onView(w) : onSelect(i))}
              tabIndex={front ? 0 : -1}
              aria-label={front ? `View images: ${w.label}` : `Show ${w.label}`}
            >
              {cover && (
                <img
                  src={cover.src}
                  alt={front ? cover.alt : ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={cn(
                    'absolute inset-0 h-full w-full transition-transform duration-700 group-hover/deck:scale-[1.03]',
                    cover.fit === 'contain' ? 'object-contain p-6 sm:p-8' : 'object-cover',
                  )}
                  style={cover.position ? { objectPosition: cover.position } : undefined}
                />
              )}
              {!front && <span aria-hidden="true" className="absolute inset-0 bg-white/30" />}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-5 pb-4 pt-16 text-white">
                <span className="min-w-0">
                  <span className="block font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                    {pad(i + 1)} · {w.kind}
                  </span>
                  <span className="mt-1 block truncate font-display text-[17px] font-bold">{w.label}</span>
                </span>
                {front && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold backdrop-blur">
                    <Images className="h-3.5 w-3.5" aria-hidden="true" />
                    {w.images.length}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function Works() {
  const works = PORTFOLIO_DATA.works as Work[];
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const openLightbox = useLightbox();
  const deckRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpenId(null), []);
  const work = works[active];
  const open = works.find((w) => w.id === openId);

  // Deck rises and un-tilts as it scrolls into view (scrubbed).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          deckRef.current,
          { y: 70, rotateX: 14, transformPerspective: 1400, transformOrigin: '50% 100%' },
          { y: 0, rotateX: 0, ease: 'none', scrollTrigger: { trigger: deckRef.current, start: 'top bottom', end: 'top 35%', scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: deckRef },
  );

  const viewImages = (w: Work) => {
    const photos = w.images.map(getPhoto).filter((p): p is Photo => !!p);
    openLightbox(photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption })));
  };

  return (
    <Section id="works" tone="white">
      <SectionHeader
        eyebrow="Selected works & research projects"
        title="Selected works."
        lead="Research papers, a sport-tech prototype and academic mentoring. Pick a project below; the card deck and the statistics update with it."
        aside={
          <p className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-line [-webkit-text-stroke:1px_#94a3b8]" aria-hidden="true">
            {pad(active + 1)}/{pad(works.length)}
          </p>
        }
      />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkSummary work={work} index={active} onOpen={() => setOpenId(work.id)} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="lg:col-span-7">
          <div ref={deckRef} className="lg:sticky lg:top-28 lg:pt-2">
          <Deck works={works} active={active} onSelect={setActive} onView={viewImages} />
          </div>
        </div>
      </div>

      {/* 4 interactive thumbnails */}
      <div role="tablist" aria-label="Select a work" className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {works.map((w, i) => {
          const cover = getPhoto(w.images[0]);
          const selected = i === active;
          return (
            <motion.button
              key={w.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={cn('relative overflow-hidden rounded-2xl border bg-white text-left shadow-soft transition-colors', selected ? 'border-cerulean-300' : 'border-line hover:border-cerulean-200')}
            >
              <span className={cn('relative block aspect-[16/10] overflow-hidden', cover?.fit === 'contain' ? 'bg-canvas' : 'bg-ink/5')}>
                {cover && (
                  <img
                    src={cover.thumb ?? cover.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn('absolute inset-0 h-full w-full transition-transform duration-500', cover.fit === 'contain' ? 'object-contain p-2' : 'object-cover', selected ? 'scale-105' : '')}
                  />
                )}
              </span>
              <span className="block p-3 sm:p-4">
                <span className="block font-label text-[11px] font-bold tracking-[0.12em] text-cerulean-700">{pad(i + 1)}</span>
                <span className="mt-1 block text-[13.5px] font-semibold leading-snug text-ink">{w.label}</span>
              </span>
              {selected && (
                <motion.span layoutId="work-tab" className="absolute inset-x-0 bottom-0 h-[3px] bg-cerulean-600" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {open && (
          <Dialog
            key={open.id}
            labelledBy={`work-${open.id}-title`}
            onClose={close}
            eyebrow={
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="cerulean">{open.label}</Chip>
                <Chip tone="ink">{open.role}</Chip>
              </div>
            }
          >
            <WorkDetail
              work={open}
              onContact={() => {
                close();
                window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 250);
              }}
            />
          </Dialog>
        )}
      </AnimatePresence>
    </Section>
  );
}
