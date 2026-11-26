import { Fragment, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type { Pill } from '../data/types';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';
import { MagneticButton } from '../components/MagneticButton';
import { Icon } from '../components/Icon';
import { OrgLogo } from '../components/Logos';

/** Dark-glass badge beside the portrait; floats gently. */
function HeroPill({ pill, delay, className }: { pill: Pill; delay: number; className?: string }) {
  return (
    <div data-h="pill" className={className}>
      <motion.div
        className="hero-pill-dark"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        whileHover={{ scale: 1.04 }}
      >
        {pill.logo ? (
          <OrgLogo id={pill.logo} className="h-10 w-10 shrink-0 !rounded-xl !p-1" />
        ) : (
          <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', pill.prestige ? 'bg-prestige-soft text-prestige' : 'bg-white/10 text-sky-300')}>
            {pill.icon && <Icon name={pill.icon} className="h-5 w-5" />}
          </span>
        )}
        <span className="min-w-0 text-left leading-tight">
          <span className={cn('block text-[14px] font-bold', pill.prestige ? 'text-amber-200' : 'text-white')}>{pill.label}</span>
          <span className="mt-0.5 block text-[12.5px] font-medium text-slate-300">{pill.detail}</span>
        </span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { hero } = PORTFOLIO_DATA;
  const scope = useRef<HTMLElement>(null);
  const [p1, p2, p3] = hero.pills;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Opening: slow, elegant fade-in with a subtle scale on title and portrait.
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-h="bg"]', { scale: 1.12, duration: 2.6, ease: 'power2.out' }, 0)
          .from('[data-h="inst"]', { autoAlpha: 0, y: 12, duration: 1.1 }, 0.2)
          .from('[data-h="title"]', { autoAlpha: 0, scale: 1.06, y: 18, duration: 1.6 }, 0.35)
          .from('[data-h="name"]', { autoAlpha: 0, y: 14, duration: 1.2 }, 0.75)
          .from('[data-h="photo"]', { autoAlpha: 0, scale: 1.05, duration: 1.7 }, 0.6)
          .from('[data-h="pill"]', { autoAlpha: 0, y: 20, duration: 1.1, stagger: 0.15 }, 1.2)
          .from('[data-h="roles"]', { autoAlpha: 0, y: 12, duration: 1.1, stagger: 0.1 }, 1.35);

        // Background drifts slower than the page (no pin; natural scroll).
        gsap.to('[data-h="bg"]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="home" ref={scope} className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-950">
      {/* Full-bleed UPI illustration + cinematic dark overlay */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img data-h="bg" src={hero.background.src} alt="" className="h-full w-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_35%,transparent,rgba(2,6,23,0.55))]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      <div className="gutter relative mx-auto max-w-7xl pb-24 pt-32 sm:pb-28 sm:pt-36">
        <div className="text-center">
          <p data-h="inst" className="inline-flex items-center gap-3 font-display text-[12px] font-bold uppercase tracking-[0.2em] text-sky-300 sm:text-[13px]">
            <OrgLogo id={hero.institutionLogo} className="h-9 w-9 !rounded-full !p-1" />
            {hero.institution}
          </p>
          <h1 data-h="title" className="mt-7 font-display text-[clamp(2.4rem,8.4vw,6.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white">
            {hero.title}
          </h1>
          <p data-h="name" className="mt-5 font-display text-[clamp(1.05rem,2.4vw,1.6rem)] font-bold uppercase tracking-[0.12em] text-white">
            {hero.name}, <span className="normal-case text-sky-300">{hero.suffix}</span>
          </p>
        </div>

        <div className="mt-12 grid items-center gap-5 sm:mt-14 lg:grid-cols-[1fr_minmax(0,360px)_1fr] lg:gap-10">
          <div className="hidden flex-col items-end gap-20 lg:flex">
            <HeroPill pill={p1} delay={0} />
            <HeroPill pill={p3} delay={1.2} className="mr-8" />
          </div>
          <figure data-h="photo" className="mx-auto w-full max-w-[340px]">
            <div className="rounded-[30px] border border-white/20 bg-white/5 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                {/* GANTI FOTO UTAMA: PORTFOLIO_DATA.hero.portrait */}
                <img src={hero.portrait.src} alt={hero.portrait.alt} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
              </div>
            </div>
          </figure>
          <div className="hidden lg:flex lg:items-start">
            <HeroPill pill={p2} delay={0.6} className="ml-2" />
          </div>
          {/* Mobile & tablet: pills under the photo (never over the face) */}
          <div className="grid gap-3 sm:grid-cols-3 lg:hidden">
            {hero.pills.map((p, i) => (
              <HeroPill key={p.label} pill={p} delay={i * 0.6} />
            ))}
          </div>
        </div>

        <p className="mt-12 flex flex-col items-center gap-1.5 text-center font-display text-[15px] font-semibold text-slate-200 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3 sm:text-base">
          {hero.roles.map((r, i) => (
            <Fragment key={r}>
              {i > 0 && <span aria-hidden="true" className="hidden h-1.5 w-1.5 rounded-full bg-sky-400 sm:inline-block" />}
              <span data-h="roles">{r}</span>
            </Fragment>
          ))}
        </p>
        <div data-h="roles" className="mt-9 flex flex-wrap justify-center gap-3">
          <MagneticButton href="#works">
            Explore Works
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton href="#contact" variant="secondary">
            Get in Touch
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
