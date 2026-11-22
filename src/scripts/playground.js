// Live playgrounds. SQL runs on SQLite compiled to WebAssembly (sql.js); TypeScript is transpiled in the browser.
import { codeBlock, confirmDialog, h, tableWrap } from '../lib/dom.ts';
import { getLevels, getTrack, t as T } from '../lib/i18n.ts';
import { SQL_KEY, readJson, writeJson } from '../lib/storage.ts';
import { resolvedTheme, watchTheme } from '../lib/theme.ts';

  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
  // Every pinned third-party script is loaded with Subresource Integrity: the browser refuses to run it unless its
  // bytes match these sha384 digests, which were computed from the exact files the CDNs serve for these URLs.
  // When bumping a version, fetch the new file and recompute the hash (see README, "Pinned CDN scripts").
  const MONACO = CDN + 'monaco-editor/0.52.2/min';
  const MONACO_LOADER = MONACO + '/vs/loader.js';
  const SQLJS = CDN + 'sql.js/1.8.0/';
  const SQLJS_LOADER = SQLJS + 'sql-wasm.js';
  const TS_URL = CDN + 'typescript/5.8.3/typescript.min.js';
  const TAILWIND_URL = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.4';
  const SRI = {
    [MONACO_LOADER]: 'sha384-pHG02SG8pId94Np3AbPmBEJ1yPqaH0IkJGLSNGXYmuGhkazT8Lr/57WYpbkGjJtu',
    [SQLJS_LOADER]: 'sha384-KsfptB549CXfbfsdxZmPo2PlmgCyJ+RNqHTQE1Gj45t3p4DaA1QbZYVyqlni4pOO',
    [TS_URL]: 'sha384-rzD+Kg5xW4cKW7h4a2bUXWbDteIVdFMLwdoSxDFy9ItGR4++5eDnPB9mDLJRIkhv',
    [TAILWIND_URL]: 'sha384-Wvy1ssCJ6jK31FMWKSXxg4hwsnsgtYT2qpIUCYdQNmYfD6CBpVxUdyuvpr9LhZWb'
  };

  const loaded = {};
  // Scripts load one at a time. Monaco's AMD loader defines a global `define` with an `amd` flag that makes UMD
  // libraries such as sql.js register as AMD modules instead of setting their window global. So while any other
  // script runs, that flag is hidden, and it is put back right after (also on failure). Nothing is deleted for good.
  let queue = Promise.resolve();
  const loadScript = (src, integrity = SRI[src]) => {
    if (loaded[src]) return loaded[src];
    const p = queue.then(() => new Promise((ok, fail) => {
      const def = window.define, amd = def && def.amd;
      if (amd) def.amd = undefined;
      const restore = () => { if (amd) def.amd = amd; };
      const s = document.createElement('script');
      s.src = src;
      if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
      s.onload = () => { restore(); ok(); };
      s.onerror = () => { restore(); s.remove(); fail(new Error(T('Could not load {src}. The playground needs an internet connection the first time.', { src }))); };
      document.head.append(s);
    }));
    queue = p.catch(() => {});
    loaded[src] = p.catch(e => { delete loaded[src]; throw e; });
    return loaded[src];
  };
  const store = { get: k => readJson(k, () => []), set: (k, v) => writeJson(k, v) };

  // Shown when a CDN script or embed cannot load (offline, blocked): the editor stays usable and Retry tries again.
  const loadFailure = (message, retry) => h('div', { class: 'load-fail', role: 'alert' },
    h('p', { class: 'err' }, message),
    h('p', { class: 'muted' }, 'You can keep editing. Check your connection, then try again.'),
    h('button', { type: 'button', class: 'btn ghost', onclick: retry }, 'Retry'));

  // Optional links to full online sandboxes, for what a browser playground cannot run.
  const SANDBOXES = {
    go: { href: 'https://go.dev/play/', label: 'Go Playground' },
    csharp: { href: 'https://sharplab.io/', label: 'SharpLab' },
    stackblitz: { href: 'https://stackblitz.com/', label: 'StackBlitz' },
    dartpad: { href: 'https://dartpad.dev/', label: 'DartPad' }
  };
  const sandboxLink = key => h('a', { href: SANDBOXES[key].href, target: '_blank', rel: 'noopener noreferrer', 'data-sandbox': key }, SANDBOXES[key].label);

  // Monaco (the open-source editor inside VS Code, MIT licence) gives syntax highlighting, autocomplete and
  // real TypeScript type checking. It loads lazily; if it cannot load, the plain textarea keeps working.
  const monacoTheme = () => resolvedTheme() === 'dark' ? 'vs-dark' : 'vs';
  // The worker script is one Blob URL, created on first use and revoked when the page is hidden. Returning from
  // the back/forward cache creates it again on demand.
  let workerUrl = null;
  const getWorkerUrl = () => workerUrl || (workerUrl = URL.createObjectURL(new Blob(
    [`self.MonacoEnvironment = { baseUrl: '${MONACO}/' }; importScripts('${MONACO}/vs/base/worker/workerMain.js');`], { type: 'text/javascript' })));
  addEventListener('pagehide', () => { if (workerUrl) { URL.revokeObjectURL(workerUrl); workerUrl = null; } });
  let monacoP, seq = 0;
  const getMonaco = () => monacoP || (monacoP = loadScript(MONACO_LOADER).then(() => new Promise((ok, fail) => {
    window.MonacoEnvironment = { getWorkerUrl };
    window.require.config({ paths: { vs: MONACO + '/vs' } });
    window.require(['vs/editor/editor.main'], () => {
      const t = window.monaco.languages.typescript;
      // moduleDetection 3 = "force": every snippet is its own module, so top-level await works and
      // declarations such as `const name` do not collide with browser globals or with other editors.
      t.typescriptDefaults.setCompilerOptions({ target: t.ScriptTarget.ESNext, module: t.ModuleKind.ESNext, moduleDetection: 3, strict: true, allowNonTsExtensions: true, jsx: t.JsxEmit.ReactJSX });
      t.typescriptDefaults.addExtraLib(REACT_TYPES, 'file:///react-shim.d.ts');
      // Stock 'vs' paints HTML attribute names pure red, which is only 3.99:1 on white. Redefining 'vs' with a
      // darker red keeps the theme id (and Monaco's `vs` class) while meeting WCAG AA.
      window.monaco.editor.defineTheme('vs', { base: 'vs', inherit: true, rules: [{ token: 'attribute.name', foreground: 'cd3131' }], colors: {} });
      // Monaco's theme is global, so one subscription keeps every editor in step with the site theme.
      window.monaco.editor.setTheme(monacoTheme());
      watchTheme(() => window.monaco.editor.setTheme(monacoTheme()));
      addEventListener('pageshow', e => { if (e.persisted) window.monaco.editor.setTheme(monacoTheme()); });
      ok(window.monaco);
    }, fail);
  })).catch(e => { monacoP = null; throw e; }));

  // A simplified version of React's types: enough for the editor to check hooks and component props.
  // The preview runs the real React.
  const REACT_TYPES = `declare module 'react' {
  export type ReactNode = any;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export interface Context<T> { Provider: any; Consumer: any; __type?: T }
  export function useState<S>(initial: S | (() => S)): [S, (value: SetStateAction<S>) => void];
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initial: S): [S, (action: A) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: readonly unknown[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useId(): string;
  export function createContext<T>(value: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export function memo<T>(component: T): T;
  export function useTransition(): [boolean, (action: () => void | Promise<void>) => void];
  export function useDeferredValue<T>(value: T): T;
  export function useActionState<S, P = FormData>(action: (state: S, payload: P) => S | Promise<S>, initial: S): [S, (payload: P) => void, boolean];
  export function useOptimistic<S, A = S>(state: S, update?: (state: S, action: A) => S): [S, (action: A) => void];
  export function use<T>(resource: Promise<T> | Context<T>): T;
  export function lazy<T>(load: () => Promise<{ default: T }>): T;
  export const Fragment: any, StrictMode: any, Suspense: any;
}
declare module 'react/jsx-runtime' { export const jsx: any, jsxs: any, Fragment: any; }
declare module 'react-dom/client' { export function createRoot(el: Element | DocumentFragment): { render(node: any): void; unmount(): void }; }
declare module '@tanstack/react-query' {
  export function useQuery<T = any>(opts: { queryKey: readonly unknown[]; queryFn: () => Promise<T> | T; enabled?: boolean }): { data: T | undefined; isLoading: boolean; isError: boolean; error: any; refetch: () => void };
  export function useMutation<T = any, V = any>(opts: { mutationFn: (vars: V) => Promise<T> | T; onSuccess?: () => void }): { mutate: (vars: V) => void; isPending: boolean };
  export function useQueryClient(): { invalidateQueries: (filter?: any) => void };
  export class QueryClient { constructor(opts?: any) }
  export const QueryClientProvider: any;
}
declare module 'clsx' { export function clsx(...inputs: any[]): string; export default clsx; }
declare module 'tailwind-merge' { export function twMerge(...classLists: any[]): string; }
interface ShimAttrs {
  onChange?: (e: { target: HTMLInputElement; currentTarget: HTMLInputElement }) => void;
  onInput?: (e: { target: HTMLInputElement; currentTarget: HTMLInputElement }) => void;
  onClick?: (e: MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onSubmit?: (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => void;
  [attr: string]: any;
}
declare namespace JSX { interface IntrinsicElements { [tag: string]: ShimAttrs } }
`;

  const live = [];
  function enhance(ta, lang, run, fileExt) {
    getMonaco().then(monaco => {
      // Dispose editors left behind by the previous page before creating new ones.
      for (let i = live.length - 1; i >= 0; i--) if (!live[i].host.isConnected) { live[i].ed.dispose(); live[i].model.dispose(); live.splice(i, 1); }
      if (!ta.isConnected) return;
      const host = h('div', { class: 'monaco-host' + (ta.classList.contains('tall') ? ' tall' : '') });
      ta.after(host); ta.hidden = true;
      const ext = fileExt || { typescript: 'ts', sql: 'sql', css: 'css', html: 'html' }[lang];
      const model = monaco.editor.createModel(ta.value, lang, monaco.Uri.parse(`file:///snippet${++seq}.${ext}`));
      const ed = monaco.editor.create(host, { model, theme: monacoTheme(), minimap: { enabled: false }, automaticLayout: true, fontSize: 13.5,
        scrollBeyondLastLine: false, tabSize: 2, lineNumbersMinChars: 3, padding: { top: 10 }, fixedOverflowWidgets: true, ariaLabel: T('Code editor') });
      // The textarea stays the single interface for the rest of the app: reads and writes go to the model.
      Object.defineProperty(ta, 'value', { configurable: true, get: () => model.getValue(), set: v => { if (v !== model.getValue()) model.setValue(v); } });
      ta.focus = () => ed.focus();
      // Ask the TypeScript worker directly: the editor's markers lag a moment behind the latest edit.
      const markers = () => monaco.editor.getModelMarkers({ resource: model.uri }).filter(m => m.severity === monaco.MarkerSeverity.Error)
        .map(m => `${T('line')} ${m.startLineNumber}: ${m.message}`);
      ta.typeErrors = async () => {
        if (lang !== 'typescript') return markers();
        try {
          const worker = await (await monaco.languages.typescript.getTypeScriptWorker())(model.uri), file = model.uri.toString();
          const diags = [...await worker.getSyntacticDiagnostics(file), ...await worker.getSemanticDiagnostics(file)].filter(d => d.category === 1);
          return diags.map(d => `${T('line')} ${model.getPositionAt(d.start || 0).lineNumber}: ${typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText}`);
        } catch { return markers(); }
      };
      model.onDidChangeContent(() => ta.oninput && ta.oninput());
      ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, run);
      live.push({ host, ed, model });
    }).catch(() => { /* offline: the textarea remains */ });
  }

  const editor = (value, run, lang, fileExt) => {
    const ta = h('textarea', { class: 'editor', spellcheck: 'false', 'aria-label': 'Code editor', onkeydown: e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
      if (e.key === 'Tab') { e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end'); }
    } });
    ta.value = value;
    if (lang) setTimeout(() => enhance(ta, lang, run, fileExt));   // after the caller has attached it
    return ta;
  };

  // Lists TypeScript type errors found by the editor, or nothing when the editor is unavailable.
  const typeNote = async ta => {
    const errs = ta.typeErrors ? await ta.typeErrors() : [];
    return errs.length ? h('div', { class: 'type-errs' },
      h('p', { class: 'err' }, T(errs.length > 1 ? '{n} type errors, though the code still ran because types are erased at build time:' : '{n} type error, though the code still ran because types are erased at build time:', { n: errs.length })),
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
      const t = setTimeout(() => done({ logs: [], err: T('Stopped after {s} s, likely due to an infinite loop.', { s: ms / 1000 }) }), ms);
      w.onmessage = e => done(e.data);
      w.onerror = e => { e.preventDefault(); done({ logs: [], err: (e.message || T('Runtime error')).replace(/^Uncaught /, '') }); };
    });
  }

  // ---------------- SQL ----------------
  const SEED = `
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price REAL NOT NULL CHECK (price >= 0), stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0));
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id), order_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new');
CREATE TABLE order_items (order_id INTEGER NOT NULL REFERENCES orders(id), product_id INTEGER NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, unit_price REAL NOT NULL, PRIMARY KEY (order_id, product_id));
INSERT INTO customers VALUES (1,'Ana','Jakarta'),(2,'Budi','Bandung'),(3,'Citra','Surabaya'),(4,'Dewi','Jakarta'),(5,'Eko',NULL),(6,'Fitri','Bandung');
INSERT INTO products (id, name, category, price) VALUES (1,'Laptop','Tech',1200),(2,'Mouse','Tech',25),(3,'Keyboard','Tech',80),(4,'Monitor','Tech',320),(5,'Desk','Home',300),(6,'Lamp','Home',40),(7,'Chair','Home',150),(8,'Notebook','Office',5),(9,'Pen','Office',2),(10,'Backpack','Office',60);
INSERT INTO orders VALUES (1,1,'2026-01-05','paid'),(2,1,'2026-02-11','paid'),(3,2,'2026-02-14','paid'),(4,3,'2026-03-01','cancelled'),(5,3,'2026-03-09','paid'),(6,4,'2026-03-15','new'),(7,2,'2026-04-02','paid'),(8,5,'2026-04-20','paid');
INSERT INTO order_items VALUES (1,1,1,1200),(1,2,2,25),(2,5,1,300),(2,6,2,40),(3,3,1,80),(3,8,10,5),(4,4,1,320),(5,7,1,150),(5,9,20,2),(6,10,1,60),(7,2,1,25),(7,4,1,320),(8,8,4,5),(8,6,1,40);
UPDATE products SET stock = 1 WHERE id = 7;
CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT NOT NULL, balance REAL NOT NULL CHECK (balance >= 0));
INSERT INTO accounts VALUES (1,'Ana',500),(2,'Budi',200);
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
    { lvl: 2, t: 'Running total', task: 'For paid orders, return order id and the running total of order value, ordered by order date.', ordered: true, sol: "WITH t AS (SELECT o.id, o.order_date, SUM(i.quantity * i.unit_price) AS total FROM orders o JOIN order_items i ON i.order_id = o.id WHERE o.status = 'paid' GROUP BY o.id, o.order_date) SELECT id, SUM(total) OVER (ORDER BY order_date, id) FROM t ORDER BY order_date, id;" },
    { lvl: 3, t: 'Best sellers with ties', task: 'For paid orders, list category, product name, and units sold for the top two totals per category. Ties keep the same rank, so a category can return more than two rows.', sol: "WITH s AS (SELECT p.category, p.name, SUM(i.quantity) AS sold FROM order_items i JOIN orders o ON o.id = i.order_id JOIN products p ON p.id = i.product_id WHERE o.status = 'paid' GROUP BY p.id, p.category, p.name), r AS (SELECT category, name, sold, DENSE_RANK() OVER (PARTITION BY category ORDER BY sold DESC) AS rk FROM s) SELECT category, name, sold FROM r WHERE rk <= 2;" },
    { lvl: 3, t: 'Next page without OFFSET', task: 'Sort products cheapest first, breaking ties by id. The current page ended on Lamp (price 40, id 6). Return name and price of the next three rows using (price, id) instead of OFFSET.', ordered: true, sol: "SELECT name, price FROM products WHERE price > 40 OR (price = 40 AND id > 6) ORDER BY price, id LIMIT 3;" },
    { lvl: 3, t: 'Streaks of active months', task: "For each customer, find stretches of consecutive months with at least one paid order. Return customer name, first month, last month as 'YYYY-MM', and month count.", sol: "WITH m AS (SELECT DISTINCT c.name, CAST(strftime('%Y', o.order_date) AS INTEGER) * 12 + CAST(strftime('%m', o.order_date) AS INTEGER) - 1 AS mi FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'paid'), g AS (SELECT name, mi, mi - ROW_NUMBER() OVER (PARTITION BY name ORDER BY mi) AS grp FROM m) SELECT name, printf('%04d-%02d', MIN(mi) / 12, MIN(mi) % 12 + 1), printf('%04d-%02d', MAX(mi) / 12, MAX(mi) % 12 + 1), COUNT(*) FROM g GROUP BY name, grp;" }
  ];

  let SQLp;
  const getSQL = () => SQLp || (SQLp = loadScript(SQLJS_LOADER)
    .then(() => window.initSqlJs({ locateFile: f => SQLJS + f })).catch(e => { SQLp = null; throw e; }));

  const SQL_PRESETS = { select: 0, dml: 2, aggregate: 3, joins: 4, design: 5, indexes: 1, transactions: 6, subqueries: 8, window: 9, locking: 11, plans: 12, scale: 13 };
  const SQL_DIALECT_HINTS = [
    [/\bTOP\s*\(?\s*\d+/i, 'SQL Server TOP(n) → SQLite uses LIMIT n at the end of ORDER BY.'],
    [/\b(?:YEAR|MONTH|DAY)\s*\(/i, "SQL Server YEAR()/MONTH() → SQLite uses strftime('%Y', col) or strftime('%m', col)."],
    [/\bGETDATE\s*\(/i, "SQL Server GETDATE() → SQLite uses datetime('now') or CURRENT_TIMESTAMP."],
    [/\bNVARCHAR\b/i, 'SQL Server NVARCHAR(n) → SQLite uses TEXT without length syntax.'],
    [/\bOFFSET\s+\d+\s+ROWS?\s+FETCH\b/i, 'SQL Server OFFSET/FETCH → SQLite uses LIMIT n OFFSET m.']
  ];

  function sql(el, sample, onCleanup) {
    const LEVELS = getLevels();
    let db = null, cur = -1;
    const solved = new Set(store.get(SQL_KEY));
    const out = h('div', { class: 'out', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Loading SQLite…'));
    const task = h('p', { class: 'prompt' }, 'Free play, or pick a challenge above.');
    const dialectTip = h('p', { class: 'fb', hidden: true });
    const chips = h('div', { class: 'chips' });
    const norm = (res, ordered) => {
      const rows = (res.length ? res[res.length - 1].values : []).map(r => r.map(v => typeof v === 'number' ? Math.round(v * 100) / 100 : v));
      return JSON.stringify(ordered ? rows : rows.map(r => JSON.stringify(r)).sort());
    };
    const show = (res, modified = db ? db.getRowsModified() : 0) => {
      if (!res.length) return out.replaceChildren(h('p', { class: 'ok' }, T('OK: {n} row(s) changed.', { n: modified })));
      out.replaceChildren(...res.map(r => h('div', {}, h('p', { class: 'muted' }, r.values.length + ' ' + T('row(s)')),
        tableWrap('Query results', h('table', { class: 't' }, h('thead', {}, h('tr', {}, r.columns.map(c => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, r.values.map(row => h('tr', {}, row.map(v => v === null ? h('td', { class: 'null' }, 'NULL') : h('td', {}, v))))))))));
    };
    const updateDialectTip = () => {
      const hit = SQL_DIALECT_HINTS.find(([rx]) => rx.test(ta.value));
      dialectTip.hidden = !hit;
      if (hit) dialectTip.textContent = T('SQLite dialect tip: ') + T(hit[1]);
    };
    const run = () => {
      if (!db) return;
      updateDialectTip();
      try { const res = db.exec(ta.value); show(res); return res; }
      catch (e) { out.replaceChildren(h('p', { class: 'err' }, e.message)); return null; }
    };
    const ta = editor("SELECT name, category, price\nFROM products\nWHERE price > 100\nORDER BY price DESC;", run, 'sql');
    const prevInput = ta.oninput;
    ta.oninput = () => { prevInput && prevInput(); updateDialectTip(); };
    const checkAns = () => {
      if (cur < 0) return out.replaceChildren(h('p', { class: 'muted' }, 'Pick a challenge first.'));
      if (!SQL) return;
      // Show the user's run in the live database, but always grade against a fresh copy of the seed,
      // so an earlier DELETE, UPDATE, or DROP TABLE in free play cannot break grading.
      const liveRes = run();
      const c = CHALLENGES[cur];
      let good = false;
      let snapRes = null;
      let snapErr = null;
      const snap = new SQL.Database();
      try {
        snap.run(SEED);
        const expected = norm(snap.exec(c.sol), c.ordered);
        snapRes = snap.exec(ta.value);
        good = norm(snapRes, c.ordered) === expected;
      } catch (e) {
        good = false;
        snapErr = e;
      } finally {
        snap.close();
      }
      if (!liveRes) {
        if (snapErr) return;
        if (snapRes) show(snapRes, 0);
      }
      if (good) { solved.add(cur); store.set(SQL_KEY, [...solved]); drawChips(); }
      out.prepend(h('p', { class: good ? 'ok' : 'err' }, T(good ? '✓ Correct. Now explain out loud why it works.' : c.ordered ? '✗ Not the expected rows yet. Compare your output with the task (row order matters here).' : '✗ Not the expected rows yet. Compare your output with the task.')));
    };
    const reset = () => {
      if (!SQL) return;
      if (db) { try { db.close(); } catch { /* ignore */ } }
      db = new SQL.Database();
      db.run(SEED);
      out.replaceChildren(h('p', { class: 'ok' }, 'Database reset to its original contents.'));
    };
    const selectChallenge = (i, focusEd = true) => {
      const c = CHALLENGES[i];
      if (!c) return;
      cur = i;
      task.textContent = `${T('Challenge')} ${i + 1} (${LEVELS[c.lvl]}): ${T(c.task)}`;
      ta.value = '-- ' + T(c.t) + '\n';
      updateDialectTip();
      if (focusEd) ta.focus();
      drawChips();
    };
    const drawChips = () => chips.replaceChildren(...CHALLENGES.map((c, i) => h('button', { type: 'button', class: (i === cur ? 'on ' : '') + (solved.has(i) ? 'solved' : ''), title: LEVELS[c.lvl], onclick: () => selectChallenge(i, true) }, c.t)));
    let SQL = null;
    drawChips();
    if (sample && Object.hasOwn(SQL_PRESETS, sample)) selectChallenge(SQL_PRESETS[sample], false);
    const schemaDrawer = h('details', { class: 'schema-drawer' },
      h('summary', {}, 'Schema and foreign keys (5 tables)'),
      tableWrap('Database schema', h('table', { class: 't' },
        h('thead', {}, h('tr', {}, ['Table', 'Columns & keys', 'Rows'].map(c => h('th', { scope: 'col' }, c)))),
        h('tbody', {}, [
          ['customers', 'id (PK INTEGER), name (TEXT), city (TEXT nullable)', '6'],
          ['products', 'id (PK INTEGER), name (TEXT), category (TEXT), price (REAL >= 0), stock (INTEGER >= 0)', '10'],
          ['orders', 'id (PK INTEGER), customer_id (FK -> customers.id), order_date (TEXT YYYY-MM-DD), status (paid|new|cancelled)', '8'],
          ['order_items', 'order_id (FK -> orders.id), product_id (FK -> products.id), quantity, unit_price', '14'],
          ['accounts', 'id (PK INTEGER), owner (TEXT), balance (REAL >= 0)', '2']
        ].map(([tb, cols, cnt]) => h('tr', {}, h('th', { scope: 'row' }, h('code', {}, tb)), h('td', {}, cols), h('td', {}, cnt)))))));
    el.style.setProperty('--tc', 'var(--sql)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'SQL playground'),
        h('p', { class: 'lede' }, 'A live SQLite database runs right in your browser, and you can reset it anytime. Lessons use SQL Server syntax, which mostly runs here with a few quirks. Put LIMIT at the end instead of TOP, use strftime() instead of YEAR(), and expect float rounding on money. SQLite is also looser on WHERE aliases, ungrouped columns, and "double-quoted" strings.')),
      schemaDrawer,
      chips, task,
      h('div', { class: 'play' },
        h('div', {}, ta, dialectTip, h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn', onclick: run }, 'Run (Ctrl+Enter)'),
          h('button', { type: 'button', class: 'btn ghost', onclick: checkAns }, 'Check answer'),
          h('button', { type: 'button', class: 'btn ghost', onclick: async () => {
            if (cur < 0) return;
            const c = CHALLENGES[cur];
            const edited = ta.value.replace(/^--.*$/gm, '').trim().length > 0;
            if (!edited || await confirmDialog(T('Replace your current SQL query with the challenge solution?'), { title: 'Show solution', confirmText: 'Show solution', danger: false })) {
              ta.value = c.sol.replace(/ (FROM|WHERE|GROUP BY|HAVING|ORDER BY|JOIN|LEFT JOIN|SELECT) /g, '\n$1 ');
              updateDialectTip();
            }
          } }, 'Show solution'),
          h('button', { type: 'button', class: 'btn ghost', onclick: reset }, 'Reset database'))),
        out));
    // If SQLite cannot load (offline, blocked), the editor stays and Retry loads it again.
    const loadSql = () => {
      out.replaceChildren(h('p', { class: 'muted' }, 'Loading SQLite…'));
      getSQL().then(S => { SQL = S; reset(); out.replaceChildren(h('p', { class: 'muted' }, 'Ready. Run a query to see results here.')); })
        .catch(e => out.replaceChildren(loadFailure(e.message, loadSql)));
    };
    loadSql();
    onCleanup?.(() => { if (db) { try { db.close(); } catch { /* ignore */ } db = null; } });
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
    'React component': `import { useState } from "react";
