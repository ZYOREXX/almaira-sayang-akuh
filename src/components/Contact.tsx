import { ArrowUp, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { academicLinks, site, universityLinks } from '../data/site';
import { BorderBeam } from './ui/border-beam';
import { Emblem } from './ui/Emblem';
import { Reveal } from './ui/Reveal';

function LinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="eyebrow text-mute-500">{title}</h3>
      <ul className="mt-5 space-y-3 text-[0.9063rem] text-mute-600">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-sun-200"
            >
              <span className="link-reveal">{link.label}</span>
              <ArrowUpRight className="size-3.5 text-sun-300" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Contact() {
  const { address } = site;
  return (
    <footer id="kontak" className="relative bg-paper-100 pt-20 lg:pt-28">
      {/* Ajakan penutup */}
      <div className="shell relative z-10">
        <Reveal className="grain relative isolate overflow-hidden rounded-[2rem] bg-paper-50 ring-1 ring-navy-900/12 px-6 py-14 text-center text-navy-900 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:px-12 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_80%_at_50%_0%,rgba(226,176,74,0.14),transparent_65%)]"
          />
          <BorderBeam size={300} duration={14} />
          <p className="eyebrow relative text-royal-600">Mulai dari sini</p>
          <h2 className="display relative mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.08] text-balance">
            Setiap riset besar dimulai dari <span className="text-mute-500">satu pertanyaan.</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-[1.0313rem] leading-[1.75] text-mute-600">
            Sampaikan pertanyaan Anda kepada pengelola Prodi, atau langsung mendaftar pada gelombang yang sedang dibuka.
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`mailto:${site.email}`} className="btn btn-gold">
              Hubungi Program Studi
              <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </a>
            <a href={site.links.admisi} target="_blank" rel="noopener noreferrer" className="btn btn-line-light">
              Daftar sekarang
              <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">(portal admisi UPI, tab baru)</span>
            </a>
          </div>
        </Reveal>
      </div>

      {/* Kaki halaman tiga kolom */}
      <div className="grain relative isolate -mt-24 overflow-hidden border-t border-navy-900/10 bg-paper-200 pt-44 text-navy-900">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 " />
        <div className="shell relative grid gap-12 pb-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full text-navy-900 ring-1 ring-navy-900/20">
                <Emblem className="size-9" />
              </span>
              <div className="leading-none">
                <p className="display text-[1.25rem]">{site.shortName}</p>
                <p className="mt-2 text-[0.75rem] text-navy-800/65">
                  {site.school} · {site.university}
                </p>
              </div>
            </div>

            <h3 className="eyebrow mt-10 text-mute-500">Kontak Kami</h3>
            <ul className="mt-5 space-y-4 text-[0.9063rem] leading-[1.7] text-navy-800/85">
              <li className="flex gap-3.5">
                <MapPin className="mt-1 size-4 shrink-0 text-sun-300" strokeWidth={1.75} aria-hidden="true" />
                <address className="not-italic">
                  {address.building}
                  <br />
                  {address.street}, {address.city} {address.postalCode}
                  <br />
                  {address.region}, {address.country}
                  <br />
                  <a
                    href={address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold text-sun-200"
                  >
                    <span className="link-draw">Lihat di peta</span>
                  </a>
                </address>
              </li>
              <li className="flex items-center gap-3.5">
                <Mail className="size-4 shrink-0 text-sun-300" strokeWidth={1.75} aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-sun-200">
                  <span className="link-reveal">{site.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3.5">
                <Instagram className="size-4 shrink-0 text-sun-300" strokeWidth={1.75} aria-hidden="true" />
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun-200">
                  <span className="link-reveal">{site.instagram.handle}</span>
                  <span className="sr-only">(tab baru)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <LinkList title="Tautan Akademik" links={academicLinks} />
          </div>
          <div className="lg:col-span-3">
            <LinkList title="Tautan UPI" links={universityLinks} />
          </div>
        </div>

        <div className="relative border-t border-navy-900/10">
          <div className="shell flex flex-col gap-6 py-7 text-[0.8125rem] leading-relaxed text-navy-800/55 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl">
              © 2026 {site.name}, {site.school} {site.university}. Data merujuk laman resmi SPs UPI dan Portal Kurikulum
              UPI (diakses {site.dataAccessed}); informasi terbaru pada laman resmi tetap menjadi acuan.
            </p>
            <a
              href="#beranda"
              className="no-print inline-flex shrink-0 items-center gap-3 self-start font-semibold text-navy-900 lg:self-auto"
            >
              Kembali ke atas
              <span className="grid size-10 place-items-center rounded-full border border-navy-900/25 transition-colors duration-300 hover:border-sun-300 hover:text-sun-300">
                <ArrowUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
