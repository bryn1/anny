/* scroll-reveal.js — one concern: scroll-driven reveals.
 * 1) Hero title "Anny Morin — Frisör Karlskrona" builds word-by-word from the
 *    hero's scroll progress (research pattern: brand builds as you scroll).
 *    A resting page never shows a truncated title: at scroll 0 the build
 *    auto-completes ~0.8s after load and then stays complete (QA P1, c2).
 * 2) [data-reveal] elements fade/slide in once via IntersectionObserver.
 * prefers-reduced-motion (I5): everything is shown instantly, no observer,
 * no progress logic. Markup contact only via data-* hooks + state classes. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Opt-in marker: components.css only hides [data-reveal] / .hero-word once
   * this exists — no-JS readers always see the full page. */
  root.setAttribute('data-reveal-ready', '');

  function revealAll() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  /* ---- Hero word build ---- */
  var heroTitle = document.querySelector('[data-hero-title]');
  var words = [];

  function buildWords() {
    if (!heroTitle) return;
    var text = heroTitle.textContent.trim();
    heroTitle.textContent = '';
    text.split(/\s+/).forEach(function (w, i) {
      if (i > 0) heroTitle.appendChild(document.createTextNode(' '));
      var span = document.createElement('span');
      span.className = 'hero-word';
      span.textContent = w;
      heroTitle.appendChild(span);
      words.push(span);
    });
  }

  function setWordsVisible(count) {
    words.forEach(function (w, i) {
      w.classList.toggle('is-visible', i < count);
    });
  }

  function updateHeroProgress(hero) {
    var rect = hero.getBoundingClientRect();
    var vh = window.innerHeight || root.clientHeight;
    /* 0 while the hero fills the viewport, 1 as it scrolls out. */
    var scrolled = Math.min(0, rect.top);
    var span = Math.max(1, rect.height * 0.9);
    var p = Math.min(1, Math.max(0, -scrolled / span));
    setWordsVisible(Math.max(1, Math.round(p * words.length)));
  }

  function wireHeroBuild() {
    var hero = heroTitle.closest('section') || heroTitle.parentElement;
    var ticking = false;
    var completed = false;

    function onScroll() {
      if (ticking || completed) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        if (!completed) updateHeroProgress(hero);
        ticking = false;
      });
    }

    updateHeroProgress(hero);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /* At-rest guarantee (QA P1, MC 3934.3 c2): scroll may carry the build,
     * but a page at rest must never sit on a truncated H1 — auto-complete
     * shortly after load and freeze the completed state (scroll no longer
     * re-hides words). */
    window.setTimeout(function () {
      completed = true;
      setWordsVisible(words.length);
    }, 800);

    /* Jumped past the hero (anchor link): show the full name. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting && e.boundingClientRect.top < 0) {
            setWordsVisible(words.length);
          }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---- Section reveals ---- */
  function wireReveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { revealAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  buildWords();

  if (reduced) {
    revealAll();
    setWordsVisible(words.length);
  } else {
    wireReveals();
    if (words.length) wireHeroBuild();
  }
})();
