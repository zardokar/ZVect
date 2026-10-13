# WIP202610052 — tviz: a reusable Transformer visualizer (Canvas + HTML, zero dependency)

- **Owner (2026-10-13 12:51):** "[Opus] อยากได้ Visualize เรื่อง Transformer แบบนี้ อันนี้ไม่ต้องลงบทเรียนแต่ทำ script สำหรับ Visualize ให้เหมาะสมและเขียนแบบ
  Reusable ได้ ทั้งใน Project นี้และ Project อื่นนำไปวางแล้วเรียกได้เลย ใช้ skill coder หรือ app-maker มาช่วยไม่แน่ใจอะไร ดี และ ประหยัดที่สุด ใช้ลง Canvas + html ที่เรามีหนะแหละ"
- **Status:** ANSWERING (owner by voice, 2026-10-13 20:3x–20:5x): ALL 23 ANSWERED (22:02). Build starts at S1 (Opus writes, independent Opus review) — see "Owner's answers" below §7. Was: DRAFT for the owner to read (coder §0: draft first, all questions up front, folder structure before code).
  **No code has been written.** Not declared urgent, so the build waits for the answers in §7. When they arrive they go into this document first.
- **WIP:** `WIP202610052` (proposed; mint it in the checkpoint when the owner says yes, see Q16).
- **Inputs read:** coder SKILL.md, app-maker-v01 SKILL.md, `docs/arch/WIP202610042_coder-rules/plan.md` (ZVect's version of the rules),
  the research board `.dropzone/noted/20261013_Transformer-Visualize/notes.md` (board items 1–20), the five `docs/aimd/*_claude.md` reports
  (Transformer Explainer 2025 and 2024, Dodrio, Graphite, VIGOR), `web/js/attention.js`, `web/js/tblock.js`, `web/data/transformer.json`,
  `tests/transformer.test.js`, `web/lessons/41_self_attention.js` + `.text.js`, `web/css/style.css`, `tools/style-scope.json`, `package.json`, `docs/APPROVALS.md`.

## สรุปสำหรับเจ้าของ (TH)

- **ทำอะไร:** โฟลเดอร์ `tviz/` หนึ่งโฟลเดอร์ เป็น ES module ที่ไม่ต้องติดตั้งอะไรเพิ่ม (zero dependency) วาดด้วย Canvas 2D และใช้ HTML สำหรับตัวหนังสือ ปุ่ม tooltip และสูตร
  ไม่ใช่บทเรียน ใน ZVect มีหน้า demo หน้าเดียว โปรเจกต์อื่น copy โฟลเดอร์ไปแล้วเรียกบรรทัดเดียว
  `mountTransformerViz(el, { tokens, trace | weights | seed, options })`
- **skill ไหนดีและประหยัดกว่า:** **coder** งานนี้เป็น library ไม่ใช่ app ที่มีรายการ เลือก ลบ หรือตั้งชื่อไฟล์ กฎส่วนใหญ่ของ app-maker (sort, select, delete, gallery) จึงไม่เกี่ยว
  จาก app-maker หยิบมาแค่สามข้อ: facade (§3.3), bus แทนการ import กันเอง (§3.6) และลำดับการตรวจ (§4)
- **v1 มี 7 มุมมอง (ตามที่เจ้าของยกตัวอย่าง):** แถว token + แถบ embedding (+ position) · การฉาย Q/K/V · heat map ของ attention พร้อมปุ่มเล่นทีละขั้น
  (QKᵀ → หาร √d → mask → softmax → ·V) · เส้น attention ระหว่าง token พร้อม threshold · ตาราง head หลายหัว · มุมมอง block (residual + layer norm + FFN) ·
  แถบความน่าจะเป็นที่ปรับ temperature / top-k / top-p ได้ ทุกมุมมองเชื่อมกันผ่าน bus เดียว ชี้ token ในมุมหนึ่ง มุมอื่นก็สว่างตาม
- **โครงสร้าง:** logic ล้วน 9 ไฟล์ (ทดสอบใน node ได้ทุกฟังก์ชัน) · component 12 ไฟล์ · facade 1 ไฟล์ · ทุกไฟล์ ≤200 บรรทัด ·
  ข้อความอยู่ใน `text/*.json` ค่าปรับอยู่ใน `config/*.json` สีอยู่ใน CSS variable `--tviz-*` (โปรเจกต์อื่นเปลี่ยนธีมได้โดยไม่แตะโค้ด)
- **ตรวจอย่างไร:** unit test ทุกฟังก์ชัน logic พร้อมพิสูจน์ว่า test แดงได้ · `npm run style` · Playwright 3 ขนาดจอ (1400/820/390) ·
  ทดลอง copy โฟลเดอร์ไปโปรเจกต์ว่างจริงแล้วต้องขึ้นโดยไม่มี error · review อิสระด้วย Opus ก่อนปิดงาน
- **ค่าแรงโดยประมาณ:** โค้ดราว 3,100 บรรทัด + test ราว 800 บรรทัด แบ่ง 4 ช่วง (S1–S4) หยุดหลัง S2 ได้ถ้าอยากได้แค่ส่วน attention (§6)
- **ต้องตอบก่อนเริ่ม 23 ข้อ (§7)** ทุกข้อมีคำตอบที่แนะนำไว้แล้ว ถ้าเห็นด้วยทั้งหมด ตอบ "ตามแนะนำ" คำเดียวได้ ข้อที่ควรดูเองคือ Q2 ที่อยู่ของโฟลเดอร์, Q7 ขอบเขต v1,
  Q8 สี Q/K/V, Q10 license และ Q11 กฎ top-p (สองแบบให้ผลต่างกันจริง ดูตาราง §3.3)

---

## 1. Goal and non-goals

| | |
|---|---|
| **Goal** | A reusable Transformer visualizer: one folder, one ES-module facade, Canvas 2D for dense marks (heat maps, strips, lines, bars) and HTML for every text (labels, controls, tooltips, captions, MathML formulas). |
| **Reusable means** | Copy one folder into any static web project, `import` one file, call one function. No build step, no npm install, no global CSS leaks (everything is under `.tviz` and `--tviz-*`). |
| **Zero dependency** | Owner rule (`docs/APPROVALS.md`): browser built-ins only. No D3, no Svelte, no ONNX. Ideas come from Transformer Explainer / Dodrio / VIGOR / Graphite; **no code is copied** from them. |
| **Theme** | Dark by default (ZVect rule: dark only). Every color, font, radius and control height is a CSS custom property `--tviz-*`. In ZVect each one falls back to the ZVect token (`--tviz-ink: var(--ink, #e4e8f0)`), so it matches the site with no extra CSS. Another project restyles by overriding the variables. |
| **Data** | Toy-sized and readable: up to 16 tokens, vectors up to 64 dims drawn, up to 12 × 12 heads in the grid (config, Q13). Input can be a precomputed trace (from a real model or from ZVect's `attention.js` / `tblock.js`), weights, or just a seed. |
| **Non-goals (v1)** | Not a lesson: no chapter entry, no `.text.js` teaching prose, no examples/js-py-cpp. No model in the browser and no "Generate" loop. No GPT-2 export. No light theme preset. No bundled single-file / file:// build. No Sankey ribbons, radial or force graph, matmul popover, projection scatter, feature panel, ranked tabs (board items 4, 5-full, 7-radial/force, 16–20 → v2 list in §3.5). |

## 2. Reuse model (how another project uses it)

### 2.1 Drop in and call

```html
<div id="viz"></div>
<script type="module">
  import { mountTransformerViz } from "./tviz/index.js";
  const viz = await mountTransformerViz(document.getElementById("viz"), {
    tokens: ["A", "cute", "teddy bear", "is", "reading"],
    seed: { seed: 7, dModel: 4, heads: 2, dK: 2, dFF: 8 },
    options: { views: ["attention", "lines", "heads"], lang: "en" },
  });
  viz.on("select", (msg) => { console.log(msg.ids); });
</script>
```

### 2.2 What the host must provide

| host provides | why |
|---|---|
| A page served over HTTP(S) (any static server, GitHub Pages) | ES modules and the `fetch` of `config/*.json` and `text/*.json` do not work from `file://` (Q6) |
| A container element with a width (the widget fills the width and sets its own height) | responsive layout at 1400 / 820 / 390 px |
| Data in one of three forms: `trace`, `weights` or `seed` (contract §4.3) | the widget never invents numbers silently: seed mode says "seeded toy weights" in its header |
| Optionally: CSS variable overrides, `options.text` overrides, an external `bus` to link the widget with the host's own UI | theming, wording, cross-widget linking |

The facade injects `tviz.css` itself (a `<link>` built from `import.meta.url`, once per page; `options.css: false` turns this off).

### 2.3 Facade (the only file a host imports): `tviz/index.js`

| verb | in → out | kind |
|---|---|---|
| `mountTransformerViz(el, input)` | element + `{tokens, trace|weights|seed, options}` → `Promise<handle>`; handle = `{ update(partial), select(ids), on(evt, fn), off(evt, fn), destroy() }` | component (the only DOM entry point) |
| `buildTrace(input)` | same input → the full trace object (pure, for hosts that want the numbers without drawing, and for tests) | logic |
| `createBus()` | → a LinkedSelection bus to pass in `options.bus` so several widgets (or host UI) share one selection | logic |
| `VERSION` | `"0.1.0"` string, same as `MANIFEST.json` | constant |

Everything else in the folder is internal. A host that reaches into `core/` or `ui/` is outside the contract.

### 2.4 Versioning and integrity

- One folder, semver in `MANIFEST.json` (`{ name, version, files: { "<path>": "<sha256>" } }`), the same idea as `lib/MANIFEST.json`.
- A test inside the folder (`atdd/manifest.test.js`) fails if a listed file's sha256 or the version in `index.js` drifts, and if any file in the folder is longer than 200 lines.
  So a project that copied the folder can run `node --test tviz/atdd/` and see that its copy is intact.
- ZVect regenerates the manifest with `npm run manifest` (extend `tools/make-manifest.js` to cover `lib/tviz/`; that tool is not in the upload I read, so the build checks how it walks folders first).
- Copies in other projects are updated by replacing the whole folder. The README states "do not edit inside; override with CSS variables, `options.text` and `options.config`".

### 2.5 License

ZVect's license (study and experiment, **no commercial use without permission**) applies to the folder unless the owner says otherwise.
The folder carries its own `LICENSE` copy so the terms travel with it. Q10 asks whether `tviz` should get a different license.

## 3. v1 component list

### 3.1 Choice and reasons

Board build order was "1+3, 11, 6, 9, then 4, 5, 7, 8". The owner's message names seven views. v1 = those seven, built from the smallest board pieces that make them,
plus the bus (board 14), which costs about 80 lines and makes every view feel connected (VIGOR's main lesson):

| # | view (option key) | board items | inputs (from the trace) | outputs / events | interactions | calls (logic) |
|---|---|---|---|---|---|---|
| V1 | **Token row + embedding strip** (`embed`) | 1, 2 | `tokens`, `X`, `P` (position), `X0 = X + P`, optional `ids` | `hover/select {token i}` | hover a token → its strips and every other view highlight it; hover a strip cell → tooltip `dim d = value`; table `token → X strip + P strip = X0 strip` (Transformer Explainer 2024, frame 05) | `color.ramp('grey'|'diverging')`, `geometry.stripCells`, `format.fmt` |
| V2 | **Q/K/V projection** (`attention`, step 1) | 2, 6 (part) | `X0`, `Wq/Wk/Wv` (if known), `Q`, `K`, `V`, shapes | `hover {token i}` | step 1 of the player: `X0 (n × d) · W_Q (d × d_k) = Q (n × d_k)` as strips with shape labels, Q/K/V colors; hover a row → the same token everywhere | `steps.attentionSteps`, `format.shapeLabel` |
| V3 | **Attention heat map + step player** (`attention`) | 3, 6, 10-lite, 11, 15-lite | `raw`, `S`, `A`, `out`, `dk`, `causal`, mask | `hover {cell i,j}`, `step`, `select {token i}` | player ⏮ ◀ ▶ ⏭ ⏯ over the steps in §3.2; dots or cells mode; masked cells grey; legend `min [ramp] max` under every matrix; hover cell → MathML card `q_i · k_j / √d_k = value` and the query row i + key column j light up in V1/V4; header counter "5 tokens · head 1 of 2 · layer 1" | `steps.attentionSteps`, `color.domain`, `geometry.matrixCells`, `geometry.hitCell` |
| V4 | **Attention lines** (`lines`) | 7 (bipartite mode only) | `A` of the current head, `tokens` | `hover/select {token i}` | two columns of the same tokens (left = query, right = key), line width and opacity = weight; **threshold slider** hides lines below it; hover a token → only its lines stay | `geometry.bipartite`, `color.alpha` |
| V5 | **Multi-head grid** (`heads`) | 8 (thumbnail form) | every head's `A` (layers × heads) | `select {head layer,h}` → all views switch head | each cell = a tiny heat map of that head (Dodrio's ring preview idea, without the semantic/syntactic scores we do not have); current head framed; tooltip "layer L · head H · max weight · entropy" | `geometry.gridCells`, `steps.headSummary` |
| V6 | **Block view** (`block`) | 5 (simplified, no Sankey) | `X0`, `concat`, `mha`, `norm1`, `hidden`, `ffn`, `out` | `select {stage name}`, `hover {token i}` | columns `X0 → multi-head attn → +residual & LayerNorm → FFN (d_ff) → +residual & LayerNorm → out`, one row per token, each a vector strip; residual drawn as a dashed arc; click a stage → caption with its formula and shape | `steps.blockStages`, `geometry.stageColumns` |
| V7 | **Next-token probabilities** (`sampling`) | 9, 10 | `next = {vocab, logits}` (hidden if absent) | `change {T, mode, k, p}`, `pick {candidate i}` | temperature slider, mode none / top-k / top-p, k and p inputs; bars sorted, filtered rows greyed and struck; hover a bar → formula card `logit / T → filter → softmax → %`; button "sample" = seeded draw (Q14) | `sampling.scaleLogits`, `softmaxT`, `topK`, `topP`, `sampleSteps`, `drawIndex` |
| — | **LinkedSelection bus** (internal, also exported) | 14 | — | `hover`, `select`, `step`, `clear` | one highlight color `--tviz-hi` in every view | `bus.createBus` |
| — | **Shared widgets** | 12 | — | — | tooltip, gradient legend, slider, segmented radio, buttons, MathML card, caption bar | `color.legendStops`, `format.fill` |

Why not more: items 4 (matmul popover), full 5 (Sankey ribbons), 7 radial/force, 16–20 are each 150–300 lines and none of them is needed to answer
"what does attention do with these tokens". Why not fewer: dropping V1, V6 and V7 saves about 600 code lines, but the owner named all three,
and V7 fills a real gap (nothing in ZVect shows temperature / top-k / top-p yet, and the LLM manual plan `WIP202610050` needs it for G3 inference).

### 3.2 Example table: the attention steps (app-maker §2.1 — confirm before code)

Data = `web/data/transformer.json` `data.attn`, query token **"teddy bear"** (row i = 3 of 5), d_k = 3, values computed now with the same formulas as `attention.js`:

| step | player label | what V3 draws | row "teddy bear" (A, cute, teddy bear, is, reading) |
|---|---|---|---|
| 0 | X | X0 strips (or X when no position) | x = (0.6, 2.0, 0.4) |
| 1 | Q, K, V | `Q = X W_Q`, `K = X W_K`, `V = X W_V` strips | q = (2.000, 0.600, 0.400) |
| 2 | QKᵀ | raw scores n × n | 0.560 · 4.320 · 2.560 · 0.760 · 1.960 |
| 3 | ÷ √d_k | scaled | 0.323 · 2.494 · 1.478 · 0.439 · 1.132 |
| 4 | mask | only when causal is on; later cells grey (−∞) | 0.323 · 2.494 · 1.478 · −∞ · −∞ |
| 5 | softmax | weights per row, row sums to 1 | off: 0.061 · **0.538** · 0.195 · 0.069 · 0.138 (= lesson 10.2's 0.538) · causal: 0.077 · **0.677** · 0.245 · 0 · 0 |
| 6 | · V | `out = A V` strips | out = (1.273, 0.713, 0.508) |

Rule: with causal off, step 4 is shown as "mask: off" (skipped by ▶, still listed) so the step count stays 7 in both modes. In `trace` mode the player can only show
steps whose matrices the trace has (e.g. a trace without `raw` starts at step 5); missing steps are listed disabled, never invented.

### 3.3 Example table: sampling (confirm before code; the two top-p rules differ)

Toy logits (author's numbers, labelled as such in `demo/sample.json`): reading 2.0 · sleeping 1.2 · playing 0.8 · eating 0.1 · a −1.0

| setting | reading | sleeping | playing | eating | a |
|---|---|---|---|---|---|
| T = 1 | 51.3% | 23.0% | 15.4% | 7.7% | 2.6% |
| T = 0.5 (sharper) | 75.9% | 15.3% | 6.9% | 1.7% | 0.2% |
| T = 2 (flatter) | 35.3% | 23.7% | 19.4% | 13.7% | 7.9% |
| T = 1, top-k k = 3 | 57.1% | 25.7% | 17.2% | — | — |
| T = 1, top-p p = 0.8, **rule A** "smallest set whose cumulative ≥ p" (nucleus sampling as usually defined, general knowledge) | 57.1% | 25.7% | 17.2% | — | — |
| T = 1, top-p p = 0.8, **rule B** "keep while cumulative ≤ p" (as read from the Transformer Explainer 2025 formula card, frame 04) | 69.0% | 31.0% | — | — | — |

Ties at the top-k boundary: keep exactly k, earlier vocab index wins (stable). Temperature range 0.1–2.0 (config). Q11 picks rule A or B.

### 3.4 Linked views (what lights up where)

| source event | V1 token row | V3 heat map | V4 lines | V5 heads | V6 block | V7 bars |
|---|---|---|---|---|---|---|
| hover token i | token i | row i (query) | lines of i | — | row i | — |
| hover cell (i, j) | i (query color) + j (key color) | cell | line i→j | — | rows i, j | — |
| select head (l, h) | — | redraw for (l, h) | redraw | frame moves | MHA stage note "head h" | — |
| step k | — | step k | shown only at step ≥ 5 (weights exist) | — | — | — |
| hover candidate c | — | — | — | — | — | bar c + formula |

### 3.5 Deferred to v2 (already specified on the board)

Matmul popover with row/column highlight (4) · Sankey token-flow ribbons (5) · radial / force / arc attention graph (7) · ControlDock (16) · filter chips (15) ·
ProjectionScatter (17) · SelectionStats (18) · caption pointer + region outline (19) · RankedTabs (20) · single-file file:// build · light preset · GPT-2 trace exporter.

## 4. Folder structure (every file, category, line budget ≤ 200)

### 4.1 Where it lives in ZVect

`lib/tviz/` (Q2). `lib/` is already ZVect's "take this and use it" folder (README: "เอาไปใช้ที่นี่", `package.json` `files: ["lib/"]`) and already has the MANIFEST pattern.
The demo page is served at `/lib/tviz/demo/` by `npm start` and on Pages, using the same relative-link layout.

### 4.2 Tree

| path | category | responsibility | budget |
|---|---|---|---|
| `lib/tviz/index.js` | **facade** | `mountTransformerViz`, `buildTrace`, `createBus`, `VERSION`; loads config + text, injects css, validates input, hands off to `ui/app.js` | ~110 |
| `lib/tviz/tviz.css` | theme + layout | every `--tviz-*` token (with ZVect fallbacks), `.tviz` grid, controls, tooltip, caption bar, hidden data tables; breakpoints 820 / 390 | ~170 |
| `lib/tviz/config/defaults.json` | config | limits (maxTokens 16, maxDims 64, maxHeads 144), threshold 0.10, step interval ms, T range/step, k, p, seed, dot min/max radius, legend size, view order | ~50 |
| `lib/tviz/text/en.json` · `text/th.json` | text | every label, caption, tooltip template, error message, step names (`{placeholders}` filled by `format.fill`) | ~90 each |
| `lib/tviz/core/tmath.js` | logic | matmul, transpose, addRows, scaleAll, softmaxRows, causalMask, layerNorm, relu, seeded (minstd), position | ~170 |
| `lib/tviz/core/trace.js` | logic | `buildTrace`: seed → weights → per-head attention + block; normalizes a given trace (null ↔ −∞, missing stages flagged) | ~170 |
| `lib/tviz/core/validate.js` | logic | contract guards: shapes agree, numbers finite, n ≤ maxTokens, one of trace/weights/seed; returns `{ok, errors:[{key, path}]}` (keys → text) | ~130 |
| `lib/tviz/core/steps.js` | logic | `attentionSteps(head, opts)`, `blockStages(block)`, `headSummary(A)` (max, entropy) | ~120 |
| `lib/tviz/core/sampling.js` | logic | scaleLogits, softmaxT, topK, topP (rule from Q11), sampleSteps (formula card values), drawIndex (seeded) | ~120 |
| `lib/tviz/core/color.js` | logic | ramps (sequential purple, diverging, grey) from theme colors, `domain(matrix, mask)`, value → rgba, legendStops | ~100 |
| `lib/tviz/core/geometry.js` | logic | HiDPI size math, matrixCells, hitCell, stripCells, bipartite line coords, gridCells, stageColumns | ~170 |
| `lib/tviz/core/bus.js` | logic (stateful, no DOM) | `createBus()`: on/off/emit, hover/select/step/clear, source tag so a view ignores its own echo | ~80 |
| `lib/tviz/core/format.js` | logic | fmt(number, digits), fill(template, vars), shapeLabel | ~50 |
| `lib/tviz/ui/surface.js` | component | one canvas: devicePixelRatio, ResizeObserver, theme read via `getComputedStyle` (`--tviz-*`), rAF redraw, pointer → logical coords | ~120 |
| `lib/tviz/ui/widgets.js` | component | tooltip, legend, slider, segmented radio, button row, caption bar, hidden `<table>` for screen readers | ~180 |
| `lib/tviz/ui/mathml.js` | component | tiny MathML builder for formula cards (Canvas has no math layout; board note) | ~70 |
| `lib/tviz/ui/tokens.js` | component | V1 token row (focusable buttons) + embedding table | ~150 |
| `lib/tviz/ui/heatmap.js` | component | matrix drawing (dots / cells, mask, legend, shape label, hover) used by V3, V5 | ~160 |
| `lib/tviz/ui/player.js` | component | step player + caption bar, keyboard ← → space, `prefers-reduced-motion` = no autoplay | ~120 |
| `lib/tviz/ui/attention.js` | component | V2 + V3 panel: Q/K/V strips at step 1, heat map at steps 2–5, out at step 6, formula card on hover | ~180 |
| `lib/tviz/ui/lines.js` | component | V4 lines + threshold slider | ~140 |
| `lib/tviz/ui/heads.js` | component | V5 thumbnails grid + counter | ~120 |
| `lib/tviz/ui/block.js` | component | V6 stage columns + residual arcs + stage caption | ~180 |
| `lib/tviz/ui/sampling.js` | component | V7 bars, controls, formula card, sample button | ~180 |
| `lib/tviz/ui/app.js` | component | composes the views in `options.views` order, owns state `{layer, head, step, token, threshold, T, mode, k, p}`, wires the bus, `update`/`destroy` | ~170 |
| `lib/tviz/demo/index.html` | demo | standalone page (no ZVect shell), dark page, two sections: seed mode and trace mode | ~60 |
| `lib/tviz/demo/demo.js` | demo (component) | loads `sample.json`, mounts all seven views, a second widget with `views:["lines"]` on the same bus | ~60 |
| `lib/tviz/demo/sample.json` | data | ZVect toy data (copy of `transformer.json` attn + block) + toy logits of §3.3, `_how` with the source labels | ~120 |
| `lib/tviz/atdd/*.test.js` | test (acceptance, written first) | one file per logic file (9) + `facade.test.js` (buildTrace/validate end to end, no DOM) + `manifest.test.js` | ≤200 each, ~800 total |
| `lib/tviz/docs/<file>.md` | docs | overflow of comments > 3 lines (coder §3b), only if needed | — |
| `lib/tviz/README.md` · `LICENSE` · `MANIFEST.json` | docs / license / integrity | drop-in guide (copy, call, contract, CSS variables, update rule) | — |
| `tests/tviz_zvect.test.js` (ZVect only) | test | drift guard: `tviz/core/tmath` + `buildTrace` give the same numbers as `web/js/attention.js` / `tblock.js` on `transformer.json` | ~60 |

Totals: 9 logic files ≈ 1,110 lines · 12 component files ≈ 1,850 · facade 110 · demo js 60 → **≈ 3,130 code lines**; tests ≈ 860.
Every new `.js` file goes into `tools/style-scope.json`. `tviz.css` and the JSON files are not scanned by `npm run style`; `manifest.test.js` counts their lines.

### 4.3 Data contract (JSON shapes)

Masked scores cannot be `-Infinity` in JSON: the trace uses `null` for a masked cell, and `trace.js` turns it into `-Infinity` inside (and back on export).

```jsonc
// input = { tokens, ONE OF trace | weights | seed, options? }
"tokens": ["A", "cute", "teddy bear", "is", "reading"],          // 1..maxTokens strings, also "ids": [int] optional

"seed":    { "seed": 7, "dModel": 4, "heads": 2, "dK": 2, "dFF": 8, "scale": 0.8, "burn": 10, "eps": 1e-5, "base": 10000, "causal": false },
"weights": { "X": [[n × dModel]], "heads": [{ "Wq": [[dModel × dK]], "Wk": [[…]], "Wv": [[…]] }],
             "Wo": [[heads·dK × dModel]], "W1": [[dModel × dFF]], "W2": [[dFF × dModel]],   // Wo/W1/W2 optional → no block view
             "position": "sincos" | "none", "base": 10000, "eps": 1e-5, "causal": false, "scale": "sqrtDk" | "none" },
"trace": {
  "version": 1,
  "layers": [{
    "X": [[…]], "P": [[…]] | null, "X0": [[…]],
    "heads": [{ "Q": [[n × dK]], "K": [[…]], "V": [[…]], "raw": [[n × n]], "S": [[n × n, null = masked]], "A": [[n × n]], "out": [[n × dK]], "dk": 2, "causal": false }],
    "block": { "concat": [[…]], "mha": [[…]], "norm1": [[…]], "hidden": [[n × dFF]], "ffn": [[…]], "out": [[…]] } | null
  }],
  "next": { "vocab": ["reading", "sleeping", "playing", "eating", "a"], "logits": [2.0, 1.2, 0.8, 0.1, -1.0] } | null
}
// Only "A" is required per head; every other matrix is optional and its step/view is disabled when missing.
// Field names deliberately equal ZVect's attention() / encoderBlock() results, so ZVect's adapter is a plain reshape.

"options": {
  "views": ["embed", "attention", "lines", "heads", "block", "sampling"],   // order = layout order
  "lang": "en" | "th", "text": { "<key>": "override" }, "config": { "<key>": override },
  "layer": 0, "head": 0, "step": 5, "token": null, "mode": "dots" | "cells", "threshold": 0.1,
  "sampling": { "temperature": 1, "mode": "none" | "topk" | "topp", "k": 3, "p": 0.8, "seed": 1 },
  "bus": "<a createBus() object>", "css": true
}
```

### 4.4 Event bus (LinkedSelection)

```js
// message = { type: "hover" | "select" | "step" | "clear", source: "<view id>", ids: [ … ] }
// id kinds: { kind: "token", i } · { kind: "cell", i, j } · { kind: "head", layer, h } · { kind: "stage", name } · { kind: "candidate", i }
const bus = createBus();
const off = bus.on("hover", (msg) => { … });   // returns an unsubscribe function
bus.hover([{ kind: "token", i: 2 }], "lines");
bus.select([{ kind: "head", layer: 0, h: 1 }], "heads");
bus.clear("embed");
```

Views never import each other; they talk only through the bus (app-maker §3.6). `handle.on(evt)` is a thin pass-through to the same bus for the host.

## 5. Verification

| gate | what | when |
|---|---|---|
| Unit tests | every logic function in `core/` tested directly in `node --test` (no DOM); component files tested where a seam exists (geometry output, app state reducer) | each slice |
| Red proofs (one per guarantee) | planted breaks, watch the named test fail, restore byte-identical: softmax without max-subtraction (overflow test), mask `j <= i` → `j < i` (diagonal test), top-p rule flip (§3.3 table test), top-k tie order, bus `off` not removing (unsubscribe test), validate accepting a ragged matrix, `null` ↔ −∞ round trip, manifest sha drift, file of 201 lines | S1, S3, S4 |
| Drift guard | `tests/tviz_zvect.test.js`: tviz numbers = `attention.js` / `tblock.js` numbers on `transformer.json` (incl. the 0.538 of §3.2) | S1 |
| `npm run style` | all new js files listed in `tools/style-scope.json`: ≤200 lines, LF, comments ≤3 lines, no one-line functions, one statement per line | each slice |
| `npm test` | adds `lib/tviz/atdd/*.test.js` + `tests/tviz_zvect.test.js` to the script | each slice |
| Playwright (dev tool of the agent, not a package dependency) | demo page at 1400 / 820 / 390 wide, deviceScaleFactor 2: no horizontal scroll, no console error, no 404; hover a token → highlight in every view; step ▶ through all 7 steps; threshold slider; head switch; T / top-k / top-p bars match §3.3; keyboard only run; reduced-motion run; **screenshots looked at** | S2, S3 |
| Portability proof | copy `lib/tviz/` alone into an empty scratch folder with a 10-line host page and a Node built-in static server: mounts in seed mode, zero errors, zero 404s; then `node --test tviz/atdd/` passes there | S4 |
| Detachability | ZVect without `lib/tviz/` (moved aside): site loads, only the demo link 404s → link is removed with the folder (README note) | S4 |
| Independent review | fresh Opus subagent, data-only brief: the R-rows of §5.1 copied verbatim + file list + gate outputs; JSON fail-closed verdict; ≤2 fix cycles (a 3rd only with the owner's yes) | before close |

### 5.1 R-rows (the reviewer's brief is copied from here, verbatim)

- R1 One folder, one facade; a host imports only `index.js`; nothing in the folder imports outside it (no `../../lib/zvect.js`, no `web/js/*`).
- R2 Zero dependency; no network request except the folder's own css/json; works served over HTTP from any path.
- R3 Logic files are pure (no DOM, no fetch, no globals); every logic function has a direct test; at least one red proof per row in §5.
- R4 Every code file ≤200 lines; no one-line functions; comments ≤3 lines; no UI text or tunable inline (text/*.json, config/*.json, `--tviz-*`).
- R5 Numbers equal ZVect's `attention.js` / `tblock.js` on `transformer.json`; the attention steps follow the §3.2 table; sampling follows the §3.3 table and the top-p rule chosen in Q11.
- R6 Views talk only through the bus; the §3.4 table holds.
- R7 Missing trace matrices disable steps/views; nothing is invented; seed mode labels itself as toy data.
- R8 Dark by default, themable by CSS variables only; no style leaks outside `.tviz`.
- R9 1400 / 820 / 390 without horizontal scroll; keyboard usable; reduced motion respected; a hidden table carries every drawn matrix for screen readers.

## 6. Cost, slices, and the cheaper alternatives

### 6.1 Which skill

**coder**, not app-maker. app-maker's day-one rules are for apps with tables, galleries, selection, delete and on-disk naming (§1–§2 of that skill); none of those exist here.
From app-maker only §3.3 (facade), §3.6 (bus instead of sibling imports) and §4 (self-check → agent review → close) are used, and coder already covers the rest. Cheaper and fewer rules to satisfy.

### 6.2 Slices (each closable by a deterministic check or the owner's click-review)

| slice | content | closes on | approx. lines (code + test) |
|---|---|---|---|
| S1 | `core/*` (9 logic files), `config/`, `text/`, tests + red proofs, drift test | `npm test` + `npm run style` green, red proofs logged | 1,110 + 650 |
| S2 | facade, `tviz.css`, `ui/` surface, widgets, mathml, tokens, heatmap, player, attention, lines, heads, app; demo page | Playwright run + screenshots; owner can click the demo | 1,500 + 80 |
| S3 | `ui/block.js`, `ui/sampling.js` (+ V1 embedding table), demo extended | Playwright for V6/V7 + §3.3 numbers on screen | 520 + 60 |
| S4 | README, LICENSE, MANIFEST + manifest test, portability proof, detachability, independent review | review PASS | 0 + 70 |

Estimate: about 3,130 code lines + 860 test lines; roughly 4 build sessions (one per slice) plus 1–2 review cycles.
**The owner may stop after S2** (attention core: V2–V5 + bus) and still have a usable widget; S3 adds V1-embedding, V6, V7.

### 6.3 Cheaper alternatives considered

| option | saves | loses | verdict |
|---|---|---|---|
| A. Reuse the lesson canvases (10.2 / 10.4 components with `Scene3D`) | most of S2 | not portable: they need `app.js`, `kit.js`, `scene3d.js`, `lib/zvect.js` and the lesson shell; the 3-D vector scene is the wrong picture for matrices | **no** |
| B. DOM-first: matrices as HTML tables with colored cells (the `matrixTable` pattern of lesson 10.2), one canvas only for lines and arcs | ~30% of the component code (no hit-testing / HiDPI for heat maps), accessibility for free | dot mode and smooth ramps look worse; 16 × 16 × 12 thumbnails = 3k DOM cells in the head grid | good fallback; Q20 |
| C. Attention-only v1 (stop after S2) | ~600 code + 150 test lines | no embedding table, no block view, no sampling | allowed by the slices |
| **D. Recommended: v1 as in §3 (Canvas for dense marks, HTML for every text), built in S1–S4** | — | — | **yes** |

## 7. Open questions for the owner (all of them, up front; each with the recommended answer)

1. **Skill to follow?** → **coder** (plus app-maker §3.3, §3.6, §4 only). Reason in §6.1.
2. **Where does the folder live in ZVect?** a) `lib/tviz/` b) `web/tviz/` c) a separate repo → **a) `lib/tviz/`**: the "take it and use" folder, MANIFEST pattern, already published by `package.json files`.
3. **Math code: copy or share?** a) tviz has its own `core/tmath.js` (copy of matmul / softmax / mask / layerNorm / seeded / position) + a drift test against `attention.js` / `tblock.js` b) move the math into tviz and make `attention.js` import it
   → **a)**: the folder must stand alone, and the closed chapter-10 files (`WIP202610048`) stay untouched; the drift test keeps the two copies equal.
4. **Where do the tests live?** a) inside the folder (`lib/tviz/test/`, travel with it, added to `npm test`) b) ZVect `tests/` → **a)**, plus the one ZVect-only drift test in `tests/`.
5. **Config and text format?** a) `.json` fetched at mount (mount is async) b) `.js` modules (sync) → **a)** (coder §5: config is always .json); `options.config` / `options.text` override without editing files.
6. **Module format?** a) ES module only (host needs HTTP) b) also a single-file classic-script build for `file://` → **a)** in v1; b) goes to the v2 list (it needs a bundling tool, our own, in `tools/`).
7. **v1 scope?** a) the seven views of §3 in S1–S4 b) attention core only (stop after S2) → **a)**, with the right to stop after S2.
8. **Q/K/V colors?** a) Transformer Explainer's code: Q blue, K red, V green, attention purple (mapped to ZVect's `--z`, `--x`, `--y`, `--vr` hex values) b) ZVect vector colors (Q `--va` pink, K `--vb` amber, V `--y` green) because ZVect says red/green/blue mean x/y/z everywhere
   → **a)**: readers who also open Transformer Explainer see the same code, and tviz never draws x/y/z axes; it stays one variable each, so a host can switch.
9. **Language?** a) module default `en`, ZVect demo passes `lang: "th"` b) default `th` → **a)**: other projects are more likely English; both files ship.
10. **License of the folder?** a) ZVect license (non-commercial) with a `LICENSE` copy inside b) a permissive license (e.g. MIT) for tviz only → **a)** until you decide otherwise; this question only needs an answer if other projects are commercial.
11. **Top-p rule (§3.3, different results)?** a) rule A, smallest set with cumulative ≥ p (common definition) b) rule B, keep while cumulative ≤ p (Transformer Explainer card) → **a)**; the formula card shows the rule in words.
12. **Input modes in v1?** a) trace + weights + seed b) trace only → **a)**: seed mode lets another project show something with only a token list; it costs ~40 lines because `seeded()` is in `tmath` anyway.
13. **Limits?** max 16 tokens, max 64 dims drawn (more → evenly sampled dims + a note), head grid up to 12 × 12 → **yes, in `config/defaults.json`**.
14. **"Sample" button in V7?** a) seeded draw + argmax marked b) argmax only c) none → **a)**; no Generate loop (needs a model).
15. **Real model data (GPT-2 trace) in v1?** → **no**; toy data only. The contract already fits a real export; an exporter (Python, size and license of the weights) would be its own WIP.
16. **WIP id?** → **mint `WIP202610052`** for this work (the folder name already uses it) and record it in checkpoint ver002.
17. **Playwright** is used as the agent's dev tool, not added to `package.json` (APPROVALS policy unchanged) → **yes**.
18. **Accessibility level?** focusable tokens and player buttons, keyboard ← → space, `prefers-reduced-motion`, a hidden data table per drawn matrix → **yes** (≈ 60 lines in `widgets.js`).
19. **Reviews?** a) one independent Opus review before close (≤2 fix cycles) b) also one after S2 → **a)**; self-gates run per slice. Choose b) if you want the attention core checked before S3 starts.
20. **Heat maps: Canvas or DOM tables?** (§6.3 option B) → **Canvas** as you asked ("Canvas + html"); DOM tables stay the fallback if the HiDPI / hit-test code grows past its budget.
21. **Animation?** a) instant step changes + caption bar b) tweened transitions between steps → **a)**: cheaper, and reduced motion is free.
22. **Where does ZVect link the demo?** a) one link on the existing "เอา lib ไปใช้" page b) a sidebar item c) nowhere (URL only) → **a)**; no chapter, no lesson entry. The LLM manual (`WIP202610050`) may mount single views later as mini-widgets; that would be decided in that WIP.
23. **Light theme?** → **no preset** (ZVect rule: dark only). The README lists the `--tviz-*` variables so a host can make its own.


### Owner's answers (2026-10-13; Q1–Q8 by voice 20:3x–20:5x, Q9–Q22 typed 21:27–21:51)

**Standing rule (owner, Q5):** "อะไรก็ตามที่ follow ตามโคเดอร์ให้วิ่งตามโคเดอร์เลย" — any question the coder skill already decides follows coder and is not asked again.

| Q | answer | owner's words / note |
|---|---|---|
| 1 | a) coder as the base; facade + bus + check order are just clean code | "ใช้โคเดอร์แหละแต่ให้โค้ดมันสะอาดด้วย … พอมันเป็นไลบรารี" |
| 2 | a) `lib/tviz/` | asked first how it works inside ZVect vs in another project (answer: same folder, copy whole, import `index.js`, nothing imports outside the folder) → "อันนี้แหละ" |
| 3 | a) own `core/tmath.js` copy + drift test against `attention.js` / `tblock.js` | "อันนี้แหละ" |
| 4 | tests in **`lib/tviz/atdd/`** (Acceptance Test Driven Development): `atdd/` sits at the module root, organised inside by function; acceptance tests are written first, red-proven, then code makes them pass. JS only (no py/ or data/ needed). Added to `npm test`. The one ZVect drift test stays in `tests/`. | "ATDD เป็นโฟลเดอร์ใหญ่ของโมดูล … root/ATDD … ข้างในแล้วแต่ว่าจะเทสต์ฟังก์ชันอะไร" · "ATDD Acceptance Test Driven Development" (the plan's `test/` is renamed `atdd/` everywhere) |
| 5 | a) `.json` fetched at mount (coder rule) | "follow ตามโคเดอร์" |
| 6 | a) ES module only, main concept = GitHub Pages. **Plus a separate later WIP:** our own zero-dependency single-file HTML packer in `tools/`, generic for any visualizer, not only tviz | "อยากไปในทางตัวเลือกหนึ่ง แต่อาจจะมีกลิบสำหรับแพ็ค HTML เผื่อทำ Visualize อย่างอื่นได้" → "โอเคได้" |
| 7 | a) all seven views, S1–S4, may stop after S2 | "ตัวเลือกเอ" |
| 8 | a) Transformer Explainer colors (Q blue, K red, V green, attention purple), one CSS variable each | "เลือกตัวเลือก A" |
| 13 | limits in `config/defaults.json` (16 tokens, 64 dims, 12 × 12 heads) | coder rule |
| 16 | mint `WIP202610052` | coder rule (bucket) |
| 17 | Playwright = agent dev tool, not in `package.json` | coder rule |
| 18 | accessibility as recommended | coder rule (bucket) |
| 19 | a) one independent Opus review before close | coder rule |
| 23 | no light preset | ZVect rule |
| 9 | **language by channel**: module default `en` (API, `buildTrace`, validate/error messages, AI sessions, other projects that pass nothing); every human-facing HTML (single-file packed page, iw-style reports, ZVect demo) passes `lang: "th"` always | "ถ้าเป็น html แบบแพค iw ใช้ภาษาไทยเสมอ แต่ในรูปแบบอื่น หรือ call จาก ai session หรือ api ใช้ en เสมอ" |
| 10 | a) ZVect license, `LICENSE` copy inside the folder | "a" |
| 11 | a) top-p = smallest set with cumulative ≥ p (rule A, §3.3) | "a" |
| 12 | a) trace + weights + seed | "a" |
| 14 | a) seeded "sample" button + argmax marked; no Generate loop | "a" |
| 15 | a) toy data only in v1; a real-model trace exporter is its own WIP | "a" |
| 20 | a) Canvas heat maps; DOM tables stay the fallback | "a" |
| 21 | **b) tweened animation** between steps: cell colors and numbers interpolate, masked cells fade to grey, attention lines tween width/opacity, probability bars tween length; durations in `config/defaults.json`; `prefers-reduced-motion` → instant; own `requestAnimationFrame` code, no dependency. Adds a logic file `core/tween.js` (pure interpolation/easing, tested in node, ~80 lines) + ~100 lines in components → **10 logic files**, total ≈ 3,300 code lines | "b ทำเถอะ การทำ animation + motion มันเพิ่มความน่าสนใจ" |
| 22 | **rename the "เอา lib ไปใช้" page into a hub with two sections, Library and Demo** (tviz demo now, other demos later); `#/lib` keeps working; small edit in `index.html` + `app.js` inside S4. **Name: "Lib & Demo"** (owner 22:02) | "เปลี่ยนจาก 'เอา lib ไปใช้' เป็นคำอื่นที่เปิดไปแล้ว ไป lib ก็ได้ Demo ก็ได้" · name "Lib & Demo" |

## 8. After the answers

1. Write the answers into this file (a "Owner's answers" table under §7), then mint the WIP in the checkpoint.
2. S1 → S4 as in §6.2; each slice records its gate numbers from that run in a "Build log" section here.
3. Independent review → "Review log" section (cycle, verdict, items), the same as `WIP202610042`.

## Build log

### S1 — logic only (2026-10-13 22:10–22:25 Asia/Bangkok, agent tviz-s1, Opus)

Working copy: staged repo copied to `/home/claude/work/zvrepo/` (owner's PC not written, no git). ATDD: all acceptance tests and the drift test were written first
and run red (`npm test`: 12 failing files, every one "Cannot find module ../core/…"), then `core/` was written until green.

**Baseline (before any change, this run):** `npm test` 66 pass / 0 fail · `npm run style` PASS 40 files · `npm run reindex -- --check` up to date (10 chapters, 43 topics) ·
`npm run check` (python3 + g++ present) PASS, 46 OK.

**Files (lines by `wc -l`):**

| file | lines | | file | lines |
|---|---|---|---|---|
| `lib/tviz/core/tmath.js` | 180 | | `lib/tviz/atdd/tmath.test.js` | 101 |
| `lib/tviz/core/trace.js` | 165 | | `lib/tviz/atdd/trace.test.js` | 122 |
| `lib/tviz/core/validate.js` | 178 | | `lib/tviz/atdd/validate.test.js` | 99 |
| `lib/tviz/core/guards.js` | 77 | | `lib/tviz/atdd/guards.test.js` | 51 |
| `lib/tviz/core/steps.js` | 94 | | `lib/tviz/atdd/steps.test.js` | 100 |
| `lib/tviz/core/sampling.js` | 111 | | `lib/tviz/atdd/sampling.test.js` | 123 |
| `lib/tviz/core/color.js` | 89 | | `lib/tviz/atdd/color.test.js` | 54 |
| `lib/tviz/core/geometry.js` | 120 | | `lib/tviz/atdd/geometry.test.js` | 82 |
| `lib/tviz/core/bus.js` | 75 | | `lib/tviz/atdd/bus.test.js` | 99 |
| `lib/tviz/core/format.js` | 46 | | `lib/tviz/atdd/format.test.js` | 67 |
| `lib/tviz/core/tween.js` | 85 | | `lib/tviz/atdd/tween.test.js` | 66 |
| `lib/tviz/config/defaults.json` | 96 | | `lib/tviz/atdd/fixtures.js` | 74 |
| `lib/tviz/text/en.json` | 137 | | `tests/tviz_zvect.test.js` | 91 |
| `lib/tviz/text/th.json` | 137 | | | |

Logic 1,220 lines (11 files) · tests 1,129 lines (incl. fixtures). Changed: `package.json` (`test` script only: +11 atdd files + drift test),
`tools/style-scope.json` (+24 files). Imports inside `lib/tviz/` stay inside it (only `./`, `../core/`, `node:` in tests); no `window`/`document`/`fetch`/globals in `core/`.

**Gates after the build (this run):** `npm test` **155 pass / 0 fail** (66 old + 83 atdd + 6 drift) · `npm run style` **PASS 64 files** ·
`npm run reindex -- --check` up to date (10 chapters, 43 topics) · `npm run check` PASS (46 OK). All files LF; every code file ≤ 200 lines.

**Plan tables re-computed with `web/js/attention.js` on `transformer.json` before writing the tests:** §3.2 every row matches (q 2.000 · 0.600 · 0.400; raw 0.560 · 4.320 · 2.560 · 0.760 · 1.960;
scaled 0.323 · 2.494 · 1.478 · 0.439 · 1.132; softmax 0.061 · 0.538 · 0.195 · 0.069 · 0.138, causal 0.077 · 0.677 · 0.245 · 0 · 0; out 1.273 · 0.713 · 0.508).
§3.3 every percentage matches (T 1 / 0.5 / 2, top-k 3, top-p 0.8 rule A 57.1 · 25.7 · 17.2, rule B 69.0 · 31.0).

**Red proofs (plant → run → named test fails → restore; md5 after restore = md5 before):**

| break planted | failing test(s) | restored md5 |
|---|---|---|
| softmax without max-subtraction (`tmath.js`) | softmax: sums to 1, does not overflow on large inputs | OK a27c23d6 |
| causal mask `j <= i` → `j < i` | causalMask: keeps the diagonal and everything before it | OK a27c23d6 |
| top-p rule A → rule B (`sampling.js`) | plan §3.3: top-p p = 0.8 follows rule A … not rule B (+3 more) | OK c8101294 |
| top-k tie: later index wins | top-k ties at the boundary … the earlier vocab index wins (+ rankOrder, top-p ties) | OK c8101294 |
| bus `off` does not remove | on returns an unsubscribe function; off removes the listener | OK b2df94e5 |
| bus echo rule removed | echo rule: a listener registered with its view id does not receive … | OK b2df94e5 |
| validate accepts a ragged matrix (`guards.js`) | matrixProblem: ragged rows …; collector …; weights: a ragged matrix is rejected with its path | OK d0f86fa1 |
| `null` → −∞ dropped on import (`trace.js`) | null <-> -Infinity … (round trip); trace mode: scaled is taken from S only when … | OK 558706b0 |
| −∞ → `null` dropped on export | null <-> -Infinity … (round trip) | OK 558706b0 |
| easing not clamped (`tween.js`) | ease clamps t outside 0..1 … | OK 10a51242 |
| drift: score `x / d` → `x * (1 / d)` | tviz_zvect: buildTrace (weights) = attention() …; seed plan = blockWeights …; seed mode … | OK a27c23d6 |
| Thai glued to Latin in `th.json` | th.json: a space between Thai and Latin letters or digits | OK 7a21bb84 |
| `format.js` padded to 201 lines | `npm run style` `format.js:201 201 lines`; style.test "every file in tools/style-scope.json follows the rules" | OK 35969df9 |

(manifest sha drift = S4.)

**Deviations from the plan, and why:**

1. **11 logic files, not 10:** `validate.js` came to 247 lines → split by category: `core/guards.js` (generic matrix / list / enum checks + error collector) and `core/validate.js` (the §4.3 contract).
   `atdd/guards.test.js` holds the tests moved out of `validate.test.js` (written there first) plus collector tests.
2. `tmath.divideAll` instead of `scaleAll`: dividing (not multiplying by 1/d) keeps tviz bit-equal to `attention.js`; the drift red proof shows the multiply version breaks equality.
3. A head carries an optional **`scaled`** matrix (scores before the mask) so step 3 exists when causal is on. In trace mode it is taken from `S` only when the head is not causal; otherwise step 3 is disabled (nothing invented).
4. Error keys: the generic "shapeMismatch" became `rowsMismatch` / `colsMismatch` / `lengthMismatch` + `blockPartial` (Wo/W1/W2 all or none); `vars` are plain numbers / arrays,
   so `format.fill` needs no inline words; `text.format.listSep` joins enum lists.
5. `input.next` (vocab + logits) is accepted at the top level in weights / seed mode (plan had it only inside a trace), so V7 works without a trace.
6. Seed mode also seeds the token vectors: `X = seeded(seed + seedPlan.x)`; all seed offsets live in `config.seedPlan` (equal to ZVect `blockWeights`, guarded by the drift test).
   Weights-mode defaults: `position "none"`, `scale "sqrtDk"`, `causal false`, base / eps from `config.seed`.
7. Toy data for the atdd tests is a JS fixture `atdd/fixtures.js` (owner Q4: no `atdd/data/`); the drift test fails if it differs from `transformer.json`.
8. `softmax` of a fully masked row returns zeros (ZVect would give NaN; cannot happen with a causal mask). `headSummary` entropy is in nats. `bus.last(type)` added for views that mount later.
9. Limits: `maxLayers 12` and `maxHeadsPerLayer 12` added next to `maxHeads 144` (Q13 "12 × 12"); A rows must sum to 1 within `limits.rowSumTolerance` (1e-6).
10. Developer-only exceptions on impossible internal calls (unknown scale / easing / bus event / sampling mode) keep a short English message; user input never reaches them because `validate` checks first.

**Found in the plan:** `node --test tviz/atdd/` (§2.4, §5 portability row) fails on Node 22 with a directory argument ("Cannot find module …/atdd");
S4 must use `node --test tviz/atdd/*.test.js`. §4.2 totals still say "9 logic files".
