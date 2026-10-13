# Introduction to Latent Semantic Analysis (1/5) — Joshua Cook, Databricks Academy - Claude Context
> Source: YouTube, Databricks Academy (Joshua Cook), "Introduction to Latent Semantic Analysis (1/5)", 3:24, published 2019-04-22 · https://www.youtube.com/watch?v=hB51kkus-Rc · Generated: 2026-10-13
> Companion: 20190422_Introduction-To-Latent-Semantic-Analysis.html (Thai, iw mode `iwd`, 10 sections, 5 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); slide text, the table and the vectors transcribed exactly; SVD equations and all numbers not on screen are the author's, recomputed with numpy/scikit-learn.
- Frames used: 01_vocabulary-slide, 02_lsa-two-steps, 03_doc-term-matrix, 04_documents-as-vectors, 05_svd-bullets.
- Own SVG diagrams: flow, bars.
- Transcript SHA-256 (in-page = decoded): `17f5253826320b5d7fe57ded6d080d68ce6e22cee74ea845f4fe60dd04f188f9`; kept in the session workspace only.

## TL;DR
Part 1 of 5 of Databricks Academy's "Introduction to Latent Semantic Analysis" (Joshua Cook, 3:24). Defines the vocabulary (NLP, document, body, dictionary, topic, latent), calls LSA an NLP and unsupervised technique whose aim is to represent text by topics (latent features) with dimensionality reduction as a side benefit, and gives the two steps: (1) document-term matrix, (2) SVD of that matrix. Toy example: 4 sentence fragments x 9 words. The clip shows no SVD formula; this file adds the formulas the later code computes (author content, recomputed). Slide error: the matrix row labelled "the quick red fox" holds the values of "the quick red dog".

## Key Concepts
- Vocabulary slide (~0:20-0:58), exact definitions: NLP = "A family of techniques used to derive meaning from text data"; Document = "A collection of words — the instances or "rows" of our dataset"; Body = "A collection of documents— our entire data set"; Dictionary = "The set of all words that appear in at least one document in our body"; Topic = "A collection of words that co-occur"; Latent = "Features that are "hidden" in the data which can not be directly measured. These features are essential to the data, but are not orginal features of the data set." (typo on slide).
- Author formalisation (Eq. 1): $B = \{d_1,\ldots,d_n\}$, $V = \operatorname{words}(d_1) \cup \cdots \cup \operatorname{words}(d_n)$, $m = |V|$; toy n = 4, m = 9 (4 + 2 + 1 + 2 new words per document).
- LSA = NLP + unsupervised (no target/label); aim: representations in terms of topics/latent features; side benefit: lower dimensionality. Author Eq. 2: $X \in \mathbb{R}^{n\times m} \mapsto Z \in \mathbb{R}^{n\times k},\ k<m$.
- Diagram (~1:40): Raw Text Data -> [dotted box "Latent Semantic Analysis": Document Term Matrix -> Singular Value Decomposition] -> Topic-Encoded Data. Only the middle two circles are inside the box.
- Document-term matrix (~2:05): "documents can be represented as points in Euclidean space aka vectors"; rows = documents, columns = dictionary. Eq. 3 (author): $X_{ij} = \operatorname{count}(w_j, d_i)$.
- Documents as vectors (~2:35, on screen exactly; LaTeX):
$$\mathbf{x}_{\text{the quick brown fox}} = (1,0,1,0,1,0,0,1,0)$$
$$\mathbf{x}_{\text{the slow brown dog}} = (1,1,0,0,0,0,1,1,0)$$
$$\mathbf{x}_{\text{the quick red dog}} = (0,1,0,0,1,1,0,1,0)$$
$$\mathbf{x}_{\text{the lazy yellow fox}} = (0,0,1,1,0,0,0,1,1)$$
- SVD cell (~2:45), exact bullets: "is similar to a Principal Component Analysis" / "reduces the dimension of the original data" / "transforms the data to be encoded using latent, or hidden, variables" / "for LSA, these latent variables represent topics".

