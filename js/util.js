// Shared helpers: DOM builder, escaping, mini-markdown, syntax highlighting.
window.TRACKS = [];
window.LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

window.h = function (tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') { for (const [p, x] of Object.entries(v)) p.startsWith('--') ? el.style.setProperty(p, x) : el.style[p] = x; }
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
};

window.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// `code` and **bold** only.
window.md = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const KW = {
  cs: 'abstract as async await base bool break byte case catch char class const continue decimal default delegate do double else enum event false finally float for foreach get if in init int interface internal is lock long namespace new null object out override params private protected public readonly record ref required return sealed set static string struct switch this throw true try using var virtual void when where while with yield',
  sql: 'select from where group by having order limit offset insert into values update set delete create table index primary key foreign references join inner left right full outer cross on as and or not null is in exists between like distinct union all case when then else end with over partition rows begin commit rollback transaction unique check default asc desc top view constraint alter add drop include integer int text real varchar nvarchar decimal date datetime2 bit',
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
window.highlight = function (code, lang) {
  let out = '', last = 0;
  code.replace(rx(lang), (m, c, s, k, n, t, i) => {
    out += esc(code.slice(last, i));
    const cls = c ? 'c' : s ? 's' : k ? 'k' : n ? 'n' : (lang === 'sql' ? '' : 't');
    out += cls ? `<span class="tk-${cls}">${esc(m)}</span>` : esc(m);
    last = i + m.length;
    return m;
  });
  return out + esc(code.slice(last));
};

window.codeBlock = function (code, lang) {
  code = code.replace(/^\n+|\s+$/g, '');
  const label = { cs: 'C#', sql: 'SQL', ts: 'TypeScript', tsx: 'TSX', sh: 'Shell', css: 'CSS', html: 'HTML' }[lang] || lang;
  const btn = h('button', { class: 'copy', type: 'button', onclick: () => {
    navigator.clipboard && navigator.clipboard.writeText(code).then(() => {
      btn.textContent = 'Copied'; setTimeout(() => btn.textContent = 'Copy', 1200);
    });
  } }, 'Copy');
  return h('div', { class: 'code' },
    h('div', { class: 'code-bar' }, h('span', {}, label), btn),
    h('pre', {}, h('code', { html: highlight(code, lang === 'tsx' ? 'ts' : lang) })));
};
