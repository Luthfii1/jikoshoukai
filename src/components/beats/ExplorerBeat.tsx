"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { PhotoSlot, ScrollHint } from "@/components/Shell";
import { getPhoto, type PhotoId } from "@/lib/photos";
import { dwellStep } from "@/lib/scrollDwell";

const WORD_KEYS = ["places", "tech", "food", "products"] as const;
type WordKey = (typeof WORD_KEYS)[number];

const PIN_META: Record<
  WordKey,
  { rotate: number; photo: PhotoId; pinColor: string }
> = {
  places: { rotate: -7, photo: "tokyo-1", pinColor: "#E8934A" },
  tech: { rotate: 5, photo: "korea-1", pinColor: "#C9742F" },
  food: { rotate: -3, photo: "thailand-1", pinColor: "#D4843A" },
  products: { rotate: 8, photo: "obo-screen-1", pinColor: "#E8934A" },
};

const POSITIONS: Record<WordKey, { top: string; left: string }> = {
  places: { top: "12%", left: "68%" },
  tech: { top: "52%", left: "74%" },
  food: { top: "14%", left: "6%" },
  products: { top: "58%", left: "8%" },
};

function pinsFromCount(count: number): Set<string> {
  return new Set(WORD_KEYS.slice(0, count));
}

function PushPin({ color, large }: { color: string; large?: boolean }) {
  const w = large ? 28 : 18;
  const h = large ? 44 : 28;
  return (
    <span
      className={`absolute left-1/2 z-20 -translate-x-1/2 ${large ? "-top-3" : "-top-2"}`}
      aria-hidden
    >
      <svg width={w} height={h} viewBox="0 0 18 28" fill="none">
        <ellipse cx="9" cy="7" rx="7" ry="6.5" fill={color} />
        <ellipse cx="9" cy="5.5" rx="3.5" ry="2.5" fill="white" opacity="0.35" />
        <path d="M9 13 L9 26" stroke="#1A1A2E" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9" cy="7" r="2" fill="#1A1A2E" opacity="0.25" />
      </svg>
    </span>
  );
}

