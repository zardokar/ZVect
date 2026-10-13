# Coding Challenge #40.3: TF-IDF — The Coding Train - Claude Context
> Source: YouTube, The Coding Train, "Coding Challenge #40.3: TF-IDF", 32:02, published 2016-10-12 · https://www.youtube.com/watch?v=RPMYV-eb6lI · Generated: 2026-10-13
> Companion: 20161012_Coding-Challenge-40-3-TF-IDF.html (Thai, iw mode `iwd`, 15 sections, 16 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); board equations, on-screen code and printed numbers transcribed exactly.
- Frames used: 01_word-counts-rainbow, 02_board-1-over-df, 03_board-50-not-updated, 04_board-500-5000, 05_board-log, 06_code-preload, 07_code-tf-object, 08_code-df-first-try, 09_code-true-vs-1, 10_console-a-df4, 11_code-othercounts, 12_code-log-line, 13_code-sort-tfidf, 14_result-rainbow, 15_result-sports, 16_a2z-dragdrop.
- Own SVG diagrams: flow, bars, bars.
- Transcript SHA-256 (in-page = decoded): `6749a9260666d967087cae92514be2e3a409932c6f01311d422b943b05eec3e1 (en track)`; kept in the session workspace only.

## TL;DR
The Coding Train live-codes TF-IDF in p5.js (32:02) to rank the "key words" of one short Wikipedia text against three others. The whiteboard builds IDF in four visible stages: $\text{TF}\times\frac{1}{\text{df}}$ (100 x 1/10 = 10, 100 x 1/1 = 100) -> $\text{TF}\times\frac{N}{\text{df}}$ with N = 50 (500, 5,000; the board at ~3:20 still shows the stale results 10 and 100, rewritten to 500 / 5000 by ~3:42) -> $\text{TF}\times\log\frac{N}{\text{df}}$. The final code is `wordobj.tf * log(files.length / wordobj.df)`: raw-count tf, df starting at 1, p5.js `log()` = natural log, N = 4, no smoothing, no normalisation. Every printed score equals k x ln 4 exactly (e.g. arc/rainbow 6.931471805599453 = 5 ln 4; sports "or" 24.95329850015803 = 18 ln 4).

## Key Concepts
- **TF** = raw count of a word in the document (word-counter output for rainbow.txt: the 16, a 8, of 7, in 7, and 6, by 5, rainbow 5, is 5, arc 5, on 4, caused 4, light 4, rainbows 3, droplets 3, second 2). Most frequent words (the, a, of, in, and) are useless as keywords; aside on James W. Pennebaker, *The Secret Life of Pronouns* (ASR "Penn Baker"): such words matter in other text analysis.
- **Whiteboard derivation (2:16-4:42):**
  - $\text{score} = \text{TF} \times \text{IDF}$ (spoken).
  - Stage 1: $\text{score} = \text{TF}\times\frac{1}{\text{df}}$; $100\times\frac{1}{10} = 10$, $100\times\frac{1}{1} = 100$.
  - Stage 2-3: "technical definition": $\text{score} = \text{TF}\times\frac{N}{\text{df}}$, N = 50; $100\times\frac{50}{10} = 500$, $100\times\frac{50}{1} = 5000$ ("mostly equivalent score relative": ratio stays 10).
  - Stage 4: $\text{score} = \text{TF}\times\log\frac{N}{\text{df}}$ to "reduce the effect that the document count has on the score" (base not stated).
- **Document frequency in code:** $\mathrm{df}(w) = 1 + \sum_{j=1}^{N-1} [\, w \in \text{doc}_j \,]$ (Iverson bracket) (main document counted as 1; loop skips doc 0); prevents division by zero only because every word comes from doc 0.
- **Final score in code:** $\text{tfidf}(w) = \mathrm{tf}(w)\times\ln\frac{N}{\mathrm{df}(w)}$, N = `files.length` = 4.
- **Small-corpus effect:** with N = 4, idf can only be ln 4, ln 2, ln(4/3) or 0, so the top of the list is all df = 1 words ordered by tf; the speaker calls "or" an anomaly of the small data set.

