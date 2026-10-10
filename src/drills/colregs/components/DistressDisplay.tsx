import React from 'react';
import { SvgA11y, imgProps, colourName, countWord, joinList, capitalise } from '../../../lib/visualA11y';

import dyeMarker from '../../../assets/distress/dye-marker.jpg';
import handFlare from '../../../assets/distress/hand-flare.jpg';
import orangeSmoke from '../../../assets/distress/orange-smoke.jpg';

export type DistressSignalName =
  | 'parachute-flare'
  | 'hand-flare'
  | 'orange-smoke'
  | 'star-rocket'
  | 'flag-nc'
  | 'flag-and-ball'
  | 'arms'
  | 'flames'
  // Not on the Annex IV list itself - one of the two signals the annex draws
  // attention to for being found from the air. Photographed only.
  | 'dye-marker';

// The three signals shown as PHOTOGRAPHS. Everything else is still drawn below,
// for want of a licensed photograph that passes, not by choice.
type PhotoSignal = 'hand-flare' | 'orange-smoke' | 'dye-marker';
type DrawnSignal = Exclude<DistressSignalName, PhotoSignal>;

interface DistressDisplayProps {
  signal: DistressSignalName;
  label?: string;
  // Applied to a drawn signal only; a photograph has its own alt text.
  a11y?: SvgA11y;
}

// PHOTOGRAPHS where a licensed one passes, and side-elevation drawings, 220x170,
// everywhere else - the same split BuoyDisplay makes, and the same contract:
// the player names the signal from the picture, so NOTHING here may name it.
//
// THE PHOTOGRAPHS answer to the strict rule set by the buoyage card: no
// legible text of any kind at the size the panel draws, judged on a 2x screen
// (the 204px panel shows about 408 pixels of the 640px file), and checked in
// the running app, not estimated. Three passed - a hand flare held up at night,
// an orange smoke canister floating on the sea, and a dye marker spreading in
// the water. Commons has no licensed photograph of a parachute flare in the
// air, a red star shell, a November-Charlie hoist, a square flag with a ball,
// the arms signal or flames on a vessel, so those six are still drawn. The
// candidates that were tried and turned down are in IMAGE-CREDITS.md.
//
// Only the signals that HAVE a visual form are here. A distress signal sent by
// radiotelegraphy, a spoken Mayday, an EPIRB alert and a gun fired at
// one-minute intervals are all real entries on the same list and none of them
// can be drawn - a picture of a radio would be a picture of a radio. Those are
// asked as text questions instead, and the map in ../index.tsx says which is
// which.
//
// Colour carries meaning here in a way it does not for an anchor: red is what
// makes a flare a distress signal and orange is what makes the smoke one. That
// puts one restriction on the questions rather than on this file - a question
// that ASKS what colour the signal must be cannot be given a diagram, because
// the diagram is the answer. Those are text questions too.

const PLATE_FILL = 'rgb(15,23,42)';
const PLATE_STROKE = 'rgb(148,163,184)';
const DETAIL_STROKE = 'rgba(148,163,184,0.55)';
const SMOKE = 'rgba(148,163,184,0.28)';

const SIGNAL_RED = '#d8382c';
const SIGNAL_GLOW = 'rgba(216,56,44,0.22)';
const SIGNAL_ORANGE_SOFT = 'rgba(224,131,52,0.35)';
const FLAG_BLUE = '#1d4e89';
const FLAG_RED = '#a8332c';
const FLAG_WHITE = '#e2e6ea';

const plate = {
  fill: PLATE_FILL,
  stroke: PLATE_STROKE,
  strokeWidth: 1.2,
  strokeLinejoin: 'round' as const,
};

// A burning flare: a hot core inside two softer haloes, so it reads as light
// being given off rather than as a red disc painted on the panel.
function flareLight(cx: number, cy: number, r: number): React.ReactNode {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 2.6} fill={SIGNAL_GLOW} />
      <circle cx={cx} cy={cy} r={r * 1.6} fill="rgba(216,56,44,0.45)" />
      <circle cx={cx} cy={cy} r={r} fill={SIGNAL_RED} />
    </g>
  );
}

