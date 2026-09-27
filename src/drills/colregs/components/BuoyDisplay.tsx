import React from 'react';

import cardinalEast from '../../../assets/buoys/cardinal-east.jpg';
import cardinalSouth from '../../../assets/buoys/cardinal-south.jpg';
import isolatedDanger from '../../../assets/buoys/isolated-danger.jpg';
import portHand from '../../../assets/buoys/port-hand.jpg';
import safeWater from '../../../assets/buoys/safe-water.jpg';
import special from '../../../assets/buoys/special.jpg';

export type BuoyName =
  // Lateral marks, IALA Region B - the system the United States buoys under
  | 'port-hand'
  | 'starboard-hand'
  // A preferred-channel (junction) mark, red band on top: read as a
  // starboard-hand mark, with the preferred channel to port of it
  | 'junction-red-top'
  // Cardinal marks - identical in both regions
  | 'cardinal-north'
  | 'cardinal-east'
  | 'cardinal-south'
  | 'cardinal-west'
  | 'isolated-danger'
  | 'safe-water'
  | 'special'
  // The ICW overlay: an ordinary lateral mark carrying a yellow triangle or
  // square, which is read independently of the mark's own colour
  | 'icw-triangle'
  | 'icw-square';

// The six marks with no photograph that passes - see the drawing section.
type DrawnBuoy =
  | 'starboard-hand'
  | 'junction-red-top'
  | 'cardinal-north'
  | 'cardinal-west'
  | 'icw-triangle'
  | 'icw-square';

interface BuoyDisplayProps {
  type: BuoyName;
  label?: string;
}

// PHOTOGRAPHS of the marks, where a clean licensed one exists - the same change
// AnchorDisplay and CloudDisplay made, for the same reason: a buoy is a real
// object the candidate will have to recognise across the water, and colour,
// banding and a topmark read truer off a photograph than off flat fills.
//
// THE LEAK RULE is sharper here than for anchors, because buoys are covered in
// text by design. The test is strict: no legible text at the size the panel
// actually draws, and "the size it draws" means device pixels - on a 2x screen
// the 216px panel shows 432 pixels of this 640px file, and that is where
// legibility is judged.
//
//   A lateral mark's NUMBER is the plainest leak. Odd is port and even is
//   starboard, so a legible "13" on a green can hands over the answer. Every
//   clean photograph of a US red nun on Commons shows its number, which is why
//   'starboard-hand' is still drawn below.
//
//   A cardinal painted with its own quadrant is another: "GOLE VAS NORD" and
//   "Norderney-N" were both rejected.
//
//   A rock's name was rejected too, once it could be read. The north and west
//   photographs that were tried carry EDAY GRUNA and CORRAN LEDGE across their
//   bodies, both readable on a 2x screen, so those two marks are drawn. So
//   were the letters DC on the one licensed junction mark found, legible even
//   at 1x, and that mark is drawn too. The east cardinal's MANACLE, painted
//   down one leg, cannot be read at any size the panel draws, and it stays.
//
// See IMAGE-CREDITS.md for every candidate and why each was turned down.
//
// Cardinals, isolated danger, safe water and special marks mean the same in
// both IALA regions, so those photographs come from British, Danish and
// Spanish waters. The lateral photograph does NOT - a Region A port mark is a
// red can, the reverse of ours - so the green can is a Region B mark, from the
// United States.
//
// No water line is added and no channel is drawn: a picture of the channel
// around the buoy would answer "which side do you leave it" for free. The light
// characteristic is not shown either; it is a rhythm over time, and the
// questions that turn on it say so in words.
//
// Each photograph is 640x480, the 4:3 the old 220x170 viewBox was close to, so
// the panel is the same size and shape it has always been. Sources and
// licences are in src/lib/imageCredits.ts.

// Typed so that every mark is either photographed here or drawn below, and the
// compiler says so when a new BuoyName is neither.
const BUOY_IMAGES: Record<Exclude<BuoyName, DrawnBuoy>, string> = {
  'port-hand': portHand,
  'cardinal-east': cardinalEast,
  'cardinal-south': cardinalSouth,
  'isolated-danger': isolatedDanger,
  'safe-water': safeWater,
  'special': special,
};

