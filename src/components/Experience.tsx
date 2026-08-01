"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { PresentationProvider } from "@/contexts/PresentationContext";
import { ProgressDots, TopBar } from "@/components/Shell";
import { HeroBeat } from "@/components/beats/HeroBeat";
import { ExplorerBeat } from "@/components/beats/ExplorerBeat";
import { WorldBeat } from "@/components/beats/WorldBeat";
import { OsakaBeat } from "@/components/beats/OsakaBeat";
import { FujiBeat } from "@/components/beats/FujiBeat";
import { TechBeat } from "@/components/beats/TechBeat";
import { ObOBeat } from "@/components/beats/ObOBeat";
import { TokyoBeat } from "@/components/beats/TokyoBeat";
import { ClosingBeat } from "@/components/beats/ClosingBeat";

export function Experience() {
  return (
    <LocaleProvider>
      <PresentationProvider>
        <TopBar />
        <ProgressDots />
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
