import { ArrowUpRight, Search, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { curriculum, type Course, type CourseGroup } from '../data/curriculum';
import { outcomes, type OutcomeCategory } from '../data/outcomes';
import { levelLabels, type LevelId } from '../data/programs';
import { site } from '../data/site';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { Segmented } from './ui/Segmented';

const levelOptions = (Object.keys(levelLabels) as LevelId[]).map((id) => ({
  value: id,
  label: levelLabels[id].short,
}));

const sksText = (value: number | null) => (value === null ? '–' : String(value));

function CourseRow({ course, groupLabel }: { course: Course; groupLabel?: string }) {
  return (
    <tr className="group border-t border-navy-900/10 align-top transition-colors duration-300 hover:bg-sun-100/50">
      <td className="hidden py-4 pr-4 pl-6 text-[0.75rem] font-semibold tracking-[0.08em] whitespace-nowrap text-gold-700 tabular-nums sm:table-cell lg:pl-8">
        {course.code}
      </td>
      <th scope="row" className="py-4 pr-4 pl-5 text-left font-normal sm:pl-0">
        <span className="block text-[0.9375rem] leading-snug font-medium text-navy-900">
          {course.name}
          {course.mark ? (
            <sup
              className="ml-0.5 font-semibold text-royal-600"
              aria-label={course.mark === '*' ? 'kelompok satu bintang' : 'kelompok dua bintang'}
            >
              {course.mark}
            </sup>
          ) : null}
        </span>
        {course.en ? (
          <span lang="en" className="mt-1 block text-[0.8125rem] leading-snug text-mute-500 italic">
            {course.en}
          </span>
        ) : null}
        <span className="mt-1.5 block text-[0.6875rem] font-semibold tracking-[0.08em] text-gold-700 sm:hidden">
          {course.code}
          {groupLabel ? ` · ${groupLabel}` : ''}
        </span>
        {groupLabel ? <span className="mt-1.5 hidden text-[0.75rem] text-mute-500 sm:block">{groupLabel}</span> : null}
      </th>
      <td className="numeral px-1 py-4 text-center text-xl text-navy-900 sm:px-3">{sksText(course.sks)}</td>
      <td className="numeral px-1 py-4 text-center text-xl text-navy-900 sm:px-3">{sksText(course.research)}</td>
      <td className="numeral py-4 pr-4 pl-1 text-center text-xl text-mute-600 sm:pr-5 sm:pl-3 lg:pr-8">
        {course.semester ?? '–'}
      </td>
    </tr>
  );
}

function CourseTable({ caption, rows }: { caption: string; rows: { course: Course; groupLabel?: string }[] }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="eyebrow text-[0.625rem] text-mute-600">
          <th scope="col" className="hidden w-24 py-3 pr-4 pl-6 font-semibold sm:table-cell lg:w-28 lg:pl-8">
            Kode
          </th>
          <th scope="col" className="py-3 pr-4 pl-5 font-semibold sm:pl-0">
            Mata kuliah
          </th>
          <th scope="col" className="w-11 px-1 py-3 text-center font-semibold sm:w-20 sm:px-3">
            <abbr title="sks jalur Reguler (by course)" className="no-underline">
              Reg.
            </abbr>
          </th>
          <th scope="col" className="w-11 px-1 py-3 text-center font-semibold sm:w-20 sm:px-3">
            <abbr title="sks jalur by research" className="no-underline">
              Riset
            </abbr>
          </th>
          <th scope="col" className="w-12 py-3 pr-4 pl-1 text-center font-semibold sm:w-16 sm:pr-5 sm:pl-3 lg:pr-8">
            <abbr title="Semester" className="no-underline">
              Smt
            </abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ course, groupLabel }, i) => (
          <CourseRow key={`${course.code}-${course.name}-${i}`} course={course} groupLabel={groupLabel} />
        ))}
      </tbody>
    </table>
  );
}

