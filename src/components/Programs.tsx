import { ArrowUpRight, Check } from 'lucide-react';
import { pathways, programs } from '../data/programs';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

export function Programs() {
  return (
    <section id="program" aria-labelledby="judul-program" className="grain relative isolate bg-ink-900 text-ivory-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_0%_0%,rgba(110,21,38,0.5),transparent_70%)]"
      />
      <div className="shell relative py-24 lg:py-36">
        <SectionHeading
          index="02"
          eyebrow="Program"
          id="judul-program"
          tone="dark"
          title={
            <>
              Dua jenjang, <em>dua jalur</em> studi
            </>
          }
          lead="Magister menajamkan keahlian profesional dan dasar meneliti. Doktor menuntut sumbangan baru bagi ilmu. Keduanya dapat ditempuh lewat jalur perkuliahan maupun jalur penelitian."
        />

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
          {programs.map((program, i) => (
            <Reveal
              key={program.id}
              as="article"
              delay={i * 120}
              className="group relative flex flex-col overflow-hidden rounded-[3px] lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:gap-y-0 border border-champagne-300/18 bg-ivory-50/[0.025] transition-colors duration-700 hover:border-champagne-300/45"
            >
              <span
                aria-hidden="true"
                className="display pointer-events-none absolute -top-8 right-4 text-[11rem] leading-none text-champagne-300/[0.07] transition-colors duration-700 select-none group-hover:text-champagne-300/[0.13] sm:text-[14rem]"
              >
                {program.degree}
              </span>

              <div className="relative p-8 sm:p-10">
                <p className="eyebrow text-champagne-300">Jenjang {program.degree}</p>
                <h3 className="display mt-5 text-[2.25rem] leading-[1.05] sm:text-[2.75rem]">
                  <span className="block">{program.title.split(' ')[0]}</span>
                  {program.title.split(' ').slice(1).join(' ')}
                </h3>
                <p className="mt-5 max-w-md text-[1.0313rem] leading-[1.75] text-ivory-200/75">{program.summary}</p>
              </div>

              <dl className="relative grid grid-cols-2 border-t border-champagne-300/15 sm:grid-cols-3">
                {program.facts.map((fact, j) => (
                  <div
                    key={fact.label}
                    className={`border-b border-champagne-300/15 px-8 py-6 sm:px-10 ${
                      j % 2 === 0 ? 'border-r' : ''
                    } ${j % 3 === 2 ? 'sm:border-r-0' : 'sm:border-r'}`}
                  >
                    <dt className="eyebrow text-[0.625rem] text-ivory-200/55">{fact.label}</dt>
                    <dd className="mt-3">
                      <span className="numeral block text-[1.75rem] leading-none text-ivory-50">{fact.value}</span>
                      {fact.note ? (
                        <span className="mt-2 block text-[0.75rem] leading-snug text-ivory-200/60">{fact.note}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="relative flex flex-col gap-6 p-8 sm:p-10">
                <div>
                  <p className="eyebrow text-[0.625rem] text-ivory-200/55">Profil lulusan</p>
                  <p className="mt-3 text-[0.9688rem] leading-[1.75] text-ivory-200/80">{program.graduates}</p>
                </div>
                <a
                  href={program.curriculumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 self-start text-sm font-semibold text-champagne-300"
                >
                  <span className="link-draw">Portal Kurikulum UPI</span>
                  <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  <span className="sr-only">untuk {program.title} (tab baru)</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Jalur studi */}
        <div className="mt-20 grid gap-x-16 gap-y-10 lg:mt-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-champagne-300">Jalur studi</p>
            <h3 className="display mt-4 text-[clamp(2rem,3.2vw,2.75rem)]">Kuliah terstruktur atau riset sejak awal</h3>
            <p className="mt-5 text-[0.9688rem] leading-[1.75] text-ivory-200/70">
              Mahasiswa dengan latar belakang tidak linear menempuh mata kuliah penyetaraan yang ditetapkan Ketua
              Program Studi.
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-[3px] bg-champagne-300/15 ring-1 ring-champagne-300/15 sm:grid-cols-2 lg:col-span-8">
            {pathways.map((path, i) => (
              <Reveal key={path.id} delay={i * 110} className="bg-ink-900 p-8 sm:p-10">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="display text-[2rem]">{path.name}</h4>
                  <span className="eyebrow text-[0.625rem] text-ivory-200/55">{path.alias}</span>
                </div>
                <p className="mt-4 text-[0.9688rem] leading-[1.75] text-ivory-200/75">{path.description}</p>
                <ul className="mt-6 space-y-3 border-t border-champagne-300/15 pt-6">
                  {path.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-ivory-200/85">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-champagne-300"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
