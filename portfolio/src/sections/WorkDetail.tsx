import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { getPhoto } from '../data/portfolio';
import type { ConferenceWork, JournalWork, MetricData, Photo, ProjectWork, ServiceWork, Work } from '../data/types';
import type { BrandId } from '../data/brandIcons';
import { BayesScale, CiAxis, EffectBars, NGainBars, PrePost } from '../components/StatViz';
import { Chip, PrestigeBadge } from '../components/ui';
import { Icon } from '../components/Icon';
import { LogoDock } from '../components/LogoDock';
import { useLightbox } from '../components/Lightbox';
import { cn, formatStat } from '../lib/utils';
import { SwipeSimulator } from './SwipeSimulator';

/* ---------------- shared building blocks ---------------- */

export function metricText(m: MetricData) {
  if (typeof m.value !== 'number') return m.display ?? '';
  return m.display ?? `${m.prefix ?? ''}${formatStat(m.value, m.decimals ?? 0)}${m.suffix ?? ''}`;
}

function Heading({ children }: { children: string }) {
  return <h4 className="eyebrow mb-4 mt-10">{children}</h4>;
}

function StaticMetrics({ metrics }: { metrics: MetricData[] }) {
  if (!metrics.length) return null;
  return (
    <dl className={cn('mt-6 grid gap-2.5', metrics.length > 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2')}>
      {metrics.map((m) => (
        <div key={m.label} className="metric-tile">
          <dt className="font-label text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">{m.label}</dt>
          <dd className="mt-1.5 font-display text-[18px] font-extrabold tabular-nums text-ink">{metricText(m)}</dd>
        </div>
      ))}
    </dl>
  );
}

function KeyTable({ rows, caption }: { rows: Array<[string, string]>; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[460px] border-collapse text-left text-[14px]">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-line first:border-t-0">
              <th scope="row" className="w-[30%] bg-canvas/70 px-4 py-3 align-top font-semibold text-ink">
                {k}
              </th>
              <td className="px-4 py-3 align-top text-muted">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PhotoStrip({ ids }: { ids: string[] }) {
  const openLightbox = useLightbox();
  const photos = ids.map(getPhoto).filter((p): p is Photo => !!p);
  if (!photos.length) return null;
  const items = photos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption }));
  return (
    <ul className={cn('grid gap-2.5', photos.length >= 3 ? 'grid-cols-3' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:max-w-sm')}>
      {photos.map((p, i) => (
        <li key={p.src}>
          <button
            type="button"
            onClick={() => openLightbox(items, i)}
            className={cn('media-tile group/media relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-line', p.fit === 'contain' ? 'bg-white' : 'bg-canvas')}
            aria-label={`Enlarge: ${p.caption}`}
          >
            <img
              src={p.thumb ?? p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className={cn('media-zoom absolute inset-0 h-full w-full', p.fit === 'contain' ? 'object-contain p-2' : 'object-cover')}
            />
            <span className="absolute inset-0 grid place-items-center bg-ink/0 text-white opacity-0 transition duration-300 group-hover/media:bg-ink/35 group-hover/media:opacity-100">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Abstract({ paragraphs, keywords }: { paragraphs: string[]; keywords: string[] }) {
  return (
    <>
      <Heading>Abstract</Heading>
      <div className="max-w-[70ch] space-y-4 text-[15.5px] leading-[1.75] text-ink/90">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Keywords">
        {keywords.map((k) => (
          <li key={k} className="chip chip-cerulean">
            {k}
          </li>
        ))}
      </ul>
    </>
  );
}

function Header({ work, byline, affiliation, extra }: { work: Work; byline?: string; affiliation?: string; extra?: string }) {
  return (
    <>
      <p className="font-label text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        {work.kind} · {work.year}
      </p>
      <h3 id={`work-${work.id}-title`} className="mt-3 font-display text-[1.55rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[2rem]">
        {work.title}
      </h3>
      {work.titleAlt && <p className="mt-2 text-[16px] font-medium italic text-muted">{work.titleAlt}</p>}
      <p className="mt-4 text-[14px] leading-relaxed text-muted">
        {byline && <span className="font-semibold text-ink">{byline}</span>}
        {byline && affiliation ? ' · ' : ''}
        {affiliation}
        <br />
        {work.venue}
        {extra ? ` · ${extra}` : ''}
      </p>
    </>
  );
}

/* ---------------- per-type detail ---------------- */

function ConferenceDetail({ w }: { w: ConferenceWork }) {
  return (
    <article>
      <Header work={w} byline={w.byline} affiliation={w.affiliation} />
      <StaticMetrics metrics={w.metrics} />
      <Abstract paragraphs={w.abstract} keywords={w.keywords} />
      <Heading>Methodology</Heading>
      <KeyTable rows={w.method} caption="Methodology" />
      <Heading>Results</Heading>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[460px] border-collapse text-left text-[14px]">
          <caption className="sr-only">Descriptive statistics</caption>
          <thead className="bg-canvas/70 font-label text-[11px] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Variable</th>
              <th className="px-4 py-3 text-right font-semibold">M</th>
              <th className="px-4 py-3 text-right font-semibold">SD</th>
              <th className="px-4 py-3 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {w.descriptives.map((d) => (
              <tr key={d.variable} className="border-t border-line">
                <td className="px-4 py-3 font-semibold text-ink">{d.variable}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">{formatStat(d.mean, 2)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted">{formatStat(d.sd, 2)}</td>
                <td className="px-4 py-3 text-muted">{d.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
          <CiAxis {...w.ci} trigger="mount" />
        </div>
        <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
          <BayesScale bf01={w.bayes.bf01} posteriorMean={w.bayes.posteriorMean} trigger="mount" />
          <p className="mt-2 text-[12px] text-muted">
            95% credible interval [{formatStat(w.bayes.credible[0], 3)}, {formatStat(w.bayes.credible[1], 3)}]
          </p>
        </div>
      </div>
      <Heading>Implication</Heading>
      <p className="max-w-[70ch] text-[15.5px] leading-[1.75] text-ink/90">{w.implication}</p>
      <Heading>Conference documentation</Heading>
      <PhotoStrip ids={w.images} />
    </article>
  );
}

function JournalDetail({ w }: { w: JournalWork }) {
  return (
    <article>
      <Header work={w} byline={w.byline} affiliation={w.affiliation} extra={w.citation} />
      {w.link && (
        <a href={w.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-cerulean-700 hover:underline">
          Jurnal Porkes website <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
      <StaticMetrics metrics={w.metrics} />
      <Abstract paragraphs={w.abstract} keywords={w.keywords} />
      <Heading>Methodology</Heading>
      <KeyTable rows={w.method} caption="Methodology" />
      <Heading>Intervention programme (12 sessions)</Heading>
      <ol className="grid gap-3 sm:grid-cols-2">
        {w.program.map((ph) => (
          <li key={ph.sessions} className="rounded-2xl border border-line bg-canvas/70 p-4">
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.12em] text-cerulean-700">Sessions {ph.sessions}</p>
            <p className="mt-1.5 text-[14.5px] font-bold text-ink">{ph.focus}</p>
            <p className="mt-1 text-[13.5px] leading-snug text-muted">{ph.content}</p>
          </li>
        ))}
      </ol>
      <Heading>Results</Heading>
      <div className="grid gap-4 md:grid-cols-2">
        {w.descriptives.map((d) => (
          <div key={d.measure} className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
            <PrePost row={d} trigger="mount" />
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
          <caption className="sr-only">Pretest and posttest descriptive statistics</caption>
          <thead className="bg-canvas/70 font-label text-[11px] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Measure</th>
              <th className="px-4 py-3 text-right font-semibold">Pre M (SD)</th>
              <th className="px-4 py-3 text-right font-semibold">Post M (SD)</th>
              <th className="px-4 py-3 text-right font-semibold">Pre range</th>
              <th className="px-4 py-3 text-right font-semibold">Post range</th>
            </tr>
          </thead>
          <tbody>
            {w.descriptives.map((d) => (
              <tr key={d.measure} className="border-t border-line tabular-nums">
                <td className="px-4 py-3 font-semibold text-ink">{d.measure}</td>
                <td className="px-4 py-3 text-right text-muted">
                  {formatStat(d.pre.mean, 2)} ({formatStat(d.pre.sd, 3)})
                </td>
                <td className="px-4 py-3 text-right text-ink">
                  {formatStat(d.post.mean, 2)} ({formatStat(d.post.sd, 3)})
                </td>
                <td className="px-4 py-3 text-right text-muted">
                  {Math.min(d.pre.min, d.pre.max)}–{Math.max(d.pre.min, d.pre.max)}
                </td>
                <td className="px-4 py-3 text-right text-muted">
                  {Math.min(d.post.min, d.post.max)}–{Math.max(d.post.min, d.post.max)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
          <EffectBars effects={w.effects} trigger="mount" />
        </div>
        <div className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
          <NGainBars effects={w.effects} trigger="mount" />
        </div>
      </div>
      <Heading>Conclusion</Heading>
      <p className="max-w-[70ch] text-[15.5px] leading-[1.75] text-ink/90">{w.conclusion}</p>
      <Heading>Article</Heading>
      <PhotoStrip ids={w.images} />
    </article>
  );
}

function ProjectDetail({ w }: { w: ProjectWork }) {
  return (
    <article>
      <Header work={w} />
      <p className="mt-1 text-[15px] font-medium italic text-muted">{w.subtitleId}</p>
      <p className="mt-5 max-w-[70ch] text-[15.5px] leading-[1.75] text-ink/90">{w.summary}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {w.achievements.map((a) =>
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
      <p className="mt-5 text-[14px] text-muted">
        <span className="font-semibold text-ink">My role · </span>
        {w.role} (PGSD Penjas, FPOK UPI)
      </p>
      <div className="mt-2 grid gap-6 lg:grid-cols-2">
        <div>
          <Heading>Technical specification</Heading>
          <ul className="grid gap-2.5">
            {w.specs.map((s) => (
              <li key={s.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-cerulean-300">
                  <Icon name={s.icon} className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold text-ink">{s.label}</span>
                  <span className="block text-[12px] text-muted">{s.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <Heading>Interdisciplinary team</Heading>
          <ul className="space-y-2">
            {w.team.map((m) => (
              <li key={m.name} className={cn('rounded-xl px-3 py-2', m.self ? 'bg-cerulean-50 ring-1 ring-cerulean-200' : 'bg-canvas/70')}>
                <p className="text-[13.5px] font-semibold text-ink">
                  {m.name}
                  {m.role && <span className="font-medium text-cerulean-700"> · {m.role}</span>}
                </p>
                <p className="text-[12px] text-muted">{m.unit}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Heading>Try the interface</Heading>
          <div className="rounded-[24px] border border-line bg-gradient-to-b from-cerulean-50 to-white p-5">
            <SwipeSimulator />
          </div>
        </div>
      </div>
      <Heading>Prototype visuals</Heading>
      <PhotoStrip ids={w.images} />
    </article>
  );
}

function ServiceDetail({ w, onContact }: { w: ServiceWork; onContact: () => void }) {
  return (
    <article>
      <Header work={w} />
      <p className="mt-5 max-w-[70ch] text-[15.5px] leading-[1.75] text-ink/90">{w.summary}</p>
      <Heading>What the mentoring covers</Heading>
      <ul className="grid gap-3 md:grid-cols-3">
        {w.services.map((s) => (
          <li key={s.title} className="rounded-2xl border border-line bg-canvas/70 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-cerulean-600 ring-1 ring-line">
              <Icon name={s.icon} className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-3 text-[14.5px] font-bold text-ink">{s.title}</p>
            <p className="mt-1 text-[13.5px] leading-snug text-muted">{s.body}</p>
          </li>
        ))}
      </ul>
      <Heading>Tools used in sessions</Heading>
      <LogoDock tools={w.tools as BrandId[]} size="sm" />
      <div className="mt-6 flex flex-wrap gap-2">
        {w.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <Heading>Sessions</Heading>
      <PhotoStrip ids={w.images} />
      <button type="button" onClick={onContact} className="link-cta mt-8">
        Request mentoring <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </article>
  );
}

export function WorkDetail({ work, onContact }: { work: Work; onContact: () => void }) {
  switch (work.type) {
    case 'conference':
      return <ConferenceDetail w={work} />;
    case 'journal':
      return <JournalDetail w={work} />;
    case 'project':
      return <ProjectDetail w={work} />;
    case 'service':
      return <ServiceDetail w={work} onContact={onContact} />;
  }
}
