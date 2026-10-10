# Fathom

Vite + React + TypeScript app deployed to GitHub Pages at:
https://iangopen.github.io/fathom/

## Stack
- Tailwind CSS **3.4.17, compiled at build time** through PostCSS
  (`tailwind.config.js`, `postcss.config.js`, entry `src/index.css` imported
  from main.tsx). It is used only inside the drill *diagrams* (CompassRose,
  LightDisplay and friends), which were never restyled.
  - It used to be the v3 Play CDN script in index.html, generating CSS in the
    browser. The version is pinned exactly (no caret) to what that CDN served,
    because a major bump changes defaults such as border colours and ring
    widths. The CDN had no inline config, so the theme is stock v3 - nothing was
    ported. `darkMode` is the v3 default (`media`); nothing uses `dark:`.
  - **Class names must be complete literal strings.** The compile-time scanner
    only sees whole tokens in `index.html` and `src/**/*.{ts,tsx}`; a class put
    together from pieces (`bg-${c}-500`, `'text-' + size`) silently never
    reaches the CSS. Choosing between whole literals is fine - CompassRose
    keeps `sizeClass` / `colorClass` variables that each hold complete strings.
    At the switch there were no pieced-together classes anywhere in src.
  - Verified at the switch: all 18 baseline views (hub, photo question
    unanswered and answered, lights diagram, compass rose, Settings, About, in
    both themes, plus hub and question at 375px) matched the CDN build with
    zero differing computed styles, element by element, on `npm run preview`.

## Architecture
- App.tsx is the shell. It wraps everything in PrefsProvider and ChartFrame, so
  the masthead, the ruled ground and the theme are continuous across every
  screen. A `Route` picks between the Hub, a section, a category, one drill,
  About and Settings.
- The **Hub is a welcome screen**, not the whole index: intro, stats, the two
  drill shortcuts, then **one card per SECTION**. `src/lib/syllabus.ts`
  describes every category under one of five sections — Navigation, Rules of
  the road, Signals and communication, Aids to navigation, Seamanship — and
  `sections()` is what the hub and About both read, so adding a sixth to
  SECTION_ORDER adds a card and an About line with no other edit. Nothing
  hardcodes the section count.
- A section card opens `SectionScreen`, that section's own category list.
  `drillTargetFor()` says which drill answers a category, and there are more
  cards than drills, on purpose.
- A category card opens `CategoryDetail`, which is where a run is set up and
  started.
  It hands the drill a `focus` (which category) and a `start` (which of the
  drill's own modes, and a `SessionPlan`), and the drill goes straight into
  that run. The two shortcut buttons at the top of the hub skip both the
  section and the category screen and open a drill's own menu, unplanned.
- **The trail** is the navigation signpost: ChartFrame draws a breadcrumb
  under the masthead rule from a `trail: TrailStep[]` App computes per route.
  It goes four deep - Chart table / Section / Category / Drill - and every
  step but the last is clickable. The hub is always the first step: the
  current location on the hub itself, a labelled "Chart table" button
  everywhere else. It replaces the implicit
  "click the wordmark" convention (the wordmark still works), so CategoryDetail
  and SettingsScreen take `onBack` as optional and the shell no longer passes
  one; only the retired chart table drill, which has no trail, still does.
- The masthead carries a three-button group: About, Settings, Feedback. The
  feedback link is `FEEDBACK_FORM_URL` in `src/lib/links.ts` and nowhere else;
  while it still contains the PLACEHOLDER sentinel, `feedbackReady()` is false
  and the button renders as unavailable rather than as a dead link. Swapping in
  the real form URL is that one line.
- Theme is set in Settings ("Display → Lighting"), not from the masthead - the
  old `.ct-chip` toggle there is gone. `DEFAULT_PREFS.theme` is `dark`: night
  helm is the first-run default, and `readPrefs` only overrides it for a theme
  that was stored explicitly. `src/__tests__/prefs.test.ts` pins that.
- Drills write to the shared progress ledger as they go; App re-reads it on the
  way back to the hub, which is what fills the mastery bars.
- Adding a drill = new folder + register in src/drills/index.ts + point a
  syllabus category at it in drillTargetFor().

### A question on more than one card
A colregs question has one home, its `category`: the bucket it is written in
(`COLREGS_QUESTIONS_BY_CATEGORY`, still an exact partition of the bank), the
card its answers are credited to and the label shown beside it. It can also
name other cards in **`alsoOn`**. `COLREGS_DECK_BY_CATEGORY` is what a card
drills: its own bucket, then every question that names it, as the same
objects, never copies. `getPool`, `questionCount` and `itemsForCategory` read
the deck, so the count, the drill and the weak-spot list all follow.
- vt-01 to vt-06 (NUC, RAM, CBD, fishing, sail alone, the long-tow diamond)
  are `alsoOn: ['day-shapes']`. Day shapes is 15 questions (its own 9 plus
  those 6), Vessel types 6, the whole bank still 320. That replaces the five
  day-shape copies dropped in the drawing-leak session.
- **One record per question.** The ledger keys items by question id, and the
  category tally goes to the question's HOME card (`progressIdFor` reads the
  question, not the run's filter). So a vt question answered on Day shapes
  moves Vessel types' mastery bar, and still shows up in Day shapes' weak-spot
  list. Nothing sums card counts, so nothing double-counts on screen.
- `crossListing.test.tsx` holds every card and every plan's queue (default,
  counts, weak spots, with an empty and an all-weak ledger) to one copy of
  each id, and walks a whole Day shapes exam in jsdom checking the stored
  ledger: each id answered once, tallies summing to the run. Deliberately
  breaking `planQueue` (top-up drawn from the whole pool) and the deck builder
  (home questions listed twice) both fail it. `picker.test.ts` still requires
  each pool to be exactly its home questions plus its declared cross-listings.

