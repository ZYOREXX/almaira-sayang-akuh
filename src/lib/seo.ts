import { faqs } from '../data/admission';
import { programs } from '../data/programs';
import { site } from '../data/site';

/**
 * Data terstruktur schema.org (JSON-LD) yang disisipkan saat prerender.
 * `siteUrl` boleh kosong; properti `url` hanya ditulis bila alamat situs diketahui.
 */
export function structuredData(siteUrl: string): Record<string, unknown>[] {
  const url = siteUrl || undefined;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: `${site.name}, ${site.school} ${site.university}`,
    alternateName: 'Pascasarjana Pendidikan Olahraga UPI',
    url,
    email: site.email,
    sameAs: [site.links.official, site.instagram.url],
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: site.university,
      url: site.links.upi,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: 'ID',
    },
  };

  const credentials = programs.map((program) => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: program.title,
    description: program.summary,
    url,
    educationalCredentialAwarded: program.id === 's2' ? 'Magister (S2)' : 'Doktor (S3)',
    educationalProgramMode: 'full-time',
    inLanguage: 'id',
    provider: {
      '@type': 'CollegeOrUniversity',
      name: `${site.school} ${site.university}`,
      url: site.links.sps,
    },
  }));

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pascasarjana Pendidikan Olahraga UPI',
    url,
    inLanguage: 'id',
  };

  return [organization, ...credentials, faq, website];
}
