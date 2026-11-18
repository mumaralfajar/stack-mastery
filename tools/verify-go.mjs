// Verifies the Go 1.27 track with the real Go toolchain:
//   1. every lesson sample is vetted (`go vet ./...`) and built (`go build ./...` / `go test -c`);
//   2. runnable `main()` samples execute cleanly within timeout;
//   3. `http` lesson routes (`GET /products/{id}`, 405 method check, strict json/v2) are tested via httptest;
//   4. `testing` (unit + httptest.NewTestServer + testing/synctest + b.Loop) and `profiling` benchmarks run cleanly.
// Usage: node tools/verify-go.mjs [--show]
import { execFileSync, execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const show = process.argv.includes('--show');

globalThis.window = globalThis;
globalThis.TRACKS = [];
(0, eval)(readFileSync(join(root, 'data/go.js'), 'utf8'));
const track = TRACKS.find(t => t.id === 'go');
if (!track) throw new Error('Track "go" not found in data/go.js');

const work = join(tmpdir(), 'stackmastery-go');
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

const run = (cmd, args, cwd, timeout = 25000) => {
  try {
    const out = execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || '') || String(e.message || e) };
  }
};

let hasRace = false;
try {
  execSync('gcc --version', { stdio: 'ignore' });
  hasRace = true;
} catch { hasRace = false; }

let failures = 0, built = 0, executed = 0;

for (const l of track.lessons) {
  const pkgDir = join(work, l.id);
  mkdirSync(pkgDir, { recursive: true });
  writeFileSync(join(pkgDir, 'go.mod'), `module sm_${l.id}\n\ngo 1.27.4\n`);

  const code = l.code.replace(/^\n+|\s+$/g, '') + '\n';
  const isSplitTest = l.id === 'testing' || l.id === 'profiling';

  if (l.id === 'testing') {
    const marker = '// ---------- shop_test.go ----------';
    const idx = code.indexOf(marker);
    if (idx < 0) throw new Error('testing lesson missing shop_test.go split marker');
    writeFileSync(join(pkgDir, 'shop.go'), code.slice(0, idx).trim() + '\n');
    writeFileSync(join(pkgDir, 'shop_test.go'), code.slice(idx + marker.length).trim() + '\n');
  } else if (l.id === 'profiling') {
    const marker = '// ---------- format_bench_test.go ----------';
    const idx = code.indexOf(marker);
    if (idx < 0) throw new Error('profiling lesson missing format_bench_test.go split marker');
    writeFileSync(join(pkgDir, 'format.go'), code.slice(0, idx).trim() + '\n');
    writeFileSync(join(pkgDir, 'format_bench_test.go'), code.slice(idx + marker.length).trim() + '\n');
  } else {
    writeFileSync(join(pkgDir, 'main.go'), code);
  }

  const vet = run('go', ['vet', './...'], pkgDir);
  if (!vet.ok) {
    failures++;
    console.log(`\nLESSON go/${l.id} failed go vet:\n${vet.out.trim()}`);
    continue;
  }

  const bld = isSplitTest
    ? run('go', ['test', '-c', '-o', join(pkgDir, 'pkg.test' + (process.platform === 'win32' ? '.exe' : '')), '.'], pkgDir)
    : run('go', ['build', './...'], pkgDir);
  if (!bld.ok) {
    failures++;
    console.log(`\nLESSON go/${l.id} failed go build:\n${bld.out.trim()}`);
    continue;
  }
  built++;

  if (l.id === 'http') {
    writeFileSync(join(pkgDir, 'verify_http_test.go'), `package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestVerifyHTTPContract(t *testing.T) {
	api := &ShopAPI{products: []Product{{ID: 1, Name: "Keyboard", Price: 800000}}}
	h := newHandler(api)

	req := httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/products/1", nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("GET /products/1 = %d; want 200", rec.Code)
	}

	reqDel := httptest.NewRequestWithContext(t.Context(), http.MethodDelete, "/products/1", nil)
	recDel := httptest.NewRecorder()
	h.ServeHTTP(recDel, reqDel)
	if recDel.Code != http.StatusMethodNotAllowed {
		t.Fatalf("DELETE /products/1 = %d; want 405", recDel.Code)
	}

	reqBad := httptest.NewRequestWithContext(t.Context(), http.MethodPost, "/products", bytes.NewBufferString(\`{"name":"Lamp","price":200,"extra":true}\`))
	recBad := httptest.NewRecorder()
	h.ServeHTTP(recBad, reqBad)
	if recBad.Code != http.StatusBadRequest {
		t.Fatalf("strict json/v2 unknown field = %d; want 400", recBad.Code)
	}

	reqOk := httptest.NewRequestWithContext(t.Context(), http.MethodPost, "/products", bytes.NewBufferString(\`{"name":"Lamp","price":200}\`))
	recOk := httptest.NewRecorder()
	h.ServeHTTP(recOk, reqOk)
	if recOk.Code != http.StatusCreated {
		t.Fatalf("POST /products = %d; want 201", recOk.Code)
	}
}
`);
    const tr = run('go', ['test', '-v', '.'], pkgDir);
    if (!tr.ok) { failures++; console.log(`\nLESSON go/http contract test failed:\n${tr.out.trim()}`); }
    else { executed++; if (show) console.log(`— go/http httptest checks passed`); }
  } else if (isSplitTest) {
    const args = ['test', ...(hasRace ? ['-race'] : []), '-v', '-bench=.', '-benchmem', '-benchtime=20ms', './...'];
    const tr = run('go', args, pkgDir);
    if (!tr.ok) {
      failures++;
      console.log(`\nLESSON go/${l.id} test/bench failed:\n${tr.out.trim()}`);
    } else {
      executed++;
      if (l.id === 'profiling') {
        const naive = tr.out.match(/BenchmarkBuildCSVNaive[^\n]*?\s(\d+)\s+allocs\/op/);
        const fast = tr.out.match(/BenchmarkBuildCSVFast[^\n]*?\s(\d+)\s+allocs\/op/);
        if (naive && fast && Number(fast[1]) >= Number(naive[1])) {
          failures++;
          console.log(`\nLESSON go/profiling: expected BuildCSVFast (${fast[1]} allocs) < BuildCSVNaive (${naive[1]} allocs)`);
        }
      }
      if (show) console.log(`— go/${l.id} tests/benchmarks:\n${tr.out.trim().split('\n').map(x => '    ' + x).join('\n')}`);
    }
  } else {
    const rn = run('go', ['run', '.'], pkgDir);
    if (!rn.ok) {
      failures++;
      console.log(`\nLESSON go/${l.id} runtime failed:\n${rn.out.trim()}`);
    } else {
      executed++;
      if (show) console.log(`— go/${l.id} ran:\n${rn.out.trim().split('\n').map(x => '    ' + x).join('\n')}`);
    }
  }
}

console.log(`${built} / ${track.lessons.length} Go 1.27 lesson samples vet + build cleanly`);
console.log(`${executed} / ${track.lessons.length} Go runtime & test suites executed cleanly` + (hasRace ? ' (with -race)' : ' (-race skipped: gcc not installed)'));
process.exit(failures ? 1 : 0);
