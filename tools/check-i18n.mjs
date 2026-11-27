// Checks that the Indonesian content, manifest metadata, and UI strings line up with English source data:
// every lesson, quiz question, answer list, problem, design case, Q&A, manifest entry, and UI label matches.
// UI strings are collected from t()/T()/md() calls and h() children in .js/.ts sources and from .astro templates.
// Usage: node tools/check-i18n.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCurriculum, loadInterviewData } from '../src/data/index.ts';
import { ID_CORE_TRACKS, ID_PROJECTS } from '../src/data/id/core.ts';
import { loadIdCurriculum, loadIdInterview } from '../src/data/id/index.ts';
import { interviewId } from '../src/data/id/interview.js';
import { ID_UI_DICTS } from '../src/data/id/ui.ts';
import { ID_WEB_TRACKS } from '../src/data/id/web.ts';
import { INTERVIEW_TOTALS, LESSON_INDEX, LEVELS_EN, LEVELS_ID, TRACK_META } from '../src/data/manifest.ts';
import { getAllTracks, getInterview, getProjects, getTrack } from '../src/lib/i18n.ts';
import { VIZ, VIZ_IDS, VIZ_MODULE, loadAllViz } from '../src/scripts/viz/registry.ts';
import { checkManifestSync } from './sync-manifest.mjs';

await loadCurriculum();
const IV = await loadInterviewData();
await loadIdCurriculum();
await loadIdInterview();
await loadAllViz();

const TRACKS = getAllTracks('en');
const PROJECTS = getProjects('en');

const errors = [];
const uiMap = new Map();
const uiOwners = new Map();

const allUiDicts = ID_UI_DICTS;
for (const [file, dict] of allUiDicts) {
  for (const [k, v] of Object.entries(dict)) {
    if (uiOwners.has(k)) {
      errors.push(`duplicate I18N.ui key "${k}" (in ${file}, first defined in ${uiOwners.get(k)})`);
    } else {
      uiOwners.set(k, file);
    }
    uiMap.set(k, v);
  }
}

const idTracksById = Object.fromEntries([...ID_CORE_TRACKS, ...ID_WEB_TRACKS].map((tr) => [tr.id, tr]));

