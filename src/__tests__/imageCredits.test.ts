import { describe, it, expect } from 'vitest';
import { IMAGE_CREDITS, creditFor } from '../lib/imageCredits';
import { ANCHOR_IMAGES } from '../drills/colregs/components/AnchorDisplay';
import { CLOUD_IMAGES } from '../drills/colregs/components/CloudDisplay';
import { BUOY_IMAGES } from '../drills/colregs/components/BuoyDisplay';
import { DISTRESS_IMAGES } from '../drills/colregs/components/DistressDisplay';
import { PFD_IMAGES } from '../drills/colregs/components/PfdDisplay';

// The anchors, the clouds and some of the buoys, distress signals and PFDs
// are photographs now, and every one of them is
// somebody else's work used under a licence - public domain, CC0, or a CC
// licence that REQUIRES attribution. src/lib/imageCredits.ts is where that
// attribution is kept, and a credits file is only worth having if it cannot
// quietly fall behind the images it describes.
//
// So this walks the image maps the two display components actually render from
// and insists each entry has a credit, rather than trusting the two lists to
// have been edited together. Adding a sixth anchor without recording where it
// came from fails here.

const KINDS = [
  ['anchor', ANCHOR_IMAGES],
  ['cloud', CLOUD_IMAGES],
  ['buoy', BUOY_IMAGES],
  ['distress', DISTRESS_IMAGES],
  ['pfd', PFD_IMAGES],
] as const;

describe('every shipped photograph is credited', () => {
  it('has a credit for every image a drill can render', () => {
    const uncredited: string[] = [];
    for (const [kind, images] of KINDS) {
      for (const name of Object.keys(images)) {
        if (!creditFor(kind, name)) uncredited.push(`${kind}:${name}`);
      }
    }
    expect(uncredited).toEqual([]);
  });

  it('credits nothing it does not ship', () => {
    const shipped = new Set(
      KINDS.flatMap(([kind, images]) => Object.keys(images).map(n => `${kind}:${n}`))
    );
    expect(Object.keys(IMAGE_CREDITS).filter(k => !shipped.has(k))).toEqual([]);
  });

  // A credit that names no licence, or a CC licence that names no author, is
  // not attribution - it is a note that attribution was skipped.
  it('names a licence for every image, and an author for every CC-BY licence', () => {
    const bad: string[] = [];
    for (const [key, c] of Object.entries(IMAGE_CREDITS)) {
      if (!c.license || !c.source || !c.subject) bad.push(`${key}: incomplete`);
      // CC0 and public-domain dedications waive the attribution requirement;
      // every other CC licence here is a BY licence and does not.
      const waived = c.license === 'CC0' || c.license === 'Public domain';
      if (!waived && (!c.author || !c.licenseUrl)) bad.push(`${key}: unattributed ${c.license}`);
    }
    expect(bad).toEqual([]);
  });
});