// Alt text describes the FRAME, never the mark: a screen reader must get the
// same question a sighted player gets, not the answer to it.
const ALT = 'Photograph of a navigation mark, shown for identification';

// ── The marks that are still drawn ───────────────────────────────────────
//
// Six, and each for want of a photograph that passes, not by choice: the red
// nun (every clean one shows its even number), the junction mark (the one
// found carries legible letters), the north and west cardinals (every
// candidate found carries a legible name or quadrant) and the two ICW overlays
// (no licensed photograph of a yellow triangle or square on a buoy exists on
// Commons).
//
// A mark is DESCRIBED here rather than hand-drawn: a body shape, the bands
// painted on it, a topmark, and for the ICW an overlay badge. Those four are
// exactly the four things a mark is identified by, so the table below reads as
// the answer key it is. Side elevation, 220x170, and NOTHING here may name the
// type in text.

type BuoyShape = 'can' | 'nun' | 'pillar';
type Topmark = 'cones-up' | 'cones-point';
type Badge = 'triangle' | 'square';

const RED = '#a8332c';
const GREEN = '#1e7a49';
const YELLOW = '#dcb02f';
const BLACK = '#0f172a';

const OUTLINE = 'rgb(148,163,184)';
const OUTLINE_W = 1.2;
const STAFF = 'rgba(203,213,225,0.75)';
const BADGE_EDGE = 'rgba(15,23,42,0.55)';

const CX = 110;
const BASE_Y = 142;

interface MarkSpec {
  shape: BuoyShape;
  // Horizontal bands, top to bottom. A single entry is a plain hull.
  bands: string[];
  topmark?: Topmark;
  badge?: Badge;
}

const DRAWN: Record<DrawnBuoy, MarkSpec> = {
  // The Region B starboard mark: a red nun, and no topmark in the ordinary
  // case - drawing one would teach the commonest thing candidates get wrong.
  'starboard-hand': { shape: 'nun', bands: [RED] },

  // A preferred-channel mark is a lateral mark with a band of the other colour
  // round its middle. Red on top, and a nun, because the top band is the one
  // that says how to pass it.
  'junction-red-top': { shape: 'nun', bands: [RED, GREEN, RED] },

  // Cardinals: the cones point the way the black band runs. North is black
  // over yellow with both cones up; west is yellow, black, yellow with the
  // cones meeting point to point.
  'cardinal-north': { shape: 'pillar', bands: [BLACK, YELLOW], topmark: 'cones-up' },
  'cardinal-west': { shape: 'pillar', bands: [YELLOW, BLACK, YELLOW], topmark: 'cones-point' },

  // The overlay sits on an ordinary lateral mark. Which lateral it is drawn on
  // is chosen so the ICW questions cannot be answered off the base colour: the
  // triangle here is on a red mark and the square on a green one, the pairing
  // seen where the ICW runs with the local lateral system rather than against
  // it. The triangle still means starboard and the square port whatever the
  // hull under it is painted.
  'icw-triangle': { shape: 'nun', bands: [RED], badge: 'triangle' },
  'icw-square': { shape: 'can', bands: [GREEN], badge: 'square' },
};

// Where the body's crown sits, per shape: the topmark and its staff hang off
// this, so a pillar's topmark stands higher than a can's without a table of
// its own.
const TOP_Y: Record<BuoyShape, number> = {
  can: 78,
  nun: 84,
  pillar: 60,
};

function bodyPath(shape: BuoyShape): string {
  switch (shape) {
    case 'can':
      return `M 80 ${BASE_Y} L 140 ${BASE_Y} L 140 78 L 80 78 Z`;
    case 'nun':
      return `M 82 ${BASE_Y} L 138 ${BASE_Y} L 126 84 L 94 84 Z`;
    // A squat base with a column standing on it. Bands run across the whole
    // structure, which is how a cardinal is actually painted.
    case 'pillar':
      return `M 84 ${BASE_Y} L 136 ${BASE_Y} L 136 104 L 121 104 L 121 60 L 99 60 L 99 104 L 84 104 Z`;
  }
}

