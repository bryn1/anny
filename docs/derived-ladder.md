# Bildtrappan (srcset) — MACHINE-GENERATED, edita inte för hand

Filerna som serveras ligger i `images/` (namn `gal-0N-wW.jpeg`, t.ex. `gal-01-w768.jpeg`).
De är breddvarianter (384/768/1152 px) av de byte-exakta originalen `images/gal-0N.jpeg`
och refereras av `index.html`:as srcset-attrribut. Tidigare låg de i en egen `derived/`-mapp;
den flyttades 2026-11-11 (MC 12370) eftersom vm106-mirrorns server-allowlist omfattar
`images/**` men inte `derived/**`.

Genereras om från originalen (PIL LANCZOS, exif_transpose, quality 82, progressiv JPEG):

    python3 - <<'PY'
    from PIL import Image, ImageOps
    for n in (1,2,3,4):
        im = ImageOps.exif_transpose(Image.open(f"images/gal-0{n}.jpeg")).convert("RGB")
        w,h = im.size
        for tw in (384,768,1152):
            im.resize((tw, round(tw*h/w)), Image.LANCZOS).save(
                f"images/gal-0{n}-w{tw}.jpeg","JPEG",quality=82,optimize=True,progressive=True)
    PY

Porträttet (`images/anny-portratt.jpeg`, ägarlevererat 2026-11-11) har bara en variant
(`anny-portratt-w384.jpeg`) — källan är 414 px bred och vi ska aldrig uppskala.

Innehållet är en transformerad kopia av ägarbilderna — samma sekretessregel som för
originalen gäller: filerna hör bara hemma i det här repo (bryn1/anny), aldrig i
bryn1/Webdesign eller något offentligt ställe.
