import { describe, expect, test } from 'bun:test';
import { getTrack, registerTrack, registerTrackTranslation, registerUiDict, t } from '../src/lib/i18n.ts';
import { jsonForScript } from '../src/lib/ssr.ts';
import type { Track } from '../src/lib/types.ts';

describe('i18n & ssr helpers', () => {
  test('t interpolates placeholders and leaves unknown keys intact', () => {
    registerUiDict({ 'Session complete: {got} of {n} recalled.': 'Sesi selesai: {got} dari {n} berhasil diingat.' });
    expect(t('Session complete: {got} of {n} recalled.', 'en', { got: 4, n: 5 })).toBe(
      'Session complete: 4 of 5 recalled.',
    );
    expect(t('Session complete: {got} of {n} recalled.', 'id', { got: 4, n: 5 })).toBe(
      'Sesi selesai: 4 dari 5 berhasil diingat.',
    );
  });

  test('mergeLesson pairs quiz translations by stable id regardless of order and never mutates English source', () => {
    const enTrack: Track = {
      id: 'unit-test-track',
      name: 'Test Track',
      lang: 'ts',
      tagline: 'English tagline',
      verifiedAgainst: 'TypeScript 6',
      verifiedDate: '2026-11-26',
      lessons: [
        {
          id: 'intro',
          title: 'Intro',
          level: 0,
          mins: 10,
          why: 'Why',
          points: ['Point'],
          practice: 'Practice',
          teach: 'Teach',
          analogy: 'Analogy',
          pitfalls: ['Pitfall'],
          quiz: [
            { id: 'second-q', q: 'Second EN?', a: ['A', 'B'], c: 1, why: 'Second why EN' },
            { id: 'first-q', q: 'First EN?', a: ['C', 'D'], c: 0, why: 'First why EN' },
          ],
        },
      ],
    };

    registerTrack(enTrack);
    registerTrackTranslation({
      id: 'unit-test-track',
      tagline: 'Tagline ID',
      lessons: {
        intro: {
          title: 'Pengenalan',
          quiz: {
            'first-q': ['Pertama ID?', ['C-id', 'D-id'], 'Alasan pertama ID'],
            'second-q': ['Kedua ID?', ['A-id', 'B-id'], 'Alasan kedua ID'],
          },
        },
      },
    });

    const idMerged = getTrack('unit-test-track', 'id');
    const enAfter = getTrack('unit-test-track', 'en');
    expect(idMerged?.lessons[0].quiz[0].q).toBe('Kedua ID?');
    expect(idMerged?.lessons[0].quiz[1].q).toBe('Pertama ID?');
    expect(enAfter?.lessons[0].title).toBe('Intro');
    expect(enAfter?.lessons[0].quiz[0].q).toBe('Second EN?');
  });

  test('jsonForScript escapes HTML breakout characters safely', () => {
    const out = jsonForScript({ payload: '</script><img src=x onerror=alert(1)>&test' });
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(out).not.toContain('&');
    expect(out).toContain('\\u003c/script\\u003e');
    expect(JSON.parse(out)).toEqual({ payload: '</script><img src=x onerror=alert(1)>&test' });
  });
});
