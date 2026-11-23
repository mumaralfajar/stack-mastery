// Interview preparation section: hub, coding arena with an in-browser judge, system design, behavioral, rapid-fire, mocks.
import { INTERVIEW_TOTALS } from '../data/manifest.ts';
import { codeBlock, confirmDialog, h, md, tableWrap } from '../lib/dom.ts';
import { getInterview, t as T } from '../lib/i18n.ts';
import { bar, href, ring, shuffle } from '../lib/icons.ts';
import { notifyStateChange } from '../lib/state.ts';
import { INTERVIEW_KEY, onStorageSync, readJson, writeJson } from '../lib/storage.ts';
import { editor, loadTS, typeNote } from './playground.js';

const fresh = () => ({ solved: {}, code: {}, design: {}, stories: [], rapid: {}, mocks: [], plan: {} });
const D = readJson(INTERVIEW_KEY, fresh);

function reloadD(raw) {
  let next;
  try {
    next = Object.assign(fresh(), JSON.parse(raw || '{}'));
  } catch {
    return false;
  }
  for (const k of Object.keys(D)) delete D[k];
  Object.assign(D, next);
  return true;
}

function syncFromStorage() {
  const freshData = readJson(INTERVIEW_KEY, fresh);
  for (const k of Object.keys(D)) delete D[k];
  Object.assign(D, freshData);
}

const save = () => {
  writeJson(INTERVIEW_KEY, D);
  notifyStateChange('interview', false);
};

// Another tab changed interview data: reload D in place (closures hold the same object).
// main.js handles refreshing the sidebar and active interview view via subscribeState.
onStorageSync([INTERVIEW_KEY], (_key, newValue) => {
  reloadD(newValue);
});

const DIFF = ['Easy', 'Medium', 'Hard'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const list = (items) => h('ul', { class: 'points' }, items.map((i) => h('li', { html: md(i) })));
const sec = (title, ...kids) => h('section', { class: 'sec' }, h('h2', {}, title), ...kids);
const head = (eyebrow, title, lede, ...kids) =>
  h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, eyebrow), h('h1', {}, title), lede ? h('p', { class: 'lede' }, lede) : null, ...kids);
const crumb = (label) => [h('a', { href: href('/interview/') }, 'Interview prep'), ' · ', label];
const diffChip = (d) => h('span', { class: 'chip diff-' + d }, DIFF[d]);
const patternName = (iv, id) => iv.patterns.find((p) => p.id === id).name;

// ---------- readiness ----------
const covered = (iv) => iv.behavioral.filter((b) => D.stories.some((s) => (s.tags || []).includes(b.id))).length;
const getRapidTotal = (iv) => iv.rapid.reduce((a, r) => a + r.qs.length, 0);

function parts(iv) {
  return [
    ['Coding problems solved', Object.keys(D.solved).length, iv.problems.length, href('/interview/coding/')],
    ['System design cases mastered', Object.values(D.design).filter(Boolean).length, iv.design.cases.length, href('/interview/design/')],
    ['Behavioral themes with a story', covered(iv), iv.behavioral.length, href('/interview/behavioral/')],
    ['Rapid-fire answers rated solid', Object.values(D.rapid).filter((v) => v === 2).length, getRapidTotal(iv), href('/interview/rapid/')],
    ['Mock interviews completed', Math.min(D.mocks.length, INTERVIEW_TOTALS.maxMocks), INTERVIEW_TOTALS.maxMocks, href('/interview/mock/')],
  ];
}

// ---------- timer ----------
function timer(minutes) {
  let left = minutes * 60;
  let id = null;
  const face = h('b', { class: 'timer-face' });
  const draw = () => {
    face.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
    face.classList.toggle('low', left <= 60);
  };
  const stop = () => {
    clearInterval(id);
    id = null;
    go.textContent = T('Start');
  };
  const go = h(
    'button',
    {
      type: 'button',
      class: 'btn sm',
      onclick: () => {
        if (id) return stop();
        go.textContent = T('Pause');
        id = setInterval(() => {
          if (!face.isConnected) return stop();
          if (left > 0) left--;
          draw();
          if (!left) stop();
        }, 1000);
      },
    },
    'Start',
  );
  draw();
  return h(
    'div',
    { class: 'timer' },
    face,
    go,
    h(
      'button',
      {
        type: 'button',
        class: 'btn sm ghost',
        onclick: () => {
          stop();
          left = minutes * 60;
          draw();
        },
      },
      'Reset',
    ),
  );
}

// ---------- judge: transpile, run in a worker with a time limit ----------
const canon = (v) =>
  Array.isArray(v)
    ? v.map(canon)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
      : v;
const key = (v) => JSON.stringify(canon(v));
const same = (got, exp, mode) => {
  if (!Array.isArray(got) || !mode) return key(got) === key(exp);
  const n = (a) => a.map((x) => (mode === 'nested' && Array.isArray(x) ? key(x.map(key).sort()) : key(x))).sort();
  return key(n(got)) === key(n(exp));
};
const show = (v) => {
  const s = v === undefined ? 'undefined' : JSON.stringify(v);
  return s.length > 110 ? s.slice(0, 110) + '…' : s;
};