import { createRoot } from "react-dom/client";

interface Product { id: number; name: string; price: number }

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Desk", price: 300 },
  { id: 4, name: "Lamp", price: 40 },
];

function ProductList({ items }: { items: Product[] }) {
  const [query, setQuery] = useState("");
  // Derived during render, not stored in state
  const visible = items.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" />
      <p>{visible.length} of {items.length} products</p>
      <ul>
        {visible.map(p => <li key={p.id}>{p.name}: {p.price}</li>)}
      </ul>
    </div>
  );
}

// Try passing a wrong prop, such as items={42}: the editor underlines it.
createRoot(document.getElementById("root")!).render(<ProductList items={products} />);`,
    'React effects': `import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function Clock() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    console.log("effect: timer started");
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => {                       // cleanup runs when Clock leaves the screen
      clearInterval(id);
      console.log("cleanup: timer stopped");
    };
  }, []);
  return <p>Running for {seconds} s</p>;
}

function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow(s => !s)}>{show ? "Hide" : "Show"} the clock</button>
      {show && <Clock />}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);`,
    'async / await': `const wait = (ms: number, value: string) =>
  new Promise<string>(resolve => setTimeout(() => resolve(value), ms));

let start = Date.now();
const a = await wait(300, "A");
const b = await wait(300, "B");
console.log("sequential:", a, b, Date.now() - start, "ms");

