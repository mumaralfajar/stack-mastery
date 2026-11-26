// Lesson page islands. The lesson HTML is pre-rendered; this script only wires Predict-first, the quiz with
// spaced-repetition marking, the Teach-back rubric, the Learn/Check/Teach tracker, and the lesson's single lab,
// which is dynamic-imported on its own via loadViz(id) (never every lab module).
import { recordLastLesson } from '../lib/break/pomodoro.ts';
import { md } from '../lib/dom.ts';
import { getLang, registerUiDict, t as T } from '../lib/i18n.ts';
import { quizItem } from '../lib/ui.ts';
import { recordCardMiss } from '../lib/srs.ts';
import { cardKey, S, day, notifyStateChange, peek, save, st, touch } from '../lib/state.ts';
import type { QuizItem } from '../lib/types.ts';
import { loadViz } from './viz/registry.ts';

interface LessonPayload {
  key: string;
  trackId?: string;
  lessonId?: string;
  title?: string;
  predict?: { answer: number; explain: string } | null;
  quiz: QuizItem[];
  viz?: string | null;
  i18n?: Record<string, string>;
}

const root = document.querySelector<HTMLElement>('[data-lesson-root]');
let data: LessonPayload | null = null;
try {
  data = JSON.parse(document.getElementById('lesson-data')?.textContent || 'null') as LessonPayload | null;
} catch {
  data = null;
}

