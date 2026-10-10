# Vector Embedding : Build LLM from scratch — Claude Context
> Source: YouTube, SOFAR, "Vector Embedding : Build LLM from scratch", 13:56, published 2026-06-15, https://www.youtube.com/watch?v=1Qex37vowTM · Generated: 2026-10-10
> Companion: docs/outhtm/20260615_Vector-Embedding-Build-LLM-From-Scratch.html (Thai, interpretive full-detail mode)

## TL;DR
A lecture in an LLM-from-scratch series, following tokenization. Token IDs carry no meaning; the speaker motivates vector embeddings as weights over many characteristics/dimensions (is it an animal, a pet, edible…), where words with small weight differences are similar. Yes/no features are not enough (a lion as a pet; "edible" depends on perspective), hence weights. GPT sizes: GPT-1 vocabulary ~40,000 with 768 dims; GPT-2 50,257 with 768-1,600; GPT-3 ~50,257 with 12,288. Weights are found by starting random, predicting, measuring error, computing gradients and optimizing (in GPTs during pre-training; pre-trained embeddings can also be used). A Word2Vec (Google News, 3M words, 300 dims) demo: yen - Japan + India -> rupee (0.619), an out-of-vocabulary KeyError for Bill_Gates, similarity(king, queen) = 0.651 vs (king, man) = 0.229. The speaker concludes you must develop your own embeddings for your own LLM. Numbers check out; the feature table is a teaching analogy (real dimensions are learned, not hand-written).

