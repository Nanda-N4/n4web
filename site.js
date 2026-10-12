/* ============================================================
 * N4 Web — shared behaviour. Load AFTER config.js:
 *   <script src="/config.js"></script>
 *   <script src="/site.js"></script>
 *
 * 1) SITE_DOMAIN — config.js က domain ကို internal link/image
 *    တွေမှာ သုံးပေး (ဗလာဆို relative အတိုင်းထား)
 * 2) Scroll reveal — .n4-reveal element တွေ မြင်ရမှ .n4-in
 *    ထည့် (progressive enhancement: IO မရှိရင် ဘာမှမဖုံး)
 * 3) Back-to-top — .n4-top button ကို scroll နဲ့ ပြပေး
 * ============================================================ */
(function () {
  "use strict";

  /* ---------- 1) domain ---------- */
  var domain = (typeof SITE_DOMAIN === "string" ? SITE_DOMAIN : "").replace(/\/+$/, "");

  function absolutize(selector, attr) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var v = els[i].getAttribute(attr);
      if (v && v.charAt(0) === "/") els[i].setAttribute(attr, domain + v);
    }
  }

  function applyDomain() {
    if (!domain) return;
    absolutize('a[href^="/"]', "href");
    absolutize('img[src^="/"]', "src");
  }

  /* ---------- 2) scroll reveal ---------- */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return; // no hiding without IO
    var root = document.documentElement;
    root.classList.add("js-reveal");
    var els = document.querySelectorAll(".n4-reveal");
    if (!els.length) return;
    function settle(el) {
      // entrance ပြီးရင် reveal class တွေဖြုတ် — page ရဲ့ ကိုယ်ပိုင်
      // hover/transition တွေ အနှောင့်အယှက်မရှိ ပြန်အလုပ်လုပ်ဖို့
      var cleaned = false;
      function clean() {
        if (cleaned) return;
        cleaned = true;
        el.removeEventListener("transitionend", onEnd);
        el.classList.remove("n4-reveal", "n4-in");
        el.style.removeProperty("--n4d");
      }
      function onEnd(ev) {
        if (ev.propertyName === "transform" || ev.propertyName === "opacity") clean();
      }
      el.addEventListener("transitionend", onEnd);
      setTimeout(clean, 2600); // transitionend မီးမပွင့်တဲ့ edge case အတွက်
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("n4-in");
          io.unobserve(e.target);
          settle(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3) back-to-top ---------- */
  function initTop() {
    var btn = document.querySelector(".n4-top");
    if (!btn) return;
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      btn.classList.toggle("show", y > 480);
    }
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function boot() {
    applyDomain();
    initReveal();
    initTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
