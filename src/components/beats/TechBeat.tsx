"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";

export function TechBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const [localStep, setLocalStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (isPresent) return;
    const el = document.getElementById("beat-tech");
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timers.current.forEach((id) => window.clearTimeout(id));
        setLocalStep(0);
        timers.current = [
          window.setTimeout(() => setLocalStep(1), 400),
          window.setTimeout(() => setLocalStep(2), 850),
        ];
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, [isPresent]);

  const visible = isPresent && beatId === "tech" ? subStep : localStep;

  return (
    <section
      id="beat-tech"
      data-atmosphere="soft"
      className="beat relative flex items-center overflow-hidden bg-[var(--bg-soft)]"
    >
      {/* Soft bridge into ObO warm section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--bg-warm)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 md:px-10 md:pl-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-[var(--accent-deep)] uppercase"
        >
          Chapter · Build
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-14 text-3xl font-bold text-[var(--ink)] md:text-5xl ${
            locale === "en" ? "en-display" : "display"
          }`}
        >
          {t.tech.headline}
        </motion.h2>

        <ol className="relative space-y-0">
          <div
            aria-hidden
            className="absolute top-3 bottom-3 left-[15px] w-px bg-[var(--line)] md:left-[19px]"
          />
          <motion.div
            aria-hidden
            className="absolute top-3 left-[15px] w-px origin-top bg-[var(--accent)] md:left-[19px]"
            animate={{
              height: `${((visible + 1) / t.tech.steps.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
            style={{ maxHeight: "calc(100% - 0.75rem)" }}
          />
          {t.tech.steps.map((step, i) => {
            const show = i <= visible;
            const isLast = i === t.tech.steps.length - 1;
            return (
              <motion.li
                key={step.title}
                initial={false}
                animate={{
                  opacity: show ? 1 : 0.28,
                  y: show ? 0 : 12,
                }}
                transition={{ duration: 0.45 }}
                className="relative flex gap-5 pb-12 last:pb-0 md:gap-8"
              >
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold md:h-10 md:w-10 md:text-sm ${
                    show
                      ? "bg-[var(--accent)] text-white shadow-[0_0_0_4px_rgba(232,147,74,0.15)]"
                      : "bg-[var(--line)] text-[var(--ink-mute)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className={isLast && show ? "rounded-2xl border border-[var(--accent)]/30 bg-[var(--bg-warm)] p-4 md:p-5" : ""}>
                  <h3 className="mb-2 text-xl font-bold text-[var(--ink)] md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="max-w-lg text-[var(--ink-soft)]">{step.body}</p>
                  {isLast && show && (
                    <a
                      href="#beat-obo"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)] transition hover:text-[var(--accent)]"
                    >
                      {locale === "ja" ? "ObOの話へ ↓" : "See ObO ↓"}
                    </a>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
