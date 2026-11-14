import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';

type Option<T extends string> = { value: T; label: string };

type SegmentedProps<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  tone?: 'light' | 'dark';
  /** Bila diisi, tombol bertindak sebagai tab dan menunjuk panel `${controls}`. */
  controls?: string;
  className?: string;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Kontrol pilihan berbentuk pil dengan indikator geser.
 * Mendukung navigasi papan ketik (panah kiri/kanan, Home, End).
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  tone = 'light',
  controls,
  className = '',
}: SegmentedProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const dark = tone === 'dark';
  const labelsKey = options.map((o) => o.label).join('|');

  // Posisi indikator diukur dari tombol aktif, sehingga label boleh berbeda panjang.
  useIsomorphicLayoutEffect(() => {
    const el = refs.current[activeIndex];
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const measure = () =>
      setPill((prev) =>
        prev && prev.left === el.offsetLeft && prev.width === el.offsetWidth
          ? prev
          : { left: el.offsetLeft, width: el.offsetWidth },
      );
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIndex, labelsKey]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = activeIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (activeIndex + 1) % options.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (activeIndex - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const activeFill = dark ? 'bg-sun-300' : 'bg-navy-900';

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`relative inline-flex rounded-full p-1 ${
        dark ? 'bg-paper-50/[0.06] ring-1 ring-sun-300/20' : 'bg-navy-900/[0.05] ring-1 ring-navy-900/10'
      } ${className}`}
    >
      {pill ? (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1 bottom-1 left-0 rounded-full transition-[transform,width] duration-500 ease-out-expo ${activeFill}`}
          style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
        />
      ) : null}
      {options.map((option, i) => {
        const selected = i === activeIndex;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`relative z-10 rounded-full px-5 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors duration-300 sm:px-6 ${
              selected
                ? `${dark ? 'text-navy-950' : 'text-paper-50'} ${pill ? '' : activeFill}`
                : dark
                  ? 'text-paper-200/70 hover:text-paper-50'
                  : 'text-mute-600 hover:text-navy-900'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
