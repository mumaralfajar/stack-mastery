// Distributed Packet Reactor canvas simulation, interactive toys, telemetry, and pointer physics.
import { routePath } from '../routes.ts';
import type { Lang } from '../types.ts';
import type { LandingAudioController } from './audio.ts';

interface NodeDef {
  id: string;
  short: string;
  rx: number;
  ry: number;
  noteIdx: number;
}

interface ReactorNode extends NodeDef {
  idx: number;
  name: string;
  count: number;
  ax: number;
  ay: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  color: string;
}

interface Packet {
  a: ReactorNode;
  b: ReactorNode;
  t: number;
  speed: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: [number, number][];
  free: boolean;
  broken: boolean;
}

interface Wave {
  x: number;
  y: number;
  startR: number;
  maxR: number;
  age: number;
  duration: number;
  maxAlpha: number;
  maxWidth: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Palette {
  bg: string;
  nodeFill: string;
  labelBg: string;
  text: string;
  muted: string;
  border: string;
  good: string;
  bad: string;
  accent: string;
}

export interface LandingTrackSummary {
  name: string;
  count: number;
}

export interface ReactorEngineOptions {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  reactorSpace: HTMLElement;
  inspDot: HTMLElement;
  inspText: HTMLElement;
  pulseDot: HTMLElement;
  rpsValue: HTMLElement;
  statusTag: HTMLElement;
  colorProbe: HTMLElement;
  tracks: Record<string, LandingTrackSummary>;
  lang: Lang;
  translate: (key: string, vars?: Record<string, string | number>) => string;
  audio: LandingAudioController;
  reducedMotion: boolean;
  onCacheChange?: (killed: boolean) => void;
}

export interface ReactorEngineController {
  fireSpike(): void;
  toggleCacheKill(): boolean;
  setGravity(on: boolean): void;
  setSlowMo(on: boolean): void;
  setPaused(on: boolean): void;
  refreshTheme(): void;
  destroy(): void;
}

const NODE_LAYOUT: readonly NodeDef[] = [
  { id: 'react', short: 'TS', rx: -0.78, ry: -0.62, noteIdx: 0 },
  { id: 'css', short: 'CSS', rx: -0.96, ry: -0.05, noteIdx: 1 },
  { id: 'angular', short: 'Ng', rx: -0.74, ry: 0.56, noteIdx: 2 },
  { id: 'flutter', short: 'Fl', rx: -0.18, ry: 0.84, noteIdx: 3 },
  { id: 'sysdesign', short: 'Sys', rx: 0.0, ry: -0.04, noteIdx: 4 },
  { id: 'go', short: 'Go', rx: 0.14, ry: -0.82, noteIdx: 5 },
  { id: 'aspnet', short: '.NET', rx: 0.72, ry: -0.6, noteIdx: 6 },
  { id: 'csharp', short: 'C#', rx: 0.96, ry: 0.02, noteIdx: 7 },
  { id: 'sql', short: 'SQL', rx: 0.68, ry: 0.62, noteIdx: 8 },
  { id: 'cs', short: 'CS', rx: 0.34, ry: 0.42, noteIdx: 9 },
];

const EDGES: readonly [string, string, string][] = [
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
  ['sysdesign', 'sql', 'CACHE'],
];

const STAR_TINTS_DARK = ['#dbeafe', '#f8fafc', '#fde68a', '#ddd6fe'] as const;
const STAR_TINTS_LIGHT = ['#64748b', '#475569', '#6366f1', '#94a3b8'] as const;
const COMPACT_LABELS: Record<string, string> = {
  react: 'React',
  css: 'CSS',
  flutter: 'Flutter',
  aspnet: 'ASP.NET',
  cs: 'CS Core',
};

export function createReactorEngine(opts: ReactorEngineOptions): ReactorEngineController {
  const {
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
    onCacheChange,
  } = opts;

  let destroyed = false;
  let rafId = 0;
  let ioStage: IntersectionObserver | null = null;
  let roStage: ResizeObserver | null = null;
  let stageInView = true;

  let cacheKilled = false;
  let gravityOn = false;
  let slowMo = false;
  let paused = reducedMotion;
  let rpsBoost = 0;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      fireSpike: () => {},
      toggleCacheKill: () => false,
      setGravity: () => {},
      setSlowMo: () => {},
      setPaused: () => {},
      refreshTheme: () => {},
      destroy: () => {},
    };
  }

  let W = 1;
  let H = 1;
  let dpr = 1;
  let orbitRx = 260;
  let orbitRy = 180;
  let isDark = true;
  let colors: Palette = {
    bg: '#070a10',
    nodeFill: '#111622',
    labelBg: 'rgba(12, 16, 26, 0.88)',
    text: '#e7eaf0',
    muted: '#9aa3b4',
    border: '#272d3a',
    good: '#4fd19a',
    bad: '#ff8b7e',
    accent: '#8b95ff',
  };

  const pointer = { x: 0, y: 0, active: false, down: false };
  let dragIdx = -1;
  let hoverIdx = -1;
  let pulseTick = 0;
  const packets: Packet[] = [];
  const waves: Wave[] = [];
  const sparks: Spark[] = [];
  const meteors: Meteor[] = [];
  let meteorClock = 0;
  let sparkTick = 0;
  const charge = { active: false, x: 0, y: 0, level: 0, heldFrames: 0, soundTick: 0, moteTick: 0 };

  let prng = 1337;
  const nextSeed = (): number => ((prng = (prng * 1664525 + 1013904223) >>> 0) / 0x100000000);

  const stars = Array.from({ length: 95 }, () => {
    const layer = nextSeed();
    const depth = layer < 0.55 ? 0.22 : layer < 0.87 ? 0.52 : 0.9;
    return {
      nx: nextSeed(),
      ny: nextSeed(),
      r: depth > 0.8 ? 1.3 + nextSeed() * 0.65 : 0.55 + nextSeed() * 0.8,
      depth,
      alpha: 0.08 + nextSeed() * 0.24,
      phase: nextSeed() * Math.PI * 2,
      speed: 0.008 + nextSeed() * 0.014,
      tintIdx: Math.floor(nextSeed() * 4),
    };
  });

  const orbitalDust = Array.from({ length: 26 }, (_, i) => ({
    ring: i % 2 === 0 ? 0.54 : 0.96,
    angle: nextSeed() * Math.PI * 2,
    speed: (i % 2 === 0 ? 0.0036 : 0.0017) * (0.85 + nextSeed() * 0.35),
    r: 0.75 + nextSeed() * 0.65,
    alpha: 0.11 + nextSeed() * 0.14,
  }));

  const addWave = (w: {
    x: number;
    y: number;
    startR?: number;
    maxR?: number;
    duration?: number;
    maxAlpha?: number;
    maxWidth?: number;
    color: string;
    delay?: number;
  }): void => {
    waves.push({
      x: w.x,
      y: w.y,
      startR: w.startR ?? 8,
      maxR: w.maxR ?? 240,
      age: -(w.delay ?? 0),
      duration: w.duration ?? 64,
      maxAlpha: w.maxAlpha ?? 0.72,
      maxWidth: w.maxWidth ?? 2,
      color: w.color,
    });
    if (waves.length > 28) waves.shift();
  };

  const emitSparks = (x: number, y: number, color: string, nSparks = 5, speedScale = 1): void => {
    for (let i = 0; i < nSparks; i++) {
      if (sparks.length >= 160) sparks.shift();
      const ang = (Math.PI * 2 * i) / nSparks + Math.random() * 0.7;
      const spd = (1.4 + Math.random() * 2.4) * speedScale;
      sparks.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 1, color });
    }
  };

  const nodes: ReactorNode[] = NODE_LAYOUT.map((def, i) => ({
    ...def,
    idx: i,
    name: tracks[def.id]?.name || def.id,
    count: tracks[def.id]?.count || 0,
    ax: 0,
    ay: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: def.id === 'sysdesign' ? 28 : 22,
    pulse: 0,
    color: '#38bdf8',
  }));
  const byId: Record<string, ReactorNode> = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const readCssColor = (varName: string): string => {
    colorProbe.style.color = `var(${varName})`;
    return getComputedStyle(colorProbe).color || '#38bdf8';
  };

  const readThemePalette = (): void => {
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
      accent: readCssColor('--accent'),
    };
    for (const n of nodes) n.color = readCssColor('--' + n.id);
  };

  const layoutNodes = (): void => {
    const rect = stage.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const desktop = W >= 960;
    const sr = reactorSpace.getBoundingClientRect();
    const availH = desktop ? H : Math.max(190, sr.height - 92);
    const cx = sr.left - rect.left + sr.width * 0.5;
    const cy = desktop ? H * 0.45 : sr.top - rect.top + availH * 0.44;
    orbitRx = desktop ? Math.min(sr.width * 0.39, 310) : Math.min(sr.width * 0.36, 142);
    orbitRy = desktop ? Math.min(H * 0.3, 235) : Math.min(availH * 0.27, 68);

    for (const n of nodes) {
      const nx = cx + n.rx * orbitRx;
      const ny = cy + n.ry * orbitRy;
      if (!n.ax) {
        n.x = nx;
        n.y = ny;
      }
      n.ax = nx;
      n.ay = ny;
      n.r = desktop ? (n.id === 'sysdesign' ? 27 : 21) : n.id === 'sysdesign' ? 19 : 15;
    }
  };

  const spawnPacket = (edge: readonly [string, string, string], fast = false): void => {
    if (packets.length >= 160) packets.shift();
    const a = byId[edge[0]];
    const b = byId[edge[1]];
    if (!a || !b) return;
    const broken = cacheKilled && (edge[0] === 'sysdesign' || edge[1] === 'sysdesign');
    packets.push({
      a,
      b,
      t: 0,
      speed: (fast ? 0.022 : 0.0085) + Math.random() * 0.006,
      color: broken ? colors.bad : a.color,
      x: a.x,
      y: a.y,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      trail: [],
      free: false,
      broken,
    });
  };

  const emitBurst = (x: number, y: number, count = 12, playSound = true, chargePower = 0): void => {
    const burstCol = cacheKilled ? colors.bad : colors.accent;
    const baseSpan = Math.min(W, H);
    const bigSpan = Math.max(W, H);
    const primaryMaxR =
      chargePower > 0
        ? baseSpan * 0.34 + (bigSpan * 0.64 - baseSpan * 0.34) * Math.pow(chargePower, 0.85)
        : baseSpan * 0.32;

    addWave({
      x,
      y,
      startR: 8 + chargePower * 10,
      maxR: primaryMaxR,
      duration: Math.round(64 + chargePower * 62),
      maxAlpha: 0.68 + chargePower * 0.26,
      maxWidth: 1.9 + chargePower * 2.5,
      color: burstCol,
    });
    if (chargePower >= 0.18) {
      addWave({
        x,
        y,
        delay: 7,
        startR: 6 + chargePower * 6,
        maxR: primaryMaxR * 0.84,
        duration: Math.round(60 + chargePower * 54),
        maxAlpha: 0.44 + chargePower * 0.2,
        maxWidth: 1.4 + chargePower * 1.4,
        color: burstCol,
      });
    }
    if (chargePower >= 0.55) {
      addWave({
        x,
        y,
        delay: 15,
        startR: 4,
        maxR: primaryMaxR * 0.66,
        duration: Math.round(54 + chargePower * 46),
        maxAlpha: 0.3 + chargePower * 0.16,
        maxWidth: 1.1 + chargePower * 0.9,
        color: cacheKilled ? colors.bad : isDark ? '#e2e8f0' : burstCol,
      });
    }

    emitSparks(x, y, burstCol, Math.round(Math.min(18, count) + chargePower * 20), 1 + chargePower * 0.95);
    const reach = 280 + chargePower * 360;
    const strength = 9.5 + chargePower * 15.5;
    for (const n of nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
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
        audio.playChime(baseIdx, 0.045 + chargePower * 0.02);
        audio.playChime(baseIdx + 2, 0.032 + chargePower * 0.015);
        if (chargePower >= 0.72) audio.playChime(baseIdx + 4, 0.028);
      } else if (hoverIdx >= 0) {
        audio.playChime(hoverIdx);
      } else {
        audio.playChime(Math.floor(Math.random() * 10));
      }
    }
  };

  const splineMid = (a: ReactorNode, b: ReactorNode): [number, number] => {
    let mx = (a.x + b.x) * 0.5;
    let my = (a.y + b.y) * 0.5 - 24;
    if (pointer.active) {
      const dx = mx - pointer.x;
      const dy = my - pointer.y;
      const d = Math.hypot(dx, dy);
      if (d < 170 && d > 1) {
        const push = ((170 - d) / 170) * 26;
        mx += (dx / d) * push;
        my += (dy / d) * push;
      }
    }
    return [mx, my];
  };

  const stepPhysics = (dt: number, rawDt = dt): void => {
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

    if (charge.active && dragIdx < 0) {
      charge.heldFrames += rawDt;
      const ct = Math.min(1, charge.heldFrames / 108);
      charge.level = 1 - Math.pow(1 - ct, 2.0);

      if (charge.level > 0.12) {
        const pullReach = 240 + charge.level * 180;
        for (const n of nodes) {
          const dx = charge.x - n.x;
          const dy = charge.y - n.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < pullReach && dist > 26) {
            const pullF = (1 - dist / pullReach) * (0.28 + charge.level * 0.72) * dt;
            n.vx += (dx / dist) * pullF;
            n.vy += (dy / dist) * pullF;
          }
        }
      }

      if (charge.level > 0.1) {
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
              x: sx,
              y: sy,
              vx: (charge.x - sx) * 0.068 - (sy - charge.y) * 0.018,
              vy: (charge.y - sy) * 0.068 + (sx - charge.x) * 0.018,
              life: 0.75,
              color: intakeCol,
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
      if (audio.isSoundOn() && charge.level > 0.12 && charge.soundTick >= 18) {
        charge.soundTick = 0;
        audio.playChime(Math.min(9, Math.floor(charge.level * 9)), 0.016 + charge.level * 0.014, cacheKilled);
      }
    }

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
        const dx = gravX - p.x;
        const dy = gravY - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = Math.min(1.6, 220 / (dist + 35));
        p.vx = p.vx * 0.96 + ((dx / dist) * pull * 0.45 - (dy / dist) * pull * 0.72) * dt;
        p.vy = p.vy * 0.96 + ((dy / dist) * pull * 0.45 + (dx / dist) * pull * 0.72) * dt;
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
        if (audio.isSoundOn() && Math.random() < 0.14) audio.playChime(p.b.idx, 0.025, p.broken);
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

  const drawFrame = (): void => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const sys = byId.sysdesign;
    const gxCenter = pointer.active ? pointer.x : sys.x;
    const gyCenter = pointer.active ? pointer.y : sys.y;
    const parX = pointer.active ? (pointer.x / W - 0.5) * -22 : 0;
    const parY = pointer.active ? (pointer.y / H - 0.5) * -16 : 0;

    const tintSet = isDark ? STAR_TINTS_DARK : STAR_TINTS_LIGHT;
    for (const st of stars) {
      let sx = st.nx * W + parX * st.depth;
      let sy = st.ny * H + parY * st.depth;
      if (gravityOn) {
        const dx = gxCenter - sx;
        const dy = gyCenter - sy;
        const dist = Math.hypot(dx, dy) + 60;
        const pull = Math.min(26, (2600 / dist) * st.depth * 0.38);
        sx += (dx / dist) * pull;
        sy += (dy / dist) * pull;
      }
      if (charge.active && charge.level > 0.08) {
        const dx = charge.x - sx;
        const dy = charge.y - sy;
        const dist = Math.hypot(dx, dy) + 55;
        const pull = Math.min(22, (1900 / dist) * st.depth * charge.level * 0.42);
        sx += (dx / dist) * pull;
        sy += (dy / dist) * pull;
      }
      const twinkle = 0.62 + 0.38 * Math.sin(st.phase);
      const textFade = W >= 960 && st.nx < 0.38 ? 0.42 : 1;
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
      ctx.globalAlpha = Math.max(0, m.life * (isDark ? 0.3 : 0.16));
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * len, m.y - m.vy * len);
      ctx.stroke();
      ctx.restore();
    }

    const coronaR = Math.max(90, orbitRy * 0.65);
    const corona = ctx.createRadialGradient(sys.x, sys.y, 4, sys.x, sys.y, coronaR);
    const coronaRGB = cacheKilled ? '248, 113, 113' : isDark ? '251, 146, 60' : '194, 65, 12';
    corona.addColorStop(0, `rgba(${coronaRGB}, ${isDark ? 0.14 : 0.08})`);
    corona.addColorStop(0.55, `rgba(${coronaRGB}, ${isDark ? 0.045 : 0.025})`);
    corona.addColorStop(1, `rgba(${coronaRGB}, 0)`);
    ctx.save();
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(sys.x, sys.y, coronaR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

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

    const hoverId = hoverIdx >= 0 ? nodes[hoverIdx].id : null;
    for (const edge of EDGES) {
      const a = byId[edge[0]];
      const b = byId[edge[1]];
      const [mx, my] = splineMid(a, b);
      const touchHover = hoverId !== null && (hoverId === a.id || hoverId === b.id);
      const degraded = cacheKilled && (a.id === 'sysdesign' || b.id === 'sysdesign');
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mx, my, b.x, b.y);
      ctx.strokeStyle = degraded ? colors.bad : touchHover ? nodes[hoverIdx].color : colors.border;
      ctx.lineWidth = touchHover ? 2.2 : 1.25;
      ctx.globalAlpha = touchHover ? 0.92 : degraded ? 0.68 : 0.65;
      if (degraded) ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
    }

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
      ctx.beginPath();
      ctx.arc(w.x, w.y, r, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1.2, w.maxWidth * (1 - p * 0.45) * 3.4);
      ctx.globalAlpha = alpha * (isDark ? 0.22 : 0.14);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w.x, w.y, r, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(0.55, w.maxWidth * (1 - p * 0.65));
      ctx.globalAlpha = alpha;
      ctx.stroke();
      ctx.restore();
    }

    if (charge.active && charge.heldFrames > 5) {
      const lvl = charge.level;
      const col = cacheKilled ? colors.bad : colors.accent;
      const colRGB = cacheKilled ? '248, 113, 113' : isDark ? '129, 140, 248' : '79, 70, 229';
      const breath = 0.5 + 0.5 * Math.sin(charge.heldFrames * 0.11);

      ctx.save();
      const auraR = 26 + lvl * 52;
      const aura = ctx.createRadialGradient(charge.x, charge.y, 1, charge.x, charge.y, auraR);
      aura.addColorStop(0, `rgba(${colRGB}, ${isDark ? 0.16 + lvl * 0.24 : 0.1 + lvl * 0.16})`);
      aura.addColorStop(1, `rgba(${colRGB}, 0)`);
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, auraR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = col;
      ctx.lineWidth = 1.1;
      ctx.setLineDash([3, 5]);
      ctx.globalAlpha = 0.16 + lvl * 0.24;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 56 - lvl * 22 + breath * 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

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

      if (lvl >= 0.99) {
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, 35 + breath * 4, 0, Math.PI * 2);
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.26 + breath * 0.16;
        ctx.stroke();
      }

      ctx.fillStyle = col;
      ctx.globalAlpha = 0.8 + lvl * 0.2;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 2.6 + lvl * 4.2 + breath * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

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

    for (const s of sparks) {
      ctx.save();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.life * 0.9);
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.8 * s.life + 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

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
        ctx.strokeStyle = isSys && cacheKilled ? colors.bad : n.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = Math.min(1, Math.pow(n.pulse, 1.8) * 0.55);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.fillStyle = colors.nodeFill;
      ctx.strokeStyle = isSys && cacheKilled ? colors.bad : n.color;
      ctx.lineWidth = isHot ? 3 : isSys ? 2.5 : 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = isSys && cacheKilled ? colors.bad : n.color;
      ctx.font = `700 ${isSys ? 12 : 11}px ui-monospace, "Cascadia Code", Consolas, monospace`;
      ctx.fillText(n.short, n.x, n.y + 0.5);
      ctx.restore();

      const lbl = W < 520 ? COMPACT_LABELS[n.id] || n.name : n.name;
      ctx.font = '600 11px "Segoe UI", system-ui, sans-serif';
      const tw = ctx.measureText(lbl).width + 12;
      const lx = n.x - tw * 0.5;
      const ly = n.y + radius + 8;
      ctx.save();
      ctx.fillStyle = colors.labelBg;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(lx, ly, tw, 18, 5);
      else ctx.rect(lx, ly, tw, 18);
      ctx.fill();
      ctx.fillStyle = colors.text;
      ctx.fillText(lbl, n.x, ly + 9.5);
      ctx.restore();
    }
  };

  const hitNode = (px: number, py: number): number => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (Math.hypot(px - nodes[i].x, py - nodes[i].y) <= nodes[i].r + 12) return i;
    }
    return -1;
  };

  const updateInspector = (idx: number): void => {
    if (idx >= 0) {
      const n = nodes[idx];
      inspDot.style.background = n.id === 'sysdesign' && cacheKilled ? colors.bad : n.color;
      inspText.textContent = T('{name} · {n} lessons · Double-click to open track', { name: n.name, n: n.count });
    } else {
      inspDot.style.background = cacheKilled ? colors.bad : colors.accent;
      inspText.textContent = T('Drag any node, click or hold canvas to charge a ripple, double-click a node to explore.');
    }
  };

  const stageCoords = (e: PointerEvent | MouseEvent): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const onDown = (e: PointerEvent): void => {
    if (e.target !== canvas) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const [px, py] = stageCoords(e);
    pointer.x = px;
    pointer.y = py;
    pointer.active = true;
    pointer.down = true;
    const hit = hitNode(px, py);
    if (hit >= 0) {
      dragIdx = hit;
      hoverIdx = hit;
      stage.setAttribute('data-dragging', 'true');
      updateInspector(hit);
      audio.playChime(hit);
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
        x: px,
        y: py,
        startR: 4,
        maxR: 46,
        duration: 28,
        maxAlpha: 0.42,
        maxWidth: 1.5,
        color: cacheKilled ? colors.bad : colors.accent,
      });
    }
    if (paused) drawFrame();
  };

  const onMove = (e: PointerEvent): void => {
    const [px, py] = stageCoords(e);
    pointer.x = px;
    pointer.y = py;
    pointer.active = true;
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

  const onUp = (): void => {
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

  const onCancel = (): void => {
    pointer.down = false;
    charge.active = false;
    charge.level = 0;
    charge.heldFrames = 0;
    if (dragIdx >= 0) {
      dragIdx = -1;
      stage.setAttribute('data-dragging', 'false');
    }
  };

  const onDblClick = (e: MouseEvent): void => {
    if (e.target !== canvas) return;
    const [px, py] = stageCoords(e);
    const hit = hitNode(px, py);
    if (hit >= 0) location.assign(routePath(lang, `/track/${nodes[hit].id}/`));
  };

  let lastTs = performance.now();
  const tick = (ts: number): void => {
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

  const syncPause = (): void => {
    if (!paused && stageInView && !document.hidden && !rafId && !destroyed) {
      lastTs = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  };

  const onVis = (): void => {
    if (document.hidden) onCancel();
    syncPause();
  };

  canvas.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  window.addEventListener('blur', onCancel);
  canvas.addEventListener('dblclick', onDblClick);
  document.addEventListener('visibilitychange', onVis);

  if (typeof IntersectionObserver !== 'undefined') {
    ioStage = new IntersectionObserver(
      (entries) => {
        stageInView = entries[0] ? entries[0].isIntersecting : true;
        syncPause();
      },
      { threshold: 0.05 },
    );
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
    spawnPacket(EDGES[i % EDGES.length], false);
    const last = packets[packets.length - 1];
    if (last) last.t = i * 0.14;
  }
  drawFrame();
  if (!paused) rafId = requestAnimationFrame(tick);

  return {
    fireSpike(): void {
      const center = byId.sysdesign || nodes[0];
      emitBurst(center.x, center.y, 50, false, 0.78);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].pulse = 1;
        if (i < 5) audio.playChime(i * 2, 0.032);
      }
      if (paused) drawFrame();
    },
    toggleCacheKill(): boolean {
      cacheKilled = !cacheKilled;
      pulseDot.setAttribute('data-broken', String(cacheKilled));
      statusTag.textContent = cacheKilled ? T('Circuit OPEN · Bypassing Cache') : T('Cache Nominal');
      onCacheChange?.(cacheKilled);
      const sys = byId.sysdesign;
      if (sys) {
        const cacheCol = cacheKilled ? colors.bad : colors.good;
        addWave({ x: sys.x, y: sys.y, startR: 12, maxR: 250, duration: 72, maxAlpha: 0.86, maxWidth: 2.5, color: cacheCol });
        addWave({ x: sys.x, y: sys.y, delay: 8, startR: 8, maxR: 185, duration: 60, maxAlpha: 0.45, maxWidth: 1.5, color: cacheCol });
        sys.pulse = 1.2;
      }
      audio.playChime(4, 0.06, cacheKilled);
      if (paused) drawFrame();
      return cacheKilled;
    },
    setGravity(on: boolean): void {
      gravityOn = on;
      if (!gravityOn) {
        for (const p of packets) {
          if (p.free) {
            p.vx += (p.b.x - p.x) * 0.08;
            p.vy += (p.b.y - p.y) * 0.08;
            p.free = false;
          }
        }
      }
    },
    setSlowMo(on: boolean): void {
      slowMo = on;
    },
    setPaused(on: boolean): void {
      paused = on;
      syncPause();
    },
    refreshTheme(): void {
      readThemePalette();
      if (paused || reducedMotion) drawFrame();
    },
    destroy(): void {
      destroyed = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      canvas.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('blur', onCancel);
      canvas.removeEventListener('dblclick', onDblClick);
      document.removeEventListener('visibilitychange', onVis);
      ioStage?.disconnect();
      roStage?.disconnect();
    },
  };
}
