import { ArrowUpRight, ChevronDown, Instagram, Mail, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { navGroups, site } from '../data/site';
import { Emblem } from './ui/Emblem';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header className="no-print fixed inset-x-0 top-0 z-50">
        {/* Bilah utilitas */}
        <div
          className={`hidden overflow-hidden bg-navy-900 text-paper-200 transition-[max-height] duration-500 ease-out-expo lg:block ${
            scrolled ? 'max-h-0' : 'max-h-10'
          }`}
        >
          <div className="shell flex h-10 items-center justify-between text-[0.75rem]">
            <p className="tracking-wide text-paper-200/80">
              {site.school} · {site.university}
            </p>
            <ul className="flex items-center gap-6">
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-sun-300">
                  <Mail className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-sun-300"
                >
                  <Instagram className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {site.instagram.handle}
                </a>
              </li>
              <li>
                <a href={site.links.sps} target="_blank" rel="noopener noreferrer" className="hover:text-sun-300">
                  Laman SPs UPI
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigasi utama */}
        <div
          className={`relative border-b bg-paper-50/90 text-navy-900 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-500 ${
            scrolled || open ? 'border-navy-900/10 shadow-[0_8px_30px_-12px_rgba(10,18,48,0.18)]' : 'border-transparent'
          }`}
        >
          <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
            <a
              href="#beranda"
              className="flex min-w-0 items-center gap-3"
              aria-label={`${site.name} ${site.school} ${site.universityShort}, kembali ke awal halaman`}
              onClick={() => setOpen(false)}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-royal-500 to-deep-900 text-sun-300 shadow-lg shadow-royal-600/25">
                <Emblem className="size-8" />
              </span>
              <span className="min-w-0 leading-none">
                <span className="display block truncate text-[1.0625rem]">{site.shortName}</span>
                <span className="mt-1.5 block truncate text-[0.6875rem] font-medium tracking-wide text-mute-500">
                  {site.school} {site.universityShort}
                </span>
              </span>
            </a>

            <nav aria-label="Navigasi utama" className="hidden lg:block" onMouseLeave={() => setMenu(null)}>
              <ul className="flex items-center gap-1">
                {navGroups.map((group) => {
                  const isOpen = menu === group.label;
                  return (
                    <li
                      key={group.label}
                      className="relative"
                      onMouseEnter={() => setMenu(group.children ? group.label : null)}
                    >
                      {group.children ? (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                          onClick={() => setMenu(isOpen ? null : group.label)}
                          onKeyDown={(e) => e.key === 'Escape' && setMenu(null)}
                          className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.875rem] font-semibold transition-colors duration-300 ${
                            isOpen ? 'bg-royal-600/8 text-royal-600' : 'hover:bg-navy-900/5'
                          }`}
                        >
                          {group.label}
                          <ChevronDown
                            className={`size-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <a
                          href={group.href}
                          className="inline-flex rounded-full px-3.5 py-2 text-[0.875rem] font-semibold transition-colors duration-300 hover:bg-navy-900/5"
                        >
                          {group.label}
                        </a>
                      )}
                      <AnimatePresence>
                        {group.children && isOpen ? (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full left-1/2 w-80 -translate-x-1/2 pt-3"
                          >
                            <ul className="rounded-2xl bg-paper-50 p-2 shadow-[0_24px_60px_-20px_rgba(10,18,48,0.35)] ring-1 ring-navy-900/10">
                              {group.children.map((child) => (
                                <li key={child.href + child.label}>
                                  <a
                                    href={child.href}
                                    onClick={() => setMenu(null)}
                                    className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-paper-200"
                                  >
                                    <span>
                                      <span className="block text-[0.875rem] font-semibold">{child.label}</span>
                                      <span className="mt-0.5 block text-[0.75rem] text-mute-500">{child.hint}</span>
                                    </span>
                                    <ArrowUpRight
                                      className="size-4 shrink-0 text-royal-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                                      strokeWidth={1.75}
                                      aria-hidden="true"
                                    />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={site.links.admisi}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-royal hidden min-h-11 px-5 py-2 sm:inline-flex"
              >
                Daftar
                <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">(membuka portal admisi UPI di tab baru)</span>
              </a>
              <button
                ref={toggleRef}
                type="button"
                className="grid size-11 place-items-center rounded-full border border-navy-900/15 transition-colors duration-300 hover:border-navy-900/40 lg:hidden"
                aria-expanded={open}
                aria-controls="menu-seluler"
                aria-label={open ? 'Tutup menu' : 'Buka menu'}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Garis kemajuan baca */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-royal-600 via-royal-500 to-sun-300"
            style={{ scaleX: progress }}
          />
        </div>
      </header>

      {/* Menu seluler */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-seluler"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="no-print fixed inset-0 z-40 overflow-y-auto bg-paper-50 text-navy-900 lg:hidden"
          >
            <nav aria-label="Navigasi seluler" className="shell flex min-h-full flex-col pt-24 pb-8">
              <ul className="divide-y divide-navy-900/10 border-y border-navy-900/10">
                {navGroups.map((group, i) => {
                  const isExpanded = expanded === group.label;
                  return (
                    <motion.li
                      key={group.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {group.children ? (
                        <>
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => setExpanded(isExpanded ? null : group.label)}
                            className="display flex w-full items-center justify-between py-4 text-left text-[1.375rem]"
                          >
                            {group.label}
                            <ChevronDown
                              className={`size-5 text-mute-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isExpanded ? (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                {group.children.map((child) => (
                                  <li key={child.href + child.label}>
                                    <a
                                      href={child.href}
                                      onClick={() => setOpen(false)}
                                      className="block rounded-xl px-4 py-3 text-[0.9375rem] font-medium text-mute-700 hover:bg-paper-200"
                                    >
                                      {child.label}
                                    </a>
                                  </li>
                                ))}
                                <li aria-hidden="true" className="h-3" />
                              </motion.ul>
                            ) : null}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={group.href}
                          onClick={() => setOpen(false)}
                          className="display block py-4 text-[1.375rem]"
                        >
                          {group.label}
                        </a>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-auto flex flex-col gap-4 pt-8">
                <a href={site.links.admisi} target="_blank" rel="noopener noreferrer" className="btn btn-royal w-full">
                  Portal Admisi UPI
                  <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden="true" />
                </a>
                <a href={`mailto:${site.email}`} className="text-center text-sm text-mute-600">
                  {site.email}
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
