// Break Room view controller: combines Pomodoro study-timer HUD (synced with stackmastery.study),
// live circular countdown ring, strictly opt-in audio with Lydian end-of-break chime, Flamme's Flower
// Meadow engine with permanent mastery/focus milestone blooms & stars, and one-click Resume CTA.
import { LESSON_INDEX, TRACK_META } from '../../data/manifest.ts';
import { h } from '../dom.ts';
import { getLang, setLang, t as T } from '../i18n.ts';
import { LOGO_SVG, dockControlBar, ico } from '../icons.ts';
import { indexKey } from '../progress.ts';
import { langFromPath, routePath } from '../routes.ts';
import { score, subscribeState, toggleTheme } from '../state.ts';
import type { LastLessonRef, PomodoroPreset, PomodoroState } from '../types.ts';
import { createBreakAudio } from './audio.ts';
import {
  type GlowPreset,
  type MeadowEngineController,
  type MeadowMilestoneInput,
  REALMS,
  type RealmId,
  SPECIES,
  SPELLS,
  type SizePreset,
  type SpeciesId,
  type WindPreset,
  createMeadowEngine,
} from './meadow-engine.ts';
import {
  BREAK_MIN_BOUNDS,
  FOCUS_MIN_BOUNDS,
  createPomodoroController,
  formatClock,
  phaseTotalSec,
  readPomodoroState,
  resetPomodoro,
  setPomodoroPreset,
  skipBreak,
  startBreak,
  togglePomodoro,
} from './pomodoro.ts';

function computeMilestones(study: PomodoroState): MeadowMilestoneInput {
  const masteredTrackIds: string[] = [];
  for (const entry of LESSON_INDEX) {
    if (score(indexKey(entry)) === 3) masteredTrackIds.push(entry.trackId);
  }
  return {
    masteredTrackIds,
    todayCycles: study.cycles.todayCount,
    totalCycles: study.cycles.totalCount,
  };
}

function resumeHref(lastLesson: LastLessonRef | null, lang: 'en' | 'id'): string {
  if (!lastLesson) return routePath(lang, '/dashboard/');
  if (langFromPath(lastLesson.url) === lang) return lastLesson.url;
  return routePath(lang, `/lesson/${lastLesson.trackId}/${lastLesson.lessonId}/`);
}

