# LSA — Francisco Iacobelli - Claude Context
> Source: YouTube, Francisco Iacobelli, "LSA", 14:51, published 2019-11-17 · https://www.youtube.com/watch?v=bzNch-dBCN8 · Generated: 2026-10-13
> Companion: 20191117_Latent-Semantic-Analysis-Lsa.html (Thai, iw mode `iwd`, 16 sections, 12 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); equations, numbers, tables and code transcribed exactly from the slides.
- Frames used: 01_term-doc, 02_word-similarity, 03_transpose, 04_meaning-of-word, 05_doc-average, 06_deerwester, 07_lsa-analogy, 08_svd-def, 09_code-svd, 10_full-svd, 11_slice, 12_result.
- Own SVG diagrams: flow, bars.
- Transcript SHA-256 (in-page = decoded): `28fdaeafb3f0 (matches the in-page sha256)`; kept in the session workspace only.

## TL;DR
Francisco Iacobelli's "LSA" lecture (14:51, cut from a series with separate tf-idf and cosine videos; starts mid-sentence). Path: term × document matrix → cosine → words are vectors too (transpose) → a new document is the average of its word rows (Landauer, Foltz, Laham 1998) → Deerwester 1990 12 × 9 example where human–user and user–minors both have cosine 0 → LSA via SVD $A_{m,n} = U_{m,m}\Sigma_{m,n}(V^{T})_{n,n}$ in numpy → keep 2 dimensions $A'_{12,9} = U'_{12,2}\Sigma'_{2,2}V'^{T}_{9,2}$ → sim(human, user) = 0.89. Recomputation finds four slide errors: the d5 average (slide = 6-row mean incl. "jumped"; correct 5-word mean (0.484, 0.484, 0, 0.284)), m1 "ordered" (paper "unordered"), the slice `vh[:,0:2]` (wrong axis; should be `vt[0:2,:]`; the slide's Ap table reproduces the wrong slice to 0.0005), and sim(user, minors) = −0.27 (true +0.198; −0.275 is human–minors). One spoken mismatch, not a slide error: the speaker first says "nine documents" (5:13), matching the slide's 5 + 4, then the ASR captions read "four … and three" (possibly a mishearing). Word-row cosines are unaffected by the wrong slice because the sliced block has orthonormal rows. Author additions (labelled): tf-idf fit, cosine formula, rank-k truncation, energy share, query folding $\hat{q} = \Sigma_k^{-1}U_k^{T}q$, latent-semantic vs latent-space answer.

## Key Concepts
- Deerwester titles on the slide: c1 Human machine interface for ABC computer applications · c2 A survey of user opinion of computer system response time · c3 The EPS user interface management system · c4 System and human system engineering testing of EPS · c5 Relation of user perceived response time to error measurement · m1 The generation of random, binary, ordered trees · m2 The intersection graph of paths in trees · m3 Graph minors IV: Widths (m4 'Graph minors: A survey' not listed on the slide).
- Orientation: words × documents (rows = words), same as Deerwester 1990.
- d1 "The cow jumped over the moon", d2 "O'Leary's cow kicked the lamp", d3 "The kicked lamp started a fire", d4 "The cow on fire"; 12 columns the, cow, jumped, over, moon, O'Leary's, kicked, lamp, started, fire, on, a.
- Slide question $\mathrm{sim}(d_1,d_4)$ vs $\mathrm{sim}(d_2,d_4)$ vs $\mathrm{sim}(d_3,d_4)$; author answer with raw counts 0.530, 0.447, 0.408.
- Weighted matrix (said to come from tf-idf): fits $w_{t,d} = \mathit{tf}_{t,d}\log_2(N/\mathit{df}_t)$, N = 4, except "on" in d4 (formula 2, slide 1). Words 3, 6, 8 = jumped, O'Leary's, lamp: cosines 0, 0.707 (O'Leary's–lamp), 0.
- Meaning-as-average (slide quoting Landauer, Foltz, Laham 1998); author formula $\vec{d} = \frac{1}{\lvert d\rvert}\sum_{t\in d}\vec{w}_t$.
- LSA definition (slide, = Landauer et al. 1998 wording): "a fully automatic mathematical/statistical technique for extracting and inferring relations of expected contextual usage of words in passages of discourse".
- Decomposition analogy (handwriting): $X = \frac{C}{M} + D$, $150 = \frac{300}{2} + 0$; later $X = \frac{M}{C} + \cancel{D}$ (D crossed out: dropping a piece gives "something close"; the flipped fraction is probably a slip).
- SVD slide: A_{m,n} word × document, U_{m,m} rows as vectors of derived orthogonal factor values, V_{n,n} columns likewise, Σ_{m,n} diagonal scaling values; multiplying reconstructs A. Small print (Landauer et al. 1998): reduce dimensionality by deleting the smallest diagonal coefficients; very large corpora: "currently a few thousand" dimensions.

