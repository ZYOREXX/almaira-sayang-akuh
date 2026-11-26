import { useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap';
import { cn, formatStat } from '../lib/utils';
import type { Effect } from '../data/types';

/*
  Statistical instruments drawn in HTML/CSS on one linear (or log) scale.
  Marks follow the house chart spec: hairline axes, ≤ 12 px bars with a 4 px
  rounded data-end, ≥ 8 px markers with a 2 px surface ring, text in text
  colours, and a hover/focus tooltip that repeats the values.
*/

type Trigger = 'scroll' | 'mount';

/** Plays a "grow-in" timeline once: when scrolled into view, or on mount (inside dialogs). */
function useEnter(scope: RefObject<HTMLElement>, trigger: Trigger, build: (root: HTMLElement) => gsap.core.Timeline) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (trigger === 'mount') {
          build(root).delay(0.2);
          return;
        }
        let tl: gsap.core.Timeline | undefined;
        ScrollTrigger.create({
          trigger: root,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            tl = build(root);
          },
        });
        return () => {
          tl?.progress(1).kill();
        };
      });
      return () => mm.revert();
    },
    { scope },
  );
}

const TIP_ALIGN = { center: 'tip-center', start: 'tip-start', end: 'tip-end' } as const;

/** Hover / keyboard-focus tooltip. Values lead, labels follow. */
function Tip({
  children,
  lines,
  label,
  align = 'center',
  className,
  style,
}: {
  children: ReactNode;
  lines: Array<[string, string]>;
  label: string;
  align?: 'center' | 'start' | 'end';
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span tabIndex={0} aria-label={label} className={cn('tip-host', className)} style={style}>
      {children}
      <span role="tooltip" className={cn('tip', TIP_ALIGN[align])}>
        {lines.map(([value, name]) => (
          <span key={name} className="flex items-baseline gap-2">
            <span className="font-semibold tabular-nums text-white">{value}</span>
            <span className="text-white/65">{name}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

const pctLinear = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;
const fmt3 = (v: number) => formatStat(v, 3);

/* -------------------------------------------------------------------------- */
/* 95% confidence interval on the r scale (−1 … +1)                            */
/* -------------------------------------------------------------------------- */
export function CiAxis({
  low,
  high,
  estimate,
  resamples,
  trigger = 'scroll',
}: {
  low: number;
  high: number;
  estimate: number;
  resamples: number;
  trigger?: Trigger;
}) {
  const ref = useRef<HTMLElement>(null);
  const p = (v: number) => pctLinear(v, -1, 1);
  const ticks = [-1, -0.5, 0, 0.5, 1];

  useEnter(ref, trigger, (root) =>
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from(root.querySelector('[data-band]'), { scaleX: 0, duration: 1.2 })
      .from(root.querySelector('[data-dot]'), { scale: 0, duration: 0.7, ease: 'back.out(2.2)' }, '-=0.75')
      .from(root.querySelector('[data-callout]'), { y: 6, autoAlpha: 0, duration: 0.5 }, '-=0.45'),
  );

  return (
    <figure ref={ref} className="w-full">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[12px] leading-snug text-muted">
        <span>95% BCa CI for Pearson r · {resamples.toLocaleString('en-US')} bootstrap resamples</span>
        <span className="font-mono text-ink tabular-nums">
          [{fmt3(low)}, {fmt3(high)}]
        </span>
      </figcaption>

      <div className="relative mt-3 h-[78px]">
        {/* axis + ticks */}
        <div className="absolute inset-x-0 top-[40px] h-px bg-line" />
        {ticks.map((t) => (
          <div key={t} className="absolute top-[34px] h-[13px] w-px bg-line" style={{ left: `${p(t)}%` }} />
        ))}
        {/* zero reference (no association) */}
        <div className="absolute top-[20px] h-[40px] w-px bg-ink/35" style={{ left: `${p(0)}%` }} />

        {/* interval */}
        <Tip
          label={`95% BCa confidence interval from ${fmt3(low)} to ${fmt3(high)}`}
          lines={[
            [`[${fmt3(low)}, ${fmt3(high)}]`, '95% BCa CI'],
            [resamples.toLocaleString('en-US'), 'bootstrap resamples'],
          ]}
          className="absolute top-[30px] block h-[21px]"
          style={{ left: `${p(low)}%`, width: `${p(high) - p(low)}%` }}
        >
          <span data-band className="absolute inset-x-0 top-[4px] block h-[13px] origin-center rounded-[4px] border-x-2 border-cerulean-600 bg-cerulean-600/15" />
        </Tip>

        {/* point estimate */}
        <div data-callout className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-medium text-ink" style={{ left: `${p(estimate)}%` }}>
          r = {fmt3(estimate)}
        </div>
        <Tip
          label={`Point estimate r equals ${fmt3(estimate)}`}
          lines={[[`r = ${fmt3(estimate)}`, 'Pearson correlation']]}
          className="absolute top-[40px] grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: `${p(estimate)}%` }}
        >
          <span data-dot className="block h-3 w-3 rounded-full bg-cerulean-600 ring-2 ring-white" />
        </Tip>

        {/* tick labels */}
        {ticks.map((t) => (
          <span
            key={`l${t}`}
            className="absolute top-[54px] -translate-x-1/2 font-mono text-[10.5px] text-muted tabular-nums"
            style={{ left: `${Math.min(Math.max(p(t), 3), 97)}%` }}
          >
            {t === 0 ? '0' : t > 0 ? `+${t}` : formatStat(t, 1)}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted">The interval crosses zero: no reliable linear association.</p>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Bayes factor BF01 on a log scale with Jeffreys' evidence categories         */
/* -------------------------------------------------------------------------- */
export function BayesScale({ bf01, posteriorMean, trigger = 'scroll' }: { bf01: number; posteriorMean: number; trigger?: Trigger }) {
  const ref = useRef<HTMLElement>(null);
  const p = (v: number) => (Math.log10(v) / 2) * 100; // 1 … 100
  const segments = [
    { from: 1, to: 3, label: 'Anecdotal', color: '#E0F2FE' },
    { from: 3, to: 10, label: 'Moderate', color: '#7DD3FC' },
    { from: 10, to: 30, label: 'Strong', color: '#38BDF8' },
    { from: 30, to: 100, label: 'Very strong', color: '#0284C7' },
  ];
  const active = segments.find((s) => bf01 >= s.from && bf01 < s.to) ?? segments[segments.length - 1];

  useEnter(ref, trigger, (root) =>
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from(root.querySelectorAll('[data-seg]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.9, stagger: 0.08 })
      .from(root.querySelector('[data-marker]'), { y: -10, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.4'),
  );

  return (
    <figure ref={ref} className="w-full">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[12px] leading-snug text-muted">
        <span>Bayes factor for H₀ · log scale, Jeffreys’ categories</span>
        <span className="font-mono text-ink tabular-nums">posterior mean r = {fmt3(posteriorMean)}</span>
      </figcaption>
      <div className="relative mt-3 h-[70px]">
        <div data-marker className="absolute top-0 -translate-x-1/2 text-center" style={{ left: `${p(bf01)}%` }}>
          <span className="block whitespace-nowrap font-mono text-[11px] font-medium text-ink">BF₀₁ = {fmt3(bf01)}</span>
          <span className="mx-auto mt-1 block h-[14px] w-px bg-ink/50" />
        </div>
        <div className="absolute inset-x-0 top-[34px] flex h-2 gap-[2px]">
          {segments.map((s, i) => (
            <span
              key={s.label}
              data-seg
              className={cn('block h-full', i === 0 && 'rounded-l-full', i === segments.length - 1 && 'rounded-r-full')}
              style={{ width: `${p(s.to) - p(s.from)}%`, background: s.color }}
            />
          ))}
        </div>
        <Tip
          label={`Bayes factor BF01 equals ${fmt3(bf01)}, ${active.label.toLowerCase()} evidence for the null hypothesis`}
          lines={[
            [`BF₀₁ = ${fmt3(bf01)}`, `${active.label.toLowerCase()} evidence for H₀`],
            [`r = ${fmt3(posteriorMean)}`, 'posterior mean'],
          ]}
          className="absolute top-[38px] grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: `${p(bf01)}%` }}
        >
          <span className="block h-3 w-3 rounded-full bg-cerulean-800 ring-2 ring-white" />
        </Tip>
        {segments.map((s) => (
          <span
            key={`t${s.label}`}
            className={cn(
              'absolute top-[50px] -translate-x-1/2 whitespace-nowrap text-[10.5px]',
              s === active ? 'font-bold text-ink' : 'text-muted',
            )}
            style={{ left: `${(p(s.from) + p(s.to)) / 2}%` }}
          >
            {s.label}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted">Scale 1–100; category boundaries at 3, 10 and 30.</p>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Horizontal bars on a shared linear scale (Cohen's d or N-Gain)              */
/* -------------------------------------------------------------------------- */
type BarDatum = { label: string; value: number; valueText: string; note: string; tip: Array<[string, string]> };

function Bars({
  data,
  max,
  ticks,
  thresholds,
  caption,
  trigger,
}: {
  data: BarDatum[];
  max: number;
  ticks: number[];
  thresholds: Array<{ at: number; label: string }>;
  caption: ReactNode;
  trigger: Trigger;
}) {
  const ref = useRef<HTMLElement>(null);
  useEnter(ref, trigger, (root) =>
    gsap
      .timeline()
      .from(root.querySelectorAll('[data-bar]'), { scaleX: 0, transformOrigin: 'left center', duration: 1.3, ease: 'expo.out', stagger: 0.12 }),
  );
  const p = (v: number) => pctLinear(v, 0, max);

  return (
    <figure ref={ref} className="w-full">
      <figcaption className="text-[12px] leading-snug text-muted">{caption}</figcaption>
      <div className="relative mt-4">
        <div className="space-y-4">
          {data.map((d) => (
            <div key={d.label}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[12.5px]">
                <span className="font-semibold text-ink">{d.label}</span>
                <span className="text-muted">
                  <span className="font-mono font-semibold text-ink tabular-nums">{d.valueText}</span> · {d.note}
                </span>
              </div>
              <Tip label={`${d.label}: ${d.valueText}, ${d.note}`} lines={d.tip} align="start" className="relative block h-3 rounded-r-[4px] bg-cerulean-50">
                <span data-bar className="block h-full rounded-r-[4px] bg-cerulean-600" style={{ width: `${p(d.value)}%` }} />
                {/* threshold marks */}
                {thresholds.map((t) => (
                  <span key={t.label} aria-hidden="true" className="absolute inset-y-0 w-px bg-ink/40" style={{ left: `${p(t.at)}%` }} />
                ))}
              </Tip>
            </div>
          ))}
        </div>
        {/* axis */}
        <div className="relative mt-3 h-5 border-t border-line">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute top-1 -translate-x-1/2 font-mono text-[10.5px] text-muted tabular-nums"
              style={{ left: `${Math.min(Math.max(p(t), 2), 98)}%` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}

export function EffectBars({ effects, trigger = 'scroll' }: { effects: Effect[]; trigger?: Trigger }) {
  return (
    <Bars
      trigger={trigger}
      max={3}
      ticks={[0, 1, 2, 3]}
      thresholds={[{ at: 0.8, label: '0.8 large' }]}
      caption={<>Cohen’s d, pretest → posttest. The thin mark in each bar sits at d = 0.8, the conventional “large” threshold.</>}
      data={effects.map((e) => ({
        label: e.outcome,
        value: e.d,
        valueText: `d = ${formatStat(e.d, 3)}`,
        note: e.magnitude.toLowerCase(),
        tip: [
          [`d = ${formatStat(e.d, 3)}`, e.magnitude.toLowerCase()],
          [e.t, e.p],
          [`N-Gain = ${formatStat(e.ngain, 3)}`, 'normalised gain'],
        ],
      }))}
    />
  );
}

export function NGainBars({ effects, trigger = 'scroll' }: { effects: Effect[]; trigger?: Trigger }) {
  const band = (g: number) => (g >= 0.7 ? 'high' : g >= 0.3 ? 'medium' : 'low');
  return (
    <Bars
      trigger={trigger}
      max={1}
      ticks={[0, 0.5, 1]}
      thresholds={[
        { at: 0.3, label: '0.3' },
        { at: 0.7, label: '0.7' },
      ]}
      caption={<>Normalised gain (Hake): below 0.3 low, 0.3–0.7 medium, above 0.7 high. Marks sit at 0.3 and 0.7.</>}
      data={effects.map((e) => ({
        label: e.outcome,
        value: e.ngain,
        valueText: formatStat(e.ngain, 3),
        note: `${band(e.ngain)} gain`,
        tip: [
          [`N-Gain = ${formatStat(e.ngain, 3)}`, `${band(e.ngain)} gain`],
          [`d = ${formatStat(e.d, 3)}`, "Cohen's d"],
        ],
      }))}
    />
  );
}
