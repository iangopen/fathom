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
    // base almost on the water, a broad convective tower, and an anvil
    // spreading far out sideways where the tower has hit air it cannot rise
    // through. The anvil is drawn out further to the right, the way it leans
    // ahead of the storm's travel.
    //
    // THIS IS NOT AN ATOMIC MUSHROOM, AND IT TOOK THREE TRIES NOT TO BE. It was
    // first drawn as a tower that NARROWED as it rose with a separate rounded
    // cap balanced on top - which is a stem with a cloud on it, and is not what
    // a candidate has to recognise off the stern of a boat. A storm head is one
    // column of rising air that gets wider all the way up and then, at the
    // ceiling it cannot climb through, keeps going sideways instead. Three
    // things carry that here, and dropping any one of them brings the mushroom
    // straight back:
    //
    //   1. The tower widens as it rises - 80 across at the base, about 110 at
    //      the shoulders - and its sides are drawn in and out rather than
    //      straight. Straight parallel sides made a bucket of it.
    //   2. The anvil is 202 across against that 80, and it is THICK over the
    //      tower and thin at the wings. Drawn as a uniformly flat plate it read
    //      as the brim of a hat however wide it got.
    //   3. The anvil is painted FIRST and the tower over it, so the tower's
    //      head tucks under the anvil's bulk and the boundary between them is a
    //      curve. Painted the other way round, the seam runs dead horizontal
    //      and no amount of width fixes it.
    //
    // The right wing runs out further than the left, which is the anvil leaning
    // ahead of the storm's travel - and a hint about which way it is going.
    case 'cumulonimbus':
      return (
        <g>
          {/* Anvil first, and the tower painted over it - so the tower's head
              intrudes into the anvil and the boundary between them is a curve
              rather than a straight line. Drawn the other way round, with the
              anvil laid flat over a flat-topped tower, the seam runs dead
              horizontal and the whole thing reads as a top hat. */}
          <path
            d="M 16 46
               C 22 36, 40 32, 62 32
               C 70 14, 94 6, 116 9
               C 140 12, 154 22, 160 34
               C 192 34, 218 42, 214 50
               C 192 60, 150 63, 110 62
               C 70 62, 30 56, 16 46 Z"
            fill={CLOUD_LIGHT}
            stroke={CLOUD_MID}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* The tower: one column widening as it rises and doming over at the
              head, where it pushes up into the anvil. The sides are drawn in
              and out rather than straight - a convective tower is boiling, and
              straight sides made a bucket of it. */}
          <path
            d="M 70 140
               C 58 118, 70 100, 60 84
               C 54 72, 58 62, 64 56
               C 74 48, 92 46, 110 46
               C 128 46, 148 48, 158 56
               C 164 62, 163 74, 158 86
               C 152 102, 162 118, 150 140 Z"
            fill={CLOUD_DARK}
            stroke={CLOUD_MID}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* The fibrous underside of the anvil, drawn ONLY where the anvil
              hangs out past the tower. Run right across, these read as a bright
              bar laid over the tower rather than as cloud being drawn out
              sideways - which is the whole thing they are here to say. */}
          <g stroke={CLOUD_MID} strokeWidth="1.1" opacity={0.8} fill="none">
            <path d="M 20 50 C 32 56, 46 60, 60 62" />
            <path d="M 30 55 C 40 59, 50 62, 62 64" />
            <path d="M 210 50 C 196 56, 180 60, 164 62" />
            <path d="M 198 55 C 188 60, 176 63, 162 65" />
          </g>
          {/* The base, darker still and hanging almost on the water */}
          <path
            d="M 68 126 C 90 120, 130 120, 152 126 C 150 135, 143 142, 130 143
               L 90 143 C 77 142, 69 135, 68 126 Z"
            fill={CLOUD_BASE}
          />
          {/* Rain shaft under the base */}
          <g stroke={CLOUD_BASE} strokeWidth="1.8" opacity={0.55} strokeLinecap="round">
            {[80, 94, 108, 122, 136, 148].map((x) => (
              <line key={x} x1={x} y1={143} x2={x - 7} y2={HORIZON_Y + 6} />
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
