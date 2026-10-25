// boardview.js — the "แบบกระดาน" look for the graph lessons (7.1, 7.3), drawn with Scene3D primitives only.
// Same 24 points and graph as graph.js. Two layouts in one canvas: board (cubes on a checkered floor, like the
// Weaviate clip) and real (true 3D positions). Switching slides the cubes and the camera together (owner,
// 2026-10-25 02:18: camera moves both ways, no cut at the end).
import { P } from "./graph.js";

const S = 4, CELL = 0.44, CELLS = 10;
export const H = 0.11;                                     // half the size of a cube
export const COL = {
  fresh: "#2f81f7", seen: "#8fa6c4", keep: "#3fb950", best: "#e3b341", q: "#db61a2", truth: "#f0f6fc",
  group: ["#f0883e", "#3fb950", "#a371f7"], floorA: "#1a212b", floorB: "#161c25", floorLine: "#2a3441",
  edge: "#35558a", edgeSeen: "#4a5462",
};

// ---- layouts ----
const real = (v) => [v[0] * S, v[1] * S, v[2] * S];       // x = food, y = animal (up), z = tech: the up() of graph.js
const CORNER = { a: [1.6, 1.6], f: [9.0, 4.4], t: [4.4, 9.0] }; // board cells: animal back, food right, tech left
const bary = (v) => {
  const s = v[0] + v[1] + v[2] || 1, f = v[0] / s, a = v[1] / s, t = v[2] / s;
  return [f * CORNER.f[0] + a * CORNER.a[0] + t * CORNER.t[0], f * CORNER.f[1] + a * CORNER.a[1] + t * CORNER.t[1]];
};
const CENT = [0, 1, 2].map((g) => {
  const ps = P.slice(g * 8, g * 8 + 8).map(bary);
  return [ps.reduce((s, p) => s + p[0], 0) / 8, ps.reduce((s, p) => s + p[1], 0) / 8];
});
const ZOOM = 1.7;                                          // spread each group around its centre so cubes do not overlap
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
function boardCell(v) {
  const b = bary(v), g = [0, 1, 2].reduce((m, k) => (d2(b, CENT[k]) < d2(b, CENT[m]) ? k : m), 0);
  return [CENT[g][0] + ZOOM * (b[0] - CENT[g][0]), CENT[g][1] + ZOOM * (b[1] - CENT[g][1])];
}
const board = (v) => { const c = boardCell(v); return [c[0] * CELL, H, c[1] * CELL]; };
const lerp = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);

export const VIEW = {
  board: { yaw: 0.785, pitch: 0.62, dist: 6.2, target: [2.2, 0.1, 2.2] },
  real: { yaw: 0.75, pitch: 0.42, dist: 12.5, target: [1.6, 1.4, 1.6] },
};