async function judge(p, code) {
  await loadTS();
  const res = window.ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: { target: 'ES2022', module: 'ESNext' },
  });
  const diag = (res.diagnostics || []).map((d) => window.ts.flattenDiagnosticMessageText(d.messageText, '\n'));
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
  return new Promise((resolve) => {
    const done = (r) => {
      clearTimeout(t);
      w.terminate();
      URL.revokeObjectURL(url);
      resolve(r);
    };
    const t = setTimeout(
      () => done({ fatal: T('Time limit exceeded (4 s). Check for an infinite loop or an exponential algorithm.') }),
      4000,
    );
    w.onmessage = (e) => done(e.data);
    w.onerror = (e) => {
      e.preventDefault();
      done({ fatal: (e.message || T('Runtime error')).replace(/^Uncaught /, '') });
    };
    w.postMessage(p.tests.map((testCase) => testCase[0]));
  });
}

// ---------- problem arena ----------
function arena(iv, p, { mock } = {}) {
  const out = h('div', { class: 'out', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Run the tests to see results.'));
  const run = async () => {
    out.replaceChildren(h('p', { class: 'muted' }, 'Running…'));
    let r;
    try {
      r = await judge(p, ta.value);
    } catch (e) {
      r = { fatal: String(e.message || e) };
    }
    if (r.fatal) return out.replaceChildren(h('p', { class: 'err' }, r.fatal));
    const rows = r.out.map((x, i) => {
      const [args, exp] = p.tests[i];
      const ok = !x.err && same(x.got, exp, p.mode);
      return {
        ok,
        el: h(
          'li',
          { class: ok ? 'pass' : 'fail' },
          h('b', {}, ok ? '✓ ' : '✗ '),
          h('code', {}, show(args).slice(1, -1)),
          ok
            ? null
            : h(
                'div',
                {},
                'expected ',
                h('code', {}, show(exp)),
                x.err ? [', threw ', h('code', {}, x.err)] : [', got ', h('code', {}, show(x.got))],
              ),
        ),
      };
    });
    const passed = rows.filter((x) => x.ok).length;
    const all = passed === rows.length;
    if (all) {
      D.solved[p.id] = true;
      save();
    }
    const note = await typeNote(ta);
    out.replaceChildren(
      ...[
        note,
        h(
          'p',
          { class: all ? 'ok' : 'err' },
          all
            ? T('✓ All {n} tests passed. Now state the time and space complexity out loud.', { n: rows.length })
            : T('{passed} of {n} tests passed.', { passed, n: rows.length }),
        ),
        h('ul', { class: 'tests' }, rows.map((x) => x.el)),
        r.logs.length ? h('div', {}, h('p', { class: 'muted' }, 'console.log output'), h('pre', {}, r.logs.join('\n'))) : null,
      ].filter(Boolean),
    );
  };
  const ta = editor(D.code[p.id] || p.starter, run, 'typescript');
  ta.classList.add('tall');
  ta.oninput = () => {
    D.code[p.id] = ta.value;
    save();
  };
  const help = [
    h('details', {}, h('summary', {}, 'Hint 1'), h('p', {}, p.hints[0])),
    h('details', {}, h('summary', {}, 'Hint 2'), h('p', {}, p.hints[1])),
    h(
      'details',
      {},
      h('summary', {}, 'Solution and complexity'),
      codeBlock(p.solution, 'ts'),
      iv.cs && iv.cs[p.id]
        ? [
            h('p', { class: 'muted', style: { margin: '.8rem 0 .3rem' } }, 'The same solution in C#, compiled and run against these test cases:'),
            codeBlock(iv.cs[p.id], 'cs'),
          ]
        : null,
      h('p', { style: { marginTop: '.6rem' } }, h('b', {}, 'Complexity: '), p.complexity),
      h('p', { class: 'muted' }, 'Pattern: ', h('a', { href: href('/interview/patterns/') }, patternName(iv, p.pattern))),
    ),
    h('details', {}, h('summary', {}, 'Interviewer follow-ups'), list(p.follow)),
  ];
  return h(
    'div',
    { class: 'play' },
    h(
      'div',
      {},
      h('p', { class: 'prompt' }, p.prompt),
      h('div', { class: 'examples' }, p.examples.map((e) => h('code', {}, e))),
      p.mode ? h('p', { class: 'muted' }, 'Any order is accepted.') : null,
      h(
        'p',
        { class: 'muted' },
        mock
          ? 'Mock rules: talk out loud, no hints until you are done.'
          : 'Before typing: clarify, work an example, state the brute force, then optimize.',
      ),
      mock ? h('details', {}, h('summary', {}, 'After the interview: hints, solution, follow-ups'), help) : help,
    ),
    h(
      'div',
      {},
      ta,
      h(
        'div',
        { class: 'actions' },
        h('button', { type: 'button', class: 'btn', onclick: run }, 'Run tests (Ctrl+Enter)'),
        h(
          'button',
          {
            type: 'button',
            class: 'btn ghost',
            onclick: async () => {
              if (await confirmDialog(T('Replace your code with the starter?'), { title: 'Reset code', confirmText: 'Reset code', danger: true })) {
                ta.value = p.starter;
                ta.oninput();
              }
            },
          },
          'Reset code',
        ),
      ),
      out,
    ),
  );
}

function problemView(iv, id) {
  const p = iv.problems.find((x) => x.id === id);
  if (!p) return codingView(iv);
  const i = iv.problems.indexOf(p);
  const prev = iv.problems[i - 1];
  const next = iv.problems[i + 1];
  return h(
    'div',
    { class: 'page wide iv' },
    head(
      [...crumb(h('a', { href: href('/interview/coding/') }, 'Coding'))],
      p.title,
      null,
      h(
        'div',
        { class: 'actions' },
        diffChip(p.diff),
        h('span', { class: 'chip' }, patternName(iv, p.pattern)),
        D.solved[p.id] ? h('span', { class: 'chip diff-0' }, '✓ solved') : null,
        timer(p.diff === 0 ? 20 : p.diff === 1 ? 30 : 45),
      ),
    ),
    arena(iv, p),
    h(
      'div',
      { class: 'pager' },
      prev ? h('a', { href: href(`/interview/problem/${prev.id}/`) }, '← ' + prev.title) : h('span'),
      next ? h('a', { href: href(`/interview/problem/${next.id}/`) }, next.title + ' →') : h('a', { href: href('/interview/coding/') }, 'All problems →'),
    ),
  );
}

function codingView(iv) {
  const solved = Object.keys(D.solved).length;
  return h(
    'div',
    { class: 'page iv' },
    head(
      crumb('Coding'),
      'Coding interview',
      T('{n} classic problems across 12 patterns, judged in-browser against real tests. Write TypeScript here, or view the C# templates on the patterns page.', {
        n: iv.problems.length,
      }),
      bar(Math.round((solved / iv.problems.length) * 100), 'Coding interview'),
    ),
    sec(
      'How to run every problem',
      h('p', {}, 'Interviewers grade the process as much as the answer. Follow the same seven steps each time until they are automatic.'),
      h('ol', { class: 'steps' }, iv.method.map(([n, txt]) => h('li', {}, h('b', {}, n + '. '), txt))),
    ),
    sec(
      h('span', {}, 'Problems ', h('small', {}, `${solved} / ${iv.problems.length} ${T('solved')}`)),
      h(
        'div',
        { class: 'rows' },
        iv.problems.map((p) =>
          h(
            'a',
            { class: 'row', href: href(`/interview/problem/${p.id}/`) },
            h('span', { class: 'tick' + (D.solved[p.id] ? ' on' : '') }, D.solved[p.id] ? '✓' : ''),
            h('span', { class: 'row-t' }, p.title),
            h('small', {}, patternName(iv, p.pattern)),
            diffChip(p.diff),
          ),
        ),
      ),
      h('p', { style: { marginTop: '1rem' } }, h('a', { class: 'btn ghost', href: href('/interview/patterns/') }, 'Study the 12 patterns →')),
    ),
    sec(
      'Complexity you must know cold',
      tableWrap(
        'Complexity reference',
        h('table', { class: 't' }, h('tbody', {}, iv.bigO.map(([a, b]) => h('tr', {}, h('th', { scope: 'row' }, a), h('td', {}, h('code', {}, b)))))),
      ),
    ),
  );
}

function patternsView(iv) {
  return h(
    'div',
    { class: 'page iv' },
    head(
      [...crumb(h('a', { href: href('/interview/coding/') }, 'Coding'))],
      'The 12 patterns',
      'Almost every coding question is one of these in disguise. Learn to recognize the signal, and the template follows. Templates are in C#.',
    ),
    iv.patterns.map((p) =>
      h(
        'section',
        { class: 'sec', id: 'p-' + p.id },
        h('h2', {}, p.name),
        h('p', {}, h('b', {}, 'Reach for it when: '), p.signal),
        h('p', { class: 'muted' }, T('Typical cost: ') + p.cost),
        codeBlock(p.code, 'cs'),
        h(
          'div',
          { class: 'chips', style: { marginTop: '.6rem' } },
          iv.problems
            .filter((x) => x.pattern === p.id)
            .map((x) => h('a', { class: 'chip-link' + (D.solved[x.id] ? ' solved' : ''), href: href(`/interview/problem/${x.id}/`) }, x.title)),
        ),
      ),
    ),
  );
}

// ---------- system design ----------
function estimator() {
  const fmt = (n) =>
    n >= 1e12
      ? (n / 1e12).toFixed(1) + ' T'
      : n >= 1e9
        ? (n / 1e9).toFixed(1) + ' B'
        : n >= 1e6
          ? (n / 1e6).toFixed(1) + ' M'
          : n >= 1e3
            ? (n / 1e3).toFixed(1) + ' K'
            : String(Math.round(n * 10) / 10);
  const bytes = (n) => {
    const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i = 0;
    while (n >= 1000 && i < 5) {
      n /= 1000;
      i++;
    }
    return n.toFixed(1) + ' ' + u[i];
  };
  const fields = [
    ['Daily active users', 'dau', 10000000],
    ['Writes per user per day', 'w', 2],
    ['Reads per write', 'r', 50],
    ['Bytes per write', 'b', 500],
    ['Peak ÷ average', 'peak', 3],
  ];
  const inputs = {};
  const out = h('div', {});
  const draw = () => {
    const v = Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, Math.max(+el.value || 0, 0)]));
    const wps = (v.dau * v.w) / 86400;
    const rps = wps * v.r;
    const perDay = v.dau * v.w * v.b;
    out.replaceChildren(
      tableWrap(
        'System estimates',
        h(
          'table',
          { class: 't' },
          h(
            'tbody',
            {},
            [
              ['Writes per second (average)', fmt(wps)],
              ['Reads per second (average)', fmt(rps)],
              ['Peak reads per second', fmt(rps * v.peak)],
              ['New storage per day', bytes(perDay)],
              ['New storage per year', bytes(perDay * 365)],
              ['Write bandwidth', bytes(wps * v.b) + '/s'],
            ].map(([a, b]) => h('tr', {}, h('th', { scope: 'row' }, a), h('td', {}, h('b', {}, b)))),
          ),
        ),
      ),
    );
  };
  const ctl = h(
    'div',
    { class: 'est-grid' },
    fields.map(([label, k, def]) => {
      inputs[k] = h('input', { type: 'number', min: 0, oninput: draw });
      inputs[k].value = def;
      return h('label', {}, label, inputs[k]);
    }),
  );
  draw();
  return h(
    'div',
    { class: 'viz' },
    ctl,
    out,
    h('p', { class: 'muted', style: { margin: '.6rem 0 0' } }, 'Rule of thumb: a day has about 100,000 seconds, so 1 M events per day ≈ 12 per second.'),
  );
}

