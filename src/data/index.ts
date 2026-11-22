// Curriculum data loaders: register English tracks, projects, and interview data into the i18n store.
import { registerInterview, registerProjects, registerTrack } from '../lib/i18n.ts';
import type { InterviewData } from '../lib/types.ts';
import { CORE_TRACKS } from './tracks-core.ts';

let curriculumLoaded = false;
let curriculumPromise: Promise<void> | null = null;
let interviewPromise: Promise<InterviewData> | null = null;

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

export function loadInterviewData(): Promise<InterviewData> {
  if (!interviewPromise) {
    interviewPromise = Promise.all([import('./interview.js'), import('./interview-cs.js')]).then(
      ([{ interview }, { interviewUi, interviewCs }]) => {
        const merged = {
          ...interview,
          ui: interviewUi,
          cs: interviewCs,
        } as unknown as InterviewData;
        registerInterview(merged);
        return merged;
      },
    );
  }
  return interviewPromise;
}
