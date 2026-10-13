# Improving the LSA with a TFIDF (4/5) — Databricks Academy (Joshua Cook) - Claude Context
> Source: YouTube, Databricks Academy (Joshua Cook), "Improving the LSA with a TFIDF (4/5)", 5:24, published 2019-04-22 · https://www.youtube.com/watch?v=YX4xRIQ84Z0 · Generated: 2026-10-13
> Companion: 20190422_Improving-LSA-With-TF-IDF-Part-4.html (Thai, iw mode `iwd`, 15 sections, 12 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); equations, table values and short code transcribed exactly from the frames.
- Frames used: 01_lsa-pipeline, 02_tf-over-df, 03_tfidf-overlay, 04_the-highlighted, 05_tfidf-code, 05b_topic-encoded-cells, 05c_encoding-matrix, 06_topic1-table, 07_topic2-table, 08_plot-code, 09_plot-count, 10_plot-tfidf.
- Own SVG diagrams: flow, bars, bars.
- Transcript SHA-256 (in-page = decoded): `9ec5d5867fcc (decode of the first job; differs from the page's 89cf8b76… at equal length 5831 chars, documented as a console-copy artefact; transcript reused, not re-grabbed)`; kept in the session workspace only.

## TL;DR
- Part 4 of 5 of Databricks Academy's LSA series (Joshua Cook, 5:24, 2019-04-22). Part 3 ran LSA (raw text → document-term matrix → SVD → topic-encoded data) on the lines of two children's books (Goodnight Moon, Where the Wild Things Are; one line = one document; all lines = the "body") and the plot had noise.
- The speaker argues SVD cannot be tuned "in the conventional sense": the vectors are deterministic and will not change substantially per fit; the only hyperparameter (number of vectors) has no bearing on any one vector. What can be changed is the document-term matrix, so `CountVectorizer` is replaced by `TfidfVectorizer` with the same arguments (`min_df=1`, `stop_words='english'`); the SVD code is unchanged.
- Result (frames): topic order swaps. Topic 1 = Goodnight Moon (goodnight 0.9015, moon 0.1695, then brush/comb/mush ≈0.1147, chairs/kittens/bears ≈0.1035, mittens 0.1010); topic 2 = Wild Things (wild 0.5649, things 0.5527, king 0.3012, max 0.2199, terrible 0.2171, said 0.1833, eat 0.1402, gave 0.1241, thing 0.1030). The speaker says the noise is "largely gone", with one lingering problematic point left for another time.
- On screen: a fraction "Term Frequency / Document Frequency" (~2:05), the word "TFIDF" (~2:22), and a paragraph from "My Father's Dragon" (Ruth Stiles Gannett, 1948) with all 7 "the" highlighted (~2:46). No exact formula is shown ("without going into the details").
- Author corrections: `TruncatedSVD` does not centre, so its vectors are eigenvectors of $X^\top X$, not of the covariance (PCA); toy cosine between the two first directions 0.7614 (counts) / 0.6826 (tf-idf). Signs of components are arbitrary. The L2 row normalisation of `TfidfVectorizer` bounds $\lVert z_d \rVert \le 1$, which matches the new plot axes (≈0.9 / 0.8 vs ≈4.7 / 2.5 before).

