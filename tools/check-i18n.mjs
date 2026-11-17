// Checks that the Indonesian content lines up with the English data:
// every lesson, quiz question, answer list, problem, design case and Q&A has a translation of the same shape.
// Usage: node tools/check-i18n.mjs
import { readFileSync, readdirSync } from 'node:fs';
globalThis.window = globalThis;
globalThis.TRACKS = [];
globalThis.I18N = {
  ui: new Map(), tracks: {},
  add(d) { for (const k in d) this.ui.set(k, d[k]); },
  lessons(id, lessons, meta) { const t = this.tracks[id] || (this.tracks[id] = { lessons: {} }); Object.assign(t, meta); Object.assign(t.lessons, lessons); }
};
const run = f => (0, eval)(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
['csharp', 'aspnet', 'sql', 'css', 'react', 'angular', 'flutter', 'fundamentals', 'projects', 'interview', 'interview-cs'].forEach(f => run(f + '.js'));
readdirSync(new URL('../data/id/', import.meta.url)).forEach(f => run('id/' + f));

const errors = [];
const same = (where, a, b) => { if (!Array.isArray(b) || a.length !== b.length) errors.push(`${where}: expected ${a.length} items, found ${Array.isArray(b) ? b.length : 'none'}`); };
const ticks = (where, a, b) => { const n = s => (String(s).match(/`/g) || []).length; if (n(a) !== n(b)) errors.push(`${where}: different number of code spans`); };

let lessons = 0;
for (const t of TRACKS) {
  const tr = I18N.tracks[t.id];
  if (!tr) { errors.push(`track ${t.id}: no translation`); continue; }
  for (const id of Object.keys(tr.lessons)) if (!t.lessons.some(l => l.id === id)) errors.push(`${t.id}/${id}: translation for a lesson that does not exist`);
  for (const l of t.lessons) {
    const x = tr.lessons[l.id], w = `${t.id}/${l.id}`;
    if (!x) { errors.push(`${w}: not translated`); continue; }
    lessons++;
    for (const f of ['title', 'why', 'practice', 'teach', 'analogy']) if (!x[f]) errors.push(`${w}: missing ${f}`); else if (f !== 'title') ticks(`${w}.${f}`, l[f], x[f]);
    same(`${w}.points`, l.points, x.points); same(`${w}.pitfalls`, l.pitfalls, x.pitfalls); same(`${w}.quiz`, l.quiz, x.quiz);
    if (l.terms) {
      same(`${w}.terms`, l.terms, x.terms);
      (x.terms || []).forEach((pair, i) => {
        if (l.terms[i]) {
          same(`${w}.terms[${i}]`, l.terms[i], pair);
          ticks(`${w}.terms[${i}][0]`, l.terms[i][0], pair[0]);
          ticks(`${w}.terms[${i}][1]`, l.terms[i][1], pair[1]);
        }
      });
    }
    (x.points || []).forEach((p, i) => l.points[i] && ticks(`${w}.points[${i}]`, l.points[i], p));
    (x.quiz || []).forEach((q, i) => { if (l.quiz[i]) { same(`${w}.quiz[${i}].answers`, l.quiz[i].a, q[1]); ticks(`${w}.quiz[${i}].q`, l.quiz[i].q, q[0]); } });
  }
}

same('projects', PROJECTS, I18N.projects);
PROJECTS.forEach((p, i) => { const x = (I18N.projects || [])[i] || {}; same(`project ${i}.build`, p.build, x.build); same(`project ${i}.stretch`, p.stretch, x.stretch); });

const iv = I18N.iv || {};
for (const f of ['method', 'bigO', 'plan', 'hiring', 'ui']) same('interview.' + f, IV[f], iv[f]);
IV.plan.forEach((w, i) => same(`interview.plan[${i}]`, w[1], ((iv.plan || [])[i] || [])[1]));
for (const p of IV.patterns) if (!(iv.patterns || {})[p.id]) errors.push(`pattern ${p.id}: not translated`);
for (const p of IV.problems) { const x = (iv.problems || {})[p.id]; if (!x) errors.push(`problem ${p.id}: not translated`); else { same(`problem ${p.id}.hints`, p.hints, x.hints); same(`problem ${p.id}.follow`, p.follow, x.follow); } }
for (const b of IV.behavioral) { const x = (iv.behavioral || {})[b.id]; if (!x) errors.push(`behavioral ${b.id}: not translated`); else same(`behavioral ${b.id}.qs`, b.qs, x.qs); }
same('design.framework', IV.design.framework, (iv.design || {}).framework); same('design.blocks', IV.design.blocks, (iv.design || {}).blocks);
for (const c of IV.design.cases) { const x = ((iv.design || {}).cases || {})[c.id]; if (!x) errors.push(`design case ${c.id}: not translated`); else for (const f of ['req', 'est', 'deep', 'follow']) same(`design ${c.id}.${f}`, c[f], x[f]); }
same('rapid', IV.rapid, iv.rapid);
IV.rapid.forEach((r, i) => same(`rapid[${i}] ${r.area}`, r.qs, ((iv.rapid || [])[i] || {}).qs));

console.log(`${lessons} lessons, ${I18N.ui.size} interface strings checked.`);
if (errors.length) { console.log(errors.length + ' problem(s):\n' + errors.join('\n')); process.exit(1); }
console.log('Indonesian content matches the English structure.');
