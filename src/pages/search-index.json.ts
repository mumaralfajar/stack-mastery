// English search index, built once at build time.
import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../data/search-index.ts';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildSearchIndex('en')), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
