// Build-time aggregator for Astro pages: loads every track, translation, interview set and lab once.
// Never import this from client scripts — it pulls the whole curriculum.
import { VIZ, VIZ_IDS, loadAllViz } from '../scripts/viz/registry.ts';
import type { Lang, VizLab } from '../lib/types.ts';
import { getAllTracks, getInterview, getProjects, getTrack, t } from '../lib/i18n.ts';
import { loadIdCurriculum, loadIdInterview } from './id/index.ts';
import { loadCurriculum, loadInterviewData } from './index.ts';

let ready: Promise<void> | null = null;

export function loadSiteData(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await loadCurriculum();
      await Promise.all([loadInterviewData(), loadIdCurriculum(), loadIdInterview(), loadAllViz()]);
    })();
  }
  return ready;
}

export interface VizEntry {
  id: string;
  lab: VizLab;
  title: string;
  desc: string;
}

// Labs in their canonical order, with title/description translated for `lang`.
export function vizEntries(lang: Lang): VizEntry[] {
  return VIZ_IDS.filter((id) => VIZ[id]).map((id) => ({
    id,
    lab: VIZ[id],
    title: t(VIZ[id].title, lang),
    desc: t(VIZ[id].desc, lang),
  }));
}

export { getAllTracks, getInterview, getProjects, getTrack };
