# Exploring Precision in ColBERT Indexing and Retrieval — Claude Context
> Source: YouTube, Vishal Bakshi, "Exploring Precision in ColBERT Indexing and Retrieval", 18:42, published 2025-05-25, https://www.youtube.com/watch?v=aiNQ4I8YaD0 · Generated: 2026-10-11
> Companion: docs/outhtm/20250525_Exploring-Precision-In-ColBERT-Indexing-And-Retrieval.html (Thai, own-words rewrite, every point and number)

## TL;DR
Curiosity experiment (explicitly not a best practice): a ColBERT fork/branch `mixed_precision_false` turns off every half-precision conversion found (with help from Claude/Opus and ChatGPT, including CUDA kernels). Indexing UKPLab DAPR ConditionalQA (~70k short docs, ~15 tokens avg) with Answer.AI ColBERT (96-d): FP32 indexed in 70 s vs 180 s for mixed precision; GPU peak 5.5 vs 5.78 GB; CPU peak 0.8235 vs 0.814 GB; recall@10 0.130349 vs 0.129939 (+0.3% relative for FP32); 388 retrieved-passage mismatches counted in both directions over 271 queries × 10 (on-screen 0.143; per-side share is 194/2,710 ≈ 7.2%); total scores 80,435 (FP32) vs 80,438; index metadata identical, centroids very different (allclose passes only at tol 1.0), ivf.pid length 963,143 vs 975,457 (+12,314 for mixed), 16,384 centroids both.

## Key Concepts
- 0:15 Branch `mixed_precision_false` in a ColBERT fork; Claude (Opus) given the branch to find all half-precision conversions; found details such as the decompress-residual CUDA kernel.
- 1:20 Edits: checkpoint.py MixedPrecisionManager → False; colbert modeling doc() `.half()` on GPU commented out; passage encoding float16 conversion removed; sample embeddings saved full precision; concatenate/split sample tensor float16 → float32; centroids half → float; residual batch half → float; centroid–embedding cosine half → float; centroids saved full; CUDA kernel kFloat16 → kFloat32 and other half → float; queries full precision at retrieval; config default false; training file false too.
- 3:31 Presenter: has heard GPUs prefer half precision; not best practice; curiosity only.
- 3:53 Two conda envs (stock ColBERT vs FP32 branch). Script 1 (ColBERT MemPlot): thread logs CPU (GB) and GPU memory every 5 s during `indexer.index`; config reused from a previous experiment; argparse precision FP32 or AMP; saves readings and plots. Script 2: qrels dict for pytrec_eval, evaluator, mean recall; index name argument selects the matching index per env; standard searcher values; saves results.
- 7:03 FP32: 70 s, GPU max 5.5 GB. Mixed: 180 s, GPU max 5.78 GB. Unexpected; maybe dataset small (70k rows). CPU max FP32 0.8235 vs mixed 0.814. No full profiling.
- 8:15 Plots: mixed GPU RAM has a plateau; FP32 less so; "maybe" the reason for ~100 s extra. CPU: FP32 spikes ~0.83; mixed just under 0.82 then level.
- 9:19 Recall: FP32 slightly higher (~0.3%), negligible. On screen fp32 0.13034885692197787, amp 0.12993885282193690, relative diff 0.00316.
- 10:03 Retrieved passages differ: per query (e.g. dev-0) dict of 10 pid → PLAID score; count pids in one result not in the other, both directions: 388 of "about 3,000" (on screen n_diffs/(271*10) = 0.1431) → "about 14%".
- 11:59 Scores: presenter guessed FP32 higher — wrong; total over 10 passages per query: mixed 80,438, FP32 80,435.
- 12:40 Index artifacts: metadata (nbits, kmeans iterations, GPUs, chunks, partitions/centroids, embeddings) identical.
- 13:17 centroids.pt ("8,000 or so" said; 16,384 on screen later): allclose fails at default tolerance both ways (mixed→full, full→half); passes only at tolerance 1.0; "very different". Same count because same number of partitions and same 96-d model. Scatter of flattened centroids shows large variance.
- 15:13 ivf.pid.pt: [0] sequence of pids: FP32 963,143 vs mixed 975,457 (diff 12,314); [1] counts per centroid: 16,384 each (presenter says 16,390). Possible (hedged) explanation: mixed precision cancels small differences between similar token embeddings, adding pid–centroid mappings — "I don't really know".
- 16:49 Summary + caveats: sample size of one, one small dataset, ~15 tokens/doc, possibly missed conversions; only wanted to see whether there is a difference — yes.

