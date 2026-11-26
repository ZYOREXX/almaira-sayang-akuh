import { PORTFOLIO_DATA } from '../data/portfolio';
import { Section } from '../components/ui';
import { Reveal } from '../components/Reveal';
import { ToolGrid } from '../components/Logos';
import { Icon } from '../components/Icon';

export function About() {
  const { about } = PORTFOLIO_DATA;

  return (
    <Section id="about" tone="white">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="about-photo relative mx-auto aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-2xl border border-line shadow-lift">
            {/* GANTI FOTO: PORTFOLIO_DATA.about.photo */}
            <img src={about.photo.src} alt={about.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
        </Reveal>

        <div className="min-w-0">
          <Reveal>
            <p className="eyebrow">Profile</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-ink">{about.heading}</h2>
            <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.75] text-muted">{about.body}</p>
          </Reveal>

          <div className="mt-12 space-y-8">
            {about.stack.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <h3 className="mb-4 flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
                  <Icon name={g.icon} className="h-4 w-4 text-cerulean-600" />
                  {g.title}
                </h3>
                <ToolGrid ids={g.tools} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="rounded-[24px] border border-line bg-canvas p-6 sm:p-7">
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink">Fun fact &amp; quick highlights</p>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                {about.highlights.map((h) => (
                  <li key={h.title} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-cerulean-600 ring-1 ring-line">
                      <Icon name={h.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-ink">{h.title}</span>
                      <span className="mt-1 block text-[14px] leading-snug text-muted">{h.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
