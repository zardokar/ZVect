# "Why LLMs Waste 99% of Compute — And How KV Cache Fixes It" - Claude Context
> Source: YouTube, Visual AI, "Why LLMs Waste 99% of Compute — And How KV Cache Fixes It", 11:39, published 2026-06-21 · https://www.youtube.com/watch?v=HmWQhBjbtLE · Generated: 2026-10-26
> Companion: 20260621_Why-LLMs-Waste-99-Percent-Of-Compute-And-How-KV-Cache-Fixes-It.html (Thai, iw mode `iwd`, 10 sections, 13 frames + 11 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license), every point and number kept.
- Frames used: CH1, P01, P02, P03, P04, P05_1, P05_2, P06, P07, P08, P09, P10, P11.
- Own SVG diagrams: flow, compare, flow, flow, heatmap, algo, line, line, bars, bars, bars.
- Transcript SHA-256 (in-page = decoded): `6e953467a1a3ef1475e6cd8d767a1750416103be72655035dfb96d6295ea1699`; kept in the session workspace only.

## TL;DR

Visual AI explains why autoregressive LLM inference without a KV cache recomputes the keys and values of every past token at every decode step, even though they never change. Counting K/V projections (one per token per step, per layer and per head), generating N tokens costs N(N+1)/2 projections, of which only N are new: 15 vs 5 at N = 5, and 32,004,000 vs 8,000 at N = 8,000 (99.975% redundant). The KV cache writes K/V for the prompt into GPU memory during prefill and appends one K/V row per token during decode, so each step computes only the new token's q, k, v. The price is memory: Bytes = 2 x b x s x l x h x d x 2 (fp16), i.e. 524,288 B/token (0.5 MiB) for a 7B-class config (32 layers, 32 heads, d = 128) and 52.4 GB at a hypothetical 100,000-token context (weights 14 GB); GPT-3 175B (96 layers, 96 heads, d = 128) needs 4,718,592 B/token and 471.9 GB at 100k (weights 350 GB). The next video promises MQA and GQA, which shrink the number of stored K/V heads.

