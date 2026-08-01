"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

const WORD_KEYS = ["places", "tech", "food", "products"] as const;

const STAMP_META: Record<
  (typeof WORD_KEYS)[number],
  { icon: string; rotate: number; color: string }
> = {
  places: { icon: "◎", rotate: -8, color: "#E8934A" },
  tech: { icon: "▣", rotate: 6, color: "#C9742F" },
  food: { icon: "◆", rotate: -4, color: "#D4843A" },
  products: { icon: "✦", rotate: 10, color: "#E8934A" },
};

export function ExplorerBeat() {
  const { t, locale } = useLocale();
  const [active, setActive] = useState<(typeof WORD_KEYS)[number] | null>(null);
  const [stamped, setStamped] = useState<Set<string>>(new Set());

  function activate(key: (typeof WORD_KEYS)[number]) {
    setActive(key);
    setStamped((prev) => new Set(prev).add(key));
  }

  return (
    <section
      id="beat-explorer"
      data-atmosphere="soft"
      className="beat relative flex items-center overflow-hidden bg-[var(--bg-soft)]"
    >
      {/* Living watermark */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center select-none ${
          locale === "en" ? "en-display" : "display"
        }`}
        animate={{
          opacity: active ? 0.07 : 0.04,
          scale: active ? 1.02 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[16vw] font-black leading-none tracking-tighter text-[var(--ink)] md:text-[18vw]">
          {t.explorer.watermark}
        </span>
      </motion.div>

      {/* Scattered ink stamps that appear when words are explored */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {[...stamped].map((key) => {
            const meta = STAMP_META[key as (typeof WORD_KEYS)[number]];
            const word = t.explorer.words[key as (typeof WORD_KEYS)[number]];
            const positions: Record<string, { top: string; left: string }> = {
              places: { top: "18%", left: "72%" },
              tech: { top: "58%", left: "78%" },
              food: { top: "22%", left: "8%" },
              products: { top: "68%", left: "12%" },
            };
            const pos = positions[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.4, rotate: meta.rotate - 20 }}
                animate={{ opacity: 0.55, scale: 1, rotate: meta.rotate }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="absolute hidden md:block"
                style={{ top: pos.top, left: pos.left }}
              >
                <div
                  className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-[3px] border-dashed"
                  style={{ borderColor: meta.color, color: meta.color }}
                >
                  <span className="text-2xl leading-none">{meta.icon}</span>
                  <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">
                    {word.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:px-10 md:pl-16">
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

        <div className="mb-10 flex flex-wrap gap-3 md:gap-4">
          {WORD_KEYS.map((key, i) => {
            const word = t.explorer.words[key];
            const isOn = active === key;
            const wasStamped = stamped.has(key);
            return (
              <motion.button
                key={key}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => activate(key)}
                onFocus={() => activate(key)}
                onClick={() => activate(key)}
                className={`relative rounded-2xl border px-5 py-3 text-lg font-bold transition-all md:px-7 md:py-4 md:text-2xl ${
                  isOn
                    ? "border-[var(--accent)] bg-[var(--bg-warm)] text-[var(--accent-deep)] shadow-[0_12px_40px_rgba(232,147,74,0.22)]"
                    : wasStamped
                      ? "border-[var(--accent)]/40 bg-white text-[var(--ink)]"
                      : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--accent)]"
                }`}
              >
                {word.label}
                {wasStamped && (
                  <span
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mb-10 min-h-[3.5rem]">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-block max-w-md rounded-lg border border-[var(--accent)]/30 bg-[var(--bg-warm)] px-4 py-3 shadow-[2px_3px_0_rgba(232,147,74,0.15)]"
              >
                <p className="text-sm font-medium text-[var(--accent-deep)] md:text-base">
                  {t.explorer.words[active].hint}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[var(--ink-mute)]"
              >
                {locale === "ja"
                  ? "単語をタッチしてみてください →"
                  : "Tap a word to stamp it →"}
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
