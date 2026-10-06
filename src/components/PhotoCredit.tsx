import React from 'react';
import { ImageCredit, neutralSourceUrl } from '../lib/imageCredits';

// The credit line under a photograph in the visual panel. The CC BY and BY-SA
// licences most of these photos carry require the author and licence to be
// shown where the work is used, not only on a credits page.
//
// It sits under a question, so it must not answer it. Commons titles routinely
// name their subject - "Bruce anchor in Gdansk.jpg" - so until the question is
// answered this shows the author and the licence and nothing else, and the
// author links to the file page by numeric id rather than by its name-bearing
// URL (the href shows on hover). Once answered, the title is fair game and is
// added, linked to the canonical page. `src/__tests__/photoCredit.test.tsx`
// walks every photo question and pins that the unanswered line leaks nothing.

interface PhotoCreditProps {
  credit: ImageCredit;
  revealed: boolean;
}

export const PhotoCredit: React.FC<PhotoCreditProps> = ({ credit, revealed }) => (
  <p className="ct-credit">
    Photo{' '}
    <a href={neutralSourceUrl(credit)} target="_blank" rel="noopener noreferrer">
      {credit.author}
    </a>
    {' · '}
    <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">
      {credit.license}
    </a>
    {revealed && (
      <>
        {' · '}
        <a href={credit.source} target="_blank" rel="noopener noreferrer">
          {credit.title}
        </a>
      </>
    )}
  </p>
);
