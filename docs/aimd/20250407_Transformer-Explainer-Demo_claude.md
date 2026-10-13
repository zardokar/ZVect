# Demo Video - Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation — Polo Club of Data Science @ Georgia Tech - Claude Context
> Source: YouTube, Polo Club of Data Science @ Georgia Tech, "[Demo Video] Transformer Explainer ...", 3:24, published 2025-04-07 · https://www.youtube.com/watch?v=TFUc41G2ikY · Generated: 2026-10-13
> Companion: 20250407_Transformer-Explainer-Demo.html (Thai, iw mode `iw`, 7 sections, 9 frames + 1 own SVG)

## Processing Notes
- Mode: `iw`. Body: own-words rewrite of on-screen captions and screen content (standard YouTube license; no caption track).
- Frames used: 01_architecture, 02_overview-temperature, 03_topk-formula-card, 04_topp-formula-card, 05_generate, 06_attention-matrix, 07_attention-steps-hover, 08_mlp-matmul, 09_dropout-popover.
- Own SVG diagrams: flow.
- Transcript SHA-256 (in-page = decoded): `none (no transcript available; NO_TRACKS)`; kept in the session workspace only.

## TL;DR
A 3:24 demo clip of Transformer Explainer (Polo Club of Data Science, Georgia Tech): a web tool that runs a pre-trained GPT-2 in the user's browser and visualizes the whole forward pass as one left-to-right flow (embedding, multi-head self-attention, MLP, output probabilities). The clip has no caption track and no usable narration; everything below comes from on-screen caption bubbles and the tool's own UI. Value for ZVect: a ready-made catalogue of visuals (token rows, Q/K/V flows, a 6x6 attention matrix drawn as dots and split into Dot product / Scaling-Mask / Softmax-Dropout, probability bars with a formula card, matmul popovers with shapes).

