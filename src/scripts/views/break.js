// Frieren-Inspired Flower Magic Break Room (#/break, #/meadow)
import { ico, dockControlBar } from '../icons.js';
import { toggleTheme, allLessons, score } from '../state.js';

const LOGO_SVG = `<svg viewBox="0 0 128 128" fill="none" aria-hidden="true"><rect width="128" height="128" rx="14" fill="#06090f"/><rect x="6" y="6" width="116" height="116" rx="10" stroke="#1e293b" stroke-width="3" fill="#090d16"/><path d="M6 18 H20 M18 6 V20 M122 18 H108 M110 6 V20 M6 110 H20 M18 122 V108 M122 110 H108 M110 122 V108" stroke="#38bdf8" stroke-width="3"/><path d="M26 44 L44 64 L26 84" stroke="#38bdf8" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/><path d="M54 84 V44 L75 67 L96 44 V84" stroke="#f8fafc" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/><circle cx="106" cy="84" r="4.5" fill="#38bdf8"/></svg>`;

const REALMS = {
  alpine: {
    id: 'alpine',
    label: 'Alpine Day',
    sky: [[66, 146, 224], [146, 212, 246], [234, 248, 238]],
    hills: [[84, 148, 114], [48, 112, 82], [26, 78, 54]],
    grass: ['#3c9460', '#7fd48c'],
    sun: [0.78, 0.22],
    sunColor: [255, 244, 198],
    aurora: 0,
    stars: 0,
    moon: 0,
    ruins: 0,
    clouds: 1,
    rays: 0.20,
    glow: 0.28
  },
  dusk: {
    id: 'dusk',
    label: 'Golden Dusk',
    sky: [[36, 26, 72], [164, 74, 112], [244, 166, 108]],
    hills: [[68, 44, 78], [46, 30, 58], [26, 18, 38]],
    grass: ['#57406b', '#b87b7a'],
    sun: [0.74, 0.54],
    sunColor: [255, 206, 128],
    aurora: 0.12,
    stars: 0.35,
    moon: 0,
    ruins: 0,
    clouds: 0.55,
    rays: 0.26,
    glow: 0.52
  },
  bluemoon: {
    id: 'bluemoon',
    label: 'Blue-Moon Night',
    sky: [[5, 9, 24], [12, 28, 64], [22, 58, 96]],
    hills: [[20, 44, 74], [13, 30, 52], [8, 18, 34]],
    grass: ['#194262', '#4298c8'],
    sun: [0.79, 0.21],
    sunColor: [204, 238, 255],
    aurora: 1,
    stars: 1,
    moon: 1,
    ruins: 0,
    clouds: 0,
    rays: 0.08,
    glow: 0.92
  },
  aureole: {
    id: 'aureole',
    label: 'Aureole Dawn',
    sky: [[38, 32, 78], [110, 88, 158], [242, 206, 232]],
    hills: [[48, 66, 92], [32, 46, 68], [18, 28, 44]],
    grass: ['#305f78', '#84bad2'],
    sun: [0.76, 0.27],
    sunColor: [248, 232, 255],
    aurora: 0.45,
    stars: 0.55,
    moon: 0.42,
    ruins: 1,
    clouds: 0.4,
    rays: 0.18,
    glow: 0.72
  }
};

const SPECIES = [
  { id: 'all', label: 'Grimoire Mix', hex: '#8b95ff', petals: ['#38bdf8', '#f472b6', '#fde047', '#a78bfa'], core: '#fef08a' },
  { id: 'sogetsuso', label: 'Blue-Moon Weed', hex: '#38bdf8', petals: ['#38bdf8', '#60a5fa', '#bae6fd'], core: '#fef08a' },
  { id: 'flamme', label: 'Flamme Clover', hex: '#fb7185', petals: ['#fb7185', '#f43f5e', '#ffe4e6'], core: '#fde047' },
  { id: 'zoltraak', label: 'Astral Lily', hex: '#a78bfa', petals: ['#a78bfa', '#818cf8', '#e0e7ff'], core: '#67e8f9' },
  { id: 'fern', label: 'Butterfly Orchid', hex: '#e879f9', petals: ['#e879f9', '#c026d3', '#fae8ff'], core: '#f9a8d4' },
  { id: 'suniris', label: 'Hero Cosmos', hex: '#f59e0b', petals: ['#fbbf24', '#fb923c', '#fef08a'], core: '#fffbeb' }
];

const SPECIES_MAP = Object.fromEntries(SPECIES.map(s => [s.id, s]));

const SPELLS = [
  {
    id: 'flamme-field',
    title: 'Field of Flowers',
    tag: 'Flamme · Folk Magic',
    species: 'flamme',
    realm: 'alpine',
    tc: 'var(--cs)',
    desc: 'Flamme’s lifelong favorite spell: turns bare earth into an endless hillside of crimson clovers and warm wildflowers with one sweeping staff arc.'
  },
  {
    id: 'himmel-sogetsuso',
    title: 'Blue-Moon Weed Bloom',
    tag: 'Himmel · Memory',
    species: 'sogetsuso',
    realm: 'bluemoon',
    tc: 'var(--react)',
    desc: 'Awakens translucent Sōgetsu-sō blossoms that shine like starlight under the aurora, honoring the hero party’s promise across decades.'
  },
  {
    id: 'era-meteors',
    title: '50-Year Era Meteors',
    tag: 'Celestial · Rare',
    species: 'sogetsuso',
    realm: 'bluemoon',
    tc: 'var(--accent)',
    desc: 'Summons the half-century meteor shower across the night sky; drifting stardust sparks descend onto the hills and sprout luminous blooms.'
  },
  {
    id: 'fern-butterflies',
    title: 'Mana Butterfly Whisper',
    tag: 'Fern · Grace',
    species: 'fern',
    realm: 'aureole',
    tc: 'var(--angular)',
    desc: 'Calls a swirling kaleidoscope of amethyst mana butterflies that settle gently on open petals and dance whenever your cursor passes.'
  },
  {
    id: 'aureole-ruins',
    title: 'Aureole Horizon Wind',
    tag: 'Ende · Sanctuary',
    species: 'zoltraak',
    realm: 'aureole',
    tc: 'var(--csharp)',
    desc: 'Shifts the sanctuary to Aureole’s misty dawn ruins and sends a soft prism gale rippling through every grass blade and astral lily.'
  },
  {
    id: 'hero-sunset',
    title: 'Golden Journey’s Rest',
    tag: 'Evening · Warmth',
    species: 'suniris',
    realm: 'dusk',
    tc: 'var(--sql)',
    desc: 'Bathes the meadow in amber twilight while warm Hero Cosmos petals and dandelion wish seeds drift peacefully across the ridge.'
  }
];

const LYDIAN_CHIMES = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00, 987.77, 1174.66];

// Nostalgic 8-bar Frieren-inspired folk progression in D major / B minor (warm chamber pad + Celtic harp + flute)
const CHORD_PROG = [
  { // Bar 1: Gmaj7
    pad: [196.00, 293.66, 369.99],
    arp: [196.00, 293.66, 369.99, 493.88, 587.33, 493.88, 369.99, 293.66],
    melody: [587.33, 0, 659.25, 0, 739.99, 0, 587.33, 0]
  },
  { // Bar 2: Asus4 -> A
    pad: [220.00, 293.66, 329.63],
    arp: [220.00, 329.63, 440.00, 554.37, 659.25, 554.37, 440.00, 329.63],
    melody: [659.25, 0, 0, 587.33, 554.37, 0, 440.00, 0]
  },
  { // Bar 3: Bm7
    pad: [246.94, 293.66, 369.99],
    arp: [246.94, 369.99, 440.00, 587.33, 739.99, 587.33, 440.00, 369.99],
    melody: [493.88, 0, 587.33, 0, 739.99, 0, 880.00, 0]
  },
  { // Bar 4: F#m7
    pad: [185.00, 277.18, 329.63],
    arp: [185.00, 277.18, 369.99, 440.00, 554.37, 440.00, 369.99, 277.18],
    melody: [739.99, 0, 0, 659.25, 554.37, 0, 440.00, 0]
  },
  { // Bar 5: Gmaj9
    pad: [196.00, 246.94, 329.63],
    arp: [196.00, 293.66, 369.99, 440.00, 587.33, 493.88, 440.00, 293.66],
    melody: [493.88, 0, 587.33, 659.25, 739.99, 0, 987.77, 0]
  },
  { // Bar 6: Dadd9 / F#
    pad: [185.00, 293.66, 329.63],
    arp: [185.00, 293.66, 369.99, 440.00, 659.25, 587.33, 440.00, 369.99],
    melody: [880.00, 0, 739.99, 0, 659.25, 0, 587.33, 0]
  },
  { // Bar 7: Em7
    pad: [164.81, 246.94, 293.66],
    arp: [164.81, 246.94, 329.63, 392.00, 493.88, 587.33, 493.88, 392.00],
    melody: [493.88, 0, 587.33, 0, 659.25, 0, 587.33, 0]
  },
  { // Bar 8: A6 -> D resolution
    pad: [220.00, 277.18, 369.99],
    arp: [220.00, 329.63, 440.00, 554.37, 587.33, 440.00, 369.99, 329.63],
    melody: [554.37, 0, 587.33, 0, 659.25, 0, 587.33, 0]
  }
];

