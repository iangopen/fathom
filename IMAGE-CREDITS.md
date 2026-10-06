# Image credits

Every photograph shipped in `src/assets/` is listed here with its source and
licence. All of them are public domain, CC0, or Creative Commons; the CC BY and
CC BY-SA ones require attribution, and this file is where that attribution is
kept.

`src/lib/imageCredits.ts` holds the same table as data — that is the copy the
app reads, and `src/__tests__/imageCredits.test.ts` fails if an image ships
without an entry in it. Keep the two in step when you add an image.

All twenty-one were downloaded from Wikimedia Commons, checked at full resolution
for text or branding that would name the answer, then cropped and resized to
640×480 (the 4:3 the drill panels use). Cropping and rescaling is all that was
done; nothing was retouched. The special-mark source is a 602px Geograph
original, so it is upscaled slightly to fill the frame and reads a little soft.

## Anchors — `src/assets/anchors/`, rendered by `AnchorDisplay`

| File | Shows | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `fluke.jpg` | Fluke (Danforth pattern) anchor | [Anchor.jpg](https://commons.wikimedia.org/wiki/File:Anchor.jpg) | Eric Schmuttenmaer | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `plow.jpg` | Plow (CQR pattern) anchor | [Genuine CQR.jpg](https://commons.wikimedia.org/wiki/File:Genuine_CQR.jpg) | C Smith / Badmonkey (PD-self; Commons records no machine-readable author) | [Public domain](https://commons.wikimedia.org/wiki/Template:PD-self) |
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

## Distress signals — `src/assets/distress/`, rendered by `DistressDisplay`

| File | Shows | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `hand-flare.jpg` | A red hand flare held up at night | [Signal flare during a rescue training mission.jpg](https://commons.wikimedia.org/wiki/File:Signal_flare_during_a_rescue_training_mission.jpg) | U.S. Air Force photo by Staff Sgt. Bennie J. Davis III | [Public domain (US federal work)](https://commons.wikimedia.org/wiki/Template:PD-USGov-Military-Air_Force) |
| `orange-smoke.jpg` | A floating orange smoke signal | [Smoke buoy.jpg](https://commons.wikimedia.org/wiki/File:Smoke_buoy.jpg) | heb@Wikimedia Commons | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/) |
| `dye-marker.jpg` | A sea dye marker spreading in the water | [Sea dye marker.JPG](https://commons.wikimedia.org/wiki/File:Sea_dye_marker.JPG) | U.S. Air Force photo by Airman 1st Class Alexxis Pons Abascal | [Public domain (US federal work)](https://commons.wikimedia.org/wiki/Template:PD-USGov-Military-Air_Force) |

Six distress forms are **still drawn**, because no licensed photograph was
found at all: the parachute flare in the air, the red star rocket, the
November-over-Charlie hoist, the square flag with a ball, the arms signal and
flames on a vessel.

## PFDs — `src/assets/pfd/`, rendered by `PfdDisplay`

| File | Shows | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `flotation-aid.jpg` | A zip-front flotation vest | [Red life jacket.jpg](https://commons.wikimedia.org/wiki/File:Red_life_jacket.jpg) | Santeri Viinamäki | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `ring-buoy.jpg` | A ring buoy with grab lines, floating | [Lifebelt in Water 1.jpg](https://commons.wikimedia.org/wiki/File:Lifebelt_in_Water_1.jpg) | Das Robert | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |

Three PFD forms are **still drawn**: the offshore collar jacket, the throwable
cushion and the inflatable. See the PFD rejections below.

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

The distress and PFD photographs were held to the strict rule from the start,
not revised to it afterwards: no legible text of any kind - a place name, a web
address, a maker's badge - judged at the size the panel actually draws on a 2x
screen, and confirmed in the running app. Each of the five was opened in the
quiz, in the real Observed panel, at 1x (204x153 CSS px) and again with the page
rendered at 2x (408x306 device px, drawn from the same 640px file).

- `hand-flare.jpg` - the flare case carries a printed label; at 2x it is a few
  pale streaks with no letter shapes. No other text in frame.
- `flotation-aid.jpg` - one small maker's badge on the left chest. At 2x it is
  a white patch about twelve pixels wide with nothing readable in it.
- `orange-smoke.jpg`, `dye-marker.jpg`, `ring-buoy.jpg` - no text in frame.

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

### Distress signals

- *Distress flare mg 6522 / 6523 / 6524* - flares photographed on a table,
  unfired, and covered in printed instructions.
- *Lifeboat pyrotechnics* - **PARA RED ROCKET MK 8**, **RED HANDFLARE MK8** and
  **LIFESMOKE** printed on the cases. The name of the answer, three times.
- *Smoke signal 1* - an orange smoke canister unfired on a chart, labelled
  **BUOYANT ORANGE SMOKE** in several languages.
- *Cohete paracaidas* - a parachute rocket disassembled on a table, labelled.
- *Feux main* (hand flares on a yacht) - a 527px original with the flare a
  few pixels across; too small to read as anything at panel size.
- *Flickr - Official U.S. Navy Imagery - An officer lights a flare* - the
  flare is small beside a close-up helmeted face, and the frame reads as a
  portrait rather than a signal.
- *Lifeboatman with flare* - RNLI lettering on the helmet, and it is orange
  smoke from a swimmer, not a floating canister.
- *June 2020 Baltic Fleet submarine rescue exercise* - a distant smoke plume on
  a flat sea; loses to *Smoke buoy*, which shows the canister.
- *Gemini 4 Recovery with Green Marker Dye* (NASA) - the dye is there, but a
  spacecraft and a raft fill the frame.
- *Sjöräddningsövning 2014a* - a rescue exercise with two craft and a person in
  the water; the flare is incidental.
- No licensed photograph was found of a red parachute flare in the air, a red
  star shell, a November-over-Charlie hoist, a square flag with a ball, the
  arms signal or flames on a vessel.

### PFDs

- *Green life jacket* - a clean flotation vest, but its approval label is
  plainly legible on the front.
- *Personal flotation device.JPG* - a rack of offshore jackets stencilled
  **FRONT** and with size and stock numbers.
- *Kamizelka ratunkowa KR-7* and *US-Lifevest* - museum pieces behind glass,
  with a caption card and glare.
- *Life jacket mg 6576* - an inflatable with its whole instruction panel
  printed on the bladder.
- *Lifejacket with PLB fitted inside* - maker's logos and a beacon's labels.
- *Selbstaufblasende Schwimmweste BW P1210264* (public domain) - text-free, but
  it does not show the cylinder pf-05 describes and reads as an army vest over
  a shirt. The drawing is the clearer picture, so the inflatable stays drawn.
- *Life vests* - a loaner rack with a **BORROW LIFE JACKETS HERE** sign.
- *Estonia lifering*, *Life Belt (13431570545)*, *Life preserver
  (37584592321)*, *Livredningsbøye*, *Lifebuoy.jpg* - ring buoys lettered with a
  ship's name, a place, a maker or a post number.
- *Lifebelt against yellow* - a **NEXT LIFEBELT** sign beside it and **W11** on
  the ring.
- *Lifebuoy by the pool* - fragments of lettering on the ring.
- No licensed photograph was found of an offshore collar jacket without text
  on it, or of a throwable cushion at all.
