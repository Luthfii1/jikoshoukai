export const BEAT_IDS = [
  "hero",
  "explorer",
  "world",
  "osaka",
  "fuji",
  "tech",
  "obo",
  "tokyo",
  "closing",
] as const;

export type BeatId = (typeof BEAT_IDS)[number];

/** Max internal sub-steps per beat (0-indexed last step). Live mode advances these with →. */
export const BEAT_SUBSTEPS: Record<BeatId, number> = {
  hero: 0,
  explorer: 0,
  world: 0,
  osaka: 2, // 3 steps: 0,1,2
  fuji: 2, // 3 stops
  tech: 2,
  obo: 0,
  tokyo: 0,
  closing: 0,
};
