import { useRef, type ReactNode } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';

/** Cinematic easing used across the site (Framer Motion transitions). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll reveal (GSAP ScrollTrigger): rises in once with a light, natural
 * bounce ("back.out") when the block reaches 85 % of the viewport.
 * Content starts partly visible, so nothing is ever blank on screen.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li';
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0.35, y, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            delay,
            ease: 'back.out(1.6)',
            clearProps: 'transform',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const Cmp = as;
  return (
    <Cmp ref={ref} className={className}>
      {children}
    </Cmp>
  );
}
