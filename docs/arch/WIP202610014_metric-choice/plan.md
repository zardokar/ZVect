# WIP202610014 — Metric choice: bring the "cosine vs Euclidean vs dot" video into ZVect

- **Status:** DONE 2026-10-10 (upckp #5). Written 2026-10-10 as a plan; see §5 for what was built and where it differs.
- **Source:** iw report `docs/outhtm/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html`
  and context file `docs/aimd/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product_claude.md`
  (yt:xTaDx3tbYMs, SH AI Academy, 6:13).
- **Owner rules that bind every step:** no framework / no dependency; dark theme only; short and simple;
  each lesson only uses ideas from earlier lessons; JS / Python / C++ examples print identical output.

## 1. What ZVect already covers (checked against the repo, 2026-10-10)

| Video topic | Already in ZVect | Where |
|---|---|---|
| Cosine formula, range, magnitude-invariance | yes, with "stretch b" slider | lesson 3 `web/lessons/03_cosine.js` |
| Zero-vector guard | yes, lib returns 0 and lesson says "undefined" | `lib/zvect.*`, lesson 3 |
| Dot product formula + projection | yes | lesson 2 |
| Cosine vs Euclidean ranking | yes, a toggle | lesson 6 `06_similarity.js` |
| Dot product as a ranking metric | **no** | — |
| Three metrics disagreeing on the same data | **no** | — |
| Unit vectors → identical rankings (‖â−b̂‖² = 2 − 2cos) | one sentence in lesson 6 intro, no demo | — |
| Decision tree / use-case table | **no** | — |
| Dot product in attention (query·key) | **no** | — |
| Curse of dimensionality | **no** | — |

## 2. Steps (children of WIP202610014)

| ID | Step | Files | Done when |
|---|---|---|---|
| WIP202610014-M1 | Lesson 6: add **dot** as a third metric; the ranking table shows all three side by side; add a preset "A, B, C" (A=(3,1), B=(6,2), C=(3,2)) where cosine and dot pick B and Euclidean picks C | `web/lessons/06_similarity.js`, `examples/{js,py,cpp}/06_similarity.*` | `npm run check` PASS; Playwright shows the three-way disagreement on the preset |
| WIP202610014-M2 | **New lesson "เลือก metric"** in group ใช้งานจริง, right after Similarity search: A/B/C scene, a **normalize** toggle that makes the three rankings converge, live formula ‖â−b̂‖² = 2 − 2cos θ, the decision tree as a small HTML block, the use-case table | new `web/lessons/07_choose_metric.js`, new `examples/*/07_choose_metric.*`; Bi-Encoder → 08, Classification → 09 (files renamed, slugs unchanged) | lesson uses only lessons 1–6; parity PASS; dark theme at 1440 px and 390 px |
| WIP202610014-M3 | Lesson 2: one short paragraph + a "ลองทำ" item: attention score = query · key, with the corrected numbers 0.70 / 0.23 | `web/lessons/02_dot_product.js` | text reviewed; no new controls |
| WIP202610014-M4 | **New lesson "มิติสูง"** (high dimensions), after "เลือก metric": a dimension slider 2…1000, histogram of distances and of cosines from one query to 200 seeded random points, showing both squeeze together | new lesson + examples; a 2D canvas histogram (no 3D needed); seeded RNG written in the lesson (no lib change) | numbers match the report's table (seed 7: 37.33 / 2.20 / 0.38 / 0.085) |
| WIP202610014-M5 | Serve `docs/outhtm/` from `server.js` and add an "อ่านเพิ่ม" link on lessons 2, 3, 6 and the new lessons to the report | `server.js`, lesson files | link opens offline report; path-traversal test still 404 |
| WIP202610014-M6 | Parity probe: add a near-zero vector case (1e-300) and a "dot on unit vectors == cosine" case to `tests/parity/*/edge_cases.*` | `tests/parity/*` | `npm run check` PASS in all three languages |

Suggested order: M1 → M2 → M3 → M6 → M4 → M5 (M1–M2 give the biggest learning value; M4 is the largest new UI).

## 3. Not planned (and why)

- No `batch` / matrix API in the lib: the video's vectorization tip is about NumPy speed, which the zero-dependency
  lib is not trying to match; a loop over `cosine` is clearer for learners.
- No epsilon parameter in `cosine`: the lib already returns 0 for an exact zero vector in all three languages, and
  the parity probe (M6) will pin the near-zero case.
- The video's visualization numbers (0.048 / 153.2 / 593) are not reproducible and will not be reused.

## 4. Open questions for the owner

1. Renumbering: M2 shifts Bi-Encoder and Classification to 08 and 09 (file names only; URLs keep their slugs). OK?
2. Should M4 ("มิติสูง") live in group ใช้งานจริง or in group Space?
3. Link the iw reports from lessons (M5), or keep `docs/` separate from the lesson site?

## 5. As built (2026-10-10, upckp #5)

Owner answers (2026-10-10 17:2x): renumber OK; "มิติสูง" goes in ใช้งานจริง; link the iw reports from lessons.

| Step | Built | Differs from the plan |
|---|---|---|
| M1 | Lesson 6: metric choice cosine / distance / dot; table shows the top-3 of all three side by side; preset buttons "เริ่มต้น (0.7, 0.3, 0)" and "query สั้น (0.5, 0.2, 0.1)"; example prints a third block "by dot product" | The three-way preset uses lesson 6's own items (apple / rice / banana win, margins >= 0.015) instead of A/B/C; A/B/C lives in M2 |
| M2 | New `07_choose_metric` (slug `choose-metric`): A/B/C, k slider for B = k·A, editable C, normalize toggle (unit view drawn 4x enlarged, labelled), live ‖Â−Ĉ‖² = 2 − 2cos θ, decision list and use-case table in a new `extra` block | Final numbering is 07 choose-metric, 08 high-dimensions, 09 bi-encoder, 10 classification (M4 also inserts a lesson); slugs unchanged |
| M3 | Lesson 2: side-note paragraph query·key 0.70 / 0.23 and a try item scaled ×5 to fit the sliders | — |
| M6 | Parity probes: cosine near-zero 1e-300 = 0.000 (squared length underflows), tiny 1e-150 = 0.267, normalize near-zero, unit dot == cosine, unit dist² == 2 − 2cos; one node:test case | — |
| M4 | New `08_high_dimensions` (slug `high-dimensions`): d buttons 2 / 3 / 10 / 100 / 1000, two histograms on a new 2D overlay hook (`Scene3D.overlay`, lesson field `draw2d`), reseed buttons | RNG is minstd (seed 7, first 10 discarded) so all three languages match; spread 13.056 / 1.857 / 0.381 / 0.098 instead of the report's Python-random 37.33 / 2.20 / 0.38 / 0.085 (stated in the lesson and in REFERENCE.md) |
| M5 | `server.js` mounts `/docs/outhtm/`; "อ่านเพิ่ม" links on lessons 2, 3, 6, 7, 8 and 9 (9 → embeddings report) | Lesson 9 link added (owner's answer covered iw reports generally) |

Shell additions used by the steps: `kit.buttons()`, `kit.setVec()`, `choice()` returns `{ set }`, slider `set` clamps; lesson fields `more`, `extra`, `hint`, `canvasLabel`, `draw2d`.
