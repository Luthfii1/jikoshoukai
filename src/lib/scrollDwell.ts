/**
 * Map continuous scroll progress [0,1] onto a path with pauses at each stop.
 * Returns a value in [0, maxIndex] that holds near integers then eases to the next.
 *
 * - intro/outro: extra hold at first & last stop (e.g. Jakarta, Washington D.C.)
 * - dwell: fraction of each segment spent parked at the current city
 * - remaining fraction = slow eased travel to the next city
 */
export function dwellAlong(
  progress: number,
  maxIndex: number,
  dwellRatio = 0.55,
  introPad = 0.1,
  outroPad = 0.14,
): number {
  if (maxIndex <= 0) return 0;
  const p = Math.min(1, Math.max(0, progress));
  if (p <= introPad) return 0;
  if (p >= 1 - outroPad) return maxIndex;

  const usable = 1 - introPad - outroPad;
  const mid = (p - introPad) / usable;
  const segs = maxIndex;
  const x = mid * segs;
  const i = Math.min(segs - 1, Math.floor(x));
  const local = x - i;
  const hold = Math.min(0.75, Math.max(0.25, dwellRatio));

  if (local <= hold) return i;

  // Smoothstep so camera doesn't whip between countries
  const raw = (local - hold) / (1 - hold);
  const eased = raw * raw * (3 - 2 * raw);
  return i + eased;
}

/**
 * For discrete captions: which step index is active (0..steps-1),
 * with long holds so scroll feels heavy.
 */
export function dwellStep(
  progress: number,
  steps: number,
  introPad = 0.04,
  outroPad = 0.08,
): number {
  if (steps <= 0) return 0;
  const p = Math.min(1, Math.max(0, progress));
  if (p < introPad) return -1;
  if (p > 1 - outroPad) return steps - 1;

  const usable = 1 - introPad - outroPad;
  const local = (p - introPad) / usable;
  return Math.min(steps - 1, Math.floor(local * steps));
}
