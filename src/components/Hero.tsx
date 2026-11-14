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
import { heroStats, hubCards, site } from '../data/site';
import { TrackArt } from './TrackArt';
import { BorderBeam } from './ui/border-beam';
import { DotPattern } from './ui/dot-pattern';
import { Emblem } from './ui/Emblem';
import { NumberTicker } from './ui/number-ticker';
import { Reveal } from './ui/Reveal';
import { SpotlightCard } from './ui/spotlight-card';

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
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

export function Hero() {
  return (
    <>
      <section
        id="beranda"
        aria-labelledby="judul-utama"
        className="relative isolate overflow-hidden bg-paper-100 pt-28 lg:pt-36"
      >
        <DotPattern className="-z-10 text-navy-900/[0.07] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[38rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(74,92,240,0.16),transparent)]"
        />

        <div className="shell">
          {/* Banner utama */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease }}
            className="grain relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1d6fd0] via-royal-600 to-deep-950 text-paper-50 shadow-[0_40px_90px_-40px_rgba(15,33,102,0.75)]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_20%,rgba(245,207,88,0.22),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_0%_100%,rgba(5,10,28,0.55),transparent_70%)]" />
              <div className="absolute top-[4%] -right-[52%] w-[135%] opacity-50 [perspective:1500px] sm:-right-[34%] sm:w-[105%] lg:top-[-6%] lg:-right-[16%] lg:w-[74%] lg:opacity-90">
                <TrackArt className="h-auto w-full [transform:rotateX(58deg)_rotateZ(-27deg)]" />
              </div>
            </div>
            <BorderBeam size={320} duration={14} />

            <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              <motion.div {...rise(0.15)} className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2.5 rounded-full bg-paper-50/12 py-1.5 pr-4 pl-1.5 text-[0.75rem] font-semibold ring-1 ring-paper-50/25 backdrop-blur">
                  <span className="grid size-7 place-items-center rounded-full bg-sun-300 text-deep-950">
                    <Emblem className="size-5" />
                  </span>
                  {site.school} {site.universityShort}
                </span>
                <span className="rounded-full bg-sun-300/15 px-3.5 py-2 text-[0.75rem] font-semibold text-sun-200 ring-1 ring-sun-300/35">
                  Terakreditasi Unggul · LAMDIK
                </span>
              </motion.div>

              <h1 id="judul-utama" className="mt-8 max-w-[44rem]">
                <motion.span {...rise(0.25)} className="eyebrow block text-sun-200">
                  Program Magister (S2) &amp; Doktor (S3)
                </motion.span>
                <motion.span
                  {...rise(0.35)}
                  className="display mt-4 block text-[clamp(2.5rem,6.4vw,4.75rem)] leading-[1.02] tracking-[-0.04em] text-balance"
                >
                  Program Studi{' '}
                  <span className="bg-gradient-to-r from-sun-200 via-sun-300 to-gold-400 bg-clip-text text-transparent">
                    Pendidikan Olahraga
                  </span>
                </motion.span>
              </h1>

              <motion.p
                {...rise(0.5)}
                className="mt-7 max-w-[36rem] text-[1.0625rem] leading-[1.75] text-paper-200/90 text-pretty sm:text-lg"
              >
                Tempat gerak menjadi ilmu. Prodi ini menautkan pedagogi, kepelatihan, sains olahraga, dan kebijakan
                dalam satu tradisi riset di Sekolah Pascasarjana Universitas Pendidikan Indonesia sejak 1997.
              </motion.p>

              <motion.div {...rise(0.62)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#jelajah" className="btn btn-gold" data-arrow="right">
                  Jelajahi Prodi
                  <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
                </a>
                <a href={site.links.admisi} target="_blank" rel="noopener noreferrer" className="btn btn-line-light">
                  Informasi admisi
                  <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">(membuka tab baru)</span>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Angka kunci */}
          <motion.dl
            {...rise(0.8)}
            className="relative z-10 mx-auto -mt-8 grid max-w-[68rem] grid-cols-2 gap-px overflow-hidden rounded-2xl bg-navy-900/10 shadow-[0_24px_60px_-28px_rgba(10,18,48,0.35)] ring-1 ring-navy-900/10 sm:grid-cols-3 lg:grid-cols-6"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1.5 bg-paper-50 px-5 py-6 text-center">
                <dt className="text-[0.75rem] leading-snug text-mute-500">{stat.label}</dt>
                <dd className="numeral text-[1.875rem] leading-none text-navy-900">
                  {'number' in stat ? <NumberTicker value={stat.number} from={stat.from} delay={0.9} /> : stat.text}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Kisi jelajah */}
        <div id="jelajah" className="shell scroll-mt-28 py-20 lg:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-royal-600">Jelajahi</p>
            <h2 className="display mt-4 text-[clamp(1.875rem,3.4vw,2.75rem)] text-balance">
              Semua tentang Prodi Pendidikan Olahraga, dalam satu halaman
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-[1.75] text-mute-600">
              Pilih topik untuk langsung menuju bagian yang Anda perlukan.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {hubCards.map((card, i) => {
              const Icon = hubIcons[card.id];
              return (
                <Reveal as="li" key={card.id} delay={(i % 4) * 70}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="h-full"
                  >
                    <SpotlightCard className="flex h-full flex-col items-center rounded-2xl bg-paper-50 p-7 text-center shadow-[0_10px_30px_-18px_rgba(10,18,48,0.25)] ring-1 ring-navy-900/8 transition-shadow duration-500 hover:shadow-[0_28px_60px_-26px_rgba(42,63,214,0.45)] hover:ring-royal-500/30">
                      <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-royal-500 to-deep-800 text-paper-50 shadow-lg shadow-royal-600/30">
                        <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <h3 className="display relative mt-6 text-[1.1875rem]">{card.title}</h3>
                      <p className="relative mt-2.5 text-[0.875rem] leading-[1.65] text-mute-600">{card.text}</p>
                      <a
                        href={`#${card.id}`}
                        className="relative mt-auto inline-flex items-center gap-2 pt-6 text-[0.8125rem] font-bold text-royal-600 after:absolute after:-inset-x-7 after:-top-[20rem] after:-bottom-7"
                      >
                        <span className="rounded-full bg-royal-600/8 px-4 py-2 transition-colors duration-300 group-hover/spot:bg-royal-600 group-hover/spot:text-paper-50">
                          Selengkapnya
                        </span>
                        <span className="sr-only">tentang {card.title}</span>
                      </a>
                    </SpotlightCard>
                  </motion.div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
