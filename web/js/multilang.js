// multilang.js — the toy multilingual encoder shared by 6.1 Bi-Encoder, 6.2 Late interaction and 6.3 Reranker (WIP202610029).
// One idea: a multilingual encoder puts sentences with the same meaning in the same place, whatever the
// language — but only if the text is first cut into words correctly. Thai, Chinese and Japanese do not put
// spaces between words, so "split at spaces" gives one big unknown chunk; a dictionary (longest match) works.
// Everything here is a toy chosen by the author: 3 axes (food, animal, tech), a few words per language, one
// shared vocabulary for all four languages (real multilingual models also share one vocabulary).
import { words, mean, normalize } from "../../lib/zvect.js";

// language chips: key = CSS colour variable and scene colour key (owner's mock: EN pink, TH yellow, 中文 green, 日本語 blue)
export const LANGS = [
  { id: "en", label: "EN", css: "--va", sc: "a", dash: null },
  { id: "th", label: "TH", css: "--vb", sc: "b", dash: [9, 6] },
  { id: "zh", label: "中文", css: "--y", sc: "y", dash: [4, 5] },
  { id: "jp", label: "日本語", css: "--z", sc: "z", dash: [1.5, 5] },
];
export const LANG = Object.fromEntries(LANGS.map((l) => [l.id, l]));
export const AXIS_NAMES = ["food", "animal", "tech"];

// The dictionary itself (meaning -> vector on the axes food, animal, tech; written word -> meaning, per language; negation
// words) lives in web/data/dict/*.json and is read through the dict facade (web/js/dict/index.js), which keeps a copy in localStorage with the words the
// learner added on the Dict page (#/dict). Same numbers as before the move (2026-10-11 16:12).
import { dict } from "./dict/index.js";
const DICT = dict.data;
const CV = DICT.meanings;
const WORDS = DICT.words;
// negation words (6.3): which side the denied word sits on. English, Thai, Chinese: before; Japanese ない: after.
export const NEG = DICT.neg;
// the six four-language samples shared by 3.1 and 6.1 (web/data/samples.json)
export const SAMPLES = await fetch(new URL("../data/samples.json", import.meta.url)).then((r) => r.json());
// which language a word or character belongs to, for colouring vocabulary lists (first language that has it)
export function langOf(t) {
  for (const l of LANGS) if (Object.hasOwn(WORDS[l.id], t)) return l;
  return null;
}
export const vecOf = (meaning) => CV[meaning];

const isWord = (c) => typeof c === "string" && Object.hasOwn(CV, c);   // a meaning with a vector (not "NOT", not unknown)
const LEX = Object.assign({}, ...Object.values(WORDS));          // one shared vocabulary
const KNOWN = { ...LEX, ...Object.fromEntries(Object.keys(NEG).map((w) => [w, "NOT"])) };
const MAXLEN = Math.max(...Object.keys(KNOWN).map((w) => [...w].length));
export const vocab = (lang) => Object.keys(WORDS[lang]);

// split by spaces and punctuation: the lib's words() (works for English, one big chunk for Thai / Chinese / Japanese)
// split by dictionary: inside each chunk, take the LONGEST known word at each position; unknown letters are kept
// together as one grey chunk. Returns [{ t: text, c: meaning | "NOT" | null }].
export function split(text, mode) {
  const out = [];
  for (const chunk of words(text)) {
    // English already has spaces: an all-ASCII chunk is one word in both modes (no "cat" inside "category")
    if (mode === "space" || /^[\x00-\x7f]+$/.test(chunk)) { out.push({ t: chunk, c: Object.hasOwn(KNOWN, chunk) ? KNOWN[chunk] : null }); continue; }
    const ch = [...chunk];
    let unk = "";
    for (let i = 0; i < ch.length;) {
      let hit = 0;
      for (let n = Math.min(MAXLEN, ch.length - i); n > 0 && !hit; n--) if (Object.hasOwn(KNOWN, ch.slice(i, i + n).join(""))) hit = n;
      if (!hit) { unk += ch[i]; i++; continue; }
      if (unk) { out.push({ t: unk, c: null }); unk = ""; }
      const w = ch.slice(i, i + hit).join("");
      out.push({ t: w, c: KNOWN[w] });
      i += hit;
    }
    if (unk) out.push({ t: unk, c: null });
  }
  return out;
}
// q = normalize(mean of the vectors of the known words); zero vector when no word is known
export function encodeTokens(tokens) {
  const vs = tokens.filter((x) => isWord(x.c)).map((x) => CV[x.c]);
  return vs.length ? normalize(mean(vs)) : [0, 0, 0];
}
// 6.3 toy reranker: meanings of the query found in the doc, not counting a doc word that a negation word denies
// (the nearest known word before "not / ไม่ / 不" or after "ない")
export function matches(qTokens, dTokens) {
  const want = new Set(qTokens.filter((x) => isWord(x.c)).map((x) => x.c));
  const k = dTokens.filter((x) => x.c), found = new Set();
  k.forEach((x, i) => {
    if (!isWord(x.c) || !want.has(x.c)) return;
    const denied = (i > 0 && NEG[k[i - 1].t] === "before") || (i + 1 < k.length && NEG[k[i + 1].t] === "after");
    if (!denied) found.add(x.c);
  });
  return found.size;
}

// chips for the "แทนค่า" box: known words in the language colour, unknown chunks grey
export function chips(tokens, css) {
  if (!tokens.length) return '<span class="dim">(ว่าง)</span>';
  return tokens.map((x) => `<span class="tok${x.c ? (x.c === "NOT" ? " neg" : " k") : ""}" style="--c: var(${css})">${esc(x.t)}</span>`).join("");
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// the controls both lessons share: languages to show (several at once), how to split, sample sentences, the query box.
// st = { show: [ids], type: id, mode: "space" | "dict", text: { en, th, zh, jp } }
// The typed language is always shown (owner, 2026-10-11 14:03: at least one language on, EN by default): picking a
// typing language turns it on, and turning the typed language off moves typing to the first language still on.
export function mountPanel(ui, st, presets) {
  ui.panel.classList.add("stack");               // one control per row: languages / split / samples / query
  const opts = LANGS.map((l) => [l.id, l.label, l.css]);
  const show = ui.toggles("แสดง", opts, st, "show", { all: "ทั้งหมด", allOff: () => [st.type],
    after: () => { if (!st.show.includes(st.type)) { st.type = st.show[0]; box.sync(); } } });
  ui.choice("ตัดคำ", [["space", "ช่องว่าง"], ["dict", "พจนานุกรม"]], st, "mode");
  ui.buttons("ตัวอย่าง (เติมครบ 4 ภาษา)", presets.map((p) => [p.label, () => { st.text = { ...p.text }; box.sync(); }]),
    { pressed: () => presets.findIndex((p) => p.text[st.type] === st.text[st.type]) });   // the sample now in the query box
  const box = ui.tagText("คำถาม", opts, st, "type", "text", "พิมพ์คำถาม",
    () => { if (!st.show.includes(st.type)) { st.show.push(st.type); show.sync(); } });
  return { show, box };
}
// the sample a sentence came from (to say right / wrong), or null when the learner typed something else
export const sampleOf = (presets, lang, text) => presets.find((p) => p.text[lang] === text) || null;
