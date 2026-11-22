// Redirect a legacy `#/...` bookmark (from the old hash-routed SPA) to its static page.
// The saved language preference wins over the page language, so '/stack-mastery/#/lab' opens '/id/lab/' for ID users.
import { LANG_KEY } from '../lib/keys.ts';
import { isLang, isLegacyHash, langFromPath, legacyHashToPath } from '../lib/routes.ts';

if (isLegacyHash(location.hash)) {
  let lang = langFromPath(location.pathname);
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) lang = saved;
  } catch {
    /* private mode */
  }
  location.replace(legacyHashToPath(location.hash, lang));
} else {
  document.documentElement.removeAttribute('data-legacy-redirect');
}
