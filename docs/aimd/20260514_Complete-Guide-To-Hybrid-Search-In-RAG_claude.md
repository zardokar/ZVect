# The Complete Guide to Hybrid Search in RAG (BM25 + Embeddings + Reranker) — Dave Ebbelaar - Claude Context
> Source: YouTube, Dave Ebbelaar, "The Complete Guide to Hybrid Search in RAG (BM25 + Embeddings + Reranker)", 59:17, published 2026-05-14 · https://www.youtube.com/watch?v=XvKiTfd6Xvo · Generated: 2026-10-13
> Companion: 20260514_Complete-Guide-To-Hybrid-Search-In-RAG.html (Thai, iw mode `iwd`, 18 sections, 23 frames + 4 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); code, numbers and on-screen formulas transcribed exactly.
- Frames used: 01_beir-structure, 02_qrels-table, 03_test-filter, 04_token-ids, 05_bm25-defaults, 06_bm25-docs-formula, 07_bm25-docs-tokenize, 08_bm25-output, 09_embed-code, 10_dense-docs-figure, 11_dense-normalize, 12_rrf-docs-figure, 13_rrf-code, 14_rrf-output, 15_rerank-code, 16_ndcg-docs-figure, 17_ndcg-results, 18_eval-prompt, 19_rerank-output, 20_apply-readme, 21_bm25-docs-phase3, 22_query-tokens, 23_relevant-docs.
- Own SVG diagrams: layers, bars, bars, bars.
- Transcript SHA-256 (in-page = decoded): `b5bc928aa966ecc70092f8526bee83503144957a84ee33a17ca7f7bb18c55911`; kept in the session workspace only.

## TL;DR
Dave Ebbelaar builds a hybrid retrieval stack from scratch on FiQA-2018 (BEIR): BM25 with bm25s (Lucene method), dense retrieval with OpenAI text-embedding-3-small stored as a numpy matrix, Reciprocal Rank Fusion (k = 60) over the top 50 of each, a Cohere rerank-v4.0-fast cross-encoder, and NDCG@10 evaluation on 50 sampled test queries (seed 42): BM25 28.01, Dense 40.06, Hybrid (RRF) 33.72, Hybrid + Rerank 47.71 (x100). He never reads a formula aloud, but the repo docs he puts on screen carry the BM25, cosine, RRF and NDCG formulas; the report displays all 41 equations (on-screen formulas, the bm25s variants from source, and worked recomputations). Finding: the docs/rrf.md figure prints 0.0246 for #406219, but its own ranks (BM25 3, dense 4) give 1/63 + 1/64 = 0.0315.

