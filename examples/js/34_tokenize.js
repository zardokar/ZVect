// 34 Tokenization: cut text into tokens (characters or words), then look each token up in a vocabulary.
// Character vocabulary from the BPE clip: a-z = 1-26, ! @ # $ = 27-30. Word vocabulary = the unique words of a small
// training corpus, sorted like a dictionary. A token that is not in the vocabulary gets "?". ASCII text only.
const CHARS = "abcdefghijklmnopqrstuvwxyz!@#$".split("");
const charId = (ch) => { const i = CHARS.indexOf(ch); return i < 0 ? "?" : String(i + 1); };

const CORPUS = ["my dog eats fish", "i write code on my computer", "the app on my phone has a bug",
  "i want to eat noodles", "a robot dog that can bark", "pets like cats and dogs"];
const WORDS = [...new Set(CORPUS.join(" ").split(/\s+/))].sort();
const wordId = (w) => { const i = WORDS.indexOf(w); return i < 0 ? "?" : String(i + 1); };

console.log("char vocabulary: " + CHARS.length);
const text = "hello there you are amazing";
let n = 0;
for (const w of text.split(/\s+/)) { const ids = w.split("").map(charId); n += ids.length; console.log(w + " -> " + ids.join(" ")); }
console.log("by character: " + n + " numbers (spaces get no number)");
console.log("by word: " + text.split(/\s+/).length + " numbers");

console.log("word vocabulary: " + WORDS.length + " words");
console.log(WORDS.map((w, i) => w + ":" + (i + 1)).join(" "));
const s = "my dog eats fish";
console.log(s + " -> " + s.split(/\s+/).map(wordId).join(" "));
console.log("zebra by character -> " + "zebra".split("").map(charId).join(" "));
console.log("zebra by word -> " + wordId("zebra") + "  (not in the training corpus)");
