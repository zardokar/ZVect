# Google Just Released TabFM and It Breaks Everything We Know About ML — AI with Surya - Claude Context
> Source: YouTube, AI with Surya, "Google Just Released TabFM and It Breaks Everything We Know About ML", 7:16, published 2026-07-18 · https://www.youtube.com/watch?v=XwYPRLMLcNs · Generated: 2026-10-13
> Companion: 20260718_TabFM-Ui-Walkthrough-And-Claims.html (Thai, iw mode `iwd`, 7 sections, 5 frames + 1 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license; English ASR transcript).
- Frames used: 01_ui-context, 02_session-result, 03_row-encoder-stage, 04_scaling-simulated, 05_six-lines.
- Own SVG diagrams: flow.
- Transcript SHA-256 (in-page = decoded): `eceae02e7253323a360283b124246daad6167a2badd234aaacf41b20ba1bb319`; kept in the session workspace only.

## TL;DR

A 7-minute explainer (AI with Surya, published 2026-07-18) arguing that TabFM, Google's tabular foundation model, breaks the old ML rule that classification and regression models must be trained on your own data. The speaker (22 years in enterprise tech, by his own account) claims zero-shot TabFM beats heavily tuned gradient boosted trees ("not default XGBoost, tuned XGBoost") with a single forward pass, frozen weights, no training and "no GPU spin-up". He demonstrates a UI he built himself, "Google TabFM Engine": five labeled context rows (age, job, income, risk label), three unlabeled questions, and a three-stage walkthrough: column attention, row compression, ICL transformer. He ends with six lines of code and the line "the floor just came up, the ceiling did not move": data quality, the cost of a wrong prediction and confident errors remain the user's problem. Our checks: the stage structure matches the Google blog and the 1.0.0 model card; the demo UI is illustrative (the scaling curve is badged "Simulated - Illustrative", the 18.4 ms is his sandbox time, and the "cross-attention matrix" rows do not sum to 1, so they are not softmax outputs); the XGBoost claim is not supported by the sources we could read, and the "no GPU spin-up" claim is only partly supported (the README says CPU or GPU, and his demo status bar reads PyTorch CPU, but there is no Google CPU timing).

## Key Concepts

- **Old rule vs the claim.** Old rule (speaker): predictive models are trained by you on your data. Cost: clean data, engineer features, pick a model among several, tune, reset; "3 weeks of a data scientist's life" before the first prediction reaches a business person. TabFM: one forward pass, frozen weights, no training requirement.
- **In-context framing.** Labeled rows are the prompt (context); unlabeled rows are the question. "The same mechanism as an LLM reading a prompt, except the prompt is your spreadsheet."
- **Stage 1, column attention.** Attention runs down a column: every age value attends to every other age value, so the model learns what an income of 80,000 means in this table. UI card: Set Transformer, 3 blocks, 4 heads, 256 induced points, cells embedded with Fourier features (32 frequencies).
- **Stage 2, row compression.** Attention then runs across rows and collapses each row into one vector (a list of numbers representing the whole customer), which keeps it fast because attention runs over rows, not every cell. UI card: Rotary Position Embedding, 3 blocks, 8 heads, 8 CLS tokens, one 256-dim vector per row.
- **Stage 3, ICL transformer.** Takes the compressed rows; labeled rows are context, unlabeled rows receive predictions. UI card: 24-block causal transformer, 8 heads.
- **Two-way attention.** Standard Transformers read one direction; tables are two-dimensional, so TabFM reads down columns and across rows, alternating.
- **Speaker's attention claim.** The cross-attention matrix between questions (rows) and labeled examples (columns) shows how strongly each question attended to each example; "the 30-year-old engineer attended 94% to the 25-year-old engineer"; "that isn't a black box, the attention weights are the explanation". Our check: not valid, see Fact Check.
- **Latency.** 18.4 ms is the speaker's sandbox response time, not a Google benchmark (his own disclaimer).
- **Closing.** Not the end of ML, maybe the end of tuning and feature engineering for a baseline; what remains hard: is your data any good, what does a wrong prediction cost, when is the model confidently wrong.

