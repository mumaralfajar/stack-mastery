// Hydrates the static sidebar on every workspace page: progress numbers, due badge, mobile drawer,
// language/theme toggles, keyboard shortcuts, backup controls and cross-tab refresh.
// Imports only the manifest-backed lib/* modules — never the curriculum data.
import { confirmDialog } from '../lib/dom.ts';
import { getLang, registerUiDict, t } from '../lib/i18n.ts';
import { LANG_KEY } from '../lib/keys.ts';
import { dueCountIndex, trackPctIndex } from '../lib/progress.ts';
import { alternateUrl, isLang, routePath } from '../lib/routes.ts';
import { applyTheme, interviewReadiness, subscribeState, toggleTheme } from '../lib/state.ts';
import { exportBackup, importBackup, resetAllProgress, setRaw } from '../lib/storage.ts';

const nav = document.getElementById('nav');
const lang = getLang();

try {
  const dict = JSON.parse(document.getElementById('shell-i18n')?.textContent || '{}') as Record<string, string>;
  registerUiDict(dict);
} catch {
  /* untranslated dialogs are still usable */
}

applyTheme();

let menuOpen = false;
const mobileQuery = matchMedia('(max-width: 860px)');

function setMenu(open: boolean, { restoreFocus = false } = {}): void {
  if (!nav) return;
  const wasOpen = menuOpen;
  menuOpen = open;
  const isMobile = mobileQuery.matches;
  nav.classList.toggle('open', menuOpen);
  document.body.classList.toggle('nav-open', menuOpen);
  const view = document.getElementById('view');
  if (view) view.inert = menuOpen && isMobile;
  const top = nav.querySelector<HTMLElement>('.nav-top');
  if (top) top.inert = menuOpen && isMobile;
  const drawer = nav.querySelector('.nav-drawer');
  if (drawer) {
    if (menuOpen && isMobile) {
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', t('Main'));
    } else {
      drawer.removeAttribute('role');
      drawer.removeAttribute('aria-modal');
      drawer.removeAttribute('aria-label');
    }
  }
  const btn = nav.querySelector<HTMLButtonElement>('.nav-toggle');
  btn?.setAttribute('aria-expanded', String(menuOpen));
  if (menuOpen && !wasOpen) {
    nav.querySelector('.nav-link.on')?.scrollIntoView({ block: 'nearest' });
    const closeBtn = nav.querySelector<HTMLButtonElement>('[data-nav-close]');
    if (closeBtn && isMobile) closeBtn.focus({ preventScroll: true });
  } else if (!menuOpen && wasOpen && restoreFocus && btn && isMobile) {
    btn.focus({ preventScroll: true });
  }
}

mobileQuery.addEventListener('change', (e) => {
  if (!e.matches && menuOpen) setMenu(false);
});

// Recompute the live numbers in the static sidebar from the manifest and local progress.
export function refreshShell(): void {
  if (!nav) return;
  for (const el of nav.querySelectorAll<HTMLElement>('[data-track-pct]')) {
    el.textContent = trackPctIndex(el.dataset.trackPct || '') + '%';
  }
  const due = dueCountIndex();
  for (const el of nav.querySelectorAll<HTMLElement>('[data-due-badge]')) {
    el.textContent = String(due);
    el.hidden = due === 0;
  }
  for (const el of nav.querySelectorAll<HTMLElement>('[data-iv-pct]')) {
    el.textContent = interviewReadiness() + '%';
  }
}

if (nav) {
  nav.querySelector('.nav-toggle')?.addEventListener('click', () => setMenu(!menuOpen));
  nav.querySelector('[data-nav-close]')?.addEventListener('click', () => setMenu(false, { restoreFocus: true }));
  nav.querySelector('.nav-backdrop')?.addEventListener('click', () => setMenu(false, { restoreFocus: true }));
  for (const a of nav.querySelectorAll('a.nav-link, a.brand')) a.addEventListener('click', () => setMenu(false));
  nav.querySelector('[data-theme-toggle]')?.addEventListener('click', () => toggleTheme());
  nav.querySelector('[data-export]')?.addEventListener('click', () => exportBackup());
  nav.querySelector('[data-import]')?.addEventListener('click', () => importBackup());
  nav.querySelector('[data-reset]')?.addEventListener('click', async () => {
    const ok = await confirmDialog(
      t('Erase all progress, notes, flashcard history and interview prep data? This cannot be undone.'),
      { title: 'Reset progress', confirmText: 'Reset progress', danger: true },
    );
    if (!ok) return;
    resetAllProgress();
    location.assign(routePath(lang, '/dashboard/'));
  });
  const langLink = nav.querySelector<HTMLAnchorElement>('a[data-set-lang]');
  if (langLink) {
    const target = langLink.dataset.setLang;
    if (isLang(target)) {
      // Keep the query string (e.g. ?sample=joins) when switching language.
      langLink.href = alternateUrl(target, location.pathname, location.search);
      langLink.addEventListener('click', () => setRaw(LANG_KEY, target));
    }
  }
}

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    setMenu(false, { restoreFocus: true });
    return;
  }
  const target = e.target as HTMLElement | null;
  if (
    e.key === '/' &&
    !e.ctrlKey &&
    !e.metaKey &&
    !target?.closest('input, textarea, select, [contenteditable], .monaco-host') &&
    !document.querySelector('dialog[open]')
  ) {
    const searchInput = document.querySelector<HTMLInputElement>('#view input[type="search"]');
    e.preventDefault();
    if (searchInput) searchInput.focus();
    else location.assign(routePath(lang, '/search/'));
  }
});

// Progress saved in this tab or another one: refresh the sidebar numbers in place.
subscribeState(() => refreshShell());
refreshShell();
