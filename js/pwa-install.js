/* =====================================================
   CYRUS TOURIST — SMART INSTALL (PWA)
   یک اسکریپت مستقل؛ به هیچ فایل دیگری وابسته نیست.
   رفتار خودکار بر اساس مرورگر:
   - Android Chrome / Edge / ویندوز (Chromium)  → نصب مستقیم با یک لمس
   - iOS Safari                                  → راهنمای Add to Home Screen (شیت پایین صفحه)
   - سایر مرورگرها (فایرفاکس و ...)              → راهنمای عمومی
   دکمه‌هایی که data-cyrus-install-btn دارند به‌طور خودکار فعال می‌شوند.
===================================================== */

(function () {

  var deferredPrompt = null;

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