const TRACK_COLORS = {
  csharp: '#a78bfa',
  aspnet: '#818cf8',
  go: '#22d3ee',
  sql: '#f5b955',
  css: '#2dd4bf',
  react: '#38bdf8',
  angular: '#f472b6',
  flutter: '#60a5fa',
  cs: '#fb7185',
  sysdesign: '#fb923c'
};

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rgbStr = (arr, a = 1) => `rgba(${Math.round(arr[0])}, ${Math.round(arr[1])}, ${Math.round(arr[2])}, ${a})`;

export function breakView(onCleanup) {
  const { h, t: T, TRACKS, LANG, setLang } = window;
  const allL = allLessons();
  const masteredCount = allL.filter(e => score(e.k) === 3).length;
  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeRealm = 'bluemoon';
  let activeSpecies = 'all';
  let windPreset = 'breeze';
  let sizePreset = 'lush';
  let glowPreset = 'radiant';
  let zenAuto = true;
  let soundOn = false;
  let musicOn = false;   // audio is opt-in: nothing plays until the learner presses Music
  let hudHidden = true;
  let paused = reducedMotion;

  let bloomCount = 0;
  let butterflyCount = 0;
  let spellCount = 0;

  let audioCtx = null;
  let voiceCount = 0;
  let musicTimer = 0;
  let musicStep = 0;
  let musicBus = null;

  const ensureAudio = (resume = false) => {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (resume && audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => { });
    return audioCtx;
  };

  const ensureMusicBus = ctx => {
    if (musicBus) return musicBus;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1750, ctx.currentTime);
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.34, ctx.currentTime);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.26, ctx.currentTime);
    const wet = ctx.createGain();
    wet.gain.setValueAtTime(0.32, ctx.currentTime);

    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);
    musicBus = { master, filter };
    return musicBus;
  };

  const playPadChord = freqs => {
    const ctx = ensureAudio();
    if (!ctx || !musicOn) return;
    const bus = ensureMusicBus(ctx);
    const now = ctx.currentTime;
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      sub.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      sub.frequency.setValueAtTime(freq * 1.002, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.036, now + 1.1);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
      const subG = ctx.createGain();
      subG.gain.setValueAtTime(0.25, now);
      osc.connect(g);
      sub.connect(subG);
      subG.connect(g);
      g.connect(bus.filter);
      osc.start(now);
      sub.start(now);
      osc.stop(now + 3.5);
      sub.stop(now + 3.5);
    });
  };

  const playHarpPluck = freq => {
    const ctx = ensureAudio();
    if (!ctx || !musicOn) return;
    const bus = ensureMusicBus(ctx);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const g = ctx.createGain();
    const og = ctx.createGain();
    osc.type = 'triangle';
    overtone.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    overtone.frequency.setValueAtTime(freq * 2, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.048, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    og.gain.setValueAtTime(0.22, now);
    osc.connect(g);
    overtone.connect(og);
    og.connect(g);
    g.connect(bus.filter);
    osc.start(now);
    overtone.start(now);
    osc.stop(now + 1.2);
    overtone.stop(now + 1.2);
  };

  const playFluteNote = freq => {
    const ctx = ensureAudio();
    if (!ctx || !musicOn) return;
    const bus = ensureMusicBus(ctx);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    vib.type = 'sine';
    vib.frequency.setValueAtTime(5.2, now);
    vibGain.gain.setValueAtTime(3.4, now);
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.044, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.96);
    osc.connect(g);
    g.connect(bus.filter);
    osc.start(now);
    vib.start(now);
    osc.stop(now + 1.0);
    vib.stop(now + 1.0);
  };

  const stepMusic = () => {
    if (!musicOn || document.hidden) return;
    const ctx = ensureAudio(false);
    if (!ctx || ctx.state !== 'running') return;
    const barIdx = Math.floor(musicStep / 8) % CHORD_PROG.length;
    const beat = musicStep % 8;
    const bar = CHORD_PROG[barIdx];
    try {
      if (beat === 0) playPadChord(bar.pad);
      playHarpPluck(bar.arp[beat]);
      const mel = bar.melody[beat];
      if (mel > 0) playFluteNote(mel);
    } catch { /* ignore audio errors */ }
    musicStep = (musicStep + 1) % (CHORD_PROG.length * 8);
  };

  const startMusic = (fromGesture = false) => {
    const ctx = ensureAudio(fromGesture);
    if (!ctx) return;
    const bus = ensureMusicBus(ctx);
    bus.master.gain.cancelScheduledValues(ctx.currentTime);
    bus.master.gain.setValueAtTime(Math.max(0.0001, bus.master.gain.value), ctx.currentTime);
    bus.master.gain.linearRampToValueAtTime(0.95, ctx.currentTime + 0.6);
    if (musicTimer) clearInterval(musicTimer);
    stepMusic();
    musicTimer = setInterval(stepMusic, 380);
  };

  const stopMusic = () => {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = 0;
    }
    if (audioCtx && musicBus) {
      try {
        const now = audioCtx.currentTime;
        musicBus.master.gain.cancelScheduledValues(now);
        musicBus.master.gain.setValueAtTime(Math.max(0.0001, musicBus.master.gain.value), now);
        musicBus.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      } catch { /* ignore */ }
    }
  };

  const playCelesta = (idx, gainVal = 0.04, duration = 0.85) => {
    if (!soundOn || voiceCount >= 8) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const freq = LYDIAN_CHIMES[Math.abs(idx) % LYDIAN_CHIMES.length];
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      voiceCount++;
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.22, now);
      osc1.connect(gain);
      osc2.connect(subGain);
      subGain.connect(gain);
      gain.connect(ctx.destination);
      osc1.onended = () => { voiceCount = Math.max(0, voiceCount - 1); };
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.02);
      osc2.stop(now + duration + 0.02);
    } catch {
      voiceCount = Math.max(0, voiceCount - 1);
    }
  };

  const playChord = (baseIdx = 0) => {
    [0, 2, 4, 6].forEach((offset, k) => {
      setTimeout(() => playCelesta(baseIdx + offset, 0.032, 1.15), k * 75);
    });
  };

  const nextLang = LANG === 'id' ? 'en' : 'id';
  const nextLangName = LANG === 'id' ? 'English' : 'Bahasa Indonesia';

  // Engine hooks filled once canvas initializes
  let setRealm = () => { };
  let castGrandBloom = () => { };
  let castMeteorShower = () => { };
  let releaseButterflies = () => { };
  let triggerWindGale = () => { };
  let clearMeadow = () => { };
  let castTrackBurst = () => { };
  let syncPause = () => { };

  const realmBtns = [];
  const mobileRealmBtns = [];
  const makeRealmButtons = (cls, store) => Object.values(REALMS).map(r => {
    const btn = h('button', {
      type: 'button',
      class: cls,
      'aria-pressed': String(r.id === activeRealm),
      onclick: () => setRealm(r.id)
    }, T(r.label));
    store.push({ id: r.id, btn });
    return btn;
  });

  const topBar = h('header', { class: 'lp-bar br-bar' },
    h('a', { href: '#/', class: 'brand' }, h('span', { class: 'logo', html: LOGO_SVG }), 'Stack Mastery'),
    h('div', { class: 'br-realms', role: 'group', 'aria-label': T('Sanctuary realm') }, ...makeRealmButtons('br-realm-btn', realmBtns)),
    h('div', { class: 'lp-controls' },
      h('button', { type: 'button', class: 'icon-btn', lang: nextLang, 'aria-label': `${nextLang.toUpperCase()}: ${nextLangName}`, title: nextLangName, onclick: () => setLang(nextLang) }, nextLang.toUpperCase()),
      h('button', {
        type: 'button', class: 'icon-btn', 'aria-label': T('Toggle theme'), title: T('Toggle theme'),
        onclick: toggleTheme,
        html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>'
      }),
      h('a', { href: '#/dashboard', class: 'btn lp-cta' }, T('Return to Study →'))));

  // HUD live counters & species pills
  const bloomStat = h('b', {}, '0');
  const butterflyStat = h('b', {}, '0');
  const spellStat = h('b', {}, '0');
  const hintText = h('span', {}, T('Sweep to plant wildflowers, hold anywhere to weave a Frieren spell circle.'));

  const speciesBtns = SPECIES.map(sp => {
    const btn = h('button', {
      type: 'button',
      class: 'br-pill',
      style: { '--tc': sp.hex },
      'aria-pressed': String(sp.id === activeSpecies),
      onclick: () => selectSpecies(sp.id)
    }, h('span', { class: 'br-swatch', 'aria-hidden': 'true' }), T(sp.label));
    return { id: sp.id, btn };
  });

  function selectSpecies(id) {
    activeSpecies = id;
    speciesBtns.forEach(x => x.btn.setAttribute('aria-pressed', String(x.id === id)));
  }

  const hudCloseBtn = h('button', {
    type: 'button',
    class: 'br-hud-hide',
    'aria-label': T('Hide HUD'),
    title: T('Hide HUD'),
    onclick: () => setHudHidden(true),
    html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  });

  const hud = h('div', { class: 'br-hud' },
    h('div', { class: 'br-hud-top' },
      h('h1', {}, T('A field of flowers, cast by hand.')),
      hudCloseBtn),
    h('p', { class: 'br-lede' }, T('Take a breath in Flamme’s sanctuary. Paint glowing blooms across the hills, summon 50-year meteors, or let Zen Auto-Bloom carry your break.')),
    h('div', { class: 'br-mobile-realms', role: 'group', 'aria-label': T('Sanctuary realm') }, ...makeRealmButtons('br-pill', mobileRealmBtns)),
    h('div', { class: 'br-species-row', role: 'group', 'aria-label': T('Flower species') }, ...speciesBtns.map(x => x.btn)),
    h('div', { class: 'br-telemetry' },
      h('span', {}, bloomStat, ' ', T('blooms')),
      h('span', {}, butterflyStat, ' ', T('butterflies')),
      h('span', {}, spellStat, ' ', T('spells')),
      h('span', {}, h('b', {}, String(masteredCount)), '/', String(allL.length), ' ', T('mastered'))));

  const inspector = h('div', { class: 'br-hint-pill', 'aria-live': 'polite' },
    h('span', { class: 'br-hint-dot', 'aria-hidden': 'true' }),
    hintText);

  // Bottom console dock
  const zenBtn = h('button', {
    type: 'button',
    class: 'lp-toy',
    'aria-pressed': String(zenAuto),
    onclick: () => {
      zenAuto = !zenAuto;
      zenBtn.setAttribute('aria-pressed', String(zenAuto));
    }
  }, T('Zen Auto-Bloom'));

  const musicBtn = h('button', {
    type: 'button',
    class: 'lp-toy',
    onclick: () => {
      musicOn = !musicOn;
      musicBtn.classList.toggle('active', musicOn);
      musicBtn.textContent = musicOn ? T('Music: ON') : T('Music: OFF');
      if (musicOn) startMusic(true);
      else stopMusic();
    }
  }, T('Music: OFF'));

  const soundBtn = h('button', {
    type: 'button',
    class: 'lp-toy',
    onclick: () => {
      soundOn = !soundOn;
      soundBtn.classList.toggle('active', soundOn);
      soundBtn.textContent = soundOn ? T('Sound: ON') : T('Sound: OFF');
      if (soundOn) {
        ensureAudio(true);
        playChord(2);
      }
    }
  }, T('Sound: OFF'));

  const hudBtn = h('button', {
    type: 'button',
    class: 'lp-toy active',
    onclick: () => setHudHidden(!hudHidden)
  }, T('Show HUD'));

  const pauseBtn = h('button', {
    type: 'button',
    class: 'lp-toy',
    onclick: () => {
      paused = !paused;
      pauseBtn.textContent = paused ? T('Play') : T('Pause');
      syncPause();
    }
  }, paused ? T('Play') : T('Pause'));

  const dock = dockControlBar(T('Flower magic controls'), 'br-dock',
    h('button', { type: 'button', class: 'lp-toy', onclick: () => castGrandBloom() }, T('Grand Bloom')),
    h('button', { type: 'button', class: 'lp-toy', onclick: () => castMeteorShower() }, T('Meteor Shower')),
    h('button', { type: 'button', class: 'lp-toy', onclick: () => releaseButterflies(8) }, T('Butterfly Flock')),
    h('button', { type: 'button', class: 'lp-toy', onclick: () => triggerWindGale() }, T('Gentle Gale')),
    zenBtn,
    h('button', { type: 'button', class: 'lp-toy', onclick: () => clearMeadow() }, T('Clear Meadow')),
    h('span', { class: 'lp-dock-sep', 'aria-hidden': 'true' }),
    musicBtn,
    soundBtn,
    hudBtn,
    pauseBtn);

  const canvas = h('canvas', { class: 'br-canvas', 'aria-hidden': 'true' });
  const stage = h('section', { class: 'br-stage', 'data-casting': 'false', 'data-hud-hidden': 'true' },
    canvas,
    h('div', { class: 'br-stage-grid' }, hud, inspector),
    dock);
  hud.inert = true;
  inspector.inert = true;

  function setHudHidden(val) {
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

  const unlockMusicOnGesture = () => {
    if (destroyed || !musicOn) return;
    const ctx = ensureAudio(true);
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => { if (!destroyed && musicOn) stepMusic(); }).catch(() => { });
    }
  };

  const onKey = e => {
    unlockMusicOnGesture();
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest('input, textarea, select, [contenteditable]')) {
      setHudHidden(!hudHidden);
    }
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('pointerdown', unlockMusicOnGesture, { passive: true });

  const scrollToStage = () => {
    stage.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // Below-the-fold Folk Magic Grimoire Compendium
  const grimoireBand = h('section', { class: 'lp-band br-grimoire-band' },
    h('div', { class: 'lp-band-head' },
      h('div', {},
        h('h2', {}, T('Folk Magic Grimoire')),
        h('p', { class: 'lp-band-sub' }, T('Spells gathered along the northern road—each blends light, botanical geometry, and wind across the meadow above.'))),
      h('button', { type: 'button', class: 'btn ghost', onclick: scrollToStage }, T('Return to Meadow ↑'))),
    h('div', { class: 'br-spells-grid' }, SPELLS.map(sp =>
      h('article', { class: 'br-spell-card', style: { '--tc': sp.tc } },
        h('div', { class: 'br-spell-head' },
          h('h3', {}, T(sp.title)),
          h('span', { class: 'br-spell-tag' }, T(sp.tag))),
        h('p', {}, T(sp.desc)),
        h('div', { class: 'br-spell-foot' },
          h('button', {
            type: 'button',
            class: 'btn sm ghost',
            onclick: () => {
              setRealm(sp.realm);
              selectSpecies(sp.species);
              scrollToStage();
              if (sp.id === 'era-meteors') castMeteorShower();
              else if (sp.id === 'fern-butterflies') { releaseButterflies(12); castGrandBloom(); }
              else if (sp.id === 'aureole-ruins') { triggerWindGale(); castGrandBloom(); }
              else castGrandBloom();
            }
          }, T('Cast in Meadow ↑')))))));

  // Alchemical Spell Tuning & 10-Track Resonance
  const makeTuneGroup = (label, options, getCur, onPick) => {
    const btns = [];
    const row = h('div', { class: 'br-tune-row' },
      h('span', { class: 'br-tune-label' }, T(label)),
      h('div', { class: 'br-tune-group', role: 'group', 'aria-label': T(label) }, options.map(([id, text]) => {
        const b = h('button', {
          type: 'button',
          class: 'br-pill',
          'aria-pressed': String(getCur() === id),
          onclick: () => {
            onPick(id);
            btns.forEach(x => x.b.setAttribute('aria-pressed', String(x.id === id)));
          }
        }, T(text));
        btns.push({ id, b });
        return b;
      })));
    return row;
  };

  const alchemyBand = h('section', { class: 'br-alchemy-band' },
    h('div', { class: 'lp-band' },
      h('div', { class: 'lp-band-head' },
        h('div', {},
          h('h2', {}, T('Spell Alchemist & Stack Resonance')),
          h('p', { class: 'lp-band-sub' }, T('Tune wind currents, petal scale, and bioluminescence, or channel any of your 10 learning tracks into a matching flower bloom.')))),
      h('div', { class: 'br-alchemy-grid' },
        h('div', { class: 'lp-panel' },
          h('h3', {}, T('Botanical & Wind Parameters')),
          h('div', { class: 'br-tune-list' },
            makeTuneGroup('Wind Breeze', [['calm', 'Calm'], ['breeze', 'Breeze'], ['gale', 'Gale']], () => windPreset, v => { windPreset = v; }),
            makeTuneGroup('Bloom Scale', [['delicate', 'Delicate'], ['lush', 'Lush'], ['giant', 'Giant']], () => sizePreset, v => { sizePreset = v; }),
            makeTuneGroup('Mana Glow', [['soft', 'Soft'], ['radiant', 'Radiant']], () => glowPreset, v => { glowPreset = v; }))),
        h('div', { class: 'lp-panel' },
          h('h3', {}, T('10-Track Mana Resonance')),
          h('p', {}, T('Select any track to cast a burst of flowers tinted in its domain hue—turning your study journey into a living garden.')),
          h('div', { class: 'br-track-garden' }, TRACKS.map(tr =>
            h('button', {
              type: 'button',
              class: 'br-track-seed',
              style: { '--tc': `var(--${tr.id})` },
              onclick: () => {
                scrollToStage();
                castTrackBurst(tr.id, tr.name);
              }
            }, ico(tr.id, 'nav-ico'), tr.name)))))));

  const closeBand = h('section', { class: 'lp-band lp-close' },
    h('h2', {}, T('Ready to return to your journey?')),
    h('p', {}, T('Like Frieren’s unhurried travels, mastery compounds across steady seasons. Take what calm you need and step back in anytime.')),
    h('div', { class: 'lp-actions' },
      h('a', { class: 'btn', href: '#/dashboard' }, T('Return to Study →')),
      h('a', { class: 'btn ghost', href: '#/lab' }, T('Explore 40 Live Labs'))));

  const root = h('div', { class: 'lp-root br-root' }, topBar, stage, grimoireBand, alchemyBand, closeBand);

  // =========================================================================
  // Canvas 2D Botanical Physics & Frieren Magic Engine
  // =========================================================================
  let destroyed = false;
  let rafId = 0;
  let ioStage = null;
  let roStage = null;
  let stageInView = true;

  const initMeadow = () => {
    if (destroyed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 1, H = 1, dpr = 1;
    let time = 0;
    const pointer = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, active: false, down: false };
    let dragCooldown = 0;
    let zenClock = 0;
    let meteorClock = 0;
    let galeBoost = 0;
    let statSyncTick = 0;

    const charge = { active: false, x: 0, y: 0, level: 0, rot: 0, soundTick: 0 };

    // Smoothly interpolated realm palette state
    const curRealm = {
      sky: REALMS[activeRealm].sky.map(c => c.slice()),
      hills: REALMS[activeRealm].hills.map(c => c.slice()),
      sunColor: REALMS[activeRealm].sunColor.slice(),
      sun: REALMS[activeRealm].sun.slice(),
      aurora: REALMS[activeRealm].aurora,
      stars: REALMS[activeRealm].stars,
      moon: REALMS[activeRealm].moon,
      ruins: REALMS[activeRealm].ruins,
      clouds: REALMS[activeRealm].clouds,
      rays: REALMS[activeRealm].rays,
      glow: REALMS[activeRealm].glow
    };

    const flowers = [];
    const grass = [];
    const butterflies = [];
    const seeds = [];
    const meteors = [];
    const waves = [];
    const sparks = [];
    const petals = [];
    const wisps = [];

    // Deterministic seeded sky stars & clouds
    let prng = 4208;
    const nextRand = () => ((prng = (prng * 1664525 + 1013904223) >>> 0) / 0x100000000);

    const stars = Array.from({ length: 135 }, () => ({
      nx: nextRand(),
      ny: nextRand() * 0.68,
      r: 0.55 + nextRand() * 1.45,
      phase: nextRand() * Math.PI * 2,
      speed: 0.014 + nextRand() * 0.025,
      tint: ['#e0f2fe', '#fef9c3', '#ddd6fe', '#ffffff'][Math.floor(nextRand() * 4)]
    }));

    const clouds = Array.from({ length: 6 }, (_, i) => ({
      nx: (i / 6) + nextRand() * 0.12,
      ny: 0.09 + nextRand() * 0.24,
      w: 0.15 + nextRand() * 0.14,
      h: 0.045 + nextRand() * 0.025,
      speed: 0.00012 + nextRand() * 0.00014
    }));

    // Rolling hill height function so grass, ruins, seeds, and flowers anchor organically
    const hillY = (layer, x) => {
      const nx = x / Math.max(1, W);
      if (layer === 0) {
        return H * (0.61 + 0.042 * Math.sin(nx * 4.2 + 0.6) + 0.022 * Math.cos(nx * 8.5 - 0.3));
      }
      if (layer === 1) {
        return H * (0.695 + 0.036 * Math.sin(nx * 3.4 + 2.1) + 0.018 * Math.sin(nx * 7.6 + 0.4));
      }
      return H * (0.79 + 0.028 * Math.sin(nx * 3.1 + 4.0) + 0.014 * Math.cos(nx * 6.8 + 1.1));
    };

    const rebuildGrassAndWisps = () => {
      grass.length = 0;
      const count = W >= 960 ? 190 : 105;
      for (let i = 0; i < count; i++) {
        const nx = (i + Math.random() * 0.8) / count;
        const gx = nx * W;
        const minY = hillY(1, gx) + 8;
        const gy = minY + Math.random() * (H - minY + 12);
        const depth = clamp((gy - minY) / Math.max(1, H - minY), 0, 1);
        grass.push({
          nx,
          gyFactor: clamp((gy - H * 0.6) / Math.max(1, H * 0.42), 0, 1.05),
          x: gx,
          y: gy,
          depth,
          h: (16 + Math.random() * 24) * (0.7 + depth * 0.55),
          rest: (Math.random() - 0.5) * 0.18,
          angle: 0,
          vAngle: 0,
          phase: Math.random() * Math.PI * 2
        });
      }
      if (!wisps.length) {
        for (let i = 0; i < 34; i++) {
          wisps.push({
            x: Math.random() * W,
            y: H * (0.22 + Math.random() * 0.72),
            r: 1.1 + Math.random() * 1.9,
            phase: Math.random() * Math.PI * 2,
            vx: 0.18 + Math.random() * 0.35,
            vy: -0.08 - Math.random() * 0.18
          });
        }
      }
    };

    const updateLayout = () => {
      const rect = stage.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      for (const g of grass) {
        g.x = g.nx * W;
        const minY = hillY(1, g.x) + 6;
        g.y = clamp(H * 0.6 + g.gyFactor * (H * 0.42), minY, H + 10);
      }
      for (const f of flowers) {
        f.x = f.nx * W;
        const minY = hillY(1, f.x) + 8;
        f.y = clamp(H * 0.62 + f.nyFactor * (H * 0.38), minY, H - 10);
      }
      if (!grass.length) rebuildGrassAndWisps();
    };

    const addWave = (x, y, maxR, color, maxWidth = 2.4, duration = 64) => {
      waves.push({ x, y, r: 6, maxR, age: 0, duration, color, maxWidth });
      if (waves.length > 20) waves.shift();
    };

    const emitSparks = (x, y, color, count = 6, speed = 1) => {
      for (let i = 0; i < count; i++) {
        if (sparks.length >= 180) sparks.shift();
        const ang = Math.random() * Math.PI * 2;
        const spd = (0.7 + Math.random() * 2.1) * speed;
        sparks.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.6, life: 1, r: 1.3 + Math.random() * 1.9, color });
      }
    };

    const shedPetalsFrom = f => {
      for (let i = 0; i < 3; i++) {
        if (petals.length >= 120) petals.shift();
        petals.push({
          x: f.x + (Math.random() - 0.5) * 12,
          y: f.y - f.stemH * f.growth,
          vx: (Math.random() - 0.3) * 1.1,
          vy: -0.4 - Math.random() * 0.7,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          life: 1,
          color: f.color,
          size: 3.5 + Math.random() * 3
        });
      }
    };

    const spawnButterfly = (x, y, color = null) => {
      if (butterflies.length >= 36) butterflies.shift();
      const palette = ['#67e8f9', '#f472b6', '#fde047', '#c084fc', '#93c5fd'];
      butterflies.push({
        x, y,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -0.8 - Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        flapSpeed: 0.22 + Math.random() * 0.12,
        size: 6.5 + Math.random() * 4.5,
        color: color || palette[Math.floor(Math.random() * palette.length)],
        perchFlower: null,
        perchTimer: 0,
        wanderAng: Math.random() * Math.PI * 2
      });
    };

    const pickSpeciesObj = forcedSpecies => {
      const sid = forcedSpecies && forcedSpecies !== 'all' ? forcedSpecies : activeSpecies;
      if (sid === 'all') {
        const pool = ['sogetsuso', 'flamme', 'zoltraak', 'fern', 'suniris'];
        return SPECIES_MAP[pool[Math.floor(Math.random() * pool.length)]];
      }
      return SPECIES_MAP[sid] || SPECIES_MAP.sogetsuso;
    };

    const plantFlower = (x, y, opts = {}) => {
      if (flowers.length >= 250) {
        const old = flowers.shift();
        if (old) shedPetalsFrom(old);
      }
      const clampedX = clamp(x, 12, W - 12);
      const minHill = hillY(1, clampedX) + 8;
      const clampedY = clamp(y, minHill, H - 10);
      const depth = clamp((clampedY - minHill) / Math.max(1, H - minHill), 0, 1);
      const sp = pickSpeciesObj(opts.species);
      const scaleMult = sizePreset === 'delicate' ? 0.78 : (sizePreset === 'giant' ? 1.32 : 1.0);
      const color = opts.color || sp.petals[Math.floor(Math.random() * sp.petals.length)];
      const coreColor = sp.core;
      const f = {
        nx: clampedX / Math.max(1, W),
        nyFactor: clamp((clampedY - H * 0.62) / Math.max(1, H * 0.38), 0, 1),
        x: clampedX,
        y: clampedY,
        depth,
        species: sp.id,
        color,
        coreColor,
        stemH: (28 + Math.random() * 46) * (0.68 + depth * 0.55) * scaleMult,
        size: (9 + Math.random() * 8) * (0.74 + depth * 0.45) * scaleMult,
        growth: opts.instant ? 1 : 0.04,
        vGrowth: opts.instant ? 0 : 0.075,
        angle: (Math.random() - 0.5) * 0.2,
        vAngle: 0,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        butterflySpawned: !!opts.instant
      };
      flowers.push(f);
      flowers.sort((a, b) => a.y - b.y);
      emitSparks(clampedX, clampedY - 8, color, opts.sparks || 4, 0.75);
      return f;
    };

    const dropSkySeed = (x, y, opts = {}) => {
      if (seeds.length >= 70) seeds.shift();
      const sp = pickSpeciesObj(opts.species);
      seeds.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 0.9 + Math.random() * 1.1,
        species: sp.id,
        color: opts.color || sp.petals[0],
        phase: Math.random() * Math.PI * 2
      });
    };

    const castBloomRing = (cx, cy, count = 18, opts = {}) => {
      spellCount++;
      const radius = opts.radius || Math.min(W, H) * 0.24;
      const ringCol = opts.color || SPECIES_MAP[activeSpecies]?.hex || '#67e8f9';
      addWave(cx, cy, radius * 1.65, ringCol, 2.8, 72);
      emitSparks(cx, cy, ringCol, 22, 1.5);

      // Push nearby grass & flowers outward with wind shockwave
      for (const g of grass) {
        const dx = g.x - cx, dy = g.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < radius * 1.7) {
          g.vAngle += (dx >= 0 ? 1 : -1) * (1 - d / (radius * 1.7)) * 0.26;
        }
      }
      for (const f of flowers) {
        const dx = f.x - cx, dy = f.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < radius * 1.7) {
          f.vAngle += (dx >= 0 ? 1 : -1) * (1 - d / (radius * 1.7)) * 0.22;
        }
      }
      for (const b of butterflies) {
        const dx = b.x - cx, dy = b.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < radius * 1.6 && d > 1) {
          b.perchFlower = null;
          b.vx += (dx / d) * 2.2;
          b.vy += (dy / d) * 2.2 - 0.8;
        }
      }

      const hillTop = hillY(1, cx);
      if (cy < hillTop - 16) {
        // Cast in sky: rain glowing seeds down to the meadow!
        for (let i = 0; i < count; i++) {
          const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
          const dist = Math.random() * radius * 0.65;
          dropSkySeed(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist * 0.6, opts);
        }
      } else {
        for (let i = 0; i < count; i++) {
          const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
          const dist = (0.18 + Math.random() * 0.85) * radius;
          const fx = clamp(cx + Math.cos(ang) * dist, 18, W - 18);
          const fy = clamp(cy + Math.sin(ang) * dist * 0.55, hillY(1, fx) + 10, H - 12);
          plantFlower(fx, fy, opts);
        }
      }

      const newFlies = Math.max(1, Math.min(6, Math.round(count / 5)));
      for (let k = 0; k < newFlies; k++) {
        spawnButterfly(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 40, ringCol);
      }
      playChord(Math.floor(Math.random() * 5));
    };

    const spawnMeteor = (startX = null) => {
      if (meteors.length >= 16) meteors.shift();
      const x = startX ?? W * (0.18 + Math.random() * 0.82);
      const y = -20 - Math.random() * 40;
      const spd = 6.5 + Math.random() * 4.5;
      meteors.push({
        x, y,
        vx: -spd * 1.15,
        vy: spd * 0.62,
        len: 75 + Math.random() * 85,
        life: 1,
        color: Math.random() > 0.35 ? '#93c5fd' : '#fde68a',
        droppedSeed: false
      });
    };

    setRealm = id => {
      if (!REALMS[id]) return;
      activeRealm = id;
      realmBtns.forEach(x => x.btn.setAttribute('aria-pressed', String(x.id === id)));
      mobileRealmBtns.forEach(x => x.btn.setAttribute('aria-pressed', String(x.id === id)));
      hintText.textContent = T('Shifted sanctuary to {realm}.', { realm: T(REALMS[id].label) });
      playCelesta(id === 'bluemoon' ? 6 : 3, 0.045, 1.1);
    };

    castGrandBloom = () => {
      const cx = W * (0.28 + Math.random() * 0.44);
      const minY = hillY(1, cx) + 28;
      const cy = minY + Math.random() * Math.max(24, H - minY - 90);
      castBloomRing(cx, cy, 24, { radius: Math.min(W, H) * 0.28 });
      hintText.textContent = T('Flamme’s Grand Field of Flowers bloomed across the hillside!');
    };

    castMeteorShower = () => {
      spellCount++;
      for (let i = 0; i < 8; i++) {
        setTimeout(() => { if (!destroyed) spawnMeteor(); }, i * 160);
      }
      playChord(4);
      hintText.textContent = T('The 50-Year Era Meteor Shower arcs across the sky.');
    };

    releaseButterflies = (n = 8) => {
      spellCount++;
      const cx = W * 0.52;
      const cy = H * 0.68;
      for (let i = 0; i < n; i++) {
        spawnButterfly(cx + (Math.random() - 0.5) * 140, cy + (Math.random() - 0.5) * 60);
      }
      addWave(cx, cy, 180, '#f472b6', 2, 58);
      playCelesta(7, 0.04, 0.9);
      hintText.textContent = T('A kaleidoscope of mana butterflies took flight.');
    };

    triggerWindGale = () => {
      spellCount++;
      galeBoost = 1.4;
      for (const f of flowers) {
        if (Math.random() < 0.35) shedPetalsFrom(f);
      }
      playCelesta(5, 0.038, 1.0);
      hintText.textContent = T('A gentle alpine wind swept across the blossoms.');
    };

    clearMeadow = () => {
      for (const f of flowers) shedPetalsFrom(f);
      flowers.length = 0;
      seeds.length = 0;
      playCelesta(1, 0.035, 0.9);
      hintText.textContent = T('Petals carried away on the wind—the hillside awaits new magic.');
    };

    castTrackBurst = (trackId, trackName) => {
      const col = TRACK_COLORS[trackId] || '#8b95ff';
      const cx = W * (0.32 + Math.random() * 0.36);
      const cy = hillY(2, cx) + 18;
      castBloomRing(cx, cy, 18, { color: col, radius: Math.min(W, H) * 0.22 });
      hintText.textContent = T('{name} mana resonated into 18 new blooms.', { name: trackName });
    };

    // Seed initial living meadow so the first paint looks magical immediately
    updateLayout();
    for (let i = 0; i < 32; i++) {
      const fx = W * (0.05 + Math.random() * 0.90);
      const minY = hillY(1, fx) + 12;
      const fy = minY + Math.random() * Math.max(20, H - minY - 22);
      plantFlower(fx, fy, { instant: true, sparks: 0 });
    }
    for (let i = 0; i < 9; i++) {
      spawnButterfly(W * (0.18 + Math.random() * 0.65), H * (0.45 + Math.random() * 0.38));
    }

    // Physics update step
    const stepPhysics = dt => {
      time += 0.016 * dt;
      galeBoost = Math.max(0, galeBoost - 0.008 * dt);

      const target = REALMS[activeRealm];
      const rate = clamp(0.035 * dt, 0, 1);
      for (let i = 0; i < 3; i++) {
        for (let c = 0; c < 3; c++) {
          curRealm.sky[i][c] = lerp(curRealm.sky[i][c], target.sky[i][c], rate);
          curRealm.hills[i][c] = lerp(curRealm.hills[i][c], target.hills[i][c], rate);
        }
        curRealm.sunColor[i] = lerp(curRealm.sunColor[i], target.sunColor[i], rate);
      }
      curRealm.sun[0] = lerp(curRealm.sun[0], target.sun[0], rate);
      curRealm.sun[1] = lerp(curRealm.sun[1], target.sun[1], rate);
      curRealm.aurora = lerp(curRealm.aurora, target.aurora, rate);
      curRealm.stars = lerp(curRealm.stars, target.stars, rate);
      curRealm.moon = lerp(curRealm.moon, target.moon, rate);
      curRealm.ruins = lerp(curRealm.ruins, target.ruins, rate);
      curRealm.clouds = lerp(curRealm.clouds, target.clouds, rate);
      curRealm.rays = lerp(curRealm.rays, target.rays, rate);
      curRealm.glow = lerp(curRealm.glow, target.glow, rate);

      const windBase = (windPreset === 'calm' ? 0.09 : (windPreset === 'gale' ? 0.38 : 0.21)) + galeBoost * 0.35;
      const windFreq = windPreset === 'gale' ? 2.6 : 1.5;

      // Clouds
      for (const cl of clouds) {
        cl.nx += cl.speed * (1 + windBase * 2.5) * dt;
        if (cl.nx - cl.w > 1.05) cl.nx = -cl.w;
      }

      // Charge spell circle while pointer held
      if (charge.active) {
        charge.level = Math.min(1, charge.level + 0.017 * dt);
        charge.rot += (0.025 + charge.level * 0.06) * dt;
        charge.soundTick += dt;
        if (charge.soundTick >= 11) {
          charge.soundTick = 0;
          playCelesta(Math.floor(charge.level * 10), 0.025, 0.45);
        }
        if (Math.random() < 0.45 * dt) {
          const ang = Math.random() * Math.PI * 2;
          const r = 18 + charge.level * 48;
          emitSparks(charge.x + Math.cos(ang) * r, charge.y + Math.sin(ang) * r, '#fde68a', 1, 0.4);
        }
      }

      // Grass blades spring physics
      for (const g of grass) {
        const wave = Math.sin(time * windFreq + g.x * 0.011 + g.phase * 0.2) * windBase;
        let targetAng = g.rest + wave;
        if (pointer.active) {
          const dx = g.x - pointer.x, dy = g.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 78) {
            const push = (1 - dist / 78) * 0.55;
            targetAng += (dx >= 0 ? 1 : -1) * push + clamp(pointer.vx * 0.03, -0.45, 0.45);
          }
        }
        const force = (targetAng - g.angle) * 0.095 - g.vAngle * 0.22;
        g.vAngle += force * dt;
        g.angle = clamp(g.angle + g.vAngle * dt, -1.05, 1.05);
      }

      // Flowers spring growth & sway
      for (const f of flowers) {
        if (f.growth < 1 || Math.abs(f.vGrowth) > 0.002) {
          const gForce = (1 - f.growth) * 0.055 - f.vGrowth * 0.26;
          f.vGrowth += gForce * dt;
          f.growth = clamp(f.growth + f.vGrowth * dt, 0, 1.24);
          if (f.species === 'fern' && !f.butterflySpawned && f.growth > 0.92) {
            f.butterflySpawned = true;
            if (Math.random() < 0.55) spawnButterfly(f.x, f.y - f.stemH, '#e879f9');
          }
        }
        const sway = Math.sin(time * (windFreq * 0.88) + f.x * 0.009 + f.phase) * (windBase * 0.78);
        let targetAng = sway;
        if (pointer.active) {
          const tipY = f.y - f.stemH * f.growth;
          const dx = f.x - pointer.x, dy = tipY - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 85) {
            targetAng += (dx >= 0 ? 1 : -1) * (1 - dist / 85) * 0.42;
          }
        }
        const force = (targetAng - f.angle) * 0.08 - f.vAngle * 0.2;
        f.vAngle += force * dt;
        f.angle = clamp(f.angle + f.vAngle * dt, -0.9, 0.9);
      }

      // Descending sky seeds sprout on landing
      for (let i = seeds.length - 1; i >= 0; i--) {
        const s = seeds[i];
        s.phase += 0.06 * dt;
        s.x += (s.vx + windBase * 1.4 + Math.sin(s.phase) * 0.4) * dt;
        s.y += s.vy * dt;
        const groundY = hillY(1, s.x) + 12 + Math.random() * 24;
        if (s.y >= groundY) {
          plantFlower(s.x, clamp(s.y, hillY(1, s.x) + 8, H - 14), { species: s.species, color: s.color, sparks: 5 });
          playCelesta(Math.floor(s.x / 60), 0.024, 0.65);
          seeds.splice(i, 1);
        } else if (s.x < -30 || s.x > W + 30 || s.y > H + 20) {
          seeds.splice(i, 1);
        }
      }

      // Butterflies steering & flower perching
      for (const b of butterflies) {
        b.phase += b.flapSpeed * dt;
        if (b.perchFlower) {
          const f = b.perchFlower;
          const tipX = f.x + Math.sin(f.angle) * f.stemH * f.growth;
          const tipY = f.y - Math.cos(f.angle) * f.stemH * f.growth - 4;
          b.x = lerp(b.x, tipX, 0.22 * dt);
          b.y = lerp(b.y, tipY, 0.22 * dt);
          b.perchTimer -= dt;
          const nearPtr = pointer.active && Math.hypot(b.x - pointer.x, b.y - pointer.y) < 75;
          if (b.perchTimer <= 0 || nearPtr || !flowers.includes(f)) {
            b.perchFlower = null;
            b.vx = (Math.random() - 0.5) * 2.2;
            b.vy = -1.2 - Math.random();
          }
          continue;
        }

        b.wanderAng += (Math.random() - 0.5) * 0.18 * dt;
        b.vx += (Math.cos(b.wanderAng) * 0.08 + windBase * 0.04) * dt;
        b.vy += Math.sin(b.wanderAng) * 0.065 * dt;

        // Soft boundary return
        if (b.x < 35) b.vx += 0.14 * dt;
        if (b.x > W - 35) b.vx -= 0.14 * dt;
        if (b.y < H * 0.14) b.vy += 0.12 * dt;
        if (b.y > H - 45) b.vy -= 0.16 * dt;

        // Scatter gently away from pointer
        if (pointer.active) {
          const dx = b.x - pointer.x, dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 && dist > 1) {
            b.vx += (dx / dist) * 0.28 * dt;
            b.vy += (dy / dist) * 0.28 * dt;
          }
        }

        // Occasionally land on a flower
        if (flowers.length > 0 && Math.random() < 0.008 * dt) {
          const cand = flowers[Math.floor(Math.random() * flowers.length)];
          if (cand && cand.growth > 0.9) {
            const tipX = cand.x + Math.sin(cand.angle) * cand.stemH;
            const tipY = cand.y - Math.cos(cand.angle) * cand.stemH;
            if (Math.hypot(tipX - b.x, tipY - b.y) < 130) {
              b.perchFlower = cand;
              b.perchTimer = 110 + Math.random() * 140;
              continue;
            }
          }
        }

        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 2.4) {
          b.vx = (b.vx / spd) * 2.4;
          b.vy = (b.vy / spd) * 2.4;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }

      // Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= 0.011 * dt;
        if (!m.droppedSeed && m.life < 0.65 && m.x > 40 && m.x < W - 40) {
          m.droppedSeed = true;
          dropSkySeed(m.x, m.y, { species: 'sogetsuso' });
        }
        if (Math.random() < 0.55 * dt) {
          emitSparks(m.x, m.y, m.color, 1, 0.35);
        }
        if (m.life <= 0 || m.x < -140 || m.y > H * 0.72) meteors.splice(i, 1);
      }

      // Waves, Sparks, Shed Petals, Ambient Wisps
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.age += dt;
        w.r = lerp(6, w.maxR, 1 - Math.pow(1 - clamp(w.age / w.duration, 0, 1), 3));
        if (w.age >= w.duration) waves.splice(i, 1);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 0.02 * dt;
        s.life -= 0.025 * dt;
        if (s.life <= 0) sparks.splice(i, 1);
      }
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += (p.vx + windBase * 2.2) * dt;
        p.y += p.vy * dt;
        p.vy = Math.min(0.65, p.vy + 0.015 * dt);
        p.rot += p.vRot * dt;
        p.life -= 0.011 * dt;
        if (p.life <= 0 || p.x > W + 20 || p.y > H + 20) petals.splice(i, 1);
      }
      for (const wp of wisps) {
        wp.phase += 0.03 * dt;
        wp.x += (wp.vx + windBase * 1.4 + Math.sin(wp.phase) * 0.25) * dt;
        wp.y += (wp.vy + Math.cos(wp.phase * 0.8) * 0.2) * dt;
        if (wp.x > W + 12) wp.x = -12;
        if (wp.y < -12) { wp.y = H * 0.92; wp.x = Math.random() * W; }
      }

      // Autonomous Zen Auto-Bloom & Night Meteors
      if (zenAuto) {
        zenClock += dt;
        if (zenClock >= 175) {
          zenClock = 0;
          const zx = W * (0.14 + Math.random() * 0.72);
          const minY = hillY(1, zx) + 18;
          const zy = minY + Math.random() * Math.max(20, H - minY - 40);
          castBloomRing(zx, zy, 9, { radius: Math.min(W, H) * 0.14 });
        }
      }
      if (curRealm.stars > 0.65) {
        meteorClock += dt;
        if (meteorClock >= 240) {
          meteorClock = 0;
          spawnMeteor();
        }
      }

      if (dragCooldown > 0) dragCooldown -= dt;
      pointer.vx *= 0.8;
      pointer.vy *= 0.8;

      statSyncTick += dt;
      if (statSyncTick >= 10) {
        statSyncTick = 0;
        bloomCount = flowers.length;
        butterflyCount = butterflies.length;
        bloomStat.textContent = String(bloomCount);
        butterflyStat.textContent = String(butterflyCount);
        spellStat.textContent = String(spellCount);
      }
    };

    // Draw individual flower species
    const drawFlower = (f, glowMult) => {
      const tipX = f.x + Math.sin(f.angle) * f.stemH * f.growth;
      const tipY = f.y - Math.cos(f.angle) * f.stemH * f.growth;
      const ctrlX = lerp(f.x, tipX, 0.45) + f.angle * 10;
      const ctrlY = lerp(f.y, tipY, 0.55);

      // Stem
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
      ctx.strokeStyle = activeRealm === 'bluemoon' ? '#1f6159' : '#2f7a4d';
      ctx.lineWidth = Math.max(1.2, (1.4 + f.depth * 0.9) * f.growth);
      ctx.stroke();

      // Stem leaves
      if (f.growth > 0.35) {
        const lx = lerp(f.x, tipX, 0.42);
        const ly = lerp(f.y, tipY, 0.42);
        const leafLen = f.size * 0.62 * f.growth;
        ctx.fillStyle = activeRealm === 'bluemoon' ? '#247468' : '#3d945f';
        ctx.beginPath();
        ctx.ellipse(lx - leafLen * 0.45, ly - 2, leafLen * 0.5, leafLen * 0.19, f.angle - 0.65, 0, Math.PI * 2);
        ctx.ellipse(lx + leafLen * 0.45, ly + 2, leafLen * 0.48, leafLen * 0.18, f.angle + 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      const r = f.size * Math.max(0.05, f.growth);
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(f.angle * 0.6 + f.rot * 0.12);

      // Bioluminescent floral aura
      const auraA = curRealm.glow * glowMult * (f.species === 'sogetsuso' || f.species === 'zoltraak' ? 0.42 : 0.24);
      if (auraA > 0.04) {
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 2.1);
        grad.addColorStop(0, f.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = auraA;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (f.species === 'sogetsuso') {
        // Blue-Moon Weed (Sogetsu-so): 5 slender glowing azure bell/star petals + golden stamens
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.rotate((Math.PI * 2 * i) / 5);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(r * 0.38, -r * 0.55, 0, -r * 1.12);
          ctx.quadraticCurveTo(-r * 0.38, -r * 0.55, 0, 0);
          ctx.fillStyle = f.color;
          ctx.globalAlpha = 0.88;
          ctx.fill();
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.65;
          ctx.stroke();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        // Delicate golden stamen filaments
        ctx.strokeStyle = f.coreColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const ang = (Math.PI * 2 * i) / 5 + 0.32;
          const ex = Math.cos(ang) * r * 0.55;
          const ey = Math.sin(ang) * r * 0.55;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.fillStyle = f.coreColor;
          ctx.beginPath();
          ctx.arc(ex, ey, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (f.species === 'zoltraak') {
        // Astral Starlight Lily: 6 sharp crystalline petals + inner rune triangle
        for (let i = 0; i < 6; i++) {
          ctx.save();
          ctx.rotate((Math.PI * 2 * i) / 6);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(r * 0.24, -r * 0.45);
          ctx.lineTo(0, -r * 1.15);
          ctx.lineTo(-r * 0.24, -r * 0.45);
          ctx.closePath();
          ctx.fillStyle = f.color;
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.strokeStyle = '#eef2ff';
          ctx.lineWidth = 0.7;
          ctx.stroke();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = f.coreColor;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else if (f.species === 'fern') {
        // Butterfly Orchid: 3 dorsal/lateral petals + wide ruffled labellum
        ctx.fillStyle = f.color;
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.rotate(-Math.PI * 0.5 + (i - 2) * 0.72);
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.55, r * 0.34, r * 0.52, 0, 0, Math.PI * 2);
          ctx.globalAlpha = i === 2 ? 0.95 : 0.8;
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = f.coreColor;
        ctx.beginPath();
        ctx.arc(0, r * 0.1, r * 0.24, 0, Math.PI * 2);
        ctx.fill();
      } else if (f.species === 'suniris') {
        // Golden Hero Cosmos: 8 rounded fluted petals + Fibonacci center
        for (let i = 0; i < 8; i++) {
          ctx.save();
          ctx.rotate((Math.PI * 2 * i) / 8);
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.62, r * 0.24, r * 0.48, 0, 0, Math.PI * 2);
          ctx.fillStyle = f.color;
          ctx.globalAlpha = 0.92;
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = f.coreColor;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Flamme's Meadow Clover: lush layered rounded petals
        for (let i = 0; i < 6; i++) {
          ctx.save();
          ctx.rotate((Math.PI * 2 * i) / 6);
          ctx.beginPath();
          ctx.arc(0, -r * 0.52, r * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = f.color;
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = f.coreColor;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawFrame = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const glowMult = glowPreset === 'radiant' ? 1.15 : 0.55;

      // 1. Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.85);
      skyGrad.addColorStop(0, rgbStr(curRealm.sky[0]));
      skyGrad.addColorStop(0.55, rgbStr(curRealm.sky[1]));
      skyGrad.addColorStop(1, rgbStr(curRealm.sky[2]));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Stars
      if (curRealm.stars > 0.02) {
        for (const st of stars) {
          const tw = 0.35 + 0.65 * Math.sin(time * st.speed * 60 + st.phase);
          ctx.globalAlpha = clamp(curRealm.stars * tw * 0.88, 0, 1);
          ctx.fillStyle = st.tint;
          ctx.beginPath();
          ctx.arc(st.nx * W, st.ny * H, st.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // 3. Aurora Borealis ribbons
      if (curRealm.aurora > 0.02) {
        const ribbonColors = ['rgba(52, 211, 153, 0.26)', 'rgba(56, 189, 248, 0.22)', 'rgba(192, 132, 252, 0.18)'];
        for (let rIdx = 0; rIdx < 3; rIdx++) {
          ctx.save();
          ctx.globalAlpha = curRealm.aurora * (0.75 - rIdx * 0.16);
          const baseY = H * (0.16 + rIdx * 0.075);
          const grad = ctx.createLinearGradient(0, baseY - 65, 0, baseY + 115);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.45, ribbonColors[rIdx]);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, baseY + 110);
          for (let x = 0; x <= W; x += 28) {
            const y = baseY + Math.sin(x * 0.006 + time * 0.55 + rIdx * 1.4) * 28 + Math.cos(x * 0.013 - time * 0.35) * 14;
            ctx.lineTo(x, y - 55);
          }
          ctx.lineTo(W, baseY + 115);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // 4. Celestial Sun / Blue-Moon
      const sx = curRealm.sun[0] * W;
      const sy = curRealm.sun[1] * H;
      const haloR = Math.min(W, H) * (curRealm.moon > 0.5 ? 0.22 : 0.32);
      const sunHalo = ctx.createRadialGradient(sx, sy, 4, sx, sy, haloR);
      sunHalo.addColorStop(0, rgbStr(curRealm.sunColor, 0.55));
      sunHalo.addColorStop(0.35, rgbStr(curRealm.sunColor, 0.16));
      sunHalo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(sx, sy, haloR, 0, Math.PI * 2);
      ctx.fill();

      if (curRealm.moon > 0.15) {
        const mr = Math.min(W, H) * 0.044;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(-0.42);
        ctx.globalAlpha = clamp(curRealm.moon, 0, 1);
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(0, 0, mr, Math.PI * 0.5, Math.PI * 1.5, false);
        ctx.bezierCurveTo(-mr * 0.18, -mr * 0.48, -mr * 0.18, mr * 0.48, 0, mr);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 5. Drifting clouds
      if (curRealm.clouds > 0.02) {
        ctx.save();
        ctx.globalAlpha = curRealm.clouds * 0.34;
        ctx.fillStyle = '#ffffff';
        for (const cl of clouds) {
          const cx = cl.nx * W, cy = cl.ny * H, cw = cl.w * W, ch = cl.h * H;
          for (const [ox, oy, rx, ry] of [
            [0, 0, cw * 0.46, ch * 0.48],
            [-cw * 0.24, ch * 0.12, cw * 0.30, ch * 0.36],
            [cw * 0.26, ch * 0.10, cw * 0.32, ch * 0.38]
          ]) {
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 6. Volumetric light shafts
      if (curRealm.rays > 0.02) {
        ctx.save();
        ctx.globalAlpha = curRealm.rays;
        for (let i = 0; i < 3; i++) {
          const rayGrad = ctx.createLinearGradient(sx, sy, sx - 260 + i * 170, H * 0.85);
          rayGrad.addColorStop(0, rgbStr(curRealm.sunColor, 0.35));
          rayGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(sx - 18 + i * 12, sy);
          ctx.lineTo(sx - 360 + i * 210, H * 0.86);
          ctx.lineTo(sx - 170 + i * 210, H * 0.86);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. Meteors
      for (const m of meteors) {
        const tx = m.x - (m.vx / 8) * m.len;
        const ty = m.y - (m.vy / 8) * m.len;
        const mGrad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        mGrad.addColorStop(0, m.color);
        mGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.globalAlpha = clamp(m.life, 0, 1);
        ctx.strokeStyle = mGrad;
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 8. Far hill + Aureole ancient ruins silhouette
      const drawHill = (layer, col) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 22) {
          ctx.lineTo(x, hillY(layer, x));
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      };

      drawHill(0, rgbStr(curRealm.hills[0]));

      if (curRealm.ruins > 0.04) {
        const rx = W * 0.67;
        const ry = hillY(0, rx);
        ctx.save();
        ctx.globalAlpha = curRealm.ruins * 0.72;
        ctx.fillStyle = rgbStr(curRealm.hills[1]);
        // Ancient stone sanctuary arch & monolith pillars
        ctx.fillRect(rx - 44, ry - 48, 12, 54);
        ctx.fillRect(rx + 32, ry - 52, 12, 58);
        ctx.beginPath();
        ctx.arc(rx, ry - 46, 44, Math.PI, 0);
        ctx.lineWidth = 10;
        ctx.strokeStyle = rgbStr(curRealm.hills[1]);
        ctx.stroke();
        // Glowing carved mana rune on monolith
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(rx + 38, ry - 38);
        ctx.lineTo(rx + 38, ry - 18);
        ctx.moveTo(rx + 33, ry - 28);
        ctx.lineTo(rx + 43, ry - 28);
        ctx.stroke();
        ctx.restore();
      }

      drawHill(1, rgbStr(curRealm.hills[1]));
      drawHill(2, rgbStr(curRealm.hills[2]));

      // 9. Wind-reactive grass blades
      const [grassBase, grassHighlight] = REALMS[activeRealm].grass;
      ctx.lineCap = 'round';
      for (let i = 0; i < grass.length; i++) {
        const g = grass[i];
        const tipX = g.x + Math.sin(g.angle) * g.h;
        const tipY = g.y - Math.cos(g.angle) * g.h;
        ctx.strokeStyle = i % 3 === 0 ? grassHighlight : grassBase;
        ctx.lineWidth = 1.1 + g.depth * 1.1;
        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.quadraticCurveTo(g.x + Math.sin(g.angle) * g.h * 0.4, g.y - g.h * 0.55, tipX, tipY);
        ctx.stroke();
      }

      // 10. Living flowers
      for (const f of flowers) {
        drawFlower(f, glowMult);
      }

      // 11. Descending sky seeds
      for (const s of seeds) {
        ctx.save();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - 4, s.y - 7);
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + 4, s.y - 7);
        ctx.stroke();
        ctx.restore();
      }

      // 12. Floating wish wisps
      ctx.fillStyle = curRealm.glow > 0.6 ? '#bae6fd' : '#fef9c3';
      for (const wp of wisps) {
        ctx.globalAlpha = 0.28 + 0.28 * Math.sin(wp.phase * 2);
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 13. Mana butterflies
      for (const b of butterflies) {
        const wingScale = 0.25 + 0.75 * Math.abs(Math.cos(b.phase));
        const ang = b.perchFlower ? b.perchFlower.angle * 0.4 : Math.atan2(b.vy, b.vx) * 0.25;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(ang);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.85;
        // Left & right translucent wings
        ctx.beginPath();
        ctx.ellipse(-b.size * 0.42 * wingScale, -b.size * 0.16, b.size * 0.52 * wingScale, b.size * 0.36, -0.4, 0, Math.PI * 2);
        ctx.ellipse(b.size * 0.42 * wingScale, -b.size * 0.16, b.size * 0.52 * wingScale, b.size * 0.36, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.ellipse(-b.size * 0.28 * wingScale, b.size * 0.22, b.size * 0.34 * wingScale, b.size * 0.24, 0.3, 0, Math.PI * 2);
        ctx.ellipse(b.size * 0.28 * wingScale, b.size * 0.22, b.size * 0.34 * wingScale, b.size * 0.24, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 14. Shed petals & sparks
      for (const p of petals) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = clamp(p.life, 0, 1) * 0.85;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      for (const sp of sparks) {
        ctx.globalAlpha = clamp(sp.life, 0, 1);
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 15. Expanding mana shockwave rings
      for (const w of waves) {
        const p = clamp(w.age / w.duration, 0, 1);
        ctx.save();
        ctx.globalAlpha = (1 - p) * 0.72;
        ctx.strokeStyle = w.color;
        ctx.lineWidth = Math.max(0.8, w.maxWidth * (1 - p * 0.6));
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 16. Frieren Hold-to-Charge Geometric Arcane Spell Circle
      if (charge.active && charge.level > 0.04) {
        const r = 26 + charge.level * 54;
        const sigilCol = SPECIES_MAP[activeSpecies]?.hex || '#fde68a';
        ctx.save();
        ctx.translate(charge.x, charge.y);
        ctx.globalAlpha = 0.45 + charge.level * 0.5;

        // Outer rune circle
        ctx.rotate(charge.rot);
        ctx.strokeStyle = sigilCol;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
        ctx.stroke();

        // Geometric 6-point hexagram runes
        for (let tri = 0; tri < 2; tri++) {
          ctx.beginPath();
          for (let v = 0; v < 3; v++) {
            const ang = (Math.PI * 2 * v) / 3 + tri * (Math.PI / 3);
            const px = Math.cos(ang) * r * 0.82;
            const py = Math.sin(ang) * r * 0.82;
            if (v === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = '#fde68a';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }

        // Orbiting mana spheres
        for (let n = 0; n < 6; n++) {
          const ang = (Math.PI * 2 * n) / 6;
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * r, Math.sin(ang) * r, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();
    };

    // Pointer handlers
    const stageCoords = e => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const onDown = e => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target !== canvas) return;
      const [px, py] = stageCoords(e);
      pointer.x = px; pointer.y = py; pointer.px = px; pointer.py = py;
      pointer.active = true; pointer.down = true;
      charge.active = true;
      charge.x = px; charge.y = py;
      charge.level = 0.05;
      charge.soundTick = 0;
      stage.setAttribute('data-casting', 'true');
      if (paused) drawFrame();
    };

    const onMove = e => {
      const [px, py] = stageCoords(e);
      pointer.vx = px - pointer.x;
      pointer.vy = py - pointer.y;
      pointer.x = px; pointer.y = py;
      pointer.active = true;

      if (charge.active) {
        charge.x = px;
        charge.y = py;
        // Drag-painting delicate blooms along the staff path
        if (dragCooldown <= 0 && Math.hypot(pointer.vx, pointer.vy) > 3) {
          dragCooldown = 3.2;
          if (py >= hillY(1, px) - 10) {
            plantFlower(px + (Math.random() - 0.5) * 24, py + (Math.random() - 0.5) * 14, { sparks: 3 });
          } else {
            dropSkySeed(px, py);
          }
          playCelesta(Math.floor(px / 55), 0.022, 0.6);
        }
      }
    };

    const onUp = () => {
      pointer.down = false;
      stage.setAttribute('data-casting', 'false');
      if (!charge.active) return;
      const cx = charge.x, cy = charge.y, lvl = charge.level;
      charge.active = false;
      charge.level = 0;

      if (lvl >= 0.24) {
        const count = Math.round(12 + lvl * 22);
        castBloomRing(cx, cy, count, { radius: Math.min(W, H) * (0.15 + lvl * 0.16) });
      } else {
        spellCount++;
        if (cy >= hillY(1, cx) - 12) {
          for (let i = 0; i < 3; i++) {
            plantFlower(cx + (Math.random() - 0.5) * 34, cy + (Math.random() - 0.5) * 18, { sparks: 5 });
          }
        } else {
          for (let i = 0; i < 4; i++) dropSkySeed(cx + (Math.random() - 0.5) * 26, cy + (Math.random() - 0.5) * 16);
        }
        addWave(cx, cy, 78, SPECIES_MAP[activeSpecies]?.hex || '#67e8f9', 2, 42);
        playCelesta(Math.floor((cx / Math.max(1, W)) * 10), 0.04, 0.9);
      }
      if (paused) drawFrame();
    };

    const onCancel = () => {
      pointer.down = false;
      pointer.active = false;
      charge.active = false;
      charge.level = 0;
      stage.setAttribute('data-casting', 'false');
    };

    canvas.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel);
    window.addEventListener('blur', onCancel);

    let lastTs = performance.now();
    const tick = ts => {
      if (destroyed) return;
      const dt = Math.min(2.5, Math.max(0.2, (ts - lastTs) / 16.6667));
      lastTs = ts;
      if (!paused && stageInView && !document.hidden) {
        stepPhysics(dt);
        drawFrame();
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    syncPause = () => {
      if (!paused && stageInView && !document.hidden && !rafId) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const onVis = () => {
      if (document.hidden) onCancel();
      syncPause();
    };
    document.addEventListener('visibilitychange', onVis);

    if (typeof IntersectionObserver !== 'undefined') {
      ioStage = new IntersectionObserver(entries => {
        stageInView = entries[0] ? entries[0].isIntersecting : true;
        syncPause();
      }, { threshold: 0.05 });
      ioStage.observe(stage);
    }
    if (typeof ResizeObserver !== 'undefined') {
      roStage = new ResizeObserver(() => {
        updateLayout();
        drawFrame();
      });
      roStage.observe(stage);
    }

    bloomStat.textContent = String(flowers.length);
    butterflyStat.textContent = String(butterflies.length);
    spellStat.textContent = String(spellCount);
    drawFrame();
    if (!paused) rafId = requestAnimationFrame(tick);
    if (musicOn) startMusic(false);

    onCleanup?.(() => {
      destroyed = true;
      stopMusic();
      if (rafId) cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('blur', onCancel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', unlockMusicOnGesture);
      document.removeEventListener('visibilitychange', onVis);
      ioStage?.disconnect();
      roStage?.disconnect();
      if (audioCtx) {
        audioCtx.close().catch(() => { });
        audioCtx = null;
        musicBus = null;
      }
    });
  };

  onCleanup?.(() => {
    destroyed = true;
    stopMusic();
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('pointerdown', unlockMusicOnGesture);
    if (rafId) cancelAnimationFrame(rafId);
    if (audioCtx) {
      audioCtx.close().catch(() => { });
      audioCtx = null;
      musicBus = null;
    }
  });
  requestAnimationFrame(initMeadow);
  return root;
}
