// Build-time quiz index (served as /quiz-index.json and /id/quiz-index.json), so /review/ and /exam/
// never load lesson prose, code samples, or capstone projects in the browser.
import type { Lang, LevelIndex, QuizItem } from '../lib/types.ts';
import { getAllTracks, loadSiteData } from './site.ts';

export interface QuizIndexLesson {
  id: string;
  title: string;
  level: LevelIndex;
  quiz: QuizItem[];
}

export interface QuizIndexTrack {
  id: string;
  name: string;
  lessons: QuizIndexLesson[];
}

export interface QuizIndexData {
  tracks: QuizIndexTrack[];
}

export async function buildQuizIndex(lang: Lang): Promise<QuizIndexData> {
  await loadSiteData();
  return {
    tracks: getAllTracks(lang).map((tr) => ({
      id: tr.id,
      name: tr.name,
      lessons: tr.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        level: l.level,
        quiz: l.quiz,
      })),
    })),
  };
}
