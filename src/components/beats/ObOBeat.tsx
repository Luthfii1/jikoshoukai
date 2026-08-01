"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot } from "@/components/Shell";

export function ObOBeat() {
  const { t, locale } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);
  const [screen, setScreen] = useState(0);
  const started = useRef(false);

  const screens = [
    getPhoto("obo-screen-1", locale),
    getPhoto("obo-screen-2", locale),
    getPhoto("obo-screen-3", locale),
  ];
  const icon = getPhoto("obo-icon", locale);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        if (reduced) {
          setCount(4000);
          return;
        }
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(eased * 4000));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setScreen((s) => (s + 1) % 3), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="beat-obo"
      ref={ref}
      className="beat flex items-center bg-[var(--bg-primary)]"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:justify-between md:px-10">
        <div className="md:w-1/2">
          <div className="mb-4 flex items-center gap-3">
            <PhotoSlot
              src={icon.src}
              alt={icon.alt}
              className="h-12 w-12 rounded-2xl shadow-md"
            />
            <span className="text-sm font-medium text-[var(--ink-mute)]">
              ObO
            </span>
          </div>
          <p className="tabular text-6xl font-black text-[var(--accent)] md:text-8xl">
            {count.toLocaleString()}
            {count >= 4000 ? "+" : ""}
          </p>
          <p className="mt-1 mb-8 text-sm tracking-widest text-[var(--ink-mute)] uppercase">
            {t.obo.label}
          </p>
          <p className="mb-3 text-xl font-semibold text-[var(--ink)] md:text-2xl">
            {t.obo.line}
          </p>
          <p className="text-[var(--ink-soft)]">{t.obo.punch}</p>
        </div>

        <div className="relative">
          <div className="relative mx-auto h-[420px] w-[210px] overflow-hidden rounded-[2rem] border-[6px] border-[var(--ink)] bg-[var(--ink)] shadow-[0_30px_80px_rgba(26,26,46,0.25)] md:h-[480px] md:w-[240px]">
            <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black/80" />
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full"
              >
                <PhotoSlot
                  src={screens[screen].src}
                  alt={screens[screen].alt}
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {screens.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setScreen(i)}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === screen ? "bg-[var(--accent)]" : "bg-[var(--line)]"
                }`}
                aria-label={`Screen ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
