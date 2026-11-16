// Verifies the C# in this project with the real .NET SDK:
//   1. every C# interview solution runs against the same test cases as the TypeScript judge,
//   2. every C# pattern template compiles,
//   3. every C# track lesson snippet compiles as a Program.cs.
// Usage: node tools/verify.mjs        (requires the .NET SDK on PATH)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
globalThis.window = globalThis;
for (const f of ['src/scripts/util.js', 'data/csharp.js', 'data/fundamentals.js', 'data/interview.js', 'data/interview-cs.js']) {
  try { require(join(root, f)); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
}

const out = join(tmpdir(), 'stackmastery-verify');
rmSync(out, { recursive: true, force: true });
const csproj = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable>
    <NoWarn>CS0162;CS0168;CS0219;CS8321;CS1998;CS8602;CS8604</NoWarn>
  </PropertyGroup>
</Project>`;
const run = (cmd, cwd) => { try { return { ok: true, text: execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' }) }; } catch (e) { return { ok: false, text: (e.stdout || '') + (e.stderr || '') }; } };
const errorsOf = text => [...new Set(text.split('\n').filter(l => /error/i.test(l)).map(l => l.replace(/\[.*?\]\s*$/, '').replace(/^.*?Program\.cs/, 'Program.cs').trim()))];
let failures = 0;

// ---------- 1 + 2: solutions and pattern templates ----------
const wrap = {
  hashing: ['static int[] Hashing(int[] nums, int target) {', 'return []; }'],
  'two-pointers': ['static int[] TwoPointers(int[] nums, int target) {', 'return []; }'],
  'sliding-window': ['static int Window(string s) {', 'return best; }'],
  stack: ['static int[] Mono(int[] temps) {', 'return answer; }'],
  'binary-search': ['static int Search(int[] nums, int target) {', '}'],
  'linked-list': ['static ListNode? Reverse(ListNode? head) {', '}'],
  trees: ['static void Trees(TreeNode? root) {', '}'],
  heap: ['static void Heap(Dictionary<int, int> counts, int k) {', '}'],
  graphs: ['static void Graph(List<int>[] graph, int start) {', '}'],
  intervals: ['static void Intervals(int[][] intervals) {', '}'],
  backtracking: ['static void Backtrack(int[] nums) {', '}'],
  dp: ['static int Dp(int[] coins, int amount) {', '}']
};
const sol = join(out, 'solutions');
mkdirSync(sol, { recursive: true });
writeFileSync(join(sol, 'verify.csproj'), csproj);
const methods = Object.entries(IV.cs).filter(([id]) => id !== 'lru-cache').map(([, code]) => code).join('\n');
writeFileSync(join(sol, 'Solutions.cs'), `public static class Solutions {\n${methods}\n}\n${IV.cs['lru-cache']}\n` +
  `public static class Patterns {\n${IV.patterns.map(p => { if (!wrap[p.id]) throw new Error('no wrapper for pattern ' + p.id); return wrap[p.id][0] + p.code + '\n' + wrap[p.id][1]; }).join('\n')}\n}\n`);
writeFileSync(join(sol, 'tests.json'), JSON.stringify(IV.problems.map(p => ({ id: p.id, fn: p.fn, mode: p.mode || null, tests: p.tests }))));
writeFileSync(join(sol, 'Program.cs'), `using System.Text.Json;
using System.Text.Json.Nodes;

var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
var problems = JsonNode.Parse(File.ReadAllText(args[0]))!.AsArray();
int failed = 0, total = 0;

static string Canon(JsonNode? n, int sortDepth)
{
    if (n is JsonArray a)
    {
        IEnumerable<string> items = a.Select(x => Canon(x, Math.Max(sortDepth - 1, 0)));
        if (sortDepth > 0) items = items.OrderBy(s => s, StringComparer.Ordinal);
        return "[" + string.Join(",", items) + "]";
    }
    if (n is JsonObject o) return "{" + string.Join(",", o.OrderBy(kv => kv.Key, StringComparer.Ordinal).Select(kv => kv.Key + ":" + Canon(kv.Value, 0))) + "}";
    return n is null ? "null" : n.ToJsonString();
}

static object RunLru(JsonArray a)
{
    var cache = new LRUCache((int)a[0]!);
    var result = new List<int?>();
    foreach (var op in a[1]!.AsArray())
    {
        if ((string)op![0]! == "get") result.Add(cache.Get((int)op[1]!));
        else { cache.Put((int)op[1]!, (int)op[2]!); result.Add(null); }
    }
    return result;
}

foreach (var p in problems)
{
    string id = (string)p!["id"]!, fn = (string)p["fn"]!;
    string? mode = (string?)p["mode"];
    int depth = mode == "set" ? 1 : mode == "nested" ? 2 : 0;
    foreach (var t in p["tests"]!.AsArray())
    {
        total++;
        var a = t![0]!.AsArray();
        object? got;
        try
        {
            if (id == "lru-cache") got = RunLru(a);
            else
            {
                var m = typeof(Solutions).GetMethod(char.ToUpper(fn[0]) + fn[1..]) ?? throw new Exception("no C# method for " + fn);
                var values = m.GetParameters().Select((prm, i) => a[i] is null ? null : a[i].Deserialize(prm.ParameterType, opts)).ToArray();
                got = m.Invoke(null, values);
            }
        }
        catch (Exception e) { Console.WriteLine($"FAIL {id}: threw {e.InnerException?.Message ?? e.Message}"); failed++; continue; }
        string g = Canon(JsonSerializer.SerializeToNode(got, opts), depth), x = Canon(t[1], depth);
        if (g != x) { Console.WriteLine($"FAIL {id}: expected {x} got {g}"); failed++; }
    }
}
Console.WriteLine($"{total - failed} / {total} C# solution tests passed across {problems.Count} problems");
return failed == 0 ? 0 : 1;

public class ListNode { public int Val { get; set; } public ListNode? Next { get; set; } }
public class TreeNode { public int Val { get; set; } public TreeNode? Left { get; set; } public TreeNode? Right { get; set; } }
`);
console.log('Building and running C# solutions + pattern templates…');
const r = run(`dotnet run -- "${join(sol, 'tests.json')}"`, sol);
console.log(r.ok ? r.text.trim() : errorsOf(r.text).join('\n') || r.text);
if (!r.ok) failures++;
else console.log(`${IV.patterns.length} C# pattern templates compiled`);

// ---------- 3: lesson snippets ----------
const les = join(out, 'lessons');
mkdirSync(les, { recursive: true });
writeFileSync(join(les, 'verify.csproj'), csproj);
const tracks = TRACKS.filter(t => ['csharp', 'cs'].includes(t.id));
let ok = 0, n = 0;
for (const t of tracks) for (const l of t.lessons) {
  if (!l.code || (l.lang || t.lang) !== 'cs') continue;
  n++;
  writeFileSync(join(les, 'Program.cs'), l.code);
  const b = run('dotnet build -nologo -clp:ErrorsOnly', les);
  if (b.ok && t.id === 'cs') console.log(`--- output of ${t.id}/${l.id} ---\n` + run('dotnet run --no-build', les).text.trim());
  if (b.ok) ok++; else { failures++; console.log(`\nLESSON ${t.id}/${l.id} does not compile:\n  ` + errorsOf(b.text).slice(0, 6).join('\n  ')); }
}
console.log(`${ok} / ${n} C# lesson snippets compile`);
process.exit(failures ? 1 : 0);
