/* gallery.js — one concern: the before/after gallery's horizontal scroller.
 * Cards are STATIC markup (content survives no-JS); this adds: prev/next
 * buttons, and the upgrade path for real photos — when images/<file> actually
 * exists (owner drops the file in, no markup change), it replaces the
 * "Bild kommer" placeholder; while it doesn't, the honest placeholder stays. */
(function () {
  'use strict';

  var scroller = document.querySelector('[data-gallery-scroller]');
  if (!scroller) return;

  function cardStep() {
    var card = scroller.querySelector('[data-gallery-card]');
    return card ? card.getBoundingClientRect().width + 16 : 320;
  }

  function wireButton(selector, direction) {
    var btn = document.querySelector(selector);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var reduced = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroller.scrollBy({ left: direction * cardStep(), behavior: reduced ? 'auto' : 'smooth' });
      scroller.focus({ preventScroll: true });
    });
  }

  wireButton('[data-gallery-prev]', -1);
  wireButton('[data-gallery-next]', 1);

  /* Real-photo seam (QA P1, MC 3934.3 c2): js/gallery-manifest.js declares
   * window.ANNY_GALLERY_IMAGES — the files that actually exist. A slot is
   * upgraded to <img> only when listed there; an absent file costs ZERO
   * network requests (no HEAD-probe, no console 404s), placeholder stays.
   * Owner: add the file AND its manifest line — no markup change. */
  var available = window.ANNY_GALLERY_IMAGES || [];
  document.querySelectorAll('[data-gallery-media][data-img-slot]').forEach(function (media) {
    var slot = media.getAttribute('data-img-slot');
    if (!slot || available.indexOf(slot) === -1) return;
    var img = document.createElement('img');
    img.setAttribute('data-gallery-img', '');
    img.src = slot;
    img.alt = 'Före/efter-bild: ' + (media.closest('[data-gallery-card]')
      .querySelector('.gallery-card__title').textContent.trim());
    var label = media.querySelector('[data-gallery-label]');
    if (label) label.remove();
    media.appendChild(img);
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
  });
})();
