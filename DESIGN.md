# DESIGN — Anny Morin, Frisör Karlskrona

2026-11-10 · MC 12373 · frontend (branch `session/hero-anny-3d`). This version SUPERSEDES
the hero section only of the 2026-11-10 MC 12367 spec below: hero v2 replaces the photo wash
with a zero-asset WebGL silk-light scene (`js/hero-3d.js`, family "hero-siden"); every other
section, token and the content canon are unchanged from it. The hero's former
photo-wash description below is kept as the NO-JS / NO-WEBGL fallback contract — that is
still exactly what renders when scripts or WebGL are absent.

2026-11-10 · MC 12367 · frontend-build (branch `session/hero-anny-27`). That version
SUPERSEDED the 2026-10-03 MC 3934.3 spec (its stone-monochrome world lives on only in git
history). Design language: fleet theme **27 "Salongens rytm"**
(`~/Hemsidor/projects/salong/prototypes/27-salongens-rytm`, read-only), ported onto the
published Anny/Mullers content canon. All legibility numbers are the ones the workflow-webdesign
quality gate measured on the candidates (composited-pixel contrast + focus-indicator
probes), not hand-computed pairs — see `.audits/202611101228-hero27/out/QUALITY-candidate.md`
and the MC 12373 gate evidence beside this card.

## DIRECTION

"Salongens rytm": a paper ground, spruce + copper + sand, one brass accent, and two
saturated scenes bookending the page — the hero carrying its own woven silk-light in the
scene colours (scene 1; the salon's own photo stays beneath it wherever scripts or WebGL do
not run), the
contact channels on the copper closer-ground (scene 2). The mirror-frame motif is the only
ornament. The content is the published site verbatim: five services with prices `–` until the
owner confirms, the demo booking mock that never confirms anything, the contact form labelled
demo with no backend, the four real owner-delivered photos as the fore/efter wall. Everything
unknown stays visibly unknown (tom-rum empty states: portrait, two gallery slots, öppettider
"(bekräftas snart)").

Voice: Swedish, warm, first-person — unchanged from the canon.

## TOKENS (implemented 1:1 in `css/tokens.css` — C1: only that file names a colour)

Palette, type roles, rhythm and motion budget ported from theme 27's token block; the two
scene-tint values are re-tuned for the site's REAL photos (the theme's placeholders are not
this page's pixels) and validated by the gate's composited contrast row.

| Token | Hex | Role |
|---|---|---|
| `--paper` / `--paper-2` / `--rule` | `#f6f1e8` / `#ece4d6` / `#d8cbb6` | grounds + sand hairlines |
| `--ink` / `--ink-soft` | `#201a15` / `#4a4038` | text on light grounds only |
| `--spruce-deep` / `--spruce` / `--spruce-mist` | `#14332b` / `#1d473c` / `#dce7de` | hero ground / links + frame / secondary on dark |
| `--copper-deep` / `--copper` | `#7c3a17` / `#a4552b` | CTA fill, eyebrow, focus on light |
| `--brass` | `#d9a05b` | micro-labels + focus ring on dark grounds |
| `--closer-ground` | `#5c2d14` | scene 2 + footer bookend |
| `--scene-tint(-hero/-scene)` | `#120f0c` @ 0.55 / 0.68 | solid ink tint behind scene text |
| `--danger` | `#b91c1c` | field-error only — never the focus ring |

