"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { geoEqualEarth, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";

export type MapStop = {
  key: string;
  name: string;
  flag?: string;
  coords: [number, number]; // [lon, lat]
};

type TravelMapProps = {
  stops: MapStop[];
  origin: MapStop;
  hint?: MapStop | null;
  drawn: number;
  activeKey: string | null;
  onSelect: (key: string) => void;
  width?: number;
  height?: number;
};

export type TravelMapHandle = {
  getTrailPath: () => SVGPathElement | null;
};

function buildCurvePath(
  projection: GeoProjection,
  points: [number, number][],
): string {
  const projected = points
    .map((c) => projection(c))
    .filter((p): p is [number, number] => Array.isArray(p));

  if (projected.length < 2) return "";

  let d = `M ${projected[0][0]} ${projected[0][1]}`;
  for (let i = 1; i < projected.length; i++) {
    const [x0, y0] = projected[i - 1];
    const [x1, y1] = projected[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2 - Math.min(40, Math.hypot(x1 - x0, y1 - y0) * 0.18);
    d += ` Q ${mx} ${my} ${x1} ${y1}`;
  }
  return d;
}

export const TravelMap = forwardRef<TravelMapHandle, TravelMapProps>(
  function TravelMap(
    {
      stops,
      origin,
      hint,
      drawn,
      activeKey,
      onSelect,
      width = 800,
      height = 420,
    },
    ref,
  ) {
    const trailRef = useRef<SVGPathElement>(null);
    const [landPath, setLandPath] = useState("");
    const [ready, setReady] = useState(false);

    const projection = useMemo(() => {
      return geoEqualEarth()
        .rotate([-150, 0]) // Pacific-centered so Asia ↔ USA reads clearly
        .fitExtent(
          [
            [16, 24],
            [width - 16, height - 12],
          ],
          { type: "Sphere" },
        );
    }, [width, height]);

    const pathGen = useMemo(() => geoPath(projection), [projection]);

    useImperativeHandle(ref, () => ({
      getTrailPath: () => trailRef.current,
    }));

    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch("/maps/countries-110m.json");
          const topology = (await res.json()) as Topology<{
            countries: GeometryCollection;
          }>;
          const countries = feature(
            topology,
            topology.objects.countries,
          ) as FeatureCollection<Geometry>;
          if (cancelled) return;
          setLandPath(pathGen(countries) ?? "");
          setReady(true);
        } catch {
          if (!cancelled) setReady(true);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [pathGen]);

    const routeCoords: [number, number][] = [
      origin.coords,
      ...stops.map((s) => s.coords),
    ];
    const trailD = buildCurvePath(projection, routeCoords);
    const foreshadowD = trailD;

    const project = (coords: [number, number]) => {
      const p = projection(coords);
      return p ? { x: p[0], y: p[1] } : { x: 0, y: 0 };
    };

    const originPt = project(origin.coords);
    const hintPt = hint ? project(hint.coords) : null;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="World travel map"
      >
        <defs>
          <linearGradient id="oceanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E7EEF5" />
            <stop offset="100%" stopColor="#D5E0EB" />
          </linearGradient>
          <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean + sphere */}
        <path
          d={pathGen({ type: "Sphere" }) ?? ""}
          fill="url(#oceanFill)"
          stroke="#C5D0DB"
          strokeWidth={1}
        />

        {/* Graticule-ish subtle parallels */}
        {[-40, -20, 0, 20, 40].map((lat) => {
          const d = pathGen({
            type: "LineString",
            coordinates: Array.from({ length: 37 }, (_, i) => [
              -180 + i * 10,
              lat,
            ]),
          });
          return (
            <path
              key={lat}
              d={d ?? ""}
              fill="none"
              stroke="#B8C5D2"
              strokeWidth={0.4}
              strokeDasharray="2 4"
              opacity={0.45}
            />
          );
        })}

        {/* Real country outlines */}
        {landPath && (
          <path
            d={landPath}
            fill="#E8DFD2"
            stroke="#C9BBA8"
            strokeWidth={0.45}
            strokeLinejoin="round"
            opacity={ready ? 1 : 0}
          />
        )}

        {/* Foreshadow dashed route */}
        {foreshadowD && (
          <path
            d={foreshadowD}
            fill="none"
            stroke="#E8934A"
            strokeWidth={1.5}
            strokeDasharray="4 5"
            opacity={0.22}
          />
        )}

        {/* Animated trail */}
        {trailD && (
          <path
            ref={trailRef}
            d={trailD}
            fill="none"
            stroke="#E8934A"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trailGlow)"
          />
        )}

        {/* Origin */}
        <g>
          <circle cx={originPt.x} cy={originPt.y} r={5} fill="#1A1A2E" />
          <circle
            cx={originPt.x}
            cy={originPt.y}
            r={10}
            fill="none"
            stroke="#1A1A2E"
            strokeWidth={1}
            opacity={0.3}
          />
          <text
            x={originPt.x}
            y={originPt.y + 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill="#4A4A5A"
          >
            {origin.name}
          </text>
        </g>

        {/* Destination pins */}
        {stops.map((stop, i) => {
          const pt = project(stop.coords);
          const visible = drawn > (i + 1) / (stops.length + 1) - 0.05;
          const isActive = activeKey === stop.key;
          return (
            <g
              key={stop.key}
              className="cursor-pointer"
              opacity={visible ? 1 : 0.18}
              onClick={() => onSelect(stop.key)}
              style={{ transition: "opacity 0.35s" }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 14 : 11}
                fill="#E8934A"
                opacity={0.18}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6}
                fill="#E8934A"
                stroke="white"
                strokeWidth={2}
              />
              {stop.flag && (
                <text
                  x={pt.x}
                  y={pt.y - 14}
                  textAnchor="middle"
                  fontSize={14}
                >
                  {stop.flag}
                </text>
              )}
              <text
                x={pt.x}
                y={pt.y + 22}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="#4A4A5A"
              >
                {stop.name}
              </text>
            </g>
          );
        })}

        {/* Osaka hint */}
        {hint && hintPt && (
          <g opacity={drawn > 0.85 ? 0.85 : 0.15}>
            <circle cx={hintPt.x} cy={hintPt.y} r={4.5} fill="#C9742F" />
            <text
              x={hintPt.x + 8}
              y={hintPt.y + 4}
              fontSize={11}
              fontWeight={600}
              fill="#C9742F"
            >
              {hint.name}
            </text>
          </g>
        )}
      </svg>
    );
  },
);
