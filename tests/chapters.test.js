// web/data/chapters.json is the one place for chapters and order; these tests keep it, the lessons and the docs in step.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { plan, mapper, runs, remapText } from "../tools/reindex.js";

const doc = JSON.parse(readFileSync(new URL("../web/data/chapters.json", import.meta.url), "utf8"));
const { num, chapterNo, errors } = plan(doc);

test("chapters.json: ids and slugs unique, every field filled", () => {
  assert.deepEqual(errors, []);
});

test("every lesson has its page and an example in js / py / cpp", () => {
  for (const c of doc.chapters) for (const l of c.lessons) {
    assert.ok(existsSync(new URL(`../web/lessons/${l.file}.js`, import.meta.url)), l.file);
    for (const ext of ["js", "py", "cpp"])
      assert.ok(existsSync(new URL(`../examples/${ext}/${l.file}.${ext}`, import.meta.url)), `${ext}/${l.file}`);
  }
});

test("the slug in chapters.json is the slug the lesson file declares", () => {
  // read the source (some lessons load the dictionary with fetch, which node cannot do from file:)
  for (const c of doc.chapters) for (const l of c.lessons) {
    const src = readFileSync(new URL(`../web/lessons/${l.file}.js`, import.meta.url), "utf8");
    assert.equal(src.match(/^\s*slug:\s*"([^"]+)"/m)?.[1], l.slug, l.file);
  }
});

test("every {#slug} in the web code names a real lesson", () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(new URL(e.name + "/", dir)) : e.name.endsWith(".js") ? [new URL(e.name, dir)] : []);
  for (const f of walk(new URL("../web/", import.meta.url))) {
    const src = readFileSync(f, "utf8").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
    for (const [, slug] of src.matchAll(/\{#([a-z0-9-]+)\}/g)) assert.ok(num.has(slug), `${f.pathname}: {#${slug}}`);
  }
});

test("runs() groups consecutive topics of one chapter", () => {
  assert.equal(runs(["3.4", "4.1", "4.2", "4.3", "4.4", "4.5"]), "3.4, 4.1–4.5");
  assert.equal(runs(["5.1"]), "5.1");
  assert.equal(runs(["1.2", "1.3", "2.1"]), "1.2–1.3, 2.1");
});

test("old -> new numbers: by slug, ranges split, values left alone", () => {
  const lock = { chapters: { a: 1, b: 2 }, numbers: { x: "1.1", y: "1.2", z: "1.3", w: "2.1" } };
  const fresh = plan({ chapters: [
    { id: "a", title: "A", en: "a", lessons: [{ file: "f", slug: "x", short: "s", readme: "r", llms: "l" }] },
    { id: "n", title: "N", en: "n", lessons: [{ file: "f", slug: "y", short: "s", readme: "r", llms: "l" },
                                              { file: "f", slug: "z", short: "s", readme: "r", llms: "l" }] },
    { id: "b", title: "B", en: "b", lessons: [{ file: "f", slug: "w", short: "s", readme: "r", llms: "l" }] },
  ] });
  const m = mapper(lock, fresh.num, fresh.chapterNo);
  assert.equal(remapText("ใช้ในบท: 1.1–1.3, 2.1, 2.4 (เสนอ)", m), "ใช้ในบท: 1.1, 2.1–2.2, 3.1, 3.4 (เสนอ)");
  assert.equal(remapText("บท 1.2 ได้ 0.95, 68.8%, −1.2, ~1.3 ms, 2.25", m), "บท 2.1 ได้ 0.95, 68.8%, −1.2, ~1.3 ms, 2.25");
});

test("docs are up to date with chapters.json (npm run reindex -- --check)", () => {
  execFileSync(process.execPath, [new URL("../tools/reindex.js", import.meta.url).pathname, "--check"], { stdio: "pipe" });
});
