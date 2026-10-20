# I Trained an LLM from Scratch — Green Code - Claude Context
> Source: YouTube, Green Code, "I Trained an LLM from Scratch", 14:07, published 2026-10-05 (episode 2 of the Anton series) · https://www.youtube.com/watch?v=vKdKtxpfvIc · Generated: 2026-10-19
> Companion: 20261005_I-Trained-An-LLM-From-Scratch.html (Thai, iw mode `iwd`, 11 sections, 15 frames + 12 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: S105, S124, S135, S144, S153, S155, S182, S25, S28, S34, S47, S66, S72, S81, S82.
- Own SVG diagrams: flow, compare, flow, algo, algo, heatmap, flow, compare, layers, compare, bars, compare.
- Transcript SHA-256 (in-page = decoded): `b35d6d45b494d6630ec5295de54a0bedb8376c001e602b4b9e8fab046c8cdc8e`; kept in the session workspace only.

## TL;DR

Green Code (episode 2 of the "Anton" series) pre-trains a GPT he wrote from scratch in NumPy only ("Anton", built in episode 1) on his Shakespeare file. Untrained, Anton produces word salad. The episode walks through:

- BPE tokenization: 10,000 merges, a vocabulary of "around 10,000" tokens.
- Next-token training: shift the data by one position, cross-entropy loss, gradient descent.
- The causal attention mask.
- A failed first run with plain mini-batch SGD (output "sssssttttsss...").
- The switch to AdamW, explained with a skiing analogy.
- Hyperparameter tuning.
- Positional encodings, a detail he says he forgot to mention in the first two episodes.

The final model, Anton v1, uses vocab 10K, 5 blocks, 5 heads, sequence length 128, embedding dimension 200 and weight decay 0.1. He says it has 6 million parameters (about 6.42 M when recomputed). It trains on his own computer in about 11 hours and writes Shakespeare-style lines whose meaning still drifts.

Corrections, from the fact-check and from frames:
- The spoken token count is wrong. He says 318,741 tokens; the notebook shows 1,322,042, and an on-screen note admits the wrong number.
- The AdamW explanation is partly inaccurate (momentum and adaptive step; the "W" is never explained).
- The "positional embedding layer" is in fact a fixed sinusoidal encoding with no parameters.

Sponsor, donation and credits segments are omitted.

## Key Concepts

- **Why tokens, not characters (1:22-1:50).** A GPT takes numbers, not text. One number per character makes inputs long and forces letter-by-letter generation ("hello" = 5 predictions). The slide shows "HELLO THERE!" as 72 101 108 108 111 32 116 104 (ASCII).
- **BPE (1:52-2:21).** Three repeated steps:
  1. Find the most frequent adjacent pair.
  2. Give it a new token id.
  3. Replace every occurrence.

  Repeat 10,000 times to get a vocabulary of "around 10,000" tokens. His real implementation is "like 300 lines".
- **The MISSISSIPPI example on screen (2:00-2:13).**
  - Toy ids: M=77, I=78, S=79, P=80. These are not ASCII for I and S, unlike the HELLO slide.
  - Pair counts: MI 1, IS 2, SS 2, SI 2, IP 1, PP 1, PI 1.
  - IS (the first of the tied pairs) becomes id 81.
  - Author computation: `77 78 79 79 78 79 79 78 80 80 78` becomes `77 81 79 81 79 78 80 80 78` (11 to 9 tokens).
- **Learned tokens (2:24-2:30).** Examples include observance, Romeo, philosophy, subdue, subscribe.
- **Training in 30 s (3:46-4:55).**
  1. Copy the data and shift it one position to get targets.
  2. Predict the next token.
  3. Cross-entropy measures the gap between the predicted and target token distributions.
  4. The gradient is the direction that increases the loss; take a small step the opposite way (gradient descent).
  5. Repeat "a thousand times".
- **The worked example on the slides (3:50-4:35).**
  - Input ids start `[72, 2715, 3047, 8851, 3490, 9028]`.
  - Targets are `[2715 REALLY, 3047 LOVE, 8851 GREEN, 3490 CODE, 9028 VIDEOS, 9999 EOF]`.
  - The untrained predictions are `6315` ("DUMB") at every position.
  - Cross-entropy slide: y_hat = [0.10, 0.06, 0.32, 0.14, 0.17, 0.21] over (REALLY, VIDEOS, DUMB, I, GREEN, CODE), and y = [0, 0, 0, 0, 0, 1] (CODE). L = -ln(0.21) = 1.56 (author computed).
- **Causal mask (4:55-5:30).** One sentence trains next-token prediction for every prefix at once, so attention must not see future tokens.
  - Slide grid (5:16, 5:22): 5x5 query/key scores for "I LOVE GREEN CODE VIDEOS".
  - Before the mask, each full row sums to 1, e.g. GREEN = .165 .169 .251 .249 .166.
  - After the mask, each row is renormalised over the visible keys: I 1.000; LOVE .514 .486; GREEN .282 .289 .429; CODE .186 .192 .311 .310; VIDEOS .143 .150 .280 .282 .145.
  - This equals putting -inf before the softmax (author check: .165/.585 = .282).
- **Training is optimisation (5:42-6:13).** Find the parameters that drive cross-entropy toward 0.
  - The first run used plain mini-batch SGD. The log shows `Epoch: 010/010 | Batch 850/874`, and the output is "sssssssttttsssssssssssssss".
  - He found no bug; "the problem was the optimizer".
  - His description of SGD: "zero memory", same treatment for every parameter, fine for small nets. Transformers are "notoriously hard to train".
- **AdamW (6:45-8:55).** Skiing analogy:
  - The loss function is the mountain; the goal is to reach the bottom fastest by changing the parameters.
  - SGD, like the speaker skiing, sees only the last step's gradient, so it zig-zags in S shapes.
  - AdamW, like Candide (the surname, Thovex, is the fact-checker's inference), goes straight down thanks to momentum.
  - Bunny slope (simple net): both reach the bottom, SGD slower.
  - Everest (GPT): SGD "dying 100%"; AdamW will "probably" make it or get close.
  - He also says AdamW scales each parameter's learning rate.
  - On the formula slide, m_hat is "the momentum part" and sqrt(v_hat) is "the adaptive learning rate part".
- **Hyperparameters listed (9:42-9:52).** Vocabulary size, embedding dimension, number of heads, number of transformer blocks, beta1, beta2, weight decay, batch size, number of epochs.
- **Positional encoding (9:55-10:35).** Without it, "Anton is better than ChatGPT" and "ChatGPT is better than Anton" "look exactly the same" (an overstatement for a causal model; see Fact Check). He calls it "a tiny layer at the beginning", "barely 25 lines", and says it makes "a huge difference".

## Implementation

Exact code and values as shown on screen. Spoken-only values are marked as such.

**Corpus encoding (notebook cell [12], ~2:45):**
```python
with open("data/shakespeare_all.txt", "r", encoding="utf-8") as f:
    text = f.read()

print("Encoding tokens!")
tokens = np.array(tokenizer.encode(text))
tokens
```
Output: `array([ 729, 1895,   58, ...,  809,   46,   10], shape=(1322042,))`. The tokenizer code itself (about 300 lines) is not shown.

**Equations on screen:**
- Cross-entropy (slide header ~4:28-4:37): `L(y, y_hat) = -sum_{i=1}^{C} y_i ln(y_hat_i)`
- Gradient descent (~4:49, again ~6:25): `theta_{t+1} = theta_t - eta * grad_theta L(y, y_hat)`
- Mini-batch SGD (~7:49): `theta_{t+1} = theta_t - eta * (1/m) * sum_{i=1}^{m} grad_theta L(y^(i), y_hat^(i))`. A Wikipedia page is also shown (~6:22): `w := w - eta*grad Q(w) = w - (eta/n) * sum_{i=1}^{n} grad Q_i(w)`.
- AdamW (~8:40): `theta_{t+1} = theta_t - eta * ( m_hat_t / (sqrt(v_hat_t) + eps) + lambda * theta_t )`
- The Loshchilov & Hutter "Algorithm 2" page is shown (~6:55, 7:52, 8:47):
  - It compares Adam with L2 (`g_t <- grad f_t(theta_{t-1}) + lambda*theta_{t-1}`) against AdamW (`theta_t <- theta_{t-1} - eta_t * (alpha * m_hat_t / (sqrt(v_hat_t) + eps) + lambda*theta_{t-1})`).
  - Given values: alpha = 0.001, beta1 = 0.9, beta2 = 0.999, eps = 1e-8.
  - The slide formula folds alpha and the schedule multiplier eta_t into one eta, matching his code and PyTorch.

**AdamW optimizer (on screen ~8:55, NumPy):**
```python
class AdamW(Optimizer):
    def __init__(self, model, lr_schedule, beta1=0.9, beta2=0.999, weight_decay=0.0):
        super().__init__(model)
        self.beta1 = beta1
        self.beta2 = beta2
        self.weight_decay = weight_decay
        self.lr_schedule = lr_schedule
        self.t = 0

        self.m_t = []
        self.v_t = []

        for param in self.params:
            _, _, theta_grad = param
            self.m_t.append(np.zeros(theta_grad.shape))
            self.v_t.append(np.zeros(theta_grad.shape))

    def update_parameters(self):
        self.t += 1

        for idx, param in enumerate(self.params):
            full_name, theta, theta_grad = param

            self.m_t[idx] = self.beta1 * self.m_t[idx] + (1 - self.beta1) * theta_grad
            self.v_t[idx] = self.beta2 * self.v_t[idx] + (1 - self.beta2) * np.square(theta_grad)

            m_t_corrected = self.m_t[idx] / (1 - (self.beta1**self.t))
            v_t_corrected = self.v_t[idx] / (1 - (self.beta2**self.t))

            lr = self.lr_schedule.get_lr(self.t)

            if ".weights" in full_name:
                theta += - lr * (m_t_corrected/(np.sqrt(v_t_corrected) + 1e-8) + self.weight_decay * theta)
            else:
                theta += - lr * m_t_corrected/(np.sqrt(v_t_corrected) + 1e-8)
```
Notes on this code:
- Params are `(full_name, theta, theta_grad)` triples.
- Weight decay applies only to parameters whose name contains `.weights` (not biases).
- eps is hard-coded as 1e-8.
- The learning rate comes from an `lr_schedule` object (schedule not shown).
- The update is in-place (`theta +=`).

**Positional encodings (on screen ~10:31, sinusoidal, no trainable parameters):**
```python
class PositionalEncodings:
    def __init__(self, embedding_length):
        self.embedding_length = embedding_length

    def forward(self, inputs):
        B, T, _ = inputs.shape

        pos = np.arange(0, T, 1, dtype=int)[:, np.newaxis]
        denominator = (np.arange(0, self.embedding_length, 1) // 2 * 2) / self.embedding_length
        denominator = 1/(10000**denominator)
        denominator = denominator[np.newaxis, ...]

        inner = pos * denominator
        pe_sin = np.sin(inner)
        pe_cos = np.cos(inner)

        pe_sin[:, np.arange(1, self.embedding_length, 2)] = 0
        pe_cos[:, np.arange(0, self.embedding_length, 2)] = 0

        positional_encodings = pe_sin + pe_cos

        return inputs + positional_encodings[np.newaxis, ...]
```
- Equivalent formula (author): PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d)).
- The visual at ~10:28 uses d = 16, positions 0-44+, with Pos 10 highlighted: -0.54, -0.84, -0.02, -1.00, +0.84, +0.54, +0.31, +0.95, +0.10, +1.00, +0.03, +1.00, +0.01, +1.00, +0.00, +1.00. The author re-ran this code with d = 16 and got exactly these values.
- The architecture slide (~10:22) shows Inputs -> Embedding Layer -> (+) Positional Encoding -> Causal Multi-Head Attention. The slide misspells "Intputs" and "Embeding".

