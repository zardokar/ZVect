// geometry.js — LOGIC: where things go on a canvas, in CSS pixels: HiDPI sizes, matrix cells + hit test, dots, vector strips,
// bipartite attention lines, head thumbnails, block columns. Pure, no DOM. A box is { x, y, w, h }.

function clamp01(t) {
  return Math.min(1, Math.max(0, t));
}

// CSS size + devicePixelRatio -> whole device pixels for canvas.width / height, and the scale for ctx.setTransform
export function hidpi(cssW, cssH, dpr) {
  const scale = dpr > 0 ? dpr : 1;
  return { width: Math.round(cssW * scale), height: Math.round(cssH * scale), scale };
}

// square cells of a rows x cols matrix, as large as fit in the box with `gap` between them
export function matrixLayout(rows, cols, box, gap) {
  const size = Math.min((box.w - gap * (cols - 1)) / cols, (box.h - gap * (rows - 1)) / rows);
  return { x: box.x, y: box.y, rows, cols, size, gap };
}

export function matrixCells(lay) {
  const cells = [];
  const step = lay.size + lay.gap;
  for (let i = 0; i < lay.rows; i++) {
    for (let j = 0; j < lay.cols; j++) {
      cells.push({ i, j, x: lay.x + j * step, y: lay.y + i * step, w: lay.size, h: lay.size });
    }
  }
  return cells;
}

// pointer (CSS px) -> { i, j } of the cell under it; a gap or the outside -> null
export function hitCell(lay, px, py) {
  const step = lay.size + lay.gap;
  const dx = px - lay.x;
  const dy = py - lay.y;
  const j = Math.floor(dx / step);
  const i = Math.floor(dy / step);
  const inside = dx >= 0 && dy >= 0 && i < lay.rows && j < lay.cols;
  if (!inside || dx - j * step >= lay.size || dy - i * step >= lay.size) {
    return null;
  }
  return { i, j };
}

// dot radius for a value in 0..1 (clamped): the dot AREA grows with the value
export function dotRadius(v, rMin, rMax) {
  return rMin + (rMax - rMin) * Math.sqrt(clamp01(v));
}

// which dims to draw: all when len <= max, else max evenly spaced indexes incl. the first and the last
export function sampleDims(len, max) {
  if (len <= max) {
    return Array.from({ length: len }, (_, k) => {
      return k;
    });
  }
  return Array.from({ length: max }, (_, k) => {
    return Math.round((k * (len - 1)) / (max - 1));
  });
}

// one cell per shown dim of a vector across the box: { k (cell), d (source dim), x, y, w, h }
export function stripCells(len, box, maxDims, gap) {
  const dims = sampleDims(len, maxDims);
  const w = (box.w - gap * (dims.length - 1)) / dims.length;
  return dims.map((d, k) => {
    return { k, d, x: box.x + k * (w + gap), y: box.y, w, h: box.h };
  });
}

// anchors of the same n tokens twice: queries on the left edge, keys on the right edge
export function bipartite(n, box) {
  const ys = Array.from({ length: n }, (_, i) => {
    return box.y + ((i + 0.5) * box.h) / n;
  });
  return {
    left: ys.map((y) => {
      return { x: box.x, y };
    }),
    right: ys.map((y) => {
      return { x: box.x + box.w, y };
    }),
  };
}

// one segment per weight A[i][j] >= threshold, its width from the weight between widthMin and widthMax
export function lineSegments(A, anchors, threshold, style) {
  const segs = [];
  A.forEach((row, i) => {
    row.forEach((w, j) => {
      if (w >= threshold) {
        const a = anchors.left[i];
        const b = anchors.right[j];
        const width = style.widthMin + (style.widthMax - style.widthMin) * clamp01(w);
        segs.push({ i, j, w, x1: a.x, y1: a.y, x2: b.x, y2: b.y, width });
      }
    });
  });
  return segs;
}

// layers x heads square thumbnails, row-major, as wide as fit in the box
export function gridCells(layers, heads, box, gap) {
  const size = (box.w - gap * (heads - 1)) / heads;
  const out = [];
  for (let layer = 0; layer < layers; layer++) {
    for (let head = 0; head < heads; head++) {
      out.push({ layer, head, x: box.x + head * (size + gap), y: box.y + layer * (size + gap), w: size, h: size });
    }
  }
  return out;
}

// count equal columns across the box with gaps between them
export function stageColumns(count, box, gap) {
  const w = (box.w - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, k) => {
    return { k, x: box.x + k * (w + gap), y: box.y, w, h: box.h };
  });
}
