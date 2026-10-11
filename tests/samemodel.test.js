// Lesson 4.6 same-model: every logical function of web/js/samemodel.js, plus the examples agreeing with the config.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cosine, fmt } from "../lib/zvect.js";
import { makeRandom, randomRow, train, partnerOf, grouped, rankDocs, relation, redrawGrouped, seedFrom } from "../web/js/samemodel.js";

const SETUP = JSON.parse(readFileSync(new URL("../web/data/same_model.json", import.meta.url), "utf8"));
const CFG = SETUP.config;
const DATA = SETUP.data;
const A = train(CFG, DATA, CFG.seedA);
const B = train(CFG, DATA, CFG.seedB);

test("makeRandom: minstd after the burn-in, repeatable", () => {
  const next = makeRandom(1, 0);
  assert.equal(next(), 48271);
  assert.equal(next(), (48271 * 48271) % 2147483647);
  assert.equal(makeRandom(16, 10)(), makeRandom(16, 10)());
});

test("randomRow: 3 values on the -4 .. 4 grid in steps of 0.5", () => {
  const row = randomRow(makeRandom(16, 10), CFG);
  assert.equal(row.length, 3);
  for (const x of row) {
    assert.ok(x >= -4 && x <= 4 && Number.isInteger(x * 2), String(x));
  }
});

test("train: same seed = same table; the lesson's numbers (0.995, 0.998, -0.968)", () => {
  assert.deepEqual(train(CFG, DATA, CFG.seedA), A);
  assert.equal(fmt(cosine(A.cat, A.dog)), "0.995");
  assert.equal(fmt(cosine(B.cat, B.dog)), "0.998");
  assert.equal(fmt(cosine(A.cat, B.cat)), "-0.968");
});

test("partnerOf: pairs in vocab order; unknown word throws", () => {
  assert.equal(partnerOf(DATA.vocab, "cat"), "dog");
  assert.equal(partnerOf(DATA.vocab, "bus"), "car");
  assert.throws(() => {
    partnerOf(DATA.vocab, "fox");
  }, /unknown word/);
});

test("grouped: A and B group their words; a mixed-up table does not", () => {
  assert.ok(grouped(A, DATA.vocab, CFG.groupedMin));
  assert.ok(grouped(B, DATA.vocab, CFG.groupedMin));
  const mixed = { cat: A.cat, dog: A.car, car: A.dog, bus: A.bus };
  assert.equal(grouped(mixed, DATA.vocab, CFG.groupedMin), false);
});

test("rankDocs: same model -> the word itself first, its partner second; mixed -> bus first", () => {
  const same = rankDocs(A.cat, A, DATA.vocab).map((r) => {
    return r.id;
  });
  assert.deepEqual(same.slice(0, 2), ["cat", "dog"]);
  assert.equal(rankDocs(B.cat, A, DATA.vocab)[0].id, "bus");
});

test("relation: same word / same group / other group", () => {
  assert.equal(relation("cat", "cat", DATA.group), "same");
  assert.equal(relation("dog", "cat", DATA.group), "group");
  assert.equal(relation("bus", "cat", DATA.group), "other");
});

test("redrawGrouped: skips the avoided seed and ungrouped tables; gives up after maxTries", () => {
  const seeds = [CFG.seedB, 7, CFG.seedA];
  const got = redrawGrouped(CFG, DATA, () => {
    return seeds.shift();
  }, CFG.seedB, 3);
  assert.notEqual(got.seed, CFG.seedB);
  assert.ok(grouped(got.E, DATA.vocab, CFG.groupedMin));
  assert.throws(() => {
    redrawGrouped(CFG, DATA, () => {
      return CFG.seedB;
    }, CFG.seedB, 2);
  }, /no grouped table/);
});

test("examples/js/38_same_model.js prints what the config gives (examples carry the same values)", () => {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("../examples/js/38_same_model.js", import.meta.url))], { encoding: "utf8" });
  assert.ok(out.includes("inside A: cos(cat,dog) " + fmt(cosine(A.cat, A.dog))), out);
  assert.ok(out.includes("cat in B = " + fmt(B.cat)), out);
  assert.ok(out.includes("cos(cat_A, cat_B) = " + fmt(cosine(A.cat, B.cat))), out);
});

test("seedFrom: maps [0, 1) onto 1 .. 2^31 - 2", () => {
  assert.equal(seedFrom(0), 1);
  assert.equal(seedFrom(0.9999999999), 2147483646);
});

test("the lesson text quotes the numbers the config gives (text changes when the JSON changes)", () => {
  const text = readFileSync(new URL("../web/lessons/38_same_model.text.js", import.meta.url), "utf8");
  const minus = (x) => {
    return fmt(x).replace("-", "−");
  };
  for (const want of [fmt(cosine(A.cat, A.dog)), minus(cosine(A.cat, B.cat)), CFG.passes + " รอบ", "seed " + CFG.seedA + " และ " + CFG.seedB]) {
    assert.ok(text.includes(want), want);
  }
});

test("grouped rejects partner rows that are identical (seed 13893 ties dog with cat); same model ranks w, then partner", () => {
  assert.equal(grouped(train(CFG, DATA, 13893), DATA.vocab, CFG.groupedMin), false);
  for (const E of [A, B]) {
    for (const w of DATA.vocab) {
      const ids = rankDocs(E[w], E, DATA.vocab).map((r) => {
        return r.id;
      });
      assert.deepEqual(ids.slice(0, 2), [w, partnerOf(DATA.vocab, w)], w);
    }
  }
});
