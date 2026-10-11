# ZVect — checkpoint ver002

- **Date:** 2026-10-11 (Asia/Bangkok). Re-counted against disk on 2026-10-11 (numbers in §3 were run at the cut, not carried from ver001).
- **Archive map:** `checkpoint.zvect.ver001.md` §5b holds upckp #1–#33 (2026-10-10 → 2026-10-11). Its §1–§6 are stale by design; read its
  §5b only for history. Closed rows in full: `checkpoints/archive/ARCHIVE.<mint month>.md` (now `ARCHIVE.202610.md`), addressed by WIP ID —
  not part of the start-up read.
- **Language rule:** checkpoints are ENGLISH. Thai only for a term with no English form (e.g. `เคาะ`), a literal UI string, or the owner's
  words quoted verbatim. There is no lang checker in this repo yet (`WIP202610007`).
- **§6 is physically last but is read FIRST**, then §5c, then §1–§5.
- **Edit flow:** the owner edits / commits on Windows in `D:\repository\ZVect`. Claude works in a cloud container and copies files back
  through the device bridge (new outputs dir, `expectedMtimeMs`, stage back, md5). No sync script. Claude never runs git write commands.
- **DO-FIRST for the next session:** read `README.md` → walk `checkpoints/checkpoint.zvect.ver*.md` numerically → read the latest in full
  (§6 first) and the previous one → read the newest `.dropzone/hzup_claude/*.md` → run `npm test` and `npm run check` → summarize the open
  WIP count before any work. Expected after upckp #35: 11 open rows in §6, 33 closed rows in §5c, 33 IDs in the archive.

---

## §1 Concept

ZVect teaches vectors step by step, from "a vector is a list of numbers" through tokens, search and HNSW to bi-encoder,
late interaction and reranking, ending with vectors inside an LLM. Every lesson has an explanation block on top, a canvas
(3D orbit, or a zoomable 2D picture), the formula (MathML) line by line with live numbers, and runnable code in JavaScript /
C++ / Python. The vector library used by the lessons (`lib/`) is also a deliverable: one file per language to copy.

Owner rules (เคาะ by the owner 2026-10-10 / 2026-10-11):
1. **No frameworks, no dependencies.** Exceptions only with a dated owner-approval row in `docs/APPROVALS.md` *before* the dependency
   is added. `npm test` fails if `package.json` lists any dependency.
2. **Dark theme only.** No light theme, no `prefers-color-scheme` switch.
3. **Short and simple, beginner first, one idea per topic.** Each lesson uses only ideas from earlier lessons. Formula words in English.
4. **Grouped topics.** 7 chapters (§3); chapter 6 is "การผสานทฤษฎี" (owner 16:04 — still theory, not "ใช้งานจริง").
5. Content language for learners: Thai, technical terms in English. Content only from the aimd files ("ถ้าอันไหนไม่อยู่ก็ไม่อยู่");
   anything else labelled "(ความรู้ทั่วไป / ผู้จัดทำเลือก)". No web search to add lesson content.
6. Non-commercial study license (`LICENSE`, bilingual, Thai prevails).
7. "เดี๋ยว commit เอง": the owner commits; Claude gives a commit line (< 120 chars) and `git reset --soft HEAD~1`.
8. No scrollbar inside any box; the page scrolls. Multilingual words are coloured by language everywhere (owner 16:12).

## §2 Architecture

- `lib/zvect.{js,py,hpp}` — same API and same edge-case rules in three languages (size mismatch / empty list / no centroids / empty
  table throw; zero-vector cosine = 0; ties keep input order or first label; `fmt` = 3 decimals, exact ties to even).
- `examples/{js,py,cpp}/NN_*.{js,py,cpp}` — one example per lesson; the web code tab fetches these exact files.
  `npm run check` runs all three and requires byte-identical stdout.
