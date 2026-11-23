// Track overview hydration: progress bar, per-level percentages, lesson dots, and Beginner placement quiz.
// Only loads this track's Beginner quiz JSON embedded in #track-placement-data.
import { confirmDialog, h, md } from '../lib/dom.ts';
import { registerUiDict, t as T } from '../lib/i18n.ts';
import { shuffle } from '../lib/icons.ts';
import { trackPctIndex } from '../lib/progress.ts';
import { notifyStateChange, peek, st, subscribeState, touch } from '../lib/state.ts';

const page = document.querySelector('[data-track]');
let placementData = null;
try {
  placementData = JSON.parse(document.getElementById('track-placement-data')?.textContent || 'null');
} catch {
  placementData = null;
}

if (placementData?.i18n) {
  registerUiDict(placementData.i18n);
}

const openBtn = page?.querySelector('[data-placement-open]');
const noteEl = page?.querySelector('[data-placement-note]');
const panel = page?.querySelector('[data-placement-panel]');

const allBeginnerDone = () => {
  if (!placementData?.beginnerLessons?.length) return false;
  return placementData.beginnerLessons.every((bl) => {
    const s = peek(`${placementData.trackId}/${bl.id}`);
    return Boolean(s.read && s.quiz);
  });
};

const draw = () => {
  if (!page) return;
  const id = page.dataset.track || '';
  const pct = trackPctIndex(id);
  const bar = page.querySelector('[data-track-bar]');
  if (bar) {
    bar.setAttribute('aria-label', `${bar.dataset.label} ${pct}%`);
    const fill = bar.querySelector('i');
    if (fill) fill.style.width = pct + '%';
  }
  for (const el of page.querySelectorAll('[data-level-pct]')) {
    el.textContent = trackPctIndex(id, Number(el.dataset.levelPct)) + '%';
  }
  for (const row of page.querySelectorAll('[data-k]')) {
    const s = peek(row.dataset.k || '');
    const flags = [s.read, s.quiz, s.teach];
    for (const [i, dot] of [...row.querySelectorAll('.dots i')].entries()) {
      dot.classList.toggle('on', !!flags[i]);
    }
  }
  if (noteEl && placementData?.beginnerLessons?.length) {
    noteEl.textContent = T(
      allBeginnerDone()
        ? 'All Beginner lessons are already checked off. You can still retake the placement quiz anytime.'
        : 'Already know the basics? Score 80% or higher to mark Beginner Learn & Check complete.',
    );
  }
};

draw();
subscribeState(draw);

// Sample up to 6 questions evenly across this track's Beginner lessons (round-robin).
function samplePlacementQuestions(beginnerLessons, maxQuestions = 6) {
  const buckets = beginnerLessons.map((bl) => ({
    lessonId: bl.id,
    lessonTitle: bl.title,
    items: shuffle(bl.quiz || []),
  }));
  const picked = [];
  let added = true;
  while (picked.length < maxQuestions && added) {
    added = false;
    for (const b of buckets) {
      if (picked.length >= maxQuestions) break;
      const next = b.items.shift();
      if (next) {
        picked.push({ lessonId: b.lessonId, lessonTitle: b.lessonTitle, q: next });
        added = true;
      }
    }
  }
  return picked;
}

