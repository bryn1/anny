# images/

Plats för riktiga bilder när ägaren levererar dem (inga bilder finns ännu —
galleriet visar medvetet "Bild kommer"-platshållare, inget refererat filnamn
404:ar eftersom sajten ännu inte begär ut någon bildfil).

Konvention (redan förberedd i `index.html` + `js/gallery.js`):

| Fil | Plats |
|---|---|
| `gal-01.jpeg` | Gallerikort "Balayage" |
| `gal-02.jpeg` | Gallerikort "Klippning" |
| `gal-03.jpeg` | Gallerikort "Färg" |
| `gal-04.jpeg` | Gallerikort "Bröllopsuppsättning" |
| `gal-05.jpeg` | Gallerikort "Bal" |
| `gal-06.jpeg` | Gallerikort "Skäggtrim" |

Lägg bara filen på rätt namn — gallerikortet byter platshållaren mot bilden
automatiskt (`data-img-slot` + HEAD-check i `gallery.js`). Ingen markup-
ändring behövs. Porträtt till "Om mig": `portrait.jpeg` (platshållarkortet
uppdateras till `<img>` av en senare fas när bilden finns).
