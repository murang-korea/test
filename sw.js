const CACHE_NAME = 'onesec-force-v2';
const PRE_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// 설치 시 즉시 제어권 획득
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// 활성화 시 구버전 즉시 삭제
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME && caches.delete(k))
    ))
  );
  self.clients.claim();
});

// 네트워크 우선 순위 전략 (랭킹 데이터는 최신으로, UI는 캐시로)
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('supabase')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
  }
});
