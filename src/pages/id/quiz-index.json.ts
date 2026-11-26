// Indonesian quiz index, built once at build time.
import type { APIRoute } from 'astro';
import { buildQuizIndex } from '../../data/quiz-index.ts';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildQuizIndex('id')), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
