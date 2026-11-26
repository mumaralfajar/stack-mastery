// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://mumaralfajar.github.io',
  base: '/stack-mastery',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', id: 'id' } },
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404.html'),
    }),
  ],
  vite: {
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          assetFileNames: (info) => {
            const n = info.names?.[0] ?? info.name ?? '';
            if (n === 'icons.css' || n.endsWith('.css')) return '_astro/styles.[hash][extname]';
            return '_astro/[name].[hash][extname]';
          },
        },
      },
    },
  },
});
