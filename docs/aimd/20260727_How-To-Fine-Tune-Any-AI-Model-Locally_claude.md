# How to Fine-Tune any AI Model Locally (FULL Tutorial) — Tech With Tim - Claude Context
> Source: YouTube, Tech With Tim, "How to Fine-Tune any AI Model Locally (FULL Tutorial)", 41:06, published 2026-07-27 · https://www.youtube.com/watch?v=4JofSJIrjwU · Generated: 2026-10-13
> Companion: 20260727_How-To-Fine-Tune-Any-AI-Model-Locally.html (Thai, iw mode `iwd`, 15 sections, 9 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite, complete, with fact-check against Unsloth docs and research papers (standard YouTube license; manual en-CA captions).
- Frames used: 01_what-is-fine-tuning, 02_lora, 03_qlora, 04_fine-tuning-vs-rag, 05_training-data, 06_recipe-graph, 07_training-loss, 08_compare-chat, 09_export.
- Own SVG diagrams: flow, bars.
- Transcript SHA-256 (in-page = decoded): `a62b03fb58648d7220c18016f3910c0bb2a03b7cb3f0c2d7be490c6add53a8e1`; kept in the session workspace only.

## TL;DR
Tech With Tim walks through fine-tuning an open LLM locally with **Unsloth Studio** (a free, open-source, offline web UI on top of the Unsloth library, beta since 2026-03-17). The theory part: fine-tuning = keep a base model and train on your own examples; **LoRA** freezes the base and trains small adapters (speaker: "less than 1%"); **QLoRA** stores the frozen base in 4-bit (16 GB → ~5–7 GB for 8B) and is his recommendation; fine-tuning changes weights while RAG injects fresh data into the prompt. The demo: install (one command, `localhost:8888`), pick `unsloth/llama-3.1-8b-instruct-unsloth-bnb-4bit` (~6 GB, "fine-tune ready", never GGUF), build an Indonesian-tutor dataset that only uses the ~300 words Tim knows (3,000-row JSONL made by Claude; also shown: Studio's Recipe builder), map columns (instruction → system, input → user, output → assistant), train QLoRA for 1 epoch with defaults, watch the loss, compare with the base model, export (GGUF / 16-bit merged / LoRA only).
Fact-check (15 claims: 4 confirmed, 9 partly, 2 contradicted): Unsloth is not built by NVIDIA engineers (founders Daniel & Michael Han; Data Recipes uses NVIDIA NeMo Data Designer); Unsloth's QLoRA VRAM minimums are ~1.7–2.4× lower than the video's figures (8B: 6 GB vs ~10 GB on the slide), while its LoRA 16-bit figure is slightly higher (22 vs ~20 GB); Unsloth's own docs call a loss near 0 / below 0.2 likely overfitting, while the checkpoint selected on the Export page (run indo_training) had 0.0582; the fine-tuned model's "alone = sama" is wrong (alone = sendiri / sendirian); the base model's answer listed "sendiriri" (typo), "tersendiri" (separate) and the correct "sendirian"; independent research finds RAG better than unsupervised fine-tuning for new knowledge (Ovadia 2023) and that new facts learned via fine-tuning are learned slowly and increase hallucination (Gekhman 2024).

## Key Concepts
- **Fine-tuning:** start from a model that already handles language; train on your examples so outputs match your domain, tone and format. Speaker: "rather than building our own LLM from scratch".
- **LoRA:** base weights frozen; output = frozen model output + adapter correction (A "shrink", B "grow back" on the slide). Only the adapters are trained, so the GPU keeps gradients for ~1% of weights and the base cannot be damaged. Author arithmetic: rank 16 on all linear layers of Llama-3.1-8B (32 layers; q, k, v, o, gate, up, down) = 1,310,720 params per layer → 41,943,040 ≈ 0.52% of 8.03B ≈ 84 MB in 16-bit (matches the "~100 MB" LoRA-only export).
- **QLoRA:** same adapters (16-bit), frozen base quantized to 4-bit NF4. Slide: 8B weights ~16 GB → ~5 GB; VRAM for an 8B fine-tune LoRA 16-bit ~20 GB vs QLoRA ~10 GB "same quality"; Studio default. Speaker: precision decreases slightly but "we'll end up getting a better output actually, because we have more room to train the adapter layers" (his claim). Author arithmetic: 16-bit 8.03B ≈ 16.06 GB; all-4-bit would be ~4 GB, but embedding + LM head (128,256 × 4,096 each ≈ 1.05 GB in 16-bit) usually stay 16-bit → ~5.6 GB; the actual repo is 5.98 GB (dynamic 4-bit keeps some layers higher precision).
- **Fine-tuning vs RAG (speaker):** "fine-tuning cannot teach new information" is a common misconception; RAG retrieves up-to-date data into the prompt; fine-tuning adjusts weights so replies change without prompt changes. Slide adds: RAG still fits hourly-changing data (news, inventory, live tickets) and answers needing citations; serious systems use both.
- **Hardware (speech):** technically anything works but slower; Windows: modern NVIDIA ideally ≥ 12 GB VRAM; Mac: modern M-series, as much unified memory as possible (24/32/64 GB, M3/M4/M5 Pro/Max "pretty good"); low-end: free Colab notebook from Unsloth. Slide: RTX 30/40/50 12 GB → 7–8B QLoRA, 24 GB much bigger; Mac Chat + Data Recipes fully, training via MLX (beta); Colab T4; **CPU-only: Chat + Recipes, no training**.
- **Model choice:** GGUF cannot be fine-tuned (inference format) — need safetensors (the caption also says "MLK", probably MLX — author guess). Speaker's VRAM guide: 6 GB → probably 3–4B, 10 GB → 7–8B ("sweet spot"), 16–20 GB → 12–14B, more → 27/35/70B (rarely worth fine-tuning "in most cases"). Filter Hub by "fine-tune ready"; prefer Instruct over base; prefer a pre-quantized bnb-4bit variant.
- **Dataset:** columns instruction / input (optional, improves results) / output = example conversations. Speaker: 300–1,000 rows shift tone and format; 5,000–15,000 teach a real skill; "a few hundred or a few thousand" is enough. He first says he will use 1,100 rows; the dataset actually used has 3,000 rows.
- **Recipes (Studio's synthetic-data builder):** node graph — seed source (CSV/JSON, GitHub repo, HF dataset, PDF parsed to rows) → generated Category field with weights → Formula (instruction text) → model provider (local model, or OpenAI/Anthropic endpoint + API key) → model config (model, temperature) → AI Structured Data node with a prompt + JSON schema output. Check → test run (2 rows) → full run (N rows, batching/throughput/retries).
- **Training signals:** loss (main graph; should fall), learning rate (speaker: gradually decreases; screen shows a warm-up first), gradient norm ("don't worry too much"). Speaker: loss below 1 "typically" means fairly well "at least as it's evaluating itself in the training".

## Implementation
**Studio workflow as demonstrated (values from speech and screen):**
1. Install: macOS/Linux/WSL `curl -fsSL https://unsloth.ai/install.sh | sh`; Windows PowerShell `irm https://unsloth.ai/install.ps1 | iex` (commands from Unsloth docs, fact-check). Answer `y` to launch, open `http://localhost:8888` (docs: `http://127.0.0.1:8888`), keep the terminal open.
2. Hub → filter "fine-tune ready" → download `unsloth/llama-3.1-8b-instruct-unsloth-bnb-4bit` (5.98 GB). Smoke-test it in Chat ("hello world").
3. Dataset: Alpaca-style JSONL, one object per line:
   ```json
   {"instruction": "You are Kartu, Tim's personal Indonesian tutor. Speak simple Indonesian using only vocabulary Tim already knows.", "input": "How do you say brush teeth in Indonesian?", "output": "..."}
   ```
   (instruction text as seen on screen, truncated there; the `input` is the test-run example the speaker read out; output elided.) Tim's dataset: 3,000 rows generated by Claude from ~300 known words; seed CSV for the recipe: 276 rows, columns Indonesian, English, category, example, example English.
4. Recipe (optional): `vocab_seed.csv` → `task_type` Category (translate_en2id, chat, meaning_id2en, quiz, new_word, correction, daily practice; weights e.g. 27% / 23% chat / 5% correction) → `instruction` Formula (str) → provider `local_model` + `model_1` (llama-3.1-8b, temperature 0.7) → `make_row` AI Structured Data with hard rules (every Indonesian word from the known list; English unrestricted; `new_word` rows use exactly one word from a new-words pool; per-type instructions; "short and friendly"; full known-word list) and output schema `{input: string, output: string}` (both required). Test run 2 rows; full run 50 rows ≈ 332 s estimate on a local model, progress polled every 5 rows. Speaker: split `make_row` into two columns so roles map cleanly; Claude-generated data gave him better results.
5. Train tab: model as above, method QLoRA, dataset local/HF/upload; column roles instruction → system, input → user, output → assistant (AI assistant can auto-map).
6. Parameters on screen: epochs 1 (speaker: start with 1; "standard best practice" 3 with a lot of data), context length 2048, learning rate 0.0002 (UI hint: 2e-4 LoRA, 5e-5 CPT, 2e-5 full fine-tune), LoRA rank 16, alpha 16, dropout 0.00. Beginners: leave everything but epochs.
7. During training (screen ~37:20): loss 0.1468, LR 1.74e-4, grad norm 0.263, VRAM 16.77 / 23.99 GiB, power 298 / 500 W, 0.69 steps/s, ETA 7m48s, 61,337 tokens; step 11 loss 0.7224 (smoothed 1.086); Eval Loss panel "Evaluation not configured".
8. Compare: load the fine-tuned model (On device) → + → More → Compare chat; screen shows temperature 1.5.
9. Export page (screen; the export itself is not performed on camera): training run indo_training, 39 checkpoints, chosen checkpoint loss 0.0582, LoRA rank 16; methods Merged Model (16-bit), LoRA Only (~100 MB, needs base), GGUF / llama.cpp (e.g. Q4_K_M ~4.6 GB recommended, Q8_0 ~8.2 GB, BF16/F16 ~15 GB, optional imatrix); push to Hugging Face.

**Equivalent with the Unsloth Python library (author, general knowledge — not shown in the video; check the current API before use):**
```python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

model, tok = FastLanguageModel.from_pretrained(
    "unsloth/Llama-3.1-8B-Instruct-unsloth-bnb-4bit", max_seq_length=2048, load_in_4bit=True)
model = FastLanguageModel.get_peft_model(
    model, r=16, lora_alpha=16, lora_dropout=0,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"])

ds = load_dataset("json", data_files="tutor.jsonl", split="train").train_test_split(test_size=0.05, seed=0)
def to_chat(r):  # instruction -> system, input -> user, output -> assistant (the video's role mapping)
    msgs = [{"role": "system", "content": r["instruction"]},
            {"role": "user", "content": r["input"]},
            {"role": "assistant", "content": r["output"]}]
    return {"text": tok.apply_chat_template(msgs, tokenize=False)}
ds = ds.map(to_chat)

trainer = SFTTrainer(model=model, tokenizer=tok, train_dataset=ds["train"], eval_dataset=ds["test"],
    args=SFTConfig(num_train_epochs=1, learning_rate=2e-4, per_device_train_batch_size=2,
                   gradient_accumulation_steps=4, warmup_steps=5, eval_strategy="steps", eval_steps=10,
                   logging_steps=1, output_dir="out", dataset_text_field="text"))
trainer.train()            # watch train AND eval loss; Unsloth docs: ~0.5-1.0 good, < 0.2 likely overfitting
model.save_pretrained_gguf("tutor-gguf", tok, quantization_method="q4_k_m")   # for Ollama / llama.cpp
```
**Vocabulary gate for the generated data (author):** reject rows whose Indonesian tokens are not in the known list (except one allowed word for `new_word` rows) before training — the video does not show any validation of the 3,000 Claude rows.
```python
import json, re
known = {w.lower() for w in open("known_words.txt", encoding="utf-8").read().split()}
def bad_words(text):
    return [w for w in re.findall(r"[a-zA-Z]+", text.lower()) if w not in known]
# apply to the Indonesian side only (English is unrestricted in the video's rules); review flagged rows by hand
```

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Tool | Unsloth Studio — free, open source, no account, offline, local web UI | 1:24–2:36 |
| Recommended method | QLoRA (4-bit base + LoRA adapters) | 4:08 |
| Adapter size | speaker "< 1%"; author: r16 on Llama-3.1-8B ≈ 41.9M params ≈ 0.52% ≈ 84 MB | 3:10 |
| 8B base size | 16-bit ~16 GB → 4-bit "5, 6, 7 GB" (slide ~5 GB); repo 5.98 GB | 4:30 |
| VRAM 8B (slide) | LoRA 16-bit ~20 GB, QLoRA ~10 GB; Unsloth table: 22 GB / 6 GB | 4:20 |
| Hardware | NVIDIA ≥ 12 GB VRAM; Mac M-series max unified memory; Colab T4; CPU = no training (slide) | 7:51–8:46 |
| Launch | one-line install; `localhost:8888`; keep terminal open | 9:17–10:48 |
| Model format | safetensors; GGUF not trainable | 11:20 |
| Size by VRAM (speaker) | 6 GB → 3–4B; 10 GB → 7–8B; 16–20 GB → 12–14B | 11:50 |
| Demo model | `unsloth/llama-3.1-8b-instruct-unsloth-bnb-4bit` | 12:51 |
| Dataset | instruction / input (optional) / output; 300–1k rows tone/format; 5k–15k skill | 15:00–16:24 |
| Tim's data | 3,000-row JSONL by Claude; seed 276 rows × 5 columns | 18:06, 21:37 |
| Recipe run | test 2 rows; full 50 rows ≈ 332 s (local model); progress every 5 rows | 28:58–31:35 |
| Column roles | instruction = system, input = user, output = assistant | 33:36 |
| Hyperparameters (screen) | 1 epoch, ctx 2048, LR 2e-4, r 16, alpha 16, dropout 0 | 35:40 |
| Training (screen) | loss 0.1468, VRAM 16.77/23.99 GiB, 0.69 steps/s | 37:20 |
| Export | GGUF (Ollama), merged 16-bit, LoRA only, push to HF; checkpoint loss 0.0582 | 40:22–40:45 |

## Comparisons
| Approach | What it does | Changes the model | Fits |
|---|---|---|---|
| Prompting | instructions every time | no | things a few lines can specify (author) |
| RAG | retrieves fresh data into the prompt | no (context at inference) | hourly-changing data, cited answers (slide) |
| Fine-tuning | adjusts weights via adapters | yes | tone, format, behaviour, stable knowledge |

| | LoRA | QLoRA |
|---|---|---|
| Frozen base | 16-bit | 4-bit NF4 |
| Adapters | 16-bit | 16-bit |
| VRAM 8B | slide ~20 GB / Unsloth 22 GB | slide ~10 GB / Unsloth 6 GB |
| Quality | reference | slide "same quality"; speaker "slightly less precision" but possibly better overall output (more room to train adapters); QLoRA paper: preserves 16-bit fine-tuning performance |

Scenario verdict (author): 12–24 GB GPU and a 7–8B model → QLoRA; style/format/behaviour → fine-tuning; volatile or citable facts → RAG; production → both.

## Fact Check
| # | Claim | Verdict | Detail | Source |
|---|---|---|---|---|
| 1 | Studio free, OSS, no account, offline, GUI over Unsloth | confirmed | core Apache 2.0, Studio UI AGPL-3.0; local admin password; Beta 2026-03-17 | unsloth.ai/docs; Unsloth blog |
| 2 | "I believe" built/maintained by NVIDIA engineers | contradicted | founders Daniel & Michael Han (YC S24); Daniel ex-NVIDIA 2018–2020; Data Recipes on NVIDIA NeMo Data Designer; NVIDIA thanked as partner | YC; unsloth docs |
| 3 | LoRA frozen base, adapters < 1% | partly | Unsloth "optimize 1% of weights"; author ≈ 0.52% at r16, ≈ 1.04% at r32 (depends on rank and target layers) | arXiv 2106.09685 |
| 4 | QLoRA NF4, 16 → ~5 GB, VRAM ~20 → ~10 GB "same quality" | partly | paper: preserves 16-bit performance; Unsloth table 22 / 6 GB; repo 5.98 GB | arXiv 2305.14314; Unsloth requirements |
| 5 | fine-tuning can add knowledge; "all of RAG" (slide) | partly | Unsloth: "mostly everything RAG can"; Ovadia 2023: RAG consistently better for existing and new knowledge vs unsupervised FT; Gekhman 2024: new facts learned slower, raise hallucination | Unsloth FAQ; arXiv 2312.05934; arXiv 2405.05904 |
| 6 | 12 GB NVIDIA; Mac MLX; Colab T4; CPU no training | partly | matches docs; Mac training works now ("coming soon" at launch); CPU = Chat (GGUF) + Recipes | Studio install docs |
| 7 | one-line install, port 8888 | confirmed | commands above; 127.0.0.1:8888 | Studio install docs |
| 8 | GGUF untrainable; pick Instruct | partly | GGUF "inference only"; Unsloth: < 300 rows instruct, 300–1,000 either, > 1,000 base | Unsloth docs |
| 9 | 3–4B ≈ 6, 7–8B ≈ 10, 12–14B ≈ 16–20 GB | partly | Unsloth QLoRA minimums 3B 3.5, 7B 5, 8B 6, 14B 8.5 GB (video ~1.7–2.4× higher) | Unsloth requirements |
| 10 | demo model ≈ 6 GB | confirmed | 5.98 GB; dynamic 4-bit | Hugging Face |
| 11 | 300–1k tone, 5k–10k+ skill | partly | Unsloth: min 100, > 1,000 preferable; tiers not in docs; Alpaca/ShareGPT/ChatML | Unsloth datasets guide |
| 12 | 1 epoch start, 3 standard; LR 2e-4; r16 α16 dropout 0 | partly | 1–3 epochs; LR 2e-4; Studio docs defaults epochs 3, α 32, dropout 0.05 | Unsloth LoRA guide; Studio docs |
| 13 | loss < 1 ≈ performing fairly well | partly | 0.5–1.0 good; near 0 / < 0.2 likely overfitting → Export-page checkpoint 0.0582 | Unsloth guides |
| 14 | export options, LoRA ~100 MB | confirmed | Studio export docs | Studio export docs |
| 15 | fine-tuned "alone = sama … (He goes alone)" | contradicted | sama = with/same; alone = sendiri(an); base model's answer included the correct "sendirian" (plus typo "sendiriri" and "tersendiri") | Wiktionary; KBBI |

## Open Questions & Extension Ideas
- The demo never evaluates on held-out data (Eval Loss empty) and judges quality by three prompts at temperature 1.5; the one checkable answer ("alone") is wrong. A held-out set with known answers, scored by a speaker of the language, would show whether the style gain cost accuracy.
- The loss fell below 0.2 (0.1468 on screen, 0.0582 for the checkpoint on the Export page) — overfitting by Unsloth's own rule. Try fewer steps, a lower LR, or more varied data and compare.
- Restricting outputs to a known vocabulary forces substitutions when the right word is missing ("sama" for "alone"); an "allowed new word" fallback or a dictionary check in the recipe could reduce this (author idea).
- Measured VRAM (16.77 GiB) is far above the slide's ~10 GB and Unsloth's 6 GB minimum; the video does not say why (context length, batch size, reserved memory?).
- Docs say instruct for < 300 rows but base for > 1,000; with 3,000 rows a base-model run would be a useful comparison.
- For ZVect: this pairs with the RAG / vector-search chapters as "when not to use RAG" material, and the LoRA arithmetic (0.52%) and 4-bit memory arithmetic are good worked numbers for a future lesson (author idea).

## Tags & Triggers
tags: fine-tuning, lora, qlora, quantization, 4-bit, nf4, unsloth, unsloth-studio, llama-3-1, synthetic-data, data-recipes, instruction-tuning, alpaca-format, epochs, learning-rate, training-loss, overfitting, gguf, ollama, rag-vs-fine-tuning, vram, local-llm, fact-checked
- how to fine-tune an LLM locally / with a GUI
- LoRA vs QLoRA, how much VRAM for an 8B model
- what columns and how many rows a fine-tuning dataset needs
- fine-tuning vs RAG
- what training loss is good vs overfitting
- export a fine-tuned model to GGUF / Ollama

## References
- Tech With Tim, "How to Fine-Tune any AI Model Locally (FULL Tutorial)", YouTube, 2026-07-27 — https://www.youtube.com/watch?v=4JofSJIrjwU
- Unsloth docs — https://unsloth.ai/docs (Studio: /get-started/unsloth-studio, /new/studio/install, /new/studio/start, /new/studio/export; requirements: /get-started/fine-tuning-for-beginners/unsloth-requirements; FAQ: /get-started/fine-tuning-for-beginners/faq-+-is-fine-tuning-right-for-me; guides: /get-started/fine-tuning-llms-guide, …/lora-hyperparameters-guide, …/what-model-should-i-use; datasets: /basics/datasets-guide)
- Introducing Unsloth Studio — https://unslothai.substack.com/p/introducing-unsloth-studio
- GitHub unslothai/unsloth — https://github.com/unslothai/unsloth
- Y Combinator, Unsloth AI — https://www.ycombinator.com/companies/unsloth-ai/jobs
- Hugging Face, unsloth/Llama-3.1-8B-Instruct-unsloth-bnb-4bit — https://huggingface.co/unsloth/Llama-3.1-8B-Instruct-unsloth-bnb-4bit
- Hu et al., LoRA (2021) — https://arxiv.org/abs/2106.09685
- Dettmers et al., QLoRA (2023) — https://arxiv.org/abs/2305.14314
- Ovadia et al., Fine-Tuning or Retrieval? (2023) — https://arxiv.org/abs/2312.05934
- Gekhman et al., Does Fine-Tuning LLMs on New Knowledge Encourage Hallucinations? (2024) — https://arxiv.org/abs/2405.05904
- Wiktionary, sama — https://www.wiktionary.com/wiki/sama ; KBBI, olahraga — https://kbbi.web.id/olahraga
