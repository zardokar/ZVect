# How AI Turns Words Into Vectors: Embeddings — Claude Context
> Source: YouTube, BlackBoard AI, "How AI Turns Words Into Vectors: Embeddings", 3:34, published 2025-08-18, https://www.youtube.com/watch?v=lPTcTh5sRug · Generated: 2026-10-10
> Companion: docs/outhtm/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings.html (Thai human-readable version)

## TL;DR
A short animated explainer of word embeddings. One-hot encoding is rejected for two reasons: vectors as long as the vocabulary (50,000+) and no notion of meaning (all words equally different). The modern solution is an embedding matrix — a lookup table with one row per vocabulary word (50,000 rows) and a chosen embedding dimension (300 columns). A word gets its vector by looking up its ID and taking that row. Rows start as small random numbers and become meaningful through training: the model predicts a word, computes the error, and nudges the vectors; repeated millions of times, words used in similar contexts end up close together.

## Key Concepts
- **One-hot encoding**: vector of length = vocabulary size, a single 1 at the word's index. Problems (video): inefficient for real vocabularies (50,000+ words); carries no meaning because all words are equally different.
- **Embedding matrix**: lookup table of shape (vocabulary size × embedding dimension) = 50,000 × 300 in the video; initialized with small random numbers.
- **Token → vector assignment**: "just a lookup" — find the token's ID, fetch that row.
- **Learning**: the numbers are learned. Example on screen: prediction wrong ("Correct: crown"), error computed, the vector for "queen" is adjusted slightly. Over millions of updates on internet-scale text, words in similar contexts (king, queen) are nudged in similar directions and end up mathematically close.
- **Recap (video's 4 steps)**: Vocabulary & IDs → Embedding Matrix → Lookup → Learn & Adjust.

## Implementation
Minimal procedure the video describes (written as an implementable outline; the video shows no code):
1. Build a vocabulary: map each token to an integer ID (`vocab: dict[str, int]`), size V (e.g. 50,000).
2. Allocate an embedding matrix `E` of shape (V, d) with d ≪ V (e.g. d = 300), filled with small random values.
3. Embed a token: `vec = E[vocab[token]]` (row lookup). Equivalent to `onehot(token) @ E`, without multiplying the zeros.
4. Train: run a prediction task (the video uses "predict the next word"); compute the loss; update the rows of `E` that were used (and the rest of the model) by gradient descent; repeat over a large corpus.
5. Use: similar tokens have nearby rows; compare with cosine similarity or distance.

On-screen values (transcribed from frames):
- ~0:27: king [0.51, 0.82, −0.23], queen [0.49, 0.91, −0.18], apple [−0.75, 0.11, 0.64].
- ~0:47 Vocabulary Mapping: King → 0, Queen → 1, Man → 2, Woman → 3.
- ~0:58: 'cat' → [1, 0, 0, 0], 'dog' → [0, 0, 0, 1].
- ~1:49: queen → ID 42 (king ID 41, prince ID 43).
- ~2:18 Model Feedback (first three dims only): king [0.91, −0.15, 0.42, …], queen [0.83, 0.74, 0.51, …], man [0.88, −0.21, −0.35, …], woman [0.79, 0.68, −0.41, …]; "Correct: crown".
- ~2:55: tokens The/quick/brown/fox → IDs 0–3 with rows e.g. row 0 [−0.97, 0.57, 0.70, 0.68, …].
- ~3:06 Token ID to Vector Lookup: ID 3 → row [−0.54, −0.18, −0.22, 0.45, −0.87].

## Quick Reference
| Item | Value |
|---|---|
| Vocabulary size | 50,000 |
| Embedding dimension | 300 |
| Matrix size | 50,000 × 300 = 15,000,000 numbers (~60 MB as float32; computed) |
| Initial values | small random numbers |
| Token → vector | row lookup by ID |
| Learning signal | prediction error → small adjustments, repeated millions of times |
| One-hot pair geometry | cosine 0, distance √2 ≈ 1.414 for every pair (computed) |
| One-hot × E | equals the row of E (computed on a 4×2 example: [0.5, 0.6]) |

## Comparisons
| Aspect | One-hot | Embedding lookup |
|---|---|---|
| Vector length | vocabulary size (50,000) | chosen d (300) |
| Content | all zeros except one 1 | dense real numbers |
| Origin | fixed by index | random init, learned |
| Encodes similarity | no (all pairs equidistant) | yes (similar words close) |

## Corrections and Notes (computed / observed 2026-10-10)
- Slide vectors at ~0:27 are consistent with the claim: cosine(king, queen) = 0.996, cosine(king, apple) = −0.446; distance king–queen 0.105 vs king–apple 1.688.
- The Vocabulary Mapping slide (King/Queen/Man/Woman) and the one-hot example (cat/dog) use different word sets.
- ASR renders the wrong prediction as "shu"; interpreted as "shoe" (not verified on screen). The correct word on screen is "crown".
- The ~2:18 vectors show only 3 dimensions; cosine on those prefixes is ~0.64–0.70 for every pair, so they cannot show meaning (not an error, just truncated display).
- Simplifications in the video: modern LLMs use subword tokens, not words; next-word prediction is one of several training objectives (context-window objectives also exist); training updates the whole model, not only the embedding row.

## Open Questions & Extension Ideas
- Show that `onehot @ E == E[id]` interactively; it explains why "lookup" and "linear layer on one-hot input" are the same thing.
- Demonstrate training dynamics on a toy corpus (tiny vocabulary, 2–3 dims) so learners watch random rows drift into clusters.
- Compare static word embeddings (one vector per word) with contextual embeddings (vector depends on the sentence) — the video does not cover context.

## Tags & Triggers
embeddings, word-embeddings, embedding-matrix, one-hot-encoding, lookup-table, tokens, vocabulary, training, nlp, vector-space
- "How does a word become a vector?"
- "What is an embedding matrix and how big is it?"
- "Why is one-hot encoding a bad representation?"
- "Why do similar words get similar vectors?"
- "Is an embedding lookup the same as a matrix multiplication?"

## Processing Notes
- Browser: built-in browser (Web View). Transcript via the player's timedtext request (CC toggled, English ASR track among 15 ASR languages), 3,479 chars / 83 lines.
- Frames: 14 used of 17 captured via ≤2,000-char console chunks. The video decoder froze after the 4th seek (11 identical frames, same md5); fixed by reloading the page with `&t=58` and a short play/pause nudge before each capture. `read_console_messages` returns only the newest 200 messages, so frames were read back in two passes.
- Outro logo and like/subscribe request removed.

## References
- BlackBoard AI, "How AI Turns Words Into Vectors: Embeddings", YouTube, 2025-08-18, https://www.youtube.com/watch?v=lPTcTh5sRug (timestamps cited as ~m:ss).
