const CACHE_NAME = 'chinese-words-v2'
const RUNTIME_CACHE = 'runtime-cache-v2'

// 설치 시 기본 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png'
      ])
    })
  )
  self.skipWaiting()
})

// 활성화 시 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Fetch 이벤트: 네트워크 우선, 실패 시 캐시 사용
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Supabase API 요청은 캐싱
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          // 네트워크 요청 시도
          const response = await fetch(request)
          // 성공하면 캐시에 저장
          cache.put(request, response.clone())
          return response
        } catch (error) {
          // 네트워크 실패 시 캐시에서 가져오기
          const cached = await cache.match(request)
          if (cached) {
            return cached
          }
          throw error
        }
      })
    )
    return
  }

  // 다른 요청은 일반 캐시 전략
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request)
    })
  )
})