## Sessions, plans and the ledger
- `src/lib/progress.ts` is the one ledger. It keeps a per-category tally
  (mastery, drilled total, last drilled) **and** a per-item tally keyed by
  question id, or by `'<gameType>:<abbr>'` for compass points. Category
  mastery cannot say *which* questions are costing it; the per-item grain is
  what the weak-spot list reads.
- A ledger written before the per-item grain existed reads back with an empty
  `items` and its category figures intact - `coerce()` handles it, and
  `src/__tests__/ledger.test.ts` pins that.
- `weakSpots()` is the report: lowest accuracy first, an item needs
  `WEAK_MIN_ATTEMPTS` answers before it can appear, and anything answered right
  every time is never listed. `isWeakItem()` is the stricter queue filter -
  missed more often than got right - used by "focus on weak spots".
- `src/lib/session.ts` holds `SessionPlan` (count / per-question timer / weak
  spots) and `planQueue()`, the single place a run's questions are chosen.
  **`DEFAULT_PLAN` must always mean "behave exactly as before":** with it,
  `planQueue` is a plain shuffle of the whole pool, no clock is set, and an
  unplanned colregs practice run still draws without end. `isDefaultPlan()` is
  what the drills check, and `src/__tests__/session.test.ts` pins the contract.
- Widening is deliberate: a weak-spots run puts the weak questions first and
  tops the queue up from the rest of the pool, so asking for 20 when only 6 are
  weak still gives 20.
- Exam mode's 15s per question is fixed and a plan does not override it; the
  plan's timer sets up a *timed practice* run instead. On the compass, a count
  applies to the exam only - practice and timed attack are sixty-second runs,
  not decks.

## Design system
The chart table: parchment and navy ink by day, brass on navy at the night helm.

- `src/lib/theme.ts` holds both palettes as CSS custom properties (`--ct-bg`,
  `--ct-ink`, `--ct-brass`, `--ct-stbd`, `--ct-port`, `--ct-line`, …). They are
  custom properties rather than Tailwind classes because they switch with the
  theme at runtime, and the palette was never put in a Tailwind config (there
  is one now, `tailwind.config.js`, but it holds no theme).
- `ChartFrame` puts those properties on its root and ships the one stylesheet
  everything draws from: `.ct-solid` / `.ct-ghost` / `.ct-link` buttons,
  `.ct-card`, `.ct-option`, `.ct-rule` (the dashed rope divider), `.ct-quizbody`
  and `.ct-rosebody` layouts, and `.ct-instrument`. Hover states live there as
  real CSS because inline styles cannot express `:hover`.
- The soundings row along the top edge is chart texture, declared in
  ChartFrame.
- `.ct-instrument` is the dark panel the diagrams sit on. The rose and the
  lights are drawn in white and signal colours and would vanish on the
  parchment, so that panel stays navy in both themes and reads as a lit
  instrument standing on the chart table.
