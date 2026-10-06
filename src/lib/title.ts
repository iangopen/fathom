// Sets the document title at runtime. Same approach as installFavicon() in
// ./favicon.
//
// This was the only way to get "Fathom" into the tab while index.html was
// finalized with a stale <title>. index.html now says Fathom itself (changed
// under the one-off authorization for the Tailwind build move), so this is a
// backstop that keeps the two from drifting rather than a fix.

const TITLE = 'Fathom';

export function installTitle(): void {
  try {
    if (typeof document === 'undefined') return;
    document.title = TITLE;
  } catch {
    // A title is cosmetic - never let it stop the app from mounting.
  }
}
