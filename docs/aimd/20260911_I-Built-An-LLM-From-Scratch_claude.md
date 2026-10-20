# I Built an LLM from Scratch — Green Code - Claude Context
> Source: YouTube, Green Code, "I Built an LLM from Scratch", 13:36, published 2026-09-11 · https://www.youtube.com/watch?v=s9w3gtgvNSU · Generated: 2026-10-19
> Companion: 20260911_I-Built-An-LLM-From-Scratch.html (Thai, iw mode `iwd`, 10 sections, 13 frames + 15 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: S120, S126, S131, S134, S165, S166, S177, S29, S33, S39, S42, S49, S73.
- Own SVG diagrams: flow, layers, tokens, plane, shapes, timeline, stepper, algo, compare, flow, line, flow, flow, softmax, algo.
- Transcript SHA-256 (in-page = decoded): `8451b8ed4e01147b1e335175268b36abf0a065aaa2648b28b3ee885018fddc86`; kept in the session workspace only.

## TL;DR

- Green Code (episode 1 of a series) builds a GPT "from absolute scratch" in pure NumPy (no TensorFlow, no PyTorch). He treats each layer as a "Lego piece": (1) implement each layer on its own, (2) stack them. He says "there's no step three".
- Order built in the clip: text → tokens → embedding layer → scaled dot-product attention (multi-head) → layer norm (Pre-LN) → feed-forward (4× hidden, ReLU) → residual connections, block stacked N times → final linear to vocabulary size → softmax → next-token probabilities → autoregressive generation.
- The untrained model generates gibberish. Training, the backward pass, the tokenizer (BPE) and positional encoding are deferred to later episodes.
- The on-screen toy attention example (5 tokens, 4-dim Q/K) is fully self-consistent: every score equals q·k/√4, and every softmax row matches the screen to 3 decimals (recomputed by the report author). It is reusable as a worked example.
- Corrections:
  - 2014 attention was Bahdanau/Cho/Bengio, not Google.
  - The output layer is the *transpose* of the embedding matrix, not its "inverse"; in his own model the two are separate, untied matrices.
  - The on-screen "ReLU" plot is drawn wrong (negative for x < 0).
  - On-screen dimensions 786 and "784 for GPT2" conflict with GPT-2 small's 768 (the speech says 768, which is correct).

## Key Concepts

- **GPT = next-token predictor.** "all a GPT really is a next word or token predictor": text in, a lot of computation, a prediction for the next token out. On-screen example (slide only): "THE CAT IS [FAT]" (~1:56).
- **Tokens.** Math needs numbers, so text → numbers ("tokens") via tokenization. Demo at ~2:23: `tokenizer.encode("I love Green Code videos")` → `[73, 5144, 8533, 5235, 13502]`. The method is explained "throughout the series", not here. Evidence of BPE: the tokenizer is built `from_files(vocab_path=..., merges_path=...)`; at ~12:56 the notebook files are `tokenizers/AntonGPT_vocab_65k_150GB.json` and `tokenizers/AntonGPT_merges_65k_150GB.json`, with special token `"<|endoftext|>"`. The ~2:23 REPL path starts `models/to…` instead (fragments `tonGPT_vocab_`, `onGPT_merge`); the clip does not confirm that the two are the same files.
- **Embedding layer.** Token → vector. The speaker says it is "basically a way to encode the meaning of a token in a really high dimensional space". Implementation: "initialize a really big matrix where each row is the embedding of each one of the tokens".
  - Analogy example: king − man + woman gives "something very similar to" queen (2D for visualization).
  - Size: "a model like GPT2 ... 768 dimensions". On screen at ~3:13 is the Wikipedia GPT-2 table (117M/12 layers/768, 345M/24/1024, 762M/36/1280, 1542M/48/1600).
  - Toy embeddings on screen are 4-dim, e.g. "I" = [0.42144905, 0.28617467, 0.14982753, 0.01028771].
- **History as told (joke format).** 2014 RNN/LSTM + attention ("people at Google"; wrong, see Fact Check). 2017 Transformer at Google, "delete everything and keep the attention bit". 2018 GPT at OpenAI, "delete this whole yucky thing" (the encoder half).
- **Scaled dot-product attention.** "If you understand this layer, you pretty much understand GPT."
  - Each embedding goes through 3 linear layers (3 trainable matrices) → query, key, value.
  - Queries are "questions", keys are "answers". For "I love green code videos", the query for "videos" "might be" "what kind of videos", and the keys for "green" and "code" have the answer.
  - Dot product of every query with every key ("compatibility test") → score grid; divide by √(dimension of keys) ("that's why it's called scaled dot-product attention"); softmax so every row sums to 1; weighted sum of values → "context-aware embedding".
  - The speaker calls this "a toy example"; reality repeats it with different Q/K/V matrices to "ask different questions at the same time" = multi-head attention.
  - Purpose: "for information from other tokens in the sequence to be incorporated into each other".
  - Took him two days to code.
- **Layer normalization.** "Normalizes all the features, makes training stable, and makes the loss landscape way nicer." Forward pass is easy; the backward pass is hard (next video): "a whole afternoon" to understand, "another day" to implement and debug. "You can just sprinkle it in the model pretty much wherever you want. Normally you put them before the attention and the FFN layers cuz it's been proven to make training more stable."
- **Feed-forward network.** Attention = "communication phase", FFN = "computation". A nonlinear activation sandwiched between two linear layers ("a linear layer is just a matrix multiplication"); "four times as many hidden neurons as there are input ones"; ReLU: "negative inputs get crushed to zero and positive ones stay the same."
- **Residual connections.** "We add the layer's input directly to its output". This "lets the layer start as the identity function and slowly tweak its function during training, which means we can stack tons of these layers without breaking the model". He calls it "probably one of the most important ideas in AI". "Nx" = blocks stacked.
- **Output head.**
  - A final linear layer converts embedding dimension → vocabulary size ("this could be like 50,000 for example").
  - It is "pretty much the opposite of the embedding layer"; the parameter matrices are "pretty much the same, just inverted".
  - The raw scores are "a bit arbitrary", not probabilities, so a final softmax is applied.
- **Generation.** Feed "green code videos are ..." → predict the next token → append it → repeat. The untrained model gives gibberish; training is the next video.

## Implementation

### Code shown on screen (verbatim as visible; "…" marks text hidden by the presenter cartoon, not a guess)

Tokenizer REPL (~2:23; the first 3 lines are covered by the cartoon in the middle; the fragments that reappear to its right before the screen edge, `tonGPT_vocab_` and `onGPT_merge`, are copied as shown. A "[" glyph at the left edge of the terminal lines is a terminal artifact and is omitted):

```text
...             vocab_path="models/to…tonGPT_vocab_…
...             merges_path="models/to…onGPT_merge…
...             special_tokens=["<|endo…
...     )
>>>
>>>
>>> text = "I love Green Code videos"
>>>
>>> tokenizer.encode(text)
[73, 5144, 8533, 5235, 13502]
>>>
```

`gpt.py` class `MultiHeadAttention` (~6:55; lines 158–159 and 166–193 visible, lines 160–165 scrolled away, the code continues below line 193):

```python
class MultiHeadAttention:
    def __init__(self, dim_in, dim_out, n_heads):
        self.value_linear = Linear(dim_in, dim_out, include_bias=False)
        self.softmax = Softmax()
        self.final_projection = Linear(dim_out, dim_out, include_bias=False)

        # Save for backprop
        self.queries_matrix = None
        self.keys_matrix = None
        self.values_matrix = None
        self.attention_weights = None

    def forward(self, inputs, mask = None):
        B, T, D = inputs.shape

        queries = self.query_linear.forward(inputs)
        keys = self.key_linear.forward(inputs)
        values = self.value_linear.forward(inputs)

        # (B, token_length, number_heads, head_dimension)
        queries = np.reshape(queries, (B, T, self.n_heads, self.dim_out // self.n_heads))
        keys = np.reshape(keys, (B, T, self.n_heads, self.dim_out // self.n_heads))
        values = np.reshape(values, (B, T, self.n_heads, self.dim_out // self.n_heads))

        # (B, number_heads, token_length, head_dimension)
        queries = np.transpose(queries, axes=[0, 2, 1, 3])
        keys = np.transpose(keys, axes=[0, 2, 1, 3])
        values = np.transpose(values, axes=[0, 2, 1, 3])

        attention_scores = queries @ np.transpose(keys, axes=[0, 1, 3, 2])
```

`gpt.py` class `LayerNorm` (~8:20). Lines 94–95 are a sticky header, lines 108–122 are visible, `backward` (line 122) and `class Softmax` (line 152) are folded, and lines 96–107 are not on screen (so the initial values of `gain` and `bias` are not visible). The indentation is copied from the screen (4 spaces per level):

```python
class LayerNorm:
    def __init__(self, input_dim):
        # Gradients
        self.grad_gain = np.zeros(self.gain.shape)
        self.grad_bias = np.zeros(self.bias.shape)

    def forward(self, inputs):
        epsilon = 1e-5
        self.mean = (1 / self.input_dim) * np.sum(inputs, axis=-1, keepdims=True)
        self.mu = inputs - self.mean
        self.var = (1 / self.input_dim) * np.sum(np.square(self.mu), axis=-1, keepdims=True)
        self.std = np.sqrt(self.var + epsilon)
        self.out = self.gain * (self.mu / self.std) + self.bias

        return self.out

    def backward(self, prev_grad):···

class Softmax:···
```

Note: in this code `self.mu` is x − mean (the centred input), not the mean.

`TransformerBlock` (~11:19, complete on screen):

```python
class TransformerBlock:
    def __init__(self, dim_model, n_heads, ln_position="pre", res_weight_init_scale = 1):
        self.ln_position = ln_position

        self.multi_head_attention = MultiHeadAttention(dim_model, dim_model, n_heads) # Masked
        self.layernorm1 = LayerNorm(dim_model)

        self.ffn = FeedForwardNetwork(dim_model, 4 * dim_model, dim_model)
        self.layernorm2 = LayerNorm(dim_model)

        # Residual Stream Scaling
        self.ffn.linear2.weights *= res_weight_init_scale
        self.multi_head_attention.final_projection.weights *= res_weight_init_scale

    def forward(self, inputs, mask_attention = None, padding_mask = None):
        if self.ln_position == "post":
            out = inputs + self.multi_head_attention.forward(inputs, mask=mask_attention)
            out = self.layernorm1.forward(out)

            out = out + self.ffn.forward(out)
            out = self.layernorm2.forward(out)

        elif self.ln_position == "pre":
            out = inputs + self.multi_head_attention.forward(self.layernorm1.forward(inputs), mask=mask_attention)
            out = out + self.ffn.forward(self.layernorm2.forward(out))

        return out

    def backward(self, prev_grad):
        if self.ln_position == "post":
            prev_grad = self.layernorm2.backward(prev_grad)
            prev_grad = prev_grad + self.ffn.backward(prev_grad)

            prev_grad = self.layernorm1.backward(prev_grad)
            prev_grad = prev_grad + self.multi_head_attention.backward(prev_grad)

        elif self.ln_position == "pre":
            prev_grad = prev_grad + self.layernorm2.backward(self.ffn.backward(prev_grad.copy()))
            prev_grad = prev_grad + self.layernorm1.backward(self.multi_head_attention.backward(prev_grad.copy()))

        return prev_grad
```

Generation notebook `speak.ipynb` (~12:56). The function name before `dy_inference` is covered by the hand (do not assume "greedy"), and the closing parenthesis of `print(` is hidden:

```python
from tokenizer import Tokenizer

tok = Tokenizer.from_files(
    vocab_path="tokenizers/AntonGPT_vocab_65k_150GB.json",
    merges_path="tokenizers/AntonGPT_merges_65k_150GB.json",
    special_tokens=["<|endoftext|>"]
)

print(
    …dy_inference("Green Code videos are ", model=anton, tokenizer=tok, seq_len=64)
```

Visible output (start hidden by the hand, end runs off screen): `…cy entrepreneurship entrepreneurshipTimerTimerTimer();();(); Odys fragrant fragrant fragrantoose levers feb febircirc Pros`

### Parameter shapes shown on screen

- Embedding matrix slide (~3:23): `(50000, 786)`, labelled VOCAB SIZE × EMBEDDING DIMENSION, rows "HELLO", "AND", "PLZ SUB", …, "GOODBYE", "RANDOM", "TOKENS" with values in [0, 1].
- REPL (~12:01): `gpt.embedding_decoder.embeddings` has `shape=(50000, 784)`; `gpt.final_linear.weights` has `shape=(784, 50000)`. The values differ (first entries 0.01890181 vs 0.02110723), so his model is **untied**.
- Output-head slide (~11:49): FINAL EMBEDDING `[0.27130259 -0.01988615 0.53299286 0.27768769]` with the note "DIM=4 here, but it could be 784 for GPT2 for example". TOKEN LOGITS (RAW SCORES): AND 0.662, ACROSS -1.923, BANK 1.130, BECAUSE 0.416, …, RAINBOW 0.594, WISE -0.816, YOUTH 0.662.

### Worked attention example (exact on-screen numbers, ~5:49–5:58; recomputed by the report author)

Q (rows = query token; 4 dims):
- I = [0.15234912, 0.21847192, 0.85129344, 0.72314561]
- love = [0.18274519, 0.11985324, 0.91234855, 0.61294851]
- Green = [0.72149581, 0.65123954, 0.11245872, 0.23194857]
- Code = [0.81234958, 0.79182345, 0.19834571, 0.15239485]
- videos = [0.89241512, 0.94123188, 0.10231455, 0.05123984]

K:
- I = [0.1421449, 0.08617467, 0.84982753, 0.91028771]
- love = [0.21179163, 0.1357036, 0.76646933, 0.81767319]
- Green = [0.91211011, 0.89332838, 0.26831496, 0.13976226]
- Code = [0.87225013, 0.95945032, 0.18244774, 0.07052077]
- videos = [0.10205416, 0.16038436, 0.85930731, 0.88813638]

Scaled scores QKᵀ/√4 (rows = query; cols = key I, love, Green, Code, videos). The screen shows the visible cells; the presenter covers the middle of the grid at ~5:55. All cells are computed:

| query | I | love | Green | Code | videos |
|---|---|---|---|---|---|
| I | 0.711 | 0.653 | 0.332 | 0.274 | 0.712 |
| love | 0.685 | 0.628 | 0.302 | 0.242 | 0.683 |
| Green | 0.233 | 0.259 | 0.651 | 0.646 | 0.240 |
| Code | 0.245 | 0.278 | 0.761 | 0.758 | 0.258 |
| videos | 0.171 | 0.219 | 0.845 | 0.852 | 0.188 |

Softmax per row (identical to the screen):

| query | I | love | Green | Code | videos |
|---|---|---|---|---|---|
| I | 0.234 | 0.221 | 0.160 | 0.151 | 0.234 |
| love | 0.234 | 0.221 | 0.160 | 0.151 | 0.234 |
| Green | 0.165 | 0.169 | 0.251 | 0.249 | 0.166 |
| Code | 0.157 | 0.162 | 0.262 | 0.261 | 0.158 |
| videos | 0.143 | 0.150 | 0.280 | 0.282 | 0.145 |

- Rows I and love are identical after softmax because their score rows differ by an almost constant ≈ 0.03 (softmax is shift-invariant). This is a nice teaching point.
- The "videos" row puts the most weight on Green (0.280) and Code (0.282), which matches the spoken example.
- The grid is **not causally masked** (upper triangle non-zero), although every architecture slide says "Causal Multi-Head Attention" and the code accepts `mask`.
- The screen labels √d_k as "EMBEDDING DIMENSION". In the toy example d_k = d_model = 4. With h heads, d_k = d_model / h (the code uses `self.dim_out // self.n_heads`).
- On-screen softmax formula: softmax(z)_i = e^{z_i} / Σ_{j=1}^{K} e^{z_j}.

### Equations used in the report (LaTeX, each once)

king/queen analogy (author's notation of the spoken example):

$$ v_{\text{king}}-v_{\text{man}}+v_{\text{woman}}\approx v_{\text{queen}} $$

scaled scores, as on screen (~5:55):

$$ \frac{QK^T}{\sqrt{d_k}} $$

softmax, as on screen (~5:58):

$$ \mathrm{softmax}(\mathbf{z})_i=\frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}} $$

