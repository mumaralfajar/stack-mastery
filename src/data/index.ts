// Curriculum data loaders: register English tracks and projects into the i18n store.
import { registerProjects, registerTrack } from '../lib/i18n.ts';
import { CORE_TRACKS } from './tracks-core.ts';

export { loadInterviewData } from './interview-data.ts';

let curriculumLoaded = false;
let curriculumPromise: Promise<void> | null = null;

// Register the core 5 tracks immediately (synchronous).
for (const tr of CORE_TRACKS) {
  registerTrack(tr);
}

export function loadCurriculum(): Promise<void> {
  if (curriculumLoaded) return Promise.resolve();
  if (!curriculumPromise) {
    curriculumPromise = import('./tracks-ui.ts').then(({ UI_TRACKS, CAPSTONE_PROJECTS }) => {
      for (const tr of UI_TRACKS) registerTrack(tr);
      registerProjects(CAPSTONE_PROJECTS);
      curriculumLoaded = true;
    });
  }
  return curriculumPromise;
}
