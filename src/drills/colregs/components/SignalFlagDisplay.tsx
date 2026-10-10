import React from 'react';
import { SvgA11y, imgProps, colourName, countWord, joinList } from '../../../lib/visualA11y';

export type FlagName =
  | 'alpha'
  | 'bravo'
  | 'charlie'
  | 'delta'
  | 'echo'
  | 'foxtrot'
  | 'golf'
  | 'hotel'
  | 'india'
  | 'november'
  | 'oscar'
  | 'papa'
  | 'quebec'
  | 'sierra'
  | 'victor';

interface SignalFlagDisplayProps {
  flag: FlagName;
  label?: string;
  a11y?: SvgA11y;
}

// One flag flying from a halyard, 220x170, drawn to the same contract as
// BuoyDisplay: the player is asked what the flag MEANS from what it looks
// like, so NOTHING here may name the letter or the meaning in text.
//
// This is legitimate identify-direction content for the same reason buoyage
// is. The International Code gives every letter a flag that can be told from
// all the others by colour and pattern alone at a distance - that is the whole
// engineering problem the Code solved - so a flat drawing carries the entire
// signal with nothing left out. Compare the navigation lights bank, where the
// questions run the other way and no diagram is possible.
//
// A flag is not one silhouette, so like a buoy it is DESCRIBED rather than
// drawn: a field pattern painted through a clip of the flag's outline, and an
// outline that is either a rectangle or a swallowtail. Those two things are
// exactly what identifies a flag, so the table below reads as the answer key
// it is, and the next letter is a row rather than a new set of paths.
//
// The four Code colours and nothing else. Real bunting is red, blue, yellow,
// black and white, and using an off-palette colour here would draw a flag that
// does not exist.

const FLAG_RED = '#c8322c';
const FLAG_BLUE = '#1d4e89';
const FLAG_YELLOW = '#dcb02f';
const FLAG_BLACK = '#0f172a';
const FLAG_WHITE = '#e2e6ea';

const MAST = 'rgba(203,213,225,0.75)';
const OUTLINE = 'rgb(148,163,184)';
const OUTLINE_W = 1.2;

// The flag's own box. The halyard runs down the left of it, so the hoist is at
// X and the fly at X + W - which is the orientation every published Code plate
// uses, and the one the swallowtail notch has to bite into.
const X = 62;
const Y = 40;
const W = 128;
const H = 88;

type Charge = 'rect' | 'disc' | 'diamond';

type Field =
  | { kind: 'solid'; color: string }
  // Top to bottom.
  | { kind: 'horizontal'; bands: string[] }
  // Hoist to fly.
  | { kind: 'vertical'; stripes: string[] }
  // Split corner to corner: upper hoist to lower fly.
  | { kind: 'diagonal'; upper: string; lower: string }
  | { kind: 'checker'; a: string; b: string; cols: number; rows: number }
  | { kind: 'charged'; ground: string; charge: Charge; color: string }
  // A saltire is the X, drawn corner to corner across the field.
  | { kind: 'saltire'; ground: string; color: string };

interface FlagSpec {
  swallowtail?: boolean;
  field: Field;
}

