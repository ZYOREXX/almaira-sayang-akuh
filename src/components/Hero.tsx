import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  Landmark,
  Layers,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { hubCards, site } from '../data/site';
import { NumberTicker } from './ui/number-ticker';
import { Reveal } from './ui/Reveal';
import { SpotlightCard } from './ui/spotlight-card';
import { VenueStrip } from './VenueStrip';

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.1, delay, ease },
});

const hubIcons: Record<string, LucideIcon> = {
  profil: Landmark,
  'visi-misi': Compass,
  program: GraduationCap,
  konsentrasi: Target,
  kurikulum: BookOpen,
  dosen: Users,
  riset: FlaskConical,
  admisi: Layers,
};

const telemetry = [
  { label: 'S2', number: 1997, from: 1950 },
  { label: 'S3', number: 2005, from: 1950 },
  { label: 'LAMDIK', text: 'UNGGUL' },
  { label: 'INTL', text: 'AQAS' },
  { label: 'KONSENTRASI', number: 4, from: 0 },
  { label: 'DOSEN', number: 16, from: 0 },
] as const;

/** Lima bab cerita: satu arena untuk tiap ranah kajian Prodi. */
const chapters = [
  {
    label: 'Pembuka',
    venue: 'Lintasan atletik · 400 m',
    title: 'Pendidikan Olahraga,',
    sub: 'tempat gerak menjadi ilmu.',
  },
  {
    label: 'Pedagogi',
    venue: 'Sepak bola · 105 × 68 m',
    title: 'Setiap taktik',
    sub: 'lahir dari pemahaman.',
  },
  {
    label: 'Kepelatihan',
    venue: 'Bola basket · 28 × 15 m',
    title: 'Setiap lompatan',
    sub: 'adalah data.',
  },
  {
    label: 'Ilmu keolahragaan',
    venue: 'Kolam renang · 50 × 25 m',
    title: 'Tubuh yang diukur,',
    sub: 'kesehatan yang dijaga.',
  },
  {
    label: 'Manajemen',
    venue: 'Bola voli · 18 × 9 m',
    title: 'Kebijakan menata',
    sub: 'seluruh arena.',
  },
];

