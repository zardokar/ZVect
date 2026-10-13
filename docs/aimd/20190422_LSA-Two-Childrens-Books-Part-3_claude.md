# A Second LSA (3/5) — Joshua Cook, Databricks Academy - Claude Context
> Source: YouTube, Databricks Academy (Joshua Cook), "A Second LSA (3/5)", 5:41, published 2019-04-22 · https://www.youtube.com/watch?v=NWb_4O3ssbA · Generated: 2026-10-13
> Companion: 20190422_LSA-Two-Childrens-Books-Part-3.html (Thai, iw mode `iwd`, 13 sections, 11 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); code and every number in the notebook tables transcribed exactly from zoomed frames; book text not copied beyond the short lines the analysis needs; equations are the author's, checked against the notebook's numbers (recompute_part3.py).
- Frames used: 01_body-dataframe, 02_sample-documents, 03_countvectorizer-args, 04_truncatedsvd-code, 05_topic-encoded-sample, 06_dictionary, 07_encoding-matrix, 08_sorted-topic-1, 09_sorted-topic-2, 10_plot-code, 11_scatter-plot.
- Own SVG diagrams: flow, bars, bars.
- Transcript SHA-256 (in-page = decoded): `2601c532dbb36c632d3dc35cddd3265f97b8e40b06d459d5f45bac9b7bbd6e2a`; kept in the session workspace only.

## TL;DR
Part 3 of 5 of Databricks Academy's LSA series (Joshua Cook, 5:41, notebook "Latent Semantic Analysis, Part 1"): LSA on every line of two children's books (Goodnight Moon, Where the Wild Things Are), one line = one document. Spark loads body.csv, pandas, `CountVectorizer(min_df=1, stop_words='english')`, `TruncatedSVD(n_components=2)`, an `Is_Wild_Things` label for checking, dictionary + encoding matrix, absolute-value ranking, matplotlib scatter. Topic 1 = Wild Things words (terrible 0.6518), topic 2 = Goodnight Moon words (goodnight 0.8763); the scatter separates the books along the two axes with one noisy Wild Things point (fixed with TF-IDF in part 4). The author verified with the notebook's own numbers that each topic value is the sum of the loadings of the line's remaining words.

## Key Concepts
- Document = one line of a book; body = all lines of both books. The title column is not used by LSA (unsupervised); `Is_Wild_Things` only checks the result.
- `min_df`: "the number of documents in which a term must appear in order for it to be counted" (notebook). Value on screen = 1 (= scikit-learn default) -> drops nothing. The working filter is `stop_words='english'` (removes "the", "and").
- Encoding matrix = `svd.components_`.T with a `terms` column; values = expression/loading of a term in a topic; interpret with absolute values.
- Identical loadings (gnashed = roars = teeth = roared = 0.17417875047437262; hush = lady = old = 0.16522781313995177) follow from identical columns of X (author derivation below).

