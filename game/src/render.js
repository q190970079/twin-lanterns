// Twin Lanterns — every painter. One function per scene theme draws the whole
// picture in panel pixel space; a difference is applied by checking its id
// against the `diffs` set (empty for the left panel, full for the right one).
// Nothing here knows the rules: game.js owns state, this file only draws it.

function px(rect, u) { return rect.x + u * rect.width; }
function py(rect, v) { return rect.y + v * rect.height; }
function pw(rect, u) { return u * rect.width; }
function ph(rect, v) { return v * rect.height; }

function circle(g, rect, u, v, r, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.arc(px(rect, u), py(rect, v), pw(rect, r), 0, Math.PI * 2);
  g.fill();
}

function ellipse(g, rect, u, v, ru, rv, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.ellipse(px(rect, u), py(rect, v), pw(rect, ru), ph(rect, rv), 0, 0, Math.PI * 2);
  g.fill();
}

function box(g, rect, u, v, w, h, fill) {
  g.fillStyle = fill;
  g.fillRect(px(rect, u), py(rect, v), pw(rect, w), ph(rect, h));
}

function tri(g, rect, u1, v1, u2, v2, u3, v3, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.moveTo(px(rect, u1), py(rect, v1));
  g.lineTo(px(rect, u2), py(rect, v2));
  g.lineTo(px(rect, u3), py(rect, v3));
  g.closePath();
  g.fill();
}

function line(g, rect, u1, v1, u2, v2, stroke, width) {
  g.strokeStyle = stroke;
  g.lineWidth = Math.max(1.5, pw(rect, width));
  g.beginPath();
  g.moveTo(px(rect, u1), py(rect, v1));
  g.lineTo(px(rect, u2), py(rect, v2));
  g.stroke();
}

function star(g, rect, u, v, r, fill) {
  g.fillStyle = fill;
  const cx = px(rect, u); const cy = py(rect, v); const rad = pw(rect, r);
  g.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const dist = i % 2 === 0 ? rad : rad * 0.45;
    const x = cx + Math.cos(angle) * dist; const y = cy + Math.sin(angle) * dist;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath(); g.fill();
}

