// Indonesian translations part 2 (web, database & mobile tracks) split out for smaller Vite chunks.
import angularId from './tracks/angular.js';
import cssId from './tracks/css.js';
import flutterId from './tracks/flutter.js';
import reactId from './tracks/react.js';
import sqlId from './tracks/sql.js';
import sysdesignId from './tracks/sysdesign.js';
import type { TrackTranslation } from '../../lib/types.ts';

export const ID_WEB_TRACKS: readonly TrackTranslation[] = [
  sqlId,
  cssId,
  reactId,
  angularId,
  flutterId,
  sysdesignId,
] as unknown as TrackTranslation[];
