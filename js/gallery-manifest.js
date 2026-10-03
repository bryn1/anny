/* gallery-manifest.js — one concern: the gallery photo inventory (QA P1 seam,
 * MC 3934.3 c2). Declares which image files ACTUALLY exist; gallery.js swaps
 * in <img> only for paths listed here, so an absent file is never requested
 * (zero console 404s). Owner upgrade path: drop images/gal-0N.jpeg in the
 * images/ dir AND add its path to the list below — no markup change needed.
 * Loaded before gallery.js (defer order in index.html). Declares the site's
 * single sanctioned read-only global — the documented C3 exception in
 * docs/ARCHITECTURE.md. */
window.ANNY_GALLERY_IMAGES = [
  'images/gal-01.jpeg',
  'images/gal-02.jpeg',
  'images/gal-03.jpeg',
  'images/gal-04.jpeg'
];
