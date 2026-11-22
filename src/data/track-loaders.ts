// Load one curriculum track (plus its Indonesian overlay) without pulling every other track's prose.
import { getTrack, registerTrack, registerTrackTranslation } from '../lib/i18n.ts';
import type { Lang, Track, TrackTranslation } from '../lib/types.ts';

type Loader<T> = () => Promise<{ default: T }>;

const EN: Record<string, Loader<unknown>> = {
  flutter: () => import('./tracks/flutter.js'),
};

const ID: Record<string, Loader<unknown>> = {
  flutter: () => import('./id/tracks/flutter.js'),
};

const loaded = new Map<string, Promise<Track | undefined>>();

export function loadTrackData(id: string, lang: Lang): Promise<Track | undefined> {
  const cacheKey = `${id}:${lang}`;
  let p = loaded.get(cacheKey);
  if (!p) {
    const en = EN[id];
    const tr = lang === 'id' ? ID[id] : undefined;
    p = Promise.all([en ? en() : Promise.resolve(undefined), tr ? tr() : Promise.resolve(undefined)]).then(
      ([enMod, idMod]) => {
        if (enMod) registerTrack(enMod.default as Track);
        if (idMod) registerTrackTranslation(idMod.default as TrackTranslation);
        return getTrack(id, lang);
      },
    );
    loaded.set(cacheKey, p);
  }
  return p;
}
