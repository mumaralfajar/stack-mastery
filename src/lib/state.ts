// Pure study progress state store, interview readiness, theme management, and reactive subscriptions.
import { INTERVIEW_TOTALS, LESSON_INDEX } from '../data/manifest.ts';
import { getAllTracks, getTrack } from './i18n.ts';
import { normalizeCard } from './srs.ts';
import { INTERVIEW_KEY, STORAGE_KEY, STUDY_KEY, getRaw, onStorageSync, readJson, writeJson } from './storage.ts';
import { applyThemePref, nextThemePref, systemPrefersDark } from './theme.ts';
import type {
  ExamAttempt,
  InterviewProgress,
  LearnerGoal,
  Lesson,
  LessonProgress,
  LevelIndex,
  QuizItem,
  SrsCard,
  StudyOnboarding,
  StudyProgress,
  Track,
} from './types.ts';

export type StateChangeKind = 'study' | 'interview' | 'pomodoro' | 'all';
export type StateListener = (kind: StateChangeKind, external: boolean) => void;

const VALID_GOALS = new Set<string>(['cs-student', 'backend', 'frontend', 'fullstack', 'interview']);
const QUIZ_IDS_BY_LESSON = new Map<string, readonly string[]>(
  LESSON_INDEX.map((e) => [`${e.trackId}/${e.id}`, e.quizIds]),
);

export function cardKey(lessonKey: string, quizId: string): string {
  return `${lessonKey}#${quizId}`;
}

const fresh = (): StudyProgress => ({
  lessons: {},
  cards: {},
  projects: {},
  streak: { last: '', count: 0 },
  theme: '',
  onboarding: {},
  examHistory: [],
});

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

