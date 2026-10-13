# WIP202610042 — coder + review rules in ZVect (new work + lesson 4.6)

- **Owner (2026-10-12 00:07–00:33):** sent the `review`, `coder` and `app-maker-v01` skills; chose "ใช้กับงานใหม่ + แก้บท 4.6 ทันที" and
  "บันทึกทั้งสองตัว"; then "แก้เลย รอไร". Urgent by the coder rule §0.1, so this document follows the build instead of preceding it.
- **Scope:** every NEW code file, plus lesson 4.6. Older files are NOT refactored (measured 2026-10-12: 5 of 189 code files > 200 lines —
  scene3d 343, app 307, kit 258, 37_gpt_tokenizer 224, reindex 205 — and about 437 one-line arrow functions).

## Adaptations of the skills to this repo (owner may overrule any row)

| skill rule | in ZVect | why |
|---|---|---|
| `.bat` checkers, `all_test.bat`, CRLF for js | `npm run style`, `npm test`; LF everywhere | repo is node-only and `.gitattributes` is `* text=auto eol=lf` |
| `module/<x>/` folder with `py/`, `web/`, `atdd/`, `batch/`, `constants/`, `config/` | logical file in `web/js/`, component + text in `web/lessons/`, config in `web/data/*.json`, tests in `tests/`, checker in `tools/` | ZVect is a static site with one lesson per file; the split keeps the same categories |
| constants (UI text) out of code | `web/lessons/<NN>_<name>.text.js` holds every text / label / formula line | the lesson text is the lesson; one file per lesson keeps it readable |
| canvas numbers (grid, widths, offsets, view) | stay in the component | same as all other lessons; presentation, not tunables |
| independent review | subagent, data-only brief, JSON fail-closed, ≤2 fix cycles | as written; cycle 3 only with the owner's yes |
| examples `examples/*/NN_*` | standalone teaching files with their own copy of the values; a test checks they match the JSON | the code tab shows these files to learners |

## Files for 4.6 (all ≤200 lines)

| file | category | lines |
|---|---|---|
| `web/js/samemodel.js` | logical: seedFrom, makeRandom, randomRow, train, partnerOf, grouped, rankDocs, relation, redrawGrouped | ~110 |
| `web/lessons/38_same_model.js` | component: controls, canvas, live box | ~145 |
| `web/lessons/38_same_model.text.js` | constants: text, labels, formula lines, `fill()` | ~115 |
| `web/data/same_model.json` | config + toy data | ~25 |
| `tests/samemodel.test.js` · `tests/style.test.js` | tests (every logical function; every checker rule red-proven) | ~115 · ~62 |
| `tools/check-style.js` · `tools/style-mask.js` · `tools/style-scope.json` | checker (rules) · tokenizer · the list of files under the rules | ~146 · ~103 |

## Checker rules (`npm run style`, prints `file:line`)

≤200 lines · LF only · comment block ≤3 lines · no one-line function / arrow / lambda / Python lambda · one statement per line ·
if / for / while / else body on its own line. Not checked by script (review checks them): inline literals, logical vs component, facade.
Known gaps (review cycle 3 suggestions): code inside `${...}` of a template literal is not scanned; Python docstrings do not count as comments.

## Review log

| cycle | verdict | items |
|---|---|---|
| 1 | FAIL | checker: line numbers after backslash-newline, `else if` body, function expressions; `MAX_TRIES` hard-coded → all fixed + tests |
| 2 | FAIL | live box named cat/dog instead of reading the pair from the JSON → fixed |
| 3 | PASS (owner allowed a 3rd cycle) | suggestions applied after PASS: identical partner rows rejected by `grouped()` (seed 13893), same-model verdict checks rank 1; gates re-run |

## Later lessons under the same rules

| WIP | lesson | files |
|---|---|---|
| WIP202610048 | chapter 10 "LLM - Stanford" (10.1 transformer-why, 10.2 self-attention, 10.3 position-encoding, 10.4 transformer-block) | `web/js/attention.js` (matmul, transpose, softmaxRows, causalMask, scoreDivisor, attention, position, handAngles, positionCos, indexOf) · `web/js/tblock.js` (rnnHops, kept, sequentialSteps, seeded, addRows, layerNorm, relu, blockWeights, encoderBlock, shape) · `web/lessons/40–43_*.js` + `.text.js` · `web/data/transformer.json` · `tests/transformer.test.js` (11) · examples js/py/cpp |
| WIP202610045 | 4.7 contextual (static vs contextual) | `web/js/contextual.js` (divisor, softmax, scores, contextualize, embed, senseCos, findSentence, row) · `web/lessons/39_contextual.js` · `39_contextual.text.js` · `web/data/contextual.json` · `tests/contextual.test.js` (10, incl. text numbers = code numbers) · examples js/py/cpp |

## Open for the owner

- A new code file must be added to `tools/style-scope.json` (otherwise the checker does not see it).
- Refactoring the older files stays out of scope unless asked (would be its own WIP).
