import { useMemo } from 'react';
import { BadgeCheck, Images, Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Achievement } from '../data/types';
import { Chip, Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Icon } from '../components/Icon';
import { useLightbox, type LightboxItem } from '../components/Lightbox';
import { cn } from '../lib/utils';

/** Images of an achievement for the lightbox (scans or a documentation photo). */
function imagesOf(a: Achievement): LightboxItem[] {
  if (a.visual.kind === 'scan') return a.visual.images.map((im) => ({ src: im.src, alt: im.alt, caption: im.caption ?? a.title }));
  if (a.visual.kind === 'photo') {
    const p = getPhoto(a.visual.photo);
    return p ? [{ src: p.src, alt: p.alt, caption: p.caption }] : [];
  }
  return [];
}

/** Designed summary card for achievements without a scan (clearly not a certificate replica). */
function Emblem({ a }: { a: Achievement }) {
  const prestige = !!a.prestige;
  return (
    <div className={cn('emblem absolute inset-0 grid place-items-center', prestige ? 'emblem-prestige' : 'emblem-cerulean')}>
      <div className="relative flex flex-col items-center px-4 text-center">
        <span className={cn('emblem-ring grid h-20 w-20 place-items-center rounded-full', prestige ? 'text-prestige' : 'text-cerulean-600')}>
          <Icon name={a.icon} className="h-8 w-8" strokeWidth={1.5} />
        </span>
        <span className={cn('mt-4 font-label text-[11px] font-bold uppercase tracking-[0.18em]', prestige ? 'text-prestige' : 'text-cerulean-700')}>
          {a.visual.kind === 'emblem' ? a.visual.code : ''}
        </span>
        <span className="mt-1 text-[11.5px] font-medium text-muted">{a.date}</span>
      </div>
    </div>
  );
}

function AchievementCard({ a, onOpen }: { a: Achievement; onOpen: () => void }) {
  const images = imagesOf(a);
  const thumb =
    a.visual.kind === 'scan'
      ? { src: a.visual.images[0].thumb ?? a.visual.images[0].src, alt: a.visual.images[0].alt, contain: true, position: undefined as string | undefined }
      : a.visual.kind === 'photo'
        ? (() => {
            const p = getPhoto(a.visual.photo);
            return p ? { src: p.thumb ?? p.src, alt: p.alt, contain: p.fit === 'contain', position: p.position } : null;
          })()
        : null;

  return (
    <SpotlightCard tilt={4} tone={a.prestige ? 'prestige' : 'white'} innerClassName="flex h-full flex-col p-3">
      {thumb ? (
        <button
          type="button"
          onClick={onOpen}
          className={cn('media-tile group/media relative block aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-line', thumb.contain ? 'bg-canvas' : 'bg-ink/5')}
          aria-label={`Enlarge: ${a.title}`}
        >
          <img
            src={thumb.src}
            alt={thumb.alt}
            loading="lazy"
            decoding="async"
            className={cn('media-zoom absolute inset-0 h-full w-full', thumb.contain ? 'object-contain p-3' : 'object-cover')}
            style={thumb.position ? { objectPosition: thumb.position } : undefined}
          />
          <span className="zoom-chip">
            {images.length > 1 ? <Images className="h-3.5 w-3.5" aria-hidden="true" /> : <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />}
            {images.length > 1 ? `${images.length} pages` : 'Enlarge'}
          </span>
        </button>
      ) : (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-line">
          <Emblem a={a} />
        </div>
      )}

      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={a.prestige ? 'prestige' : 'plain'}>{a.category}</Chip>
          {a.badge && (
            <Chip tone="cerulean">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {a.badge}
            </Chip>
          )}
        </div>
        <h3 className="mt-4 font-display text-[1.08rem] font-bold leading-snug tracking-[-0.01em] text-ink">{a.title}</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-muted">{a.issuer}</p>
        {a.note && <p className="mt-3 text-[13px] leading-relaxed text-muted">{a.note}</p>}
        <div className="mt-auto pt-5">
          <p className="font-label text-[12px] font-semibold text-ink tabular-nums">{a.date}</p>
          {a.meta?.map((m) => (
            <p key={m} className="mt-0.5 break-words font-label text-[11.5px] font-medium text-muted tabular-nums">
              {m}
            </p>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}

export function Achievements() {
  const achievements = PORTFOLIO_DATA.achievements as Achievement[];
  const openLightbox = useLightbox();

  // One lightbox sequence across all cards that have images.
  const { all, startIndex } = useMemo(() => {
    const list: LightboxItem[] = [];
    const start: Record<string, number> = {};
    achievements.forEach((a) => {
      const imgs = imagesOf(a);
      if (imgs.length) {
        start[a.id] = list.length;
        list.push(...imgs);
      }
    });
    return { all: list, startIndex: start };
  }, [achievements]);

  return (
    <Section id="achievements" tone="canvas" flip>
      <SectionHeader
        eyebrow="Achievements & certifications"
        title="Achievements & certifications."
        lead={`${achievements.length} credentials, from national certification and research funding to international training. Select a card to open the scan.`}
      />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <li key={a.id} data-reveal>
            <AchievementCard a={a} onOpen={() => openLightbox(all, startIndex[a.id] ?? 0)} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
