import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';

type TiltOptions = {
  /** Maximum tilt in degrees. */
  max?: number;
  /** Scale while hovered or touched (lifts toward the viewer). */
  scale?: number;
};

const FINE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const COARSE = '(hover: none) and (prefers-reduced-motion: no-preference)';

/** quickTo works on single properties, so scale is driven as scaleX + scaleY. */
function scaleTo(el: HTMLElement, duration: number) {
  const sx = gsap.quickTo(el, 'scaleX', { duration, ease: 'back.out(2)' });
  const sy = gsap.quickTo(el, 'scaleY', { duration, ease: 'back.out(2)' });
  return (v: number) => {
    sx(v);
    sy(v);
  };
}

/**
 * Magnetic 3D tilt + elevation with gsap.quickTo.
 * Mouse: the element leans toward the cursor and lifts (scale + soft shadow).
 * Touch: it lifts gently while pressed. Disabled with reduced motion.
 */
export function useTilt<T extends HTMLElement>({ max = 6, scale = 1.03 }: TiltOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(FINE, () => {
        gsap.set(el, { transformPerspective: 900, transformOrigin: '50% 50%' });
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const sc = scaleTo(el, 0.6);

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * max * 2);
          rx(-py * max * 2);
        };
        const enter = () => {
          sc(scale);
          el.classList.add('is-lifted');
        };
        const leave = () => {
          rx(0);
          ry(0);
          sc(1);
          el.classList.remove('is-lifted');
        };
        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointerenter', enter);
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
          el.classList.remove('is-lifted');
        };
      });

      mm.add(COARSE, () => {
        const sc = scaleTo(el, 0.45);
        const down = () => {
          sc(scale);
          el.classList.add('is-lifted');
        };
        const up = () => {
          sc(1);
          el.classList.remove('is-lifted');
        };
        el.addEventListener('pointerdown', down, { passive: true });
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        el.addEventListener('pointerleave', up);
        return () => {
          el.removeEventListener('pointerdown', down);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
          el.removeEventListener('pointerleave', up);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}

/** Wrapper element that applies useTilt to itself. */
export function Tilt({
  as: Cmp = 'div',
  children,
  className,
  max,
  scale,
}: TiltOptions & { as?: ElementType; children: ReactNode; className?: string }) {
  const ref = useTilt<HTMLElement>({ max, scale });
  return (
    <Cmp ref={ref} className={cn('tilt', className)}>
      {children}
    </Cmp>
  );
}
