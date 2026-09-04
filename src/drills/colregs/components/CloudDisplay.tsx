import React from 'react';

export type CloudName =
  // High ice cloud: the two forms that give about a day's notice
  | 'cirrus'
  | 'mackerel'
  | 'halo'
  // Convective cloud: the fair-weather one and the one that is an emergency
  | 'cumulus'
  | 'cumulonimbus';

interface CloudDisplayProps {
  type: CloudName;
  label?: string;
}

// Sky elevation, 220x170, drawn to the same contract as BuoyDisplay and
// AnchorDisplay: the player names what the sky is about to do from the shape
// of the cloud, so NOTHING here may name the form in text.
//
// WHY THE WEATHER CARD HAS A DIAGRAM AT ALL. Most of this card is text - a
// force number is a number and a wind shift is a rhythm over time, and neither
// can be drawn honestly. Cloud form is the exception, and it is the exception
// for the same reason buoyage is: the thing a person has to do on the water is
// LOOK at it and know which one it is. Cirrus, cumulus, cumulonimbus, a
// mackerel sky and a halo have genuinely distinct silhouettes that survive
// being reduced to a flat drawing, which is the test a diagram has to pass
// here. Sea state does not pass it - forces 5 and 6 differ by how much foam is
// blowing, and a drawing of that would be inventing a distinction the picture
// cannot really carry - so nothing on the Beaufort half is diagrammed.
//
// The horizon and the small sea below it are scale, not content: without them
// a viewer cannot tell high thin cloud from low heaped cloud, which is half of
// what separates cirrus from cumulus. Everything above the horizon is drawn in
// greys and whites only - no colour is used anywhere in this file, so no
// question can be answered off a hue.

const SKY = 'rgba(148,163,184,0.10)';
const HORIZON = 'rgba(148,163,184,0.55)';
const SEA = 'rgba(148,163,184,0.16)';

const CLOUD_LIGHT = 'rgba(226,230,234,0.92)';
const CLOUD_MID = 'rgba(203,213,225,0.72)';
const CLOUD_DARK = 'rgba(100,116,139,0.85)';
const CLOUD_BASE = 'rgba(71,85,105,0.95)';
const WISP = 'rgba(226,230,234,0.85)';
const SUN = 'rgba(226,230,234,0.95)';

const HORIZON_Y = 146;

// The ground every form is drawn over, so the height of a cloud in the frame
// means the same thing from one question to the next.
function backdrop(): React.ReactNode {
  return (
    <g>
      <rect x={0} y={0} width={220} height={HORIZON_Y} fill={SKY} />
      <rect x={0} y={HORIZON_Y} width={220} height={170 - HORIZON_Y} fill={SEA} />
      <line
        x1={0}
        y1={HORIZON_Y}
        x2={220}
        y2={HORIZON_Y}
        stroke={HORIZON}
        strokeWidth="1.2"
      />
    </g>
  );
}

// A single hooked streak. Cirrus is nothing but these: fibrous, drawn out by
// the wind aloft, and hooked at one end where the falling ice crystals lag
// behind the cloud that made them. The hook is the whole identification, which
// is why the mare's tail is named for a tail.
function tail(x: number, y: number, len: number, lift: number): React.ReactNode {
  return (
    <path
      d={`M ${x} ${y} C ${x + len * 0.45} ${y - lift * 0.5}, ${x + len * 0.7} ${y - lift}, ${x + len} ${y - lift * 1.35}`}
      fill="none"
      stroke={WISP}
      strokeWidth="2.6"
      strokeLinecap="round"
      opacity={0.9}
    />
  );
}

