// @ts-check
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const BASE = '/stack-mastery';

function swBuildHash() {
  return {
    name: 'sw-build-hash',
    hooks: {
      /** @param {{ dir: URL }} ctx */
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        /** @type {string[]} */
        const files = [];
        /** @param {string} abs @param {string} rel */
        const walk = (abs, rel) => {
          for (const e of readdirSync(abs, { withFileTypes: true })) {
            const nextRel = rel ? `${rel}/${e.name}` : e.name;
            const nextAbs = join(abs, e.name);
            if (e.isDirectory()) walk(nextAbs, nextRel);
            else if (nextRel !== 'sw.js') files.push(nextRel);
          }
        };
        walk(distDir, '');
        files.sort();

        const hash = createHash('sha256');
        const astroAssets = [];
        for (const rel of files) {
          hash.update(rel);
          hash.update(readFileSync(join(distDir, rel)));
          if (rel.startsWith('_astro/')) astroAssets.push(`${BASE}/${rel}`);
        }
        const buildId = hash.digest('hex').slice(0, 8);
        const swPath = join(distDir, 'sw.js');
        const swSrc = readFileSync(swPath, 'utf8')
          .replace("const VERSION = 'stack-mastery-v2';", `const VERSION = 'stack-mastery-v2-${buildId}';`)
          .replace('const ASTRO_ASSETS = null;', `const ASTRO_ASSETS = new Set(${JSON.stringify(astroAssets)});`);
        writeFileSync(swPath, swSrc, 'utf8');
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://mumaralfajar.github.io',
  base: BASE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', id: 'id' } },
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404.html'),
    }),
    swBuildHash(),
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
