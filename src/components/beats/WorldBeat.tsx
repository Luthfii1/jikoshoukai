"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { getPhoto, type PhotoId } from "@/lib/photos";
import { PhotoSlot } from "@/components/Shell";

type CountryKey = "taiwan" | "thailand" | "korea" | "usa";

const PINS: {
  key: CountryKey;
  cx: number;
  cy: number;
  flag: string;
  photos: PhotoId[];
}[] = [
  { key: "taiwan", cx: 78, cy: 48, flag: "🇹🇼", photos: ["taiwan-1", "taiwan-2"] },
  { key: "thailand", cx: 70, cy: 58, flag: "🇹🇭", photos: ["thailand-1"] },
  { key: "korea", cx: 82, cy: 38, flag: "🇰🇷", photos: ["korea-1"] },
  { key: "usa", cx: 18, cy: 42, flag: "🇺🇸", photos: ["usa-1"] },
];

const JAKARTA = { cx: 74, cy: 68 };

export function WorldBeat() {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [counter, setCounter] = useState(248000);
  const [active, setActive] = useState<CountryKey | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    gsap.registerPlugin(ScrollTrigger);

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      setCounter(0);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 0.6,
        },
      });

      tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

      const obj = { v: 248000 };
      tl.to(
        obj,
        {
          v: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: () => setCounter(Math.round(obj.v)),
        },
        0.2,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const trail = `M ${JAKARTA.cx} ${JAKARTA.cy}
    L ${PINS[0].cx} ${PINS[0].cy}
    L ${PINS[1].cx} ${PINS[1].cy}
    L ${PINS[2].cx} ${PINS[2].cy}
    L ${PINS[3].cx} ${PINS[3].cy}`;

  return (
    <section
      id="beat-world"
      ref={sectionRef}
      className="beat relative overflow-hidden bg-[var(--bg-primary)]"
    >
      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center gap-8 px-6 py-24 md:flex-row md:items-center md:gap-12 md:px-10">
        <div className="md:w-[42%]">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2
              className={`text-3xl font-bold text-[var(--ink)] md:text-5xl ${
                locale === "en" ? "en-display" : "display"
              }`}
            >
              {t.world.headline}
            </h2>
            <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white md:text-sm">
              {t.world.badge}
            </span>
          </div>
          <p className="mb-8 max-w-md text-[var(--ink-soft)]">{t.world.sub}</p>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] p-6">
            <p className="mb-1 text-xs tracking-widest text-[var(--ink-mute)] uppercase">
              {t.world.counterLabel}
            </p>
            <p className="tabular text-5xl font-black text-[var(--accent)] md:text-6xl">
              {counter === 0
                ? t.world.counterValue
                : `¥${counter.toLocaleString()}`}
            </p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {t.world.counterCaption}
            </p>
          </div>
        </div>

        <div className="relative md:w-[58%]">
          <svg
            viewBox="0 0 100 80"
            className="h-auto w-full"
            role="img"
            aria-label="Travel map"
          >
            <defs>
              <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F7F4EF" />
                <stop offset="100%" stopColor="#EFEAE3" />
              </linearGradient>
            </defs>
            <rect width="100" height="80" rx="4" fill="url(#ocean)" />
            {/* Stylized landmasses */}
            <ellipse cx="72" cy="48" rx="22" ry="18" fill="#E8E0D4" opacity="0.9" />
            <ellipse cx="22" cy="40" rx="16" ry="14" fill="#E8E0D4" opacity="0.85" />
            <ellipse cx="50" cy="62" rx="10" ry="6" fill="#E8E0D4" opacity="0.7" />

            <path
              ref={pathRef}
              d={trail}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Jakarta origin */}
            <circle cx={JAKARTA.cx} cy={JAKARTA.cy} r="1.4" fill="var(--ink)" />
            <text
              x={JAKARTA.cx}
              y={JAKARTA.cy + 4}
              textAnchor="middle"
              fontSize="2.2"
              fill="var(--ink-soft)"
            >
              Jakarta
            </text>

            {PINS.map((pin) => (
              <g
                key={pin.key}
                className="cursor-pointer"
                onClick={() =>
                  setActive((a) => (a === pin.key ? null : pin.key))
                }
              >
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="2.2"
                  fill="var(--accent)"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="3.5"
                  fill="var(--accent)"
                  opacity="0.2"
                >
                  <animate
                    attributeName="r"
                    values="3;4.5;3"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.35;0;0.35"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
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
                    : "border-[var(--line)] bg-white text-[var(--ink-soft)] hover:border-[var(--accent)]"
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
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_20px_60px_rgba(26,26,46,0.12)] md:left-auto md:right-0 md:w-[320px]"
    >
      <div className="relative h-36">
        <PhotoSlot src={photo.src} alt={photo.alt} className="h-full w-full" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--ink)]"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs text-[var(--ink-mute)]">
          {pin.flag} {c.year}
        </p>
        <h3 className="mb-1 text-lg font-bold text-[var(--ink)]">{c.program}</h3>
        <p className="text-sm text-[var(--ink-soft)]">{c.story}</p>
      </div>
    </motion.div>
  );
}
