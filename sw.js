const CACHE_NAME = 'clicker-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((res) => {
      return res || fetch(evt.request).then((fetchRes) => {
        // 캐시 가능한 GET 응답은 저장
        if (evt.request.method === 'GET' && fetchRes && fetchRes.status === 200) {
          const copy = fetchRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, copy));
        }
        return fetchRes;
      }).catch(() => {
        // 실패 시 캐시에서 루트/index.html 반환 (오프라인 fallback)
        return caches.match('./index.html');
      });
    })
  );
});
