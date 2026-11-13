import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { primaryNav, sections, site } from '../data/site';
import { Emblem } from './ui/Emblem';

const navItems = sections.filter((s) => primaryNav.includes(s.id));

/** Menandai bagian yang sedang dibaca agar tautan navigasi ikut menyala. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!elements.length || !('IntersectionObserver' in window)) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // Bagian teratas yang terlihat dianggap aktif.
        const current = ids.find((id) => visible.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

const allIds = sections.map((s) => s.id);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(allIds);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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

  // Tutup menu bila layar melebar ke tata letak desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const solid = scrolled && !open;

  return (
    <>
      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
          solid
            ? 'border-b border-ink-900/10 bg-ivory-100/85 text-ink-900 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent text-ivory-50'
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <a
            href="#beranda"
            className="group flex min-w-0 items-center gap-3"
            aria-label={`${site.name} ${site.school} ${site.universityShort}, kembali ke awal halaman`}
            onClick={() => setOpen(false)}
          >
            <Emblem
              className={`size-10 shrink-0 transition-colors duration-500 ${solid ? 'text-crimson-600' : 'text-champagne-300'}`}
            />
            <span className="min-w-0 leading-none">
              <span className="display block truncate text-[1.375rem] tracking-[-0.01em]">{site.shortName}</span>
              <span
                className={`eyebrow mt-1 block truncate text-[0.5625rem] tracking-[0.2em] transition-colors duration-500 ${
                  solid ? 'text-taupe-600' : 'text-champagne-200/75'
                }`}
              >
                {site.school} {site.universityShort}
              </span>
            </span>
          </a>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className="group relative block py-2 text-[0.8125rem] font-medium tracking-[0.02em]"
                    >
                      <span
                        className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                      >
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-500 ease-out-expo ${
                          solid ? 'bg-crimson-600' : 'bg-champagne-300'
                        } ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      />
                    </a>
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
              className={`btn hidden min-h-11 px-5 py-2 sm:inline-flex ${solid ? 'btn-ink' : 'btn-line-light'}`}
            >
              Daftar
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">(membuka portal admisi UPI di tab baru)</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={`grid size-11 place-items-center rounded-full border transition-colors duration-300 lg:hidden ${
                solid ? 'border-ink-900/15 hover:border-ink-900/40' : 'border-ivory-50/25 hover:border-ivory-50/60'
              }`}
              aria-expanded={open}
              aria-controls="menu-seluler"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Garis kemajuan baca */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-[-1px] h-px origin-left bg-crimson-600 transition-opacity duration-500 ${
            solid ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'scaleX(0)' }}
        />
      </header>

      {/* Menu seluler layar penuh */}
      <div
        id="menu-seluler"
        className={`no-print grain fixed inset-0 z-40 overflow-y-auto bg-ink-900 text-ivory-50 transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Navigasi seluler" className="shell relative flex min-h-full flex-col pt-28 pb-10">
          <ul className="border-t border-ivory-50/10">
            {sections.map((item, i) => (
              <li key={item.id} className="border-b border-ivory-50/10">
                <a
                  href={`#${item.id}`}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 py-4 transition-[opacity,transform] duration-700 ease-out-expo"
                  style={{
                    transitionDelay: open ? `${80 + i * 45}ms` : '0ms',
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translate3d(0, 14px, 0)',
                  }}
                >
                  <span className="numeral w-7 text-base italic text-champagne-300">{item.index}</span>
                  <span className="display text-[2rem]">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-4 pt-10">
            <a
              href={site.links.admisi}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="btn btn-gold w-full"
            >
              Portal Admisi UPI
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1} className="text-center text-sm text-ivory-200/70">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
