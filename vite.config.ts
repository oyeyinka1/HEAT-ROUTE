import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Rollup plugin that prepends browser-global polyfills to every Nitro server chunk.
// This guarantees window/self/document/screen are defined before any vendor module
// (leaflet, react-leaflet, TanStack Router) evaluates during SSR.
function browserGlobalsPolyfill() {
  const POLYFILL = `
// SSR Browser Globals Polyfill
if (typeof self === "undefined") globalThis.self = globalThis;
if (typeof window === "undefined") globalThis.window = globalThis;
if (typeof screen === "undefined") globalThis.screen = { deviceXDPI: 96, logicalXDPI: 96 };
if (typeof devicePixelRatio === "undefined") globalThis.devicePixelRatio = 1;
if (typeof navigator === "undefined") globalThis.navigator = { userAgent: "", platform: "" };
if (typeof document === "undefined") {
  const noop = () => ({});
  const fakeEl = () => ({
    style: {},
    setAttribute: noop,
    getAttribute: noop,
    appendChild: noop,
    getContext: () => null,
  });
  globalThis.document = {
    documentElement: { style: {} },
    createElement: fakeEl,
    createElementNS: fakeEl,
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    removeEventListener: noop,
    createTextNode: noop,
    head: { appendChild: noop },
    body: { appendChild: noop },
  };
}
// End SSR Browser Globals Polyfill
`;

  return {
    name: "browser-globals-polyfill",
    banner() {
      return POLYFILL;
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    rollupConfig: {
      plugins: [browserGlobalsPolyfill()],
    },
  },
});
