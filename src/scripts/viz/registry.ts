// Lazy registry for all 40 interactive visual labs.
import type { VizLab } from '../../lib/types.ts';

export const VIZ: Record<string, VizLab> = {};

let vizPromise: Promise<Record<string, VizLab>> | null = null;

export function registerViz(labs: Record<string, VizLab>): void {
  Object.assign(VIZ, labs);
}

export function loadAllViz(): Promise<Record<string, VizLab>> {
  if (!vizPromise) {
    vizPromise = Promise.all([
      import('./viz.js'),
      import('./vizcss.js'),
      import('./vizmore.js'),
      import('./vizangular.js'),
      import('./vizflutter.js'),
      import('./vizplus.js'),
      import('./vizgo.js'),
      import('./vizsys.js'),
    ]).then(() => VIZ);
  }
  return vizPromise;
}
