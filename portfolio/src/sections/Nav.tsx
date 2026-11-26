import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { MagneticButton } from '../components/MagneticButton';
import { cn } from '../lib/utils';

/** Sticky glassmorphism navigation with scroll progress and an active-section pill. */
export function Nav() {
  const { nav, profile } = PORTFOLIO_DATA;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [nav]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav-glass">
      <div className="gutter mx-auto flex max-w-7xl items-center justify-between gap-4 py-3">
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label={`${profile.name}, back to top`}>
          <span className="monogram">TIW</span>
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="block truncate text-[14px] font-bold tracking-tight text-ink">
              {profile.name}, {profile.suffix}
            </span>
            <span className="block truncate text-[11.5px] font-medium text-muted">{profile.affiliation}</span>
          </span>
        </a>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-line bg-white/70 p-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={cn(
                    'relative block rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors',
                    active === n.id ? 'text-cerulean-700' : 'text-muted hover:text-ink',
                  )}
                >
                  {active === n.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-cerulean-50 ring-1 ring-cerulean-200"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-[1]">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <MagneticButton href="#contact" size="sm">
            <span className="hidden sm:inline">Academic Consultation</span>
            <span className="sm:hidden">Consult</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            className="gutter overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="grid grid-cols-2 gap-2 pb-4 pt-1">
              {nav.map((n, i) => (
                <motion.li key={n.id} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.04 * i }}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-2xl border px-4 py-3 text-[14px] font-semibold',
                      active === n.id ? 'border-cerulean-200 bg-cerulean-50 text-cerulean-700' : 'border-line bg-white text-ink',
                    )}
                  >
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-cerulean-600" style={{ scaleX: progress }} />
    </header>
  );
}
