"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LocaleContext";
import { usePresentation } from "@/contexts/PresentationContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot, ScrollHint } from "@/components/Shell";

export function OsakaBeat() {
  const { t, locale } = useLocale();
  const { isPresent, subStep } = usePresentation();
  const pinRef = useRef<HTMLDivElement>(null);
  const [localStep, setLocalStep] = useState(0);
  const photo = getPhoto("osaka-1", locale);

  // Beat currently hidden from flow; keep present wiring ready when re-enabled
  const step = localStep;

  useEffect(() => {
    if (!isPresent) return;
    setLocalStep(subStep);
  }, [isPresent, subStep]);

  useEffect(() => {
    if (isPresent) return;

    const pin = pinRef.current;
    if (!pin) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLocalStep(2);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 15,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.28) setLocalStep(0);
          else if (p < 0.58) setLocalStep(1);
          else setLocalStep(2);
        },
      });
      ScrollTrigger.refresh();
    }, pin);

    return () => ctx.revert();
  }, [isPresent]);

  return (
    <section
      id="beat-osaka"
      data-atmosphere="ink"
      className="relative z-[2] bg-[var(--ink)]"
    >
      <div
        ref={pinRef}
        className="relative z-[2] flex h-[100svh] w-full items-end overflow-hidden bg-[var(--ink)] md:items-center"
      >
        <div className="absolute inset-0">
          <motion.div
            className="h-full w-full"
            animate={{ scale: 1 + step * 0.035 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PhotoSlot
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/92 via-[var(--ink)]/55 to-[var(--ink)]/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 md:px-10 md:py-24 md:pl-16">
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

          <ol className="min-h-[11rem] space-y-4 md:min-h-[14rem]">
            <AnimatePresence mode="sync">
              {t.osaka.steps.map((text, i) =>
                i <= step ? (
                  <motion.li
                    key={text}
                    initial={{ opacity: 0, x: -20, y: 8 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4"
                  >
                    <span className="tabular mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-lg font-medium text-white/95 md:text-2xl">
                      {text}
                    </p>
                  </motion.li>
                ) : null,
              )}
            </AnimatePresence>
          </ol>

          <div className="mt-10 flex gap-2" aria-hidden={isPresent}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-[var(--accent)]" : "bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>
        {!isPresent && <ScrollHint light visible={step < 2} />}
      </div>
    </section>
  );
}
