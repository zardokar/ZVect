# A Trivial Implementation of LSA using Scikit Learn (2/5) — Joshua Cook, Databricks Academy - Claude Context
> Source: YouTube, Databricks Academy (Joshua Cook), "A Trivial Implementation of LSA using Scikit Learn (2/5)", 5:46, published 2019-05-16 · https://www.youtube.com/watch?v=Fy0bF7u6W20 · Generated: 2026-10-13
> Companion: 20190516_Trivial-LSA-With-Scikit-Learn.html (Thai, iw mode `iwd`, 10 sections, 9 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); code, notebook text and every output table transcribed exactly; equations are the author's (what the code computes), all numbers recomputed with scikit-learn and matching the notebook.
- Frames used: 01_body-list, 02_countvectorizer-vectors, 03_truncatedsvd-code, 04_topic-encoded-table, 05_pipeline-byproducts, 06_dictionary, 07_encoding-matrix, 08_sorted-topic-1, 09_sorted-topic-2.
- Own SVG diagrams: flow, plane, bars.
- Transcript SHA-256 (in-page = decoded): `e228eca32a2460de12781f0ea7d14b8c812f36b43a886222d75c397caed150e3`; kept in the session workspace only.

## TL;DR
Part 2 of 5 of Databricks Academy's LSA series (Joshua Cook, 5:46): a trivial LSA in scikit-learn on the 4 sentence fragments of part 1. Pipeline: raw text -> `CountVectorizer` (document-term matrix / bag of words) -> `TruncatedSVD(n_components=2)` -> topic-encoded data, then two byproducts: the dictionary and the encoding matrix (`svd.components_`). Topic 1 is dominated by "the" (0.6606); topic 2 separates fox (+0.5197) from dog (-0.4594) — the speaker calls it "foxiness". Every number on screen was reproduced exactly (scikit-learn 1.9.1). The equations below are the author's, written for what the code computes.

## Key Concepts
- Four steps (0:33): collect raw text; convert to document-term matrix; SVD of it; examine topic-encoded data. Databricks Runtime for ML ships scikit-learn, TensorFlow, XGBoost.
- Bag of words = "the simplest implementation of a document-term matrix" (speaker). Each document becomes a vector.
- "Truncated": we do not get back as many vectors as we put in (speaker). Notebook text adds "without significant loss of information" (on screen only).
- Topic-encoded data: 4 x 2; all documents strong in topic 1; topic 2 separates docs 2-3 (dog) from 1-4 (fox).
- Byproducts: dictionary (`vectorizer.get_feature_names()`, an attribute of a fit CountVectorizer) and encoding matrix (`svd.components_`, trailing underscore = fitted attribute); values = "expression" of a word in a topic; interpret by absolute value (negative as important as positive).

## Implementation
Code on screen, verbatim:
```python
body = [
    "the quick brown fox",
    "the slow brown dog",
    "the quick red dog",
    "the lazy yellow fox"
]
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer()
bag_of_words = vectorizer.fit_transform(body)
bag_of_words.todense()
from sklearn.decomposition import TruncatedSVD
svd = TruncatedSVD(n_components=2)
lsa = svd.fit_transform(bag_of_words)
import pandas as pd
topic_encoded_df = pd.DataFrame(lsa, columns = ["topic_1", "topic_2"])
topic_encoded_df["body"] = body
display(topic_encoded_df[["body", "topic_1", "topic_2"]])
dictionary = vectorizer.get_feature_names()   # today: get_feature_names_out()
encoding_matrix = pd.DataFrame(svd.components_,
                               index=['topic_1', 'topic_2'],
                               columns=dictionary).T
import numpy as np
encoding_matrix['abs_topic_1'] = np.abs(encoding_matrix['topic_1'])
encoding_matrix['abs_topic_2'] = np.abs(encoding_matrix['topic_2'])
encoding_matrix.sort_values('abs_topic_1', ascending=False)
encoding_matrix.sort_values('abs_topic_2', ascending=False)
```
Equations (author; scikit-learn user guide 2.5 notation):
- Document vectors (on screen, LaTeX):
$$\text{“the quick brown fox”} = (1,0,1,0,1,0,0,1,0)$$
$$\text{“the slow brown dog”} = (1,1,0,0,0,0,1,1,0)$$
$$\text{“the quick red dog”} = (0,1,0,0,1,1,0,1,0)$$
$$\text{“the lazy yellow fox”} = (0,0,1,1,0,0,0,1,1)$$
  $X_{dj} = \operatorname{count}(w_j, d)$, X is 4 x 9.