if (root && data) {
  registerUiDict(data.i18n || {});
  const k = data.key;
  const [fallbackTrack = '', fallbackLesson = ''] = String(k || '').split('/');
  const trackId = data.trackId || fallbackTrack;
  const lessonId = data.lessonId || fallbackLesson;
  const lessonTitle = data.title || root.querySelector('h1')?.textContent?.trim() || lessonId;
  if (trackId && lessonId) {
    recordLastLesson({ trackId, lessonId, title: lessonTitle, url: location.pathname });
  }
  const tracker = root.querySelector<HTMLElement>('[data-tracker]');

  const drawTracker = (): void => {
    if (!tracker) return;
    const s = peek(k);
    for (const [i, step] of [...tracker.querySelectorAll<HTMLElement>('[data-step]')].entries()) {
      const keyName = step.dataset.step as 'read' | 'quiz' | 'teach' | undefined;
      const on = keyName ? !!s[keyName] : false;
      step.classList.toggle('on', on);
      const mark = step.querySelector('i');
      if (mark) mark.textContent = on ? '✓' : String(i + 1);
    }
  };
  const set = (f: 'read' | 'quiz' | 'teach', v: boolean): void => {
    st(k)[f] = v;
    touch();
    drawTracker();
    notifyStateChange('study');
  };

  // Learn
  const readBtn = root.querySelector<HTMLButtonElement>('[data-read-toggle]');
  const drawRead = (): void => {
    if (!readBtn) return;
    readBtn.textContent = T(peek(k).read ? '✓ Learned (click to undo)' : 'Mark as learned');
    readBtn.classList.toggle('done', !!peek(k).read);
  };
  readBtn?.addEventListener('click', () => {
    set('read', !peek(k).read);
    drawRead();
  });
  drawRead();

  // Check (persist per-question completion across reloads); a first miss schedules the card for review.
  const s0 = peek(k);
  const qSaved: Record<string, boolean> = { ...(s0.q || {}) };
  const results = data.quiz.map((q) => !!qSaved[q.id]);
  const quizHost = root.querySelector<HTMLElement>('[data-quiz]');
  quizHost?.replaceChildren(
    ...data.quiz.map((q, i) =>
      quizItem(q, {
        solved: !!qSaved[q.id],
        onResult: () => {
          results[i] = true;
          qSaved[q.id] = true;
          st(k).q = qSaved;
          save();
          if (results.every(Boolean)) set('quiz', true);
        },
        onMiss: () => {
          const cid = cardKey(k, q.id);
          S.cards[cid] = recordCardMiss(S.cards[cid], day());
          save();
          notifyStateChange('study');
        },
      }),
    ),
  );

  // Teach: a written explanation is required before the rubric can be ticked.
  const notes = root.querySelector<HTMLTextAreaElement>('[data-teach-notes]');
  const teachCount = root.querySelector<HTMLElement>('[data-teach-count]');
  const teachWarn = root.querySelector<HTMLElement>('[data-teach-warn]');
  const rub = (s0.rubric || []).slice();
  const countWords = (val: string): number => {
    const trimmed = String(val || '').trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };
  const drawTeachCount = (): void => {
    if (!teachCount || !notes) return;
    const n = countWords(notes.value);
    teachCount.classList.toggle('ready', n >= 15);
    if (n === 0) {
      teachCount.textContent = T('0 words — aim for a short explanation in your own words');
    } else if (n === 1) {
      teachCount.textContent = T('{n} word — add a short example or trade-off if helpful', { n });
    } else if (n < 15) {
      teachCount.textContent = T('{n} words — add a short example or trade-off if helpful', { n });
    } else {
      teachCount.textContent = T('{n} words — ready for rubric', { n });
    }
  };
  if (notes) {
    notes.value = s0.notes || '';
    drawTeachCount();
    notes.addEventListener('input', () => {
      st(k).notes = notes.value;
      save();
      drawTeachCount();
      if (notes.value.trim() && teachWarn) teachWarn.hidden = true;
    });
  }
  const boxes = [...root.querySelectorAll<HTMLInputElement>('[data-rubric]')];
  for (const cb of boxes) {
    const i = Number(cb.dataset.rubric);
    cb.checked = !!rub[i];
    cb.addEventListener('change', () => {
      if (cb.checked && !notes?.value.trim()) {
        cb.checked = false;
        if (teachWarn) teachWarn.hidden = false;
        notes?.focus();
        return;
      }
      if (teachWarn) teachWarn.hidden = true;
      rub[i] = cb.checked;
      st(k).rubric = rub;
      set(
        'teach',
        boxes.every((_, j) => rub[j]),
      );
    });
  }

  // Predict first (Try-First, Tell-Later): code comments stay blurred until a prediction is committed.
  const predictCard = root.querySelector<HTMLElement>('[data-predict]');
  if (predictCard && data.predict) {
    const p = data.predict;
    const pfb = predictCard.querySelector<HTMLElement>('.fb');
    const pBtns = [...predictCard.querySelectorAll<HTMLButtonElement>('[data-opt]')];
    let picked = !!s0.pred;
    const reveal = (): void => {
      // Unblur directly so reloads never depend on CodeTabs sibling module init order.
      for (const wrap of root.querySelectorAll<HTMLElement>('[data-static-code]')) {
        wrap.classList.remove('hide-hints');
        const btn = wrap.querySelector<HTMLButtonElement>('[data-hints-toggle]');
        if (btn && btn.dataset.hide) btn.textContent = btn.dataset.hide;
      }
      document.dispatchEvent(new CustomEvent('codetabs:hints', { detail: { hidden: false } }));
    };
    if (picked) {
      for (const [j, b] of pBtns.entries()) {
        b.disabled = true;
        if (j === p.answer) b.classList.add('right');
      }
      if (pfb) {
        pfb.className = 'fb good';
        pfb.innerHTML = '<strong>' + T('Predicted.') + '</strong> ' + md(p.explain);
      }
      reveal();
    }
    for (const [oi, btn] of pBtns.entries()) {
      btn.addEventListener('click', () => {
        if (picked) return;
        picked = true;
        st(k).pred = true;
        save();
        for (const [j, b] of pBtns.entries()) {
          b.disabled = true;
          if (j === p.answer) b.classList.add('right');
        }
        if (oi !== p.answer) btn.classList.add('wrong');
        if (pfb) {
          pfb.className = 'fb ' + (oi === p.answer ? 'good' : 'bad');
          pfb.innerHTML = '<strong>' + T(oi === p.answer ? 'Correct.' : 'Not quite.') + '</strong> ' + md(p.explain);
        }
        reveal();
      });
    }
  }

  drawTracker();
  root.setAttribute('data-hydrated', '');

  // The lesson's lab: import only the module that defines it (plus Indonesian lab captions on /id/).
  const vizEl = root.querySelector<HTMLElement>('[data-viz]');
  if (vizEl && data.viz) {
    const dict = getLang() === 'id' ? import('../data/id/index.ts').then((m) => m.loadIdUi()) : Promise.resolve();
    Promise.all([loadViz(data.viz), dict])
      .then(([lab]) => lab?.mount(vizEl))
      .catch((e: unknown) => {
        vizEl.textContent = String(e);
      });
  }
}
