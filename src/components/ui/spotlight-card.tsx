import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import type { MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Warna sorot, format rgba. */
  color?: string;
};

/** Spotlight Card: sorot cahaya lembut yang mengikuti kursor (pola Aceternity UI di 21st.dev). */
export function SpotlightCard({ children, className, color = 'rgba(224, 169, 74, 0.10)' }: SpotlightCardProps) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const background = useMotionTemplate`radial-gradient(340px circle at ${x}px ${y}px, ${color}, transparent 75%)`;

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <div onMouseMove={onMove} className={cn('group/spot relative overflow-hidden', className)}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background }}
      />
      {children}
    </div>
  );
}
