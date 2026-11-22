// Landing page hydration entrypoint: legacy hash bridge, theme/language switchers, smooth scroll,
// collapsible toy dock, opt-in Packet Reactor audio, and canvas engine with clean pagehide teardown.
// Kept tiny on purpose: zero curriculum data, state store, or full i18n dictionary imports.
import '../../scripts/legacy-bridge.ts';
import { LANG_KEY } from '../keys.ts';
import { alternateUrl, isLang } from '../routes.ts';
import { toggleStoredTheme } from '../theme.ts';
import type { Lang } from '../types.ts';
import { createLandingAudio } from './audio.ts';
import { type LandingTrackSummary, type ReactorEngineController, createReactorEngine } from './reactor-engine.ts';

interface LandingPayload {
  lang?: string;
  tracks?: Record<string, LandingTrackSummary>;
  i18n?: Record<string, string>;
}

function readLandingData(): LandingPayload {
  try {
    return JSON.parse(document.getElementById('landing-data')?.textContent || '{}') as LandingPayload;
  } catch {
    return {};
  }
}

export function hydrateLanding(root: HTMLElement): () => void {
  const data = readLandingData();
  const lang: Lang = isLang(data.lang) ? data.lang : 'en';
  const dict = data.i18n || {};
  const tracks = data.tracks || {};
  const T = (key: string, vars?: Record<string, string | number>): string => {
    const s = dict[key] ?? key;
    return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
  };
  const $ = <E extends Element>(sel: string): E | null => root.querySelector<E>(sel);

  const audio = createLandingAudio();
  let engine: ReactorEngineController | null = null;

  for (const btn of root.querySelectorAll<HTMLElement>('[data-scroll-to]')) {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scrollTo || '');
      if (!target) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }

  $('[data-theme-toggle]')?.addEventListener('click', () => {
    toggleStoredTheme();
    requestAnimationFrame(() => engine?.refreshTheme());
  });

  const langLink = $<HTMLAnchorElement>('a[data-set-lang]');
  if (langLink && isLang(langLink.dataset.setLang)) {
    const target = langLink.dataset.setLang;
    langLink.href = alternateUrl(target, location.pathname, location.search);
    langLink.addEventListener('click', () => {
      try {
        localStorage.setItem(LANG_KEY, target);
      } catch {
        /* private mode */
      }
    });
  }

  const stage = $<HTMLElement>('.lp-stage');
  const canvas = $<HTMLCanvasElement>('canvas.lp-canvas');
  const reactorSpace = $<HTMLElement>('.lp-reactor-space');
  const inspDot = $<HTMLElement>('.lp-insp-dot');
  const inspText = $<HTMLElement>('[data-inspector-text]');
  const pulseDot = $<HTMLElement>('.lp-pulse-dot');
  const rpsValue = $<HTMLElement>('.lp-rps-pill b');
  const statusTag = $<HTMLElement>('[data-cache-status]');
  const colorProbe = $<HTMLElement>('[data-color-probe]');

  if (!stage || !canvas || !reactorSpace || !inspDot || !inspText || !pulseDot || !rpsValue || !statusTag || !colorProbe) {
    return () => audio.destroy();
  }

  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gravityOn = false;
  let slowMo = false;
  let paused = reducedMotion;

  const toy = (name: string): HTMLButtonElement | null => $<HTMLButtonElement>(`.lp-dock [data-toy="${name}"]`);
  const cacheBtn = toy('cache');
  const gravBtn = toy('gravity');
  const slowBtn = toy('slow');
  const soundBtn = toy('sound');
  const pauseBtn = toy('pause');

  toy('spike')?.addEventListener('click', () => engine?.fireSpike());
  cacheBtn?.addEventListener('click', () => {
    if (!engine) return;
    const killed = engine.toggleCacheKill();
    cacheBtn.classList.toggle('active', killed);
    cacheBtn.textContent = killed ? T('Restore Cache') : T('Kill Cache');
  });
  gravBtn?.addEventListener('click', () => {
    gravityOn = !gravityOn;
    gravBtn.setAttribute('aria-pressed', String(gravityOn));
    engine?.setGravity(gravityOn);
  });
  slowBtn?.addEventListener('click', () => {
    slowMo = !slowMo;
    slowBtn.setAttribute('aria-pressed', String(slowMo));
    engine?.setSlowMo(slowMo);
  });
  soundBtn?.addEventListener('click', () => {
    const next = !audio.isSoundOn();
    audio.setSound(next);
    soundBtn.classList.toggle('active', next);
    soundBtn.textContent = next ? T('Sound: ON') : T('Sound: OFF');
  });
  if (pauseBtn) {
    pauseBtn.textContent = paused ? T('Play') : T('Pause');
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.textContent = paused ? T('Play') : T('Pause');
      engine?.setPaused(paused);
    });
  }

  const dock = $<HTMLElement>('.lp-dock');
  const dockItems = dock?.querySelector<HTMLElement>('.lp-dock-items');
  const dockToggle = dock?.querySelector<HTMLButtonElement>('.lp-dock-toggle');
  if (dock && dockItems && dockToggle) {
    let collapsed = true;
    const toggleLabel = dockToggle.querySelectorAll(':scope > span')[1];
    dockToggle.addEventListener('click', () => {
      collapsed = !collapsed;
      dock.setAttribute('data-collapsed', String(collapsed));
      dockItems.inert = collapsed;
      dockToggle.setAttribute('aria-expanded', String(!collapsed));
      const lbl = collapsed ? T('Show controls') : T('Hide controls');
      dockToggle.setAttribute('aria-label', lbl);
      dockToggle.setAttribute('title', lbl);
      if (toggleLabel) toggleLabel.textContent = collapsed ? T('Show') : T('Hide');
    });
  }

  let mountRaf = 0;
  let tornDown = false;

  const teardown = (): void => {
    if (tornDown) return;
    tornDown = true;
    if (mountRaf) {
      cancelAnimationFrame(mountRaf);
      mountRaf = 0;
    }
    engine?.destroy();
    engine = null;
    audio.destroy();
  };

  mountRaf = requestAnimationFrame(() => {
    mountRaf = 0;
    if (tornDown) return;
    engine = createReactorEngine({
      stage,
      canvas,
      reactorSpace,
      inspDot,
      inspText,
      pulseDot,
      rpsValue,
      statusTag,
      colorProbe,
      tracks,
      lang,
      translate: T,
      audio,
      reducedMotion,
    });
  });

  addEventListener('pagehide', () => teardown(), { once: true });
  return teardown;
}

const landingRoot = document.querySelector<HTMLElement>('.lp-root');
if (landingRoot && !document.documentElement.hasAttribute('data-legacy-redirect')) {
  hydrateLanding(landingRoot);
}