// The four flag-code stripes and checks are drawn as plain rects inside a
// bordered field. A hoist is two flags on one halyard, so the halyard and the
// mast are part of the picture: without them a viewer reads two rectangles.
function flagField(x: number, y: number, w: number, h: number, fill: React.ReactNode) {
  return (
    <g>
      {fill}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={PLATE_STROKE} strokeWidth="1.2" />
    </g>
  );
}

// ── What each drawn signal is made of ────────────────────────────────────
//
// The parts of each drawing that can be counted or coloured - shroud lines,
// stars, checks and stripes, which way round the ball and the flag go, the
// two arm positions, the flames - live in these tables. The drawing below
// paints from them and describeDistress reads them, so the description cannot
// count four lines where three are drawn.

type Line = [number, number, number, number];

const PARACHUTE = {
  shrouds: [
    [62, 62, 108, 104],
    [98, 57, 108, 104],
    [122, 57, 112, 104],
    [158, 62, 112, 104],
  ] as Line[],
  light: { cx: 110, cy: 112, r: 9 },
};

const STAR_BURST = {
  stars: [
    { cx: 110, cy: 56, r: 7 },
    { cx: 78, cy: 44, r: 5 },
    { cx: 142, cy: 46, r: 5 },
    { cx: 120, cy: 26, r: 4 },
    { cx: 94, cy: 24, r: 4 },
  ],
  streaks: [
    [110, 48, 110, 38],
    [100, 52, 90, 48],
    [120, 52, 130, 48],
  ] as Line[],
};

const NC_HOIST = {
  checks: { rows: 4, cols: 4, a: FLAG_BLUE, b: FLAG_WHITE },
  stripes: [FLAG_BLUE, FLAG_WHITE, FLAG_RED, FLAG_WHITE, FLAG_BLUE],
};

const FLAG_AND_BALL = {
  ball: { cx: 106, cy: 44, r: 15 },
  flag: { x: 76, y: 78, w: 60, h: 58 },
};

const ARMS = {
  raised: [
    [110, 78, 70, 50],
    [110, 78, 150, 50],
  ] as Line[],
  lowered: [
    [110, 78, 68, 106],
    [110, 78, 152, 106],
  ] as Line[],
  movement: ['M 66 100 C 58 84, 58 66, 66 52', 'M 154 100 C 162 84, 162 66, 154 52'],
};

// Each flame is a soft outer tongue with a hotter one inside it.
const FLAMES = [
  {
    outer: 'M 92 106 C 82 84, 100 78, 96 58 C 112 72, 116 88, 112 106 Z',
    inner: 'M 100 106 C 96 90, 106 84, 104 70 C 114 82, 116 94, 112 106 Z',
  },
  {
    outer: 'M 112 106 C 106 82, 124 74, 122 54 C 140 76, 140 92, 132 106 Z',
    inner: 'M 116 106 C 113 92, 122 86, 121 74 C 131 88, 130 98, 126 106 Z',
  },
];

const line = ([x1, y1, x2, y2]: Line, key: number) => <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />;

