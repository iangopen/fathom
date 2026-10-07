import React from 'react';

import flotationAid from '../../../assets/pfd/flotation-aid.jpg';
import ringBuoy from '../../../assets/pfd/ring-buoy.jpg';

export type PfdFormName =
  | 'offshore-vest'
  | 'flotation-aid'
  | 'ring-buoy'
  | 'throwable-cushion'
  | 'inflatable';

// The two forms shown as PHOTOGRAPHS; the other three are still drawn.
type PhotoForm = 'flotation-aid' | 'ring-buoy';
type DrawnForm = Exclude<PfdFormName, PhotoForm>;

interface PfdDisplayProps {
  form: PfdFormName;
  label?: string;
}

// PHOTOGRAPHS where a licensed one passes, 220x170 drawings elsewhere, to the
// same contract as AnchorDisplay and BuoyDisplay: the player names the device
// from its form, so NOTHING here may name it in text.
//
// THE PHOTOGRAPHS answer to the strict rule set by the buoyage card: no legible
// text of any kind at the size the panel draws, judged on a 2x screen and
// checked in the running app. Life jackets are covered in text - makers'
// names, approval labels, size bands, type codes - and ring buoys carry the
// name of their ship or pier, so this is the rule most candidates fail. Two
// passed: a zip-front flotation vest whose one small maker's badge cannot be
// read at panel size, and a ring buoy with grab lines floating in a pool. No
// licensed photograph was found of an offshore collar jacket without text on
// it, or of a throwable cushion at all, and the one inflatable found did not
// show its cylinder or read clearly as a life jacket - those three are still
// drawn. See IMAGE-CREDITS.md for the candidates turned down.
//
// The union is named for the FORM, not for the type code, and that is not
// squeamishness about naming things. The Coast Guard is retiring the Type I-V
// codes in favour of performance levels, so the same drawing has two correct
// names depending on which label the device in your locker was printed with.
// What does not change is the shape: a horseshoe yoke is a horseshoe yoke
// under either scheme. Naming these by form keeps the diagram true to both.
//
// Type II is deliberately NOT drawn. It is the same yoke form as Type I and
// differs by bulk and by buoyancy - 15.5 pounds against 22 - which a line
// drawing cannot state without writing the number on the picture. It is asked
// as a text question instead, the same treatment the bottom-matching anchor
// questions get.
//
// The flotation is drawn in a muted orange because that is what a life jacket
// looks like at a glance, and drawing one navy made it read as a bag. Nothing
// turns on the colour: no question here asks what colour a PFD must be, and
// the throwables and the wearables share the same one.

const FOAM_FILL = '#b95f31';
const FOAM_EDGE = 'rgb(148,163,184)';
const STRAP = 'rgba(203,213,225,0.8)';
const DETAIL = 'rgba(148,163,184,0.55)';
const HARDWARE = 'rgba(212,169,74,0.85)';
const PLATE_FILL = 'rgb(15,23,42)';

const foam = {
  fill: FOAM_FILL,
  stroke: FOAM_EDGE,
  strokeWidth: 1.2,
  strokeLinejoin: 'round' as const,
};

