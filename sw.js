const CYRUS_CACHE = "cyrus-tourist-v9";

const CORE_FILES = [
  "./",
  "index.html",
  "manifest.json",
  "assets/images/logo.png",
  "assets/images/header-fix.css",
  "assets/images/cyrustourist-hero-2026.webp.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CYRUS_CACHE).then(function (cache) {
      return cache.addAll(CORE_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CYRUS_CACHE;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then(function (response) {
          if (
            !response ||
            response.status !== 200 ||
            response.type === "opaque"
          ) {
            return response;
          }

          var responseClone = response.clone();

          caches.open(CYRUS_CACHE).then(function (cache) {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(function () {
          if (event.request.mode === "navigate") {
            return caches.match("index.html");
          }
        });
    })
  );
});
