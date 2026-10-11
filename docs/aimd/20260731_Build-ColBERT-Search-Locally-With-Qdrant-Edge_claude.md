# Build ColBERT Search Locally with Qdrant Edge — Claude Context
> Source: YouTube, HiDevs, "Build ColBERT Search Locally with Qdrant Edge (Step-by-Step)", 16:52, published 2026-07-31, https://www.youtube.com/watch?v=8LPgGU34RoE · Generated: 2026-10-11
> Companion: docs/outhtm/20260731_Build-ColBERT-Search-Locally-With-Qdrant-Edge.html (Thai, own-words rewrite)

## TL;DR
Tutorial: most vector search compresses a whole document into one vector; ColBERT stores one vector per token and scores with late interaction (each query token keeps its best-matching document token; the maxima are summed = MaxSim). The demo builds an offline search engine on Qdrant Edge (embedded, in-process; no server, no network) with a multivector field using `MultiVectorComparator.MaxSim`, indexes 24 deliberately ambiguous passages (apple, bank), and queries with Wi-Fi off at ~1.5 ms. Advice: in production use ColBERT as a rerank stage after fast single-vector retrieval. Several narration errors are noted below.

## Key Concepts
- 0:26 Definition read from a search engine AI summary on screen: ColBERT = contextualized late interaction over BERT; "fast and accurate", "deep language understanding of BERT with the high speed of traditional keyword search" (paper actually claims ~100× faster than BERT re-rankers, not keyword-search speed).
- 1:30 Single vector per document; narrator claims repeated words (in, or, the) create "noise" affecting the trained model (conflation; no training in this demo). Slide: "All detail compressed into one point, before search even happens."
- 3:00 ColBERT: one vector per token (10-word sentence → 10 vectors), each capturing the word in context; at search time compare every query token with every document token, keep best match per query token, sum = late interaction. Distinguishes apple (fruit) vs Apple (company) by nearby words.
- 4:39 Qdrant Edge: same embedded offline engine as the channel's previous video; native multivector support incl. MaxSim comparator; fully on device, no server, no network calls, no internet.
- 5:28 Setup: `uv venv`, activate `.venv\Scripts\activate` (Windows).
- 6:52 search_engine.py LateInteractionSearchEngine.create: `EdgeConfig(vectors={settings.vector_name: EdgeVectorParams(size=settings.vector_dimension, distance=Distance.Cosine, multivector_config=MultiVectorConfig(comparator=MultiVectorComparator.MaxSim))})`; `EdgeShard.create(str(shard_directory), config)`. Key line tells the shard the field is a variable-length list of token embeddings scored by late interaction, not a simple dot product.
- 8:18 data/documents.json: 24 passages with ambiguous terms (D01 Apple Inc. Q3 Earnings, D02 Growing Fruit Trees at Home, D03 Healthy Snacking Tips, D04 Smartphone Market Trends, D05 River Ecosystems Explained…). Longer documents get more vectors.
- 8:58 `python -m scripts.build_index`: each passage gets its own number of token vectors (29, 30, …); 24 documents indexed into the local shard.
- 9:51 Wi-Fi off. `python -m scripts.search "apple"` → "An apple tree needs full sun and well-drained soil" (fruit sense; narrator says "that is for company"). On screen first query latency 12.87 ms.
- 11:53 "a fruit that keeps doctors away" → query encoded into 32 token vectors; 1 Healthy Snacking Tips 28.0645, 2 Autumn Orchard Harvest 8.5872, 3 Chess Opening Strategies 7.5303; 1.65 ms (query text appears verbatim in D03).
- 12:33 "programming language for beginners" → learning-to-code passage ("Python is the most popular first programming language"), then data science; 1.46 ms.
- 13:56 "luxury sports car" → "luxury car brands compared" (Jaguar F-Type); 1.50 ms.
- 15:12 Token-level comparison costs more than one dot product; most often used as a re-ranking step: fast single-vector retrieval of candidates, then ColBERT rerank (slide Stage 1 / Stage 2, both on Qdrant Edge).

## Implementation
1. `uv venv` and activate; install qdrant-edge and an embedding library with a ColBERT model (description: FastEmbed); download the model beforehand (repo has scripts/download_model.py, models-cache/).
2. Create EdgeConfig with a named multivector field (cosine, model dimension, MaxSim comparator) and EdgeShard.create(dir, config).
3. For each document, compute token embeddings (matrix n_tokens × dim) and upsert as a multivector point with payload (id, title, text).
4. At query time, encode query tokens (here 32 vectors), search the shard; score = Σ_i max_j cos(q_i, d_j).
5. Scale-out pattern: a dense single-vector field for candidate retrieval (HNSW), then rerank top-k with the multivector field (no HNSW needed for the token vectors per Qdrant docs).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Engine | Qdrant Edge (embedded, offline) | 4:39 |
| Field config | size=dim, Cosine, MultiVectorConfig(MaxSim) | 6:52–7:43 |
| Data | 24 passages (apple, bank) | 8:18 |
| Vectors per passage | 29, 30, … | 9:30 |
| Query vectors | 32 | 12:10 |
| Top result scores | 28.0645 / 8.5872 / 7.5303 | 12:10 |
| Latency | 1.65, 1.46, 1.50 ms (first query 12.87 ms) | 12:59–14:05 |
| Production pattern | single-vector retrieve → ColBERT rerank | 15:12 |

## Comparisons
| Aspect | Single vector | ColBERT multivector |
|---|---|---|
| Stored | 1 vector/doc | 1 vector/token |
| Scoring | one dot/cosine | all token pairs, MaxSim + Σ |
| Strength | fast, whole-corpus | keeps detail and context |
| Cost | low | higher compute and storage |
When to choose: small corpus → direct ColBERT; large corpus → retrieve then rerank.

## Open Questions & Extension Ideas
- The demo queries share words with target passages; a paraphrase test would better show late interaction.
- Storage cost per passage (≈30 vectors × dim) vs 1 vector not discussed.

## Tags & Triggers
Tags: colbert, late-interaction, maxsim, multivector, qdrant, qdrant-edge, on-device-search, offline-search, fastembed, retrieve-then-rerank, reranking
Triggers:
- How to run ColBERT search locally without a server?
- How to configure a Qdrant multivector field with MaxSim?
- How is ColBERT different from single-vector search?
- When should ColBERT be used as a reranker?

## References
- https://www.youtube.com/watch?v=8LPgGU34RoE
- https://qdrant.tech/documentation/edge/ · https://docs.rs/qdrant-edge/latest/qdrant_edge/enum.MultiVectorComparator.html
- https://qdrant.github.io/fastembed/examples/Supported_Models/ · https://arxiv.org/abs/2004.12832
- https://qdrant.tech/documentation/tutorials-search-engineering/using-multivector-representations/

## Processing Notes
- License: standard YouTube → own-words rewrite; English ASR (380 lines; "Quadrant" = Qdrant, "Colbert" = ColBERT) kept out of the repo.
- Fact-check 2026-10-11 (independent search agent): 5 claims — confirmed 4, partly 1 (C4 speed claim), not found 0, contradicted 0.
- Narration issues flagged: training/noise conflation; "apple" result described as company; definition read from a search AI summary; unclear closing sentence marked as inaudible.
- 6 frames cropped to editor/visual content, 2 own SVGs.
