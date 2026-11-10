# images/

Plats för riktiga bilder från ägaren. De fyra levererade fotona `gal-01`–`gal-04`
serveras direkt i `index.html` (galleriväggen + hero-vasken) med `width`/`height`
och `srcset`; breddvariationerna i srcset:et ligger i `derived/` (maskingenererade
— se `derived/README.md`). Manifest-seamen (`js/gallery-manifest.js` +
`js/gallery.js`, "Bild kommer"-byte via JS) pensionerades 2026-11-10 (MC 12367):
fikterna om vilka filer som finns står nu i markupen som faktiskt serveras.

## Proveniens (ägarkamera, levererade 2026-10-03)

| Fil | Ursprungligt filnamn | Ursprung |
|---|---|---|
| `gal-01.jpeg` | `1. Before.jpeg` | Ägarbild 2026-10-03 (hämtad från ägarens disk, par 1 före) |
| `gal-02.jpeg` | `1. after.jpeg` | Ägarbild 2026-10-03 (hämtad från ägarens disk, par 1 efter) |
| `gal-03.jpeg` | `2. Before.jpeg` | Ägarbild 2026-10-03 (hämtad från ägarens disk, par 2 före) |
| `gal-04.jpeg` | `2. After.jpeg` | Ägarbild 2026-10-03 (hämtad från ägarens disk, par 2 efter) |

Salongstillhörighet ej bekräftad av ägaren; interiören i gal-01 tyder på Müllers (ej verifierad).

Kopierade byte-exakt (ingen omkodning). Par 1: långt blont, glansiga vågor.
Par 2: kortare blont lob.

## Kvargande tomma slots

| Slot | Plats |
|---|---|
| Bal (före/efter) | Galleriväggen — `tom-rum`, "Bild kommer" (fler bilder väntas från ägaren) |
| Skäggtrim (före/efter) | Galleriväggen — `tom-rum`, "Bild kommer" (fler bilder väntas från ägaren) |
| Porträtt | "Om mig"-ramen — `tom-rum`, "Porträtt — bild kommer" |

Gallerikort 1–4 motsvarar nu `gal-01`–`gal-04` (titlarna "Långt blont" resp.
"Kortare blont"); de två sista slotsen behåller sina serviceplatshållartitlar.

Konvention (2026-11-10, MC 12367): en ny bild = (1) lägg filen på rätt namn här,
(2) kör om genereringen i `derived/README.md`, (3) byt `tom-rum`-rutan mot ett
`<img>` med `width`/`height` + `srcset` i `index.html` (schema efter de fyra
befintliga). Bildtexten får aldrig säga mer än vad som är bekräftat (I1).
