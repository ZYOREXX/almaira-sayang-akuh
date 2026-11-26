import { useRef, type CSSProperties } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type { BrandId } from '../data/brandIcons';
import { BrandLogo, brandTitle } from '../components/BrandLogo';
import { Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';

/* ---------------- Interactive marquee (pauses on hover) ---------------- */
function MarqueeRow({ ids, reverse, seconds }: { ids: BrandId[]; reverse?: boolean; seconds: number }) {
  const loop = [...ids, ...ids];
  return (
    <div className="marquee">
      <ul className={cn('marquee-track', reverse && 'marquee-reverse')} style={{ '--marquee-duration': `${seconds}s` } as CSSProperties}>
        {loop.map((id, i) => (
          <li key={`${id}-${i}`} aria-hidden={i >= ids.length ? true : undefined} className="marquee-item">
            <span className="logo-pill">
              <BrandLogo id={id} size={22} decorative />
              <span>{brandTitle(id)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Dock with magnification (pointer devices) ---------------- */
function DockItem({ id, mouseX }: { id: BrandId; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLLIElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const scaleRaw = useTransform(distance, [-150, 0, 150], [1, 1.34, 1]);
  const scale = useSpring(scaleRaw, { stiffness: 340, damping: 24, mass: 0.3 });
  const liftRaw = useTransform(distance, [-150, 0, 150], [0, -8, 0]);
  const y = useSpring(liftRaw, { stiffness: 340, damping: 24, mass: 0.3 });

  return (
    <li ref={ref} className="flex w-[78px] flex-col items-center gap-2.5 text-center sm:w-[84px]">
      <motion.span style={{ scale, y }} className="dock-tile">
        <BrandLogo id={id} size={30} />
      </motion.span>
      <span className="text-[11.5px] font-semibold leading-tight text-ink/80">{brandTitle(id)}</span>
    </li>
  );
}

function Dock({ tools }: { tools: BrandId[] }) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(Infinity);
  return (
    <ul
      className="mt-7 flex flex-wrap items-end justify-center gap-x-2 gap-y-5 sm:justify-start"
      onMouseMove={(e) => !reduce && mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {tools.map((id) => (
        <DockItem key={id} id={id} mouseX={mouseX} />
      ))}
    </ul>
  );
}

export function Toolkit() {
  const { skills } = PORTFOLIO_DATA;
  const allTools = skills.flatMap((s) => s.tools as BrandId[]);
  const half = Math.ceil(allTools.length / 2);

  return (
    <Section id="toolkit">
      <SectionHeader
        eyebrow="Skills & tech stack"
        title="The toolkit behind the evidence."
        lead="Statistical software for analysis, bibliometric tools for mapping the literature, and creative tools for communicating results."
      />

      <div data-reveal className="marquee-shell mb-6 space-y-3">
        <MarqueeRow ids={allTools.slice(0, half)} seconds={44} />
        <MarqueeRow ids={allTools.slice(half)} seconds={48} reverse />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.title} data-reveal>
            <SpotlightCard innerClassName="flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cerulean-50 text-cerulean-600 ring-1 ring-cerulean-100">
                  <Icon name={group.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[16px] font-bold leading-snug text-ink">{group.title}</h3>
                  <p className="font-mono text-[11px] text-muted">{group.tools.length} tools</p>
                </div>
              </div>
              <Dock tools={group.tools as BrandId[]} />
            </SpotlightCard>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-snug text-muted">
        Logos are trademarks of their respective owners. SPSS, Stata, SmartPLS, VOSviewer, Publish or Perish, CapCut and Snapseed are shown with simple stand-in badges.
      </p>
    </Section>
  );
}
