# Latent Semantic Analysis | Back Talks — Tania (Back) - Claude Context
> Source: YouTube, Back (talk by Tania), "Latent Semantic Analysis | Back Talks", 42:08, published 2021-02-17 · https://www.youtube.com/watch?v=DbzN_gMh3Mw · Generated: 2026-10-19
> Companion: 20210217_Latent-Semantic-Analysis-Back-Talks.html (Thai, iw mode `iwd`, 16 sections, 8 frames + 17 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: S03, S08, S15, S18, S19, S20, S23, S24.
- Own SVG diagrams: flow, compare, flow, compare, layers, heatmap, process, compare, plane, shapes, matrix, flow, vector, compare, algo, algo, flow.
- Transcript SHA-256 (in-page = decoded): `a025f8b5b97caf8a8e617f66d7024762f6376fb15e8092d65aecdbb46832ddb3`; kept in the session workspace only.

## TL;DR

A 42-minute internal talk at Back (speaker: Tania; webcam label "Tania Vasilikioti") on Latent Semantic Analysis (LSA), aimed at colleagues new to NLP. It walks one toy corpus (4 documents, 9 words) from raw text through bag of words, TF-IDF (an optional weighting; the toy example feeds raw counts to SVD), SVD, and a scikit-learn reduction from 9 to 2 dimensions. Then it covers what topic vectors allow (cosine similarity, faster retrieval), pros and cons, and how Back's new knowledge-base (KB) suggester uses LSA: PCA-based, cosine ranking, top x above a threshold, with plans to add user feedback. Every number on the slides was read off the frames and recomputed: the toy-corpus outputs reproduce (all 6-decimal values; the 16-digit doc-topic values to about 15 significant digits) with `CountVectorizer()` + `TruncatedSVD(n_components=2)` in scikit-learn 1.9.1. Errors in the source: "no meaning lost" when reducing dimensions (wrong; truncation is lossy unless the discarded singular values are 0, Eckart-Young), "SVD is like JPEG" (JPEG uses DCT), "PCA is simpler" (PCA centers the data, which densifies sparse matrices), "libraries figure out stop words" (scikit-learn's default is stop_words=None; checked for scikit-learn only), and a slide row label typo ("the quick red fox" for "the quick red dog").

## Key Concepts

- **LSA = truncated SVD of a document-term matrix** (counts or TF-IDF). It is unsupervised and also called LSI in retrieval. Pipeline slide (credit Databricks): Raw Text Data -> Document-Term Matrix -> Singular Value Decomposition -> Topic-Encoded Data. The middle two steps are LSA.
- **Latent:** the topics are not labelled anywhere. They are directions found from co-occurrence. Topics are abstract ("dimension 1, 2, ..."); you only choose how many.
- **Why (slide "Why should I care?"):** human language -> machine language; synonymy ("I want to go on holiday" vs "What is the vacation policy?"); polysemy ("Mole: a small burrowing mammal / a spot of pigmentation on the skin"), which LSA helps with only "to some degree"; "200 dimensions (for example), instead of 200,000 (more on this later) -> dimensionality reduction"; "Can calculate how close two texts are in their meaning".
- **Definitions (slide):** Document = a collection of words of arbitrary length ("E.g. 1 tweet, Romeo & Juliet"). Corpus / Body = a collection of documents. Dictionary = "the set of all words or combinations of words ("Elon Musk") that we want to consider". Topic = "a collection of words that co-occur (appear together in the same document)". In speech: the corpus decides which topics can be found (a medical corpus has no dog training); multi-word dictionary entries are n-grams (ASR: "engrams").
- **Bag of words:** one row per document, one column per dictionary word, cell = count. The toy example happens to be binary; the speaker stresses that counts can be 2, 3, ...
- **TF-IDF:** TF rewards a term that is frequent in a document; IDF penalises a term that appears in many documents ("the" in every Wikipedia article vs "Harry Potter"). Two different formula pairs appear on two slides (see Implementation). The speaker notes that "there's different formulas" for IDF and tricks to avoid division by zero.
- **SVD in LSA (slide credit Vitomir Kovanovic):** "Nothing more than a singular value decomposition (SVD) of document-term matrix: Find three matrices U, Σ and V so that: X = UΣVᵗ". The three parts are TERMS×TOPICS (U), a diagonal "TOPIC IMPORTANCE" (Σ), and TOPICS×DOCUMENTS (Vᵗ). This slide and the Wikipedia SVD slide put terms in rows and documents in columns. The BOW table and scikit-learn put documents in rows.
- **Term-topic matrix:** how much each word contributes to each topic. A new document's topic score = sum over words of (count × weight). The speaker says "add up" the weights, which is exact only for 0/1 counts.
- **Uses of topic vectors:** vector arithmetic (subreddit "trump minus cats", an example she never showed), cosine similarity (angle) as semantic distance, Euclidean distance, faster clustering and retrieval with fewer dimensions ("200 000" -> "200").
- **Choosing k:** "There is no obvious way to choose the number of dimensions/components". The speaker says the choice "usually has to do more with some other downstream tasks", so tune k on the downstream task (her example: spam vs not-spam classification).
- **LDA vs LSA:** for human-interpretable topics use LDA (the slide writes "LDiA"; ASR "ldia", "latin dirichlet allocation").

