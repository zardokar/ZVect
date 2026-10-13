# RAG Tutorial 2026 #16: Hybrid Search combining Vector and Keyword Search — Harish Neel | AI - Claude Context
> Source: YouTube, Harish Neel | AI, "RAG Tutorial 2026 #16: Hybrid Search combining Vector and Keyword Search", 27:42, published 2025-09-10 · https://www.youtube.com/watch?v=7WEtNxVh1vo · Generated: 2026-10-13
> Companion: 20250910_Hybrid-Search-Vector-Keyword.html (Thai, iw mode `iwd`, 15 sections, 12 frames + 6 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license; English ASR captions); slide formulas, numbers and on-screen code transcribed exactly.
- Frames used: 01_problem-and-keyword, 02_bm25-slide-full, 03_why-both, 04_chunks-18, 05_vector-retriever-cosine, 06_bm25-space-company, 07_bm25-tesla, 08_hybrid-query2, 09_weighted-rrf-slide, 10_code-weights-07-03, 11_reality-50-50, 12_rerank-pipeline.
- Own SVG diagrams: layers, bars, compare, bars, bars, flow.
- Transcript SHA-256 (in-page = decoded): `8d0e06626bc20972539c23d5651687fb2ebeac883a5a9143b300f445dddd49ca`; kept in the session workspace only.

## TL;DR

