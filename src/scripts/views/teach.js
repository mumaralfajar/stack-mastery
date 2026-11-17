import { S, touch, track, allLessons } from '../state.js';
import { chip, section, lessonHref } from '../icons.js';

export function projects() {
  const { h, md, PROJECTS, LEVELS } = window;
  return h('div', { class: 'page' },
    h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Build to learn'), h('h1', {}, 'Capstone projects'),
      h('p', { class: 'lede' }, 'One project per level, each using the whole stack. Nothing here is copy-paste: build them in your own editor, and tick a requirement only when you could rebuild it without notes.')),
    PROJECTS.map((p, pi) => {
      const done = S.projects[pi] || [];
      const prog = h('small', {});
      const draw = () => prog.textContent = `${p.build.filter((_, i) => done[i]).length} / ${p.build.length}`;
      draw();
      return h('section', { class: 'sec proj' },
        h('h2', {}, chip(LEVELS[p.level]), ' ', p.title, ' ', prog),
        h('p', { html: md(p.brief) }),
        h('div', { class: 'rubric' }, p.build.map((b, i) => {
          const cb = h('input', { type: 'checkbox', onchange: e => { done[i] = e.target.checked; S.projects[pi] = done; touch(); draw(); } });
          cb.checked = !!done[i];
          return h('label', {}, cb, h('span', { html: md(b) }));
        })),
        h('details', {}, h('summary', {}, 'Stretch goals and teaching angle'),
          h('ul', { class: 'points' }, p.stretch.map(s => h('li', { html: md(s) }))),
          h('p', { class: 'prompt', html: md(p.teach) })));
    }));
}

export function teach() {
  const { h, md, TRACKS, LEVELS } = window;
  const ts = h('select', { 'aria-label': 'Track' }, TRACKS.map(t => h('option', { value: t.id }, t.name)));
  const ls = h('select', { 'aria-label': 'Lesson' });
  const fill = () => ls.replaceChildren(...track(ts.value).lessons.map(l => h('option', { value: l.id }, LEVELS[l.level] + ' — ' + l.title)));
  ts.onchange = fill; fill();
  const list = items => h('ul', { class: 'points' }, items.map(i => h('li', { html: md(i) })));
  return h('div', { class: 'page' },
    h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Become the teacher'), h('h1', {}, 'Teaching toolkit'),
      h('p', { class: 'lede' }, 'Knowing a thing and teaching it are different skills. Experts skip steps they no longer notice; teachers put those steps back.')),
    section('Generate a lesson plan',
      h('p', {}, 'Every lesson in this program converts into a 45-minute printable plan: hook, explanation, live demo, practice, checks, and misconceptions to watch for.'),
      h('div', { class: 'actions' }, ts, ls, h('button', { type: 'button', class: 'btn', onclick: () => location.hash = `#/plan/${ts.value}/${ls.value}` }, 'Open plan'))),
    section('Seven rules for teaching programmers', list([
      '**One new idea per step.** If a demo needs three unfamiliar things, teach two of them earlier or hide them.',
      '**Concrete before abstract.** Show a working example first, name the concept second, give the definition last.',
      '**Predict, run, explain.** Before running any line, ask what will happen. A wrong prediction shows exactly which idea is missing, and the correction sticks better than an explanation given up front.',
      '**Their hands on the keyboard.** Watching you type feels like learning and is not. Aim for students typing at least half of the session.',
      '**Errors are the curriculum.** Cause the common error on purpose, read the message together, and fix it. Students who can read errors can teach themselves.',
      '**Ask questions that cannot be answered with yes.** Not “does that make sense?” but “what would this print if I swapped these two lines?”',
      '**Fight the curse of knowledge.** List every term you used. Any term the student did not have yesterday needs a definition or an analogy.'])),
    section('The question ladder', h('p', {}, 'Climb it for any topic. If you can answer all four rungs, you can teach it at any level.'),
      h('ol', { class: 'steps' },
        h('li', {}, h('b', {}, 'What does it do? '), 'Beginner — describe the behavior and show it.'),
        h('li', {}, h('b', {}, 'What happens if…? '), 'Intermediate — predict edge cases and failures.'),
        h('li', {}, h('b', {}, 'Why is it designed this way? '), 'Advanced — name the trade-off and the alternative that was rejected.'),
        h('li', {}, h('b', {}, 'When should you not use it? '), 'Expert — know the limits, the cost, and what to reach for instead.'))),
    section('What each level of student needs', list([
      '**Beginner:** a correct mental model and lots of tiny wins. Hide complexity without lying — say “we will open that box later”.',
      '**Intermediate:** projects slightly too big for them, and feedback on their own code rather than more examples of yours.',
      '**Advanced:** trade-offs. Give two valid designs and make them argue for each one.',
      '**Expert:** internals, measurement and judgement. Stop giving answers; ask for evidence — a benchmark, a query plan, a profiler trace.'])),
    section('A 45-minute session', h('ol', { class: 'steps' },
      h('li', {}, h('b', {}, '0–5 Hook. '), 'A problem or analogy that makes the topic necessary.'),
      h('li', {}, h('b', {}, '5–15 Explain. '), 'Three key ideas at most, each with a picture.'),
      h('li', {}, h('b', {}, '15–25 Live demo. '), 'Type from scratch, make a mistake on purpose, recover out loud.'),
      h('li', {}, h('b', {}, '25–40 Practice. '), 'Students build a variation while you circulate and ask “why?”.'),
      h('li', {}, h('b', {}, '40–45 Exit ticket. '), 'Each student explains the idea back in one or two sentences.'))),
    section('Signs you are ready to teach a topic', list([
      'You can explain it three ways: an analogy, a diagram, and code.',
      'You can name the two mistakes almost every learner makes, before they make them.',
      'You can answer the follow-up to the follow-up question.',
      'You can say what you deliberately left out, and why it is safe to leave out for now.'])));
}