**Final config (on screen ~10:43, exactly 4 lines):**
```text
VOCAB_SIZE = 10_000
N_BLOCKS = 5
N_HEADS = 5
WEIGHT DECAY = 0.1
```
- Spoken only: sequence length 128, embedding dimension 200, "6 million parameters", about 11 hours on his own computer (CPU).
- Head dimension = 200/5 = 40 (author).
- The tuning-run chart (~9:52, Weights & Biases) shows the run name `AdamW_Z_LossWithSoftmax_lr0.002_bs64_ep50`, so lr 0.002, batch 64, 50 epochs were used in tuning (final values not stated).
  - Tooltip values: run 699 (blue) 4.7516, run 701 (pink, hidden behind blue) 4.5877.
  - The best (blue) curve falls from about 8 to about 2.3 over about 6.8k steps.

**Parameter budget (author, GPT-2-style assumptions: 4x MLP with biases, untied output head, fixed PE):**

| part | how | count |
|---|---|---|
| token embedding | 10,000 x 200 | 2,000,000 |
| attention per block | 4*200*200 + 4*200 | 160,800 |
| MLP per block | 200*800 + 800 + 800*200 + 200 | 321,000 |
| LayerNorms per block | 2*(200+200) | 800 |
| one block | | 482,600 |
| 5 blocks | | 2,413,000 |
| final LayerNorm | | 400 |
| output head | 200*10,000 + 10,000 | 2,010,000 |
| positional encoding | sinusoidal | 0 |
| total | | 6,423,400 (tied head: 4,423,400) |

