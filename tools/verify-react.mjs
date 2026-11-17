// Verifies the TypeScript + React track:
//   1. every lesson sample type-checks with TypeScript and React 19, using the same strict settings
//      as the Vite react-ts template (each lesson in its own folder, as its own module);
//   2. the testing lesson's test runs with Vitest + jsdom + MSW against the server lesson's ProductsPage;
//   3. the event-loop example prints its lines in the order its comments promise.
// Usage: node tools/verify-react.mjs [--show]      (needs internet access the first time, for npm packages)
import { execFileSync, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const show = process.argv.includes('--show');
globalThis.window = globalThis;
globalThis.TRACKS = [];
(0, eval)(readFileSync(join(root, 'data/react.js'), 'utf8'));
const lessons = TRACKS.find(t => t.id === 'react').lessons;
const lesson = id => lessons.find(l => l.id === id);

const work = join(tmpdir(), 'stackmastery-react');
mkdirSync(work, { recursive: true });
rmSync(join(work, 'src'), { recursive: true, force: true });
let failures = 0;
const fail = msg => { failures++; console.log(msg); };
const bin = (pkg, file) => join(work, 'node_modules', pkg, file);

writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'stackmastery-react-verify', private: true, type: 'module' }));
if (!existsSync(join(work, 'node_modules', 'vitest'))) {
  console.log('Installing TypeScript, React 19 and test libraries (first run only)…');
  execSync('npm install --no-audit --no-fund typescript@5 react@19 react-dom@19 @types/react@19 @types/react-dom@19 ' +
    '@tanstack/react-query@5 @testing-library/react@16 @testing-library/dom@10 @testing-library/user-event@14 ' +
    '@testing-library/jest-dom@6 msw@2 vitest@3 jsdom@26', { cwd: work, stdio: 'pipe' });
}

// ---------- 1. Type-check: each lesson in its own folder ----------
for (const l of lessons) {
  const dir = join(work, 'src', l.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.' + (l.lang === 'ts' ? 'ts' : 'tsx')), l.code);
}
// Files the samples import but deliberately leave out
writeFileSync(join(work, 'src', 'internals', 'Chart.tsx'), 'export default function Chart({ data }: { data: string[] }) { return <p>{data.length} points</p>; }\n');
writeFileSync(join(work, 'src', 'arch', 'ProductsPage.tsx'), lesson('server').code);
// Strict options from the Vite react-ts template (tsconfig.app.json)
writeFileSync(join(work, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
  target: 'ES2022', lib: ['ES2023', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'bundler',
  moduleDetection: 'force', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, isolatedModules: true,
  verbatimModuleSyntax: true, erasableSyntaxOnly: true, noFallthroughCasesInSwitch: true, noUncheckedSideEffectImports: true
}, include: ['src'] }));
try {
  execFileSync(process.execPath, [bin('typescript', 'bin/tsc'), '-p', work], { stdio: 'pipe', encoding: 'utf8' });
  console.log(`${lessons.length} / ${lessons.length} TypeScript + React samples type-check (React 19, strict)`);
} catch (e) {
  const lines = String(e.stdout || e.message).split('\n').filter(l => /error TS/.test(l));
  const bad = new Set(lines.map(l => (l.match(/src[\\/]([^\\/]+)[\\/]/) || [])[1]).filter(Boolean));
  fail(lines.map(l => '  ' + l.replace(/^.*?src[\\/]/, '')).join('\n'));
  console.log(`${lessons.length - bad.size} / ${lessons.length} TypeScript + React samples type-check`);
}

// ---------- 2. The testing lesson's test, for real ----------
writeFileSync(join(work, 'vitest.config.mjs'), 'export default { test: { environment: "jsdom", include: ["src/arch/index.tsx"] } };\n');
try {
  const out = execFileSync(process.execPath, [bin('vitest', 'vitest.mjs'), 'run', '--config', 'vitest.config.mjs'], { cwd: work, stdio: 'pipe', encoding: 'utf8' });
  const summary = (out.match(/Tests\s+.*passed.*/) || ['tests pass'])[0].replace(/\x1b\[[0-9;]*m/g, '').trim();
  console.log(`Testing lesson: ${summary}`);
} catch (e) {
  fail('LESSON react/arch: the test fails:\n  ' + String((e.stdout || '') + (e.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n').slice(-25).join('\n  '));
}

// ---------- 3. Event loop: run the sample and check the order ----------
const ts = await import(new URL('file:///' + bin('typescript', 'lib/typescript.js').replace(/\\/g, '/')).href);
const js = ts.default.transpileModule(lesson('jsdeep').code, { compilerOptions: { target: ts.default.ScriptTarget.ES2022, module: ts.default.ModuleKind.ESNext } }).outputText;
writeFileSync(join(work, 'eventloop.mjs'), js);
const printed = execFileSync(process.execPath, [join(work, 'eventloop.mjs')], { encoding: 'utf8' }).trim().split('\n');
const order = printed.filter(l => /^\d (sync|microtask|timeout)$/.test(l));
const expected = ['1 sync', '2 sync', '3 microtask', '4 timeout'];
if (show) console.log('--- react/jsdeep output ---\n' + printed.join('\n'));
if (JSON.stringify(order) === JSON.stringify(expected) && printed.includes('counter: 2') && printed.includes('Hi Ana'))
  console.log('Event-loop example prints 1 sync, 2 sync, 3 microtask, 4 timeout, as its comments say');
else fail('LESSON react/jsdeep prints:\n  ' + printed.join('\n  '));

process.exit(failures ? 1 : 0);