function signalBody(signal: DrawnSignal): React.ReactNode {
  switch (signal) {
    // A red light descending slowly under a canopy. The shroud lines and the
    // canopy are what separate it from a hand flare and from a star shell.
    case 'parachute-flare': {
      const { light } = PARACHUTE;
      return (
        <g>
          <path d="M 62 62 C 66 26, 154 26, 158 62 C 138 52, 82 52, 62 62 Z" {...plate} />
          <path
            d="M 62 62 C 82 52, 138 52, 158 62"
            fill="none"
            stroke={DETAIL_STROKE}
            strokeWidth="1.1"
          />
          <g stroke={DETAIL_STROKE} strokeWidth="1" fill="none">
            {PARACHUTE.shrouds.map(line)}
          </g>
          {flareLight(light.cx, light.cy, light.r)}
          {/* Drifting downwind as it falls */}
          <path
            d="M 110 126 C 118 136, 124 146, 122 158"
            fill="none"
            stroke={SMOKE}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );
    }

    // Fired from the deck and bursting into separate stars. The stars are
    // drawn as several distinct lights, which is the whole of the difference
    // between this and one flare hanging under a canopy.
    case 'star-rocket':
      return (
        <g>
          <path
            d="M 58 152 C 66 118, 84 88, 110 66"
            fill="none"
            stroke={SMOKE}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="7 6"
          />
          {STAR_BURST.stars.map((s, i) => (
            <React.Fragment key={i}>{flareLight(s.cx, s.cy, s.r)}</React.Fragment>
          ))}
          <g stroke={SIGNAL_RED} strokeWidth="1.4" strokeLinecap="round" opacity={0.8}>
            {STAR_BURST.streaks.map(line)}
          </g>
        </g>
      );

    // Two flags on one halyard: a chequered field over a striped one. The
    // stripes and squares are the signal, so they are drawn to count.
    case 'flag-nc': {
      const { checks, stripes } = NC_HOIST;
      const cw = 76 / checks.cols;
      const ch = 52 / checks.rows;
      const sh = 52 / stripes.length;
      return (
        <g>
          <line
            x1={66} y1={22} x2={66} y2={152}
            stroke={PLATE_STROKE} strokeWidth="2.4" strokeLinecap="round"
          />
          {flagField(
            72, 34, 76, 52,
            <g>
              {Array.from({ length: checks.rows }, (_, r) =>
                Array.from({ length: checks.cols }, (_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={72 + c * cw}
                    y={34 + r * ch}
                    width={cw}
                    height={ch}
                    fill={(r + c) % 2 === 0 ? checks.a : checks.b}
                  />
                ))
              )}
            </g>
          )}
          <line x1={66} y1={92} x2={72} y2={92} stroke={DETAIL_STROKE} strokeWidth="1.2" />
          {flagField(
            72, 96, 76, 52,
            <g>
              {stripes.map((c, i) => (
                <rect key={i} x={72} y={96 + i * sh} width={76} height={sh} fill={c} />
              ))}
            </g>
          )}
        </g>
      );
    }

    // A square flag with a ball above it. The flag is deliberately left plain:
    // the signal is the pairing of a flag with a round object, and giving the
    // flag a pattern would turn it into a particular code flag.
    case 'flag-and-ball': {
      const { ball, flag } = FLAG_AND_BALL;
      return (
        <g>
          <line
            x1={70} y1={18} x2={70} y2={152}
            stroke={PLATE_STROKE} strokeWidth="2.4" strokeLinecap="round"
          />
          <circle cx={ball.cx} cy={ball.cy} r={ball.r} {...plate} />
          <line x1={70} y1={ball.cy} x2={ball.cx - ball.r} y2={ball.cy} stroke={DETAIL_STROKE} strokeWidth="1.2" />
          <line x1={70} y1={flag.y} x2={flag.x} y2={flag.y} stroke={DETAIL_STROKE} strokeWidth="1.2" />
          <rect x={flag.x} y={flag.y} width={flag.w} height={flag.h} {...plate} />
        </g>
      );
    }

    // Outstretched arms raised and lowered, over and over. A still figure
    // cannot show repetition, so the lowered position is ghosted in behind the
    // raised one and two arcs carry the movement between them.
    case 'arms':
      return (
        <g>
          {/* The lowered position, behind */}
          <g stroke={DETAIL_STROKE} strokeWidth="3.4" strokeLinecap="round" opacity={0.45} fill="none">
            {ARMS.lowered.map(line)}
          </g>
          {/* The movement between the two */}
          <g stroke={DETAIL_STROKE} strokeWidth="1.3" fill="none" opacity={0.7}>
            {ARMS.movement.map((d, i) => (
              <path key={i} d={d} strokeDasharray="4 4" />
            ))}
          </g>
          {/* The raised position, then the body */}
          <g stroke={PLATE_STROKE} strokeWidth="4.4" strokeLinecap="round" fill="none">
            {ARMS.raised.map(line)}
            <line x1={110} y1={72} x2={110} y2={118} />
            <line x1={110} y1={118} x2={94} y2={152} />
            <line x1={110} y1={118} x2={126} y2={152} />
          </g>
          <circle cx={110} cy={56} r={12} {...plate} />
        </g>
      );

    // Flames on the vessel. The hull has to be there or the fire is just a
    // fire: the signal is that the burning thing is the vessel herself.
    case 'flames':
      return (
        <g>
          <g fill={SIGNAL_ORANGE_SOFT}>
            {FLAMES.map((f, i) => (
              <path key={i} d={f.outer} />
            ))}
          </g>
          <g fill={SIGNAL_RED} opacity={0.9}>
            {FLAMES.map((f, i) => (
              <path key={i} d={f.inner} />
            ))}
          </g>
          {/* Deck and hull */}
          <rect x={86} y={106} width={48} height={12} {...plate} />
          <path d="M 46 122 L 174 122 L 156 148 L 64 148 Z" {...plate} />
          <line x1={46} y1={122} x2={174} y2={122} stroke={DETAIL_STROKE} strokeWidth="1.2" />
        </g>
      );
  }
}

