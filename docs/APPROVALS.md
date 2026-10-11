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
| — | — | (none yet) | — | — | — | — |
