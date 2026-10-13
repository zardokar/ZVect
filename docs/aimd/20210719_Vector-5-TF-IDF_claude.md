# Vector 5 TF IDF — From Languages to Information (Stanford slides) - Claude Context
> Source: YouTube, From Languages to Information, "Vector 5 TF IDF", 5:33, published 2021-07-19 · https://www.youtube.com/watch?v=TBUpxFw8oIA · Generated: 2026-10-13
> Companion: 20210719_Vector-5-TF-IDF.html (Thai, iw mode `iwd`, 12 sections, 9 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); equations, tables and slide numbers transcribed exactly.
- Frames used: 01_raw-frequency-bad, 02_two-solutions, 03_tf, 04_df, 05_idf, 06_what-is-a-document, 07_w-equation, 08_raw-counts, 09_tfidf-matrix.
- Own SVG diagrams: flow, bars, bars.
- Transcript SHA-256 (in-page = decoded): `eec878d13805a26538326baf98d4179f15308014f655a1810e8c2fdae7010541 (page transcript; console copy differs only by NBSP+space pairs, documented in the first job)`; kept in the session workspace only.

## TL;DR
A 5:33 lecture clip (channel "From Languages to Information", Stanford-branded slides, part of "Vector Semantics & Embeddings") that defines tf-idf weighting for a term-document matrix: $\mathrm{tf}_{t,d} = \log_{10}(\mathrm{count}(t,d)+1)$, $\mathrm{idf}_t = \log_{10}(N/\mathrm{df}_t)$, $w_{t,d} = \mathrm{tf}_{t,d} \times \mathrm{idf}_t$, illustrated on Shakespeare (N = 37 plays). A word in every play (good, sweet) gets idf 0, so its whole row of the tf-idf matrix becomes 0. The slides also show PMI as the alternative weighting for word-word matrices. Slides match Jurafsky & Martin SLP3 ch. 6 (author inference; the speaker does not cite the book). Every slide number was recomputed; all match except Falstaff idf (0.9661 -> 0.966, slide prints 0.967).

## Key Concepts
- **Problem (slide "But raw frequency is a bad representation", 0:09-0:40):** raw co-occurrence counts are useful (sugar near apricot) but overly frequent words (the, it, they) carry little information; the speaker calls raw frequency "very skewed" and "not very discriminative". Paradox: balance the two.
- **Two common solutions (slide, 0:41-1:16):** tf-idf (usually when the dimensions are documents) and PMI (usually when the dimensions are words).
  - Eq. S03.1 (slide): $w_{t,d} = \mathrm{tf}_{t,d} \times \mathrm{idf}_t$; note: "Words like "the" or "it" have very low idf".
  - Eq. S03.2 (slide): $\mathrm{PMI}(w_1,w_2) = \log \dfrac{p(w_1,w_2)}{p(w_1)\,p(w_2)}$ (no base written); note: "See if words like "good" appear more often with "great" than we would expect by chance". Spoken: PMI compares observed probabilities with those expected by chance.
