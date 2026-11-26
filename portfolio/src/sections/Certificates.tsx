import { useRef } from 'react';
import { Images, Maximize2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type { Certificate } from '../data/types';
import { Chip, Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { useLightbox, type LightboxItem } from '../components/Lightbox';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';

/** Shown when a certificate has no scan yet: a designed summary card (not a replica). */
function CredentialEmblem({ cert }: { cert: Certificate }) {
  const prestige = !!cert.prestige;
  return (
    <div className={cn('emblem absolute inset-0 grid place-items-center', prestige ? 'emblem-prestige' : 'emblem-cerulean')}>
      <div className="relative flex flex-col items-center text-center">
        <span className={cn('emblem-ring grid h-20 w-20 place-items-center rounded-full sm:h-24 sm:w-24', prestige ? 'text-prestige' : 'text-cerulean-600')}>
          <Icon name={cert.icon} className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.5} />
        </span>
        <span className={cn('mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]', prestige ? 'text-prestige' : 'text-cerulean-700')}>{cert.code}</span>
        <span className="mt-1 text-[11.5px] font-medium text-muted">{cert.date}</span>
      </div>
    </div>
  );
}

function CertificateCard({ cert, onOpen }: { cert: Certificate; onOpen: () => void }) {
  const hasImage = !!cert.image;
  const media = (
    <>
      {hasImage ? (
        <img
          src={cert.image!.thumb ?? cert.image!.src}
          alt={cert.image!.alt}
          loading="lazy"
          decoding="async"
          className="media-zoom absolute inset-0 h-full w-full object-contain p-3 sm:p-4"
        />
      ) : (
        <CredentialEmblem cert={cert} />
      )}
      {hasImage && (
        <span className="zoom-chip">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          {cert.more?.length ? `View ${1 + cert.more.length} pages` : 'Enlarge'}
        </span>
      )}
    </>
  );

  return (
    <SpotlightCard tilt={5} tone={cert.prestige ? 'prestige' : 'white'} innerClassName="flex h-full flex-col p-3">
      {hasImage ? (
        <button
          type="button"
          onClick={onOpen}
          className="media-tile group/media relative block aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-line bg-canvas"
          aria-label={`Enlarge certificate: ${cert.title}`}
        >
          {media}
        </button>
      ) : (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-line">{media}</div>
      )}

      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Chip>{cert.category}</Chip>
          {cert.prestige && <Chip tone="prestige">{cert.prestigeLabel ?? 'Prestige'}</Chip>}
        </div>
        <h3 className="mt-4 font-serif text-[1.2rem] font-semibold leading-snug text-ink">{cert.title}</h3>
        {cert.subtitle && <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-ink/80">{cert.subtitle}</p>}
        <p className="mt-2 text-[13px] leading-snug text-muted">{cert.issuer}</p>
        {cert.focus && <p className="mt-3 text-[13px] leading-relaxed text-muted">{cert.focus}</p>}
        <p className="mt-auto flex flex-wrap items-center gap-x-2 pt-5 font-mono text-[12px] text-ink tabular-nums">
          <span>{cert.date}</span>
          {cert.meta && <span className="text-muted">· {cert.meta}</span>}
        </p>
      </div>
    </SpotlightCard>
  );
}

export function Certificates() {
  const { featured, additional } = PORTFOLIO_DATA.certificates;
  const openLightbox = useLightbox();
  const gridRef = useRef<HTMLDivElement>(null);

  /*
    Horizontal scroll-reveal, scrubbed to scroll: cards glide in from the
    right. Cards further right start further out, so neighbours only ever
    spread apart (never overlap) in any column layout.
  */
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-slide]').forEach((el) => {
          const offset = () => 36 + ((el.offsetLeft - grid.offsetLeft) / Math.max(grid.offsetWidth, 1)) * 150;
          gsap.fromTo(
            el,
            { x: offset, rotate: 1.2 },
            {
              x: 0,
              rotate: 0,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 58%', scrub: 0.7, invalidateOnRefresh: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef },
  );

  const certItems = (c: Certificate): LightboxItem[] =>
    c.image ? [c.image, ...(c.more ?? [])].map((im) => ({ src: im.src, alt: im.alt, caption: im.caption ?? c.title })) : [];

  return (
    <Section id="credentials" className="overflow-x-clip">
      <SectionHeader
        eyebrow="Visual certificate showcase"
        title="Certifications & scholarly forums."
        lead="National certification, international training, and the forums where the research was presented and discussed. Select a certificate to view the scan."
      />

      <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {featured.map((c, i) => (
          <div
            key={c.id}
            data-slide=""
            className={cn(i < 3 ? 'lg:col-span-2' : 'lg:col-span-3', i === featured.length - 1 && featured.length % 2 === 1 && 'md:col-span-2 lg:col-span-3')}
          >
            <CertificateCard cert={c as Certificate} onOpen={() => openLightbox(certItems(c as Certificate))} />
          </div>
        ))}
      </div>

      {additional.length > 0 && (
        <div data-reveal className="mt-8 rounded-[24px] border border-line bg-white/80 p-5 shadow-soft sm:p-6">
          <h3 className="eyebrow">Also completed</h3>
          <ul className="mt-4 divide-y divide-line">
            {additional.map((a) => (
              <li key={a.title} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug text-ink">{a.title}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {a.issuer} · <span className="font-mono">{a.date}</span>
                  </p>
                </div>
                {a.images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openLightbox(a.images.map((im) => ({ src: im.src, alt: im.alt, caption: im.caption })))}
                    className="btn btn-secondary btn-sm shrink-0 self-start sm:self-auto"
                  >
                    <Images className="h-4 w-4" aria-hidden="true" />
                    View {a.images.length} {a.images.length === 1 ? 'scan' : 'scans'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
