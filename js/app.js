(() => {
  const T = window.t;   // `t` is used for tracks in this file
  // ---------- state ----------
  const KEY = 'stackmastery.v1';
  const fresh = () => ({ lessons: {}, cards: {}, projects: {}, streak: { last: '', count: 0 }, theme: '' });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ } };
  const day = (off = 0) => { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString('sv'); };
  const touch = () => {
    const t = day();
    if (S.streak.last !== t) { S.streak.count = S.streak.last === day(-1) ? S.streak.count + 1 : 1; S.streak.last = t; }
    save();
  };
  const streak = () => (S.streak.last === day() || S.streak.last === day(-1)) ? S.streak.count : 0;

  const view = document.getElementById('view'), nav = document.getElementById('nav');
  const track = id => TRACKS.find(t => t.id === id);
  const key = (t, l) => t.id + '/' + l.id;
  const peek = k => S.lessons[k] || {};
  const st = k => S.lessons[k] || (S.lessons[k] = {});
  const score = k => { const s = peek(k); return (s.read ? 1 : 0) + (s.quiz ? 1 : 0) + (s.teach ? 1 : 0); };
  const pct = (t, lvl) => {
    const ls = t.lessons.filter(l => lvl == null || l.level === lvl);
    return ls.length ? Math.round(ls.reduce((a, l) => a + score(key(t, l)), 0) / (ls.length * 3) * 100) : 0;
  };
  const allLessons = () => TRACKS.flatMap(t => t.lessons.map(l => ({ t, l, k: key(t, l) })));
  const overall = () => { const a = allLessons(); return Math.round(a.reduce((x, e) => x + score(e.k), 0) / (a.length * 3) * 100); };
  const allCards = () => allLessons().flatMap(e => e.l.quiz.map((q, i) => ({ id: e.k + '#' + i, q, t: e.t, l: e.l })));
  const dueCards = () => allCards().filter(c => peek(key(c.t, c.l)).read && (!S.cards[c.id] || S.cards[c.id].due <= day()));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function applyTheme() {
    if (S.theme) document.documentElement.dataset.theme = S.theme; else delete document.documentElement.dataset.theme;
  }
  applyTheme();

  // ---------- small components ----------
  const chip = (text, cls) => h('span', { class: 'chip ' + (cls || '') }, text);
  const dots = k => { const s = peek(k); return h('span', { class: 'dots', title: 'Learn · Check · Teach' }, ['read', 'quiz', 'teach'].map(f => h('i', { class: s[f] ? 'on' : '' }))); };
  const bar = (p, label) => h('div', { class: 'bar', role: 'img', 'aria-label': T(label || 'Progress') + ' ' + p + '%' }, h('i', { style: { width: p + '%' } }));
  function ring(p) {
    const r = 52, c = 2 * Math.PI * r;
    return h('div', { class: 'ring', html:
      `<svg viewBox="0 0 120 120" role="img" aria-label="${T('Overall mastery')} ${p}%"><circle cx="60" cy="60" r="${r}" class="ring-bg"/><circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" class="ring-n">${p}%</text><text x="60" y="76" text-anchor="middle" class="ring-l">${T('mastery')}</text></svg>` });
  }
  const section = (title, ...kids) => h('section', { class: 'sec' }, h('h2', {}, title), ...kids);
  const lessonHref = (t, l) => `#/lesson/${t.id}/${l.id}`;

  // One multiple-choice question. once=true locks after the first answer (exam mode).
  function quizItem(q, { once, onResult }) {
    const order = shuffle(q.a.map((text, i) => ({ text, ok: i === q.c })));
    const fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    let done = false, first = true;
    const btns = order.map(o => h('button', { type: 'button', class: 'opt', html: md(o.text), onclick: e => {
      if (done) return;
      const b = e.currentTarget;
      if (o.ok) {
        done = true; b.classList.add('right'); fb.className = 'fb good';
        fb.innerHTML = '<strong>' + T('Correct.') + '</strong> ' + md(q.why);
      } else {
        b.classList.add('wrong');
        if (once) { done = true; btns[order.findIndex(x => x.ok)].classList.add('right'); fb.className = 'fb bad'; fb.innerHTML = '<strong>' + T('Not quite.') + '</strong> ' + md(q.why); }
        else { fb.className = 'fb bad'; fb.textContent = T('Not quite — think about why, then try another.'); }
      }
      if (done || once) { btns.forEach(x => x.disabled = done); onResult && onResult(o.ok && first); }
      first = false;
    } }));
    return h('div', { class: 'q' }, h('p', { class: 'q-text', html: md(q.q) }), h('div', { class: 'opts' }, btns), fb);
  }

  // ---------- nav ----------
  let menuOpen = false;
  function setMenu(open) {
    menuOpen = !!open;
    nav.classList.toggle('open', menuOpen);
    document.body.classList.toggle('nav-open', menuOpen);
    const btn = nav.querySelector('.nav-toggle');
    if (btn) btn.setAttribute('aria-expanded', String(menuOpen));
    if (menuOpen) {
      const on = nav.querySelector('.nav-link.on');
      if (on) on.scrollIntoView({ block: 'nearest' });
    }
  }
  function toggleTheme() {
    const dark = S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    S.theme = dark ? 'light' : 'dark'; save(); applyTheme();
  }
  function renderNav() {
    const cur = location.hash.replace(/^#\/?/, '');
    const [a, b] = cur.split('/');
    const link = (href, label, on, extra) => h('a', { href, class: 'nav-link' + (on ? ' on' : ''), 'aria-current': on ? 'page' : null, onclick: () => setMenu(false) }, label, extra);
    const due = dueCards().length;
    const brand = () => h('a', { href: '#/', class: 'brand', onclick: () => setMenu(false) }, h('span', { class: 'logo' }, '◆'), 'Stack Mastery');
    nav.replaceChildren(
      h('div', { class: 'nav-top' },
        brand(),
        h('div', { class: 'nav-actions' },
          h('a', { href: '#/search', class: 'icon-btn', 'aria-label': 'Search', title: 'Search', html: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Toggle theme', title: 'Toggle theme', onclick: toggleTheme, html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' }),
          h('button', { type: 'button', class: 'nav-toggle', 'aria-label': 'Menu', 'aria-expanded': String(menuOpen), 'aria-controls': 'nav-drawer', onclick: () => setMenu(!menuOpen) },
            h('span', { html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' }),
            due ? h('small', { class: 'badge' }, due) : null))),
      h('div', { class: 'nav-backdrop', onclick: () => setMenu(false) }),
      h('div', { class: 'nav-drawer', id: 'nav-drawer' },
        h('div', { class: 'drawer-head' },
          brand(),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close menu', title: 'Close menu', onclick: () => setMenu(false), html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' })),
        h('nav', { 'aria-label': 'Main' },
          link('#/', 'Dashboard', a === ''),
          link('#/start', 'Start here: setup', a === 'start'),
          link('#/search', 'Search', a === 'search', h('small', { class: 'kbd' }, '/')),
          h('p', { class: 'nav-h' }, 'Tracks'),
          TRACKS.map(t => link(`#/track/${t.id}`, h('span', {}, h('i', { class: 'dot', style: { background: `var(--${t.id})` } }), t.name),
            (a === 'track' || a === 'lesson' || a === 'plan') && b === t.id, h('small', {}, pct(t) + '%'))),
          h('p', { class: 'nav-h' }, 'Practice'),
          link('#/review', 'Flashcard review', a === 'review', due ? h('small', { class: 'badge' }, due) : null),
          link('#/exam', 'Mock exam', a === 'exam'),
          link('#/play/sql', 'SQL playground', a === 'play' && b === 'sql'),
          link('#/play/ts', 'TypeScript playground', a === 'play' && b === 'ts'),
          link('#/play/css', 'CSS + Tailwind playground', a === 'play' && b === 'css'),
          link('#/play/dart', 'Dart + Flutter playground', a === 'play' && b === 'dart'),
          link('#/lab', 'Visual lab', a === 'lab'),
          h('p', { class: 'nav-h' }, 'Get hired'),
          link('#/interview', 'Interview hub', a === 'interview' && !b, h('small', {}, INTERVIEW.readiness() + '%')),
          link('#/interview/coding', 'Coding problems', a === 'interview' && ['coding', 'problem', 'patterns'].includes(b)),
          link('#/interview/design', 'System design', a === 'interview' && b === 'design'),
          link('#/interview/behavioral', 'Behavioral', a === 'interview' && b === 'behavioral'),
          link('#/interview/rapid', 'Rapid-fire Q&A', a === 'interview' && b === 'rapid'),
          link('#/interview/mock', 'Mock interview', a === 'interview' && b === 'mock'),
          h('p', { class: 'nav-h' }, 'Become the teacher'),
          link('#/teach', 'Teaching toolkit', a === 'teach'),
          link('#/projects', 'Capstone projects', a === 'projects')),
        h('div', { class: 'nav-foot' },
          h('p', { class: 'private-note' }, 'Your progress is saved only in this browser. Nothing is uploaded or shared.'),
          h('button', { type: 'button', class: 'ghost', onclick: toggleTheme }, 'Toggle theme'),
          h('button', { type: 'button', class: 'ghost', lang: LANG === 'id' ? 'en' : 'id', onclick: () => setLang(LANG === 'id' ? 'en' : 'id') }, LANG === 'id' ? 'English' : 'Bahasa Indonesia'),
          h('button', { type: 'button', class: 'ghost', onclick: exportBackup }, 'Export backup'),
          h('button', { type: 'button', class: 'ghost', onclick: importBackup }, 'Import backup'),
          h('button', { type: 'button', class: 'ghost', onclick: () => {
            if (confirm(T('Erase all progress, notes, flashcard history and interview prep data? This cannot be undone.'))) {
              try { ['stackmastery.v1', 'stackmastery.sql', 'stackmastery.interview'].forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ }
              location.hash = '#/'; location.reload();
            }
          } }, 'Reset progress'))));
    nav.classList.toggle('open', menuOpen);
  }

  // ---------- dashboard ----------
  function dashboard() {
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
          h('p', { class: 'lede' }, 'Six stack tracks — C#, ASP.NET Core, SQL, CSS with Tailwind, TypeScript with React, and Dart with Flutter — plus computer-science fundamentals, each from first principles to expert level. A lesson only counts as mastered once you can explain it to someone else.'),
          overall() === 0 ? h('p', {}, h('a', { class: 'btn', href: '#/start' }, 'New here? Set up your machine first →')) : null),
        ring(overall())),
      h('div', { class: 'stats' }, stat(streak(), 'day streak'), stat(dueCards().length, 'cards due'), stat(mastered, 'lessons mastered'), stat(all.length, 'lessons total')),
      next.length ? section('Continue where you left off', h('div', { class: 'grid' }, next.map(({ t, l }) =>
        h('a', { class: 'card go', href: lessonHref(t, l), style: { '--tc': `var(--${t.id})` } },
          h('span', { class: 'card-k' }, t.name + ' · ' + LEVELS[l.level]), h('strong', {}, l.title), dots(key(t, l)))))) : null,
      section('Tracks', h('div', { class: 'grid' }, TRACKS.map(t =>
        h('a', { class: 'card track-card', href: `#/track/${t.id}`, style: { '--tc': `var(--${t.id})` } },
          h('strong', {}, t.name), h('p', {}, t.tagline),
          h('div', { class: 'lvls' }, LEVELS.map((n, i) => h('div', {}, h('span', {}, n), bar(pct(t, i), n)))))))),
      section('Get hired',
        h('a', { class: 'card go', href: '#/interview' },
          h('span', { class: 'card-k' }, `${T('Interview readiness')} ${INTERVIEW.readiness()}%`), h('strong', {}, 'Interview preparation'),
          h('p', {}, 'Auto-judged coding problems, system design cases, a behavioral story bank, rapid-fire stack questions and timed mock interviews with a hiring rubric.'), bar(INTERVIEW.readiness(), 'Interview readiness'))),
      section('How a lesson works',
        h('ol', { class: 'steps' },
          h('li', {}, h('b', {}, 'Learn'), ' — read the key ideas, study the code, play with the visualization.'),
          h('li', {}, h('b', {}, 'Check'), ' — answer the questions. Missed ones come back as spaced-repetition flashcards.'),
          h('li', {}, h('b', {}, 'Teach'), ' — write the explanation you would give a beginner, then grade it against the rubric. This is the step that turns knowing into teaching.'))),
      section('Suggested order',
        h('p', {}, 'Work level by level across the tracks rather than finishing one track first — the stack only makes sense together.'),
        h('ol', { class: 'steps' },
          h('li', {}, h('b', {}, 'Beginner: '), 'C# → CS Fundamentals (Git, Big-O) → SQL → ASP.NET Core → CSS → TypeScript + React → Dart + Flutter, then build Capstone 1.'),
          h('li', {}, h('b', {}, 'Intermediate: '), 'same order, then Capstone 2 — your first real full-stack app.'),
          h('li', {}, h('b', {}, 'Advanced and Expert: '), 'follow whichever capstone requirement you cannot yet explain.'),
          h('li', {}, h('b', {}, 'Alongside, from Intermediate on: '), 'the eight-week interview plan — a few coding problems every week beats cramming.')),
        h('p', {}, h('a', { href: '#/lab/journey' }, 'See how one click travels through the whole stack →'))));
  }

  // ---------- track ----------
  function trackView(id) {
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

  // ---------- lesson ----------
  const RUBRIC = [
    'Plain words — no jargon I did not define first',
    'An analogy or a picture',
    'A concrete code example',
    'A common mistake, and why people make it',
    'I could answer “but why?” twice in a row'
  ];

  function lessonView(tid, lid) {
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
    const quiz = h('div', {}, l.quiz.map((q, i) => quizItem(q, { onResult: () => { results[i] = true; if (results.every(Boolean)) set('quiz', true); } })));

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

  // ---------- printable lesson plan ----------
  function planView(tid, lid) {
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

  // ---------- flashcards ----------
  const GAPS = [1, 2, 4, 8, 16];
  function review() {
    const page = h('div', { class: 'page' }, h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Spaced repetition'), h('h1', {}, 'Flashcard review'),
      h('p', { class: 'lede' }, 'Questions from lessons you have marked as learned return at growing intervals: 1, 2, 4, 8, then 16 days. Say the answer out loud before you reveal it.')));
    const stage = h('div', {}); page.append(stage);
    const queue = shuffle(dueCards()).slice(0, 20); let n = 0, got = 0;
    const show = () => {
      if (!queue.length) return stage.replaceChildren(h('div', { class: 'empty' }, h('strong', {}, 'Nothing due.'), h('p', {}, allLessons().some(e => peek(e.k).read) ? 'You are caught up — come back tomorrow, or take a mock exam.' : 'Mark a lesson as learned and its questions will appear here.')));
      if (n >= queue.length) { renderNav(); return stage.replaceChildren(h('div', { class: 'empty' }, h('strong', {}, T('Session complete — {got} of {n} recalled.', { got, n: queue.length })), h('p', {}, 'Missed cards return tomorrow.'), h('a', { class: 'btn', href: '#/' }, 'Back to dashboard'))); }
      const c = queue[n], back = h('div', { class: 'fc-back', hidden: true },
        h('p', { class: 'fc-a', html: md(c.q.a[c.q.c]) }), h('p', { html: md(c.q.why) }),
        h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn ghost', onclick: () => grade(false) }, 'Missed it'),
          h('button', { type: 'button', class: 'btn', onclick: () => grade(true) }, 'Got it')));
      const reveal = h('button', { type: 'button', class: 'btn', onclick: () => { back.hidden = false; reveal.hidden = true; } }, 'Show answer');
      const grade = ok => {
        const box = ok ? Math.min((S.cards[c.id]?.box || 0) + 1, 5) : 1;
        S.cards[c.id] = { box, due: day(ok ? GAPS[box - 1] : 1) }; if (ok) got++; n++; touch(); show();
      };
      stage.replaceChildren(h('div', { class: 'flash', style: { '--tc': `var(--${c.t.id})` } },
        h('p', { class: 'eyebrow' }, `${n + 1} / ${queue.length} · `, h('a', { href: lessonHref(c.t, c.l) }, c.t.name + ' — ' + c.l.title)),
        h('p', { class: 'fc-q', html: md(c.q.q) }), reveal, back));
    };
    show();
    return page;
  }

  // ---------- mock exam ----------
  function exam() {
    const page = h('div', { class: 'page' }, h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Prove it'), h('h1', {}, 'Mock exam'),
      h('p', { class: 'lede' }, 'Ten random questions, one attempt each. Use it to find the lessons you cannot yet teach.')));
    const sel = (opts) => h('select', {}, opts.map(([v, n]) => h('option', { value: v }, n)));
    const ts = sel([['', 'All tracks'], ...TRACKS.map(t => [t.id, t.name])]);
    const ls = sel([['', 'All levels'], ...LEVELS.map((n, i) => [i, n])]);
    const stage = h('div', {});
    const start = () => {
      const pool = shuffle(allCards().filter(c => (!ts.value || c.t.id === ts.value) && (ls.value === '' || c.l.level === +ls.value))).slice(0, 10);
      let answered = 0, right = 0; const missed = new Map();
      const result = h('div', { class: 'empty', hidden: true });
      stage.replaceChildren(...pool.map((c, i) => h('div', { class: 'exam-q', style: { '--tc': `var(--${c.t.id})` } },
        h('p', { class: 'eyebrow' }, `${T('Question')} ${i + 1} · ${c.t.name} · ${LEVELS[c.l.level]}`),
        quizItem(c.q, { once: true, onResult: ok => {
          answered++; if (ok) right++; else missed.set(c.t.id + c.l.id, c);
          if (answered === pool.length) {
            result.hidden = false;
            result.replaceChildren(h('strong', {}, `${T('Score:')} ${right} / ${pool.length}`),
              missed.size ? h('p', {}, 'Revisit: ', [...missed.values()].map((m, j) => [j ? ', ' : '', h('a', { href: lessonHref(m.t, m.l) }, m.l.title)])) : h('p', {}, 'Clean sweep. Raise the level.'));
            result.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } }))), result);
    };
    page.append(h('div', { class: 'actions' }, ts, ls, h('button', { type: 'button', class: 'btn', onclick: start }, 'Start exam')), stage);
    return page;
  }

  // ---------- visual lab ----------
  function labView(id) {
    const v = VIZ[id];
    if (!v) return h('div', { class: 'page' },
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'See it move'), h('h1', {}, 'Visual lab'), h('p', { class: 'lede' }, 'Every hard idea in this stack has a mental picture. These are the pictures — use them yourself, then use them on your students.')),
      h('div', { class: 'grid' }, Object.entries(VIZ).map(([vid, x]) => h('a', { class: 'card go', href: '#/lab/' + vid, style: { '--tc': `var(--${x.track})` } },
        h('span', { class: 'card-k' }, x.trackName), h('strong', {}, x.title), h('p', {}, x.desc)))));
    const el = h('div', { class: 'viz' }); v.mount(el);
    const used = allLessons().filter(e => e.l.viz === id);
    return h('div', { class: 'page', style: { '--tc': `var(--${v.track})` } },
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, h('a', { href: '#/lab' }, 'Visual lab'), ' · ', v.trackName), h('h1', {}, v.title), h('p', { class: 'lede' }, v.desc)),
      el,
      used.length ? h('p', { class: 'muted' }, 'Used in: ', used.map((e, i) => [i ? ', ' : '', h('a', { href: lessonHref(e.t, e.l) }, e.l.title)])) : null);
  }

  function playView(which, sample) {
    const el = h('div', { class: 'page wide' });
    ({ ts: PLAY.ts, css: PLAY.css, dart: PLAY.dart }[which] || PLAY.sql)(el, sample);
    return el;
  }

  // ---------- capstones ----------
  function projects() {
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

  // ---------- teaching toolkit ----------
  function teach() {
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
        '**Predict, run, explain.** Before running any line, ask what will happen. A wrong prediction is the moment learning occurs.',
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

  // ---------- backup ----------
  const KEYS = ['stackmastery.v1', 'stackmastery.sql', 'stackmastery.interview'];
  function exportBackup() {
    const data = { app: 'stack-mastery', exported: new Date().toISOString(), keys: Object.fromEntries(KEYS.map(k => [k, localStorage.getItem(k)]).filter(([, v]) => v)) };
    const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })), download: `stack-mastery-backup-${day()}.json` });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function importBackup() {
    const input = h('input', { type: 'file', accept: 'application/json,.json', onchange: async () => {
      try {
        const data = JSON.parse(await input.files[0].text());
        if (data.app !== 'stack-mastery' || !data.keys) throw new Error(T('not a Stack Mastery backup file'));
        const entries = Object.entries(data.keys).filter(([k, v]) => KEYS.includes(k) && typeof v === 'string');
        entries.forEach(([, v]) => JSON.parse(v));   // every value must itself be valid JSON
        if (!confirm(T('Replace the progress in this browser with the backup from {date}?', { date: String(data.exported).slice(0, 10) }))) return;
        KEYS.forEach(k => localStorage.removeItem(k));
        entries.forEach(([k, v]) => localStorage.setItem(k, v));
        location.reload();
      } catch (e) { alert(T('Could not import: ') + e.message); }
    } });
    input.click();
  }

  // ---------- search ----------
  function searchView() {
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

  // ---------- setup guide ----------
  function startView() {
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

  // ---------- router ----------
  let routed = false;
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); const b = nav.querySelector('.nav-toggle'); if (b) b.focus(); return; }
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.target.closest('input, textarea, select, [contenteditable], .monaco-host')) { e.preventDefault(); location.hash = '#/search'; }
  });
  function route() {
    setMenu(false);
    const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/');
    const r = { track: () => trackView(b), lesson: () => lessonView(b, c), plan: () => planView(b, c), review, exam, lab: () => labView(b), play: () => playView(b, c), projects, teach, interview: () => INTERVIEW.view(b, c), search: searchView, start: startView }[a] || dashboard;
    view.replaceChildren(r());
    renderNav();
    const h1 = view.querySelector('h1');
    document.title = (h1 && a ? h1.textContent + ' — ' : '') + 'Stack Mastery';
    scrollTo(0, 0);
    if (routed && a !== 'search') view.focus({ preventScroll: true });   // move keyboard and screen-reader focus to the new page
    routed = true;
  }
  addEventListener('hashchange', route);
  route();
})();
