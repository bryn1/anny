# images/

Plats för riktiga bilder från ägaren. Galleriet visar bara bilder som faktiskt
finns på disk OCH är upprättade i `js/gallery-manifest.js`
(`window.ANNY_GALLERY_IMAGES`) — en saknad fil begärs aldrig ut (inga 404:or),
platshållaren "Bild kommer" består.

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

## Kvargande platshållare

| Fil | Plats |
|---|---|
| `gal-05.jpeg` | Gallerikort 5 (platshållare — fler bilder väntas från ägaren) |
| `gal-06.jpeg` | Gallerikort 6 (platshållare — fler bilder väntas från ägaren) |

Gallerikort 1–4 motsvarar nu `gal-01`–`gal-04` (titlarna "Långt blont" resp.
"Kortare blont", kort 5–6 behåller sina serviceplatshållartitlar).

Konvention (redan förberedd i `index.html` + `js/gallery.js`): lägg filen på
rätt namn OCH lägg till dess sökväg i listan i `js/gallery-manifest.js`
(`window.ANNY_GALLERY_IMAGES`) — då byter gallerikortet platshållaren mot
bilden (`data-img-slot` + manifestrad; ingen HEAD-check, inga 404:or för
saknade filer). Ingen markup-ändring behövs. Porträtt till "Om mig":
`portrait.jpeg` (platshållarkortet uppdateras till `<img>` av en senare fas
när bilden finns).
