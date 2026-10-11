# Session history

Newest first. CLAUDE.md describes the current state; this file is the log of
how it got there.

## 2026-10-10 - Five leftovers: bars, a duplicate check, labels, README, license

- Mastery bars now read the per-item tallies of the card's missing-list
  items. The CSV export follows the bar. Tests 1082 -> 1154 (16 files):
  3 bar tests, 69 for the scenario labels and arrowheads.
- vt-06 / ds-04: different drawing (lone diamond vs tow drawn astern) and
  different right answer; both kept.
- Scenario labels: measured with getBBox in headless Chrome over CDP (the
  arrowhead is a marker, so the probe inserted a path with the marker's
  geometry to measure it). 31 of 34 overlapped; 0 after. The screenshots
  also showed answered arrows had no heads, a marker-id mismatch; fixed in
  its own commit.
- Found and left: weak-spot runs play the weak questions last (the deck is
  read from its end). Recorded as open in CLAUDE.md.
- README counted with a scratch script bundled by esbuild from the real
  modules. `npm install --package-lock-only` for the license field also
  wrote last session's `engines` into the lockfile.
- Gotchas: Bash heredocs and `node -e` mangle `${...}` and backticks; use
  the Edit tool for TypeScript. And `git checkout -- <file>` to undo a
  deliberate break also undoes any uncommitted real change in that file:
  copy the file aside first, as the later breaks did.

## 2026-10-09 - Text equivalents for the drawings

- Inventory first: 104 drawn visuals across ten types (lights 13, day shapes
  9, sounds 16, vessel profiles 6, scenarios 17, drawn buoys 6, drawn distress
  6, drawn PFDs 3, boat parts 13, flags 15), plus 21 photographs out of
  scope. Before, a screen reader heard the panel captions and the SVG's
  loose text - "Vessel Lights BOW STERN PORT STBD", "Mark", "Highlighted".
- One commit per type; infrastructure went in with lights. The guard's
  first runs caught filler words that happened to be distinctive in an
  answer ("through", "other", "course") and two kind names ("Vessel
  encounter diagram", "Signal diagram"); all reworded at the source.
- Writing the generators surfaced two drawing bugs (sidelight arcs, the
  sail-vs-sail hull) and one drawing that was its own answer (dk-13). All
  three fixed in their own commits, each with a before/after screenshot.
- Gotchas, for next time: a Python heredoc turned a regex `\b` into a
  backspace character (again - see the 2026-10-06 entry); several component
  files are CRLF, so scripted string replacements need line endings
  normalised; `textContent` runs neighbouring SVG labels together, so read
  text node by node; and stopping a background `npm run preview` task left
  its node child holding port 4173 - stop the process itself.
- The accessibility tree was read with CDP `Accessibility.getPartialAXTree`
  in headless Chrome, because the Claude in Chrome extension was not
  connected.

## 2026-10-09 - Follow-ups to the drawing-leak session

- Test environment: Node 25 failed 27 tests (CLAUDE.md said 24; later tests
  added to the count). Root cause read from Vitest's `getWindowKeys`: a key
  already on the Node global is only overridden if it is on Vitest's fixed
  KEYS list. Fixed with a setup file, not `execArgv`. Found while verifying
  that Node 26.11.1 is out and fails the same way; both pass now. Node 22,
  25 and 26 were run from the `node` npm package installed in a scratch
  directory, so the system Node 24 was left alone.
- ds-12: 30(g) -> 30(e). Rule text from the eCFR API (the eCFR site itself
  redirected to a bot check).
- Day shapes: 9 -> 15 questions via `alsoOn` on vt-01 to vt-06. The card's
  blurb said those shapes were drilled on Vessel types; reworded, and a
  "NUC, RAM, CBD and fishing" topic added.
- index.html: the Space Grotesk link removed. The Claude in Chrome extension
  was not connected, so the before/after check drove headless Chrome over CDP
  with Node's built-in WebSocket (`CSS.getPlatformFontsForNode` gives the
  font actually drawn, which computed style cannot).

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