## Key Concepts
- 0:06-0:22: purpose. Interactive visualization for beginners to learn how GPT-like LLMs turn input text into the next token. Slide at 0:12: Input Text -> Input Embedding -> [Masked Multi-Head Self-Attention -> Add & Norm -> MLP -> Add & Norm] repeated N times -> Linear & Softmax -> Output Probabilities -> Next Token. GPT-2 runs in the browser.
- 0:22 second caption: "Explore how Transformers work in your browser right now!".
- 0:30: main screen. Top bar: Examples menu, text field, Generate button, Temperature slider (0.8), Sampling radio (Top-k, k=5 / Top-p). Left to right: Embedding, "Transformer Block 1" (with prev/next arrows) containing Multi-head Self Attention (Query / Key / Value, Attention matrix, Out) and MLP, then "11 more identical Transformer Blocks", then Probabilities list. Prompt used: "Data visualization empowers users to ..." with 6 tokens (Data, visualization, em, powers, users, to). Probabilities at T=0.8, k=5: visualize 54.67%, create 20.87%, see 12.09%, make 6.26%, easily 6.11%, others 0%.
- 0:45-0:52: click "Probabilities" opens a formula card for one token ("create"): scaled logit = -136.68 / 0.8 = -170.85, Top-k filtering (k=5) keeps logit if in top 5 else -inf, softmax = exp(-170.85) divided by the sum of exp over the kept (top-5) scaled logits -> 20.87%. Side table columns: Tokens, Logits, Scaled logits, Top-k, Softmax.
- 1:00: Top-p (p=0.5) card for "visualize": logit -135.91 / 0.8 = -169.89, softmax, top-p filtering (keep 0.35 if cumulative <= 0.5 else 0), normalization 0.35 / (0.35+0.13+0.08) -> 62.39% (a division; by hand 0.35/0.56 is about 62.5%, the card rounds to two decimals). Table columns: Logits, Scaled logits, "Softmax & Top-p" (kept cells highlighted, sum=0.56 label, dropped cells struck through), Normalization (bars + %). Caption: top-p picks from the smallest set of tokens whose cumulative probability exceeds p.
- 1:15: Generate adds the next token; GPT-2 updates all values live (Temperature 2, Top-p p=0.3 shown). 1:30: user can type a custom input (example "IEEE VIS conference is ...").
- 1:45: click the attention matrix to see how tokens interact. 1:52: hover over each of three steps to see the formula and individual scores: Dot product (legend -25.3 .. 7.4), Scaling . Mask (formula tooltip QK^T/sqrt(d_k) + M; legend starts at -3.0), Softmax . Dropout (legend -1.0 .. 1.0 as read from the screen). 2:00: arrow buttons switch attention heads ("Head 2 of 12", "Head 4 of 12").
- 2:45: click a gradient path to follow a matrix multiplication step by step; "MLP Compression" popover: Expanded Embeddings (6, 3072) x Compression Weights (3072, 768) + Compression Bias (768) = Compressed Embeddings (6, 768).
- 3:00: advanced features: Dropout (tooltip: disables randomly selected neurons, used only during training, "Read more"), Residual Connections, Layer Normalization; the screen shows "Transformer Block 6" with < > arrows next to the block name (author's reading: they switch blocks). 3:18: end card with demo and code URLs.

## Implementation
Equations the tool shows (all rendered as MathML in the HTML report): (1) z'_i = z_i / T; (2) top-k filter: u_i = z'_i if i in S_k else -inf; (3) p_i = exp(u_i) / sum_j exp(u_j); (4) top-p set S_p = smallest set (sorted by p, descending) whose cumulative probability exceeds p [caption in words, symbols by the author]; (5) q_i = p_i / sum_{j in S_p} p_j with numbers (6) 0.35 / (0.35+0.13+0.08) = 62.39%; (7) S = QK^T/sqrt(d_k) + M (hover tooltip); (8) A = row-wise softmax(S) and (9) Attention(Q,K,V) = softmax(QK^T/sqrt(d_k) + M) V [author's composition; on screen only the step names]; (10) X_comp = X_exp W_comp + b_comp with shapes (6,3072), (3072,768), (768), (6,768). Mask M: 0 where attention is allowed, -inf where masked (author's definition; the screen shows grey masked cells and "+ M").
No code in the source. The following is a visualization spec read from the frames (frame files in `frames/final/`, raw in `frames/raw/`).

**Layout.** One horizontal strip, white page background, light-grey text, purple accent. Order: Embedding column, Multi-head Self Attention region, MLP region, "N more identical blocks" arrow, Probabilities column. Each token is one row; its row label is repeated at every stage (left of Embedding, at Query/Key/Value stubs, at MLP, at the output). Token vectors are drawn as thin vertical bars with a grey/colored 1-D heat strip. Band width stands for vector width, and a Sankey-like soft ribbon carries each token row from stage to stage, fanning out into Q (blue), K (red), V (green) ribbons before attention and merging into "Out". Only one block and one head is shown at once (Head k of 12 as a stack of cards, Block k with prev/next arrows).

**Attention drawing (frames 06, 07).** Q and K ribbons arrive as horizontal lines labeled with the token text, bend 90 degrees (orthogonal elbows, rounded) into a 6x6 matrix of circles. Circle fill is a single-hue purple ramp (dark = large). Value ribbon passes under the matrix and joins to Out. Under the matrix: caption "Attention" with a magnifier icon (click to expand). Expanded view: three matrices side by side with arrows between them and a caption under each ("Dot product", "Scaling . Mask", "Softmax . Dropout"), each with a tiny gradient legend "min [bar] max". The masked half is drawn in light grey (upper-right triangle). After softmax each row sums to 1, so row 1 is a single dark dot. Hover on a step shows a small white formula tooltip (QK^T/sqrt(d_k) + M); hover on a cell shows its value.

**Probability panel (frames 02, 03, 04).** Right column lists candidate tokens sorted by probability: token text, a thin purple bar, percent. The winner is bold purple; rest grey; below the cut 0%. Header "Probabilities" with magnifier -> expands into a table with columns Tokens, Logits, Scaled logits, Top-k (or "Softmax & Top-p"), Softmax/Normalization; a column toggle (eye icon on "Logits"). Struck-through grey numbers = filtered out. A white formula card (title "Probability of "<token>" token being sampled") draws the arithmetic as boxes joined by arrows: Scaled logit (fraction logit / temperature) -> filter -> Softmax (exp sum) = percent in purple.

**Matmul popover (frame 08).** A white card with title bar, close and "play" icons; matrices drawn as tiny heat grids with row labels (tokens) and the shape under each: `(6, 3072) x (3072, 768) + (768) = (6, 768)`; operator glyphs x, +, = between them; question-mark help icons next to names. Hovering an output element highlights the inputs that feed it. Step-by-step animation.

**Callouts.** The clip overlays dark rounded caption bubbles at the bottom with key words in lilac; this is video editing, not part of the tool, but the same text pattern works as a "step player" caption bar.

**Interaction model.** Temperature slider and Sampling radio (+ k or p slider) re-draw the probability list live; Generate appends the sampled token and replays the forward pass; text field re-tokenizes; click magnifier or ribbon opens a popover with the real math; hover shows formula/values; arrows switch head/block.

**Data shapes seen.** 6 tokens; d_model not shown in the clip (the MLP popover shows hidden 3072 and model width 768); 12 heads per block; "11 more identical Transformer Blocks" (12 in total); softmax candidates sorted; logits around -135 to -138 for the top tokens (raw GPT-2 logits).

**ZVect reuse.** `web/js/attention.js` (matmul, softmaxRows, causalMask, attention) can feed the 6x6 attention matrix and the three-step view (scores, scaled+masked, softmax) with the same ordering as lesson 10.2. `web/js/tblock.js` (layerNorm, encoderBlock) can feed an Add & Norm / residual view for lesson 10.4. Temperature/top-k/top-p panels need a small softmax-with-temperature helper (new; lesson 9.x LLM vectors could use it).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Model | GPT-2 (pre-trained), runs in browser | 0:12 |
| Temperature seen | 0.8, 2 | 0:30, 1:15 |
| Sampling seen | Top-k k=5; Top-p p=0.5, p=0.3 | 0:30, 1:00, 1:15 |
| Top-k result at T=0.8 | visualize 54.67, create 20.87, see 12.09, make 6.26, easily 6.11 (%) | 0:30 |
| Scaled logit example | -136.68 / 0.8 = -170.85 | 0:45 |
| Top-p example | 0.35 + 0.13 + 0.08 (sum 0.56) -> visualize 62.39% | 1:00 |
| Attention legends | Dot product -25.3..7.4; Scaling-Mask from -3.0; Softmax-Dropout -1.0..1.0 | 1:52 |
| MLP Compression | (6,3072) x (3072,768) + (768) = (6,768) | 2:45 |
| Heads | Head k of 12; "11 more identical Transformer Blocks" | 0:30, 2:00 |

## Tags & Triggers
tags: transformer, visualization, attention matrix, GPT-2, temperature, top-k, top-p, Sankey, matmul popover, Polo Club
- How does Transformer Explainer draw the attention matrix?
- What visuals show temperature and top-p sampling?
- Which UI patterns make a Transformer demo easy to follow?

## References
- Video: https://www.youtube.com/watch?v=TFUc41G2ikY (Polo Club of Data Science @ Georgia Tech, published 2025-04-07, 3:24)
- Live tool: https://poloclub.github.io/transformer-explainer
- Code: https://github.com/poloclub/transformer-explainer
- Paper (design details read for the spec): https://arxiv.org/abs/2408.04619
