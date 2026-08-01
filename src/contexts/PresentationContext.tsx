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

  // Observe which beat is in view (explore mode progress + sync present index)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    BEAT_IDS.forEach((id, index) => {
      const el = document.getElementById(`beat-${id}`);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            setBeatIndex(index);
          }
        },
        { threshold: [0.45, 0.6] },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

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
