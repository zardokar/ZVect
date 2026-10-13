# T1 brief — "คู่มือ" section of the site (LLM manual shell)

- **Written:** 2026-10-13 11:4x Asia/Bangkok by Claude, from the code as it was on disk then (inputs and md5 at the end).
- **WIP:** `WIP202610050` · plan: `plan.md` in this folder (§2 answers, §10 tooling, §11 T1).
- **Goal of T1:** the site can show the manual. No manual prose is written in T1 (that is T2 / T4); one stub page proves the path.
- **Rules:** coder rules (`docs/arch/WIP202610042_coder-rules/plan.md`, checkpoint §5): every NEW file ≤ 200 lines, no one-line
  functions, one statement per line, comment block ≤ 3 lines, logic / component / text / config split, listed in
  `tools/style-scope.json`. Old files (`web/js/app.js` 307 lines, `web/css/style.css`) get the smallest possible edit; do not refactor them.
  No dependency (law 2). Dark theme only (law 3). Never run git write commands (law 5).

## 1. How the site works today (read only these)

| file | what matters for T1 |
|---|---|
| `web/index.html` | one page; `body[data-page]` is `lesson` or `lib`; `#libpage` is the free-form area used by the Lib and Dict pages; sidebar header has `#libnav` and `#dictnav` icon links with `data-slug` |
| `web/js/app.js` | `route()` (line ~71): `slug = location.hash` minus `#/`; `lib` → `showLib()`, `dict` → `showDict()`, else a lesson. `showDict()` sets `document.body.dataset.page = "lib"` and calls `mountDictPage($("#libpage"))` — **copy this pattern** |
| `web/js/dict/page.js` | example of a page module mounted into `#libpage` |
| `web/js/chapters.js` | exports `resolve(s)`: `{#slug}` → current number ("?" if unknown). Manual strings must pass through it |
| `web/lessons/43_transformer_block.text.js` | example of a text module (`export const TEXT = {...}`, HTML strings, Thai, labels ผู้จัดทำ etc.) |
| `web/js/sources.js` | `SOURCES[id] = { title, by, date, url, report }`; reuse ids for source lines |
| `web/css/style.css` | `:root` tokens (`--paper`, `--panel`, `--ink`, `--muted`, `--line`, …); `body[data-page="lib"] .lesson { display:none }`; `.libpage { max-width: 80ch }` |
| `tests/chapters.test.js` · `tests/style.test.js` | test style (`node:test`, `assert/strict`, read JSON with `readFileSync`) |
| `package.json` | `npm test` lists every test file explicitly — add the new one |

## 2. Files to create

| file | category | content |
|---|---|---|
| `web/data/manual.json` | config | `{ "parts": [ { "id": "p0", "title": "...", "sections": [ { "slug": "manual-how-to-read", "file": "00_part0/01_how_to_read", "title": "..." } ] } ] }`. Slugs are `manual-…` (never equal to a lesson slug, `lib`, `dict`). Order lives only here (same idea as `chapters.json`) |
| `web/js/manual/model.js` | logic (pure, tested) | `validate(doc, lessonSlugs)` → error list (unique slugs, `manual-` prefix, no clash, every field filled); `flatten(doc)` → ordered sections with part index; `find(doc, slug)` → `{ section, prev, next }`; `widgetNames(html)` → names in `{widget:<name>}`; `splitWidgets(html)` → pieces for the renderer; `numberOf(doc, slug)` → "0.1"-style label |
| `web/js/manual/page.js` | component | `mountManualPage(el, slug)`: no slug → part index (all parts and sections from `manual.json`); a slug → dynamic `import("../../manual/" + file + ".text.js")`, render `SECTION.html` through `resolve()`, mount each `{widget:<name>}` by importing `../../manual/widgets/<name>.js` and calling its `mount(div)`; prev / next links; unknown slug → index with a short note |
| `web/manual/manual.text.js` | text | every UI string: page title "คู่มือ LLM", index intro, "ภาคก่อนหน้า" / "ภาคถัดไป", "เจาะลึก", "กำลังเขียน", source-line format, unknown-slug note |
| `web/manual/00_part0/01_how_to_read.text.js` | text | stub section: `export const SECTION = { title, html: "<p>กำลังเขียน</p>", refs: [] }` (real text comes in T2) |
| `tests/manual.test.js` | test | every function in `model.js` (incl. a red case each); `manual.json` passes `validate` against the slugs in `web/data/chapters.json`; every section `file` exists; every `{widget:x}` has `web/manual/widgets/x.js` |

