// Lazy Indonesian translation loaders — registers translations into the immutable i18n store.
import {
  registerInterviewTranslation,
  registerProjectsTranslation,
  registerTrackTranslation,
  registerUiDict,
} from '../../lib/i18n.ts';
import type { InterviewTranslation } from '../../lib/types.ts';

let idUiPromise: Promise<void> | null = null;
let idCurriculumPromise: Promise<void> | null = null;
let idInterviewPromise: Promise<void> | null = null;

// Interface strings only (buttons, labels, lab captions) — no lesson prose.
export function loadIdUi(): Promise<void> {
  if (!idUiPromise) {
    idUiPromise = import('./ui.ts').then(({ ID_UI_DICTS }) => {
      for (const [, dict] of ID_UI_DICTS) registerUiDict(dict);
    });
  }
  return idUiPromise;
}

export function loadIdCurriculum(): Promise<void> {
  if (!idCurriculumPromise) {
    idCurriculumPromise = Promise.all([loadIdUi(), import('./core.ts'), import('./web.ts')]).then(([, core, web]) => {
      for (const tr of core.ID_CORE_TRACKS) registerTrackTranslation(tr);
      for (const tr of web.ID_WEB_TRACKS) registerTrackTranslation(tr);
      registerProjectsTranslation(core.ID_PROJECTS);
    });
  }
  return idCurriculumPromise;
}

export function loadIdInterview(): Promise<void> {
  if (!idInterviewPromise) {
    idInterviewPromise = import('./interview.js').then(({ interviewId }) => {
      registerInterviewTranslation(interviewId as unknown as InterviewTranslation);
    });
  }
  return idInterviewPromise;
}
