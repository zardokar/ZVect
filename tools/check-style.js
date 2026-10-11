// check-style.js — enforces the coder rules on the files listed in tools/style-scope.json (new work only, owner 2026-10-12).
// Prints `file:line what-is-wrong` for every hit and exits 1; PASS exits 0. Run: npm run style  (or: node tools/check-style.js f1 f2)
// Rules: <=200 lines · LF only · comment block <=3 lines · no one-line function · one statement per line · loop/if body on its own line.
import { readFileSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { mask } from "./style-mask.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_LINES = 200;
const MAX_COMMENT = 3;

function langOf(file) {
  const ext = extname(file).slice(1);
  if (ext === "py") {
    return "py";
  }
  return ext === "cpp" || ext === "hpp" ? "cpp" : "js";
}

// index just after the bracket that closes the one at `start` (or -1)
function closeOf(code, start) {
  const open = code[start];
  const shut = { "(": ")", "[": "]", "{": "}" }[open];
  let depth = 0;
  for (let i = start; i < code.length; i++) {
    if (code[i] === open) {
      depth++;
    } else if (code[i] === shut) {
      depth--;
      if (depth === 0) {
        return i + 1;
      }
    }
  }
  return -1;
}

// one line of C-like code (js / cpp) -> list of problems
function cLikeLine(code) {
  const hits = [];
  const t = code.trim();
  const arrow = code.indexOf("=>");
  if (arrow >= 0 && code.slice(arrow + 2).trim() !== "{") {
    hits.push("one-line arrow function (give it a braced body on its own lines)");
  }
  const oneLineBody = /^(async\s+)?(function\b.*|[A-Za-z_$][\w$:<>,\s*&]*\([^;]*\)\s*(const\s*)?)\{.*\}\s*[;,]?$/;
  const control = /^(if|for|while|switch|catch|else|do|return)\b/;
  const fnExpr = /\bfunction\b[^{]*\([^)]*\)\s*\{.*\}/;
  if ((oneLineBody.test(t) && !control.test(t)) || fnExpr.test(t)) {
    hits.push("one-line function body");
  }
  if (/\]\s*\([^)]*\)\s*(mutable\s*)?\{.*\}/.test(t)) {
    hits.push("one-line lambda");
  }
  const head = t.match(/^(\}\s*)?(else\s+)?(if|for|while)\s*\(/);
  if (head) {
    const after = closeOf(t, t.indexOf("(", head[0].length - 1));
    const rest = after < 0 ? "" : t.slice(after).trim();
    if (rest !== "" && rest !== "{") {
      hits.push("body on the same line as " + head[3] + " (put it on its own line)");
    }
  }
  const other = t.match(/^(\}\s*)?else\b(.*)$/);
  if (other && !/^\s*(\{?|if\b.*)$/.test(other[2])) {
    hits.push("body on the same line as else (put it on its own line)");
  }
  const forEnd = /^for\s*\(/.test(t) ? closeOf(t, t.indexOf("(")) : 0;
  const semis = t.slice(Math.max(forEnd, 0)).split(";").slice(1);
  if (semis.some((rest) => {
    return rest.trim() !== "";
  })) {
    hits.push("more than one statement on the line");
  }
  return hits;
}

// one line of Python code -> list of problems
function pyLine(code) {
  const hits = [];
  const t = code.trim();
  if (/\blambda\b/.test(t)) {
    hits.push("lambda (write a def with its own lines)");
  }
  if (t.includes(";")) {
    hits.push("more than one statement on the line");
  }
  if (/^(if|elif|else|for|while|def|class|with|try|except|finally)\b/.test(t)) {
    let depth = 0;
    for (let i = 0; i < t.length; i++) {
      depth += "([{".includes(t[i]) ? 1 : ")]}".includes(t[i]) ? -1 : 0;
      if (t[i] === ":" && depth === 0) {
        if (t.slice(i + 1).trim() !== "") {
          hits.push("body on the same line as the colon");
        }
        break;
      }
    }
  }
  return hits;
}

// all problems of one file: [{ line, what }]
export function checkSource(src, lang) {
  const hits = [];
  const lines = src.endsWith("\n") ? src.slice(0, -1).split("\n") : src.split("\n");
  if (lines.length > MAX_LINES) {
    hits.push({ line: lines.length, what: `${lines.length} lines (max ${MAX_LINES}; split by category)` });
  }
  if (src.includes("\r")) {
    hits.push({ line: 1, what: "CRLF line endings (this repo is LF, .gitattributes)" });
  }
  let run = 0;
  mask(src, lang).forEach((l, i) => {
    const commentOnly = l.hasComment && l.code.trim() === "";
    run = commentOnly ? run + 1 : 0;
    if (run === MAX_COMMENT + 1) {
      hits.push({ line: i + 1, what: `comment block longer than ${MAX_COMMENT} lines (move the rest to docs/)` });
    }
    const found = lang === "py" ? pyLine(l.code) : cLikeLine(l.code);
    for (const what of found) {
      hits.push({ line: i + 1, what });
    }
  });
  return hits;
}

function main() {
  const args = process.argv.slice(2);
  const scope = JSON.parse(readFileSync(join(ROOT, "tools", "style-scope.json"), "utf8"));
  const files = args.length ? args : scope.files;
  let bad = 0;
  for (const f of files) {
    const hits = checkSource(readFileSync(join(ROOT, f), "utf8"), langOf(f));
    for (const h of hits) {
      console.log(`${f}:${h.line}  ${h.what}`);
    }
    bad += hits.length;
  }
  console.log(bad ? `\nFAIL: ${bad} problem(s)` : `PASS: ${files.length} files follow the coder rules`);
  process.exitCode = bad ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
