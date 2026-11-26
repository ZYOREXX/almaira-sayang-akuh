import { Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import { Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { ParallaxImage } from '../components/ParallaxImage';
import { useLightbox } from '../components/Lightbox';
import type { Photo, Pillar } from '../data/types';
import { cn } from '../lib/utils';

function PillarBody({ pillar }: { pillar: Pillar }) {
  return (
    <>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cerulean-50 text-cerulean-600 ring-1 ring-cerulean-100 transition-transform duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110">
        <Icon name={pillar.icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-6 text-[1.35rem] font-bold leading-snug tracking-tight text-ink">{pillar.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{pillar.body}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {pillar.tags.map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Pillars() {
  const { pillars, summary } = PORTFOLIO_DATA;
  const openLightbox = useLightbox();
  const [a, b, c] = pillars;
  const photos = (c.photos ?? []).map(getPhoto).filter((p): p is Photo => !!p);

  return (
    <Section id="pillars">
      <SectionHeader eyebrow="Core pillars & services" title="Research rigour, applied where sport happens." lead={summary} />

      <div className="grid gap-4 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-7">
          <SpotlightCard tilt={2} innerClassName="flex h-full flex-col p-7 sm:p-9">
            <PillarBody pillar={a} />
          </SpotlightCard>
        </div>
        <div data-reveal className="lg:col-span-5">
          <SpotlightCard tilt={2} innerClassName="flex h-full flex-col p-7 sm:p-9">
            <PillarBody pillar={b} />
          </SpotlightCard>
        </div>
        <div data-reveal className="lg:col-span-12">
          <SpotlightCard innerClassName="grid gap-6 p-4 sm:p-5 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col p-3 sm:p-4 lg:col-span-5 lg:py-6">
              <PillarBody pillar={c} />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-7">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => openLightbox(photos.map((x) => ({ src: x.src, alt: x.alt, caption: x.caption })), i)}
                  className={cn('media-tile group/media relative block w-full overflow-hidden rounded-[20px] text-left', 'aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[320px]')}
                  aria-label={`Enlarge photo: ${p.caption}`}
                >
                  <ParallaxImage src={p.thumb ?? p.src} alt={p.alt} position={p.position} imgClassName="media-zoom" />
                  <span className="media-caption">
                    <span className="line-clamp-2">{p.caption}</span>
                    <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </Section>
  );
}
