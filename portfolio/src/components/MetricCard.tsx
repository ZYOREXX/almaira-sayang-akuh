import type { MetricData } from '../data/types';
import { cn } from '../lib/utils';
import { Counter } from './Counter';
import { SpotlightCard } from './SpotlightCard';

/** Compact metric: animated number (or static text) + label + note. */
export function MetricCard({ m, compact = false }: { m: MetricData; compact?: boolean }) {
  const p = !!m.prestige;
  return (
    <SpotlightCard tone={p ? 'prestige' : 'white'} innerClassName={cn('flex h-full flex-col', compact ? 'p-4' : 'p-4 sm:p-5')}>
      <p className={cn('font-label text-[11px] font-semibold uppercase tracking-[0.12em]', p ? 'text-prestige' : 'text-muted')}>{m.label}</p>
      <p className={cn('mt-2.5 font-display font-extrabold leading-none tracking-[-0.03em]', compact ? 'text-[1.6rem]' : 'text-[clamp(1.6rem,3.4vw,2.2rem)]', p ? 'text-prestige' : 'text-ink')}>
        {typeof m.value === 'number' ? (
          <Counter value={m.value} from={m.from} decimals={m.decimals ?? 0} prefix={m.prefix} suffix={m.suffix} display={m.display} />
        ) : (
          m.display
        )}
      </p>
      {m.note && <p className={cn('mt-2 text-[12.5px] leading-snug', p ? 'text-prestige-deep/85' : 'text-muted')}>{m.note}</p>}
    </SpotlightCard>
  );
}
