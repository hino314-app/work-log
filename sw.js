const CACHE="time-block-quick-v34";
const ASSETS=["./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith('time-block-quick-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url);const isDocument=req.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
 if(isDocument){e.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-store'});if(fresh.ok){const c=await caches.open(CACHE);await c.put('./index.html',fresh.clone())}return fresh}catch(err){return await caches.match('./index.html')||Response.error()}})());return;}
 e.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const fresh=await fetch(req);if(fresh.ok)(await caches.open(CACHE)).put(req,fresh.clone());return fresh}catch(err){return Response.error()}})());
});