## Implementation

There is no experiment to reproduce; the demo UI is the speaker's own and its code is not shown. What the video gives:

1. **Six lines (slide, release 1.0.0 API):**
   - `from tabfm import tabfm_v1_0_0`
   - `from tabfm import TabFMClassifier`
   - `model = tabfm_v1_0_0.load()`
   - `clf = TabFMClassifier(model=model)`
   - `clf.fit(X_train, y_train)`
   - `preds = clf.predict(X_test)`
   The ASR heard "annotate your table" for the `fit` step. Author note: the Hugging Face page of release 1.1.0 uses `tabfm_v1_1_0.load(model_type=...)`, so check the release before copying.
2. **Demo data (UI).** risk.csv with five context rows: age 25 engineer income 80,000 low risk; 45 manager 120,000 low; 35 engineer 90,000 low; 50 manager 130,000 low; 23 engineer 58,000 high. Three questions (ages 30, 48, 28). Other tabs: B2B SaaS (leads.csv), healthcare (patients.csv), FinTech (credit.csv).
3. **UI output.** t1 (30) low risk, confidence 67.4%; t2 (48) low risk, 80.5%; t3 (28) high risk, 56.1%. For t3 the UI lists "Top Attention Match: Context Row 1 (94.1%)", which is a low-risk row, yet the prediction is high risk, so the top-attention row alone does not explain the label (author observation). Status bar: PyTorch CPU container, region us-central1, inference latency 18.4 ms.
4. **Architecture text shown in the UI** (matches the model card of google/tabfm-1.0.0-pytorch: embedding dim 256, row attention 3 blocks with 8 heads and 8 CLS tokens, ICL 24 blocks, SwiGLU, feed-forward factor 4): see Key Concepts.
5. **Pitfalls found in the checks.** The scaling-law tab carries the badge "Simulated - Illustrative" (ROC-AUC 0.88 at 116 prompt rows is not a measurement). The first row of the displayed matrix is 0.941, 0.882, 0.914, 0.871, 0.963 (sum 4.571), so it is not a softmax row. Do not quote these numbers as TabFM results.
6. **Parameter size note (author, from the Hugging Face repositories, not in this video):** release 1.0.0 weights are 6.56 GB for the classification model (about 1.64B parameters at fp32); release 1.1.0 is 821 MB (the papers say 400M).

## Quick Reference

| Item | Value | Source |
|---|---|---|
| Speaker | AI with Surya, "22 years in enterprise tech" (self-reported) | video |
| Published / length | 2026-07-18 / 7:16 | metadata |
| Main claim | zero-shot TabFM beats heavily tuned gradient boosted trees (XGBoost tuned, not default) | video |
| Old workflow cost | clean, engineer features, pick, tune, reset; "3 weeks" (metaphor) | video |
| UI | "Google TabFM Engine" built by the speaker; datasets: risk, B2B SaaS, healthcare, FinTech | screen |
| Demo context | 5 labeled rows + 3 questions | screen |
| Demo output | low (67.4%), low (80.5%), high (56.1%) | screen |
| Stages (UI) | column attention (Set Transformer, 3 blocks); row compression (RoPE, 8 CLS tokens, 256-dim); ICL transformer 24 blocks | screen; model card 1.0.0 |
| Latency | 18.4 ms, speaker's sandbox, not Google's | video + screen |
| Scaling curve | "Simulated - Illustrative", ROC-AUC 0.88 at 116 rows | screen |
| Code | six lines, release 1.0.0 API | slide |
| License | code Apache-2.0, weights non-commercial | video description; Hugging Face |

## Comparisons

