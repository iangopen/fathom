import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QUESTION_SCENARIOS } from '../drills/colregs';
import { buildScenarioView, ScenarioVesselView } from '../drills/colregs/scenarioView';
import { LABEL_FONT_SIZE, VesselScenario, labelY } from '../drills/colregs/components/VesselScenario';

// No scenario label may sit on its own arrow, or on anything else drawn.
//
// jsdom has no layout, so this works from the geometry the SVG is drawn from,
// with the label's box estimated on the generous side. Measured with getBBox
// in Chrome (2026-10-10), the 8px monospace label is 0.55em per character and
// runs 0.9em above its baseline to 0.24em below; the estimate below is wider
// and taller than that on every side.
const CHAR_W = 0.62 * LABEL_FONT_SIZE;
const ASCENT = 0.95 * LABEL_FONT_SIZE;
const DESCENT = 0.3 * LABEL_FONT_SIZE;
// The hull path spans -6..6 by -9..9 before rotation; a 10px radius covers it
// at any angle.
const HULL_R = 10;
// The arrow's stroke and its marker: a 6x6 triangle, ref (3,3), scaled by the
// 1.5 stroke width and turned to the line.
const STROKE = 1.5;

interface Box { x0: number; y0: number; x1: number; y1: number }

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) *
  Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

const boxOf = (pts: number[][]): Box => ({
  x0: Math.min(...pts.map((p) => p[0])),
  y0: Math.min(...pts.map((p) => p[1])),
  x1: Math.max(...pts.map((p) => p[0])),
  y1: Math.max(...pts.map((p) => p[1])),
});

function labelBox(v: ScenarioVesselView): Box | null {
  if (!v.label) return null;
  const w = v.label.length * CHAR_W;
  const base = labelY(v);
  return { x0: v.x - w / 2, x1: v.x + w / 2, y0: base - ASCENT, y1: base + DESCENT };
}

function arrowParts(v: ScenarioVesselView): { head: Box; line: Box } | null {
  if (!v.showArrow) return null;
  const x2 = v.x + v.arrowDx;
  const y2 = v.y + v.arrowDy;
  const len = Math.hypot(v.arrowDx, v.arrowDy);
  const ux = v.arrowDx / len;
  const uy = v.arrowDy / len;
  const pt = ([px, py]: number[]) => [
    x2 + STROKE * ((px - 3) * ux - (py - 3) * uy),
    y2 + STROKE * ((px - 3) * uy + (py - 3) * ux),
  ];
  const line = boxOf([[v.x, v.y], [x2, y2]]);
  return {
    head: boxOf([[0, 0], [6, 3], [0, 6]].map(pt)),
    line: { x0: line.x0 - STROKE / 2, y0: line.y0 - STROKE / 2, x1: line.x1 + STROKE / 2, y1: line.y1 + STROKE / 2 },
  };
}

const hullBox = (v: ScenarioVesselView): Box => ({
  x0: v.x - HULL_R, y0: v.y - HULL_R, x1: v.x + HULL_R, y1: v.y + HULL_R,
});

const QUESTIONS = Object.entries(QUESTION_SCENARIOS) as [string, NonNullable<(typeof QUESTION_SCENARIOS)[string]>][];

describe('scenario labels clear the drawing', () => {
  it('covers all 17 scenario questions', () => {
    expect(QUESTIONS).toHaveLength(17);
  });

  for (const [id, scenario] of QUESTIONS) {
    for (const revealed of [false, true]) {
      it(`${id} (${scenario}, ${revealed ? 'answered' : 'unanswered'})`, () => {
        const { vessels } = buildScenarioView(scenario, revealed);
        const hits: string[] = [];
        vessels.forEach((v, i) => {
          const tb = labelBox(v);
          if (!tb) return;
          // The label fits on the 300 x 280 drawing.
          if (tb.x0 < 0 || tb.x1 > 300 || tb.y0 < 0 || tb.y1 > 280) hits.push(`${v.label}: off the drawing`);
          const own = arrowParts(v);
          if (own && overlap(tb, own.head) > 0) hits.push(`${v.label}: own arrowhead`);
          if (own && overlap(tb, own.line) > 0) hits.push(`${v.label}: own arrow`);
          if (overlap(tb, hullBox(v)) > 0) hits.push(`${v.label}: own hull`);
          vessels.forEach((o, j) => {
            if (j === i) return;
            const theirs = arrowParts(o);
            const ob = labelBox(o);
            if (theirs && overlap(tb, theirs.head) + overlap(tb, theirs.line) > 0) hits.push(`${v.label}: ${o.label || 'other'}'s arrow`);
            if (overlap(tb, hullBox(o)) > 0) hits.push(`${v.label}: ${o.label || 'other'}'s hull`);
            if (ob && overlap(tb, ob) > 0) hits.push(`${v.label}: ${o.label}'s label`);
          });
        });
        expect(hits).toEqual([]);
      });
    }
  }
});

// Every arrow names a marker that exists. The coloured ones used to ask for
// arrow-give-way / arrow-stand-on while the markers were arrow-giveway /
// arrow-standon, so once answered the orange and cyan arrows had no heads.
describe('every scenario arrow has its arrowhead', () => {
  for (const [id, scenario] of QUESTIONS) {
    for (const revealed of [false, true]) {
      it(`${id} (${revealed ? 'answered' : 'unanswered'})`, () => {
        const html = renderToStaticMarkup(createElement(VesselScenario, { scenario, revealed }));
        const defined = [...html.matchAll(/<marker id="([^"]+)"/g)].map((m) => m[1]);
        const used = [...html.matchAll(/marker-end="url\(#([^)]+)\)"/g)].map((m) => m[1]);
        const arrows = buildScenarioView(scenario, revealed).vessels.filter((v) => v.showArrow).length;
        expect(used).toHaveLength(arrows);
        for (const m of used) expect(defined, m).toContain(m);
      });
    }
  }
});
