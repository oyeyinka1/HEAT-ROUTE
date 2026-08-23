# HeatRoute 🔥🗺️

**Navigate the city. Not the heat.**

HeatRoute is a heat-aware walking navigation app. Instead of only optimizing for speed, it compares candidate walking routes using real hyperlocal temperature data and recommends the one with the lowest heat exposure — showing you exactly what trade-off you're making between time and safety.

Built for the **FortyGuard "Building the World's Temperature AI" Hackathon** — Resilient Cities & Infrastructure track.

---

## The Problem

Extreme urban heat is a real public safety issue, and it isn't distributed evenly across a city — a sun-exposed arterial road and a shaded park path a block apart can carry very different real heat risk. Most navigation apps optimize purely for time or distance, with no way to know which route is safer on a dangerously hot day. HeatRoute closes that gap using FortyGuard's hyperlocal Temperature API.

---

## Features

- **Real interactive map** with live routing and a real FortyGuard thermal tile overlay
- **Multi-route comparison** — Fastest vs. Heat-Safe, with an honest trade-off summary (extra minutes vs. reduced high-heat exposure)
- **Real Heat Exposure Score** — calculated from actual sampled temperature data along each route, not estimates
- **Honest near-tie detection** — when two routes have effectively the same heat exposure, HeatRoute says so plainly instead of overstating a marginal difference
- **12-hour forecast ("Leave Now vs. Leave Later")** — shows how heat exposure changes across the day using FortyGuard's real forecast window, so users can choose *when* to walk, not just *how*
- **Turn-by-turn navigation** with a live heat-exposure readout
- **Simulated condition-change rerouting** — demonstrates how HeatRoute would adapt to changing conditions mid-walk, using real (not fabricated) alternate-time temperature data
- **"Why this route?" explainability panel** — a plain-language summary of what was evaluated and why a route was recommended, generated from real route data rather than a generic template

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (Vite + React 19) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Mapping | Leaflet / react-leaflet |
| Routing | OpenRouteService (foot-walking directions + geocoding) |
| Temperature data | FortyGuard Temperature API (Heatmap / Heat Intelligence endpoints) |
| Deployment | Vercel (via Nitro) |

---

## How It Works

1. **Routing:** OpenRouteService generates 2+ real candidate walking routes between origin and destination.
2. **Thermal data:** HeatRoute submits one combined bounding-area request to FortyGuard's async Heatmap API (`POST /v1/heatmap` → poll `GET /v1/status/{activity_id}`), returning a grid of real temperature tiles for the area.
3. **Scoring:** Each route is sampled at ~20 points along its path. Each point is matched to its containing FortyGuard tile via point-in-polygon lookup, producing:
   - **Peak temperature** (max sampled value)
   - **Average temperature**
   - **High-heat exposure minutes** (estimated time spent in tiles above a configurable heat threshold, default 38°C)
4. **Recommendation:** The route with the lowest high-heat exposure is recommended, provided it doesn't add more than ~20% extra walking time over the fastest option. If the difference between routes is negligible (<1 minute), HeatRoute explicitly flags this as a near-tie rather than overstating the win.
5. **Forecast:** The same sampling pipeline runs against 5 time-shifted FortyGuard requests (now, +3h, +6h, +9h, +12h — FortyGuard's documented forecast limit) to power the "Leave Now vs. Leave Later" feature.

---

## A Real Finding Worth Sharing

During development, we discovered that FortyGuard's near-surface (2m) ambient air temperature is often remarkably **uniform across short urban distances at a single point in time** — in our Phoenix test corridor, temperature varied by less than 0.5°C between routes just a few blocks apart. Time of day, by contrast, produced a swing of over 5°C across a 12-hour window.

This shaped a real design decision: HeatRoute treats *when to leave* as at least as important as *which route to take*, and we chose to report this honestly rather than force artificial contrast into the route comparison. We believe this kind of finding — arrived at through testing against a real API rather than assumed — is exactly the kind of grounded, defensible engineering the "Technical Execution" criterion is asking for.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [FortyGuard API key](https://docs-api.fortyguard.com) (provided via the hackathon)
- An [OpenRouteService / HeiGIT API key](https://account.heigit.org/manage/key) (free tier)

### Setup

```bash
git clone https://github.com/oyeyinka1/HEAT-ROUTE.git
cd heatroute
npm install
```

Create a `.env` file in the project root:

```
FORTYGUARD_API_KEY=your_fortyguard_key_here
OPENROUTESERVICE_API_KEY=your_openrouteservice_key_here
```

Run locally:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build & Deploy

```bash
npm run build
```

This project deploys to **Vercel** via the Nitro adapter with zero extra configuration — connect the repository at [vercel.com/new](https://vercel.com/new), add the two environment variables above in the Vercel dashboard, and deploy.

---

## Architecture

```
User Input (origin/destination)
        │
        ▼
OpenRouteService  ──►  Real candidate route geometries
        │
        ▼
FortyGuard Heatmap API  ──►  Real temperature tile grid for the route area
        │
        ▼
Route Scoring Engine  ──►  Peak / Avg temp, High-heat exposure minutes per route
        │
        ▼
Heat-Safe Selection Logic  ──►  Recommended route + honest explanation
        │
        ▼
React UI (Map, Route Comparison, Navigation, Heat Intelligence)
```

*(See `/![HeatRoute architecture](./docs/architecture-diagram.svg)` for a visual architecture diagram.)*

---

## Known Scope & Honest Limitations

- The "Simulate Conditions" reroute demo works for any searched US location, using real, time-shifted FortyGuard forecast data for that specific route's area — not limited to a single demo city.
- Live rerouting is demonstrated via a controlled trigger using real, time-shifted FortyGuard data rather than continuous background GPS tracking — a deliberate scope decision for a two-week build, not a limitation of the underlying architecture.
- FortyGuard coverage is nationwide (US), though data density and temperature variation can differ meaningfully by city and time of day.

---

## Hackathon Submission Details

- **Track:** Resilient Cities & Infrastructure
- **Built with:** AI-assisted development (Lovable for initial UI scaffolding; AI coding agents for backend integration, debugging, and iteration throughout the build), per the hackathon's permitted use of AI coding assistants
- **Data source:** FortyGuard Temperature API (Heatmap endpoint)

---

## License

Built for the FortyGuard Hackathon, August 2026.
