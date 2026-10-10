/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { colourName, countWord } from '../lib/visualA11y';
import { visualDescription } from '../components/VisualPanel';
import {
  QUESTION_LIGHTS,
  QUESTION_SHAPES,
  QUESTION_SOUNDS,
  QUESTION_SOUND_GAPS,
  QUESTION_VISUAL_AFTER_ANSWER,
  DayShapeSpec,
} from '../drills/colregs';
import { SoundSignalDisplay, BlastMark } from '../drills/colregs/components/SoundSignalDisplay';
import { VesselProfile, VesselTypeName } from '../drills/colregs/components/VesselProfile';
import { QUESTION_VESSEL_TYPES, QUESTION_SCENARIOS } from '../drills/colregs';
import { VesselScenario, ScenarioType } from '../drills/colregs/components/VesselScenario';
import { BuoyDisplay, BuoyName, BUOY_IMAGES } from '../drills/colregs/components/BuoyDisplay';
import { QUESTION_BUOYS, QUESTION_FLAGS } from '../drills/colregs';
import { SignalFlagDisplay, FlagName } from '../drills/colregs/components/SignalFlagDisplay';
import { DistressDisplay, DistressSignalName, DISTRESS_IMAGES } from '../drills/colregs/components/DistressDisplay';
import { QUESTION_DISTRESS, QUESTION_PFDS } from '../drills/colregs';
import { PfdDisplay, PfdFormName, PFD_IMAGES } from '../drills/colregs/components/PfdDisplay';
import { LightDisplay, LightName } from '../drills/colregs/components/LightDisplay';
import { DayShapeDisplay } from '../drills/colregs/components/DayShapeDisplay';

// Every drawn visual's text equivalent is generated from the data that draws
// it (src/lib/visualA11y.ts). These tests hold each generator to the PICTURE:
// they render the drawing, read what is actually painted - which elements,
// how many, what colour, in what order - and check the description says the
// same. A generator that miscounts, or a drawing that stops following its own
// data, fails here. One question per type is also pinned word for word, so a
// change to the data shows up as a changed sentence someone has to read.
//
// Whether a description gives away its answer is the other half, and lives
// with the rest of the leak guards in answerA11y.test.tsx.

afterEach(cleanup);

const entries = <T,>(m: Partial<Record<string, T>>) => Object.entries(m) as [string, T][];

// The hex a fill is painted with, whether set as an attribute or inline.
const fillOf = (el: Element) => el.getAttribute('fill') ?? '';
const num = (el: Element, a: string) => Number(el.getAttribute(a));

describe('lights', () => {
  it('has a description for every lights question', () => {
    for (const [id] of entries(QUESTION_LIGHTS)) expect(visualDescription(id, false), id).toBeTruthy();
  });

  it('names every lit light in the drawing, with its colour and side, bow to stern', () => {
    for (const [id, active] of entries<LightName[]>(QUESTION_LIGHTS)) {
      const { container } = render(<LightDisplay active={active} />);
      // A lit light is drawn at r 5.5 in its colour; an unlit position at 3.5.
      const lit = [...container.querySelectorAll('circle[r="5.5"]')].sort(
        (a, b) => num(a, 'cy') - num(b, 'cy') || num(a, 'cx') - num(b, 'cx')
      );
      cleanup();
      const drawn = lit.map(c => {
        const cx = num(c, 'cx');
        const side = cx < 90 ? 'port side' : cx > 110 ? 'starboard side' : 'centreline';
        return `${colourName(fillOf(c))} light on the ${side}`;
      });

      const description = visualDescription(id, false)!;
      const said = [...description.matchAll(/\ban? (\w+) light on the (port side|starboard side|centreline)/g)].map(
        m => `${m[1]} light on the ${m[2]}`
      );
      expect(said, id).toEqual(drawn);
      const count = lit.length === 1 ? 'One light is lit' : `${countWord(lit.length)} lights are lit`;
      expect(description.toLowerCase(), id).toContain(count.toLowerCase());
    }
  });

  it('reads nl-21 as written', () => {
    expect(visualDescription('nl-21', false)).toBe(
      'Seen from above, bow at the top. Four lights are lit, from bow to stern: ' +
        'a white light on the centreline, forward, shining from just abaft the port beam, past dead ahead, round to just abaft the starboard beam; ' +
        'a red light on the port side, near the middle, shining from just abaft the port beam round to dead ahead; ' +
        'a green light on the starboard side, near the middle, shining from dead ahead round to just abaft the starboard beam; ' +
        'a white light on the centreline, at the stern, shining from just abaft the starboard beam, past dead astern, round to just abaft the port beam. ' +
        'The remaining light positions are drawn dark.'
    );
  });
});

