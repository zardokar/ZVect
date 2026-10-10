# Cosine Similarity vs. Euclidean Distance vs. Dot Product — Claude Context
> Source: YouTube, SH AI Academy, "5. Cosine Similarity vs. Euclidean Distance vs. Dot Product: Choosing the Right Metric for AI Search", 6:13, published 2025-09-23, https://www.youtube.com/watch?v=xTaDx3tbYMs · Generated: 2026-10-10
> Companion: docs/outhtm/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html (Thai human-readable version)

## TL;DR
A short slide-based explainer comparing the three standard vector-similarity metrics used in vector search, RAG, recommendation and image search. Cosine similarity measures angle only (magnitude-invariant), Euclidean distance measures straight-line position (direction + magnitude, smaller = closer), dot product measures angle × magnitude and is the cheapest to compute. The speaker gives a decision tree ("does magnitude matter?"), a use-case table, production gotchas (zero vectors, curse of dimensionality) and a cheat sheet; the stated conclusion is that no metric is universally best. Several slide numbers are wrong (see Corrections); the most useful fact not spelled out in the video is that on unit-length vectors all three metrics produce the same ranking.

## Key Concepts
- **Similarity metric**: a function telling how close/similar two vectors are. "Similar" depends on the use case; metrics differ in whether they look at direction, magnitude, or both.
- **Cosine similarity**: `cos θ = (A·B) / (‖A‖ × ‖B‖)`, range [-1, 1]; 1 = same direction, 0 = perpendicular, -1 = opposite. Ignores magnitude: `[1,2,3]` vs `[2,4,6]` → 1.0.
- **Euclidean distance**: `d = sqrt(Σ (a_i − b_i)²)`, range [0, ∞); 0 = identical, larger = more different. Sensitive to both direction and magnitude. Inverse sense to similarity (smaller is closer).
- **Dot product**: `A·B = Σ a_i b_i`, range (−∞, ∞). No normalization; "multiply and sum" (no sqrt, no division). Ubiquitous in transformer attention (query·key).
- **Normalized (unit-length) vectors**: cosine = dot product. Speaker: this is why many modern embedding models output normalized vectors.
- **Curse of dimensionality**: in high dimensions points become roughly equidistant under Euclidean distance; speaker claims cosine is more robust (partially true — see Supplements).

## Implementation
### Code shown on slides (transcribed exactly from frames; NumPy)
Slide ~1:16 (word embeddings):
```python
import numpy as np

# Word embeddings example
king = np.array([0.2, 0.8, -0.1, 0.4])
queen = np.array([0.1, 0.7, -0.2, 0.5])

print(f"King: {king}")
print(f"Queen: {queen}")
# How similar are they?
```
(Not answered in the video. Computed: cosine 0.976, dot 0.80, Euclidean 0.20.)

Slide ~2:12 (cosine):
```python
def cosine_similarity(a, b):
    dot_product = np.dot(a, b)
    norms = np.linalg.norm(a) * np.linalg.norm(b)
    return dot_product / norms

# Same direction, different magnitude
vec_a = np.array([1, 2, 3])
vec_b = np.array([2, 4, 6])
print(cosine_similarity(vec_a, vec_b))  # 1.0
```
```python
# Document vectors (TF-IDF)
doc1 = np.array([2, 1, 0, 1]) # "AI machine learning"
doc2 = np.array([4, 2, 0, 2]) # "AI AI machine machine learning learning"

# Same topics, different word frequencies
print(f"Cosine similarity: {cosine_similarity(doc1, doc2):.3f}") # 1.000
```
Slide ~3:04 (Euclidean):
```python
def euclidean_distance(a, b):
    return np.linalg.norm(a - b)

# Customer data: [age, income, spending]
customer1 = np.array([25, 40, 60])
customer2 = np.array([27, 42, 65])
customer3 = np.array([50, 80, 30])

print(f"Distance 1-2: {euclidean_distance(customer1, customer2):.2f}")
print(f"Distance 1-3: {euclidean_distance(customer1, customer3):.2f}")
```
(Outputs not shown on slide. Computed: 5.74 and 55.90.)

