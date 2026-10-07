# Session history

Newest first. CLAUDE.md describes the current state; this file is the log of
how it got there.

## 2026-10-06 - Answering, for keyboard and screen-reader users

- Closed the audit's last finding. Both drills now share one contract
  (src/lib/answerA11y.tsx): an always-mounted polite live region, focus to the
  feedback heading on answering and to the prompt on Next, aria-disabled
  options that say their state. Details in CLAUDE.md.
- The compass rose was mouse-only (`<div onClick>` points) and auto-advanced;
  it now has real point buttons named by position, a Next button, and tick /
  cross marks. Its control panel moved first in the DOM (CSS order keeps the
  rose drawn first) so Tab runs prompt -> points.
- Alt-text audit: one name-level leak, the PFD photo's "flotation device"
  against the answer "A Type III flotation aid"; fixed. A throwaway audit
  script first reported zero - the bash heredoc had turned its regex `\b`
  into a literal backspace, so the word check never matched. The committed
  test caught it.
- Found but not fixed (own session): roughly 30 drawn visuals depict their
  own answer to every reader - most day-shape and sound-signal questions, and
  vh-01/02/09. Listed in CLAUDE.md.
- Tests 1017 -> 1036 (13 files). Removing the focus move fails 3 of them.
- Keyboard walkthrough in Chrome on `npm run preview`, light and dark, a photo
  question and the compass. Quirk: the Chrome window reported
  visibilityState "hidden", and the first key presses after a page setup
  were sometimes dropped; single presses after a short pause arrived.
- `npm audit --omit=dev` is clean; the Space Grotesk link in index.html is
  unused and waits for the next index.html authorization.

## 2026-10-06 - Tailwind moved from the Play CDN to a compiled build

- Closed out the photo-credit session first: putting "Claw anchor" into the
  claw photo's author made `photoCredit.test.tsx` fail with
  `an-03: answer label` and the answer word; reverted, 6/6 passing again.
- `cdn.tailwindcss.com` redirected to `/3.4.17`, so tailwindcss is pinned to
  exactly 3.4.17. There was no inline config. PostCSS config only; Vite picked
  it up with vite.config.ts untouched. No autoprefixer (the CDN had none).
- Dynamic classes: none to rewrite. Every interpolation in src that looked like
  one was a React key or an SVG id; CompassRose's variable classes were
  already complete literals. Its state classes (hover, arbitrary shadows,
  opacity modifiers) were checked present in the compiled CSS.
- index.html: CDN script removed, `<title>` NauticalMaster -> Fathom.
- Compiled CSS: 17.46 kB (3.71 kB gzip). Tests 12 files / 1017.
- How the regression check worked, for next time: baselines were taken from
  `npm run build` + `npm run preview` *before* the change. A page-injected
  harness clicked to each view, seeded `Math.random` in the page, and stored
  every element's computed style (about 45 properties) in the preview origin's
  localStorage; after the change the same views were diffed element by
  element. Option order and question draw were not fully reproducible through
  the seed, so a view has to be pinned to a specific question's text, or a
  different draw shows up as a false diff. The progress ledger has to be
  cleared before each view or mastery bars differ.
- Chrome extension quirk: `Page.captureScreenshot` timed out on any page that
  had gone idle (no new frames). A 1px requestAnimationFrame element kept the
  compositor producing frames and fixed it.
