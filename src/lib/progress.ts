// Progress summaries computed from the lightweight manifest (no lesson prose), for the sidebar,
// dashboard, track pages and break room. Mirrors pct()/dueCards()/overall() in state.ts exactly.
import { LESSON_INDEX } from '../data/manifest.ts';
import { S, day, peek, score } from './state.ts';
import type { LessonIndexEntry, LevelIndex } from './types.ts';

export function indexKey(e: Pick<LessonIndexEntry, 'trackId' | 'id'>): string {
  return `${e.trackId}/${e.id}`;
}

export function trackLessons(trackId: string, level?: LevelIndex | null): LessonIndexEntry[] {
  return LESSON_INDEX.filter((e) => e.trackId === trackId && (level == null || e.level === level));
}

export function trackPctIndex(trackId: string, level?: LevelIndex | null): number {
  const ls = trackLessons(trackId, level);
  return ls.length ? Math.round((ls.reduce((a, e) => a + score(indexKey(e)), 0) / (ls.length * 3)) * 100) : 0;
}

export function overallPctIndex(): number {
  if (!LESSON_INDEX.length) return 0;
  return Math.round((LESSON_INDEX.reduce((a, e) => a + score(indexKey(e)), 0) / (LESSON_INDEX.length * 3)) * 100);
}

export function masteredCountIndex(): number {
  return LESSON_INDEX.filter((e) => score(indexKey(e)) === 3).length;
}

// Same rule as dueCards(): a card is due once its lesson is learned or its question was missed.
export function dueCountIndex(): number {
  const today = day();
  let n = 0;
  for (const e of LESSON_INDEX) {
    const k = indexKey(e);
    const read = !!peek(k).read;
    for (let i = 0; i < e.quizCount; i++) {
      const card = S.cards[`${k}#${i}`];
      if (card ? card.due <= today : read) n++;
    }
  }
  return n;
}
