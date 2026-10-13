# TFIDF : Data Science Concepts — ritvikmath - Claude Context
> Source: YouTube, ritvikmath, "TFIDF : Data Science Concepts", 7:54, published 2020-11-11 · https://www.youtube.com/watch?v=OymqCnh-APA · Generated: 2026-10-13
> Companion: 20201111_TFIDF-Data-Science-Concepts.html (Thai, iw mode `iwd`, 14 sections, 6 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); board equations transcribed exactly.
- Frames used: 01_board-left, 02_board-right, 03_corpus, 04_tf-formula, 05_idf-formula, 06_tfidf-examples.
- Own SVG diagrams: layers, bars.
- Transcript SHA-256 (in-page = decoded): `24427c010f8c450f751470e18f66fc0f8db2dd814c2da8caf061dbfe8647a13d (en:asr track)`; kept in the session workspace only.

## TL;DR
- ritvikmath explains TF-IDF on a pre-written whiteboard with one question: which words are important to which of three inauguration speeches (Clinton, Bush, Obama) relative to the whole corpus.
- Board formulas: tf(t,d) = #occurrence of t in d / #total words in d; idf(t,D) = log(N / #docs w/ t); tfidf(t,d,D) = tf(t,d) x idf(t,D). No log base, no smoothing, no normalisation. The speaker says other TF methods and "many different variations" of IDF exist but names none.
- Numbers are illustrative only: healthcare 10 times in a 1,000-word Obama speech, TF 0.01; idf log 3 (only Obama) or log 1.5 (also Clinton). The speaker does not evaluate them; author values: 0.004771 (log10) / 0.010986 (ln); hypothetical 0.001761 / 0.004055; ratio 0.369 in any base.
- Author additions: scikit-learn defaults (smooth idf, L2) give "a" idf 1 (not 0) and shrink the Clinton effect to 0.761x before L2 instead of 0.369x; Wikipedia's TF and IDF variant lists fill in the variations the speaker mentions.

## Key Concepts
- **Corpus D vs document d.** D = the whole collection (three speeches, N = 3); d = one speech. Only d3 = Obama is indexed in the clip; d1 = Clinton, d2 = Bush is author notation following the board order.
  $$D = \{d_1, d_2, d_3\},\quad N = |D| = 3$$
