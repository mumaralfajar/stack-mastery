// Pure Pomodoro study-timer state, wall-clock persistence (stackmastery.study), and cross-tab sync.
// Dependency-free beyond keys/storage/types so the workspace sidebar stays strictly manifest-only.
import { STUDY_KEY } from '../keys.ts';
import { getRaw, onStorageSync, writeJson } from '../storage.ts';
import type { LastLessonRef, PomodoroPhase, PomodoroPreset, PomodoroState } from '../types.ts';

export const FOCUS_MIN_BOUNDS = { min: 1, max: 120 } as const;
export const BREAK_MIN_BOUNDS = { min: 1, max: 60 } as const;

export const PRESET_MINUTES: Record<Exclude<PomodoroPreset, 'custom'>, { focus: number; break: number }> = {
  '25/5': { focus: 25, break: 5 },
  '50/10': { focus: 50, break: 10 },
};

export function todayIsoDate(): string {
  return new Date().toLocaleDateString('sv');
}

export function clampFocusMin(v: number): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return 25;
  return Math.max(FOCUS_MIN_BOUNDS.min, Math.min(FOCUS_MIN_BOUNDS.max, n));
}

export function clampBreakMin(v: number): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return 5;
  return Math.max(BREAK_MIN_BOUNDS.min, Math.min(BREAK_MIN_BOUNDS.max, n));
}

export function defaultPomodoroState(): PomodoroState {
  return {
    preset: '25/5',
    focusMin: 25,
    breakMin: 5,
    phase: 'idle',
    running: false,
    remainingSec: 25 * 60,
    endsAtMs: null,
    cycles: {
      date: todayIsoDate(),
      todayCount: 0,
      totalCount: 0,
    },
    lastCompletedAtMs: null,
    lastLesson: null,
  };
}

function sanitizeLastLesson(raw: unknown): LastLessonRef | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (
    typeof r.trackId === 'string' &&
    r.trackId &&
    typeof r.lessonId === 'string' &&
    r.lessonId &&
    typeof r.title === 'string' &&
    r.title &&
    typeof r.url === 'string' &&
    r.url
  ) {
    return { trackId: r.trackId, lessonId: r.lessonId, title: r.title, url: r.url };
  }
  return null;
}

export function sanitizePomodoroState(raw: unknown): PomodoroState {
  const base = defaultPomodoroState();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base;
  const r = raw as Record<string, unknown>;
  const preset: PomodoroPreset = r.preset === '25/5' || r.preset === '50/10' || r.preset === 'custom' ? r.preset : '25/5';
  const focusMin = preset === 'custom' ? clampFocusMin(Number(r.focusMin)) : PRESET_MINUTES[preset].focus;
  const breakMin = preset === 'custom' ? clampBreakMin(Number(r.breakMin)) : PRESET_MINUTES[preset].break;
  const phase: PomodoroPhase = r.phase === 'idle' || r.phase === 'focus' || r.phase === 'break' ? r.phase : 'idle';
  const running = Boolean(r.running) && phase !== 'idle';
  const phaseMax = (phase === 'break' ? breakMin : focusMin) * 60;
  const rawRem = Number(r.remainingSec);
  const remainingSec = Number.isFinite(rawRem) ? Math.max(0, Math.min(phaseMax, Math.round(rawRem))) : phaseMax;
  const endsAtMs = running && typeof r.endsAtMs === 'number' && Number.isFinite(r.endsAtMs) ? r.endsAtMs : null;

  const today = todayIsoDate();
  const rawCycles = r.cycles && typeof r.cycles === 'object' ? (r.cycles as Record<string, unknown>) : null;
  const rawTotal = Number(rawCycles?.totalCount ?? 0);
  const totalCount = Number.isFinite(rawTotal) && rawTotal >= 0 ? Math.floor(rawTotal) : 0;
  const storedDate = typeof rawCycles?.date === 'string' ? rawCycles.date : today;
  const rawToday = Number(rawCycles?.todayCount ?? 0);
  const todayCount =
    storedDate === today && Number.isFinite(rawToday) && rawToday >= 0 ? Math.floor(rawToday) : 0;

  const lastCompletedAtMs =
    typeof r.lastCompletedAtMs === 'number' && Number.isFinite(r.lastCompletedAtMs) ? r.lastCompletedAtMs : null;

  return {
    preset,
    focusMin,
    breakMin,
    phase,
    running: running && endsAtMs !== null,
    remainingSec,
    endsAtMs: running && endsAtMs !== null ? endsAtMs : null,
    cycles: {
      date: today,
      todayCount,
      totalCount: Math.max(totalCount, todayCount),
    },
    lastCompletedAtMs,
    lastLesson: sanitizeLastLesson(r.lastLesson),
  };
}

