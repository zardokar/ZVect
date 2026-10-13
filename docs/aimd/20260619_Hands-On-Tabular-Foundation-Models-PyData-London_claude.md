# Nicolas Makaroff - AI Scientist - Hands-On with Tabular Foundation Models | Pydata London 26 — PyData - Claude Context
> Source: YouTube, PyData, "Nicolas Makaroff - AI Scientist - Hands-On with Tabular Foundation Models | Pydata London 26", 88:23, published 2026-06-19 · https://www.youtube.com/watch?v=Xym8FGDcl34 · Generated: 2026-10-13
> Companion: 20260619_Hands-On-Tabular-Foundation-Models-PyData-London.html (Thai, iw mode `iwd`, 13 sections, 6 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis with fact-check (standard YouTube license; English ASR captions).
- Frames used: 01_landscape, 02_pillars, 03_honest-map, 04_ci-plot, 05_shap, 06_leaderboard.
- Own SVG diagrams: flow, timeline.
- Transcript SHA-256 (in-page = decoded): `71d6011ad324aaa4b320eae241ef0dab6d04a890ed6d7f80c23d2c0e9bce3521`; kept in the session workspace only.

## TL;DR
An 88:23 English-language workshop (own-words summary translated into Thai, standard license; English ASR captions) from PyData London 2026, published 2026-06-19. Two speakers from the Paris startup Neuralk (ASR spells it "Neural Work") teach generic tabular foundation models (TFMs: TabPFN, TabICL, and their own model Seldon). THIS VIDEO IS NOT ABOUT TabFM: it predates Google's TabFM blog (2026-06-30) by 11 days, and TabFM appears in none of its slides. Content: what a TFM is (a pre-trained transformer that reads labeled training rows plus unlabeled test rows in one forward pass, no gradient training on your data), the speaker's "three pillars" (prior, architecture, context), honest strengths (small to medium tables, no hyperparameter search, probabilities that tend to be calibrated) and limits (big tables only on par with XGBoost, prediction latency, GPU need, data far from the synthetic prior), then four notebooks: first prediction, rigorous benchmarking (several seeds, bootstrap confidence intervals, paired deltas), failure modes, SHAP interpretation. The speakers sell their own model, so win-rate and API-limit claims are vendor claims.

## Key Concepts
Times approximate.
- 0:03 Speakers from a Paris startup; plan: short slides, then notebooks.
- 3:08 Idea (2022, a German team): train a transformer on whole datasets, one dataset per training example; at use time training rows with labels and test rows go in together, the model infers the distribution from the context rather than learning on your data.
- 4:10 Lineage as the speaker tells it: TabPFN v1 (row attention, very limited size), v2 (attention over rows and columns), v3 "a few weeks ago", described as the same architecture family as TabICL (Inria, Paris): compress the table before row attention to cut the most expensive step.
- 6:12 Three pillars: prior (synthetic data from random graphs with node values and transformations; the choice with the largest effect, "more black art than science" on the slide), architecture (attention over rows and columns, bounded by scaling), context (choosing which rows to feed; little explored, dropping rows sometimes helps a lot).
- 9:14 Practical use: scikit-learn wrapper; `fit` does not train, it stages data to be joined with the test rows; the work happens in `predict`.
- 11:46 Strengths: small to medium tables, no hyperparameter search, mixed types, tends to give calibrated probabilities. Limits: large tables only on par with XGBoost, latency, GPU, out-of-prior data. "Not replacing trees."
- 13:47 Q&A: not unsupervised (X and Y given); encoder-like transformer, not decoder; target added as an embedding on the context rows; model sizes in the millions to tens of millions of parameters; one forward pass; pre-training loss is the usual task loss (cross entropy / regression), with some models adding representation losses.
- 21:24 Synthetic vs real pre-training data (a Canadian team trained on real data); trade-off of control vs realism.
- 28:07 Notebook 1: small heart-disease dataset; TFM vs logistic regression; accuracy misleading on imbalanced data; one hyperparameter: number of feature shuffles (order of features matters, order of rows does not).
- 38:51 Notebook 2: rigorous benchmark on heart, shoppers, adult; RandomForest vs XGBoost vs TFM; many seeds/folds, bootstrap CIs, paired deltas; small TFM wins on the two small sets, tuned XGBoost leads on adult (about 40,000 rows).
- 45:30 Embeddings can be extracted from the model (pooling over rows gives a dataset embedding).
- 49:41 Notebook 3: failure modes and latency; large tables where trees still lead; caching of the context pass; no published scaling law for tabular table size.
- 53:23 Q&A: an attendee says on very small data TFMs should be compared with classic Bayesian models; the speaker agrees PFNs are good on small data, does not know how they compare, and agrees the ideas are similar.
- 60:45 Notebook 4: SHAP; TFM and XGBoost agree on the top features (ca, cp, thal, slope) but SHAP magnitudes differ a lot; speaker does not know why. Classes: trained on few, predicts up to about 1,000 (vendor claim).
- 74:06 Fine-tuning: full-weight fine-tuning works better than LoRA in their experience; diffusion/CTGAN augmentation before fine-tuning helped in few-shot cases.
- 79:40 Vendor benchmark (189 datasets, accuracy); context size: clear edge from hundreds to thousands of rows, still an edge up to about 100,000; at millions of rows classic methods usually lead.
- 81:47 Closing Q&A: the speaker asks whether attendees now believe in TFMs; one attendee calls it a step in the right direction but says the difference in SHAP scale should be understood, because interpreting transformer models matters.

## Implementation
There is no code walk-through to reproduce line by line (notebooks run on the vendor API or on open-source TabPFN / TabICL). The workflow the speakers demonstrate:

1. Load a tabular dataset; do a plain train/test split (and later cross-validation).
2. Call the TFM through a scikit-learn-style wrapper: `fit(X_train, y_train)` only stores or sends the training rows; `predict` or `predict_proba` does the work in one forward pass with training and test rows together.
3. Compare against logistic regression, RandomForest and XGBoost. Use ROC-AUC rather than accuracy on imbalanced data.
4. Repeat over several seeds / folds; compute bootstrap 95% confidence intervals; compare models by paired per-fold deltas.
5. Optional: change the number of feature shuffles (a feature-order ensemble), switch model size, extract embeddings, run SHAP.

Pitfalls the speakers state: preprocessing that leaks test information; single-seed results; accuracy on imbalanced data; large tables and latency; data far from the synthetic prior.

Checked by the author of this file (not from the video): TabPFN-3 released about 2026-05 (Prior Labs changelog); TabICLv2 abstract reports scaling to million-row contexts; TabPFN 2.5 and later require login and license acceptance (README, as relayed).

## Quick Reference
| Item | Value (as in the video) | Time |
|---|---|---|
| Speakers | Nicolas (AI Scientist) and Stanislas, Neuralk (Paris) | 0:03 |
| Format | about 90-minute workshop, 4 notebooks | 0:34 |
| TFM idea | proposed 2022 by a German team; whole dataset as one training example | 3:08 |
| Lineage | TabPFN v1 -> v2 -> v3 ("a few weeks ago"); TabICL (Inria) | 4:10 |
| Training data | synthetic (graphs, node values, transformations); slide: about 100M datasets | 6:12 |
| Pillars | prior, architecture, context | 6:12 |
| Model size | millions to tens of millions of parameters (examples 5M, 50M) | 15:49 |
| Good fit | small to medium tables (slide: up to a few thousand rows) | 12:15 |
| Hyperparameter | number of feature shuffles | 36:20 |
| Notebook 1 | heart disease, TFM vs logistic regression | 28:07 |
| Notebook 2 | rigorous benchmark, 3 datasets x RF / XGBoost / TFM | 40:22 |
| Notebook 3 | failure modes | 49:41 |
| Notebook 4 | SHAP and calibration | 61:15 |
| Vendor API limits (claims) | 1M rows (4-5M next week); up to 1,000 classes | 34:48 |
| Vendor benchmark | 189 datasets, accuracy | 79:40 |

## Comparisons
TFM vs gradient boosting as the speakers describe it:

| Aspect | TFM (TabPFN, TabICL, Seldon) | Gradient boosting (XGBoost etc.) |
|---|---|---|
| Small to medium tables | main strength | needs hyperparameter search |
| Hyperparameters | none to tune (only feature shuffles) | trees, depth, etc. |
| Very large tables (millions of rows and up) | on par or trees often ahead, research area (the speaker says an edge remains up to about 100,000 rows) | still strong, sometimes wins |
| Prediction latency | high, GPU, cost at predict | low |
| Probabilities | tend to be calibrated (slide calls it a testable claim) | usually calibrated separately |
| Preprocessing sensitivity | said to be low | type-specific preprocessing |
| Data far from synthetic prior | may fail unpredictably | independent of the prior |
| Interpretation | SHAP works; attention-based row attribution announced | SHAP works |

Author verdict: under a few thousand to ten thousand rows and no wish to tune, try a TFM first; around a million rows or low prediction latency needed, use LightGBM/XGBoost (the speaker's own slide says so for 10M rows); to confirm a TFM really wins, use the notebook-2 protocol (many seeds, CIs, paired deltas).

## Fact Check
19 claims checked: 8 confirmed, 7 partly, 3 not found, 1 contradicted. Sources: Wikipedia TabPFN (as relayed by a web-reading tool), Prior Labs changelog, arXiv abstracts (TabICLv2 2602.11139, TabDPT 2410.18164, TabPFN-TS 2501.02945), TabPFN GitHub README, Google Research TabFM blog, frames of the video. Web-reading tools summarize pages, so numbers are as relayed.
- Confirmed: the video is not about TabFM (published 2026-06-19, blog 2026-06-30); the 2022 German-team origin (TabPFN pre-print 2022, ICLR 2023); TabPFN v2 attention over rows and columns; TabPFN v3 released about May 2026; TabICL from Inria; TabDPT as the Canadian real-data model; the SHAP top-feature agreement (ca, cp, thal, slope in both beeswarm plots); the Seldon name (ASR "cell done").
- Partly: v3 "same architecture as TabICL" (both compress rows before attention, but slides differ); synthetic-only pre-training "so no leakage" (true for the TabPFN family, not for real-data models; no-leakage is a design claim); TabDPT scaling-law claim (real-data power-law improvement confirmed; "none with synthetic" not checked); TabPFN needing a Hugging Face key (README says login and license acceptance for 2.5+); TabPFN-TS vs early Chronos (abstract does not mention Chronos or patch encoding); beating AutoGluon extreme (depends on version: blog Elo AutoGluon 1.5 extreme 1666 above TabPFN-3 (D) 1639 but below TabFM 1727); parameter counts on the landscape slide (v3 about 53M matches; TabPFN-TS paper says 11M for the model it used versus 7M for v2 on the slide).
- Not found: TabPFN v1 sample limit; the roughly 90% win rate (vendor claim; leaderboard frame shows accuracy, not win rate); Neuralk API limits of 1M rows and 1,000 classes (vendor claim; for comparison TabPFN-3 supports 160 classes per the Prior Labs changelog).
- Contradicted: the slide saying open-weights models (TabPFN, TabICL) take about 10,000 context rows, versus the speaker's own landscape slide (TabICL v2 "1M-row ICL"), the TabICLv2 abstract (million rows on a 50 GB GPU) and the Prior Labs changelog (TabPFN-3 up to 1M rows).

## Open Questions & Extension Ideas
- Re-test the "about 90% win rate" on a neutral benchmark (TabArena) with tuned baselines and report confidence intervals.
- Why do SHAP magnitudes differ by an order of magnitude between the TFM and XGBoost? Compare with permutation importance across datasets.
- How does prediction latency scale with context size on one GPU, and how much does context caching save?
- Context selection: does dropping noisy rows reliably help, and can it be automated?
- Where does the crossover with gradient boosting sit (rows, features) once the open-weights context limit is settled?
- How does TabFM (Google, 2026-06-30) fit this landscape: does it share the compress-then-ICL design, and how do its defaults compare to the numbers here?

## Tags & Triggers
tags: tabular foundation model, TFM, TabPFN, TabICL, in-context learning, synthetic prior, benchmark, SHAP, gradient boosting, workshop
- How is a TFM different from XGBoost and from an LLM?
- Why are TFMs pre-trained on synthetic data?
- How do I compare a TFM with trees fairly?
- What are the limits of TFMs (table size, latency, GPU)?
- How do TabPFN, TabICL and TabFM relate?

## References
- https://www.youtube.com/watch?v=Xym8FGDcl34 (source video, PyData London 2026, published 2026-06-19)
- https://en.wikipedia.org/wiki/TabPFN (timeline, as relayed by a web-reading tool)
- https://docs.priorlabs.ai/changelog.md (TabPFN-3, 3.5)
- https://arxiv.org/abs/2602.11139 (TabICLv2)
- https://arxiv.org/abs/2506.16791 (TabArena)
- https://arxiv.org/abs/2410.18164 (TabDPT)
- https://arxiv.org/abs/2501.02945 (TabPFN-TS)
- https://github.com/PriorLabs/TabPFN
- https://research.google/blog/introducing-tabfm-a-zero-shot-foundation-model-for-tabular-data/ (Google Research blog, 2026-06-30)
