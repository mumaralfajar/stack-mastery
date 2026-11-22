// Verifies the Dart + Flutter track with the real Flutter SDK:
//   1. every lesson's code sample is written to a scratch Flutter project and analyzed with Flutter's
//      recommended lints (flutter_lints); any error, warning or lint fails;
//   2. samples that are plain Dart programs (no Flutter import, has main) are also run;
//   3. samples that are tests are run with `flutter test`;
//   4. extra tests check behaviour the analyzer can't see: the navigation lesson keeps Home under a
//      product page (so there is a back button), the Bloc lesson's cubit survives being closed mid-request,
//      and the networking lesson turns ProblemDetails into a safe message and field errors.
// Usage: node tools/verify-dart.mjs        (requires the Flutter SDK on PATH)
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import track from '../src/data/tracks/flutter.js';

const proj = join(tmpdir(), 'stackmastery_dart');
const sh = (cmd, cwd = proj) => execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
if (!existsSync(join(proj, 'pubspec.yaml'))) {
  console.log('Creating scratch Flutter project (first run only)…');
  sh(`flutter create --project-name sm_verify --platforms web "${proj}"`, tmpdir());
  sh('flutter pub add flutter_bloc http go_router shared_preferences');
}
// Flutter's recommended lints, as in a new project. print() is how the plain-Dart samples show output.
writeFileSync(join(proj, 'analysis_options.yaml'),
  'include: package:flutter_lints/flutter.yaml\n\nanalyzer:\n  errors:\n    avoid_print: ignore\n');

for (const dir of ['lib', 'test']) { rmSync(join(proj, dir), { recursive: true, force: true }); mkdirSync(join(proj, dir), { recursive: true }); }
const files = track.lessons.filter(l => l.code).map(l => {
  const code = l.code.replace(/^\n+/, '');
  const isTest = /package:flutter_test\//.test(code);
  const file = join(isTest ? 'test' : 'lib', l.id + (isTest ? '_test.dart' : '.dart'));
  writeFileSync(join(proj, file), code + '\n');
  return { id: l.id, file, isTest, runnable: !isTest && !/package:flutter\//.test(code) && /\bmain\(\)/.test(code) };
});

// Behaviour checks that go beyond compiling
writeFileSync(join(proj, 'test', 'lesson_behaviour_test.dart'), `import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:sm_verify/bloc.dart' as bloc;
import 'package:sm_verify/navforms.dart' as nav;
import 'package:sm_verify/network.dart' as net;

class _SlowRepo implements bloc.ProductRepository {
  _SlowRepo(this.result);
  final Future<List<String>> result;
  @override
  Future<List<String>> fetch() => result;
}

void main() {
  testWidgets('navforms: go to a product keeps Home underneath, so Back works', (tester) async {
    await tester.pumpWidget(MaterialApp.router(routerConfig: nav.router));
    await tester.tap(find.text('Open product 42'));
    await tester.pumpAndSettle();
    expect(find.text('Product 42'), findsOneWidget);
    expect(find.byType(BackButton), findsOneWidget);
    await tester.tap(find.byType(BackButton));
    await tester.pumpAndSettle();
    expect(find.text('Open product 42'), findsOneWidget);
  });

  test('bloc: closing the cubit while a request is running does not throw', () async {
    final response = Completer<List<String>>();
    final cubit = bloc.ProductsCubit(_SlowRepo(response.future));
    final loading = cubit.load();
    await cubit.close();                 // the user left the screen
    response.complete(['Laptop']);       // the request finishes afterwards
    await loading;                       // would throw StateError without the isClosed check
  });

  test('network: ProblemDetails becomes a safe message plus field errors', () {
    final problem = net.ApiException.fromResponse(http.Response(
        '{"title":"One or more validation errors occurred.","status":400,"errors":{"Price":["Must be positive"]}}', 400));
    expect(problem.message, 'One or more validation errors occurred.');
    expect(problem.fieldErrors, {'Price': ['Must be positive']});

    final html = net.ApiException.fromResponse(http.Response('<html>Bad gateway</html>', 502));
    expect(html.message, isNot(contains('<html>')));     // never the raw body
    expect(html.fieldErrors, isEmpty);
  });
}
`);

let failed = 0;
try { sh('flutter analyze'); console.log(`${files.length} / ${files.length} Dart samples analyze cleanly with flutter_lints`); }
catch (e) { failed++; console.log('ANALYZE FAILED\n' + (e.stdout || '') + (e.stderr || '')); }

for (const f of files.filter(x => x.runnable)) {
  try { const out = sh(`dart run ${f.file.replace(/\\/g, '/')}`); console.log(`— ${f.id} ran:\n${out.trim().split('\n').map(l => '    ' + l).join('\n')}`); }
  catch (e) { failed++; console.log(`RUN FAILED ${f.id}\n` + (e.stdout || '') + (e.stderr || '')); }
}
for (const f of [...files.filter(x => x.isTest), { id: 'behaviour checks', file: 'test/lesson_behaviour_test.dart' }]) {
  try { const out = sh(`flutter test ${f.file.replace(/\\/g, '/')}`); console.log(`— ${f.id}: ${out.trim().split('\n').pop()}`); }
  catch (e) { failed++; console.log(`TEST FAILED ${f.id}\n` + (e.stdout || '') + (e.stderr || '')); }
}
process.exit(failed ? 1 : 0);
