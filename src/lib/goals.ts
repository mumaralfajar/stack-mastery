// Shared learner-goal definitions and track prioritization helpers.
// Kept out of landing-island.ts and workspace-shell.ts so the landing JS bundle stays tiny.
import type { LearnerGoal } from './types.ts';

export interface GoalConfig {
  id: LearnerGoal;
  label: string;
  tagline: string;
  tracks: readonly string[];
  elevateInterview?: boolean;
}

export const GOAL_IDS: readonly LearnerGoal[] = ['cs-student', 'backend', 'frontend', 'fullstack', 'interview'];

export const GOALS: readonly GoalConfig[] = [
  {
    id: 'cs-student',
    label: 'CS Student / Fresh Grad',
    tagline: 'Build core fundamentals across CS, C#, SQL, and System Design.',
    tracks: ['cs', 'csharp', 'sql', 'sysdesign'],
  },
  {
    id: 'backend',
    label: 'Backend Engineer',
    tagline: 'Focus on APIs, concurrency, relational databases, and distributed systems.',
    tracks: ['csharp', 'aspnet', 'go', 'sql', 'sysdesign'],
  },
  {
    id: 'frontend',
    label: 'Frontend / Mobile',
    tagline: 'Master modern CSS, React, Angular, and Flutter UI architecture.',
    tracks: ['css', 'react', 'angular', 'flutter'],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Mastery',
    tagline: 'Balanced path across React, ASP.NET Core, SQL, CSS, and C#.',
    tracks: ['react', 'aspnet', 'sql', 'css', 'csharp'],
  },
  {
    id: 'interview',
    label: 'Interview Crunch',
    tagline: 'Prioritize CS fundamentals, System Design, SQL, and timed mock rounds.',
    tracks: ['cs', 'sysdesign', 'sql'],
    elevateInterview: true,
  },
];

export function isLearnerGoal(v: unknown): v is LearnerGoal {
  return typeof v === 'string' && (GOAL_IDS as readonly string[]).includes(v);
}

export function getGoalConfig(goal?: LearnerGoal | null): GoalConfig | null {
  if (!goal) return null;
  return GOALS.find((g) => g.id === goal) ?? null;
}

export function prioritizeTracks<T extends { id: string }>(
  tracks: readonly T[],
  goal?: LearnerGoal | null,
): { track: T; recommended: boolean }[] {
  const cfg = getGoalConfig(goal);
  if (!cfg) return tracks.map((track) => ({ track, recommended: false }));
  const byId = new Map(tracks.map((tr) => [tr.id, tr]));
  const picked = new Set<string>();
  const out: { track: T; recommended: boolean }[] = [];
  for (const id of cfg.tracks) {
    const tr = byId.get(id);
    if (tr) {
      picked.add(id);
      out.push({ track: tr, recommended: true });
    }
  }
  for (const tr of tracks) {
    if (!picked.has(tr.id)) out.push({ track: tr, recommended: false });
  }
  return out;
}
