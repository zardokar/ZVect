# "I Made The Smallest (And Dumbest) LLM" - Claude Context
> Source: YouTube, Codeically, "I Made The Smallest (And Dumbest) LLM", 5:51, published 2025-09-04 · https://www.youtube.com/watch?v=a7TOameRqoY · Generated: 2026-10-24
> Companion: 20250904_I-Made-The-Smallest-And-Dumbest-LLM.html (Thai, iw mode `iwd`, 4 sections, 13 frames + 7 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license), every point and number kept.
- Frames used: P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13.
- Own SVG diagrams: flow, bars, compare, bars, flow, compare, bars.
- Transcript SHA-256 (in-page = decoded): `453f8acfaafe735634cb638f844a4c1c4ff2e25f9aa530e4148c48abad770b5b`; kept in the session workspace only.

## TL;DR

- A comedic 5:51 clip (Codeically): frontier open-weight LLMs are free to download but, per the creator, need "half a million in hardware" to run; shrunk versions "sometimes" cut hardware by 90% yet still need a $30,000 GPU, and small 7B / 1.5B models are frustrating to talk to.
- Quantization = storing each weight with fewer bits. FP16 = 16 bits per weight, so a 7B model is "roughly 14 GB" of VRAM and does not fit an 8 GB card. FP8 steps in chunks of 0.125, 4-bit makes everything an integer, 1-bit (BitNet b1.58) is still research.
- Experiment: scrape Twitch quotes + copypastas, merge to `merged.txt`, tokenize for GPT-2 (pad = eos, max_length 128), fine-tune, and run a quantized build with llama.cpp (the clip does not show the quantizing step or its order; at 2:34 the creator says he will fine-tune after "butchering" the weights). Result: 63.66 MB file, 78 tokens/s CPU-only, but it hallucinates and cannot answer 1 + 1.
- Fact check (7 rows): 3 confirmed, 3 partly, 1 not found, 0 contradicted. Key corrections: the clip names no baseline for FP8's "75% saving"; it holds only vs FP32 (vs FP16 it is 50%); the 0.125 step holds only in [1, 2).

## Key Concepts

- **Weight memory**: `M = N * b / 8` bytes (N parameters, b bits per weight). 7e9 * 16 / 8 = 14e9 bytes ~ 14 GB (on screen at 1:32). Author-computed for the same 7B: FP8 7 GB, 4-bit 3.5 GB, 1-bit 0.875 GB (weights only, no KV cache).
- **Distinct values**: `V = 2^b`. Screen at 2:23: fp16 65536 values (step shown as 0.001), fp8 256 values (step 0.125), int4 16 values (step 1). Halving bits halves size but cuts representable values exponentially.
- **Bit layouts** (screen 1:22): fp16 = 1 sign + 5 exponent + 10(+1) significand; bfloat16 = 1 + 8 + 7(+1) -> wider range, less precision.
- **FP8 formats** (screen 2:55): E4M3 bias 7, max normal 1.75 * 2^8 = 448, min subnormal 2^-9, no infinities; E5M2 bias 15, max normal 1.75 * 2^15 = 57,344, min subnormal 2^-16.
- **INT4** (screen 2:07): 2^4 = 16 values; signed -8..7, unsigned 0..15; 8x smaller than FP32; more error than INT8 (256 levels); GPTQ / AWQ often needed.
- **1-bit**: "The Era of 1-bit LLMs" (arXiv:2402.17764), BitNet b1.58, ternary weights {-1, 0, 1}; the creator says it is still research and did not try it.
- **Offloading**: swapping weights between VRAM and system RAM so a model runs on a smaller GPU; the creator calls it workable but painfully slow.
- **Bits per weight of the final file** (fact check B07): `q = 8 * S / N` = 8 * 63.66e6 / 124e6 ~ 4.1 bits -> consistent with a ~4-bit GGUF, not 1-bit.

## Implementation

Pipeline shown in the clip (screens 3:22-4:38), with author additions marked (author).

1. Data: `shitpostScraper.py` uses `requests` + `BeautifulSoup` on `https://www.twitchquotes.com/copypastas/labels/classic?page={}` for pages 1-18 (`range(1, 19)`), collecting title, text, likes, date, tags into `shitposts.txt`. A `shrek.txt` file also appears in the Colab file list.
2. Merge: loop over the source files, append each to `merged.txt` separated by blank lines, print a warning on `FileNotFoundError`.
3. Tokenize (as on screen):

```python
from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from datasets import load_dataset

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token

dataset = load_dataset('text', data_files='merged.txt')
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding=True, max_length=128)
```

   The creator maps this over the dataset with parallel processing. Training arguments are not shown.
