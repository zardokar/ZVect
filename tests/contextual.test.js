// Lesson 4.7 contextual: every logical function of web/js/contextual.js, plus the examples agreeing with the config.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cosine, fmt } from "../lib/zvect.js";
import { divisor, softmax, scores, contextualize, embed, senseCos, findSentence, row } from "../web/js/contextual.js";

const SETUP = JSON.parse(readFileSync(new URL("../web/data/contextual.json", import.meta.url), "utf8"));
const CFG = SETUP.config;
const DATA = SETUP.data;
const T = DATA.table;
const S1 = ["deposited", "money", "bank"];
const S2 = ["reached", "river", "bank"];

test("divisor: sqrt(d) or 1; anything else throws", () => {
  assert.equal(divisor(CFG, 3), Math.sqrt(3));
  assert.equal(divisor({ scoreDivisor: "none" }, 3), 1);
  assert.throws(() => {
    divisor({ scoreDivisor: "x" }, 3);
  }, /unknown scoreDivisor/);
});

test("softmax: positive, adds up to 1, order kept, shift-free, no overflow", () => {
  const w = softmax([1, 2, 3]);
  const total = w.reduce((s, x) => {
    return s + x;
  }, 0);
  assert.ok(Math.abs(total - 1) < 1e-12);
  assert.ok(w[0] < w[1] && w[1] < w[2] && w[0] > 0);
  assert.deepEqual(softmax([1001, 1002, 1003]).map(fmt), w.map(fmt));
  assert.deepEqual(softmax([5, 5]), [0.5, 0.5]);
});

test("scores: dot / sqrt(3) for each word of the sentence", () => {
  assert.deepEqual(scores(CFG, T, "bank", S1).map(fmt), ["4.186", "5.196", "4.763"]);
});

test("contextualize: the lesson's numbers (weights, c, cos to the senses, 0.563)", () => {
  const a = contextualize(CFG, T, "bank", S1);
  const b = contextualize(CFG, T, "bank", S2);
  assert.deepEqual(a.weights.map(fmt), ["0.181", "0.497", "0.322"]);
  assert.equal(fmt(a.vector), "[3.265, 0.893, 0.252]");
  assert.equal(fmt(cosine(a.vector, T.money)), "0.987");
  assert.equal(fmt(cosine(b.vector, T.river)), "0.977");
  assert.equal(fmt(cosine(a.vector, b.vector)), "0.563");
});

test("embed: static = the same row in every sentence; contextual differs; unknown mode throws", () => {
  assert.deepEqual(embed(CFG, T, "bank", S1, "static"), embed(CFG, T, "bank", S2, "static"));
  assert.deepEqual(embed(CFG, T, "bank", S1, "static"), T.bank);
  assert.notDeepEqual(embed(CFG, T, "bank", S1, "contextual"), embed(CFG, T, "bank", S2, "contextual"));
  assert.throws(() => {
    embed(CFG, T, "bank", S1, "x");
  }, /unknown mode/);
});

test("senseCos: static bank and static apple are ties (0.777, 0.793); contextual picks the sense", () => {
  const sb = senseCos(T.bank, T, ["money", "river"], CFG.tieEps);
  assert.equal(sb.tie, true);
  const cosList = sb.list.map((x) => {
    return fmt(x.cos);
  });
  assert.deepEqual(cosList, ["0.777", "0.777"]);
  const sa = senseCos(T.apple, T, ["fruit", "company"], CFG.tieEps);
  assert.equal(sa.tie, true);
  const appleList = sa.list.map((x) => {
    return fmt(x.cos);
  });
  assert.deepEqual(appleList, ["0.793", "0.793"]);
  const c = contextualize(CFG, T, "bank", S2).vector;
  const got = senseCos(c, T, ["money", "river"], CFG.tieEps);
  assert.equal(got.best, "river");
  assert.equal(got.tie, false);
});

test("findSentence: case, sentence and the other sentence; unknown id throws", () => {
  const f = findSentence(DATA, "s4");
  assert.equal(f.item.word, "apple");
  assert.equal(f.other.id, "s3");
  assert.throws(() => {
    findSentence(DATA, "s9");
  }, /unknown sentence/);
  assert.throws(() => {
    findSentence({ cases: [{ word: "x", sentences: [{ id: "a" }] }] }, "a");
  }, /exactly 2 sentences/);
  const ids = DATA.cases.flatMap((c) => {
    return c.sentences.map((x) => {
      return x.id;
    });
  });
  assert.equal(new Set(ids).size, ids.length);
});

test("row: a word outside the table throws; every sentence word and sense is in the table", () => {
  assert.throws(() => {
    row(T, "Yamuna");
  }, /not in the table/);
  assert.throws(() => {
    row(T, "constructor");
  }, /not in the table/);
  for (const c of DATA.cases) {
    const used = c.sentences.flatMap((s) => {
      return s.words;
    });
    for (const w of [c.word, ...c.senses, ...used]) {
      assert.ok(row(T, w));
    }
    for (const s of c.sentences) {
      assert.ok(s.words.includes(c.word), s.id);
    }
  }
});

test("examples/js/39_contextual.js prints what the config gives (examples carry the same values)", () => {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("../examples/js/39_contextual.js", import.meta.url))], { encoding: "utf8" });
  const want = [];
  for (const c of DATA.cases) {
    const e = T[c.word];
    const line = (name, v) => {
      return c.senses.map((s) => {
        return `cos(${name}, ${s}) ${fmt(cosine(v, T[s]))}`;
      }).join("  ");
    };
    want.push(`word "${c.word}"`, `  static: e = ${fmt(e)}  ${line("e", e)}  (same row in every sentence)`);
    const got = c.sentences.map((s) => {
      const r = contextualize(CFG, T, c.word, s.words);
      const w = s.words.map((x, j) => {
        return `${x} ${fmt(r.weights[j])}`;
      }).join(", ");
      want.push(`  sentence "${s.text}"`, `    weights: ${w}`, `    c = ${fmt(r.vector)}  ${line("c", r.vector)}`);
      return r.vector;
    });
    want.push(`  same word, two sentences: static cos ${fmt(cosine(e, e))}, contextual cos ${fmt(cosine(got[0], got[1]))}`);
  }
  assert.equal(out, want.join("\n") + "\n");
});

test("the numbers in the lesson's try list are the numbers the code computes", () => {
  const text = readFileSync(new URL("../web/lessons/39_contextual.text.js", import.meta.url), "utf8");
  const a = contextualize(CFG, T, "bank", S1).vector;
  const b = contextualize(CFG, T, "bank", S2).vector;
  const staticCos = fmt(cosine(T.bank, T.money));
  assert.equal(staticCos, fmt(cosine(T.bank, T.river)));
  for (const want of [`${staticCos} ทั้งคู่`, `(cos ${fmt(cosine(a, T.money))})`, `(cos ${fmt(cosine(b, T.river))})`,
    `เหลือ ${fmt(cosine(a, b))}`, `เป็น ${fmt(cosine(T.bank, T.bank))} เสมอ`]) {
    assert.ok(text.includes(want), want);
  }
});
