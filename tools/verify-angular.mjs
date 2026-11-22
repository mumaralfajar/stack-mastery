// Verifies the Angular track (Angular 22+):
//   1. every lesson sample compiles and type-checks (including strictTemplates) with ngc (@angular/compiler-cli);
//   2. the testing lesson's Vitest suite runs in jsdom against the http lesson's ProductsPage and HttpTestingController;
//   3. the RxJS sample verifies switchMap vs exhaustMap flattening behavior at runtime.
// Usage: node tools/verify-angular.mjs [--show]      (needs internet access the first time, for npm packages)
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import angularTrack from '../src/data/tracks/angular.js';

const show = process.argv.includes('--show');
const lessons = angularTrack.lessons;
const lesson = id => lessons.find(l => l.id === id);

const work = join(tmpdir(), 'stackmastery-angular');
mkdirSync(work, { recursive: true });
rmSync(join(work, 'src'), { recursive: true, force: true });
rmSync(join(work, 'out'), { recursive: true, force: true });
let failures = 0;
const fail = msg => { failures++; console.log(msg); };

writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'stackmastery-angular-verify', private: true, type: 'module' }));
if (!existsSync(join(work, 'node_modules', '@angular', 'compiler-cli')) || !existsSync(join(work, 'node_modules', 'vitest'))) {
  console.log('Installing Angular 22, RxJS, TypeScript 6 and Vitest (first run only)…');
  execSync('npm install --no-audit --no-fund @angular/core@22 @angular/common@22 @angular/forms@22 @angular/router@22 ' +
    '@angular/platform-browser@22 @angular/compiler@22 @angular/compiler-cli@22 @angular/ssr@22 @angular/aria@22 ' +
    '@angular/cdk@22 rxjs@7 typescript@6 vitest@4 jsdom@26', { cwd: work, stdio: 'pipe' });
}

// ---------- 1. Compile and strictTemplates type-check with ngc ----------
for (const l of lessons) {
  const dir = join(work, 'src', l.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.ts'), l.code.replace(/^\n+/, '') + '\n');
}
// Supporting files referenced across lessons
writeFileSync(join(work, 'src', 'routing', 'product-detail.ts'), `import { Component, input } from '@angular/core';
@Component({ selector: 'app-product-detail-lazy', template: '<p>{{ id() }}</p>' })
export class ProductDetail { readonly id = input.required<string>(); }
`);
writeFileSync(join(work, 'src', 'testing', 'products-page.ts'), lesson('http').code.replace(/^\n+/, '') + '\n');

writeFileSync(join(work, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: 'ES2022',
    module: 'ESNext',
    moduleResolution: 'bundler',
    strict: true,
    outDir: 'out',
    rootDir: 'src',
    skipLibCheck: true,
    experimentalDecorators: true,
    noFallthroughCasesInSwitch: true
  },
  angularCompilerOptions: { strictTemplates: true },
  include: ['src']
}));

try {
  execFileSync(process.execPath, [join(work, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'), '-p', join(work, 'tsconfig.json')], { cwd: work, stdio: 'pipe', encoding: 'utf8' });
  console.log(`${lessons.length} / ${lessons.length} Angular 22 samples compile and pass strictTemplates`);
} catch (e) {
  const out = String((e.stdout || '') + (e.stderr || '') || e.message).replace(/\x1b\[[0-9;]*m/g, '');
  const lines = out.split('\n').filter(l => /error (TS|NG)/.test(l));
  const bad = new Set(lines.map(l => (l.match(/([^\\/\s:]+)[\\/]index\.ts/) || [])[1]).filter(Boolean));
  fail((lines.length ? lines : out.split('\n')).map(l => '  ' + l.replace(/^.*?src[\\/]/, '')).join('\n'));
  console.log(`${lessons.length - bad.size} / ${lessons.length} Angular samples pass ngc`);
}

// ---------- 2. Run the testing lesson against ProductsPage with Vitest + jsdom ----------
writeFileSync(join(work, 'vitest.setup.mjs'), `import { beforeAll } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
beforeAll(() => {
  const tb = getTestBed();
  if (!tb.platform) tb.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
});
`);
writeFileSync(join(work, 'vitest.config.mjs'), 'export default { test: { environment: "jsdom", setupFiles: ["./vitest.setup.mjs"], include: ["out/testing/index.js"] } };\n');
try {
  const out = execFileSync(process.execPath, [join(work, 'node_modules/vitest/vitest.mjs'), 'run', '--config', join(work, 'vitest.config.mjs')], { cwd: work, stdio: 'pipe', encoding: 'utf8' });
  const summary = (out.match(/Tests\s+.*passed.*/) || ['tests pass'])[0].replace(/\x1b\[[0-9;]*m/g, '').trim();
  console.log(`Testing lesson: ${summary}`);
} catch (e) {
  fail('LESSON angular/testing: the test fails:\n  ' + String((e.stdout || '') + (e.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n').slice(-25).join('\n  '));
}

// ---------- 3. RxJS flattening check: switchMap vs exhaustMap ----------
try {
  const { createRequire } = await import('node:module');
  const requireFromWork = createRequire(join(work, 'package.json'));
  const { Subject, delay, of, toArray, firstValueFrom } = requireFromWork('rxjs');
  const { compareFlattening } = await import(pathToFileURL(join(work, 'out/rxjs/index.js')).href);
  const runCase = async (mode) => {
    const triggers$ = new Subject();
    const resP = firstValueFrom(compareFlattening(tag => of(tag).pipe(delay(40)), triggers$, mode).pipe(toArray()));
    triggers$.next('first');
    setTimeout(() => { triggers$.next('second'); triggers$.complete(); }, 10);
    return await resP;
  };
  const sw = await runCase('switch');
  const ex = await runCase('exhaust');
  if (show) console.log('--- angular/rxjs output ---', { switchMap: sw, exhaustMap: ex });
  if (JSON.stringify(sw) === JSON.stringify(['second']) && JSON.stringify(ex) === JSON.stringify(['first'])) {
    console.log('RxJS example verified: switchMap emits ["second"], exhaustMap emits ["first"]');
  } else {
    fail(`LESSON angular/rxjs unexpected output: switchMap=${JSON.stringify(sw)}, exhaustMap=${JSON.stringify(ex)}`);
  }
} catch (e) {
  fail('LESSON angular/rxjs runtime check failed:\n  ' + String(e && e.stack || e));
}

process.exit(failures ? 1 : 0);