- Fonts (Big Shoulders Stencil, Fraunces, IBM Plex Sans, IBM Plex Mono) are
  injected at runtime by `src/lib/fonts.ts`; every consumer declares a full
  fallback stack.
- **`STENCIL` is the FATHOM wordmark and nothing else.** Every heading that
  used to be stencilled - section headers, screen titles, card titles - is
  `DISPLAY` (Fraunces), set through the `.ct-display` class. Screen titles are
  sentence case now: the uppercase and the wide letterspacing were there to
  suit a condensed stencil. `renderSmoke.test.tsx` pins the wordmark to the
  stencil face so a later sweep cannot take it too.
- The sheet is responsive: 760px, stepping to 960 / 1180 / 1280 at 1024 /
  1440 / 1800. Card grids (`.ct-cardgrid`) gain columns with it; prose caps
  itself at `.ct-measure`, and the quiz and rose bodies cap at 1000px so a
  wide window makes the diagram bigger rather than the option text longer.

## Chart Table
`src/drills/charttable/` was a standalone drill that carried this design. The
design is now the site's, so the drill was retired and then deleted — its
`index.tsx`, `CategoryIndex`, `QuizScreen` and `ResultsScreen` are gone, and
the folder with them; see git history for the originals. Everything worth
keeping had already moved out: the theme, frame, visual panel, settings
screen, syllabus, progress ledger, citation reader and `CategoryDetail` now
live in `src/lib` and `src/components`. The `charttable:` localStorage key
prefixes in `prefs.tsx` and `progress.ts` stay as they are, for the same
reason the `nauticalmaster` namespace does.

## Drill Pattern
Every drill follows this structure:
- Practice / Exam modes
- Question prompt + visual aid + multiple choice answers
- Multiple-choice options are shuffled per draw, never rendered in bank order,
  and correctness is decided on option **text**, never on an index
- Shared scoring and timer logic pattern from compass drill
- **No drill advances by itself.** In colregs, answering or the clock expiring
  locks the options and shows a "Next question" button; that button is the only
  thing that calls `advance()`. The 1.2s/2s auto-advance that used to follow
  an answer was not long enough to read an explanation and a rule citation.
  `src/__tests__/quizFlow.test.tsx` pins it. The compass rose followed suit in
  the accessibility session: it used to jump to the next point 0.5-1.5s after
  a click, which left no time to hear the result and nowhere for focus to go,
  and now shows a "Next point" button. Its exam clock is per question and
  freezes once the question is answered; the sixty-second practice and timed
  runs keep their one clock running across the Next press, as they always
  ran across the auto-advance.

## Answering, for keyboard and screen-reader users
The portfolio audit's accessibility finding (no announcement of the result,
focus left on a disabled button) is **closed** (2026-10-06). The contract,
shared by both drills through `src/lib/answerA11y.tsx`:

- **One live region per run**, `role="status"`, polite, `aria-atomic`. It is
  rendered empty with the question view and only its text changes - never
  mount it already filled. Text is derived from state: `''` before an answer,
  `Correct.` / `Incorrect. The answer is <answer>.` / `Time expired. The
  answer is <answer>.` after, and `''` again when the next question loads.
  The colregs exam withholds the verdict on screen, so it says only
  `Answer recorded.` (or `Time expired.`). On the compass the answer is a
  position: `The answer is point 20 of 32.`
- **Focus.** Answering moves focus to the feedback heading (`h3.ct-feedback`,
  `tabIndex={-1}`), so the explanation reads next and Next is the next Tab.
  The colregs exam has no feedback to read and focuses Next instead. Next
  moves focus to the new prompt (`h2`, `tabIndex={-1}`); the results screen
  moves it to the result heading. Focus is never left on an option.
- **No double announcement.** The feedback heading's visible verdict
  ("Correct") is `aria-hidden` and the heading is named "Explanation" /
  "Feedback" for assistive tech, because the live region already said the
  verdict with the answer.
- **Options.** Real `<button>`s. Answered options get `aria-disabled`, NOT
  `disabled` - a disabled button drops focus to the page - and the click
  handler ignores them. Their state is in words: an sr-only ", correct
  answer" / ", your answer, incorrect", and in the exam a visible "your
  answer" (the brass border alone was colour alone).
