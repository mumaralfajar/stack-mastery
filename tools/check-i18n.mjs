// Checks that the Indonesian content lines up with the English data:
// every lesson, quiz question, answer list, problem, design case and Q&A has a translation of the same shape.
// Usage: node tools/check-i18n.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const errors = [];
const uiOwners = new Map();
let curFile = '';
globalThis.window = globalThis;
globalThis.TRACKS = [];
globalThis.I18N = {
  ui: new Map(), tracks: {},
  add(d) {
    for (const k in d) {
      if (uiOwners.has(k)) errors.push(`duplicate I18N.ui key "${k}" (in ${curFile}, first defined in ${uiOwners.get(k)})`);
      else uiOwners.set(k, curFile);
      this.ui.set(k, d[k]);
    }
  },
  lessons(id, lessons, meta) { const t = this.tracks[id] || (this.tracks[id] = { lessons: {} }); Object.assign(t, meta); Object.assign(t.lessons, lessons); }
};
const run = f => { curFile = f; (0, eval)(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8')); };
['csharp', 'aspnet', 'go', 'sql', 'css', 'react', 'angular', 'flutter', 'sysdesign', 'fundamentals', 'projects', 'interview', 'interview-cs'].forEach(f => run(f + '.js'));
readdirSync(new URL('../data/id/', import.meta.url)).forEach(f => run('id/' + f));

const same = (where, a, b) => { if (!Array.isArray(b) || a.length !== b.length) errors.push(`${where}: expected ${a.length} items, found ${Array.isArray(b) ? b.length : 'none'}`); };
const ticks = (where, a, b) => { const n = s => (String(s).match(/`/g) || []).length; if (n(a) !== n(b)) errors.push(`${where}: different number of code spans`); };

let lessons = 0;
for (const t of TRACKS) {
  const tr = I18N.tracks[t.id];
  if (!tr) { errors.push(`track ${t.id}: no translation`); continue; }
  for (const id of Object.keys(tr.lessons)) if (!t.lessons.some(l => l.id === id)) errors.push(`${t.id}/${id}: translation for a lesson that does not exist`);
  for (const l of t.lessons) {
    const x = tr.lessons[l.id], w = `${t.id}/${l.id}`;
    if (!x) { errors.push(`${w}: not translated`); continue; }
    lessons++;
    for (const f of ['title', 'why', 'practice', 'teach', 'analogy']) if (!x[f]) errors.push(`${w}: missing ${f}`); else if (f !== 'title') ticks(`${w}.${f}`, l[f], x[f]);
    same(`${w}.points`, l.points, x.points); same(`${w}.pitfalls`, l.pitfalls, x.pitfalls); same(`${w}.quiz`, l.quiz, x.quiz);
    if (l.terms) {
      same(`${w}.terms`, l.terms, x.terms);
      (x.terms || []).forEach((pair, i) => {
        if (l.terms[i]) {
          same(`${w}.terms[${i}]`, l.terms[i], pair);
          ticks(`${w}.terms[${i}][0]`, l.terms[i][0], pair[0]);
          ticks(`${w}.terms[${i}][1]`, l.terms[i][1], pair[1]);
        }
      });
    }
    if (l.splits) same(`${w}.splits`, l.splits, x.splits);
    if (l.predict) {
      if (!x.predict || !x.predict.prompt || !x.predict.explain) errors.push(`${w}: missing predict translation`);
      else { same(`${w}.predict.options`, l.predict.options, x.predict.options); ticks(`${w}.predict.prompt`, l.predict.prompt, x.predict.prompt); ticks(`${w}.predict.explain`, l.predict.explain, x.predict.explain); }
    }
    (x.points || []).forEach((p, i) => l.points[i] && ticks(`${w}.points[${i}]`, l.points[i], p));
    (x.quiz || []).forEach((q, i) => { if (l.quiz[i]) { same(`${w}.quiz[${i}].answers`, l.quiz[i].a, q[1]); ticks(`${w}.quiz[${i}].q`, l.quiz[i].q, q[0]); } });
  }
}

same('projects', PROJECTS, I18N.projects);
PROJECTS.forEach((p, i) => { const x = (I18N.projects || [])[i] || {}; same(`project ${i}.build`, p.build, x.build); same(`project ${i}.stretch`, p.stretch, x.stretch); });

const iv = I18N.iv || {};
for (const f of ['method', 'bigO', 'plan', 'hiring', 'ui']) same('interview.' + f, IV[f], iv[f]);
(iv.ui || []).forEach((u, i) => { if (IV.ui[i] && u) { ticks(`interview.ui[${i}][1]`, IV.ui[i][1], u[1]); ticks(`interview.ui[${i}][2]`, IV.ui[i][2], u[2]); } });
IV.plan.forEach((w, i) => same(`interview.plan[${i}]`, w[1], ((iv.plan || [])[i] || [])[1]));
for (const p of IV.patterns) if (!(iv.patterns || {})[p.id]) errors.push(`pattern ${p.id}: not translated`);
for (const p of IV.problems) { const x = (iv.problems || {})[p.id]; if (!x) errors.push(`problem ${p.id}: not translated`); else { same(`problem ${p.id}.hints`, p.hints, x.hints); same(`problem ${p.id}.follow`, p.follow, x.follow); } }
for (const b of IV.behavioral) { const x = (iv.behavioral || {})[b.id]; if (!x) errors.push(`behavioral ${b.id}: not translated`); else same(`behavioral ${b.id}.qs`, b.qs, x.qs); }
same('design.framework', IV.design.framework, (iv.design || {}).framework); same('design.blocks', IV.design.blocks, (iv.design || {}).blocks);
for (const c of IV.design.cases) { const x = ((iv.design || {}).cases || {})[c.id]; if (!x) errors.push(`design case ${c.id}: not translated`); else for (const f of ['req', 'est', 'deep', 'follow']) same(`design ${c.id}.${f}`, c[f], x[f]); }
same('rapid', IV.rapid, iv.rapid);
IV.rapid.forEach((r, i) => same(`rapid[${i}] ${r.area}`, r.qs, ((iv.rapid || [])[i] || {}).qs));

// Guard against Object.assign(I18N.ui, ...) bypassing Map.set() (which leaves own properties on the Map).
const strayOwnKeys = Object.keys(I18N.ui);
if (strayOwnKeys.length) errors.push(`I18N.ui has ${strayOwnKeys.length} own object property key(s) instead of Map entries (use I18N.add(...)): ${strayOwnKeys.slice(0, 5).join(', ')}`);

// Check {var} placeholder parity and non-empty translations across all I18N.ui entries.
const placeholders = s => [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(m => m[1]).sort().join(',');
for (const [k, v] of I18N.ui) {
  if (!v || !String(v).trim()) errors.push(`empty I18N.ui translation for: ${k}`);
  else if (placeholders(k) !== placeholders(v)) errors.push(`placeholder mismatch for "${k}": expected {${placeholders(k)}}, found {${placeholders(v)}}`);
}

// Check T(), W.t(), section(), and viz title/desc literals in src/scripts/ exist in I18N.ui.
const scanScripts = dir => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) scanScripts(p);
    else if (e.name.endsWith('.js')) {
      const s = readFileSync(p, 'utf8');
      for (const m of s.matchAll(/\b(?:W\.t|T)\(\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
        const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
        if (/[A-Za-z]{2,}/.test(key) && !I18N.ui.has(key)) errors.push(`missing ui translation (${e.name}): ${key}`);
      }
      for (const m of s.matchAll(/\bsection\(\s*['"][^'"]+['"]\s*,\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
        const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
        if (/[A-Za-z]{2,}/.test(key) && !I18N.ui.has(key)) errors.push(`missing section translation (${e.name}): ${key}`);
      }
      if (p.includes('viz')) {
        for (const m of s.matchAll(/\b(?:title|desc)\s*:\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
          const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
          if (!I18N.ui.has(key)) errors.push(`missing viz metadata translation (${e.name}): ${key}`);
        }
      }
    }
  }
};
scanScripts(fileURLToPath(new URL('../src/scripts', import.meta.url)));

// ---------- h() children, translated attributes, table headers, playground example keys ----------
// h() runs every plain string child and its placeholder / title / aria-label through t(), so each such
// literal needs an Indonesian entry. Strings that are code, SQL or brand tokens are allowed through
// NON_UI below, and anything without two consecutive letters (symbols, numbers) is skipped.
const NON_UI = new Set([
  // brand, language and tool names shown as-is in both languages
  'Stack Mastery', 'HTML', 'CSS', 'NULL', 'DartPad', 'Tailwind', 'TypeScript', 'React', 'Angular', 'SQLite', 'Tailwind: ',
  // code literals, identifiers and metric tokens drawn inside labs and diagrams
  '48 RPS', '#1 Person', 'sub', 'err == nil', 'Header · z-index: 10', 'Tooltip · z-index: 9999',
  // SQL table aliases and result column names
  'customers c', 'orders o', 'id', 'category', 'total', 'order_date', 'amount', 'running', 'rn'
]);
const BS = String.fromCharCode(92);   // backslash
const skipStr = (s, i, q) => { i++; while (i < s.length && s[i] !== q) { if (s[i] === BS) i++; i++; } return i + 1; };
// A "/" starts a regex literal (not division) when the previous code character is an operator or bracket.
const startsRegex = (s, i) => { let j = i - 1; while (j >= 0 && /\s/.test(s[j])) j--; return j < 0 || '(,=:[!&|?{};+-*%<>~^'.includes(s[j]); };
const skipRegex = (s, i) => {
  let cls = false; i++;
  while (i < s.length && s[i] !== '\n') {
    if (s[i] === BS) { i += 2; continue; }
    if (s[i] === '[') cls = true; else if (s[i] === ']') cls = false; else if (s[i] === '/' && !cls) return i + 1;
    i++;
  }
  return i;
};
// Splits the argument list that starts right after "(" at index i into [start, end] ranges.
function splitArgs(s, i) {
  const args = []; let depth = 0, start = i;
  while (i < s.length) {
    const c = s[i];
    if (c === "'" || c === '"') { i = skipStr(s, i, c); continue; }
    if (c === '`') { i = skipTpl(s, i); continue; }
    if (c === '/' && s[i + 1] === '/') { const n = s.indexOf('\n', i); i = n < 0 ? s.length : n; continue; }
    if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i) + 2; continue; }
    if (c === '/' && startsRegex(s, i)) { i = skipRegex(s, i); continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { if (!depth) { args.push([start, i]); return { args, end: i }; } depth--; }
    else if (c === ',' && !depth) { args.push([start, i]); start = i + 1; }
    i++;
  }
  return { args, end: i };
}
function skipTpl(s, i) {
  i++;
  while (i < s.length && s[i] !== '`') {
    if (s[i] === BS) { i += 2; continue; }
    if (s[i] === '$' && s[i + 1] === '{') { i = splitArgs(s, i + 2).end + 1; continue; }
    i++;
  }
  return i + 1;
}
const unq = t => { const m = t.trim().match(/^(['"])((?:\\.|(?!\1).)*)\1$/); return m ? m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n') : null; };
const needsUi = (key, where) => {
  if (key == null || !/[A-Za-z]{2,}/.test(key) || NON_UI.has(key) || I18N.ui.has(key)) return;
  errors.push(`untranslated UI string (${where}): ${key}`);
};
const scanUi = dir => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { scanUi(p); continue; }
    if (!e.name.endsWith('.js')) continue;
    const s = readFileSync(p, 'utf8');
    for (const m of s.matchAll(/(?<![\w.$])h\(/g)) {
      const { args } = splitArgs(s, m.index + 2);
      if (/^\s*['"](?:pre|code|kbd|samp|style|script)['"]\s*$/.test(s.slice(...(args[0] || [0, 0])))) continue;   // code, never translated
      args.slice(2).forEach(([a, b]) => needsUi(unq(s.slice(a, b)), e.name));
      const attrs = args[1] && s.slice(...args[1]);
      if (attrs) for (const am of attrs.matchAll(/(?:placeholder|title|'aria-label')\s*:\s*(['"])((?:\\.|(?!\1).)+)\1/g)) needsUi(unq(am[1] + am[2] + am[1]), e.name + ' attribute');
    }
    // Table header rows built as ['Col', ...].map(c => h('th', ...))
    for (const m of s.matchAll(/\[((?:\s*(['"])(?:\\.|(?!\2).)*\2\s*,?)+)\]\s*\.map\(\s*\(?\s*\w+\s*\)?\s*=>\s*h\(\s*'th'/g)) {
      for (const c of m[1].matchAll(/(['"])((?:\\.|(?!\1).)*)\1/g)) needsUi(unq(c[0]), e.name + ' table header');
    }
    // Playground example chips render their object keys as labels.
    for (const name of ['TS_EXAMPLES', 'CSS_EXAMPLES']) {
      const at = s.search(new RegExp(String.raw`\bconst ${name}\s*=\s*\{`));
      if (at < 0) continue;
      const open = s.indexOf('{', at), { args } = splitArgs(s, open + 1);
      for (const [a, b] of args) { const k = s.slice(a, b).match(/^\s*(['"])((?:\\.|(?!\1).)+)\1\s*:/); if (k) needsUi(k[2], `${e.name} ${name} chip`); }
    }
  }
};
scanUi(fileURLToPath(new URL('../src/scripts', import.meta.url)));

console.log(`${lessons} lessons, ${I18N.ui.size} interface strings checked.`);
if (errors.length) { console.log(errors.length + ' problem(s):\n' + errors.join('\n')); process.exit(1); }
console.log('Indonesian content matches the English structure.');
