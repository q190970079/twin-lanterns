// Twin Lanterns — the five picture pairs and every difference hidden in them.
// Each scene is drawn twice by render.js: once plain (the left panel) and once
// with every difference applied (the right panel). A difference names the spot
// in panel-relative coordinates (x and y are 0..1 across one panel, r is the
// click tolerance in the same units), the painter change that creates it, and a
// vague hint phrase that never gives the exact place away.

export const SCENES = [
  {
    id: 'harbour',
    title: 'Lantern Harbour',
    subtitle: 'Dusk over the little port',
    theme: 'harbour',
    differences: [
      { id: 'moon', x: 0.88, y: 0.13, r: 0.075, hint: 'Something about the moon is not the same.' },
      { id: 'star', x: 0.15, y: 0.16, r: 0.07, hint: 'One light in the sky went out.' },
      { id: 'lamp', x: 0.70, y: 0.34, r: 0.07, hint: 'A harbour light changed its colour.' },
      { id: 'window', x: 0.44, y: 0.46, r: 0.07, hint: 'Someone at home turned a light off.' },
      { id: 'sail', x: 0.28, y: 0.60, r: 0.085, hint: 'A sail lost one of its stripes.' },
      { id: 'buoy', x: 0.84, y: 0.78, r: 0.075, hint: 'The water holds one more thing than it should.' },
    ],
  },
  {
    id: 'cabin',
    title: 'Pinewood Cabin',
    subtitle: 'First snow in the forest',
    theme: 'cabin',
    differences: [
      { id: 'smoke', x: 0.36, y: 0.18, r: 0.08, hint: 'The chimney is behaving differently.' },
      { id: 'owl', x: 0.83, y: 0.30, r: 0.07, hint: 'A new pair of eyes is watching from a tree.' },
      { id: 'scarf', x: 0.66, y: 0.58, r: 0.07, hint: 'The snowman dressed in a different colour.' },
      { id: 'sapling', x: 0.10, y: 0.62, r: 0.075, hint: 'One small tree is missing from the slope.' },
      { id: 'porch-lamp', x: 0.47, y: 0.44, r: 0.065, hint: 'The porch glows with one lamp fewer.' },
      { id: 'deer', x: 0.90, y: 0.66, r: 0.08, hint: 'A visitor at the edge of the trees changed.' },
      { id: 'stones', x: 0.52, y: 0.84, r: 0.08, hint: 'The garden path is one stone short.' },
    ],
  },
  {
    id: 'market',
    title: 'Lantern Market',
    subtitle: 'Festival night in the old lane',
    theme: 'market',
    differences: [
      { id: 'lantern', x: 0.22, y: 0.20, r: 0.07, hint: 'One lantern burns a different colour.' },
      { id: 'cat', x: 0.78, y: 0.70, r: 0.075, hint: 'A small guest arrived on the crates.' },
      { id: 'awning', x: 0.50, y: 0.36, r: 0.09, hint: 'A stall canopy lost its stripes.' },
      { id: 'balloons', x: 0.90, y: 0.30, r: 0.075, hint: 'Count the balloons by the arch.' },
      { id: 'flag', x: 0.36, y: 0.12, r: 0.07, hint: 'One banner flag flipped its colour.' },
      { id: 'melons', x: 0.16, y: 0.57, r: 0.085, hint: 'The fruit pile is arranged differently.' },
      { id: 'sign', x: 0.64, y: 0.50, r: 0.07, hint: 'The baker sign says it with a different symbol.' },
    ],
  },
  {
    id: 'reef',
    title: 'Coral Reef',
    subtitle: 'A quiet minute under the sea',
    theme: 'reef',
    differences: [
      { id: 'turtle-spot', x: 0.30, y: 0.30, r: 0.08, hint: 'The turtle shell pattern changed.' },
      { id: 'starfish', x: 0.80, y: 0.80, r: 0.075, hint: 'A starfish is missing from the sand.' },
      { id: 'bubbles', x: 0.62, y: 0.22, r: 0.075, hint: 'Count the bubbles rising in the middle.' },
      { id: 'seahorse', x: 0.88, y: 0.48, r: 0.07, hint: 'The seahorse turned to face the other way.' },
      { id: 'fish-stripe', x: 0.16, y: 0.52, r: 0.08, hint: 'One fish wears a different stripe.' },
      { id: 'pearl', x: 0.48, y: 0.82, r: 0.07, hint: 'The open shell holds something new.' },
      { id: 'coral', x: 0.09, y: 0.82, r: 0.08, hint: 'A coral branch changed colour at the edge.' },
      { id: 'ray', x: 0.52, y: 0.12, r: 0.09, hint: 'A shape gliding at the top is gone.' },
    ],
  },
  {
    id: 'observatory',
    title: 'Hilltop Observatory',
    subtitle: 'Counting stars before midnight',
    theme: 'observatory',
    differences: [
      { id: 'comet', x: 0.18, y: 0.14, r: 0.09, hint: 'Something is streaking across the sky.' },
      { id: 'dome', x: 0.52, y: 0.30, r: 0.09, hint: 'The dome wears a different band.' },
      { id: 'telescope', x: 0.70, y: 0.48, r: 0.085, hint: 'The telescope is pointing somewhere new.' },
      { id: 'dish', x: 0.88, y: 0.62, r: 0.075, hint: 'The little dish lost its ear.' },
      { id: 'constellation', x: 0.34, y: 0.24, r: 0.07, hint: 'One star of the pattern went missing.' },
      { id: 'flag', x: 0.10, y: 0.50, r: 0.07, hint: 'The flag on the hut changed colour.' },
      { id: 'chart', x: 0.44, y: 0.62, r: 0.07, hint: 'The chart in the window shows another shape.' },
      { id: 'fireflies', x: 0.78, y: 0.84, r: 0.08, hint: 'Count the fireflies over the grass.' },
    ],
  },
];

/** Total differences in a scene: the number the counter counts down from. */
export function differenceCount(scene) {
  return scene.differences.length;
}

/** The difference at a panel-relative point, or null when the click is clean. */
export function differenceAt(scene, x, y, foundIds) {
  for (const diff of scene.differences) {
    if (foundIds.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}
