import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '../data/types';
import { cn } from '../lib/utils';
import { EASE } from './Reveal';
import { useTilt } from './Tilt';

/** Jeda auto-slide galeri proyek (milidetik). */
const AUTO_MS = 4200;

/**
 * Large preview that cross-fades to the next photo every few seconds.
 * Arrows, dots and swipe still work; autoplay pauses on hover, focus,
 * when the gallery is off screen, when the tab is hidden, or with reduced motion.
 */
export function PhotoSlider({ photos, className }: { photos: Photo[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const frame = useTilt<HTMLDivElement>({ max: 4, scale: 1.02 });
  const root = useRef<HTMLElement>(null);
  const n = photos.length;
  const many = n > 1;

  // Reset when the set of photos changes (another project selected).
  const key = photos.map((p) => p.src).join('|');
  useEffect(() => setIndex(0), [key]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!many || reduce || hold || !visible) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setIndex((c) => (c + 1) % n);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [many, reduce, hold, visible, n, index]);

  if (!n) return null;
  const i = Math.min(index, n - 1);
  const photo = photos[i];
  const go = (d: number) => setIndex((c) => (c + d + n) % n);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <figure
      ref={root}
      className={cn('relative', className)}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div
        ref={frame}
        className={cn('tilt relative aspect-[4/3] overflow-hidden rounded-[28px] border border-line shadow-lift', photo.fit === 'contain' ? 'bg-white' : 'bg-ink')}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ opacity: { duration: 1.1, ease: EASE }, scale: { duration: 4.5, ease: 'easeOut' } }}
            drag={many ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={onDragEnd}
            draggable={false}
            className={cn('absolute inset-0 h-full w-full select-none', photo.fit === 'contain' ? 'object-contain p-6 sm:p-8' : 'object-cover')}
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </AnimatePresence>
        {many && (
          <>
            <button type="button" onClick={() => go(-1)} className="slider-btn left-3" aria-label="Previous photo">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="slider-btn right-3" aria-label="Next photo">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <figcaption className="mt-4 flex items-start justify-between gap-4">
        <span className="text-[13.5px] leading-snug text-muted" aria-live="polite">
          {photo.caption}
        </span>
        {many && (
          <span className="flex shrink-0 items-center gap-1.5 pt-1" role="group" aria-label="Choose photo">
            {photos.map((p, k) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setIndex(k)}
                aria-label={`Photo ${k + 1} of ${n}`}
                aria-current={k === i ? 'true' : undefined}
                className={cn('h-1.5 rounded-full transition-all duration-500', k === i ? 'w-6 bg-cerulean-600' : 'w-1.5 bg-line hover:bg-cerulean-200')}
              />
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