Harish Neel (RAG Tutorial 2026 #16, 27:42) teaches hybrid search = vector (dense) search + keyword (sparse, BM25) search,
fused with weighted reciprocal rank fusion (RRF). The slides explain BM25 only in words (TF = how often the term is in
this chunk; IDF = how rare the term is across the collection) with three Tesla/Cybertruck examples; no formula is shown
or spoken. The LangChain demo uses 18 toy chunks, Chroma with `{"hnsw:space": "cosine"}` and k = 2, `BM25Retriever`
(rank_bm25) with k = 3, and `EnsembleRetriever(weights=[0.5, 0.5])` (later edited to `[0.7, 0.3]`). A slide computes
weighted RRF with k = 60 and weights 0.7 (vector) / 0.3 (keyword): X 0.0163, Y 0.0162, Z 0.0157, W 0.0109, V 0.0108,
A 0.0048, B 0.0047 (all recomputed; the presenter's webcam hides part of V, A, B). Production picture: 50 + 50 chunks
-> RRF -> ~30; multi-query hybrid with 5 variants and a second RRF -> ~25-40; then a reranker (a model, "not an LLM",
cheaper) reorders and the top 5 or 10 go to the LLM. The redo report displays 49 equations as MathML; this file gives
them in LaTeX.

## Key Concepts

- **Why both (slides).** Vector search: semantic meaning and context, but misses exact terms ("API key
  authentication" returns "user login security"). Keyword search: exact word matches, names, model numbers, technical
  jargon, but "dumb" (does not know car = automobile). Speaker's analogy: smart assistant (vectors) + precise librarian
  (keywords).
- **BM25 in the slide's words**, written as equations (writer's notation):
  - TF: $\mathrm{TF}(q,d) = f(q,d)$ = number of occurrences of term $q$ in chunk $d$. Slide example: $f(\text{Tesla},A)=2$, $f(\text{Tesla},B)=1$.
  - IDF: grows as $n(q)$, the number of chunks containing $q$, falls. Slide example: $n(\text{Tesla})=100$, $n(\text{Cybertruck})=5$ ($N$ not given).
  - Slide: "BM25 is an improved version of TF-IDF that prevents keyword stuffing and handles chunk length better" (speech at 7:06 says "of TF").
- **BM25 as actually run by the demo (writer's supplement; rank_bm25 `BM25Okapi`, defaults $k_1=1.5$, $b=0.75$, $\varepsilon=0.25$):**
  $$\mathrm{IDF}(q)=\ln\left(N-n(q)+0.5\right)-\ln\left(n(q)+0.5\right),\qquad \mathrm{IDF}(q)\leftarrow \varepsilon\cdot\overline{\mathrm{IDF}}\ \text{if}\ \mathrm{IDF}(q)<0$$
  $$\mathrm{BM25}(Q,d)=\sum_{q\in Q}\mathrm{IDF}(q)\cdot\frac{f(q,d)\,(k_1+1)}{f(q,d)+k_1\left(1-b+b\,\frac{|d|}{\mathrm{avgdl}}\right)}$$
  Lucene/Elasticsearch IDF variant: $\mathrm{IDF}(q)=\ln\left(1+\frac{N-n(q)+0.5}{n(q)+0.5}\right)$ (never negative).
  TF-part ceiling: $\lim_{f\to\infty} = k_1+1 = 2.5$ (saturation = "prevents keyword stuffing"); $|d|/\mathrm{avgdl}$ = length handling.
- **Cosine similarity (vector side; writer's supplement, speaker only names it):**
  $\cos(\mathbf q,\mathbf d)=\frac{\sum_i q_i d_i}{\sqrt{\sum_i q_i^2}\sqrt{\sum_i d_i^2}}$; Chroma with `hnsw:space = cosine` stores the distance $d_{\cos}=1-\cos(\mathbf q,\mathbf d)$ (Chroma default space is l2).
- **RRF (slides, exact):** `RRF_score = Σ (1 / (k + rank_position))`, `k = 60 (constant)`; reranking diagram:
  `RRF(d) = Σ 1 / (k + r(d))` with legend d = document being ranked, k = constant (typically 60), r(d) = rank of document d, Σ = sum across all rank lists.
  $$\mathrm{RRF}(d)=\sum \frac{1}{k+r(d)}$$
  with $k = 60$ (slide "k = 60 (constant)"; legend "typically 60"); the sum runs across all rank lists (legend meaning).
- **Weighted RRF (writer's general form of the slide's numeric entries 0.7/(60 + rank) and 0.3/(60 + rank); same as LangChain `score += weight / (rank + self.c)`, `c = 60`, rank from 1):**
  $$\mathrm{score}(d)=\sum_{i=1}^{R}\frac{w_i}{k+\mathrm{rank}_i(d)}$$
  Speaker: plain RRF had numerator 1 ($1/(60+1)=0.016393$, $1/(60+2)=0.016129$, $1/(60+3)=0.015873$); with weights the
  numerators become 0.7 (vector) and 0.3 (keyword). A document absent from a list gets nothing from it.
- **Weights in code:** "totally it's going to be one": $w_{vec}+w_{kw}=0.5+0.5=1$. LangChain does NOT enforce sum = 1
  (validator: same length as retrievers, at least one weight > 0). Scaling all weights by a constant does not change the order.
- **Union size:** `EnsembleRetriever` returns every unique document of all lists (no cut): $|\text{result}| = k_{vec}+k_{bm25}-|\text{overlap}| \le 2+3 = 5$.

## Implementation

Notebook `12_hybrid_search.ipynb` (VS Code, venv Python 3.13.5), transcribed from the screen:

```python
from langchain.retrievers import EnsembleRetriever, BM25Retriever
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from dotenv import load_dotenv
load_dotenv()
# %pip install rank_bm25

chunks = [
 "Microsoft acquired GitHub for 7.5 billion dollars in 2018.",
 "Tesla Cybertruck production ramp begins in 2024.",
 "Google is a large technology company with global operations.",
 "Tesla reported strong quarterly results. Tesla continues to lead in electric vehicles. Tesla announced new manufacturing f...",  # cut at screen edge
 "SpaceX develops Starship rockets for Mars missions.",
 "The tech giant acquired the code repository platform for software development.",
 "NVIDIA designs Starship architecture for their new GPUs.",
 "Tesla Tesla Tesla financial quarterly results improved significantly.",
 "Cybertruck reservations exceeded company expectations.",
 "Microsoft is a large technology company with global operations.",
 "Apple announced new iPhone features for developers.",
 "The apple orchard harvest was excellent this year.",
 "Python programming language is widely used in AI.",
 "The python snake can grow up to 20 feet long.",
 "Java coffee beans are imported from Indonesia.",
 "Java programming requires understanding of object-oriented concepts.",
 "Orange juice sales increased during winter months.",
 "Orange County reported new housing developments.",
]
documents = [Document(page_content=chunk, metadata={"source": f"chunk_{i}"}) for i, chunk in enumerate(chunks)]

embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(documents=documents, embedding=embedding_model,
                                    collection_metadata={"hnsw:space": "cosine"})
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 3

hybrid_retriever = EnsembleRetriever(retrievers=[vector_retriever, bm25_retriever],
                                     weights=[0.5, 0.5])  # later edited to [0.7, 0.3] (~20:45)
retrieved_chunks = hybrid_retriever.invoke("purchase cost 7.5 billion")
```

Answer generation (from the earlier answer-generation file): prompt `"Based on the following documents, please answer
this question: {test_query}\n\nDocuments:\n{chr(10).join([f"- {doc.page_content}" for doc in retrieved_chunks])}\n\nPlease
provide a clear, helpful answer using only the information from these documents. ..."`, `ChatOpenAI(model="gpt-4o")`,
messages `[SystemMessage("You are a helpful assistant."), HumanMessage(combined_input)]`, print `result.content`.

Outputs on screen:
- Vector, "space exploration company": SpaceX develops Starship rockets...; Cybertruck reservations exceeded...
- BM25, "Tesla" (loop `test_docs[:2]`): Tesla Tesla Tesla financial...; Tesla reported strong quarterly...; re-run shows the third (Tesla Cybertruck production...).
- BM25, "space exploration company": Cybertruck reservations...; Google is a large technology company...; Microsoft is a large technology company... (no SpaceX).
- BM25, "Cybertruck": Cybertruck reservations...; Tesla Cybertruck production...; Orange juice sales...
- Hybrid Q1 "purchase cost 7.5 billion": GitHub; Cybertruck reservations; Orange juice; Tesla Cybertruck production (4).
- Hybrid Q2 "electric vehicle manufacturing Cybertruck": Tesla Cybertruck production; Cybertruck reservations; Tesla reported strong... (3).
- Hybrid Q3 "company performance Tesla": Tesla Tesla Tesla...; Tesla reported strong...; Cybertruck reservations (3).

Recomputations (job folder `recompute.py`, stdlib + numpy; whitespace tokens as `BM25Retriever`'s default `text.split()`):
- 18-chunk corpus: N = 18, 150 tokens, avgdl = 8.3333 (chunk 4 ending assumed "facilities.", 17 tokens); no negative IDF.
- "Tesla": IDF = ln(15.5) - ln(3.5) = 1.4881; chunk 8 (tf 3, 8 tokens) 2.5052; chunk 4 (tf 3, 17 tokens) 1.9684;
  chunk 2 (tf 1, 7 tokens) 1.6035 -> order matches the screen; the speaker's "basically a tie" is separated by length normalisation.
- "space exploration company": only "company" matches (n = 3, IDF 1.4881): chunk 9 (5 tokens) 1.8147 > chunks 3 and 10 (9 tokens) 1.4364 (tie).
- "Cybertruck": chunk 9 2.3013, chunk 2 2.0335, third result has score 0 (BM25Retriever always returns k items; zero-score tie order depends on numpy argsort).
- Q1 BM25: only chunk 1 scores (> 0): 4.7427 ("7.5", "billion"); the other two BM25 slots are zero-score fillers.
- Q2 inferred: BM25 ranks Tesla reported (3.3471), Cybertruck reservations (2.3013), Tesla Cybertruck production (2.0335);
  if the vector list is [Tesla Cybertruck production, Cybertruck reservations] (inferred, not shown), RRF 0.5/0.5 gives
  0.5/61 + 0.5/63 = 0.016133, 0.5/62 + 0.5/62 = 0.016129, 0.5/61 = 0.008197 -> exactly the screen order.
- Slide TF example with clean tokens (A 9 tokens tf 2, B 4 tokens tf 1, avgdl 6.5): TF-part A 1.2714 > B 1.2093; with
  whitespace tokens "Tesla's" != "Tesla" so A has tf 1: 0.8525 < 1.2093 (B wins, opposite of the slide).
- Slide IDF example with ASSUMED N = 1000: IDF(Tesla) = ln 900.5 - ln 100.5 = 2.1928, IDF(Cybertruck) = ln 995.5 - ln 5.5 = 5.1985
  (Lucene 2.2986 / 5.2040). Speaker's "1 of 100 chunks": ln 99.5 - ln 1.5 = 4.1947.
- Slide Combined example (ASSUMED avgdl 4): "Tesla's Cybertruck production" 2.1928*1.1268 + 5.1985*1.1268 = 8.3282 vs
  "Tesla Tesla Tesla financial reports" 2.1928*1.5686 = 3.4397.
- Weighted RRF slide (k = 60, 0.7/0.3), every cell:
  X 0.7/61 + 0.3/62 = 0.011475 + 0.004839 = 0.016314; Y 0.7/62 + 0.3/61 = 0.011290 + 0.004918 = 0.016208;
  Z 0.7/63 + 0.3/65 = 0.011111 + 0.004615 = 0.015726; W 0.7/64 = 0.010938; V 0.7/65 = 0.010769;
  A 0.3/63 = 0.004762; B 0.3/64 = 0.004688. All 10 per-list slide values (0.0115 ... 0.0046) and all 7 finals match after rounding.
- Same lists, 0.5/0.5: X = Y 0.016261 (tie), Z 0.015629, A 0.007937, W = B 0.007813, V 0.007692 (same order as plain RRF 1/1:
  X = Y 0.032522, Z 0.031258, A 0.015873, W = B 0.015625, V 0.015385). Z/W at 0.7/0.3 = 1.44.

Pitfalls the source does not state (writer):
- Tokenisation is part of BM25: `text.split()` keeps case and punctuation ("Tesla's", "results.", "SpaceX" vs "space"). Thai needs a word segmenter.
- RRF does not cut: two 50-lists fuse to 50..100 unique documents; the slide's "~30" needs an unstated top-N cut.
- Equal weights reproduce plain RRF order, including exact ties (X = Y); define a deterministic tie-break.
- BM25 always fills k results, even with zero scores; hybrid output therefore can contain unrelated chunks (Q1 ranks 3-4).

## Quick Reference

| Item | Value | Time |
|---|---|---|
| Vector retriever | Chroma, `hnsw:space` cosine, k = 2, text-embedding-3-small | 10:38-12:26 |
| BM25 retriever | `BM25Retriever.from_documents`, k = 3, needs `rank_bm25` | 9:01, 12:26-13:10 |
| rank_bm25 defaults | k1 1.5, b 0.75, epsilon 0.25 (writer, source) | - |
| Ensemble weights | [0.5, 0.5] demo; [0.7, 0.3] edit at ~20:45 | 15:44-16:30 |
| RRF constant | k = 60 (slide; LangChain c = 60) | 19:03-20:23 |
| Slide weights | 0.7 vector / 0.3 keyword | 19:51-20:07 |
| Slide final order | X 0.0163, Y 0.0162, Z 0.0157, W 0.0109, V 0.0108, A 0.0048, B 0.0047 | ~19:20 |
| Production | 10k-20k documents; 50 per side; ~30 after RRF | 20:23-23:20 |
| Multi-query | 5 variants, second RRF, ~25-40 left | 21:25-22:52 |
| Final context | top 5 or top 10 after reranker | 23:10, 27:10 |

## Comparisons

| Criterion | Vector (dense) | Keyword (sparse, BM25) |
|---|---|---|
| Ranks by | cosine of embeddings | sum of IDF x saturated TF |
| Strength (slides) | meaning, context | exact terms, names, model numbers, jargon |
| Weakness (slides) | misses exact keywords | no synonyms (car vs automobile) |
| Demo evidence | "space exploration company" -> SpaceX first | same query -> chunks with "company" only |
| Scores comparable? | bounded | unbounded -> fuse by rank (RRF), not by score |

Weight settings on the slide's lists: 0.7/0.3 breaks the X/Y tie and lifts vector-only W, V above keyword-only A, B;
0.5/0.5 equals plain RRF (A 4th, X = Y tie).

## Fact Check

13 claims: 8 confirmed, 4 partly, 1 not found.
- Confirmed: BM25 uses TF and IDF (plus length); slide "improved TF-IDF, prevents stuffing, handles length" (k1 saturation, b length);
  BM25Retriever uses rank_bm25 (`BM25Okapi`, `text.split()`, default k 4); EnsembleRetriever = weighted RRF `weight/(rank + c)`, c = 60;
  slide RRF table recomputes exactly; k = 60 (Cormack et al. SIGIR 2009; LangChain); Chroma cosine (distance 1 - cos, default l2);
  Microsoft acquired GitHub for $7.5B in 2018.
- Partly: "BM25 = Best Matching 25, gold standard" (BM = best matching; "gold standard" is opinion); weights "total one" (not enforced);
  Microsoft Copilot hybrid on SharePoint (hybrid index, only some file types); Google early 2000s / Amazon keyword search (oversimplified for Google; Amazon not checked).
- Not found: "accuracy went at least 70% up" (personal anecdote, no metric).

## Open Questions & Extension Ideas

- Which top-N cut produces the slide's "~30 chunks" after fusing two 50-lists?
- The vector lists of the three hybrid queries are not shown; the writer's inference for Q2/Q3 could be checked by rerunning the notebook.
- Weight choice is not justified (0.7/0.3 is an example); tune on a labelled set.
- Extension (ZVect Q&A page, no LLM): BM25 (Thai segmentation first) + TF-IDF/SVD latent list, weighted RRF k = 60, equal weights first,
  deterministic tie-break, truncate each list to a stated N (e.g. 50), dedup by chunk id.
- Reranker comparison (Cohere and domain rerankers) is in the next video.

## Tags & Triggers

hybrid search, BM25, TF, IDF, rank_bm25, BM25Retriever, EnsembleRetriever, reciprocal rank fusion, weighted RRF, k = 60,
cosine similarity, Chroma, LangChain, reranker, multi-query, RAG.
Triggers: "how does hybrid search combine vector and keyword results", "BM25 formula TF IDF", "weighted RRF 0.7 0.3 example",
"EnsembleRetriever weights", "why does keyword search miss SpaceX", "why rerank after RRF".

## References

- Source video: https://www.youtube.com/watch?v=7WEtNxVh1vo (Harish Neel | AI, 2025-09-10)
- rank_bm25 source: https://github.com/dorianbrown/rank_bm25/blob/master/rank_bm25.py
- LangChain BM25Retriever: https://github.com/langchain-ai/langchain-community/blob/main/libs/community/langchain_community/retrievers/bm25.py
- LangChain EnsembleRetriever: https://github.com/langchain-ai/langchain/blob/master/libs/langchain/langchain_classic/retrievers/ensemble.py
- Chroma collection configuration: https://docs.trychroma.com/docs/collections/configure
- Okapi BM25: https://en.wikipedia.org/wiki/Okapi_BM25 ; Lucene BM25Similarity: https://lucene.apache.org/core/9_9_0/core/org/apache/lucene/search/similarities/BM25Similarity.html
- Cormack, Clarke, Buettcher, SIGIR 2009: https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf
- Microsoft 365 Copilot Retrieval API: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/api-reference/retrieval-api-overview
- Google 1998 paper: https://research.google/pubs/the-anatomy-of-a-large-scale-hypertextual-web-search-engine/
- TechCrunch 2018-06-04 GitHub acquisition: https://techcrunch.com/2018/06/04/microsoft-has-acquired-github-for-7-5b-in-microsoft-stock/
