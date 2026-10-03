# ARCHITECTURE — project "anny" (Anny Morin, Frisör Karlskrona)

Created 2026-10-02 (MC 3934.2, ARCHITECT OPENING — NEW file, did not exist before this run).
Layout v2: this is the ONE architecture statement; the architect keeps it true — any module,
entrypoint, port, dependency or data-store change updates this file in the same run.
File-level placement + naming: `.audits/202610021723-b8a81095/out/PLACEMENT.md`.

## What this is

Frontend-only static one-page site (Swedish) for hairdresser **Anny Morin**, Karlskrona —
publicly tied to salon **Müllers.** (Landbrogatan 11); the employment tie is UNVERIFIED per
research. Contact data is either VERIFIED or placeholder-marked, never invented: direct phone
(`072-155 48 60`) and e-post (`Anny.mullerskarlskrona@gmail.com`) are owner-supplied (2026-10-03,
MC 10024.1), opening hours and prices are not. Long-scroll narrative flow: Hero → Om mig →
Tjänster → Galleri → Boka → Kontakt.
Project intent: real site, frontend-first — backend explicitly deferred (below).

## Modules (file → single concern)

| Modul | Concern |
|---|---|
| `index.html` | enda entrypoint; markup för scroll-flödet, `data-*`-hooks; head-sektion för metadata (title, description, Open Graph, canonical, JSON-LD `HairSalon`/`BeautySalon`); ingen logik |
| `css/tokens.css` | design tokens som CSS custom properties (palett, typografi, spacing) |
| `css/layout.css` | pageskelett, sektionsflyt, breakpoints (rör ej kalender-gridden) |
| `css/components.css` | komponentstilar inkl. kalender-mock, modal, formulär, bekräftelse-tillstånd |
| `js/scroll-reveal.js` | scroll-reveal (IntersectionObserver), hero-ordbygge (auto-kompletteras i vila), reduced-motion |
| `js/gallery-manifest.js` | galleriets bildmanifest — deklarerar vilka bildfiler som faktiskt finns (seam; C3-undantaget). Listar nu 4 riktiga foton (ägare-levererade 2026-10-03, `gal-01`–`gal-04`) |
| `js/gallery.js` | före/efter-galleri (horisontell scroll), placeholder-kort, bild-in-byte via manifest |
| `js/booking-mock.js` | "Boka tid"-kalender MOCK (Hotell-mönster, se Reuse); CTA telefon/IG |
| `js/contact-form.js` | klientvalidering + väntande-tillstånd; ingen dispatch |
| `images/` | ägarlevererade foton `gal-01`–`gal-04` (provens i `images/README.md`, byte-exakta kopior) + reserverade platshållarslots 5–6 (fler bilder väntas från ägaren); ny bild = fil i den här mappen + manifest-rad, ingen markup-ändring |
| `DESIGN.md` (rot) | design-spec DIRECTION/TOKENS/LAYOUT — skrivs av frontend-fasen |
| `hosting.yaml` (rot) | vm106-hostningdeklaration (strict JSON, statisk — ingen port); konsumeras av fleet-reconcilern, laddas EJ av sajten |
| `robots.txt` (rot) | crawl-deklaration för sökmotorer (endast `User-agent: *` + `Allow: /`, ingen Sitemap-rad — en sida); server under `/anny/robots.txt`, konsumeras EJ av sajten |

## Entrypoint & serving

- Entrypoint: `index.html` — the only one. No routing, no pages beyond the single scroll flow.
- Serving (dev-only): `python3 -m http.server <ephemeral port>` from the repo root, curl/verify,
  then stop the server. Nothing is deployed in this phase; no process is left running.

## Dependencies

None. Vanilla HTML/CSS/JS: no framework, no build step, no package manager, no CDN deps
(offline-first). The files ARE the product.

## Ports

None fixed. Ephemeral dev-only port chosen at serve time (any free port); nothing listens
between checks.

## Data stores

None. No server, no database, no localStorage/cookies. All state is in-memory page state;
gallery + mock availability live as static placeholders (`images/` + inline JS data structures).

## Backend — DEFERRED (future modules, not built now)

- **B1 E-post-dispatch** (contact form): seam is `contact-form.js`'s submit handler. Today it
  renders the pending state ("skickas till e-post när backend kopplas") — never a fake success.
- **B2 Riktig bokningsintegration**: Müllers has NO public web booking (research VERIFIED —
  booking via telefon/Instagram). "Boka tid" is a mock whose confirm-modal says the real booking
  goes via telefon/IG (telefon `072-155 48 60`, owner-supplied 2026-10-03; öppettider still
  placeholder until the owner confirms). When a real system exists, the
  mock's availability-data seam becomes the integration point (likely external-partner link-out,
  e.g. Bokadirekt/Meevo pattern from research).

