/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import axe from 'axe-core';
import ColregsDrill from '../drills/colregs';
import CompassDrill from '../drills/compass';
import { CompassRose } from '../drills/compass/CompassRose';
import { COMPASS_POINTS, RELATIVE_POINTS } from '../drills/compass/constants';
import { COLREGS_QUESTIONS } from '../drills/colregs/constants';
import { VisualPanel, hasVisual } from '../components/VisualPanel';
import { PrefsProvider } from '../lib/prefs';
import { DEFAULT_PLAN } from '../lib/session';
import { answerAnnouncement } from '../lib/answerA11y';

// The contract in src/lib/answerA11y.tsx, for both drills: one polite live
// region, empty until an answer and then the result; focus to the feedback
// heading on answering and to the prompt on Next; options that stay focusable
// and say their state; and no accessible name that answers the question.

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const status = (c: HTMLElement) => c.querySelector('[role="status"]')!;
const feedback = (c: HTMLElement) => c.querySelector('h3.ct-feedback');
const optionButtons = (c: HTMLElement) => [...c.querySelectorAll<HTMLButtonElement>('.ct-option')];
const buttonNamed = (c: HTMLElement, re: RegExp) =>
  [...c.querySelectorAll<HTMLButtonElement>('button')].find(b => re.test(b.textContent ?? ''));

// ── The colregs quiz ────────────────────────────────────────────────────

function mountColregs(mode: 'practice' | 'exam' = 'practice') {
  return render(
    <PrefsProvider>
      <ColregsDrill focus="anchor-types" start={{ mode, plan: DEFAULT_PLAN }} />
    </PrefsProvider>
  ).container;
}

function questionOnScreen(c: HTMLElement) {
  const text = c.querySelector('h2')!.textContent;
  const q = COLREGS_QUESTIONS.find(q => q.prompt === text);
  if (!q) throw new Error(`no bank question for prompt "${text}"`);
  return q;
}

const optionFor = (c: HTMLElement, label: string) =>
  optionButtons(c).find(b => b.textContent!.includes(label))!;

describe('colregs: answering', () => {
  it('says nothing before an answer, in a region that is already there', () => {
    const c = mountColregs();
    const region = status(c);
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');
  });

  it('moves focus to the feedback heading and announces a correct answer', () => {
    const c = mountColregs();
    const region = status(c);
    const q = questionOnScreen(c);

    fireEvent.click(optionFor(c, q.correctAnswer));

    expect(document.activeElement).toBe(feedback(c));
    expect(status(c)).toBe(region); // the same node, only its text changed
    expect(region.textContent).toBe('Correct.');
  });

  it('announces a wrong answer with the right one', () => {
    const c = mountColregs();
    const q = questionOnScreen(c);
    const wrong = q.options.find(o => o !== q.correctAnswer)!;

    fireEvent.click(optionFor(c, wrong));

    expect(document.activeElement).toBe(feedback(c));
    expect(status(c).textContent).toBe(`Incorrect. The answer is ${q.correctAnswer}.`);
  });

  it('does not say the verdict twice: the focused heading leaves it to the live region', () => {
    const c = mountColregs();
    const q = questionOnScreen(c);
    fireEvent.click(optionFor(c, q.correctAnswer));
    const heading = feedback(c)!;
    const heard = [...heading.childNodes]
      .filter(n => !(n instanceof HTMLElement && n.getAttribute('aria-hidden') === 'true'))
      .map(n => n.textContent)
      .join('');
    expect(heard).not.toMatch(/correct/i);
    expect(heard).toMatch(/^Explanation/);
  });

  it('keeps every option a focusable button and gives its state in words', () => {
    const c = mountColregs();
    const q = questionOnScreen(c);
    const wrong = q.options.find(o => o !== q.correctAnswer)!;
    fireEvent.click(optionFor(c, wrong));

    for (const b of optionButtons(c)) {
      expect(b.tagName).toBe('BUTTON');
      expect(b.disabled).toBe(false);
      expect(b.getAttribute('aria-disabled')).toBe('true');
    }
    expect(optionFor(c, q.correctAnswer).textContent).toContain('correct answer');
    expect(optionFor(c, wrong).textContent).toContain('your answer, incorrect');
  });

  it('moves focus to the new prompt on Next, and empties the live region', () => {
    const c = mountColregs();
    fireEvent.click(optionButtons(c)[0]);
    fireEvent.click(buttonNamed(c, /next question/i)!);

    expect(document.activeElement).toBe(c.querySelector('h2'));
    expect(status(c).textContent).toBe('');
  });

  it('in the exam, records the answer without giving the verdict, and focuses Next', () => {
    const c = mountColregs('exam');
    const q = questionOnScreen(c);
    fireEvent.click(optionFor(c, q.correctAnswer));

    expect(status(c).textContent).toBe('Answer recorded.');
    expect(document.activeElement).toBe(buttonNamed(c, /next question|see results/i));
    // The picked option says so in visible text, not just a brass border.
    expect(optionFor(c, q.correctAnswer).textContent).toContain('your answer');
  });
});

