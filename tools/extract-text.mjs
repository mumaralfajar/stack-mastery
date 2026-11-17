// Prints the translatable text of one data set as JSON (no code samples).
// Usage: node tools/extract-text.mjs <track id | projects | interview>
import { readFileSync } from 'node:fs';
globalThis.window = globalThis;
globalThis.TRACKS = [];
const load = f => (0, eval)(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
['csharp', 'aspnet', 'sql', 'css', 'react', 'angular', 'flutter', 'fundamentals', 'projects', 'interview', 'interview-cs'].forEach(f => load(f + '.js'));

const what = process.argv[2];
let out;
if (what === 'projects') out = PROJECTS.map(({ title, brief, build, stretch, teach }) => ({ title, brief, build, stretch, teach }));
else if (what === 'interview') {
  const part = process.argv[3];
  const all = {
    misc: { method: IV.method, bigO: IV.bigO, plan: IV.plan, hiring: IV.hiring, ui: IV.ui, patterns: IV.patterns.map(({ id, name, signal, cost }) => ({ id, name, signal, cost })) },
    problems: IV.problems.map(({ id, title, prompt, hints, complexity, follow }) => ({ id, title, prompt, hints, complexity, follow })),
    design: { framework: IV.design.framework, blocks: IV.design.blocks, cases: IV.design.cases.map(({ id, title, prompt, req, est, tiers, deep, follow }) => ({ id, title, prompt, req, est, tiers, deep, follow })) },
    behavioral: IV.behavioral.map(({ id, name, looks, qs }) => ({ id, name, looks, qs })),
    rapid: IV.rapid.map(({ area, qs }) => ({ area, qs }))
  };
  out = part ? all[part] : all;
} else {
  const t = TRACKS.find(x => x.id === what);
  const [from, to] = (process.argv[3] || '0-99').split('-').map(Number);
  out = { name: t.name, tagline: t.tagline, lessons: t.lessons.slice(from, to).map(l => ({ id: l.id, title: l.title, why: l.why, ...(l.terms ? { terms: l.terms } : {}), points: l.points, practice: l.practice, teach: l.teach, analogy: l.analogy, pitfalls: l.pitfalls, quiz: l.quiz.map(q => [q.q, q.a, q.why]) })) };
}
const NL = String.fromCharCode(10);
console.log(what === 'projects' || what === 'interview' ? JSON.stringify(out) : JSON.stringify({ name: out.name, tagline: out.tagline }) + NL + out.lessons.map(l => JSON.stringify(l)).join(NL));