const FLAGS: Record<FlagName, FlagSpec> = {
  // The two swallowtails in this set, and the shape is half of each one's
  // identity: a solid red rectangle and a solid red swallowtail are different
  // signals, so the notch is drawn to be seen.
  alpha: { swallowtail: true, field: { kind: 'vertical', stripes: [FLAG_WHITE, FLAG_BLUE] } },
  bravo: { swallowtail: true, field: { kind: 'solid', color: FLAG_RED } },

  charlie: {
    field: { kind: 'horizontal', bands: [FLAG_BLUE, FLAG_WHITE, FLAG_RED, FLAG_WHITE, FLAG_BLUE] },
  },
  delta: { field: { kind: 'horizontal', bands: [FLAG_YELLOW, FLAG_BLUE, FLAG_YELLOW] } },
  echo: { field: { kind: 'horizontal', bands: [FLAG_BLUE, FLAG_RED] } },

  foxtrot: { field: { kind: 'charged', ground: FLAG_WHITE, charge: 'diamond', color: FLAG_RED } },
  golf: {
    field: {
      kind: 'vertical',
      stripes: [FLAG_YELLOW, FLAG_BLUE, FLAG_YELLOW, FLAG_BLUE, FLAG_YELLOW, FLAG_BLUE],
    },
  },
  hotel: { field: { kind: 'vertical', stripes: [FLAG_WHITE, FLAG_RED] } },
  india: { field: { kind: 'charged', ground: FLAG_YELLOW, charge: 'disc', color: FLAG_BLACK } },

  november: { field: { kind: 'checker', a: FLAG_BLUE, b: FLAG_WHITE, cols: 4, rows: 4 } },
  oscar: { field: { kind: 'diagonal', upper: FLAG_RED, lower: FLAG_YELLOW } },
  papa: { field: { kind: 'charged', ground: FLAG_BLUE, charge: 'rect', color: FLAG_WHITE } },
  quebec: { field: { kind: 'solid', color: FLAG_YELLOW } },
  sierra: { field: { kind: 'charged', ground: FLAG_WHITE, charge: 'rect', color: FLAG_BLUE } },
  victor: { field: { kind: 'saltire', ground: FLAG_WHITE, color: FLAG_RED } },
};

// The notch is cut a third of the way in, which is roughly what a real
// swallowtail looks like and is deep enough to survive being drawn small.
const NOTCH = 30;

function flagPath(swallowtail: boolean): string {
  if (!swallowtail) {
    return `M ${X} ${Y} L ${X + W} ${Y} L ${X + W} ${Y + H} L ${X} ${Y + H} Z`;
  }
  return (
    `M ${X} ${Y} L ${X + W} ${Y} L ${X + W - NOTCH} ${Y + H / 2} ` +
    `L ${X + W} ${Y + H} L ${X} ${Y + H} Z`
  );
}

// Painted through a clip of the outline, so a swallowtail needs no per-pattern
// geometry of its own - every field below is drawn as if the flag were square
// and the notch takes its bite out afterwards.
function fieldPaint(field: Field): React.ReactNode {
  switch (field.kind) {
    case 'solid':
      return <rect x={X} y={Y} width={W} height={H} fill={field.color} />;

    case 'horizontal': {
      const h = H / field.bands.length;
      return (
        <>
          {field.bands.map((c, i) => (
            <rect key={i} x={X} y={Y + i * h} width={W} height={h + 0.5} fill={c} />
          ))}
        </>
      );
    }

    case 'vertical': {
      const w = W / field.stripes.length;
      return (
        <>
          {field.stripes.map((c, i) => (
            <rect key={i} x={X + i * w} y={Y} width={w + 0.5} height={H} fill={c} />
          ))}
        </>
      );
    }

    case 'diagonal':
      return (
        <>
          <polygon
            points={`${X},${Y} ${X + W},${Y} ${X + W},${Y + H}`}
            fill={field.upper}
          />
          <polygon
            points={`${X},${Y} ${X + W},${Y + H} ${X},${Y + H}`}
            fill={field.lower}
          />
        </>
      );

    case 'checker': {
      const w = W / field.cols;
      const h = H / field.rows;
      const squares: React.ReactNode[] = [];
      for (let r = 0; r < field.rows; r += 1) {
        for (let c = 0; c < field.cols; c += 1) {
          squares.push(
            <rect
              key={`${r}-${c}`}
              x={X + c * w}
              y={Y + r * h}
              width={w + 0.5}
              height={h + 0.5}
              fill={(r + c) % 2 === 0 ? field.a : field.b}
            />
          );
        }
      }
      return <>{squares}</>;
    }

    case 'charged': {
      const cx = X + W / 2;
      const cy = Y + H / 2;
      let charge: React.ReactNode;
      if (field.charge === 'rect') {
        charge = (
          <rect
            x={cx - W * 0.19}
            y={cy - H * 0.26}
            width={W * 0.38}
            height={H * 0.52}
            fill={field.color}
          />
        );
      } else if (field.charge === 'disc') {
        charge = <circle cx={cx} cy={cy} r={H * 0.27} fill={field.color} />;
      } else {
        charge = (
          <polygon
            points={`${cx},${cy - H * 0.34} ${cx + W * 0.24},${cy} ${cx},${cy + H * 0.34} ${cx - W * 0.24},${cy}`}
            fill={field.color}
          />
        );
      }
      return (
        <>
          <rect x={X} y={Y} width={W} height={H} fill={field.ground} />
          {charge}
        </>
      );
    }

    case 'saltire':
      return (
        <>
          <rect x={X} y={Y} width={W} height={H} fill={field.ground} />
          <g stroke={field.color} strokeWidth={H * 0.2}>
            <line x1={X} y1={Y} x2={X + W} y2={Y + H} />
            <line x1={X} y1={Y + H} x2={X + W} y2={Y} />
          </g>
        </>
      );
  }
}

