"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Map as MapLibreMap,
  Marker,
  AttributionControl,
  type LngLatLike,
  type GeoJSONSource,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto, type PhotoId } from "@/lib/photos";
import { PhotoSlot, ScrollHint } from "@/components/Shell";
import { dwellAlong } from "@/lib/scrollDwell";

type CountryKey = "jakarta" | "taiwan" | "thailand" | "osaka" | "korea" | "usa";

const START_COST = 248000;

type Stop = {
  key: string;
  countryKey?: CountryKey;
  labelJa: string;
  labelEn: string;
  coords: [number, number];
  zoom: number;
  flag: string;
  photo?: PhotoId;
  /** CSS object-position when portrait crops awkwardly */
  objectPos?: string;
};

/** Reliable Carto light raster — Google-maps-like, no style JSON that can hang */
const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap © CARTO",
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

const ROUTE: Stop[] = [
  {
    key: "jakarta",
    countryKey: "jakarta",
    labelJa: "ジャカルタ",
    labelEn: "Jakarta",
    coords: [106.8456, -6.2088],
    zoom: 4.4,
    flag: "🇮🇩",
    photo: "jakarta-1",
    objectPos: "center 56%",
  },
  {
    key: "taiwan",
    countryKey: "taiwan",
    labelJa: "台湾",
    labelEn: "Taiwan",
    coords: [121.5654, 25.033],
    zoom: 5,
    flag: "🇹🇼",
    photo: "taiwan-1",
  },
  {
    key: "thailand",
    countryKey: "thailand",
    labelJa: "タイ",
    labelEn: "Thailand",
    coords: [100.5018, 13.7563],
    zoom: 4.8,
    flag: "🇹🇭",
    photo: "thailand-1",
  },
  {
    key: "osaka",
    countryKey: "osaka",
    labelJa: "大阪",
    labelEn: "Osaka",
    coords: [135.5023, 34.6937],
    zoom: 5.2,
    flag: "🇯🇵",
    photo: "osaka-1",
  },
  {
    key: "korea",
    countryKey: "korea",
    labelJa: "韓国",
    labelEn: "Korea",
    coords: [127.3845, 36.3504],
    zoom: 4.9,
    flag: "🇰🇷",
    photo: "korea-1",
  },
  {
    key: "usa",
    countryKey: "usa",
    labelJa: "ワシントンD.C.",
    labelEn: "Washington, D.C.",
    coords: [-77.0369, 38.9072],
    zoom: 5,
    flag: "🇺🇸",
    photo: "usa-1",
    objectPos: "center 62%",
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpCoord(
  a: [number, number],
  b: [number, number],
  t: number,
): [number, number] {
  let aLon = a[0];
  let bLon = b[0];
  if (aLon > 0 && bLon < 0) bLon += 360;
  if (aLon < 0 && bLon > 0) aLon += 360;
  let lon = lerp(aLon, bLon, t);
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  return [lon, lerp(a[1], b[1], t)];
}

function cameraAtProgress(progress: number) {
  const max = ROUTE.length - 1;
  // Longer park at each city (esp. first/last), slower eased flights between
  const scaled = dwellAlong(progress, max, 0.58, 0.1, 0.16);
  const i = Math.min(max - 1, Math.floor(scaled));
  const t = scaled - i;
  return {
    center: lerpCoord(ROUTE[i].coords, ROUTE[i + 1].coords, t) as LngLatLike,
    zoom: lerp(ROUTE[i].zoom, ROUTE[i + 1].zoom, t),
    // Snap label to destination once mostly arrived
    index: Math.min(max, t > 0.85 ? i + 1 : i),
  };
}

function routeGeoJSON(progress: number) {
  const pts: [number, number][] = [];
  const max = ROUTE.length - 1;
  const scaled = dwellAlong(progress, max, 0.58, 0.1, 0.16);
  const whole = Math.floor(scaled);
  const frac = scaled - whole;

  for (let i = 0; i <= whole; i++) pts.push(ROUTE[i].coords);
  if (whole < max && frac > 0.001) {
    pts.push(lerpCoord(ROUTE[whole].coords, ROUTE[whole + 1].coords, frac));
  }
  if (pts.length < 2) pts.push(ROUTE[0].coords, ROUTE[0].coords);

  return {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "LineString" as const, coordinates: pts },
  };
}

function fullRouteGeoJSON() {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: ROUTE.map((r) => r.coords),
    },
  };
}

