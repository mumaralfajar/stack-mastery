// Indonesian interface dictionaries (no lesson prose), loadable on their own for client islands.
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
import uiVizsys from './ui-vizsys.js';

export const ID_UI_DICTS: readonly [string, Record<string, string>][] = [
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
  ['ui-vizsys.js', uiVizsys],
];
