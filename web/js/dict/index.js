// dict/index.js — the ONE entry point to the multilingual toy dictionary (owner, 2026-10-11 22:13: "แยก Code เกี่ยวกับ Dict ใส่ dir
// แยก … ทำเป็น Adapter ไว้เรียกใช้เขียนแบบ Facade"). Used by 3.1 Tokenization, 6.1 Bi-Encoder, 6.2 Late interaction, 6.3 Reranker
// (through multilang.js) and by the Dict page (page.js). Nothing outside this folder imports adapters.js or model.js.
//
//   import { dict } from "./dict/index.js";
//   dict.langs                      → ["en", "th", "zh", "jp"]
//   dict.data                       → { axes, meanings, words, neg, mine, version } (live object; lessons read it at load time)
//   dict.rowOf("pets")              → "pet"  (the row an EN word goes to; a new EN word names a new row)
//   dict.isNewRow("soup")           → true   (needs a food / animal / tech vector)
//   dict.addRow({ en, th, zh, jp }, vec) → { row, added: [[lang, word]], skipped: [[lang, word]], errors: [[lang, message]] }
//   dict.add(lang, word, row, vec) · dict.remove(lang, word) · dict.reset() · dict.isMine(lang, word) · dict.exportJSON()
//   dict.changed                    → true after an edit (lessons computed at load time: the app reloads on leaving the Dict page)
//
// Defaults live in web/data/dict/*.json (source adapter); the merged copy + the learner's words live in localStorage
// "zvect.dict" (store adapter). Swap either with createDict({ source, store }).
import { createDict } from "./facade.js";
export { createDict, STORAGE_KEY } from "./facade.js";
export { jsonFileSource, localStorageStore, memoryStore } from "./adapters.js";

// the app's dictionary (defaults from the JSON files, kept in this browser's localStorage)
export const dict = await createDict();
