# "Why vector search is not enough and we need BM25" - Claude Context
> Source: YouTube, Diffbot, "Why vector search is not enough and we need BM25", 8:14, published 2024-09-26 · https://www.youtube.com/watch?v=3FbJOKhLv9M · Generated: 2026-10-24
> Companion: 20240926_Why-Vector-Search-Is-Not-Enough-And-We-Need-BM25.html (Thai, iw mode `iwd`, 5 sections, 12 frames + 7 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license), every point and number kept.
- Frames used: P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12.
- Own SVG diagrams: flow, compare, compare, flow, heatmap, flow, line.
- Transcript SHA-256 (in-page = decoded): `17de6208117389b1ca92059b3a7e3c04de480f832454279dd3b563f7e9342234`; kept in the session workspace only.

## TL;DR

- Diffbot (8:14, 2024-09-26) argues that vector search on its own does not work well for calculations, sorting or filtering, and that BM25 should complement it.
- Cause 1, numbers: LLMs and embeddings place numbers by how they are used in context, not on a number line. The position of 100 "isn't necessarily" halfway between 50 and 150. 50 could cluster with "half" or "midpoint", and 100 could sit closer to "full" or "century".
- Cause 2, time words and rankings: "latest" might sit close to "newest" or "current" because the words are usually used together, not because of a timeline. Embeddings capture relative concepts well (good is closer to excellent than to poor) but struggle with absolute rankings. Finding the highest or lowest means comparing lots of vectors, which can get quite computationally expensive as data grows.
- Root causes: uncommon numbers (such as 3458723098) are tokenized into several pieces, and contextual embeddings shift with usage. That flexibility can sometimes backfire: a query for "apple pie" might return cherry, peach or even meat pie recipes.
- Fix: BM25 uses sparse vectors (non-zero only for terms that appear), so it supports exact keyword matching. It ranks with three mechanisms: term-frequency saturation, IDF, and document-length normalisation.
- Fact check: 8 claims, confirmed 7 · partly 1 · not found 0 · contradicted 0. The partly row: embeddings do keep a rough sense of magnitude, so the number line is rough rather than absent.

## Key Concepts

- **Dense vector (semantic):** every dimension holds a value. Each dimension captures some aspect of meaning or context. Example on screen (4:59): 0.1, -0.3, 0.7, 0.2, 0.5, -0.1, 0.4, 0.6, -0.2, 0.3. For "King", one dimension might be high for royalty, another for leadership, another for masculinity.
- **Sparse vector (BM25):** most dimensions are zero. A dimension is non-zero only when its term is present in the document. Example on screen (5:31): 0 0 3 0 2 0 0 1 0 0, captioned "Non-zero values only for exact keyword matches." The clip does not say whether 3, 2 and 1 are counts or weights.
- **Numbers as language:** numbers are processed as part of language rather than as values. The clip shows two chat models multiplying 3587457634354 × 123984756 wrongly: Claude gives 444,807,477,290,660,344,704 and ChatGPT gives 444,601,206,156,198,647,224. A calculator shows 4.447900594557179e20, and the exact product is 444,790,059,455,717,907,624 (our computation). ChatGPT answers 150 − 100 = 50 correctly, which the speaker explains as recall from training.
- **Vector-difference directions:** king − queen closely parallels man − woman (a gender direction). On screen: E(France) − E(Paris) ≈ E(Poland) − E(Warsaw) ("capital city"). For "100-day challenge" vs "30-day challenge", the difference direction can possibly capture commitment or duration, not the exact 70-day gap (the frame is labelled "For illustration only, not accurate vectors").
- **Tokenizing numbers:** an uncommon number such as 3458723098 can be split many ways ("3458" "723" "098", "34587" "23098", single digits and others). Which split is used depends a lot on training, and there is no guarantee. For a number like this, it is split into multiple parts, never kept as one piece.
- **Contextual embeddings:** positions are relative and shift with usage. This finds related concepts without exact keyword matches, but it can give imprecise results.
- **BM25 TF saturation:** past a threshold, more mentions stop adding value. Mentioning "RAG" 50 times gives no advantage over 10 times, which blocks keyword stuffing.
- **IDF:** common terms such as "the" and "system" are down-weighted. Rare, specific terms such as "hybrid search" and "reranking techniques" get more weight.
- **Length normalisation:** long documents may contain more information but are not necessarily more informative. Shorter documents may score higher with the same term frequency.

## Implementation

The BM25 IDF exactly as shown in the clip (7:28). N is the number of documents, and df_t is the number of documents that contain the term:

