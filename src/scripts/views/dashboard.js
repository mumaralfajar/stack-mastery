import { allLessons, score, key, pct, overall, streak, dueCards } from '../state.js';
import { ico, dots, bar, ring, section, lessonHref } from '../icons.js';

export function dashboard() {
  const { h, t: T, TRACKS, LEVELS, INTERVIEW } = window;
  const all = allLessons();
  const mastered = all.filter(e => score(e.k) === 3).length;
  const next = TRACKS.map(t => ({ t, l: t.lessons.find(l => score(key(t, l)) < 3) })).filter(x => x.l)
    .sort((x, y) => x.l.level - y.l.level || pct(x.t) - pct(y.t));
  const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, n), h('span', {}, label));
  return h('div', { class: 'page' },
    h('header', { class: 'hero' },
      h('div', {},
        h('p', { class: 'eyebrow' }, 'Beginner → Expert → Teacher'),
        h('h1', {}, 'Learn it. Prove it. Teach it.'),
        h('p', { class: 'lede' }, 'Seven stack tracks — C#, ASP.NET Core, SQL, CSS with Tailwind, TypeScript with React, Angular, and Dart with Flutter — plus computer-science fundamentals, each from first principles to expert level. A lesson only counts as mastered once you can explain it to someone else.'),
        overall() === 0 ? h('p', {}, h('a', { class: 'btn', href: '#/start' }, 'New here? Set up your machine first →')) : null),
      ring(overall())),
    h('div', { class: 'stats' }, stat(streak(), 'day streak'), stat(dueCards().length, 'cards due'), stat(mastered, 'lessons mastered'), stat(all.length, 'lessons total')),
    next.length ? section('Continue where you left off', h('div', { class: 'grid' }, next.map(({ t, l }) =>
      h('a', { class: 'card go', href: lessonHref(t, l), style: { '--tc': `var(--${t.id})` } },
        ico(t.id, 'card-ico'),
        h('span', { class: 'card-k' }, t.name + ' · ' + LEVELS[l.level]), h('strong', {}, l.title), dots(key(t, l)))))) : null,
    section('Tracks', h('div', { class: 'grid' }, TRACKS.map(t =>
      h('a', { class: 'card track-card', href: `#/track/${t.id}`, style: { '--tc': `var(--${t.id})` } },
        ico(t.id, 'card-ico'),
        h('strong', {}, t.name), h('p', {}, t.tagline),
        h('div', { class: 'lvls' }, LEVELS.map((n, i) => h('div', {}, h('span', {}, n), bar(pct(t, i), n)))))))),
    section('Get hired',
      h('a', { class: 'card go', href: '#/interview' },
        ico('interview', 'card-ico'),
        h('span', { class: 'card-k' }, `${T('Interview readiness')} ${INTERVIEW.readiness()}%`), h('strong', {}, 'Interview preparation'),
        h('p', {}, 'Auto-judged coding problems, system design cases, a behavioral story bank, rapid-fire stack questions and timed mock interviews with a hiring rubric.'), bar(INTERVIEW.readiness(), 'Interview readiness'))),
    section('How a lesson works',
      h('ol', { class: 'steps' },
        h('li', {}, h('b', {}, 'Learn'), ' — read the key ideas, study the code, play with the visualization.'),
        h('li', {}, h('b', {}, 'Check'), ' — answer the questions. A question you miss goes straight into your flashcard review; once you mark the lesson learned, all its questions join it.'),
        h('li', {}, h('b', {}, 'Teach'), ' — write the explanation you would give a beginner, then grade it against the rubric. This is the step that turns knowing into teaching.'))),
    section('Suggested order',
      h('p', {}, 'Work level by level across the tracks rather than finishing one track first — the stack only makes sense together.'),
      h('ol', { class: 'steps' },
        h('li', {}, h('b', {}, 'Beginner: '), 'C# → CS Fundamentals (Git, Big-O) → SQL → ASP.NET Core → CSS → TypeScript + React → Angular → Dart + Flutter, then build Capstone 1.'),
        h('li', {}, h('b', {}, 'Intermediate: '), 'same order, then Capstone 2 — your first real full-stack app.'),
        h('li', {}, h('b', {}, 'Advanced and Expert: '), 'follow whichever capstone requirement you cannot yet explain.'),
        h('li', {}, h('b', {}, 'Alongside, from Intermediate on: '), 'the eight-week interview plan — a few coding problems every week beats cramming.')),
      h('p', {}, h('a', { href: '#/lab/journey' }, 'See how one click travels through the whole stack →'))));
}
