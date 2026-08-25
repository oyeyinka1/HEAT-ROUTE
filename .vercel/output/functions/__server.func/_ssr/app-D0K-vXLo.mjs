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
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-D0K-vXLo.js
var $$splitComponentImporter = () => import("./app-Ct_laTQo.mjs");
var Route = createFileRoute("/app")({
	head: () => ({ meta: [
		{ title: "HeatRoute — Heat-aware walking navigation" },
		{
			name: "description",
			content: "Enter a destination and compare walking routes by high-heat exposure, peak temperature and travel time before you start navigating."
		},
		{
			property: "og:title",
			content: "HeatRoute — Heat-aware walking navigation"
		},
		{
			property: "og:description",
			content: "Compare fastest and heat-safe walking routes using street-level temperature intelligence."
		}
	] }),
	loader: async () => {
		return {
			directions: null,
			heatmap: null
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
