# Fathom

Vite + React + TypeScript app deployed to GitHub Pages at:
https://iangopen.github.io/fathom/

## Stack
- Tailwind CSS (CDN in index.html) — now only inside the drill *diagrams*
  (CompassRose, LightDisplay and friends), which were never restyled.

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
  custom properties rather than Tailwind classes because the palette is not in
  the Tailwind config, and index.html — where a CDN Tailwind config would have
  to live — is finalized.
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
- **The colregs quiz never advances by itself.** Answering, or the clock
  expiring, locks the options and shows a "Next question" button; that button
  is the only thing that calls `advance()`. There is no auto-advance timeout -
  the 1.2s/2s one that used to follow an answer was not long enough to read an
  explanation and a rule citation. `src/__tests__/quizFlow.test.tsx` pins it.
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
credited anyway, so the rule is simply "every photo". Since this landed the
suite is 12 files / 1017 tests.

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

Still open: the credit line is static text, not announced to screen readers
in any special way, which belongs with the answer-accessibility session.

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
  must not be removed or changed again.
- Do not use @/ path aliases — they are not configured
- index.html is finalized - do not modify it under any circumstances. Its
  <title> still says NauticalMaster; that is deliberate and harmless — the real
  title is set at runtime by installTitle() in src/lib/title.ts, called from
  main.tsx, the same injection pattern used by installFavicon().
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
