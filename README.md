# Fathom

[![CI](https://github.com/iangopen/fathom/actions/workflows/ci.yml/badge.svg)](https://github.com/iangopen/fathom/actions/workflows/ci.yml)

Fathom is a drilling tool for the parts of seamanship that are pure recall:
the 32-point compass rose, relative bearings, the COLREGs rules of the road,
and the signals, marks, safety gear and deck knowledge around them. It is
aimed at Sea Scouts and anyone else working toward a license, or trying to
get the lights and shapes back after a few years away from them. The material
is drilled rather than taught.

Live at https://iangopen.github.io/fathom/

## What's in it

The home screen lists six sections, and each section opens its own cards.
Every card is drilled by one of two drills.

The compass drill covers the 32-point rose and the relative bearing scale.
Both are generated from a table of 32 points rather than a fixed question
bank, so each run draws from the full circle, from the cardinals down through
the by-points (NxE, SWxS, and the rest).

Every other card draws on one fixed bank of 320 multiple-choice questions:

| Section | Card | Questions |
| --- | --- | --- |
| Navigation | Compass bearings | 32 points, generated |
| Navigation | Relative bearings | 32 points, generated |
| Rules of the road | Vessel hierarchy | 20 |
| Rules of the road | Navigation lights | 33 |
| Rules of the road | Vessel types | 6 |
| Rules of the road | Day shapes | 15 |
| Signals and communication | Sound signals | 16 |
| Signals and communication | Distress signals | 24 |
| Signals and communication | VHF procedure | 17 |
| Signals and communication | Signal flags | 20 |
| Aids to navigation | Buoyage / IALA marks | 30 |
| Aids to navigation | Chart symbols | 17 |
| Seamanship | Anchor types | 13 |
| Seamanship | PFD types | 30 |
| Seamanship | Fire safety | 12 |
| Seamanship | Deck seamanship | 27 |
| Weather and tides | Weather and sea state | 25 |
| Weather and tides | Tides and currents | 21 |

The question cards add up to 326, not 320, because Day shapes also drills the
6 Vessel types questions (9 of its own plus those 6). A shared question is
still one question: it keeps one record, and answering it on either card
moves both cards' mastery bars.

Sound signal questions draw the blast pattern and play it back through the
Web Audio API. The lights, shapes, flags and other diagrams draw the vessel or
the signal rather than naming it, so the answer has to come from the display
itself. Anchors, clouds and some buoys, distress signals and PFDs are
photographs instead.

Practice mode in either drill is open-ended: no clock, questions keep coming,
and you quit when you want. Exam mode works through a fixed deck with 15
seconds on each question and shows your progress through it. The compass drill
adds a third option, Timed Attack, which is a 60-second run for score. A
card's own screen can also set up a run: how many questions, a clock per
question, or the questions you most often get wrong. Nothing moves on by
itself; the explanation and its rule citation appear as soon as you answer,
and a Next button moves on when you're ready. Progress and best scores are
kept in localStorage, so they survive a reload but do not follow you to
another browser.

## Accessibility

- **Keyboard play.** Answers, compass points and every control are real
  buttons. Answering moves focus to the explanation, and Next moves it to the
  new question.
- **Screen readers.** A live region announces each result and the right
  answer. Every drawn diagram has a text description, generated from the same
  data that draws it. The description says what the picture shows and never
  what it means, so it does not give the answer away. Photos have alt text
  that describes the frame, not the subject, for the same reason.

These are checked in jsdom and in Chrome's accessibility tree. A full pass by
hand with a screen reader is still to do.

## Running it locally

Needs Node 22 or later (`.nvmrc` says 22, and CI runs on 22).

```
npm install
npm run dev
```

The other scripts:

```
npm run build      # production build to dist/
npm run preview    # serve the built output, which is how to exercise PWA install behaviour
npm test           # vitest, single run
npm run test:watch # vitest in watch mode
```

Note that the service worker only registers in production builds, so `npm run
dev` will not show install behavior, so use `npm run preview` for that.

## Stack and deployment

React 19 and TypeScript on Vite 6, with lucide-react for icons. Tailwind CSS
3.4.17 is compiled at build time through PostCSS, not loaded from a CDN. Tests
run under Vitest, with jsdom, Testing Library and axe-core.

The app is installable as a PWA. There is a manifest and a service worker, but
the worker is deliberately minimal. Fathom still needs a connection to load.

Deployment is automatic. Pushing to `main` runs `.github/workflows/ci.yml`,
which installs on Node 22, then runs `npx tsc --noEmit`, `npm run build` and
`npm test` in that order. Only if all three pass does the job publish `dist/`
to the `gh-pages` branch. A failure anywhere above the deploy step means
nothing ships.

## On the rule citations

Questions cite the rule they come from, in the form `Rule 27(a)(ii)`. Those
citations were checked by hand against the USCG Navigation Rules and 33 CFR 83.
That audit was manual, so the test suite verifies only that
citations are well-formed and point at rule numbers that exist, not that a
given rule is the correct authority for its question. If you find a citation
that is shaped correctly but attached to the wrong rule, the tests will not
have caught it.

## License

The code is under the [MIT License](LICENSE).

The photographs keep their own licenses (public domain or Creative Commons).
Each one is credited in the app, under the photo and on the About screen, and
in [IMAGE-CREDITS.md](IMAGE-CREDITS.md).
