import { Fragment, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type { Pill } from '../data/types';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';
import { MagneticButton } from '../components/MagneticButton';
import { Icon } from '../components/Icon';

function Word({ children, className }: { children: string; className?: string }) {
  return (
    <span className="word-mask">
      <span data-h="word" className={cn('inline-block', className)}>
        {children}
      </span>
    </span>
  );
}

/** Glass pill that floats gently (Framer Motion loop; off with reduced motion). */
function FloatingPill({ pill, delay, className }: { pill: Pill; delay: number; className?: string }) {
  return (
    <div data-h="pill" className={className}>
      <motion.div
        className="hero-pill"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        whileHover={{ scale: 1.04 }}
      >
        <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-2xl', pill.prestige ? 'bg-prestige-soft text-prestige' : 'bg-cerulean-50 text-cerulean-600')}>
          <Icon name={pill.icon} className="h-5 w-5" />
        </span>
        <span className="min-w-0 text-left leading-tight">
          <span className={cn('block text-[13px] font-bold', pill.prestige ? 'text-prestige' : 'text-ink')}>{pill.label}</span>
          <span className="mt-0.5 block text-[12px] font-medium text-muted">{pill.detail}</span>
        </span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { hero } = PORTFOLIO_DATA;
  const scope = useRef<HTMLElement>(null);
  const [p1, p2, p3] = hero.pills;
  const titleWords = hero.title.toUpperCase().split(' ');
  const half = Math.ceil(titleWords.length / 2);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // 1) Staggered entrance on load.
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from('[data-h="eyebrow"]', { y: 14, autoAlpha: 0, duration: 0.7 }, 0.1)
          .from('[data-h="word"]', { yPercent: 118, rotate: 3, duration: 1.15, stagger: 0.07 }, 0.2)
          .from('[data-h="name"]', { y: 18, autoAlpha: 0, duration: 0.9 }, 0.6)
          .from('[data-h="frame"]', { clipPath: 'inset(18% 14% 18% 14% round 32px)', scale: 1.06, duration: 1.5, ease: 'expo.inOut' }, 0.3)
          .from('[data-h="pill"]', { y: 26, autoAlpha: 0, scale: 0.92, duration: 0.9, stagger: 0.12, ease: 'back.out(1.6)' }, 1.0)
          .from('[data-h="line"]', { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 1.1);

        // 2) Hero recedes as the page scrolls on (video reference: panel drifts back).
        gsap.to('[data-h="recede"]', {
          yPercent: -18,
          scale: 0.94,
          autoAlpha: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
        gsap.to('[data-h="stage"]', {
          y: -60,
          scale: 0.95,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="home" ref={scope} className="band band-canvas pb-20 pt-28 sm:pb-28 sm:pt-32">
      <div className="gutter relative mx-auto max-w-7xl">
        <div data-h="recede" className="text-center">
          <p data-h="eyebrow" className="eyebrow eyebrow-live justify-center">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,9.2vw,7.4rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-ink">
            <span className="block">
              {titleWords.slice(0, half).map((w, i) => (
                <Fragment key={w + i}>
                  {i > 0 && ' '}
                  <Word>{w}</Word>
                </Fragment>
              ))}
            </span>
            <span className="block">
              {titleWords.slice(half).map((w, i) => (
                <Fragment key={w + i}>
                  {i > 0 && ' '}
                  <Word className={i === titleWords.slice(half).length - 1 ? 'text-cerulean-600' : undefined}>{w}</Word>
                </Fragment>
              ))}
            </span>
          </h1>
          <p data-h="name" className="mt-6 font-label text-[clamp(1rem,2.3vw,1.5rem)] font-bold uppercase tracking-[0.08em] text-ink">
            {hero.name}, <span className="normal-case text-cerulean-700">{hero.suffix}</span>
          </p>
        </div>

        {/* Portrait in a glass frame + floating pills */}
        <div data-h="stage" className="mt-10 grid items-center gap-4 sm:mt-14 lg:grid-cols-[1fr_minmax(0,380px)_1fr] lg:gap-8">
          <div className="order-2 hidden flex-col items-end gap-24 lg:order-1 lg:flex">
            <FloatingPill pill={p1} delay={0} />
            <FloatingPill pill={p3} delay={1.2} className="mr-10" />
          </div>

          <figure className="order-1 mx-auto w-full max-w-[360px] lg:order-2">
            <div className="glass-frame hero-frame">
              <div data-h="frame" className="portrait-clip relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
                {/* GANTI FOTO: PORTFOLIO_DATA.hero.portrait */}
                <img src={hero.portrait.src} alt={hero.portrait.alt} className="absolute inset-0 h-full w-full object-cover object-top" loading="eager" decoding="async" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/25 to-transparent" />
              </div>
            </div>
          </figure>

          <div className="order-3 hidden lg:flex lg:flex-col lg:items-start">
            <FloatingPill pill={p2} delay={0.6} className="ml-2" />
          </div>

          {/* Mobile / tablet: pills below the photo, no overlap */}
          <div className="order-3 grid gap-3 sm:grid-cols-3 lg:hidden">
            {hero.pills.map((p, i) => (
              <FloatingPill key={p.label} pill={p} delay={i * 0.6} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p data-h="line" className="flex flex-col items-center gap-1.5 font-display text-[15px] font-semibold text-ink sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3">
            {hero.roles.map((r, i) => (
              <Fragment key={r}>
                {i > 0 && <span aria-hidden="true" className="hidden h-1.5 w-1.5 rounded-full bg-cerulean-500 sm:inline-block" />}
                <span>{r}</span>
              </Fragment>
            ))}
          </p>
          <p data-h="line" className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
            {hero.tagline}
          </p>
          <div data-h="line" className="mt-8 flex flex-wrap justify-center gap-3">
            <MagneticButton href="#works">
              Explore Works &amp; Research
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              Mentoring &amp; Collaboration
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
