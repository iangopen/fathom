import React from 'react';
import { buildScenarioView, ScenarioType, VesselRole } from '../scenarioView';
import { SvgA11y, imgProps, colourName, capitalise, counted } from '../../../lib/visualA11y';

// Re-exported so existing importers keep using this module's public surface.
export type { ScenarioType } from '../scenarioView';


interface VesselScenarioProps {
  scenario: ScenarioType;
  label?: string;
  // False until the player has answered. Everything that states or colour-codes
  // the give-way outcome is withheld until then - see REVEALED_ONLY below.
  revealed?: boolean;
  a11y?: SvgA11y;
}

// A simple top-down vessel silhouette as an SVG path in a local 0–20 coordinate space.
// Bow points upward (negative y). The path is centered at (0,0).
const HULL_PATH = 'M 0 -9 C 5 -6, 6 2, 4 9 L -4 9 C -6 2, -5 -6, 0 -9 Z';



const ROLE_COLORS: Record<VesselRole, {
  fill: string; stroke: string; glow: string; text: string; arrow: string;
}> = {
  'give-way': {
    fill:   'rgb(124,45,18)',
    stroke: 'rgb(251,146,60)',
    glow:   'drop-shadow(0 0 6px rgba(251,146,60,0.7))',
    text:   'rgb(251,146,60)',
    arrow:  'rgb(251,146,60)',
  },
  'stand-on': {
    fill:   'rgb(8,51,68)',
    stroke: 'rgb(34,211,238)',
    glow:   'drop-shadow(0 0 6px rgba(34,211,238,0.7))',
    text:   'rgb(34,211,238)',
    arrow:  'rgb(34,211,238)',
  },
  'neutral': {
    fill:   'rgb(30,41,59)',
    stroke: 'rgb(148,163,184)',
    glow:   'drop-shadow(0 0 4px rgba(148,163,184,0.4))',
    text:   'rgb(148,163,184)',
    arrow:  'rgb(148,163,184)',
  },
};

// ── The text equivalent ──────────────────────────────────────────────────
//
// Generated from buildScenarioView - the same gated view the SVG is drawn
// from - so it inherits the leak rule for free: before the answer every
// vessel is grey, a `typeAfterAnswer` vessel is unlabelled, and there is no
// caption or legend, because the view holds none of those to describe.