## Key Concepts
- LSA pipeline (slide ~0:50): Raw Text Data → Document Term Matrix → Singular Value Decomposition → Topic-Encoded Data; a dotted box "Latent Semantic Analysis" encloses the middle two.
- Truncated SVD (author): $X \approx U_k \Sigma_k V_k^{\top}$, $X\in\mathbb{R}^{n\times m}$ (documents × terms), $k=2$ here (`n_components=2`). `components_` $=V_k^\top$; `fit_transform` returns $Z = X V_k = U_k\Sigma_k$, $z_d = V_k^\top x_d$.
- Speaker's claim (~0:55): "SVD vectors of $X$ ∼ eigenvectors of $\operatorname{cov}(X)$" ("analogous to").
- What TruncatedSVD computes (author): $X^{\top} X v_j = \sigma_j^2 v_j$. PCA instead: $C = \frac{1}{n-1}(X-\mathbf{1}\mu^\top)^\top(X-\mathbf{1}\mu^\top)$, $C w_j = \lambda_j w_j$.
- Independence from k (author): $V_k=[v_1,\dots,v_k] \Rightarrow v_j^{(k=2)} = v_j^{(k=5)}$; toy max differences are at the 1e-15 to 1e-14 level for counts and tf-idf (the exact value changes on every run because ARPACK starts from a random vector); randomized solver seeds 0 vs 1: ~1e-15 (counts) / ~1e-14 (tf-idf).
- Sign ambiguity (author): $u_j\sigma_j v_j^\top = (-u_j)\sigma_j(-v_j)^\top$ — the reason the notebook sorts by absolute loadings. The author hypothesises (part-5 report) that sorting by signed weights there is why topic 1 looks noisy.
- Slide fraction (~2:05): $\dfrac{\text{Term Frequency}}{\text{Document Frequency}}$ — an idea, not the computed formula.
- Speaker's definition (~2:12–2:25): $\operatorname{tfidf}(t,d) = \operatorname{tf}(t,d)\cdot\operatorname{idf}(t)$; IDF "penalizes" a term that appears in many documents of the body; IDF is a numerical measure of how much information a term provides (~2:55).
- Slide 2:46 author count: $f_{\text{the},d}/\sum_{t'} f_{t',d} = 7/82 \approx 0.085$ (most frequent token; next "you" 4).
- Loadings (author): $\text{topic}_j(t) = (V_k)_{t,j}$, $\text{abs\_topic}_j(t) = |(V_k)_{t,j}|$, $\sum_t (V_k)_{t,j}^2 = 1$. Sum of squares of the 9 visible rows: 0.9233 (topic 1), 0.8902 (topic 2); goodnight² = 0.8127 of topic 1; wild² + things² = 0.6247 of topic 2.

## Implementation
Code transcribed from the frames (notebook "Latent Semantic Analysis, Part 1 (Python)", Databricks, run 3/26/2019):
```python
# Cmd 53 (~3:15)
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(min_df=1, stop_words='english')
bag_of_words = vectorizer.fit_transform(body_df.sentence)

# Cmd 55
svd = TruncatedSVD(n_components=2)
lsa = svd.fit_transform(bag_of_words)

# Cmd 57 (~3:37) — its display output never appears on screen
topic_encoded_tfidf_df = pd.DataFrame(lsa, columns = ["topic_1", "topic_2"])
topic_encoded_tfidf_df['sentence'] = body_df.sentence
topic_encoded_tfidf_df['Is_Wild_Things'] = (body_df.title == "Where the Wild Things Are")
display(topic_encoded_tfidf_df.iloc[sample_indices])

# Cmd 59 "The Dictionary" — output tail visible: 'bowl', 'brush'] (0.01 s, 3/26/2019 12:31:29 PM)
dictionary = vectorizer.get_feature_names()
dictionary[:10]

# Cmd 61 "The Encoding Matrix" (~3:43)
encoding_matrix = pd.DataFrame(svd.components_,
                               index=['topic_1', 'topic_2']).T
encoding_matrix["terms"] = dictionary
display(encoding_matrix)

# Cmd 63 (~3:46)
encoding_matrix['abs_topic_1'] = np.abs(encoding_matrix['topic_1'])
encoding_matrix['abs_topic_2'] = np.abs(encoding_matrix['topic_2'])
display(encoding_matrix.sort_values('abs_topic_1', ascending=False))
# Cmd 64
display(encoding_matrix.sort_values('abs_topic_2', ascending=False))

# Cmd 66 "Plot Top Two Components" (line 15 not legible in any frame)
fig, ax = plt.subplots()
for val in topic_encoded_df.Is_Wild_Things.unique():
  topic_1 = topic_encoded_df[topic_encoded_df.Is_Wild_Things == val]['topic_1'].values
  topic_2 = topic_encoded_df[topic_encoded_df.Is_Wild_Things == val]['topic_2'].values
  print(val)
  color = "red" if val else "green"
  label = "Where the Wild Things Are" if val else "Goodnight, Moon"
  ax.scatter(topic_1, topic_2, c=color, alpha=0.3, label=label)
# made the colors represent different books
ax.set_xlabel('First Topic')
ax.set_ylabel('Second Topic')
ax.axvline(linewidth=0.5)
ax.legend()
display(fig)
# Cmd 67: same with topic_encoded_tfidf_df
```
Encoding matrix as displayed by Cmd 61 (first 9 rows, alphabetical; 0.26 s, 3/26/2019 12:31:36 PM):