// The day shapes a drawing actually paints, read off its geometry rather than
// off the data: a circle of r 8.5 is a ball, a four-point polygon a diamond,
// a three-point polygon a cone (apex up when its base is the lower edge), and
// a rect with rx 2.5 the body of a cylinder. Returned top to bottom.
interface PaintedShape { word: string; cx: number; cy: number }
function paintedShapes(root: Element): PaintedShape[] {
  const out: PaintedShape[] = [];
  for (const el of root.querySelectorAll('circle[r="8.5"], polygon, rect[rx="2.5"]')) {
    if (el.tagName === 'circle') {
      out.push({ word: 'ball', cx: num(el, 'cx'), cy: num(el, 'cy') });
    } else if (el.tagName === 'rect') {
      out.push({ word: 'cylinder', cx: num(el, 'x') + 8, cy: num(el, 'y') + 10 });
    } else {
      const pts = (el.getAttribute('points') ?? '').trim().split(/\s+/).map(p => p.split(',').map(Number));
      const ys = pts.map(p => p[1]);
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      if (pts.length === 4) out.push({ word: 'diamond', cx, cy });
      else {
        const maxY = Math.max(...ys);
        const onBase = ys.filter(y => y === maxY).length;
        out.push({ word: onBase === 2 ? 'cone with its apex up' : 'cone with its apex down', cx, cy });
      }
    }
  }
  return out.sort((a, b) => a.cy - b.cy || a.cx - b.cx);
}

describe('day shapes', () => {
  it('has a description for every day-shape question', () => {
    for (const [id] of entries(QUESTION_SHAPES)) expect(visualDescription(id, false), id).toBeTruthy();
  });

  it('names every shape the drawing paints, top to bottom, with the count', () => {
    for (const [id, spec] of entries<DayShapeSpec>(QUESTION_SHAPES)) {
      const { container } = render(
        <DayShapeDisplay shapes={spec.shapes} position={spec.position} arrangement={spec.arrangement} />
      );
      const painted = paintedShapes(container);
      cleanup();
      const description = visualDescription(id, false)!;

      if (spec.arrangement === 'yardarm') {
        // One at the masthead, the rest level with each other either side.
        const [top, ...ends] = painted;
        expect(description, id).toContain(`a ${top.word} at the top of the mast`);
        const left = ends.find(e => e.cx < top.cx)!;
        const right = ends.find(e => e.cx > top.cx)!;
        expect(description, id).toContain(`a ${left.word} at the left end of the crossbar`);
        expect(description, id).toContain(`a ${right.word} at the right end of the crossbar`);
      } else {
        const list = /top to bottom: (.*)\.$/.exec(description)?.[1] ?? /shown on it: (.*)\.$/.exec(description)?.[1];
        const said = (list ?? '').split(/, | and /).filter(Boolean);
        expect(said, id).toEqual(painted.map(p => p.word));
      }
      const count = painted.length === 1 ? 'one black shape' : `${countWord(painted.length)} shapes, all black`;
      expect(description.toLowerCase(), id).toContain(count);
    }
  });

  it('reads ds-07 as written', () => {
    expect(visualDescription('ds-07', false)).toBe(
      'Seen from above, bow at the top, with one mast labelled Fore Mast. ' +
        'Three shapes, all black, are shown on it in a vertical line, from top to bottom: ball, ball and ball.'
    );
  });
});

