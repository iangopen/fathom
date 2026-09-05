import React from 'react';

export type AnchorTypeName =
  | 'fluke'     // Danforth pattern
  | 'plow'      // CQR / Delta pattern
  | 'claw'      // Bruce pattern
  | 'grapnel'
  | 'mushroom';

interface AnchorDisplayProps {
  type: AnchorTypeName;
  label?: string;
}

// Side elevation, 220×170, drawn to the same rules as VesselProfile: the
// player is asked to name the anchor from its shape, so NOTHING here may name
// the type in text, and no bottom is drawn under it. A seabed texture would
// answer the bottom-matching questions for free - sand under the fluke anchor
// is the answer to an-06 written into the picture.
//
// Each silhouette is built to the proportions the real anchor has, taken off
// maker drawings rather than invented to make five shapes look different. The
// numbers that matter are ratios against the shank, because that is what the
// eye actually compares:
//
//   fluke     Danforth pattern. Two LONG tapering plates - about as long as
//             half the shank - opening ~30 deg either side of it, and a stock
//             through the crown that is wider than the fluke span. The earlier
//             drawing had short stubby plates and a stock narrower than the
//             tips, which is why it read as a generic grappling shape.
//   plow      CQR / Delta, and the ONLY one of the five drawn in a true side
//             elevation rather than square on. It has to be. Square on, a plow
//             is a symmetric scoop and a Bruce is a symmetric scoop, and the
//             80x47 "wider than it is long" share this used to draw put it in
//             the claw's visual family - which is fatal, because the claw is
//             this question's own distractor and the plow is the claw's. From
//             the side the three identifying features are all available and
//             none of them is available square on: ONE SHARP POINT at the
//             leading end, a WEDGE share thick at the heel and tapering to it,
//             and a shank meeting the crown AT AN ANGLE instead of standing on
//             the share's axis. an-02's prompt - "a single plowshare on the end
//             of its shank, two wings rising to either side of one point" - is
//             a description of that silhouette, so the drawing is built to the
//             prompt. The ridge is what the two wings rise from, and the short
//             stroke above it is the far wing's edge showing over the near one.
//   claw      Bruce pattern. One casting, and the thing that identifies it is
//             that it is a broad hollow SCOOP - a wide crown with three lobes
//             off it, wider than tall. Three separate round strokes read as a
//             bird's foot, which is what it was doing. The outer two tines end
//             in POINTS and the crown is a flat shoulder rather than a dome:
//             rounded terminals under a domed crown made a scallop shell that
//             echoed the mushroom, and mushroom is a distractor on an-03.
//   grapnel   Long bare shaft, four tines curving out and back UP to finish
//             near mid-shaft, each ending in its own small fluke. The fore-and
//             -aft pair are foreshortened, so they are drawn shorter, thinner
//             and with smaller flukes - not omitted.
//   mushroom  An inverted bowl about twice as wide as it is deep, with a thick
//             rim, and a boss where the shank enters the crown of the dome.
//
// The shackle ring is common to all five and drawn in brass so the eye finds
// the top of the shank first; everything below it is navy plate with a slate
// rim, matching the day shapes and the vessel profiles.

const PLATE_FILL = 'rgb(15,23,42)';
const PLATE_STROKE = 'rgb(148,163,184)';
const PLATE_STROKE_W = 1.2;
const SHANK_STROKE = 'rgba(203,213,225,0.75)';
const RING_STROKE = 'rgba(212,169,74,0.85)';
const DETAIL_STROKE = 'rgba(148,163,184,0.55)';

const CX = 110;
const RING_CY = 34;
const RING_R = 7;

const plate = {
  fill: PLATE_FILL,
  stroke: PLATE_STROKE,
  strokeWidth: PLATE_STROKE_W,
  strokeLinejoin: 'round' as const,
};

// ── The grapnel's tines ──────────────────────────────────────────────────
//
// Each tine is a curve off the crown, and each carries a small fluke at its
// tip. Both the curve and the fluke are generated from the same row below, so
// the fluke sits ON the end of the tine and points the way the tine is running
// when it gets there. They used to be polygons at hardcoded coordinates, which
// left them lying across their tines like arrowheads stuck on afterwards.
//
// The fore-and-aft pair are foreshortened - they run into the page rather than
// across it - so they are drawn shorter, thinner and with smaller flukes. Not
// omitted: a grapnel has four.

interface Tine {
  c1: [number, number];
  c2: [number, number];
  tip: [number, number];
}

const GRAPNEL_CROWN: [number, number] = [110, 147];

const GRAPNEL_OUTER: Tine[] = [
  { c1: [93, 146], c2: [71, 133], tip: [63, 96] },
  { c1: [127, 146], c2: [149, 133], tip: [157, 96] },
];