| topic_1 | topic_2 | terms |
|---|---|---|
| 0.0843009760849423 | -0.00044291045064869796 | air |
| 0.000017219980138332213 | -0.000029270177303744287 | away |
| 0.0008208088561413967 | 0.002615158815918329 | balloon |
| 0.10348405573293327 | -0.0010021178485172869 | bears |
| -0.000014791588412084535 | 0.059107229889561755 | bed |
| 0.000015924242029231338 | 0.05247424378514348 | best |
| 0.00003121178286457244 | 0.004512359532198623 | blinking |
| 0.0002254911343277492 | 0.02484504245955134 | boat |
| 0.024254722398411716 | 0.0011483457960984064 | bowl |

Topic-1 table (Cmd 63, sorted by abs_topic_1; 0.29 s, 12:32:01 PM):

| topic_1 | topic_2 | terms | abs_topic_1 | abs_topic_2 |
|---|---|---|---|---|
| 0.9015076222797253 | -0.0016946238083589294 | goodnight | 0.9015076222797253 | 0.0016946238083589294 |
| 0.16946770166144268 | -0.0006952752373089357 | moon | 0.16946770166144268 | 0.0006952752373089357 |
| 0.11476186826638428 | 0.0013623995490381461 | brush | 0.11476186826638428 | 0.0013623995490381461 |
| 0.1147361024693723 | 0.001488065122501941 | comb | 0.1147361024693723 | 0.001488065122501941 |
| 0.11472207423603435 | 0.001189876034967373 | mush | 0.11472207423603435 | 0.001189876034967373 |
| 0.10351154822563427 | -0.0012004317258317364 | chairs | 0.10351154822563427 | 0.0012004317258317364 |
| 0.10349481862368447 | -0.0011535953692766168 | kittens | 0.10349481862368447 | 0.0011535953692766168 |
| 0.10348405573293327 | -0.0010021178485172869 | bears | 0.10348405573293327 | 0.0010021178485172869 |
| 0.10103775211170506 | 0.0020541959206301515 | mittens | 0.10103775211170506 | 0.0020541959206301515 |

Topic-2 table (Cmd 64, sorted by abs_topic_2; 0.39 s, 12:33:19 PM):

| topic_1 | topic_2 | terms | abs_topic_1 | abs_topic_2 |
|---|---|---|---|---|
| 0.00021320338546504416 | 0.5649441592307853 | wild | 0.00021320338546504416 | 0.5649441592307853 |
| -0.0000811391360424961 | 0.5527108903661909 | things | 0.0000811391360424961 | 0.5527108903661909 |
| -0.00010650820193683554 | 0.3012286879261333 | king | 0.00010650820193683554 | 0.3012286879261333 |
| 0.0008744844047196795 | 0.219927038844626 | max | 0.0008744844047196795 | 0.219927038844626 |
| 0.00010590579730532794 | 0.21708247032719705 | terrible | 0.00010590579730532794 | 0.21708247032719705 |
| 0.0002766639380300022 | 0.18333107491455872 | said | 0.0002766639380300022 | 0.18333107491455872 |
| 0.000049638246624448506 | 0.14015505822283478 | eat | 0.000049638246624448506 | 0.14015505822283478 |
| -0.00006648332146003446 | 0.12411446038396975 | gave | 0.00006648332146003446 | 0.12411446038396975 |
| 0.0004496878334625484 | 0.10304891669288818 | thing | 0.0004496878334625484 | 0.10304891669288818 |

