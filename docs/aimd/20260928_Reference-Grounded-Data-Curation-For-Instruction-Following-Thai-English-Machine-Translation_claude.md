# Reference-Grounded Data Curation for Instruction-Following Thai-English Machine Translation — Chay-intr, Harnchang, Thabua, Viriyayudhakorn, Theeramunkong (arXiv 2609.34770v2, AACL-IJCNLP 2026) - Claude Context
> Source: arXiv paper 2609.34770v2 (HTML), Chay-intr, Harnchang, Thabua, Viriyayudhakorn, Theeramunkong, "Reference-Grounded Data Curation for Instruction-Following Thai-English Machine Translation", AACL-IJCNLP 2026 Main; v1 2026-09-28, v2 2026-10-05; full text read including appendices A-P · https://arxiv.org/html/2609.34770v2 · Generated: 2026-10-13
> Companion: 20260928_Reference-Grounded-Data-Curation-For-Instruction-Following-Thai-English-Machine-Translation.html (Thai, iw mode `iwd`, 15 sections, 0 frames + 5 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (arXiv non-exclusive distribution license 1.0, not CC); table numbers copied exactly; paper-vs-code comparison is the author's.
- Frames used: none.
- Own SVG diagrams: flow, bars, bars, bars, bars.
- Transcript SHA-256 (in-page = decoded): `bbf198fda5d510f7891d30f27b60984d702b2d3777e28d4b6cf7480c68cdc67b (paper.txt, 92,511 chars, page innerText with LaTeX alttext and tables flattened)`; kept in the session workspace only.

## TL;DR

- **RGDC (Reference-Grounded Data Curation)** builds instruction-following MT training data in two phases: Phase 1 keeps the top decile of an English-Thai parallel pool (17.85M records) by **IFD** (Instruction-Following Difficulty) scored with a briefly freeze-tuned Qwen3.5-4B; Phase 2 uses one auxiliary LLM (Qwen3.5-35B-A3B-FP8, thinking off) to extract constraints that the **reference translation already satisfies**, turn them into yes/no questions, regenerate a translation under 1-3 or all constraints, judge each constraint, and keep only all-pass candidates. Result: **Grounded**, 1,973,358 records (56.5% survival, 3.7 constraints on average).
- **ChindaMT** = full-parameter SFT (1 epoch, no RL/DPO) of Qwen3.5-4B/2B/0.8B (plus Qwen3-4B and a Gemma-3-4B transfer run) on Grounded.
- Primary metric: AlpacaEval-v2 **length-controlled win rate (LC%)** with judge Qwen3.6-35B-A3B-FP8 on two in-house suites (CoreEval, BroadEval; Plain and Constrained splits, 400 items each). ChindaMT-4B vs Typhoon-Translate-1.5-4B: 61.8 Plain / 68.4 Constrained on CoreEval; vs HY-MT-1.5-7B Constrained 97.9. Corroborated by external metrics (FLORES-200, WMT24++), two cross-judges (GPT-OSS-120B, Llama-3.3-70B) and three native Thai raters (64%/69% preference, inter-rater kappa 0.73, human-vs-judge kappa 0.41).
- Ablations at 4B: training with the Rules block matters most (+12.63 Plain / +9.53 Constrained LC over no-rules); IFD selection helps only in-domain Plain (+8.24); the all-pass filter is small (+1.09/+1.06).
- License: arXiv non-exclusive distribution 1.0 (this file is an own-words analysis). Released artefacts: weights + code Apache-2.0; Grounded + eval suites CC-BY-SA 4.0.

## Key Concepts

- **IF-MT (instruction-following machine translation):** translation requests carrying prompt-level rules (terminology, format, register, length). The paper's premise: translation-specialised fine-tuning erodes rule following; instruction-tuned LLMs follow rules but translate worse.
- **IFD score (Li et al. 2024b, "Cherry LLM"):** `IFD = l(y | I, x) / l(y)`, `l` = mean token-level cross-entropy of the target `y`, with instruction `I` and source `x` vs without them. IFD < 1: the instruction helps predict the answer. IFD >= 1: discarded. Highest remaining IFD = "hardest-but-learnable".
- **Pre-experience scorer:** the base model is briefly freeze-tuned on a small, diverse, mid-perplexity sample so its losses reflect the domain before it scores the full pool.
- **Reference grounding:** constraints are extracted from the reference target, so each constraint is feasible by construction (the opposite of AutoIF/UltraIF, which synthesise constraints and then discard infeasible ones). The 2E filter is then "residual generation hygiene", not feasibility enforcement.
- **Five constraint categories:** Content, Numerical, Stylistic, Format, Linguistic (Table 1).
- **Two regeneration variants:** `sampled` (1-3 random constraints) and `all` (every extracted constraint).
- **All-pass filter:** a candidate survives only if every yes/no question is judged YES.
- **Training target = regenerated translation** (auxiliary LLM output), not the human/corpus reference. Audited only with reference-free CometKiwi.
- **Plain / Plain (own) / Constrained:** Plain = shared scaffold, translation only; Plain (own) = each baseline uses its model-card template; Constrained = shared scaffold plus a Rules block of 1-4 rules (no adapter, because the authors state no baseline exposes a Rules: slot).
- **LC% (AlpacaEval-v2):** a logistic GLM of judge preference on a standardised length difference and item difficulty, evaluated at zero length difference; reported per comparison at N = 400; per-direction cells are separate fits, so the Mean is not the average of the two directions.
- **Validation channels:** primary LC%, external metrics (CometKiwi, GEMBA-DA, GEMBA-MQM, MetricX-24), three-judge cross-judging, human raters. The authors claim all four agree on direction.

## Implementation

Local code root (owner's copy, Apache-2.0): `ChindaMT/ChindaMT-RGDC/` (see `.dropzone/ChindaMT/INDEX.md`). Paper run config: `config/rgdc_qwen35.yaml`; driver: `scripts/run_all.sh <config>` (runs 1A, 1C, Phase 2; 1B is run by hand in LLaMA-Factory between 1A and 1C).

### 0. Build the pool (paper Sec. 4.1, App. C; code `src/data/`)

1. Ten public English-Thai corpora: bible, paracrawl, elrc, hplt, en-th-texts, opensubtitles, scb_2020, tatoeba, wikimedia, xlent (Table 9). Each used in both directions. Unified into Alpaca `(instruction, input, output)`: about 17.85M records (code docs: 8,927,368 per direction x 2 = 17,854,736).
2. Hold out the evaluation items (CoreEval is sampled from this pool) before both phases.
3. Code: `src/data/prepare_corpus.py` (two-column CSV/TSV -> minimal ShareGPT per direction), then `src/data/generate_mid_zero_shot.py` (instruction diversification: 7 openers x 9 input formats x 8 output cues, seed 42; system message "You are a professional English-Thai translator." or the mirror). **The paper does not describe this template diversification.**

### 1. Phase 1 - cherry selection (paper Sec. 3.2, 4.5; code `src/cherry/`)

1A. Pre-experience sampling (per corpus x direction; code loops per pool file):
- Embed each sample with the base model (Qwen3.5-4B; mean-pooled last hidden state) and compute per-sample perplexity (`src/cherry/data_analysis.py --mod pre`).
- K-means with 100 clusters; from each cluster take 10 samples evenly spaced inside the 25th-75th perplexity percentile band (`src/cherry/data_by_cluster.py`, `sample_middle_confidence_data`). Code subsamples at most 20,000 records per file first (`max_samples_per_corpus 20000`, seed 42).
- Paper total: **40,683** samples (concatenated by `src/cherry/concat_dataset.py`, suffix `_pre_1k.json`).

1B. Pre-experienced scorer (LLaMA-Factory, `config/training/phase1b_pre_experience_qwen35_4b.yaml`):
- Freeze-tune Qwen3.5-4B for 1 epoch, top 4 transformer blocks trainable (`freeze_trainable_layers 4`, vision tower and projector frozen).
- Paper: FP32, AdamW lr 2e-5, inverse-square-root schedule, 1% warmup, effective batch 64. Code: per-device 4 x grad-accum 16 on one GPU (= 64), `bf16: true` with trainable layers kept in float32 (comment in the YAML), weight decay 0.0, cutoff 1024, packing true, val_size 0.003.

1C. IFD scoring and selection (`scripts/02_cherry_selection.sh`, `src/cherry/data_analysis.py --mod cherry`, `src/cherry/data_by_IFD.py`):
- For each record compute the mean token loss on the output span twice: `loss_1` with only `"### Response:" + output` (code's approximation of `l(y)`), `loss_2` with the full Alpaca prompt `"Below is an instruction ... ### Instruction:\n{instruction}\n\n### Response:" + output`.
- `IFD = mean(loss_2) / mean(loss_1)`.
- Drop IFD at or above 1 (paper) / **above 1 only** (code: `if mean_rate > 1: continue`; test A11 keeps exactly 1.0). Skip degenerate or overlong records.
- Keep the top 10% of survivors by IFD (highest ratios): `sorted(...)[-n:]`, `n = int(len * 0.10)`. Settings: `batch_size 128`, `max_length 1024`, `prompt alpaca`.
- Output: **1,751,962** records. (Derived: about 17.5M survivors before the decile cut, i.e. about 1.9% of the pool dropped as IFD > 1 or skipped.)

### 2. Phase 2 - constraint augmentation (paper Sec. 3.3, App. B, Table 12; code `src/augment/`, `scripts/03_constraint_augmentation.sh <cfg> [1|1b|2|2b|3|4|5|6|7|8|status|all]`)

One auxiliary LLM for all LLM steps: **Qwen3.5-35B-A3B-FP8**, `enable_thinking=false`, served by vLLM (code: OpenAI-compatible endpoint, `max_concurrent 28`, `batch_size 16`, `delay 0.1`, `max_retries 5`, resumable caller `call_endpoint.py`).

| Sub-step | Temp. | Max tokens | Code |
|---|---|---|---|
| 2A constraint extraction | 0.7 | 1024 | `generate_constraint.py` (steps 1/1b) |
| 2B evaluation questions | 0 | 512 | `generate_eval_ques.py` (steps 2/2b) |
| 2C constrained responses | 0.7 | 512 | `pack_augmented_prompts.py` (3) + `call_endpoint.py` (4) |
| 2D judge evaluation | 0 | 1024 | `pack_evaluation_prompts.py` (5/6) |
| 2E all-pass filter + rule embedding | - | - | `merge_final_dataset.py --filter-mode all_pass` (7), `add_constraints_to_instruction.py` (8) |

2A. Input: "Simplified Query" (instruction + input) and "Answer" (the reference translation). The prompt defines a constraint as the smallest unit of restriction, asks for NEW constraints that are relevant, verifiable in the response and not already stated in the query, grouped into the five types (Content: specific terms/symbols, required elements, thematic directives; Numerical: counts of points/sentences/paragraphs/words/examples; Stylistic: tone, terminology preferences; Format: structure, programming language, presentation; Linguistic: language, sentence structure, word-level). Output JSON `{"Content Constraints": [{"constraint": "..."}], "Numerical Constraints": [...], ...}`. Five in-context examples, none about translation (JS cancel-button, quantum computing, Java string replace, Python HTTP GET, Chinese literature book list). Exact text: `src/augment/generate_constraint.py`. Paper Table 1 examples (the only translation-domain examples the paper gives for 2A): Content "include the term 'clean energy'"; Numerical "use exactly one sentence"; Stylistic "use formal Thai without slang"; Format "return only the translation, no quotes"; Linguistic "avoid English contractions".

2B. All constraints of a record in one call; one yes/no question per constraint; return an empty string for meaningless or descriptive constraints (drops them from the filter). Output JSON `{"1": "question", "2": "question"}`.

2C. Two variants per cherry record: `-sampled` (random 1-3 constraints; config `min_sample_constraints 1`, `max_sample_constraints 3`, seed 42) and `-all` (every constraint). User message = `{original instruction}\n\nRules:\n1. {c1}\n2. {c2}\n\n{original input}`. System prompt (verbatim in `pack_augmented_prompts.py`): be an expert answering the query, respond clearly and concisely without introductory phrases, strictly follow the inside constraints. The regenerating LLM sees the constraints, **not** the reference. `top_p 1.0` (code).

2D. For each candidate, the judge answers every question with an explanation then a `"YES"`/`"NO"` score, JSON keyed `"Question n"`. Explanation-before-verdict is the paper's stated noise reduction (a single NO drops the record).

2E. Keep a candidate only if every question is YES. Append the retained constraints to the training instruction as `\n\nRules:\n- rule\n- rule` (bullets, not numbers); `input` stays empty; `output` = regenerated translation; system prompt not kept. Code writes `augmented_sft_dataset.jsonl` (with metadata), `augmented_sft_dataset_with_rules.jsonl` (training triples, registered as `rgdc_output`), `*_failed.jsonl`.

Counts (Table 2): 2A 1,751,962 -> 2B 1,747,959 -> 2C 3,495,704 (= 2 x 1,747,852; derived: 107 records lost between 2B and 2C, 4,003 between 2A and 2B) -> 2E **1,973,358** (56.5%). Mean 3.7 constraints per retained record. Category mix of retained constraints: content + linguistic + stylistic 77%, format + numerical 23%.

Example Grounded record (App. D, Alpaca fields): instruction = `Task: Translate Thai -> English.` / `Source:` / Thai text (a customer-service sentence about dispatch in 35 minutes) / `### Response:` / blank / `Rules:` with three bullets (customer-service professional style; exactly one sentence; include the number 35); input = ""; output = one English sentence containing 35. Note the Rules block sits **after** the output cue.

Quality audit of regenerated targets (Table 10, CometKiwi, 5,000 per direction x variant):

| Slice | n | Delta CK (regen - ref) | SE | regen >= ref |
|---|---|---|---|---|
| Overall | 20,000 | +13.10 | 0.09 | 85.9% |
| en->th | 10,000 | +16.03 | 0.13 | 90.9% |
| th->en | 10,000 | +10.18 | 0.13 | 80.8% |

Authors' caveat: reference-free QE can favour fluent output; they read this only as "no quality regression".

### 3. Fine-tuning (paper Sec. 4.5, App. G Table 13; code `config/training/`)

| Parameter | Value |
|---|---|
| Method | full-parameter SFT, no preference optimisation, no RL |
| Data | Grounded (LLaMA-Factory dataset `chindamt_grounded`, Alpaca columns) |
| Epochs | 1 |
| LR / schedule | 2e-5, inverse-square-root, 1% warmup |
| Weight decay | 0.01 |
| Optimizer | AdamW (beta1 0.9, beta2 0.999) (`adamw_torch`) |
| Effective batch | 64 on 2 GPUs: 4x8 (4B, Qwen3-4B), 8x4 (2B), 16x2 (0.8B) |
| Cutoff | 1024 tokens, token packing (`neat_packing false`) |
| NEFTune | alpha 2 |
| Seed | 42 |
| Infra | LLaMA-Factory, DeepSpeed ZeRO-2 (`ds_z2_config.json`), H100 |
| Code-only facts | `train_on_prompt false` (loss on output only), `enable_thinking false`, template `qwen3_5`, gradient checkpointing, `val_size 0.001`, eval/save every 2000 steps; launched from llamaboard configs `config/training/llamaboard/chindamt_{4b,2b,0.8b}.yaml` (model name "Qwen3.5-4B-Thinking"; LoRA/freeze fields inert for `finetuning_type: full`) |

Compute: about 68 h on 2x H100 for the four variants (about 25 h 4B, 10 h 2B, 8 h 0.8B), Gemma-3-4B about 7 h; Phase 1 about 2.5 days on one H100 (mostly IFD scoring); Phase 2 about two weeks of active generation on the 35B-A3B FP8 vLLM endpoint. Single run per model; tokens per epoch not reported.

Cross-family run: Gemma-3-4B fine-tuned on the same Grounded with only base and chat template changed (code patch `patches/llamafactory.patch` adds zero `token_type_ids` for Gemma-3 text-only batches; use `template: gemma`).

### 4. Inference (App. G)

- ChindaMT and Qwen bases: temperature 0.01 (sampling on), top-p 0.7, top-k 20, repetition penalty 1.05, max 1024 new tokens, batched HF inference on one H100. Code/README: `enable_thinking=False`, stop `<|im_end|>` (`src/eval/model_registry.py`).
- Prompt (App. E / model card): Plain = `Translate English to Thai.\n\nEN: <source>` (th->en: `Translate Thai to English.` and `TH:`); Constrained = `Translate English to Thai.\nRules:\n- ...\n- ...\n\nEN: <source>`. This exact layout is not among the training templates in `generate_mid_zero_shot.py`.
- Baselines: GemmaX2 and Typhoon-Translate temp 0.2, top-p 0.9; HY-MT-1.5 temp 0.7, top-p 0.6; MiLMMT-46 greedy; TranslateGemma up to 512 new tokens.

### 5. Evaluation (paper Sec. 4.3, 4.6, App. E, H, I, K; code `src/eval/`, `scripts/04_evaluate.sh`, `config/evaluation/`)

- Suites: CoreEval (5 domains: government, finance, tech, UI, miscellaneous; sampled from the pool, length-stratified following Typhoon 2) and BroadEval (10 broader domains, e.g. news, literary, social; about 25% paragraph-length inputs). Each: Plain 400 + Constrained 400 (200 en->th, 200 th->en). Constrained = 1-4 rules from the five categories. Released files carry sources and model outputs, no references.
- Judge: Qwen3.6-35B-A3B-FP8, temperature 0, thinking off, max_tokens 1024, AlpacaEval-v2 `ranking_parser`. Rubric (`config/evaluation/judge_prompt.txt`): (A) accuracy and faithfulness (highest priority), (B) instruction compliance and format preservation ("equally critical"), (C) naturalness and fluency only after A and B; HARD PENALTY for any non-translation content; tie-breakers: fewer violations, then accuracy, then fluency; output a Python list of `{'model', 'rank'}`.
- Metrics:
  - `WR% = (w + 0.5*d) / N * 100` (ties as half wins).
  - LC% (paper's notation): `P(target wins | item) = sigmoid(alpha * tanh(dl) + beta * d + gamma)`, `LC% = 100 * E[P(target wins | dl = 0)]`; `dl` standardised length difference, `d` item difficulty. (The actual AlpacaEval GLM also has a model term; see Fact Check.) SE from AlpacaEval-v2 over per-item votes; cross-judge and external win rates use a 1000-draw bootstrap. Per-direction cells are separate fits.
  - External (App. I, K): CometKiwi `Unbabel/wmt22-cometkiwi-da` (reference-free, 0-100; code `compute_cometkiwi.py`, separate conda env because `unbabel-comet 2.2.7` needs `transformers<5`); GEMBA-DA (judge returns an integer 0-100 from source, reference, candidate; bands 0-30 / 30-60 / 60-80 / 80-100; code `compute_gemba.py`); GEMBA-MQM (zero-shot, categories Accuracy, Fluency, Terminology, Style, Locale, Other; severities Minor/Major/Critical; score = 100 - (1 x minor + 5 x major + 10 x critical), floor 0, `NO_ERRORS` = 100; one format-reminder retry on parse failure); MetricX-24 (`google/metricx-24-hybrid-large-v2p6-bfloat16`, reference-based, native error 0-25, lower better, excluded from the Quality Mean; code `compute_metricx.py`). Quality Mean = unweighted average of CK, DA, MQM over both directions (six values).
- Cross-judge (`src/eval/cross_judge.py`): GPT-OSS-120B and Llama-3.3-70B-Instruct re-judge every cached pair with the same rubric (code: as one user message, output order flipped per pair with seed 42, format reminder then prose parsing for unparseable replies; GPT-OSS low reasoning effort, 1536 tokens), Cohen's kappa, win rate with ties = 0.5, bootstrap SE.
- Human (App. M): three native Thai raters (one with translation background), each 100 stratified items (50 Plain with the baseline template, 50 Constrained with the shared template) from ChindaMT-4B vs Typhoon-Translate-1.5-4B, A/B blinded, ratings +2..-2 toward ChindaMT, two attention checks per rater excluded; win rate by sign with ties as half wins.

### 6. Reported results (exact numbers)

Table 3 - LC% (ChindaMT vs comparator; > 50 favours ChindaMT). Columns: Plain (shared) en->th / th->en / Mean | Plain (own) en->th / th->en / Mean | Constrained en->th / th->en / Mean. "-" = omitted (comparator returns almost no target-language output under the shared prompt).

| Suite | Model | Comparator | Plain shared | Plain own | Constrained |
|---|---|---|---|---|---|
| CoreEval | ChindaMT-4B | MiLMMT-46-4B | 88.8 / 83.7 / 86.3 | 62.8 / 42.1 / 53.3 | 89.9 / 88.7 / 89.5 |
| CoreEval | ChindaMT-4B | TranslateGemma-4B | 88.7 / 75.1 / 81.0 | 80.1 / 54.5 / 66.7 | 86.4 / 91.0 / 87.2 |
| CoreEval | ChindaMT-4B | Typhoon-Translate-4B | 64.9 / 58.5 / 61.8 | 62.1 / 53.4 / 57.8 | 67.4 / 71.0 / 68.4 |
| CoreEval | ChindaMT-4B | HY-MT-1.5-7B | 68.2 / 83.0 / 74.0 | 68.2 / 59.3 / 62.9 | 96.6 / 99.5 / 97.9 |
| CoreEval | ChindaMT-4B | GemmaX2-28-9B | 94.7 / 92.8 / 93.6 | 66.2 / 45.0 / 56.6 | 94.4 / 93.5 / 94.1 |
| CoreEval | ChindaMT-2B | MiLMMT-46-1B | 88.5 / 88.7 / 88.4 | 62.9 / 47.5 / 54.6 | 93.0 / 94.3 / 93.7 |
| CoreEval | ChindaMT-2B | HY-MT-1.5-1.8B | 73.9 / 79.5 / 75.2 | 78.3 / 70.9 / 72.6 | 82.7 / 80.7 / 78.6 |
| CoreEval | ChindaMT-2B | GemmaX2-28-2B | 92.9 / 87.3 / 90.2 | 70.4 / 38.9 / 55.6 | 87.5 / 88.6 / 89.9 |
| CoreEval | ChindaMT-0.8B | MiLMMT-46-1B | 85.9 / 81.3 / 83.4 | 55.6 / 47.9 / 50.9 | 93.5 / 87.3 / 90.3 |
| CoreEval | ChindaMT-0.8B | HY-MT-1.5-1.8B | 62.9 / 69.7 / 64.6 | 67.7 / 63.5 / 63.4 | 74.1 / 68.8 / 67.8 |
| CoreEval | ChindaMT-0.8B | GemmaX2-28-2B | 92.2 / 82.3 / 87.5 | 62.0 / 39.4 / 51.2 | 89.2 / 82.1 / 86.5 |
| BroadEval | ChindaMT-4B | MiLMMT-46-4B | - | 49.0 / 62.1 / 56.2 | - |
| BroadEval | ChindaMT-4B | TranslateGemma-4B | 80.4 / 83.7 / 81.8 | 72.5 / 62.5 / 67.0 | 74.6 / 80.3 / 76.1 |
| BroadEval | ChindaMT-4B | Typhoon-Translate-4B | 60.0 / 56.6 / 58.7 | 53.3 / 49.8 / 53.1 | 63.4 / 63.1 / 63.2 |
| BroadEval | ChindaMT-4B | HY-MT-1.5-7B | 51.3 / 87.8 / 70.1 | 57.5 / 68.5 / 62.0 | 96.7 / 99.7 / 98.2 |
| BroadEval | ChindaMT-4B | GemmaX2-28-9B | - | 66.8 / 66.0 / 67.4 | - |
| BroadEval | ChindaMT-2B | MiLMMT-46-1B | 91.8 / 97.4 / 94.7 | 70.3 / 66.5 / 68.7 | - |
| BroadEval | ChindaMT-2B | HY-MT-1.5-1.8B | 53.4 / 90.1 / 70.8 | 72.6 / 83.0 / 76.2 | 73.5 / 88.3 / 78.6 |
| BroadEval | ChindaMT-2B | GemmaX2-28-2B | - | 67.3 / 63.9 / 66.3 | - |
| BroadEval | ChindaMT-0.8B | MiLMMT-46-1B | 89.0 / 95.9 / 92.6 | 46.1 / 53.9 / 50.2 | - |
| BroadEval | ChindaMT-0.8B | HY-MT-1.5-1.8B | 34.8 / 76.1 / 54.4 | 47.8 / 67.7 / 56.5 | 57.7 / 74.0 / 61.9 |
| BroadEval | ChindaMT-0.8B | GemmaX2-28-2B | - | 44.8 / 51.2 / 49.4 | - |

Table 4 - external metrics. Columns: CK en->th / th->en, DA en->th / th->en, MQM en->th / th->en, Quality Mean (up), MetricX en->th / th->en / Mean (down).

| Bench | Tier | Model | CK | DA | MQM | QMean | MtX |
|---|---|---|---|---|---|---|---|
| FLORES-200 | 4B-9B | MiLMMT-46-4B | 83.88 / 84.98 | 87.94 / 91.90 | 97.01 / 98.23 | 90.7 | 2.14 / 1.97 / 2.06 |
| FLORES-200 | 4B-9B | TranslateGemma-4B | 82.76 / 84.01 | 82.44 / 87.62 | 95.24 / 97.52 | 88.3 | 2.45 / 2.11 / 2.28 |
| FLORES-200 | 4B-9B | Typhoon-Translate-4B | 83.62 / 83.97 | 87.52 / 87.79 | 97.23 / 97.74 | 89.6 | 2.14 / 2.26 / 2.20 |
| FLORES-200 | 4B-9B | HY-MT-1.5-7B | 84.38 / 84.61 | 88.71 / 89.48 | 97.63 / 97.97 | 90.5 | 1.98 / 1.98 / 1.98 |
| FLORES-200 | 4B-9B | GemmaX2-28-9B | 82.43 / 84.45 | 85.20 / 91.91 | 96.94 / 98.34 | 89.9 | 2.45 / 2.07 / 2.26 |
| FLORES-200 | 4B-9B | ChindaMT-4B | 83.80 / 84.55 | 89.32 / 90.33 | 97.53 / 98.39 | 90.7 | 2.13 / 1.98 / 2.06 |
| FLORES-200 | 0.8B-2B | MiLMMT-46-1B | 82.56 / 84.41 | 75.93 / 84.79 | 94.06 / 96.69 | 86.4 | 2.57 / 2.28 / 2.43 |
| FLORES-200 | 0.8B-2B | HY-MT-1.5-1.8B | 83.03 / 83.65 | 79.39 / 82.64 | 95.95 / 96.41 | 86.8 | 2.22 / 2.25 / 2.24 |
| FLORES-200 | 0.8B-2B | GemmaX2-28-2B | 81.80 / 84.25 | 79.78 / 88.06 | 95.54 / 97.75 | 87.9 | 2.66 / 2.23 / 2.45 |
| FLORES-200 | 0.8B-2B | ChindaMT-0.8B | 82.51 / 83.41 | 78.71 / 79.54 | 95.27 / 95.66 | 85.9 | 2.50 / 2.55 / 2.53 |
| FLORES-200 | 0.8B-2B | ChindaMT-2B | 83.40 / 84.08 | 85.76 / 86.24 | 96.86 / 97.25 | 88.9 | 2.25 / 2.23 / 2.24 |
| WMT24++ | 4B-9B | MiLMMT-46-4B | 80.30 / 82.15 | 84.39 / 89.21 | 94.74 / 96.68 | 87.9 | 3.14 / 3.08 / 3.11 |
| WMT24++ | 4B-9B | TranslateGemma-4B | 78.55 / 80.51 | 77.21 / 84.31 | 93.14 / 95.92 | 84.9 | 3.37 / 3.28 / 3.33 |
| WMT24++ | 4B-9B | Typhoon-Translate-4B | 79.46 / 80.62 | 81.82 / 85.21 | 95.39 / 97.40 | 86.6 | 3.29 / 3.44 / 3.37 |
| WMT24++ | 4B-9B | HY-MT-1.5-7B | 81.15 / 81.90 | 87.19 / 91.21 | 96.67 / 98.08 | 89.4 | 2.62 / 2.80 / 2.71 |
| WMT24++ | 4B-9B | GemmaX2-28-9B | 77.64 / 81.10 | 75.72 / 89.21 | 94.39 / 97.65 | 86.0 | 3.95 / 3.32 / 3.64 |
| WMT24++ | 4B-9B | ChindaMT-4B | 80.23 / 81.21 | 83.85 / 87.60 | 96.63 / 97.36 | 87.8 | 3.21 / 3.19 / 3.20 |
| WMT24++ | 0.8B-2B | MiLMMT-46-1B | 77.84 / 81.17 | 69.44 / 82.80 | 92.18 / 95.36 | 83.1 | 3.69 / 3.42 / 3.56 |
| WMT24++ | 0.8B-2B | HY-MT-1.5-1.8B | 79.58 / 80.93 | 77.44 / 83.94 | 94.86 / 96.16 | 85.5 | 2.93 / 3.08 / 3.01 |
| WMT24++ | 0.8B-2B | GemmaX2-28-2B | 77.06 / 80.81 | 70.77 / 84.99 | 93.14 / 96.38 | 83.9 | 4.07 / 3.53 / 3.80 |
| WMT24++ | 0.8B-2B | ChindaMT-0.8B | 77.80 / 79.58 | 69.65 / 74.28 | 92.05 / 94.14 | 81.2 | 3.74 / 3.71 / 3.73 |
| WMT24++ | 0.8B-2B | ChindaMT-2B | 79.57 / 80.58 | 79.48 / 82.25 | 95.02 / 96.12 | 85.5 | 3.30 / 3.39 / 3.35 |

Table 15 - per-direction raw WR% (CoreEval shared prompt; external = same pairwise protocol, plain only; "-" = not run; external bootstrap SE [1.3, 1.6]). Columns: CoreEval Plain en->th / th->en, Constrained en->th / th->en, FLORES en->th / th->en, WMT24++ en->th / th->en.

| Model | Comparator | CoreEval Plain | CoreEval Constr. | FLORES | WMT24++ |
|---|---|---|---|---|---|
| 4B | MiLMMT-46-4B | 88.8 / 84.5 | 90.5 / 90.0 | 55.3 / 52.5 | 51.4 / 39.9 |
| 4B | TranslateGemma-4B | 86.8 / 72.5 | 83.8 / 87.5 | 73.9 / 64.7 | 71.9 / 53.3 |
| 4B | Typhoon-Translate-4B | 65.0 / 59.3 | 66.0 / 69.8 | 55.4 / 60.9 | 55.1 / 49.5 |
| 4B | HY-MT-1.5-7B | 65.5 / 78.5 | 94.5 / 98.5 | 61.0 / 60.8 | 48.3 / 38.9 |
| 4B | GemmaX2-28-9B | 95.0 / 92.5 | 95.5 / 94.8 | 67.5 / 58.2 | 68.0 / 44.8 |
| 2B | MiLMMT-46-1B | 88.5 / 87.0 | 92.5 / 93.5 | - | - |
| 2B | HY-MT-1.5-1.8B | 72.3 / 75.0 | 80.0 / 74.3 | 73.8 / 76.5 | 64.7 / 53.1 |
| 2B | GemmaX2-28-2B | 93.5 / 89.3 | 93.5 / 91.3 | 67.9 / 54.7 | 67.8 / 47.1 |
| 0.8B | MiLMMT-46-1B | 86.0 / 79.5 | 93.0 / 86.0 | - | - |
| 0.8B | HY-MT-1.5-1.8B | 62.5 / 64.5 | 72.0 / 62.0 | 57.0 / 59.7 | 45.1 / 38.0 |
| 0.8B | GemmaX2-28-2B | 93.0 / 85.0 | 93.5 / 86.0 | 50.3 / 38.0 | 49.4 / 31.8 |

Table 5 / 17 - cross-judge WR% (CoreEval, mean of the three judges; Plain = own template): 4B vs MM-46-4B 51.0 / 89.6; TG-4B 63.3 / 85.1; Typhoon-4B 56.1 / 65.5; HY-MT-7B 57.2 / 95.3; GemmaX2-9B 56.4 / 93.7; 2B vs MM-46-1B 54.1 / 91.3; HY-MT-1.8B 62.1 / 73.4; GemmaX2-2B 56.0 / 91.9; 0.8B vs MM-46-1B 51.7 / 88.2; HY-MT-1.8B 57.0 / 65.1; GemmaX2-2B 53.0 / 90.1. Per-judge (Pri / OSS / Llama), selected: CoreEval 4B vs MM-46-4B Plain own 55.1 / 47.1 / 50.9; vs Typhoon Plain shared 62.1 / 55.0 / 54.1, Constrained 67.9 / 66.1 / 62.6; vs HY-MT-7B Constrained 96.5 / 94.8 / 94.8; BroadEval 0.8B vs MM-46-1B Plain own 52.4 / 49.8 / 57.6; 0.8B vs GemmaX2-2B Plain own 52.4 / 45.0 / 59.9 (n = 400, bootstrap SE [0.9, 2.6]). All 16 Constrained and 18 Plain (shared) comparisons agree on direction; 3 of 56 disagree (all Plain own, within 5 points of 50).

Table 6 - human: ChindaMT win rate Plain 0.64 / Constrained 0.69 / overall 0.67; preference intensity +0.39 / +0.68 / +0.53; inter-rater kappa 0.74 / 0.70 / 0.73; human-majority-vs-judge kappa 0.18 / 0.62 / 0.41.

Table 16 - LC% on CoreEval (Plain / Constrained): ChindaMT-4B vs Qwen3.5-4B 55.7 / 62.2; ChindaMT-Qwen3-4B vs Qwen3-4B 71.9 / 69.5; ChindaMT-2B vs Qwen3.5-2B 77.1 / 74.2; ChindaMT-0.8B vs Qwen3.5-0.8B 81.5 / 83.5; ChindaMT-4B vs ChindaMT-2B 62.6 / 64.2; ChindaMT-2B vs ChindaMT-0.8B 56.9 / 64.4; Gemma-3-4B FT vs Gemma-3-4B 99.1 / 66.6 (SE [1.8, 2.4], [2.2, 2.4], 0.7/2.3 by block; Gemma row WR% under primary / GPT-OSS / Llama: 97.9/67.4, 96.2/62.4, 97.9/67.0).

Table 7 - ablations at 4B, full-recipe LC% margin above 50 (Plain / Constrained; SE [2.1, 2.5]): vs no-cherry (random sample from the 17.85M pool) +8.24 / +0.69; vs no-all-pass (no 2E filter) +1.09 / +1.06; vs no-rules (Rules block stripped from training input) +12.63 / +9.53.

Table 18 - external-metric ablations (direction-averaged CK / DA / MQM / Mean): FLORES full 84.18 / 89.83 / 97.96 / 90.65; no-cherry 84.28 / 90.27 / 98.09 / 90.88; no-all-pass 84.19 / 89.68 / 97.92 / 90.60; no-rules 83.36 / 88.12 / 97.70 / 89.73. WMT24++ full 80.72 / 85.73 / 97.00 / 87.81; no-cherry 80.89 / 86.57 / 96.89 / 88.12; no-all-pass 80.76 / 85.90 / 96.70 / 87.79; no-rules 80.27 / 84.43 / 96.56 / 87.09.

Qualitative case (App. P): th->en, rules "Return only the translated text" and "Use concise, natural English", source meaning "browse the web privately on every device". ChindaMT-4B: "Browse the web privately on any device." Qwen3.5-4B: "Browse privately on any device." (drops "web"). Typhoon-Translate: echoes the Rules block and an `EN:` prefix before "Browse the web privately on every device." (rule violation).

### 7. Pitfalls the authors state

- Constraint coverage is bounded by what references demonstrate; mandated glossaries and placeholder tokens are out of scope by design; non-yes/no-checkable demands are out.
- Single primary judge (Qwen family, same as ChindaMT and Typhoon-Translate); absolute LC values may reflect its calibration; LLM judges can mildly favour their own lineage.
- English-Thai only.
- Prompt-format asymmetry: Grounded format matches the Typhoon-Translate template, not HY-MT or GemmaX2; Constrained uses the shared format only, omitting some GemmaX2 comparisons.
- All four ChindaMT bases are Qwen; Phase 1 selection is Qwen3.5-4B-derived even for the Gemma transfer; re-running selection with the target base is untested.
- Reference-free QE may favour fluent output (affects the Table 10 audit).
- Plain (own) leaves the systems close; human-vs-judge agreement there is low (kappa 0.18).
- MT output can be fluent but wrong; human review in high-stakes use.

### 8. Paper vs local code (author analysis)

| Point | Paper | Code | Verdict |
|---|---|---|---|
| IFD boundary | discard IFD at or above 1 | `if mean_rate > 1: continue` (1.0 kept; test A11) | disagree (negligible in practice) |
| `l(y)` | loss of target without instruction | loss of `"### Response:" + output` | approximation |
| 1A sample size | 40,683 | max 1,000 per pool file (100 x 10), loop over files | consistent if the pool has at least 41 files (INDEX's "<= 1,000 per corpus/direction" reading is too tight) |
| 1B precision | FP32 | `bf16: true`, trainable blocks kept in float32 | consistent |
| Training prompt templates | "English scaffolding, matching the training format"; one example record | 7 x 9 x 8 randomised templates, Rules after the output cue; no `Translate English to Thai.` opener, no `EN:` format | paper under-describes; eval layout not literally in training |
| IFD rationale | measures difficulty for the model that will learn, no further scorer | trains a scorer (1B); one Qwen3.5-4B scorer used for all bases | tension in the paper's argument |
| Cross-judge prompting | identical prompts | same rubric as one user message, order flipped per pair (seed 42) | detail only in code |
| Thinking flag for ChindaMT at eval | not stated | registry forces `enable_thinking False`; 4B chat template opens `<think>` if the flag is omitted | code-only; matters for users |
| Hyperparameters, decoding, judge settings, 1-3 sampled rules, temperatures | as Tables 12-13 | same | agree |

### 9. Equation inventory (LaTeX, same numbering as the HTML report)

Every equation, metric definition, loss and algorithm step of the paper, in report order. Origin: [P] printed in the paper; [W] defined in words by the paper, written as a formula by the report author; [S] standard definition behind a term the paper uses (author supplement). Worked numbers recomputed with `recompute_eq.py` (stdlib).

**Eq. 1 (E01, §3.2 1A, §4.5) [S]** Per-instance perplexity used for the mid band in 1A; the paper names it, the formula is the standard definition.

$$\mathrm{PPL}_i = \exp(\ell_i)$$

**Eq. 2 (E02, §3.2 1A, §4.5) [W]** 1A sampling: K-means (K=100) per group, 10 per cluster inside the 25th-75th perplexity band; 40,683 total (more than 20 groups x 1,000, consistent with the code looping per file).

$$D_{\mathrm{pre}} = \bigcup_{g}\bigcup_{k=1}^{K} \mathrm{Sample}_{m}\big(\{\, i \in C_{g,k} : P_{25} \le \mathrm{PPL}_i \le P_{75} \,\}\big),\quad K=100,\ m=10$$

**Eq. 3 (E03, §3.2 1B, §4.5) [W]** 1B: freeze-tune, one epoch, only the top 4 blocks trainable; plain SFT cross-entropy on D_pre.

$$\mathcal{L}_{\mathrm{pre}}(\theta_{\mathrm{top4}}) = \frac{1}{|D_{\mathrm{pre}}|}\sum_{(I,x,y)\in D_{\mathrm{pre}}} \ell_{\theta}(y \mid I, x)$$

**Eq. 4 (E04, §3.2 1C) [P]** IFD as printed in Sec. 3.2. IFD < 1: the instruction helps; >= 1 discarded; top decile of the rest kept.

$$\mathrm{IFD} = \frac{\ell(y \mid I, x)}{\ell(y)}$$

**Eq. 5 (E05, §3.2 1C) [W]** Numerator of IFD: mean token-level cross-entropy of the target given instruction and source.

$$\ell_{\theta}(y \mid I, x) = -\frac{1}{T}\sum_{t=1}^{T} \log p_{\theta}(y_t \mid I, x, y_{<t})$$

**Eq. 6 (E06, §3.2 1C) [W]** Denominator of IFD: the same loss without instruction and source (the local code keeps a '### Response:' prefix).

$$\ell_{\theta}(y) = -\frac{1}{T}\sum_{t=1}^{T} \log p_{\theta}(y_t \mid y_{<t})$$

**Eq. 7 (E07, §3.2 1C) [W]** Selection: drop IFD >= 1 (code: > 1), keep the top decile of the rest -> 1,751,962; implies about 17.52M survivors (author's arithmetic).

$$S = \{\, i : \mathrm{IFD}_i < 1 \,\},\qquad \mathrm{Cherry} = \{\, i \in S : \mathrm{IFD}_i \ge q_{0.9}(\mathrm{IFD}_S) \,\}$$

**Eq. 8 (E08, §3.3 2A) [W]** 2A: constraints are extracted from the reference that already satisfies them (feasible by construction; satisfaction judged by the LLM).

$$R_i = \mathrm{Extract}(x_i, y_i, \mathcal{T}),\qquad y_i \models r\ \ \forall r \in R_i$$

**Eq. 9 (E09, §3.3 2B) [W]** 2B: one yes/no question per constraint; empty answers drop the constraint. 1,751,962 -> 1,747,959 records (4,003 fewer, unexplained).

$$Q_i = \{\, q_k = \mathrm{Ask}(r_k) : r_k \in R_i,\ q_k \neq \varnothing \,\}$$

**Eq. 10 (E10, §3.3 2C) [W]** 2C: two candidates per cherry, sampled (1-3 random constraints) and all. 2 x 1,747,959 = 3,495,918 vs reported 3,495,704.

$$\hat{y}_i^{\,s} = \mathrm{Gen}\big(I \oplus \mathrm{Rules}(R_i^{s}),\, x_i\big),\ R_i^{s}\subset R_i,\ |R_i^{s}|\in\{1,2,3\};\qquad \hat{y}_i^{\,a} = \mathrm{Gen}\big(I \oplus \mathrm{Rules}(R_i),\, x_i\big)$$

**Eq. 11 (E11, §3.3 2D) [W]** 2D: per-constraint yes/no verdict, justification first.

$$a_k(\hat{y}) = \mathrm{Judge}(q_k, \hat{y}) \in \{\mathrm{YES}, \mathrm{NO}\}$$

**Eq. 12 (E12, §3.3 2E) [W]** 2E: keep a candidate only if every constraint is YES; retained constraints become the Rules: block of the training instruction.

$$\mathrm{keep}(\hat{y}) = \prod_{k} \mathbb{1}[a_k(\hat{y}) = \mathrm{YES}],\qquad \mathrm{Grounded} = \{\, (I \oplus \mathrm{Rules}(R'),\, x,\, \hat{y}) : \mathrm{keep}(\hat{y}) = 1 \,\}$$

**Eq. 13 (E13, §4.2, Table 2) [W]** Survival 1,973,358 / 3,495,704 = 56.45% (paper: 56.5%).

$$\text{survival} = \frac{|\mathrm{Grounded}|}{|\text{2C candidates}|} = \frac{1{,}973{,}358}{3{,}495{,}704} \approx 0.565$$

**Eq. 14 (E14, App. D, Table 10) [W]** Mean paired CometKiwi difference, regenerated minus reference: +13.10 overall = (16.03 + 10.18)/2.

$$\Delta\mathrm{CK} = \frac{1}{n}\sum_{i=1}^{n}\big[\mathrm{CK}(\hat{y}_i) - \mathrm{CK}(y_i)\big]$$

**Eq. 15 (E15, App. D, Table 10) [W]** Share with regenerated >= reference: 85.9% = (90.9 + 80.8)/2.

$$\text{share} = \frac{1}{n}\sum_{i=1}^{n}\mathbb{1}\big[\mathrm{CK}(\hat{y}_i) \ge \mathrm{CK}(y_i)\big]$$

**Eq. 16 (E16, App. D, Table 10) [S]** SE = s/sqrt(n); back-solved s is about 12.7-13 CK points per pair.

$$\mathrm{SE} = \frac{s}{\sqrt{n}}$$

**Eq. 17 (E17, App. I.1) [P]** Raw win rate with ties as half-wins (Table 15 and inside every LC% comparison).

$$\mathrm{WR}\% = \frac{w + 0.5\cdot d}{N}\cdot 100$$

**Eq. 18 (E18, App. I.2) [P]** Logistic GLM of AlpacaEval-v2 as printed (simplified form; the real fit has a model term).

$$P(\text{target wins}\mid\text{item}) = \sigma\big(\alpha\cdot\tanh(\Delta\ell) + \beta\cdot d + \gamma\big)$$

**Eq. 19 (E19, App. I.2) [S]** Logistic function; LC 61.8 corresponds to a logit of about 0.48, 97.9 to about 3.84.

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

**Eq. 20 (E20, App. I.2) [P]** LC% = GLM evaluated at zero length difference, averaged over items; N about 400 per comparison.

$$\mathrm{LC}\% = 100\cdot\mathbb{E}\big[P(\text{target wins}\mid\Delta\ell = 0)\big]$$

**Eq. 21 (E21, App. I.2, §5.3) [S]** Standard bootstrap SE (B = 1000) used for cross-judge and external win rates.

$$\mathrm{SE}_{\mathrm{boot}} = \sqrt{\frac{1}{B-1}\sum_{b=1}^{B}\big(\theta^{*}_{b} - \bar{\theta}^{*}\big)^{2}},\qquad B = 1000$$

**Eq. 22 (E22, Tables 7, 16, 17) [S]** Binomial sanity check: p=0.5, n=400 -> 2.50; p=0.979 -> 0.72 (Table 16 Gemma Plain SE 0.7); p=0.666 -> 2.36 (reported 2.3).

$$\mathrm{SE} \approx 100\cdot\sqrt{\frac{p(1-p)}{n}}$$

**Eq. 23 (E23, App. G) [S]** Temperature softmax; T = 0.01 is effectively greedy (logits 2.0 vs 1.9 -> 0.99995).

$$p_i = \frac{\exp(z_i / T)}{\sum_{j}\exp(z_j / T)}$$

**Eq. 24 (E24, §4.5, App. G) [W]** Full-parameter SFT cross-entropy on Grounded, response tokens only (train_on_prompt false in the code).

$$\mathcal{L}_{\mathrm{SFT}}(\theta) = \frac{1}{|G|}\sum_{(I_R, x, \hat{y}) \in G} \ell_{\theta}(\hat{y} \mid I_R, x)$$

**Eq. 25 (E25, §4.5) [S]** NEFTune noise (alpha = 2 per the paper); formula from Jain et al. 2023.

$$\tilde{E} = E + \frac{\alpha}{\sqrt{L\,d}}\,\varepsilon,\qquad \varepsilon \sim \mathcal{U}(-1, 1)^{L\times d}$$

**Eq. 26 (E26, App. G Table 13) [S]** Inverse-square-root schedule with 1% linear warmup (HF transformers form).

$$\eta_t = \begin{cases} \eta\,\dfrac{t}{W} & t < W \\[4pt] \eta\,\sqrt{\dfrac{W}{t}} & t \ge W \end{cases},\qquad \eta = 2\times10^{-5},\ W = 1\%\ \text{of steps}$$

**Eq. 27 (E27, §4.5) [W]** Effective batch 64 for every tier: 4x8x2 = 8x4x2 = 16x2x2.

$$B_{\mathrm{eff}} = (b \times a)\times G = (4\times 8)\times 2 = (8\times 4)\times 2 = (16\times 2)\times 2 = 64$$

**Eq. 28 (E28, App. I.2, Table 3) [W]** Table 3 Mean is a separate fit on all 400 items, not the average of the per-direction cells (e.g. 75.6 vs 74.0; 81.7 vs 78.6).

$$\mathrm{LC}\%_{\mathrm{Mean}} \neq \tfrac{1}{2}\big(\mathrm{LC}\%_{\mathrm{en}\to\mathrm{th}} + \mathrm{LC}\%_{\mathrm{th}\to\mathrm{en}}\big)$$

**Eq. 29 (E29, §5.2, App. I.3) [W]** CometKiwi: reference-free neural QE, reported on 0-100.

$$\mathrm{CK} = 100\cdot f_{\mathrm{Kiwi}}(x, \hat{y}) \in [0, 100]$$

**Eq. 30 (E30, §5.2, App. I.3, App. K) [W]** GEMBA-DA: the judge returns one integer 0-100 from source, reference and candidate; system score is the mean.

$$\mathrm{DA} = \frac{1}{N}\sum_{i=1}^{N} s_i,\qquad s_i = \mathrm{Judge}_{\mathrm{DA}}(x_i, y_i, \hat{y}_i) \in \{0,\dots,100\}$$

**Eq. 31 (E31, App. K) [W]** GEMBA-MQM: 100 minus 1/5/10 per minor/major/critical error (floor 0 implied by the 0-100 range).

$$\mathrm{MQM}_i = \max\big(0,\ 100 - (1\cdot n_{\mathrm{minor}} + 5\cdot n_{\mathrm{major}} + 10\cdot n_{\mathrm{critical}})\big)$$

**Eq. 32 (E32, App. I.3) [W]** MetricX-24: reference-based MQM-style error score 0-25, lower better, kept out of the quality mean.

$$\mathrm{MtX} = g_{\mathrm{MetricX\text{-}24}}(x, y, \hat{y}) \in [0, 25]\ \ (\downarrow)$$

**Eq. 33 (E33, Table 4) [W]** Unweighted mean of six values (3 metrics x 2 directions); recomputed for all 22 rows of Table 4, all within +-0.05 (two WMT24++ rows sit exactly on .x50 and were printed rounded down, so the paper rounds unrounded values).

$$\text{Quality Mean} = \frac{1}{6}\sum_{m\in\{\mathrm{CK},\mathrm{DA},\mathrm{MQM}\}}\ \sum_{\mathrm{dir}\in\{\mathrm{en\to th},\,\mathrm{th\to en}\}} \mathrm{score}_{m,\mathrm{dir}}$$

**Eq. 34 (E34, Table 4) [W]** Mean of the two directions: (2.13 + 1.98)/2 = 2.055 -> 2.06.

$$\mathrm{MtX\ Mean} = \tfrac{1}{2}\big(\mathrm{MtX}_{\mathrm{en}\to\mathrm{th}} + \mathrm{MtX}_{\mathrm{th}\to\mathrm{en}}\big)$$

**Eq. 35 (E35, §5.3, Tables 5, 17) [W]** Table 5 = mean of the three judges in Table 17 (recomputed: 20 of 22 cells match; 95.3 and 51.7 differ by 0.1 from 95.37 and 51.63); spread under 3 for the mid-90s pairs, wider elsewhere (5.3, 6.2).

$$\mathrm{WR}_{\mathrm{mean}} = \tfrac{1}{3}\big(\mathrm{WR}_{\mathrm{Pri}} + \mathrm{WR}_{\mathrm{OSS}} + \mathrm{WR}_{\mathrm{Llama}}\big),\qquad \text{spread} = \max_j \mathrm{WR}_j - \min_j \mathrm{WR}_j$$

**Eq. 36 (E36, §5.3, Table 6, App. M) [W]** Human win rate: sign of the -2..+2 rating, ties as half, averaged over 3 raters; overall 0.67 = (0.64 + 0.69)/2.

$$\mathrm{WR}_{\mathrm{hum}} = \frac{1}{R}\sum_{r=1}^{R}\mathrm{WR}_r,\quad \mathrm{WR}_r = \frac{1}{M}\sum_{i=1}^{M}\Big(\mathbb{1}[s_{ri} > 0] + \tfrac{1}{2}\,\mathbb{1}[s_{ri} = 0]\Big),\qquad s_{ri}\in\{-2,-1,0,1,2\}$$

**Eq. 37 (E37, Table 6, App. M) [W]** Mean of the raw -2..+2 ratings; overall +0.53 = (0.39 + 0.68)/2.

$$\text{Intensity} = \frac{1}{R\,M}\sum_{r=1}^{R}\sum_{i=1}^{M} s_{ri}$$

**Eq. 38 (E38, §5.3, Table 6) [S]** Cohen's kappa (standard); illustration p_o = 0.85, p_e = 0.45 -> 0.727. 'Substantial'/'moderate' match Landis-Koch bands.

$$\kappa = \frac{p_o - p_e}{1 - p_e},\qquad p_e = \sum_{c} p_{1c}\,p_{2c}$$

**Eq. 39 (E39, Table 6) [W]** Inter-rater kappa averages the three rater pairs; overall 0.73 vs (0.74 + 0.70)/2 = 0.72: either computed on all 100 items or a rounding effect (e.g. 0.745, 0.705); the paper does not say.

$$\bar{\kappa}_{\mathrm{inter}} = \tfrac{1}{3}\big(\kappa_{12} + \kappa_{13} + \kappa_{23}\big)$$

**Eq. 40 (E40, Table 6) [W]** Human-vs-judge kappa against the majority of three raters: 0.18 / 0.62 / 0.41.

$$\kappa_{\mathrm{HJ}} = \kappa\big(\mathrm{maj}(h_1, h_2, h_3),\ \mathrm{judge}\big)$$

**Eq. 41 (E41, §5.4, Table 16) [W]** Lift = LC% - 50: 62.6 -> +12.6, 56.9 -> +6.9, 64.2 -> +14.2, 64.4 -> +14.4.

$$\mathrm{Lift} = \mathrm{LC}\%(A \text{ vs } B) - 50$$

**Eq. 42 (E42, §5.5, Table 7) [W]** Table 7 lifts are LC%(Full vs ablation) - 50; +8.24 means LC 58.24.

$$\mathrm{Lift}_v = \mathrm{LC}\%(\mathrm{Full}\ \text{vs}\ v) - 50,\qquad v \in \{\text{no-cherry}, \text{no-all-pass}, \text{no-rules}\}$$

**Eq. 43 (E43, App. O, Table 18) [W]** Table 18 Mean = mean of the three direction-averaged metrics; 90.657 vs printed 90.65 and 87.817 vs 87.81 (rounding).

$$\mathrm{Mean} = \tfrac{1}{3}\big(\mathrm{CK}_{\mathrm{avg}} + \mathrm{DA}_{\mathrm{avg}} + \mathrm{MQM}_{\mathrm{avg}}\big)$$

**Eq. 44 (E44, App. O) [W]** Ablation minus full: no-rules -0.92 / -0.72, no-cherry +0.23 / +0.31, no-all-pass -0.05 / -0.02.

$$\Delta\mathrm{Mean}_v = \mathrm{Mean}_v - \mathrm{Mean}_{\mathrm{Full}}$$

## Quick Reference

| Item | Value |
|---|---|
| Paper | arXiv 2609.34770 (v1 2026-09-28, v2 2026-10-05), AACL-IJCNLP 2026 Main |
| Authors / org | Chay-intr, Harnchang, Thabua, Viriyayudhakorn, Theeramunkong; iApp Technology, IISI Research Center, SIIT Thammasat, AIEAT |
| Pool | 10 corpora, both directions, ~17.85M (17,854,736) |
| Phase 1 | IFD = l(y given I,x) / l(y); drop >= 1; keep top 10% -> 1,751,962 |
| Scorer | Qwen3.5-4B freeze-tuned (top 4 blocks), 40,683 samples (K-means 100 x 10, perplexity P25-P75) |
| Phase 2 LLM | Qwen3.5-35B-A3B-FP8, thinking off |
| Phase 2 temps / max tokens | 2A 0.7/1024, 2B 0/512, 2C 0.7/512, 2D 0/1024 |
| Grounded | 1,973,358 records (en-th 1,172,061 + th-en 801,297 per dataset README), 56.5% of 3,495,704 candidates, mean 3.7 rules |
| SFT | full, 1 epoch, lr 2e-5, inv-sqrt, warmup 1%, wd 0.01, AdamW, batch 64, cutoff 1024, packing, NEFTune 2, seed 42, ZeRO-2 |
| Compute | 25 / 10 / 8 h (4B / 2B / 0.8B) on 2x H100; Phase 1 ~2.5 days; Phase 2 ~2 weeks |
| Decoding | temp 0.01, top-p 0.7, top-k 20, rep 1.05, 1024 new tokens, thinking off |
| Judge | Qwen3.6-35B-A3B-FP8, temp 0, 1024 tokens; cross-judges GPT-OSS-120B, Llama-3.3-70B-Instruct |
| Suites | CoreEval (5 domains), BroadEval (10 domains), each Plain 400 + Constrained 400 |
| Headline | 4B vs Typhoon-Translate-4B CoreEval 61.8 / 68.4 LC%; vs HY-MT-1.5-7B Constrained 97.9 (BroadEval 98.2) |
| External | FLORES Quality Mean 4B 90.7 (tie top), 2B 88.9 (tier lead), 0.8B 85.9 (tier last); WMT24++ 4B 87.8 vs HY-MT-7B 89.4 |
| Human | 3 raters, 100 items each; ChindaMT preferred 64% / 69%; kappa inter-rater 0.73, human-vs-judge 0.41 |
| Ablations | no-rules +12.63/+9.53, no-cherry +8.24/+0.69, no-all-pass +1.09/+1.06 |
| Model config (local) | Qwen3.5 hybrid: 3 linear-attention (Gated DeltaNet) layers per 1 full-attention layer; vocab 248,320; 262,144 positions; tied embeddings |
| Licences | paper arXiv non-exclusive; weights + code Apache-2.0; Grounded + suites CC-BY-SA 4.0 (one BroadEval item CC-BY-NC-4.0) |

## Comparisons

Table 8 (paper's comparison with prior IF data augmentation):

| Aspect | AutoIF | UltraIF | RGDC |
|---|---|---|---|
| Source data | 36 hand-written seeds | ShareGPT prompts | cherry-selected translation Q&A |
| Constraint origin | self-instruct from seeds | decomposed from prompts | extracted from references |
| Verification | Python execution | LLM-as-judge | LLM-as-judge with explanations |
| Filter strictness | score threshold | rejection sampling | every constraint must pass |
| Scale | 10-25k | 175k | 1.97M |
| Aux. model | no | yes (UltraComposer) | yes (IFD scorer + aux LLM) |
| Domain | general | general | translation |

Table 14 (metric coverage): WR%/LC% covers accuracy, IF, fluency, pairwise, not reference-dependent; CometKiwi accuracy + fluency only; GEMBA-DA accuracy, IF "indirectly", fluency, reference-dependent; GEMBA-MQM accuracy, fluency via the Fluency category, reference-free.

Translation-IF trade-off (Sec. 6.1): MM-46-4B, TranslateGemma-4B and GemmaX2 are at parity with ChindaMT on Plain but lose every Constrained comparison under all three judges; Typhoon-Translate-4B is weaker on Plain but closer on Constrained. The authors attribute RGDC's escape from the trade-off to a single source of truth (the cherry references) for both rule and translation supervision.

## Fact Check

15 claims that are not the paper's own results; 9 confirmed, 6 partly, 0 not found, 0 contradicted.

| Claim | Verdict | Detail | Read from |
|---|---|---|---|
| Qwen3.5 0.8B/2B/4B and 35B-A3B exist | confirmed | Qwen3.5-0.8B released 2026-02-24, vocab 248,320, 262K context, Gated DeltaNet + gated attention hybrid (75% linear layers); family lists 2B, 4B, 9B, 27B, 35B-A3B, 122B-A10B, 397B-A17B | apxml.com spec page (secondary) |
| Judge Qwen3.6-35B-A3B exists | confirmed | listed by several providers (SiliconFlow, OpenRouter) | search result titles only |
| Typhoon-Translate-1.5 4B, temp 0.2 | confirmed | model card: 4B, Qwen3 architecture, Thai<->English, quickstart temp 0.2 | huggingface.co/scb10x/typhoon-translate1.5-4b |
| "No baseline exposes a Rules: slot" | partly | Typhoon-Translate-1.5's own template asks the model to strictly follow "the rules below" and return only the translation, i.e. it has its own rules slot (not literally `Rules:`); consistent with the paper's note that Grounded matches the Typhoon template | same model card |
| HY-MT-1.5 7B / 1.8B, temp 0.7 top-p 0.6, cited as the Hunyuan-MT report | partly | sizes and decoding confirmed (top-k 20, rep 1.05; Thai supported); HY-MT1.5 has its own technical report (arXiv 2512.24092, 2025-12-30), the paper cites the earlier Hunyuan-MT report (2509.05209) | huggingface.co/tencent/HY-MT1.5-7B; arXiv 2512.24092 |
| GemmaX2-28 9B and 2B | confirmed | Gemma2 base, 28 languages incl. Thai, 2B and 9B | huggingface.co/ModelSpace/GemmaX2-28-9B-v0.1 |
| TranslateGemma 4B (arXiv 2601.09012) | confirmed | released 2026-01-15, 4B/12B/27B on Gemma 3, 55 languages (blog does not list Thai) | blog.google |
| MiLMMT-46 4B and 1B, greedy | confirmed | 4B builds on Gemma3-4B, 46 languages incl. Thai, example decoding top_k=1 temp 0; 1B checkpoints exist | huggingface.co/KennyJA/MiLMMT-46-4B-v1.0; search |
| IFD and pre-experience 100 clusters x 10 (Li et al. 2024b) | confirmed | Cherry_LLM README: kmeans 100, sample_num 10, low/up 25/75; selects about 5% or 10% | github.com/tianyi-lab/Cherry_LLM |
| LC% formula sigma(alpha tanh(dl) + beta d + gamma) | partly | AlpacaEval's GLM is a logistic regression with model, length-difference and instruction terms, evaluated at zero length difference; the paper's form omits the model term | github.com/tatsu-lab/alpaca_eval |
| GEMBA-MQM (Kocmi & Federmann 2023a) | partly | original is 3-shot, reference-free, broader categories; this paper's version is zero-shot, 6 categories, penalties 1/5/10, so its numbers are not comparable to published GEMBA-MQM scores | aclanthology.org/2023.wmt-1.64 |
| MetricX-24 0-25, lower better, reference-based | confirmed | card: scores clipped to [0, 25]; hybrid model supports reference-based and reference-free (direction not stated on that page) | huggingface.co/google/metricx-24-hybrid-large-v2p6-bfloat16 |
| AutoIF: 36 seeds, code verification, score threshold | partly | code verification and accuracy > 0.5 threshold confirmed; 36 not found on the page read | alphaxiv overview 2406.13542 |
| UltraIF: ShareGPT prompts, UltraComposer, 175k | partly | UltraComposer and evaluation-question scoring confirmed; ShareGPT and 175k not found on the page read | themoonlight.io review (secondary) |
| ChindaMT released open (Apache-2.0) with Grounded | confirmed | iapp/ChindaMT-4B card: Apache-2.0, base Qwen3.5-4B, 61.8/68.4 vs Typhoon matching Table 3; iapp/ChindaMT-2B and iapp/ChindaMT-Grounded exist | huggingface.co/iapp/ChindaMT-4B |

Author observations from the paper's own tables (not external fact-check):
- ChindaMT-0.8B is last in its tier on both external benchmarks (FLORES 85.9, WMT24++ 81.2) and loses several external pairwise directions (Table 15), which the text does not discuss.
- No external metrics are reported for the Qwen3.5 bases, so "without sacrificing raw translation quality" is relative to baselines, not before/after fine-tuning.
- The training target is a distillation from Qwen3.5-35B-A3B; there is no ablation that trains on the original references, so curation and distillation effects are not separated.

## Open Questions & Extension Ideas

Answers to the 16 questions in `.dropzone/ChindaMT/INDEX.md` section 8 (from the paper):
1. Training targets: regenerated 2C outputs, not references (confirmed); only a CometKiwi audit (85.9% regen >= ref); no human check; 35B teacher's own MT quality not reported.
2. Yield: only the overall 56.5% (1,973,358 / 3,495,704); no per-variant/corpus/direction/category rates; the 1,206,946 unique-source figure is not in the paper.
3. Self-verification: same aux LLM for 2A-2D acknowledged; no human audit of yes/no accuracy; Thai word counting not discussed.
4. Thai-specific rules: not quantified; only the 77% / 23% category split; 2A examples are general-domain.
5. Prompt-format shift: paper says eval matches the training format (English scaffolding); training-template diversification is not described; no explicit generalisation test.
6. IFD: paper drops >= 1 (code > 1); ablations no-cherry / no-all-pass / no-rules exist; no scorer-sensitivity study.
7. Same-family judge: acknowledged; two cross-judges; 3 of 56 direction disagreements, all Plain (own); GPT-OSS gives 47.1 for 4B vs MiLMMT-46-4B Plain (own).
8. LC for MT: justified by general judge length bias; not quantified for translation.
9. Metric weights: GEMBA adapted (zero-shot, 1/5/10); not validated against human MQM; MetricX kept separate because of its native error scale.
10. Variance: single run, seed 42; tokens per epoch not given; times 25/10/8 h.
11. Packing / caps: values stated; share at caps not reported; document-level not addressed.
12. ShareAlike vs weights: not discussed.
13. 2B: full numbers in Tables 3, 4, 5, 15, 16, 17.
14. Thinking flag: stated off for aux LLM and judge; not stated for ChindaMT eval; template difference not discussed.
15. Word-segmented Thai: not discussed.
16. Model names: Qwen3.5-35B-A3B-FP8 = Phase 2 aux LLM; Qwen3.6-35B-A3B-FP8 = judge; Qwen3.5-4B = Phase 1 scorer; Qwen3-30B-A3B (example.yaml) is not in the paper.

Extension ideas:
- Ablation that trains on the original references with grounded rules (no regeneration) to separate curation from distillation.
- Human audit of a stratified sample of 2D verdicts, especially numerical/length rules on unspaced Thai.
- Re-run Phase 1 with each target base as scorer (the paper's own untested item).
- Report Thai tokens per character for the Qwen3.5 tokenizer (vocab 248,320) on Grounded text, spaced vs unspaced.
- Evaluate ChindaMT with the training-style prompts vs the model-card prompt to measure template sensitivity.

## Tags & Triggers

tags: ChindaMT, RGDC, IFD, Cherry LLM, instruction-following machine translation, Thai-English MT, data curation, constraint augmentation, all-pass filter, LLM-as-judge, AlpacaEval length-controlled win rate, CometKiwi, MetricX-24, GEMBA-DA, GEMBA-MQM, Qwen3.5, Qwen3.6, SFT, NEFTune, LLaMA-Factory, DeepSpeed ZeRO-2

- How is the IFD score computed and used to select SFT data?
- How do you build instruction-following data whose constraints are always feasible?
- What is a length-controlled win rate and why use it?
- How much can an LLM judge from the same model family be trusted, and how do you cross-check it?
- What are ChindaMT's training hyperparameters and decoding settings?
- Which Thai-English open translation model follows explicit rules best at 4B / 2B / 0.8B?

## References

- Paper: Chay-intr, Harnchang, Thabua, Viriyayudhakorn, Theeramunkong. "Reference-Grounded Data Curation for Instruction-Following Thai-English Machine Translation." arXiv 2609.34770v2, https://arxiv.org/html/2609.34770v2 (abstract https://arxiv.org/abs/2609.34770v2; license http://arxiv.org/licenses/nonexclusive-distrib/1.0/).
- Released artefacts: https://huggingface.co/iapp/ChindaMT-4B, https://huggingface.co/iapp/ChindaMT-2B, https://huggingface.co/datasets/iapp/ChindaMT-Grounded; code repo iapp-technology/ChindaMT-RGDC (owner's local copy).
- Local scan: `.dropzone/ChindaMT/INDEX.md` (agent chinda-scan, 2026-10-13).
- Fact-check sources: https://apxml.com/models/qwen35-08b; https://www.siliconflow.com/models/qwen3-6-35b-a3b; https://huggingface.co/scb10x/typhoon-translate1.5-4b; https://huggingface.co/tencent/HY-MT1.5-7B; https://arxiv.org/html/2512.24092v1; https://huggingface.co/ModelSpace/GemmaX2-28-9B-v0.1; https://blog.google/innovation-and-ai/technology/developers-tools/translategemma/; https://huggingface.co/KennyJA/MiLMMT-46-4B-v1.0; https://github.com/tianyi-lab/Cherry_LLM; https://github.com/tatsu-lab/alpaca_eval; https://aclanthology.org/2023.wmt-1.64.pdf; https://huggingface.co/google/metricx-24-hybrid-large-v2p6-bfloat16; https://www.alphaxiv.org/overview/2406.13542; https://themoonlight.io/review/ultraif-advancing-instruction-following-from-the-wild
