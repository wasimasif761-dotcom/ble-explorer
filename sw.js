// BLE Device Explorer - Service Worker
const CACHE_NAME = 'ble-device-explorer-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon.svg'
];

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets for offline use:', ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] All core assets cached successfully.');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Pre-cache failed during install:', error);
      })
  );
});

// Activate: Clean up old cache versions and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service Worker claimed clients.');
      return self.clients.claim();
    })
  );
});

// Fetch: Network-first with cache fallback (or cache-first for offline)
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle request
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If found in cache, return cached version and optionally refresh from network in background
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
          })
          .catch(() => {
            // Offline or network error - cached response is already serving the user
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch((fetchError) => {
          console.warn('[SW] Network request failed:', event.request.url, fetchError);
          // Fallback to cached index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          throw fetchError;
        });
    })
  );
});
