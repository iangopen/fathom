// Gives jsdom test files jsdom's own Web Storage, whatever Node they run on.
//
// From Node 25, Node has a global localStorage / sessionStorage of its own.
// Started without --localstorage-file it is an empty object with no methods.
// Vitest's jsdom environment copies the window's properties onto the global,
// but it skips any that the global already has, unless they are on its own
// fixed list, and the storage pair is not. So Node's object wins. And because
// `window` IS the global in that environment, the app's window.localStorage
// gets Node's object too. That broke 27 tests on Node 25 and none on 22 or 24.
//
// Putting jsdom's storage back here, rather than passing
// --no-experimental-webstorage to the workers, means no Node flag is named:
// a flag Node later renames or drops would stop every worker from starting.
// Files on the node environment have no `jsdom` global and are left alone;
// ledger and prefs install their own window stub.
const dom = (globalThis as { jsdom?: { window: Window } }).jsdom;

if (dom) {
  for (const key of ['localStorage', 'sessionStorage'] as const) {
    Object.defineProperty(globalThis, key, {
      value: dom.window[key],
      configurable: true,
      writable: true,
    });
  }
}