const diagram = (tiers) =>
  h(
    'div',
    { class: 'diagram' },
    tiers.flatMap((tier, i) => [
      i ? h('div', { class: 'arrow', 'aria-hidden': 'true' }, '↓') : null,
      h('div', { class: 'tier' }, tier.map((b) => h('span', {}, b))),
    ]),
  );

function caseBody(c, open) {
  const d = (title, ...kids) => {
    const el = h('details', {}, h('summary', {}, title), ...kids);
    el.open = !!open;
    return el;
  };
  return h(
    'div',
    { class: 'case' },
    d('1 · Requirements', list(c.req)),
    d('2 · Estimates', list(c.est)),
    d('3 · API and data model', h('ul', { class: 'points' }, c.api.map((a) => h('li', {}, h('code', {}, a))))),
    d('4 · High-level design', diagram(c.tiers)),
    d('5 · Deep dives', c.deep.map(([title, body]) => h('div', {}, h('h3', {}, title), h('p', {}, body)))),
    d('6 · Follow-up questions to expect', list(c.follow)),
  );
}

function designView(iv, id) {
  const c = iv.design.cases.find((x) => x.id === id);
  if (c) {
    const cb = h('input', {
      type: 'checkbox',
      onchange: (e) => {
        D.design[c.id] = e.target.checked;
        save();
      },
    });
    cb.checked = !!D.design[c.id];
    return h(
      'div',
      { class: 'page iv' },
      head([...crumb(h('a', { href: href('/interview/design/') }, 'System design'))], c.title, c.prompt, h('div', { class: 'actions' }, timer(45))),
      h('p', { class: 'muted' }, 'Attempt each step on paper or a whiteboard first, speaking out loud. Open a section only to compare.'),
      caseBody(c),
      h(
        'div',
        { class: 'rubric', style: { marginTop: '1.2rem' } },
        h('label', {}, cb, h('span', {}, 'I can present this design out loud in 35 minutes without notes, and answer the follow-ups.')),
      ),
    );
  }
  return h(
    'div',
    { class: 'page iv' },
    head(
      crumb('System design'),
      'System design interview',
      'An open-ended conversation where you lead. Interviewers look for structure, clear trade-offs, and depth where it matters rather than one right answer.',
    ),
    sec(
      'The 45-minute framework',
      h(
        'div',
        { class: 'rows' },
        iv.design.framework.map(([n, tm, d], i) =>
          h(
            'div',
            { class: 'row static' },
            h('span', { class: 'tick on' }, i + 1),
            h('span', { class: 'row-t' }, h('b', {}, n), h('br'), h('span', { class: 'muted' }, d)),
            h('small', {}, tm),
          ),
        ),
      ),
    ),
    sec(
      'Worked cases',
      h(
        'div',
        { class: 'grid' },
        iv.design.cases.map((x) =>
          h(
            'a',
            { class: 'card go', href: href(`/interview/design/${x.id}/`) },
            h('span', { class: 'card-k' }, D.design[x.id] ? '✓ mastered' : 'case study'),
            h('strong', {}, x.title),
            h('p', {}, x.prompt),
          ),
        ),
      ),
    ),
    sec('Back-of-envelope estimator', h('p', {}, 'Estimation is arithmetic with round numbers. Change the inputs and learn which ones dominate.'), estimator()),
    sec('Building blocks', h('dl', { class: 'kv' }, iv.design.blocks.flatMap(([a, b]) => [h('dt', {}, a), h('dd', {}, b)]))),
    sec(
      'Use what you already know',
      h(
        'p',
        {},
        'Design answers get their depth from the ',
        h('a', { href: href('/track/sysdesign/') }, 'System Design'),
        ' track and fundamentals: ',
        h('a', { href: href('/lesson/sysdesign/caching/') }, 'caching'),
        ', ',
        h('a', { href: href('/lesson/sysdesign/ratelimiting/') }, 'rate limiting'),
        ', ',
        h('a', { href: href('/lesson/sysdesign/db-scaling/') }, 'scaling a database'),
        ', ',
        h('a', { href: href('/lesson/sysdesign/hashing/') }, 'consistent hashing'),
        ', ',
        h('a', { href: href('/lesson/sysdesign/messaging/') }, 'queues and the outbox'),
        ', ',
        h('a', { href: href('/lesson/sysdesign/resilience/') }, 'resilience'),
        ' and ',
        h('a', { href: href('/lesson/sysdesign/consistency/') }, 'fencing tokens and sagas'),
        '.',
      ),
    ),
  );
}