const GRAPNEL_INNER: Tine[] = [
  { c1: [100, 143], c2: [89, 133], tip: [85, 110] },
  { c1: [120, 143], c2: [131, 133], tip: [135, 110] },
];

function tinePath(t: Tine): string {
  return (
    `M ${GRAPNEL_CROWN[0]} ${GRAPNEL_CROWN[1]} ` +
    `C ${t.c1[0]} ${t.c1[1]}, ${t.c2[0]} ${t.c2[1]}, ${t.tip[0]} ${t.tip[1]}`
  );
}

// The direction a cubic is travelling at its end is the vector from its last
// control point to the endpoint, which is all the orientation a triangle on
// the tip needs. The base is set back slightly along that direction so the
// fluke overlaps the tine rather than balancing on it.
function tineFluke(t: Tine, len: number, halfW: number): string {
  const [tx, ty] = t.tip;
  const dx = tx - t.c2[0];
  const dy = ty - t.c2[1];
  const m = Math.hypot(dx, dy);
  const ux = dx / m;
  const uy = dy / m;
  const px = -uy;
  const py = ux;

  const apex = [tx + ux * len, ty + uy * len];
  const back = [tx - ux * len * 0.25, ty - uy * len * 0.25];
  const left = [back[0] + px * halfW, back[1] + py * halfW];
  const right = [back[0] - px * halfW, back[1] - py * halfW];

  return `${apex[0]},${apex[1]} ${left[0]},${left[1]} ${right[0]},${right[1]}`;
}

