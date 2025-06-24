const CACHE_NAME = 'visitorp-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
  // Otherwise, do nothing for non-http(s) requests
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
  // Otherwise, do nothing for non-http(s) requests
});
