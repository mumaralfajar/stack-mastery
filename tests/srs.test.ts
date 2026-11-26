import { describe, expect, test } from 'bun:test';
import {
  DEFAULT_EASE,
  MAX_EASE,
  MIN_EASE,
  addDays,
  normalizeCard,
  previewGrades,
  recordCardMiss,
  scheduleCard,
} from '../src/lib/srs.ts';

describe('srs.addDays', () => {
  test('adds positive and negative days across month, leap-year, and year boundaries', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2024-02-28', 2)).toBe('2024-03-01');
    expect(addDays('2025-02-28', 1)).toBe('2025-03-01');
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  test('falls back to YYYY-MM-DD when given an invalid date string', () => {
    expect(addDays('not-a-date', 0)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('srs.normalizeCard', () => {
  test('creates defaults for null or undefined cards', () => {
    expect(normalizeCard(null, '2026-11-26')).toEqual({
      interval: 0,
      ease: DEFAULT_EASE,
      reps: 0,
      lapses: 0,
      due: '2026-11-26',
    });
  });

  test('clamps out-of-range or NaN ease values to [MIN_EASE, MAX_EASE]', () => {
    expect(normalizeCard({ due: '2026-11-26', interval: 4, ease: 0.2 }, '2026-11-26').ease).toBe(MIN_EASE);
    expect(normalizeCard({ due: '2026-11-26', interval: 4, ease: 9.9 }, '2026-11-26').ease).toBe(MAX_EASE);
    expect(normalizeCard({ due: '2026-11-26', interval: 4, ease: Number.NaN }, '2026-11-26').ease).toBe(DEFAULT_EASE);
  });

  test('migrates legacy Leitner { box, due } cards past the old 16d ceiling', () => {
    expect(normalizeCard({ box: 1, due: '2026-11-20' })).toEqual({
      interval: 1,
      ease: DEFAULT_EASE,
      reps: 1,
      lapses: 0,
      due: '2026-11-20',
    });
    expect(normalizeCard({ box: 5, due: '2026-11-20' })).toEqual({
      interval: 16,
      ease: DEFAULT_EASE,
      reps: 5,
      lapses: 0,
      due: '2026-11-20',
    });
  });
});

describe('srs.scheduleCard', () => {
  const today = '2026-11-26';

  test('schedules new card (reps=0) across all four grades', () => {
    expect(scheduleCard(undefined, 'again', today)).toEqual({
      interval: 1,
      ease: 2.3,
      reps: 0,
      lapses: 1,
      due: '2026-11-27',
    });
    expect(scheduleCard(undefined, 'hard', today)).toEqual({
      interval: 1,
      ease: 2.35,
      reps: 1,
      lapses: 0,
      due: '2026-11-27',
    });
    expect(scheduleCard(undefined, 'good', today)).toEqual({
      interval: 1,
      ease: 2.5,
      reps: 1,
      lapses: 0,
      due: '2026-11-27',
    });
    expect(scheduleCard(undefined, 'easy', today)).toEqual({
      interval: 3,
      ease: 2.65,
      reps: 1,
      lapses: 0,
      due: '2026-11-29',
    });
  });

  test('grows intervals on subsequent reps and migrates box=5 past 16d', () => {
    const rep1Good = scheduleCard({ due: today, interval: 1, ease: 2.5, reps: 1, lapses: 0 }, 'good', today);
    expect(rep1Good.interval).toBe(4);
    expect(rep1Good.reps).toBe(2);

    const legacyBox5 = scheduleCard({ box: 5, due: '2020-01-01' }, 'good', today);
    expect(legacyBox5.interval).toBe(40);
    expect(legacyBox5.reps).toBe(6);
    expect(legacyBox5.due).toBe('2027-01-05');
  });

  test('resets reps and increments lapses on Again while clamping ease', () => {
    const hardCard = { due: today, interval: 10, ease: MIN_EASE, reps: 4, lapses: 1 };
    const next = scheduleCard(hardCard, 'again', today);
    expect(next.interval).toBe(1);
    expect(next.reps).toBe(0);
    expect(next.lapses).toBe(2);
    expect(next.ease).toBe(MIN_EASE);
  });

  test('recordCardMiss marks card due today and increments lapses', () => {
    const missed = recordCardMiss({ due: '2026-12-01', interval: 10, ease: 2.6, reps: 3, lapses: 1 }, today);
    expect(missed).toEqual({
      interval: 1,
      ease: 2.6,
      reps: 0,
      lapses: 2,
      due: today,
    });
  });

  test('previewGrades returns all 4 grade intervals and due dates', () => {
    const p = previewGrades({ box: 5, due: '2020-01-01' }, today);
    expect(p.again.interval).toBe(1);
    expect(p.hard.interval).toBe(19);
    expect(p.good.interval).toBe(40);
    expect(p.easy.interval).toBe(52);
  });
});
