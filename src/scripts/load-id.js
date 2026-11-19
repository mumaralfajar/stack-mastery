// Dynamically loaded when Indonesian (LANG === 'id') is selected.
// Split across two async chunks so every chunk stays well below Vite's 600 kB limit.
import '../../data/id/ui-app.js';
import '../../data/id/ui-landing.js';
import '../../data/id/ui-interview.js';
import '../../data/id/ui-play.js';
import '../../data/id/ui-viz.js';
import '../../data/id/ui-viz2.js';
import '../../data/id/ui-vizplus.js';
import '../../data/id/ui-angular.js';
import '../../data/id/ui-flutter.js';
import '../../data/id/ui-vizgo.js';
import '../../data/id/csharp.js';
import '../../data/id/aspnet.js';
import '../../data/id/go.js';
import '../../data/id/fundamentals.js';
import '../../data/id/projects.js';

await import('./load-id-web.js');
await import('./i18n.js');