// ---------- behavioral ----------
function behavioralView(iv) {
  const page = h('div', { class: 'page iv' });
  const draw = () => {
    const form = { title: h('input', { type: 'text', placeholder: 'Short name, e.g. “Checkout latency fix”' }) };
    ['s', 't', 'a', 'r', 'ref'].forEach((k) => {
      form[k] = h('textarea', { rows: k === 'a' ? 4 : 2 });
    });
    const tags = iv.behavioral.map((b) => {
      const c = h('input', { type: 'checkbox', value: b.id });
      return [c, h('label', {}, c, ' ' + b.name)];
    });
    const add = () => {
      if (!form.title.value.trim()) return form.title.focus();
      D.stories.push({
        title: form.title.value.trim(),
        s: form.s.value,
        t: form.t.value,
        a: form.a.value,
        r: form.r.value,
        ref: form.ref.value,
        tags: tags.filter(([c]) => c.checked).map(([c]) => c.value),
      });
      save();
      draw();
    };
    const drillQ = h('p', { class: 'fc-q' });
    const drillL = h('p', { class: 'muted' });
    const next = () => {
      const b = pick(iv.behavioral);
      drillQ.textContent = pick(b.qs);
      const mine = D.stories.filter((s) => s.tags.includes(b.id));
      drillL.textContent =
        `${T('Theme:')} ${b.name}. ` +
        (mine.length ? T('Your stories: ') + mine.map((s) => s.title).join(', ') + '.' : T('You have no story for this theme yet.'));
    };
    next();
    page.replaceChildren(
      head(
        crumb('Behavioral'),
        'Behavioral interview',
        'Interviewers predict future behavior from past actions. Share concrete stories focused on what you did instead of opinions or “we”.',
        bar(Math.round((covered(iv) / iv.behavioral.length) * 100), 'Behavioral interview'),
      ),
      sec(
        'STAR, with reflection',
        h(
          'ol',
          { class: 'steps' },
          h('li', {}, h('b', {}, 'Situation '), ': one or two sentences of context. Keep it short.'),
          h('li', {}, h('b', {}, 'Task '), ': what you were responsible for, and what was at stake.'),
          h('li', {}, h('b', {}, 'Action '), ': what YOU did, step by step, and why. This is 60% of the answer.'),
          h('li', {}, h('b', {}, 'Result '), ': the measurable outcome. Add numbers where you have them.'),
          h('li', {}, h('b', {}, 'Reflection '), ': what you learned or would do differently. This separates strong senior answers.'),
        ),
        h('p', { class: 'muted' }, 'Aim for two minutes per story. Six to eight strong stories, each usable for several themes, cover almost any question.'),
        h(
          'details',
          {},
          h('summary', {}, 'Example answer (sample story, replace with yours)'),
          h('p', { class: 'muted' }, 'Question: “Tell me about a problem you noticed that nobody had asked you to fix.”'),
          [
            [
              'Situation',
              'Our cooperative’s member app sometimes showed the old savings balance right after a deposit. Support was getting about 20 complaints a week, and members thought their money was missing.',
            ],
            ['Task', 'I was on the mobile team, so the backend wasn’t mine. With extra room that sprint, I offered to track down the root cause.'],
            [
              'Action',
              'I matched three complaints against server logs and spotted a five-minute balance cache. I wrote a failing test, cleared that member’s cache on commit, and paired with backend to ship behind a feature flag.',
            ],
            ['Result', 'Balance complaints went from about 20 a week to one or two in the following month, and the flag was removed after two weeks.'],
            ['Reflection', 'Reproducing the bug in a test before arguing about the fix ended the discussion about whose bug it was. I now do that first.'],
          ].map(([k, v]) => h('p', {}, h('b', {}, T(k) + ': '), v)),
        ),
      ),
      sec(
        'Practice drill',
        h('div', { class: 'flash' }, drillQ, drillL, h('div', { class: 'actions' }, timer(2), h('button', { type: 'button', class: 'btn ghost', onclick: next }, 'Next question'))),
      ),
      sec(
        'Your story bank',
        h(
          'div',
          { class: 'cover' },
          iv.behavioral.map((b) => {
            const n = D.stories.filter((s) => s.tags.includes(b.id)).length;
            return h('span', { class: 'chip ' + (n ? 'diff-0' : '') }, `${b.name}: ${n}`);
          }),
        ),
        D.stories.length
          ? h(
              'div',
              { class: 'stories' },
              D.stories.map((s, i) =>
                h(
                  'details',
                  { class: 'story' },
                  h(
                    'summary',
                    {},
                    s.title,
                    ' ',
                    h('small', {}, s.tags.map((id) => iv.behavioral.find((b) => b.id === id)?.name || id).join(' · ')),
                  ),
                  [
                    ['Situation', s.s],
                    ['Task', s.t],
                    ['Action', s.a],
                    ['Result', s.r],
                    ['Reflection', s.ref],
                  ].map(([k, v]) => h('p', {}, h('b', {}, T(k) + ': '), v || '—')),
                  h(
                    'button',
                    {
                      type: 'button',
                      class: 'btn sm ghost',
                      onclick: async () => {
                        if (await confirmDialog(T('Delete this story?'), { title: 'Delete', confirmText: 'Delete', danger: true })) {
                          D.stories.splice(i, 1);
                          save();
                          draw();
                        }
                      },
                    },
                    'Delete',
                  ),
                ),
              ),
            )
          : h('p', { class: 'muted' }, 'No stories yet. Add your first below.'),
        h(
          'div',
          { class: 'story-form' },
          h('label', {}, 'Title', form.title),
          h('label', {}, 'Situation', form.s),
          h('label', {}, 'Task', form.t),
          h('label', {}, 'Action: what you did', form.a),
          h('label', {}, 'Result: with numbers', form.r),
          h('label', {}, 'Reflection: what you learned', form.ref),
          h('div', { class: 'tagbox' }, h('span', { class: 'muted' }, 'Themes this story can answer:'), tags.map(([, l]) => l)),
          h('button', { type: 'button', class: 'btn', onclick: add }, 'Save story'),
        ),
      ),
      sec(
        'Question bank',
        iv.behavioral.map((b) =>
          h('details', {}, h('summary', {}, b.name), h('p', {}, h('b', {}, 'What a strong answer shows: '), b.looks), list(b.qs)),
        ),
      ),
    );
  };
  draw();
  return page;
}

