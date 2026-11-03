# WIP202610054 — Chapter 10 as "LLM from Stanford Class CME295" (plan)

Status: plan only, written 2026-10-15 13:5x on the owner's "ok ใส่ plan ใน docs ไว้ก่อน". No code, no lesson or
`chapters.json` change, no checkpoint row yet (add at the next upckp). WIP ID taken as the next after `WIP202610053`
in `checkpoints/checkpoint.zvect.ver002.md`; check for a collision with other sessions before the upckp.

## 1. Why

- Owner (2026-10-15 11:30): the current chapter 10 "LLM - Stanford: Transformer" (`WIP202610048`, lessons 40–43) is not
  the flow he wants. It picks theory parts (why, self-attention, sin/cos position, block) out of the lecture.
- Wanted: explain what Stanford's first class starts with, what it tells, and how it begins, in the lecture's own
  order, as:
  - 10.x LLM from Stanford Class CME295
    - Class 1
      - Class 1 topic A
      - Class 1 topic B
- Owner (13:17) asked about pictures: the existing iwd has too few frames for per-topic pictures (§4), so a new iwd
  is needed.

## 2. Source

- Stanford Online, "Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 1 - Transformers", 1:44:28,
  2026-09-28, Afshine and Shervine Amidi, https://www.youtube.com/watch?v=114i2Kz-LZA
- Existing iwd (`WIP202610047`, 2026-10-12): `docs/outhtm/20260928_Stanford-CME295-Lecture-1-Transformers.html`
  (13 sections in lecture order, ~38,800 characters, fact-check 16: 12 / 4 / 0 / 0) and
  `docs/aimd/20260928_Stanford-CME295-Lecture-1-Transformers_claude.md`.
- Course site: https://cme295.stanford.edu/syllabus/ (9 lectures; later classes become Class 2, 3, … of this chapter).

## 3. How Class 1 runs (target structure)

The lecture opens with the lecturers, the goal of the course (how LLMs work, how they are trained and used, strengths
and weaknesses) and logistics, then tells how the field got here, and starts the content from "models only
understand numbers". One sentence, "A cute teddy bear is reading.", runs through the whole class; each step fixes the
limit of the step before, ending at the transformer.

| topic | content | time | iwd section |
|---|---|---|---|
| A. Course intro | lecturers, goal, audience, prerequisites, changes since last year, logistics | 0:06 | 1, 2 |
| B. Timeline | 2010s one RNN per task → 2017 transformer (scalable) → LLMs → ChatGPT Nov 2022 → 2026 coding agents | 12:42 | 3 |
| C. Tokenization | word / character / subword trade-offs, BPE, special tokens, vocabulary ~200k | 16:56 | 4, 5 |
| D. One-hot → word2vec | orthogonal one-hot, proxy task (CBOW / skip-gram), slide V = 6, limits | 37:27 | 6 |
| E. RNN / LSTM | hidden state gives word order; long-range dependency, vanishing gradient, sequential | 48:26 | 7 |
| F. Attention → self-attention | direct links (2014), Q / K / V, softmax(QKᵀ/√d_k)V, board derivation | 55:18 | 8, 9 |
| G. Transformer architecture | token + position embedding (learned vs sin/cos clock), encoder, decoder, cross-attention | 1:09:35 | 10, 11 |
| H. Tricks | residual, layer norm, mask, multi-head, dropout, label smoothing | 1:22:16 | 12 |
| I. End-to-end example | translate the teddy-bear sentence with every shape (W_Q, QKᵀ n×n, W_O, d_ff, N = 6) | 1:27:35 | 13 |
| J. Q&A | essentials are attention and the FFN; mask; two softmaxes; [BOS] / [EOS] | 1:40:01 | 13 |

## 4. Picture gap in the existing iwd

9 frames + 2 own SVG for 1:44:28.

