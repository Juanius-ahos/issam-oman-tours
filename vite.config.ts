import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // The client build keeps a manifest so the prerender script can find the
    // hashed entry file and its CSS for every page it writes.
    manifest: true,
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // three.js and the 3D map stay in their own chunk, loaded on demand.
        // React gets its own chunk first, or Rollup hoists it into the three
        // chunk (R3F imports React) and every page would pay for three.js.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
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
