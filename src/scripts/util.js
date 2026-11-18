// Shared helpers: DOM builder, escaping, mini-markdown, syntax highlighting.
const W = typeof window !== 'undefined' ? window : globalThis;
W.TRACKS = W.TRACKS || [];
W.VIZ = W.VIZ || {};
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
  go: 'any append bool break byte cap case chan clear close cmp complex complex64 complex128 const continue copy default defer delete else error fallthrough false float32 float64 for func go goto if imag import int int8 int16 int32 int64 interface iota len make map max min new nil package print println range real recover return rune select string struct switch true type uint uint8 uint16 uint32 uint64 uintptr var',
  ts: 'any as async await boolean break case catch class const continue default do else enum export extends false finally for from function if implements import in infer interface is keyof let never new null number of override private protected public readonly return satisfies string switch this throw true try type typeof undefined unknown var void while'
};
const RX = {};
// Markup languages get their own token patterns: comment, string, keyword, number, name.
const SPEC = {
  css: ['\\/\\*[\\s\\S]*?\\*\\/', '"[^"]*"|\'[^\']*\'', '@[\\w-]+|!important', '-?\\b\\d+(?:\\.\\d+)?(?:px|rem|em|fr|vh|vw|dvh|ch|ms|s|deg|%)?', '--[\\w-]+|[a-z-]+(?=\\s*:)'],
  html: ['<!--[\\s\\S]*?-->', '"[^"]*"', '<\\/?[a-zA-Z][\\w-]*|\\/?>', '(?!)', '[a-z-]+(?==)'],
  sh: ['#[^\\n]*', '"[^"]*"|\'[^\']*\'', '\\b(?:dotnet|npm|npx|git|node|cd|code|docker)\\b', '(?!)', '(?<=\\s)--?[a-zA-Z][\\w-]*']
};
const TPL_RX = /(<!--[\s\S]*?-->)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@(?:if|else\s+if|else|for|empty|switch|case|default|defer|placeholder|loading|error)\b|\{\{|\}\})|(<\/?[a-zA-Z][\w-]*|\/?>)|([([]?[a-zA-Z][\w.-]*[\])]?(?==))/g;
function highlightTemplate(raw) {
  const inner = raw.slice(1, -1);
  let out = '<span class="tk-s">`</span>', last = 0;
  inner.replace(TPL_RX, (m, c, s, k, tag, _attr, i) => {
    out += W.esc(inner.slice(last, i));
    const cls = c ? 'c' : s ? 's' : k ? 'k' : tag ? 't' : 'n';
    out += `<span class="tk-${cls}">${W.esc(m)}</span>`;
    last = i + m.length;
    return m;
  });
  return out + W.esc(inner.slice(last)) + '<span class="tk-s">`</span>';
}
function highlightInterp(raw, lang) {
  if (lang === 'cs' && !raw.startsWith('$"') && !raw.startsWith('@$"') && !raw.startsWith('$@"')) return `<span class="tk-s">${W.esc(raw)}</span>`;
  if (lang === 'ts' && !raw.startsWith('`')) return `<span class="tk-s">${W.esc(raw)}</span>`;
  if (lang !== 'cs' && lang !== 'ts' && lang !== 'dart') return `<span class="tk-s">${W.esc(raw)}</span>`;
  const rx = lang === 'ts' ? /(\$\{[^}]*\})/g
    : lang === 'cs' ? /(\{\{|\}\}|\{[^}]*\})/g
    : /(\$\{[^}]*\}|\$[a-zA-Z_]\w*)/g;
  let out = '', last = 0, any = false;
  raw.replace(rx, (m, _g, i) => {
    any = true;
    if (i > last) out += `<span class="tk-s">${W.esc(raw.slice(last, i))}</span>`;
    out += m === '{{' || m === '}}' ? `<span class="tk-s">${W.esc(m)}</span>` : `<span class="tk-n">${W.esc(m)}</span>`;
    last = i + m.length;
    return m;
  });
  if (!any) return `<span class="tk-s">${W.esc(raw)}</span>`;
  if (last < raw.length) out += `<span class="tk-s">${W.esc(raw.slice(last))}</span>`;
  return out;
}
function rx(lang) {
  if (RX[lang]) return RX[lang];
  if (SPEC[lang]) return RX[lang] = new RegExp(SPEC[lang].map(p => `(${p})`).join('|'), 'g');
  const sql = lang === 'sql';
  const comment = sql ? '--[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
  const prefix = lang === 'cs' ? '(?:\\$@?|@\\$)?' : '';
  const str = sql ? "'[^']*'" : `${prefix}"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\``;
  const kw = (KW[lang] || KW.cs).split(' ').join('|');
  return RX[lang] = new RegExp(`(${comment})|(${str})|\\b(${kw})\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Z][A-Za-z0-9]*)\\b`, sql ? 'gi' : 'g');
}
W.highlight = function (code, lang) {
  let out = '', last = 0;
  code.replace(rx(lang), (m, c, s, k, n, t, i) => {
    out += W.esc(code.slice(last, i));
    if (s) {
      if (lang === 'ts' && m.startsWith('`') && /(?:\n|<[a-zA-Z/]|@(?:if|for|switch|defer)\b|\{\{)/.test(m)) out += highlightTemplate(m);
      else out += highlightInterp(m, lang);
    } else {
      const cls = c ? 'c' : k ? 'k' : n ? 'n' : (lang === 'sql' ? '' : 't');
      out += cls ? `<span class="tk-${cls}">${W.esc(m)}</span>` : W.esc(m);
    }
    last = i + m.length;
    return m;
  });
  return out + W.esc(code.slice(last));
};

const copyTimers = new WeakMap();
let lastCopyMsg = '';

W.codeBlock = function (code, lang, opts = {}) {
  code = code.replace(/^\n+|\s+$/g, '');
  const label = { cs: 'C#', sql: 'SQL', ts: 'TypeScript', tsx: 'TSX', dart: 'Dart', go: 'Go', sh: 'Shell', css: 'CSS', html: 'HTML' }[lang] || lang;
  const tip = W.h('span', { class: 'copy-tip', role: 'status' });
  const pre = W.h('pre', {}, W.h('code', { html: W.highlight(code, lang === 'tsx' ? 'ts' : lang) }));
  let hidden = !!opts.blurComments;
  const wrap = W.h('div', { class: 'code' + (hidden ? ' hide-hints' : '') });
  const hintBtn = opts.blurToggle ? W.h('button', { type: 'button', class: 'copy', onclick: () => {
    hidden = !hidden;
    wrap.classList.toggle('hide-hints', hidden);
    hintBtn.textContent = W.t(hidden ? 'Show hints' : 'Hide hints');
  } }, hidden ? 'Show hints' : 'Hide hints') : null;
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
  wrap.append(W.h('div', { class: 'code-bar' }, W.h('span', {}, label), W.h('span', { class: 'copy-wrap' }, hintBtn, tip, btn)), pre);
  return wrap;
};

// Render either a single codeBlock or accessible section tabs derived from l.splits.
W.codeFiles = function (code, lang, splits, opts = {}) {
  if (!splits || !splits.length) return W.codeBlock(code, lang, opts);
  const lines = code.replace(/^\n+|\s+$/g, '').split('\n');
  const idxs = splits.map(([, anchor]) => lines.findIndex(ln => ln.includes(anchor)));
  if (idxs.some(i => i < 0)) return W.codeBlock(code, lang, opts);
  const tabs = splits.map(([label], i) => {
    const start = idxs[i];
    const end = i + 1 < idxs.length ? idxs[i + 1] : lines.length;
    return [label, lines.slice(start, end).join('\n').trimEnd()];
  });
  tabs.push(['Full file', lines.join('\n')]);
  const panel = W.h('div', { role: 'tabpanel' });
  const bar = W.h('div', { class: 'code-tabs', role: 'tablist', 'aria-label': 'Code sections' });
  const btns = [];
  const select = k => {
    btns.forEach((b, i) => {
      const on = i === k;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panel.replaceChildren(W.codeBlock(tabs[k][1], lang, opts));
  };
  tabs.forEach(([label], i) => {
    const b = W.h('button', {
      type: 'button', role: 'tab', 'aria-selected': i === 0 ? 'true' : 'false',
      tabindex: i === 0 ? '0' : '-1',
      onclick: () => select(i),
      onkeydown: e => {
        if (e.key === 'ArrowRight') { select((i + 1) % tabs.length); btns[(i + 1) % tabs.length].focus(); }
        if (e.key === 'ArrowLeft') { select((i - 1 + tabs.length) % tabs.length); btns[(i - 1 + tabs.length) % tabs.length].focus(); }
      }
    }, label);
    btns.push(b);
    bar.append(b);
  });
  select(0);
  return W.h('div', { class: 'code-tabwrap' }, bar, panel);
};

// Connect parent/child component nodes in `.tree` visualizations with crisp SVG hierarchy lines.
W.treeWire = function (treeEl, edges) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'tree-wires');
  svg.setAttribute('aria-hidden', 'true');
  treeEl.prepend(svg);
  const draw = () => {
    const tr = treeEl.getBoundingClientRect();
    if (!tr.width || !tr.height) return;
    svg.setAttribute('viewBox', `0 0 ${tr.width} ${tr.height}`);
    let d = '';
    for (const [parent, children] of edges) {
      if (!parent || !children.length) continue;
      const pr = parent.getBoundingClientRect();
      const px = pr.left - tr.left + pr.width / 2;
      const py = pr.bottom - tr.top;
      const cRects = children.map(c => c.getBoundingClientRect());
      const midY = py + (cRects[0].top - pr.bottom) / 2;
      d += `M${px} ${py}V${midY}`;
      const xs = cRects.map(cr => cr.left - tr.left + cr.width / 2);
      d += `M${Math.min(...xs)} ${midY}H${Math.max(...xs)}`;
      for (let i = 0; i < cRects.length; i++) d += `M${xs[i]} ${midY}V${cRects[i].top - tr.top}`;
    }
    svg.innerHTML = `<path d="${d}"/>`;
  };
  if (typeof ResizeObserver === 'function') new ResizeObserver(draw).observe(treeEl);
  requestAnimationFrame(draw);
  return treeEl;
};

// Accessible native modal dialog helper (showModal + safe autofocus + closedby fallback).
W.confirmDialog = function (message, { title = 'Confirm', confirmText = 'Continue', cancelText = 'Cancel', danger = false } = {}) {
  return new Promise(resolve => {
    const id = 'dlg-' + Math.random().toString(36).slice(2, 8);
    const dlg = W.h('dialog', { class: 'sm-dialog', closedby: 'any', 'aria-labelledby': id });
    const cancelBtn = W.h('button', { type: 'submit', value: 'cancel', class: 'btn ghost', autofocus: danger }, cancelText);
    const okBtn = W.h('button', { type: 'submit', value: 'ok', class: 'btn' + (danger ? ' danger' : ''), autofocus: !danger }, confirmText);
    const form = W.h('form', { method: 'dialog' },
      W.h('h2', { id }, title),
      W.h('p', {}, message),
      W.h('div', { class: 'dlg-actions' }, cancelBtn, okBtn));
    dlg.append(form);
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let downOut = false;
      const out = e => { const r = dlg.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
      dlg.addEventListener('pointerdown', e => { downOut = out(e); });
      dlg.addEventListener('click', e => { if (downOut && out(e)) dlg.close(''); });
    }
    dlg.addEventListener('close', () => {
      const ok = dlg.returnValue === 'ok';
      dlg.returnValue = '';
      dlg.remove();
      resolve(ok);
    });
    document.body.append(dlg);
    dlg.showModal();
  });
};

W.alertDialog = function (message, { title = 'Notice', okText = 'OK' } = {}) {
  return new Promise(resolve => {
    const id = 'dlg-' + Math.random().toString(36).slice(2, 8);
    const dlg = W.h('dialog', { class: 'sm-dialog', closedby: 'any', 'aria-labelledby': id });
    dlg.append(W.h('form', { method: 'dialog' },
      W.h('h2', { id }, title),
      W.h('p', {}, message),
      W.h('div', { class: 'dlg-actions' }, W.h('button', { type: 'submit', value: 'ok', class: 'btn', autofocus: true }, okText))));
    dlg.addEventListener('close', () => { dlg.returnValue = ''; dlg.remove(); resolve(); });
    document.body.append(dlg);
    dlg.showModal();
  });
};

// Wrap tables in a keyboard-scrollable landmark with an accessible caption.
W.tableWrap = function (caption, tbl) {
  if (caption && !tbl.querySelector('caption')) {
    tbl.prepend(W.h('caption', { class: 'sr-only' }, caption));
  }
  return W.h('div', { class: 'table-wrap', role: 'region', tabindex: 0, 'aria-label': caption || 'Data table' }, tbl);
};
