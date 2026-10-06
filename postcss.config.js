// Vite picks this up on its own; vite.config.ts needs no change for it.
// No autoprefixer: the Play CDN this replaces did not prefix either.
export default {
  plugins: {
    tailwindcss: {},
  },
};
