import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // "/" on a real domain; "/issam-oman-tours/" for the GitHub Pages preview (npm run build:pages).
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    // The client build keeps a manifest so the prerender script can find the
    // hashed entry file and its CSS for every page it writes.
    manifest: true,
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
  ssr: {
    // Bundled into the server build so prerendering has no runtime CSS imports.
    noExternal: ['@fontsource-variable/archivo', '@fontsource/ibm-plex-sans-arabic'],
  },
});