function Outcomes({ level }: { level: LevelId }) {
  const categories = outcomes[level];
  const [categoryId, setCategoryId] = useState<OutcomeCategory['id']>('khusus');
  const category = categories.find((c) => c.id === categoryId) ?? categories[0];

  return (
    <div id="cpl" className="mt-20 scroll-mt-28 lg:mt-28">
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-mute-600">Capaian Pembelajaran Lulusan</p>
          <h3 className="display mt-4 text-[clamp(2rem,3.4vw,2.875rem)]">
            Apa yang dikuasai lulusan {levelLabels[level].long.toLowerCase()}
          </h3>
        </div>
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <Segmented
            label="Kategori capaian pembelajaran"
            options={categories.map((c) => ({ value: c.id, label: c.label }))}
            value={category.id}
            onChange={setCategoryId}
            controls="panel-cpl"
          />
        </div>
      </Reveal>

      <Reveal delay={100} className="mt-10">
        <div id="panel-cpl" role="tabpanel" aria-label={`${category.label}, ${levelLabels[level].long}`}>
          <ol
            key={`${level}-${category.id}`}
            className="swap-in grid gap-px overflow-hidden rounded-2xl bg-navy-900/10 ring-1 ring-navy-900/10 md:grid-cols-2"
          >
            {category.items.map((item) => (
              <li key={item.code} className="flex gap-5 bg-paper-50 p-6 sm:p-8">
                <span className="numeral w-10 shrink-0 text-xl leading-tight text-royal-600">{item.code}</span>
                <p className="text-[0.9375rem] leading-[1.75] text-mute-700">{item.text}</p>
              </li>
            ))}
            {category.items.length % 2 === 1 ? <li aria-hidden="true" className="hidden bg-paper-50 md:block" /> : null}
          </ol>
        </div>
      </Reveal>
    </div>
  );
}