- **Term frequency (slide, 1:17-1:54):** $\mathrm{tf}_{t,d} = \mathrm{count}(t,d)$, or "more commonly" $\mathrm{tf}_{t,d} = \log_{10}(\mathrm{count}(t,d)+1)$. Reasons spoken: a word appearing 100 times is not 100 times more likely to be relevant to the document's meaning; +1 because log of 0 is undefined.
- **Document frequency (slide, 1:55-2:56):** $\mathrm{df}_t = \lvert\{d : t \in d\}\rvert$ vs collection frequency $\mathrm{cf}_t = \sum_d \mathrm{count}(t,d)$ (slide gives both in words); $\mathrm{df}_t$ = number of documents containing t; NOT collection frequency (total count across all documents). Table: Romeo cf 113, df 1; action cf 113, df 31 (31 is slide-only, not spoken). N = 37 plays (spoken).
- **IDF (slide, 2:57-4:10):** spoken first as the fraction $N/\mathrm{df}_t$ (e.g. $37/37 = 1$, $37/1 = 37$) ("lowest weight of one" for terms in all documents, true only before the log), then squashed with a log because collections are large: $\mathrm{idf}_t = \log_{10}(N/\mathrm{df}_t)$, N = total documents in the collection (pen note "total docs").
- **What is a document (slide, 4:11-4:43):** a play, a Wikipedia page, a newspaper article; "documents can be anything; we often call each paragraph a document!" (lets you compute tf-idf inside a single book).
- **Final weight and matrix (4:44-5:26):** $w_{t,d} = \mathrm{tf}_{t,d} \times \mathrm{idf}_t$; raw counts and tf-idf tables for battle/good/fool/wit x four plays; good row all 0 (in every play); fool (36 of 37 plays) much lower weight. Close: tf-idf gives "weighted vectors representing words" (rows of the matrix).

## Implementation
Exact recipe of the clip (SLP3 eqs. 6.12-6.14):

$$\mathrm{tf}_{t,d} = \log_{10}\big(\mathrm{count}(t,d)+1\big) \qquad \mathrm{idf}_t = \log_{10}\frac{N}{\mathrm{df}_t} \qquad w_{t,d} = \log_{10}\big(\mathrm{count}(t,d)+1\big)\cdot\log_{10}\frac{N}{\mathrm{df}_t}$$

No idf smoothing, no vector normalisation, no query weighting in the clip.

```python
from math import log10
def tfidf_matrix(counts, df, N):          # counts[t][d] raw counts, df[t] doc frequency
    return {t: [log10(c + 1) * log10(N / df[t]) for c in row] for t, row in counts.items()}
N = 37
df = {"battle": 21, "good": 37, "fool": 36, "wit": 34}
counts = {"battle": [1, 0, 7, 13], "good": [114, 80, 62, 89], "fool": [36, 58, 1, 4], "wit": [20, 15, 2, 3]}
# columns: As You Like It, Twelfth Night, Julius Caesar, Henry V
# -> battle [0.0740, 0, 0.2221, 0.2819]; good [0,0,0,0]; fool [0.0187, 0.0211, 0.0036, 0.0083]; wit [0.0486, 0.0442, 0.0175, 0.0221]
```

IDF table (slide vs recomputed, N = 37): Romeo df 1: 1.57 (1.5682); salad 2: 1.27 (1.2672); Falstaff 4: 0.967 (0.9661 -> 0.966, slide discrepancy 0.001); forest 12: 0.489 (0.4890); battle 21: 0.246 (0.2460); wit 34: 0.037 (0.0367); fool 36: 0.012 (0.0119); good 37: 0; sweet 37: 0. action (df 31, not in the idf table): 0.0768 (author computed).