layer norm as implemented in the on-screen code (author's notation; gamma = gain, beta = bias):

$$ \mathrm{out}=\gamma\odot\frac{x-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta $$

ReLU as spoken (author's notation):

$$ \mathrm{ReLU}(x)=\max(0,x) $$

residual connection as spoken (author's notation; the screen labels the box F(x)):

$$ y=x+F(x) $$

### Hyper-parameters / settings stated or shown
- LayerNorm `epsilon = 1e-5`, normalized over `axis=-1`, with trainable `gain` and `bias`.
- FFN hidden = `4 * dim_model`; activation ReLU (speech).
- The value and output projections have `include_bias=False` (the query/key lines 160–165 are not visible).
- `ln_position="pre"` by default (`"post"` is supported); `res_weight_init_scale = 1` by default (residual-stream scaling of `ffn.linear2.weights` and `final_projection.weights`).
- Vocab 50000 and d_model 784 in his model (REPL); the tokenizer files are named 65k; generation `seq_len=64`.
- **Not given in the clip:** the number of heads `n_heads` and the number of stacked blocks N of his model. The toy attention grid is single-head; the ~10:08 stacking slide draws four blocks as an illustration only (counted by the report author from the scene thumbnail). A fast, blurred code montage at ~12:25 shows `class GPT` with `__init__(self, vocab_size, blocks, dim_model, n_heads, ln_position="pre")`, a `# Decoder` comment and `self.decoder_blocks`, but no values (read by the report author from a blurred frame). (GPT-1 / GPT-2 small use 12 blocks and 12 heads × 64; fact check, not the clip.)
- The same ~12:25 montage shows a `class PositionalEncoding` with `pe_sin = np.sin(inner)` and `pe_cos = np.cos(inner)`, so his positional encoding is probably sinusoidal (read by the report author from a blurred frame; the speech defers positional encoding to the next episode).
- The softmax temperature slider in the Thai report (t from 0.1 to 3, start 1) is the report author's addition, not from the clip.

### Pitfalls the speaker states
- From-scratch NumPy is "like building a Lego castle where all the pieces are on fire"; one broken piece and "the whole castle explodes into a million NaN values".
- The LayerNorm backward pass is hard. On-screen commits: 2026-06-19 "LayerNorm + Testing (dang the backward pass for Layernorm is hard man)" and 2026-06-25 "Okay apparently I'm dumb and I had a huge bug on my LayerNorm". Attention commits from 2026-06-22 to 2026-06-24 include "Forward pass MultiHeadAttention + Softmax", "I actually cooked with MultiHead backprop I can't lie", "Bug Fixes" and "Implemented CrossAttention".

## Quick Reference

| item | value | time |
|---|---|---|
| framework | pure NumPy; no TensorFlow, no PyTorch | ~0:31 |
| pieces counted | FFN 1, LayerNorm 2, attention 1, softmax 1 ("pretty much it") | ~1:05 |
| token ids "I love Green Code videos" | [73, 5144, 8533, 5235, 13502] | ~2:23 |
| GPT-2 embedding dim (speech) | 768 (GPT-2 small only) | ~3:11 |
| GPT-2 sizes table (screen) | 117M/12/768 · 345M/24/1024 · 762M/36/1280 · 1542M/48/1600 | ~3:13 |
| embedding matrix (screen) | (50000, 786) | ~3:23 |
| attention score | QKᵀ/√d_k, then row softmax | ~5:26–5:58 |
| toy example | 5 tokens, d_k = 4, √d_k = 2 | ~5:49 |
| LayerNorm epsilon | 1e-5 | ~8:20 |
| LN placement | before attention and FFN (Pre-LN) | ~8:42 |
| FFN hidden | 4 × input | ~9:12 |
| activation | ReLU | ~9:12 |
| vocab (speech example) | "like 50,000" | ~11:44 |
| his matrices | embedding (50000, 784), final linear (784, 50000), untied | ~12:01 |
| tokenizer files | AntonGPT vocab/merges 65k, 150GB | ~12:56 |
| generation | prompt "Green Code videos are ", seq_len=64 | ~12:56 |
| compute budget (series) | $5,000 compute credits for the final model "Anton" | ~0:18 |

## Comparisons

- **Attention vs FFN.** Communication between tokens vs per-token computation; both are in every block.
- **Post-LN vs Pre-LN** (screen ~8:47: "ORIGINAL GPT (Post-LN)" vs "MODERN GPT (Pre-LN)").
  - Post: `out = LN(x + Attn(x))`, then `LN(out + FFN(out))`.
  - Pre: `x + Attn(LN(x))`, then `out + FFN(LN(out))`.
  - The speaker uses Pre-LN, "proven to make training more stable". Fact check: the 2017 Transformer and GPT-1 are Post-LN; GPT-2 onward is Pre-LN plus a final `ln_f`.
- **Embedding layer vs final linear.** Token → vector vs vector → a score per vocab token. Same shape transposed; tying them into one matrix is optional (GPT-1/2 tie, his model does not).

## Fact Check

16 content claims checked: confirmed 10 · partly 5 · not found 0 · contradicted 1. Four fundraiser/sponsor claims were checked and omitted because that segment is stripped.

| # | claim | verdict | correct statement |
|---|---|---|---|
| 1 | GPT = FFN, 2 LN, attention, softmax, "pretty much it" | partly | that is one block + output softmax; a GPT also has token and position embeddings, N stacked blocks, final LN (`ln_f`, GPT-2), final linear |
| 2 | king − man + woman ≈ queen | confirmed | Mikolov et al. 2013; holds when the input words are excluded as answers (Nissim et al. 2020) |
| 3 | GPT-2 is 768-dim | partly | GPT-2 small only; Medium 1024, Large 1280, XL 1600 |
| 4 | embedding = big matrix, row per token | confirmed | GPT-2 `wte` 50,257 × 768 |
| 5 | 2014 attention from Google | **contradicted** | Bahdanau (Jacobs Univ. Bremen), Cho, Bengio (Montréal), arXiv 1409.0473, 1 Sep 2014 |
| 6 | 2017 Google Transformer | confirmed | Vaswani et al.; still encoder-decoder |
| 7 | 2018 OpenAI GPT keeps one part | confirmed | GPT-1, 11 June 2018, 12-layer decoder-only, masked self-attention |
| 8 | divide by √d_k; softmax rows sum to 1 | confirmed | softmax(QKᵀ/√d_k)V |
| 9 | multi-head = several Q/K/V sets | confirmed | GPT-1/GPT-2 small: 12 heads × 64 dims |
| 10 | LN before attention/FFN is more stable | confirmed | Pre-LN (GPT-2); Xiong et al. ICML 2020 |
| 11 | FFN hidden 4× | confirmed | GPT-1 768 → 3072; Transformer 512 → 2048 |
| 12 | ReLU in the FFN | partly | ReLU = 2017 Transformer; GPT-1/2 use GELU |
| 13 | residual → starts as identity → stack many | partly | only if F(x) ≈ 0 at init; GPT-2 scales residual weights by 1/√N |
| 14 | vocab "like 50,000" | confirmed | GPT-2 50,257; GPT-1 BPE 40,000 merges |
| 15 | matrices "pretty much the same, just inverted" | partly | transpose, not inverse; weight tying is a design choice |
| 16 | append predicted token and repeat | confirmed | autoregressive decoding; sampling method not stated |

Errors found by the report author on screen (not in the fact-check table):
- (a) The "ReLU Activation Function" plot at ~9:22 is negative for x < 0 (about −2.5 at x = −3). True ReLU is 0 there.
- (b) The dimension labels 786 (~3:23) and "784 for GPT2" (~11:49) are wrong for GPT-2 (768). 784 is his own model's width.
- (c) The positional encoding is on every architecture slide and tagged "(NEXT EPISODE)" at ~9:50; the speech never mentions it.
- (d) "Causal" is on screen and in the code (`# Masked`, `mask=`), but the toy grid and the speech ("all possible combinations") are unmasked.

## Open Questions & Extension Ideas

Author notes for planning ZVect lessons (Thai, zero-dependency web course; chapters 1–10). The chapter 3 link is thin in this episode.

- **ch1 vectors / ch4 embeddings.** Use the king/queen plot coordinates read from the screen (approximate):
  - king (0.32, 0.77), man (0.87, 0.24), woman (0.69, 0.33), queen (0.12, 0.86).
  - king − man + woman = (0.14, 0.86), which lands next to queen.

  A draggable 2D demo fits ch1/ch4. Add the caveat that real analogy search excludes the input words, which leads into ch5.
- **ch2 dot product / cosine.** The attention grid is a ready-made dot-product exercise with verifiable numbers (Q/K above): "compute q_I · k_I = 1.422; ÷ √4 = 0.711". It also shows why scaling exists.
- **ch3 tokens/BPE (thin here).** The episode only shows `tokenizer.encode` → ids and the vocab/merges file names (65k vocab trained on "150GB"). The BPE mechanics are promised for a later episode of the series; check that episode before writing ch3 from this series.
- **ch5 nearest search.** The king − man + woman lookup is a nearest-neighbour query (cosine over the vocabulary), a natural bridge from ch4 to ch5.
- **ch9 LLM input + attention.**
  - Show token ids → embedding-row lookup (the matrix (vocab, d_model) and "pick row 73").
  - Use the 5×5 worked example. Rows I and love give the same weights only to 3 dp: their scores differ by a nearly constant 0.025–0.032 per cell, so this shows approximate (not exact) shift invariance.
  - Add a causal-mask exercise: recompute the grid with the upper triangle masked (scores above the diagonal set to −∞ before softmax). For row "I" the result is [1, 0, 0, 0, 0]; for row "videos" it is unchanged. Pitfall to state explicitly: setting masked scores to 0 is wrong, because e^0 = 1 still gives those cells weight.
  - Show multi-head reshape/transpose shapes from the code: (B, T, h, d/h) → (B, h, T, d/h).
- **ch9 output.** Logits → softmax with the 7 on-screen logits; a temperature slider is an author addition (the clip never mentions temperature or the sampling method).
- **ch10 Transformer.**
  - Use the `TransformerBlock` code as the canonical Pre-LN vs Post-LN example.
  - Teach the residual identity argument with its caveat (needs F(x) ≈ 0 at init; `res_weight_init_scale`, and GPT-2's 1/√N, where N counts residual layers = 2 per block (after attention and after FFN), not the Nx block count). The on-screen F(x) brace at ~9:50 is mostly covered by the cartoon.
  - Teach the FFN 4× expansion and weight tying (transpose).
- **Gaps to fill from other sources (the clip omits them):**
  - positional encoding (promised for the next episode);
  - the causal mask in the explained math;
  - GELU vs ReLU;
  - the final `ln_f`;
  - the backward pass (next video);
  - training and the sampling strategy.

  The Thai report fills some of these as labelled author notes (not from the clip): positional encoding (sin/cos in 2017, learned position embeddings in GPT-1/2), GELU = x·Φ(x), loss/gradient/backward pass, temperature as softmax(z / t), greedy vs sampling vs top-k/top-p, and `padding_mask` (read from the name only).
- **Open question:** is the 65k tokenizer in `speak.ipynb` the same model as the 50000-row embedding at ~12:01? The clip does not say.

## Tags & Triggers

GPT from scratch, NumPy transformer, scaled dot-product attention worked example, multi-head attention reshape, LayerNorm forward NumPy, Pre-LN vs Post-LN, FFN 4x, ReLU vs GELU, residual connection identity, weight tying transpose, next-token generation loop, Green Code.

Triggers:
- "How do I implement a GPT block in NumPy?"
- "Give me a verifiable attention example with numbers"
- "What is the difference between Pre-LN and Post-LN?"
- "Is the output layer the inverse of the embedding matrix?"

## References

- Source: Green Code, "I Built an LLM from Scratch", YouTube, 13:36, 2026-09-11. https://www.youtube.com/watch?v=s9w3gtgvNSU
- Resources named in the video description: Stanford CS336 https://cs336.stanford.edu/ ; Sebastian Raschka, Build a Large Language Model (From Scratch) https://sebastianraschka.com/llms-from-scratch/ ; Andrej Karpathy's YouTube https://www.youtube.com/@AndrejKarpathy
- Shown on screen: Wikipedia "GPT-2" architecture table (https://en.wikipedia.org/wiki/GPT-2); Welch Labs video "The most cited paper of the century is a brilliant hack" (no link given).
- Fact-check sources:
  - Bahdanau, Cho, Bengio, arXiv 1409.0473: https://arxiv.org/abs/1409.0473v1
  - Vaswani et al. 2017: https://ar5iv.labs.arxiv.org/html/1706.03762
  - Radford et al. 2018 (GPT-1): https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf ; https://openai.com/index/language-unsupervised/
  - Hugging Face GPT-2: https://huggingface.co/docs/transformers/model_doc/gpt2 ; https://huggingface.co/transformers/v2.0.0/_modules/transformers/modeling_gpt2.html
  - Mikolov, Yih, Zweig 2013: https://aclanthology.org/N13-1090.pdf
  - Nissim et al. 2020: https://www.arxiv.org/pdf/1905.09866
  - Xiong et al. ICML 2020: https://proceedings.mlr.press/v119/xiong20b.html
  - Secondary: https://PapersWithCode.com/method/gpt-2 ; https://mintlify.wiki/karpathy/nanoGPT/api/gpt-config
- Author-added references (for the Thai report's author notes, not cited in the clip):
  - He et al., Deep Residual Learning for Image Recognition (2015): https://arxiv.org/abs/1512.03385
  - Li et al., Visualizing the Loss Landscape of Neural Nets (2018): https://arxiv.org/abs/1712.09913
  - Hendrycks, Gimpel, Gaussian Error Linear Units (GELUs): https://arxiv.org/abs/1606.08415

Processing notes:
- Own-words rewrite (standard YouTube license).
- Stripped: the fundraiser segment (7:14–7:57), the sponsor read (10:13–11:16) and the closing donations/thanks (12:58–13:36).
- Frames were taken at the sheet thumbnail instants (x.5 s) because the clip is fast-cut.
- Caption repairs: "Chad GPT" = ChatGPT; "GBT/GPD" = GPT; "Numpai/Numbai" = NumPy; "scale.product" = scaled dot-product; "quers" = queries; "non values" = NaN values; "lost landscape" = loss landscape.
