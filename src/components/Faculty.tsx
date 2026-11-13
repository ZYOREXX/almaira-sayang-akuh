import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { faculty, monogram, scholarUrl } from '../data/faculty';
import { site } from '../data/site';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { Segmented } from './ui/Segmented';

type Filter = 'semua' | 'profesor' | 'doktor';

const count = (rank: Filter) => (rank === 'semua' ? faculty.length : faculty.filter((f) => f.rank === rank).length);

const rankLabel = (rank: 'profesor' | 'doktor') => (rank === 'profesor' ? 'Guru Besar' : 'Doktor');

const filters: { value: Filter; label: string }[] = [
  { value: 'semua', label: `Semua (${count('semua')})` },
  { value: 'profesor', label: `Guru Besar (${count('profesor')})` },
  { value: 'doktor', label: `Doktor (${count('doktor')})` },
];

export function Faculty() {
  const [filter, setFilter] = useState<Filter>('semua');
  const list = filter === 'semua' ? faculty : faculty.filter((f) => f.rank === filter);

  return (
    <section id="dosen" aria-labelledby="judul-dosen" className="bg-ivory-100 text-ink-900">
      <div className="shell py-24 lg:py-36">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="06"
            eyebrow="Staf pengajar"
            id="judul-dosen"
            title={
              <>
                Dibimbing <em>sebelas guru besar</em> dan lima doktor
              </>
            }
            lead="Perkuliahan dan pembimbingan diampu enam belas akademisi yang menekuni pedagogi, kepelatihan, psikologi, fisiologi, hingga kebijakan olahraga."
          />
          <Reveal delay={120} className="-mx-5 shrink-0 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <Segmented
              label="Saring staf pengajar"
              options={filters}
              value={filter}
              onChange={setFilter}
              controls="daftar-dosen"
            />
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-14 lg:mt-16">
          <div id="daftar-dosen" role="tabpanel" aria-label="Daftar staf pengajar">
            <ul
              key={filter}
              className="swap-in grid gap-px overflow-hidden rounded-[3px] bg-ink-900/10 ring-1 ring-ink-900/10 sm:grid-cols-2 lg:grid-cols-4"
            >
              {list.map((person) => (
                <li
                  key={person.name}
                  className="group relative flex items-center gap-4 bg-ivory-100 p-5 transition-colors duration-500 hover:bg-ivory-50 sm:flex-col sm:items-start sm:gap-0 sm:p-7 lg:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="display grid size-12 shrink-0 place-items-center rounded-full border border-ink-900/15 text-lg text-ink-900 transition-colors duration-500 group-hover:border-oxblood-800 group-hover:bg-oxblood-800 group-hover:text-champagne-200 sm:size-14 sm:text-xl"
                  >
                    {monogram(person.core)}
                  </span>
                  <span className="eyebrow absolute top-8 right-7 hidden text-[0.5938rem] text-brass-700 sm:block lg:right-8 lg:top-9">
                    {rankLabel(person.rank)}
                  </span>
                  <div className="min-w-0 flex-1 sm:mt-8 sm:flex-none">
                    <h3 className="display text-[1.3125rem] leading-[1.15] text-balance sm:text-[1.5rem]">
                      {person.name}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] text-taupe-600 sm:mt-2 sm:text-[0.8438rem]">
                      {person.role}
                      <span className="sm:hidden"> · {rankLabel(person.rank)}</span>
                    </p>
                  </div>
                  <a
                    href={scholarUrl(person.core)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-900 after:absolute after:inset-0 sm:mt-auto sm:pt-8"
                  >
                    <span className="link-draw sr-only sm:not-sr-only">Telusuri publikasi</span>
                    <ArrowUpRight
                      className="size-4 text-taupe-600 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-3.5 sm:text-ink-900"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{person.name} di Google Scholar (tab baru)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <p className="text-[0.8125rem] leading-relaxed text-taupe-600">
            Nama dan gelar mengikuti{' '}
            <a
              href={site.links.official}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink-900"
            >
              <span className="link-draw">laman resmi Prodi</span>
            </a>
            . Tautan publikasi membuka hasil penelusuran Google Scholar atas nama dosen terkait.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