if (page && openBtn && panel && placementData?.beginnerLessons?.length) {
  const closeQuiz = () => {
    panel.hidden = true;
    panel.replaceChildren();
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
  };

  const launchQuiz = () => {
    const items = samplePlacementQuestions(placementData.beginnerLessons, 6).map((entry) => ({
      ...entry,
      options: shuffle(entry.q.a.map((text, idx) => ({ text, ok: idx === entry.q.c }))),
    }));
    const answers = new Array(items.length).fill(-1);
    const warnEl = h('p', { class: 'fb bad', role: 'alert', hidden: true });
    const summaryEl = h('div', { class: 'empty placement-summary', role: 'status', hidden: true });

    const qControls = items.map((item, qi) => {
      const fb = h('p', { class: 'fb', 'aria-live': 'polite' });
      const labels = item.options.map((opt, oi) => {
        const radio = h('input', {
          type: 'radio',
          name: `placement-q-${qi}`,
          value: String(oi),
          onchange: () => {
            answers[qi] = oi;
            warnEl.hidden = true;
          },
        });
        const lbl = h('label', { class: 'opt placement-opt' }, radio, h('span', { html: md(opt.text) }));
        return { lbl, radio, ok: opt.ok };
      });
      const fs = h(
        'fieldset',
        { class: 'q placement-q' },
        h('legend', { class: 'q-text' }, `${qi + 1}. `, h('span', { html: md(item.q.q) })),
        h('p', { class: 'eyebrow' }, item.lessonTitle),
        h('div', { class: 'opts' }, labels.map((x) => x.lbl)),
        fb,
      );
      return { item, fs, labels, fb };
    });

    const submitBtn = h('button', { type: 'submit', class: 'btn', 'data-placement-submit': '' }, 'Submit placement quiz');
    const form = h(
      'form',
      {
        onsubmit: (e) => {
          e.preventDefault();
          const firstMissing = answers.findIndex((a) => a < 0);
          if (firstMissing >= 0) {
            warnEl.textContent = T('Answer all questions before submitting.');
            warnEl.hidden = false;
            qControls[firstMissing].labels[0]?.radio.focus();
            return;
          }
          warnEl.hidden = true;
          submitBtn.disabled = true;

          let correct = 0;
          qControls.forEach(({ item, labels, fb }, qi) => {
            const chosen = answers[qi];
            const isRight = Boolean(labels[chosen]?.ok);
            if (isRight) correct++;
            labels.forEach(({ lbl, radio, ok }, oi) => {
              radio.disabled = true;
              if (ok) lbl.classList.add('right');
              else if (oi === chosen) lbl.classList.add('wrong');
            });
            fb.className = 'fb ' + (isRight ? 'good' : 'bad');
            fb.innerHTML = '<strong>' + T(isRight ? 'Correct.' : 'Not quite.') + '</strong> ' + md(item.q.why);
          });

          const pctScore = Math.round((correct / items.length) * 100);
          const passed = pctScore >= 80;
          const applyBtn = passed
            ? h(
                'button',
                {
                  type: 'button',
                  class: 'btn',
                  'data-placement-apply': '',
                  onclick: async () => {
                    const ok = await confirmDialog(
                      T(
                        'Mark all {n} Beginner lessons in {track} as Learned and Checked? Teach-Back stays unchecked so you can still write your own explanations.',
                        { n: placementData.beginnerLessons.length, track: placementData.trackName },
                      ),
                      { title: 'Test out of Beginner', confirmText: 'Mark Beginner lessons complete', danger: false },
                    );
                    if (!ok) return;
                    for (const bl of placementData.beginnerLessons) {
                      const entry = st(`${placementData.trackId}/${bl.id}`);
                      entry.read = true;
                      entry.quiz = true;
                    }
                    touch();
                    notifyStateChange('study');
                    draw();
                    applyBtn.disabled = true;
                    summaryEl.replaceChildren(
                      h('strong', {}, T('Placement score: {correct} / {total} ({pct}%)', { correct, total: items.length, pct: pctScore })),
                      h('p', { class: 'ok' }, 'Beginner lessons marked Learned and Checked. Teach-Back remains open for your own notes.'),
                      h(
                        'div',
                        { class: 'actions' },
                        h('button', { type: 'button', class: 'btn ghost', onclick: closeQuiz }, 'Close placement quiz'),
                      ),
                    );
                  },
                },
                'Mark Beginner lessons complete',
              )
            : null;

          summaryEl.hidden = false;
          summaryEl.replaceChildren(
            h('strong', {}, T('Placement score: {correct} / {total} ({pct}%)', { correct, total: items.length, pct: pctScore })),
            h(
              'p',
              {},
              passed
                ? T(
                    'You passed! You can mark all Beginner lessons in {track} as Learned and Checked (Teach-Back stays unchecked so you can still write your own explanations).',
                    { track: placementData.trackName },
                  )
                : 'Score at least 80% to test out of Beginner. Review the explanations above or start with the first Beginner lesson.',
            ),
            h(
              'div',
              { class: 'actions' },
              applyBtn,
              h('button', { type: 'button', class: 'btn ghost', onclick: launchQuiz }, 'Retake quiz'),
              h('button', { type: 'button', class: 'btn ghost', onclick: closeQuiz }, 'Close placement quiz'),
            ),
          );
          summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
      },
      h(
        'div',
        { class: 'placement-head' },
        h('h2', {}, 'Beginner placement quiz'),
        h('button', { type: 'button', class: 'btn sm ghost', onclick: closeQuiz }, 'Close placement quiz'),
      ),
      h('p', { class: 'muted' }, T('Answer {n} questions from Beginner lessons. Score 80% or higher to test out of Beginner Learn & Check.', { n: items.length })),
      ...qControls.map((c) => c.fs),
      warnEl,
      h('div', { class: 'actions' }, submitBtn),
      summaryEl,
    );

    panel.replaceChildren(form);
    panel.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  openBtn.addEventListener('click', () => {
    if (!panel.hidden) {
      closeQuiz();
    } else {
      launchQuiz();
    }
  });
}
