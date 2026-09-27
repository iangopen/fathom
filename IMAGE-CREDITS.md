# Image credits

Every photograph shipped in `src/assets/` is listed here with its source and
licence. All of them are public domain, CC0, or Creative Commons; the CC BY and
CC BY-SA ones require attribution, and this file is where that attribution is
kept.

`src/lib/imageCredits.ts` holds the same table as data — that is the copy the
app reads, and `src/__tests__/imageCredits.test.ts` fails if an image ships
without an entry in it. Keep the two in step when you add an image.

All sixteen were downloaded from Wikimedia Commons, checked at full resolution
for text or branding that would name the answer, then cropped and resized to
640×480 (the 4:3 the drill panels use). Cropping and rescaling is all that was
done; nothing was retouched. The special-mark source is a 602px Geograph
original, so it is upscaled slightly to fill the frame and reads a little soft.

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

## Buoys — `src/assets/buoys/`, rendered by `BuoyDisplay`

| File | Shows | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `port-hand.jpg` | Green can, Genesee River, Rochester NY | [Green buoy Genesee River (3795382796).jpg](https://commons.wikimedia.org/wiki/File:Green_buoy_Genesee_River_(3795382796).jpg) | Carl Mueller | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| `cardinal-south.jpg` | South cardinal off St Mawes | [South cardinal buoy off St Mawes (4950686323).jpg](https://commons.wikimedia.org/wiki/File:South_cardinal_buoy_off_St_Mawes_(4950686323).jpg) | Tim Green from Bradford | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |
| `cardinal-east.jpg` | East cardinal on the Manacles, Falmouth | [Cardinale Est "Manacle" (Falmouth, GB).jpg](https://commons.wikimedia.org/wiki/File:Cardinale_Est_%22Manacle%22_(Falmouth,_GB).jpg) | Alvaro | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5/) |
| `isolated-danger.jpg` | Isolated danger mark off Valencia | [2020-08-17 Boia enfront de la costa de València i Port Sapatja.jpg](https://commons.wikimedia.org/wiki/File:2020-08-17_Boia_enfront_de_la_costa_de_Val%C3%A8ncia_i_Port_Sapatja.jpg) | Pacopac | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `safe-water.jpg` | Safe water mark, Limfjord | [Limfjord safe water mark.jpg](https://commons.wikimedia.org/wiki/File:Limfjord_safe_water_mark.jpg) | Paul Fox | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `special.jpg` | Special mark off Seahill, Belfast Lough | [Buoy off Seahill - geograph.org.uk - 920114.jpg](https://commons.wikimedia.org/wiki/File:Buoy_off_Seahill_-_geograph.org.uk_-_920114.jpg) | Ross | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |

Six marks are **still drawn**, for want of a photograph that passes rather
than by choice: the red nun (`starboard-hand`, by-02), the junction mark
(`junction-red-top`, by-19), the north and west
cardinals (`cardinal-north`, `cardinal-west`, by-04 and by-07) and the two ICW
overlays (`icw-triangle`, `icw-square`, by-14 and by-15). See the buoy
rejections below.

Region matters for the lateral marks and nowhere else. Cardinal, isolated
danger, safe water and special marks mean the same everywhere, so those come
from British, Danish and Spanish waters. A Region A lateral mark is the reverse
of ours - a red CAN is a port mark there - so the green can is a Region B mark,
from the United States.

## Leak check

These are identification questions, so an image that names its own answer is
the same failure the text captions were. Each file was inspected at full
resolution before cropping:

- No maker's plate, model name, product caption or pattern name is legible on
  any of the ten anchors and clouds.
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

Buoys are covered in text by design, so the test for them is sharper: does the
text *answer the question*, not merely is there any.

- **A lateral number does.** Odd is port and even is starboard, so a legible
  number on a green can or a red nun is the answer. The green can chosen has
  no number on the side facing the camera - only its two reflective patches.
- **A cardinal's quadrant does.** Any mark painted with N, NORD, WEST and the
  like was turned down (see below).
- **Any legible text is out, even a hazard's name.** Legibility is judged at
  the size the panel actually draws in *device* pixels: 216 CSS px wide, which
  on a 2x screen is 432 pixels of the 640px file. The east cardinal carries
  *MANACLE* painted down one leg; at 216px and at 432px it cannot be read, so
  it stays. See the rejections below for the north and west photographs.
- The south cardinal has faint vertical lettering on one leg of its frame,
  unreadable even at full resolution. The isolated danger mark has a small
  maker's monogram on its lantern box, not a word. The safe water mark has
  scratched, unreadable characters on one white stripe.

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

### Buoys

- *Channel marker near Point Lookout 02 / 03* (red nun, New York) - the best
  red nuns found, but **2A** is painted large on the face. Even is starboard:
  the number is the answer. This is why by-02 is still drawn.
- *Channel marker near Point Lookout 01* (green can) - **13** painted large.
- *Buoy in Puget Sound*, *Marker Bouy and Seagull, Miami*, *Rappahannock River
  buoy 6*, *Double-crested cormorants poplar island*, *KeyWestFL Buoy* - red
  lighted buoys with legible even numbers, and a lighted pillar is not the nun
  shape by-02 describes anyway.
- *Boya Buoy* (red nun, public domain) - too distant to crop to a usable frame,
  and part of a number is visible.
- *Red nun in Gloucester harbor* (video) - the nun is on a buoy tender's deck
  beside a green buoy, under a hull reading U.S. COAST GUARD.
- *Daymark Chincoteague VA1* (red triangle daybeacon) - **2** on the board.
- *Thousand Islands - panoramio (6)* (green square daymark) - **191** on the
  board, and it is a light structure, not a daybeacon.
- *Balise-cardinale-Nord* - **GOLE VAS NORD** painted down the column.
- *Tonne Norderney-N* - **Norderney-N** painted on the hull, and it is lying on
  a quay.
- *Jade WRG N 1666* - the mark's name, with its N, painted on the hull.
- *West Bramble Buoy* - **WEST BRAMBLE** painted on it.
- *Eday Gruna buoy - geograph.org.uk - 5117066* (north cardinal, Rob Farrow,
  CC BY-SA 2.0) - cropped and briefly shipped. **EDAY GRUNA** on the body
  panel is illegible at 216px but readable at 432px, i.e. on any 2x screen.
  A rock's name, not the quadrant, but the rule is no legible text; the mark
  went back to its drawing.
- *Corran Ledge marker buoy - geograph.org.uk - 5120785* (west cardinal, David
  Lally, CC BY-SA 2.0) - cropped and briefly shipped. **CORRAN LEDGE** and a
  web address are plainly readable at 432px. Back to its drawing.
- *Mathews Rock Buoy* (red-top junction nun, WindBorneListener, CC0) - cropped
  and briefly shipped for by-19. The letters **DC** on the top band are
  legible even at 1x in the panel. They name the mark rather than the side,
  but the rule is no legible text, so by-19 is drawn.
- *2023 Lotsenboot Medem* (north cardinal) - a clean mark, but a pilot boat
  lettered PILOT fills the right of the frame and no 4:3 crop keeps the whole
  buoy without it.
- *Buoy marking the wreck of HMS Natal* (isolated danger) - **NATAL** painted on
  the hull; it names a wreck, which is half the answer to by-10.
- *No Boats (7545193908)* - a real exclusion mark, and exactly why the
  regulatory questions (by-28 to by-30) carry no picture: **NO BOATS** is
  printed on it.
- *Maintaining buoys for safer river navigation* (USACE, public domain) - a
  Western Rivers regulatory buoy lettered **WING DAM**. Same reason.
- No licensed photograph was found of an ICW yellow triangle or square on a
  buoy, of a green-topped junction can, of a US range pair, or of a Western
  Rivers crossing daymark. The Dutch junction buoys on Commons are Region A,
  where the same colours mean the opposite, and were not considered.