- `tests/parity/{js,py,cpp}/edge_cases.*` — edge-case probes, also compared by `npm run check`.
- `web/` — static app served by `server.js` (node:http). `web/js/scene3d.js` = Canvas 2D perspective renderer (orbit, painter's sort,
  near-plane clipping) plus a 2D zoom / pan mode (`scene.flat`, turned on by a lesson's `zoom2d`). `web/js/kit.js` = MathML + controls
  (`makeUI`: tagText, toggles, choice, buttons, text, number). Lessons `web/lessons/NN_*.js` export
  `{ slug, title, en, example, hint, canvasLabel, intro, try, steps, stepsWhy, lines, formulaFrom, symbols, symbolsNote, notes, refs,
  mount(ui) → { draw, draw2d, live, zoom2d } }`. `web/js/app.js` holds `GROUPS`, the hash router, the lib page and the Dict page.
- Shared lesson modules: `multilang.js` (toy 4-language encoder, samples, negation), `dict/` (dictionary: `index.js` facade `dict` + `createDict`, `facade.js`, `adapters.js` source / store, `model.js` pure rules, `page.js` Dict page), `tokdraw.js`
  (token → number picture), `graph.js` / `anntree.js` / `search.js` (chapter 5), `sources.js` (source ids for Ref tabs).
- Data: `web/data/dict/{meanings,en,th,zh,jp,negation}.json` + `web/data/samples.json` + `web/data/samples_late.json`. `dict.js`
  inserts defaults + the learner's words into localStorage "zvect.dict" (version = djb2 hash of the files); Dict page `#/dict` adds,
  deletes, resets and exports.
- Distribution: `lib/MANIFEST.json` (version + sha256, `npm run manifest`, checked by `npm test`), `llms.txt`, `lib/README.md`,
  `package.json` `exports` (`npm install github:zardokar/ZVect`). GitHub Pages-ready (`WIP202610024`).

## §3 Stack / layout / env

- Node >= 18 (container v22.22.0), Python 3 (3.13.16), g++ C++17 (13.3.0). **Not yet run on the owner's Windows machine** (`WIP202610011`).
- Chapters and lessons (`web/js/app.js` `GROUPS`, display number = chapter.position; file prefixes are creation order):
  - 1 พื้นฐานเวกเตอร์: 01 vector, 16 length, 04 vector space, 15 vector ops, 20 matrix
  - 2 วัดว่าสองเวกเตอร์ใกล้กันแค่ไหน: 11 distance, 02 dot product, 03 cosine
  - 3 เปลี่ยนข้อความเป็นเวกเตอร์: 34 tokenize, 35 bpe, 37 gpt tokenizer, 21 token id, 22 one-hot, 23 bag of words, 12 embedding matrix, 24 learn table, 05 latent space
  - 4 ค้นหาของที่ใกล้ที่สุด: 06 similarity, 18 search distance, 19 search dot, 07 choose metric, 33 keyword search
  - 5 ค้นให้เร็วเมื่อข้อมูลเยอะ: 27 brute force, 08 high dimensions, 17 binary xor, 28 ann tree, 29 nsw graph, 13 vector search, 30 hnsw beam, 31 hnsw build, 32 filter graph
  - 6 การผสานทฤษฎี: 09 bi-encoder, 36 late interaction, 14 reranker, 10 classification
  - 7 เวกเตอร์ใน LLM: 25 llm input, 26 attention
- Counts re-run at upckp #35 (2026-10-11 18:2x, container copy staged from the device): 37 lessons in GROUPS (39 files in `web/lessons/`,
  incl. the 2 stale pre-rename files of `WIP202610021`); 39 examples per language; `npm test` 20 pass / 0 fail (15 lib + 5 dict, since #38); `npm run check` 40 suites OK
  (39 examples + edge_cases), PASS; source total 6114 lines at #38 (`wc -l lib/zvect.* web/js/*.js web/js/dict/*.js web/lessons/*.js server.js tools/*.js`);
  10 files + `dict/` (5 files) in `web/js/` at #38; 6 dictionary JSON files. Device: 21 iw reports (`docs/outhtm/*.html`, `docs/aimd/*_claude.md`) after #35
  (14 at the ver002 cut, +6 in #34, +1 in #35).
- Line endings: checkpoints, README and archive LF (measured at the cut); `.gitattributes` = `* text=auto eol=lf`, `*.bat` CRLF.

## §4 Key files + skills roster

| file | role |
|---|---|
| `lib/zvect.js` / `.py` / `.hpp` | the library (single file each) |
| `lib/MANIFEST.json` | sha256 + version; regenerate with `npm run manifest` |
| `llms.txt` | entry point for other AI sessions |
| `web/js/scene3d.js` | 3D renderer + 2D zoom mode |
| `web/js/app.js` | groups, router, formula steps, three boxes, code tabs, lib page, Dict page |
| `web/js/dict/` · `web/data/` | dictionary (facade `dict/index.js`; nothing outside the folder imports its other files) · default dictionary + samples (JSON) |
| `web/js/multilang.js` · `web/js/tokdraw.js` | 4-language toy encoder · token → number picture |
| `web/lessons/*.js` | 37 lessons (+ 2 stale files, `WIP202610021`) |
| `tools/check-examples.js` | 3-language parity gate |
| `tools/zv.js` | terminal calculator that prints every step (`npm run zv -- dot 1,2,3 4,5,6`) |
| `docs/APPROVALS.md` | dependency approval log (no approvals) |
| `REFERENCE.md` | every source read (iw) and what each lesson took from it, corrected, or added; topic groups + tag index on top, a `tags:` / `ใช้ในบท:` line under every source heading (#34) |
| `docs/outhtm/` · `docs/aimd/` | iw reports (Thai HTML) · English context files (the only lesson sources) |
| `docs/arch/WIP<id>_<topic>/` | plans and design sketches, WIP ID first |
| `checkpoints/archive/ARCHIVE.202610.md` | closed rows in full, filed by mint month |

Skills the owner asked for: **checkpoint** (this file; ledger rules of the checkpoint-writer skill applied by hand, toolchain not ported —
`WIP202610007`), **hz** (handzup; handoffs in `.dropzone/hzup_claude/`, git-ignored), **iw** (intelligence-writer v5.1, `WIP202610022`),
**coder** and **reviewer** — **not found in this environment** (`WIP202610008`). Reviews are done by an independent subagent that did not
write the work (handzup rule 12 substitute; its verdict is not a named "reviewer" skill's verdict).

## §5 Workflow + §5a laws

- After editing `lib/`: `npm run manifest` → `npm test` → `npm run check`. All must pass.
- After editing a lesson: Playwright check of every lesson at 3 sizes (0 page errors, no overflow), look at screenshots, dark theme.
- New lesson = `examples/{js,py,cpp}/NN_name.*` (identical output) + `web/lessons/NN_name.js` + add to `GROUPS` + README / llms.txt /
  REFERENCE.md rows. A lesson carries `intro`, `try`, `lines` (+ `steps` [name, why] when ≥ 2 lines, optional `stepsWhy`), `formulaFrom`,
  `symbols`, `notes`, `refs` ([sourceId, what was used], ids in `web/js/sources.js`). Optional: `extra`, `symbolsNote`, `hint`,
  `canvasLabel`, `div.keep` tables. Explanation block full width on top; canvas + controls left; formula / values / list boxes; tabs
  อ่านสูตร / สรุปจากแหล่ง / โค้ด / Ref. No "อ่านเพิ่ม" detours; no scrollbar inside any box (`fitMath()` shrinks wide formulas).
- Multilingual words come from `web/data/dict/` via the facade `web/js/dict/index.js` (`dict.data`, `dict.rowOf`, `dict.addRow` …); never hard-code a word list in a lesson.
- UI component rule (owner 21:39–21:40): every look is a class in `web/css/style.css` driven by `:root` tokens (no one-off inline looks);
  controls share `--ctl-h` / `--ctl-radius`; a form above a table uses the table's own column tokens so columns line up; formulas use `math.eq`.
- 3D start view must show the whole lesson picture (`scene3d.js` fit); axis names may run off.
- No lone choices (owner 21:30): a choice group has ≥ 2 options; a lone "back to default" button uses `buttons(..., { visible })` so it shows
  only after a change; a lone button is allowed only when every press does something new (Random, add a point).
- iw: license gate, own words for standard-license sources, no lyrics, never bypass YouTube's bot check, independent fidelity review,
  outputs to `docs/outhtm/` + `docs/aimd/`, temp to `.dropzone/iw_temp/<YYYYMMDD_HHMM>/`; then registry row + REFERENCE.md + upckp,
  and PROPOSE lesson use (do not change lessons unasked).
- Delivery: new outputs dir → `device_commit_files` with `expectedMtimeMs` → stage back → md5 (strip C2PA FF EB from JPEG / SVG).
  No chat file cards for repo files; no browser downloads on the owner's browser.
- Closing a WIP row: write the full reason to `ARCHIVE.<mint month>.md` and the stub to §5c in the same edit (dual-write).

§5a laws:
1. Never quote a number you did not just run.
2. Never add a dependency without a dated row in `docs/APPROVALS.md`.
3. Never add a light theme.
4. The three libs must stay rule-identical; a new rule needs a probe line in `tests/parity/*/edge_cases.*`.
5. Never run git write commands for the owner.
6. A closed row not filed in the archive is a defect (7 were found at the 002 cut, #33): check §5c IDs ⊆ archive IDs at every upckp.

## §5b Update log (newest on top)

### #38 — 2026-10-11 22:13–22:4x — dictionary code in its own folder behind a facade

- Owner (22:13): "แยก Code เกี่ยวกับ Dict ใส่ dir แยกให้เรียบร้อย และทำเป็น Adapter ไว้เรียกใช้เขียนแบบ Facade". New `web/js/dict/`:
  `adapters.js` (source `jsonFileSource`, store `localStorageStore` / `memoryStore`), `model.js` (pure: parse defaults, validate, build, checkWord,
  withWord / withoutWord), `facade.js` (`createDict({ source, store })` → `langs, data, changed, rowOf, isNewRow, isMine, wordsOf, add, addRow,
  remove, reset, exportJSON`), `index.js` (the only entry point: `dict` singleton + re-exports), `page.js` (the Dict page, moved out of app.js).
  `app.js` and `multilang.js` import only `dict/index.js` / `dict/page.js`. Same localStorage key and shape ("zvect.dict") → stored words carry over.
  The form logic (EN word names the row, skip words already in it) moved into `dict.addRow`.
- `web/js/dict.js` is no longer used — owner deletes it (`git rm web/js/dict.js`); kept out of the delivery.
- `tests/dict.test.js` (5 tests, memory store + the real JSON files); `npm test` now runs both files: 20 pass / 0 fail.
- Checks: `npm run check` PASS, Playwright all lessons + Dict at 3 sizes 0 problems; Dict add / skip / new-row / leave-and-reload / reset tested.

### #37 — 2026-10-11 21:36–22:xx — start view fits the canvas, 4 languages in 3.1, equation box, Dict page on a grid

- Owner (21:36): 2.1 distance — vector b ran off the canvas at the start ("ปรับให้ระยะมันอยู่ใน canvas เป็น Default"); 3.1 Tokenization — show all
  4 languages at start. Done: `scene3d.js` fits the start view — a dry draw collects every arrow / point / label (axis names excluded) and moves
  the camera back (same angle, same target, never closer than the lesson's `view.dist`) until all sit ≥ 14 px inside the canvas; only at start,
  after double-click / 0, and on a resize while untouched — orbit / wheel hand the camera to the learner. A probe over all lessons at
  1400×900 / 1280×720 / 820×1000 / 390×844 found 14 lessons with something outside before (2.1 by 13 px, 2.3 cosine by up to 190 px on the y label …),
  0 after (content only). 3.1 starts with EN / TH / 中文 / 日本語; `tokdraw.js` keeps the bottom 26 px free for the zoom hint (it covered the 日本語 ids).
- Owner (21:39): formulas need a darker background, as a CSS class ("ถ้าไม่คือผิด rule ในการสร้าง component ui"). It was not a class before (style sat on the
  bare `math` element) — rule broken, fixed: `math.eq` component + tokens `--eq-bg / --eq-border / --eq-radius / --eq-pad`; `M.math` always emits
  `class="eq"` (no other `<math>` in the code). `display: block` must not be set on it (breaks MathML layout). `fitMath()` now measures inside the padding.
- Owner (21:40–21:41, Dict page): controls had different heights / offsets and did not follow a grid; the add form was hard to use. Now tokens
  `--ctl-h` (34 px, select / .txt / .btn), `--ctl-radius`, `--cell-gap` (table cell padding = grid column gap); `.dgrid` uses the table's own columns
  (`--dcol-mean` 28 %, `--dcol-lang` 18 % via `<colgroup>`): one row = meaning box + "+ เพิ่ม", then one word box per language (EN / TH / 中文 / 日本語),
  every filled box is added in one press; the new-meaning vector row spans the grid. Measured: form columns start at the table's column x (284 / 510 / 655 /
  800 / 946 at 1400 px), one control height (34 px), no overflow; phone = 2 columns.
- Checks: `npm test` 15/0, `npm run check` PASS, Playwright all lessons + Dict at 3 sizes 0 problems; Dict add / reset flow tested.
- Owner (21:48): the add button goes on the far right after every text box. Grid became 6 columns shared with the table
  (`--dcol-mean` 24 %, 4 × `--dcol-lang` 17 %, `--dcol-act` 8 %; the table has an empty 6th column, hidden on phones); the 4 word boxes are equal width,
  the button fills the action column; phone = meaning, 2 × 2 word boxes, button full width.
- Owner (22:07): "ช่องนี้คืออะไร งง" about the meaning box. Now labelled "ความหมาย (ชื่อกลาง)", a one-line note under the row explains it (the
  English id that ties the 4 languages into one table row; pick one to add a translation, or type a new one + 3-value vector), and an empty
  meaning box uses the EN word (vector row appears for a new one). Tested: EN-only new word, no EN + no meaning → message, existing meaning.
- Owner (22:10): still confusing — the user fills the language boxes anyway. Meaning box removed: the EN word names the row (a known EN word
  → its row, e.g. pets → pet; a new EN word → a new row + the food / animal / tech row). The first column now only shows where the words go
  ("พิมพ์คำ EN ก่อน" / "เพิ่มลงแถว fish" / "แถวใหม่: soup"); one help line under the lede; words already in that row are skipped quietly.

### #36 — 2026-10-11 21:30–21:5x — no lone buttons

- Owner (21:30, screenshot of 3.2 BPE): "ใช้ตัวอย่างในคลิป" had one button that looked pressed and did nothing — "ถ้ามันมีตัวเลือกเดียวจะแสดงทำไม",
  "มีอะไรแบบนี้อีกไหม". Swept every `ui.buttons` / `ui.choice` / `ui.toggles` in `web/lessons/` and `web/js/`.
- Found 3 of that kind and fixed them: 3.2 BPE (lone "pressed" sample button) and 4.4 choose metric (lone reset) → `kit.js` `buttons(..., { visible })`:
  a "back to the clip / default" button now appears only after the learner changed something, and hides again after it is pressed;
  7.1 LLM input (one toggle button "สลับ cat กับ mat") → a two-way choice "ตามประโยค (cat … mat)" / "สลับ cat กับ mat".
- Kept on purpose: 5.5 "สุ่มจุดเริ่ม (Random)" and 5.8 "ใส่จุดใหม่ 1 จุด (Random)" are lone buttons, but every press does something new.
- Checks: `npm test` 15/0, `npm run check` PASS, Playwright all lessons + Dict at 3 sizes: 0 problems; 3.2 / 4.4 show / hide / reset and 7.1 swap tested.

### #35 — 2026-10-11 17:17–18:2x — Karpathy GPT-tokenizer iw + new lesson 3.3 Tokenizer ของ GPT

- Owner (17:14) asked whether to split GPT from LLM; answer: no split, extend chapter 3 with "3.3 Tokenizer ของ GPT (byte-level BPE)" and make the
  HTML a GPT-tokenizer playground; a separate GPT chapter fits only a "Let's build GPT" model clip (would go in chapter 7). Owner (17:17): "ทำตามตาราง ต่อไป".
- `WIP202610038` (closed here): iw v5.1 on yt:zduSFxRajkE (2:13:34, 2024-02-20, standard license → own-words rewrite, 16 step-by-step sections,
  6 cropped frames + 2 own SVGs; code in the report rewritten, not copied). ASR 3,422 lines read in full via the built-in browser console channel.
  Inside the author's knowledge → no web fact-check. Independent fidelity review: 5 must-fix / 7 should-fix / nits, all applied (e.g. GPT-4 4-space indent =
  3-space token + " if"; 24,000 / 19,000 was the speaker rounding, not ASR). Temp `.dropzone/iw_temp/20261011_1717/`.
- New lesson 3.3 `37_gpt_tokenizer` (slug `gpt-tokenizer`): training text + test text on top, 3 author samples (Thai / English / mixed), k 0–40,
  "ก่อนรวม" = bytes only / GPT-2 split regex; canvas rows = test-text bytes (hex boxes, ids 0–255) and tokens after k rules (ids 256+);
  live: chars → bytes → tokens + ratio, char → code point → bytes table, decode round trip, a lone partial token decoding to �, training ratio,
  rules table, next pairs, regex chunks. Examples 37 js/py/cpp identical (121 bytes → 58 tokens after 6 merges, ratio 2.09).
- Chapter 3 renumbered: old 3.3–3.8 → 3.4–3.9 in lesson text ("บท 3.x"), README table, llms.txt, REFERENCE.md (header list, every "ใช้ในบท"
  / "เสนอ" / "บท 3.x"; −3.6 NanoBEIR left alone). Historical rows in §5c / archive / older §5b entries keep the numbers of their time.
- REFERENCE.md: new row + section + 11 new tags (111 tag rows), Tokenization and LLM-internals groups, fact-check line. sources.js id `karpathy`.
- Checks: `npm test` 15/0, `npm run check` PASS (40 suites), Playwright every lesson + Dict page at 1400 / 820 / 390 px: 0 page errors, 0 overflow,
  0 inner scrollbars; lesson 3.3 canvas looked at (52 % at 390 px with the default text, zoomable). Report: gates PASS, 0 overflow at 1400 / 390.
- Lessons other than 3.3 changed only for renumbering and one pointer in 3.2 notes; proposals stay in `WIP202610036` / `WIP202610023`.

### #34 — 2026-10-11 16:53–17:5x — six iw reports + tagged REFERENCE.md; Pages confirmed on

- Owner (16:53): Pages is open (`WIP202610024` closed); iw "RAG: Multivector" (yt:6iCmnd0k3fs), "ColBERT Update Detail" (yt:aiNQ4I8YaD0, yt:8LPgGU34RoE),
  "Embeddings" (yt:my5wFNQpFO0, yt:hVM8qGRTaOA, yt:YIR-KxNpSbA, yt:S7tFyREI19I); tag every REFERENCE.md section so other sessions can find things cheaply.
- yt:hVM8qGRTaOA was already read on 2026-10-10 (registry row exists) → not redone, only grouped under Embeddings.
- `WIP202610037` (minted + closed here): 6 reports, iw v5.1, standard license → own-words rewrite, built-in browser, temp `.dropzone/iw_temp/20261011_1655/`.
  Fact-check of the 4 post-cutoff clips by an independent search agent: 25 claims, 18 confirmed / 7 partly / 0 not found / 0 contradicted.
  6 independent fidelity reviewers: 9–15 findings each, all applied; Playwright: 0 page errors, 0 overflow at 1400 / 390 px; SVGs looked at (2 label overflows fixed).
- REFERENCE.md: 6 new table rows + 6 sections; "วิธีค้นแบบประหยัด token" section with 8 topic groups and a 100-tag index; `tags:` + `ใช้ในบท:` line under all 20 source headings. llms.txt + README point to it.
- iw notes learned: Web View console messages are cut at ~8,000 chars (chunk ≤ 7,500 works) and one read returns ~260 k chars max → read frames by group prefix
  (`FA_a`, `FA_b` …); small transcripts come back inline → log ~60 pad messages after the chunks to force the auto-saved file.
- Queued by the owner (17:12, confirmed 17:17 "ทำตามตาราง ต่อไป"): `WIP202610038` iw Karpathy "Let's build the GPT Tokenizer" as its own job,
  as a chapter-3 extension (not a separate GPT chapter) with a playable tokenizer page.
- Lessons were NOT changed; proposals for the new sources are in `WIP202610036` / `WIP202610023` (owner to pick).

## READING REGISTRY (iw / reading jobs)

| ref | date | title | HTML | MD |
|---|---|---|---|---|
| yt:zduSFxRajkE | 2024-02-20 (published) / 2026-10-11 (read) | Let's build the GPT Tokenizer (Andrej Karpathy; own-words rewrite in 16 steps, frames checked, no web fact-check) | docs/outhtm/20240220_Lets-Build-The-GPT-Tokenizer.html | docs/aimd/20240220_Lets-Build-The-GPT-Tokenizer_claude.md |
| yt:S7tFyREI19I | 2026-10-08 (published) / 2026-10-11 (read) | Training Your Own Embedding Model Is Not As Hard As You Think (Prompt Engineering; own-words rewrite, 8-claim fact-check) | docs/outhtm/20261008_Training-Your-Own-Embedding-Model-Is-Not-As-Hard-As-You-Think.html | docs/aimd/20261008_Training-Your-Own-Embedding-Model-Is-Not-As-Hard-As-You-Think_claude.md |
| yt:6iCmnd0k3fs | 2026-09-30 (published) / 2026-10-11 (read) | multivector-rag-demo (coded by Opus 5.5 Extra) (Vishal Bakshi; own-words rewrite, on-screen tables transcribed, 7-claim fact-check) | docs/outhtm/20260930_Multivector-RAG-Demo-Coded-By-Opus-5-5-Extra.html | docs/aimd/20260930_Multivector-RAG-Demo-Coded-By-Opus-5-5-Extra_claude.md |
| yt:YIR-KxNpSbA | 2026-08-03 (published) / 2026-10-11 (read) | How Tokens, Vectors & Embeddings Actually Work (NitMonk, Hindi; own-words rewrite from Hindi ASR, 5-claim fact-check) | docs/outhtm/20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work.html | docs/aimd/20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work_claude.md |
| yt:8LPgGU34RoE | 2026-07-31 (published) / 2026-10-11 (read) | Build ColBERT Search Locally with Qdrant Edge (HiDevs; own-words rewrite, 5-claim fact-check) | docs/outhtm/20260731_Build-ColBERT-Search-Locally-With-Qdrant-Edge.html | docs/aimd/20260731_Build-ColBERT-Search-Locally-With-Qdrant-Edge_claude.md |
| yt:aiNQ4I8YaD0 | 2025-05-25 (published) / 2026-10-11 (read) | Exploring Precision in ColBERT Indexing and Retrieval (Vishal Bakshi; own-words rewrite, numbers from frames) | docs/outhtm/20250525_Exploring-Precision-In-ColBERT-Indexing-And-Retrieval.html | docs/aimd/20250525_Exploring-Precision-In-ColBERT-Indexing-And-Retrieval_claude.md |
| yt:my5wFNQpFO0 | 2024-09-09 (published) / 2026-10-11 (read) | Machine Learning Crash Course: Embeddings (Google for Developers; own-words rewrite) | docs/outhtm/20240909_Machine-Learning-Crash-Course-Embeddings.html | docs/aimd/20240909_Machine-Learning-Crash-Course-Embeddings_claude.md |
| yt:xTzUn3G9YA0 | 2024-03-22 (published) / 2026-10-11 (read) | Supercharge Your RAG with Contextualized Late Interactions (Prompt Engineering; own-words rewrite, on-screen numbers from frames) | docs/outhtm/20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions.html | docs/aimd/20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions_claude.md |
| yt:BcxJk4WQVIw | 2024-01-24 (published) / 2026-10-11 (read) | Byte Pair Encoding - How does the BPE algorithm work? (Raj Pulapakura; own-words rewrite, counts re-run in code) | docs/outhtm/20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work.html | docs/aimd/20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work_claude.md |
| yt:H6q1UWCCnKw | 2026-02-28 (published) / 2026-10-10 (read) | Vector Embeddings. How to choose the embedding model based on the task at hand (Byte Goose AI; own-words rewrite, 11-claim fact-check) | docs/outhtm/20260228_How-To-Choose-An-Embedding-Model-By-Task.html | docs/aimd/20260228_How-To-Choose-An-Embedding-Model-By-Task_claude.md |
| yt:bU38Ovdh3NY | 2023-09-15 (published) / 2026-10-10 (read) | Qdrant: Open Source Vector Search Engine and Vector Database (CMU Database Group, Andrey Vasnetsov; CC BY, full translation) | docs/outhtm/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU.html | docs/aimd/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU_claude.md |
| yt:YLkSfz3EFGw | 2026-10-08 (published) / 2026-10-10 (read) | Vector Databases Are Dead. Use This Instead (Devsplainers) | docs/outhtm/20261008_Vector-Databases-Are-Dead-Use-This-Instead.html | docs/aimd/20261008_Vector-Databases-Are-Dead-Use-This-Instead_claude.md |
| yt:c10w0Ptn_CU | 2024-06-23 (published) / 2026-10-10 (read) | Approximate Nearest Neighbour From Scratch In Python (Sefik Ilkin Serengil) | docs/outhtm/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python.html | docs/aimd/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python_claude.md |
| yt:Lc4dzmSFb14 | 2026-05-30 (published) / 2026-10-10 (read) | Vector Search and HNSW Explained Visually (Satyajit Das) | docs/outhtm/20260530_Vector-Search-And-HNSW-Explained-Visually.html | docs/aimd/20260530_Vector-Search-And-HNSW-Explained-Visually_claude.md |
| yt:1Qex37vowTM | 2026-06-15 (published) / 2026-10-10 (read) | Vector Embedding : Build LLM from scratch (SOFAR) | docs/outhtm/20260615_Vector-Embedding-Build-LLM-From-Scratch.html | docs/aimd/20260615_Vector-Embedding-Build-LLM-From-Scratch_claude.md |
| yt:hVM8qGRTaOA | 2025-02-21 (published) / 2026-10-10 (read) | What Are Word Embeddings? (Under The Hood) | docs/outhtm/20250221_What-Are-Word-Embeddings.html | docs/aimd/20250221_What-Are-Word-Embeddings_claude.md |
| yt:NEreO2zlXDk | 2023-06-08 (published) / 2026-10-10 (read) | A Beginner's Guide to Vector Embeddings (Colin Talks Tech) | docs/outhtm/20230608_A-Beginners-Guide-To-Vector-Embeddings.html | docs/aimd/20230608_A-Beginners-Guide-To-Vector-Embeddings_claude.md |
| yt:e9U0QAFbfLI | 2023-01-29 (published) / 2026-10-10 (read) | Cosine Similarity, Clearly Explained!!! (StatQuest) | docs/outhtm/20230129_Cosine-Similarity-Clearly-Explained.html | docs/aimd/20230129_Cosine-Similarity-Clearly-Explained_claude.md |
| yt:fNk_zzaMoSs | 2016-08-05 (published) / 2026-10-10 (read) | Vectors, Chapter 1, Essence of linear algebra (3Blue1Brown) | docs/outhtm/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra.html | docs/aimd/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra_claude.md |
| yt:lPTcTh5sRug | 2025-08-18 (published) / 2026-10-10 (read) | How AI Turns Words Into Vectors: Embeddings (BlackBoard AI) | docs/outhtm/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings.html | docs/aimd/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings_claude.md |
| yt:xTaDx3tbYMs | 2025-09-23 (published) / 2026-10-10 (read) | Cosine Similarity vs. Euclidean Distance vs. Dot Product (SH AI Academy) | docs/outhtm/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html | docs/aimd/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product_claude.md |

## §5c CLOSED WORK (current version 002 + previous 001; full reasons in `archive/ARCHIVE.202610.md`)

| WIP ID | verdict | version | reason (stub) | evidence |
|---|---|---|---|---|
| WIP202610001 | FINISH | 001 | Non-commercial study LICENSE, Thai + English | file:LICENSE · ckp:001#1 |
| WIP202610002 | FINISH | 001 | zvect lib in JS/Python/C++ with one API and identical rules | test:tests/zvect.test.js · file:tests/parity/js/edge_cases.js |
| WIP202610003 | FINISH | 001 | 8 lesson examples × 3 languages, identical output | file:tools/check-examples.js · ckp:001#1 |
| WIP202610004 | FINISH | 001 | Web lessons: 3D canvas, MathML, code tabs, dark only, grouped nav | file:web/index.html · file:web/js/scene3d.js |
| WIP202610005 | FINISH | 001 | Distribution: MANIFEST.json, llms.txt, lib/README.md, npm exports | file:llms.txt · file:lib/MANIFEST.json |
| WIP202610006 | FINISH | 001 | Independent review: 20 findings, fixes applied, 3 left open as rows | ckp:001#1 |
| WIP202610017 | FINISH | 001 | iw report yt:lPTcTh5sRug (embeddings), Web View only, HTML + MD | file:docs/outhtm/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings.html · ckp:001#4 |
| WIP202610015 | FINISH | 001 | iw report yt:xTaDx3tbYMs (cosine vs Euclidean vs dot), HTML + MD | file:docs/outhtm/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html · ckp:001#2 |
| WIP202610014 | FINISH | 001 | Metric-choice video brought into lessons 2, 6, 7, 8 + report links | file:docs/arch/WIP202610014_metric-choice/plan.md · ckp:001#5 |
| WIP202610014-M1 | FINISH | 001 | Lesson 6: dot as third metric, three-way table, presets | file:web/lessons/06_similarity.js · ckp:001#5 |
| WIP202610014-M2 | FINISH | 001 | Lesson 07 choose-metric (A/B/C, normalize, 2 − 2cos θ) | file:web/lessons/07_choose_metric.js · ckp:001#5 |
| WIP202610014-M3 | FINISH | 001 | Lesson 2: attention query·key 0.70 / 0.23 side note | file:web/lessons/02_dot_product.js · ckp:001#5 |
| WIP202610014-M4 | FINISH | 001 | Lesson 08 high-dimensions (minstd, histograms) | file:web/lessons/08_high_dimensions.js · ckp:001#5 |
| WIP202610014-M5 | FINISH | 001 | `/docs/outhtm/` served; "อ่านเพิ่ม" links | file:server.js · ckp:001#5 |
| WIP202610014-M6 | FINISH | 001 | Parity probes: near-zero, unit dot == cosine | file:tests/parity/js/edge_cases.js · ckp:001#5 |
| WIP202610016 | FINISH | 001 | iw v4 card saved by the owner (owner's word; cache lag noted) | file:.dropzone/skills/intelligence-writer_v4.skill · ckp:001#5 |
| WIP202610019 | FINISH | 001 | 9 iw reports (interpretive full-detail; CC BY talk fully translated), registry + REFERENCE.md | file:REFERENCE.md · ckp:001#6 |
| WIP202610020 | FINISH | 001 | Regroup Phase 1: new order + 4 groups, slugs/files kept, docs + links updated (Phase 2 → WIP202610023) | file:web/js/app.js · ckp:001#7 |
| WIP202610009 | FINISH | 001 | Dot lesson gets a one-line note on θ before the cosine lesson | file:web/lessons/02_dot_product.js · ckp:001#7 |
| WIP202610010 | FINISH | 001 | Folded into WIP202610020 / WIP202610023 (next topics = Phase 2 list) | ckp:001#7 |
| WIP202610018 | FINISH | 001 | Lesson "Embedding matrix" (one-hot × E = row; one-hot pairs equidistant) | file:web/lessons/12_embedding_matrix.js · ckp:001#10 |
| WIP202610025 | FINISH | 001 | Owner: distances not in the sources are not added; the aimd re-check found XOR + popcount (added) | file:web/lessons/11_distance.js · ckp:001#14 |
| WIP202610027 | FINISH | 001 | Chapter 5 simple → complex (5.1 brute force, 5.4 tree, 5.5 graph walk, 5.6 HNSW, 5.7 beam, 5.8 build, 5.9 filter) + 4.5 keyword vs meaning | file:web/js/graph.js · ckp:001#19 |
| WIP202610026 | FINISH | 001 | 7 new topics from aimd (1.5, 3.1, 3.2, 3.3, 3.5, 7.1, 7.2), Embedding matrix trimmed to lookup, 7 chapters / 26 topics | file:web/js/app.js · ckp:001#17 |
| WIP202610029 | FINISH | 001 | 6.1 / 6.2 in EN / TH / 中文 / 日本語 (space vs dictionary split, per-language negation), explanation block on top, book-icon lib link | file:web/js/multilang.js · ckp:001#20 |
| WIP202610030 | FINISH | 001 | iw report yt:BcxJk4WQVIw (BPE), own-words rewrite, counts re-run in code | file:docs/outhtm/20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work.html · ckp:001#26 |
| WIP202610032 | FINISH | 001 | 3.1 Tokenization (4 languages) + 3.2 BPE lessons; chapter 3 renumbered to 3.8 | file:web/lessons/34_tokenize.js · ckp:001#26 |
| WIP202610033 | FINISH | 001 | iw report yt:xTzUn3G9YA0 (ColBERT), own-words rewrite, 7 fidelity fixes | file:docs/outhtm/20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions.html · ckp:001#31 |
| WIP202610034 | FINISH | 001 | 6.2 Late interaction (ColBERT) lesson + examples; chapter 6 renumbered to 6.4 | file:web/lessons/36_late_interaction.js · ckp:001#31 |
| WIP202610035 | FINISH | 001 | Dictionaries in web/data/*.json → localStorage; Dict page add / delete / export; colour by language | file:web/js/dict.js · ckp:001#32 |
| WIP202610024 | FINISH | 002 | Owner turned GitHub Pages on (16:53 "เปิด https://zardokar.github.io/ZVect เสร็จไปแล้ว") | file:llms.txt · ckp:002#34 |
| WIP202610038 | FINISH | 002 | iw yt:zduSFxRajkE (Karpathy GPT tokenizer) + lesson 3.3 Tokenizer ของ GPT (byte-level BPE playground); chapter 3 now 3.1–3.9 | file:web/lessons/37_gpt_tokenizer.js · ckp:002#35 |
| WIP202610037 | FINISH | 002 | 6 iw reports (RAG multivector, ColBERT precision, Qdrant Edge, Google word2vec, NitMonk Hindi, EmbeddingGemma 2 fine-tune) + tagged REFERENCE.md | file:REFERENCE.md · ckp:002#34 |

## §6 WIP (open items) — ALWAYS LAST, READ FIRST

| WIP ID | title | since | ref |
|---|---|---|---|
| WIP202610007 | [ckp] Port the checkpoint toolchain (wipchecker / lint / lang check) to ZVect, or decide the manual ledger is enough | 2026-10-10 | ckp:001#1 |
| WIP202610008 | [process] Skills "coder" and "reviewer" not found in this environment; owner to supply them or confirm the subagent substitute | 2026-10-10 | ckp:001#1 |
| WIP202610011 | [verify] Run `npm start`, `npm test`, `npm run check` on the owner's Windows machine (python/g++ discovery, `.\name.exe` run line) | 2026-10-10 | ckp:001#1 |
| WIP202610012 | [web] Arrows and points vanish when an endpoint is behind the camera at close zoom (lines are clipped, arrows are not; min zoom raised to 5 as mitigation) | 2026-10-10 | ckp:001#1 |
| WIP202610013 | [lib] Untested divergences: `angle` with NaN (Python 0.0 vs NaN), `fmt(NaN)` text ("NaN" vs "nan") | 2026-10-10 | ckp:001#1 |
| WIP202610021 | [repo] Owner deletes the 8 pre-rename files (copies kept in `.dropzone/_to_delete/`) | 2026-10-10 | ckp:001#5 |
| WIP202610022 | [skill] iw v5.1: meaning-fidelity rule, no lyrics, per-batch frame prefixes, C2PA-aware verify, crop presenter chrome, li/p wrap, own-words rule for standard licenses — card re-shown 23:4x (first one was not visible to the owner), owner to save | 2026-10-10 | ckp:001#7 |
| WIP202610028 | [lessons] Owner asked "ทำไมไม่มี K-mean" / "แยกกลุ่ม Classification ไหม": k-means / IVF (and maybe a "จัดกลุ่ม" chapter with 6.3) need a source first (none of the 12 aimd files covers it); owner to send a clip/article for iw | 2026-10-11 | ckp:001#19 |
| WIP202610031 | [web] Owner (14:58): simple explanatory pictures in the style of his "Character tokenization" screenshot (the BPE clip's slide ~1:55). First done in 3.1 / 3.2 (`web/js/tokdraw.js`: token box → arrow → number, canvas + a static SVG); owner to say which other lessons get one | 2026-10-11 | ckp:001#26 |
| WIP202610036 | [lessons] Owner (16:20) asked whether RAG needs its own topic; proposed one topic 7.3 "RAG: ค้นแล้วส่งให้ LLM" (no new chapter). Sources now: ColBERT (xTzUn3G9YA0), multivector RAG demo (6iCmnd0k3fs: per-token MaxSim table, 1-bit docs, Pleias-RAG-350M answer), Qdrant Edge (8LPgGU34RoE: retrieve-then-rerank). Owner's 16:53 "RAG : Multivector" read as "read these sources"; still waiting for a yes to build | 2026-10-11 | ckp:001#31 · ckp:002#34 |
| WIP202610023 | [lessons] Remaining lesson ideas (word counts, positional encoding, keyword vs vector and filtered-graph disconnection were built in #17 / #19): Matryoshka truncation, outliers; examples 09 / 14 could add 中文 / 日本語 and the after-word ない rule (#20 review); from #34: 5.3 asymmetric mode (float query × 1-bit docs, 2Σ−Σ), 3.4 animal property table vs IDs, 3.8 in-batch negatives + duplicate trap; from #35: vocab size / special tokens in 3.4 or 7.1, an "LLM quirks from tokenization" topic (spelling, digits, trailing space, SolidGoldMagikarp, JSON vs YAML), 7.x next token (softmax + temperature) | 2026-10-10 | ckp:001#10 · ckp:002#34 · ckp:002#35 |

### Narrative

- **Active thread (#38, 2026-10-11 22:4x):** dictionary code moved to `web/js/dict/` behind a facade; owner deletes `web/js/dict.js`.
  Before that #37 (22:xx): start view fits the canvas, 3.1 shows 4 languages, equation box class, Dict page grid + one-row add form.
  Before that #36: lone buttons removed (3.2, 4.4, 7.1). #35: Karpathy GPT-tokenizer iw + lesson 3.3
  (`WIP202610038`). Next: owner tries #/gpt-tokenizer and #/bpe, commits #34–#38, picks lesson work from `WIP202610036` / `WIP202610023`, deletes stale files (`WIP202610021`).
- Earlier (#34): 6 iw reports + tagged REFERENCE.md (`WIP202610037`); Pages on (`WIP202610024`).
- **Earlier thread (ver002 cut at #33):** handoff `.dropzone/hzup_claude/20261011_1642.md`; archive dual-write gap fixed.
  Before that #32: Dict page + JSON dictionaries in localStorage (`WIP202610035`, #32); before that #31: ColBERT iw
  (`WIP202610033`) + 6.2 Late interaction (`WIP202610034`), chapter 6 = 6.1 Bi-Encoder, 6.2 Late interaction, 6.3 Reranker, 6.4 Classification.
  Next: owner tries #/dict and 6.2, commits #26–#33 + ver002, answers the RAG 7.3 proposal (`WIP202610036`), says which other lessons get the token-style
  picture (`WIP202610031`), turns Pages on (`WIP202610024`), deletes stale files (`WIP202610021`).
- Earlier (#30): chapter 6 = "การผสานทฤษฎี" (owner 16:04). #29: first rename (15:55). #28: 3.1 shows typed text alone + full Thai alphabet (owner 15:49). #27: 3.1 / 3.2 text box on top + zoom instead of wrapping (owner 15:45). Before that, #26: iw of the BPE clip done (`WIP202610030`); new lessons 3.1 Tokenization + 3.2 BPE (`WIP202610032`), chapter 3
  renumbered. Next: owner looks at 3.1 / 3.2, commits #17–#26, says which other lessons get the simple token-style picture (`WIP202610031`), turns
  Pages on (`WIP202610024`), deletes stale files (`WIP202610021`).
- Earlier (#25): session close + handoff 14:58.
- Earlier (#24): sample buttons show the active sample.
- Earlier (#23): 6.2 renamed Reranker (Cross-Encoder). Next: owner looks and commits.
- Earlier (#22): 2.2 shadow on/off button. Next: owner looks and commits.
- Earlier (#21): formula steps renamed and explained (what / why per step on top). Next: owner looks and commits.
- Earlier (#20): `WIP202610029` done: 6.1 / 6.2 in four languages, explanation on top of every lesson, book-icon lib link, no tagline. Next: owner looks at 6.1 / 6.2 and commits; k-means / IVF waits for a source (`WIP202610028`).
- Earlier (#19): chapter 5 rebuilt simple → complex (7 chapters / 33 topics).
- Earlier (#18): layout pass after #17 (sidebar header, no scrollbars in boxes). Next unchanged: commit, Pages, stale files.
- Earlier (#17): `WIP202610026` done: 7 chapters / 26 topics (1.5 Matrix; chapter 3 = Token ID, One-hot, Bag of words, Embedding matrix, Learning the table, Latent space; chapter 7 = LLM input, attention query · key). Next: owner reviews and commits, turns Pages on (`WIP202610024`), deletes the stale files (`WIP202610021`).
- Earlier (#16): 6 chapters / 19 topics numbered 1.1 …; formulas line by line; three-box formula area.
- Earlier (#14): beginner pass — Vector space is one idea (room + points), add/subtract/scale is its own lesson, Distance has Euclidean + XOR + popcount; 15 lessons. Owner may ask for the same beginner pass on other lessons.
- Earlier (#13): Distance source shown under the formula; `WIP202610025` closed in #14.
- Earlier (#10): 14 lessons in 5 groups; owner reviews, commits, turns Pages on (`WIP202610024`).
- Earlier (#8): site is GitHub Pages-ready; owner turns Pages on and checks the URL (`WIP202610024`).
- Earlier (#7): regroup Phase 1 done (`WIP202610020` closed). Next: owner saves the re-shown iw v5.1 card
  (`WIP202610022`), deletes the 8 stale files (`WIP202610021`), commits, then picks the first Phase 2 lesson (`WIP202610023`).
- Earlier (#6): `WIP202610019` closed (9 iw reports).
- **Earlier thread:** none in progress at #1. The repo is at "first usable version"; the owner decides the next topic
  (`WIP202610010`) and verifies on Windows (`WIP202610011`).
- `WIP202610008`: the owner named four skills (checkpoint, hz, coder, reviewer). Only checkpoint-writer and handzup exist
  here. The checkpoint-writer skill is written for another repo (Zigma / LocalLLMAdvisor) and bundles Python tools tied
  to that repo's file names, so this repo uses its ledger rules by hand for now (`WIP202610007`).
