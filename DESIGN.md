# DESIGN — Anny Morin, Frisör Karlskrona

MC 3934.3 · 2026-10-03 · frontend-build. Adapted from the fleet design baseline
(`workflow-frontend/design-baseline.md`: zinc ramp + WCAG-checked pairs) to a hair-salon
context. All contrast ratios below are computed this session (WCAG 2.2 relative-luminance).

## DIRECTION

Calm, editorial monochrome. The site itself is quiet — warm stone neutrals, generous space,
one copper accent — so that **the hair photos carry the color** (research section C:
"monokrom, minimalistisk base + en stark scroll-effekt"). Motion: the hero name builds
word-by-word on scroll; sections reveal once; the gallery scrolls horizontally (the researched
FC-Nantes pattern → before/after story-telling). Everything honest: the booking calendar is a
labelled demo, the contact form states that no backend is connected, unknowns stay empty with
`<!-- pending owner confirmation -->` (invariant I1/I2).

Voice: Swedish, warm, first-person ("Jag klipper, färgar och vårdar hår i Karlskrona").

## TOKENS (implemented 1:1 in `css/tokens.css` — C1: only that file defines custom properties)

### Base — warm monochrome (Tailwind stone ramp, replacing the baseline's cool zinc)

| Token | Hex | Role | Checked pair → ratio |
|---|---|---|---|
| `--bg-primary` | `#ffffff` | page background | — |
| `--bg-secondary` | `#fafaf9` | alternating sections | — |
| `--bg-tertiary` | `#f5f5f4` | inline surfaces | — |
| `--surface` / hover / active | `#ffffff` / `#fafaf9` / `#f5f5f4` | cards, inputs | — |
| `--border-subtle` / `--default` / `--strong` | `#e7e5e4` / `#d6d3d1` / `#a8a29e` | hairlines | stone-400 border only, never text |
| `--text-primary` | `#1c1917` | headings, body | **17.49:1** on white PASS |
| `--text-secondary` | `#57534e` | secondary copy | **7.63:1** on white PASS |
| `--text-tertiary` | `#78716c` | hints, labels | **4.80:1** on white PASS |

### Accent — ONE copper (the only chromatic color in chrome; hair photos do the rest)

| Token | Hex | Checked pair → ratio |
|---|---|---|
| `--accent` | `#9a3f1f` | on white **6.76:1** PASS · white on accent **6.76:1** PASS · on `#fafaf9` **6.48:1** PASS |
| `--accent-hover` | `#6f3417` | on white **9.64:1** PASS |
| `--accent-surface` | `rgba(154,63,31,.08)` | selected slot / chip background (decorative; text on it stays `--text-primary`) |
| `--focus-ring` | `#9a3f1f` | outline 2px + 2px offset (I5) |

### Dark mode (`prefers-color-scheme: dark`, same file)

bg `#0c0a09` · surfaces `#1c1917`/`#292524` · borders `#292524`/`#44403c`/`#57534e` ·
text `#f5f5f4` **18.11:1** / `#d6d3d1` **13.26:1** / `#a8a29e` **7.83:1** ·
accent `#fb923c` **8.73:1** on bg — all PASS.

### Type · space · radius · z

- `--font-display: Georgia, "Iowan Old Style", "Times New Roman", serif` — display only (hero,
  h2): salon editorial feel with **zero web-font downloads** (system fonts, offline rule).
- `--font-sans`: baseline system stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, …`).
- Major-third scale 1.25 from baseline: 12.8 / 16 / 20 / 25 / 31.2 / 39.1 px; hero uses
  `clamp(39px, 8vw, 76px)`. Line-heights 1.2/1.45/1.5/1.55 per baseline.
- Spacing: 4px base, named steps 1→24 per baseline; section rhythm `--space-24` (96px) desktop.
- Radii per tokens.css (4/6/8/12 px + full-round); shadows the baseline's subtle set, dark = lighter-surface.
- `--z-header: 40`, `--z-dialog: 100` (native `<dialog>` stacks its own backdrop below).

## LAYOUT

Single page, long-scroll narrative (research C: linear narrative + reward CTA at end):
`Hero → Om mig → Tjänster → Galleri → Boka tid → Kontakt → footer`, sticky slim header with
anchor nav + IG link. Container: 100% / max 1120px / 16px inline padding (32px ≥768px).

- **Hero** (min-height 92vh): eyebrow "Frisör i Karlskrona", display title built word-by-word
  from `data-hero-title="Anny Morin — Frisör Karlskrona"`, sub-line, two CTAs (Boka tid → accent,
  Se mitt arbete → ghost). Word build = scroll-progress over hero via IntersectionObserver + rAF;
  all words static when `prefers-reduced-motion: reduce` (I5).
- **Om mig**: two-column ≥768px (text + portrait placeholder card), single column mobile.
- **Tjänster**: card grid 1/2/3 cols at 0/768/1024px; services are the VERIFIED list only;
  price row renders `–` + pending-owner comment (I1).
- **Galleri**: horizontal snap-scroller (the researched horizontal-scroll pattern); before/after
  cards, CSS-gradient placeholder blocks labelled "Bild kommer"; markup ready for real
  `images/gal-XX.jpeg` (no 404s now — gradient placeholders, images/ holds the convention).
- **Boka tid (mock)**: Hotell calendar-matrix pattern (C4) — weekday columns (Mån–Fre),
  time-slot rows. The grid template (`--cal-slot-w` + 5 explicit `minmax()` tracks) is declared
  **exactly once**, in `components.css`; header/rows join it via `display:contents`; mobile
  adapts via `.cal-wrap` horizontal-scroll wrapper — **no media query anywhere re-declares the
  template** (I3, Hotell defect 1 not copied). Slots: `Ledig` = `#e7e5e4` + `#1c1917` (13.93:1),
  `Upptagen` (mock) = `#44403c` + `#fafaf9` (9.84:1). Section is labelled demo (I2).
- **Booking modal**: native `<dialog>` (Esc, focus-trap, backdrop), slot-select → confirm view →
  honest demo view stating real booking goes via telefon/Instagram (telefon `072-155 48 60` and
  IG `@mullers.anny`, both linked). Fully styled confirm/success state incl. visible "Stäng" button
  (I4, Hotell defect 2 not copied). **Never claims a booking happened.**
- **Kontakt**: form (namn/e-post/meddelande, client validation) + address block
  (Landbrogatan 11, 371 35 Karlskrona — VERIFIED); telefon + e-post are owner-supplied values
  linked `tel:`/`mailto:` (MC 10024.1, 2026-10-03); öppettider stays pending-owner commented (I1).
  Submit → persistent honest pending note (I2).
- **Footer**: name, address, IG link (nav + footer per facts rule), nav anchors.
- Breakpoints 768/1024px only; 375px is the design target for calendar + gallery scroll.

## FILES (per PLACEMENT.md)

`index.html` · `css/tokens.css` → `css/layout.css` → `css/components.css` (C2) ·
`js/scroll-reveal.js` · `js/gallery.js` · `js/booking-mock.js` · `js/contact-form.js` ·
`images/` (placeholder convention). `data-*` hooks only; JS `defer`; no shared globals (C3).