// ---------- rapid-fire ----------
function qa(area, i, onRate) {
  const [q, a] = area.qs[i];
  const k = (area.key || area.area) + '#' + i; // area.key keeps saved ratings stable across languages
  const state = h('small', {});
  const drawState = () => {
    state.textContent = D.rapid[k] === 2 ? T('✓ solid') : D.rapid[k] === 1 ? T('shaky') : '';
    state.className = D.rapid[k] === 2 ? 'ok' : 'muted';
  };
  const rate = (v) => () => {
    D.rapid[k] = v;
    save();
    drawState();
    if (onRate) onRate();
  };
  drawState();
  return h(
    'details',
    { class: 'qa' },
    h('summary', {}, q, ' ', state),
    h('p', {}, a),
    h(
      'div',
      { class: 'actions' },
      h('span', { class: 'muted' }, 'Say your answer out loud first. How did it compare?'),
      h('button', { type: 'button', class: 'btn sm ghost', onclick: rate(1) }, 'Shaky'),
      h('button', { type: 'button', class: 'btn sm', onclick: rate(2) }, 'Solid'),
    ),
  );
}

function rapidView(iv) {
  const rapidTotal = getRapidTotal(iv);
  const progress = h('div', {});
  const drawP = () => progress.replaceChildren(bar(Math.round((Object.values(D.rapid).filter((v) => v === 2).length / rapidTotal) * 100), 'Rapid-fire Q&A'));
  drawP();
  return h(
    'div',
    { class: 'page iv' },
    head(
      crumb('Rapid-fire'),
      'Rapid-fire stack questions',
      'The knowledge round: short questions on your own stack. A good answer is two or three precise sentences plus one trade-off, said without hesitation.',
      progress,
    ),
    iv.rapid.map((area) =>
      h('section', { class: 'sec', style: { '--tc': `var(--${area.track})` } }, h('h2', {}, area.area), area.qs.map((_, i) => qa(area, i, drawP))),
    ),
  );
}

