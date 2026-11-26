import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Vertical travel in % of the image height (0 disables parallax). */
  intensity?: number;
  fit?: 'cover' | 'contain';
  position?: string;
  eager?: boolean;
};

/**
 * Image that drifts vertically inside its frame while the page scrolls
 * (GSAP ScrollTrigger, scrubbed). The frame clips the oversized image, so
 * the photo is always fully visible; only its crop shifts.
 */
export function ParallaxImage({ src, alt, className, imgClassName, intensity = 7, fit = 'cover', position, eager }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const moving = fit === 'cover' && intensity > 0;

  useGSAP(
    () => {
      if (!moving || !frame.current || !inner.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -intensity },
          {
            yPercent: intensity,
            ease: 'none',
            scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: frame, dependencies: [src, moving, intensity] },
  );

  return (
    // Always a fill layer: the parent sets the size (aspect ratio, grid row, min-height).
    <div ref={frame} className={cn('absolute inset-0 overflow-hidden', className)}>
      <div ref={inner} className={cn('absolute inset-x-0', moving ? '-inset-y-[9%]' : 'inset-y-0')}>
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className={cn('h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain', imgClassName)}
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    </div>
  );
}
