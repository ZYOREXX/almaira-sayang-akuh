import { useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';

/** Signature footer: oversized name that slides into place as the page ends. */
export function Footer() {
  const { hero, nav, contact } = PORTFOLIO_DATA;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-sign]',
          { yPercent: 40, letterSpacing: '0.04em' },
          { yPercent: 0, letterSpacing: '-0.04em', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="band band-canvas overflow-hidden border-t border-line">
      <div className="gutter relative mx-auto max-w-7xl pb-6 pt-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="eyebrow">Signature</p>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted">{hero.roles.join(' · ')}</p>
            <p className="mt-3 select-all font-label text-[13px] font-semibold text-ink">{contact.email}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 font-label text-[13px] font-semibold">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-muted transition-colors hover:text-cerulean-700">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          data-sign
          aria-hidden="true"
          className="mt-14 select-none whitespace-nowrap text-center font-display text-[clamp(1.6rem,6.2vw,6.6rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-ink"
        >
          {hero.name}
          <span className="text-cerulean-600">.</span>
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-5 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {hero.name}, {hero.suffix} · Sport Education, Universitas Pendidikan Indonesia
          </p>
          <a href="#home" className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white px-4 py-2 font-label text-[12.5px] font-semibold text-ink transition-colors hover:border-cerulean-300 hover:text-cerulean-700 sm:self-auto">
            Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
