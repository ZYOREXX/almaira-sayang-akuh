// Prerender: menyisipkan HTML statis, data terstruktur, dan berkas SEO ke folder dist.
// Dijalankan otomatis oleh `npm run build` setelah build klien dan build SSR selesai.
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

// SITE_URL boleh diberikan lewat lingkungan atau berkas .env di akar proyek.
for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(path.join(root, file));
  } catch {
    // berkas tidak ada: abaikan
  }
}

const siteUrl = (process.env.SITE_URL ?? '').trim().replace(/\/+$/, '');

const { render, structuredData } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

let html = await readFile(path.join(dist, 'index.html'), 'utf8');

if (!html.includes('<!--app-html-->') || !html.includes('<!--head-extra-->')) {
  throw new Error('Penanda prerender tidak ditemukan pada dist/index.html.');
}

const jsonLd = structuredData(siteUrl)
  .map((entry) => `<script type="application/ld+json">${JSON.stringify(entry).replace(/</g, '\\u003c')}</script>`)
  .join('\n    ');

const headExtra = [jsonLd];
if (siteUrl) {
  headExtra.unshift(`<link rel="canonical" href="${siteUrl}/" />`, `<meta property="og:url" content="${siteUrl}/" />`);
  html = html.replace('content="./og-image.png"', `content="${siteUrl}/og-image.png"`);
}

html = html.replace('<!--head-extra-->', headExtra.join('\n    ')).replace('<!--app-html-->', render());
await writeFile(path.join(dist, 'index.html'), html);

const robots = ['User-agent: *', 'Allow: /'];
if (siteUrl) {
  robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
}
await writeFile(path.join(dist, 'robots.txt'), `${robots.join('\n')}\n`);

await rm(ssrDir, { recursive: true, force: true });

const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(
  `Prerender selesai: dist/index.html (${sizeKb} kB)${siteUrl ? `, canonical ${siteUrl}/` : ', tanpa SITE_URL'}`,
);
