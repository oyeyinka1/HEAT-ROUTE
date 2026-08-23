//#region node_modules/.nitro/vite/services/ssr/assets/heatroute-data-BOhtU1ol.js
var routeAnalysis = {
	origin: "Current location",
	destination: "Encanto Park, Phoenix",
	highHeatThresholdC: 36,
	currentTempC: 35.2,
	routes: [{
		id: "r-fastest",
		kind: "fastest",
		label: "Fastest",
		geometry: [
			[-112.074, 33.4484],
			[-112.074, 33.451],
			[-112.0741, 33.4552],
			[-112.0741, 33.4601],
			[-112.0742, 33.4655],
			[-112.0743, 33.471],
			[-112.0743, 33.475],
			[-112.0775, 33.4751],
			[-112.0796, 33.4751],
			[-112.0796, 33.4772]
		],
		recommended: false,
		metrics: {
			durationMin: 17,
			distanceKm: 1.2,
			peakTempC: 39.4,
			avgTempC: 37.1,
			highHeatMinutes: 11
		}
	}, {
		id: "r-heat-safe",
		kind: "heat-safe",
		label: "Heat-Safe",
		geometry: [
			[-112.074, 33.4484],
			[-112.0765, 33.4484],
			[-112.0772, 33.4525],
			[-112.0772, 33.458],
			[-112.0773, 33.4635],
			[-112.0774, 33.4695],
			[-112.0775, 33.4745],
			[-112.0796, 33.4745],
			[-112.0796, 33.4772]
		],
		recommended: true,
		metrics: {
			durationMin: 20,
			distanceKm: 1.4,
			peakTempC: 34.8,
			avgTempC: 33.6,
			highHeatMinutes: 4
		}
	}],
	rationale: {
		goal: "Minimise time spent above the high-heat threshold",
		routesEvaluated: 2,
		dataSource: "FortyGuard street-level temperature intelligence (2 m resolution)",
		selected: "Heat-Safe route",
		reason: "This route keeps you on shaded, cooler street segments for most of the walk. It lowers estimated high-heat exposure the most while staying inside the acceptable travel-time penalty.",
		tradeoff: {
			extraTravelMin: 3,
			heatMinutesSaved: 7,
			reductionPct: 63
		}
	}
};
var navSteps = [
	{
		instruction: "Head north on N Central Ave",
		detail: "Main arterial corridor",
		inMeters: 400
	},
	{
		instruction: "Turn left onto W Roosevelt St",
		detail: "Tree-lined pedestrian street",
		inMeters: 350
	},
	{
		instruction: "Turn right onto N 3rd Ave",
		detail: "Canopy-shaded residential sidewalk",
		inMeters: 600
	},
	{
		instruction: "Continue onto Encanto Blvd path",
		detail: "Park entrance greenway",
		inMeters: 250
	},
	{
		instruction: "Arrive at destination",
		detail: "Phoenix, AZ",
		inMeters: 100
	}
];
var analysisStages = [
	"Reading street-level temperature grid",
	"Generating candidate walking routes",
	"Scoring high-heat exposure per segment",
	"Balancing exposure against travel time"
];
var routeAccent = {
	fastest: "var(--fastest)",
	balanced: "var(--balanced)",
	"heat-safe": "var(--safe)"
};
//#endregion
export { routeAnalysis as i, navSteps as n, routeAccent as r, analysisStages as t };
