const CACHE_NAME = 'onesec-v1-cache';
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// 설치 단계: 필수 리소스 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// 활성화 단계: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

// 페치 단계: 네트워크가 안 될 때 캐시된 파일 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // 네트워크 실패 시 동작 (오프라인 처리)
      });
    })
  );
});
