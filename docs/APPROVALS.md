# Dependency & framework approvals

Policy (owner rule, 2026-10-10): **no frameworks and no dependencies.** Node built-ins,
the Python standard library and the C++ standard library only. The web lessons use plain
HTML, CSS, Canvas 2D and MathML.

An exception is allowed only with a row in this table, written **before** the dependency
is added, carrying the date-time of the owner's approval. A dependency without a row here
is a policy violation; `npm test` fails if `package.json` lists any dependency at all, so
adding one also means updating that test in the same commit and citing the row.

| # | Date-time (Asia/Bangkok) | Package / framework | Version | Used for | Approved by | Evidence |
|---|---|---|---|---|---|---|
| 1 | 2026-10-13 11:3x | Data file (not a package): `cl100k_base.tiktoken` BPE ranks file used by OpenAI's tiktoken (library is MIT; confirm the file's terms at T6). Dev-only, read by our own Node encoder in `tools/`; never loaded by the site; `package.json` stays dependency-free | sha256 recorded here when the file is added (plan T6) | Count Thai vs English tokens for LLM manual Part II.5 (gap G12) | Owner (D7 = c, "encoder Node ของเราเอง") | ckp:002#55 · `docs/arch/WIP202610050_llm-manual/plan.md` §2 |