// Shank length differs by type: a claw is stubby, a grapnel is a long bare
// shaft. Each profile draws its own, so this only fixes where it starts.
function shank(toY: number, width = 2.6) {
  return (
    <line
      x1={CX}
      y1={RING_CY + RING_R}
      x2={CX}
      y2={toY}
      stroke={SHANK_STROKE}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function anchorBody(type: AnchorTypeName): React.ReactNode {
  switch (type) {
    // Danforth. Long slender shank down to a crown low in the frame, the stock
    // laid through that crown, and two long tapering plates opening from it.
    // The plates run from y=106 to y=154 against a shank of 78, so they read
    // as roughly half the shank - the real ratio - instead of as stubs.
    case 'fluke':
      return (
        <g>
          {shank(116, 2.4)}
          {/* Stock, through the crown and wider than the fluke span. Drawn
              first so the plates and the crown sit over it. */}
          <line
            x1={46} y1={112} x2={174} y2={112}
            stroke={DETAIL_STROKE} strokeWidth="2.4" strokeLinecap="round"
          />
          <circle cx={46} cy={112} r={3} fill={PLATE_FILL} stroke={DETAIL_STROKE} strokeWidth="1" />
          <circle cx={174} cy={112} r={3} fill={PLATE_FILL} stroke={DETAIL_STROKE} strokeWidth="1" />
          {/* The two plates: wide where they meet the crown, tapering to a
              point at the tip, opening about 30 deg either side of the shank. */}
          <path d="M 105 105 L 112 124 L 64 155 L 55 145 Z" {...plate} />
          <path d="M 115 105 L 108 124 L 156 155 L 165 145 Z" {...plate} />
          <circle cx={CX} cy={114} r={5.5} fill={PLATE_FILL} stroke={PLATE_STROKE} strokeWidth="1.2" />
        </g>
      );

    // CQR / Delta in side elevation. The share is a wedge, 30 thick at the heel
    // and tapering across roughly 100 of length to a single point at the far
    // end, and the shank comes down to the heel off the axis - so the whole
    // figure leans, which is the first thing that separates it from every other
    // anchor in this set at a glance.
    case 'plow':
      return (
        <g>
          {/* Shank, angled: it lands on the crown at the heel, not on the
              share's centreline. Drawn here rather than through shank() because
              this is the one anchor whose shank is not vertical. */}
          <line
            x1={CX} y1={RING_CY + RING_R} x2={82} y2={106}
            stroke={SHANK_STROKE} strokeWidth="2.6" strokeLinecap="round"
          />
          <path
            d="M 66 94
               C 100 94, 142 114, 172 152
               C 138 148, 100 140, 66 128
               Z"
            {...plate}
          />
          {/* The ridge the two wings rise from, running the length of the share
              from the crown down to the point. Set below the middle of the
              blade, so the near wing above it reads as the broader face. */}
          <path
            d="M 70 116 C 104 122, 142 136, 170 151"
            fill="none" stroke={DETAIL_STROKE} strokeWidth="1" strokeLinecap="round"
          />
          {/* The far wing's upper edge, showing over the near one - which is
              what "two wings" looks like from the side. */}
          <path
            d="M 70 100 C 98 103, 124 113, 146 128"
            fill="none" stroke={DETAIL_STROKE} strokeWidth="0.9" strokeLinecap="round"
          />
          {/* Hinge collar - the CQR pivots here, the Delta does not. Drawn as
              a fitting, small enough not to answer an-10 by itself. */}
          <circle cx={82} cy={106} r={4.5} fill={PLATE_FILL} stroke={DETAIL_STROKE} strokeWidth="1.2" />
        </g>
      );

    // Bruce. A single casting read as one broad hollow scoop, 122 wide by 58
    // deep, on a short shank: a flat shoulder with two outer tines running down
    // to POINTS and a centre lobe dropping between them. Outlined as one plate
    // because it IS one piece of steel - three separate strokes made a claw out
    // of sticks. The shoulder is deliberately flat and the tips deliberately
    // sharp: with a domed crown and rounded terminals this read as a scallop
    // shell, and the arc of it echoed the mushroom's bowl.
    case 'claw':
      return (
        <g>
          {shank(103)}
          <path
            d="M 110 101
               C 140 102, 161 115, 171 141
               L 166 153
               C 153 147, 143 141, 137 131
               C 133 149, 123 159, 110 159
               C 97 159, 87 149, 83 131
               C 77 141, 67 147, 54 153
               L 49 141
               C 59 115, 80 102, 110 101 Z"
            {...plate}
          />
          {/* The hollow of the scoop, so the casting reads as concave rather
              than as a flat plate cut to shape. */}
          <path
            d="M 94 120 C 100 132, 103 145, 102 155"
            fill="none" stroke={DETAIL_STROKE} strokeWidth="1.1" strokeLinecap="round"
          />
          <path
            d="M 126 120 C 120 132, 117 145, 118 155"
            fill="none" stroke={DETAIL_STROKE} strokeWidth="1.1" strokeLinecap="round"
          />
          {/* Crown boss where the shank lands */}
          <circle cx={CX} cy={104} r={6.5} fill={PLATE_FILL} stroke={PLATE_STROKE} strokeWidth="1.3" />
        </g>
      );

    // Long bare shaft with four tines off the crown, curving out and back up to
    // finish around mid-shaft. Tines and flukes both come off the tables above,
    // so a fluke cannot drift off the end of the tine it belongs to.
    case 'grapnel':
      return (
        <g>
          {shank(148, 2.2)}
          {/* Outer pair, in the plane of the drawing */}
          <g fill="none" stroke={PLATE_STROKE} strokeWidth="3.4" strokeLinecap="round">
            {GRAPNEL_OUTER.map((t) => (
              <path key={t.tip[0]} d={tinePath(t)} />
            ))}
          </g>
          {/* Inner pair, fore and aft of the shaft */}
          <g fill="none" stroke={DETAIL_STROKE} strokeWidth="2.6" strokeLinecap="round">
            {GRAPNEL_INNER.map((t) => (
              <path key={t.tip[0]} d={tinePath(t)} />
            ))}
          </g>
          {/* Tip flukes: the outer pair full size, the inner pair reduced */}
          {GRAPNEL_OUTER.map((t) => (
            <polygon key={t.tip[0]} points={tineFluke(t, 16, 9)} {...plate} strokeWidth={1} />
          ))}
          {GRAPNEL_INNER.map((t) => (
            <polygon key={t.tip[0]} points={tineFluke(t, 12, 7)} {...plate} strokeWidth={0.9} />
          ))}
          <circle cx={CX} cy={148} r={5} fill={PLATE_FILL} stroke={PLATE_STROKE} strokeWidth="1.2" />
        </g>
      );

    // An inverted bowl, 108 across by 52 deep - about twice as wide as it is
    // deep, which is the proportion these are cast in - with a thick rim and a
    // boss where the shank enters the crown. Nothing on it bites: it holds by
    // weight and by silting in.
    case 'mushroom':
      return (
        <g>
          {shank(96)}
          <path
            d="M 56 136 C 56 88, 164 88, 164 136 C 164 148, 56 148, 56 136 Z"
            {...plate}
          />
          {/* Far rim, arcing up inside the near one, so the cap reads as a
              hollow bowl rather than as a solid dome. */}
          <path
            d="M 57 133 C 80 122, 140 122, 163 133"
            fill="none" stroke={DETAIL_STROKE} strokeWidth="1.2"
          />
          {/* Boss at the crown, where the shank enters */}
          <ellipse
            cx={CX} cy={97} rx={9} ry={4}
            fill={PLATE_FILL} stroke={DETAIL_STROKE} strokeWidth="1.1"
          />
        </g>
      );
  }
}

export const AnchorDisplay: React.FC<AnchorDisplayProps> = ({ type, label }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Shackle ring, common to all five */}
        <circle
          cx={CX}
          cy={RING_CY}
          r={RING_R}
          fill="none"
          stroke={RING_STROKE}
          strokeWidth="2.2"
        />

        {anchorBody(type)}
      </svg>
    </div>
  </div>
);
