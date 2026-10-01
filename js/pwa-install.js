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

  function isSafari() {
    return !/crios|fxios|edgios|instagram|fban|fbav|telegram|line\//i.test(navigator.userAgent);
  }

  /* آیفون: نصب خودکار ممکن نیست؛ کلید، منوی اشتراک‌گذاری را باز می‌کند تا کاربر «Add to Home Screen» را بزند */
  function iosInstallAction(btn) {
    if (!isSafari()) {
      var done = function () { btn.textContent = "✔ لینک کپی شد؛ در Safari باز کنید"; };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
      return;
    }
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href }).catch(function () {});
    } else {
      btn.textContent = "از دکمهٔ ⬆️ پایین Safari استفاده کنید";
    }
  }

  function makeIosBtn() {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = isSafari() ? "📲 نصب (باز کردن منوی اشتراک‌گذاری)" : "📋 کپی لینک برای باز کردن در Safari";
    b.style.cssText = "width:100%;padding:14px;border:none;border-radius:14px;font:inherit;font-size:16px;font-weight:800;color:#06121d;cursor:pointer;background:linear-gradient(90deg,#29e0ad,#42b8ff);margin-top:6px";
    b.addEventListener("click", function () { iosInstallAction(b); });
    return b;
  }

  function stepsFor() {
    if (isIOS()) {
      return {
        title: "نصب اپلیکیشن روی آیفون",
        steps: [
          "سایت را حتماً در مرورگر Safari باز کنید (نصب در کروم، اینستاگرام و مرورگر داخل برنامه‌ها ممکن نیست).",
          "دکمهٔ اشتراک‌گذاری ⬆️ (مربع با فلش رو به بالا) را در پایین صفحه بزنید. اگر آن را نمی‌بینید، روی ⋯ پایین مرورگر بزنید.",
          "در فهرست باز شده کمی بالا بکشید و گزینهٔ «Add to Home Screen» (افزودن به صفحهٔ اصلی) را بزنید.",
          "روی «Add» (افزودن) بالای صفحه بزنید.",
          "آیکون سایروس توریست روی صفحهٔ اصلی گوشی اضافه می‌شود؛ از همان‌جا مثل یک اپلیکیشن باز کنید."
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

  /* آموزش نصب درست زیر کلید (برای کلیدهای داخل صفحه) */
  function inlineGuide(btn) {
    var how = document.getElementById("pwaHow");
    if (how) {
      var p = isIOS() ? "ios" : isAndroid() ? "android" : "desktop";
      Array.prototype.forEach.call(how.querySelectorAll("details"), function (d) {
        d.open = d.getAttribute("data-p") === p;
      });
      how.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var old = btn.nextElementSibling;
    if (old && old.className === "cyg") { old.remove(); return; }
    var info = stepsFor(), box = document.createElement("div");
    box.className = "cyg"; box.setAttribute("dir", "rtl");
    box.style.cssText = "margin-top:10px;padding:14px 16px;border-radius:16px;background:#0b2230;border:1px solid #17384a;color:#eaf6f2;line-height:1.9;text-align:right;font-size:14px";
    var t = document.createElement("b"); t.textContent = "📲 " + info.title; box.appendChild(t);
    var ol = document.createElement("ol"); ol.style.cssText = "margin:8px 0 0;padding-inline-start:20px";
    info.steps.forEach(function (x) { var li = document.createElement("li"); li.textContent = x; ol.appendChild(li); });
    box.appendChild(ol); if (isIOS()) box.appendChild(makeIosBtn()); btn.insertAdjacentElement("afterend", box);
  }

  function showManualGuide(btn) {
    if (btn && !(btn.closest && btn.closest(".cpb"))) { inlineGuide(btn); return; }
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

    var closeX = document.createElement("button");
    closeX.type = "button";
    closeX.setAttribute("aria-label", "بستن");
    closeX.textContent = "✕";
    closeX.style.cssText = "position:absolute;top:14px;left:14px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;font-size:16px;cursor:pointer";
    closeX.addEventListener("click", function () { document.body.removeChild(overlay); });
    card.style.position = "relative";
    card.appendChild(closeX);

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

    if (isIOS()) card.appendChild(makeIosBtn());

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  /* کلیک با delegation: مستقل از ترتیب لود اسکریپت‌ها و دکمه‌هایی که بعداً ساخته می‌شوند */
  document.addEventListener("click", function (e) {
    var ib = e.target && e.target.closest ? e.target.closest("[data-ios-share]") : null;
    if (ib) { iosInstallAction(ib); return; }
    var btn = e.target && e.target.closest ? e.target.closest("[data-cyrus-install-btn]") : null;
    if (!btn) return;
    if (isStandalone()) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
      });
      return;
    }

    showManualGuide(btn);
  });

  function bindButtons() {
    installButtons = Array.prototype.slice.call(
      document.querySelectorAll("[data-cyrus-install-btn]")
    );
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
