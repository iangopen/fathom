import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts, which is finalized and must not be modified.
// Vitest prefers this file when both are present, so the build config is left
// entirely alone.
export default defineConfig({
  test: {
    // Most files need no DOM and run on node. The ones that mount components
    // opt into jsdom with a @vitest-environment docblock.
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Node 25+ has a global localStorage that hides jsdom's; this puts jsdom's
    // back so `npm test` needs no flags on any Node. See the file.
    setupFiles: ['src/__tests__/setup/jsdomStorage.ts'],
  },
});
