/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { colourName, countWord } from '../lib/visualA11y';
import { visualDescription } from '../components/VisualPanel';
import { QUESTION_LIGHTS, QUESTION_SHAPES, DayShapeSpec } from '../drills/colregs';
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
