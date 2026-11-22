// Interview data loader, kept apart from the curriculum so interview pages never pull lesson prose.
import { registerInterview } from '../lib/i18n.ts';
import type { InterviewData } from '../lib/types.ts';

let interviewPromise: Promise<InterviewData> | null = null;

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
