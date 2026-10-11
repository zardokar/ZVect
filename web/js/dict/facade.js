// dict/facade.js — createDict({ source, store }): builds the facade described in index.js. No side effects on import, so it can be
// tested in Node with memoryStore() and a source that reads the JSON files from disk (tests/dict.test.js).
import { jsonFileSource, localStorageStore } from "./adapters.js";
import { LANGS, FILES, clone, emptyMine, parseDefaults, validMine, build, checkWord, withWord, withoutWord } from "./model.js";

export const STORAGE_KEY = "zvect.dict";

export async function createDict({ source = jsonFileSource(FILES), store = localStorageStore(STORAGE_KEY) } = {}) {
  const defaults = parseDefaults((await source.load()).texts);
  const stored = store.read();
  const data = build(defaults, stored && validMine(stored.mine) ? stored.mine : emptyMine());
  if (!stored || stored.version !== data.version || !validMine(stored.mine)) store.write(data);   // insert / refresh the stored copy
  let changed = false;

  // another tab may have edited the dictionary since this page loaded: start every edit from the stored copy
  const freshMine = () => { const st = store.read(); return st && validMine(st.mine) ? clone(st.mine) : clone(data.mine); };
  const commit = (mine) => {
    const d = build(defaults, mine);
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, d);
    store.write(data);
    changed = true;
  };
  const rowOf = (en) => { const w = String(en ?? "").trim().toLowerCase(); return w ? data.words.en[w] || w : ""; };

  const facade = {
    langs: LANGS,
    data,
    get changed() { return changed; },
    rowOf,
    isNewRow: (en) => !!rowOf(en) && !Object.hasOwn(data.meanings, rowOf(en)),
    isMine: (lang, word) => Object.hasOwn(data.mine.words[lang], word),
    wordsOf: (lang, row) => Object.entries(data.words[lang]).filter(([, x]) => x === row).map(([w]) => w),
    // add one word to a row; returns the cleaned word, throws a Thai message when the word cannot be added
    add(lang, word, row, vec = null) {
      const mine = freshMine();
      const ok = checkWord(data, mine, lang, word, row, vec);
      commit(withWord(mine, data, lang, ok.word, ok.meaning, vec));
      return ok.word;
    },
    // the Dict form: the EN word names the row, every filled box is added, words already in that row are skipped
    addRow(words, vec = null) {
      const row = rowOf(words.en);
      const out = { row, added: [], skipped: [], errors: [] };
      if (!row) { out.errors.push(["en", "พิมพ์คำในช่อง EN (ใช้เป็นชื่อแถว)"]); return out; }
      for (const lang of LANGS) {
        const w = String(words[lang] ?? "").trim();
        if (!w) continue;
        if (data.words[lang][w.toLowerCase()] === row || data.words[lang][w] === row) { out.skipped.push([lang, w]); continue; }
        try { out.added.push([lang, facade.add(lang, w, row, vec)]); } catch (e) { out.errors.push([lang, e.message]); }
      }
      return out;
    },
    remove(lang, word) { commit(withoutWord(freshMine(), lang, word)); },
    reset() { commit(emptyMine()); },
    // the whole stored dictionary, same shape as the files in web/data/dict (plus "mine" = what the learner added)
    exportJSON: () => JSON.stringify({ version: data.version, axes: data.axes, meanings: data.meanings, words: data.words,
      negation: data.neg, mine: data.mine }, null, 2),
  };
  return facade;
}
