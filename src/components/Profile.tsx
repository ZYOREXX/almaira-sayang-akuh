import { ArrowUpRight, Play } from 'lucide-react';
import { useState } from 'react';
import { chair, monogram } from '../data/faculty';
import { levelLabels, pillars, visionMission, type LevelId } from '../data/programs';
import { site } from '../data/site';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { Segmented } from './ui/Segmented';

const levelOptions = (Object.keys(levelLabels) as LevelId[]).map((id) => ({
  value: id,
  label: levelLabels[id].short,
}));

const roman = ['i', 'ii', 'iii', 'iv'];

export function Profile() {
  const [level, setLevel] = useState<LevelId>('s2');
  const current = visionMission[level];

  return (
    <section id="profil" aria-labelledby="judul-profil" className="relative bg-ivory-100 text-ink-900">
      <div className="shell py-24 lg:py-36">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <SectionHeading
            className="lg:col-span-5"
            index="01"
            eyebrow="Profil"
            id="judul-profil"
            title={
              <>
                Hampir tiga dasawarsa menekuni <em>pendidikan olahraga</em>
              </>
            }
          />

          <div className="lg:col-span-7 lg:pt-14">
            <Reveal>
              <p className="display text-[1.625rem] leading-[1.32] tracking-[-0.005em] text-ink-900 text-pretty sm:text-[1.875rem]">
                Program Studi Pendidikan Olahraga bernaung di Sekolah Pascasarjana Universitas Pendidikan Indonesia,
                Bandung. Jenjang Magister berdiri pada 1997, disusul jenjang Doktor pada 2005.
              </p>
            </Reveal>
            <Reveal
              delay={90}
              className="mt-8 grid gap-6 text-[1.0625rem] leading-[1.8] text-taupe-600 sm:grid-cols-2 sm:gap-10"
            >
              <p>
                Kedua jenjang kini menyandang peringkat Unggul dari LAMDIK dan telah menempuh akreditasi internasional
                AQAS, sejalan dengan komitmen Prodi pada peningkatan mutu berkelanjutan.
              </p>
              <p>
                Kajian Prodi mencakup pendidikan jasmani dan olahraga, kepelatihan, ilmu keolahragaan, dan manajemen
                olahraga. Pengalaman di kelas, lapangan, dan gelanggang diuji dengan metodologi yang ketat, lalu
                dikembalikan kepada masyarakat sebagai praktik dan kebijakan.
              </p>
            </Reveal>

            <Reveal
              delay={160}
              className="mt-12 flex flex-col gap-6 border-t border-ink-900/12 pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-5">
                <span
                  aria-hidden="true"
                  className="display grid size-16 shrink-0 place-items-center rounded-full bg-oxblood-800 text-2xl text-champagne-200"
                >
                  {monogram(chair.core)}
                </span>
                <div>
                  <p className="eyebrow text-taupe-600">{chair.role}</p>
                  <p className="display mt-1.5 text-[1.5rem] leading-tight">{chair.name}</p>
                </div>
              </div>
              <a
                href={site.links.videoProfil}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 self-start text-sm font-semibold sm:self-auto"
              >
                <span className="grid size-12 place-items-center rounded-full border border-ink-900/20 transition-colors duration-500 group-hover:border-crimson-600 group-hover:bg-crimson-600 group-hover:text-ivory-50">
                  <Play className="size-4 translate-x-px fill-current" strokeWidth={0} aria-hidden="true" />
                </span>
                <span className="link-draw">Tonton video profil</span>
                <span className="sr-only">(YouTube, membuka tab baru)</span>
              </a>
            </Reveal>
          </div>
        </div>

        {/* Dua kata kunci visi */}
        <div className="mt-24 grid gap-px overflow-hidden rounded-[3px] bg-ink-900/12 ring-1 ring-ink-900/12 sm:grid-cols-2 lg:mt-32">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.term} delay={i * 110} className="bg-ivory-100 p-8 sm:p-10 lg:p-14">
              <p className="eyebrow text-brass-700">Makna kata kunci</p>
              <h3 className="display mt-5 text-[2.75rem] italic text-crimson-600 lg:text-[3.5rem]">{pillar.term}</h3>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.75] text-taupe-600">{pillar.meaning}</p>
            </Reveal>
          ))}
        </div>

        {/* Visi dan misi */}
        <div className="mt-24 lg:mt-32">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-taupe-600">Visi &amp; Misi</p>
              <h3 className="display mt-4 text-[clamp(2rem,3.4vw,2.875rem)]">Arah yang dituju pada 2030</h3>
            </div>
            <Segmented
              label="Pilih jenjang untuk visi dan misi"
              options={levelOptions}
              value={level}
              onChange={setLevel}
              controls="panel-visi"
            />
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <div
              id="panel-visi"
              role="tabpanel"
              aria-label={`Visi dan misi ${levelLabels[level].long}`}
              className="grid gap-px overflow-hidden rounded-[3px] bg-ink-900/12 ring-1 ring-ink-900/12 lg:grid-cols-12"
            >
              <figure className="grain relative bg-oxblood-900 p-8 text-ivory-50 sm:p-12 lg:col-span-7 lg:p-16">
                <div key={level} className="swap-in relative">
                  <span className="display block text-[5rem] leading-[0.6] text-champagne-300/70" aria-hidden="true">
                    “
                  </span>
                  <blockquote className="display mt-4 text-[1.75rem] leading-[1.22] text-pretty sm:text-[2.125rem] lg:text-[2.5rem]">
                    {current.vision}
                  </blockquote>
                  <figcaption className="eyebrow mt-10 flex items-center gap-4 text-champagne-200/80">
                    <span className="h-px w-10 bg-champagne-300/50" aria-hidden="true" />
                    Visi {levelLabels[level].long}
                  </figcaption>
                </div>
              </figure>

              <div className="bg-ivory-50 p-8 sm:p-12 lg:col-span-5 lg:p-14">
                <p className="eyebrow text-brass-700">Misi</p>
                <ol key={level} className="swap-in mt-6 divide-y divide-ink-900/10">
                  {current.missions.map((mission, i) => (
                    <li key={mission} className="flex gap-5 py-5 first:pt-0 last:pb-0">
                      <span className="numeral w-6 shrink-0 pt-0.5 text-lg italic text-crimson-600" aria-hidden="true">
                        {roman[i]}
                      </span>
                      <p className="text-[0.9688rem] leading-[1.75] text-taupe-700">{mission}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-6 text-right text-sm text-taupe-600">
            <a
              href={site.links.official}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <span className="link-draw">Dokumen visi lengkap pada laman SPs UPI</span>
              <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
