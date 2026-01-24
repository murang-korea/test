const CACHE_NAME = '1sec-v1.2';
const ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Supabase API 호출은 네트워크 우선, 나머지는 캐시 우선
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
  }
});

// 백그라운드 동기화 (오프라인 점수 전송 대비)
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-scores') {
    console.log('점수 동기화 중...');
  }
});
