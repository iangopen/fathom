import React from 'react';
import { SvgA11y, imgProps, colourName } from '../../../lib/visualA11y';

export type BoatPartName =
  // Seen from the side
  | 'bow'
  | 'stern'
  | 'transom'
  | 'keel'
  | 'gunwale'
  | 'freeboard'
  | 'draft'
  | 'rudder'
  | 'waterline'
  // Seen from above
  | 'beam'
  | 'thwart'
  | 'amidships'
  | 'port-side';

interface BoatPartDisplayProps {
  part: BoatPartName;
  label?: string;
  a11y?: SvgA11y;
}

// 220x170. One small craft, drawn twice - from the side and from above - with
// a single part picked out in brass. The player names the highlighted part, so
// NOTHING here may name it in text.
//
// The hull is drawn in the same idiom as VesselProfile: navy plate, slate
// rim, and the waterline as a dashed cyan line. It could not simply reuse that
// component's silhouette, which is a ship seen broadside with both ends alike
// - a shape with no stem and no transom cannot be asked which end is the bow.
// This one has a raised stem forward and a flat transom aft, because half the
// questions turn on telling those two apart.
//
// Two views rather than one, because the parts do not all live in the same
// projection. Beam is a width and amidships is a position along the length:
// from the side they are invisible or ambiguous, and a plan view is what a
// boat's own drawings use for exactly the same reason. PART_VIEW is what
// decides, so adding a part is one row rather than a new drawing.
//
// The measurements - freeboard and draft - are drawn as dimension arrows
// between the two things being measured, which is the one case where the
// highlight is not part of the boat but the distance between two parts of it.

const HULL_FILL = 'rgb(15,23,42)';
const HULL_STROKE = 'rgb(148,163,184)';
const DETAIL = 'rgba(148,163,184,0.55)';
const WATER = 'rgba(34,211,238,0.25)';
const MARK = 'rgba(212,169,74,0.95)';
const MARK_WASH = 'rgba(212,169,74,0.18)';

const WATERLINE_Y = 100;

// Side elevation, bow to the right.
const SHEER = 'M 188 54 C 152 62, 92 70, 40 80';
const TRANSOM = 'M 40 80 L 46 114';
const BOTTOM = 'M 46 114 C 92 128, 146 124, 174 96';
const STEM = 'M 174 96 C 184 84, 189 68, 188 54';
const PROFILE_HULL = `${SHEER} L 46 114 C 92 128, 146 124, 174 96 C 184 84, 189 68, 188 54 Z`;

// Plan, bow to the top.
const PLAN_HULL =
  'M 110 22 C 138 46, 152 76, 152 100 L 148 144 L 72 144 L 68 100 C 68 76, 82 46, 110 22 Z';

type View = 'profile' | 'plan';

const PART_VIEW: Record<BoatPartName, View> = {
  bow: 'profile',
  stern: 'profile',
  transom: 'profile',
  keel: 'profile',
  gunwale: 'profile',
  freeboard: 'profile',
  draft: 'profile',
  rudder: 'profile',
  waterline: 'profile',
  beam: 'plan',
  thwart: 'plan',
  amidships: 'plan',
  'port-side': 'plan',
};

const mark = {
  fill: 'none' as const,
  stroke: MARK,
  strokeWidth: 4,
  strokeLinecap: 'round' as const,
};

