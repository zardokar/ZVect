# Let's build GPT: from scratch, in code, spelled out. — Andrej Karpathy - Claude Context
> Source: YouTube, Andrej Karpathy, "Let's build GPT: from scratch, in code, spelled out.", 1:56:20, published 2023-01-17 · https://www.youtube.com/watch?v=kCc8FmEb1nY · Generated: 2026-10-19
> Companion: 20230117_Lets-Build-GPT-From-Scratch-In-Code-Spelled-Out.html (Thai, iw mode `iwd`, 23 sections, 7 frames + 26 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: S102, S114, S136, S138, S156, S83, S99.
- Own SVG diagrams: flow, compare, bars, compare, tokens, shapes, algo, algo, flow, tokens, matrix, heatmap, flow, heatmap, compare, softmax, flow, shapes, layers, shapes, compare, line, bars, compare, shapes, algo.
- Transcript SHA-256 (in-page = decoded): `5e9cdb0c067a158dba6dcefe906c80e4806d87e5cdf0a95854420ae9a2ab1a52`; kept in the session workspace only.

## TL;DR
Andrej Karpathy builds a character-level, decoder-only GPT in PyTorch from an empty notebook, on tiny Shakespeare (~1 MB, ~1M characters, vocab 65). He starts from a bigram model (val loss ~2.5), then adds, in order: a single self-attention head (2.4), 4 heads of size 8 (2.28), a per-token feed-forward layer (2.24), residual connections with projection and a 4x-wide FFN (2.08), pre-norm LayerNorm (2.06), and finally scales up with dropout (batch 64, block 256, n_embd 384, 6 heads x 64, 6 layers, dropout 0.2, lr 3e-4) to val loss 1.48, which he estimates took about 15 minutes on an A100. The model has about 10M parameters (fact-check count: 10,788,929). He closes with a nanoGPT walkthrough and the link to ChatGPT: pre-training like this at GPT-3 scale (175B params, 300B tokens), followed by roughly three fine-tuning steps (SFT, reward model, PPO; Karpathy: "roughly three steps"). All code below was copied line by line from the video frames. Two source errors are corrected by the author's own description notes: at 57:00 "past" should be "future", and at 1:20:05 the attention scale should use head_size, not C. The on-screen code still uses `C**-0.5`.

## Key Concepts
- **Language model = next-token prediction.** ChatGPT is a probabilistic sequence completer: the same prompt gives different outputs (two haikus at 0:00-1:03). Examples he cites (1:03-1:33): websites that index ChatGPT interactions ("explain HTML to me like I'm a dog", "write release notes for chess 2", a note about Elon Musk buying Twitter) and a "breaking news article about a leaf falling from a tree" ("very dramatic"). ChatGPT is trained on "a good chunk of internet" (3:05) with pre-training and fine-tuning stages. The network inside is the Transformer of "Attention Is All You Need" (2017). Karpathy thinks its authors "didn't fully anticipate" its impact. Preview of the video's result (5:09): "verily my Lord the sites have left the again ..." (fake Shakespeare; he apologises for some display "jank" he could not resolve). GPT = Generatively Pretrained Transformer.
- **Character tokenizer (ZVect 3.1).** `chars = sorted(list(set(text)))`, 65 symbols: newline, space, 10 punctuation marks `!$&',-.:;?`, the digit `3`, A-Z, a-z. `stoi` / `itos` dicts; `encode("hii there")` = `[46, 47, 47, 1, 58, 46, 43, 56, 43]`. Contrast: tiktoken `gpt2` has `n_vocab` 50257, so its ids run 0 to 50,256, not 0 to 64 (11:54-12:01), and "hii there" -> `[71, 4178, 612]`. Trade-off: a small codebook gives long sequences, a large codebook gives short ones. SentencePiece (Google) and BPE (tiktoken, used by GPT) are subword schemes.
- **Train / val split.** `n = int(0.9*len(data))`: the first 90% is train, the last 10% is val. Purpose: detect overfitting / memorisation.
- **Chunks and batches.** `block_size` = maximum context. A chunk of `block_size+1` tokens holds `block_size` training examples (contexts of length 1..block_size), and this is also why generation can start from 1 token. Batch dimension B: independent chunks stacked for GPU efficiency; they never talk. A 4x8 batch holds 32 examples.
- **Bigram baseline.** `nn.Embedding(vocab_size, vocab_size)` gives logits from the current token only. `F.cross_entropy` needs (N, C), so reshape logits (B,T,C) -> (B*T, C) and targets -> (B*T). Expected initial loss -ln(1/65) ~ 4.17; measured 4.87 (screen 4.8786).
- **The mathematical trick (ZVect 9).** Weighted aggregation of the past = matrix multiply by a row-normalised lower-triangular matrix `wei` (T,T) @ x (B,T,C) -> (B,T,C), a batched matmul. Version 3 writes the same thing as `wei = zeros; masked_fill(tril == 0, -inf); softmax(dim=-1)`. The zeros are "affinities" that self-attention will make data-dependent; the -inf entries block the future.
- **Self-attention head (ZVect 9 / 10).** Every token emits a query ("what am I looking for") and a key ("what do I contain"); affinities are `wei = q @ k.transpose(-2, -1)` -> (B,T,T); mask, softmax; aggregate `v = value(x)`: `out = wei @ v`. x is the token's "private information"; v is "what I will communicate if you find me interesting". Linear layers use `bias=False`.
- **Attention notes (Karpathy's six).** (1) Attention is communication over a directed graph (here 8 nodes, causal edges). (2) It has no notion of space, so positions must be added. (3) There is no communication across the batch (4 pools of 8 nodes = 32 nodes). (4) An encoder block has no mask (delete the masked_fill line); a decoder block keeps the triangular mask. (5) Self-attention: k, q, v come from the same x; cross-attention: q from x, k and v from another source (an encoder). (6) Scaled attention: divide by sqrt(head_size).
- **Why scale (ZVect 10).** With unit-Gaussian q and k, Var(q.k) is on the order of head_size (16 here); multiplying by head_size**-0.5 brings it back to ~1 (screen: k.var 0.9006, q.var 1.0037, wei.var 0.9957). Large-magnitude logits make softmax converge towards one-hot (demo: softmax of [0.1,-0.2,0.3,-0.2,0.5] = [0.1925,0.1426,0.2351,0.1426,0.2872]; the same values x8 give [0.0326,0.0030,0.1615,0.0030,0.8000]). The point is to keep attention diffuse at initialisation.
- **Multi-head.** Several heads in parallel, concatenated on the channel dim: 4 heads x 8 = 32 = n_embd. Karpathy compares it to group convolution.
- **Block = communication (attention) then computation (per-token FFN).** FFN = Linear -> ReLU (-> Linear back) applied to each position independently.
- **Residual pathway (ZVect 10).** `x = x + self.sa(x)`, `x = x + self.ffwd(x)`, plus a projection Linear(n_embd, n_embd) back into the pathway. Addition distributes gradients equally, giving a "gradient super highway"; the blocks contribute little at initialisation and "come online" during training. FFN inner width = 4 x n_embd (paper: 512 -> 2048).
- **LayerNorm (ZVect 10).** It is the makemore BatchNorm1d with the reduction dim changed from 0 to 1: normalise each row (each token's features), not each column; no running buffers, no train/eval distinction; keep gamma/beta. Pre-norm: `x = x + self.sa(self.ln1(x))`. Karpathy (1:35:25): "very few details about the Transformer have changed in the last 5 years", but pre-norm is "a bit more common" now. This is a deliberate deviation from the paper's post-norm (Add & Norm after the sublayer). There is also a final LayerNorm before lm_head.
- **Dropout.** Applied after the attention softmax, after the multi-head projection and in the FFN; Srivastava et al. 2014; it is like training an ensemble of sub-networks. dropout = 0.2.
- **Decoder-only vs encoder-decoder.** The triangular mask makes it a decoder (autoregressive). The original paper is encoder-decoder for translation (French -> English with `<START>` / `<END>` tokens): an unmasked encoder, plus cross-attention inside every decoder block (q from the decoder, k and v from the encoder output). GPT is decoder-only.
- **ChatGPT pipeline.** Pre-training gives a "document completer" with "undefined behavior"; Karpathy calls it totally unaligned (1:52:17; the ASR writes "unineed", read as "unaligned" from the next sentence about aligning). Fine-tuning has roughly three steps: (1) SFT on question->answer documents (Karpathy: "maybe thousands of examples"; large models are sample-efficient); (2) raters rank sampled responses, which train a reward model; (3) PPO against the reward model. "A lot of this data is not available publicly; it is internal to OpenAI" (1:53:53). The PPO step fine-tunes the "sampling policy", i.e. the language model being tuned. nanoGPT covers pre-training only.

## Implementation
All blocks are verbatim from the frames (Colab notebook `gpt-dev.ipynb`, VS Code `bigram.py` / `v2.py`, GitHub nanoGPT `model.py`). The times are video times of the frames used. Spelling such as `FeedFoward` and `earier` is the source's own. Comment rulers (`# ------------`) were measured at 12 dashes, which matches the repo.

### 1. Data and tokenizer (notebook, 9:01-16:50)
C01 unique characters (9:20):
```python
# here are all the unique characters that occur in this text
chars = sorted(list(set(text)))
vocab_size = len(chars)
print(''.join(chars))
print(vocab_size)
```
Output: the 65 characters ` !$&',-.3:;?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz` (a leading newline is invisible) and `65`.

C02 encoder / decoder (10:50):
```python
# create a mapping from characters to integers
stoi = { ch:i for i,ch in enumerate(chars) }
itos = { i:ch for i,ch in enumerate(chars) }
encode = lambda s: [stoi[c] for c in s] # encoder: take a string, output a list of integers
decode = lambda l: ''.join([itos[i] for i in l]) # decoder: take a list of integers, output a string

print(encode("hii there"))
print(decode(encode("hii there")))
```
Output: `[46, 47, 47, 1, 58, 46, 43, 56, 43]` and `hii there`.

C03 tiktoken in a terminal (12:15):
```text
>>> import tiktoken
>>> enc = tiktoken.get_encoding('gpt2')
>>> enc.n_vocab
50257
>>> enc.encode("hii there")
[71, 4178, 612]
>>> enc.decode([71, 4178, 612])
'hii there'
```

C04 data tensor (13:05) and C35 split (16:50):
```python
# let's now encode the entire text dataset and store it into a torch.Tensor
import torch # we use PyTorch: https://pytorch.org
data = torch.tensor(encode(text), dtype=torch.long)
print(data.shape, data.dtype)
print(data[:1000]) # the 1000 characters we looked at earier will to the GPT look like this
```
```python
# Let's now split up the data into train and validation sets
n = int(0.9*len(data)) # first 90% will be train, rest val
train_data = data[:n]
val_data = data[n:]
```

C05 + C31 context/target (16:50); output `tensor([18, 47, 56, 57, 58,  1, 15, 47, 58])`:
```python
block_size = 8
train_data[:block_size+1]
```
```python
x = train_data[:block_size]
y = train_data[1:block_size+1]
for t in range(block_size):
    context = x[:t+1]
    target = y[t]
    print(f"when input is {context} the target: {target}")
```

C06 batches (20:10); output `torch.Size([4, 8])`, first row of xb `[24, 43, 58, 5, 57, 1, 46, 43]`:
```python
torch.manual_seed(1337)
batch_size = 4 # how many independent sequences will we process in parallel?
block_size = 8 # what is the maximum context length for predictions?

def get_batch(split):
    # generate a small batch of data of inputs x and targets y
    data = train_data if split == 'train' else val_data
    ix = torch.randint(len(data) - block_size, (batch_size,))
    x = torch.stack([data[i:i+block_size] for i in ix])
    y = torch.stack([data[i+1:i+block_size+1] for i in ix])
    return x, y

xb, yb = get_batch('train')
print('inputs:')
print(xb.shape)
print(xb)
print('targets:')
print(yb.shape)
print(yb)

print('----')

for b in range(batch_size): # batch dimension
    for t in range(block_size): # time dimension
        context = xb[b, :t+1]
        target = yb[b,t]
        print(f"when input is {context.tolist()} the target: {target}")
```

### 2. Bigram model, generation, training (notebook, 31:10-37:20)
C07 is assembled from two frames 30 s apart (top up to `generate` from 31:40, the rest from 31:10). At this moment `targets=None` was being typed, and the `if targets is None` branch appears later (C15). Output: `torch.Size([32, 65])`, `tensor(4.8786, grad_fn=<NllLossBackward0>)`.
```python
import torch
import torch.nn as nn
from torch.nn import functional as F
torch.manual_seed(1337)

class BigramLanguageModel(nn.Module):

    def __init__(self, vocab_size):
        super().__init__()
        # each token directly reads off the logits for the next token from a lookup table
        self.token_embedding_table = nn.Embedding(vocab_size, vocab_size)

    def forward(self, idx, targets=None):

        # idx and targets are both (B,T) tensor of integers
        logits = self.token_embedding_table(idx) # (B,T,C)

        B, T, C = logits.shape
        logits = logits.view(B*T, C)
        targets = targets.view(B*T)
        loss = F.cross_entropy(logits, targets)

        return logits, loss

    def generate(self, idx, max_new_tokens):
        # idx is (B, T) array of indices in the current context
        for _ in range(max_new_tokens):
            # get the predictions
            logits, loss = self(idx)
            # focus only on the last time step
            logits = logits[:, -1, :] # becomes (B, C)
            # apply softmax to get probabilities
            probs = F.softmax(logits, dim=-1) # (B, C)
            # sample from the distribution
            idx_next = torch.multinomial(probs, num_samples=1) # (B, 1)
            # append sampled index to the running sequence
            idx = torch.cat((idx, idx_next), dim=1) # (B, T+1)
        return idx

m = BigramLanguageModel(vocab_size)
logits, loss = m(xb, yb)
print(logits.shape)
print(loss)
```
C08 generation call (35:50):
```python
print(decode(m.generate(idx = torch.zeros((1, 1), dtype=torch.long), max_new_tokens=100)[0].tolist()))
```
C09 optimizer (35:50) and C32 loop (37:25); final `print(loss.item())` = `2.576992988586426` after 10000 steps (the first run used `range(100)`):
```python
# create a PyTorch optimizer
optimizer = torch.optim.AdamW(m.parameters(), lr=1e-3)
```
```python
batch_size = 32
for steps in range(10000):

    # sample a batch of data
    xb, yb = get_batch('train')

    # evaluate the loss
    logits, loss = m(xb, yb)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

print(loss.item())
```

### 3. Script bigram.py (38:15-40:20)
C10 lines 1-58:
```python
import torch
import torch.nn as nn
from torch.nn import functional as F

# hyperparameters
batch_size = 32 # how many independent sequences will we process in parallel?
block_size = 8 # what is the maximum context length for predictions?
max_iters = 3000
eval_interval = 300
learning_rate = 1e-2
device = 'cuda' if torch.cuda.is_available() else 'cpu'
eval_iters = 200
# ------------

torch.manual_seed(1337)

# wget https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt
with open('input.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# here are all the unique characters that occur in this text
chars = sorted(list(set(text)))
vocab_size = len(chars)
# create a mapping from characters to integers
stoi = { ch:i for i,ch in enumerate(chars) }
itos = { i:ch for i,ch in enumerate(chars) }
encode = lambda s: [stoi[c] for c in s] # encoder: take a string, output a list of integers
decode = lambda l: ''.join([itos[i] for i in l]) # decoder: take a list of integers, output a string

# Train and test splits
data = torch.tensor(encode(text), dtype=torch.long)
n = int(0.9*len(data)) # first 90% will be train, rest val
train_data = data[:n]
val_data = data[n:]

# data loading
def get_batch(split):
    # generate a small batch of data of inputs x and targets y
    data = train_data if split == 'train' else val_data
    ix = torch.randint(len(data) - block_size, (batch_size,))
    x = torch.stack([data[i:i+block_size] for i in ix])
    y = torch.stack([data[i+1:i+block_size+1] for i in ix])
    x, y = x.to(device), y.to(device)
    return x, y

@torch.no_grad()
def estimate_loss():
    out = {}
    model.eval()
    for split in ['train', 'val']:
        losses = torch.zeros(eval_iters)
        for k in range(eval_iters):
            X, Y = get_batch(split)
            logits, loss = model(X, Y)
            losses[k] = loss.item()
        out[split] = losses.mean()
    model.train()
    return out
```
C33 lines 98-122:
```python
model = BigramLanguageModel(vocab_size)
m = model.to(device)

# create a PyTorch optimizer
optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)

for iter in range(max_iters):

    # every once in a while evaluate the loss on train and val sets
    if iter % eval_interval == 0:
        losses = estimate_loss()
        print(f"step {iter}: train loss {losses['train']:.4f}, val loss {losses['val']:.4f}")

    # sample a batch of data
    xb, yb = get_batch('train')

    # evaluate the loss
    logits, loss = model(xb, yb)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

# generate from the model
context = torch.zeros((1, 1), dtype=torch.long, device=device)
print(decode(m.generate(context, max_new_tokens=500)[0].tolist()))
```

### 4. The trick: averaging the past (notebook, 43:16-58:00)
C11 toy example and C34 version 1:
```python
# consider the following toy example:

torch.manual_seed(1337)
B,T,C = 4,8,2 # batch, time, channels
x = torch.randn(B,T,C)
x.shape
```
```python
# We want x[b,t] = mean_{i<=t} x[b,i]
xbow = torch.zeros((B,T,C))
for b in range(B):
    for t in range(T):
        xprev = x[b,:t+1] # (t,C)
        xbow[b,t] = torch.mean(xprev, 0)
```
C12 the 3x3 demo (51:55); outputs a = [[1,0,0],[0.5,0.5,0],[0.3333,0.3333,0.3333]], b = [[2,7],[6,4],[6,5]], c = [[2,7],[4,5.5],[4.6667,5.3333]]:
```python
torch.manual_seed(42)
a = torch.tril(torch.ones(3, 3))
a = a / torch.sum(a, 1, keepdim=True)
b = torch.randint(0,10,(3,2)).float()
c = a @ b
print('a=')
print(a)
print('--')
print('b=')
print(b)
print('--')
print('c=')
print(c)
```
C13 version 2 (54:00), output `True`:
```python
wei = torch.tril(torch.ones(T, T))
wei = wei / wei.sum(1, keepdim=True)
xbow2 = wei @ x # (B, T, T) @ (B, T, C) ----> (B, T, C)
torch.allclose(xbow, xbow2)
```
C14 version 3 (58:00), output `True`:
```python
# version 3: use Softmax
tril = torch.tril(torch.ones(T, T))
wei = torch.zeros((T,T))
wei = wei.masked_fill(tril == 0, float('-inf'))
wei = F.softmax(wei, dim=-1)
xbow3 = wei @ x
torch.allclose(xbow, xbow3)
```

### 5. Embeddings with positions (v2.py lines 61-86, 61:40)
```python
# super simple bigram model
class BigramLanguageModel(nn.Module):

    def __init__(self):
        super().__init__()
        # each token directly reads off the logits for the next token from a lookup table
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape

        # idx and targets are both (B,T) tensor of integers
        tok_emb = self.token_embedding_table(idx) # (B,T,C)
        pos_emb = self.position_embedding_table(torch.arange(T, device=device)) # (T,C)
        x = tok_emb + pos_emb # (B,T,C)
        logits = self.lm_head(x) # (B,T,vocab_size)

        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits = logits.view(B*T, C)
            targets = targets.view(B*T)
            loss = F.cross_entropy(logits, targets)
```

### 6. Self-attention (notebook, 70:50-79:05)
C16 version 4, output `torch.Size([4, 8, 16])`; `wei[0]` on screen (rows = query position 1..8):
```text
[1.0000, 0, 0, 0, 0, 0, 0, 0]
[0.1574, 0.8426, 0, 0, 0, 0, 0, 0]
[0.2088, 0.1646, 0.6266, 0, 0, 0, 0, 0]
[0.5792, 0.1187, 0.1889, 0.1131, 0, 0, 0, 0]
[0.0294, 0.1052, 0.0469, 0.0276, 0.7909, 0, 0, 0]
[0.0176, 0.2689, 0.0215, 0.0089, 0.6812, 0.0019, 0, 0]
[0.1691, 0.4066, 0.0438, 0.0416, 0.1048, 0.2012, 0.0329, 0]
[0.0210, 0.0843, 0.0555, 0.2297, 0.0573, 0.0709, 0.2423, 0.2391]
```
```python
# version 4: self-attention!
torch.manual_seed(1337)
B,T,C = 4,8,32 # batch, time, channels
x = torch.randn(B,T,C)

# let's see a single Head perform self-attention
head_size = 16
key = nn.Linear(C, head_size, bias=False)
query = nn.Linear(C, head_size, bias=False)
value = nn.Linear(C, head_size, bias=False)
k = key(x)   # (B, T, 16)
q = query(x) # (B, T, 16)
wei =  q @ k.transpose(-2, -1) # (B, T, 16) @ (B, 16, T) ---> (B, T, T)

tril = torch.tril(torch.ones(T, T))
#wei = torch.zeros((T,T))
wei = wei.masked_fill(tril == 0, float('-inf'))
wei = F.softmax(wei, dim=-1)

v = value(x)
out = wei @ v
#out = wei @ x

out.shape
```
C17 variance cells (79:05). The cell that creates k and q with `torch.randn(B,T,head_size)` is above the frame edge in every frame (only the tail of the `q = torch.randn(B,T,head_size)` line is visible). Outputs 0.9006 / 1.0037 / 0.9957:
```python
wei = q @ k.transpose(-2, -1) * head_size**-0.5
k.var()
q.var()
wei.var()
```
C18 softmax sharpening (79:05):
```python
torch.softmax(torch.tensor([0.1, -0.2, 0.3, -0.2, 0.5]), dim=-1)
torch.softmax(torch.tensor([0.1, -0.2, 0.3, -0.2, 0.5])*8, dim=-1)
```

### 7. Head module and model (v2.py, 79:30-81:20)
C19 lines 61-82 (note `C**-0.5`, see Fact Check):
```python
class Head(nn.Module):
    """ one head of self-attention """

    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))

    def forward(self, x):
        B,T,C = x.shape
        k = self.key(x)   # (B,T,C)
        q = self.query(x) # (B,T,C)
        # compute attention scores ("affinities")
        wei = q @ k.transpose(-2,-1) * C**-0.5 # (B, T, C) @ (B, C, T) -> (B, T, T)
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf')) # (B, T, T)
        wei = F.softmax(wei, dim=-1) # (B, T, T)
        # perform the weighted aggregation of the values
        v = self.value(x) # (B,T,C)
        out = wei @ v # (B, T, T) @ (B, T, C) -> (B, T, C)
        return out
```
C20 lines 84-133:
```python
# super simple bigram model
class BigramLanguageModel(nn.Module):

    def __init__(self):
        super().__init__()
        # each token directly reads off the logits for the next token from a lookup table
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.sa_head = Head(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape

        # idx and targets are both (B,T) tensor of integers
        tok_emb = self.token_embedding_table(idx) # (B,T,C)
        pos_emb = self.position_embedding_table(torch.arange(T, device=device)) # (T,C)
        x = tok_emb + pos_emb # (B,T,C)
        x = self.sa_head(x) # apply one head of self-attention. (B,T,C)
        logits = self.lm_head(x) # (B,T,vocab_size)

        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits = logits.view(B*T, C)
            targets = targets.view(B*T)
            loss = F.cross_entropy(logits, targets)

        return logits, loss

    def generate(self, idx, max_new_tokens):
        # idx is (B, T) array of indices in the current context
        for _ in range(max_new_tokens):
            # crop idx to the last block_size tokens
            idx_cond = idx[:, -block_size:]
            # get the predictions
            logits, loss = self(idx_cond)
            # focus only on the last time step
            logits = logits[:, -1, :] # becomes (B, C)
            # apply softmax to get probabilities
            probs = F.softmax(logits, dim=-1) # (B, C)
            # sample from the distribution
            idx_next = torch.multinomial(probs, num_samples=1) # (B, 1)
            # append sampled index to the running sequence
            idx = torch.cat((idx, idx_next), dim=1) # (B, T+1)
        return idx

model = BigramLanguageModel()
m = model.to(device)
```

### 8. Multi-head, FFN, Block, residual (v2.py, 83:20-92:45)
C21 lines 84-104 (4 heads of 8):
```python
class MultiHeadAttention(nn.Module):
    """ multiple heads of self-attention in parallel """

    def __init__(self, num_heads, head_size):
        super().__init__()
        self.heads = nn.ModuleList([Head(head_size) for _ in range(num_heads)])

    def forward(self, x):
        return torch.cat([h(x) for h in self.heads], dim=-1)


# super simple bigram model
class BigramLanguageModel(nn.Module):

    def __init__(self):
        super().__init__()
        # each token directly reads off the logits for the next token from a lookup table
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.sa_heads = MultiHeadAttention(4, n_embd//4) # i.e. 4 heads of 8-dimensional self-attention
        self.lm_head = nn.Linear(n_embd, vocab_size)
```
C22 lines 97-135 (the first FeedFoward without x4; its class line and docstring are above the frame):
```python
    def __init__(self, n_embd):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, n_embd),
            nn.ReLU(),
        )

    def forward(self, x):
        return self.net(x)

class Block(nn.Module):
    """ Transformer block: communication followed by computation """

    def __init__(self, n_embd, n_head):
        # n_embd: embedding dimension, n_head: the number of heads we'd like
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size)
        self.ffwd = FeedFoward(n_embd)

    def forward(self, x):
        x = self.sa(x)
        x = self.ffwd(x)
        return x

# super simple bigram model
class BigramLanguageModel(nn.Module):

    def __init__(self):
        super().__init__()
        # each token directly reads off the logits for the next token from a lookup table
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(
            Block(n_embd, n_head=4),
            Block(n_embd, n_head=4),
            Block(n_embd, n_head=4),
        )
        self.lm_head = nn.Linear(n_embd, vocab_size)
```
C23 lines 93-122 (residual + x4 FFN; the `self.proj` constructor line of MultiHeadAttention is not visible here, but appears in C26 line 96):
```python
        out = self.proj(out)
        return out

class FeedFoward(nn.Module):
    """ a simple linear layer followed by a non-linearity """

    def __init__(self, n_embd):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.ReLU(),
            nn.Linear(4 * n_embd, n_embd),
        )

    def forward(self, x):
        return self.net(x)

class Block(nn.Module):
    """ Transformer block: communication followed by computation """

    def __init__(self, n_embd, n_head):
        # n_embd: embedding dimension, n_head: the number of heads we'd like
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_head, head_size)
        self.ffwd = FeedFoward(n_embd)

    def forward(self, x):
        x = x + self.sa(x)
        x = x + self.ffwd(x)
```

### 9. LayerNorm (notebook 95:10, v2.py 97:30)
C24 (2-space indent on screen; the class is still named BatchNorm1d but reduces over dim 1, so it is a LayerNorm). Outputs: `x[:,0]` mean 0.1469 / std 0.8803; `x[0,:]` mean -9.5367e-09 / std 1.0000.
```python
class BatchNorm1d:

  def __init__(self, dim, eps=1e-5, momentum=0.1):
    self.eps = eps
    self.gamma = torch.ones(dim)
    self.beta = torch.zeros(dim)

  def __call__(self, x):
    # calculate the forward pass
    xmean = x.mean(1, keepdim=True) # batch mean
    xvar = x.var(1, keepdim=True) # batch variance
    xhat = (x - xmean) / torch.sqrt(xvar + self.eps) # normalize to unit variance
    self.out = self.gamma * xhat + self.beta
    return self.out

  def parameters(self):
    return [self.gamma, self.beta]

torch.manual_seed(1337)
module = BatchNorm1d(100)
x = torch.randn(32, 100) # batch size 32 of 100-dimensional vectors
x = module(x)
x.shape
```
C25 v2.py lines 119-148 (the final LayerNorm is the last element of `nn.Sequential`):
```python
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)

    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x

# super simple bigram model
class BigramLanguageModel(nn.Module):

    def __init__(self):
        super().__init__()
        # each token directly reads off the logits for the next token from a lookup table
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(
            Block(n_embd, n_head=4),
            Block(n_embd, n_head=4),
            Block(n_embd, n_head=4),
            nn.LayerNorm(n_embd),
        )
        self.lm_head = nn.Linear(n_embd, vocab_size)

    def forward(self, idx, targets=None):
        B, T = idx.shape

        # idx and targets are both (B,T) tensor of integers
        tok_emb = self.token_embedding_table(idx) # (B,T,C)
        pos_emb = self.position_embedding_table(torch.arange(T, device=device)) # (T,C)
```
Terminal of this run: step 2000 train 2.1321 / val 2.1682; 2500 2.0815 / 2.1300; 3000 2.0519 / 2.1243; 3500 2.0444 / 2.1049; 4000 2.0130 / 2.0935; 4500 1.9924 / 2.0968; 4999 1.9829 / 2.0607.

### 10. Scaled-up final script (v2.py, 98:40-106:50)
C26 lines 64-96 (Head with dropout; MultiHeadAttention with proj). Attention dropout is created at line 74 and applied after the softmax at line 84; line 75 is blank on screen:
```python
class Head(nn.Module):
    """ one head of self-attention """

    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))

        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B,T,C = x.shape
        k = self.key(x)   # (B,T,C)
        q = self.query(x) # (B,T,C)
        # compute attention scores ("affinities")
        wei = q @ k.transpose(-2,-1) * C**-0.5 # (B, T, C) @ (B, C, T) -> (B, T, T)
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf')) # (B, T, T)
        wei = F.softmax(wei, dim=-1) # (B, T, T)
        wei = self.dropout(wei)
        # perform the weighted aggregation of the values
        v = self.value(x) # (B,T,C)
        out = wei @ v # (B, T, T) @ (B, T, C) -> (B, T, C)
        return out

class MultiHeadAttention(nn.Module):
    """ multiple heads of self-attention in parallel """

    def __init__(self, num_heads, head_size):
        super().__init__()
        self.heads = nn.ModuleList([Head(head_size) for _ in range(num_heads)])
        self.proj = nn.Linear(n_embd, n_embd)
```
C27 lines 1-36 (hyperparameters):
```python
import torch
import torch.nn as nn
from torch.nn import functional as F

# hyperparameters
batch_size = 64 # how many independent sequences will we process in parallel?
block_size = 256 # what is the maximum context length for predictions?
max_iters = 5000
eval_interval = 500
learning_rate = 3e-4
device = 'cuda' if torch.cuda.is_available() else 'cpu'
eval_iters = 200
n_embd = 384
n_head = 6
n_layer = 6
dropout = 0.2
# ------------

torch.manual_seed(1337)

# wget https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt
with open('input.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# here are all the unique characters that occur in this text
chars = sorted(list(set(text)))
vocab_size = len(chars)
# create a mapping from characters to integers
stoi = { ch:i for i,ch in enumerate(chars) }
itos = { i:ch for i,ch in enumerate(chars) }
encode = lambda s: [stoi[c] for c in s] # encoder: take a string, output a list of integers
decode = lambda l: ''.join([itos[i] for i in l]) # decoder: take a list of integers, output a string

# Train and test splits
data = torch.tensor(encode(text), dtype=torch.long)
n = int(0.9*len(data)) # first 90% will be train, rest val
```
C30 lines 186-211 (training loop; the commented line dumps 10,000 characters to more.txt):
```python
model = BigramLanguageModel()
m = model.to(device)

# create a PyTorch optimizer
optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)

for iter in range(max_iters):

    # every once in a while evaluate the loss on train and val sets
    if iter % eval_interval == 0 or iter == max_iters - 1:
        losses = estimate_loss()
        print(f"step {iter}: train loss {losses['train']:.4f}, val loss {losses['val']:.4f}")

    # sample a batch of data
    xb, yb = get_batch('train')

    # evaluate the loss
    logits, loss = model(xb, yb)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

# generate from the model
context = torch.zeros((1, 1), dtype=torch.long, device=device)
print(decode(m.generate(context, max_new_tokens=500)[0].tolist()))
#open('more.txt', 'w').write(decode(m.generate(context, max_new_tokens=10000)[0].tolist()))
```

### 11. nanoGPT CausalSelfAttention (GitHub model.py lines 27-62, 107:20)
The `class CausalSelfAttention(nn.Module):` line is above the frame. `class MLP` (GELU) was scrolled past and no frame shows its body readably, so it is not reproduced.
```python
    def __init__(self, config):
        super().__init__()
        assert config.n_embd % config.n_head == 0
        # key, query, value projections for all heads, but in a batch
        self.c_attn = nn.Linear(config.n_embd, 3 * config.n_embd)
        # output projection
        self.c_proj = nn.Linear(config.n_embd, config.n_embd)
        # regularization
        self.attn_dropout = nn.Dropout(config.dropout)
        self.resid_dropout = nn.Dropout(config.dropout)
        # causal mask to ensure that attention is only applied to the left in the input sequence
        self.register_buffer("bias", torch.tril(torch.ones(config.block_size, config.block_size))
                                    .view(1, 1, config.block_size, config.block_size))
        self.n_head = config.n_head
        self.n_embd = config.n_embd

    def forward(self, x):
        B, T, C = x.size() # batch size, sequence length, embedding dimensionality (n_embd)

        # calculate query, key, values for all heads in batch and move head forward to be the batch dim
        q, k ,v  = self.c_attn(x).split(self.n_embd, dim=2)
        k = k.view(B, T, self.n_head, C // self.n_head).transpose(1, 2) # (B, nh, T, hs)
        q = q.view(B, T, self.n_head, C // self.n_head).transpose(1, 2) # (B, nh, T, hs)
        v = v.view(B, T, self.n_head, C // self.n_head).transpose(1, 2) # (B, nh, T, hs)

        # causal self-attention; Self-attend: (B, nh, T, hs) x (B, nh, hs, T) -> (B, nh, T, T)
        att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(k.size(-1)))
        att = att.masked_fill(self.bias[:,:,:T,:T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        att = self.attn_dropout(att)
        y = att @ v # (B, nh, T, T) x (B, nh, T, hs) -> (B, nh, T, hs)
        y = y.transpose(1, 2).contiguous().view(B, T, C) # re-assemble all head outputs side by side

        # output projection
        y = self.resid_dropout(self.c_proj(y))
        return y
```

### 12. Encoder-decoder example cell (notebook, 106:15)
The notebook cell shown next to the paper's Transformer figure while explaining encoder vs decoder (ruler dashes counted on the frame: 9 / 18 / 15 / 17; both lines are 81 characters):
```text
# French to English translation example:

# <--------- ENCODE ------------------><--------------- DECODE ----------------->
# les réseaux de neurones sont géniaux! <START> neural networks are awesome!<END>
```

### Missing pieces (not on any frame, do not invent)
- The k / q `torch.randn` cell of the variance demo (C17).
- The `forward` of MultiHeadAttention with `out = torch.cat(...)` followed by `self.proj` in its intermediate form. The final `__init__` line `self.proj = nn.Linear(n_embd, n_embd)` is in C26.
- nanoGPT `class MLP` body; nanoGPT `train.py` (scrolled past).
- The full final `gpt.py` between lines 37 and 185 in its final state. The fact-check read the repo version, which also has `_init_weights`, never shown in the video.

## Quick Reference
| item | value | note |
|---|---|---|
| dataset | tiny Shakespeare ~1 MB, ~1M chars (1,115,394) | ~40,000-line subset of the plays, not the complete works |
| vocab_size | 65 | char-level |
| tiktoken gpt2 n_vocab | 50257 | "hii there" -> [71, 4178, 612] |
| split | 90% / 10% | |
| block_size | 8 -> 256 | |
| batch_size | 4 (demo) -> 32 -> 64 | |
| n_embd | 32 -> 384 | Copilot suggested 32 |
| heads x head_size | 1x16 (demo) -> 4x8 -> 6x64 | n_embd = n_head * head_size |
| n_layer | 3 -> 6 | |
| dropout | 0.2 | |
| learning_rate | notebook AdamW 1e-3; bigram.py 1e-2; final 3e-4 | "typical good setting roughly 3e-4"; the lowered value after adding one self-attention head and the larger iteration count are not given at 1:21 (1:21:20: not said, not on screen); the later LayerNorm run implies 5000 iterations (see the val loss ladder row; inferred) |
| max_iters / eval_interval / eval_iters | 3000/300/200 (bigram.py); 5000/500/200 (final) | |
| initial loss | expected 4.17 = -ln(1/65); measured 4.87 (4.8786) | |
| val loss ladder | ~2.5 bigram; 2.4 one head; 2.28 4 heads; 2.24 +FFN; 2.08 +residual/proj/x4; 2.06 +LayerNorm; 1.48 scaled + dropout | the plain 3-Block stack (no residual) has no number in the video: "doesn't actually give a very good result" (1:28:01); the LayerNorm run prints step 4999, so it ran 5000 iterations (inferred from `iter == max_iters - 1`) |
| params | ~10M (10,788,929) | |
| training time | "about 15 minutes" on an A100 (speaker estimate) | |
| FFN width | 4x n_embd (paper 512 -> 2048) | |
| GPT-3 175B | 96 layers, d_model 12288, 96 heads, d_head 128, batch 3.2M tokens, lr 0.6e-4, 300B tokens | |

GPT-3 Table 2.1 (screen, all rows):
| Model | n_params | n_layers | d_model | n_heads | d_head | batch (tokens) | lr |
|---|---|---|---|---|---|---|---|
| GPT-3 Small | 125M | 12 | 768 | 12 | 64 | 0.5M | 6.0e-4 |
| GPT-3 Medium | 350M | 24 | 1024 | 16 | 64 | 0.5M | 3.0e-4 |
| GPT-3 Large | 760M | 24 | 1536 | 16 | 96 | 0.5M | 2.5e-4 |
| GPT-3 XL | 1.3B | 24 | 2048 | 24 | 128 | 1M | 2.0e-4 |
| GPT-3 2.7B | 2.7B | 32 | 2560 | 32 | 80 | 1M | 1.6e-4 |
| GPT-3 6.7B | 6.7B | 32 | 4096 | 32 | 128 | 2M | 1.2e-4 |
| GPT-3 13B | 13.0B | 40 | 5140 | 40 | 128 | 2M | 1.0e-4 |
| GPT-3 175B | 175.0B | 96 | 12288 | 96 | 128 | 3.2M | 0.6e-4 |

## Comparisons
- **Video model vs GPT-3 175B:** ~10M vs 175B params; ~300K GPT-2 tokens vs 300B tokens (~1,000,000x in tokens, ~16,200x in params; Karpathy: "between 10,000 and 1 million times bigger depending on how you count"); char vocab 65 vs ~50K subwords; 6/384/6/64 vs 96/12288/96/128; batch 64x256 = 16,384 tokens vs 3.2M tokens; lr 3e-4 vs 0.6e-4.
- **Encoder block vs decoder block:** they differ by one line (the masked_fill with tril).
- **BatchNorm vs LayerNorm:** the reduction dim is 0 (columns, across the batch, needs running stats) vs 1 (rows, per token, no running stats).
- **Post-norm (paper) vs pre-norm (video, GPT-2):** LayerNorm after vs before the sublayer inside the residual branch.
- **Per-head modules (video) vs batched heads (nanoGPT `CausalSelfAttention`, shape (B, nh, T, hs)):** mathematically equivalent; nanoGPT is faster, and divides by `math.sqrt(k.size(-1))` (correct head-size scaling).
- **ReLU (video) vs GELU (nanoGPT MLP, to load OpenAI checkpoints).**

## Fact Check
20 claims: 18 confirmed, 1 partly, 1 contradicted (J/factcheck.md).
- Contradicted: "GPT-2 ... from 2017 if I recall correctly" (6:29). GPT-2 was announced 14 Feb 2019.
- Partly: tiny Shakespeare is "all of Shakespeare in my understanding" (3:58). It is a ~40,000-line subset.
- Author's own corrections (video description): 57:00 "tokens from the future cannot communicate", not "past"; 1:20:05 "should be using the head_size for the normalization, not C". The screen code keeps `C**-0.5` in every later frame. It equals head_size only while a single head has head_size = n_embd (s15). From multi-head on (head_size 8, C 32), the screen code divides by sqrt(32) instead of sqrt(8). The repo `gpt.py` uses `k.shape[-1]**-0.5`.
- Confirmed with numbers: the 1 MB / 1,115,394 chars / vocab 65 / 90-10 split; nanoGPT ~300 + ~300 lines (now deprecated, Nov 2025, in favour of nanochat); GPT-2 124M (announced as 117M in 2019); SentencePiece subword; tiktoken n_vocab 50257; cross_entropy class dim second; -ln(1/65) = 4.1744; Var(q.k) = d_k footnote; ResNet arXiv 1512.03385 (Dec 2015); d_model 512 / d_ff 2048; pre-LN (GPT-2, Xiong et al. 2020); dropout JMLR 2014; final hyperparameters match the repo (the 15 minutes is the speaker's estimate); 10,788,929 params; Shakespeare in GPT-2 BPE = 301,966 train tokens; GPT-3 175B / 300B tokens; ChatGPT SFT -> RM -> PPO (base model GPT-3.5, not GPT-3).
- Screen-only observations: GPT-3 Table 2.1 lists d_model 5140 for 13B, while 40 x 128 = 5120 (the paper's own value). The ASR "248" is 2048 on the paper page.

## Open Questions & Extension Ideas
- Author note, ZVect 3.1 (character tokenizer): use C01/C02 verbatim as the first runnable tokenizer lesson; the 65-symbol breakdown (26/26/10/1/1/1) and "hii there" -> 9 ids vs tiktoken 3 ids ([71, 4178, 612], n_vocab 50257) make a ready-made exercise on the codebook-size / sequence-length trade-off. ZVect is zero-dependency JS: port stoi/itos/encode/decode one to one.
- Author note, ZVect 9 (LLM input, attention q.k): the sequence s8 -> s9 -> s10 -> s12 is a complete lesson plan: average with loops -> the same with a lower-triangular matmul (the 3x3 numbers a, b, c above make a good worked example) -> masked_fill(-inf) + softmax gives the same matrix -> replace zeros by q.k. The on-screen `wei[0]` 8x8 matrix can be shown as a heatmap with real numbers. The position embedding (C15) is the bridge to "LLM input = token embedding + position embedding".
- Author note, ZVect 10 (self-attention, sqrt(d) scaling, mask, block, residual, layer norm): the variance demo (0.9006 / 1.0037 / 0.9957) and the softmax x8 demo are the two numbers to show for sqrt(d); a slider over the temperature t (t = 1/8 reproduces x8) is an easy interactive. Teach the C-vs-head_size bug explicitly as a pitfall. Block = communicate + compute; residual = "gradient super highway"; LayerNorm = BatchNorm with dim 0 -> 1 (show both outputs: column mean 0.1469 / std 0.8803 vs row mean ~0 / std 1.0000).
- Author note: the val-loss ladder (2.5 -> 2.4 -> 2.28 -> 2.24 -> 2.08 -> 2.06 -> 1.48) is a good "ablation" chart for a lesson closing slide; note that only the last step changed scale as well.
- Open: the video never shows weight initialisation (the repo's `_init_weights`, std 0.02) or learning-rate decay; a ZVect lesson that trains anything should state its own init.
- Open: the description's exercises (EX1: merge Head and MultiHeadAttention into one batched module, as in nanoGPT; EX2: train on your own data / addition a+b=c; EX3: pre-train big then fine-tune on Shakespeare; EX4: implement one Transformer improvement) are candidate homework items.
- Terms the video uses without defining (the report gives the report author's short definitions, not from the video): BN = batch normalization (S114 picture); `eps=1e-5` guards the sqrt against a zero variance; temperature = the divisor t before softmax; GELU = x * Phi(x), a smooth ReLU-like curve; weight decay = shrinking weights each step (AdamW has it built in); policy (RL) = the model that picks the answer.
- Pitfall for any port: positions must be cropped (`idx[:, -block_size:]`) because the position table has only block_size rows.

## Tags & Triggers
GPT, Transformer, self-attention, multi-head attention, scaled dot-product attention, causal mask, character tokenizer, PyTorch, nanoGPT, Andrej Karpathy, tiny Shakespeare, residual connection, LayerNorm, pre-norm, dropout, decoder-only, cross-attention, RLHF, PPO, ChatGPT.
- "How do I implement self-attention from scratch in PyTorch?"
- "Why divide attention scores by sqrt(head_size)?"
- "What does the triangular mask do in a GPT decoder?"
- "What hyper-parameters give a ~10M-parameter char-level GPT on tiny Shakespeare?"
- "How is GPT different from the original encoder-decoder Transformer?"

## References
- Andrej Karpathy, "Let's build GPT: from scratch, in code, spelled out.", YouTube, 2023-01-17: https://www.youtube.com/watch?v=kCc8FmEb1nY
- Lecture code: https://github.com/karpathy/ng-video-lecture ; nanoGPT: https://github.com/karpathy/nanoGPT
- Vaswani et al., "Attention Is All You Need", 2017: https://arxiv.org/abs/1706.03762
- Brown et al., "Language Models are Few-Shot Learners" (GPT-3), 2020: https://arxiv.org/abs/2005.14165
- OpenAI, "Introducing ChatGPT", 2022: https://openai.com/index/chatgpt/?authuser=0
- Fact-check sources: https://openai.com/index/better-language-models/ ; https://arxiv.org/abs/1512.03385v1 ; https://www.jmlr.org/papers/v15/srivastava14a.html ; https://proceedings.mlr.press/v119/xiong20b.html ; https://www.tensorflow.org/datasets/catalog/tiny_shakespeare?hl=en ; https://github.com/google/sentencepiece ; https://docs.pytorch.org/docs/2.3/generated/torch.nn.functional.cross_entropy.html ; https://arxiv.org/html/1706.03762v7 ; https://spectrum.ieee.org/meta-llama-3

## Equations (LaTeX)
1. $$ -\ln\left(\frac{1}{65}\right)\approx 4.17 $$
2. $$ \mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^{T}}{\sqrt{d_k}}\right)V $$
3. $$ \mathrm{Var}(q\cdot k)\approx d_k,\qquad \mathrm{Var}\left(\frac{q\cdot k}{\sqrt{d_k}}\right)\approx 1 $$
4. $$ \mathrm{FFN}(x)=\max(0,\,xW_1+b_1)W_2+b_2 $$