export function breakView(onCleanup?: (fn: () => void) => void): HTMLElement {
  const LANG = getLang();
  const TRACKS = TRACK_META.map((tr) => ({ id: tr.id, name: (LANG === 'id' && tr.nameId) || tr.name }));
  const totalLessons = LESSON_INDEX.length;
  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const audio = createBreakAudio();
  let engine: MeadowEngineController | null = null;

  let activeRealm: RealmId = 'bluemoon';
  let activeSpecies: SpeciesId = 'all';
  let windPreset: WindPreset = 'breeze';
  let sizePreset: SizePreset = 'lush';
  let glowPreset: GlowPreset = 'radiant';
  let zenAuto = true;
  let hudHidden = true;
  let paused = reducedMotion;

  const nextLang = LANG === 'id' ? 'en' : 'id';
  const nextLangName = LANG === 'id' ? 'English' : 'Bahasa Indonesia';

  const realmBtns: { id: RealmId; btn: HTMLButtonElement }[] = [];
  const mobileRealmBtns: { id: RealmId; btn: HTMLButtonElement }[] = [];

  const setRealm = (id: RealmId): void => {
    if (!REALMS[id]) return;
    activeRealm = id;
    for (const x of realmBtns) x.btn.setAttribute('aria-pressed', String(x.id === id));
    for (const x of mobileRealmBtns) x.btn.setAttribute('aria-pressed', String(x.id === id));
    hintText.textContent = T('Shifted sanctuary to {realm}.', { realm: T(REALMS[id].label) });
    engine?.setRealm(id);
  };

  const makeRealmButtons = (cls: string, store: { id: RealmId; btn: HTMLButtonElement }[]): HTMLButtonElement[] =>
    (Object.values(REALMS) as (typeof REALMS)[RealmId][]).map((r) => {
      const btn = h(
        'button',
        {
          type: 'button',
          class: cls,
          'aria-pressed': String(r.id === activeRealm),
          onclick: () => setRealm(r.id),
        },
        T(r.label),
      );
      store.push({ id: r.id, btn });
      return btn;
    });

  const topResumeLink = h('a', { href: routePath(LANG, '/dashboard/'), class: 'btn lp-cta', 'data-break-top-resume': '' }, T('Return to Study →'));

  const topBar = h(
    'header',
    { class: 'lp-bar br-bar' },
    h('a', { href: routePath(LANG, '/'), class: 'brand' }, h('span', { class: 'logo', html: LOGO_SVG }), 'Stack Mastery'),
    h('div', { class: 'br-realms', role: 'group', 'aria-label': T('Sanctuary realm') }, ...makeRealmButtons('br-realm-btn', realmBtns)),
    h(
      'div',
      { class: 'lp-controls' },
      h(
        'button',
        {
          type: 'button',
          class: 'icon-btn',
          lang: nextLang,
          'aria-label': `${nextLang.toUpperCase()}: ${nextLangName}`,
          title: nextLangName,
          onclick: () => setLang(nextLang),
        },
        nextLang.toUpperCase(),
      ),
      h('button', {
        type: 'button',
        class: 'icon-btn',
        'aria-label': T('Toggle theme'),
        title: T('Toggle theme'),
        onclick: toggleTheme,
        html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
      }),
      topResumeLink,
    ),
  );

  // Flamme lore HUD live counters & species pills (starts hidden; toggled via Show HUD / Hide HUD)
  const bloomStat = h('b', {}, '0');
  const butterflyStat = h('b', {}, '0');
  const spellStat = h('b', {}, '0');
  const masteredStat = h('b', {}, '0');
  const hintText = h('span', {}, T('Sweep to plant wildflowers, hold anywhere to weave a Frieren spell circle.'));

  const speciesBtns = SPECIES.map((sp) => {
    const btn = h(
      'button',
      {
        type: 'button',
        class: 'br-pill',
        style: { '--tc': sp.hex },
        'aria-pressed': String(sp.id === activeSpecies),
        onclick: () => selectSpecies(sp.id),
      },
      h('span', { class: 'br-swatch', 'aria-hidden': 'true' }),
      T(sp.label),
    );
    return { id: sp.id, btn };
  });

  function selectSpecies(id: SpeciesId): void {
    activeSpecies = id;
    for (const x of speciesBtns) x.btn.setAttribute('aria-pressed', String(x.id === id));
    engine?.setSpecies(id);
  }

  const hudCloseBtn = h('button', {
    type: 'button',
    class: 'br-hud-hide',
    'aria-label': T('Hide HUD'),
    title: T('Hide HUD'),
    onclick: () => setHudHidden(true),
    html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  });

  const hud = h(
    'div',
    { class: 'br-hud' },
    h('div', { class: 'br-hud-top' }, h('h1', {}, T('A field of flowers, cast by hand.')), hudCloseBtn),
    h(
      'p',
      { class: 'br-lede' },
      T('Take a breath in Flamme’s sanctuary. Paint glowing blooms across the hills, summon 50-year meteors, or let Zen Auto-Bloom carry your break.'),
    ),
    h('div', { class: 'br-mobile-realms', role: 'group', 'aria-label': T('Sanctuary realm') }, ...makeRealmButtons('br-pill', mobileRealmBtns)),
    h('div', { class: 'br-species-row', role: 'group', 'aria-label': T('Flower species') }, ...speciesBtns.map((x) => x.btn)),
    h(
      'div',
      { class: 'br-telemetry' },
      h('span', {}, bloomStat, ' ', T('blooms')),
      h('span', {}, butterflyStat, ' ', T('butterflies')),
      h('span', {}, spellStat, ' ', T('spells')),
      h('span', {}, masteredStat, '/', String(totalLessons), ' ', T('mastered')),
    ),
  );

  // Break Room Pomodoro Timer Panel (visible by default over the sanctuary canvas)
  const RING_R = 46;
  const RING_C = 2 * Math.PI * RING_R;
  const ringWrap = h('div', {
    class: 'br-ring-wrap',
    html: `<svg class="br-ring-svg" viewBox="0 0 112 112" role="img" aria-label="${T('Study timer')} 05:00"><circle cx="56" cy="56" r="${RING_R}" class="br-ring-bg"/><circle cx="56" cy="56" r="${RING_R}" class="br-ring-fg" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="0" transform="rotate(-90 56 56)"/><text x="56" y="54" text-anchor="middle" class="br-ring-time">05:00</text><text x="56" y="72" text-anchor="middle" class="br-ring-phase">${T('Ready')}</text></svg>`,
  });
  const ringSvg = ringWrap.querySelector('svg');
  const ringFg = ringWrap.querySelector<SVGCircleElement>('.br-ring-fg');
  const ringTimeText = ringWrap.querySelector<SVGTextElement>('.br-ring-time');
  const ringPhaseText = ringWrap.querySelector<SVGTextElement>('.br-ring-phase');

  const timerPhaseBadge = h('span', { class: 'br-timer-badge', 'data-break-phase': '' }, T('Ready'));
  const timerCyclesBadge = h('span', { class: 'br-timer-cycles', 'data-break-cycles': '' }, T('{n} cycles today', { n: 0 }));

  const timerToggleBtn = h(
    'button',
    {
      type: 'button',
      class: 'btn sm',
      'data-break-toggle': '',
      onclick: () => {
        const cur = readPomodoroState();
        if (cur.phase === 'idle' && !cur.running) {
          startBreak();
        } else {
          togglePomodoro();
        }
      },
    },
    T('Start break'),
  );

  const timerResetBtn = h(
    'button',
    {
      type: 'button',
      class: 'btn sm ghost',
      'data-break-reset': '',
      onclick: () => resetPomodoro(),
    },
    T('Reset'),
  );

  const timerSkipBtn = h(
    'button',
    {
      type: 'button',
      class: 'btn sm ghost',
      'data-break-skip': '',
      hidden: true,
      onclick: () => {
        skipBreak();
        timerStatus.textContent = '';
      },
    },
    T('Skip break'),
  );

  const presetDefs: readonly [PomodoroPreset, string][] = [
    ['25/5', '25/5'],
    ['50/10', '50/10'],
    ['custom', 'Custom'],
  ];
  const presetBtns = presetDefs.map(([id, label]) => {
    const btn = h(
      'button',
      {
        type: 'button',
        class: 'br-pill',
        'data-break-preset': id,
        'aria-pressed': 'false',
        onclick: () => {
          if (id === 'custom') {
            setPomodoroPreset('custom', Number(customFocusInput.value), Number(customBreakInput.value));
          } else {
            setPomodoroPreset(id);
          }
        },
      },
      id === 'custom' ? T(label) : label,
    );
    return { id, btn };
  });

  const customFocusInput = h('input', {
    type: 'number',
    min: String(FOCUS_MIN_BOUNDS.min),
    max: String(FOCUS_MIN_BOUNDS.max),
    value: '25',
    class: 'br-num-input',
    'data-break-focus-min': '',
    onchange: () => setPomodoroPreset('custom', Number(customFocusInput.value), Number(customBreakInput.value)),
  });
  const customBreakInput = h('input', {
    type: 'number',
    min: String(BREAK_MIN_BOUNDS.min),
    max: String(BREAK_MIN_BOUNDS.max),
    value: '5',
    class: 'br-num-input',
    'data-break-break-min': '',
    onchange: () => setPomodoroPreset('custom', Number(customFocusInput.value), Number(customBreakInput.value)),
  });
  const customRow = h(
    'div',
    { class: 'br-custom-row', 'data-break-custom': '', hidden: true },
    h('label', { class: 'br-num-label' }, h('span', {}, T('Focus (min)')), customFocusInput),
    h('label', { class: 'br-num-label' }, h('span', {}, T('Break (min)')), customBreakInput),
  );

  const milestoneSummary = h('p', { class: 'br-milestone-chip', 'data-break-milestones': '' });
  const timerStatus = h('p', { class: 'br-timer-status', role: 'status', 'aria-live': 'polite', 'data-break-status': '' });
  const resumeCta = h(
    'a',
    {
      href: routePath(LANG, '/dashboard/'),
      class: 'btn br-resume-cta',
      'data-break-resume': '',
    },
    T('Return to Study →'),
  );

  const timerPanel = h(
    'section',
    { class: 'br-timer-panel', 'aria-label': T('Break timer') },
    h('div', { class: 'br-timer-head' }, timerPhaseBadge, timerCyclesBadge),
    h(
      'div',
      { class: 'br-timer-main' },
      ringWrap,
      h(
        'div',
        { class: 'br-timer-body' },
        h('div', { class: 'br-timer-actions' }, timerToggleBtn, timerResetBtn, timerSkipBtn),
        h('div', { class: 'br-preset-row', role: 'group', 'aria-label': T('Study timer presets') }, ...presetBtns.map((x) => x.btn)),
        customRow,
      ),
    ),
    milestoneSummary,
    timerStatus,
    resumeCta,
  );

  const inspector = h(
    'div',
    { class: 'br-hint-pill', 'aria-live': 'polite' },
    h('span', { class: 'br-hint-dot', 'aria-hidden': 'true' }),
    hintText,
  );

  const sideColumn = h('div', { class: 'br-side-col' }, timerPanel, inspector);

  // Bottom console dock (opt-in audio starts at Music: OFF / Sound: OFF)
  const zenBtn = h(
    'button',
    {
      type: 'button',
      class: 'lp-toy',
      'aria-pressed': String(zenAuto),
      onclick: () => {
        zenAuto = !zenAuto;
        zenBtn.setAttribute('aria-pressed', String(zenAuto));
        engine?.setZenAuto(zenAuto);
      },
    },
    T('Zen Auto-Bloom'),
  );

  const musicBtn = h(
    'button',
    {
      type: 'button',
      class: 'lp-toy',
      onclick: () => {
        const next = !audio.isMusicOn();
        audio.setMusic(next);
        musicBtn.classList.toggle('active', next);
        musicBtn.textContent = next ? T('Music: ON') : T('Music: OFF');
      },
    },
    T('Music: OFF'),
  );

  const soundBtn = h(
    'button',
    {
      type: 'button',
      class: 'lp-toy',
      onclick: () => {
        const next = !audio.isSoundOn();
        audio.setSound(next);
        soundBtn.classList.toggle('active', next);
        soundBtn.textContent = next ? T('Sound: ON') : T('Sound: OFF');
      },
    },
    T('Sound: OFF'),
  );

  const hudBtn = h(
    'button',
    {
      type: 'button',
      class: 'lp-toy active',
      onclick: () => setHudHidden(!hudHidden),
    },
    T('Show HUD'),
  );

  const pauseBtn = h(
    'button',
    {
      type: 'button',
      class: 'lp-toy',
      onclick: () => {
        paused = !paused;
        pauseBtn.textContent = paused ? T('Play') : T('Pause');
        engine?.setPaused(paused);
      },
    },
    paused ? T('Play') : T('Pause'),
  );

  const dock = dockControlBar(
    T('Flower magic controls'),
    'br-dock',
    h(
      'button',
      {
        type: 'button',
        class: 'lp-toy',
        onclick: () => {
          engine?.castGrandBloom();
          hintText.textContent = T('Flamme’s Grand Field of Flowers bloomed across the hillside!');
        },
      },
      T('Grand Bloom'),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'lp-toy',
        onclick: () => {
          engine?.castMeteorShower();
          hintText.textContent = T('The 50-Year Era Meteor Shower arcs across the sky.');
        },
      },
      T('Meteor Shower'),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'lp-toy',
        onclick: () => {
          engine?.releaseButterflies(8);
          hintText.textContent = T('A kaleidoscope of mana butterflies took flight.');
        },
      },
      T('Butterfly Flock'),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'lp-toy',
        onclick: () => {
          engine?.triggerWindGale();
          hintText.textContent = T('A gentle alpine wind swept across the blossoms.');
        },
      },
      T('Gentle Gale'),
    ),
    zenBtn,
    h(
      'button',
      {
        type: 'button',
        class: 'lp-toy',
        onclick: () => {
          engine?.clearMeadow();
          hintText.textContent = T('Petals carried away on the wind—the hillside awaits new magic.');
        },
      },
      T('Clear Meadow'),
    ),
    h('span', { class: 'lp-dock-sep', 'aria-hidden': 'true' }),
    musicBtn,
    soundBtn,
    hudBtn,
    pauseBtn,
  );

  const canvas = h('canvas', { class: 'br-canvas', 'aria-hidden': 'true' });
  const stage = h(
    'section',
    { class: 'br-stage', 'data-casting': 'false', 'data-hud-hidden': 'true' },
    canvas,
    h('div', { class: 'br-stage-grid' }, hud, sideColumn),
    dock,
  );
  hud.inert = true;
  inspector.inert = true;

  function setHudHidden(val: boolean): void {
    hudHidden = !!val;
    if (hudHidden && (hud.contains(document.activeElement) || inspector.contains(document.activeElement))) {
      hudBtn.focus({ preventScroll: true });
    }
    stage.setAttribute('data-hud-hidden', String(hudHidden));
    hud.inert = hudHidden;
    inspector.inert = hudHidden;
    hudBtn.textContent = hudHidden ? T('Show HUD') : T('Hide HUD');
    hudBtn.classList.toggle('active', hudHidden);
  }

  const unlockMusicOnGesture = (): void => {
    audio.unlockOnGesture();
  };

  const onKey = (e: KeyboardEvent): void => {
    unlockMusicOnGesture();
    const target = e.target as HTMLElement | null;
    if (
      (e.key === 'h' || e.key === 'H') &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !target?.closest('input, textarea, select, [contenteditable]')
    ) {
      setHudHidden(!hudHidden);
    }
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('pointerdown', unlockMusicOnGesture, { passive: true });

  const scrollToStage = (): void => {
    stage.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // Below-the-fold Folk Magic Grimoire Compendium
  const grimoireBand = h(
    'section',
    { class: 'lp-band br-grimoire-band' },
    h(
      'div',
      { class: 'lp-band-head' },
      h(
        'div',
        {},
        h('h2', {}, T('Folk Magic Grimoire')),
        h(
          'p',
          { class: 'lp-band-sub' },
          T('Spells gathered along the northern road—each blends light, botanical geometry, and wind across the meadow above.'),
        ),
      ),
      h('button', { type: 'button', class: 'btn ghost', onclick: scrollToStage }, T('Return to Meadow ↑')),
    ),
    h(
      'div',
      { class: 'br-spells-grid' },
      SPELLS.map((sp) =>
        h(
          'article',
          { class: 'br-spell-card', style: { '--tc': sp.tc } },
          h('div', { class: 'br-spell-head' }, h('h3', {}, T(sp.title)), h('span', { class: 'br-spell-tag' }, T(sp.tag))),
          h('p', {}, T(sp.desc)),
          h(
            'div',
            { class: 'br-spell-foot' },
            h(
              'button',
              {
                type: 'button',
                class: 'btn sm ghost',
                onclick: () => {
                  setRealm(sp.realm);
                  selectSpecies(sp.species);
                  scrollToStage();
                  if (sp.id === 'era-meteors') engine?.castMeteorShower();
                  else if (sp.id === 'fern-butterflies') {
                    engine?.releaseButterflies(12);
                    engine?.castGrandBloom();
                  } else if (sp.id === 'aureole-ruins') {
                    engine?.triggerWindGale();
                    engine?.castGrandBloom();
                  } else engine?.castGrandBloom();
                },
              },
              T('Cast in Meadow ↑'),
            ),
          ),
        ),
      ),
    ),
  );

  // Alchemical Spell Tuning & 10-Track Resonance
  const makeTuneGroup = <V extends string>(
    label: string,
    options: readonly [V, string][],
    getCur: () => V,
    onPick: (v: V) => void,
  ): HTMLElement => {
    const btns: { id: V; b: HTMLButtonElement }[] = [];
    return h(
      'div',
      { class: 'br-tune-row' },
      h('span', { class: 'br-tune-label' }, T(label)),
      h(
        'div',
        { class: 'br-tune-group', role: 'group', 'aria-label': T(label) },
        options.map(([id, text]) => {
          const b = h(
            'button',
            {
              type: 'button',
              class: 'br-pill',
              'aria-pressed': String(getCur() === id),
              onclick: () => {
                onPick(id);
                for (const x of btns) x.b.setAttribute('aria-pressed', String(x.id === id));
              },
            },
            T(text),
          );
          btns.push({ id, b });
          return b;
        }),
      ),
    );
  };

  const alchemyBand = h(
    'section',
    { class: 'br-alchemy-band' },
    h(
      'div',
      { class: 'lp-band' },
      h(
        'div',
        { class: 'lp-band-head' },
        h(
          'div',
          {},
          h('h2', {}, T('Spell Alchemist & Stack Resonance')),
          h(
            'p',
            { class: 'lp-band-sub' },
            T('Tune wind currents, petal scale, and bioluminescence, or channel any of your 10 learning tracks into a matching flower bloom.'),
          ),
        ),
      ),
      h(
        'div',
        { class: 'br-alchemy-grid' },
        h(
          'div',
          { class: 'lp-panel' },
          h('h3', {}, T('Botanical & Wind Parameters')),
          h(
            'div',
            { class: 'br-tune-list' },
            makeTuneGroup<WindPreset>(
              'Wind Breeze',
              [
                ['calm', 'Calm'],
                ['breeze', 'Breeze'],
                ['gale', 'Gale'],
              ],
              () => windPreset,
              (v) => {
                windPreset = v;
                engine?.setWindPreset(v);
              },
            ),
            makeTuneGroup<SizePreset>(
              'Bloom Scale',
              [
                ['delicate', 'Delicate'],
                ['lush', 'Lush'],
                ['giant', 'Giant'],
              ],
              () => sizePreset,
              (v) => {
                sizePreset = v;
                engine?.setSizePreset(v);
              },
            ),
            makeTuneGroup<GlowPreset>(
              'Mana Glow',
              [
                ['soft', 'Soft'],
                ['radiant', 'Radiant'],
              ],
              () => glowPreset,
              (v) => {
                glowPreset = v;
                engine?.setGlowPreset(v);
              },
            ),
          ),
        ),
        h(
          'div',
          { class: 'lp-panel' },
          h('h3', {}, T('10-Track Mana Resonance')),
          h(
            'p',
            {},
            T('Select any track to cast a burst of flowers tinted in its domain hue—turning your study journey into a living garden.'),
          ),
          h(
            'div',
            { class: 'br-track-garden' },
            TRACKS.map((tr) =>
              h(
                'button',
                {
                  type: 'button',
                  class: 'br-track-seed',
                  style: { '--tc': `var(--${tr.id})` },
                  onclick: () => {
                    scrollToStage();
                    engine?.castTrackBurst(tr.id);
                    hintText.textContent = T('{name} mana resonated into 18 new blooms.', { name: tr.name });
                  },
                },
                ico(tr.id, 'nav-ico'),
                tr.name,
              ),
            ),
          ),
        ),
      ),
    ),
  );

  const closeBand = h(
    'section',
    { class: 'lp-band lp-close' },
    h('h2', {}, T('Ready to return to your journey?')),
    h(
      'p',
      {},
      T('Like Frieren’s unhurried travels, mastery compounds across steady seasons. Take what calm you need and step back in anytime.'),
    ),
    h(
      'div',
      { class: 'lp-actions' },
      h('a', { class: 'btn', href: routePath(LANG, '/dashboard/') }, T('Return to Study →')),
      h('a', { class: 'btn ghost', href: routePath(LANG, '/lab/') }, T('Explore 40 Live Labs')),
    ),
  );

  const root = h('div', { class: 'lp-root br-root' }, topBar, stage, grimoireBand, alchemyBand, closeBand);

  // Sync Pomodoro timer HUD + Resume CTA + Permanent Milestone Blooms/Stars
  let lastMilestoneSig = '';
  const syncMilestonesFromState = (study: PomodoroState): void => {
    const ms = computeMilestones(study);
    masteredStat.textContent = String(ms.masteredTrackIds.length);
    milestoneSummary.textContent = T('{mastered} mastery blooms · {cycles} focus cycles today', {
      mastered: ms.masteredTrackIds.length,
      cycles: ms.todayCycles,
    });
    const sig = `${ms.masteredTrackIds.join(',')}|${ms.todayCycles}|${ms.totalCycles}`;
    if (sig !== lastMilestoneSig) {
      lastMilestoneSig = sig;
      engine?.syncMilestones(ms);
    }
  };

  const renderTimer = (state: PomodoroState, remainingSec: number): void => {
    const displaySec = state.phase === 'idle' ? state.breakMin * 60 : remainingSec;
    const totalSec = state.phase === 'idle' ? state.breakMin * 60 : Math.max(1, phaseTotalSec(state));
    const pct = Math.max(0, Math.min(1, displaySec / totalSec));
    const clock = formatClock(displaySec);
    const phaseLabel = state.phase === 'focus' ? T('Focus') : state.phase === 'break' ? T('Break') : T('Ready');

    if (ringTimeText) ringTimeText.textContent = clock;
    if (ringPhaseText) ringPhaseText.textContent = phaseLabel;
    if (ringFg) ringFg.setAttribute('stroke-dashoffset', (RING_C * (1 - pct)).toFixed(2));
    if (ringSvg) ringSvg.setAttribute('aria-label', `${T('Break timer')}: ${phaseLabel} ${clock}`);
    timerPanel.setAttribute('data-phase', state.phase);

    timerPhaseBadge.textContent = phaseLabel;
    timerCyclesBadge.textContent = T('{n} cycles today', { n: state.cycles.todayCount });

    timerToggleBtn.textContent = state.running ? T('Pause') : state.phase === 'focus' ? T('Start') : T('Start break');
    timerSkipBtn.hidden = state.phase !== 'break';

    for (const x of presetBtns) {
      x.btn.setAttribute('aria-pressed', String(x.id === state.preset));
    }
    customRow.hidden = state.preset !== 'custom';
    if (document.activeElement !== customFocusInput) customFocusInput.value = String(state.focusMin);
    if (document.activeElement !== customBreakInput) customBreakInput.value = String(state.breakMin);

    const targetUrl = resumeHref(state.lastLesson, LANG);
    const ctaText = state.lastLesson ? T('Resume: {title} →', { title: state.lastLesson.title }) : T('Return to Study →');
    resumeCta.href = targetUrl;
    resumeCta.textContent = ctaText;
    topResumeLink.href = targetUrl;
    topResumeLink.textContent = ctaText;

    syncMilestonesFromState(state);
  };

  const pomodoro = createPomodoroController({
    onUpdate: (state, remainingSec) => renderTimer(state, remainingSec),
    onComplete: (ev) => {
      if (ev.completedPhase === 'break') {
        audio.playEndOfBreakChime();
        timerStatus.textContent = T('Break complete — ready for your next focus session.');
      } else if (ev.completedPhase === 'focus') {
        timerStatus.textContent = T('Focus block complete — start your {min}-minute break.', { min: ev.state.breakMin });
      }
    },
  });

  const unsubState = subscribeState(() => {
    syncMilestonesFromState(readPomodoroState());
  });

  let mountRaf = 0;
  let tornDown = false;
  const teardown = (): void => {
    if (tornDown) return;
    tornDown = true;
    if (mountRaf) {
      cancelAnimationFrame(mountRaf);
      mountRaf = 0;
    }
    pomodoro.destroy();
    unsubState();
    engine?.destroy();
    engine = null;
    audio.destroy();
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('pointerdown', unlockMusicOnGesture);
    window.removeEventListener('pagehide', teardown);
  };

  mountRaf = requestAnimationFrame(() => {
    mountRaf = 0;
    if (tornDown) return;
    const initialStudy = readPomodoroState();
    engine = createMeadowEngine({
      stage,
      canvas,
      audio,
      reducedMotion,
      initialRealm: activeRealm,
      initialMilestones: computeMilestones(initialStudy),
      onStats: (st) => {
        bloomStat.textContent = String(st.blooms);
        butterflyStat.textContent = String(st.butterflies);
        spellStat.textContent = String(st.spells);
      },
    });
  });

  window.addEventListener('pagehide', teardown);
  onCleanup?.(teardown);
  return root;
}
