export type Lang = 'en' | 'id';

export type LevelIndex = 0 | 1 | 2 | 3;

export interface QuizItem {
  q: string;
  a: string[];
  c: number;
  why: string;
}

export interface PredictChallenge {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export type SplitCode = [label: string, anchor: string];

export interface Lesson {
  id: string;
  title: string;
  level: LevelIndex;
  mins: number;
  why: string;
  terms?: [string, string][];
  points: string[];
  predict?: PredictChallenge;
  code?: string;
  lang?: string;
  splits?: SplitCode[];
  viz?: string;
  practice: string;
  teach: string;
  analogy: string;
  pitfalls: string[];
  quiz: QuizItem[];
}

export interface Track {
  id: string;
  name: string;
  lang: string;
  tagline: string;
  lessons: Lesson[];
}

export interface TrackMeta {
  id: string;
  name: string;
  nameId?: string;
  lang: string;
  tagline: string;
  taglineId?: string;
  lessonCount: number;
}

export interface LessonIndexEntry {
  trackId: string;
  id: string;
  level: LevelIndex;
  mins: number;
  viz?: string;
  /** Number of quiz questions, so flashcard due counts never need the lesson prose. */
  quizCount: number;
}

export interface VizLab {
  track: string;
  trackName: string;
  title: string;
  desc: string;
  mount: (el: HTMLElement) => void;
}

export interface ProjectItem {
  level: LevelIndex;
  title: string;
  brief: string;
  build: string[];
  stretch: string[];
  teach: string;
}

export interface InterviewPattern {
  id: string;
  name: string;
  signal: string;
  cost: string;
  code: string;
}

export interface InterviewProblem {
  id: string;
  title: string;
  diff: 0 | 1 | 2;
  pattern: string;
  fn: string;
  call?: string;
  mode?: 'set' | 'nested';
  prompt: string;
  examples: string[];
  starter: string;
  solution: string;
  tests: [unknown[], unknown][];
  hints: string[];
  complexity: string;
  follow: string[];
}

export interface DesignCase {
  id: string;
  title: string;
  prompt: string;
  req: string[];
  est: string[];
  api: string[];
  tiers: string[][];
  deep: [string, string][];
  follow: string[];
}

export interface BehavioralTheme {
  id: string;
  name: string;
  looks: string;
  qs: string[];
}

export interface RapidArea {
  area: string;
  track: string;
  key?: string;
  qs: [string, string][];
}

export interface InterviewData {
  method: [string, string][];
  patterns: InterviewPattern[];
  problems: InterviewProblem[];
  bigO: [string, string][];
  design: {
    framework: [string, string, string][];
    blocks: [string, string][];
    cases: DesignCase[];
  };
  behavioral: BehavioralTheme[];
  rapid: RapidArea[];
  plan: [string, string[]][];
  hiring: string[];
  ui: [string, string, string][];
  cs: Record<string, string>;
}

export interface InterviewTotals {
  problems: number;
  cases: number;
  behavioralThemes: number;
  rapidTotal: number;
  maxMocks: number;
}

export type LearnerGoal = 'cs-student' | 'backend' | 'frontend' | 'fullstack' | 'interview';

export interface ExamAttempt {
  date: string;
  track: string;
  score: number;
  total: number;
}

export type SrsGrade = 'again' | 'hard' | 'good' | 'easy';

export interface SrsCard {
  due: string;
  box?: number;
  interval?: number;
  ease?: number;
  reps?: number;
  lapses?: number;
}

export interface AdaptiveSrsCard {
  due: string;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  box?: number;
}

export interface StudyOnboarding {
  goal?: LearnerGoal;
}

export interface LessonProgress {
  read?: boolean;
  quiz?: boolean;
  teach?: boolean;
  pred?: boolean;
  q?: Record<number, boolean>;
  notes?: string;
  rubric?: boolean[];
}

export interface StudyProgress {
  lessons: Record<string, LessonProgress>;
  cards: Record<string, SrsCard>;
  projects: Record<number, boolean[]>;
  streak: {
    last: string;
    count: number;
  };
  theme: '' | 'light' | 'dark';
  onboarding?: StudyOnboarding;
  examHistory?: ExamAttempt[];
}

export interface InterviewStory {
  title: string;
  s: string;
  t: string;
  a: string;
  r: string;
  ref: string;
  tags: string[];
}

export interface MockInterviewEntry {
  date: string;
  type: 'coding' | 'design' | 'behavioral' | 'rapid';
  title: string;
  scores: number[];
  avg: number;
  notes: string;
}

export interface InterviewProgress {
  solved: Record<string, boolean>;
  code: Record<string, string>;
  design: Record<string, boolean>;
  stories: InterviewStory[];
  rapid: Record<string, 1 | 2>;
  mocks: MockInterviewEntry[];
  plan: Record<number, boolean[]>;
}

export type PomodoroPreset = '25/5' | '50/10' | 'custom';
export type PomodoroPhase = 'idle' | 'focus' | 'break';

export interface LastLessonRef {
  trackId: string;
  lessonId: string;
  title: string;
  url: string;
}

export interface StudyCycles {
  date: string;
  todayCount: number;
  totalCount: number;
}

export interface PomodoroState {
  preset: PomodoroPreset;
  focusMin: number;
  breakMin: number;
  phase: PomodoroPhase;
  running: boolean;
  remainingSec: number;
  endsAtMs: number | null;
  cycles: StudyCycles;
  lastCompletedAtMs: number | null;
  lastLesson: LastLessonRef | null;
}

export interface LessonTranslation {
  title?: string;
  why?: string;
  terms?: [string, string][];
  points?: string[];
  practice?: string;
  teach?: string;
  analogy?: string;
  pitfalls?: string[];
  code?: string;
  splits?: string[];
  predict?: Partial<PredictChallenge>;
  quiz?: [string, string[], string][];
}

export interface TrackTranslation {
  id: string;
  name?: string;
  tagline?: string;
  lessons: Record<string, LessonTranslation>;
}

export interface ProjectTranslation {
  title?: string;
  brief?: string;
  build?: string[];
  stretch?: string[];
  teach?: string;
}

export interface InterviewTranslation {
  method?: [string, string][];
  bigO?: [string, string][];
  plan?: [string, string[]][];
  hiring?: string[];
  ui?: [string, string, string][];
  patterns?: Record<string, Partial<Pick<InterviewPattern, 'name' | 'signal' | 'cost'>>>;
  problems?: Record<string, Partial<Pick<InterviewProblem, 'title' | 'prompt' | 'hints' | 'complexity' | 'follow'>>>;
  design?: {
    framework?: [string, string, string][];
    blocks?: [string, string][];
    cases?: Record<string, Partial<Pick<DesignCase, 'title' | 'prompt' | 'req' | 'est' | 'tiers' | 'deep' | 'follow'>>>;
  };
  behavioral?: Record<string, Partial<Pick<BehavioralTheme, 'name' | 'looks' | 'qs'>>>;
  rapid?: Partial<Pick<RapidArea, 'area' | 'qs'>>[];
}