// ── The text equivalent ──────────────────────────────────────────────────
//
// For the drawn signals only, generated from the tables above. It says what
// the picture shows and never what it is: "flare", "rocket" and "distress"
// are what the questions ask. A photographed signal returns null; its alt
// text describes the frame.
export function describeDistress(signal: DistressSignalName): string | null {
  if (signal in DISTRESS_IMAGES) return null;
  const red = colourName(SIGNAL_RED);
  switch (signal as DrawnSignal) {
    case 'parachute-flare':
      return (
        `A dome-shaped canopy near the top, with ${countWord(PARACHUTE.shrouds.length)} lines hanging from ` +
        `its edge and meeting at one bright ${red} light below it. A soft trail of smoke drifts down beneath the light.`
      );
    case 'star-rocket':
      return (
        `A dashed trail of smoke climbs from the lower left to a burst of ` +
        `${countWord(STAR_BURST.stars.length)} separate bright ${red} lights near the top, with ` +
        `${countWord(STAR_BURST.streaks.length)} short ${red} streaks flying out from the largest.`
      );
    case 'flag-nc': {
      const { checks, stripes } = NC_HOIST;
      return (
        `Two flags on one halyard, one above the other. The upper flag is a chequerboard of ` +
        `${countWord(checks.cols)} by ${countWord(checks.rows)} squares, alternating ${colourName(checks.a)} and ` +
        `${colourName(checks.b)}. The lower flag has ${countWord(stripes.length)} horizontal stripes, from top to ` +
        `bottom: ${joinList(stripes.map(colourName))}.`
      );
    }
    case 'flag-and-ball': {
      const { ball, flag } = FLAG_AND_BALL;
      const order = ball.cy < flag.y ? 'above' : 'beneath';
      return (
        `A tall staff carrying two things: a round ${colourName(PLATE_FILL)} shape, and a plain ` +
        `${colourName(PLATE_FILL)} square flag. The round shape is ${order} the flag.`
      );
    }
    case 'arms':
      return (
        `A standing figure with both arms raised and outstretched to the sides. A fainter second pair of ` +
        `arms is drawn lowered, outstretched the same way, and ${countWord(ARMS.movement.length)} dashed ` +
        `curves join the raised and the lowered positions, one on each side.`
      );
    case 'flames':
      return (
        `${capitalise(countWord(FLAMES.length))} flames, ${red} inside ${colourName(SIGNAL_ORANGE_SOFT)}, ` +
        `rise from the deck of a hull.`
      );
  }
}

// Sources and licences are in src/lib/imageCredits.ts. Each is 640x480, the
// 4:3 the 220x170 drawings are close to, so the panel keeps its shape.
const DISTRESS_IMAGES: Record<PhotoSignal, string> = {
  'hand-flare': handFlare,
  'orange-smoke': orangeSmoke,
  'dye-marker': dyeMarker,
};

// Alt text describes the FRAME, never the signal.
const ALT = 'Photograph of a signal, shown for identification';

function isPhoto(signal: DistressSignalName): signal is PhotoSignal {
  return signal in DISTRESS_IMAGES;
}

export const DistressDisplay: React.FC<DistressDisplayProps> = ({ signal, label, a11y }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      {isPhoto(signal) ? (
        <img
          src={DISTRESS_IMAGES[signal]}
          alt={ALT}
          width={640}
          height={480}
          draggable={false}
          className="w-full h-auto rounded-lg"
          style={{ display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }}
        />
      ) : (
        <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg" {...imgProps(a11y)}>
          {signalBody(signal)}
        </svg>
      )}
    </div>
  </div>
);

export { DISTRESS_IMAGES };
