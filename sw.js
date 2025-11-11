// ========================================
// SERVICE WORKER - PWA BÁSICO
// Cache-First Strategy
// ========================================

const CACHE_NAME = 'portafolio-v5';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/design-tokens.css',
  './assets/css/index.css',
  './assets/css/contact-skills.css',
  './assets/css/dark-mode.css',
  './assets/js/typing.js',
  './assets/js/nav.scroll.js',
  './assets/js/contact.js',
  './assets/js/visitor-counter.js',
  './assets/js/particles-config.js',
  './assets/js/analytics-events.js',
  './assets/js/dark-mode.js',
  './assets/sources/img/dev-photo.webp',
  './assets/sources/img/photo.webp',
  './assets/sources/icons/icon-B.webp'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        // Cachear archivos uno por uno para evitar fallos totales
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn('[SW] Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .catch(err => {
        console.error('[SW] Cache installation failed:', err);
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estrategia de Fetch: Cache First, Network Fallback
self.addEventListener('fetch', event => {
  // Solo cachear requests GET
  if (event.request.method !== 'GET') return;
  
  // No cachear APIs externas (Analytics, Formspree, etc.)
  if (
    event.request.url.includes('google-analytics.com') ||
    event.request.url.includes('googletagmanager.com') ||
    event.request.url.includes('formspree.io') ||
    event.request.url.includes('countapi.xyz')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        return fetch(event.request.clone())
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Offline fallback
            return caches.match('/Portafolio/');
          });
      })
  );
});