const same = (where, a, b) => {
  if (!Array.isArray(b) || a.length !== b.length) {
    errors.push(`${where}: expected ${a.length} items, found ${Array.isArray(b) ? b.length : 'none'}`);
  }
};
const ticks = (where, a, b) => {
  const n = (s) => (String(s).match(/`/g) || []).length;
  if (n(a) !== n(b)) errors.push(`${where}: different number of code spans`);
};

let lessons = 0;
for (const t of TRACKS) {
  const tr = idTracksById[t.id];
  if (!tr) {
    errors.push(`track ${t.id}: no translation`);
    continue;
  }
  for (const id of Object.keys(tr.lessons)) {
    if (!t.lessons.some((l) => l.id === id)) errors.push(`${t.id}/${id}: translation for a lesson that does not exist`);
  }
  for (const l of t.lessons) {
    const x = tr.lessons[l.id];
    const w = `${t.id}/${l.id}`;
    if (!x) {
      errors.push(`${w}: not translated`);
      continue;
    }
    lessons++;
    for (const f of ['title', 'why', 'practice', 'teach', 'analogy']) {
      if (!x[f]) errors.push(`${w}: missing ${f}`);
      else if (f !== 'title') ticks(`${w}.${f}`, l[f], x[f]);
    }
    same(`${w}.points`, l.points, x.points);
    same(`${w}.pitfalls`, l.pitfalls, x.pitfalls);
    if (!x.quiz || typeof x.quiz !== 'object' || Array.isArray(x.quiz)) {
      errors.push(`${w}.quiz: expected keyed object matching quiz IDs, found ${Array.isArray(x.quiz) ? 'array' : typeof x.quiz}`);
    } else {
      const seenQuizIds = new Set();
      for (const q of l.quiz) {
        if (!q.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(q.id)) {
          errors.push(`${w}: quiz question missing valid slug id (${q.id})`);
        } else if (seenQuizIds.has(q.id)) {
          errors.push(`${w}: duplicate quiz id "${q.id}"`);
        } else {
          seenQuizIds.add(q.id);
        }
        const tq = x.quiz[q.id];
        if (!tq) {
          errors.push(`${w}.quiz.${q.id}: missing Indonesian translation`);
        } else {
          same(`${w}.quiz.${q.id}.answers`, q.a, tq[1]);
          ticks(`${w}.quiz.${q.id}.q`, q.q, tq[0]);
        }
      }
      for (const k of Object.keys(x.quiz)) {
        if (!seenQuizIds.has(k)) {
          errors.push(`${w}.quiz.${k}: Indonesian translation for unknown quiz id`);
        }
      }
    }
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
      else {
        same(`${w}.predict.options`, l.predict.options, x.predict.options);
        ticks(`${w}.predict.prompt`, l.predict.prompt, x.predict.prompt);
        ticks(`${w}.predict.explain`, l.predict.explain, x.predict.explain);
      }
    }
    (x.points || []).forEach((p, i) => l.points[i] && ticks(`${w}.points[${i}]`, l.points[i], p));
  }
}

same('projects', PROJECTS, ID_PROJECTS);
PROJECTS.forEach((p, i) => {
  const x = ID_PROJECTS[i] || {};
  same(`project ${i}.build`, p.build, x.build);
  same(`project ${i}.stretch`, p.stretch, x.stretch);
});

const iv = interviewId || {};
for (const f of ['method', 'bigO', 'plan', 'hiring', 'ui']) same('interview.' + f, IV[f], iv[f]);
(iv.ui || []).forEach((u, i) => {
  if (IV.ui[i] && u) {
    ticks(`interview.ui[${i}][1]`, IV.ui[i][1], u[1]);
    ticks(`interview.ui[${i}][2]`, IV.ui[i][2], u[2]);
  }
});
IV.plan.forEach((w, i) => same(`interview.plan[${i}]`, w[1], ((iv.plan || [])[i] || [])[1]));
for (const p of IV.patterns) if (!(iv.patterns || {})[p.id]) errors.push(`pattern ${p.id}: not translated`);
for (const p of IV.problems) {
  const x = (iv.problems || {})[p.id];
  if (!x) errors.push(`problem ${p.id}: not translated`);
  else {
    same(`problem ${p.id}.hints`, p.hints, x.hints);
    same(`problem ${p.id}.follow`, p.follow, x.follow);
  }
}
for (const b of IV.behavioral) {
  const x = (iv.behavioral || {})[b.id];
  if (!x) errors.push(`behavioral ${b.id}: not translated`);
  else same(`behavioral ${b.id}.qs`, b.qs, x.qs);
}
same('design.framework', IV.design.framework, (iv.design || {}).framework);
same('design.blocks', IV.design.blocks, (iv.design || {}).blocks);
for (const c of IV.design.cases) {
  const x = ((iv.design || {}).cases || {})[c.id];
  if (!x) errors.push(`design case ${c.id}: not translated`);
  else for (const f of ['req', 'est', 'deep', 'follow']) same(`design ${c.id}.${f}`, c[f], x[f]);
}
same('rapid', IV.rapid, iv.rapid);
IV.rapid.forEach((r, i) => same(`rapid[${i}] ${r.area}`, r.qs, ((iv.rapid || [])[i] || {}).qs));

// ---------- Manifest parity checks ----------
same('manifest.LEVELS_EN/ID', LEVELS_EN, LEVELS_ID);
const actualRapidTotal = IV.rapid.reduce((a, r) => a + r.qs.length, 0);
const expectedTotals = {
  problems: IV.problems.length,
  cases: IV.design.cases.length,
  behavioralThemes: IV.behavioral.length,
  rapidTotal: actualRapidTotal,
  maxMocks: 8,
};
for (const [k, exp] of Object.entries(expectedTotals)) {
  if (INTERVIEW_TOTALS[k] !== exp) {
    errors.push(`manifest.INTERVIEW_TOTALS.${k}: expected ${exp}, found ${INTERVIEW_TOTALS[k]}`);
  }
}
same('manifest.TRACK_META', TRACKS, TRACK_META);
const MAX_VERIFIED_AGE_DAYS = 180;
const nowMs = Date.now();
TRACKS.forEach((t, i) => {
  const m = TRACK_META[i];
  if (
    !m ||
    m.id !== t.id ||
    m.lessonCount !== t.lessons.length ||
    m.verifiedAgainst !== t.verifiedAgainst ||
    m.verifiedDate !== t.verifiedDate
  ) {
    errors.push(`manifest.TRACK_META[${i}]: mismatch for track ${t.id}`);
  }
  if (!t.verifiedAgainst || !t.verifiedAgainst.trim()) {
    errors.push(`track ${t.id}: missing verifiedAgainst metadata`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.verifiedDate || '') || Number.isNaN(Date.parse(t.verifiedDate))) {
    errors.push(`track ${t.id}: invalid verifiedDate "${t.verifiedDate}" (expected YYYY-MM-DD)`);
  } else {
    const ageDays = (nowMs - Date.parse(t.verifiedDate)) / 86400000;
    if (ageDays > MAX_VERIFIED_AGE_DAYS) {
      errors.push(`track ${t.id}: verifiedDate "${t.verifiedDate}" is ${Math.round(ageDays)} days old (max ${MAX_VERIFIED_AGE_DAYS})`);
    }
  }
});
const flatLessons = TRACKS.flatMap((t) =>
  t.lessons.map((l) => ({ trackId: t.id, id: l.id, level: l.level, mins: l.mins, viz: l.viz, quizIds: l.quiz.map((q) => q.id) })),
);
same('manifest.LESSON_INDEX', flatLessons, LESSON_INDEX);
flatLessons.forEach((fl, i) => {
  const m = LESSON_INDEX[i];
  if (!m || m.trackId !== fl.trackId || m.id !== fl.id || m.level !== fl.level || m.mins !== fl.mins || (m.viz || '') !== (fl.viz || '')) {
    errors.push(`manifest.LESSON_INDEX[${i}]: mismatch for ${fl.trackId}/${fl.id}`);
  } else if (JSON.stringify(m.quizIds) !== JSON.stringify(fl.quizIds)) {
    // The sidebar's due-card badge and legacy migration use quizIds without loading lesson prose.
    errors.push(`manifest.LESSON_INDEX[${i}].quizIds: expected ${JSON.stringify(fl.quizIds)} for ${fl.trackId}/${fl.id}, found ${JSON.stringify(m.quizIds)}`);
  }
});

// ---------- Visual lab registry: loadViz(id) must find every lab in the module the registry names ----------
const vizKeys = Object.keys(VIZ).sort().join(',');
if (vizKeys !== [...VIZ_IDS].sort().join(',')) {
  errors.push(`viz registry: VIZ_MODULE ids [${[...VIZ_IDS].sort()}] differ from registered labs [${vizKeys}]`);
}
const vizSrc = (mod) => readFileSync(fileURLToPath(new URL(`../src/scripts/viz/${mod}.ts`, import.meta.url)), 'utf8');
for (const [id, mod] of Object.entries(VIZ_MODULE)) {
  if (!new RegExp(String.raw`\bVIZ\.${id}\s*=`).test(vizSrc(mod))) errors.push(`viz registry: ${id} is not defined in ${mod}.js`);
}
for (const l of flatLessons) {
  if (l.viz && !VIZ_IDS.includes(l.viz)) errors.push(`${l.trackId}/${l.id}: lesson viz "${l.viz}" is not in the registry`);
}

// ---------- Pure immutability check for i18n selectors ----------
const sampleEnTitle = getTrack('csharp', 'en')?.lessons[0]?.title;
const sampleIdTitle = getTrack('csharp', 'id')?.lessons[0]?.title;
const sampleEnTitleAfter = getTrack('csharp', 'en')?.lessons[0]?.title;
if (!sampleEnTitle || !sampleIdTitle || sampleEnTitle === sampleIdTitle || sampleEnTitle !== sampleEnTitleAfter) {
  errors.push(`i18n immutability failure: EN="${sampleEnTitle}" -> "${sampleEnTitleAfter}", ID="${sampleIdTitle}"`);
}
const ivEnPrompt = getInterview('en')?.problems[0]?.prompt;
const ivIdPrompt = getInterview('id')?.problems[0]?.prompt;
if (!ivEnPrompt || !ivIdPrompt || ivEnPrompt === ivIdPrompt || getInterview('en')?.problems[0]?.prompt !== ivEnPrompt) {
  errors.push('i18n immutability failure for getInterview()');
}

// Check {var} placeholder parity and non-empty translations across all I18N.ui entries.
const placeholders = (s) => [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(',');
for (const [k, v] of uiMap) {
  if (!v || !String(v).trim()) errors.push(`empty I18N.ui translation for: ${k}`);
  else if (placeholders(k) !== placeholders(v)) {
    errors.push(`placeholder mismatch for "${k}": expected {${placeholders(k)}}, found {${placeholders(v)}}`);
  }
}

// Check t(), T(), section(), and viz title/desc literals in src/scripts/ and src/lib/ exist in uiMap.
const scanScripts = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      scanScripts(p);
      continue;
    }
    if (!e.name.endsWith('.js') && !e.name.endsWith('.ts')) continue;
    if (e.name === 'types.ts' || e.name === 'i18n.ts' || e.name === 'highlight.ts') continue;
    const s = readFileSync(p, 'utf8');
    for (const m of s.matchAll(/(?<![.\w$])(?:t|T)\(\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
      const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
      if (/[A-Za-z]{2,}/.test(key) && !uiMap.has(key)) errors.push(`missing ui translation (${e.name}): ${key}`);
    }
    for (const m of s.matchAll(/\bsection\(\s*['"][^'"]+['"]\s*,\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
      const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
      if (/[A-Za-z]{2,}/.test(key) && !uiMap.has(key)) errors.push(`missing section translation (${e.name}): ${key}`);
    }
    if (p.includes('viz') && e.name !== 'registry.ts') {
      for (const m of s.matchAll(/\b(?:title|desc)\s*:\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
        const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
        if (!uiMap.has(key)) errors.push(`missing viz metadata translation (${e.name}): ${key}`);
      }
    }
  }
};
scanScripts(fileURLToPath(new URL('../src/scripts', import.meta.url)));
scanScripts(fileURLToPath(new URL('../src/lib', import.meta.url)));

// ---------- h() children, translated attributes, table headers, playground example keys ----------
const NON_UI = new Set([
  // brand, language and tool names shown as-is in both languages
  'Stack Mastery', 'HTML', 'CSS', 'NULL', 'DartPad', 'Tailwind', 'TypeScript', 'React', 'Angular', 'SQLite', 'Tailwind: ',
  // code literals, identifiers and metric tokens drawn inside labs and diagrams
  '48 RPS', '#1 Person', 'sub', 'err == nil', 'Header · z-index: 10', 'Tooltip · z-index: 9999',
  // SQL table aliases and result column names
  'customers c', 'orders o', 'id', 'category', 'total', 'order_date', 'amount', 'running', 'rn',
]);
const BS = String.fromCharCode(92);
const skipStr = (s, i, q) => {
  i++;
  while (i < s.length && s[i] !== q) {
    if (s[i] === BS) i++;
    i++;
  }
  return i + 1;
};
const startsRegex = (s, i) => {
  let j = i - 1;
  while (j >= 0 && /\s/.test(s[j])) j--;
  return j < 0 || '(,=:[!&|?{};+-*%<>~^'.includes(s[j]);
};
const skipRegex = (s, i) => {
  let cls = false;
  i++;
  while (i < s.length && s[i] !== '\n') {
    if (s[i] === BS) {
      i += 2;
      continue;
    }
    if (s[i] === '[') cls = true;
    else if (s[i] === ']') cls = false;
    else if (s[i] === '/' && !cls) return i + 1;
    i++;
  }
  return i;
};
function splitArgs(s, i) {
  const args = [];
  let depth = 0;
  let start = i;
  while (i < s.length) {
    const c = s[i];
    if (c === "'" || c === '"') {
      i = skipStr(s, i, c);
      continue;
    }
    if (c === '`') {
      i = skipTpl(s, i);
      continue;
    }
    if (c === '/' && s[i + 1] === '/') {
      const n = s.indexOf('\n', i);
      i = n < 0 ? s.length : n;
      continue;
    }
    if (c === '/' && s[i + 1] === '*') {
      i = s.indexOf('*/', i) + 2;
      continue;
    }
    if (c === '/' && startsRegex(s, i)) {
      i = skipRegex(s, i);
      continue;
    }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') {
      if (!depth) {
        args.push([start, i]);
        return { args, end: i };
      }
      depth--;
    } else if (c === ',' && !depth) {
      args.push([start, i]);
      start = i + 1;
    }
    i++;
  }
  return { args, end: i };
}
function skipTpl(s, i) {
  i++;
  while (i < s.length && s[i] !== '`') {
    if (s[i] === BS) {
      i += 2;
      continue;
    }
    if (s[i] === '$' && s[i + 1] === '{') {
      i = splitArgs(s, i + 2).end + 1;
      continue;
    }
    i++;
  }
  return i + 1;
}
const unq = (txt) => {
  const m = txt.trim().match(/^(['"])((?:\\.|(?!\1).)*)\1$/);
  return m ? m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n') : null;
};
const needsUi = (key, where) => {
  if (key == null || !/[A-Za-z]{2,}/.test(key) || NON_UI.has(key) || uiMap.has(key)) return;
  errors.push(`untranslated UI string (${where}): ${key}`);
};
const scanUi = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      scanUi(p);
      continue;
    }
    if (!e.name.endsWith('.js') && !e.name.endsWith('.ts')) continue;
    if (e.name === 'types.ts' || e.name === 'i18n.ts' || e.name === 'highlight.ts') continue;
    const s = readFileSync(p, 'utf8');
    for (const m of s.matchAll(/(?<![\w.$])h\(/g)) {
      // Skip function declaration `export function h(` in dom.ts
      if (s.slice(Math.max(0, m.index - 10), m.index).includes('function ')) continue;
      const { args } = splitArgs(s, m.index + 2);
      if (/^\s*['"](?:pre|code|kbd|samp|style|script)['"]\s*$/.test(s.slice(...(args[0] || [0, 0])))) continue;
      args.slice(2).forEach(([a, b]) => needsUi(unq(s.slice(a, b)), e.name));
      const attrs = args[1] && s.slice(...args[1]);
      if (attrs) {
        for (const am of attrs.matchAll(/(?:placeholder|title|'aria-label')\s*:\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
          needsUi(unq(am[1] + am[2] + am[1]), e.name + ' attribute');
        }
      }
    }
    for (const m of s.matchAll(/\[((?:\s*(['"])(?:\\.|(?!\2).)*\2\s*,?)+)\]\s*\.map\(\s*\(?\s*\w+\s*\)?\s*=>\s*h\(\s*'th'/g)) {
      for (const c of m[1].matchAll(/(['"])((?:\\.|(?!\1).)*)\1/g)) needsUi(unq(c[0]), e.name + ' table header');
    }
    for (const name of ['TS_EXAMPLES', 'CSS_EXAMPLES']) {
      const at = s.search(new RegExp(String.raw`\bconst ${name}\s*=\s*\{`));
      if (at < 0) continue;
      const open = s.indexOf('{', at);
      const { args } = splitArgs(s, open + 1);
      for (const [a, b] of args) {
        const k = s.slice(a, b).match(/^\s*(['"])((?:\\.|(?!\1).)+)\1\s*:/);
        if (k) needsUi(k[2], `${e.name} ${name} chip`);
      }
    }
    for (const m of s.matchAll(/\b(?:confirmDialog|alertDialog)\(/g)) {
      if (s.slice(Math.max(0, m.index - 10), m.index).includes('function ')) continue;
      const { args } = splitArgs(s, m.index + m[0].length);
      const opts = args[1] && s.slice(...args[1]);
      if (opts) {
        for (const om of opts.matchAll(/\b(?:title|confirmText|cancelText|okText)\s*:\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
          needsUi(unq(om[1] + om[2] + om[1]), e.name + ' dialog option');
        }
      }
    }
  }
};
scanUi(fileURLToPath(new URL('../src/scripts', import.meta.url)));
scanUi(fileURLToPath(new URL('../src/lib', import.meta.url)));

// ---------- .astro templates: T()/t()/md() literals and translatable string constants in frontmatter ----------
// Templates translate at build time through pageStrings(lang).T / t(key, lang); every literal key and every
// multi-word string constant in a template's frontmatter must exist in the Indonesian dictionaries.
// 404.astro is intentionally bilingual inline and is skipped.
const ASTRO_SKIP = new Set(['404.astro']);
const NON_UI_ASTRO = new Set(['Stack Mastery', 'Bahasa Indonesia', 'English']);
let astroFiles = 0;
const scanAstro = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      scanAstro(p);
      continue;
    }
    if (!e.name.endsWith('.astro') || ASTRO_SKIP.has(e.name)) continue;
    astroFiles++;
    const s = readFileSync(p, 'utf8');
    const where = `${e.name}`;
    const reported = new Set();
    const report = (kind, key) => {
      if (reported.has(key)) return;
      reported.add(key);
      errors.push(`${kind} (${where}): ${key}`);
    };
    for (const m of s.matchAll(/(?<![.\w$])(?:t|T|md)\(\s*(['"])((?:\\.|(?!\1).)+)\1/g)) {
      const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
      if (/[A-Za-z]{2,}/.test(key) && !uiMap.has(key)) report('missing ui translation', key);
    }
    const fm = s.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    // Drop imports and line comments; scan quotes left to right so backtick templates (shell snippets,
    // interpolated titles) are skipped while `code` spans inside quoted prose stay part of their string.
    const front = fm[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*import .*$/gm, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const m of front.matchAll(/'((?:\\.|[^'\\\n])*)'|"((?:\\.|[^"\\\n])*)"|`(?:\\.|[^`\\])*`/g)) {
      if (m[0].startsWith('`')) continue;
      const key = (m[1] ?? m[2]).replace(/\\'/g, "'").replace(/\\"/g, '"');
      // Prose-like constants only: two or more words, not markup, not a path, not an identifier list.
      if (!/[A-Za-z]{2,}[^\n]*\s[^\n]*[A-Za-z]{2,}/.test(key) || key.startsWith('<') || NON_UI_ASTRO.has(key)) continue;
      if (/^[\w./:-]+$/.test(key)) continue;
      if (!uiMap.has(key)) report('untranslated template string', key);
    }
  }
};
scanAstro(fileURLToPath(new URL('../src', import.meta.url)));

// ---------- Unused UI translation key check ----------
// Collect every non-data/id .ts/.js/.astro source string (excluding generated manifest.ts) so
// both direct T('...') calls and indirect string tables / .astro templates are accounted for.
const idDirNorm = fileURLToPath(new URL('../src/data/id', import.meta.url)).replaceAll('\\', '/');
const manifestPathNorm = fileURLToPath(new URL('../src/data/manifest.ts', import.meta.url)).replaceAll('\\', '/');
const sourceChunks = [];
const collectCorpus = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    const norm = p.replaceAll('\\', '/');
    if (e.isDirectory()) {
      if (norm === idDirNorm) continue;
      collectCorpus(p);
      continue;
    }
    if (!/\.(ts|js|astro)$/.test(e.name) || norm === manifestPathNorm) continue;
    sourceChunks.push(readFileSync(p, 'utf8'));
  }
};
collectCorpus(fileURLToPath(new URL('../src', import.meta.url)));
const uiCorpus = sourceChunks.join('\n');
for (const [k] of uiMap) {
  const esc1 = k.replaceAll("'", "\\'").replaceAll('\n', '\\n');
  const esc2 = k.replaceAll('"', '\\"').replaceAll('\n', '\\n');
  if (!uiCorpus.includes(k) && !uiCorpus.includes(esc1) && !uiCorpus.includes(esc2)) {
    errors.push(`unused I18N.ui key (${uiOwners.get(k)}): ${k}`);
  }
}

// ---------- Generated manifest & README summary count sync ----------
const syncRes = await checkManifestSync({ write: false });
if (!syncRes.ok) {
  errors.push(`manifest/README out of sync (${syncRes.stale.join(', ')}) — run \`bun run sync:manifest\``);
}

console.log(`${astroFiles} .astro templates scanned.`);
console.log(`${lessons} lessons, ${uiMap.size} interface strings, and manifest (${TRACK_META.length} tracks, ${LESSON_INDEX.length} lessons, ${INTERVIEW_TOTALS.problems}/${INTERVIEW_TOTALS.cases}/${INTERVIEW_TOTALS.behavioralThemes}/${INTERVIEW_TOTALS.rapidTotal}/${INTERVIEW_TOTALS.maxMocks} IV) checked.`);
if (errors.length) {
  console.log(errors.length + ' problem(s):\n' + errors.join('\n'));
  process.exit(1);
}
console.log('Indonesian content, manifest metadata, and pure i18n selectors match the English structure.');
