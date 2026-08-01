"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

const WORD_KEYS = ["places", "tech", "food", "products"] as const;

export function ExplorerBeat() {
  const { t, locale } = useLocale();
  const [active, setActive] = useState<(typeof WORD_KEYS)[number] | null>(null);

  return (
    <section
      id="beat-explorer"
      className="beat relative flex items-center overflow-hidden bg-[var(--bg-soft)]"
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center select-none ${
          locale === "en" ? "en-display" : "display"
        }`}
      >
        <span className="text-[18vw] font-black leading-none tracking-tighter text-[var(--ink)]/[0.04]">
          {t.explorer.watermark}
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className={`mb-12 text-3xl font-bold text-[var(--ink)] md:text-5xl ${
            locale === "en" ? "en-display" : "display"
          }`}
        >
          {t.explorer.headline}
        </motion.h2>

        <div className="mb-14 flex flex-wrap gap-3 md:gap-4">
          {WORD_KEYS.map((key, i) => {
            const word = t.explorer.words[key];
            const isOn = active === key;
            return (
              <motion.button
                key={key}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(key)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isOn ? null : key)}
                className={`rounded-2xl border px-5 py-3 text-lg font-bold transition-all md:px-7 md:py-4 md:text-2xl ${
                  isOn
                    ? "border-[var(--accent)] bg-[var(--bg-warm)] text-[var(--accent-deep)] shadow-[0_12px_40px_rgba(232,147,74,0.2)]"
                    : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--accent)]"
                }`}
              >
                {word.label}
              </motion.button>
            );
          })}
        </div>

        <div className="mb-10 min-h-[2rem]">
          <AnimatePresence mode="wait">
            {active && (
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[var(--ink-soft)]"
              >
                {t.explorer.words[active].hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={`max-w-3xl text-2xl font-bold leading-snug text-[var(--ink)] md:text-4xl ${
            locale === "en" ? "en-display" : "display"
          }`}
        >
          {t.explorer.quote}
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-[var(--ink-mute)]"
        >
          {t.explorer.sub}
        </motion.p>
      </div>
    </section>
  );
}
