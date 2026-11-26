import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Achievement } from '../data/types';
import { Chip, Section, SectionHeader } from '../components/ui';
import { Icon } from '../components/Icon';
import { OrgLogo } from '../components/Logos';
import { EASE, Reveal } from '../components/Reveal';
import { cn } from '../lib/utils';

const AUTO_MS = 4500;

/** Visual of a card: certificate scan, documentation photo, or a designed summary. */
function Visual({ a }: { a: Achievement }) {
  if (a.visual.kind === 'scan') {
    const im = a.visual.images[0];
    return <img src={im.thumb ?? im.src} alt={im.alt} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-contain p-3" />;
  }
  if (a.visual.kind === 'photo') {
    const p = getPhoto(a.visual.photo);
    if (!p) return null;
    return (
      <img
        src={p.thumb ?? p.src}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn('absolute inset-0 h-full w-full', p.fit === 'contain' ? 'object-contain p-3' : 'object-cover')}
        style={p.position ? { objectPosition: p.position } : undefined}
      />
    );
  }
  const prestige = !!a.prestige;
  return (
    <div className={cn('emblem absolute inset-0 grid place-items-center', prestige ? 'emblem-prestige' : 'emblem-cerulean')}>
      <div className="relative flex flex-col items-center px-4 text-center">
        <span className={cn('emblem-ring grid h-20 w-20 place-items-center rounded-full', prestige ? 'text-prestige' : 'text-cerulean-600')}>
          <Icon name={a.icon} className="h-8 w-8" strokeWidth={1.5} />
        </span>
        <span className={cn('mt-4 font-display text-[12px] font-bold uppercase tracking-[0.18em]', prestige ? 'text-prestige' : 'text-cerulean-700')}>{a.visual.code}</span>
      </div>
    </div>
  );
}

function Card({ a }: { a: Achievement }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-white shadow-soft">
      <div className={cn('relative aspect-[4/3] overflow-hidden border-b border-line', a.visual.kind === 'scan' ? 'bg-canvas' : 'bg-ink/5')}>
        <Visual a={a} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <Chip tone={a.prestige ? 'prestige' : 'plain'}>{a.category}</Chip>
          {a.logo && <OrgLogo id={a.logo} className={cn('h-10 shrink-0 !rounded-xl !p-1', a.logo === 'upi-sps' || a.logo === 'icsdp' ? 'w-28' : 'w-10')} />}
        </div>
        <h3 className="mt-4 font-display text-[1.1rem] font-bold leading-snug text-ink">{a.title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-snug text-muted">{a.issuer}</p>
        <p className="mt-auto pt-5 text-[13px] font-semibold text-ink">{a.date}</p>
      </div>
    </article>
  );
}

function usePerView() {
  const get = () => (typeof window === 'undefined' ? 3 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
  const [n, setN] = useState(get);
  useEffect(() => {
    const on = () => setN(get());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return n;
}

/** Auto-sliding carousel (no popups). Pauses on hover, focus, tab change or reduced motion. */
export function Achievements() {
  const items = PORTFOLIO_DATA.achievements as Achievement[];
  const reduce = useReducedMotion();
  const perView = usePerView();
  const maxIndex = Math.max(0, items.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const GAP = 24;

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);

  const go = useCallback((d: number) => setIndex((i) => (i + d > maxIndex ? 0 : i + d < 0 ? maxIndex : i + d)), [maxIndex]);

  useEffect(() => {
    if (reduce || paused || userPaused) return;
    const t = window.setInterval(() => {
      if (!document.hidden) go(1);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [go, paused, userPaused, reduce]);

  const cardW = width ? (width - GAP * (perView - 1)) / perView : 0;
  const x = -index * (cardW + GAP);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <Section id="achievements" tone="canvas">
      <SectionHeader
        eyebrow="Achievements & certifications"
        title="Achievements & certifications."
        aside={
          <div className="flex items-center gap-2">
            <button type="button" className="icon-btn !h-11 !w-11" onClick={() => go(-1)} aria-label="Previous certificates">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn !h-11 !w-11" onClick={() => go(1)} aria-label="Next certificates">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            {!reduce && (
              <button type="button" className="icon-btn !h-11 !w-11" onClick={() => setUserPaused((v) => !v)} aria-label={userPaused ? 'Play auto-slide' : 'Pause auto-slide'}>
                {userPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
              </button>
            )}
          </div>
        }
      />

      <Reveal>
        <div
          ref={viewport}
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Achievements and certifications"
        >
          <motion.ul
            className="flex cursor-grab active:cursor-grabbing"
            style={{ gap: GAP }}
            animate={{ x }}
            transition={{ duration: 0.9, ease: EASE }}
            drag="x"
            dragConstraints={{ left: x, right: x }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
          >
            {items.map((a, i) => (
              <li
                key={a.id}
                className="shrink-0"
                style={{ width: cardW || `calc((100% - ${GAP * (perView - 1)}px) / ${perView})` }}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${items.length}: ${a.title}`}
                aria-hidden={i < index || i >= index + perView ? true : undefined}
              >
                <Card a={a} />
              </li>
            ))}
          </motion.ul>
        </div>
      </Reveal>

      <div className="mt-8 flex items-center justify-center gap-2" role="group" aria-label="Choose slide">
        {Array.from({ length: maxIndex + 1 }, (_, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setIndex(k)}
            aria-label={`Go to slide ${k + 1}`}
            aria-current={k === index ? 'true' : undefined}
            className={cn('h-2 rounded-full transition-all duration-500', k === index ? 'w-8 bg-cerulean-600' : 'w-2 bg-slate-300 hover:bg-cerulean-300')}
          />
        ))}
      </div>
    </Section>
  );
}
