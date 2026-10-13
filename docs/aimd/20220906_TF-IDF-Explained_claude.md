# Term Frequency Inverse Document Frequency (TF-IDF) Explained — DataMListic - Claude Context
> Source: YouTube, DataMListic, "Term Frequency Inverse Document Frequency (TF-IDF) Explained", 8:59, published 2022-09-06 · https://www.youtube.com/watch?v=zLMEnNbdh4Q · Generated: 2026-10-13
> Companion: 20220906_TF-IDF-Explained.html (Thai, iw mode `iwd`, 13 sections, 7 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); equations and slide numbers transcribed exactly.
- Frames used: 01_docs, 02_tf-col1, 03_tf-table, 04_idf-formula, 05_idf-col1, 06_idf-table, 07_tf-x-idf.
- Own SVG diagrams: layers, bars, bars.
- Transcript SHA-256 (in-page = decoded): `8c49ba238d5ec550c4d68502ca33e5f645eb2282b5dc65f2867f07458b271d04 (en:asr track)`; kept in the session workspace only.

## TL;DR
- DataMListic teaches TF-IDF on a three-sentence toy corpus and fills every table cell on screen: TF (relative frequency), IDF = log(N/df), TF-IDF = element-wise product. No smoothing, no final normalisation, log base never stated (the slide numbers are base 10).
- Result: words in all three documents ("the", "are") get 0; the highest weight is "friends" in document 3 (0.0795, slide .079). One slide typo: TF-IDF cell "and"/doc 2 printed ".22", correct value .022.
- Author addition: scikit-learn's default (raw count, smooth idf = ln((1+n)/(1+df)) + 1, L2) on the same corpus makes "the" the largest weight of documents 1 and 2 (0.633, 0.525); L2 also makes the clip's length normalisation of TF irrelevant.
- Every equation below is exact (LaTeX); every number was recomputed (calc.py in the job folder, sklearn 1.9.1 cross-check, max abs diff 1.1e-16).

## Key Concepts
- **Feature extraction / one vector per document.** TF-IDF turns each document of a corpus into a vector with one value per vocabulary word (here 9 words, so 9 dimensions). Author notation:
  $$\mathbf{x}_d = \big(\operatorname{tfidf}(t_1,d,D), \ldots, \operatorname{tfidf}(t_{|V|},d,D)\big),\quad |V| = 9$$
