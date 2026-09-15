const CYRUS_CACHE = "cyrus-tourist-v7";

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
