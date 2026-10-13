// core/guards.js acceptance: matrix problems (ragged, non-finite, masked allowed only when asked), lists, enums, the collector.
import { test } from "node:test";
import assert from "node:assert/strict";
import { isObject, finite, present, matrixProblem, createCollector } from "../core/guards.js";

test("matrixProblem: ragged rows, non-finite values, not a matrix; null allowed only when asked", () => {
  assert.equal(matrixProblem([[1, 2], [3]]), "ragged");
  assert.equal(matrixProblem([[1, NaN]]), "notFinite");
  assert.equal(matrixProblem([[1, Infinity]]), "notFinite");
  assert.equal(matrixProblem([[1, null]]), "notFinite");
  assert.equal(matrixProblem([[1, null]], true), null);
  assert.equal(matrixProblem([[1, -Infinity]], true), null);
  assert.equal(matrixProblem([1, 2]), "notMatrix");
  assert.equal(matrixProblem([]), "notMatrix");
  assert.equal(matrixProblem([[]]), "notMatrix");
  assert.equal(matrixProblem([[1, "2"]]), "notFinite");
  assert.equal(matrixProblem([[1, 2], [3, 4]]), null);
});

test("isObject, finite, present", () => {
  assert.equal(isObject({}), true);
  assert.equal(isObject([]), false);
  assert.equal(isObject(null), false);
  assert.equal(finite(1.5), true);
  assert.equal(finite(NaN), false);
  assert.equal(finite("1"), false);
  assert.equal(present(0), true);
  assert.equal(present(null), false);
  assert.equal(present(undefined), false);
});

test("collector: matrix checks shape after the problem check; list and oneOf; errors carry key, path, vars", () => {
  const c = createCollector();
  assert.equal(c.matrix([[1, 2]], "a", 1, 2), true);
  assert.equal(c.matrix([[1, 2]], "b", 2, null), false);
  assert.equal(c.matrix([[1, 2]], "c", null, 3), false);
  assert.equal(c.matrix([[1], [2, 3]], "d", 5, 5), false);
  assert.equal(c.list([], "e", 3), false);
  assert.equal(c.list([1, 2, 3, 4], "f", 3), false);
  assert.equal(c.list([1], "g", 3), true);
  c.oneOf("x", ["y", "z"], "h");
  c.oneOf(undefined, ["y"], "i");
  assert.deepEqual(c.errors, [
    { key: "rowsMismatch", path: "b", vars: { want: 2, got: 1 } },
    { key: "colsMismatch", path: "c", vars: { want: 3, got: 2 } },
    { key: "ragged", path: "d", vars: {} },
    { key: "emptyList", path: "e", vars: {} },
    { key: "tooMany", path: "f", vars: { max: 3 } },
    { key: "badEnum", path: "h", vars: { allowed: ["y", "z"] } },
  ]);
});