- **Bag-of-words.** Word order is ignored; the speaker himself says order is "quite important" because it can carry syntactic and semantic information. Author: any permutation of a document gives the same vector.
- **Corpus (slide, ~0:47).** d1 "the cats are in the house." (6 words), d2 "the dogs are in the house and outside." (8), d3 "the cats and dogs are friends." (6). Vocabulary row order on every slide: the, cats, are, in, house, dogs, and, outside, friends. Counts f(t,d) and df (author table): the 2/2/1 df 3; cats 1/0/1 df 2; are 1/1/1 df 3; in 1/1/0 df 2; house 1/1/0 df 2; dogs 0/1/1 df 2; and 0/1/1 df 2; outside 0/1/0 df 1; friends 0/0/1 df 1.
- **TF (slide, ~1:13)** — relative frequency:
  $$\operatorname{tf}(t,d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$
  f_{t,d} = occurrences of t in d (numerator); the denominator is the sum over all words of d = document length. TF of a document sums to 1. A word absent from d has f = 0, so TF = 0 (speaker ~2:53):
  $$t \notin d \;\Rightarrow\; f_{t,d}=0 \;\Rightarrow\; \operatorname{tf}(t,d)=\frac{0}{\sum_{t' \in d} f_{t',d}}=0$$
- **IDF (slide, ~4:15)**:
  $$\operatorname{idf}(t,D) = \log \frac{N}{\left|\{ d \in D : t \in d \}\right|}$$
  D (capital) = all documents of the corpus, explicitly different from the d in TF; N = number of documents (handwritten "#doc"); the denominator is the cardinality of the set of documents containing t (= df). IDF is a property of the term, not of a document.
- **Why the log (speaker, hedged "I believe", ~4:53–5:12):** with very many documents the ratio would be very big; the log gives "a more reasonable value". Author illustration: N = 10^6, df = 1 gives ratio 10^6 but log10 = 6.
- **Range of IDF (author):** 1 <= df <= N, so 0 <= idf <= log N; with N = 3: 0 to 0.4771. The speaker calls 0 "the minimum value possible".
  $$1 \le \operatorname{df}(t) \le N \;\Rightarrow\; 0 = \log\frac{N}{N} \le \operatorname{idf}(t,D) \le \log\frac{N}{1} = \log N$$
- **TF-IDF (slide "TF X IDF = TF-IDF", ~8:05)** — element-wise (Hadamard) product of the TF and IDF grids, not a matrix product:
  $$\operatorname{tfidf}(t,d,D) = \operatorname{tf}(t,d) \times \operatorname{idf}(t,D),\qquad \mathbf{x}_d = \mathbf{tf}_d \odot \mathbf{idf}$$
  High only when the word is frequent in the document AND rare in the corpus; the speaker ties this to information retrieval (finding documents for keywords or queries).

## Implementation
Clip recipe (reproduces every slide value, base 10):
```python
import math
docs = ["the cats are in the house", "the dogs are in the house and outside", "the cats and dogs are friends"]
vocab = ["the", "cats", "are", "in", "house", "dogs", "and", "outside", "friends"]
tok = [d.split() for d in docs]; N = len(tok)
df = {w: sum(w in t for t in tok) for w in vocab}
idf = {w: math.log10(N / df[w]) for w in vocab}                 # no smoothing
tfidf = [[t.count(w) / len(t) * idf[w] for w in vocab] for t in tok]   # relative TF x idf, no normalisation
```
Worked values (all recomputed; slide values in brackets, the slide truncates to 3 decimals):
$$\operatorname{tf}(\text{the},d_1)=\tfrac{2}{6}=0.3333\,(.333),\quad \operatorname{tf}(\cdot,d_1)=\tfrac{1}{6}=0.1667\,(.166),\quad \operatorname{tf}(\text{the},d_2)=\tfrac{2}{8}=0.25,\quad \operatorname{tf}(\cdot,d_2)=\tfrac{1}{8}=0.125$$
$$\operatorname{idf}(\text{the})=\log\tfrac{3}{3}=\log 1=0,\quad \operatorname{idf}(\text{cats})=\log_{10}\tfrac{3}{2}=0.1761\,(.176),\quad \operatorname{idf}(\text{outside})=\log_{10} 3=0.4771\,(.477)$$
$$\tfrac{1}{6}\cdot 0.1761=0.0293\,(.029),\quad \tfrac{1}{8}\cdot 0.1761=0.0220\,(.022),\quad \tfrac{1}{8}\cdot 0.4771=0.0596\,(.059),\quad \tfrac{1}{6}\cdot 0.4771=0.0795\,(.079)$$
Full TF-IDF grid (doc1 / doc2 / doc3): the 0/0/0; cats .0293/0/.0293; are 0/0/0; in .0293/.0220/0; house .0293/.0220/0; dogs 0/.0220/.0293; and 0/.0220 (slide ".22")/.0293; outside 0/.0596/0; friends 0/0/.0795.
Base check: log10 1.5 = 0.1761 matches; ln 1.5 = 0.4055 and log2 1.5 = 0.5850 do not. Base change is a constant factor, log_b x = ln x / ln b, so rankings do not depend on it.

Author addition — scikit-learn 1.9.1 defaults (TfidfVectorizer / TfidfTransformer: norm='l2', use_idf=True, smooth_idf=True, sublinear_tf=False):
$$\operatorname{idf}(t) = \ln\frac{1+n}{1+\operatorname{df}(t)} + 1 \quad(\text{smooth\_idf=True}),\qquad \operatorname{idf}(t) = \ln\frac{n}{\operatorname{df}(t)} + 1 \quad(\text{False})$$
$$w(t,d) = f_{t,d}\times\operatorname{idf}(t),\qquad \hat{\mathbf{v}}_d = \frac{\mathbf{v}_d}{\lVert\mathbf{v}_d\rVert_2},\quad \lVert\mathbf{v}_d\rVert_2=\sqrt{\textstyle\sum_i v_{d,i}^2}$$
- n = 3: idf = 1.0000 (df 3), 1.2877 (df 2), 1.6931 (df 1); smooth_idf=False: 1.0000, 1.4055, 2.0986.
- d1: v = (the 2, cats 1.2877, are 1, in 1.2877, house 1.2877); ||v|| = sqrt(9.9744) = 3.1582; after L2: the 0.6333, cats 0.4077, are 0.3166, in 0.4077, house 0.4077.
- d2 after L2: the 0.5252, are 0.2626, in/house/dogs/and 0.3382, outside 0.4447 (norm 3.8078). d3: the 0.3188, are 0.3188, cats/dogs/and 0.4105, friends 0.5397 (norm 3.1371).
- Scale invariance: (c v)/||c v|| = v/||v|| for c > 0, so dividing TF by document length (the clip's TF) changes nothing after L2; verified in code for all three documents.
- Cosine similarity, clip recipe vs sklearn: d1-d2 0.3429 vs 0.6915; d1-d3 0.1795 vs 0.4702; d2-d3 0.1847 vs 0.5288 (same order, sklearn higher because "the"/"are" keep weight).
- Pitfalls: the sklearn doc's own remark says textbook idf is log[n/(df+1)]; IIR's textbook form is log(N/df) — name the variant explicitly. With smooth idf the stop word "the" dominates small corpora; remove stop words or use sublinear tf.

## Quick Reference
| Item | Value |
|---|---|
| N | 3 documents (6, 8, 6 words), vocabulary 9 |
| TF | f(t,d) / sum of word counts in d |
| IDF | log(N / df), base 10 by the numbers, no +1 |
| IDF values | df 3 -> 0; df 2 -> 0.1761; df 1 -> 0.4771 |
| TF-IDF | tf x idf per cell |
| Non-zero TF-IDF levels | 0.0293, 0.0220, 0.0596, 0.0795 |
| Max cell | friends / d3 = 0.0795 (slide .079) |
| Slide typo | and / d2 ".22" = 0.022 |
| ASR slip | "0.66" spoken for 1/6 (slide .166) |
| Normalisation in clip | none |
| sklearn idf (n=3) | 1.0000 / 1.2877 / 1.6931 for df 3 / 2 / 1 |
| sklearn d1 after L2 | the .633, cats/in/house .408, are .317 |

## Fact Check
| Claim | Verdict | Note |
|---|---|---|
| TF = count / document length | confirmed | one of the standard TF variants (Wikipedia); IIR and sklearn default to raw counts |
| IDF = log(N / df) | confirmed | IIR 6.2.1 idf_t = log(N/df_t) |
| 0.176 and 0.477 | confirmed, base 10 | log10 1.5 = 0.1761, log10 3 = 0.4771; base unstated in clip |
| log is used because the ratio gets very big ("I believe") | partly | speaker's own hedge; same squash rationale in the Stanford "Vector 5 TF IDF" slides (TBUpxFw8oIA ~3:29); IIR passage read gives no rationale |
| df = N gives the minimum idf 0 | partly | true for log(N/df); sklearn default minimum is 1 |
| TF-IDF cell and/d2 = .22 | contradicted | 0.125 x 0.1761 = 0.0220 |
| other 26 TF-IDF cells, all TF and IDF cells | confirmed | recomputed; slide truncates, does not round |
| TF-IDF helps retrieve documents for keywords/queries | confirmed | IIR 6.2.2 |
| bag-of-words ignores word order | confirmed | IIR 6.2 |
Counts: 6 confirmed, 2 partly, 1 contradicted.

## Open Questions & Extension Ideas
- The clip never states the log base; any reuse should say "log10" explicitly (or ln if matching sklearn).
- Query scoring is only mentioned in one sentence; author example: score(q,d) = sum over query terms of tfidf(t,d,D); "friends outside" ranks d3 (0.0795) > d2 (0.0596) > d1 (0).
- For a small site corpus, decide on stop-word removal before using smooth idf + L2; otherwise "the" dominates.
- Natural next steps: cosine ranking on L2-normalised vectors; BM25 (saturating TF, different idf); SVD/LSA on the TF-IDF matrix.

## Tags & Triggers
TF-IDF, term frequency, inverse document frequency, bag-of-words, IDF log base 10, smooth idf, L2 normalisation, scikit-learn TfidfVectorizer, cosine similarity, information retrieval.
Triggers: "how is TF-IDF computed by hand", "why is the IDF of 'the' zero", "which log base does IDF use", "how does sklearn's tf-idf differ from the textbook".

## References
- DataMListic, "Term Frequency Inverse Document Frequency (TF-IDF) Explained", YouTube, 2022-09-06: https://www.youtube.com/watch?v=zLMEnNbdh4Q
- Manning, Raghavan, Schutze, Introduction to Information Retrieval, 6.2: https://nlp.stanford.edu/IR-book/html/htmledition/inverse-document-frequency-1.html and https://nlp.stanford.edu/IR-book/html/htmledition/tf-idf-weighting-1.html
- scikit-learn 1.9.1, TfidfTransformer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html
- Wikipedia, tf-idf: https://en.wikipedia.org/wiki/Tf%E2%80%93idf
- From Languages to Information, "Vector 5 TF IDF": https://www.youtube.com/watch?v=TBUpxFw8oIA
- Companion report in the same set: 20161012_Coding-Challenge-40-3-TF-IDF.html (live-coded TF-IDF, ln and raw counts)
