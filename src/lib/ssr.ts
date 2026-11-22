// Build-time string helpers for Astro templates: translate a UI key or inline-markdown string into one language.
import { mdInline } from './highlight.ts';
import { getLevels, t } from './i18n.ts';
import { routePath } from './routes.ts';
import type { Lang } from './types.ts';

type Vars = Record<string, string | number>;

export interface PageStrings {
  lang: Lang;
  T: (key: string, vars?: Vars) => string;
  md: (s: string) => string;
  href: (path: string) => string;
  levels: readonly [string, string, string, string];
}

export function pageStrings(lang: Lang): PageStrings {
  return {
    lang,
    T: (key, vars) => t(key, lang, vars),
    md: (s) => mdInline(t(s, lang)),
    href: (path) => routePath(lang, path),
    levels: getLevels(lang),
  };
}

// Pick only the UI keys a client island needs, already translated, so it can skip the full dictionary.
export function uiSubset(lang: Lang, keys: readonly string[]): Record<string, string> {
  if (lang === 'en') return {};
  return Object.fromEntries(keys.map((k) => [k, t(k, 'id')]));
}

// Serialize JSON for a <script type="application/json"> block without allowing `</script>` breakouts.
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

let idCounter = 0;

// Monotonic id source for ARIA wiring in build-time components.
export function nextId(): number {
  idCounter += 1;
  return idCounter;
}