## Implementation

### Toy corpus (slides 9:05, 11:07; exact)

```python
corpus = ["the quick brown fox",
          "the slow brown dog",     # speech ASR "the slope dog"; the slide says "slow brown dog"
          "the quick red dog",
          "the lazy yellow fox"]
# slide "The ingredients" dictionary (as written): {"the", "quick", "brown", "Fox", "slow", "dog", "red", "lazy", "yellow"}
```

BOW table on the slide (columns alphabetical, lowercased, matching CountVectorizer). Row 3 is labelled "the quick red fox" on the slide, which is a typo: its numbers and the list below it are "the quick red dog".

| document | brown | dog | fox | lazy | quick | red | slow | the | yellow |
|---|---|---|---|---|---|---|---|---|---|
| the quick brown fox | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 1 | 0 |
| the slow brown dog | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| the quick red dog | 0 | 1 | 0 | 0 | 1 | 1 | 0 | 1 | 0 |
| the lazy yellow fox | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |

The numpy print on the slide (verbatim, also shown on the Recap slide and the "Back to 🦊 + 🐕" slide):

```python
matrix([[1, 0, 1, 0, 1, 0, 0, 1, 0],
        [1, 1, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 1, 1, 0, 1, 0],
        [0, 0, 1, 1, 0, 0, 0, 1, 1]],
dtype=int64)
```

The Recap slide adds: "+ dictionary like {0: "brown", 1: "dog", ...}". Store the column -> word map with the matrix.

### TF-IDF formulas, exactly as on the slides

- Text slide (15:40): `TF(t) = (Number of times term t appears in a document) / (Total number of terms in the document)`; `IDF(t) = log_e(Total number of documents / Number of documents with term t in it)`.
- Hand-drawn card (17:40, credit "Machine Learning Flashcards"): `TF-IDF = TF(t, d) x IDF(t)`; TF = "Number of times term t appears in a doc, d" (a raw count); `IDF = log[(1 + n) / (1 + df(d, t))] + 1`, with n = "# of documents" and df = "Document frequency of the term t".
- The card matches scikit-learn's default (`smooth_idf=True`, raw tf, then L2-normalised rows, `norm='l2'`). The text slide is the textbook form. Author note: df depends on t only, so the card's "df(d, t)" notation is odd.

### "Bag of Words vs TF-IDF example" slide (~18:08-19:00, credit Mukesh Chaudhary; exact)

```
Count Vectorizer
      blue  bright  sky  sun
Doc1     1       0    1    0
Doc2     0       1    0    1

TD-IDF Vectorizer            # slide typo for TF-IDF
          blue    bright       sky       sun
Doc1  0.707107  0.000000  0.707107  0.000000
Doc2  0.000000  0.707107  0.000000  0.707107
```

Doc1 = "blue sky", Doc2 = "the bright sun" (from speech). "the" has no column, so stop words were most likely removed (or the source documents had no "the"). Recomputed: `TfidfVectorizer(stop_words='english')` gives exactly 0.707107 (= 1/sqrt(2), only L2 normalisation shapes the numbers, because every term has the same idf). Without stop-word removal, Doc2 = bright, sun, the at 1/sqrt(3) = 0.577 each.

### SVD slides

