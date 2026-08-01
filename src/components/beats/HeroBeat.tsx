"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot } from "@/components/Shell";

export function HeroBeat() {
  const { t, locale } = useLocale();
  const photo = getPhoto("hero-portrait", locale);
  const letters = t.hero.name.split("");

  return (
    <section
      id="beat-hero"
      className="beat grain relative flex items-end overflow-hidden bg-[var(--bg-primary)] md:items-center"
    >
      {/* Full-bleed portrait plane */}
      <div className="absolute inset-0">
        <PhotoSlot
          src={photo.src}
          alt={photo.alt}
          priority
          className="h-full w-full scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent md:bg-gradient-to-r md:from-[var(--bg-primary)] md:via-[var(--bg-primary)]/85 md:to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-28 md:flex-row md:items-end md:justify-between md:px-10 md:pb-24 md:pt-20">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-xs font-medium tracking-[0.18em] text-[var(--ink-soft)] uppercase md:text-sm"
          >
            {t.hero.eyebrow}
          </motion.p>

          <h1
            className={`mb-3 text-6xl font-black leading-none text-[var(--ink)] sm:text-7xl md:text-8xl ${
              locale === "en" ? "en-display" : "display"
            }`}
            aria-label={t.hero.name}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.2 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-4 inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(232,147,74,0.35)]"
          >
            {t.hero.pill}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mb-8 text-lg text-[var(--ink-soft)] md:text-xl"
          >
            {t.hero.sub}
          </motion.p>

          {/* Naruto vs One Piece gag */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-10 flex gap-3"
          >
            <div className="relative flex w-28 flex-col items-center rounded-lg border border-[var(--line)] bg-white/80 p-3 backdrop-blur">
              <span className="mb-1 text-xs font-bold text-[var(--ink)]">
                {t.hero.naruto}
              </span>
              <span className="text-[10px] text-[var(--accent-deep)]">
                {t.hero.narutoNote}
              </span>
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                ✓
              </span>
            </div>
            <div className="relative flex w-28 flex-col items-center rounded-lg border border-[var(--line)] bg-white/50 p-3 opacity-60 backdrop-blur">
              <span className="mb-1 text-xs font-bold text-[var(--ink-mute)] line-through">
                {t.hero.onePiece}
              </span>
              <span className="text-[10px] text-[var(--ink-mute)]">
                {t.hero.onePieceNote}
              </span>
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-bold text-white">
                ✕
              </span>
            </div>
          </motion.div>

          <motion.a
            href="#beat-explorer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] transition hover:text-[var(--accent-deep)]"
          >
            {t.hero.cta}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