export function readPomodoroState(): PomodoroState {
  const raw = getRaw(STUDY_KEY);
  if (!raw) return defaultPomodoroState();
  try {
    return sanitizePomodoroState(JSON.parse(raw));
  } catch {
    return defaultPomodoroState();
  }
}

export function writePomodoroState(state: PomodoroState): PomodoroState {
  const clean = sanitizePomodoroState(state);
  writeJson(STUDY_KEY, clean);
  notifyLocal(clean);
  return clean;
}

export function effectiveRemainingSec(state: PomodoroState, now = Date.now()): number {
  if (state.running && state.endsAtMs !== null) {
    return Math.max(0, Math.ceil((state.endsAtMs - now) / 1000));
  }
  return Math.max(0, Math.round(state.remainingSec));
}

export function phaseTotalSec(state: PomodoroState): number {
  return (state.phase === 'break' ? state.breakMin : state.focusMin) * 60;
}

export function formatClock(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function startPomodoro(now = Date.now()): PomodoroState {
  const cur = readPomodoroState();
  if (cur.running && cur.endsAtMs !== null) return cur;
  const phase: PomodoroPhase = cur.phase === 'idle' ? 'focus' : cur.phase;
  const fallbackSec = (phase === 'break' ? cur.breakMin : cur.focusMin) * 60;
  const rem = cur.phase === 'idle' || cur.remainingSec <= 0 ? fallbackSec : cur.remainingSec;
  return writePomodoroState({
    ...cur,
    phase,
    running: true,
    remainingSec: rem,
    endsAtMs: now + rem * 1000,
  });
}

export function startFocus(now = Date.now()): PomodoroState {
  const cur = readPomodoroState();
  const rem = cur.focusMin * 60;
  return writePomodoroState({
    ...cur,
    phase: 'focus',
    running: true,
    remainingSec: rem,
    endsAtMs: now + rem * 1000,
  });
}

export function startBreak(now = Date.now()): PomodoroState {
  const cur = readPomodoroState();
  const rem = cur.breakMin * 60;
  return writePomodoroState({
    ...cur,
    phase: 'break',
    running: true,
    remainingSec: rem,
    endsAtMs: now + rem * 1000,
  });
}

export function pausePomodoro(now = Date.now()): PomodoroState {
  const cur = readPomodoroState();
  if (!cur.running) return cur;
  const rem = effectiveRemainingSec(cur, now);
  return writePomodoroState({
    ...cur,
    running: false,
    remainingSec: rem,
    endsAtMs: null,
  });
}

export function togglePomodoro(now = Date.now()): PomodoroState {
  const cur = readPomodoroState();
  return cur.running ? pausePomodoro(now) : startPomodoro(now);
}

export function resetPomodoro(): PomodoroState {
  const cur = readPomodoroState();
  const rem = (cur.phase === 'break' ? cur.breakMin : cur.focusMin) * 60;
  return writePomodoroState({
    ...cur,
    phase: cur.phase === 'break' ? 'break' : 'idle',
    running: false,
    remainingSec: rem,
    endsAtMs: null,
  });
}

export function skipBreak(): PomodoroState {
  const cur = readPomodoroState();
  return writePomodoroState({
    ...cur,
    phase: 'idle',
    running: false,
    remainingSec: cur.focusMin * 60,
    endsAtMs: null,
  });
}

export function setPomodoroPreset(
  preset: PomodoroPreset,
  customFocusMin?: number,
  customBreakMin?: number,
): PomodoroState {
  const cur = readPomodoroState();
  const focusMin =
    preset === 'custom' ? clampFocusMin(customFocusMin ?? cur.focusMin) : PRESET_MINUTES[preset].focus;
  const breakMin =
    preset === 'custom' ? clampBreakMin(customBreakMin ?? cur.breakMin) : PRESET_MINUTES[preset].break;
  const keepBreak = cur.phase === 'break';
  return writePomodoroState({
    ...cur,
    preset,
    focusMin,
    breakMin,
    phase: keepBreak ? 'break' : 'idle',
    running: false,
    remainingSec: (keepBreak ? breakMin : focusMin) * 60,
    endsAtMs: null,
  });
}

export function recordLastLesson(lesson: LastLessonRef): PomodoroState {
  const cur = readPomodoroState();
  if (
    cur.lastLesson &&
    cur.lastLesson.trackId === lesson.trackId &&
    cur.lastLesson.lessonId === lesson.lessonId &&
    cur.lastLesson.title === lesson.title &&
    cur.lastLesson.url === lesson.url
  ) {
    return cur;
  }
  return writePomodoroState({
    ...cur,
    lastLesson: lesson,
  });
}

export interface CompletionEvent {
  completedPhase: 'focus' | 'break';
  state: PomodoroState;
}

// Checks whether a running timer reached 00:00 and commits the transition atomically.
// Re-reads localStorage immediately before committing so multiple open tabs do not double-count cycles.
export function checkPomodoroCompletion(now = Date.now()): CompletionEvent | null {
  const cur = readPomodoroState();
  if (!cur.running || cur.endsAtMs === null || now < cur.endsAtMs) return null;
  const expectedEndsAt = cur.endsAtMs;
  const fresh = readPomodoroState();
  if (!fresh.running || fresh.endsAtMs !== expectedEndsAt || now < fresh.endsAtMs) return null;

  const today = todayIsoDate();
  if (fresh.phase === 'focus') {
    const todayCount = fresh.cycles.date === today ? fresh.cycles.todayCount + 1 : 1;
    const totalCount = fresh.cycles.totalCount + 1;
    const next = writePomodoroState({
      ...fresh,
      phase: 'break',
      running: false,
      remainingSec: fresh.breakMin * 60,
      endsAtMs: null,
      cycles: { date: today, todayCount, totalCount },
      lastCompletedAtMs: now,
    });
    return { completedPhase: 'focus', state: next };
  }

  if (fresh.phase === 'break') {
    const next = writePomodoroState({
      ...fresh,
      phase: 'idle',
      running: false,
      remainingSec: fresh.focusMin * 60,
      endsAtMs: null,
      lastCompletedAtMs: now,
    });
    return { completedPhase: 'break', state: next };
  }

  return null;
}

type LocalListener = (state: PomodoroState) => void;
const localListeners = new Set<LocalListener>();

function notifyLocal(state: PomodoroState): void {
  for (const fn of localListeners) fn(state);
}

export interface PomodoroControllerOptions {
  onUpdate: (state: PomodoroState, remainingSec: number) => void;
  onComplete?: (event: CompletionEvent) => void;
}

export interface PomodoroController {
  refresh(): void;
  destroy(): void;
}

export function createPomodoroController(opts: PomodoroControllerOptions): PomodoroController {
  let destroyed = false;
  let timerId: ReturnType<typeof setInterval> | null = null;

  const sync = (): void => {
    if (destroyed) return;
    const completed = checkPomodoroCompletion();
    if (completed) {
      opts.onUpdate(completed.state, effectiveRemainingSec(completed.state));
      opts.onComplete?.(completed);
      syncInterval(completed.state);
      return;
    }
    const state = readPomodoroState();
    opts.onUpdate(state, effectiveRemainingSec(state));
    syncInterval(state);
  };

  const syncInterval = (state: PomodoroState): void => {
    if (destroyed) return;
    if (state.running && !timerId) {
      timerId = setInterval(sync, 250);
    } else if (!state.running && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const localSub: LocalListener = (state) => {
    if (destroyed) return;
    opts.onUpdate(state, effectiveRemainingSec(state));
    syncInterval(state);
  };
  localListeners.add(localSub);

  const unsubStorage = onStorageSync([STUDY_KEY], () => {
    sync();
  });

  const onVis = (): void => {
    if (!document.hidden) sync();
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVis);
  }

  sync();

  return {
    refresh: sync,
    destroy(): void {
      destroyed = true;
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      localListeners.delete(localSub);
      unsubStorage();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVis);
      }
    },
  };
}