Corrections from our checks: (1) the narration says that with a cache "each new token costs the same amount of work, no matter how long the conversation gets" - wrong; the new query still attends over all t cached keys, so per-step attention cost grows linearly (the clip's own chart, O(t) with cache vs O(t^2) without, is right). (2) 100k tokens is hypothetical for both models (Llama 2 7B: 4,096; GPT-3: 2,048). (3) "Up to 8x, same quality" for MQA/GQA is only partly right: MQA cuts by the number of heads; 8x is GQA-8 at 64 heads; quality is "close", MQA can degrade. (4) "99% of compute" in the title refers only to K/V projections, not all model compute.

## Key Concepts

1. **Opening analogy (0:00-0:44).** A friend with the worst memory rereads the whole chat before every reply; the speaker says this is how LLMs generate text. Later (7:39) the fix is the friend taking notes = the KV cache.
2. **Attention during training (0:44-2:02).** The full text is known, so all positions are computed in parallel: tokens -> embeddings -> Q, K, V projections -> QK^T scores for the whole grid with a causal mask -> row-wise softmax -> weighted sum of V -> one context-aware output per token. On-screen formula: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k) + M) V, with W^Q, W^K in R^{d x d_k}, W^V in R^{d x d_v}; example "BOS the cat sat on the mat" (x1..x7). Multi-head: one head focuses on one pattern, so attention runs several times in parallel and head outputs are concatenated.
3. **Inference = prefill + decode (2:02-3:40).** In a chatbot the prompt is usually processed in one forward pass (prefill), then the response is generated token by token (decode). Example: prompt "the cat slept" -> prefill predicts "on"; decode appends and predicts "the", "warm", "cozy", "red", "rug", then end-of-sequence. This is autoregressive generation. The speaker attributes chat behaviour to instruction fine-tuning (our check: SFT + RLHF in InstructGPT / Llama 2-Chat).
4. **Tracing K/V (3:40-4:46).** Each step creates a new query from the last token, but the K and V of every earlier token (starting with BOS) are reprojected from scratch, although nothing about them changed. Work accumulates as the sequence grows.
5. **Attention math at inference (4:46-6:37).** Example BOS -> the -> cat -> sat -> EOS with 4-dim toy vectors. Q = XW^Q, K = XW^K, V = XW^V; Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V with a single query row from the latest token and K, V for all tokens so far (K^T is 4x2 at step 2, 4x4 at step 4). Slide label: "Recompute for every new query". The slide numbers are illustrative, not consistent (author check: softmax([0.5,-0.2,0.4,0.8]) is about [0.27,0.13,0.24,0.36], slide shows [0.25,0.13,0.22,0.40]). ASR writes "Curie" for "query".
6. **Counting the waste (6:37-7:38).** Slide "General Complexity at Inference": Total = sum_{i=1..N} i = N(N+1)/2 in O(N^2); Useful = N in O(N); Redundant = N(N-1)/2 in O(N^2). N = 5: 15 / 5 / 10. N = 8,000: 8,000 x 8,001 / 2 = 32,004,000 total; 8,000 useful (0.025%); 31,996,000 redundant (99.975%). Speaker: "over 32 million", "31.9 million completely redundant" (truncation of 31.996M).
7. **KV cache (7:38-9:40).** Prefill: compute K/V for every prompt token and write them into VRAM; queries are used once and discarded. Decode: one fresh query per new token; its K/V are appended; all earlier K/V are read from the cache. On-screen: Attention(q_t, K_{1:t}, V_{1:t}) = softmax(q_t K_{1:t}^T / sqrt(d_k)) V_{1:t}; step 3 generating "sat" with cache bank K_BOS/V_BOS, K_the/V_the, K_cat/V_cat and weights [0.50, 0.30, 0.20]. Chart "Computational Cost per Token": without cache O(t^2), with KV cache O(t). Author reconciliation: without a cache a real implementation re-runs the whole sequence, so per step it recomputes t K/V pairs and t(t+1)/2 causal q.k products (O(t^2)); with a cache it computes 1 K/V pair and t q.k products (O(t)). The clip's own count (slides) covers only K/V projections with a single query.
8. **Memory cost of multi-head caches (9:40-10:35).** Each head keeps its own K/V cache: with 3 heads the first token writes 6 entries (3 K + 3 V), each later token adds 3 rows, and after 4 tokens there are 12 K/V pairs (the speaker says "five tokens" here; the bank holds four). Real models: thousands of tokens and dozens of heads per layer, so the GPU can run out of memory. Author note: per layer per token the cache holds 2 x h x d values; when d = d_model / h (4,096 / 32 = 128 for the 7B config) this is 2 x d_model regardless of head count, so splitting into more heads does not by itself grow the cache; reducing the number of stored K/V heads (MQA/GQA) does.
9. **Cache size formula (10:35-11:11).** Bytes = 2 (K and V) x b (batch, 1) x s (sequence, 100,000) x l (layers) x h (heads) x d (head dim, 128) x 2 (bytes, fp16). 7B: 2 x 1 x 100,000 x 32 x 32 x 128 x 2 = 52,428,800,000 B ~ 52.4 GB (speech: "half a megabyte per token", "up to 50 GB"); weights 14 GB. GPT-3 175B: 2 x 1 x 100,000 x 96 x 96 x 128 x 2 = 471,859,200,000 B ~ 471.9 GB (speech: "nearly 5 MB per token", "470 GB just for the cache"); weights 350 GB.
10. **Next: MQA and GQA (11:11-11:39).** Claimed to "slash this cache by up to eight times. Same quality, a fraction of the memory." Card: MQA "One shared K & V for all heads", GQA "Small groups share K & V", "Up to 8x less VRAM. Same accuracy."

ASR repairs (report only, transcript untouched): "Curie" = query (5:59, 6:18); "the worst world's memory" = the world's worst memory (0:13); "At the just of first token" = from the first token (9:57). Frames not kept (standard license, frame budget): chat-analogy screen (0:17), notepad "MEMORIES (VRAM)" (7:56), multi-head concat (1:55), "Caching Keys & Values" build (8:30); their content is in the text and own SVGs.

## Implementation

KV cache sizing and per-step cost, as a checklist an engineer can apply (formula from the clip; generalisations are author notes):

