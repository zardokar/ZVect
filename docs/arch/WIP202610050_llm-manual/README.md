# LLM manual (คู่มือ LLM) — START HERE

One entry point for any session that needs this work: a ZVect session, or a session from another project.
Owner: zardokar. WIP: `WIP202610050` (open). Written 2026-10-13; the live state is always checkpoint §6, not this file.

## What it is

A Thai manual that takes a developer from "text is numbers" to "which architecture should I build" (prompt / RAG /
fine-tune / agent). 12 parts + appendices, written only from the 27 source notes in `docs/aimd/` (A01–A27), every
paragraph traceable to an aimd line. It will live in the ZVect site as `#/manual/<slug>` and link the 43 lessons.

## Where the repo is

| route | address | sees |
|---|---|---|
| owner's PC (2026-10-13) | `D:\repository\ZVect` (a linked session reaches it through the device bridge) | everything, incl. git-ignored `.dropzone/` |
| GitHub (public) | `https://github.com/zardokar/ZVect` · raw: `https://raw.githubusercontent.com/zardokar/ZVect/main/<path>` | committed and pushed files only (no `.dropzone/`) |
| site (GitHub Pages) | `https://zardokar.github.io/ZVect/` | the lessons; the manual after T1 is pushed |

## Read by task (read only the row you need)

| task | read | size |
|---|---|---|
| status / what is next | checkpoint `checkpoints/checkpoint.zvect.ver002.md` §6 (last section) | 1 table |
| build the site shell (T1) | `T1_brief.md` in this folder | ~80 lines |
| write part X of the manual | `.dropzone/Create_LLM/packs/part_X.md` (outline + the exact aimd lines + N / C / G rows + lesson numbers). Check its md5 header; if stale, run `python .dropzone/Create_LLM/tools/make_packs.py` | 40–290 lines per part |
| same, from GitHub (no `.dropzone`) | `plan.md` §5 (that part) + the cited `docs/aimd` lines; A-id → file map in `plan.md` §3 | — |
| decisions, rules, gaps, to-do | `plan.md` §2 (owner's answers), §9 (gaps G1–G12), §11 (to-do) | — |
| use the LLM knowledge in another project | `docs/aimd/*_claude.md` (English notes, one per source) + `REFERENCE.md` first part (topic groups, tags) | — |

## Rules for a session from another project

| # | rule |
|---|---|
| 1 | Read-only. Do not edit ZVect files, its checkpoint, handoffs or WIP ids; do not commit. Only the owner, or a ZVect session he starts, changes ZVect. |
| 2 | When you reuse ZVect knowledge, cite the aimd file and line (for example `A24 L23`). Keep the labels: a source's claim vs ผลตรวจของผู้จัดทำ / ผู้จัดทำ / ความรู้ทั่วไป. Do not copy transcript text; aimd files are already own-words notes. |
| 3 | Numbers: quote a source's number as the source's, or recompute it. Table N (`plan.md` §7) and the contradiction register C (§8) say which value wins. |
| 4 | To ask or tell ZVect something, write one message file `.dropzone/hzup_intercomm/YYYYMMDD_HHMM_<sender>_to_claude-zvect.md` (sender like `claude-<project>`), pointers not copies, and tell the owner its path. A ZVect session reads that folder at start. |
| 5 | Counts and status in any copy (this file, a handoff, your notes) are historical. Read checkpoint §6 for the current state. |

## Files in this folder

| file | what |
|---|---|
| `README.md` | this entry point |
| `plan.md` | the full plan (reviewed; owner's answers in §2) |
| `T1_brief.md` | build spec for the site shell, with md5 of the code it was written from |