export function searchView() {
  const { h, t: T, LEVELS, IV, VIZ } = window;
  const index = [
    ...allLessons().map(e => ({ kind: e.t.name + ' · ' + LEVELS[e.l.level], title: e.l.title, href: lessonHref(e.t, e.l), text: [e.l.why, ...e.l.points, e.l.practice, ...e.l.pitfalls].join(' ') })),
    ...IV.problems.map(p => ({ kind: 'Coding problem', title: p.title, href: '#/interview/problem/' + p.id, text: p.prompt + ' ' + p.pattern })),
    ...IV.patterns.map(p => ({ kind: 'Coding pattern', title: p.name, href: '#/interview/patterns', text: p.signal })),
    ...IV.design.cases.map(c => ({ kind: 'System design', title: c.title, href: '#/interview/design/' + c.id, text: c.prompt + ' ' + c.deep.map(d => d.join(' ')).join(' ') })),
    ...IV.rapid.flatMap(r => r.qs.map(([q, ans]) => ({ kind: T('Interview Q&A') + ' · ' + r.area, title: q, href: '#/interview/rapid', text: ans }))),
    ...Object.entries(VIZ).map(([id, v]) => ({ kind: 'Visualization', title: T(v.title), href: '#/lab/' + id, text: T(v.desc) }))
  ];
  const plain = s => s.replace(/[`*]/g, '');
  const results = h('div', { class: 'rows', 'aria-live': 'polite' });
  const draw = () => {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return results.replaceChildren(h('p', { class: 'muted' }, T('{n} lessons, problems, questions and visualizations indexed. Try “index”, “async”, “flexbox” or “deadlock”.', { n: index.length })));
    const hits = index.map(it => {
      const title = it.title.toLowerCase(), text = it.text.toLowerCase();
      if (!terms.every(t => title.includes(t) || text.includes(t))) return null;
      return { it, score: terms.reduce((s, t) => s + (title.includes(t) ? 5 : 0) + Math.min(text.split(t).length - 1, 3), 0) };
    }).filter(Boolean).sort((x, y) => y.score - x.score).slice(0, 40);
    results.replaceChildren(...(hits.length ? hits.map(({ it }) => {
      const at = Math.max(it.text.toLowerCase().indexOf(terms[0]), 0), from = Math.max(at - 50, 0);
      return h('a', { class: 'row hit', href: it.href }, h('span', { class: 'row-t' }, h('small', {}, it.kind), h('br'), h('b', {}, plain(it.title)), h('br'),
        h('span', { class: 'muted' }, (from ? '…' : '') + plain(it.text.slice(from, from + 150)) + '…')));
    }) : [h('p', { class: 'muted' }, 'Nothing found. Try a shorter or different word.')]));
  };
  const input = h('input', { type: 'search', class: 'search', placeholder: 'Search lessons, problems, interview questions…', 'aria-label': 'Search', oninput: draw });
  draw();
  setTimeout(() => input.focus());
  return h('div', { class: 'page' }, h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Find anything'), h('h1', {}, 'Search'), input), results);
}

export function startView() {
  const { h, md, codeBlock } = window;
  const step = (title, text, code) => h('section', { class: 'sec' }, h('h2', {}, title), h('p', { html: md(text) }), code ? codeBlock(code, 'sh') : null);
  return h('div', { class: 'page' },
    h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Before lesson one'), h('h1', {}, 'Start here: set up your machine'),
      h('p', { class: 'lede' }, 'Reading is not learning. Every lesson ends with something to build, and that needs a handful of free tools. This takes about twenty minutes, once.')),
    step('1. Install the tools', 'Install the **.NET SDK** (current LTS) from dotnet.microsoft.com, **Node.js LTS** from nodejs.org, **Git** from git-scm.com, and **Visual Studio Code** with the *C# Dev Kit* extension. Then confirm each one answers in a new terminal:', `
dotnet --version
node --version
git --version
code --version`),
    step('2. Your first C# program', 'This is where the C# track’s code goes. Open the folder in VS Code and edit `Program.cs`.', `
dotnet new console -o hello
cd hello
dotnet run`),
    step('3. Your first web API', '`dotnet watch` rebuilds and restarts on every save — keep it running while you work through the ASP.NET Core track.', `
dotnet new webapi -o shop-api
cd shop-api
dotnet watch run`),
    step('4. Your first React + TypeScript app', 'Vite gives you a dev server with instant reload. The last line adds Tailwind for the CSS + Tailwind track.', `
npm create vite@latest shop-web -- --template react-ts
cd shop-web
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev`),
    step('5. Your first Flutter app', 'Install the **Flutter SDK** from flutter.dev — it includes Dart. `flutter doctor` tells you what is still missing for each platform; the web target needs only Chrome, so you can start before setting up Android Studio or Xcode.', `
flutter doctor
flutter create shop_app
cd shop_app
flutter run -d chrome`),
    step('6. A database', 'Start with **SQLite**: no server to install, and the SQL playground in this program already uses it. Add it to an API project with EF Core. Move to SQL Server or PostgreSQL (both free, easiest through Docker) when you reach the Advanced SQL lessons.', `
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet tool install --global dotnet-ef
dotnet ef migrations add Init
dotnet ef database update`),
    step('7. Put everything in Git from day one', 'A commit history is both your safety net and, later, your portfolio. The first lesson of the CS Fundamentals track covers the workflow.', `
git init
git add .
git commit -m "First commit"`),
    h('section', { class: 'sec' }, h('h2', {}, '8. A routine that works'),
      h('ol', { class: 'steps' },
        h('li', {}, h('b', {}, '10 minutes: '), 'flashcard review. Do this first, every day — it is what makes knowledge stay.'),
        h('li', {}, h('b', {}, '30 minutes: '), 'one lesson — learn it, check yourself, then write the teach-back.'),
        h('li', {}, h('b', {}, '30–45 minutes: '), 'build. The lesson’s “Your turn” exercise, then the current capstone.'),
        h('li', {}, h('b', {}, 'Weekly: '), 'one mock exam, and from the Intermediate level three coding problems.')),
      h('p', { class: 'muted' }, 'Progress is stored in this browser only. Use “Export backup” in the sidebar now and then, and before switching browser or computer.')),
    h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/lesson/csharp/types' }, 'Begin with C# lesson one →')));
}
