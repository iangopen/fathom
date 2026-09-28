---
name: fathom-imagery
description: Sourcing, licensing and wiring photographic reference images for Fathom's visual drill categories. Use when replacing a drill diagram with photographs, adding an image to src/assets, or touching imageCredits.ts, IMAGE-CREDITS.md or AnchorDisplay/CloudDisplay.
---

# Fathom imagery: photographs for the visual categories

The two hard rules — no image may name its own answer, and no image ships
without a licence and a credit — are in CLAUDE.md, not here, because they must
be in context whether or not this skill is loaded. This file is the *how*.

Anchors and clouds are photographs. Day shapes, nav lights, vessel hierarchy,
vessel types, buoyage, distress signals, PFDs, boat parts and signal flags are
still hand-drawn SVG, and follow the same route one category at a time.

## What a category conversion actually changes

Only what the display component renders. `AnchorDisplay` and `CloudDisplay`
kept their prop contracts (`type`, `label`), so `QUESTION_ANCHORS`,
`QUESTION_CLOUDS` and `VisualPanel` were untouched, and the "OBSERVED" panel
chrome is the same one every diagram sits in. Do the same for the next one:
swap the `<svg>` body for an `<img>` and leave the surrounding component,
its props and its callers alone.

## Where the files go

`src/assets/<category>/<name>.jpg`, imported as modules:

```tsx
import fluke from '../../../assets/anchors/fluke.jpg';
```

NOT `public/`. Vite hashes the module import and prefixes the `/fathom/` base
itself, so nothing has to thread `import.meta.env.BASE_URL` through a
component, and vitest resolves the import without extra config. Export the
name→image map (`ANCHOR_IMAGES`, `CLOUD_IMAGES`) so the credits test can walk
it.

640x480 JPEG, quality ~82, progressive. That is the 4:3 the old 220x170
viewBox was close to, so the panel keeps the size and shape it has always had.
Ten images land at roughly 500 KB total.

Alt text describes the FRAME, never the subject — "Photograph of an anchor,
shown for identification". A screen reader must get the question, not the
answer.

## Sourcing

Wikimedia Commons is the practical source; US federal works (USCG, NOAA) are
public domain by default. Google Images is fine for *discovery* with the
Usage Rights filter, never as a direct source.

Browse by category rather than full-text search — search is noisy, categories
are curated. The real names are more specific than you would guess:
`Fluke anchors`, `Plough anchors`, `Claw anchors`, `Grapnel anchors`,
`Mushroom anchors` (all under `Anchors by type`); `Cirrus clouds`,
`Cirrocumulus clouds`, `Cumulonimbus incus`, `Cumulus humilis clouds` (all
under `Cloud types`). List subcategories first when a category comes back
empty — it usually means the name is wrong, not that nothing exists.

Useful API calls (add a `User-Agent`; batch up to 10 titles per request):

- members: `action=query&list=categorymembers&cmtitle=Category:<name>&cmtype=file|subcat&cmlimit=100`
- licence + author + a scaled URL in one go:
  `action=query&prop=imageinfo&titles=<t1>|<t2>&iiprop=url|extmetadata|size&iiurlwidth=1800`
  — read `LicenseShortName`, `LicenseUrl`, `Artist` out of `extmetadata`.

## Vetting — do this before cropping, not after

Download at full resolution and LOOK at each candidate. The reasons things get
rejected, from the first pass:

- **Text on the object.** The best claw silhouette on Commons has BRUCE ANCHOR
  cast into the shank in raised letters. Catalogue product shots carry maker
  logos and weight stamps. Zoom the shank, the crown and any flat face.
- **A second, different specimen in frame.** Another anchor pattern beside
  "identify this anchor" is a distractor the photograph should not supply.
- **Clutter and low contrast.** People, mooring lines, weed, a subject that is
  10% of the frame, or a dark object on dark mud. It has to read at 240px.
- **Watermarks and signatures.** Usually croppable.

Record the rejections and why in IMAGE-CREDITS.md so the next category does not
re-tread the same ground.

## Cropping

Crop to 4:3 with a script, not by eye, so every image in a category matches.
Pillow, `ImageOps.fit(im.crop(box), (640, 480), Image.LANCZOS)`. Take crop
boxes as fractions of the source where a rough region will do, and absolute
pixels where something specific has to stay out of frame. Check every output
before wiring it in — a fit-to-4:3 on a landscape source will happily slice the
end off a shank; using the full frame is often the fix.

## Credits

`src/lib/imageCredits.ts` is authoritative and keyed `<kind>:<name>` matching
the display component's own union type. `IMAGE-CREDITS.md` is the same table
for a human, plus the leak-check notes and the rejection list.

`src/__tests__/imageCredits.test.ts` walks the exported image maps and fails if
an image ships with no credit, if a credit names an image that is not shipped,
or if a BY licence is recorded with no author or deed URL. Extend the `KINDS`
array when a category is added — that is the whole wiring.

## Finishing

`npx tsc --noEmit`, `npm test`, `npm run build`, and then actually run the app
and look at the panel. A static test proves the `<img>` is emitted; it does not
prove the photograph reads as the thing it is supposed to be.
