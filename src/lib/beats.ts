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
  osaka: 2,
  fuji: 2,
  tech: 2,
  obo: 0,
  tokyo: 0,
  closing: 0,
};

/** Short labels for journey rail stamps + present HUD */
export const BEAT_STAMPS: Record<
  BeatId,
  { ja: string; en: string; mark: string }
> = {
  hero: { ja: "出発", en: "Start", mark: "★" },
  explorer: { ja: "Explorer", en: "Explorer", mark: "◆" },
  world: { ja: "世界", en: "World", mark: "◎" },
  osaka: { ja: "万博", en: "Expo", mark: "▲" },
  fuji: { ja: "富士", en: "Fuji", mark: "⛰" },
  tech: { ja: "技術", en: "Tech", mark: "▣" },
  obo: { ja: "ObO", en: "ObO", mark: "●" },
  tokyo: { ja: "東京", en: "Tokyo", mark: "◇" },
  closing: { ja: "招待", en: "Invite", mark: "✦" },
};

/** Atmosphere tint per beat — applied as data-atmosphere on sections */
export const BEAT_ATMOSPHERE: Record<BeatId, string> = {
  hero: "neutral",
  explorer: "soft",
  world: "cool",
  osaka: "ink",
  fuji: "dawn",
  tech: "soft",
  obo: "warm",
  tokyo: "soft",
  closing: "warm",
};