Slide ~3:44 (dot product / attention):
```python
# Attention mechanism example
query = np.array([0.1, 0.8, 0.3])
key1 = np.array([0.2, 0.7, 0.4])
key2 = np.array([0.9, 0.1, 0.2])

attention1 = np.dot(query, key1)  # 0.69
attention2 = np.dot(query, key2)  # 0.15

print(f"Attention to key1: {attention1:.2f}")
print(f"Attention to key2: {attention2:.2f}")
```
(Slide comments are wrong; actual 0.70 and 0.23.)

Slide ~5:16 (edge cases):
```python
# ⚠️ Zero vector problem
zero_vec = np.array([0, 0, 0])
normal_vec = np.array([1, 2, 3])

# This crashes!
cos_sim = cosine_similarity(zero_vec, normal_vec)

# ✅ Safe implementation
def safe_cosine_similarity(a, b, epsilon=1e-8):
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a < epsilon or norm_b < epsilon:
        return 0.0
    return np.dot(a, b) / (norm_a * norm_b)
```
```python
# 🚀 Vectorized operations
def batch_cosine_similarity(matrix_a, matrix_b):
    # Normalize rows
    norm_a = matrix_a / np.linalg.norm(matrix_a, axis=1, keepdims=True)
    norm_b = matrix_b / np.linalg.norm(matrix_b, axis=1, keepdims=True)

    # Batch dot product
    return np.sum(norm_a * norm_b, axis=1)

# Always vectorize for performance!
```
Note: `batch_cosine_similarity` computes row-wise pairs (a_i with b_i), not an all-pairs matrix, and has the same zero-row problem as the unsafe version.

### Decision procedure (from slide ~4:48 + cheat sheet ~5:21)
1. Does magnitude carry meaning for the task?
   - No → cosine similarity.
   - Yes → need both direction and magnitude → Euclidean distance; performance-critical → dot product.
2. If all vectors are unit length, pick dot product for speed: ranking is identical to cosine and Euclidean.
3. Guard zero (or near-zero) vectors before cosine.
4. Validate the choice on real data with real metrics.

### Use-case table (as stated in the video)
| Domain | Task | Metric |
|---|---|---|
| Text / NLP | document similarity, word embeddings, search relevance / semantic search | cosine |
| Recommendation | user-item ratings | cosine or dot product |
| Recommendation | content-based filtering | cosine |
| Recommendation | collaborative filtering | dot product |
| Images / sensors | feature vectors, color histograms, raw pixels / measurements | Euclidean |
| Performance-critical | real-time, large-scale search, normalized vectors | dot product |
| User ratings | sparse data → cosine; dense data → dot product | — |

Slide "Performance Ranking": dot product fastest, Euclidean medium, cosine slowest.

## Quick Reference
| Item | Cosine | Euclidean | Dot |
|---|---|---|---|
| Formula | (A·B)/(‖A‖‖B‖) | sqrt(Σ(a_i−b_i)²) | Σ a_i b_i |
| Range | [−1, 1] | [0, ∞) | (−∞, ∞) |
| "Closer" means | larger | smaller | larger |
| Uses magnitude | no | yes | yes |
| Cost (video) | slowest | medium | fastest |
| NumPy | np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)) | np.linalg.norm(a-b) | np.dot(a,b) |
| Unit vectors | = dot | ‖â−b̂‖² = 2 − 2cos θ | = cos |
| Pitfall | zero vector → 0/0 | outliers, high-dim concentration | long vectors win |

## Comparisons
| Aspect | Cosine | Euclidean | Dot |
|---|---|---|---|
| Scale vector by 2 | unchanged | changes | doubles |
| Zero vector | undefined, must guard | defined | 0 |
| Worked example A=(3,1), B=(6,2), C=(3,2) vs A | B: 1.000, C: 0.965 → picks B | B: 3.162, C: 1.000 → picks C | B: 20, C: 11 → picks B |

