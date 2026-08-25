import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Flame,
  Footprints,
  MapPinned,
  Route as RouteIcon,
  ShieldCheck,
  Thermometer,
  Timer,
} from "lucide-react";
import heroImage from "@/assets/hero-thermal-city.jpg";
import thermalMap from "@/assets/thermal-map.jpg";
import { routeAnalysis } from "@/lib/heatroute-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeatRoute — Navigate the city. Not the heat." },
      {
        name: "description",
        content:
          "HeatRoute uses hyperlocal, street-level temperature intelligence to find walking routes with less high-heat exposure — without an unreasonable time penalty.",
      },
      { property: "og:title", content: "HeatRoute — Navigate the city. Not the heat." },
      {
        property: "og:description",
        content:
          "Heat-aware walking navigation powered by FortyGuard hyperlocal temperature intelligence.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-atmosphere-landing text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <SiteHeader />
      <Hero />
      <Problem />
      <HowItWorks />
      <RoutePreview />
      <FortyGuard />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-ember-glow"
            style={{ background: "var(--gradient-heat-cta)" }}
          >
            <Flame className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight">HeatRoute</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#problem" className="transition-colors hover:text-foreground">
            Why heat
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <Link to="/heat-intelligence" className="transition-colors hover:text-foreground">
            Heat Intelligence
          </Link>
        </nav>
        <Link
          to="/app"
          className="shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "var(--gradient-heat-cta)" }}
        >
          Try HeatRoute
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-black flex flex-col justify-center">
      {/* Full-bleed background image using public/images/heat-reference.png */}
      <img
        src="/images/heat-reference.png"
        alt="Urban heat route background"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%] pointer-events-none"
      />

      {/* Dark gradient overlay for text contrast and seamless readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(11,10,12,0.95) 0%, rgba(11,10,12,0.85) 35%, rgba(11,10,12,0.4) 65%, transparent 100%), linear-gradient(to bottom, rgba(11,10,12,0.6) 0%, transparent 25%, transparent 75%, #0B0A0C 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:py-32 lg:py-36">
        <div className="max-w-[720px]">

          {/* Main headline with smooth fade and upward settle entrance */}
          <h1 className="font-display text-[clamp(2.5rem,5.8vw,5.2rem)] font-extrabold leading-[1.04] tracking-tight">
            <span className="block text-white whitespace-nowrap animate-rise-in" style={{ animationDelay: "0ms" }}>
              Navigate the city.
            </span>
            <span
              className="block whitespace-nowrap animate-rise-in"
              style={{
                background: "linear-gradient(95deg, #FF8A3D 0%, #E05A1A 55%, #C2410C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animationDelay: "100ms",
              }}
            >
              Not the heat.
            </span>
          </h1>

          {/* Body copy staggered entrance */}
          <p
            className="mt-6 max-w-[500px] text-[1rem] leading-relaxed text-white/75 sm:text-[1.05rem] animate-rise-in"
            style={{ animationDelay: "200ms" }}
          >
            HeatRoute compares walking routes using hyperlocal temperature data and recommends the
            one with less high-heat exposure — without adding an unreasonable amount of time to your
            walk.
          </p>

          {/* CTAs staggered entrance */}
          <div
            className="mt-9 flex flex-wrap items-center gap-4 animate-rise-in"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/app"
              className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #FF8A3D 0%, #C2410C 65%, #9A2C05 100%)" }}
            >
              Try HeatRoute <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/heat-intelligence"
              className="flex items-center gap-2 rounded-xl border border-white/25 bg-black/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-black/40"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="10" width="2" height="5" rx="0.5" fill="currentColor" opacity="0.7"/>
                <rect x="5" y="6" width="2" height="9" rx="0.5" fill="currentColor" opacity="0.85"/>
                <rect x="9" y="3" width="2" height="12" rx="0.5" fill="currentColor"/>
                <rect x="13" y="7" width="2" height="8" rx="0.5" fill="currentColor" opacity="0.85"/>
              </svg>
              Explore Heat Intelligence
            </Link>
          </div>

          {/* Stats row with vertical pipe dividers */}
          <div
            className="mt-14 flex flex-wrap items-start border-t border-white/15 pt-8 animate-rise-in"
            style={{ animationDelay: "400ms" }}
          >
            {[
              { icon: <Thermometer className="h-5 w-5" />, value: "2 m", label: "TEMPERATURE\nRESOLUTION" },
              { icon: <Footprints className="h-5 w-5" />, value: "Walking", label: "PURPOSE-BUILT\nMODE" },
              { icon: <Timer className="h-5 w-5" />, value: "12 h", label: "FORECAST\nHORIZON" },
              { icon: <ShieldCheck className="h-5 w-5" />, value: "Private", label: "BY DESIGN" },
            ].map((s, i) => (
              <div key={s.value} className="flex items-start">
                {i > 0 && (
                  <div className="mx-5 mt-0.5 h-11 w-px bg-white/18 shrink-0" />
                )}
                <div className="flex items-center gap-2.5">
                  <span style={{ color: "#FF8A3D" }} className="shrink-0 mt-0.5">{s.icon}</span>
                  <div>
                    <p className="font-display text-xl font-bold text-white leading-none">{s.value}</p>
                    <p
                      className="mt-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/50 whitespace-pre-line leading-[1.5]"
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section id="problem" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="label-xs">The problem</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Two streets apart, the city can be a different climate.
          </h2>
          <p className="mt-5 text-muted-foreground">
            City temperature is not one number. Shade, tree cover, surface material and building
            geometry create street-level differences of several degrees within a single block. Every
            navigation app still routes you as if heat did not exist — straight down the hottest,
            most exposed corridor.
          </p>
          <ul className="mt-7 space-y-4">
            {[
              {
                title: "The fastest route is often the hottest",
                body: "Wide, unshaded avenues move you quickly and expose you the most.",
              },
              {
                title: "Exposure is what harms you, not distance",
                body: "Minutes spent above a high-heat threshold is the number that matters.",
              },
              {
                title: "Small detours change the outcome",
                body: "A few extra minutes on shaded segments can cut exposure substantially.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: "var(--hot)" }}
                />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-3xl p-2">
          <img
            src={thermalMap}
            alt="Hyperlocal thermal map showing hot corridors and cooler side streets"
            width={1536}
            height={1536}
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover opacity-90"
          />
          <div
            className="absolute inset-x-6 bottom-6 flex items-center gap-3 rounded-full px-4 py-2.5"
            style={{ background: "var(--panel)", backdropFilter: "blur(16px)" }}
          >
            <span className="label-xs shrink-0">Cooler</span>
            <span className="thermal-bar h-1.5 flex-1 rounded-full" />
            <span className="label-xs shrink-0">Hotter</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <MapPinned className="h-5 w-5" />,
      title: "Enter your destination",
      body: "Choose where you are walking. HeatRoute reads the current street-level temperature grid along every candidate path.",
    },
    {
      n: "02",
      icon: <RouteIcon className="h-5 w-5" />,
      title: "Compare the tradeoff",
      body: "See fastest and heat-safe side by side: duration, distance, peak and average temperature, and minutes of high-heat exposure.",
    },
    {
      n: "03",
      icon: <Footprints className="h-5 w-5" />,
      title: "Walk the cooler route",
      body: "Start simplified navigation with live heat context, and get offered a cooler alternative if conditions change en route.",
    },
  ];

  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <p className="label-xs">How it works</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          Transparent route intelligence, in three steps.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{
                    background: "rgba(255, 138, 61, 0.14)",
                    color: "var(--ember-glow)",
                  }}
                >
                  {s.icon}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoutePreview() {
  const [fastest, heatSafe] = routeAnalysis.routes;

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label-xs">The decision</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            You see the tradeoff, then you choose.
          </h2>
          <p className="mt-5 text-muted-foreground">
            HeatRoute never hides its reasoning behind a single opaque score. Every recommendation
            shows the exposure it saves, the time it costs, and why it was selected.
          </p>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-heat-cta)" }}
          >
            See it on the map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="glass-panel space-y-3 rounded-3xl p-5 shadow-panel">
          {[fastest!, heatSafe!].map((route) => {
            const isSafe = route.kind === "heat-safe";
            const accent = isSafe ? "var(--safe)" : "var(--fastest)";
            return (
              <div
                key={route.id}
                className="rounded-2xl border p-4"
                style={{
                  borderColor: isSafe ? accent : "var(--panel-border)",
                  background: isSafe
                    ? "color-mix(in oklab, var(--safe) 8%, transparent)"
                    : "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: accent }}
                  >
                    {route.label}
                  </span>
                  {isSafe ? (
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: accent }}
                    >
                      Recommended
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    [`${route.metrics.durationMin} min`, "Walk time"],
                    [`${route.metrics.distanceKm} km`, "Distance"],
                    [`${route.metrics.peakTempC.toFixed(1)}°C`, "Peak temp"],
                    [`${route.metrics.highHeatMinutes} min`, "High heat"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <p className="font-mono text-sm font-semibold">{v}</p>
                      <p className="label-xs mt-0.5 text-[10px]">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="px-1 text-xs text-muted-foreground">
            Example comparison. Live values come from street-level temperature intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}

function FortyGuard() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="label-xs">Powered by FortyGuard</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            The temperature layer beneath every route.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            FortyGuard provides hyperlocal, street-level temperature intelligence at roughly 2-metre
            resolution, plus short-horizon forecasts. HeatRoute turns that layer into a routing
            decision: it scores each candidate walking path segment by segment, estimates minutes of
            high-heat exposure, and recommends the coolest option that stays within an acceptable
            travel-time penalty.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Street-level", "Not city-wide averages"],
            ["Segment scoring", "Exposure per path segment"],
            ["12-hour forecast", "Leave now or leave later"],
            ["Explainable", "No unexplained score"],
          ].map(([k, v]) => (
            <div key={k} className="glass-panel rounded-2xl p-4">
              <p className="font-display text-sm font-semibold">{k}</p>
              <p className="mt-1 text-xs text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-5 py-24 text-center sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-25"
        style={{
          background: "radial-gradient(circle, #FF8A3D 0%, #C2410C 50%, transparent 80%)",
        }}
      />
      <div className="relative z-10">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-5xl tracking-tight">
          Your next walk can be several degrees cooler.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground leading-relaxed">
          Enter a destination and see the heat tradeoff before you step outside.
        </p>
        <Link
          to="/app"
          className="mt-9 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "var(--gradient-heat-cta)" }}
        >
          Try HeatRoute <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/20 bg-void/60 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex sm:justify-between">
        <p className="min-w-0 truncate">
          HeatRoute — street-level temperature data from FortyGuard.
        </p>
        <p className="shrink-0 font-mono text-xs">Made for walkers.</p>
      </div>
    </footer>
  );
}
