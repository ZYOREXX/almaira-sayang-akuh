import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type RevealProps = {
  as?: 'div' | 'section' | 'article' | 'li' | 'p' | 'header' | 'figure' | 'aside';
  /** Jeda dalam milidetik, dipakai untuk efek berurutan antar-elemen. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/** Muncul dengan efek blur-fade (Framer Motion) ketika elemen masuk ke area pandang. */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -7% 0px', amount: 0.05 }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
