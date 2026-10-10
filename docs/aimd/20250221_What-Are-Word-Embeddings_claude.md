# What Are Word Embeddings? — Claude Context
> Source: YouTube, Under The Hood, "What Are Word Embeddings?", 19:32, published 2025-02-21, https://www.youtube.com/watch?v=hVM8qGRTaOA · Generated: 2026-10-10
> Companion: docs/outhtm/20250221_What-Are-Word-Embeddings.html (Thai, interpretive full-detail mode)

## TL;DR
Part of an LLM-from-scratch series. Explains why text needs embeddings: raw token IDs imply false ordinal closeness (good = 6, bad = 22, great = 21); one-hot removes that but is sparse (50,000-dim for a 50,000-word vocabulary) and meaning-free; bag of words / n-grams add limited context but stay large, sparse and shallow. Word embeddings are dense vectors where similar words are close and directions carry meaning (king - man + woman ≈ queen; Beijing + Japan - China ≈ Tokyo); dimensions are a few hundred to thousands, start random and are learned. Word2Vec (Google) trains them with CBOW (context -> center word) or skip-gram (center -> context); the trained weight matrix is the embedding lookup table (one-hot x matrix = the word's row). A Transformer decoder instead uses a shallow embedding layer trained jointly with the whole model, adds positional encodings (learned or fixed) because all tokens are processed in parallel, then feeds attention, which supplies contextual understanding (next video). No errors found.

## Key Concepts
- First rule: inputs must become numbers. Grayscale images: brightest pixel 1, darkest 0, grays in between (on screen a 3x3 example).
- Token IDs: assigning each unique word/token a number is only suitable for ordinal features (low/medium/high). Example sentences (on screen): "This movie was good / bad / great" with good = 6, bad = 22, great = 21; 21 and 22 being close may make the model think bad and great are similar while good looks different, although good and great are similar in meaning -> incorrect predictions.
- One-hot encoding: vector size = vocabulary size; one 1 at the word's position, rest 0; removes the ranking issue, treats all words equally, simple; drawbacks: sparse (50,000-word vocabulary -> 50,000-dim vectors, memory-intensive, computationally expensive) and no semantic/contextual meaning (words fully independent; does not capture that good and great are similar); inefficient for large-scale NLP.
- Bag of words: count occurrences per word (unigram, words treated independently); bigrams count all two-word combinations and add context; n-grams generalize to n words. Problems: many combinations on large data -> very large sparse vectors; limited context window (trigram = three words); no deeper meaning/relationships; less effective for translation and text generation.
- Semantic + contextual understanding: example "Sarah entered the old library, her heart was racing. She knew something was hidden behind the dusty ___"; humans link where Sarah went to "library", know "old" describes the library, infer the hidden object is behind something dusty; likely next words: table, wall, bookshelf. "Semantic understanding" here means replacing words with similar words keeps the sentence meaning. Word embeddings and the attention mechanism address this; this video covers embeddings.
- Word embeddings: dense numerical vectors in a continuous vector space (on-screen example: three words in 10-dim dense vectors). Two similar vectors correspond to two similar words; direction carries meaning; e.g. king and queen closer to each other than to cat. 1D example: age of 10 people as the only feature (similar ages close; features can be anything that best encodes information). 2D: x = age, y = royalty: king and queen close, far from man and woman.
- Vector arithmetic: king - man + woman gives a vector close to queen (difference king-queen similar to man-woman). Demo with an assumed 5-dim embedding (gender, wealth, power, weight, speech) encoding king, queen, man, woman, cat: the result is closer to queen than to cat. Beijing + Japan - China -> closest word Tokyo (Beijing is China's capital; adding Japan adds Japan attributes, subtracting China removes China attributes; the remaining capital-city features align with Tokyo).
- We cannot explicitly define what features the embedding space contains; it depends on the training data. "Lower dimensional" = a few hundred or thousand dimensions vs hundreds of thousands for one-hot. Goal: dense vectors storing word meaning in an n-dimensional "embedding space". Embeddings start random and learn meaning through training (ASR is garbled around 9:24).
- Visualization: PCA projects high-dim embeddings to low dims; a trained model shows king with its closest words, tennis-related words together, cat-related words clustered, digit "one" with related words. Description links TensorFlow Embedding Projector.
- Word2Vec: introduced by Google for efficient estimation of word representations; motivation: token IDs carry no similarity, n-grams scale badly on billions of words; want close vectors for similar words capturing multiple degrees of similarity; paper's king/queen/man/woman example. Two techniques: CBOW and skip-gram.
- CBOW: window size 3 = context size 1; center word = target; surrounding words = input; slide over the document. Example: inputs fox, over -> target jumps. Inputs one-hot encoded. Network: input layer (one-hot of context words), hidden layer with neurons = embedding dimension (3 in the example; hundreds to thousands in practice), output layer = vocabulary size. Compute error, backpropagate, slide the window.
- Embedding matrix: after training, the weight matrix is the embedding matrix; with 8 words and 3 dims it is 8 x 3, a lookup table; the weight values for the first word's neuron form its feature vector, and similarly "quick" has weights B1, B2, B3. To embed a word: one-hot vector dot embedding matrix (e.g. fox). Rows = vocabulary size, columns = chosen embedding dimension.
- Skip-gram: the center word is the input and the surrounding words are predicted; the opposite of CBOW; both work well.
- Transformer decoder: custom embeddings; after tokenization an embedding layer gives a vector per token (6 tokens -> 6 x embedding-dim matrix; on screen token IDs 791, 8415, 7731, 389, 264, 5634 for "The cat sat on a mat"). Not Word2Vec: a shallow network with one-hot input (neurons = vocabulary size) and hidden size = embedding dimension; trainable weights act as the lookup table; when trained properly these embeddings can capture semantic meaning; trained along with the entire model (unlike Word2Vec, trained separately). Output passes through repeated decoder blocks to the output layer that predicts the next token; error is backpropagated through all layers. Output layer: linear, neurons = vocabulary size, gives probabilities for next tokens. LLM goal: predict the next word from all previous words, with multiple decoder layers further processing the embeddings (vs Word2Vec predicting the center word).
- Positional encoding: unlike RNNs that process each token separately, Transformers process all words in parallel, so position must be added; a positional vector (trainable layer or static unique representation) is added to each embedding; matrix shape unchanged, values slightly adjusted. Then attention (first layer of the decoder block; called the heart of LLMs) provides contextual representations; embeddings alone give semantic but not contextual understanding. Next video: attention.

## Implementation
One-hot lookup equivalence (verified with ZVect, own illustrative 8x3 matrix):
```js
const W = ["the","quick","brown","fox","jumps","over","lazy","dog"];
const oneHot = (w) => W.map((x) => (x === w ? 1 : 0));
// embedding(w) = oneHot(w) · E  ==  E[W.indexOf(w)]
```
CBOW training loop (as described): for each window -> one-hot context words -> hidden (embedding-dim) -> output (vocab) -> loss vs target -> backprop -> next window. Use the input->hidden weight matrix (vocab x dim) as the embedding table.

Supplement (computed, not in the video):
| example | result |
|---|---|
| token-ID distance good-great vs bad-great | 15 vs 1 |
| one-hot fox vs jumps | cosine 0.000, distance 1.414 |
| BoW "This movie was good" vs "This movie was bad" | cosine 0.750 |
| one-hot(fox) x 8x3 matrix | equals row 4 |

## Quick Reference
| Item | Value | Time |
|---|---|---|
| grayscale | 1 brightest, 0 darkest | ~0:19 |
| token IDs | good 6, bad 22, great 21 | ~1:32 |
| one-hot size | vocabulary size (50,000 -> 50,000-dim) | ~2:20 |
| n-grams | unigram, bigram, n-gram | ~3:40 |
| next-word guesses | table, wall, bookshelf | ~6:00 |
| analogies | king-man+woman≈queen; Beijing+Japan-China≈Tokyo | ~7:46, ~8:26 |
| 5-dim demo | gender, wealth, power, weight, speech | ~8:05 |
| embedding dims | hundreds to thousands | ~9:07 |
| Word2Vec | CBOW, skip-gram; arXiv 1301.3781 | ~10:30 |
| CBOW example | fox, over -> jumps (window 3) | ~11:30 |
| matrix | 8 x 3 lookup table | ~13:03 |
| decoder embedding | trained jointly; 6 x dim | ~14:52 |
| positional encoding | added; learned or fixed; shape unchanged | ~17:16 |

## Comparisons
| Method | Pros (video) | Cons (video) |
|---|---|---|
| token IDs | simple | only for ordinal data; misleading closeness |
| one-hot | no implicit ranking; simple | sparse, vocab-sized; no meaning |
| BoW / n-grams | some context | large sparse vectors; limited window; shallow |
| embeddings | dense; similar words close; arithmetic | (not called cons in the video) dimensions not explicitly definable; learned by training |

## Corrections / verification
- No errors found. Analogy results are "closest", as the video says. Real embedding layers index the table directly (equivalent to one-hot x matrix).

## Open Questions & Extension Ideas
- Primary source for the planned ZVect lesson "One-hot vs Embedding" (WIP202610018).
- A "word order" mini-lesson: add positional vectors and show that the same bag of words in different order gets different representations.

## Tags & Triggers
word-embeddings, one-hot-encoding, bag-of-words, n-gram, word2vec, cbow, skip-gram, transformer, positional-encoding
- "Why not feed token IDs directly?"
- "One-hot vs embeddings?"
- "How is Word2Vec trained; where does the embedding matrix come from?"
- "How do Transformer embeddings differ from Word2Vec; what does positional encoding do?"

## Processing Notes
- Mode: interpretive full-detail (standard YouTube license, checked 2026-10-10); closing like/subscribe request removed.
- Captions: English ASR (551 lines); in-page SHA-256 covered description + transcript; the browser tool redacted two `si=` share tokens in description URLs, so the file hash differs (5ab5111e...) while transcript text is intact. Kept in the session workspace only.
- 14 frames captured, 10 used.

## References
- Under The Hood, "What Are Word Embeddings?", YouTube, 2025-02-21, https://www.youtube.com/watch?v=hVM8qGRTaOA
- Mikolov et al., "Efficient Estimation of Word Representations in Vector Space", https://arxiv.org/abs/1301.3781 (cited in the video description)
- TensorFlow Embedding Projector, https://projector.tensorflow.org/ (cited in the video description)
