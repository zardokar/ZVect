# How Does the Transformer Encoder Actually Work? Complete Visual Breakdown - Claude Context
> Source: YouTube, Visual AI, "How Does the Transformer Encoder Actually Work? Complete Visual Breakdown", 29:38, published 2026-05-25 · https://www.youtube.com/watch?v=Zub3YvvUoR4 · Generated: 2026-10-24
> Companion: 20260525_How-Does-The-Transformer-Encoder-Actually-Work.html (Thai, iw mode `iwd`, 24 sections, 29 frames + 30 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license), every point and number kept.
- Frames used: P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29.
- Own SVG diagrams: flow, flow, tokens, shapes, shapes, tokens, flow, matrix, shapes, softmax, heatmap, shapes, algo, flow, compare, flow, shapes, algo, algo, layers, multiples, tokens, tree, tokens, flow, tokens, plane, tokens, tokens, tree.
- Transcript SHA-256 (in-page = decoded): `793f35060064444ab867e33c420b8728f5a5b6e1feb74bd70de20c3f4abadf9c`; kept in the session workspace only.

## TL;DR

- The video traces one Transformer encoder block with toy numbers on the sentence "Apple released new phones" (4 tokens, d_model = 6, 3 heads, d_k = 2): tokenize -> embedding lookup (X, 4x6) -> add sinusoidal positions P -> multi-head self-attention -> Z -> residual X + Z -> LayerNorm -> FFN 6 -> 24 -> 6 -> residual + LayerNorm; every main stage keeps the 4x6 shape.
- The block is stacked 6 times (original paper), blocks share structure but not weights; outputs feed five encoder-only tasks (classification via CLS, NER, semantic search, extractive QA, masked LM).
- Fact check of 30 claims: 25 confirmed, 5 partly (BERT vocab is ~30k not 50k; "permutation-invariant" should be permutation-equivariant; the padding argument for LayerNorm over BatchNorm is not the sources' reason; ReLU is not the only non-linearity; FFN ~2/3 of params holds per encoder layer only, ~39% of the whole base model).
- Author checks: the on-screen numbers are illustrative per scene, not one consistent computation (X changes between the embedding and positional scenes; recomputed head-1 scores from the shown X and W_q1/W_k1 do not match the shown scores; the head-3 numbers do not show the claimed focus on "Apple" and "released").

## Key Concepts

- Encoder's single job: raw sentence in, one context-aware vector per token out (same count in and out).
- Tokenization: split into tokens, map each to an integer ID from the vocabulary. Toy IDs: Apple 3, released 2, new 1, phones 4.
- Embedding: a learned lookup table W_e (V x D), randomly initialised and trained; the ID selects a row. Rows of X follow sentence order. Toy vocab V = 4; real models ~30k / ~50k / >100k entries.
- d_model: embedding width, a hyperparameter chosen before training; larger = more information per token but more compute and memory. Rows = tokens, columns = learned features.
- Positional encoding: fixed sine/cosine table P computed once, one unique row per position, added element-wise: Input = X + P. Needed because self-attention processes tokens in parallel and is order-blind (precise term: permutation-equivariant).
- Encoder block = two main operations: multi-head self-attention (tokens interact) and a position-wise feed-forward network (each token independently, run as one batched matrix).
- Query / key / value (speaker's framing): query = "what am I looking for", key = "what information do I contain", value = "what information should I pass on".
- Scaling by sqrt(d_k): keeps dot products from pushing softmax into regions with very small gradients. Softmax is row-wise, so each row of attention weights sums to 1.
- Concatenation + W_O: head outputs (4x2 each) are placed side by side (4x6) and mixed by a 6x6 linear layer W_O ("a mixer") into Z, same shape as X.
- Residual (skip) connection: add the block input X element-wise to Z; the input is never lost and gradients flow back through the shortcut, which lets Transformers go very deep.
- LayerNorm: per row (per token vector), subtract the mean, divide by the standard deviation, then scale by gamma and shift by beta (learnable, initialised to 1 and 0). The video sets gamma = 1, beta = 0 for its walkthrough.
- LayerNorm vs BatchNorm (video's argument): BatchNorm computes statistics per column across the batch, so padding zeros enter the mean; LayerNorm computes per row inside one sequence, so other sequences and their padding have no effect.

Sections 13-24 of the report (video 15:39-29:38): the second half of one encoder block, stacking, and what encoder outputs are used for. All matrices use the video's toy example: the sentence "Apple released new phones", 4 tokens, d_model = 6.

- **Feed-forward network (FFN), s13.** Processes each token independently but as one batched 4x6 matrix. Formula on the slide: FFN(X) = max(0, XW1 + b1)W2 + b2, with Linear1: R^6 -> R^24, ReLU, Linear2: R^24 -> R^6. The hidden layer is 4x d_model ("scratch space" in the speaker's words). Speaker's claims: attention "only mixes" while the FFN "transforms"; the ReLU supplies the non-linearity; FFN layers hold "around 2/3" of all Transformer parameters. Output is still 4x6 with every value changed. On the slide the FFN input is written X, but it is the first add & norm output, which the speaker later calls H.
- **Second add & norm, s14.** Output = LayerNorm(H + FFN(H)): the FFN input is added back element-wise (second residual), then per-row layer norm (mean 0, std 1; gamma = 1, beta = 0 in the walkthrough). One block = self-attention -> add & norm -> feed-forward -> add & norm (post-norm). Slide values: Apple row entering the FFN -1.40, -0.22, +0.00, -0.04, -0.33, +1.98; Apple row of the final block output +0.33, -1.42, +0.24, +0.25, -1.03, +1.64.
- **Full trace of one block, s15.** text -> token IDs -> embeddings + positional encoding = X -> multi-head attention = Z -> H = LayerNorm(X + Z) -> F = FFN(H) -> LayerNorm(H + F). The speaker first calls the first add & norm output "A", then "H"; the slide says "LayerNorm 1 Output H". Shape is 4x6 at every point.
- **Stacking, s16.** The original paper stacks the block N = 6 times; the output of block k is the input of block k+1. Early blocks capture adjacency, later blocks "subject, object, intent" (speaker's description). Positional encoding is added once; the speaker argues it survives because every residual adds the block input (which carries position) back.
- **What stacking buys, s17.** Output heat maps of blocks 1-6 (colours only, no values on screen): block 1 faint and uniform, block 3 distinct signatures, block 6 vivid. Blocks share structure but not weights. Attention block 1 vs block 4 (values legible on the slide, rows = attending token, each row sums to 1):
  - block 1: Apple [0.30, 0.25, 0.22, 0.23], released [0.24, 0.28, 0.25, 0.23], new [0.22, 0.24, 0.30, 0.24], phones [0.23, 0.23, 0.24, 0.30]
  - block 4: Apple [0.75, 0.10, 0.10, 0.05], released [0.25, 0.60, 0.10, 0.05], new [0.05, 0.10, 0.35, 0.50], phones [0.45, 0.35, 0.05, 0.15]
  Quote: "The stacking is not repetition, it is specialization." More layers = more capacity, six levels of feature abstraction.
- **Encoder output, s18.** Final 4x6 matrix (slide Apple row +1.24, +0.63, -1.17, +0.92, -0.35, +0.58). The speaker reads the rows as roles: Apple = brand name, released = action/verb, new = adjective modifying phones, phones = object. Every row knows the full sentence and still its position.
- **Five uses, s19.** Classification (one vector for the whole sentence), NER (every vector, one label per word), semantic search (compare sentence meanings), question answering (find the answer span in a paragraph), masked language modelling (predict missing words from both sides). "All of these can be powered by encoder outputs alone."
- **Classification with [CLS], s20.** A special [CLS] token is prepended as a blank slot; over six layers it attends to all tokens and is influenced by them; its final vector is the sentence embedding -> small linear layer + softmax -> class (e.g. positive / negative). Slide example "This movie was absolutely brilliant" with [CLS] attention 4 %, 12 %, 4 %, 32 %, 48 % (slide only, not spoken).
- **NER, s21.** One label per token, each token classified on its own because its vector already carries sentence context. Example: Elon, Musk = PERSON; SpaceX = ORGANIZATION; 2002 = DATE; founded, in = no label.
- **Semantic search, s22.** Encode, average the token vectors into one sentence vector ("one meaning arrow"), compare by angle. "heart attack" query vs "myocardial infarction" document: cosine 0.94 (toy value); "chocolate cake" document points elsewhere, low similarity.
- **QA and MLM, s23.** QA: question and paragraph are read together; the encoder predicts the start and end word of the answer span ("Apple released new phones in California." / "Where?" -> California). MLM: hide a word and infer it from left and right context at once ("The [MASK] barks", slide shows dog 82 %, cat 9 %, car 1 %); decoder-only models can only look left.
- **Transformer family, s24.** Encoder-only (BERT, RoBERTa, Sentence-BERT): reading machines that classify, search, extract, tag. Encoder-decoder: read with the encoder, generate with the decoder. Decoder-only: no encoder, generate one word at a time left to right. Slide-only names: T5, BART, Whisper (encoder-decoder; translate, summarize, transcribe) and GPT, LLaMA, Claude (decoder-only; write, chat, complete). Closing: "The encoder is a reading machine."

## Implementation

Shapes of the toy run (all values in the video are toy values):

| Step | Operation | Shape |
|---|---|---|
| Tokens | "Apple released new phones" -> IDs [3, 2, 1, 4] | 4 |
| Embedding | X = rows of W_e selected by ID | W_e 4x6 -> X 4x6 |
| Positions | Input = X + P (element-wise) | 4x6 + 4x6 = 4x6 |
| Head split | d_k = d_model / num_heads = 6 / 3 = 2 | - |
| Projections per head i | Q_i = X W_qi, K_i = X W_ki, V_i = X W_vi | (4x6)(6x2) = 4x2; stacked 3x4x2 |
| Scores | S_i = Q_i K_i^T / sqrt(2) | 4x4 per head |
| Weights | A_i = softmax(S_i), row-wise | 4x4, rows sum to 1 |
| Head output | O_i = A_i V_i | 4x2 |
| Concat + mix | Z = Concat(O_1, O_2, O_3) W_O | 4x6 x 6x6 = 4x6 |
| Residual | Z + X | 4x6 |
| LayerNorm | per row: gamma * (x - mu) / sqrt(sigma^2 + eps) + beta | 4x6 |

Equations as shown or stated in the video:

$$ \text{Input} = X + P $$

$$ X = (4, 6), \quad W_q = W_k = W_v = (d_{\text{model}}, d_k) $$

$$ d_k = \frac{d_{\text{model}}}{\text{num\_heads}} = \frac{6}{3} = 2 $$

$$ Q_i = X W_{qi}, \quad K_i = X W_{ki}, \quad V_i = X W_{vi} $$

$$ S_i = \frac{Q_i K_i^T}{\sqrt{2}} $$

$$ A_i = \text{softmax}(S_i) $$

$$ O_i = A_i V_i $$

$$ Z = \text{Concat}(O_1, O_2, O_3)\, W_O $$

$$ \text{LayerNorm}(x) = \gamma \cdot \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta $$

Worked numbers from the screen (toy):
- Input row 1 = X row 1 + P pos 0: [0.12, -0.45, 0.88, -0.23, 0.55, 0.71] + [0, 1, 0, 1, 0, 1] = [0.12, 0.55, 0.88, 0.77, 0.55, 1.71]. P matches the original sin/cos formula at d_model = 6 (pos 1 starts sin(1) = 0.84, cos(1) = 0.54); author check.
- Head 2, Apple row: scores [0.80, 0.92, 0.66, -0.07] -> weights [0.29, 0.33, 0.25, 0.12].
- Head 1 scores are small and near-uniform (diffuse), head 2 larger (decisive); concat outputs: head 1 columns ~[0.18-0.20, 0.60-0.61] for every row, head 2 small [0.02-0.09], head 3 largest [0.31-0.54].
- Author recomputation: Q1 = X W_q1 gives Apple row [1.76, 0.47]; Q1 K1^T / sqrt(2) Apple row = [1.25, 1.57, 0.67, 1.30], which does not match the screen's head-1 scores [0.31, 0.36, 0.54, 0.02]. Treat each scene's numbers as standalone illustrations.
- LayerNorm demo (P15): mu_Seq1 = (1.2 - 0.8 + 0.5 + 2.3) / 4 = 0.80. BatchNorm column "Word 3" with padding: (0.5 - 0.2 + 0) / 3 = 0.10 vs 0.15 over real tokens only (author computed).
- Author LayerNorm of the Apple row of Z + X [0.47, 1.00, 1.10, 1.08, 0.95, 1.99]: mu = 1.098, sigma = 0.451 (population std, as LayerNorm uses) -> [-1.39, -0.22, 0.00, -0.04, -0.33, 1.98].

Pitfalls stated or found:
- In practice the LayerNorm formula includes epsilon (PyTorch default 1e-5); real implementations always use gamma and beta.
- The video's heat-map caption says "darker cell = higher weight", but on its own heat maps the brighter cells are the higher weights.

Equations as written in the report (toy shapes from the video):

```text
FFN(X)  = max(0, X W1 + b1) W2 + b2        # slide formula; W1: 6x24, b1: 24, W2: 24x6, b2: 6 (b sizes inferred by the report author)
H       = LayerNorm(X + Z)                 # first add & norm (author's notation of the spoken step)
Output  = LayerNorm(H + FFN(H))            # second add & norm (author's notation)
p       = softmax(Linear(h_CLS))           # classification head (author's notation of "small linear layer and softmax")
s       = (1/n) * sum_i h_i                # mean pooling for a sentence vector (author's notation of "average")
cos(q,d)= (q . d) / (||q|| ||d||)          # standard cosine similarity (added by the report author; video gives only 0.94)
```

Minimal PyTorch sketch of one post-norm encoder block matching the video's toy sizes (author's sketch, not from the video):

```python
import torch.nn as nn

class EncoderBlock(nn.Module):
    def __init__(self, d_model=6, n_heads=3, d_ff=24):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.ln1 = nn.LayerNorm(d_model)      # gamma init 1, beta init 0
        self.ffn = nn.Sequential(nn.Linear(d_model, d_ff), nn.ReLU(), nn.Linear(d_ff, d_model))
        self.ln2 = nn.LayerNorm(d_model)

    def forward(self, x):                     # x: (batch, 4, 6) = embeddings + positional encoding
        z, _ = self.attn(x, x, x)
        h = self.ln1(x + z)                   # H = LayerNorm(X + Z)
        f = self.ffn(h)                       # F = FFN(H)
        return self.ln2(h + f)                # LayerNorm(H + F), same shape as x

encoder = nn.Sequential(*[EncoderBlock() for _ in range(6)])   # 6 blocks, no weight sharing
```

Parameter share check (report author's arithmetic): per encoder layer attention has about 4*d^2 weights and the FFN about 8*d^2, so the FFN is about 2/3 of a layer. At d = 512: about 1.05M vs 2.10M (2.10M of 3.15M). Toy example: FFN 6*24 + 24*6 = 288 weights, attention 3 heads * 3 * (6*2) = 108 plus W_O 6*6 = 36, total 144, so 288 / 432 = 2/3 (biases and LayerNorm parameters excluded).

Pitfalls flagged by the fact check:
- "Without the ReLU, stacked attention is only linear mixing" (C15, partly): softmax(QK^T / sqrt(d_k)) is a non-linear function of the input; the ReLU is the only element-wise non-linearity, not the only non-linearity.
- "FFN holds around 2/3 of all Transformer parameters" (C17, partly): true inside one encoder layer; in the whole base Transformer (65M) the 12 FFNs total about 25.2M, about 39 %, because decoder layers are only about 50 % FFN and the shared embedding takes about 18.9M (37,000 x 512).
- Mean-pooling raw BERT gives poor sentence embeddings; Sentence-BERT fine-tunes in siamese / triplet networks (C24).

## Quick Reference

| Item | Value in the video | Note |
|---|---|---|
| Example sentence | Apple released new phones | 4 tokens |
| Token IDs | Apple 3, released 2, new 1, phones 4 | toy vocab of 4 |
| Real vocab sizes | 30,000 / 50,000 / >100,000 | BERT 30,522; GPT-2 50,257; RoBERTa 50,265; Llama 3 128,256 |
| d_model | 6 (toy) | original paper 512 |
| X | 4x6 | rows = tokens, cols = features |
| Positional encoding | sin/cos, computed once, added | Input = X + P |
| Heads H | 3 | original 8 |
| d_k | 6 / 3 = 2 | original 64 |
| W_Q, W_K, W_V per head | 6x2 | not shared across heads |
| Q, K, V per head | 4x2; stacked 3x4x2 | |
| Attention scores | QK^T / sqrt(d_k) = / sqrt(2) | softmax rows sum to 1 |
| W_O | 6x6 | concat 4x6 -> Z 4x6 |
| LayerNorm | gamma (x - mu) / sqrt(sigma^2 + eps) + beta | gamma init 1, beta init 0 |
| FFN | 6 -> 24 -> 6 (4x), ReLU | original 512 -> 2048 -> 512 |
| FFN parameter share | "about 2/3" (video) | ~2/3 per encoder layer, ~39% of whole base model |
| Block order | attention, add & norm, FFN, add & norm | post-norm |
| Blocks | 6 | same structure, separate weights |
| Classification | CLS vector -> linear + softmax | e.g. positive / negative |
| Semantic search | cosine 0.94 (heart attack vs myocardial infarction) | toy value |
| Five encoder uses | classification, NER, semantic search, QA, masked LM | encoder outputs alone |

## Comparisons

| Item | Option A | Option B | Point made in the video |
|---|---|---|---|
| Mixing vs transforming | Attention: mixes information across tokens | FFN: transforms each token independently (batched) | Both are needed; FFN adds non-linearity and capacity |
| Block 1 vs block 4 attention | Broad, even (0.22-0.30 everywhere) | Sharp, specific pairs (0.75, 0.60, 0.50, 0.45) | Stacking is specialization, not repetition |
| Sentence vs token tasks | Classification: one [CLS] vector, one label | NER: every token vector, one label each | Same encoder output, different read-out |
| Keyword vs semantic search | Matches spelling | Matches meaning via mean-pooled vectors and cosine | "heart attack" vs "myocardial infarction" cosine 0.94 |
| Encoder vs decoder-only context | Sees left and right context at once | Sees only the left context | Bidirectional context is why encoders suit understanding |
| Transformer family | Encoder-only: classify, search, extract, tag | Encoder-decoder: read then generate; decoder-only: generate left to right | Use the encoder when the job is reading |

## Fact Check

Checked 2026-10-24: confirmed 25 · partly 5 · not found 0 · contradicted 0.

| Claim (as said) | Verdict | Detail | Source |
|---|---|---|---|
| Encoder and decoder built from the same fundamental blocks | confirmed | N = 6 identical layers each; decoder adds encoder-decoder attention and masking | https://arxiv.org/abs/1706.03762 |
| Embedding matrix starts random, learned into a lookup table | confirmed | learned embeddings; nn.Embedding is a lookup table, init N(0, 1) | https://arxiv.org/abs/1706.03762 ; https://docs.pytorch.org/docs/2.14/generated/torch.nn.Embedding.html |
| "Some use 30,000 tokens, others 50,000 like GPT-2 and BERT" | partly | GPT-2 50,257; BERT 30,522 (30k group); RoBERTa 50,265 | https://huggingface.co/docs/transformers/model_doc/gpt2 ; https://huggingface.co/docs/transformers/model_doc/bert ; https://huggingface.co/docs/transformers/model_doc/roberta |
| Biggest models exceed 100,000 vocabulary entries | confirmed | Llama 3: 128,256 | https://ai.meta.com/blog/meta-llama-3/ |
| d_model is a hyperparameter chosen before training | confirmed | base 512, big 1024; Table 3 row C varies it | https://arxiv.org/abs/1706.03762 |
| Self-attention is permutation-invariant, so fixed sin/cos positions are added once | partly | substance right; precise term permutation-equivariant; learned positions nearly identical (BLEU 25.7 vs 25.8), BERT uses learned positions | https://arxiv.org/abs/1706.03762 |
| Positional encoding is added element-wise | confirmed | same dimension d_model "so that the two can be summed" | https://arxiv.org/abs/1706.03762 |
| d_k = d_model / h | confirmed | h = 8, d_k = d_v = 64 | https://arxiv.org/abs/1706.03762 |
| Scale by sqrt(d_k) to avoid tiny softmax gradients | confirmed | paper states it as a suspicion | https://arxiv.org/abs/1706.03762 |
| Each softmax row sums to 1 | confirmed | row-wise softmax; video values are toy | https://arxiv.org/abs/1706.03762 |
| Heads concatenated then W_O | confirmed | MultiHead = Concat(head_1..head_h) W^O | https://arxiv.org/abs/1706.03762 |
| Residuals let Transformers go "hundreds of layers" deep | confirmed | DeepNet trained 1,000 layers, needed DeepNorm | https://arxiv.org/abs/2203.00555 |
| LayerNorm over BatchNorm because padding corrupts batch statistics | partly | per-token normalisation right; sources cite batch-size dependence, length-varying statistics, longer test sequences (LN paper) and batch-statistic fluctuation (PowerNorm), not padding | https://arxiv.org/abs/1607.06450 ; https://arxiv.org/abs/2003.07845 |
| Learnable gamma and beta, init 1 and 0 | confirmed | LN paper gives gain and bias; PyTorch inits 1 and 0 | https://docs.pytorch.org/docs/2.14/generated/torch.nn.LayerNorm.html |
| ReLU gives the non-linearity; without it stacking is linear mixing | partly | softmax attention weights are already non-linear in the input; ReLU is the only element-wise non-linearity | https://arxiv.org/abs/1706.03762 |
| FFN hidden = 4 x d_model | confirmed | 512 -> 2048; 6 -> 24 -> 6 is toy | https://arxiv.org/abs/1706.03762 |
| FFN holds about 2/3 of all parameters | partly | ~2/3 per encoder layer (2.10M of 3.15M); ~39% of 65M base model | https://arxiv.org/abs/1706.03762 |
| Block order attention, add & norm, FFN, add & norm | confirmed | LayerNorm(x + Sublayer(x)), post-norm | https://arxiv.org/abs/1706.03762 |
| Six encoder blocks in the original paper | confirmed | N = 6 | https://arxiv.org/abs/1706.03762 |
| Blocks share structure, not weights | confirmed | "different parameters from layer to layer" | https://arxiv.org/abs/1706.03762 |
| Positions survive via residuals | confirmed | follows from LayerNorm(x + Sublayer(x)); speaker's inference | https://arxiv.org/abs/1706.03762 |
| CLS + linear + softmax classification | confirmed | log(softmax(C W^T)) | https://arxiv.org/abs/1810.04805 |
| NER: Elon Musk person, SpaceX organization, 2002 date | confirmed | SpaceX founded 2002 | https://www.spacex.com/mission/ |
| Mean pooling + cosine; 0.94 example | confirmed | SBERT default MEAN pooling, cosine; 0.94 toy | https://arxiv.org/abs/1908.10084 |
| Extractive QA predicts start and end tokens | confirmed | start vector S, end vector E | https://arxiv.org/abs/1810.04805 |
| MLM sees both sides; decoder-only looks left | confirmed | BERT masks 15% | https://arxiv.org/abs/1810.04805 ; https://huggingface.co/learn/llm-course/chapter1/5 |
| BERT, RoBERTa, Sentence-BERT are encoder-only | confirmed | | https://arxiv.org/abs/1907.11692 ; https://arxiv.org/abs/1908.10084 |
| Encoder-decoder reads then generates; decoder-only left to right | confirmed | auto-regressive decoder | https://arxiv.org/abs/1706.03762 |
| LayerNorm: subtract mean, divide by std (eps in practice) | confirmed | PyTorch eps = 1e-5 | https://arxiv.org/abs/1607.06450 ; https://docs.pytorch.org/docs/2.14/generated/torch.nn.LayerNorm.html |
| Activations drift across layers; LayerNorm restores scale | confirmed | LN paper: stabilises hidden-state dynamics | https://arxiv.org/abs/1607.06450 |

## Open Questions & Extension Ideas

- The heat maps of blocks 1-6 and the block 1 vs block 4 attention values are not attributed to a trained model; reproduce them by running a small trained encoder (e.g. BERT-base) on "Apple released new phones" and plotting per-layer attention.
- Test the speaker's role reading of the output rows (brand, verb, adjective, object) with a linear probe on per-layer token vectors.
- Show the parameter split of a full model (encoder + decoder + embeddings) next to the per-layer 2/3 figure, so the claim's scope is visible.
- Extend the residual explanation with pre-norm vs post-norm and why very deep models (e.g. DeepNet, 1,000 layers) need modified residuals.
- For semantic search, compare mean pooling of raw BERT vs a Sentence-BERT model on the heart attack / myocardial infarction / chocolate cake example and report the actual cosines.
- QA example has a one-word span (start = end); a multi-word span would show the start / end mechanism better.

## Tags & Triggers

tags: Transformer, encoder, encoder block, feed-forward network, ReLU, residual connection, layer normalization, post-norm, stacking, attention heat map, BERT, CLS token, named entity recognition, semantic search, mean pooling, cosine similarity, question answering, masked language modeling, encoder-only, decoder-only

- What does the feed-forward network in a Transformer encoder do, and why is its hidden layer 4x d_model?
- How does the second add & norm close an encoder block?
- What are the four stages of one encoder block, and what are X, Z, H, F?
- Why stack six encoder blocks, and how does positional information survive them?
- Do FFN layers really hold 2/3 of a Transformer's parameters?
- How is the [CLS] vector used for text classification?
- How does semantic search use mean pooling and cosine similarity?
- Why can an encoder do masked language modelling better than a decoder-only model?
- Which models are encoder-only, encoder-decoder and decoder-only?

## References

- Visual AI, "How Does the Transformer Encoder Actually Work? Complete Visual Breakdown", YouTube, 29:38, 2026-05-25: https://www.youtube.com/watch?v=Zub3YvvUoR4 (channel: Visual AI)
- Vaswani et al. 2017, Attention Is All You Need: https://arxiv.org/abs/1706.03762
- PyTorch torch.nn.Embedding: https://docs.pytorch.org/docs/2.14/generated/torch.nn.Embedding.html
- Hugging Face Transformers, GPT-2: https://huggingface.co/docs/transformers/model_doc/gpt2
- Hugging Face Transformers, BERT: https://huggingface.co/docs/transformers/model_doc/bert
- Hugging Face Transformers, RoBERTa: https://huggingface.co/docs/transformers/model_doc/roberta
- Meta, Introducing Meta Llama 3: https://ai.meta.com/blog/meta-llama-3/
- DeepNet: Scaling Transformers to 1,000 Layers: https://arxiv.org/abs/2203.00555
- Ba et al. 2016, Layer Normalization: https://arxiv.org/abs/1607.06450
- PowerNorm: Rethinking Batch Normalization in Transformers: https://arxiv.org/abs/2003.07845
- PyTorch torch.nn.LayerNorm: https://docs.pytorch.org/docs/2.14/generated/torch.nn.LayerNorm.html
- Devlin et al. 2018, BERT: https://arxiv.org/abs/1810.04805
- SpaceX Mission: https://www.spacex.com/mission/
- Reimers & Gurevych 2019, Sentence-BERT: https://arxiv.org/abs/1908.10084
- Liu et al. 2019, RoBERTa: https://arxiv.org/abs/1907.11692
- Hugging Face LLM Course, chapter 1.5: https://huggingface.co/learn/llm-course/chapter1/5

## Equations (LaTeX)
8. $$ \text{Concat}(O_1, O_2, O_3) \in \mathbb{R}^{4 \times 6} $$
10. $$ Z + X $$
11. $$ \hat{x} = \frac{x - \mu}{\sigma} $$
12. $$ \mu_{\text{Seq 1}} = \frac{1.2 - 0.8 + 0.5 + 2.3}{4} = 0.80 $$
14. $$ FFN(X) = \max(0, XW_1 + b_1)W_2 + b_2 $$
15. $$ \text{Output} = \mathrm{LayerNorm}\big(H + \mathrm{FFN}(H)\big) $$
16. $$ H = \mathrm{LayerNorm}(X + Z) $$
17. $$ p = \mathrm{softmax}\big(\mathrm{Linear}(h_{\mathrm{CLS}})\big) $$
18. $$ s = \frac{1}{n}\sum_{i=1}^{n} h_i $$
19. $$ \cos\theta = \frac{q \cdot d}{\lVert q \rVert\,\lVert d \rVert} $$
