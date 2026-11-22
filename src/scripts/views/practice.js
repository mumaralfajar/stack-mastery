// Flashcard review and mock exam views (client-rendered; they need every lesson's quiz questions).
import { h, md } from '../../lib/dom.ts';
import { getAllTracks, getLevels, t as T } from '../../lib/i18n.ts';
import { href, lessonHref, quizItem, shuffle } from '../../lib/icons.ts';
import { S, allCards, allLessons, day, dueCards, notifyStateChange, peek, touch } from '../../lib/state.ts';

const GAPS = [1, 2, 4, 8, 16];

export function review() {
  const tracks = getAllTracks();
  const trackSel = h(
    'select',
    { 'aria-label': 'Filter by track' },
    [['', 'All tracks'], ...tracks.map((t) => [t.id, t.name])].map(([v, n]) => h('option', { value: v }, n)),
  );
  const stage = h('div', {});
  const page = h(
    'div',
    { class: 'page' },
    h(
      'header',
      { class: 'head' },
      h('p', { class: 'eyebrow' }, 'Spaced repetition'),
      h('h1', {}, 'Flashcard review'),
      h(
        'p',
        { class: 'lede' },
        'Questions from learned lessons and missed quizzes return after 1, 2, 4, 8, and 16 days. Say your answer out loud before revealing it.',
      ),
    ),
    h('div', { class: 'actions' }, trackSel),
    stage,
  );
  let queue = [];
  let n = 0;
  let got = 0;
  const resetQueue = () => {
    const tid = trackSel.value;
    queue = shuffle(dueCards().filter((c) => !tid || c.t.id === tid)).slice(0, 20);
    n = 0;
    got = 0;
    show();
  };
  trackSel.onchange = resetQueue;
  const show = () => {
    if (!queue.length) {
      return stage.replaceChildren(
        h(
          'div',
          { class: 'empty' },
          h('strong', {}, 'Nothing due.'),
          h(
            'p',
            {},
            allLessons().some((e) => peek(e.k).read)
              ? "You're caught up. Come back tomorrow, or try a mock exam."
              : 'Mark a lesson as learned and its questions will appear here.',
          ),
        ),
      );
    }
    if (n >= queue.length) {
      notifyStateChange('study');
      return stage.replaceChildren(
        h(
          'div',
          { class: 'empty' },
          h('strong', {}, T('Session complete: {got} of {n} recalled.', { got, n: queue.length })),
          h('p', {}, 'Missed cards return tomorrow.'),
          h('a', { class: 'btn', href: href('/dashboard/') }, 'Back to dashboard'),
        ),
      );
    }
    const c = queue[n];
    const nextBox = Math.min((S.cards[c.id]?.box || 0) + 1, 5);
    const nextGap = GAPS[nextBox - 1];
    const back = h(
      'div',
      { class: 'fc-back', hidden: true },
      h('p', { class: 'fc-a', html: md(c.q.a[c.q.c]) }),
      h('p', { html: md(c.q.why) }),
      h(
        'div',
        { class: 'actions' },
        h('button', { type: 'button', class: 'btn ghost', onclick: () => grade(false) }, T('Missed ({d}d)', { d: 1 })),
        h('button', { type: 'button', class: 'btn', onclick: () => grade(true) }, T('Got it ({d}d)', { d: nextGap })),
      ),
    );
    const reveal = h(
      'button',
      {
        type: 'button',
        class: 'btn',
        onclick: () => {
          back.hidden = false;
          reveal.hidden = true;
        },
      },
      'Show answer',
    );
    const grade = (ok) => {
      const box = ok ? nextBox : 1;
      S.cards[c.id] = { box, due: day(ok ? nextGap : 1) };
      if (ok) got++;
      n++;
      touch();
      show();
    };
    stage.replaceChildren(
      h(
        'div',
        { class: 'flash', style: { '--tc': `var(--${c.t.id})` } },
        h('p', { class: 'eyebrow' }, `${n + 1} / ${queue.length} · `, h('a', { href: lessonHref(c.t, c.l) }, c.t.name + ' · ' + c.l.title)),
        h('p', { class: 'fc-q', html: md(c.q.q) }),
        reveal,
        back,
      ),
    );
  };
  resetQueue();
  return page;
}

export function exam() {
  const tracks = getAllTracks();
  const levels = getLevels();
  const page = h(
    'div',
    { class: 'page' },
    h(
      'header',
      { class: 'head' },
      h('p', { class: 'eyebrow' }, 'Prove it'),
      h('h1', {}, 'Mock exam'),
      h('p', { class: 'lede' }, 'Ten random questions, one attempt each. Use it to find the lessons you cannot yet teach.'),
    ),
  );
  const sel = (opts, label) => h('select', { 'aria-label': label }, opts.map(([v, n]) => h('option', { value: v }, n)));
  const ts = sel([['', 'All tracks'], ...tracks.map((t) => [t.id, t.name])], 'Filter by track');
  const ls = sel([['', 'All levels'], ...levels.map((n, i) => [i, n])], 'Filter by level');
  const stage = h('div', {});
  const start = () => {
    const pool = shuffle(
      allCards().filter((c) => (!ts.value || c.t.id === ts.value) && (ls.value === '' || c.l.level === +ls.value)),
    ).slice(0, 10);
    if (!pool.length) {
      return stage.replaceChildren(
        h(
          'div',
          { class: 'empty', role: 'status' },
          h('strong', {}, 'No questions match these filters.'),
          h('p', {}, 'Pick another track or level, or choose All levels.'),
        ),
      );
    }
    let answered = 0;
    let right = 0;
    const missed = new Map();
    const result = h('div', { class: 'empty', hidden: true });
    stage.replaceChildren(
      ...pool.map((c, i) =>
        h(
          'div',
          { class: 'exam-q', style: { '--tc': `var(--${c.t.id})` } },
          h('p', { class: 'eyebrow' }, `${T('Question')} ${i + 1} · ${c.t.name} · ${levels[c.l.level]}`),
          quizItem(c.q, {
            once: true,
            onResult: (ok) => {
              answered++;
              if (ok) right++;
              else missed.set(c.t.id + c.l.id, c);
              if (answered === pool.length) {
                result.hidden = false;
                result.replaceChildren(
                  h('strong', {}, `${T('Score:')} ${right} / ${pool.length}`),
                  missed.size
                    ? h(
                        'p',
                        {},
                        'Revisit: ',
                        [...missed.values()].map((m, j) => [j ? ', ' : '', h('a', { href: lessonHref(m.t, m.l) }, m.l.title)]),
                      )
                    : h('p', {}, 'Clean sweep. Raise the level.'),
                );
                result.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            },
          }),
        ),
      ),
      result,
    );
  };
  page.append(h('div', { class: 'actions' }, ts, ls, h('button', { type: 'button', class: 'btn', onclick: start }, 'Start exam')), stage);
  return page;
}
