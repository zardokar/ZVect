// color.js — LOGIC: color ramps between theme colors (hex stops read from --tviz-* by the UI), value domains that skip
// masked cells, rgba text for canvas, line alpha, legend stops. Pure, no DOM.

function clamp01(t) {
  return Math.min(1, Math.max(0, t));
}

// "#rgb" or "#rrggbb" -> [r, g, b]
export function parseHex(hex) {
  const s = String(hex).trim().replace(/^#/, "");
  const full = s.length === 3 ? s.split("").map((c) => {
    return c + c;
  }).join("") : s;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error("tviz: not a hex color: " + hex);
  }
  return [0, 2, 4].map((k) => {
    return parseInt(full.slice(k, k + 2), 16);
  });
}

// a + (b - a) * t per channel, rounded to whole numbers
export function mix(a, b, t) {
  return a.map((x, k) => {
    return Math.round(x + (b[k] - x) * t);
  });
}

// t in 0..1 (clamped) -> color between evenly spaced hex stops
export function ramp(stops, t) {
  const rgb = stops.map(parseHex);
  if (rgb.length === 1) {
    return rgb[0];
  }
  const pos = clamp01(t) * (rgb.length - 1);
  const k = Math.min(Math.floor(pos), rgb.length - 2);
  return mix(rgb[k], rgb[k + 1], pos - k);
}

// min and max over finite values only (masked -Infinity / null skipped); nothing finite -> { 0, 0 }
export function domain(M) {
  let min = Infinity;
  let max = -Infinity;
  for (const row of M) {
    for (const x of row) {
      if (Number.isFinite(x)) {
        min = Math.min(min, x);
        max = Math.max(max, x);
      }
    }
  }
  return min === Infinity ? { min: 0, max: 0 } : { min, max };
}

// a domain centred on 0 for diverging ramps
export function symmetric(dom) {
  const m = Math.max(Math.abs(dom.min), Math.abs(dom.max));
  return { min: -m + 0, max: m };
}

// value -> 0..1 inside the domain (clamped); a flat domain gives the middle
export function unit(v, dom) {
  if (dom.max === dom.min) {
    return 0.5;
  }
  return clamp01((v - dom.min) / (dom.max - dom.min));
}

export function rgba(rgb, a) {
  return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + clamp01(a) + ")";
}

// line opacity from a weight in 0..1 (clamped): aMin at 0, aMax at 1
export function alphaOf(w, aMin, aMax) {
  return aMin + (aMax - aMin) * clamp01(w);
}

// count evenly spaced { t, value } marks from min to max (ends included)
export function legendStops(dom, count) {
  if (count <= 1) {
    return [{ t: 0, value: dom.min }];
  }
  const out = [];
  for (let k = 0; k < count; k++) {
    const t = k / (count - 1);
    out.push({ t, value: dom.min + (dom.max - dom.min) * t });
  }
  return out;
}
