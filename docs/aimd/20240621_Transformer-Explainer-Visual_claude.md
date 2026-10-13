# Transformers Explained Visually - Learn How LLM Transformer Models Work — Polo Club of Data Science @ Georgia Tech - Claude Context
> Source: YouTube, Polo Club of Data Science @ Georgia Tech, "Transformers Explained Visually: Learn How LLM Transformer Models Work", 1:28, published 2024-06-21 · https://www.youtube.com/watch?v=ECR4oAwocjs · Generated: 2026-10-13
> Companion: 20240621_Transformer-Explainer-Visual.html (Thai, iw mode `iw`, 6 sections, 7 frames + 1 own SVG)

## Processing Notes
- Mode: `iw`. Body: own-words rewrite of on-screen captions, screen content and the description's chapter list (standard YouTube license; ASR track contains only [music]).
- Frames used: 01_intro-caption, 02_temperature, 03_example-prompt, 04_attention-matrix, 05_tokens-embeddings, 06_weight-mult-start, 07_weight-mult-result.
- Own SVG diagrams: flow.
- Transcript SHA-256 (in-page = decoded): `1791d16b89c2093c8c5681f8c6f72859e4a78fc7a028f81a6c1fcf7cfc119e3c`; kept in the session workspace only.

## TL;DR
An 88-second 2024 demo clip of Transformer Explainer (the 2024 demo; the author understands it as the version before the 2025 demo, which the clip itself does not say) (Polo Club of Data Science, Georgia Tech): GPT-2 runs live in the browser and the page draws the whole forward pass as one flow. No narration (the ASR track holds only "[music]"); content is taken from caption bubbles, the frames and the description's chapter list. Most useful for ZVect: the expanded Embedding table (token id + positional encoding = input vector), the 8x8 attention-dot matrix, and the "Weight Multiplication" popover that shows matrix shapes and the per-cell sum formula for Q, K, V.

## Key Concepts
- 0:03: caption "demonstrates how text-generative models work". Page: header with Examples menu, text field, Generate, Temperature slider; columns Embedding, Multi-head Self Attention, MLP, Probabilities; arrow note "11 more identical Transformer Blocks".
- 0:08/0:10 (description chapter "Temperature controls word prediction probability"): the Temperature slider (0.6 seen) re-scales the probability list; at 0.6 for "Data visualization empowers users to": visualize 29.48%, create 12.17%, see 7.41%, make 4.09%, easily 4.01%, quickly 3.76%, explore 3.52%, find 2.62%, understand 2.00%, rest <0.01%. The top word is bold purple with a longer bar, others grey.
- 0:20 "Live GPT-2 updates all its values"; 0:27 "Pick a text prompt" (Examples menu: "As the spaceship was approaching the Earth", 8 tokens); 0:35 "Write your own text prompt" (chapter titles from the description, saved in desc.txt; captions for these moments were not in the captured frames). At 0:18 the sampled word "quickly" is highlighted (2.59%); at 0:26 text reads "... users to quickly find" with the cursor near Generate; at 0:40 the sentence ends "... Earth we" with three dots while waiting.
- 0:44-0:47: caption "explore how words interact with each other in the Self-Attention matrix": 8x8 purple dot matrix, "Dot product" with legend -29.9 .. 5.4, "Head 1 of 12". At 0:54 the next-word list for the spaceship sentence starts were 17.34%, could 16.64%, saw 12.28%, had 11.24%, with "thought" highlighted at <0.01%.
- 0:56-1:00: caption "learn how text is converted to Tokens and Embeddings". Expanded Embedding: per token row "token -> [Token Embedding strip, id] + [Positional Encoding strip, position] = [sum strip]". ids: As 5864, the 1276, spaceship 460, was 2369, approaching 2961, the 617, Earth 2186, we 5331; positions 0,1,2,... (seen up to 6).
- 1:03-1:12: caption "follow the underlying mathematical operations step by step". Popover "Weight Multiplication": Token Embedding matrix(8,768) x Q.K.V Weights matrix(768,2304) + bias vector(2304) = Q.K.V matrix(8,2304); first-cell formula (E1,1*W1,1 + E1,2*W2,1 + ... + E1,768*W768,1) + b1 = QKV1,1; general formula sum over d=1..768 of E_id*W_dj + b_j = QKV_ij. Output cells fill row by row, split into blue (Q), red (K), green (V) segments.
- 1:18-1:28: end card: "Interactive Learning of Text-Generative Models", try-it link.