// The marks a sound diagram paints, left to right, read off the SVG: every
// mark is a rect of height 16 on the axis. 16 wide is a short blast, 62 a
// prolonged one, and 3.2 a tick - nine ticks at close spacing are the rapid
// ringing, a tick standing apart is one stroke.
function paintedMarks(root: Element): BlastMark[] {
  const rects = [...root.querySelectorAll('rect[height="16"]')]
    .map(r => ({ x: num(r, 'x'), w: num(r, 'width') }))
    .sort((a, b) => a.x - b.x);
  const out: BlastMark[] = [];
  let i = 0;
  while (i < rects.length) {
    const { w } = rects[i];
    if (w === 16) { out.push('short'); i += 1; continue; }
    if (w === 62) { out.push('prolonged'); i += 1; continue; }
    let j = i + 1;
    while (j < rects.length && rects[j].w === rects[i].w && rects[j].x - rects[j - 1].x < 10) j += 1;
    if (j - i === 9) out.push('bell');
    else for (let k = i; k < j; k += 1) out.push('stroke');
    i = j;
  }
  return out;
}

// "two prolonged blasts, then one short blast" -> the marks it names, in order.
const NUMBER = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
function marksSaid(description: string): BlastMark[] {
  const list = /read left to right: (.*?)(, with a gap|\. Key)/.exec(description)?.[1] ?? '';
  return list.split(', then ').flatMap(phrase => {
    const [n, ...rest] = phrase.split(' ');
    const words = rest.join(' ');
    const mark: BlastMark = words.startsWith('short')
      ? 'short'
      : words.startsWith('prolonged')
        ? 'prolonged'
        : words.startsWith('rapid')
          ? 'bell'
          : 'stroke';
    return Array<BlastMark>(NUMBER.indexOf(n)).fill(mark);
  });
}

describe('sound signals', () => {
  const before = entries<BlastMark[]>(QUESTION_SOUNDS).filter(([id]) => !QUESTION_VISUAL_AFTER_ANSWER.has(id));

  it('has a description for every sound question shown before an answer, and none for the held-back ones', () => {
    for (const [id] of before) expect(visualDescription(id, false), id).toBeTruthy();
    for (const id of QUESTION_VISUAL_AFTER_ANSWER) {
      expect(visualDescription(id, false), id).toBeNull();
      expect(visualDescription(id, true), id).toBeTruthy();
    }
  });

  it('names every mark the diagram paints, in order, and only the legend it prints', () => {
    for (const [id, sequence] of entries<BlastMark[]>(QUESTION_SOUNDS)) {
      const gap = QUESTION_SOUND_GAPS[id];
      const { container } = render(<SoundSignalDisplay sequence={sequence} gapS={gap} />);
      const painted = paintedMarks(container);
      const legend = [...container.querySelectorAll('text')].map(t => t.textContent ?? '').join(' ');
      cleanup();
      const description = visualDescription(id, QUESTION_VISUAL_AFTER_ANSWER.has(id))!;
      expect(marksSaid(description), id).toEqual(painted);
      expect(description.includes('short blast, 1 second'), id).toBe(legend.includes('short 1s'));
      expect(description.includes('prolonged blast, 4 to 6 seconds'), id).toBe(legend.includes('prolonged 4-6s'));
      expect(description.includes('rapid ringing, 5 seconds'), id).toBe(legend.includes('rapid bell 5s'));
      expect(description.includes('with a gap of about'), id).toBe(gap !== undefined && gap !== 1);
    }
  });

  it('reads ss-15 as written', () => {
    expect(visualDescription('ss-15', false)).toBe(
      'Marks along a time line, read left to right: three strokes on the bell, then one rapid ringing of the bell, ' +
        'then three strokes on the bell. Key: rapid ringing, 5 seconds; one stroke, a single upright tick. ' +
        'A Play button below sounds the signal.'
    );
  });
});

// The list after "from top to bottom:" or after the colon of a single shape.
function shapesSaid(description: string): string[] {
  const many = /from top to bottom: (.*?)\./.exec(description)?.[1];
  const one = /shape hangs near the top of the mast: (.*?)\./.exec(description)?.[1];
  const list = many ?? one;
  return list ? list.split(/, | and /) : [];
}

