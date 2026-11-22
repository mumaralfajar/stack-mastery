// Build-time search index (served as /search-index.json and /id/search-index.json), so the search page
// never loads lesson prose, interview data or lab modules in the browser.
import { getLevels, t } from '../lib/i18n.ts';
import { routePath } from '../lib/routes.ts';
import type { Lang } from '../lib/types.ts';
import { getAllTracks, getInterview, loadSiteData, vizEntries } from './site.ts';

export interface SearchEntry {
  cat: 'lesson' | 'interview' | 'viz';
  kind: string;
  title: string;
  href: string;
  text: string;
}

const plain = (s: string): string => s.replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();

export async function buildSearchIndex(lang: Lang): Promise<SearchEntry[]> {
  await loadSiteData();
  const levels = getLevels(lang);
  const iv = getInterview(lang);
  const href = (path: string) => routePath(lang, path);
  const lessons: SearchEntry[] = getAllTracks(lang).flatMap((tr) =>
    tr.lessons.map((l) => ({
      cat: 'lesson' as const,
      kind: `${tr.name} · ${levels[l.level]}`,
      title: l.title,
      href: href(`/lesson/${tr.id}/${l.id}/`),
      text: plain([l.why, ...(l.terms || []).flat(), ...l.points, l.practice, l.analogy || '', ...l.pitfalls].join(' ')),
    })),
  );
  const interview: SearchEntry[] = iv
    ? [
        ...iv.problems.map((p) => ({
          cat: 'interview' as const,
          kind: t('Coding problem', lang),
          title: p.title,
          href: href(`/interview/problem/${p.id}/`),
          text: plain(`${p.prompt} ${p.pattern}`),
        })),
        ...iv.patterns.map((p) => ({
          cat: 'interview' as const,
          kind: t('Coding pattern', lang),
          title: p.name,
          href: href('/interview/patterns/'),
          text: plain(p.signal),
        })),
        ...iv.design.cases.map((c) => ({
          cat: 'interview' as const,
          kind: t('System design', lang),
          title: c.title,
          href: href(`/interview/design/${c.id}/`),
          text: plain(`${c.prompt} ${c.deep.map((d) => d.join(' ')).join(' ')}`),
        })),
        ...iv.rapid.flatMap((r) =>
          r.qs.map(([q, ans]) => ({
            cat: 'interview' as const,
            kind: `${t('Interview Q&A', lang)} · ${r.area}`,
            title: q,
            href: href('/interview/rapid/'),
            text: plain(ans),
          })),
        ),
      ]
    : [];
  const labs: SearchEntry[] = vizEntries(lang).map((v) => ({
    cat: 'viz' as const,
    kind: t('Visualization', lang),
    title: v.title,
    href: href(`/lab/${v.id}/`),
    text: plain(v.desc),
  }));
  return [...lessons, ...interview, ...labs];
}