- **Compass points** are buttons in clockwise DOM order, named by POSITION -
  `Point 3 of 32` - never by name, because the question is "find NNE" and a
  button called NNE would answer it. The rose's group label says the numbering
  runs clockwise from north (or dead ahead), which is point 1 - the same thing
  the N on the rose tells a sighted reader. After an answer the right point
  shows a tick and a wrong pick a cross, as well as green against orange.
  The control panel (prompt, then feedback and Next) is first in the DOM and
  the rose is drawn first by `.ct-rosebody > .ct-instrument { order: -1 }`, so
  Tab goes prompt -> points.
- **Focus ring**: one 2px brass outline on `:focus-visible` for options,
  buttons and the focused headings (ChartFrame); compass points use literal
  Tailwind `focus-visible:ring-2 focus-visible:ring-amber-300` classes, on
  the navy instrument in both themes.

**Accessible names must not leak answers.** Alt text, `aria-label` and
`title` on anything shown before an answer describe the FRAME, never the
subject ("Photograph of an anchor, shown for identification"). The
`fathom-imagery` photo rules already said this for photographs; it now applies
to every accessible name, including the compass points.

`src/__tests__/answerA11y.test.tsx` pins all of it with Testing Library in
jsdom: focus after answering and after Next in both drills; live region text
before, after a right and a wrong answer, and in the exam; options focusable
with their state in words; no alt / aria-label / title in any of the 123
visuals drawn before an answer (2026-10-09) carrying a word only its answer uses; no compass point named for
itself; and axe-core (16 rules evaluated) finding zero violations on an
unanswered and an answered colregs, photo and compass question. axe cannot
judge colour contrast in jsdom; it reports it as incomplete, not passed.

Still open:
- **A real screen-reader pass by hand** (NVDA or VoiceOver) has not been
  done. Everything above is verified in jsdom and with a keyboard in Chrome
  against `npm run preview`, not by listening.
- **Drawn visuals have no text equivalent.** Lights, flags, highlighted boat
  parts and the like are SVGs with a stray caption at most. The flipped
  day-shape and sound questions describe the signal in their prompt, so
  they can be answered without the picture, but most drawn questions cannot.
  Describing them is content work and must not describe the answer (the
  lights, not the vessel).

Resolved (2026-10-09): **ds-12 cites Rule 30(e)**, not 30(g). It asks for the
under-7-metre anchor exemption, which is 30(e) in both the International
Rules and 33 CFR 83.30(e) (checked against the eCFR text). Inland 30(g) is a
different exemption, under 20 metres at anchor in a Coast Guard special
anchorage, and the explanation now names it as the reason the "under 20
metres, anywhere" option is wrong. `citationFormat.test.ts` pins it by hand,
since the format checks cannot tell a wrong rule from a right one.

Resolved (2026-10-09): **no drawing shows its own answer.** 31 questions used
to: day shapes that asked "which shape?" and drew it, sound signals that asked
"which signal?" and drew it, and four give-way scenarios (vh-01, vh-02, vh-09,
vh-17) that labelled the vessel the answer names. The fixes:
- Flipped to the identify direction, as the navigation lights were: ds-01,
  03, 04, 07, 08, 10 and ss-01 to 06, 10 to 15. The drawing is the signal,
  and the question asks what it means.
- Dropped where the flip was a copy of an existing question: ds-02, 05, 06,
  09 and 15 (vt-01 to vt-05), ds-11 (ds-04) and ds-14 (ds-01).
- Drawing shown only after answering, for the two that cannot be flipped:
  ss-07 and ss-16 ask how long a blast lasts, which the legend states.
  That list is `QUESTION_VISUAL_AFTER_ANSWER`, and a test pins it by hand.
- Labels: a scenario vessel marked `typeAfterAnswer` is drawn unlabelled
  until the answer.