- Wikipedia figure (20:13): X (m×n, rows t_i^T = terms, columns d_j = documents) = U [u_1 ... u_l] · Σ diag(σ_1 ... σ_l) · V^T [v_1 ... v_l]; t̂_i^T is a term in topic space, d̂_j a document in topic space.
- Kovanovic slide (21:40): X (TERMS×DOCUMENTS, labelled 6x4) = U (TERMS×TOPICS, 6x4) × Σ ("TOPIC IMPORTANCE", 4x4 diagonal) × Vᵗ (TOPICS×DOCUMENTS, 4x4). Storage example, verbatim: "For example with 5 topics, 1000 documents and 1000 word vocabulary: Original matrix: 1000 x 1000 = 10^6; LSA representation: 5x1000 + 5 + 5x1000 ~ 10^4 -> 100 times less space!" Check: 1,000,000 / 10,005 = 99.95.
- Speech (21:05): each document "will maybe contain only like 100th of all the possible words at maximum", so the matrix is mostly zeros.

### scikit-learn 9 -> 2 dimensions (slides 22:59, 23:41; exact; reproduced)

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import TruncatedSVD
X = CountVectorizer().fit_transform(corpus)          # 4 x 9, columns brown..yellow
svd = TruncatedSVD(n_components=2)                    # random_state 0/1/42: same 6-decimal values; trailing digits of the 16-digit values vary (randomized SVD)
D = svd.fit_transform(X)                              # document -> topic (4 x 2)
W = svd.components_.T                                 # term -> topic (9 x 2)
# Reproduction code written for this report; the clip shows only the outputs.
```

Document -> topic (slide, verbatim digits):

| document | topic_1 | topic_2 |
|---|---|---|
| the quick brown fox | 1.6949049311864635 | 0.2995240544049736 |
| the slow brown dog | 1.5158511142025999 | -0.769110367236386 |
| the quick red dog | 1.5158511142025997 | -0.769110367236389 |
| the lazy yellow fox | 1.266186062866738 | 1.4405851327176706 |

Term -> topic (slide "How much does each word contribute to each topic? (term-topic matrix)"):

| word | topic_1 | topic_2 |
|---|---|---|
| brown | 0.353937 | -0.140256 |
| dog | 0.334199 | -0.459436 |
| fox | 0.326416 | 0.519736 |
| lazy | 0.139578 | 0.430274 |
| quick | 0.353937 | -0.140256 |
| red | 0.167100 | -0.229718 |
| slow | 0.167100 | -0.229718 |
| the | 0.660615 | 0.060300 |
| yellow | 0.139578 | 0.430274 |

- Spoken at 23:47: "I take 0.35 plus 0.32 plus 0.35 etc, add up all these terms" (shortened readings of this table: 0.35 rounded from 0.353937, 0.32 truncated from 0.326416; the "etc" is "the" 0.660615). Check: D[0,0] = 0.353937 + 0.326416 + 0.353937 + 0.660615 = 1.694905, i.e. D = X · W.
- Relation to X = U Σ Vᵀ (documents as rows, X is 4×9): W = V (9×2, i.e. `components_.T`), D = U Σ = X V (4×2); kept singular values σ1 ≈ 3.0119, σ2 ≈ 1.8298 (σ3 ≈ 1.4142, σ4 ≈ 1.2571 discarded; Frobenius error of the rank-2 approximation = sqrt(1.4142² + 1.2571²) ≈ 1.892). With terms as rows (the Wikipedia / Kovanovic slides) the roles swap.
- Pitfalls the numbers show: "the" dominates topic_1 (0.660615), so on raw counts topic 1 tracks common-word presence. Use TF-IDF or stop words first. topic_2 separates fox (+0.519736) from dog (-0.459436). Docs 2 and 3 collide in 2-D (brown = quick and slow = red). SVD signs are arbitrary: numpy's `np.linalg.svd` returns this solution negated.
- `explained_variance_ratio_` on this toy run is [0.0133, 0.4768]. Because TruncatedSVD does not center, component 1 explains little variance even though its singular value is largest (3.0119 vs 1.8298).

### PCA alternative (24:21-26:23)

The speaker calls PCA "perhaps a simpler" option: new dimensions are linear combinations ("dimension 1 has this weight plus dimension two has this weight ..."). She uses "200 dimensions" as the example. The new dimensions are fewer, keep "most of the gist", and cluster similar words. Back's production suggester uses PCA, not truncated SVD. Correction: scikit-learn's PCA centers the data before its SVD, which makes a sparse term matrix dense. `TruncatedSVD` does not center, so it works on sparse matrices. That is why LSA normally uses TruncatedSVD.

### Retrieval with topic vectors and Back's suggester (30:34-41:32; internal design, not verifiable)

1. Corpus = all KB documents that may be suggested. Fit the decomposition (PCA) to a fixed number of dimensions and store the model.
2. Score every KB document with the model ("the word refund appears, the word macbook appears", each word has a weight) to get topic vectors. New documents are scored with the same model.
3. A user query (Slack is the example she gives) is treated as a short document and mapped into the same topic space.
4. Candidate set = documents eligible for the user's organisation. Score = cosine similarity (the speaker: "the smallest angle"). Rank, then show the top x "as long as they're above some sort of threshold".
5. Planned: a linear combination of cosine similarity and the "previous goodness" of the document for similar past queries (similar in the same topic space). Weight that term by the distance of the most similar past query. Placeholder weights spoken at 40:07: positive 0.2 "or something", negative 0.5 ("I don't know the exact numbers"). Start with a conservative weight. Positive feedback should be the stronger signal, because a negative vote "doesn't mean that it was not relevant". Note that the two example numbers point the opposite way from this principle, so treat them as placeholders. Later: non-linear rules (ignore values below a cut-off, ignore implausibly positive values).
6. Operations: "relatively simple" (34:31, "I think"). It must run beside the old suggester. Open questions she lists: how to store vectors, how to refresh them (changing the model means rescoring everything), keeping them in memory. Pre-trained embeddings are "stuck in time".
7. Retraining is manual for now. A new document is re-indexed with the existing model. A new organisation or team with many documents may bring new topics, so retrain and compare a metric (a listener suggested accuracy or F1). If the new model is not better, keep the old one (author inference). One cannot know in advance (37:17, "I don't think it's possible"). A drift check is possible: new documents falling outside the previous distribution. Not built.

### Classic fold-in (author addition)

A new query vector q (term weights, same preprocessing) maps to the LSA space as q̂ = qᵀ U_k Σ_k⁻¹ in the terms-as-rows convention. In scikit-learn this is `svd.transform(vectorizer.transform([q]))`, which equals q · W without the Σ⁻¹ scaling. Words unseen at fit time are dropped.

## Quick Reference

| item | value |
|---|---|
| Toy corpus | 4 docs: the quick brown fox / the slow brown dog / the quick red dog / the lazy yellow fox |
| Columns | brown, dog, fox, lazy, quick, red, slow, the, yellow |
| BOW of doc 1 | (1,0,1,0,1,0,0,1,0) |
| TF (text slide) | count(t in d) / total terms in d |
| IDF (text slide) | log_e(N / df(t)) |
| IDF (card, = scikit-learn smooth) | log((1+n)/(1+df)) + 1 |
| TF-IDF example | "blue sky" -> 0.707107, 0.707107 (stop words most likely removed) |
| SVD | X = U Σ Vᵀ |
| Storage example | 10^6 vs 5x1000 + 5 + 5x1000 ~ 10^4, "100 times less space" |
| 9 -> 2 dims | doc 1 = (1.6949049311864635, 0.2995240544049736) |
| topic_1 weights | brown 0.353937, dog 0.334199, fox 0.326416, the 0.660615 |
| Dimension example | 200 instead of 200,000 (slide "for example") |
| Typical k (fact check) | 100-300 (Wikipedia); 100 (Deerwester 1990; scikit-learn recommendation) |
| Similarity | cosine similarity (angle); Euclidean distance also mentioned |
| Back suggester | PCA-based LSA, cosine, top x above a threshold |
| Feedback weights | 0.2 / 0.5 placeholders only |

## Comparisons

| method | output | clip says | author note |
|---|---|---|---|
| Bag of words | count matrix | simple; misses synonyms; huge sparse | baseline |
| TF-IDF | weighted count matrix | improvement over BOW (relative importance) | still one column per word |
| LSA (truncated SVD) | k-dim topic vectors | "SVD applied to NLP" | works on sparse input directly |
| LSA via PCA | k-dim topic vectors | "perhaps a simpler"; used at Back | centers, so densifies; not simpler |
| LDA | probabilistic topics | "very humanly interpretable" | usually more readable; not guaranteed |

Choose LSA with TruncatedSVD on TF-IDF for retrieval and clustering vectors. Choose LDA when people must read and name topics. Choose the 4-document toy for teaching, since every number can be hand-checked.

## Fact Check

20 claims: 14 confirmed, 4 partly, 1 not found, 1 contradicted. A separate agent produced the first pass without frames. The writer then updated #6, #9 and #14 from the slide frames and a local recomputation (scikit-learn 1.9.1).
- Contradicted: #17 "without actually losing any of the original meaning" (27:57). Truncation is lossy unless the discarded singular values are 0. Eckart-Young: the rank-k SVD is the best rank-k approximation; its Frobenius error is the square root of the sum of squares of the discarded singular values. 200,000 / 200 = 1,000x fewer dimensions.
- Partly: #7 libraries do not remove stop words by default (stop_words=None; use 'english', a list, or max_df). #11 JPEG uses the DCT, not SVD. #15 PCA is not simpler (it centers; TruncatedSVD handles sparse input). #18 LDA topics are usually but not always more interpretable (Blei, Ng, Jordan 2003).
- Not found: #20 the "trump minus cats" subreddit example. The known work is FiveThirtyEight's 2017 "subreddit algebra", which used LSA on commenter overlap across 50,323 subreddits, not on post text.
- Confirmed, with notes: #4 200 dims is a typical value (100-300). #6 the corpus has "the slow brown dog". #8 the IDF smoothing formula. #9 the 0.707107 values (stop words most likely removed). #12 X ≈ UΣVᵀ. #13 and #14 the toy outputs reproduce (6-decimal values exact; #14: the spoken "0.35 + 0.32 + 0.35" are brown 0.353937, fox 0.326416 truncated, quick 0.353937; with "the" 0.660615 they sum to 1.694905). #19 k is tuned (Deerwester tried 10-100 and kept 100).
- Omitted by the clip: origin Deerwester, Dumais, Furnas, Landauer, Harshman, JASIS 41(6):391-407, 1990. The fold-in formula. Since about 2019, neural sentence embeddings (Sentence-BERT) have largely replaced LSA for semantic search.

## Open Questions & Extension Ideas

- Author note, ZVect ch. 4.2 (bag of words): the 4-document corpus is a complete, hand-checkable lesson. It covers the dictionary, the 4×9 matrix, and the slide typo as a "spot the error" exercise. Use the CountVectorizer defaults (lowercase, alphabetical columns, 2+ character tokens, no stop words) as the pitfalls box. Pair it with ch. 3 (tokens) for the "what is a word" Q&A at 12:58.
- Author note, ZVect ch. 4.2 / 4.5 (TF-IDF): the two TF/IDF definitions on two slides (proportion vs raw count, log_e(N/df) vs smoothed +1) make a good "why my numbers differ from the library" lesson. The blue-sky example shows that L2 normalisation alone yields 0.707107.
- Author note, ZVect ch. 4.5 (latent space): build the lesson around D = X · W with the slide's own numbers. A zero-dependency JS SVD of a 4×9 matrix is feasible (power iteration or Jacobi). Show three pitfalls: "the" dominating topic 1 on raw counts, sign flips between libraries, and docs 2 and 3 colliding in 2-D. Optional exercise: rerun on TF-IDF input and compare.
- Author note, ZVect ch. 2 (distance, dot, cosine): with the slide coordinates, doc 1 (1.695, 0.300) vs doc 4 "lazy yellow fox" (1.266, 1.441): cos ≈ 0.781 (38.7°), Euclidean ≈ 1.219. Doc 1 vs doc 2 "slow brown dog" (1.516, -0.769): cos ≈ 0.799 (36.9°), Euclidean ≈ 1.084. So doc 1 is slightly closer to a dog document. In the original 9-D count space all three pairs have cos = 0.5 (two shared words each). On raw counts topic_1 is dominated by "the", so shared words, not the fox/dog theme, drive 2-D proximity. This is a ready counter-intuitive drag-the-vector example and a "dimensionality reduction loses information" demo. Author addition (standard formulas, not in the clip; the Thai page labels them the same way): cosine $$ \cos\theta=\frac{a\cdot b}{\lVert a\rVert\,\lVert b\rVert} $$ with θ = arccos(cos θ), and Euclidean distance $$ d(a,b)=\sqrt{(a_1-b_1)^2+(a_2-b_2)^2} $$
- Author note, ZVect ch. 5 (search): Back's pipeline (index the corpus, map the query with the same model, cosine, rank, threshold, top x) is the canonical vector-search loop. The feedback re-ranking plan (linear combination; weighting by the similarity of the past query; conservative start; positive > negative) can motivate a reranking section before ch. 7. The 0.2/0.5 contradiction is a good "placeholders are not parameters" caution.
- Author note, ZVect ch. 5-6: "Changing the model means rescoring everything" and "re-index vs retrain" apply directly to embedding indexes and ANN rebuilds (HNSW in ch. 6).
- Open: what the "meaningful*" asterisk on the Euclidean-space slide meant (not explained in the clip). Which corpus produced the "XY Plot of Words and Titles" (words such as stock, market, investing, real_estate, dads, rich, guide; titles T1-T9; axes Dimension 2 vs Dimension 3). It is unverified here, so do not attribute it without checking.
- Open: whether Back's speaker meant "-0.5" for negative feedback (the ASR has "0.5").

## Tags & Triggers

Tags: latent semantic analysis, LSA, LSI, SVD, truncated SVD, PCA, TF-IDF, bag of words, document-term matrix, term-topic matrix, cosine similarity, scikit-learn, topic modeling, LDA, semantic search, retrieval, reranking with feedback.
Triggers: "how does LSA work step by step"; "reproduce the fox/dog LSA example"; "TF-IDF formula differences"; "TruncatedSVD vs PCA for text"; "how to score a new document in LSA"; "how many LSA dimensions"; "design a KB suggester with cosine + feedback"; "when to retrain a document embedding model".

## References

- Source clip: Tania (Back), "Latent Semantic Analysis | Back Talks", YouTube, 2021-02-17, https://www.youtube.com/watch?v=DbzN_gMh3Mw
- Slide credits in the clip: Databricks; Machine Learning Flashcards; Mukesh Chaudhary; Wikipedia; Vitomir Kovanovic.
- Deerwester et al., "Indexing by Latent Semantic Analysis", JASIS 41(6):391-407, 1990: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/08/JASIS90.pdf
- scikit-learn 1.9 TruncatedSVD: https://scikit-learn.org/1.9/modules/generated/sklearn.decomposition.TruncatedSVD.html
- scikit-learn 1.9 CountVectorizer: https://scikit-learn.org/1.9/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
- scikit-learn TfidfTransformer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html
- scikit-learn 1.9 PCA: https://scikit-learn.org/1.9/modules/generated/sklearn.decomposition.PCA.html
- Wikipedia, Latent semantic analysis (secondary): https://en.wikipedia.org/wiki/Latent_semantic_analysis
- MathWorld, Eckart-Young Theorem: https://mathworld.wolfram.com/Eckart-YoungTheorem.html
- arXiv 1912.10789 via ar5iv (JPEG/DCT): https://ar5iv.labs.arxiv.org/html/1912.10789
- Blei, Ng, Jordan, "Latent Dirichlet Allocation", JMLR 3:993-1022, 2003: https://jmlr.org/papers/v3/blei03a.html
- FlowingData, subreddit math (secondary): https://flowingdata.com/2017/03/31/subreddit-math-with-rthe_donald-helps-show-topic-breakdowns/
- Reimers and Gurevych, Sentence-BERT, EMNLP-IJCNLP 2019: https://aclanthology.org/D19-1410

## Equations (LaTeX)
1. $$ \mathrm{TF}(t)=\frac{\text{Number of times term }t\text{ appears in a document}}{\text{Total number of terms in the document}} $$
2. $$ \mathrm{IDF}(t)=\log_e\left(\frac{\text{Total number of documents}}{\text{Number of documents with term }t\text{ in it}}\right) $$
3. $$ \text{TF-IDF}=\mathrm{TF}(t,d)\times\mathrm{IDF}(t) $$
4. $$ \mathrm{IDF}(t)=\log\frac{1+n}{1+\mathrm{df}(d,t)}+1 $$
5. $$ X=U\varSigma V^{T} $$
6. $$ 1000\times1000=10^{6}\qquad 5\times1000+5+5\times1000\sim10^{4} $$
7. $$ \text{topic}_1(\text{new document})=0.35+0.32+0.35+\cdots $$