function PinLightbox({
  wordKey,
  onClose,
}: {
  wordKey: WordKey;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  const meta = PIN_META[wordKey];
  const word = t.explorer.words[wordKey];
  const photo = getPhoto(meta.photo, locale);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={word.label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[var(--ink)]/45 backdrop-blur-[2px]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.86, y: 18, rotate: meta.rotate - 6 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: meta.rotate * 0.35 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative z-10 w-[min(420px,calc(100%-1.5rem))] bg-white p-3 pb-8 shadow-[0_28px_80px_rgba(26,26,46,0.35)] ring-1 ring-black/5 md:w-[min(480px,90vw)] md:p-4 md:pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <PushPin color={meta.pinColor} large />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg text-[var(--ink)] shadow ring-1 ring-black/5 transition hover:bg-[var(--bg-warm)]"
          aria-label={locale === "ja" ? "閉じる" : "Close"}
        >
          ×
        </button>
        <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
          <PhotoSlot src={photo.src} alt={photo.alt} className="h-full w-full" />
        </div>
        <div className="mt-4 px-1 text-center md:mt-5">
          <p className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-[var(--accent-deep)] uppercase">
            {locale === "ja" ? "ピン" : "Pinned"}
          </p>
          <h3
            className={`mb-2 text-2xl font-bold text-[var(--ink)] md:text-3xl ${
              locale === "en" ? "en-display" : "display"
            }`}
          >
            {word.label}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
            {word.hint}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ExplorerBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep, beatId } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const [pinCount, setPinCount] = useState(0);
  const [active, setActive] = useState<WordKey | null>(null);
  const [lightbox, setLightbox] = useState<WordKey | null>(null);
  const [progress, setProgress] = useState(0);

  const pinned = pinsFromCount(pinCount);
  const showQuote = pinCount >= 4 || progress > 0.85;

  useEffect(() => {
    if (!isPresent) return;
    if (beatId !== "explorer") return;
    const count = Math.min(4, subStep + 1);
    setPinCount(count);
    setActive(WORD_KEYS[Math.min(3, subStep)] ?? null);
    setProgress(count / 4);
    setLightbox(null);
  }, [isPresent, subStep, beatId]);

  useEffect(() => {
    if (isPresent) return;
    const pin = pinRef.current;
    if (!pin) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPinCount(4);
      setActive("products");
      setProgress(1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=420%",
        pin: true,
        pinSpacing: true,
        scrub: 1.1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 25,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const step = dwellStep(p, 4, 0.05, 0.1);
          if (step < 0) {
            setPinCount(0);
            setActive(null);
          } else {
            setPinCount(step + 1);
            setActive(WORD_KEYS[step]);
          }
        },
      });
      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
  }, [isPresent]);

  function activate(key: WordKey) {
    if (!pinned.has(key)) return;
    setActive(key);
  }

  function openPin(key: WordKey) {
    if (!pinned.has(key)) return;
    setActive(key);
    setLightbox(key);
  }

  return (
    <section
      id="beat-explorer"
      data-atmosphere="soft"
      className="relative z-[1] bg-[var(--bg-soft)]"
    >
      <div
        ref={pinRef}
        className="relative z-[1] flex h-[100svh] w-full items-center overflow-hidden bg-[var(--bg-soft)]"
      >
        {/* Soft corkboard texture hint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(232,147,74,0.12) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <motion.div
          aria-hidden
          className={`pointer-events-none absolute inset-0 flex items-center justify-center select-none ${
            locale === "en" ? "en-display" : "display"
          }`}
          animate={{
            opacity: pinCount > 0 ? 0.06 : 0.03,
            scale: pinCount > 0 ? 1.02 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[16vw] font-black leading-none tracking-tighter text-[var(--ink)] md:text-[18vw]">
            {t.explorer.watermark}
          </span>
        </motion.div>

        {/* Pinned polaroid photos — above content so clicks work */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <AnimatePresence>
            {WORD_KEYS.filter((k) => pinned.has(k)).map((key) => {
              const meta = PIN_META[key];
              const word = t.explorer.words[key];
              const pos = POSITIONS[key];
              const photo = getPhoto(meta.photo, locale);
              const isActive = active === key;

              return (
                <motion.button
                  key={key}
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                    y: -40,
                    rotate: meta.rotate - 18,
                  }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.06 : 1,
                    y: 0,
                    rotate: meta.rotate,
                    zIndex: isActive ? 6 : 2,
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  onClick={() => openPin(key)}
                  aria-label={
                    locale === "ja"
                      ? `${word.label}を大きく見る`
                      : `View ${word.label}`
                  }
                  className="pointer-events-auto absolute hidden cursor-pointer md:block"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="relative w-[132px] bg-white p-2 pb-7 shadow-[0_10px_28px_rgba(26,26,46,0.18)] ring-1 ring-black/5 transition hover:shadow-[0_16px_36px_rgba(26,26,46,0.22)] lg:w-[152px]">
                    <PushPin color={meta.pinColor} />
                    <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
                      <PhotoSlot
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full"
                      />
                    </div>
                    <p className="absolute right-2 bottom-2 left-2 truncate text-center text-[10px] font-bold tracking-wide text-[var(--ink)]">
                      {word.label}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 md:px-10 md:pl-16">
          <h2
            className={`mb-10 text-3xl font-bold text-[var(--ink)] md:mb-12 md:text-5xl ${
              locale === "en" ? "en-display" : "display"
            }`}
          >
            {t.explorer.headline}
          </h2>

          <div className="mb-8 flex flex-wrap gap-3 md:mb-10 md:gap-4">
            {WORD_KEYS.map((key) => {
              const word = t.explorer.words[key];
              const isOn = active === key;
              const wasPinned = pinned.has(key);
              return (
                <motion.button
                  key={key}
                  type="button"
                  initial={false}
                  animate={{
                    opacity: wasPinned || pinCount === 0 ? 1 : 0.35,
                    scale: wasPinned ? 1 : 0.98,
                  }}
                  whileTap={wasPinned ? { scale: 0.96 } : undefined}
                  onMouseEnter={() => activate(key)}
                  onFocus={() => activate(key)}
                  onClick={() => openPin(key)}
                  disabled={!wasPinned}
                  className={`relative rounded-2xl border px-5 py-3 text-lg font-bold transition-colors md:px-7 md:py-4 md:text-2xl ${
                    isOn && wasPinned
                      ? "border-[var(--accent)] bg-[var(--bg-warm)] text-[var(--accent-deep)] shadow-[0_12px_40px_rgba(232,147,74,0.22)]"
                      : wasPinned
                        ? "border-[var(--accent)]/40 bg-white text-[var(--ink)]"
                        : "border-[var(--line)] bg-white/70 text-[var(--ink-mute)]"
                  }`}
                >
                  {word.label}
                  {wasPinned && (
                    <span
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] shadow"
                      aria-hidden
                    >
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                        <circle cx="5" cy="3.5" r="3" fill="white" />
                        <path
                          d="M5 6.5 L5 10.5"
                          stroke="white"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Mobile: stacked pinned photos */}
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2 md:hidden">
            <AnimatePresence>
              {WORD_KEYS.filter((k) => pinned.has(k)).map((key) => {
                const meta = PIN_META[key];
                const word = t.explorer.words[key];
                const photo = getPhoto(meta.photo, locale);
                return (
                  <motion.button
                    key={key}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => openPin(key)}
                    className="relative w-[110px] shrink-0 bg-white p-1.5 pb-6 shadow-md"
                    style={{ rotate: `${meta.rotate}deg` }}
                  >
                    <PushPin color={meta.pinColor} />
                    <div className="aspect-[4/3] overflow-hidden">
                      <PhotoSlot
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full"
                      />
                    </div>
                    <span className="absolute right-1 bottom-1.5 left-1 truncate text-center text-[9px] font-bold">
                      {word.label}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mb-10 min-h-[3.5rem]">
            <AnimatePresence mode="wait">
              {active && pinned.has(active) ? (
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
                  key="wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[var(--ink-mute)]"
                >
                  {locale === "ja"
                    ? "ピンを押すと写真が大きく見られます →"
                    : "Tap a pin to view the photo →"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: showQuote ? 1 : 0,
              y: showQuote ? 0 : 16,
            }}
            transition={{ duration: 0.45 }}
          >
            <blockquote
              className={`max-w-3xl text-2xl font-bold leading-snug text-[var(--ink)] md:text-4xl ${
                locale === "en" ? "en-display" : "display"
              }`}
            >
              {t.explorer.quote}
            </blockquote>
            <p className="mt-4 text-[var(--ink-mute)]">{t.explorer.sub}</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {lightbox && (
            <PinLightbox wordKey={lightbox} onClose={() => setLightbox(null)} />
          )}
        </AnimatePresence>

        {!isPresent && <ScrollHint visible={progress < 0.92 && !lightbox} />}
      </div>
    </section>
  );
}