describe('vessel profiles', () => {
  it('has a description for every vessel-type question', () => {
    for (const [id] of entries(QUESTION_VESSEL_TYPES)) expect(visualDescription(id, false), id).toBeTruthy();
  });

  it('names the shapes the profile paints, top to bottom, and only the rig and gear it draws', () => {
    for (const [id, type] of entries<VesselTypeName>(QUESTION_VESSEL_TYPES)) {
      const { container } = render(<VesselProfile type={type} />);
      const painted = paintedShapes(container).map(s => s.word);
      const sails = container.querySelector('g[fill="rgba(203,213,225,0.13)"]') !== null;
      const trailing = container.querySelector('path[stroke-dasharray="2 2"]') !== null;
      const secondHull = container.querySelector('path[opacity="0.75"]') !== null;
      cleanup();
      const description = visualDescription(id, false)!;
      expect(shapesSaid(description), id).toEqual(painted);
      expect(description.includes('No shapes'), id).toBe(painted.length === 0);
      expect(description.includes('sails are set'), id).toBe(sails);
      expect(description.includes('lines trail'), id).toBe(trailing);
      expect(description.includes('second, smaller hull'), id).toBe(secondHull);
    }
  });

  it('reads vt-02 as written', () => {
    expect(visualDescription('vt-02', false)).toBe(
      'Side view of a hull on the water, with one mast near the middle. Three shapes, all black, hang in a ' +
        'vertical line on the mast, from top to bottom: ball, diamond and ball.'
    );
  });
});

// Each vessel a scenario diagram paints: its hull's translate and rotate, its
// label text, and its course arrow if it has one, read off the SVG.
const SECTORS = [
  'up the page', 'up and to the right', 'to the right', 'down and to the right',
  'down the page', 'down and to the left', 'to the left', 'up and to the left',
];
const sector = (deg: number) => SECTORS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

interface PaintedVessel { x: number; y: number; label: string; heading: string; arrow: boolean }
function paintedVessels(root: Element): PaintedVessel[] {
  const out: PaintedVessel[] = [];
  for (const hull of root.querySelectorAll('g[transform^="translate"]')) {
    const m = /translate\(([-\d.]+), ([-\d.]+)\) rotate\(([-\d.]+)\)/.exec(hull.getAttribute('transform') ?? '')!;
    const group = hull.parentElement!;
    const line = group.querySelector('line');
    const heading = line
      ? sector((Math.atan2(num(line, 'x2') - num(line, 'x1'), -(num(line, 'y2') - num(line, 'y1'))) * 180) / Math.PI)
      : sector(Number(m[3]));
    out.push({
      x: Number(m[1]),
      y: Number(m[2]),
      label: group.querySelector('text')?.textContent ?? '',
      heading,
      arrow: line !== null,
    });
  }
  return out.sort((a, b) => a.y - b.y || a.x - b.x);
}

function vesselsSaid(description: string) {
  const list = /from top to bottom: (.*?)\.(?: A key| Caption|$)/.exec(description)?.[1] ?? '';
  return list.split('; ').map(seg => {
    const m = /^(?:a vessel labelled (.+?)|an unlabelled vessel) at the .+?, (?:with an arrow pointing (.+)|pointing (.+), with no arrow)$/.exec(seg);
    if (!m) throw new Error(`unparsed vessel: ${seg}`);
    return { label: m[1] ?? '', heading: m[2] ?? m[3], arrow: m[2] !== undefined };
  });
}

