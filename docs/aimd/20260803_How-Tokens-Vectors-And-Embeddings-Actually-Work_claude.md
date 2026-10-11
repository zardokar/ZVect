# How Tokens, Vectors & Embeddings Actually Work — Self-Attention Deep Dive (NitMonk, Hindi) — Claude Context
> Source: YouTube, NitMonk, "How Tokens, Vectors & Embeddings Actually Work — Self-Attention Deep Dive", 39:56, published 2026-08-03, spoken in Hindi/Hinglish, https://www.youtube.com/watch?v=YIR-KxNpSbA · Generated: 2026-10-11
> Companion: docs/outhtm/20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work.html (Thai, own-words rewrite)

## TL;DR
A first-principles Hindi walkthrough using an interactive web page plus a whiteboard: text → BPE tokens ("language atoms", e.g. "I love AI Agents" → 2, 891, 15, 4402; ~4 characters per token; tokens drive pricing) → token IDs → embedding matrix rows (e.g. 1,536 numbers for text-embedding-3-small; 3,072 for large) whose values start random and are moved by backpropagation so words in similar contexts end up close (distributional semantics) → self-attention makes vectors context-dependent (bank: money vs Yamuna river bank; apple: fruit vs company) → final vector scored against the whole vocabulary, softmax + temperature pick the next token. A cat/dog/tiger/lion property table (legs, fur, tail, size, pet, wild) motivates embeddings vs raw IDs. Several explanations are inaccurate (listed below). Three cooking segments are off-topic and skipped.

## Key Concepts
- 0:00 Intro; agenda: tokens, embeddings, vectors, vector databases.
- 1:01 "I love AI Agents" → token IDs 2, 891, 15, 4402; tokens = "language atoms". Tokenizer demo: OpenAI sentence, 57 characters, 11 tokens; "Open", "AI", "'s", " large" separate; ~4 characters per token on average.
- 2:12 Why not whole words: run/running/runner and many languages → vocabulary of billions. "internationalization" → inter / nation / al / ization.
- 3:12 BPE (called "byte pair coding"): start from characters (t, h, e), count frequent adjacent pairs, merge (the), repeat "millions of times"; "Open" vs "open AI"; "'s" separate; leading space attached to the next word.
- 6:01 Rule of thumb: 1 token ≈ 4 characters; 1M tokens ≈ 4M characters; tokens ≠ words ≠ characters.
- 7:29 Pricing by token (OpenAI, Claude, Gemini, DeepSeek, self-hosted); enterprises minimise tokens in system/user/skills; RAG budget.
- 10:25 IDs cat=1, dog=2, tiger=3, lion=4 imply 1 is near 2 — meaningless/ambiguous without properties.
- 12:13 Property table: index, legs, fur, tail, size, pet, wild. cat [4,1,1,1,1,0], dog [4,1,1,2,1,0], tiger [4,1,1,3,0,1], lion [4,1,1,4,0,1] (whiteboard prefixes the index: cat → [1,4,1,1,1,1,0], dog → [2,4,1,1,2,1,0]). Six properties = six dimensions.
- 17:02 Six → 1,536 dims = text-embedding-3-small; large 3,072 (ASR "372").
- 18:51 Spreadsheet analogy: rows 0–150,000 ("ChatGPT input token 1.5 lakh"), columns D1…D1536; cat row = 1,536 numbers; called a dictionary (inaccurate: rows = vocabulary size).
- 20:56 Real dimensions are not hand-defined; the model decides. Random before training; after training words in similar contexts drift together (cat drinks / dog drinks, cute cat / cute dog, pet cat / pet dog). Backpropagation nudges numbers billions of times; distributional semantics.
- 23:59 2D illustration: before tiger (10,20), dog (100,120), cat (10,30); after dog ~(101,110), cat ~(105,108).
- 24:47 Vector dims: meaning lives in the combination of all numbers; cat~dog, cat≠banana. Token = piece of text; token ID = address in dictionary; vector = list of numbers stored at that address.
- 25:51 Embedding matrix = the whole sheet = lookup table; rows token IDs, columns D1..D1536; starts random, organised by training.
- 27:04 Why not 1M dims: presenter frames a 1M × 1M matrix (1M IDs × 1M dims) and says lookups get slow; 1,536 / 3,072 suffice.
- 28:07 Pinecone / Qdrant store vectors and compute cosine / dot; they don't create embeddings (embedding comes from e.g. OpenAI text-embedding-3-small).
- 31:13 Attention demo: click I → love; love → I, agents; AI → agents; agents → AI. Explained as dot product of word vectors ("93% similar").
- 32:59 Bank: "I deposited money in the bank" vs "I reached Yamuna river bank". Before attention one fixed embedding; after attention context changes the vector (contextual embedding). Page: "I ate an apple" vs "Apple released a phone".
- 35:47 Next token: final vector scored against every vocabulary word → softmax + temperature; after "cat": milk, water, the, coffee, juice; milk most likely. Temperature 0 → top token (milk 93%); temperature "3" → more creative (water too).
- 37:45 Recap (contains the "BPE corrects the numbers" error).