// A dimension line with a head at each end, for the two measurements.
function dimension(x1: number, y1: number, x2: number, y2: number): React.ReactNode {
  const head = (x: number, y: number, up: boolean) => (
    <polygon
      points={`${x},${y} ${x - 4},${y + (up ? 8 : -8)} ${x + 4},${y + (up ? 8 : -8)}`}
      fill={MARK}
    />
  );
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MARK} strokeWidth="2" />
      {x1 === x2 ? (
        <>
          {head(x1, y1, true)}
          {head(x2, y2, false)}
        </>
      ) : (
        <>
          <polygon points={`${x1},${y1} ${x1 + 8},${y1 - 4} ${x1 + 8},${y1 + 4}`} fill={MARK} />
          <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`} fill={MARK} />
        </>
      )}
    </g>
  );
}

// ── What is picked out, per part ─────────────────────────────────────────
//
// Each highlight is a FORM - a shaded region, an edge, a measurement, a blade,
// a line, a bar or a band - and the coordinates it is drawn at. highlight()
// paints from this table and describeBoatPart works out from the same
// coordinates where on the boat the highlight sits, so the description is the
// drawing's geometry put into words, not a second account of it.
type Highlight =
  // An area of the boat, shaded, with its outline picked out.
  | { form: 'region'; wash: string; outline: string }
  // One edge of the hull.
  | { form: 'edge'; d: string }
  // A dimension arrow between two things being measured.
  | { form: 'measure'; x1: number; y1: number; x2: number; y2: number }
  | { form: 'blade'; d: string }
  | { form: 'line'; x1: number; x2: number; y: number }
  | { form: 'bar'; x: number; y: number; w: number; h: number }
  | { form: 'band'; wash: string; x1: number; x2: number; lineY: number };

const HIGHLIGHTS: Record<BoatPartName, Highlight> = {
  // The forward end, taken as a region rather than as one line: the bow is
  // an area of the boat, not an edge of it.
  bow: {
    form: 'region',
    wash: 'M 188 54 C 168 58, 150 62, 140 65 L 150 118 C 166 110, 180 96, 188 76 Z',
    outline: 'M 150 63 C 168 59, 180 56, 188 54 C 189 68, 184 84, 174 96',
  },
  stern: {
    form: 'region',
    wash: 'M 40 80 L 80 74 L 86 122 L 46 114 Z',
    outline: 'M 80 74 C 60 77, 48 79, 40 80 L 46 114 C 60 118, 72 120, 84 121',
  },
  // The flat plate closing the after end. Distinct from the stern, which is
  // the whole after part of the boat, and the two are asked separately.
  transom: { form: 'edge', d: TRANSOM },
  keel: { form: 'edge', d: BOTTOM },
  // The upper edge of the side, running the whole length.
  gunwale: { form: 'edge', d: SHEER },
  // Gunwale down to the water.
  freeboard: { form: 'measure', x1: 104, y1: 69, x2: 104, y2: WATERLINE_Y },
  // Water down to the lowest point of the hull.
  draft: { form: 'measure', x1: 104, y1: WATERLINE_Y, x2: 104, y2: 126 },
  rudder: { form: 'blade', d: 'M 34 108 L 44 108 L 42 136 L 33 133 Z' },
  waterline: { form: 'line', x1: 10, x2: 210, y: WATERLINE_Y },
  // Widest point, measured across.
  beam: { form: 'measure', x1: 68, y1: 100, x2: 152, y2: 100 },
  // The seat athwartships.
  thwart: { form: 'bar', x: 72, y: 88, w: 76, h: 13 },
  // The middle of the boat, along her length.
  amidships: { form: 'band', wash: 'M 69 70 L 151 70 L 152 106 L 68 106 Z', x1: 68, x2: 152, lineY: 88 },
  // The left-hand side, looking forward - which is why the plan is drawn
  // bow-up: turn the page and the answer changes.
  'port-side': {
    form: 'region',
    wash: 'M 110 22 C 92 38, 68 76, 68 100 L 72 144 L 110 144 Z',
    outline: 'M 110 22 C 82 46, 68 76, 68 100 L 72 144',
  },
};

function highlight(part: BoatPartName): React.ReactNode {
  const h = HIGHLIGHTS[part];
  switch (h.form) {
    case 'region':
      return (
        <g>
          <path d={h.wash} fill={MARK_WASH} />
          <path d={h.outline} {...mark} />
        </g>
      );
    case 'edge':
      return <path d={h.d} {...mark} />;
    case 'measure':
      return dimension(h.x1, h.y1, h.x2, h.y2);
    case 'blade':
      return <path d={h.d} fill={MARK_WASH} stroke={MARK} strokeWidth="3" strokeLinejoin="round" />;
    case 'line':
      return (
        <line
          x1={h.x1} y1={h.y} x2={h.x2} y2={h.y}
          stroke={MARK} strokeWidth="3" strokeDasharray="8 5" strokeLinecap="round"
        />
      );
    case 'bar':
      return (
        <rect x={h.x} y={h.y} width={h.w} height={h.h} rx={2} fill={MARK_WASH} stroke={MARK} strokeWidth="3" />
      );
    case 'band':
      return (
        <g>
          <path d={h.wash} fill={MARK_WASH} />
          <line x1={h.x1} y1={h.lineY} x2={h.x2} y2={h.lineY} stroke={MARK} strokeWidth="3" strokeDasharray="7 5" />
        </g>
      );
  }
}

// ── The text equivalent ──────────────────────────────────────────────────
//
// Generated from HIGHLIGHTS: the form of the highlight in words, and where it
// sits worked out from its coordinates against the hull's. Every place is said
// as a reader of the picture would say it - the right-hand end, the top edge,
// down to the surface of the water - and never with a word the deck
// seamanship card asks for: no bow or stern, no fore or aft, no port, no
// gunwale or keel, not even "water line" run together.

interface Box { minX: number; maxX: number; minY: number; maxY: number }

function boxOf(...paths: string[]): Box {
  const nums = paths.flatMap((d) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number));
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

const PROFILE_BOX = boxOf(PROFILE_HULL);
const PLAN_BOX = boxOf(PLAN_HULL);
const PLAN_CENTRE_X = (PLAN_BOX.minX + PLAN_BOX.maxX) / 2;

// Which end of the side view a box sits at, by thirds of the hull's length.
function profileEnd(b: Box): string {
  const cx = (b.minX + b.maxX) / 2;
  const third = (PROFILE_BOX.maxX - PROFILE_BOX.minX) / 3;
  if (cx < PROFILE_BOX.minX + third) return 'left-hand end';
  if (cx > PROFILE_BOX.maxX - third) return 'right-hand end';
  return 'middle';
}

// What a measurement in the side view starts or ends at.
function profileLandmark(y: number): string {
  if (y === WATERLINE_Y) return 'the surface of the water';
  return y < WATERLINE_Y ? 'the top edge of the side' : 'the lowest point of the hull';
}

// How far along the plan's length, top to bottom, a y sits.
function planAlong(y: number): string {
  const f = (y - PLAN_BOX.minY) / (PLAN_BOX.maxY - PLAN_BOX.minY);
  return f < 0.35 ? 'near the pointed end' : f > 0.65 ? 'near the square end' : 'about halfway along its length';
}

function highlightWords(part: BoatPartName): string {
  const h = HIGHLIGHTS[part];
  const plan = PART_VIEW[part] === 'plan';
  switch (h.form) {
    case 'region': {
      const b = boxOf(h.wash);
      if (plan) {
        const half = b.maxX <= PLAN_CENTRE_X + 1 ? 'left-hand' : b.minX >= PLAN_CENTRE_X - 1 ? 'right-hand' : 'whole';
        return `the ${half} half of the hull is shaded, its outer edge picked out from end to end`;
      }
      return `the ${profileEnd(b)} of the hull is shaded, its outline there picked out`;
    }
    case 'edge': {
      const b = boxOf(h.d);
      if (b.maxX - b.minX < 15) return `the short, nearly upright edge that closes the ${profileEnd(b)} of the hull`;
      const hullMidY = (PROFILE_BOX.minY + PROFILE_BOX.maxY) / 2;
      return (b.minY + b.maxY) / 2 < hullMidY
        ? 'the top edge of the hull\'s side, along its whole length'
        : 'the bottom edge of the hull, along its length';
    }
    case 'measure':
      if (h.x1 === h.x2) {
        const [from, to] = h.y1 < h.y2 ? [h.y1, h.y2] : [h.y2, h.y1];
        return `a double-headed arrow running straight down from ${profileLandmark(from)} to ${profileLandmark(to)}`;
      }
      return Math.min(h.x1, h.x2) <= PLAN_BOX.minX && Math.max(h.x1, h.x2) >= PLAN_BOX.maxX
        ? 'a double-headed arrow straight across the hull from one side to the other, at its widest point'
        : 'a double-headed arrow across part of the hull';
    case 'blade': {
      const b = boxOf(h.d);
      const below = b.maxY > WATERLINE_Y ? ', reaching down below the surface of the water' : '';
      return `the small blade hanging below the ${profileEnd(b)}${below}`;
    }
    case 'line':
      return h.y === WATERLINE_Y && h.x2 - h.x1 >= 200
        ? 'the dashed line running right across the picture at the surface of the water'
        : 'a dashed line';
    case 'bar':
      return `a bar crossing the inside of the hull from one side to the other, ${planAlong(h.y + h.h / 2)}`;
    case 'band':
      return `a shaded band across the hull ${planAlong(h.lineY)}, with a dashed line across its centre`;
  }
}

// What every drawing of each view shows, before anything is picked out.
const VIEW_WORDS: Record<View, string> = {
  profile:
    'Side view of a small open boat on the water. Her right-hand end rises to a tall point; her left-hand end ' +
    'is cut off flat, with a small blade hanging below it. A dashed line marks the surface of the water.',
  plan:
    'A small open boat seen from above. The hull comes to a point at the top and is cut off square at the ' +
    'bottom, with a seat across it about halfway along and a dashed line down its centre.',
};

export function describeBoatPart(part: BoatPartName): string {
  return `${VIEW_WORDS[PART_VIEW[part]]} Picked out in ${colourName(MARK)}: ${highlightWords(part)}.`;
}

function profileView(part: BoatPartName): React.ReactNode {
  return (
    <g>
      <line
        x1={10} y1={WATERLINE_Y} x2={210} y2={WATERLINE_Y}
        stroke={WATER} strokeWidth="1" strokeDasharray="5 4"
      />
      {/* Rudder, hung aft of the transom */}
      <path
        d="M 34 108 L 44 108 L 42 136 L 33 133 Z"
        fill={HULL_FILL} stroke={HULL_STROKE} strokeWidth="1.1" strokeLinejoin="round"
      />
      <path d={PROFILE_HULL} fill={HULL_FILL} stroke={HULL_STROKE} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Sheer strake, so the top edge reads as an edge and not as an outline */}
      <path
        d="M 184 60 C 150 68, 92 76, 42 86"
        fill="none" stroke={DETAIL} strokeWidth="1"
      />
      {highlight(part)}
    </g>
  );
}

function planView(part: BoatPartName): React.ReactNode {
  return (
    <g>
      <path d={PLAN_HULL} fill={HULL_FILL} stroke={HULL_STROKE} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Inwale and centreline, so the plan reads as a hollow boat */}
      <path
        d="M 110 34 C 132 54, 144 78, 144 100 L 141 137 L 79 137 L 76 100 C 76 78, 88 54, 110 34 Z"
        fill="none" stroke={DETAIL} strokeWidth="1"
      />
      <line x1={110} y1={34} x2={110} y2={137} stroke={DETAIL} strokeWidth="0.8" strokeDasharray="4 5" />
      {/* The seat athwartships */}
      <rect x={78} y={90} width={64} height={9} rx={2} fill={HULL_FILL} stroke={HULL_STROKE} strokeWidth="1.1" />
      {highlight(part)}
    </g>
  );
}

export const BoatPartDisplay: React.FC<BoatPartDisplayProps> = ({ part, label, a11y }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg" {...imgProps(a11y)}>
        {PART_VIEW[part] === 'plan' ? planView(part) : profileView(part)}
      </svg>
    </div>
  </div>
);
