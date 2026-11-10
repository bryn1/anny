/* rytm.js — the scroll choreography of this page: the single reveal mechanism.
 * Everything here is enhancement: without JS every element is visible and every
 * real channel (tel/mailto/IG links) still works. Reveals flip one class via
 * IntersectionObserver (no scroll handlers, no rAF loops); reduced motion never
 * sees these states (css/motion.css gates them behind .js-motion +
 * prefers-reduced-motion: no-preference). Replaces js/scroll-reveal.js
 * (MC 12367 — the theme 27 port; the hero word-build retired with it, the
 * hero now breathes via CSS instead). */
(function () {
  "use strict";

  document.documentElement.classList.add("js-motion");

  /* — reveal: flip .in once, then stop watching (family "reveal") — */
  var revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }
})();