## Implementation
Key code as on screen (Atom, sketch.js; tokens exact, some line breaks condensed):

```js
// ~7:18 / ~8:15 load
var files = ['eclipse.txt', 'fish.txt', 'rainbow.txt', 'sports.txt'];
function preload() {
  for (var i = 0; i < files.length; i++) {
    txt[i] = loadStrings('files/' + files[i]);
// ~13:20 tf of the first file (later the object gets df: 1 and the else branch becomes counts[word].tf = counts[word].tf + 1)
var tokens = allwords[0].split(/\W+/);
for (var i = 0; i < tokens.length; i++) {
  var word = tokens[i].toLowerCase();
  if (counts[word] === undefined) {
    counts[word] = { tf: 1 }
    keys.push(word);
  } else {
    counts[word] = counts[word] + 1;
  }
}
// ~25:32 / ~28:32 refactor: word set of every other file, once
var othercounts = [];
for (var j = 1; j < allwords.length; j++) {
  var tempcounts = {};
  var tokens = allwords[j].split(/\W+/);
  for (var k = 0; k < tokens.length; k++) {
    var w = tokens[k].toLowerCase();
    if (tempcounts[w] === undefined) {
      tempcounts[w] = true;
    }
  }
  othercounts.push(tempcounts);
}
for (var i = 0; i < keys.length; i++) {
  var word = keys[i];
  for (var j = 0; j < othercounts.length; j++) {
    var tempcounts = othercounts[j];
    if (tempcounts[word]) {
      counts[word].df++;
    }
  }
}
// ~27:40 var val = counts[word];  ~28:10 var tfdf = counts[word]; var tfidf = tfdf.tf *
// ~28:32 before the log:  var tfidf = tfdf.tf * (files.length / tfdf.df)
// ~29:05 with the log (property typed "tifidf" on screen; sort reads .tfidf and the output works)
var wordobj = counts[word];
wordobj.tifidf = wordobj.tf * log(files.length /
wordobj.df);
// ~29:37 sort by score
function compare(a, b) {
  var countA = counts[a].tfidf;
  var countB = counts[b].tfidf;
  return countB - countA;
}
```

Intermediate state at ~17:30: `for (var j = 0; j = allwords.length; j++)` and `if (tempcounts[tokens[i]] === undefined) {`; at ~18:01-18:34 j starts at 1 (skip the main file, df starts at 1) and `var word = tokens[i];` is introduced. Setup at ~7:18: `function setup() { var allwords = txt.join("\n"); var tokens = allwords.split(/\W+/);`; rainbow.txt is moved to the front of the array at ~8:13, so allwords[0] = rainbow.

Bugs shown and fixed on screen (useful as a "common mistakes" list): keys loop `for (var i = keys.length; i++)` (error line 35); `for (var j = 1; j = allwords.length; j++)` assignment -> infinite loop (fixed to `<`); `allwords[i]` -> `allwords[j]`; `tokens[i]` -> `tokens[k]`; stored `true` but tested `tempcounts[word] === 1`; inner `var word` shadowing the outer `word` (renamed `w`); missing lowercase in the df loop; extra closing bracket (syntax error line 77). After the fixes, console: `a: {df: 4, tf: 8}` -> score 8 x ln(4/4) = 0.

Printed results (exact): rainbow.txt first: arc, rainbow 6.931471805599453 (5 ln 4); light, caused 5.545177444479562 (4 ln 4); water, droplets, rainbows 4.1588830833596715 (3 ln 4); sun, refracted, sky, second, observer, both 2.772588722239781 (2 ln 4). sports.txt first: or 24.95329850015803 (18 ln 4); conduct 15.249237972318797 (11); unsportsmanlike 9.704060527839234 (7); game 8.317766166719343 (6); such 6.931471805599453 (5); during, as, play, [m]atch, [...]tions, [...]ayers, [w]hich, penalty 5.545177444479562 (4).

Pitfalls: `split(/\W+/)` yields "" and digit tokens (console shows keys "" and 1) and cannot segment Thai; df-starts-at-1 is not general smoothing (a query word absent from all documents would still divide by zero in a general system).

