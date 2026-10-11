// dict/model.js — the dictionary rules with no I/O: build the merged view, check a word, add / remove in the learner's part.
// Shapes: defaults = { version, axes, meanings: { id: [food, animal, tech] }, words: { lang: { word: id } }, neg: { word: side } }
//         mine     = { words: { lang: { word: id } }, meanings: { id: vec } }          (what the learner added)
//         data     = defaults + mine merged, plus data.mine
export const LANGS = ["en", "th", "zh", "jp"];
export const FILES = ["meanings", ...LANGS, "negation"];
const NAME = /^[a-z][a-z0-9_-]*$/;

export const clone = (o) => JSON.parse(JSON.stringify(o));
export const emptyMine = () => ({ words: Object.fromEntries(LANGS.map((l) => [l, {}])), meanings: {} });
const isVec = (v) => Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === "number" && isFinite(x));
const plain = (o) => !!o && typeof o === "object" && !Array.isArray(o);

// the default files → defaults; version = a short hash of the files, so a new default word reaches browsers with a stored copy
export function parseDefaults(texts) {
  const raw = Object.fromEntries(FILES.map((f) => [f, JSON.parse(texts[f])]));
  let h = 5381;
  for (const f of FILES) for (let i = 0; i < texts[f].length; i++) h = ((h * 33) ^ texts[f].charCodeAt(i)) >>> 0;
  return { version: h.toString(36), axes: raw.meanings.axes, meanings: raw.meanings.vectors,
    words: Object.fromEntries(LANGS.map((l) => [l, raw[l]])), neg: raw.negation };
}

export function validMine(m) {
  if (!plain(m) || !plain(m.words) || !plain(m.meanings)) return false;
  if (!Object.entries(m.meanings).every(([k, v]) => NAME.test(k) && isVec(v))) return false;
  return LANGS.every((l) => plain(m.words[l]) &&
    Object.entries(m.words[l]).every(([w, x]) => typeof w === "string" && w.length > 0 && w.length <= 40 && typeof x === "string" && NAME.test(x)));
}

// defaults + the learner's own words (theirs win when the same word is in both); a word whose meaning has no vector is dropped
export function build(defaults, mine) {
  const d = clone(defaults);
  Object.assign(d.meanings, mine.meanings);
  for (const l of LANGS) Object.assign(d.words[l], mine.words[l]);
  for (const l of LANGS) for (const [w, m] of Object.entries(d.words[l])) if (!Object.hasOwn(d.meanings, m)) delete d.words[l][w];
  d.mine = mine;
  return d;
}

const clean = (s) => String(s).trim().replace(/\s+/g, " ");

// check one word against the merged data; returns the cleaned { word, meaning } or throws a Thai message for the learner
export function checkWord(data, mine, lang, word, meaning, vec) {
  word = clean(word); meaning = clean(meaning).toLowerCase();
  if (!LANGS.includes(lang)) throw new Error("ภาษาไม่ถูกต้อง");
  if (!word) throw new Error("ยังไม่ได้พิมพ์คำ");
  if (lang === "en") {
    word = word.toLowerCase();
    if (!/^[a-z0-9]+$/.test(word)) throw new Error("คำภาษาอังกฤษใช้ได้แค่ a–z และ 0–9 (หนึ่งคำ)");
  } else {
    if (/[\s\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]/.test(word)) throw new Error("คำต้องไม่มีช่องว่างหรือเครื่องหมาย");
    if (/[A-Za-z]/.test(word)) throw new Error("ตัว a–z เป็นคำภาษาอังกฤษ ให้ใส่ในช่อง EN");
  }
  if (word.length > 40) throw new Error("คำยาวเกินไป (ไม่เกิน 40 ตัว)");
  if (!NAME.test(meaning)) throw new Error("ชื่อแถวต้องเป็นภาษาอังกฤษตัวเล็ก เช่น noodle");
  if (Object.hasOwn(data.neg, word)) throw new Error(`"${word}" เป็นคำปฏิเสธอยู่แล้ว ใช้เป็นคำทั่วไปไม่ได้`);
  if (data.words[lang][word] === meaning) throw new Error("มีคำนี้ที่ความหมายนี้อยู่แล้ว");
  // the tokenizers look a written word up in every language: the same spelling must not mean two things
  for (const l of LANGS) if (l !== lang && Object.hasOwn(data.words[l], word) && data.words[l][word] !== meaning)
    throw new Error(`"${word}" มีอยู่แล้วในภาษา ${l} ที่ความหมาย ${data.words[l][word]}`);
  if (!Object.hasOwn(data.meanings, meaning) && !Object.hasOwn(mine.meanings, meaning) &&
    (!isVec(vec) || !vec.every((x) => x >= 0 && x <= 1) || vec.every((x) => x === 0)))
    throw new Error("แถวใหม่ต้องมีค่า food, animal, tech อย่างละ 0 ถึง 1 และไม่เป็น 0 ทั้งหมด");
  return { word, meaning };
}

// pure edits on a copy of mine
export function withWord(mine, data, lang, word, meaning, vec) {
  const m = clone(mine);
  if (!Object.hasOwn(data.meanings, meaning) && !Object.hasOwn(m.meanings, meaning)) m.meanings[meaning] = vec.map((x) => Math.round(x * 100) / 100);
  m.words[lang][word] = meaning;
  return m;
}
export function withoutWord(mine, lang, word) {
  const m = clone(mine);
  delete m.words[lang][word];
  // a meaning the learner made and no word uses any more is removed too
  for (const id of Object.keys(m.meanings)) if (!LANGS.some((l) => Object.values(m.words[l]).includes(id))) delete m.meanings[id];
  return m;
}
