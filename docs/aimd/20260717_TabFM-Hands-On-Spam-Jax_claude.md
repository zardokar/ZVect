# TabFM – Tabular Foundation Model for classification (tabfm[jax] / Python) — MASTER 2 SISE DATA SCIENCE (original title in French) - Claude Context
> Source: YouTube, MASTER 2 SISE DATA SCIENCE, "TabFM – Tabular Foundation Model pour le classement (tabfm[jax] / Python)", 18:11, published 2026-07-17 (French) · https://www.youtube.com/watch?v=tYO_bgB4Ti0 · Generated: 2026-10-13
> Companion: 20260717_TabFM-Hands-On-Spam-Jax.html (Thai, iw mode `iwd`, 10 sections, 4 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis translated from French, with fact-check (standard YouTube license; French ASR captions).
- Frames used: 01_blog, 02_arch, 03_elo, 04_f1.
- Own SVG diagrams: flow, bars.
- Transcript SHA-256 (in-page = decoded): `4aedd2be699615ce4da2501f6b5bb45c8de3837394051ff954378eb59c6f662f`; kept in the session workspace only.

## TL;DR
An 18:11 French-language video (own-words summary translated into Thai, standard license; French ASR captions) in which a university data-science lecturer (channel "MASTER 2 SISE DATA SCIENCE") installs and tries Google Research's TabFM on 2026-07-17. He installed the package from GitHub (version 1.0.1; PyPI still had 1.0.0 that day). The PyTorch backend never worked on his machine (a whole day lost, Anaconda reinstalled); the JAX backend worked. Task: spam classification, 100 training rows, 4,501 test rows, CPU only. `fit` took seconds; `predict` took close to 1.5 hours. Reading the screen: TabFM confusion matrix [[2643,78],[303,1477]], F1 0.8858 (accuracy 0.9154, computed here); the TabICL result shown on the left of the screen, [[2635,86],[289,1491]], F1 0.8883. He calls the result comparable to TabICL, not proof (single dataset), and the compute time a real obstacle today. He also relays the authors' benchmark (TabFM above TabICLv2 and TabPFN-3 in the blog's Elo chart) and the not-yet-available TabFM-Ensemble.

## Key Concepts
Times approximate.
- 0:02 Series on foundation models for tabular data; today TabFM and its Python package (Google Research). The reference article is very recent; version 1; update of 9 July 2026; PyPI still at 1.0.0 on 17 July.
- 1:13 He will present such methods to his students after the September restart (classic methods first, then the most recent ones).
- 1:31 Background: he explored TabICL v2 at length (video series); found TabFM through literature reading.
- 2:16 The article says TabFM synthesizes the strengths of two tabular foundation-model approaches: TabICL and TabPFN. He had prepared a TabPFN video but stopped when the package required an online account and token; he will not ask students to register with a personal email.
- 3:26 "How it works" in the article, with diagrams and three mechanisms; recommended reading.
- 4:05 Foundation-model idea (speaker): many synthetic datasets covering the possible X-Y relationships; your own dataset acts as contextualization; "roughly the same idea" as LLM + RAG (speaker's analogy).
- 4:35 Install: PyTorch (version 1.0.1 by cloning GitHub, pip install in a new conda env) never worked; a day spent, Anaconda reinstalled. Switched to JAX (NumPy-like, strong at gradients, JIT compilation), which worked.
- 6:24 Environment lists TabFM 1.0.1 from GitHub; PyPI at 1.0.0.
- 7:01 Dataset: spam (well-known), very few training observations on purpose; reasoning: with plenty of training data classical methods are fine; with scarce data foundation models become interesting (his current view; no comparison with classical methods shown).
- 8:25 Notebook: kernel with TabFM; train 100 rows, test 4,501; X/Y split; model load.
- 9:02 Very recent packages change almost weekly; in the code only 1.0.0 existed for the weights, so JAX 1.0.0 weights were loaded. First load was very slow (done by hand in Python because the notebook showed many messages); a local copy is then used and reloading is much faster.
- 10:51 `fit` is extremely fast because there is no training (contextualization). `predict` is what takes time: attention over rows and columns, compression, embeddings, prediction as a sequence with the item to classify placed in the sequence; a transposition of LLMs to tabular data.
- 11:33 `predict` took hours; after about 1.5 hours he no longer knew whether the problem was him or the tool; interrupted, restarted the machine, converted the notebook to a Python script. About fifty descriptors, 4,501 observations, CPU only: almost 1.5 hours. Not usable yet for a big file; fine for one individual. Optimizations expected given the actors behind it.
- 13:39 Confusion matrix and F1 from a prepared screenshot (he gives the time 15h53).
- 14:15 Comparison: TabICL on the same data gave an F1 he reads as "081 82" (ASR; the screen shows 0.8883). He stresses it is not proof (one dataset). His questions: can it be installed, can it be used, are the results comparable.
- 14:48 Authors' benchmarking section: TabFM seems better than the others, "the researchers' way"; compute time is not emphasized.
- 15:21 TabFM-Ensemble (not available at the time): the dataset goes through a series of transformations (e.g., SVD) and is presented to TabFM several times, results combined; compute time adds up; per the authors it beats TabICLv2 and TabPFN-3 (ASR "tu PF23D"). He never tested TabPFN because of the registration.
- 16:25 Conclusion: much to explore; installable with JAX but not PyTorch (a bug, perhaps fixed the next day); performance on his data of the order of TabICL; compute time is the real caveat (TabICL: minutes; TabFM: 1.5 hours on his CPU-only machine).

## Implementation
Reconstruction of the experiment from the video (no code is shown line by line; steps and observations only):

1. Install TabFM from GitHub (version 1.0.1) in a conda environment with the JAX backend (`tabfm[jax]` in the video title). The PyTorch backend failed on his machine.
2. Load the pre-trained weights from Hugging Face; the first load is slow (134 files fetched according to the screenshot) and creates a local cache; the loaded model folder is `tabfm-1.0.0-jax` (from the screenshot).
3. Load the data: spam dataset, 100 training rows, 4,501 test rows; split features X and target y (binary 0/1).
4. Instantiate the TabFM classifier on the loaded JAX model; `fit(X_train, y_train)` takes seconds (no training; it prepares encoders and stores the context).
5. `predict` on the 4,501 test rows: about 1.5 hours on a CPU-only machine.
6. Evaluate: confusion matrix and F1 for the spam class.

Results read from the screen: TabFM [[2643,78],[303,1477]], F1 0.8857571214392803; TabICL (left window) [[2635,86],[289,1491]], F1 0.8882931188561215. Accuracy computed here: 0.9154 vs 0.9167.

Pitfalls the speaker reports: PyTorch install failure; slow first model load; hours-long `predict` on CPU; package changing almost weekly; versions differ between GitHub and PyPI.

Facts checked by the author of this file (not from the video): GitHub CHANGELOG 1.0.1 = 2026-07-09 (fixes PyTorch checkpoint loading, prediction speed and crashes, attention masking; bfloat16 default for PyTorch); PyPI 1.0.0 = 2026-06-30, 1.0.1 = 2026-07-21; code Apache-2.0, default weights non-commercial; README defaults `max_num_features` 500 and `max_num_rows` 100 (as relayed by a web-reading tool).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Date of the experiment | 2026-07-17 | 0:39 |
| Package | tabfm 1.0.1 from GitHub; PyPI at 1.0.0 | 0:44 |
| Backend | PyTorch failed; JAX worked | 5:04 |
| Dataset | spam e-mails, binary target | 7:01 |
| Training rows | 100 | 8:48 |
| Test rows | 4,501 (about 50 descriptors; description says 55) | 8:21 |
| Hardware | CPU only, no GPU | 12:41 |
| fit | a few seconds | 12:26 |
| predict | almost 1.5 hours | 12:46 |
| Weights loaded | tabfm-1.0.0-jax (screenshot) | 9:24 |
| TabFM result | [[2643,78],[303,1477]], F1 0.8858 (screen) | 14:02 |
| TabICL result | [[2635,86],[289,1491]], F1 0.8883 (screen) | 14:15 |
| Authors' benchmark | Elo chart in the blog (classification: TabFM-Ensemble 1815, TabFM 1727, TabPFN-3 (D) 1639, TabICLv2 (D) 1576) | 14:48 |
| TabFM-Ensemble | transformed datasets (e.g., SVD) fed to TabFM several times, combined; not available then | 15:21 |
| Verdict | comparable accuracy to TabICL on one dataset; compute time is the obstacle | 16:25 |

## Comparisons
TabFM (JAX 1.0.0 weights) vs TabICL on the speaker's spam data (100 train / 4,501 test):

| Metric | TabFM | TabICL |
|---|---|---|
| Confusion matrix [[TN, FP], [FN, TP]] | [[2643,78],[303,1477]] | [[2635,86],[289,1491]] |
| F1 (spam class) | 0.8858 | 0.8883 |
| Accuracy (computed here) | 0.9154 | 0.9167 |
| predict time (speaker) | almost 1.5 h on CPU | "counted in minutes" |

Blog Elo chart, classification (seen on screen): TabFM-Ensemble 1815, TabFM 1727, AutoGluon 1.5 (extreme, 4h) 1666, TabPFN-3 (D) 1639, AutoGluon 1.4 (extreme, 4h) 1623, TabPFN-2.6 (D) 1585, TabICLv2 (D) 1576, RealTabPFN-2.5 (T+E) 1566, RealMLP (T+E) 1469.

## Fact Check
15 claims checked: 10 confirmed, 2 partly, 3 not found, 0 contradicted. Sources: Google Research blog, GitHub README and CHANGELOG, PyPI, TabPFN README (as relayed), arXiv 2602.11139, UCI Spambase, screen contents of the video. Web-reading tools summarize pages, so numbers are as relayed.
- Confirmed: Google Research origin; TabICL + TabPFN lineage; version dates (GitHub 1.0.1 on 2026-07-09 vs PyPI 1.0.0 on 2026-07-17); TabPFN 2.5+ requires login and license acceptance (token); TabICLv2 exists; 100 + 4,501 = 4,601 rows = UCI Spambase (57 features; the description says 55, the speech "about fifty"); F1 values match the confusion matrices (the ASR "081 82" is a mis-hearing of about 0.888); TabFM-Ensemble description (feature crosses, SVD, 32-way, NNLS, Platt); blog Elo chart places TabFM above TabPFN-3 and TabICLv2; JAX and PyTorch backends exist.
- Partly: TabFM-Ensemble not available at the time (the README has no full-ensemble class and the blog describes TabFM-Ensemble as an evaluation setup; consistent, not proof); `fit` in seconds (consistent with the README: it only prepares encoders and scalers; no timing given).
- Not found: JAX properties (NumPy-like, JIT, autodiff) not checked against its documentation here; PyTorch failure on his machine (personal experience; the GitHub changelog says 1.0.1 (9 July) fixed PyTorch checkpoint loading, yet he had installed 1.0.1 and it still failed, so the cause is unknown); `predict` about 1.5 hours (single CPU run; changelog mentions prediction-speed fixes without numbers).

## Open Questions & Extension Ideas
- Re-run on a current release (PyPI 1.0.1 or later, 1.1.0 weights on Hugging Face) and with GPU: how far does the 1.5-hour `predict` drop?
- Measure `predict` time against test size and context size (README default `max_num_rows` is 100); report memory too.
- Repeat on several seeds / datasets with confidence intervals; F1 0.8858 vs 0.8883 is a 0.0025 gap on one split.
- Is TabFM-Ensemble available in code now? Compare the default package against the ensemble on the same data.
- Check the claim "foundation models help most when training data is scarce" by varying the training size (100, 1,000, 10,000) against a tuned gradient-boosting model.

## Tags & Triggers
tags: TabFM, JAX, PyTorch, TabICL, TabPFN, tabular foundation model, spam, confusion matrix, F1, installation
- Is TabFM hard to install, and which backend works?
- How slow is TabFM on a CPU?
- How does TabFM compare with TabICL in practice?
- Is a tabular foundation model worthwhile when the training set is small?

## References
- https://www.youtube.com/watch?v=tYO_bgB4Ti0 (source video, 2026-07-17)
- https://research.google/blog/introducing-tabfm-a-zero-shot-foundation-model-for-tabular-data/ (Google Research blog, 2026-06-30)
- https://github.com/google-research/tabfm (README, CHANGELOG)
- https://pypi.org/project/tabfm/
- https://arxiv.org/abs/2602.11139 (TabICLv2)
- https://github.com/PriorLabs/TabPFN (README, license/login flow)
- https://archive.ics.uci.edu/dataset/94/spambase
