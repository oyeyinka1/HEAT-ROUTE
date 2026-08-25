import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CWJmh1BE.mjs";
import { i as objectType, n as arrayType, o as tupleType, r as numberType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fortyguard-CWdJIj0v.js
var import_jsx_runtime = require_jsx_runtime();
function ThermalLegend({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `glass-panel flex items-center gap-3 rounded-full px-4 py-2 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-xs",
				children: "Cooler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "thermal-bar h-1.5 w-24 rounded-full sm:w-36" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-xs",
				children: "Hotter"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Server function to fetch and cache FortyGuard temperature tiles for a set of routes
*/
var getTemperatureHeatmap = createServerFn({ method: "POST" }).validator(objectType({ routesCoordinates: arrayType(arrayType(tupleType([numberType(), numberType()]))) })).handler(createSsrRpc("18953c3e96f1fbcf3e2ef03dd924a79576ec1301eb37c15083e132c1cdc5565e"));
/**
* Server function to fetch real FortyGuard 12-hour forecast at 5 time offsets:
* Now (+0h), +3h, +6h, +9h, +12h.
*/
var getRouteForecast = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(20),
	currentTiles: arrayType(anyType()).optional()
})).handler(createSsrRpc("a6f30602e4362437b274a3a6b2c7fe6920610c50e043e40cc2c8b1c3f9b6eac6"));
/**
* Server function to fetch real cooler route thermal metrics and tiles
* (using the real forecast data for the active route's actual coordinates) for the simulated condition change.
*/
var getCoolerRerouteData = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(21),
	currentPeakTempC: numberType().optional(),
	currentHighHeatMinutes: numberType().optional()
})).handler(createSsrRpc("7773f1b38864253439cd185d954a1108c5027a663acc3c7021b9711e8aafa1ed"));
//#endregion
export { getTemperatureHeatmap as a, getRouteForecast as i, createSsrRpc as n, getCoolerRerouteData as r, ThermalLegend as t };
