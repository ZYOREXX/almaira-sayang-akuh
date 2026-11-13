import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { heroStats, site } from '../data/site';
import { TrackArt } from './TrackArt';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="beranda"
      aria-labelledby="judul-utama"
      className="grain relative isolate overflow-hidden bg-ink-900 text-ivory-50"
    >
      {/* Cahaya latar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_78%_38%,rgba(154,27,47,0.42),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_12%_100%,rgba(184,147,90,0.14),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/80 to-transparent" />
      </div>

      {/* Lintasan atletik dalam perspektif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 [perspective:1500px] top-[9%] -right-[58%] w-[150%] opacity-55 sm:top-[6%] sm:-right-[38%] sm:w-[115%] lg:top-[3%] lg:-right-[22%] lg:w-[76%] lg:opacity-100"
      >
        <TrackArt className="h-auto w-full [transform:rotateX(58deg)_rotateZ(-27deg)]" />
      </div>

      <div className="shell relative flex min-h-[100svh] flex-col pt-32 pb-10 sm:pt-36 lg:pt-40">
        <div className="max-w-[46rem] pb-14 lg:pb-16">
          <p
            className="eyebrow fade-up flex flex-wrap items-center gap-x-4 gap-y-2 text-champagne-200/85"
            style={delay(100)}
          >
            <span className="h-px w-10 bg-champagne-300/60" aria-hidden="true" />
            Magister (S2) &amp; Doktor (S3)
          </p>

          <h1 id="judul-utama" className="mt-7">
            <span
              className="fade-up block text-[0.9375rem] font-medium tracking-[0.01em] text-ivory-200/80 sm:text-lg"
              style={delay(180)}
            >
              Pascasarjana Pendidikan Olahraga UPI
            </span>
            <span className="display mt-4 block text-[clamp(3.5rem,min(9.4vw,15svh),8rem)] leading-[0.92] tracking-[-0.03em]">
              <span className="line-mask">
                <span style={delay(260)}>Tempat gerak</span>
              </span>
              <span className="line-mask">
                <span style={delay(360)}>
                  menjadi <em className="text-champagne-300">ilmu.</em>
                </span>
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-8 max-w-[31rem] text-[1.0625rem] leading-[1.75] text-ivory-200/80 text-pretty sm:text-lg"
            style={delay(620)}
          >
            Program Studi Pendidikan Olahraga di Sekolah Pascasarjana Universitas Pendidikan Indonesia menautkan
            pedagogi, kepelatihan, sains olahraga, dan kebijakan dalam satu tradisi riset yang berdiri sejak 1997.
          </p>

          <div className="fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={delay(760)}>
            <a href="#program" className="btn btn-gold" data-arrow="down">
              Jelajahi program
              <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a href={site.links.admisi} target="_blank" rel="noopener noreferrer" className="btn btn-line-light">
              Informasi admisi
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">(membuka tab baru)</span>
            </a>
          </div>
        </div>

        {/* Fakta kunci */}
        <dl
          className="fade-up mt-auto grid grid-cols-2 border-t border-ivory-50/15 pt-2 sm:grid-cols-3 lg:grid-cols-5"
          style={delay(980)}
        >
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col-reverse gap-2 py-6 pr-4 lg:py-8 ${i > 0 ? 'lg:border-l lg:border-ivory-50/10 lg:pl-8' : ''} ${
                i === heroStats.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <dt className="text-[0.8125rem] leading-snug text-ivory-200/65">{stat.label}</dt>
              <dd className="numeral text-[2.5rem] leading-none text-ivory-50 lg:text-[3rem]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
