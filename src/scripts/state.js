// ---------- state ----------
const KEY = 'stackmastery.v1';
const KEYS = ['stackmastery.v1', 'stackmastery.sql', 'stackmastery.interview'];
const fresh = () => ({ lessons: {}, cards: {}, projects: {}, streak: { last: '', count: 0 }, theme: '' });

// Lightweight readiness computation used until the full interview bundle is lazy-loaded.
if (typeof window !== 'undefined' && !window.INTERVIEW) {
  window.INTERVIEW = {
    readiness() {
      try {
        const d = JSON.parse(localStorage.getItem('stackmastery.interview') || '{}');
        const beh = new Set((d.stories || []).flatMap(s => s.tags || []));
        const parts = [
          Object.keys(d.solved || {}).length / 21,
          Object.values(d.design || {}).filter(Boolean).length / 6,
          Math.min(beh.size, 8) / 8,
          Object.values(d.rapid || {}).filter(v => v === 2).length / 55,
          Math.min((d.mocks || []).length, 8) / 8
        ];
        return Math.round(parts.reduce((a, x) => a + x, 0) / parts.length * 100);
      } catch { return 0; }
    },
    view: () => document.createTextNode('')
  };
}

export let S;
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = fresh(); }

export const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ } };
export const day = (off = 0) => { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString('sv'); };
export const touch = () => {
  const t = day();
  if (S.streak.last !== t) { S.streak.count = S.streak.last === day(-1) ? S.streak.count + 1 : 1; S.streak.last = t; }
  save();
};
export const streak = () => (S.streak.last === day() || S.streak.last === day(-1)) ? S.streak.count : 0;

export const track = id => window.TRACKS.find(t => t.id === id);
export const key = (t, l) => t.id + '/' + l.id;
export const peek = k => S.lessons[k] || {};
export const st = k => S.lessons[k] || (S.lessons[k] = {});
export const score = k => { const s = peek(k); return (s.read ? 1 : 0) + (s.quiz ? 1 : 0) + (s.teach ? 1 : 0); };
export const pct = (t, lvl) => {
  const ls = t.lessons.filter(l => lvl == null || l.level === lvl);
  return ls.length ? Math.round(ls.reduce((a, l) => a + score(key(t, l)), 0) / (ls.length * 3) * 100) : 0;
};
export const allLessons = () => window.TRACKS.flatMap(t => t.lessons.map(l => ({ t, l, k: key(t, l) })));
export const overall = () => { const a = allLessons(); return Math.round(a.reduce((x, e) => x + score(e.k), 0) / (a.length * 3) * 100); };
export const allCards = () => allLessons().flatMap(e => e.l.quiz.map((q, i) => ({ id: e.k + '#' + i, q, t: e.t, l: e.l })));
// A card is in review once its lesson is marked learned, or as soon as its question was missed in the lesson.
export const dueCards = () => allCards().filter(c => S.cards[c.id] ? S.cards[c.id].due <= day() : peek(key(c.t, c.l)).read);
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export function applyTheme() {
  const meta = typeof document !== 'undefined' ? document.querySelector('meta[name="color-scheme"]') : null;
  if (S.theme === 'light' || S.theme === 'dark') {
    document.documentElement.dataset.theme = S.theme;
    if (meta) meta.content = S.theme;
  } else {
    delete document.documentElement.dataset.theme;
    if (meta) meta.content = 'light dark';
  }
}

export function toggleTheme() {
  const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const curDark = S.theme ? S.theme === 'dark' : sysDark;
  const nextDark = !curDark;
  S.theme = nextDark === sysDark ? '' : (nextDark ? 'dark' : 'light');
  save(); applyTheme();
}

if (typeof addEventListener !== 'undefined') {
  addEventListener('storage', e => {
    if (e.key === KEY) {
      try { S.theme = JSON.parse(e.newValue || '{}').theme || ''; applyTheme(); } catch { /* ignore */ }
    }
  });
}

export function exportBackup() {
  const { h } = window;
  const data = { app: 'stack-mastery', exported: new Date().toISOString(), keys: Object.fromEntries(KEYS.map(k => [k, localStorage.getItem(k)]).filter(([, v]) => v)) };
  const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })), download: `stack-mastery-backup-${day()}.json` });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function importBackup() {
  const { h, t: T } = window;
  const input = h('input', { type: 'file', accept: 'application/json,.json', onchange: async () => {
    try {
      const data = JSON.parse(await input.files[0].text());
      if (data.app !== 'stack-mastery' || !data.keys) throw new Error(T('not a Stack Mastery backup file'));
      const entries = Object.entries(data.keys).filter(([k, v]) => KEYS.includes(k) && typeof v === 'string');
      entries.forEach(([, v]) => JSON.parse(v));   // every value must itself be valid JSON
      if (!(await window.confirmDialog(T('Replace the progress in this browser with the backup from {date}?', { date: String(data.exported).slice(0, 10) }), { title: 'Import backup', confirmText: 'Import backup', danger: true }))) return;
      KEYS.forEach(k => localStorage.removeItem(k));
      entries.forEach(([k, v]) => localStorage.setItem(k, v));
      location.reload();
    } catch (e) { await window.alertDialog(T('Could not import: ') + e.message); }
  } });
  input.click();
}