// ── The compass rose ────────────────────────────────────────────────────

function mountCompass() {
  return render(<CompassDrill focus="compass" start={{ mode: 'practice', plan: DEFAULT_PLAN }} />).container;
}

const points = (c: HTMLElement) =>
  [...c.querySelectorAll<HTMLButtonElement>('button[aria-label^="Point "]')];

function targetIndex(c: HTMLElement) {
  const abbr = c.querySelector('h2')!.querySelectorAll('span')[1].textContent;
  return COMPASS_POINTS.find(p => p.abbr === abbr)!.index;
}

describe('compass: answering', () => {
  it('puts all 32 points in the tab order as buttons named by position', () => {
    const c = mountCompass();
    const ps = points(c);
    expect(ps).toHaveLength(32);
    ps.forEach((b, i) => {
      expect(b.tagName).toBe('BUTTON');
      expect(b.tabIndex).toBe(0);
      expect(b.getAttribute('aria-label')).toBe(`Point ${i + 1} of 32`);
    });
    expect(status(c).textContent).toBe('');
  });

  it('puts the prompt before the points, so Tab from the prompt lands on the rose', () => {
    const c = mountCompass();
    const prompt = c.querySelector('h2')!;
    expect(document.activeElement).toBe(prompt);
    expect(prompt.compareDocumentPosition(points(c)[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('moves focus to the feedback heading and announces a correct find', () => {
    const c = mountCompass();
    fireEvent.click(points(c)[targetIndex(c)]);
    expect(document.activeElement).toBe(feedback(c));
    expect(status(c).textContent).toBe('Correct.');
  });

  it('announces a miss with the point that was wanted, and marks both points', () => {
    const c = mountCompass();
    const t = targetIndex(c);
    const wrong = (t + 5) % 32;
    fireEvent.click(points(c)[wrong]);

    expect(document.activeElement).toBe(feedback(c));
    expect(status(c).textContent).toBe(`Incorrect. The answer is point ${t + 1} of 32.`);
    expect(points(c)[t].getAttribute('aria-label')).toBe(`Point ${t + 1} of 32, correct answer`);
    expect(points(c)[wrong].getAttribute('aria-label')).toBe(`Point ${wrong + 1} of 32, your answer, incorrect`);
    expect(points(c).every(b => b.getAttribute('aria-disabled') === 'true')).toBe(true);
  });

  it('waits for Next, then moves focus to the new prompt', () => {
    const c = mountCompass();
    fireEvent.click(points(c)[targetIndex(c)]);
    const asked = c.querySelector('h2')!.textContent;
    // No auto-advance any more.
    act(() => { /* flush */ });
    expect(c.querySelector('h2')!.textContent).toBe(asked);

    fireEvent.click(buttonNamed(c, /next point/i)!);
    expect(document.activeElement).toBe(c.querySelector('h2'));
    expect(status(c).textContent).toBe('');
  });
});

// ── No accessible name answers the question ─────────────────────────────

// What a screen reader can reach, in two parts. `names` are the ones only
// assistive tech gets - alt, aria-label, title - which this layer is
// responsible for. `text` is visible text in the drawing, which a sighted
// reader sees too.
function heard(root: Element): { names: string; text: string } {
  const names: string[] = [];
  const text: string[] = [];
  const walk = (n: Node) => {
    if (n instanceof Element) {
      if (n.getAttribute('aria-hidden') === 'true') return;
      for (const a of ['alt', 'aria-label', 'title']) {
        const v = n.getAttribute(a);
        if (v) names.push(v);
      }
    } else if (n.nodeType === Node.TEXT_NODE) {
      text.push(n.textContent ?? '');
    }
    n.childNodes.forEach(walk);
  };
  walk(root);
  return { names: names.join(' | ').toLowerCase(), text: text.join(' | ').toLowerCase() };
}

// The words of the right answer that no wrong option shares - for "Claw
// anchor" against three other anchors, "claw".
function distinctiveWords(correct: string, options: string[]): string[] {
  const words = (s: string) => s.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const elsewhere = new Set(options.filter(o => o !== correct).flatMap(words));
  return words(correct).filter(w => !elsewhere.has(w));
}

describe('accessible names before an answer', () => {
  const withVisual = COLREGS_QUESTIONS.filter(q => hasVisual(q.id));

  it('no alt text, aria-label or title names or implies its own answer', () => {
    expect(withVisual.length).toBeGreaterThan(100);
    const leaks: string[] = [];
    for (const q of withVisual) {
      const { container } = render(<VisualPanel questionId={q.id} revealed={false} />);
      const { names } = heard(container);
      if (names.includes(q.correctAnswer.toLowerCase())) leaks.push(`${q.id}: answer label`);
      for (const w of distinctiveWords(q.correctAnswer, q.options)) {
        if (new RegExp(`\\b${w}`).test(names)) leaks.push(`${q.id}: "${w}"`);
      }
      cleanup();
    }
    expect(leaks).toEqual([]);
  });

  // Visible text in a drawing is the same for every reader, so it gets the
  // coarser check: it must never carry the answer label whole. Word-level
  // matching here is all noise - "Blast Sequence" is every sound diagram's
  // caption - and the drawings that DO show their own answer (a day-shape
  // question that draws the shape it asks for) leak by picture, not by
  // name; that is a question-bank problem, recorded in CLAUDE.md.
  it('no drawing spells out its own answer label', () => {
    const leaks = withVisual.filter(q => {
      const { container } = render(<VisualPanel questionId={q.id} revealed={false} />);
      const hit = heard(container).text.includes(q.correctAnswer.toLowerCase());
      cleanup();
      return hit;
    });
    expect(leaks.map(q => q.id)).toEqual([]);
  });

  it('no compass point is named for what it is, whatever the target', () => {
    for (const [gameType, set] of [['compass', COMPASS_POINTS], ['relative', RELATIVE_POINTS]] as const) {
      for (const target of set) {
        const { container } = render(
          <CompassRose
            targetPoint={target}
            gameState="playing"
            onPointClick={() => {}}
            clickedIndex={null}
            rotation={0}
            gameMode="practice"
            gameType={gameType}
          />
        );
        const names = points(container).map(b => b.getAttribute('aria-label'));
        expect(names.every(n => /^Point \d+ of 32$/.test(n!))).toBe(true);
        cleanup();
      }
    }
  });
});

// ── axe ─────────────────────────────────────────────────────────────────

async function violations(c: HTMLElement) {
  // `region` wants every node inside a landmark; these render a drill without
  // the app shell (ChartFrame) that supplies those, so it is out of scope here.
  const result = await axe.run(c, { rules: { region: { enabled: false } } });
  return result.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`);
}

describe('axe', () => {
  it('finds nothing on an unanswered and an answered colregs question', async () => {
    const c = mountColregs();
    expect(await violations(c)).toEqual([]);
    fireEvent.click(optionButtons(c)[0]);
    expect(await violations(c)).toEqual([]);
  });

  it('finds nothing on an unanswered and an answered photo question', async () => {
    // Walk the anchor deck until a photograph is on screen.
    const c = mountColregs();
    for (let i = 0; i < 40 && !c.querySelector('.ct-instrument img'); i++) {
      fireEvent.click(optionButtons(c)[0]);
      fireEvent.click(buttonNamed(c, /next question/i)!);
    }
    expect(c.querySelector('.ct-instrument img')).toBeTruthy();
    expect(await violations(c)).toEqual([]);
    fireEvent.click(optionButtons(c)[0]);
    expect(await violations(c)).toEqual([]);
  });

  it('finds nothing on an unanswered and an answered compass round', async () => {
    const c = mountCompass();
    expect(await violations(c)).toEqual([]);
    fireEvent.click(points(c)[0]);
    expect(await violations(c)).toEqual([]);
  });
});

describe('the announcement text', () => {
  it('reads as the contract says', () => {
    expect(answerAnnouncement({ correct: true, timedOut: false, answer: 'X' })).toBe('Correct.');
    expect(answerAnnouncement({ correct: false, timedOut: false, answer: 'Mushroom anchor' }))
      .toBe('Incorrect. The answer is Mushroom anchor.');
    expect(answerAnnouncement({ correct: false, timedOut: true, answer: 'Mushroom anchor' }))
      .toBe('Time expired. The answer is Mushroom anchor.');
    expect(answerAnnouncement({ correct: true, timedOut: false, answer: 'X', withheld: true }))
      .toBe('Answer recorded.');
  });
});
