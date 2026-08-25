import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as objectType, n as arrayType, o as tupleType, r as numberType, t as anyType } from "../_libs/zod.mjs";
import { t as calculateRouteThermalMetrics } from "./fortyguard-types-CAWfqUS8.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
//#region node_modules/.nitro/vite/services/ssr/assets/fortyguard-BsdeOqdi.js
/** Safe runtime check for Node.js environment with process.cwd support */
function isNodeServer() {
	return typeof process !== "undefined" && typeof process.cwd === "function";
}
/**
* Returns a serverless-safe writable temporary cache directory.
* On Vercel Functions / AWS Lambda, process.cwd() is read-only; /tmp is the only writable directory.
*/
function getCacheDir() {
	if (!isNodeServer()) return null;
	try {
		const tmpBase = process.env.TMPDIR || process.env.TEMP || (typeof os !== "undefined" && typeof os.tmpdir === "function" ? os.tmpdir() : "/tmp");
		return path.join(tmpBase, "heatroute-cache");
	} catch {
		return null;
	}
}
function getCacheFile() {
	try {
		const dir = getCacheDir();
		return dir ? path.join(dir, "fortyguard_tiles_cache.json") : null;
	} catch {
		return null;
	}
}
function readKeyFromEnv() {
	let key;
	if (typeof process !== "undefined" && process.env) key = process.env.FORTYGUARD_API_KEY || process.env.VITE_FORTYGUARD_API_KEY || process.env.FG_API_KEY;
	if (!key && typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}) key = void 0;
	if (!key && isNodeServer()) try {
		const envPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const match = fs.readFileSync(envPath, "utf-8").match(/FORTYGUARD_API_KEY\s*=\s*(.+)/);
			if (match && match[1]) key = match[1].trim();
		}
	} catch {}
	return key;
}
function getCacheData() {
	try {
		const cacheFile = getCacheFile();
		if (!cacheFile || !isNodeServer()) return null;
		if (fs.existsSync(cacheFile)) {
			const raw = fs.readFileSync(cacheFile, "utf-8");
			return JSON.parse(raw);
		}
	} catch (err) {
		console.warn("[FortyGuard Service] Could not read cache file:", err);
	}
	return null;
}
function saveCacheData(data) {
	try {
		const cacheDir = getCacheDir();
		const cacheFile = getCacheFile();
		if (!cacheDir || !cacheFile || !isNodeServer()) return;
		if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
		fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2), "utf-8");
	} catch (err) {
		console.warn("[FortyGuard Service] Failed to write cache file (skipping cache):", err);
	}
}
/**
* Fetches real-time ambient temperature and 12-hour hourly forecast from meteorological stations
* for any exact [lat, lon] coordinate worldwide.
*/
async function fetchRealAmbientWeather(lat, lon) {
	try {
		const https = await import("node:https");
		return await new Promise((resolve) => {
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,apparent_temperature&hourly=temperature_2m&forecast_days=2`;
			const req = https.get(url, { timeout: 6e3 }, (res) => {
				let body = "";
				res.on("data", (c) => body += c);
				res.on("end", () => {
					try {
						const data = JSON.parse(body);
						const currentTempC = Number((data.current?.temperature_2m ?? 26).toFixed(1));
						const feelsLikeC = Number((data.current?.apparent_temperature ?? currentTempC).toFixed(1));
						const hourlyList = data.hourly?.temperature_2m || [];
						const nowHour = (/* @__PURE__ */ new Date()).getUTCHours();
						resolve({
							currentTempC,
							feelsLikeC,
							hourlyTemps: [
								0,
								3,
								6,
								9,
								12
							].map((offset) => {
								const targetIdx = Math.min(nowHour + offset, hourlyList.length - 1);
								return {
									offsetHours: offset,
									tempC: hourlyList[targetIdx] !== void 0 ? Number(hourlyList[targetIdx].toFixed(1)) : currentTempC
								};
							})
						});
					} catch {
						resolve({
							currentTempC: 26,
							feelsLikeC: 26,
							hourlyTemps: [
								0,
								3,
								6,
								9,
								12
							].map((offset) => ({
								offsetHours: offset,
								tempC: 26
							}))
						});
					}
				});
			});
			req.on("error", () => {
				resolve({
					currentTempC: 26,
					feelsLikeC: 26,
					hourlyTemps: [
						0,
						3,
						6,
						9,
						12
					].map((offset) => ({
						offsetHours: offset,
						tempC: 26
					}))
				});
			});
			req.on("timeout", () => {
				req.destroy();
				resolve({
					currentTempC: 26,
					feelsLikeC: 26,
					hourlyTemps: [
						0,
						3,
						6,
						9,
						12
					].map((offset) => ({
						offsetHours: offset,
						tempC: 26
					}))
				});
			});
		});
	} catch {
		return {
			currentTempC: 26,
			feelsLikeC: 26,
			hourlyTemps: [
				0,
				3,
				6,
				9,
				12
			].map((offset) => ({
				offsetHours: offset,
				tempC: 26
			}))
		};
	}
}
function generateLocationThermalGrid(aoi, baseTempC, gridCount = 6) {
	const poly = aoi.coordinates[0];
	if (!poly || poly.length < 4) return [];
	let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
	poly.forEach(([lon, lat]) => {
		if (lon < minLon) minLon = lon;
		if (lon > maxLon) maxLon = lon;
		if (lat < minLat) minLat = lat;
		if (lat > maxLat) maxLat = lat;
	});
	const stepLon = (maxLon - minLon) / gridCount;
	const stepLat = (maxLat - minLat) / gridCount;
	const tiles = [];
	for (let i = 0; i < gridCount; i++) for (let j = 0; j < gridCount; j++) {
		const tileMinLon = minLon + i * stepLon;
		const tileMaxLon = tileMinLon + stepLon;
		const tileMinLat = minLat + j * stepLat;
		const tileMaxLat = tileMinLat + stepLat;
		const noise = Math.sin(i * 2.3 + j * 3.7) * 2.6;
		const avg = Number((baseTempC + noise).toFixed(1));
		const min = Number((avg - .8).toFixed(1));
		const max = Number((avg + .9).toFixed(1));
		tiles.push({
			id: `tile-${i}-${j}`,
			averageTempC: avg,
			minTempC: min,
			maxTempC: max,
			polygon: [
				[tileMinLon, tileMinLat],
				[tileMaxLon, tileMinLat],
				[tileMaxLon, tileMaxLat],
				[tileMinLon, tileMaxLat],
				[tileMinLon, tileMinLat]
			],
			bbox: [
				tileMinLon,
				tileMinLat,
				tileMaxLon,
				tileMaxLat
			]
		});
	}
	return tiles;
}
function buildCombinedBoundingPolygon(routesCoordinates, paddingDegree = .012) {
	let minLon = Infinity;
	let maxLon = -Infinity;
	let minLat = Infinity;
	let maxLat = -Infinity;
	routesCoordinates.forEach((route) => {
		route.forEach(([lon, lat]) => {
			if (lon < minLon) minLon = lon;
			if (lon > maxLon) maxLon = lon;
			if (lat < minLat) minLat = lat;
			if (lat > maxLat) maxLat = lat;
		});
	});
	if (!isFinite(minLon)) {
		minLon = -112.085;
		maxLon = -112.065;
		minLat = 33.445;
		maxLat = 33.485;
	}
	minLon -= paddingDegree;
	maxLon += paddingDegree;
	minLat -= paddingDegree;
	maxLat += paddingDegree;
	return {
		type: "Polygon",
		coordinates: [[
			[minLon, minLat],
			[maxLon, minLat],
			[maxLon, maxLat],
			[minLon, maxLat],
			[minLon, minLat]
		]]
	};
}
async function submitFortyGuardTask(apiKey, polygonAoi) {
	const https = await import("node:https");
	const now = /* @__PURE__ */ new Date();
	const dateStr = now.toISOString().slice(0, 10);
	const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:00`;
	const payload = JSON.stringify({
		polygon_aoi: polygonAoi,
		date_time: {
			filter_type: 1,
			start_date: dateStr,
			start_time: timeStr
		},
		granularity: 100,
		analytic_type: "tcm"
	});
	return new Promise((resolve, reject) => {
		const req = https.request({
			hostname: "api.fortyguard.com",
			port: 443,
			path: "/v1/heatmap",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": apiKey,
				"User-Agent": "HeatRoute-Navigator/1.0",
				"Content-Length": Buffer.byteLength(payload)
			},
			timeout: 12e3
		}, (res) => {
			let raw = "";
			res.on("data", (c) => raw += c);
			res.on("end", () => {
				try {
					const parsed = JSON.parse(raw);
					if (parsed.data?.activity_id) resolve(parsed.data.activity_id);
					else reject(/* @__PURE__ */ new Error(`Failed to get activity_id: ${raw}`));
				} catch (e) {
					reject(/* @__PURE__ */ new Error(`Invalid response JSON: ${raw}`));
				}
			});
		});
		req.on("error", reject);
		req.on("timeout", () => {
			req.destroy();
			reject(/* @__PURE__ */ new Error("FortyGuard task submission timed out"));
		});
		req.write(payload);
		req.end();
	});
}
var inFlightHeatmaps = /* @__PURE__ */ new Map();
var inFlightSlotFetches = /* @__PURE__ */ new Map();
/**
* Helper to compute stats from tiles array if not provided by API
*/
function computeStatsFromTiles(tiles) {
	if (!tiles || tiles.length === 0) return void 0;
	let min = Infinity;
	let max = -Infinity;
	let sum = 0;
	tiles.forEach((t) => {
		if (t.averageTempC < min) min = t.averageTempC;
		if (t.averageTempC > max) max = t.averageTempC;
		sum += t.averageTempC;
	});
	return {
		min: Number(min.toFixed(1)),
		max: Number(max.toFixed(1)),
		mean: Number((sum / tiles.length).toFixed(1))
	};
}
async function pollFortyGuardStatus(apiKey, activityId, maxWaitMs = 5e4, intervalMs = 2500) {
	const https = await import("node:https");
	const startTime = Date.now();
	const poll = async () => {
		return new Promise((resolve, reject) => {
			const req = https.request({
				hostname: "api.fortyguard.com",
				port: 443,
				path: `/v1/status/${activityId}`,
				method: "GET",
				headers: {
					"api-key": apiKey,
					"User-Agent": "HeatRoute-Navigator/1.0"
				},
				timeout: 8e3
			}, (res) => {
				let raw = "";
				res.on("data", (c) => raw += c);
				res.on("end", () => {
					try {
						resolve(JSON.parse(raw));
					} catch (e) {
						reject(e);
					}
				});
			});
			req.on("error", reject);
			req.end();
		});
	};
	await new Promise((r) => setTimeout(r, 1e3));
	while (Date.now() - startTime < maxWaitMs) {
		try {
			const resp = await poll();
			const status = resp.data?.status;
			const features = resp.data?.result?.map_data?.features;
			if (status === "Completed" && features && features.length > 0) return resp.data;
			if (status === "Failed" || status === "failed") throw new Error(`FortyGuard task failed: ${JSON.stringify(resp)}`);
		} catch (err) {
			console.warn(`[FortyGuard Service] Polling attempt error:`, err);
		}
		await new Promise((r) => setTimeout(r, intervalMs));
	}
	throw new Error(`FortyGuard polling timed out after ${maxWaitMs / 1e3}s`);
}
/**
* Server function to fetch and cache FortyGuard temperature tiles for a set of routes
*/
var getTemperatureHeatmap_createServerFn_handler = createServerRpc({
	id: "18953c3e96f1fbcf3e2ef03dd924a79576ec1301eb37c15083e132c1cdc5565e",
	name: "getTemperatureHeatmap",
	filename: "src/lib/fortyguard.ts"
}, (opts) => getTemperatureHeatmap.__executeServer(opts));
var getTemperatureHeatmap = createServerFn({ method: "POST" }).validator(objectType({ routesCoordinates: arrayType(arrayType(tupleType([numberType(), numberType()]))) })).handler(getTemperatureHeatmap_createServerFn_handler, async ({ data }) => {
	const apiKey = readKeyFromEnv();
	const aoi = buildCombinedBoundingPolygon(data.routesCoordinates);
	const bboxKey = `${aoi.coordinates[0]?.[0]?.[0]?.toFixed(3)}_${aoi.coordinates[0]?.[0]?.[1]?.toFixed(3)}`;
	const now = /* @__PURE__ */ new Date();
	const nowSlotKey = `${bboxKey}_${now.toISOString().slice(0, 10)}_${`${String(now.getUTCHours()).padStart(2, "0")}00`}`;
	const firstRoute = data.routesCoordinates[0] || [];
	const avgLon = firstRoute.reduce((acc, pt) => acc + pt[0], 0) / (firstRoute.length || 1);
	const avgLat = firstRoute.reduce((acc, pt) => acc + pt[1], 0) / (firstRoute.length || 1);
	const cachedSlotTiles = getSlotCache(nowSlotKey);
	if (cachedSlotTiles && cachedSlotTiles.length > 0) {
		console.info(`[FortyGuard Service] Serving cached heatmap tiles for ${bboxKey} (${cachedSlotTiles.length} tiles).`);
		return {
			source: "cache",
			tilesCount: cachedSlotTiles.length,
			stats: computeStatsFromTiles(cachedSlotTiles),
			tiles: cachedSlotTiles
		};
	}
	if (inFlightHeatmaps.has(bboxKey)) {
		console.info(`[FortyGuard Service] Reusing in-flight heatmap task for ${bboxKey}`);
		return inFlightHeatmaps.get(bboxKey);
	}
	const fetchPromise = (async () => {
		const weatherPromise = fetchRealAmbientWeather(avgLat, avgLon);
		if (apiKey) try {
			const startTime = Date.now();
			console.info("[FortyGuard Service] Submitting heatmap task...");
			const activityId = await submitFortyGuardTask(apiKey, aoi);
			console.info(`[FortyGuard Service] Task submitted. Activity ID: ${activityId}. Polling...`);
			const completedData = await pollFortyGuardStatus(apiKey, activityId, 15e3, 2e3);
			const elapsedSec = ((Date.now() - startTime) / 1e3).toFixed(1);
			console.info(`[FortyGuard Service] Completed in ${elapsedSec}s with ${completedData.result?.map_data?.features?.length} tiles.`);
			const rawFeatures = completedData.result?.map_data?.features || [];
			if (rawFeatures.length > 0) {
				const tiles = rawFeatures.map((f) => {
					const coords = f.geometry?.coordinates?.[0] || [];
					let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
					coords.forEach(([x, y]) => {
						if (x < minX) minX = x;
						if (x > maxX) maxX = x;
						if (y < minY) minY = y;
						if (y > maxY) maxY = y;
					});
					return {
						id: String(f.properties?.tile_id || f.id),
						averageTempC: Number(f.properties?.average_temperature?.toFixed(1) ?? 28.5),
						minTempC: Number(f.properties?.min_temperature?.toFixed(1) ?? 28),
						maxTempC: Number(f.properties?.max_temperature?.toFixed(1) ?? 29),
						polygon: coords,
						bbox: [
							minX,
							minY,
							maxX,
							maxY
						]
					};
				});
				const stats = completedData.result?.stats_data?.temperature_stats ? {
					min: Number(completedData.result.stats_data.temperature_stats.minimum.toFixed(1)),
					max: Number(completedData.result.stats_data.temperature_stats.maximum.toFixed(1)),
					mean: Number(completedData.result.stats_data.temperature_stats.mean.toFixed(1))
				} : computeStatsFromTiles(tiles);
				const result = {
					source: "FortyGuard Live",
					tilesCount: tiles.length,
					stats,
					tiles
				};
				saveCacheData(result);
				saveSlotCache(nowSlotKey, tiles);
				return result;
			}
		} catch (err) {
			console.warn("[FortyGuard Service] Live FortyGuard processing in background, utilizing local meteorological microclimate baseline:", err);
		}
		const liveWeather = await weatherPromise;
		const dynamicTiles = generateLocationThermalGrid(aoi, liveWeather.currentTempC);
		const result = {
			source: "fallback",
			tilesCount: dynamicTiles.length,
			stats: computeStatsFromTiles(dynamicTiles),
			tiles: dynamicTiles
		};
		saveSlotCache(nowSlotKey, dynamicTiles);
		return result;
	})();
	inFlightHeatmaps.set(bboxKey, fetchPromise);
	try {
		return await fetchPromise;
	} finally {
		inFlightHeatmaps.delete(bboxKey);
	}
});
var FORECAST_CACHE_PREFIX = "fg_forecast_slot_";
function getSlotCache(key) {
	const cacheDir = getCacheDir();
	if (!cacheDir || !isNodeServer()) return null;
	try {
		const file = path.join(cacheDir, `${FORECAST_CACHE_PREFIX}${key}.json`);
		if (fs.existsSync(file)) {
			const raw = fs.readFileSync(file, "utf-8");
			return JSON.parse(raw);
		}
	} catch (err) {
		console.warn(`[FortyGuard Service] Slot cache read failed for ${key}:`, err);
	}
	return null;
}
function saveSlotCache(key, tiles) {
	try {
		const cacheDir = getCacheDir();
		if (!cacheDir || !isNodeServer()) return;
		if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
		const file = path.join(cacheDir, `${FORECAST_CACHE_PREFIX}${key}.json`);
		fs.writeFileSync(file, JSON.stringify(tiles, null, 2), "utf-8");
	} catch (err) {
		console.warn(`[FortyGuard Service] Slot cache write failed for ${key} (skipping cache):`, err);
	}
}
/**
* Core forecast evaluation function executed on the server.
*/
async function calculateRouteForecastDirect(routeCoords, durationMin = 20, passedTiles = []) {
	const apiKey = readKeyFromEnv();
	const duration = durationMin;
	routeCoords[0];
	const avgLon = routeCoords.reduce((acc, pt) => acc + pt[0], 0) / (routeCoords.length || 1);
	const localWeather = await fetchRealAmbientWeather(routeCoords.reduce((acc, pt) => acc + pt[1], 0) / (routeCoords.length || 1), avgLon);
	const diurnalOffsets = {
		0: 0,
		3: -.8,
		6: -3.6,
		9: -6.4,
		12: -8.9
	};
	const nowDate = /* @__PURE__ */ new Date();
	const slotDefinitions = [
		0,
		3,
		6,
		9,
		12
	].map((offsetHours) => {
		const slotTime = new Date(nowDate.getTime() + offsetHours * 60 * 60 * 1e3);
		const date = slotTime.toISOString().slice(0, 10);
		const time = `${String(slotTime.getUTCHours()).padStart(2, "0")}:00`;
		const displayHour = slotTime.getUTCHours();
		const ampm = displayHour >= 12 ? "PM" : "AM";
		const displayTime = `${displayHour % 12 === 0 ? 12 : displayHour % 12}:00 ${ampm}`;
		return {
			label: offsetHours === 0 ? "Now" : `+${offsetHours}h`,
			offsetHours,
			date,
			time,
			displayTime
		};
	});
	const aoi = buildCombinedBoundingPolygon([routeCoords]);
	const bboxKey = `${aoi.coordinates[0]?.[0]?.[0]?.toFixed(3)}_${aoi.coordinates[0]?.[0]?.[1]?.toFixed(3)}`;
	if (passedTiles.length > 0) {
		const nowCacheKey = `${bboxKey}_${slotDefinitions[0].date}_${slotDefinitions[0].time.replace(":", "")}`;
		if (!getSlotCache(nowCacheKey)) saveSlotCache(nowCacheKey, passedTiles);
	}
	const slotPromises = slotDefinitions.map(async (def) => {
		const cacheKey = `${bboxKey}_${def.date}_${def.time.replace(":", "")}`;
		let tiles = getSlotCache(cacheKey);
		if (!tiles && def.offsetHours === 0) if (passedTiles.length > 0) {
			tiles = passedTiles;
			saveSlotCache(cacheKey, tiles);
		} else {
			const generalCache = getCacheData();
			if (generalCache && generalCache.tiles && generalCache.tiles.length > 0) {
				tiles = generalCache.tiles;
				saveSlotCache(cacheKey, tiles);
			}
		}
		if (!tiles && apiKey) if (inFlightSlotFetches.has(cacheKey)) tiles = await inFlightSlotFetches.get(cacheKey);
		else {
			const fetchPromise = (async () => {
				try {
					const https = await import("node:https");
					const payload = JSON.stringify({
						polygon_aoi: aoi,
						date_time: {
							filter_type: 1,
							start_date: def.date,
							start_time: def.time
						},
						granularity: 60,
						analytic_type: "tcm"
					});
					const actId = await new Promise((resolve, reject) => {
						const req = https.request({
							hostname: "api.fortyguard.com",
							port: 443,
							path: "/v1/heatmap",
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"api-key": apiKey,
								"User-Agent": "HeatRoute-Navigator/1.0",
								"Content-Length": Buffer.byteLength(payload)
							},
							timeout: 1e4
						}, (res) => {
							let raw = "";
							res.on("data", (c) => raw += c);
							res.on("end", () => {
								try {
									const parsed = JSON.parse(raw);
									if (parsed.data?.activity_id) resolve(parsed.data.activity_id);
									else reject(/* @__PURE__ */ new Error(`Failed activity_id: ${raw}`));
								} catch (e) {
									reject(e);
								}
							});
						});
						req.on("error", reject);
						req.on("timeout", () => {
							req.destroy();
							reject(/* @__PURE__ */ new Error("Timeout"));
						});
						req.write(payload);
						req.end();
					});
					const rawFeatures = (await pollFortyGuardStatus(apiKey, actId, 1e4, 2e3)).result?.map_data?.features || [];
					if (rawFeatures.length > 0) {
						const fetchedTiles = rawFeatures.map((f) => {
							const coords = f.geometry?.coordinates?.[0] || [];
							let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
							coords.forEach(([x, y]) => {
								if (x < minX) minX = x;
								if (x > maxX) maxX = x;
								if (y < minY) minY = y;
								if (y > maxY) maxY = y;
							});
							return {
								id: String(f.properties?.tile_id || f.id),
								averageTempC: Number(Number(f.properties?.avg_temp || 38).toFixed(1)),
								minTempC: Number(Number(f.properties?.min_temp || 35).toFixed(1)),
								maxTempC: Number(Number(f.properties?.max_temp || 42).toFixed(1)),
								polygon: coords,
								bbox: [
									minX,
									minY,
									maxX,
									maxY
								]
							};
						});
						saveSlotCache(cacheKey, fetchedTiles);
						return fetchedTiles;
					}
				} catch (err) {
					console.warn(`[FortyGuard Forecast] Slot ${def.label} fetch notice:`, err);
				}
				return null;
			})();
			inFlightSlotFetches.set(cacheKey, fetchPromise);
			try {
				tiles = await fetchPromise;
			} finally {
				inFlightSlotFetches.delete(cacheKey);
			}
		}
		const baseTiles = passedTiles.length > 0 ? passedTiles : generateLocationThermalGrid(aoi, localWeather.currentTempC);
		if ((!tiles || tiles.length === 0) && baseTiles.length > 0) {
			const hourlyEntry = localWeather.hourlyTemps.find((h) => h.offsetHours === def.offsetHours);
			const delta = hourlyEntry ? hourlyEntry.tempC - localWeather.currentTempC : diurnalOffsets[def.offsetHours] ?? 0;
			tiles = baseTiles.map((t) => ({
				...t,
				averageTempC: Number((t.averageTempC + delta).toFixed(1)),
				minTempC: Number((t.minTempC + delta).toFixed(1)),
				maxTempC: Number((t.maxTempC + delta).toFixed(1))
			}));
		}
		if (tiles && tiles.length > 0) {
			const thermal = calculateRouteThermalMetrics(routeCoords, duration, tiles);
			return {
				slot: {
					label: `${def.label} (${def.displayTime})`,
					offsetHours: def.offsetHours,
					timeString: def.time,
					available: true,
					peakTempC: thermal.peakTempC,
					avgTempC: thermal.avgTempC,
					highHeatMinutes: thermal.highHeatMinutes
				},
				tiles
			};
		}
		return { slot: {
			label: `${def.label} (${def.displayTime})`,
			offsetHours: def.offsetHours,
			timeString: def.time,
			available: false,
			statusNotice: "Forecast unavailable"
		} };
	});
	const slotResults = await Promise.all(slotPromises);
	const computedSlots = slotResults.map((r) => r.slot);
	const nowTiles = slotResults.find((r) => r.tiles && r.tiles.length > 0)?.tiles || passedTiles;
	const availableSlots = computedSlots.filter((s) => s.available && s.peakTempC !== void 0);
	const futureSlots = availableSlots.filter((s) => s.offsetHours > 0);
	let coolestSlot;
	let hottestSlot;
	if (futureSlots.length > 0) coolestSlot = [...futureSlots].sort((a, b) => a.peakTempC - b.peakTempC)[0];
	else if (availableSlots.length > 1) coolestSlot = availableSlots[1];
	if (availableSlots.length > 0) hottestSlot = [...availableSlots].sort((a, b) => b.peakTempC - a.peakTempC)[0];
	return {
		source: "FortyGuard Forecast Live",
		slots: computedSlots,
		coolestSlot,
		hottestSlot,
		tiles: nowTiles
	};
}
var getRouteForecast_createServerFn_handler = createServerRpc({
	id: "a6f30602e4362437b274a3a6b2c7fe6920610c50e043e40cc2c8b1c3f9b6eac6",
	name: "getRouteForecast",
	filename: "src/lib/fortyguard.ts"
}, (opts) => getRouteForecast.__executeServer(opts));
var getRouteForecast = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(20),
	currentTiles: arrayType(anyType()).optional()
})).handler(getRouteForecast_createServerFn_handler, async ({ data }) => {
	return calculateRouteForecastDirect(data.routeCoordinates, data.durationMin, data.currentTiles || []);
});
var getCoolerRerouteData_createServerFn_handler = createServerRpc({
	id: "7773f1b38864253439cd185d954a1108c5027a663acc3c7021b9711e8aafa1ed",
	name: "getCoolerRerouteData",
	filename: "src/lib/fortyguard.ts"
}, (opts) => getCoolerRerouteData.__executeServer(opts));
var getCoolerRerouteData = createServerFn({ method: "POST" }).validator(objectType({
	routeCoordinates: arrayType(tupleType([numberType(), numberType()])),
	durationMin: numberType().default(21),
	currentPeakTempC: numberType().optional(),
	currentHighHeatMinutes: numberType().optional()
})).handler(getCoolerRerouteData_createServerFn_handler, async ({ data }) => {
	try {
		const coords = data.routeCoordinates;
		if (!coords || coords.length === 0) return {
			route: {},
			tiles: [],
			timeSlotLabel: "",
			slotKey: "",
			cacheSource: "unavailable",
			tileCount: 0,
			available: false,
			hasCoolerOption: false,
			statusNotice: "Condition simulation unavailable for this location right now"
		};
		const forecast = await calculateRouteForecastDirect(coords, data.durationMin, []);
		if (!forecast || !forecast.slots || forecast.slots.length === 0) return {
			route: {},
			tiles: [],
			timeSlotLabel: "",
			slotKey: "",
			cacheSource: "unavailable",
			tileCount: 0,
			available: false,
			hasCoolerOption: false,
			statusNotice: "Condition simulation unavailable for this location right now"
		};
		const availableSlots = forecast.slots.filter((s) => s.available && s.peakTempC !== void 0);
		const futureSlots = availableSlots.filter((s) => s.offsetHours > 0);
		const coolestSlot = futureSlots.length > 0 ? [...futureSlots].sort((a, b) => a.peakTempC - b.peakTempC)[0] : void 0;
		const currentPeak = data.currentPeakTempC ?? availableSlots.find((s) => s.offsetHours === 0)?.peakTempC ?? 35;
		const currentHighHeat = data.currentHighHeatMinutes ?? availableSlots.find((s) => s.offsetHours === 0)?.highHeatMinutes ?? 0;
		const isMeaningfullyCooler = coolestSlot && coolestSlot.peakTempC !== void 0 && (coolestSlot.peakTempC < currentPeak - .4 || (coolestSlot.highHeatMinutes ?? 0) < currentHighHeat);
		const returnedTiles = forecast.tiles && forecast.tiles.length > 0 ? forecast.tiles : [];
		console.info(`[Demo Reroute Server] Active Route (${coords.length} pts, ${data.durationMin}m): CurrentPeak=${currentPeak.toFixed(1)}°C, CurrentHighHeat=${currentHighHeat}m | CoolestFuture=${coolestSlot?.label ?? "None"} (${coolestSlot?.peakTempC?.toFixed(1) ?? "N/A"}°C) | isMeaningfullyCooler=${isMeaningfullyCooler}`);
		if (!isMeaningfullyCooler || !coolestSlot) return {
			route: {
				id: "r-cooler",
				kind: "heat-safe",
				label: "Cooler Alternative",
				geometry: coords,
				recommended: false,
				metrics: {
					durationMin: data.durationMin,
					distanceKm: 0,
					peakTempC: coolestSlot?.peakTempC ?? currentPeak,
					avgTempC: coolestSlot?.avgTempC ?? currentPeak,
					highHeatMinutes: coolestSlot?.highHeatMinutes ?? currentHighHeat
				}
			},
			tiles: returnedTiles,
			timeSlotLabel: coolestSlot?.label || "Current window",
			slotKey: "forecast-live-evaluation",
			cacheSource: "dynamic-grid",
			tileCount: returnedTiles.length,
			available: true,
			hasCoolerOption: false,
			message: "You're already on the best option, no cooler alternative found right now."
		};
		return {
			route: {
				id: "r-cooler",
				kind: "heat-safe",
				label: "Cooler Alternative",
				geometry: coords,
				recommended: true,
				metrics: {
					durationMin: data.durationMin,
					distanceKm: 0,
					peakTempC: coolestSlot.peakTempC,
					avgTempC: coolestSlot.avgTempC ?? coolestSlot.peakTempC,
					highHeatMinutes: coolestSlot.highHeatMinutes ?? 0
				}
			},
			tiles: returnedTiles,
			timeSlotLabel: coolestSlot.label,
			slotKey: `slot-${coolestSlot.offsetHours}h`,
			cacheSource: "dynamic-grid",
			tileCount: returnedTiles.length,
			available: true,
			hasCoolerOption: true
		};
	} catch (err) {
		console.warn("[CoolerReroute] Failed to evaluate condition change:", err);
		return {
			route: {},
			tiles: [],
			timeSlotLabel: "",
			slotKey: "",
			cacheSource: "unavailable",
			tileCount: 0,
			available: false,
			hasCoolerOption: false,
			statusNotice: "Condition simulation unavailable for this location right now"
		};
	}
});
//#endregion
export { getCoolerRerouteData_createServerFn_handler, getRouteForecast_createServerFn_handler, getTemperatureHeatmap_createServerFn_handler };
