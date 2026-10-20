# Build & Train a GLM-5.3-Flash Model From Scratch with Python — freeCodeCamp.org (video by Vuk Rosić) - Claude Context
> Source: YouTube, freeCodeCamp.org (video by Vuk Rosić), "Build & Train a GLM-5.3-Flash Model From Scratch with Python", 44:26, published 2026-10-06 · https://www.youtube.com/watch?v=-gfgQfw2g_E · Generated: 2026-10-19
> Companion: 20261006_Build-And-Train-GLM-5-3-Flash-From-Scratch.html (Thai, iw mode `iwd`, 21 sections, 38 frames + 27 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: D01, D02, D03, S06, S08, S09, S10, S13, S14, S15, S17, S18, S19, S20, S22, S23, S24, S25, S28, S32, S33, S34, S35, S36, S37, S38, S39, S40, S42, S43, S44, S46, S49, S56, S57, S58, S60, S61.
- Own SVG diagrams: flow, flow, lanes, flow, bars, flow, layers, matrix, flow, shapes, flow, plane, flow, compare, flow, flow, algo, bars, bars, algo, compare, heatmap, algo, bars, compare, heatmap, cycle.
- Transcript SHA-256 (in-page = decoded): `d0b36d781df97ef3cc520d4a51bec525ab651e3086305832c3a9cf44c792186c`; kept in the session workspace only.

## TL;DR

- Vuk Rosić (freeCodeCamp.org, 2026-10-06, 44:26) builds a 25.7M-parameter (25,730,592) "teaching model" that borrows the main architectural ideas of Z.ai's GLM-5.3-Flash (320B total / 18B active), trains it on a CPU/Mac/GPU, and walks through every part: byte tokenizer (260 tokens), embedding lookup, 4 residual streams (simplified mHC hyper-connections), weight tying, RMSNorm, RoPE, a hybrid of linear and sparse attention (L L L S x 3 = 12 layers), MoE (2 of 8 routed + 1 shared), and a small vision path (32x32 image -> 16 tokens).
- Training: byte-level next-token pre-training with AdamW on Python function prompts/completions, then RL with an executable hidden-test verifier (reward +1 / 0 / -0.1), 16 completions per prompt, leave-one-out baseline (RLOO), updating only 2.19M parameters (last block + final norm + tied head).
- Results: sampled exact rollouts on dev 4.2% -> 45.8% (4/96 -> 44/96); greedy pass@1 on the frozen confirmation set 0/24 -> 16/24 (16 gains, 0 losses, p = 0.0000305). Gains are narrow: trained families improve, `even` stays flat, untrained `square` and `list sum` regress.
- Research-method lessons: diversity helps only after enough updates; interleaving beats blocked ordering (+9.7 points, all 10 seeds); curriculum does not beat diverse-from-start; the RL hyper-parameter "winner" (group size 4) did not replicate across 3 seeds (95% CI -6.7% to +1.7%).
- The speaker's thesis: AI agents now write and run experiments; the human researcher's job is asking the right questions and designing data/environments.
- Fact check (20 claims): 10 confirmed, 8 partly, 0 not found, 2 contradicted. The two contradictions: GLM-5.3-Flash does NOT tie embeddings (`tie_word_embeddings: false`); GLM sparse attention is content-based top-2,048, not a recent-token window.

## Key Concepts

- **Byte-level vocabulary (260 tokens).** 256 UTF-8 byte values + 4 special tokens (BOS, `<image_start>`, `<image>`, `<image_end>`). Token id = byte value + 4 (ids 0-3 are control tokens). Slide example: `d e f SPACE i n` -> `104 105 106 36 109 114`; `+` (43) -> token 47. The speaker says "each ASCII character" - inaccurate: they are bytes (ASCII has 128 values). Trade-off stated on the slide: "17 tokens instead of 4" (longer sequences). Thai text costs 3 bytes per character in UTF-8 (author note).
- **Why small vocab for a small model.** Embedding and output head are both V x d. With V = 250,000 on a very small model the speaker says ~95% of parameters go to "vocabulary conversion". Fact-check arithmetic: 12 layers, V = 250k gives 93% (d = 256, untied) or 82% (d = 384, tied). Real GLM-5.3-Flash vocab: BPE 154,880.
- **Embedding = lookup.** Slide "Read the algorithm, not the syntax", step 1: `self.embedding(input_ids)`; token id 104 selects row 104 of the learned table -> vector `[0.12, -0.08, 0.31, ...]`. "A token ID is an address." Output tensor shape: batch x tokens x dim.
- **Hyper-connections / mHC (4 streams).** X is copied into 4 residual streams ("highways"); each sublayer reads a learned mixture, then routes its update back to all streams. Released GLM: separate `attn_hc` and `ffn_hc` with manifold-constrained mixing (doubly stochastic via Sinkhorn-Knopp, arXiv 2512.24880; `hc_mult` = 4). Teaching model: one simpler hyper-connection wraps attention + MoE together, so it does not restore four streams between them (slide text at 21:56). Final merge: `self.final_norm(streams.mean(dim=2))` - average the 4 streams, then RMSNorm -> final hidden state h.
- **Weight tying.** `self.output.weight = self.embedding.weight`; logits z = h E^T. Saves the second V x d matrix. Contradicted claim: the speaker implies GLM-5.3-Flash uses it ("they use it here", 14:21); its config has `tie_word_embeddings: false`. Only the toy model ties. Concept: Press & Wolf 2016 (arXiv 1608.05859).
- **RMSNorm.** Keeps values around -1..1 and similar in scale so they do not explode/vanish across many multiplications. Formula (author-added): x_j / sqrt(mean(x^2) + eps) * g_j. Worked example: (3, -1, 1, 9) -> RMS = sqrt(23) = 4.796 -> (0.626, -0.209, 0.209, 1.877).
- **RoPE / NoPE.** RoPE rotates pairs of query/key dimensions by an angle that depends on token position (and pair index); comparing rotated q and k gives relative distance. Code on slide: `q, k = apply_rope(q, k)`. Released GLM: NoPE (no positional encoding) in main attention (`qk_rope_head_dim` = 0), RoPE only in the sparse indexer; teaching model uses RoPE in both attention types. The speaker misspeaks at 15:55 ("NOPE ... a version of Rope") but defines NoPE correctly at 17:58. The clip does not say how each pair's base angle theta is set or which base the repo uses; in the original RoPE (RoFormer, arXiv 2104.09864, author-added) pair i of d/2 uses theta_i = 10000^(-2(i-1)/d), so pair 1 has theta = 1 rad and later pairs rotate more slowly.
- **Sparse attention + indexer.** A light, cheap attention ("indexer") scores previous tokens and selects the top-k; full attention runs only on those (GLM `index_topk` = 2048; the speaker says "2,000 or 1,000"). Core attention cost per token is fixed (O(Lk) total), the indexer is still O(L^2) but cheap. Not mentioned in the clip: IndexPool merges 4 indexer key vectors into 1 (Z.ai: 3.01x less attention compute, 4.44x smaller KV cache vs GLM-5.3).
- **Linear attention.** Fixed-size state matrix ("running key-value state") updated per token; constant memory, remembers recent tokens best, lossy compression. GLM uses KDA (Kimi Delta Attention, arXiv 2510.26692); the teaching model uses ELU-feature linear attention ("not GLM's exact KDA"); feature map presumably the standard ELU(x) + 1 (repo states only 'ELU-feature'; author's form), with ELU(x) = x for x > 0 and e^x - 1 otherwise, so phi > 0 (author-explained). Basic form (author-written, not KDA's gated update): S_t = S_{t-1} + phi(k_t) v_t^T, o_t = phi(q_t)^T S_t. The speaker calls it a state space model; the KDA paper does not.
- **Layer pattern.** Every 4th layer sparse. Teaching: L L L S x 3 (9 linear + 3 sparse). Released GLM: 34 KDA linear + 11 sparse = 45 layers (sparse at indices 3, 7, ..., 43).
- **MoE.** Router picks experts per token; one shared expert sees every token and learns common information. GLM: 8 of 288 routed + 1 shared. Teaching: 2 of 8 routed + 1 shared. Active params per token: GLM 18B of 320B; toy ~9,805,344 of 25,730,592 (38.1%).
- **Vision path.** 32x32 RGB -> 4x4-pixel patches (8x8 = 64) -> 2 bidirectional vision blocks with 2D RoPE -> learned 2x2 merge -> 16 visual tokens. Sequence: `BOS, IMAGE START, IMAGE x 16, IMAGE END, "Digit:", -> 7`. Vision pilot: 4,800 generated seven-segment digit images (40 per step x 120 steps), 200 fixed held-out renderings (seed 10042), batch 40, answer-only loss, "4.3 seconds for both models" (the slide does not say which two models or which stage the time covers); first tested in a 60,924-parameter miniature. No held-out accuracy number is given in the clip - only that the encoder "was successfully recognizing digits". The speaker suggests asking Codex or Claude Code to clone the repo, explain the code and draw the graphs (25:36). Released GLM vision: 448 px, patch 14, merge 2 -> 256 tokens per image.

## Implementation

Repo: https://github.com/vukrosic/glm-5.3-flash-from-scratch (README, REPORT.md, slides/slides.html). Code lines shown on screen, verbatim:

```python
self.embedding(input_ids)
```
```python
unsqueeze(2) → expand(-1, -1, 4, -1)
```
(step 2 of the 5-step carousel, ~11:40: token vector x [B, T, D] -> add a stream axis [B, T, 1, D] -> repeat to 4 identical starts [B, T, 4, D]; "the vector is not divided; later network layers make each stream different")
```python
streams, usage = layer(streams)
```
(step 3, ~13:00: "Read once, write four ways." m = sum_s alpha_s x_s with alpha_s >= 0, sum alpha_s = 1 (softmax over four learned input scores per token); Delta = block(m) (attention, then MoE) + expert usage; stream s becomes x_s + beta_s * Delta (beta from a second softmax). `usage` records MoE expert traffic for router balancing; "it is not a fifth stream".)
```python
self.final_norm(streams.mean(dim=2))
```
(step 4, ~13:10)
```python
self.output(hidden)
```
(step 5, ~13:40: hidden state h compared with every byte -> 260 output scores; slide shows top scores `:` (highest, value hidden), `r` 6.7, `\n` 5.9 -> next byte `:`)
```python
q, k = apply_rope(q, k)
```
```python
self.output.weight = self.embedding.weight
```
```python
embeddings[image_mask] = vision_encoder(images)
logits = language_model.forward_embeddings(embeddings)
```

Pre-training data example (slide 26:40) - prompt + completion -> UTF-8 bytes, one next-byte target at every position. The slide shows two separate boxes. PROMPT box:
```python
# Return x plus one.
def increment_qrdadnk(x):
```
COMPLETION box:
```python
    return x + 1
```
(The completion line is indented inside its box; the exact number of spaces cannot be counted from the frame, so the report uses 4 spaces, which makes prompt + completion valid Python. Function names carry random suffixes "to reduce exact string memorization".)

Pre-training step (slide 27:26): (1) predict probability for every next byte; (2) cross-entropy loss; (3) backpropagate; (4) AdamW update. Also router balance loss and gradient clipping. Repo: AdamW, lr 3e-4, batch 32, seq 128. A 100-byte sequence gives about 99 next-byte targets. Example: correct byte `1` goes from 8% (before update) to 68% after many similar updates (`*` 62% -> 18%, `0` 20% -> 12%); loss -log p: 2.526 -> 0.386 (author computed). Before/after pre-training on held-out prompt `# Return two times x.` / `def double_ywkaoot(x):`: step 0 emits repeated `:` (not code); after 100 steps `return x * 2`, 3/3 hidden tests pass; 173,237 training bytes; greedy, seed 42.

RL verifier (slide 36:23), verbatim:
```python
tree = validate_source(source, task.entry_point)
exec(compile(tree, "candidate.py", "exec"), namespace)
function = namespace[task.entry_point]

for arguments, expected in task.cases:
    actual = function(*arguments)
    passed += int(type(actual) is type(expected)
                  and actual == expected)
```
+1 only when it compiles, defines the required function, returns the right type and matches every expected value; unsafe syntax and imports are rejected first; the prompt never reveals the cases.

Reward table: +1 all tests pass; 0 valid but wrong; -0.1 invalid Python (the spoken example at 34:55 says "maybe -1"; the implemented value is -0.1).

Advantage (slide 36:52): `advantage_i = reward_i - mean(other rewards)` (RLOO leave-one-out). 16 attempts per prompt. Slide example group: rewards [+1,0,-0.1,0,+1,0,0,+1 / 0,-0.1,+1,0,0,+1,0,-0.1] -> five +1, eight 0, three -0.1, sum 4.7, mean 0.294. RLOO advantages (author computed): +1 -> +0.753; 0 -> -0.313; -0.1 -> -0.420. GRPO for comparison: A_i = (r_i - mean_group) / std_group -> +1 -> +1.48 (pstd 0.478). No critic needed in either.

How the advantage updates weights: the clip only gives the direction (better -> more likely, worse -> less likely) and shows no update formula or code. Standard REINFORCE/RLOO form (author-added, not checked against the repo): L(theta) = -(1/G) * sum_i advantage_i * log pi_theta(y_i | x), where log pi_theta(y_i | x) is the sum of byte log-probabilities of completion i; minimizing L pushes up completions with positive advantage, proportional to its size.

RL update scope: only the last block (block 12), final normalization and the tied output head = 2,190,152 of 25,730,592 params (8.5%). Rationale given: faster, less forgetting. Note (author): because the head is tied, RL also changes the input embedding table.

Measured results:
- Dev sampled exact rollouts: 4.2% -> 45.8% (4/96 -> 44/96, after 96 RL groups; chart label "1,536 sampled programs"). The number 96 is not in the clip or on any slide; it comes from the fact-check (repo). As a fraction, the denominator 96 counts sampled answers in one measurement; "96 RL groups" counts training groups (one prompt each). The clip does not say how many dev prompts those 96 answers come from. The clip does not explain how 1,536 relates to 4/96; author arithmetic: 96 groups x 16 attempts = 1,536 (unconfirmed). The chart's x-axis has no label. Confirmation split: 13/192 -> 88/192.
- Greedy pass@1 on held-out prompts of the 3 trained families (frozen confirmation set; new prompts of trained families, NOT unseen task types): 0/24 -> 16/24; 16 gains, 0 losses, exact paired McNemar/binomial p = 0.0000305 (= 2 x 0.5^16, two-sided, author check). Sampled absolute gain +39.1 points, 95% task-level bootstrap CI +25.0 to +53.1. +39.1 is not 45.8 - 4.2 (= 41.6); author arithmetic: 88/192 - 13/192 = 75/192 = 39.06% (the slide does not state the derivation).
- Sampled pass@8: trained families 9/24 -> 19/24; all eight families 25/64 -> 34/64.
- Per family (slide 39:50): increment 9% -> 63%; double 6% -> 70%; even ? -> 5% (before value hidden by a highlight; "stayed flat"); square 81% -> 58%; list sum 95% -> 88%; absolute / nonnegative / reverse 0% -> 0%. The slide does not name the metric. Author inference (unconfirmed): every value matches an integer over 64 (6, 4, 40, 45, 52, 37, 61, 56, 3 of 64), and with even = 3/64 before and after, the three trained families sum to 13/192 -> 88/192, exactly the README "Exact sampled completions" row - so these are probably exact sampled completions, 64 per family.
- Unexplained inconsistency: the pre-training slide (27:58) shows `double_ywkaoot` answered `return x * 2`, 3/3 tests, after 100 steps (greedy, seed 42), while the README figure (0:59) shows the same prompt failing 0/3 "before RL". The clip does not explain it; possibly different checkpoints or decoding (author guess).

Pre-training experiments (248K-parameter model, 10 paired seeds):
- Exp 1 diversity: 8 repeated vs 88 unique program structures; no help at 50 updates; at 200 updates 60.2% vs 57.0% (+3.2, paired permutation p = 0.0137); 32 unseen structures; exact-expression accuracy stayed 0%. The Exp 1 slide never says what the 30-60% accuracy measures (only that it is not exact-expression accuracy); the Exp 2 result slide's small line names its metric "held-out target-byte accuracy", and the repeated 60.2% suggests the same metric (author inference).
- Exp 2 order: same 4,800 examples, blocked (AAABBBCCC) 50.5% vs interleaved 60.2% (+9.7); per-seed gains +14.9, +3.8, +9.7, +12.1, +10.3, +7.5, +6.0, +9.7, +14.4, +8.2; bootstrap 95% CI +7.6 to +11.7; p = 0.00195. Mechanism (recency bias / forgetting) NOT measured - speaker says it "might" be the case. The Exp 3 slides call the 88-from-start arm "diverse interleaving from the beginning/start"; all three 60.2% arms match, but the clip never says the Exp 2 INTERLEAVED arm uses 88 structures or is the same run as the 88 arm of Exp 1/3 (Exp 2 says only "same 4,800 examples").
- Exp 3 curriculum: repeat 8 = 57.0%; 8 -> 88 after update 100 = 59.6%; 88 from start = 60.2%. Curriculum vs repeat p = 0.0117; vs diverse p = 0.2148 -> no reliable curriculum advantage.

RL hyper-parameter screen (same checkpoint, 128 sampled programs per arm, dev tasks solved out of 20): binary 5, partial reward 5, no invalid penalty 5, hard invalid penalty 5, temperature 0.20 = 7, temperature 0.80 = 6, group size 4 = 8, group size 16 = 6. Confirmation with 3 RL seeds on 40 untouched tasks (group 8 vs group 4): 31415: 12 vs 13 (+1); 27182: 14 vs 13 (-1); 16180: 11 vs 8 (-3); means 12.3 vs 11.3; 95% CI -6.7% to +1.7% (crosses zero). "None of the four RL changes produced statistically significant improvement." Group 8 is not on the dev-screen chart (only 4 and 16); the speaker's example group size is "eight per prompt" (41:01) and he says "group four is better than group eight" (42:42), but the clip never states the screen's baseline group size or why the confirmation compares against 8 rather than 16 (author guess: 8 is the baseline).

Speaker's career claims (33:53): good research is possible on a CPU; hedged as a feeling (33:57): "I feel like um if you want to get a job at OpenAI and Anthropic, you don't need GPUs"; scaling is not important "unless you are working explicitly on scaling or pre-training". Also (0:30) the AI-researcher job "has dramatically changed in just a few months"; (1:31) Anthropic and OpenAI "could actually be inventing new algorithms", but he thinks 99%+ of effort goes to data, environments and optimizing existing algorithms; (3:23) if superintelligence arrives humans may be "useless", so "for now" focus on asking questions.

Pitfalls the source states: show no tests to the model (reward hacking); sample several times and look at the average (40:16); change one variable at a time; "like 500 or 5,000" rather than five (the clip does not say five of what - likely experiments or eval items); three seeds that agree; evaluation reuses trained families and templates, so gains are not general coding ability; a regression needs enough samples and a proper significance test.

## Quick Reference

| item | teaching model | GLM-5.3-Flash |
|---|---|---|
| parameters | 25.7M (25,730,592) | 320B total, 18B active |
| layers | 12 (L L L S x 3) | 45 (34 KDA linear + 11 sparse) |
| vocab | bytes, 260 | BPE, 154,880 |
| context | 192 | 1M (1,048,576); max output 128K |
| MoE | 2 of 8 + 1 shared | 8 of 288 + 1 shared |
| residual streams | 4 (simplified) | mHC, hc_mult = 4 |
| positions | RoPE in both attention types | NoPE main, RoPE in indexer |
| sparse attention | local window + strided anchors (own toy) | indexer top-2,048 by content |
| linear attention | ELU-feature linear attention | KDA |
| weight tying | yes | no |
| vision | 32x32 -> 16 tokens | 448 px, patch 14 -> 256 tokens |
| pre-train optimizer | AdamW (lr 3e-4, batch 32, seq 128) | - |
| RL | RLOO, 16 per prompt, reward +1/0/-0.1, 2.19M params updated | - |
| headline RL result | greedy pass@1 0/24 -> 16/24 | - |

## Comparisons

- **Linear vs sparse vs full attention:** linear = constant-size state, cheap, recent and lossy; sparse = exact lookback on selected tokens, needs an indexer and stored tokens; full = everything, quadratic cost. GLM mixes 34 linear + 11 sparse; the speaker reports from experience that linear trains and infers much faster.
- **RLOO vs GRPO:** RLOO baseline = mean of the other G-1 rewards, no scaling; GRPO = (r - group mean) / group std. Both critic-free. The slide formula is RLOO; the speaker frames it as "GRPO and other algorithms" and later names RLOO as the algorithm used.
- **Teaching model vs released model:** see Quick Reference; the teaching model copies ideas, not the exact mechanisms (repo: "not GLM's exact KDA", "not DeepSeek Sparse Attention").
- **Pre-training vs RL:** pre-training imitates (next-byte target known at every position); RL scores only final program behaviour from hidden tests and needs no reference solution.

## Fact Check

20 claims checked (repo README/REPORT.md, HF model card + config.json, docs.z.ai, papers): 10 confirmed, 8 partly, 0 not found, 2 contradicted.
- Contradicted: (6) GLM-5.3-Flash uses weight tying - false, `tie_word_embeddings: false`; (13) sparse attention looks at a recent window of the last 2,000 tokens - false for GLM, which selects top-2,048 by content (no `sliding_window`).
- Partly: (1) maker is Z.ai not "Google AI" (ox-alpha codename is real); (3) BPE sizes - GLM 154,880, nobody mainstream at 300k; (4) 260 tokens are bytes not ASCII; (5) the 95% share depends on width and tying; (11) toy linear attention is ELU, not KDA, and KDA is not called an SSM; (16) "most people use Muon" overstated; (19) DeepSeek still uses GRPO (V3.2 "Scaling GRPO", V4); (20) "minus mean of other rewards" is RLOO, GRPO uses group mean/std.
- Confirmed: (2) 320B vs 25.7M; (7) context 192 vs 1M; (8) mHC by DeepSeek, hyper-connections by ByteDance, 4 streams; (9) NoPE main / RoPE indexer; (10) indexer top-k and cost scaling; (12) every 4th layer sparse; (14) 288 / 8 / 1 experts; (15) 32x32 -> 16 tokens; (17) both RL numbers (different metrics); (18) pass@k definition.
- ASR repairs used in the report: BPE, DeepSeek, NoPE, Muon, LoRA, RLOO, Claude Code, "Revision" = vision, Astra/Fable = GPT-6 Astra / Claude Fable 5.1 (secondary source); "Soul" probably GPT-5.6 Sol (kept as said).

## Open Questions & Extension Ideas

Author notes for planning ZVect lessons (Thai zero-dependency course on vectors -> embeddings -> search -> LLMs). Link points given for this clip: ch3 (tokens/BPE), ch9 (LLM input + attention), ch10 (Transformer). Other chapter numbers below (ch2 distance/dot/cosine, ch4 embeddings, ch5 nearest search, ch6 ANN/HNSW) follow the course outline and should be checked against the course's own numbering:
- **ZVect ch3 (tokens/BPE):** the byte-vs-BPE trade-off is a ready lesson: (a) `token id = byte + 4` mapping with the slide example `def in` -> 104 105 106 36 109 114; (b) Thai = 3 bytes per character, so a byte model triples sequence length for Thai; (c) a slider "V x d" showing how a 250k vocab dominates a 25.7M model (V = 260 -> 66,560 params at d = 256; V = 250,000 -> 64,000,000). Keep the fact-check caveat: the 95% is width- and tying-dependent.
- **ZVect ch4 (embeddings) and ch9 (LLM input):** "a token ID is an address" + one-hot x E = row is a clean bridge from lookup to matrix product; reuse the matrix/stepper canvas with the slide vector [0.12, -0.08, 0.31]. Tensor shape batch x tokens x dim.
- **ZVect ch2 -> ch9 (dot product in the head):** logits z = h E^T are dot products of h with every embedding row; weight tying makes "reading" and "predicting" share one geometry - a good place to reuse the cosine/dot canvas. Always say the released GLM does NOT tie.
- **ZVect ch9 (attention + position):** RoPE as rotating 2D pairs (plane figure: (1,0) at position 3 with theta = 1 rad -> (-0.990, 0.141)); relative distance falls out of the dot product of two rotated vectors. Pair with NoPE as the contrast. Sparse indexer = "cheap nearest search inside attention" - a natural link back to ch5/ch6 (top-k retrieval) worth an explicit lesson.
- **ZVect ch10 (Transformer):** block = mix -> attention -> route, mix -> MoE -> route over 4 streams; RMSNorm worked example (3, -1, 1, 9); linear vs sparse vs full comparison table; MoE 2-of-8 + shared flow.
- **ZVect ch5/ch6 link (author idea):** the sparse indexer's top-2,048 selection is the same problem as approximate nearest-neighbour search; a lesson could show attention as "search over previous tokens" and compare exact top-k with ANN.
- Open questions the source leaves: why `even` did not improve (speaker suspects a bug); whether temperature 0.20 replicates across seeds (the slide's "next question"); effect of updating more blocks vs LoRA in RL; whether weight tying itself helps small byte models (speaker: "maybe ... probably there is research").
- Statistics vocabulary the slides use without defining (for a ZVect sidebar; author definitions): seed (random-start number; different seeds = independent reruns), paired seeds (both arms share seeds, compare per-seed differences), p-value (chance of a difference this large if the arms were truly equal; < 0.05 common threshold), exact paired permutation test (swap arm labels within pairs over all permutations), bootstrap 95% interval (resample with replacement; an interval that crosses zero is compatible with no effect), McNemar/binomial (count only items that flipped; 16 gains vs 0 losses gives 2 x 0.5^16 = 0.0000305).
- Gaps in this report: the before-RL README completion is read from a low-resolution frame (`return x * * 8 0`), and differs from the spoken "X * X". Not given by the source: the 30-60% pre-training metric, the per-family metric (inferred above), the x-axis of the RL curve, the vision held-out accuracy, the text behind "17 tokens instead of 4", RoPE angles, and the RL update formula.

## Tags & Triggers

GLM-5.3-Flash, LLM from scratch, byte tokenizer, vocabulary size, embedding lookup, weight tying, RMSNorm, RoPE, NoPE, sparse attention, DeepSeek Sparse Attention, indexer top-k, linear attention, KDA, mHC, hyper-connections, mixture of experts, shared expert, vision tokens, pre-training, AdamW, Muon, reinforcement learning, RLOO, GRPO, reward design, executable verifier, pass@k, statistical significance, seeds, freeCodeCamp, Vuk Rosic.
- "Why does a small LLM use a byte tokenizer?"
- "Does GLM-5.3-Flash tie its embeddings?"
- "How does RoPE encode position?"
- "Linear vs sparse attention in GLM-5.3-Flash"
- "RLOO vs GRPO advantage"
- "Why did the RL hyper-parameter winner not replicate?"

## References

- Source clip: https://www.youtube.com/watch?v=-gfgQfw2g_E (freeCodeCamp.org, video by Vuk Rosić, 44:26, 2026-10-06)
- Repo: https://github.com/vukrosic/glm-5.3-flash-from-scratch ; REPORT.md: https://github.com/vukrosic/glm-5.3-flash-from-scratch/blob/main/REPORT.md ; slides: https://github.com/vukrosic/glm-5.3-flash-from-scratch/blob/main/slides/slides.html
- Z.ai: https://docs.z.ai/guides/llm/glm-5.3-flash ; https://z.ai/blog/glm-5.3-flash
- Hugging Face: https://huggingface.co/zai-org/GLM-5.3-Flash ; config: https://huggingface.co/zai-org/GLM-5.3-Flash/blob/main/config.json
- Hyper-Connections: https://arxiv.org/html/2409.19606v3 ; mHC: https://arxiv.org/html/2512.24880v2
- DeepSeek-V3.2 (DSA, Scaling GRPO): https://arxiv.org/pdf/2512.02556 ; GRPO (DeepSeekMath): arXiv 2402.03300
- KDA / Kimi Linear: https://www.alphaxiv.org/abs/2510.26692v2
- Weight tying: https://arxiv.org/abs/1608.05859v3
- RoPE / RoFormer (author-added): https://arxiv.org/abs/2104.09864
- GLM-4.5 (Muon usage): https://arxiv.org/pdf/2508.06471
- pass@k: https://arxiv.org/pdf/2107.03374
- GRPO/RLOO: https://huggingface.co/learn/llm-course/chapter12/3b ; https://huggingface.co/blog/putting_rl_back_in_rlhf_with_rloo
- Secondary: https://alternativeto.net/news/2025/8/google-launches-gemma-3-270m-a-compact-fine-tuning-ai-model-optimized-for-efficiency ; https://www.besthub.dev/articles/understanding-the-post-training-process-in-deepseek-v4-flash-ad5ae76c6e13 ; https://itproexpert.com/which-ai-model-to-use-sept-2026/

## Equations (LaTeX)
1. $$ P_{\text{emb}} = V \times d $$
2. $$ m = \sum_{s} \alpha_s x_s, \qquad \alpha_s \ge 0, \quad \sum_{s} \alpha_s = 1 $$
3. $$ \Delta = \mathrm{block}(m), \qquad x_s \leftarrow x_s + \beta_s \Delta $$
4. $$ h = \mathrm{RMSNorm}\left(\frac{1}{4}\sum_{i=1}^{4} x'_i\right) $$
5. $$ z = h\,E^{\top} $$
6. $$ \mathrm{RMSNorm}(x)_j = \frac{x_j}{\sqrt{\frac{1}{d}\sum_{k=1}^{d} x_k^2 + \epsilon}}\, g_j $$
7. $$ \begin{pmatrix} q'_1 \\ q'_2 \end{pmatrix} = \begin{pmatrix} \cos m\theta & -\sin m\theta \\ \sin m\theta & \cos m\theta \end{pmatrix} \begin{pmatrix} q_1 \\ q_2 \end{pmatrix} $$
8. $$ S_t = S_{t-1} + \phi(k_t)\, v_t^{\top}, \qquad o_t = \phi(q_t)^{\top} S_t $$
9. $$ L = -\log p_{y} $$
10. $$ \text{advantage}_i = \text{reward}_i - \operatorname{mean}(\text{other rewards}) $$
11. $$ A_i = \frac{r_i - \operatorname{mean}(r_1, \dots, r_G)}{\operatorname{std}(r_1, \dots, r_G)} $$
12. $$ \mathcal{L}(\theta) = -\frac{1}{G}\sum_{i=1}^{G} \text{advantage}_i \cdot \log \pi_\theta(y_i \mid x) $$
