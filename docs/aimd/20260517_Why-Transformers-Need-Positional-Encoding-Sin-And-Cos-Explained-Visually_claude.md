# "Why Transformers Need Positional Encoding | Sin & Cos Explained Visually" - Claude Context
> Source: YouTube, Visual AI, "Why Transformers Need Positional Encoding | Sin & Cos Explained Visually", 27:24, published 2026-05-17 · https://www.youtube.com/watch?v=42y3XeOnH78 · Generated: 2026-10-26
> Companion: 20260517_Why-Transformers-Need-Positional-Encoding-Sin-And-Cos-Explained-Visually.html (Thai, iw mode `iwd`, 13 sections, 21 frames + 15 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license), every point and number kept.
- Frames used: CH1, CH2, CH3, P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P16, P17, P18.
- Own SVG diagrams: flow, compare, flow, multiples, bars, line, algo, compare, heatmap, flow, line, line, heatmap, line, bars.
- Transcript SHA-256 (in-page = decoded): `ba9e3f0626d77e04a3403fb115e58fe1f725cafe8f3476c5011800bc529e1a94`; kept in the session workspace only.

## TL;DR

Visual AI (27:24) explains why Transformers need positional encoding and walks through the sinusoidal encoding of Vaswani et al. 2017. Self-attention compares tokens with dot products that carry no position, so with toy 3-dim embeddings (Dog [0.80, 0.20, -0.30], bites [0.10, 0.85, 0.20], man [0.30, -0.10, 0.90]) the QK^T scores of "Dog bites man" and "Man bites dog" are the same numbers permuted (dog-man = -0.05 in both). Adding PE makes them differ (dog-man 0.07 vs 0.05; dog-dog 2.17 vs 3.06). Three rejected approaches: raw index (position 100 swamps values like 0.1), normalising by N-1 (index 2 = 1.0 in a 3-word sentence but 0.33 in a 7-word one), learned position table (BERT, GPT-2; no row beyond the trained length). Sinusoidal PE: PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(same angle); worked table for d = 6; divisor 1 -> 10,000; base comparison (10 / 10,000 / 1,000,000); binary-clock analogy; 50 x 64 heatmap; dot product depends only on the gap (d = 4: 1.5403 at gap 1, 0.5837 at gap 2; d = 8: 3.54, 2.56, 1.96 at gaps 1-3). Four claimed properties: unique, bounded, relative distance, generalises.

