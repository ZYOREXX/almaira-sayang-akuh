import { useRef } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap';
import { formatStat } from '../lib/utils';
import type { MetricData } from '../data/types';

type Props = Pick<MetricData, 'from' | 'prefix' | 'suffix' | 'display'> & {
  value: number;
  decimals: number;
  className?: string;
  duration?: number;
};

/**
 * Running number. The final value is rendered in the markup (so the page is
 * complete without JavaScript or scrolling); when the number scrolls into
 * view, GSAP counts it up from `from` (default 0) to `value`.
 */
export function Counter({ value, from = 0, decimals, prefix = '', suffix = '', display, className, duration = 1.8 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (v: number) => `${prefix}${formatStat(v, decimals)}${suffix}`;
  const finalText = display ?? format(value);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { v: from };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 94%',
          once: true,
          onEnter: () => {
            el.textContent = format(from);
            gsap.to(state, {
              v: value,
              duration,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent = format(state.v);
              },
              onComplete: () => {
                el.textContent = finalText;
              },
            });
          },
        });
        return () => {
          el.textContent = finalText;
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
