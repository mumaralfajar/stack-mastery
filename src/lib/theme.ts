// Dependency-free theme helpers shared by the landing page (no state store) and the study state store.
import { STORAGE_KEY } from './keys.ts';

export type ThemePref = '' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export function systemPrefersDark(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
}

// Flip the effective theme; returns '' when the new theme equals the system preference.
export function nextThemePref(current: ThemePref, sysDark: boolean): ThemePref {
  const curDark = current ? current === 'dark' : sysDark;
  const nextDark = !curDark;
  return nextDark === sysDark ? '' : nextDark ? 'dark' : 'light';
}

export function applyThemePref(pref: ThemePref): void {
  if (typeof document === 'undefined') return;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (pref === 'light' || pref === 'dark') {
    document.documentElement.dataset.theme = pref;
    if (meta) meta.content = pref;
  } else {
    delete document.documentElement.dataset.theme;
    if (meta) meta.content = 'light dark';
  }
}

// Toggle the theme stored inside the progress JSON without loading the full state store.
export function toggleStoredTheme(): ThemePref {
  let data: { theme?: ThemePref } = {};
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    data = {};
  }
  const next = nextThemePref(data.theme === 'light' || data.theme === 'dark' ? data.theme : '', systemPrefersDark());
  data.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* private mode */
  }
  applyThemePref(next);
  return next;
}

// The theme the page is actually showing: an explicit data-theme wins, otherwise the OS preference.
export function resolvedTheme(): ResolvedTheme {
  if (typeof document === 'undefined') return 'light';
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return systemPrefersDark() ? 'dark' : 'light';
}

// Calls `listener` whenever the resolved theme changes: a toggle (data-theme, also set by another tab's sync)
// or an OS prefers-color-scheme change. Returns a function that stops listening.
export function watchTheme(listener: (theme: ResolvedTheme) => void): () => void {
  if (typeof document === 'undefined') return () => {};
  let last = resolvedTheme();
  const check = () => {
    const now = resolvedTheme();
    if (now === last) return;
    last = now;
    listener(now);
  };
  const observer = new MutationObserver(check);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
  mq?.addEventListener('change', check);
  return () => {
    observer.disconnect();
    mq?.removeEventListener('change', check);
  };
}
