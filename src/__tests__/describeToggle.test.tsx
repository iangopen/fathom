/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from '../App';
import { VisualPanel, hasVisual, visualDescription } from '../components/VisualPanel';
import { COLREGS_QUESTIONS } from '../drills/colregs/constants';
import { QUESTION_LIGHTS, QUESTION_VISUAL_AFTER_ANSWER } from '../drills/colregs';
import { PrefsProvider, DEFAULT_PREFS } from '../lib/prefs';

// The Describe toggle under every drawing, and the setting that opens them all.
// The rule it rests on: the description is ONE node. Describe shows the same
// <p> that aria-describedby already points at, rather than rendering a visible
// copy beside it, so a screen reader never meets the text twice.

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const PREFS_KEY = 'nauticalmaster:charttable:prefs';

const describeButton = (c: HTMLElement) => c.querySelector<HTMLButtonElement>('button.ct-describe');

// Every node that carries the description's text - the one aria-describedby
// names, and any copy. There must only ever be one.
function nodesWithText(c: HTMLElement, text: string) {
  return [...c.querySelectorAll('*')].filter(
    el => el.textContent === text && [...el.children].every(ch => ch.textContent !== text)
  );
}

function describedBy(c: HTMLElement) {
  const svg = c.querySelector('svg[role="img"]')!;
  const ids = (svg.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  return ids.map(id => c.ownerDocument.getElementById(id));
}

function mount(id: string, revealed = false) {
  return render(
    <PrefsProvider>
      <VisualPanel questionId={id} revealed={revealed} />
    </PrefsProvider>
  ).container;
}

// Every question drawn before an answer, and every one drawn after it.
const drawnBefore = COLREGS_QUESTIONS.filter(q => visualDescription(q.id, false) !== null);
const drawnAfter = COLREGS_QUESTIONS.filter(q => visualDescription(q.id, true) !== null);
const photos = COLREGS_QUESTIONS.filter(
  q => hasVisual(q.id) && visualDescription(q.id, false) === null
);
const LIGHTS_ID = Object.keys(QUESTION_LIGHTS)[0];

describe('the Describe button', () => {
  it('is on every drawing and on no photograph', () => {
    expect(drawnBefore.length).toBeGreaterThan(90);
    expect(photos.length).toBe(21);
    for (const q of drawnBefore) expect(describeButton(mount(q.id)), q.id).not.toBeNull();
    for (const q of photos) expect(describeButton(mount(q.id)), q.id).toBeNull();
    cleanup();
  });

  it('toggles aria-expanded and its own label, and shows exactly the generated description', () => {
    const c = mount(LIGHTS_ID);
    const btn = describeButton(c)!;
    const text = visualDescription(LIGHTS_ID, false)!;
    const p = c.ownerDocument.getElementById(btn.getAttribute('aria-controls')!)!;

    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('type')).toBe('button');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toBe('Describe');
    expect(p.className).toBe('sr-only');

    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.textContent).toBe('Hide description');
    expect(p.className).toBe('ct-describe-text');
    expect(p.textContent).toBe(text);

    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toBe('Describe');
    expect(p.className).toBe('sr-only');
  });

  it('keeps the description to one node, open or closed, on every drawing', () => {
    for (const revealed of [false, true]) {
      for (const q of revealed ? drawnAfter : drawnBefore) {
        const c = mount(q.id, revealed);
        const text = visualDescription(q.id, revealed)!;
        const btn = describeButton(c)!;
        for (const state of ['closed', 'open']) {
          if (state === 'open') fireEvent.click(btn);
          const targets = describedBy(c);
          expect(targets.length, `${q.id} ${state}`).toBe(1);
          expect(targets[0], `${q.id} ${state}`).not.toBeNull();
          expect(targets[0]!.textContent, `${q.id} ${state}`).toBe(text);
          // aria-controls and aria-describedby name the same element ...
          expect(btn.getAttribute('aria-controls')).toBe(targets[0]!.id);
          // ... and nothing else on the panel repeats its text.
          expect(nodesWithText(c, text), `${q.id} ${state}`).toEqual([targets[0]]);
        }
        cleanup();
      }
    }
  });

  it('is not there for a held-back drawing until the drawing is', () => {
    expect([...QUESTION_VISUAL_AFTER_ANSWER].sort()).toEqual(['dk-13', 'ss-07', 'ss-16']);
    for (const id of QUESTION_VISUAL_AFTER_ANSWER) {
      const before = mount(id, false);
      expect(describeButton(before), id).toBeNull();
      expect(before.textContent, id).toBe('');
      cleanup();
      const after = mount(id, true);
      expect(describeButton(after), id).not.toBeNull();
      cleanup();
    }
  });
});

describe('the "Show drawing descriptions" setting', () => {
  it('is off by default', () => {
    expect(DEFAULT_PREFS.showDescriptions).toBe(false);
    const c = mount(LIGHTS_ID);
    expect(describeButton(c)!.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens every description, and each button still closes its own', () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...DEFAULT_PREFS, showDescriptions: true }));
    for (const q of drawnBefore) {
      const c = mount(q.id);
      const btn = describeButton(c)!;
      expect(btn.getAttribute('aria-expanded'), q.id).toBe('true');
      expect(c.querySelector('.ct-describe-text')!.textContent, q.id).toBe(
        visualDescription(q.id, false)
      );
      cleanup();
    }
    const c = mount(LIGHTS_ID);
    fireEvent.click(describeButton(c)!);
    expect(describeButton(c)!.getAttribute('aria-expanded')).toBe('false');
    expect(c.querySelector('.ct-describe-text')).toBeNull();
  });

  it('is set from the Settings screen and remembered after a reload', () => {
    const first = render(<App />).container;
    const settings = [...first.querySelectorAll('button')].find(b => /settings/i.test(b.textContent ?? ''))!;
    fireEvent.click(settings);
    const row = [...first.querySelectorAll('div')].find(
      d => d.firstElementChild?.textContent === 'Show drawing descriptions'
    )!.parentElement!;
    const control = row.querySelector('button')!;
    expect(control.textContent).toBe('Off');
    fireEvent.click(control);
    expect(control.textContent).toBe('On');
    expect(JSON.parse(localStorage.getItem(PREFS_KEY)!).showDescriptions).toBe(true);

    // A reload: everything unmounted, and the prefs read back from storage.
    cleanup();
    const c = mount(LIGHTS_ID);
    expect(describeButton(c)!.getAttribute('aria-expanded')).toBe('true');
    expect(c.querySelector('.ct-describe-text')!.textContent).toBe(visualDescription(LIGHTS_ID, false));
  });
});
