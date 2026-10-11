// samemodel.js — LOGICAL functions of lesson 4.6 (same-model): pure, no DOM, no fetch, no globals.
// Config and toy data come in as arguments (web/data/same_model.json); tests: tests/samemodel.test.js.
import { add, sub, scale, mean, cosine, topK } from "../../lib/zvect.js";

const MODULUS = 2147483647;   // minstd: x = x * 48271 mod (2^31 - 1), same as the examples
const MULTIPLIER = 48271;

// a seed for minstd (1 .. MODULUS - 1) from a uniform random number in [0, 1), e.g. Math.random()
export function seedFrom(uniform) {
  return 1 + Math.floor(uniform * (MODULUS - 1));
}

// a repeatable random integer stream; the first `burn` numbers are thrown away (tiny after a small seed)
export function makeRandom(seed, burn) {
  let state = seed;
  const next = () => {
    state = (state * MULTIPLIER) % MODULUS;
    return state;
  };
  for (let i = 0; i < burn; i++) {
    next();
  }
  return next;
}

// one random 3-D row: rowSteps values centred on 0, e.g. 17 steps x 0.5 = -4 .. 4
export function randomRow(next, cfg) {
  const half = (cfg.rowSteps - 1) / 2;
  const row = [];
  for (let i = 0; i < 3; i++) {
    row.push(((next() % cfg.rowSteps) - half) * cfg.rowScale);
  }
  return row;
}

// the rule of lesson 4.4: c = mean(left, right); e_w <- e_w + eta * (c - e_w); context rows start random, then stay
export function train(cfg, data, seed) {
  const next = makeRandom(seed, cfg.burn);
  const ctx = {};
  const E = {};
  for (const w of data.ctxWords) {
    ctx[w] = randomRow(next, cfg);
  }
  for (const w of data.vocab) {
    E[w] = randomRow(next, cfg);
  }
  for (let p = 0; p < cfg.passes; p++) {
    for (const [l, w, r] of data.windows) {
      const c = mean([ctx[l], ctx[r]]);
      E[w] = add(E[w], scale(sub(c, E[w]), cfg.eta));
    }
  }
  return E;
}

// vocab is listed in partner pairs (cat/dog, car/bus)
export function partnerOf(vocab, w) {
  const i = vocab.indexOf(w);
  if (i < 0) {
    throw new Error("unknown word: " + w);
  }
  return vocab[i ^ 1];
}

// a table "groups its words" when every word is close to its partner and nearer to it than to any other word
export function grouped(E, vocab, min) {
  return vocab.every((w) => {
    const mate = partnerOf(vocab, w);
    const toMate = cosine(E[w], E[mate]);
    // identical partner rows (same random start) tie at cos 1, so the ranking could not tell them apart
    if (toMate <= min || E[w].every((x, k) => {
      return x === E[mate][k];
    })) {
      return false;
    }
    return vocab.every((x) => {
      return x === w || x === mate || cosine(E[w], E[x]) < toMate;
    });
  });
}

// documents = every word's row in the documents table; best first (ties keep vocab order)
export function rankDocs(q, docsTable, vocab) {
  const items = vocab.map((w) => {
    return { id: w, v: docsTable[w] };
  });
  return topK(q, items, vocab.length);
}

// how a ranked document relates to the question word: "same" word, same "group", or "other" group
export function relation(docId, w, group) {
  if (docId === w) {
    return "same";
  }
  return group[docId] === group[w] ? "group" : "other";
}

// draw seeds from nextSeed() until the trained table groups its words and differs from `avoid`
export function redrawGrouped(cfg, data, nextSeed, avoid, maxTries) {
  for (let i = 0; i < maxTries; i++) {
    const seed = nextSeed();
    const E = train(cfg, data, seed);
    if (seed !== avoid && grouped(E, data.vocab, cfg.groupedMin)) {
      return { seed, E };
    }
  }
  throw new Error("no grouped table after " + maxTries + " seeds");
}