**The rule: a visual shown before the answer is the stimulus, never the
answer.** A question that asks for a configuration ("which shape", "which
signal", "which lights", "how many balls", "where is it shown") gets no
drawing of that configuration before it is answered. Either flip it, or show
the drawing only after the answer. Two more rules came with it:
- **One drawing, one right answer.** Several signals mean more than one thing
  (Rule 35(c) is six vessel types; a lone diamond is either end of a long
  tow), so the right option is the grouped answer, and no distractor may be
  another correct reading.
- **Say "under the International Rules"** in a sound prompt whenever the
  Inland Rules give those blasts a different meaning: one and two short
  blasts, the overtaking signals, and one prolonged blast when leaving a
  berth (33 CFR 83.34).

The guard is the "no drawing shows its own answer" block in
`answerA11y.test.tsx`, and it has no allowlist. For lights, shapes and sound
drawings it rejects an answer worded in the drawing's own terms, a bare-count
answer and a configure-direction prompt. It rejects a pre-answer drawing that
labels a vessel class the answer names, and, where two questions draw exactly
the same thing, it rejects either one offering the other's answer as a
distractor.
- **VisualPanel and ScenarioCard are siblings and their keys must differ.**
  Both were keyed on the bare question id; React's answer to duplicate sibling
  keys is that children "may be duplicated and/or omitted", and it stopped
  unmounting the diagram, so every picture drawn piled up in the DOM under the
  questions after it - including the ones built with no diagram on purpose.
  They are `visual-<id>` and `card-<id>` now. Same test pins it, and it is a
  DOM test (jsdom, via a `@vitest-environment` docblock) because a single
  static render cannot see a reconciliation bug.

## Photographic assets
Anchors and clouds are PHOTOGRAPHS, not drawings: `AnchorDisplay` and
`CloudDisplay` render `<img>` from `src/assets/`. The line art for both went
through several rounds of correction without reading as the real thing, and
five anchors told apart by shape - or a mackerel sky, which is a texture - are
exactly where an illustration has to beat a photograph to be worth drawing.
Every other visual category is still drawn, and follows one at a time.

Two rules, and they are the reason this is here rather than in the skill:

- **No image may name its own answer.** A drawing could not leak because it
  carried no text; a photograph can - a maker's plate, a fluke stamped with its
  pattern name, a caption baked into a product shot - and a second specimen of
  a different type in frame counts too. Vet every candidate at full resolution
  BEFORE cropping. The bottom-matching questions (an-06 … an-13) still get no
  picture at all.
- **No image ships without a licence and a credit.** Public domain or Creative
  Commons only; the CC ones require attribution. If no properly licensed image
  can be found for a form, leave that one on its drawing and SAY SO rather than
  reaching for an unlicensed one.

### How credits render
All 21 photos are credited on-site, in two places, from `src/lib/imageCredits.ts`.
17 of them are CC BY / BY-SA and legally need it (that is the portfolio
audit's "17 uncredited"); the other 4 - three public domain, one CC0 - are
credited anyway, so the rule is simply "every photo".

- **Under each photo**, inside the instrument panel: `PhotoCredit`, wired in
  `VisualPanel` (which decides per question whether the visual is a photo -
  buoys, distress and PFDs are photos for some names and drawings for others).
  Styled by `.ct-credit` in ChartFrame with fixed colours, because the panel is
  navy in both themes.
- **About → Photo credits** (`#credits`): every photo with subject, file title
  linked to its Commons page, author and licence linked to its deed.

**The no-leak rule for credit text.** Before a question is answered, the
credit line shows `Photo <author> · <licence>` and nothing else. Never the file
title or subject - Commons titles name the answer ("Bruce anchor in
Gdansk.jpg"). The author link goes to `?curid=<pageId>` rather than the
`source` URL, because a browser shows the href on hover and the `source` URL
spells out the filename. The title is added once the question is answered.
`src/__tests__/photoCredit.test.tsx` renders every photo question unanswered
and fails on the answer label, a word only the answer uses, the title, the
subject, or a filename in an href. `imageCredits.test.ts` requires author,
licence, licence URL, source URL and page id for every photo (no waiver for
PD/CC0), and checks each CC licence name against its deed URL. Public-domain
photos link to the Commons licence tag they carry (PD-self,
PD-USGov-Military-Air_Force).

The credit line needs nothing special for screen readers: it is plain text
and two links in reading order after the photo, and the photo's alt names the
frame, not the subject. The accessibility session checked it in the
accessibility tree of an unanswered question.

How to source, vet, crop and wire one up - and the credits files those rules
are enforced by - is in the `fathom-imagery` skill, not here.

## Deployment
Pushing to main deploys automatically - see .github/workflows/ci.yml, which
runs tsc, build and test on every push and then runs this same `deploy` script
on main only. The workflow calls the npm script rather than restating the
gh-pages flags, so the --remove fix below lives in exactly one place. Running
`npm run deploy` by hand still works but is no longer necessary.

`npm run deploy` is `gh-pages -d dist --nojekyll` plus an explicit `--remove`
glob. gh-pages' default remove pattern (`.`) does not match dotfiles, so any
dotfile that ever lands on the gh-pages branch survives every later deploy —
that is how `.claude/settings.local.json` and `.gitignore` stayed publicly
served. The glob wipes stray dotfiles (but not `.git`); `.nojekyll` is
recreated after the remove step. Never deploy with `-d .` or `--dotfiles`.

PWA plumbing (manifest, service worker, runtime <head> injection) and the app
icon/favicon workflow live in the `fathom-assets` skill, not here.

## Notes
- The project was renamed NauticalMaster → Fathom (repo, Pages URL, Vite base,
  document title). The old /nauticalmaster/ URL is dead by design.
- vite.config.ts is finalized — do not modify it under any circumstances. The
  one authorized edit was the rename of the base path; it is now /fathom/ and
  must not be removed or changed again. The Tailwind build move was authorized
  to touch it but did not need to: Vite loads `postcss.config.js` by itself.
- Do not use @/ path aliases — they are not configured
- index.html is finalized - do not modify it under any circumstances. A
  one-off authorization (the Tailwind build move, 2026-10-06) made exactly two
  edits: the `cdn.tailwindcss.com` script tag was removed and `<title>` changed
  from NauticalMaster to Fathom. A second (2026-10-09) made one: the unused
  Space Grotesk `<link>` was deleted. It has no meta description or og tags,
  and no font links: every font comes from `src/lib/fonts.ts`.
  installTitle() in src/lib/title.ts still sets the title at runtime, as a
  backstop.
  - The font removal was checked on `npm run preview` in headless Chrome over
    CDP: the Space Grotesk stylesheet request is gone, no Space Grotesk face
    was ever downloaded, and the computed font-family of every element, the
    loaded faces and the platform fonts rendered for the headings, body and
    cards were identical before and after.
- Dependencies: `npm audit --omit=dev` is clean (0). The full audit lists 14
  (vite <=6.4.2, @babel/core, braces, undici and others), all in the dev and
  build toolchain - nothing a user's browser loads.
- Tests: 14 files / 1048 tests (2026-10-09). Plain `npm test`, no flags, on
  any Node from 22 up.
- **Node versions.** CI runs Node 22; `.nvmrc` says 22 and `engines` says
  `>=22`. `npm test` passes unflagged on 22, 24, 25 and 26 (verified on
  Windows, with the npm script itself running on each version).
  - **Why `src/__tests__/setup/jsdomStorage.ts` exists:** from Node 25, Node
    has a global `localStorage` / `sessionStorage` of its own, and without
    `--localstorage-file` it is useless (an empty object on 25, `undefined` on
    26). Vitest's jsdom environment does not override a global the Node global
    already has unless it is on Vitest's own key list, and storage is not, so
    Node's won, and `window` is the global there, so the app's
    `window.localStorage` got it too. 28 tests failed on 25 and 26. The setup
    file puts jsdom's storage back on jsdom files only. It feature-detects
    instead of passing `--no-experimental-webstorage`, because Node could
    rename or drop an experimental flag, and an unknown flag stops every
    worker from starting. It is plain JS with no shell syntax, so it behaves
    the same on macOS. The old `NODE_OPTIONS=...` instruction is retired.
- localStorage keys still use the `nauticalmaster` namespace (src/lib/storage.ts)
  on purpose, so existing best scores survive the rename. Do not "fix" it.
- The local working directory is still named nauticalmaster; only the GitHub
  repo was renamed.
- Always run `npm run build` after changes and fix all TS errors before finishing
- The working copy is `C:\devwork\github projects\nauticalmaster`, **not** inside
  OneDrive (`%OneDrive%` is `C:\Users\iango\OneDrive`). A cleanup audit
  (2026-10-06) found no conflict copies, cloud-only placeholders, zero-byte
  files or `~$`/`.tmp` leftovers, and all 11 test files on disk
  (`src/__tests__`) are collected by Vitest: 11 files / 1010 tests passing,
  build clean. Nothing was deleted, hydrated or quarantined, and no
  `.gitignore` entries were added since no such files exist.
- Account renamed to `iangopen` (Sept 2026). Homepage field, git remote, README
  badge/link and this file all use it now; live site is
  https://iangopen.github.io/fathom/. Old-account strings still exist in git
  history only (left alone on purpose).
- `.claude/settings.local.json` is untracked and gitignored; it was removed from
  tracking earlier (c588140). It is still in history but only held an npm/npx
  permission allowlist, no secrets. History was not rewritten.
