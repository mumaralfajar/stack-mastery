import './util.js';
import '../../data/csharp.js';
import '../../data/fundamentals.js';
import '../../data/sql.js';
import '../../data/aspnet.js';
import '../../data/css.js';

import { applyTheme } from './state.js';
import { renderNav, setMenu, isMenuOpen } from './nav.js';
import { dashboard } from './views/dashboard.js';
import { trackView, lessonView, planView } from './views/track.js';
import { review, exam, labView, playView } from './views/practice.js';
import { projects, teach, searchView, startView } from './views/teach.js';

applyTheme();

await import('./tracks-ui.js');

if (window.LANG === 'id') {
  await import('./load-id.js');
}

const view = document.getElementById('view');
const nav = document.getElementById('nav');

let routed = false, routeSeq = 0;
let vizP, playP, ivP;
const ensureViz = () => vizP || (vizP = Promise.all([
  import('./viz/viz.js'), import('./viz/vizcss.js'), import('./viz/vizmore.js'),
  import('./viz/vizangular.js'), import('./viz/vizflutter.js'), import('./viz/vizplus.js'),
  import('./viz/vizgo.js'), import('./viz/vizsys.js')
]));
const ensurePlay = () => playP || (playP = import('./playground.js'));
const ensureInterview = () => ivP || (ivP = (async () => {
  await Promise.all([
    ensurePlay(),
    (async () => {
      await import('../../data/interview.js');
      await import('../../data/interview-cs.js');
      if (window.LANG === 'id') {
        await import('../../data/id/interview.js');
        window.applyInterviewI18n && window.applyInterviewI18n();
      }
    })()
  ]);
  await import('./interview.js');
})());

addEventListener('keydown', e => {
  if (e.key === 'Escape' && isMenuOpen()) {
    setMenu(false, { restoreFocus: true });
    return;
  }
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.target.closest('input, textarea, select, [contenteditable], .monaco-host')) {
    e.preventDefault();
    location.hash = '#/search';
  }
});

async function route() {
  const seq = ++routeSeq;
  setMenu(false);
  const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/');
  if (a === 'play') await ensurePlay();
  else if (a === 'lab' || a === 'lesson') await ensureViz();
  else if (a === 'interview') await ensureInterview();
  else if (a === 'search') await Promise.all([ensureViz(), ensureInterview()]);
  if (seq !== routeSeq) return;
  const r = {
    track: () => trackView(b),
    lesson: () => lessonView(b, c),
    plan: () => planView(b, c),
    review,
    exam,
    lab: () => labView(b),
    play: () => playView(b, c),
    projects,
    teach,
    interview: () => window.INTERVIEW.view(b, c),
    search: searchView,
    start: startView
  }[a] || dashboard;
  const updateDOM = () => {
    view.replaceChildren(r());
    renderNav();
    const h1 = view.querySelector('h1');
    document.title = (h1 && a ? h1.textContent + ' — ' : '') + 'Stack Mastery';
    scrollTo(0, 0);
  };
  if (!routed || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    updateDOM();
    if (routed && a !== 'search') view.focus({ preventScroll: true });
    routed = true;
    return;
  }
  const transition = document.startViewTransition(updateDOM);
  if (a !== 'search') {
    transition.finished.finally(() => {
      view.focus({ preventScroll: true });
    });
  }
}

addEventListener('hashchange', route);
route();
