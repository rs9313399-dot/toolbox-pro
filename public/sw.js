// ────────────────────────────────────────────
// ToolBox Pro — Service Worker (PWA)
// Cache-first strategy for static assets
// Network-first for API calls
// Offline fallback page
// ────────────────────────────────────────────

const CACHE_NAME = 'toolbox-pro-v2';
const STATIC_CACHE = 'toolbox-pro-static-v2';
const DYNAMIC_CACHE = 'toolbox-pro-dynamic-v2';

// Static assets to pre-cache on install
const PRE_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/ads.txt',
  '/robots.txt',
  '/sitemap.xml',
];

// Install event — pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(PRE_CACHE_URLS).catch((err) => {
        console.warn('[SW] Pre-cache failed for some URLs:', err);
        // Don't fail install if some URLs can't be cached
        return Promise.resolve();
      });
    })
  );
  // Activate immediately without waiting
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event — routing strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Skip analytics and ad requests
  if (
    url.hostname.includes('google') ||
    url.hostname.includes('googlesyndication') ||
    url.hostname.includes('doubleclick') ||
    url.hostname.includes('google-analytics') ||
    url.hostname.includes('googletagmanager')
  ) {
    return;
  }

  // API calls — Network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Same-origin navigation & static assets — Cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Cross-origin (fonts, CDN) — Stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ─── Cache Strategies ───

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Offline fallback for navigation
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/');
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// ─── Handle messages from client ───
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
