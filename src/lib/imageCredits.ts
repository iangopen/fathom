// Source and licence for every photograph shipped in src/assets.
//
// This file is the authoritative record, not a courtesy: every image here is
// either public domain or Creative Commons, and all of the CC licences below
// require attribution. IMAGE-CREDITS.md at the repo root is the same table
// written for a human to read; `src/__tests__/imageCredits.test.ts` pins that
// every image a drill can render has an entry here, so an image added without
// a credit fails the suite rather than shipping unattributed.
//
// Two places render these: the credit line under each photograph in
// VisualPanel, and the Credits list on the About screen. Under a question the
// line shows author, licence and a "Source" link and nothing else - `title`
// and `subject` name the answer, so they appear only on the About screen.
//
// Keys are `<kind>:<name>`, where `<name>` is the AnchorTypeName / CloudName /
// BuoyName / DistressSignalName / PfdFormName the display components switch on.

export interface ImageCredit {
  /** What the photograph shows, in the app's own vocabulary. */
  subject: string;
  /** Title of the file on its host, without the "File:" namespace. */
  title: string;
  /** The file's description page - where the licence claim actually lives. */
  source: string;
  /**
   * The file page's numeric Commons id. `source` spells out the filename, and
   * a filename like "Bruce anchor in Gdansk.jpg" is the answer - so a link
   * under an unanswered question goes to `?curid=<pageId>` instead, which
   * reaches the same page without naming anything. See `neutralSourceUrl`.
   */
  pageId: number;
  /** Author as the source names them. Shown under unanswered questions. */
  author: string;
  /** Licence short name, e.g. 'CC BY-SA 4.0', 'CC0', 'Public domain'. */
  license: string;
  /** Deed URL; for public domain, the Commons licence tag the file carries. */
  licenseUrl: string;
}

const COMMONS = 'https://commons.wikimedia.org/wiki/File:';

// Public-domain files carry no Creative Commons deed, so their licence link is
// the Commons licence tag on the file page - the statement of WHY the file is
// public domain (PD-self for the uploader's own release, PD-USGov-Military-Air
// Force for US Air Force photographs).
const PD_SELF = 'https://commons.wikimedia.org/wiki/Template:PD-self';
const PD_USAF = 'https://commons.wikimedia.org/wiki/Template:PD-USGov-Military-Air_Force';

