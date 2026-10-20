# Get Started with Unsloth Studio: Generate Data & Fine-Tune LLMs Locally on any NVIDIA GPU — NVIDIA Developer - Claude Context
> Source: YouTube, NVIDIA Developer, "Get Started with Unsloth Studio: Generate Data & Fine-Tune LLMs Locally on any NVIDIA GPU", 8:18, published 2026-03-17 · https://www.youtube.com/watch?v=mmbkP8NARH4 · Generated: 2026-10-19
> Companion: 20260317_Get-Started-With-Unsloth-Studio-Generate-Data-And-Fine-Tune-LLMs-Locally-On-Any-NVIDIA-GPU.html (Thai, iw mode `iwd`, 12 sections, 18 frames + 15 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: P01, P02, P03, P04, P05, P06, P07, P08, S05, S09, S10, S11, S12, S13, S17, S18, S19, S20.
- Own SVG diagrams: flow, layers, compare, bars, flow, flow, flow, tokens, algo, line, layers, line, compare, bars, algo.
- Transcript SHA-256 (in-page = decoded): `802192ea9343c52cb0e619b2eb3e4d3d5a96c35d309c7d48a3aa39fcb48dae73`; kept in the session workspace only.

## TL;DR

- NVIDIA Developer tutorial (8:18, 2026-03-17) showing an end-to-end, no-code workflow in **Unsloth Studio** (the GUI of the open-source Unsloth fine-tuning framework): synthetic data generation -> QLoRA fine-tune -> chat test -> GGUF export, all on a local NVIDIA GPU.
- Method the speaker calls "a simple distillation workflow": a larger **teacher** (Nemotron-3 Nano, `unsloth/Nemotron-3-Nano-30B-A3B-GGUF` served by `llama-server`) writes step-by-step reasoning for each row of a **seed dataset** (`unsloth/alpaca-cleaned`); the result trains a small **student** (`allenai/OLMo-2-0425-1B-Instruct`, ASR wrote "Alma 2 Instruct") to "think" before answering.
- Data recipe (powered by NVIDIA NeMo Data Designer): Model Provider -> Model Config -> Hugging Face dataset -> LLM Text (`reasoning_trace`, dropped from output) -> Expression (`output_with_reasoning` = `<think> {{ reasoning_trace }} </think>` newline `{{ output }}`).
- Training: QLoRA (4-bit), lr 1e-4, LoRA rank 16 / alpha 32 / dropout 0.00, batch size 10, 100 steps, context 2,048, on 1,000 rows = 1 epoch (true in this run; screen shows Epoch 0.83 at step 83). About 1 minute "on my hardware" (screen: a 95.59 GB VRAM GPU).
- Export: GGUF / Llama.cpp at Q4_K_M (marked "rec"), loaded back in Chat as `OLMo-2-0425-1B-Instruct-finetune-gguf`.
- The teacher prompt (screen 4:22) gives the teacher the instruction, input AND the original answer and asks for the reasoning that leads to that answer, so the reasoning is written backwards from a known answer.
- Author caveats: batch size and gradient accumulation never appear on screen; the chat test question is nearly identical to a training row; `input` was mapped to None; the on-screen GGUF size estimates look too large for a 1B model; the progress box shows Total 100 and Processed batch 3/10 for a run set to 1,000 records (author reading: 10 batches of 100; the dataset shows Batches 10/10).

## Key Concepts

- **Unsloth / Unsloth Studio**: Unsloth = open-source framework for efficient fine-tuning on consumer GPUs (core Apache-2.0); Studio = its web GUI (AGPL-3.0, beta, launched 2026-03-17) with four tabs: Studio (train), Recipes (data), Export, Chat.
- **Response-level distillation**: the student is fine-tuned (plain SFT) on text the teacher wrote. The student never sees teacher logits; this is not logit/KL distillation. (author note)
- **Synthetic data recipe**: a node graph built on NeMo Data Designer. Block types used: Model Provider (endpoint + optional API key, OpenAI-compatible; shown as "openai · Model Provider"), Model Config (alias, model name, inference params), Hugging Face dataset (seed), LLM Text (LLM-generated column from a Jinja2 prompt), Expression (Jinja2 transform, no LLM call). Columns can be marked "Drop from final dataset": still generated and referenceable, removed from export.
- **Thinking mode**: Nemotron-3 Nano reasons by default; the log shows the kwarg passed explicitly: `extra_body={'chat_template_kwargs': {'enable_thinking': True}}`. The kwarg mostly matters for turning reasoning off.
- **Reasoning format taught to the student**: `<think> ... </think>` followed by the final answer. In Chat, Studio renders the think span as a collapsible "Thought for 3 seconds".
- **Column -> role mapping**: Studio auto-detects which column is the user turn and which is the assistant turn (format shown: `custom_heuristic`); an "AI Assist (Beta)" button proposes a mapping when detection fails.
- **QLoRA**: base weights in 4-bit, small low-rank adapters trained (rank r, scale alpha). Studio labels QLoRA the lowest-VRAM method.
- **Epoch arithmetic**: epochs = batch x grad_accum x steps / N. The speaker's version omits grad_accum (fine here because it was effectively 1).
- **GGUF quantization levels** offered: Q3_K_M, Q4_0, Q4_K_M (rec), Q5_0, Q5_K_M, Q8_0, F16, F32.

## Implementation

### 1. Prerequisites (slide "Requirements", 1:18 and 1:37)

1. Latest Unsloth (includes Studio). Command on the slide (March 2026):

```bash
$ git clone git@github.com:unslothai/unsloth
$ cd unsloth
$ pip install -e .
$ unsloth studio setup
$ unsloth studio -H 0.0.0.0 -p 8001
```

   `pip install -e .` is an editable install: the package points at the cloned folder, so local edits or `git pull` apply without reinstalling (author note; keep the folder).
   As of Oct 2026 the docs install via script instead: `curl -fsSL https://unsloth.ai/install.sh | sh` (Windows: `irm https://unsloth.ai/install.ps1 | iex`), launched with `unsloth studio` (fact-check note).
2. GPU: "at least 16GB VRAM for small model training (or 24GB VRAM for local teacher model deployment, with full GPU offloading)" (slide text; the speaker only says 16 GB). Unsloth needs CUDA compute capability >= 7.0; the title's "any NVIDIA GPU" is only partly true.
3. Teacher: Nemotron-3 Nano, local or cloud. Local command on the slide:

```bash
$ ~/.unsloth/llama.cpp/build/bin/llama-server \
    -hf unsloth/Nemotron-3-Nano-30B-A3B-GGUF \
    --port 8000 \
    --alias my-local-nemotron \
    --n-gpu-layers all \
    --cache-ram 0 \
    --ctx-size 2048
```

   Nemotron-3 Nano 30B-A3B: about 30B total / about 3B active parameters (HF card: 30B / 3.5B active; tech report: 31.6B / 3.2B), hybrid Mamba2-Transformer MoE; the 4-bit GGUF needs about 24 GB, so a single 16 GB card cannot host it fully on GPU. Cloud alternatives named in the clip: build.nvidia.com, OpenRouter.

### 2. Data recipe (Recipes tab -> New recipe -> Start empty), 2:25-5:20

| Block | Settings shown or said |
|---|---|
| Model Provider | dialog (2:50): PROVIDER NAME, ENDPOINT (placeholder `https://...`), API KEY (OPTIONAL), collapsed OPTIONAL section; name "My Local Model Provider"; endpoint `http://localhost:8000/v...` (truncated on the canvas at 5:20; the filled dialog is never shown). Author guess: `http://localhost:8000/v1` (llama-server's OpenAI-compatible path). API key optional (for remote providers) |
| Model Config | MODEL ALIAS `Local Nemotron`; MODEL `my-local-nemotron`; PROVIDER NAME `My Local Model Provider`; INFERENCE: four unlabelled boxes; empty ones show placeholders (`Top_p` box 2, `Timeout (sec)` box 4); box 1 = `0.7` (temperature, per log), box 3 = `2048` (max tokens, per speech + log `max_tokens=2048`); INFERENCE EXTRA BODY (JSON) shows only the grey placeholder `{"top_k": 20, "min_p": 0.0}`; SKIP HEALTH CHECK unchecked |
| Hugging Face dataset | `unsloth/alpaca-cleaned` (columns instruction, input, output); Load, Preview |
| LLM Text | column name `reasoning_trace` (default `llm_text_1`); Drop from final dataset = on ("Keep for generation but omit from exported rows.", 4:10); model alias Local Nemotron; Tool profile none ("Add a Tool Profile block to configure MCP servers and allowed tools." - MCP = Model Context Protocol, unused); SYSTEM PROMPT (OPTIONAL) empty; Use image context off; PROMPT below (default text was "Write a response.") |
| Expression | column `output_with_reasoning`, OUTPUT TYPE `str`, not dropped; EXPRESSION (JINJA2) below |
| Validate | catches config errors; blocks show orange "Fix before run: ..." messages (e.g. "Model alias is required.") |

LLM Text prompt (exact, screen 4:22; the last paragraph may be one soft-wrapped line):

```jinja
Given the instruction, input and the answer, write the reasoning that leads to that answer.

instruction:
{{ instruction }}

input:
{{ input }}

answer:
{{ output }}

Write all the reasoning behind the answer. Do not refer to the question, the answer, or the process of deriving it. Respond as if you are thinking through all aspects of the questions before coming up with the final answer. The reasoning is more detailed than the answer, and the answer must be a summary of the reasoning. Respond plainly without boilerplate text
```

Note (author): this is answer-conditioned rationalization: the teacher sees the gold answer and writes a forward-looking rationale that is told not to mention it. The rationale always lands on the Alpaca answer (which the Expression block appends), so a wrong Alpaca answer gets a fluent wrong rationale. The speaker's "rewrite the answers" means "add reasoning"; the final answer text is unchanged.

Expression template (exact, screen 4:45):

```jinja
<think> {{ reasoning_trace }} </think>
{{ output }}
```

Note: the final answer after `</think>` is the ORIGINAL Alpaca `output`; the teacher only writes the reasoning. The separate `output` column is absent from the final dataset (columns: instruction, input, output_with_reasoning).

Full run settings dialog (4:56-5:06): Preview mode off ("Turn this off for a full dataset run."); RUN NAME typed `Generate 1000 rows` (placeholder "Sprint dataset v2"; empty -> red "Run name is required before starting a full run."); RECORDS changed from default 100 to `1000`; LLM PARALLEL empty (placeholder "Use model config"; log shows max_parallel_requests=4); Enable batching ("Split big runs into manageable chunks") still OFF in the last frame (5:06), with a yellow hint "Bigger runs usually feel smoother with batching on - You're generating 1,000 records..."; whether it was switched on before Start full run is not shown. Show advanced; buttons Cancel / Validate recipe / Start full run. Speaker: 1,000 records ("you can still get by with fewer"); batching makes the run more resilient.

Terminal output (Executions view, 5:26, exact):

```text
[6:37:55 PM] [INFO] |-- inference parameters:
[6:37:55 PM] [INFO] |  |-- generation_type=chat-completion
[6:37:55 PM] [INFO] |  |-- max_parallel_requests=4
[6:37:55 PM] [INFO] |  |-- extra_body={'chat_template_kwargs': {'enable_thinking': True}}
[6:37:55 PM] [INFO] |  |-- temperature=0.70
[6:37:55 PM] [INFO] |  |-- max_tokens=2048
[6:37:55 PM] [INFO] ⚡ Processing llm-text column 'reasoning_trace' with 4 concurrent workers
[6:37:55 PM] [INFO] ⏱ llm-text column 'reasoning_trace' will report progress every 10 records
```

Progress lines: 10/100 at 6:38:11 (0.61 rec/s), 20/100 at 6:38:30 (0.56), 30/100 at 6:38:45 (0.59), 40/100 at 6:39:05 (0.57), 50/100 at 6:39:14 (0.63), 60/100 at 6:39:29 (0.64); header Done 60 / Total 100 / Rate 0.64 rec/s / ETA 62.8 s / Processed batch 3/10. Progress box (not part of the terminal log): Done 60, Total 100, Rate 0.64 rec/s, ETA 62.8 s, Column reasoning_trace 60/100 (60.0%), Processed batch: 3/10. The run was set to 1,000 records; author reading: it is processed in 10 batches of 100 (Total 100 = batch size), consistent with the training dataset `recipe_generate-1000-rows` (1,000 rows, Batches 10/10, updated 3/9/2026). The clip does not explain the counter or whether Enable batching was turned on. Author estimate: at about 0.6 rec/s, 1,000 rows take about 28 min, far longer than training.

### 3. Training (Studio tab), 5:32-7:12

- Base model `allenai/OLMo-2-0425-1B-Instruct`; Method `QLoRA (4-bit)` (badge "2x Faster Training"); dataset `recipe_generate-1000-rows` (local, Data Recipe output).
- Dataset Preview: Format `custom_heuristic`, Total Rows 1,000, auto-detected mapping `output_with_reasoning -> Assistant`, `instruction -> User`, `input -> None`; "AI Assist (Beta)" button; "Mapping is saved automatically."
- Parameters (screen 6:35 vs earlier defaults):

| Parameter | Set | Default seen on screen |
|---|---|---|
| Max Steps | 100 | 30 ("Use 0 to run by epochs") |
| Context Length | 2,048 | 8,192 |
| Learning Rate | 0.0001 (said "1e-4") | 0.0002; hint "2e-4 for LoRA, 2e-5 for full fine-tune" |
| LoRA Rank | 16 | - |
| LoRA Alpha | 32 (said) | - (docs now say 32 is the default; a DataCamp tutorial showed 16) |
| LoRA Dropout | 0.00 | - (docs default 0.05) |
| Batch size | 10 (said; never visible: the "Training Hyperparameters" section stays collapsed up to Start Training, 6:36-6:44) | docs default 4 |
| Gradient accumulation | not said, never visible; effectively 1 in this run (Epoch 0.83 at step 83) | docs default 8 |

- Epochs: speaker computes 10 x 100 = 1,000 samples = 1 epoch. Screen confirms (Epoch 0.83 at step 83). With the documented default grad_accum 8 the same settings would be 8 epochs. Rule: epochs = batch x grad_accum x steps / N.
- Training Progress snapshot (7:05): Step 83/100, Epoch 0.83, Loss 1.2249, LR 1.89e-5, Grad Norm 0.685, Elapsed 0m 56s, ETA 0m 11s, 1.46 steps/s, Tokens 261201; GPU Monitor VRAM 0.58 / 95.59 GB, Power 19.09 / 600 W, Utilization 0%, 39 C; Eval Loss "Evaluation not configured". Loss axis 0.8816-2.383, smoothed loss from about 2 down to about 1.3; grad norm peaks about 1.258 then 0.4-0.7.
- LR schedule (author reconstruction): linear warmup to 1e-4 over about 10 steps, then linear decay to 0 at step 100. Check: 1e-4 x (100-83)/(100-10) = 1.89e-5, exactly the on-screen LR at step 83.
- Duration: "about 1 minute" on the speaker's hardware, which the screen shows has 95.59 GB VRAM / 600 W, not a 16 GB card.

### 4. Test (Chat tab), 7:12-7:42

Select the model under "fine-tuned" (`allenai_OLMo-2-0425-1B-Instruct`, badge LoRA; may take a moment to load). Prompt: "What are the 3 primary colors?" -> "Thought for 3 seconds" -> "The three primary colors are red, blue, and yellow. This is a fundamental concept in color theory that allows us to mix these colors together to create other shades. Red and yellow form a primary pair when combined. Blue and yellow also make up a..." (cut off in the frame).

### 5. Export, 7:42-8:05

Export tab: Training Run `allenai_OLMo-2-0425-1B-Instruct` (5 checkpoints, Mar 9, 2026, 7:54 PM); Checkpoint `allenai_OLMo-2-0425-1B-Instruct_1773111263` (loss 1.0328); Training Info: Method LoRA / QLoRA, LoRA Rank 16. Export methods: Merged Model ("Full 16-bit model ready for inference"), LoRA Only ("Lightweight adapter files (~100 MB). Needs base model."), GGUF / Llama.cpp ("Quantized formats for local AI runners."). Quantization levels with on-screen size estimates: Q3_K_M ~3.5 GB, Q4_0 ~4.1 GB, Q4_K_M ~4.8 GB (rec), Q5_0 ~5.0 GB, Q5_K_M ~5.6 GB, Q8_0 ~8.2 GB, F16 ~14.2 GB, F32 ~28.4 GB. Chosen: Q4_K_M; conversion via llama.cpp; dialog "Export Complete - Model saved locally." (7:58; no file name or folder; no destination picker is shown although Quick Guide step 4 says "Click Export and choose your destination" - save location NOT shown in the clip); then Chat lists `OLMo-2-0425-1B-Instruct-finetune-gguf` (badge LoRA); prompt "Explain the primary colors" -> "Thinking..." panel listing colours ("Yellow: This color is the brightest one on the spectrum...", "Therefore, red, blue, and yellow are the primary colors...") at 8:06, final answer not visible.

### Pitfalls (stated or observed)

- Answer-conditioned rationales: the teacher is given the gold answer; errors in alpaca-cleaned answers propagate into confident reasoning. Consider letting the teacher answer itself and filtering by agreement. (author)
- `input -> None`: Alpaca rows with a non-empty input are trained without it; merge input into the instruction or filter those rows. (author)
- Test leakage: the chat question is nearly the training row "What are the three primary colors?"; evaluate on held-out questions and configure Eval Loss. The answer's content ("Red and yellow form a primary pair") is wrong colour theory and was not checked in the clip. (author)
- Size estimates: a model of about 1-1.5B parameters is about 2-3 GB at 16-bit, not ~14.2 GB; the on-screen sizes look like generic estimates; check the real file. (author)
- Hardware: 16 GB is enough for QLoRA on the 1B student, not for the local 30B-A3B teacher at the same time.

## Quick Reference

| Item | Value | Source |
|---|---|---|
| Student | allenai/OLMo-2-0425-1B-Instruct | screen 0:40, 6:35 |
| Teacher | unsloth/Nemotron-3-Nano-30B-A3B-GGUF via llama-server :8000, alias my-local-nemotron, ctx 2048 | slide 1:37 |
| Studio launch | `unsloth studio -H 0.0.0.0 -p 8001` | slide 1:18 |
| VRAM | >= 16 GB (student training); 24 GB (local teacher, full offload) | slide 1:37 |
| Seed | unsloth/alpaca-cleaned | slide 2:10, screen 4:30 |
| Teacher call | temperature 0.7, max_tokens 2048, enable_thinking True, 4 parallel requests | screen 3:25, log 5:26 |
| Columns | reasoning_trace (dropped), output_with_reasoning (kept) | speech 4:00, screen 4:45 |
| Records | 1,000 (speech 5:06, run settings 5:06, dataset 6:05); progress box Total 100 per batch, batch 3/10 (author reading) | 5:06, 6:05, 5:26 |
| Generation rate | 0.56-0.64 rec/s | log 5:26 |
| Method | QLoRA (4-bit) | screen 6:35 |
| lr / rank / alpha / dropout | 1e-4 / 16 / 32 / 0.00 | screen 6:35 |
| batch / steps / context | 10 / 100 / 2,048 | speech 6:31, screen 6:35 |
| Train time | about 1 min; 0m 56s at step 83; 1.46 steps/s | speech 7:08, screen 7:05 |
| Export | GGUF Q4_K_M via llama.cpp | screen 7:50 |

## Comparisons

- Before vs after (demo 0:32-0:52): base `OLMo-2-0425-1B-Instruct` answers briefly; LoRA version takes a bit longer and explains its reasoning.
- Export methods: Merged Model (16-bit, ready for inference) vs LoRA Only (~100 MB, needs base) vs GGUF / Llama.cpp (quantized, local runners). Author verdict: GGUF for local use as in the clip; also keep LoRA Only for further experiments (small, quantization-independent).

## Fact Check

Checked 2026-10-19 by a separate agent: 19 claims, confirmed 15 · partly 4 · not found 0 · contradicted 0.
Partly: (3) "any NVIDIA GPU" (needs CUDA CC >= 7.0; docs now also list AMD/Intel/Mac); (15) AI Assist button not found in the Studio docs or the DataCamp tutorial checked (but visible on screen as Beta); (16) alpha 32 is already the current documented default, lr 1e-4 is a real change from 2e-4; (17) "one epoch" holds only with grad_accum 1 (default 8), and the screen confirms Epoch 0.83 at step 83 in this run.
Confirmed highlights: Studio launched 2026-03-17 (beta, 500+ models); Data Recipes are powered by NeMo Data Designer; `drop` columns are still generated; Expression columns are Jinja2 without an LLM call; QLoRA is the lowest-VRAM option; metrics include loss, LR, grad norm plus GPU stats; GGUF conversion uses llama.cpp and q4_k_m / q5_k_m are "Recommended". Not checkable: the 2048 max tokens, 1,000 records and "about 1 minute" are the presenter's own settings.

## Open Questions & Extension Ideas

- Author note (ZVect, WIP202610050 LLM manual - "fine-tune a small task-specific model"): this clip is a ready recipe for that manual chapter: (a) choose the target answer style, (b) generate it with a bigger model, (c) QLoRA a 1B model, (d) export GGUF. Use the exact settings table above as the worked example; add the epoch formula with grad_accum and the held-out evaluation step the clip skips.
- Author note (ZVect ch. 3 tokens/BPE): `<think>`/`</think>` are special tokens; context length 2,048 and max_tokens 2048 are token budgets. A lesson can show how a training row becomes tokens and why a long reasoning trace eats the context window (261,201 tokens over 83 steps = about 3,150 tokens per step, about 315 per row at batch 10 - author arithmetic).
- Author note (ZVect ch. 8 LLM input + attention): the User/Assistant column mapping is the chat template; show how instruction and output_with_reasoning are wrapped into one input sequence, and that loss is typically on the assistant part.
- Author note (ZVect ch. 9 Transformer): LoRA rank 16 / alpha 32 adds low-rank B·A to frozen weight matrices; QLoRA keeps the base in 4-bit. A `shapes` figure (W + B·A) and the parameter count of r=16 adapters versus the full matrix would make this concrete.
- Author note (ZVect ch. 2 / ch. 4 / ch. 7): no direct vector-search content in this clip; it fits after ch. 9 as "changing model behaviour" rather than retrieval. A possible bridge: the same distillation idea is used to train small embedding models or rerankers from a large teacher's scores (not covered by the clip).
- Open: batch size and gradient accumulation are never shown on screen (checked frames 6:36, 6:40, 6:44); only the spoken batch size 10 and the on-screen epoch counter constrain them.
- Slide "Distillation Workflow" (2:15) in full: box "Synthetic Data Generation" (Seed Dataset (unsloth/alpaca-cleaned) -> Generation Prompts -> Larger Teacher Model (Nemotron-3 Nano)) feeding box "Training" (Augmented Training Dataset -> LoRA Fine-tuning -> Smaller Student Model (OLMO-2 1B)). A good one-figure summary for a lesson.
- Open: the exported checkpoint shows loss 1.0328 while the progress panel shows 1.2249 at step 83; the clip does not explain which step the checkpoint is from, why it was chosen, or whether both are the same run (per-step loss fluctuates down to about 0.88 on the chart). The real GGUF file size after export is not shown.
- Open: why GPU Monitor shows 0% utilisation and 0.58 GB VRAM mid-training (likely a stale reading).

## Tags & Triggers

Unsloth, Unsloth Studio, fine-tuning, QLoRA, LoRA, distillation, synthetic data, NeMo Data Designer, Nemotron-3 Nano, OLMo 2, llama.cpp, GGUF, quantization, Jinja2, epoch arithmetic, gradient accumulation.
Triggers: "fine-tune a small model locally without code", "teacher-student synthetic data in Unsloth Studio", "how many epochs is batch x steps", "which GGUF quantization to export", "VRAM needed for QLoRA 1B and a local teacher".

## References

- Source: NVIDIA Developer, "Get Started with Unsloth Studio: Generate Data & Fine-Tune LLMs Locally on any NVIDIA GPU", YouTube, 8:18, 2026-03-17, https://www.youtube.com/watch?v=mmbkP8NARH4
- Description links: https://unsloth.ai/docs/new/studio/ ; https://github.com/NVIDIA-NeMo/DataDesigner ; https://developer.nvidia.com/nemotron ; https://developer.nvidia.com/ai-apps-for-rtx-pcs
- Fact-check sources: https://unsloth.ai/docs/new/studio.md ; https://www.unsloth.ai/docs/new/studio/start ; https://unsloth.ai/docs/new/studio/data-recipe.md ; https://unsloth.ai/docs/get-started/fine-tuning-for-beginners/unsloth-requirements.md ; https://unsloth.ai/docs/models/nemotron-3 ; https://unsloth.ai/docs/basics/inference-and-deployment/saving-to-gguf ; https://blogs.nvidia.com/blog/rtx-ai-garage-gtc-2026-nemoclaw ; https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16 ; https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3-nano-30b-a3b ; https://arxiv.org/html/2512.20848v1 ; https://docs.nvidia.com/nemo/datadesigner/concepts/columns ; https://docs.nvidia.com/nemo/datadesigner/concepts/models/model-providers.md ; https://meta-pytorch.org/torchtune/0.2/generated/torchtune.datasets.alpaca_cleaned_dataset.html ; https://www.datacamp.com/zh/tutorial/unsloth-studio-fine-tuning-llms-guide (secondary)

## Equations (LaTeX)
1. $$ \text{epochs}=\frac{B\times S}{N}=\frac{10\times 100}{1000}=1 $$
2. $$ \text{epochs}=\frac{B\times G\times S}{N} $$
