# Approximate Nearest Neighbour From Scratch In Python — Claude Context
> Source: YouTube, Sefik Ilkin Serengil, "Approximate Nearest Neighbour From Scratch In Python: Build Your Own Vector Database", 19:06, published 2024-06-23, https://www.youtube.com/watch?v=c10w0Ptn_CU · Generated: 2026-10-10
> Companion: docs/outhtm/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python.html (Thai, interpretive full-detail mode)

## TL;DR
A Jupyter coding walkthrough of an Annoy-style approximate nearest neighbour index (random hyperplane / random projection tree). 1,000 random 2-D vectors in [0, 100] (2-D only so it can be plotted; real embeddings are high-dimensional, e.g. FaceNet 128-d), target (50, 50). Pick two random points, compute the hyperplane equidistant from them (normal = difference, midpoint = average, constant = normal . midpoint), put each vector left or right (n . v > c -> right, else left, ties left), store the hyperplane in a Node, recurse until a group has <= subset_size = 5 vectors. Search walks from the root by side: 9 steps on screen (node sizes 1000, 582, 264, 196, 113, 45, 34, 26, 9), leaf = 3 vectors near (50, 50). The speaker compares against k-NN's 1,000 comparisons: 1000/9 = 111x faster "if the tree is built in advance". Claimed: backbone of many vector DBs, used by Spotify Annoy, millions/billions in milliseconds, high-school math, works in n dimensions. Own re-implementation: mean 9.6 steps, but a single tree's leaf contains the true nearest neighbour only ~70-75% of the time; a 10-tree forest reached 100% on 300 queries.

## Key Concepts
- 0:00 ANN is the backbone of many vector databases and vector indexes; Spotify Annoy uses it to index embeddings; find the nearest among millions or billions in milliseconds; idea is simple (high-school math). (Like/subscribe request removed.)
- 1:04 Data: import random; 1,000 instances; 2-D vectors (real: multi-dimensional, FaceNet 128-d); x = round(random.random() * 100), same for y; list `vectors` of (x, y) tuples (or NumPy arrays). Plot with matplotlib scatter (black, marker x), figure size (10, 10). Points could be Spotify songs or Google-indexed images; precomputed.
- 4:26 Target (50, 50) in red. Visually easy in 2-D, impossible in high dims, so: pick two random points, find the equidistant line (2-D) / plane (3-D) / always a hyperplane, store the equation in a decision tree, put vectors left/right, repeat recursively in each branch.
- 6:44 class Node(hyperplane=None, value=None) with left/right = None. hyperplane_equation(v1, v2): normal = difference, midpoint = (v1 + v2) / 2, constant = np.dot(normal, midpoint) (called "matrix multiplication"); returns (normal, constant). Test on vectors[0] = (23.61, 10.99), vectors[1] = (24.6, 10.35) -> (array([0.99, -0.64]), 17.0351...), i.e. 0.99x - 0.64y = 17.035.
- 9:44 check_vector_side(normal, constant, target): dot > constant -> "right"; less -> "left"; equal (on the hyperplane) treated as left.
- 10:34 build_tree(vectors): two random indices via random.randint(0, len - 1), re-drawn in a while loop while equal (both initialised to 0); hyperplane of the two; classify all vectors into left_nodes/right_nodes using hyperplane[0], hyperplane[1]; current_node = Node(hyperplane, vectors); subset_size = 5; if len(left) > subset_size recurse, else Node(value=left) (no hyperplane); same for right; return current_node. Building is very fast.
- 15:21 Search: while len(tree.value) > subset_size and tree.hyperplane is not None: side = check_vector_side(tree.hyperplane[0], tree.hyperplane[1], v); go left/right, printing len(tree.value). Result in 9 steps; tree.value = [(51, 50.4), (47.96, 46.69), (49.32, 50.52)]. k-NN would compare with all 1,000 (O(1000)); binary tree -> 9 steps -> "111 times faster than k-NN if the tree is built in advance" (screen: 1000/9 = 111.11).
- 17:44 Plot leaf vectors in blue next to the red target: really close; works in n dimensions without visualisation. Closing thanks removed.

