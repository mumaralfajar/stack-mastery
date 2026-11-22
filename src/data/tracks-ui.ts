// Frontend, Go, System Design, and Capstone projects chunk (code-split from core tracks).
import angular from './tracks/angular.js';
import flutter from './tracks/flutter.js';
import go from './tracks/go.js';
import react from './tracks/react.js';
import sysdesign from './tracks/sysdesign.js';
import projects from './projects.js';
import type { ProjectItem, Track } from '../lib/types.ts';

export const UI_TRACKS: readonly Track[] = [react, angular, flutter, go, sysdesign] as Track[];
export const CAPSTONE_PROJECTS: readonly ProjectItem[] = projects as ProjectItem[];