describe('scenarios', () => {
  it('has a description for every scenario question, before and after the answer', () => {
    for (const [id] of entries(QUESTION_SCENARIOS)) {
      expect(visualDescription(id, false), id).toBeTruthy();
      expect(visualDescription(id, true), id).toBeTruthy();
    }
  });

  it('names every vessel the diagram paints, top to bottom, with its label and heading', () => {
    for (const [id, scenario] of entries<ScenarioType>(QUESTION_SCENARIOS)) {
      for (const revealed of [false, true]) {
        const { container } = render(<VesselScenario scenario={scenario} revealed={revealed} />);
        const painted = paintedVessels(container);
        const caption = container.querySelector('p')?.textContent ?? null;
        cleanup();
        const description = visualDescription(id, revealed)!;
        const said = vesselsSaid(description);
        expect(said, `${id} revealed=${revealed}`).toEqual(
          painted.map(p => ({ label: p.label, heading: p.heading, arrow: p.arrow }))
        );
        // The caption states the outcome: only once it is drawn.
        expect(caption === null ? !description.includes('Caption:') : description.endsWith(`Caption: ${caption}`), id).toBe(true);
        expect(description.includes('same grey'), id).toBe(!revealed);
      }
    }
  });

  it('reads vh-03 as written', () => {
    expect(visualDescription('vh-03', false)).toBe(
      'Seen from above. Two vessels, both drawn in the same grey, from top to bottom: ' +
        'a vessel labelled Other at the middle right, with an arrow pointing to the left; ' +
        'a vessel labelled Own at the bottom left, with an arrow pointing up the page.'
    );
  });
});

