// tween.js — LOGIC: animation math for step changes (owner Q21 b): easing curves, progress over time, interpolation of
// numbers, vectors and matrices. Pure, no DOM and no clock: the UI passes `now` from requestAnimationFrame.
// Duration 0 = instant (prefers-reduced-motion); a non-finite end (masked −∞) jumps at the end instead of making NaN.

function clamp01(t) {
  return Math.min(1, Math.max(0, t));
}

export const EASINGS = {
  linear(t) {
    return t;
  },
  easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
};

// eased value of t (clamped to 0..1); an unknown easing name throws
export function ease(name, t) {
  if (!Object.hasOwn(EASINGS, name)) {
    throw new Error("tviz: unknown easing: " + name);
  }
  return EASINGS[name](clamp01(t));
}

// share of the tween done at `now` (0..1); duration 0 or less -> 1 at once
export function progress(now, start, duration) {
  if (!(duration > 0)) {
    return 1;
  }
  return clamp01((now - start) / duration);
}

export function lerp(a, b, t) {
  const k = clamp01(t);
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return k >= 1 ? b : a;
  }
  if (k >= 1) {
    return b;
  }
  return a + (b - a) * k;
}

export function lerpArray(a, b, t) {
  return a.map((x, i) => {
    return lerp(x, b[i], t);
  });
}

export function lerpMatrix(A, B, t) {
  return A.map((row, i) => {
    return lerpArray(row, B[i], t);
  });
}

function sameShape(a, b) {
  if (typeof a === "number" || typeof b === "number") {
    return typeof a === typeof b;
  }
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  return a.every((x, i) => {
    return sameShape(x, b[i]);
  });
}

// spec = { from, to, start, duration, easing } -> { value at now, done }; different shapes snap to `to`
export function tweenAt(spec, now) {
  if (!sameShape(spec.from, spec.to)) {
    return { value: spec.to, done: true };
  }
  const p = progress(now, spec.start, spec.duration);
  const t = ease(spec.easing, p);
  const lerpers = { number: lerp, vector: lerpArray, matrix: lerpMatrix };
  const kind = typeof spec.to === "number" ? "number" : Array.isArray(spec.to[0]) ? "matrix" : "vector";
  return { value: lerpers[kind](spec.from, spec.to, t), done: p >= 1 };
}
