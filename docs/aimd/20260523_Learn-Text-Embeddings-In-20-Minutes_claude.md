# Learn Text Embeddings in 20 Minutes (full guide for beginners) — Thu Vu - Claude Context
> Source: YouTube, Thu Vu, "Learn Text Embeddings in 20 Minutes (full guide for beginners)", 19:56, published 2026-05-23 · https://www.youtube.com/watch?v=Q6TBHDgWCDQ · Generated: 2026-10-12
> Companion: 20260523_Learn-Text-Embeddings-In-20-Minutes.html (Thai, iw mode `iwd`, 8 sections, 7 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite, complete, with fact-check (standard YouTube license).
- Frames used: 01_bag-of-words, 02_word-order, 03_coffee-tea-pasta, 04_reduce-32d-2d, 05_lifecycle, 06_mteb, 07_cosine-code.
- Own SVG diagrams: flow, compare, compare.
- Transcript SHA-256 (in-page = decoded): `28f928e71b0e6820c66f11baf08672b2ea720bec982c337ed1e6a1776720cf19`; kept in the session workspace only.

## TL;DR
Beginner guide (Thu Vu, 19:56) from counting words to using a hosted embedding model. Frequency methods (one-hot, bag of words, n-grams, TF-IDF) are easy but ignore word order and context, are sparse (a 100,000-word vocabulary needs 100,000 slots) and miss meaning ("Meal was bad" vs "Food is awful"). Embeddings are dense vectors, "often" 50 to a few thousand dimensions (OpenAI text-embedding-ada-002: 1,536), placing similar texts close together; single values mean nothing, relations matter. Idea traced to 1950s distributional linguistics (ong choy example). Lifecycle: text → tokens → token IDs → one-hot (no meaning) → embedding learned as a by-product of training a network: word2vec CBOW / skip-gram (weights of the single hidden layer). word2vec is static (one vector for "bank"); ELMo, BERT, GPT give contextual embeddings, and transformer-based models refine them with self-attention. Practice: training your own probably needs much data and time; the speaker says pre-trained models are usually much easier (open source, or paid APIs such as OpenAI and Mistral; Anthropic has none); quality depends on the model and task (leaderboard as a reference; MTEB on screen). Demo (values on screen): cosine distance Amsterdam–coffeeshop 0.1745 < Paris–coffeeshop 0.2244.

## Key Concepts
- 0:00 Text embeddings: words or documents as numerical vectors that capture meaning. Two broad kinds: token/word embeddings (one word or token) and document embeddings (sentence or paragraph); both built on similar principles.
- 0:55 One-hot: vocabulary of unique words; a vector as long as the vocabulary, all zeros except the word's cell ("simple and naive", wastes space). Bag of words: count each word's occurrences in a sentence. Both are frequency-based. N-grams count groups of e.g. two or three words. TF-IDF: frequency in the document vs frequency across other documents, to down-weight common words (the, like, you, me).
- 2:56 Shortcomings (despite years of usefulness in NLP): (1) no word order — "Her dog bit the owner" / "The dog bit her owner" get the same bag of words; (2) no context — "fine" in "I'm fine" vs "I got a fine"; (3) sparse — 100,000 vocabulary → 100,000 numbers per word or sentence; (4) no underlying meaning — "Meal was bad." vs "Food is awful." look completely different.
- 4:26 Uses claimed: Google search maps queries and documents into a common space; Google Translate relies on embeddings; clustering of large text; RAG chatbots use embeddings to interpret input and retrieve information. Zhuangzi quote (nets are for fish, words are for meaning).
- 5:41 Distributional idea from 1950s linguists: words with similar neighbouring words have similar meanings. Ong choy (Cantonese loan) seen with garlic, rice, delicious, salty, like spinach / chard / collard greens → probably a leafy green. Counting co-occurrence is only the start; goal = dense vectors with similar words close in embedding space.
- 7:30 Dense = not mostly zeros; fewer dimensions than the vocabulary; size depends on the model, "often" 50 to a few thousand; ada-002 = 1,536 numbers. Tea and coffee closer than tea and pasta (slide shows illustrative distances 0.2 and 0.5). Individual values have no inherent meaning; relations between vectors matter.
- 8:56 Embedding space: 10 words as 1-D points, then 2-D, 3-D; beyond 3-D not drawable but distances still computable (32-D example); metrics: cosine distance, cosine similarity, Euclidean distance (library functions exist); dimensionality reduction 32-D → 2-D shows clusters (king, queen, sovereign, kingdom; cat, dog, pet, bird, animal).
- 10:55 Embeddings learned by training ML / deep-learning models on a large corpus. Lifecycle: tokenization (words, characters, numbers, punctuation) → token IDs (vocabulary of 16 → IDs 0–15) → one-hot (IDs and one-hot carry no meaning) → embeddings.
- 12:13 Usually a by-product of training a network. word2vec: CBOW (window of n = 3 words, predict the middle from the two neighbours) and skip-gram (predict the two neighbours from the middle). Skip-gram detail: shallow network, one hidden layer; hidden size = embedding size; output size = vocabulary; predicts whether two words are neighbours (apricot vs car); self-supervised positive (neighbour) and negative (noise) examples; the prediction is discarded and the hidden-layer weights are the embeddings.
- 15:13 Static embeddings (word2vec and similar shallow networks): one vector per word, e.g. "bank" — a big problem because language is about context. Contextual embeddings (ELMo, BERT, GPT): the same word gets different vectors in different contexts; models based on the transformer architecture process whole sequences and refine embeddings with self-attention.
- 16:37 Build your own (libraries exist; needs a lot of data and a long time; only for a model tailored to your use case) or use pre-trained (open-source libraries, research releases, paid APIs that are often higher quality: OpenAI and Mistral; "Anthropic, unfortunately, doesn't"). Quality depends heavily on the model and the task; leaderboard shown (on-screen source: huggingface.co/spaces/mteb/leaderboard).
- 18:34 Demo (paid API, demonstration only): text-embedding-ada-002 turns "cat" into a list of 1,536 numbers; cosine distance Amsterdam–coffeeshop 0.17454437230781583, Paris–coffeeshop 0.22435473882320345 (both read from the notebook on screen) → Paris is less similar.

## Implementation
Steps as shown (notebook text read from the screen; the helper's body is not shown):
```python
# get_openai_embedding(text) -> list[float] of length 1536 (model text-embedding-ada-002, paid API)
from scipy.spatial.distance import cosine   # assumption: the notebook calls cosine(a, b) and prints it as "Cosine distance"
amsterdam = get_openai_embedding("Amsterdam")
coffeeshop = get_openai_embedding("coffeeshop")
paris = get_openai_embedding("Paris")
print(cosine(amsterdam, coffeeshop))   # 0.17454437230781583 on screen
print(cosine(paris, coffeeshop))       # 0.22435473882320345 on screen  (smaller = closer)
```
Frequency baselines for comparison (vocabulary from the slide at ~1:58):
```
vocab = [this, movie, is, very, slow, and, long, spooky]
"Long and spooky movie" -> [0, 1, 0, 0, 0, 1, 1, 1]   # the slide shows 0 1 0 0 1 0 1 1 (a 1 under "slow" instead of "and")
```
word2vec skip-gram as described: one hidden layer of size d (embedding size), output over the vocabulary, trained on (centre, neighbour) positives and (centre, noise) negatives; keep the input→hidden weights as the embedding table.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Embedding kinds | token/word · document | 0:29 |
| Sparse example | 100,000 vocabulary → 100,000 slots | 3:53 |
| Distributional idea | 1950s linguists | 5:56 |
| Typical size (speaker) | 50 to a few thousand | 7:58 |
| ada-002 | 1,536 numbers | 8:03, 19:02 |
| Space walk-through | 1-D, 2-D, 3-D, 32-D → 2-D | 9:04–10:41 |
| Metrics | cosine distance / similarity, Euclidean | 10:17 |
| Token IDs | vocabulary 16 → 0–15 | 11:34 |
| Window | 3 words | 13:04 |
| Hidden layer | neurons = embedding size | 13:47 |
| Contextual models | ELMo, BERT, GPT | 15:46 |
| Paid APIs | OpenAI, Mistral (not Anthropic) | 17:58 |
| Demo distances | 0.17454 (Amsterdam), 0.22435 (Paris) | 19:15–19:41 |

## Comparisons
| Criterion | Frequency-based | Static (word2vec) | Contextual (ELMo/BERT/GPT) |
|---|---|---|---|
| Length | vocabulary size | short | short |
| Sparse | yes | no | no |
| Similar meanings close | no | yes | yes |
| Order / context | ignored | context used in training, one vector per word | vector depends on the sentence |

## Fact Check
10 claims: 7 confirmed, 3 partly, 0 contradicted (subagent web check 2026-10-12).
- ada-002 = 1,536 dims: confirmed; superseded (not deprecated) by text-embedding-3-small (1,536) and -3-large (3,072).
- 50 to a few thousand: partly — SLP3 says 50–1000; thousands holds for newer API models.
- 1950s linguists: confirmed (Joos 1950, Harris 1954, Firth 1957 per SLP3).
- Ong choy example: confirmed as Jurafsky & Martin's example (SLP3 ch. 6, Jan-2025 draft; spelled "ongchoi"); not credited in the video.
- Google search/Translate use embeddings: partly — Google describes neural matching and BERT representations of concepts, not the words "embeddings"/"common space".
- CBOW and skip-gram: confirmed; Mikolov 2013a trained with hierarchical softmax, negative sampling came in 2013b — the video mixes both formulations.
- ELMo/BERT contextual, transformer self-attention: confirmed (GPT not checked).
- Anthropic has no embedding model: confirmed (docs point to providers such as Voyage AI); OpenAI and Mistral offer APIs.
- Leaderboard = MTEB: partly (paper: 8 task types, 58 datasets, 112 languages; the Hugging Face page did not load).
- Zhuangzi quote: confirmed, chapter 26 (secondary source).

## Open Questions & Extension Ideas
- Author note: the demo distance is cosine distance (1 − cosine similarity); readers switching to similarity must flip the reading.
- Author note: the 0.175 vs 0.224 gap is one model at one time; not evidence of a general rule.
- Teaching ideas: count-based vs dense side by side on the same sentences (order and synonym failures); CBOW vs skip-gram windows; static vs contextual "bank".

## Tags & Triggers
embeddings, word-embeddings, one-hot, bag-of-words, n-gram, tf-idf, distributional-hypothesis, word2vec, cbow, skip-gram, static-vs-contextual, mteb, openai-embeddings
- "Why are bag-of-words vectors bad at meaning?"
- "How does skip-gram produce embeddings?"
- "Static vs contextual embeddings?"
- "Which hosted embedding APIs exist; does Anthropic have one?"

## References
- Thu Vu, "Learn Text Embeddings in 20 Minutes (full guide for beginners)", YouTube, 2026-05-23, https://www.youtube.com/watch?v=Q6TBHDgWCDQ
- MTEB leaderboard (on screen): https://huggingface.co/spaces/mteb/leaderboard ; MTEB paper https://arxiv.org/abs/2210.07316
- Fact-check sources: SLP3 ch. 6 https://web.stanford.edu/~jurafsky/slp3/old_jan25/6.pdf ; OpenAI https://openai.com/index/new-and-improved-embedding-model , https://openai.com/index/new-embedding-models-and-API-updates ; Google https://blog.google/products/search/how-ai-powers-great-search-results ; word2vec https://arxiv.org/abs/1301.3781 , https://arxiv.org/abs/1310.4546 ; ELMo https://arxiv.org/abs/1802.05365 ; BERT https://arxiv.org/abs/1810.04805 ; Transformer https://arxiv.org/abs/1706.03762 ; GNMT https://arxiv.org/abs/1609.08144 ; Anthropic embeddings docs https://platform.claude.com/docs/en/build-with-claude/embeddings
