// Interactive visualizations. Each entry: { title, desc, track, trackName, mount(el) }.
(() => {
  const T = window.t;   // `t` is used as a local name in this file
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const btn = (label, onclick, cls) => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);
  const check = (label, checked, onchange) => { const cb = h('input', { type: 'checkbox', onchange }); cb.checked = checked; return [h('label', {}, cb, label), cb]; };
  const table = (cols, rows, rowClass, cap) => window.tableWrap(cap || 'Comparison table', h('table', { class: 't' },
    h('thead', {}, h('tr', {}, cols.map(c => h('th', { scope: 'col' }, c)))),
    h('tbody', {}, rows.map((r, i) => h('tr', { class: rowClass ? rowClass(r, i) : null }, r.map(v => v == null ? h('td', { class: 'null' }, 'NULL') : h('td', {}, v)))))));

  // Back / Next / Reset controls driving draw(i).
  function stepper(n, draw) {
    let i = 0;
    const label = h('span', { class: 'muted' });
    const back = btn('← Back', () => { i--; upd(); }, 'ghost'), next = btn('Next →', () => { i++; upd(); });
    const upd = () => { label.textContent = T('Step {i} of {n}', { i: i + 1, n }); back.disabled = i === 0; next.disabled = i === n - 1; draw(i); };
    return { el: h('div', { class: 'viz-ctl' }, back, next, btn('Reset', () => { i = 0; upd(); }, 'ghost'), label), start: upd };
  }
  const codeLines = lines => { const lis = lines.map(l => h('li', {}, l)); return { el: h('ol', { class: 'lines' }, lis), set: (cur, done) => lis.forEach((li, j) => li.className = j === cur ? 'cur' : done(j) ? 'done' : '') }; };

  const VIZ = window.VIZ = window.VIZ || {};

  // ---------- C#: stack & heap ----------
  VIZ.stackheap = {
    title: 'Stack and heap', track: 'csharp', trackName: 'C#',
    desc: 'Step through six lines and watch what is copied: a value, or a reference to a shared object.',
    mount(el) {
      const code = codeLines(['int a = 5;', 'int b = a;', 'b = 9;', 'var p1 = new Person("Ana");', 'var p2 = p1;', 'p2.Name = "Budi";']);
      const steps = [
        { stack: [['a', '5']], note: 'a is a value type: the variable’s slot holds the number 5 itself.', hot: 'a' },
        { stack: [['a', '5'], ['b', '5']], note: 'Assignment copies the VALUE. b gets its own independent 5.', hot: 'b' },
        { stack: [['a', '5'], ['b', '9']], note: 'Changing b does not touch a. Two separate boxes.', hot: 'b' },
        { stack: [['a', '5'], ['b', '9'], ['p1', '→ #1']], heap: 'Ana', note: 'new Person(...) creates an object on the heap. p1 holds a reference (an address) to it, not the object.', hot: 'p1' },
        { stack: [['a', '5'], ['b', '9'], ['p1', '→ #1'], ['p2', '→ #1']], heap: 'Ana', note: 'Assignment copies the REFERENCE. p1 and p2 now point to the same single object.', hot: 'p2' },
        { stack: [['a', '5'], ['b', '9'], ['p1', '→ #1'], ['p2', '→ #1']], heap: 'Budi', heapHot: true, note: 'Changing the object through p2 updates what p1 sees, because both point to one Person. p1.Name is now "Budi".', hot: 'p2' }
      ];
      const stack = h('div', {}), heap = h('div', {}), note = h('p', { class: 'viz-note' });
      const s = stepper(steps.length, i => {
        const st = steps[i];
        code.set(i, j => j < i);
        stack.replaceChildren(...st.stack.map(([n, v]) => h('div', { class: 'slot' + (n === st.hot ? ' hot' : '') }, h('span', {}, n), h('b', {}, v))));
        heap.replaceChildren(st.heap ? h('div', { class: 'slot' + (st.heapHot ? ' hot' : '') }, h('span', {}, '#1 Person'), h('b', {}, `Name = "${st.heap}"`)) : h('p', { class: 'muted' }, 'empty'));
        note.textContent = T(st.note);
      });
      el.append(s.el, code.el, h('div', { class: 'viz-cols' }, h('div', { class: 'viz-box' }, h('h4', {}, 'Stack (local variables)'), stack), h('div', { class: 'viz-box' }, h('h4', {}, 'Heap (objects)'), heap)), note);
      s.start();
    }
  };

  // ---------- C#: async timeline ----------
  VIZ.async = {
    title: 'Async timeline', track: 'csharp', trackName: 'C#',
    desc: 'Three I/O calls take 1.0 s, 1.5 s and 0.8 s. Compare blocking, awaiting one by one, and awaiting all together.',
    mount(el) {
      const ops = [['Call A', 1.0], ['Call B', 1.5], ['Call C', 0.8]], total = 3.3, K = 650;
      const modes = {
        block: { label: '.Result (blocking)', note: 'Total 3.3 s, with the thread BLOCKED the whole time so it serves nobody else. Under load this starves the thread pool.' },
        seq: { label: 'await one by one', note: 'Total stays 3.3 s, yet the thread stays free between awaits and can handle other requests meanwhile.' },
        all: { label: 'Task.WhenAll', note: 'All three calls run concurrently. Total equals the slowest call (1.5 s), while the thread stays free during I/O.' }
      };
      const gantt = h('div', { class: 'gantt' }), note = h('p', { class: 'viz-note' });
      const chips = h('div', { class: 'chips' });
      const draw = mode => {
        [...chips.children].forEach(c => c.classList.toggle('on', c.dataset.m === mode));
        const segs = { Thread: [] }; let t = 0;
        ops.forEach(([name, d]) => { const start = mode === 'all' ? 0 : t; segs[name] = [[start, d, 'io']]; t += d; });
        if (mode === 'block') segs.Thread = [[0, total, 'block']];
        else if (mode === 'seq') segs.Thread = [[0, .06, ''], [1.0, .06, ''], [2.5, .06, ''], [3.3 - .06, .06, '']];
        else segs.Thread = [[0, .06, ''], [1.5, .06, '']];
        gantt.replaceChildren(...Object.entries(segs).map(([name, list]) => h('div', { class: 'lane' }, h('span', {}, name), h('div', { class: 'lane-t' }, list.map(([s, d, cls]) => {
          const seg = h('i', { class: 'seg ' + cls, style: { left: s / total * 100 + '%', width: d / total * 100 + '%', transformOrigin: 'left' } });
          if (seg.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches)
            seg.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: Math.max(d * K, 80), delay: s * K, fill: 'backwards', easing: 'linear' });
          return seg;
        })))));
        note.textContent = T(modes[mode].note);
      };
      Object.entries(modes).forEach(([m, x]) => chips.append(h('button', { type: 'button', 'data-m': m, onclick: () => draw(m) }, x.label)));
      el.append(chips, gantt, h('p', { class: 'muted' }, 'Red = thread blocked · solid = thread working · green = I/O in flight, no thread used · full width = 3.3 s'), note);
      draw('block');
    }
  };

  // ---------- C#: LINQ pipeline ----------
  VIZ.linq = {
    title: 'LINQ pipeline', track: 'csharp', trackName: 'C#',
    desc: 'Toggle operators and follow each item through the chain. Struck-out items were dropped at that stage.',
    mount(el) {
      const src = [5, 12, 8, 3, 20, 7, 14, 1];
      const defs = [
        ['.Where(n => n > 4)', a => a.filter(n => n > 4)],
        ['.Select(n => n * 2)', a => a.map(n => n * 2)],
        ['.OrderBy(n => n)', a => a.toSorted((x, y) => x - y)],
        ['.Take(3)', a => a.slice(0, 3)]
      ];
      const on = [true, true, false, true];
      const out = h('div', {}), ctl = h('div', { class: 'viz-ctl' }), pullLog = h('div', { class: 'cells', style: { marginTop: '.5rem' } });
      const cells = (vals, gone = []) => h('div', { class: 'cells' }, vals.map(v => h('span', { class: 'cell' + (gone.includes(v) ? ' out' : '') }, v)));
      const draw = () => {
        pullLog.replaceChildren();
        let cur = src; const rows = [h('div', { class: 'stage-row' }, h('code', {}, 'numbers'), cells(src))];
        defs.forEach(([name, fn], i) => {
          if (!on[i]) return;
          const next = fn(cur), dropped = i === 0 || i === 3;
          rows.push(h('div', { class: 'stage-row' }, h('code', {}, name), dropped ? cells(cur, cur.filter(v => !next.includes(v))) : cells(next)));
          cur = next;
        });
        rows.push(h('div', { class: 'stage-row' }, h('code', {}, '.ToList()  ← runs here'), h('div', { class: 'cells' }, cur.map(v => h('span', { class: 'cell hit' }, v)))));
        out.replaceChildren(...rows);
      };
      const stepPull = async () => {
        const need = on[3] ? 3 : src.length;
        if (on[2]) { draw(); pullLog.replaceChildren(h('p', { class: 'muted' }, 'OrderBy must buffer and inspect every item before yielding the smallest one.')); return; }
        let kept = 0, inspected = 0;
        const pills = [];
        for (const v of src) {
          inspected++;
          if (on[0] && v <= 4) { pills.push(h('span', { class: 'cell out' }, `${v} skip`)); continue; }
          const outV = on[1] ? v * 2 : v;
          kept++;
          pills.push(h('span', { class: 'cell hit' }, on[1] ? `${v}→${outV}` : String(outV)));
          if (kept >= need) break;
        }
        pullLog.replaceChildren(h('p', { class: 'muted' }, T('Lazy iterator inspected {i} of {n} source items and stopped once {k} matched.', { i: inspected, n: src.length, k: kept })), h('div', { class: 'cells' }, pills));
      };
      defs.forEach(([name], i) => { const [lab] = check(name, on[i], e => { on[i] = e.target.checked; draw(); }); ctl.append(lab); });
      ctl.append(btn('Trace item-by-item pull', stepPull, 'ghost'));
      el.append(ctl, out, pullLog, h('p', { class: 'viz-note' }, 'Deferred execution: the chain only builds a recipe. Nothing runs until enumeration starts at ToList().'));
      draw();
    }
  };

  // ---------- ASP.NET: middleware pipeline ----------
  VIZ.middleware = {
    title: 'Middleware pipeline', track: 'aspnet', trackName: 'ASP.NET Core',
    desc: 'Send a request and watch it travel in through each middleware and back out in reverse. Try it without a token, or with a failing endpoint.',
    mount(el) {
      const names = [['ExceptionHandler', 'catches errors'], ['HttpsRedirection', 'forces HTTPS'], ['Routing', 'picks endpoint'], ['Authentication', 'who are you?'], ['Authorization', 'allowed?'], ['Endpoint', 'your code']];
      const boxes = names.map(([n, d]) => h('div', { class: 'mw' }, n, h('small', {}, d)));
      const log = h('ol', { class: 'log' }), note = h('p', { class: 'viz-note' }, 'Press “Send request”.');
      const [tokLab, tok] = check('Request has a valid token', true), [errLab, err] = check('Endpoint throws an exception', false);
      let run = 0;
      const say = (text, cls) => { log.append(h('li', { class: cls }, text)); log.scrollTop = log.scrollHeight; };
      const send = async () => {
        const me = ++run, D = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
        const mark = async (i, cls, text, lc) => { if (me !== run) throw 0; boxes[i].className = 'mw ' + cls; say(text, lc); await sleep(D); };
        boxes.forEach(b => b.className = 'mw'); log.replaceChildren(); note.textContent = T('Request travelling…');
        try {
          say('GET /secret');
          let last = 5, status = '200 OK';
          for (let i = 0; i < 6; i++) {
            if (i === 3) await mark(i, 'in', T(tok.checked ? '→ Authentication: token valid, user = ana' : '→ Authentication: no token, user = anonymous'));
            else if (i === 4 && !tok.checked) { await mark(i, 'stop', T('✗ Authorization: not authenticated → 401. SHORT-CIRCUIT: next() is never called'), 'x'); last = 3; status = '401 Unauthorized'; break; }
            else if (i === 5 && err.checked) { await mark(i, 'stop', T('✗ Endpoint throws InvalidOperationException'), 'x'); status = '500'; last = 4; break; }
            else if (i === 5) await mark(i, 'outb', T('✓ Endpoint runs → 200 OK'), 'b');
            else await mark(i, 'in', `→ ${names[i][0]}`);
          }
          if (status === '200 OK') last = 4;
          for (let i = last; i >= 0; i--) {
            if (status === '500' && i > 0) await mark(i, 'stop', T('  exception passes up through {name}', { name: names[i][0] }), 'x');
            else if (status === '500') { await mark(0, 'outb', T('← ExceptionHandler catches it → 500 ProblemDetails'), 'b'); status = '500 Internal Server Error'; }
            else await mark(i, 'outb', T('← {name} (code after next())', { name: names[i][0] }), 'b');
          }
          note.textContent = `Response: ${status}. ` + T(status.startsWith('401') ? 'The endpoint never ran because authorization short-circuited the pipeline.' : status.startsWith('500') ? 'Only the outermost middleware could catch the exception, which is why it must come first.' : 'In through six stages, back out through the same stages in reverse.');
        } catch { /* superseded by a newer run */ }
      };
      el.append(h('div', { class: 'viz-ctl' }, btn('Send request', send), tokLab, errLab), h('div', { class: 'pipe' }, boxes), log, note);
    }
  };

  // ---------- ASP.NET: DI lifetimes ----------
  VIZ.di = {
    title: 'Service lifetimes', track: 'aspnet', trackName: 'ASP.NET Core',
    desc: 'Each request resolves every service twice: once in the endpoint and once inside a dependency. Compare the instance IDs.',
    mount(el) {
      let req = 0, n = 0; const rows = [];
      const id = v => h('span', { class: 'id', style: { background: `hsl(${(v * 67) % 360} 65% 50% / .28)` } }, '#' + v);
      let singleton = ++n;
      const body = h('div', {}), note = h('p', { class: 'viz-note' }, 'Send a few requests. Same colour = same object instance.');
      const draw = () => body.replaceChildren(table(['Request', 'Singleton', 'Scoped', 'Transient'], rows));
      const send = () => {
        req++; const scoped = ++n, t1 = ++n, t2 = ++n;
        const pair = (a, b) => h('span', {}, id(a), ' ', id(b));
        rows.push([req, pair(singleton, singleton), pair(scoped, scoped), pair(t1, t2)]);
        draw();
        if (req >= 2) note.textContent = T('Singleton: one instance forever. Scoped: one per request, shared within it. Transient: a new one every single time it is asked for.');
      };
      el.append(h('div', { class: 'viz-ctl' }, btn('Send request', send), btn('Restart app', () => {
        rows.length = 0; req = 0; singleton = ++n; send();
        note.textContent = T('App restarted with a fresh singleton ({id}). Send requests to compare with earlier runs.', { id: '#' + singleton });
      }, 'ghost')), body, note);
      send();
    }
  };

  // ---------- SQL: joins ----------
  VIZ.joins = {
    title: 'JOIN explorer', track: 'sql', trackName: 'SQL',
    desc: 'Dewi has no orders, and order 105 has no customer. Switch join types and see which rows survive.',
    mount(el) {
      const C = [[1, 'Ana'], [2, 'Budi'], [3, 'Citra'], [4, 'Dewi']];
      const O = [[101, 1, 'Laptop'], [102, 1, 'Mouse'], [103, 2, 'Desk'], [104, 3, 'Lamp'], [105, null, 'Chair']];
      const types = ['INNER', 'LEFT', 'RIGHT', 'FULL OUTER', 'CROSS'];
      const chips = h('div', { class: 'chips' }), out = h('div', {}), note = h('p', { class: 'viz-note' });
      const notes = {
        INNER: 'Only pairs that match on both sides. Dewi and order 105 disappear.',
        LEFT: 'Every customer is kept. Dewi appears once with NULL order columns.',
        RIGHT: 'Every order is kept. Order 105 appears with NULL customer columns.',
        'FULL OUTER': 'Everything from both sides, padding unmatched rows with NULL.',
        CROSS: 'No join condition: every customer pairs with every order (4 × 5 = 20 rows).'
      };
      const draw = type => {
        [...chips.children].forEach(c => c.classList.toggle('on', c.textContent === type));
        let rows = [];
        if (type === 'CROSS') C.forEach(c => O.forEach(o => rows.push([...c, o[0], o[2]])));
        else {
          C.forEach(c => { const m = O.filter(o => o[1] === c[0]); m.forEach(o => rows.push([...c, o[0], o[2]])); if (!m.length && (type === 'LEFT' || type === 'FULL OUTER')) rows.push([...c, null, null]); });
          if (type === 'RIGHT' || type === 'FULL OUTER') O.filter(o => !C.some(c => c[0] === o[1])).forEach(o => rows.push([null, null, o[0], o[2]]));
        }
        const keptC = new Set(rows.map(r => r[0])), keptO = new Set(rows.map(r => r[2]));
        const on = type === 'CROSS' ? '' : '\n  ON o.customer_id = c.id';
        out.replaceChildren(
          h('div', { class: 'viz-cols' },
            h('div', { class: 'viz-box' }, h('h4', {}, 'customers c'), table(['id', 'name'], C, r => keptC.has(r[0]) ? '' : 'dim')),
            h('div', { class: 'viz-box' }, h('h4', {}, 'orders o'), table(['id', 'customer_id', 'item'], O, r => keptO.has(r[0]) ? '' : 'dim'))),
          codeBlock(`SELECT c.id, c.name, o.id AS order_id, o.item\nFROM customers AS c\n${type} JOIN orders AS o${on};`, 'sql'),
          h('div', { class: 'viz-box', style: { marginTop: '.8rem' } }, h('h4', {}, T('Result: {n} rows', { n: rows.length })), table(['c.id', 'c.name', 'order_id', 'item'], rows)));
        note.textContent = T(notes[type]);
      };
      types.forEach(t => chips.append(h('button', { type: 'button', onclick: () => draw(t) }, t)));
      el.append(chips, out, note);
      draw('INNER');
    }
  };

  // ---------- SQL: logical execution order ----------
  VIZ.sqlorder = {
    title: 'Query execution order', track: 'sql', trackName: 'SQL',
    desc: 'A query is written SELECT-first but evaluated FROM-first. Step through the logical order and watch the rows change.',
    mount(el) {
      const code = codeLines(['SELECT customer, SUM(amount) AS total', 'FROM orders', "WHERE status = 'paid'", 'GROUP BY customer', 'HAVING SUM(amount) > 50', 'ORDER BY total DESC', 'LIMIT 1;']);
      const all = [[1, 'Ana', 'paid', 50], [2, 'Ana', 'paid', 70], [3, 'Budi', 'paid', 20], [4, 'Budi', 'cancelled', 90], [5, 'Citra', 'paid', 200], [6, 'Citra', 'paid', 30], [7, 'Dewi', 'paid', 40]];
      const base = ['id', 'customer', 'status', 'amount'];
      const steps = [
        { line: 1, cols: base, rows: all, note: '1. FROM: start with every row of the source table (7 rows).' },
        { line: 2, cols: base, rows: all, dim: r => r[2] !== 'paid', note: '2. WHERE: filter individual rows. The cancelled order drops out before any grouping.' },
        { line: 3, cols: ['customer', 'rows in group (amount)'], rows: [['Ana', '50, 70'], ['Budi', '20'], ['Citra', '200, 30'], ['Dewi', '40']], note: '3. GROUP BY: collapse the remaining 6 rows into 4 groups, one per customer.' },
        { line: 4, cols: ['customer', 'SUM(amount)'], rows: [['Ana', 120], ['Budi', 20], ['Citra', 230], ['Dewi', 40]], dim: r => r[1] <= 50, note: '4. HAVING: filter whole groups using aggregates. Budi (20) and Dewi (40) drop out.' },
        { line: 0, cols: ['customer', 'total'], rows: [['Ana', 120], ['Citra', 230]], note: "5. SELECT: output columns and the 'total' alias are computed here, so WHERE can't see it." },
        { line: 5, cols: ['customer', 'total'], rows: [['Citra', 230], ['Ana', 120]], note: "6. ORDER BY: sorting runs after SELECT, so using the 'total' alias works." },
        { line: 6, cols: ['customer', 'total'], rows: [['Citra', 230]], note: '7. LIMIT: cut the sorted result down to the first row.' }
      ];
      const out = h('div', {}), note = h('p', { class: 'viz-note' });
      const seen = [];
      const s = stepper(steps.length, i => {
        const st = steps[i]; seen.length = 0; steps.slice(0, i).forEach(x => seen.push(x.line));
        code.set(st.line, j => seen.includes(j));
        out.replaceChildren(table(st.cols, st.rows, st.dim ? r => st.dim(r) ? 'dim' : '' : null));
        note.textContent = T(st.note);
      });
      el.append(s.el, code.el, out, note);
      s.start();
    }
  };

  // ---------- SQL: scan vs seek ----------
  VIZ.index = {
    title: 'Scan vs index seek', track: 'sql', trackName: 'SQL',
    desc: 'Find one id among 24 rows: reading every row in storage order, or halving a sorted index each step.',
    mount(el) {
      const sorted = [2, 5, 9, 12, 17, 21, 24, 28, 33, 37, 41, 46, 50, 55, 58, 62, 67, 71, 76, 80, 84, 89, 93, 97];
      const heap = [46, 9, 84, 21, 67, 2, 93, 33, 58, 12, 76, 41, 5, 97, 28, 62, 17, 89, 50, 24, 71, 37, 80, 55];
      const sel = h('select', { 'aria-label': 'Target id' }, sorted.map(v => h('option', { value: v }, T('id = {v}', { v })))); sel.value = 80;
      const mk = vals => vals.map(v => h('span', { class: 'cell' }, v));
      const hc = mk(heap), ic = mk(sorted), n1 = h('b', {}, '0'), n2 = h('b', {}, '0'), note = h('p', { class: 'viz-note' }, 'Pick a target and press Find.');
      let run = 0;
      const find = async () => {
        const me = ++run, target = +sel.value, D = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 230;
        [...hc, ...ic].forEach(c => c.className = 'cell'); n1.textContent = n2.textContent = '0';
        const scan = (async () => { for (let i = 0; i < heap.length; i++) { if (me !== run) return; hc[i].classList.add('look'); n1.textContent = i + 1; await sleep(D); if (heap[i] === target) { hc[i].className = 'cell hit'; return i + 1; } hc[i].className = 'cell seen'; } })();
        const seek = (async () => {
          let lo = 0, hi = sorted.length - 1, reads = 0;
          while (lo <= hi) {
            if (me !== run) return;
            const mid = (lo + hi) >> 1; reads++; n2.textContent = reads; ic[mid].classList.add('look'); await sleep(D * 3);
            if (sorted[mid] === target) { ic[mid].className = 'cell hit'; return reads; }
            if (sorted[mid] < target) { for (let j = lo; j <= mid; j++) ic[j].className = 'cell out'; lo = mid + 1; }
            else { for (let j = mid; j <= hi; j++) ic[j].className = 'cell out'; hi = mid - 1; }
          }
        })();
        const [a, b] = await Promise.all([scan, seek]);
        if (me === run) note.textContent = T("Scan read {a} rows, while the index took {b} comparisons. Across 1,000,000 rows, a scan reads up to 1,000,000 while a seek takes about 20. That's O(n) versus O(log n).", { a, b });
      };
      el.append(h('div', { class: 'viz-ctl' }, sel, btn('Find', find)),
        h('div', { class: 'viz-box' }, h('h4', {}, 'Table scan (storage order) · rows read: ', n1), h('div', { class: 'cells' }, hc)),
        h('div', { class: 'viz-box', style: { marginTop: '.8rem' } }, h('h4', {}, 'Index seek (sorted keys) · comparisons: ', n2), h('div', { class: 'cells' }, ic)), note);
    }
  };

  // ---------- React: re-render tree ----------
  VIZ.rerender = {
    title: 'Re-render explorer', track: 'react', trackName: 'TypeScript + React',
    desc: 'Click a component to change its state. Everything that flashes re-rendered. Then switch on memo and try again.',
    mount(el) {
      const tree = { App: ['Header', 'TodoList', 'Footer'], TodoList: ['TodoItem A', 'TodoItem B', 'TodoItem C'] };
      const count = {}, nodes = {};
      const note = h('p', { class: 'viz-note' }, 'Click any component.');
      const [memoLab, memo] = check('Wrap child components in memo (props unchanged)', false, () => reset());
      const [inlineLab, inlineProp] = check('Pass new inline onClick={() => ...} prop', false, () => reset());
      const label = name => { nodes[name].lastChild.textContent = `${T('renders:')} ${count[name]}`; };
      const render = (name, isRoot, hit, skipped) => {
        if (!isRoot && memo.checked && !inlineProp.checked) { skipped.push(name); nodes[name].classList.add('skip'); return; }
        count[name]++; label(name); hit.push(name);
        const n = nodes[name]; n.classList.remove('flash-r'); void n.offsetWidth; n.classList.add('flash-r');
        (tree[name] || []).forEach(c => render(c, false, hit, skipped));
      };
      const click = name => {
        Object.values(nodes).forEach(n => n.classList.remove('skip'));
        const hit = [], skipped = [];
        render(name, true, hit, skipped);
        const tail = inlineProp.checked && memo.checked && hit.length > 1
          ? T(". Memo didn't skip children because inline () => {} creates a new function each render.")
          : skipped.length ? T('. {n} skipped by memo because their props stayed the same.', { n: skipped.length })
            : T(hit.length > 1 ? '. That includes the component and its whole subtree, even with identical child props.' : '. Parents and siblings are never affected.');
        note.textContent = T(hit.length > 1 ? 'setState in {name} → {n} components re-rendered' : 'setState in {name} → {n} component re-rendered', { name, n: hit.length }) + tail;
      };
      const mk = name => { count[name] = 1; return nodes[name] = h('button', { type: 'button', class: 'comp', onclick: () => click(name) }, `<${name}>`, h('small', {}, T('renders:') + ' 1')); };
      const reset = () => { Object.keys(nodes).forEach(n => { count[n] = 1; label(n); nodes[n].classList.remove('skip'); }); note.textContent = T('Click any component.'); };
      const treeEl = h('div', { class: 'tree' }, h('div', { class: 'tree-r' }, mk('App')), h('div', { class: 'tree-r' }, tree.App.map(mk)), h('div', { class: 'tree-r' }, tree.TodoList.map(mk)));
      window.treeWire(treeEl, [[nodes.App, [nodes.Header, nodes.TodoList, nodes.Footer]], [nodes.TodoList, [nodes['TodoItem A'], nodes['TodoItem B'], nodes['TodoItem C']]]]);
      el.append(h('div', { class: 'viz-ctl' }, memoLab, inlineLab, btn('Reset counts', reset, 'ghost')),
        treeEl,
        h('p', { class: 'muted' }, 'App contains Header, TodoList and Footer. TodoList contains the three TodoItems.'), note);
    }
  };

  // ---------- Full stack: request journey ----------
  VIZ.journey = {
    title: 'One click through the whole stack', track: 'aspnet', trackName: 'Full stack',
    desc: 'Follow “Add product” from the button in React to a row in SQL and back. Every lesson in this program lives at one of these hops.',
    mount(el) {
      const steps = [
        ['react', 'React', 'The user clicks Add. The onClick handler runs and calls the mutation with { name, price }.'],
        ['react', 'Browser', 'fetch() sends POST /api/products with a JSON body and the auth cookie or token in the headers.'],
        ['aspnet', 'Kestrel', 'The web server accepts the connection, parses the HTTP request and creates an HttpContext.'],
        ['aspnet', 'Middleware', 'The request passes exception handling, routing, authentication, and authorization in that order.'],
        ['aspnet', 'Endpoint', 'Model binding turns JSON into a CreateProductRequest and validates it, returning 400 on bad input.'],
        ['csharp', 'DI + C#', 'The container supplies a scoped DbContext and services. Your async handler awaits each step, freeing the thread during I/O.'],
        ['aspnet', 'EF Core', 'db.Products.Add(entity) tracks the entity so SaveChangesAsync sends a parameterized INSERT.'],
        ['sql', 'SQL', 'The database checks constraints, writes the row, updates indexes and commits the transaction. The new id is returned.'],
        ['aspnet', 'Response', '201 Created with the JSON body travels back out through the middleware in reverse order.'],
        ['react', 'React', 'Mutation success invalidates the query cache, triggering a refetch so React updates state and patches the DOM.']
      ];
      const rows = steps.map(([t, name, text]) => h('div', { class: 'jstep', style: { '--tc': `var(--${t})` } }, h('b', { style: { color: `var(--${t})` } }, name), h('span', {}, text)));
      const s = stepper(steps.length, i => rows.forEach((r, j) => r.className = 'jstep' + (j === i ? ' cur' : j < i ? ' done' : '')));
      el.append(s.el, h('div', { class: 'journey' }, rows));
      s.start();
    }
  };
})();