function skyGradient(g, rect, top, bottom) {
  const grad = g.createLinearGradient(0, rect.y, 0, rect.y + rect.height);
  grad.addColorStop(0, top); grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function pine(g, rect, u, vBase, size, trunk, leaf) {
  box(g, rect, u - 0.008, vBase - size * 0.18, 0.016, size * 0.18, trunk);
  tri(g, rect, u, vBase - size, u - size * 0.30, vBase - size * 0.35, u + size * 0.30, vBase - size * 0.35, leaf);
  tri(g, rect, u, vBase - size * 0.78, u - size * 0.36, vBase - size * 0.12, u + size * 0.36, vBase - size * 0.12, leaf);
}

function paintHarbour(g, rect, diffs) {
  skyGradient(g, rect, '#26355f', '#e8906d');
  box(g, rect, 0, 0.52, 1, 0.48, '#1d5f6e');
  for (let i = 0; i < 7; i += 1) line(g, rect, 0.04 + i * 0.13, 0.62 + (i % 3) * 0.09, 0.12 + i * 0.13, 0.62 + (i % 3) * 0.09, 'rgba(255,255,255,0.25)', 0.006);
  const stars = [[0.06, 0.08], [0.30, 0.10], [0.48, 0.06], [0.62, 0.14], [0.76, 0.06]];
  for (const [u, v] of stars) star(g, rect, u, v, 0.012, '#ffeeb0');
  if (!diffs.has('star')) star(g, rect, 0.15, 0.16, 0.016, '#ffffff');
  circle(g, rect, 0.88, 0.13, 0.052, '#f7e3ac');
  if (diffs.has('moon')) circle(g, rect, 0.905, 0.115, 0.046, '#31456e');
  tri(g, rect, 0, 0.52, 0.22, 0.34, 0.44, 0.52, '#22304f');
  tri(g, rect, 0.34, 0.52, 0.58, 0.38, 0.80, 0.52, '#1b2947');
  // Cottage with one tell-tale window.
  box(g, rect, 0.37, 0.42, 0.15, 0.13, '#d9b48a');
  tri(g, rect, 0.445, 0.36, 0.35, 0.43, 0.54, 0.43, '#8a4636');
  box(g, rect, 0.415, 0.435, 0.05, 0.05, diffs.has('window') ? '#2c3444' : '#ffd76a');
  box(g, rect, 0.475, 0.47, 0.03, 0.08, '#5d4037');
  // Pier and its lamp.
  box(g, rect, 0.55, 0.66, 0.45, 0.035, '#6d4c41');
  for (let i = 0; i < 5; i += 1) box(g, rect, 0.58 + i * 0.09, 0.66, 0.018, 0.14, '#54382e');
  line(g, rect, 0.70, 0.66, 0.70, 0.40, '#3e2723', 0.010);
  circle(g, rect, 0.70, 0.36, 0.030, diffs.has('lamp') ? '#5ce1e6' : '#ffcf5c');
  circle(g, rect, 0.70, 0.36, 0.048, diffs.has('lamp') ? 'rgba(92,225,230,0.25)' : 'rgba(255,207,92,0.25)');
  // Sailboat: the right-hand sail has lost a stripe.
  tri(g, rect, 0.28, 0.40, 0.28, 0.68, 0.40, 0.68, '#f5f0dc');
  tri(g, rect, 0.265, 0.46, 0.265, 0.68, 0.17, 0.68, '#e8dfc8');
  if (!diffs.has('sail')) box(g, rect, 0.28, 0.545, 0.075, 0.022, '#e5534b');
  box(g, rect, 0.28, 0.47, 0.105, 0.020, '#e5534b');
  line(g, rect, 0.28, 0.38, 0.28, 0.70, '#4e342e', 0.008);
  tri(g, rect, 0.15, 0.70, 0.42, 0.70, 0.37, 0.76, '#7a4a2b');
  box(g, rect, 0.15, 0.695, 0.27, 0.014, '#96603a');
  // Buoys, plus one extra on the right.
  circle(g, rect, 0.60, 0.84, 0.020, '#e5534b');
  circle(g, rect, 0.74, 0.90, 0.020, '#f2f0e6');
  if (diffs.has('buoy')) circle(g, rect, 0.84, 0.78, 0.022, '#e5534b');
  line(g, rect, 0.075, 0.235, 0.105, 0.215, '#ffffff', 0.004);
  line(g, rect, 0.105, 0.215, 0.135, 0.235, '#ffffff', 0.004);
  line(g, rect, 0.16, 0.27, 0.185, 0.252, '#ffffff', 0.004);
  line(g, rect, 0.185, 0.252, 0.21, 0.27, '#ffffff', 0.004);
}

function paintCabin(g, rect, diffs) {
  skyGradient(g, rect, '#7fb2dd', '#dceefb');
  circle(g, rect, 0.90, 0.10, 0.04, '#fff6c9');
  box(g, rect, 0, 0.58, 1, 0.42, '#eef4fb');
  const trees = [[0.05, 0.60, 0.34], [0.16, 0.60, 0.26], [0.72, 0.60, 0.30], [0.95, 0.62, 0.38]];
  for (const [u, v, s] of trees) pine(g, rect, u, v, s, '#5d4037', '#2e6b4f');
  if (!diffs.has('sapling')) pine(g, rect, 0.10, 0.68, 0.13, '#5d4037', '#35875f');
  // The big pine on the right, and its owl.
  pine(g, rect, 0.83, 0.62, 0.46, '#5d4037', '#285f45');
  if (diffs.has('owl')) {
    ellipse(g, rect, 0.83, 0.30, 0.028, 0.038, '#8d6e63');
    circle(g, rect, 0.822, 0.285, 0.008, '#ffffff'); circle(g, rect, 0.838, 0.285, 0.008, '#ffffff');
    circle(g, rect, 0.822, 0.285, 0.004, '#212121'); circle(g, rect, 0.838, 0.285, 0.004, '#212121');
  }
  // Cabin body, snowy roof and chimney smoke.
  box(g, rect, 0.28, 0.44, 0.32, 0.22, '#9c6b46');
  for (let i = 0; i < 4; i += 1) line(g, rect, 0.28, 0.485 + i * 0.05, 0.60, 0.485 + i * 0.05, '#7d5433', 0.006);
  tri(g, rect, 0.44, 0.30, 0.24, 0.45, 0.64, 0.45, '#f7fafc');
  box(g, rect, 0.33, 0.335, 0.05, 0.09, '#795548');
  if (!diffs.has('smoke')) {
    circle(g, rect, 0.365, 0.27, 0.020, 'rgba(255,255,255,0.85)');
    circle(g, rect, 0.38, 0.21, 0.028, 'rgba(255,255,255,0.7)');
    circle(g, rect, 0.40, 0.15, 0.036, 'rgba(255,255,255,0.5)');
  }
  box(g, rect, 0.315, 0.50, 0.06, 0.06, '#ffd76a');
  box(g, rect, 0.50, 0.52, 0.055, 0.14, '#5d4037');
  circle(g, rect, 0.415, 0.44, 0.016, '#ffcf5c');
  if (!diffs.has('porch-lamp')) circle(g, rect, 0.47, 0.44, 0.016, '#ffcf5c');
  // Snowman with a changeable scarf.
  circle(g, rect, 0.66, 0.66, 0.045, '#ffffff');
  circle(g, rect, 0.66, 0.565, 0.034, '#ffffff');
  box(g, rect, 0.628, 0.585, 0.064, 0.018, diffs.has('scarf') ? '#43a047' : '#e5534b');
  circle(g, rect, 0.652, 0.558, 0.004, '#212121'); circle(g, rect, 0.668, 0.558, 0.004, '#212121');
  tri(g, rect, 0.66, 0.565, 0.655, 0.575, 0.685, 0.57, '#fb8c00');
  // Deer at the treeline: antlers on the left, none on the right.
  ellipse(g, rect, 0.895, 0.665, 0.048, 0.026, '#a1887f');
  line(g, rect, 0.935, 0.655, 0.952, 0.615, '#a1887f', 0.014);
  circle(g, rect, 0.958, 0.608, 0.017, '#a1887f');
  ellipse(g, rect, 0.962, 0.612, 0.020, 0.010, '#a1887f');
  line(g, rect, 0.862, 0.685, 0.858, 0.745, '#8d6e63', 0.009);
  line(g, rect, 0.882, 0.688, 0.880, 0.745, '#8d6e63', 0.009);
  line(g, rect, 0.912, 0.688, 0.916, 0.745, '#8d6e63', 0.009);
  line(g, rect, 0.932, 0.682, 0.938, 0.74, '#8d6e63', 0.009);
  tri(g, rect, 0.848, 0.65, 0.83, 0.635, 0.85, 0.672, '#bcaaa4');
  if (!diffs.has('deer')) {
    line(g, rect, 0.958, 0.595, 0.946, 0.55, '#6d4c41', 0.006);
    line(g, rect, 0.946, 0.565, 0.932, 0.555, '#6d4c41', 0.005);
    line(g, rect, 0.958, 0.595, 0.972, 0.558, '#6d4c41', 0.006);
    line(g, rect, 0.968, 0.57, 0.982, 0.562, '#6d4c41', 0.005);
  }
  // Garden path stones, one short on the right.
  const stones = [[0.44, 0.72], [0.47, 0.78], [0.55, 0.90], [0.42, 0.94]];
  for (const [u, v] of stones) ellipse(g, rect, u, v, 0.030, 0.016, '#b0bec5');
  if (!diffs.has('stones')) ellipse(g, rect, 0.52, 0.84, 0.030, 0.016, '#b0bec5');
}

function paintMarket(g, rect, diffs) {
  skyGradient(g, rect, '#2d2350', '#6d3b5e');
  box(g, rect, 0, 0.72, 1, 0.28, '#3d2c29');
  // Banner flags strung across the top.
  line(g, rect, 0.02, 0.05, 0.98, 0.10, '#d7ccc8', 0.004);
  const flagCols = ['#e5534b', '#ffcf5c', '#52e0a4', '#7cc7ff', '#ff9f68', '#e5534b'];
  for (let i = 0; i < 6; i += 1) {
    const u = 0.08 + i * 0.15; const v = 0.062 + i * 0.008;
    const col = i === 3 && diffs.has('flag') ? '#52e0a4' : flagCols[i];
    tri(g, rect, u, v, u + 0.07, v + 0.008, u + 0.035, v + 0.075, i === 3 ? col : flagCols[i]);
  }
  // Hanging lanterns, one burning a different colour.
  line(g, rect, 0.02, 0.16, 0.98, 0.16, '#d7ccc8', 0.004);
  const lanternCols = ['#ff9f68', '#ffcf5c', '#ff6b6b', '#52e0a4', '#ff9f68'];
  for (let i = 0; i < 5; i += 1) {
    const u = 0.10 + i * 0.20;
    const col = i === 1 && diffs.has('lantern') ? '#b388ff' : lanternCols[i];
    line(g, rect, u, 0.16, u, 0.185, '#d7ccc8', 0.004);
    ellipse(g, rect, u, 0.215, 0.030, 0.038, col);
  }
  // Centre stall with a striped (or plain) awning.
  box(g, rect, 0.34, 0.44, 0.32, 0.28, '#6d4c41');
  for (let i = 0; i < 6; i += 1) box(g, rect, 0.325 + i * 0.058, 0.335, 0.058, 0.075, diffs.has('awning') ? '#e5534b' : (i % 2 ? '#f5f0dc' : '#e5534b'));
  box(g, rect, 0.37, 0.52, 0.26, 0.05, '#ffcf5c');
  circle(g, rect, 0.42, 0.635, 0.026, '#fb8c00'); circle(g, rect, 0.50, 0.635, 0.026, '#fb8c00'); circle(g, rect, 0.58, 0.635, 0.026, '#fb8c00');
  // Baker sign: wheat sheaf on the left, pretzel ring on the right.
  circle(g, rect, 0.64, 0.50, 0.045, '#f5f0dc');
  if (diffs.has('sign')) {
    g.strokeStyle = '#8a5a2b'; g.lineWidth = pw(rect, 0.010);
    g.beginPath(); g.arc(px(rect, 0.64), py(rect, 0.50), pw(rect, 0.024), 0, Math.PI * 2); g.stroke();
  } else {
    line(g, rect, 0.64, 0.535, 0.64, 0.47, '#8a5a2b', 0.007);
    line(g, rect, 0.64, 0.50, 0.622, 0.475, '#c9973f', 0.006);
    line(g, rect, 0.64, 0.50, 0.658, 0.475, '#c9973f', 0.006);
  }
  // Left fruit stall: the melon pile is stacked differently.
  box(g, rect, 0.04, 0.62, 0.24, 0.10, '#795548');
  ellipse(g, rect, 0.09, 0.60, 0.032, 0.026, '#43a047'); ellipse(g, rect, 0.16, 0.60, 0.032, 0.026, '#43a047'); ellipse(g, rect, 0.23, 0.60, 0.032, 0.026, '#43a047');
  ellipse(g, rect, 0.125, 0.545, 0.032, 0.026, '#66bb6a');
  if (!diffs.has('melons')) ellipse(g, rect, 0.195, 0.545, 0.032, 0.026, '#66bb6a');
  if (!diffs.has('melons')) ellipse(g, rect, 0.16, 0.49, 0.032, 0.026, '#81c784');
  // Right crates, with a cat that only visits the right panel.
  box(g, rect, 0.72, 0.66, 0.22, 0.09, '#8d6e63');
  box(g, rect, 0.75, 0.57, 0.16, 0.09, '#a1887f');
  if (diffs.has('cat')) {
    ellipse(g, rect, 0.78, 0.535, 0.042, 0.030, '#37474f');
    circle(g, rect, 0.815, 0.505, 0.023, '#37474f');
    tri(g, rect, 0.80, 0.492, 0.797, 0.462, 0.812, 0.482, '#37474f');
    tri(g, rect, 0.822, 0.482, 0.838, 0.462, 0.836, 0.492, '#37474f');
    circle(g, rect, 0.808, 0.502, 0.004, '#ffcf5c');
    circle(g, rect, 0.822, 0.502, 0.004, '#ffcf5c');
    line(g, rect, 0.742, 0.55, 0.715, 0.525, '#37474f', 0.010);
  }
  // Balloons by the arch: four on the left, three on the right.
  line(g, rect, 0.90, 0.44, 0.90, 0.72, '#d7ccc8', 0.004);
  circle(g, rect, 0.865, 0.30, 0.026, '#e5534b');
  circle(g, rect, 0.90, 0.255, 0.026, '#ffcf5c');
  circle(g, rect, 0.935, 0.31, 0.026, '#7cc7ff');
  if (!diffs.has('balloons')) circle(g, rect, 0.90, 0.36, 0.026, '#52e0a4');
}

function paintReef(g, rect, diffs) {
  skyGradient(g, rect, '#0b3d66', '#1b7f8e');
  box(g, rect, 0, 0.86, 1, 0.14, '#d9c48a');
  for (let i = 0; i < 3; i += 1) tri(g, rect, 0.12 + i * 0.3, 0, 0.20 + i * 0.3, 0.30, 0.24 + i * 0.3, 0, 'rgba(255,255,255,0.07)');
  if (!diffs.has('ray')) {
    tri(g, rect, 0.52, 0.10, 0.405, 0.16, 0.475, 0.135, '#16324a');
    tri(g, rect, 0.52, 0.10, 0.635, 0.16, 0.565, 0.135, '#16324a');
    ellipse(g, rect, 0.52, 0.12, 0.048, 0.028, '#1d4258');
    circle(g, rect, 0.505, 0.112, 0.005, '#dbe4ff');
    circle(g, rect, 0.535, 0.112, 0.005, '#dbe4ff');
    line(g, rect, 0.52, 0.145, 0.535, 0.21, '#16324a', 0.004);
  }
  // Turtle with a patterned shell.
  ellipse(g, rect, 0.30, 0.32, 0.085, 0.055, '#43a047');
  circle(g, rect, 0.215, 0.30, 0.022, '#66bb6a');
  ellipse(g, rect, 0.30, 0.315, 0.055, 0.036, '#2e7d32');
  circle(g, rect, 0.275, 0.30, 0.012, '#a5d6a7'); circle(g, rect, 0.325, 0.325, 0.012, '#a5d6a7');
  if (!diffs.has('turtle-spot')) circle(g, rect, 0.30, 0.275, 0.012, '#a5d6a7');
  // Fish school; one fish changes its stripe.
  const fish = [[0.16, 0.52, '#ff9f68'], [0.24, 0.46, '#ffd54f'], [0.10, 0.42, '#4fc3f7']];
  for (const [u, v, col] of fish) {
    ellipse(g, rect, u, v, 0.038, 0.020, col);
    tri(g, rect, u + 0.035, v, u + 0.065, v - 0.02, u + 0.065, v + 0.02, col);
  }
  box(g, rect, 0.148, 0.505, 0.010, 0.032, diffs.has('fish-stripe') ? '#e91e63' : '#fff176');
  // Bubbles rising in the middle: five on the left, three on the right.
  const bubbles = [[0.62, 0.40, 0.010], [0.635, 0.33, 0.013], [0.615, 0.26, 0.009]];
  for (const [u, v, r] of bubbles) { g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.5; g.beginPath(); g.arc(px(rect, u), py(rect, v), pw(rect, r), 0, Math.PI * 2); g.stroke(); }
  if (!diffs.has('bubbles')) { circle(g, rect, 0.625, 0.185, 0.011, 'rgba(255,255,255,0.5)'); circle(g, rect, 0.61, 0.115, 0.008, 'rgba(255,255,255,0.5)'); }
  // Seahorse facing left, or right when the difference is applied.
  const dir = diffs.has('seahorse') ? -1 : 1;
  ellipse(g, rect, 0.88, 0.505, 0.024, 0.048, '#ffb74d');
  circle(g, rect, 0.88 + dir * 0.020, 0.448, 0.018, '#ffb74d');
  tri(g, rect, 0.88 + dir * 0.032, 0.44, 0.88 + dir * 0.055, 0.452, 0.88 + dir * 0.032, 0.462, '#ff9800');
  tri(g, rect, 0.88 - dir * 0.018, 0.485, 0.88 - dir * 0.042, 0.465, 0.88 - dir * 0.036, 0.50, '#ff9800');
  g.strokeStyle = '#ff9800'; g.lineWidth = pw(rect, 0.009);
  g.beginPath(); g.arc(px(rect, 0.88 - dir * 0.004), py(rect, 0.575), pw(rect, 0.016), 0, Math.PI * 1.6); g.stroke();
  circle(g, rect, 0.88 + dir * 0.024, 0.444, 0.004, '#263238');
  // Open shell: empty on the left, holding a pearl on the right.
  g.fillStyle = '#ce93d8';
  g.beginPath(); g.ellipse(px(rect, 0.48), py(rect, 0.80), pw(rect, 0.055), ph(rect, 0.035), -0.5, Math.PI, Math.PI * 2); g.fill();
  ellipse(g, rect, 0.48, 0.845, 0.058, 0.022, '#ba68c8');
  line(g, rect, 0.445, 0.838, 0.46, 0.79, '#e1bee7', 0.005);
  line(g, rect, 0.48, 0.84, 0.485, 0.782, '#e1bee7', 0.005);
  line(g, rect, 0.515, 0.838, 0.505, 0.79, '#e1bee7', 0.005);
  if (diffs.has('pearl')) circle(g, rect, 0.48, 0.815, 0.016, '#fff8e1');
  if (!diffs.has('starfish')) star(g, rect, 0.80, 0.80, 0.034, '#ff8a65');
  star(g, rect, 0.64, 0.88, 0.026, '#ffb74d');
  // Coral at the left edge changes colour; seaweed everywhere.
  const coralCol = diffs.has('coral') ? '#7e57c2' : '#ef5350';
  line(g, rect, 0.09, 0.88, 0.09, 0.74, coralCol, 0.012);
  line(g, rect, 0.09, 0.80, 0.055, 0.72, coralCol, 0.010);
  line(g, rect, 0.09, 0.82, 0.125, 0.74, coralCol, 0.010);
  for (const u of [0.20, 0.70, 0.94]) line(g, rect, u, 0.90, u + 0.015, 0.76, '#26a69a', 0.009);
  ellipse(g, rect, 0.94, 0.82, 0.035, 0.05, '#ff7043');
}

function paintObservatory(g, rect, diffs) {
  skyGradient(g, rect, '#101736', '#33406e');
  const stars = [[0.06, 0.30], [0.55, 0.08], [0.68, 0.18], [0.82, 0.06], [0.94, 0.26], [0.44, 0.14]];
  for (const [u, v] of stars) star(g, rect, u, v, 0.011, '#dbe4ff');
  // Constellation: a chain of stars, one link missing on the right.
  const chain = [[0.26, 0.30], [0.30, 0.26], [0.38, 0.20], [0.42, 0.26]];
  for (let i = 0; i + 1 < chain.length; i += 1) line(g, rect, chain[i][0], chain[i][1], chain[i + 1][0], chain[i + 1][1], 'rgba(219,228,255,0.5)', 0.003);
  for (const [u, v] of chain) { if (diffs.has('constellation') && u === 0.34) continue; star(g, rect, u, v, 0.013, '#ffffff'); }
  if (!diffs.has('constellation')) star(g, rect, 0.34, 0.24, 0.013, '#ffffff');
  if (diffs.has('comet')) {
    circle(g, rect, 0.18, 0.14, 0.014, '#ffffff');
    line(g, rect, 0.18, 0.14, 0.10, 0.20, 'rgba(255,255,255,0.7)', 0.006);
    line(g, rect, 0.18, 0.14, 0.115, 0.225, 'rgba(255,255,255,0.4)', 0.005);
  }
  circle(g, rect, 0.92, 0.12, 0.032, '#f7e3ac');
  // Hill and grass.
  tri(g, rect, 0, 1, 0.30, 0.62, 0.72, 1, '#1d3325');
  box(g, rect, 0.62, 0.72, 0.38, 0.28, '#24402d');
  // Observatory: dome, band, base and its star-chart window.
  box(g, rect, 0.38, 0.44, 0.28, 0.24, '#cfd8dc');
  box(g, rect, 0.38, 0.415, 0.28, 0.028, diffs.has('dome') ? '#c97b4a' : '#7cc7ff');
  g.fillStyle = '#eceff1';
  g.beginPath(); g.arc(px(rect, 0.52), py(rect, 0.42), pw(rect, 0.14), Math.PI, 0); g.fill();
  box(g, rect, 0.505, 0.285, 0.030, 0.13, '#263238');
  // Telescope poking from the dome, tilted differently on the right.
  if (diffs.has('telescope')) line(g, rect, 0.56, 0.33, 0.72, 0.235, '#90a4ae', 0.020);
  else line(g, rect, 0.56, 0.33, 0.70, 0.44, '#90a4ae', 0.020);
  circle(g, rect, 0.70, 0.48, 0.001, '#90a4ae');
  box(g, rect, 0.415, 0.565, 0.055, 0.07, '#263238');
  if (diffs.has('chart')) circle(g, rect, 0.442, 0.60, 0.014, '#ffcf5c');
  else tri(g, rect, 0.442, 0.575, 0.425, 0.615, 0.46, 0.615, '#ffcf5c');
  box(g, rect, 0.545, 0.56, 0.045, 0.12, '#546e7a');
  // Hut with a flag on the left slope.
  box(g, rect, 0.06, 0.56, 0.13, 0.12, '#6d4c41');
  tri(g, rect, 0.125, 0.50, 0.04, 0.565, 0.21, 0.565, '#4e342e');
  line(g, rect, 0.10, 0.565, 0.10, 0.475, '#d7ccc8', 0.005);
  tri(g, rect, 0.10, 0.475, 0.10, 0.505, 0.145, 0.49, diffs.has('flag') ? '#26a69a' : '#e5534b');
  box(g, rect, 0.095, 0.60, 0.04, 0.04, '#ffd76a');
  // Satellite dish on the right: its receiver arm is gone on the right.
  line(g, rect, 0.88, 0.78, 0.88, 0.64, '#90a4ae', 0.008);
  g.fillStyle = '#eceff1';
  g.beginPath(); g.arc(px(rect, 0.88), py(rect, 0.62), pw(rect, 0.045), Math.PI * 0.15, Math.PI * 1.15); g.fill();
  if (!diffs.has('dish')) { line(g, rect, 0.88, 0.62, 0.905, 0.585, '#eceff1', 0.006); circle(g, rect, 0.907, 0.583, 0.008, '#ffcf5c'); }
  // Fireflies over the grass: six on the left, four on the right.
  const flies = [[0.72, 0.80], [0.82, 0.88], [0.90, 0.82]];
  for (const [u, v] of flies) circle(g, rect, u, v, 0.007, '#e6ee9c');
  circle(g, rect, 0.78, 0.84, 0.007, '#e6ee9c');
  if (!diffs.has('fireflies')) { circle(g, rect, 0.75, 0.90, 0.007, '#e6ee9c'); circle(g, rect, 0.86, 0.76, 0.007, '#e6ee9c'); }
}

const PAINTERS = {
  harbour: paintHarbour,
  cabin: paintCabin,
  market: paintMarket,
  reef: paintReef,
  observatory: paintObservatory,
};

/** Draw one panel: clip to its rounded frame, paint the scene, restore. */
export function paintPanel(g, rect, scene, appliedDiffs) {
  g.save();
  g.beginPath();
  g.roundRect(rect.x, rect.y, rect.width, rect.height, 14);
  g.clip();
  PAINTERS[scene.theme](g, rect, appliedDiffs);
  g.restore();
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 2;
  g.beginPath();
  g.roundRect(rect.x, rect.y, rect.width, rect.height, 14);
  g.stroke();
}

/** Ring every found difference, on both panels, with a satisfying double ring and tick. */
export function paintFoundMarkers(g, rect, scene, foundIds, pulse) {
  for (const diff of scene.differences) {
    if (!foundIds.has(diff.id)) continue;
    const cx = px(rect, diff.x); const cy = py(rect, diff.y);
    const r = pw(rect, diff.r) * (1 + 0.06 * Math.sin(pulse));
    g.strokeStyle = '#52e0a4'; g.lineWidth = 5;
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, cy, r + 5, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#123524'; g.lineWidth = 4; g.lineCap = 'round';
    g.beginPath();
    g.moveTo(cx - r * 0.38, cy + r * 0.02);
    g.lineTo(cx - r * 0.10, cy + r * 0.32);
    g.lineTo(cx + r * 0.42, cy - r * 0.30);
    g.stroke();
  }
}

/** A soft pulsing ring around the neighbourhood a hint points at. */
export function paintHintRing(g, rect, diff, phase) {
  const cx = px(rect, diff.x); const cy = py(rect, diff.y);
  const r = pw(rect, diff.r) * (1.55 + 0.18 * Math.sin(phase));
  g.strokeStyle = 'rgba(124,199,255,0.85)'; g.lineWidth = 3; g.setLineDash([10, 8]);
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
  g.setLineDash([]);
}

/** A short-lived red cross where a click found nothing. */
export function paintWrongMark(g, rect, mark) {
  const cx = px(rect, mark.x); const cy = py(rect, mark.y);
  const s = pw(rect, 0.028) * mark.life;
  g.strokeStyle = 'rgba(255,107,107,0.95)'; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - s, cy - s); g.lineTo(cx + s, cy + s);
  g.moveTo(cx + s, cy - s); g.lineTo(cx - s, cy + s);
  g.stroke();
}
