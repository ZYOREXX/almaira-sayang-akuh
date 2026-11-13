import { ArrowUp, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { sections, site } from '../data/site';
import { Emblem } from './ui/Emblem';
import { Reveal } from './ui/Reveal';

const officialLinks = [
  { label: 'Laman Prodi di SPs UPI', href: site.links.official },
  { label: 'Sekolah Pascasarjana UPI', href: site.links.sps },
  { label: 'Universitas Pendidikan Indonesia', href: site.links.upi },
  { label: 'Portal Admisi UPI', href: site.links.admisi },
  { label: 'Portal Kurikulum UPI', href: site.links.kurikulumS2 },
];

export function Contact() {
  const { address } = site;
  return (
    <footer id="kontak" className="grain relative isolate overflow-hidden bg-ink-900 text-ivory-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(110,21,38,0.55),transparent_70%)]"
      />

      {/* Ajakan penutup */}
      <div className="shell relative pt-24 pb-20 lg:pt-36 lg:pb-28">
        <Reveal className="flex items-center gap-4">
          <span className="h-px w-10 bg-champagne-300/50" aria-hidden="true" />
          <p className="eyebrow text-champagne-200/85">Kontak</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display mt-7 max-w-5xl text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.025em] text-balance">
            Setiap riset besar dimulai dari <em className="text-champagne-300">satu pertanyaan.</em>
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={`mailto:${site.email}`} className="btn btn-gold">
            Hubungi Program Studi
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href={site.links.admisi} target="_blank" rel="noopener noreferrer" className="btn btn-line-light">
            Daftar sekarang
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">(portal admisi UPI, tab baru)</span>
          </a>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[3px] bg-champagne-300/15 ring-1 ring-champagne-300/15 md:grid-cols-3 lg:mt-28">
          <Reveal className="bg-ink-900 p-8 lg:p-10">
            <Mail className="size-5 text-champagne-300" strokeWidth={1.25} aria-hidden="true" />
            <p className="eyebrow mt-6 text-[0.625rem] text-ivory-200/55">Surel</p>
            <a href={`mailto:${site.email}`} className="display mt-3 inline-block text-[1.625rem] break-all">
              <span className="link-draw">{site.email}</span>
            </a>
          </Reveal>
          <Reveal delay={90} className="bg-ink-900 p-8 lg:p-10">
            <Instagram className="size-5 text-champagne-300" strokeWidth={1.25} aria-hidden="true" />
            <p className="eyebrow mt-6 text-[0.625rem] text-ivory-200/55">Instagram</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="display mt-3 inline-block text-[1.625rem]"
            >
              <span className="link-draw">{site.instagram.handle}</span>
              <span className="sr-only">(tab baru)</span>
            </a>
          </Reveal>
          <Reveal delay={180} className="bg-ink-900 p-8 lg:p-10">
            <MapPin className="size-5 text-champagne-300" strokeWidth={1.25} aria-hidden="true" />
            <p className="eyebrow mt-6 text-[0.625rem] text-ivory-200/55">Alamat</p>
            <address className="mt-3 text-[0.9688rem] leading-[1.7] text-ivory-200/85 not-italic">
              {address.building}
              <br />
              {address.street}, {address.city} {address.postalCode}
              <br />
              {address.region}, {address.country}
            </address>
            <a
              href={address.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-champagne-300"
            >
              <span className="link-draw">Lihat di peta</span>
              <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Kaki halaman */}
      <div className="relative border-t border-ivory-50/10">
        <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Emblem className="size-12 text-champagne-300" />
              <div className="leading-none">
                <p className="display text-[1.625rem]">{site.shortName}</p>
                <p className="eyebrow mt-1.5 text-[0.5938rem] text-champagne-200/70">
                  {site.school} · {site.university}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-[0.9063rem] leading-[1.75] text-ivory-200/65">
              Program Magister (S2) dan Doktor (S3) Pendidikan Olahraga. Pelopor dan unggul dalam menyiapkan pendidik,
              pelatih, ilmuwan, dan pengambil kebijakan olahraga.
            </p>
          </div>

          <nav aria-label="Navigasi kaki halaman" className="lg:col-span-3">
            <p className="eyebrow text-[0.625rem] text-ivory-200/55">Jelajahi</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.9063rem] text-ivory-200/85 lg:grid-cols-1">
              {sections.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    <span className="link-reveal">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tautan resmi" className="lg:col-span-4">
            <p className="eyebrow text-[0.625rem] text-ivory-200/55">Tautan resmi</p>
            <ul className="mt-5 space-y-3 text-[0.9063rem] text-ivory-200/85">
              {officialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <span className="link-reveal">{link.label}</span>
                    <ArrowUpRight className="size-3.5 text-champagne-300" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-ivory-50/10">
          <div className="shell flex flex-col gap-6 py-8 text-[0.8125rem] leading-relaxed text-ivory-200/55 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl">
              © 2026 {site.name}, {site.school} {site.university}. Data profil, kurikulum, dan admisi merujuk laman
              resmi SPs UPI dan Portal Kurikulum UPI (diakses {site.dataAccessed}); informasi terbaru pada laman resmi
              tetap menjadi acuan.
            </p>
            <a
              href="#beranda"
              className="no-print inline-flex shrink-0 items-center gap-3 self-start font-semibold text-ivory-50 lg:self-auto"
            >
              Kembali ke atas
              <span className="grid size-10 place-items-center rounded-full border border-ivory-50/25 transition-colors duration-300 hover:border-champagne-300 hover:text-champagne-300">
                <ArrowUp className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
