import { afterEach, describe, expect, test } from 'bun:test';
import { LESSON_INDEX } from '../src/data/manifest.ts';
import {
  dueCountIndex,
  indexKey,
  masteredCountIndex,
  overallPctIndex,
  trackLessons,
  trackPctIndex,
} from '../src/lib/progress.ts';
import { S, cardKey, day, interviewReadiness, normalizeStudy, reloadState, score } from '../src/lib/state.ts';

const resetS = () => {
  reloadState('{}');
};

afterEach(() => {
  resetS();
});

describe('state.normalizeStudy & legacy migration', () => {
  test('sanitizes malformed fields and invalid goal/theme/streak values', () => {
    const clean = normalizeStudy({
      lessons: {
        'csharp/types': {
          read: true,
          quiz: 'yes' as unknown as boolean,
          notes: 123 as unknown as string,
          rubric: [true, false, true],
        },
        bad: 'not-an-object' as unknown as Record<string, never>,
      },
      cards: {
        badCard: { due: '' },
        valid: { due: '2026-12-01', interval: 4, ease: 9.0, reps: 2, lapses: 0 },
      },
      projects: { '0': [true, false], nonNumeric: [true] } as unknown as Record<number, boolean[]>,
      streak: { last: '2026-11-26', count: -4 },
      theme: 'purple' as unknown as '',
      onboarding: { goal: 'hacker' as unknown as 'backend' },
      examHistory: [
        { date: '2026-11-26', track: 'go', score: 8, total: 10 },
        { date: '2026-11-26', track: 'go', score: 0, total: 0 },
      ],
    });

    expect(clean.lessons['csharp/types']).toEqual({ read: true, rubric: [true, false, true] });
    expect(clean.lessons.bad).toBeUndefined();
    expect(clean.cards.badCard).toBeUndefined();
    expect(clean.cards.valid.ease).toBe(3.0);
    expect(clean.projects).toEqual({ 0: [true, false] });
    expect(clean.streak).toEqual({ last: '2026-11-26', count: 0 });
    expect(clean.theme).toBe('');
    expect(clean.onboarding).toEqual({});
    expect(clean.examHistory).toHaveLength(1);
  });

  test('migrates legacy #index SRS card keys and numeric LessonProgress.q keys to stable quiz IDs', () => {
    const firstLesson = LESSON_INDEX[0];
    const k = indexKey(firstLesson);
    const q0 = firstLesson.quizIds[0];
    const q1 = firstLesson.quizIds[1];

    const migrated = normalizeStudy({
      lessons: {
        [k]: { read: true, q: { '0': true, '1': false } as unknown as Record<string, boolean> },
      },
      cards: {
        [`${k}#0`]: { box: 5, due: '2020-01-01' },
        [`${k}#1`]: { interval: 2, ease: 2.5, reps: 1, lapses: 0, due: '2020-01-01' },
        [cardKey(k, q1)]: { interval: 8, ease: 2.7, reps: 3, lapses: 0, due: '2026-12-10' },
      },
    });

    expect(migrated.lessons[k].q).toEqual({ [q0]: true });
    expect(migrated.cards[`${k}#0`]).toBeUndefined();
    expect(migrated.cards[cardKey(k, q0)]).toEqual({
      interval: 16,
      ease: 2.5,
      reps: 5,
      lapses: 0,
      due: '2020-01-01',
    });
    // Non-legacy key already present takes precedence over legacy #1 key
    expect(migrated.cards[cardKey(k, q1)].interval).toBe(8);
  });
});

describe('progress & readiness selectors', () => {
  test('score, trackPctIndex, overallPctIndex, masteredCountIndex, and dueCountIndex stay consistent', () => {
    resetS();
    expect(overallPctIndex()).toBe(0);
    expect(masteredCountIndex()).toBe(0);
    expect(dueCountIndex()).toBe(0);

    const goLessons = trackLessons('go');
    const first = goLessons[0];
    const k = indexKey(first);
    S.lessons[k] = { read: true, quiz: true, teach: true };
    expect(score(k)).toBe(3);
    expect(masteredCountIndex()).toBe(1);
    expect(trackPctIndex('go')).toBe(Math.round((3 / (goLessons.length * 3)) * 100));
    expect(dueCountIndex()).toBe(first.quizIds.length);

    // Scheduling first card into the future removes it from dueCountIndex
    S.cards[cardKey(k, first.quizIds[0])] = { interval: 4, ease: 2.5, reps: 2, lapses: 0, due: '2099-01-01' };
    expect(dueCountIndex()).toBe(first.quizIds.length - 1);

    // Scheduling a card due today counts it even if the lesson isn't marked learned
    const second = goLessons[1];
    S.cards[cardKey(indexKey(second), second.quizIds[0])] = {
      interval: 1,
      ease: 2.5,
      reps: 0,
      lapses: 1,
      due: day(),
    };
    expect(dueCountIndex()).toBe(first.quizIds.length);
  });

  test('interviewReadiness averages across all 5 dimensions', () => {
    expect(interviewReadiness({})).toBe(0);
    const full = interviewReadiness({
      solved: Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`p${i}`, true])),
      design: Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`d${i}`, true])),
      stories: [
        {
          title: 's',
          s: '',
          t: '',
          a: '',
          r: '',
          ref: '',
          tags: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
        },
      ],
      rapid: Object.fromEntries(Array.from({ length: 67 }, (_, i) => [`r${i}`, 2 as const])),
      mocks: Array.from({ length: 8 }, () => ({
        date: '2026-11-26',
        type: 'coding' as const,
        title: 't',
        scores: [4],
        avg: 4,
        notes: '',
      })),
    });
    expect(full).toBe(100);
  });
});
