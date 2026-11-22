// Dependency-free theme helpers shared by the landing page (no state store) and the study state store.
import { STORAGE_KEY } from './keys.ts';

export type ThemePref = '' | 'light' | 'dark';

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
