// Basic service worker for offline support (cache all GET requests)
const CACHE_NAME = 'visitorp-cache-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(event.request).then(response =>
                response ||
                fetch(event.request).then(networkResponse => {
                    if (
                        networkResponse &&
                        networkResponse.status === 200 &&
                        networkResponse.type === 'basic'
                    ) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => response)
            )
        )
    );
});