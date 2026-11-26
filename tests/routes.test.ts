import { describe, expect, test } from 'bun:test';
import {
  BASE,
  SITE,
  absoluteUrl,
  alternateUrl,
  isLang,
  isLegacyHash,
  langFromPath,
  legacyHashToPath,
  legacyHashToRoute,
  routePath,
  routeSegments,
  stripBase,
} from '../src/lib/routes.ts';

describe('routes', () => {
  test('isLang validates en and id only', () => {
    expect(isLang('en')).toBe(true);
    expect(isLang('id')).toBe(true);
    expect(isLang('fr')).toBe(false);
    expect(isLang(null)).toBe(false);
  });

  test('routePath enforces trailing slash for pages and preserves file extensions and queries', () => {
    expect(routePath('en', '/lesson/go/types')).toBe(`${BASE}/lesson/go/types/`);
    expect(routePath('id', 'lesson/go/types/')).toBe(`${BASE}/id/lesson/go/types/`);
    expect(routePath('en', '/play/sql?sample=joins')).toBe(`${BASE}/play/sql/?sample=joins`);
    expect(routePath('id', '/quiz-index.json')).toBe(`${BASE}/id/quiz-index.json`);
    expect(absoluteUrl('en', '/dashboard/')).toBe(`${SITE}${BASE}/dashboard/`);
  });

  test('langFromPath, stripBase, alternateUrl, and routeSegments handle EN/ID and index.html', () => {
    expect(langFromPath(`${BASE}/dashboard/`)).toBe('en');
    expect(langFromPath(`${BASE}/id/dashboard/`)).toBe('id');
    expect(langFromPath(`${BASE}/id`)).toBe('id');
    expect(stripBase(`${BASE}/id/lesson/go/types/`)).toBe('/lesson/go/types/');
    expect(stripBase(`${BASE}/index.html`)).toBe('/');
    expect(alternateUrl('id', `${BASE}/play/sql/`, '?sample=joins')).toBe(`${BASE}/id/play/sql/?sample=joins`);
    expect(alternateUrl('en', `${BASE}/id/interview/problem/two-sum/`)).toBe(`${BASE}/interview/problem/two-sum/`);
    expect(routeSegments(`${BASE}/id/interview/problem/two-sum/`)).toEqual(['interview', 'problem', 'two-sum']);
  });

  test('legacyHash helpers migrate old SPA bookmarks and reject unsafe segments', () => {
    expect(isLegacyHash('#/')).toBe(true);
    expect(isLegacyHash('#/dashboard')).toBe(true);
    expect(isLegacyHash('#section')).toBe(false);

    expect(legacyHashToRoute('#/')).toBe('/');
    expect(legacyHashToRoute('#/meadow')).toBe('/break/');
    expect(legacyHashToRoute('#/lesson/go/concurrency')).toBe('/lesson/go/concurrency/');
    expect(legacyHashToRoute('#/play/sql/joins')).toBe('/play/sql/?sample=joins');
    expect(legacyHashToRoute('#/play/unknown/joins')).toBe('/play/sql/?sample=joins');
    expect(legacyHashToRoute('#/interview/problem/two-sum')).toBe('/interview/problem/two-sum/');
    expect(legacyHashToRoute('#/interview/design')).toBe('/interview/design/');
    expect(legacyHashToPath('#/lab/syshash', 'id')).toBe(`${BASE}/id/lab/syshash/`);

    // Malformed percent encoding or non-slug characters must sanitize cleanly
    expect(legacyHashToRoute('#/lesson/%E0%A4%A/foo')).toBe('/dashboard/');
    expect(legacyHashToRoute('#/lesson/<script>/xss')).toBe('/dashboard/');
  });
});
