/* سایروس توریست — «نمایش فیلم ویژه»: کلید روی بنر، فیلم را درست زیر خود بنر باز می‌کند.
   فقط یک خط به index.html اضافه می‌شود:  <script src="js/featured-film.js" defer></script> */
(function () {
  function start() {
    var ban = document.getElementById("videoMenuBanner");
    if (!ban || document.getElementById("featuredFilm")) return;
    var L = (document.documentElement.lang || "fa").slice(0, 2), V = TOURISM_VIDEOS, cur = 0;
    function tx(o) { return o[L] || o.fa; }

    var st = document.createElement("style");
    st.textContent = ".ffHot{left:16%;top:80%;width:68%;height:15%;border-radius:40px!important}" +
      "#featuredFilm{margin:0 0 22px;border-radius:20px;background:linear-gradient(135deg,#0d2432,#12394d);border:1px solid rgba(242,207,91,.35);box-shadow:0 15px 35px rgba(0,0,0,.35);overflow:hidden;color:#fff;direction:rtl}" +
      "#featuredFilm[hidden]{display:none}#featuredFilm .fh{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;font-weight:800;color:#f2cf5b}" +
      "#featuredFilm .fx{background:rgba(255,255,255,.12);border:0;color:#fff;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer}" +
      "#featuredFilm .fv{position:relative;aspect-ratio:16/9;background:#000}#featuredFilm iframe{position:absolute;inset:0;width:100%;height:100%;border:0}" +
      "#featuredFilm .ft{padding:10px 16px 2px;line-height:1.8}#featuredFilm .ft b{display:block;font-size:16px}#featuredFilm .ft span{font-size:13px;opacity:.75}" +
      "#featuredFilm .fc{display:flex;gap:8px;overflow-x:auto;padding:10px 16px;scrollbar-width:none}" +
      "#featuredFilm .fc button{flex:none;font:inherit;font-size:13px;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:6px 14px;cursor:pointer;white-space:nowrap}" +
      "#featuredFilm .fc button.on{background:#29e0ad;color:#06121d;font-weight:800}" +
      "#featuredFilm .fa{display:block;text-align:center;margin:4px 16px 14px;padding:12px;border-radius:14px;background:#29e0ad;color:#06121d;font-weight:800;text-decoration:none}";
    document.head.appendChild(st);

    var hot = document.createElement("a");
    hot.className = "cyrusHeroHotspot glass ffHot"; hot.href = "#featuredFilm"; hot.setAttribute("aria-label", "نمایش فیلم ویژه");
    ban.appendChild(hot);

    var p = document.createElement("section");
    p.id = "featuredFilm"; p.hidden = true;
    p.innerHTML = '<div class="fh"><span>🎬 نمایش فیلم ویژه</span><button type="button" class="fx" aria-label="بستن">✕</button></div>' +
      '<div class="fv"><iframe title="فیلم ویژه" allowfullscreen loading="lazy"></iframe></div><div class="ft"><b></b><span></span></div>' +
      '<div class="fc"></div><a class="fa" href="tourism-videos.html">مشاهدهٔ همهٔ فیلم‌های گردشگری ←</a>';
    ban.insertAdjacentElement("afterend", p);
    var fr = p.querySelector("iframe"), t = p.querySelector(".ft b"), l = p.querySelector(".ft span"), fc = p.querySelector(".fc"), chips = [];

    function play(i) {
      cur = i; var v = V[i];
      fr.src = "https://www.aparat.com/video/video/embed/videohash/" + v.hash + "/vt/frame";
      t.textContent = tx(v.title); l.textContent = "📍 " + tx(v.loc);
      chips.forEach(function (c, j) { c.classList.toggle("on", j === i); });
    }
    V.forEach(function (v, i) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = (i + 1) + ". " + tx(v.title);
      b.onclick = function () { play(i); }; fc.appendChild(b); chips.push(b);
    });
    function open() { if (!fr.src || fr.src === location.href) play(cur); p.hidden = false; p.scrollIntoView({ behavior: "smooth", block: "start" }); }
    function close() { p.hidden = true; fr.src = "about:blank"; }
    hot.addEventListener("click", function (e) { e.preventDefault(); if (p.hidden) open(); else close(); });
    p.querySelector(".fx").onclick = close;
  }
  function init() {
    if (typeof TOURISM_VIDEOS !== "undefined") return start();
    var s = document.createElement("script"); s.src = "tourism-videos-data.js"; s.onload = start; document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
