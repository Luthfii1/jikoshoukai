"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot, ScrollHint } from "@/components/Shell";

const ALTITUDES = [0, 1800, 3000, 3776];

function lerpColor(a: string, b: string, t: number) {
  const pa = a.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  const pb = b.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function FujiBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [stop, setStop] = useState(0);

  const presentStop = isPresent && beatId === "fuji" ? subStep : stop;
  const climb = isPresent ? (presentStop + 1) / 3 : progress;
  const altitude = isPresent
    ? (ALTITUDES[presentStop + 1] ?? 3776)
    : Math.round(progress * 3776);

  useEffect(() => {
    if (!isPresent) return;
    setStop(subStep);
    setProgress((subStep + 1) / 3);
  }, [isPresent, subStep]);

  useEffect(() => {
    if (isPresent) return;
    const pin = pinRef.current;
    if (!pin) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      setStop(2);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=180%",
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 10,
        onUpdate: (self) => {
          setProgress(self.progress);
          setStop(Math.min(2, Math.floor(self.progress * 3)));
        },
      });
      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
  }, [isPresent]);

  // Night → pre-dawn → sunrise
  const skyTop =
    climb < 0.45
      ? lerpColor("0d1424", "2a3550", climb / 0.45)
      : climb < 0.75
        ? lerpColor("2a3550", "c45a3a", (climb - 0.45) / 0.3)
        : lerpColor("c45a3a", "ff9a5c", (climb - 0.75) / 0.25);
  const skyBottom =
    climb < 0.45
      ? lerpColor("1a2438", "5a6480", climb / 0.45)
      : climb < 0.75
        ? lerpColor("5a6480", "ffb080", (climb - 0.45) / 0.3)
        : lerpColor("ffb080", "ffe0b8", (climb - 0.75) / 0.25);

  const summitPhoto = getPhoto("fuji-3", locale);
  const climberY = 82 - climb * 58;
  const starsOpacity = Math.max(0, 1 - climb * 1.8);
  const sunY = 70 - climb * 55;
  const sunOpacity = climb > 0.55 ? (climb - 0.55) / 0.45 : 0;
  const atSummit = presentStop >= 2 || climb > 0.92;

  return (
    <section
      id="beat-fuji"
      data-atmosphere="dawn"
      className="relative z-[3] bg-[#0d1424]"
    >
      <div
        ref={pinRef}
        className="relative z-[3] h-[100svh] w-full overflow-hidden bg-[#0d1424]"
      >
        {/* Sky */}
        <div
          className="absolute inset-0 transition-[background] duration-700"
          style={{
            background: `linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 70%, ${skyBottom} 100%)`,
          }}
        />

        {/* Stars */}
        <div className="absolute inset-0" style={{ opacity: starsOpacity }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 55}%`,
                opacity: 0.3 + ((i * 13) % 50) / 100,
              }}
            />
          ))}
        </div>

        {/* Sun disk */}
        <div
          className="absolute left-1/2 h-16 w-16 -translate-x-1/2 rounded-full md:h-24 md:w-24"
          style={{
            top: `${sunY}%`,
            opacity: sunOpacity,
            background:
              "radial-gradient(circle, #fff5e0 0%, #ff9a4a 45%, transparent 70%)",
            boxShadow: "0 0 80px 30px rgba(255,154,74,0.35)",
          }}
        />

        {/* Far mist layer */}
        <div
          className="absolute inset-x-0 bottom-[20%] h-[40%] opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.35), transparent 65%)",
            transform: `translateY(${(1 - climb) * 50}px)`,
          }}
        />

        {/* Mid fog */}
        <div
          className="absolute inset-x-[-10%] bottom-[8%] h-[30%] opacity-40"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(220,230,240,0.45))",
            transform: `translateX(${Math.sin(climb * Math.PI) * 20}px) translateY(${(1 - climb) * 20}px)`,
          }}
        />

        {/* Mountain — layered */}
        <svg
          viewBox="0 0 100 70"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Back ridge */}
          <path
            d="M0 70 L20 42 L38 28 L50 18 L62 28 L80 44 L100 70 Z"
            fill="#12182a"
            opacity="0.55"
          />
          {/* Main Fuji cone */}
          <path
            d="M0 70 L30 38 L50 12 L70 38 L100 70 Z"
            fill="#0f1524"
          />
          {/* Snow cap — brightens near summit */}
          <path
            d="M40 28 L50 12 L60 28 L56 30 L50 20 L44 30 Z"
            fill="#f4f0e8"
            opacity={0.25 + climb * 0.75}
          />
          {/* Ridge lines */}
          <path
            d="M50 12 L38 40 M50 12 L62 40"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.15"
            opacity={0.15 + climb * 0.2}
          />
        </svg>

        {/* Ground vignette */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Climber + trail */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={`M 50 88 Q 48 70, 50 55 Q 52 40, 50 ${climberY}`}
            fill="none"
            stroke="#E8934A"
            strokeWidth="0.35"
            strokeDasharray="1 1.2"
            opacity="0.55"
          />
        </svg>

        <div
          className="absolute left-1/2 z-10 -translate-x-1/2"
          style={{ top: `${climberY}%` }}
        >
          <div className="relative">
            <div className="h-3.5 w-3.5 rounded-full bg-[var(--accent)] shadow-[0_0_20px_rgba(232,147,74,0.9)] ring-2 ring-white/80" />
            <div className="absolute top-4 left-1/2 h-5 w-px -translate-x-1/2 bg-[var(--accent)]/50" />
          </div>
        </div>

        {/* HUD */}
        <div className="relative z-20 mx-auto flex h-full max-w-5xl flex-col justify-between px-6 py-20 md:px-10 md:pl-16">
          <div>
            <p className="mb-2 text-[10px] tracking-[0.25em] text-white/50 uppercase">
              3,776 m · Honshu
            </p>
            <h2
              className={`mb-4 text-4xl font-black text-white md:text-6xl ${
                locale === "en" ? "en-display" : "display"
              }`}
            >
              {t.fuji.headline}
            </h2>
            <div className="inline-flex items-baseline gap-2 rounded-xl border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md">
              <p className="tabular text-3xl font-bold text-[var(--accent)] md:text-5xl">
                {altitude.toLocaleString()}
              </p>
              <span className="text-sm text-white/60">{t.fuji.unit}</span>
            </div>
          </div>

          <div className="max-w-sm space-y-3 pb-4">
            {t.fuji.stops.map((caption, i) => (
              <motion.p
                key={caption}
                animate={{
                  opacity: i <= presentStop ? 1 : 0.22,
                  x: i <= presentStop ? 0 : -10,
                }}
                className={`border-l-2 pl-3 text-base md:text-lg ${
                  i === presentStop
                    ? "border-[var(--accent)] font-semibold text-white"
                    : "border-white/20 text-white/55"
                }`}
              >
                {caption}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Summit full-bleed reveal */}
        <AnimatePresence>
          {atSummit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 z-30"
            >
              <PhotoSlot
                src={summitPhoto.src}
                alt={summitPhoto.alt}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 px-6 py-12 md:px-10 md:pl-16">
                <p className="mb-2 text-[10px] tracking-[0.25em] text-white/60 uppercase">
                  Summit
                </p>
                <p
                  className={`max-w-xl text-2xl font-bold text-white md:text-4xl ${
                    locale === "en" ? "en-display" : "display"
                  }`}
                >
                  {t.fuji.stops[2]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isPresent && <ScrollHint light visible={!atSummit} />}
      </div>
    </section>
  );
}
