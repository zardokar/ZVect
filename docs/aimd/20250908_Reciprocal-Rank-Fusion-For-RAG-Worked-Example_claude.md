# RAG Tutorial 2026 #15: Reciprocal Rank Fusion for Enhanced RAG Performance — Harish Neel | AI - Claude Context
> Source: YouTube, Harish Neel | AI, "RAG Tutorial 2026 #15: Reciprocal Rank Fusion for Enhanced RAG Performance", 12:59, published 2025-09-08 · https://www.youtube.com/watch?v=1qQCuWiRIfA · Generated: 2026-10-13
> Companion: 20250908_Reciprocal-Rank-Fusion-For-RAG-Worked-Example.html (Thai, iw mode `iwd`, 13 sections, 12 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); equations, slide numbers and short code transcribed exactly.
- Frames used: 01_formula-def, 02_two-lists, 03_k0-calc, 04_k0-final, 05_k0-problem, 06_k60-table, 07_takeaways, 08_retrieval-code, 09_verbose-log, 10_final-output, 11_rrf-code-a, 12_rrf-code-b.
- Own SVG diagrams: flow, bars.
- Transcript SHA-256 (in-page = decoded): `09b9dafd2cd5a599fd4932efa8da5307f8470b39b34328e50a1eb5c1fa7df55b (en:asr track)`; kept in the session workspace only.

## TL;DR
- Harish Neel teaches Reciprocal Rank Fusion (RRF) with a fully hand-computable example: two phrasings of a Tesla revenue question each return 5 chunks (A: X, Y, Z, W, V; B: Y, X, A, B, Z).
- He scores each position with 1/(k + rank), sums per chunk across lists (absent = 0), first with k = 0 (X = Y = 1.5, Z = 0.53), then argues k = 0 is "too harsh" (rank 2 loses 50%) and switches to k = 60 (X = Y = 0.0325, Z = 0.0313).
- A Python function `reciprocal_rank_fusion(chunk_lists, k=60, verbose=True)` fuses 3 query variations × 5 chunks = 15 into 7 unique chunks; top scores 0.0487, 0.0476, 0.0474, 0.0315, 0.0310.
- Every slide number recomputes exactly. The spoken "0.003" gap between X and Z at k = 60 is wrong (0.0012 from the slide values, 0.00126 unrounded). Ordering is identical at k = 0 and k = 60; the 5-chunk cut falls inside the W/B tie and the clip gives no tie-break rule.

## Key Concepts
**Equation 1 (slide ~0:24, exact):**
$$\text{RRF\_score} = \sum \left( \frac{1}{k + \text{rank\_position}} \right)$$
Sum "across all queries where the chunk appears"; k "typically 60"; rank_position = position in the query result, starting at 1.

**Equation 2 (author's complete form, consistent with the speaker's "assume it as zero" at ~4:09):**
$$\mathrm{RRF}(d) = \sum_{r \in R} c_r(d), \qquad c_r(d) = \begin{cases} \dfrac{1}{k + \mathrm{rank}_r(d)} & d \in r \\ 0 & d \notin r \end{cases}$$

**Equation 3 (k = 0 positional score):** $c_r(d) = \frac{1}{0 + \mathrm{rank}_r(d)}$ → 1, 0.5, 0.33, 0.25, 0.2.

**Equation 5 (author, penalty vs rank 1):** $\mathrm{penalty}(\mathrm{rank}) = 1 - \frac{k+1}{k+\mathrm{rank}}$ → k = 0: 50% (rank 2), 66.7% (rank 3); k = 60: 1.6%, 3.2%.

