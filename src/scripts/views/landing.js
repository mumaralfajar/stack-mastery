// Live Distributed Packet Reactor landing view (#/).
import { ico } from '../icons.js';
import { toggleTheme } from '../state.js';

const LOGO_SVG = `<svg viewBox="0 0 128 128" fill="none" aria-hidden="true"><rect width="128" height="128" rx="14" fill="#06090f"/><rect x="6" y="6" width="116" height="116" rx="10" stroke="#1e293b" stroke-width="3" fill="#090d16"/><path d="M6 18 H20 M18 6 V20 M122 18 H108 M110 6 V20 M6 110 H20 M18 122 V108 M122 110 H108 M110 122 V108" stroke="#38bdf8" stroke-width="3"/><path d="M26 44 L44 64 L26 84" stroke="#38bdf8" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/><path d="M54 84 V44 L75 67 L96 44 V84" stroke="#f8fafc" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/><circle cx="106" cy="84" r="4.5" fill="#38bdf8"/></svg>`;

const NODE_LAYOUT = [
  { id: 'react', short: 'TS', rx: -0.78, ry: -0.62, noteIdx: 0 },
  { id: 'css', short: 'CSS', rx: -0.96, ry: -0.05, noteIdx: 1 },
  { id: 'angular', short: 'Ng', rx: -0.74, ry: 0.56, noteIdx: 2 },
  { id: 'flutter', short: 'Fl', rx: -0.18, ry: 0.84, noteIdx: 3 },
  { id: 'sysdesign', short: 'Sys', rx: 0.0, ry: -0.04, noteIdx: 4 },
  { id: 'go', short: 'Go', rx: 0.14, ry: -0.82, noteIdx: 5 },
  { id: 'aspnet', short: '.NET', rx: 0.72, ry: -0.60, noteIdx: 6 },
  { id: 'csharp', short: 'C#', rx: 0.96, ry: 0.02, noteIdx: 7 },
  { id: 'sql', short: 'SQL', rx: 0.68, ry: 0.62, noteIdx: 8 },
  { id: 'cs', short: 'CS', rx: 0.34, ry: 0.42, noteIdx: 9 }
];

const EDGES = [
  ['css', 'react', 'DOM'],
  ['react', 'sysdesign', 'HTTP'],
  ['angular', 'sysdesign', 'SSR'],
  ['flutter', 'sysdesign', 'REST'],
  ['sysdesign', 'go', 'gRPC'],
  ['sysdesign', 'aspnet', 'YARP'],
  ['csharp', 'aspnet', 'CLR'],
  ['go', 'sql', 'POOL'],
  ['aspnet', 'sql', 'EF'],
  ['cs', 'go', 'BIG-O'],
  ['cs', 'sql', 'B-TREE'],
  ['sysdesign', 'sql', 'CACHE']
];

const PENTATONIC = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00, 1046.50];

const LAYER_GROUPS = [
  { key: 'Interface Layer', desc: 'Rendering, typography, reactive signals, and multi-platform UI.', ids: ['css', 'react', 'angular', 'flutter'] },
  { key: 'Services & Runtime', desc: 'Typed backends, memory management, concurrency, and API contracts.', ids: ['csharp', 'aspnet', 'go'] },
  { key: 'Data & Distributed Scale', desc: 'Relational internals, caching, rate limits, consistency, and queues.', ids: ['sql', 'sysdesign'] },
  { key: 'Foundations', desc: 'Algorithms, Big-O complexity, graphs, dynamic programming, and concurrency.', ids: ['cs'] }
];

