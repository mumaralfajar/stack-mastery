import { LESSON_INDEX } from '../../data/manifest.ts';
import { h } from '../../lib/dom.ts';
import { getLevels, t as T } from '../../lib/i18n.ts';
import { bar, dots, href, ico, lessonHref, ring, section } from '../../lib/icons.ts';
import { dueCountIndex, masteredCountIndex, overallPctIndex, trackPctIndex } from '../../lib/progress.ts';
import { interviewReadiness, key, peek, score, streak } from '../../lib/state.ts';

// `catalog` is the page's pre-rendered track list ({ tracks: [{ id, name, tagline, lessons: [{ id, title, level }] }] }),
// so the dashboard never loads lesson prose; progress comes from the manifest.
export function dashboard(catalog) {
  const tracks = catalog.tracks;
  const levels = getLevels();
  const mastered = masteredCountIndex();
  const overall = overallPctIndex();
  const pct = (t, lvl) => trackPctIndex(t.id, lvl);
  const started = tracks.filter((t) =>
    t.lessons.some((l) => score(key(t, l)) > 0 || peek(key(t, l)).read || peek(key(t, l)).quiz || peek(key(t, l)).teach),
  );
  const next = (started.length ? started : tracks.slice(0, 1))
    .map((t) => ({ t, l: t.lessons.find((l) => score(key(t, l)) < 3) }))
    .filter((x) => x.l)
    .sort((x, y) => x.l.level - y.l.level || pct(x.t) - pct(y.t));
  const readyPct = interviewReadiness();
  const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, n), h('span', {}, label));
  return h(
    'div',
    { class: 'page' },
    h(
      'header',
      { class: 'hero' },
      h(
        'div',
        {},
        h('p', { class: 'eyebrow' }, 'Beginner → Expert → Teacher'),
        h('h1', {}, 'Learn it. Prove it. Teach it.'),
        h(
          'p',
          { class: 'lede' },
          'Nine stack tracks and CS fundamentals cover C#, ASP.NET Core, Go, SQL, CSS with Tailwind, TypeScript with React, Angular, Dart with Flutter, and System Design. You finish a lesson once you can teach it.',
        ),
        overall === 0
          ? h(
              'div',
              { class: 'actions' },
              h('a', { class: 'btn', href: href('/start/') }, 'New here? Set up your machine first →'),
              h('a', { class: 'btn ghost', href: href('/lab/journey/') }, 'See how one click travels through the whole stack →'),
            )
          : null,
      ),
      ring(overall),
    ),
    h(
      'div',
      { class: 'stats' },
      stat(streak(), 'day streak'),
      stat(dueCountIndex(), 'cards due'),
      stat(mastered, 'lessons mastered'),
      stat(LESSON_INDEX.length, 'lessons total'),
    ),
    next.length
      ? section(
          started.length ? 'Continue where you left off' : 'Recommended first lesson',
          h(
            'div',
            { class: 'grid' },
            next.map(({ t, l }) =>
              h(
                'a',
                { class: 'card go', href: lessonHref(t, l), style: { '--tc': `var(--${t.id})` } },
                ico(t.id, 'card-ico'),
                h('span', { class: 'card-k' }, t.name + ' · ' + levels[l.level]),
                h('strong', {}, l.title),
                dots(key(t, l)),
              ),
            ),
          ),
        )
      : null,
    section(
      'Tracks',
      h(
        'div',
        { class: 'grid' },
        tracks.map((t) =>
          h(
            'a',
            { class: 'card track-card', href: href(`/track/${t.id}/`), style: { '--tc': `var(--${t.id})` } },
            ico(t.id, 'card-ico'),
            h('strong', {}, t.name),
            h('p', {}, t.tagline),
            h('div', { class: 'lvls' }, levels.map((n, i) => h('div', {}, h('span', {}, n), bar(pct(t, i), n)))),
          ),
        ),
      ),
    ),
    section(
      'Get hired',
      h(
        'a',
        { class: 'card go', href: href('/interview/') },
        ico('interview', 'card-ico'),
        h('span', { class: 'card-k' }, `${T('Interview readiness')} ${readyPct}%`),
        h('strong', {}, 'Interview preparation'),
        h(
          'p',
          {},
          'Auto-judged coding problems, system design cases, a behavioral story bank, rapid-fire stack questions and timed mock interviews with a hiring rubric.',
        ),
        bar(readyPct, 'Interview readiness'),
      ),
    ),
    section(
      'How a lesson works',
      h(
        'ol',
        { class: 'steps' },
        h('li', {}, h('b', {}, 'Learn'), ': read the key ideas, study the code, and play with the visualization.'),
        h(
          'li',
          {},
          h('b', {}, 'Check'),
          ': answer the quiz questions. Missed ones enter flashcard review immediately, and marking a lesson learned adds the rest.',
        ),
        h(
          'li',
          {},
          h('b', {}, 'Teach'),
          ": write how you'd explain this to a beginner, then score yourself with the rubric.",
        ),
      ),
    ),
    section(
      'Suggested order',
      h('p', {}, 'Work level by level across tracks instead of finishing one first. The stack clicks best when learned together.'),
      h(
        'ol',
        { class: 'steps' },
        h(
          'li',
          {},
          h('b', {}, 'Beginner: '),
          'C# → CS Fundamentals → SQL → ASP.NET Core → Go → CSS → React → Angular → Flutter, then build Capstone 1.',
        ),
        h(
          'li',
          {},
          h('b', {}, 'Intermediate: '),
          'same order plus System Design, then build Capstone 2 as your first full-stack app.',
        ),
        h(
          'li',
          {},
          h('b', {}, 'Advanced and Expert: '),
          "follow whichever capstone requirement you can't explain yet.",
        ),
        h(
          'li',
          {},
          h('b', {}, 'Alongside, from Intermediate on: '),
          'the eight-week interview plan. Steady weekly practice beats cramming.',
        ),
      ),
      h('p', {}, h('a', { href: href('/lab/journey/') }, 'See how one click travels through the whole stack →')),
    ),
    section(
      'Take a breather',
      h(
        'a',
        { class: 'card go', href: href('/break/'), style: { '--tc': 'var(--csharp)' } },
        ico('break', 'card-ico'),
        h('span', { class: 'card-k' }, T('Frieren’s Grimoire Sanctuary')),
        h('strong', {}, T('Break room: Field of Flowers Magic')),
        h(
          'p',
          {},
          T(
            'Step into a living alpine meadow. Cast Flamme’s flower-blooming spell, weave mana sigils, summon glowing butterflies, and shift the sky from sunlit breeze to blue-moon aurora.',
          ),
        ),
      ),
    ),
  );
}
