/* =====================================================
   CYRUS TOURIST — SMART INSTALL (PWA)
   Android/Chromium → نصب مستقیم یک‌لمسی
   iOS Safari        → راهنمای Add to Home Screen
   سایر مرورگرها     → صفحهٔ راهنمای عمومی
===================================================== */
(function () {
  var deferredPrompt = null;
  var installButtons = [];

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function inDownloadsFolder() {
    return location.pathname.indexOf("/downloads/") !== -1;
  }

  function markInstalled(btn) {
    var text = btn.getAttribute("data-installed-text");
    if (text) btn.textContent = text;
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "default";
  }

  function refreshButtons() {
    if (!isStandalone()) return;
    installButtons.forEach(markInstalled);
  }

  function bindButtons() {
    installButtons = Array.prototype.slice.call(
      document.querySelectorAll("[data-cyrus-install-btn]")
    );

    installButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (isStandalone()) return;

        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.finally(function () {
            deferredPrompt = null;
          });
          return;
        }

        if (isIOS()) {
          window.location.href = inDownloadsFolder() ? "ios.html" : "downloads/ios.html";
          return;
        }

        // کروم/اج دسکتاپ یا مرورگری که پرامپت هنوز فایر نشده
        window.location.href = inDownloadsFolder() ? "stores.html" : "downloads/stores.html";
      });
    });

    refreshButtons();
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    refreshButtons();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindButtons);
  } else {
    bindButtons();
  }
})();