## Key Concepts
1. **Goal (0:00-1:00).** Production-style hybrid stack (BM25 + dense + RRF + reranker), built and evaluated on your own data; aimed at engineers who already know RAG basics.
2. **BEIR / FiQA (1:00-3:29; README figure on screen ~6:52).** Three parquet files linked by IDs: queries (`_id`, text), qrels (`query-id`, `corpus-id`, `score`), corpus (`_id`, title, text). FiQA: 57,638 forum posts, 648 labelled test questions. Example: query 4641 "Where should I park my rainy-day / emergency fund?" -> corpus 44594, 406219, 319954 (score 1).
3. **Exploration (3:29-7:42).** Title column empty for FiQA; qrels on screen 1,706 rows x 3 columns, all scores 1 (zeros not stored); first row query 8 -> doc 566392.
4. **Filter (7:42-9:37).** `test_query_ids = set(qrels["query-id"].astype(str))`; filtered to 648 test queries (speaker: "1,700 to start with", which matches the 1,706 qrels rows, i.e. 2.63 relevant docs per query). First test query on screen (~9:30): `_id 4641` "Where should I park my rainy-day / emergency fund?", relevant docs `[44594, 406219, 319954, 397358, 88327]`. Repo tree on screen: assets/, data/, docs/, utils/, .env.example, .gitignore, 1-explore-data.py ... 6-evaluate.py, README.
5. **Roadmap (9:37-11:23).** BM25 -> embeddings -> RRF -> re-ranking -> one pipeline; docs folder holds formulas and papers; BM25 = sparse retrieval, keyword overlap with weighting; good for exact terms, identifiers, rare words; misses paraphrase.
6. **bm25s setup (11:23-13:20).** Lists `doc_ids`, `doc_texts`; keep the full corpus (smaller corpus would "cheat" the retrieval task).
7. **Tokenize (13:20-17:11).** `bm25s.tokenize(doc_texts, stopwords="en")`: lowercase, strip punctuation, drop English stop words, integer ids + vocab; ids of doc 0 on screen `[0, 1, ..., 11, 5, 12, 4, ...]`; "5 is training".
8. **Index + method (17:11-19:25).** `bm25s.BM25()` tooltip: `k1=1.5, b=0.75, delta=0.5, method="lucene"`; saved index 33 MB for ~57,000 docs; indexing 1-2 s; no database needed. docs/bm25.md formula on screen ~17:52.
9. **BM25 query (19:25-22:09).** Query tokens on screen (~20:40): ids `[0, 1, 2, 3, 4, 5, 6]`, vocab `where 0, should 1, park 2, my 3, rainy 4, day 5, fund 6` (only "I" removed; the docs figure claims where/should/I/my are dropped). docs/bm25.md Phase 3 on screen (~18:00): tokenize with the same vocab (unknown words dropped), pull posting lists, score candidates with the formula, sort and return top-k; outputs `indices[0]`, `scores[0]`. Great at: exact terms, rare words, identifiers, acronyms, code symbols; bad at paraphrase ("auth logic" vs "authentication middleware" scores zero; `fund` vs `savings account`). Further reading: Robertson & Walker (1994), Robertson & Zaragoza, bm25s, Elastic. Query "Where should I park my rainy-day fund?", k = 10; scores `[13.760674, 8.884806, 7.9142647, 7.830278, 7.5942163, 7.1871395, 6.8798385, 6.7713947, 6.7225423, 6.572762]`; top 5 ids 376148, 32833, 416189, 579848, 580025. Ad 22:09-23:39 skipped.
10. **Why dense (23:56-25:13).** "Dense embeddings really win exactly where BM25 loses and lose exactly where BM25 wins."
11. **Embeddings (25:13-32:11).** text-embedding-3-small, 1,536 dims, batches of 256, cached `.npy`; matrix (57638, 1536) float32 = 354 MB (spoken "350 MB"); no vector database needed under roughly a million chunks (speaker's view).
12. **Dense search (32:11-36:45).** Normalise rows and query (safety step; OpenAI vectors are already unit length), `scores = doc_embeddings_normed @ query_vec`, `argsort`; cosine figure on screen ~34:40.
13. **Dense results (36:45-37:12).** Top 1 551719 (0.576) "parking spot ... money market account" document; dense `top_k = [53025, 3157, 40837, 47916, 50779, 56022, 53238, 719, 15828, 43284]` (row 47916 = doc 497993 is position 4 here and position 6 in the BM25 indices; row 3157 = doc 32833 is position 2 in both).
14. **RRF (37:12-39:27).** docs/rrf.md figure on screen ~37:55; k = 60 "smoothing factor" from the original paper; ranks only because BM25 and cosine scales differ ("apples to oranges").
15. **RRF code + output (39:27-44:34).** `K_RRF = 60`, `enumerate(ranking, start=1)`, `candidate_k = 50`; fused top 5 32833 (0.0323), 497993 (0.0308), 376148 (0.0276), 7625 (0.0272), 345428 (0.0269).
16. **Rerank (44:34-49:36).** Bi-encoder vs cross-encoder; Cohere rerank-v4.0-fast (free plan), `top_n = k`. Output on screen (~48:40), Hybrid + Cohere rerank-v4.0-fast: 1 [0.8242] 376148, 2 [0.8042] 580025, 3 [0.7723] 8088, 4 [0.7222] 285812, 5 [0.6890] 497993 (RRF had 32833, 497993, 376148, 7625, 345428); raw items e.g. index=33 0.658066, index=5 0.6456563, index=44 0.6420735; search_units=1.0. The "Duff Beer" doc 497993 moves from 2 to 5.
17. **NDCG@10 (49:36-55:24).** docs/ndcg.md on screen ~50:10-50:50; 50 random test queries, seed 42; results 28.01 / 40.06 / 33.72 / 47.71; "do you always need this entire stack? No"; dense + larger top-K + rerank "may even get to 50".
18. **Own data (55:24-58:29).** Spoken: chunk anything over ~1,000 tokens; build an eval set by generating one question per document with an LLM (prompt on screen); BEIR-style files. README on screen (~55:30), 7 steps: (1) collect the corpus with a stable `_id` (Notion, Zendesk, S3, a database); (2) chunking is required above the model's max input (8,191 tokens for text-embedding-3-small, ~6,000 English words) and worth doing above ~1,000 tokens; use a semantic splitter (`semantic-text-splitter` or `docling`), start ~512 tokens with 10-20% overlap; (3) text-embedding-3-small default, text-embedding-3-large for multilingual/jargon, `BAAI/bge-large-en-v1.5` if no API calls; (4) bm25s index; (5) `.npy` under ~5M chunks, else Qdrant, LanceDB or pgvector; (6) copy `utils/` (BM25Retriever, DenseRetriever, reciprocal_rank_fusion, rerank_with_cohere) into `search_hybrid(query, k=10)` with candidate_k=50, rerank top 50, return top 10; (7) LLM-generated eval set (docs/build-your-own-eval.md). Spoken vector-DB threshold "under a million chunks" vs README "~5M chunks".

## Implementation
Displayed equations (numbering as in the HTML). Origin: "screen" = visible in the video; "repo" = read from the repo, not on screen; "author" = report writer.

1. (author, screen numbers) `1706/648 \approx 2.63` relevant docs per query.
2. (screen, docs/bm25.md ~17:52) `\mathrm{score}(D,Q)=\sum_{q\in Q}\mathrm{IDF}(q)\cdot\frac{\mathrm{tf}(q,D)\cdot(k_1+1)}{\mathrm{tf}(q,D)+k_1\cdot\left(1-b+b\cdot\frac{|D|}{\mathrm{avgdl}}\right)}`, k1 ~ 1.5, b ~ 0.75.
3. (repo) `\mathrm{IDF}(q)=\ln\left(\frac{N-n(q)+0.5}{n(q)+0.5}+1\right)`.
4. (author, bm25s source) lucene/robertson TF: `\frac{tf}{k_1\left((1-b)+b\frac{l_d}{l_{avg}}\right)+tf}` (no k1+1; this is what the code runs).
5. robertson IDF `\ln\frac{N-df+0.5}{df+0.5}` (ratio clipped to >= 1 unless allow_negative). 6. atire `\ln(N/df)`. 7. bm25l `\ln\frac{N+1}{df+0.5}`. 8. bm25+ `\ln\frac{N+1}{df}`.
9. atire TF `\frac{tf(k_1+1)}{tf+k_1(1-b+b\,l_d/l_{avg})}`. 10. bm25l `c=\frac{tf}{1-b+b\,l_d/l_{avg}}`, `\frac{(k_1+1)(c+\delta)}{k_1+c+\delta}`. 11. bm25+ `\frac{(k_1+1)tf}{k_1(1-b+b\,l_d/l_{avg})+tf}+\delta`.
12-14. (author) N = 57,638, n = 120, tf = 3, average length, k1 = 1.5, b = 0.75: `\mathrm{IDF}=\ln\left(\frac{57638-120+0.5}{120+0.5}+1\right)\approx6.1703`; docs form `6.1703\cdot\frac{3\cdot2.5}{3+1.5\cdot1}\approx10.2838`; bm25s lucene `6.1703\cdot\frac{3}{1.5\cdot1+3}\approx4.1135` (ratio 2.5 = k1+1). Other methods: robertson 4.1121, atire 10.2907, bm25l 10.7980, bm25+ 13.3780.
15. (author, screen shape/dtype) `57638\times1536\times4=354{,}127{,}872` bytes ~ 354 MB.
16. (screen, docs/embeddings.md ~34:40) `\cos(\mathbf q,\mathbf d)=\frac{\mathbf q\cdot\mathbf d}{\|\mathbf q\|\,\|\mathbf d\|}`. 17. (screen box + repo) `\cos=\mathbf q\cdot\mathbf d` when `\|\mathbf q\|=\|\mathbf d\|=1`.
18. (code) `\mathbf v/\|\mathbf v\|`. 19. (code) `\mathbf s=E_{normed}\mathbf q`, `E_{normed}\in\mathbb R^{57638\times1536}`.
20. (author) `\cos15^\circ=0.966\approx0.97;\ \cos35^\circ=0.819\approx0.82;\ \cos75^\circ=0.259\approx0.26` (figure values). 21. (author, screen values) `\|\mathbf v\|\approx0.05688477/0.05688605\approx0.99998`.
22. (screen, docs/rrf.md ~37:55; 4-rrf.py docstring ~39:30) `\mathrm{RRF}(d)=\sum_{r\in R}\frac{1}{k+\mathrm{rank}_r(d)}`, k = 60, rank from 1, absent = 0.
23-25. (screen) #44594 `\frac{1}{60+1}+\frac{1}{60+2}=0.01639+0.01613=0.03252`; #319954 `\frac{1}{60+4}+\frac{1}{60+1}=0.01563+0.01639=0.03202`; #88210 `\frac{1}{60+2}+0=0.01613`.
26. (author, requested) #406219 `1/63+1/64=0.015873+0.015625=0.031498\approx0.0315\neq0.0246` (printed). No integer rank reproduces 0.0246 (0.0246 - 1/63 = 1/114.6); the fused order is unchanged.
27. (author) #52007 `1/63=0.01587` (printed 0.0159).
28. (repo) ranks 2 + 5: `1/62+1/65\approx0.0315`; rank 1 only: `1/61\approx0.0164`. 29. (repo k = 1, 1000; author k = 60) rank1/rank10 ratio: 5.5x, 1.009x, 1.15x.
30-32. (author, screen output ~43:10) 32833 `2/62=0.032258` (0.0323); 497993 `1/64+1/66=0.030777` (0.0308; BM25 rank 6 confirmed by the on-screen BM25 indices and dense top_k arrays, and the only fit); 376148 `1/61+1/89=0.027629` (0.0276; dense rank 29 inferred, the only fit).
33. (author) score scales: `13.7607/0.5762\approx23.9` (screen), `18.5/0.78\approx23.7` (repo example).
34. (screen, docs/ndcg.md) `\mathrm{DCG@}k=\sum_{i=1}^{k}\frac{\mathrm{rel}_i}{\log_2(i+1)}`. 35. (screen figure) `\mathrm{NDCG@}k=\mathrm{DCG@}k/\mathrm{IDCG@}k`.
36-38. (screen figure, recomputed) DCG@10 = 1.000 + 0.500 + 0.289 = 1.789; IDCG@10 = 1.000 + 0.631 + 0.500 = 2.131; NDCG@10 = 0.840 (repo function gives 0.8396).
39. (screen code) `\mathrm{dcg}=\sum_{r=0}^{k-1}\frac{\mathrm{rel}(\mathrm{pred}_r)}{\log_2(r+2)}` (0-based r).
40. (author) mean of the five rows shown in the NDCG figure = 0.704 vs printed "Mean NDCG@10 = 0.40" (hidden "..." rows; not checkable).
41. (author) 40.06 - 28.01 = +12.05; 33.72 - 40.06 = -6.34; 47.71 - 40.06 = +7.65.

Code (exact, on screen):
```python
tokens = bm25s.tokenize(doc_texts, stopwords="en")
retriever = bm25s.BM25()  # method='lucene' by default
retriever.index(tokens)
query_tokens = bm25s.tokenize([query], stopwords="en")
indices, scores = retriever.retrieve(query_tokens, k=k)

doc_embeddings_normed = doc_embeddings / np.linalg.norm(doc_embeddings, axis=1, keepdims=True)
query_vec = embed_batch([query])[0]
query_vec /= np.linalg.norm(query_vec)
scores = doc_embeddings_normed @ query_vec
top_k = np.argsort(-scores)[:k]

K_RRF = 60
def reciprocal_rank_fusion(rankings: list[list[str]], k: int = K_RRF) -> list[tuple[str, float]]:
    scores: dict[str, float] = defaultdict(float)
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] += 1.0 / (k + rank)
    return sorted(scores.items(), key=lambda x: -x[1])

response = co.rerank(model=RERANK_MODEL, query=query, documents=candidate_texts, top_n=k)

def ndcg_at_k(predicted_ids: list[str], relevant: dict[str, int], k: int = 10) -> float:
    dcg = sum(relevant.get(doc_id, 0) / math.log2(rank + 2) for rank, doc_id in enumerate(predicted_ids[:k]))
    ideal_rels = sorted(relevant.values(), reverse=True)[:k]
    idcg = sum(rel / math.log2(rank + 2) for rank, rel in enumerate(ideal_rels))
    return dcg / idcg if idcg > 0 else 0.0
```
Synthetic-query prompt (on screen, docs/build-your-own-eval.md): "You are a user with a question. The following document contains the answer. Generate a single realistic question that a user would ask, in their own words. Rules: - The question must be answerable by the document. - Use natural language, not the document's exact phrasing. - Avoid copying long phrases directly from the document. - Keep it under 20 words. Document: {doc_text} Question:". Recipe: sample 100 docs, gpt-4o-mini or similar, BEIR files (query_id, source_doc_id, 1), optional LLM-as-judge on top 20, point 6-evaluate.py at the data.

## Quick Reference
| Item | Value |
|---|---|
| Dataset | FiQA-2018 (BEIR): 57,638 docs, 648 test queries, 1,706 qrels rows |
| BM25 | bm25s `BM25(k1=1.5, b=0.75, delta=0.5, method="lucene")`, stopwords="en" |
| BM25 index | 33 MB, ~1-2 s |
| Embeddings | text-embedding-3-small, 1,536 dims, batch 256, (57638, 1536) float32 ~ 354 MB |
| Similarity | unit vectors, dot product via `@` |
| RRF | sum 1/(60 + rank), rank from 1, candidate_k = 50, return top 10 |
| Reranker | Cohere rerank-v4.0-fast, top_n = 10 |
| Eval | NDCG@10 x100, 50 sampled test queries, SEED = 42 |
| Results | BM25 28.01, Dense 40.06, Hybrid (RRF) 33.72, Hybrid + Rerank 47.71 |
| Rerank top-5 (example query) | 376148 0.8242, 580025 0.8042, 8088 0.7723, 285812 0.7222, 497993 0.6890 |
| README limits | 8,191-token input (~6,000 words); .npy under ~5M chunks else Qdrant / LanceDB / pgvector |
| BM25 top score (example query) | 13.7607 (doc 376148) |
| Dense top score | 0.5762 (doc 551719) |
| Fused top | 32833 (0.0323), BM25 rank 2 and dense rank 2 |
| Chunking advice | split anything over ~1,000 tokens (README: ~512 tokens, 10-20% overlap) |
| Eval-set recipe | 100 docs, 1 question each, <= 20 words, gpt-4o-mini |

## Comparisons
- BM25 vs Dense vs RRF vs Rerank on FiQA (50 queries): 28.01 / 40.06 / 33.72 / 47.71; RRF is 6.34 below dense (between the two, 47.4% of the way from BM25 to dense); rerank is 7.65 above dense.
- docs formula (with k1+1) vs bm25s lucene code (without): same ranking per query, scores differ by k1+1 = 2.5.
- Repo's "expected" FiQA ranges (docs/ndcg.md, not on screen): BM25 ~0.24, dense ~0.31, RRF ~0.35, rerank ~0.40+; the run in the video has RRF below dense, unlike those ranges. BEIR paper BM25 on full FiQA: 0.236.

## Fact Check
15 claims: 8 confirmed, 5 partly confirmed, 2 contradicted.
- Contradicted (2): docs/bm25.md figure says tokenization drops where/should/I/my; the on-screen bm25s query tokens keep where, should, my (only "I" dropped).
- Confirmed: FiQA in BEIR (648 test queries, 57,638 docs); bm25s defaults (Lucene method, k1 1.5, b 0.75); RRF k = 60 from Cormack et al. 2009; text-embedding-3-small 1,536 dims; OpenAI embeddings are unit length (FAQ; screen norm 0.99998); Cohere rerank-v4.0-fast exists; BM25 weak on FiQA (BEIR: 0.236); NDCG@10 is the headline metric of BEIR and TREC Deep Learning (MS MARCO passage ranking uses MRR@10).
- Partly: "1,700 -> 648" (1,706 is the qrels row count, not queries); "350 MB for 56,000 docs" (354 MB correct, 57,638 docs); docs formula with k1+1 (correct textbook form, but the code runs the Lucene form without it); "k1=1.5, b=0.75 from the original BM25 paper" (Lucene/Elasticsearch default k1 = 1.2); "cosine in [0, 1]" (mathematically [-1, 1]).
- Contradicted: docs/rrf.md figure value 0.0246 for #406219 (should be 0.0315 from its ranks 3 and 4).

## Open Questions & Extension Ideas
- The video's 50-query sample is small; the RRF < Dense result should be re-run on all 648 test queries before generalising.
- Weighted RRF or a larger candidate_k for the weaker retriever may change the RRF vs dense ordering; the speaker suggests trying dense-only + larger top-K + rerank.
- Which qrels belong to the exact query run on screen? The docs figures use 44594 / 406219 / 319954, none of which appear in the live top-5 lists.
- For a no-LLM Thai Q&A page: BM25 (with a Thai word segmenter) + a latent-space retriever fused by RRF (k = 60) mirrors this stack without the reranker; build the eval set with an LLM offline only.

## Tags & Triggers
hybrid search, RAG, BM25, bm25s, Lucene, k1, b, BM25L, BM25+, ATIRE, text-embedding-3-small, cosine similarity, numpy dot product, Reciprocal Rank Fusion, RRF k=60, Cohere rerank-v4.0-fast, cross-encoder, NDCG@10, DCG, IDCG, BEIR, FiQA, synthetic eval set, Dave Ebbelaar.
Triggers: "build hybrid search without a vector database", "RRF formula worked example", "bm25s lucene vs textbook BM25", "why RRF scored below dense", "compute NDCG@10", "generate eval queries from documents".

## References
- Video: https://www.youtube.com/watch?v=XvKiTfd6Xvo (2026-05-14)
- Repo: https://github.com/daveebbelaar/ai-cookbook/tree/main/knowledge/hybrid-retrieval (README, docs/*.md, 4-rrf.py, 6-evaluate.py; read via WebFetch of raw.githubusercontent.com)
- bm25s: https://github.com/xhluca/bm25s; arXiv:2407.03618
- BEIR: arXiv:2104.08663; https://github.com/beir-cellar/beir
- Cormack, Clarke, Buettcher (SIGIR 2009): https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf
- Robertson & Walker (1994), Some Simple Effective Approximations to the 2-Poisson Model for Probabilistic Weighted Retrieval (cited on screen in docs/bm25.md)
- Jarvelin & Kekalainen (2002), NDCG
- Lucene LegacyBM25Similarity javadoc 8.1.1
- OpenAI embeddings FAQ: https://help.openai.com/en/articles/6824809-embeddings-faq
- Cohere Rerank: https://docs.cohere.com/docs/rerank-overview
- Recompute script: recompute.py (stdlib) in the job folder; output recompute.out
