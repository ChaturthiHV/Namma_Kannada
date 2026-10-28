// Minimal offline cache: network-first, falls back to cache. Bump V to invalidate.
const V = 'nk-v4'
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(['/', '/map', '/search']).catch(() => {}))); self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x))))); self.clients.claim() })
self.addEventListener('fetch', e => {
 const r = e.request; if (r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return
 e.respondWith(fetch(r).then(res => { if (res.status === 200) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)).catch(() => {}) } return res }).catch(() => caches.match(r).then(m => m || caches.match('/'))))
})
