// Lightweight goal selector hydration for /start/ (StartPage.astro).
// Updates S.onboarding.goal, highlights matching tracks, and syncs across tabs.
import { LESSON_INDEX, TRACK_META } from '../data/manifest.ts';
import { h } from '../lib/dom.ts';
import { getGoalConfig, isLearnerGoal } from '../lib/goals.ts';
import { getLang, registerUiDict, t as T } from '../lib/i18n.ts';
import { routePath } from '../lib/routes.ts';
import { S, notifyStateChange, save, subscribeState } from '../lib/state.ts';
import type { LessonIndexEntry } from '../lib/types.ts';

const root = document.querySelector<HTMLElement>('[data-start-goal]');
if (root) {
  try {
    const dict = JSON.parse(document.getElementById('start-goal-i18n')?.textContent || '{}') as Record<string, string>;
    registerUiDict(dict);
  } catch {
    /* ignore */
  }

  const lang = getLang();
  const trackById = new Map(TRACK_META.map((tr) => [tr.id, tr]));
  const firstLessonOf = (trackId: string): LessonIndexEntry | undefined =>
    LESSON_INDEX.find((l) => l.trackId === trackId);
  const trackName = (trackId: string): string => {
    const tr = trackById.get(trackId);
    if (!tr) return trackId;
    return lang === 'id' && tr.nameId ? tr.nameId : tr.name;
  };

  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-goal]')];
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-goal-clear]');
  const summaryEl = root.querySelector<HTMLElement>('[data-goal-summary]');
  const tracksEl = root.querySelector<HTMLElement>('[data-goal-tracks]');
  const ctaLink = document.querySelector<HTMLAnchorElement>('[data-start-cta]');

  const draw = () => {
    const goal = S.onboarding?.goal || null;
    const cfg = getGoalConfig(goal);

    for (const btn of buttons) {
      const on = btn.dataset.goal === goal;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', String(on));
    }
    if (clearBtn) clearBtn.hidden = !cfg;

    if (summaryEl) {
      summaryEl.textContent = cfg
        ? `${T(cfg.label)}: ${T(cfg.tagline)}`
        : T('Pick a goal to prioritize matching tracks first. Every track stays available.');
    }

    if (tracksEl) {
      if (!cfg) {
        tracksEl.replaceChildren();
        tracksEl.hidden = true;
      } else {
        tracksEl.hidden = false;
        const trackLinks: (string | Node)[] = [
          h('span', { class: 'muted' }, 'Recommended tracks:'),
          ...cfg.tracks.map((id) =>
            h(
              'a',
              {
                class: 'chip-link',
                href: routePath(lang, `/track/${id}/`),
                style: { '--tc': `var(--${id})` },
              },
              trackName(id),
            ),
          ),
        ];
        if (cfg.elevateInterview) {
          trackLinks.push(h('a', { class: 'chip-link', href: routePath(lang, '/interview/') }, 'Interview hub'));
        }
        tracksEl.replaceChildren(...trackLinks);
      }
    }

    if (ctaLink) {
      const firstTrackId = cfg?.tracks[0] || 'csharp';
      const firstLesson = firstLessonOf(firstTrackId);
      if (cfg && firstLesson) {
        ctaLink.setAttribute('href', routePath(lang, `/lesson/${firstTrackId}/${firstLesson.id}/`));
        ctaLink.textContent = T('Begin with {track} lesson one →', { track: trackName(firstTrackId) });
      } else {
        ctaLink.setAttribute('href', routePath(lang, '/lesson/csharp/types/'));
        ctaLink.textContent = T('Begin with C# lesson one →');
      }
    }
  };

  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      const g = btn.dataset.goal;
      if (!isLearnerGoal(g)) return;
      S.onboarding = { ...S.onboarding, goal: g };
      save();
      notifyStateChange('study');
      draw();
    });
  }

  clearBtn?.addEventListener('click', () => {
    S.onboarding = {};
    save();
    notifyStateChange('study');
    draw();
  });

  draw();
  subscribeState(draw);
}
