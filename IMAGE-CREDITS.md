# Image credits

Every photograph shipped in `src/assets/` is listed here with its source and
licence. All of them are public domain, CC0, or Creative Commons; the CC BY-SA
ones require attribution, and this file is where that attribution is kept.

`src/lib/imageCredits.ts` holds the same table as data — that is the copy the
app reads, and `src/__tests__/imageCredits.test.ts` fails if an image ships
without an entry in it. Keep the two in step when you add an image.

All ten were downloaded from Wikimedia Commons at full resolution, checked for
text or branding that would name the answer, then cropped and resized to
640×480 (the 4:3 the drill panels use). Cropping and rescaling is all that was
done; nothing was retouched.

## Anchors — `src/assets/anchors/`, rendered by `AnchorDisplay`

| File | Shows | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `fluke.jpg` | Fluke (Danforth pattern) anchor | [Anchor.jpg](https://commons.wikimedia.org/wiki/File:Anchor.jpg) | Eric Schmuttenmaer | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `plow.jpg` | Plow (CQR pattern) anchor | [Genuine CQR.jpg](https://commons.wikimedia.org/wiki/File:Genuine_CQR.jpg) | — | Public domain |
| `claw.jpg` | Claw (Bruce pattern) anchor | [Bruce anchor in Gdansk.jpg](https://commons.wikimedia.org/wiki/File:Bruce_anchor_in_Gdansk.jpg) | LukaszKatlewa | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `grapnel.jpg` | Grapnel anchor | [Hel MOW kotwica 03.jpg](https://commons.wikimedia.org/wiki/File:Hel_MOW_kotwica_03.jpg) | Zala | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `mushroom.jpg` | Mushroom anchor | [Een paddenstoelanker (01).JPG](https://commons.wikimedia.org/wiki/File:Een_paddenstoelanker_(01).JPG) | S.J. de Waard | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |

## Clouds — `src/assets/clouds/`, rendered by `CloudDisplay`

| File | Shows | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `cirrus.jpg` | Cirrus — mare's tails | [CirrusField-color.jpg](https://commons.wikimedia.org/wiki/File:CirrusField-color.jpg) | PiccoloNamek | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `mackerel.jpg` | Cirrocumulus — a mackerel sky | [2021-11-27 15 52 16 Cirrocumulus "Mackeral sky"…](https://commons.wikimedia.org/wiki/File:2021-11-27_15_52_16_Cirrocumulus_%22Mackeral_sky%22_above_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg) | Famartin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `halo.jpg` | A 22° halo through cirrostratus | [Cirrostratus fibratus with 22 degrees halo.jpg](https://commons.wikimedia.org/wiki/File:Cirrostratus_fibratus_with_22_degrees_halo.jpg) | Eduardo Marquetti | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `cumulus.jpg` | Fair-weather cumulus over the sea | [Sea sky and clouds, Ibiza, Spain.jpg](https://commons.wikimedia.org/wiki/File:Sea_sky_and_clouds,_Ibiza,_Spain.jpg) | Joselodos | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `cumulonimbus.jpg` | Cumulonimbus incus — a thunderhead and its anvil | [20200607 Chmura cumulonimbus incus nad Krakowem 1407 0252.jpg](https://commons.wikimedia.org/wiki/File:20200607_Chmura_cumulonimbus_incus_nad_Krakowem_1407_0252.jpg) | Jakub Hałun | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

## Leak check

These are identification questions, so an image that names its own answer is
the same failure the text captions were. Each file was inspected at full
resolution before cropping:

- No maker's plate, model name, product caption or pattern name is legible on
  any of the ten.
- `fluke.jpg` carries cast lettering reading **U.S. NAVY** and a stock number.
  That names a navy, not an anchor pattern, and it is illegible at the size the
  panel draws. It is the only legible text on any of the ten.
- `mushroom.jpg` is cropped hard at the right edge to keep a *different* anchor,
  standing on the same quay, out of frame — a second pattern beside "identify
  this anchor" is a distractor the photograph should not supply.
- `cumulus.jpg` is cropped short of the photographer's signature in the
  bottom-right corner.
- The anchor bottom-matching questions (`an-06` … `an-13`) still get **no image
  at all**, which is the rule that was already in force; see `QUESTION_ANCHORS`
  in `src/drills/colregs/index.tsx`. That some of these anchors are photographed
  lying on sand or mud therefore answers nothing.

## Rejected, and why

Kept here so the next category does not re-tread the same ground:

- *Genuine Bruce anchor.jpg* — the best claw silhouette found, but **BRUCE
  ANCHOR** is cast into the shank in raised letters. A direct answer leak.
- *Ancre FOB.jpg* — clean studio fluke anchor, but carries a cast maker's logo
  and weight stamp, and reads as a catalogue product shot.
- *Bruce Anchor A719.JPG* — a person in a lifejacket with printed text stands in
  front of the anchor.
- *Ancla tipo Danforth, Roquetas de Mar* — the anchor is incidental and a hull
  name is legible across the frame.
