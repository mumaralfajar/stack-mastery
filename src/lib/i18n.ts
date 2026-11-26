// Pure i18n language store and immutable localized selectors.
// Never mutates English curriculum objects in place.
import { LEVELS_EN, LEVELS_ID } from '../data/manifest.ts';
import { LANG_KEY } from './keys.ts';
import { alternateUrl } from './routes.ts';
import type {
  InterviewData,
  InterviewTranslation,
  Lang,
  Lesson,
  LessonTranslation,
  ProjectItem,
  ProjectTranslation,
  Track,
  TrackTranslation,
} from './types.ts';

// Each static page declares its language in <html lang>; the stored preference only matters elsewhere.
function detectInitialLang(): Lang {
  if (typeof document !== 'undefined') {
    const pageLang = document.documentElement.lang;
    if (pageLang === 'en' || pageLang === 'id') return pageLang;
  }
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    }
  } catch {
    /* private mode */
  }
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && /^id(-|$)/i.test(navigator.language || '')) {
    return 'id';
  }
  return 'en';
}

let currentLang: Lang = detectInitialLang();

export function getLang(): Lang {
  return currentLang;
}

// Remember the language preference and, by default, open the same page in that language.
export function setLang(lang: Lang, navigate = true): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(LANG_KEY, lang);
    }
  } catch {
    /* ignore */
  }
  if (navigate && typeof location !== 'undefined') {
    location.assign(alternateUrl(lang, location.pathname, location.search));
    return;
  }
  currentLang = lang;
}

// Registries for English source data and Indonesian overlays (never mutated once registered).
const uiDict = new Map<string, string>();
const enTracks = new Map<string, Track>();
const trackOrder: string[] = [];
const idTrackMap = new Map<string, TrackTranslation>();
let enProjects: readonly ProjectItem[] = [];
let idProjects: readonly ProjectTranslation[] = [];
let enInterview: InterviewData | null = null;
let idInterview: InterviewTranslation | null = null;

// Caches for immutable merged Indonesian views, invalidated when registrations change.
const mergedTrackCache = new Map<string, Track>();
let mergedAllTracksId: readonly Track[] | null = null;
let mergedProjectsId: readonly ProjectItem[] | null = null;
let mergedInterviewId: InterviewData | null = null;

export function registerUiDict(dict: Record<string, string>): void {
  for (const [k, v] of Object.entries(dict)) {
    uiDict.set(k, v);
  }
}

export function getUiDict(): ReadonlyMap<string, string> {
  return uiDict;
}

export function registerTrack(tr: Track): void {
  if (!enTracks.has(tr.id)) trackOrder.push(tr.id);
  enTracks.set(tr.id, tr);
  mergedTrackCache.delete(tr.id);
  mergedAllTracksId = null;
}

export function registerTrackTranslation(tr: TrackTranslation): void {
  const prev = idTrackMap.get(tr.id);
  idTrackMap.set(tr.id, {
    id: tr.id,
    name: tr.name ?? prev?.name,
    tagline: tr.tagline ?? prev?.tagline,
    lessons: { ...(prev?.lessons ?? {}), ...tr.lessons },
  });
  mergedTrackCache.delete(tr.id);
  mergedAllTracksId = null;
}

export function registerProjects(list: readonly ProjectItem[]): void {
  enProjects = list;
  mergedProjectsId = null;
}

export function registerProjectsTranslation(list: readonly ProjectTranslation[]): void {
  idProjects = list;
  mergedProjectsId = null;
}

export function registerInterview(data: InterviewData): void {
  enInterview = data;
  mergedInterviewId = null;
}

export function registerInterviewTranslation(data: InterviewTranslation): void {
  idInterview = data;
  mergedInterviewId = null;
}

type Vars = Record<string, string | number>;

