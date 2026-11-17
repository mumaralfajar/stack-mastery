import { S, track, key, peek, st, pct, save, touch, day } from '../state.js';
import { chip, dots, bar, section, lessonHref, quizItem } from '../icons.js';
import { renderNav } from '../nav.js';
import { dashboard } from './dashboard.js';

const RUBRIC = [
  'Plain words — no jargon I did not define first',
  'An analogy or a picture',
  'A concrete code example',
  'A common mistake, and why people make it',
  'I could answer “but why?” twice in a row'
];

export function trackView(id) {
  const { h, t: T, LEVELS } = window;
  const t = track(id); if (!t) return dashboard();
  return h('div', { class: 'page', style: { '--tc': `var(--${t.id})` } },
    h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Track'), h('h1', {}, t.name), h('p', { class: 'lede' }, t.tagline), bar(pct(t), t.name)),
    LEVELS.map((name, lvl) => {
      const ls = t.lessons.filter(l => l.level === lvl);
      return section(h('span', {}, name, ' ', h('small', {}, pct(t, lvl) + '%')),
        h('div', { class: 'rows' }, ls.map(l => h('a', { class: 'row', href: lessonHref(t, l) },
          dots(key(t, l)), h('span', { class: 'row-t' }, l.title),
          l.viz ? chip('interactive', 'viz-chip') : null, h('small', {}, l.mins + ' ' + T('min'))))));
    }));
}

export function lessonView(tid, lid) {
  const { h, md, codeBlock, t: T, LEVELS, VIZ } = window;
  const t = track(tid), l = t && t.lessons.find(x => x.id === lid);
  if (!l) return dashboard();
  const k = key(t, l), idx = t.lessons.indexOf(l), prev = t.lessons[idx - 1], nxt = t.lessons[idx + 1];
  const tracker = h('div', { class: 'tracker' });
  const drawTracker = () => {
    const s = peek(k);
    tracker.replaceChildren(...[['read', 'Learn'], ['quiz', 'Check'], ['teach', 'Teach']].map(([f, n], i) =>
      h('span', { class: 'tstep' + (s[f] ? ' on' : '') }, h('i', {}, s[f] ? '✓' : i + 1), n)));
    renderNav();
  };
  const set = (f, v) => { st(k)[f] = v; touch(); drawTracker(); };

  // Learn
  const readBtn = h('button', { type: 'button', class: 'btn', onclick: () => { set('read', !peek(k).read); drawRead(); } });
  const drawRead = () => { readBtn.textContent = T(peek(k).read ? '✓ Learned — click to undo' : 'Mark as learned'); readBtn.classList.toggle('done', !!peek(k).read); };
  drawRead();

  // Check
  const results = l.quiz.map(() => false);
  const quiz = h('div', {}, l.quiz.map((q, i) => quizItem(q, {
    onResult: () => { results[i] = true; if (results.every(Boolean)) set('quiz', true); },
    onMiss: () => { S.cards[k + '#' + i] = { box: 1, due: day() }; save(); }   // a missed question goes straight into today's review
  })));

  // Teach
  const s0 = peek(k);
  const rub = (s0.rubric || []).slice();
  const notes = h('textarea', { rows: 7, placeholder: 'Write it the way you would say it out loud to a beginner…', 'aria-label': 'Your explanation', oninput: e => { st(k).notes = e.target.value; save(); } });
  notes.value = s0.notes || '';
  const rubric = h('div', { class: 'rubric' }, RUBRIC.map((text, i) => {
    const cb = h('input', { type: 'checkbox', onchange: e => { rub[i] = e.target.checked; st(k).rubric = rub; set('teach', RUBRIC.every((_, j) => rub[j])); } });
    cb.checked = !!rub[i];
    return h('label', {}, cb, h('span', {}, text));
  }));

  let vizEl = null;
  if (l.viz && VIZ[l.viz]) { vizEl = h('div', { class: 'viz' }); VIZ[l.viz].mount(vizEl); }
  const playLink = t.id === 'sql' ? h('a', { class: 'btn ghost', href: '#/play/sql' }, 'Open SQL playground')
    : t.id === 'css' ? h('a', { class: 'btn ghost', href: '#/play/css' }, 'Open CSS playground')
    : t.id === 'react' ? h('a', { class: 'btn ghost', href: '#/play/ts' }, 'Open TypeScript playground')
    : t.id === 'flutter' ? h('a', { class: 'btn ghost', href: '#/play/dart/' + l.id }, 'Open Dart + Flutter playground') : null;

  const page = h('div', { class: 'page lesson', style: { '--tc': `var(--${t.id})` } },
    h('header', { class: 'head' },
      h('p', { class: 'eyebrow' }, h('a', { href: `#/track/${t.id}` }, t.name), ' · ', LEVELS[l.level], ' · ', l.mins + ' ' + T('min')),
      h('h1', {}, l.title), tracker),
    section('Why this matters', h('p', { class: 'why', html: md(l.why) })),
    section('Key ideas', h('ul', { class: 'points' }, l.points.map(p => h('li', { html: md(p) })))),
    l.code ? section('See it in code', codeBlock(l.code, l.lang || t.lang)) : null,
    vizEl ? section(T('Play with it: ') + T(VIZ[l.viz].title), h('p', { class: 'muted' }, VIZ[l.viz].desc), vizEl) : null,
    section('Your turn', h('p', { html: md(l.practice) }), h('div', { class: 'actions' }, readBtn, playLink)),
    section('Check yourself', quiz),
    h('section', { class: 'sec teach' },
      h('h2', {}, 'Now teach it'),
      h('p', { class: 'prompt', html: md(l.teach) }),
      notes,
      h('p', { class: 'muted' }, 'Grade your explanation honestly. All five ticks complete the Teach step.'),
      rubric,
      h('details', {}, h('summary', {}, 'Teacher notes: analogy and misconceptions'),
        h('h3', {}, 'An analogy that works'), h('p', { html: md(l.analogy) }),
        h('h3', {}, 'Misconceptions to expect'), h('ul', { class: 'points' }, l.pitfalls.map(p => h('li', { html: md(p) }))),
        h('p', {}, h('a', { href: `#/plan/${t.id}/${l.id}` }, 'Open the printable lesson plan →')))),
    h('div', { class: 'pager' },
      prev ? h('a', { href: lessonHref(t, prev) }, '← ' + prev.title) : h('span'),
      nxt ? h('a', { href: lessonHref(t, nxt) }, nxt.title + ' →') : h('a', { href: `#/track/${t.id}` }, 'Back to track →')));
  drawTracker();
  return page;
}

