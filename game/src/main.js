// Twin Lanterns — bootstrap. Wires the canvas to the game: scales the fixed
// 1280x720 field to the window, forwards mouse clicks and keys, runs the
// clock, and stages a screenshot scene when the URL asks for one (?shot=…).

import { FIELD } from './config.js';
import { Game, SCREEN_PLAY } from './game.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const g = canvas.getContext('2d');
canvas.width = FIELD.width;
canvas.height = FIELD.height;

const game = new Game();
const params = new URLSearchParams(window.location.search);
if (params.has('shot')) stageShot(params.get('shot'), game);

function toLogical(event) {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(rect.width / FIELD.width, rect.height / FIELD.height);
  const drawnW = FIELD.width * scale;
  const drawnH = FIELD.height * scale;
  const offsetX = rect.left + (rect.width - drawnW) / 2;
  const offsetY = rect.top + (rect.height - drawnH) / 2;
  return { x: (event.clientX - offsetX) / scale, y: (event.clientY - offsetY) / scale };
}

canvas.addEventListener('pointerdown', (event) => {
  const point = toLogical(event);
  game.click(point.x, point.y);
  status.textContent = game.message;
});

window.addEventListener('keydown', (event) => {
  if (event.key === ' ') event.preventDefault();
  game.key(event.key);
  status.textContent = game.message;
});

function frame(now) {
  if (frame.last === undefined) frame.last = now;
  const dt = Math.min(0.1, (now - frame.last) / 1000);
  frame.last = now;
  if (!params.has('shot')) game.tick(dt);
  else game.elapsed += dt * 0.25;
  // Fit the logical field into the window, letterboxed on the backdrop.
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.style.width = FIELD.width * scale + 'px';
  canvas.style.height = FIELD.height * scale + 'px';
  game.draw(g);
  if (game.screen === SCREEN_PLAY) status.textContent = game.message;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
