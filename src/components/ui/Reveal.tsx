import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', '');
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.06 },
    );
  }
  return observer;
}

type RevealProps = {
  as?: 'div' | 'section' | 'article' | 'li' | 'p' | 'header' | 'figure' | 'aside';
  /** Jeda dalam milidetik, dipakai untuk efek berurutan antar-elemen. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/** Membungkus konten agar muncul halus ketika masuk ke area pandang. */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    if (!io) {
      el.setAttribute('data-visible', '');
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return createElement(
    as,
    {
      ref,
      'data-reveal': '',
      className,
      style: delay ? ({ '--d': `${delay}ms` } as CSSProperties) : undefined,
    },
    children,
  );
}
