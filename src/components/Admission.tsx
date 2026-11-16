import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { admissionSteps, englishScores, faqs, fees, requirements } from '../data/admission';
import { site } from '../data/site';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="border-b border-navy-900/15">
      {faqs.map((item, i) => {
        const open = openIndex === i;
        return (
          <li key={item.q} className="border-t border-navy-900/15">
            <h4>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-${i}`}
                id={`faq-tombol-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="group flex w-full items-start gap-6 py-6 text-left"
              >
                <span className="display flex-1 text-[1.375rem] leading-[1.25] transition-colors duration-300 group-hover:text-royal-600 sm:text-[1.5rem]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ease-out-expo ${
                    open
                      ? 'rotate-45 border-navy-900 bg-navy-900 text-paper-50'
                      : 'border-navy-900/20 text-navy-900 group-hover:border-navy-900'
                  }`}
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </span>
              </button>
            </h4>
            <div
              id={`faq-${i}`}
              role="region"
              aria-labelledby={`faq-tombol-${i}`}
              className="accordion-body"
              data-open={open}
              // Jawaban tetap ada di DOM agar terbaca mesin pencari.
              inert={!open}
            >
              <div>
                <p className="max-w-2xl pr-10 pb-7 text-[0.9688rem] leading-[1.8] text-mute-600">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Admission() {
  return (
    <section id="admisi" aria-labelledby="judul-admisi" className="bg-paper-100 text-navy-900">
      <div className="shell py-24 lg:py-36">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="08"
            eyebrow="Admisi"
            id="judul-admisi"
            title={
              <>
                Lima langkah menuju <em>garis start</em>
              </>
            }
            lead="Penerimaan mahasiswa baru Sekolah Pascasarjana UPI berlangsung daring dalam beberapa gelombang setiap tahun. Jadwal terkini selalu diumumkan pada portal admisi."
          />
          <Reveal delay={120} className="shrink-0">
            <a href={site.links.admisi} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              Buka portal admisi UPI
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">(tab baru)</span>
            </a>
          </Reveal>
        </div>

        {/* Alur pendaftaran */}
        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-navy-900/12 ring-1 ring-navy-900/12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5">
          {admissionSteps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 80}
              className={`group relative bg-paper-100 p-7 transition-colors duration-500 hover:bg-paper-50 lg:p-8 ${
                i === admissionSteps.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <span className="numeral block text-[3.5rem] leading-none text-navy-900/15 transition-colors duration-500 group-hover:text-royal-600">
                {i + 1}
              </span>
              <h3 className="display mt-8 text-[1.5rem] leading-tight">{step.title}</h3>
              <p className="mt-3 text-[0.9063rem] leading-[1.7] text-mute-600">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        {/* Persyaratan */}
        <div id="persyaratan" className="mt-20 grid scroll-mt-28 gap-x-16 gap-y-14 lg:mt-28 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <Reveal>
              <h3 className="display text-[2rem]">Persyaratan akademik</h3>
              <ul className="mt-6 border-t border-navy-900/12">
                {requirements.academic.map((text) => (
                  <li
                    key={text}
                    className="flex gap-4 border-b border-navy-900/12 py-4 text-[0.9375rem] leading-[1.7] text-mute-700"
                  >
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-royal-600" />
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <h3 className="display text-[2rem]">Persyaratan administratif</h3>
              <ul className="mt-6 border-t border-navy-900/12">
                {requirements.administrative.map((text) => (
                  <li
                    key={text}
                    className="flex gap-4 border-b border-navy-900/12 py-4 text-[0.9375rem] leading-[1.7] text-mute-700"
                  >
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-royal-600" />
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <Reveal className="rounded-2xl bg-paper-50 p-8 ring-1 ring-navy-900/10 sm:p-10">
              <h3 className="display text-[1.75rem]">Skor minimal bahasa Inggris</h3>
              <table className="mt-6 w-full border-collapse text-left">
                <caption className="sr-only">Skor minimal bahasa Inggris per jenjang</caption>
                <thead>
                  <tr className="eyebrow text-[0.625rem] text-mute-600">
                    <th scope="col" className="pb-3 font-semibold">
                      Jenjang
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      Tes UPI
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      TOEFL
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      IELTS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {englishScores.map((row) => (
                    <tr key={row.level} className="border-t border-navy-900/12">
                      <th scope="row" className="py-4 text-[0.9375rem] font-medium">
                        {row.level}
                      </th>
                      <td className="numeral py-4 text-right text-2xl">{row.upi}</td>
                      <td className="numeral py-4 text-right text-2xl">{row.toefl}</td>
                      <td className="numeral py-4 text-right text-2xl">{row.ielts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-mute-600">
                Atau ekuivalensinya menurut standar yang digunakan. Syarat ini dapat dipenuhi sambil mengikuti
                perkuliahan.
              </p>
            </Reveal>

            <Reveal
              delay={90}
              className="grain relative overflow-hidden rounded-2xl bg-deep-900 p-8 text-navy-900 sm:p-10"
            >
              <div className="relative">
                <h3 className="display text-[1.75rem]">Biaya pendaftaran dan seleksi</h3>
                <dl className="mt-6 border-t border-sun-300/20">
                  {fees.map((fee) => (
                    <div
                      key={fee.level}
                      className="flex items-baseline justify-between gap-4 border-b border-sun-300/20 py-4"
                    >
                      <dt className="text-[0.9375rem] text-navy-800/85">{fee.level}</dt>
                      <dd className="numeral text-[1.75rem] text-sun-200">{fee.amount}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[0.8125rem] leading-relaxed text-navy-800/65">
                  Merujuk laman PMB SPs UPI ({site.dataAccessed}) dan dapat berubah pada gelombang berikutnya.
                </p>
                <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-sun-300">
                  <a
                    href={site.links.biaya}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 self-start"
                  >
                    <span className="link-draw">Rincian biaya pendidikan</span>
                    <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                  <a
                    href={site.links.pmbInfo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 self-start"
                  >
                    <span className="link-draw">Informasi PMB Sekolah Pascasarjana</span>
                    <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Tanya jawab */}
        <div id="faq" className="mt-20 grid scroll-mt-28 gap-x-16 gap-y-10 lg:mt-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-mute-600">Tanya jawab</p>
            <h3 className="display mt-4 text-[clamp(2rem,3.2vw,2.75rem)]">
              Yang paling sering ditanyakan calon mahasiswa
            </h3>
            <p className="mt-5 text-[0.9688rem] leading-[1.75] text-mute-600">
              Belum menemukan jawabannya? Kirim pertanyaan ke{' '}
              <a href={`mailto:${site.email}`} className="font-semibold text-navy-900">
                <span className="link-draw">{site.email}</span>
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-8">
            <FaqList />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
