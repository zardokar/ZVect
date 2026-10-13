# TabFM Explained: Google's New Foundation Model for Tabular Data — Dr. Data Science - Claude Context
> Source: YouTube, Dr. Data Science, "TabFM Explained: Google's New Foundation Model for Tabular Data", 15:40, published 2026-07-05 · https://www.youtube.com/watch?v=8vW6gi5vRes · Generated: 2026-10-13
> Companion: 20260705_TabFM-Explained-Architecture-And-ICL.html (Thai, iw mode `iwd`, 8 sections, 4 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license; English ASR transcript).
- Frames used: 01_adult-income, 02_arch-part1, 03_arch-part2, 04_blog-full-picture.
- Own SVG diagrams: flow, bars, bars.
- Transcript SHA-256 (in-page = decoded): `1c86fa6a0df4882c420bf4a57d89ca51c62dd1df7cab2e8a26750e3a578ade98`; kept in the session workspace only.

## TL;DR

An explainer (Dr. Data Science, 15:40, published 2026-07-05, a few days after Google's TabFM release on 2026-06-30) of TabFM, a tabular foundation model that predicts labels for new rows by in-context learning (ICL): labeled rows are given as context, model parameters are not updated. The speaker motivates it with the pain of tabular data (mixed types, preprocessing, hyperparameters, class imbalance on the Adult Income dataset), walks through the printed module structure (cell embedder to 256-d vectors, column embedder with attention, RMSNorm, MLP decoder hard-coded to 10 classes), explains ICL, and tests it on Adult Income with only 50 to 500 labeled rows: accuracy 0.780 to 0.837, F1 0.413 to 0.636, runtime 293.65 s to 681.63 s on an A100. His main complaint is compute cost; the main limit is at most 10 classes. Our checks contradict two statements in the video: "Google has not revealed how the labeled training data was made" (blog: synthetic structural-causal-model tables) and ICL comparing demonstrations "with all the pre-training data" (the context is only the rows the user passes). The "about 1.64 billion parameters" figure is correct for the v1.0.x weights (classification file 6.56 GB at 4 bytes per value); the paper and v1.1.0 (821 MB file) are 400M, so a version must always be named.

## Key Concepts

- **Tabular data challenges (speaker).** Heterogeneous types (continuous and categorical; Adult Income has non-numeric occupation and marital status), preprocessing and scaling decisions (drop a column? one-hot?), hyperparameters (max depth, number of trees, learning rate, batch size), class imbalance (about 76% / 24% in Adult Income, as the speaker says).
- **Foundation models for tables.** Speaker: most foundation models target unstructured data because huge unlabeled corpora are easy to collect for pre-training. TabFM instead needs labeled tasks (he says it is not revealed how labels were made; the Google blog says synthetic SCM datasets).
- **Cell embedder.** Separate paths for numerical and categorical cells plus an embedding for labels (`Embedding(10, 256)`), all mapped to 256-d vectors (slide: `Linear(64 -> 256)` for numeric and categorical).
- **Column embedder.** A set-transformer-like module (slide: `SetTransformer` with 3 x `InducedSelfAttentionBlock`, feed-forward 2048 -> 8192 -> 2048). Motivation: permuting column order must not change the answer, so attention across columns and rows is needed. The speaker's understanding: it works out what each cell's embedding represents (occupation, years of education, number of credit cards).
- **Output head.** `RMSNorm`, `y_encoder` (`Linear(10 -> 2048)`), decoder MLP `Linear(2048 -> 4096)` then `Linear(4096 -> 10)`. The class count is hard-coded: at most 10 classes. (The ASR heard "48 ... 496 ... 10"; the slide shows 2048 -> 4096 -> 10.)
- **Blog picture (Google).** Table with training rows, a test row with a missing label, alternating row and column attention, row compression into one row embedding per row, then in-context learning to predict the missing label.
- **ICL vs classic supervised learning.** Classic: a loss function and parameter updates on the labeled new data. ICL: parameters stay fixed, the labeled rows are the context (demonstrations), the model predicts p(y | context, x). Speaker: useful when there are few labeled samples and the model is huge.
- **Experiment.** Adult Income (about 50,000 rows, 14 features, income above 50,000 dollars), but only 50, 100, 200, 500 labeled rows as context, to stress-test; metrics accuracy, precision, recall, F1 because of imbalance. No preprocessing, scaling or tuning.
- **Downside.** Speaker: computational cost (Transformer, large context); 50 samples take about 300 s and 500 about 680 s on an A100 (slide: 293.65 s and 681.63 s).

## Implementation

This is an explainer plus a small experiment; the code is not shown (the speaker offers to make a code walkthrough). What can be reproduced from the video and the checked sources:

1. **Library (author note from the Hugging Face model card / GitHub README, not from the video):** `pip install tabfm[pytorch]`; `TabFMClassifier` / `TabFMRegressor` with `fit`, `predict`, `predict_proba`; default `max_num_features` 500 and `max_num_rows` 100.
2. **Data.** Adult Income (UCI: 48,842 rows, 14 features; target: income above 50,000 dollars).
3. **Protocol (as described).** Draw a small training subset of 50, 100, 200 or 500 rows, `fit`, predict the remaining rows, report accuracy, precision, recall, F1. The video does not state the test-set size, the sampling seed, the number of repeats, or the decision threshold.
4. **Reported results (slide).**

| Training rows | Accuracy | Precision | Recall | F1 | Runtime on A100 (s) |
|---|---|---|---|---|---|
| 50 | 0.780 | 0.576 | 0.322 | 0.413 | 293.65 |
| 100 | 0.804 | 0.608 | 0.525 | 0.564 | 332.59 |
| 200 | 0.816 | 0.652 | 0.508 | 0.571 | 426.84 |
| 500 | 0.837 | 0.686 | 0.593 | 0.636 | 681.63 |

5. **Reading the numbers.** If about 76% of rows are in the majority class (speaker's figure), a majority-class guess already gives accuracy near 0.76, so 0.780 at 50 rows is close to that baseline. Recall at 50 rows is 0.322. The runtime is fit plus predict (TabFM does no gradient training); how many rows were predicted is not stated.
6. **Module printout (slides).** `TabFMClassifier(model=TabFM_HF)`: `cell_embedder` (`in_linear` 64 -> 256, `in_linear_cat` 64 -> 256, `y_embedder_lookup` `Embedding(10, 256)`), `col_embedder` (`tf_col` `SetTransformer`, 3 x `InducedSelfAttentionBlock`, `linear1_gate` 2048 -> 8192, `linear2` 8192 -> 2048), `ln` `RMSNorm`, `y_encoder` `OneHotAndLinear` (10 -> 2048), `decoder` MLP (2048 -> 4096 -> 10).

## Quick Reference

| Item | Value | Source |
|---|---|---|
| Release | Google Research blog, 2026-06-30; video published 2026-07-05 | blog (checked) |
| Parameters | video and slides (v1.0.x): about 1.64 billion, matches the 6.56 GB classification file at fp32; paper and v1.1.0: 400M (classification file 821 MB) | video; Hugging Face 1.0.0 / 1.1.0; arXiv 2609.37959 (checked) |
| Embedding size | 256 | slide; Hugging Face card |
| Max classes | 10 (hard architectural limit) | slide; Hugging Face card |
| Dataset | Adult Income, 14 features, about 50,000 rows (UCI: 48,842), income above 50,000 dollars | video; UCI |
| Class split | about 76% / 24% | video (not on the UCI page) |
| Context sizes tried | 50, 100, 200, 500 | slide |
| Accuracy | 0.780 / 0.804 / 0.816 / 0.837 | slide |
| Precision | 0.576 / 0.608 / 0.652 / 0.686 | slide |
| Recall | 0.322 / 0.525 / 0.508 / 0.593 | slide |
| F1 | 0.413 / 0.564 / 0.571 / 0.636 | slide |
| Runtime (A100) | 293.65 / 332.59 / 426.84 / 681.63 s | slide |
| Normalization | RMSNorm | slide |
| Speaker's limits | compute cost, max 10 classes | video |

## Comparisons

| | Classic pipeline (tree, forest, neural net) | TabFM as described |
|---|---|---|
| Mixed types | choose encoding and scaling | feed the table directly |
| Hyperparameters | set per model | none to tune (ICL) |
| Class imbalance | decide a handling method | not discussed by the speaker; evaluated with precision, recall, F1 |
| Few samples | large models hard to adjust | ICL works with few samples (speaker) |
| Compute | model dependent | speaker's main complaint (293 to 682 s on A100) |

Author note: the video never measures a classic model against TabFM on the same data, so there is no score comparison here.

## Fact Check

13 claims checked: 6 confirmed, 4 partly confirmed, 2 contradicted, 1 not checked.

- Confirmed: TabFM is a Google Research tabular foundation model (blog 2026-06-30); about 1.64 billion parameters for the v1.0.x weights (6.56 GB classification file; the Hugging Face page prints no count, so this is arithmetic); Adult Income has 14 features and about 50,000 rows (UCI 48,842) with a binary income target; embedding size 256; at most 10 classes; alternating row/column attention plus row compression plus ICL (blog).
- Partly: the 76% / 24% split (not on the UCI page); "accuracy above 80% and F1 above 60%" (true only at 500 rows; accuracy also at 100 rows); the runtime numbers match the slide but are fit plus predict, not training; "compute is high because of the Transformer" (the model card says memory grows with the number of context rows, no timing comparison).
- Contradicted: "how the labeled data was made has not been revealed" (the blog describes synthetic structural-causal-model datasets); "the demonstrations are compared with all the pre-training data" (the ICL context is the user's labeled rows only).
- Not checked: "foundation models target unstructured data because unlabeled data is easy to collect" (general opinion).
- Google blog, arXiv, GitHub, Hugging Face and UCI pages were read through a summarising fetch tool; figures are as relayed.

## Open Questions & Extension Ideas

- v1.0.x weights come to about 1.64B parameters (6.56 GB fp32) while v1.1.0 and the paper say 400M (821 MB). What changed between the two (distillation, narrower width, precision)? The v1.1.0 card does not say.
- How many rows were predicted in the timing runs, and how much of the 293 to 682 s is model load time versus inference?
- Replicate with a majority-class baseline, a tuned gradient boosted tree on the same 50 to 500 rows, and several random seeds.
- Does the default of 100 context rows (README) cap the experiment at 500 context rows, or was the limit raised?
- For more than 10 classes, a workaround would have to be designed (the decoder is fixed at 10 outputs).

## Tags & Triggers

tags: TabFM, tabular foundation model, in-context learning, Adult Income, cell embedder, row compression, RMSNorm, accuracy precision recall F1, class imbalance, Google Research
- How does TabFM differ from decision trees and random forests?
- What is in-context learning and how is it different from fine-tuning?
- How many classes does TabFM support?
- How many parameters does TabFM have (depends on the version: 1.64B for v1.0.x, 400M for v1.1.0)?
- Why use F1 on imbalanced data?

## References

- Video: https://www.youtube.com/watch?v=8vW6gi5vRes
- Google Research blog, "Introducing TabFM": https://research.google/blog/introducing-tabfm-a-zero-shot-foundation-model-for-tabular-data/
- arXiv 2609.37959: https://arxiv.org/abs/2609.37959
- Hugging Face: https://huggingface.co/google/tabfm-1.1.0-pytorch
- GitHub: https://github.com/google-research/tabfm
- UCI Adult: https://archive.ics.uci.edu/dataset/2/adult
