/* ============================================================
 * N4 Web — applies SITE_DOMAIN (from config.js) to the page.
 * Load AFTER config.js:
 *   <script src="/config.js"></script>
 *   <script src="/site.js"></script>
 *
 * SITE_DOMAIN ဗလာဆို ဘာမှမပြင် — relative URL အတိုင်းထား။
 * ဖြည့်ထားရင် "/" နဲ့စတဲ့ internal link / image တွေကို
 * SITE_DOMAIN + path အဖြစ် ပြောင်းပေးမယ်။
 * ============================================================ */
(function () {
  var domain = (typeof SITE_DOMAIN === "string" ? SITE_DOMAIN : "").replace(/\/+$/, "");
  if (!domain) return; // config ဗလာ → လက်ရှိ domain သုံး, ပြင်စရာမလို

  function absolutize(selector, attr) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var v = els[i].getAttribute(attr);
      if (v && v.charAt(0) === "/") {
        els[i].setAttribute(attr, domain + v);
      }
    }
  }

  function apply() {
    absolutize('a[href^="/"]', "href");   // internal page links
    absolutize('img[src^="/"]', "src");   // internal images
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
