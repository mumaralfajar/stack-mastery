// Safe localStorage helpers, cross-tab storage listener, and JSON backup export/import.
import { alertDialog, confirmDialog, h } from './dom.ts';
import { t } from './i18n.ts';
import { INTERVIEW_KEY, LANG_KEY, SQL_KEY, STORAGE_KEY } from './keys.ts';

export { INTERVIEW_KEY, LANG_KEY, SQL_KEY, STORAGE_KEY };

export const BACKUP_KEYS: readonly string[] = [STORAGE_KEY, SQL_KEY, INTERVIEW_KEY, LANG_KEY];

export function getRaw(key: string): string | null {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function setRaw(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    /* private mode or quota exceeded */
  }
}

export function removeRaw(key: string): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readJson<T>(key: string, fallback: () => T): T {
  const raw = getRaw(key);
  if (!raw) return fallback();
  try {
    const parsed = JSON.parse(raw);
    const base = fallback();
    if (base && typeof base === 'object' && !Array.isArray(base) && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return Object.assign(base, parsed);
    }
    return parsed as T;
  } catch {
    return fallback();
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    setRaw(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function onStorageSync(
  keys: readonly string[],
  handler: (key: string | null, newValue: string | null) => void,
): () => void {
  if (typeof addEventListener === 'undefined') return () => {};
  const set = new Set(keys);
  const listener = (e: StorageEvent) => {
    if (e.key !== null && !set.has(e.key)) return;
    handler(e.key, e.key === null ? null : e.newValue);
  };
  addEventListener('storage', listener);
  return () => removeEventListener('storage', listener);
}

export function resetAllProgress(): void {
  for (const k of [STORAGE_KEY, SQL_KEY, INTERVIEW_KEY]) {
    removeRaw(k);
  }
}

export function exportBackup(): void {
  const today = new Date().toLocaleDateString('sv');
  const keys = Object.fromEntries(
    BACKUP_KEYS.map((k) => [k, getRaw(k)]).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0),
  );
  const data = { app: 'stack-mastery', exported: new Date().toISOString(), keys };
  const a = h('a', {
    href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })),
    download: `stack-mastery-backup-${today}.json`,
  });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function importBackup(): void {
  const input = h('input', {
    type: 'file',
    accept: 'application/json,.json',
    onchange: async () => {
      try {
        const file = input.files?.[0];
        if (!file) return;
        const data = JSON.parse(await file.text()) as { app?: string; exported?: string; keys?: Record<string, unknown> };
        if (data.app !== 'stack-mastery' || !data.keys || typeof data.keys !== 'object') {
          throw new Error(t('not a Stack Mastery backup file'));
        }
        const entries = Object.entries(data.keys).filter(
          (entry): entry is [string, string] => BACKUP_KEYS.includes(entry[0]) && typeof entry[1] === 'string',
        );
        for (const [k, v] of entries) {
          if (k === LANG_KEY) {
            if (v !== 'en' && v !== 'id') throw new Error(t('not a Stack Mastery backup file'));
          } else {
            JSON.parse(v); // every progress value must itself be valid JSON
          }
        }
        const ok = await confirmDialog(
          t('Replace the progress in this browser with the backup from {date}?', {
            date: String(data.exported).slice(0, 10),
          }),
          { title: 'Import backup', confirmText: 'Import backup', danger: true },
        );
        if (!ok) return;
        // Older backups have no language entry: keep the current language instead of clearing it.
        const hasLang = entries.some(([k]) => k === LANG_KEY);
        for (const k of BACKUP_KEYS) {
          if (k !== LANG_KEY || hasLang) removeRaw(k);
        }
        for (const [k, v] of entries) {
          setRaw(k, v);
        }
        location.reload();
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await alertDialog(t('Could not import: ') + msg);
      }
    },
  });
  input.click();
}
