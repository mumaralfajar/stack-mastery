// Shared helpers: DOM builder, escaping, mini-markdown, syntax highlighting.
const W = typeof window !== 'undefined' ? window : globalThis;
W.TRACKS = W.TRACKS || [];
W.LEVELS = W.LEVELS || ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// ---------- language ----------
// 'en' or 'id'. Indonesian text lives in data/id/*.js and is applied when selected.
W.LANG = (() => {
  let saved = null;
  try { saved = localStorage.getItem('stackmastery.lang'); } catch { /* private mode */ }
  if (saved === 'en' || saved === 'id') return saved;
  return typeof navigator !== 'undefined' && /^id(-|$)/i.test(navigator.language || '') ? 'id' : 'en';
})();
if (typeof document !== 'undefined') document.documentElement.lang = W.LANG;
W.setLang = lang => { try { localStorage.setItem('stackmastery.lang', lang); } catch { /* ignore */ } location.reload(); };
W.I18N = {
  ui: new Map(), tracks: {},
  add(dict) { for (const k in dict) this.ui.set(k, dict[k]); },
  // Translated lesson text for one track; may be called several times per track.
  lessons(id, lessons, meta) { const t = this.tracks[id] || (this.tracks[id] = { lessons: {} }); Object.assign(t, meta); Object.assign(t.lessons, lessons); }
};
// Translate an interface string. Unknown strings pass through unchanged; {name} is filled from vars.
W.t = (s, vars) => {
  if (typeof s !== 'string') return s;
  let out = W.I18N.ui.get(s) ?? s;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => k in vars ? vars[k] : m);
  return out;
};
const T_ATTR = new Set(['placeholder', 'title', 'aria-label']);

W.h = function (tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') { for (const [p, x] of Object.entries(v)) p.startsWith('--') ? el.style.setProperty(p, x) : el.style[p] = x; }
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : T_ATTR.has(k) ? W.t(v) : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(typeof kid === 'string' ? W.t(kid) : String(kid)));
  }
  return el;
};

W.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// `code` and **bold** only.
W.md = s => W.esc(W.t(s))
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const KW = {
  cs: 'abstract as async await base bool break byte case catch char class const continue decimal default delegate do double else enum event false finally float for foreach get if in init int interface internal is lock long namespace new null object out override params private protected public readonly record ref required return sealed set static string struct switch this throw true try using var virtual void when where while with yield',
  sql: 'select from where group by having order limit offset insert into values update set delete create table index primary key foreign references join inner left right full outer cross on as and or not null is in exists between like distinct union all case when then else end with over partition rows begin commit rollback transaction unique check default asc desc top view constraint alter add drop include integer int text real varchar nvarchar decimal date datetime2 bit',
  dart: 'abstract as assert async await base bool break case catch class const continue default do double dynamic else enum extends extension external factory false final finally for get if implements import in int interface is late library mixin new null num on operator part required return sealed set show static super switch sync this throw true try typedef var void when while with yield',
  ts: 'any as async await boolean break case catch class const continue default do else enum export extends false finally for from function if implements import in infer interface is keyof let never new null number of readonly return satisfies string switch this throw true try type typeof undefined unknown var void while'
};
const RX = {};
// Markup languages get their own token patterns: comment, string, keyword, number, name.
const SPEC = {
  css: ['\\/\\*[\\s\\S]*?\\*\\/', '"[^"]*"|\'[^\']*\'', '@[\\w-]+|!important', '-?\\b\\d+(?:\\.\\d+)?(?:px|rem|em|fr|vh|vw|dvh|ch|ms|s|deg|%)?', '--[\\w-]+|[a-z-]+(?=\\s*:)'],
  html: ['<!--[\\s\\S]*?-->', '"[^"]*"', '<\\/?[a-zA-Z][\\w-]*|\\/?>', '(?!)', '[a-z-]+(?==)'],
  sh: ['#[^\\n]*', '"[^"]*"|\'[^\']*\'', '\\b(?:dotnet|npm|npx|git|node|cd|code|docker)\\b', '(?!)', '(?<=\\s)--?[a-zA-Z][\\w-]*']
};
function rx(lang) {
  if (RX[lang]) return RX[lang];
  if (SPEC[lang]) return RX[lang] = new RegExp(SPEC[lang].map(p => `(${p})`).join('|'), 'g');
  const sql = lang === 'sql';
  const comment = sql ? '--[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
  const str = sql ? "'[^']*'" : '"(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`[^`]*`';
  const kw = (KW[lang] || KW.cs).split(' ').join('|');
  return RX[lang] = new RegExp(`(${comment})|(${str})|\\b(${kw})\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Z][A-Za-z0-9]*)\\b`, sql ? 'gi' : 'g');
}
W.highlight = function (code, lang) {
  let out = '', last = 0;
  code.replace(rx(lang), (m, c, s, k, n, t, i) => {
    out += W.esc(code.slice(last, i));
    const cls = c ? 'c' : s ? 's' : k ? 'k' : n ? 'n' : (lang === 'sql' ? '' : 't');
    out += cls ? `<span class="tk-${cls}">${W.esc(m)}</span>` : W.esc(m);
    last = i + m.length;
    return m;
  });
  return out + W.esc(code.slice(last));
};

const copyTimers = new WeakMap();
let lastCopyMsg = '';

W.codeBlock = function (code, lang) {
  code = code.replace(/^\n+|\s+$/g, '');
  const label = { cs: 'C#', sql: 'SQL', ts: 'TypeScript', tsx: 'TSX', dart: 'Dart', sh: 'Shell', css: 'CSS', html: 'HTML' }[lang] || lang;
  const tip = W.h('span', { class: 'copy-tip', role: 'status' });
  const btn = W.h('button', { class: 'copy', type: 'button', onclick: async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch { ok = false; }
    clearTimeout(copyTimers.get(btn));
    btn.removeAttribute('data-copied');
    btn.removeAttribute('data-failed');
    let msg = W.t(ok ? 'Copied' : 'Copy failed');
    if (msg === lastCopyMsg) msg += '\u00A0';
    lastCopyMsg = msg;
    tip.textContent = '';
    void btn.offsetWidth;
    btn.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    requestAnimationFrame(() => { tip.textContent = msg; });
    copyTimers.set(btn, setTimeout(() => {
      btn.removeAttribute('data-copied');
      btn.removeAttribute('data-failed');
      tip.textContent = '';
    }, 1800));
  } }, 'Copy');
  return W.h('div', { class: 'code' },
    W.h('div', { class: 'code-bar' }, W.h('span', {}, label), W.h('span', { class: 'copy-wrap' }, tip, btn)),
    W.h('pre', {}, W.h('code', { html: W.highlight(code, lang === 'tsx' ? 'ts' : lang) })));
};
