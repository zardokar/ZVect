# RAG Tutorial 2026 #17: RAG Reranking and Next Steps! — Harish Neel | AI - Claude Context
> Source: YouTube, Harish Neel | AI, "RAG Tutorial 2026 #17: RAG Reranking and Next Steps!", 28:52, published 2025-09-11 · https://www.youtube.com/watch?v=VWA15n6uiS4 · Generated: 2026-10-13
> Companion: 20250911_RAG-Reranking.html (Thai, iw mode `iwd`, 7 sections, 5 frames + 4 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis with fact-check (standard YouTube license; English ASR captions).
- Frames used: 01_multiquery-flow, 02_faucet, 03_bi-encoder, 04_cross-encoder, 05_before-after.
- Own SVG diagrams: flow, bars, compare, compare.
- Transcript SHA-256 (in-page = decoded): `e6e1f4fefe480639a011c2bafd425d42fef533dd8b9c2e7b71cb5a003009ec6d`; kept in the session workspace only.

## TL;DR

Video #17 of a beginner RAG playlist (Harish Neel | AI, 28:52, ASR English captions, standard YouTube license). It explains the reranker as a second-stage model: a cross-encoder reads the query and one chunk together and outputs a relevance score, so a pipeline can retrieve wide and cheap (embeddings, BM25, RRF fusion) and then re-order a short candidate list (the speaker says roughly 10 to 100 chunks, 25 in his example) before sending the top n (10) to the LLM. The demo uses LangChain `EnsembleRetriever` (BM25 + vector, weights 0.7 / 0.3, 15 results per side, 18 unique chunks after fusion) followed by Cohere `rerank-english-v3.0`. All chunk counts (50, 35, 25) and all scores (0.82, 0.79, 0.78, 0.12) are hypothetical illustrations stated as such by the speaker; the code demo is a single run on a tiny corpus with no quality or latency measurement.

## Key Concepts

- **Reranker = cross-encoder.** The speaker treats the two words as the same thing. It takes one string `query [SEP] chunk`, processes both together, and returns a relevance score. It is run once per (query, chunk) pair.
- **Bi-encoder = embedding model.** Query and chunk are encoded separately, at different times (chunks ahead of time, the query at question time), and compared with cosine similarity. The speaker's complaint: the model never sees query and chunk together.
- **Two-stage retrieval.** Stage 1: fast, broad, cheap approximation (embeddings over millions of chunks, take 50 to 100 per query). Stage 2: precise, focused, more expensive (reranker over about 10 to 100 candidates). Analogy used: screening interview, then technical interview.
- **Cost / accuracy placement.** Embeddings: cheap, lower accuracy. LLM: expensive, high accuracy. Reranker: in between, "a little bit more accuracy than embeddings".
- **Why embeddings alone are not enough.** Example query "How to fix a leaky faucet?": chunk A (repair steps) 0.82, chunk B (water damage costs) 0.79, both "high similarity" (illustrative numbers). Good-probability retrieval is not always good enough for enterprise, legal or pharmaceutical RAG.
- **When a reranker is not needed.** If only 5 or 10 chunks remain, send them to the LLM directly. On a small corpus the effect is likely small (the speaker predicts this before running his demo, and notes afterwards that some re-ordering still happens).
- **RRF as the merge step.** Two lists (vector, keyword) cannot be concatenated blindly because chunks overlap; reciprocal rank fusion merges them, then merges again across query variants. The video does not derive the formula (covered in episode #16).
- **Multi-query hybrid search.** One user question is expanded into 5 (the speaker also says 3) variants; each variant gets its own hybrid retrieval.

## Implementation

Pipeline as drawn by the speaker (all counts hypothetical):

1. User question -> 5 query variants.
2. Per variant: vector retrieval k = 50 and keyword retrieval k = 50.
3. RRF per variant -> about 35 unique chunks (up to 100 if the lists do not overlap).
4. RRF across the 5 lists -> about 25 chunks (the speaker says it could be 25, 40, 75 or 100).
5. Reranker with `top_n` = 10 -> final chunks.
6. LLM with question + 10 chunks -> answer.

Code demo (LangChain, Jupyter notebook `13_reranker.ipynb`, built on `12_hybrid_search.ipynb`):

- Corpus: about 100 short text chunks (Tesla, Microsoft, Nvidia, Google topics plus noisy irrelevant chunks), converted to LangChain `Document` objects.
- Imports: `BM25Retriever`, `EnsembleRetriever`, an embedding model, `Chroma`, `Document`, `CohereRerank` from `langchain_cohere` (pip package `langchain-cohere`).
- Retrievers: vector retriever, BM25 retriever, and `EnsembleRetriever` over both with `weights=[0.7, 0.3]` (vector first). Retrieval size 15 per side.
- Query: "Tesla financial performance and production updates". Result: 18 unique chunks (15 + 15 minus overlap); the first 11 talk about Tesla.
- Rerank: `CohereRerank(model="rerank-english-v3.0", top_n=10)` and `compress_documents(retrieved_docs, query)`. Without a document-count argument it returns all 18 re-ordered. Environment variable `CO_API_KEY` holds a Cohere trial key (created under API keys in the Cohere dashboard); restart the Jupyter kernel after setting it.
- Final step: pass the reranked chunks plus the question to the LLM (code from the earlier answer-generation episode). Output begins "Tesla demonstrated a strong financial performance".

What the LangChain `EnsembleRetriever` does with the weights (author check against the library source, summarized by a web fetch tool, not run): weighted reciprocal rank fusion, score(doc) = sum over retrievers of weight / (rank + c), rank starting at 1, c = 60 by default, duplicates merged by page content, result sorted by total score. Default weights are equal (1 / number of retrievers).

Observed before / after on the demo (read from the notebook output frame; the printed labels say "Top 3" but 5 items are shown):

| rank | before (hybrid) | after (Cohere rerank) |
|---|---|---|
| 1 | free cash flow $7.5 billion | free cash flow $7.5 billion |
| 2 | Gigafactory expansion plans | revenue $25.2 billion in Q3 2024 |
| 3 | revenue $25.2 billion | automotive gross margin 19.3% |
| 4 | stock price at new highs after earnings | Gigafactory expansion plans |
| 5 | automotive gross margin 19.3% | energy storage business grew 40% year over year |

The speaker explains the move by the query asking about financial performance, so metric-bearing chunks rose and generic announcement sentences fell. He does not mention that the stock-price chunk left the top 5 and the energy-storage chunk entered (author observation from the frame).

Production notes at the end (speaker): real systems with existing relational data would use PG vector (pgvector) for vector search and "ts vector" for keyword search inside PostgreSQL rather than LangChain notebooks.

## Quick Reference

| item | value | time |
|---|---|---|
| definition | specialized model that re-orders initial results by semantic relevance to the query ("second opinion") | 6:54 |
| stage 1 | embeddings: fast, broad, cheap; millions of chunks; keep 50 to 100 | 9:52 |
| stage 2 | reranker: precise, focused, more expensive; about 10 to 100 chunks, 25 in the example | 12:45 |
| example list sizes | 50 per retrieval, about 35 after first RRF, about 25 after second RRF (all hypothetical) | 3:00-5:20 |
| top n | 10 chunks to the LLM | 5:58 |
| faucet example | chunk A 0.82, chunk B 0.79 (hypothetical) | 8:40 |
| bi-encoder example | "apple stock price" vs "Apple trees grow in orchards", cosine 0.78 | 14:36 |
| cross-encoder example | same pair joined with [SEP], relevance 0.12 | 16:15 |
| not needed when | only 5 or 10 chunks remain | 17:41 |
| demo ensemble weights | vector 0.7, BM25 0.3; k = 15 per side | 19:13-19:37 |
| demo fusion result | 18 chunks from 15 + 15 | 20:01-20:27 |
| rerank model | Cohere rerank-english-v3.0 via LangChain CohereRerank | 21:54 |
| returned count | top 10 in code (all 18 if not specified) | 22:34-22:41 |
| API key | env var CO_API_KEY (Cohere trial key) | 25:38 |
| before/after change | Gigafactory chunk rank 2 -> 4; $25.2B revenue chunk rank 3 -> 2 | 24:25-24:47 |

## Comparisons

| criterion | embedding (bi-encoder) | reranker (cross-encoder) | LLM |
|---|---|---|---|
| sees query and chunk together | no, encoded separately | yes, one string with [SEP] | yes |
| output | vector, then cosine | relevance score per pair | text |
| accuracy (speaker) | lower ("very low accuracy" next to an LLM) but gives chunks with good probability of relevance | a little more than embeddings | high |
| cost (speaker) | cheap, millions of chunks | middle, about 10 to 100 chunks | expensive |
| role | stage 1 candidate retrieval | stage 2 re-ordering | answer generation |

Decision criteria: skip the reranker when the candidate list is already as short as what the LLM will receive; add one when there are many candidates and precision matters (enterprise, legal, pharmaceutical per the speaker); expect little visible gain on a tiny corpus.

## Fact Check

12 claims checked with web fetches (tool summaries, not raw pages): 6 confirmed, 3 partly confirmed, 2 not found, 1 contradicted.

- Confirmed: cross-encoder reads query and document together and returns a score between 0 and 1; bi-encoder encodes separately; retrieve then re-rank pipeline (documentation example takes about 100 candidates); EnsembleRetriever fuses by weighted RRF with c = 60 and merges duplicates; the 70 / 30 weights are the speaker's settings; pgvector is a PostgreSQL extension and its README suggests combining it with full-text search (an RRF example is linked).
- Partly confirmed: the 10 to 100 chunk range (reasoning right, range is the speaker's rule of thumb); Cohere `rerank-english-v3.0` exists as the English 3.0 model with `top_n` in examples, but newer models exist (`rerank-v3.5`, `rerank-v4.0-pro`, `rerank-v4.0-fast`); Cohere trial key is free but limited (Rerank 10 requests per minute, 1,000 calls per month) and the page does not itself forbid commercial use but points production workloads to paid keys.
- Not found: open-source rerankers "even better than Cohere" (no model or benchmark named); reranker sitting between embeddings and an LLM in cost and accuracy (direction plausible, no source measuring all three found).
- Contradicted: "ts vector is an extension of PostgreSQL". `tsvector` is a built-in PostgreSQL data type for full-text search, and `ts_rank` ranks by lexeme frequency without corpus-wide statistics (no IDF), so it is not BM25.

## Open Questions & Extension Ideas

- No quality or latency numbers for reranking are given. Measure recall@k and answer quality with and without a reranker on a real corpus; the demo is one query on about 100 chunks.
- How large should the candidate list be? The speaker's 10 to 100 is a rule of thumb; cross-encoder cost grows linearly with candidate count.
- A reranker trained for a domain (the speaker mentions legal and medical rerankers as a later topic in episode #16) versus a general English one.
- Score scales differ between models and from cosine similarity; any threshold on rerank scores must be calibrated per model.
- The speaker's description of fusion stops at "use RRF"; episode #16 covers the weighted formula.
- Extension: a reranker-free baseline for tiny corpora, then add a cross-encoder only when the candidate list exceeds what the LLM context should carry.

## Tags & Triggers

tags: reranker, cross-encoder, bi-encoder, RAG, hybrid search, RRF, Cohere Rerank, LangChain, two-stage retrieval, top_n
- What is a reranker and how does it differ from an embedding model?
- Cross-encoder versus bi-encoder?
- When should a RAG pipeline add a reranker, and when not?
- Why retrieve wide and then rerank?
- How do I use CohereRerank in LangChain?

## References

- Source video: "RAG Tutorial 2026 #17: RAG Reranking and Next Steps!", Harish Neel | AI, 2025-09-11, https://www.youtube.com/watch?v=VWA15n6uiS4
- Sentence-Transformers, Retrieve & Re-Rank: https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
- Cohere Rerank overview: https://docs.cohere.com/docs/rerank-overview
- Cohere rate limits and trial keys: https://docs.cohere.com/docs/rate-limits
- LangChain EnsembleRetriever source: https://github.com/langchain-ai/langchain/blob/master/libs/langchain/langchain_classic/retrievers/ensemble.py
- pgvector: https://github.com/pgvector/pgvector
- PostgreSQL text search types: https://www.postgresql.org/docs/current/datatype-textsearch.html
- PostgreSQL ts_rank: https://www.postgresql.org/docs/current/textsearch-controls.html