About 62% of the parameters sit in the two vocabulary-sized matrices.

**Results:**
- SGD run: repeated s/t characters.
- AdamW run: "Madam is well, fellow, sir..."; broken grammar such as "sistake you ashapon as she loves" (on screen ~9:31; the ASR heard "Sist take you a shapoon").
- Anton v1: continues a Shakespeare prompt as JULIET ("Why, no, I am not well acquainted withal; / A man was not like a man to be worth; ..."). Correct register and verse form, drifting meaning.

**Pitfalls the source states:**
- Letter-level tokens are too long.
- Without a mask the model "peeks ahead".
- Plain SGD fails on a GPT although the code is correct.
- Without position information, word order is invisible.
- Shakespeare-only data cannot give a general model.

## Quick Reference

| item | value |
|---|---|
| data | `data/shakespeare_all.txt`, "167,205 lines" (spoken) |
| tokens in corpus | spoken 318,741 (wrong); on screen 1,322,042 |
| BPE | 10,000 merges, vocab "around 10,000"; about 300 lines of code |
| loss | cross-entropy |
| optimizer that failed | plain mini-batch SGD (10 epochs, 874 batches/epoch in the log) |
| optimizer used | AdamW: beta1 0.9, beta2 0.999, eps 1e-8 (code defaults); weight decay 0.1 (config) on `.weights` only |
| lr | `lr_schedule.get_lr(t)`; tuning run name shows lr0.002, bs64, ep50 |
| model | vocab 10,000; 5 blocks; 5 heads (head dim 40); seq len 128; d_model 200 |
| parameters | "6 million" (spoken); 6,423,400 recomputed |
| positional encoding | sinusoidal, base 10000, no parameters (17 non-blank lines on screen, author count; spoken "barely 25 lines") |
| training time | "like 11 hours" on his own computer |
| series budget | $5,000 compute credits (used from episode 3, GPUs) |
| next episode | PyTorch port, GPUs, internet-scale data, FlashAttention from scratch |

