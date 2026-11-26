// Client-rendered workspace views (dashboard, flashcard review, mock exam, playgrounds, interview prep, break room).
// The page is pre-rendered with its heading; this island imports only the one view module (and the data it needs)
// named by #view-root[data-view], then replaces the placeholder with the live view.
import { getLang, getTrack, registerTrack, registerTrackTranslation, registerUiDict } from '../lib/i18n.ts';
import { h } from '../lib/dom.ts';
import { subscribeState } from '../lib/state.ts';
import type { QuizIndexData } from '../data/quiz-index.ts';
import type { Lang, Track, TrackCatalog, TrackTranslation } from '../lib/types.ts';

type CleanupFn = () => void;
type RegisterCleanup = (fn: CleanupFn) => void;
type ViewRenderer = (onCleanup: RegisterCleanup) => Node;

interface ViewArgs {
  kind?: 'sql' | 'ts' | 'css' | 'dart';
  sub?: string;
  id?: string;
}

const root = document.getElementById('view-root');
const lang: Lang = getLang();
const isId = lang === 'id';

const readJson = <T,>(id: string): T | null => {
  try {
    return JSON.parse(document.getElementById(id)?.textContent || 'null') as T | null;
  } catch {
    return null;
  }
};
const idUi = (): Promise<void> => (isId ? import('../data/id/index.ts').then((m) => m.loadIdUi()) : Promise.resolve());
const loadQuizIndex = async (): Promise<QuizIndexData> => {
  const viewData = readJson<{ indexUrl?: string; i18n?: Record<string, string> }>('view-data') || {};
  registerUiDict(viewData.i18n || {});
  if (!viewData.indexUrl) return { tracks: [] };
  const res = await fetch(viewData.indexUrl);
  if (!res.ok) throw new Error(`quiz index HTTP ${res.status}`);
  return res.json() as Promise<QuizIndexData>;
};
const interviewData = (): Promise<unknown> =>
  Promise.all([
    import('../data/interview-data.ts').then((m) => m.loadInterviewData()),
    isId ? import('../data/id/index.ts').then((m) => m.loadIdInterview()) : undefined,
  ]);

// Each loader resolves to a render() function producing the view's root node.
const VIEWS: Record<string, (args: ViewArgs) => Promise<ViewRenderer>> = {
  async dashboard() {
    const [{ dashboard }] = await Promise.all([import('./views/dashboard.ts'), idUi()]);
    const catalog = readJson<TrackCatalog>('view-data') || { tracks: [] };
    return () => dashboard(catalog);
  },
  async review() {
    const [{ review }, quizIndex] = await Promise.all([import('./views/practice.ts'), loadQuizIndex()]);
    return (onCleanup) => review(quizIndex, onCleanup);
  },
  async exam() {
    const [{ exam }, quizIndex] = await Promise.all([import('./views/practice.ts'), loadQuizIndex()]);
    return () => exam(quizIndex);
  },
  async notes() {
    const [{ notes }] = await Promise.all([import('./views/notes.ts'), idUi()]);
    const catalog = readJson<TrackCatalog>('view-data') || { tracks: [] };
    return (onCleanup) => notes(catalog, onCleanup);
  },
  async play({ kind }) {
    const loadFlutterTrack = async () => {
      const [enMod, idMod] = await Promise.all([
        import('../data/tracks/flutter.js'),
        isId ? import('../data/id/tracks/flutter.js') : Promise.resolve(undefined),
      ]);
      registerTrack(enMod.default as unknown as Track);
      if (idMod) registerTrackTranslation(idMod.default as unknown as TrackTranslation);
      return getTrack('flutter', lang);
    };
    const [play] = await Promise.all([
      import('./playground.ts'),
      idUi(),
      kind === 'dart' ? loadFlutterTrack() : undefined,
    ]);
    const sample = new URLSearchParams(location.search).get('sample') || undefined;
    const run = { sql: play.sql, ts: play.ts, css: play.css, dart: play.dart }[kind || 'sql'] || play.sql;
    return (onCleanup) => {
      const el = h('div', { class: 'page wide' });
      run(el, sample, onCleanup);
      return el;
    };
  },
  async interview({ sub, id }) {
    const [ivMod] = await Promise.all([import('./interview.ts'), interviewData(), idUi()]);
    return () => ivMod.interviewView(sub, id);
  },
  async break() {
    const [{ breakView }] = await Promise.all([import('../lib/break/break-island.ts'), idUi()]);
    return (onCleanup) => breakView(onCleanup);
  },
};

// A view may register several cleanups (observers, listeners, timers); they all run before the next render or on pagehide.
let cleanups: CleanupFn[] = [];
let lastRender: ViewRenderer | null = null;
const runCleanup = (): void => {
  const fns = cleanups;
  cleanups = [];
  for (const fn of fns) {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  }
};
const registerCleanup: RegisterCleanup = (fn) => {
  cleanups.push(fn);
};

addEventListener('pagehide', runCleanup);
addEventListener('pageshow', (e) => {
  if (e.persisted && lastRender && root) {
    runCleanup();
    root.replaceChildren(lastRender(registerCleanup));
  }
});

async function mount(): Promise<void> {
  if (!root) return;
  const view = root.dataset.view || '';
  const args = JSON.parse(root.dataset.args || '{}') as ViewArgs;
  const load = VIEWS[view];
  if (!load) return;
  const render = await load(args);
  lastRender = render;
  runCleanup();
  root.replaceChildren(render(registerCleanup));
  root.removeAttribute('aria-busy');

  // Progress changed in another tab: redraw views that show summary progress when no editor or form is active.
  subscribeState((kind, external) => {
    if (!external) return;
    const active = document.activeElement;
    const shouldRedraw =
      view === 'dashboard' ||
      (view === 'notes' &&
        (kind === 'study' || kind === 'all') &&
        !(root.contains(active) && active?.matches('input, textarea, select'))) ||
      (view === 'interview' &&
        (kind === 'interview' || kind === 'all') &&
        !root.querySelector('.play, .mock-stage :is(textarea, select)') &&
        !(root.contains(active) && active?.matches('input, textarea, select')));
    if (shouldRedraw) {
      runCleanup();
      root.replaceChildren(render(registerCleanup));
    }
  });
}

mount().catch((e: unknown) => {
  console.error(e);
});