Pitfalls:
- The spoken "lowest weight of 1" is about $N/\mathrm{df}$ before the log; after the log it is 0 (the slide's own table and matrix show 0). SLP3 contains the same sentence.
- A word in every document becomes an all-zero vector: cosine similarity with it divides by zero.
- The document unit (play, page, paragraph) changes N and every df; fix it before computing idf.
- PPMI as used in SLP3 (author addition): $\mathrm{PPMI}(w,c) = \max\big(\log_2 \frac{P(w,c)}{P(w)P(c)}, 0\big)$; the slide writes "log" with no base.

## Quick Reference
| Item | Value |
|---|---|
| tf (raw) | count(t,d) |
| tf (squashed, "more commonly") | log10(count(t,d) + 1) |
| idf | log10(N / df_t) |
| weight | w = tf x idf |
| N | 37 Shakespeare plays |
| Romeo / action | cf 113 / 113; df 1 / 31 |
| idf extremes | Romeo 1.57; good, sweet 0 |
| battle row (AYLI, TN, JC, HV) | 0.074, 0, 0.22, 0.28 |
| fool row | 0.019, 0.021, 0.0036, 0.0083 |
| wit row | 0.049, 0.044, 0.018, 0.022 |
| good row | 0, 0, 0, 0 (raw 114, 80, 62, 89) |
| PMI | log p(w1,w2) / (p(w1) p(w2)); SLP3 uses log2 |
| tf-idf vs PMI | documents as dimensions vs words as dimensions |

## Comparisons
Same cell (battle in Julius Caesar: count 7, df 21, N 37) under other recipes (author computed; not in the clip):
| Recipe | Formula | Value |
|---|---|---|
| This clip / SLP3 | log10(c+1) x log10(N/df) | 0.2221 |
| Raw-count tf (slide eq. 4, not computed in the clip) | c x log10(N/df) | 1.7219 |
| IIR sublinear | (1 + log10 c) x log10(N/df) | 0.4539 |
| scikit-learn smooth idf (before L2) | c x (ln((1+n)/(1+df)) + 1) | 10.8258; good gets idf 1, not 0 |
| Coding Train 40.3 | c x ln(N/df) | 3.9648 |

## Fact Check
10 claims checked: 7 confirmed, 2 partly, 1 not found.
- tf-idf for document dimensions, PMI for word dimensions: confirmed (SLP3 6.5-6.6, read 2026-10-13).
- tf = count or log10(count+1), +1 because log 0 undefined: confirmed (SLP3 eqs. 6.11-6.12).
- idf = log10(N/df): confirmed (eq. 6.13).
- "lowest weight of 1" for terms in all documents: partly (true for N/df; 0 after the log; same sentence in SLP3).
- Romeo/action cf 113, df 1/31: confirmed (SLP3 table).
- idf table: confirmed by recomputation except Falstaff 0.967 vs 0.966.
- 16-cell tf-idf matrix: confirmed by recomputation.
- PMI with "log": partly (SLP3 eq. 6.17 uses log2; PPMI not in the clip).
- play / Wikipedia page / newspaper article as documents: confirmed (SLP3).
- paragraph as a document: on the slide; not found in the SLP3 text read.

## Open Questions & Extension Ideas
- ZVect lesson "TF-IDF": use this clip's three displayed equations as the formula box (explicit log10 and +1), the Shakespeare idf table as the worked example, and the good row as the "why idf" moment; then show the scikit-learn smoothed + L2 form side by side (author proposal).
- Planned on-site Q&A (BM25 + TF-IDF/SVD + RRF): choose the document unit (paragraph vs lesson) first, since it fixes N and df; avoid zero vectors (smoothed idf) before SVD and cosine.
- The tf-idf vs PMI split is the bridge to word-word matrices (PPMI) and then to dense embeddings (ZVect chapter 4).
- Not covered: cosine ranking, query weighting, normalisation, BM25 saturation.

## Tags & Triggers
tf-idf, idf, term frequency, document frequency, collection frequency, PMI, PPMI, term-document matrix, Shakespeare, SLP3, log10, vector semantics.
Triggers: "what is the log10(count+1) tf", "why is idf 0 for a word in every document", "df vs collection frequency", "compute the Shakespeare tf-idf matrix".

## References
- From Languages to Information, "Vector 5 TF IDF", YouTube, 2021-07-19: https://www.youtube.com/watch?v=TBUpxFw8oIA
- Jurafsky & Martin, Speech and Language Processing, 3rd ed. draft (Dec 2021), ch. 6, sections 6.5-6.6: https://web.stanford.edu/~jurafsky/slp3/old_dec21/6.pdf
- Manning, Raghavan, Schutze, Introduction to Information Retrieval, 6.4.1: https://nlp.stanford.edu/IR-book/html/htmledition/sublinear-tf-scaling-1.html
- scikit-learn TfidfTransformer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html
- Companion report: 20161012_Coding-Challenge-40-3-TF-IDF (The Coding Train, raw tf x ln(N/df)).