// ---------- mock interviews ----------
const RUBRICS = {
  coding: [
    'Problem solving: clarified, found the right approach',
    'Coding: correct, clean, idiomatic',
    'Communication: thought out loud, took hints well',
    'Verification: tested, found bugs, stated complexity',
  ],
  design: [
    'Requirements and scope',
    'High-level design that works end to end',
    'Depth and trade-offs in the hard parts',
    'Communication and leading the conversation',
  ],
  behavioral: [
    'Structure: clear STAR, about two minutes',
    'Ownership: “I” rather than “we”',
    'Impact: measurable result',
    'Reflection: what was learned',
  ],
  rapid: ['Accuracy', 'Depth beyond the definition', 'Clarity and brevity', 'Composure when unsure'],
};
const LEVELS4 = ['', '1: No hire', '2: Lean no hire', '3: Hire', '4: Strong hire'];
const verdict = (avg) => (avg >= 3.5 ? 'Strong hire' : avg >= 3 ? 'Hire' : avg >= 2.5 ? 'Borderline' : 'No hire');

function scorecard(type, title, onSaved) {
  const sels = RUBRICS[type].map((_, i) =>
    h('select', { id: `sc-${type}-${i}` }, LEVELS4.map((l, j) => h('option', { value: j }, l || 'Rate…'))),
  );
  const notes = h('textarea', {
    rows: 3,
    'aria-label': 'Mock interview notes',
    placeholder: 'What went well? What will you drill before the next one?',
  });
  const msg = h('p', { class: 'muted' });
  return h(
    'section',
    { class: 'sec teach' },
    h('h2', {}, 'Interviewer scorecard'),
    h('p', { class: 'muted' }, 'Grade yourself like an interviewer, or ask a friend to score you. “Hire” means you’d gladly work alongside this person.'),
    h('div', { class: 'score-grid' }, RUBRICS[type].flatMap((r, i) => [h('label', { for: `sc-${type}-${i}` }, r), sels[i]])),
    notes,
    h(
      'div',
      { class: 'actions' },
      h(
        'button',
        {
          type: 'button',
          class: 'btn',
          onclick: () => {
            const scores = sels.map((s) => +s.value);
            if (scores.some((s) => !s)) {
              msg.textContent = T('Rate all four dimensions first.');
              return;
            }
            const avg = scores.reduce((a, b) => a + b, 0) / 4;
            D.mocks.push({ date: new Date().toLocaleDateString('sv'), type, title, scores, avg, notes: notes.value });
            save();
            msg.textContent = `${T('Saved. Overall:')} ${T(verdict(avg))} (${avg.toFixed(2)} / 4).`;
            msg.className = 'ok';
            if (onSaved) onSaved();
          },
        },
        'Save result',
      ),
      msg,
    ),
  );
}