1. Per-token cache bytes = 2 x n_layers x n_kv_heads x head_dim x bytes_per_value. For MHA n_kv_heads = n_heads, so this equals 2 x n_layers x d_model x bytes (author note: h x d = d_model when head_dim = d_model / n_heads).
2. Total cache = per-token bytes x sequence_length x batch_size. Examples: 7B-class (32, 32, 128, fp16) -> 524,288 B/token -> 52.4 GB at 100k; GPT-3 (96, 96, 128, fp16) -> 4,718,592 B/token -> 471.9 GB at 100k. Use decimal GB as the slide does (48.8 GiB / 439.5 GiB in binary units).
3. With GQA/MQA, use the number of K/V heads (e.g. `num_key_value_heads` in a Hugging Face config), not the number of query heads. GQA-8 with 64 query heads = 8x smaller; MQA = n_heads x smaller.
4. Without a cache, K/V projections over N generated tokens = N(N+1)/2 per layer per head; with a cache = N. The rest of the forward pass for old tokens (Q, MLP) is also recomputed without a cache.
5. With a cache, per-step attention still computes q_t . k_i for all i <= t, so per-token cost is O(t) and total attention over N tokens is O(N^2); only the new token's projections and MLP are O(1) per step.
6. Prefill writes the whole prompt's K/V per layer in one pass; decode appends one row per layer per K/V head per token.

Minimal decode loop with a cache (author sketch, not code from the clip):

```python
# per layer, per kv head; cache_k, cache_v start as the prefill K, V (t x d)
q_t = x_t @ W_q                         # only the new token
cache_k = concat(cache_k, x_t @ W_k)    # append one row
cache_v = concat(cache_v, x_t @ W_v)
w = softmax(q_t @ cache_k.T / sqrt(d_k))  # t scores: grows with t
z_t = w @ cache_v
```

## Quick Reference

| Item | Value | Time |
|---|---|---|
| Prompt example | "the cat slept" -> on, the, warm, cozy, red, rug, end-of-sequence | 2:38-3:18 |
| Math example | BOS -> the -> cat -> sat -> EOS, 4-dim toy vectors | 4:50-5:51 |
| K/V work, N = 5 | total 15, useful 5, redundant 10 | 6:44, slide 6:58 |
| K/V work, N = 8,000 | total 32,004,000; useful 8,000 (0.025%); redundant 31,996,000 (99.975%) | 7:14, slide 7:25 |
| Complexity | without cache O(N^2) projections; with cache O(N); chart per token O(t^2) vs O(t) | 7:25, 9:35 |
| Multi-head example | 3 heads: 6 entries for the first token, 3 rows per token, 12 pairs after 4 tokens | 9:53-10:22 |
| Formula | Bytes = 2 x b x s x l x h x d x 2 | 10:37 |
| 7B-class | l 32, h 32, d 128, fp16: 524,288 B/token; 100k -> 52,428,800,000 B ~ 52.4 GB; weights 14 GB | 10:42-10:52 |
| GPT-3 175B | l 96, h 96, d 128: 4,718,592 B/token; 100k -> 471,859,200,000 B ~ 471.9 GB; weights 350 GB | 10:55-11:04 |
| Native context | Llama 2 7B 4,096; GPT-3 2,048 (100k is hypothetical) | fact check |
| Next video | MQA, GQA: "up to 8x" smaller cache | 11:17 |

## Comparisons

| Criterion | No cache | KV cache |
|---|---|---|
| Old tokens' K/V | recomputed every step | computed once, read from VRAM |
| K/V projections for N tokens | N(N+1)/2 | N |
| Per-token cost (clip chart) | O(t^2) | O(t) (query still attends to all t keys) |
| Extra memory | none across steps | 2 x l x h x d x bytes per token |
| 100k-token example | - | 52.4 GB (7B), 471.9 GB (GPT-3) |

## Fact Check

8 claims checked (arxiv.org, ar5iv mirror, huggingface.co only): confirmed 4, partly 3, contradicted 1.

