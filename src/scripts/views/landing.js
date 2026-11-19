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
      audioCtx.resume().catch(() => {});
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
  let refreshTheme = () => {};

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
  const inspText = h('span', {}, T('Drag any node, click canvas to burst, double-click a node to explore.'));
  const inspector = h('div', { class: 'lp-inspector', 'aria-live': 'polite' }, inspDot, inspText);

  const pulseDot = h('span', { class: 'lp-pulse-dot', 'data-broken': 'false' });
  const rpsValue = h('b', {}, '48 RPS');
  const statusTag = h('span', {}, T('Cache Nominal'));

  const heroCopy = h('div', { class: 'lp-copy' },
    h('h1', {}, T('Learn it. Prove it. Teach it.')),
    h('p', { class: 'lp-lede' }, T('Ten full-stack tracks, {lessons} verified lessons, 40 interactive labs, and 4 browser playgrounds. Drag the nodes, trigger packet storms, or enter the workspace.', { lessons: totalLessons })),
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

  let fireSpike = () => {};
  let toggleCacheKill = () => {};
  let syncPause = () => {};

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

  let releaseGravity = () => {};

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
    let sparkTick = 0;

    const emitSparks = (x, y, color, nSparks = 5) => {
      for (let i = 0; i < nSparks; i++) {
        if (sparks.length >= 140) sparks.shift();
        const ang = (Math.PI * 2 * i) / nSparks + Math.random() * 0.7;
        const spd = 1.4 + Math.random() * 2.4;
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

    const emitBurst = (x, y, count = 12, playSound = true) => {
      const burstCol = cacheKilled ? colors.bad : colors.accent;
      waves.push({ x, y, r: 8, maxR: Math.min(W, H) * 0.32, alpha: 0.72, color: burstCol });
      if (waves.length > 10) waves.shift();
      emitSparks(x, y, burstCol, Math.min(18, count));
      for (const n of nodes) {
        const dx = n.x - x, dy = n.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 280) {
          const force = (1 - dist / 280) * 9.5;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }
      }
      for (let i = 0; i < count; i++) {
        spawnPacket(EDGES[i % EDGES.length], true);
      }
      rpsBoost = Math.min(1800, rpsBoost + count * 18);
      if (playSound && hoverIdx >= 0) playChime(hoverIdx);
      else if (playSound) playChime(Math.floor(Math.random() * 10));
    };

    fireSpike = () => {
      const center = byId.sysdesign || nodes[0];
      emitBurst(center.x, center.y, 50, false);
      waves.push({ x: center.x, y: center.y, r: 12, maxR: Math.min(W, H) * 0.44, alpha: 0.9, color: colors.accent });
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
        waves.push({ x: sys.x, y: sys.y, r: 12, maxR: 220, alpha: 0.95, color: cacheKilled ? colors.bad : colors.good });
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

    const stepPhysics = dt => {
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

      // Pointer hold rapid fire
      if (pointer.down && dragIdx < 0 && (sparkTick++ % 5 === 0)) {
        spawnPacket(EDGES[sparkTick % EDGES.length], true);
        rpsBoost = Math.min(1800, rpsBoost + 22);
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
        w.r += 5.2 * dt;
        w.alpha *= Math.pow(0.955, dt);
        if (w.alpha < 0.03 || w.r >= w.maxR) waves.splice(i, 1);
      }

      rpsBoost = Math.max(0, rpsBoost * Math.pow(0.96, dt));
      const shownRps = Math.round(42 + rpsBoost + (cacheKilled ? 140 : 0) + packets.length * 1.4);
      rpsValue.textContent = `${shownRps} RPS`;
    };

    const drawFrame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const sys = byId.sysdesign;
      // Orbital guide rings around topology center
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

      // Shockwaves
      for (const w of waves) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = w.alpha;
        ctx.stroke();
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
          ctx.globalAlpha = n.pulse * 0.55;
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
        inspText.textContent = T('Drag any node, click canvas to burst, double-click a node to explore.');
      }
    };

    const stageCoords = e => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onDown = e => {
      if (e.target !== canvas) return;
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
        emitBurst(px, py, 12, true);
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
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('dblclick', onDblClick);

    let lastTs = performance.now();
    const tick = ts => {
      if (destroyed) return;
      const rawDt = Math.min(2.5, Math.max(0.2, (ts - lastTs) / 16.6667));
      lastTs = ts;
      if (!paused && stageInView && !document.hidden) {
        stepPhysics(rawDt * (slowMo ? 0.25 : 1));
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

    const onVis = () => syncPause();
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
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('dblclick', onDblClick);
      document.removeEventListener('visibilitychange', onVis);
      ioStage?.disconnect();
      roStage?.disconnect();
      if (audioCtx) {
        audioCtx.close().catch(() => {});
        audioCtx = null;
      }
    });
  };

  // Register baseline cleanup immediately even if unmounted before first RAF
  onCleanup?.(() => {
    destroyed = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
  });
  requestAnimationFrame(initReactor);
  return root;
}