function cloudBody(type: CloudName): React.ReactNode {
  switch (type) {
    // High, thin, fibrous streaks with hooked tails, well up in the frame and
    // with clear sky under them - there is nothing between this cloud and the
    // sea, which is the point of it.
    case 'cirrus':
      return (
        <g>
          {tail(30, 54, 62, 16)}
          {tail(58, 78, 74, 20)}
          {tail(104, 44, 58, 14)}
          {tail(126, 70, 66, 18)}
          {tail(24, 100, 48, 12)}
        </g>
      );

    // Ranks of small cloudlets in a regular ripple, high enough to keep the
    // horizon clear. Drawn as rows that shrink and crowd towards the top of
    // the frame, which is what perspective does to an even field of them.
    case 'mackerel': {
      const rows = [
        { y: 42, r: 4.0, gap: 15, n: 12, x0: 22 },
        { y: 58, r: 4.8, gap: 18, n: 10, x0: 20 },
        { y: 76, r: 5.6, gap: 22, n: 9, x0: 16 },
        { y: 97, r: 6.4, gap: 27, n: 7, x0: 18 },
      ];
      return (
        <g>
          {rows.map((row, ri) =>
            Array.from({ length: row.n }, (_, i) => (
              <ellipse
                key={`${ri}-${i}`}
                cx={row.x0 + i * row.gap}
                cy={row.y}
                rx={row.r * 1.5}
                ry={row.r}
                fill={CLOUD_LIGHT}
                opacity={0.55 + ri * 0.08}
              />
            ))
          )}
        </g>
      );
    }

    // A disc with a ring standing well off it, and a thin veil of cloud across
    // the whole sky that the ring is being refracted through. The gap between
    // the disc and the ring is the identification: a glow touching the disc is
    // a corona and a different thing entirely.
    case 'halo':
      return (
        <g>
          <g opacity={0.5}>
            <rect x={0} y={0} width={220} height={HORIZON_Y} fill={CLOUD_MID} opacity={0.28} />
            {[30, 58, 92, 118].map((y) => (
              <path
                key={y}
                d={`M 6 ${y} C 60 ${y - 6}, 150 ${y + 6}, 214 ${y - 2}`}
                fill="none"
                stroke={WISP}
                strokeWidth="1.6"
                opacity={0.5}
              />
            ))}
          </g>
          <circle cx={110} cy={78} r={44} fill="none" stroke={WISP} strokeWidth="2.6" />
          <circle cx={110} cy={78} r={44} fill="none" stroke={WISP} strokeWidth="7" opacity={0.18} />
          <circle cx={110} cy={78} r={13} fill={SUN} />
        </g>
      );

    // Detached heaps with FLAT BASES all sitting on one level, and clear sky
    // between them. The flat base is the mark of a convective cloud and the
    // gaps are the mark of a fair-weather one.
    case 'cumulus':
      return (
        <g>
          {[
            { x: 44, y: 104, s: 1.0 },
            { x: 112, y: 104, s: 1.25 },
            { x: 176, y: 104, s: 0.8 },
          ].map(({ x, y, s }) => (
            <g key={x}>
              <path
                d={`M ${x - 30 * s} ${y}
                    C ${x - 34 * s} ${y - 14 * s}, ${x - 24 * s} ${y - 24 * s}, ${x - 13 * s} ${y - 22 * s}
                    C ${x - 10 * s} ${y - 34 * s}, ${x + 6 * s} ${y - 38 * s}, ${x + 12 * s} ${y - 26 * s}
                    C ${x + 24 * s} ${y - 30 * s}, ${x + 33 * s} ${y - 18 * s}, ${x + 28 * s} ${y}
                    Z`}
                fill={CLOUD_LIGHT}
                stroke={CLOUD_MID}
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <line
                x1={x - 30 * s}
                y1={y}
                x2={x + 28 * s}
                y2={y}
                stroke={CLOUD_MID}
                strokeWidth="1.6"
              />
            </g>
          ))}
        </g>
      );

    // One cloud filling the whole frame from the sea to the top of it: a dark
    // base almost on the water, a hard-edged tower, and an anvil spreading
    // sideways where it has stopped rising. The anvil leans to the right, the
    // way it does ahead of the storm's travel.
    case 'cumulonimbus':
      return (
        <g>
          {/* Anvil, struck flat against the air above and drawn out downwind */}
          <path
            d="M 46 40 C 40 28, 62 18, 86 20 C 96 10, 132 10, 142 22
               C 172 20, 196 28, 198 40 C 190 48, 150 50, 120 48
               C 92 50, 56 48, 46 40 Z"
            fill={CLOUD_LIGHT}
            stroke={CLOUD_MID}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* The tower, hard-edged and boiling, narrowing towards the base */}
          <path
            d="M 78 46 C 66 62, 70 80, 64 96 C 58 112, 62 128, 66 140
               L 158 140 C 160 126, 154 110, 150 94 C 146 76, 152 60, 142 46 Z"
            fill={CLOUD_DARK}
            stroke={CLOUD_MID}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* The base, darker still and hanging almost on the water */}
          <path
            d="M 62 128 C 84 122, 138 122, 160 128 C 158 138, 152 144, 140 145
               L 82 145 C 70 144, 63 138, 62 128 Z"
            fill={CLOUD_BASE}
          />
          {/* Rain shaft under the base */}
          <g stroke={CLOUD_BASE} strokeWidth="1.6" opacity={0.55} strokeLinecap="round">
            {[78, 92, 106, 120, 134, 148].map((x) => (
              <line key={x} x1={x} y1={145} x2={x - 5} y2={HORIZON_Y + 2} />
            ))}
          </g>
        </g>
      );
  }
}

export const CloudDisplay: React.FC<CloudDisplayProps> = ({ type, label }) => (
  <div className="flex flex-col items-center gap-3 select-none w-full">
    {label && (
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
    )}

    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm">
      <svg viewBox="0 0 220 170" className="w-full" xmlns="http://www.w3.org/2000/svg">
        {backdrop()}
        {cloudBody(type)}
      </svg>
    </div>
  </div>
);
