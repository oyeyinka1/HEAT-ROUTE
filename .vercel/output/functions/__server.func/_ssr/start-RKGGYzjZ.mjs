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
import { n as createMiddleware, t as createCsrfMiddleware } from "./createCsrfMiddleware-B2To0gPJ.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-RKGGYzjZ.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware, csrfMiddleware] }));
//#endregion
export { startInstance };
