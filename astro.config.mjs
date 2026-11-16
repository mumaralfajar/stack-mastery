// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://mumaralfajar.github.io',
  base: '/stack-mastery',
  vite: {
    build: {
      chunkSizeWarningLimit: 600,
    },
  },
});