## Implementation
Equations the tool shows (MathML in the HTML report): (1) x_t = e_t + pe_t (token embedding + positional encoding = sum); (2) first cell (E1,1*W1,1 + E1,2*W2,1 + ... + E1,768*W768,1) + b1 = QKV1,1; (3) sum_{d=1..768} E_id W_dj + b_j = QKV_ij; (4) QKV = E W + b with shapes (8,768), (768,2304), (2304), (8,2304); (5) QKV = [Q|K|V] is the author's reading of the three colored thirds (768 columns each = 2304 / 3).
No code in the source. Visualization spec from the frames (`frames/final/`):

**Token labels.** Every stage re-prints the token strings right-aligned next to its row, so the same row can be followed visually across Embedding, Q/K/V stubs, attention, MLP and the output stub. The last token's row continues to the Probabilities column (arrow from "we").

**Embedding expansion (frame 05).** A table, one row per token: `token -> arrow -> grey-scale vertical strip (token embedding) + id label -> + -> diverging-color strip (positional encoding, blue/red) + position label -> = -> grey strip (sum)`. Strips are 1-D heat maps of the vector (not numbers). Column headers have "?" help icons. Grey = untransformed token vector; red/blue = signed positional values.

**Q/K/V (frames 04, 06, 07).** Three ribbons per token: Q blue, K red, V green; color is kept inside the matmul popover (weight matrix split into 3 colored thirds, output split into blue | red | green). Matrix tiles are shown as heat maps with shape labels under them: `matrix(8, 768)`, `matrix(768, 2304)`, `vector(2304)`, `matrix(8, 2304)`. Operators x, +, = sit between tiles. Hover on an output cell highlights contributing inputs (per the paper); the cell formula is rendered below in LaTeX-style text.

**Attention (frame 04).** Q lines come from the top, K lines from the left/bottom, both bend with rounded elbows to the grid of circles; each circle is the dot product of one Q row and one K row; fill = purple ramp, legend `min [gradient] max` under the matrix; V ribbon passes below and merges into "Out". Stack of cards under the matrix = other heads ("Head 1 of 12").

**Probabilities (frame 02).** Right-aligned list: token, bar, percent; winner bold purple; small values grey ("<0.01%"). Updates immediately when the Temperature slider moves. Prompt text box shows the newly sampled word in purple at the end.

**Data shapes seen.** 8 tokens (spaceship sentence), d_model 768, QKV width 2304 = 3 x 768, 12 heads, 12 blocks ("11 more identical").

**ZVect reuse.** `attention.js` matmul + attention could generate the same matrices at toy size (lesson 10.2 uses 5 tokens, d = 3): a QKV popover with shapes `(n, d) x (d, 3d) + (3d) = (n, 3d)` fits 10.2/10.4. Positional-encoding strip (blue/red) fits lesson 10.3 (sin/cos).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Temperature at 0.6 | visualize 29.48, create 12.17, see 7.41 (%) | 0:10 |
| Attention matrix | 8x8, Dot product -29.9 .. 5.4, Head 1 of 12 | 0:47 |
| Token ids | As 5864, the 1276, spaceship 460, was 2369, approaching 2961, the 617, Earth 2186, we 5331 | 1:00 |
| Weight Multiplication | (8,768) x (768,2304) + (2304) = (8,2304) | 1:06 |
| Chapters (description) | 0:08 Temperature, 0:20 live GPT-2, 0:27 pick prompt, 0:35 own prompt, 0:44 attention matrix, 0:56 tokens+embeddings, 1:03 math step by step | desc |

## Tags & Triggers
tags: transformer, visualization, embedding, positional encoding, QKV, attention matrix, matmul popover, Polo Club
- How does Transformer Explainer visualize embeddings and Q/K/V?
- What shapes does the Weight Multiplication popover show?

## References
- Video: https://www.youtube.com/watch?v=ECR4oAwocjs (Polo Club of Data Science @ Georgia Tech, published 2024-06-21, 1:28)
- Live tool: https://poloclub.github.io/transformer-explainer
- Code: https://github.com/poloclub/transformer-explainer
- Paper: https://arxiv.org/abs/2408.04619