| id | Claim | Verdict | Note | Source |
|---|---|---|---|---|
| C1 | N(N+1)/2 K/V computations; 15/5/10 at N = 5; 99.975% redundant at N = 8,000 | confirmed | arithmetic exact; "31.9 million" truncates 31.996M; per layer and head | HF Transformers cache docs |
| C2 | with cache each token costs the same work | contradicted | HF: with cache, attention cost per step is linear in length; chart O(t) is right | HF Transformers cache docs |
| C3 | 7B, 100k: 52.4 GB; weights 14 GB | confirmed | 32/32/128 = Llama 2 7B config; native context 4,096 | HF Llama 2 docs; config of a Llama-2-7b-hf fine-tune (secondary) |
| C4 | GPT-3 100k: 471.9 GB; weights 350 GB | confirmed | GPT-3 Table 2.1: 96 layers, 12288 d_model, 96 heads, 128 d_head, 2,048 context | ar5iv mirror of arXiv 2005.14165 |
| C5 | MQA/GQA up to 8x, same quality | partly | MQA cuts by n_heads; GQA-8 = 8x at 64 heads; GQA-8 47.1 vs MHA 47.2; MQA may degrade | arXiv 1911.02150, 2305.13245 |
| C6 | prefill writes K/V to VRAM, queries discarded, decode appends | partly | per layer; prompt queries used within prefill | arXiv 2401.09670; HF docs |
| C7 | prefill/decode split; chat behaviour from instruction fine-tuning | partly | chat behaviour from SFT + RLHF | arXiv 2203.02155; 2401.09670 |
| C8 | parallel training with causal mask | confirmed | Vaswani et al. decoder masking | arXiv 1706.03762 |

## Open Questions & Extension Ideas

- Author idea for ZVect: a lesson after 10.2 (self-attention) that counts K/V work with and without a cache (the 1+2+...+N triangle) and lets the learner change l, h, d, s to see cache bytes vs weights; the heatmap "step x token, n-th computation" is a ready picture.
- The clip leaves out per-layer caches in its multi-head demo (the formula includes l), batch effects (b), and cache-reducing techniques other than MQA/GQA (quantised caches, paged attention, sliding windows) - not covered here.
- Open: how much decode latency comes from reading the cache from memory (bandwidth) versus compute; the clip only counts operations.

## Tags & Triggers

tags: KV cache, attention, inference, prefill, decode, autoregressive generation, VRAM, multi-head attention, MQA, GQA, GPT-3, Llama 2, memory estimation

- Why do LLMs need a KV cache, and how much work is redundant without it?
- How big is the KV cache for a given model and context length?
- Is per-token cost constant with a KV cache?
- How much do MQA and GQA shrink the cache, and what do they cost in quality?

## References

- Source: Visual AI, "Why LLMs Waste 99% of Compute — And How KV Cache Fixes It", YouTube, 11:39, published 2026-06-21, https://www.youtube.com/watch?v=HmWQhBjbtLE
- Cited in the description: Vaswani et al., Attention Is All You Need, https://arxiv.org/abs/1706.03762 · Shazeer, Fast Transformer Decoding: One Write-Head Is All You Need, https://arxiv.org/abs/1911.02150 · Ainslie et al., GQA, https://arxiv.org/abs/2305.13245
- Fact check: https://huggingface.co/docs/transformers/v5.14.0/cache_explanation · https://huggingface.co/docs/transformers/main/model_doc/llama2.md · https://huggingface.co/ChocoLlama/ChocoLlama-2-7B-base/blob/main/config.json (secondary) · https://ar5iv.labs.arxiv.org/html/2005.14165 · https://arxiv.org/html/2401.09670v3 · https://arxiv.org/pdf/2203.02155 · https://arxiv.org/html/2305.13245v3

## Equations (LaTeX)
1. $$ \mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^{T}}{\sqrt{d_k}}+M\right)V $$
2. $$ Q = XW^{Q},\quad K = XW^{K},\quad V = XW^{V} $$
3. $$ \mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^{T}}{\sqrt{d_k}}\right)V $$
4. $$ \text{Total} = \sum_{i=1}^{N} i = \frac{N(N+1)}{2} \in \mathcal{O}(N^{2}) $$
5. $$ \text{Useful} = N \in \mathcal{O}(N), \qquad \text{Redundant} = \frac{N(N-1)}{2} \in \mathcal{O}(N^{2}) $$
6. $$ \mathrm{Attention}(q_t, K_{1:t}, V_{1:t}) = \mathrm{softmax}\left(\frac{q_t K_{1:t}^{T}}{\sqrt{d_k}}\right) V_{1:t} $$
7. $$ \text{Bytes} = 2 \times b \times s \times l \times h \times d \times 2 $$