start = Date.now();
const both = await Promise.all([wait(300, "A"), wait(300, "B")]);
console.log("concurrent:", both, Date.now() - start, "ms");`,
    'Angular signals': `// Minimal reactive signal + computed — the same push-pull model Angular uses
let currentObserver: (() => void) | null = null;

function signal<T>(initial: T) {
  let value = initial;
  const subs = new Set<() => void>();
  const read = () => {
    if (currentObserver) subs.add(currentObserver);
    return value;
  };
  read.set = (next: T) => {
    if (Object.is(value, next)) return;
    value = next;
    subs.forEach(fn => fn());
  };
  return read;
}

function computed<T>(fn: () => T): () => T {
  let cached: T;
  let dirty = true;
  const notify = () => { dirty = true; };
  return () => {
    if (dirty) {
      const prev = currentObserver;
      currentObserver = notify;
      try { cached = fn(); dirty = false; } finally { currentObserver = prev; }
    }
    return cached;
  };
}

const price = signal(100);
const qty = signal(2);
const total = computed(() => {
  console.log("recomputing total...");
  return price() * qty();
});

console.log("1st read:", total()); // computes once
console.log("2nd read:", total()); // cached!
qty.set(3);
console.log("after qty=3:", total());`,
    'Angular linkedSignal': `// Writable derived state: stays editable, but resets automatically when the source changes