export function Curriculum() {
  const [level, setLevel] = useState<LevelId>('s2');
  const [groupId, setGroupId] = useState<string>(curriculum.s2.groups[0].id);
  const [query, setQuery] = useState('');
  const searchId = useId();

  const data = curriculum[level];
  const group: CourseGroup = data.groups.find((g) => g.id === groupId) ?? data.groups[0];

  const changeLevel = (next: LevelId) => {
    setLevel(next);
    setGroupId(curriculum[next].groups[0].id);
  };

  const term = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return [];
    return data.groups.flatMap((g) =>
      g.courses
        .filter((c) => `${c.code} ${c.name} ${c.en ?? ''}`.toLowerCase().includes(term))
        .map((course) => ({ course, groupLabel: g.label })),
    );
  }, [data, term]);

  const searching = term.length > 0;

  return (
    <section id="kurikulum" aria-labelledby="judul-kurikulum" className="bg-paper-200 text-navy-900">
      <div className="shell py-24 lg:py-36">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="04"
            eyebrow="Kurikulum"
            id="judul-kurikulum"
            title={
              <>
                Peta mata kuliah, <em>terbuka</em> untuk ditelusuri
              </>
            }
            lead="Pilih jenjang, buka kelompok mata kuliah, atau cari berdasarkan nama dan kode. Kolom sks membedakan jalur Reguler dan jalur by research."
          />
          <Reveal delay={120} className="shrink-0">
            <Segmented label="Pilih jenjang kurikulum" options={levelOptions} value={level} onChange={changeLevel} />
          </Reveal>
        </div>

        {/* Ringkasan beban studi */}
        <Reveal delay={80} className="mt-14">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-navy-900/10 ring-1 ring-navy-900/10 lg:grid-cols-4">
            {data.totals.map((total) => (
              <div key={total.label} className="bg-paper-100 p-6 sm:p-8">
                <dt className="eyebrow text-[0.625rem] text-mute-600">{total.label}</dt>
                <dd key={`${level}-${total.label}`} className="swap-in mt-3 flex items-baseline gap-2">
                  <span className="numeral text-[2.125rem] leading-none whitespace-nowrap sm:text-[3rem]">
                    {total.value}
                  </span>
                  <span className="text-sm text-mute-600">{total.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Navigasi kelompok */}
          <div className="min-w-0 lg:col-span-4">
            <div className="rounded-2xl bg-paper-100 p-3 ring-1 ring-navy-900/10 lg:sticky lg:top-28">
              <label htmlFor={searchId} className="sr-only">
                Cari mata kuliah
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mute-500"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari mata kuliah atau kode"
                  autoComplete="off"
                  className="h-12 w-full rounded-full bg-paper-50 pr-11 pl-11 text-sm text-navy-900 ring-1 ring-navy-900/12 transition-shadow duration-300 placeholder:text-mute-500 focus:ring-2 focus:ring-gold-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Hapus pencarian"
                    className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-mute-600 hover:bg-navy-900/5 hover:text-navy-900"
                  >
                    <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <ul
                className={`mt-3 flex gap-2 overflow-x-auto pb-1 transition-opacity duration-300 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0 ${
                  searching ? 'opacity-40' : ''
                }`}
                aria-label="Kelompok mata kuliah"
              >
                {data.groups.map((g) => {
                  const selected = !searching && g.id === group.id;
                  return (
                    <li key={g.id} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setQuery('');
                          setGroupId(g.id);
                        }}
                        className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors duration-300 lg:py-3.5 ${
                          selected ? 'bg-navy-900 text-paper-50' : 'text-navy-900 hover:bg-navy-900/[0.05]'
                        }`}
                      >
                        <span
                          className={`numeral w-7 shrink-0 text-lg italic ${selected ? 'text-sun-300' : 'text-royal-600'}`}
                          aria-hidden="true"
                        >
                          {g.letter}
                        </span>
                        <span className="min-w-0 flex-1 text-[0.875rem] leading-snug font-medium whitespace-nowrap lg:whitespace-normal">
                          {g.label}
                        </span>
                        <span
                          className={`hidden text-[0.75rem] whitespace-nowrap tabular-nums lg:block ${
                            selected ? 'text-paper-200/70' : 'text-mute-600'
                          }`}
                        >
                          {g.load}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Tabel mata kuliah */}
          <div className="min-w-0 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl bg-paper-50 ring-1 ring-navy-900/10" aria-live="polite">
              <div key={searching ? `cari-${level}` : `${level}-${group.id}`} className="swap-in">
                <div className="flex flex-col gap-3 border-b border-navy-900/10 p-6 sm:p-8">
                  {searching ? (
                    <>
                      <p className="eyebrow text-gold-700">Hasil pencarian · {levelLabels[level].short}</p>
                      <h3 className="display text-[1.875rem] leading-tight">
                        {results.length} mata kuliah untuk “{query.trim()}”
                      </h3>
                    </>
                  ) : (
                    <>
                      <p className="eyebrow text-gold-700">
                        Kelompok {group.letter} · {group.load}
                      </p>
                      <h3 className="display text-[1.875rem] leading-tight">{group.label}</h3>
                      <p className="max-w-2xl text-[0.9063rem] leading-[1.7] text-mute-600">{group.rule}</p>
                    </>
                  )}
                </div>

                {searching && results.length === 0 ? (
                  <p className="p-8 text-[0.9375rem] leading-relaxed text-mute-600">
                    Tidak ada mata kuliah yang cocok pada {levelLabels[level].long.toLowerCase()}. Coba kata kunci lain,
                    misalnya “kebijakan”, “latihan”, atau “OR70”.
                  </p>
                ) : (
                  <CourseTable
                    caption={
                      searching
                        ? `Hasil pencarian mata kuliah ${levelLabels[level].short}`
                        : `${group.label}, ${levelLabels[level].short}`
                    }
                    rows={searching ? results : group.courses.map((course) => ({ course }))}
                  />
                )}
              </div>
            </div>

            <p className="mt-5 text-[0.8125rem] leading-relaxed text-mute-600">
              Reg. = sks jalur Reguler, Riset = sks jalur by research, Smt = semester. Struktur merujuk laman resmi
              Prodi dan Portal Kurikulum UPI, diakses {site.dataAccessed}. Pedoman akademik terbaru tetap menjadi acuan
              akhir.{' '}
              <a
                href={level === 's2' ? site.links.kurikulumS2 : site.links.kurikulumS3}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold whitespace-nowrap text-navy-900"
              >
                <span className="link-draw">Buka Portal Kurikulum</span>
                <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">(tab baru)</span>
              </a>
            </p>
          </div>
        </Reveal>

        <Outcomes level={level} />
      </div>
    </section>
  );
}
