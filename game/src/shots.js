// Twin Lanterns — the screenshot scenes behind ?shot=cover|play|hint|finale.
// Each one puts a real game into a believable mid-hunt state: some differences
// already ringed on both panels, several still unfound, the counter showing
// how many remain, the clock part-spent and a hint ring live in one of them.
// The states are set through the game's own fields, so a screenshot is a true
// render of play, never a mock-up. The staged best score matches the staged
// score, so the header never shows a best lower than the score beside it.

import { SCREEN_PLAY, SCREEN_CLEAR } from './game.js';
import { SCENES } from './scenes.js';

function foundIds(scene, ids) {
  return new Set(scene.differences.filter((d) => ids.includes(d.id)).map((d) => d.id));
}

/**
 * Put `game` into the named scene and return it. Unknown names fall back to
 * the cover scene, so a mistyped query still shows the game at its best.
 */
export function stageShot(name, game) {
  if (name === 'play') {
    game.startGame();
    game.resetLevel(1);
    game.screen = SCREEN_PLAY;
    game.found = foundIds(SCENES[1], ['smoke', 'scarf', 'stones']);
    game.score = 512; game.levelScore = 512; game.best = 512;
    game.timeLeft = 57; game.mistakes = 1;
    game.message = 'Found one! 4 differences remain.';
    return game;
  }
  if (name === 'hint') {
    game.startGame();
    game.resetLevel(2);
    game.screen = SCREEN_PLAY;
    game.found = foundIds(SCENES[2], ['lantern', 'awning', 'melons']);
    game.score = 1048; game.levelScore = 430; game.best = 1048;
    game.timeLeft = 48; game.mistakes = 1; game.hintsLeft = 1;
    const target = SCENES[2].differences.find((d) => d.id === 'cat');
    game.hintDiff = target;
    game.hintUntil = Number.POSITIVE_INFINITY;
    game.message = 'Hint: A small guest arrived on the crates.';
    return game;
  }
  if (name === 'finale') {
    game.startGame();
    game.resetLevel(3);
    game.screen = SCREEN_PLAY;
    game.found = foundIds(SCENES[3], ['turtle-spot', 'fish-stripe', 'pearl', 'starfish', 'coral']);
    game.score = 2310; game.levelScore = 690; game.best = 2310;
    game.timeLeft = 31; game.mistakes = 2; game.hintsLeft = 1;
    game.message = 'Found one! 3 differences remain.';
    return game;
  }
  // cover: the harbour at dusk, two differences ringed, four still hiding.
  game.startGame();
  game.resetLevel(0);
  game.screen = SCREEN_PLAY;
  game.found = foundIds(SCENES[0], ['sail', 'lamp']);
  game.score = 376; game.levelScore = 376; game.best = 376;
  game.timeLeft = 72; game.mistakes = 0;
  game.message = 'Found one! 4 differences remain.';
  return game;
}

export { SCREEN_CLEAR };
