import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { cn } from '../lib/utils';

/** Floating pill navigation (sticky, glassy) with an active-section indicator. */
export function Nav() {
  const { nav } = PORTFOLIO_DATA;
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [nav]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const activeLabel = nav.find((n) => n.id === active)?.label ?? 'Home';

  return (
    <>
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[61] h-[2px] origin-left bg-cerulean-600" style={{ scaleX: progress }} />
      <div className="nav-dock">
        <motion.nav
          aria-label="Sections"
          className="nav-pill"
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.15 }}
        >
          <a href="#home" className="monogram !h-9 !w-9 !rounded-full !text-[10.5px]" aria-label="Back to top">
            TIW
          </a>
          <ul className="hidden items-center gap-0.5 md:flex">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="nav-link" aria-current={active === n.id ? 'true' : undefined}>
                  {active === n.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-cerulean-600 shadow-[0_8px_18px_-10px_rgba(2,132,199,0.9)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-[1]">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <span className="px-2 font-label text-[12.5px] font-semibold text-ink md:hidden" aria-live="polite">
            {activeLabel}
          </span>
          <button
            type="button"
            className="icon-btn !h-9 !w-9 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </motion.nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-4 z-50 rounded-[28px] border border-line bg-white/95 p-2 shadow-glass backdrop-blur md:hidden"
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 72px)' }}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <ul className="grid grid-cols-2 gap-1.5">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-2xl px-4 py-3 font-label text-[13.5px] font-semibold',
                      active === n.id ? 'bg-cerulean-600 text-white' : 'bg-canvas text-ink',
                    )}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
