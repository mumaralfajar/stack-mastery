// Verifies the Dart + Flutter track with the real Flutter SDK:
//   1. every lesson's code sample is written to a scratch Flutter project and analyzed (errors and warnings fail),
//   2. samples that are plain Dart programs (no Flutter import, has main) are also run,
//   3. samples that are tests are run with `flutter test`.
// Usage: node tools/verify-dart.mjs        (requires the Flutter SDK on PATH)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
globalThis.window = globalThis;
require(join(root, 'src/scripts/util.js'));
require(join(root, 'data/flutter.js'));
const track = TRACKS.find(t => t.id === 'flutter');

const proj = join(tmpdir(), 'stackmastery_dart');
const sh = (cmd, cwd = proj) => execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
if (!existsSync(join(proj, 'pubspec.yaml'))) {
  console.log('Creating scratch Flutter project (first run only)…');
  sh(`flutter create --project-name sm_verify --platforms web "${proj}"`, tmpdir());
  sh('flutter pub add flutter_bloc http go_router shared_preferences');
}
// Report real problems only; style lints are not what this script is for.
writeFileSync(join(proj, 'analysis_options.yaml'), 'analyzer:\n  errors:\n    avoid_print: ignore\n');

for (const dir of ['lib', 'test']) { rmSync(join(proj, dir), { recursive: true, force: true }); mkdirSync(join(proj, dir), { recursive: true }); }
const files = track.lessons.filter(l => l.code).map(l => {
  const code = l.code.replace(/^\n+/, '');
  const isTest = /package:flutter_test\//.test(code);
  const file = join(isTest ? 'test' : 'lib', l.id + (isTest ? '_test.dart' : '.dart'));
  writeFileSync(join(proj, file), code + '\n');
  return { id: l.id, file, isTest, runnable: !isTest && !/package:flutter\//.test(code) && /\bmain\(\)/.test(code) };
});

let failed = 0;
try { sh('flutter analyze --no-fatal-infos'); console.log(`${files.length} / ${files.length} Dart samples analyze cleanly`); }
catch (e) { failed++; console.log('ANALYZE FAILED\n' + (e.stdout || '') + (e.stderr || '')); }

for (const f of files.filter(x => x.runnable)) {
  try { const out = sh(`dart run ${f.file.replace(/\\/g, '/')}`); console.log(`— ${f.id} ran:\n${out.trim().split('\n').map(l => '    ' + l).join('\n')}`); }
  catch (e) { failed++; console.log(`RUN FAILED ${f.id}\n` + (e.stdout || '') + (e.stderr || '')); }
}
for (const f of files.filter(x => x.isTest)) {
  try { const out = sh(`flutter test ${f.file.replace(/\\/g, '/')}`); console.log(`— ${f.id} tests: ${out.trim().split('\n').pop()}`); }
  catch (e) { failed++; console.log(`TEST FAILED ${f.id}\n` + (e.stdout || '') + (e.stderr || '')); }
}
process.exit(failed ? 1 : 0);