const LAST = chapters.length - 1;

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  // Posisi gulir di dalam bagian cerita, dipetakan ke 0..LAST
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      progress.current = p * LAST;
      setActive(Math.round(p * LAST));
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

  // Adegan 3D dimuat malas; dilewati bila pengguna meminta gerak dikurangi atau WebGL tidak tersedia
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let disposed = false;
    let scene: { setRunning: (v: boolean) => void; dispose: () => void } | undefined;
    let io: IntersectionObserver | undefined;
    import('../lib/storyScene')
      .then(({ createStoryScene }) => {
        if (disposed) return;
        scene = createStoryScene(canvas, () => progress.current);
        setReady(true);
        io = new IntersectionObserver(([entry]) => scene?.setRunning(entry.isIntersecting));
        io.observe(section);
      })
      .catch(() => {
        /* WebGL tidak tersedia: tampilan statis tetap dipakai */
      });
    return () => {
      disposed = true;
      io?.disconnect();
      scene?.dispose();
    };
  }, []);

  const goTo = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (span * index) / LAST, behavior: 'smooth' });
  };

  return (
    <section id="beranda" aria-labelledby="judul-utama" className="relative isolate bg-paper-100 text-navy-900">
      <div ref={sectionRef} className="relative h-[520svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          {/* Latar statis (tanpa WebGL) dan kanvas 3D */}
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-1/2 mx-auto w-[min(92vw,78rem)] -translate-y-1/2">
              <div className="relative mx-auto aspect-[2.1/1] w-full overflow-hidden rounded-[999px] bg-[#0a0a0c] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.4)] sm:aspect-[3.3/1]">
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_118%,rgba(224,169,74,0.55),rgba(160,80,30,0.25)_38%,transparent_66%)]" />
                <div className="absolute inset-0 [perspective:900px]">
                  <div className="absolute inset-x-0 top-[-6%] h-[185%] origin-top [transform:rotateX(52deg)]">
                    <VenueStrip className="venue-pan h-full max-w-none" />
                  </div>
                </div>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 size-full transition-opacity duration-[1800ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent_40%,rgba(6,6,7,0.85)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-paper-100 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-paper-100 via-paper-100/70 to-transparent" />
          </div>

          {/* Teks tiap bab */}
          <div className="shell relative flex-1 pt-28 lg:pt-32">
            {chapters.map((chapter, i) => {
              const shown = active === i;
              const Heading = i === 0 ? 'h1' : 'h2';
              return (
                <div
                  key={chapter.label}
                  aria-hidden={!shown}
                  className={`absolute inset-x-5 top-28 text-center transition-[opacity,transform,filter] duration-[900ms] ease-out-expo sm:inset-x-8 lg:top-32 ${
                    shown ? 'opacity-100 blur-0' : 'pointer-events-none translate-y-4 opacity-0 blur-md'
                  }`}
                >
                  <p className="eyebrow inline-flex items-center gap-3 text-mute-500">
                    <span
                      className="size-1.5 rounded-full bg-royal-600 shadow-[0_0_12px_2px_rgba(224,169,74,0.7)]"
                      aria-hidden="true"
                    />
                    {i === 0 ? 'Magister & Doktor · SPs UPI' : `0${i + 1} · ${chapter.label}`}
                  </p>
                  <Heading
                    id={i === 0 ? 'judul-utama' : undefined}
                    className="display mt-6 text-[clamp(2.5rem,6.2vw,5.25rem)] leading-[1.02] tracking-[-0.045em]"
                  >
                    <span className="block">{chapter.title}</span>
                    <span className="block text-[0.62em] tracking-[-0.035em] text-mute-500">{chapter.sub}</span>
                  </Heading>
                  <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.2em] text-mute-400 uppercase">
                    {chapter.venue}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Garis waktu bab */}
          <nav
            aria-label="Bab cerita"
            className="absolute top-1/2 right-5 hidden -translate-y-1/2 lg:right-10 lg:block"
          >
            <ol className="space-y-4">
              {chapters.map((chapter, i) => (
                <li key={chapter.label}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active === i ? 'step' : undefined}
                    className="group flex w-full items-center justify-end gap-3 font-mono text-[0.625rem] tracking-[0.18em] uppercase"
                  >
                    <span
                      className={`transition-[opacity,color] duration-500 ${
                        active === i ? 'text-navy-900 opacity-100' : 'text-mute-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {chapter.label}
                    </span>
                    <span
                      className={`h-px transition-[width,background-color] duration-500 ease-out-expo ${
                        active === i ? 'w-10 bg-royal-600' : 'w-4 bg-navy-900/30 group-hover:w-6'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* Baris aksi */}
          <motion.div
            {...rise(0.6)}
            className="shell relative mt-auto grid items-end gap-6 pb-6 lg:grid-cols-[1fr_auto_1fr]"
          >
            <p className="hidden max-w-[22rem] text-[0.8125rem] leading-[1.7] text-mute-500 lg:block">
              <strong className="block font-medium text-navy-900">Dari lapangan ke jurnal.</strong>
              Pedagogi, kepelatihan, sains olahraga, dan kebijakan dalam satu tradisi riset sejak 1997.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <a href="#jelajah" className="btn btn-ink min-h-12" data-arrow="right">
                Jelajahi Prodi
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                href={site.links.admisi}
                target="_blank"
                rel="noopener noreferrer"
                className="btn min-h-12 text-mute-600 hover:text-navy-900"
              >
                Informasi admisi
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">(membuka tab baru)</span>
              </a>
            </div>
            <p className="hidden text-[0.8125rem] leading-[1.7] text-mute-500 lg:block lg:text-right">
              <strong className="block font-medium text-navy-900">
                {active < LAST ? 'Gulir untuk menjelajah' : 'Lanjut ke profil Prodi'}
              </strong>
              <span className="font-mono text-[0.6875rem] tracking-[0.18em]">
                BAB 0{active + 1} / 0{chapters.length}
              </span>
            </p>
          </motion.div>

          {/* Telemetri */}
          <motion.dl
            {...rise(0.75)}
            className="shell relative flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-navy-900/10 py-4 font-mono text-[0.6875rem] tracking-[0.14em] lg:justify-between"
          >
            {telemetry.map((item) => (
              <div key={item.label} className="flex items-baseline gap-2">
                <dt className="text-mute-400">{item.label}</dt>
                <dd className="text-navy-800">
                  {'number' in item ? <NumberTicker value={item.number} from={item.from} delay={1} /> : item.text}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* Kisi jelajah */}
      <div id="jelajah" className="shell scroll-mt-28 py-24 lg:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-mute-500">Jelajahi</p>
          <h2 className="display mt-5 text-[clamp(1.875rem,3.4vw,2.875rem)] text-balance">
            Satu disiplin, <span className="text-mute-500">banyak arena.</span>
          </h2>
          <p className="mt-5 text-[1rem] leading-[1.75] text-mute-600">
            Pilih topik untuk langsung menuju bagian yang Anda perlukan.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-navy-900/10 ring-1 ring-navy-900/10 sm:grid-cols-2 lg:grid-cols-4">
          {hubCards.map((card, i) => {
            const Icon = hubIcons[card.id];
            return (
              <Reveal as="li" key={card.id} delay={(i % 4) * 70} className="bg-paper-100">
                <SpotlightCard
                  color="rgba(224, 169, 74, 0.10)"
                  className="flex h-full flex-col p-7 transition-colors duration-500 hover:bg-paper-50 lg:p-8"
                >
                  <div className="relative flex items-center justify-between">
                    <Icon className="size-6 text-royal-600" strokeWidth={1.25} aria-hidden="true" />
                    <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-400">0{i + 1}</span>
                  </div>
                  <h3 className="display relative mt-10 text-[1.375rem]">{card.title}</h3>
                  <p className="relative mt-2.5 text-[0.875rem] leading-[1.65] text-mute-600">{card.text}</p>
                  <a
                    href={`#${card.id}`}
                    className="relative mt-auto inline-flex items-center gap-2 pt-8 text-[0.8125rem] font-medium text-navy-900 after:absolute after:-inset-x-8 after:-top-[20rem] after:-bottom-8"
                  >
                    Selengkapnya
                    <ArrowRight
                      className="size-3.5 transition-transform duration-500 ease-out-expo group-hover/spot:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="sr-only">tentang {card.title}</span>
                  </a>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