// The halyard and a short length of mast. Without them a viewer reads a
// coloured rectangle rather than a flag flying, and which end is the hoist -
// which decides what a vertically divided flag is - stops being obvious.
function rigging(): React.ReactNode {
  return (
    <g>
      <line
        x1={X - 6}
        y1={16}
        x2={X - 6}
        y2={152}
        stroke={MAST}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <line x1={X - 6} y1={Y + 4} x2={X} y2={Y + 4} stroke={MAST} strokeWidth="1.4" />
      <line
        x1={X - 6}
        y1={Y + H - 4}
        x2={X}
        y2={Y + H - 4}
        stroke={MAST}
        strokeWidth="1.4"
      />
    </g>
  );
}

function flagBody(flag: FlagName): React.ReactNode {
  const spec = FLAGS[flag];
  const d = flagPath(spec.swallowtail ?? false);
  const clipId = `flag-clip-${flag}`;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      {rigging()}
      <g clipPath={`url(#${clipId})`}>{fieldPaint(spec.field)}</g>
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={OUTLINE_W} strokeLinejoin="round" />
    </g>
  );
}

// ── The text equivalent ──────────────────────────────────────────────────
//
// Generated from FLAGS, the table the flag is painted from: its outline and
// its field, in the order a reader sees them - hoist to fly, top to bottom.
// It never names the letter: the colours and the pattern are the question.
const CHARGE_WORDS: Record<Charge, string> = {
  rect: 'square',
  disc: 'circle',
  diamond: 'diamond',
};

function fieldWords(field: Field): string {
  const c = colourName;
  switch (field.kind) {
    case 'solid':
      return `plain ${c(field.color)}`;
    case 'horizontal':
      return field.bands.length === 2
        ? `divided into horizontal halves: ${c(field.bands[0])} over ${c(field.bands[1])}`
        : `${countWord(field.bands.length)} horizontal stripes, from top to bottom: ${joinList(field.bands.map(c))}`;
    case 'vertical':
      return field.stripes.length === 2
        ? `divided into vertical halves: ${c(field.stripes[0])} at the hoist, ${c(field.stripes[1])} at the fly`
        : `${countWord(field.stripes.length)} vertical stripes, from hoist to fly: ${joinList(field.stripes.map(c))}`;
    case 'diagonal':
      return (
        `divided diagonally from the top corner at the hoist to the bottom corner at the fly: ` +
        `${c(field.upper)} above the line, ${c(field.lower)} below it`
      );
    case 'checker':
      return (
        `a chequerboard of ${countWord(field.cols)} by ${countWord(field.rows)} squares, alternating ` +
        `${c(field.a)} and ${c(field.b)}, with ${c(field.a)} in the top corner at the hoist`
      );
    case 'charged':
      return `${c(field.ground)}, with a ${c(field.color)} ${CHARGE_WORDS[field.charge]} in the centre`;
    case 'saltire':
      return `${c(field.ground)}, with a ${c(field.color)} diagonal cross running corner to corner`;
  }
}

export function describeFlag(flag: FlagName): string {
  const spec = FLAGS[flag];
  const outline = spec.swallowtail
    ? 'a swallow-tailed flag, cut into two points at the fly'
    : 'a rectangular flag';
  return `One flag flying from a halyard on the left, so the hoist is on the left: ${outline}, ${fieldWords(spec.field)}.`;
}

export const SignalFlagDisplay: React.FC<SignalFlagDisplayProps> = ({ flag, label, a11y }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg" {...imgProps(a11y)}>
        {flagBody(flag)}
      </svg>
    </div>
  </div>
);
