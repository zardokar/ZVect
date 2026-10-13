# ZVect — checkpoint ver002

- **Date:** 2026-10-11 (Asia/Bangkok). Re-counted against disk on 2026-10-11 (numbers in §3 were run at the cut, not carried from ver001).
- **Archive map:** `checkpoint.zvect.ver001.md` §5b holds upckp #1–#33 (2026-10-10 → 2026-10-11). Its §1–§6 are stale by design; read its
  §5b only for history. Closed rows in full: `checkpoints/archive/ARCHIVE.<mint month>.md` (now `ARCHIVE.202610.md`), addressed by WIP ID —
  not part of the start-up read.
- **Language rule:** checkpoints are ENGLISH. Thai only for a term with no English form (e.g. `เคาะ`), a literal UI string, or the owner's
  words quoted verbatim. There is no lang checker in this repo (owner 23:57, #43: manual ledger, no toolchain port).
- **§6 is physically last but is read FIRST**, then §5c, then §1–§5.
- **Edit flow:** the owner edits / commits on Windows in `D:\repository\ZVect`. Claude works in a cloud container and copies files back
  through the device bridge (new outputs dir, `expectedMtimeMs`, stage back, md5). No sync script. Claude never runs git write commands.
- **DO-FIRST for the next session:** read `README.md` → walk `checkpoints/checkpoint.zvect.ver*.md` numerically → read the latest in full
  (§6 first) and the previous one → read the newest `.dropzone/hzup_claude/*.md` (now `20261013_2230.md`: tviz S2 next (`WIP202610052`, all 23 questions answered, S1 delivered); then the iw v6.2 talk `WIP202610053`; LLM manual T1 `WIP202610050` after that) → look in `.dropzone/hzup_intercomm/` for `*_to_claude-zvect.md` from other projects → run `npm test` and `npm run check` → summarize the open
  WIP count before any work. Expected after upckp #58: 12 open rows in §6, 47 closed rows in §5c, 47 IDs in the archive (§5c IDs = archive IDs; #58 minted and closed nothing). `npm test` now 155 tests (66 before tviz S1), `npm run style` 64 files.

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
  mount(ui) → { draw, draw2d, live, zoom2d } }`. Chapters and order live ONLY in `web/data/chapters.json`; `web/js/chapters.js` loads it, imports the lessons and exports `GROUPS`,
  `NUM`, `CHAPTER`, `LESSONS` and `resolve()` (turns `{#slug}` into the current chapter.topic). `web/js/app.js` = hash router, lib page, Dict page.
- `tools/reindex.js` (`npm run reindex`, #40) rebuilds the README table, the llms.txt lesson line and the REFERENCE.md chapter list, remaps every
  chapter.topic number in REFERENCE.md old → new by slug through `web/data/chapters.lock.json`, then rewrites the lock. `--check` fails if stale (in `npm test`).
- Shared lesson modules: `multilang.js` (toy 4-language encoder, samples, negation), `dict/` (dictionary: `index.js` facade `dict` + `createDict`, `facade.js`, `adapters.js` source / store, `model.js` pure rules, `page.js` Dict page), `tokdraw.js`
  (token → number picture), `graph.js` / `anntree.js` / `search.js` (chapter 5), `sources.js` (source ids for Ref tabs).
- Data: `web/data/dict/{meanings,en,th,zh,jp,negation}.json` + `web/data/samples.json` + `web/data/samples_late.json`. `dict.js`
  inserts defaults + the learner's words into localStorage "zvect.dict" (version = djb2 hash of the files); Dict page `#/dict` adds,
  deletes, resets and exports.
- Distribution: `lib/MANIFEST.json` (version + sha256, `npm run manifest`, checked by `npm test`), `llms.txt`, `lib/README.md`,
  `package.json` `exports` (`npm install github:zardokar/ZVect`). GitHub Pages-ready (`WIP202610024`).

## §3 Stack / layout / env

- Node >= 18 (container v22.22.0), Python 3 (3.13.16), g++ C++17 (13.3.0). **Not yet run on the owner's Windows machine** (`WIP202610011`).
- Chapters and lessons (`web/data/chapters.json`, display number = chapter.position; file prefixes are creation order; split at #40):
  - 1 พื้นฐานเวกเตอร์: 01 vector, 16 length, 04 vector space, 15 vector ops, 20 matrix
  - 2 วัดว่าสองเวกเตอร์ใกล้กันแค่ไหน: 11 distance, 02 dot product, 03 cosine
  - 3 Token: ตัดข้อความเป็นเลข: 34 tokenize, 35 bpe, 37 gpt tokenizer, 21 token id
  - 4 Embedding: เลขกลายเป็นเวกเตอร์ที่มีความหมาย: 22 one-hot, 23 bag of words, 12 embedding matrix, 24 learn table, 05 latent space, 38 same model (#42)
  - 5 ค้นหาของที่ใกล้ที่สุด: 06 similarity, 18 search distance, 19 search dot, 07 choose metric, 33 keyword search
  - 6 ค้นให้เร็วเมื่อข้อมูลเยอะ: 27 brute force, 08 high dimensions, 17 binary xor, 28 ann tree, 29 nsw graph, 13 vector search, 30 hnsw beam, 31 hnsw build, 32 filter graph
  - 7 การผสานทฤษฎี: 09 bi-encoder, 36 late interaction, 14 reranker, 10 classification
  - 8 เวกเตอร์ใน LLM: 25 llm input, 26 attention
- Re-run at #44: `npm test` 45 / 0 (27 + 13 same-model + 5 style); `npm run style` PASS 10 files; `npm run check` PASS 41 suites; Playwright 38 lessons + Dict × 3 sizes 0 problems.
- Re-run at #42: `npm test` 27 pass / 0 fail; `npm run check` 41 suites OK (40 examples + edge_cases), PASS; Playwright 38 lessons + Dict × 3 sizes, 0 problems
  (sidebar nav scroll excluded), no unresolved `{#…}`. Re-run at #40: `npm test` 27 pass / 0 fail (15 lib + 5 dict + 7 chapters); `npm run check` 40 suites OK, PASS; Playwright 37 lessons + Dict × 3 sizes,
  0 problems, no unresolved `{#…}`.
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
| `web/data/chapters.json` | THE chapter list and lesson order (+ `short` / `readme` / `llms` texts); `chapters.lock.json` = numbering at the last reindex |
| `web/js/chapters.js` | loads chapters.json, imports lessons, `GROUPS` / `NUM` / `resolve({#slug})` |
| `tools/reindex.js` | `npm run reindex` (docs renumbering) · `--check` · `--dry` |
| `web/js/app.js` | router, formula steps, three boxes, code tabs, lib page, Dict page |
| `web/js/dict/` · `web/data/` | dictionary (facade `dict/index.js`; nothing outside the folder imports its other files) · default dictionary + samples (JSON) |
| `web/js/multilang.js` · `web/js/tokdraw.js` | 4-language toy encoder · token → number picture |
| `web/lessons/*.js` | 38 lessons (+ 2 stale files, `WIP202610021`) |
| `tools/check-examples.js` | 3-language parity gate |
| `tools/check-style.js` · `tools/style-mask.js` · `tools/style-scope.json` | coder-rule checker (`npm run style`, prints `file:line`) · its tokenizer · the files under the rules (#44) |
| `web/js/samemodel.js` · `web/data/same_model.json` | lesson 4.6 logic (pure) · its config + toy data (#44) |
| `tools/zv.js` | terminal calculator that prints every step (`npm run zv -- dot 1,2,3 4,5,6`) |
| `docs/APPROVALS.md` | dependency approval log (no approvals) |
| `REFERENCE.md` | every source read (iw) and what each lesson took from it, corrected, or added; topic groups + tag index on top, a `tags:` / `ใช้ในบท:` line under every source heading (#34) |
| `docs/outhtm/` · `docs/aimd/` | iw reports (Thai HTML) · English context files (the only lesson sources) |
| `docs/arch/WIP<id>_<topic>/` | plans and design sketches, WIP ID first |
| `checkpoints/archive/ARCHIVE.202610.md` | closed rows in full, filed by mint month |

Skills the owner asked for: **checkpoint** (this file; ledger rules of the checkpoint-writer skill applied by hand, toolchain not ported —
owner 23:57 #43: stays manual, `WIP202610007` closed), **hz** (handzup; handoffs in `.dropzone/hzup_claude/`, git-ignored), **iw** (intelligence-writer v5.1, `WIP202610022`),
**coder** and **review** — supplied by the owner 2026-10-12 00:07 (files `coder.skill`, `SKILL.md` = review, plus `app-maker.v01.skill`),
proposed for saving to the account (#44, `WIP202610008` closed). Both are written for Zigma; ZVect adaptations are in
`docs/arch/WIP202610042_coder-rules/plan.md`. Scope: new code + lesson 4.6 only (owner 00:13); older files are not refactored.

## §5 Workflow + §5a laws

- After editing `lib/`: `npm run manifest` → `npm test` → `npm run check`. All must pass.
- After editing a lesson: Playwright check of every lesson at 3 sizes (0 page errors, no overflow), look at screenshots, dark theme.
- **coder + review for NEW code (owner 2026-10-12, #44):** ≤200 lines, no one-line functions, one statement per line, comment block ≤3 lines,
  logical (`web/js/<name>.js`, pure, tested in `tests/`) apart from component (`web/lessons/NN_*.js`), text in `NN_*.text.js`, tunables in
  `web/data/*.json`; add every new code file to `tools/style-scope.json`; `npm run style` + `npm test` + red proof; then the review skill
  (fresh subagent, data-only brief, JSON fail-closed, ≤2 fix cycles; a 3rd only with the owner's yes). Plan: `docs/arch/WIP202610042_coder-rules/plan.md`.
- New lesson = `examples/{js,py,cpp}/NN_name.*` (identical output) + `web/lessons/NN_name.js` + an object in `web/data/chapters.json`
  (`file, slug, short, readme, llms`) + `npm run reindex` (README / llms.txt / REFERENCE.md lists) + REFERENCE.md source lines. A lesson carries `intro`, `try`, `lines` (+ `steps` [name, why] when ≥ 2 lines, optional `stepsWhy`), `formulaFrom`,
  `symbols`, `notes`, `refs` ([sourceId, what was used], ids in `web/js/sources.js`). Optional: `extra`, `symbolsNote`, `hint`,
  `canvasLabel`, `div.keep` tables. Explanation block full width on top; canvas + controls left; formula / values / list boxes; tabs
  อ่านสูตร / สรุปจากแหล่ง / โค้ด / Ref. No "อ่านเพิ่ม" detours; no scrollbar inside any box (`fitMath()` shrinks wide formulas).
- Chapter numbers (owner 22:56, #40): never hard-code "บท 3.7" in lesson or page text — write `{#slug}` (resolved at runtime). Move a lesson or
  add a chapter (category) only in `web/data/chapters.json`, then `npm run reindex`; `npm test` fails while the docs are stale. Old numbers in
  checkpoints, archive and iw reports are history and are NOT renumbered.
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

### #58 — 2026-10-13 20:26–22:3x — tviz: all 23 plan questions answered; S1 (core logic + ATDD) built by Opus and delivered (`WIP202610052` open)

- Owner (20:26) "23 ข้อ มีอะไรบ้าง มาทีละข้อสิ"; Q1–Q8 answered by voice (20:3x–20:5x), Q9–Q22 typed (21:27–22:02). Recorded in
  `docs/arch/WIP202610052_transformer-viz/plan.md` "Owner's answers" (owner's words per row). Highlights:
  - standing rule (Q5): "อะไรก็ตามที่ follow ตามโคเดอร์ให้วิ่งตามโคเดอร์เลย" — what the coder skill decides is not asked again (Q13, 16–19, 23).
  - Q4: tests in `lib/tviz/atdd/` = Acceptance Test Driven Development at the module root, organised by function, written first.
  - Q6: ES module on GitHub Pages; a generic single-file HTML packer in `tools/` is a separate later WIP.
  - Q9 language by channel: human-facing HTML (packed page, iw-style reports, ZVect demo) always `th`; API / AI sessions / default `en`.
  - Q21 b: tweened animation (+ `core/tween.js`), reduced motion → instant. Q22: the "เอา lib ไปใช้" page becomes a hub named "Lib & Demo"; `#/lib` keeps working.
  - Others = recommended (coder base, `lib/tviz/`, own tmath copy + drift test, JSON config/text, 7 views S1–S4, Transformer Explainer colors, ZVect license, top-p rule A, trace/weights/seed, seeded sample, toy data only, Canvas heat maps).
- S1 by an Opus agent in a container working copy (253 repo files staged): `lib/tviz/core/` 11 logic files (validate split into
  validate + guards to stay ≤ 200 lines), `config/defaults.json`, `text/en.json` + `th.json`, `atdd/` 11 test files + `fixtures.js`,
  `tests/tviz_zvect.test.js` (drift guard vs `attention.js` / `tblock.js`), `package.json` test script, `tools/style-scope.json` (+24).
  Gates (that run): baseline `npm test` 66/0, style 40 files → after: `npm test` 155/0, `npm run style` PASS 64 files, reindex up to date,
  `npm run check` PASS 46. Acceptance tests seen failing first (12 files); 13 red proofs, each restored md5-identical (table in the plan's Build log).
- Plan corrections noted for S4: `node --test` needs `atdd/*.test.js` (a directory argument fails on Node 22); §4.2 totals now 11 logic files.
- Delivered: 31 files (26 new under `lib/tviz/`, `tests/tviz_zvect.test.js`, `package.json`, `tools/style-scope.json`, plan.md, viz board),
  `deliver.py verify` PASS 31/31. Not reviewed yet (Q19: one independent Opus review before close). No WIP minted or closed.

### #57 — 2026-10-13 12:51–19:3x — iw batch: 34 sources (TabFM, LSA/LSI, TF-IDF, BM25, RRF, hybrid, rerank, sentiment, LLM, viz) + ChindaMT; iwd redo with displayed equations (`WIP202610051` closed; `WIP202610052`, `WIP202610053` minted, open)

- Owner (12:51) sent the coder + app-maker-v01 skills and ~32 YouTube links by topic + the ChindaMT paper [Opus] + a ChindaMT folder scan
  + a reusable Transformer visualizer [Opus]: "งานอื่นๆแตก Agent Sonnet 5.5 ตามหัวข้อ และ Opus เป็นคนตรวจ … จะทำ code จ้องแตก Opus ไปทำ".
  (12:52) "ให้ agent แต่ละตัวใส่ cache / noted ไว้ที .dropzone/noted/YYYYMMDD_หัวข้อ … เพื่อไว้คุย + communication"; (13:08) added
  iwd yt:RPMYV-eb6lI; (13:48) "เปิดแล้วปิดด้วยนะใช้เสร็จแล้วอะ" (browser tabs: close after use).
- Round 1: Sonnet workers built 33 reports + Opus ChindaMT paper; Opus fidelity reviews; TabFM ×6 delivered 14:1x. Findings: 5 of the 6
  "Sentiment" clips are Databricks "Introduction to LSA" parts 1–5 (kept as the LSA series); 2 "viz" clips are Graphite / VIGOR (Polo Club
  graph-query tools, built as interaction references); RPMYV-eb6lI = The Coding Train TF-IDF.
- Owner (15:02–15:33): "ทำไม iwd ดูไม่ละเอียดเลย" · "สมการก็หายไป" · "Opus ให้ผ่านได้ไหง" · "ปัญหามันไม่ใช่เรื่องภาพจาก clip นะ แต่บอกว่า
  สมการหายโวยยยยยยย" · "ทั้งที่สั่ง iwd ถ้าสั่ง iw จะไม่ว่าเลย". Cause: no report displayed any equation (formulas written as linear text
  inside Thai prose / table cells), Sonnet reports 15–23k chars / 6–10 sections vs earlier 32–44k / 13–17, frames picked from the
  transcript, review brief = transcript + text only (fidelity, not completeness). Same skill confirmed: installed v6.1 = uploaded v6 +
  diagram rules, scripts byte-identical. Owner decisions: Opus does everything; redo only clips with equations/code (18) + ChindaMT
  equation check; v6.2 "มาคุยกันก่อนอย่าเพิ่งทำ".
- Redo (Opus): equations displayed as MathML through the renderer's raw-HTML line passthrough (no skill change):
  `<div class="eq-wrap" style="overflow-x:auto;…"><math display="block">…</math></div>`, numbered, symbol table, reading, worked
  substitution; `slides.md` (equation / code / table inventory) + `coverage.md` per job; ChindaMT 44 equations. Review v2 (Opus, frames +
  inventory + recompute + render): 432 equations checked, 1 wrong (fixed), 10 FAIL → fixed → cycle 2 → 2 small musts → fixed. Final: all
  19 PASS; 14–131 MathML per report; text 31–61k chars; no equation clipped at 1400 px (6 wide matrix tables scroll in their box).
- Delivered (md5 PASS): 28 reports (56 files) 19:0x + TabFM 12 files 14:1x = 34 sources + ChindaMT; boards `.dropzone/noted/20261013_*`
  (13), `.dropzone/ChindaMT/INDEX.md`; REFERENCE.md +34 sections / 9 groups (reindex --check exit 0 on a staged tree); READING REGISTRY +34.
- TabFM (6, Sonnet, delivered before the redo) and the Sonnet reports outside the redo scope (rerank, IBM sentiment, Thai LLM talk,
  LLM crash course, viz ×5) have no or few displayed equations; LLM crash course and viz-a got displayed equations in their fix round.
- `WIP202610052` Transformer visualizer: plan only, `docs/arch/WIP202610052_transformer-viz/plan.md` (lib/tviz/, 7 views, 23 questions
  with recommended answers); no code until the owner answers (coder §0). `WIP202610053` iw v6.2: talk first (owner 15:2x).

### #56 — 2026-10-13 11:43–11:5x — start-up shortcuts: entry README, T1 brief, part packs, cross-project pointer, handoff

- Owner (11:43) "แล้วถ้าให้ session อื่นมาอ่านหละ มันก็ไม่ต้องวุ่นวายไหม หรือมีทาง shotcut ให้พร้อมเอาไปประกอบไหม"; (11:44) "ok แยกเรื่องก่อน
  session ใหม่ของ Project นี้เอง ก็หาวิธีเลย แต่มันมีเคส Session อื่นจาก Project อื่นให้ทำยังไงชี้ไปไหน".
- Same project: `docs/arch/WIP202610050_llm-manual/README.md` (entry point, read-by-task table) · `T1_brief.md` (77 lines: files to create,
  smallest edits to `index.html` / `app.js` / `style.css`, section text format with ref comments, `details.deep` box and `{widget:x}`,
  done-when gates, md5 of the 10 files it was written from) · `.dropzone/Create_LLM/tools/make_packs.py` (stdlib Python) → 14 packs
  `.dropzone/Create_LLM/packs/part_*.md` + `INDEX.md` (outline + cited aimd lines + N / C / G rows + lesson numbers, md5 header; 0 range
  problems; spot-checked A05 L10–L15 and A06 L6, L12 against the plan's claims). Handoff `20261013_1150.md` supersedes `20261013_0327.md`.
- Other projects: `llms.txt` gains a section pointing to that README (public on GitHub once pushed). README rules: read-only, cite aimd lines,
  messages to `.dropzone/hzup_intercomm/YYYYMMDD_HHMM_<sender>_to_claude-zvect.md`. A "zvect-pointer" skill card was proposed so any
  project's session can find ZVect; owner saves it or not. `reindex` rewrites only the "- Lessons (" line of `llms.txt`, so the new section survives.
- `plan.md` not changed (packs stay valid). No site, lesson or aimd change. No WIP minted or closed. Gates not run (no code changed).

### #55 — 2026-10-13 11:27–11:4x — LLM manual decisions answered; plan moved into `docs/arch` (`WIP202610050` open)

- Owner (11:27) pointed at handoff `20261013_0327.md`. Asked D1–D7, T0b and the plan's location through two multiple-choice rounds.
- Answers (11:3x): D1 (a) "คู่มือ" section of the site · D2 "1+2" (both levels: beginner–intermediate main text, advanced layer in
  "เจาะลึก" boxes) · D3 strict + iw for gaps · D4 not asked, recommended value used (Thai + English terms) · D5 "1+2" (links **and**
  mini-widgets in chapters, each widget its own WIP + review) · D6 front to back 0 → XII (owner overrode "core first") · D7 (c) own Node
  encoder over a cl100k_base ranks file · T0b G1 + G2, G3, G7 picked, with "G7 เปลี่ยนเป็น 6 และ G6 เป็น G7": read as an id swap, so hybrid
  search is now G6 (first iw batch G1, G2, G3, G6) and agents / MCP is G7 (later). Move plan into git: yes.
- Plan moved to `docs/arch/WIP202610050_llm-manual/plan.md` (old `.dropzone/Create_LLM/plan.md` is now a pointer with the old md5; `index/`
  stays in `.dropzone`). Edited: header status, Thai summary, §1 Reader, §2 answers table, §9 G6 ↔ G7 (every ref swapped, rows reordered),
  §10 widget mount point + "เจาะลึก" box + R6 / R8, §11 (T0, T0b ticked; T4 front-to-back with iw before each gap part; T5 widgets; T6 needs
  the APPROVALS row), §12 note. No review run on these edits (T0c not requested).
- `docs/APPROVALS.md` row #1 (first row): the cl100k_base ranks data file, dev-only, owner 11:3x via D7 = (c); sha256 to be filled at T6.
- No site, lesson or aimd change. No WIP minted or closed. Next: T1 (route, renderer, "เจาะลึก" box, widget mount) and the iw source picks for G1–G3, G6.

### #54 — 2026-10-13 03:27 — handoff (hz)

- Owner (03:27) "hz". Handoff `.dropzone/hzup_claude/20261013_0327.md` (supersedes `20261012_2243.md`): no purpose given, so the next session
  asks D1–D7 + gap sources for the LLM manual (`WIP202610050`); older proposals still open. No WIP minted or closed.

### #53 — 2026-10-13 02:01–03:xx — plan for an LLM manual (`WIP202610050` minted, open)

- Owner (02:01) "ร่างแผนทำ LLM manual จากความรู้ทั้งหมดที่ได้มาที ขอให้คิดให้ดีๆ และ ref เชิงลึก ใน aimd ทุก file ที่ทำ LLM
  .dropzone/Create_LLM/plan.md เรียก ตัวเอง Review แล้วถ้าผ่านให้ เรียก Fable Review ด้วย อีก 1 ครั้ง แล้วบอกทีว่าต้องทำอะไรบ้างใส่ไว้".
- Four indexing subagents built a line-level index of all 27 aimd files (A01–A27, topic codes T01–T25). The plan has 12 parts + appendices,
  section-by-section aimd line refs (every file cited; bounds checked by script), a numbers table N, a contradiction register C, gaps G1–G12,
  decisions D1–D7, process/tooling/risks and a to-do list T0–T8. Plan only: nothing in the site, lessons or docs changed.
- Location `.dropzone/Create_LLM/plan.md` is git-ignored (owner's choice of path); T0 offers a copy to `docs/arch/WIP202610050_llm-manual/plan.md`.
- Reviews (plan §12): self-review cycle 1 FAIL (11 must: wrong refs/labels, tier count, WIP claim, tiktoken vs law 2, 200-line rule) → fixed;
  cycle 2 FAIL (1 ref) → fixed; Fable review FAIL (1 must: no section on the training loop → new IV.7; 10 should) → all applied. No re-review
  after the last fixes (cycle 3 needs the owner's yes; owner asked for one Fable pass). Index files kept in `.dropzone/Create_LLM/index/`.

### #52 — 2026-10-13 01:07–02:xx — iwd yt:4JofSJIrjwU (Tech With Tim, fine-tune locally with Unsloth Studio) (`WIP202610049` closed)

- Owner (01:07) "iwd https://www.youtube.com/watch?v=4JofSJIrjwU". intelligence-writer v6.1, mode iwd, standard license → own-words rewrite; captions:
  en-CA manual track (905 lines, SHA matched) chosen over en ASR. Temp `.dropzone/iw_temp/20261013_0107/`. Report
  `20260727_How-To-Fine-Tune-Any-AI-Model-Locally` (41:06, published 2026-07-27): 15 sections, 9 frames, 2 own SVGs (flow, VRAM bars + table);
  HeyGen sponsor read (~5:40–7:03) and description CTAs removed.
- Fact-check 15 (subagent): 4 confirmed, 9 partly, 2 contradicted (Unsloth is not built by NVIDIA engineers — founders Daniel & Michael Han, Data
  Recipes on NVIDIA NeMo Data Designer; the fine-tuned model's "alone = sama" is wrong, alone = sendiri / sendirian). Also: Unsloth's QLoRA VRAM
  table is 1.7–2.4× below the clip's; Unsloth calls loss < 0.2 likely overfitting (Export-page checkpoint 0.0582); research (Ovadia 2023, Gekhman
  2024) is less optimistic than "fine-tuning can replicate all of RAG". Own arithmetic: LoRA r16 on Llama-3.1-8B = 41.9M params ≈ 0.52% ≈ 84 MB.
- Two independent fidelity reviewers (halves): 5 must (broken table row from `\|` in a cell; LoRA 22 GB is above, not below, the slide; base model's
  answer misread — it lists sendiriri / tersendiri / sendirian; unlabelled author takeaway), 20 should, 16 nits — all applied. iw_check --render PASS.
- Gotchas: Web View console messages are cut at ~8,000 characters — grab with chunk ≤ 7,000 (then ~10 full frames fit in one read); a grab call
  with the pane hidden can stall on a seek (readyState 1) → navigate with `&t=` and grab again. A manual caption track for another locale (en-CA)
  needs the player switched to it first (`setOption('captions','track',{languageCode:'en-CA'})`), then refetch that request as json3.
- REFERENCE.md: row, section, new group "Fine-tuning / LoRA", tags; fixed the malformed "ภายใน LLM" group row. Lessons unchanged; proposals only.

### #51 — 2026-10-13 00:xx–01:xx — new chapter 10 "LLM - Stanford: Transformer" (4 topics) (`WIP202610048` closed)

- Owner (22:56) "เปิดหัวข้อ LLM - Stanford ต่อจาก LLM เลย" → asked: REFERENCE group or a lesson chapter → owner "ทั้งสองอย่าง". Owner (23:25)
  "ควรจะอธิบายเรื่อง Transformers ด้วยนะ คืออะไรมายังไงเห็นหลาย clip แต่ไม่มีบท Theory อธิบายเลย" → the chapter is Transformer theory.
- Chapter 10 `stanford` after chapter 9 LLM: 10.1 transformer-why (RNN hidden state hops vs direct attention; toy keep 0.6 → near 5 steps 0.078, far
  15 steps; sequential steps n vs 1), 10.2 self-attention (softmax(QKᵀ/√d)V on 5 tokens of the lecture's sentence, d = 3; teddy bear → cute 0.538,
  unscaled 0.759, causal mask), 10.3 position-encoding (sin / cos clock hands, d = 8; cos(10, 11 / 15 / 30) = 0.884 / 0.790 / 0.493), 10.4
  transformer-block (d_model 4, 2 heads, d_ff 8, seeded weights; every stage n × d_model except FFN hidden; decoder view with mask + cross-attention
  in the picture). Logic `web/js/attention.js`, `web/js/tblock.js`; data `web/data/transformer.json`; text files; examples js/py/cpp ×4 identical;
  `tests/transformer.test.js` (11 incl. steps = lines per lesson, try-text numbers, example drift). Sources stanford + syntaxllm added to sources.js.
- Review: cycle 1 FAIL (3 must: unsourced "all LLMs" claim, hard-coded focus token, FFN bias unlabelled; 14 should) → all applied; cycle 2 PASS (2 nits
  applied). Red proofs: sin/cos swap and missing residual each fail tests. Fixed during build: steps vs formula lines mismatch (10.1, 10.4), 10.2 matrix
  table overflow (numbered headers). Python treats "# … encoding: …" on line 1 as a source-encoding declaration — avoid "coding:" in first lines.
- Gates: `npm test` 66 / 0, `npm run style` PASS 40 files, `npm run check` PASS, Playwright 43 lessons + Dict × 3 sizes 0 problems; 10 chapters / 43 topics.
  REFERENCE usage lines for stanford, syntaxllm, wordemb, thuvu, nitmonk, metrics, sofar list 10.x.

### #50 — 2026-10-12 23:2x–00:xx — iwd yt:114i2Kz-LZA (Stanford CME295 Lecture 1 - Transformers) (`WIP202610047` closed)

- Owner (22:56) "iwd https://www.youtube.com/watch?v=114i2Kz-LZA". intelligence-writer v6.1, mode iwd, standard license → own-words rewrite; manual English
  captions (1,768 lines, SHA matched; `iw_tx min` stops at 1:00:00 for hour timestamps — the rest condensed by hand). Temp `.dropzone/iw_temp/20261012_2256/`.
  Report `20260928_Stanford-CME295-Lecture-1-Transformers` (1:44:28, published 2026-09-28): 13 sections, 9 slide frames, 2 own SVGs.
- Fact-check 16 (subagent): 12 confirmed, 4 partly, 0 contradicted (FFN-holds-most-parameters true per encoder layer, ~39% of the base model; ChatGPT
  tweet typo not found). Two independent fidelity reviewers (halves): 2 must (deep summary implied unspoken paper values; 8-author row not in the clip),
  18 should, 15 nits — all applied. iw_check --render PASS.
- REFERENCE.md: row, section, new group "LLM - Stanford (CME295: Transformer เต็มสูตร)" right after "ภายใน LLM", 13 new tags.

### #49 — 2026-10-12 22:46–23:2x — iwd yt:YmLp8qe87A0 (Syntax / CJ, LLMs Explained) (`WIP202610046` closed)

- Owner (22:46) "iwd https://www.youtube.com/watch?v=YmLp8qe87A0". intelligence-writer v6.1, mode iwd, standard license → own-words rewrite
  (en:asr 1,577 lines, SHA matched; transcript stays in the scratchpad). Temp `.dropzone/iw_temp/20261012_2246/`. Report `20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More` (51:48,
  published 2026-07-10): 17 sections (chatbot history + if-bot, XOR net = weights file 3 / 17 numbers, BPE + tokenizer demo, word2vec skip-gram demo,
  transformer history + block, own 6-layer story transformer, softmax / temperature / top-p, autoregressive + context window, pre-training / fine-tuning /
  RLHF, tool calling, Dartmouth + speaker's view), 9 frames, 2 own SVGs (cycle, timeline).
- Fact-check 33 rows incl. the speaker's repo (read via raw.githubusercontent.com; github.com tree pages refused; WebFetch of github.com timed out on
  approval): 17 confirmed, 10 partly, 2 not found, 4 contradicted — top-p "top 20% of tokens" wrong; 6-layer config = 102,792 params (52,000 = 2-layer
  default 51,976); repo MAX_MERGES 1000 (said 10,000); word2vec window default 2 max 5 (said "five or six").
- Independent fidelity review: 1 must (dropped "not necessarily" hedge in the speaker's closing view), 8 should, 7 nits — all applied. iw_check --render PASS.
- REFERENCE.md: row, section, group "ภายใน LLM", 14 new tags. Lessons unchanged; proposals 3.2, 4.4, 4.5, 4.7, 9.1, 9.2 + new-topic ideas (model = weights
  file, softmax / temperature / top-p, autoregressive loop) for `WIP202610023`.
- Owner (22:56, mid-job) queued: "iwd https://www.youtube.com/watch?v=114i2Kz-LZA" + "เปิดหัวข้อ LLM - Stanford ต่อจาก LLM เลย" (next).

### #48 — 2026-10-12 22:43 — handoff (hz)

- Owner (22:43) "hz". Handoff `.dropzone/hzup_claude/20261012_2243.md` (supersedes `20261011_2317.md`): no purpose given, so the next session
  asks which waiting proposal to do (chapter 7 HNSW additions, chapter 4 additions, 5.4 / 6.1 notes, RAG `WIP202610036`, close `WIP202610022`?).
  No WIP minted or closed.

### #47 — 2026-10-12 22:06–22:4x — new topic 4.7 static vs contextual embedding (`WIP202610045` closed)

- Owner (22:06) "เดี๋ยวนะ แล้วไม่ปรับปรุงเนื้อหาหรือ เพิ่มเติมอะไรเหรอ"; Claude offered 4 options (chapter 7 HNSW additions, chapter 4 additions,
  new topic static vs contextual, short notes 5.4 + 6.1); owner picked only "หัวข้อใหม่ static vs contextual". The other three stay proposals.
- Built 4.7 `contextual` (`39_contextual`, coder rules): `web/js/contextual.js` (logical), `web/lessons/39_contextual.js` (component),
  `39_contextual.text.js` (text), `web/data/contextual.json` (11-word 3-D table made up by the author, 2 cases: bank in NitMonk's money / Yamuna river
  sentences, apple in "I ate an apple" / "Apple released a phone"; scoreDivisor sqrtDim, tieEps). Toy rule (author, simplified attention, no W):
  score = e·E[x]/√d, softmax, c = Σ a E[x]. Numbers: static bank cos 0.777 / 0.777 (tie), contextual 0.987 money / 0.977 river, cos between the two
  sentences 0.563 (static 1.000); apple 0.946 fruit / 0.983 company, 0.670. Refs thuvu, choose, nitmonk, annie, sofar (3 new in `web/js/sources.js`).
- Examples js/py/cpp identical; `tests/contextual.test.js` 10 tests (incl. the try-list numbers read from the text file = code numbers; red proofs for the
  text test and the 2-sentence guard). chapters.json + reindex: 9 chapters / 39 topics. REFERENCE.md "ใช้ในบท" for the 5 sources now include 4.7.
  `docs/aimd/` work copy gained the two #45 aimd files (already on the device).
- Independent review (data-only brief, JSON): PASS, 6 should + 6 nits — all applied (legend matched to the canvas, thuvu ref no longer ties ELMo to
  self-attention, NitMonk attention caveat, 2-sentence guard, hasOwn, SOFAR ~7:56). Not re-reviewed after the fixes.
- Gates: `npm test` 55 / 0, `npm run style` PASS 17 files, `npm run check` PASS, Playwright 39 lessons + Dict × 3 sizes 0 problems; canvas labels checked by screenshot.

### #46 — 2026-10-12 20:04–20:2x — chapter 6 split, chapter 4 renamed "Text Embeddings" (`WIP202610044` closed)

- Owner (20:04) "จัดหมวดหมู่ใหม่ไหม ?" → Claude: the two new clips fit existing topics; only chapter 6 (9 topics) is crowded; owner picked
  "แยกบท 6 เป็นสองบท". Owner (20:06) "Text Embeddings เรามีหัวข้อนี้ยัง ถ้ามันเป็นภาษาไทย ขอให้ใช้ตัวนี้เหอะ" → chapter 4 title
  "Text Embeddings: เลขกลายเป็นเวกเตอร์ที่มีความหมาย" (was "Embedding: …"; Thai subtitle kept).
- `web/data/chapters.json`: 6 `fast-search` keeps 6.1–6.4 (brute force, high dimensions, 1-bit XOR, ANN tree); new 7 `graph-search`
  "ค้นเร็วด้วยกราฟ (NSW → HNSW)" = 7.1 graph-walk, 7.2 vector-search, 7.3 hnsw-beam, 7.4 hnsw-build, 7.5 filter-graph; combine → 8, llm → 9.
  readme_intro names both chapters. `npm run reindex`: 9 chapters / 38 topics, 119 REFERENCE numbers remapped (RAG proposal "8.3" → "9.3").
- `tools/reindex.js` NUM_RE skips comma-joined pairs: the dry run would have turned the HNSW point Q(8.5,1.2) into Q(9.5,1.2). New assert in
  `tests/chapters.test.js`; red proof: old regex fails it.
- Gates: `npm test` 45 / 0, `npm run style` PASS, `npm run check` PASS, Playwright 38 lessons + Dict × 3 sizes 0 problems, sidebar shows 9 chapters.

### #45 — 2026-10-12 19:20–2x:xx — iwd of two clips: text embeddings (Thu Vu) + HNSW from scratch (`WIP202610043` closed)

- Owner (19:20): "iwd https://www.youtube.com/watch?v=Q6TBHDgWCDQ" + "iwd https://www.youtube.com/watch?v=wyWFLIlgmAw". Skill intelligence-writer
  v6.1, mode iwd (routing rule 2), standard YouTube license → own-words rewrite; transcripts (en:asr, 483 / 1,193 lines, SHA matched) stay in the
  session scratchpad. Temp `.dropzone/iw_temp/20261012_1920/` (preflight, factcheck, job.md + aimd_body.md + 7 frames each).
- yt:Q6TBHDgWCDQ → `20260523_Learn-Text-Embeddings-In-20-Minutes` (19:56; one-hot / BoW / n-gram / TF-IDF, 4 shortcomings, distributional idea,
  dense space, word2vec CBOW / skip-gram, static vs contextual, MTEB, ada-002 cosine demo). Fact-check 10: 7 confirmed, 3 partly. Review: 4 must
  (count 6/4 → 7/3, unlabelled author content, false "คลิปแนะนำ", ELMo tied to self-attention), hedges restored, nits — all applied.
- yt:wyWFLIlgmAw → `20260628_HNSW-Explained-From-Scratch` (61:04; RAG → ANN, NSW insert / greedy search, min/max heaps + ef, skip list, HNSW
  layers, Mmax / Mmax0, p = 1/M). Fact-check 9: 2 confirmed, 6 partly, 1 contradicted (six degrees is not from game theory: Karinthy 1929,
  Milgram 1967). Running the ef example in code: ef = 1 and ef = 2 stop at B(6), not D(7) as said (the slide agrees with B) → fix boxes.
  Review: 1 must, 6 should, 5 nits — all applied.
- Both HTML `iw_check --render` PASS (0 warns), per-figure shots checked. REFERENCE.md: 2 rows, 2 sections, groups (Embeddings; ANN / vector DB;
  RAG / Multivector), 10 new tags; `npm run reindex -- --check` up to date. Lessons unchanged; proposals: Q6 → 4.1, 4.2, 4.4, 4.5, 4.6, 5.4;
  wy → 6.1, 6.5–6.8 (HNSW topics). Delivered via bridge (new outputs dir, expectedMtimeMs, stage back, md5).

### #44 — 2026-10-12 00:07–00:4x — coder + review skills; lesson 4.6 under the coder rules (`WIP202610008`, `WIP202610042` closed)

- Owner (00:07) uploaded `review` SKILL.md, `coder.skill`, `app-maker.v01.skill`; (00:13) "ใช้กับงานใหม่ + แก้บท 4.6 ทันที", "บันทึกทั้งสองตัว";
  (00:33) "แก้เลย รอไร" (= yes to a 3rd review cycle). coder + review proposed as account skills (review description shortened to fit 1,024
  characters; SKILL.md text unchanged). `WIP202610008` closed.
- `WIP202610042` minted + closed: 4.6 split into `web/js/samemodel.js` (logical, pure), `web/lessons/38_same_model.js` (component),
  `web/lessons/38_same_model.text.js` (text constants), `web/data/same_model.json` (config + toy data; `maxTries` added). Examples rewritten without
  one-line functions (output unchanged). New `tools/check-style.js` + `tools/style-mask.js` + `tools/style-scope.json` (`npm run style`),
  `tests/samemodel.test.js` (13) + `tests/style.test.js` (5) in `npm test`. Adaptations (LF, npm scripts, folder mapping) in
  `docs/arch/WIP202610042_coder-rules/plan.md`; written after the build because the owner declared it urgent.
- Red proofs: config passes 5→6 (2 tests fail), grouped() broken (1), planted one-line arrow (style FAIL), backslash-newline fix reverted (1),
  tie fix disabled (1); each restored byte-identical.
- Review (skill `review`): cycle 1 FAIL (3 checker defects + MAX_TRIES hard-coded), cycle 2 FAIL (cat/dog named in the live box), cycle 3 PASS
  with the owner's yes. Applied after PASS: `grouped()` rejects identical partner rows (seed 13893, ~0.03% of random-B draws), same-model verdict
  checks rank 1; gates re-run. reviewed: PASS (#44, cycle 3) · not re-reviewed after those two suggestions.
- Gates: `npm test` 45 / 0, `npm run style` PASS 10 files, `npm run check` PASS 41 suites, Playwright 38 lessons + Dict × 3 sizes 0 problems,
  random-B × 30 0 errors. Older files untouched (5 files > 200 lines and ~437 one-line arrows remain by the owner's choice).

### #43 — 2026-10-11 23:57 — `WIP202610007` closed: checkpoint stays manual

- Owner (23:57) asked what blocked `WIP202610007`; answer: nothing technical, it waited for a decision (the checkpoint-writer toolchain is tied to the
  Zigma / LocalLLMAdvisor file names and would need rewriting). Owner: "ไม่เอา เขียนด้วยมือพอ". Closed (archive dual-write); ledger rules stay manual
  (§5a law 6 check by hand at every upckp). No code changed.

### #42 — 2026-10-11 23:27–23:4x — topic 4.6 "ต้องใช้ model เดียวกันทั้งคำถามและเอกสาร" (`WIP202610041` closed)

- Owner (23:27): handoff path `.dropzone/hzup_claude/20261011_2317.md` → build `WIP202610041` as planned, no further questions.
- New: `web/lessons/38_same_model.js` (slug `same-model`, 4.6) + `examples/{js,py,cpp}/38_same_model.*` (identical output). Two toy 3-D tables trained with
  the 4.4 rule (context rows random then frozen, 5 passes, eta 0.3) from minstd seeds 16 / 18 (chosen so the mixed case is clearly wrong; stated in the
  lesson). Inside A cos(cat,dog) 0.995, inside B 0.998; cos(cat_A, cat_B) = −0.968; question B vs documents A → bus first. Canvas: both tables (pink A,
  yellow B), thick query arrow, purple ring on top-1; choices: word / question model / document model; "สุ่มจุดเริ่มของ B ใหม่" redraws until B groups its
  words (~49% of seeds pass; with 5 passes ~16% of seeds would break the "B still groups" claim).
- Refs: beginner, blackboard, sofar, choose (the handoff's four) + wordemb (dimension meaning depends on training data) + qdrant (re-embed on encoder change),
  both from aimd. The core "different axes" reason and pool/normalise are labelled ผู้จัดทำ / ความรู้ทั่วไป; nomic labelled ความรู้ทั่วไป.
- `web/data/chapters.json` + `npm run reindex` (README, llms.txt, REFERENCE list; 8 chapters / 38 topics; 0 numbers remapped). REFERENCE.md: 4.6 in the
  "ใช้ในบท" line and table cell of the 6 sources + a 4.6 bullet under Colin Talks Tech.
- Independent review (subagent, did not write the lesson): 2 must / 4 should / 3 nits — all applied.
- Tests: `npm test` 27/0, `npm run check` PASS (41 suites), Playwright 38 lessons + Dict × 1400×900 / 820×1000 / 390×844: 0 errors, 0 overflow, 0 inner
  scrollbars, 0 unresolved `{#…}`; random-B pressed 30 times: 0 errors.
- `WIP202610041` closed (archive dual-write). Not known to be committed: #34–#42. Owner still to `git rm web/js/dict.js` and delete stale files (`WIP202610021`).

### #41 — 2026-10-11 23:17 — session close: upckp + hz; next session builds `WIP202610041`

- Owner (23:17): "upckp + hz และ next session ทำ WIP202610041 ไปเลย" — yes to the proposed topic 4.6 (same embedding model for query and
  documents); build it in the next session without asking again.
- Handoff written: `.dropzone/hzup_claude/20261011_2317.md` (plan for 4.6, rules, delivery, test harness). No code changed in #41.
- Not known to be committed: #34–#40. Owner still to `git rm web/js/dict.js` and delete the stale files (`WIP202610021`).

### #40 — 2026-10-11 22:56–23:xx — chapter 3 split into Token / Embedding; chapters in JSON; `npm run reindex`

- Owner (22:56): "แยกบท เหอะ อย่าลืมทำ Indexing ใหม่ และทำ script + code และปรับเป็น json ให้ง่ายในการ Reindex และทำ Category ใหม่เสมอ".
- `web/data/chapters.json` (new): 8 chapters / 37 topics. 3 Token (3.1 tokenize, 3.2 bpe, 3.3 gpt-tokenizer, 3.4 token-id); 4 Embedding (4.1 one-hot,
  4.2 bag-of-words, 4.3 embedding-matrix, 4.4 learn-table, 4.5 latent-space); old 4–7 → 5–8. `web/js/chapters.js` (new) replaces the static
  imports + `GROUPS` in app.js. 107 hard-coded "บท N.N" in lessons + Dict page → `{#slug}` (mapped through the old numbering); lesson header
  comments lost their numbers; 4 code comments now name the lesson instead of a number.
- `tools/reindex.js` + `npm run reindex` (new): README table between `<!-- chapters:start/end -->` (+ `readme_intro` with `{#ch:<id>}`), llms.txt
  "- Lessons" line, REFERENCE.md chapter list (history sentence dropped; history is here), 265 REFERENCE numbers remapped (ranges split, e.g. old
  3.4–3.9 → 3.4, 4.1–4.5; source-table remap limited to the "ใช้ในบท" column so "Opus 5.5" stays; values like 0.95, 7.25, ~1.5 ms untouched), lock rewritten.
  Second run = no change. `tests/chapters.test.js` (7 tests) incl. `reindex --check`.
- Owner (22:59) asked, after this work: why a model is always needed to turn Q&A text into vectors (nomic / gemma embedding), its steps, and why
  another model cannot read those vectors. Answered in chat from aimd sources + labelled general knowledge; lesson idea filed as `WIP202610041`.
- `WIP202610040` closed.

### #39 — 2026-10-11 22:42–23:xx — iw "Tokens vs Embeddings"; proposal to split chapter 3

- Owner (22:42): iw yt:izbifbq3-eI, and "ทำไมไม่มีหัวข้อ Embedding มีแต่ Tokens". Answer (sent first): embedding is there (3.7 Embedding matrix,
  3.8 learning the table, 3.9 latent space) but chapter 3 is named "เปลี่ยนข้อความเป็นเวกเตอร์" and starts with 4 token topics. Proposal: split into
  "3 Token" (3.1–3.4) and "4 Embedding" (one-hot → bag of words → embedding matrix → learning the table → latent space); chapters 4–7 become 5–8.
  Waiting for the owner (`WIP202610040`); nothing renumbered yet.
- `WIP202610039` (minted + closed): iw v5.1, Annie Sexton "Tokens vs Embeddings – what are they + how are they different?" (6:52, 2025-05-29), standard
  license → own-words rewrite, 7 sections, 7 slide frames + 2 own SVGs, ASR 171 lines (sha256 prefix 0f38d979eae42dea, matched in-page), no web
  fact-check (2025, inside the author's knowledge). Independent fidelity review: 0 must / 5 should / nits, applied. The clip's second "train" example
  alludes to a song lyric — not quoted. Temp `.dropzone/iw_temp/20261011_2242/`.
- REFERENCE.md: row + section (proposed for 3.4, 3.7, 3.9, 7.1, 7.2 and the chapter split), Tokenization + Embeddings groups, 4 new tags (115 tag rows).
- Lessons were NOT changed.

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
| yt:-jeck0yrT_Q | 2017-08-09 (published) / 2026-10-13 (read) | VIGOR: Interactive Visual Exploration of Graph Query Results (Polo Club of Data Science @ Georgia Tech; VIGOR graph query results visual analytics, Georgia Tech 2017; linked Fusion Graph / Embedded Results; iw own-words rewrite, no web fact-check; Sonnet worker build; Opus review (first FAIL) PASS after fixes) | docs/outhtm/20170809_Vigor-Graph-Query-Results.html | docs/aimd/20170809_Vigor-Graph-Query-Results_claude.md |
| yt:nZYHazugVNA | 2009-03-22 (published) / 2026-10-13 (read) | GRAPHITE: A Visual Query System for Large Graphs (Duen Horng "Polo" Chau; Graphite visual graph query system, CMU/LLNL 2009; query pane vs match tabs; iw own-words rewrite, no web fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20090322_Graphite-Visual-Query-System.html | docs/aimd/20090322_Graphite-Visual-Query-System_claude.md |
| yt:uboTKqPNU5Y | 2022-11-05 (published) / 2026-10-13 (read) | Dodrio: Exploring Transformer Models with Interactive Visualization (Demo Video) (Polo Club of Data Science @ Georgia Tech; Dodrio BERT attention visual analytics demo, head grid, radial graph, arc diagrams; iw own-words rewrite, no web fact-check; Sonnet worker build, 1 MathML equation; Opus review PASS after fixes) | docs/outhtm/20221105_Dodrio-Demo.html | docs/aimd/20221105_Dodrio-Demo_claude.md |
| yt:ECR4oAwocjs | 2024-06-21 (published) / 2026-10-13 (read) | Transformers Explained Visually: Learn How LLM Transformer Models Work (Polo Club of Data Science @ Georgia Tech; Transformer Explainer 2024 demo, embedding strips, Q/K/V weight multiplication popover; iw own-words rewrite, no web fact-check; Sonnet worker build, 5 MathML equations; Opus review PASS after fixes) | docs/outhtm/20240621_Transformer-Explainer-Visual.html | docs/aimd/20240621_Transformer-Explainer-Visual_claude.md |
| yt:TFUc41G2ikY | 2025-04-07 (published) / 2026-10-13 (read) | [Demo Video] Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation (Polo Club of Data Science @ Georgia Tech; Transformer Explainer 2025 demo, Polo Club; no narration, built from on-screen captions; iw own-words rewrite, no web fact-check; Sonnet worker build, 10 MathML equations; Opus review PASS after fixes) | docs/outhtm/20250407_Transformer-Explainer-Demo.html | docs/aimd/20250407_Transformer-Explainer-Demo_claude.md |
| arxiv:2609.34770 | 2026-09-28 (published) / 2026-10-13 (read) | Reference-Grounded Data Curation for Instruction-Following Thai-English Machine Translation (Chay-intr et al., arXiv 2609.34770v2, AACL-IJCNLP 2026; ChindaMT / RGDC paper: Thai-English instruction-following MT data curation, IFD, regeneration, LC% judge; iwd own-words rewrite, 15-claim fact-check; Opus build with an Opus equation layer (44 MathML equations); Opus review PASS after fixes) | docs/outhtm/20260928_Reference-Grounded-Data-Curation-For-Instruction-Following-Thai-English-Machine-Translation.html | docs/aimd/20260928_Reference-Grounded-Data-Curation-For-Instruction-Following-Thai-English-Machine-Translation_claude.md |
| yt:YHNi88FaGug | 2026-08-13 (published) / 2026-10-13 (read) | LLM Fundamentals Crash Course For Beginners 2026 (Tokens, Prompting, APIs & Tool Calls) (Harish Neel AI; Harish Neel LLM fundamentals crash course, tokens, prompting, OpenAI Responses API, tool calls; iwd own-words rewrite, 17-claim fact-check; Sonnet worker build, 4 MathML equations; Opus review PASS after fixes) | docs/outhtm/20260813_LLM-Fundamentals-Crash-Course.html | docs/aimd/20260813_LLM-Fundamentals-Crash-Course_claude.md |
| yt:-f_i_a13IKc | 2024-03-28 (published) / 2026-10-13 (read) | LLM (Generative AI) คืออะไร ? (mikelopster; Thai LLM overview, Pretrained / Instruct / RLHF + 15-step explanation flow template; iwd own-words rewrite, 12-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20240328_LLM-Generative-AI-What-Is-It.html | docs/aimd/20240328_LLM-Generative-AI-What-Is-It_claude.md |
| yt:VWA15n6uiS4 | 2025-09-11 (published) / 2026-10-13 (read) | RAG Tutorial 2026 #17: RAG Reranking and Next Steps! (Harish Neel AI; Harish Neel RAG reranking, two-stage retrieval, Cohere; iwd own-words rewrite, 12-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20250911_RAG-Reranking.html | docs/aimd/20250911_RAG-Reranking_claude.md |
| yt:7WEtNxVh1vo | 2025-09-10 (published) / 2026-10-13 (read) | RAG Tutorial 2026 #16: Hybrid Search combining Vector and Keyword Search (Harish Neel AI; Harish Neel hybrid search, weighted RRF 0.7/0.3, LangChain EnsembleRetriever; iwd own-words rewrite, 13-claim fact-check; Opus rebuild (49 MathML equations); Opus review PASS after fixes) | docs/outhtm/20250910_Hybrid-Search-Vector-Keyword.html | docs/aimd/20250910_Hybrid-Search-Vector-Keyword_claude.md |
| yt:1qQCuWiRIfA | 2025-09-08 (published) / 2026-10-13 (read) | RAG Tutorial 2026 #15: Reciprocal Rank Fusion for Enhanced RAG Performance (Harish Neel AI; Harish Neel RRF worked example, k=0 vs k=60, ties; iwd own-words rewrite, 7-claim fact-check; Opus rebuild (40 MathML equations); Opus review PASS after fixes) | docs/outhtm/20250908_Reciprocal-Rank-Fusion-For-RAG-Worked-Example.html | docs/aimd/20250908_Reciprocal-Rank-Fusion-For-RAG-Worked-Example_claude.md |
| yt:BwgBU0CekFk | 2026-09-14 (published) / 2026-10-13 (read) | RAG Fusion Explained: Reciprocal Rank Fusion (RRF) With Real Code (IT AI Enthusiast (Mayank Chugh); RAG Fusion with RRF, LangChain, Chroma; paper claims checked; iwd own-words rewrite, 12-claim fact-check; Opus rebuild (19 MathML equations); Opus review PASS after fixes) | docs/outhtm/20260914_RAG-Fusion-Explained-RRF-With-Real-Code.html | docs/aimd/20260914_RAG-Fusion-Explained-RRF-With-Real-Code_claude.md |
| yt:XvKiTfd6Xvo | 2026-05-14 (published) / 2026-10-13 (read) | The Complete Guide to Hybrid Search in RAG (BM25 + Embeddings + Reranker) (Dave Ebbelaar; Dave Ebbelaar hybrid search code-along, bm25s, RRF, Cohere rerank, FiQA; iwd own-words rewrite, 15-claim fact-check; Opus rebuild (41 MathML equations); Opus review PASS after fixes) | docs/outhtm/20260514_Complete-Guide-To-Hybrid-Search-In-RAG.html | docs/aimd/20260514_Complete-Guide-To-Hybrid-Search-In-RAG_claude.md |
| yt:fZH97QHHYjY | 2026-09-16 (published) / 2026-10-13 (read) | The unreasonable effectiveness of BM25 for agentic search (AI Engineer (Jo Kristian Bergum, Hornet.dev); Bergum, Hornet BM25 for agentic search talk; iwd own-words rewrite, 16-claim fact-check; Opus rebuild (19 MathML equations); Opus review PASS after fixes) | docs/outhtm/20260916_Unreasonable-Effectiveness-Of-BM25-For-Agentic-Search.html | docs/aimd/20260916_Unreasonable-Effectiveness-Of-BM25-For-Agentic-Search_claude.md |
| yt:TW9vHU1GpU4 | 2025-11-19 (published) / 2026-10-13 (read) | A no nonsense intro to BM25 (Abhishek Thakur; Abhishek Thakur BM25 intro, Vespa rank profiles, Lucene IDF; iwd own-words rewrite, 11-claim fact-check; Opus rebuild (21 MathML equations); Opus review PASS after fixes) | docs/outhtm/20251119_A-No-Nonsense-Intro-To-BM25.html | docs/aimd/20251119_A-No-Nonsense-Intro-To-BM25_claude.md |
| yt:ruBm9WywevM | 2023-09-18 (published) / 2026-10-13 (read) | BM25 : The Most Important Text Metric in Data Science (ritvikmath; ritvikmath BM25 whiteboard maths, saturation, length, derivatives; iwd own-words rewrite, 10-claim fact-check; Opus rebuild (29 MathML equations); Opus review PASS after fixes) | docs/outhtm/20230918_BM25-The-Most-Important-Text-Metric-In-Data-Science.html | docs/aimd/20230918_BM25-The-Most-Important-Text-Metric-In-Data-Science_claude.md |
| yt:RPMYV-eb6lI | 2016-10-12 (published) / 2026-10-13 (read) | Coding Challenge #40.3: TF-IDF (The Coding Train; Coding Train TF-IDF live coding, p5.js, natural log; iwd own-words rewrite, 8-claim fact-check; Opus rebuild (28 MathML equations); Opus review PASS after fixes) | docs/outhtm/20161012_Coding-Challenge-40-3-TF-IDF.html | docs/aimd/20161012_Coding-Challenge-40-3-TF-IDF_claude.md |
| yt:TBUpxFw8oIA | 2021-07-19 (published) / 2026-10-13 (read) | Vector 5 TF IDF (From Languages to Information (Stanford slides); Stanford 'Vector 5' TF-IDF slides, SLP3; Shakespeare N=37; iwd own-words rewrite, 10-claim fact-check; Opus rebuild (44 MathML equations); Opus review PASS after fixes) | docs/outhtm/20210719_Vector-5-TF-IDF.html | docs/aimd/20210719_Vector-5-TF-IDF_claude.md |
| yt:OymqCnh-APA | 2020-11-11 (published) / 2026-10-13 (read) | TFIDF : Data Science Concepts (ritvikmath; ritvikmath TF-IDF intuition, inaugural speeches; iwd own-words rewrite, 8-claim fact-check; Opus rebuild (29 MathML equations); Opus review PASS after fixes) | docs/outhtm/20201111_TFIDF-Data-Science-Concepts.html | docs/aimd/20201111_TFIDF-Data-Science-Concepts_claude.md |
| yt:zLMEnNbdh4Q | 2022-09-06 (published) / 2026-10-13 (read) | Term Frequency Inverse Document Frequency (TF-IDF) Explained (DataMListic; TF-IDF explained, 3-sentence toy corpus; iwd own-words rewrite, 9-claim fact-check; Opus rebuild (35 MathML equations); Opus review PASS after fixes) | docs/outhtm/20220906_TF-IDF-Explained.html | docs/aimd/20220906_TF-IDF-Explained_claude.md |
| yt:bzNch-dBCN8 | 2019-11-17 (published) / 2026-10-13 (read) | LSA (Francisco Iacobelli; Francisco Iacobelli LSA, Deerwester 12x9, numpy SVD; iwd own-words rewrite, 13-claim fact-check; Opus rebuild (39 MathML equations); Opus review PASS after fixes) | docs/outhtm/20191117_Latent-Semantic-Analysis-Lsa.html | docs/aimd/20191117_Latent-Semantic-Analysis-Lsa_claude.md |
| yt:M1duqgg8-IM | 2020-03-31 (published) / 2026-10-13 (read) | Latent Semantic Indexing - Explained with Examples - Georgia Tech CSE6242 (Polo Club of Data Science @ Georgia Tech; Georgia Tech CSE6242 latent semantic indexing, SVD sizes, 7x5 example; iwd own-words rewrite, 12-claim fact-check; Opus rebuild (30 MathML equations); Opus review PASS after fixes) | docs/outhtm/20200331_Latent-Semantic-Indexing-Explained.html | docs/aimd/20200331_Latent-Semantic-Indexing-Explained_claude.md |
| yt:OXJdfpEFmF8 | 2019-05-16 (published) / 2026-10-13 (read) | Latent Semantic Analysis with Apache Spark (5/5) (Databricks Academy (Joshua Cook); Databricks LSA series part 5/5, Apache Spark, 20 newsgroups; iwd own-words rewrite, 14-claim fact-check; Opus rebuild (18 MathML equations); Opus review PASS after fixes) | docs/outhtm/20190516_LSA-With-Apache-Spark-Part-5.html | docs/aimd/20190516_LSA-With-Apache-Spark-Part-5_claude.md |
| yt:YX4xRIQ84Z0 | 2019-04-22 (published) / 2026-10-13 (read) | Improving the LSA with a TFIDF (4/5) (Databricks Academy (Joshua Cook); Databricks LSA series part 4/5, TF-IDF before SVD; iwd own-words rewrite, 12-claim fact-check; Opus rebuild (21 MathML equations); Opus review PASS after fixes) | docs/outhtm/20190422_Improving-LSA-With-TF-IDF-Part-4.html | docs/aimd/20190422_Improving-LSA-With-TF-IDF-Part-4_claude.md |
| yt:NWb_4O3ssbA | 2019-04-22 (published) / 2026-10-13 (read) | A Second LSA (3/5) (Databricks Academy (Joshua Cook); Databricks LSA series part 3/5, two children's books, loadings; iwd own-words rewrite, 10-claim fact-check; Opus rebuild (15 MathML equations); Opus review PASS after fixes) | docs/outhtm/20190422_LSA-Two-Childrens-Books-Part-3.html | docs/aimd/20190422_LSA-Two-Childrens-Books-Part-3_claude.md |
| yt:Fy0bF7u6W20 | 2019-05-16 (published) / 2026-10-13 (read) | A Trivial Implementation of LSA using Scikit Learn (2/5) (Databricks Academy (Joshua Cook); Databricks LSA series part 2/5, CountVectorizer + TruncatedSVD toy; iwd own-words rewrite, 10-claim fact-check; Opus rebuild (19 MathML equations); Opus review PASS after fixes) | docs/outhtm/20190516_Trivial-LSA-With-Scikit-Learn.html | docs/aimd/20190516_Trivial-LSA-With-Scikit-Learn_claude.md |
| yt:hB51kkus-Rc | 2019-04-22 (published) / 2026-10-13 (read) | Introduction to Latent Semantic Analysis (1/5) (Databricks Academy (Joshua Cook); Databricks LSA series part 1/5, vocabulary, two-step LSA; iwd own-words rewrite, 9-claim fact-check; Opus rebuild (16 MathML equations); Opus review PASS after fixes) | docs/outhtm/20190422_Introduction-To-Latent-Semantic-Analysis.html | docs/aimd/20190422_Introduction-To-Latent-Semantic-Analysis_claude.md |
| yt:5HQCNAsSO-s | 2024-06-19 (published) / 2026-10-13 (read) | What is Sentiment Analysis? (IBM Technology (Martin Keen); Sentiment analysis overview, rule-based, ML, hybrid, ABSA; iwd own-words rewrite, 9-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20240619_What-Is-Sentiment-Analysis.html | docs/aimd/20240619_What-Is-Sentiment-Analysis_claude.md |
| yt:Xym8FGDcl34 | 2026-06-19 (published) / 2026-10-13 (read) | Nicolas Makaroff - AI Scientist - Hands-On with Tabular Foundation Models - Pydata London 26 (PyData; Generic tabular foundation model workshop, TabPFN / TabICL / Seldon; not about TabFM; iwd own-words rewrite, 19-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20260619_Hands-On-Tabular-Foundation-Models-PyData-London.html | docs/aimd/20260619_Hands-On-Tabular-Foundation-Models-PyData-London_claude.md |
| yt:tYO_bgB4Ti0 | 2026-07-17 (published) / 2026-10-13 (read) | TabFM – Tabular Foundation Model pour le classement (tabfm[jax] / Python) (MASTER 2 SISE DATA SCIENCE; TabFM hands-on in French, JAX backend, spam, CPU timing; iwd own-words rewrite, 15-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20260717_TabFM-Hands-On-Spam-Jax.html | docs/aimd/20260717_TabFM-Hands-On-Spam-Jax_claude.md |
| yt:78_sbNNJe3Q | 2026-07-07 (published) / 2026-10-13 (read) | TabFM: Google's Zero-Shot Tabular AI (no training, no tuning!) (Omar Kamal; TabFM zero-shot tabular explainer, ensemble recipe, sklearn code; iwd own-words rewrite, 17-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20260707_TabFM-Zero-Shot-Tabular-Explainer.html | docs/aimd/20260707_TabFM-Zero-Shot-Tabular-Explainer_claude.md |
| yt:XwYPRLMLcNs | 2026-07-18 (published) / 2026-10-13 (read) | Google Just Released TabFM and It Breaks Everything We Know About ML (AI with Surya; TabFM UI walkthrough and claims check, simulated UI; iwd own-words rewrite, 11-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20260718_TabFM-Ui-Walkthrough-And-Claims.html | docs/aimd/20260718_TabFM-Ui-Walkthrough-And-Claims_claude.md |
| yt:8vW6gi5vRes | 2026-07-05 (published) / 2026-10-13 (read) | TabFM Explained: Google's New Foundation Model for Tabular Data (Dr. Data Science; TabFM architecture and in-context learning; Adult Income test; iwd own-words rewrite, 13-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20260705_TabFM-Explained-Architecture-And-ICL.html | docs/aimd/20260705_TabFM-Explained-Architecture-And-ICL_claude.md |
| yt:5YJGDElbCDY | 2026-10-11 (published) / 2026-10-13 (read) | Google's GPT-3 Moment for Databases & Spreadsheets (TabFM) (Prompt Engineering; Google TabFM zero-shot tabular model; Neon Postgres churn demo; iwd own-words rewrite, 13-claim fact-check; Sonnet worker build; Opus review PASS after fixes) | docs/outhtm/20261011_TabFM-Zero-Shot-Tabular-Model.html | docs/aimd/20261011_TabFM-Zero-Shot-Tabular-Model_claude.md |
| yt:4JofSJIrjwU | 2026-07-27 (published) / 2026-10-13 (read) | How to Fine-Tune any AI Model Locally (FULL Tutorial) (Tech With Tim; Unsloth Studio; iwd own-words rewrite, 15-claim fact-check) | docs/outhtm/20260727_How-To-Fine-Tune-Any-AI-Model-Locally.html | docs/aimd/20260727_How-To-Fine-Tune-Any-AI-Model-Locally_claude.md |
| yt:114i2Kz-LZA | 2026-09-28 (published) / 2026-10-12 (read) | Stanford CME295 Transformers & LLMs, Autumn 2026, Lecture 1 - Transformers (Stanford Online, Afshine & Shervine Amidi; iwd own-words rewrite, 16-claim fact-check) | docs/outhtm/20260928_Stanford-CME295-Lecture-1-Transformers.html | docs/aimd/20260928_Stanford-CME295-Lecture-1-Transformers_claude.md |
| yt:YmLp8qe87A0 | 2026-07-10 (published) / 2026-10-12 (read) | LLMs Explained: Tokens, Embeddings, Transformers and More (Syntax, CJ; iwd own-words rewrite, 33-row fact-check incl. the speaker's repo) | docs/outhtm/20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More.html | docs/aimd/20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More_claude.md |
| yt:wyWFLIlgmAw | 2026-06-28 (published) / 2026-10-12 (read) | HNSW Explained from Scratch, The Vector Search Algorithm Behind RAG (AI Is All You Need; iwd own-words rewrite, 9-claim fact-check, ef example re-run in code) | docs/outhtm/20260628_HNSW-Explained-From-Scratch.html | docs/aimd/20260628_HNSW-Explained-From-Scratch_claude.md |
| yt:Q6TBHDgWCDQ | 2026-05-23 (published) / 2026-10-12 (read) | Learn Text Embeddings in 20 Minutes (full guide for beginners) (Thu Vu; iwd own-words rewrite, 10-claim fact-check) | docs/outhtm/20260523_Learn-Text-Embeddings-In-20-Minutes.html | docs/aimd/20260523_Learn-Text-Embeddings-In-20-Minutes_claude.md |
| yt:izbifbq3-eI | 2025-05-29 (published) / 2026-10-11 (read) | Tokens vs Embeddings – what are they + how are they different? (Annie Sexton; own-words rewrite, slides checked, no web fact-check) | docs/outhtm/20250529_Tokens-Vs-Embeddings.html | docs/aimd/20250529_Tokens-Vs-Embeddings_claude.md |
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
| WIP202610051 | FINISH | 002 | iw batch 2026-10-13: 34 sources + ChindaMT paper and folder INDEX; iwd redo by Opus with displayed MathML equations; Opus review v2 PASS | file:REFERENCE.md · file:.dropzone/ChindaMT/INDEX.md · ckp:002#57 |
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
| WIP202610039 | FINISH | 002 | iw yt:izbifbq3-eI (Annie Sexton, Tokens vs Embeddings), own-words rewrite, 5 fidelity fixes; REFERENCE row + section | file:docs/outhtm/20250529_Tokens-Vs-Embeddings.html · ckp:002#39 |
| WIP202610040 | FINISH | 002 | Chapter 3 split into 3 Token + 4 Embedding (8 chapters / 37 topics); chapters in web/data/chapters.json; {#slug} in lessons; npm run reindex | file:web/data/chapters.json · file:tools/reindex.js · ckp:002#40 |
| WIP202610038 | FINISH | 002 | iw yt:zduSFxRajkE (Karpathy GPT tokenizer) + lesson 3.3 Tokenizer ของ GPT (byte-level BPE playground); chapter 3 now 3.1–3.9 | file:web/lessons/37_gpt_tokenizer.js · ckp:002#35 |
| WIP202610008 | FINISH | 002 | Owner supplied the coder + review skills (00:07); proposed for saving; ZVect adaptation in docs/arch/WIP202610042 | ckp:002#44 |
| WIP202610042 | FINISH | 002 | coder + review applied to new code; lesson 4.6 split logical / component / text / config, npm run style, review PASS at cycle 3 | file:web/js/samemodel.js · file:tools/check-style.js · ckp:002#44 |
| WIP202610049 | FINISH | 002 | iwd yt:4JofSJIrjwU (Tech With Tim, Unsloth Studio fine-tuning); fact-check 15 (4/9/0/2); two reviewers; REFERENCE group Fine-tuning / LoRA | file:docs/outhtm/20260727_How-To-Fine-Tune-Any-AI-Model-Locally.html · ckp:002#52 |
| WIP202610048 | FINISH | 002 | Chapter 10 LLM - Stanford: Transformer theory (10.1 why, 10.2 self-attention, 10.3 sin/cos position, 10.4 block), coder rules, review PASS cycle 2 | file:web/js/attention.js · file:web/js/tblock.js · ckp:002#51 |
| WIP202610047 | FINISH | 002 | iwd yt:114i2Kz-LZA (Stanford CME295 Lecture 1); fact-check 16 (12/4/0/0); two reviewers; REFERENCE group LLM - Stanford | file:docs/outhtm/20260928_Stanford-CME295-Lecture-1-Transformers.html · ckp:002#50 |
| WIP202610046 | FINISH | 002 | iwd yt:YmLp8qe87A0 (Syntax / CJ, LLMs Explained); fact-check 33 (17/10/2/4) incl. repo; params 102,792 not 52,000; top-p fixed; REFERENCE row + section | file:docs/outhtm/20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More.html · ckp:002#49 |
| WIP202610045 | FINISH | 002 | Topic 4.7 static vs contextual embedding (bank / apple, toy simplified attention), coder rules, review PASS + fixes; 9 chapters / 39 topics | file:web/lessons/39_contextual.js · file:web/js/contextual.js · ckp:002#47 |
| WIP202610044 | FINISH | 002 | Chapter 6 split: 6 fast search (4) + 7 graph search NSW → HNSW (5), 9 chapters / 38 topics; chapter 4 titled Text Embeddings; reindex regex skips Q(8.5,1.2) | file:web/data/chapters.json · file:tools/reindex.js · ckp:002#46 |
| WIP202610043 | FINISH | 002 | iwd yt:Q6TBHDgWCDQ (Thu Vu, text embeddings) + yt:wyWFLIlgmAw (HNSW from scratch); fact-check 10 + 9; ef example B(6) not D(7); REFERENCE rows + sections | file:docs/outhtm/20260628_HNSW-Explained-From-Scratch.html · file:docs/outhtm/20260523_Learn-Text-Embeddings-In-20-Minutes.html · ckp:002#45 |
| WIP202610007 | FINISH | 002 | Owner decided: checkpoint stays a manual ledger; no toolchain port (wipchecker / lint / lang check) | ckp:002#43 |
| WIP202610041 | FINISH | 002 | Topic 4.6 same embedding model for question + documents (two toy tables from seeds 16 / 18, cos(cat_A, cat_B) −0.968), 6 aimd refs, review applied | file:web/lessons/38_same_model.js · ckp:002#42 |
| WIP202610037 | FINISH | 002 | 6 iw reports (RAG multivector, ColBERT precision, Qdrant Edge, Google word2vec, NitMonk Hindi, EmbeddingGemma 2 fine-tune) + tagged REFERENCE.md | file:REFERENCE.md · ckp:002#34 |

## §6 WIP (open items) — ALWAYS LAST, READ FIRST

| WIP ID | title | since | ref |
|---|---|---|---|
| WIP202610011 | [verify] Run `npm start`, `npm test`, `npm run check` on the owner's Windows machine (python/g++ discovery, `.\name.exe` run line) | 2026-10-10 | ckp:001#1 |
| WIP202610012 | [web] Arrows and points vanish when an endpoint is behind the camera at close zoom (lines are clipped, arrows are not; min zoom raised to 5 as mitigation) | 2026-10-10 | ckp:001#1 |
| WIP202610052 | [lib] Reusable Transformer visualizer (lib/tviz/, Canvas + HTML, zero dependency, drop-in for other projects): plan `docs/arch/WIP202610052_transformer-viz/plan.md`; all 23 answered (#58); **S1 done** (core logic + ATDD, 155 tests); next S2 (facade, css, surface, widgets, tokens, heat map, player, attention, lines, heads, app, demo), then S3, S4 (incl. "Lib & Demo" hub page), then one Opus review | 2026-10-13 | ckp:002#57 · ckp:002#58 |
| WIP202610053 | [skill] intelligence-writer v6.2 — owner: talk first, do not change the skill yet. Topics: displayed equations (MathML block type), equation/slide inventory + coverage, reviewer gets frames + completeness/depth checks, iwd depth floor, `|` in tables/captions, Sonnet vs Opus writer | 2026-10-13 | ckp:002#57 |
| WIP202610050 | [docs] LLM manual: plan in `docs/arch/WIP202610050_llm-manual/plan.md`; decisions answered (#55: site section, both levels, strict + iw, links + widgets, front to back, own encoder); entry `README.md` + `T1_brief.md` + packs (#56); next T1, then T2–T8; iw G1 + G2, G3, G6 (hybrid) before the parts that need them — sources (URLs) still to pick | 2026-10-13 | ckp:002#53 · ckp:002#55 · ckp:002#56 |
| WIP202610013 | [lib] Untested divergences: `angle` with NaN (Python 0.0 vs NaN), `fmt(NaN)` text ("NaN" vs "nan") | 2026-10-10 | ckp:001#1 |
| WIP202610021 | [repo] Owner deletes the 8 pre-rename files (copies kept in `.dropzone/_to_delete/`) | 2026-10-10 | ckp:001#5 |
| WIP202610022 | [skill] iw v5.1: meaning-fidelity rule, no lyrics, per-batch frame prefixes, C2PA-aware verify, crop presenter chrome, li/p wrap, own-words rule for standard licenses — card re-shown 23:4x (first one was not visible to the owner), owner to save | 2026-10-10 | ckp:001#7 |
| WIP202610028 | [lessons] Owner asked "ทำไมไม่มี K-mean" / "แยกกลุ่ม Classification ไหม": k-means / IVF (and maybe a "จัดกลุ่ม" chapter with 6.3) need a source first (none of the 12 aimd files covers it); owner to send a clip/article for iw | 2026-10-11 | ckp:001#19 |
| WIP202610031 | [web] Owner (14:58): simple explanatory pictures in the style of his "Character tokenization" screenshot (the BPE clip's slide ~1:55). First done in 3.1 / 3.2 (`web/js/tokdraw.js`: token box → arrow → number, canvas + a static SVG); owner to say which other lessons get one | 2026-10-11 | ckp:001#26 |
| WIP202610036 | [lessons] Owner (16:20) asked whether RAG needs its own topic; proposed one topic 7.3 "RAG: ค้นแล้วส่งให้ LLM" (no new chapter). Sources now: ColBERT (xTzUn3G9YA0), multivector RAG demo (6iCmnd0k3fs: per-token MaxSim table, 1-bit docs, Pleias-RAG-350M answer), Qdrant Edge (8LPgGU34RoE: retrieve-then-rerank). Owner's 16:53 "RAG : Multivector" read as "read these sources"; still waiting for a yes to build | 2026-10-11 | ckp:001#31 · ckp:002#34 |
| WIP202610023 | [lessons] Remaining lesson ideas (word counts, positional encoding, keyword vs vector and filtered-graph disconnection were built in #17 / #19): Matryoshka truncation, outliers; examples 09 / 14 could add 中文 / 日本語 and the after-word ない rule (#20 review); from #34: 5.3 asymmetric mode (float query × 1-bit docs, 2Σ−Σ), 3.4 animal property table vs IDs, 3.8 in-batch negatives + duplicate trap; from #35: vocab size / special tokens in 3.4 or 7.1, an "LLM quirks from tokenization" topic (spelling, digits, trailing space, SolidGoldMagikarp, JSON vs YAML), 7.x next token (softmax + temperature) | 2026-10-10 | ckp:001#10 · ckp:002#34 · ckp:002#35 |

### Narrative

- **Latest (#58, 2026-10-13 22:3x):** tviz questions all answered, S1 built and delivered (155 tests). Next: tviz S2; iw v6.2 talk; owner commits #45–#58.
- Before that (#57, 2026-10-13 19:3x): iw batch of 34 sources + ChindaMT delivered after an Opus redo with displayed equations; visualizer plan waiting for the owner (`WIP202610052`); iw v6.2 talk (`WIP202610053`). Next: owner answers the plan questions, commits #45–#57.
- Before that (#56, 2026-10-13 11:5x): start-up shortcuts (entry README, T1 brief, packs), `llms.txt` pointer for other projects, handoff `20261013_1150.md`. Next: T1; owner commits #45–#56.
- Before that (#55, 2026-10-13 11:4x): LLM manual decisions answered, plan moved to `docs/arch/WIP202610050_llm-manual/`, APPROVALS row #1. Next: T1 build; owner names or approves sources for G1–G3, G6; commits #45–#55.
- Before that (#54, 2026-10-13 03:27): handoff `20261013_0327.md`. Next: owner answers the LLM manual decisions, commits #45–#54.
- Before that (#53, 2026-10-13 03:xx): LLM manual plan written and reviewed (`WIP202610050` open). Next: owner answers D1–D7 and picks sources for G1–G10.
- Before that (#52, 2026-10-13 02:xx): iwd Unsloth Studio fine-tuning (Tech With Tim) done (`WIP202610049`); lessons unchanged, proposals in REFERENCE. Next: owner commits #50–#52, says whether a fine-tuning / RAG-vs-fine-tuning topic is wanted.
- Before that (#51, 2026-10-13): chapter 10 "LLM - Stanford: Transformer" built (4 topics, `WIP202610048`) after the Stanford iwd (#50, `WIP202610047`). Next: owner opens #/transformer-why … #/transformer-block, commits; open proposals as in #48.
- Before that (#49, 23:2x): iwd LLMs Explained done (`WIP202610046`). Next (queued by the owner 22:56): iwd yt:114i2Kz-LZA + topic "LLM - Stanford" after LLM.
- Before that (#48, 22:43): handoff `20261012_2243.md`; next session asks which proposal to build.
- Before that (#47, 22:4x): topic 4.7 static vs contextual built (`WIP202610045`). Next: owner opens #/contextual, commits; other content proposals (7.x HNSW, 4.x, 5.4 / 6.1 notes) wait for a yes.
- Before that (#46, 20:2x): chapter 6 split into 6 fast search + 7 graph search, chapter 4 = Text Embeddings (`WIP202610044`). Next: owner opens the site, commits.
- Before that (#45, 19:5x): iwd of Thu Vu text embeddings + HNSW from scratch (`WIP202610043` closed); lesson use proposed only. Next: owner commits,
  says which proposed lessons to touch (HNSW ef / layers for 6.x, TF-IDF / skip-gram for 4.x), decides whether `WIP202610022` closes (account iw is now v6.1).
- Before that (#44, 00:4x): coder + review adopted for new code, 4.6 refactored, review PASS (cycle 3). Next: owner saves the two skill cards, commits.
- Before that (#43, 23:57): `WIP202610007` closed, checkpoint stays manual.
- Before that (#42, 23:4x): 4.6 "ต้องใช้ model เดียวกันทั้งคำถามและเอกสาร" built and reviewed (`WIP202610041` closed). Next: owner opens #/same-model, commits #34–#42,
  `git rm web/js/dict.js`, deletes stale files (`WIP202610021`), picks the next topic (`WIP202610036` RAG 8.3 / `WIP202610023`).
- Before that (#41, 23:17): handoff `.dropzone/hzup_claude/20261011_2317.md`; next session builds 4.6 (`WIP202610041`, approved).
- **Previous thread (#40, 2026-10-11 23:xx):** chapter 3 split into Token / Embedding, chapters in `web/data/chapters.json`, `npm run reindex` (`WIP202610040` closed).
  Next: owner commits #34–#40, `git rm web/js/dict.js`, answers the embedding-model topic (`WIP202610041`).
  Before that #39: iw "Tokens vs Embeddings" done (`WIP202610039`); chapter-3 split proposed.
  Before that #38: dictionary code moved to `web/js/dict/` behind a facade; owner deletes `web/js/dict.js`.
  Before that #37 (22:xx): start view fits the canvas, 3.1 shows 4 languages, equation box class, Dict page grid + one-row add form.
  Before that #36: lone buttons removed (3.2, 4.4, 7.1). #35: Karpathy GPT-tokenizer iw + lesson 3.3
  (`WIP202610038`). Next: owner tries #/gpt-tokenizer and #/bpe, commits #34–#39, picks lesson work from `WIP202610036` / `WIP202610023`, deletes stale files (`WIP202610021`).
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
  to that repo's file names, so this repo uses its ledger rules by hand (owner 23:57, #43: "เขียนด้วยมือพอ"; `WIP202610007` closed).
