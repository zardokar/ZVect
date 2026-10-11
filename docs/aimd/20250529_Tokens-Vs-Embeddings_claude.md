# Tokens vs Embeddings (Annie Sexton) — Claude Context
> Source: YouTube, Annie Sexton, "Tokens vs Embeddings – what are they + how are they different?", 6:52, published 2025-05-29, https://www.youtube.com/watch?v=izbifbq3-eI · Generated: 2026-10-11
> Companion: docs/outhtm/20250529_Tokens-Vs-Embeddings.html (Thai, own-words rewrite, 7 sections, 7 slide frames + 2 own SVGs)

## TL;DR
Short explainer separating the two terms. Embedding = a vector (array of numbers, "hundreds" of dimensions) whose position carries meaning; token = a single number that is only an ID (close IDs ≠ related words). Each token points to one starting embedding; the model then updates it from the surrounding words into a context-sensitive embedding (train = teach vs railway; "she" = Annie). Toy 2D example: king (1,9) − man (1,0) = (0,9) (no word), + woman (9,0) = (9,9) = queen. Closing definition: embeddings are the vectors most useful, on average across training data, for predicting surrounding words; they do not store meaning but map where meanings sit relative to one another.

## Key Concepts
- 0:00 Intro: tokens and embeddings are "numbers that represent things"; the interesting part is how they relate.
- 0:28 Embedding = a vector that represents something; a vector = an array of numbers (xy = 2D, xyz = 3D, unlimited dimensions); used in linear algebra, geometry, biology, graphics. Slide example (0.2, −0.7). Embeddings = vectors that mean something; can represent anything, focus here on words (LLMs).
- 1:18 king − man + woman = queen with 2D vectors from the slide: woman (9,0), man (1,0), queen (9,9), king (1,9). king − man = (0,9) (not a listed word, "???"); (0,9) + woman = (9,9) = queen. Two features = two dimensions; real embeddings have "hundreds" of dimensions for richer relationships.
- 2:44 Tokens belong mainly to NLP / LLMs. Token = one number per word vs hundreds for an embedding. Every word the model was trained on is catalogued with a unique number: an ID with no semantic meaning; numerically close IDs can be unrelated words. Slide: "The quick brown fox jumps over the lazy dog." → [464, 2068, 1051, 4414, 12898, 1168, 262, 13660, 3290, 13] (tokenizer not named); 3290 (dog) shown alone at ~3:36.
- 3:30 Each token points to one embedding. Prompt → words → tokens → embeddings; the model works with embeddings to predict the next part (the response). Slide: "Write an email to my manager asking for a raise" → [10253, 470, 4095, 407, 616, 4964, 16120, 329, 257, 10788] → […] ×10.
- 4:02 Polysemy: "I train my dog" vs the "midnight train" sentence; "she" in "Annie couldn't remember where she had left her keys." needs context. The token's embedding is only a starting point; looking at surrounding words the model updates it into a context-sensitive embedding. Slide: she → 7620 → [0.1, −0.7, 0.34, …] with a note "This diagram is very rough – how this actually works is much more complicated".
- 5:01 Machines only understand numbers; the initial token embedding often means nothing by itself and is not an average of a word's meanings. Slide definition: embeddings are the vectors that have proven most useful — on average, across all training data — in helping the model predict surrounding words. Language = relationships between chunks of meaning; "embeddings don't store meaning, they map where those meanings sit in relation to one another".
- 6:12 Outro: more on tokenization, typos, made-up words, slang possibly in a follow-up; asks for topic requests.

## Implementation
```
king  = (1, 9); man = (1, 0); woman = (9, 0); queen = (9, 9)
king - man = (0, 9)            # not a word in the list
(0, 9) + woman = (9, 9) == queen
pipeline: text -> token ids (one int per token, no meaning) -> embedding rows (one start vector per token)
          -> context updates (attention, not named in the clip) -> next-token prediction
```

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Vector example | (0.2, −0.7) | 0:40 |
| Word vectors | woman (9,0), man (1,0), queen (9,9), king (1,9) | 1:39 |
| king − man + woman | (0,9) + (9,0) = (9,9) = queen | 1:44–2:07 |
| Dimensions | "hundreds" | 2:24 |
| Token ids (fox) | 464 … 3290, 13 | 3:00 |
| Prompt ids | 10253 … 10788 → […] | 3:40 |
| Context | train; she → 7620 → [0.1, −0.7, 0.34, …] | 4:14–4:56 |
| Definition | most useful vectors for predicting surrounding words | 5:28 |

## Comparisons
| | Token | Embedding |
|---|---|---|
| Form | one integer | vector (hundreds of numbers per the clip) |
| Meaning | none (ID); close ids ≠ related | position relative to other meanings |
| Scope | NLP / LLMs | all of ML |
| Per word | one (as told) | one start vector per token, then context-updated |

## Open Questions & Extension Ideas
- ZVect: supports splitting chapter 3 into a Token chapter and an Embedding chapter (owner asked "why is there no Embedding topic"). Use in 3.4 Token ID (IDs carry no meaning), 3.7 Embedding matrix (token → row), 3.9 Latent space (integer 2D king/queen example), 7.1/7.2 (context update).
- Simplifications to flag: tokens are subwords, not always whole words; large LLM embeddings often have thousands of dimensions; tokenizer for the slide ids unknown.

## Tags & Triggers
Tags: tokens, embeddings, token-vs-embedding, token-id, vector-basics, word-vectors, king-queen-analogy, dimensions, contextual-embeddings, polysemy, llm-internals, next-token
Triggers:
- Difference between a token and an embedding?
- Why are token ids not enough?
- king − man + woman = queen with vectors?
- How do embeddings handle words with several meanings?

## References
- https://www.youtube.com/watch?v=izbifbq3-eI

## Processing Notes
- License: standard YouTube → own-words rewrite. Transcript: English ASR, 171 lines (sha256 prefix 0f38d979eae42dea), read in full; not stored in the repo.
- ASR "09" / "99" = (0, 9) / (9, 9) per the slides. The second "train" example alludes to a song lyric; the lyric is not quoted.
- Published 2025 → inside the author's knowledge; no web fact-check. Author additions labelled (subword note, thousands of dimensions, attention name, ZVect mapping).
- 7 slide frames (no presenter), 2 own SVGs (pipeline, 2D king/queen plane).