interface Option { id: string; label: string; cost: number }

function createLinkedSignal<S, V>(source: () => S, compute: (src: S, prev?: V) => V) {
  let lastSrc = source();
  let value = compute(lastSrc, undefined);
  const get = () => {
    const cur = source();
    if (!Object.is(cur, lastSrc)) {
      lastSrc = cur;
      value = compute(cur, value);
    }
    return value;
  };
  return { get, set: (v: V) => { value = v; } };
}

let options: Option[] = [
  { id: "std", label: "Standard", cost: 10 },
  { id: "exp", label: "Express", cost: 25 },
];
const shipping = createLinkedSignal(
  () => options,
  (opts, prev) => opts.find(o => o.id === prev?.id) ?? opts[0]
);

shipping.set(options[1]); // user picks Express
console.log("user choice:", shipping.get().label);

options = [
  { id: "std", label: "Standard", cost: 10 },
  { id: "exp", label: "Express", cost: 25 },
  { id: "vip", label: "Same-day", cost: 40 },
];
console.log("kept after adding VIP:", shipping.get().label);

options = [{ id: "pickup", label: "Store pickup", cost: 0 }];
console.log("reset when Express disappeared:", shipping.get().label);`,
    'RxJS switchMap vs exhaustMap': `// Modeling async cancellation (switchMap) vs click-ignoring (exhaustMap)
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function makeSwitchRunner() {
  let latestId = 0;
  return async (label: string, ms: number) => {
    const id = ++latestId;
    await wait(ms);
    if (id !== latestId) {
      console.log("switchMap dropped stale:", label);
      return;
    }
    console.log("switchMap kept latest:", label);
  };
}

