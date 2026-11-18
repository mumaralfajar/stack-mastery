// Visualizations for fundamentals: Big-O growth, sorting, the JavaScript event loop, graph search.
(() => {
  const VIZ = window.VIZ = window.VIZ || {}, T = window.t;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = (label, onclick, cls) => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);

  // ---------- Big-O ----------
  VIZ.bigo = {
    title: 'Big-O growth', track: 'cs', trackName: 'CS Fundamentals',
    desc: 'Pick an input size and compare how many steps each complexity class needs. Bars use a log scale so the faster classes stay visible alongside the worst one.',
    mount(el) {
      const sizes = [10, 100, 1000, 10000, 1000000];
      const classes = [
        ['O(1)', 'hash lookup', () => 1], ['O(log n)', 'binary search', n => Math.log2(n)], ['O(n)', 'one loop', n => n],
        ['O(n log n)', 'sorting', n => n * Math.log2(n)], ['O(n²)', 'nested loops', n => n * n], ['O(2ⁿ)', 'all subsets', n => Math.pow(2, n)]
      ];
      const num = x => !isFinite(x) || x > 1e30 ? T('more than 10³⁰') : x >= 1e15 ? x.toExponential(1).replace('e+', ' × 10^') : Math.round(x).toLocaleString('en');
      const time = ops => { const s = ops / 1e8; return !isFinite(s) || s > 3.2e16 ? T('longer than the age of the universe') : s < 1e-3 ? T('instant') : s < 1 ? Math.round(s * 1000) + ' ms' : s < 120 ? s.toFixed(1) + ' s' : s < 7200 ? Math.round(s / 60) + ' ' + T('min') : s < 172800 ? Math.round(s / 3600) + ' ' + T('hours') : s < 6.3e7 ? Math.round(s / 86400) + ' ' + T('days') : Math.round(s / 3.15e7).toLocaleString('en') + ' ' + T('years'); };
      const chips = h('div', { class: 'chips' }), body = h('div', {});
      const draw = n => {
        [...chips.children].forEach(c => c.classList.toggle('on', +c.dataset.n === n));
        body.replaceChildren(window.tableWrap('Big-O comparison', h('table', { class: 't' }, h('thead', {}, h('tr', {}, ['Class', 'Typical cause', 'Steps', '', 'At 100 M steps/s'].map(c => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, classes.map(([name, cause, f]) => {
            const ops = f(n), w = Math.min(Math.log10(Math.max(ops, 1)) / 14 * 100, 100);
            return h('tr', {}, h('td', {}, h('code', {}, name)), h('td', {}, cause), h('td', {}, num(ops)), h('td', { style: { width: '32%' } }, h('div', { class: 'bar', role: 'img', 'aria-label': name }, h('i', { style: { width: Math.max(w, 1.5) + '%' } }))), h('td', {}, time(ops)));
          })))));
      };
      sizes.forEach(n => chips.append(h('button', { type: 'button', 'data-n': n, onclick: () => draw(n) }, T('n = {n}', { n: n.toLocaleString('en') }))));
      el.append(chips, body, h('p', { class: 'viz-note' }, 'Going from n = 1,000 to n = 1,000,000 multiplies O(n) work by a thousand, and O(n²) work by a million. Choosing the right algorithm matters far more than a faster machine.'));
      draw(1000);
    }
  };

  // ---------- sorting ----------
  VIZ.sort = {
    title: 'Sorting algorithms', track: 'cs', trackName: 'CS Fundamentals',
    desc: 'Watch four algorithms sort the same 24 values and compare how many comparisons each one needs.',
    mount(el) {
      const N = 24;
      const algos = {
        'Bubble sort — O(n²)': (a, cmp, set) => { for (let i = a.length - 1; i > 0; i--) for (let j = 0; j < i; j++) if (cmp(j, j + 1) > 0) { const t = a[j]; set(j, a[j + 1]); set(j + 1, t); } },
        'Insertion sort — O(n²)': (a, cmp, set) => { for (let i = 1; i < a.length; i++) for (let j = i; j > 0 && cmp(j - 1, j) > 0; j--) { const t = a[j]; set(j, a[j - 1]); set(j - 1, t); } },
        'Merge sort — O(n log n)': (a, cmp, set) => {
          const sort = (lo, hi) => {
            if (hi - lo < 1) return;
            const mid = (lo + hi) >> 1; sort(lo, mid); sort(mid + 1, hi);
            const out = []; let i = lo, j = mid + 1;
            while (i <= mid && j <= hi) out.push(cmp(i, j) <= 0 ? a[i++] : a[j++]);
            while (i <= mid) out.push(a[i++]); while (j <= hi) out.push(a[j++]);
            out.forEach((v, k) => set(lo + k, v));
          };
          sort(0, a.length - 1);
        },
        'Quick sort — O(n log n) average': (a, cmp, set) => {
          const sort = (lo, hi) => {
            if (lo >= hi) return;
            let p = lo;
            for (let i = lo; i < hi; i++) if (cmp(i, hi) < 0) { const t = a[i]; set(i, a[p]); set(p, t); p++; }
            const t = a[hi]; set(hi, a[p]); set(p, t);
            sort(lo, p - 1); sort(p + 1, hi);
          };
          sort(0, a.length - 1);
        }
      };
      let values = [], run = 0;
      const bars = h('div', { class: 'sortbars' }), count = h('b', {}, '0'), note = h('p', { class: 'viz-note' }, 'Pick an algorithm and press Sort.');
      const sel = h('select', { 'aria-label': 'Algorithm' }, Object.keys(algos).map(k => h('option', {}, k)));
      const paint = (hot = []) => bars.replaceChildren(...values.map((v, i) => h('i', { class: hot.includes(i) ? 'hot' : '', style: { height: v * 4 + 8 + 'px' } })));
      const shuffle = () => { run++; values = Array.from({ length: N }, (_, i) => i + 1).sort(() => Math.random() - .5); count.textContent = '0'; paint(); };
      const sort = async () => {
        const me = ++run, a = values.slice(), frames = []; let c = 0;
        // Record every comparison and write, then replay them as animation frames.
        algos[sel.value](a, (i, j) => { c++; frames.push({ hot: [i, j], c }); return a[i] - a[j]; }, (i, v) => { a[i] = v; frames.push({ set: [i, v], hot: [i], c }); });
        const delay = still() ? 0 : Math.max(8, Math.min(60, 4000 / frames.length));
        for (const f of frames) {
          if (me !== run) return;
          if (f.set) values[f.set[0]] = f.set[1];
          count.textContent = f.c; paint(f.hot);
          if (delay) await sleep(delay);
        }
        paint();
        note.textContent = T('{algo} used {c} comparisons for {n} values. n² is {sq}; n·log₂n is about {nlog}.', { algo: sel.value.split(' — ')[0], c, n: N, sq: N * N, nlog: Math.round(N * Math.log2(N)) });
      };
      el.append(h('div', { class: 'viz-ctl' }, sel, btn('Sort', sort), btn('Shuffle', shuffle, 'ghost'), h('span', {}, 'Comparisons: ', count)), bars, note);
      shuffle();
    }
  };

  // ---------- event loop ----------
  VIZ.eventloop = {
    title: 'The JavaScript event loop', track: 'react', trackName: 'TypeScript + React',
    desc: 'Four lines, one thread. Step through to see why the output order is 1, 2, 3, 4.',
    mount(el) {
      const lines = ['console.log("1 sync");', 'setTimeout(() => console.log("4 timeout"), 0);', 'Promise.resolve().then(() => console.log("3 microtask"));', 'console.log("2 sync");'];
      const steps = [
        { line: 0, stack: ['main script', 'console.log'], micro: [], task: [], out: ['1 sync'], note: 'Synchronous code runs immediately, top to bottom, on the single thread.' },
        { line: 1, stack: ['main script', 'setTimeout'], micro: [], task: ['timeout callback'], out: ['1 sync'], note: "setTimeout doesn't run the callback right away. It tells the browser to queue it as a TASK when the timer ends, even if the delay is 0." },
        { line: 2, stack: ['main script', 'then'], micro: ['promise callback'], task: ['timeout callback'], out: ['1 sync'], note: 'The promise is already resolved, so its callback is queued as a MICROTASK. It still does not run yet.' },
        { line: 3, stack: ['main script', 'console.log'], micro: ['promise callback'], task: ['timeout callback'], out: ['1 sync', '2 sync'], note: 'The script keeps going. Nothing queued can interrupt running synchronous code.' },
        { line: -1, stack: [], micro: ['promise callback'], task: ['timeout callback'], out: ['1 sync', '2 sync'], note: 'The script has finished and the call stack is empty. The event loop now checks the microtask queue FIRST.' },
        { line: 2, stack: ['promise callback'], micro: [], task: ['timeout callback'], out: ['1 sync', '2 sync', '3 microtask'], note: 'All microtasks run until the queue is empty, before any task and before the browser can repaint.' },
        { line: 1, stack: ['timeout callback'], micro: [], task: [], out: ['1 sync', '2 sync', '3 microtask', '4 timeout'], note: 'Only now does the event loop take ONE task: the timeout callback. After it, microtasks would be checked again.' },
        { line: -1, stack: [], micro: [], task: [], out: ['1 sync', '2 sync', '3 microtask', '4 timeout'], note: 'Done. Order: synchronous code → all microtasks → one task → microtasks again → next task…' }
      ];
      const lis = lines.map(l => h('li', {}, l));
      const box = title => { const b = h('div', {}); return [h('div', { class: 'viz-box' }, h('h4', {}, title), b), b]; };
      const [stackB, stack] = box('Call stack'), [microB, micro] = box('Microtask queue (promises)'), [taskB, task] = box('Task queue (timers, events)'), [outB, out] = box('Console');
      const note = h('p', { class: 'viz-note' }), label = h('span', { class: 'muted' });
      let i = 0;
      const fill = (el, items) => el.replaceChildren(...(items.length ? items.map(x => h('div', { class: 'slot' }, x)) : [h('p', { class: 'muted' }, 'empty')]));
      const back = btn('← Back', () => { i--; draw(); }, 'ghost'), next = btn('Next →', () => { i++; draw(); });
      const draw = () => {
        const s = steps[i];
        lis.forEach((li, j) => li.className = j === s.line ? 'cur' : 'done');
        fill(stack, s.stack.toReversed()); fill(micro, s.micro); fill(task, s.task); fill(out, s.out);
        note.textContent = T(s.note); label.textContent = T('Step {i} of {n}', { i: i + 1, n: steps.length });
        back.disabled = i === 0; next.disabled = i === steps.length - 1;
      };
      el.append(h('div', { class: 'viz-ctl' }, back, next, btn('Reset', () => { i = 0; draw(); }, 'ghost'), label), h('ol', { class: 'lines' }, lis),
        h('div', { class: 'viz-cols' }, stackB, outB, microB, taskB), note);
      draw();
    }
  };
  // ---------- graph search: BFS vs DFS ----------
  VIZ.graphsearch = {
    title: 'BFS and DFS on a graph', track: 'cs', trackName: 'CS Fundamentals',
    desc: 'Search from A to F with each algorithm and compare the path each one finds. BFS uses a queue and spreads out in rings; DFS follows one path as deep as it can.',
    mount(el) {
      // Neighbour order is part of the picture: DFS tries G first, which leads it the long way round.
      const pos = { A: [50, 95], G: [50, 190], B: [170, 35], C: [170, 120], H: [260, 205], D: [300, 35], E: [330, 125], F: [450, 80] };
      const adj = { A: ['G', 'B', 'C'], G: ['A', 'H'], H: ['G', 'E'], E: ['H', 'C', 'F'], C: ['A', 'E'], B: ['A', 'D'], D: ['B', 'F'], F: ['D', 'E'] };
      const edges = [];
      for (const [a, ns] of Object.entries(adj)) for (const b of ns) if (a < b) edges.push([a, b]);
      const START = 'A', GOAL = 'F';

      const bfsSteps = () => {
        const steps = [], dist = { [START]: 0 }, parent = {}, order = [], queue = [START];
        steps.push({ cur: null, seen: [START], frontier: [...queue], order: [], dist: { ...dist }, note: T('Start at {node}: distance 0. It goes into the queue.', { node: START }) });
        while (queue.length) {
          const n = queue.shift(); order.push(n);
          if (n === GOAL) {
            const path = [n]; while (parent[path[0]]) path.unshift(parent[path[0]]);
            steps.push({ cur: n, seen: Object.keys(dist), frontier: [...queue], order: [...order], dist: { ...dist }, path,
              note: T('{node} reached at distance {d}: {path}. BFS finishes every node at distance {prev} before any at distance {d}, so the first path it finds is a shortest one.', { node: n, d: dist[n], prev: dist[n] - 1, path: path.join(' → ') }) });
            break;
          }
          const added = [];
          for (const m of adj[n]) if (!(m in dist)) { dist[m] = dist[n] + 1; parent[m] = n; queue.push(m); added.push(m); }
          steps.push({ cur: n, seen: Object.keys(dist), frontier: [...queue], order: [...order], dist: { ...dist },
            note: T('Take {node} from the front of the queue (distance {d}). Unvisited neighbours go to the back: {added}.', { node: n, d: dist[n], added: added.join(', ') || T('none') }) });
        }
        return steps;
      };
      const dfsSteps = () => {
        const steps = [], seen = new Set(), order = [], stack = [];
        let found = null;
        const visit = n => {
          seen.add(n); order.push(n); stack.push(n);
          if (n === GOAL) {
            found = [...stack];
            steps.push({ cur: n, seen: [...seen], frontier: [...stack], order: [...order], path: found,
              note: T('{node} found via {path}: {n} steps. DFS found a path, but not the shortest: BFS needs 3.', { node: n, path: found.join(' → '), n: found.length - 1 }) });
            return;
          }
          steps.push({ cur: n, seen: [...seen], frontier: [...stack], order: [...order],
            note: T('Go deeper to {node}. The recursion stack is the current path: {path}.', { node: n, path: stack.join(' → ') }) });
          for (const m of adj[n]) { if (found) return; if (!seen.has(m)) visit(m); }
          if (found) return;
          stack.pop();
          steps.push({ cur: stack[stack.length - 1], seen: [...seen], frontier: [...stack], order: [...order],
            note: T('{node} has no unvisited neighbours left, so the recursion returns to {back}.', { node: n, back: stack[stack.length - 1] }) });
        };
        visit(START);
        return steps;
      };

      let mode = 'bfs', steps = bfsSteps(), i = 0;
      const svg = h('div', { class: 'gviz' }), note = h('p', { class: 'viz-note' }), label = h('span', { class: 'muted' });
      const fBox = h('div', {}), oBox = h('div', {}), fTitle = h('h4', {});
      const pick = m => { mode = m; steps = m === 'bfs' ? bfsSteps() : dfsSteps(); i = 0; bfsB.classList.toggle('ghost', m !== 'bfs'); dfsB.classList.toggle('ghost', m !== 'dfs'); draw(); };
      const bfsB = btn('BFS (queue)', () => pick('bfs')), dfsB = btn('DFS (recursion)', () => pick('dfs'), 'ghost');
      const back = btn('← Back', () => { i--; draw(); }, 'ghost'), next = btn('Next →', () => { i++; draw(); });
      const fill = (box, items) => box.replaceChildren(...(items.length ? items.map(x => h('div', { class: 'slot' }, x)) : [h('p', { class: 'muted' }, 'empty')]));
      const draw = () => {
        const s = steps[i], path = s.path || [];
        const onPath = (a, b) => path.some((p, k) => k > 0 && ((path[k - 1] === a && p === b) || (path[k - 1] === b && p === a)));
        const state = n => n === s.cur ? 'cur' : path.includes(n) ? 'path' : s.frontier.includes(n) ? 'front' : s.seen.includes(n) ? 'seen' : '';
        svg.innerHTML = `<svg viewBox="0 0 500 240" role="img" aria-label="${T('Graph with nodes A to H')}">` +
          edges.map(([a, b]) => `<line class="${onPath(a, b) ? 'path' : ''}" x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`).join('') +
          Object.entries(pos).map(([n, [x, y]]) => `<g class="${state(n)}"><circle cx="${x}" cy="${y}" r="19"/><text x="${x}" y="${y + 5}" text-anchor="middle">${n}</text>` +
            (s.dist && n in s.dist ? `<text class="d" x="${x + 22}" y="${y - 16}">${s.dist[n]}</text>` : '') + '</g>').join('') + '</svg>';
        fTitle.textContent = T(mode === 'bfs' ? 'Queue (front first)' : 'Recursion stack (top first)');
        fill(fBox, mode === 'bfs' ? s.frontier : s.frontier.toReversed()); fill(oBox, s.order);
        note.textContent = s.note; label.textContent = T('Step {i} of {n}', { i: i + 1, n: steps.length });
        back.disabled = i === 0; next.disabled = i === steps.length - 1;
      };
      const legend = h('div', { class: 'gviz-legend', 'aria-hidden': 'true' },
        h('span', { class: 'gl cur' }, h('i'), 'Current node'),
        h('span', { class: 'gl front' }, h('i'), 'In frontier'),
        h('span', { class: 'gl seen' }, h('i'), 'Visited'),
        h('span', { class: 'gl path' }, h('i'), 'Found path')
      );
      el.append(h('div', { class: 'viz-ctl' }, bfsB, dfsB), h('div', { class: 'viz-ctl' }, back, next, btn('Reset', () => { i = 0; draw(); }, 'ghost'), label), svg, legend,
        h('div', { class: 'viz-cols' }, h('div', { class: 'viz-box' }, fTitle, fBox), h('div', { class: 'viz-box' }, h('h4', {}, 'Visited, in order'), oBox)), note);
      draw();
    }
  };
})();
