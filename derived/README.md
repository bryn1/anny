derived/ — MACHINE-GENERATED, do not hand-edit.

Breddtrappan for galleri- och hero-bilderna (srcset). Genereras om fran de byte-exakta
originalen i images/ (PIL LANCZOS, exif_transpose, quality 82, progressiv JPEG):

  python3 - <<PY
  from PIL import Image, ImageOps
  for n in (1,2,3,4):
      im = ImageOps.exif_transpose(Image.open(f"images/gal-0{n}.jpeg")).convert("RGB")
      w,h = im.size
      for tw in (384,768,1152):
          im.resize((tw, round(tw*h/w)), Image.LANCZOS).save(
              f"derived/gal-0{n}-w{tw}.jpeg","JPEG",quality=82,optimize=True,progressive=True)
  PY

Innehallet ar en transformerad kopia av agarbilderna — samma sekretessregel som
for images/ galler: filerna hor bara hemma i det har repo (bryn1/anny).
