import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/utils';

type Props = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  /** Max 3D tilt in degrees (0 = no tilt). */
  tilt?: number;
  /** Lift on hover (px). */
  lift?: number;
  /** Classes for the inner content wrapper. */
  innerClassName?: string;
  /** Visual variant of the surface. */
  tone?: 'white' | 'prestige' | 'tint';
};

/**
 * Bento surface with a cursor-following spotlight, a glowing border that
 * tracks the pointer, optional 3D tilt and tactile hover/tap feedback.
 * (Adapted from the "Spotlight Card" + "3D Tilt Card" patterns.)
 */
export function SpotlightCard({
  children,
  tilt = 0,
  lift = 4,
  className,
  innerClassName,
  tone = 'white',
  onPointerMove,
  onPointerLeave,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.6 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.6 });

  return (
    <motion.div
      ref={ref}
      {...rest}
      className={cn('bento group/card', tone === 'prestige' && 'bento-prestige', tone === 'tint' && 'bento-tint', className)}
      style={{ rotateX, rotateY, transformPerspective: 1100, ...(rest.style ?? {}) }}
      whileHover={reduce ? undefined : { y: -lift }}
      whileTap={reduce ? undefined : { scale: 0.992 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y}px`);
          if (tilt && !reduce && e.pointerType === 'mouse') {
            ry.set((x / r.width - 0.5) * tilt * 2);
            rx.set(-(y / r.height - 0.5) * tilt * 2);
          }
        }
        onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        rx.set(0);
        ry.set(0);
        onPointerLeave?.(e);
      }}
    >
      <span aria-hidden="true" className="spotlight" />
      <span aria-hidden="true" className="spotlight-ring" />
      <div className={cn('relative z-[1] h-full', innerClassName)}>{children}</div>
    </motion.div>
  );
}
