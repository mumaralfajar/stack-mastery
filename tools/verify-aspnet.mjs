// Verifies the ASP.NET Core track with the real .NET SDK:
//   1. every lesson sample builds as the Program.cs of a .NET 10 web project (warnings are fine, errors fail);
//   2. every app then starts, and must reach "Application started" without crashing;
//   3. the testing lesson's tests run with `dotnet test` against the validation lesson's API.
// No database is needed: the samples only connect when an endpoint is called.
// Usage: node tools/verify-aspnet.mjs [--show]      (requires the .NET 10 SDK and internet access for NuGet)
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const show = process.argv.includes('--show');
globalThis.window = globalThis;
globalThis.TRACKS = [];
(0, eval)(readFileSync(join(root, 'data/aspnet.js'), 'utf8'));
const lessons = TRACKS.find(t => t.id === 'aspnet').lessons;

// Microsoft packages pinned to the .NET 10 line the lessons target.
const PACKAGES = {
  'Microsoft.EntityFrameworkCore.SqlServer': '10.*',
  'Microsoft.AspNetCore.Authentication.JwtBearer': '10.*',
  'Microsoft.AspNetCore.OpenApi': '10.*',
  'Microsoft.Extensions.Caching.Hybrid': '10.*',
  'Microsoft.Extensions.Http.Resilience': '10.*',
  'Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore': '10.*',
  'OpenTelemetry.Extensions.Hosting': '1.*',
  'OpenTelemetry.Instrumentation.AspNetCore': '1.*',
  'OpenTelemetry.Instrumentation.Http': '1.*',
  'OpenTelemetry.Instrumentation.Runtime': '1.*',
  'OpenTelemetry.Exporter.OpenTelemetryProtocol': '1.*'
};
// Settings an app needs in order to start (the options lesson refuses to start without Smtp:Host).
const ENV = { config: { Smtp__Host: 'smtp.example.com' } };

const work = join(tmpdir(), 'stackmastery-aspnet');
const appDir = join(work, 'Shop.Api'), testDir = join(work, 'Shop.Tests');
rmSync(work, { recursive: true, force: true });
mkdirSync(appDir, { recursive: true });
mkdirSync(testDir, { recursive: true });

writeFileSync(join(appDir, 'Shop.Api.csproj'), `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><ImplicitUsings>enable</ImplicitUsings></PropertyGroup>
  <ItemGroup>
${Object.entries(PACKAGES).map(([p, v]) => `    <PackageReference Include="${p}" Version="${v}" />`).join('\n')}
  </ItemGroup>
</Project>`);

const sh = (cmd, cwd, env) => {
  try { return { ok: true, text: execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, ...env } }) }; }
  catch (e) { return { ok: false, text: (e.stdout || '') + (e.stderr || '') }; }
};
const errorsOf = text => [...new Set(text.split('\n').filter(l => /error [A-Z]+\d+/.test(l)).map(l => l.replace(/\s*\[.*?\]\s*$/, '').replace(/^.*?Program\.cs/, 'Program.cs').trim()))];

// Start the built app and wait for "Application started", a crash, or a timeout.
const start = (env) => new Promise(resolve => {
  const child = spawn('dotnet', ['bin/Debug/net10.0/Shop.Api.dll', '--urls', 'http://127.0.0.1:0'], {
    cwd: appDir, env: { ...process.env, ASPNETCORE_ENVIRONMENT: 'Development', ...env }
  });
  let out = '', done = false;
  const finish = (ok, why) => { if (done) return; done = true; clearTimeout(timer); child.kill(); resolve({ ok, why, out }); };
  const onData = d => {
    out += d;
    if (/Application started/.test(out)) finish(true);
    else if (/Unhandled exception|crit:|Application startup exception/.test(out)) finish(false, 'crashed at startup');
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('exit', code => finish(false, `exited with code ${code} before starting`));
  const timer = setTimeout(() => finish(false, 'did not start within 60 s'), 60000);
});

console.log('Restoring packages (first run downloads them)…');
writeFileSync(join(appDir, 'Program.cs'), 'var app = WebApplication.CreateBuilder(args).Build(); app.Run();');
const restore = sh('dotnet restore', appDir);
if (!restore.ok) { console.log(restore.text); process.exit(1); }

let ok = 0, failures = 0, n = 0;
for (const l of lessons) {
  if (l.id === 'testing') continue;          // a test file, checked below
  n++;
  writeFileSync(join(appDir, 'Program.cs'), l.code);
  const b = sh('dotnet build --no-restore -nologo -clp:ErrorsOnly', appDir);
  if (!b.ok) { failures++; console.log(`\nLESSON aspnet/${l.id} does not build:\n  ` + (errorsOf(b.text).slice(0, 8).join('\n  ') || b.text.slice(-1500))); continue; }
  const s = await start(ENV[l.id] || {});
  if (show) console.log(`--- aspnet/${l.id} ---\n${s.out.trim().split('\n').slice(0, 12).join('\n')}\n`);
  if (s.ok) ok++;
  else { failures++; console.log(`\nLESSON aspnet/${l.id} builds but ${s.why}:\n  ` + s.out.trim().split('\n').slice(0, 8).join('\n  ')); }
}
console.log(`${ok} / ${n} ASP.NET Core lesson apps build and start`);

// ---------- testing lesson: run its tests against the validation lesson's API ----------
const testing = lessons.find(l => l.id === 'testing'), api = lessons.find(l => l.id === 'validation');
if (testing && api) {
  writeFileSync(join(appDir, 'Program.cs'), api.code);
  writeFileSync(join(testDir, 'Shop.Tests.csproj'), `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net10.0</TargetFramework><Nullable>enable</Nullable><ImplicitUsings>enable</ImplicitUsings><IsPackable>false</IsPackable></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="10.*" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*" />
    <PackageReference Include="xunit" Version="2.*" />
    <PackageReference Include="xunit.runner.visualstudio" Version="3.*" />
  </ItemGroup>
  <ItemGroup><ProjectReference Include="../Shop.Api/Shop.Api.csproj" /></ItemGroup>
</Project>`);
  writeFileSync(join(testDir, 'Tests.cs'), testing.code);
  const t = sh('dotnet test -nologo', testDir);
  const summary = (t.text.match(/(Passed!|Failed!).*$/m) || t.text.match(/Test summary:.*$/m) || [''])[0].trim();
  if (show || !t.ok) console.log(`--- aspnet/testing ---\n${t.ok ? summary : (errorsOf(t.text).join('\n') || t.text.slice(-2000))}`);
  if (t.ok) console.log(`Testing lesson: ${summary || 'tests pass'}`);
  else { failures++; console.log('LESSON aspnet/testing: tests fail or do not build'); }
}
process.exit(failures ? 1 : 0);
