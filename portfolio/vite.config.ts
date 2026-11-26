import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite injects `<script type="module" crossorigin>`. Browsers refuse module
 * scripts on file:// pages, so we emit a classic deferred script instead.
 * Result: dist/index.html also opens with a double-click (no server needed).
 */
function classicScriptTag(): Plugin {
  return {
    name: 'classic-script-tag',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin src=/g, '<script defer src=')
        .replace(/<link rel="stylesheet" crossorigin href=/g, '<link rel="stylesheet" href=');
    },
  };
}

export default defineConfig({
  base: './', // relative asset paths: works on any host, sub-folder or file://
  plugins: [react(), classicScriptTag()],
  build: {
    target: 'es2019',
    modulePreload: false,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        assetFileNames: (info) =>
          (info.name ?? '').endsWith('.css') ? 'assets/app.css' : 'assets/[name][extname]',
      },
    },
  },
});
