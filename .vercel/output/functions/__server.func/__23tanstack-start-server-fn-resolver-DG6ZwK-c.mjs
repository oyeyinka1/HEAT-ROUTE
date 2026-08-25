//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DG6ZwK-c.js
var manifest = {
	"18953c3e96f1fbcf3e2ef03dd924a79576ec1301eb37c15083e132c1cdc5565e": {
		functionName: "getTemperatureHeatmap_createServerFn_handler",
		importer: () => import("./_ssr/fortyguard-Cm3-28yD.mjs")
	},
	"6b060ee3fe4e23e765c805794e6551e62d216cac8ee67283335311f6602c2b00": {
		functionName: "searchPlaces_createServerFn_handler",
		importer: () => import("./_ssr/geocoding-CqZE6-sL.mjs")
	},
	"7773f1b38864253439cd185d954a1108c5027a663acc3c7021b9711e8aafa1ed": {
		functionName: "getCoolerRerouteData_createServerFn_handler",
		importer: () => import("./_ssr/fortyguard-Cm3-28yD.mjs")
	},
	"a6f30602e4362437b274a3a6b2c7fe6920610c50e043e40cc2c8b1c3f9b6eac6": {
		functionName: "getRouteForecast_createServerFn_handler",
		importer: () => import("./_ssr/fortyguard-Cm3-28yD.mjs")
	},
	"da307b03eb2928ac320c94efda38ed2c57241f2a5d01447cbabc69165b19a181": {
		functionName: "getWalkingRoutes_createServerFn_handler",
		importer: () => import("./_ssr/directions-BpzL2K33.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