## Implementation
1. Fork ColBERT; set MixedPrecisionManager(False); remove `.half()`/float16 casts in modeling, encoding, sampling, centroid, residual, cosine and save paths; switch CUDA kernels to float32; default config false.
2. Two environments; index the same corpus with identical config; log CPU/GPU memory every 5 s in a background thread.
3. Retrieve top-10 per query; evaluate recall@10 with pytrec_eval; save result dicts.
4. Compare: recall; pid set differences per query (note: with equal list sizes, |A\B| = |B\A|, so a two-way count double counts); summed scores; metadata.json; centroids.pt (cast to same dtype, torch.allclose with tolerance sweep, scatter); ivf.pid.pt shapes.
5. Missing control (author note): repeat the same precision twice to measure run-to-run variance (k-means randomness) before attributing differences to precision.

## Quick Reference
| Metric | FP32 | Mixed | Time |
|---|---|---|---|
| Index time | 70 s | 180 s | 7:08 |
| GPU peak | 5.5 GB | 5.78 GB | 7:12 |
| CPU peak | 0.8235 GB | 0.814 GB | 7:44 |
| Recall@10 | 0.130349 | 0.129939 | 9:30 |
| Total score | 80,435 | 80,438 | 12:26 |
| Passage mismatches | 388 two-way / 2,710 | | 11:28 |
| ivf.pid[0] length | 963,143 | 975,457 | 15:30 |
| Centroids | 16,384 | 16,384 | 16:40 |
| Dataset | UKPLab DAPR ConditionalQA ~70k, ~15 tok/doc | | 5:07 |
| Model | Answer.AI ColBERT, 96-d | | 14:44 |

## Comparisons
| Aspect | FP32 | Mixed precision |
|---|---|---|
| Index speed | faster | slower (cause unknown) |
| GPU memory | slightly less | slightly more, plateau |
| CPU memory | slightly more | slightly less |
| Recall@10 | +0.3% relative | baseline |
| Artifacts | different centroids and pid mappings | |
When to choose: no general recommendation; differences are real but small in quality and large in artifacts for this one dataset.

## Open Questions & Extension Ideas
- Run-to-run variance at fixed precision; multiple datasets with longer documents; profiling the 110 s gap.
- Per-side mismatch rate (≈7.2%) vs two-way count (14.3%).

## Tags & Triggers
Tags: colbert, plaid, mixed-precision, fp32, fp16, centroids, ivf, k-means, recall-at-10, index-artifacts, conditionalqa, pytrec-eval, answerai-colbert
Triggers:
- Does FP32 vs FP16 change ColBERT indexing or retrieval?
- Why was mixed precision slower here?
- How do centroids.pt / ivf.pid.pt differ between precisions?
- How should retrieval-set differences be counted?

## References
- https://www.youtube.com/watch?v=aiNQ4I8YaD0
- https://vishalbakshi.github.io/blog/posts/2025-05-25-Exploring-ColBERT-Precision/
- https://github.com/vishalbakshi/ColBERT/commits/mixed_precision_false/

## Processing Notes
- License: standard YouTube → own-words rewrite; manual en-US captions (382 lines) kept out of the repo.
- On-screen values verified from frames (recall decimals, 388, 271×10, 963,143 / 975,457 / 12,314 / 16,384).
- Author calculations: per-side mismatch 194/2,710 ≈ 7.2%; FP32 is 2.57× faster. Not web-checked (2025 source within model knowledge).
- 5 frames cropped to notebook content, 2 own SVGs.
