// @vitest-environment jsdom
import React, { act } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';
import ColregsDrill, { getPool } from '../drills/colregs';
import CompassDrill from '../drills/compass';
import { ColregsCategory } from '../drills/colregs/constants';
import { COMPASS_POINTS } from '../drills/compass/constants';
import { PrefsProvider } from '../lib/prefs';
import { DEFAULT_PLAN, SessionPlan, planQueue } from '../lib/session';
import { Progress, isWeakItem } from '../lib/progress';

// A weak-spot run is for the questions you keep getting wrong, so it asks
// those first, weakest first, and only then tops up from the rest of the
// pool. Someone who stops after three questions has had the three weakest.
//
// The queue convention behind it: a queue is played FRONT-FIRST - index 0
// is asked first - in both drills and every run type. The builder
// (planQueue) puts what matters at the front and a count cuts from the back,
// so a player that read from the end asked the weak ones last.

// The shuffle, made a no-op on demand by the front-first tests below.
let identityShuffle = false;
vi.mock('../lib/shuffle', async (importOriginal) => {
  const real = await importOriginal<typeof import('../lib/shuffle')>();
  return { shuffle: <T,>(items: readonly T[]): T[] => (identityShuffle ? [...items] : real.shuffle(items)) };
});

const STORE = 'nauticalmaster:charttable:progress';

// Weakest first is lowest accuracy first; between equals, the one answered
// more often (more evidence it is weak).
const LIGHTS: Record<string, { answered: number; correct: number }> = {
  'nl-05': { answered: 4, correct: 0 }, //  0%
  'nl-02': { answered: 4, correct: 1 }, // 25%
  'nl-09': { answered: 3, correct: 1 }, // 33%
  'nl-01': { answered: 5, correct: 2 }, // 40%
  // Answered, but not weak: these must not jump the queue.
  'nl-03': { answered: 4, correct: 4 },
  'nl-04': { answered: 4, correct: 2 }, // 50% - missed as often as right is not weak
};
const LIGHTS_WEAKEST_FIRST = ['nl-05', 'nl-02', 'nl-09', 'nl-01'];

function seedLedger(items: Progress['items']) {
  localStorage.setItem(STORE, JSON.stringify({ cats: {}, items, days: [] }));
}

const weak = (count: number | null): SessionPlan => ({ ...DEFAULT_PLAN, weakSpotsOnly: true, count });

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  identityShuffle = false;
  localStorage.clear();
});

const click = (el: Element | null | undefined) => act(() => { (el as HTMLElement).click(); });

// The ids a colregs run asks, in the order it asks them, up to `n`.
function colregsAsked(focus: ColregsCategory, mode: 'practice' | 'exam', plan: SessionPlan, n: number) {
  act(() => {
    root.render(
      <PrefsProvider>
        <ColregsDrill focus={focus} start={{ mode, plan }} />
      </PrefsProvider>
    );
  });
  const pool = getPool(focus);
  const asked: string[] = [];
  for (let i = 0; i < n; i++) {
    const prompt = container.querySelector('h2')?.textContent ?? '';
    // Longest match, in case one prompt is a prefix of another.
    const q = pool
      .filter((d) => prompt.includes(d.prompt))
      .sort((a, b) => b.prompt.length - a.prompt.length)[0];
    expect(q, `no ${focus} question matches "${prompt.slice(0, 60)}"`).toBeDefined();
    asked.push(q.id);
    click(container.querySelector('.ct-option'));
    const next = [...container.querySelectorAll('button')].find((b) =>
      /next question|see results/i.test(b.textContent ?? '')
    );
    if (!next || /see results/i.test(next.textContent ?? '')) break;
    click(next);
  }
  return asked;
}

// The points a compass run asks, in order, up to `n`.
function compassAsked(mode: 'exam', plan: SessionPlan, n: number) {
  act(() => {
    root.render(
      <PrefsProvider>
        <CompassDrill focus="compass" start={{ mode, plan }} />
      </PrefsProvider>
    );
  });
  const asked: string[] = [];
  for (let i = 0; i < n; i++) {
    const spans = [...(container.querySelector('h2')?.querySelectorAll('span') ?? [])];
    const full = spans[spans.length - 1]?.textContent ?? '';
    const pt = COMPASS_POINTS.find((p) => p.full === full);
    expect(pt, `no compass point is "${full}"`).toBeDefined();
    asked.push(pt!.abbr);
    click(container.querySelector('[aria-label^="Point "]'));
    const next = [...container.querySelectorAll('button')].find((b) =>
      /next point|see results/i.test(b.textContent ?? '')
    );
    if (!next || /see results/i.test(next.textContent ?? '')) break;
    click(next);
  }
  return asked;
}

