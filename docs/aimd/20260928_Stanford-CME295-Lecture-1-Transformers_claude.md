# Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 1 - Transformers — Stanford Online (Afshine & Shervine Amidi) - Claude Context
> Source: YouTube, Stanford Online, "Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 1 - Transformers", 1:44:28, published 2026-09-28 (lecturers Afshine and Shervine Amidi) · https://www.youtube.com/watch?v=114i2Kz-LZA · Generated: 2026-10-12
> Companion: 20260928_Stanford-CME295-Lecture-1-Transformers.html (Thai, iw mode `iwd`, 13 sections, 9 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite, complete, with fact-check against the original paper (standard YouTube license; manual English captions).
- Frames used: 01_paper-2017, 02_tokenization, 03_one-hot, 04_rnn, 05_attention-history, 06_attention-formula, 07_transformer-architecture, 08_multi-head-encoder, 09_decoder.
- Own SVG diagrams: flow, timeline.
- Transcript SHA-256 (in-page = decoded): `64bd09a97004e7fbb4b44c98716b85940ffe545eeafc209e6ade72b5ed22b1d9`; kept in the session workspace only.

## TL;DR
Stanford CME295 (Transformers & LLMs), Autumn 2026, Lecture 1 (1:44:28), Afshine and Shervine Amidi. After logistics (Fridays 3:30–5:20, 2 units, no homework, midterm Oct 23 + final, 9 lectures; Super Study Guide; cheat sheet ~15 languages), it builds the motivation chain to the transformer: 2010s task-specific RNNs → 2017 "Attention Is All You Need" (very scalable) → LLMs → ChatGPT (Nov 2022) → coding agents (2026). Tokenization (word / character / subword trade-offs; BPE "by far the most popular"; special tokens UNK, BOS, EOS, PAD; LLM vocabularies ~hundreds of thousands, e.g. 200,000) → one-hot (orthogonal, meaningless) → word2vec via a proxy task (CBOW / skip-gram; hidden size D ≪ V; limitations: one vector per word, no word order) → RNN hidden state (word order, but long-range dependency from vanishing gradients; sequential, slow) and LSTM cell state (same issue) → attention (direct connections to past tokens) → self-attention with Q, K, V projections: softmax(QKᵀ/√d_k)V, "probably the most important formula". Transformer (encoder–decoder for translation): token embedding + position embedding (learned or sin/cos, clock analogy) → encoder (self-attention + FFN, N = 6) → decoder from [BOS] (masked self-attention, cross-attention with Q from decoder and K, V from encoder, FFN) → linear + softmax → next token, autoregressive until [EOS]. Tricks: residual (x + f(x)), layer norm, masking (−∞ → softmax 0), multi-head (h heads, concat, W_O back to d_model), dropout, label smoothing (lecturer's 90% / 10% example). Shervine: the essentials are attention and the FFN (where most parameters sit). Fact-check 16: 12 confirmed, 4 partly, 0 contradicted.

## Key Concepts
- 0:06 Lecturers: twin brothers, Centrale Paris; Afshine MIT, Shervine Stanford ICME; Uber, Google, now Netflix; LLM work since early 2020s; teaching since 2021, Stanford class since last year, third instance. Goal: how LLMs work (transformer), how trained, how used, strengths/weaknesses. Audience "pretty wide": researchers, personal projects ("probably" know what coding agents are good at), AI literacy. Prerequisites: linear algebra, ML basics (loss, network, embedding).
- 3:43 Changes since last year: post-training (on-policy distillation), agents, new paradigms (diffusion). Logistics: recorded, posted within two days; no homework; midterm (first four lectures, Oct 23) and final (last five), 9 lectures, each exam 50% (as said); 2025 exams on the website; Ed; slides one day before; textbook (library copies, online); cheat sheet most up to date, ~15 languages incl. English; Canvas; ~"two hours or one hour 15 minutes" per week; sources at the bottom of slides; many abbreviations.
- 12:42 Timeline: 2010s one model per use case (RNNs: sentiment, translation, NER); 2017 transformer, scalable (more data, compute, parameters → much larger gains); scaled into LLMs; ChatGPT Nov 2022 (he believes the announcement tweet had a typo, funny because releases now get "10 times review"); 2026 coding agents ("I'm assuming" students use them daily).
- 16:56 Tokenization: models understand numbers; split text into indivisible tokens; "A cute Teddy bear is reading." → 6 tokens; vocabulary decides sequence length (tight relation with vocabulary size). Word-level: simple, interpretable; large vocabulary, bear/bears unrelated, out-of-vocabulary risk. Character-level: small vocabulary, no OOV, robust to misspellings; very long sequences (complexity grows with length), less interpretable embeddings. Subword: shares roots (read + ing), learned from data; extra work, depends on training data.
- 27:24 BPE: start from an initial set (letters), merge the most frequent pair ("a" + "n" → "an"), add to vocabulary, repeat to the target size; shorter sequences → efficiency; multilingual work needs a multilingual tokenizer corpus. Not n-grams. Special tokens: [UNK] ("tedi bear" → [UNK] bear), [BOS], [EOS], padding (same-length batches), user/assistant; conventions vary. Vocabulary size "on the order of hundreds of thousands, 200,000". Multilingual vocabulary: "hard to say".
- 37:27 One-hot: all orthogonal, dot product 0, no meaning. Want teddy bear near soft, book independent. word2vec: proxy task — CBOW (predict middle word) or skip-gram (predict surrounding words). Slide example (predict next word): V = 6, "a" = (1,0,0,0,0,0), hidden 2 values (0.2, 0.9), softmax output, target "cute", push its 0.4 toward 1 with cross-entropy, update weights, repeat over the corpus. Shapes: one-hot V, hidden D (chosen, ≪ V), output V. Learned hidden vectors are meaningful (teddy bear : soft :: Persian poetry : art; Paris : France :: Berlin : Germany). "I believe it was 2013". Limitations: unseen words; dimension grows with vocabulary (a tokenizer limitation, general to all methods); polysemy (cute sarcastic, bank river vs bank money); word order ignored ("the child is hugging the Teddy bear" vs reverse) — the last raised by the lecturer.
- 48:26 RNN: hidden state A encodes the sequence so far, fed with each next token → word order; used for classification, per-token labelling, generation. Limitation: one vector keeps being modified → trouble remembering far-back words (long-range dependency; "My Teddy bear is so cute. It is 3 feet tall."). LSTM adds a cell state to carry information longer; still the same issue. Root cause: vanishing gradient. Sequential: predicting the next token needs all previous steps → training extremely slow.
- 55:18 Attention: direct connections from a token to past tokens; the model learns which matter (translation: knowing which source word is being translated). Slide: introduced 2014; seq2seq could not "remember" the input sentence.
- 57:16 Self-attention ("attention on steroids"): a token's representation is a function of all tokens in the sequence; vanilla version loses word order (fixed later with positions). Query = what the token looks for; compare with each key (dot product); weights; weighted sum of values: Σᵢ sim(q, kᵢ) vᵢ. Example: "cute" describes "Teddy bear" well, so q(teddy bear)·k(cute) "maybe" high. Q, K, V come from learned projection matrices. Matrix form softmax(QKᵀ/√d_k)V; board derivation: (QKᵀ)ᵢⱼ = qᵢ·kⱼ, row i of (QKᵀ)V = Σⱼ (qᵢ·kⱼ) vⱼ (softmax and scaling omitted on the board). "I believe there was a question on the midterm."
- 1:09:35 Why "Attention Is All You Need": no recurrence; tokens interact directly. Translation context: encoder (meaningful source representations) and decoder (generate the translation using encoder output and its own embeddings). Input: token embeddings (learned, not context-aware) + position embeddings (added). Positions: learned (cannot exceed trained length, e.g. 500 vs 1,000) or predefined sin/cos at different frequencies (clock: hour, minute, second hands at different frequencies; 4:49); close positions similar, far ones dissimilar; the authors tried both, each with pros and cons.
- 1:16:27 Encoder: self-attention (projection to Q, K, V, the formula) + FFN (project to higher dimension with an activation for nonlinearity); output: per-token context-aware representations. Decoder: input [BOS] + position; self-attention over itself and generated tokens; second attention with Q from generated tokens and K, V from the encoder; FFN; project to vocabulary; probabilities; pick; feed back autoregressively. "Probably one of the most difficult" lectures.
- 1:22:16 Tricks: residual (answering a question about merging arrows) — output = f(x) + x, modifying rather than replacing x, helps backprop; layer normalization (convergence); masked self-attention (only tokens decoded so far); multi-head (several projections, like CNN filters; h heads); dropout (widely used; drop units at training time to avoid over-reliance); label smoothing ("what a nice day/class/evening"; target "maybe, I don't know, 90%", 10% spread over the vocabulary; generalises "a bit better"; authors found it improves BLEU).
- 1:27:35 End-to-end example (Shervine): translate "A cute teddy bear is reading." (paper: French, German); an arbitrary split to show tokenization is a choice; [BOS], [EOS]. Encoder: lookup-table embeddings (learnable) + additive sin/cos positions (d_model), "at least half learnable"; n × d_model matrix; W_Q, W_K, W_V; dimensions: W_Q d_model × d_q (likewise K, V), Q, K, V are n × d_q / d_k / d_v, d_q = d_k required; QKᵀ is n × n of query–key similarities, row softmax = distribution over keys, weights the values; divide by √d_k because d_k influences the variance. Multi-head: h times in parallel, concatenate, W_O maps h·d_v back to d_model (many operations keep d_model invariant). FFN: one hidden layer of size d_ff, typically bigger than d_model. Repeat N times; N = 6 in the paper. Decoder: [BOS] embedding + position; masked (causal) self-attention; cross-attention (Q from decoder, K and V from the last encoder output, given to every decoder block); FFN; linear; softmax over the vocabulary; pick max (sampling heuristics next lecture) → "un", feed back, "ours en peluche", … until [EOS].
- 1:40:01 Q&A: essentials, "if you were to ask me": attention (later lectures drop many components and repeat a subset) and the FFN (where most parameters reside and learning happens); the rest are tricks, plus data quality. Mask: triangular matrix, −∞ → softmax 0; "I think" enough to remember: cut connections to later tokens. Softmax in attention = projecting the query over keys; final softmax = next-token prediction. [BOS] is a decoder input placeholder; watch for [EOS] in the output. Closing: "We're just in 2017"; next lectures cover training, second half agents and systems.

## Implementation
Scaled dot-product self-attention (one head), as taught; masking for the decoder.
```python
import numpy as np
def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x); return e / e.sum(axis=axis, keepdims=True)
def self_attention(X, Wq, Wk, Wv, causal=False):
    # X: n x d_model; Wq, Wk: d_model x d_k; Wv: d_model x d_v
    Q, K, V = X @ Wq, X @ Wk, X @ Wv
    S = Q @ K.T / np.sqrt(K.shape[1])           # n x n similarity of every query with every key
    if causal:
        S = np.where(np.tril(np.ones_like(S)) == 1, S, -np.inf)   # mask future tokens -> weight 0
    A = softmax(S, axis=1)                       # each row sums to 1
    return A @ V                                 # n x d_v: weighted mix of values
# multi-head: run h heads with their own (Wq, Wk, Wv), concat to n x (h*d_v), multiply by W_O (h*d_v x d_model)
# block: Z = LayerNorm(X + MHA(X)); out = LayerNorm(Z + FFN(Z)), FFN: d_model -> d_ff -> d_model with an activation
# decoder block adds cross-attention: Q from the decoder stream, K and V from the encoder output
```
Sinusoidal positions (paper): PE(pos, 2i) = sin(pos / 10000^(2i/d_model)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)) — general knowledge; the lecture showed the idea (clock hands), not the formula. Paper base values (fact-check, not spoken): d_model 512, h 8, d_k = d_v 64, d_ff 2048, N 6 (encoder and decoder), dropout 0.1, label smoothing 0.1.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Course | CME 295, Fri 3:30–5:20, 2 units, no homework, midterm Oct 23 + final, 9 lectures | 5:01–6:28 |
| Timeline | 2010s RNNs → 2017 transformer → Nov 2022 ChatGPT → 2026 agents | 12:42–16:17 |
| Example | "A cute Teddy bear is reading." = 6 tokens | 17:53 |
| Vocabulary today | hundreds of thousands, e.g. 200,000 | 35:28 |
| Special tokens | UNK, BOS, EOS, PAD, user/assistant | 31:44–34:57 |
| word2vec slide | V = 6, hidden (0.2, 0.9), p(cute) = 0.4 | 41:16–42:20 |
| Formula | softmax(QKᵀ/√d_k)V, d_q = d_k | 1:04:55, 1:32:48 |
| Shapes | X n×d_model, W_Q d_model×d_q, QKᵀ n×n, W_O h·d_v×d_model | 1:31:47–1:35:51 |
| Layers | N = 6 (encoder, as said) | 1:36:21 |
| Label smoothing | 90% / 10% (lecturer's example) | 1:27:08 |

## Comparisons
| Tokenizer | Pros | Cons |
|---|---|---|
| Word | simple, interpretable | large vocab, no shared roots, OOV |
| Character | small vocab, no OOV, robust to typos | long sequences, slow, abstract embeddings |
| Subword (BPE) | shared roots, learned, shorter sequences | extra training, data-dependent |

| Representation | Order | Context | Main limit |
|---|---|---|---|
| One-hot | no | no | orthogonal |
| word2vec | no | no | one vector per word |
| RNN / LSTM | yes | some | long-range dependency, sequential |
| Self-attention | via positions | yes | — |

## Fact Check
16 claims: 12 confirmed, 4 partly, 0 not found, 0 contradicted (subagent, 2026-10-12; openai.com not fetched).
- Partly: lecturer backgrounds (Netflix / Afshine at Google not on primary pages); course facts (50/50 not on official pages; rest matches cme295.stanford.edu); ChatGPT Nov 30 2022 confirmed but no record of a typo; "most parameters in the FFN" true per encoder layer (FFN ≈ 2.1M vs attention ≈ 1.05M), ~50/50 per decoder layer, ~39% of the 65M base model.
- Confirmed: paper EN→FR 41.8 / EN→DE 28.4 BLEU, encoder N = 6; word2vec 2013, CBOW / skip-gram, Paris–France–Berlin–Germany; vocabularies (o200k ~200k, Llama 3 128k, Gemma 256k); BPE algorithm; vanishing gradient, LSTM cell state; attention 2014 (Bahdanau, Cho, Bengio); √d_k because dot-product variance is d_k; learned vs sinusoidal nearly identical (25.7 vs 25.8 BLEU), sinusoids may extrapolate; h = 8, d_model 512, d_ff 2048; residual, layer norm, dropout 0.1, label smoothing 0.1 improves BLEU; cross-attention Q from decoder, K/V from encoder; on-policy distillation and diffusion LMs exist.

## Open Questions & Extension Ideas
- Author note: the board derivation omits softmax and √d_k on purpose; the full formula is explained at ~1:34:49.
- Author note: GPT-style LLMs are decoder-only (general knowledge), matching the remark that later lectures drop components.
- Teaching ideas for ZVect (new chapter "LLM - Stanford", Transformer theory): (1) why transformers — one-hot → word2vec → RNN → attention → self-attention, each fixing the previous step's limit; (2) self-attention end to end with a tiny 3-token example: X, W_Q, W_K, W_V, QKᵀ (n×n), /√d_k, row softmax, ×V, plus a causal mask toggle; (3) the transformer block: + position (sin/cos clock), multi-head + W_O, residual + layer norm, FFN d_ff, N layers, encoder vs decoder with cross-attention.

## Tags & Triggers
transformer, self-attention, attention, query-key-value, scaled-dot-product, multi-head-attention, positional-encoding, encoder-decoder, cross-attention, masked-attention, feed-forward, residual, layer-norm, label-smoothing, tokenization, bpe, word2vec, rnn, lstm, stanford, history-of-ai, fact-checked
- "Why did transformers replace RNNs?"
- "Explain softmax(QKᵀ/√d_k)V with shapes"
- "Encoder vs decoder, what is cross-attention?"
- "Why sin/cos position embeddings?"
- "Why does the decoder need a mask?"

## References
- Stanford Online, "Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 1 - Transformers", YouTube, 2026-09-28, https://www.youtube.com/watch?v=114i2Kz-LZA
- Course: https://cme295.stanford.edu/syllabus/ ; cheat sheet https://github.com/afshinea/stanford-cme-295-transformers-large-language-models
- Fact-check: https://arxiv.org/abs/1706.03762 ; https://arxiv.org/abs/1409.0473 ; https://arxiv.org/abs/1301.3781 ; https://arxiv.org/abs/1508.07909 ; https://en.wikipedia.org/wiki/Long_short-term_memory ; https://huggingface.co/learn/llm-course/en/chapter6/5 ; https://github.com/openai/tiktoken ; https://ai.meta.com/blog/meta-llama-3/ ; https://arxiv.org/pdf/2403.08295 ; https://thinkingmachines.ai/blog/on-policy-distillation/ ; https://arxiv.org/abs/2502.09992 ; https://bulletin.stanford.edu/courses/2270311
