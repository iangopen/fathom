# Session history

Newest first. CLAUDE.md describes the current state; this file is the log of
how it got there.

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
