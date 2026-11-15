const CYRUS_CACHE = "cyrus-tourist-v23";

const CORE_FILES = [
  "./",
  "index.html",
  "classic.html",
  "games.html",
  "install.html",
  "register.html",
  "map.html",
  "tourism-videos.html",
  "residences/residences.html",
  "js/pwa-bar.js",
  "js/pwa-install.js",
  "js/map-touch.js",
  "js/qrcode.js",
  "assets/site.css",
  "assets/Vazirmatn-Variable.woff2",
  "tour.html",
  "manifest.json",
  "assets/images/logo.png",
  "assets/images/icon-192.png",
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

/*
 * «اول شبکه، ولی با مهلت»:
 * وقتی گوشی به وای‌فایِ بدون اینترنت وصل است، درخواست شبکه به‌جای خطا
 * ده‌ها ثانیه معطل می‌ماند. اگر نسخه‌ی کش‌شده داریم، بعد از چند ثانیه همان را
 * نشان می‌دهیم تا بازی‌ها بدون اینترنت هم سریع باز شوند.
 */
function networkFirst(request, options, timeoutMs, fallbackUrl) {
  var net = fetch(request, options).then(function (response) {
    if (response && response.status === 200 && response.type !== "opaque") {
      var copy = response.clone();
      caches.open(CYRUS_CACHE).then(function (cache) {
        cache.put(request, copy);
      });
    }
    return response;
  });

  return caches.match(request).then(function (cached) {
    if (!cached) {
      return net.catch(function () {
        return fallbackUrl ? caches.match(fallbackUrl) : Response.error();
      });
    }
    var timer = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(cached);
      }, timeoutMs);
    });
    return Promise.race([net, timer]).catch(function () {
      return cached;
    });
  });
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

  // صفحه‌ها: اول شبکه (تا همیشه نسخه‌ی تازه)، با مهلت ۲٫۵ ثانیه؛ بعد کش
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, undefined, 2500, "index.html"));
    return;
  }

  // عکس‌های تبلیغات: اول شبکه (تا عکس جدید با همان نام هم فوری دیده شود)
  if (url.pathname.indexOf("/assets/images/ads/") !== -1) {
    event.respondWith(networkFirst(event.request, { cache: "no-cache" }, 2500));
    return;
  }

  // JS و CSS و JSON: اول شبکه (هر تغییر خودکار اعمال شود)، با مهلت؛ بعد کش
  if (/\.(js|css|json)$/i.test(url.pathname)) {
    event.respondWith(networkFirst(event.request, { cache: "no-cache" }, 2500));
    return;
  }

  // تصویر و فونت و بقیه: اول کش، بعد شبکه
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
