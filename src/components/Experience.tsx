"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { PresentationProvider } from "@/contexts/PresentationContext";
import { JourneyRail, MobileProgress, PresentHUD, TopBar } from "@/components/Shell";
import { HeroBeat } from "@/components/beats/HeroBeat";
import { ExplorerBeat } from "@/components/beats/ExplorerBeat";
import { WorldBeat } from "@/components/beats/WorldBeat";
import { OsakaBeat } from "@/components/beats/OsakaBeat";
import { FujiBeat } from "@/components/beats/FujiBeat";
import { TechBeat } from "@/components/beats/TechBeat";
import { ObOBeat } from "@/components/beats/ObOBeat";
import { TokyoBeat } from "@/components/beats/TokyoBeat";
import { ClosingBeat } from "@/components/beats/ClosingBeat";

function ScrollRefresh() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("load", onLoad);
    };
  }, []);
  return null;
}

export function Experience() {
  return (
    <LocaleProvider>
      <PresentationProvider>
        <ScrollRefresh />
        <TopBar />
        <MobileProgress />
        <JourneyRail />
        <PresentHUD />
        <main>
          <HeroBeat />
          <ExplorerBeat />
          <WorldBeat />
          <OsakaBeat />
          <FujiBeat />
          <TechBeat />
          <ObOBeat />
          <TokyoBeat />
          <ClosingBeat />
        </main>
      </PresentationProvider>
    </LocaleProvider>
  );
}