function interpolate(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export function t(key: string, langOrVars?: Lang | Vars, vars?: Vars): string {
  if (typeof key !== 'string') return String(key);
  let lang: Lang = currentLang;
  let params: Vars | undefined = vars;
  if (langOrVars === 'en' || langOrVars === 'id') {
    lang = langOrVars;
  } else if (langOrVars && typeof langOrVars === 'object') {
    params = langOrVars;
  }
  const base = lang === 'id' ? (uiDict.get(key) ?? key) : key;
  return interpolate(base, params);
}

export function getLevels(lang: Lang = currentLang): readonly [string, string, string, string] {
  return lang === 'id' ? LEVELS_ID : LEVELS_EN;
}

function mergeLesson(en: Lesson, tr?: LessonTranslation): Lesson {
  if (!tr) return en;
  const next: Lesson = {
    ...en,
    title: tr.title ?? en.title,
    why: tr.why ?? en.why,
    terms: tr.terms ?? en.terms,
    points: tr.points ?? en.points,
    practice: tr.practice ?? en.practice,
    teach: tr.teach ?? en.teach,
    analogy: tr.analogy ?? en.analogy,
    pitfalls: tr.pitfalls ?? en.pitfalls,
    code: tr.code ?? en.code,
    splits: en.splits && tr.splits ? en.splits.map((s, i) => [tr.splits?.[i] || s[0], s[1]]) : en.splits,
    predict: en.predict && tr.predict ? { ...en.predict, ...tr.predict } : en.predict,
    quiz: tr.quiz
      ? en.quiz.map((q) => {
          const tq = tr.quiz?.[q.id];
          return tq ? { ...q, q: tq[0], a: tq[1], why: tq[2] } : q;
        })
      : en.quiz,
  };
  return next;
}

export function getTrack(id: string, lang: Lang = currentLang): Track | undefined {
  const en = enTracks.get(id);
  if (!en) return undefined;
  if (lang === 'en') return en;
  const cached = mergedTrackCache.get(id);
  if (cached) return cached;
  const tr = idTrackMap.get(id);
  if (!tr) return en;
  const merged: Track = {
    ...en,
    name: tr.name ?? en.name,
    tagline: tr.tagline ?? en.tagline,
    lessons: en.lessons.map((l) => mergeLesson(l, tr.lessons[l.id])),
  };
  mergedTrackCache.set(id, merged);
  return merged;
}

export function getAllTracks(lang: Lang = currentLang): readonly Track[] {
  if (lang === 'en') {
    return trackOrder.map((id) => enTracks.get(id)).filter((x): x is Track => Boolean(x));
  }
  if (mergedAllTracksId) return mergedAllTracksId;
  mergedAllTracksId = trackOrder
    .map((id) => getTrack(id, 'id'))
    .filter((x): x is Track => Boolean(x));
  return mergedAllTracksId;
}

export function getLesson(tid: string, lid: string, lang: Lang = currentLang): Lesson | undefined {
  const tr = getTrack(tid, lang);
  return tr?.lessons.find((l) => l.id === lid);
}

export function getProjects(lang: Lang = currentLang): readonly ProjectItem[] {
  if (lang === 'en' || !idProjects.length) return enProjects;
  if (mergedProjectsId) return mergedProjectsId;
  mergedProjectsId = enProjects.map((p, i) => {
    const tr = idProjects[i];
    if (!tr) return p;
    return {
      ...p,
      title: tr.title ?? p.title,
      brief: tr.brief ?? p.brief,
      build: tr.build ?? p.build,
      stretch: tr.stretch ?? p.stretch,
      teach: tr.teach ?? p.teach,
    };
  });
  return mergedProjectsId;
}

export function getInterview(lang: Lang = currentLang): InterviewData | null {
  if (!enInterview) return null;
  if (lang === 'en' || !idInterview) return enInterview;
  if (mergedInterviewId) return mergedInterviewId;
  const iv = idInterview;
  mergedInterviewId = {
    ...enInterview,
    method: iv.method ?? enInterview.method,
    bigO: iv.bigO ?? enInterview.bigO,
    plan: iv.plan ?? enInterview.plan,
    hiring: iv.hiring ?? enInterview.hiring,
    ui: iv.ui ?? enInterview.ui,
    patterns: enInterview.patterns.map((p) => {
      const tr = iv.patterns?.[p.id];
      return tr ? { ...p, ...tr } : p;
    }),
    problems: enInterview.problems.map((p) => {
      const tr = iv.problems?.[p.id];
      return tr ? { ...p, ...tr } : p;
    }),
    behavioral: enInterview.behavioral.map((b) => {
      const tr = iv.behavioral?.[b.id];
      return tr ? { ...b, ...tr } : b;
    }),
    design: {
      ...enInterview.design,
      framework: iv.design?.framework ?? enInterview.design.framework,
      blocks: iv.design?.blocks ?? enInterview.design.blocks,
      cases: enInterview.design.cases.map((c) => {
        const tr = iv.design?.cases?.[c.id];
        return tr ? { ...c, ...tr } : c;
      }),
    },
    // Rapid-fire ratings are stored under the English area name; preserve it in `key`.
    rapid: enInterview.rapid.map((r, i) => {
      const tr = iv.rapid?.[i];
      return {
        ...r,
        key: r.area,
        area: tr?.area ?? r.area,
        qs: tr?.qs ?? r.qs,
      };
    }),
  };
  return mergedInterviewId;
}
