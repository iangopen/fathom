import React from 'react';

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

function signalBody(signal: DrawnSignal): React.ReactNode {
  switch (signal) {
    // A red light descending slowly under a canopy. The shroud lines and the
    // canopy are what separate it from a hand flare and from a star shell.
    case 'parachute-flare':
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
            <line x1={62} y1={62} x2={108} y2={104} />
            <line x1={98} y1={57} x2={108} y2={104} />
            <line x1={122} y1={57} x2={112} y2={104} />
            <line x1={158} y1={62} x2={112} y2={104} />
          </g>
          {flareLight(110, 112, 9)}
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
          {flareLight(110, 56, 7)}
          {flareLight(78, 44, 5)}
          {flareLight(142, 46, 5)}
          {flareLight(120, 26, 4)}
          {flareLight(94, 24, 4)}
          <g stroke={SIGNAL_RED} strokeWidth="1.4" strokeLinecap="round" opacity={0.8}>
            <line x1={110} y1={48} x2={110} y2={38} />
            <line x1={100} y1={52} x2={90} y2={48} />
            <line x1={120} y1={52} x2={130} y2={48} />
          </g>
        </g>
      );

    // Two flags on one halyard: a chequered field over a striped one. The
    // stripes and squares are the signal, so they are drawn to count.
    case 'flag-nc':
      return (
        <g>
          <line
            x1={66} y1={22} x2={66} y2={152}
            stroke={PLATE_STROKE} strokeWidth="2.4" strokeLinecap="round"
          />
          {flagField(
            72, 34, 76, 52,
            <g>
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={72 + c * 19}
                    y={34 + r * 13}
                    width={19}
                    height={13}
                    fill={(r + c) % 2 === 0 ? FLAG_BLUE : FLAG_WHITE}
                  />
                ))
              )}
            </g>
          )}
          <line x1={66} y1={92} x2={72} y2={92} stroke={DETAIL_STROKE} strokeWidth="1.2" />
          {flagField(
            72, 96, 76, 52,
            <g>
              {[FLAG_BLUE, FLAG_WHITE, FLAG_RED, FLAG_WHITE, FLAG_BLUE].map((c, i) => (
                <rect key={i} x={72} y={96 + i * 10.4} width={76} height={10.4} fill={c} />
              ))}
            </g>
          )}
        </g>
      );

    // A square flag with a ball above it. The flag is deliberately left plain:
    // the signal is the pairing of a flag with a round object, and giving the
    // flag a pattern would turn it into a particular code flag.
    case 'flag-and-ball':
      return (
        <g>
          <line
            x1={70} y1={18} x2={70} y2={152}
            stroke={PLATE_STROKE} strokeWidth="2.4" strokeLinecap="round"
          />
          <circle cx={106} cy={44} r={15} {...plate} />
          <line x1={70} y1={44} x2={91} y2={44} stroke={DETAIL_STROKE} strokeWidth="1.2" />
          <line x1={70} y1={78} x2={76} y2={78} stroke={DETAIL_STROKE} strokeWidth="1.2" />
          <rect x={76} y={78} width={60} height={58} {...plate} />
        </g>
      );

    // Outstretched arms raised and lowered, over and over. A still figure
    // cannot show repetition, so the lowered position is ghosted in behind the
    // raised one and two arcs carry the movement between them.
    case 'arms':
      return (
        <g>
          {/* The lowered position, behind */}
          <g stroke={DETAIL_STROKE} strokeWidth="3.4" strokeLinecap="round" opacity={0.45} fill="none">
            <line x1={110} y1={78} x2={68} y2={106} />
            <line x1={110} y1={78} x2={152} y2={106} />
          </g>
          {/* The movement between the two */}
          <g stroke={DETAIL_STROKE} strokeWidth="1.3" fill="none" opacity={0.7}>
            <path d="M 66 100 C 58 84, 58 66, 66 52" strokeDasharray="4 4" />
            <path d="M 154 100 C 162 84, 162 66, 154 52" strokeDasharray="4 4" />
          </g>
          {/* The raised position */}
          <g stroke={PLATE_STROKE} strokeWidth="4.4" strokeLinecap="round" fill="none">
            <line x1={110} y1={78} x2={70} y2={50} />
            <line x1={110} y1={78} x2={150} y2={50} />
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
            <path d="M 92 106 C 82 84, 100 78, 96 58 C 112 72, 116 88, 112 106 Z" />
            <path d="M 112 106 C 106 82, 124 74, 122 54 C 140 76, 140 92, 132 106 Z" />
          </g>
          <g fill={SIGNAL_RED} opacity={0.9}>
            <path d="M 100 106 C 96 90, 106 84, 104 70 C 114 82, 116 94, 112 106 Z" />
            <path d="M 116 106 C 113 92, 122 86, 121 74 C 131 88, 130 98, 126 106 Z" />
          </g>
          {/* Deck and hull */}
          <rect x={86} y={106} width={48} height={12} {...plate} />
          <path d="M 46 122 L 174 122 L 156 148 L 64 148 Z" {...plate} />
          <line x1={46} y1={122} x2={174} y2={122} stroke={DETAIL_STROKE} strokeWidth="1.2" />
        </g>
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

export const DistressDisplay: React.FC<DistressDisplayProps> = ({ signal, label }) => (
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
        <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {signalBody(signal)}
        </svg>
      )}
    </div>
  </div>
);

export { DISTRESS_IMAGES };
