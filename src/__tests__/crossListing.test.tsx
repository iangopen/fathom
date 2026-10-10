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
import { Progress, readProgress } from '../lib/progress';
import { categoryBySource } from '../lib/syllabus';

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
