"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto, type PhotoId } from "@/lib/photos";
import { PhotoSlot, ScrollHint } from "@/components/Shell";

const FUJI_BG = "/photos/fuji-bg.png";
const FOOTPRINT_COUNT = 14;

/** 3 story checkpoints along the climb */
const STAGES: { t: number; photo: PhotoId }[] = [
  { t: 0.18, photo: "fuji-1" },
  { t: 0.55, photo: "fuji-2" },
  { t: 0.95, photo: "fuji-3" },
];

/**
 * Climb path along the lit left ridge of fuji-bg.png
 * (percent of the frame — tuned for object-position 50% 40%)
 */
const TRAIL: [number, number][] = [
  [47.5, 78],
  [44.5, 64],
  [43.5, 52],
  [45.5, 40],
  [48.5, 30],
  [50.2, 24],
];

function quadBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  t: number,
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

function pointOnTrailPlain(t: number): [number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const segs = TRAIL.length - 1;
  const scaled = clamped * segs;
  const i = Math.min(segs - 1, Math.floor(scaled));
  const local = scaled - i;
  const a = TRAIL[i];
  const b = TRAIL[i + 1];
  const ctrl: [number, number] = [
    (a[0] + b[0]) / 2 - 0.8,
    (a[1] + b[1]) / 2,
  ];
  return quadBezier(a, ctrl, b, local);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function pointOnTrail(t: number): { x: number; y: number; angle: number } {
  const clamped = Math.max(0, Math.min(1, t));
  const [x, y] = pointOnTrailPlain(clamped);
  const eps = 0.02;
  const a = pointOnTrailPlain(Math.max(0, clamped - eps));
  const b = pointOnTrailPlain(Math.min(1, clamped + eps));
  const angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90;
  return { x: round2(x), y: round2(y), angle: round2(angle) };
}

/** Decorative footprints up to current climb (not clickable) */
const FOOTPRINTS = Array.from({ length: FOOTPRINT_COUNT }, (_, i) => {
  const t = (i + 0.35) / FOOTPRINT_COUNT;
  const pt = pointOnTrail(t);
  const side = i % 2 === 0 ? -1 : 1;
  return {
    key: i,
    t: round2(t),
    x: round2(pt.x + side * 0.45),
    y: pt.y,
    angle: round2(pt.angle + side * 14),
    flipped: side < 0,
  };
});

function FootprintIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 32"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <ellipse cx="6" cy="4.5" rx="2.2" ry="3" />
      <ellipse cx="10.5" cy="3.2" rx="2.4" ry="3.2" />
      <ellipse cx="14.5" cy="4.8" rx="2.1" ry="2.9" />
      <ellipse cx="17.2" cy="7.5" rx="1.7" ry="2.4" />
      <path d="M5 10c-2.2 1-3.5 3.2-3.5 6.2 0 4.2 2.2 8.5 4.2 12.2 1 1.8 2.6 3.2 4.6 3.2s3.5-1.3 4.4-3c1.8-3.5 3.8-7.8 3.8-12 0-3.2-1.5-5.4-3.8-6.4-1.4-.6-3-.4-4.5.2-1.3.5-2.6.5-3.7-.2-.4-.2-.9-.3-1.5-.2z" />
    </svg>
  );
}