## Implementation
Code on screen, verbatim:
```python
bodyDF = (spark.read
  .option("header", "true")
  .csv("/FileStore/tables/body.csv")
  .select("sentence", "title"))
display(bodyDF)
body_df = bodyDF.toPandas()
sample_df = body_df.sample(5)
sample_indices = sample_df.index
display(sample_df)
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(min_df=1, stop_words='english')
bag_of_words = vectorizer.fit_transform(body_df.sentence)
svd = TruncatedSVD(n_components=2)
lsa = svd.fit_transform(bag_of_words)
topic_encoded_df = pd.DataFrame(lsa, columns = ["topic_1", "topic_2"])
topic_encoded_df['sentence'] = body_df.sentence
topic_encoded_df['Is_Wild_Things'] = (body_df.title == "Where the Wild Things Are")
display(topic_encoded_df.iloc[sample_indices])
dictionary = vectorizer.get_feature_names()      # today: get_feature_names_out()
dictionary[:10]   # ['air','away','balloon','bears','bed','best','blinking','boat','bowl','brush']
encoding_matrix = pd.DataFrame(svd.components_,
                               index=['topic_1', 'topic_2']).T
encoding_matrix["terms"] = dictionary
display(encoding_matrix)
encoding_matrix['abs_topic_1'] = np.abs(encoding_matrix['topic_1'])
encoding_matrix['abs_topic_2'] = np.abs(encoding_matrix['topic_2'])
display(encoding_matrix.sort_values('abs_topic_1', ascending=False))
display(encoding_matrix.sort_values('abs_topic_2', ascending=False))
import matplotlib.pyplot as plt
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
ax.axhline(linewidth=0.5)
ax.legend()
display(fig)
```
Equations (author):
- Body: $B = \{(s_d, \tau_d)\}_{d=1}^n$, $\tau_d \in$ {"Goodnight, Moon", "Where the Wild Things Are"}.
- min_df: $\operatorname{df}(t) = |\{d \in B : t \in s_d\}|$, keep t iff $\operatorname{df}(t) \ge \texttt{min\_df}$; with 1 nothing is dropped.
- Vocabulary and matrix: $V = \{t : \operatorname{df}(t)\ge1\} \setminus S_{\text{english}}$, $X_{dt} = \operatorname{count}(t, s_d)$.
- SVD: $X \approx U_2\Sigma_2V_2^\top$, $Z = \texttt{lsa} = U_2\Sigma_2 = XV_2 \in \mathbb{R}^{n\times2}$ (singular values not shown in the clip).
- Label: $y_d = \mathbf{1}[\tau_d = \text{Where the Wild Things Are}]$.
- Cell: $z_{dk} = \sum_{t\in V} X_{dt}V_{tk}$. Verified with the notebook numbers (exact decimal arithmetic, recompute_part3.py): "Goodnight mush" topic_2 = 0.8762536103682735 + 0.11095490860461953 = 0.98720851897289303 (table 0.9872085189728931); topic_1 = 0.000569650111264747 + 0.00022396577999179686 = 0.000793615891256544 (table 0.0007936158912567052); "And goodnight brush" = 0.8762536103682735 + 0.11095491906624494 = 0.98720852943451844 (table 0.9872085294345181; "and" is a stop word); "Goodnight comb" = 0.8762536103682735 + 0.11095489845605254 = 0.98720850882432604 (table 0.9872085088243259). All differences < 4e-16 -> raw counts, no weighting.
- Inference (displayed Eq. 6a): $V_{\text{kittens},2} = z_{\text{kittens},2} - V_{\text{goodnight},2} = 0.9179029856335417 - 0.8762536103682735 = 0.0416493752652682$; $V_{\text{kittens},1} = 0.0005851398845558129 - 0.000569650111264747 = 0.0000154897732910659$; compare $V_{\text{bears}} = (0.000015489091754389534,\ 0.0416493681923887)$.
- Encoding matrix: $V_2 = (\texttt{svd.components\_})^\top$; bears = (0.000015489091754389534, 0.0416493681923887).
- Ranking: $\operatorname{score}_k(t) = |V_{tk}|$.
- Equal loadings: $v_k = X^\top u_k/\sigma_k$, so $x_a = x_b \Rightarrow V_{ak} = V_{bk}$.
- Ratios: goodnight/whispering = 0.8762536/0.1652278 = 5.30; goodnight/moon = 0.8762536/0.1223956 = 7.16.
- Plot: $p_d = (z_{d,1}, z_{d,2})$, red if $y_d$ true else green.
Tables (exact): sample Z: Max line 0.18473294792713676 / 0.06066135483094529 (true); Goodnight kittens 0.0005851398845558129 / 0.9179029856335417; Goodnight mush 0.0007936158912567052 / 0.9872085189728931; And goodnight brush 0.0007936167682018456 / 0.9872085294345181; Goodnight comb 0.0007936179724610988 / 0.9872085088243259. Encoding matrix first rows: air 0.000013343392431393082 / 0.03253910446206377; away 0.000005144016416687748 / 0.000025176831897094; balloon 0.00016962538226906665 / 0.0042792162836415865; bears 0.000015489091754389534 / 0.0416493681923887; bed 0.05831255897296807 / 0.011908273669517458; best 0.055562573201099114 / 0.01102538262041805; blinking 0.003848735441379636 / -0.0004223352104329614; boat 0.008531812042644193 / 0.004920759654721976; bowl 0.00020566053068110706 / 0.07560823900897598. Topic 1 top: terrible 0.6517563509350388 / -0.03581486809806487; wild 0.3832255959929583 / 0.025460783597688195; things 0.3733037054658652 / 0.024518634610963284; gnashed, roars, teeth, roared 0.17417875047437262 / -0.007986919189922477; eyes 0.1555481604345264 / -0.010342850069542936; showed 0.15169942499314676 / -0.009920514859109959. Topic 2 top: goodnight 0.000569650111264747 / 0.8762536103682735; whispering 0.000256348063420261 / 0.16522781313995177; hush, lady, old 0.00025634806342026057 / 0.16522781313995177; moon 0.00004693539918180185 / 0.12239563979700108; brush 0.00022396665693703876 / 0.11095491906624494; mush 0.00022396577999179686 / 0.11095490860461953; comb 0.0002239678611962831 / 0.11095489845605254.
Scatter (author pixel estimates, not data): green at x ~ 0 with y up to ~2.5; red near y ~ 0 with x up to ~4.7; the "noisy" red point ~ (2.4, 0.31).