## Key Concepts
- Recap: algorithms only understand numbers, so tokens were converted to IDs; does that carry semantic meaning? Example "cat is a pet, but lion is a pet or not, but dog is a pet" -> IDs (on slide 23, 1, 120, 50, 1, 120); the speaker also says cat 23, a 1, lion 50, dog 150. Mapping tokens to IDs is the vocabulary. IDs do not capture that cat is near pet, pet near dog, lion not near pet; meaning and word context are lost (sentence context = contextual embedding, later).
- Characteristics/dimensions: for words cat, lion, dog, blue, sandwich ask questions (animal? human? pet? color? edible? four legs? two legs? one leg?) — infinitely many possible dimensions.
- Yes/no is insufficient: lion as a pet (the speaker mentions Dubai: very low share, but some people keep lions); "edible" depends on whose perspective (e.g. a lion's). Not black and white.
- Weights: animal 90 for cat, lion, dog; blue very small; pet: dog 99, cat 89, lion reduced to 30/20/50 percent (slide 0.50); edible: sandwich highest, blue very low. On-slide table (animal, human, pet, edible): cat 0.90/0.20/0.89/0.40, lion 0.90/0.10/0.50/0.30, dog 0.90/0.20/0.99/0.50, blue 0.002/0.01/0.02/(crossed out), sandwich 0.01/0.05/0.03/0.99; slide note "Lowest difference -> More similar".
- The lower the difference between weights across all dimensions, the higher the similarity — this is vector embedding; call them characteristics or dimensions. Word != token (byte pair encoding).
- What to build: vocabulary (token IDs), dimensions per token, weights per dimension.
- Trained models (as stated): GPT-1 vocabulary 40,000, 768 dimensions "768 characteristics were written, like is it a pet…"; GPT-2 vocabulary 50,257, 768 to 1,600 dims from smallest to largest; GPT-3 same vocabulary, ~12,000 dims, 12,288 weights per token.
- Creating embeddings: assign random weights to token IDs x dimensions, predict, compute error, find loss/gradient, optimize weights, repeat until optimum. In GPTs "done at the attention level": steps tokenization -> vector embedding -> positional embedding -> contextual embedding -> self-attention (training); embeddings optimized during pre-training; pre-trained embedding weights can also be used before self-attention. The speaker plans to develop his own method later.
- Word2Vec demo: library by Google, 300 dimensions, ~3 million words ("30 lakh"); inspect the first 10-11 words; vectors for cat and dog (300 weights; usable to train an LLM). yen - Japan + India -> rupee 61.9%, then rupee, rupees, Indian rupee, "then it started hallucinating", but it gave the nearest answer.
- Out-of-vocabulary: an error because the model was not trained on "Bill Gates" (key not present in vocabulary) -> create your own embeddings depending on the training data (financial, general like GPTs); hence understand the algorithm (random weights, predict, error, loss, optimize).
- Similarity: king-queen 65%; king-man ~22% (after a kernel restart); "mango man" = common man (speaker's phrase); king-queen higher than king-man.
- Conclusion: Word2Vec has only 300 dims; you could need 10,000; "higher the dimension, better your model can predict" with a caveat the speaker acknowledges; existing libraries can be used, but to optimize your own LLM develop your own embeddings, dimensions and weights.

## Implementation
Equivalent code (own, gensim; not run locally, values in comments are from the screen):
```python
import gensim.downloader as api
w2v = api.load("word2vec-google-news-300")
print(len(w2v.key_to_index), w2v.vector_size)          # 3000000 300
print(w2v.most_similar(positive=["Yen", "India"], negative=["Japan"], topn=5))
print(w2v.similarity("king", "queen"), w2v.similarity("king", "man"))   # 0.651, 0.229 (on screen)
```
Training loop (as described): random init -> forward/predict -> error/loss -> gradients -> update -> repeat.

Supplement (computed with ZVect from the slide's weights, 4 dims animal/human/pet/edible):
| pair | distance | cosine |
|---|---|---|
| cat-dog | 0.141 | 0.997 |
| cat-lion | 0.415 | 0.965 |
| dog-lion | 0.539 | 0.950 |
| cat-sandwich | 1.379 | 0.332 |

## Quick Reference
| Item | Value | Time |
|---|---|---|
| token IDs (spoken) | cat 23, a 1, lion 50, dog 150 | ~1:20 |
| token IDs (slide) | 23, 1, 120, 50, 1, 120 | ~0:50 |
| GPT-1 | ~40,000 vocab, 768 dims | ~6:12 |
| GPT-2 | 50,257 vocab, 768-1,600 dims | ~6:33 |
| GPT-3 | ~50,257 vocab, 12,288 dims | ~6:54 |
| GPT pipeline | tokenization -> embedding -> positional -> contextual -> self-attention | ~7:56 |
| Word2Vec | Google; 3,000,000 words; 300 dims | ~8:52 |
| yen-Japan+India | rupee 0.6192 | ~10:32 |
| OOV | KeyError 'Bill_Gates' | ~11:17 |
| king-queen | 0.6511 | ~12:02 |
| king-man | 0.2294 | ~12:49 |

## Comparisons
| Aspect | Pre-trained Word2Vec | Own embeddings |
|---|---|---|
| Start | load and use; usable to train an LLM | random init then train |
| Coverage | only trained words (Bill Gates fails) | matches your data (e.g. financial) |
| Dimensions | 300 | your choice (speaker: maybe 10,000) |

## Corrections / verification
- Numbers match the on-screen notebook and widely known values (GPT-2/3 vocab 50,257; GPT-1 768 dims; GPT-3 12,288 dims; Word2Vec Google News 3M x 300).
- Clarifications (not in the video): real embedding dimensions are learned and usually not interpretable as named questions; "65%" is a cosine similarity of 0.651, not a probability; most_similar returns a ranked neighbour list (later items are lower-scoring, not "hallucinations"); higher dimensions need more data and compute and suffer distance concentration.

## Open Questions & Extension Ideas
- The cat/lion/dog/blue/sandwich weight table is a ready-made dataset for ZVect lessons 5 and 6.
- A ZVect demo of out-of-vocabulary handling (encode() already skips unknown words) could reference this video.

## Tags & Triggers
vector-embeddings, token-ids, word2vec, gensim, gpt, embedding-dimensions, out-of-vocabulary, word-similarity
- "Why are token IDs not enough?"
- "How many embedding dimensions do GPT models use?"
- "How to do word analogies with Word2Vec?"
- "Why build custom embeddings if Word2Vec exists?"

## Processing Notes
- Mode: interpretive full-detail (standard YouTube license, checked 2026-10-10). Manual English captions (153 lines, SHA-256 0ddb47e8...a36e), kept in the session workspace only.
- 12 frames captured (one recaptured to work around the 200-message console read limit), 9 used.

## References
- SOFAR, "Vector Embedding : Build LLM from scratch", YouTube, 2026-06-15, https://www.youtube.com/watch?v=1Qex37vowTM
- Model used on screen: word2vec-google-news-300 (gensim downloader)
