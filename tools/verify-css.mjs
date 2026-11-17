// Verifies the CSS + Tailwind track:
//   1. every declaration and selector in the CSS samples is valid CSS, according to real Chrome;
//   2. the HTML samples render at 360px wide without horizontal scrolling (the Tailwind one with its CSS compiled);
//   3. every Tailwind class in the samples exists in Tailwind (compiled with the pinned version below);
//   4. the React + Tailwind sample type-checks with TypeScript, and an invalid variant fails to compile.
// Usage: node tools/verify-css.mjs [--show]
//   Requires Google Chrome (or Edge) and internet access the first time, for npm packages.
import { execSync, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TAILWIND = '4.3.4';          // keep in step with the playground (src/scripts/playground.js)
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const show = process.argv.includes('--show');
globalThis.window = globalThis;
globalThis.TRACKS = [];
(0, eval)(readFileSync(join(root, 'data/css.js'), 'utf8'));
const lessons = TRACKS.find(t => t.id === 'css').lessons;
const langOf = l => l.lang || 'css';

const work = join(tmpdir(), 'stackmastery-css');
rmSync(join(work, 'out'), { recursive: true, force: true });
mkdirSync(join(work, 'src'), { recursive: true });
mkdirSync(join(work, 'out'), { recursive: true });
let failures = 0;
const fail = msg => { failures++; console.log(msg); };

// ---------- npm packages (installed once into the scratch folder) ----------
writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'stackmastery-css-verify', private: true, type: 'module' }));
if (!existsSync(join(work, 'node_modules', '@tailwindcss', 'cli'))) {
  console.log('Installing Tailwind, TypeScript and React types (first run only)…');
  execSync(`npm install --no-audit --no-fund tailwindcss@${TAILWIND} @tailwindcss/cli@${TAILWIND} typescript@5 react@19 @types/react@19 clsx@2 tailwind-merge@3`, { cwd: work, stdio: 'pipe' });
}

