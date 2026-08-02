"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BEAT_IDS, BEAT_SUBSTEPS, type BeatId } from "@/lib/beats";

type PresentationContextValue = {
  isPresent: boolean;
  beatIndex: number;
  subStep: number;
  beatId: BeatId;
  goNext: () => void;
  goPrev: () => void;
  goToBeat: (index: number) => void;
  setSubStep: (step: number) => void;
};

const PresentationContext = createContext<PresentationContextValue | null>(
  null,
);

function scrollToBeat(index: number, instant = false) {
  const id = BEAT_IDS[index];
  const el = document.getElementById(`beat-${id}`);
  if (!el) return;
  el.scrollIntoView({
    behavior: instant ? "instant" : "smooth",
    block: "start",
  });
}

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [isPresent, setIsPresent] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [subStep, setSubStep] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPresent(params.get("present") === "1");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("present-mode", isPresent);
    document.body.classList.toggle("present-mode", isPresent);
  }, [isPresent]);

  const goToBeat = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(BEAT_IDS.length - 1, index));
      setBeatIndex(clamped);
      setSubStep(0);
      scrollToBeat(clamped);
    },
    [],
  );

  const goNext = useCallback(() => {
    const id = BEAT_IDS[beatIndex];
    const max = BEAT_SUBSTEPS[id];
    if (subStep < max) {
      setSubStep((s) => s + 1);
      return;
    }
    if (beatIndex < BEAT_IDS.length - 1) {
      const next = beatIndex + 1;
      setBeatIndex(next);
      setSubStep(0);
      scrollToBeat(next);
    }
  }, [beatIndex, subStep]);

  const goPrev = useCallback(() => {
    if (subStep > 0) {
      setSubStep((s) => s - 1);
      return;
    }
    if (beatIndex > 0) {
      const prev = beatIndex - 1;
      const prevId = BEAT_IDS[prev];
      setBeatIndex(prev);
      setSubStep(BEAT_SUBSTEPS[prevId]);
      scrollToBeat(prev);
    }
  }, [beatIndex, subStep]);

  useEffect(() => {
    if (!isPresent) return;

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === " " ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        goNext();
      } else if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        goPrev();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen?.();
        } else {
          void document.exitFullscreen?.();
        }
      } else if (e.key >= "1" && e.key <= "9") {
        const idx = Number(e.key) - 1;
        if (idx < BEAT_IDS.length) goToBeat(idx);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPresent, goNext, goPrev, goToBeat]);

  // Track active beat via scroll position — IntersectionObserver fails on tall GSAP pin sections
  useEffect(() => {
    if (isPresent) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const probe = window.innerHeight * 0.4;
      let current = 0;

      for (let i = 0; i < BEAT_IDS.length; i++) {
        const el = document.getElementById(`beat-${BEAT_IDS[i]}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section that currently covers the probe line wins
        if (rect.top <= probe && rect.bottom > probe) {
          current = i;
        }
      }

      setBeatIndex((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Re-run after GSAP pins create spacers
    const t1 = window.setTimeout(update, 100);
    const t2 = window.setTimeout(update, 600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isPresent]);

  const value = useMemo(
    () => ({
      isPresent,
      beatIndex,
      subStep,
      beatId: BEAT_IDS[beatIndex],
      goNext,
      goPrev,
      goToBeat,
      setSubStep,
    }),
    [isPresent, beatIndex, subStep, goNext, goPrev, goToBeat],
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const ctx = useContext(PresentationContext);
  if (!ctx)
    throw new Error("usePresentation must be used within PresentationProvider");
  return ctx;
}