Choose cosine when length is noise (documents of different lengths); Euclidean when values have real units (age, income, coordinates — scale each dimension first); dot when vectors are already unit length and speed matters, or when larger magnitude should deliberately rank higher (e.g. popularity).

## Corrections (verified by computation, 2026-10-10)
- Dot-product slide comments `# 0.69`, `# 0.15` are wrong → 0.70, 0.23 (ordering conclusion unchanged).
- "Summary Comparison" slide (~5:36) lists the Dot Product row twice and omits Euclidean.
- "This crashes!" is overstated: NumPy returns `nan` with a RuntimeWarning for 0/0.0 (silent propagation is the real risk).
- "Code examples and notebooks available in description" — the description (checked 2026-10-10) contains no link.
- The visualization slide values (cosine 0.048, Euclidean 153.2, dot 593) come from pixel coordinates of an animated demo whose vectors are not stated; not reproducible.
- The "vec C closer to vec A than vec B" example is spoken but not visible on the captured slides; the A/B/C example above is a reconstruction with the same property.

## Supplements (not in the video)
- Identity for unit vectors: ‖â − b̂‖² = 2 − 2(â·b̂) = 2 − 2cos θ. Numerically verified (2.063661 = 2.063661). Hence identical rankings across all three metrics on normalized embeddings; metric choice then only affects speed and score interpretation.
- Distance concentration experiment (200 uniform points in [0,1]^d, one query, Python `random.seed(7)`): relative Euclidean spread (max−min)/min = 37.33 (d=2), 2.20 (10), 0.38 (100), 0.085 (1000); cosine range 0.122–1.000, 0.511–0.948, 0.671–0.823, 0.730–0.772. Both concentrate, so "cosine is more robust" is only partly true; real embeddings are not uniform, which is why search still works in hundreds of dimensions.
- Unnormalized dot product favors long vectors; in recommenders where norm correlates with popularity this creates popularity bias.
- The "cosine is slowest" ranking assumes norms are recomputed per comparison; if document vectors are normalized once at indexing time (bi-encoder setup), query-time cosine is a dot product.

## Open Questions & Extension Ideas
- The video never shows timings; a benchmark of the three metrics with pre-normalized vs raw vectors would quantify the "speed" claim.
- How to choose when embeddings are not normalized and norms carry signal (e.g. confidence)? Compare cosine vs dot on a labeled retrieval set.
- Teaching ideas: an interactive where a "normalize" toggle makes the three rankings converge; a histogram of pairwise distances as dimension grows; the A/B/C three-way disagreement as a preset.
- Feature scaling for Euclidean (z-score per dimension) is not discussed; the customer example mixes age and income on different scales.

## Tags & Triggers
vector-similarity, cosine-similarity, euclidean-distance, dot-product, vector-search, embeddings, rag, normalization, curse-of-dimensionality, attention, recommendation, metric-choice
- "Should I use cosine, Euclidean or dot product for my embeddings / RAG index?"
- "Why does cosine equal dot product after normalization?"
- "Why do my search results change when I switch metrics?"
- "How does the curse of dimensionality affect nearest-neighbour search?"
- "How do I make cosine similarity safe for zero vectors?"

## Processing Notes
- Transcript: English auto-generated captions via the player's timedtext request (the YouTube transcript panel rendered empty). ASR misspellings ("uklitian", "cosign", "readings" for ratings) normalized in translation.
- Frames: 10 slide frames captured via the browser console channel (chunked ≤14 KB); the video is 10 static slides (scene scan at 4 s steps). Last frame cropped to remove a like/subscribe line.
- No external domains were used for fact-checking; all numeric checks are local computation.

## References
- SH AI Academy, "5. Cosine Similarity vs. Euclidean Distance vs. Dot Product: Choosing the Right Metric for AI Search", YouTube, 2025-09-23, https://www.youtube.com/watch?v=xTaDx3tbYMs (timestamps cited as ~m:ss).
