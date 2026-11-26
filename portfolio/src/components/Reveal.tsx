import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Cinematic easing used across the site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll reveal (Framer Motion): rises and fades in once, when 15 % is visible.
 * Content starts partly visible so nothing is ever blank on screen.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li';
}) {
  const Cmp = as === 'li' ? motion.li : motion.div;
  return (
    <Cmp
      className={className}
      initial={{ opacity: 0.35, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Cmp>
  );
}