| iwd section | frames now |
|---|---|
| 1 course, 2 logistics | 0 |
| 3 timeline | 1 + 1 SVG |
| 4 tokenization | 1 |
| 5 BPE, special tokens, vocabulary | 0 |
| 6 one-hot, word2vec | 1 (one-hot only; the word2vec slide V = 6 is missing) |
| 7 RNN / LSTM | 1 |
| 8 attention | 1 |
| 9 self-attention (12 min) | 1 (board derivation missing) |
| 10 architecture + input | 1 |
| 11 encoder, decoder | 0 |
| 12 tricks | 0 |
| 13 end-to-end + Q&A (17 min) | 2 (shape slides, triangular mask missing) |

Goal for the new iwd: a slide inventory of the whole clip first, then at least one frame per topic A–J, and every
slide the text relies on (word2vec V = 6, board derivation, shape slides, mask matrix).

## 5. Steps

| step | what | gate |
|---|---|---|
| S0 | Owner answers §6 | before S1 |
| S1 | New iwd of Lecture 1: slide inventory → frames per topic A–J → text in lecture order; replaces the 2026-10-12 report and aimd (old ones kept until the owner says delete) | output in `.dropzone` until the owner's ok |
| S2 | Chapter shell: chapter 10 renamed "LLM from Stanford Class CME295", Class 1 level, topics A–J in `web/data/chapters.json`, `npm run reindex` | owner's ok on §3 |
| S3 | Topic pages A–J, each from its iwd section and frames, coder rules (logical / component / text / config) | per topic |
| S4 | One review (fresh subagent), `npm test`, `npm run check` | before commit |
| later | Class 2, 3, … one iwd per lecture, same pattern | owner names the next lecture |

## 6. Open questions for the owner

| # | question | options |
|---|---|---|
| Q1 | When to redo the iwd | **Answered (owner 2026-10-15 13:53): wait for iw v6.2 (`WIP202610053`, another session), then redo once.** S1 is blocked until v6.2 is done. |
| Q2 | Existing lessons 40–43 | **Answered (owner 2026-10-15 13:55): move under Class 1, and check them against the clip for missing parts** (§7). |
| Q3 | Topics that overlap other chapters (C with chapter 3 tokenization / BPE, D with chapter 4 embeddings) | **Settled by the Q2 answer (owner 2026-10-15 13:56): nothing in the clip is left out, so C and D are written in Class 1 as the lecture tells them; links to chapters 3 / 4 are extra, not a replacement.** |
| Q4 | Topics A (course intro) and J (Q&A) | **Settled by the Q2 answer (owner 2026-10-15 13:56): keep both as topics.** |

## 7. Lessons 40–43 against Class 1 (owner 2026-10-15 13:55)

Owner: the lessons feel odd, few short steps each and very brief; he understands the aim was to keep them simple, but
the way to make them truly simple is visuals drawn as SVG. Decide the SVG plan after iw v6.2 and the new iwd.

First check (2026-10-15, lessons 40–43 `*.text.js` against the 2026-10-12 aimd; the full check against the clip
waits for the new iwd):

| topic | lesson now | missing or thin |
|---|---|---|
| A course intro | none | whole topic |
| B timeline | 40, notes only | not a step of its own |
| C tokenization | none in chapter 10 (chapter 3 has tokenization / BPE) | Stanford's word / character / subword trade-offs, special tokens, vocabulary size |
| D one-hot → word2vec | 40, one line in notes | proxy task (CBOW / skip-gram), slide V = 6 with hidden (0.2, 0.9), the four limits |
| E RNN / LSTM | 40 (3 steps, toy ρ = 0.6) | LSTM cell state only in notes; vanishing gradient only in notes |
| F attention → self-attention | 41 (4 steps) | the 2014 attention slide; the board derivation (QKᵀ)ᵢⱼ = qᵢ·kⱼ |
| G architecture | 42 (2 steps, positions) + part of 43 | encoder vs decoder roles before the details |
| H tricks | 43 | dropout and label smoothing (90% / 10%) only in notes |
| I end-to-end example | part of 43 | the full walk: teddy-bear sentence, every shape, decoder loop from [BOS] word by word ("un", "ours en peluche", …) to [EOS] |
| J Q&A | none | attention + FFN are the essentials, FFN holds most parameters, two different softmaxes |