function makeExhaustRunner() {
  let busy = false;
  return async (label: string, ms: number) => {
    if (busy) {
      console.log("exhaustMap ignored while busy:", label);
      return;
    }
    busy = true;
    try {
      await wait(ms);
      console.log("exhaustMap finished first:", label);
    } finally {
      busy = false;
    }
  };
}

const search = makeSwitchRunner();
const p1 = search("typing 'ke'", 60);
await wait(15);
const p2 = search("typing 'keyboard'", 40);
await Promise.all([p1, p2]);

const pay = makeExhaustRunner();
const c1 = pay("1st Pay click", 60);
const c2 = pay("accidental double-click", 60);
await Promise.all([c1, c2]);`,
    'ASP.NET ProblemDetails mapper': `// Turning ASP.NET Core RFC 9457 ProblemDetails into structured Angular form errors
interface ProblemDetails {
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

function toApiError(status: number, body: ProblemDetails | null): ApiError {
  return new ApiError(
    body?.title ?? "HTTP " + status,
    status,
    body?.errors ?? {},
  );
}

const serverResponse: ProblemDetails = {
  status: 400,
  title: "One or more validation errors occurred.",
  errors: {
    Price: ["Must be positive"],
    Name: ["Name must be at least 3 characters"],
  },
};

const apiErr = toApiError(400, serverResponse);
console.log("summary:", apiErr.message);
console.log("price error:", apiErr.fieldErrors["Price"]?.[0]);`
  };

  // React 19 from esm.sh, pinned; react-dom is told to share the same React.
  const REACT_IMPORTS = { react: 'https://esm.sh/react@19.1.0', 'react/jsx-runtime': 'https://esm.sh/react@19.1.0/jsx-runtime',
    'react-dom/client': 'https://esm.sh/react-dom@19.1.0/client?deps=react@19.1.0' };
  const usesReact = code => /from\s+["']react(-dom\/client)?["']/.test(code);
  // The preview page: an import map for React, console and errors forwarded to the playground, then the code.
  const reactPage = js => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:12px;font:15px/1.5 system-ui,sans-serif;color:#111;background:#fff}input,button{font:inherit;padding:.3rem .5rem}</style>
<script type="importmap">${JSON.stringify({ imports: REACT_IMPORTS })}<\/script>
<script>
const send = (kind, text) => parent.postMessage({ stackmasteryPreview: true, kind, text }, '*');
const fmt = v => typeof v === 'string' ? v : (() => { try { return JSON.stringify(v); } catch { return String(v); } })();
for (const k of ['log', 'info', 'warn', 'error']) { const orig = console[k]; console[k] = (...a) => { send(k, a.map(fmt).join(' ')); orig.apply(console, a); }; }
addEventListener('error', e => send('err', e.message));
addEventListener('unhandledrejection', e => send('err', String(e.reason && e.reason.message || e.reason)));
<\/script></head><body><div id="root"></div>
<script type="module" onerror="send('err', 'Could not load React from esm.sh. The React preview needs an internet connection.')">
${js.replace(/<\/script/gi, '<\\/script')}
<\/script></body></html>`;

