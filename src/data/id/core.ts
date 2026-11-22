// Indonesian translations part 1 (backend/core tracks and projects).
import aspnetId from './tracks/aspnet.js';
import csharpId from './tracks/csharp.js';
import fundamentalsId from './tracks/fundamentals.js';
import goId from './tracks/go.js';
import projectsId from './projects.js';
import type { ProjectTranslation, TrackTranslation } from '../../lib/types.ts';

export const ID_CORE_TRACKS: readonly TrackTranslation[] = [
  csharpId,
  aspnetId,
  goId,
  fundamentalsId,
] as unknown as TrackTranslation[];

export const ID_PROJECTS: readonly ProjectTranslation[] = projectsId as ProjectTranslation[];