export function FujiBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [stop, setStop] = useState(0);
  const [openStage, setOpenStage] = useState<number | null>(null);

  const presentStop = isPresent && beatId === "fuji" ? subStep : stop;
  const climb = progress;
  const altitude = Math.round(climb * 3776);
  const atSummit = climb > 0.92;
  const bgScale = 1.06 + climb * 0.1;
  const climber = pointOnTrail(climb);
  const nightOpacity = Math.max(0, 1 - climb * 1.25);
  const starsOpacity = Math.max(0, 1 - climb * 1.9);
  const warmLift = Math.min(1, Math.max(0, (climb - 0.35) / 0.55));

  const openStageData =
    openStage !== null
      ? {
          index: openStage,
          photo: getPhoto(STAGES[openStage].photo, locale),
          meta: t.fuji.stages[openStage],
        }
      : null;

  useEffect(() => {
    if (!isPresent) return;

    const target =
      beatId === "fuji" ? Math.min(1, (subStep + 1) / 3) : progressRef.current;

    if (beatId !== "fuji") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      progressRef.current = target;
      setProgress(target);
      setStop(subStep);
      return;
    }

    const obj = { p: progressRef.current };
    if (subStep === 0 && progressRef.current > target + 0.05) {
      obj.p = 0;
      progressRef.current = 0;
    }

    const tween = gsap.to(obj, {
      p: target,
      duration: 1.75,
      ease: "power1.inOut",
      onUpdate: () => {
        progressRef.current = obj.p;
        setProgress(obj.p);
        setStop(Math.min(2, Math.floor(obj.p * 3)));
      },
    });

    return () => {
      tween.kill();
    };
  }, [isPresent, subStep, beatId]);

  // Keep open popup in sync when presenting Next/Prev
  useEffect(() => {
    if (!isPresent || beatId !== "fuji") return;
    setOpenStage((prev) => (prev === null ? null : subStep));
  }, [isPresent, beatId, subStep]);

  useEffect(() => {
    if (isPresent) return;
    const pin = pinRef.current;
    if (!pin) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1;
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
          progressRef.current = self.progress;
          setProgress(self.progress);
          setStop(Math.min(2, Math.floor(self.progress * 3)));
        },
      });
      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
  }, [isPresent]);

  useEffect(() => {
    if (!openStageData) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenStage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openStageData]);

  function openCheckpoint(index: number) {
    if (presentStop < index && climb < STAGES[index].t - 0.02) return;
    setOpenStage(index);
  }

  return (
    <section
      id="beat-fuji"
      data-atmosphere="dawn"
      className="relative z-[3] bg-[#0a1020]"
    >
      <div
        ref={pinRef}
        className="relative z-[3] h-[100svh] w-full overflow-hidden bg-[#0a1020]"
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FUJI_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            style={{
              objectPosition: "50% 40%",
              transform: `scale(${bgScale})`,
              transformOrigin: "50% 32%",
            }}
            draggable={false}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: nightOpacity,
            background:
              "linear-gradient(180deg, rgba(6,12,28,0.88) 0%, rgba(10,18,36,0.72) 45%, rgba(8,14,28,0.82) 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0" style={{ opacity: starsOpacity }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 48}%`,
                opacity: 0.25 + ((i * 13) % 50) / 100,
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: warmLift * 0.55,
            background:
              "radial-gradient(ellipse 70% 55% at 18% 42%, rgba(255,170,90,0.45), transparent 60%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent md:from-black/50 md:via-black/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/65 via-black/25 to-transparent"
        />

        {/* Footprints — decorative trail only */}
        <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden>
          {FOOTPRINTS.map((fp) => {
            const reached = climb >= fp.t;
            const opacity = reached
              ? round2(Math.min(1, (climb - fp.t) * 8 + 0.35) * 0.8)
              : 0;
            return (
              <div
                key={fp.key}
                className="absolute text-[#FFE0B8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition-opacity duration-300"
                style={{
                  left: `${fp.x}%`,
                  top: `${fp.y}%`,
                  opacity,
                  transform: `translate(-50%, -50%) rotate(${fp.angle}deg) scaleX(${fp.flipped ? -1 : 1})`,
                }}
              >
                <FootprintIcon className="h-3.5 w-2.5 md:h-4 md:w-3" />
              </div>
            );
          })}
        </div>

        {/* HUD — pass clicks through empty space so trail bullet stays pressable */}
        <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-5xl flex-col justify-between px-6 py-20 md:px-10 md:pl-16">
          <div className="pointer-events-auto">
            <p className="mb-2 text-[10px] tracking-[0.25em] text-white/55 uppercase">
              3,776 m · Honshu
            </p>
            <h2
              className={`mb-4 text-4xl font-black text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] md:text-6xl ${
                locale === "en" ? "en-display" : "display"
              }`}
            >
              {t.fuji.headline}
            </h2>
            <div className="inline-flex items-baseline gap-2 rounded-xl border border-white/15 bg-black/35 px-4 py-2 backdrop-blur-md">
              <p className="tabular text-3xl font-bold text-[var(--accent)] md:text-5xl">
                {altitude.toLocaleString()}
              </p>
              <span className="text-sm text-white/65">{t.fuji.unit}</span>
            </div>
          </div>

          <div
            className={`pointer-events-auto max-w-sm space-y-3 ${
              isPresent ? "pb-28 md:pb-32" : "pb-4"
            }`}
          >
            {t.fuji.stops.map((caption, i) => {
              const unlocked = presentStop >= i || climb >= STAGES[i].t - 0.03;
              const isOn = presentStop === i;
              return (
                <motion.button
                  key={caption}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => openCheckpoint(i)}
                  animate={{
                    opacity: unlocked ? 1 : 0.28,
                    x: unlocked ? 0 : -10,
                  }}
                  className={`block w-full border-l-2 pl-3 text-left text-base drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] transition md:text-lg ${
                    isOn
                      ? "border-[var(--accent)] font-semibold text-white"
                      : unlocked
                        ? "border-white/35 text-white/75 hover:border-[var(--accent)] hover:text-white"
                        : "border-white/20 text-white/45"
                  }`}
                >
                  {caption}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Current progress bullet — above HUD, large hit area */}
        <button
          type="button"
          onClick={() => openCheckpoint(presentStop)}
          aria-label={t.fuji.stages[presentStop]?.label ?? t.fuji.headline}
          className="absolute z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:scale-110"
          style={{
            left: `${climber.x}%`,
            top: `${climber.y}%`,
          }}
        >
          <span className="block h-3.5 w-3.5 rounded-full bg-[var(--accent)] shadow-[0_0_22px_rgba(232,147,74,0.95)] ring-2 ring-white/90 md:h-4 md:w-4" />
        </button>

        {/* Summit veil */}
        <AnimatePresence>
          {atSummit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="pointer-events-none absolute inset-0 z-[15]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {openStageData && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={openStageData.meta.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center px-4"
              onClick={() => setOpenStage(null)}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
              <motion.div
                key={openStageData.index}
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="relative z-10 w-[min(560px,calc(100%-1.5rem))] overflow-hidden rounded-2xl bg-white shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setOpenStage(null)}
                  className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-lg text-white backdrop-blur transition hover:bg-black/70"
                  aria-label={locale === "ja" ? "閉じる" : "Close"}
                >
                  ×
                </button>
                <div className="aspect-[16/10] w-full bg-[var(--bg-soft)]">
                  <PhotoSlot
                    src={openStageData.photo.src}
                    alt={openStageData.photo.alt}
                    className="h-full w-full"
                  />
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--accent-deep)] uppercase">
                    {openStageData.meta.meter}
                  </p>
                  <p
                    className={`mt-1 text-xl font-bold text-[var(--ink)] ${
                      locale === "en" ? "en-display" : "display"
                    }`}
                  >
                    {openStageData.meta.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {openStageData.meta.detail}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isPresent && <ScrollHint light visible={!atSummit && openStage === null} />}
      </div>
    </section>
  );
}