function pfdBody(form: DrawnForm): React.ReactNode {
  switch (form) {
    // The offshore yoke: a deep collar that sits behind the head, and two
    // heavy chest panels. The collar is the working part - it is what floats
    // the head of someone who cannot hold it up - so it is drawn large.
    case 'offshore-vest':
      return (
        <g>
          {/* Collar, behind the head */}
          <path
            d="M 62 74 C 58 34, 80 20, 110 20 C 140 20, 162 34, 158 74 L 138 74 C 142 46, 130 36, 110 36 C 90 36, 78 46, 82 74 Z"
            {...foam}
          />
          {/* Chest panels */}
          <path d="M 66 74 L 100 74 L 100 138 C 86 142, 74 142, 66 136 Z" {...foam} />
          <path d="M 120 74 L 154 74 L 154 136 C 146 142, 134 142, 120 138 Z" {...foam} />
          {/* Body straps */}
          <g stroke={STRAP} strokeWidth="3" strokeLinecap="round">
            <line x1={100} y1={94} x2={120} y2={94} />
            <line x1={100} y1={120} x2={120} y2={120} />
          </g>
          <g stroke={DETAIL} strokeWidth="1">
            <line x1={72} y1={92} x2={94} y2={92} />
            <line x1={126} y1={92} x2={148} y2={92} />
          </g>
        </g>
      );

    // A square cushion with a grab strap on each side. Also thrown rather than
    // worn: the straps are for hands, not for shoulders, and there is nothing
    // on it that could hold a head up.
    case 'throwable-cushion':
      return (
        <g>
          <rect x={54} y={44} width={112} height={84} rx={10} {...foam} />
          <g fill="none" stroke={STRAP} strokeWidth="3.4" strokeLinecap="round">
            <path d="M 54 66 C 40 74, 40 98, 54 106" />
            <path d="M 166 66 C 180 74, 180 98, 166 106" />
          </g>
          {/* Seam round the edge, and the quilting that keeps the foam put */}
          <rect
            x={62} y={52} width={96} height={68} rx={7}
            fill="none" stroke={DETAIL} strokeWidth="1"
          />
          <line x1={110} y1={52} x2={110} y2={120} stroke={DETAIL} strokeWidth="1" />
        </g>
      );

    // Worn deflated: two suspender straps over a flat folded bladder, a gas
    // cylinder under one side and an oral tube out of the other. The cylinder
    // is the identifying detail - nothing that floats on its own has one.
    case 'inflatable':
      return (
        <g>
          {/* Folded bladder, sitting flat on the chest */}
          <path
            d="M 74 52 C 92 40, 128 40, 146 52 L 150 96 C 150 108, 140 116, 128 116 L 92 116 C 80 116, 70 108, 70 96 Z"
            {...foam}
          />
          <path
            d="M 74 74 C 96 66, 124 66, 146 74"
            fill="none"
            stroke={DETAIL}
            strokeWidth="1.1"
          />
          {/* Suspender straps over the shoulders and round the waist */}
          <g fill="none" stroke={STRAP} strokeWidth="3" strokeLinecap="round">
            <path d="M 86 46 C 78 62, 76 86, 78 118" />
            <path d="M 134 46 C 142 62, 144 86, 142 118" />
            <line x1={72} y1={126} x2={148} y2={126} />
          </g>
          <rect x={102} y={121} width={16} height={11} rx={2} fill={PLATE_FILL} stroke={HARDWARE} strokeWidth="1.2" />
          {/* Gas cylinder, and the pull tab that fires it */}
          <g>
            <rect
              x={130} y={96} width={13} height={30} rx={6}
              fill={PLATE_FILL} stroke={FOAM_EDGE} strokeWidth="1.2"
              transform="rotate(18 136 111)"
            />
            <line x1={140} y1={124} x2={150} y2={144} stroke={STRAP} strokeWidth="2" strokeLinecap="round" />
            <circle cx={151} cy={148} r={5} fill={PLATE_FILL} stroke={HARDWARE} strokeWidth="1.4" />
          </g>
          {/* Oral inflation tube */}
          <path
            d="M 82 96 C 72 104, 68 116, 70 128"
            fill="none"
            stroke={DETAIL}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      );
  }
}

// Sources and licences are in src/lib/imageCredits.ts. Each is 640x480.
const PFD_IMAGES: Record<PhotoForm, string> = {
  'flotation-aid': flotationAid,
  'ring-buoy': ringBuoy,
};

// Alt text describes the FRAME, never the device. Not "flotation device": the
// answer to the flotation-aid question is "A Type III flotation aid", and the
// alt was the only place a screen reader heard that word before answering.
const ALT = 'Photograph of a piece of safety equipment, shown for identification';

function isPhoto(form: PfdFormName): form is PhotoForm {
  return form in PFD_IMAGES;
}

export const PfdDisplay: React.FC<PfdDisplayProps> = ({ form, label }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      {isPhoto(form) ? (
        <img
          src={PFD_IMAGES[form]}
          alt={ALT}
          width={640}
          height={480}
          draggable={false}
          className="w-full h-auto rounded-lg"
          style={{ display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }}
        />
      ) : (
        <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {pfdBody(form)}
        </svg>
      )}
    </div>
  </div>
);

export { PFD_IMAGES };