Type: display (Iowan/Palatino/Georgia system serif) / body (Optima/Segoe UI/system-ui) /
micro-label roles; single `--root` multiplier 16.4→18 px across the four declared bands
(`--bp-*` tokens 600/900/1200 px + .9 caps — the vocabulary the gate's gb7 reads).
Micro text is ≥ 13.9 px in every band. Spacing: `--space-intra` 24 / `--space-inter` 64 only.
No dark `prefers-color-scheme` variant: the paper world is the design (the 2026-10-03 dark
ramp retired with this port).

## LAYOUT

Single scroll, beats in the theme's rhythm (`Hero → Om → Tjänster → Galleri → Boka →
Meddelande → Kontakt-scen → footer`), sticky paper shell; below the 600 px band only the
wordmark + Boka stay in the shell and the footer carries the full list.

- **Hero (scene 1) — v2 (MC 12373):** the centrepiece is a zero-asset WebGL silk-light
  scene (`js/hero-3d.js`): 24 depth layers of slowly flowing hair/silk strands lit by an
  anisotropic (Kajiya-Kay style) highlight, all colours read from the token block — the JS
  names no colour literal. Subtle pointer-eased light/parallax, IntersectionObserver pause
  offscreen, first draw behind the recorded first-contentful-paint;
  `prefers-reduced-motion` gets ONE static frame and zero rAF. Without JS or WebGL (or on a
  context loss) the canvas silently never shows, and the static hero underneath — photo wash
  (gal-01) + solid tint, CSS-only Ken Burns ("hero-andning") — is exactly the MC 12367 hero.
  Text layout is untouched: the canvas is absolute (measured zero layout jump). The ask row
  is the owner-ratified one: **Boka tid** (to `#boka`) with the **live tel link** beside it,
  and the Instagram pointer as the only trust signal.
- **Om mig** — prose canon verbatim; the portrait photo still does not exist, so the frame
  shows the honest `tom-rum` state ("Porträtt — bild kommer") — never a fake stand-in.
- **Tjänster** — five published services, texts verbatim, price rows `Pris … –` with the
  pending-owner-confirmation comments kept in markup (I1).
- **Galleri** — the fore/efter WALL (the 2026-10-03 horizontal scroller retired): the four
  real photos served directly with `width`/`height` + `srcset` (derived widths as
  `gal-0N-wW.jpeg` under `images/`; regenerate recipe `docs/derived-ladder.md`); captions carry the published tags/titles only ("Före/Efter", "Långt blont",
  "Kortare blont"). The two slots without delivered photos (Bal, Skäggtrim) show the
  dashed `tom-rum` empty state — the JS manifest-swap seam retired with it (photos are now
  confirmed on disk; the served markup says what exists).
- **Boka (demo)** — same behaviour as published: `js/booking-mock.js` builds the single
  `.cal-grid` (template declared exactly once — I3; mobile via `.cal-wrap`), dialog confirm
  → honest done view ("Ingen bokning har genomförts…" — never a fake confirmation), phone +
  Instagram handoff. Visible `Demo — ingen bokning genomförs` mark (I2). New bevis-rad:
  galleri / Instagram / telefon — the published channels, no invented reviews.
- **Meddelande** — the published contact form + validation, now visibly labelled
  `Demo — skickas inte` BEFORE use, not only after submit.
- **Kontakt (scene 2 + footer bookend)** — real owner-supplied values on the copper
  closer-ground: telefon `tel:` + e-post `mailto:` + Instagram + address; öppettider stays
  "(bekräftas snart)" (I1).
- **Motion budget (5 CSS families + 1 WebGL family):** reveal (IO, `.js-motion`-gated),
  hero-andning
  (CSS), sticky-skalm (CSS), dialog-lyft (CSS), mikro-djup (CSS-only card hover tilt,
  MC 12373). All from-states sit behind BOTH
  `prefers-reduced-motion: no-preference` and `.js-motion`; no JS or reduced motion ⇒ the
  page simply sits in its end state. No scroll handlers, no scrub tweens; the page's one
  rAF loop is `js/hero-3d.js` ("hero-siden"), IO-paused offscreen and coded inert under
  reduced motion (one static frame, zero rAF calls — measured).

## FILES

`index.html` · css `tokens → base → layout → components → forms → motion` (C2 order) ·
js `rytm.js` (reveal) + `booking-mock.js` + `contact-form.js` + `hero-3d.js` (hero-siden,
MC 12373) · `images/` (owner photos,
byte-exact) · `images/gal-0N-wW.jpeg` srcset ladder (machine-generated — regenerate via `docs/derived-ladder.md`, never hand-edit) ·
`data-*` hooks only; JS `defer`; no globals (C3 — the manifest exception retired with
`gallery-manifest.js`).