## Implementation
Toy matrix (columns brown, dog, fox, lazy, quick, red, slow, the, yellow; row 3 = "the quick red dog"):
$$X = \begin{bmatrix} 1&0&1&0&1&0&0&1&0 \\ 1&1&0&0&0&0&1&1&0 \\ 0&1&0&0&1&1&0&1&0 \\ 0&0&1&1&0&0&0&1&1 \end{bmatrix}$$
Author equations (not on screen; scikit-learn user guide 2.5 notation), all numbers recomputed (numpy 2.5.3, scikit-learn 1.9.1, script recompute_toy.py):
- Euclidean distance (Eq. 6): $\lVert x_i - x_j\rVert_2 = \sqrt{\sum_t (X_{it}-X_{jt})^2}$; toy: pairs (1,2),(1,3),(1,4),(2,3) = 2; pairs (2,4),(3,4) = $\sqrt6$ = 2.449. Raw word space puts doc 1 equally far from the fox doc and the dog docs.
- Full SVD (Eq. 7, two displayed lines): $X = U\Sigma V^\top$, $U^\top U = I$, $V^\top V = I$, $\sigma_1 \ge \sigma_2 \ge \cdots \ge 0$; toy $\sigma$ = 3.011900, 1.829771, 1.414214, 1.257139.
- Truncated SVD and topic-encoded data (Eq. 8): $X \approx X_k = U_k\Sigma_k V_k^\top$, $Z = U_k\Sigma_k = XV_k$; toy k = 2: Z rows (1.6949, 0.2995), (1.5159, -0.7691), (1.5159, -0.7691), (1.2662, 1.4406) = part 2's notebook table.
- Energy (Eq. 9): $\sum_i\sigma_i^2 = \lVert X\rVert_F^2 = \sum_{ij}X_{ij}^2 = 16$; $\lVert X - X_k\rVert_F^2 = \sum_{i>k}\sigma_i^2$; $\sigma^2$ = 9.0715, 3.3481, 2.0000, 1.5804; k = 2 keeps 12.4196/16 = 77.6 %, error 3.5804 (verified directly).
- PCA relation (Eq. 10): $X_c = X - \mathbf{1}_n\mu^\top$, $\mu = \frac1n X^\top\mathbf{1}_n$, PCA(X) = SVD($X_c$); TruncatedSVD does not centre (scikit-learn docs). Centred toy $\sigma$ = 1.8347, 1.4142, 1.2783, 0 (the "the" column becomes zero).
- Preview of part 2 (Eq. 11): $z_{1,1} = \sum_j X_{1j}V_{j1} = 0.353937 + 0.326416 + 0.353937 + 0.660615 = 1.694905$ (brown, fox, quick, the).
- Counter-check of the slide label: if row 3 really were "the quick red fox", TruncatedSVD(2) gives (1.8216, 0.0747), (1.1941, 1.5630), (1.6839, -0.6126), (1.4465, -0.6712) — not the notebook's table, so the data was "dog".
- Sign: numpy returns both columns negated relative to scikit-learn; fix a sign convention (e.g. largest-|x| entry positive) in a home-made SVD.

## Quick Reference
| Item | Value | Source |
|---|---|---|
| Steps | document-term matrix -> SVD | diagram ~1:40 |
| Toy size | n = 4 documents, m = 9 words | table ~2:05 |
| Dictionary | brown, dog, fox, lazy, quick, red, slow, the, yellow | table |
| "the quick brown fox" | (1,0,1,0,1,0,0,1,0) | slide ~2:35, speech 2:37 |
| Slide error | row 3 label "the quick red fox" -> "the quick red dog" | author check |
| sigma | 3.0119, 1.8298, 1.4142, 1.2571 | author |
| Energy kept k = 2 | 77.6 % of 16 | author |
| LSA vs PCA | TruncatedSVD does not centre | scikit-learn docs |
| Recommended k | 100 (scikit-learn), 100-300 (Wikipedia) | external |

## Fact Check
9 claims: 5 confirmed (two-step LSA; unsupervised; dimensionality reduction; documents as Euclidean vectors; first vector), 3 partly (SVD "similar to PCA" — only after centring; latent variables "represent topics" — interpretation, dimensions may be hard to interpret; dictionary definition — CountVectorizer's default token pattern drops 1-character words), 1 contradicted (row-3 label on the matrix slide).

## Open Questions & Extension Ideas
- The clip gives no choice of k, no weighting (TF-IDF comes in part 4) and no folding of new text ($X' = XV_k$, scikit-learn guide).
- Use the 4 x 9 toy as a unit test for a dependency-free SVD (power iteration on $X^\top X$: eigenvalues 9.0715, 3.3481, 2, 1.5804).
- Show the distance example (all distances 2 or 2.449 in word space vs fox/dog separation after SVD) as a motivation figure in a lesson.

## Tags & Triggers
latent semantic analysis, LSA, document-term matrix, bag of words, SVD, truncated SVD, PCA, centring, topic, latent feature, dimensionality reduction, scikit-learn, Databricks. Triggers: "what are the two steps of LSA", "document-term matrix example", "X approx U_k Sigma_k V_k^T", "LSA vs PCA", "quick red fox slide error".

## References
- Source: https://www.youtube.com/watch?v=hB51kkus-Rc (Databricks Academy, Joshua Cook, 2019-04-22).
- scikit-learn TruncatedSVD: https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html
- scikit-learn user guide 2.5 (truncated SVD and LSA): https://scikit-learn.org/stable/modules/decomposition.html
- scikit-learn CountVectorizer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
- Wikipedia, Latent semantic analysis: https://en.wikipedia.org/wiki/Latent_semantic_analysis
- Related reports (same folder): 20190516_Trivial-LSA-With-Scikit-Learn (part 2), 20190422_LSA-Two-Childrens-Books-Part-3 (part 3), 20190422_Improving-LSA-With-TF-IDF-Part-4 (part 4), 20190516_LSA-With-Apache-Spark-Part-5 (part 5), 20200331_Latent-Semantic-Indexing-Explained, 20191117_Latent-Semantic-Analysis-Lsa.
