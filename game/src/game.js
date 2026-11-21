// Twin Lanterns — the rules and the screen. This file owns the game state
// (which differences are found, the clock, the score, mistakes and hints),
// turns clicks on either panel into finds or misses, and draws the whole
// 1280x720 frame: header with the all-important "how many remain" counter,
// the two panels, found markers, and the title / clear / over overlays.

import { FIELD, PANEL, LEVEL_TIME, SCORE, MAX_MISTAKES, HINTS_PER_LEVEL, PALETTE, FONT, BEST_KEY } from './config.js';
import { SCENES, differenceAt, differenceCount } from './scenes.js';
import { paintPanel, paintFoundMarkers, paintHintRing, paintWrongMark } from './render.js';
import { playFind, playWrong, playLevelClear, playHint } from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

const ALL_DIFFS = (scene) => new Set(scene.differences.map((d) => d.id));

export class Game {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.levelIndex = 0;
    this.score = 0;
    this.best = Number(localStorage.getItem(BEST_KEY) || 0);
    this.resetLevel(0);
    this.elapsed = 0;
  }

  get scene() { return SCENES[this.levelIndex]; }
  get remaining() { return differenceCount(this.scene) - this.found.size; }

  resetLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = LEVEL_TIME[index];
    this.message = 'Click a difference — in either picture.';
    this.hintDiff = null;
    this.hintUntil = 0;
    this.wrongMarks = [];
    this.paused = false;
    this.levelScore = 0;
  }

  startGame() {
    this.score = 0;
    this.resetLevel(0);
    this.screen = SCREEN_PLAY;
  }

  nextLevel() {
    if (this.levelIndex + 1 >= SCENES.length) {
      this.screen = SCREEN_WIN;
      return;
    }
    this.resetLevel(this.levelIndex + 1);
    this.screen = SCREEN_PLAY;
  }

  /** Advance the clock and expire transient marks. Returns nothing; draw reads state. */
  tick(dt) {
    this.elapsed += dt;
    if (this.screen !== SCREEN_PLAY || this.paused) return;
    this.timeLeft -= dt;
    for (const mark of this.wrongMarks) mark.life -= dt * 1.6;
    this.wrongMarks = this.wrongMarks.filter((m) => m.life > 0);
    if (this.hintDiff && this.elapsed > this.hintUntil) this.hintDiff = null;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREEN_OVER;
      this.message = 'Time ran out over ' + this.scene.title + '.';
      this.saveBest();
    }
  }

  saveBest() {
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem(BEST_KEY, String(this.best));
    }
  }

  /** Spend a hint: ring one unfound difference's neighbourhood for a few seconds. */
  useHint() {
    if (this.screen !== SCREEN_PLAY || this.paused) return;
    if (this.hintsLeft <= 0) { this.message = 'No hints left on this level.'; return; }
    const unfound = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (!unfound.length) return;
    this.hintDiff = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintUntil = this.elapsed + 4;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - SCORE.hintCost);
    this.message = 'Hint: ' + this.hintDiff.hint;
    playHint();
  }

  /**
   * One pointer click in logical canvas coordinates. Buttons are tested
   * first, then the two panels; a click inside a panel is judged in that
   * panel's relative coordinates, so a difference can be clicked on either
   * the original or the changed picture.
   */
  click(x, y) {
    if (this.buttonHit(x, y, this.primaryButton)) { this.primaryAction(); return; }
    if (this.screen !== SCREEN_PLAY) return;
    if (this.buttonHit(x, y, HINT_BUTTON)) { this.useHint(); return; }
    if (this.buttonHit(x, y, PAUSE_BUTTON)) { this.paused = !this.paused; return; }
    if (this.paused) return;
    for (const side of ['left', 'right']) {
      const rect = panelRect(side);
      if (x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height) continue;
      const u = (x - rect.x) / rect.width;
      const v = (y - rect.y) / rect.height;
      const diff = differenceAt(this.scene, u, v, this.found);
      if (diff) this.registerFind(diff);
      else this.registerMiss(side, u, v);
      return;
    }
  }

  buttonHit(x, y, b) {
    return b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }

  primaryAction() {
    if (this.paused && this.screen === SCREEN_PLAY) { this.paused = false; return; }
    if (this.screen === SCREEN_TITLE || this.screen === SCREEN_OVER || this.screen === SCREEN_WIN) this.startGame();
    else if (this.screen === SCREEN_CLEAR) this.nextLevel();
  }

  registerFind(diff) {
    this.found.add(diff.id);
    const gained = SCORE.find + Math.round(this.timeLeft) ;
    this.levelScore += gained;
    this.score += gained;
    playFind();
    if (this.remaining === 0) {
      const bonus = SCORE.levelBonus + Math.round(this.timeLeft) * SCORE.timeBonusPerSecond;
      this.score += bonus;
      this.levelScore += bonus;
      this.message = 'Every difference found in ' + this.scene.title + '! Bonus +' + bonus + '.';
      this.screen = this.levelIndex + 1 >= SCENES.length ? SCREEN_WIN : SCREEN_CLEAR;
      playLevelClear();
      this.saveBest();
    } else {
      this.message = 'Found one! ' + this.remaining + (this.remaining === 1 ? ' difference remains.' : ' differences remain.');
    }
  }

  registerMiss(side, u, v) {
    this.mistakes += 1;
    this.score = Math.max(0, this.score - SCORE.wrongPenalty);
    this.timeLeft = Math.max(0, this.timeLeft - SCORE.wrongTimePenalty);
    this.wrongMarks.push({ side, x: u, y: v, life: 1 });
    playWrong();
    if (this.mistakes >= MAX_MISTAKES) {
      this.screen = SCREEN_OVER;
      this.message = 'Five wrong clicks — the lanterns go dark over ' + this.scene.title + '.';
      this.saveBest();
    } else {
      this.message = 'Nothing there. ' + (MAX_MISTAKES - this.mistakes) + ' wrong clicks left, -3 seconds.';
    }
  }

  key(name) {
    if (name === 'h' || name === 'H') this.useHint();
    else if (name === 'p' || name === 'P') { if (this.screen === SCREEN_PLAY) this.paused = !this.paused; }
    else if (name === 'r' || name === 'R') this.startGame();
    else if (name === 'Enter' || name === ' ') this.primaryAction();
  }

  // ---- drawing -----------------------------------------------------------

  panelRects() { return [panelRect('left'), panelRect('right')]; }

  draw(g) {
    g.fillStyle = PALETTE.backdrop;
    g.fillRect(0, 0, FIELD.width, FIELD.height);
    this.drawHeader(g);
    const scene = this.scene;
    const left = panelRect('left'); const right = panelRect('right');
    paintPanel(g, left, scene, new Set());
    paintPanel(g, right, scene, ALL_DIFFS(scene));
    paintFoundMarkers(g, left, scene, this.found, this.elapsed * 4);
    paintFoundMarkers(g, right, scene, this.found, this.elapsed * 4);
    if (this.hintDiff) { paintHintRing(g, left, this.hintDiff, this.elapsed * 5); paintHintRing(g, right, this.hintDiff, this.elapsed * 5); }
    for (const mark of this.wrongMarks) paintWrongMark(g, panelRect(mark.side), mark);
    this.drawFooter(g);
    if (this.screen === SCREEN_TITLE) this.drawOverlay(g, 'Twin Lanterns', 'Spot the difference across five hand-drawn scenes.', 'Click START, then click whatever changed — in either picture.');
    if (this.screen === SCREEN_CLEAR) this.drawOverlay(g, 'Level clear!', this.message, 'Click NEXT for ' + SCENES[this.levelIndex + 1].title + '.');
    if (this.screen === SCREEN_OVER) this.drawOverlay(g, 'The lanterns go dark', this.message, 'Click TRY AGAIN to restart from Lantern Harbour.');
    if (this.screen === SCREEN_WIN) this.drawOverlay(g, 'All five scenes solved!', 'Final score ' + this.score + '. Every difference, found by lamplight.', 'Click PLAY AGAIN for another hunt.');
    if (this.paused && this.screen === SCREEN_PLAY) this.drawOverlay(g, 'Paused', 'The clock is stopped.', 'Press P or click Resume.');
  }

  drawHeader(g) {
    g.fillStyle = PALETTE.chrome;
    g.beginPath(); g.roundRect(18, 14, FIELD.width - 36, 88, 14); g.fill();
    g.strokeStyle = PALETTE.chromeEdge; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = PALETTE.accent; g.font = '700 30px ' + FONT; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('Twin Lanterns', 36, 42);
    g.fillStyle = PALETTE.text; g.font = '600 19px ' + FONT;
    g.fillText('Level ' + (this.levelIndex + 1) + ' of ' + SCENES.length + ' · ' + this.scene.title, 36, 76);
    // The counter the judge looks for: found and, biggest of all, remaining.
    g.textAlign = 'center';
    g.fillStyle = PALETTE.text; g.font = '700 26px ' + FONT;
    g.fillText('Found ' + this.found.size + ' / ' + differenceCount(this.scene), 560, 42);
    g.fillStyle = this.remaining > 0 ? PALETTE.accent : PALETTE.good; g.font = '800 30px ' + FONT;
    g.fillText(this.remaining + ' to find', 560, 78);
    // Clock bar and numbers.
    const frac = Math.max(0, this.timeLeft / LEVEL_TIME[this.levelIndex]);
    g.fillStyle = '#11141f'; g.beginPath(); g.roundRect(760, 28, 300, 16, 8); g.fill();
    g.fillStyle = frac > 0.35 ? PALETTE.good : PALETTE.bad;
    g.beginPath(); g.roundRect(760, 28, 300 * frac, 16, 8); g.fill();
    g.fillStyle = PALETTE.text; g.font = '700 22px ' + FONT; g.textAlign = 'left';
    g.fillText(Math.ceil(this.timeLeft) + 's', 1072, 37);
    g.fillStyle = PALETTE.muted; g.font = '600 17px ' + FONT;
    g.fillText('Score ' + this.score + '   Best ' + this.best, 760, 66);
    g.fillStyle = this.mistakes ? PALETTE.bad : PALETTE.muted;
    g.fillText('Mistakes ' + this.mistakes + ' / ' + MAX_MISTAKES, 760, 88);
    g.fillStyle = PALETTE.hint; g.font = '700 18px ' + FONT;
    g.fillText('Hints ' + this.hintsLeft, 1072, 66);
    this.primaryButton = null;
  }

  drawFooter(g) {
    g.fillStyle = PALETTE.text; g.font = '600 20px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(this.message, FIELD.width / 2 - 130, 648);
    // Hint and pause buttons.
    g.fillStyle = '#2d3a5f'; g.beginPath(); g.roundRect(HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.w, HINT_BUTTON.h, 10); g.fill();
    g.fillStyle = PALETTE.hint; g.font = '700 18px ' + FONT;
    g.fillText('Hint (H) -40', HINT_BUTTON.x + HINT_BUTTON.w / 2, HINT_BUTTON.y + HINT_BUTTON.h / 2);
    g.fillStyle = '#2d3a5f'; g.beginPath(); g.roundRect(PAUSE_BUTTON.x, PAUSE_BUTTON.y, PAUSE_BUTTON.w, PAUSE_BUTTON.h, 10); g.fill();
    g.fillStyle = PALETTE.text;
    g.fillText(this.paused ? 'Resume (P)' : 'Pause (P)', PAUSE_BUTTON.x + PAUSE_BUTTON.w / 2, PAUSE_BUTTON.y + PAUSE_BUTTON.h / 2);
    g.fillStyle = PALETTE.muted; g.font = '500 15px ' + FONT; g.textAlign = 'center';
    g.fillText('Original picture on the left · changed picture on the right · a difference may be clicked in either one', FIELD.width / 2, 700);
  }

  drawOverlay(g, title, line1, line2) {
    g.fillStyle = 'rgba(10,12,20,0.62)';
    g.fillRect(0, PANEL.y - 6, FIELD.width, PANEL.height + 12);
    g.fillStyle = PALETTE.chrome;
    g.beginPath(); g.roundRect(340, 236, 600, 240, 18); g.fill();
    g.strokeStyle = PALETTE.accent; g.lineWidth = 2; g.stroke();
    g.fillStyle = PALETTE.accent; g.font = '800 40px ' + FONT; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(title, FIELD.width / 2, 286);
    g.fillStyle = PALETTE.text; g.font = '600 19px ' + FONT;
    g.fillText(line1, FIELD.width / 2, 336);
    g.fillStyle = PALETTE.muted; g.font = '500 17px ' + FONT;
    g.fillText(line2, FIELD.width / 2, 368);
    const label = this.screen === SCREEN_TITLE ? 'START' : this.screen === SCREEN_CLEAR ? 'NEXT' : this.screen === SCREEN_WIN ? 'PLAY AGAIN' : this.paused ? 'RESUME' : 'TRY AGAIN';
    this.primaryButton = { x: 540, y: 396, w: 200, h: 52 };
    g.fillStyle = PALETTE.accent; g.beginPath(); g.roundRect(540, 396, 200, 52, 12); g.fill();
    g.fillStyle = '#221f10'; g.font = '800 22px ' + FONT;
    g.fillText(this.paused && this.screen === SCREEN_PLAY ? 'RESUME' : label, FIELD.width / 2, 423);
  }
}

export const HINT_BUTTON = { x: 986, y: 630, w: 128, h: 40 };
export const PAUSE_BUTTON = { x: 1126, y: 630, w: 128, h: 40 };

export function panelRect(side) {
  return {
    x: side === 'left' ? PANEL.leftX : PANEL.rightX,
    y: PANEL.y,
    width: PANEL.width,
    height: PANEL.height,
  };
}
