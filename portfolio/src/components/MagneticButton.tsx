import { useRef, type MouseEventHandler, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';

type Props = {
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  className?: string;
  ariaLabel?: string;
};

/**
 * Magnetic CTA: the button drifts toward the cursor and springs back.
 * Primary buttons also carry a slow shimmer sweep.
 */
export function MagneticButton({ href, onClick, children, variant = 'primary', size = 'md', className, ariaLabel }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 17, mass: 0.35 });
  const y = useSpring(my, { stiffness: 260, damping: 17, mass: 0.35 });

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = cn(
    'btn',
    variant === 'primary' ? 'btn-primary shimmer' : 'btn-secondary',
    size === 'sm' && 'btn-sm',
    className,
  );
  const shared = {
    className: classes,
    style: { x, y },
    onPointerMove: handleMove,
    onPointerLeave: reset,
    whileTap: reduce ? undefined : { scale: 0.96 },
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <motion.a
        ref={(el: HTMLAnchorElement | null) => {
          ref.current = el;
        }}
        href={href}
        onClick={onClick}
        {...shared}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={(el: HTMLButtonElement | null) => {
        ref.current = el;
      }}
      type="button"
      onClick={onClick}
      {...shared}
    >
      {children}
    </motion.button>
  );
}
