// contextual.js — LOGICAL functions of lesson 4.7 (contextual): pure, no DOM, no fetch, no globals.
// Config and toy data come in as arguments (web/data/contextual.json); tests: tests/contextual.test.js.
import { dot, cosine } from "../../lib/zvect.js";

// what the dot product is divided by: "sqrtDim" = sqrt(d) as in the usual attention formula, "none" = 1
export function divisor(cfg, dim) {
  if (cfg.scoreDivisor === "sqrtDim") {
    return Math.sqrt(dim);
  }
  if (cfg.scoreDivisor === "none") {
    return 1;
  }
  throw new Error("unknown scoreDivisor: " + cfg.scoreDivisor);
}

// weights that are > 0 and add up to 1; the largest score is subtracted first (same weights, no overflow)
export function softmax(scores) {
  const top = Math.max(...scores);
  const ex = scores.map((x) => {
    return Math.exp(x - top);
  });
  const total = ex.reduce((s, x) => {
    return s + x;
  }, 0);
  return ex.map((x) => {
    return x / total;
  });
}

// one score per word of the sentence: how much the word's static row points the same way as that word's row
export function scores(cfg, table, word, words) {
  const e = row(table, word);
  const k = divisor(cfg, e.length);
  return words.map((w) => {
    return dot(e, row(table, w)) / k;
  });
}

// the contextual vector of `word` in the sentence: the weighted mean of the sentence's static rows
export function contextualize(cfg, table, word, words) {
  const sc = scores(cfg, table, word, words);
  const weights = softmax(sc);
  const vector = new Array(row(table, word).length).fill(0);
  words.forEach((w, j) => {
    const e = row(table, w);
    for (let i = 0; i < vector.length; i++) {
      vector[i] += weights[j] * e[i];
    }
  });
  return { scores: sc, weights, vector };
}

// the vector a model would give `word` in this sentence: static = the same row always, contextual = mixed with the sentence
export function embed(cfg, table, word, words, mode) {
  if (mode === "static") {
    return row(table, word);
  }
  if (mode === "contextual") {
    return contextualize(cfg, table, word, words).vector;
  }
  throw new Error("unknown mode: " + mode);
}

// cosine of a vector with each sense word; best = the sense with the highest cosine; tie = the top two closer than tieEps
export function senseCos(vector, table, senses, tieEps) {
  const list = senses.map((s) => {
    return { sense: s, cos: cosine(vector, row(table, s)) };
  });
  let best = list[0];
  for (const x of list) {
    if (x.cos > best.cos) {
      best = x;
    }
  }
  const sorted = list.map((x) => {
    return x.cos;
  }).sort((a, b) => {
    return b - a;
  });
  const tie = sorted.length > 1 && sorted[0] - sorted[1] < tieEps;
  return { list, best: best.sense, tie };
}

// the case and the sentence for a sentence id, plus the other sentence of the same case
export function findSentence(data, id) {
  for (const c of data.cases) {
    if (c.sentences.length !== 2) {
      throw new Error("case needs exactly 2 sentences: " + c.word);
    }
    const i = c.sentences.findIndex((s) => {
      return s.id === id;
    });
    if (i >= 0) {
      return { item: c, sentence: c.sentences[i], other: c.sentences[1 - i] };
    }
  }
  throw new Error("unknown sentence: " + id);
}

// the static row of a word; a word outside the table throws (like a word the model never saw)
export function row(table, word) {
  if (!Object.hasOwn(table, word)) {
    throw new Error("word not in the table: " + word);
  }
  return table[word];
}