function createPhotoMarkerEl(stop: Stop, photoSrc: string) {
  const wrap = document.createElement("button");
  wrap.type = "button";
  wrap.className = "travel-photo-pin";
  wrap.style.cursor = "pointer";
  const imgStyle = stop.objectPos
    ? `style="object-position: ${stop.objectPos}"`
    : "";
  wrap.innerHTML = `
    <span class="travel-photo-pin__needle"></span>
    <span class="travel-photo-pin__card">
      <img src="${photoSrc}" alt="" ${imgStyle} />
      <span class="travel-photo-pin__label">${stop.flag} ${stop.labelEn}</span>
    </span>
  `;
  return wrap;
}

export function WorldBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [counter, setCounter] = useState(START_COST);
  const [active, setActive] = useState<CountryKey | null>(null);
  const [drawn, setDrawn] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);

  const currentStop = ROUTE[stopIndex];
  const currentCountry = currentStop.countryKey
    ? t.world.countries[currentStop.countryKey]
    : null;

  const applyStop = (index: number, animate = false) => {
    const map = mapRef.current;
    const i = Math.max(0, Math.min(ROUTE.length - 1, index));
    const stop = ROUTE[i];
    const p = i / Math.max(1, ROUTE.length - 1);

    setStopIndex(i);
    setDrawn(p);
    setCounter(i >= ROUTE.length - 1 ? 0 : START_COST);

    if (!map || !mapLoaded) return;

    const view = {
      center: stop.coords as LngLatLike,
      zoom: stop.zoom,
      pitch: 25 + p * 20,
      bearing: p > 0.75 ? -18 : p * 10,
    };

    if (animate) {
      map.easeTo({ ...view, duration: 1100 });
    } else {
      map.jumpTo(view);
    }

    const src = map.getSource("route-drawn") as GeoJSONSource | undefined;
    // Draw route fully through current stop
    src?.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: ROUTE.slice(0, i + 1).map((r) => r.coords),
      },
    });

    markersRef.current.forEach((marker, mi) => {
      const el = marker.getElement();
      el.classList.toggle("is-active", mi === i);
      el.classList.toggle("is-passed", mi <= i);
    });
  };

  const applyProgress = (p: number) => {
    const map = mapRef.current;
    const cam = cameraAtProgress(p);
    setStopIndex(cam.index);
    setDrawn(p);

    if (!map || !mapLoaded) return;

    map.jumpTo({
      center: cam.center,
      zoom: cam.zoom,
      pitch: 25 + p * 20,
      bearing: p > 0.75 ? -18 : p * 10,
    });

    const src = map.getSource("route-drawn") as GeoJSONSource | undefined;
    src?.setData(routeGeoJSON(p));

    markersRef.current.forEach((marker, i) => {
      const el = marker.getElement();
      el.classList.toggle("is-active", i === cam.index);
      el.classList.toggle("is-passed", i <= cam.index);
    });
  };

  // Present mode: step city-by-city with →, always start at Indonesia
  useEffect(() => {
    if (!isPresent || !mapLoaded) return;
    if (beatId !== "world") {
      applyStop(0, false);
      setActive(null);
      return;
    }
    applyStop(subStep, subStep > 0);
    // If detail card is open, keep it synced with the current stop
    setActive((prev) => {
      if (prev === null) return null;
      return ROUTE[subStep]?.countryKey ?? null;
    });
    mapRef.current?.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, mapLoaded, beatId, subStep]);

  useEffect(() => {
    if (!mapLoaded) return;
    const pin = pinRef.current;
    if (!pin) return;

    gsap.registerPlugin(ScrollTrigger);

    // Present mode: camera is driven by subStep effect only (starts at Jakarta)
    if (isPresent) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCounter(0);
      applyProgress(1);
      return;
    }

    const cost = { v: START_COST };
    const prog = { p: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=720%",
          pin: true,
          pinSpacing: true,
          scrub: 1.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 20,
          onEnter: () => mapRef.current?.resize(),
          onEnterBack: () => mapRef.current?.resize(),
        },
      });

      tl.to({}, { duration: 0.06 })
        .to(
          prog,
          {
            p: 1,
            ease: "none",
            duration: 1,
            onUpdate: () => applyProgress(prog.p),
          },
          0.06,
        )
        .to(
          cost,
          {
            v: 0,
            ease: "power2.inOut",
            duration: 0.7,
            onUpdate: () => setCounter(Math.round(cost.v)),
          },
          0.15,
        );

      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, mapLoaded]);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: mapEl.current,
      style: MAP_STYLE,
      center: ROUTE[0].coords,
      zoom: 3.4,
      pitch: 20,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.addControl(new AttributionControl({ compact: true }), "bottom-right");

    const setupLayers = () => {
      if (map.getSource("route-full")) return;

      map.addSource("route-full", {
        type: "geojson",
        data: fullRouteGeoJSON(),
      });
      map.addSource("route-drawn", {
        type: "geojson",
        data: routeGeoJSON(0),
      });

      map.addLayer({
        id: "route-full-line",
        type: "line",
        source: "route-full",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#E8934A",
          "line-width": 2,
          "line-opacity": 0.25,
          "line-dasharray": [1.5, 2],
        },
      });
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route-drawn",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#E8934A",
          "line-width": 12,
          "line-opacity": 0.28,
          "line-blur": 6,
        },
      });
      map.addLayer({
        id: "route-drawn-line",
        type: "line",
        source: "route-drawn",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#E8934A",
          "line-width": 4,
          "line-opacity": 1,
        },
      });

      // Photo pins
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = ROUTE.map((stop) => {
        const src = stop.photo
          ? getPhoto(stop.photo, "en").src
          : "/photos/hero-portrait.svg";
        const el = createPhotoMarkerEl(stop, src);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (stop.countryKey) {
            setActive(stop.countryKey);
          }
        });
        return new Marker({ element: el, anchor: "bottom", offset: [0, -4] })
          .setLngLat(stop.coords)
          .addTo(map);
      });

      setMapLoaded(true);
      ScrollTrigger.refresh();
    };

    map.on("load", setupLayers);
    // Fallback if style already loaded
    if (map.isStyleLoaded()) setupLayers();
    map.on("error", () => {
      // Still allow scroll storytelling without map layers
      setMapLoaded(true);
    });

    mapRef.current = map;
    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!active || !mapRef.current) return;
    // In present/explore, clicking a chip can focus that city
    if (isPresent && beatId === "world") return;
    const stop = ROUTE.find((r) => r.countryKey === active);
    if (!stop) return;
    mapRef.current.easeTo({
      center: stop.coords,
      zoom: Math.max(stop.zoom, 5.2),
      pitch: 40,
      duration: 800,
    });
  }, [active, isPresent, beatId]);

  const stopName =
    locale === "ja" ? currentStop.labelJa : currentStop.labelEn;

  return (
    <section
      id="beat-world"
      data-atmosphere="cool"
      className="relative z-[1] bg-[#d9e2ec]"
    >
      <div
        ref={pinRef}
        className="relative z-[1] h-[100svh] w-full overflow-hidden"
      >
        <div ref={mapEl} className="absolute inset-0 z-0 h-full w-full" />

        {/* Left readability veil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full bg-gradient-to-r from-[var(--bg-cool)] via-[var(--bg-cool)]/80 to-transparent md:w-[55%]"
        />

        {/* Story overlay — always on top */}
        <div className="pointer-events-none relative z-20 flex h-full flex-col justify-between px-5 py-20 md:max-w-lg md:px-10 md:pl-16 md:py-24">
          <div className="pointer-events-auto">
            <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[var(--accent-deep)] uppercase">
              {locale === "ja" ? "旅のルート" : "Travel route"} · {stopIndex + 1}/
              {ROUTE.length}
            </p>
            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <h2
                className={`text-3xl font-bold text-[var(--ink)] md:text-5xl ${
                  locale === "en" ? "en-display" : "display"
                }`}
              >
                {t.world.headline}
              </h2>
              <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white">
                {t.world.badge}
              </span>
            </div>
            <p className="mb-5 max-w-md text-sm text-[var(--ink-soft)] md:text-base">
              {t.world.sub}
            </p>

            {/* Live destination card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStop.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-[0_16px_40px_rgba(26,26,46,0.12)] backdrop-blur-md"
              >
                <div className="flex gap-3 p-3">
                  {currentStop.photo && (
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                      <PhotoSlot
                        src={getPhoto(currentStop.photo, locale).src}
                        alt={getPhoto(currentStop.photo, locale).alt}
                        className="h-full w-full"
                        style={
                          currentStop.objectPos
                            ? { objectPosition: currentStop.objectPos }
                            : undefined
                        }
                      />
                    </div>
                  )}
                  <div className="min-w-0 py-1">
                    <p className="text-lg font-bold text-[var(--ink)]">
                      {currentStop.flag} {stopName}
                    </p>
                    {currentCountry ? (
                      <>
                        <p className="text-xs text-[var(--ink-mute)]">
                          {currentCountry.year} · {currentCountry.program}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--ink-soft)]">
                          {currentCountry.story}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-[var(--ink-soft)]">
                        {locale === "ja"
                          ? "すべての旅のスタート地点。"
                          : "Where every journey started."}
                      </p>
                    )}
                    {currentStop.countryKey && (
                      <button
                        type="button"
                        onClick={() => setActive(currentStop.countryKey!)}
                        className="mt-2 text-xs font-semibold text-[var(--accent-deep)]"
                      >
                        {locale === "ja" ? "詳しく見る →" : "See more →"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="relative max-w-sm overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(26,26,46,0.1)] backdrop-blur-md">
              <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--ink-mute)] uppercase">
                {t.world.counterLabel}
              </p>
              <p className="tabular text-4xl font-black text-[var(--accent)] md:text-5xl">
                {counter === 0
                  ? t.world.counterValue
                  : `¥${counter.toLocaleString()}`}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {t.world.counterCaption}
              </p>
              <div
                className="absolute bottom-0 left-0 h-1 bg-[var(--accent)]"
                style={{ width: `${drawn * 100}%` }}
              />
            </div>
          </div>

          {/* Destination chips */}
          <div className="pointer-events-auto mt-6 flex flex-wrap gap-2 pb-2">
            {ROUTE.filter((r) => r.countryKey).map((stop) => {
              const key = stop.countryKey!;
              const reached =
                ROUTE.findIndex((r) => r.key === stop.key) <= stopIndex;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition ${
                    active === key
                      ? "border-[var(--accent)] bg-[var(--bg-warm)] text-[var(--accent-deep)]"
                      : reached
                        ? "border-white/80 bg-white/85 text-[var(--ink)]"
                        : "border-white/50 bg-white/50 text-[var(--ink-mute)]"
                  }`}
                >
                  {stop.flag}{" "}
                  {locale === "ja" ? stop.labelJa : stop.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {active && (
            <CountryCard
              countryKey={active}
              onClose={() => setActive(null)}
            />
          )}
        </AnimatePresence>

        {!isPresent && <ScrollHint visible={drawn < 0.92} />}
      </div>
    </section>
  );
}

function CountryCard({
  countryKey,
  onClose,
}: {
  countryKey: CountryKey;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  const { isPresent } = usePresentation();
  const c = t.world.countries[countryKey];
  const stop = ROUTE.find((r) => r.countryKey === countryKey)!;
  const photo = getPhoto(stop.photo ?? "taiwan-1", locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      className={`absolute right-4 bottom-16 z-30 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_70px_rgba(26,26,46,0.2)] md:right-10 md:bottom-20 ${
        isPresent
          ? "w-[min(520px,calc(100%-2rem))]"
          : "w-[min(400px,calc(100%-2rem))]"
      }`}
    >
      <div className={`relative ${isPresent ? "h-56 md:h-64" : "h-48 md:h-52"}`}>
        <PhotoSlot
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full"
          style={
            stop.objectPos ? { objectPosition: stop.objectPos } : undefined
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--ink)]"
          aria-label="Close"
        >
          ×
        </button>
        <div className="absolute bottom-3 left-3 text-white md:bottom-4 md:left-4">
          <p
            className={`font-bold ${isPresent ? "text-3xl" : "text-2xl"}`}
          >
            {stop.flag} {locale === "ja" ? stop.labelJa : stop.labelEn}
          </p>
          <p
            className={`text-white/80 ${isPresent ? "text-sm" : "text-xs"}`}
          >
            {c.year} · {c.program}
          </p>
        </div>
      </div>
      <div className={isPresent ? "p-5 md:p-6" : "p-4"}>
        <p
          className={`leading-relaxed text-[var(--ink-soft)] ${
            isPresent ? "text-base md:text-lg" : "text-sm"
          }`}
        >
          {c.story}
        </p>
      </div>
    </motion.div>
  );
}
