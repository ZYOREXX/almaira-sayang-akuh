import { Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Photo } from '../data/types';
import { Chip, PrestigeBadge, Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { useLightbox } from '../components/Lightbox';
import { cn } from '../lib/utils';
import { SwipeSimulator } from './SwipeSimulator';

export function SwipeProject() {
  const { swipe } = PORTFOLIO_DATA;
  const openLightbox = useLightbox();
  const photos = swipe.photos.map(getPhoto).filter((p): p is Photo => !!p);
  const lightboxItems = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }));

  return (
    <Section id="project">
      <SectionHeader
        eyebrow={`Featured innovation · ${swipe.program}`}
        title={
          <>
            {swipe.acronym}: a smarter whistle for <span className="text-cerulean-600">PE &amp; coaching.</span>
          </>
        }
        lead={swipe.summary}
      />

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Overview */}
        <div data-reveal className="lg:col-span-7">
          <SpotlightCard innerClassName="flex h-full flex-col p-6 sm:p-9">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{swipe.program} · Sport-tech hardware</p>
            <h3 className="mt-3 text-[1.6rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2rem]">{swipe.title}</h3>
            <p className="mt-2 font-serif text-[15px] italic leading-snug text-muted">{swipe.subtitleId}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {swipe.achievements.map((a) =>
                a.prestige ? (
                  <PrestigeBadge key={a.label} icon="trophy" label={a.label} detail={a.detail} />
                ) : (
                  <div key={a.label} className="flex items-start gap-3 rounded-2xl border border-cerulean-200 bg-cerulean-50 px-3.5 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-cerulean-600">
                      <Icon name="milestone" className="h-[18px] w-[18px]" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold leading-snug text-cerulean-800">{a.label}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-cerulean-900/80">{a.detail}</span>
                    </span>
                  </div>
                ),
              )}
            </div>

            <p className="mt-6 text-[14px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">My role · </span>
              {swipe.role}
            </p>

            <h4 className="eyebrow mt-8">Technical specification</h4>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {swipe.specs.map((s, i) => (
                <li
                  key={s.label}
                  className={cn(
                    'spec-row group/spec flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3 transition-colors hover:border-cerulean-300 hover:bg-cerulean-50/60',
                    i === swipe.specs.length - 1 && swipe.specs.length % 2 === 1 && 'sm:col-span-2',
                  )}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-cerulean-300 transition-transform duration-300 group-hover/spec:scale-110">
                    <Icon name={s.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[13px] font-semibold text-ink">{s.label}</span>
                    <span className="block text-[12px] text-muted">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>

        {/* Interactive simulator */}
        <div data-reveal className="lg:col-span-5">
          <SpotlightCard tone="tint" lift={2} innerClassName="flex h-full flex-col p-6 sm:p-8">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-[15px] font-bold text-ink">Try the interface</h3>
              <Chip tone="cerulean">Interactive</Chip>
            </div>
            <SwipeSimulator />
          </SpotlightCard>
        </div>

        {/* Prototype visuals */}
        {photos.map((p, i) => (
          <div key={p.src} data-reveal className="lg:col-span-4">
            <SpotlightCard innerClassName="flex h-full flex-col p-3">
              <button
                type="button"
                onClick={() => openLightbox(lightboxItems, i)}
                className="media-tile group/media relative block aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-white"
                aria-label={`Enlarge image: ${p.caption}`}
              >
                <img src={p.thumb ?? p.src} alt={p.alt} loading="lazy" decoding="async" className="media-zoom absolute inset-0 h-full w-full object-contain p-3" />
                <span className="zoom-chip">
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> Enlarge
                </span>
              </button>
              <p className="px-2 pb-2 pt-3 text-[13px] leading-snug text-muted">{p.caption}</p>
            </SpotlightCard>
          </div>
        ))}

        {/* Team */}
        <div data-reveal className="lg:col-span-4">
          <SpotlightCard innerClassName="flex h-full flex-col p-6">
            <h4 className="eyebrow">Interdisciplinary team</h4>
            <ul className="mt-4 space-y-2.5">
              {swipe.team.map((m) => (
                <li key={m.name} className={cn('flex items-start gap-3 rounded-xl px-2.5 py-2', m.self && 'bg-cerulean-50 ring-1 ring-cerulean-200')}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                      m.self ? 'bg-cerulean-600 text-white' : 'bg-canvas text-ink ring-1 ring-line',
                    )}
                  >
                    {m.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="block text-[13.5px] font-semibold text-ink">
                      {m.name}
                      {m.role && <span className="font-medium text-cerulean-700"> · {m.role}</span>}
                    </span>
                    <span className="block text-[12px] text-muted">{m.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </Section>
  );
}