  const TS_PRESETS = {
    'react-js': 'Array methods', 'react-ts': 'Unions & narrowing', 'react-components': 'React component', 'react-jsdeep': 'Array methods',
    'react-state': 'Immutable state', 'react-effects': 'React effects', 'react-forms': 'React component', 'react-generics': 'Generics',
    'react-hooks': 'Immutable state', 'react-perf': 'React component', 'react-server': 'React effects', 'react-tsadv': 'Generics',
    'react-internals': 'Immutable state', 'react-arch': 'React component',
    'angular-signals': 'Angular signals', 'angular-di': 'Angular signals', 'angular-architecture': 'Angular signals',
    'angular-flow': 'Angular signals', 'angular-inputs': 'Angular linkedSignal', 'angular-guards': 'RxJS switchMap vs exhaustMap',
    'angular-cd': 'Angular signals', 'angular-arch': 'ASP.NET ProblemDetails mapper',
    'angular-components': 'Angular signals', 'angular-forms': 'Angular linkedSignal', 'angular-rxjs': 'RxJS switchMap vs exhaustMap',
    'angular-http': 'ASP.NET ProblemDetails mapper', 'angular-routing': 'Angular signals', 'angular-testing': 'ASP.NET ProblemDetails mapper',
    'angular-perf': 'Angular signals', 'angular-interop': 'Angular signals', 'angular-ssr': 'Angular signals',
    signals: 'Angular signals', rxjs: 'RxJS switchMap vs exhaustMap', http: 'ASP.NET ProblemDetails mapper'
  };

