import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export { structuredData } from './lib/seo';

/** Menghasilkan HTML statis halaman untuk disisipkan ke dist/index.html. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