## Comparisons

| criterion | SGD (first run) | AdamW (working run) |
|---|---|---|
| information per step | last gradient only ("zero memory") | momentum: running average of past gradients |
| step size | one global lr | per-parameter, scaled by sqrt of the running average of squared gradients |
| weight decay | none | decoupled (lambda*theta in the update) |
| analogy in the clip | speaker skiing in S shapes | Candide going straight down |
| simple net (bunny slope) | reaches the bottom, slower | faster |
| GPT (Everest) | "dying 100%" | "probably" makes it or gets close |
| result on Anton | "sssssttttsss..." | Shakespeare-like lines, broken grammar |

## Fact Check

19 claims: 13 confirmed, 4 partly, 1 not found, 1 contradicted (a fundraiser-total row was dropped with the donation content).
- **Contradicted (2:42):** 318,741 tokens for all of Shakespeare. The complete works are about 900k words, so at least about 1M BPE tokens. The clip's own notebook shows 1,322,042, with an on-screen note admitting the spoken number was wrong.
- **Not found:** 167,205 lines (Gutenberg complete works `wc` = 124,787 lines; edition-dependent).
- **Partly:**
  - SGD "zero memory": true only without momentum.
  - AdamW momentum "remembers previous updates": it averages past gradients (beta1).
  - Per-parameter lr "based on how much that parameter changes": it comes from v_t, the average of squared gradients (beta2).
  - The two sentences "look exactly the same": causal LMs without PE still learn some position (Haviv et al. 2022).
