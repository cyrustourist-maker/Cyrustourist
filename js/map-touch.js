/*
 * سایروس توریست — رفع گیر کردن اسکرول روی نقشه در گوشی
 *
 * روی گوشی (صفحهٔ لمسی) نقشه با «یک انگشت» حرکت نمی‌کند و صفحه اسکرول می‌شود.
 * حرکت و بزرگ‌نمایی نقشه با «دو انگشت» انجام می‌شود. دکمه‌های + و − هم کار می‌کنند.
 * روی کامپیوتر (ماوس) هیچ تغییری ندارد.
 *
 * استفاده:  cyrusMapTouchGuard(map)  — بعد از ساخت نقشهٔ Leaflet
 */
(function (w, d) {
  var TEXT = {
    fa: 'برای حرکت دادن نقشه از دو انگشت استفاده کنید',
    en: 'Use two fingers to move the map',
    ar: 'استخدم إصبعين لتحريك الخريطة'
  };

  function lang() {
    var s = d.getElementById('languageSelect');
    var l = (s && s.value) || d.documentElement.lang || 'fa';
    return TEXT[l] ? l : 'fa';
  }

  function addStyle() {
    if (d.getElementById('cyrusMapTouchStyle')) return;
    var st = d.createElement('style');
    st.id = 'cyrusMapTouchStyle';
    st.textContent =
      '.cyrusMapHint{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);' +
      'z-index:1000;max-width:88%;padding:8px 14px;border-radius:12px;' +
      'background:rgba(6,18,29,.88);color:#fff;font:700 13px/1.6 Tahoma,Arial,sans-serif;' +
      'text-align:center;direction:rtl;pointer-events:none;opacity:0;transition:opacity .2s}' +
      '.cyrusMapHint.on{opacity:1}' +
      '@media (prefers-reduced-motion:reduce){.cyrusMapHint{transition:none}}' +
      '@media (pointer:coarse){.leaflet-container.cyrusTouchGuard{touch-action:pan-x pan-y!important}}';
    d.head.appendChild(st);
  }

  w.cyrusMapTouchGuard = function (map) {
    if (!map || !w.matchMedia || !w.matchMedia('(pointer:coarse)').matches) return;

    addStyle();
    var el = map.getContainer();
    el.classList.add('cyrusTouchGuard');

    // یک انگشت: فقط اسکرول صفحه. دو انگشت: حرکت و بزرگ‌نمایی نقشه (touchZoom)
    map.dragging.disable();

    var hint = d.createElement('div');
    hint.className = 'cyrusMapHint';
    hint.setAttribute('aria-hidden', 'true');
    el.appendChild(hint);

    var timer = 0;
    function showHint() {
      hint.textContent = TEXT[lang()];
      hint.classList.add('on');
      clearTimeout(timer);
      timer = setTimeout(function () { hint.classList.remove('on'); }, 1500);
    }

    // با دو انگشت جلوی اسکرول خودِ مرورگر را بگیر تا نقشه حرکت کند
    function twoFingers(e) {
      if (e.touches && e.touches.length >= 2) {
        if (e.cancelable) e.preventDefault();
        hint.classList.remove('on');
      }
    }

    el.addEventListener('touchstart', twoFingers, { passive: false });
    el.addEventListener('touchmove', function (e) {
      if (e.touches.length >= 2) twoFingers(e);
      else showHint();
    }, { passive: false });
  };
})(window, document);
