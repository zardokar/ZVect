// style-mask.js — the tokenizer of tools/check-style.js: source -> lines of CODE only (strings "S", regex "R", comments dropped).
// Knows js / cpp / py quotes, // # /* */ comments, Python triple quotes and JS regex literals.
const QUOTES = { js: ["'", '"', "`"], cpp: ["'", '"'], py: ["'", '"'] };
const LINE_COMMENT = { js: "//", cpp: "//", py: "#" };
const BEFORE_REGEX = "(,=:[!&|?{};+-*%<>~^";

// a "/" starts a JS regex literal when the code before it cannot end an expression
function startsRegex(code) {
  const prev = code.trimEnd();
  if (prev === "") {
    return true;
  }
  return BEFORE_REGEX.includes(prev[prev.length - 1]) || /\breturn$/.test(prev);
}

// index of the "/" that closes the regex literal opened at `start` (escapes and [...] classes skipped)
function regexEnd(src, start) {
  let inClass = false;
  for (let i = start + 1; i < src.length && src[i] !== "\n"; i++) {
    if (src[i] === "\\") {
      i++;
    } else if (src[i] === "[") {
      inClass = true;
    } else if (src[i] === "]") {
      inClass = false;
    } else if (src[i] === "/" && !inClass) {
      return i;
    }
  }
  return -1;
}

// split source into lines of CODE only: strings become "S", comments are dropped (and remembered per line)
export function mask(src, lang) {
  const out = [];
  let code = "";
  let hasComment = false;
  let quote = null;
  let block = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const two = src.slice(i, i + 2);
    const three = src.slice(i, i + 3);
    if (ch === "\n") {
      out.push({ code, hasComment: hasComment || block });
      code = "";
      hasComment = false;
      continue;
    }
    if (block) {
      hasComment = true;
      if (two === "*/") {
        block = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (ch === "\\" && src[i + 1] !== "\n") {
        i++;
      } else if (src.startsWith(quote, i)) {
        i += quote.length - 1;
        quote = null;
      }
      continue;
    }
    if (src.startsWith(LINE_COMMENT[lang], i)) {
      hasComment = true;
      const end = src.indexOf("\n", i);
      i = (end < 0 ? src.length : end) - 1;
      continue;
    }
    if (lang !== "py" && two === "/*") {
      block = true;
      hasComment = true;
      i++;
      continue;
    }
    if (lang === "py" && (three === '"""' || three === "'''")) {
      quote = three;
      code += "S";
      i += 2;
      continue;
    }
    if (lang === "js" && ch === "/" && startsRegex(code)) {
      const end = regexEnd(src, i);
      if (end > i) {
        code += "R";
        i = end;
        continue;
      }
    }
    if (QUOTES[lang].includes(ch)) {
      quote = ch;
      code += "S";
      continue;
    }
    code += ch;
  }
  out.push({ code, hasComment });
  return out;
}