- Fit: $X \approx X_2 = U_2\Sigma_2V_2^\top$, $\Sigma_2 = \operatorname{diag}(3.0119, 1.8298)$ (`singular_values_`); $\lVert X\rVert_F^2 = 9.0715+3.3481+2.0000+1.5804 = 16$; $\lVert X - X_2\rVert_F^2 = 3.5804$; kept 77.6 %.
- Eigenvalues: $\sigma_i^2 = \lambda_i(X^\top X)$, $\lambda$ = 9.0715, 3.3481, 2.0000, 1.5804 (the other five are 0; trace = 16); columns of V are the eigenvectors of $X^\top X$ (numpy check, all digits match).
- Output: $Z = \texttt{lsa} = U_2\Sigma_2 = XV_2$ (verified equal to machine precision).
- Cell formula: $z_{dk} = \sum_j X_{dj}V_{jk}$. All eight cells: z11 = 0.353937+0.326416+0.353937+0.660615 = 1.694905; z12 = -0.140256+0.519736-0.140256+0.060300 = 0.299524; z21 = 0.353937+0.334199+0.167100+0.660615 = 1.515851; z22 = -0.140256-0.459436-0.229718+0.060300 = -0.769110; z31 = 0.334199+0.353937+0.167100+0.660615 = 1.515851; z32 = -0.459436-0.140256-0.229718+0.060300 = -0.769110; z41 = 0.326416+0.139578+0.660615+0.139578 = 1.266187 (full precision 1.266186); z42 = 0.519736+0.430274+0.060300+0.430274 = 1.440584 (1.440585).
- Notebook table (exact): 1.6949049311864626 / 0.2995240544049744; 1.5158511142026 / -0.7691103672363867; 1.5158511142025999 / -0.7691103672363875; 1.2661860628667378 / 1.4405851327176693.
- Encoding matrix: $\texttt{encoding\_matrix} = V_2 = (\texttt{svd.components\_})^\top \in \mathbb{R}^{9\times2}$, $V_2^\top V_2 = I$, $v_k = X^\top u_k/\sigma_k$; $u_1$ = (0.562736, 0.503287, 0.503287, 0.420395); $v_{\text{the},1} = 1.989705/3.011900 = 0.660615$.
- Encoding matrix values (exact, Out[7]): brown 0.353937/-0.140256, dog 0.334199/-0.459436, fox 0.326416/0.519736, lazy 0.139578/0.430274, quick 0.353937/-0.140256, red 0.167100/-0.229718, slow 0.167100/-0.229718, the 0.660615/0.060300, yellow 0.139578/0.430274.
- Ranking: $\operatorname{score}_k(w_j) = |V_{jk}|$. Topic 1 order: the, quick, brown, dog, fox, red, slow, lazy, yellow. Topic 2 order: fox, dog, lazy, yellow, red, slow, quick, brown, the.
- Foxiness: $z_{d,2} = \sum_j X_{dj}V_{j2}$; doc 1 = 0.299524, doc 4 = 1.440584 (lazy/yellow +0.430274 each).
- New document (author): q = "the quick red fox" = (0,0,1,0,1,1,0,1,0); $\hat q = qV_2$ = (1.508067, 0.210062); cosine to docs 1-4 = 0.9993, 0.8208, 0.8208, 0.7575.
- explained_variance_ratio_ = 0.0133, 0.4768 (no centring, so topic 1 explains little variance). numpy's SVD returns both columns negated (sign indeterminacy).
- Script: recompute_toy.py / .out (numpy 2.5.3, scikit-learn 1.9.1).

## Quick Reference
| Item | Value |
|---|---|
| X | 4 x 9, columns brown, dog, fox, lazy, quick, red, slow, the, yellow |
| sigma1, sigma2 | 3.0119, 1.8298 |
| Energy kept | 77.6 % of 16 |
| Z rows | (1.6949, 0.2995), (1.5159, -0.7691) x2, (1.2662, 1.4406) |
| Top topic 1 | the 0.6606 |
| Top topic 2 | fox +0.5197, dog -0.4594, lazy/yellow +0.4303 |
| Docs 2 and 3 | identical (quick = brown, red = slow loadings) |
| API change | get_feature_names deprecated 1.0, removed 1.2 -> get_feature_names_out |

## Fact Check
10 claims: 6 confirmed (CountVectorizer = DTM; truncated = fewer vectors; topic table numbers; components_ = encoding matrix; absolute values; "the" top of topic 1), 3 partly ("without significant loss of information" depends on the measure: 77.6 % of Frobenius energy but explained_variance_ratio_ sums to 49 %; "foxiness" — lazy/yellow nearly as strong; Runtime for ML library list checked only for the current runtime), 1 contradicted/outdated (`get_feature_names`).

## Open Questions & Extension Ideas
- Fold-in of new text is not in the clip; $XV_k$ works (example above).
- Use this toy as a parity test for a dependency-free SVD; fix a sign convention.
- Stop words (part 3) and TF-IDF (part 4) address the "the" topic.

## Tags & Triggers
LSA, scikit-learn, CountVectorizer, TruncatedSVD, bag of words, topic-encoded data, encoding matrix, components_, dictionary, get_feature_names_out, foxiness, sign indeterminacy. Triggers: "what does TruncatedSVD fit_transform compute", "why is topic_1 1.6949", "what is the encoding matrix in LSA", "fold a new document into LSA".

## References
- Source: https://www.youtube.com/watch?v=Fy0bF7u6W20 (Databricks Academy, Joshua Cook, 2019-05-16).
- scikit-learn TruncatedSVD: https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html
- scikit-learn user guide 2.5: https://scikit-learn.org/stable/modules/decomposition.html
- scikit-learn CountVectorizer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
- scikit-learn 1.0 release notes: https://scikit-learn.org/stable/whats_new/v1.0.html
- Databricks Runtime 16.4 LTS ML: https://docs.databricks.com/release-notes/runtime/16.4ml.html
- Related reports (same folder): 20190422_Introduction-To-Latent-Semantic-Analysis (part 1), 20190422_LSA-Two-Childrens-Books-Part-3 (part 3), 20190422_Improving-LSA-With-TF-IDF-Part-4 (part 4), 20190516_LSA-With-Apache-Spark-Part-5 (part 5), 20200331_Latent-Semantic-Indexing-Explained, 20191117_Latent-Semantic-Analysis-Lsa.
