import { loadCurriculum, loadInterviewData } from '../data/index.ts';
import { loadIdCurriculum, loadIdInterview } from '../data/id/index.ts';
import { getLang } from '../lib/i18n.ts';
import { applyTheme, subscribeState } from '../lib/state.ts';
import { isMenuOpen, renderNav, setMenu } from './nav.js';
import { dashboard } from './views/dashboard.js';
import { exam, labView, playView, review } from './views/practice.js';
import { projects, searchView, startView, teach } from './views/teach.js';
import { lessonView, planView, trackView } from './views/track.js';
import { loadAllViz } from './viz/registry.ts';

applyTheme();

await loadCurriculum();

if (getLang() === 'id') {
  await loadIdCurriculum();
}

const view = document.getElementById('view');

let routed = false;
let routeSeq = 0;
let landingP = null;
let breakP = null;
let playP = null;
let ivP = null;
let cleanupView = null;

const ensureLanding = () => landingP || (landingP = import('./views/landing.js'));
const ensureBreak = () => breakP || (breakP = import('./views/break.js'));
const ensureViz = () => loadAllViz();
const ensurePlay = () => playP || (playP = import('./playground.js'));
const ensureInterview = () =>
  ivP ||
  (ivP = Promise.all([
    ensurePlay(),
    loadInterviewData(),
    getLang() === 'id' ? loadIdInterview() : Promise.resolve(),
    import('./interview.js'),
  ]).then(([, , , ivMod]) => ivMod));

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen()) {
    setMenu(false, { restoreFocus: true });
    return;
  }
  if (
    e.key === '/' &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.target.closest('input, textarea, select, [contenteditable], .monaco-host')
  ) {
    e.preventDefault();
    location.hash = '#/search';
  }
});

async function route() {
  const seq = ++routeSeq;
  setMenu(false);
  const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/');
  let landingMod = null;
  let breakMod = null;
  let playMod = null;
  let ivMod = null;
  if (!a) landingMod = await ensureLanding();
  else if (a === 'break' || a === 'meadow') breakMod = await ensureBreak();
  else if (a === 'play') playMod = await ensurePlay();
  else if (a === 'lab' || a === 'lesson') await ensureViz();
  else if (a === 'interview') ivMod = await ensureInterview();
  else if (a === 'search') await Promise.all([ensureViz(), ensureInterview()]);
  if (seq !== routeSeq) return;
  const r =
    {
      dashboard,
      break: () =>
        breakMod.breakView((fn) => {
          cleanupView = fn;
        }),
      meadow: () =>
        breakMod.breakView((fn) => {
          cleanupView = fn;
        }),
      track: () => trackView(b),
      lesson: () => lessonView(b, c),
      plan: () => planView(b, c),
      review,
      exam,
      lab: () => labView(b),
      play: () => playView(b, c, playMod.PLAY),
      projects,
      teach,
      interview: () => ivMod.interviewView(b, c),
      search: searchView,
      start: startView,
    }[a] ||
    (() =>
      landingMod.landingView((fn) => {
        cleanupView = fn;
      }));
  const updateDOM = () => {
    cleanupView?.();
    cleanupView = null;
    document.body.classList.toggle('is-landing', !a || a === 'break' || a === 'meadow');
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
  // A newer route skips this transition; its DOM update still runs, so the rejection is expected.
  transition.ready.catch(() => {});
  if (a !== 'search') {
    transition.finished.finally(() => {
      view.focus({ preventScroll: true });
    });
  }
}

addEventListener('hashchange', route);
// Progress changed in another tab or in-tab interview state updated: refresh the sidebar,
// and redraw views that display summary progress when no editor or form is active.
subscribeState((kind, external) => {
  renderNav();
  if (!external) return;
  const a = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (a === 'dashboard' || a === 'track') {
    route();
  } else if (a === 'interview' && (kind === 'interview' || kind === 'all')) {
    if (!view || view.querySelector('.play, .mock-stage :is(textarea, select)')) return;
    if (view.contains(document.activeElement) && document.activeElement.matches('input, textarea, select')) return;
    route();
  }
});
route();
