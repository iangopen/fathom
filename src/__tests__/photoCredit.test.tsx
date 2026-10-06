import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { VisualPanel, photoCreditFor } from '../components/VisualPanel';
import { COLREGS_QUESTIONS } from '../drills/colregs/constants';
import { IMAGE_CREDITS } from '../lib/imageCredits';

// The CC licences on most of these photographs require a credit where the
// photo is shown, so VisualPanel puts one under each. That line sits under a
// question, and the obvious way to write it - the file's own title - would
// often answer the question: "Bruce anchor in Gdansk.jpg", "Sea dye
// marker.JPG", "Limfjord safe water mark.jpg".
//
// So this renders the panel for EVERY question that shows a photograph,
// unanswered, and checks the credit line against that question's answer. A
// future photo whose author field happens to name its subject, or a change
// that brings the title back before the reveal, fails here.

const photoQuestions = COLREGS_QUESTIONS.filter((q) => photoCreditFor(q.id));

function creditLine(questionId: string, revealed: boolean) {
  const html = renderToStaticMarkup(<VisualPanel questionId={questionId} revealed={revealed} />);
  const m = html.match(/<p class="ct-credit">([\s\S]*?)<\/p>/);
  if (!m) return null;
  const hrefs = [...m[1].matchAll(/href="([^"]*)"/g)].map((h) => decodeURIComponent(h[1]));
  const text = m[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
  return { text, hrefs };
}

// The words of the right answer that no wrong option shares: for "Claw anchor"
// against three other anchors that is "claw", the word that actually answers.
function distinctiveWords(correct: string, options: string[]): string[] {
  const words = (s: string) => s.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const elsewhere = new Set(options.filter((o) => o !== correct).flatMap(words));
  return words(correct).filter((w) => !elsewhere.has(w));
}

describe('photo credits under questions', () => {
  it('reaches every credited photograph through some question', () => {
    // Guards the leak test below against going vacuous: if no question showed
    // a photo, "no credit leaks" would pass by checking nothing.
    const shown = new Set(
      photoQuestions.map((q) => {
        const c = photoCreditFor(q.id)!;
        return Object.keys(IMAGE_CREDITS).find((k) => IMAGE_CREDITS[k] === c);
      })
    );
    expect([...shown].sort()).toEqual(Object.keys(IMAGE_CREDITS).sort());
  });

  it('renders a credit line under every photograph', () => {
    const missing = photoQuestions.filter((q) => !creditLine(q.id, false)).map((q) => q.id);
    expect(missing).toEqual([]);
  });

  it('names neither the answer nor the file before the question is answered', () => {
    const leaks: string[] = [];
    for (const q of photoQuestions) {
      const credit = photoCreditFor(q.id)!;
      const { text, hrefs } = creditLine(q.id, false)!;
      const lower = text.toLowerCase();
      const titleStem = credit.title.replace(/\.[a-z]+$/i, '').toLowerCase();

      if (lower.includes(q.correctAnswer.toLowerCase())) leaks.push(`${q.id}: answer label`);
      for (const w of distinctiveWords(q.correctAnswer, q.options)) {
        if (new RegExp(`\\b${w}`).test(lower)) leaks.push(`${q.id}: answer word "${w}"`);
      }
      if (lower.includes(titleStem)) leaks.push(`${q.id}: file title`);
      if (lower.includes(credit.subject.toLowerCase())) leaks.push(`${q.id}: subject`);
      // The href shows in the status bar on hover, so it is visible too.
      for (const h of hrefs) {
        if (h.toLowerCase().includes(titleStem.replace(/ /g, '_'))) leaks.push(`${q.id}: href ${h}`);
      }
    }
    expect(leaks).toEqual([]);
  });

  it('carries the author and the licence, both linked', () => {
    for (const q of photoQuestions) {
      const credit = photoCreditFor(q.id)!;
      const { text, hrefs } = creditLine(q.id, false)!;
      expect(text).toContain(credit.author);
      expect(text).toContain(credit.license);
      expect(hrefs).toContain(credit.licenseUrl);
      expect(hrefs).toContain(`https://commons.wikimedia.org/w/index.php?curid=${credit.pageId}`);
    }
  });

  it('adds the file title once the question is answered', () => {
    for (const q of photoQuestions) {
      const credit = photoCreditFor(q.id)!;
      const { text } = creditLine(q.id, true)!;
      expect(text).toContain(credit.title);
    }
  });

  it('draws no credit line under a drawing', () => {
    const drawn = COLREGS_QUESTIONS.filter((q) => !photoCreditFor(q.id));
    expect(drawn.length).toBeGreaterThan(0);
    expect(drawn.filter((q) => creditLine(q.id, false)).map((q) => q.id)).toEqual([]);
  });
});
