// Pure adaptive SM-2 spaced repetition scheduler.
// Seamlessly migrates legacy Leitner { box, due } cards without a 16-day cap.
import type { AdaptiveSrsCard, SrsCard, SrsGrade } from './types.ts';

const LEGACY_INTERVALS = [1, 2, 4, 8, 16] as const;
export const DEFAULT_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_EASE = 3.0;

function clampEase(ease: number): number {
  if (!Number.isFinite(ease)) return DEFAULT_EASE;
  return Math.round(Math.min(MAX_EASE, Math.max(MIN_EASE, ease)) * 100) / 100;
}

export function addDays(isoDate: string, days: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('sv');
  }
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + days));
  const y = dt.getUTCFullYear();
  const mo = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const da = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

export function normalizeCard(raw: SrsCard | undefined | null, fallbackDue = ''): AdaptiveSrsCard {
  if (!raw || typeof raw !== 'object') {
    return {
      interval: 0,
      ease: DEFAULT_EASE,
      reps: 0,
      lapses: 0,
      due: fallbackDue,
    };
  }
  const due = typeof raw.due === 'string' && raw.due ? raw.due : fallbackDue;
  if (typeof raw.interval === 'number' && Number.isFinite(raw.interval)) {
    const reps = typeof raw.reps === 'number' && Number.isFinite(raw.reps) ? Math.max(0, Math.floor(raw.reps)) : 0;
    const lapses = typeof raw.lapses === 'number' && Number.isFinite(raw.lapses) ? Math.max(0, Math.floor(raw.lapses)) : 0;
    const out: AdaptiveSrsCard = {
      interval: Math.max(0, Math.round(raw.interval)),
      ease: clampEase(typeof raw.ease === 'number' ? raw.ease : DEFAULT_EASE),
      reps,
      lapses,
      due,
    };
    if (typeof raw.box === 'number' && Number.isFinite(raw.box)) out.box = raw.box;
    return out;
  }
  const box = typeof raw.box === 'number' && Number.isFinite(raw.box) ? Math.max(0, Math.floor(raw.box)) : 0;
  const interval = box >= 1 ? (LEGACY_INTERVALS[Math.min(box, LEGACY_INTERVALS.length) - 1] ?? 1) : 1;
  return {
    interval,
    ease: DEFAULT_EASE,
    reps: box,
    lapses: 0,
    due,
  };
}

export function scheduleCard(raw: SrsCard | undefined | null, grade: SrsGrade, today: string): AdaptiveSrsCard {
  const c = normalizeCard(raw, today);
  if (grade === 'again') {
    return {
      interval: 1,
      ease: clampEase(c.ease - 0.2),
      reps: 0,
      lapses: c.lapses + 1,
      due: addDays(today, 1),
    };
  }
  if (grade === 'hard') {
    const interval = c.reps === 0 ? 1 : c.reps === 1 ? 2 : Math.max(1, Math.round(c.interval * 1.2));
    return {
      interval,
      ease: clampEase(c.ease - 0.15),
      reps: c.reps + 1,
      lapses: c.lapses,
      due: addDays(today, interval),
    };
  }
  if (grade === 'good') {
    const interval = c.reps === 0 ? 1 : c.reps === 1 ? 4 : Math.max(c.interval + 1, Math.round(c.interval * c.ease));
    return {
      interval,
      ease: clampEase(c.ease),
      reps: c.reps + 1,
      lapses: c.lapses,
      due: addDays(today, interval),
    };
  }
  const interval = c.reps === 0 ? 3 : c.reps === 1 ? 6 : Math.max(c.interval + 2, Math.round(c.interval * c.ease * 1.3));
  return {
    interval,
    ease: clampEase(c.ease + 0.15),
    reps: c.reps + 1,
    lapses: c.lapses,
    due: addDays(today, interval),
  };
}

export function recordCardMiss(raw: SrsCard | undefined | null, today: string): AdaptiveSrsCard {
  const prev = raw ? normalizeCard(raw, today) : null;
  return {
    interval: 1,
    ease: prev ? prev.ease : DEFAULT_EASE,
    reps: 0,
    lapses: (prev ? prev.lapses : 0) + 1,
    due: today,
  };
}

export function previewGrades(
  raw: SrsCard | undefined | null,
  today: string,
): Record<SrsGrade, { interval: number; due: string }> {
  const again = scheduleCard(raw, 'again', today);
  const hard = scheduleCard(raw, 'hard', today);
  const good = scheduleCard(raw, 'good', today);
  const easy = scheduleCard(raw, 'easy', today);
  return {
    again: { interval: again.interval, due: again.due },
    hard: { interval: hard.interval, due: hard.due },
    good: { interval: good.interval, due: good.due },
    easy: { interval: easy.interval, due: easy.due },
  };
}
