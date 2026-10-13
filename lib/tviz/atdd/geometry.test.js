// core/geometry.js acceptance: HiDPI sizes, matrix cells + hit test, dot radius, strips with sampled dims, bipartite lines, grids, columns.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hidpi, matrixLayout, matrixCells, hitCell, dotRadius, sampleDims, stripCells, bipartite, lineSegments, gridCells, stageColumns,
} from "../core/geometry.js";

test("hidpi: device pixels are whole numbers, scale = dpr (1 when missing)", () => {
  assert.deepEqual(hidpi(300.4, 100, 2), { width: 601, height: 200, scale: 2 });
  assert.deepEqual(hidpi(300, 100, undefined), { width: 300, height: 100, scale: 1 });
  assert.deepEqual(hidpi(300, 100, 0), { width: 300, height: 100, scale: 1 });
});

test("matrixLayout / matrixCells: square cells that fit the box, row-major, gaps between", () => {
  const lay = matrixLayout(2, 3, { x: 10, y: 20, w: 34, h: 100 }, 2);
  assert.equal(lay.size, 10);
  const cells = matrixCells(lay);
  assert.equal(cells.length, 6);
  assert.deepEqual(cells[0], { i: 0, j: 0, x: 10, y: 20, w: 10, h: 10 });
  assert.deepEqual(cells[5], { i: 1, j: 2, x: 34, y: 32, w: 10, h: 10 });
  const tall = matrixLayout(4, 1, { x: 0, y: 0, w: 100, h: 46 }, 2);
  assert.equal(tall.size, 10);
});

test("hitCell: inside a cell -> {i, j}; in a gap or outside -> null", () => {
  const lay = matrixLayout(2, 3, { x: 10, y: 20, w: 34, h: 100 }, 2);
  assert.deepEqual(hitCell(lay, 11, 21), { i: 0, j: 0 });
  assert.deepEqual(hitCell(lay, 43.9, 41.9), { i: 1, j: 2 });
  assert.equal(hitCell(lay, 21, 21), null);
  assert.equal(hitCell(lay, 9, 21), null);
  assert.equal(hitCell(lay, 11, 60), null);
});

test("dotRadius: area grows with the value; 0 -> rMin, 1 -> rMax; clamped", () => {
  assert.equal(dotRadius(0, 1, 5), 1);
  assert.equal(dotRadius(1, 1, 5), 5);
  assert.equal(dotRadius(0.25, 1, 5), 3);
  assert.equal(dotRadius(-1, 1, 5), 1);
  assert.equal(dotRadius(4, 1, 5), 5);
});

test("sampleDims: all dims when they fit, else evenly spaced with first and last", () => {
  assert.deepEqual(sampleDims(4, 64), [0, 1, 2, 3]);
  assert.deepEqual(sampleDims(10, 4), [0, 3, 6, 9]);
  assert.deepEqual(sampleDims(768, 64).length, 64);
  assert.equal(sampleDims(768, 64)[63], 767);
});

test("stripCells: one cell per shown dim, with the source dim index", () => {
  const cells = stripCells(10, { x: 0, y: 5, w: 40, h: 8 }, 4, 0);
  assert.equal(cells.length, 4);
  assert.deepEqual(cells[1], { k: 1, d: 3, x: 10, y: 5, w: 10, h: 8 });
});

test("bipartite: query anchors on the left edge, key anchors on the right, rows evenly spaced", () => {
  const b = bipartite(3, { x: 0, y: 0, w: 200, h: 90 });
  assert.deepEqual(b.left, [{ x: 0, y: 15 }, { x: 0, y: 45 }, { x: 0, y: 75 }]);
  assert.deepEqual(b.right[2], { x: 200, y: 75 });
});

test("lineSegments: only weights >= threshold, with width from the weight", () => {
  const b = bipartite(2, { x: 0, y: 0, w: 100, h: 40 });
  const segs = lineSegments([[0.9, 0.1], [0.05, 0.95]], b, 0.1, { widthMin: 1, widthMax: 5 });
  assert.deepEqual(segs.map((s) => {
    return [s.i, s.j];
  }), [[0, 0], [0, 1], [1, 1]]);
  const { width, ...rest } = segs[0];
  assert.deepEqual(rest, { i: 0, j: 0, w: 0.9, x1: 0, y1: 10, x2: 100, y2: 10 });
  assert.equal(width.toFixed(3), "4.600");
});

test("gridCells: layers x heads thumbnails, row-major, square, fit the width", () => {
  const g = gridCells(2, 3, { x: 0, y: 0, w: 64, h: 999 }, 2);
  assert.equal(g.length, 6);
  assert.deepEqual(g[0], { layer: 0, head: 0, x: 0, y: 0, w: 20, h: 20 });
  assert.deepEqual(g[4], { layer: 1, head: 1, x: 22, y: 22, w: 20, h: 20 });
});

test("stageColumns: equal columns with gaps across the box", () => {
  const c = stageColumns(3, { x: 0, y: 0, w: 106, h: 50 }, 2);
  assert.deepEqual(c, [{ k: 0, x: 0, y: 0, w: 34, h: 50 }, { k: 1, x: 36, y: 0, w: 34, h: 50 }, { k: 2, x: 72, y: 0, w: 34, h: 50 }]);
});
