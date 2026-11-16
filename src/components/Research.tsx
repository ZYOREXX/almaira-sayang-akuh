import { internationalAgenda, researchDomains, researchHighlights } from '../data/research';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

export function Research() {
  return (
    <section id="riset" aria-labelledby="judul-riset" className="bg-paper-200 text-navy-900">
      <div className="shell py-24 lg:py-36">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-7"
            index="07"
            eyebrow="Riset & jejaring"
            id="judul-riset"
            title={
              <>
                Dari lapangan ke jurnal, <em>lalu kembali</em> ke lapangan
              </>
            }
          />
          <Reveal delay={140} className="lg:col-span-5">
            <p className="eyebrow text-mute-600">Ranah kajian</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {researchDomains.map((domain) => (
                <li
                  key={domain}
                  className="rounded-full border border-navy-900/15 px-4 py-2 text-[0.8125rem] text-navy-800 transition-colors duration-300 hover:border-royal-600 hover:text-royal-600"
                >
                  {domain}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Sorotan penelitian dosen */}
        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          {researchHighlights.map((block, i) => (
            <Reveal
              as="article"
              key={block.researcher}
              delay={i * 120}
              className="rounded-2xl bg-paper-50 p-8 ring-1 ring-navy-900/10 sm:p-10 lg:p-12"
            >
              <p className="eyebrow text-gold-700">Sorotan penelitian</p>
              <h3 className="display mt-4 text-[2rem] leading-[1.08]">{block.theme}</h3>
              <p className="mt-3 text-sm text-mute-600">{block.researcher}</p>
              <ol className="mt-8 border-t border-navy-900/12">
                {block.titles.map((title, j) => (
                  <li key={title} className="flex gap-5 border-b border-navy-900/12 py-5 last:border-b-0 last:pb-0">
                    <span className="numeral w-6 shrink-0 text-lg text-royal-600 italic" aria-hidden="true">
                      {j + 1}
                    </span>
                    <p className="text-[0.9375rem] leading-[1.65] text-navy-800">{title}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>

        {/* Agenda internasionalisasi */}
        <div className="mt-20 grid gap-x-16 gap-y-10 lg:mt-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-mute-600">Jejaring internasional</p>
            <h3 className="display mt-4 text-[clamp(2rem,3.2vw,2.75rem)]">Lima agenda untuk daya saing global</h3>
            <p className="mt-5 text-[0.9688rem] leading-[1.75] text-mute-600">
              Visi berdaya saing internasional diterjemahkan ke dalam kegiatan yang mempertemukan mahasiswa dan dosen
              dengan komunitas ilmiah dunia.
            </p>
          </Reveal>

          <ol className="lg:col-span-8">
            {internationalAgenda.map((agenda, i) => (
              <Reveal
                as="li"
                key={agenda.title}
                delay={i * 70}
                className="group grid gap-x-8 gap-y-2 border-t border-navy-900/15 py-7 last:border-b sm:grid-cols-[3rem_1fr_1.2fr] sm:items-baseline"
              >
                <span className="numeral text-lg text-royal-600 italic" aria-hidden="true">
                  0{i + 1}
                </span>
                <h4 className="display text-[1.625rem] leading-[1.15] transition-colors duration-500 group-hover:text-royal-600">
                  {agenda.title}
                  {'abbr' in agenda && agenda.abbr ? (
                    <span className="ml-3 align-middle font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-gold-700">
                      {agenda.abbr}
                    </span>
                  ) : null}
                </h4>
                <p className="text-[0.9375rem] leading-[1.7] text-mute-600">{agenda.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
