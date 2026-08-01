"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot } from "@/components/Shell";

export function OsakaBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const [localStep, setLocalStep] = useState(0);
  const photo = getPhoto("osaka-1", locale);

  const step = isPresent && beatId === "osaka" ? subStep : localStep;

  useEffect(() => {
    if (isPresent) return;
    const onScroll = () => {
      const el = document.getElementById("beat-osaka");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = 1 - rect.bottom / (rect.height + window.innerHeight);
      const s = Math.min(2, Math.max(0, Math.floor(progress * 3.2)));
      setLocalStep(s);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPresent]);

  return (
    <section
      id="beat-osaka"
      className="beat relative flex items-end overflow-hidden md:items-center"
    >
      <div className="absolute inset-0">
        <motion.div
          className="h-full w-full"
          animate={{ scale: 1 + step * 0.04 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <PhotoSlot
            src={photo.src}
            alt={photo.alt}
            className="h-full w-full"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/55 to-[var(--ink)]/25" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:px-10 md:py-28">
        <div className="mb-4 flex flex-wrap gap-2">
          {t.osaka.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2
          className={`mb-10 text-4xl font-black text-white md:text-6xl ${
            locale === "en" ? "en-display" : "display"
          }`}
        >
          {t.osaka.headline}
        </h2>

        <ol className="space-y-4">
          {t.osaka.steps.map((text, i) => (
            <AnimatePresence key={text}>
              {i <= step && (
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <span className="tabular mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-lg font-medium text-white/95 md:text-2xl">
                    {text}
                  </p>
                </motion.li>
              )}
            </AnimatePresence>
          ))}
        </ol>

        {!isPresent && (
          <div className="mt-10 flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLocalStep(i)}
                className={`h-1.5 w-8 rounded-full transition ${
                  i <= step ? "bg-[var(--accent)]" : "bg-white/30"
                }`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
