import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import type { BrandId } from '../data/brandIcons';
import { BrandLogo, brandTitle } from './BrandLogo';
import { cn } from '../lib/utils';

/** One logo tile; scales up as the pointer approaches (macOS-dock style). */
function DockItem({ id, mouseX, size }: { id: BrandId; mouseX: MotionValue<number>; size: 'md' | 'sm' }) {
  const ref = useRef<HTMLLIElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const scale = useSpring(useTransform(distance, [-140, 0, 140], [1, 1.32, 1]), { stiffness: 340, damping: 24, mass: 0.3 });
  const y = useSpring(useTransform(distance, [-140, 0, 140], [0, -7, 0]), { stiffness: 340, damping: 24, mass: 0.3 });

  return (
    <li ref={ref} className={cn('flex flex-col items-center gap-2 text-center', size === 'md' ? 'w-[74px]' : 'w-[66px]')}>
      <motion.span style={{ scale, y }} className={cn('dock-tile', size === 'sm' && '!h-12 !w-12 !rounded-2xl')}>
        <BrandLogo id={id} size={size === 'md' ? 28 : 24} />
      </motion.span>
      <span className="text-[11px] font-semibold leading-tight text-ink/80">{brandTitle(id)}</span>
    </li>
  );
}

/** Row of real software logos with dock magnification on pointer devices. */
export function LogoDock({ tools, size = 'md', className }: { tools: BrandId[]; size?: 'md' | 'sm'; className?: string }) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(Infinity);
  return (
    <ul
      className={cn('flex flex-wrap items-end gap-x-1.5 gap-y-4', className)}
      onMouseMove={(e) => !reduce && mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {tools.map((id) => (
        <DockItem key={id} id={id} mouseX={mouseX} size={size} />
      ))}
    </ul>
  );
}