export function planView(tid, lid) {
  const { h, md, codeBlock, t: T, LEVELS } = window;
  const t = track(tid), l = t && t.lessons.find(x => x.id === lid);
  if (!l) return dashboard();
  const block = (time, title, ...kids) => h('section', { class: 'plan-b' }, h('h2', {}, title, ' ', h('small', {}, time)), ...kids);
  return h('div', { class: 'page plan', style: { '--tc': `var(--${t.id})` } },
    h('header', { class: 'head' },
      h('p', { class: 'eyebrow' }, 'Lesson plan · ', t.name, ' · ', LEVELS[l.level]),
      h('h1', {}, l.title),
      h('div', { class: 'actions no-print' }, h('button', { type: 'button', class: 'btn', onclick: () => print() }, 'Print'), h('a', { class: 'btn ghost', href: lessonHref(t, l) }, 'Back to lesson'))),
    block('', 'Objective', h('p', { html: md(l.why) })),
    block('5 min', 'Hook', h('p', { html: md(l.analogy) })),
    block('10 min', 'Explain — one idea at a time', h('ul', { class: 'points' }, l.points.map(p => h('li', { html: md(p) })))),
    l.code ? block('10 min', 'Live demo — type it, have students predict each line before you run it', codeBlock(l.code, l.lang || t.lang)) : null,
    block('15 min', 'Guided practice — students type, you watch', h('p', { html: md(l.practice) })),
    block('5 min', 'Check for understanding', h('ol', {}, l.quiz.map(q => h('li', {}, h('span', { html: md(q.q) }), h('br'), h('small', { html: T('Answer: ') + md(q.a[q.c]) + ' — ' + md(q.why) }))))),
    block('', 'Watch for these misconceptions', h('ul', { class: 'points' }, l.pitfalls.map(p => h('li', { html: md(p) })))),
    block('2 min', 'Exit ticket — the student explains back', h('p', { html: md(l.teach) })));
}
