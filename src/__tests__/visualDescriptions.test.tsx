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
