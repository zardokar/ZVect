// guards.js — LOGIC: generic input guards used by validate.js: matrix shape / finiteness, lists, enums, an error collector.
// Pure, no DOM; returns error keys (text/*.json errors), never throws.

export function isObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

export function finite(x) {
  return typeof x === "number" && Number.isFinite(x);
}

// a value that was given (not undefined, not null)
export function present(x) {
  return x !== undefined && x !== null;
}

// null when M is a usable matrix; else "notMatrix" | "ragged" | "notFinite" (null / -Infinity allowed when masked = true)
export function matrixProblem(M, masked) {
  if (!Array.isArray(M) || M.length === 0 || !Array.isArray(M[0]) || M[0].length === 0) {
    return "notMatrix";
  }
  for (const row of M) {
    if (!Array.isArray(row)) {
      return "notMatrix";
    }
    if (row.length !== M[0].length) {
      return "ragged";
    }
    for (const x of row) {
      if (!finite(x) && !(masked && (x === null || x === -Infinity))) {
        return "notFinite";
      }
    }
  }
  return null;
}

// a checker that collects errors: add(key, path, vars), matrix(M, path, rows, cols, masked) -> true when usable
export function createCollector() {
  const errors = [];
  const add = (key, path, vars) => {
    errors.push({ key, path, vars: vars || {} });
  };
  const matrix = (M, path, rows, cols, masked) => {
    const problem = matrixProblem(M, masked);
    if (problem) {
      add(problem, path);
      return false;
    }
    if (rows !== null && M.length !== rows) {
      add("rowsMismatch", path, { want: rows, got: M.length });
      return false;
    }
    if (cols !== null && M[0].length !== cols) {
      add("colsMismatch", path, { want: cols, got: M[0].length });
      return false;
    }
    return true;
  };
  const list = (xs, path, max) => {
    if (!Array.isArray(xs) || xs.length === 0) {
      add("emptyList", path);
      return false;
    }
    if (xs.length > max) {
      add("tooMany", path, { max });
      return false;
    }
    return true;
  };
  const oneOf = (x, allowed, path) => {
    if (x !== undefined && !allowed.includes(x)) {
      add("badEnum", path, { allowed });
    }
  };
  return { errors, add, matrix, list, oneOf };
}
