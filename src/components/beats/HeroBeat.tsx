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
            className="h-full w-full"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/55 to-[var(--bg-primary)]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,transparent_20%,rgba(255,255,255,0.35)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-32 md:px-10 md:pb-20">
        {/* Brand-first: name is the hero signal */}
        <div className="relative max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-5 text-[11px] font-medium tracking-[0.22em] text-[var(--ink-soft)] uppercase md:text-xs"
          >
            {t.hero.eyebrow}
          </motion.p>

          <h1
            className={`relative mb-2 text-[clamp(4.5rem,16vw,9.5rem)] font-black leading-[0.85] tracking-[-0.04em] text-[var(--ink)] ${
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
            className="mb-8 text-lg text-[var(--ink-soft)] md:text-xl"
          >
            {t.hero.sub}
          </motion.p>

          {/* Gag as delayed stamp — after brand lands */}
          <motion.div
            initial={{ opacity: 0, rotate: -8, scale: 0.7 }}
            animate={{ opacity: 1, rotate: -3, scale: 1 }}
            transition={{ delay: 1.35, type: "spring", stiffness: 200, damping: 14 }}
            className="mb-10 inline-flex origin-left items-stretch gap-0 overflow-hidden rounded-lg border-2 border-[var(--ink)]/10 bg-white/90 shadow-[0_12px_40px_rgba(26,26,46,0.08)] backdrop-blur"
          >
            <div className="relative flex flex-col items-center px-4 py-3">
              <span className="text-[10px] font-bold tracking-wider text-[var(--ink)] uppercase">
                {t.hero.naruto}
              </span>
              <span className="mt-0.5 text-[10px] text-[var(--accent-deep)]">
                {t.hero.narutoNote}
              </span>
              <span className="absolute -top-2 -right-2 flex h-6 w-6 rotate-12 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-black text-white ring-2 ring-white">
                OK
              </span>
            </div>
            <div className="w-px bg-[var(--line)]" />
            <div className="relative flex flex-col items-center px-4 py-3 opacity-45">
              <span className="text-[10px] font-bold tracking-wider text-[var(--ink-mute)] line-through uppercase">
                {t.hero.onePiece}
              </span>
              <span className="mt-0.5 text-[10px] text-[var(--ink-mute)]">
                {t.hero.onePieceNote}
              </span>
              <span className="absolute -top-2 -right-2 flex h-6 w-6 -rotate-6 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-black text-white ring-2 ring-white">
                NG
              </span>
            </div>
          </motion.div>

          <motion.a
            href="#beat-explorer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55 }}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] hover:border-[var(--accent)]"
          >
            {t.hero.cta}
            <span className="transition group-hover:translate-y-0.5" aria-hidden>
              ↓
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
