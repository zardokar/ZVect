# multivector-rag-demo (coded by Opus 5.5 Extra) — Claude Context
> Source: YouTube, Vishal Bakshi, "multivector-rag-demo (coded by Opus 5.5 Extra)", 39:22, published 2026-09-30, https://www.youtube.com/watch?v=6iCmnd0k3fs · Generated: 2026-10-11
> Companion: docs/outhtm/20260930_Multivector-RAG-Demo-Coded-By-Opus-5-5-Extra.html (Thai, own-words rewrite; on-screen tables transcribed)

## TL;DR
A fully in-browser multi-vector RAG demo (GitHub Pages, single HTML) built with Claude Opus 5.5 Extra from an idea by Antoine Chaffin: pylate-rs (Rust→WASM, via jsDelivr) encodes the query with answerai-colbert-small-v1 (33M params, 96-d, 32 query tokens); documents (presenter's blog: 187 posts → 3,417 passages, 435,383 token vectors) are stored as binary sign vectors (index.bin ~5 MB, 12 bytes per token); scoring is exact MaxSim with float query × ±1 docs via 2·Σ(q where bit=1) − Σq using per-byte 256-entry lookup tables (32×12×256 = 98,304 floats). Pleias-RAG-350M (448 MB, WebGPU) generates a reasoned, cited answer. SciFact eval chose fp32 query × binary docs: NDCG@10 70.56 vs 74.18 fp32 (−3.62), 16.7 MB vs 533 MB.

## Key Concepts
- 0:10 Origin: Antoine wanted a fully web-launched multi-vector RAG demo with pylate-rs and Pleias' small RAG models.
- 1:11 Blog indexed with answerai-colbert-small-v1; page loads the index, then downloads the model to encode queries.
- 1:53 Query "What does the cavern represent?" → per-query-token MaxSim table for top 5 (columns: what, does, the, cavern, represent, ?, Other 26 = [CLS], [unused0] query marker, [SEP], 23 [MASK]). Rank 1 total 246.41; cavern 7.25 vs 3.59–4.71 for ranks 2–5 ("1.5–2×"); other words nearly equal. Rank 1 = the cavern allegory post; then tiny scale lab update, anthropomorphism, RewardBench paper summary, negative prompting.
- 3:29 Generate answer: Pleias-RAG-350M on WebGPU (first use downloads 448 MB); slow on a 2019 MacBook. Visible reasoning: query analysis (source 1 mentions a cavern; source 5 is a distraction), doubts, query deemed trivial; answer: the cavern represents the space of solutions (an interconnected network of tunnels and open spaces, vast but not infinite). Presenter: "doesn't really hallucinate".
- 6:41 Opus given the pylate-rs npm URL and Mixedbread's asymmetric quantization post: query FP32, documents int8 or binary; binary = each dimension ± (1 = plus, 0 = minus).
- 9:00 Architecture: eval-quality script first; index.bin + docs.json; index.html; pylate-rs from jsDelivr (WASM 4 MB); weights from Hugging Face (134 MB); standalone HTML for GitHub Pages. Flow: query → pylate-rs encodes (~32 vectors, WASM CPU) → binary MaxSim (byte lookup-table sums) with index.bin loaded once → ranked results → written answer.
- 11:22 SciFact eval table (on screen): fp32×fp32 74.18 / R@100 95.60 / 533 MB; int8×int8 74.51 (+0.32) / 95.93 / 96.5% same top-10 / 133 MB; fp32×binary 70.56 (−3.62) / 93.37 / 56.3% / 16.7 MB; int8×binary 70.56 / 93.37 / 56.2% / 16.7 MB; binary×binary 60.16 (−14.03) / 86.22 / 40.0% / 16.7 MB. Encoding: 1,388,618 doc vectors in 24.7 min; 300 queries in 6.7 s. Model card 74.77. Chose fp32 query × binary docs ("74 to 70", fine for a demo).
- 12:57 Blog check (7 Opus-generated queries): binary top-1 = fp32 rank 1 in 6 of 7 (Test time augmentation → rank 2); top-3 overlap 2/3 in six, 3/3 in one.
- 14:28 DevTools breakpoint at renderGrid: query embeddings 32 × 96 floats.
- 16:02 Comment in scorer.js: exact MaxSim with float query vs binary docs; q·d = 2·(sum of q where doc bit is 1) − (sum of all q); first part looked up a byte at a time: for every query vector and byte position, a 256-entry table holds the sum of q over each 8-bit pattern.
- 18:11 lookupTables: query length 3,072 = 32 × 96 (ASR "372"); bytes = 96/8 = 12; LUT size 32 × 12 × 256 = 98,304 (ASR "98,34"); loop slides 8 values at a time; MSB first.
- 23:24 scorePassages: offsets from the index (3,418 entries; 3,417 sections; first section 76 tokens; last offset 435,383 = total token vectors); `bits` length 5,224,596 = 435,383 × 12 → bytes, not bits (≈41.8M bits); first value 80.
- 30:41 bestSums: for each passage token range and each of nq query vectors, best = max over token vectors of Σ_b LUT[i][b][bytes[t*12+b]]; score = Σ_i (2·best_i − total_i); then timing, topPosts sort, query-token exposure for the table widget.
- 34:53 Presenter does not understand every detail; proof of concept; will share link and repo.
- 36:03 Pleias page: grounding assessment (trivial / answerable / reformulate / refused; source analysis extensive / basic / incomplete / infeasible — "not 100% sure"); multilingual chart; claims vs larger models. ModernColBERT / Reason-ModernColBERT guessed ~100M params, ~600 MB (F32).

## Implementation
Offline indexing (Python, PyLate-compatible model):
1. Split posts into sections (passages); encode each passage → token matrix (n_tok × 96), float.
2. Binarise: bit = 1 if value > 0 else 0; pack 96 bits → 12 bytes per token (MSB first); concatenate all tokens → `bytes` (Uint8Array, len = total_tokens × 12); `offsets` (len = n_passages + 1).
3. Save index.bin (+ docs.json with titles/snippets/links).
Query time (browser JS):
1. Encode query with pylate-rs → Float32Array of 32 × 96 (query augmented with [MASK] to 32 tokens).
2. lookupTables(query, dim): for i in 0..nq, b in 0..11, v in 0..255: lut[(i*12+b)*256+v] = Σ_{k=0..7} (v & (0x80>>k)) ? q[i*96 + b*8 + k] : 0; totals[i] = Σ_d q[i*96+d].
3. For passage p with tokens t ∈ [offsets[p], offsets[p+1]): best[i] = max_t Σ_{b=0..11} lut[(i*12+b)*256 + bytes[t*12+b]].
4. score(p) = Σ_i (2·best[i] − totals[i]) (exact float·(±1) dot products, MaxSim, summed).
5. Sort; show per-token MaxSim table; optional: pass top passages + prompt to Pleias-RAG-350M via WebGPU and stream reasoning + answer.
Pitfalls: binary docs cost ~3.6 NDCG@10 on SciFact (rerank a binary shortlist in higher precision to recover); binary×binary loses 14; filler tokens and [MASK] dominate scores; enable WebGPU acceleration; naming (`bits` holds bytes).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Encoder | pylate-rs (npm, WASM 4 MB) | 0:36, 9:35 |
| Model | answerai-colbert-small-v1, 33M, 96-d, 134 MB | 9:54 |
| Corpus | 187 posts → 3,417 passages; 435,383 token vectors | 1:11, 27:07 |
| Query tokens | 32 | 10:26 |
| Index bytes | 5,224,596 (12 bytes/token) | 25:50 |
| LUT | 32 × 12 × 256 = 98,304 | 19:23 |
| Generator | Pleias-RAG-350M, 448 MB, WebGPU | 3:33 |
| SciFact NDCG@10 | 74.18 / 74.51 / 70.56 / 70.56 / 60.16 | 11:35 |
| Sizes | 533 / 133 / 16.7 MB | 12:00 |

## Comparisons
| Query × doc | NDCG@10 | Δ | R@100 | same top-10 | size |
|---|---|---|---|---|---|
| fp32 × fp32 | 74.18 | – | 95.60 | 100% | 533 MB |
| int8 × int8 | 74.51 | +0.32 | 95.93 | 96.5% | 133 MB |
| fp32 × binary | 70.56 | −3.62 | 93.37 | 56.3% | 16.7 MB |
| int8 × binary | 70.56 | −3.62 | 93.37 | 56.2% | 16.7 MB |
| binary × binary | 60.16 | −14.03 | 86.22 | 40.0% | 16.7 MB |
When to choose: int8 is free; binary docs for size (shortlist + rescore); never binary on both sides.

## Open Questions & Extension Ideas
- Rescore the binary top-100 with int8 docs to recover the 3.6 points.
- Drop or down-weight [MASK]/filler columns in the explanation table.
- ZVect: lesson 7.3 RAG could use this pipeline as the end-to-end example; lesson 5.3 (1-bit vectors) could show the asymmetric formula alongside XOR + popcount.

## Tags & Triggers
Tags: multivector-rag, rag, colbert, late-interaction, maxsim, pylate-rs, webassembly, in-browser-search, answerai-colbert-small, binary-quantization, asymmetric-quantization, lookup-table, scifact, pleias-rag-350m, webgpu, query-augmentation
Triggers:
- How to build a fully in-browser multi-vector RAG?
- What is asymmetric quantization and why does 2·Σ(q|bit=1) − Σq work?
- How much does binary document quantization cost ColBERT?
- What do the 256-entry per-byte lookup tables do?
- Why do [MASK] tokens dominate ColBERT query scores?

## References
- https://www.youtube.com/watch?v=6iCmnd0k3fs
- https://github.com/lightonai/pylate-rs · https://huggingface.co/answerdotai/answerai-colbert-small-v1 · https://huggingface.co/PleIAs/Pleias-RAG-350M
- https://mixedbread.com/blog/asymmetric-quant · https://arxiv.org/abs/2104.08663 · https://arxiv.org/abs/2112.01488

## Processing Notes
- License: standard YouTube → own-words rewrite; English ASR (743 lines) kept out of the repo. ASR repairs: "Pilate RS" = pylate-rs, "Colbear" = ColBERT, "372" = 3,072, "98,34" = 98,304, "play us" = Pleias.
- On-screen tables transcribed from frames (MaxSim table, SciFact table, blog-query table, diagram, scorer.js comment).
- Fact-check 2026-10-11 (independent search agent): 7 claims — confirmed 3, partly 4, not found 0, contradicted 0 (Mixedbread uses int8 queries; Pleias claims ≤4B SLMs; Reason-ModernColBERT 150M; pylate-rs README names no author).
- Author computation: Other-26 share ≈ 200/246 ≈ 82% of totals.
- 4 frames cropped to content, 3 transcribed tables, 2 own SVGs.