| | Old ML workflow (as the speaker tells it) | TabFM (as the speaker tells it) |
|---|---|---|
| Data preparation | clean data, engineer features | none, hand it the table |
| Model selection and tuning | pick among several, tune, reset | none, frozen weights |
| Time to first prediction | about 3 weeks (metaphor) | one forward pass (ms in his sandbox) |
| Hardware | model dependent | "no GPU spin-up" (partly: README says CPU or GPU; no CPU timing from Google) |
| Still the user's job | data quality, cost of a wrong prediction, confident errors | same (speaker: no foundation model answers these) |

Author note: the table is arranged from the speaker's statements; the video contains no head-to-head measurement against XGBoost.

## Fact Check

11 claims checked: 3 confirmed, 5 partly confirmed, 1 contradicted, 0 not found, 2 not checked.

- Confirmed: single forward pass, frozen weights, no per-dataset training (blog); the three-stage structure with alternating row/column attention, row compression and an ICL transformer (blog; model card 1.0.0: row attention 3 blocks, 8 heads, 8 CLS tokens; ICL 24 blocks); code Apache-2.0 with non-commercial weights (Hugging Face, GitHub).
- Partly: "most powerful Google has built" (release confirmed, superlative unverifiable); "beats heavily tuned XGBoost" (the blog, as summarised by the fetch tool, says TabFM consistently outperforms heavily tuned supervised algorithms, without naming XGBoost or saying which variant; the paper abstract says zero-shot TabFM beats tuned AutoML pipelines on TabArena); "more context improves ROC" (the UI marks the curve simulated; a real trend is in the companion clip 8vW6gi5vRes where F1 rises from 0.413 to 0.636 between 50 and 500 rows, not monotonic in every metric); the six-line code (release 1.0.0 API, the 1.1.0 page differs); "no GPU spin-up required" (the README says the library runs on CPU or GPU and the speaker's own demo status bar reads "PyTorch CPU Container Ready", but the blog says nothing about hardware and Google gives no CPU timing).
- Contradicted: the displayed cross-attention matrix as "the actual" softmax attention: row one sums to 4.571, a softmax row sums to 1; hence "94% attention" cannot be used as the explanation of a prediction.
- Not checked: the 18.4 ms sandbox latency (disclosed as his own); "3 weeks" of tuning (a metaphor).
- Sources were read through a summarising fetch tool; figures are as relayed.

## Open Questions & Extension Ideas

- Does the UI call the real TabFM weights? The speaker says it calls the model; the simulated badge on one tab and the non-softmax matrix suggest at least parts are mock-ups. The code of the UI would settle it.
- Real attention maps from the 24-block ICL transformer could be extracted (per head, per block) to see which context rows influence a prediction; a single Q·K^T matrix is not enough to explain it.
- Run the same five-row example with the real library and compare against a tuned XGBoost with several seeds, as the video never does.
- CPU latency of the 1.0.x weights (about 1.64B parameters) versus the 18.4 ms shown: worth measuring.

## Tags & Triggers

tags: TabFM, tabular foundation model, zero-shot, in-context learning, column attention, row compression, XGBoost, forward pass, frozen weights, simulated UI, Google Research
- Does TabFM really beat tuned XGBoost?
- Does TabFM need a GPU?
- What do column attention and row compression do?
- Is the attention matrix shown in the video real?
- What does the six-line TabFM code look like?

## References

- Video: https://www.youtube.com/watch?v=XwYPRLMLcNs
- Google Research blog, "Introducing TabFM": https://research.google/blog/introducing-tabfm-a-zero-shot-foundation-model-for-tabular-data/
- arXiv 2609.37959: https://arxiv.org/abs/2609.37959
- GitHub: https://github.com/google-research/tabfm
- Hugging Face 1.0.0: https://huggingface.co/google/tabfm-1.0.0-pytorch
- Hugging Face 1.1.0: https://huggingface.co/google/tabfm-1.1.0-pytorch
- GPT-3 paper (linked in the video description, not read): https://arxiv.org/abs/2005.14165
