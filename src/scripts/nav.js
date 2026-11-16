import { dueCards, pct, toggleTheme, exportBackup, importBackup } from './state.js';
import { ico } from './icons.js';

let menuOpen = false;

export const isMenuOpen = () => menuOpen;

export function setMenu(open) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  menuOpen = !!open;
  nav.classList.toggle('open', menuOpen);
  document.body.classList.toggle('nav-open', menuOpen);
  const btn = nav.querySelector('.nav-toggle');
  if (btn) btn.setAttribute('aria-expanded', String(menuOpen));
  if (menuOpen) {
    const on = nav.querySelector('.nav-link.on');
    if (on) on.scrollIntoView({ block: 'nearest' });
  }
}

export function renderNav() {
  const { h, t: T, TRACKS, LANG, setLang, INTERVIEW } = window;
  const nav = document.getElementById('nav');
  if (!nav) return;
  const cur = location.hash.replace(/^#\/?/, '');
  const [a, b] = cur.split('/');
  const link = (href, label, on, extra) => h('a', { href, class: 'nav-link' + (on ? ' on' : ''), 'aria-current': on ? 'page' : null, onclick: () => setMenu(false) }, label, extra);
  const due = dueCards().length;
  const brand = () => h('a', { href: '#/', class: 'brand', onclick: () => setMenu(false) }, h('span', { class: 'logo' }, '◆'), 'Stack Mastery');
  const nextLang = LANG === 'id' ? 'en' : 'id', nextLangName = LANG === 'id' ? 'English' : 'Bahasa Indonesia';
  nav.replaceChildren(
    h('div', { class: 'nav-top' },
      brand(),
      h('div', { class: 'nav-actions' },
        h('a', { href: '#/search', class: 'icon-btn mob-only', 'aria-label': 'Search', title: 'Search', html: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' }),
        h('button', { type: 'button', class: 'icon-btn', lang: nextLang, 'aria-label': nextLangName, title: nextLangName, onclick: () => setLang(nextLang) }, nextLang.toUpperCase()),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Toggle theme', title: 'Toggle theme', onclick: toggleTheme, html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' }),
        h('button', { type: 'button', class: 'nav-toggle', 'aria-label': 'Menu', 'aria-expanded': String(menuOpen), 'aria-controls': 'nav-drawer', onclick: () => setMenu(!menuOpen) },
          h('span', { html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' }),
          due ? h('small', { class: 'badge' }, due) : null))),
    h('div', { class: 'nav-backdrop', onclick: () => setMenu(false) }),
    h('div', { class: 'nav-drawer', id: 'nav-drawer' },
      h('div', { class: 'drawer-head' },
        brand(),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close menu', title: 'Close menu', onclick: () => setMenu(false), html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' })),
      h('nav', { 'aria-label': 'Main' },
        link('#/', 'Dashboard', a === ''),
        link('#/start', 'Start here: setup', a === 'start'),
        link('#/search', 'Search', a === 'search', h('small', { class: 'kbd' }, '/')),
        h('p', { class: 'nav-h' }, 'Tracks'),
        TRACKS.map(t => link(`#/track/${t.id}`, h('span', { class: 'nav-track', style: { '--tc': `var(--${t.id})` } }, ico(t.id, 'nav-ico'), t.name),
          (a === 'track' || a === 'lesson' || a === 'plan') && b === t.id, h('small', {}, pct(t) + '%'))),
        h('p', { class: 'nav-h' }, 'Practice'),
        link('#/review', 'Flashcard review', a === 'review', due ? h('small', { class: 'badge' }, due) : null),
        link('#/exam', 'Mock exam', a === 'exam'),
        link('#/play/sql', 'SQL playground', a === 'play' && b === 'sql'),
        link('#/play/ts', 'TypeScript playground', a === 'play' && b === 'ts'),
        link('#/play/css', 'CSS + Tailwind playground', a === 'play' && b === 'css'),
        link('#/play/dart', 'Dart + Flutter playground', a === 'play' && b === 'dart'),
        link('#/lab', 'Visual lab', a === 'lab'),
        h('p', { class: 'nav-h' }, 'Get hired'),
        link('#/interview', 'Interview hub', a === 'interview' && !b, h('small', {}, INTERVIEW.readiness() + '%')),
        link('#/interview/coding', 'Coding problems', a === 'interview' && ['coding', 'problem', 'patterns'].includes(b)),
        link('#/interview/design', 'System design', a === 'interview' && b === 'design'),
        link('#/interview/behavioral', 'Behavioral', a === 'interview' && b === 'behavioral'),
        link('#/interview/rapid', 'Rapid-fire Q&A', a === 'interview' && b === 'rapid'),
        link('#/interview/mock', 'Mock interview', a === 'interview' && b === 'mock'),
        h('p', { class: 'nav-h' }, 'Become the teacher'),
        link('#/teach', 'Teaching toolkit', a === 'teach'),
        link('#/projects', 'Capstone projects', a === 'projects')),
      h('div', { class: 'nav-foot' },
        h('p', { class: 'private-note' }, 'Your progress is saved only in this browser. Nothing is uploaded or shared.'),
        h('button', { type: 'button', class: 'ghost', onclick: exportBackup }, 'Export backup'),
        h('button', { type: 'button', class: 'ghost', onclick: importBackup }, 'Import backup'),
        h('button', { type: 'button', class: 'ghost', onclick: () => {
          if (confirm(T('Erase all progress, notes, flashcard history and interview prep data? This cannot be undone.'))) {
            try { ['stackmastery.v1', 'stackmastery.sql', 'stackmastery.interview'].forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ }
            location.hash = '#/'; location.reload();
          }
        } }, 'Reset progress'))));
  nav.classList.toggle('open', menuOpen);
}
