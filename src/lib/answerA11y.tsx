import React from 'react';

// What happens around answering a question, for keyboard and screen-reader
// users. Both drills - the colregs quiz and the compass rose - follow the same
// contract:
//
// - ONE live region per run (role="status", polite). It is in the DOM, empty,
//   from the moment the question view mounts, and only its text ever changes:
//   screen readers routinely ignore a live region that arrives already filled.
//   It is empty before an answer, says the result once the question is
//   answered, and goes back to empty when the next question loads.
// - Answering moves focus to the feedback heading (tabIndex -1), so the
//   explanation is next in reading order and Next is next in tab order. Next
//   moves focus to the new question's prompt.
// - The focused heading and the live region must not say the same thing. The
//   live region owns the result ("Incorrect. The answer is ..."); the heading's
//   visible verdict is aria-hidden and the heading is named for what follows it.

export interface AnswerOutcome {
  correct: boolean;
  // The clock ran out with nothing picked.
  timedOut: boolean;
  // The correct answer as the reader would say it.
  answer: string;
  // The verdict is withheld on purpose (the colregs exam); say only that the
  // answer counted.
  withheld?: boolean;
}

export function answerAnnouncement({ correct, timedOut, answer, withheld }: AnswerOutcome): string {
  if (withheld) return timedOut ? 'Time expired.' : 'Answer recorded.';
  if (correct) return 'Correct.';
  return `${timedOut ? 'Time expired' : 'Incorrect'}. The answer is ${answer}.`;
}

// Render it unconditionally, with '' before an answer - never mount it with the
// message already inside.
export const AnswerLiveRegion: React.FC<{ message: string }> = ({ message }) => (
  <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" data-answer-status="">
    {message}
  </div>
);
