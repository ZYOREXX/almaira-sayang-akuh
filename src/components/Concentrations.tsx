import { Activity, ChevronDown, GraduationCap, Landmark, Timer, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { concentrations, type Concentration } from '../data/programs';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

const icons: Record<string, LucideIcon> = {
  pjor: GraduationCap,
  pko: Timer,
  ikor: Activity,
  mor: Landmark,
};

function Detail({ item }: { item: Concentration }) {
  return (
    <>
      <p className="text-[1.0313rem] leading-[1.8] text-mute-600">{item.description}</p>
      <p className="eyebrow mt-8 text-gold-700">Mata kuliah pilihan</p>
      <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {item.courses.map((course) => (
          <li
            key={course}
            className="flex gap-3 border-t border-navy-900/10 py-3 text-[0.9063rem] leading-snug text-navy-800"
          >
            <span aria-hidden="true" className="mt-[0.55em] size-1 shrink-0 rounded-full bg-royal-600" />
            {course}
          </li>
        ))}
      </ul>
      {item.note ? (
        <p className="mt-6 border-l-2 border-gold-500 pl-4 text-[0.8438rem] leading-relaxed text-mute-600">
          <strong className="font-semibold text-navy-800">Catatan.</strong> {item.note}
        </p>
      ) : null}
    </>
  );
}

export function Concentrations() {
  const [activeId, setActiveId] = useState(concentrations[0].id);
  // Pada layar kecil, butir yang aktif dapat ditutup kembali.
  const [mobileOpen, setMobileOpen] = useState<string | null>(concentrations[0].id);
  const active = concentrations.find((c) => c.id === activeId) ?? concentrations[0];
  const ActiveIcon = icons[active.id];

  return (
    <section id="konsentrasi" aria-labelledby="judul-konsentrasi" className="bg-paper-100 text-navy-900">
      <div className="shell py-24 lg:py-36">
        <SectionHeading
          index="03"
          eyebrow="Konsentrasi keahlian"
          id="judul-konsentrasi"
          title={
            <>
              Empat lintasan, <em>satu disiplin</em>
            </>
          }
          lead="Setiap mahasiswa memilih satu konsentrasi dan menajamkannya lewat mata kuliah pilihan serta topik tugas akhir. Keempatnya berbagi inti keilmuan yang sama."
        />

        <div className="mt-16 grid gap-x-16 lg:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <ul className="border-b border-navy-900/15">
              {concentrations.map((item, i) => {
                const isActive = item.id === activeId;
                const isOpen = mobileOpen === item.id;
                return (
                  <li key={item.id} className="border-t border-navy-900/15">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`konsentrasi-${item.id}`}
                      onClick={() => {
                        setActiveId(item.id);
                        setMobileOpen((cur) => (cur === item.id ? null : item.id));
                      }}
                      onMouseEnter={() => setActiveId(item.id)}
                      onFocus={() => setActiveId(item.id)}
                      className="group flex w-full items-center gap-5 py-6 text-left lg:py-7"
                    >
                      <span
                        aria-hidden="true"
                        className={`numeral w-8 text-lg italic transition-colors duration-500 ${
                          isActive ? 'text-royal-600' : 'text-mute-400'
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`display block text-[1.625rem] leading-[1.1] transition-colors duration-500 sm:text-[2rem] ${
                            isActive ? 'text-navy-900' : 'text-navy-900 lg:text-mute-500'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="mt-2 block text-[0.8438rem] text-mute-600">{item.focus}</span>
                      </span>
                      <span
                        className={`eyebrow hidden rounded-full border px-3 py-1.5 text-[0.625rem] transition-colors duration-500 sm:block ${
                          isActive ? 'border-royal-600 text-royal-600' : 'border-navy-900/15 text-mute-600'
                        }`}
                      >
                        {item.abbr}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className={`size-5 shrink-0 text-mute-600 transition-transform duration-500 ease-out-expo lg:hidden ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Rincian untuk layar kecil */}
                    <div
                      id={`konsentrasi-${item.id}`}
                      className="accordion-body lg:hidden"
                      data-open={isOpen}
                      aria-hidden={!isOpen}
                    >
                      <div>
                        <div className="pb-8 pl-[3.25rem]">
                          <Detail item={item} />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Rincian untuk layar lebar */}
          <Reveal delay={120} className="hidden lg:col-span-7 lg:block">
            <div
              className="sticky top-28 rounded-2xl bg-paper-50 p-12 ring-1 ring-navy-900/10 xl:p-14"
              aria-live="polite"
            >
              <div key={active.id} className="swap-in">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="eyebrow text-gold-700">{active.abbr}</p>
                    <h3 className="display mt-3 text-[2.5rem] leading-[1.05]">{active.name}</h3>
                  </div>
                  <span className="grid size-16 shrink-0 place-items-center rounded-full border border-navy-900/15 text-royal-600">
                    <ActiveIcon className="size-7" strokeWidth={1.1} aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-7">
                  <Detail item={active} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
