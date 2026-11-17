// Interview preparation section: hub, coding arena with an in-browser judge, system design, behavioral, rapid-fire, mocks.
(() => {
  const T = window.t;   // `t` is used as a local name throughout this file
  const KEY = 'stackmastery.interview';
  const fresh = () => ({ solved: {}, code: {}, design: {}, stories: [], rapid: {}, mocks: [], plan: {} });
  let D;
  try { D = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { D = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch { /* private mode */ } };

  const DIFF = ['Easy', 'Medium', 'Hard'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
  const list = items => h('ul', { class: 'points' }, items.map(i => h('li', { html: md(i) })));
  const sec = (title, ...kids) => h('section', { class: 'sec' }, h('h2', {}, title), ...kids);
  const head = (eyebrow, title, lede, ...kids) => h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, eyebrow), h('h1', {}, title), lede ? h('p', { class: 'lede' }, lede) : null, ...kids);
  const crumb = (label) => [h('a', { href: '#/interview' }, 'Interview prep'), ' · ', label];
  const diffChip = d => h('span', { class: 'chip diff-' + d }, DIFF[d]);
  const patternName = id => IV.patterns.find(p => p.id === id).name;
  const bar = p => h('div', { class: 'bar' }, h('i', { style: { width: p + '%' } }));

  // ---------- readiness ----------
  const covered = () => IV.behavioral.filter(t => D.stories.some(s => (s.tags || []).includes(t.id))).length;
  const rapidTotal = IV.rapid.reduce((a, r) => a + r.qs.length, 0);
  function parts() {
    return [
      ['Coding problems solved', Object.keys(D.solved).length, IV.problems.length, '#/interview/coding'],
      ['System design cases mastered', Object.values(D.design).filter(Boolean).length, IV.design.cases.length, '#/interview/design'],
      ['Behavioral themes with a story', covered(), IV.behavioral.length, '#/interview/behavioral'],
      ['Rapid-fire answers rated solid', Object.values(D.rapid).filter(v => v === 2).length, rapidTotal, '#/interview/rapid'],
      ['Mock interviews completed', Math.min(D.mocks.length, 8), 8, '#/interview/mock']
    ];
  }
  const readiness = () => { const p = parts(); return Math.round(p.reduce((a, [, n, t]) => a + n / t, 0) / p.length * 100); };

  // ---------- timer ----------
  function timer(minutes) {
    let left = minutes * 60, id = null;
    const face = h('b', { class: 'timer-face' });
    const draw = () => { face.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); face.classList.toggle('low', left <= 60); };
    const stop = () => { clearInterval(id); id = null; go.textContent = T('Start'); };
    const go = h('button', { type: 'button', class: 'btn sm', onclick: () => {
      if (id) return stop();
      go.textContent = T('Pause');
      id = setInterval(() => { if (!face.isConnected) return stop(); if (left > 0) left--; draw(); if (!left) stop(); }, 1000);
    } }, 'Start');
    draw();
    return h('div', { class: 'timer' }, face, go, h('button', { type: 'button', class: 'btn sm ghost', onclick: () => { stop(); left = minutes * 60; draw(); } }, 'Reset'));
  }

  // ---------- judge: transpile, run in a worker with a time limit ----------
  const canon = v => Array.isArray(v) ? v.map(canon) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canon(v[k])])) : v;
  const key = v => JSON.stringify(canon(v));
  const same = (got, exp, mode) => {
    if (!Array.isArray(got) || !mode) return key(got) === key(exp);
    const n = a => a.map(x => mode === 'nested' && Array.isArray(x) ? key(x.map(key).sort()) : key(x)).sort();
    return key(n(got)) === key(n(exp));
  };
  const show = v => { const s = v === undefined ? 'undefined' : JSON.stringify(v); return s.length > 110 ? s.slice(0, 110) + '…' : s; };

  async function judge(p, code) {
    await PLAY.loadTS();
    const res = window.ts.transpileModule(code, { reportDiagnostics: true, compilerOptions: { target: 'ES2022', module: 'ESNext' } });
    const diag = (res.diagnostics || []).map(d => window.ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    if (diag.length) return { fatal: T('Syntax error: ') + diag.join('; ') };
    const src = `const __logs = []; console.log = (...a) => __logs.push(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
${res.outputText}
;const __f = ${p.call || p.fn};
self.onmessage = e => {
  const out = e.data.map(args => { try { return { got: __f(...args) }; } catch (err) { return { err: String(err) }; } });
  self.postMessage({ out, logs: __logs.slice(0, 40) });
};`;
    const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    const w = new Worker(url);
    return new Promise(resolve => {
      const done = r => { clearTimeout(t); w.terminate(); URL.revokeObjectURL(url); resolve(r); };
      const t = setTimeout(() => done({ fatal: T('Time limit exceeded (4 s) — check for an infinite loop or an exponential algorithm.') }), 4000);
      w.onmessage = e => done(e.data);
      w.onerror = e => { e.preventDefault(); done({ fatal: (e.message || T('Runtime error')).replace(/^Uncaught /, '') }); };
      w.postMessage(p.tests.map(t => t[0]));
    });
  }

  // ---------- problem arena ----------
  function arena(p, { mock } = {}) {
    const out = h('div', { class: 'out', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Run the tests to see results.'));
    const run = async () => {
      out.replaceChildren(h('p', { class: 'muted' }, 'Running…'));
      let r;
      try { r = await judge(p, ta.value); } catch (e) { r = { fatal: String(e.message || e) }; }
      if (r.fatal) return out.replaceChildren(h('p', { class: 'err' }, r.fatal));
      const rows = r.out.map((x, i) => {
        const [args, exp] = p.tests[i], ok = !x.err && same(x.got, exp, p.mode);
        return { ok, el: h('li', { class: ok ? 'pass' : 'fail' }, h('b', {}, ok ? '✓ ' : '✗ '), h('code', {}, show(args).slice(1, -1)),
          ok ? null : h('div', {}, 'expected ', h('code', {}, show(exp)), x.err ? [' — threw ', h('code', {}, x.err)] : [' — got ', h('code', {}, show(x.got))])) };
      });
      const passed = rows.filter(x => x.ok).length, all = passed === rows.length;
      if (all) { D.solved[p.id] = true; save(); }
      out.replaceChildren(
        PLAY.typeNote(ta) || '',
        h('p', { class: all ? 'ok' : 'err' }, all ? T('✓ All {n} tests passed. Now state the time and space complexity out loud.', { n: rows.length }) : T('{passed} of {n} tests passed.', { passed, n: rows.length })),
        h('ul', { class: 'tests' }, rows.map(x => x.el)),
        r.logs.length ? h('div', {}, h('p', { class: 'muted' }, 'console.log output'), h('pre', {}, r.logs.join('\n'))) : null);
    };
    const ta = PLAY.editor(D.code[p.id] || p.starter, run, 'typescript');
    ta.classList.add('tall');
    ta.oninput = () => { D.code[p.id] = ta.value; save(); };
    const help = [
      h('details', {}, h('summary', {}, 'Hint 1'), h('p', {}, p.hints[0])),
      h('details', {}, h('summary', {}, 'Hint 2'), h('p', {}, p.hints[1])),
      h('details', {}, h('summary', {}, 'Solution and complexity'), codeBlock(p.solution, 'ts'),
        IV.cs && IV.cs[p.id] ? [h('p', { class: 'muted', style: { margin: '.8rem 0 .3rem' } }, 'The same solution in C# — compiled and run against these test cases:'), codeBlock(IV.cs[p.id], 'cs')] : null,
        h('p', { style: { marginTop: '.6rem' } }, h('b', {}, 'Complexity: '), p.complexity),
        h('p', { class: 'muted' }, 'Pattern: ', h('a', { href: '#/interview/patterns' }, patternName(p.pattern)))),
      h('details', {}, h('summary', {}, 'Interviewer follow-ups'), list(p.follow))
    ];
    return h('div', { class: 'play' },
      h('div', {},
        h('p', { class: 'prompt' }, p.prompt),
        h('div', { class: 'examples' }, p.examples.map(e => h('code', {}, e))),
        p.mode ? h('p', { class: 'muted' }, 'Any order is accepted.') : null,
        h('p', { class: 'muted' }, mock ? 'Mock rules: talk out loud, no hints until you are done.' : 'Before typing: clarify, work an example, state the brute force, then optimize.'),
        mock ? h('details', {}, h('summary', {}, 'After the interview: hints, solution, follow-ups'), help) : help),
      h('div', {}, ta,
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', onclick: run }, 'Run tests (Ctrl+Enter)'),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => { if (confirm(T('Replace your code with the starter?'))) { ta.value = p.starter; ta.oninput(); } } }, 'Reset code')),
        out));
  }

  function problemView(id) {
    const p = IV.problems.find(x => x.id === id); if (!p) return codingView();
    const i = IV.problems.indexOf(p), prev = IV.problems[i - 1], next = IV.problems[i + 1];
    return h('div', { class: 'page wide iv' },
      head([...crumb(h('a', { href: '#/interview/coding' }, 'Coding'))], p.title, null,
        h('div', { class: 'actions' }, diffChip(p.diff), h('span', { class: 'chip' }, patternName(p.pattern)), D.solved[p.id] ? h('span', { class: 'chip diff-0' }, '✓ solved') : null, timer(p.diff === 0 ? 20 : p.diff === 1 ? 30 : 45))),
      arena(p),
      h('div', { class: 'pager' }, prev ? h('a', { href: '#/interview/problem/' + prev.id }, '← ' + prev.title) : h('span'), next ? h('a', { href: '#/interview/problem/' + next.id }, next.title + ' →') : h('a', { href: '#/interview/coding' }, 'All problems →')));
  }

  function codingView() {
    const solved = Object.keys(D.solved).length;
    return h('div', { class: 'page iv' },
      head(crumb('Coding'), 'Coding interview', T('{n} classic problems across 12 patterns, judged in your browser against real test cases. Write TypeScript here; the same patterns are shown in C# on the patterns page.', { n: IV.problems.length }), bar(Math.round(solved / IV.problems.length * 100))),
      sec('How to run every problem', h('p', {}, 'Interviewers grade the process as much as the answer. Follow the same seven steps each time until they are automatic.'),
        h('ol', { class: 'steps' }, IV.method.map(([n, t]) => h('li', {}, h('b', {}, n + '. '), t)))),
      sec(h('span', {}, 'Problems ', h('small', {}, `${solved} / ${IV.problems.length} ${T('solved')}`)),
        h('div', { class: 'rows' }, IV.problems.map(p => h('a', { class: 'row', href: '#/interview/problem/' + p.id },
          h('span', { class: 'tick' + (D.solved[p.id] ? ' on' : '') }, D.solved[p.id] ? '✓' : ''), h('span', { class: 'row-t' }, p.title), h('small', {}, patternName(p.pattern)), diffChip(p.diff)))),
        h('p', { style: { marginTop: '1rem' } }, h('a', { class: 'btn ghost', href: '#/interview/patterns' }, 'Study the 12 patterns →'))),
      sec('Complexity you must know cold', h('table', { class: 't' }, h('tbody', {}, IV.bigO.map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, h('code', {}, b))))))));
  }

  function patternsView() {
    return h('div', { class: 'page iv' },
      head([...crumb(h('a', { href: '#/interview/coding' }, 'Coding'))], 'The 12 patterns', 'Almost every coding question is one of these in disguise. Learn to recognize the signal, and the template follows. Templates are in C#.'),
      IV.patterns.map(p => h('section', { class: 'sec', id: 'p-' + p.id },
        h('h2', {}, p.name),
        h('p', {}, h('b', {}, 'Reach for it when: '), p.signal),
        h('p', { class: 'muted' }, T('Typical cost: ') + p.cost),
        codeBlock(p.code, 'cs'),
        h('div', { class: 'chips', style: { marginTop: '.6rem' } }, IV.problems.filter(x => x.pattern === p.id).map(x => h('a', { class: 'chip-link' + (D.solved[x.id] ? ' solved' : ''), href: '#/interview/problem/' + x.id }, x.title))))));
  }

  // ---------- system design ----------
  function estimator() {
    const fmt = n => n >= 1e12 ? (n / 1e12).toFixed(1) + ' T' : n >= 1e9 ? (n / 1e9).toFixed(1) + ' B' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' K' : String(Math.round(n * 10) / 10);
    const bytes = n => { const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']; let i = 0; while (n >= 1000 && i < 5) { n /= 1000; i++; } return n.toFixed(1) + ' ' + u[i]; };
    const fields = [['Daily active users', 'dau', 10000000], ['Writes per user per day', 'w', 2], ['Reads per write', 'r', 50], ['Bytes per write', 'b', 500], ['Peak ÷ average', 'peak', 3]];
    const inputs = {}, out = h('div', {});
    const draw = () => {
      const v = Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, Math.max(+el.value || 0, 0)]));
      const wps = v.dau * v.w / 86400, rps = wps * v.r, day = v.dau * v.w * v.b;
      out.replaceChildren(h('table', { class: 't' }, h('tbody', {}, [
        ['Writes per second (average)', fmt(wps)], ['Reads per second (average)', fmt(rps)], ['Peak reads per second', fmt(rps * v.peak)],
        ['New storage per day', bytes(day)], ['New storage per year', bytes(day * 365)], ['Write bandwidth', bytes(wps * v.b) + '/s']
      ].map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, h('b', {}, b)))))));
    };
    const ctl = h('div', { class: 'est-grid' }, fields.map(([label, k, def]) => { inputs[k] = h('input', { type: 'number', min: 0, oninput: draw }); inputs[k].value = def; return h('label', {}, label, inputs[k]); }));
    draw();
    return h('div', { class: 'viz' }, ctl, out, h('p', { class: 'muted', style: { margin: '.6rem 0 0' } }, 'Rule of thumb: a day has about 100,000 seconds, so 1 M events per day ≈ 12 per second.'));
  }

  const diagram = tiers => h('div', { class: 'diagram' }, tiers.flatMap((t, i) => [i ? h('div', { class: 'arrow', 'aria-hidden': 'true' }, '↓') : null, h('div', { class: 'tier' }, t.map(b => h('span', {}, b)))]));

  function caseBody(c, open) {
    const d = (title, ...kids) => { const el = h('details', {}, h('summary', {}, title), ...kids); el.open = !!open; return el; };
    return h('div', { class: 'case' },
      d('1 · Requirements', list(c.req)),
      d('2 · Estimates', list(c.est)),
      d('3 · API and data model', h('ul', { class: 'points' }, c.api.map(a => h('li', {}, h('code', {}, a))))),
      d('4 · High-level design', diagram(c.tiers)),
      d('5 · Deep dives', c.deep.map(([t, body]) => h('div', {}, h('h3', {}, t), h('p', {}, body)))),
      d('6 · Follow-up questions to expect', list(c.follow)));
  }

  function designView(id) {
    const c = IV.design.cases.find(x => x.id === id);
    if (c) {
      const cb = h('input', { type: 'checkbox', onchange: e => { D.design[c.id] = e.target.checked; save(); } }); cb.checked = !!D.design[c.id];
      return h('div', { class: 'page iv' },
        head([...crumb(h('a', { href: '#/interview/design' }, 'System design'))], c.title, c.prompt, h('div', { class: 'actions' }, timer(45))),
        h('p', { class: 'muted' }, 'Attempt each step on paper or a whiteboard first, speaking out loud. Open a section only to compare.'),
        caseBody(c),
        h('div', { class: 'rubric', style: { marginTop: '1.2rem' } }, h('label', {}, cb, h('span', {}, 'I can present this design out loud in 35 minutes without notes, and answer the follow-ups.'))));
    }
    return h('div', { class: 'page iv' },
      head(crumb('System design'), 'System design interview', 'An open-ended conversation where you lead. There is no single right answer — interviewers look for structure, sound trade-offs and depth where it matters.'),
      sec('The 45-minute framework', h('div', { class: 'rows' }, IV.design.framework.map(([n, t, d], i) => h('div', { class: 'row static' }, h('span', { class: 'tick on' }, i + 1), h('span', { class: 'row-t' }, h('b', {}, n), h('br'), h('span', { class: 'muted' }, d)), h('small', {}, t))))),
      sec('Worked cases', h('div', { class: 'grid' }, IV.design.cases.map(x => h('a', { class: 'card go', href: '#/interview/design/' + x.id },
        h('span', { class: 'card-k' }, D.design[x.id] ? '✓ mastered' : 'case study'), h('strong', {}, x.title), h('p', {}, x.prompt))))),
      sec('Back-of-envelope estimator', h('p', {}, 'Estimation is arithmetic with round numbers. Change the inputs and learn which ones dominate.'), estimator()),
      sec('Building blocks', h('dl', { class: 'kv' }, IV.design.blocks.flatMap(([a, b]) => [h('dt', {}, a), h('dd', {}, b)]))),
      sec('Use what you already know', h('p', {}, 'Design answers get their depth from fundamentals in this program: ',
        h('a', { href: '#/lesson/sql/indexes' }, 'indexes'), ', ', h('a', { href: '#/lesson/sql/transactions' }, 'transactions'), ', ', h('a', { href: '#/lesson/sql/scale' }, 'scaling a database'), ', ',
        h('a', { href: '#/lesson/aspnet/perf' }, 'caching and rate limiting'), ', ', h('a', { href: '#/lesson/aspnet/arch' }, 'queues and the outbox'), ' and ', h('a', { href: '#/lesson/aspnet/prod' }, 'resilience'), '.')));
  }

  // ---------- behavioral ----------
  function behavioralView() {
    const page = h('div', { class: 'page iv' });
    const draw = () => {
      const form = { title: h('input', { type: 'text', placeholder: 'Short name, e.g. “Checkout latency fix”' }) };
      ['s', 't', 'a', 'r'].forEach(k => form[k] = h('textarea', { rows: k === 'a' ? 4 : 2 }));
      const tags = IV.behavioral.map(t => { const c = h('input', { type: 'checkbox', value: t.id }); return [c, h('label', {}, c, ' ' + t.name)]; });
      const add = () => {
        if (!form.title.value.trim()) return form.title.focus();
        D.stories.push({ title: form.title.value.trim(), s: form.s.value, t: form.t.value, a: form.a.value, r: form.r.value, tags: tags.filter(([c]) => c.checked).map(([c]) => c.value) });
        save(); draw();
      };
      const drillQ = h('p', { class: 'fc-q' }), drillL = h('p', { class: 'muted' });
      const next = () => { const t = pick(IV.behavioral); drillQ.textContent = pick(t.qs); const mine = D.stories.filter(s => s.tags.includes(t.id)); drillL.textContent = `${T('Theme:')} ${t.name}. ` + (mine.length ? T('Your stories: ') + mine.map(s => s.title).join(', ') + '.' : T('You have no story for this theme yet.')); };
      next();
      page.replaceChildren(
        head(crumb('Behavioral'), 'Behavioral interview', 'Interviewers predict future behavior from past behavior. They want specific stories with you as the actor — not opinions, and not “we”.', bar(Math.round(covered() / IV.behavioral.length * 100))),
        sec('STAR, with reflection', h('ol', { class: 'steps' },
          h('li', {}, h('b', {}, 'Situation '), '— one or two sentences of context. Keep it short.'),
          h('li', {}, h('b', {}, 'Task '), '— what you were responsible for, and what was at stake.'),
          h('li', {}, h('b', {}, 'Action '), '— what YOU did, step by step, and why. This is 60% of the answer.'),
          h('li', {}, h('b', {}, 'Result '), '— the measurable outcome. Numbers where you have them.'),
          h('li', {}, h('b', {}, 'Reflection '), '— what you learned or would do differently. This is what separates senior answers.')),
          h('p', { class: 'muted' }, 'Aim for two minutes per story. Six to eight strong stories, each usable for several themes, cover almost any question.'),
          h('details', {}, h('summary', {}, 'Example answer (made up — replace it with your own)'),
            h('p', { class: 'muted' }, 'Question: “Tell me about a problem you noticed that nobody had asked you to fix.”'),
            [['Situation', 'Our cooperative’s member app sometimes showed the old savings balance right after a deposit. Support was getting about 20 complaints a week, and members thought their money was missing.'],
             ['Task', 'I was on the mobile team, so the backend was not mine, but I had the most room that sprint, so I offered to find the cause.'],
             ['Action', 'I matched three complaints against the server logs and saw that the balance came from a cache refreshed every five minutes. I wrote a test that reproduced it, proposed clearing that member’s cached balance as soon as the deposit committed, and paired with the backend developer to ship it behind a feature flag.'],
             ['Result', 'Balance complaints went from about 20 a week to one or two in the following month, and the flag was removed after two weeks.'],
             ['Reflection', 'Reproducing the bug in a test before arguing about the fix ended the discussion about whose bug it was. I now do that first.']]
              .map(([k, v]) => h('p', {}, h('b', {}, T(k) + ': '), v)))),
        sec('Practice drill', h('div', { class: 'flash' }, drillQ, drillL, h('div', { class: 'actions' }, timer(2), h('button', { type: 'button', class: 'btn ghost', onclick: next }, 'Next question')))),
        sec('Your story bank',
          h('div', { class: 'cover' }, IV.behavioral.map(t => { const n = D.stories.filter(s => s.tags.includes(t.id)).length; return h('span', { class: 'chip ' + (n ? 'diff-0' : '') }, `${t.name}: ${n}`); })),
          D.stories.length ? h('div', { class: 'stories' }, D.stories.map((s, i) => h('details', { class: 'story' }, h('summary', {}, s.title, ' ', h('small', {}, s.tags.map(id => IV.behavioral.find(t => t.id === id).name).join(' · '))),
            [['Situation', s.s], ['Task', s.t], ['Action', s.a], ['Result', s.r]].map(([k, v]) => h('p', {}, h('b', {}, T(k) + ': '), v || '—')),
            h('button', { type: 'button', class: 'btn sm ghost', onclick: () => { if (confirm(T('Delete this story?'))) { D.stories.splice(i, 1); save(); draw(); } } }, 'Delete')))) : h('p', { class: 'muted' }, 'No stories yet. Add your first below.'),
          h('div', { class: 'story-form' },
            h('label', {}, 'Title', form.title), h('label', {}, 'Situation', form.s), h('label', {}, 'Task', form.t), h('label', {}, 'Action — what you did', form.a), h('label', {}, 'Result — with numbers', form.r),
            h('div', { class: 'tagbox' }, h('span', { class: 'muted' }, 'Themes this story can answer:'), tags.map(([, l]) => l)),
            h('button', { type: 'button', class: 'btn', onclick: add }, 'Save story'))),
        sec('Question bank', IV.behavioral.map(t => h('details', {}, h('summary', {}, t.name), h('p', {}, h('b', {}, 'What a strong answer shows: '), t.looks), list(t.qs)))));
    };
    draw();
    return page;
  }

  // ---------- rapid-fire ----------
  function qa(area, i, onRate) {
    const [q, a] = area.qs[i], k = (area.key || area.area) + '#' + i;   // area.key keeps saved ratings stable across languages
    const state = h('small', {});
    const drawState = () => { state.textContent = D.rapid[k] === 2 ? T('✓ solid') : D.rapid[k] === 1 ? T('shaky') : ''; state.className = D.rapid[k] === 2 ? 'ok' : 'muted'; };
    const rate = v => () => { D.rapid[k] = v; save(); drawState(); onRate && onRate(); };
    drawState();
    return h('details', { class: 'qa' }, h('summary', {}, q, ' ', state), h('p', {}, a),
      h('div', { class: 'actions' }, h('span', { class: 'muted' }, 'Say your answer out loud first. How did it compare?'),
        h('button', { type: 'button', class: 'btn sm ghost', onclick: rate(1) }, 'Shaky'), h('button', { type: 'button', class: 'btn sm', onclick: rate(2) }, 'Solid')));
  }

  function rapidView() {
    const progress = h('div', {});
    const drawP = () => progress.replaceChildren(bar(Math.round(Object.values(D.rapid).filter(v => v === 2).length / rapidTotal * 100)));
    drawP();
    return h('div', { class: 'page iv' },
      head(crumb('Rapid-fire'), 'Rapid-fire stack questions', 'The knowledge round: short questions on your own stack. A good answer is two or three precise sentences plus one trade-off, said without hesitation.', progress),
      IV.rapid.map(area => h('section', { class: 'sec', style: { '--tc': `var(--${area.track})` } }, h('h2', {}, area.area), area.qs.map((_, i) => qa(area, i, drawP)))));
  }

  // ---------- mock interviews ----------
  const RUBRICS = {
    coding: ['Problem solving — clarified, found the right approach', 'Coding — correct, clean, idiomatic', 'Communication — thought out loud, took hints well', 'Verification — tested, found bugs, stated complexity'],
    design: ['Requirements and scope', 'High-level design that works end to end', 'Depth and trade-offs in the hard parts', 'Communication and leading the conversation'],
    behavioral: ['Structure — clear STAR, about two minutes', 'Ownership — “I”, specific actions', 'Impact — measurable result', 'Reflection — what was learned'],
    rapid: ['Accuracy', 'Depth beyond the definition', 'Clarity and brevity', 'Composure when unsure']
  };
  const LEVELS4 = ['', '1 — No hire', '2 — Lean no hire', '3 — Hire', '4 — Strong hire'];
  const verdict = avg => avg >= 3.5 ? 'Strong hire' : avg >= 3 ? 'Hire' : avg >= 2.5 ? 'Borderline' : 'No hire';

  function scorecard(type, title, onSaved) {
    const sels = RUBRICS[type].map(() => { const s = h('select', {}, LEVELS4.map((l, i) => h('option', { value: i }, l || 'Rate…'))); return s; });
    const notes = h('textarea', { rows: 3, placeholder: 'What went well? What will you drill before the next one?' });
    const msg = h('p', { class: 'muted' });
    return h('section', { class: 'sec teach' }, h('h2', {}, 'Interviewer scorecard'),
      h('p', { class: 'muted' }, 'Grade yourself as the interviewer would — or better, have a friend do it. Be strict: “hire” means you would want this person on your team.'),
      h('div', { class: 'score-grid' }, RUBRICS[type].flatMap((r, i) => [h('span', {}, r), sels[i]])), notes,
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', onclick: () => {
        const scores = sels.map(s => +s.value);
        if (scores.some(s => !s)) return msg.textContent = T('Rate all four dimensions first.');
        const avg = scores.reduce((a, b) => a + b, 0) / 4;
        D.mocks.push({ date: new Date().toLocaleDateString('sv'), type, title, scores, avg, notes: notes.value }); save();
        msg.textContent = `${T('Saved. Overall:')} ${T(verdict(avg))} (${avg.toFixed(2)} / 4).`; msg.className = 'ok'; onSaved && onSaved();
      } }, 'Save result'), msg));
  }

  function history() {
    if (!D.mocks.length) return h('p', { class: 'muted' }, 'No mock interviews recorded yet.');
    return h('table', { class: 't' }, h('thead', {}, h('tr', {}, ['Date', 'Type', 'Session', 'Score', 'Verdict'].map(c => h('th', {}, c)))),
      h('tbody', {}, D.mocks.slice().reverse().map(m => h('tr', {}, h('td', {}, m.date), h('td', {}, m.type), h('td', {}, m.title), h('td', {}, m.avg.toFixed(2)), h('td', {}, verdict(m.avg))))));
  }

  function mockView() {
    const stage = h('div', {}), hist = h('div', {}, history());
    const refresh = () => hist.replaceChildren(history());
    const start = {
      coding: () => {
        const pool = IV.problems.filter(p => p.diff === +diffSel.value), unsolved = pool.filter(p => !D.solved[p.id]);
        const p = pick(unsolved.length ? unsolved : pool);
        return [h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, p.title), diffChip(p.diff), timer(p.diff === 2 ? 45 : 35)), arena(p, { mock: true }), scorecard('coding', p.title, refresh)];
      },
      design: () => {
        const c = pick(IV.design.cases);
        return [h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, c.title), timer(45)), h('p', { class: 'prompt' }, c.prompt),
          h('ol', { class: 'steps' }, IV.design.framework.map(([n, t]) => h('li', {}, h('b', {}, n), ` — ${t}`))),
          h('p', { class: 'muted' }, 'Draw on paper and talk out loud for the full 45 minutes before opening the reference.'),
          h('details', {}, h('summary', {}, 'After the interview: reference design'), caseBody(c, true)), scorecard('design', c.title, refresh)];
      },
      behavioral: () => {
        const themes = shuffle(IV.behavioral).slice(0, 4);
        return [h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, 'Four questions, about seven minutes each'), timer(30)),
          themes.map((t, i) => h('div', { class: 'q' }, h('p', { class: 'q-text' }, `${i + 1}. ${pick(t.qs)}`), h('details', {}, h('summary', {}, 'What the interviewer is looking for'), h('p', {}, h('b', {}, t.name + ': '), t.looks)))),
          scorecard('behavioral', themes.map(t => t.name).join(', '), refresh)];
      },
      rapid: () => {
        const all = shuffle(IV.rapid.flatMap(a => a.qs.map((_, i) => [a, i]))).slice(0, 8);
        return [h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, 'Eight stack questions'), timer(20)), all.map(([a, i]) => qa(a, i)), scorecard('rapid', 'Stack knowledge round', refresh)];
      }
    };
    const diffSel = h('select', { 'aria-label': 'Difficulty' }, DIFF.map((d, i) => h('option', { value: i }, d))); diffSel.value = 1;
    const go = type => () => { stage.replaceChildren(...start[type]().flat(Infinity)); stage.scrollIntoView({ behavior: 'smooth' }); };
    const card = (type, title, desc, extra) => h('div', { class: 'card' }, h('strong', {}, title), h('p', {}, desc), h('div', { class: 'actions' }, extra, h('button', { type: 'button', class: 'btn sm', onclick: go(type) }, 'Start')));
    return h('div', { class: 'page wide iv' },
      head(crumb('Mock interview'), 'Mock interview', 'Simulate one round under real conditions: timer running, talking out loud, no notes. Then score it honestly. Keep going until your scores stop jumping from one mock to the next; for most people that takes several of each round.'),
      h('div', { class: 'grid' },
        card('coding', 'Coding round', 'One problem, 35–45 minutes, hints locked until the end.', diffSel),
        card('design', 'System design round', 'One open-ended design, 45 minutes, reference hidden.'),
        card('behavioral', 'Behavioral round', 'Four questions from different themes, 30 minutes.'),
        card('rapid', 'Stack knowledge round', 'Eight rapid-fire questions, 20 minutes.')),
      h('div', { class: 'mock-stage' }, stage),
      sec('History', hist));
  }

  // ---------- hub ----------
  function hub() {
    const p = parts(), r = readiness();
    const loop = [
      ['Coding', '#/interview/coding', 'Two rounds in most loops. Data structures and algorithms, solved out loud in 35–45 minutes.'],
      ['System design', '#/interview/design', 'From mid-level up. Design a large system on a whiteboard and defend the trade-offs.'],
      ['Behavioral', '#/interview/behavioral', 'Evidence of ownership, collaboration and judgement, told as specific stories.'],
      ['Stack knowledge', '#/interview/rapid', 'Depth in your own technologies: C#, ASP.NET Core, SQL, TypeScript, React, CSS, Flutter, the web.'],
      ['Mock interviews', '#/interview/mock', 'Timed, scored simulations of each round — the fastest way to improve.']
    ];
    return h('div', { class: 'page iv' },
      h('header', { class: 'hero' },
        h('div', {}, h('p', { class: 'eyebrow' }, 'Get hired'), h('h1', {}, 'Interview preparation'),
          h('p', { class: 'lede' }, 'Top companies hire through a structured loop, and the loop can be trained for. Everything here is practice under the same conditions: timed, out loud, and graded against a rubric.')),
        h('div', { class: 'ring', html: `<svg viewBox="0 0 120 120" role="img" aria-label="${T('Interview readiness')} ${r}%"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" stroke-dasharray="${2 * Math.PI * 52}" stroke-dashoffset="${2 * Math.PI * 52 * (1 - r / 100)}" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" class="ring-n">${r}%</text><text x="60" y="76" text-anchor="middle" class="ring-l">${T('ready')}</text></svg>` })),
      sec('Readiness', h('div', { class: 'meters' }, p.map(([label, n, t, href]) => h('a', { class: 'meter', href }, h('span', {}, label), bar(Math.round(n / t * 100)), h('small', {}, `${n} / ${t}`)))),
        h('p', { class: 'muted' }, 'Self-reported progress, not a guarantee. The honest test is a mock interview graded by another person.')),
      sec('The interview loop', h('div', { class: 'grid' }, loop.map(([t, href, d]) => h('a', { class: 'card go', href }, h('strong', {}, t), h('p', {}, d))))),
      sec('Two more rounds for full-stack roles',
        h('details', {}, h('summary', {}, 'SQL round'), h('p', {}, 'Many backend and full-stack loops include live SQL: joins, grouping, a window function, and reading a slow query. The 11 graded challenges in the ', h('a', { href: '#/play/sql' }, 'SQL playground'), ' cover exactly that range — do them timed, explaining each clause out loud. Then review ', h('a', { href: '#/lesson/sql/indexes' }, 'indexes'), ' and ', h('a', { href: '#/lesson/sql/plans' }, 'execution plans'), ' for the follow-up questions.')),
        h('details', {}, h('summary', {}, 'Frontend “build a component” round'), h('p', {}, 'Forty-five minutes to build a working UI component in React and TypeScript while explaining your decisions. Practise each prompt in a fresh Vite project against the clock.'),
          h('div', { class: 'rows' }, IV.ui.map(([t, build, checks]) => h('div', { class: 'row static' }, h('span', { class: 'row-t' }, h('b', {}, t), h('br'), build, h('br'), h('span', { class: 'muted', html: T('Interviewers check: ') + md(checks) })))))),
        h('p', { class: 'muted' }, 'Before any coding round, make sure the ', h('a', { href: '#/track/cs' }, 'CS Fundamentals'), ' track is solid — every pattern here assumes it.')),
      sec('Eight-week plan', h('p', { class: 'muted' }, 'Assumes about 15–20 hours a week. With a full-time job, give each week two weeks: finishing later beats skipping the mocks.'), IV.plan.map(([week, items], wi) => {
        const done = D.plan[wi] || [];
        const el = h('details', {}, h('summary', {}, week, ' ', h('small', {}, `${items.filter((_, i) => done[i]).length} / ${items.length}`)),
          h('div', { class: 'rubric' }, items.map((it, i) => { const cb = h('input', { type: 'checkbox', onchange: e => { done[i] = e.target.checked; D.plan[wi] = done; save(); el.querySelector('small').textContent = `${items.filter((_, j) => done[j]).length} / ${items.length}`; } }); cb.checked = !!done[i]; return h('label', {}, cb, h('span', {}, it)); })));
        el.open = items.some((_, i) => !done[i]) && IV.plan.slice(0, wi).every((w, j) => w[1].every((_, i) => (D.plan[j] || [])[i]));
        return el;
      })),
      sec('Getting the interview — and real credibility', list(IV.hiring)),
      sec('Mock history', history()));
  }

  window.INTERVIEW = {
    readiness,
    view: (a, b) => ({ coding: codingView, problem: () => problemView(b), patterns: patternsView, design: () => designView(b), behavioral: behavioralView, rapid: rapidView, mock: mockView }[a] || hub)()
  };
})();
