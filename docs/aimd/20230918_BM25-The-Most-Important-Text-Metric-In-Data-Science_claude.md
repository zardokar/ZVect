# BM25 : The Most Important Text Metric in Data Science — ritvikmath - Claude Context
> Source: YouTube, ritvikmath, "BM25 : The Most Important Text Metric in Data Science", 18:11, published 2023-09-18 · https://www.youtube.com/watch?v=ruBm9WywevM · Generated: 2026-10-13
> Companion: 20230918_BM25-The-Most-Important-Text-Metric-In-Data-Science.html (Thai, iw mode `iwd`, 12 sections, 10 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); board equations transcribed exactly.
- Frames used: 01_page1-full, 02_tfidf-recap, 03_issue-doc-a-b, 04_dtfidf-goal, 05_bm25-form, 06_page2-full, 07_k-b-typical, 08_d-theta, 09_d-t, 10_result-a-b.
- Own SVG diagrams: flow, compare.
- Transcript SHA-256 (in-page = decoded): `a802b1ed3c718bb0c0cb1b9553254a852b3936a2844f411e57fe900ce6ebac63 (en:asr track)`; kept in the session workspace only.

## TL;DR
ritvikmath motivates BM25 on a two-page hand-written whiteboard. TF-IDF has two weaknesses: it ignores document length (doc A: TF 1 in 10 words vs doc B: TF 10 in 1,000 words; raw-TF TF-IDF prefers B) and it gives a constant reward per extra occurrence (∂TFIDF/∂TF = IDF). BM25 keeps IDF "the exact same" and rebuilds the TF part with free parameters k (typically 1.2–2) and b (typically 0.75) and θ = |D|/avgdl. Two partial derivatives shown on the board prove the fix: positive with diminishing returns in TF, negative with shrinking magnitude in θ. Closing result on the board: BM25(q,A) = 1, BM25(q,B) = 0.2 (no parameters stated). The IDF formula is never written; the derivative steps are skipped ("you can trust that we get this formula").

## Key Concepts
All equations below are transcribed exactly from the board unless marked (writer) or (docs). Board shorthand: i = IDF, t = TF.

**E1 TF-IDF recap (board, "LAST TIME", ~0:32–1:35)**
$$\mathrm{TFIDF}(q,D) = \mathrm{TF}(q,D)\cdot\mathrm{IDF}(q)$$
TF = "popularity" of q in D (count); IDF = "uniqueness" of q across all documents, depends on q only.

**E2 density (spoken ~4:08, not on board)**
$$\mathrm{density}_A=\tfrac{1}{10}=10\%,\qquad \mathrm{density}_B=\tfrac{10}{1000}=1\%$$
Board table: Doc A → TF = 1, |A| = 10; Doc B → TF = 10, |B| = 1000. The speaker would prefer A ("I would argue and I think many other people would argue").

**E3 derivative of TF-IDF (board "ISSUE", ~5:10)**
$$\frac{\partial\,\mathrm{TFIDF}}{\partial\,\mathrm{TF}} = \mathrm{IDF}\quad(\text{not a function of TF})$$
Constant reward per extra matching word; 1→2 should matter much more than 100→101.

Goal on board: "IMPROVE TF SO IT HAS DIMINISHING RETS TO TF & PENALTY FOR LONG DOCS" (keyword stuffing example: "data science" ~5,000 times).

**E4 BM25 (board, ~9:47–11:18)**
$$\mathrm{BM25}(q,D) = \left[\mathrm{IDF}(q)\right]\times\frac{\mathrm{TF}(q,D)\,(k+1)}{\mathrm{TF}(q,D) + k\,(1-b+b\theta)}$$
**E6 (board)** $$\theta = \frac{|D|}{\mathrm{avgdl}}$$ (board writes AVGDL). Spoken examples: avgdl 10, |D| 10 → θ = 1; |D| 1000 → θ = 100.
Name: BM = "best matching"; 25 = "the 25th iteration/version" (speaker; developed "experimentally rather than theoretically ... actually a little bit of both"). Not confirmed by any source we read.

**Board page 2 (~13:14–18:00):** "k & b ARE FREE PARAMS. TYPICALLY: k ∈ [1.2, 2.0], b = 0.75" (not hard and fast rules).

