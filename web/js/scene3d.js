// scene3d.js — a tiny 3D renderer on Canvas 2D. No libraries.
// World: x right, y up, z toward the viewer. Drag = orbit, wheel = zoom,
// double-click = reset, arrow keys = orbit when the canvas has focus.
//
// Usage:
//   const s = new Scene3D(canvas);
//   s.draw = (s) => { s.grid(); s.axes(); s.arrow([0,0,0], [3,4,0], s.c.ink, "v"); };
//   s.render();

const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit3 = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };

const HOME = { yaw: 0.6, pitch: 0.42, dist: 12 };

export class Scene3D {
  constructor(canvas) {
    this.cv = canvas;
    this.g = canvas.getContext("2d");
    this.cam = { ...HOME, target: [0, 0, 0] };
    this.home = { ...HOME };
    this.draw = () => {};
    this.overlay = null;
    // flat = { zoom, x, y }: a 2D lesson that asked for zoom (owner, 2026-10-11 15:45: "ทำ Zoom ดีกว่าขึ้นบรรทัดใหม่").
    // Then wheel / pinch / + − zoom, drag / arrows move, double-click / 0 show everything; the camera is left alone.
    this.flat = null;
    this.axisNames = ["x", "y", "z"];
    this.items = [];
    // fit (owner, 2026-10-11 21:36: "ปรับให้ระยะมันอยู่ใน canvas เป็น Default"): the start view moves the camera back until every
    // arrow, point and label of the lesson is inside the canvas. Only the start view: once the learner orbits or zooms, the
    // camera is theirs; double-click / 0 / a resize while untouched fits again.
    this.anchors = null;
    this.fitPending = false;
    this.atHome = true;
    this.readColors();
    this.bindInput();
    new ResizeObserver(() => { if (this.atHome && !this.flat) this.fitPending = true; this.render(); }).observe(canvas);
  }

