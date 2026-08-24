import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-B72BJIU4.js
var $$splitComponentImporter = () => import("./app-B_BtzJIa.mjs");
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
