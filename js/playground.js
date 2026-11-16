// Live playgrounds. SQL runs on SQLite compiled to WebAssembly (sql.js); TypeScript is transpiled in the browser.
(() => {
  const T = window.t;   // `t` is used as a local name in this file
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
  const loaded = {};
  const loadScript = src => loaded[src] || (loaded[src] = new Promise((ok, fail) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => { delete loaded[src]; fail(new Error(T('Could not load {src} — the playground needs an internet connection the first time.', { src }))); };
    document.head.append(s);
  }));
  const store = { get: k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } } };
  // Monaco (the open-source editor inside VS Code, MIT licence) gives syntax highlighting, autocomplete and
  // real TypeScript type checking. It loads lazily; if it cannot load, the plain textarea keeps working.
  const MONACO = CDN + 'monaco-editor/0.52.2/min';
  let monacoP, seq = 0;
  const getMonaco = () => monacoP || (monacoP = loadScript(MONACO + '/vs/loader.js').then(() => new Promise((ok, fail) => {
    delete window.define.amd;   // keep other UMD libraries (sql.js) attaching to window instead of the AMD loader
    window.MonacoEnvironment = { getWorkerUrl: () => URL.createObjectURL(new Blob(
      [`self.MonacoEnvironment = { baseUrl: '${MONACO}/' }; importScripts('${MONACO}/vs/base/worker/workerMain.js');`], { type: 'text/javascript' })) };
    window.require.config({ paths: { vs: MONACO + '/vs' } });
    window.require(['vs/editor/editor.main'], () => {
      const t = window.monaco.languages.typescript;
      // moduleDetection 3 = "force": every snippet is its own module, so top-level await works and
      // declarations such as `const name` do not collide with browser globals or with other editors.
      t.typescriptDefaults.setCompilerOptions({ target: t.ScriptTarget.ESNext, module: t.ModuleKind.ESNext, moduleDetection: 3, strict: true, allowNonTsExtensions: true });
      ok(window.monaco);
    }, fail);
  })).catch(e => { monacoP = null; throw e; }));

  const live = [];
  function enhance(ta, lang, run) {
    getMonaco().then(monaco => {
      // Dispose editors left behind by the previous page before creating new ones.
      for (let i = live.length - 1; i >= 0; i--) if (!live[i].host.isConnected) { live[i].ed.dispose(); live[i].model.dispose(); live.splice(i, 1); }
      if (!ta.isConnected) return;
      const host = h('div', { class: 'monaco-host' + (ta.classList.contains('tall') ? ' tall' : '') });
      ta.after(host); ta.hidden = true;
      const ext = { typescript: 'ts', sql: 'sql', css: 'css', html: 'html' }[lang];
      const model = monaco.editor.createModel(ta.value, lang, monaco.Uri.parse(`file:///snippet${++seq}.${ext}`));
      const ed = monaco.editor.create(host, { model, theme: 'vs-dark', minimap: { enabled: false }, automaticLayout: true, fontSize: 13.5,
        scrollBeyondLastLine: false, tabSize: 2, lineNumbersMinChars: 3, padding: { top: 10 }, fixedOverflowWidgets: true, ariaLabel: T('Code editor') });
      // The textarea stays the single interface for the rest of the app: reads and writes go to the model.
      Object.defineProperty(ta, 'value', { configurable: true, get: () => model.getValue(), set: v => { if (v !== model.getValue()) model.setValue(v); } });
      ta.focus = () => ed.focus();
      ta.typeErrors = () => monaco.editor.getModelMarkers({ resource: model.uri }).filter(m => m.severity === monaco.MarkerSeverity.Error)
        .map(m => `${T('line')} ${m.startLineNumber}: ${m.message}`);
      model.onDidChangeContent(() => ta.oninput && ta.oninput());
      ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, run);
      live.push({ host, ed, model });
    }).catch(() => { /* offline: the textarea remains */ });
  }

  const editor = (value, run, lang) => {
    const ta = h('textarea', { class: 'editor', spellcheck: 'false', 'aria-label': 'Code editor', onkeydown: e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
      if (e.key === 'Tab') { e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end'); }
    } });
    ta.value = value;
    if (lang) setTimeout(() => enhance(ta, lang, run));   // after the caller has attached it
    return ta;
  };

  // Lists TypeScript type errors found by the editor, or nothing when the editor is unavailable.
  const typeNote = ta => {
    const errs = ta.typeErrors ? ta.typeErrors() : [];
    return errs.length ? h('div', { class: 'type-errs' },
      h('p', { class: 'err' }, T(errs.length > 1 ? '{n} type errors — the code still ran, because types are erased at build time:' : '{n} type error — the code still ran, because types are erased at build time:', { n: errs.length })),
      h('ul', {}, errs.slice(0, 6).map(e => h('li', {}, e)))) : null;
  };

  // Runs JavaScript in a Web Worker so an infinite loop cannot freeze the page.
  function runIsolated(js, ms = 5000) {
    const src = `const __logs = [];
const __fmt = v => v === undefined ? 'undefined' : typeof v === 'string' ? v : JSON.stringify(v, (k, x) => x instanceof Map ? Object.fromEntries(x) : x instanceof Set ? [...x] : typeof x === 'bigint' ? x + 'n' : x, 1);
console.log = console.info = console.warn = console.error = (...a) => { if (__logs.length < 300) __logs.push(a.map(__fmt).join(' ')); };
(async () => {\n${js}\n})().then(() => self.postMessage({ logs: __logs }), e => self.postMessage({ logs: __logs, err: String(e && e.message || e) }));`;
    const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), w = new Worker(url);
    return new Promise(resolve => {
      const done = r => { clearTimeout(t); w.terminate(); URL.revokeObjectURL(url); resolve(r); };
      const t = setTimeout(() => done({ logs: [], err: T('Stopped after {s} s — probably an infinite loop.', { s: ms / 1000 }) }), ms);
      w.onmessage = e => done(e.data);
      w.onerror = e => { e.preventDefault(); done({ logs: [], err: (e.message || T('Runtime error')).replace(/^Uncaught /, '') }); };
    });
  }

  // ---------------- SQL ----------------
  const SEED = `
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price REAL NOT NULL CHECK (price >= 0));
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id), order_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new');
CREATE TABLE order_items (order_id INTEGER NOT NULL REFERENCES orders(id), product_id INTEGER NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, unit_price REAL NOT NULL, PRIMARY KEY (order_id, product_id));
INSERT INTO customers VALUES (1,'Ana','Jakarta'),(2,'Budi','Bandung'),(3,'Citra','Surabaya'),(4,'Dewi','Jakarta'),(5,'Eko',NULL),(6,'Fitri','Bandung');
INSERT INTO products VALUES (1,'Laptop','Tech',1200),(2,'Mouse','Tech',25),(3,'Keyboard','Tech',80),(4,'Monitor','Tech',320),(5,'Desk','Home',300),(6,'Lamp','Home',40),(7,'Chair','Home',150),(8,'Notebook','Office',5),(9,'Pen','Office',2),(10,'Backpack','Office',60);
INSERT INTO orders VALUES (1,1,'2026-01-05','paid'),(2,1,'2026-02-11','paid'),(3,2,'2026-02-14','paid'),(4,3,'2026-03-01','cancelled'),(5,3,'2026-03-09','paid'),(6,4,'2026-03-15','new'),(7,2,'2026-04-02','paid'),(8,5,'2026-04-20','paid');
INSERT INTO order_items VALUES (1,1,1,1200),(1,2,2,25),(2,5,1,300),(2,6,2,40),(3,3,1,80),(3,8,10,5),(4,4,1,320),(5,7,1,150),(5,9,20,2),(6,10,1,60),(7,2,1,25),(7,4,1,320),(8,8,4,5),(8,6,1,40);
PRAGMA foreign_keys = ON;`;

  const CHALLENGES = [
    { lvl: 0, t: 'All customers', task: 'Return the name and city of every customer.', sol: 'SELECT name, city FROM customers;' },
    { lvl: 0, t: 'Cheap tech', task: 'Return name and price of Tech products under 500, cheapest first.', ordered: true, sol: "SELECT name, price FROM products WHERE category = 'Tech' AND price < 500 ORDER BY price;" },
    { lvl: 0, t: 'Unknown city', task: 'Return the names of customers whose city is unknown.', sol: 'SELECT name FROM customers WHERE city IS NULL;' },
    { lvl: 0, t: 'Count per category', task: 'Return each category and how many products it has.', sol: 'SELECT category, COUNT(*) FROM products GROUP BY category;' },
    { lvl: 1, t: 'Orders with names', task: 'Return each order id together with the name of the customer who placed it.', sol: 'SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.customer_id;' },
    { lvl: 1, t: 'Never ordered', task: 'Return the names of customers who have never placed an order.', sol: 'SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;' },
    { lvl: 1, t: 'Revenue per product', task: 'For paid orders only, return product name and total revenue (quantity × unit_price), highest revenue first.', ordered: true, sol: "SELECT p.name, SUM(i.quantity * i.unit_price) AS revenue FROM order_items i JOIN products p ON p.id = i.product_id JOIN orders o ON o.id = i.order_id WHERE o.status = 'paid' GROUP BY p.id, p.name ORDER BY revenue DESC;" },
    { lvl: 1, t: 'Pricey categories', task: 'Return the categories whose average product price is above 100 (category column only).', sol: 'SELECT category FROM products GROUP BY category HAVING AVG(price) > 100;' },
    { lvl: 1, t: 'Above average', task: 'Return the names of products priced above the average product price.', sol: 'SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products);' },
    { lvl: 2, t: 'Top per category', task: 'Return category and name of the most expensive product in each category. Use a window function.', sol: 'WITH r AS (SELECT category, name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn FROM products) SELECT category, name FROM r WHERE rn = 1;' },
    { lvl: 2, t: 'Running total', task: 'For paid orders, return order id and the running total of order value, ordered by order date.', ordered: true, sol: "WITH t AS (SELECT o.id, o.order_date, SUM(i.quantity * i.unit_price) AS total FROM orders o JOIN order_items i ON i.order_id = o.id WHERE o.status = 'paid' GROUP BY o.id, o.order_date) SELECT id, SUM(total) OVER (ORDER BY order_date, id) FROM t ORDER BY order_date, id;" }
  ];

  let SQLp;
  const getSQL = () => SQLp || (SQLp = loadScript(CDN + 'sql.js/1.8.0/sql-wasm.js')
    .then(() => window.initSqlJs({ locateFile: f => CDN + 'sql.js/1.8.0/' + f })).catch(e => { SQLp = null; throw e; }));

  function sql(el) {
    let db = null, cur = -1;
    const solved = new Set(store.get('stackmastery.sql'));
    const out = h('div', { class: 'out', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Loading SQLite…'));
    const task = h('p', { class: 'prompt' }, 'Free play — or pick a challenge above.');
    const chips = h('div', { class: 'chips' });
    const norm = (res, ordered) => {
      const rows = (res.length ? res[res.length - 1].values : []).map(r => r.map(v => typeof v === 'number' ? Math.round(v * 100) / 100 : v));
      return JSON.stringify(ordered ? rows : rows.map(r => JSON.stringify(r)).sort());
    };
    const show = res => {
      if (!res.length) return out.replaceChildren(h('p', { class: 'ok' }, T('OK — {n} row(s) changed.', { n: db.getRowsModified() })));
      out.replaceChildren(...res.map(r => h('div', {}, h('p', { class: 'muted' }, r.values.length + ' ' + T('row(s)')),
        h('table', { class: 't' }, h('thead', {}, h('tr', {}, r.columns.map(c => h('th', {}, c)))),
          h('tbody', {}, r.values.map(row => h('tr', {}, row.map(v => v === null ? h('td', { class: 'null' }, 'NULL') : h('td', {}, v)))))))));
    };
    const run = () => {
      if (!db) return;
      try { const res = db.exec(ta.value); show(res); return res; }
      catch (e) { out.replaceChildren(h('p', { class: 'err' }, e.message)); return null; }
    };
    const ta = editor("SELECT name, category, price\nFROM products\nWHERE price > 100\nORDER BY price DESC;", run, 'sql');
    const checkAns = () => {
      if (cur < 0) return out.replaceChildren(h('p', { class: 'muted' }, 'Pick a challenge first.'));
      const mine = run(); if (!mine) return;
      const c = CHALLENGES[cur], good = norm(mine, c.ordered) === norm(db.exec(c.sol), c.ordered);
      if (good) { solved.add(cur); store.set('stackmastery.sql', [...solved]); drawChips(); }
      out.prepend(h('p', { class: good ? 'ok' : 'err' }, T(good ? '✓ Correct — now explain out loud why it works.' : c.ordered ? '✗ Not the expected rows yet. Compare your output with the task — row order matters here.' : '✗ Not the expected rows yet. Compare your output with the task.')));
    };
    const reset = () => { if (!SQL) return; db = new SQL.Database(); db.run(SEED); out.replaceChildren(h('p', { class: 'ok' }, 'Database reset to its original contents.')); };
    const drawChips = () => chips.replaceChildren(...CHALLENGES.map((c, i) => h('button', { type: 'button', class: (i === cur ? 'on ' : '') + (solved.has(i) ? 'solved' : ''), title: LEVELS[c.lvl], onclick: () => {
      cur = i; task.textContent = `${T('Challenge')} ${i + 1} (${LEVELS[c.lvl]}): ${T(c.task)}`; ta.value = '-- ' + T(c.t) + '\n'; ta.focus(); drawChips();
    } }, c.t)));
    let SQL = null;
    drawChips();
    el.style.setProperty('--tc', 'var(--sql)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'SQL playground'),
        h('p', { class: 'lede' }, 'A real SQLite database running in your browser. Queries and writes are live; reset whenever you like. SQLite uses LIMIT where SQL Server uses TOP / OFFSET FETCH — everything else in these lessons carries over.')),
      h('p', { class: 'schema', html: '<b>customers</b>(id, name, city) · <b>products</b>(id, name, category, price) · <b>orders</b>(id, customer_id, order_date, status) · <b>order_items</b>(order_id, product_id, quantity, unit_price)' }),
      chips, task,
      h('div', { class: 'play' },
        h('div', {}, ta, h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn', onclick: run }, 'Run (Ctrl+Enter)'),
          h('button', { type: 'button', class: 'btn ghost', onclick: checkAns }, 'Check answer'),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => { if (cur >= 0) ta.value = CHALLENGES[cur].sol.replace(/ (FROM|WHERE|GROUP BY|HAVING|ORDER BY|JOIN|LEFT JOIN|SELECT) /g, '\n$1 '); } }, 'Show solution'),
          h('button', { type: 'button', class: 'btn ghost', onclick: reset }, 'Reset database'))),
        out));
    getSQL().then(S => { SQL = S; reset(); out.replaceChildren(h('p', { class: 'muted' }, 'Ready. Run a query to see results here.')); })
      .catch(e => out.replaceChildren(h('p', { class: 'err' }, e.message)));
  }

  // ---------------- TypeScript ----------------
  const TS_EXAMPLES = {
    'Array methods': `interface Product { name: string; price: number; inStock: boolean }

const products: Product[] = [
  { name: "Laptop", price: 1200, inStock: true },
  { name: "Mouse", price: 25, inStock: true },
  { name: "Desk", price: 300, inStock: false },
  { name: "Lamp", price: 40, inStock: true },
];

const affordable = products
  .filter(p => p.inStock && p.price < 100)
  .sort((a, b) => a.price - b.price)
  .map(p => p.name);

console.log(affordable);
console.log("total:", products.reduce((sum, p) => sum + p.price, 0));`,
    'Unions & narrowing': `type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function parseAge(input: string): Result<number> {
  const n = Number(input);
  return Number.isInteger(n) && n >= 0
    ? { ok: true, data: n }
    : { ok: false, error: "not a valid age: " + input };
}

for (const raw of ["42", "abc", "-1"]) {
  const r = parseAge(raw);
  if (r.ok) console.log("age", r.data);      // data exists only here
  else console.log("error:", r.error);
}`,
    'Generics': `function groupBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  for (const item of items) {
    const group = map.get(item[key]) ?? [];
    group.push(item);
    map.set(item[key], group);
  }
  return map;
}

const people = [
  { name: "Ana", city: "Jakarta" },
  { name: "Budi", city: "Bandung" },
  { name: "Citra", city: "Jakarta" },
];

console.log(groupBy(people, "city"));`,
    'Immutable state': `interface Todo { id: number; text: string; done: boolean }

type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "remove"; id: number };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "add": return [...state, { id: state.length + 1, text: action.text, done: false }];
    case "toggle": return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "remove": return state.filter(t => t.id !== action.id);
  }
}

let state: Todo[] = [];
const before = state;
state = reducer(state, { type: "add", text: "Learn reducers" });
state = reducer(state, { type: "add", text: "Teach reducers" });
state = reducer(state, { type: "toggle", id: 1 });

console.log(state);
console.log("original untouched:", before.length === 0);`,
    'async / await': `const wait = (ms: number, value: string) =>
  new Promise<string>(resolve => setTimeout(() => resolve(value), ms));

let start = Date.now();
const a = await wait(300, "A");
const b = await wait(300, "B");
console.log("sequential:", a, b, Date.now() - start, "ms");

start = Date.now();
const both = await Promise.all([wait(300, "A"), wait(300, "B")]);
console.log("concurrent:", both, Date.now() - start, "ms");`
  };

  function ts(el) {
    const out = h('div', { class: 'out', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Output appears here.'));
    const run = async () => {
      out.replaceChildren(h('p', { class: 'muted' }, 'Running…'));
      try {
        await loadScript(CDN + 'typescript/5.4.5/typescript.min.js');
        const res = window.ts.transpileModule(ta.value, { reportDiagnostics: true, compilerOptions: { target: 'ES2022', module: 'ESNext' } });
        const diag = (res.diagnostics || []).map(d => window.ts.flattenDiagnosticMessageText(d.messageText, '\n'));
        if (diag.length) throw new Error(T('Syntax error: ') + diag.join('\n'));
        const r = await runIsolated(res.outputText);
        out.replaceChildren(...[typeNote(ta), h('pre', {}, r.logs.join('\n') || (r.err ? '' : T('(no output — use console.log)'))), r.err ? h('p', { class: 'err' }, r.err) : null].filter(Boolean));
      } catch (e) {
        out.replaceChildren(h('p', { class: 'err' }, String(e.message || e)));
      }
    };
    const first = Object.keys(TS_EXAMPLES)[0];
    const ta = editor(TS_EXAMPLES[first], run, 'typescript');
    const chips = h('div', { class: 'chips' }, Object.keys(TS_EXAMPLES).map(name => h('button', { type: 'button', onclick: e => {
      ta.value = TS_EXAMPLES[name]; [...chips.children].forEach(c => c.classList.toggle('on', c === e.currentTarget));
    } }, name)));
    chips.firstChild.classList.add('on');
    el.style.setProperty('--tc', 'var(--react)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'TypeScript playground'),
        h('p', { class: 'lede' }, 'Write TypeScript and run it instantly. Type errors are underlined as you type and listed when you run — hover a red squiggle to read the message. Code runs in an isolated worker with a five-second limit.')),
      chips,
      h('div', { class: 'play' },
        h('div', {}, ta, h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', onclick: run }, 'Run (Ctrl+Enter)'))),
        out));
  }

  // ---------------- HTML + CSS (+ Tailwind) ----------------
  const CSS_EXAMPLES = {
    'Flexbox navbar': { html: `<nav class="nav">
  <strong>Shop</strong>
  <a href="#">Products</a>
  <a href="#">Orders</a>
  <a class="push" href="#">Sign in</a>
</nav>
<main class="hero"><h1>Centered with flexbox</h1></main>`, css: `body { margin: 0; font-family: system-ui, sans-serif; }
.nav { display: flex; align-items: center; gap: 1rem; padding: .75rem 1rem; background: #1b2030; color: white; }
.nav a { color: #c7cdfa; text-decoration: none; }
.nav .push { margin-left: auto; }
.hero { display: flex; justify-content: center; align-items: center; min-height: 60vh; }` },
    'Responsive grid': { html: `<div class="gallery">
  <article class="card featured">Featured</article>
  <article class="card">Two</article>
  <article class="card">Three</article>
  <article class="card">Four</article>
  <article class="card">Five</article>
</div>`, css: `body { font-family: system-ui, sans-serif; margin: 1rem; }
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; }
.card { padding: 2rem 1rem; border-radius: .75rem; background: #eef0ff; text-align: center; }
.featured { grid-column: span 2; background: #3b47d6; color: white; }
/* Drag the preview's right edge to resize it */` },
    'Theme tokens + :has()': { html: `<label><input type="checkbox" id="dark"> Dark theme</label>
<div class="card">
  <h2>Design tokens</h2>
  <p>Only the variables change. No component rule mentions a raw colour.</p>
  <button>Action</button>
</div>`, css: `:root { --bg: #ffffff; --text: #1b2030; --surface: #f1f2f8; --accent: #3b47d6; }
:root:has(#dark:checked) { --bg: #0e1117; --text: #e7eaf0; --surface: #1d222d; --accent: #8b95ff; }

body { margin: 0; padding: 1rem; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); transition: background .2s; }
.card { margin-top: 1rem; padding: 1.25rem; border-radius: .75rem; background: var(--surface); }
button { background: var(--accent); color: var(--bg); border: 0; border-radius: .5rem; padding: .5em 1em; font-weight: 600; }` },
    'Tailwind card': { tw: true, html: `<div class="min-h-screen bg-slate-100 p-6">
  <article class="mx-auto max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <div class="aspect-video bg-linear-to-br from-indigo-500 to-emerald-400"></div>
    <div class="space-y-3 p-5">
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-lg font-semibold text-slate-900">Laptop Pro</h3>
        <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">In stock</span>
      </div>
      <p class="text-sm leading-6 text-slate-600">14-inch display, 16 GB memory, all-day battery.</p>
      <button class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Add to cart</button>
    </div>
  </article>
</div>`, css: `/* With Tailwind on, this box accepts Tailwind CSS: try a custom token */
@theme {
  --color-brand-500: oklch(55% 0.2 270);
}` },
    'Tailwind responsive': { tw: true, html: `<div class="p-4">
  <p class="mb-4 text-sm text-slate-500">Drag the preview's right edge: 1 column, 2 from sm, 3 from md.</p>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    <div class="rounded-lg bg-indigo-100 p-6 text-center font-semibold text-indigo-900">One</div>
    <div class="rounded-lg bg-indigo-200 p-6 text-center font-semibold text-indigo-900">Two</div>
    <div class="rounded-lg bg-indigo-300 p-6 text-center font-semibold text-indigo-900">Three</div>
    <div class="rounded-lg bg-indigo-400 p-6 text-center font-semibold text-white sm:col-span-2 md:col-span-3">Full width</div>
  </div>
</div>`, css: '' }
  };

  function css(el) {
    let t = 0;
    const frame = h('iframe', { class: 'preview', sandbox: 'allow-scripts', title: 'Preview' });
    const size = h('span', { class: 'muted' });
    const render = () => {
      const tw = twBox.checked;
      frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
        (tw ? `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>` : '') +
        `<style${tw ? ' type="text/tailwindcss"' : ''}>${cssTa.value}</style></head><body>${htmlTa.value}</body></html>`;
    };
    const later = () => { clearTimeout(t); t = setTimeout(render, 350); };
    const htmlTa = editor('', render, 'html'), cssTa = editor('', render, 'css');
    htmlTa.oninput = cssTa.oninput = later;
    const twBox = h('input', { type: 'checkbox', onchange: render });
    const load = name => { const x = CSS_EXAMPLES[name]; htmlTa.value = x.html; cssTa.value = x.css; twBox.checked = !!x.tw; [...chips.children].forEach(c => c.classList.toggle('on', c.textContent === name)); render(); };
    const chips = h('div', { class: 'chips' }, Object.keys(CSS_EXAMPLES).map(n => h('button', { type: 'button', onclick: () => load(n) }, n)));
    const wrap = h('div', { class: 'preview-wrap' }, frame);
    if (window.ResizeObserver) new ResizeObserver(() => size.textContent = T('Preview width: {w}px — drag the right edge to test breakpoints', { w: Math.round(frame.clientWidth) })).observe(frame);
    el.style.setProperty('--tc', 'var(--css)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'CSS + Tailwind playground'),
        h('p', { class: 'lede' }, 'Write HTML and CSS and see the result as you type. Switch on Tailwind to use utility classes and @theme — it loads the Tailwind browser build, so it needs an internet connection.')),
      chips,
      h('div', { class: 'play' },
        h('div', {}, h('p', { class: 'ed-label' }, 'HTML'), htmlTa, h('p', { class: 'ed-label' }, 'CSS'), cssTa,
          h('div', { class: 'actions' }, h('label', { class: 'tw-toggle' }, twBox, ' Use Tailwind CSS'))),
        h('div', {}, wrap, size)));
    load(Object.keys(CSS_EXAMPLES)[0]);
  }

  // ---------------- Dart + Flutter (embedded DartPad) ----------------
  // DartPad (dartpad.dev, the official open-source Dart playground) compiles and runs Dart and Flutter in the browser.
  // When the embedded editor reports that it is ready, the selected lesson sample is posted into it.
  const DARTPAD = 'https://dartpad.dev';
  function dart(el, sample) {
    const track = TRACKS.find(t => t.id === 'flutter');
    // Samples DartPad can run as they are: a main() and no third-party packages.
    const samples = track.lessons.filter(l => /\bmain\(\)/.test(l.code) && !/package:(?!flutter\/)/.test(l.code));
    let cur = samples.find(l => l.id === sample) || samples[0], ready = false;
    const code = l => l.code.replace(/^\n+|\s+$/g, '');
    const frame = h('iframe', { class: 'dartpad', title: 'DartPad', src: DARTPAD + '/?embed=true&theme=dark', allow: 'clipboard-write' });
    const codeBox = h('div', {});
    const send = () => { if (ready && frame.contentWindow) frame.contentWindow.postMessage({ sourceCode: code(cur), type: 'sourceCode' }, DARTPAD); };
    const onMsg = e => {
      if (!frame.isConnected) return removeEventListener('message', onMsg);
      if (e.origin === DARTPAD && e.data && e.data.type === 'ready') { ready = true; send(); }
    };
    addEventListener('message', onMsg);
    const chips = h('div', { class: 'chips' });
    const draw = () => {
      chips.replaceChildren(...samples.map(l => h('button', { type: 'button', class: l === cur ? 'on' : '', onclick: () => { cur = l; draw(); send(); } }, l.title)));
      codeBox.replaceChildren(codeBlock(code(cur), 'dart'));
    };
    draw();
    el.style.setProperty('--tc', 'var(--flutter)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'Dart + Flutter playground'),
        h('p', { class: 'lede' }, 'DartPad, the official Dart playground, embedded here: it compiles and runs real Dart and Flutter in your browser. Pick a lesson sample, press Run in DartPad, then change the code and run it again.')),
      chips,
      h('div', { class: 'play' },
        h('div', {}, h('p', { class: 'ed-label' }, 'Lesson sample'), codeBox,
          h('p', { class: 'muted' }, 'The sample is sent to DartPad automatically. If the editor on the right does not show it, press Copy and paste it in.')),
        h('div', {}, frame,
          h('p', { class: 'muted' }, 'DartPad needs an internet connection. Samples that use packages such as flutter_bloc or go_router are meant for a local project: ', h('code', {}, 'flutter create'), '.'))));
  }

  window.PLAY = { sql, ts, css, dart, editor, typeNote, loadTS: () => loadScript(CDN + 'typescript/5.4.5/typescript.min.js') };
})();
