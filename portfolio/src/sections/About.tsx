import { PORTFOLIO_DATA } from '../data/portfolio';
import type { BrandId } from '../data/brandIcons';
import { Section } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { MetricCard } from '../components/MetricCard';
import { WordFill } from '../components/WordFill';
import { LogoDock } from '../components/LogoDock';
import { Icon } from '../components/Icon';

export function About() {
  const { about } = PORTFOLIO_DATA;

  return (
    <Section id="about" tone="white" flip>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: portrait + metrics (sticky on desktop) */}
        <div>
          <div className="lg:sticky lg:top-28">
            <div data-reveal className="about-photo relative mx-auto aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-2xl border border-line">
              {/* GANTI FOTO: PORTFOLIO_DATA.about.photo */}
              <img src={about.photo.src} alt={about.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                Sport Education · Universitas Pendidikan Indonesia
              </p>
            </div>
            <div data-reveal className="mx-auto mt-4 grid max-w-[480px] grid-cols-1 gap-3 sm:grid-cols-3">
              {about.metrics.map((m) => (
                <MetricCard key={m.label} m={m} compact />
              ))}
            </div>
          </div>
        </div>

        {/* Right: story, tools, personas */}
        <div className="min-w-0">
          <div data-reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-ink">{about.heading}</h2>
          </div>
          <WordFill text={about.statement} className="mt-8 font-display text-[clamp(1.35rem,2.6vw,1.95rem)] font-semibold leading-[1.32] tracking-[-0.015em]" />
          <p data-reveal className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-muted">
            {about.body}
          </p>

          <div data-reveal className="mt-12">
            <h3 className="font-label text-[12px] font-bold uppercase tracking-[0.16em] text-ink">Software &amp; research tools</h3>
            <div className="mt-5 space-y-4">
              {about.stack.map((g) => (
                <div key={g.title} className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
                  <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                    <Icon name={g.icon} className="h-4 w-4 text-cerulean-600" />
                    {g.title}
                  </p>
                  <LogoDock tools={g.tools as BrandId[]} size="sm" className="mt-4" />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-snug text-muted">
              Logos are trademarks of their owners. SPSS, Stata, SmartPLS, VOSviewer, Publish or Perish, CapCut and Snapseed use simple stand-in badges.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {about.personas.map((p) => (
              <div key={p.title} data-reveal>
                <SpotlightCard tilt={3} innerClassName="flex h-full flex-col p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cerulean-50 text-cerulean-600 ring-1 ring-cerulean-100">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.body}</p>
                  <ul className="mt-4 space-y-1.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-[13px] text-ink/85">
                        <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cerulean-500" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
