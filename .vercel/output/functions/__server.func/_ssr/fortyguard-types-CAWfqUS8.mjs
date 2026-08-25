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
//#region node_modules/.nitro/vite/services/ssr/assets/fortyguard-types-CAWfqUS8.js
/**
* Ray-casting algorithm for Point in Polygon check
* pt: [lon, lat], polygon: [[lon, lat], ...]
*/
function isPointInPolygon(pt, polygon) {
	const [x, y] = pt;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
/**
* Pure calculation function to sample points along a route geometry, locate intersecting
* temperature tiles, and calculate peakTempC, avgTempC, and highHeatMinutes.
* Fully client-safe (no Node.js or network dependencies).
*/
function calculateRouteThermalMetrics(routeCoordinates, durationMin, tiles, defaultBaselineTempC = 38.2, samplePointsCount = 20, thresholdC = 38) {
	if (!routeCoordinates || routeCoordinates.length === 0) return {
		peakTempC: defaultBaselineTempC,
		avgTempC: defaultBaselineTempC,
		highHeatMinutes: 0,
		sampledPointsCount: 0
	};
	const sampledPoints = [];
	const totalCoords = routeCoordinates.length;
	if (totalCoords <= samplePointsCount) sampledPoints.push(...routeCoordinates);
	else for (let i = 0; i < samplePointsCount; i++) {
		const idx = Math.min(Math.floor(i / (samplePointsCount - 1) * (totalCoords - 1)), totalCoords - 1);
		sampledPoints.push(routeCoordinates[idx]);
	}
	const sampledTemps = [];
	sampledPoints.forEach((pt) => {
		let matchedTile;
		for (const tile of tiles) {
			const [minX, minY, maxX, maxY] = tile.bbox;
			if (pt[0] >= minX && pt[0] <= maxX && pt[1] >= minY && pt[1] <= maxY) {
				if (isPointInPolygon(pt, tile.polygon)) {
					matchedTile = tile;
					break;
				}
			}
		}
		if (matchedTile) sampledTemps.push(matchedTile.averageTempC);
		else if (tiles.length > 0) {
			let closestTile = tiles[0];
			let minDist = Infinity;
			for (const t of tiles) {
				const d = Math.hypot(pt[0] - t.polygon[0][0], pt[1] - t.polygon[0][1]);
				if (d < minDist) {
					minDist = d;
					closestTile = t;
				}
			}
			sampledTemps.push(closestTile.averageTempC);
		} else sampledTemps.push(defaultBaselineTempC);
	});
	const peakTempC = Number(Math.max(...sampledTemps).toFixed(1));
	const avgTempC = Number((sampledTemps.reduce((acc, v) => acc + v, 0) / sampledTemps.length).toFixed(1));
	const highHeatPoints = sampledTemps.filter((t) => t >= thresholdC).length;
	return {
		peakTempC,
		avgTempC,
		highHeatMinutes: Math.round(highHeatPoints / sampledTemps.length * durationMin),
		sampledPointsCount: sampledTemps.length
	};
}
//#endregion
export { calculateRouteThermalMetrics as t };
