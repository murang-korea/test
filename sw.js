const CACHE_NAME = 'rabbit-clicker-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/rabbit-icon-192.png', // 아이콘 경로도 캐싱
  '/icons/rabbit-icon-512.png'  // 아이콘 경로도 캐싱
];

// 서비스 워커 설치 시점에 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 캐시 또는 네트워크에서 리소스 요청 가로채기
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시된 응답 반환
        if (response) {
          return response;
        }
        // 캐시에 없으면 네트워크로 요청
        return fetch(event.request);
      })
  );
});

// 캐시 업데이트 (새로운 버전의 서비스 워커 활성화 시)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 오래된 캐시 삭제
          }
        })
      );
    })
  );
});