Neither B1 nor B2 is built in this run; the frontend must not fabricate either outcome.

## Reuse (mechanism-monogamy)

The booking-calendar mock REUSES the calendar-matrix pattern proven in **bryn1/Hotell**
(owner steer 2026-10-02, verbatim: "there is a booking system in hotell that might be possible
to reuse"). Reference checkout: `.tmp/hotell-ref` (scratch); exact files + pattern anchors + the
two known defects that must NOT carry over are pinned in PLACEMENT.md §4. Pattern reuse only —
own files, no vendoring, no copy of the broken parts.

## Invariants (violation = bug, not style)

- **I1** No invented contact data — only research-VERIFIED facts (salongadress, IG
  `@mullers.anny`) plus the sanctioned owner-supplied values: telefon `072-155 48 60` /
  `+46721554860` and e-post `Anny.mullerskarlskrona@gmail.com` (owner chat 2026-10-03, MC 10024.1).
  Anything else phone-shaped or e-post-shaped in the tree is fabricated = red. Öppettider and
  prices remain placeholder-marked "pending owner confirmation".
- **I2** No fake confirmations: booking mock never books, contact form never sends — both render
  honest states.
- **I3** The calendar grid template is declared exactly once and no media query in any file
  re-declares it at any width (Hotell defect 1: late `responsive.css` override broke the
  31-col matrix ≥768px). Mobile adapts via a scroll wrapper + cell sizing; 375px must work.
- **I4** The booking confirm/success state is fully styled incl. a visible close action
  (Hotell defect 2: `.booking-success` had zero CSS).
- **I5** `prefers-reduced-motion` disables scroll animation; gallery + modal are keyboard
  operable; buttons/links named; focus-visible.

Conventions (violation = style): ~250/400-line file budgets; Swedish copy; `data-*` hook naming.

## Contracts (seams builders cite)

- **C1** `tokens.css` is the only file defining CSS custom properties; others consume.
- **C2** CSS load order in `index.html`: `tokens.css → layout.css → components.css` (I3 leans on
  this — the order IS an invariant for the calendar-grid rule, a convention otherwise).
- **C3** Each JS module: `defer`, one concern, no shared globals, markup contact only via
  `data-*` hooks. *Sole sanctioned exception (MC 3934.3 c2):* `js/gallery-manifest.js` declares
  the read-only `window.ANNY_GALLERY_IMAGES` inventory, loaded before `gallery.js` (defer order)
  and only ever read by it — the no-404 photo seam replacing the v1 HEAD-probe. *Not a module:* a
  `<script type="application/ld+json">` data-block in `head` (SEO) carries no code and no `defer`,
  so C3's defer/module rule does not apply to it (MC 10024.1).
- **C4** Calendar markup follows the Hotell shell shape (single `.calendar-grid`-style container;
  header/body/rows sharing one template; horizontal-scroll wrapper on mobile) with anny's own
  class names.

## History

- 2026-10-02 MC 3934.2 — created; Hotell calendar-pattern reuse added same run per owner steer.
- 2026-10-03 MC 3934.3 c2 — QA fix round: malformed `data-reveal"` markup repaired (17 elements,
  the reveal-contract P0), hero build auto-completes at rest, gallery HEAD-probe replaced by the
  `js/gallery-manifest.js` seam (zero console 404s, C3 exception above), inline data-URI favicon,
  invalid form submit replaces the stale aria-live status.
- 2026-10-03 MC 3934.7 — pre-publish pass: `hosting.yaml` added (vm106 static hosting, name
  `anny`, validator PASS), images/README provenance corrected (salong-tillhörighet avmarkerad som
  ej verifierad), exec-bitar borttagna ur `images/*.jpeg`.
- 2026-10-03 MC 3934.5-close — architect closing pass: dokument-vs-träd verifierat (moduler,
  entrypoint, dependencies, ports, stores, B1/B2, C1–C4 inkl. C3-undantaget — allesamt
  överensstämmande). `images/`-raden i modultabellen uppdaterad till verkligheten (4
  ägarlevererade foton `gal-01`–`gal-04` + platshållarslots 5–6 väntas); i övrigt NO DRIFT.
- 2026-10-03 MC 10024.1 — real contact data + local SEO: telefon/e-post becoming owner-supplied
  linked values (`tel:`/`mailto:`, I1-undantaget utökat), `robots.txt` tillagd, head-sektionen
  utökad med title/description/Open Graph/canonical + JSON-LD `["HairSalon","BeautySalon"]`
  (avsiktligt UTAN openingHours, priceRange och aggregateRating — ej bekräftat av ägaren), samt
  Trossö-mention i hero-texten.