// ---- drawing helpers ----
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function quad(s, pts, fill, layer, stroke = null, lw = 1) {   // filled + outlined, depth-sorted like every Scene3D item
  const ps = pts.map((p) => s.project(p));
  if (ps.some((p) => !p)) return;
  s.add(layer, ps.reduce((a, p) => a + p.z, 0) / ps.length, (g) => {
    g.save(); g.beginPath(); ps.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath();
    g.fillStyle = fill; g.fill();
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
    g.restore();
  });
}
const FACES = [
  [[0, 1, 0], [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]]], [[0, -1, 0], [[-1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, -1, -1]]],
  [[1, 0, 0], [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]]], [[-1, 0, 0], [[-1, -1, -1], [-1, 1, -1], [-1, 1, 1], [-1, -1, 1]]],
  [[0, 0, 1], [[-1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, 1]]], [[0, 0, -1], [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]]],
];
const LIGHT = [0.3, 0.45];
export function cube(s, c, h, color, stripe = null) {
  for (const [n, corners] of FACES) {
    const e = s.B.eye, fc = c.map((x, i) => x + n[i] * h);
    if (n[0] * (e[0] - fc[0]) + n[1] * (e[1] - fc[1]) + n[2] * (e[2] - fc[2]) <= 0) continue;   // back face
    const lit = n[1] > 0 ? 1 : 0.5 + 0.35 * Math.max(0, n[0] * LIGHT[0] + n[2] * LIGHT[1]);
    quad(s, corners.map((k) => c.map((x, i) => x + k[i] * h)), shade(color, lit), 1, "rgba(0,0,0,0.35)", 1);
  }
  if (stripe) {                                            // group mark on the top face
    const y = c[1] + h + 0.004, w = h * 0.45, l = h * 0.12;
    quad(s, [[c[0] - w, y, c[2] - l], [c[0] + w, y, c[2] - l], [c[0] + w, y, c[2] + l], [c[0] - w, y, c[2] + l]], stripe, 1.01);
  }
  if (s.anchors) s.anchors.push({ p: c, r: 12 });
}
export function tag(s, p3, text, color, dx, dy) {           // boxed label with a leader line
  const p = s.project(p3);
  if (!p) return;
  const font = `600 12px ${getComputedStyle(s.cv).fontFamily}`;
  s.g.font = font;
  const w = s.g.measureText(text).width + 12, h = 20;
  if (s.anchors) s.anchors.push({ p: p3, dx, w, dy, h: h / 2 });
  s.add(3, p.z, (g) => {
    g.save(); g.font = font;
    const x = Math.max(4, Math.min(s.W - w - 4, p.x + dx)), y = Math.max(4, Math.min(s.H - h - 4, p.y + dy - h / 2));
    g.strokeStyle = color; g.globalAlpha = 0.7; g.lineWidth = 1;
    g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(x + (dx < 0 ? w : 0), y + h / 2); g.stroke(); g.globalAlpha = 1;
    g.fillStyle = "rgba(13,17,23,0.92)"; g.fillRect(x, y, w, h); g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    g.fillStyle = color; g.textBaseline = "middle"; g.fillText(text, x + 6, y + h / 2 + 1);
    g.restore();
  });
}

