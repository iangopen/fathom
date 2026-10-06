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

  // A credit that names no licence, or no author, is not attribution - it is a
  // note that attribution was skipped. Every photo is credited on-site now, so
  // there is no waiver for CC0 or public domain either: the credit line under
  // the panel shows author and licence for all of them, and links both.
  it('has an author, licence, licence URL, source URL and page id for every image', () => {
    const bad: string[] = [];
    for (const [key, c] of Object.entries(IMAGE_CREDITS)) {
      for (const field of ['subject', 'title', 'author', 'license'] as const) {
        if (!c[field].trim()) bad.push(`${key}: no ${field}`);
      }
      for (const field of ['source', 'licenseUrl'] as const) {
        if (!/^https:\/\/\S+$/.test(c[field])) bad.push(`${key}: ${field} is not an https URL`);
      }
      if (!Number.isInteger(c.pageId) || c.pageId <= 0) bad.push(`${key}: no Commons page id`);
    }
    expect(bad).toEqual([]);
  });

  // The licence name and its URL are typed separately, so they can drift: a
  // "CC BY-SA 4.0" pointing at the 3.0 deed is a wrong licence statement.
  it('links each Creative Commons licence to its own deed', () => {
    const bad: string[] = [];
    for (const [key, c] of Object.entries(IMAGE_CREDITS)) {
      const cc = c.license.match(/^CC (BY(?:-SA)?) (\d\.\d)$/);
      if (cc) {
        const deed = `https://creativecommons.org/licenses/${cc[1].toLowerCase()}/${cc[2]}/`;
        if (c.licenseUrl !== deed) bad.push(`${key}: ${c.license} -> ${c.licenseUrl}`);
      } else if (c.license === 'CC0') {
        if (c.licenseUrl !== 'https://creativecommons.org/publicdomain/zero/1.0/') bad.push(`${key}: CC0 deed`);
      } else if (c.license === 'Public domain') {
        if (!c.licenseUrl.startsWith('https://commons.wikimedia.org/wiki/Template:PD-')) {
          bad.push(`${key}: public domain without its Commons licence tag`);
        }
      } else {
        bad.push(`${key}: unrecognised licence "${c.license}"`);
      }
    }
    expect(bad).toEqual([]);
  });
});
