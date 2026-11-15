import { theories } from '../data/theories';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

export function Foundations() {
  return (
    <section
      id="landasan"
      aria-labelledby="judul-landasan"
      className="grain relative isolate bg-deep-950 text-navy-900"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 " />
      <div className="shell relative py-24 lg:py-36">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-7"
            index="05"
            eyebrow="Landasan keilmuan"
            id="judul-landasan"
            title={
              <>
                Enam kajian inti, <em>enam tradisi</em> teori
              </>
            }
          />
          <Reveal delay={140} className="lg:col-span-5">
            <p className="text-[1.0313rem] leading-[1.8] text-navy-800/75">
              Setiap mata kuliah inti berdiri di atas teori yang telah teruji puluhan tahun. Pemetaan berikut
              memperlihatkan dari mana percakapan ilmiah di ruang kuliah berangkat, lengkap dengan rujukan primernya.
            </p>
          </Reveal>
        </div>

        <ol className="mt-16 grid border-t border-sun-300/20 md:grid-cols-2 lg:mt-20">
          {theories.map((item, i) => (
            <Reveal
              as="li"
              key={item.code}
              delay={(i % 2) * 110}
              className={`group border-b border-sun-300/20 py-10 md:py-12 ${
                i % 2 === 0 ? 'md:border-r md:pr-10 lg:pr-14' : 'md:pl-10 lg:pl-14'
              }`}
            >
              <article>
                <div className="flex items-center gap-4">
                  <span className="rounded-full border border-sun-300/35 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-sun-300 tabular-nums">
                    {item.code}
                  </span>
                  <span className="text-[0.8125rem] leading-snug text-navy-800/60">{item.course}</span>
                </div>
                <h3 className="display mt-6 text-[1.875rem] leading-[1.1] text-balance transition-colors duration-500 group-hover:text-sun-200 sm:text-[2.25rem]">
                  {item.theory}
                </h3>
                <p className="mt-5 text-[0.9688rem] leading-[1.8] text-navy-800/78">{item.summary}</p>
                <div className="mt-7 border-l border-sun-300/30 pl-5">
                  <p className="eyebrow text-[0.625rem] text-sun-300/80">Rujukan</p>
                  <ul className="mt-3 space-y-2.5">
                    {item.references.map((reference) => (
                      <li key={reference} lang="en" className="text-[0.8125rem] leading-[1.65] text-navy-800/60">
                        {reference}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <p className="max-w-3xl text-[0.8125rem] leading-relaxed text-navy-800/55">
            Pemetaan ini bersifat orientasi akademik: teori dan rujukan yang lazim dipakai pada tiap bidang kajian.
            Bahan ajar yang mengikat tetap tercantum pada Rencana Pembelajaran Semester (RPS) masing-masing mata kuliah.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