## Quick Reference
| Item | Value |
|---|---|
| Vectorizer | CountVectorizer(min_df=1, stop_words='english') |
| min_df=1 | default; drops nothing |
| SVD | TruncatedSVD(n_components=2) |
| Topic 1 | Wild Things: terrible 0.6518, wild 0.3832, things 0.3733 |
| Topic 2 | Goodnight Moon: goodnight 0.8763, whispering/hush/lady/old 0.1652 |
| bears | 0.0000155 / 0.0416 |
| Check | Goodnight mush topic_2 = 0.8762536 + 0.1109549 = 0.9872085 |
| Sample | body_df.sample(5) without random_state (not reproducible) |

## Fact Check
10 claims: 8 confirmed (min_df meaning; stop words remove "the"; Spark -> pandas; five samples; bears loadings; topic 1 word list; topic 2 word list, "Co" = comb; scatter description), 1 partly (Runtime for ML library list, current runtime only), 1 outdated (`get_feature_names`).

## Open Questions & Extension Ideas
- Processing note: publish date (2019-04-22) and length (5:41) come from the first worker's grab result; the transcript header has no metadata and they were not re-verified.
- Singular values, corpus size and |V| are not shown; no quantitative separation measure.
- English stop list contains negators (not, no, never, without): harmless for topics, harmful for sentiment pipelines.
- For Thai: segment words first; consider min_df >= 2 for a report corpus; use TF-IDF + L2 before SVD (part 4).

## Tags & Triggers
LSA, CountVectorizer, min_df, stop words, TruncatedSVD, encoding matrix, loading, topic-encoded data, matplotlib, Spark, Goodnight Moon, Where the Wild Things Are. Triggers: "what does min_df=1 do", "how is an LSA topic value computed", "why do several LSA terms have identical loadings", "LSA on two books".

## References
- Source: https://www.youtube.com/watch?v=NWb_4O3ssbA (Databricks Academy, Joshua Cook, 2019-04-22).
- scikit-learn CountVectorizer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
- scikit-learn TruncatedSVD: https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html
- scikit-learn user guide 2.5: https://scikit-learn.org/stable/modules/decomposition.html
- scikit-learn 1.0 release notes: https://scikit-learn.org/stable/whats_new/v1.0.html
- Nothman, Qin, Yurchak (2018): https://aclanthology.org/W18-2502/
- Databricks Runtime 16.4 LTS ML: https://docs.databricks.com/release-notes/runtime/16.4ml.html
- Related reports (same folder): 20190422_Introduction-To-Latent-Semantic-Analysis (part 1), 20190516_Trivial-LSA-With-Scikit-Learn (part 2), 20190422_Improving-LSA-With-TF-IDF-Part-4 (part 4), 20190516_LSA-With-Apache-Spark-Part-5 (part 5), 20200331_Latent-Semantic-Indexing-Explained, 20191117_Latent-Semantic-Analysis-Lsa.
