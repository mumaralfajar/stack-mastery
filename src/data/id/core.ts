// Indonesian translations part 1 (UI dictionaries, backend/core tracks, and projects).
import aspnetId from './tracks/aspnet.js';
import csharpId from './tracks/csharp.js';
import fundamentalsId from './tracks/fundamentals.js';
import goId from './tracks/go.js';
import projectsId from './projects.js';
import uiAngular from './ui-angular.js';
import uiApp from './ui-app.js';
import uiFlutter from './ui-flutter.js';
import uiInterview from './ui-interview.js';
import uiLanding from './ui-landing.js';
import uiPlay from './ui-play.js';
import uiViz from './ui-viz.js';
import uiViz2 from './ui-viz2.js';
import uiVizgo from './ui-vizgo.js';
import uiVizplus from './ui-vizplus.js';
import type { ProjectTranslation, TrackTranslation } from '../../lib/types.ts';

export const ID_CORE_UI_DICTS: readonly [string, Record<string, string>][] = [
  ['ui-app.js', uiApp],
  ['ui-landing.js', uiLanding],
  ['ui-interview.js', uiInterview],
  ['ui-play.js', uiPlay],
  ['ui-viz.js', uiViz],
  ['ui-viz2.js', uiViz2],
  ['ui-vizplus.js', uiVizplus],
  ['ui-angular.js', uiAngular],
  ['ui-flutter.js', uiFlutter],
  ['ui-vizgo.js', uiVizgo],
];

export const ID_CORE_TRACKS: readonly TrackTranslation[] = [
  csharpId,
  aspnetId,
  goId,
  fundamentalsId,
] as unknown as TrackTranslation[];

export const ID_PROJECTS: readonly ProjectTranslation[] = projectsId as ProjectTranslation[];
