/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { colourName, countWord } from '../lib/visualA11y';
import { visualDescription } from '../components/VisualPanel';
import { QUESTION_LIGHTS } from '../drills/colregs';
import { LightDisplay, LightName } from '../drills/colregs/components/LightDisplay';

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