function sanitizeCards(raw: unknown): { cards: Record<string, SrsCard>; migrated: boolean } {
  if (!isPlainObject(raw)) return { cards: {}, migrated: false };
  const out: Record<string, SrsCard> = {};
  let migrated = false;
  // Pass 1: keep non-legacy keys first so they always take precedence over legacy `#index` keys.
  for (const [id, v] of Object.entries(raw)) {
    if (!isPlainObject(v)) continue;
    const card = v as unknown as SrsCard;
    if (typeof card.due !== 'string' || !card.due) continue;
    if (/^[^#]+#\d+$/.test(id)) continue;
    out[id] = normalizeCard(card, card.due);
  }
  // Pass 2: migrate legacy `${lessonKey}#${index}` keys to `${lessonKey}#${quizId}`.
  for (const [id, v] of Object.entries(raw)) {
    const m = /^([^#]+)#(\d+)$/.exec(id);
    if (!m || !isPlainObject(v)) continue;
    const card = v as unknown as SrsCard;
    if (typeof card.due !== 'string' || !card.due) continue;
    const [, lessonKey, idxStr] = m;
    const quizId = QUIZ_IDS_BY_LESSON.get(lessonKey)?.[Number(idxStr)];
    const targetId = quizId ? cardKey(lessonKey, quizId) : id;
    if (quizId) migrated = true;
    if (!Object.hasOwn(out, targetId)) {
      out[targetId] = normalizeCard(card, card.due);
    }
  }
  return { cards: out, migrated };
}

function sanitizeLessons(raw: unknown): { lessons: Record<string, LessonProgress>; migrated: boolean } {
  if (!isPlainObject(raw)) return { lessons: {}, migrated: false };
  const out: Record<string, LessonProgress> = {};
  let migrated = false;
  for (const [lessonKey, v] of Object.entries(raw)) {
    if (!isPlainObject(v)) continue;
    const entry: LessonProgress = {};
    if (typeof v.read === 'boolean') entry.read = v.read;
    if (typeof v.quiz === 'boolean') entry.quiz = v.quiz;
    if (typeof v.teach === 'boolean') entry.teach = v.teach;
    if (typeof v.pred === 'boolean') entry.pred = v.pred;
    if (typeof v.notes === 'string') entry.notes = v.notes;
    if (Array.isArray(v.rubric)) entry.rubric = v.rubric.slice(0, 10).map(Boolean);
    if (isPlainObject(v.q)) {
      const qMap: Record<string, boolean> = {};
      const quizIds = QUIZ_IDS_BY_LESSON.get(lessonKey);
      for (const [qk, qv] of Object.entries(v.q)) {
        if (qv !== true) continue;
        if (/^\d+$/.test(qk)) {
          const mapped = quizIds?.[Number(qk)];
          if (mapped) {
            qMap[mapped] = true;
            migrated = true;
          } else {
            qMap[qk] = true;
          }
        } else {
          qMap[qk] = true;
        }
      }
      if (Object.keys(qMap).length) entry.q = qMap;
    }
    if (Object.keys(entry).length) out[lessonKey] = entry;
  }
  return { lessons: out, migrated };
}

function sanitizeProjects(raw: unknown): Record<number, boolean[]> {
  if (!isPlainObject(raw)) return {};
  const out: Record<number, boolean[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!/^\d+$/.test(k) || !Array.isArray(v)) continue;
    out[Number(k)] = v.slice(0, 30).map(Boolean);
  }
  return out;
}

function sanitizeOnboarding(raw: unknown): StudyOnboarding {
  if (!isPlainObject(raw)) return {};
  const g = raw.goal;
  return typeof g === 'string' && VALID_GOALS.has(g) ? { goal: g as LearnerGoal } : {};
}

function sanitizeExamHistory(raw: unknown): ExamAttempt[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (x): x is ExamAttempt =>
        Boolean(x) &&
        typeof x === 'object' &&
        typeof (x as ExamAttempt).date === 'string' &&
        typeof (x as ExamAttempt).track === 'string' &&
        typeof (x as ExamAttempt).score === 'number' &&
        typeof (x as ExamAttempt).total === 'number' &&
        (x as ExamAttempt).total > 0,
    )
    .slice(0, 20);
}

function normalizeStudyWithMeta(raw: Partial<StudyProgress>): { state: StudyProgress; migrated: boolean } {
  const base = fresh();
  const merged = Object.assign(base, isPlainObject(raw) ? raw : {});
  const lessonsRes = sanitizeLessons(merged.lessons);
  const cardsRes = sanitizeCards(merged.cards);
  merged.lessons = lessonsRes.lessons;
  merged.cards = cardsRes.cards;
  merged.projects = sanitizeProjects(merged.projects);
  merged.streak =
    isPlainObject(merged.streak)
      ? {
          last: typeof merged.streak.last === 'string' ? merged.streak.last : '',
          count: Number.isFinite(Number(merged.streak.count)) ? Math.max(0, Math.floor(Number(merged.streak.count))) : 0,
        }
      : { last: '', count: 0 };
  merged.theme = merged.theme === 'light' || merged.theme === 'dark' ? merged.theme : '';
  merged.onboarding = sanitizeOnboarding(merged.onboarding);
  merged.examHistory = sanitizeExamHistory(merged.examHistory);
  return { state: merged, migrated: lessonsRes.migrated || cardsRes.migrated };
}

function normalizeStudy(raw: Partial<StudyProgress>): StudyProgress {
  return normalizeStudyWithMeta(raw).state;
}

const initial = normalizeStudyWithMeta(readJson<StudyProgress>(STORAGE_KEY, fresh));
export const S: StudyProgress = initial.state;
if (initial.migrated && getRaw(STORAGE_KEY)) {
  writeJson(STORAGE_KEY, S);
}

const listeners = new Set<StateListener>();

export function subscribeState(listener: StateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyStateChange(kind: StateChangeKind = 'study', external = false): void {
  for (const fn of listeners) {
    fn(kind, external);
  }
}

export function save(): void {
  writeJson(STORAGE_KEY, S);
}

export function day(off = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d.toLocaleDateString('sv');
}

export function touch(): void {
  const today = day();
  if (S.streak.last !== today) {
    S.streak.count = S.streak.last === day(-1) ? S.streak.count + 1 : 1;
    S.streak.last = today;
  }
  save();
}

export function streak(): number {
  return S.streak.last === day() || S.streak.last === day(-1) ? S.streak.count : 0;
}

export function track(id: string): Track | undefined {
  return getTrack(id);
}

export function key(t: { id: string }, l: { id: string }): string {
  return `${t.id}/${l.id}`;
}

export function peek(k: string): LessonProgress {
  return S.lessons[k] || {};
}

export function st(k: string): LessonProgress {
  if (!S.lessons[k]) S.lessons[k] = {};
  return S.lessons[k];
}

export function score(k: string): number {
  const s = peek(k);
  return (s.read ? 1 : 0) + (s.quiz ? 1 : 0) + (s.teach ? 1 : 0);
}

export function pct(t: Track, lvl?: LevelIndex | null): number {
  const ls = t.lessons.filter((l) => lvl == null || l.level === lvl);
  return ls.length ? Math.round((ls.reduce((a, l) => a + score(key(t, l)), 0) / (ls.length * 3)) * 100) : 0;
}

export interface LessonEntry {
  t: Track;
  l: Lesson;
  k: string;
}

export function allLessons(): LessonEntry[] {
  return getAllTracks().flatMap((t) => t.lessons.map((l) => ({ t, l, k: key(t, l) })));
}

export function overall(): number {
  const a = allLessons();
  if (!a.length) return 0;
  return Math.round((a.reduce((x, e) => x + score(e.k), 0) / (a.length * 3)) * 100);
}

export interface CardEntry {
  id: string;
  q: QuizItem;
  t: Track;
  l: Lesson;
}

export function allCards(): CardEntry[] {
  return allLessons().flatMap((e) => e.l.quiz.map((q) => ({ id: cardKey(e.k, q.id), q, t: e.t, l: e.l })));
}

// A card is in review once its lesson is marked learned, or as soon as its question was missed in the lesson.
export function dueCards(): CardEntry[] {
  const today = day();
  return allCards().filter((c) => (S.cards[c.id] ? S.cards[c.id].due <= today : !!peek(key(c.t, c.l)).read));
}

// Lightweight readiness computation derived directly from manifest INTERVIEW_TOTALS
// so sidebar & dashboard never need to load the full interview bundle.
export function interviewReadiness(data?: Partial<InterviewProgress>): number {
  try {
    const d: Partial<InterviewProgress> =
      data ?? (JSON.parse(getRaw(INTERVIEW_KEY) || '{}') as Partial<InterviewProgress>);
    const beh = new Set((d.stories || []).flatMap((s) => s.tags || []));
    const parts = [
      Object.keys(d.solved || {}).length / INTERVIEW_TOTALS.problems,
      Object.values(d.design || {}).filter(Boolean).length / INTERVIEW_TOTALS.cases,
      Math.min(beh.size, INTERVIEW_TOTALS.behavioralThemes) / INTERVIEW_TOTALS.behavioralThemes,
      Object.values(d.rapid || {}).filter((v) => v === 2).length / INTERVIEW_TOTALS.rapidTotal,
      Math.min((d.mocks || []).length, INTERVIEW_TOTALS.maxMocks) / INTERVIEW_TOTALS.maxMocks,
    ];
    return Math.round((parts.reduce((a, x) => a + x, 0) / parts.length) * 100);
  } catch {
    return 0;
  }
}

export function applyTheme(): void {
  applyThemePref(S.theme);
}

export function toggleTheme(): void {
  S.theme = nextThemePref(S.theme, systemPrefersDark());
  save();
  applyTheme();
}

// Another tab saved progress: reload every field of S in place so importers keep the same object reference.
export function reloadState(raw: string | null): boolean {
  let next: StudyProgress;
  try {
    next = normalizeStudy(JSON.parse(raw || '{}') as Partial<StudyProgress>);
  } catch {
    return false;
  }
  S.lessons = next.lessons;
  S.cards = next.cards;
  S.projects = next.projects;
  S.streak = next.streak;
  S.theme = next.theme;
  S.onboarding = next.onboarding;
  S.examHistory = next.examHistory;
  applyTheme();
  return true;
}

onStorageSync([STORAGE_KEY, INTERVIEW_KEY, STUDY_KEY], (changedKey, newValue) => {
  if (changedKey === null) {
    if (reloadState(null)) notifyStateChange('all', true);
    return;
  }
  if (changedKey === STORAGE_KEY) {
    if (reloadState(newValue)) notifyStateChange('study', true);
    return;
  }
  if (changedKey === INTERVIEW_KEY) {
    notifyStateChange('interview', true);
    return;
  }
  if (changedKey === STUDY_KEY) {
    notifyStateChange('pomodoro', true);
  }
});
