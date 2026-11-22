// Core curriculum tracks chunk (kept under Vite's 600 kB chunk warning threshold).
import aspnet from './tracks/aspnet.js';
import csharp from './tracks/csharp.js';
import css from './tracks/css.js';
import fundamentals from './tracks/fundamentals.js';
import sql from './tracks/sql.js';
import type { Track } from '../lib/types.ts';

export const CORE_TRACKS: readonly Track[] = [csharp, fundamentals, sql, aspnet, css] as Track[];
