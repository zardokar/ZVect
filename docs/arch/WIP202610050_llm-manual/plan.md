# Create_LLM — plan for a ZVect "LLM manual" (คู่มือ LLM)

- **Owner (2026-10-13 02:01):** "ร่างแผนทำ LLM manual จากความรู้ทั้งหมดที่ได้มาที ขอให้คิดให้ดีๆ และ ref เชิงลึก ใน aimd ทุก file ที่ทำ LLM
  .dropzone/Create_LLM/plan.md เรียก ตัวเอง Review แล้วถ้าผ่านให้ เรียก Fable Review ด้วย อีก 1 ครั้ง แล้วบอกทีว่าต้องทำอะไรบ้างใส่ไว้"
- **Status:** decisions answered (owner, 2026-10-13 11:3x; §2 "Owner's answers"). Build may start at T1. Nothing in the site, the lessons or `docs/aimd` has changed yet.
- **WIP:** `WIP202610050` (open, checkpoint ver002 #53, #55). Moved at the owner's request (T0, 11:3x) from `.dropzone/Create_LLM/plan.md` (git-ignored; that path now holds a pointer) to `docs/arch/WIP202610050_llm-manual/plan.md`.
- **Raw material:** the 27 `docs/aimd/*_claude.md` files (A01–A27, §3). A per-file deep index was built for this plan (`.dropzone/Create_LLM/index/index_1–4.md`: heading maps, 8–35 line-level atoms per file, corrections, code, gaps), and every reference below was taken from it and checked against the files.
- **Reviews:** self-review (independent subagent) → Fable review. The results are in §12.

## สรุปสำหรับเจ้าของ (TH)

- **คู่มือคืออะไร:** หนังสือภาษาไทยที่เล่าเรื่อง LLM ตั้งแต่ token จนถึง RAG, fine-tuning และการเลือกสถาปัตยกรรม เรียงเป็น 12 ภาค + ภาคผนวก
- **ใช้อะไรเขียน:** เขียนจาก aimd 27 ไฟล์ที่เราอ่านมาเท่านั้น และทุกย่อหน้าต้องชี้กลับไปที่บรรทัดใน aimd ได้ (ตาราง §5)
- **บทเรียนเดิม:** ไม่ได้มาแทนบทเรียน 43 หัวข้อ คู่มือเป็นตัวเล่าเรื่องที่ร้อยบทเรียนเข้าด้วยกัน และลิงก์ไปบทเรียนกับรายงาน HTML
- **ตัวเลข:** ใช้ชุดเดียวกันทั้งเล่ม (ตาราง N, §7) แหล่งที่ขัดกันมีทะเบียนตัดสินแล้วว่าใช้ค่าไหน (ตาราง C, §8)
- **ที่ยังไม่มีแหล่ง (§9):** pre-training/RLHF แบบละเอียด, inference (KV cache), สถาปัตยกรรมรุ่นใหม่ (RoPE, MoE), agent และ hybrid search ต้องอ่านแหล่งเพิ่ม (iw) ก่อนเขียนภาคเหล่านี้
- **ต้องตัดสินใจก่อนเริ่ม 7 ข้อ (§2):** รูปแบบและที่อยู่ของคู่มือ, ผู้อ่าน, ขอบเขตแหล่ง, ภาษา, ความ interactive, ลำดับการเขียน และวิธีวัด token ภาษาไทย
- **เจ้าของตอบแล้ว (2026-10-13 11:3x):** คู่มืออยู่ในเว็บ (`#/manual/<slug>`) · ผู้อ่านทั้งสองระดับ · aimd เท่านั้น + iw เติมช่องว่าง · ไทย + ศัพท์อังกฤษ (ใช้ค่าแนะนำ) · ลิงก์บทเรียน + mini-widget ในบท · เขียนหน้าไปหลัง 0 → XII · วัด token ไทยด้วย encoder Node ของเราเอง · iw ก่อน: G1, G2, G3, G6 (G6 = hybrid search หลังสลับเลขกับ agent ซึ่งตอนนี้เป็น G7)
- **รายการสิ่งที่ต้องทำทั้งหมด:** §11

---

## 1. What the manual is

| item | proposal |
|---|---|
| Purpose | One Thai narrative that takes a developer from "text is numbers" to "which architecture should I build" (prompting / RAG / fine-tuning / agent). It explains *why* each step exists, using the sources' own examples and numbers. |
| Relation to ZVect | The 43 lessons stay the interactive part. The manual is the connective text: each chapter links to its lessons (`{#slug}`) and to the source reports (`docs/outhtm/*.html`). No lesson is duplicated in prose. |
| Reader | Two levels (D2 = both). Main text: Thai developer, beginner to intermediate, who can read code but has not trained a model. "เจาะลึก" boxes carry the advanced (ML engineer) layer in full: formulas, tensor shapes, code, trade-offs. A beginner can skip every box and still follow the story. |
| Source rule | Same as lessons: content comes from `docs/aimd`. Anything else is labelled **ผู้จัดทำ** (our own) or **ความรู้ทั่วไป** (general knowledge); fact-check results are labelled **ผลตรวจของผู้จัดทำ** (D3). |
| Number rule | Checkpoint §5a law 1: never quote a number you did not just run. Every number either cites its aimd line (the source's number, labelled as such) or is recomputed by a script in the repo (§7). |
| Copyright | aimd files are already own-words rewrites. The manual paraphrases them again. Quotes stay under 15 words with attribution, and transcripts are never used directly. |

## 2. Decisions for the owner (answer before T1)

| # | decision | options | recommended | why |
|---|---|---|---|---|
| D1 | Format and location | (a) Thai chapters in the repo, shown as a "คู่มือ" section of the site (`#/manual/<slug>`); (b) a Claude Docs artifact (editable, shareable, exports Word/PDF); (c) one long dark-theme HTML like `docs/outhtm` | (a) | (a) can link lessons by `{#slug}` (resolved at runtime by `chapters.js`, so links survive renumbering), ships with GitHub Pages and stays under git. (b) is quicker to share but cannot link `{#slug}` or run the checker. (c) is one file, hard to review chapter by chapter. |
| D2 | Reader level | beginner–intermediate dev · advanced (ML engineer) | beginner–intermediate | Matches the lessons. Advanced detail goes into "เจาะลึก" boxes. |
| D3 | Source scope | strict (aimd only; gaps say "ยังไม่มีแหล่ง") · iw new sources first, then write the gap chapters · allow labelled general knowledge to fill gaps | strict now, iw for gaps | Keeps the project rule. Gap parts (VI, parts of V and X) wait for the sources in §9. |
| D4 | Language | Thai + English terms (loanword rule) · bilingual | Thai + English terms | Same as lessons and reports. |
| D5 | Interactivity | text + links to existing lessons only · new mini-widgets inside chapters | links only for v1 | New interactive work is a lesson, which follows the coder rules and has its own WIP. |
| D6 | Writing order | core first (II–V), then practice (VII–XI), then gaps · front to back | core first | II–V have the strongest sources (A05, A06, A10, A13, A20, A24) and unblock everything else. |
| D7 | Thai token measurement (G12) | (a) APPROVALS row for tiktoken (dev-only) · (b) owner counts in a tokenizer web app, we record it · (c) no package: a small `tools/` byte-level BPE encoder in Node (built-in RegExp with `\p{L}`/`\p{N}`) over a downloaded cl100k_base ranks file — storing that data file still needs the owner's yes | (c) if the owner allows the data file, else (b) | Thai cost matters for a Thai reader, but §5a law 2 bars a new dependency without a dated APPROVALS row. |

**Owner's answers (2026-10-13 11:3x, ckp:002#55):**

| # | answer | what it changes |
|---|---|---|
| D1 | (a) "คู่มือ" section of the site | T1 builds route, part index and text-module renderer |
| D2 | both levels ("1+2") | §1 Reader row: beginner–intermediate main text; the advanced layer is a required part of each section (in "เจาะลึก" boxes), reviewed like the main text |
| D3 | strict + iw for gaps | as recommended; gap text waits for its iw source (T7) |
| D4 | not asked; recommended value used: Thai + English terms | — (owner may override) |
| D5 | both ("1+2"): links to lessons **and** mini-widgets inside chapters | §10 tooling: a widget mount point in the manual renderer; each widget follows the coder rules and gets its own WIP + review (R6) |
| D6 | front to back, 0 → XII | §11 T4–T7 reordered: iw for a gap runs before the part that needs it (G3 before V, G1 + G2 before VI, G6 before X) |
| D7 | (c) our own Node encoder over a cl100k_base ranks file | the data file is allowed; dated row in `docs/APPROVALS.md` (#1) written before the file is added (T6) |
| T0b | iw G1 + G2, G3, G6 (hybrid search) first; owner swapped the ids "G7 เปลี่ยนเป็น 6 และ G6 เป็น G7" | §9: hybrid search is now G6, agents / MCP is now G7 (all refs in this file swapped). Agents wait for a later batch |

If D1 = (a), a renderer is needed. Checkpoint §5a law 2 bars a new dependency without a dated row in `docs/APPROVALS.md`. The plan therefore assumes chapters are authored as JS text modules like `web/lessons/*.text.js` (HTML strings, no Markdown library). A Markdown renderer would need an APPROVALS row first.

## 3. Source map (A01–A27)

`Axx Ly–z` below means `docs/aimd/<file of Axx>` lines y–z (line numbers as of 2026-10-13; §10 R1 explains how drift is caught). Tier = how central the file is to an LLM manual. FC = web fact-check (confirmed / partly / not found / contradicted).

| id | file (docs/aimd/…) | source | tier | FC | best for |
|---|---|---|---|---|---|
| A01 | 20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra | 3Blue1Brown, 9:51 | background | — | T01 vector views, add/scale |
| A02 | 20230129_Cosine-Similarity-Clearly-Explained | StatQuest, 10:13 | supporting | — | T02 first cosine intuition |
| A03 | 20230608_A-Beginners-Guide-To-Vector-Embeddings | Colin Talks Tech, 8:29 | background | — | T08/T20 same-model Q&A flow, index vs DB |
| A04 | 20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU | CMU DB, Vasnetsov, 62:38, CC BY | supporting | — | T19 production search, filtering, binary quantization |
| A05 | 20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work | Raj Pulapakura, 14:33 | core | — | T03 BPE step by step |
| A06 | 20240220_Lets-Build-The-GPT-Tokenizer | Karpathy, 2:13:34 | core | — | T03 byte-level BPE, regex, special tokens, quirks |
| A07 | 20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions | Prompt Engineering, 17:44 | supporting | — | T20 ColBERT intuition |
| A08 | 20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python | Serengil, 19:06 | background | — | T19 tree ANN |
| A09 | 20240909_Machine-Learning-Crash-Course-Embeddings | Google, 2:36 | supporting | — | T05 word2vec network layers |
| A10 | 20250221_What-Are-Word-Embeddings | Under The Hood, 19:32 | core | — | T04–T06, transformer embedding layer |
| A11 | 20250525_Exploring-Precision-In-ColBERT-Indexing-And-Retrieval | Vishal Bakshi, 18:42 | background | — | T18 precision experiment (weak) |
| A12 | 20250529_Tokens-Vs-Embeddings | Annie Sexton, 6:52 | core | — | T04 id ≠ meaning, T07 intuition |
| A13 | 20250818_How-AI-Turns-Words-Into-Vectors-Embeddings | BlackBoard AI, 3:34 | core | — | T04 one-hot vs lookup |
| A14 | 20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product | SH AI Academy, 6:13 | core | — | T02 metric choice, unit-vector identity |
| A15 | 20260228_How-To-Choose-An-Embedding-Model-By-Task | Byte Goose AI, 20:57 | core | 11: 7/4/–/0 | T08 choosing models, T20 RAG practice |
| A16 | 20260523_Learn-Text-Embeddings-In-20-Minutes | Thu Vu, 19:56, iwd | core | 10: 7/3/–/0 | T07 static vs contextual, count methods |
| A17 | 20260530_Vector-Search-And-HNSW-Explained-Visually | Satyajit Das, 8:22 | core | — | T19 intuition end to end |
| A18 | 20260615_Vector-Embedding-Build-LLM-From-Scratch | SOFAR, 13:56 | supporting | — | T15 GPT vocab/dims, gensim demo |
| A19 | 20260628_HNSW-Explained-From-Scratch | AI Is All You Need, 61:04, iwd | core | 9: 2/6/0/1 | T19 HNSW algorithm + code |
| A20 | 20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More | Syntax (CJ), 51:48, iwd | core | 33: 17/10/2/4 | whole pipeline, T14 sampling, T15 params, T16 |
| A21 | 20260727_How-To-Fine-Tune-Any-AI-Model-Locally | Tech With Tim, 41:06, iwd | core | 15: 4/9/0/2 | T17 fine-tuning, T18 memory, T21 |
| A22 | 20260731_Build-ColBERT-Search-Locally-With-Qdrant-Edge | HiDevs, 16:52 | supporting | 5: 4/1/0/0 | T20 multivector setup, rerank pattern |
| A23 | 20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work | NitMonk, 39:56 (Hindi) | core, with care | 5: 4/1/0/0 | T03 cost, T14 temperature (several errors) |
| A24 | 20260928_Stanford-CME295-Lecture-1-Transformers | Stanford, 1:44:28, iwd | core | 16: 12/4/0/0 | T10–T13 rigorous transformer |
| A25 | 20260930_Multivector-RAG-Demo-Coded-By-Opus-5-5-Extra | Vishal Bakshi, 39:22 | core | 7: 3/4/0/0 | T20 full RAG, T18 int8/binary numbers |
| A26 | 20261008_Training-Your-Own-Embedding-Model-Is-Not-As-Hard-As-You-Think | Prompt Engineering, 12:36 | core | 8: 7/1/0/0 | T09 embedding fine-tuning, T23 eval |
| A27 | 20261008_Vector-Databases-Are-Dead-Use-This-Instead | Devsplainers, 8:29 | core | 18: 11/7/0/0 | T21 architecture choice, cost |

Topic codes used below: T01 vectors · T02 metrics · T03 tokenization · T04 ids → one-hot → lookup · T05 learned word embeddings · T06 latent space · T07 static vs contextual · T08 embedding models · T09 training embedding models · T10 RNN → attention history · T11 self-attention · T12 the block · T13 encoder/decoder · T14 generation · T15 parameters · T16 training lifecycle · T17 fine-tuning practice · T18 quantization · T19 vector search · T20 RAG · T21 choosing an approach · T22 tools/agents · T23 evaluation · T24 history · T25 limits and cost.

Coverage by tier (counted from the table): 16 core, 6 supporting, 4 background, plus A23 "core, with care" = 27. No file is dropped. Background files feed Part I and the vector-search part only.

## 4. Structure of the manual (12 parts + appendices)

| part | Thai title (draft) | topics | primary sources | ZVect lessons linked | status |
|---|---|---|---|---|---|
| 0 | วิธีอ่านคู่มือนี้ | labels, number rule, how refs work | — | — | write in T2 |
| I | เวกเตอร์ที่ต้องรู้ก่อนเริ่ม | T01, T02 | A14, A02, A01 | 1.1–1.5, 2.1–2.3 | ready |
| II | จากข้อความเป็นตัวเลข: Token | T03 | A06, A05, A20, A24 | 3.1–3.4 | ready |
| III | Embedding: ตัวเลขที่มีความหมาย | T04–T07 | A13, A10, A12, A16, A24, A20 | 4.1–4.7 | ready |
| IV | ภายใน Transformer | T10–T13, T15 | A24, A20, A10 | 9.1, 9.2, 10.1–10.4 | ready |
| V | LLM สร้างคำตอบอย่างไร | T14, T15 | A20, A23, A24 | (new idea `WIP202610023`) | ready; KV cache/top-k = gap G3 |
| VI | ชีวิตของ LLM: pre-train → SFT → RLHF → tools | T16, T22, T24 | A20 (thin), A06, A24 | — | v1 overview only; full chapter blocked by G1, G2, G7 |
| VII | Fine-tuning ในทางปฏิบัติ | T17, T18 | A21, A06, A26 | — | ready; LoRA math = gap G8 |
| VIII | Embedding model สำหรับงานค้นหา | T08, T09 | A15, A26, A16, A07, A04 | 4.6, 8.1, 8.3, 8.4 | ready |
| IX | ค้นให้เร็ว: Vector search | T19 | A17, A19, A04, A08 | 5.1–5.5, 6.1–6.4, 7.1–7.5 | ready |
| X | RAG ตั้งแต่ต้นจนจบ | T20 | A15, A25, A07, A22, A17, A27 | 8.2, 8.3 (+ `WIP202610036`) | ready; hybrid/BM25 = gap G6 |
| XI | เลือกทางไหน: prompt, RAG, fine-tune หรือ agent | T21, T22 | A27, A21, A26 | — | ready (agent detail = G7) |
| XII | วัดผล ต้นทุน และกับดัก | T18, T23, T25 | A25, A26, A21, A04, A15, A06, A27, A11 | 6.3 | ready |
| App. A | อภิธานศัพท์ TH/EN | all | all | — | built from §6 terms |
| App. B | ตารางตัวเลข (N) | all | §7 | — | built in T2 |
| App. C | ข้อที่แหล่งขัดกัน (C) | all | §8 | — | built in T2 |
| App. D | เส้นเวลา | T24 | A20, A24, A19 | — | ready |
| App. E | แหล่งอ้างอิง | all | §3 + source ids in `web/js/sources.js` | — | from §3, reusing the lesson source ids |

**Why this order:** each part answers the question the previous part raises. Text is numbers (II) → numbers need meaning (III) → meaning depends on context (IV) → context feeds the next token (V) → how a model gets that way (VI) → how to change it (VII) → the same vectors also serve search (VIII–IX) → search feeds the model (X) → how to choose (XI) → how to know it works and what it costs (XII). VIII–X reuse I–III, which is where ZVect's own strength (vector search) meets LLMs.

## 5. Chapter plans with deep references

Each part lists its sections, what each says, the exact aimd lines to write from, the lessons to link, and the corrections that must be applied (C-ids, §8). Number ids (N-ids) point to §7.

### Part 0 — วิธีอ่านคู่มือนี้

- **Intro: an LLM is a next-token predictor.** Shannon's next-letter game; LLMs are statistical models of what comes next (A20 L15). The final softmax over the vocabulary is the prediction (A24 L28; A20 L27–L28). This is the destination; Part V explains it.
- Labels used in the book (ต้นฉบับ / ผลตรวจของผู้จัดทำ / ผู้จัดทำ / ความรู้ทั่วไป) and the rule that numbers are either a source's number or recomputed by us.
- How to read a citation (report link + timestamp for readers; aimd line in an HTML comment for the checker, §10).
- The four toy feature tables are analogies, and real dimensions are learned (C18). This is said once here, then referenced.

### Part I — เวกเตอร์ที่ต้องรู้ก่อนเริ่ม (T01, T02)

1. **A vector is a list and an arrow.** Three views and coordinates as walking instructions (A01 L9–L15). Add tip-to-tail and scale (A01 L17–L19, worked table L30–L36). Link {#vector} {#vector-ops}.
2. **Length, dot product, matrix.** None of the A-files teaches these well; A01 stops at add and scale (A01 gaps). Write from lessons 1.2, 1.5, 2.2 (labelled as our lessons). Use dot product as the side-of-hyperplane test (A08 L12–L13) as the bridge to search.
3. **Three ways to say "close".**
   - Cosine from word counts (A02 L12–L19, verified table L31–L40). Its 0–1 range holds only for counts (A02 L72, C3).
   - The three metrics with ranges and costs (A14 L9–L12). "0 = unrelated" is a common slip (C29).
   - Unit-vector identity ‖â−b̂‖² = 2 − 2cos θ, so all three rank alike (A14 L13, L164).
   - Decision procedure (A14 L113–L119) and the same three points ranked differently (A14 L149–L153; colours A03 L29–L37).
   - Zero-vector trap (A14 L82–L98, C21).
4. **High dimensions.** Distances concentrate for both metrics (A14 L14, L165; C5). Use ZVect lesson 6.2's own numbers and name the generator (REFERENCE note on 6.2). Link {#high-dimensions}.
5. **Cosine similarity vs cosine distance** — read the direction (A16 L26, L85 vs A18 L19; C4).

### Part II — จากข้อความเป็นตัวเลข: Token (T03)

1. **Why tokens.** Machines need integers (A05 L10). Word, character and subword trade-offs (A05 L11–L15, L101–L105; A24 L18, comparison table L66–L70). Subword algorithms: BPE (GPT), WordPiece (BERT), Unigram (T5) (A05 L15). Link {#tokenize}.
2. **BPE by hand.**
   - Training loop (A05 L16, L26–L30) and the worked corpus "fred fed ted…" (A05 L17–L20). Use the **corrected** counts and ids (A05 L69–L79, C14).
   - A second worked trace, "the cat sat on the mat" in 7 merges (A20 L21), and the regex pre-split reason (A20 L21). Use the repo merge limit (C27).
   - Encoding new text (A05 L21, L30). Link {#bpe}.
3. **Byte-level BPE as GPT does it.**
   - Unicode and UTF-8, and why bytes (A06 L14–L15).
   - Toy aaabdaaabac (A06 L17). Blog run: 24,597 bytes → 19,438 tokens, 1.27× (A06 L18–L19, N4).
   - Decode with errors="replace" (A06 L21). Encode by lowest merge rank (A06 L22).
   - GPT-2 / cl100k regex (A06 L23–L24).
   - Code: A06 L35–L75 (Python), A05 L33–L65. Link {#gpt-tokenizer}.
4. **Special tokens and vocabulary size.**
   - `<|endoftext|>`; GPT-2 = 256 + 50,000 + 1 = 50,257 (A06 L26, N1); chat tokens and FIM (A06 L26).
   - [UNK]/[BOS]/[EOS]/padding (A24 L19).
   - Vocabulary size lives only in the embedding table and lm_head; why not huge (A06 L29); current sizes ~100k–256k (A24 L19, L82; N2).
   - sentencepiece and byte_fallback (A06 L28). Unknown characters: byte-level has none (C15).
5. **Tokens cost money and context.**
   - ~4 characters per token (A23 L13, N5).
   - Per-token pricing (A20 L20; A23 L14).
   - Same data: JSON 116 vs YAML 99 tokens (A06 L31). Korean takes many more tokens than English (A06 L12).
   - Why some languages cost more: the tokenizer's training mix decides how densely each language is merged (A06 L20); Korean ≈ 3× English (A06 L31). Thai is not measured in any source (gap G12, D7).
   - Practical advice: reuse GPT-4's tokens via tiktoken; if training your own, sentencepiece BPE with Meta's settings, carefully (A06 L6, the TL;DR that L32 points to).
   - Chunk sizes depend on the tokenizer (A07 L20).
6. **When tokens break the model.** Spelling, reversal and arithmetic failures, special tokens as an attack surface, trailing-space and partial-token effects, SolidGoldMagikarp (A06 L31). Link {#token-id}.

### Part III — Embedding: ตัวเลขที่มีความหมาย (T04–T07)

1. **An id is not a meaning.**
   - Toy ids: good 6 / bad 22 / great 21 with false closeness (A10 L10; computed distances A10 L34–L40).
   - Sentence ids (A12 L12).
   - Same word, different ids by case and spacing (A06 L12).
2. **One-hot and its limits.** Size = vocabulary, every pair orthogonal, cosine 0 and distance √2 (A13 L9, L41; A10 L11; A24 L20). Link {#one-hot}.
3. **Count methods and why they were not enough.** Bag of words, n-grams, TF-IDF, and the four failures with examples (A16 L16–L17; A10 L12; A02 L72 sentiment numbers). Link {#bag-of-words}.
4. **The embedding matrix is a lookup table.**
   - V × d, e.g. 50,000 × 300 ≈ 60 MB float32 (A13 L10, L35–L37; N6).
   - Lookup = one-hot × E (A13 L11, L19, L42; A10 L20, L26–L32; A09 L16, L22–L23).
   - Rows = vocabulary, not context window (C1).
   - Formula E ∈ R^{|V|×d}, x_t = E[id_t] (A23 L33). Link {#embedding-matrix}.
5. **Where the numbers come from: word2vec.**
   - Distributional idea: "1950s linguists" and the ong choy example (A16 L19); names and years Joos 1950, Harris 1954, Firth 1957 from the fact-check (A16 L75, ผลตรวจ); Firth 1957 also spoken at A20 L22.
   - Network layer by layer (A09 L10–L16, math L22–L28).
   - CBOW and skip-gram (A10 L18–L21; A16 L23; A24 L20 proxy task with V = 6, p(cute) = 0.4).
   - Negative pairs (A20 L23, L52; window values C28); 2013a vs 2013b (C17).
   - Values come from training, not from BPE (C2). Link {#learn-table}.
6. **Latent space and analogies.**
   - Toy integer analogy (A12 L11, L20–L22).
   - Toy-model numbers (the speaker's own small skip-gram): queen–king 0.92 and analogies 0.84 / 0.86 (A20 L23, N9); pretrained Google News word2vec: yen − Japan + India → rupee 0.6192 and king–queen 0.6511 (on screen A18 L51–L54; spoken A18 L17–L19; N10).
   - "Embeddings map where meanings sit relative to each other" (A12 L15).
   - Dimensions are not interpretable (C18). PCA to 2-D (A10 L17). Link {#latent-space}.
7. **Static vs contextual.**
   - Polysemy: bank, apple, "she" (A12 L14; A23 L26; A16 L24).
   - word2vec limits: unseen words, polysemy, word order (A24 L20).
   - Comparison tables (A16 L63–L69; A23 L51–L57).
   - The fix is self-attention (A20 L25), which bridges to Part IV. Link {#contextual}.
8. **The embedding layer inside an LLM** is trained jointly with the model, not by word2vec (A10 L22). Positions are added with the shape unchanged (A10 L23). GPT-1/2/3 vocabulary and widths (A18 L15, L46–L48; N3). Separate LLM hidden size from embedding-API output size (index note: A18 L15 vs A16 L20). Link {#llm-input}.

### Part IV — ภายใน Transformer (T10–T13, T15)

1. **Before transformers.**
   - One model per task in the 2010s (A24 L17). RNN hidden state, long-range failure, LSTM, vanishing gradient, sequential = slow (A24 L21).
   - Attention 2014 (A24 L22; A20 L24). 2017 history (A20 L24, with the citation count corrected at A20 L87). Link {#transformer-why}.
2. **Self-attention.**
   - Q/K/V in plain words (A20 L25). Σ sim(q, kᵢ) vᵢ (A24 L23).
   - Matrix form softmax(QKᵀ/√d_k)V and the board derivation (A24 L23). Shapes and why √d_k (A24 L27, N12).
   - Dot product as query·key with numbers 0.70 / 0.23 (A14 L12, L67–L80, corrected).
   - Common mistakes to avoid (C9: A23 L25; A20 L91 "Q·K gives the value").
   - Code A24 L32–L44. Link {#attention} {#self-attention}.
3. **Positions.** Learned (cannot exceed trained length) vs sin/cos (clock hands) (A24 L24). Formula: A24 L49 (ความรู้ทั่วไป — the lecture showed the idea, not the formula). Learned vs sinusoidal BLEU 25.7 vs 25.8: A24 L82 (ผลตรวจของผู้จัดทำ). A20's positional explanation is wrong (C8). Link {#position-encoding}.
4. **The block.**
   - Multi-head + W_O, FFN d_ff > d_model, residual, layer norm, dropout, label smoothing (A24 L26–L27).
   - Paper base config d_model 512, h 8, d_ff 2048, N 6 (A24 L49, N12, labelled ผลตรวจ).
   - "Most parameters in the FFN": true per layer (2.1M vs 1.05M) and in large LLMs; ~39% of the 2017 base model because of its large embeddings (C10, A24 L81). Link {#transformer-block}.
5. **Encoder, decoder, cross-attention.**
   - Decoder: [BOS] → masked self-attention → cross-attention (Q from decoder, K/V from encoder) → FFN → vocab (A24 L25).
   - Mask with −∞ (A24 L28, L42). End-to-end translation (A24 L27).
   - GPT-style = decoder-only: the speaker's GPT-like toy is a `decoder-transformer` (A20 L36) and A10 L22 describes the transformer decoder; A24 L86 adds it as an author note. Modern variants are gap G4.
6. **A model is a file of numbers.**
   - XOR 3 vs 17 parameters (A20 L19, L50).
   - Toy config and the parameter formula 2VD + V + CD + 2D + L(4D² + 2DF + 9D + F) → 102,792 (A20 L36–L39, N13). Token + position embeddings (2VD + CD = 26,112) are about a quarter of the params at L = 6 and about half at L = 2 (ours, recompute in T2).
   - Real sizes: gpt-oss-120b 117B total / 5.1B active (A20 L67, L85, N14).
   - Layer specialisation claims are unsupported (C20).
7. **How a model learns: loss → gradient → adjust the weights.** The training loop that Parts III, VII and VIII rely on.
   - Backprop 1986: predict, measure the error, propagate it back, adjust, repeat (A20 L18).
   - XOR demo: random start, iterations, a single layer fails while 2-4-1 succeeds, the result is a weights file (A20 L19, L50).
   - Cross-entropy pushes p(cute) = 0.4 toward 1, then weights are updated, repeated over the corpus (A24 L20).
   - Weights start random and are nudged until words in similar contexts drift together (A23 L19; A10 L16; A18 L16). Network math h = W1ᵀx → softmax → cross-entropy (A09 L22–L28).
   - Training signals in practice — loss, learning rate, gradient norm (A21 L24) — are linked forward from VII.6 and VIII.5.

### Part V — LLM สร้างคำตอบอย่างไร (T14, T15)

1. **From the last vector to a probability per token.** logits = h W_outᵀ, softmax (A23 L35; A24 L28 "attention softmax vs final softmax"). From A23 only the corrected playbook lines L33–L35 are used; its spoken framing is C31.
2. **Temperature.** Low = predictable, high = creative (A20 L27). p = softmax(logits / T); T = 0 = argmax in principle (A23 L35). Real services are not bit-identical even at T = 0; the API range is 0–2 (C7).
3. **Top-p done right.** On-screen distribution and cumulative sums (A20 L27, N15). Correct nucleus rule; p = 0.2 → {there}, p = 0.5 → {there, the, a} (A20 L41, code L42–L49; C6). Top-k is not in any source (G3).
4. **The autoregressive loop and the context window.** Append and rerun, no plan, no memory between requests; system prompt + history are resent; 32 vs 100,000+ tokens (A20 L28). Toy children's-story model (A20 L26). Link: proposal `WIP202610023` (softmax/temperature/top-p widget) as the matching lesson.
5. **What it costs.** Tokens in and out set price and latency (A20 L20; A23 L13–L14). Long chats "might" degrade (A20 L28, hedge kept). KV cache, batching and quadratic attention cost are gap G3, flagged in a box.

### Part VI — ชีวิตของ LLM: pre-train → SFT → RLHF → tools (T16, T22, T24) — overview in v1

What exists today:
- Pre-training on web-scale data → "fancy autocomplete", SFT on curated Q&A, RLHF with ranked responses (A20 L29).
- Chat special tokens (A06 L26). Adding tokens = model surgery (A06 L26, L29).
- Tool calling as JSON emitted by the model and run by a harness (A20 L30). MCP connectors (A27 L16, L57).
- History: A20 L15–L18, L24, L31; A24 L17; corrections in A20 L85.

v1 ships VI as a 1–2 page **overview** from these lines plus A06 L10 (Llama 2 on 2T tokens) and A06 L20 (tokenizer trained first; LLM on pre-tokenized data), under the strict source rule and marked "จะขยายหลังอ่าน G1, G2, G7". The full chapter waits for those sources (§9). App. D carries the history.

### Part VII — Fine-tuning ในทางปฏิบัติ (T17, T18)

1. **What fine-tuning changes.** Start from a capable model; teach domain, tone and format (A21 L16).
   - LLM fine-tuning has an exact target text; embedding fine-tuning only says what should be close (A26 L10, L57–L61). This contrast bridges to Part VIII.
2. **LoRA.**
   - Frozen base, trained adapters ("shrink / grow back") (A21 L17).
   - Our arithmetic: r16 on Llama-3.1-8B = 41,943,040 ≈ 0.52%, ≈ 84 MB; r32 ≈ 1.04% (A21 L17, L120; N16).
   - Rank and alpha values on screen and in the docs (A21 L37, L129). The written form W + BA and the alpha/r scaling are not in any aimd: one labelled ความรู้ทั่วไป line (G8).
3. **QLoRA and memory.**
   - 4-bit NF4 base + 16-bit adapters (A21 L18). Memory arithmetic 16.06 GB → ~5.6 GB → repo 5.98 GB (A21 L18, N17).
   - Quality: slide vs speaker vs paper (A21 L18, L111, L121).
   - VRAM: three disagreeing sources (C11). GGUF sizes (A21 L40, N18).
4. **Hardware and choosing a base model.** NVIDIA ≥ 12 GB, Mac M-series via MLX, Colab T4, CPU = no training (A21 L20, L123). GGUF cannot be fine-tuned; pick a "fine-tune ready" safetensors model, pre-quantized bnb-4bit (A21 L21). Speaker's VRAM guide vs Unsloth's minimums, 1.7–2.4× apart (A21 L21, L126; N19). Instruct vs base by data size (A21 L125).
5. **Data.**
   - instruction / input / output (A21 L22, JSONL row L31–L33). Roles system/user/assistant (A21 L36).
   - Size tiers are the speaker's; Unsloth gives min 100, >1,000 preferable (A21 L22, L128; C12).
   - Synthetic data with Recipes (A21 L23, L35) and the vocabulary gate (A21 L70–L76).
6. **Training and reading the loss** (concept from IV.7).
   - Hyperparameters on screen vs docs defaults (A21 L37, L129). Signals (A21 L24, L38).
   - Overfitting: loss < 0.2, export checkpoint 0.0582 (A21 L130, L136; C13).
   - Evaluate on held-out data (A21 L135; A26 L17).
7. **Export.** Merged 16-bit, LoRA-only (~100 MB), GGUF (Q4_K_M ~4.6 GB) (A21 L40, L131). Install and run (A21 L28–L29). Python equivalent, marked as author-written (A21 L43–L68).
8. **What can go wrong.** Wrong answer after fine-tuning ("alone = sama"), with the cause analysis (A21 L132, L137; C13 box). Unsloth is not built by NVIDIA engineers (A21 L119; ผลตรวจ).

### Part VIII — Embedding model สำหรับงานค้นหา (T08, T09)

1. **The model sets the ceiling.** (A15 L9.) Same model for query and documents (A03 L16, L21–L25). Link {#same-model}.
2. **Bi-encoder vs cross-encoder vs late interaction.**
   - Bi-encoder vs cross-encoder costs and the ~10,000 → 10–100 pipeline (A15 L14; C24 cost framing A15 L72).
   - Dense vs ColBERT vs cross-encoder table (A07 L53–L59). Link {#bi-encoder} {#reranker}.
3. **Choosing a model.**
   - Leaderboards (MTEB) hide operational needs (A15 L15, L30; MTEB size A16 L81).
   - Task → model table (A15 L50–L60). Dimensions and RAM: 100M × 3,072 × 4 B = 1,228.8 GB (A15 L34, N22).
   - Matryoshka (A15 L27, corrected L71; C16). OpenAI dims 1,536 / 3,072 (A16 L73; A23 L17; N7).
   - BGE-M3, Qwen3-Embedding-8B, EmbeddingGemma (A15 L26, L28, L68–L70; dated facts, §10 R3).
   - Classification/clustering need linear separability; small encoders often beat large generic models (A15 L25).
   - Who offers embedding APIs: OpenAI, Mistral, open models; Anthropic has none (A16 L25, confirmed L80).
4. **Prompt format matters.** EmbeddingGemma 2 query/document templates (A26 L14, L30).
5. **Training your own.**
   - Pairs and in-batch negatives, MNRL, the false-negative trap and NO_DUPLICATES (A26 L11–L13, L32).
   - Loss formula (A26 L36, ความรู้ทั่วไป — not shown in the video); the loss idea is introduced in IV.7. LoRA < 2% (A26 L15). Eight-step recipe (A26 L28–L35).
   - When to fine-tune: off-the-shelf for general domains, hard negatives only for technical, high-stakes ones (A15 L29; A26 L63).
6. **Results and side effects.**
   - ESC-50 top-1 24.5% → 65.8% (A26 L19–L20, N23). Held-out labels do not improve (A26 L21).
   - General text −3.6 nDCG@10 (A26 L22). Reload bug (A26 L23). Text run 66.3% → 75.0% (A26 L24, description-only number).
7. **Known blind spots.**
   - Numeracy gap: 54% average (A15 L22–L23, L66; N24).
   - Negation bias (A15 L20). Out-of-vocabulary words in static models (A18 L18).

### Part IX — ค้นให้เร็ว: Vector search (T19)

1. **The problem.** One million articles, zero shared keywords (A17 L9–L13). Keyword index misses synonyms (A17 L11). Brute force = 1M distances per query (A17 L13). Link {#brute-force} {#keyword-vs-meaning}.
2. **Approximate on purpose.** KNN vs ANN (A19 L16). Indexes are approximate and non-deterministic (A04 L18).
3. **Trees.** Hyperplane split, ~9 steps vs 1,000 comparisons, and the 111× caveat (A08 L11–L15, C23). Own runs: one tree finds the true neighbour ~70–75%, a 10-tree forest 100% (A08 L41–L47). Code A08 L20–L39. Link {#ann-tree}.
4. **Graphs: NSW → HNSW.**
   - Greedy walk (A17 L14; A19 L18–L19). Layers as highways (A17 L15).
   - Query with ef (A17 L16; A19 L20–L23; the ef = 1 trace A19 L67). Best-first, not breadth-first (C30).
   - Build by coin flip p ≈ 1/M (A17 L17; A19 L25–L27); layer populations N·(1/M)^k (A17 L23–L31, N25).
   - Degree caps M / 2M (A19 L29; A17 L57). Rationale for 1/M (C19). Code A19 L32–L65.
   - Links {#graph-walk} {#hnsw-beam} {#hnsw-build}.
5. **Running it in production.**
   - Segments, WAL, copy-on-write (A04 L13–L17). HNSW needs RAM; insertion ≈ 2× a search (A04 L19–L20).
   - Filtering: post-, pre- and in-place filtering (A04 L22). Percolation 1 − 1/k (A04 L23, L32; N26). Payload subgraphs (A04 L24–L27). Link {#filter-graph}.
6. **Vector index vs database vs "just Postgres".**
   - Index vs DB (A03 L17, L56–L62). DBs store, they do not embed (A23 L24).
   - BASE vs ACID (A04 L14, L29). pgvector thresholds (A27 L19, L51; C22). Vectors as one index beside keyword and filters (A27 L10).

### Part X — RAG ตั้งแต่ต้นจนจบ (T20)

1. **Baseline pipeline.** Chunk → embed → store → embed query → top-k → LLM (A15 L12; A17 L19; A03 L16).
2. **Why RAG helps, measured.** Faithfulness 0.347 no retrieval → 0.621 basic → 0.797 advanced with reranker (A15 L67, N27; C24).
3. **Chunking.** Single-vector compression loses detail (A07 L12; A22 L10). 500–800 tokens with 10–20% overlap, keep headers, negation split (A15 L17). Tokenizer-dependent chunk lengths (A07 L20). General chunking is gap G9.
4. **Retrieve wide, rerank narrow.**
   - Query expansion, top 20–40 (A15 L19). Negation filter (A15 L20).
   - Retrieve-then-rerank (A22 L21, L28). A reranker beat an agent at ranking (A27 L13, L53).
5. **Late interaction.**
   - MaxSim formula (A07 L26; A22 L27). Contextual token vectors (A07 L14; A22 L11).
   - Qdrant multivector config (A22 L14). Storage cost (A07 L37; A25 L20).
   - [MASK] tokens dominate scores (A25 L11, L84). Link {#late-interaction}.
6. **A complete small RAG in the browser.** Pipeline, binary MaxSim and a 350M generator with citations (A25 L6, L12, L14, L21). Recipe A25 L26–L35.
7. **Keyword vs vector inside the loop.** BM25 68.8 vs vector 51.4 on enterprise IDs; vectors win on BrowseComp-Plus 70.1 vs 55.9 (A27 L14–L15, N28). "Customer IDs need equality" (A27 L14). Hybrid fusion (RRF) is gap G6.
8. **Structured output and numbers.** JSON/FHIR schema output (A15 L21). Handle numbers outside embeddings (A15 L23).
9. **Outlook.** GraphRAG, embeddings fused with knowledge graphs (A15 L31) — a pointer only.

### Part XI — เลือกทางไหน: prompt, RAG, fine-tune หรือ agent (T21, T22)

1. **Three levers.** Prompting / RAG / fine-tuning table (A21 L100–L104, L113). Speaker: fine-tuning changes weights, RAG adds fresh data to the prompt; slide: RAG for hourly-changing data and cited answers, serious systems use both (A21 L19).
2. **Can fine-tuning add knowledge?** Speaker "yes" (A21 L19) vs Unsloth "mostly" vs Ovadia 2023 and Gekhman 2024 (A21 L122; C12). The "alone" example as illustration (A21 L132, L137).
3. **One-shot RAG vs agentic search.**
   - A reranker cannot decide "nothing is good" (A27 L11). FRAMES 92.7 vs 78.9 (A27 L12, L52; N29).
   - Cost ~3× and long tails; LREC numbers (A27 L13, L53). Vendor-benchmark caveat (A27 L14–L15, L52, L58).
4. **Connectors and compiled knowledge.** Live MCP connectors and their costs (A27 L16–L17, L57–L58). Compiled wiki cost ~100× (raw 645×) (A27 L18, L59).
5. **Decision guide.** A27 L19 and L38–L46, merged with A21 L113 and A26 L63 into one table: hops per question, data volatility, need for citations, budget, latency tolerance.

### Part XII — วัดผล ต้นทุน และกับดัก (T18, T23, T25)

1. **Measuring retrieval.**
   - recall@k, nDCG@10, R@100 (A25 L15; A11 L15; A26 L33). Split by source, not by passage (A26 L17, L29).
   - Two-way mismatch counts (A11 L16, L27; C25). Toy-benchmark caveats (A07 L62–L63; A22 L52–L53).
2. **Measuring an LLM or a fine-tune.** Held-out sets; loss alone is not quality (A21 L130, L135). Run-to-run controls (A11 L21, L28). LLM-output evaluation (judges, benchmarks) is gap G5.
3. **Quantization in numbers.**
   - Memory per format: 1M × 1,536: float32 6.14 GB, int8 1.54 GB, binary 192 MB (A04 L32, N30). Binary 32× smaller with rescoring (A04 L21).
   - SciFact table: int8 free, binary docs −3.62, binary both sides −14 (A25 L15, L36, L59; N31).
   - Asymmetric trick 2·Σ(q|bit=1) − Σq (A25 L13, L18). fp32 vs mixed precision (A11 L6, L13–L17; weak, C25).
   - GGUF levels (A21 L40). Link {#binary-xor}.
4. **Money and latency.** Token pricing (A23 L13–L14; A20 L20). Agent ~3× (A27 L13). Connector $2.98 vs $0.58 per task (A27 L17, L58). Embedding cost $0.02 / 1M tokens (A27 L15).
5. **Failure catalogue.**
   - Tokenizer quirks (A06 L31). Numeracy (A15 L22). Negation (A15 L20).
   - Overfitting and wrong answers after fine-tuning (A21 L130–L137). Embedding fine-tune side effects and the reload bug (A26 L21–L23).
   - Context-window degradation (A20 L28). Pattern-matching critique, labelled as opinion (A20 L31). Prompt injection and safety are gap G10.

### Appendix D — เส้นเวลา (T24)

McCulloch & Pitts 1943 · Shannon 1950 · Turing 1950 · Dartmouth proposal 1955 / workshop 1956 · perceptron 1958 · ELIZA 1966 · Minsky–Papert 1969 · backprop 1986 (A20 L15–L18, L31, with C-fixes from A20 L85) → word2vec 2013 (A20 L22; A24 L20) → attention 2014 (A24 L22) → HNSW 2016 (A19 L98) → transformer 2017 (A20 L24; A24 L17) → ChatGPT Nov 2022 (A24 L17) → coding agents 2026 (A24 L17).

## 6. Terms to fix once (glossary seeds)

These terms are spelled differently across sources or in ASR. Fix one Thai/English form, add it to App. A, and check it in T2.

- token / token id / vocabulary (คลังคำ)
- embedding / embedding matrix / lookup
- cosine similarity vs cosine distance
- context window vs vocabulary size (C1)
- d_model vs embedding output dims
- MaxSim / late interaction
- ef / efSearch / efConstruction / M / Mmax0
- LoRA rank / alpha
- NF4 / Q4_K_M / int8 / binary
- recall@k / nDCG@10
- bi-encoder / cross-encoder / reranker
- SFT / RLHF / instruction tuning
- MCP / connector / agentic search
- logits / softmax / loss (cross-entropy) / epoch
- in-batch negative / hard negative
- percolation (graph disconnection under filters)

## 7. Canonical numbers (table N, seeds for App. B)

"source" = the source's own number (cite it as such). "ours" = recompute with a script before printing (§5a law 1). The script column names the file to write in T2 (`tools/manual-numbers.*`, one function per row).

| N | value | where | kind |
|---|---|---|---|
| N1 | GPT-2 vocab 50,257 = 256 + 50,000 + 1; context 1,024 | A06 L10, L26 | source (spoken + paper) |
| N2 | vocab sizes: cl100k ~100k, o200k ~200k, Llama 3 128k, Gemma 256k | A06 L13; A24 L82 | source (spoken, A06 L13) + fact-check (A24 L82) |
| N3 | GPT-1 ~40k / 768; GPT-2 50,257 / 768–1,600; GPT-3 ~50,257 / 12,288 | A18 L15, L46–L48; A20 L22 | source + fact-check |
| N4 | 24,597 bytes → 19,438 tokens (1.27×) with 20 merges | A06 L18–L19 | source (screen); ours only for the ratio 24,597 / 19,438 = 1.265 (the blog text is not in the repo; to demo A06's code, run it on a fixed in-repo text and print our own numbers) |
| N5 | ~4 characters per token | A23 L13 | source rule of thumb |
| N6 | 50,000 × 300 = 15M numbers ≈ 60 MB float32 | A13 L10, L37 | ours |
| N7 | OpenAI embeddings: ada-002 1,536; 3-small 1,536; 3-large 3,072 | A16 L73; A23 L17 | fact-check |
| N8 | Google News word2vec 3,000,000 × 300 | A18 L17 | source |
| N9 | toy skip-gram: queen–king 0.92, analogies 0.84 / 0.86 | A20 L23 | source (speaker's demo) |
| N10 | yen − Japan + India → rupee 0.6192; king–queen 0.6511, king–man 0.2294 | spoken 61.9% / 65% / ~22%: A18 L17–L19; on-screen 4-decimal values: A18 L51–L54 | source (spoken + screen) |
| N11 | toy attention dot products 0.70 / 0.23 (slide said 0.69 / 0.15) | A14 L67–L80 | ours (corrected) |
| N12 | Transformer base: d_model 512, h 8, d_k 64, d_ff 2048, N 6+6, dropout 0.1, LS 0.1; BLEU 41.8 / 28.4; PE 25.7 vs 25.8 | A24 L49, L82 | fact-check (paper) |
| N13 | toy decoder params 102,792 (L = 6) / 51,976 (L = 2) | A20 L36–L39 | ours with the formula |
| N14 | gpt-oss-120b: 117B total, 5.1B active | A20 L67, L85 | fact-check |
| N15 | next-token distribution there 0.30, the 0.16, a 0.12 … | A20 L27 | source (screen) |
| N16 | LoRA r16 on Llama-3.1-8B: 41,943,040 ≈ 0.52%, ≈ 84 MB; r32 ≈ 1.04% | A21 L17, L120 | ours; the script needs Llama-3.1-8B shapes not stated in aimd (KV width 1,024, FFN 14,336), kept as constants labelled "HF config (ความรู้ทั่วไป)" with the source |
| N17 | 8B: 16.06 GB 16-bit → ~5.6 GB est. 4-bit → 5.98 GB actual repo | A21 L18 | ours (same labelled HF config constants as N16) + HF fact |
| N18 | GGUF 8B: Q4_K_M ~4.6 GB, Q8_0 ~8.2 GB, BF16/F16 ~15 GB | A21 L40 | source (screen) |
| N19 | VRAM 8B: slide LoRA ~20 / QLoRA ~10 GB (estimate); Unsloth 22 / 6 GB (minimum); 16.77 GiB **used** on a 24 GB card at ctx 2048, not a minimum | A21 L18, L38, L85, L126, L138 | three different questions, labelled (C11) |
| N20 | loss guide 0.5–1.0 good, < 0.2 overfit; demo 0.1468 / 0.0582 | A21 L38, L130 | fact-check + screen |
| N21 | LR hints 2e-4 LoRA, 5e-5 CPT, 2e-5 full FT | A21 L37 | source (UI) |
| N22 | 100M × 3,072 × 4 B = 1,228.8 GB; 768 → 307.2 GB; 256 → 102.4 GB | A15 L34 | ours |
| N23 | ESC-50 top-1 24.5% → 65.8%; NanoBEIR 59.2 → 55.6 | A26 L19–L22 | source (spoken + slide) |
| N24 | numeracy: 54% average over 13 models | A15 L22, L66 | fact-check |
| N25 | HNSW M = 16, N = 1M: 62,500 / 3,906 / 244 / 15 / 0.95 at k = 1..5 | A17 L23–L31 | ours |
| N26 | percolation removable fraction 1 − 1/k (k = 10 → 90%) | A04 L23, L32, L54 | ours (slide corrected at A04 L54) |
| N27 | faithfulness 0.347 / 0.621 / 0.797 | A15 L67 | fact-check (paper) |
| N28 | BM25 68.8 vs vector 51.4 (EnterpriseRAG-Bench); 70.1 vs 55.9 (BrowseComp-Plus) | A27 L14–L15, L54–L55 | fact-check |
| N29 | FRAMES agent 92.7% vs best pipeline 78.9% | A27 L12, L52 | fact-check (vendor test) |
| N30 | 1M × 1,536: float32 6.14 GB, int8 1.54 GB, binary 192 MB | A04 L32 | ours |
| N31 | SciFact NDCG@10: fp32 74.18, int8 74.51, fp32 × binary 70.56, binary × binary 60.16 | A25 L15 | source (screen) |
| N32 | one-hot pair: cosine 0, distance √2 ≈ 1.414 | A13 L41; A10 L38 | ours |

## 8. Contradiction register (table C, seeds for App. C)

Each row records which reading the manual uses and why. A chapter that touches the topic must state the preferred reading and may mention the other as "แหล่ง X บอกว่า … แต่ …".

| C | topic | conflict | manual uses |
|---|---|---|---|
| C1 | embedding-matrix rows | A23 L18 "ChatGPT input tokens" vs A10 L20 vocabulary | vocabulary (A23 L80 correction) |
| C2 | where vector values come from | A23 L28 "BPE corrects the numbers" vs A10 L16, A16 L23, A18 L16 training | training |
| C3 | cosine range | A02 0–1 (counts) vs A14 L10 −1..1 | −1..1; 0–1 only for non-negative counts (A02 L72) |
| C4 | cosine reading | A16 L26 distance vs A18 L19 similarity | always say which; distance = 1 − similarity (A16 L85) |
| C5 | high dimensions | A14 L14 "cosine more robust" vs A14 L165 experiment; ZVect 6.2 numbers differ | both concentrate; cite one experiment with its generator |
| C6 | top-p | A20 L27 "top 20% of tokens" | nucleus rule (A20 L41) |
| C7 | temperature 0 / range | A20 L27 "same token every time"; A23 L27 "temperature 3" | T = 0 is argmax in principle (A23 L35); real services are still not bit-identical because of batching and floating-point kernels and because APIs clamp T (repo minimum 0.1) (A20 L85; nondeterminism reference A20 L105; mechanism = ความรู้ทั่วไป); API range 0–2 (A23 L80) |
| C8 | positional encoding | A20 L90 wrong explanation | A24 L24, L49 |
| C9 | attention formula | A23 L25 plain dot product; A20 L91 slip | softmax(QKᵀ/√d_k)V (A24 L23; A23 L34) |
| C10 | parameters in the FFN | A24 L28 "most" vs A24 L81 ~39% overall | both: per layer the FFN is twice attention (2.1M vs 1.05M, A24 L81); ~39% of the 2017 base model only because its shared embeddings are large; with d_ff = 4·d_model the FFN is ~2/3 of the non-embedding parameters, so in large LLMs "most" holds (ours from the paper's shapes / ความรู้ทั่วไป) |
| C11 | VRAM for an 8B fine-tune | slide 20/10 vs Unsloth 22/6 vs measured 16.77 GiB | show all three, each labelled: slide estimate, Unsloth minimum, observed use on a 24 GB card at ctx 2048 (A21 L38); keep the open question A21 L138 |
| C12 | fine-tuning vs RAG for new knowledge | A21 L19 vs A21 L122 (Unsloth "mostly", Ovadia, Gekhman); dataset tiers A21 L22 vs L128 | research view, speaker view labelled |
| C13 | loss interpretation | A21 L24 "< 1 fairly good" vs A21 L130 | Unsloth guide; demo overfit |
| C14 | BPE worked example | A05 slide counts/ids vs A05 L69–L79 re-run | the re-run |
| C15 | unknown tokens | A05 L22 "rare" vs A06 L28, A05 L81 | byte-level has none; sentencepiece needs byte_fallback |
| C16 | Matryoshka | A15 L27 "prioritises first 256" vs A15 L71 | nested losses (A15 L71) |
| C17 | word2vec training | A16 L23 mixes formulations (A16 L78); A09 L12 nonlinear hidden layer vs A09 L29 | 2013a hierarchical softmax / 2013b negative sampling; linear hidden layer |
| C18 | interpretable dimensions | A18 L15, A23 L16 hand features vs A03 L65, A18 L65, A23 L19 | learned, not interpretable (Part 0) |
| C19 | HNSW p = 1/M | A19 L29 "same density" vs A19 L104 paper | minimise layer overlap (paper) |
| C20 | layer specialisation | A20 L25 "late layers reasoning" vs A20 L85 | unsupported; say so |
| C21 | zero vector | A14 slide "crashes" vs A14 L158 NaN | NaN + warning; guard with epsilon |
| C22 | pgvector threshold | A27 L19 10M vs A27 L51 (RIP post < 1M) | give both with sources |
| C23 | tree ANN speed and role | A08 L15 111× and L9 "backbone" vs A08 L70, A04/A17/A19 | 111× excludes leaf checks; HNSW dominant, trees one family |
| C24 | RAG faithfulness / cross-encoder cost | A15 L13 vs L67; A15 L14 "O(n²)" vs L72 | 0.347 = no retrieval; cost = one pass per pair |
| C25 | counts and precision | A11 388 mismatches "14%" vs 7.2% per side (A11 L27); precision vs k-means noise (A11 L28) | per-side figure; no causal claim |
| C26 | ColBERT speed | A22 L9 "keyword-search speed" | ~100× faster than BERT rerankers (paper claim, A22 L9 correction); slower than one dot product (A22 L21) |
| C27 | BPE merge limit (repo) | A20 L21 speaker "10,000" vs repo MAX_MERGES 1000 (A20 L84) | repo value 1000 |
| C28 | word2vec window (repo) | A20 L23 "five or six" vs repo default 2, max 5 (A20 L84) | repo values |
| C29 | cosine 0 meaning | A20 L22 "0 = completely unrelated" vs A20 L85 | 0 = orthogonal; minimum −1 |
| C30 | HNSW search type | A19 L21 "breadth-first" vs A19 L102 | greedy best-first (beam) |
| C31 | how the next token is chosen | A23 L27 "similarity to the last word" (as spoken) vs scores over the whole vocabulary | logits over the vocabulary → softmax (A23 L35; A24 L28) |
| C32 | why not 1M dimensions | A23 L23 "1M × 1M matrix" framing (flagged A23 L80) | the table is V × d (A23 L33); cost grows with d in every layer |

## 9. Gaps (no aimd covers them well) and how to fill them

| G | gap | what exists | blocks | proposed fill (owner picks; iw first, then add to §3) |
|---|---|---|---|---|
| G1 | pre-training at scale: data mix, objective over a corpus, compute | partial: A20 L29 (one line), A06 L10 (Llama 2 on 2T tokens), A06 L20 (tokenizer trained separately; LLM on pre-tokenized data), A18 L16, A24 L16, L28 (course roadmap: training in the next lectures). The training loop itself is covered (IV.7) | Part VI | later CME295 lectures (A24 L27–L28 announce training); a deep-dive talk on how ChatGPT-style models are trained |
| G2 | post-training: SFT loss masking, chat templates, RLHF reward model, DPO | partial: A20 L29; A06 L26; A21 L36, L55–L59 (role mapping, apply_chat_template, author code) | Part VI, VII.5 | CME295 post-training lecture |
| G3 | inference: top-k, KV cache, batching, quadratic attention cost, long context | partial: A24 L18 (cost grows with length), A24 L27 (greedy argmax; sampling next lecture), A15 L72 (attention over combined length), A20 L28 (context window) | Part V.5 | CME295 sampling / inference lecture |
| G4 | modern variants: RoPE, pre-LN, GQA, MoE | decoder-only itself is covered (A20 L36; A10 L22; A24 L86); A20 L30 names MoE | Part IV.5 | CME295 lecture 2 or an architecture survey |
| G5 | evaluating LLM outputs (benchmarks, LLM-as-judge, hallucination measurement) | partial: A21 L135, A15 L67, L73 (RAGAS faithfulness), A27 caveats | Part XII.2 | one evaluation talk/paper |
| G6 | hybrid search: BM25 formula, RRF fusion | partial: A17 L11, A27 L14 (evidence), A15 L28 (BGE-M3 dense + sparse + multi-vector), A15 L23 | Part X.7 | BM25 / hybrid search talk |
| G7 | agents and tool calling: schema, loop, stop rules, MCP | A20 L30, A27 L16 | Part VI, XI | MCP spec / agent-loop talk |
| G8 | LoRA formula: W + BA and the alpha/r scaling | structure in words at A21 L17 (frozen base + correction, A "shrink", B "grow back"); r and alpha values at A21 L37, L129 | Part VII.2 | one labelled ความรู้ทั่วไป line (no iw needed); iw the LoRA paper (arXiv 2106.09685) only if the owner wants more |
| G9 | chunking in general (not clinical) | A15 L17, A07 L20 | Part X.3 | a chunking-strategy source |
| G10 | prompt injection and safety | A06 L31 (special tokens only) | Part XII.5 | a security talk |
| G11 | multimodal tokens and shared spaces | A06 L30, A26 L9, L87 | none (box only) | optional |
| G12 | Thai token cost (tokens per Thai character/word) | A06 L20 (training mix sets merge density per language), A06 L31 (Korean ≈ 3×), A06 L103 author notes on UTF-8 | Part II.5 | **ours, needs D7:** (a) APPROVALS row for tiktoken as a dev-only measuring tool (§5a law 2; it also downloads BPE files at runtime); (b) no dependency: the owner counts a fixed Thai + English text set in a tokenizer web app and we record the counts with the date as a labelled observation; (c) our own small Node encoder over a cl100k_base ranks file (lesson 3.3 already does byte-level merges, A06 L103). Either way it is "measured by us", not a source fact |

Candidate sources in G1–G10 are suggestions to check, not verified links. Each new source goes through iw and gets an A-id before any manual text uses it.

## 10. How it will be built (process, tooling, risks)

**Per chapter (definition of done):**
1. **Outline:** copy the part's section list from §5 into the chapter file, with its refs.
2. **Draft in Thai.** Each paragraph carries an HTML comment `<!-- ref: A24 L23 | anchor: "softmax(QKᵀ" -->`.
   - Readers see a short source line linking to the report (`docs/outhtm/…html`) with a timestamp.
   - Numbers use `{N12}`-style placeholders filled from table N.
3. **Check:** `npm run check:manual` (new, T3) must pass:
   - every ref's file exists, its line range is in bounds and the anchor text is found in that range;
   - every `{Nxx}` exists in the numbers table;
   - every "ours" number is produced by `tools/manual-numbers.*` and matches;
   - every `{#slug}` exists in `chapters.json`;
   - no Thai/Latin spacing misses and no letter-spaced Thai;
   - report links are derived from the aimd file names (`docs/outhtm/<same basename without _claude>.html`); their existence is checked only where `docs/outhtm` exists (the owner's machine; the cloud copy has no `docs/outhtm`).
   Plus the page gates from checkpoint §5: Playwright at 3 sizes, 0 page errors, no horizontal overflow, dark theme.
4. **Independent review:** fresh subagent, given only the chapter and the cited aimd lines. Data-only brief, JSON verdict, fail-closed, ≤ 2 fix cycles (as for lessons). It checks meaning fidelity, labels, hedges, numbers and contradictions against table C.
5. **Owner reading pass;** then mark the part done in this plan.

**Tooling (D1 = a, chosen):**
- One text file per **section**, not per part: `web/manual/<NN_part>/<NN_section>.text.js` holds that section's HTML strings (same pattern as lesson text files, no new dependency). Parts III, IV, VIII and X have 6–8 sections, so one file per part would break the 200-line coder rule. Every manual file goes into `tools/style-scope.json`.
- Every manual string passes through `web/js/chapters.js` `resolve()` at runtime, which turns `{#slug}` into the current chapter.topic number. `npm run reindex` does not rewrite `{#slug}` itself. The T3 checker uses the same slug map.
- A route `#/manual/<slug>` and a "คู่มือ" link. A part index is generated from a `web/data/manual.json` list (same idea as `chapters.json`).
- Mini-widgets (D5): a section text may hold a placeholder such as `{widget:<name>}`; the renderer mounts `web/manual/widgets/<name>.js` there. Each widget is new code under the coder rules (logic in `web/js/`, component, text, config; ≤ 200 lines; `style-scope.json`; tests + red proof), gets its own WIP and its own independent review, and passes the 3-size Playwright gate. A widget reuses an existing lesson's logic where one exists instead of copying it. The T3 checker fails on a placeholder with no widget file.
- "เจาะลึก" boxes (D2): one shared box class in `web/css/style.css`; the T3 checker treats box text exactly like main text (refs, numbers, labels).
- `tools/check-manual.js` with its own tests, plus `tools/manual-numbers.js` (or `.py` if the A-file code is Python). Both follow the coder rules: ≤ 200 lines, logic/text/config split, listed in `style-scope.json`, red-proven tests.

**Risks:**

| R | risk | mitigation |
|---|---|---|
| R1 | aimd line numbers drift when an aimd file is edited | anchor phrase per ref; the checker fails on a missing anchor; refs are re-pointed in the same edit |
| R2 | toy numbers presented as real (four hand-made tables, toy models) | Part 0 rule + C18; "toy" label on every toy number |
| R3 | stale facts (model names, prices, thresholds, MCP marketplace) | "ณ วันที่ …" on every dated fact; list them in App. B with dates |
| R4 | vendor benchmarks read as neutral | vendor label from A27 L52, L58 kept next to the number |
| R5 | errors carried over from weak sources (A23, A22 narration) | C-register; A23 and A22 never sole source for a mechanism |
| R6 | scope creep: widgets grow into lessons | D5 = links + widgets: each widget has its own WIP and review and stays one idea; anything larger is proposed as a lesson |
| R7 | copyright | own words only; quotes < 15 words; no transcript text |
| R8 | length (12 parts) stalls the work; front-to-back (D6) can stall on a gap part | each part shippable alone; the iw for a part's gap runs before that part (T4); Part VI may ship as the overview if G1 / G2 sources are not in yet |

**Effort (rough):** T1 (route, part index, renderer for text modules, Playwright gates) ≈ 1 session; T2–T3 ≈ 1 session; each ready part ≈ 1 session including review; gap parts wait for iw sessions. Core II–V ≈ 4 sessions; practice VII–XII ≈ 6; I + appendices ≈ 1–2.
T1 does not block writing: T2–T4 produce `web/manual/**/*.text.js` and pass `check:manual` without the route, so T1 can land in parallel.

## 11. สิ่งที่ต้องทำ (to-do, in order)

**เจ้าของ (owner)**
- [x] **T0** ตอบ D1–D7 (§2) — ตอบแล้ว 2026-10-13 11:3x; ย้ายแผนมาไว้ `docs/arch/WIP202610050_llm-manual/plan.md` แล้ว (ckp:002#55)
- [x] **T0b** เลือกแหล่ง iw — G1 + G2, G3, G6 (hybrid search) ก่อน; สลับเลข G6 ↔ G7 แล้ว (agent = G7 รอรอบหลัง) ยังต้องการ: เจ้าของส่ง URL หรือให้ผมเสนอ (คลิป CME295 บทถัดไป ฯลฯ) แล้วเจ้าของเคาะ
- [ ] **T0c** (ถ้าต้องการ) สั่ง review รอบเพิ่มหลังการแก้ (self cycle 3 หรือ Fable อีกรอบ) — ยังไม่ได้สั่ง

**Claude** (D6 = หน้าไปหลัง: iw ของช่องว่างทำก่อนภาคที่ต้องใช้)
- [ ] **T1** ถ้า D1 = (a) (เลือกแล้ว) สร้างโครง `web/manual/`, `web/data/manual.json`, route `#/manual/<slug>`, กล่อง "เจาะลึก" และจุดวาง widget `{widget:<name>}` ตาม coder rules (ไฟล์ละ ≤ 200 บรรทัด, ใส่ใน `style-scope.json`) พร้อม review และผ่าน Playwright 3 ขนาด
- [ ] **T2** สร้างภาค 0 + ภาคผนวก A–E
  - ตาราง N พร้อม `tools/manual-numbers.*` ที่คำนวณค่าแบบ "ours" ทุกแถว (N4, N6, N11, N13, N16, N17, N22, N25, N26, N30, N32)
  - ตาราง C และอภิธานศัพท์จาก §6
  - ภาคผนวก E ใช้ id ของแหล่งชุดเดียวกับบทเรียน (`web/js/sources.js`)
- [ ] **T3** สร้าง `npm run check:manual` (ref + anchor, `{Nxx}`, `{#slug}`, `{widget:…}`, spacing, ลิงก์รายงาน, ข้อความในกล่องเจาะลึก) พร้อม test ที่พิสูจน์ว่าตรวจจับข้อผิดได้จริง (red proof) และเพิ่ม test ไฟล์ใหม่ในสคริปต์ `npm test` ของ `package.json`
- [ ] **T4** เขียนตามลำดับ 0 → XII ทีละภาค แต่ละภาคผ่าน check + review อิสระ + เจ้าของอ่าน; ก่อนถึงภาคที่มีช่องว่าง ให้ทำ T7 ของช่องนั้นก่อน
  - I → II (II.5 ใช้ผล T6) → III → IV (รวม IV.7 การเรียนรู้ของ model; IV.5 ใช้ G4 ถ้ามีแหล่งแล้ว ไม่งั้นเขียนว่า "ยังไม่มีแหล่ง")
  - **ก่อน V:** iw G3 → V
  - **ก่อน VI:** iw G1 + G2 → VI ฉบับเต็ม (ส่วน agent ยังเป็นภาพรวมจนกว่าจะ iw G7); ถ้าแหล่งยังไม่มา ส่ง VI ฉบับภาพรวมไปก่อน
  - VII (VII.2 สูตร LoRA = G8 แบบบรรทัด "ความรู้ทั่วไป") → VIII → IX
  - **ก่อน X:** iw G6 (hybrid search) → X
  - XI → XII
- [ ] **T5** mini-widget (D5): เสนอรายการ widget ต่อภาคตอนเขียนภาคนั้น เจ้าของเคาะ แล้วแต่ละตัวเปิด WIP ของตัวเอง ทำตาม coder rules + review
- [ ] **T6** วัดจำนวน token ภาษาไทย (G12) แบบ D7 (c): เขียนแถวใน `docs/APPROVALS.md` แล้ว (#1) → ได้ไฟล์ cl100k_base ranks (บันทึก sha256 ลงแถวนั้น) → `tools/` encoder Node + test → ตัวเลขพร้อมวันที่วัด ใส่ภาค II.5 (ต้องเสร็จก่อนเขียน II.5)
- [ ] **T7** iw แหล่งที่เจ้าของเลือก (T0b) ทีละช่อง ตามจังหวะใน T4 → เพิ่มใน §3 (A28 …) → เติมช่องว่างใน V.5, VI, X.7 (และ IV.5, VII.2, X.3, XII.2, XII.5 เมื่อมีแหล่ง)
- [ ] **T8** review ทั้งเล่มรอบสุดท้าย (ความต่อเนื่อง, ตัวเลขตรงตาราง N, ข้อขัดแย้งตรงตาราง C) แล้วอัปเดต README / llms.txt / REFERENCE ("ใช้ในบท")
- [ ] **ทุกรอบ** ลง checkpoint (upckp) และปิด `WIP202610050` เมื่อเล่มเสร็จ

## 12. Review log

| round | reviewer | verdict | findings | outcome |
|---|---|---|---|---|
| self, cycle 1 | independent subagent (same model), data-only brief, JSON fail-closed; ~300 refs checked, every row of N and C | FAIL | 11 must (8 wrong refs or labels, tier count 13/7/4 → 16/6/4, WIP claim not yet in the checkpoint, tiktoken vs §5a law 2, chapter files would break the 200-line rule), 9 should, 6 nit | all applied: refs and labels fixed, WIP202610050 minted (#53), D7 added, one text file per section, `{#slug}` resolved by `chapters.js`, C27–C30, partial-coverage gap cells, VII hardware section, Playwright and package.json in the process |
| self, cycle 2 | same reviewer; 76 refs re-checked, incl. 30 new | FAIL | 1 must (A06 L32 → the advice is on A06 L6), 1 should (G2 points to VII.5), 1 nit (duplicate Korean line) | all applied; A06 L6 verified by reading the line. Cycle 3 needs the owner's yes (checkpoint §5), so no third self-review was run |
| Fable | Fable model, second opinion; ~350 refs, domain correctness, structure, gaps, to-do | FAIL | 1 must (the training loop — loss, gradient, backprop — is covered by core files but had no section, while VII and VIII depend on it), 10 should, 4 nit | all applied: new IV.7, G1 reworded; intro "LLM = next-token predictor" in Part 0; C7 mechanism (argmax vs batching/kernels); C10 per-layer vs whole-model; decoder-only source support; G8 narrowed; C31–C32 for A23; T1 effort and parallel path; N19/C11 labels; D7 option (c); VI ships as an overview; glossary terms; App. E uses `sources.js`. One suggestion not taken: moving the G1 roadmap ref from A24 L16 to L15 — L15 is the lecturers' bio; L16 is the roadmap (kept L16, added L28) |

**Status after reviews:** both reviews ended FAIL on items that are now fixed. Neither review was run again after its last fixes: a third self-review cycle needs the owner's yes, and the owner asked for one Fable pass. Every reference in this file is checked by a script: in bounds, all 27 files cited (§3). A re-review can run on request (T0c).

**After the owner's answers (2026-10-13 11:3x, ckp:002#55):** §1, §2, §9 (G6 ↔ G7), §10 tooling / risks and §11 updated to match. No review was run on these edits (T0c not requested).
