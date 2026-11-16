import type { CSSProperties } from 'react';
import { cn } from '../../lib/utils';

type BorderBeamProps = {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
};

/** Border Beam: seberkas cahaya yang mengelilingi tepi kartu (mengikuti komponen Magic UI di 21st.dev). */
export function BorderBeam({
  size = 220,
  duration = 12,
  delay = 0,
  colorFrom = '#e0a94a',
  colorTo = '#ffffff',
  className,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('border-beam', className)}
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--delay': `-${delay}s`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        } as CSSProperties
      }
    />
  );
}