// onChange re-renders the caller's history block (and Hub readiness) after a delete.
function history(onChange) {
  if (!D.mocks.length) return h('p', { class: 'muted' }, 'No mock interviews recorded yet.');
  const remove = (m) => async () => {
    if (!(await confirmDialog(T('Delete this mock interview result?'), { title: 'Delete', confirmText: 'Delete', danger: true }))) return;
    const i = D.mocks.indexOf(m);
    if (i >= 0) {
      D.mocks.splice(i, 1);
      save();
    }
    if (onChange) onChange();
  };
  return tableWrap(
    'Mock interview history',
    h(
      'table',
      { class: 't' },
      h('thead', {}, h('tr', {}, ['Date', 'Type', 'Session', 'Score', 'Verdict', 'Notes', 'Actions'].map((c) => h('th', { scope: 'col' }, c)))),
      h(
        'tbody',
        {},
        D.mocks.toReversed().map((m) =>
          h(
            'tr',
            {},
            h('td', {}, m.date),
            h('td', {}, m.type),
            h('td', {}, m.title),
            h('td', {}, m.avg.toFixed(2)),
            h('td', {}, verdict(m.avg)),
            h(
              'td',
              { class: 'mock-notes' },
              m.notes && m.notes.trim() ? h('details', {}, h('summary', {}, 'Show notes'), h('p', {}, m.notes.trim())) : h('span', { class: 'muted' }, '—'),
            ),
            h(
              'td',
              {},
              h(
                'button',
                {
                  type: 'button',
                  class: 'btn sm ghost',
                  'aria-label': T('Delete mock result from {date}', { date: m.date }),
                  onclick: remove(m),
                },
                'Delete',
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

function mockView(iv) {
  const stage = h('div', {});
  const hist = h('div', {});
  const refresh = () => hist.replaceChildren(history(refresh));
  refresh();
  const start = {
    coding: () => {
      const pool = iv.problems.filter((p) => p.diff === +diffSel.value);
      const unsolved = pool.filter((p) => !D.solved[p.id]);
      const p = pick(unsolved.length ? unsolved : pool);
      return [
        h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, p.title), diffChip(p.diff), timer(p.diff === 2 ? 45 : 35)),
        arena(iv, p, { mock: true }),
        scorecard('coding', p.title, refresh),
      ];
    },
    design: () => {
      const c = pick(iv.design.cases);
      return [
        h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, c.title), timer(45)),
        h('p', { class: 'prompt' }, c.prompt),
        h('ol', { class: 'steps' }, iv.design.framework.map(([n, tm]) => h('li', {}, h('b', {}, n), `: ${tm}`))),
        h('p', { class: 'muted' }, 'Draw on paper and talk out loud for the full 45 minutes before opening the reference.'),
        h('details', {}, h('summary', {}, 'After the interview: reference design'), caseBody(c, true)),
        scorecard('design', c.title, refresh),
      ];
    },
    behavioral: () => {
      const themes = shuffle(iv.behavioral).slice(0, 4);
      return [
        h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, 'Four questions, about seven minutes each'), timer(30)),
        themes.map((b, i) =>
          h(
            'div',
            { class: 'q' },
            h('p', { class: 'q-text' }, `${i + 1}. ${pick(b.qs)}`),
            h('details', {}, h('summary', {}, 'What the interviewer is looking for'), h('p', {}, h('b', {}, b.name + ': '), b.looks)),
          ),
        ),
        scorecard('behavioral', themes.map((b) => b.name).join(', '), refresh),
      ];
    },
    rapid: () => {
      const all = shuffle(iv.rapid.flatMap((a) => a.qs.map((_, i) => [a, i]))).slice(0, 8);
      return [
        h('div', { class: 'actions' }, h('h2', { style: { margin: 0 } }, 'Eight stack questions'), timer(20)),
        all.map(([a, i]) => qa(a, i)),
        scorecard('rapid', 'Stack knowledge round', refresh),
      ];
    },
  };
  const diffSel = h('select', { 'aria-label': 'Difficulty' }, DIFF.map((d, i) => h('option', { value: i }, d)));
  diffSel.value = 1;
  const go = (type) => () => {
    stage.replaceChildren(...start[type]().flat(Infinity));
    stage.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const card = (type, title, desc, extra) =>
    h(
      'div',
      { class: 'card' },
      h('strong', {}, title),
      h('p', {}, desc),
      h('div', { class: 'actions' }, extra, h('button', { type: 'button', class: 'btn sm', onclick: go(type) }, 'Start')),
    );
  return h(
    'div',
    { class: 'page wide iv' },
    head(
      crumb('Mock interview'),
      'Mock interview',
      'Simulate one round with the timer running, thinking out loud, and using zero notes. Keep running mocks until your scores settle across sessions.',
    ),
    h(
      'div',
      { class: 'grid' },
      card('coding', 'Coding round', 'One problem, 35–45 minutes, hints locked until the end.', diffSel),
      card('design', 'System design round', 'One open-ended design, 45 minutes, reference hidden.'),
      card('behavioral', 'Behavioral round', 'Four questions from different themes, 30 minutes.'),
      card('rapid', 'Stack knowledge round', 'Eight rapid-fire questions, 20 minutes.'),
    ),
    h('div', { class: 'mock-stage' }, stage),
    sec('History', hist),
  );
}

// ---------- hub ----------
function hub(iv) {
  const ringHost = h('div', {});
  const metersHost = h('div', { class: 'meters' });
  const drawReadiness = () => {
    const p = parts(iv);
    const r = Math.round((p.reduce((a, [, n, total]) => a + n / total, 0) / p.length) * 100);
    ringHost.replaceChildren(ring(r, { ariaLabel: 'Interview readiness', caption: 'ready' }));
    metersHost.replaceChildren(
      ...p.map(([label, n, total, href]) =>
        h('a', { class: 'meter', href }, h('span', {}, label), bar(Math.round((n / total) * 100), label), h('small', {}, `${n} / ${total}`)),
      ),
    );
  };
  const mockHist = h('div', {});
  const refreshHist = () => {
    mockHist.replaceChildren(history(refreshHist));
    drawReadiness();
  };
  refreshHist();
  const loop = [
    ['Coding', href('/interview/coding/'), 'Two rounds in most loops. Data structures and algorithms, solved out loud in 35–45 minutes.'],
    ['System design', href('/interview/design/'), 'From mid-level up. Design a large system on a whiteboard and defend the trade-offs.'],
    ['Behavioral', href('/interview/behavioral/'), 'Evidence of ownership, collaboration and judgement, told as specific stories.'],
    ['Stack knowledge', href('/interview/rapid/'), 'Depth in your own technologies: C#, ASP.NET Core, Go, SQL, TypeScript, React, Angular, CSS, Flutter, System design, the web.'],
    ['Mock interviews', href('/interview/mock/'), 'Timed, scored simulations of every round to build speed and confidence.'],
  ];
  return h(
    'div',
    { class: 'page iv' },
    h(
      'header',
      { class: 'hero' },
      h(
        'div',
        {},
        h('p', { class: 'eyebrow' }, 'Get hired'),
        h('h1', {}, 'Interview preparation'),
        h(
          'p',
          { class: 'lede' },
          'Top companies hire through a structured loop, and the loop can be trained for. Everything here is practice under the same conditions: timed, out loud, and graded against a rubric.',
        ),
      ),
      ringHost,
    ),
    sec(
      'Readiness',
      metersHost,
      h('p', { class: 'muted' }, 'Self-reported progress, not a guarantee. The honest test is a mock interview graded by another person.'),
    ),
    sec('The interview loop', h('div', { class: 'grid' }, loop.map(([title, href, d]) => h('a', { class: 'card go', href }, h('strong', {}, title), h('p', {}, d))))),
    sec(
      'Two more rounds for full-stack roles',
      h(
        'details',
        {},
        h('summary', {}, 'SQL round'),
        h(
          'p',
          {},
          'Many backend and full-stack loops include live SQL: joins, grouping, window functions, and reading slow queries. The 14 graded challenges in the ',
          h('a', { href: href('/play/sql/') }, 'SQL playground'),
          ' cover that exact range. Solve them timed while explaining each clause out loud, then review ',
          h('a', { href: href('/lesson/sql/indexes/') }, 'indexes'),
          ' and ',
          h('a', { href: href('/lesson/sql/plans/') }, 'execution plans'),
          ' for the follow-up questions.',
        ),
      ),
      h(
        'details',
        {},
        h('summary', {}, 'Frontend “build a component” round'),
        h(
          'p',
          {},
          'Forty-five minutes to build a working UI feature in React, Angular, TypeScript, or Flutter while explaining your choices. Practise each prompt in a fresh Vite, Angular CLI, or Flutter app against the clock.',
        ),
        h(
          'div',
          { class: 'rows' },
          iv.ui.map(([title, build, checks]) =>
            h(
              'div',
              { class: 'row static' },
              h('span', { class: 'row-t' }, h('b', {}, title), h('br'), build, h('br'), h('span', { class: 'muted', html: T('Interviewers check: ') + md(checks) })),
            ),
          ),
        ),
      ),
      h(
        'p',
        { class: 'muted' },
        'Before any coding round, make sure the ',
        h('a', { href: href('/track/cs/') }, 'CS Fundamentals'),
        ' track is solid since every pattern here builds on it.',
      ),
    ),
    sec(
      'Eight-week plan',
      h('p', { class: 'muted' }, 'Assumes about 15–20 hours a week. With a full-time job, give each week two weeks: finishing later beats skipping the mocks.'),
      iv.plan.map(([week, items], wi) => {
        const done = D.plan[wi] || [];
        const el = h(
          'details',
          {},
          h('summary', {}, week, ' ', h('small', {}, `${items.filter((_, i) => done[i]).length} / ${items.length}`)),
          h(
            'div',
            { class: 'rubric' },
            items.map((it, i) => {
              const cb = h('input', {
                type: 'checkbox',
                onchange: (e) => {
                  done[i] = e.target.checked;
                  D.plan[wi] = done;
                  save();
                  el.querySelector('small').textContent = `${items.filter((_, j) => done[j]).length} / ${items.length}`;
                },
              });
              cb.checked = !!done[i];
              return h('label', {}, cb, h('span', {}, it));
            }),
          ),
        );
        el.open = items.some((_, i) => !done[i]) && iv.plan.slice(0, wi).every((w, j) => w[1].every((_, i) => (D.plan[j] || [])[i]));
        return el;
      }),
    ),
    sec('Getting the interview and building real credibility', list(iv.hiring)),
    sec('Mock history', mockHist),
  );
}

export function interviewView(a, b) {
  syncFromStorage();
  const iv = getInterview();
  if (!iv) return document.createTextNode('');
  const routes = {
    coding: () => codingView(iv),
    problem: () => problemView(iv, b),
    patterns: () => patternsView(iv),
    design: () => designView(iv, b),
    behavioral: () => behavioralView(iv),
    rapid: () => rapidView(iv),
    mock: () => mockView(iv),
  };
  return (routes[a] || (() => hub(iv)))();
}