## Implementation
Equations displayed in the HTML (numbering = the HTML equation numbers):
1. $\mathrm{sim}(d_1,d_4)\ \text{vs.}\ \mathrm{sim}(d_2,d_4)\ \text{vs.}\ \mathrm{sim}(d_3,d_4)$ (slide)
2. $\mathrm{sim}(a,b) = \cos\theta = \frac{a\cdot b}{\lVert a\rVert\lVert b\rVert}$ (author; clip names it only). $\mathrm{sim}(d_1,d_4) = 3/(\sqrt8\sqrt4) = 0.530$; $\mathrm{sim}(d_2,d_4) = 2/(\sqrt5\sqrt4) = 0.447$; $\mathrm{sim}(d_3,d_4) = 2/(\sqrt6\sqrt4) = 0.408$.
3. "Similarity of $w_3, w_6, w_8$?" (slide)
4. $w_{t,d} = \mathit{tf}_{t,d}\times\log_2(N/\mathit{df}_t)$ (author inference): the 0, cow $\log_2(4/3) = 0.415$, lamp 1, jumped 2; $\cos(w_3,w_6) = 0$, $\cos(w_3,w_8) = 0$, $\cos(w_6,w_8) = 2/(2\sqrt2) = 0.707$.
5. $(A^{T})_{t,d} = A_{d,t}$ (transpose)
6. $\vec{d} = \frac{1}{\lvert d\rvert}\sum_{t\in d}\vec{w}_t$ (author formalisation of the slide sentence)
7. $d_5 = \{0.74, 0.403, 0.0, 0.24\}$ (slide)
8. correct 5-word mean: $\vec d_5 = (2.42, 2.42, 0, 1.42)/5 = (0.484, 0.484, 0, 0.284)$ (the speaker's own spoken column-1 sum 0+0.42+2+0+0 over 5 = 0.484)
9. slide numbers = 6 highlighted rows incl. jumped: $(4.42, 2.42, 0, 1.42)/6 = (0.737, 0.403, 0, 0.237)$
10. raw $\cos(\mathit{human},\mathit{user}) = 0/(\sqrt2\sqrt3) = 0$, $\cos(\mathit{user},\mathit{minors}) = 0$
11–12. $X = \frac{C}{M} + D$; $150 = \frac{300}{2} + 0$
13. $A_{m,n} = U_{m,m}\Sigma_{m,n}(V^{T})_{n,n}$ (slide); 14. $(12\times12)(12\times9)(9\times9)\to(12\times9)$
15. $X = \frac{M}{C} + \cancel{D}$ (handwriting)
16. $A_k = U_k\Sigma_kV_k^{T} = \sum_{i=1}^{k}\sigma_i u_i v_i^{T}$ (author); energy $(3.3409^2 + 2.5417^2)/31 = 0.568$ ($\sum\sigma_i^2 = 31 = \lVert X\rVert_F^2$; k = 3: 0.747)
17. $U\times\Sigma\times V^{T} = A$ (slide; reconstruction error ~1e-15)
18. $A'_{12,9} = U'_{12,2}\Sigma'_{2,2}V'^{T}_{9,2}$ (slide)
19. correct $V_2^{T}$ = `vt[0:2,:]` (2 × 9) vs the slide's `vh[:,0:2]` transposed (wrong axis)
20–21. $\mathrm{sim}(\mathit{human},\mathit{user}) = 0.89$, $\mathrm{sim}(\mathit{user},\mathit{minors}) = -0.27$ (slide). Recomputed on rows of $U_2\Sigma_2$ (human (−0.7395, −0.2877), user (−1.3484, 0.1451), minors (−0.1061, 1.1451)): 0.9554/1.0761 = 0.888; 0.3092/1.5596 = +0.198; human–minors −0.2509/0.9125 = −0.275. Why the wrong slice keeps cosines: $W W^{T} = I$ so $(xW)\cdot(yW) = x\cdot y$.
22. query folding (author) $\hat{q} = \Sigma_k^{-1}U_k^{T}q$; q = human + computer: $U_2^{T}q = (-0.4618, -0.0700)$, $\hat q = (-0.1382, -0.0276)$; cosine with rows of $V_2$: c1 0.997, c2 0.895, c3 0.997, c4 0.979, c5 0.846, m1 −0.176, m2 −0.163, m3 −0.157, m4 −0.043 (raw: c1 0.816, c2 0.289, c4 0.289, others 0). Folding column c3 returns its V row (−0.4629, −0.1273).

Code on the slides (verbatim):
```python
import numpy as np
example=np.matrix([[1,0,0,1,0,0,0,0,0],[1,0,1,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0],[0,1,1,0,1,0,0,0,0],
                   [0,1,1,2,0,0,0,0,0],[0,1,0,0,1,0,0,0,0],[0,1,0,0,1,0,0,0,0],[0,0,1,1,0,0,0,0,0],
                   [0,1,0,0,0,0,0,0,1],[0,0,0,0,0,1,1,1,0],[0,0,0,0,0,0,1,1,1],[0,0,0,0,0,0,0,1,1]])
u, s, vt = np.linalg.svd(example)
up,sp,vp=u[:,0:2],np.diag(s[0:2]),vh[:,0:2]   # slide; vh is vt; WRONG axis
Ap= up*sp*vp.T
```
Corrected: `up, sp, vp = u[:, :2], np.diag(s[:2]), vt[:2, :].T; Ap = up @ sp @ vp.T` (use `@` with np.array).
Rows: human, interface, computer, user, system, response, time, EPS, survey, trees, graph, minors; columns c1–c5, m1–m4.
Σ: slide 3.34 2.54 2.35 1.64 1.50 1.31 0.85 0.56 0.36 (one later slide prints 1.65, 1.51); numpy 3.3409 2.5417 2.3539 1.6445 1.5048 1.3064 0.8459 0.5601 0.3637.
Correct A₂ rows (match Deerwester's X̂): human 0.16 0.40 0.38 0.47 0.18 −0.05 −0.12 −0.16 −0.09; user 0.26 0.84 0.61 0.70 0.39 0.03 0.08 0.12 0.19. Slide Ap human row 0.32 −0.006 0.062 0.711 0.026 0.13 0.007 0.004 0.023 = wrong-slice product (per-column signs aside).
The slide's "V =" matrix is numpy's vt (= Vᵀ); its U is 12 × 12 while Σ is printed 9 × 9 (needs zero rows to 12 × 9, or thin U 12 × 9).
Recompute script: `/home/claude/work/iwb/redo/bzNch-dBCN8/recompute_lsa_redo.py`.

### Slide matrices (verbatim)
- Counts d1–d4 (cols the cow jumped over moon O'Leary's kicked lamp started fire on a): d1 2 1 1 1 1 0 0 0 0 0 0 0 · d2 1 1 0 0 0 1 1 1 0 0 0 0 · d3 1 0 0 0 0 0 1 1 1 1 0 1 · d4 1 1 0 0 0 0 0 0 0 1 1 0
- Weighted (docs in rows): d1 0 0.42 2 2 2 0 0 0 0 0 0 0 · d2 0 0.42 0 0 0 2 1 1 0 0 0 0 · d3 0 0 0 0 0 0 1 1 2 1 0 2 · d4 0 0.42 0 0 0 0 0 0 0 1 1 0 (transposed on the next slide; d5 slide highlights rows the, cow, jumped, moon, O'Leary's, on)
- U (12 × 12, rows = words in order):
```
-0.22 -0.11 0.29 -0.41 -0.11 -0.34 -0.52 0.06 0.41 -0.08 0.32 -0.06
-0.2 -0.07 0.14 -0.55 0.28 0.5 0.07 0.01 0.11 -0.03 -0.46 -0.28
-0.24 0.04 -0.16 -0.59 -0.11 -0.25 0.3 -0.06 -0.49 0.11 0.13 0.34
-0.4 0.06 -0.34 0.1 0.33 0.38 -0. 0. -0.01 -0.15 0.65 -0.11
-0.64 -0.17 0.36 0.33 -0.16 -0.21 0.17 -0.03 -0.27 -0.11 -0.13 -0.34
-0.27 0.11 -0.43 0.07 0.08 -0.17 -0.28 0.02 0.05 -0.57 -0.43 0.31
-0.27 0.11 -0.43 0.07 0.08 -0.17 -0.28 0.02 0.05 0.73 -0.21 -0.2
-0.3 -0.14 0.33 0.19 0.11 0.27 -0.03 0.02 0.17 0.3 -0.06 0.73
-0.21 0.27 -0.18 -0.03 -0.54 0.08 0.47 0.04 0.58 -0. 0. -0.
-0.01 0.49 0.23 0.02 0.59 -0.39 0.29 -0.25 0.23 -0. 0. 0.
-0.04 0.62 0.22 0. -0.07 0.11 -0.16 0.68 -0.23 0. 0. 0.
-0.03 0.45 0.14 -0.01 -0.3 0.28 -0.34 -0.68 -0.18 0. -0. 0.
```
- "V =" (= vt, 9 × 9, rows = singular vectors, cols c1–c5 m1–m4):
```
-0.2 -0.61 -0.46 -0.54 -0.28 -0. -0.01 -0.02 -0.08
-0.06 0.17 -0.13 -0.23 0.11 0.19 0.44 0.62 0.53
0.11 -0.5 0.21 0.57 -0.51 0.1 0.19 0.25 0.08
-0.95 -0.03 0.04 0.27 0.15 0.02 0.02 0.01 -0.02
0.05 -0.21 0.38 -0.21 0.33 0.39 0.35 0.15 -0.6
-0.08 -0.26 0.72 -0.37 0.03 -0.3 -0.21 0. 0.36
-0.18 0.43 0.24 -0.26 -0.67 0.34 0.15 -0.25 -0.04
0.01 -0.05 -0.01 0.02 0.06 -0.45 0.76 -0.45 0.07
0.06 -0.24 -0.02 0.08 0.26 0.62 -0.02 -0.52 0.45
```
- Ap (slide, 12 × 9):
```
human 0.32 -0.006 0.062 0.711 0.026 0.13 0.007 0.004 0.023
interface 0.241 0.007 0.018 0.632 0.008 0.098 0.038 -0. 0.002
computer 0.092 0.063 -0.143 0.76 -0.059 0.033 0.19 -0.017 -0.078
user 0.178 0.099 -0.221 1.277 -0.092 0.066 0.302 -0.027 -0.121
system 0.683 0.05 -0.026 2.057 -0.011 0.274 0.198 -0.01 -0.034
response 0.01 0.095 -0.233 0.833 -0.097 -0.002 0.275 -0.026 -0.123
time 0.01 0.095 -0.233 0.833 -0.097 -0.002 0.275 -0.026 -0.123
EPS 0.416 -0.003 0.068 0.965 0.028 0.169 0.023 0.003 0.023
survey -0.286 0.154 -0.422 0.633 -0.175 -0.126 0.423 -0.044 -0.213
trees -0.747 0.209 -0.624 0.005 -0.259 -0.316 0.547 -0.062 -0.305
graph -0.935 0.269 -0.801 0.069 -0.332 -0.397 0.707 -0.08 -0.392
minors -0.673 0.196 -0.581 0.068 -0.241 -0.286 0.515 -0.058 -0.285
```


## Quick Reference
| Item | Value |
|---|---|
| SVD (slide) | $A_{m,n} = U_{m,m}\Sigma_{m,n}(V^{T})_{n,n}$ |
| Truncation (slide) | $A'_{12,9} = U'_{12,2}\Sigma'_{2,2}V'^{T}_{9,2}$ |
| Deerwester matrix | 12 terms × 9 docs (c1–c5, m1–m4) |
| Raw cosines | human–user 0, user–minors 0, human–computer 0.500, trees–graph 0.667 |
| After k = 2 | human–user 0.888, user–minors +0.198, human–minors −0.275, human–computer 0.874, trees–graph 0.999 |
| Energy k = 2 / 3 | 56.8 % / 74.7 % |
| d5 slide / correct | {0.74, 0.403, 0, 0.24} / (0.484, 0.484, 0, 0.284) |
| tf-idf fit | tf × log2(4/df), except "on" in d4 |
| Folding (author) | $\hat q = \Sigma_k^{-1}U_k^{T}q$ |
| Slice fix | `vt[0:2,:]` not `vh[:,0:2]` |

## Comparisons
Raw vs reduced cosines (table above); orientation vs the Polo Club LSI clip (documents × terms there; folding $\hat q = qV_k\Lambda_k^{-1}$).

## Fact Check
13 rows: 7 confirmed, 2 partly, 4 contradicted. Contradicted: m1 "ordered" (paper "unordered"; also c1 "Lab ABC", m3 longer, m4 not listed); d5 values vs "divide by 5"; `vh[:,0:2]` slice; sim(user, minors) = −0.27. Partly: tf-idf weights (one cell off, formula not stated in the clip); spoken "four … and three" documents (speech only — the speaker first says nine, matching the slide's 5 + 4; the 4/3 may be an ASR mishearing). Confirmed: Deerwester example and matrix, raw cosines 0, LSA definition and meaning-as-average wording (Landauer, Foltz, Laham 1998), "a few thousand" dimensions limit (same paper), reconstruction, Σ values, sim(human, user) = 0.89.

## Open Questions & Extension Ideas
- Choice of k: clip uses 2 with no rule (toy). Deerwester: 50–100 factors (MED 100); Landauer et al.: 50–1,500 dimensions; Wikipedia: ~100–300.
- Weighting before SVD for ZVect (tf-idf variant; log-entropy is common in LSA) — not settled by the clip.
- SVD without numpy for the zero-dependency library (power iteration / Lanczos) — not in the clip.
- Author answer (HTML section 16): latent semantic = a training-free way to build a latent space (count/TF-IDF → SVD → k dims); ZVect 4.5 latent space = learned embeddings; Levy & Goldberg 2014 link SGNS to shifted-PMI matrix factorisation.

## Tags & Triggers
LSA, LSI, latent semantic analysis, SVD, numpy, np.linalg.svd, term-document matrix, cosine similarity, tf-idf, Deerwester 1990, dimensionality reduction, query folding, ZVect.
Triggers: "why human and user become similar after SVD", "numpy SVD slicing axis", "document vector as average of word vectors", "fold a query into LSA space", "latent semantic vs latent space".

## References
- Source video: https://www.youtube.com/watch?v=bzNch-dBCN8 (Francisco Iacobelli, 2019-11-17)
- Deerwester et al. (1990), Indexing by Latent Semantic Analysis, JASIS 41(6) 391–407 (https://www.stat.cmu.edu/~cshalizi/350/2008/readings/Deerwester-et-al.pdf, read through a fetch tool)
- Landauer, Foltz, Laham (1998), An Introduction to Latent Semantic Analysis, Discourse Processes 25, 259–284 (https://nats-www.informatik.uni-hamburg.de/pub/CrossLingIR/LiteraturListe/LSAintro.pdf)
- Wikipedia: Latent semantic analysis; Singular value decomposition
- Levy & Goldberg (2014), NIPS 27
- Companion report: 20200331_Latent-Semantic-Indexing-Explained (Polo Club, 7 × 5 example)

## Rebuild Notes
- Rebuilt from scratch by redo-lsi (Opus) on 2026-10-13 after the owner's complaint that equations were missing; same basename, supersedes the earlier report.
- Frames: whole-clip scene scan + 12 final frames (old FE2A–FE2C plus new XE2A_01 word-similarity slide, XE2A_02 meaning-of-a-word slide, XE2C_07 LSA slide with the C/M + D handwriting, XE2C_09 SVD slide with the crossed-out D). Inventory in slides.md, coverage in coverage.md. Grabs ran in a background tab (no front.lock needed; frames verified by eye).
- Transcript SHA matches the in-page value.
