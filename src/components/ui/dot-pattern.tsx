import { useId } from 'react';
import { cn } from '../../lib/utils';

/** Dot Pattern: latar titik-titik halus (mengikuti komponen Magic UI di 21st.dev). */
export function DotPattern({ className, gap = 22 }: { className?: string; gap?: number }) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={cn('pointer-events-none absolute inset-0 size-full', className)}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