export const IMAGE_CREDITS: Record<string, ImageCredit> = {
  'anchor:fluke': {
    subject: 'Fluke (Danforth pattern) anchor',
    title: 'Anchor.jpg',
    source: COMMONS + 'Anchor.jpg',
    pageId: 4142068,
    author: 'Eric Schmuttenmaer',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'anchor:plow': {
    subject: 'Plow (CQR pattern) anchor',
    title: 'Genuine CQR.jpg',
    source: COMMONS + 'Genuine_CQR.jpg',
    pageId: 1919068,
    // Commons has no machine-readable author: the uploader released it under
    // PD-self, and the file's original description reads "Author: C Smith".
    author: 'C Smith / Badmonkey',
    license: 'Public domain',
    licenseUrl: PD_SELF,
  },
  'anchor:claw': {
    subject: 'Claw (Bruce pattern) anchor',
    title: 'Bruce anchor in Gdansk.jpg',
    source: COMMONS + 'Bruce_anchor_in_Gdansk.jpg',
    pageId: 31366965,
    author: 'LukaszKatlewa',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'anchor:grapnel': {
    subject: 'Grapnel anchor',
    title: 'Hel MOW kotwica 03.jpg',
    source: COMMONS + 'Hel_MOW_kotwica_03.jpg',
    pageId: 144251598,
    author: 'Zala',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'anchor:mushroom': {
    subject: 'Mushroom anchor',
    title: 'Een paddenstoelanker (01).JPG',
    source: COMMONS + 'Een_paddenstoelanker_(01).JPG',
    pageId: 48815028,
    author: 'S.J. de Waard',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },

  'cloud:cirrus': {
    subject: 'Cirrus - mare’s tails',
    title: 'CirrusField-color.jpg',
    source: COMMONS + 'CirrusField-color.jpg',
    pageId: 1142092,
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
    pageId: 112871411,
    author: 'Famartin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'cloud:halo': {
    subject: 'A 22-degree halo around the sun, through cirrostratus',
    title: 'Cirrostratus fibratus with 22 degrees halo.jpg',
    source: COMMONS + 'Cirrostratus_fibratus_with_22_degrees_halo.jpg',
    pageId: 16491209,
    author: 'Eduardo Marquetti',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'cloud:cumulus': {
    subject: 'Fair-weather cumulus over the sea',
    title: 'Sea sky and clouds, Ibiza, Spain.jpg',
    source: COMMONS + 'Sea_sky_and_clouds,_Ibiza,_Spain.jpg',
    pageId: 166380148,
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
    pageId: 91053722,
    author: 'Jakub Hałun',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },

  'buoy:port-hand': {
    subject: 'Green can buoy, Genesee River, Rochester, New York',
    title: 'Green buoy Genesee River (3795382796).jpg',
    source: COMMONS + 'Green_buoy_Genesee_River_(3795382796).jpg',
    pageId: 52372641,
    author: 'Carl Mueller',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'buoy:cardinal-south': {
    subject: 'South cardinal buoy off St Mawes, Cornwall',
    title: 'South cardinal buoy off St Mawes (4950686323).jpg',
    source: COMMONS + 'South_cardinal_buoy_off_St_Mawes_(4950686323).jpg',
    pageId: 52191427,
    author: 'Tim Green from Bradford',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'buoy:cardinal-east': {
    subject: 'East cardinal buoy on the Manacles, Falmouth',
    title: 'Cardinale Est "Manacle" (Falmouth, GB).jpg',
    source: COMMONS + 'Cardinale_Est_%22Manacle%22_(Falmouth,_GB).jpg',
    pageId: 2081711,
    author: 'Alvaro',
    license: 'CC BY 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.5/',
  },
  'buoy:isolated-danger': {
    subject: 'Isolated danger buoy off Valencia',
    title: '2020-08-17 Boia enfront de la costa de València i Port Sapatja.jpg',
    source:
      COMMONS + '2020-08-17_Boia_enfront_de_la_costa_de_Val%C3%A8ncia_i_Port_Sapatja.jpg',
    pageId: 95369727,
    author: 'Pacopac',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'buoy:safe-water': {
    subject: 'Safe water buoy in the Limfjord, Denmark',
    title: 'Limfjord safe water mark.jpg',
    source: COMMONS + 'Limfjord_safe_water_mark.jpg',
    pageId: 15833681,
    author: 'Paul Fox',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'buoy:special': {
    subject: 'Special mark buoy off Seahill, Belfast Lough',
    title: 'Buoy off Seahill - geograph.org.uk - 920114.jpg',
    source: COMMONS + 'Buoy_off_Seahill_-_geograph.org.uk_-_920114.jpg',
    pageId: 13612752,
    author: 'Ross',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },

  'distress:hand-flare': {
    subject: 'A red hand flare held up at night',
    title: 'Signal flare during a rescue training mission.jpg',
    source: COMMONS + 'Signal_flare_during_a_rescue_training_mission.jpg',
    pageId: 137823214,
    author: 'U.S. Air Force photo by Staff Sgt. Bennie J. Davis III',
    license: 'Public domain',
    licenseUrl: PD_USAF,
  },
  'distress:orange-smoke': {
    subject: 'A floating orange smoke signal',
    title: 'Smoke buoy.jpg',
    source: COMMONS + 'Smoke_buoy.jpg',
    pageId: 2851850,
    author: 'heb@Wikimedia Commons',
    license: 'CC BY-SA 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
  },
  'distress:dye-marker': {
    subject: 'A sea dye marker spreading in the water',
    title: 'Sea dye marker.JPG',
    source: COMMONS + 'Sea_dye_marker.JPG',
    pageId: 25922476,
    author: 'U.S. Air Force photo by Airman 1st Class Alexxis Pons Abascal',
    license: 'Public domain',
    licenseUrl: PD_USAF,
  },

  'pfd:flotation-aid': {
    subject: 'A zip-front flotation vest',
    title: 'Red life jacket.jpg',
    source: COMMONS + 'Red_life_jacket.jpg',
    pageId: 49739136,
    author: 'Santeri Viinamäki',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'pfd:ring-buoy': {
    subject: 'A ring buoy with grab lines, floating',
    title: 'Lifebelt in Water 1.jpg',
    source: COMMONS + 'Lifebelt_in_Water_1.jpg',
    pageId: 69388351,
    author: 'Das Robert',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
};

export type PhotoKind = 'anchor' | 'cloud' | 'buoy' | 'distress' | 'pfd';

/**
 * The file page, addressed by id rather than by name. Commons resolves
 * `?curid=` to the same description page `source` names, so the licence and
 * author are one click away, but neither the link text nor the href - which a
 * browser shows on hover - spells out a filename that names the answer.
 */
export function neutralSourceUrl(credit: ImageCredit): string {
  return `https://commons.wikimedia.org/w/index.php?curid=${credit.pageId}`;
}

/** The credit for one rendered image, or undefined if it has none. */
export function creditFor(kind: PhotoKind, name: string): ImageCredit | undefined {
  return IMAGE_CREDITS[`${kind}:${name}`];
}
