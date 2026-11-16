import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

type NumberTickerProps = {
  value: number;
  /** Angka awal hitungan; bawaan 0. */
  from?: number;
  delay?: number;
  className?: string;
};

/**
 * Number Ticker: angka menghitung naik saat terlihat.
 * Mengikuti komponen Magic UI yang terdaftar di 21st.dev; HTML awal sudah memuat nilai akhir
 * agar tetap terbaca tanpa JavaScript.
 */
export function NumberTicker({ value, from = 0, delay = 0, className }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!inView) return;
    if (ref.current) ref.current.textContent = String(from);
    const timer = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timer);
  }, [inView, motionValue, value, from, delay]);

  useEffect(
    () =>
      spring.on('change', (latest) => {
        if (ref.current) ref.current.textContent = String(Math.round(latest));
      }),
    [spring],
  );

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)}>
      {value}
    </span>
  );
}
