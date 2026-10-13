// fixtures.js — shared data of the tviz acceptance tests: config, text, and the toy numbers of plan §3.2 / §3.3.
// ATTN and BLOCK are copies of ZVect web/data/transformer.json (tests/tviz_zvect.test.js fails if they drift);
// LOGITS are the author's toy logits of plan §3.3. Kept here so the folder tests itself after a copy.
import { readFileSync } from "node:fs";

function json(rel) {
  return JSON.parse(readFileSync(new URL(rel, import.meta.url), "utf8"));
}

export const CONFIG = json("../config/defaults.json");
export const EN = json("../text/en.json");
export const TH = json("../text/th.json");

export const ATTN = {
  tokens: ["A", "cute", "teddy bear", "is", "reading"],
  X: [[0.2, 0.2, 0.1], [2.0, 0.4, 0.2], [0.6, 2.0, 0.4], [0.2, 0.2, 0.6], [0.4, 0.6, 2.0]],
  Wq: [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
  Wk: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  Wv: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
};

export const BLOCK = {
  tokens: ["A", "cute", "teddy bear", "is", "reading"],
  X: [[0.2, 0.2, 0.1, 0.0], [2.0, 0.4, 0.2, 0.1], [0.6, 2.0, 0.4, 0.2], [0.2, 0.2, 0.6, 0.1], [0.4, 0.6, 2.0, 0.3]],
  config: { dModel: 4, heads: 2, dK: 2, dFF: 8, seed: 7, scale: 0.8, burn: 10, eps: 1e-5, base: 10000 },
};

export const NEXT = {
  vocab: ["reading", "sleeping", "playing", "eating", "a"],
  logits: [2.0, 1.2, 0.8, 0.1, -1.0],
};

// weights input of plan §4.3 for the §3.2 example: one head, no position, no block
export function attnWeights(causal) {
  return {
    X: ATTN.X,
    heads: [{ Wq: ATTN.Wq, Wk: ATTN.Wk, Wv: ATTN.Wv }],
    position: "none",
    causal,
    scale: "sqrtDk",
  };
}

// a number rounded to 3 decimals as text (the plan tables print 3 decimals)
export function d3(x) {
  return (x + 0).toFixed(3);
}

export function row3(v) {
  return v.map((x) => {
    return d3(x);
  });
}

// every "a.b.c" key path of a nested text object (leaves only)
export function keyPaths(obj, prefix) {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...keyPaths(v, path));
    } else {
      out.push(path);
    }
  }
  return out;
}

// the value at "a.b.c" in a nested object (undefined when missing)
export function at(obj, path) {
  return path.split(".").reduce((o, k) => {
    return o === undefined || o === null ? undefined : o[k];
  }, obj);
}
