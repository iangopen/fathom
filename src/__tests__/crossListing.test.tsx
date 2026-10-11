// @vitest-environment jsdom
import React, { act } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';
import ColregsDrill, { getPool } from '../drills/colregs';
import {
  COLREGS_QUESTIONS,
  COLREGS_QUESTIONS_BY_CATEGORY,
  ColregsCategory,
} from '../drills/colregs/constants';
import { PrefsProvider } from '../lib/prefs';
import { DEFAULT_PLAN, SessionPlan, planQueue } from '../lib/session';
import { Progress, itemsMasteryPct, readProgress } from '../lib/progress';
import {
  CATEGORIES as CARDS,
  cardMasteryPct,
  categoryBySource,
  itemsForCategory,
} from '../lib/syllabus';

// A question can be drilled on more than one card (`alsoOn`), under its one
// id. Day shapes lost five questions when they were dropped as copies of the
// Vessel types ones; the six vessel-types questions are cross-listed onto Day
// shapes instead. What this file holds to:
//
//   * a card never holds a question twice, and no session drawn from it does;
//   * a cross-listed question is the same object as its home copy, not a copy;
//   * answering one writes ONE ledger record, under its own id, and one tally
//     on one card - never one per card it appears on.

const CATEGORIES = Object.keys(COLREGS_QUESTIONS_BY_CATEGORY) as ColregsCategory[];
const ids = (qs: { id: string }[]) => qs.map((q) => q.id);
const repeats = (list: string[]) => list.filter((id, i) => list.indexOf(id) !== i);

describe('cross-listed questions', () => {
  it('puts every vessel-types question on the Day shapes card as well', () => {
    const dayShapes = getPool('day-shapes');
    for (const q of COLREGS_QUESTIONS_BY_CATEGORY['vessel-types']) {
      expect(q.alsoOn).toContain('day-shapes');
      // The same object - a copy would be a second question with the same id.
      expect(dayShapes).toContain(q);
    }
  });

  it('only lists a question on cards that are real, and never on its own', () => {
    for (const q of COLREGS_QUESTIONS) {
      for (const cat of q.alsoOn ?? []) {
        expect(CATEGORIES).toContain(cat);
        expect(cat, q.id).not.toBe(q.category);
      }
    }
  });

  it('holds each card to its own questions plus the ones that name it', () => {
    for (const cat of CATEGORIES) {
      for (const q of getPool(cat)) {
        expect(q.category === cat || (q.alsoOn ?? []).includes(cat), `${q.id} on ${cat}`).toBe(true);
      }
    }
  });
});

describe('no question appears twice in one session', () => {
  // Every item weak, so the weak-spots plan has the most to put first.
  const allWeak = (pool: { id: string }[]): Progress => ({
    cats: {},
    items: Object.fromEntries(pool.map((q) => [q.id, { answered: 5, correct: 0 }])),
    days: [],
  });
  const empty: Progress = { cats: {}, items: {}, days: [] };

  const plans: Array<[string, SessionPlan]> = [
    ['default', DEFAULT_PLAN],
    ['count 10', { ...DEFAULT_PLAN, count: 10 }],
    ['count 40', { ...DEFAULT_PLAN, count: 40 }],
    ['weak spots', { ...DEFAULT_PLAN, weakSpotsOnly: true }],
    ['weak spots, 20', { ...DEFAULT_PLAN, weakSpotsOnly: true, count: 20 }],
  ];

  for (const filter of ['all', ...CATEGORIES] as const) {
    it(`${filter}: the card and every plan's queue hold each id once`, () => {
      const pool = getPool(filter);
      expect(repeats(ids(pool))).toEqual([]);
      for (const [name, plan] of plans) {
        for (const progress of [empty, allWeak(pool)]) {
          const queue = planQueue(pool, (q) => q.id, plan, progress);
          expect(repeats(ids(queue)), `${filter}, ${name}`).toEqual([]);
        }
      }
    });
  }
});

describe('a shared question keeps one record', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('answering a Day shapes exam writes each question once, on one card', () => {
    act(() => {
      root.render(
        <PrefsProvider>
          <ColregsDrill focus="day-shapes" start={{ mode: 'exam', plan: DEFAULT_PLAN }} />
        </PrefsProvider>
      );
    });

    const deck = getPool('day-shapes');
    const click = (el: HTMLElement) => act(() => { el.click(); });
    const seen: string[] = [];

    for (let i = 0; i < deck.length; i++) {
      const prompt = container.querySelector('h2')?.textContent ?? '';
      const q = deck.find((d) => prompt.includes(d.prompt));
      expect(q, `no Day shapes question matches "${prompt.slice(0, 60)}"`).toBeDefined();
      seen.push(q!.id);
      click(container.querySelector('.ct-option') as HTMLElement);
      const next = [...container.querySelectorAll('button')].find((b) =>
        /next question|see results/i.test(b.textContent ?? '')
      );
      click(next!);
    }

    // The whole card, each question once, the vessel-types ones among them.
    expect([...seen].sort()).toEqual(ids(deck).sort());
    expect(seen.filter((id) => id.startsWith('vt-'))).toHaveLength(6);

    const p = readProgress();
    for (const id of seen) expect(p.items[id], id).toEqual({ answered: 1, correct: expect.any(Number) });
    expect(Object.keys(p.items).sort()).toEqual([...seen].sort());

    // Credited to the question's home card, so the tallies add up to the run.
    const dayShapes = categoryBySource('day-shapes')!.id;
    const vesselTypes = categoryBySource('vessel-types')!.id;
    expect(p.cats[dayShapes].answered).toBe(deck.length - 6);
    expect(p.cats[vesselTypes].answered).toBe(6);
    const total = Object.values(p.cats).reduce((n, c) => n + c.answered, 0);
    expect(total).toBe(deck.length);
  });
});

