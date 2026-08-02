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
  const [dragging, setDragging] = useState(false);
  const started = useRef(false);
  const dragX = useRef(0);

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
        const duration = 1800;
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
    if (dragging) return;
    const id = setInterval(() => setScreen((s) => (s + 1) % 3), 3000);
    return () => clearInterval(id);
  }, [dragging]);

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    dragX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent) {
    const dx = e.clientX - dragX.current;
    setDragging(false);
    if (Math.abs(dx) < 40) return;
    setScreen((s) => (dx < 0 ? (s + 1) % 3 : (s + 2) % 3));
  }

  return (
    <section
      id="beat-obo"
      ref={ref}
      data-atmosphere="warm"
      className="beat relative flex items-center overflow-hidden bg-[var(--bg-warm)]"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:justify-between md:px-10 md:pl-16">
        <div className="md:w-1/2">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-[var(--accent-deep)] uppercase"
          >
            Chapter · Ship
          </motion.p>
          <div className="mb-5 flex items-center gap-3">
            <PhotoSlot
              src={icon.src}
              alt={icon.alt}
              className="h-12 w-12 rounded-2xl shadow-md ring-2 ring-white"
            />
            <span className="text-sm font-semibold text-[var(--ink)]">ObO</span>
          </div>

          <p className="tabular text-6xl font-black tracking-tight text-[var(--accent)] md:text-8xl">
            {count.toLocaleString()}
            {count >= 4000 ? "+" : ""}
          </p>
          <p className="mt-1 mb-8 text-sm tracking-widest text-[var(--ink-mute)] uppercase">
            {t.obo.label}
          </p>

          <p className="mb-3 text-xl font-semibold text-[var(--ink)] md:text-2xl">
            {t.obo.line}
          </p>
          <p
            className={`text-lg text-[var(--accent-deep)] md:text-xl ${
              locale === "en" ? "en-display" : "display"
            }`}
          >
            {t.obo.punch}
          </p>
        </div>

        {/* Screenshots already include device chrome — no CSS phone frame */}
        <div className="relative w-full max-w-[280px] md:max-w-[320px]">
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-72 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/20 blur-3xl"
          />

          <div
            className="relative aspect-[9/19] w-full touch-pan-y cursor-grab overflow-hidden active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDragging(false)}
            role="img"
            aria-label="ObO app preview"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <PhotoSlot
                  src={screens[screen].src}
                  alt={screens[screen].alt}
                  className="h-full w-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-3 text-center text-[10px] tracking-wide text-[var(--ink-mute)]">
            {locale === "ja" ? "スワイプで画面切替" : "Swipe to browse screens"}
          </p>
          <div className="mt-2 flex justify-center gap-2">
            {screens.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setScreen(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === screen
                    ? "w-5 bg-[var(--accent)]"
                    : "w-1.5 bg-[var(--line)]"
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
