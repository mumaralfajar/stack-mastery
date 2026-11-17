// Applies the selected language's content on top of the English data.
// Runs after data/*.js (and data/id/*.js when Indonesian is selected), before the views are built.
// Ids, code samples and test cases are never replaced, so saved progress works in both languages.
(() => {
  if (LANG === 'en') return;
  const put = (target, src, fields) => fields.forEach(f => { if (src[f] != null) target[f] = src[f]; });

  if (I18N.levels) LEVELS.splice(0, LEVELS.length, ...I18N.levels);

  for (const t of TRACKS) {
    const tr = I18N.tracks[t.id]; if (!tr) continue;
    put(t, tr, ['name', 'tagline']);
    for (const l of t.lessons) {
      const x = tr.lessons && tr.lessons[l.id]; if (!x) continue;
      put(l, x, ['title', 'why', 'terms', 'points', 'practice', 'teach', 'analogy', 'pitfalls', 'code']);
      (x.quiz || []).forEach(([q, a, why], i) => { if (l.quiz[i]) Object.assign(l.quiz[i], { q, a, why }); });
    }
  }

  (I18N.projects || []).forEach((p, i) => PROJECTS[i] && put(PROJECTS[i], p, ['title', 'brief', 'build', 'stretch', 'teach']));

  const iv = I18N.iv; if (!iv) return;
  put(IV, iv, ['method', 'bigO', 'plan', 'hiring', 'ui']);
  const byId = (list, map, fields) => list.forEach(x => map && map[x.id] && put(x, map[x.id], fields));
  byId(IV.patterns, iv.patterns, ['name', 'signal', 'cost']);
  byId(IV.problems, iv.problems, ['title', 'prompt', 'hints', 'complexity', 'follow']);
  byId(IV.behavioral, iv.behavioral, ['name', 'looks', 'qs']);
  if (iv.design) {
    put(IV.design, iv.design, ['framework', 'blocks']);
    byId(IV.design.cases, iv.design.cases, ['title', 'prompt', 'req', 'est', 'tiers', 'deep', 'follow']);
  }
  // Rapid-fire ratings are stored under the English area name; keep it as the key.
  IV.rapid.forEach((r, i) => { r.key = r.area; const x = iv.rapid && iv.rapid[i]; if (x) put(r, x, ['area', 'qs']); });
})();
