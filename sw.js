// ========================================
// SERVICE WORKER - PWA BÁSICO
// Cache-First Strategy
// ========================================

const CACHE_NAME = 'portafolio-v3';
const urlsToCache = [
  '/Portafolio/',
  '/Portafolio/index.html',
  '/Portafolio/assets/css/index.css',
  '/Portafolio/assets/css/contact-skills.css',
  '/Portafolio/assets/js/typing.js',
  '/Portafolio/assets/js/nav.scroll.js',
  '/Portafolio/assets/js/contact.js',
  '/Portafolio/assets/js/visitor-counter.js',
  '/Portafolio/assets/js/particles-config.js',
  '/Portafolio/assets/js/analytics-events.js',
  '/Portafolio/assets/sources/img/dev-photo.webp',
  '/Portafolio/assets/sources/img/photo.webp',
  '/Portafolio/assets/sources/icons/icon-B.webp'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
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
