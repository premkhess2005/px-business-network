const BASE_URL = new URL("./", self.registration.scope);
const CACHE_NAME = "px-business-all-in-one-v2";
const APP_SHELL = [
  BASE_URL.pathname,
  new URL("index.html", BASE_URL).pathname,
  new URL("manifest.webmanifest", BASE_URL).pathname,
  new URL("icon-192.png", BASE_URL).pathname,
  new URL("icon-512.png", BASE_URL).pathname
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(new URL("index.html", BASE_URL).pathname))));
});
