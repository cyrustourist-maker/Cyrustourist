/* =====================================================
   CYRUS TOURIST — SMART INSTALL (PWA)
   اگر پرامپت نصب خودکار کروم آماده باشد → همان
   در غیر این صورت → راهنمای تصویری نصب داخل سایت
   (شبیه تجربه‌ی نصب تلگرام، مستقل از رفتار مرورگر)
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

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }
