// Twin Lanterns — tuning, layout and palette for a spot-the-difference hunt.
// The playfield is a fixed 1280x720 logical canvas; the renderer scales it to
// the window, so every rule below is independent of the actual screen size.

export const FIELD = { width: 1280, height: 720 };

/** The two picture panels, side by side, with a gutter between them. */
export const PANEL = { y: 118, width: 604, height: 500, leftX: 26, rightX: 650, radius: 18 };

/** Seconds on the clock for each level, by level index (later levels are tighter). */
export const LEVEL_TIME = [100, 95, 90, 85, 80];

/** Points for a find, before the speed bonus; a wrong click and a hint both cost. */
export const SCORE = {
  find: 100,
  timeBonusPerSecond: 2,
  wrongPenalty: 25,
  wrongTimePenalty: 3,
  hintCost: 40,
  levelBonus: 150,
};

/** A level is failed when the clock runs out or this many mistakes pile up. */
export const MAX_MISTAKES = 5;

/** Hints available per level; a hint rings a neighbourhood, never the exact spot. */
export const HINTS_PER_LEVEL = 3;

export const PALETTE = {
  backdrop: '#171a26',
  chrome: '#222739',
  chromeEdge: '#39415e',
  text: '#f2f0e6',
  muted: '#a7adc2',
  accent: '#ffcf5c',
  good: '#52e0a4',
  bad: '#ff6b6b',
  hint: '#7cc7ff',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'twin-lanterns.best';