**Section text format (fix it now, T2–T4 depend on it):**
- `SECTION.html` is one HTML string. Each paragraph carries its ref comment: `<!-- ref: A24 L23 | anchor: "softmax(QK" -->` (plan §10; the T3 checker reads these).
- Advanced layer (D2): `<details class="deep"><summary>เจาะลึก</summary> … </details>` — closed by default, so a beginner can skip it.
- Widgets (D5): `{widget:<name>}` on its own line. T1 ships the mount point only; no widget yet.
- Numbers: `{N12}` placeholders stay as they are in T1 (T2 fills them from table N); lesson links: `{#slug}` (resolved by `chapters.js`).

## 3. Smallest edits to existing files

| file | edit |
|---|---|
| `web/index.html` | add `<a id="manualnav" href="#/manual" data-slug="manual" class="libnav" title="คู่มือ LLM" aria-label="คู่มือ LLM">` with a simple stroke SVG icon, next to `#dictnav` |
| `web/js/app.js` | import `mountManualPage`; in `route()`: when the slug is `manual` or starts with `manual/`, set `body.dataset.page = "lib"` and mount with the part after `manual/`; add `#manualnav` to the `aria-current` selector and match it on the first path segment. About 6 lines; nothing else |
| `web/css/style.css` | `.manual` page rules and `details.deep` box using existing tokens only (`--panel`, `--line`, `--muted`, `--eq-radius`); no new colours, no light theme |
| `tools/style-scope.json` | add every new file in §2 |
| `package.json` | add `tests/manual.test.js` to the `test` script |

Not in T1: the search box (lessons only), README / llms.txt lists (T8), `npm run check:manual` (T3), any manual prose (T2+).

## 4. Done when (all run, numbers quoted only from the run — law 1)

1. `npm test` passes (66 tests before T1, plus the new ones); `npm run style` passes (40 files before T1, plus the new ones); `npm run check`; `npm run reindex -- --check`.
2. Red proof: break one rule per new `model.js` function and see its test fail, then restore.
3. Serve with `PORT=5199 node server.js`; Playwright at 1400×900, 820×1000, 390×844 over every lesson, `#/dict`, `#/manual`, `#/manual/manual-how-to-read` and `#/manual/no-such-slug`: 0 page errors, no horizontal overflow, no `?` from an unresolved `{#…}`, dark background. Look at the screenshots of the manual pages.
4. Independent review (fresh subagent, data-only brief, JSON verdict, fail-closed, ≤ 2 fix cycles; a 3rd needs the owner's yes).
5. upckp (checkpoint §5b entry, §6 row for `WIP202610050` updated), commit line for the owner (< 120 characters) + `git reset --soft HEAD~1`.

## 5. Inputs this brief was written from (md5 at 2026-10-13 11:4x)

If one of these changed, re-read that file before trusting the brief.

| file | md5 |
|---|---|
| `web/index.html` | 6a84e9ad028e6cc2b72eca842be08ee3 |
| `web/js/app.js` | 0a7c5687e2358d79f3674f8c7acd2871 |
| `web/js/chapters.js` | a932c3bb26a9a5df89c5679b2aed11a7 |
| `web/js/sources.js` | 2a3a92cd68a1c0836699d42a914a2cef |
| `web/css/style.css` | 03df9262a6f51ae27435efa9f4b3f4dd |
| `web/lessons/43_transformer_block.text.js` | 93cd718ffa554e0e9447b0d9b6dba12b |
| `tools/style-scope.json` | e61f94f4ed0dbf76fb9193629d3a3a52 |
| `package.json` | b4f833347914fde133eb6bed572dd77b |
| `tests/chapters.test.js` | 776acd926660013eeab619a23875ddf8 |
| `docs/arch/WIP202610042_coder-rules/plan.md` | 9f20ff72d51f0fc83dd5aff5c16a9069 |
