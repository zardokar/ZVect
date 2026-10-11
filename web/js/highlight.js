// highlight.js — a very small syntax highlighter for JS, Python and C++.
// One regex pass: comments, strings, numbers, keywords. Everything else is escaped text.

const KW = {
  js: "import|from|export|const|let|var|function|return|for|of|in|if|else|new|true|false|null|undefined|async|await",
  py: "import|from|def|return|for|in|if|else|elif|lambda|not|and|or|True|False|None|print",
  cpp: "include|int|double|float|auto|const|return|for|if|else|using|namespace|std|struct|inline|size_t|true|false",
};
const COMMENT = { js: "\\/\\/[^\\n]*", cpp: "\\/\\/[^\\n]*|#include", py: "#[^\\n]*" };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlight(src, lang) {
  const re = new RegExp(
    `(${COMMENT[lang]})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\`)|(\\b\\d+(?:\\.\\d+)?\\b)|\\b(${KW[lang]})\\b`,
    "g"
  );
  let out = "", last = 0;
  for (const m of src.matchAll(re)) {
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? (m[1] === "#include" ? "kw" : "com") : m[2] ? "str" : m[3] ? "num" : "kw";
    out += `<span class="tok-${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
}
