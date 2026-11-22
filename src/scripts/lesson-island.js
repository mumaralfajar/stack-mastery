// Lesson page islands. The lesson HTML is pre-rendered; this script only wires Predict-first, the quiz with
// spaced-repetition marking, the Teach-back rubric, the Learn/Check/Teach tracker, and the lesson's single lab,
// which is dynamic-imported on its own via loadViz(id) (never every lab module).
import { getLang, registerUiDict, t as T } from '../lib/i18n.ts';
import { md } from '../lib/dom.ts';
import { quizItem } from '../lib/icons.ts';
import { S, day, notifyStateChange, peek, save, st, touch } from '../lib/state.ts';
import { loadViz } from './viz/registry.ts';

const root = document.querySelector('[data-lesson-root]');
let data = null;
try {
  data = JSON.parse(document.getElementById('lesson-data')?.textContent || 'null');
} catch {
  data = null;
}

if (root && data) {
  registerUiDict(data.i18n || {});
  const k = data.key;
  const tracker = root.querySelector('[data-tracker]');

  const drawTracker = () => {
    const s = peek(k);
    for (const [i, step] of [...tracker.querySelectorAll('[data-step]')].entries()) {
      const on = !!s[step.dataset.step];
      step.classList.toggle('on', on);
      const mark = step.querySelector('i');
      if (mark) mark.textContent = on ? '✓' : String(i + 1);
    }
  };
  const set = (f, v) => {
    st(k)[f] = v;
    touch();
    drawTracker();
    notifyStateChange('study');
  };

  // Learn
  const readBtn = root.querySelector('[data-read-toggle]');
  const drawRead = () => {
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
  const qSaved = { ...(s0.q || {}) };
  const results = data.quiz.map((_, i) => !!qSaved[i]);
  const quizHost = root.querySelector('[data-quiz]');
  quizHost?.replaceChildren(
    ...data.quiz.map((q, i) =>
      quizItem(q, {
        solved: !!qSaved[i],
        onResult: () => {
          results[i] = true;
          qSaved[i] = true;
          st(k).q = qSaved;
          save();
          if (results.every(Boolean)) set('quiz', true);
        },
        onMiss: () => {
          S.cards[`${k}#${i}`] = { box: 1, due: day() };
          save();
          notifyStateChange('study');
        },
      }),
    ),
  );

  // Teach: a written explanation is required before the rubric can be ticked.
  const notes = root.querySelector('[data-teach-notes]');
  const teachWarn = root.querySelector('[data-teach-warn]');
  const rub = (s0.rubric || []).slice();
  if (notes) {
    notes.value = s0.notes || '';
    notes.addEventListener('input', () => {
      st(k).notes = notes.value;
      save();
      if (notes.value.trim() && teachWarn) teachWarn.hidden = true;
    });
  }
  const boxes = [...root.querySelectorAll('[data-rubric]')];
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
  const predictCard = root.querySelector('[data-predict]');
  if (predictCard && data.predict) {
    const p = data.predict;
    const pfb = predictCard.querySelector('.fb');
    const pBtns = [...predictCard.querySelectorAll('[data-opt]')];
    let picked = !!s0.pred;
    const reveal = () => document.dispatchEvent(new CustomEvent('codetabs:hints', { detail: { hidden: false } }));
    if (picked) {
      for (const [j, b] of pBtns.entries()) {
        b.disabled = true;
        if (j === p.answer) b.classList.add('right');
      }
      pfb.className = 'fb good';
      pfb.innerHTML = '<strong>' + T('Predicted.') + '</strong> ' + md(p.explain);
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
        pfb.className = 'fb ' + (oi === p.answer ? 'good' : 'bad');
        pfb.innerHTML = '<strong>' + T(oi === p.answer ? 'Correct.' : 'Not quite.') + '</strong> ' + md(p.explain);
        reveal();
      });
    }
  }

  drawTracker();
  root.setAttribute('data-hydrated', '');

  // The lesson's lab: import only the module that defines it (plus Indonesian lab captions on /id/).
  const vizEl = root.querySelector('[data-viz]');
  if (vizEl && data.viz) {
    const dict = getLang() === 'id' ? import('../data/id/index.ts').then((m) => m.loadIdUi()) : Promise.resolve();
    Promise.all([loadViz(data.viz), dict])
      .then(([lab]) => lab?.mount(vizEl))
      .catch((e) => {
        vizEl.textContent = String(e);
      });
  }
}
