import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { Photo, Publication } from '../data/types';
import { Chip, Section, SectionHeader } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { Counter } from '../components/Counter';
import { BayesScale, CiAxis, EffectBars, NGainBars } from '../components/StatViz';
import { Dialog } from '../components/Dialog';
import { useLightbox } from '../components/Lightbox';
import { formatStat } from '../lib/utils';

function PhotoStrip({ ids, size = 'sm' }: { ids: string[]; size?: 'sm' | 'md' }) {
  const openLightbox = useLightbox();
  const photos = ids.map(getPhoto).filter((p): p is Photo => !!p);
  if (!photos.length) return null;
  const items = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }));
  return (
    <ul className="grid grid-cols-3 gap-2">
      {photos.map((p, i) => (
        <li key={p.src}>
          <button
            type="button"
            onClick={() => openLightbox(items, i)}
            className={`media-tile group/media relative block w-full overflow-hidden rounded-xl ${size === 'sm' ? 'aspect-[4/3]' : 'aspect-[3/2]'}`}
            aria-label={`Enlarge photo: ${p.caption}`}
          >
            <img src={p.thumb ?? p.src} alt={p.alt} loading="lazy" decoding="async" className="media-zoom absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-ink/0 text-white opacity-0 transition duration-300 group-hover/media:bg-ink/35 group-hover/media:opacity-100">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function PublicationCard({ pub, onOpen }: { pub: Publication; onOpen: () => void }) {
  return (
    <SpotlightCard tilt={2} innerClassName="flex h-full flex-col p-6 sm:p-9">
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="cerulean">{pub.venue}</Chip>
        <Chip tone="ink">{pub.authorship}</Chip>
        <span className="ml-auto font-mono text-[12px] text-muted tabular-nums">{pub.year}</span>
      </div>
      <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{pub.kind}</p>
      <h3 className="mt-3 font-serif text-[1.55rem] font-semibold leading-[1.22] text-ink sm:text-[1.85rem]">{pub.title}</h3>
      {pub.titleAlt && <p className="mt-2 font-serif text-[15px] italic leading-snug text-muted">{pub.titleAlt}</p>}
      <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
        {pub.citation ? `${pub.citation} · ` : ''}
        {pub.byline === 'Tio Ilham Wahyudi' ? pub.affiliation : `${pub.byline} · ${pub.affiliation}`}
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {pub.metrics.map((m) => (
          <div key={m.label} className="metric-tile">
            <dt className="text-[11.5px] font-medium text-muted">{m.label}</dt>
            <dd className="mt-1.5 font-mono text-[15px] font-semibold text-ink">
              <Counter value={m.value} from={m.from} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} display={m.display} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
        {pub.ci && <CiAxis {...pub.ci} />}
        {pub.effects && <EffectBars effects={pub.effects} />}
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">{pub.design}</span> · {pub.instruments.join(' & ')}
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{pub.finding}</p>

      {pub.photos && (
        <div className="mt-6">
          <PhotoStrip ids={pub.photos} />
        </div>
      )}

      <div className="mt-auto pt-7">
        <motion.button type="button" onClick={onOpen} className="link-cta group/cta" whileTap={{ scale: 0.97 }}>
          Read Abstract &amp; Statistical Notes
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" aria-hidden="true" />
        </motion.button>
      </div>
    </SpotlightCard>
  );
}

function PublicationDetail({ pub }: { pub: Publication }) {
  return (
    <article>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {pub.kind} · {pub.year}
      </p>
      <h3 id={`pub-${pub.id}-title`} className="mt-3 font-serif text-[1.6rem] font-semibold leading-[1.22] text-ink sm:text-[2.1rem]">
        {pub.title}
      </h3>
      {pub.titleAlt && <p className="mt-2 font-serif text-base italic text-muted">{pub.titleAlt}</p>}
      <p className="mt-4 text-[14px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">{pub.byline}</span> · {pub.affiliation}
        <br />
        {pub.venueFull}
        {pub.citation ? ` · ${pub.citation}` : ''}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {pub.metrics.map((m) => (
          <div key={m.label} className="metric-tile">
            <dt className="text-[11.5px] font-medium text-muted">{m.label}</dt>
            <dd className="mt-1.5 font-mono text-[15px] font-semibold text-ink">
              {m.display ?? `${m.prefix ?? ''}${formatStat(m.value, m.decimals)}${m.suffix ?? ''}`}
            </dd>
          </div>
        ))}
      </dl>

      <h4 className="eyebrow mt-10">Abstract</h4>
      <div className="mt-4 max-w-[68ch] space-y-4 text-[15.5px] leading-[1.75] text-ink/90">
        {pub.abstract.map((para) => (
          <p key={para.slice(0, 32)}>{para}</p>
        ))}
      </div>

      <h4 className="eyebrow mt-10">Statistical notes</h4>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {pub.ci && (
          <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
            <CiAxis {...pub.ci} trigger="mount" />
          </div>
        )}
        {pub.bayes && (
          <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
            <BayesScale {...pub.bayes} trigger="mount" />
          </div>
        )}
        {pub.effects && (
          <>
            <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
              <EffectBars effects={pub.effects} trigger="mount" />
            </div>
            <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
              <NGainBars effects={pub.effects} trigger="mount" />
            </div>
          </>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[460px] border-collapse text-left text-[14px]">
          <caption className="sr-only">Design and statistical results</caption>
          <tbody>
            {pub.notes.map(([k, v]) => (
              <tr key={k} className="border-t border-line first:border-t-0">
                <th scope="row" className="w-[34%] bg-canvas/70 px-4 py-3 align-top font-semibold text-ink">
                  {k}
                </th>
                <td className="px-4 py-3 align-top text-muted tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pub.photos && (
        <>
          <h4 className="eyebrow mt-10">Conference documentation</h4>
          <div className="mt-4">
            <PhotoStrip ids={pub.photos} size="md" />
          </div>
        </>
      )}
    </article>
  );
}

export function Publications() {
  const { publications } = PORTFOLIO_DATA;
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const openPub = publications.find((p) => p.id === openId) as Publication | undefined;

  return (
    <Section id="research">
      <SectionHeader
        eyebrow="Publications & international conferences"
        title="Peer-reviewed evidence, reported in full."
        lead="Two studies on how children move, learn and play fair. Each card shows the design, the instruments and the statistics behind the claim."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {publications.map((p) => (
          <div key={p.id} data-reveal>
            <PublicationCard pub={p as Publication} onOpen={() => setOpenId(p.id)} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openPub && (
          <Dialog
            key={openPub.id}
            labelledBy={`pub-${openPub.id}-title`}
            onClose={close}
            eyebrow={
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="cerulean">{openPub.venue}</Chip>
                <Chip tone="ink">{openPub.authorship}</Chip>
              </div>
            }
          >
            <PublicationDetail pub={openPub} />
          </Dialog>
        )}
      </AnimatePresence>
    </Section>
  );
}
