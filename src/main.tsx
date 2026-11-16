import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Elemen #root tidak ditemukan.');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Hasil build sudah berisi HTML statis (prerender), jadi cukup dihidrasi.
// Pada mode pengembangan, #root masih kosong dan dirender dari awal.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
