// Stack Mastery service worker: offline support for the static site under /stack-mastery/.
// - Precaches the core shell on install; deletes caches from older versions on activate.
// - Only handles same-origin GET requests under /stack-mastery/. Cross-origin requests (cdnjs, esm.sh,
//   jsDelivr, DartPad, fonts…) are never intercepted, so playground runtimes always hit the network.
// - Pages: network-first, falling back to the cached page, then the offline 404 page.
// - Hashed build assets (/stack-mastery/_astro/*): cache-first (file names change whenever content changes).
// - Other same-origin files (search index, icons, manifest): stale-while-revalidate.
const VERSION = 'stack-mastery-v2';
const SCOPE = '/stack-mastery/';
const SHELL = [
  '/stack-mastery/',
  '/stack-mastery/id/',
  '/stack-mastery/dashboard/',
  '/stack-mastery/id/dashboard/',
  '/stack-mastery/notes/',
  '/stack-mastery/id/notes/',
  '/stack-mastery/manifest.webmanifest',
  '/stack-mastery/favicon.svg',
  '/stack-mastery/favicon.ico',
  '/stack-mastery/icons/icon-192.png',
  '/stack-mastery/404.html',
];
const OFFLINE_PAGE = '/stack-mastery/404.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('stack-mastery-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isOwn = (url) => url.origin === self.location.origin && url.pathname.startsWith(SCOPE);

// Pages can ask the worker to cache what they already loaded before it took control (first visit).
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'CACHE_URLS' || !Array.isArray(data.urls)) return;
  const urls = data.urls
    .map((u) => {
      try {
        return new URL(u, self.location.origin);
      } catch {
        return null;
      }
    })
    .filter((u) => u && isOwn(u) && !u.pathname.endsWith('/sw.js'));
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      Promise.all(
        urls.map((u) =>
          cache.match(u.href).then((hit) =>
            hit
              ? undefined
              : fetch(u.href, { credentials: 'same-origin' })
                  .then((res) => (res.ok ? cache.put(u.href, res) : undefined))
                  .catch(() => undefined),
          ),
        ),
      ),
    ),
  );
});

async function networkFirstPage(request) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const hit = (await cache.match(request)) || (await cache.match(request, { ignoreSearch: true }));
    if (hit) return hit;
    const offline = await cache.match(OFFLINE_PAGE);
    return offline || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request);
  const update = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  if (hit) {
    event.waitUntil(update);
    return hit;
  }
  return (await update) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Cross-origin CDNs (cdnjs.cloudflare.com, esm.sh, cdn.jsdelivr.net, dartpad.dev, …) bypass the worker entirely.
  if (!isOwn(url) || url.pathname === `${SCOPE}sw.js`) return;
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstPage(request));
  } else if (url.pathname.startsWith(`${SCOPE}_astro/`)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
