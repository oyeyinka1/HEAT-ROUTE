import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThermalMap-CLxbiU-m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThermalMap(props) {
	const [MapComp, setMapComp] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") import("./InteractiveMap-B8tQBLA3.mjs").then((m) => {
			setMapComp(() => m.InteractiveMap);
		});
	}, []);
	if (!MapComp) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: props.className || "absolute inset-0 overflow-hidden bg-background/50 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-xs text-muted-foreground animate-pulse",
			children: "Loading map..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapComp, { ...props });
}
//#endregion
export { ThermalMap, ThermalMap as default };
