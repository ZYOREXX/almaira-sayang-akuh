import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Photo, Work } from '../data/types';
import { Chip, Section, SectionHeader } from '../components/ui';
import { MetricCard } from '../components/MetricCard';
import { Dialog } from '../components/Dialog';
import { OrgLogo } from '../components/Logos';
import { PhotoSlider } from '../components/PhotoSlider';
import { EASE, Reveal } from '../components/Reveal';
import { Tilt } from '../components/Tilt';
import { cn } from '../lib/utils';
import { WorkDetail } from './WorkDetail';

const pad = (n: number) => String(n).padStart(2, '0');
const isPaper = (w: Work) => w.type === 'conference' || w.type === 'journal';

function WorkSummary({ work, onOpen }: { work: Work; onOpen: () => void }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {work.logos.map((id) => (
          <OrgLogo key={id} id={id} className={cn('h-12', id === 'icsdp' || id === 'upi-sps' ? 'w-36' : 'w-12')} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Chip tone="cerulean">{work.kind}</Chip>
        <Chip tone="ink">{work.role}</Chip>
      </div>
      <h3 className={cn('mt-5 leading-[1.22] text-ink', isPaper(work) ? 'font-serif text-[clamp(1.5rem,2.6vw,2.05rem)] font-semibold' : 'font-display text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold tracking-[-0.02em]')}>
        {work.type === 'journal' && work.titleAlt ? work.titleAlt : work.title}
      </h3>
      <p className="mt-3 text-[14px] font-medium text-muted">
        {work.venue} · {work.year}
      </p>
      <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-ink/80">{work.summary}</p>
      {work.metrics.length > 0 && (
        <div className={cn('mt-7 grid gap-3', work.metrics.length > 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2')}>
          {work.metrics.map((m) => (
            <MetricCard key={m.label} m={m} compact />
          ))}
        </div>
      )}
      <motion.button type="button" onClick={onOpen} className="link-cta group/cta mt-8" whileTap={{ scale: 0.97 }}>
        {work.cta}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export function Works() {
  const works = PORTFOLIO_DATA.works as Work[];
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const work = works[active];
  const open = works.find((w) => w.id === openId);
  const photos = work.images.map(getPhoto).filter((p): p is Photo => !!p);

  return (
    <Section id="works" tone="white">
      <SectionHeader eyebrow="Selected works & research projects" title="Selected works." />

      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={work.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55, ease: EASE }}>
              <WorkSummary work={work} onOpen={() => setOpenId(work.id)} />
            </motion.div>
          </AnimatePresence>
        </div>
        <Reveal className="lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={work.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: EASE }}>
              <PhotoSlider photos={photos} />
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>

      {/* Thumbnails to switch the active project */}
      <div role="tablist" aria-label="Select a work" className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {works.map((w, i) => {
          const cover = getPhoto(w.images[0]);
          const selected = i === active;
          return (
            <Tilt key={w.id} max={7} scale={1.04} className="rounded-2xl">
            <motion.button
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={cn('relative block w-full overflow-hidden rounded-2xl border bg-white text-left shadow-soft transition-colors', selected ? 'border-cerulean-300' : 'border-line hover:border-cerulean-200')}
            >
              <span className={cn('relative block aspect-[16/10] overflow-hidden', cover?.fit === 'contain' ? 'bg-canvas' : 'bg-ink/5')}>
                {cover && (
                  <img
                    src={cover.thumb ?? cover.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn('absolute inset-0 h-full w-full transition-transform duration-700', cover.fit === 'contain' ? 'object-contain p-2' : 'object-cover', selected && 'scale-105')}
                    style={cover.position ? { objectPosition: cover.position } : undefined}
                  />
                )}
              </span>
              <span className="block p-4">
                <span className="block font-display text-[11px] font-bold tracking-[0.14em] text-cerulean-700">{pad(i + 1)}</span>
                <span className="mt-1 block text-[14px] font-semibold leading-snug text-ink">{w.label}</span>
              </span>
              {selected && <motion.span layoutId="work-tab" className="absolute inset-x-0 bottom-0 h-[3px] bg-cerulean-600" transition={{ duration: 0.5, ease: EASE }} />}
            </motion.button>
            </Tilt>
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
