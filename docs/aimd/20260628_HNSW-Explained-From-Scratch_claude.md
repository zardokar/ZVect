# HNSW Explained from Scratch | The Vector Search Algorithm Behind RAG — AI Is All You Need - Claude Context
> Source: YouTube, AI Is All You Need, "HNSW Explained from Scratch | The Vector Search Algorithm Behind RAG", 61:04, published 2026-06-28 · https://www.youtube.com/watch?v=wyWFLIlgmAw · Generated: 2026-10-12
> Companion: 20260628_HNSW-Explained-From-Scratch.html (Thai, iw mode `iwd`, 9 sections, 7 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite, complete, with fact-check (standard YouTube license).
- Frames used: 01_rag-ann, 02_six-degrees, 03_nsw-example, 04_heaps-ef, 05_skip-list, 06_hnsw-search, 07_mmax-nsw.
- Own SVG diagrams: flow, plane, bars.
- Transcript SHA-256 (in-page = decoded): `5060e47506b1a4fb4efc14bb64de325cb981c7243c2bb178ecdfc1d77c7b83d8`; kept in the session workspace only.

## TL;DR
One-hour from-scratch walkthrough of HNSW (AI Is All You Need), built as NSW + skip list. Why: RAG must fetch the documents nearest a query; exact KNN compares everything and is slow at "billions"; ANN (HNSW one of them) is much faster at a small accuracy cost. NSW: greedy walk over a proximity graph; insertion connects a new node to its M nearest found nodes (example M = 2). Search with a candidate min-heap and a result max-heap of size ef (exploration factor); ef = 1 is pure greedy and can stop in a local minimum (speaker: D at 7; slide and the algorithm: B at 6; either way not E at 2); large ef costs more computation. Skip list: multi-level linked list, levels drawn by coin flips (p = 1/2), P(top level = l) = (1/2)^(l+1), P(present at level l) = p^l; HNSW uses p = 1/M, level = floor(−ln(U)/ln(M)). HNSW = stacked NSW layers searched top-down (example N1(30) → N2(20) → N4(15) → N6(12) → N9(7) → N10(5)), with degree caps Mmax (usually M, upper layers) and Mmax0 (usually 2M, layer 0). Fact-check: six degrees is not from game theory; the search is best-first, not breadth-first; the paper's reason for mL = 1/ln(M) is minimising neighbour overlap between layers, not "same density".

## Key Concepts
- 0:00 HNSW = hierarchical navigable small world; two topics: what/why, how it works. Used in RAG to fetch the documents most similar to a query.
- 1:00 KNN: compare the query with every document, take the top K. Real collections: "billions or more"; one-by-one is too slow → approximate nearest neighbour (ANN): approximately the closest, not guaranteed best; much faster than KNN, "compromise little bit of accuracy". HNSW is one ANN algorithm; it combines NSW and skip lists.
- 3:38 Small world: speaker says it "came from game theory" (six degrees of separation; slide title also says Game Theory). 50 friends each: 50, 2,500, … → ~15.6 billion after six steps vs ~8.3 billion people; speaker notes overlapping friends but keeps the intuition: any person reachable in few steps.
- 7:15 NSW query: start node A (distance 8 to Q), neighbours 7 and 4 → move to 4, then neighbours 0.54 and 4 → 0.54 is the nearest. Rule: check neighbours, move to the best, repeat.
- 10:30 NSW construction with M = 2 (five inserts): second point attaches to the first; C: d(C,A) = 4, neighbour B 3.16 → connect to B and A; D: d(D,A) = 5, neighbours 4 and 1 → connect best two; E: A → C → D, connect the two nearest. M = 1 would connect only one. Insert and query use the same neighbour walk (small-world intuition).
- 15:09 Parameters: M (max connections, insertion), efConstruction, efSearch (ef = exploration factor). Two phases: construction (insertion) and query.
- 16:40 Tools: neighbour expansion (speaker calls it breadth-first search), max-heap (returns max), min-heap (returns min).
- 18:47 Example graph A–B, A–C, B–D, C–E with distances A 10, B 6, C 8, D 7, E 2 (Euclidean, not shown). ef = 5 trace: start A; pop A, push B, C; pop B (6), push D; pop D (7), no neighbours; pop C, push E (max-heap full at 5); pop E; best = E. Min-heap picks what to expand; results come from the max-heap; heap size = ef.
- 23:54 Greedy (ef = 1) path A → B → D returns D (as spoken; the slide shows the walk stopping at B, 6), while E is the global minimum. ef = 2 trace: max-heap keeps 2; B, C replace A; D (7) replaces C (8); C is not expanded because 8 is worse than both kept candidates → answer 7 again (as spoken; the algorithm returns B at 6, see Implementation). ef = number of promising nodes tracked; "as big as possible but … not very big"; in this example ef 1–2 stall, > 2 does not ("for this particular example"); too large → many points explored, more computation; balance.
- 32:13 Skip list: linked list with levels; level 0 has all keys, higher levels fewer. Keys spoken: 3 6 7 9 12 17 19 21 26 (slide: 10 keys incl. 25). Build first, then query (same as NSW and RAG). Search 19: 3 → 17 (< 19) → +∞ → down; 17 → 21 (> 19) → down; → 19 found "within just three steps" instead of 3, 6, 7, 9, 12, 17, 19.
- 37:24 Level by coin flips: heads → go up, until tails. 3: level 3 (spoken "head head tail … after three steps"; notes slide HHHT); 6: T → 0; 7: HHT → 2; 9: HT → 1. P(level 0) 1/2, 1/4, 1/8, 1/16 → P(top = l) = (1/2)^(l+1). Promotion probability 1/2: ideally 10 → 5 → 2.5 per level (actual example counts differ).
- 41:39 Two probabilities: P(top level exactly l) = p^(l+1); P(present at level l) = p^l (1, 1/2, 1/4, 1/8 …; level 0 = 1).
- 45:14 HNSW uses p = 1/M (M = 5 → 1/5 of elements on the next level, 1/25 on the one after). Code: draw a random number in [0,1), below p means "heads", climb; HNSW uses a direct formula (slide: level = floor(−ln(U)/ln(M))). Skip list 1/2, HNSW 1/M.
- 48:12 HNSW = skip-list-like levels where each level is an NSW; upper levels have fewer nodes, ~M times more per level down; same node linked across levels. Search example: L2 start N1(30), neighbours N2(20), N3(25) → N2 local minimum; L1 from N2 → N4(15) → N6(12) (18 visited, 17 worse); L0 neighbours 10 and 7 → 7 → 5 = N10, the global minimum here. Three NSW layers.
- 55:10 NSW has no degree cap (the M = 2 example had a node with four edges); HNSW caps: Mmax, "usually" M, on layers > 0; Mmax0, "usually" 2M, on layer 0 ("very much important for searching"); extra edges pruned (far ones removed). Why p = 1/M (speaker): with ≤ M links per node, shrinking node count by 1/M per layer keeps the density the same (M = 10: 20 nodes below → 2 above).

## Implementation
```python
import math, random, heapq

def random_level(M):                      # slide: level = floor(-ln(U)/ln(M)); paper: mL = 1/ln(M)
    return int(-math.log(1.0 - random.random()) / math.log(M))

def search_layer(q, entry, ef, neighbours, dist):
    """Best-first search used per layer (the video's two heaps).
    candidates: min-heap by distance (what to expand next)
    results:    max-heap of size ef (keeps the ef best; top = current worst)"""
    d0 = dist(q, entry)
    visited = {entry}
    candidates = [(d0, entry)]
    results = [(-d0, entry)]
    while candidates:
        d, c = heapq.heappop(candidates)
        if d > -results[0][0]:            # closest candidate is worse than the worst kept result -> stop
            break
        for n in neighbours(c):
            if n in visited:
                continue
            visited.add(n)
            dn = dist(q, n)
            if len(results) < ef or dn < -results[0][0]:
                heapq.heappush(candidates, (dn, n))
                heapq.heappush(results, (-dn, n))
                if len(results) > ef:
                    heapq.heappop(results)      # drop the farthest
    return sorted((-d, n) for d, n in results)  # nearest first

# Query: from the top layer down to 1 use ef = 1 (greedy), then search layer 0 with efSearch; take the top-k.
# Insert: draw level with random_level(M); greedy descent to that level; on each layer <= level run
# search_layer with efConstruction, connect to M neighbours; cap degree at Mmax = M (layers > 0) and
# Mmax0 = 2M (layer 0), pruning (simple nearest-M or the paper's heuristic).
```
Video example: graph A–B, A–C, B–D, C–E, distances A 10, B 6, C 8, D 7, E 2. This code (run by the author) returns B (6) for ef = 1 and ef = 2 and E (2) for ef = 5. The speaker says ef = 1 ends at D (7) and ef = 2 at 7; the notes slide he scrolls says 7 > 6 so the greedy walk stays at B (6). The point stands: small ef misses E. NSW points A(1,1) B(2,2) C(5,1) D(6,2) E(9,1), query Q(8.5,1.2): true distances A 7.50, B 6.55, C 3.51, D 2.62, E 0.54 (the notes slide reuses E's distances 8.00/7.07/4.00/3.16 for A–D; path A → C → E unchanged).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Collection size motivating ANN | billions | 2:04 |
| Six degrees arithmetic | 50^6 = 15,625,000,000 vs 8.3 bn | 5:12–5:43 |
| NSW query example | 8 → 4 → 0.54 | 8:54–9:58 |
| M in construction example | 2 | 11:02 |
| ef example distances | A 10, B 6, C 8, D 7, E 2 | 18:47 |
| ef = 5 / ef = 1 / ef = 2 | E / speaker D (slide + algorithm B) / speaker 7 (algorithm B) | 21:49–29:34 |
| Skip-list keys | 3 6 7 9 12 17 19 21 (25) 26 | 32:44 |
| Skip-list p | 1/2 | 40:05 |
| P(top = l) | (1/2)^(l+1) | 39:01 |
| P(present at l) | p^l | 45:14 |
| HNSW p | 1/M | 45:44 |
| Level formula (slide) | floor(−ln(U)/ln(M)) | ~47:00 |
| HNSW search example | N1 30 → N2 20 → N4 15 → N6 12 → N9 7 → N10 5 (ef = 4 on slide) | 51:02–54:38 |
| Degree caps | Mmax = M, Mmax0 = 2M | 58:19 |

## Comparisons
| Criterion | KNN | NSW | HNSW |
|---|---|---|---|
| Result | exact | approximate (local minima possible) | approximate |
| Speed at scale | slow | much faster | fast (top-down jumps) |
| Structure | none | single-layer graph | multi-layer graph (skip-list style) |
| Degree cap | n/a | none | M upper / 2M layer 0 |
| Knobs | K | M, ef | M, efConstruction, efSearch, Mmax, Mmax0 |

## Fact Check
9 claims: 2 confirmed, 6 partly, 1 contradicted (subagent web check 2026-10-12; primary source arXiv 1603.09320).
- HNSW authorship (not stated in video): Malkov & Yashunin, arXiv 1603.09320 (Mar 2016), IEEE TPAMI 2020 (online 2018). Confirmed.
- Six degrees "from game theory": contradicted — Karinthy's 1929 story "Chains" (a wager), Milgram 1967, Watts & Strogatz 1998.
- 50^6 and 8.3 bn: confirmed (assumes no overlapping friends; UN ~8.3 bn on 1 Jul 2026).
- NSW connects to M closest, no degree cap: partly (paper description; the 2014 NSW paper could not be opened).
- "Breadth-first search": partly — candidate set + ef-bounded result list correct; the method is greedy/best-first (beam); ef = 1 on upper layers; heaps are an implementation detail.
- Skip list p = 1/2 maths: partly — maths right; Pugh 1989/1990; p = 1/2 or 1/4 both common.
- p = 1/M for "same density": partly — formula right (mL = 1/ln(M) ⇔ p = 1/M), the paper's reason is minimising neighbour overlap between layers.
- Mmax = M, Mmax0 = 2M, pruning: partly — paper recommends Mmax0 = 2M; Mmax = M is common practice; simple vs heuristic neighbour selection.
- HNSW in RAG/MongoDB: partly — Atlas Vector Search uses HNSW; widely used but IVF, DiskANN and others exist.
Also found by the author: ef = 1 and ef = 2 answers are B (6) by the algorithm, not D (7) as spoken; notes-slide NSW distances to Q are distances from E (see Implementation); slide skip-list table repeats "19" where 25 is meant.

## Open Questions & Extension Ideas
- Author note: the result of search_layer is the nearest element of the result list; the max-heap top is the farthest kept (the video's "last point in max heap" wording).
- Author note: the video never shows efSearch vs recall numbers; a measured ef sweep would make the trade-off concrete.
- Teaching ideas: the 5-node ef example (D vs E) is a ready-made local-minimum demo; P(top = l) vs P(present at l) side by side; p = 1/2 vs 1/M level counts.

## Tags & Triggers
hnsw, nsw, ann, knn, small-world, six-degrees, skip-list, ef-search, ef-construction, best-first-search, local-minimum, rag, vector-search, mmax0
- "How does HNSW search work step by step?"
- "What does efSearch / efConstruction change?"
- "Why does HNSW use 1/M (mL = 1/ln M)?"
- "What are Mmax and Mmax0?"
- "Skip list vs HNSW layers?"

## References
- AI Is All You Need, "HNSW Explained from Scratch | The Vector Search Algorithm Behind RAG", YouTube, 2026-06-28, https://www.youtube.com/watch?v=wyWFLIlgmAw
- Malkov & Yashunin, https://arxiv.org/abs/1603.09320
- Wikipedia: https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world , https://en.wikipedia.org/wiki/Six_degrees_of_separation , https://en.wikipedia.org/wiki/Skip_list
- MongoDB Atlas Vector Search: https://www.mongodb.com/docs/atlas/atlas-search/vector-search/
- World population 2026 (UN WPP 2024, via): https://gate.ahram.org.eg/News/5768785.aspx