## Implementation
Own equivalent (pure Python, run locally 2026-10-10):
```python
import random, math
def hyperplane(v1, v2):
    n = [a - b for a, b in zip(v1, v2)]; mid = [(a + b) / 2 for a, b in zip(v1, v2)]
    return n, sum(a * b for a, b in zip(n, mid))      # n . x = c
def side(n, c, v): return "right" if sum(a * b for a, b in zip(n, v)) > c else "left"
class Node:
    def __init__(self, hp=None, value=None): self.hp, self.value, self.left, self.right = hp, value, None, None
def build(vs, leaf=5):
    i = j = 0
    while i == j: i, j = random.randint(0, len(vs) - 1), random.randint(0, len(vs) - 1)
    hp = hyperplane(vs[i], vs[j])
    L = [v for v in vs if side(*hp, v) == "left"]; R = [v for v in vs if side(*hp, v) == "right"]
    node = Node(hp, vs)
    node.left = build(L, leaf) if len(L) > leaf else Node(value=L)
    node.right = build(R, leaf) if len(R) > leaf else Node(value=R)
    return node
def search(t, q, leaf=5):
    while len(t.value) > leaf and t.hp is not None: t = t.left if side(*t.hp, q) == "left" else t.right
    return t.value
```
Results (1,000 random 2-D points, seed 42, target (50, 50), leaf 5):
| experiment | result |
|---|---|
| 1 tree (seed 7) | 9 steps, leaf 4 vectors, contains true NN (51.47, 49.88) d=1.47 |
| 500 trees, target (50, 50) | steps mean 9.6 (5-15), leaf mean 3.6, recall@1 74.6% |
| 1 tree per query, 300 random queries | recall@1 70.3% |
| 10-tree forest, 300 random queries | recall@1 100%, mean 13.7 candidates |

## Quick Reference
| Item | Value | Time |
|---|---|---|
| data | 1,000 random 2-D vectors in [0, 100] | ~1:14 |
| real-world dims | FaceNet 128 | ~1:41 |
| target | (50, 50) | ~4:33 |
| hyperplane test | (0.99, -0.64), 17.035 | ~9:05 |
| subset size | 5 | ~14:02 |
| search path | 1000-582-264-196-113-45-34-26-9 (9 steps) | ~16:42 |
| leaf | (51, 50.4), (47.96, 46.69), (49.32, 50.52) | ~16:48 |
| speed-up claim | 1000/9 = 111x (tree prebuilt) | ~17:36 |

## Comparisons
| Aspect | k-NN brute force | ANN hyperplane tree |
|---|---|---|
| per-query work | 1,000 comparisons | 9 steps in the video |
| preprocessing | none | build tree first |
| exactness | exact | approximate (leaf only) |

## Corrections / verification
- ASR fixes: "from Secret" = from scratch; "Spotify anoy" = Annoy; "fa net" = FaceNet; "nonp" = NumPy; "K NN/Canon" = k-NN; "17.3" = 17.035 (screen); "is1 times faster" = 111x (screen 1000/9).
- 111x counts tree steps vs vectors; excludes leaf distance checks and the build cost (the speaker states "if built in advance").
- A single tree is not guaranteed to contain the true nearest neighbour (own run: ~25-30% misses); multiple trees fix this (author's understanding of Annoy; Annoy docs not checked in this job).
- np.dot on two 1-D arrays is a dot product, not matrix multiplication. On screen vectors[0] - vectors[1] = (-0.99, 0.64) but output is (0.99, -0.64): the notebook likely subtracts in the other order; direction only swaps left/right labels.

## Open Questions & Extension Ideas
- ZVect "Approximate nearest neighbour" lesson: draw hyperplane splits step by step in 2-D, count steps vs brute force, show single-tree misses; pair with the HNSW report (Lc4dzmSFb14).

## Tags & Triggers
ann, approximate-nearest-neighbor, random-projection-tree, hyperplane, annoy, knn, python, vector-database
- "How to build ANN from scratch in Python?"
- "How to find the hyperplane equidistant from two points?"
- "ANN vs k-NN speed?"
- "Why can a single tree miss, and how do several trees help?"

## Processing Notes
- Mode: interpretive full-detail (standard YouTube license, checked 2026-10-10). English ASR captions (388 lines, SHA-256 d618a026...585f incl. description without social/donation links), kept in the session workspace only. Like/subscribe parts removed.
- 12 frames captured (one recaptured after the 200-message console limit), 9 used, cropped to the notebook/plot area (no browser bookmarks, ads or pop-ups).

## References
- Sefik Ilkin Serengil, "Approximate Nearest Neighbour From Scratch In Python: Build Your Own Vector Database", YouTube, 2024-06-23, https://www.youtube.com/watch?v=c10w0Ptn_CU
- Tutorial linked in the description (not opened): https://sefiks.com/2023/12/31/a-step-by-step-approximate-nearest-neighbor-example-in-python-from-scratch/
