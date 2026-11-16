import './util.js';
import '../../data/csharp.js';
import '../../data/fundamentals.js';
import '../../data/sql.js';
import '../../data/aspnet.js';
import '../../data/css.js';
import '../../data/react.js';
import '../../data/flutter.js';
import '../../data/projects.js';
import '../../data/interview.js';
import '../../data/interview-cs.js';

import './viz/viz.js';
import './viz/vizcss.js';
import './viz/vizmore.js';
import './viz/vizflutter.js';
import './playground.js';
import './interview.js';

import { applyTheme } from './state.js';
import { renderNav, setMenu, isMenuOpen } from './nav.js';
import { dashboard } from './views/dashboard.js';
import { trackView, lessonView, planView } from './views/track.js';
import { review, exam, labView, playView } from './views/practice.js';
import { projects, teach, searchView, startView } from './views/teach.js';

applyTheme();

if (window.LANG === 'id') {
  await import('./load-id.js');
}

const view = document.getElementById('view');
const nav = document.getElementById('nav');

let routed = false;
addEventListener('keydown', e => {
  if (e.key === 'Escape' && isMenuOpen()) {
    setMenu(false);
    const b = nav && nav.querySelector('.nav-toggle');
    if (b) b.focus();
    return;
  }
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.target.closest('input, textarea, select, [contenteditable], .monaco-host')) {
    e.preventDefault();
    location.hash = '#/search';
  }
});

function route() {
  setMenu(false);
  const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/');
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
  view.replaceChildren(r());
  renderNav();
  const h1 = view.querySelector('h1');
  document.title = (h1 && a ? h1.textContent + ' — ' : '') + 'Stack Mastery';
  scrollTo(0, 0);
  if (routed && a !== 'search') view.focus({ preventScroll: true });
  routed = true;
}

addEventListener('hashchange', route);
route();