// A direction on the page, in degrees clockwise from straight up.
function pageDirection(deg: number): string {
  const words = [
    'up the page', 'up and to the right', 'to the right', 'down and to the right',
    'down the page', 'down and to the left', 'to the left', 'up and to the left',
  ];
  return words[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

function pagePlace(x: number, y: number): string {
  const across = x < 130 ? 'left' : x > 170 ? 'right' : '';
  const down = y <= 105 ? 'top' : y >= 165 ? 'bottom' : '';
  if (across && down) return `${down} ${across}`;
  if (down) return down === 'top' ? 'top centre' : 'bottom centre';
  return across ? `middle ${across}` : 'centre';
}

// Where a vessel's label sits: on the side of the hull away from her arrow -
// below it when the arrow points up the page, above it otherwise. It used to
// go on the arrow's own side, about one arrow length out, which put it on the
// arrowhead. The text is centred on the hull's x; this is its baseline.
export const LABEL_FONT_SIZE = 8;
export function labelY(v: { y: number; arrowDy: number }): number {
  return v.y + (v.arrowDy < 0 ? 26 : -22);
}

export function describeScenario(scenario: ScenarioType, revealed: boolean): string {
  const view = buildScenarioView(scenario, revealed);
  const vessels = [...view.vessels].sort((a, b) => a.y - b.y || a.x - b.x);

  const one = (v: (typeof vessels)[number]) => {
    const name = v.label ? `a vessel labelled ${v.label}` : 'an unlabelled vessel';
    // The arrow is what reads as her heading; with none, say which way
    // the hull points.
    const going = v.showArrow
      ? `with an arrow pointing ${pageDirection((Math.atan2(v.arrowDx, -v.arrowDy) * 180) / Math.PI)}`
      : `pointing ${pageDirection(v.rotation)}, with no arrow`;
    const colour = revealed ? `, drawn in ${colourName(ROLE_COLORS[v.colorRole].stroke)}` : '';
    return `${name} at the ${pagePlace(v.x, v.y)}${colour}, ${going}`;
  };

  const colours = revealed ? '' : `, ${vessels.length === 2 ? 'both' : 'all'} drawn in the same grey`;
  const parts = [
    `Seen from above. ${capitalise(counted(vessels.length, 'vessel'))}${colours}, from top to bottom: ` +
      `${vessels.map(one).join('; ')}.`,
  ];
  if (view.showLegend) {
    parts.push(
      `A key matches ${colourName(ROLE_COLORS['give-way'].stroke)} to Give-Way and ` +
        `${colourName(ROLE_COLORS['stand-on'].stroke)} to Stand-On.`
    );
  }
  if (view.caption) parts.push(`Caption: ${view.caption}`);
  return parts.join(' ');
}

export const VesselScenario: React.FC<VesselScenarioProps> = ({ scenario, label, revealed = false, a11y }) => {
  // All answer-gating lives in buildScenarioView; this component renders
  // whatever it is handed and makes no reveal decisions of its own.
  const view = buildScenarioView(scenario, revealed);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">{label}</div>
      )}

      <div className="w-full max-w-[300px]">
        <svg
          viewBox="0 0 300 280"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          {...imgProps(a11y)}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
            </pattern>
            <marker id="arrow-giveway" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill={ROLE_COLORS['give-way'].arrow} />
            </marker>
            <marker id="arrow-standon" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill={ROLE_COLORS['stand-on'].arrow} />
            </marker>
            <marker id="arrow-neutral" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill={ROLE_COLORS['neutral'].arrow} />
            </marker>
          </defs>

          <rect width="300" height="280" fill="url(#grid)" />
          <rect width="300" height="280" fill="rgb(2,10,22)" opacity="0.6" />

          {/* Water texture rings */}
          <circle cx="150" cy="140" r="100" fill="none" stroke="rgba(34,211,238,0.03)" strokeWidth="1" />
          <circle cx="150" cy="140" r="65"  fill="none" stroke="rgba(34,211,238,0.03)" strokeWidth="1" />

          {view.vessels.map((v, i) => {
            const colors = ROLE_COLORS[v.colorRole];
            const markerId = `arrow-${v.colorRole}`;

            // Arrow endpoint — shorten by arrowhead (~8px from hull)
            const ax = v.x + v.arrowDx;
            const ay = v.y + v.arrowDy;

            return (
              <g key={i}>
                {/* Course arrow */}
                {v.showArrow && (
                  <line
                    x1={v.x}
                    y1={v.y}
                    x2={ax}
                    y2={ay}
                    stroke={colors.arrow}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    markerEnd={`url(#${markerId})`}
                    opacity="0.7"
                  />
                )}

                {/* Hull */}
                <g
                  transform={`translate(${v.x}, ${v.y}) rotate(${v.rotation})`}
                  style={{ filter: colors.glow }}
                >
                  <path
                    d={HULL_PATH}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="0.8"
                  />
                </g>

                {/* Label */}
                <text
                  x={v.x}
                  y={labelY(v)}
                  textAnchor="middle"
                  fontSize={LABEL_FONT_SIZE}
                  fill={colors.text}
                  fontFamily="monospace"
                  opacity="0.85"
                >
                  {v.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Caption and legend both state the outcome, so they are the answer.
          Reserve the space either way to stop the diagram jumping on reveal. */}
      <div className="min-h-[58px] flex flex-col items-center gap-3">
        {view.caption !== null && (
          <p className="text-[11px] text-slate-400 text-center leading-snug max-w-[260px] font-mono animate-in fade-in duration-300">
            {view.caption}
          </p>
        )}

        {view.showLegend && (
          <div className="flex gap-5 text-[10px] font-mono uppercase tracking-wider animate-in fade-in duration-300">
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-700 border border-orange-400 inline-block" />
              Give-Way
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-950 border border-cyan-400 inline-block" />
              Stand-On
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
