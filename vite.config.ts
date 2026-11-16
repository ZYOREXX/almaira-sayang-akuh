import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `base: './'` membuat seluruh aset dirujuk secara relatif, sehingga hasil build
// dapat dipasang di domain utama maupun di sub-folder (mis. GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
