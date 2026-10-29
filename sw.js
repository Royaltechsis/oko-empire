const CACHE='oko-empire-v2-codelab-1';
const ASSETS=['./','./index.html','./styles.css','./game.js','./challenges.js','./codelab.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
// network first (so updates arrive), cache fallback (so it works offline)
self.addEventListener('fetch',e=>{ const req=e.request; if(req.method!=='GET' || new URL(req.url).origin!==location.origin) return;
  e.respondWith(new Promise(resolve=>{ let done=false; const fallback=()=>caches.match(req,{ignoreSearch:true}).then(h=>h||caches.match('./index.html')).then(r=>{ if(!done){ done=true; resolve(r); } });
    const timer=setTimeout(fallback,3500);
    fetch(req).then(res=>{ clearTimeout(timer); if(res&&res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } if(!done){ done=true; resolve(res); } }).catch(()=>{ clearTimeout(timer); fallback(); }); })); });
