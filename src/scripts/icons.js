import { peek, shuffle } from './state.js';

export const ICONS = {
  csharp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2Z"/><path d="M10.5 9.2a3.2 3.2 0 1 0 0 5.6M14 9.5v5M16.8 9.5v5M13 11h4.8M13 13h4.8"/></svg>',
  aspnet: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3.5 9h17M3.5 15h17"/></svg>',
  sql: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  css: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3Z"/><path d="M8 9.5c1-2 2.5-2.5 4-1s3 1 4-1M8 14c1-2 2.5-2.5 4-1s3 1 4-1"/></svg>',
  react: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6" fill="currentColor"/><ellipse cx="12" cy="12" rx="9.5" ry="4"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)"/></svg>',
  angular: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 3.5 5.6 5 17.5 12 21.5l7-4 1.5-11.9L12 2.5Z"/><path d="M12 6.2 7.8 16.5M12 6.2l4.2 10.3M9.3 13.4h5.4"/></svg>',
  flutter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 2 4.5 12l3.1 3.1L20.7 2h-6.2ZM14.5 11.2 9.2 16.5l5.3 5.5h6.2l-5.3-5.5 5.3-5.3h-6.2Z"/></svg>',
  go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 9h3.2M1.5 12h4.2M2.5 15h3.2"/><path d="M13.1 9.5a3.5 3.5 0 1 0 0 5V12h-2.4"/><circle cx="18.5" cy="12" r="3.5"/></svg>',
  cs: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="2.5"/><circle cx="6" cy="13" r="2.5"/><circle cx="18" cy="13" r="2.5"/><circle cx="3.5" cy="20" r="2"/><circle cx="9.5" cy="20" r="2"/><path d="M10.3 6.4 7.5 11M13.7 6.4 16.5 11M5 15.2 4 18M7.2 15.2 8.8 18"/></svg>',
  sysdesign: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2.5" width="6" height="4" rx="1"/><rect x="2.5" y="10" width="6" height="4" rx="1"/><rect x="15.5" y="10" width="6" height="4" rx="1"/><ellipse cx="12" cy="19.5" rx="6.5" ry="2.2"/><path d="M12 6.5v1.8M12 8.3H5.5V10M12 8.3h6.5V10M5.5 14v3.5L9 18.2M18.5 14v3.5L15 18.2"/></svg>',
  interview: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
  break: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.4"/><path d="M12 3a3 3 0 0 1 2.6 4.5 3 3 0 0 1 4.4 2.6 3 3 0 0 1-2.6 4.4 3 3 0 0 1-1.8 4.2 3 3 0 0 1-5.2 0 3 3 0 0 1-1.8-4.2 3 3 0 0 1-2.6-4.4 3 3 0 0 1 4.4-2.6A3 3 0 0 1 12 3Z"/></svg>'
};

export const ico = (id, cls = 'nav-ico') => ICONS[id] ? window.h('span', { class: cls, html: ICONS[id] }) : null;
export const chip = (text, cls) => window.h('span', { class: 'chip ' + (cls || '') }, text);
export const dots = k => { const s = peek(k); return window.h('span', { class: 'dots', title: 'Learn · Check · Teach' }, ['read', 'quiz', 'teach'].map(f => window.h('i', { class: s[f] ? 'on' : '' }))); };
export const bar = (p, label) => window.h('div', { class: 'bar', role: 'img', 'aria-label': window.t(label || 'Progress') + ' ' + p + '%' }, window.h('i', { style: { width: p + '%' } }));
export function ring(p) {
  const T = window.t, r = 52, c = 2 * Math.PI * r;
  return window.h('div', { class: 'ring', html:
    `<svg viewBox="0 0 120 120" role="img" aria-label="${T('Overall mastery')} ${p}%"><circle cx="60" cy="60" r="${r}" class="ring-bg"/><circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" class="ring-n">${p}%</text><text x="60" y="76" text-anchor="middle" class="ring-l">${T('mastery')}</text></svg>` });
}
export const section = (title, ...kids) => window.h('section', { class: 'sec' }, window.h('h2', {}, title), ...kids);
export const lessonHref = (t, l) => `#/lesson/${t.id}/${l.id}`;

// One multiple-choice question. once=true locks after the first answer (exam mode).
// onMiss runs on the first wrong answer to the question.
export function quizItem(q, { once, solved, onResult, onMiss }) {
  const { h, md, t: T } = window;
  const order = shuffle(q.a.map((text, i) => ({ text, ok: i === q.c })));
  const fb = h('p', { class: 'fb', 'aria-live': 'polite' });
  let done = !!solved, first = true;
  const btns = order.map(o => h('button', { type: 'button', class: 'opt' + (solved && o.ok ? ' right' : ''), disabled: !!solved, html: md(o.text), onclick: e => {
    if (done) return;
    const b = e.currentTarget;
    if (o.ok) {
      done = true; b.classList.add('right'); fb.className = 'fb good';
      fb.innerHTML = '<strong>' + T('Correct.') + '</strong> ' + md(q.why);
    } else {
      b.classList.add('wrong');
      if (first && onMiss) onMiss();
      if (once) { done = true; btns[order.findIndex(x => x.ok)].classList.add('right'); fb.className = 'fb bad'; fb.innerHTML = '<strong>' + T('Not quite.') + '</strong> ' + md(q.why); }
      else { fb.className = 'fb bad'; fb.textContent = T('Not quite. Think about why, then try another.'); }
    }
    if (done || once) { btns.forEach(x => x.disabled = done); onResult && onResult(o.ok && first); }
    first = false;
  } }));
  if (solved) { fb.className = 'fb good'; fb.innerHTML = '<strong>' + T('Correct.') + '</strong> ' + md(q.why); }
  return h('div', { class: 'q' }, h('p', { class: 'q-text', html: md(q.q) }), h('div', { class: 'opts' }, btns), fb);
}

const DOCK_ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/></svg>';
const DOCK_CHEV_SVG = '<svg class="lp-dock-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

// Shared collapsible floating control dock used by the Landing reactor and Break Room meadow.
export function dockControlBar(ariaLabel, extraClass, ...items) {
  const { h, t: T } = window;
  let collapsed = true;
  const dockItems = h('div', { class: 'lp-dock-items' }, ...items);
  dockItems.inert = true;
  const toggleLabel = h('span', {}, T('Show'));
  const toggleBtn = h('button', {
    type: 'button',
    class: 'lp-dock-toggle',
    'aria-expanded': 'false',
    'aria-label': T('Show controls'),
    title: T('Show controls'),
    onclick: () => {
      collapsed = !collapsed;
      dock.setAttribute('data-collapsed', String(collapsed));
      dockItems.inert = collapsed;
      toggleBtn.setAttribute('aria-expanded', String(!collapsed));
      const lbl = collapsed ? T('Show controls') : T('Hide controls');
      toggleBtn.setAttribute('aria-label', lbl);
      toggleBtn.setAttribute('title', lbl);
      toggleLabel.textContent = collapsed ? T('Show') : T('Hide');
    }
  }, h('span', { html: DOCK_ICON_SVG }), toggleLabel, h('span', { html: DOCK_CHEV_SVG }));

  const dock = h('div', {
    class: 'lp-dock' + (extraClass ? ' ' + extraClass : ''),
    'data-collapsed': 'true',
    role: 'group',
    'aria-label': ariaLabel
  }, dockItems, toggleBtn);
  return dock;
}
