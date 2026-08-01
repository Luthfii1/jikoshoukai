"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto, type PhotoId } from "@/lib/photos";
import { PhotoSlot, ScrollHint } from "@/components/Shell";

type CountryKey = "taiwan" | "thailand" | "korea" | "usa";

const START_COST = 248000;

const PINS: {
  key: CountryKey;
  cx: number;
  cy: number;
  flag: string;
  photos: PhotoId[];
}[] = [
  { key: "taiwan", cx: 78, cy: 46, flag: "🇹🇼", photos: ["taiwan-1", "taiwan-2"] },
  { key: "thailand", cx: 69, cy: 56, flag: "🇹🇭", photos: ["thailand-1"] },
  { key: "korea", cx: 81, cy: 34, flag: "🇰🇷", photos: ["korea-1"] },
  { key: "usa", cx: 16, cy: 38, flag: "🇺🇸", photos: ["usa-1"] },
];

const JAKARTA = { cx: 73, cy: 66 };
const OSAKA = { cx: 84, cy: 40 };

export function WorldBeat() {
  const { t, locale } = useLocale();
  const { isPresent } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [counter, setCounter] = useState(START_COST);
  const [active, setActive] = useState<CountryKey | null>(null);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const path = pathRef.current;
    if (!pin || !path) return;

    gsap.registerPlugin(ScrollTrigger);

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Present mode / reduced motion: show finished state, no pin
    if (
      isPresent ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      path.style.strokeDashoffset = "0";
      setCounter(0);
      setDrawn(1);
      return;
    }

    const cost = { v: START_COST };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 20,
          onUpdate: (self) => {
            setDrawn(self.progress);
          },
        },
      });

      // Hold a beat at the start, then draw trail + crash cost to ¥0
      tl.to({}, { duration: 0.12 })
        .to(
          path,
          {
            strokeDashoffset: 0,
            ease: "none",
            duration: 0.88,
          },
          0.12,
        )
        .to(
          cost,
          {
            v: 0,
            ease: "power2.inOut",
            duration: 0.75,
            onUpdate: () => setCounter(Math.round(cost.v)),
          },
          0.2,
        );

      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
  }, [isPresent]);

  // Curved journey: Jakarta → Taiwan → Thailand → Korea → USA (then hint Osaka)
  const trail = `
    M ${JAKARTA.cx} ${JAKARTA.cy}
    C 76 58, 77 50, ${PINS[0].cx} ${PINS[0].cy}
    C 74 52, 70 54, ${PINS[1].cx} ${PINS[1].cy}
    C 72 48, 78 40, ${PINS[2].cx} ${PINS[2].cy}
    C 60 28, 35 30, ${PINS[3].cx} ${PINS[3].cy}
  `;

  return (
    <section
      id="beat-world"
      data-atmosphere="cool"
      className="relative z-[1] bg-[var(--bg-cool)]"
    >
      <div
        ref={pinRef}
        className="relative z-[1] flex h-[100svh] w-full items-center overflow-hidden bg-[var(--bg-cool)]"
      >
        {/* Soft grid / atlas feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--line) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-8 px-6 py-20 md:flex-row md:items-center md:gap-10 md:px-10 md:pl-16">
          <div className="md:w-[38%]">
            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <h2
                className={`text-3xl font-bold text-[var(--ink)] md:text-5xl ${
                  locale === "en" ? "en-display" : "display"
                }`}
              >
                {t.world.headline}
              </h2>
              <span className="translate-y-[-2px] rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white md:text-sm">
                {t.world.badge}
              </span>
            </div>
            <p className="mb-8 max-w-md text-[var(--ink-soft)] leading-relaxed">
              {t.world.sub}
            </p>

            <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white/80 p-6 backdrop-blur">
              <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--ink-mute)] uppercase">
                {t.world.counterLabel}
              </p>
              <p className="tabular text-5xl font-black tracking-tight text-[var(--accent)] md:text-6xl">
                {counter === 0
                  ? t.world.counterValue
                  : `¥${counter.toLocaleString()}`}
              </p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {t.world.counterCaption}
              </p>
              <div
                className="absolute bottom-0 left-0 h-1 bg-[var(--accent)]"
                style={{ width: `${drawn * 100}%` }}
              />
            </div>
          </div>

          <div className="relative md:w-[62%]">
            <svg
              viewBox="0 0 100 80"
              className="h-auto w-full drop-shadow-sm"
              role="img"
              aria-label="Travel map"
            >
            <defs>
              <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8EEF4" />
                <stop offset="100%" stopColor="#DDE6EF" />
              </linearGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F3EDE4" />
                <stop offset="100%" stopColor="#E5DCCF" />
              </linearGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="100" height="80" rx="3" fill="url(#ocean)" />

            {/* Longitude / latitude whispers */}
            {[20, 40, 60].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#C8D2DC"
                strokeWidth="0.15"
                strokeDasharray="1 1.5"
              />
            ))}
            {[25, 50, 75].map((x) => (
              <line
                key={x}
                x1={x}
                y1="0"
                x2={x}
                y2="80"
                stroke="#C8D2DC"
                strokeWidth="0.15"
                strokeDasharray="1 1.5"
              />
            ))}

            {/* Americas — stylized west */}
            <path
              d="M8 22 C12 18, 18 20, 22 28 C24 36, 20 44, 16 48 C12 52, 8 50, 6 44 C4 36, 5 28, 8 22 Z"
              fill="url(#land)"
              stroke="#D4CBBE"
              strokeWidth="0.3"
            />
            <path
              d="M14 50 C18 52, 20 58, 17 64 C14 68, 10 66, 9 60 C8 54, 11 50, 14 50 Z"
              fill="url(#land)"
              stroke="#D4CBBE"
              strokeWidth="0.3"
              opacity="0.85"
            />

            {/* Asia-Pacific mass */}
            <path
              d="M58 22 C66 16, 78 18, 86 24 C92 30, 94 40, 90 48 C86 56, 78 60, 70 58 C64 62, 60 68, 56 66 C52 58, 54 48, 58 40 C56 32, 54 26, 58 22 Z"
              fill="url(#land)"
              stroke="#D4CBBE"
              strokeWidth="0.35"
            />
            {/* Japan arc */}
            <path
              d="M86 32 C88 34, 89 38, 87 42 C85 40, 84 36, 86 32 Z"
              fill="#E8DFD2"
              stroke="#D4CBBE"
              strokeWidth="0.25"
            />
            {/* Indonesia / SE Asia islands */}
            <ellipse cx="72" cy="64" rx="6" ry="2.5" fill="#E8DFD2" opacity="0.9" />
            <ellipse cx="66" cy="62" rx="3" ry="1.5" fill="#E8DFD2" opacity="0.8" />

            {/* Soft clouds */}
            <ellipse cx="40" cy="18" rx="8" ry="2.5" fill="white" opacity="0.45" />
            <ellipse cx="55" cy="14" rx="5" ry="1.8" fill="white" opacity="0.35" />

            {/* Dashed foreshadow path under animated stroke */}
            <path
              d={trail}
              fill="none"
              stroke="#E8934A"
              strokeWidth="0.35"
              strokeDasharray="1.2 1.2"
              opacity="0.25"
            />

            <path
              ref={pathRef}
              d={trail}
              fill="none"
              stroke="#E8934A"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#softGlow)"
            />

            {/* Origin */}
            <g>
              <circle cx={JAKARTA.cx} cy={JAKARTA.cy} r="1.6" fill="#1A1A2E" />
              <circle
                cx={JAKARTA.cx}
                cy={JAKARTA.cy}
                r="2.8"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="0.3"
                opacity="0.4"
              />
              <text
                x={JAKARTA.cx - 1}
                y={JAKARTA.cy + 5}
                fontSize="2.4"
                fill="#4A4A5A"
                fontWeight="600"
              >
                Jakarta
              </text>
            </g>

            {/* Osaka hint (after world travels) */}
            <g opacity={drawn > 0.85 ? 0.7 : 0.15}>
              <circle cx={OSAKA.cx} cy={OSAKA.cy} r="1.1" fill="#C9742F" />
              <text
                x={OSAKA.cx + 2}
                y={OSAKA.cy + 0.8}
                fontSize="2"
                fill="#C9742F"
              >
                Osaka
              </text>
            </g>

            {PINS.map((pin, i) => {
              const visible = drawn > (i + 1) / (PINS.length + 1) - 0.05;
              return (
                <g
                  key={pin.key}
                  className="cursor-pointer"
                  opacity={visible ? 1 : 0.2}
                  onClick={() =>
                    setActive((a) => (a === pin.key ? null : pin.key))
                  }
                  style={{ transition: "opacity 0.4s" }}
                >
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r="3.8"
                    fill="#E8934A"
                    opacity="0.15"
                  >
                    {visible && (
                      <animate
                        attributeName="r"
                        values="3;5;3"
                        dur="2.6s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r="2"
                    fill="#E8934A"
                    stroke="white"
                    strokeWidth="0.55"
                  />
                  <text
                    x={pin.cx}
                    y={pin.cy - 3.5}
                    textAnchor="middle"
                    fontSize="3.2"
                  >
                    {pin.flag}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-4 flex flex-wrap gap-2">
            {PINS.map((pin) => (
              <button
                key={pin.key}
                type="button"
                onClick={() =>
                  setActive((a) => (a === pin.key ? null : pin.key))
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active === pin.key
                    ? "border-[var(--accent)] bg-[var(--bg-warm)] text-[var(--accent-deep)]"
                    : "border-[var(--line)] bg-white/80 text-[var(--ink-soft)] hover:border-[var(--accent)]"
                }`}
              >
                {pin.flag} {t.world.countries[pin.key].name}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {active && (
              <CountryCard
                countryKey={active}
                onClose={() => setActive(null)}
              />
            )}
          </AnimatePresence>
        </div>
        </div>
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
  const c = t.world.countries[countryKey];
  const pin = PINS.find((p) => p.key === countryKey)!;
  const photo = getPhoto(pin.photos[0], locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_70px_rgba(26,26,46,0.14)] md:left-auto md:right-0 md:w-[340px]"
    >
      <div className="relative h-40">
        <PhotoSlot src={photo.src} alt={photo.alt} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--ink)]"
          aria-label="Close"
        >
          ×
        </button>
        <span className="absolute bottom-3 left-3 text-2xl">{pin.flag}</span>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs text-[var(--ink-mute)]">{c.year}</p>
        <h3 className="mb-1 text-lg font-bold text-[var(--ink)]">{c.program}</h3>
        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{c.story}</p>
      </div>
    </motion.div>
  );
}
