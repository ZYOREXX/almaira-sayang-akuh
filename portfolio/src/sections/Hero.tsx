import { Fragment, useRef } from 'react';
import { ArrowDownRight, GraduationCap } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';
import { SpotlightCard } from '../components/SpotlightCard';
import { MagneticButton } from '../components/MagneticButton';
import { Counter } from '../components/Counter';
import { PrestigeBadge } from '../components/ui';

function Word({ children, className }: { children: string; className?: string }) {
  return (
    <span className="word-mask">
      <span data-h="word" className={cn('inline-block', className)}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const { profile, prestigeBadges, heroStats } = PORTFOLIO_DATA;
  const scope = useRef<HTMLElement>(null);
  const [first, ...rest] = profile.name.split(' ');

  // Staggered entrance on load (GSAP timeline).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from('[data-h="card"]', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 })
          .from('[data-h="eyebrow"]', { y: 12, autoAlpha: 0, duration: 0.7 }, 0.15)
          .from('[data-h="word"]', { yPercent: 118, rotate: 4, duration: 1.15, stagger: 0.075 }, 0.25)
          .from('[data-h="line"]', { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.6)
          .from('[data-h="badge"]', { y: 16, autoAlpha: 0, scale: 0.97, duration: 0.8, stagger: 0.08 }, 0.85)
          .from('[data-h="portrait"]', { clipPath: 'inset(16% 12% 16% 12% round 22px)', scale: 1.08, duration: 1.6, ease: 'expo.inOut' }, 0.1)
          .from('[data-h="float"]', { y: 14, autoAlpha: 0, scale: 0.9, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.12 }, 1.05)
          .from('[data-h="stat"]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.7);
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="top" ref={scope} className="relative pt-6 sm:pt-10">
      <div className="gutter mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          {/* Identity */}
          <div data-h="card" className="col-span-2 lg:col-span-8">
            <SpotlightCard lift={2} innerClassName="flex h-full flex-col p-6 sm:p-10 lg:p-12">
              <p data-h="eyebrow" className="eyebrow eyebrow-live">
                {profile.affiliation}
              </p>
              <h1 className="mt-6 text-[clamp(2.7rem,7.4vw,5.9rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink">
                <span className="block">
                  <Word>{first}</Word>
                  {rest.length > 1 && (
                    <>
                      {' '}
                      <Word>{rest.slice(0, -1).join(' ')}</Word>
                    </>
                  )}
                </span>
                <span className="block">
                  <Word>{`${rest[rest.length - 1]},`}</Word>{' '}
                  <Word className="align-baseline text-[0.5em] font-bold tracking-[-0.02em] text-cerulean-600">{profile.suffix}</Word>
                </span>
              </h1>

              <p data-h="line" className="mt-7 flex flex-col gap-1.5 text-[15px] font-semibold text-ink sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                {profile.roles.map((r, i) => (
                  <Fragment key={r}>
                    {i > 0 && <span aria-hidden="true" className="hidden h-1.5 w-1.5 rounded-full bg-cerulean-500 sm:inline-block" />}
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-cerulean-500 sm:hidden" />
                      {r}
                    </span>
                  </Fragment>
                ))}
              </p>
              <p data-h="line" className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
                {profile.tagline}
              </p>
              <div data-h="line" className="mt-8 flex flex-wrap gap-3">
                <MagneticButton href="#research">
                  Explore Publications &amp; Projects
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </MagneticButton>
                <MagneticButton href="#contact" variant="secondary">
                  Mentoring &amp; Collaboration
                </MagneticButton>
              </div>

              <ul className="mt-auto grid gap-3 border-t border-line pt-6 sm:grid-cols-3 lg:mt-12">
                {prestigeBadges.map((b) => (
                  <li key={b.label} data-h="badge" className="min-w-0">
                    <PrestigeBadge {...b} className="h-full" />
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>

          {/* Portrait in a glass frame */}
          <div data-h="card" className="col-span-2 lg:col-span-4">
            <SpotlightCard tilt={4} lift={2} tone="tint" innerClassName="flex h-full flex-col p-3 sm:p-4">
              <figure className="portrait-stage relative flex flex-1 items-center justify-center rounded-[22px] p-4 sm:p-6">
                <div className="glass-frame relative w-full max-w-[400px]">
                  <div data-h="portrait" className="portrait-clip relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
                    {/* GANTI FOTO: PORTFOLIO_DATA.profile.portrait */}
                    <img
                      src={profile.portrait.src}
                      alt={profile.portrait.alt}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/25 to-transparent" />
                  </div>
                  <div data-h="float" className="status-badge absolute -left-3 top-5 sm:-left-5">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-prestige-soft text-prestige">
                      <GraduationCap className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[12px] font-bold text-ink">{profile.status.label}</span>
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                        <span className="live-dot" aria-hidden="true" />
                        {profile.status.detail}
                      </span>
                    </span>
                  </div>
                </div>
                <figcaption className="sr-only">{profile.portrait.alt}</figcaption>
              </figure>
              <div data-h="float" className="mt-3 rounded-[20px] border border-line bg-white/85 px-4 py-3.5">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted">Research focus</p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {profile.focus.map((f) => (
                    <li key={f} className="chip">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </div>

          {/* Running research metrics */}
          {heroStats.map((s) => (
            <div key={s.label} data-h="stat" className="col-span-1 lg:col-span-3">
              <SpotlightCard tone={s.prestige ? 'prestige' : 'white'} innerClassName="flex h-full flex-col p-4 sm:p-6">
                <p className={cn('text-[12px] font-semibold sm:text-[13px]', s.prestige ? 'text-prestige' : 'text-muted')}>{s.label}</p>
                <p className={cn('stat-value mt-3', s.prestige ? 'text-prestige' : 'text-ink')}>
                  <Counter value={s.value} from={s.from} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} display={s.display} />
                </p>
                <p className={cn('mt-3 text-[12px] leading-snug sm:text-[13px]', s.prestige ? 'text-prestige-deep/85' : 'text-muted')}>{s.note}</p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
