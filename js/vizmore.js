// Visualizations for fundamentals: Big-O growth, sorting, the JavaScript event loop.
(() => {
  const VIZ = window.VIZ;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = (label, onclick, cls) => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);

  // ---------- Big-O ----------
  VIZ.bigo = {
    title: 'Big-O growth', track: 'cs', trackName: 'CS Fundamentals',
    desc: 'Pick an input size and compare how many steps each complexity class needs. Bars use a logarithmic scale — otherwise only the worst one would be visible.',
    mount(el) {
      const sizes = [10, 100, 1000, 10000, 1000000];
      const classes = [
        ['O(1)', 'hash lookup', () => 1], ['O(log n)', 'binary search', n => Math.log2(n)], ['O(n)', 'one loop', n => n],
        ['O(n log n)', 'sorting', n => n * Math.log2(n)], ['O(n²)', 'nested loops', n => n * n], ['O(2ⁿ)', 'all subsets', n => Math.pow(2, n)]
      ];
      const num = x => !isFinite(x) || x > 1e30 ? 'more than 10³⁰' : x >= 1e15 ? x.toExponential(1).replace('e+', ' × 10^') : Math.round(x).toLocaleString('en');
      const time = ops => { const s = ops / 1e8; return !isFinite(s) || s > 3.2e16 ? 'longer than the age of the universe' : s < 1e-3 ? 'instant' : s < 1 ? Math.round(s * 1000) + ' ms' : s < 120 ? s.toFixed(1) + ' s' : s < 7200 ? Math.round(s / 60) + ' min' : s < 172800 ? Math.round(s / 3600) + ' hours' : s < 6.3e7 ? Math.round(s / 86400) + ' days' : Math.round(s / 3.15e7).toLocaleString('en') + ' years'; };
      const chips = h('div', { class: 'chips' }), body = h('div', {});
      const draw = n => {
        [...chips.children].forEach(c => c.classList.toggle('on', +c.dataset.n === n));
        body.replaceChildren(h('table', { class: 't' }, h('thead', {}, h('tr', {}, ['Class', 'Typical cause', 'Steps', '', 'At 100 M steps/s'].map(c => h('th', {}, c)))),
          h('tbody', {}, classes.map(([name, cause, f]) => {
            const ops = f(n), w = Math.min(Math.log10(Math.max(ops, 1)) / 14 * 100, 100);
            return h('tr', {}, h('td', {}, h('code', {}, name)), h('td', {}, cause), h('td', {}, num(ops)), h('td', { style: { width: '32%' } }, h('div', { class: 'bar' }, h('i', { style: { width: Math.max(w, 1.5) + '%' } }))), h('td', {}, time(ops)));
          }))));
      };
      sizes.forEach(n => chips.append(h('button', { type: 'button', 'data-n': n, onclick: () => draw(n) }, 'n = ' + n.toLocaleString('en'))));
      el.append(chips, body, h('p', { class: 'viz-note' }, 'Going from n = 1,000 to n = 1,000,000 multiplies O(n) work by a thousand — and O(n²) work by a million. Choosing the right algorithm matters far more than a faster computer.'));
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
        note.textContent = `${sel.value.split(' — ')[0]} used ${c} comparisons for ${N} values. n² is ${N * N}; n·log₂n is about ${Math.round(N * Math.log2(N))}.`;
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
        { line: 1, stack: ['main script', 'setTimeout'], micro: [], task: ['timeout callback'], out: ['1 sync'], note: 'setTimeout does not run the callback. It asks the browser to queue it as a TASK when the timer ends — even with a delay of 0.' },
        { line: 2, stack: ['main script', 'then'], micro: ['promise callback'], task: ['timeout callback'], out: ['1 sync'], note: 'The promise is already resolved, so its callback is queued as a MICROTASK. It still does not run yet.' },
        { line: 3, stack: ['main script', 'console.log'], micro: ['promise callback'], task: ['timeout callback'], out: ['1 sync', '2 sync'], note: 'The script keeps going. Nothing queued can interrupt running synchronous code.' },
        { line: -1, stack: [], micro: ['promise callback'], task: ['timeout callback'], out: ['1 sync', '2 sync'], note: 'The script has finished and the call stack is empty. The event loop now checks the microtask queue FIRST.' },
        { line: 2, stack: ['promise callback'], micro: [], task: ['timeout callback'], out: ['1 sync', '2 sync', '3 microtask'], note: 'All microtasks run until the queue is empty — before any task, and before the browser can render.' },
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
        fill(stack, s.stack.slice().reverse()); fill(micro, s.micro); fill(task, s.task); fill(out, s.out);
        note.textContent = s.note; label.textContent = `Step ${i + 1} of ${steps.length}`;
        back.disabled = i === 0; next.disabled = i === steps.length - 1;
      };
      el.append(h('div', { class: 'viz-ctl' }, back, next, btn('Reset', () => { i = 0; draw(); }, 'ghost'), label), h('ol', { class: 'lines' }, lis),
        h('div', { class: 'viz-cols' }, stackB, outB, microB, taskB), note);
      draw();
    }
  };
})();