The markdown cell above Cmd 53 still says "Again, we use CountVectorizer, now with a few more arguments" (min_df definition, link to sklearn's english stop_words file, "CountVectorizer returns a sparse matrix").

sklearn defaults that the clip relies on without showing them (author, from the scikit-learn docs):
- $\operatorname{tf}(t,d) = f_{t,d}$ (`sublinear_tf=False`)
- $\operatorname{idf}(t) = \ln \frac{1+n}{1+\operatorname{df}(t)} + 1$ (`smooth_idf=True`); with `smooth_idf=False`: $\ln\frac{n}{\operatorname{df}(t)}+1$; textbook form quoted by sklearn: $\log\frac{n}{\operatorname{df}(t)+1}$
- $\hat{x}_d = v_d/\lVert v_d\rVert_2$, $v_{d,t} = \operatorname{tf}(t,d)\cdot\operatorname{idf}(t)$, $\lVert v_d\rVert_2 = \sqrt{\sum_{t=1}^m v_{d,t}^2}$ (`norm='l2'`)
- `TruncatedSVD`: `algorithm='randomized'`, `random_state=None` (no seed in the clip's code)

Worked example (author's 10-line toy corpus in recompute.py, not the clip's data): n = 10; idf(goodnight) = ln(11/6)+1 = 1.6061 (df 5); idf(moon) = 2.2993 (df 2); idf(terrible) = 2.0116 (df 3); idf(brush) = ln(11/2)+1 = 2.7047 (df 1). Line "goodnight comb and goodnight brush": tf = (brush 1, comb 1, goodnight 2) → v = (2.7047, 2.7047, 3.2123), ‖v‖ = 4.995 → x̂ = (0.5415, 0.5415, 0.6431), equal to sklearn's output. Raw-count length of the same line √6 ≈ 2.449.

Bound that explains the new axes (author): $\lVert z_d\rVert_2 = \lVert V_k^\top \hat{x}_d\rVert_2 \le \lVert \hat{x}_d\rVert_2 = 1$. Toy max ‖z‖: 0.7857 (tf-idf) vs 2.1187 (counts).

Spark's IDF for part 5 (author, Spark ml-features docs): $\operatorname{IDF}(t,D) = \log\frac{|D|+1}{\operatorname{DF}(t,D)+1}$, $\operatorname{TFIDF}(t,d,D) = \operatorname{TF}(t,d)\cdot\operatorname{IDF}(t,D)$; with equal n, $\operatorname{idf}_{\text{sklearn}} - \operatorname{IDF}_{\text{Spark}} = 1$ and the Spark IDF is 0 when DF = |D|. Toy: goodnight 0.6061, brush 1.7047; the toy line becomes (1.7047, 1.7047, 1.2123), length 2.6985 (no normalisation; add `Normalizer(p=2)` for sklearn-like rows).

## Quick Reference
| Item | Value |
|---|---|
| Data | lines of Goodnight Moon and Where the Wild Things Are (1 line = 1 document) |
| Changed step | document-term matrix: `CountVectorizer` → `TfidfVectorizer` |
| Arguments | `min_df=1`, `stop_words='english'` |
| SVD | `TruncatedSVD(n_components=2)`, unchanged |
| On-screen formula | Term Frequency / Document Frequency (~2:05) |
| "the" slide | 7 highlighted of 82 tokens (author count), from My Father's Dragon (1948) |
| Topic 1 (tf-idf) | goodnight 0.9015076222797253, moon 0.16946770166144268, brush 0.11476186826638428, comb 0.1147361024693723, mush 0.11472207423603435, chairs 0.10351154822563427, kittens 0.10349481862368447, bears 0.10348405573293327, mittens 0.10103775211170506 |
| Topic 2 (tf-idf) | wild 0.5649441592307853, things 0.5527108903661909, king 0.3012286879261333, max 0.219927038844626, terrible 0.21708247032719705, said 0.18333107491455872, eat 0.14015505822283478, gave 0.12411446038396975, thing 0.10304891669288818 |
| Cross loadings | topic_2 of topic-1 words ≤ 0.0021 in magnitude; topic_1 of topic-2 words ≤ 0.00088 |
| Part 3 (counts) | topic 1 = Wild Things (terrible 0.652), topic 2 = Goodnight Moon (goodnight 0.876) |
| Count plot axes | x to ≈4.7 (ticks 0–4), y 0–2.5; some red points above the axis (≈(2.4, 0.3)) and some just below (≈(1.9, −0.1), (2.9, −0.05), (4.6, −0.15)) |
| TF-IDF plot axes | x to ≈0.9 (ticks 0.0–0.8), y 0–0.8; a dark point on the vertical axis at y≈0.07 is a plausible candidate for the "problematic point" (author) |
| Cell timings | 0.29 s (topic 1 table), 0.39 s (topic 2 table), 0.39 s / 0.38 s (plots), 3/26/2019 |

## Comparisons
| | Counts (part 3) | TF-IDF (part 4) |
|---|---|---|
| Topic 1 | Wild Things (terrible 0.652) | Goodnight Moon (goodnight 0.9015) |
| Topic 2 | Goodnight Moon (goodnight 0.876) | Wild Things (wild 0.5649, things 0.5527) |
| Axes | ≈4.7 × 2.5 | ≈0.9 × 0.8 |
| Noise (speaker) | "a bit of noise", esp. Wild Things | "largely gone", one point left |

| TF-IDF variant | tf | idf | term in every doc | row norm |
|---|---|---|---|---|
| textbook (as quoted by sklearn) | count | log(n/(df+1)) | slightly negative | — |
| sklearn default (this clip) | raw count | ln((1+n)/(1+df)) + 1 | idf = 1 | L2 |
| Spark ml `IDF` (part 5) | `CountVectorizer` count | ln((n+1)/(df+1)), n = documents | idf = 0 | none |

## Fact Check
12 claims: 9 confirmed, 3 partly.
- LSA step 3 = SVD; `TruncatedSVD` "(aka LSA)" — confirmed (sklearn docs).
- SVD vectors "analogous to" eigenvectors of the covariance — partly: TruncatedSVD does not centre (docs); vectors are eigenvectors of XᵀX; equal to covariance eigenvectors only for centred data; toy cosine 0.7614 / 0.6826.
- Deterministic, won't change substantially — partly: randomized solver with random_state=None; toy differences ~1e-14; sign of components depends on algorithm and random state (docs).
- Number of vectors has no bearing on each vector — confirmed (toy differences at the 1e-15 to 1e-14 level, varying per run).
- "eigen" = German own/inherent — confirmed (Wikipedia: proper, characteristic, own).
- Runtime for ML includes scikit-learn, TensorFlow, XGBoost — confirmed for Runtime 16.4 LTS ML (2019 list not checked).
- `TfidfVectorizer` in `sklearn.feature_extraction.text` — confirmed.
- `min_df=1`, English stop words — confirmed (defaults; docs warn the 'english' list has known issues).
- TF-IDF penalises terms in many documents — partly: sklearn's +1 keeps idf ≥ 1.
- IDF = measure of how much information a term provides — confirmed (Spark docs wording).
- Topic 1 = Goodnight Moon, topic 2 = Wild Things with TF-IDF — confirmed (frames; unit-length check).
- Noise reduced — confirmed by the two plots; axes ≤ 1 consistent with L2.

## Open Questions & Extension Ideas
- Which "lingering problematic point" the speaker meant is not said; the plot shows almost every point on an axis.
- Separate the effects of IDF and L2: run `TfidfVectorizer(use_idf=False)` (L2 only) vs `norm=None` (IDF only) on the same body. The author expects L2 to explain the axis shrink (4.7 → 0.9) and much of the noise removal.
- Set `random_state` (or `algorithm='arpack'`) for reproducible signs; interpret topics with absolute loadings or by flipping each component so its largest loading is positive.
- For ZVect's planned retrieval-only Q&A (BM25 + TF-IDF→SVD latent space + RRF): use smoothed idf + L2 rows before SVD (dot product = cosine), state the exact TF-IDF recipe, and fix the document unit (line/paragraph) before computing df.
- Thai text needs word segmentation before df/tf; this clip's English stop list does not apply.

## Tags & Triggers
LSA, latent semantic analysis, TF-IDF, TfidfVectorizer, CountVectorizer, TruncatedSVD, PCA vs truncated SVD, covariance vs X^T X, L2 normalisation, smooth_idf, scikit-learn, Databricks Academy, topic loadings, Goodnight Moon, Where the Wild Things Are.
Triggers: "what idf formula does TfidfVectorizer use", "why does TF-IDF reduce noise in LSA", "TruncatedSVD vs PCA", "how to read an LSA encoding matrix", "does n_components change SVD vectors".

## References
- Joshua Cook (Databricks Academy), "Improving the LSA with a TFIDF (4/5)", YouTube, 2019-04-22 — https://www.youtube.com/watch?v=YX4xRIQ84Z0
- scikit-learn TruncatedSVD — https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html
- scikit-learn TfidfTransformer — https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html
- scikit-learn TfidfVectorizer — https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
- scikit-learn CountVectorizer — https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
- Apache Spark ml-features (IDF formula) — https://spark.apache.org/docs/latest/ml-features.html
- Wikipedia, Eigenvalues and eigenvectors — https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors
- Databricks Runtime 16.4 LTS for Machine Learning release notes — https://docs.databricks.com/aws/en/release-notes/runtime/16.4lts-ml
- Author recomputation: recompute.py / recompute.out (scikit-learn 1.9.1, numpy 2.5.3).
- Related reports (same folder): 20190422_Introduction-To-Latent-Semantic-Analysis (part 1), 20190516_Trivial-LSA-With-Scikit-Learn (part 2), 20190422_LSA-Two-Childrens-Books-Part-3 (part 3), this report (part 4), 20190516_LSA-With-Apache-Spark-Part-5 (part 5), 20200331_Latent-Semantic-Indexing-Explained (LSI, Georgia Tech), 20191117_Latent-Semantic-Analysis-Lsa (LSA, Francisco Iacobelli).
