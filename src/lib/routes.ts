// Pure URL builders for the bilingual static site plus the legacy `#/...` hash bridge.
// English lives at /stack-mastery/..., Indonesian at /stack-mastery/id/...; every page URL ends in a slash.
// Dependency-free on purpose: the landing page bundle imports this module and must stay tiny.
import type { Lang } from './types.ts';

export const BASE = '/stack-mastery';
export const SITE = 'https://mumaralfajar.github.io';
export const PLAY_KINDS: readonly string[] = ['sql', 'ts', 'css', 'dart'];

const SIMPLE_PAGES = new Set(['dashboard', 'start', 'search', 'review', 'exam', 'projects', 'teach', 'notes', 'break']);
const INTERVIEW_PAGES = new Set(['coding', 'patterns', 'design', 'behavioral', 'rapid', 'mock']);

export function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'id';
}

// Build a site URL for `path` (e.g. '/lesson/go/types/' or 'play/sql/?sample=joins') in `lang`.
// Page paths always end with '/'; file paths such as '/search-index.json' keep their extension.
export function routePath(lang: Lang, path = '/'): string {
  const q = path.indexOf('?');
  const rawPath = q >= 0 ? path.slice(0, q) : path;
  const query = q >= 0 ? path.slice(q + 1) : '';
  let clean = '/' + rawPath.replace(/^\/+/, '');
  if (!clean.endsWith('/') && !/\.[a-z0-9]+$/i.test(clean)) clean += '/';
  const prefix = lang === 'id' ? `${BASE}/id` : BASE;
  return prefix + clean + (query ? `?${query}` : '');
}

// Absolute URL (for canonical / hreflang / Open Graph tags).
export function absoluteUrl(lang: Lang, path = '/'): string {
  return SITE + routePath(lang, path);
}

// Language encoded in a pathname: '/stack-mastery/id/...' is Indonesian, everything else English.
export function langFromPath(pathname: string): Lang {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return rest === '/id' || rest.startsWith('/id/') ? 'id' : 'en';
}

// Route path without the base and language prefix: '/stack-mastery/id/lesson/go/types/' -> '/lesson/go/types/'.
export function stripBase(pathname: string): string {
  let rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  if (rest === '/id' || rest.startsWith('/id/')) rest = rest.slice(3);
  if (!rest.startsWith('/')) rest = '/' + rest;
  if (rest === '/index.html' || rest.endsWith('/index.html')) rest = rest.slice(0, -'index.html'.length);
  return rest;
}

// The same page in the other language, keeping the sub-path and query string (e.g. ?sample=joins).
export function alternateUrl(targetLang: Lang, currentPathname: string, currentSearch = ''): string {
  const search = currentSearch && currentSearch !== '?' ? (currentSearch.startsWith('?') ? currentSearch : `?${currentSearch}`) : '';
  return routePath(targetLang, stripBase(currentPathname)) + search;
}

// Route segments for nav highlighting: '/interview/problem/two-sum/' -> ['interview', 'problem', 'two-sum'].
export function routeSegments(pathname: string): string[] {
  return stripBase(pathname).split('/').filter(Boolean);
}

export function isLegacyHash(hash: string): boolean {
  return hash === '#/' || /^#\/[^/]/.test(hash);
}

// Convert a legacy `#/...` bookmark into its route path ('/lesson/go/types/'), relative to the language root.
export function legacyHashToRoute(hash: string): string {
  const safe = (s: string | undefined): string => {
    if (!s) return '';
    let v = s;
    try {
      v = decodeURIComponent(s);
    } catch {
      return '';
    }
    return /^[\w-]+$/.test(v) ? v : '';
  };
  const [a, b, c] = hash
    .replace(/^#\/?/, '')
    .split(/[?#]/)[0]
    .split('/')
    .filter(Boolean)
    .map(safe);
  if (!a) return '/';
  if (a === 'meadow') return '/break/';
  if (SIMPLE_PAGES.has(a)) return `/${a}/`;
  if (a === 'track') return b ? `/track/${b}/` : '/dashboard/';
  if (a === 'lesson' || a === 'plan') {
    if (b && c) return `/${a}/${b}/${c}/`;
    return b ? `/track/${b}/` : '/dashboard/';
  }
  if (a === 'lab') return b ? `/lab/${b}/` : '/lab/';
  if (a === 'play') {
    const kind = b && PLAY_KINDS.includes(b) ? b : 'sql';
    return c ? `/play/${kind}/?sample=${encodeURIComponent(c)}` : `/play/${kind}/`;
  }
  if (a === 'interview') {
    if (!b) return '/interview/';
    if (b === 'problem') return c ? `/interview/problem/${c}/` : '/interview/coding/';
    if (b === 'design') return c ? `/interview/design/${c}/` : '/interview/design/';
    return INTERVIEW_PAGES.has(b) ? `/interview/${b}/` : '/interview/';
  }
  return '/';
}

// Full site URL for a legacy hash in the given language, e.g. '#/play/sql/joins' -> '/stack-mastery/play/sql/?sample=joins'.
export function legacyHashToPath(hash: string, lang: Lang): string {
  return routePath(lang, legacyHashToRoute(hash));
}
