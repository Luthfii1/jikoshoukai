"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { BEAT_IDS, BEAT_STAMPS, BEAT_SUBSTEPS } from "@/lib/beats";
import { usePresentation } from "@/contexts/PresentationContext";

export function LanguageToggle({ light = false }: { light?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border p-0.5 backdrop-blur-md ${
        light
          ? "border-white/20 bg-black/20"
          : "border-[var(--line)] bg-white/80"
      }`}
      role="group"
      aria-label="Language"
    >
      {(["ja", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium tracking-wide transition-colors ${
            locale === code
              ? light
                ? "bg-white text-[var(--ink)]"
                : "bg-[var(--ink)] text-white"
              : light
                ? "text-white/70 hover:text-white"
                : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
          }`}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/** Vertical journey path — desktop */
export function JourneyRail() {
  const { beatIndex, goToBeat, isPresent } = usePresentation();
  const { locale } = useLocale();
  if (isPresent) return null;

  const fill = beatIndex / Math.max(1, BEAT_IDS.length - 1);

  return (
    <nav
      className="fixed left-3 top-1/2 z-50 hidden h-[min(70vh,520px)] w-10 -translate-y-1/2 md:block lg:left-5"
      aria-label="Journey"
    >
      <div className="relative mx-auto h-full w-px bg-[var(--line)]">
        <div
          className="absolute top-0 left-0 w-px origin-top bg-[var(--accent)] transition-[height] duration-500 ease-out"
          style={{ height: `${fill * 100}%` }}
        />
      </div>
      <ul className="absolute inset-0 flex flex-col justify-between">
        {BEAT_IDS.map((id, i) => {
          const stamp = BEAT_STAMPS[id];
          const done = i <= beatIndex;
          const current = i === beatIndex;
          return (
            <li key={id} className="relative flex justify-center">
              <button
                type="button"
                onClick={() => goToBeat(i)}
                title={stamp[locale]}
                aria-label={stamp[locale]}
                aria-current={current ? "true" : undefined}
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] transition-all ${
                  current
                    ? "scale-125 border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(232,147,74,0.45)]"
                    : done
                      ? "border-[var(--accent)] bg-[var(--bg-warm)] text-[var(--accent-deep)]"
                      : "border-[var(--line)] bg-white text-[var(--ink-mute)] hover:border-[var(--accent)]"
                }`}
              >
                {stamp.mark === "⛰" ? "▲" : stamp.mark}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Thin top progress — mobile */
export function MobileProgress() {
  const { beatIndex, isPresent } = usePresentation();
  if (isPresent) return null;

  const fill = ((beatIndex + 1) / BEAT_IDS.length) * 100;

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[55] h-[2px] bg-[var(--line)] md:hidden"
      aria-hidden
    >
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-400 ease-out"
        style={{ width: `${fill}%` }}
      />
    </div>
  );
}

/** Hint shown while a section is pinned */
export function ScrollHint({
  light = false,
  visible = true,
}: {
  light?: boolean;
  visible?: boolean;
}) {
  const { t } = useLocale();
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`pointer-events-none absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase ${
        light ? "text-white/55" : "text-[var(--ink-mute)]"
      }`}
    >
      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        ↓
      </motion.span>
      {t.nav.scroll}
    </motion.div>
  );
}

export function PresentHUD() {
  const { isPresent, beatIndex, beatId, subStep, goNext, goPrev } =
    usePresentation();
  const { locale, t } = useLocale();
  if (!isPresent) return null;

  const stamp = BEAT_STAMPS[beatId];
  const maxSub = BEAT_SUBSTEPS[beatId];
  const total = BEAT_IDS.length;
  const n = String(beatIndex + 1).padStart(2, "0");
  const of = String(total).padStart(2, "0");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex items-end justify-between px-4 py-4 md:px-8 md:py-6">
      <div className="pointer-events-auto rounded-xl border border-white/10 bg-[var(--ink)]/80 px-4 py-2.5 text-white shadow-lg backdrop-blur-md">
        <p className="tabular text-[10px] tracking-[0.2em] text-white/50 uppercase">
          {n} / {of}
          {maxSub > 0 ? ` · ${subStep + 1}/${maxSub + 1}` : ""}
        </p>
        <p className="text-sm font-semibold tracking-wide">{stamp[locale]}</p>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur transition hover:bg-white/20"
          aria-label="Previous"
        >
          ←
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_24px_rgba(232,147,74,0.35)] transition hover:bg-[var(--accent-deep)]"
        >
          {t.nav.next}
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

export function TopBar() {
  const { isPresent, beatId } = usePresentation();
  const { t } = useLocale();
  const light = isPresent || beatId === "fuji";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 md:px-6">
      <a
        href="#beat-hero"
        className={`display text-sm font-bold tracking-tight md:text-base ${
          light ? "text-white drop-shadow" : "text-[var(--ink)]"
        }`}
      >
        Luthfi
        <span className="ml-1.5 font-medium text-[var(--accent)]">ルフィ</span>
      </a>
      <div className="flex items-center gap-2">
        {!isPresent && (
          <a
            href="/"
            className="hidden rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] backdrop-blur-md transition hover:border-[var(--accent)] hover:text-[var(--ink)] sm:inline-block"
          >
            {t.nav.present}
          </a>
        )}
        {isPresent && (
          <a
            href="?explore=1"
            className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition hover:text-white"
          >
            {t.nav.explore}
          </a>
        )}
        <LanguageToggle light={light && isPresent} />
      </div>
    </header>
  );
}

export function PhotoSlot({
  src,
  alt,
  className = "",
  priority = false,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`object-cover ${className}`}
      style={style}
    />
  );
}