function cone(baseY: number, pointing: 'up' | 'down'): React.ReactNode {
  const h = 17;
  const w = 12;
  const pts =
    pointing === 'up'
      ? `${CX - w},${baseY} ${CX + w},${baseY} ${CX},${baseY - h}`
      : `${CX - w},${baseY - h} ${CX + w},${baseY - h} ${CX},${baseY}`;
  return (
    <polygon points={pts} fill={BLACK} stroke={OUTLINE} strokeWidth="1" strokeLinejoin="round" />
  );
}

// Topmarks are drawn upward from `top`, the crown of the body, with a short
// staff between. The two-cone marks are the whole of the cardinal system: the
// bands only confirm what the cones have already said.
function topmarkGroup(mark: Topmark, top: number): React.ReactNode {
  const staffTop = top - 8;
  const lower = staffTop; // base line of the lower element
  const upper = staffTop - 19; // base line of the upper element

  const content =
    mark === 'cones-up' ? (
      <>
        {cone(lower, 'up')}
        {cone(upper, 'up')}
      </>
    ) : (
      // Point to point: the apexes meet in the middle.
      <>
        {cone(lower, 'up')}
        {cone(upper, 'down')}
      </>
    );

  return (
    <g>
      <line
        x1={CX}
        y1={top}
        x2={CX}
        y2={staffTop}
        stroke={STAFF}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {content}
    </g>
  );
}

// The ICW overlay, painted on the body face. It is deliberately drawn as
// something stuck on rather than blended into the paintwork: on the water it
// is read as a separate instruction from the mark's own colour, and the
// picture should say so.
function badgeGroup(badge: Badge, shape: BuoyShape): React.ReactNode {
  const cy = shape === 'nun' ? 116 : 110;
  if (badge === 'square') {
    return (
      <rect
        x={CX - 13}
        y={cy - 13}
        width={26}
        height={26}
        fill={YELLOW}
        stroke={BADGE_EDGE}
        strokeWidth="1.2"
      />
    );
  }
  return (
    <polygon
      points={`${CX},${cy - 15} ${CX + 15},${cy + 12} ${CX - 15},${cy + 12}`}
      fill={YELLOW}
      stroke={BADGE_EDGE}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}

function drawnBuoy(type: DrawnBuoy): React.ReactNode {
  const spec = DRAWN[type];
  const d = bodyPath(spec.shape);
  const clipId = `buoy-clip-${type}`;
  const top = TOP_Y[spec.shape];

  // Bands are painted through a clip of the body outline, so a three-band
  // cardinal needs no per-shape geometry of its own.
  const h = (BASE_Y - top) / spec.bands.length;
  const paint = spec.bands.map((colour, i) => (
    <rect key={`b${i}`} x={70} y={top + i * h} width={80} height={h + 0.5} fill={colour} />
  ));

  return (
    <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{paint}</g>
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
      {spec.badge && badgeGroup(spec.badge, spec.shape)}
      {spec.topmark && topmarkGroup(spec.topmark, top)}
    </svg>
  );
}

function isDrawn(type: BuoyName): type is DrawnBuoy {
  return type in DRAWN;
}

export const BuoyDisplay: React.FC<BuoyDisplayProps> = ({ type, label }) => {
  return (
    <div className="flex flex-col items-center gap-3 select-none w-full">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
      )}

      <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
        {isDrawn(type) ? (
          drawnBuoy(type)
        ) : (
          <img
            src={BUOY_IMAGES[type]}
            alt={ALT}
            width={640}
            height={480}
            draggable={false}
            className="w-full h-auto rounded-lg"
            style={{ display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }}
          />
        )}
      </div>
    </div>
  );
};

export { BUOY_IMAGES };
