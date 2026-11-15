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

export function Hero() {
  return (
    <section
      id="beranda"
      aria-labelledby="judul-utama"
      className="relative isolate overflow-hidden bg-paper-100 text-navy-900"
    >
      <div className="flex min-h-[100svh] flex-col pt-28 lg:pt-32">
        {/* Judul */}
        <div className="shell text-center">
          <motion.p {...rise(0.1)} className="eyebrow inline-flex items-center gap-3 text-mute-500">
            <span
              className="size-1.5 rounded-full bg-royal-600 shadow-[0_0_12px_2px_rgba(224,169,74,0.7)]"
              aria-hidden="true"
            />
            Magister &amp; Doktor · Sekolah Pascasarjana UPI
          </motion.p>
          <h1
            id="judul-utama"
            className="display mt-6 text-[clamp(2.5rem,6.2vw,5.25rem)] leading-[1.02] tracking-[-0.045em]"
          >
            <motion.span {...rise(0.2)} className="block">
              Pendidikan Olahraga,
            </motion.span>
            <motion.span {...rise(0.32)} className="block text-[0.62em] tracking-[-0.035em] text-mute-500">
              tempat gerak menjadi ilmu.
            </motion.span>
          </h1>
        </div>

        {/* Jendela panorama */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.45, ease }}
          aria-hidden="true"
          className="relative mx-auto mt-10 w-[min(92vw,78rem)] flex-1 lg:mt-12"
        >
          <div className="relative mx-auto aspect-[2.1/1] max-h-[40svh] w-full sm:aspect-[3.3/1]">
            {/* bingkai */}
            <div className="absolute inset-0 overflow-hidden rounded-[999px] bg-[#0a0a0c] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.55),inset_0_0_18px_1px_rgba(255,255,255,0.18),inset_0_0_60px_10px_rgba(0,0,0,0.9),0_0_0_10px_#0b0b0d,0_0_0_11px_rgba(255,255,255,0.07),0_40px_120px_-20px_rgba(224,169,74,0.18)]">
              {/* cakrawala cahaya */}
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_118%,rgba(224,169,74,0.55),rgba(160,80,30,0.25)_38%,transparent_66%)]" />
              <div className="absolute inset-0 [perspective:900px]">
                <div className="absolute inset-x-0 top-[-6%] h-[185%] origin-top [transform:rotateX(52deg)]">
                  <VenueStrip className="venue-pan h-full max-w-none" />
                </div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0c_0%,transparent_18%,transparent_82%,#0a0a0c_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0a0a0c_0%,transparent_45%)]" />
            </div>
          </div>
          {/* pantulan lantai */}
          <div className="mx-auto mt-3 h-16 w-[70%] rounded-[100%] bg-[radial-gradient(closest-side,rgba(224,169,74,0.16),transparent)] blur-xl" />
        </motion.div>

        {/* Baris aksi */}
        <motion.div {...rise(0.9)} className="shell mt-auto grid items-end gap-8 pb-6 lg:grid-cols-[1fr_auto_1fr]">
          <p className="max-w-[22rem] text-[0.8125rem] leading-[1.7] text-mute-500">
            <strong className="block font-medium text-navy-900">Dari lapangan ke jurnal.</strong>
            Pedagogi, kepelatihan, sains olahraga, dan kebijakan dalam satu tradisi riset sejak 1997.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          <p className="text-[0.8125rem] leading-[1.7] text-mute-500 lg:text-right">
            <strong className="block font-medium text-navy-900">Program Studi Pendidikan Olahraga</strong>
            <a href={`mailto:${site.email}`} className="hover:text-navy-900">
              {site.email}
            </a>
          </p>
        </motion.div>

        {/* Telemetri */}
        <motion.dl
          {...rise(1.05)}
          className="shell flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-navy-900/10 py-4 font-mono text-[0.6875rem] tracking-[0.14em] lg:justify-between"
        >
          {telemetry.map((item) => (
            <div key={item.label} className="flex items-baseline gap-2">
              <dt className="text-mute-400">{item.label}</dt>
              <dd className="text-navy-800">
                {'number' in item ? <NumberTicker value={item.number} from={item.from} delay={1.2} /> : item.text}
              </dd>
            </div>
          ))}
        </motion.dl>
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
