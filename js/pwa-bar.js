/* سایروس توریست — رفتار وب‌اپ در همهٔ صفحه‌ها
   ۱) ثبت Service Worker
   ۲) در مرورگر: نوار «دریافت وب‌اپ (PWA)»
   ۳) داخل وب‌اپ نصب‌شده: نوار تب پایین (خانه، نقشه، فیلم‌ها، اقامتگاه، ثبت‌نام) مثل اپ */
(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
  var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  var css = document.createElement("style");
  var tabs = [
    ["/index.html", "🏠", "خانه"], ["/map.html", "🗺️", "نقشه"], ["/tourism-videos.html", "🎬", "فیلم‌ها"],
    ["/residences/residences.html", "🏡", "اقامتگاه"], ["/register.html", "➕", "ثبت‌نام"]
  ];
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }

  if (standalone) {
    css.textContent = "body{padding-bottom:calc(68px + env(safe-area-inset-bottom))!important}" +
      ".cyt{position:fixed;z-index:9998;left:0;right:0;bottom:0;display:flex;direction:rtl;background:#0b2230;border-top:1px solid #17384a;padding-bottom:env(safe-area-inset-bottom)}" +
      ".cyt a{flex:1;text-align:center;text-decoration:none;color:#9bb0aa;font:700 11px Tahoma,system-ui,sans-serif;padding:8px 0 7px;line-height:1.5}" +
      ".cyt a b{display:block;font-size:20px;font-weight:400}.cyt a.on{color:#29e0ad}";
    document.head.appendChild(css);
    ready(function () {
      var p = location.pathname.replace(/\/$/, "/index.html"), nav = document.createElement("nav");
      nav.className = "cyt"; nav.setAttribute("aria-label", "منوی وب‌اپ");
      nav.innerHTML = tabs.map(function (t) {
        var on = p === t[0] || (t[0] !== "/index.html" && p.indexOf(t[0].replace(".html", "")) === 0) || (t[0] === "/tourism-videos.html" && (p.indexOf("/tourism-video") === 0 || p.indexOf("/films/") === 0));
        return '<a href="' + t[0] + '"' + (on ? ' class="on"' : "") + "><b>" + t[1] + "</b>" + t[2] + "</a>";
      }).join("");
      document.body.appendChild(nav);
    });
    return;
  }

  var KEY = "cyrusPwaBarClosed";
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  css.textContent = ".cpb{position:fixed;z-index:9998;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-width:460px;margin:0 auto;display:flex;gap:8px;direction:rtl}" +
    ".cpb button{font:inherit;border:0;cursor:pointer}.cpb .i{flex:1;min-height:52px;border-radius:16px;background:#29e0ad;color:#06121d;font-weight:800;font-size:16px;box-shadow:0 8px 22px rgba(0,0,0,.4)}" +
    ".cpb .x{width:52px;border-radius:16px;background:#0b2230;color:#eaf6f2;font-size:20px;border:1px solid #17384a}";
  document.head.appendChild(css);
  ready(function () {
    var bar = document.createElement("div");
    bar.className = "cpb";
    bar.innerHTML = '<button type="button" class="i" data-cyrus-install-btn data-installed-text="✔ نصب شده است">📲 دریافت وب‌اپ (PWA)</button><button type="button" class="x" aria-label="بستن">×</button>';
    bar.querySelector(".x").onclick = function () { bar.remove(); try { sessionStorage.setItem(KEY, "1"); } catch (e) {} };
    document.body.appendChild(bar);
    window.addEventListener("appinstalled", function () { bar.remove(); });
  });
})();
