// Tests for the dictionary facade (web/js/dict/): runs in Node with an in-memory store and the real default JSON files.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createDict } from "../web/js/dict/facade.js";
import { memoryStore } from "../web/js/dict/adapters.js";
import { FILES } from "../web/js/dict/model.js";

const diskSource = { load: async () => ({ texts: Object.fromEntries(FILES.map((f) =>
  [f, readFileSync(new URL(`../web/data/dict/${f}.json`, import.meta.url), "utf8")])) }) };
const fresh = () => createDict({ source: diskSource, store: memoryStore() });

test("defaults load and the store gets a copy", async () => {
  const store = memoryStore(), d = await createDict({ source: diskSource, store });
  assert.deepEqual(d.langs, ["en", "th", "zh", "jp"]);
  assert.equal(d.data.words.en.fish, "fish");
  assert.equal(store.read().version, d.data.version);
  assert.equal(d.changed, false);
});

test("rowOf / isNewRow: the EN word names the row", async () => {
  const d = await fresh();
  assert.equal(d.rowOf("Pets"), "pet");
  assert.equal(d.rowOf("  "), "");
  assert.equal(d.isNewRow("fish"), false);
  assert.equal(d.isNewRow("soup"), true);
});

test("addRow: new row with a vector, words added, existing ones skipped", async () => {
  const d = await fresh();
  const r = d.addRow({ en: "soup", th: "ซุป", zh: "", jp: "" }, [1, 0, 0]);
  assert.equal(r.row, "soup");
  assert.deepEqual(r.added, [["en", "soup"], ["th", "ซุป"]]);
  assert.deepEqual(d.data.meanings.soup, [1, 0, 0]);
  assert.equal(d.isMine("th", "ซุป"), true);
  const again = d.addRow({ en: "soup", th: "ซุป" }, null);
  assert.deepEqual(again.added, []);
  assert.deepEqual(again.skipped, [["en", "soup"], ["th", "ซุป"]]);
  assert.equal(d.changed, true);
});

test("addRow: errors are per language and nothing is half-written", async () => {
  const d = await fresh();
  assert.deepEqual(d.addRow({ th: "ปลา" }).errors, [["en", "พิมพ์คำในช่อง EN (ใช้เป็นชื่อแถว)"]]);
  const r = d.addRow({ en: "soup", th: "ซุป" }, [0, 0, 0]);          // a new row needs a non-zero vector
  assert.equal(r.added.length, 0);
  assert.equal(r.errors.length, 2);
  assert.equal(Object.hasOwn(d.data.meanings, "soup"), false);
  assert.match(d.addRow({ en: "fish", th: "abc" }).errors[0][1], /EN/);
});

test("remove drops a learner's row when no word uses it; reset clears everything", async () => {
  const d = await fresh();
  d.addRow({ en: "soup", th: "ซุป" }, [1, 0, 0]);
  d.remove("th", "ซุป"); d.remove("en", "soup");
  assert.equal(Object.hasOwn(d.data.meanings, "soup"), false);
  d.addRow({ en: "fish", th: "ปลาทู" });
  assert.equal(d.data.words.th["ปลาทู"], "fish");
  d.reset();
  assert.equal(Object.hasOwn(d.data.words.th, "ปลาทู"), false);
  assert.equal(JSON.parse(d.exportJSON()).mine.words.th["ปลาทู"], undefined);
});
