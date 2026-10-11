// dict.js — the multilingual toy dictionary used by 3.1 Tokenization, 6.1 Bi-Encoder, 6.2 Late interaction and 6.3 Reranker
// (owner, 2026-10-11 16:12–16:15: "แยกออกมาเป็น json dir เอาของพวกนี้ออกจาก code", "เวลาใช้จริงคือ ข้อมูล insert เข้า
// localStorage", "อยากได้ menu เพิ่มคำ", "ขอปุ่ม export").
// Defaults live in web/data/dict/*.json. On first use (or when the defaults change) they are inserted into this browser's
// localStorage under "zvect.dict", together with the words the learner added on the Dict page (#/dict). Every lesson reads
// the stored copy. Private mode or blocked storage: the defaults are used and nothing is saved.
const FILES = ["meanings", "en", "th", "zh", "jp", "negation"];
const KEY = "zvect.dict";
export const DICT_LANGS = ["en", "th", "zh", "jp"];

const texts = await Promise.all(FILES.map((f) =>
  fetch(new URL(`../data/dict/${f}.json`, import.meta.url)).then((r) => { if (!r.ok) throw new Error(f + ".json " + r.status); return r.text(); })));
const raw = Object.fromEntries(FILES.map((f, i) => [f, JSON.parse(texts[i])]));
// version = a short hash of the default files, so a new default word reaches browsers that already have a stored copy
let h = 5381;
for (const t of texts) for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
export const DEFAULTS = {
  version: h.toString(36), axes: raw.meanings.axes, meanings: raw.meanings.vectors,
  words: Object.fromEntries(DICT_LANGS.map((l) => [l, raw[l]])), neg: raw.negation,
};

const clone = (o) => JSON.parse(JSON.stringify(o));
const emptyMine = () => ({ words: Object.fromEntries(DICT_LANGS.map((l) => [l, {}])), meanings: {} });
const isVec = (v) => Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === "number" && isFinite(x));
const plain = (o) => !!o && typeof o === "object" && !Array.isArray(o);
const NAME = /^[a-z][a-z0-9_-]*$/;
function validMine(m) {
  if (!plain(m) || !plain(m.words) || !plain(m.meanings)) return false;
  if (!Object.entries(m.meanings).every(([k, v]) => NAME.test(k) && isVec(v))) return false;
  return DICT_LANGS.every((l) => plain(m.words[l]) &&
    Object.entries(m.words[l]).every(([w, x]) => typeof w === "string" && w.length > 0 && w.length <= 40 && typeof x === "string" && NAME.test(x)));
}
// defaults + the learner's own words (theirs win when the same word is in both)
function build(mine) {
  const d = clone(DEFAULTS);
  Object.assign(d.meanings, mine.meanings);
  for (const l of DICT_LANGS) Object.assign(d.words[l], mine.words[l]);
  for (const l of DICT_LANGS) for (const [w, m] of Object.entries(d.words[l])) if (!Object.hasOwn(d.meanings, m)) delete d.words[l][w];   // no vector = drop (orphan word)
  d.mine = mine;
  return d;
}
function load() {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(KEY)); } catch { stored = null; }
  const mine = stored && validMine(stored.mine) ? stored.mine : emptyMine();
  const d = build(mine);
  if (!stored || stored.version !== d.version || !validMine(stored.mine)) save(d);   // insert into localStorage
  return d;
}
function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage blocked: defaults only */ } }

export const DICT = load();
export let changed = false;                                  // lessons computed at load time: reload after an edit

// ---------- edits (Dict page) ----------
const clean = (s) => String(s).trim().replace(/\s+/g, " ");
// another tab may have edited the dictionary since this page loaded: start every edit from the stored copy
function freshMine() {
  try { const st = JSON.parse(localStorage.getItem(KEY)); if (st && validMine(st.mine)) return clone(st.mine); } catch { /* use ours */ }
  return clone(DICT.mine);
}
export function addWord(lang, word, meaning, vec = null) {
  word = clean(word); meaning = clean(meaning).toLowerCase();
  if (!DICT_LANGS.includes(lang)) throw new Error("ภาษาไม่ถูกต้อง");
  if (!word) throw new Error("ยังไม่ได้พิมพ์คำ");
  if (lang === "en") {
    word = word.toLowerCase();
    if (!/^[a-z0-9]+$/.test(word)) throw new Error("คำภาษาอังกฤษใช้ได้แค่ a–z และ 0–9 (หนึ่งคำ)");
  } else {
    if (/[\s\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]/.test(word)) throw new Error("คำต้องไม่มีช่องว่างหรือเครื่องหมาย");
    if (/[A-Za-z]/.test(word)) throw new Error("ตัว a–z เป็นคำภาษาอังกฤษ ให้เลือกภาษา English");
  }
  if (word.length > 40) throw new Error("คำยาวเกินไป (ไม่เกิน 40 ตัว)");
  if (!NAME.test(meaning)) throw new Error("ความหมายเขียนเป็นภาษาอังกฤษตัวเล็ก เช่น noodle");
  if (Object.hasOwn(DICT.neg, word)) throw new Error(`"${word}" เป็นคำปฏิเสธอยู่แล้ว ใช้เป็นคำทั่วไปไม่ได้`);
  if (DICT.words[lang][word] === meaning) throw new Error("มีคำนี้ที่ความหมายนี้อยู่แล้ว");
  // the tokenizers look a written word up in every language: the same spelling must not mean two things
  for (const l of DICT_LANGS) if (l !== lang && Object.hasOwn(DICT.words[l], word) && DICT.words[l][word] !== meaning)
    throw new Error(`"${word}" มีอยู่แล้วในภาษา ${l} ที่ความหมาย ${DICT.words[l][word]}`);
  const mine = freshMine();
  if (!Object.hasOwn(DICT.meanings, meaning) && !Object.hasOwn(mine.meanings, meaning)) {
    if (!isVec(vec) || !vec.every((x) => x >= 0 && x <= 1) || vec.every((x) => x === 0))
      throw new Error("ความหมายใหม่ต้องมีเวกเตอร์ 3 ค่า (food, animal, tech) แต่ละค่า 0 ถึง 1 และไม่เป็น 0 ทั้งหมด");
    mine.meanings[meaning] = vec.map((x) => Math.round(x * 100) / 100);
  }
  mine.words[lang][word] = meaning;
  commit(mine);
  return word;
}
export function removeWord(lang, word) {
  const mine = freshMine();
  delete mine.words[lang][word];
  // a meaning the learner made and no word uses any more is removed too
  for (const m of Object.keys(mine.meanings)) if (!DICT_LANGS.some((l) => Object.values(mine.words[l]).includes(m))) delete mine.meanings[m];
  commit(mine);
}
export function resetDict() { commit(emptyMine()); }
export const isMine = (lang, word) => Object.hasOwn(DICT.mine.words[lang], word);
function commit(mine) {
  const d = build(mine);
  for (const k of Object.keys(DICT)) delete DICT[k];
  Object.assign(DICT, d);
  save(DICT);
  changed = true;
}
// the whole stored dictionary, same shape as the files in web/data/dict (plus "mine" = what the learner added)
export function exportJSON() {
  return JSON.stringify({ version: DICT.version, axes: DICT.axes, meanings: DICT.meanings, words: DICT.words, negation: DICT.neg, mine: DICT.mine }, null, 2);
}
