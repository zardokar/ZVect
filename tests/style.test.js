// tools/check-style.js: each rule goes RED on a planted violation, and every file in tools/style-scope.json is clean.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkSource } from "../tools/check-style.js";

function whats(src, lang) {
  return checkSource(src, lang).map((h) => {
    return h.what;
  }).join(" | ");
}

test("js: one-line arrow, one-line body, two statements, if-body on one line are caught", () => {
  assert.match(whats("const f = (x) => x * 2;\n", "js"), /one-line arrow/);
  assert.match(whats("function f(x) { return x; }\n", "js"), /one-line function body/);
  assert.match(whats("let a = 1; let b = 2;\n", "js"), /more than one statement/);
  assert.match(whats("if (a) b();\n", "js"), /same line as if/);
  assert.match(whats("} else b();\n", "js"), /same line as else/);
});

test("js: strings, regex literals and for-headers are not mistaken for code", () => {
  assert.equal(whats("const s = \"a; b => c\";\n", "js"), "");
  assert.equal(whats("const r = /\\{(\\w+);\\}/g;\n", "js"), "");
  assert.equal(whats("for (let i = 0; i < n.size(); i++) {\n}\n", "js"), "");
});

test("cpp and py rules", () => {
  assert.match(whats("auto f = [&]() { return 1; };\n", "cpp"), /one-line lambda/);
  assert.match(whats("for (int i = 0; i < 3; ++i) next();\n", "cpp"), /same line as for/);
  assert.match(whats("for _ in range(3): nxt()\n", "py"), /same line as the colon/);
  assert.match(whats("import sys; import os\n", "py"), /more than one statement/);
  assert.match(whats("f = lambda x: x\n", "py"), /lambda/);
  assert.equal(whats("d = {w: row() for w in words}\n", "py"), "");
});

test("file-level rules: >200 lines, CRLF, comment block >3 lines", () => {
  assert.match(whats("x\n".repeat(201), "js"), /201 lines/);
  assert.match(whats("x\r\n", "js"), /CRLF/);
  assert.match(whats("// 1\n// 2\n// 3\n// 4\n", "js"), /comment block/);
  assert.equal(whats("// 1\n// 2\n// 3\nx\n", "js"), "");
});

test("every file in tools/style-scope.json follows the rules", () => {
  const scope = JSON.parse(readFileSync(new URL("../tools/style-scope.json", import.meta.url), "utf8"));
  for (const f of scope.files) {
    const ext = f.split(".").pop();
    const lang = ext === "py" ? "py" : ext === "cpp" ? "cpp" : "js";
    const src = readFileSync(new URL("../" + f, import.meta.url), "utf8");
    assert.deepEqual(checkSource(src, lang), [], f);
  }
});

test("review cycle 1 gaps: else-if body, function expressions, line numbers after a backslash-newline", () => {
  assert.match(whats("} else if (a) b();\n", "js"), /same line as if/);
  assert.match(whats("const f = function (x) { return x };\n", "js"), /one-line function body/);
  assert.match(whats("xs.forEach(function (x) { f(x) });\n", "js"), /one-line function body/);
  const hits = checkSource("const s = `a\\\nb`;\nlet a = 1; let b = 2;\n", "js");
  assert.deepEqual(hits.map((h) => {
    return h.line;
  }), [3]);
  assert.match(whats("/* 1\n\n2\n3\n4 */\n", "js"), /comment block/);
});