- **Confirmed:** BPE steps (Sennrich 2016); vocab = base + merges (so 10,256 if starting from 256 bytes); gradient descent; causal mask (Vaswani 2017); transformers hard to train (Liu 2020); AdamW the default (Loshchilov & Hutter 2017; Muon reported at about 52% of AdamW FLOPs, Moonshot 2025); hyperparameters (PyTorch AdamW defaults lr 1e-3, betas (0.9, 0.999), eps 1e-8, wd 1e-2); positional embedding at the input; about 6M parameters; FlashAttention (Dao 2022); CS336; Raschka's book; Candide = Candide Thovex (inferred).
- **Author correction to the positional-embedding and 6M-parameter rows:** they assumed a learned GPT-2-style position table (25,600 params; totals 6,449,000 untied / 4,439,000 tied, where the tied figure also dropped the 10,000 output bias; keeping the bias gives 4,449,000). The on-screen code is fixed sinusoidal, so the totals are 6,423,400 untied / 4,423,400 tied.
- **AdamW's "W" (decoupled weight decay) is never explained in the clip.** Momentum and adaptive steps come from Adam (Kingma & Ba 2014).

## Open Questions & Extension Ideas

- Author note, ZVect ch. 3 (tokens/BPE): MISSISSIPPI makes a complete hand-worked BPE lesson.
  - It has the pair-count table, a tie (IS/SS/SI all = 2), the new id 81, and an 11-to-9 token reduction.
  - Pair it with the HELLO THERE! character-code slide (why not characters) and the "vocab = base + merges" correction.
  - Watch the toy ids: I=78 and S=79 are not ASCII.
- Author note, ZVect ch. 8 (LLM input): input = token embedding + positional encoding.
  - The 17-line NumPy class is directly reusable for a zero-dependency JS port: `denominator = (k // 2 * 2) / d; 1/10000**denominator`, then zero the odd-index sin and even-index cos and add.
  - The d = 16, pos = 10 values give a ready unit test: -0.54, -0.84, -0.02, -1.00, +0.84, +0.54, +0.31, +0.95, ...
- Author note, ZVect ch. 9 (attention): the 5x5 "I LOVE GREEN CODE VIDEOS" grid before/after the causal mask gives exact numbers for an interactive mask toggle with row renormalisation (GREEN: .165 .169 .251 -> /.585 -> .282 .289 .429). Teach the equivalence with -inf before the softmax.
- Author note, training chapter (loss, gradient descent):
  - Cross-entropy worked example: y_hat for CODE = 0.21 gives L = 1.56; if y_hat = 1, L = 0. A softmax/temperature canvas could reuse the six labels.
  - The training loop as five plain-language steps (shift, predict, measure, step opposite, repeat).
  - SGD vs AdamW on a 2D loss surface: the clip's mountain picture suggests a canvas where both optimizers run from the same start. This is author content; keep the clip's analogy attributed to the clip.
- Author note, ZVect ch. 10 (Transformer): use the Anton v1 parameter budget to show that in small models vocabulary matrices dominate (about 62%) and that weight tying saves 2M. Head dim = 200/5 = 40.
- Open: final beta1/beta2, learning-rate schedule, batch size and epoch count for Anton v1 are not stated (the tuning run name suggests lr 0.002, bs 64, 50 epochs). The tokenizer's starting vocabulary (bytes or characters) is not stated. The overfitting question raised at 10:52 is never answered.
- Open: whether the 167,205-line file is the complete works. The 1,322,042-token count fits the complete works (about 900k words) better than Tiny Shakespeare.
- Watch item (author): AdamW remains the default, but Muon is an emerging alternative (Moonshot AI 2025). Worth one line in a training lesson.

