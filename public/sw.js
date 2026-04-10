const CACHE_NAME = 'asset-tracker-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/daily-asset-tracker/', '/daily-asset-tracker/index.html'])
    )
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Don't cache Gemini API calls
  if (event.request.url.includes('googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});
