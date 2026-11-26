import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

type Tab = { id: string; label: string };

/**
 * Segmented filter. The active "pill" glides between tabs with a shared
 * Framer Motion `layoutId`.
 */
export function TabFilter({
  tabs,
  value,
  onChange,
  layoutId,
  counts,
  label,
  controls,
}: {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
  layoutId: string;
  counts?: Record<string, number>;
  label: string;
  controls?: string;
}) {
  return (
    <div className="tabs-scroll -mx-1 overflow-x-auto px-1 py-1">
      <div role="tablist" aria-label={label} className="inline-flex gap-1 rounded-full border border-line bg-white/90 p-1 shadow-soft backdrop-blur">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={controls}
              onClick={() => onChange(t.id)}
              className={cn(
                'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-200',
                active ? 'text-white' : 'text-muted hover:text-ink',
              )}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-cerulean-600 shadow-[0_8px_18px_-10px_rgba(2,132,199,0.9)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-[1]">
                {t.label}
                {counts && <span className={cn('ml-1.5 tabular-nums', active ? 'text-white/75' : 'text-muted/70')}>{counts[t.id] ?? 0}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