4. Fine-tune GPT-2 (`Trainer` imported); a quantized build is run with llama.cpp (compiling was "a lot of trouble"; a 235B-parameter LLM helped). Author: the clip does not say llama.cpp did the quantizing, which format was used, or whether quantizing came before or after fine-tuning; the file size suggests ~4 bits.
5. Run (screen 4:38): `n_threads = 1`, warning "model was trained on only 1024 context tokens (4096 specified)", sampler `top_k = 40`, `top_p = 0.950`, `min_p = 0.050`, `n_predict = 100`. Timings: prompt eval 13.67 ms/token (73.14 tok/s, 4 tokens), eval 20.81 ms/token (48.06 tok/s, 99 runs), total 2172.12 ms / 103 tokens. The creator later states 78 tok/s (author: likely another run).
6. Results: run 1 had half the weights manually zeroed (when and why not stated) -> random words; run 2 without zeroing -> one meaningful sentence about quantum physics, then a hallucination about nitromethane; 63.66 MB; 1 + 1 fails.

Author steps for an LLM / ZVect workflow:

- Gate every model choice with `N * b / 8` plus a separate runtime budget (KV cache, batch). Budget the embedder / reranker and the generator separately in a RAG stack.
- Fine-tune first, quantize second (author recommendation; the clip does not show its order); keep bf16 for training, drop to 8 / 4 bits for serving.
- Before training: measure the share of samples truncated at 128 tokens (GPT-2 allows 1,024); when `pad_token = eos_token`, set padded labels to -100 / rely on the attention mask so the model does not learn to spam EOS; hold out a test split and deduplicate scraped text.
- Build a tiny exact-answer eval set (e.g. "1 + 1 =") and run it on base, fine-tuned, and quantized models to localize the damage; report prompt-eval and eval tok/s separately with thread count.
- If pruning (zeroing weights), retrain and re-evaluate. The creator only says manually zeroing half the weights "was not the best of ideas"; the clip does not say whether it happened before or after training.
- For vector search: the same arithmetic applies to embedding indexes (int8 / binary vectors); measure recall@k against FP32 vectors before adopting.

## Quick Reference

| Item | Value | Where |
|---|---|---|
| Hardware for frontier open models | "half a million" (checked: 8xH200 est. $290k-$470k) | 0:21, B01 |
| Shrunk models | "sometimes" -90% hardware, still a $30,000 GPU (hyperbole) | 0:39, B02 |
| deepseek-r1 sizes (Ollama) | 1.5b 1.1GB, 7b 4.7GB, 8b 5.2GB, 14b 9.0GB, 32b 20GB, 70b 43GB, 671b 404GB (Q4_K_M) | screen 0:11, 0:31 |
| Small models named | 7B or 1.5B parameters | 0:56 |
| FP16 | 16 bits = 2 bytes per weight | 1:20 |
| 7B in FP16 | roughly 14 GB VRAM | 1:33, B03 |
| Values per format | fp16 65536, fp8 256, int4 16 | screen 2:23 |
| FP8 saving | 75% per clip (holds only vs FP32, per check); 50% vs FP16 | 3:01, B05 |
| GPT-2 prep | pad = eos, truncation, padding, max_length 128 | screen 3:43 |
| Final model | 63.66 MB, ~4.1 bits/weight, GPT-2 124M | 4:53, B07 |
| Speed | 78 tok/s CPU-only (spoken); 48.06 tok/s eval on screen, 1 thread | 4:57, screen 4:38 |

## Comparisons

| Option | Memory (7B weights) | Precision | Clip's verdict |
|---|---|---|---|
| FP16 | 14 GB | fine steps (screen: 0.001) | baseline, too big for 8 GB |
| FP8 | 7 GB (author) | step 0.125 in [1, 2) | "most sane people stop" here; drop "isn't that bad" |
| 4-bit (INT4) | 3.5 GB (author) | integers x scale, 16 values | "Mona Lisa with a paint roller" |
| 1-bit / 1.58-bit | 0.875 GB (author, 1 bit) | ternary {-1, 0, 1} | still research, not tried |
| Offloading | any | unchanged | works but painfully slow |
| Smaller model (7B / 1.5B) | small | unchanged | frustrating to talk to |

Scenario verdict (author): for serving a mid-size model on a consumer GPU, FP8 / 8-bit is the safe default; go to 4-bit only with an eval set and a quantizer such as GPTQ / AWQ or llama.cpp K-quants; a 124M model at ~4 bits is a speed demo, not a usable assistant.

## Fact Check

