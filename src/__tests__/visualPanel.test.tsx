import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { VisualPanel, hasVisual } from '../components/VisualPanel';
import {
  COLREGS_QUESTIONS,
  COLREGS_QUESTIONS_BY_CATEGORY,
} from '../drills/colregs/constants';
import {
  QUESTION_ANCHORS,
  QUESTION_BUOYS,
  QUESTION_DISTRESS,
  QUESTION_PFDS,
  QUESTION_BOAT_PARTS,
  QUESTION_CLOUDS,
  QUESTION_FLAGS,
} from '../drills/colregs';

// Several categories carry questions that must render with NO picture, and it
// matters: "which anchor suits this bottom?" beside a drawing of the right
// anchor is the answer given away for free, and the same is true of the buoyage
// questions about what the system MEANS rather than what a mark looks like.
//
// The drill draws the panel as `{hasVisual(current.id) && <VisualPanel …/>}`,
// so the two have to agree question by question: if hasVisual says yes and the
// panel draws nothing, the quiz grid reserves an empty diagram column; if it
// says no, a mapped question loses its picture. This walks the whole bank and
// pins both directions at once.

function markup(questionId: string, revealed = false): string {
  return renderToStaticMarkup(<VisualPanel questionId={questionId} revealed={revealed} />);
}

describe('the visual panel and the diagram maps agree', () => {
  it('never claims a visual it does not draw, or draws one it did not claim', () => {
    const disagreed = COLREGS_QUESTIONS.filter(
      q => hasVisual(q.id) !== (markup(q.id).length > 0)
    ).map(q => q.id);
    expect(disagreed).toEqual([]);
  });

  it('draws literally nothing for a question with no diagram entry', () => {
    const undiagrammed = COLREGS_QUESTIONS.filter(q => !hasVisual(q.id));
    // Guard against the whole bank quietly becoming diagrammed, which would
    // make the assertion below vacuous.
    expect(undiagrammed.length).toBeGreaterThan(50);
    for (const q of undiagrammed) {
      expect(markup(q.id)).toBe('');
      // Answering a question cannot conjure a picture either - only the
      // scenario diagram reads `revealed`, and it is behind a mapping too.
      expect(markup(q.id, true)).toBe('');
    }
  });
});

// The bottom-matching questions are the reason the anchor map stops at an-05.
// Written out by hand rather than derived, so deleting the map entries is not
// a way to make this pass.
describe('questions that must stay undiagrammed', () => {
  const cases: Array<[string, string[], Partial<Record<string, unknown>>]> = [
    // "Which anchor for this bottom?" - an-01..an-05 are the identification
    // questions and keep their silhouettes.
    ['anchor bottom-matching', ['an-06', 'an-07', 'an-08', 'an-09', 'an-10', 'an-11', 'an-12', 'an-13'], QUESTION_ANCHORS],
    // How the lateral and cardinal systems work, not what one mark looks like -
    // and, from by-23 on, how far to trust a buoy, which way to steer off a
    // range, what a river-mile board counts, and what an orange shape on a
    // white mark says. A photograph of a regulatory mark would print its own
    // answer inside the shape.
    [
      'buoyage system rules',
      ['by-03', 'by-08', 'by-10', 'by-13', 'by-16', 'by-17', 'by-18', 'by-23', 'by-25', 'by-26', 'by-28', 'by-29', 'by-30'],
      QUESTION_BUOYS,
    ],
    // Annex IV signals with no drawable form - a gun at intervals, a spoken
    // Mayday, an EPIRB alert.
    ['undrawable distress signals', ['di-09', 'di-10', 'di-11', 'di-12', 'di-13', 'di-14', 'di-15', 'di-16'], QUESTION_DISTRESS],
    // Carriage rules and servicing, not "identify this device".
    ['PFD regulation questions', ['pf-06', 'pf-07', 'pf-08', 'pf-09', 'pf-10', 'pf-11', 'pf-12', 'pf-13', 'pf-14', 'pf-15', 'pf-16'], QUESTION_PFDS],
    // Rope terms and helm orders - nothing on the hull to highlight.
    ['rope terms and helm orders', ['dk-14', 'dk-20', 'dk-27'], QUESTION_BOAT_PARTS],
    // Beaufort forces are numbers and wind shifts are movements over time -
    // neither is drawable. wx-19 asks WHICH form is the dangerous one, so a
    // picture of the dangerous one would hand it over.
    // The meaning-to-flag direction: sf-19 and sf-20 name the meaning and ask
    // which flag, so drawing the flag hands the answer over. sf-16 and sf-17
    // are about how the Code works rather than about any one flag.
    ['how the Code works, and meaning-to-flag', ['sf-16', 'sf-17', 'sf-18', 'sf-19', 'sf-20'], QUESTION_FLAGS],
    ['Beaufort forces and the wind shift', ['wx-01', 'wx-08', 'wx-18', 'wx-19', 'wx-23', 'wx-24'], QUESTION_CLOUDS],
  ];

  for (const [name, ids, map] of cases) {
    it(`${name} render no picture`, () => {
      for (const id of ids) {
        expect(map[id]).toBeUndefined();
        expect(hasVisual(id)).toBe(false);
        expect(markup(id)).toBe('');
      }
    });
  }
});

// Tides is the one live category with no diagram anywhere in it, and that is a
// decision rather than a gap: every question on it is about something that
// happens over hours - water rising, a stream turning, a range widening across
// a fortnight - and the only way to draw that is a curve with labelled axes,
// which is a picture of a graph and not of the sea. An arrow captioned "flood"
// would simply be ti-16's answer printed beside it.
describe('the tides card stays text-only', () => {
  it('has no question carrying a picture', () => {
    const tides = COLREGS_QUESTIONS_BY_CATEGORY['tides'];
    expect(tides.length).toBeGreaterThan(0);
    expect(tides.filter((q) => hasVisual(q.id)).map((q) => q.id)).toEqual([]);
  });
});