**Equation 6 (author, rank-1/rank-2 ratio):** $\frac{k+2}{k+1}$ → 2 at k = 0 (the slide's "2x scoring difference"), 1.0164 at k = 60.

**Equation 7 (k = 60 positional scores, slide):** $\frac{1}{61}=0.0164,\ \frac{1}{62}=0.0161,\ \frac{1}{63}=0.0159,\ \frac{1}{64}=0.0156,\ \frac{1}{65}=0.0154$.

**Equation 11 (author, ceiling):** $\mathrm{RRF}_{\max} = \frac{n}{k+1}$; n = 3, k = 60 → 0.0492.

**Equation 13 (author's addition, not in the clip, weighted RRF):**
$$\mathrm{RRF}_w(d) = \sum_{r \in R} \frac{w_r}{k + \mathrm{rank}_r(d)}$$
Elasticsearch 9.x RRF retriever: `weight` per child retriever, default 1.0, rrf_score = Σ weight_i × rrf_score_i. LangChain EnsembleRetriever: weight / (rank + c), c = 60.

Slide "Real-World Issue": X and Y might have similarity 0.95 vs 0.94; that 0.01 (about 1%) difference becomes a 2x RRF difference (1.0 vs 0.5) at k = 0.

## Implementation
Worked example, every row (recomputed exactly with fractions in recompute.py):

| chunk | rank A | rank B | k = 0 substitution | k = 0 | k = 60 substitution | k = 60 |
|---|---|---|---|---|---|---|
| X | 1 | 2 | 1/1 + 1/2 | 1.5 | 1/61 + 1/62 = 123/3782 | 0.032522 |
| Y | 2 | 1 | 1/2 + 1/1 | 1.5 | 1/62 + 1/61 | 0.032522 |
| Z | 3 | 5 | 1/3 + 1/5 = 8/15 | 0.5333 | 1/63 + 1/65 = 128/4095 | 0.031258 |
| A | - | 3 | 0 + 1/3 | 0.3333 | 0 + 1/63 | 0.015873 |
| W | 4 | - | 1/4 + 0 | 0.25 | 1/64 + 0 | 0.015625 |
| B | - | 4 | 0 + 1/4 | 0.25 | 0 + 1/64 | 0.015625 |
| V | 5 | - | 1/5 + 0 | 0.2 | 1/65 + 0 | 0.015385 |

Slide values: k = 0 "Final Ranking": X & Y 1.5 (tie), Z 0.53, A 0.33, W & B 0.25 (tie), V 0.2; k = 60 "Final Ranking with k=60": Doc X & Doc Y 0.0325 ("still tied, but for good reason - true consensus!"), Doc Z 0.0313, Doc A 0.0159, Doc W & Doc B 0.0156, Doc V 0.0154. Gap X − Z: 0.9667 (k = 0) vs 0.001265 (k = 60).

Code shown (VS Code, `11_reciprocal_rank_fusion.py`), key lines verbatim:
```python
retriever = db.as_retriever(search_kwargs={"k": 5})  # Get more docs for better RRF
all_retrieval_results = []
for i, query in enumerate(query_variations, 1):
    docs = retriever.invoke(query)
    all_retrieval_results.append(docs)

def reciprocal_rank_fusion(chunk_lists, k=60, verbose=True):
    rrf_scores = defaultdict(float)          # {chunk_content: rrf_score}
    all_unique_chunks = {}                   # {chunk_content: actual_chunk_object}
    chunk_id_map = {}; chunk_counter = 1     # verbose ids Chunk_1, Chunk_2 ... in first-seen order
    for query_idx, chunks in enumerate(chunk_lists, 1):
        for position, chunk in enumerate(chunks, 1):  # position is 1-indexed
            chunk_content = chunk.page_content         # content is the dedup key
            if chunk_content not in chunk_id_map:
                chunk_id_map[chunk_content] = f"Chunk_{chunk_counter}"; chunk_counter += 1
            all_unique_chunks[chunk_content] = chunk
            position_score = 1 / (k + position)
            rrf_scores[chunk_content] += position_score
    sorted_chunks = sorted(
        [(all_unique_chunks[c], s) for c, s in rrf_scores.items()],
        key=lambda x: x[1], reverse=True)
    return sorted_chunks

fused_results = reciprocal_rank_fusion(all_retrieval_results, k=60, verbose=True)
```
Run (3 query variations × 5 = 15 → "Processed 7 unique chunks from 3 queries"). Author reconstruction of the per-list ranks from the verbose log (ids are first-seen order): Q1 = C1, C2, C3, C4, C5; Q2 = C2, C5, C3, C1, C4 (ranks 1-2 inferred); Q3 = C6, C2, C3, C7, C1. Fused: C2 = 1/62 + 1/61 + 1/62 = 0.0487; C3 = 3/63 = 0.0476; C1 = 1/61 + 1/64 + 1/65 = 0.0474; C5 = 1/65 + 1/62 = 0.0315; C4 = 1/64 + 1/65 = 0.0310; C6 = 1/61 = 0.0164; C7 = 1/64 = 0.0156. All five on-screen scores match.

Implementation rules to fix before coding (author; the clip does not specify them): rank base 1; absent = 0; deterministic tie-break (e.g. best single-list rank, then smaller chunk id) because the 5-chunk cut falls inside the W/B tie at both k; dedup by a stable chunk id rather than page_content; list depth (rank window) stated explicitly.

## Quick Reference
| item | value |
|---|---|
| formula (slide) | RRF_score = Σ (1 / (k + rank_position)) |
| k | 60 recommended; 0 used for teaching |
| absent from a list | 0 |
| k = 0 positional | 1, 0.5, 0.33, 0.25, 0.2 |
| k = 60 positional | 0.0164, 0.0161, 0.0159, 0.0156, 0.0154 |
| k = 0 fused | X 1.5, Y 1.5, Z 0.53, A 0.33, W 0.25, B 0.25, V 0.2 |
| k = 60 fused | X 0.0325, Y 0.0325, Z 0.0313, A 0.0159, W 0.0156, B 0.0156, V 0.0154 |
| penalty at k = 0 | rank 2: 50%, rank 3: 67% |
| similarity example | 0.95 vs 0.94 → 1.0 vs 0.5 |
| code run | 3 queries × k = 5 docs → 15 → 7 unique; top-5 0.0487, 0.0476, 0.0474, 0.0315, 0.0310 |
| ceiling, 3 lists, k = 60 | 3/61 = 0.0492 |

## Comparisons
k = 0 vs k = 60 on the same lists: same ordering (X = Y, Z, A, W = B, V); rank-1/rank-2 ratio 2 vs 1.0164; X − Z gap 0.967 vs 0.00126. Author example where k flips the winner: P rank 1 in one list, Q rank 3 in two lists: k = 0 P 1.0 > Q 0.667; k = 60 P 0.0164 < Q 0.0317. Weighted (author): w = (2, 1) → X 0.048916 > Y 0.048652 > Z 0.047131 > W 0.03125 > V 0.030769 > A 0.015873 > B 0.015625; w = (1, 2) → Y first.

## Fact Check
7 claims: confirmed 4, partly 2, contradicted 1.
- Formula and absent = 0: confirmed (paper RRFscore(d ∈ D) = Σ_{r∈R} 1/(k + r(d)); Elasticsearch score += 1.0/(k + rank), rank from 1, only result sets containing d).
- "k assumed to be 60 always" in products: partly (default 60 in Elasticsearch rank_constant, min 1, configurable; the paper fixed 60 in a pilot).
- All slide numbers: confirmed (recompute.py).
- "difference … 0.003": contradicted (0.0012 / 0.00126).
- "RRF often outperforms more complex fusion methods": partly (paper: beats Condorcet 7/7 and CombMNZ 6/7 on TREC; on LETOR 3 CombMNZ 0.6107 > RRF 0.6051, not significant, p = .2).
- 15 → 7 unique chunks and top-5 scores: confirmed by reconstruction.

## Open Questions & Extension Ideas
- Tie-break rule and its effect on the top-N cut (author proposal above).
- Choosing k when only 2 short lists are fused: at k = 60 scores are nearly flat (ratio 1.016), so ties are frequent.
- Weighted RRF for hybrid search (BM25 list vs latent-space list) — the speaker's next video covers hybrid search.
- Unit tests for a library: the 7-row table at k = 0 and k = 60, the P/Q flip, the weighted (2, 1) and (1, 2) orders, and the reconstructed 3-list code run.

## Tags & Triggers
Reciprocal Rank Fusion, RRF, multi-query RAG, rank fusion, k = 60, worked example, chunk dedup, weighted RRF, Harish Neel.
Triggers: "RRF worked example", "why k = 60", "RRF Python code", "score of a chunk in only one list", "weighted RRF formula".

## References
- Harish Neel | AI, "RAG Tutorial 2026 #15: Reciprocal Rank Fusion for Enhanced RAG Performance", YouTube, 2025-09-08, https://www.youtube.com/watch?v=1qQCuWiRIfA
- Cormack, Clarke, Büttcher, "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods", SIGIR '09, https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf
- Elasticsearch reciprocal rank fusion, https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion ; RRF retriever (weight), https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever
- LangChain EnsembleRetriever.weighted_reciprocal_rank (weight / (rank + c), c = 60)
- recompute.py (author's stdlib script, job folder)