// A drawn mark read off the SVG: the outline path's shape, the band fills top
// to bottom, the topmark cones and which way each points, and the badge.
function pointsOf(d: string): number[][] {
  const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const pts: number[][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}
function paintedMark(root: Element) {
  const outline = pointsOf(root.querySelector('path[fill="none"]')?.getAttribute('d') ?? '');
  let body: string;
  if (outline.length === 8) body = 'a broad, squat base with a tall narrow column';
  else {
    const top = Math.min(...outline.map(p => p[1]));
    const base = Math.max(...outline.map(p => p[1]));
    const width = (y: number) => {
      const xs = outline.filter(p => p[1] === y).map(p => p[0]);
      return Math.max(...xs) - Math.min(...xs);
    };
    body = width(top) < width(base) ? 'a tapered body' : 'a straight-sided, flat-topped round body';
  }
  const bands = [...root.querySelectorAll('g[clip-path] rect')]
    .sort((a, b) => num(a, 'y') - num(b, 'y'))
    .map(r => colourName(fillOf(r)));
  const cones = [...root.querySelectorAll('polygon')]
    .filter(p => colourName(fillOf(p)) === 'black')
    .map(p => {
      const pts = pointsOf(p.getAttribute('points') ?? '');
      const ys = pts.map(q => q[1]);
      const apex = pts.find(q => ys.filter(y => y === q[1]).length === 1)!;
      return { y: Math.min(...ys), up: apex[1] === Math.min(...ys) };
    })
    .sort((a, b) => a.y - b.y);
  // The badge is stuck on the face, outside the clipped paintwork, so a
  // yellow band is not mistaken for one.
  const yellow = [...root.querySelectorAll('rect, polygon')].find(
    e => !e.closest('g[clip-path]') && colourName(fillOf(e)) === 'yellow'
  );
  const badge = yellow ? (yellow.tagName === 'rect' ? 'square' : 'triangle') : null;
  return { body, bands, cones, badge };
}

describe('buoys (the drawn marks)', () => {
  const drawn = entries<BuoyName>(QUESTION_BUOYS).filter(([, b]) => !(b in BUOY_IMAGES));

  it('describes every drawn mark, and leaves the photographs to their alt text', () => {
    expect(drawn.length).toBeGreaterThan(0);
    for (const [id, buoy] of entries<BuoyName>(QUESTION_BUOYS)) {
      expect(visualDescription(id, false) === null, id).toBe(buoy in BUOY_IMAGES);
    }
  });

  it('gives the body, the bands top to bottom, the topmark and the badge the drawing paints', () => {
    for (const [id, buoy] of drawn) {
      const { container } = render(<BuoyDisplay type={buoy} />);
      const mark = paintedMark(container);
      cleanup();
      const d = visualDescription(id, false)!;
      expect(d, id).toContain(mark.body);
      expect(d, id).toContain(
        mark.bands.length === 1 ? `painted all ${mark.bands[0]}` : `from top to bottom: ${mark.bands.slice(0, -1).join(', ')} and ${mark.bands[mark.bands.length - 1]}`
      );
      if (mark.cones.length === 0) expect(d, id).toContain('Nothing is mounted on top');
      else {
        expect(mark.cones, id).toHaveLength(2);
        const [upper, lower] = mark.cones;
        expect(d, id).toContain(
          upper.up && lower.up ? 'both pointing up' : !upper.up && lower.up ? 'the upper pointing down and the lower pointing up' : 'UNDESCRIBED'
        );
      }
      expect(d.includes('yellow triangle'), id).toBe(mark.badge === 'triangle');
      expect(d.includes('yellow square'), id).toBe(mark.badge === 'square');
    }
  });

  it('reads by-07 as written', () => {
    expect(visualDescription('by-07', false)).toBe(
      'Side view of a buoy: a broad, squat base with a tall narrow column standing on it, painted in three ' +
        'horizontal bands, from top to bottom: yellow, black and yellow. On a short staff on top, two black cones, ' +
        'one above the other, the upper pointing down and the lower pointing up, so their points meet.'
    );
  });
});

// A flag read back off its SVG: the outline (a swallowtail has five corners),
// what kind of field is painted through the clip, and its colours in the order
// a reader takes them - top to bottom, hoist to fly, ground before charge.
const COLOUR_WORD = /\b(red|blue|yellow|black|white|green|orange)\b/g;
function paintedFlag(root: Element): { swallowtail: boolean; kind: string; colours: string[] } {
  const outline = pointsOf(root.querySelector('path[fill="none"]')?.getAttribute('d') ?? '');
  const field = root.querySelector('g[clip-path]')!;
  const rects = [...field.querySelectorAll('rect')];
  const polys = [...field.querySelectorAll('polygon')];
  const circle = field.querySelector('circle');
  const cross = field.querySelector('g[stroke]');
  const c = (el: Element) => colourName(fillOf(el));
  const swallowtail = outline.length === 5;

  if (cross) return { swallowtail, kind: 'diagonal cross', colours: [c(rects[0]), colourName(cross.getAttribute('stroke')!)] };
  if (circle) return { swallowtail, kind: 'circle', colours: [c(rects[0]), c(circle)] };
  if (polys.length === 1) return { swallowtail, kind: 'diamond', colours: [c(rects[0]), c(polys[0])] };
  if (polys.length === 2) {
    // The upper triangle is the one with two corners on the top edge.
    const topY = Math.min(...polys.flatMap(p => pointsOf(p.getAttribute('points')!).map(q => q[1])));
    const onTop = (p: Element) => pointsOf(p.getAttribute('points')!).filter(q => q[1] === topY).length;
    const [upper, lower] = [...polys].sort((a, b) => onTop(b) - onTop(a));
    return { swallowtail, kind: 'diagonally', colours: [c(upper), c(lower)] };
  }
  if (rects.length === 1) return { swallowtail, kind: 'plain', colours: [c(rects[0])] };
  if (rects.length === 2 && num(rects[1], 'width') < num(rects[0], 'width') && num(rects[1], 'height') < num(rects[0], 'height')) {
    return { swallowtail, kind: 'square', colours: [c(rects[0]), c(rects[1])] };
  }
  // Stripes run the full length of the flag (128 wide) or its full depth (88
  // high); a chequerboard's squares do neither.
  if (rects.every(r => num(r, 'width') >= 128)) {
    return { swallowtail, kind: 'horizontal', colours: rects.sort((a, b) => num(a, 'y') - num(b, 'y')).map(c) };
  }
  if (rects.every(r => num(r, 'height') >= 88)) {
    return { swallowtail, kind: 'vertical', colours: rects.sort((a, b) => num(a, 'x') - num(b, 'x')).map(c) };
  }
  // A chequerboard: its two colours, then the one in the top hoist corner.
  const first = rects.reduce((a, b) => (num(b, 'x') + num(b, 'y') < num(a, 'x') + num(a, 'y') ? b : a));
  const other = rects.find(r => c(r) !== c(first))!;
  return { swallowtail, kind: 'chequerboard', colours: [c(first), c(other), c(first)] };
}

describe('signal flags', () => {
  it('has a description for every flag question', () => {
    for (const [id] of entries(QUESTION_FLAGS)) expect(visualDescription(id, false), id).toBeTruthy();
  });

  it('gives the outline, the kind of field and its colours in the order the flag paints them', () => {
    for (const [id, flag] of entries<FlagName>(QUESTION_FLAGS)) {
      const { container } = render(<SignalFlagDisplay flag={flag} />);
      const painted = paintedFlag(container);
      cleanup();
      const d = visualDescription(id, false)!;
      expect(d.includes('swallow-tailed'), id).toBe(painted.swallowtail);
      expect(d, id).toContain(painted.kind);
      // The colour words after the outline, in order.
      const field = d.slice(d.indexOf(painted.swallowtail ? 'at the fly,' : 'rectangular flag,'));
      expect(field.match(COLOUR_WORD), id).toEqual(painted.colours);
    }
  });

  it('reads sf-01 as written', () => {
    expect(visualDescription('sf-01', false)).toBe(
      'One flag flying from a halyard on the left, so the hoist is on the left: a swallow-tailed flag, cut into ' +
        'two points at the fly, divided into vertical halves: white at the hoist, blue at the fly.'
    );
  });
});

// The countable parts of each drawn signal, read off its SVG.
const RED_CORE = '#d8382c';
function paintedSignal(signal: DistressSignalName, root: Element): string[] {
  const svg = root.querySelector('svg')!;
  const reds = [...svg.querySelectorAll('circle')].filter(c => fillOf(c) === RED_CORE);
  switch (signal) {
    case 'parachute-flare':
      return [`${countWord(svg.querySelectorAll('line').length)} lines`, `one bright red light`].filter(() => reds.length === 1);
    case 'star-rocket': {
      const streaks = svg.querySelectorAll(`g[stroke="${RED_CORE}"] line`).length;
      return [`${countWord(reds.length)} separate bright red lights`, `${countWord(streaks)} short red streaks`];
    }
    case 'flag-nc': {
      // Painted rects only (each flag's border is fill="none"): the checks are
      // narrower than the flag, the stripes run its full 76 width.
      const painted = [...svg.querySelectorAll('rect')].filter(r => fillOf(r) !== 'none');
      const checks = painted.filter(r => num(r, 'width') < 76);
      const stripes = painted.filter(r => num(r, 'width') === 76).sort((a, b) => num(a, 'y') - num(b, 'y'));
      const side = Math.round(Math.sqrt(checks.length));
      const colours = [...new Set(checks.map(r => colourName(fillOf(r))))];
      return [
        `${countWord(side)} by ${countWord(side)} squares, alternating ${colours[0]} and ${colours[1]}`,
        `${countWord(stripes.length)} horizontal stripes, from top to bottom: ` +
          `${stripes.slice(0, -1).map(r => colourName(fillOf(r))).join(', ')} and ${colourName(fillOf(stripes[stripes.length - 1]))}`,
      ];
    }
    case 'flag-and-ball': {
      const ball = svg.querySelector('circle')!;
      const flag = svg.querySelector('rect')!;
      return [`The round shape is ${num(ball, 'cy') < num(flag, 'y') ? 'above' : 'beneath'} the flag`];
    }
    case 'arms': {
      const lowered = svg.querySelectorAll('g[opacity="0.45"] line').length;
      const curves = svg.querySelectorAll('path[stroke-dasharray="4 4"]').length;
      return [lowered === 2 ? 'second pair of arms is drawn lowered' : 'UNMATCHED', `${countWord(curves)} dashed curves`];
    }
    case 'flames': {
      const inner = svg.querySelectorAll(`g[fill="${RED_CORE}"] path`).length;
      return [`${capitalise(countWord(inner))} flames, red inside orange`];
    }
    default:
      return [];
  }
}
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

describe('distress signals (the drawn ones)', () => {
  const drawn = entries<DistressSignalName>(QUESTION_DISTRESS).filter(([, s]) => !(s in DISTRESS_IMAGES));

  it('describes every drawn signal, and leaves the photographs to their alt text', () => {
    expect(drawn.length).toBeGreaterThan(0);
    for (const [id, s] of entries<DistressSignalName>(QUESTION_DISTRESS)) {
      expect(visualDescription(id, false) === null, id).toBe(s in DISTRESS_IMAGES);
    }
  });

  it('counts and colours what the drawing paints', () => {
    for (const [id, signal] of drawn) {
      const { container } = render(<DistressDisplay signal={signal} />);
      const expected = paintedSignal(signal, container);
      cleanup();
      expect(expected.length, id).toBeGreaterThan(0);
      const d = visualDescription(id, false)!;
      for (const part of expected) expect(d, id).toContain(part);
    }
  });

  it('reads di-05 as written', () => {
    expect(visualDescription('di-05', false)).toBe(
      'Two flags on one halyard, one above the other. The upper flag is a chequerboard of four by four squares, ' +
        'alternating blue and white. The lower flag has five horizontal stripes, from top to bottom: blue, white, ' +
        'red, white and blue.'
    );
  });
});

// The countable parts of each drawn device, read off its SVG. The foam is one
// colour; straps are drawn in STRAP, a light grey, as lines or open paths.
const FOAM = '#b95f31';
const STRAP_STROKE = 'rgba(203,213,225,0.8)';
function paintedPfd(form: PfdFormName, root: Element): string[] {
  const svg = root.querySelector('svg')!;
  const foamColour = colourName(FOAM);
  const foam = [...svg.querySelectorAll('path, rect')].filter(e => fillOf(e) === FOAM);
  const strapGroup = svg.querySelector(`g[stroke="${STRAP_STROKE}"]`);
  switch (form) {
    case 'offshore-vest':
      // The collar, then the chest panels.
      return [
        `${foamColour} foam`,
        `${countWord(foam.length - 1)} thick chest panels`,
        `${countWord(strapGroup!.querySelectorAll('line').length)} straps`,
      ];
    case 'throwable-cushion':
      return [`square ${foamColour} pad`, `${countWord(strapGroup!.querySelectorAll('path').length)} looped straps`];
    case 'inflatable': {
      const shoulders = strapGroup!.querySelectorAll('path').length;
      const waist = strapGroup!.querySelectorAll('line').length;
      const cylinder = svg.querySelector('rect[rx="6"]') !== null;
      const tab = svg.querySelector('circle') !== null;
      return [
        `${foamColour} panel`,
        `${countWord(shoulders)} straps over the shoulders`,
        waist === 1 ? 'one round the waist' : 'UNMATCHED',
        cylinder && tab ? 'small dark cylinder sits low on the right with a pull tab' : 'UNMATCHED',
      ];
    }
    default:
      return [];
  }
}

describe('PFDs (the drawn ones)', () => {
  const drawn = entries<PfdFormName>(QUESTION_PFDS).filter(([, f]) => !(f in PFD_IMAGES));

  it('describes every drawn device, and leaves the photographs to their alt text', () => {
    expect(drawn.length).toBeGreaterThan(0);
    for (const [id, f] of entries<PfdFormName>(QUESTION_PFDS)) {
      expect(visualDescription(id, false) === null, id).toBe(f in PFD_IMAGES);
    }
  });

  it('counts the panels, straps and fittings the drawing paints', () => {
    for (const [id, form] of drawn) {
      const { container } = render(<PfdDisplay form={form} />);
      const expected = paintedPfd(form, container);
      cleanup();
      expect(expected.length, id).toBeGreaterThan(0);
      const d = visualDescription(id, false)!;
      for (const part of expected) expect(d, id).toContain(part);
    }
  });

  it('reads pf-01 as written', () => {
    expect(visualDescription('pf-01', false)).toBe(
      'A wearable piece of orange foam, seen from the front: a deep collar curving up behind where the head ' +
        'would be, and below it two thick chest panels, joined across the front by two straps.'
    );
  });
});
