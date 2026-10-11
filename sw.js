const C = "time-block-quick-v21";

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(C).then(c => c.addAll([
      "./",
      "./index.html",
      "./manifest.webmanifest",
      "./icon-192.png",
      "./icon-512.png"
    ]))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== C).map(key => caches.delete(key))
    )).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", e => {
  if (e.request.mode === 'navigate' || e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        let clone = response.clone();
        if (e.request.method === "GET" && response.status === 200) {
          caches.open(C).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match(e.request))
  );
});