// A card's mastery bar counts the same questions as its "What you are
// missing" list (itemsForCategory), cross-listed ones included. A shared
// question still has one record; every card it is on reads that record.
describe("a card's bar counts what its missing list counts", () => {
  it('on every card, the bar reads exactly the missing list items and nothing else', () => {
    const everyId = new Set(CARDS.flatMap((c) => itemsForCategory(c).map((i) => i.id)));
    for (const card of CARDS) {
      const mine = new Set(itemsForCategory(card).map((i) => i.id));
      if (mine.size === 0) continue;
      // Right every time on this card's items, wrong every time on the rest:
      // the bar is 100 only if it reads all of these and none of those.
      const p: Progress = {
        cats: {},
        items: Object.fromEntries(
          [...everyId].map((id) => [
            id,
            mine.has(id) ? { answered: 1, correct: 1 } : { answered: 1, correct: 0 },
          ])
        ),
        days: [],
      };
      expect(cardMasteryPct(p, card), card.id).toBe(100);
      // And it reads every one of them: one miss anywhere in the list moves it.
      for (const id of mine) {
        const one: Progress = { ...p, items: { ...p.items, [id]: { answered: 1, correct: 0 } } };
        expect(cardMasteryPct(one, card), `${card.id} ignores ${id}`).toBeLessThan(100);
      }
    }
    // Day shapes measures all 15: its own 9 and the 6 vessel-types questions.
    expect(itemsForCategory(categoryBySource('day-shapes')!)).toHaveLength(15);
  });
});

describe('answering a vessel-types question on Day shapes', () => {
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
    localStorage.clear();
  });

  it('moves both bars, from one record counted once in each', () => {
    const dayShapes = categoryBySource('day-shapes')!;
    const vesselTypes = categoryBySource('vessel-types')!;
    const q = COLREGS_QUESTIONS_BY_CATEGORY['vessel-types'][1];

    // Two earlier misses make it the only weak spot, so a one-question
    // weak-spots run on Day shapes is that question. The Vessel types tally
    // also holds ten older answers with no per-item record, so a bar that
    // read the category tally as well as the items would come out different.
    localStorage.setItem(
      'nauticalmaster:charttable:progress',
      JSON.stringify({
        cats: { [vesselTypes.id]: { answered: 12, correct: 10, last: 1 } },
        items: { [q.id]: { answered: 2, correct: 0 } },
        days: [],
      })
    );
    const before = readProgress();
    expect(before.items[q.id]).toEqual({ answered: 2, correct: 0 });
    expect(cardMasteryPct(before, dayShapes)).toBe(0);
    expect(cardMasteryPct(before, vesselTypes)).toBe(0);

    act(() => {
      root.render(
        <PrefsProvider>
          <ColregsDrill
            focus="day-shapes"
            start={{ mode: 'practice', plan: { ...DEFAULT_PLAN, weakSpotsOnly: true, count: 1 } }}
          />
        </PrefsProvider>
      );
    });
    expect(container.querySelector('h2')?.textContent).toContain(q.prompt);
    const right = [...container.querySelectorAll<HTMLElement>('.ct-option')]
      .filter((b) => (b.textContent ?? '').includes(q.correctAnswer))
      .sort((a, b) => (a.textContent ?? '').length - (b.textContent ?? '').length)[0];
    act(() => { right.click(); });

    const after = readProgress();
    // One record under its own id: three answers, not two plus one per card.
    expect(after.items[q.id]).toEqual({ answered: 3, correct: 1 });
    expect(Object.keys(after.items)).toEqual([q.id]);
    const raw = localStorage.getItem('nauticalmaster:charttable:progress') ?? '';
    expect(raw.split(`"${q.id}"`).length - 1, `records stored for ${q.id}`).toBe(1);
    // Both bars read that one record: 1 right of 3 is 33% on each.
    expect(cardMasteryPct(after, dayShapes)).toBe(33);
    expect(cardMasteryPct(after, vesselTypes)).toBe(33);
    // The category tally still goes to the home card alone.
    expect(after.cats[vesselTypes.id].answered).toBe(13);
    expect(after.cats[dayShapes.id]).toBeUndefined();
  });

  it('never counts one id twice in a bar, however often it is listed', () => {
    const p: Progress = { cats: {}, items: { a: { answered: 3, correct: 1 }, b: { answered: 1, correct: 1 } }, days: [] };
    expect(itemsMasteryPct(p, ['a', 'b'])).toBe(50);
    expect(itemsMasteryPct(p, ['a', 'a', 'b'])).toBe(50);
    expect(itemsMasteryPct(p, ['c'])).toBeNull();
  });
});
