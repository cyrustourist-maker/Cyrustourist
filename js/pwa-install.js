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

  function stepsFor() {
    if (isIOS()) {
      return {
        title: "نصب اپلیکیشن روی آیفون",
        steps: [
          "در پایین صفحه‌ی مرورگر Safari، روی دکمه‌ی اشتراک‌گذاری ⬆️ بزنید.",
          "از فهرست باز شده، گزینه‌ی «Add to Home Screen» (افزودن به صفحه اصلی) را انتخاب کنید.",
          "روی «Add» بزنید — آیکون سایروس توریست روی صفحه اصلی گوشی اضافه می‌شود."
        ]
      };
    }
    if (isAndroid()) {
      return {
        title: "نصب اپلیکیشن روی اندروید",
        steps: [
          "روی نشانه‌ی سه‌نقطه ⋮ در گوشه‌ی بالای مرورگر Chrome بزنید.",
          "در فهرست باز شده، پایین را نگاه کنید و گزینه‌ی «Install app» یا «افزودن به صفحه اصلی» را بزنید.",
          "روی «Install» یا «Add» تأیید کنید — آیکون سایروس توریست به صفحه اصلی گوشی اضافه می‌شود."
        ]
      };
    }
    return {
      title: "نصب اپلیکیشن روی کامپیوتر",
      steps: [
        "در نوار آدرس مرورگر (کروم یا اج)، به دنبال نشانه‌ی نصب ⊕ یا 💻 بگردید.",
        "روی آن بزنید و گزینه‌ی «Install» را تأیید کنید.",
        "اگر این نشانه را نمی‌بینید، از منوی سه‌نقطه مرورگر گزینه‌ی «Install Cyrus Tourist…» را انتخاب کنید."
      ]
    };
  }

  function showManualGuide() {
    var info = stepsFor();

    var overlay = document.createElement("div");
    overlay.setAttribute("dir", "rtl");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:rgba(4,10,16,.72);" +
      "display:flex;align-items:flex-end;justify-content:center;" +
      "font-family:inherit;";

    var card = document.createElement("div");
    card.style.cssText =
      "width:100%;max-width:480px;background:linear-gradient(180deg,#0b2230,#06121d);" +
      "border:1px solid rgba(255,255,255,.14);border-radius:22px 22px 0 0;" +
      "padding:22px 20px 26px;box-shadow:0 -8px 40px rgba(0,0,0,.5);" +
      "color:#f5fbff;box-sizing:border-box;";

    var handle = document.createElement("div");
    handle.style.cssText =
      "width:40px;height:4px;border-radius:3px;background:rgba(255,255,255,.25);" +
      "margin:0 auto 16px;";
    card.appendChild(handle);

    var title = document.createElement("div");
    title.textContent = "📲 " + info.title;
    title.style.cssText = "font-size:19px;font-weight:800;margin-bottom:14px;";
    card.appendChild(title);

    var list = document.createElement("ol");
    list.style.cssText = "margin:0 0 18px;padding-inline-start:22px;display:grid;gap:10px;";

    info.steps.forEach(function (s) {
      var li = document.createElement("li");
      li.textContent = s;
      li.style.cssText = "font-size:15px;line-height:1.8;color:#dfeef5;";
      list.appendChild(li);
    });
    card.appendChild(list);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "متوجه شدم";
    closeBtn.style.cssText =
      "width:100%;padding:13px;border:none;border-radius:14px;font-size:16px;" +
      "font-weight:700;color:#06121d;cursor:pointer;" +
      "background:linear-gradient(90deg,#29e0ad,#42b8ff);";
    closeBtn.addEventListener("click", function () {
      document.body.removeChild(overlay);
    });
    card.appendChild(closeBtn);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    overlay.appendChild(card);
    document.body.appendChild(overlay);
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

        showManualGuide();
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