## Implementation
Teaching playbook reproduced from the video (with corrections):
1. Tokenise with BPE (train merges on a corpus; apply merges in order); map tokens → IDs.
2. Embedding matrix E ∈ R^{|V|×d} (|V| ≈ 100k–200k for OpenAI tokenizers; d = 1,536 / 3,072 for OpenAI embedding models); x_t = E[id_t].
3. Self-attention (correct form, not shown in the video): Q = XW_q, K = XW_k, V = XW_v; A = softmax(QKᵀ/√d_k); output = AV → contextual vectors.
4. Next token: logits = h_last W_outᵀ (|V| scores); p = softmax(logits / T); T=0 → argmax.
Toy numbers: property vectors above; Euclidean distances (author): cat–dog 1.000, tiger–lion 1.000, dog–tiger 1.732, cat–tiger 2.449, dog–lion 2.449, cat–lion 3.317; with IDs only, dog is equally close (1) to cat and tiger.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Token IDs | I love AI Agents → 2, 891, 15, 4402 | 1:04 |
| Tokenizer demo | 57 chars → 11 tokens | 1:56 |
| Rule | 1 token ≈ 4 chars | 6:01 |
| Properties | legs, fur, tail, size, pet, wild | 12:13 |
| OpenAI dims | 1,536 (small), 3,072 (large) | 17:02 |
| Training | random → backprop; distributional semantics | 21:49 |
| Vector DB | stores + cosine/dot | 28:36 |
| Polysemy | bank, apple | 32:59 |
| Next token | softmax + temperature; milk 93% at T=0 | 35:47 |

## Comparisons
| Representation | Meaning | Source |
|---|---|---|
| Token ID | none (address) | tokenizer vocabulary |
| Hand-made property vector | interpretable but impossible at scale | human |
| Learned embedding | similarity reflects usage | training |
| Contextual vector | depends on sentence | self-attention |

## Open Questions & Extension Ideas
- Interactive lesson idea: ID distance vs property distance for four animals (numbers above).
- Pair with the Karpathy GPT tokenizer report (byte-level BPE) for the tokenization half.

## Tags & Triggers
Tags: tokens, tokenization, bpe, token-ids, chars-per-token, token-pricing, embeddings, feature-table, embedding-dimensions, text-embedding-3, embedding-matrix, lookup-table, distributional-semantics, backpropagation, vector-database, self-attention, contextual-embeddings, polysemy, next-token-prediction, softmax, temperature, hindi-source
Triggers:
- Difference between token, token ID, vector and embedding?
- Why are raw IDs not enough?
- How many characters per token; why do tokens matter for cost?
- How big is an embedding matrix?
- Why does the same word get different vectors?
- How do softmax and temperature choose the next token?

## References
- https://www.youtube.com/watch?v=YIR-KxNpSbA
- https://developers.openai.com/api/docs/guides/embeddings · https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them · https://github.com/openai/tiktoken

## Processing Notes
- License: standard YouTube → own-words rewrite. Captions: Hindi ASR (885 lines) read with YouTube's English auto-translation (861 lines) as an aid; numbers checked against the whiteboard frames. Neither transcript is stored in the repo. Auto-translation error fixed: "पेट" = pet (not stomach).
- Skipped off-topic segments per the video's own chapters: cooking at 8:57–10:20, 29:26–31:12, 38:45–end; WhatsApp/series promotion.
- Inaccuracies flagged (HTML section 8): vocabulary rows vs context window; "BPE corrects numbers"; 1M×1M framing; attention without QKV; next-token via word similarity; temperature 3 vs API range 0–2; 7-number whiteboard vectors include the index.
- Fact-check 2026-10-11 (independent search agent): 5 claims — confirmed 4, partly 1, not found 0, contradicted 0.
- 6 frames cropped (presenter webcam and nav removed), 2 own SVGs.
