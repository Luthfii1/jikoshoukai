"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot } from "@/components/Shell";

const ALTITUDES = [0, 1800, 3000, 3776];

export function FujiBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [stop, setStop] = useState(0);

  const presentStop = isPresent && beatId === "fuji" ? subStep : stop;
  const altitude = isPresent
    ? ALTITUDES[presentStop + 1] ?? 3776
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
        scrub: 0.5,
        onUpdate: (self) => {
          setProgress(self.progress);
          setStop(Math.min(2, Math.floor(self.progress * 3)));
        },
      });
    }, pin);

    return () => ctx.revert();
  }, [isPresent]);

  const skyTop =
    presentStop === 0
      ? "#1a2035"
      : presentStop === 1
        ? "#3a4560"
        : "#ff9a5a";
  const skyBottom =
    presentStop === 0
      ? "#2a3548"
      : presentStop === 1
        ? "#6a7088"
        : "#ffd0a0";

  const summitPhoto = getPhoto("fuji-3", locale);
  const climberY = 78 - progress * 55;

  return (
    <section id="beat-fuji" className="relative bg-[var(--ink)]">
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ background: `linear-gradient(180deg, ${skyTop}, ${skyBottom})` }}
          transition={{ duration: 1.2 }}
        />

        {/* Parallax mist layers */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.45), transparent 70%)",
            transform: `translateY(${(1 - progress) * 40}px)`,
          }}
        />

        {/* Mountain silhouette */}
        <svg
          viewBox="0 0 100 60"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 60 L35 18 L50 8 L65 18 L100 60 Z"
            fill="#1a1a2e"
            opacity="0.85"
          />
          <path
            d="M42 20 L50 8 L58 20 L54 22 L50 14 L46 22 Z"
            fill="#f5f5f0"
            opacity={0.3 + progress * 0.5}
          />
        </svg>

        {/* Climber marker */}
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2 transition-none"
          style={{ top: `${climberY}%` }}
        >
          <div className="h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_16px_rgba(232,147,74,0.8)]" />
        </div>

        <div className="relative z-20 mx-auto flex h-full max-w-5xl flex-col justify-between px-6 py-20 md:px-10">
          <div>
            <h2
              className={`mb-4 text-4xl font-black text-white md:text-6xl ${
                locale === "en" ? "en-display" : "display"
              }`}
            >
              {t.fuji.headline}
            </h2>
            <p className="tabular text-3xl font-bold text-[var(--accent)] md:text-5xl">
              {altitude.toLocaleString()}{" "}
              <span className="text-lg text-white/70">{t.fuji.unit}</span>
            </p>
          </div>

          <div className="max-w-md space-y-3">
            {t.fuji.stops.map((caption, i) => (
              <motion.p
                key={caption}
                animate={{
                  opacity: i <= presentStop ? 1 : 0.25,
                  x: i <= presentStop ? 0 : -8,
                }}
                className={`text-base md:text-lg ${
                  i === presentStop
                    ? "font-semibold text-white"
                    : "text-white/60"
                }`}
              >
                {caption}
              </motion.p>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {presentStop >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-4 bottom-8 z-30 overflow-hidden rounded-2xl border border-white/20 shadow-2xl md:inset-x-auto md:right-10 md:bottom-16 md:w-[360px]"
            >
              <PhotoSlot
                src={summitPhoto.src}
                alt={summitPhoto.alt}
                className="aspect-[16/10] w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Spacer for pin scroll distance in explore mode */}
      {!isPresent && <div className="h-[80vh]" aria-hidden />}
    </section>
  );
}