describe('a weak-spot run asks the weakest questions first', () => {
  // Shuffling decides the top-up and breaks exact ties, so each case runs
  // several times on the real Math.random.
  const TRIES = 5;

  it('builds the queue weakest first, then the rest', () => {
    const pool = getPool('navigation-lights');
    const progress: Progress = { cats: {}, items: LIGHTS, days: [] };
    for (let t = 0; t < TRIES; t++) {
      const queue = planQueue(pool, (q) => q.id, weak(10), progress).map((q) => q.id);
      expect(queue.slice(0, 4)).toEqual(LIGHTS_WEAKEST_FIRST);
      expect(queue.slice(4).some((id) => isWeakItem(progress, id))).toBe(false);
    }
  });

  for (const [label, mode, plan] of [
    ['practice, topped up to 10', 'practice', weak(10)],
    ['practice, no count (topped up to 5)', 'practice', weak(null)],
    ['exam', 'exam', weak(null)],
  ] as const) {
    it(`colregs ${label}: the weak ones first, weakest first, then the top-up`, () => {
      for (let t = 0; t < TRIES; t++) {
        seedLedger(LIGHTS);
        const asked = colregsAsked('navigation-lights', mode, plan, 6);
        expect(asked.slice(0, 4)).toEqual(LIGHTS_WEAKEST_FIRST);
        // The top-up that follows is none of the weak ones.
        const progress: Progress = { cats: {}, items: LIGHTS, days: [] };
        for (const id of asked.slice(4)) expect(isWeakItem(progress, id), id).toBe(false);
        act(() => root.unmount());
        root = createRoot(container);
      }
    });
  }

  it('Day shapes: a weak cross-listed question takes its place by weakness, not by card', () => {
    for (let t = 0; t < TRIES; t++) {
      seedLedger({
        'ds-07': { answered: 4, correct: 1 }, // 25%
        'vt-03': { answered: 3, correct: 0 }, //  0%, cross-listed from Vessel types
      });
      expect(colregsAsked('day-shapes', 'practice', weak(10), 2)).toEqual(['vt-03', 'ds-07']);
      act(() => root.unmount());
      root = createRoot(container);
    }
  });

  it('compass exam: the weak points first, weakest first', () => {
    for (let t = 0; t < TRIES; t++) {
      seedLedger({
        'compass:SWxS': { answered: 4, correct: 1 }, // 25%
        'compass:NNE': { answered: 4, correct: 0 }, //  0%
        'compass:E': { answered: 3, correct: 1 }, //   33%
      });
      expect(compassAsked('exam', weak(null), 3)).toEqual(['NNE', 'SWxS', 'E']);
      act(() => root.unmount());
      root = createRoot(container);
    }
  });
});

// The same convention for every other run: whatever order the queue is
// built in is the order it is asked in. With the shuffle made a no-op the
// queue is the pool in bank order, so the run must be too - front first.
describe('every run is asked front-first, in the order it was built', () => {
  it('colregs exam, practice with a count and with a timer', () => {
    identityShuffle = true;
    const bankOrder = getPool('anchor-types').map((q) => q.id);
    for (const [mode, plan] of [
      ['exam', DEFAULT_PLAN],
      ['practice', { ...DEFAULT_PLAN, count: 10 }],
      ['practice', { ...DEFAULT_PLAN, perQuestionMs: 30000 }],
    ] as const) {
      expect(colregsAsked('anchor-types', mode, plan, 4), `${mode} ${JSON.stringify(plan)}`).toEqual(bankOrder.slice(0, 4));
      act(() => root.unmount());
      root = createRoot(container);
    }
  });

  it('compass exam', () => {
    // At 1 - epsilon the deck's Fisher-Yates swaps nothing: rose order.
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    expect(compassAsked('exam', DEFAULT_PLAN, 4)).toEqual(COMPASS_POINTS.slice(0, 4).map((p) => p.abbr));
  });
});
