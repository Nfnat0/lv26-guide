const CACHE_NAME = 'lv26-desert-wallet-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './media/strip.jpg',
  './media/linq.jpg',
  './media/sphere.jpg',
  './media/hoover.jpg',
  './media/yt_-yBb9gMtSUU.jpg',
  './media/yt_jkn02rqkF90.jpg',
  './media/yt_wPlOaAKHco0.jpg',
  './media/yt_Vz70ZUoDSy4.jpg',
  './media/yt_01DJCxLuzAQ.jpg',
  './media/yt__OVGi0rLzAc.jpg',
  './media/yt_zcNR6cDJeHU.jpg',
  './media/yt_U0s144AKnaU.jpg',
  './media/yt_Y0n7IMd3mWM.jpg',
  './media/yt_05THTK74xb0.jpg',
  './media/yt_LKG6KZxP9JU.jpg',
  './media/yt_P87lXNx2ycI.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => cached || fetch(event.request)).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
