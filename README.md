# HeatRoute Navigator

HEATROUTE — BUILD THE UI

I am building HeatRoute for a hackathon using FortyGuard's hyperlocal temperature intelligence.

Product: HeatRoute is a heat-aware walking navigation application. It compares candidate walking routes using hyperlocal temperature data and recommends a route that reduces estimated high-heat exposure without imposing an unreasonable travel-time penalty.

Core promise:

Navigate the city. Not the heat.

CORE USER FLOW

Landing Page → Try HeatRoute → Map / Destination Search → Route Analysis → Fastest vs Heat-Safe → Why This Route? → Start Navigation → Controlled Reroute

A secondary Heat Intelligence experience can show current conditions and up to 12-hour forecasts, including Leave Now vs Leave Later.

---

WHAT THE UI MUST SHOW

The core app is map-first.

The user searches for a destination and receives 2–3 candidate walking routes.

Compare:

FASTEST

vs.

HEAT-SAFE

Balanced may appear only when meaningful.

Route information should use:

Duration

Distance

Peak temperature

Average temperature

High-heat exposure minutes

Heat-Safe should represent the route with lower estimated high-heat exposure while remaining within a reasonable travel-time penalty.

Include an expandable:

Why This Route?

explaining why the recommended route was selected.

This is transparent route intelligence, not an AI chatbot.

---

NAVIGATION + REROUTING

Once the user selects the Heat-Safe route, enter a simplified navigation view.

Show:

next instruction

ETA

remaining distance

current heat condition

Include one polished controlled/simulated reroute demonstration:

Route conditions changed

A cooler route is now available.

Reroute / Keep current route

This does not need production-grade continuous GPS tracking.

---

LANDING PAGE

Build a proper commercial-quality landing page, not just an app screen.

Hero:

Navigate the city.

Not the heat.

Include:

strong Try HeatRoute CTA

beautiful thermal city/map visual

concise explanation of the problem

3-step "How it works"

concise explanation of FortyGuard's role

final CTA

The landing page should feel like a real startup product that could be launched publicly.

---

VISUAL DIRECTION

The attached image is the visual North Star.

Use it for inspiration for:

premium dark aesthetic

thermal map visualization

floating panels

route cards

typography

spacing

mobile layout

polished interactions

Do not copy it literally.

I want the result to feel:

premium, modern, sophisticated, calm, technically credible, beautiful and commercially viable.

Think high-end navigation product + climate intelligence, not generic AI dashboard.

Use restrained glass/blur effects, elegant typography, strong information hierarchy and purposeful animation.

Animations can include:

route drawing

route selection

thermal transitions

analysis/loading states

bottom-sheet transitions

rerouting transitions

Avoid excessive particles, unnecessary 3D, excessive glassmorphism or animation that interferes with usability.

---

RESPONSIVE DESIGN

Build both desktop/laptop and mobile as first-class experiences.

Desktop:

map-dominant

floating panels

spacious layout

Mobile:

map-dominant

bottom sheets

compact floating controls

thumb-friendly buttons

readable navigation information

Do not simply shrink the desktop design.

---

IMPORTANT DATA RULE

The numbers visible in the attached reference image are fictional visual placeholders.

Do not hardcode those values into the product.

For the UI prototype, mock data may be used, but keep it structured so that real FortyGuard/backend data can later replace it without redesigning the UI.

The eventual backend will provide the actual temperature and route calculations.

Do not invent an unexplained Heat Score.

---

DO NOT BUILD

Keep the MVP focused.

Do not build:

Enterprise/workforce dashboard

Fleet management

Cycling mode

Driving mode

Production-grade continuous GPS tracking

Generic AI chatbot

Unexplained Heat Score

Unrelated dashboard features

---

PRIORITY

The most important thing is a beautiful, coherent, highly polished frontend experience that makes the product immediately understandable to a hackathon judge.

The main demo should feel like:

"I enter a destination, HeatRoute analyzes the heat, shows me the tradeoff, explains its recommendation, lets me navigate, and can find a cooler alternative if conditions change."

Build the frontend around this experience.

Start building now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5abe53bf-86df-4752-9f76-cb565e954bfe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