**E7 (board)**
$$\frac{\partial\,\mathrm{BM25}}{\partial t} = i\left[\frac{k(k+1)(1-b+b\theta)}{\bigl(t + k(1-b+b\theta)\bigr)^{2}}\right]$$
"POS REL. TO t", "BUT DIMINISHING RETURNS TO t"; sketch of BM25 vs t rising and flattening.

**E13 (board)**
$$\frac{\partial\,\mathrm{BM25}}{\partial\theta} = i\left[\frac{-\,t\,(k+1)\,k\,b}{\bigl(t + k(1-b+b\theta)\bigr)^{2}}\right]$$
"NEG REL. TO θ", "BUT DIMINISHING RETURNS TO θ"; sketch of BM25 vs θ falling and flattening.

**Result (board, ~17:31):** BM25(q, A) = 1; BM25(q, B) = 0.2.

## Implementation
Writer derivations (not on the board), with $L = 1-b+b\theta$:
$$\mathrm{BM25} = i\cdot\frac{t(k+1)}{t+kL}$$
$$\frac{\partial\,\mathrm{BM25}}{\partial t} = i(k+1)\cdot\frac{(t+kL)\cdot 1 - t\cdot 1}{(t+kL)^2} = i(k+1)\frac{kL}{(t+kL)^2}$$
$$\frac{\partial^2\mathrm{BM25}}{\partial t^2} = -\frac{2ik(k+1)L}{(t+kL)^3} < 0$$
$$\frac{\partial L}{\partial\theta}=b,\quad \frac{\partial\,\mathrm{BM25}}{\partial\theta} = i\,t(k+1)\cdot\frac{-1}{(t+kL)^2}\cdot kb,\quad \frac{\partial^2\mathrm{BM25}}{\partial\theta^2} = \frac{2it(k+1)k^2b^2}{(t+kL)^3} > 0$$
$$\lim_{t\to\infty} i\cdot\frac{t(k+1)}{t+kL} = i\,(k+1) \qquad \theta=1 \Rightarrow L=1,\; t=1 \Rightarrow \mathrm{BM25}=i$$
Numeric checks (recompute_redo.py, stdlib): at i=1, t=3, θ=2, k=1.5, b=0.75: L=1.75, t+kL=5.625, ∂/∂t = 6.5625/31.640625 = 0.207407, ∂/∂θ = −8.4375/31.640625 = −0.266667 (both equal central finite differences); second derivatives −0.073745 / +0.106667.
Closing example (writer's inference, NOT in the clip): i=1, avgdl=10, k=1.5, b=0.75:
$$\mathrm{BM25}(q,A)=1\cdot\frac{1\cdot2.5}{1+1.5(1-0.75+0.75\cdot1)}=1.0000,\qquad \mathrm{BM25}(q,B)=1\cdot\frac{10\cdot2.5}{10+1.5(1-0.75+0.75\cdot100)}=\frac{25}{122.875}=0.2035$$
Other settings: k 1.2 → B 0.2193; k 2.0 → 0.1869; k 1.5, b 1 → 0.1562; exact 0.2 needs b = 0.7643 at k = 1.5 (b = 0.8990 at k = 1).
Saturation (i=1, θ=1, k=1.5): TF 1/2/5/10/50/100/1000 → 1.000/1.429/1.923/2.174/2.427/2.463/2.496 (ceiling 2.5). Length (TF=1, k=1.5, b=0.75): θ 0.1/0.5/1/2/10/100 → 1.6807/1.2903/1.0000/0.6897/0.1980/0.0220.

Variants for a real implementation (docs, not in the clip):
- IDF term of IIR eq. (84) (textbook IDF; (84) itself is RSV_d = sum over t in q of log(N/df_t)): $$\mathrm{idf}_t = \log\frac{N}{df_t}$$
- IDF term of IIR eq. (85) (RSJ; (85) itself is the RSV_d sum of this term): $$\mathrm{idf}_t = \log\left(\frac{N - df_t + 0.5}{df_t + 0.5}\right)$$ (negative when df_t > N/2)
- Lucene BM25Similarity / Vespa: $$\mathrm{IDF}(q) = \ln\left(1 + \frac{N - n(q) + 0.5}{n(q) + 0.5}\right)$$ (never negative)
- IIR eq. 86: $$\mathrm{RSV}_d = \sum_{t\in q}\left[\log\frac{N}{df_t}\right]\cdot\frac{(k_1+1)\,tf_{td}}{k_1\left((1-b)+b\cdot\frac{L_d}{L_{\mathrm{ave}}}\right)+tf_{td}}$$
- Lucene ≥ 8 (LUCENE-8563, k1+1 removed; order preserved within one field): $$\mathrm{score}(q,D) = \mathrm{IDF}(q)\cdot\frac{\mathrm{TF}(q,D)}{\mathrm{TF}(q,D)+k_1\left(1-b+b\cdot\frac{|D|}{\mathrm{avgdl}}\right)}$$ ratio textbook/Lucene-8 = k1+1 (2.2 at k1 = 1.2). Vespa's documentation still prints the (k1+1) form.
- Defaults: Lucene and Vespa k1 = 1.2, b = 0.75; IIR untuned k1 1.2–2, b 0.75.

## Quick Reference
| item | value | origin |
|---|---|---|
| k | typically 1.2–2.0 | board + speech |
| b | typically 0.75 | board + speech |
| θ | \|D\| / avgdl | board |
| doc A / doc B | TF 1, 10 words / TF 10, 1,000 words | board |
| density | 10 % / 1 % | speech |
| result | A = 1, B = 0.2 (no parameters given) | board |
| ceiling per term | IDF·(k+1) | writer |
| hidden-parameter guess | idf 1, avgdl 10, k 1.5, b 0.75 → 1.0000 / 0.2035 | writer |
| Lucene/Vespa defaults | k1 1.2, b 0.75; IDF ln(1+(N−n+0.5)/(n+0.5)) | docs |

## Comparisons
TF-IDF (raw TF) vs BM25 as in the clip: constant vs diminishing reward per occurrence; no length effect vs penalty shrinking with θ; no parameters vs k, b; A vs B ranking flips (B wins under raw TF; A wins under BM25). Writer caveat: with relative-frequency TF (count/length) TF-IDF already ranks A first (0.1 vs 0.01); BM25's real additions are saturation and a tunable length penalty (b).

## Fact Check
10 claims: 5 confirmed (formula shape = IIR eq. 86 and Vespa page; typical k/b; BM = best matching; derivatives verified numerically; Lucene 8 removed k1+1), 4 partly (IDF "same" only true for textbook IDF; A=1/B=0.2 reproducible only with assumed parameters; TF-IDF prefers B only with raw TF; "most modern search engines" broad), 1 not found ("25 = 25th version"; Xapian describes BM11/BM15 as predecessors combined via b).

## Open Questions & Extension Ideas
- Which IDF and k, b produced 0.2 on the board is unknown; our best fit is a guess.
- For ZVect: use this clip for the "why BM25" lesson (two weaknesses → two fixes, two derivative signs); take the formula for the library from Lucene (IDF ln(1+…), k1 1.2, b 0.75) and state whether (k1+1) is included.
- Unit tests from this clip: derivative formulas vs finite differences; θ = 1, t = 1 → score = IDF; b = 0 → no length effect; limit IDF·(k+1).

## Tags & Triggers
BM25, TF-IDF, IDF, term frequency saturation, document length normalization, k1, b, partial derivatives of BM25, Lucene BM25Similarity, Okapi BM25.
Triggers: "explain each part of the BM25 formula", "derive dBM25/dTF", "why is BM25 better than TF-IDF", "what k1 and b to use".

## References
- ritvikmath, "BM25 : The Most Important Text Metric in Data Science", YouTube, 2023-09-18, https://www.youtube.com/watch?v=ruBm9WywevM
- Manning, Raghavan, Schütze, Introduction to Information Retrieval, 11.4.3, https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html
- Lucene BM25Similarity 9.10 javadoc, https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/search/similarities/BM25Similarity.html ; Lucene 8.1 MIGRATE, https://lucene.apache.org/core/8_1_0/MIGRATE.html
- Vespa BM25, https://docs.vespa.ai/en/ranking/bm25.html ; rank feature configuration, https://docs.vespa.ai/en/reference/rank-feature-configuration.html
- Wikipedia Okapi BM25; Xapian BM25 notes, https://xapian.org/docs/bm25.html
- Writer's recompute: recompute_redo.py (job folder).