- **Term frequency (board):**
  $$\operatorname{tf}(t,d) = \frac{\#\text{occurrence of } t \text{ in } d}{\#\text{total words in } d} = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$
  The speaker: "there's other ways to compute it". Example (hypothetical, spoken ~2:13):
  $$\operatorname{tf}(\text{healthcare},d_3)=\frac{10}{1000}=0.01$$
- **Why TF alone fails (board "ISSUES?" "the" "a" "and").** Grammar words have very big TF in every document, so the top-TF words do not show what is special about each speech.
- **Inverse document frequency (board):**
  $$\operatorname{idf}(t,D) = \log \frac{N}{\#\text{docs w/ } t}$$
  "There's many different variations on this but they're all kind of telling the same story." the (spoken ~3:56): "not helpful in telling these documents apart"; healthcare only in Obama (spoken ~4:30): "a bigger number".
  $$\operatorname{idf}(\text{the},D)=\log\frac{3}{3}=\log 1=0,\qquad \operatorname{idf}(\text{healthcare},D)=\log\frac{3}{1}=\log 3$$
- **TF-IDF (board):**
  $$\operatorname{tfidf}(t,d,D) = \operatorname{tf}(t,d) \times \operatorname{idf}(t,D)$$
  Three arguments because TF needs (t, d) and IDF needs (t, D).
- **Board examples:**
  $$\operatorname{tfidf}(\text{"a"}, d, D) = (\uparrow)\log\left(\frac{3}{3}\right) = 0,\qquad \operatorname{tfidf}(\text{"healthcare"}, d_3, D) = (0.01)\log(3)$$
  (up-arrow = "a large term frequency"; the second is "some kind of positive number", not computed.)
- **Hypothetical (spoken only, "a quick theoretical example that I just thought of"):** healthcare also in Clinton, not Bush: TF still 0.01, the idf drops, so the weight for Obama goes down (spoken ~6:47):
  $$\operatorname{tfidf}(\text{healthcare},d_3,D')=0.01\log\frac{3}{2}=0.01\log 1.5<0.01\log 3$$
  Also spoken (~5:30): large TF times idf 0 gives 0 for "a", "the", "and" in every document, $(\uparrow)\times\log\frac{3}{3}=0$; as a bigger fraction of documents contain a word, it becomes less important. Author: idf = -log(df/N), a function of the fraction df/N.

## Implementation
```python
import math
N = 3
tf = 10 / 1000                      # hypothetical, as in the clip
for name, log in (("log10", math.log10), ("ln", math.log), ("log2", math.log2)):
    a = tf * log(3 / 1)             # healthcare only in Obama
    b = tf * log(3 / 2)             # also in Clinton
    print(name, round(a, 6), round(b, 6), round(b / a, 4))
# log10 0.004771 0.001761 0.3691 | ln 0.010986 0.004055 0.3691 | log2 0.01585 0.00585 0.3691
```
- Ratio is base independent: (0.01 log 1.5)/(0.01 log 3) = ln 1.5 / ln 3 = 0.4055/1.0986 = 0.369 (a 63 % drop).
- Any TF times log(3/3) = 0 (checked for 0.02, 0.05, 0.10).
- IDF vs fraction (log10, author): N = 3: df 1 -> 0.4771, df 2 -> 0.1761, df 3 -> 0; N = 100: df 1 -> 2.0, df 10 -> 1.0, df 50 -> 0.3010, df 100 -> 0.

Author addition — scikit-learn 1.9.1 defaults (raw count TF, smooth idf, L2):
$$\operatorname{idf}(t) = \ln\frac{1+n}{1+\operatorname{df}(t)} + 1\ (\text{smooth\_idf=True}),\qquad \operatorname{idf}(t) = \ln\frac{n}{\operatorname{df}(t)} + 1\ (\text{False}),\qquad \hat{\mathbf{v}}_d = \frac{\mathbf{v}_d}{\lVert \mathbf{v}_d \rVert_2}$$
- n = 3: df 1 -> ln 2 + 1 = 1.6931; df 2 -> ln(4/3) + 1 = 1.2877; df 3 -> 1.0000 (smooth_idf=False: 2.0986, 1.4055, 1.0000). Verified with TfidfTransformer().idf_.
- healthcare weight before L2: 10 x 1.6931 = 16.93; Clinton case 10 x 1.2877 = 12.88; ratio before L2 0.761 (vs 0.369 in the clip's formula). "a" keeps weight = its raw count, so the clip's "a/the/and = 0 for all documents" is false under sklearn defaults.
- L2 cannot be computed for the clip (whole speech vectors unknown). Scale invariance (c v)/||c v|| = v/||v|| means the clip's division by 1,000 words would vanish after L2 (toy check: [16.93, 40, 6.44] and the same /1000 both give [0.3856, 0.9109, 0.1466]).

Author addition — variants (Wikipedia tf-idf tables), N = total documents, n_t = documents containing t:
$$\text{tf: } \{0,1\};\ f_{t,d};\ \frac{f_{t,d}}{\sum_{t'} f_{t',d}};\ \log(1+f_{t,d});\ 0.5 + 0.5\frac{f_{t,d}}{\max_{t'} f_{t',d}}$$
$$\text{idf: } 1;\ \log\frac{N}{n_t};\ \log\frac{N}{1+n_t} + 1;\ \log\frac{N-n_t}{n_t}$$
For N = 3 (log10): smooth 1.1761 / 1.0 / 0.8751 for n_t = 1/2/3; probabilistic 0.3010 / -0.3010 / undefined. All except unary decrease with n_t ("the same story"), but zero points and signs differ.

## Quick Reference
| Item | Value |
|---|---|
| Corpus | 3 inauguration speeches (Clinton, Bush, Obama), N = 3; d3 = Obama |
| TF | occurrences / total words |
| IDF | log(N / docs with t), base unstated |
| TF-IDF | tf x idf |
| tf(healthcare, d3) | 10/1000 = 0.01 (hypothetical) |
| idf(the) | log(3/3) = 0 |
| idf(healthcare) | log 3 = 0.4771 (log10) / 1.0986 (ln) |
| tfidf(healthcare, d3) | 0.004771 (log10) / 0.010986 (ln) / 0.015850 (log2) |
| hypothetical (df 2) | 0.001761 / 0.004055 / 0.005850; ratio 0.369 |
| sklearn idf, n = 3 | 1.6931 / 1.2877 / 1.0000 for df 1/2/3 |
| sklearn Clinton ratio (before L2) | 0.761 |

## Fact Check
| Claim | Verdict | Note |
|---|---|---|
| TF-IDF = TF x IDF | confirmed | IIR 6.2.2 |
| TF = count / doc length; other ways exist | confirmed | Wikipedia lists 6 TF variants |
| IDF = log(N/df); many variations, same story | confirmed | IIR 6.2.1; Wikipedia lists 5 IDF variants |
| word in all documents -> idf 0 -> tf-idf 0 | partly | true for log(N/df); sklearn default floor is 1 |
| healthcare in 1 of 3 -> log 3 > log 1 = 0 | confirmed | 0.4771 / 1.0986 |
| 10/1000 = 0.01 | confirmed | hypothetical by the speaker's own words |
| log 1.5 < log 3, so tf-idf goes down | confirmed | ratio 0.369 any base |
| larger fraction of documents -> less important | confirmed | IIR 6.2.2 |
Counts: 7 confirmed, 1 partly.

## Open Questions & Extension Ideas
- The clip leaves base and variant unspecified; any lesson built on it should state them (e.g. log10 textbook vs sklearn ln + smoothing).
- The clip gives no real word counts; a worked corpus (e.g. DataMListic's three sentences, report 20220906_TF-IDF-Explained) is needed for hand computation.
- Smoothing changes how strongly rarity counts in a small corpus (0.761x before L2 vs 0.369x); worth showing side by side.
- Stop words: under sklearn defaults "a"/"the" are not zeroed; decide on stop-word removal explicitly.

## Tags & Triggers
TF-IDF, term frequency, inverse document frequency, corpus, stop words, inauguration speeches, log base, scikit-learn smooth idf, L2 normalisation, tf-idf variants.
Triggers: "explain TF-IDF intuitively", "why does 'the' get zero TF-IDF", "what happens to IDF when more documents contain the word", "what TF/IDF variants exist".

## References
- ritvikmath, "TFIDF : Data Science Concepts", YouTube, 2020-11-11: https://www.youtube.com/watch?v=OymqCnh-APA
- Manning, Raghavan, Schutze, Introduction to Information Retrieval, 6.2: https://nlp.stanford.edu/IR-book/html/htmledition/inverse-document-frequency-1.html and https://nlp.stanford.edu/IR-book/html/htmledition/tf-idf-weighting-1.html
- scikit-learn 1.9.1, TfidfTransformer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html
- Wikipedia, tf-idf (variant tables): https://en.wikipedia.org/wiki/Tf%E2%80%93idf
- Companion reports in the same set: 20161012_Coding-Challenge-40-3-TF-IDF.html, 20220906_TF-IDF-Explained.html
