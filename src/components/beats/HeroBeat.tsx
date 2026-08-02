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
      data-atmosphere="neutral"
      className="beat grain relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Full-bleed portrait — edge to edge */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <PhotoSlot
            src={photo.src}
            alt={photo.alt}
            priority
            className="h-full w-full object-[center_72%]"
          />
        </motion.div>
        {/* Dark wash — light at top, stronger near copy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-32 md:px-10 md:pb-20">
        {/* Brand-first: name is the hero signal */}
        <div className="relative max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-5 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase md:text-xs"
          >
            {t.hero.eyebrow}
          </motion.p>

          <h1
            className={`relative mb-2 text-[clamp(4.5rem,16vw,9.5rem)] font-black leading-[0.85] tracking-[-0.04em] text-white ${
              locale === "en" ? "en-display" : "display"
            }`}
            aria-label={t.hero.name}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={{ opacity: 0, y: 56, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          {/* Rufi pill — lands after name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.85, type: "spring", stiffness: 260, damping: 20 }}
            className="mb-5 inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(232,147,74,0.4)]"
          >
            {t.hero.pill}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-lg text-white/80 md:text-xl"
          >
            {t.hero.sub}
          </motion.p>
        </div>
      </div>

      {/* Anime gag — corner stamp, not in the hero reading flow */}
      <motion.div
        initial={{ opacity: 0, rotate: -10, scale: 0.75 }}
        animate={{ opacity: 1, rotate: -4, scale: 1 }}
        transition={{ delay: 1.45, type: "spring", stiffness: 200, damping: 14 }}
        className="absolute right-4 bottom-24 z-10 hidden origin-bottom-right sm:block md:right-10 md:bottom-28"
        aria-hidden
      >
        <div className="flex items-stretch overflow-visible rounded-lg border border-white/20 bg-white shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
          <div className="relative flex flex-col items-center justify-center px-4 py-3.5 md:px-5 md:py-4">
            <span className="text-sm font-bold tracking-wide text-[var(--ink)] md:text-base">
              {t.hero.naruto}
            </span>
            <span className="mt-1 text-[11px] font-medium text-[var(--accent-deep)] md:text-xs">
              {t.hero.narutoNote}
            </span>
            <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 rotate-12 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-black text-white ring-2 ring-white shadow-md">
              OK
            </span>
          </div>
          <div className="w-px self-stretch bg-[var(--line)]" />
          <div className="relative flex flex-col items-center justify-center px-4 py-3.5 opacity-55 md:px-5 md:py-4">
            <span className="text-sm font-bold tracking-wide text-[var(--ink-mute)] line-through md:text-base">
              {t.hero.onePiece}
            </span>
            <span className="mt-1 text-[11px] text-[var(--ink-mute)] md:text-xs">
              {t.hero.onePieceNote}
            </span>
            <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 -rotate-6 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-black text-white ring-2 ring-white shadow-md">
              NG
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
