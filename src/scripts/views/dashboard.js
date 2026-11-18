import { allLessons, score, key, peek, pct, overall, streak, dueCards } from '../state.js';
import { ico, dots, bar, ring, section, lessonHref } from '../icons.js';

export function dashboard() {
  const { h, t: T, TRACKS, LEVELS, INTERVIEW } = window;
  const all = allLessons();
  const mastered = all.filter(e => score(e.k) === 3).length;
  const started = TRACKS.filter(t => t.lessons.some(l => score(key(t, l)) > 0 || peek(key(t, l)).read || peek(key(t, l)).quiz || peek(key(t, l)).teach));
  const next = (started.length ? started : TRACKS.slice(0, 1))
    .map(t => ({ t, l: t.lessons.find(l => score(key(t, l)) < 3) }))
    .filter(x => x.l)
    .sort((x, y) => x.l.level - y.l.level || pct(x.t) - pct(y.t));
  const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, n), h('span', {}, label));
  return h('div', { class: 'page' },
    h('header', { class: 'hero' },
      h('div', {},
        h('p', { class: 'eyebrow' }, 'Beginner → Expert → Teacher'),
        h('h1', {}, 'Learn it. Prove it. Teach it.'),
        h('p', { class: 'lede' }, 'Eight stack tracks cover C#, ASP.NET Core, Go, SQL, CSS with Tailwind, TypeScript with React, Angular, and Dart with Flutter, plus CS fundamentals. You finish a lesson once you can teach it.'),
        overall() === 0 ? h('div', { class: 'actions' },
          h('a', { class: 'btn', href: '#/start' }, 'New here? Set up your machine first →'),
          h('a', { class: 'btn ghost', href: '#/lab/journey' }, 'See how one click travels through the whole stack →')) : null),
      ring(overall())),
    h('div', { class: 'stats' }, stat(streak(), 'day streak'), stat(dueCards().length, 'cards due'), stat(mastered, 'lessons mastered'), stat(all.length, 'lessons total')),
    next.length ? section(started.length ? 'Continue where you left off' : 'Recommended first lesson', h('div', { class: 'grid' }, next.map(({ t, l }) =>
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
        h('li', {}, h('b', {}, 'Learn'), ': read the key ideas, study the code, and play with the visualization.'),
        h('li', {}, h('b', {}, 'Check'), ': answer the quiz questions. Missed ones enter flashcard review immediately, and marking a lesson learned adds the rest.'),
        h('li', {}, h('b', {}, 'Teach'), ": write how you'd explain this to a beginner, then score yourself with the rubric."))),
    section('Suggested order',
      h('p', {}, 'Work level by level across tracks instead of finishing one first. The stack clicks best when learned together.'),
      h('ol', { class: 'steps' },
        h('li', {}, h('b', {}, 'Beginner: '), 'C# → CS Fundamentals → SQL → ASP.NET Core → Go → CSS → React → Angular → Flutter, then build Capstone 1.'),
        h('li', {}, h('b', {}, 'Intermediate: '), 'same order, then build Capstone 2 as your first full-stack app.'),
        h('li', {}, h('b', {}, 'Advanced and Expert: '), "follow whichever capstone requirement you can't explain yet."),
        h('li', {}, h('b', {}, 'Alongside, from Intermediate on: '), 'the eight-week interview plan. Steady weekly practice beats cramming.')),
      h('p', {}, h('a', { href: '#/lab/journey' }, 'See how one click travels through the whole stack →'))));
}
