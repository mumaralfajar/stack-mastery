// Verifies every System Design lesson sample and metadata contract:
//   - Go 1.27 samples (10 lessons): go vet, go build, and execute binary (stdout required)
//   - YAML samples (3 lessons): parseAllDocuments via workspace `yaml` package
//   - SQL samples (2 lessons): balanced parens/quotes outside comments + PostgreSQL constructs
//   - HTTP sample (1 lesson): protocol framing checks
//   - Metadata: splits markers in code, 4-choice quiz/predict bounds, VIZ registrations in vizsys.js
// Usage: node tools/verify-sysdesign.mjs [--show]
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseAllDocuments } from 'yaml';
import track from '../src/data/tracks/sysdesign.js';
import { VIZ } from '../src/scripts/viz/vizsys.js';

const show = process.argv.includes('--show');

if (!track) {
  console.error('sysdesign track missing from src/data/tracks/sysdesign.js');
  process.exit(1);
}

const expectedViz = ['syscache', 'sysratelimit', 'sysdbscale', 'syshash', 'sysqueue', 'sysresilience'];
let failures = 0;
const fail = (id, msg) => {
  failures++;
  console.error(`FAIL [${id}]: ${msg}`);
};

for (const v of expectedViz) {
  if (!VIZ[v] || typeof VIZ[v].mount !== 'function') fail('vizsys', `missing or unmountable VIZ.${v}`);
}

// Verify PostgreSQL SQL balance outside single-line comments and string literals
function verifySqlText(id, sql) {
  let depth = 0, inStr = false, inLineComment = false;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i], nx = sql[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inStr) {
      if (ch === "'" && nx === "'") { i++; continue; }
      if (ch === "'") inStr = false;
      continue;
    }
    if (ch === '-' && nx === '-') { inLineComment = true; i++; continue; }
    if (ch === "'") { inStr = true; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) fail(id, 'unmatched closing parenthesis in SQL sample');
  }
  if (inStr) fail(id, 'unclosed single-quoted SQL literal');
  if (depth !== 0) fail(id, `unbalanced parentheses in SQL sample (delta=${depth})`);
}

const goRoot = join(tmpdir(), 'stackmastery-sysdesign-go-' + process.pid);
mkdirSync(goRoot, { recursive: true });
const exeName = process.platform === 'win32' ? 'sample.exe' : 'sample';

let goCount = 0, yamlCount = 0, sqlCount = 0, httpCount = 0;

try {
  for (const l of track.lessons) {
    // 1. Metadata & pedagogy validation
    if (!l.id || !l.title || !l.why || !Array.isArray(l.points) || l.points.length < 4) {
      fail(l.id || 'unknown', 'missing id/title/why/points');
    }
    if (!Array.isArray(l.quiz) || l.quiz.length !== 3) {
      fail(l.id, `expected 3 quiz questions, got ${l.quiz?.length}`);
    } else {
      for (const [qi, q] of l.quiz.entries()) {
        if (!q.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(q.id)) {
          fail(l.id, `quiz[${qi}] missing valid slug id`);
        }
        if (!Array.isArray(q.a) || q.a.length !== 4 || q.c < 0 || q.c > 3 || !q.why) {
          fail(l.id, `quiz[${qi}] invalid choices/index`);
        }
      }
    }
    if (l.predict) {
      const p = l.predict;
      if (!p.prompt || !Array.isArray(p.options) || p.options.length !== 4 || p.answer < 0 || p.answer > 3 || !p.explain) {
        fail(l.id, 'predict block has invalid options/answer/explain');
      }
    }
    if (l.splits) {
      for (const [label, marker] of l.splits) {
        if (!l.code.includes(marker)) fail(l.id, `split marker "${marker}" (${label}) not found in code`);
      }
    }
    if (l.viz && !VIZ[l.viz]) fail(l.id, `references unknown viz "${l.viz}"`);

    // 2. Language-specific verification
    if (l.lang === 'go') {
      goCount++;
      const dir = join(goRoot, l.id);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'go.mod'), 'module sysdesign_verify\n\ngo 1.27\n');
      writeFileSync(join(dir, 'main.go'), l.code.trim() + '\n');
      try {
        execFileSync('go', ['vet', './...'], { cwd: dir, encoding: 'utf8', stdio: 'pipe', timeout: 20000 });
        execFileSync('go', ['build', '-o', exeName, './...'], { cwd: dir, encoding: 'utf8', stdio: 'pipe', timeout: 20000 });
        const out = execFileSync(join(dir, exeName), [], { cwd: dir, encoding: 'utf8', stdio: 'pipe', timeout: 15000 });
        if (!out.trim()) fail(l.id, 'Go sample produced empty stdout');
        if (show) console.log(`=== go:${l.id} ===\n${out.trim()}\n`);
      } catch (e) {
        fail(l.id, 'Go verify failed: ' + String((e.stdout || '') + (e.stderr || '') || e.message).trim());
      }
    } else if (l.lang === 'yaml') {
      yamlCount++;
      const docs = parseAllDocuments(l.code);
      if (!docs.length) fail(l.id, 'YAML sample produced 0 documents');
      for (const [di, doc] of docs.entries()) {
        if (doc.errors.length) {
          fail(l.id, `YAML doc[${di}] parse error: ${doc.errors[0].message}`);
        }
      }
    } else if (l.lang === 'sql') {
      sqlCount++;
      verifySqlText(l.id, l.code);
      if (l.id === 'db-scaling' && !/PARTITION BY RANGE/.test(l.code)) fail(l.id, 'missing PARTITION BY RANGE in db-scaling SQL');
      if (l.id === 'messaging' && !/FOR UPDATE SKIP LOCKED/.test(l.code)) fail(l.id, 'missing FOR UPDATE SKIP LOCKED in messaging SQL');
    } else if (l.lang === 'http') {
      httpCount++;
      for (const reqToken of ['Idempotency-Key', 'text/event-stream', '101 Switching Protocols']) {
        if (!l.code.includes(reqToken)) fail(l.id, `HTTP sample missing "${reqToken}"`);
      }
    } else {
      fail(l.id, `unexpected language "${l.lang}"`);
    }
  }
} finally {
  try { rmSync(goRoot, { recursive: true, force: true }); } catch { /* ignore cleanup noise */ }
}

console.log(
  `System Design verified: ${track.lessons.length} lessons ` +
  `(${goCount} Go 1.27 vet+build+run, ${yamlCount} YAML parsed, ${sqlCount} SQL checked, ${httpCount} HTTP checked, ${expectedViz.length} VIZ mounted) — failures: ${failures}`
);
process.exit(failures ? 1 : 0);