```
IDF = log( (N - df_t + 0.5) / (df_t + 0.5) + 1 )
```

The full BM25 score is our addition (the clip does not show it). It comes from Robertson & Zaragoza and Stanford CS276:

```
score(D, Q) = sum over t in Q of  IDF(t) * f(t,D) * (k1 + 1) / ( f(t,D) + k1 * (1 - b + b * |D| / avgdl) )
```

- k1 controls saturation, and each term's TF part is bounded by k1 + 1 (so its full score is at most IDF × (k1 + 1)). Typical values are 1.2–2.
- b controls length normalisation (≈ 0.75). b = 0 turns it off.
- avgdl is the average document length in the corpus.

Worked numbers (ours, natural log, N = 100,000; the df values are read approximately from the clip's IDF chart):

| term | df_t | IDF |
|---|---|---|
| hybrid search | 1,000 | 4.605 |
| system | 30,000 | 1.204 |
| the | 90,000 | 0.105 |

These numbers give the same ordering as the clip's chart, but the chart's log-axis values sit lower, so read the chart as qualitative. Below is the TF part with k1 = 1.2 and b = 0.75 (ours):

| tf | 1 | 4 | 10 | 24 | 50 |
|---|---|---|---|---|---|
| doc 1/5 of avg length | 1.49 | 1.96 | 2.10 | 2.16 | 2.18 |
| avg length | 1.00 | 1.69 | 1.96 | 2.10 | 2.15 |
| 5× avg length | 0.38 | 1.00 | 1.49 | 1.83 | 2.01 |

So the clip's "50 vs 10 mentions" example is 2.15 vs 1.96 (about +10%) for an average-length document. In the standard formula every length approaches the same ceiling (k1 + 1 = 2.2) and length only changes how fast. The clip's 7:49 chart draws different ceilings for the three lengths, which is illustrative.

Buildable steps for a hybrid retriever (ZVect / RAG), all ours:
1. Index the corpus twice: dense embeddings for meaning, and an inverted index (term → doc → tf, plus doc lengths and avgdl) for BM25. Store only the non-zero terms.
2. Tokenizer first: BM25 matches only terms that tokenize identically in the query and the documents. Thai has no spaces between words, so test word segmentation before tuning anything else.
3. Score BM25 with configurable k1 and b, starting at 1.2 and 0.75.
4. Fuse the two rankings with Reciprocal Rank Fusion, c(d) = Σ_r 1 / (k + rank_r(d)). RRF uses ranks only, so the two score scales never need calibrating.
5. Route structured intents away from vectors. Words such as latest, newest, highest, cheapest, or a number constraint should hit metadata filters or sorts on date and price fields. The clip's description names metadata filtering as a valid fix it does not cover.
6. Send arithmetic to a tool (Python or a calculator), not to the model.
7. Unit tests:
   - at tf 50 the TF part is ≤ k1 + 1;
   - a term in every document has IDF near 0;
   - with the same tf, a shorter document outscores a longer one;
   - an "apple pie" query ranks the apple pie recipe above cherry, peach and meat pies when BM25 is fused in.

## Quick Reference

| item | value | time |
|---|---|---|
| weak spots of vector search | calculations, sorting, filtering | 0:00 |
| numbers example | 50, 100, 150, step 50 | 0:08 |
| demo code | gensim `glove-wiki-gigaword-50`, `PCA(n_components=3)` | 0:32 |
| analogy directions | king−queen ∥ man−woman; France−Paris ≈ Poland−Warsaw | 0:54–1:08 |
| 100-day vs 30-day | 70-day gap; direction ≈ commitment / duration | 1:13 |
| arithmetic | 150 − 100 recalled; long multiplication wrong in Claude and ChatGPT | 1:53–2:06 |
| time words | latest ~ newest / current by co-usage | 2:10 |
| relative vs absolute | good closer to excellent than poor; rankings hard | 2:49 |
| tokenizing | 3458723098 split many ways | 3:26 |
| imprecise result | apple pie → cherry / peach / meat pie | 3:58 |
| saturation | past a threshold, RAG 50× ≈ no gain over 10× | 6:47 |
| IDF | log((N − df_t + 0.5)/(df_t + 0.5) + 1) | 7:28 |
| BM25 params (fact check) | k1 1.2–2, b ≈ 0.75 | — |
| Contextual Retrieval (fact check) | −49% failed retrievals, −67% with reranking | — |

## Comparisons

| | dense vector (vector search) | sparse vector (BM25) |
|---|---|---|
| values | every dimension non-zero | non-zero only for present terms |
| strength | related concepts without exact matches; relative concepts | exact keyword matching; precise retrieval |
| weakness | numbers, time order, absolute rankings; can be imprecise | (clip: none stated) |
| scoring | closeness in semantic space | TF saturation × IDF, length-normalised |

Classic TF vs BM25 TF (6:44): the classic curve keeps rising (≈ 5.3 at tf 28, close to √28, so probably Lucene's classic √tf; our inference). BM25 flattens near 2.5.

## Fact Check

confirmed 7 · partly 1 · not found 0 · contradicted 0

- D01 confirmed (from the clip description): Anthropic's Contextual Retrieval combines Contextual Embeddings and Contextual BM25. Failed retrievals fall by 49%, and by 67% with reranking (35% with Contextual Embeddings alone; failure = the wanted chunk not in the top 20). Read via InfoQ, because Anthropic's page could not be fetched.
- D02 partly: numbers are placed by usage, not on a number line. GloVe and word2vec encode magnitude accurately up to 1,000, and ELMo does best (Wallace et al. 2019). Naik et al. 2019 find an approximate notion of magnitude.
- D03 confirmed: word2vec analogies (King − Man + Woman ≈ Queen; capital-city pairs).
- D04 confirmed: arithmetic accuracy tracks pretraining term frequency. The top 10% of terms beat the bottom 10% by more than 70 points (Razeghi et al. 2022).
- D05 confirmed: LLaMA and PaLM split numbers into single digits, and GPT-3.5/4 into 1–3-digit chunks (Singh & Strouse 2024).
- D06 confirmed for transformers: a static embedding explains < 5% of the variance of contextual vectors. word2vec and GloVe, including the clip's GloVe demo, are static.
- D07 confirmed: sparse term vectors vs dense embeddings (Stanford CS276).
- D08 confirmed: BM25 = bounded TF (k1), length normalisation (b, avgdl) and IDF (Robertson & Zaragoza).

## Open Questions & Extension Ideas

- Our own evaluation: build a small ZVect benchmark of numeric queries, time-word queries, exact-name queries and paraphrase queries. Measure recall@k for dense only, BM25 only, and RRF fusion.
- Tune k1 and b per corpus (short FAQ chunks vs long docs), and check whether b should drop when chunks are length-capped.
- Test Thai tokenization quality as the first-order factor for BM25 recall on Thai text.
- For fine-tuning: add held-out random long-number arithmetic separate from frequent simple sums, to tell computation apart from recall. Prefer tool calls for arithmetic.
- Try learned sparse models (e.g. SPLADE) as a middle ground. This is not covered by the clip.
- Contextual Retrieval: prepend chunk context before both embedding and BM25 indexing, then compare against plain chunks.

## Tags & Triggers

tags: vector search, BM25, sparse vector, dense vector, embeddings, IDF, TF saturation, length normalisation, hybrid search, RRF, RAG, tokenization, numeracy

- Why can't vector search find the latest or cheapest item?
- What is the difference between dense and sparse vectors?
- How does BM25 stop keyword stuffing?
- What is BM25's IDF formula?
- Why do LLMs get long multiplication wrong but 150 − 100 right?

## References

- Clip: Diffbot, "Why vector search is not enough and we need BM25", https://www.youtube.com/watch?v=3FbJOKhLv9M
- Animation code: https://github.com/leannchen86/vector-search-not-enough-manim
- https://www.anthropic.com/news/contextual-retrieval · https://www.infoq.com/news/2024/09/anthropic-contextual-retrieval/
- https://arxiv.org/abs/1909.07940 · https://aclanthology.org/P19-1329/ · https://arxiv.org/abs/1301.3781
- https://arxiv.org/abs/2202.07206 · https://arxiv.org/abs/2402.14903 · https://arxiv.org/abs/1909.00512
- https://web.stanford.edu/class/cs276/handouts/lecture12-bm25etc.pdf · https://nowpublishers.com/article/Details/INR-019

## Equations (LaTeX)
1. $$ E(\text{king}) - E(\text{queen}) \approx E(\text{man}) - E(\text{woman}) $$
2. $$ E(\text{France}) - E(\text{Paris}) \approx E(\text{Poland}) - E(\text{Warsaw}) $$
3. $$ \mathrm{IDF} = \log\left(\frac{N - df_t + 0.5}{df_t + 0.5} + 1\right) $$
4. $$ \text{score}(D,Q) = \sum_{t \in Q} \mathrm{IDF}(t) \cdot \frac{f(t,D)\,(k_1+1)}{f(t,D) + k_1\left(1 - b + b\,\frac{|D|}{\mathrm{avgdl}}\right)} $$
