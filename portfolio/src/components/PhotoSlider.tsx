import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '../data/types';
import { cn } from '../lib/utils';
import { EASE } from './Reveal';

/** Large preview with a smooth mini-slider (arrows, dots, swipe). */
export function PhotoSlider({ photos, className }: { photos: Photo[]; className?: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const n = photos.length;
  const many = n > 1;

  // Reset when the set of photos changes (another project selected).
  const key = photos.map((p) => p.src).join('|');
  useEffect(() => setState([0, 0]), [key]);

  if (!n) return null;
  const i = Math.min(index, n - 1);
  const photo = photos[i];
  const go = (d: number) => setState(([cur]) => [(cur + d + n) % n, d]);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <figure className={cn('relative', className)}>
      <div className={cn('relative aspect-[4/3] overflow-hidden rounded-[28px] border border-line shadow-lift', photo.fit === 'contain' ? 'bg-white' : 'bg-ink')}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 1.04 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.98 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: EASE }}
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
                onClick={() => setState([k, k > i ? 1 : -1])}
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
