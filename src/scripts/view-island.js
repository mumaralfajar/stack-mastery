// Client-rendered workspace views (dashboard, flashcard review, mock exam, playgrounds, interview prep, break room).
// The page is pre-rendered with its heading; this island imports only the one view module (and the data it needs)
// named by #view-root[data-view], then replaces the placeholder with the live view.
import { getLang } from '../lib/i18n.ts';
import { h } from '../lib/dom.ts';
import { subscribeState } from '../lib/state.ts';

const root = document.getElementById('view-root');
const lang = getLang();
const isId = lang === 'id';

const readJson = (id) => {
  try {
    return JSON.parse(document.getElementById(id)?.textContent || 'null');
  } catch {
    return null;
  }
};
const idUi = () => (isId ? import('../data/id/index.ts').then((m) => m.loadIdUi()) : Promise.resolve());
const curriculum = () =>
  import('../data/index.ts')
    .then((m) => m.loadCurriculum())
    .then(() => (isId ? import('../data/id/index.ts').then((m) => m.loadIdCurriculum()) : undefined));
const interviewData = () =>
  Promise.all([
    import('../data/interview-data.ts').then((m) => m.loadInterviewData()),
    isId ? import('../data/id/index.ts').then((m) => m.loadIdInterview()) : undefined,
  ]);

// Each loader resolves to a render() function producing the view's root node.
const VIEWS = {
  async dashboard() {
    const [{ dashboard }] = await Promise.all([import('./views/dashboard.js'), idUi()]);
    const catalog = readJson('view-data') || { tracks: [] };
    return () => dashboard(catalog);
  },
  async review() {
    const [{ review }] = await Promise.all([import('./views/practice.js'), curriculum()]);
    return () => review();
  },
  async exam() {
    const [{ exam }] = await Promise.all([import('./views/practice.js'), curriculum()]);
    return () => exam();
  },
  async play({ kind }) {
    const [play] = await Promise.all([
      import('./playground.js'),
      idUi(),
      kind === 'dart' ? import('../data/track-loaders.ts').then((m) => m.loadTrackData('flutter', lang)) : undefined,
    ]);
    const sample = new URLSearchParams(location.search).get('sample') || undefined;
    const run = { sql: play.sql, ts: play.ts, css: play.css, dart: play.dart }[kind] || play.sql;
    return () => {
      const el = h('div', { class: 'page wide' });
      run(el, sample);
      return el;
    };
  },
  async interview({ sub, id }) {
    const [ivMod] = await Promise.all([import('./interview.js'), interviewData(), idUi()]);
    return () => ivMod.interviewView(sub, id);
  },
  async break() {
    const [{ breakView }] = await Promise.all([import('./views/break.js'), idUi()]);
    return () => breakView();
  },
};

async function mount() {
  if (!root) return;
  const view = root.dataset.view || '';
  const args = JSON.parse(root.dataset.args || '{}');
  const load = VIEWS[view];
  if (!load) return;
  const render = await load(args);
  root.replaceChildren(render());
  root.removeAttribute('aria-busy');

  // Progress changed in another tab: redraw views that show summary progress when no editor or form is active.
  subscribeState((kind, external) => {
    if (!external) return;
    const active = document.activeElement;
    const shouldRedraw =
      view === 'dashboard' ||
      (view === 'interview' &&
        (kind === 'interview' || kind === 'all') &&
        !root.querySelector('.play, .mock-stage :is(textarea, select)') &&
        !(root.contains(active) && active?.matches('input, textarea, select')));
    if (shouldRedraw) root.replaceChildren(render());
  });
}

mount().catch((e) => {
  console.error(e);
});