| ID | Claim | Verdict | Detail |
|---|---|---|---|
| B01 | "Half a million in hardware" | confirmed | 8xH200 for DeepSeek-R1 671B est. $290,000-$470,000; 8xH100 $200,000-$500,000; rounded top of range. |
| B02 | -90% hardware, still a $30,000 GPU | partly | H100 is $25,000-$40,000, but a 4-bit 671B needs ~400 GB VRAM (8xH100), closer to -50%; distilled 7B-14B run on $2,500-$12,800 consumer hardware. |
| B03 | FP16, 7B ~ 14 GB | confirmed | 7e9 x 2 bytes = 14 GB. |
| B04 | FP8 chunks of 0.125; 4-bit all integers | partly | E4M3 step 2^-3 = 0.125 only in [1, 2), doubles per power of two; integers hold for INT4 (`w = q x block_scale`), not FP4 E2M1 (has 0.5, 1.5). |
| B05 | FP8 saves 75% | partly | 75% vs FP32; 50% vs the clip's FP16 baseline. |
| B06 | GPT-2 from HF, pad token, max length 128, llama.cpp | confirmed | GPT-2 has no pad token (fix: `pad_token = eos_token`); 128 < 1,024 context; GPT-2 is a supported GGUF arch. |
| B07 | 63.66 MB at 78 tok/s CPU-only | not found | Creator's own measurement; size implies ~4.1 bits/weight for 124M params (Q4_K 4.5 bpw, Q3_K 3.44 bpw). |

Totals: 3 confirmed, 3 partly, 1 not found, 0 contradicted. Checked 2026-10-24.

## Open Questions & Extension Ideas

- Which effect broke the model most: GPT-2's size, the joke training data, quantization level, or the zeroed weights? Rerun a 2x2 (base vs fine-tuned) x (FP16 vs Q4) grid on the same exact-answer eval set.
- Which llama.cpp quant type produced 63.66 MB? Sweep Q8_0 / Q5_K / Q4_K / Q3_K / Q2_K and plot perplexity on a held-out split vs file size and tok/s.
- Why 48.06 tok/s on screen vs 78 tok/s spoken? Re-measure with fixed thread count and prompt length.
- Try BitNet b1.58-style ternary weights (trained, not post-hoc) on a tiny model to compare against post-training 1-bit collapse.
- ZVect: apply the same bits-vs-quality curve to embedding storage (FP32 -> int8 -> binary) and to hybrid search (BM25 + vectors fused with RRF); measure recall@10 and nDCG per level.
- ZVect: test whether a tiny quantized model is good enough for query rewriting before retrieval, scored by retrieval metrics rather than chat quality.

## Tags & Triggers

Tags: quantization, FP16, FP8, INT4, 1-bit LLM, BitNet, GPT-2, fine-tuning, llama.cpp, GGUF, Hugging Face, VRAM, offloading, model size

- How much VRAM does a 7B model need in FP16 or 4-bit?
- What is the difference between FP8 E4M3 and E5M2, and INT4?
- Does FP8 save 75% or 50% memory?
- How to fine-tune GPT-2 on custom text and run a quantized build with llama.cpp?
- Why does an extremely quantized small model fail simple questions?
- How to evaluate a model or embedding index before and after quantization?

## References

- Clip: [I Made The Smallest (And Dumbest) LLM](https://www.youtube.com/watch?v=a7TOameRqoY) (Codeically, 5:51, 2025-09-04)
- Channel: Codeically ([search](https://www.youtube.com/results?search_query=Codeically)); [Buy Me A Coffee](https://buymeacoffee.com/codeically)
- On screen: [The Era of 1-bit LLMs (arXiv:2402.17764)](https://arxiv.org/abs/2402.17764); [twitchquotes copypastas](https://www.twitchquotes.com/copypastas/labels/classic)
- [DeepSeek R1 hardware requirements report (dev.to)](https://dev.to/ai4b/comprehensive-hardware-requirements-report-for-deepseek-r1-5269)
- [GMI Cloud: NVIDIA H100 cost](https://gmicloud.ai/blog/how-much-does-the-nvidia-h100-gpu-cost-in-2025-buy-vs-rent-analysis)
- [AMD ROCm: Low precision floating point types](https://rocm.docs.amd.com/projects/HIP/en/docs-6.4.1/reference/low_fp_types.html)
- [Hugging Face Hub: GGUF](https://huggingface.co/docs/hub/gguf)
- [HF Forum: Variable length batch decoding](https://discuss.huggingface.co/t/variable-length-batch-decoding/1359/6)
- [GPT-2 model card](https://huggingface.co/openai-community/gpt2)
- [Transformers: GGUF](https://huggingface.co/docs/transformers/gguf)

## Equations (LaTeX)
1. $$ M = N \times \frac{b}{8} $$
2. $$ V = 2^{b} $$
3. $$ w = q \times s $$
4. $$ r = \frac{1000}{t} $$
5. $$ q = \frac{8 \times S}{N} $$