Corrections from our checks (10 claims: 3 confirmed, 3 partly, 4 contradicted): order-blindness holds for encoder-style models but causal LMs without PE still learn position; the paper gives no reason for 10,000 and no 10,000-token limit (longest wavelength 10000·2π ≈ 62,832 positions); "generalizes perfectly" is contradicted by ALiBi (sinusoidal models extrapolate only ~+20 tokens at L = 512, ~+50 at L = 1024); "farther = lower dot product" is not monotonic (d = 4: gap 6 gives 1.96 > gap 1's 1.54); the chapter title "Why 10,000 Dimensions?" is wrong (10,000 is the base); the speaker misreads three table values (".46", ".93", ".416" for 0.046, 0.093, -0.416; the slide is correct). Not in the clip: the paper found learned and sinusoidal PE nearly identical (Table 3 row E).

## Key Concepts

1. **Order blindness (0:00-1:06).** "Dog bites man" vs "Man bites dog": a vanilla Transformer processes all tokens in parallel; self-attention dot products have no notion of position, "like tossing the words into a bag".
2. **RNNs (1:06-2:07).** Slow, hard to parallelise, weak long-term memory, but order is built in: h_t = f(h_{t-1}, x_t) over Dog, bites, man (slide "RNN — The Old Way").
3. **Permutation problem in numbers (2:07-4:26).** Slide QK^T matrices (no PE): Dog bites man rows [0.77, 0.19, -0.05], [0.19, 0.77, 0.12], [-0.05, 0.12, 0.91]; Man bites dog rows [0.91, 0.12, -0.05], [0.12, 0.77, 0.19], [-0.05, 0.19, 0.77]. The speaker says "exactly the same, just shifted" (actually permuted). With PE (3-dim sinusoidal): Embeddings + PE Dog@0 [0.80, 1.20, -0.30], bites@1 [0.94, 1.39, 0.20], man@2 [1.21, -0.52, 0.90]; Man@0 [0.30, 0.90, 0.90], dog@2 [1.71, -0.22, -0.30]; matrices [2.17, 2.36, 0.07; 2.36, 2.86, 0.59; 0.07, 0.59, 2.54] and [1.71, 1.71, 0.05; 1.71, 2.86, 1.24; 0.05, 1.24, 3.06]. Author note: the highlighted dog-man change is small (0.07 vs 0.05); the diagonal changes more.
4. **Approach 1, raw indices (4:26-5:53).** final = embedding + index; at position 100 a word vector [0.12, -0.45, 0.88, -0.05] becomes [100.12, 99.55, 100.88, 99.95]; "a whisper next to a jet engine".
5. **Approach 2, normalise (5:53-7:04).** pos / (N - 1) in [0, 1]; index 2 = 1.0 in "Dog bites man" but 0.33 in "Dog bites man during chaotic city encounter".
6. **Approach 3, learned table (7:04-8:00).** One row per position, random init, trained; BERT and GPT-2 use it (BERT 512, GPT-2 1024 positions per HF configs); slide: 5 rows pos 0-4, the sixth word "chaos" (pos 5) has no row.
7. **Design criteria (8:00-9:29).** Bounded, unique, length agnostic (10 or 10,000 words), smooth (close positions similar) -> sine and cosine at several frequencies.
8. **Formula and worked table (9:29-13:00).** Even dims sine, odd dims cosine; pos, i (pair index), d (embedding size). d = 6, "dog bites man": pos 0 [0, 1, 0, 1, 0, 1]; pos 1 [0.84, 0.54, 0.05, 1.00, 0.00, 1.00]; pos 2 [0.91, -0.42, 0.09, 1.00, 0.00, 1.00] (exact: 0.8415, 0.5403, 0.0464, 0.9989, 0.0022, 1.0000 / 0.9093, -0.4161, 0.0927, 0.9957, 0.0043, 1.0000). Divisors for d = 6: 1, 21.54, 464.2.
9. **Lookup at inference and the pipeline (13:00-15:31).** Table built once, frozen constants, rows looked up by position; longer sequences computed on the fly; learned table trained to 512 "crashes" at 600 tokens. "The dog chased the dog": tokenize -> token IDs (repeats share an ID) -> embedding lookup (repeats share a vector) -> add PE element-wise (both 6-dim) -> multi-head attention. Slide: dog embedding [-0.45, 0.40, 0.49, -0.10, -0.01, -0.09]; dog@1 -> [0.39, 0.94, 0.54, 0.90, -0.01, 0.91]; dog@4 -> [-1.21, -0.25, 0.68, 0.89, -0.00, 0.91].
10. **Wave intuition (15:31-16:58).** High-frequency pair changes fast between neighbours; low-frequency pair barely moves; a vertical slice through all waves is the PE vector (slide frequencies scaled for visibility).
11. **Why 10,000 (16:58-20:18).** Exponent 2i/d_model in [0, 1], divisor 10000^0 = 1 to 10000^1 = 10,000. Deepest pair of an 8-dim model over 100 positions: base 10 cycles ~2.8 times (period ~35), base 10,000 nearly flat (period ~6,283), base 1,000,000 frozen (period ~198,692). "Goldilocks"; speaker and slide: "unique codes up to ~10k tokens", "empirical design decision in the original paper" (not supported). Binary clock: 4-bit positions 0-7, bit 0 flips every step, bit 3 every 8 steps (slide puts bit 0 on the left, the speech says rightmost).
12. **Heatmap (20:18-21:41).** 50 positions x 64 dims; blue positive, red negative; left = high frequency ("second hand"), right = low frequency ("hour hand").
13. **Absolute and relative (21:41-24:40).** Bar charts of PE for pos 0-2; angle addition sin(a+b), cos(a+b); d = 4 table Dog [0, 1, 0, 1], bites [0.841, 0.540, 0.010, 1.000], man [0.909, -0.416, 0.020, 1.000]; PE·PE = 1.5403 (gap 1, both pairs), 0.5837 (gap 2).
14. **Four properties and outro (24:40-27:24).** Unique ((sin, cos) on the unit circle), bounded (-1 to +1), relative distance (diagonal bands: 3.54 / 2.56 / 1.96 for gaps 1-3, d = 8), generalises (positions 110, 150, 10,000 get valid encodings). Next video: encoder-only Transformer for classification, NER, sentiment. Like/subscribe outro removed.

## Implementation

Sinusoidal positional encoding, as in the clip (and the paper, Sec. 3.5):

```python
import numpy as np

def sinusoidal_pe(n_pos, d, base=10000.0):
    pe = np.zeros((n_pos, d))
    pos = np.arange(n_pos)[:, None]
    i = np.arange(d // 2)[None, :]
    angle = pos / base ** (2 * i / d)
    pe[:, 0::2] = np.sin(angle)   # even dims
    pe[:, 1::2] = np.cos(angle)   # odd dims
    return pe

x = token_embeddings + sinusoidal_pe(len(tokens), d)   # same size d, element-wise add
```

Checks an engineer can run (values from the clip, recomputed): `sinusoidal_pe(3, 6)` rows 1-2 = [0.8415, 0.5403, 0.0464, 0.9989, 0.0022, 1.0] and [0.9093, -0.4161, 0.0927, 0.9957, 0.0043, 1.0]; with d = 4, PE(0)·PE(1) = PE(1)·PE(2) = 1.5403 and PE(0)·PE(2) = 0.5837; with d = 8, gap 1/2/3 = 3.54/2.56/1.96.

Pitfalls (author notes, from the checks): PE·PE = sum_i cos(omega_i·(p - q)) depends only on the gap but is not monotonic and has no direction; extrapolation beyond the training length is poor in practice (ALiBi); learned absolute PE performs about the same at trained lengths (paper Table 3 row E); decoder-only models can learn position without PE (Haviv 2022, NoPE 2023). For long contexts consider ALiBi or RoPE.

ASR repairs (report only): none that change meaning; spoken table values ".46", ".93", ".416" are reported as misreads of 0.046, 0.093, -0.416.

## Quick Reference

| Item | Value | Time |
|---|---|---|
| Example | "Dog bites man" vs "Man bites dog" | 0:09 |
| Toy embeddings | Dog [0.80, 0.20, -0.30], bites [0.10, 0.85, 0.20], man [0.30, -0.10, 0.90] | 2:59 |
| dog-man score | -0.05 both (no PE); 0.07 vs 0.05 (with PE) | 2:59, 3:55 |
| Raw index | +100 at position 100 | 5:45 |
| Normalised | index 2: 1.0 (N = 3) vs 0.33 (N = 7) | 6:33-6:45 |
| Learned table | BERT 512, GPT-2 1024; slide 5 rows | 7:44 |
| Formula | sin(pos / 10000^(2i/d)) even, cos odd | 10:00 |
| d = 6 table | see Key Concepts 8 | 13:05 |
| Divisor | 1 -> 10,000 | 17:42 |
| Base periods (d = 8, deepest pair) | 35 / 6,283 / 198,692 positions for base 10 / 10^4 / 10^6 | 19:15 (author computed) |
| Heatmap | 50 x 64 | 20:36 |
| Dot products | d = 4: 1.5403, 0.5837; d = 8: 3.54, 2.56, 1.96 | 24:28, 25:46 |
| Paper wavelength range | 2π to 10000·2π (≈ 62,832) | fact check |

## Comparisons

| Criterion | Raw index | Normalised | Learned table | Sin/cos |
|---|---|---|---|---|
| Bounded | no | yes (0-1) | as learned | yes (-1..1) |
| Same value for a position across lengths | yes | no | yes | yes |
| Value beyond training length | yes (grows) | yes | no row | yes (but poor use, ALiBi) |
| Trained | no | no | yes | no |
| Used in | - | - | BERT, GPT-2 | original Transformer |

## Fact Check

| id | Claim | Verdict | Note | Source |
|---|---|---|---|---|
| P1 | No PE -> cannot tell the two sentences apart; scores "shifted" | partly | true for encoder-style; causal LMs learn position without PE; scores are permuted | ar5iv 1706.03762, 2203.16634; arXiv 2305.19466 |
| P2 | RNNs slow, hard to parallelise, weak long-range | confirmed | Vaswani intro | ar5iv 1706.03762 |
| P3 | BERT and GPT-2 use learned PE; run out of rows | partly | 512 / 1024 absolute positions; "learned" not stated on pages read | HF BertConfig, GPT-2 docs; ar5iv 1810.04805 |
| P4 | Sinusoidal formula from Attention Is All You Need | confirmed | wavelengths 2π..10000·2π; may extrapolate; learned ≈ sinusoidal (Table 3 E) | ar5iv 1706.03762 |
| P5 | 10,000 -> ~10,000 tokens; empirical choice in the paper | contradicted | no reason or limit in the paper; longest wavelength ≈ 62,832 | ar5iv 1706.03762 |
| P6 | Gap-only relation; closer = higher similarity | partly | gap-only true; not monotonic, no direction (TENER) | ar5iv 1706.03762, 1911.04474 |
| P7 | Generalizes perfectly | contradicted | ALiBi: ~+20 tokens at L = 512, ~+50 at L = 1024; NoPE: APE worst | arXiv 2108.12409, 2305.19466 |
| P8 | Encoder-only for classification, NER, sentiment | confirmed | BERT CoNLL-2003, SST-2 | arXiv 1810.04805 |
| P9 | "Why 10,000 Dimensions?" | contradicted | 10,000 is the base; d_model = 512 | ar5iv 1706.03762 |
| P10 | Spoken table values .46 / .93 / .416 | contradicted | correct 0.046 / 0.093 / -0.416; slide correct | author computation |

## Open Questions & Extension Ideas

- ZVect lesson 10.3 (position encoding, "clock hands") could add: the permutation demo with the clip's toy numbers (scores permute, not change), the d = 6 worked table, the base slider (10 / 10,000 / 1,000,000), and the non-monotonic dot-product-vs-gap curve as a "watch out" (author idea; owner decision).
- Not covered by the clip: RoPE, ALiBi, NoPE, relative PE (Shaw et al.), base scaling for long context.
- Open: the clip's "10,000 tokens" heuristic has no source; a test would be measuring nearest-neighbour collisions of PE vectors vs length for several bases.

## Tags & Triggers

tags: positional encoding, sinusoidal, transformer, self-attention, permutation, learned positional embeddings, BERT, GPT-2, base 10000, dot product, relative position, length extrapolation, ALiBi, RoPE

- Why does a Transformer need positional encoding?
- How is sinusoidal PE computed (worked example d = 6)?
- What does the 10,000 in the PE formula do?
- Does sinusoidal PE extrapolate to longer sequences?
- How does the PE dot product encode distance?

## References

- Source: Visual AI, "Why Transformers Need Positional Encoding | Sin & Cos Explained Visually", YouTube, 27:24, published 2026-05-17, https://www.youtube.com/watch?v=42y3XeOnH78
- Series links in the description: https://www.youtube.com/watch?v=vkhPtpUiLd8 (self-attention), https://www.youtube.com/watch?v=42L1q1Z4Ojc (multi-head attention)
- Paper: Vaswani et al., Attention Is All You Need, https://arxiv.org/abs/1706.03762 (read via https://ar5iv.labs.arxiv.org/html/1706.03762)
- Fact check: https://arxiv.org/abs/2203.16634v2 · https://arxiv.org/pdf/2305.19466 · https://arxiv.org/pdf/2108.12409 · https://ar5iv.arxiv.org/html/1911.04474 · https://arxiv.org/abs/1810.04805 · https://www.huggingface.co/transformers/v4.2.2/_modules/transformers/models/bert/configuration_bert.html · https://huggingface.co/docs/transformers/v4.35.2/model_doc/gpt2

## Equations (LaTeX)
1. $$ h_t = f(h_{t-1}, x_t) $$
2. $$ S = QK^{T} $$
3. $$ x_{pos} = e_{word} + pos $$
4. $$ p_{norm} = \frac{pos}{N-1} $$
5. $$ PE_{(pos,\,2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right) $$
6. $$ PE_{(pos,\,2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right) $$
7. $$ \frac{2i}{d_{\text{model}}} \in [0,\,1], \qquad 10000^{0} = 1 \;\longrightarrow\; 10000^{1} = 10000 $$
8. $$ \sin(\alpha+\beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta $$
9. $$ \cos(\alpha+\beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta $$
10. $$ PE_{p}\cdot PE_{q} = \sum_{i=0}^{d/2-1} \cos\big(\omega_i\,(p-q)\big), \qquad \omega_i = \frac{1}{10000^{2i/d}} $$