  function ts(el, sample, onCleanup) {
    const out = h('div', { class: 'out', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Output appears here.'));
    const ngNote = h('p', { class: 'muted', hidden: true }, 'Note: Signal, linkedSignal, and RxJS models run directly here in TypeScript. Full Angular HTML @Component templates require Angular CLI or StackBlitz.');
    let frame = null;
    const onMessage = e => {
      if (!out.isConnected) return removeEventListener('message', onMessage);   // the page was left
      if (!frame || e.source !== frame.contentWindow || !e.data || !e.data.stackmasteryPreview) return;
      const logs = out.querySelector('pre.preview-log') || out.appendChild(h('pre', { class: 'preview-log' }));
      if (e.data.kind === 'err') out.append(h('p', { class: 'err' }, e.data.text));
      else logs.textContent += (logs.textContent ? '\n' : '') + e.data.text;
    };
    addEventListener('message', onMessage);
    onCleanup?.(() => { removeEventListener('message', onMessage); frame = null; });
    const showReact = async js => {
      frame = h('iframe', { class: 'preview', sandbox: 'allow-scripts', title: 'React preview' });
      frame.srcdoc = reactPage(js);
      out.replaceChildren(...[await typeNote(ta), frame, h('p', { class: 'muted' }, 'Console output from the preview appears below it.')].filter(Boolean));
    };
    const run = async () => {
      out.replaceChildren(h('p', { class: 'muted' }, 'Running…'));
      // The compiler is a large CDN script: if it cannot load, say so and offer Retry instead of a bare error.
      try { await loadTS(); } catch (e) { return out.replaceChildren(loadFailure(String(e.message || e), run)); }
      try {
        const res = window.ts.transpileModule(ta.value, { fileName: 'snippet.tsx', reportDiagnostics: true, compilerOptions: { target: 'ES2022', module: 'ESNext', jsx: window.ts.JsxEmit.ReactJSX } });
        const diag = (res.diagnostics || []).map(d => window.ts.flattenDiagnosticMessageText(d.messageText, '\n'));
        if (diag.length) throw new Error(T('Syntax error: ') + diag.join('\n'));
        if (usesReact(ta.value)) return showReact(res.outputText);
        frame = null;
        const r = await runIsolated(res.outputText);
        out.replaceChildren(...[await typeNote(ta), h('pre', {}, r.logs.join('\n') || (r.err ? '' : T('(no output yet, try console.log)'))), r.err ? h('p', { class: 'err' }, r.err) : null].filter(Boolean));
      } catch (e) {
        out.replaceChildren(h('p', { class: 'err' }, String(e.message || e)));
      }
    };
    const initialName = (sample && TS_PRESETS[sample]) || (sample && TS_EXAMPLES[sample] && sample) || Object.keys(TS_EXAMPLES)[0];
    const ta = editor(TS_EXAMPLES[initialName], run, 'typescript', 'tsx');
    const select = name => {
      ta.value = TS_EXAMPLES[name];
      ngNote.hidden = !/Angular|RxJS|ProblemDetails/.test(name);
      [...chips.children].forEach(c => c.classList.toggle('on', c.dataset.k === name));
    };
    const chips = h('div', { class: 'chips' }, Object.keys(TS_EXAMPLES).map(name => h('button', { type: 'button', 'data-k': name, onclick: () => select(name) }, name)));
    select(initialName);
    el.style.setProperty('--tc', 'var(--react)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'TypeScript playground'),
        h('p', { class: 'lede' }, 'Write TypeScript and run it right away. Type errors show red squiggles as you type and list below on run. Plain TypeScript runs in a worker with a 5-second limit, while React imports render live using React 19 from esm.sh.')),
      chips, ngNote,
      h('div', { class: 'play' },
        h('div', {}, ta, h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', onclick: run }, 'Run (Ctrl+Enter)'))),
        out),
      h('p', { class: 'muted sandbox-note' }, 'Need a full project, such as the Angular CLI or a bundled React app? Open ', sandboxLink('stackblitz'), ' in a new tab.'));
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

  const CSS_PRESETS = {
    html: 'Flexbox navbar',
    flexbox: 'Flexbox navbar',
    grid: 'Responsive grid',
    render: 'Responsive grid',
    box: 'Theme tokens + :has()',
    cascade: 'Theme tokens + :has()',
    units: 'Theme tokens + :has()',
    modern: 'Theme tokens + :has()',
    arch: 'Theme tokens + :has()',
    position: 'Tailwind card',
    tailwind: 'Tailwind card',
    twreact: 'Tailwind card',
    responsive: 'Tailwind responsive'
  };

  function css(el, sample, onCleanup) {
    let t = 0, ro = null;
    const frame = h('iframe', { class: 'preview', sandbox: 'allow-scripts', title: 'Preview' });
    const size = h('span', { class: 'muted' });
    const render = () => {
      const tw = twBox.checked;
      // Inside <style> the HTML parser ends the element at "</style", so a stray one in the CSS box would let the rest
      // of the text become markup in the preview. Escaping the slash keeps it as plain (ignored) CSS text.
      const safeCss = cssTa.value.replace(/<\/style/gi, '<\\/style');
      frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
        (tw ? `<script src="${TAILWIND_URL}" integrity="${SRI[TAILWIND_URL]}" crossorigin="anonymous"><\/script>` : '') +
        `<style${tw ? ' type="text/tailwindcss"' : ''}>${safeCss}</style></head><body>${htmlTa.value}</body></html>`;
    };
    const later = () => { clearTimeout(t); t = setTimeout(render, 350); };
    const htmlTa = editor('', render, 'html'), cssTa = editor('', render, 'css');
    htmlTa.oninput = cssTa.oninput = later;
    const twBox = h('input', { type: 'checkbox', onchange: render });
    const load = name => { const x = CSS_EXAMPLES[name]; htmlTa.value = x.html; cssTa.value = x.css; twBox.checked = !!x.tw; [...chips.children].forEach(c => c.classList.toggle('on', c.dataset.k === name)); render(); };
    const chips = h('div', { class: 'chips' }, Object.keys(CSS_EXAMPLES).map(n => h('button', { type: 'button', 'data-k': n, onclick: () => load(n) }, n)));
    const wrap = h('div', { class: 'preview-wrap' }, frame);
    const unwatch = () => { clearTimeout(t); if (ro) { ro.disconnect(); ro = null; } };
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        if (!frame.isConnected) return unwatch();   // the page was left
        size.textContent = T('Preview width: {w}px (drag the right edge to test breakpoints)', { w: Math.round(frame.clientWidth) });
      });
      ro.observe(frame);
    }
    onCleanup?.(unwatch);
    el.style.setProperty('--tc', 'var(--css)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'CSS + Tailwind playground'),
        h('p', { class: 'lede' }, "Write HTML and CSS and watch the preview update live. Toggle Tailwind to try utility classes and @theme (loads Tailwind's browser build, so internet is needed).")),
      chips,
      h('div', { class: 'play' },
        h('div', {}, h('p', { class: 'ed-label' }, 'HTML'), htmlTa, h('p', { class: 'ed-label' }, 'CSS'), cssTa,
          h('div', { class: 'actions' }, h('label', { class: 'tw-toggle' }, twBox, 'Use Tailwind CSS'))),
        h('div', {}, wrap, size)),
      h('p', { class: 'muted sandbox-note' }, 'Need a full project with a bundler? Open ', sandboxLink('stackblitz'), ' in a new tab.'));
    load((sample && CSS_PRESETS[sample]) || (sample && CSS_EXAMPLES[sample] && sample) || Object.keys(CSS_EXAMPLES)[0]);
  }

  // ---------------- Dart + Flutter (embedded DartPad) ----------------
  // DartPad (dartpad.dev, the official open-source Dart playground) compiles and runs Dart and Flutter in the browser.
  // When the embedded editor reports that it is ready, the selected lesson sample is posted into it.
  const DARTPAD = 'https://dartpad.dev';
  const DART_READY_MS = 10000;   // DartPad answers with 'ready' within this long, or the embed counts as unreachable
  const dartSrc = theme => `${DARTPAD}/?embed=true&theme=${theme}`;
  function dart(el, sample, onCleanup) {
    const track = getTrack('flutter');
    // Samples DartPad can run as they are: a main() and no third-party packages.
    const samples = track.lessons.filter(l => /\bmain\(\)/.test(l.code) && !/package:(?!flutter\/)/.test(l.code));
    let cur = samples.find(l => l.id === sample) || samples[0], ready = false, theme = resolvedTheme(), timer = 0;
    const code = l => l.code.replace(/^\n+|\s+$/g, '');
    const frame = h('iframe', { class: 'dartpad', title: 'DartPad', src: dartSrc(theme), allow: 'clipboard-write' });
    const notice = h('div', {});
    const codeBox = h('div', {});
    const send = () => { if (ready && frame.contentWindow) frame.contentWindow.postMessage({ sourceCode: code(cur), type: 'sourceCode' }, DARTPAD); };
    // A cross-origin iframe cannot report a blocked load, so no 'ready' message in time (or being offline) is the signal.
    const fail = () => { if (!ready) notice.replaceChildren(loadFailure(T('DartPad could not be loaded. It needs an internet connection and may be blocked on this network.'), reload)); };
    const arm = () => { clearTimeout(timer); if (navigator.onLine === false) fail(); else timer = setTimeout(fail, DART_READY_MS); };
    const reload = () => { ready = false; notice.replaceChildren(); frame.src = dartSrc(theme); arm(); };
    const onMsg = e => {
      if (!frame.isConnected) return stop();
      if (e.origin === DARTPAD && e.source === frame.contentWindow && e.data && e.data.type === 'ready') { ready = true; clearTimeout(timer); notice.replaceChildren(); send(); }
    };
    // Switching the site theme (or the OS theme) reloads DartPad with the matching theme, then posts the sample again.
    const unwatchTheme = watchTheme(next => { theme = next; reload(); });
    const stop = () => { removeEventListener('message', onMsg); unwatchTheme(); clearTimeout(timer); };
    addEventListener('message', onMsg);
    onCleanup?.(stop);
    arm();
    const chips = h('div', { class: 'chips' });
    const draw = () => {
      chips.replaceChildren(...samples.map(l => h('button', { type: 'button', class: l === cur ? 'on' : '', onclick: () => { cur = l; draw(); send(); } }, l.title)));
      codeBox.replaceChildren(codeBlock(code(cur), 'dart'));
    };
    draw();
    el.style.setProperty('--tc', 'var(--flutter)');
    el.append(
      h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Practice'), h('h1', {}, 'Dart + Flutter playground'),
        h('p', { class: 'lede' }, 'DartPad compiles and runs real Dart and Flutter right in your browser. Pick a lesson sample, click Run, edit the code, and try it again.')),
      chips,
      h('div', { class: 'play' },
        h('div', {}, h('p', { class: 'ed-label' }, 'Lesson sample'), codeBox,
          h('p', { class: 'muted' }, 'The sample is sent to DartPad automatically. If the editor on the right does not show it, press Copy and paste it in.')),
        h('div', {}, frame, notice,
          h('p', { class: 'muted' }, 'DartPad needs an internet connection. Samples that use packages such as flutter_bloc or go_router are meant for a local project: ', h('code', {}, 'flutter create'), '.'),
          h('p', { class: 'muted sandbox-note' }, 'Prefer a bigger window? Open ', sandboxLink('dartpad'), ' in a new tab.'))));
  }

export const loadTS = () => loadScript(TS_URL);
export { sql, ts, css, dart, editor, typeNote };
export const PLAY = { sql, ts, css, dart, editor, typeNote, loadTS };