export function landingView(onCleanup) {
  const { h, t: T, TRACKS, LANG, setLang } = window;
  const trackMap = Object.fromEntries(TRACKS.map(tr => [tr.id, tr]));
  const totalLessons = TRACKS.reduce((sum, tr) => sum + tr.lessons.length, 0);

  let soundOn = false;
  let audioCtx = null;
  let voiceCount = 0;

  const ensureAudio = () => {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => { });
    }
    return audioCtx;
  };

  const playChime = (idx, gainVal = 0.045, isAlert = false) => {
    if (!soundOn || voiceCount >= 6) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      voiceCount++;
      osc.type = isAlert ? 'triangle' : 'sine';
      const freq = isAlert ? 165 : PENTATONIC[Math.abs(idx) % PENTATONIC.length];
      osc.frequency.setValueAtTime(freq, now);
      if (isAlert) osc.frequency.exponentialRampToValueAtTime(78, now + 0.24);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => { voiceCount = Math.max(0, voiceCount - 1); };
      osc.start(now);
      osc.stop(now + 0.29);
    } catch {
      voiceCount = Math.max(0, voiceCount - 1);
    }
  };

  const scrollToEl = id => {
    const target = document.getElementById(id);
    if (target) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  // Top bar
  const nextLang = LANG === 'id' ? 'en' : 'id';
  const nextLangName = LANG === 'id' ? 'English' : 'Bahasa Indonesia';
  let refreshTheme = () => { };

  const topBar = h('header', { class: 'lp-bar' },
    h('a', { href: '#/', class: 'brand' }, h('span', { class: 'logo', html: LOGO_SVG }), 'Stack Mastery'),
    h('nav', { class: 'lp-nav', 'aria-label': T('Landing navigation') },
      h('button', { type: 'button', class: 'lp-nav-link', onclick: () => scrollToEl('lp-arch') }, T('Tracks')),
      h('button', { type: 'button', class: 'lp-nav-link', onclick: () => scrollToEl('lp-proof') }, T('Live Labs')),
      h('a', { class: 'lp-nav-link', href: '#/interview' }, T('Interview preparation'))),
    h('div', { class: 'lp-controls' },
      h('a', { href: '#/search', class: 'icon-btn lp-search-opt', 'aria-label': T('Search'), title: T('Search'), html: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' }),
      h('button', { type: 'button', class: 'icon-btn', lang: nextLang, 'aria-label': nextLangName, title: nextLangName, onclick: () => setLang(nextLang) }, nextLang.toUpperCase()),
      h('button', {
        type: 'button', class: 'icon-btn', 'aria-label': T('Toggle theme'), title: T('Toggle theme'),
        onclick: () => { toggleTheme(); requestAnimationFrame(refreshTheme); },
        html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>'
      }),
      h('a', { href: '#/dashboard', class: 'btn lp-cta' }, T('Open Dashboard →'))));

  // Reactor stage elements
  const canvas = h('canvas', { class: 'lp-canvas', 'aria-hidden': 'true' });
  const inspDot = h('span', { class: 'lp-insp-dot', 'aria-hidden': 'true' });
  const inspText = h('span', {}, T('Drag any node, click or hold canvas to charge a ripple, double-click a node to explore.'));
  const inspector = h('div', { class: 'lp-inspector', 'aria-live': 'polite' }, inspDot, inspText);

  const pulseDot = h('span', { class: 'lp-pulse-dot', 'data-broken': 'false' });
  const rpsValue = h('b', {}, '48 RPS');
  const statusTag = h('span', {}, T('Cache Nominal'));

  const mottoLines = T('Learn it. Prove it. Teach it.').split(/(?<=\.)\s+/).filter(Boolean);
  const heroCopy = h('div', { class: 'lp-copy' },
    h('h1', {}, ...mottoLines.flatMap((line, i) => [i > 0 ? ' ' : null, h('span', { class: 'lp-line' }, line)])),
    h('p', { class: 'lp-lede' }, T('Ten full-stack tracks, {lessons} verified lessons, 40 interactive labs, and 4 browser playgrounds.', { lessons: totalLessons })),
    h('div', { class: 'lp-actions' },
      h('a', { class: 'btn', href: '#/dashboard' }, T('Open Dashboard →')),
      h('a', { class: 'btn ghost', href: '#/lab' }, T('Explore 40 Live Labs'))),
    h('div', { class: 'lp-telemetry' },
      h('span', {}, h('b', {}, '10'), ' ', T('tracks')),
      h('span', {}, h('b', {}, String(totalLessons)), ' ', T('lessons')),
      h('span', { class: 'lp-rps-pill' }, pulseDot, rpsValue, ' · ', statusTag)));

  // Interactive console dock controls
  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cacheKilled = false;
  let gravityOn = false;
  let slowMo = false;
  let paused = reducedMotion;
  let rpsBoost = 0;

  let fireSpike = () => { };
  let toggleCacheKill = () => { };
  let syncPause = () => { };

  const spikeBtn = h('button', { type: 'button', class: 'lp-toy', onclick: () => fireSpike() }, T('50× Spike'));
  const cacheBtn = h('button', { type: 'button', class: 'lp-toy danger', onclick: () => toggleCacheKill() }, T('Kill Cache'));
  const gravBtn = h('button', {
    type: 'button', class: 'lp-toy', 'aria-pressed': 'false',
    onclick: () => {
      gravityOn = !gravityOn;
      gravBtn.setAttribute('aria-pressed', String(gravityOn));
      if (!gravityOn) releaseGravity();
    }
  }, T('Gravity Well'));
  const slowBtn = h('button', {
    type: 'button', class: 'lp-toy', 'aria-pressed': 'false',
    onclick: () => {
      slowMo = !slowMo;
      slowBtn.setAttribute('aria-pressed', String(slowMo));
    }
  }, T('Slow-Mo 0.25×'));
  const soundBtn = h('button', {
    type: 'button', class: 'lp-toy',
    onclick: () => {
      soundOn = !soundOn;
      soundBtn.classList.toggle('active', soundOn);
      soundBtn.textContent = soundOn ? T('Sound: ON') : T('Sound: OFF');
      if (soundOn) {
        ensureAudio();
        playChime(4, 0.05);
      }
    }
  }, T('Sound: OFF'));
  const pauseBtn = h('button', {
    type: 'button', class: 'lp-toy',
    onclick: () => {
      paused = !paused;
      pauseBtn.textContent = paused ? T('Play') : T('Pause');
      syncPause();
    }
  }, paused ? T('Play') : T('Pause'));

  let releaseGravity = () => { };

  const dock = h('div', { class: 'lp-dock', role: 'group', 'aria-label': T('Reactor interactive controls') },
    spikeBtn, cacheBtn, gravBtn, slowBtn, h('span', { class: 'lp-dock-sep', 'aria-hidden': 'true' }), soundBtn, pauseBtn);

  const reactorSpace = h('div', { class: 'lp-reactor-space' }, inspector);

  const stage = h('section', { class: 'lp-stage', 'data-dragging': 'false', 'data-hover-node': 'false' },
    canvas,
    h('div', { class: 'lp-stage-grid' },
      heroCopy,
      reactorSpace),
    dock);

  // Act 2: 4-Layer Architecture Explorer
  const archSection = h('section', { id: 'lp-arch', class: 'lp-band' },
    h('div', { class: 'lp-band-head' },
      h('div', {},
        h('h2', {}, T('Ten interconnected engineering tracks')),
        h('p', { class: 'lp-band-sub' }, T('Work across layers—UI components, API services, relational internals, and distributed architecture reinforce each other.'))),
      h('a', { class: 'btn ghost', href: '#/dashboard' }, T('View full progress workspace →'))),
    h('div', { class: 'lp-arch-list' }, LAYER_GROUPS.map(grp =>
      h('div', { class: 'lp-layer lp-reveal' },
        h('div', { class: 'lp-layer-head' },
          h('h3', {}, T(grp.key)),
          h('span', {}, T(grp.desc))),
        h('div', { class: 'lp-track-rows' }, grp.ids.map(id => {
          const tr = trackMap[id];
          if (!tr) return null;
          return h('a', { class: 'lp-trow', href: `#/track/${tr.id}`, style: { '--tc': `var(--${tr.id})` } },
            ico(tr.id, 'lp-trow-ico'),
            h('div', { class: 'lp-trow-meta' },
              h('div', { class: 'lp-trow-top' },
                h('strong', {}, tr.name),
                h('small', {}, T('{n} lessons', { n: tr.lessons.length }))),
              h('p', {}, tr.tagline)));
        }))))));

  // Act 3: Asymmetric Proof Strip
  const proofSection = h('section', { id: 'lp-proof', class: 'lp-proof-band' },
    h('div', { class: 'lp-band' },
      h('div', { class: 'lp-band-head lp-reveal' },
        h('div', {},
          h('h2', {}, T('Learn interactively, verify in real runtimes')),
          h('p', { class: 'lp-band-sub' }, T('Every lesson moves from prediction and live visualization straight into runnable sandboxes and interview scenarios.')))),
      h('div', { class: 'lp-proof-grid' },
        h('div', { class: 'lp-panel lp-reveal' },
          h('h3', {}, T('40 interactive labs & 4 browser sandboxes')),
          h('p', {}, T('Experiment with SQL locking, Go slice aliasing, Rate Limiter seam bursts, Consistent Hash rings, CSS layout grids, and React rendering right inside the browser.')),
          h('div', { class: 'lp-chip-links' },
            h('a', { class: 'lp-chip-link', href: '#/lab/sysratelimit', style: { '--tc': 'var(--sysdesign)' } }, T('Rate Limiter Lab →')),
            h('a', { class: 'lp-chip-link', href: '#/lab/syshash', style: { '--tc': 'var(--sysdesign)' } }, T('Consistent Hash Ring →')),
            h('a', { class: 'lp-chip-link', href: '#/lab/goslices', style: { '--tc': 'var(--go)' } }, T('Go Slice Aliasing →')),
            h('a', { class: 'lp-chip-link', href: '#/play/sql', style: { '--tc': 'var(--sql)' } }, T('SQLite Sandbox →')),
            h('a', { class: 'lp-chip-link', href: '#/play/ts', style: { '--tc': 'var(--react)' } }, T('TypeScript Sandbox →')))),
        h('div', { class: 'lp-panel lp-reveal' },
          h('h3', {}, T('Interview arena & timed mock rounds')),
          h('p', {}, T('Practice 21 coding problems, 8 worked system design architectures, 67 rapid-fire Q&As, and an 8-week schedule without leaving the app.')),
          h('div', { class: 'lp-chip-links' },
            h('a', { class: 'lp-chip-link', href: '#/interview/design', style: { '--tc': 'var(--accent)' } }, T('8 Design Cases →')),
            h('a', { class: 'lp-chip-link', href: '#/interview/coding', style: { '--tc': 'var(--csharp)' } }, T('21 Coding Problems →')),
            h('a', { class: 'lp-chip-link', href: '#/interview/mock', style: { '--tc': 'var(--good)' } }, T('Timed Mock Loop →')))))));

  // Act 4: Quiet Anchored Close
  const closeSection = h('section', { class: 'lp-band lp-close lp-reveal' },
    h('h2', {}, T('Private by architecture')),
    h('p', {}, T('Zero sign-ups, zero tracking scripts, zero server lock-in. All progress, quizzes, and JSON backups stay on your machine.')),
    h('div', { class: 'lp-actions' },
      h('a', { class: 'btn', href: '#/dashboard' }, T('Open Workspace →')),
      h('a', { class: 'btn ghost', href: '#/start' }, T('New here? Set up your machine first →'))));

  const colorProbe = h('span', { style: { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' } });
  const root = h('div', { class: 'lp-root' }, colorProbe, topBar, stage, archSection, proofSection, closeSection);

  // Physics + Canvas 2D Reactor initialization
  let destroyed = false;
  let rafId = 0;
  let ioStage = null;
  let roStage = null;
  let stageInView = true;

  const initReactor = () => {
    if (destroyed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 1, H = 1, dpr = 1;
    let orbitRx = 260, orbitRy = 180;
    let isDark = true;
    let colors = {};
    let pointer = { x: 0, y: 0, active: false, down: false };
    let dragIdx = -1;
    let hoverIdx = -1;
    let pulseTick = 0;
    let packets = [];
    let waves = [];
    let sparks = [];
    let meteors = [];
    let meteorClock = 0;
    let sparkTick = 0;
    const charge = { active: false, x: 0, y: 0, level: 0, heldFrames: 0, soundTick: 0, moteTick: 0 };

    // Deterministic seeded celestial starfield + Keplerian orbital dust
    let prng = 1337;
    const nextSeed = () => ((prng = (prng * 1664525 + 1013904223) >>> 0) / 0x100000000);
    const STAR_TINTS_DARK = ['#dbeafe', '#f8fafc', '#fde68a', '#ddd6fe'];
    const STAR_TINTS_LIGHT = ['#64748b', '#475569', '#6366f1', '#94a3b8'];
    const stars = Array.from({ length: 95 }, () => {
      const layer = nextSeed();
      const depth = layer < 0.55 ? 0.22 : (layer < 0.87 ? 0.52 : 0.90);
      return {
        nx: nextSeed(),
        ny: nextSeed(),
        r: depth > 0.8 ? 1.3 + nextSeed() * 0.65 : 0.55 + nextSeed() * 0.8,
        depth,
        alpha: 0.08 + nextSeed() * 0.24,
        phase: nextSeed() * Math.PI * 2,
        speed: 0.008 + nextSeed() * 0.014,
        tintIdx: Math.floor(nextSeed() * 4)
      };
    });
    const orbitalDust = Array.from({ length: 26 }, (_, i) => ({
      ring: i % 2 === 0 ? 0.54 : 0.96,
      angle: nextSeed() * Math.PI * 2,
      speed: (i % 2 === 0 ? 0.0036 : 0.0017) * (0.85 + nextSeed() * 0.35),
      r: 0.75 + nextSeed() * 0.65,
      alpha: 0.11 + nextSeed() * 0.14
    }));

    const addWave = ({ x, y, startR = 8, maxR = 240, duration = 64, maxAlpha = 0.72, maxWidth = 2, color, delay = 0 }) => {
      waves.push({ x, y, startR, maxR, age: -delay, duration, maxAlpha, maxWidth, color });
      if (waves.length > 28) waves.shift();
    };

    const emitSparks = (x, y, color, nSparks = 5, speedScale = 1) => {
      for (let i = 0; i < nSparks; i++) {
        if (sparks.length >= 160) sparks.shift();
        const ang = (Math.PI * 2 * i) / nSparks + Math.random() * 0.7;
        const spd = (1.4 + Math.random() * 2.4) * speedScale;
        sparks.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 1, color });
      }
    };

    const nodes = NODE_LAYOUT.map((def, i) => ({
      ...def,
      idx: i,
      name: (trackMap[def.id] && trackMap[def.id].name) || def.id,
      count: (trackMap[def.id] && trackMap[def.id].lessons.length) || 0,
      ax: 0, ay: 0, x: 0, y: 0, vx: 0, vy: 0,
      r: def.id === 'sysdesign' ? 28 : 22,
      pulse: 0
    }));
    const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

    const readCssColor = varName => {
      colorProbe.style.color = `var(${varName})`;
      return getComputedStyle(colorProbe).color || '#38bdf8';
    };

    const readThemePalette = () => {
      const dt = document.documentElement.dataset.theme;
      isDark = dt === 'dark' || (dt !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
      colors = {
        bg: isDark ? '#070a10' : '#f2efe8',
        nodeFill: isDark ? '#111622' : '#ffffff',
        labelBg: isDark ? 'rgba(12, 16, 26, 0.88)' : 'rgba(255, 255, 255, 0.94)',
        text: readCssColor('--text'),
        muted: readCssColor('--muted'),
        border: readCssColor('--border'),
        good: readCssColor('--good'),
        bad: readCssColor('--bad'),
        accent: readCssColor('--accent')
      };
      for (const n of nodes) n.color = readCssColor('--' + n.id);
    };

    const layoutNodes = () => {
      const rect = stage.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      const desktop = W >= 960;
      const sr = reactorSpace.getBoundingClientRect();
      const availH = desktop ? H : Math.max(190, sr.height - 92);
      const cx = (sr.left - rect.left) + sr.width * 0.50;
      const cy = desktop ? H * 0.45 : (sr.top - rect.top) + availH * 0.44;
      orbitRx = desktop ? Math.min(sr.width * 0.39, 310) : Math.min(sr.width * 0.36, 142);
      orbitRy = desktop ? Math.min(H * 0.30, 235) : Math.min(availH * 0.27, 68);

      for (const n of nodes) {
        const nx = cx + n.rx * orbitRx;
        const ny = cy + n.ry * orbitRy;
        if (!n.ax) { n.x = nx; n.y = ny; }
        n.ax = nx;
        n.ay = ny;
        n.r = desktop ? (n.id === 'sysdesign' ? 27 : 21) : (n.id === 'sysdesign' ? 19 : 15);
      }
    };

    const spawnPacket = (edge, fast = false) => {
      if (packets.length >= 160) packets.shift();
      const a = byId[edge[0]], b = byId[edge[1]];
      if (!a || !b) return;
      const broken = cacheKilled && (edge[0] === 'sysdesign' || edge[1] === 'sysdesign');
      packets.push({
        a, b,
        t: 0,
        speed: (fast ? 0.022 : 0.0085) + Math.random() * 0.006,
        color: broken ? colors.bad : a.color,
        x: a.x, y: a.y,
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.5) * 2.4,
        trail: [],
        free: false,
        broken
      });
    };

    const emitBurst = (x, y, count = 12, playSound = true, chargePower = 0) => {
      const burstCol = cacheKilled ? colors.bad : colors.accent;
      const baseSpan = Math.min(W, H);
      const bigSpan = Math.max(W, H);
      const primaryMaxR = chargePower > 0
        ? baseSpan * 0.34 + (bigSpan * 0.64 - baseSpan * 0.34) * Math.pow(chargePower, 0.85)
        : baseSpan * 0.32;

      addWave({
        x, y,
        startR: 8 + chargePower * 10,
        maxR: primaryMaxR,
        duration: Math.round(64 + chargePower * 62),
        maxAlpha: 0.68 + chargePower * 0.26,
        maxWidth: 1.9 + chargePower * 2.5,
        color: burstCol
      });
      if (chargePower >= 0.18) {
        addWave({
          x, y,
          delay: 7,
          startR: 6 + chargePower * 6,
          maxR: primaryMaxR * 0.84,
          duration: Math.round(60 + chargePower * 54),
          maxAlpha: 0.44 + chargePower * 0.20,
          maxWidth: 1.4 + chargePower * 1.4,
          color: burstCol
        });
      }
      if (chargePower >= 0.55) {
        addWave({
          x, y,
          delay: 15,
          startR: 4,
          maxR: primaryMaxR * 0.66,
          duration: Math.round(54 + chargePower * 46),
          maxAlpha: 0.30 + chargePower * 0.16,
          maxWidth: 1.1 + chargePower * 0.9,
          color: cacheKilled ? colors.bad : (isDark ? '#e2e8f0' : burstCol)
        });
      }

      emitSparks(x, y, burstCol, Math.round(Math.min(18, count) + chargePower * 20), 1 + chargePower * 0.95);
      const reach = 280 + chargePower * 360;
      const strength = 9.5 + chargePower * 15.5;
      for (const n of nodes) {
        const dx = n.x - x, dy = n.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < reach) {
          const falloff = 1 - dist / reach;
          const force = falloff * strength;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
          n.pulse = Math.min(1.2, n.pulse + falloff * (0.35 + chargePower * 0.85));
        }
      }
      for (let i = 0; i < count; i++) {
        spawnPacket(EDGES[i % EDGES.length], true);
      }
      rpsBoost = Math.min(2400, rpsBoost + count * (18 + chargePower * 10));
      if (playSound) {
        if (chargePower >= 0.35) {
          const baseIdx = hoverIdx >= 0 ? hoverIdx : Math.floor(Math.random() * 6);
          playChime(baseIdx, 0.045 + chargePower * 0.02);
          playChime(baseIdx + 2, 0.032 + chargePower * 0.015);
          if (chargePower >= 0.72) playChime(baseIdx + 4, 0.028);
        } else if (hoverIdx >= 0) {
          playChime(hoverIdx);
        } else {
          playChime(Math.floor(Math.random() * 10));
        }
      }
    };

    fireSpike = () => {
      const center = byId.sysdesign || nodes[0];
      emitBurst(center.x, center.y, 50, false, 0.78);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].pulse = 1;
        if (i < 5) playChime(i * 2, 0.032);
      }
    };

    toggleCacheKill = () => {
      cacheKilled = !cacheKilled;
      cacheBtn.classList.toggle('active', cacheKilled);
      cacheBtn.textContent = cacheKilled ? T('Restore Cache') : T('Kill Cache');
      pulseDot.setAttribute('data-broken', String(cacheKilled));
      statusTag.textContent = cacheKilled ? T('Circuit OPEN · Bypassing Cache') : T('Cache Nominal');
      const sys = byId.sysdesign;
      if (sys) {
        const cacheCol = cacheKilled ? colors.bad : colors.good;
        addWave({ x: sys.x, y: sys.y, startR: 12, maxR: 250, duration: 72, maxAlpha: 0.86, maxWidth: 2.5, color: cacheCol });
        addWave({ x: sys.x, y: sys.y, delay: 8, startR: 8, maxR: 185, duration: 60, maxAlpha: 0.45, maxWidth: 1.5, color: cacheCol });
        sys.pulse = 1.2;
      }
      playChime(4, 0.06, cacheKilled);
      if (paused) drawFrame(0);
    };

    releaseGravity = () => {
      for (const p of packets) {
        if (p.free) {
          const tx = (p.b.x - p.x) * 0.08;
          const ty = (p.b.y - p.y) * 0.08;
          p.vx += tx; p.vy += ty;
          p.free = false;
        }
      }
    };

    refreshTheme = () => {
      readThemePalette();
      if (paused || reducedMotion) drawFrame(0);
    };

    const splineMid = (a, b) => {
      let mx = (a.x + b.x) * 0.5;
      let my = (a.y + b.y) * 0.5 - 24;
      if (pointer.active) {
        const dx = mx - pointer.x, dy = my - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 170 && d > 1) {
          const push = ((170 - d) / 170) * 26;
          mx += (dx / d) * push;
          my += (dy / d) * push;
        }
      }
      return [mx, my];
    };

    const stepPhysics = (dt, rawDt = dt) => {
      const k = 0.085 * dt;
      const damp = Math.pow(0.86, dt);
      for (const n of nodes) {
        if (dragIdx === n.idx) continue;
        const fx = (n.ax - n.x) * k;
        const fy = (n.ay - n.y) * k;
        n.vx = (n.vx + fx) * damp;
        n.vy = (n.vy + fy) * damp;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        n.pulse = Math.max(0, n.pulse - 0.03 * dt);
      }

      // Hold-click energy charge & coiled gravitational intake
      if (charge.active && dragIdx < 0) {
        charge.heldFrames += rawDt;
        const ct = Math.min(1, charge.heldFrames / 108);
        charge.level = 1 - Math.pow(1 - ct, 2.0);

        if (charge.level > 0.12) {
          const pullReach = 240 + charge.level * 180;
          for (const n of nodes) {
            const dx = charge.x - n.x, dy = charge.y - n.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < pullReach && dist > 26) {
              const pullF = (1 - dist / pullReach) * (0.28 + charge.level * 0.72) * dt;
              n.vx += (dx / dist) * pullF;
              n.vy += (dy / dist) * pullF;
            }
          }
        }

        if (charge.level > 0.10) {
          charge.moteTick += rawDt * (0.5 + charge.level * 1.6);
          if (charge.moteTick >= 4) {
            charge.moteTick = 0;
            if (sparks.length < 160) {
              const ang = Math.random() * Math.PI * 2;
              const dist = 48 + Math.random() * (44 + charge.level * 36);
              const sx = charge.x + Math.cos(ang) * dist;
              const sy = charge.y + Math.sin(ang) * dist;
              const intakeCol = cacheKilled ? colors.bad : colors.accent;
              sparks.push({
                x: sx, y: sy,
                vx: (charge.x - sx) * 0.068 - (sy - charge.y) * 0.018,
                vy: (charge.y - sy) * 0.068 + (sx - charge.x) * 0.018,
                life: 0.75,
                color: intakeCol
              });
            }
          }
        }

        sparkTick += dt * (0.55 + charge.level * 1.45);
        if (sparkTick >= 6) {
          sparkTick = 0;
          spawnPacket(EDGES[Math.floor(Math.random() * EDGES.length)], true);
          rpsBoost = Math.min(2000, rpsBoost + 18 + charge.level * 26);
        }

        charge.soundTick += rawDt;
        if (soundOn && charge.level > 0.12 && charge.soundTick >= 18) {
          charge.soundTick = 0;
          playChime(Math.min(9, Math.floor(charge.level * 9)), 0.016 + charge.level * 0.014, cacheKilled);
        }
      }

      // Ambient steady traffic
      pulseTick += dt;
      if (pulseTick >= (cacheKilled ? 6 : 10)) {
        pulseTick = 0;
        spawnPacket(EDGES[Math.floor(Math.random() * EDGES.length)], false);
      }

      const gravX = pointer.active ? pointer.x : byId.sysdesign.x;
      const gravY = pointer.active ? pointer.y : byId.sysdesign.y;

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.trail.push([p.x, p.y]);
        if (p.trail.length > 9) p.trail.shift();

        if (gravityOn) {
          p.free = true;
          const dx = gravX - p.x, dy = gravY - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const pull = Math.min(1.6, 220 / (dist + 35));
          // Tangential swirl + centripetal pull
          p.vx = p.vx * 0.96 + (dx / dist * pull * 0.45 - dy / dist * pull * 0.72) * dt;
          p.vy = p.vy * 0.96 + (dy / dist * pull * 0.45 + dx / dist * pull * 0.72) * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.t > 3.5) packets.splice(i, 1);
          p.t += 0.01 * dt;
          continue;
        }

        p.t += p.speed * dt;
        if (p.t >= 1) {
          p.b.pulse = Math.min(1, p.b.pulse + 0.55);
          emitSparks(p.b.x, p.b.y, p.color, p.broken ? 6 : 3);
          if (soundOn && Math.random() < 0.14) playChime(p.b.idx, 0.025, p.broken);
          packets.splice(i, 1);
          continue;
        }
        const [mx, my] = splineMid(p.a, p.b);
        const u = 1 - p.t;
        p.x = u * u * p.a.x + 2 * u * p.t * mx + p.t * p.t * p.b.x;
        p.y = u * u * p.a.y + 2 * u * p.t * my + p.t * p.t * p.b.y;
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= Math.pow(0.92, dt);
        s.vy *= Math.pow(0.92, dt);
        s.life -= 0.045 * dt;
        if (s.life <= 0) sparks.splice(i, 1);
      }

      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.age += dt;
        if (w.age >= w.duration) waves.splice(i, 1);
      }

      rpsBoost = Math.max(0, rpsBoost * Math.pow(0.96, dt));
      const shownRps = Math.round(42 + rpsBoost + (cacheKilled ? 140 : 0) + packets.length * 1.4);
      rpsValue.textContent = `${shownRps} RPS`;

      // Twinkle celestial stars, advance orbital dust, occasional whisper-faint meteor
      for (const st of stars) st.phase += st.speed * dt;
      for (const m of orbitalDust) m.angle = (m.angle + m.speed * dt) % (Math.PI * 2);

      meteorClock += dt;
      if (meteorClock >= 340) {
        meteorClock = 0;
        if (meteors.length < 2) {
          const sx = (0.35 + Math.random() * 0.62) * W;
          const sy = (0.04 + Math.random() * 0.35) * H;
          meteors.push({ x: sx, y: sy, vx: -(3.8 + Math.random() * 2.2), vy: 1.6 + Math.random() * 1.4, life: 1 });
        }
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= 0.025 * dt;
        if (m.life <= 0) meteors.splice(i, 1);
      }
    };

    const drawFrame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const sys = byId.sysdesign;
      const gxCenter = pointer.active ? pointer.x : sys.x;
      const gyCenter = pointer.active ? pointer.y : sys.y;
      const parX = pointer.active ? ((pointer.x / W) - 0.5) * -22 : 0;
      const parY = pointer.active ? ((pointer.y / H) - 0.5) * -16 : 0;

      // 1. Faintly vague celestial starfield + rare micro-meteors
      const tintSet = isDark ? STAR_TINTS_DARK : STAR_TINTS_LIGHT;
      for (const st of stars) {
        let sx = st.nx * W + parX * st.depth;
        let sy = st.ny * H + parY * st.depth;
        if (gravityOn) {
          const dx = gxCenter - sx, dy = gyCenter - sy;
          const dist = Math.hypot(dx, dy) + 60;
          const pull = Math.min(26, (2600 / dist) * st.depth * 0.38);
          sx += (dx / dist) * pull;
          sy += (dy / dist) * pull;
        }
        if (charge.active && charge.level > 0.08) {
          const dx = charge.x - sx, dy = charge.y - sy;
          const dist = Math.hypot(dx, dy) + 55;
          const pull = Math.min(22, (1900 / dist) * st.depth * charge.level * 0.42);
          sx += (dx / dist) * pull;
          sy += (dy / dist) * pull;
        }
        const twinkle = 0.62 + 0.38 * Math.sin(st.phase);
        const textFade = (W >= 960 && st.nx < 0.38) ? 0.42 : 1;
        const themeScale = isDark ? 1 : 0.58;
        const a = st.alpha * twinkle * textFade * themeScale;
        ctx.save();
        ctx.fillStyle = tintSet[st.tintIdx];
        if (st.depth > 0.8) {
          ctx.globalAlpha = a * 0.16;
          ctx.beginPath();
          ctx.arc(sx, sy, st.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const m of meteors) {
        ctx.save();
        const len = 18;
        ctx.strokeStyle = isDark ? '#e2e8f0' : '#475569';
        ctx.globalAlpha = Math.max(0, m.life * (isDark ? 0.30 : 0.16));
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * len, m.y - m.vy * len);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Central solar corona behind System Design
      const coronaR = Math.max(90, orbitRy * 0.65);
      const corona = ctx.createRadialGradient(sys.x, sys.y, 4, sys.x, sys.y, coronaR);
      const coronaRGB = cacheKilled ? '248, 113, 113' : (isDark ? '251, 146, 60' : '194, 65, 12');
      corona.addColorStop(0, `rgba(${coronaRGB}, ${isDark ? 0.14 : 0.08})`);
      corona.addColorStop(0.55, `rgba(${coronaRGB}, ${isDark ? 0.045 : 0.025})`);
      corona.addColorStop(1, `rgba(${coronaRGB}, 0)`);
      ctx.save();
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(sys.x, sys.y, coronaR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Orbital guide rings + Keplerian orbital dust motes
      ctx.save();
      ctx.strokeStyle = colors.border;
      ctx.globalAlpha = isDark ? 0.55 : 0.75;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      for (const scale of [0.54, 0.96]) {
        ctx.beginPath();
        ctx.ellipse(sys.ax, sys.ay, orbitRx * scale, orbitRy * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      for (const d of orbitalDust) {
        const dx = sys.ax + Math.cos(d.angle) * orbitRx * d.ring;
        const dy = sys.ay + Math.sin(d.angle) * orbitRy * d.ring;
        ctx.save();
        ctx.fillStyle = colors.muted;
        ctx.globalAlpha = d.alpha * (isDark ? 1 : 0.7);
        ctx.beginPath();
        ctx.arc(dx, dy, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Gravity well vortex indicator
      if (gravityOn) {
        const gx = pointer.active ? pointer.x : sys.x;
        const gy = pointer.active ? pointer.y : sys.y;
        ctx.save();
        ctx.strokeStyle = colors.accent;
        ctx.globalAlpha = 0.26;
        ctx.lineWidth = 1.4;
        for (const r of [34, 66, 98]) {
          ctx.beginPath();
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Conduits (curved splines)
      const hoverId = hoverIdx >= 0 ? nodes[hoverIdx].id : null;
      for (const edge of EDGES) {
        const a = byId[edge[0]], b = byId[edge[1]];
        const [mx, my] = splineMid(a, b);
        const touchHover = hoverId && (hoverId === a.id || hoverId === b.id);
        const degraded = cacheKilled && (a.id === 'sysdesign' || b.id === 'sysdesign');
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx, my, b.x, b.y);
        ctx.strokeStyle = degraded ? colors.bad : (touchHover ? nodes[hoverIdx].color : colors.border);
        ctx.lineWidth = touchHover ? 2.2 : 1.25;
        ctx.globalAlpha = touchHover ? 0.92 : (degraded ? 0.68 : 0.65);
        if (degraded) ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
      }

      // Shockwaves (eased expansion & silky opacity dissipation)
      for (const w of waves) {
        if (w.age < 0) continue;
        const p = Math.min(1, w.age / w.duration);
        const easeR = 1 - Math.pow(1 - p, 3.2);
        const r = w.startR + (w.maxR - w.startR) * easeR;
        const fadeIn = Math.min(1, p / 0.07);
        const fadeOut = Math.pow(1 - p, 2.5);
        const alpha = w.maxAlpha * fadeIn * fadeOut;
        if (alpha < 0.002) continue;

        ctx.save();
        ctx.strokeStyle = w.color;
        // Outer diffused halo
        ctx.beginPath();
        ctx.arc(w.x, w.y, r, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(1.2, w.maxWidth * (1 - p * 0.45) * 3.4);
        ctx.globalAlpha = alpha * (isDark ? 0.22 : 0.14);
        ctx.stroke();

        // Crisp tapering core ring
        ctx.beginPath();
        ctx.arc(w.x, w.y, r, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(0.55, w.maxWidth * (1 - p * 0.65));
        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.restore();
      }

      // Charging singularity indicator (on canvas hold)
      if (charge.active && charge.heldFrames > 5) {
        const lvl = charge.level;
        const col = cacheKilled ? colors.bad : colors.accent;
        const colRGB = cacheKilled ? '248, 113, 113' : (isDark ? '129, 140, 248' : '79, 70, 229');
        const breath = 0.5 + 0.5 * Math.sin(charge.heldFrames * 0.11);

        ctx.save();
        // Soft radial aura
        const auraR = 26 + lvl * 52;
        const aura = ctx.createRadialGradient(charge.x, charge.y, 1, charge.x, charge.y, auraR);
        aura.addColorStop(0, `rgba(${colRGB}, ${isDark ? 0.16 + lvl * 0.24 : 0.10 + lvl * 0.16})`);
        aura.addColorStop(1, `rgba(${colRGB}, 0)`);
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, auraR, 0, Math.PI * 2);
        ctx.fill();

        // Contracting outer gravitational boundary
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([3, 5]);
        ctx.globalAlpha = 0.16 + lvl * 0.24;
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, 56 - lvl * 22 + breath * 2.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Sweeping circular charge gauge arc
        const ringR = 16 + lvl * 14;
        const startAng = -Math.PI / 2;
        const endAng = startAng + Math.PI * 2 * Math.max(0.04, lvl);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, ringR, startAng, endAng);
        ctx.lineWidth = 6 + lvl * 4;
        ctx.globalAlpha = 0.14 + lvl * 0.12;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(charge.x, charge.y, ringR, startAng, endAng);
        ctx.lineWidth = 2 + lvl * 1.6;
        ctx.globalAlpha = 0.68 + lvl * 0.28;
        ctx.stroke();

        // Primed full-charge subtle outer halo
        if (lvl >= 0.99) {
          ctx.beginPath();
          ctx.arc(charge.x, charge.y, 35 + breath * 4, 0, Math.PI * 2);
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = 0.26 + breath * 0.16;
          ctx.stroke();
        }

        // Luminous focal core pinpoint
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.8 + lvl * 0.2;
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, 2.6 + lvl * 4.2 + breath * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Packets with tapered comet trails
      for (const p of packets) {
        if (p.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p.trail[0][0], p.trail[0][1]);
          for (let j = 1; j < p.trail.length; j++) ctx.lineTo(p.trail[j][0], p.trail[j][1]);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.55;
          ctx.stroke();
          ctx.restore();
        }
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.24;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Impact sparks
      for (const s of sparks) {
        ctx.save();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.life * 0.9);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8 * s.life + 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Nodes
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const n of nodes) {
        const isSys = n.id === 'sysdesign';
        const isHot = hoverIdx === n.idx || dragIdx === n.idx;
        const radius = n.r + (isHot ? 3 : 0);

        if (n.pulse > 0.05) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + n.pulse * 12, 0, Math.PI * 2);
          ctx.strokeStyle = (isSys && cacheKilled) ? colors.bad : n.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = Math.min(1, Math.pow(n.pulse, 1.8) * 0.55);
          ctx.stroke();
          ctx.restore();
        }

        // Core disk
        ctx.save();
        ctx.fillStyle = colors.nodeFill;
        ctx.strokeStyle = (isSys && cacheKilled) ? colors.bad : n.color;
        ctx.lineWidth = isHot ? 3 : (isSys ? 2.5 : 2);
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Short token inside disk
        ctx.save();
        ctx.fillStyle = (isSys && cacheKilled) ? colors.bad : n.color;
        ctx.font = `700 ${isSys ? 12 : 11}px ui-monospace, "Cascadia Code", Consolas, monospace`;
        ctx.fillText(n.short, n.x, n.y + 0.5);
        ctx.restore();

        // Compact readable label pill below
        const compactMap = { react: 'React', css: 'CSS', flutter: 'Flutter', aspnet: 'ASP.NET', cs: 'CS Core' };
        const lbl = W < 520 ? (compactMap[n.id] || n.name) : n.name;
        ctx.font = '600 11px "Segoe UI", system-ui, sans-serif';
        const tw = ctx.measureText(lbl).width + 12;
        const lx = n.x - tw * 0.5;
        const ly = n.y + radius + 8;
        ctx.save();
        ctx.fillStyle = colors.labelBg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(lx, ly, tw, 18, 5);
        else ctx.rect(lx, ly, tw, 18);
        ctx.fill();
        ctx.fillStyle = colors.text;
        ctx.fillText(lbl, n.x, ly + 9.5);
        ctx.restore();
      }
    };

    const hitNode = (px, py) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (Math.hypot(px - nodes[i].x, py - nodes[i].y) <= nodes[i].r + 12) return i;
      }
      return -1;
    };

    const updateInspector = idx => {
      if (idx >= 0) {
        const n = nodes[idx];
        inspDot.style.background = (n.id === 'sysdesign' && cacheKilled) ? colors.bad : n.color;
        inspText.textContent = T('{name} · {n} lessons · Double-click to open track', { name: n.name, n: n.count });
      } else {
        inspDot.style.background = cacheKilled ? colors.bad : colors.accent;
        inspText.textContent = T('Drag any node, click or hold canvas to charge a ripple, double-click a node to explore.');
      }
    };

    const stageCoords = e => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onDown = e => {
      if (e.target !== canvas) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const [px, py] = stageCoords(e);
      pointer.x = px; pointer.y = py; pointer.active = true; pointer.down = true;
      const hit = hitNode(px, py);
      if (hit >= 0) {
        dragIdx = hit;
        hoverIdx = hit;
        stage.setAttribute('data-dragging', 'true');
        updateInspector(hit);
        playChime(hit);
        canvas.setPointerCapture?.(e.pointerId);
      } else {
        charge.active = true;
        charge.x = px;
        charge.y = py;
        charge.level = 0;
        charge.heldFrames = 0;
        charge.soundTick = 0;
        charge.moteTick = 0;
        canvas.setPointerCapture?.(e.pointerId);
        addWave({
          x: px, y: py,
          startR: 4, maxR: 46,
          duration: 28,
          maxAlpha: 0.42,
          maxWidth: 1.5,
          color: cacheKilled ? colors.bad : colors.accent
        });
      }
      if (paused) drawFrame();
    };

    const onMove = e => {
      const [px, py] = stageCoords(e);
      pointer.x = px; pointer.y = py; pointer.active = true;
      if (dragIdx >= 0) {
        nodes[dragIdx].x = px;
        nodes[dragIdx].y = py;
        nodes[dragIdx].vx = 0;
        nodes[dragIdx].vy = 0;
        if (paused) drawFrame();
        return;
      }
      if (charge.active) {
        charge.x = px;
        charge.y = py;
      }
      if (e.target === canvas) {
        const hit = hitNode(px, py);
        if (hit !== hoverIdx) {
          hoverIdx = hit;
          stage.setAttribute('data-hover-node', String(hit >= 0));
          updateInspector(hit);
          if (paused) drawFrame();
        }
      } else if (hoverIdx >= 0) {
        hoverIdx = -1;
        stage.setAttribute('data-hover-node', 'false');
        updateInspector(-1);
      }
    };

    const onUp = () => {
      pointer.down = false;
      if (dragIdx >= 0) {
        dragIdx = -1;
        stage.setAttribute('data-dragging', 'false');
        return;
      }
      if (charge.active) {
        const cx = charge.x;
        const cy = charge.y;
        const lvl = charge.level;
        charge.active = false;
        charge.level = 0;
        charge.heldFrames = 0;
        const power = lvl < 0.15 ? 0 : Math.min(1, (lvl - 0.15) / 0.85);
        emitBurst(cx, cy, Math.round(12 + power * 42), true, power);
        if (paused) drawFrame();
      }
    };

    const onCancel = () => {
      pointer.down = false;
      charge.active = false;
      charge.level = 0;
      charge.heldFrames = 0;
      if (dragIdx >= 0) {
        dragIdx = -1;
        stage.setAttribute('data-dragging', 'false');
      }
    };

    const onDblClick = e => {
      if (e.target !== canvas) return;
      const [px, py] = stageCoords(e);
      const hit = hitNode(px, py);
      if (hit >= 0) location.hash = '#/track/' + nodes[hit].id;
    };

    canvas.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel);
    window.addEventListener('blur', onCancel);
    canvas.addEventListener('dblclick', onDblClick);

    let lastTs = performance.now();
    const tick = ts => {
      if (destroyed) return;
      const rawDt = Math.min(2.5, Math.max(0.2, (ts - lastTs) / 16.6667));
      lastTs = ts;
      if (!paused && stageInView && !document.hidden) {
        stepPhysics(rawDt * (slowMo ? 0.25 : 1), rawDt);
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
        layoutNodes();
        drawFrame();
      });
      roStage.observe(stage);
    }

    readThemePalette();
    layoutNodes();
    for (let i = 0; i < 6; i++) {
      const p = EDGES[i % EDGES.length];
      spawnPacket(p, false);
      if (packets[packets.length - 1]) packets[packets.length - 1].t = i * 0.14;
    }
    drawFrame();
    if (!paused) rafId = requestAnimationFrame(tick);

    onCleanup?.(() => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('blur', onCancel);
      canvas.removeEventListener('dblclick', onDblClick);
      document.removeEventListener('visibilitychange', onVis);
      ioStage?.disconnect();
      roStage?.disconnect();
      if (audioCtx) {
        audioCtx.close().catch(() => { });
        audioCtx = null;
      }
    });
  };

  // Register baseline cleanup immediately even if unmounted before first RAF
  onCleanup?.(() => {
    destroyed = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (audioCtx) {
      audioCtx.close().catch(() => { });
      audioCtx = null;
    }
  });
  requestAnimationFrame(initReactor);
  return root;
}
