// Source and licence for every photograph shipped in src/assets.
//
// This file is the authoritative record, not a courtesy: every image here is
// either public domain or Creative Commons, and all of the CC licences below
// require attribution. IMAGE-CREDITS.md at the repo root is the same table
// written for a human to read; `src/__tests__/imageCredits.test.ts` pins that
// every image a drill can render has an entry here, so an image added without
// a credit fails the suite rather than shipping unattributed.
//
// Nothing surfaces these in the UI yet. When something does - an About section,
// a long-press on the panel - it reads this map; the strings are written to be
// displayed as they stand.
//
// Keys are `<kind>:<name>`, where `<name>` is the AnchorTypeName / CloudName
// the display components switch on.

export interface ImageCredit {
  /** What the photograph shows, in the app's own vocabulary. */
  subject: string;
  /** Title of the file on its host, without the "File:" namespace. */
  title: string;
  /** The file's description page - where the licence claim actually lives. */
  source: string;
  /** Author as the source names them, or '' where the source names none. */
  author: string;
  /** Licence short name, e.g. 'CC BY-SA 4.0', 'CC0', 'Public domain'. */
  license: string;
  /** Deed URL, or '' for public domain files that carry no deed. */
  licenseUrl: string;
}

const COMMONS = 'https://commons.wikimedia.org/wiki/File:';

export const IMAGE_CREDITS: Record<string, ImageCredit> = {
  'anchor:fluke': {
    subject: 'Fluke (Danforth pattern) anchor',
    title: 'Anchor.jpg',
    source: COMMONS + 'Anchor.jpg',
    author: 'Eric Schmuttenmaer',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'anchor:plow': {
    subject: 'Plow (CQR pattern) anchor',
    title: 'Genuine CQR.jpg',
    source: COMMONS + 'Genuine_CQR.jpg',
    author: '',
    license: 'Public domain',
    licenseUrl: '',
  },
  'anchor:claw': {
    subject: 'Claw (Bruce pattern) anchor',
    title: 'Bruce anchor in Gdansk.jpg',
    source: COMMONS + 'Bruce_anchor_in_Gdansk.jpg',
    author: 'LukaszKatlewa',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'anchor:grapnel': {
    subject: 'Grapnel anchor',
    title: 'Hel MOW kotwica 03.jpg',
    source: COMMONS + 'Hel_MOW_kotwica_03.jpg',
    author: 'Zala',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'anchor:mushroom': {
    subject: 'Mushroom anchor',
    title: 'Een paddenstoelanker (01).JPG',
    source: COMMONS + 'Een_paddenstoelanker_(01).JPG',
    author: 'S.J. de Waard',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },

  'cloud:cirrus': {
    subject: 'Cirrus - mare’s tails',
    title: 'CirrusField-color.jpg',
    source: COMMONS + 'CirrusField-color.jpg',
    author: 'PiccoloNamek',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'cloud:mackerel': {
    subject: 'Cirrocumulus - a mackerel sky',
    title:
      '2021-11-27 15 52 16 Cirrocumulus "Mackeral sky" above the Franklin Farm ' +
      'section of Oak Hill, Fairfax County, Virginia.jpg',
    source:
      COMMONS +
      '2021-11-27_15_52_16_Cirrocumulus_%22Mackeral_sky%22_above_the_Franklin_' +
      'Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg',
    author: 'Famartin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'cloud:halo': {
    subject: 'A 22-degree halo around the sun, through cirrostratus',
    title: 'Cirrostratus fibratus with 22 degrees halo.jpg',
    source: COMMONS + 'Cirrostratus_fibratus_with_22_degrees_halo.jpg',
    author: 'Eduardo Marquetti',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'cloud:cumulus': {
    subject: 'Fair-weather cumulus over the sea',
    title: 'Sea sky and clouds, Ibiza, Spain.jpg',
    source: COMMONS + 'Sea_sky_and_clouds,_Ibiza,_Spain.jpg',
    author: 'Joselodos',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'cloud:cumulonimbus': {
    subject: 'Cumulonimbus incus - a thunderhead with its anvil',
    title: '20200607 Chmura cumulonimbus incus nad Krakowem 1407 0252.jpg',
    source:
      COMMONS +
      '20200607_Chmura_cumulonimbus_incus_nad_Krakowem_1407_0252.jpg',
    author: 'Jakub Hałun',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
};

/** The credit for one rendered image, or undefined if it has none. */
export function creditFor(kind: 'anchor' | 'cloud', name: string): ImageCredit | undefined {
  return IMAGE_CREDITS[`${kind}:${name}`];
}