  // colors come from CSS variables (web/css/style.css, dark theme only)
  readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    this.c = {
      x: v("--x"), y: v("--y"), z: v("--z"),
      ink: v("--ink"), a: v("--va"), b: v("--vb"), r: v("--vr"),
      grid: v("--grid"), muted: v("--muted"), bg: v("--canvas"), halo: v("--canvas"),
    };
  }

  setView({ yaw, pitch, dist }) {
    Object.assign(this.home, { yaw: yaw ?? HOME.yaw, pitch: pitch ?? HOME.pitch, dist: dist ?? HOME.dist });
    this.baseDist = this.home.dist;                         // the lesson's own distance: fitting only ever moves back from it
    Object.assign(this.cam, this.home);
    this.fitPending = true; this.atHome = true;
  }

  // how many pixels the farthest anchor sticks out past the canvas edge minus a margin (≤ 0 = everything fits)
  overflow() {
    const M = 14;
    let out = -Infinity;
    for (const a of this.anchors) {
      const q = this.project(a.p);
      if (!q) return Infinity;
      const x0 = q.x + (a.dx || 0) - (a.r || 0), x1 = q.x + (a.dx || 0) + (a.w || 0) + (a.r || 0);
      const y0 = q.y + (a.dy || 0) - (a.h || 0), y1 = q.y + (a.dy || 0) + (a.h || 0);
      out = Math.max(out, M - x0, x1 - (this.W - M), M - y0, y1 - (this.H - M));
    }
    return out;
  }

  // move the camera back (same angle, same target) until the lesson's picture fits; never closer than the lesson asked for
  fit() {
    this.fitPending = false;
    this.anchors = [];
    this.cam.dist = this.home.dist = this.baseDist ?? this.home.dist;
    this.B = this.basis();
    this.items = [];
    this.draw(this);                                         // a dry run that only collects anchors
    if (this.anchors.length) {
      while (this.cam.dist < 60 && this.overflow() > 0) { this.cam.dist *= 1.04; this.B = this.basis(); }
      this.home.dist = this.cam.dist;
    }
    this.anchors = null;
  }

  // ---------- camera ----------
  basis() {
    const { yaw, pitch, dist, target } = this.cam;
    const eye = [
      target[0] + dist * Math.cos(pitch) * Math.sin(yaw),
      target[1] + dist * Math.sin(pitch),
      target[2] + dist * Math.cos(pitch) * Math.cos(yaw),
    ];
    const fwd = unit3(sub3(target, eye));
    const right = unit3(cross3(fwd, [0, 1, 0]));
    const up = cross3(right, fwd);
    return { eye, fwd, right, up };
  }

  // world point -> { x, y, z(depth) } in CSS pixels, or null if behind camera
  project(p) {
    const rel = sub3(p, this.B.eye);
    const z = dot3(rel, this.B.fwd);
    if (z < 0.099) return null;
    return { x: this.W / 2 + (this.F * dot3(rel, this.B.right)) / z, y: this.H / 2 - (this.F * dot3(rel, this.B.up)) / z, z };
  }

  // ---------- frame ----------
  render() {
    const dpr = window.devicePixelRatio || 1;
    const r = this.cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (this.cv.width !== Math.round(r.width * dpr) || this.cv.height !== Math.round(r.height * dpr)) {
      this.cv.width = Math.round(r.width * dpr);
      this.cv.height = Math.round(r.height * dpr);
    }
    this.W = r.width; this.H = r.height;
    this.F = Math.min(this.W, this.H) * 1.25;
    if (this.fitPending && !this.flat) this.fit();
    this.B = this.basis();
    this.items = [];
    this.draw(this);

    const g = this.g;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, this.W, this.H);
    // layer first (grid < shapes < labels), then far-to-near inside a layer
    this.items.sort((a, b) => a.layer - b.layer || b.z - a.z);
    for (const it of this.items) it.paint(g);
    // optional flat 2D drawing on top (lessons that need a chart, not a 3D scene)
    if (this.overlay) { g.save(); this.overlay(g, this.W, this.H, this.c, this.flat); g.restore(); }
  }

  add(layer, z, paint) { this.items.push({ layer, z, paint }); }

  // ---------- primitives ----------
  line(a, b, color, { width = 1.5, dash = null, layer = 1, alpha = 1 } = {}) {
    // clip at the near plane so lines don't vanish when zoomed in close
    const NEAR = 0.1;
    const za = dot3(sub3(a, this.B.eye), this.B.fwd), zb = dot3(sub3(b, this.B.eye), this.B.fwd);
    if (za < NEAR && zb < NEAR) return;
    const cut = (from, to, zf, zt) => from.map((x, i) => x + (to[i] - x) * ((NEAR - zf) / (zt - zf)));
    if (za < NEAR) a = cut(a, b, za, zb);
    if (zb < NEAR) b = cut(b, a, zb, za);
    const p = this.project(a), q = this.project(b);
    if (!p || !q) return;
    this.add(layer, (p.z + q.z) / 2, (g) => {
      g.save();
      g.globalAlpha = alpha; g.strokeStyle = color; g.lineWidth = width; g.lineCap = "round";
      if (dash) g.setLineDash(dash);
      g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke();
      g.restore();
    });
  }

  polyline(pts, color, opts = {}) {
    for (let i = 1; i < pts.length; i++) this.line(pts[i - 1], pts[i], color, opts);
  }

  arrow(from, to, color, label = "", { width = 3, layer = 1 } = {}) {
    if (this.anchors) this.anchors.push({ p: from, r: 4 }, { p: to, r: 8 });
    const p = this.project(from), q = this.project(to);
    if (!p || !q) return;
    const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy);
    this.add(layer, (p.z + q.z) / 2 - 0.01, (g) => {
      g.save();
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = width; g.lineCap = "round";
      const head = Math.min(14, len * 0.45);
      const ux = len ? dx / len : 0, uy = len ? dy / len : 0;
      g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x - ux * head * 0.7, q.y - uy * head * 0.7); g.stroke();
      if (len > 1) {
        g.beginPath();
        g.moveTo(q.x, q.y);
        g.lineTo(q.x - ux * head - uy * head * 0.45, q.y - uy * head + ux * head * 0.45);
        g.lineTo(q.x - ux * head + uy * head * 0.45, q.y - uy * head - ux * head * 0.45);
        g.closePath(); g.fill();
      }
      g.restore();
    });
    if (label) this.label(to, label, color, { dx: 8, dy: -8 });
  }

  point(p3, color, label = "", { r = 5, ring = false, layer = 1 } = {}) {
    if (this.anchors) this.anchors.push({ p: p3, r: r + 2 });
    const p = this.project(p3);
    if (!p) return;
    this.add(layer, p.z - 0.02, (g) => {
      g.save();
      g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2);
      if (ring) { g.lineWidth = 2.5; g.strokeStyle = color; g.fillStyle = this.c.bg; g.fill(); g.stroke(); }
      else { g.fillStyle = color; g.fill(); g.lineWidth = 1.5; g.strokeStyle = this.c.bg; g.stroke(); }
      g.restore();
    });
    if (label) this.label(p3, label, color, { dx: r + 4, dy: -r - 2 });
  }

  label(p3, text, color, { dx = 0, dy = 0, size = 13, weight = 600, align = "left", fit = true } = {}) {
    if (this.anchors && fit && text) {
      this.g.font = `${weight} ${size}px ${getComputedStyle(this.cv).fontFamily}`;
      const w = this.g.measureText(text).width;
      this.anchors.push({ p: p3, dx: align === "center" ? dx - w / 2 : align === "right" ? dx - w : dx, w, dy, h: size / 2 + 2 });
    }
    const p = this.project(p3);
    if (!p) return;
    this.add(3, p.z, (g) => {
      g.save();
      g.font = `${weight} ${size}px ${getComputedStyle(this.cv).fontFamily}`;
      g.textAlign = align; g.textBaseline = "middle";
      g.lineJoin = "round"; g.lineWidth = 4; g.strokeStyle = this.c.halo;
      g.strokeText(text, p.x + dx, p.y + dy);
      g.fillStyle = color; g.fillText(text, p.x + dx, p.y + dy);
      g.restore();
    });
  }

  polygon(pts, color, alpha = 0.15, layer = 0.5) {
    const ps = pts.map((p) => this.project(p));
    if (ps.some((p) => !p)) return;
    const z = ps.reduce((s, p) => s + p.z, 0) / ps.length;
    this.add(layer, z, (g) => {
      g.save(); g.globalAlpha = alpha; g.fillStyle = color;
      g.beginPath(); ps.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); g.fill();
      g.restore();
    });
  }

  // ---------- helpers built from primitives ----------
  grid(n = 5) {
    for (let i = -n; i <= n; i++) {
      if (i === 0) continue; // the axes are drawn there
      this.line([i, 0, -n], [i, 0, n], this.c.grid, { width: 1, layer: 0 });
      this.line([-n, 0, i], [n, 0, i], this.c.grid, { width: 1, layer: 0 });
    }
  }

  axes(L = 5.5) {
    const cols = [this.c.x, this.c.y, this.c.z];
    for (let k = 0; k < 3; k++) {
      const pos = [0, 0, 0], neg = [0, 0, 0];
      pos[k] = L; neg[k] = -L;
      this.line([0, 0, 0], pos, cols[k], { width: 2, layer: 0.2 });
      this.line([0, 0, 0], neg, cols[k], { width: 1.2, dash: [4, 5], layer: 0.2, alpha: 0.6 });
      this.label(pos, this.axisNames[k], cols[k], { dx: 6, size: 13, weight: 700, fit: false });   // axis names may run off
    }
  }

  // wire sphere of radius r (lat/long circles)
  sphere(r = 1, color = this.c.grid, n = 24) {
    const ring = (f) => Array.from({ length: n + 1 }, (_, i) => f((i / n) * Math.PI * 2));
    for (const lat of [-60, -30, 0, 30, 60]) {
      const a = (lat * Math.PI) / 180, y = r * Math.sin(a), rr = r * Math.cos(a);
      this.polyline(ring((t) => [rr * Math.cos(t), y, rr * Math.sin(t)]), color, { width: 1, layer: 0.1 });
    }
    for (let k = 0; k < 6; k++) {
      const ph = (k / 6) * Math.PI;
      this.polyline(ring((t) => [r * Math.cos(t) * Math.cos(ph), r * Math.sin(t), r * Math.cos(t) * Math.sin(ph)]), color, { width: 1, layer: 0.1 });
    }
  }

  // arc showing the angle between directions a and b, at radius r
  arc(a, b, r, color, label = "") {
    if (Math.hypot(...a) === 0 || Math.hypot(...b) === 0) return; // no angle for a zero vector
    const ua = unit3(a), ub = unit3(b);
    const cos = Math.max(-1, Math.min(1, dot3(ua, ub)));
    const th = Math.acos(cos);
    if (th < 1e-3) return;
    // orthonormal frame in the a-b plane (fallback when a, b are opposite)
    let w = sub3(ub, ua.map((x) => x * cos));
    if (Math.hypot(...w) < 1e-6) w = cross3(ua, Math.abs(ua[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]);
    w = unit3(w);
    const pts = Array.from({ length: 25 }, (_, i) => {
      const t = (i / 24) * th;
      return ua.map((x, k) => r * (x * Math.cos(t) + w[k] * Math.sin(t)));
    });
    this.polyline(pts, color, { width: 2 });
    if (label) this.label(pts[12].map((x) => x * 1.25), label, color, { align: "center" });
  }

  // ---------- input ----------
  // 2D zoom about a point (canvas pixels); zoom 1 = the whole picture fits
  zoomAt(mx, my, k) {
    const f = this.flat, z = Math.min(8, Math.max(1, f.zoom * k));
    k = z / f.zoom; f.x = mx - (mx - f.x) * k; f.y = my - (my - f.y) * k; f.zoom = z;
    this.render();
  }

  bindInput() {
    const cv = this.cv;
    let drag = null;
    const pts = new Map();                                   // pointers down (two = pinch in 2D mode)
    const at = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const pinch = () => { const [a, b] = [...pts.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
    cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; pts.set(e.pointerId, at(e)); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => {
      if (!drag) return;
      if (this.flat) {
        const before = pts.size === 2 ? pinch() : null;
        pts.set(e.pointerId, at(e));
        if (before && pts.size === 2) { const now = pinch(); if (before.d > 0) this.zoomAt(now.x, now.y, now.d / before.d); }
        else { this.flat.x += e.clientX - drag.x; this.flat.y += e.clientY - drag.y; this.render(); }
      } else this.orbit((e.clientX - drag.x) * -0.008, (e.clientY - drag.y) * 0.008);
      drag = { x: e.clientX, y: e.clientY };
    });
    const end = (e) => { pts.delete(e.pointerId); drag = pts.size ? drag : null; };
    cv.addEventListener("pointerup", end);
    cv.addEventListener("pointercancel", end);
    cv.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (this.flat) { const p = at(e); return this.zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015)); }
      this.cam.dist = Math.min(60, Math.max(5, this.cam.dist * Math.exp(e.deltaY * 0.001)));
      this.atHome = false;
      this.render();
    }, { passive: false });
    const home = () => {
      if (this.flat) Object.assign(this.flat, { zoom: 1, x: 0, y: 0 });
      else { Object.assign(this.cam, this.home); this.atHome = true; this.fitPending = true; }
      this.render();
    };
    cv.addEventListener("dblclick", home);
    cv.addEventListener("keydown", (e) => {
      if (this.flat) {
        const m = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] }[e.key];
        if (m) { e.preventDefault(); this.flat.x += m[0]; this.flat.y += m[1]; this.render(); }
        if (e.key === "+" || e.key === "=") this.zoomAt(this.W / 2, this.H / 2, 1.25);
        if (e.key === "-") this.zoomAt(this.W / 2, this.H / 2, 0.8);
        if (e.key === "0") home();
        return;
      }
      const k = { ArrowLeft: [0.08, 0], ArrowRight: [-0.08, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] }[e.key];
      if (k) { e.preventDefault(); this.orbit(...k); }
      if (e.key === "0") home();
    });
  }

  orbit(dYaw, dPitch) {
    this.atHome = false;
    this.cam.yaw += dYaw;
    this.cam.pitch = Math.max(-1.45, Math.min(1.45, this.cam.pitch + dPitch));
    this.render();
  }
}
