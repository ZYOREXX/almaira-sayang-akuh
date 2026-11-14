import { ArrowUp, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { academicLinks, site, universityLinks } from '../data/site';
import { BorderBeam } from './ui/border-beam';
import { Emblem } from './ui/Emblem';
import { Reveal } from './ui/Reveal';

function LinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="display text-[1.125rem] text-paper-50">{title}</h3>
      <ul className="mt-5 space-y-3 text-[0.9063rem] text-paper-200/80">
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
        <Reveal className="grain relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1d6fd0] via-royal-600 to-deep-950 px-6 py-14 text-center text-paper-50 shadow-[0_40px_90px_-40px_rgba(15,33,102,0.75)] sm:px-12 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_80%_at_50%_0%,rgba(245,207,88,0.22),transparent_65%)]"
          />
          <BorderBeam size={300} duration={14} />
          <p className="eyebrow relative text-sun-200">Mulai dari sini</p>
          <h2 className="display relative mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.08] text-balance">
            Setiap riset besar dimulai dari <span className="text-sun-300">satu pertanyaan.</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-[1.0313rem] leading-[1.75] text-paper-200/85">
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
      <div className="grain relative isolate -mt-24 overflow-hidden bg-navy-900 pt-44 text-paper-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_100%_0%,rgba(42,63,214,0.35),transparent_70%)]"
        />
        <div className="shell relative grid gap-12 pb-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-royal-500 to-deep-800 text-sun-300">
                <Emblem className="size-9" />
              </span>
              <div className="leading-none">
                <p className="display text-[1.25rem]">{site.shortName}</p>
                <p className="mt-2 text-[0.75rem] text-paper-200/65">
                  {site.school} · {site.university}
                </p>
              </div>
            </div>

            <h3 className="display mt-10 text-[1.125rem]">Kontak Kami</h3>
            <ul className="mt-5 space-y-4 text-[0.9063rem] leading-[1.7] text-paper-200/85">
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

        <div className="relative border-t border-paper-50/10">
          <div className="shell flex flex-col gap-6 py-7 text-[0.8125rem] leading-relaxed text-paper-200/55 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl">
              © 2026 {site.name}, {site.school} {site.university}. Data merujuk laman resmi SPs UPI dan Portal Kurikulum
              UPI (diakses {site.dataAccessed}); informasi terbaru pada laman resmi tetap menjadi acuan.
            </p>
            <a
              href="#beranda"
              className="no-print inline-flex shrink-0 items-center gap-3 self-start font-semibold text-paper-50 lg:self-auto"
            >
              Kembali ke atas
              <span className="grid size-10 place-items-center rounded-full border border-paper-50/25 transition-colors duration-300 hover:border-sun-300 hover:text-sun-300">
                <ArrowUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
