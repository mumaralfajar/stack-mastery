// Lazy registry for all 40 interactive visual labs.
// Pages call loadViz(id) to import only the one module that defines that lab; loadAllViz() is for the build.
import type { VizLab } from '../../lib/types.ts';

export const VIZ: Record<string, VizLab> = {};

export function registerViz(labs: Record<string, VizLab>): void {
  Object.assign(VIZ, labs);
}

const LOADERS = {
  viz: () => import('./viz.js'),
  vizcss: () => import('./vizcss.js'),
  vizmore: () => import('./vizmore.js'),
  vizangular: () => import('./vizangular.js'),
  vizflutter: () => import('./vizflutter.js'),
  vizplus: () => import('./vizplus.js'),
  vizgo: () => import('./vizgo.js'),
  vizsys: () => import('./vizsys.js'),
};

export type VizModule = keyof typeof LOADERS;

// Which module defines each lab. The key order is the canonical lab order on /lab/.
export const VIZ_MODULE: Readonly<Record<string, VizModule>> = {
  stackheap: 'viz',
  async: 'viz',
  linq: 'viz',
  middleware: 'viz',
  di: 'viz',
  joins: 'viz',
  sqlorder: 'viz',
  index: 'viz',
  rerender: 'viz',
  journey: 'viz',
  specificity: 'vizcss',
  boxmodel: 'vizcss',
  flexbox: 'vizcss',
  grid: 'vizcss',
  bigo: 'vizmore',
  sort: 'vizmore',
  eventloop: 'vizmore',
  graphsearch: 'vizmore',
  ngsignals: 'vizangular',
  ngcd: 'vizangular',
  constraints: 'vizflutter',
  frebuild: 'vizflutter',
  threetrees: 'vizflutter',
  sqllock: 'vizplus',
  sqlwindow: 'vizplus',
  ngrxjs: 'vizplus',
  useeffect: 'vizplus',
  stacking: 'vizplus',
  backtrack: 'vizplus',
  dptable: 'vizplus',
  goslices: 'vizgo',
  goiface: 'vizgo',
  goroutine: 'vizgo',
  gocontext: 'vizgo',
  syscache: 'vizsys',
  sysratelimit: 'vizsys',
  sysdbscale: 'vizsys',
  syshash: 'vizsys',
  sysqueue: 'vizsys',
  sysresilience: 'vizsys',
};

export const VIZ_IDS: readonly string[] = Object.keys(VIZ_MODULE);

const modulePromises = new Map<VizModule, Promise<unknown>>();

function loadModule(m: VizModule): Promise<unknown> {
  let p = modulePromises.get(m);
  if (!p) {
    p = LOADERS[m]();
    modulePromises.set(m, p);
  }
  return p;
}

// Import just the module that defines `id` and return that lab (undefined for an unknown id).
export function loadViz(id: string): Promise<VizLab | undefined> {
  const m = Object.hasOwn(VIZ_MODULE, id) ? VIZ_MODULE[id] : undefined;
  if (!m) return Promise.resolve(undefined);
  return loadModule(m).then(() => VIZ[id]);
}

// Every lab module — only for build-time pages and tooling, never for a single lesson or lab page.
export function loadAllViz(): Promise<Record<string, VizLab>> {
  return Promise.all((Object.keys(LOADERS) as VizModule[]).map(loadModule)).then(() => VIZ);
}
