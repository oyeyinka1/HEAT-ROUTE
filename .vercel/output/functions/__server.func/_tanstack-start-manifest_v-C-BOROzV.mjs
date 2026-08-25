// SSR Browser Globals Polyfill
if (typeof self === "undefined") globalThis.self = globalThis;
if (typeof window === "undefined") globalThis.window = globalThis;
if (typeof screen === "undefined") globalThis.screen = {
	deviceXDPI: 96,
	logicalXDPI: 96
};
if (typeof devicePixelRatio === "undefined") globalThis.devicePixelRatio = 1;
if (typeof navigator === "undefined") globalThis.navigator = {
	userAgent: "",
	platform: ""
};
if (typeof document === "undefined") {
	const noop = () => ({});
	const fakeEl = () => ({
		style: {},
		setAttribute: noop,
		getAttribute: noop,
		appendChild: noop,
		getContext: () => null
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
		body: { appendChild: noop }
	};
}
// End SSR Browser Globals Polyfill
//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-C-BOROzV.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "C:/Users/MICHAEL/Desktop/HEAT-ROUTE/heatroute-navigator-main/src/routes/__root.tsx",
		children: [
			"/",
			"/app",
			"/heat-intelligence"
		],
		preloads: [
			"/assets/index-Fa_MKlIx.js",
			"/assets/rolldown-runtime-CbXtAM7H.js",
			"/assets/react-dom-trZt-Fm3.js",
			"/assets/preload-helper-HmiM4iaq.js",
			"/assets/link-Ff4Sj5oQ.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-Fa_MKlIx.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/MICHAEL/Desktop/HEAT-ROUTE/heatroute-navigator-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DDT6Sflq.js",
			"/assets/heatroute-data-DjQSLUE1.js",
			"/assets/footprints-bUsWniBv.js"
		]
	},
	"/app": {
		filePath: "C:/Users/MICHAEL/Desktop/HEAT-ROUTE/heatroute-navigator-main/src/routes/app.tsx",
		children: void 0,
		preloads: [
			"/assets/app-CEhaiqZN.js",
			"/assets/fortyguard-BGMyLE7T.js",
			"/assets/heatroute-data-DjQSLUE1.js",
			"/assets/footprints-bUsWniBv.js"
		]
	},
	"/heat-intelligence": {
		filePath: "C:/Users/MICHAEL/Desktop/HEAT-ROUTE/heatroute-navigator-main/src/routes/heat-intelligence.tsx",
		children: void 0,
		preloads: [
			"/assets/heat-intelligence-BAGt4emD.js",
			"/assets/fortyguard-BGMyLE7T.js",
			"/assets/heatroute-data-DjQSLUE1.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
