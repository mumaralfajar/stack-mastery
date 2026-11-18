// Seven additional high-impact interactive visualizations across SQL, Angular, React, CSS, and CS Fundamentals.
(() => {
  const VIZ = window.VIZ = window.VIZ || {}, T = window.t;
  const btn = (label, onclick, cls) => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);
  const pills = (opts, cur, onPick) => {
    const row = h('div', { class: 'chips' });
    const btns = {};
    for (const [k, lbl] of opts) {
      btns[k] = h('button', {
        type: 'button', class: k === cur ? 'on' : '', 'aria-pressed': String(k === cur),
        onclick: () => {
          Object.entries(btns).forEach(([x, b]) => { b.classList.toggle('on', x === k); b.setAttribute('aria-pressed', String(x === k)); });
          onPick(k);
        }
      }, lbl);
      row.append(btns[k]);
    }
    return row;
  };
  function stepper(countFn, draw) {
    let i = 0;
    const lbl = h('span', { class: 'muted' });
    const back = btn('← Back', () => { i--; upd(); }, 'ghost');
    const next = btn('Next →', () => { i++; upd(); });
    const reset = () => { i = 0; upd(); };
    const upd = () => {
      const n = countFn();
      lbl.textContent = T('Step {i} of {n}', { i: i + 1, n });
      back.disabled = i <= 0;
      next.disabled = i >= n - 1;
      draw(i);
    };
    return { el: h('div', { class: 'viz-ctl' }, back, next, btn('Reset', reset, 'ghost'), lbl), reset, start: upd };
  }

  // ---------- 1. SQL: Concurrent transactions & deadlocks ----------
  VIZ.sqllock = {
    title: 'Concurrent transactions and deadlocks', track: 'sql', trackName: 'SQL',
    desc: 'Step two sessions line by line. Contrast opposite lock order (deadlock victim 1205), consistent lock order, and RCSI snapshots where readers never block writers.',
    mount(el) {
      const scenarios = {
        deadlock: [
          { a: 'BEGIN TRAN', b: 'BEGIN TRAN', locks: '—', res: 'deadlock-pending', note: 'Both sessions start uncommitted transactions at the same instant.' },
          { a: 'UPDATE Orders WHERE id=1 (holds X)', b: 'waiting…', locks: 'Orders#1 → A (X)', res: 'ok', note: 'Session A acquires an exclusive lock (X) on Orders#1.' },
          { a: 'holding Orders#1', b: 'UPDATE Stock WHERE id=7 (holds X)', locks: 'Orders#1 → A · Stock#7 → B', res: 'ok', note: 'Session B locks Stock#7 in the opposite order.' },
          { a: 'requests Stock#7 → BLOCKED', b: 'holding Stock#7', locks: 'A waits for B on Stock#7', res: 'wait', note: 'Session A cannot touch Stock#7 while B holds its exclusive lock.' },
          { a: 'waiting on B…', b: 'requests Orders#1 → CYCLE! Error 1205', locks: 'DEADLOCK (A ↔ B) → B rolled back', res: 'bad', note: 'Cycle detected! SQL Server kills the cheaper session (victim, error 1205) so A can finish.' }
        ],
        ordered: [
          { a: 'BEGIN TRAN', b: 'BEGIN TRAN', locks: '—', res: 'ok', note: 'Rule: every transaction acquires Orders before Stock.' },
          { a: 'UPDATE Orders WHERE id=1 (holds X)', b: 'requests Orders#1 → waits cleanly', locks: 'Orders#1 → A (B queued)', res: 'wait', note: 'B waits on Orders#1 before touching Stock#7 — zero cycle is possible.' },
          { a: 'UPDATE Stock WHERE id=7 → COMMIT', b: 'waiting on Orders#1…', locks: 'A releases all locks', res: 'ok', note: 'Session A finishes Stock#7 and commits immediately.' },
          { a: 'done', b: 'acquires Orders#1 → Stock#7 → COMMIT', locks: 'B holds & commits cleanly', res: 'good', note: 'Now B acquires both rows in the same order and succeeds with zero errors.' }
        ],
        rcsi: [
          { a: 'BEGIN TRAN: UPDATE Products SET price=99 (old 80 in version store)', b: 'SELECT price FROM Products WHERE id=3', locks: 'Products#3 → A (X) · row v1=80 in tempdb', res: 'ok', note: 'Session A modifies price without committing yet. The old committed value (80) stays in the version store.' },
          { a: 'holding X lock (uncommitted)', b: 'Reads 80 immediately (RCSI) — NO BLOCKING', locks: 'Reader reads committed snapshot', res: 'good', note: 'Under Read Committed Snapshot Isolation, B reads the last committed version (80) without waiting or seeing dirty data.' }
        ]
      };
      let mode = 'deadlock';
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const s = stepper(() => scenarios[mode].length, i => {
        const st = scenarios[mode][i];
        box.replaceChildren(window.tableWrap('Lock timeline', h('table', { class: 't' },
          h('thead', {}, h('tr', {}, ['Session A', 'Session B', 'Lock / Version State'].map(c => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, h('tr', { class: st.res === 'bad' ? 'fail' : '' },
            h('td', {}, h('code', {}, st.a)),
            h('td', {}, h('code', {}, st.b)),
            h('td', {}, st.locks))))));
        note.textContent = T(st.note);
      });
      const ctl = pills([['deadlock', 'Deadlock (opposite order)'], ['ordered', 'Fixed (same order)'], ['rcsi', 'RCSI readers vs writers']], mode, m => { mode = m; s.reset(); });
      el.append(ctl, s.el, box, note);
      s.start();
    }
  };

  // ---------- 2. SQL: GROUP BY vs Window Function ----------
  VIZ.sqlwindow = {
    title: 'GROUP BY vs window functions', track: 'sql', trackName: 'SQL',
    desc: 'Contrast what GROUP BY does (collapses rows into one bucket per group) against OVER (PARTITION BY … ORDER BY …), which keeps every row and attaches its running total.',
    mount(el) {
      const orders = [
        [101, 'Tech', '2026-01-02', 120],
        [102, 'Home', '2026-01-03', 80],
        [103, 'Tech', '2026-01-05', 300],
        [104, 'Tech', '2026-01-08', 60],
        [105, 'Home', '2026-01-09', 150],
        [106, 'Office', '2026-01-10', 40]
      ];
      let mode = 'groupby';
      const box = h('div', {}), sqlPre = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const draw = () => {
        if (mode === 'groupby') {
          const map = new Map();
          for (const [, cat, , amt] of orders) map.set(cat, (map.get(cat) || 0) + amt);
          const rows = [...map.entries()].map(([cat, sum]) => [cat, sum]);
          sqlPre.replaceChildren(window.codeBlock('SELECT category, SUM(amount) AS total\nFROM orders\nGROUP BY category;', 'sql'));
          box.replaceChildren(window.tableWrap('GROUP BY result', h('table', { class: 't' },
            h('thead', {}, h('tr', {}, ['category', 'total'].map(c => h('th', { scope: 'col' }, c)))),
            h('tbody', {}, rows.map(([c, s2]) => h('tr', {}, h('td', {}, c), h('td', {}, s2)))))));
          note.textContent = T('GROUP BY collapsed 6 individual order rows into 3 category totals — you lose per-order columns like order id and date.');
        } else {
          const run = {}, rank = {};
          const rows = orders.map(([id, cat, dt, amt]) => {
            run[cat] = (run[cat] || 0) + amt;
            rank[cat] = (rank[cat] || 0) + 1;
            return [id, cat, dt, amt, run[cat], rank[cat]];
          });
          sqlPre.replaceChildren(window.codeBlock('SELECT id, category, order_date, amount,\n  SUM(amount) OVER (PARTITION BY category ORDER BY order_date) AS running,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY order_date) AS rn\nFROM orders;', 'sql'));
          box.replaceChildren(window.tableWrap('Window function result', h('table', { class: 't' },
            h('thead', {}, h('tr', {}, ['id', 'category', 'order_date', 'amount', 'running', 'rn'].map(c => h('th', { scope: 'col' }, c)))),
            h('tbody', {}, rows.map(r => h('tr', { class: 'hl' }, r.map(v => h('td', {}, String(v)))))))));
          note.textContent = T('OVER(PARTITION BY … ORDER BY …) keeps all 6 original order rows intact and adds the running sum and rank within each category.');
        }
      };
      const ctl = pills([['groupby', 'GROUP BY (collapses rows)'], ['window', 'Window OVER() (keeps every row)']], mode, m => { mode = m; draw(); });
      el.append(ctl, sqlPre, box, note);
      draw();
    }
  };

  // ---------- 3. Angular: RxJS Flattening Operators ----------
  VIZ.ngrxjs = {
    title: 'RxJS flattening operators', track: 'angular', trackName: 'Angular',
    desc: 'Trigger overlapping async clicks and compare switchMap (cancel stale), exhaustMap (ignore duplicates), concatMap (queue FIFO), and mergeMap (run all concurrently).',
    mount(el) {
      let op = 'switchMap', reqs = [], nextId = 0, busyId = null, noteTxt = 'Pick an operator and click Trigger HTTP request twice quickly.';
      const board = h('div', { class: 'rxjs-board' }), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const labelState = s => ({ running: 'in flight', done: 'completed', cancelled: 'cancelled (stale)', ignored: 'ignored (busy)', queued: 'queued (FIFO)' }[s] || s);

      const triggerOne = () => {
        const id = ++nextId;
        if (op === 'switchMap') {
          reqs.forEach(r => { if (r.state === 'running') r.state = 'cancelled'; });
          reqs.push({ id, state: 'running', pct: 30 });
          busyId = id;
          noteTxt = T('switchMap aborted previous in-flight request and kept only #{id}. Ideal for search typeahead.', { id });
        } else if (op === 'exhaustMap') {
          if (reqs.some(r => r.state === 'running')) {
            reqs.push({ id, state: 'ignored', pct: 0 });
            noteTxt = T('exhaustMap ignored click #{id} because an earlier request is still running. Ideal for Pay/Submit buttons.', { id });
          } else {
            reqs.push({ id, state: 'running', pct: 35 });
            noteTxt = T('exhaustMap started request #{id}; new clicks will be dropped until it completes.', { id });
          }
        } else if (op === 'concatMap') {
          const active = reqs.some(r => r.state === 'running');
          reqs.push({ id, state: active ? 'queued' : 'running', pct: active ? 0 : 35 });
          noteTxt = T(active ? 'concatMap queued #{id} behind the active request to preserve strict order.' : 'concatMap started #{id}.', { id });
        } else {
          reqs.push({ id, state: 'running', pct: 35 });
          noteTxt = T('mergeMap started #{id} in parallel without cancelling or waiting for earlier requests.', { id });
        }
        draw();
      };

      const stepTime = () => {
        let changed = false;
        for (const r of reqs) {
          if (r.state === 'running') {
            r.pct = Math.min(100, r.pct + 35);
            if (r.pct >= 100) r.state = 'done';
            changed = true;
          }
        }
        if (op === 'concatMap' && !reqs.some(r => r.state === 'running')) {
          const next = reqs.find(r => r.state === 'queued');
          if (next) { next.state = 'running'; next.pct = 35; changed = true; }
        }
        if (changed) noteTxt = T('Advanced network time. Notice how queued, cancelled, and concurrent requests resolve.');
        draw();
      };

      const reset = () => { reqs = []; nextId = 0; busyId = null; noteTxt = 'Pick an operator and click Trigger HTTP request twice quickly.'; draw(); };
      const draw = () => {
        board.replaceChildren(...(reqs.length ? reqs.slice(-6).map(r =>
          h('div', { class: 'slot rxjs-row state-' + r.state },
            h('span', {}, `Request #${r.id}`),
            h('div', { class: 'bar', role: 'img', 'aria-label': `Request #${r.id} ${labelState(r.state)}` },
              h('i', { style: { width: (r.state === 'ignored' || r.state === 'cancelled' ? 100 : r.pct) + '%' } })),
            h('span', { class: 'ng-tag' }, T(labelState(r.state))))
        ) : [h('p', { class: 'muted' }, 'No requests yet. Click “Trigger HTTP request” twice before stepping.')]));
        note.textContent = T(noteTxt);
      };
      const opCtl = pills([['switchMap', 'switchMap'], ['exhaustMap', 'exhaustMap'], ['concatMap', 'concatMap'], ['mergeMap', 'mergeMap']], op, m => { op = m; reset(); });
      const actCtl = h('div', { class: 'viz-ctl' },
        btn('Trigger HTTP request', triggerOne),
        btn('Burst 2 rapid clicks', () => { triggerOne(); triggerOne(); }, 'ghost'),
        btn('Advance time', stepTime, 'ghost'),
        btn('Reset', reset, 'ghost'));
      el.append(opCtl, actCtl, board, note);
      draw();
    }
  };

  // ---------- 4. React: useEffect Lifecycle & Stale Closure Race ----------
  VIZ.useeffect = {
    title: 'useEffect lifecycle and race conditions', track: 'react', trackName: 'TypeScript + React',
    desc: 'Contrast missing cleanup against AbortController / ignore cleanup when userId switches from 1 to 2 before the slower fetch finishes.',
    mount(el) {
      let cleanMode = false;
      const steps = [
        { ui: 'Product #1 (loading…)', reqs: 'Fetch #1 in flight (600 ms)', log: 'Mount: render(id=1) → effect #1 runs', bad: false, note: 'First render paints immediately; effect #1 starts fetching id=1.' },
        { ui: 'Product #2 (loading…)', reqs: 'Fetch #1 (still slow) + Fetch #2 (150 ms)', log: cleanMode ? 'cleanup(#1) → cancelled=true · effect #2 starts' : 'No cleanup! Both Fetch #1 & #2 active', bad: false, note: cleanMode ? 'Before running effect #2, React calls cleanup from render #1 to abort/ignore stale results.' : 'User clicks Product 2 quickly. Without cleanup, Fetch #1 is still alive.' },
        { ui: 'Shown: Product #2', reqs: 'Fetch #2 finishes first (valid)', log: 'setState(Product #2)', bad: false, note: 'Fetch #2 responds fast and shows Product #2.' },
        { ui: cleanMode ? 'Shown: Product #2 (stays accurate)' : 'BUG: Overwritten by Product #1!', reqs: 'Slow Fetch #1 finally arrives', log: cleanMode ? 'if (!ignore) blocked stale #1' : 'setState(Product #1) overwrote id=2!', bad: !cleanMode, note: cleanMode ? 'When slow Fetch #1 resolves later, its cleanup flag ignores the stale response.' : 'Slow Fetch #1 arrives AFTER #2 and overwrites the UI with Product #1 while id=2 is selected!' }
      ];
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const s = stepper(() => 4, i => {
        cleanMode = mode === 'clean';
        const st = steps[i];
        const uiText = i === 3 ? (cleanMode ? 'Shown: Product #2 (stays accurate)' : 'BUG: Overwritten by Product #1!') : st.ui;
        const logText = i === 1 ? (cleanMode ? 'cleanup(#1) → ignore=true · effect #2 runs' : 'No cleanup, so Fetch #1 stays live!')
          : i === 3 ? (cleanMode ? 'if (!ignore) dropped stale Fetch #1' : 'Fetch #1 called setState with stale id=1!') : st.log;
        const noteStr = i === 1 ? (cleanMode ? 'Before running effect #2, React runs cleanup(#1), marking its response stale.' : 'User clicks Product #2 quickly. Without cleanup, Fetch #1 continues in the background.')
          : i === 3 ? (cleanMode ? 'Slow Fetch #1 finally arrives, sees ignore === true, and discards the stale response.' : 'Slow Fetch #1 arrives late and overwrites Product #2 with Product #1. Classic race condition!') : st.note;
        const cls = i === 3 ? (cleanMode ? 'good' : 'bad') : '';
        box.replaceChildren(h('div', { class: 'viz-cols' },
          h('div', { class: 'viz-box' }, h('h4', {}, 'Screen state'), h('div', { class: 'slot ' + (cls === 'good' ? 'tt-new' : cls === 'bad' ? 'tt-gone' : '') }, T(uiText))),
          h('div', { class: 'viz-box' }, h('h4', {}, 'Effect log'), h('div', { class: 'slot' }, h('code', {}, T(logText))))));
        note.textContent = T(noteStr);
      });
      let mode = 'race';
      const ctl = pills([['race', 'No cleanup (race condition)'], ['clean', 'With cleanup (ignore / AbortController)']], mode, m => { mode = m; s.reset(); });
      el.append(ctl, s.el, box, note);
      s.start();
    }
  };

  // ---------- 5. CSS: Stacking Context Trap ----------
  VIZ.stacking = {
    title: 'Stacking context sandbox', track: 'css', trackName: 'CSS + Tailwind',
    desc: 'Why z-index: 9999 inside a transformed card still paints behind a z-index: 10 header: transform and opacity < 1 trap all child z-indexes inside a local stacking context.',
    mount(el) {
      let prop = 'transform';
      const stage = h('div', { class: 'stack-stage' }), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const draw = () => {
        const trapped = prop !== 'none';
        const cardStyle = prop === 'transform' ? { transform: 'translateY(0)' }
          : prop === 'opacity' ? { opacity: '0.99' } : {};
        stage.replaceChildren(
          h('div', { class: 'stack-hdr' }, 'Header · z-index: 10'),
          h('div', { class: 'stack-card', style: cardStyle },
            h('span', { class: 'muted' }, trapped ? `Card (${prop === 'transform' ? 'transform: translateY(0)' : 'opacity: 0.99'} → local stacking context)` : 'Card (no stacking context)'),
            h('div', { class: 'stack-pop' }, 'Tooltip · z-index: 9999')));
        note.textContent = T(trapped
          ? 'Card has {p}, creating a local stacking context with implicit root priority 0. Its child z-index: 9999 cannot escape to beat the Header (z-index: 10).'
          : 'With no transform/opacity on Card, the Tooltip participates in the root stacking context and z-index: 9999 paints on top of Header (z-index: 10).', { p: prop });
      };
      const ctl = pills([['transform', 'transform: translateY(0)'], ['opacity', 'opacity: 0.99'], ['none', 'none (normal flow)']], prop, m => { prop = m; draw(); });
      el.append(ctl, stage, note);
      draw();
    }
  };

  // ---------- 6. CS: Backtracking Decision Tree ----------
  VIZ.backtrack = {
    title: 'Backtracking: choose, explore, un-choose', track: 'cs', trackName: 'CS Fundamentals',
    desc: 'Follow DFS building subsets of [1, 2]. Watch path grow down each branch and pop() back up before taking the next decision.',
    mount(el) {
      const steps = [
        { path: '[]', out: '—', action: 'Start at index 0 with empty path [].', node: '[]' },
        { path: '[1]', out: '—', action: 'CHOOSE 1 (include 1) → recurse to index 1.', node: '[1]' },
        { path: '[1, 2]', out: '[1, 2]', action: 'CHOOSE 2 → leaf index 2 reached! Record [1, 2].', node: '[1, 2]' },
        { path: '[1]', out: '[1, 2]', action: 'UN-CHOOSE 2 (path.pop()) to return to [1].', node: '[1]' },
        { path: '[1]', out: '[1, 2], [1]', action: 'SKIP 2 → leaf index 2 reached! Record [1].', node: '[1]*' },
        { path: '[]', out: '[1, 2], [1]', action: 'UN-CHOOSE 1 (path.pop()) back to root [].', node: '[]' },
        { path: '[2]', out: '[1, 2], [1], [2]', action: 'SKIP 1, CHOOSE 2 → leaf reached! Record [2].', node: '[2]' },
        { path: '[]', out: '[1, 2], [1], [2], []', action: 'UN-CHOOSE 2, SKIP 2 → record []. All 4 subsets found.', node: 'done' }
      ];
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const s = stepper(() => steps.length, i => {
        const st = steps[i];
        box.replaceChildren(h('div', { class: 'viz-cols' },
          h('div', { class: 'viz-box' }, h('h4', {}, 'Current path stack'), h('div', { class: 'slot tt-upd' }, h('b', {}, st.path))),
          h('div', { class: 'viz-box' }, h('h4', {}, 'Collected subsets'), h('div', { class: 'slot tt-new' }, h('code', {}, st.out)))));
        note.textContent = T(st.action);
      });
      el.append(s.el, box, note);
      s.start();
    }
  };

  // ---------- 7. CS: Dynamic Programming Table (Coin Change) ----------
  VIZ.dptable = {
    title: 'Greedy vs DP table (coins [1, 3, 4])', track: 'cs', trackName: 'CS Fundamentals',
    desc: 'Target amount 6 with coins [1, 3, 4]. Greedy grabs the biggest coin first (4 + 1 + 1 = 3 coins); DP builds dp[0..6] and finds 3 + 3 = 2 coins.',
    mount(el) {
      const steps = [
        { k: 0, dp: [0, null, null, null, null, null, null], note: 'Base case: 0 coins needed to make amount 0 (dp[0] = 0).' },
        { k: 1, dp: [0, 1, null, null, null, null, null], note: 'dp[1] = 1 + dp[1 - 1] = 1 coin (1).' },
        { k: 2, dp: [0, 1, 2, null, null, null, null], note: 'dp[2] = 1 + dp[2 - 1] = 2 coins (1 + 1).' },
        { k: 3, dp: [0, 1, 2, 1, null, null, null], note: 'dp[3] = min(1+dp[2], 1+dp[0]) = 1 coin (3).' },
        { k: 4, dp: [0, 1, 2, 1, 1, null, null], note: 'dp[4] = min(1+dp[3], 1+dp[1], 1+dp[0]) = 1 coin (4).' },
        { k: 5, dp: [0, 1, 2, 1, 1, 2, null], note: 'dp[5] = 1 + min(dp[4], dp[2], dp[1]) = 2 coins (4 + 1).' },
        { k: 6, dp: [0, 1, 2, 1, 1, 2, 2], note: 'dp[6] = 1 + min(dp[5]=2, dp[3]=1, dp[2]=2) = 2 coins (3 + 3)! Greedy gave 3 coins (4+1+1).' }
      ];
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const s = stepper(() => steps.length, i => {
        const st = steps[i];
        box.replaceChildren(
          h('div', { class: 'dp-strip' }, st.dp.map((v, idx) =>
            h('div', { class: 'slot' + (idx === st.k ? ' tt-new' : '') }, h('small', { class: 'muted' }, `dp[${idx}]`), h('b', {}, v === null ? '?' : String(v))))),
          h('p', { class: 'muted', style: { marginTop: '.5rem' } }, T('Greedy for 6: 4 + 1 + 1 = 3 coins · Optimal DP: 3 + 3 = 2 coins')));
        note.textContent = T(st.note);
      });
      el.append(s.el, box, note);
      s.start();
    }
  };
})();