// ---- the board view: one object per lesson ----
// state(): { r: step state from graph.js, b: index of the true nearest, q, start? }; it owns the layout mix and the camera
export function makeBoard() {
  const v = { mix: 1, goal: 1, scene: null, moving: 0 };
  v.pos = (p) => lerp(real(p), board(p), v.mix);
  v.aim = (s) => { v.scene = s; };                         // draw() hands over the scene the first time it runs
  // where the camera ends up for a layout, fitted BEFORE the move so it glides there without a jump at the end
  function camFor(goal) {
    const s = v.scene, save = { ...s.cam, target: [...s.cam.target] }, mix = v.mix, w = goal ? VIEW.board : VIEW.real;
    v.mix = goal;
    Object.assign(s.cam, { yaw: w.yaw, pitch: w.pitch, dist: w.dist, target: [...w.target] });
    Object.assign(s.home, { yaw: w.yaw, pitch: w.pitch, dist: w.dist });
    s.baseDist = w.dist;
    s.fit();
    const end = { yaw: s.cam.yaw, pitch: s.cam.pitch, dist: s.cam.dist, target: [...s.cam.target] };
    Object.assign(s.cam, save); v.mix = mix;
    return end;
  }
  v.morph = (goal) => {                                    // cubes and camera move together, both ways
    const s = v.scene;
    if (!s || goal === v.goal) return;
    v.goal = goal;
    const from = v.mix, c0 = { ...s.cam, target: [...s.cam.target] }, c1 = camFor(goal);
    let dy = (c1.yaw - c0.yaw) % (2 * Math.PI);
    if (dy > Math.PI) dy -= 2 * Math.PI;
    if (dy < -Math.PI) dy += 2 * Math.PI;                  // turn the short way round
    const t0 = performance.now(), id = ++v.moving, T = 900, draw = s.draw;
    const tick = (t) => {
      if (id !== v.moving || s.draw !== draw) return;      // a newer click, or the learner left the lesson
      const k = Math.min(1, (t - t0) / T), e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      v.mix = from + (goal - from) * e;
      s.cam.yaw = c0.yaw + dy * e;
      s.cam.pitch = c0.pitch + (c1.pitch - c0.pitch) * e;
      s.cam.dist = c0.dist + (c1.dist - c0.dist) * e;
      s.cam.target = c0.target.map((x, i) => x + (c1.target[i] - x) * e);
      s.fitPending = false; s.atHome = k >= 1;
      s.render();
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  // the two layout buttons in the canvas corner (same place as ui.corner)
  v.switch = () => {
    const box = document.createElement("span");
    box.className = "ctool-seg";
    const make = (text, goal) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ctool"; b.textContent = text;
      b.addEventListener("click", () => { v.morph(goal); sync(); });
      box.append(b);
      return b;
    };
    const bb = make("แบบกระดาน", 1), br = make("ตำแหน่งจริง 3 มิติ", 0);
    const sync = () => { bb.setAttribute("aria-pressed", String(v.goal === 1)); br.setAttribute("aria-pressed", String(v.goal === 0)); };
    sync();
    document.querySelector("#ctools")?.append(box);
  };
  // draw one step state
  v.draw = (s, { r, b, q, nb, start = -1 }) => {
    v.aim(s);
    const keep = new Set(r.keep), hot = new Set(r.hot), pe = new Set();
    for (let k = 1; k < r.path.length; k++) { pe.add(r.path[k - 1] + "-" + r.path[k]); pe.add(r.path[k] + "-" + r.path[k - 1]); }
    for (let i = 0; i < CELLS; i++) for (let j = 0; j < CELLS; j++) {
      const x = i * CELL, z = j * CELL;
      quad(s, [[x, 0, z], [x + CELL, 0, z], [x + CELL, 0, z + CELL], [x, 0, z + CELL]], (i + j) % 2 ? COL.floorA : COL.floorB, 0, COL.floorLine, 0.6);
    }
    if (v.mix < 0.5) s.axes(4.6);
    else {
      const lab = { a: ["animal", COL.group[1], -30, -30], f: ["food", COL.group[0], 10, 14], t: ["tech", COL.group[2], -44, 14] };
      for (const k of ["a", "f", "t"]) s.label([CORNER[k][0] * CELL, 0, CORNER[k][1] * CELL], lab[k][0], lab[k][1], { dx: lab[k][2], dy: lab[k][3], size: 13, weight: 700 });
    }
    nb.forEach((list, i) => list.forEach((j) => {
      if (j <= i) return;
      const onPath = pe.has(i + "-" + j), isHot = (i === r.from && hot.has(j)) || (j === r.from && hot.has(i));
      const both = r.seen.has(i) && r.seen.has(j);
      s.line(v.pos(P[i]), v.pos(P[j]), onPath || isHot ? COL.best : both ? COL.edgeSeen : COL.edge,
        { width: onPath ? 4 : isHot ? 2.5 : 1.6, dash: isHot && !onPath ? [5, 4] : null, layer: 0.8 });
    }));
    if (r.done) {
      const w = v.pos(P[b]);
      s.polyline(Array.from({ length: 33 }, (_, k) => [w[0] + 0.38 * Math.cos(k / 16 * Math.PI), 0.005, w[2] + 0.38 * Math.sin(k / 16 * Math.PI)]), COL.truth, { width: 2.6, layer: 0.6 });
    }
    P.forEach((p, i) => {
      const w = v.pos(p);
      if (v.mix < 0.999) s.line(w, [w[0], 0, w[2]], "#93a0b5", { width: 1, dash: [2, 3], alpha: 0.5 * (1 - v.mix), layer: 0.7 });
      const col = i === r.cur ? COL.best : keep.has(i) ? COL.keep : r.seen.has(i) ? COL.seen : COL.fresh;
      const h = i === r.cur ? H * 1.15 : keep.has(i) ? H * 1.05 : H * 0.92;
      cube(s, [w[0], w[1] + (h - H) * v.mix, w[2]], h, col, COL.group[Math.floor(i / 8)]);
    });
    const qw = v.pos(q);
    if (v.mix < 0.999) s.line(qw, [qw[0], 0, qw[2]], COL.q, { width: 1, dash: [2, 3], alpha: 0.6 * (1 - v.mix), layer: 0.7 });
    cube(s, qw, H * 1.05, COL.q);
    return { qw };
  };
  return v;
}
