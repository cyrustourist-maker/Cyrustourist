/* نوار شناور «دریافت وب‌اپ PWA» برای همهٔ صفحه‌ها + ثبت Service Worker
   قبل از pwa-install.js لود شود:
   <script src="js/pwa-bar.js" defer></script><script src="js/pwa-install.js" defer></script> */
(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  var KEY = "cyrusPwaBarClosed";
  try { if (standalone || sessionStorage.getItem(KEY)) return; } catch (e) { if (standalone) return; }
  var st = document.createElement("style");
  st.textContent = ".cpb{position:fixed;z-index:9998;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-width:460px;margin:0 auto;display:flex;gap:8px;direction:rtl}" +
    ".cpb button{font:inherit;border:0;cursor:pointer}.cpb .i{flex:1;min-height:52px;border-radius:16px;background:#29e0ad;color:#06121d;font-weight:800;font-size:16px;box-shadow:0 8px 22px rgba(0,0,0,.4)}" +
    ".cpb .x{width:52px;border-radius:16px;background:#0b2230;color:#eaf6f2;font-size:20px;border:1px solid #17384a}";
  document.head.appendChild(st);
  var bar = document.createElement("div");
  bar.className = "cpb";
  bar.innerHTML = '<button type="button" class="i" data-cyrus-install-btn data-installed-text="✔ نصب شده است">📲 دریافت وب‌اپ (PWA)</button><button type="button" class="x" aria-label="بستن">×</button>';
  bar.querySelector(".x").onclick = function () { bar.remove(); try { sessionStorage.setItem(KEY, "1"); } catch (e) {} };
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(bar); });
})();