// ---------- 3. Tailwind classes ----------
const twLessons = lessons.filter(l => l.id === 'tailwind' || l.id === 'twreact');
for (const l of twLessons) writeFileSync(join(work, 'src', l.id + (langOf(l) === 'tsx' ? '.tsx' : '.html')), l.code);
// The @theme tokens and dark variant the React lesson tells you to add to app.css
writeFileSync(join(work, 'input.css'), `@import "tailwindcss";
@source "./src";
@theme {
  --color-brand-500: oklch(55% 0.2 270);
  --color-brand-600: oklch(48% 0.2 270);
}
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
`);
execFileSync(process.execPath, [join(work, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs'), '-i', 'input.css', '-o', 'out/tailwind.css'], { cwd: work, stdio: 'pipe' });
const twCss = readFileSync(join(work, 'out', 'tailwind.css'), 'utf8');
const escapeClass = c => c.replace(/([:./\[\]#%(),=&!'"])/g, '\\$1');
const looksLikeUtility = c => /^[a-z!-][a-z0-9:./\[\]#%()_=&-]*$/.test(c) && /[-:]/.test(c) || ['flex', 'grid', 'transition', 'border', 'rounded', 'hidden', 'block'].includes(c);
for (const l of twLessons) {
  const strings = langOf(l) === 'tsx'
    ? [...l.code.matchAll(/"([^"\n]*)"/g)].map(m => m[1]).filter(s => / /.test(s) || /^[a-z-]+:/.test(s))
    : [...l.code.matchAll(/class="([^"]*)"/g)].map(m => m[1]);
  const classes = [...new Set(strings.flatMap(s => s.split(/\s+/)).filter(Boolean).filter(looksLikeUtility))];
  const missing = classes.filter(c => !twCss.includes('.' + escapeClass(c)));
  if (show) console.log(`--- css/${l.id}: ${classes.length} Tailwind classes checked`);
  if (missing.length) fail(`\nLESSON css/${l.id} uses classes Tailwind ${TAILWIND} doesn't generate:\n  ${missing.join('  ')}`);
}

// ---------- 4. TypeScript ----------
const tsx = lessons.find(l => langOf(l) === 'tsx');
if (tsx) {
  const dir = join(work, 'ts');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'lesson.tsx'), tsx.code);
  writeFileSync(join(dir, 'usage.tsx'), `import { Button } from "./lesson";
export const ok = <Button intent="danger" size="lg" className="w-full">Delete</Button>;
export const submit = <Button type="submit">Save</Button>;
// @ts-expect-error: "purple" is not a valid intent, so this line must fail to compile
export const bad = <Button intent="purple" />;
`);
  writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
    target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true,
    noEmit: true, skipLibCheck: true }, include: ['*.tsx'] }));   // packages resolve from the scratch folder's node_modules
  try {
    execFileSync(process.execPath, [join(work, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', dir], { stdio: 'pipe', encoding: 'utf8' });
    if (show) console.log(`--- css/${tsx.id}: type-checks, and the invalid intent is rejected`);
  } catch (e) { fail(`\nLESSON css/${tsx.id} does not type-check:\n  ` + String(e.stdout || e.message).trim().split('\n').slice(0, 8).join('\n  ')); }
}

// ---------- 1 + 2. Chrome: CSS validity and 360px rendering ----------
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) { console.log('Chrome or Edge not found: skipping the browser checks.'); process.exit(failures ? 1 : 0); }

const samples = lessons.map(l => ({ id: l.id, lang: langOf(l), code: l.code,
  css: l.id === 'tailwind' ? twCss : '' }));
const page = `<!doctype html><meta charset="utf-8"><body><pre id="out">pending</pre><script>
const samples = ${JSON.stringify(samples).replace(/</g, '\\u003c')};
const results = [];
const strip = s => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
function checkCss(id, text) {
  const errors = [];
  const css = strip(text);
  // Declarations: property: value; (custom properties hold anything, so skip them)
  for (const m of css.matchAll(/(?:^|[{;\\s])([a-z-]+)\\s*:\\s*([^;{}]+);/g)) {
    const [, prop, value] = m;
    if (prop.startsWith('--') || /^(and|or|not|only)$/.test(prop)) continue;
    if (!CSS.supports(prop, value.replace(/\\s*!important\\s*$/, ''))) errors.push('invalid declaration: ' + prop + ': ' + value.trim());
  }
  // Selectors: the text before each { that isn't an at-rule
  for (const m of css.matchAll(/(^|[{};])\\s*([^{};@][^{};]*?)\\s*\\{/g)) {
    const sel = m[2].trim();
    if (!sel || sel.startsWith('@') || /^(from|to|\\d+%)$/.test(sel)) continue;
    // selector() takes a single selector, so test each part of a list on its own
    for (const part of sel.split(/,(?![^(]*\\))/).map(p => p.trim())) {
      const test = part.startsWith('&') ? '.x' + part.slice(1) : part;
      if (!CSS.supports('selector(' + test + ')')) errors.push('invalid selector: ' + part);
    }
  }
  // The whole sheet must parse into rules
  const style = document.createElement('style'); style.textContent = text; document.head.append(style);
  if (!style.sheet || !style.sheet.cssRules.length) errors.push('stylesheet parsed to no rules');
  style.remove();
  return errors;
}
async function render(id, html, css) {
  const f = document.createElement('iframe');
  f.style.cssText = 'width:360px;height:800px;border:0';
  f.srcdoc = html.includes('<html') ? html.replace('</head>', '<style>' + css + '</style></head>')
                                    : '<!doctype html><meta name="viewport" content="width=device-width"><style>body{margin:0}' + css + '</style>' + html;
  await new Promise(r => { f.onload = r; document.body.append(f); });
  const d = f.contentDocument.documentElement;
  const over = d.scrollWidth - d.clientWidth;
  f.remove();
  return over > 0 ? ['scrolls sideways at 360px by ' + over + 'px'] : [];
}
(async () => {
  for (const s of samples) {
    let errors = [];
    if (s.lang === 'css') errors = checkCss(s.id, s.code);
    if (s.lang === 'html') errors = errors.concat(await render(s.id, s.code, s.css));
    results.push({ id: s.id, lang: s.lang, errors });
  }
  document.getElementById('out').textContent = 'RESULTS' + JSON.stringify(results);
})();
<\/script>`;
writeFileSync(join(work, 'out', 'check.html'), page);
const dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--virtual-time-budget=15000',
  '--dump-dom', pathToFileURL(join(work, 'out', 'check.html')).href], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120000 });
const json = (dom.match(/RESULTS(\[.*?\])<\/pre>/s) || [])[1];
if (!json) fail('Chrome did not report results:\n' + dom.slice(0, 500));
else {
  const results = JSON.parse(json.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"'));
  for (const r of results) {
    if (r.lang === 'tsx') continue;
    if (show) console.log(`--- css/${r.id} (${r.lang}): ${r.errors.length ? r.errors.length + ' problem(s)' : 'ok'}`);
    if (r.errors.length) fail(`\nLESSON css/${r.id}:\n  ` + r.errors.join('\n  '));
  }
  const checked = results.filter(r => r.lang !== 'tsx').length;
  console.log(`${checked - results.filter(r => r.lang !== 'tsx' && r.errors.length).length} / ${checked} CSS and HTML samples are valid in Chrome and fit 360px`);
}
console.log(failures ? `${failures} problem(s) found` : `Tailwind ${TAILWIND} classes and the React sample check out too`);
process.exit(failures ? 1 : 0);
