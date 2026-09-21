const CYRUS_CACHE = "cyrus-tourist-v10";

const CORE_FILES = [
  "./",
  "index.html",
  "manifest.json",
  "assets/images/logo.png",
  "assets/images/header-fix.css",
  "assets/images/cyrustourist-hero-2026.webp.jpg"
];

/*
 * این آدرس‌ها هرگز از کش خوانده یا در کش ذخیره نمی‌شوند:
 *  - فایل‌های APK / ZIP (حجیم‌اند و نسخه‌ی تازه باید همیشه از سرور بیاید)
 *  - فایل تأیید App Link (.well-known)
 */
function bypassCache(url) {
  return (
    /\.(apk|zip)(\?|$)/i.test(url.pathname) ||
    url.pathname.indexOf("/.well-known/") === 0
  );
}

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

  var url = new URL(event.request.url);

  // فقط همین سایت؛ APK و فایل‌های تأیید بدون دخالت Service Worker
  if (url.origin !== self.location.origin || bypassCache(url)) {
    return;
  }

  // صفحه‌ها: اول شبکه (تا همیشه نسخه‌ی تازه)، اگر نبود کش / صفحه‌ی اصلی
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          if (response && response.status === 200) {
            var copy = response.clone();
            caches.open(CYRUS_CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match(event.request).then(function (cached) {
            return cached || caches.match("index.html");
          });
        })
    );
    return;
  }

  // بقیه (تصویر، CSS، JS): اول کش، بعد شبکه
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }

        var responseClone = response.clone();

        caches.open(CYRUS_CACHE).then(function (cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      });
    })
  );
});
