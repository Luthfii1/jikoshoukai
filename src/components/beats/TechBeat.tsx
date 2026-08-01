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
          window.setTimeout(() => setLocalStep(1), 350),
          window.setTimeout(() => setLocalStep(2), 700),
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
      className="beat flex items-center bg-[var(--bg-soft)]"
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-24 md:px-10">
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
          {t.tech.steps.map((step, i) => {
            const show = i <= visible;
            return (
              <motion.li
                key={step.title}
                initial={false}
                animate={{
                  opacity: show ? 1 : 0.25,
                  y: show ? 0 : 12,
                }}
                transition={{ duration: 0.45 }}
                className="relative flex gap-5 pb-12 last:pb-0 md:gap-8"
              >
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold md:h-10 md:w-10 md:text-sm ${
                    show
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--line)] text-[var(--ink-mute)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-[var(--ink)] md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="max-w-lg text-[var(--ink-soft)]">{step.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
