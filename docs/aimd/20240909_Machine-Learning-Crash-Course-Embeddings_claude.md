# Machine Learning Crash Course: Embeddings (word2vec) — Claude Context
> Source: YouTube, Google for Developers (speaker Lukas Raynaud), "Machine Learning Crash Course: Embeddings", 2:36, published 2024-09-09, https://www.youtube.com/watch?v=my5wFNQpFO0 · Generated: 2026-10-11
> Companion: docs/outhtm/20240909_Machine-Learning-Crash-Course-Embeddings.html (Thai, rewritten in the author's own words, every point kept)

## TL;DR
A 2.5-minute explainer of where word embeddings come from, using one word2vec-style network as "just one example" of many. Input = one-hot layer (one node per vocabulary word) → fully connected embedding/projection layer (one node per embedding dimension, no activation) → optional fully connected hidden layer with an activation → output layer (one node per vocabulary word) with softmax. Training data = skip-grams: (word, nearby word in the same sentence) pairs from a large corpus. After training, the weights between layer 1 and layer 2 are the embedding matrix; a word's embedding is its stacked weights. Similar words tend to land close (sail/ship), unrelated words far (how). The network is slow and memory-hungry.

## Key Concepts
- 0:02 Question: neural nets represent words as embeddings — where do they come from? Special architectures exist; word2vec is walked through as one example ("many ways to do this").
- 0:23 Input layer: one-hot encoding, one input node per vocabulary word.
- 0:33 Fully connect to a layer with one node per desired embedding dimension (10 dims → 10 nodes). Called the projection layer or embedding layer; embeddings are learned here; no activation function needed (drawn as a linear node).
- 0:54 After it, "we can use" a fully connected hidden layer with an activation.
- 1:02 Output layer mirrors the input: one node per vocabulary word, softmax to normalise.
- 1:12 Training task: given a word, predict other words in the same context. Corpus examples: every English novel on Project Gutenberg, all English Wikipedia articles.
- 1:30 Input = a word; output = a nearby word in the same sentence. These pairs are skip-grams. More skip-grams → better model but longer training.
- 1:50 After training, weights between the first and second layer = embedding matrix; a word's embedding = all of that word's weights stacked into a vector.
- 2:01 Resulting vectors have fewer dimensions than one-hot and encode meaning; similar words tend to be closer (embeddings for "sail" and "ship" likely near; "how" likely far).
- 2:22 Caveat from the video: this simple network is not designed for performance; needs a lot of time and memory; see linked resources for optimised architectures.

## Implementation
Minimal playbook matching the video (the hidden nonlinear layer is optional per the video):
1. Build vocabulary V; one-hot input x ∈ {0,1}^|V|.
2. Embedding layer: h = W1ᵀ x, W1 ∈ R^{|V|×d}, no activation (equivalent to selecting row W1[word_id]).
3. Optional hidden layer: g = act(W2 h + b2).
4. Output: logits = W3 g (or W3 h without the hidden layer), p = softmax(logits) over |V| words.
5. Data: slide over sentences; for each word w and each neighbour c within a window in the same sentence, emit (w, c). Window size is not specified in the video.
6. Loss: cross-entropy of p against c; train with gradient descent.
7. Embedding of word i = W1[i, :].
Pitfalls (video): full softmax over |V| is slow and memory-heavy. Author note (not in the video): original skip-gram has no nonlinear hidden layer; speed-ups such as negative sampling / hierarchical softmax are the usual fix.

## Quick Reference
| Item | Value in video | Time |
|---|---|---|
| Network | word2vec (one example of many) | 0:12 |
| Input | one-hot, 1 node per vocab word | 0:23 |
| Embedding/projection layer | 1 node per dimension (10 dims → 10 nodes), no activation | 0:33–0:52 |
| Hidden layer | fully connected + activation ("can use") | 0:54 |
| Output | 1 node per vocab word + softmax | 1:02 |
| Task | predict words in the same context | 1:12 |
| Corpus examples | Project Gutenberg English novels; English Wikipedia | 1:21 |
| Pairs | skip-grams (word, nearby word, same sentence) | 1:30–1:40 |
| Trade-off | more skip-grams → better, slower | 1:44 |
| Embedding matrix | weights between layer 1 and 2 | 1:50 |
| Example | sail ~ ship; how far | 2:14 |
| Limitation | slow, memory-hungry | 2:22 |

## Comparisons
| Aspect | one-hot | learned embedding |
|---|---|---|
| Size | |V| dims | d ≪ |V| dims (e.g. 10) |
| Meaning | none (all words equally different) | similar words tend to be close |
| Source | vocabulary index | weights of the embedding layer after training |

## Open Questions & Extension Ideas
- Window size, number of negatives, and corpus size are not given; a toy demo could vary the window and show sail/ship distance.
- Show that W1ᵀ·one_hot = row lookup (ZVect lesson 3.6) and that training moves rows (lesson 3.7).

## Tags & Triggers
Tags: word2vec, skip-gram, one-hot, embedding-layer, projection-layer, embedding-matrix, softmax, training-embeddings, google-ml-crash-course
Triggers:
- Where do word embeddings come from?
- What layers does word2vec have; why no activation in the embedding layer?
- What is a skip-gram pair?
- Why are first-layer weights the embedding matrix?
- Why is full-softmax word2vec slow?

## References
- https://www.youtube.com/watch?v=my5wFNQpFO0 (Google for Developers, 2024-09-09)
- https://goo.gle/46IlhFn (ML Crash Course: Embeddings, linked in the description)

## Processing Notes
- License: standard YouTube license → own-words rewrite; transcript (manual English captions, 60 lines) kept out of the repo.
- 4 frames used (one-hot→embedding, full network with softmax, output embeddings w_0..w_2, word graph), 1 own SVG.
- No fact-check needed (2024 source, stable content); author notes on original word2vec and negative sampling are general knowledge, labelled.
