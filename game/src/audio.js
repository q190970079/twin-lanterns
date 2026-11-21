// Twin Lanterns — tiny WebAudio chimes, made in code so the game needs no
// sound files and stays silent until the player first interacts with it.

let context = null;

function ensureContext() {
  if (context === null) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    context = new AudioCtor();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

function tone(freq, start, duration, type, gainValue) {
  const ctx = ensureContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.02);
}

/** Two bright notes when a difference is spotted. */
export function playFind() {
  tone(880, 0, 0.12, 'sine', 0.16);
  tone(1318, 0.09, 0.18, 'sine', 0.14);
}

/** A low buzz for a wrong click. */
export function playWrong() {
  tone(160, 0, 0.16, 'square', 0.06);
}

/** A small arpeggio when a level is cleared. */
export function playLevelClear() {
  tone(659, 0, 0.14, 'triangle', 0.15);
  tone(880, 0.12, 0.14, 'triangle', 0.15);
  tone(1174, 0.24, 0.22, 'triangle', 0.15);
}

/** A soft tick when a hint is spent. */
export function playHint() {
  tone(1046, 0, 0.10, 'sine', 0.10);
}
