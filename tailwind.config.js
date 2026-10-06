// Tailwind is compiled at build time. It used to be the v3 Play CDN script in
// index.html, generating CSS in the browser; the version is pinned to the one
// that CDN served (3.4.17) so the move changes no defaults - border colours,
// ring widths and the like differ between majors.
//
// There was never an inline tailwind.config on the CDN, so there is nothing
// to port: the theme is stock v3. The app's own palette lives in CSS custom
// properties (src/lib/theme.ts), not here.
//
// The scanner only sees class names written out whole in the source. A class
// assembled from pieces (`bg-${colour}-500`) is not in any file and will be
// silently missing from the CSS - write every class as a complete literal.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