## Tags & Triggers

GPT from scratch, NumPy, pre-training, BPE, tokenization, cross-entropy, gradient descent, causal attention mask, SGD vs AdamW, momentum, weight decay, hyperparameter tuning, sinusoidal positional encoding, parameter count, Shakespeare, Green Code, Anton.
Triggers: "how to pre-train a tiny GPT in NumPy", "BPE MISSISSIPPI example", "why SGD fails on transformers", "AdamW NumPy code", "causal mask numbers", "positional encoding NumPy code", "where are the parameters of a 6M GPT".

## References

- Green Code, "I Trained an LLM from Scratch", YouTube, 14:07, 2026-10-05: https://www.youtube.com/watch?v=vKdKtxpfvIc
- Resources named in the description: Stanford CS336 (https://cs336.stanford.edu/); Sebastian Raschka, Build a Large Language Model (From Scratch) (https://sebastianraschka.com/llms-from-scratch/); Andrej Karpathy's YouTube channel (https://www.youtube.com/@AndrejKarpathy).
- Fact-check sources:
  - Sennrich et al. 2016: https://arxiv.org/pdf/1508.07909
  - Vaswani et al. 2017: https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf
  - Kingma & Ba 2014: https://arxiv.org/pdf/1412.6980
  - Loshchilov & Hutter 2017: https://arxiv.org/abs/1711.05101
  - Liu et al. 2020: https://arxiv.org/abs/2004.08249v2
  - Haviv et al. 2022: https://arxiv.org/abs/2203.16634v2
  - Moonshot AI 2025: https://arxiv.org/html/2502.16982v1
  - Dao et al. 2022: https://proceedings.neurips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html
  - PyTorch SGD: https://docs.pytorch.org/docs/2.12/generated/torch.optim.SGD.html
  - PyTorch AdamW: https://docs.pytorch.org/docs/2.12/generated/torch.optim.AdamW.html
  - nanoGPT: https://github.com/karpathy/nanoGPT/blob/master/data/shakespeare/readme.md and https://github.com/karpathy/nanoGPT/blob/master/model.py
  - Shakespeare wc (secondary): https://cs.indstate.edu/web/index.php/Using_Linux_-_Large_Text_Files
  - Tiny Shakespeare: https://www.tensorflow.org/datasets/catalog/tiny_shakespeare?hl=ar
  - Stanford bulletin: https://bulletin.stanford.edu/courses/2255541
  - O'Reilly: https://oreilly.com/library/view/build-a-large/9781633437166
  - Candide Thovex: https://www.freeskier.com/candide-thovex-crowned-2010-freeride-world-tour-champ and https://gearjunkie.com/winter/skiing/few-words-candide-thovex-skiing
- ASR repairs used: "Andre Karpathy" = Andrej Karpathy; "GBD" = GPT; "10K book of size" = 10K vocab size; "Kandide" = Candide; "Anton GBD number edition" = probably "Anton GPT NumPy edition".

## Equations (LaTeX)
1. $$ L(y, \hat{y}) = -\sum_{i=1}^{C} y_i \ln(\hat{y}_i) $$
2. $$ \theta_{t+1} = \theta_t - \eta \nabla_\theta L(y, \hat{y}) $$
3. $$ \theta_{t+1} = \theta_t - \eta \frac{1}{m} \sum_{i=1}^{m} \nabla_\theta L(y^{(i)}, \hat{y}^{(i)}) $$
4. $$ \theta_{t+1} = \theta_t - \eta \left( \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} + \lambda \theta_t \right) $$
5. $$ \mathrm{PE}(\text{pos}, 2i) = \sin\left(\frac{\text{pos}}{10000^{2i/d}}\right) \\ \mathrm{PE}(\text{pos}, 2i+1) = \cos\left(\frac{\text{pos}}{10000^{2i/d}}\right) $$