## Quick Reference
| Item | Value |
|---|---|
| Score (spoken) | TF x IDF |
| Board stage 1 | 100 x 1/10 = 10; 100 x 1/1 = 100 |
| Board stage 2 (stale results) | 100 x 50/10 "= 10"; 100 x 50/1 "= 100" (~3:20) |
| Board stage 3 | 100 x 50/10 = 500; 100 x 50/1 = 5000 (~3:42) |
| Board stage 4 | log over 50/10 and 50/1 (~4:23) |
| Code | `wordobj.tf * log(files.length / wordobj.df)` |
| log | p5.js `log()` = ln |
| N | 4 files |
| df | starts at 1 |
| Ratio df 1 vs df 10 (TF 100, N 50) | 1/df and N/df: 10x; ln or log10: 2.43x (100 ln 5 = 160.94 vs 100 ln 50 = 391.20; log10 69.90 vs 169.90) |
| Top rainbow.txt | arc, rainbow 6.931471805599453 |
| Top sports.txt | or 24.95329850015803 |
| A2Z drag-and-drop page | arab 0.044, him 0.039, had 0.034, he 0.034, king 0.029, but 0.024, governor 0.019, prince 0.019, his 0.017, paid 0.015 ("different math formula"; not opened) |

## Comparisons
Same word (rainbow: tf 5, df 1, N 4), author computed:
| Recipe | Value | "a" (tf 8, df 4) |
|---|---|---|
| This clip: tf x ln(N/df) | 6.9315 | 0 |
| Stanford / SLP3: log10(tf+1) x log10(N/df) | 0.4685 | 0 |
| scikit-learn smooth idf, before L2: tf x (ln((1+n)/(1+df)) + 1) | 9.5815 | 8 |

## Fact Check
8 claims: 5 confirmed, 2 partly, 1 not found.
- TF-IDF = TF x IDF: confirmed (Wikipedia).
- Technical definition N/df then log: confirmed (Wikipedia idf = log(N/n_t)).
- TF = raw count: confirmed (one Wikipedia variant).
- Log reduces the document-count effect: partly (our computation 10x -> 2.43x; Wikipedia gives no motivation).
- df starting at 1 avoids division by zero: partly (true in this code only).
- Printed numbers: confirmed (k x ln 4 to the last digit; p5.js log() is natural log).
- Pennebaker, The Secret Life of Pronouns: confirmed (Publishers Weekly).
- Khan Academy link and book link in the description: not found in the description read.

## Open Questions & Extension Ideas
- ZVect lesson "TF-IDF" hands-on step: the board's four stages are a ready-made derivation; the code (tf object, word sets once, df, tf x ln(N/df), sort) is a ready-made exercise; the on-screen bugs are a "common mistakes" box (author proposal).
- `othercounts` is the seed of an inverted index (word -> documents, df = list size): bridge to BM25 / hybrid search (gap G6) and to the planned on-site Q&A index; build df once per corpus.
- Thai: word segmentation is required before tf/df (`\W+` split fails without spaces).
- Open: the A2Z drag-and-drop example's formula (values ~0.04 suggest length-normalised tf) - page code could not be fetched.

## Tags & Triggers
tf-idf, idf, document frequency, p5.js, JavaScript, The Coding Train, keyword extraction, natural log, inverted index, live coding, debugging.
Triggers: "write TF-IDF in JavaScript", "why does IDF use a log", "Coding Train 100 x 50/10 = 500", "what base is p5.js log", "why a small corpus ranks by tf".

## References
- The Coding Train, "Coding Challenge #40.3: TF-IDF", YouTube, 2016-10-12: https://www.youtube.com/watch?v=RPMYV-eb6lI (code: https://thecodingtrain.com/challenges/40-word-counter)
- Wikipedia, tf-idf: https://en.wikipedia.org/wiki/Tf%E2%80%93idf
- p5.js reference, log(): https://p5js.org/reference/p5/log/
- Publishers Weekly, The Secret Life of Pronouns: https://publishersweekly.com/978-1-60819-480-3
- scikit-learn TfidfTransformer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html
- Companion report: 20210719_Vector-5-TF-IDF (Stanford slides, log10 x log10).
